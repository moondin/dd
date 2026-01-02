---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 330
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 330 of 552)

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

---[FILE: src/vs/workbench/browser/parts/editor/diffEditorCommands.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/diffEditorCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { localize, localize2 } from '../../../../nls.js';
import { MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { TextDiffEditor } from './textDiffEditor.js';
import { ActiveCompareEditorCanSwapContext, TextCompareEditorActiveContext, TextCompareEditorVisibleContext } from '../../../common/contextkeys.js';
import { DiffEditorInput } from '../../../common/editor/diffEditorInput.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IUntypedEditorInput } from '../../../common/editor.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { isDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorInput } from '../../../common/editor/editorInput.js';

export const TOGGLE_DIFF_SIDE_BY_SIDE = 'toggle.diff.renderSideBySide';
export const GOTO_NEXT_CHANGE = 'workbench.action.compareEditor.nextChange';
export const GOTO_PREVIOUS_CHANGE = 'workbench.action.compareEditor.previousChange';
export const DIFF_FOCUS_PRIMARY_SIDE = 'workbench.action.compareEditor.focusPrimarySide';
export const DIFF_FOCUS_SECONDARY_SIDE = 'workbench.action.compareEditor.focusSecondarySide';
export const DIFF_FOCUS_OTHER_SIDE = 'workbench.action.compareEditor.focusOtherSide';
export const DIFF_OPEN_SIDE = 'workbench.action.compareEditor.openSide';
export const TOGGLE_DIFF_IGNORE_TRIM_WHITESPACE = 'toggle.diff.ignoreTrimWhitespace';
export const DIFF_SWAP_SIDES = 'workbench.action.compareEditor.swapSides';

export function registerDiffEditorCommands(): void {
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: DIFF_OPEN_SIDE,
		weight: KeybindingWeight.WorkbenchContrib,
		when: EditorContextKeys.inDiffEditor,
		primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.Shift | KeyCode.KeyO),
		handler: async accessor => {
			const editorService = accessor.get(IEditorService);
			const editorGroupsService = accessor.get(IEditorGroupsService);

			const activeEditor = editorService.activeEditor;
			const activeTextEditorControl = editorService.activeTextEditorControl;
			if (!isDiffEditor(activeTextEditorControl) || !(activeEditor instanceof DiffEditorInput)) {
				return;
			}

			let editor: EditorInput | undefined;
			const originalEditor = activeTextEditorControl.getOriginalEditor();
			if (originalEditor.hasTextFocus()) {
				editor = activeEditor.original;
			} else {
				editor = activeEditor.modified;
			}

			return editorGroupsService.activeGroup.openEditor(editor);
		}
	});

	MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
		command: {
			id: DIFF_OPEN_SIDE,
			title: localize2('compare.openSide', 'Open Active Diff Side'),
		}
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: GOTO_NEXT_CHANGE,
		weight: KeybindingWeight.WorkbenchContrib,
		when: TextCompareEditorVisibleContext,
		primary: KeyMod.Alt | KeyCode.F5,
		handler: (accessor, ...args) => navigateInDiffEditor(accessor, args, true)
	});

	MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
		command: {
			id: GOTO_NEXT_CHANGE,
			title: localize2('compare.nextChange', 'Go to Next Change'),
		}
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: GOTO_PREVIOUS_CHANGE,
		weight: KeybindingWeight.WorkbenchContrib,
		when: TextCompareEditorVisibleContext,
		primary: KeyMod.Alt | KeyMod.Shift | KeyCode.F5,
		handler: (accessor, ...args) => navigateInDiffEditor(accessor, args, false)
	});

	MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
		command: {
			id: GOTO_PREVIOUS_CHANGE,
			title: localize2('compare.previousChange', 'Go to Previous Change'),
		}
	});


	function getActiveTextDiffEditor(accessor: ServicesAccessor, args: unknown[]): TextDiffEditor | undefined {
		const editorService = accessor.get(IEditorService);
		const resource = args.length > 0 && args[0] instanceof URI ? args[0] : undefined;

		for (const editor of [editorService.activeEditorPane, ...editorService.visibleEditorPanes]) {
			if (editor instanceof TextDiffEditor && (!resource || editor.input instanceof DiffEditorInput && isEqual(editor.input.primary.resource, resource))) {
				return editor;
			}
		}

		return undefined;
	}

	function navigateInDiffEditor(accessor: ServicesAccessor, args: unknown[], next: boolean): void {
		const activeTextDiffEditor = getActiveTextDiffEditor(accessor, args);

		if (activeTextDiffEditor) {
			activeTextDiffEditor.getControl()?.goToDiff(next ? 'next' : 'previous');
		}
	}

	enum FocusTextDiffEditorMode {
		Original,
		Modified,
		Toggle
	}

	function focusInDiffEditor(accessor: ServicesAccessor, args: unknown[], mode: FocusTextDiffEditorMode): void {
		const activeTextDiffEditor = getActiveTextDiffEditor(accessor, args);

		if (activeTextDiffEditor) {
			switch (mode) {
				case FocusTextDiffEditorMode.Original:
					activeTextDiffEditor.getControl()?.getOriginalEditor().focus();
					break;
				case FocusTextDiffEditorMode.Modified:
					activeTextDiffEditor.getControl()?.getModifiedEditor().focus();
					break;
				case FocusTextDiffEditorMode.Toggle:
					if (activeTextDiffEditor.getControl()?.getModifiedEditor().hasWidgetFocus()) {
						return focusInDiffEditor(accessor, args, FocusTextDiffEditorMode.Original);
					} else {
						return focusInDiffEditor(accessor, args, FocusTextDiffEditorMode.Modified);
					}
			}
		}
	}

	function toggleDiffSideBySide(accessor: ServicesAccessor, args: unknown[]): void {
		const configService = accessor.get(ITextResourceConfigurationService);
		const activeTextDiffEditor = getActiveTextDiffEditor(accessor, args);

		const m = activeTextDiffEditor?.getControl()?.getModifiedEditor()?.getModel();
		if (!m) { return; }

		const key = 'diffEditor.renderSideBySide';
		const val = configService.getValue(m.uri, key);
		configService.updateValue(m.uri, key, !val);
	}

	function toggleDiffIgnoreTrimWhitespace(accessor: ServicesAccessor, args: unknown[]): void {
		const configService = accessor.get(ITextResourceConfigurationService);
		const activeTextDiffEditor = getActiveTextDiffEditor(accessor, args);

		const m = activeTextDiffEditor?.getControl()?.getModifiedEditor()?.getModel();
		if (!m) { return; }

		const key = 'diffEditor.ignoreTrimWhitespace';
		const val = configService.getValue(m.uri, key);
		configService.updateValue(m.uri, key, !val);
	}

	async function swapDiffSides(accessor: ServicesAccessor, args: unknown[]): Promise<void> {
		const editorService = accessor.get(IEditorService);

		const diffEditor = getActiveTextDiffEditor(accessor, args);
		const activeGroup = diffEditor?.group;
		const diffInput = diffEditor?.input;
		if (!diffEditor || typeof activeGroup === 'undefined' || !(diffInput instanceof DiffEditorInput) || !diffInput.modified.resource) {
			return;
		}

		const untypedDiffInput = diffInput.toUntyped({ preserveViewState: activeGroup.id, preserveResource: true });
		if (!untypedDiffInput) {
			return;
		}

		// Since we are about to replace the diff editor, make
		// sure to first open the modified side if it is not
		// yet opened. This ensures that the swapping is not
		// bringing up a confirmation dialog to save.
		if (diffInput.modified.isModified() && editorService.findEditors({ resource: diffInput.modified.resource, typeId: diffInput.modified.typeId, editorId: diffInput.modified.editorId }).length === 0) {
			const editorToOpen: IUntypedEditorInput = { ...untypedDiffInput.modified };
			if (!editorToOpen.options) {
				editorToOpen.options = {};
			}
			editorToOpen.options.pinned = true;
			editorToOpen.options.inactive = true;

			await editorService.openEditor(editorToOpen, activeGroup);
		}

		// Replace the input with the swapped variant
		await editorService.replaceEditors([
			{
				editor: diffInput,
				replacement: {
					...untypedDiffInput,
					original: untypedDiffInput.modified,
					modified: untypedDiffInput.original,
					options: {
						...untypedDiffInput.options,
						pinned: true
					}
				}
			}
		], activeGroup);
	}

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: TOGGLE_DIFF_SIDE_BY_SIDE,
		weight: KeybindingWeight.WorkbenchContrib,
		when: undefined,
		primary: undefined,
		handler: (accessor, ...args) => toggleDiffSideBySide(accessor, args)
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: DIFF_FOCUS_PRIMARY_SIDE,
		weight: KeybindingWeight.WorkbenchContrib,
		when: undefined,
		primary: undefined,
		handler: (accessor, ...args) => focusInDiffEditor(accessor, args, FocusTextDiffEditorMode.Modified)
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: DIFF_FOCUS_SECONDARY_SIDE,
		weight: KeybindingWeight.WorkbenchContrib,
		when: undefined,
		primary: undefined,
		handler: (accessor, ...args) => focusInDiffEditor(accessor, args, FocusTextDiffEditorMode.Original)
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: DIFF_FOCUS_OTHER_SIDE,
		weight: KeybindingWeight.WorkbenchContrib,
		when: undefined,
		primary: undefined,
		handler: (accessor, ...args) => focusInDiffEditor(accessor, args, FocusTextDiffEditorMode.Toggle)
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: TOGGLE_DIFF_IGNORE_TRIM_WHITESPACE,
		weight: KeybindingWeight.WorkbenchContrib,
		when: undefined,
		primary: undefined,
		handler: (accessor, ...args) => toggleDiffIgnoreTrimWhitespace(accessor, args)
	});

	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: DIFF_SWAP_SIDES,
		weight: KeybindingWeight.WorkbenchContrib,
		when: undefined,
		primary: undefined,
		handler: (accessor, ...args) => swapDiffSides(accessor, args)
	});

	MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
		command: {
			id: TOGGLE_DIFF_SIDE_BY_SIDE,
			title: localize2('toggleInlineView', "Toggle Inline View"),
			category: localize('compare', "Compare")
		},
		when: TextCompareEditorActiveContext
	});

	MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
		command: {
			id: DIFF_SWAP_SIDES,
			title: localize2('swapDiffSides', "Swap Left and Right Editor Side"),
			category: localize('compare', "Compare")
		},
		when: ContextKeyExpr.and(TextCompareEditorActiveContext, ActiveCompareEditorCanSwapContext)
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/editor.contribution.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/editor.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../../../platform/registry/common/platform.js';
import { localize, localize2 } from '../../../../nls.js';
import { IEditorPaneRegistry, EditorPaneDescriptor } from '../../editor.js';
import { IEditorFactoryRegistry, EditorExtensions } from '../../../common/editor.js';
import {
	TextCompareEditorActiveContext, ActiveEditorPinnedContext, EditorGroupEditorsCountContext, ActiveEditorStickyContext, ActiveEditorAvailableEditorIdsContext,
	EditorPartMultipleEditorGroupsContext, ActiveEditorDirtyContext, ActiveEditorGroupLockedContext, ActiveEditorCanSplitInGroupContext, SideBySideEditorActiveContext,
	EditorTabsVisibleContext, ActiveEditorLastInGroupContext, EditorPartMaximizedEditorGroupContext, MultipleEditorGroupsContext, InEditorZenModeContext,
	IsAuxiliaryWindowContext, ActiveCompareEditorCanSwapContext, MultipleEditorsSelectedInGroupContext, SplitEditorsVertically
} from '../../../common/contextkeys.js';
import { SideBySideEditorInput, SideBySideEditorInputSerializer } from '../../../common/editor/sideBySideEditorInput.js';
import { TextResourceEditor } from './textResourceEditor.js';
import { SideBySideEditor } from './sideBySideEditor.js';
import { DiffEditorInput, DiffEditorInputSerializer } from '../../../common/editor/diffEditorInput.js';
import { UntitledTextEditorInput } from '../../../services/untitled/common/untitledTextEditorInput.js';
import { TextResourceEditorInput } from '../../../common/editor/textResourceEditorInput.js';
import { TextDiffEditor } from './textDiffEditor.js';
import { BinaryResourceDiffEditor } from './binaryDiffEditor.js';
import { ChangeEncodingAction, ChangeEOLAction, ChangeLanguageAction, EditorStatusContribution } from './editorStatus.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { MenuRegistry, MenuId, IMenuItem, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { KeyMod, KeyCode } from '../../../../base/common/keyCodes.js';
import {
	CloseEditorsInOtherGroupsAction, CloseAllEditorsAction, MoveGroupLeftAction, MoveGroupRightAction, SplitEditorAction, JoinTwoGroupsAction, RevertAndCloseEditorAction,
	NavigateBetweenGroupsAction, FocusActiveGroupAction, FocusFirstGroupAction, ResetGroupSizesAction, MinimizeOtherGroupsAction, FocusPreviousGroup, FocusNextGroup,
	CloseLeftEditorsInGroupAction, OpenNextEditor, OpenPreviousEditor, NavigateBackwardsAction, NavigateForwardAction, NavigatePreviousAction, ReopenClosedEditorAction,
	QuickAccessPreviousRecentlyUsedEditorInGroupAction, QuickAccessPreviousEditorFromHistoryAction, ShowAllEditorsByAppearanceAction, ClearEditorHistoryAction, MoveEditorRightInGroupAction, OpenNextEditorInGroup,
	OpenPreviousEditorInGroup, OpenNextRecentlyUsedEditorAction, OpenPreviousRecentlyUsedEditorAction, MoveEditorToPreviousGroupAction,
	MoveEditorToNextGroupAction, MoveEditorToFirstGroupAction, MoveEditorLeftInGroupAction, ClearRecentFilesAction, OpenLastEditorInGroup,
	ShowEditorsInActiveGroupByMostRecentlyUsedAction, MoveEditorToLastGroupAction, OpenFirstEditorInGroup, MoveGroupUpAction, MoveGroupDownAction, FocusLastGroupAction, SplitEditorLeftAction, SplitEditorRightAction,
	SplitEditorUpAction, SplitEditorDownAction, MoveEditorToLeftGroupAction, MoveEditorToRightGroupAction, MoveEditorToAboveGroupAction, MoveEditorToBelowGroupAction, CloseAllEditorGroupsAction,
	JoinAllGroupsAction, FocusLeftGroup, FocusAboveGroup, FocusRightGroup, FocusBelowGroup, EditorLayoutSingleAction, EditorLayoutTwoColumnsAction, EditorLayoutThreeColumnsAction, EditorLayoutTwoByTwoGridAction,
	EditorLayoutTwoRowsAction, EditorLayoutThreeRowsAction, EditorLayoutTwoColumnsBottomAction, EditorLayoutTwoRowsRightAction, NewEditorGroupLeftAction, NewEditorGroupRightAction,
	NewEditorGroupAboveAction, NewEditorGroupBelowAction, SplitEditorOrthogonalAction, CloseEditorInAllGroupsAction, NavigateToLastEditLocationAction, ToggleGroupSizesAction, ShowAllEditorsByMostRecentlyUsedAction,
	QuickAccessPreviousRecentlyUsedEditorAction, OpenPreviousRecentlyUsedEditorInGroupAction, OpenNextRecentlyUsedEditorInGroupAction, QuickAccessLeastRecentlyUsedEditorAction, QuickAccessLeastRecentlyUsedEditorInGroupAction,
	ReOpenInTextEditorAction, DuplicateGroupDownAction, DuplicateGroupLeftAction, DuplicateGroupRightAction, DuplicateGroupUpAction, ToggleEditorTypeAction, SplitEditorToAboveGroupAction, SplitEditorToBelowGroupAction,
	SplitEditorToFirstGroupAction, SplitEditorToLastGroupAction, SplitEditorToLeftGroupAction, SplitEditorToNextGroupAction, SplitEditorToPreviousGroupAction, SplitEditorToRightGroupAction, NavigateForwardInEditsAction,
	NavigateBackwardsInEditsAction, NavigateForwardInNavigationsAction, NavigateBackwardsInNavigationsAction, NavigatePreviousInNavigationsAction, NavigatePreviousInEditsAction, NavigateToLastNavigationLocationAction,
	MaximizeGroupHideSidebarAction, MoveEditorToNewWindowAction, CopyEditorToNewindowAction, RestoreEditorsToMainWindowAction, ToggleMaximizeEditorGroupAction, MinimizeOtherGroupsHideSidebarAction, CopyEditorGroupToNewWindowAction,
	MoveEditorGroupToNewWindowAction, NewEmptyEditorWindowAction,
	ClearEditorHistoryWithoutConfirmAction
} from './editorActions.js';
import {
	CLOSE_EDITORS_AND_GROUP_COMMAND_ID, CLOSE_EDITORS_IN_GROUP_COMMAND_ID, CLOSE_EDITORS_TO_THE_RIGHT_COMMAND_ID, CLOSE_EDITOR_COMMAND_ID, CLOSE_EDITOR_GROUP_COMMAND_ID, CLOSE_OTHER_EDITORS_IN_GROUP_COMMAND_ID,
	CLOSE_PINNED_EDITOR_COMMAND_ID, CLOSE_SAVED_EDITORS_COMMAND_ID, KEEP_EDITOR_COMMAND_ID, PIN_EDITOR_COMMAND_ID, SHOW_EDITORS_IN_GROUP, SPLIT_EDITOR_DOWN, SPLIT_EDITOR_LEFT,
	SPLIT_EDITOR_RIGHT, SPLIT_EDITOR_UP, TOGGLE_KEEP_EDITORS_COMMAND_ID, UNPIN_EDITOR_COMMAND_ID, setup as registerEditorCommands, REOPEN_WITH_COMMAND_ID,
	TOGGLE_LOCK_GROUP_COMMAND_ID, UNLOCK_GROUP_COMMAND_ID, SPLIT_EDITOR_IN_GROUP, JOIN_EDITOR_IN_GROUP, FOCUS_FIRST_SIDE_EDITOR, FOCUS_SECOND_SIDE_EDITOR, TOGGLE_SPLIT_EDITOR_IN_GROUP_LAYOUT, LOCK_GROUP_COMMAND_ID,
	SPLIT_EDITOR, TOGGLE_MAXIMIZE_EDITOR_GROUP, MOVE_EDITOR_INTO_NEW_WINDOW_COMMAND_ID, COPY_EDITOR_INTO_NEW_WINDOW_COMMAND_ID, MOVE_EDITOR_GROUP_INTO_NEW_WINDOW_COMMAND_ID, COPY_EDITOR_GROUP_INTO_NEW_WINDOW_COMMAND_ID,
	NEW_EMPTY_EDITOR_WINDOW_COMMAND_ID, MOVE_EDITOR_INTO_RIGHT_GROUP, MOVE_EDITOR_INTO_LEFT_GROUP, MOVE_EDITOR_INTO_ABOVE_GROUP, MOVE_EDITOR_INTO_BELOW_GROUP
} from './editorCommands.js';
import { GOTO_NEXT_CHANGE, GOTO_PREVIOUS_CHANGE, TOGGLE_DIFF_IGNORE_TRIM_WHITESPACE, TOGGLE_DIFF_SIDE_BY_SIDE, DIFF_SWAP_SIDES } from './diffEditorCommands.js';
import { inQuickPickContext, getQuickNavigateHandler } from '../../quickaccess.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ContextKeyExpr, ContextKeyExpression } from '../../../../platform/contextkey/common/contextkey.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { EditorAutoSave } from './editorAutoSave.js';
import { IQuickAccessRegistry, Extensions as QuickAccessExtensions } from '../../../../platform/quickinput/common/quickAccess.js';
import { ActiveGroupEditorsByMostRecentlyUsedQuickAccess, AllEditorsByAppearanceQuickAccess, AllEditorsByMostRecentlyUsedQuickAccess } from './editorQuickAccess.js';
import { FileAccess } from '../../../../base/common/network.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { UntitledTextEditorInputSerializer, UntitledTextEditorWorkingCopyEditorHandler } from '../../../services/untitled/common/untitledTextEditorHandler.js';
import { DynamicEditorConfigurations } from './editorConfiguration.js';
import { ConfigureEditorAction, ConfigureEditorTabsAction, EditorActionsDefaultAction, EditorActionsTitleBarAction, HideEditorActionsAction, HideEditorTabsAction, ShowMultipleEditorTabsAction, ShowSingleEditorTabAction, ZenHideEditorTabsAction, ZenShowMultipleEditorTabsAction, ZenShowSingleEditorTabAction } from '../../actions/layoutActions.js';
import { ICommandAction } from '../../../../platform/action/common/action.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { getFontSnippets } from '../../../../base/browser/fonts.js';
import { registerEditorFontConfigurations } from '../../../../editor/common/config/editorConfigurationSchema.js';

//#region Editor Registrations

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		TextResourceEditor,
		TextResourceEditor.ID,
		localize('textEditor', "Text Editor"),
	),
	[
		new SyncDescriptor(UntitledTextEditorInput),
		new SyncDescriptor(TextResourceEditorInput)
	]
);

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		TextDiffEditor,
		TextDiffEditor.ID,
		localize('textDiffEditor', "Text Diff Editor")
	),
	[
		new SyncDescriptor(DiffEditorInput)
	]
);

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		BinaryResourceDiffEditor,
		BinaryResourceDiffEditor.ID,
		localize('binaryDiffEditor', "Binary Diff Editor")
	),
	[
		new SyncDescriptor(DiffEditorInput)
	]
);

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		SideBySideEditor,
		SideBySideEditor.ID,
		localize('sideBySideEditor', "Side by Side Editor")
	),
	[
		new SyncDescriptor(SideBySideEditorInput)
	]
);

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(UntitledTextEditorInput.ID, UntitledTextEditorInputSerializer);
Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(SideBySideEditorInput.ID, SideBySideEditorInputSerializer);
Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(DiffEditorInput.ID, DiffEditorInputSerializer);

//#endregion

//#region Workbench Contributions

registerWorkbenchContribution2(EditorAutoSave.ID, EditorAutoSave, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(EditorStatusContribution.ID, EditorStatusContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(UntitledTextEditorWorkingCopyEditorHandler.ID, UntitledTextEditorWorkingCopyEditorHandler, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(DynamicEditorConfigurations.ID, DynamicEditorConfigurations, WorkbenchPhase.BlockRestore);

//#endregion

//#region Quick Access

const quickAccessRegistry = Registry.as<IQuickAccessRegistry>(QuickAccessExtensions.Quickaccess);
const editorPickerContextKey = 'inEditorsPicker';
const editorPickerContext = ContextKeyExpr.and(inQuickPickContext, ContextKeyExpr.has(editorPickerContextKey));

quickAccessRegistry.registerQuickAccessProvider({
	ctor: ActiveGroupEditorsByMostRecentlyUsedQuickAccess,
	prefix: ActiveGroupEditorsByMostRecentlyUsedQuickAccess.PREFIX,
	contextKey: editorPickerContextKey,
	placeholder: localize('editorQuickAccessPlaceholder', "Type the name of an editor to open it."),
	helpEntries: [{ description: localize('activeGroupEditorsByMostRecentlyUsedQuickAccess', "Show Editors in Active Group by Most Recently Used"), commandId: ShowEditorsInActiveGroupByMostRecentlyUsedAction.ID }]
});

quickAccessRegistry.registerQuickAccessProvider({
	ctor: AllEditorsByAppearanceQuickAccess,
	prefix: AllEditorsByAppearanceQuickAccess.PREFIX,
	contextKey: editorPickerContextKey,
	placeholder: localize('editorQuickAccessPlaceholder', "Type the name of an editor to open it."),
	helpEntries: [{ description: localize('allEditorsByAppearanceQuickAccess', "Show All Opened Editors By Appearance"), commandId: ShowAllEditorsByAppearanceAction.ID }]
});

quickAccessRegistry.registerQuickAccessProvider({
	ctor: AllEditorsByMostRecentlyUsedQuickAccess,
	prefix: AllEditorsByMostRecentlyUsedQuickAccess.PREFIX,
	contextKey: editorPickerContextKey,
	placeholder: localize('editorQuickAccessPlaceholder', "Type the name of an editor to open it."),
	helpEntries: [{ description: localize('allEditorsByMostRecentlyUsedQuickAccess', "Show All Opened Editors By Most Recently Used"), commandId: ShowAllEditorsByMostRecentlyUsedAction.ID }]
});

//#endregion

//#region Actions & Commands

registerAction2(ChangeLanguageAction);
registerAction2(ChangeEOLAction);
registerAction2(ChangeEncodingAction);

registerAction2(NavigateForwardAction);
registerAction2(NavigateBackwardsAction);

registerAction2(OpenNextEditor);
registerAction2(OpenPreviousEditor);
registerAction2(OpenNextEditorInGroup);
registerAction2(OpenPreviousEditorInGroup);
registerAction2(OpenFirstEditorInGroup);
registerAction2(OpenLastEditorInGroup);

registerAction2(OpenNextRecentlyUsedEditorAction);
registerAction2(OpenPreviousRecentlyUsedEditorAction);
registerAction2(OpenNextRecentlyUsedEditorInGroupAction);
registerAction2(OpenPreviousRecentlyUsedEditorInGroupAction);

registerAction2(ReopenClosedEditorAction);
registerAction2(ClearRecentFilesAction);

registerAction2(ShowAllEditorsByAppearanceAction);
registerAction2(ShowAllEditorsByMostRecentlyUsedAction);
registerAction2(ShowEditorsInActiveGroupByMostRecentlyUsedAction);

registerAction2(CloseAllEditorsAction);
registerAction2(CloseAllEditorGroupsAction);
registerAction2(CloseLeftEditorsInGroupAction);
registerAction2(CloseEditorsInOtherGroupsAction);
registerAction2(CloseEditorInAllGroupsAction);
registerAction2(RevertAndCloseEditorAction);

registerAction2(SplitEditorAction);
registerAction2(SplitEditorOrthogonalAction);

registerAction2(SplitEditorLeftAction);
registerAction2(SplitEditorRightAction);
registerAction2(SplitEditorUpAction);
registerAction2(SplitEditorDownAction);

registerAction2(JoinTwoGroupsAction);
registerAction2(JoinAllGroupsAction);

registerAction2(NavigateBetweenGroupsAction);

registerAction2(ResetGroupSizesAction);
registerAction2(ToggleGroupSizesAction);
registerAction2(MaximizeGroupHideSidebarAction);
registerAction2(ToggleMaximizeEditorGroupAction);
registerAction2(MinimizeOtherGroupsAction);
registerAction2(MinimizeOtherGroupsHideSidebarAction);

registerAction2(MoveEditorLeftInGroupAction);
registerAction2(MoveEditorRightInGroupAction);

registerAction2(MoveGroupLeftAction);
registerAction2(MoveGroupRightAction);
registerAction2(MoveGroupUpAction);
registerAction2(MoveGroupDownAction);

registerAction2(DuplicateGroupLeftAction);
registerAction2(DuplicateGroupRightAction);
registerAction2(DuplicateGroupUpAction);
registerAction2(DuplicateGroupDownAction);

registerAction2(MoveEditorToPreviousGroupAction);
registerAction2(MoveEditorToNextGroupAction);
registerAction2(MoveEditorToFirstGroupAction);
registerAction2(MoveEditorToLastGroupAction);
registerAction2(MoveEditorToLeftGroupAction);
registerAction2(MoveEditorToRightGroupAction);
registerAction2(MoveEditorToAboveGroupAction);
registerAction2(MoveEditorToBelowGroupAction);

registerAction2(SplitEditorToPreviousGroupAction);
registerAction2(SplitEditorToNextGroupAction);
registerAction2(SplitEditorToFirstGroupAction);
registerAction2(SplitEditorToLastGroupAction);
registerAction2(SplitEditorToLeftGroupAction);
registerAction2(SplitEditorToRightGroupAction);
registerAction2(SplitEditorToAboveGroupAction);
registerAction2(SplitEditorToBelowGroupAction);

registerAction2(FocusActiveGroupAction);
registerAction2(FocusFirstGroupAction);
registerAction2(FocusLastGroupAction);
registerAction2(FocusPreviousGroup);
registerAction2(FocusNextGroup);
registerAction2(FocusLeftGroup);
registerAction2(FocusRightGroup);
registerAction2(FocusAboveGroup);
registerAction2(FocusBelowGroup);

registerAction2(NewEditorGroupLeftAction);
registerAction2(NewEditorGroupRightAction);
registerAction2(NewEditorGroupAboveAction);
registerAction2(NewEditorGroupBelowAction);

registerAction2(NavigatePreviousAction);
registerAction2(NavigateForwardInEditsAction);
registerAction2(NavigateBackwardsInEditsAction);
registerAction2(NavigatePreviousInEditsAction);
registerAction2(NavigateToLastEditLocationAction);
registerAction2(NavigateForwardInNavigationsAction);
registerAction2(NavigateBackwardsInNavigationsAction);
registerAction2(NavigatePreviousInNavigationsAction);
registerAction2(NavigateToLastNavigationLocationAction);
registerAction2(ClearEditorHistoryAction);
registerAction2(ClearEditorHistoryWithoutConfirmAction);

registerAction2(EditorLayoutSingleAction);
registerAction2(EditorLayoutTwoColumnsAction);
registerAction2(EditorLayoutThreeColumnsAction);
registerAction2(EditorLayoutTwoRowsAction);
registerAction2(EditorLayoutThreeRowsAction);
registerAction2(EditorLayoutTwoByTwoGridAction);
registerAction2(EditorLayoutTwoRowsRightAction);
registerAction2(EditorLayoutTwoColumnsBottomAction);

registerAction2(ToggleEditorTypeAction);
registerAction2(ReOpenInTextEditorAction);

registerAction2(QuickAccessPreviousRecentlyUsedEditorAction);
registerAction2(QuickAccessLeastRecentlyUsedEditorAction);
registerAction2(QuickAccessPreviousRecentlyUsedEditorInGroupAction);
registerAction2(QuickAccessLeastRecentlyUsedEditorInGroupAction);
registerAction2(QuickAccessPreviousEditorFromHistoryAction);

registerAction2(MoveEditorToNewWindowAction);
registerAction2(CopyEditorToNewindowAction);
registerAction2(MoveEditorGroupToNewWindowAction);
registerAction2(CopyEditorGroupToNewWindowAction);
registerAction2(RestoreEditorsToMainWindowAction);
registerAction2(NewEmptyEditorWindowAction);

const quickAccessNavigateNextInEditorPickerId = 'workbench.action.quickOpenNavigateNextInEditorPicker';
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: quickAccessNavigateNextInEditorPickerId,
	weight: KeybindingWeight.WorkbenchContrib + 50,
	handler: getQuickNavigateHandler(quickAccessNavigateNextInEditorPickerId, true),
	when: editorPickerContext,
	primary: KeyMod.CtrlCmd | KeyCode.Tab,
	mac: { primary: KeyMod.WinCtrl | KeyCode.Tab }
});

const quickAccessNavigatePreviousInEditorPickerId = 'workbench.action.quickOpenNavigatePreviousInEditorPicker';
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: quickAccessNavigatePreviousInEditorPickerId,
	weight: KeybindingWeight.WorkbenchContrib + 50,
	handler: getQuickNavigateHandler(quickAccessNavigatePreviousInEditorPickerId, false),
	when: editorPickerContext,
	primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Tab,
	mac: { primary: KeyMod.WinCtrl | KeyMod.Shift | KeyCode.Tab }
});

registerEditorCommands();

//#endregion

//#region Menus

// macOS: Touchbar
if (isMacintosh) {
	MenuRegistry.appendMenuItem(MenuId.TouchBarContext, {
		command: { id: NavigateBackwardsAction.ID, title: NavigateBackwardsAction.LABEL, icon: { dark: FileAccess.asFileUri('vs/workbench/browser/parts/editor/media/back-tb.png') } },
		group: 'navigation',
		order: 0
	});

	MenuRegistry.appendMenuItem(MenuId.TouchBarContext, {
		command: { id: NavigateForwardAction.ID, title: NavigateForwardAction.LABEL, icon: { dark: FileAccess.asFileUri('vs/workbench/browser/parts/editor/media/forward-tb.png') } },
		group: 'navigation',
		order: 1
	});
}

// Empty Editor Group Toolbar
MenuRegistry.appendMenuItem(MenuId.EmptyEditorGroup, { command: { id: LOCK_GROUP_COMMAND_ID, title: localize('lockGroupAction', "Lock Group"), icon: Codicon.unlock }, group: 'navigation', order: 10, when: ContextKeyExpr.and(IsAuxiliaryWindowContext, ActiveEditorGroupLockedContext.toNegated()) });
MenuRegistry.appendMenuItem(MenuId.EmptyEditorGroup, { command: { id: UNLOCK_GROUP_COMMAND_ID, title: localize('unlockGroupAction', "Unlock Group"), icon: Codicon.lock, toggled: ContextKeyExpr.true() }, group: 'navigation', order: 10, when: ActiveEditorGroupLockedContext });
MenuRegistry.appendMenuItem(MenuId.EmptyEditorGroup, { command: { id: CLOSE_EDITOR_GROUP_COMMAND_ID, title: localize('closeGroupAction', "Close Group"), icon: Codicon.close }, group: 'navigation', order: 20, when: ContextKeyExpr.or(IsAuxiliaryWindowContext, EditorPartMultipleEditorGroupsContext) });

// Empty Editor Group Context Menu
MenuRegistry.appendMenuItem(MenuId.EmptyEditorGroupContext, { command: { id: SPLIT_EDITOR_UP, title: localize('splitUp', "Split Up") }, group: '2_split', order: 10 });
MenuRegistry.appendMenuItem(MenuId.EmptyEditorGroupContext, { command: { id: SPLIT_EDITOR_DOWN, title: localize('splitDown', "Split Down") }, group: '2_split', order: 20 });
MenuRegistry.appendMenuItem(MenuId.EmptyEditorGroupContext, { command: { id: SPLIT_EDITOR_LEFT, title: localize('splitLeft', "Split Left") }, group: '2_split', order: 30 });
MenuRegistry.appendMenuItem(MenuId.EmptyEditorGroupContext, { command: { id: SPLIT_EDITOR_RIGHT, title: localize('splitRight', "Split Right") }, group: '2_split', order: 40 });
MenuRegistry.appendMenuItem(MenuId.EmptyEditorGroupContext, { command: { id: NEW_EMPTY_EDITOR_WINDOW_COMMAND_ID, title: localize('newWindow', "New Window") }, group: '3_window', order: 10 });
MenuRegistry.appendMenuItem(MenuId.EmptyEditorGroupContext, { command: { id: TOGGLE_LOCK_GROUP_COMMAND_ID, title: localize('toggleLockGroup', "Lock Group"), toggled: ActiveEditorGroupLockedContext }, group: '4_lock', order: 10, when: IsAuxiliaryWindowContext.toNegated() /* already a primary action for aux windows */ });
MenuRegistry.appendMenuItem(MenuId.EmptyEditorGroupContext, { command: { id: CLOSE_EDITOR_GROUP_COMMAND_ID, title: localize('close', "Close") }, group: '5_close', order: 10, when: MultipleEditorGroupsContext });

// Editor Tab Container Context Menu
MenuRegistry.appendMenuItem(MenuId.EditorTabsBarContext, { command: { id: SPLIT_EDITOR_UP, title: localize('splitUp', "Split Up") }, group: '2_split', order: 10 });
MenuRegistry.appendMenuItem(MenuId.EditorTabsBarContext, { command: { id: SPLIT_EDITOR_DOWN, title: localize('splitDown', "Split Down") }, group: '2_split', order: 20 });
MenuRegistry.appendMenuItem(MenuId.EditorTabsBarContext, { command: { id: SPLIT_EDITOR_LEFT, title: localize('splitLeft', "Split Left") }, group: '2_split', order: 30 });
MenuRegistry.appendMenuItem(MenuId.EditorTabsBarContext, { command: { id: SPLIT_EDITOR_RIGHT, title: localize('splitRight', "Split Right") }, group: '2_split', order: 40 });

MenuRegistry.appendMenuItem(MenuId.EditorTabsBarContext, { command: { id: MOVE_EDITOR_GROUP_INTO_NEW_WINDOW_COMMAND_ID, title: localize('moveEditorGroupToNewWindow', "Move into New Window") }, group: '3_window', order: 10 });
MenuRegistry.appendMenuItem(MenuId.EditorTabsBarContext, { command: { id: COPY_EDITOR_GROUP_INTO_NEW_WINDOW_COMMAND_ID, title: localize('copyEditorGroupToNewWindow', "Copy into New Window") }, group: '3_window', order: 20 });

MenuRegistry.appendMenuItem(MenuId.EditorTabsBarContext, { submenu: MenuId.EditorTabsBarShowTabsSubmenu, title: localize('tabBar', "Tab Bar"), group: '4_config', order: 10, when: InEditorZenModeContext.negate() });
MenuRegistry.appendMenuItem(MenuId.EditorTabsBarShowTabsSubmenu, { command: { id: ShowMultipleEditorTabsAction.ID, title: localize('multipleTabs', "Multiple Tabs"), toggled: ContextKeyExpr.equals('config.workbench.editor.showTabs', 'multiple') }, group: '1_config', order: 10 });
MenuRegistry.appendMenuItem(MenuId.EditorTabsBarShowTabsSubmenu, { command: { id: ShowSingleEditorTabAction.ID, title: localize('singleTab', "Single Tab"), toggled: ContextKeyExpr.equals('config.workbench.editor.showTabs', 'single') }, group: '1_config', order: 20 });
MenuRegistry.appendMenuItem(MenuId.EditorTabsBarShowTabsSubmenu, { command: { id: HideEditorTabsAction.ID, title: localize('hideTabs', "Hidden"), toggled: ContextKeyExpr.equals('config.workbench.editor.showTabs', 'none') }, group: '1_config', order: 30 });

MenuRegistry.appendMenuItem(MenuId.EditorTabsBarContext, { submenu: MenuId.EditorTabsBarShowTabsZenModeSubmenu, title: localize('tabBar', "Tab Bar"), group: '4_config', order: 10, when: InEditorZenModeContext });
MenuRegistry.appendMenuItem(MenuId.EditorTabsBarShowTabsZenModeSubmenu, { command: { id: ZenShowMultipleEditorTabsAction.ID, title: localize('multipleTabs', "Multiple Tabs"), toggled: ContextKeyExpr.equals('config.zenMode.showTabs', 'multiple') }, group: '1_config', order: 10 });
MenuRegistry.appendMenuItem(MenuId.EditorTabsBarShowTabsZenModeSubmenu, { command: { id: ZenShowSingleEditorTabAction.ID, title: localize('singleTab', "Single Tab"), toggled: ContextKeyExpr.equals('config.zenMode.showTabs', 'single') }, group: '1_config', order: 20 });
MenuRegistry.appendMenuItem(MenuId.EditorTabsBarShowTabsZenModeSubmenu, { command: { id: ZenHideEditorTabsAction.ID, title: localize('hideTabs', "Hidden"), toggled: ContextKeyExpr.equals('config.zenMode.showTabs', 'none') }, group: '1_config', order: 30 });

MenuRegistry.appendMenuItem(MenuId.EditorTabsBarContext, { submenu: MenuId.EditorActionsPositionSubmenu, title: localize('editorActionsPosition', "Editor Actions Position"), group: '4_config', order: 20 });
MenuRegistry.appendMenuItem(MenuId.EditorActionsPositionSubmenu, { command: { id: EditorActionsDefaultAction.ID, title: localize('tabBar', "Tab Bar"), toggled: ContextKeyExpr.equals('config.workbench.editor.editorActionsLocation', 'default') }, group: '1_config', order: 10, when: ContextKeyExpr.equals('config.workbench.editor.showTabs', 'none').negate() });
MenuRegistry.appendMenuItem(MenuId.EditorActionsPositionSubmenu, { command: { id: EditorActionsTitleBarAction.ID, title: localize('titleBar', "Title Bar"), toggled: ContextKeyExpr.or(ContextKeyExpr.equals('config.workbench.editor.editorActionsLocation', 'titleBar'), ContextKeyExpr.and(ContextKeyExpr.equals('config.workbench.editor.showTabs', 'none'), ContextKeyExpr.equals('config.workbench.editor.editorActionsLocation', 'default'))) }, group: '1_config', order: 20 });
MenuRegistry.appendMenuItem(MenuId.EditorActionsPositionSubmenu, { command: { id: HideEditorActionsAction.ID, title: localize('hidden', "Hidden"), toggled: ContextKeyExpr.equals('config.workbench.editor.editorActionsLocation', 'hidden') }, group: '1_config', order: 30 });

MenuRegistry.appendMenuItem(MenuId.EditorTabsBarContext, { command: { id: ConfigureEditorTabsAction.ID, title: localize('configureTabs', "Configure Tabs") }, group: '9_configure', order: 10 });

// Editor Title Context Menu
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: CLOSE_EDITOR_COMMAND_ID, title: localize('close', "Close") }, group: '1_close', order: 10 });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: CLOSE_OTHER_EDITORS_IN_GROUP_COMMAND_ID, title: localize('closeOthers', "Close Others"), precondition: EditorGroupEditorsCountContext.notEqualsTo('1') }, group: '1_close', order: 20 });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: CLOSE_EDITORS_TO_THE_RIGHT_COMMAND_ID, title: localize('closeRight', "Close to the Right"), precondition: ContextKeyExpr.and(ActiveEditorLastInGroupContext.toNegated(), MultipleEditorsSelectedInGroupContext.negate()) }, group: '1_close', order: 30, when: EditorTabsVisibleContext });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: CLOSE_SAVED_EDITORS_COMMAND_ID, title: localize('closeAllSaved', "Close Saved") }, group: '1_close', order: 40 });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: CLOSE_EDITORS_IN_GROUP_COMMAND_ID, title: localize('closeAll', "Close All") }, group: '1_close', order: 50 });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: REOPEN_WITH_COMMAND_ID, title: localize('reopenWith', "Reopen Editor With...") }, group: '1_open', order: 10, when: ActiveEditorAvailableEditorIdsContext });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: KEEP_EDITOR_COMMAND_ID, title: localize('keepOpen', "Keep Open"), precondition: ActiveEditorPinnedContext.toNegated() }, group: '3_preview', order: 10, when: ContextKeyExpr.has('config.workbench.editor.enablePreview') });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: PIN_EDITOR_COMMAND_ID, title: localize('pin', "Pin") }, group: '3_preview', order: 20, when: ActiveEditorStickyContext.toNegated() });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: UNPIN_EDITOR_COMMAND_ID, title: localize('unpin', "Unpin") }, group: '3_preview', order: 20, when: ActiveEditorStickyContext });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: SPLIT_EDITOR, title: localize('splitRight', "Split Right") }, group: '5_split', order: 10, when: SplitEditorsVertically.negate() });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: SPLIT_EDITOR, title: localize('splitDown', "Split Down") }, group: '5_split', order: 10, when: SplitEditorsVertically });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { submenu: MenuId.EditorSplitMoveSubmenu, title: localize('splitAndMoveEditor', "Split & Move"), group: '5_split', order: 15 });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: MOVE_EDITOR_INTO_NEW_WINDOW_COMMAND_ID, title: localize('moveToNewWindow', "Move into New Window") }, group: '7_new_window', order: 10 });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { command: { id: COPY_EDITOR_INTO_NEW_WINDOW_COMMAND_ID, title: localize('copyToNewWindow', "Copy into New Window") }, group: '7_new_window', order: 20 });
MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, { submenu: MenuId.EditorTitleContextShare, title: localize('share', "Share"), group: '11_share', order: -1, when: MultipleEditorsSelectedInGroupContext.negate() });

// Editor Title Context Menu: Split & Move Editor Submenu
MenuRegistry.appendMenuItem(MenuId.EditorSplitMoveSubmenu, { command: { id: SPLIT_EDITOR_UP, title: localize('splitUp', "Split Up") }, group: '1_split', order: 10 });
MenuRegistry.appendMenuItem(MenuId.EditorSplitMoveSubmenu, { command: { id: SPLIT_EDITOR_DOWN, title: localize('splitDown', "Split Down") }, group: '1_split', order: 20 });
MenuRegistry.appendMenuItem(MenuId.EditorSplitMoveSubmenu, { command: { id: SPLIT_EDITOR_LEFT, title: localize('splitLeft', "Split Left") }, group: '1_split', order: 30 });
MenuRegistry.appendMenuItem(MenuId.EditorSplitMoveSubmenu, { command: { id: SPLIT_EDITOR_RIGHT, title: localize('splitRight', "Split Right") }, group: '1_split', order: 40 });
MenuRegistry.appendMenuItem(MenuId.EditorSplitMoveSubmenu, { command: { id: MOVE_EDITOR_INTO_ABOVE_GROUP, title: localize('moveAbove', "Move Above") }, group: '2_move', order: 10 });
MenuRegistry.appendMenuItem(MenuId.EditorSplitMoveSubmenu, { command: { id: MOVE_EDITOR_INTO_BELOW_GROUP, title: localize('moveBelow', "Move Below") }, group: '2_move', order: 20 });
MenuRegistry.appendMenuItem(MenuId.EditorSplitMoveSubmenu, { command: { id: MOVE_EDITOR_INTO_LEFT_GROUP, title: localize('moveLeft', "Move Left") }, group: '2_move', order: 30 });
MenuRegistry.appendMenuItem(MenuId.EditorSplitMoveSubmenu, { command: { id: MOVE_EDITOR_INTO_RIGHT_GROUP, title: localize('moveRight', "Move Right") }, group: '2_move', order: 40 });
MenuRegistry.appendMenuItem(MenuId.EditorSplitMoveSubmenu, { command: { id: SPLIT_EDITOR_IN_GROUP, title: localize('splitInGroup', "Split in Group"), precondition: MultipleEditorsSelectedInGroupContext.negate() }, group: '3_split_in_group', order: 10, when: ActiveEditorCanSplitInGroupContext });
MenuRegistry.appendMenuItem(MenuId.EditorSplitMoveSubmenu, { command: { id: JOIN_EDITOR_IN_GROUP, title: localize('joinInGroup', "Join in Group"), precondition: MultipleEditorsSelectedInGroupContext.negate() }, group: '3_split_in_group', order: 10, when: SideBySideEditorActiveContext });

// Editor Title Menu
MenuRegistry.appendMenuItem(MenuId.EditorTitle, { command: { id: TOGGLE_DIFF_SIDE_BY_SIDE, title: localize('inlineView', "Inline View"), toggled: ContextKeyExpr.equals('config.diffEditor.renderSideBySide', false) }, group: '1_diff', order: 10, when: ContextKeyExpr.has('isInDiffEditor') });
MenuRegistry.appendMenuItem(MenuId.EditorTitle, { command: { id: SHOW_EDITORS_IN_GROUP, title: localize('showOpenedEditors', "Show Opened Editors") }, group: '3_open', order: 10 });
MenuRegistry.appendMenuItem(MenuId.EditorTitle, { command: { id: CLOSE_EDITORS_IN_GROUP_COMMAND_ID, title: localize('closeAll', "Close All") }, group: '5_close', order: 10 });
MenuRegistry.appendMenuItem(MenuId.EditorTitle, { command: { id: CLOSE_SAVED_EDITORS_COMMAND_ID, title: localize('closeAllSaved', "Close Saved") }, group: '5_close', order: 20 });
MenuRegistry.appendMenuItem(MenuId.EditorTitle, { command: { id: TOGGLE_KEEP_EDITORS_COMMAND_ID, title: localize('togglePreviewMode', "Enable Preview Editors"), toggled: ContextKeyExpr.has('config.workbench.editor.enablePreview') }, group: '7_settings', order: 10 });
MenuRegistry.appendMenuItem(MenuId.EditorTitle, { command: { id: TOGGLE_MAXIMIZE_EDITOR_GROUP, title: localize('maximizeGroup', "Maximize Group") }, group: '8_group_operations', order: 5, when: ContextKeyExpr.and(EditorPartMaximizedEditorGroupContext.negate(), EditorPartMultipleEditorGroupsContext) });
MenuRegistry.appendMenuItem(MenuId.EditorTitle, { command: { id: TOGGLE_MAXIMIZE_EDITOR_GROUP, title: localize('unmaximizeGroup', "Unmaximize Group") }, group: '8_group_operations', order: 5, when: EditorPartMaximizedEditorGroupContext });
MenuRegistry.appendMenuItem(MenuId.EditorTitle, { command: { id: TOGGLE_LOCK_GROUP_COMMAND_ID, title: localize('lockGroup', "Lock Group"), toggled: ActiveEditorGroupLockedContext }, group: '8_group_operations', order: 10, when: IsAuxiliaryWindowContext.toNegated() /* already a primary action for aux windows */ });
MenuRegistry.appendMenuItem(MenuId.EditorTitle, { command: { id: ConfigureEditorAction.ID, title: localize('configureEditors', "Configure Editors") }, group: '9_configure', order: 10 });

function appendEditorToolItem(primary: ICommandAction, when: ContextKeyExpression | undefined, order: number, alternative?: ICommandAction, precondition?: ContextKeyExpression | undefined, enableInCompactMode?: boolean): void {
	const item: IMenuItem = {
		command: {
			id: primary.id,
			title: primary.title,
			icon: primary.icon,
			toggled: primary.toggled,
			precondition
		},
		group: 'navigation',
		when,
		order
	};

	if (alternative) {
		item.alt = {
			id: alternative.id,
			title: alternative.title,
			icon: alternative.icon
		};
	}

	MenuRegistry.appendMenuItem(MenuId.EditorTitle, item);
	if (enableInCompactMode) {
		MenuRegistry.appendMenuItem(MenuId.CompactWindowEditorTitle, item);
	}
}

const SPLIT_ORDER = 100000;  // towards the end
const CLOSE_ORDER = 1000000; // towards the far end

// Editor Title Menu: Split Editor
appendEditorToolItem(
	{
		id: SPLIT_EDITOR,
		title: localize('splitEditorRight', "Split Editor Right"),
		icon: Codicon.splitHorizontal
	},
	SplitEditorsVertically.negate(),
	SPLIT_ORDER,
	{
		id: SPLIT_EDITOR_DOWN,
		title: localize('splitEditorDown', "Split Editor Down"),
		icon: Codicon.splitVertical
	}
);

appendEditorToolItem(
	{
		id: SPLIT_EDITOR,
		title: localize('splitEditorDown', "Split Editor Down"),
		icon: Codicon.splitVertical
	},
	SplitEditorsVertically,
	SPLIT_ORDER,
	{
		id: SPLIT_EDITOR_RIGHT,
		title: localize('splitEditorRight', "Split Editor Right"),
		icon: Codicon.splitHorizontal
	}
);

// Side by side: layout
appendEditorToolItem(
	{
		id: TOGGLE_SPLIT_EDITOR_IN_GROUP_LAYOUT,
		title: localize('toggleSplitEditorInGroupLayout', "Toggle Layout"),
		icon: Codicon.editorLayout
	},
	SideBySideEditorActiveContext,
	SPLIT_ORDER - 1, // left to split actions
);

// Editor Title Menu: Close (tabs disabled, normal editor)
appendEditorToolItem(
	{
		id: CLOSE_EDITOR_COMMAND_ID,
		title: localize('close', "Close"),
		icon: Codicon.close
	},
	ContextKeyExpr.and(EditorTabsVisibleContext.toNegated(), ActiveEditorDirtyContext.toNegated(), ActiveEditorStickyContext.toNegated()),
	CLOSE_ORDER,
	{
		id: CLOSE_EDITORS_IN_GROUP_COMMAND_ID,
		title: localize('closeAll', "Close All"),
		icon: Codicon.closeAll
	}
);

// Editor Title Menu: Close (tabs disabled, dirty editor)
appendEditorToolItem(
	{
		id: CLOSE_EDITOR_COMMAND_ID,
		title: localize('close', "Close"),
		icon: Codicon.closeDirty
	},
	ContextKeyExpr.and(EditorTabsVisibleContext.toNegated(), ActiveEditorDirtyContext, ActiveEditorStickyContext.toNegated()),
	CLOSE_ORDER,
	{
		id: CLOSE_EDITORS_IN_GROUP_COMMAND_ID,
		title: localize('closeAll', "Close All"),
		icon: Codicon.closeAll
	}
);

// Editor Title Menu: Close (tabs disabled, sticky editor)
appendEditorToolItem(
	{
		id: UNPIN_EDITOR_COMMAND_ID,
		title: localize('unpin', "Unpin"),
		icon: Codicon.pinned
	},
	ContextKeyExpr.and(EditorTabsVisibleContext.toNegated(), ActiveEditorDirtyContext.toNegated(), ActiveEditorStickyContext),
	CLOSE_ORDER,
	{
		id: CLOSE_EDITOR_COMMAND_ID,
		title: localize('close', "Close"),
		icon: Codicon.close
	}
);

// Editor Title Menu: Close (tabs disabled, dirty & sticky editor)
appendEditorToolItem(
	{
		id: UNPIN_EDITOR_COMMAND_ID,
		title: localize('unpin', "Unpin"),
		icon: Codicon.pinnedDirty
	},
	ContextKeyExpr.and(EditorTabsVisibleContext.toNegated(), ActiveEditorDirtyContext, ActiveEditorStickyContext),
	CLOSE_ORDER,
	{
		id: CLOSE_EDITOR_COMMAND_ID,
		title: localize('close', "Close"),
		icon: Codicon.close
	}
);

// Lock Group: only on auxiliary window and when group is unlocked
appendEditorToolItem(
	{
		id: LOCK_GROUP_COMMAND_ID,
		title: localize('lockEditorGroup', "Lock Group"),
		icon: Codicon.unlock
	},
	ContextKeyExpr.and(IsAuxiliaryWindowContext, ActiveEditorGroupLockedContext.toNegated()),
	CLOSE_ORDER - 1, // immediately to the left of close action
);

// Unlock Group: only when group is locked
appendEditorToolItem(
	{
		id: UNLOCK_GROUP_COMMAND_ID,
		title: localize('unlockEditorGroup', "Unlock Group"),
		icon: Codicon.lock,
		toggled: ContextKeyExpr.true()
	},
	ActiveEditorGroupLockedContext,
	CLOSE_ORDER - 1, // immediately to the left of close action
);

// Diff Editor Title Menu: Previous Change
const previousChangeIcon = registerIcon('diff-editor-previous-change', Codicon.arrowUp, localize('previousChangeIcon', 'Icon for the previous change action in the diff editor.'));
appendEditorToolItem(
	{
		id: GOTO_PREVIOUS_CHANGE,
		title: localize('navigate.prev.label', "Previous Change"),
		icon: previousChangeIcon
	},
	TextCompareEditorActiveContext,
	10,
	undefined,
	EditorContextKeys.hasChanges,
	true
);

// Diff Editor Title Menu: Next Change
const nextChangeIcon = registerIcon('diff-editor-next-change', Codicon.arrowDown, localize('nextChangeIcon', 'Icon for the next change action in the diff editor.'));
appendEditorToolItem(
	{
		id: GOTO_NEXT_CHANGE,
		title: localize('navigate.next.label', "Next Change"),
		icon: nextChangeIcon
	},
	TextCompareEditorActiveContext,
	11,
	undefined,
	EditorContextKeys.hasChanges,
	true
);

// Diff Editor Title Menu: Swap Sides
appendEditorToolItem(
	{
		id: DIFF_SWAP_SIDES,
		title: localize('swapDiffSides', "Swap Left and Right Side"),
		icon: Codicon.arrowSwap
	},
	ContextKeyExpr.and(TextCompareEditorActiveContext, ActiveCompareEditorCanSwapContext),
	15,
	undefined,
	undefined
);

const toggleWhitespace = registerIcon('diff-editor-toggle-whitespace', Codicon.whitespace, localize('toggleWhitespace', 'Icon for the toggle whitespace action in the diff editor.'));
MenuRegistry.appendMenuItem(MenuId.EditorTitle, {
	command: {
		id: TOGGLE_DIFF_IGNORE_TRIM_WHITESPACE,
		title: localize('ignoreTrimWhitespace.label', "Show Leading/Trailing Whitespace Differences"),
		icon: toggleWhitespace,
		precondition: TextCompareEditorActiveContext,
		toggled: ContextKeyExpr.equals('config.diffEditor.ignoreTrimWhitespace', false),
	},
	group: 'navigation',
	when: TextCompareEditorActiveContext,
	order: 20,
});

// Editor Commands for Command Palette
MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: KEEP_EDITOR_COMMAND_ID, title: localize2('keepEditor', 'Keep Editor'), category: Categories.View }, when: ContextKeyExpr.has('config.workbench.editor.enablePreview') });
MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: PIN_EDITOR_COMMAND_ID, title: localize2('pinEditor', 'Pin Editor'), category: Categories.View } });
MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: UNPIN_EDITOR_COMMAND_ID, title: localize2('unpinEditor', 'Unpin Editor'), category: Categories.View } });
MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: CLOSE_EDITOR_COMMAND_ID, title: localize2('closeEditor', 'Close Editor'), category: Categories.View } });
MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: CLOSE_PINNED_EDITOR_COMMAND_ID, title: localize2('closePinnedEditor', 'Close Pinned Editor'), category: Categories.View } });
MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: CLOSE_EDITORS_IN_GROUP_COMMAND_ID, title: localize2('closeEditorsInGroup', 'Close All Editors in Group'), category: Categories.View } });
MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: CLOSE_SAVED_EDITORS_COMMAND_ID, title: localize2('closeSavedEditors', 'Close Saved Editors in Group'), category: Categories.View } });
MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: CLOSE_OTHER_EDITORS_IN_GROUP_COMMAND_ID, title: localize2('closeOtherEditors', 'Close Other Editors in Group'), category: Categories.View } });
MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: CLOSE_EDITORS_TO_THE_RIGHT_COMMAND_ID, title: localize2('closeRightEditors', 'Close Editors to the Right in Group'), category: Categories.View }, when: ActiveEditorLastInGroupContext.toNegated() });
MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: CLOSE_EDITORS_AND_GROUP_COMMAND_ID, title: localize2('closeEditorGroup', 'Close Editor Group'), category: Categories.View }, when: MultipleEditorGroupsContext });
MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: REOPEN_WITH_COMMAND_ID, title: localize2('reopenWith', "Reopen Editor With..."), category: Categories.View }, when: ActiveEditorAvailableEditorIdsContext });

// File menu
MenuRegistry.appendMenuItem(MenuId.MenubarRecentMenu, {
	group: '1_editor',
	command: {
		id: ReopenClosedEditorAction.ID,
		title: localize({ key: 'miReopenClosedEditor', comment: ['&& denotes a mnemonic'] }, "&&Reopen Closed Editor"),
		precondition: ContextKeyExpr.has('canReopenClosedEditor')
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarRecentMenu, {
	group: 'z_clear',
	command: {
		id: ClearRecentFilesAction.ID,
		title: localize({ key: 'miClearRecentOpen', comment: ['&& denotes a mnemonic'] }, "&&Clear Recently Opened...")
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	title: localize('miShare', "Share"),
	submenu: MenuId.MenubarShare,
	group: '45_share',
	order: 1,
});

// Layout menu
MenuRegistry.appendMenuItem(MenuId.MenubarViewMenu, {
	group: '2_appearance',
	title: localize({ key: 'miEditorLayout', comment: ['&& denotes a mnemonic'] }, "Editor &&Layout"),
	submenu: MenuId.MenubarLayoutMenu,
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
	group: '1_split',
	command: {
		id: SPLIT_EDITOR_UP,
		title: {
			...localize2('miSplitEditorUpWithoutMnemonic', "Split Up"),
			mnemonicTitle: localize({ key: 'miSplitEditorUp', comment: ['&& denotes a mnemonic'] }, "Split &&Up"),
		}
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
	group: '1_split',
	command: {
		id: SPLIT_EDITOR_DOWN,
		title: {
			...localize2('miSplitEditorDownWithoutMnemonic', "Split Down"),
			mnemonicTitle: localize({ key: 'miSplitEditorDown', comment: ['&& denotes a mnemonic'] }, "Split &&Down"),
		}
	},
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
	group: '1_split',
	command: {
		id: SPLIT_EDITOR_LEFT,
		title: {
			...localize2('miSplitEditorLeftWithoutMnemonic', "Split Left"),
			mnemonicTitle: localize({ key: 'miSplitEditorLeft', comment: ['&& denotes a mnemonic'] }, "Split &&Left"),
		}
	},
	order: 3
});

MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
	group: '1_split',
	command: {
		id: SPLIT_EDITOR_RIGHT,
		title: {
			...localize2('miSplitEditorRightWithoutMnemonic', "Split Right"),
			mnemonicTitle: localize({ key: 'miSplitEditorRight', comment: ['&& denotes a mnemonic'] }, "Split &&Right"),
		}
	},
	order: 4
});

MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
	group: '2_split_in_group',
	command: {
		id: SPLIT_EDITOR_IN_GROUP,
		title: {
			...localize2('miSplitEditorInGroupWithoutMnemonic', "Split in Group"),
			mnemonicTitle: localize({ key: 'miSplitEditorInGroup', comment: ['&& denotes a mnemonic'] }, "Split in &&Group"),
		}
	},
	when: ActiveEditorCanSplitInGroupContext,
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
	group: '2_split_in_group',
	command: {
		id: JOIN_EDITOR_IN_GROUP,
		title: {
			...localize2('miJoinEditorInGroupWithoutMnemonic', "Join in Group"),
			mnemonicTitle: localize({ key: 'miJoinEditorInGroup', comment: ['&& denotes a mnemonic'] }, "Join in &&Group"),
		}
	},
	when: SideBySideEditorActiveContext,
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
	group: '3_new_window',
	command: {
		id: MOVE_EDITOR_INTO_NEW_WINDOW_COMMAND_ID,
		title: {
			...localize2('moveEditorToNewWindow', "Move Editor into New Window"),
			mnemonicTitle: localize({ key: 'miMoveEditorToNewWindow', comment: ['&& denotes a mnemonic'] }, "&&Move Editor into New Window"),
		}
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
	group: '3_new_window',
	command: {
		id: COPY_EDITOR_INTO_NEW_WINDOW_COMMAND_ID,
		title: {
			...localize2('copyEditorToNewWindow', "Copy Editor into New Window"),
			mnemonicTitle: localize({ key: 'miCopyEditorToNewWindow', comment: ['&& denotes a mnemonic'] }, "&&Copy Editor into New Window"),
		}
	},
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
	group: '4_layouts',
	command: {
		id: EditorLayoutSingleAction.ID,
		title: {
			...localize2('miSingleColumnEditorLayoutWithoutMnemonic', "Single"),
			mnemonicTitle: localize({ key: 'miSingleColumnEditorLayout', comment: ['&& denotes a mnemonic'] }, "&&Single"),
		}
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
	group: '4_layouts',
	command: {
		id: EditorLayoutTwoColumnsAction.ID,
		title: {
			...localize2('miTwoColumnsEditorLayoutWithoutMnemonic', "Two Columns"),
			mnemonicTitle: localize({ key: 'miTwoColumnsEditorLayout', comment: ['&& denotes a mnemonic'] }, "&&Two Columns"),
		}
	},
	order: 3
});

MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
	group: '4_layouts',
	command: {
		id: EditorLayoutThreeColumnsAction.ID,
		title: {
			...localize2('miThreeColumnsEditorLayoutWithoutMnemonic', "Three Columns"),
			mnemonicTitle: localize({ key: 'miThreeColumnsEditorLayout', comment: ['&& denotes a mnemonic'] }, "T&&hree Columns"),
		}
	},
	order: 4
});

MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
	group: '4_layouts',
	command: {
		id: EditorLayoutTwoRowsAction.ID,
		title: {
			...localize2('miTwoRowsEditorLayoutWithoutMnemonic', "Two Rows"),
			mnemonicTitle: localize({ key: 'miTwoRowsEditorLayout', comment: ['&& denotes a mnemonic'] }, "T&&wo Rows"),
		}
	},
	order: 5
});

MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
	group: '4_layouts',
	command: {
		id: EditorLayoutThreeRowsAction.ID,
		title: {
			...localize2('miThreeRowsEditorLayoutWithoutMnemonic', "Three Rows"),
			mnemonicTitle: localize({ key: 'miThreeRowsEditorLayout', comment: ['&& denotes a mnemonic'] }, "Three &&Rows"),
		}
	},
	order: 6
});

MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
	group: '4_layouts',
	command: {
		id: EditorLayoutTwoByTwoGridAction.ID,
		title: {
			...localize2('miTwoByTwoGridEditorLayoutWithoutMnemonic', "Grid (2x2)"),
			mnemonicTitle: localize({ key: 'miTwoByTwoGridEditorLayout', comment: ['&& denotes a mnemonic'] }, "&&Grid (2x2)"),
		}
	},
	order: 7
});

MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
	group: '4_layouts',
	command: {
		id: EditorLayoutTwoRowsRightAction.ID,
		title: {
			...localize2('miTwoRowsRightEditorLayoutWithoutMnemonic', "Two Rows Right"),
			mnemonicTitle: localize({ key: 'miTwoRowsRightEditorLayout', comment: ['&& denotes a mnemonic'] }, "Two R&&ows Right"),
		}
	},
	order: 8
});

MenuRegistry.appendMenuItem(MenuId.MenubarLayoutMenu, {
	group: '4_layouts',
	command: {
		id: EditorLayoutTwoColumnsBottomAction.ID,
		title: {
			...localize2('miTwoColumnsBottomEditorLayoutWithoutMnemonic', "Two Columns Bottom"),
			mnemonicTitle: localize({ key: 'miTwoColumnsBottomEditorLayout', comment: ['&& denotes a mnemonic'] }, "Two &&Columns Bottom"),
		}
	},
	order: 9
});

// Main Menu Bar Contributions:

MenuRegistry.appendMenuItem(MenuId.MenubarGoMenu, {
	group: '1_history_nav',
	command: {
		id: 'workbench.action.navigateToLastEditLocation',
		title: localize({ key: 'miLastEditLocation', comment: ['&& denotes a mnemonic'] }, "&&Last Edit Location"),
		precondition: ContextKeyExpr.has('canNavigateToLastEditLocation')
	},
	order: 3
});

// Switch Editor

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchEditorMenu, {
	group: '1_sideBySide',
	command: {
		id: FOCUS_FIRST_SIDE_EDITOR,
		title: localize({ key: 'miFirstSideEditor', comment: ['&& denotes a mnemonic'] }, "&&First Side in Editor")
	},
	when: ContextKeyExpr.or(SideBySideEditorActiveContext, TextCompareEditorActiveContext),
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchEditorMenu, {
	group: '1_sideBySide',
	command: {
		id: FOCUS_SECOND_SIDE_EDITOR,
		title: localize({ key: 'miSecondSideEditor', comment: ['&& denotes a mnemonic'] }, "&&Second Side in Editor")
	},
	when: ContextKeyExpr.or(SideBySideEditorActiveContext, TextCompareEditorActiveContext),
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchEditorMenu, {
	group: '2_any',
	command: {
		id: 'workbench.action.nextEditor',
		title: localize({ key: 'miNextEditor', comment: ['&& denotes a mnemonic'] }, "&&Next Editor")
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchEditorMenu, {
	group: '2_any',
	command: {
		id: 'workbench.action.previousEditor',
		title: localize({ key: 'miPreviousEditor', comment: ['&& denotes a mnemonic'] }, "&&Previous Editor")
	},
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchEditorMenu, {
	group: '3_any_used',
	command: {
		id: 'workbench.action.openNextRecentlyUsedEditor',
		title: localize({ key: 'miNextRecentlyUsedEditor', comment: ['&& denotes a mnemonic'] }, "&&Next Used Editor")
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchEditorMenu, {
	group: '3_any_used',
	command: {
		id: 'workbench.action.openPreviousRecentlyUsedEditor',
		title: localize({ key: 'miPreviousRecentlyUsedEditor', comment: ['&& denotes a mnemonic'] }, "&&Previous Used Editor")
	},
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchEditorMenu, {
	group: '4_group',
	command: {
		id: 'workbench.action.nextEditorInGroup',
		title: localize({ key: 'miNextEditorInGroup', comment: ['&& denotes a mnemonic'] }, "&&Next Editor in Group")
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchEditorMenu, {
	group: '4_group',
	command: {
		id: 'workbench.action.previousEditorInGroup',
		title: localize({ key: 'miPreviousEditorInGroup', comment: ['&& denotes a mnemonic'] }, "&&Previous Editor in Group")
	},
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchEditorMenu, {
	group: '5_group_used',
	command: {
		id: 'workbench.action.openNextRecentlyUsedEditorInGroup',
		title: localize({ key: 'miNextUsedEditorInGroup', comment: ['&& denotes a mnemonic'] }, "&&Next Used Editor in Group")
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchEditorMenu, {
	group: '5_group_used',
	command: {
		id: 'workbench.action.openPreviousRecentlyUsedEditorInGroup',
		title: localize({ key: 'miPreviousUsedEditorInGroup', comment: ['&& denotes a mnemonic'] }, "&&Previous Used Editor in Group")
	},
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarGoMenu, {
	group: '2_editor_nav',
	title: localize({ key: 'miSwitchEditor', comment: ['&& denotes a mnemonic'] }, "Switch &&Editor"),
	submenu: MenuId.MenubarSwitchEditorMenu,
	order: 1
});

// Switch Group
MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
	group: '1_focus_index',
	command: {
		id: 'workbench.action.focusFirstEditorGroup',
		title: localize({ key: 'miFocusFirstGroup', comment: ['&& denotes a mnemonic'] }, "Group &&1")
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
	group: '1_focus_index',
	command: {
		id: 'workbench.action.focusSecondEditorGroup',
		title: localize({ key: 'miFocusSecondGroup', comment: ['&& denotes a mnemonic'] }, "Group &&2")
	},
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
	group: '1_focus_index',
	command: {
		id: 'workbench.action.focusThirdEditorGroup',
		title: localize({ key: 'miFocusThirdGroup', comment: ['&& denotes a mnemonic'] }, "Group &&3"),
		precondition: MultipleEditorGroupsContext
	},
	order: 3
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
	group: '1_focus_index',
	command: {
		id: 'workbench.action.focusFourthEditorGroup',
		title: localize({ key: 'miFocusFourthGroup', comment: ['&& denotes a mnemonic'] }, "Group &&4"),
		precondition: MultipleEditorGroupsContext
	},
	order: 4
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
	group: '1_focus_index',
	command: {
		id: 'workbench.action.focusFifthEditorGroup',
		title: localize({ key: 'miFocusFifthGroup', comment: ['&& denotes a mnemonic'] }, "Group &&5"),
		precondition: MultipleEditorGroupsContext
	},
	order: 5
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
	group: '2_next_prev',
	command: {
		id: 'workbench.action.focusNextGroup',
		title: localize({ key: 'miNextGroup', comment: ['&& denotes a mnemonic'] }, "&&Next Group"),
		precondition: MultipleEditorGroupsContext
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
	group: '2_next_prev',
	command: {
		id: 'workbench.action.focusPreviousGroup',
		title: localize({ key: 'miPreviousGroup', comment: ['&& denotes a mnemonic'] }, "&&Previous Group"),
		precondition: MultipleEditorGroupsContext
	},
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
	group: '3_directional',
	command: {
		id: 'workbench.action.focusLeftGroup',
		title: localize({ key: 'miFocusLeftGroup', comment: ['&& denotes a mnemonic'] }, "Group &&Left"),
		precondition: MultipleEditorGroupsContext
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
	group: '3_directional',
	command: {
		id: 'workbench.action.focusRightGroup',
		title: localize({ key: 'miFocusRightGroup', comment: ['&& denotes a mnemonic'] }, "Group &&Right"),
		precondition: MultipleEditorGroupsContext
	},
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
	group: '3_directional',
	command: {
		id: 'workbench.action.focusAboveGroup',
		title: localize({ key: 'miFocusAboveGroup', comment: ['&& denotes a mnemonic'] }, "Group &&Above"),
		precondition: MultipleEditorGroupsContext
	},
	order: 3
});

MenuRegistry.appendMenuItem(MenuId.MenubarSwitchGroupMenu, {
	group: '3_directional',
	command: {
		id: 'workbench.action.focusBelowGroup',
		title: localize({ key: 'miFocusBelowGroup', comment: ['&& denotes a mnemonic'] }, "Group &&Below"),
		precondition: MultipleEditorGroupsContext
	},
	order: 4
});

MenuRegistry.appendMenuItem(MenuId.MenubarGoMenu, {
	group: '2_editor_nav',
	title: localize({ key: 'miSwitchGroup', comment: ['&& denotes a mnemonic'] }, "Switch &&Group"),
	submenu: MenuId.MenubarSwitchGroupMenu,
	order: 2
});

//#endregion


registerEditorFontConfigurations(getFontSnippets);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/editor.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/editor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { GroupIdentifier, IWorkbenchEditorConfiguration, IEditorIdentifier, IEditorCloseEvent, IEditorPartOptions, IEditorPartOptionsChangeEvent, SideBySideEditor, EditorCloseContext, IEditorPane, IEditorPartLimitOptions, IEditorPartDecorationOptions, IEditorWillOpenEvent, EditorInputWithOptions } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IEditorGroup, GroupDirection, IMergeGroupOptions, GroupsOrder, GroupsArrangement, IAuxiliaryEditorPart, IEditorPart } from '../../../services/editor/common/editorGroupsService.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { Dimension } from '../../../../base/browser/dom.js';
import { Event } from '../../../../base/common/event.js';
import { IConfigurationChangeEvent, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ISerializableView } from '../../../../base/browser/ui/grid/grid.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { isObject } from '../../../../base/common/types.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IWindowsConfiguration } from '../../../../platform/window/common/window.js';
import { BooleanVerifier, EnumVerifier, NumberVerifier, ObjectVerifier, SetVerifier, verifyObject } from '../../../../base/common/verifier.js';
import { IAuxiliaryWindowOpenOptions } from '../../../services/auxiliaryWindow/browser/auxiliaryWindowService.js';
import { ContextKeyValue, IContextKey, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { coalesce } from '../../../../base/common/arrays.js';

export interface IEditorPartCreationOptions {
	readonly restorePreviousState: boolean;
}

export const DEFAULT_EDITOR_MIN_DIMENSIONS = new Dimension(220, 70);
export const DEFAULT_EDITOR_MAX_DIMENSIONS = new Dimension(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);

export const DEFAULT_EDITOR_PART_OPTIONS: IEditorPartOptions = {
	showTabs: 'multiple',
	highlightModifiedTabs: false,
	tabActionLocation: 'right',
	tabActionCloseVisibility: true,
	tabActionUnpinVisibility: true,
	showTabIndex: false,
	alwaysShowEditorActions: false,
	tabSizing: 'fit',
	tabSizingFixedMinWidth: 50,
	tabSizingFixedMaxWidth: 160,
	pinnedTabSizing: 'normal',
	pinnedTabsOnSeparateRow: false,
	tabHeight: 'default',
	preventPinnedEditorClose: 'keyboardAndMouse',
	titleScrollbarSizing: 'default',
	titleScrollbarVisibility: 'auto',
	focusRecentEditorAfterClose: true,
	showIcons: true,
	hasIcons: true, // 'vs-seti' is our default icon theme
	enablePreview: true,
	openPositioning: 'right',
	openSideBySideDirection: 'right',
	closeEmptyGroups: true,
	labelFormat: 'default',
	splitSizing: 'auto',
	splitOnDragAndDrop: true,
	dragToOpenWindow: true,
	centeredLayoutFixedWidth: false,
	doubleClickTabToToggleEditorGroupSizes: 'expand',
	editorActionsLocation: 'default',
	wrapTabs: false,
	enablePreviewFromQuickOpen: false,
	scrollToSwitchTabs: false,
	enablePreviewFromCodeNavigation: false,
	closeOnFileDelete: false,
	swipeToNavigate: false,
	mouseBackForwardToNavigate: true,
	restoreViewState: true,
	splitInGroupLayout: 'horizontal',
	revealIfOpen: false,
	// Properties that are Objects have to be defined as getters
	// to ensure no consumer modifies the default values
	get limit(): IEditorPartLimitOptions { return { enabled: false, value: 10, perEditorGroup: false, excludeDirty: false }; },
	get decorations(): IEditorPartDecorationOptions { return { badges: true, colors: true }; },
	get autoLockGroups(): Set<string> { return new Set<string>(); }
};

export function impactsEditorPartOptions(event: IConfigurationChangeEvent): boolean {
	return event.affectsConfiguration('workbench.editor') || event.affectsConfiguration('workbench.iconTheme') || event.affectsConfiguration('window.density');
}

export function getEditorPartOptions(configurationService: IConfigurationService, themeService: IThemeService): IEditorPartOptions {
	const options = {
		...DEFAULT_EDITOR_PART_OPTIONS,
		hasIcons: themeService.getFileIconTheme().hasFileIcons
	};

	const config = configurationService.getValue<IWorkbenchEditorConfiguration>();
	if (config?.workbench?.editor) {

		// Assign all primitive configuration over
		Object.assign(options, config.workbench.editor);

		// Special handle array types and convert to Set
		if (isObject(config.workbench.editor.autoLockGroups)) {
			options.autoLockGroups = DEFAULT_EDITOR_PART_OPTIONS.autoLockGroups;

			for (const [editorId, enablement] of Object.entries(config.workbench.editor.autoLockGroups)) {
				if (enablement === true) {
					options.autoLockGroups.add(editorId);
				}
			}
		} else {
			options.autoLockGroups = DEFAULT_EDITOR_PART_OPTIONS.autoLockGroups;
		}
	}

	const windowConfig = configurationService.getValue<IWindowsConfiguration>();
	if (windowConfig?.window?.density?.editorTabHeight) {
		options.tabHeight = windowConfig.window.density.editorTabHeight;
	}

	return validateEditorPartOptions(options);
}

function validateEditorPartOptions(options: IEditorPartOptions): IEditorPartOptions {

	// Migrate: Show tabs (config migration kicks in very late and can cause flicker otherwise)
	if (typeof options.showTabs === 'boolean') {
		options.showTabs = options.showTabs ? 'multiple' : 'single';
	}

	return verifyObject<IEditorPartOptions>({
		'wrapTabs': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['wrapTabs']),
		'scrollToSwitchTabs': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['scrollToSwitchTabs']),
		'highlightModifiedTabs': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['highlightModifiedTabs']),
		'tabActionCloseVisibility': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['tabActionCloseVisibility']),
		'tabActionUnpinVisibility': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['tabActionUnpinVisibility']),
		'showTabIndex': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['showTabIndex']),
		'alwaysShowEditorActions': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['alwaysShowEditorActions']),
		'pinnedTabsOnSeparateRow': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['pinnedTabsOnSeparateRow']),
		'focusRecentEditorAfterClose': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['focusRecentEditorAfterClose']),
		'showIcons': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['showIcons']),
		'enablePreview': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['enablePreview']),
		'enablePreviewFromQuickOpen': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['enablePreviewFromQuickOpen']),
		'enablePreviewFromCodeNavigation': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['enablePreviewFromCodeNavigation']),
		'closeOnFileDelete': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['closeOnFileDelete']),
		'closeEmptyGroups': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['closeEmptyGroups']),
		'revealIfOpen': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['revealIfOpen']),
		'swipeToNavigate': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['swipeToNavigate']),
		'mouseBackForwardToNavigate': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['mouseBackForwardToNavigate']),
		'restoreViewState': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['restoreViewState']),
		'splitOnDragAndDrop': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['splitOnDragAndDrop']),
		'dragToOpenWindow': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['dragToOpenWindow']),
		'centeredLayoutFixedWidth': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['centeredLayoutFixedWidth']),
		'hasIcons': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['hasIcons']),

		'tabSizingFixedMinWidth': new NumberVerifier(DEFAULT_EDITOR_PART_OPTIONS['tabSizingFixedMinWidth']),
		'tabSizingFixedMaxWidth': new NumberVerifier(DEFAULT_EDITOR_PART_OPTIONS['tabSizingFixedMaxWidth']),

		'showTabs': new EnumVerifier(DEFAULT_EDITOR_PART_OPTIONS['showTabs'], ['multiple', 'single', 'none']),
		'tabActionLocation': new EnumVerifier(DEFAULT_EDITOR_PART_OPTIONS['tabActionLocation'], ['left', 'right']),
		'tabSizing': new EnumVerifier(DEFAULT_EDITOR_PART_OPTIONS['tabSizing'], ['fit', 'shrink', 'fixed']),
		'pinnedTabSizing': new EnumVerifier(DEFAULT_EDITOR_PART_OPTIONS['pinnedTabSizing'], ['normal', 'compact', 'shrink']),
		'tabHeight': new EnumVerifier(DEFAULT_EDITOR_PART_OPTIONS['tabHeight'], ['default', 'compact']),
		'preventPinnedEditorClose': new EnumVerifier(DEFAULT_EDITOR_PART_OPTIONS['preventPinnedEditorClose'], ['keyboardAndMouse', 'keyboard', 'mouse', 'never']),
		'titleScrollbarSizing': new EnumVerifier(DEFAULT_EDITOR_PART_OPTIONS['titleScrollbarSizing'], ['default', 'large']),
		'titleScrollbarVisibility': new EnumVerifier(DEFAULT_EDITOR_PART_OPTIONS['titleScrollbarVisibility'], ['auto', 'visible', 'hidden']),
		'openPositioning': new EnumVerifier(DEFAULT_EDITOR_PART_OPTIONS['openPositioning'], ['left', 'right', 'first', 'last']),
		'openSideBySideDirection': new EnumVerifier(DEFAULT_EDITOR_PART_OPTIONS['openSideBySideDirection'], ['right', 'down']),
		'labelFormat': new EnumVerifier(DEFAULT_EDITOR_PART_OPTIONS['labelFormat'], ['default', 'short', 'medium', 'long']),
		'splitInGroupLayout': new EnumVerifier(DEFAULT_EDITOR_PART_OPTIONS['splitInGroupLayout'], ['vertical', 'horizontal']),
		'splitSizing': new EnumVerifier(DEFAULT_EDITOR_PART_OPTIONS['splitSizing'], ['distribute', 'split', 'auto']),
		'doubleClickTabToToggleEditorGroupSizes': new EnumVerifier(DEFAULT_EDITOR_PART_OPTIONS['doubleClickTabToToggleEditorGroupSizes'], ['maximize', 'expand', 'off']),
		'editorActionsLocation': new EnumVerifier(DEFAULT_EDITOR_PART_OPTIONS['editorActionsLocation'], ['default', 'titleBar', 'hidden']),
		'autoLockGroups': new SetVerifier<string>(DEFAULT_EDITOR_PART_OPTIONS['autoLockGroups']),

		'limit': new ObjectVerifier<IEditorPartLimitOptions>(DEFAULT_EDITOR_PART_OPTIONS['limit'], {
			'enabled': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['limit']['enabled']),
			'value': new NumberVerifier(DEFAULT_EDITOR_PART_OPTIONS['limit']['value']),
			'perEditorGroup': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['limit']['perEditorGroup']),
			'excludeDirty': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['limit']['excludeDirty'])
		}),
		'decorations': new ObjectVerifier<IEditorPartDecorationOptions>(DEFAULT_EDITOR_PART_OPTIONS['decorations'], {
			'badges': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['decorations']['badges']),
			'colors': new BooleanVerifier(DEFAULT_EDITOR_PART_OPTIONS['decorations']['colors'])
		}),
	}, options);
}

/**
 * A helper to access editor groups across all opened editor parts.
 */
export interface IEditorPartsView {

	readonly mainPart: IEditorGroupsView;
	registerPart(part: IEditorPart): IDisposable;

	readonly activeGroup: IEditorGroupView;
	readonly groups: IEditorGroupView[];
	getGroup(identifier: GroupIdentifier): IEditorGroupView | undefined;
	getGroups(order?: GroupsOrder): IEditorGroupView[];

	readonly count: number;

	createAuxiliaryEditorPart(options?: IAuxiliaryWindowOpenOptions): Promise<IAuxiliaryEditorPart>;

	bind<T extends ContextKeyValue>(contextKey: RawContextKey<T>, group: IEditorGroupView): IContextKey<T>;
}

/**
 * A helper to access and mutate editor groups within an editor part.
 */
export interface IEditorGroupsView {

	readonly windowId: number;

	readonly groups: IEditorGroupView[];
	readonly activeGroup: IEditorGroupView;

	readonly partOptions: IEditorPartOptions;
	readonly onDidChangeEditorPartOptions: Event<IEditorPartOptionsChangeEvent>;

	readonly onDidVisibilityChange: Event<boolean>;

	getGroup(identifier: GroupIdentifier): IEditorGroupView | undefined;
	getGroups(order: GroupsOrder): IEditorGroupView[];

	activateGroup(identifier: IEditorGroupView | GroupIdentifier, preserveWindowOrder?: boolean): IEditorGroupView;
	restoreGroup(identifier: IEditorGroupView | GroupIdentifier): IEditorGroupView;

	addGroup(location: IEditorGroupView | GroupIdentifier, direction: GroupDirection, groupToCopy?: IEditorGroupView): IEditorGroupView;
	mergeGroup(group: IEditorGroupView | GroupIdentifier, target: IEditorGroupView | GroupIdentifier, options?: IMergeGroupOptions): boolean;

	moveGroup(group: IEditorGroupView | GroupIdentifier, location: IEditorGroupView | GroupIdentifier, direction: GroupDirection): IEditorGroupView;
	copyGroup(group: IEditorGroupView | GroupIdentifier, location: IEditorGroupView | GroupIdentifier, direction: GroupDirection): IEditorGroupView;

	removeGroup(group: IEditorGroupView | GroupIdentifier, preserveFocus?: boolean): void;

	arrangeGroups(arrangement: GroupsArrangement, target?: IEditorGroupView | GroupIdentifier): void;
	toggleMaximizeGroup(group?: IEditorGroupView | GroupIdentifier): void;
	toggleExpandGroup(group?: IEditorGroupView | GroupIdentifier): void;
}

export interface IEditorGroupTitleHeight {

	/**
	 * The overall height of the editor group title control.
	 */
	readonly total: number;

	/**
	 * The height offset to e.g. use when drawing drop overlays.
	 * This number may be smaller than `height` if the title control
	 * decides to have an `offset` that is within the title control
	 * (e.g. when breadcrumbs are enabled).
	 */
	readonly offset: number;
}

export interface IEditorGroupViewOptions {

	/**
	 * Whether the editor group should receive keyboard focus
	 * after creation or not.
	 */
	readonly preserveFocus?: boolean;
}

/**
 * A helper to access and mutate an editor group within an editor part.
 */
export interface IEditorGroupView extends IDisposable, ISerializableView, IEditorGroup {

	readonly onDidFocus: Event<void>;

	readonly onWillOpenEditor: Event<IEditorWillOpenEvent>;
	readonly onDidOpenEditorFail: Event<EditorInput>;

	readonly onDidCloseEditor: Event<IEditorCloseEvent>;

	readonly groupsView: IEditorGroupsView;

	/**
	 * A promise that resolves when the group has been restored.
	 *
	 * For a group with active editor, the promise will resolve
	 * when the active editor has finished to resolve.
	 */
	readonly whenRestored: Promise<void>;

	readonly titleHeight: IEditorGroupTitleHeight;

	readonly disposed: boolean;

	setActive(isActive: boolean): void;

	notifyIndexChanged(newIndex: number): void;
	notifyLabelChanged(newLabel: string): void;

	openEditor(editor: EditorInput, options?: IEditorOptions, internalOptions?: IInternalEditorOpenOptions): Promise<IEditorPane | undefined>;

	relayout(): void;
}

export function fillActiveEditorViewState(group: IEditorGroup, expectedActiveEditor?: EditorInput, presetOptions?: IEditorOptions): IEditorOptions {
	if (!expectedActiveEditor || !group.activeEditor || expectedActiveEditor.matches(group.activeEditor)) {
		const options: IEditorOptions = {
			...presetOptions,
			viewState: group.activeEditorPane?.getViewState()
		};

		return options;
	}

	return presetOptions || Object.create(null);
}

export function prepareMoveCopyEditors(sourceGroup: IEditorGroup, editors: EditorInput[], preserveFocus?: boolean): EditorInputWithOptions[] {
	if (editors.length === 0) {
		return [];
	}

	const editorsWithOptions: EditorInputWithOptions[] = [];

	let activeEditor: EditorInput | undefined;
	const inactiveEditors: EditorInput[] = [];
	for (const editor of editors) {
		if (!activeEditor && sourceGroup.isActive(editor)) {
			activeEditor = editor;
		} else {
			inactiveEditors.push(editor);
		}
	}

	if (!activeEditor) {
		activeEditor = inactiveEditors.shift(); // just take the first editor as active if none is active
	}

	// ensure inactive editors are then sorted by inverse visual order
	// so that we can preserve the order in the target group. we inverse
	// because editors will open to the side of the active editor as
	// inactive editors, and the active editor is always the reference
	inactiveEditors.sort((a, b) => sourceGroup.getIndexOfEditor(b) - sourceGroup.getIndexOfEditor(a));

	const sortedEditors = coalesce([activeEditor, ...inactiveEditors]);
	for (let i = 0; i < sortedEditors.length; i++) {
		const editor = sortedEditors[i];
		editorsWithOptions.push({
			editor,
			options: {
				pinned: true,
				sticky: sourceGroup.isSticky(editor),
				inactive: i > 0,
				preserveFocus
			}
		});
	}

	return editorsWithOptions;
}

/**
 * A sub-interface of IEditorService to hide some workbench-core specific
 * events from clients.
 */
export interface EditorServiceImpl extends IEditorService {

	/**
	 * Emitted when an editor failed to open.
	 */
	readonly onDidOpenEditorFail: Event<IEditorIdentifier>;

	/**
	 * Emitted when the list of most recently active editors change.
	 */
	readonly onDidMostRecentlyActiveEditorsChange: Event<void>;
}

export interface IInternalEditorTitleControlOptions {

	/**
	 * A hint to defer updating the title control for perf reasons.
	 * The caller must ensure to update the title control then.
	 */
	readonly skipTitleUpdate?: boolean;
}

export interface IInternalEditorOpenOptions extends IInternalEditorTitleControlOptions {

	/**
	 * Whether to consider a side by side editor as matching
	 * when figuring out if the editor to open is already
	 * opened or not. By default, side by side editors will
	 * not be considered as matching, even if the editor is
	 * opened in one of the sides.
	 */
	readonly supportSideBySide?: SideBySideEditor.ANY | SideBySideEditor.BOTH;

	/**
	 * When set to `true`, pass DOM focus into the tab control.
	 */
	readonly focusTabControl?: boolean;

	/**
	 * When set to `true`, will not attempt to move the window to
	 * the top that the editor opens in.
	 */
	readonly preserveWindowOrder?: boolean;

	/**
	 * Inactive editors to select after opening the active selected editor.
	 */
	readonly inactiveSelection?: EditorInput[];
}

export interface IInternalEditorCloseOptions extends IInternalEditorTitleControlOptions {

	/**
	 * A hint that the editor is closed due to an error opening. This can be
	 * used to optimize how error toasts are appearing if any.
	 */
	readonly fromError?: boolean;

	/**
	 * Additional context as to why an editor is closed.
	 */
	readonly context?: EditorCloseContext;
}

export interface IInternalMoveCopyOptions extends IInternalEditorOpenOptions {

	/**
	 * Whether to close the editor at the source or keep it.
	 */
	readonly keepCopy?: boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/editorActions.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/editorActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { Action } from '../../../../base/common/actions.js';
import { IEditorIdentifier, IEditorCommandsContext, CloseDirection, SaveReason, EditorsOrder, EditorInputCapabilities, DEFAULT_EDITOR_ASSOCIATION, GroupIdentifier, EditorResourceAccessor } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { SideBySideEditorInput } from '../../../common/editor/sideBySideEditorInput.js';
import { IWorkbenchLayoutService, Parts } from '../../../services/layout/browser/layoutService.js';
import { GoFilter, IHistoryService } from '../../../services/history/common/history.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { CLOSE_EDITOR_COMMAND_ID, MOVE_ACTIVE_EDITOR_COMMAND_ID, SelectedEditorsMoveCopyArguments, SPLIT_EDITOR_LEFT, SPLIT_EDITOR_RIGHT, SPLIT_EDITOR_UP, SPLIT_EDITOR_DOWN, splitEditor, LAYOUT_EDITOR_GROUPS_COMMAND_ID, UNPIN_EDITOR_COMMAND_ID, COPY_ACTIVE_EDITOR_COMMAND_ID, SPLIT_EDITOR, TOGGLE_MAXIMIZE_EDITOR_GROUP, MOVE_EDITOR_INTO_NEW_WINDOW_COMMAND_ID, COPY_EDITOR_INTO_NEW_WINDOW_COMMAND_ID, MOVE_EDITOR_GROUP_INTO_NEW_WINDOW_COMMAND_ID, COPY_EDITOR_GROUP_INTO_NEW_WINDOW_COMMAND_ID, NEW_EMPTY_EDITOR_WINDOW_COMMAND_ID, MOVE_EDITOR_INTO_RIGHT_GROUP, MOVE_EDITOR_INTO_LEFT_GROUP, MOVE_EDITOR_INTO_ABOVE_GROUP, MOVE_EDITOR_INTO_BELOW_GROUP } from './editorCommands.js';
import { IEditorGroupsService, IEditorGroup, GroupsArrangement, GroupLocation, GroupDirection, preferredSideBySideGroupDirection, IFindGroupScope, GroupOrientation, EditorGroupLayout, GroupsOrder, MergeGroupMode } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IWorkspacesService } from '../../../../platform/workspaces/common/workspaces.js';
import { IFileDialogService, ConfirmResult, IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ItemActivation, IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { AllEditorsByMostRecentlyUsedQuickAccess, ActiveGroupEditorsByMostRecentlyUsedQuickAccess, AllEditorsByAppearanceQuickAccess } from './editorQuickAccess.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IFilesConfigurationService, AutoSaveMode } from '../../../services/filesConfiguration/common/filesConfigurationService.js';
import { IEditorResolverService } from '../../../services/editor/common/editorResolverService.js';
import { isLinux, isNative, isWindows } from '../../../../base/common/platform.js';
import { Action2, IAction2Options, MenuId } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { IKeybindingRule, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { ActiveEditorAvailableEditorIdsContext, ActiveEditorContext, ActiveEditorGroupEmptyContext, AuxiliaryBarVisibleContext, EditorPartMaximizedEditorGroupContext, EditorPartMultipleEditorGroupsContext, InAutomationContext, IsAuxiliaryWindowFocusedContext, MultipleEditorGroupsContext, SideBarVisibleContext } from '../../../common/contextkeys.js';
import { getActiveDocument } from '../../../../base/browser/dom.js';
import { ICommandActionTitle } from '../../../../platform/action/common/action.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { resolveCommandsContext } from './editorCommandsContext.js';
import { IListService } from '../../../../platform/list/browser/listService.js';
import { prepareMoveCopyEditors } from './editor.js';

class ExecuteCommandAction extends Action2 {

	constructor(
		desc: Readonly<IAction2Options>,
		private readonly commandId: string,
		private readonly commandArgs?: unknown
	) {
		super(desc);
	}

	override run(accessor: ServicesAccessor): Promise<void> {
		const commandService = accessor.get(ICommandService);

		return commandService.executeCommand(this.commandId, this.commandArgs);
	}
}

abstract class AbstractSplitEditorAction extends Action2 {

	protected getDirection(configurationService: IConfigurationService): GroupDirection {
		return preferredSideBySideGroupDirection(configurationService);
	}

	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const editorGroupsService = accessor.get(IEditorGroupsService);
		const configurationService = accessor.get(IConfigurationService);
		const editorService = accessor.get(IEditorService);
		const listService = accessor.get(IListService);

		const direction = this.getDirection(configurationService);
		const commandContext = resolveCommandsContext(args, editorService, editorGroupsService, listService);

		splitEditor(editorGroupsService, direction, commandContext);
	}
}

export class SplitEditorAction extends AbstractSplitEditorAction {

	static readonly ID = SPLIT_EDITOR;

	constructor() {
		super({
			id: SplitEditorAction.ID,
			title: localize2('splitEditor', 'Split Editor'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.Backslash
			},
			category: Categories.View
		});
	}
}

export class SplitEditorOrthogonalAction extends AbstractSplitEditorAction {

	constructor() {
		super({
			id: 'workbench.action.splitEditorOrthogonal',
			title: localize2('splitEditorOrthogonal', 'Split Editor Orthogonal'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.Backslash)
			},
			category: Categories.View
		});
	}

	protected override getDirection(configurationService: IConfigurationService): GroupDirection {
		const direction = preferredSideBySideGroupDirection(configurationService);

		return direction === GroupDirection.RIGHT ? GroupDirection.DOWN : GroupDirection.RIGHT;
	}
}

export class SplitEditorLeftAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: SPLIT_EDITOR_LEFT,
			title: localize2('splitEditorGroupLeft', 'Split Editor Left'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.Backslash)
			},
			category: Categories.View
		}, SPLIT_EDITOR_LEFT);
	}
}

export class SplitEditorRightAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: SPLIT_EDITOR_RIGHT,
			title: localize2('splitEditorGroupRight', 'Split Editor Right'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.Backslash)
			},
			category: Categories.View
		}, SPLIT_EDITOR_RIGHT);
	}
}

export class SplitEditorUpAction extends ExecuteCommandAction {

	static readonly LABEL = localize('splitEditorGroupUp', "Split Editor Up");

	constructor() {
		super({
			id: SPLIT_EDITOR_UP,
			title: localize2('splitEditorGroupUp', "Split Editor Up"),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.Backslash)
			},
			category: Categories.View
		}, SPLIT_EDITOR_UP);
	}
}

export class SplitEditorDownAction extends ExecuteCommandAction {

	static readonly LABEL = localize('splitEditorGroupDown', "Split Editor Down");

	constructor() {
		super({
			id: SPLIT_EDITOR_DOWN,
			title: localize2('splitEditorGroupDown', "Split Editor Down"),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.Backslash)
			},
			category: Categories.View
		}, SPLIT_EDITOR_DOWN);
	}
}

export class JoinTwoGroupsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.joinTwoGroups',
			title: localize2('joinTwoGroups', 'Join Editor Group with Next Group'),
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor, context?: IEditorIdentifier): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);

		let sourceGroup: IEditorGroup | undefined;
		if (context && typeof context.groupId === 'number') {
			sourceGroup = editorGroupService.getGroup(context.groupId);
		} else {
			sourceGroup = editorGroupService.activeGroup;
		}

		if (sourceGroup) {
			const targetGroupDirections = [GroupDirection.RIGHT, GroupDirection.DOWN, GroupDirection.LEFT, GroupDirection.UP];
			for (const targetGroupDirection of targetGroupDirections) {
				const targetGroup = editorGroupService.findGroup({ direction: targetGroupDirection }, sourceGroup);
				if (targetGroup && sourceGroup !== targetGroup) {
					editorGroupService.mergeGroup(sourceGroup, targetGroup);

					break;
				}
			}
		}
	}
}

export class JoinAllGroupsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.joinAllGroups',
			title: localize2('joinAllGroups', 'Join All Editor Groups'),
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);

		editorGroupService.mergeAllGroups(editorGroupService.activeGroup);
	}
}

export class NavigateBetweenGroupsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.navigateEditorGroups',
			title: localize2('navigateEditorGroups', 'Navigate Between Editor Groups'),
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);

		const nextGroup = editorGroupService.findGroup({ location: GroupLocation.NEXT }, editorGroupService.activeGroup, true);
		nextGroup?.focus();
	}
}

export class FocusActiveGroupAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.focusActiveEditorGroup',
			title: localize2('focusActiveEditorGroup', 'Focus Active Editor Group'),
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);

		editorGroupService.activeGroup.focus();
	}
}

abstract class AbstractFocusGroupAction extends Action2 {

	constructor(
		desc: Readonly<IAction2Options>,
		private readonly scope: IFindGroupScope
	) {
		super(desc);
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);

		const group = editorGroupService.findGroup(this.scope, editorGroupService.activeGroup, true);
		group?.focus();
	}
}

export class FocusFirstGroupAction extends AbstractFocusGroupAction {

	constructor() {
		super({
			id: 'workbench.action.focusFirstEditorGroup',
			title: localize2('focusFirstEditorGroup', 'Focus First Editor Group'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.Digit1
			},
			category: Categories.View
		}, { location: GroupLocation.FIRST });
	}
}

export class FocusLastGroupAction extends AbstractFocusGroupAction {

	constructor() {
		super({
			id: 'workbench.action.focusLastEditorGroup',
			title: localize2('focusLastEditorGroup', 'Focus Last Editor Group'),
			f1: true,
			category: Categories.View
		}, { location: GroupLocation.LAST });
	}
}

export class FocusNextGroup extends AbstractFocusGroupAction {

	constructor() {
		super({
			id: 'workbench.action.focusNextGroup',
			title: localize2('focusNextGroup', 'Focus Next Editor Group'),
			f1: true,
			category: Categories.View
		}, { location: GroupLocation.NEXT });
	}
}

export class FocusPreviousGroup extends AbstractFocusGroupAction {

	constructor() {
		super({
			id: 'workbench.action.focusPreviousGroup',
			title: localize2('focusPreviousGroup', 'Focus Previous Editor Group'),
			f1: true,
			category: Categories.View
		}, { location: GroupLocation.PREVIOUS });
	}
}

export class FocusLeftGroup extends AbstractFocusGroupAction {

	constructor() {
		super({
			id: 'workbench.action.focusLeftGroup',
			title: localize2('focusLeftGroup', 'Focus Left Editor Group'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.LeftArrow)
			},
			category: Categories.View
		}, { direction: GroupDirection.LEFT });
	}
}

export class FocusRightGroup extends AbstractFocusGroupAction {

	constructor() {
		super({
			id: 'workbench.action.focusRightGroup',
			title: localize2('focusRightGroup', 'Focus Right Editor Group'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.RightArrow)
			},
			category: Categories.View
		}, { direction: GroupDirection.RIGHT });
	}
}

export class FocusAboveGroup extends AbstractFocusGroupAction {

	constructor() {
		super({
			id: 'workbench.action.focusAboveGroup',
			title: localize2('focusAboveGroup', 'Focus Editor Group Above'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.UpArrow)
			},
			category: Categories.View
		}, { direction: GroupDirection.UP });
	}
}

export class FocusBelowGroup extends AbstractFocusGroupAction {

	constructor() {
		super({
			id: 'workbench.action.focusBelowGroup',
			title: localize2('focusBelowGroup', 'Focus Editor Group Below'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.DownArrow)
			},
			category: Categories.View
		}, { direction: GroupDirection.DOWN });
	}
}

export class CloseEditorAction extends Action {

	static readonly ID = 'workbench.action.closeActiveEditor';
	static readonly LABEL = localize('closeEditor', "Close Editor");

	constructor(
		id: string,
		label: string,
		@ICommandService private readonly commandService: ICommandService
	) {
		super(id, label, ThemeIcon.asClassName(Codicon.close));
	}

	override run(context?: IEditorCommandsContext): Promise<void> {
		return this.commandService.executeCommand(CLOSE_EDITOR_COMMAND_ID, undefined, context);
	}
}

export class UnpinEditorAction extends Action {

	static readonly ID = 'workbench.action.unpinActiveEditor';
	static readonly LABEL = localize('unpinEditor', "Unpin Editor");

	constructor(
		id: string,
		label: string,
		@ICommandService private readonly commandService: ICommandService
	) {
		super(id, label, ThemeIcon.asClassName(Codicon.pinned));
	}

	override run(context?: IEditorCommandsContext): Promise<void> {
		return this.commandService.executeCommand(UNPIN_EDITOR_COMMAND_ID, undefined, context);
	}
}

export class CloseEditorTabAction extends Action {

	static readonly ID = 'workbench.action.closeActiveEditor';
	static readonly LABEL = localize('closeOneEditor', "Close");

	constructor(
		id: string,
		label: string,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService
	) {
		super(id, label, ThemeIcon.asClassName(Codicon.close));
	}

	override async run(context?: IEditorCommandsContext): Promise<void> {
		const group = context ? this.editorGroupService.getGroup(context.groupId) : this.editorGroupService.activeGroup;
		if (!group) {
			// group mentioned in context does not exist
			return;
		}

		const targetEditor = context?.editorIndex !== undefined ? group.getEditorByIndex(context.editorIndex) : group.activeEditor;
		if (!targetEditor) {
			// No editor open or editor at index does not exist
			return;
		}

		const editors: EditorInput[] = [];
		if (group.isSelected(targetEditor)) {
			editors.push(...group.selectedEditors);
		} else {
			editors.push(targetEditor);
		}

		// Close specific editors in group
		for (const editor of editors) {
			await group.closeEditor(editor, { preserveFocus: context?.preserveFocus });
		}
	}
}

export class RevertAndCloseEditorAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.revertAndCloseActiveEditor',
			title: localize2('revertAndCloseActiveEditor', 'Revert and Close Editor'),
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const logService = accessor.get(ILogService);

		const activeEditorPane = editorService.activeEditorPane;
		if (activeEditorPane) {
			const editor = activeEditorPane.input;
			const group = activeEditorPane.group;

			// first try a normal revert where the contents of the editor are restored
			try {
				await editorService.revert({ editor, groupId: group.id });
			} catch (error) {
				logService.error(error);

				// if that fails, since we are about to close the editor, we accept that
				// the editor cannot be reverted and instead do a soft revert that just
				// enables us to close the editor. With this, a user can always close a
				// dirty editor even when reverting fails.

				await editorService.revert({ editor, groupId: group.id }, { soft: true });
			}

			await group.closeEditor(editor);
		}
	}
}

export class CloseLeftEditorsInGroupAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.closeEditorsToTheLeft',
			title: localize2('closeEditorsToTheLeft', 'Close Editors to the Left in Group'),
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor, context?: IEditorIdentifier): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);

		const { group, editor } = this.getTarget(editorGroupService, context);
		if (group && editor) {
			await group.closeEditors({ direction: CloseDirection.LEFT, except: editor, excludeSticky: true });
		}
	}

	private getTarget(editorGroupService: IEditorGroupsService, context?: IEditorIdentifier): { editor: EditorInput | null; group: IEditorGroup | undefined } {
		if (context) {
			return { editor: context.editor, group: editorGroupService.getGroup(context.groupId) };
		}

		// Fallback to active group
		return { group: editorGroupService.activeGroup, editor: editorGroupService.activeGroup.activeEditor };
	}
}

abstract class AbstractCloseAllAction extends Action2 {

	protected groupsToClose(editorGroupService: IEditorGroupsService): IEditorGroup[] {
		const groupsToClose: IEditorGroup[] = [];

		// Close editors in reverse order of their grid appearance so that the editor
		// group that is the first (top-left) remains. This helps to keep view state
		// for editors around that have been opened in this visually first group.
		const groups = editorGroupService.getGroups(GroupsOrder.GRID_APPEARANCE);
		for (let i = groups.length - 1; i >= 0; i--) {
			groupsToClose.push(groups[i]);
		}

		return groupsToClose;
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const logService = accessor.get(ILogService);
		const progressService = accessor.get(IProgressService);
		const editorGroupService = accessor.get(IEditorGroupsService);
		const filesConfigurationService = accessor.get(IFilesConfigurationService);
		const fileDialogService = accessor.get(IFileDialogService);

		// Depending on the editor and auto save configuration,
		// split editors into buckets for handling confirmation

		const dirtyEditorsWithDefaultConfirm = new Set<IEditorIdentifier>();
		const dirtyAutoSaveOnFocusChangeEditors = new Set<IEditorIdentifier>();
		const dirtyAutoSaveOnWindowChangeEditors = new Set<IEditorIdentifier>();
		const editorsWithCustomConfirm = new Map<string /* typeId */, Set<IEditorIdentifier>>();

		for (const { editor, groupId } of editorService.getEditors(EditorsOrder.SEQUENTIAL, { excludeSticky: this.excludeSticky })) {
			let confirmClose = false;
			let handlerDidError = false;
			if (editor.closeHandler) {
				try {
					confirmClose = editor.closeHandler.showConfirm(); // custom handling of confirmation on close
				} catch (error) {
					logService.error(error);
					handlerDidError = true;
				}
			}

			if (!editor.closeHandler || handlerDidError) {
				confirmClose = editor.isDirty() && !editor.isSaving(); // default confirm only when dirty and not saving
			}

			if (!confirmClose) {
				continue;
			}

			// Editor has custom confirm implementation
			if (typeof editor.closeHandler?.confirm === 'function') {
				let customEditorsToConfirm = editorsWithCustomConfirm.get(editor.typeId);
				if (!customEditorsToConfirm) {
					customEditorsToConfirm = new Set();
					editorsWithCustomConfirm.set(editor.typeId, customEditorsToConfirm);
				}

				customEditorsToConfirm.add({ editor, groupId });
			}

			// Editor will be saved on focus change when a
			// dialog appears, so just track that separate
			else if (!editor.hasCapability(EditorInputCapabilities.Untitled) && filesConfigurationService.getAutoSaveMode(editor).mode === AutoSaveMode.ON_FOCUS_CHANGE) {
				dirtyAutoSaveOnFocusChangeEditors.add({ editor, groupId });
			}

			// Windows, Linux: editor will be saved on window change
			// when a native dialog appears, so just track that separate
			// (see https://github.com/microsoft/vscode/issues/134250)
			else if ((isNative && (isWindows || isLinux)) && !editor.hasCapability(EditorInputCapabilities.Untitled) && filesConfigurationService.getAutoSaveMode(editor).mode === AutoSaveMode.ON_WINDOW_CHANGE) {
				dirtyAutoSaveOnWindowChangeEditors.add({ editor, groupId });
			}

			// Editor will show in generic file based dialog
			else {
				dirtyEditorsWithDefaultConfirm.add({ editor, groupId });
			}
		}

		// 1.) Show default file based dialog
		if (dirtyEditorsWithDefaultConfirm.size > 0) {
			const editors = Array.from(dirtyEditorsWithDefaultConfirm.values());

			await this.revealEditorsToConfirm(editors, editorGroupService); // help user make a decision by revealing editors

			const confirmation = await fileDialogService.showSaveConfirm(editors.map(({ editor }) => {
				if (editor instanceof SideBySideEditorInput) {
					return editor.primary.getName(); // prefer shorter names by using primary's name in this case
				}

				return editor.getName();
			}));

			switch (confirmation) {
				case ConfirmResult.CANCEL:
					return;
				case ConfirmResult.DONT_SAVE:
					await this.revertEditors(editorService, logService, progressService, editors);
					break;
				case ConfirmResult.SAVE:
					await editorService.save(editors, { reason: SaveReason.EXPLICIT });
					break;
			}
		}

		// 2.) Show custom confirm based dialog
		for (const [, editorIdentifiers] of editorsWithCustomConfirm) {
			const editors = Array.from(editorIdentifiers.values());

			await this.revealEditorsToConfirm(editors, editorGroupService); // help user make a decision by revealing editors

			const confirmation = await editors.at(0)?.editor.closeHandler?.confirm?.(editors);
			if (typeof confirmation === 'number') {
				switch (confirmation) {
					case ConfirmResult.CANCEL:
						return;
					case ConfirmResult.DONT_SAVE:
						await this.revertEditors(editorService, logService, progressService, editors);
						break;
					case ConfirmResult.SAVE:
						await editorService.save(editors, { reason: SaveReason.EXPLICIT });
						break;
				}
			}
		}

		// 3.) Save autosaveable editors (focus change)
		if (dirtyAutoSaveOnFocusChangeEditors.size > 0) {
			const editors = Array.from(dirtyAutoSaveOnFocusChangeEditors.values());

			await editorService.save(editors, { reason: SaveReason.FOCUS_CHANGE });
		}

		// 4.) Save autosaveable editors (window change)
		if (dirtyAutoSaveOnWindowChangeEditors.size > 0) {
			const editors = Array.from(dirtyAutoSaveOnWindowChangeEditors.values());

			await editorService.save(editors, { reason: SaveReason.WINDOW_CHANGE });
		}

		// 5.) Finally close all editors: even if an editor failed to
		// save or revert and still reports dirty, the editor part makes
		// sure to bring up another confirm dialog for those editors
		// specifically.
		return this.doCloseAll(editorGroupService);
	}

	private revertEditors(editorService: IEditorService, logService: ILogService, progressService: IProgressService, editors: IEditorIdentifier[]): Promise<void> {
		return progressService.withProgress({
			location: ProgressLocation.Window, 	// use window progress to not be too annoying about this operation
			delay: 800,							// delay so that it only appears when operation takes a long time
			title: localize('reverting', "Reverting Editors..."),
		}, () => this.doRevertEditors(editorService, logService, editors));
	}

	private async doRevertEditors(editorService: IEditorService, logService: ILogService, editors: IEditorIdentifier[]): Promise<void> {
		try {
			// We first attempt to revert all editors with `soft: false`, to ensure that
			// working copies revert to their state on disk. Even though we close editors,
			// it is possible that other parties hold a reference to the working copy
			// and expect it to be in a certain state after the editor is closed without
			// saving.
			await editorService.revert(editors);
		} catch (error) {
			logService.error(error);

			// if that fails, since we are about to close the editor, we accept that
			// the editor cannot be reverted and instead do a soft revert that just
			// enables us to close the editor. With this, a user can always close a
			// dirty editor even when reverting fails.
			await editorService.revert(editors, { soft: true });
		}
	}

	private async revealEditorsToConfirm(editors: ReadonlyArray<IEditorIdentifier>, editorGroupService: IEditorGroupsService): Promise<void> {
		try {
			const handledGroups = new Set<GroupIdentifier>();
			for (const { editor, groupId } of editors) {
				if (handledGroups.has(groupId)) {
					continue;
				}

				handledGroups.add(groupId);

				const group = editorGroupService.getGroup(groupId);
				await group?.openEditor(editor);
			}
		} catch (error) {
			// ignore any error as the revealing is just convinience
		}
	}

	protected abstract get excludeSticky(): boolean;

	protected async doCloseAll(editorGroupService: IEditorGroupsService): Promise<void> {
		await Promise.all(this.groupsToClose(editorGroupService).map(group => group.closeAllEditors({ excludeSticky: this.excludeSticky })));
	}
}

export class CloseAllEditorsAction extends AbstractCloseAllAction {

	static readonly ID = 'workbench.action.closeAllEditors';
	static readonly LABEL = localize2('closeAllEditors', 'Close All Editors');

	constructor() {
		super({
			id: CloseAllEditorsAction.ID,
			title: CloseAllEditorsAction.LABEL,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyW)
			},
			icon: Codicon.closeAll,
			category: Categories.View
		});
	}

	protected get excludeSticky(): boolean {
		return true; // exclude sticky from this mass-closing operation
	}
}

export class CloseAllEditorGroupsAction extends AbstractCloseAllAction {

	constructor() {
		super({
			id: 'workbench.action.closeAllGroups',
			title: localize2('closeAllGroups', 'Close All Editor Groups'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyW)
			},
			category: Categories.View
		});
	}

	protected get excludeSticky(): boolean {
		return false; // the intent to close groups means, even sticky are included
	}

	protected override async doCloseAll(editorGroupService: IEditorGroupsService): Promise<void> {
		await super.doCloseAll(editorGroupService);

		for (const groupToClose of this.groupsToClose(editorGroupService)) {
			editorGroupService.removeGroup(groupToClose);
		}
	}
}

export class CloseEditorsInOtherGroupsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.closeEditorsInOtherGroups',
			title: localize2('closeEditorsInOtherGroups', 'Close Editors in Other Groups'),
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor, context?: IEditorIdentifier): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);

		const groupToSkip = context ? editorGroupService.getGroup(context.groupId) : editorGroupService.activeGroup;
		await Promise.all(editorGroupService.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE).map(async group => {
			if (groupToSkip && group.id === groupToSkip.id) {
				return;
			}

			return group.closeAllEditors({ excludeSticky: true });
		}));
	}
}

export class CloseEditorInAllGroupsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.closeEditorInAllGroups',
			title: localize2('closeEditorInAllGroups', 'Close Editor in All Groups'),
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editorGroupService = accessor.get(IEditorGroupsService);

		const activeEditor = editorService.activeEditor;
		if (activeEditor) {
			await Promise.all(editorGroupService.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE).map(group => group.closeEditor(activeEditor)));
		}
	}
}

abstract class AbstractMoveCopyGroupAction extends Action2 {

	constructor(
		desc: Readonly<IAction2Options>,
		private readonly direction: GroupDirection,
		private readonly isMove: boolean
	) {
		super(desc);
	}

	override async run(accessor: ServicesAccessor, context?: IEditorIdentifier): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);

		let sourceGroup: IEditorGroup | undefined;
		if (context && typeof context.groupId === 'number') {
			sourceGroup = editorGroupService.getGroup(context.groupId);
		} else {
			sourceGroup = editorGroupService.activeGroup;
		}

		if (sourceGroup) {
			let resultGroup: IEditorGroup | undefined = undefined;
			if (this.isMove) {
				const targetGroup = this.findTargetGroup(editorGroupService, sourceGroup);
				if (targetGroup) {
					resultGroup = editorGroupService.moveGroup(sourceGroup, targetGroup, this.direction);
				}
			} else {
				resultGroup = editorGroupService.copyGroup(sourceGroup, sourceGroup, this.direction);
			}

			if (resultGroup) {
				editorGroupService.activateGroup(resultGroup);
			}
		}
	}

	private findTargetGroup(editorGroupService: IEditorGroupsService, sourceGroup: IEditorGroup): IEditorGroup | undefined {
		const targetNeighbours: GroupDirection[] = [this.direction];

		// Allow the target group to be in alternative locations to support more
		// scenarios of moving the group to the taret location.
		// Helps for https://github.com/microsoft/vscode/issues/50741
		switch (this.direction) {
			case GroupDirection.LEFT:
			case GroupDirection.RIGHT:
				targetNeighbours.push(GroupDirection.UP, GroupDirection.DOWN);
				break;
			case GroupDirection.UP:
			case GroupDirection.DOWN:
				targetNeighbours.push(GroupDirection.LEFT, GroupDirection.RIGHT);
				break;
		}

		for (const targetNeighbour of targetNeighbours) {
			const targetNeighbourGroup = editorGroupService.findGroup({ direction: targetNeighbour }, sourceGroup);
			if (targetNeighbourGroup) {
				return targetNeighbourGroup;
			}
		}

		return undefined;
	}
}

abstract class AbstractMoveGroupAction extends AbstractMoveCopyGroupAction {

	constructor(
		desc: Readonly<IAction2Options>,
		direction: GroupDirection
	) {
		super(desc, direction, true);
	}
}

export class MoveGroupLeftAction extends AbstractMoveGroupAction {

	constructor() {
		super({
			id: 'workbench.action.moveActiveEditorGroupLeft',
			title: localize2('moveActiveGroupLeft', 'Move Editor Group Left'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.LeftArrow)
			},
			category: Categories.View
		}, GroupDirection.LEFT);
	}
}

export class MoveGroupRightAction extends AbstractMoveGroupAction {

	constructor() {
		super({
			id: 'workbench.action.moveActiveEditorGroupRight',
			title: localize2('moveActiveGroupRight', 'Move Editor Group Right'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.RightArrow)
			},
			category: Categories.View
		}, GroupDirection.RIGHT);
	}
}

export class MoveGroupUpAction extends AbstractMoveGroupAction {

	constructor() {
		super({
			id: 'workbench.action.moveActiveEditorGroupUp',
			title: localize2('moveActiveGroupUp', 'Move Editor Group Up'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.UpArrow)
			},
			category: Categories.View
		}, GroupDirection.UP);
	}
}

export class MoveGroupDownAction extends AbstractMoveGroupAction {

	constructor() {
		super({
			id: 'workbench.action.moveActiveEditorGroupDown',
			title: localize2('moveActiveGroupDown', 'Move Editor Group Down'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.DownArrow)
			},
			category: Categories.View
		}, GroupDirection.DOWN);
	}
}

abstract class AbstractDuplicateGroupAction extends AbstractMoveCopyGroupAction {

	constructor(
		desc: Readonly<IAction2Options>,
		direction: GroupDirection
	) {
		super(desc, direction, false);
	}
}

export class DuplicateGroupLeftAction extends AbstractDuplicateGroupAction {

	constructor() {
		super({
			id: 'workbench.action.duplicateActiveEditorGroupLeft',
			title: localize2('duplicateActiveGroupLeft', 'Duplicate Editor Group Left'),
			f1: true,
			category: Categories.View
		}, GroupDirection.LEFT);
	}
}

export class DuplicateGroupRightAction extends AbstractDuplicateGroupAction {

	constructor() {
		super({
			id: 'workbench.action.duplicateActiveEditorGroupRight',
			title: localize2('duplicateActiveGroupRight', 'Duplicate Editor Group Right'),
			f1: true,
			category: Categories.View
		}, GroupDirection.RIGHT);
	}
}

export class DuplicateGroupUpAction extends AbstractDuplicateGroupAction {

	constructor() {
		super({
			id: 'workbench.action.duplicateActiveEditorGroupUp',
			title: localize2('duplicateActiveGroupUp', 'Duplicate Editor Group Up'),
			f1: true,
			category: Categories.View
		}, GroupDirection.UP);
	}
}

export class DuplicateGroupDownAction extends AbstractDuplicateGroupAction {

	constructor() {
		super({
			id: 'workbench.action.duplicateActiveEditorGroupDown',
			title: localize2('duplicateActiveGroupDown', 'Duplicate Editor Group Down'),
			f1: true,
			category: Categories.View
		}, GroupDirection.DOWN);
	}
}

export class MinimizeOtherGroupsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.minimizeOtherEditors',
			title: localize2('minimizeOtherEditorGroups', 'Expand Editor Group'),
			f1: true,
			category: Categories.View,
			precondition: MultipleEditorGroupsContext
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);

		editorGroupService.arrangeGroups(GroupsArrangement.EXPAND);
	}
}

export class MinimizeOtherGroupsHideSidebarAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.minimizeOtherEditorsHideSidebar',
			title: localize2('minimizeOtherEditorGroupsHideSidebar', 'Expand Editor Group and Hide Side Bars'),
			f1: true,
			category: Categories.View,
			precondition: ContextKeyExpr.or(MultipleEditorGroupsContext, SideBarVisibleContext, AuxiliaryBarVisibleContext)
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);
		const layoutService = accessor.get(IWorkbenchLayoutService);

		layoutService.setPartHidden(true, Parts.SIDEBAR_PART);
		layoutService.setPartHidden(true, Parts.AUXILIARYBAR_PART);
		editorGroupService.arrangeGroups(GroupsArrangement.EXPAND);
	}
}

export class ResetGroupSizesAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.evenEditorWidths',
			title: localize2('evenEditorGroups', 'Reset Editor Group Sizes'),
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);

		editorGroupService.arrangeGroups(GroupsArrangement.EVEN);
	}
}

export class ToggleGroupSizesAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.toggleEditorWidths',
			title: localize2('toggleEditorWidths', 'Toggle Editor Group Sizes'),
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);

		editorGroupService.toggleExpandGroup();
	}
}

export class MaximizeGroupHideSidebarAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.maximizeEditorHideSidebar',
			title: localize2('maximizeEditorHideSidebar', 'Maximize Editor Group and Hide Side Bars'),
			f1: true,
			category: Categories.View,
			precondition: ContextKeyExpr.or(ContextKeyExpr.and(EditorPartMaximizedEditorGroupContext.negate(), EditorPartMultipleEditorGroupsContext), SideBarVisibleContext, AuxiliaryBarVisibleContext)
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		const editorGroupService = accessor.get(IEditorGroupsService);
		const editorService = accessor.get(IEditorService);

		if (editorService.activeEditor) {
			layoutService.setPartHidden(true, Parts.SIDEBAR_PART);
			layoutService.setPartHidden(true, Parts.AUXILIARYBAR_PART);
			editorGroupService.arrangeGroups(GroupsArrangement.MAXIMIZE);
		}
	}
}

export class ToggleMaximizeEditorGroupAction extends Action2 {

	constructor() {
		super({
			id: TOGGLE_MAXIMIZE_EDITOR_GROUP,
			title: localize2('toggleMaximizeEditorGroup', 'Toggle Maximize Editor Group'),
			f1: true,
			category: Categories.View,
			precondition: ContextKeyExpr.or(EditorPartMultipleEditorGroupsContext, EditorPartMaximizedEditorGroupContext),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyM),
			},
			menu: [{
				id: MenuId.EditorTitle,
				order: -10000, // towards the front
				group: 'navigation',
				when: EditorPartMaximizedEditorGroupContext
			},
			{
				id: MenuId.EmptyEditorGroup,
				order: -10000, // towards the front
				group: 'navigation',
				when: EditorPartMaximizedEditorGroupContext
			}],
			icon: Codicon.screenFull,
			toggled: {
				condition: EditorPartMaximizedEditorGroupContext,
				title: localize('unmaximizeGroup', "Unmaximize Group")
			},
		});
	}

	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const editorGroupsService = accessor.get(IEditorGroupsService);
		const editorService = accessor.get(IEditorService);
		const listService = accessor.get(IListService);

		const resolvedContext = resolveCommandsContext(args, editorService, editorGroupsService, listService);
		if (resolvedContext.groupedEditors.length) {
			editorGroupsService.toggleMaximizeGroup(resolvedContext.groupedEditors[0].group);
		}
	}
}

abstract class AbstractNavigateEditorAction extends Action2 {

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);

		const result = this.navigate(editorGroupService);
		if (!result) {
			return;
		}

		const { groupId, editor } = result;
		if (!editor) {
			return;
		}

		const group = editorGroupService.getGroup(groupId);
		if (group) {
			await group.openEditor(editor);
		}
	}

	protected abstract navigate(editorGroupService: IEditorGroupsService): IEditorIdentifier | undefined;
}

export class OpenNextEditor extends AbstractNavigateEditorAction {

	constructor() {
		super({
			id: 'workbench.action.nextEditor',
			title: localize2('openNextEditor', 'Open Next Editor'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.PageDown,
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.RightArrow,
					secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.BracketRight]
				}
			},
			category: Categories.View
		});
	}

	protected navigate(editorGroupService: IEditorGroupsService): IEditorIdentifier | undefined {

		// Navigate in active group if possible
		const activeGroup = editorGroupService.activeGroup;
		const activeGroupEditors = activeGroup.getEditors(EditorsOrder.SEQUENTIAL);
		const activeEditorIndex = activeGroup.activeEditor ? activeGroupEditors.indexOf(activeGroup.activeEditor) : -1;
		if (activeEditorIndex + 1 < activeGroupEditors.length) {
			return { editor: activeGroupEditors[activeEditorIndex + 1], groupId: activeGroup.id };
		}

		// Otherwise try in next group that has editors
		const handledGroups = new Set<number>();
		let currentGroup: IEditorGroup | undefined = editorGroupService.activeGroup;
		while (currentGroup && !handledGroups.has(currentGroup.id)) {
			currentGroup = editorGroupService.findGroup({ location: GroupLocation.NEXT }, currentGroup, true);
			if (currentGroup) {
				handledGroups.add(currentGroup.id);

				const groupEditors = currentGroup.getEditors(EditorsOrder.SEQUENTIAL);
				if (groupEditors.length > 0) {
					return { editor: groupEditors[0], groupId: currentGroup.id };
				}
			}
		}

		return undefined;
	}
}

export class OpenPreviousEditor extends AbstractNavigateEditorAction {

	constructor() {
		super({
			id: 'workbench.action.previousEditor',
			title: localize2('openPreviousEditor', 'Open Previous Editor'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.PageUp,
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.LeftArrow,
					secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.BracketLeft]
				}
			},
			category: Categories.View
		});
	}

	protected navigate(editorGroupService: IEditorGroupsService): IEditorIdentifier | undefined {

		// Navigate in active group if possible
		const activeGroup = editorGroupService.activeGroup;
		const activeGroupEditors = activeGroup.getEditors(EditorsOrder.SEQUENTIAL);
		const activeEditorIndex = activeGroup.activeEditor ? activeGroupEditors.indexOf(activeGroup.activeEditor) : -1;
		if (activeEditorIndex > 0) {
			return { editor: activeGroupEditors[activeEditorIndex - 1], groupId: activeGroup.id };
		}

		// Otherwise try in previous group that has editors
		const handledGroups = new Set<number>();
		let currentGroup: IEditorGroup | undefined = editorGroupService.activeGroup;
		while (currentGroup && !handledGroups.has(currentGroup.id)) {
			currentGroup = editorGroupService.findGroup({ location: GroupLocation.PREVIOUS }, currentGroup, true);
			if (currentGroup) {
				handledGroups.add(currentGroup.id);

				const groupEditors = currentGroup.getEditors(EditorsOrder.SEQUENTIAL);
				if (groupEditors.length > 0) {
					return { editor: groupEditors[groupEditors.length - 1], groupId: currentGroup.id };
				}
			}
		}

		return undefined;
	}
}

export class OpenNextEditorInGroup extends AbstractNavigateEditorAction {

	constructor() {
		super({
			id: 'workbench.action.nextEditorInGroup',
			title: localize2('nextEditorInGroup', 'Open Next Editor in Group'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.PageDown),
				mac: {
					primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.RightArrow)
				}
			},
			category: Categories.View
		});
	}

	protected navigate(editorGroupService: IEditorGroupsService): IEditorIdentifier {
		const group = editorGroupService.activeGroup;
		const editors = group.getEditors(EditorsOrder.SEQUENTIAL);
		const index = group.activeEditor ? editors.indexOf(group.activeEditor) : -1;

		return { editor: index + 1 < editors.length ? editors[index + 1] : editors[0], groupId: group.id };
	}
}

export class OpenPreviousEditorInGroup extends AbstractNavigateEditorAction {

	constructor() {
		super({
			id: 'workbench.action.previousEditorInGroup',
			title: localize2('openPreviousEditorInGroup', 'Open Previous Editor in Group'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.PageUp),
				mac: {
					primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.LeftArrow)
				}
			},
			category: Categories.View
		});
	}

	protected navigate(editorGroupService: IEditorGroupsService): IEditorIdentifier {
		const group = editorGroupService.activeGroup;
		const editors = group.getEditors(EditorsOrder.SEQUENTIAL);
		const index = group.activeEditor ? editors.indexOf(group.activeEditor) : -1;

		return { editor: index > 0 ? editors[index - 1] : editors[editors.length - 1], groupId: group.id };
	}
}

export class OpenFirstEditorInGroup extends AbstractNavigateEditorAction {

	constructor() {
		super({
			id: 'workbench.action.firstEditorInGroup',
			title: localize2('firstEditorInGroup', 'Open First Editor in Group'),
			f1: true,
			category: Categories.View
		});
	}

	protected navigate(editorGroupService: IEditorGroupsService): IEditorIdentifier {
		const group = editorGroupService.activeGroup;
		const editors = group.getEditors(EditorsOrder.SEQUENTIAL);

		return { editor: editors[0], groupId: group.id };
	}
}

export class OpenLastEditorInGroup extends AbstractNavigateEditorAction {

	constructor() {
		super({
			id: 'workbench.action.lastEditorInGroup',
			title: localize2('lastEditorInGroup', 'Open Last Editor in Group'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.Alt | KeyCode.Digit0,
				secondary: [KeyMod.CtrlCmd | KeyCode.Digit9],
				mac: {
					primary: KeyMod.WinCtrl | KeyCode.Digit0,
					secondary: [KeyMod.CtrlCmd | KeyCode.Digit9]
				}
			},
			category: Categories.View
		});
	}

	protected navigate(editorGroupService: IEditorGroupsService): IEditorIdentifier {
		const group = editorGroupService.activeGroup;
		const editors = group.getEditors(EditorsOrder.SEQUENTIAL);

		return { editor: editors[editors.length - 1], groupId: group.id };
	}
}

export class NavigateForwardAction extends Action2 {

	static readonly ID = 'workbench.action.navigateForward';
	static readonly LABEL = localize('navigateForward', "Go Forward");

	constructor() {
		super({
			id: NavigateForwardAction.ID,
			title: {
				...localize2('navigateForward', "Go Forward"),
				mnemonicTitle: localize({ key: 'miForward', comment: ['&& denotes a mnemonic'] }, "&&Forward")
			},
			f1: true,
			icon: Codicon.arrowRight,
			precondition: ContextKeyExpr.has('canNavigateForward'),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				win: { primary: KeyMod.Alt | KeyCode.RightArrow, secondary: [KeyCode.BrowserForward] },
				mac: { primary: KeyMod.WinCtrl | KeyMod.Shift | KeyCode.Minus, secondary: [KeyCode.BrowserForward] },
				linux: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Minus, secondary: [KeyCode.BrowserForward] }
			},
			menu: [
				{ id: MenuId.MenubarGoMenu, group: '1_history_nav', order: 2 },
				{ id: MenuId.CommandCenter, order: 2, when: ContextKeyExpr.has('config.workbench.navigationControl.enabled') }
			]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(IHistoryService);

		await historyService.goForward(GoFilter.NONE);
	}
}

export class NavigateBackwardsAction extends Action2 {

	static readonly ID = 'workbench.action.navigateBack';
	static readonly LABEL = localize('navigateBack', "Go Back");

	constructor() {
		super({
			id: NavigateBackwardsAction.ID,
			title: {
				...localize2('navigateBack', "Go Back"),
				mnemonicTitle: localize({ key: 'miBack', comment: ['&& denotes a mnemonic'] }, "&&Back")
			},
			f1: true,
			precondition: ContextKeyExpr.has('canNavigateBack'),
			icon: Codicon.arrowLeft,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				win: { primary: KeyMod.Alt | KeyCode.LeftArrow, secondary: [KeyCode.BrowserBack] },
				mac: { primary: KeyMod.WinCtrl | KeyCode.Minus, secondary: [KeyCode.BrowserBack] },
				linux: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Minus, secondary: [KeyCode.BrowserBack] }
			},
			menu: [
				{ id: MenuId.MenubarGoMenu, group: '1_history_nav', order: 1 },
				{ id: MenuId.CommandCenter, order: 1, when: ContextKeyExpr.has('config.workbench.navigationControl.enabled') }
			]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(IHistoryService);

		await historyService.goBack(GoFilter.NONE);
	}
}

export class NavigatePreviousAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.navigateLast',
			title: localize2('navigatePrevious', 'Go Previous'),
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(IHistoryService);

		await historyService.goPrevious(GoFilter.NONE);
	}
}

export class NavigateForwardInEditsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.navigateForwardInEditLocations',
			title: localize2('navigateForwardInEdits', 'Go Forward in Edit Locations'),
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(IHistoryService);

		await historyService.goForward(GoFilter.EDITS);
	}
}

export class NavigateBackwardsInEditsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.navigateBackInEditLocations',
			title: localize2('navigateBackInEdits', 'Go Back in Edit Locations'),
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(IHistoryService);

		await historyService.goBack(GoFilter.EDITS);
	}
}

export class NavigatePreviousInEditsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.navigatePreviousInEditLocations',
			title: localize2('navigatePreviousInEdits', 'Go Previous in Edit Locations'),
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(IHistoryService);

		await historyService.goPrevious(GoFilter.EDITS);
	}
}

export class NavigateToLastEditLocationAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.navigateToLastEditLocation',
			title: localize2('navigateToLastEditLocation', 'Go to Last Edit Location'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyQ)
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(IHistoryService);

		await historyService.goLast(GoFilter.EDITS);
	}
}

export class NavigateForwardInNavigationsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.navigateForwardInNavigationLocations',
			title: localize2('navigateForwardInNavigations', 'Go Forward in Navigation Locations'),
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(IHistoryService);

		await historyService.goForward(GoFilter.NAVIGATION);
	}
}

export class NavigateBackwardsInNavigationsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.navigateBackInNavigationLocations',
			title: localize2('navigateBackInNavigations', 'Go Back in Navigation Locations'),
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(IHistoryService);

		await historyService.goBack(GoFilter.NAVIGATION);
	}
}

export class NavigatePreviousInNavigationsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.navigatePreviousInNavigationLocations',
			title: localize2('navigatePreviousInNavigationLocations', 'Go Previous in Navigation Locations'),
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(IHistoryService);

		await historyService.goPrevious(GoFilter.NAVIGATION);
	}
}

export class NavigateToLastNavigationLocationAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.navigateToLastNavigationLocation',
			title: localize2('navigateToLastNavigationLocation', 'Go to Last Navigation Location'),
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(IHistoryService);

		await historyService.goLast(GoFilter.NAVIGATION);
	}
}

export class ReopenClosedEditorAction extends Action2 {

	static readonly ID = 'workbench.action.reopenClosedEditor';

	constructor() {
		super({
			id: ReopenClosedEditorAction.ID,
			title: localize2('reopenClosedEditor', 'Reopen Closed Editor'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyT
			},
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(IHistoryService);

		await historyService.reopenLastClosedEditor();
	}
}

export class ClearRecentFilesAction extends Action2 {

	static readonly ID = 'workbench.action.clearRecentFiles';

	constructor() {
		super({
			id: ClearRecentFilesAction.ID,
			title: localize2('clearRecentFiles', 'Clear Recently Opened...'),
			f1: true,
			category: Categories.File
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const dialogService = accessor.get(IDialogService);
		const workspacesService = accessor.get(IWorkspacesService);
		const historyService = accessor.get(IHistoryService);

		// Ask for confirmation
		const { confirmed } = await dialogService.confirm({
			type: 'warning',
			message: localize('confirmClearRecentsMessage', "Do you want to clear all recently opened files and workspaces?"),
			detail: localize('confirmClearDetail', "This action is irreversible!"),
			primaryButton: localize({ key: 'clearButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Clear")
		});

		if (!confirmed) {
			return;
		}

		// Clear global recently opened
		workspacesService.clearRecentlyOpened();

		// Clear workspace specific recently opened
		historyService.clearRecentlyOpened();
	}
}

export class ShowEditorsInActiveGroupByMostRecentlyUsedAction extends Action2 {

	static readonly ID = 'workbench.action.showEditorsInActiveGroup';

	constructor() {
		super({
			id: ShowEditorsInActiveGroupByMostRecentlyUsedAction.ID,
			title: localize2('showEditorsInActiveGroup', 'Show Editors in Active Group By Most Recently Used'),
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const quickInputService = accessor.get(IQuickInputService);

		quickInputService.quickAccess.show(ActiveGroupEditorsByMostRecentlyUsedQuickAccess.PREFIX);
	}
}

export class ShowAllEditorsByAppearanceAction extends Action2 {

	static readonly ID = 'workbench.action.showAllEditors';

	constructor() {
		super({
			id: ShowAllEditorsByAppearanceAction.ID,
			title: localize2('showAllEditors', 'Show All Editors By Appearance'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyP),
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Tab
				}
			},
			category: Categories.File
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const quickInputService = accessor.get(IQuickInputService);

		quickInputService.quickAccess.show(AllEditorsByAppearanceQuickAccess.PREFIX);
	}
}

export class ShowAllEditorsByMostRecentlyUsedAction extends Action2 {

	static readonly ID = 'workbench.action.showAllEditorsByMostRecentlyUsed';

	constructor() {
		super({
			id: ShowAllEditorsByMostRecentlyUsedAction.ID,
			title: localize2('showAllEditorsByMostRecentlyUsed', 'Show All Editors By Most Recently Used'),
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const quickInputService = accessor.get(IQuickInputService);

		quickInputService.quickAccess.show(AllEditorsByMostRecentlyUsedQuickAccess.PREFIX);
	}
}

abstract class AbstractQuickAccessEditorAction extends Action2 {

	constructor(
		desc: Readonly<IAction2Options>,
		private readonly prefix: string,
		private readonly itemActivation: ItemActivation | undefined,
	) {
		super(desc);
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const keybindingService = accessor.get(IKeybindingService);
		const quickInputService = accessor.get(IQuickInputService);

		const keybindings = keybindingService.lookupKeybindings(this.desc.id);

		quickInputService.quickAccess.show(this.prefix, {
			quickNavigateConfiguration: { keybindings },
			itemActivation: this.itemActivation
		});
	}
}

export class QuickAccessPreviousRecentlyUsedEditorAction extends AbstractQuickAccessEditorAction {

	constructor() {
		super({
			id: 'workbench.action.quickOpenPreviousRecentlyUsedEditor',
			title: localize2('quickOpenPreviousRecentlyUsedEditor', 'Quick Open Previous Recently Used Editor'),
			f1: true,
			category: Categories.View
		}, AllEditorsByMostRecentlyUsedQuickAccess.PREFIX, undefined);
	}
}

export class QuickAccessLeastRecentlyUsedEditorAction extends AbstractQuickAccessEditorAction {

	constructor() {
		super({
			id: 'workbench.action.quickOpenLeastRecentlyUsedEditor',
			title: localize2('quickOpenLeastRecentlyUsedEditor', 'Quick Open Least Recently Used Editor'),
			f1: true,
			category: Categories.View
		}, AllEditorsByMostRecentlyUsedQuickAccess.PREFIX, undefined);
	}
}

export class QuickAccessPreviousRecentlyUsedEditorInGroupAction extends AbstractQuickAccessEditorAction {

	constructor() {
		super({
			id: 'workbench.action.quickOpenPreviousRecentlyUsedEditorInGroup',
			title: localize2('quickOpenPreviousRecentlyUsedEditorInGroup', 'Quick Open Previous Recently Used Editor in Group'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.Tab,
				mac: {
					primary: KeyMod.WinCtrl | KeyCode.Tab
				}
			},
			precondition: ActiveEditorGroupEmptyContext.toNegated(),
			category: Categories.View
		}, ActiveGroupEditorsByMostRecentlyUsedQuickAccess.PREFIX, undefined);
	}
}

export class QuickAccessLeastRecentlyUsedEditorInGroupAction extends AbstractQuickAccessEditorAction {

	constructor() {
		super({
			id: 'workbench.action.quickOpenLeastRecentlyUsedEditorInGroup',
			title: localize2('quickOpenLeastRecentlyUsedEditorInGroup', 'Quick Open Least Recently Used Editor in Group'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Tab,
				mac: {
					primary: KeyMod.WinCtrl | KeyMod.Shift | KeyCode.Tab
				}
			},
			precondition: ActiveEditorGroupEmptyContext.toNegated(),
			category: Categories.View
		}, ActiveGroupEditorsByMostRecentlyUsedQuickAccess.PREFIX, ItemActivation.LAST);
	}
}

export class QuickAccessPreviousEditorFromHistoryAction extends Action2 {

	private static readonly ID = 'workbench.action.openPreviousEditorFromHistory';

	constructor() {
		super({
			id: QuickAccessPreviousEditorFromHistoryAction.ID,
			title: localize2('navigateEditorHistoryByInput', 'Quick Open Previous Editor from History'),
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const keybindingService = accessor.get(IKeybindingService);
		const quickInputService = accessor.get(IQuickInputService);
		const editorGroupService = accessor.get(IEditorGroupsService);

		const keybindings = keybindingService.lookupKeybindings(QuickAccessPreviousEditorFromHistoryAction.ID);

		// Enforce to activate the first item in quick access if
		// the currently active editor group has n editor opened
		let itemActivation: ItemActivation | undefined = undefined;
		if (editorGroupService.activeGroup.count === 0) {
			itemActivation = ItemActivation.FIRST;
		}

		quickInputService.quickAccess.show('', { quickNavigateConfiguration: { keybindings }, itemActivation });
	}
}

export class OpenNextRecentlyUsedEditorAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.openNextRecentlyUsedEditor',
			title: localize2('openNextRecentlyUsedEditor', 'Open Next Recently Used Editor'),
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(IHistoryService);

		historyService.openNextRecentlyUsedEditor();
	}
}

export class OpenPreviousRecentlyUsedEditorAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.openPreviousRecentlyUsedEditor',
			title: localize2('openPreviousRecentlyUsedEditor', 'Open Previous Recently Used Editor'),
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(IHistoryService);

		historyService.openPreviouslyUsedEditor();
	}
}

export class OpenNextRecentlyUsedEditorInGroupAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.openNextRecentlyUsedEditorInGroup',
			title: localize2('openNextRecentlyUsedEditorInGroup', 'Open Next Recently Used Editor In Group'),
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(IHistoryService);
		const editorGroupsService = accessor.get(IEditorGroupsService);

		historyService.openNextRecentlyUsedEditor(editorGroupsService.activeGroup.id);
	}
}

export class OpenPreviousRecentlyUsedEditorInGroupAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.openPreviousRecentlyUsedEditorInGroup',
			title: localize2('openPreviousRecentlyUsedEditorInGroup', 'Open Previous Recently Used Editor In Group'),
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(IHistoryService);
		const editorGroupsService = accessor.get(IEditorGroupsService);

		historyService.openPreviouslyUsedEditor(editorGroupsService.activeGroup.id);
	}
}

export class ClearEditorHistoryWithoutConfirmAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.clearEditorHistoryWithoutConfirm',
			title: localize2('clearEditorHistoryWithoutConfirm', 'Clear Editor History without Confirmation'),
			f1: true,
			precondition: InAutomationContext
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(IHistoryService);

		// Clear editor history
		historyService.clear();
	}
}

export class ClearEditorHistoryAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.clearEditorHistory',
			title: localize2('clearEditorHistory', 'Clear Editor History'),
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const dialogService = accessor.get(IDialogService);
		const historyService = accessor.get(IHistoryService);

		// Ask for confirmation
		const { confirmed } = await dialogService.confirm({
			type: 'warning',
			message: localize('confirmClearEditorHistoryMessage', "Do you want to clear the history of recently opened editors?"),
			detail: localize('confirmClearDetail', "This action is irreversible!"),
			primaryButton: localize({ key: 'clearButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Clear")
		});

		if (!confirmed) {
			return;
		}

		// Clear editor history
		historyService.clear();
	}
}

export class MoveEditorLeftInGroupAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: 'workbench.action.moveEditorLeftInGroup',
			title: localize2('moveEditorLeft', 'Move Editor Left'),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.PageUp,
				mac: {
					primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.LeftArrow)
				}
			},
			f1: true,
			category: Categories.View
		}, MOVE_ACTIVE_EDITOR_COMMAND_ID, { to: 'left' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class MoveEditorRightInGroupAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: 'workbench.action.moveEditorRightInGroup',
			title: localize2('moveEditorRight', 'Move Editor Right'),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.PageDown,
				mac: {
					primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.RightArrow)
				}
			},
			f1: true,
			category: Categories.View
		}, MOVE_ACTIVE_EDITOR_COMMAND_ID, { to: 'right' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class MoveEditorToPreviousGroupAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: 'workbench.action.moveEditorToPreviousGroup',
			title: localize2('moveEditorToPreviousGroup', 'Move Editor into Previous Group'),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.LeftArrow,
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.LeftArrow
				}
			},
			f1: true,
			category: Categories.View,
		}, MOVE_ACTIVE_EDITOR_COMMAND_ID, { to: 'previous', by: 'group' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class MoveEditorToNextGroupAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: 'workbench.action.moveEditorToNextGroup',
			title: localize2('moveEditorToNextGroup', 'Move Editor into Next Group'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.RightArrow,
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.RightArrow
				}
			},
			category: Categories.View
		}, MOVE_ACTIVE_EDITOR_COMMAND_ID, { to: 'next', by: 'group' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class MoveEditorToAboveGroupAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: MOVE_EDITOR_INTO_ABOVE_GROUP,
			title: localize2('moveEditorToAboveGroup', 'Move Editor into Group Above'),
			f1: true,
			category: Categories.View
		}, MOVE_ACTIVE_EDITOR_COMMAND_ID, { to: 'up', by: 'group' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class MoveEditorToBelowGroupAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: MOVE_EDITOR_INTO_BELOW_GROUP,
			title: localize2('moveEditorToBelowGroup', 'Move Editor into Group Below'),
			f1: true,
			category: Categories.View
		}, MOVE_ACTIVE_EDITOR_COMMAND_ID, { to: 'down', by: 'group' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class MoveEditorToLeftGroupAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: MOVE_EDITOR_INTO_LEFT_GROUP,
			title: localize2('moveEditorToLeftGroup', 'Move Editor into Left Group'),
			f1: true,
			category: Categories.View
		}, MOVE_ACTIVE_EDITOR_COMMAND_ID, { to: 'left', by: 'group' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class MoveEditorToRightGroupAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: MOVE_EDITOR_INTO_RIGHT_GROUP,
			title: localize2('moveEditorToRightGroup', 'Move Editor into Right Group'),
			f1: true,
			category: Categories.View
		}, MOVE_ACTIVE_EDITOR_COMMAND_ID, { to: 'right', by: 'group' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class MoveEditorToFirstGroupAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: 'workbench.action.moveEditorToFirstGroup',
			title: localize2('moveEditorToFirstGroup', 'Move Editor into First Group'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.Digit1,
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.Digit1
				}
			},
			category: Categories.View
		}, MOVE_ACTIVE_EDITOR_COMMAND_ID, { to: 'first', by: 'group' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class MoveEditorToLastGroupAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: 'workbench.action.moveEditorToLastGroup',
			title: localize2('moveEditorToLastGroup', 'Move Editor into Last Group'),
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.Digit9,
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.Digit9
				}
			},
			category: Categories.View
		}, MOVE_ACTIVE_EDITOR_COMMAND_ID, { to: 'last', by: 'group' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class SplitEditorToPreviousGroupAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: 'workbench.action.splitEditorToPreviousGroup',
			title: localize2('splitEditorToPreviousGroup', 'Split Editor into Previous Group'),
			f1: true,
			category: Categories.View
		}, COPY_ACTIVE_EDITOR_COMMAND_ID, { to: 'previous', by: 'group' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class SplitEditorToNextGroupAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: 'workbench.action.splitEditorToNextGroup',
			title: localize2('splitEditorToNextGroup', 'Split Editor into Next Group'),
			f1: true,
			category: Categories.View
		}, COPY_ACTIVE_EDITOR_COMMAND_ID, { to: 'next', by: 'group' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class SplitEditorToAboveGroupAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: 'workbench.action.splitEditorToAboveGroup',
			title: localize2('splitEditorToAboveGroup', 'Split Editor into Group Above'),
			f1: true,
			category: Categories.View
		}, COPY_ACTIVE_EDITOR_COMMAND_ID, { to: 'up', by: 'group' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class SplitEditorToBelowGroupAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: 'workbench.action.splitEditorToBelowGroup',
			title: localize2('splitEditorToBelowGroup', 'Split Editor into Group Below'),
			f1: true,
			category: Categories.View
		}, COPY_ACTIVE_EDITOR_COMMAND_ID, { to: 'down', by: 'group' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class SplitEditorToLeftGroupAction extends ExecuteCommandAction {

	static readonly ID = 'workbench.action.splitEditorToLeftGroup';
	static readonly LABEL = localize('splitEditorToLeftGroup', "Split Editor into Left Group");

	constructor() {
		super({
			id: 'workbench.action.splitEditorToLeftGroup',
			title: localize2('splitEditorToLeftGroup', "Split Editor into Left Group"),
			f1: true,
			category: Categories.View
		}, COPY_ACTIVE_EDITOR_COMMAND_ID, { to: 'left', by: 'group' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class SplitEditorToRightGroupAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: 'workbench.action.splitEditorToRightGroup',
			title: localize2('splitEditorToRightGroup', 'Split Editor into Right Group'),
			f1: true,
			category: Categories.View
		}, COPY_ACTIVE_EDITOR_COMMAND_ID, { to: 'right', by: 'group' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class SplitEditorToFirstGroupAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: 'workbench.action.splitEditorToFirstGroup',
			title: localize2('splitEditorToFirstGroup', 'Split Editor into First Group'),
			f1: true,
			category: Categories.View
		}, COPY_ACTIVE_EDITOR_COMMAND_ID, { to: 'first', by: 'group' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class SplitEditorToLastGroupAction extends ExecuteCommandAction {

	constructor() {
		super({
			id: 'workbench.action.splitEditorToLastGroup',
			title: localize2('splitEditorToLastGroup', 'Split Editor into Last Group'),
			f1: true,
			category: Categories.View
		}, COPY_ACTIVE_EDITOR_COMMAND_ID, { to: 'last', by: 'group' } satisfies SelectedEditorsMoveCopyArguments);
	}
}

export class EditorLayoutSingleAction extends ExecuteCommandAction {

	static readonly ID = 'workbench.action.editorLayoutSingle';

	constructor() {
		super({
			id: EditorLayoutSingleAction.ID,
			title: localize2('editorLayoutSingle', 'Single Column Editor Layout'),
			f1: true,
			category: Categories.View
		}, LAYOUT_EDITOR_GROUPS_COMMAND_ID, { groups: [{}], orientation: GroupOrientation.HORIZONTAL } satisfies EditorGroupLayout);
	}
}

export class EditorLayoutTwoColumnsAction extends ExecuteCommandAction {

	static readonly ID = 'workbench.action.editorLayoutTwoColumns';

	constructor() {
		super({
			id: EditorLayoutTwoColumnsAction.ID,
			title: localize2('editorLayoutTwoColumns', 'Two Columns Editor Layout'),
			f1: true,
			category: Categories.View
		}, LAYOUT_EDITOR_GROUPS_COMMAND_ID, { groups: [{}, {}], orientation: GroupOrientation.HORIZONTAL } satisfies EditorGroupLayout);
	}
}

export class EditorLayoutThreeColumnsAction extends ExecuteCommandAction {

	static readonly ID = 'workbench.action.editorLayoutThreeColumns';

	constructor() {
		super({
			id: EditorLayoutThreeColumnsAction.ID,
			title: localize2('editorLayoutThreeColumns', 'Three Columns Editor Layout'),
			f1: true,
			category: Categories.View
		}, LAYOUT_EDITOR_GROUPS_COMMAND_ID, { groups: [{}, {}, {}], orientation: GroupOrientation.HORIZONTAL } satisfies EditorGroupLayout);
	}
}

export class EditorLayoutTwoRowsAction extends ExecuteCommandAction {

	static readonly ID = 'workbench.action.editorLayoutTwoRows';

	constructor() {
		super({
			id: EditorLayoutTwoRowsAction.ID,
			title: localize2('editorLayoutTwoRows', 'Two Rows Editor Layout'),
			f1: true,
			category: Categories.View
		}, LAYOUT_EDITOR_GROUPS_COMMAND_ID, { groups: [{}, {}], orientation: GroupOrientation.VERTICAL } satisfies EditorGroupLayout);
	}
}

export class EditorLayoutThreeRowsAction extends ExecuteCommandAction {

	static readonly ID = 'workbench.action.editorLayoutThreeRows';

	constructor() {
		super({
			id: EditorLayoutThreeRowsAction.ID,
			title: localize2('editorLayoutThreeRows', 'Three Rows Editor Layout'),
			f1: true,
			category: Categories.View
		}, LAYOUT_EDITOR_GROUPS_COMMAND_ID, { groups: [{}, {}, {}], orientation: GroupOrientation.VERTICAL } satisfies EditorGroupLayout);
	}
}

export class EditorLayoutTwoByTwoGridAction extends ExecuteCommandAction {

	static readonly ID = 'workbench.action.editorLayoutTwoByTwoGrid';

	constructor() {
		super({
			id: EditorLayoutTwoByTwoGridAction.ID,
			title: localize2('editorLayoutTwoByTwoGrid', 'Grid Editor Layout (2x2)'),
			f1: true,
			category: Categories.View
		}, LAYOUT_EDITOR_GROUPS_COMMAND_ID, { groups: [{ groups: [{}, {}] }, { groups: [{}, {}] }], orientation: GroupOrientation.HORIZONTAL } satisfies EditorGroupLayout);
	}
}

export class EditorLayoutTwoColumnsBottomAction extends ExecuteCommandAction {

	static readonly ID = 'workbench.action.editorLayoutTwoColumnsBottom';

	constructor() {
		super({
			id: EditorLayoutTwoColumnsBottomAction.ID,
			title: localize2('editorLayoutTwoColumnsBottom', 'Two Columns Bottom Editor Layout'),
			f1: true,
			category: Categories.View
		}, LAYOUT_EDITOR_GROUPS_COMMAND_ID, { groups: [{}, { groups: [{}, {}] }], orientation: GroupOrientation.VERTICAL } satisfies EditorGroupLayout);
	}
}

export class EditorLayoutTwoRowsRightAction extends ExecuteCommandAction {

	static readonly ID = 'workbench.action.editorLayoutTwoRowsRight';

	constructor() {
		super({
			id: EditorLayoutTwoRowsRightAction.ID,
			title: localize2('editorLayoutTwoRowsRight', 'Two Rows Right Editor Layout'),
			f1: true,
			category: Categories.View
		}, LAYOUT_EDITOR_GROUPS_COMMAND_ID, { groups: [{}, { groups: [{}, {}] }], orientation: GroupOrientation.HORIZONTAL } satisfies EditorGroupLayout);
	}
}

abstract class AbstractCreateEditorGroupAction extends Action2 {

	constructor(
		desc: Readonly<IAction2Options>,
		private readonly direction: GroupDirection
	) {
		super(desc);
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);
		const layoutService = accessor.get(IWorkbenchLayoutService);

		// We are about to create a new empty editor group. We make an opiniated
		// decision here whether to focus that new editor group or not based
		// on what is currently focused. If focus is outside the editor area not
		// in the <body>, we do not focus, with the rationale that a user might
		// have focus on a tree/list with the intention to pick an element to
		// open in the new group from that tree/list.
		//
		// If focus is inside the editor area, we want to prevent the situation
		// of an editor having keyboard focus in an inactive editor group
		// (see https://github.com/microsoft/vscode/issues/189256)

		const activeDocument = getActiveDocument();
		const focusNewGroup = layoutService.hasFocus(Parts.EDITOR_PART) || activeDocument.activeElement === activeDocument.body;

		const group = editorGroupService.addGroup(editorGroupService.activeGroup, this.direction);
		editorGroupService.activateGroup(group);

		if (focusNewGroup) {
			group.focus();
		}
	}
}

export class NewEditorGroupLeftAction extends AbstractCreateEditorGroupAction {

	constructor() {
		super({
			id: 'workbench.action.newGroupLeft',
			title: localize2('newGroupLeft', 'New Editor Group to the Left'),
			f1: true,
			category: Categories.View
		}, GroupDirection.LEFT);
	}
}

export class NewEditorGroupRightAction extends AbstractCreateEditorGroupAction {

	constructor() {
		super({
			id: 'workbench.action.newGroupRight',
			title: localize2('newGroupRight', 'New Editor Group to the Right'),
			f1: true,
			category: Categories.View
		}, GroupDirection.RIGHT);
	}
}

export class NewEditorGroupAboveAction extends AbstractCreateEditorGroupAction {

	constructor() {
		super({
			id: 'workbench.action.newGroupAbove',
			title: localize2('newGroupAbove', 'New Editor Group Above'),
			f1: true,
			category: Categories.View
		}, GroupDirection.UP);
	}
}

export class NewEditorGroupBelowAction extends AbstractCreateEditorGroupAction {

	constructor() {
		super({
			id: 'workbench.action.newGroupBelow',
			title: localize2('newGroupBelow', 'New Editor Group Below'),
			f1: true,
			category: Categories.View
		}, GroupDirection.DOWN);
	}
}

export class ToggleEditorTypeAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.toggleEditorType',
			title: localize2('toggleEditorType', 'Toggle Editor Type'),
			f1: true,
			category: Categories.View,
			precondition: ActiveEditorAvailableEditorIdsContext
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editorResolverService = accessor.get(IEditorResolverService);

		const activeEditorPane = editorService.activeEditorPane;
		if (!activeEditorPane) {
			return;
		}

		const activeEditorResource = EditorResourceAccessor.getCanonicalUri(activeEditorPane.input);
		if (!activeEditorResource) {
			return;
		}

		const editorIds = editorResolverService.getEditors(activeEditorResource).map(editor => editor.id).filter(id => id !== activeEditorPane.input.editorId);
		if (editorIds.length === 0) {
			return;
		}

		// Replace the current editor with the next avaiable editor type
		await editorService.replaceEditors([
			{
				editor: activeEditorPane.input,
				replacement: {
					resource: activeEditorResource,
					options: {
						override: editorIds[0]
					}
				}
			}
		], activeEditorPane.group);
	}
}

export class ReOpenInTextEditorAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.reopenTextEditor',
			title: localize2('reopenTextEditor', 'Reopen Editor with Text Editor'),
			f1: true,
			category: Categories.View,
			precondition: ActiveEditorAvailableEditorIdsContext
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);

		const activeEditorPane = editorService.activeEditorPane;
		if (!activeEditorPane) {
			return;
		}

		const activeEditorResource = EditorResourceAccessor.getCanonicalUri(activeEditorPane.input);
		if (!activeEditorResource) {
			return;
		}

		// Replace the current editor with the text editor
		await editorService.replaceEditors([
			{
				editor: activeEditorPane.input,
				replacement: {
					resource: activeEditorResource,
					options: {
						override: DEFAULT_EDITOR_ASSOCIATION.id
					}
				}
			}
		], activeEditorPane.group);
	}
}


abstract class BaseMoveCopyEditorToNewWindowAction extends Action2 {

	constructor(
		id: string,
		title: ICommandActionTitle,
		keybinding: Omit<IKeybindingRule, 'id'> | undefined,
		private readonly move: boolean
	) {
		super({
			id,
			title,
			category: Categories.View,
			precondition: ActiveEditorContext,
			keybinding,
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor, ...args: unknown[]) {
		const editorGroupsService = accessor.get(IEditorGroupsService);
		const editorService = accessor.get(IEditorService);
		const listService = accessor.get(IListService);

		const resolvedContext = resolveCommandsContext(args, editorService, editorGroupsService, listService);
		if (!resolvedContext.groupedEditors.length) {
			return;
		}

		const auxiliaryEditorPart = await editorGroupsService.createAuxiliaryEditorPart();

		const { group, editors } = resolvedContext.groupedEditors[0]; // only single group supported for move/copy for now
		const editorsWithOptions = prepareMoveCopyEditors(group, editors, resolvedContext.preserveFocus);
		if (this.move) {
			group.moveEditors(editorsWithOptions, auxiliaryEditorPart.activeGroup);
		} else {
			group.copyEditors(editorsWithOptions, auxiliaryEditorPart.activeGroup);
		}

		auxiliaryEditorPart.activeGroup.focus();
	}
}

export class MoveEditorToNewWindowAction extends BaseMoveCopyEditorToNewWindowAction {

	constructor() {
		super(
			MOVE_EDITOR_INTO_NEW_WINDOW_COMMAND_ID,
			{
				...localize2('moveEditorToNewWindow', "Move Editor into New Window"),
				mnemonicTitle: localize({ key: 'miMoveEditorToNewWindow', comment: ['&& denotes a mnemonic'] }, "&&Move Editor into New Window"),
			},
			undefined,
			true
		);
	}
}

export class CopyEditorToNewindowAction extends BaseMoveCopyEditorToNewWindowAction {

	constructor() {
		super(
			COPY_EDITOR_INTO_NEW_WINDOW_COMMAND_ID,
			{
				...localize2('copyEditorToNewWindow', "Copy Editor into New Window"),
				mnemonicTitle: localize({ key: 'miCopyEditorToNewWindow', comment: ['&& denotes a mnemonic'] }, "&&Copy Editor into New Window"),
			},
			{ primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyO), weight: KeybindingWeight.WorkbenchContrib },
			false
		);
	}
}

abstract class BaseMoveCopyEditorGroupToNewWindowAction extends Action2 {

	constructor(
		id: string,
		title: ICommandActionTitle,
		private readonly move: boolean
	) {
		super({
			id,
			title,
			category: Categories.View,
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);
		const activeGroup = editorGroupService.activeGroup;

		const auxiliaryEditorPart = await editorGroupService.createAuxiliaryEditorPart();

		editorGroupService.mergeGroup(activeGroup, auxiliaryEditorPart.activeGroup, {
			mode: this.move ? MergeGroupMode.MOVE_EDITORS : MergeGroupMode.COPY_EDITORS
		});

		auxiliaryEditorPart.activeGroup.focus();
	}
}

export class MoveEditorGroupToNewWindowAction extends BaseMoveCopyEditorGroupToNewWindowAction {

	constructor() {
		super(
			MOVE_EDITOR_GROUP_INTO_NEW_WINDOW_COMMAND_ID,
			{
				...localize2('moveEditorGroupToNewWindow', "Move Editor Group into New Window"),
				mnemonicTitle: localize({ key: 'miMoveEditorGroupToNewWindow', comment: ['&& denotes a mnemonic'] }, "&&Move Editor Group into New Window"),
			},
			true
		);
	}
}

export class CopyEditorGroupToNewWindowAction extends BaseMoveCopyEditorGroupToNewWindowAction {

	constructor() {
		super(
			COPY_EDITOR_GROUP_INTO_NEW_WINDOW_COMMAND_ID,
			{
				...localize2('copyEditorGroupToNewWindow', "Copy Editor Group into New Window"),
				mnemonicTitle: localize({ key: 'miCopyEditorGroupToNewWindow', comment: ['&& denotes a mnemonic'] }, "&&Copy Editor Group into New Window"),
			},
			false
		);
	}
}

export class RestoreEditorsToMainWindowAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.restoreEditorsToMainWindow',
			title: {
				...localize2('restoreEditorsToMainWindow', "Restore Editors into Main Window"),
				mnemonicTitle: localize({ key: 'miRestoreEditorsToMainWindow', comment: ['&& denotes a mnemonic'] }, "&&Restore Editors into Main Window"),
			},
			f1: true,
			precondition: IsAuxiliaryWindowFocusedContext,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);

		editorGroupService.mergeAllGroups(editorGroupService.mainPart.activeGroup);
	}
}

export class NewEmptyEditorWindowAction extends Action2 {

	constructor() {
		super({
			id: NEW_EMPTY_EDITOR_WINDOW_COMMAND_ID,
			title: {
				...localize2('newEmptyEditorWindow', "New Empty Editor Window"),
				mnemonicTitle: localize({ key: 'miNewEmptyEditorWindow', comment: ['&& denotes a mnemonic'] }, "&&New Empty Editor Window"),
			},
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);

		const auxiliaryEditorPart = await editorGroupService.createAuxiliaryEditorPart();
		auxiliaryEditorPart.activeGroup.focus();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/editorAutoSave.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/editorAutoSave.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContribution } from '../../../common/contributions.js';
import { Disposable, DisposableStore, IDisposable, dispose, toDisposable } from '../../../../base/common/lifecycle.js';
import { IFilesConfigurationService, AutoSaveMode, AutoSaveDisabledReason } from '../../../services/filesConfiguration/common/filesConfigurationService.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { SaveReason, IEditorIdentifier, GroupIdentifier, EditorInputCapabilities } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IWorkingCopyService } from '../../../services/workingCopy/common/workingCopyService.js';
import { IWorkingCopy, WorkingCopyCapabilities } from '../../../services/workingCopy/common/workingCopy.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IMarkerService } from '../../../../platform/markers/common/markers.js';
import { URI } from '../../../../base/common/uri.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';

export class EditorAutoSave extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.editorAutoSave';

	// Auto save: after delay
	private readonly scheduledAutoSavesAfterDelay = new Map<IWorkingCopy, IDisposable>();

	// Auto save: focus change & window change
	private lastActiveEditor: EditorInput | undefined = undefined;
	private lastActiveGroupId: GroupIdentifier | undefined = undefined;
	private readonly lastActiveEditorControlDisposable = this._register(new DisposableStore());

	// Auto save: waiting on specific condition
	private readonly waitingOnConditionAutoSaveWorkingCopies = new ResourceMap<{ readonly workingCopy: IWorkingCopy; readonly reason: SaveReason; condition: AutoSaveDisabledReason }>(resource => this.uriIdentityService.extUri.getComparisonKey(resource));
	private readonly waitingOnConditionAutoSaveEditors = new ResourceMap<{ readonly editor: IEditorIdentifier; readonly reason: SaveReason; condition: AutoSaveDisabledReason }>(resource => this.uriIdentityService.extUri.getComparisonKey(resource));

	constructor(
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService,
		@IHostService private readonly hostService: IHostService,
		@IEditorService private readonly editorService: IEditorService,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@IWorkingCopyService private readonly workingCopyService: IWorkingCopyService,
		@ILogService private readonly logService: ILogService,
		@IMarkerService private readonly markerService: IMarkerService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService
	) {
		super();

		// Fill in initial dirty working copies
		for (const dirtyWorkingCopy of this.workingCopyService.dirtyWorkingCopies) {
			this.onDidRegister(dirtyWorkingCopy);
		}

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.hostService.onDidChangeFocus(focused => this.onWindowFocusChange(focused)));
		this._register(this.hostService.onDidChangeActiveWindow(() => this.onActiveWindowChange()));
		this._register(this.editorService.onDidActiveEditorChange(() => this.onDidActiveEditorChange()));
		this._register(this.filesConfigurationService.onDidChangeAutoSaveConfiguration(() => this.onDidChangeAutoSaveConfiguration()));

		// Working Copy events
		this._register(this.workingCopyService.onDidRegister(workingCopy => this.onDidRegister(workingCopy)));
		this._register(this.workingCopyService.onDidUnregister(workingCopy => this.onDidUnregister(workingCopy)));
		this._register(this.workingCopyService.onDidChangeDirty(workingCopy => this.onDidChangeDirty(workingCopy)));
		this._register(this.workingCopyService.onDidChangeContent(workingCopy => this.onDidChangeContent(workingCopy)));

		// Condition changes
		this._register(this.markerService.onMarkerChanged(e => this.onConditionChanged(e, AutoSaveDisabledReason.ERRORS)));
		this._register(this.filesConfigurationService.onDidChangeAutoSaveDisabled(resource => this.onConditionChanged([resource], AutoSaveDisabledReason.DISABLED)));
	}

	private onConditionChanged(resources: readonly URI[], condition: AutoSaveDisabledReason.ERRORS | AutoSaveDisabledReason.DISABLED): void {
		for (const resource of resources) {

			// Waiting working copies
			const workingCopyResult = this.waitingOnConditionAutoSaveWorkingCopies.get(resource);
			if (workingCopyResult?.condition === condition) {
				if (
					workingCopyResult.workingCopy.isDirty() &&
					this.filesConfigurationService.getAutoSaveMode(workingCopyResult.workingCopy.resource, workingCopyResult.reason).mode !== AutoSaveMode.OFF
				) {
					this.discardAutoSave(workingCopyResult.workingCopy);

					this.logService.trace(`[editor auto save] running auto save from condition change event`, workingCopyResult.workingCopy.resource.toString(), workingCopyResult.workingCopy.typeId);
					workingCopyResult.workingCopy.save({ reason: workingCopyResult.reason });
				}
			}

			// Waiting editors
			else {
				const editorResult = this.waitingOnConditionAutoSaveEditors.get(resource);
				if (
					editorResult?.condition === condition &&
					!editorResult.editor.editor.isDisposed() &&
					editorResult.editor.editor.isDirty() &&
					this.filesConfigurationService.getAutoSaveMode(editorResult.editor.editor, editorResult.reason).mode !== AutoSaveMode.OFF
				) {
					this.waitingOnConditionAutoSaveEditors.delete(resource);

					this.logService.trace(`[editor auto save] running auto save from condition change event with reason ${editorResult.reason}`);
					this.editorService.save(editorResult.editor, { reason: editorResult.reason });
				}
			}
		}
	}

	private onWindowFocusChange(focused: boolean): void {
		if (!focused) {
			this.maybeTriggerAutoSave(SaveReason.WINDOW_CHANGE);
		}
	}

	private onActiveWindowChange(): void {
		this.maybeTriggerAutoSave(SaveReason.WINDOW_CHANGE);
	}

	private onDidActiveEditorChange(): void {

		// Treat editor change like a focus change for our last active editor if any
		if (this.lastActiveEditor && typeof this.lastActiveGroupId === 'number') {
			this.maybeTriggerAutoSave(SaveReason.FOCUS_CHANGE, { groupId: this.lastActiveGroupId, editor: this.lastActiveEditor });
		}

		// Remember as last active
		const activeGroup = this.editorGroupService.activeGroup;
		const activeEditor = this.lastActiveEditor = activeGroup.activeEditor ?? undefined;
		this.lastActiveGroupId = activeGroup.id;

		// Dispose previous active control listeners
		this.lastActiveEditorControlDisposable.clear();

		// Listen to focus changes on control for auto save
		const activeEditorPane = this.editorService.activeEditorPane;
		if (activeEditor && activeEditorPane) {
			this.lastActiveEditorControlDisposable.add(activeEditorPane.onDidBlur(() => {
				this.maybeTriggerAutoSave(SaveReason.FOCUS_CHANGE, { groupId: activeGroup.id, editor: activeEditor });
			}));
		}
	}

	private maybeTriggerAutoSave(reason: SaveReason.WINDOW_CHANGE | SaveReason.FOCUS_CHANGE, editorIdentifier?: IEditorIdentifier): void {
		if (editorIdentifier) {
			if (
				!editorIdentifier.editor.isDirty() ||
				editorIdentifier.editor.isReadonly() ||
				editorIdentifier.editor.hasCapability(EditorInputCapabilities.Untitled)
			) {
				return; // no auto save for non-dirty, readonly or untitled editors
			}

			const autoSaveMode = this.filesConfigurationService.getAutoSaveMode(editorIdentifier.editor, reason);
			if (autoSaveMode.mode !== AutoSaveMode.OFF) {
				// Determine if we need to save all. In case of a window focus change we also save if
				// auto save mode is configured to be ON_FOCUS_CHANGE (editor focus change)
				if (
					(reason === SaveReason.WINDOW_CHANGE && (autoSaveMode.mode === AutoSaveMode.ON_FOCUS_CHANGE || autoSaveMode.mode === AutoSaveMode.ON_WINDOW_CHANGE)) ||
					(reason === SaveReason.FOCUS_CHANGE && autoSaveMode.mode === AutoSaveMode.ON_FOCUS_CHANGE)
				) {
					this.logService.trace(`[editor auto save] triggering auto save with reason ${reason}`);
					this.editorService.save(editorIdentifier, { reason });
				}
			} else if (editorIdentifier.editor.resource && (autoSaveMode.reason === AutoSaveDisabledReason.ERRORS || autoSaveMode.reason === AutoSaveDisabledReason.DISABLED)) {
				this.waitingOnConditionAutoSaveEditors.set(editorIdentifier.editor.resource, { editor: editorIdentifier, reason, condition: autoSaveMode.reason });
			}
		} else {
			this.saveAllDirtyAutoSaveables(reason);
		}
	}

	private onDidChangeAutoSaveConfiguration(): void {

		// Trigger a save-all when auto save is enabled
		let reason: SaveReason | undefined = undefined;
		switch (this.filesConfigurationService.getAutoSaveMode(undefined).mode) {
			case AutoSaveMode.ON_FOCUS_CHANGE:
				reason = SaveReason.FOCUS_CHANGE;
				break;
			case AutoSaveMode.ON_WINDOW_CHANGE:
				reason = SaveReason.WINDOW_CHANGE;
				break;
			case AutoSaveMode.AFTER_SHORT_DELAY:
			case AutoSaveMode.AFTER_LONG_DELAY:
				reason = SaveReason.AUTO;
				break;
		}

		if (reason) {
			this.saveAllDirtyAutoSaveables(reason);
		}
	}

	private saveAllDirtyAutoSaveables(reason: SaveReason): void {
		for (const workingCopy of this.workingCopyService.dirtyWorkingCopies) {
			if (workingCopy.capabilities & WorkingCopyCapabilities.Untitled) {
				continue; // we never auto save untitled working copies
			}

			const autoSaveMode = this.filesConfigurationService.getAutoSaveMode(workingCopy.resource, reason);
			if (autoSaveMode.mode !== AutoSaveMode.OFF) {
				workingCopy.save({ reason });
			} else if (autoSaveMode.reason === AutoSaveDisabledReason.ERRORS || autoSaveMode.reason === AutoSaveDisabledReason.DISABLED) {
				this.waitingOnConditionAutoSaveWorkingCopies.set(workingCopy.resource, { workingCopy, reason, condition: autoSaveMode.reason });
			}
		}
	}

	private onDidRegister(workingCopy: IWorkingCopy): void {
		if (workingCopy.isDirty()) {
			this.scheduleAutoSave(workingCopy);
		}
	}

	private onDidUnregister(workingCopy: IWorkingCopy): void {
		this.discardAutoSave(workingCopy);
	}

	private onDidChangeDirty(workingCopy: IWorkingCopy): void {
		if (workingCopy.isDirty()) {
			this.scheduleAutoSave(workingCopy);
		} else {
			this.discardAutoSave(workingCopy);
		}
	}

	private onDidChangeContent(workingCopy: IWorkingCopy): void {
		if (workingCopy.isDirty()) {
			// this listener will make sure that the auto save is
			// pushed out for as long as the user is still changing
			// the content of the working copy.
			this.scheduleAutoSave(workingCopy);
		}
	}

	private scheduleAutoSave(workingCopy: IWorkingCopy): void {
		if (workingCopy.capabilities & WorkingCopyCapabilities.Untitled) {
			return; // we never auto save untitled working copies
		}

		const autoSaveAfterDelay = this.filesConfigurationService.getAutoSaveConfiguration(workingCopy.resource).autoSaveDelay;
		if (typeof autoSaveAfterDelay !== 'number') {
			return; // auto save after delay must be enabled
		}

		// Clear any running auto save operation
		this.discardAutoSave(workingCopy);

		this.logService.trace(`[editor auto save] scheduling auto save after ${autoSaveAfterDelay}ms`, workingCopy.resource.toString(), workingCopy.typeId);

		// Schedule new auto save
		const handle = setTimeout(() => {

			// Clear pending
			this.discardAutoSave(workingCopy);

			// Save if dirty and unless prevented by other conditions such as error markers
			if (workingCopy.isDirty()) {
				const reason = SaveReason.AUTO;
				const autoSaveMode = this.filesConfigurationService.getAutoSaveMode(workingCopy.resource, reason);
				if (autoSaveMode.mode !== AutoSaveMode.OFF) {
					this.logService.trace(`[editor auto save] running auto save`, workingCopy.resource.toString(), workingCopy.typeId);
					workingCopy.save({ reason });
				} else if (autoSaveMode.reason === AutoSaveDisabledReason.ERRORS || autoSaveMode.reason === AutoSaveDisabledReason.DISABLED) {
					this.waitingOnConditionAutoSaveWorkingCopies.set(workingCopy.resource, { workingCopy, reason, condition: autoSaveMode.reason });
				}
			}
		}, autoSaveAfterDelay);

		// Keep in map for disposal as needed
		this.scheduledAutoSavesAfterDelay.set(workingCopy, toDisposable(() => {
			this.logService.trace(`[editor auto save] clearing pending auto save`, workingCopy.resource.toString(), workingCopy.typeId);

			clearTimeout(handle);
		}));
	}

	private discardAutoSave(workingCopy: IWorkingCopy): void {
		dispose(this.scheduledAutoSavesAfterDelay.get(workingCopy));
		this.scheduledAutoSavesAfterDelay.delete(workingCopy);

		this.waitingOnConditionAutoSaveWorkingCopies.delete(workingCopy.resource);
		this.waitingOnConditionAutoSaveEditors.delete(workingCopy.resource);
	}
}
```

--------------------------------------------------------------------------------

````
