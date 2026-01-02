---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 418
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 418 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/browser/controller/editActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/controller/editActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyChord, KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { Mimes } from '../../../../../base/common/mime.js';
import { URI } from '../../../../../base/common/uri.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { Selection } from '../../../../../editor/common/core/selection.js';
import { CommandExecutor } from '../../../../../editor/common/cursor/cursor.js';
import { EditorContextKeys } from '../../../../../editor/common/editorContextKeys.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { ILanguageConfigurationService } from '../../../../../editor/common/languages/languageConfigurationRegistry.js';
import { TrackedRangeStickiness } from '../../../../../editor/common/model.js';
import { getIconClasses } from '../../../../../editor/common/services/getIconClasses.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { LineCommentCommand, Type } from '../../../../../editor/contrib/comment/browser/lineCommentCommand.js';
import { localize, localize2 } from '../../../../../nls.js';
import { MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { InputFocusedContext, InputFocusedContextKey } from '../../../../../platform/contextkey/common/contextkeys.js';
import { IConfirmationResult, IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IQuickInputService, IQuickPickItem, QuickPickInput } from '../../../../../platform/quickinput/common/quickInput.js';
import { InlineChatController } from '../../../inlineChat/browser/inlineChatController.js';
import { CTX_INLINE_CHAT_FOCUSED } from '../../../inlineChat/common/inlineChat.js';
import { changeCellToKind, runDeleteAction } from './cellOperations.js';
import { CELL_TITLE_CELL_GROUP_ID, CELL_TITLE_OUTPUT_GROUP_ID, CellToolbarOrder, INotebookActionContext, INotebookCellActionContext, INotebookCommandContext, NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT, NotebookAction, NotebookCellAction, NotebookMultiCellAction, executeNotebookCondition, findTargetCellEditor } from './coreActions.js';
import { NotebookChangeTabDisplaySize, NotebookIndentUsingSpaces, NotebookIndentUsingTabs, NotebookIndentationToSpacesAction, NotebookIndentationToTabsAction } from './notebookIndentationActions.js';
import { CHANGE_CELL_LANGUAGE, CellEditState, DETECT_CELL_LANGUAGE, QUIT_EDIT_CELL_COMMAND_ID, getNotebookEditorFromEditorPane } from '../notebookBrowser.js';
import * as icons from '../notebookIcons.js';
import { CellEditType, CellKind, ICellEditOperation, NotebookCellExecutionState, NotebookSetting } from '../../common/notebookCommon.js';
import { NOTEBOOK_CELL_EDITABLE, NOTEBOOK_CELL_HAS_OUTPUTS, NOTEBOOK_CELL_IS_FIRST_OUTPUT, NOTEBOOK_CELL_LIST_FOCUSED, NOTEBOOK_CELL_MARKDOWN_EDIT_MODE, NOTEBOOK_CELL_TYPE, NOTEBOOK_EDITOR_EDITABLE, NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_HAS_OUTPUTS, NOTEBOOK_IS_ACTIVE_EDITOR, NOTEBOOK_OUTPUT_FOCUSED, NOTEBOOK_OUTPUT_INPUT_FOCUSED, NOTEBOOK_USE_CONSOLIDATED_OUTPUT_BUTTON } from '../../common/notebookContextKeys.js';
import { INotebookExecutionStateService } from '../../common/notebookExecutionStateService.js';
import { INotebookKernelService } from '../../common/notebookKernelService.js';
import { ICellRange } from '../../common/notebookRange.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { ILanguageDetectionService } from '../../../../services/languageDetection/common/languageDetectionWorkerService.js';
import { NotebookInlineVariablesController } from '../contrib/notebookVariables/notebookInlineVariables.js';

const CLEAR_ALL_CELLS_OUTPUTS_COMMAND_ID = 'notebook.clearAllCellsOutputs';
const EDIT_CELL_COMMAND_ID = 'notebook.cell.edit';
const DELETE_CELL_COMMAND_ID = 'notebook.cell.delete';
const QUIT_EDIT_ALL_CELLS_COMMAND_ID = 'notebook.quitEditAllCells';
export const CLEAR_CELL_OUTPUTS_COMMAND_ID = 'notebook.cell.clearOutputs';
export const SELECT_NOTEBOOK_INDENTATION_ID = 'notebook.selectIndentation';
export const COMMENT_SELECTED_CELLS_ID = 'notebook.commentSelectedCells';

registerAction2(class EditCellAction extends NotebookCellAction {
	constructor() {
		super(
			{
				id: EDIT_CELL_COMMAND_ID,
				title: localize('notebookActions.editCell', "Edit Cell"),
				keybinding: {
					when: ContextKeyExpr.and(
						NOTEBOOK_CELL_LIST_FOCUSED,
						ContextKeyExpr.not(InputFocusedContextKey),
						EditorContextKeys.hoverFocused.toNegated(),
						NOTEBOOK_OUTPUT_INPUT_FOCUSED.toNegated()
					),
					primary: KeyCode.Enter,
					weight: KeybindingWeight.WorkbenchContrib
				},
				menu: {
					id: MenuId.NotebookCellTitle,
					when: ContextKeyExpr.and(
						NOTEBOOK_EDITOR_EDITABLE.isEqualTo(true),
						NOTEBOOK_CELL_TYPE.isEqualTo('markup'),
						NOTEBOOK_CELL_MARKDOWN_EDIT_MODE.toNegated(),
						NOTEBOOK_CELL_EDITABLE),
					order: CellToolbarOrder.EditCell,
					group: CELL_TITLE_CELL_GROUP_ID
				},
				icon: icons.editIcon,
			});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void> {
		if (!context.notebookEditor.hasModel()) {
			return;
		}

		await context.notebookEditor.focusNotebookCell(context.cell, 'editor');
		const foundEditor: ICodeEditor | undefined = context.cell ? findTargetCellEditor(context, context.cell) : undefined;
		if (foundEditor && foundEditor.hasTextFocus() && InlineChatController.get(foundEditor)?.getWidgetPosition()?.lineNumber === foundEditor.getPosition()?.lineNumber) {
			InlineChatController.get(foundEditor)?.focus();
		}
	}
});

const quitEditCondition = ContextKeyExpr.and(
	NOTEBOOK_EDITOR_FOCUSED,
	InputFocusedContext,
	CTX_INLINE_CHAT_FOCUSED.toNegated()
);
registerAction2(class QuitEditCellAction extends NotebookCellAction {
	constructor() {
		super(
			{
				id: QUIT_EDIT_CELL_COMMAND_ID,
				title: localize('notebookActions.quitEdit', "Stop Editing Cell"),
				menu: {
					id: MenuId.NotebookCellTitle,
					when: ContextKeyExpr.and(
						NOTEBOOK_CELL_TYPE.isEqualTo('markup'),
						NOTEBOOK_CELL_MARKDOWN_EDIT_MODE,
						NOTEBOOK_CELL_EDITABLE),
					order: CellToolbarOrder.SaveCell,
					group: CELL_TITLE_CELL_GROUP_ID
				},
				icon: icons.stopEditIcon,
				keybinding: [
					{
						when: ContextKeyExpr.and(quitEditCondition,
							EditorContextKeys.hoverVisible.toNegated(),
							EditorContextKeys.hasNonEmptySelection.toNegated(),
							EditorContextKeys.hasMultipleSelections.toNegated()),
						primary: KeyCode.Escape,
						weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT - 5
					},
					{
						when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED,
							NOTEBOOK_OUTPUT_FOCUSED),
						primary: KeyCode.Escape,
						weight: KeybindingWeight.WorkbenchContrib + 5
					},
					{
						when: ContextKeyExpr.and(
							quitEditCondition,
							NOTEBOOK_CELL_TYPE.isEqualTo('markup')),
						primary: KeyMod.WinCtrl | KeyCode.Enter,
						win: {
							primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Enter
						},
						weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT - 5
					},
				]
			});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext) {
		if (context.cell.cellKind === CellKind.Markup) {
			context.cell.updateEditState(CellEditState.Preview, QUIT_EDIT_CELL_COMMAND_ID);
		}

		await context.notebookEditor.focusNotebookCell(context.cell, 'container', { skipReveal: true });
	}
});

registerAction2(class QuitEditAllCellsAction extends NotebookAction {
	constructor() {
		super(
			{
				id: QUIT_EDIT_ALL_CELLS_COMMAND_ID,
				title: localize('notebookActions.quitEditAllCells', "Stop Editing All Cells")
			});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext) {
		if (!context.notebookEditor.hasModel()) {
			return;
		}

		const viewModel = context.notebookEditor.getViewModel();
		if (!viewModel) {
			return;
		}

		const activeCell = context.notebookEditor.getActiveCell();

		const editingCells = viewModel.viewCells.filter(cell =>
			cell.cellKind === CellKind.Markup && cell.getEditState() === CellEditState.Editing
		);

		editingCells.forEach(cell => {
			cell.updateEditState(CellEditState.Preview, QUIT_EDIT_ALL_CELLS_COMMAND_ID);
		});

		if (activeCell) {
			await context.notebookEditor.focusNotebookCell(activeCell, 'container', { skipReveal: true });
		}
	}
});

registerAction2(class DeleteCellAction extends NotebookCellAction {
	constructor() {
		super(
			{
				id: DELETE_CELL_COMMAND_ID,
				title: localize('notebookActions.deleteCell', "Delete Cell"),
				keybinding: {
					primary: KeyCode.Delete,
					mac: {
						primary: KeyMod.CtrlCmd | KeyCode.Backspace
					},
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, ContextKeyExpr.not(InputFocusedContextKey), NOTEBOOK_OUTPUT_INPUT_FOCUSED.toNegated()),
					weight: KeybindingWeight.WorkbenchContrib
				},
				menu: [
					{
						id: MenuId.NotebookCellDelete,
						when: NOTEBOOK_EDITOR_EDITABLE,
						group: CELL_TITLE_CELL_GROUP_ID
					},
					{
						id: MenuId.InteractiveCellDelete,
						group: CELL_TITLE_CELL_GROUP_ID
					}
				],
				icon: icons.deleteCellIcon
			});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext) {
		if (!context.notebookEditor.hasModel()) {
			return;
		}

		let confirmation: IConfirmationResult;
		const notebookExecutionStateService = accessor.get(INotebookExecutionStateService);
		const runState = notebookExecutionStateService.getCellExecution(context.cell.uri)?.state;
		const configService = accessor.get(IConfigurationService);

		if (runState === NotebookCellExecutionState.Executing && configService.getValue(NotebookSetting.confirmDeleteRunningCell)) {
			const dialogService = accessor.get(IDialogService);
			const primaryButton = localize('confirmDeleteButton', "Delete");

			confirmation = await dialogService.confirm({
				type: 'question',
				message: localize('confirmDeleteButtonMessage', "This cell is running, are you sure you want to delete it?"),
				primaryButton: primaryButton,
				checkbox: {
					label: localize('doNotAskAgain', "Do not ask me again")
				}
			});

		} else {
			confirmation = { confirmed: true };
		}

		if (!confirmation.confirmed) {
			return;
		}

		if (confirmation.checkboxChecked === true) {
			await configService.updateValue(NotebookSetting.confirmDeleteRunningCell, false);
		}

		runDeleteAction(context.notebookEditor, context.cell);
	}
});

registerAction2(class ClearCellOutputsAction extends NotebookCellAction {
	constructor() {
		super({
			id: CLEAR_CELL_OUTPUTS_COMMAND_ID,
			title: localize('clearCellOutputs', 'Clear Cell Outputs'),
			menu: [
				{
					id: MenuId.NotebookCellTitle,
					when: ContextKeyExpr.and(NOTEBOOK_CELL_TYPE.isEqualTo('code'), executeNotebookCondition, NOTEBOOK_CELL_HAS_OUTPUTS, NOTEBOOK_EDITOR_EDITABLE, NOTEBOOK_CELL_EDITABLE, NOTEBOOK_USE_CONSOLIDATED_OUTPUT_BUTTON.toNegated()),
					order: CellToolbarOrder.ClearCellOutput,
					group: CELL_TITLE_OUTPUT_GROUP_ID
				},
				{
					id: MenuId.NotebookOutputToolbar,
					when: ContextKeyExpr.and(NOTEBOOK_CELL_HAS_OUTPUTS, NOTEBOOK_EDITOR_EDITABLE, NOTEBOOK_CELL_EDITABLE, NOTEBOOK_CELL_IS_FIRST_OUTPUT, NOTEBOOK_USE_CONSOLIDATED_OUTPUT_BUTTON)
				},
			],
			keybinding: {
				when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, ContextKeyExpr.not(InputFocusedContextKey), NOTEBOOK_CELL_HAS_OUTPUTS, NOTEBOOK_EDITOR_EDITABLE, NOTEBOOK_CELL_EDITABLE),
				primary: KeyMod.Alt | KeyCode.Delete,
				weight: KeybindingWeight.WorkbenchContrib
			},
			icon: icons.clearIcon
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void> {
		const notebookExecutionStateService = accessor.get(INotebookExecutionStateService);
		const editor = context.notebookEditor;
		if (!editor.hasModel() || !editor.textModel.length) {
			return;
		}

		const cell = context.cell;
		const index = editor.textModel.cells.indexOf(cell.model);

		if (index < 0) {
			return;
		}

		const computeUndoRedo = !editor.isReadOnly;
		editor.textModel.applyEdits([{ editType: CellEditType.Output, index, outputs: [] }], true, undefined, () => undefined, undefined, computeUndoRedo);

		const runState = notebookExecutionStateService.getCellExecution(context.cell.uri)?.state;
		if (runState !== NotebookCellExecutionState.Executing) {
			context.notebookEditor.textModel.applyEdits([{
				editType: CellEditType.PartialInternalMetadata, index, internalMetadata: {
					runStartTime: null,
					runStartTimeAdjustment: null,
					runEndTime: null,
					executionOrder: null,
					lastRunSuccess: null
				}
			}], true, undefined, () => undefined, undefined, computeUndoRedo);
		}
	}
});

registerAction2(class ClearAllCellOutputsAction extends NotebookAction {
	constructor() {
		super({
			id: CLEAR_ALL_CELLS_OUTPUTS_COMMAND_ID,
			title: localize('clearAllCellsOutputs', 'Clear All Outputs'),
			precondition: NOTEBOOK_HAS_OUTPUTS,
			menu: [
				{
					id: MenuId.EditorTitle,
					when: ContextKeyExpr.and(
						NOTEBOOK_IS_ACTIVE_EDITOR,
						ContextKeyExpr.notEquals('config.notebook.globalToolbar', true)
					),
					group: 'navigation',
					order: 0
				},
				{
					id: MenuId.NotebookToolbar,
					when: ContextKeyExpr.and(
						executeNotebookCondition,
						ContextKeyExpr.equals('config.notebook.globalToolbar', true)
					),
					group: 'navigation/execute',
					order: 10
				}
			],
			icon: icons.clearIcon
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		const notebookExecutionStateService = accessor.get(INotebookExecutionStateService);
		const editor = context.notebookEditor;
		if (!editor.hasModel() || !editor.textModel.length) {
			return;
		}

		const computeUndoRedo = !editor.isReadOnly;
		editor.textModel.applyEdits(
			editor.textModel.cells.map((cell, index) => ({
				editType: CellEditType.Output, index, outputs: []
			})), true, undefined, () => undefined, undefined, computeUndoRedo);

		const clearExecutionMetadataEdits = editor.textModel.cells.map((cell, index) => {
			const runState = notebookExecutionStateService.getCellExecution(cell.uri)?.state;
			if (runState !== NotebookCellExecutionState.Executing) {
				return {
					editType: CellEditType.PartialInternalMetadata, index, internalMetadata: {
						runStartTime: null,
						runStartTimeAdjustment: null,
						runEndTime: null,
						executionOrder: null,
						lastRunSuccess: null
					}
				};
			} else {
				return undefined;
			}
		}).filter(edit => !!edit) as ICellEditOperation[];
		if (clearExecutionMetadataEdits.length) {
			context.notebookEditor.textModel.applyEdits(clearExecutionMetadataEdits, true, undefined, () => undefined, undefined, computeUndoRedo);
		}

		const controller = editor.getContribution<NotebookInlineVariablesController>(NotebookInlineVariablesController.id);
		controller.clearNotebookInlineDecorations();
	}
});

interface ILanguagePickInput extends IQuickPickItem {
	languageId: string;
	description: string;
}

interface IChangeCellContext extends INotebookCellActionContext {
	// TODO@rebornix : `cells`
	// range: ICellRange;
	language?: string;
}

registerAction2(class ChangeCellLanguageAction extends NotebookCellAction<ICellRange> {
	constructor() {
		super({
			id: CHANGE_CELL_LANGUAGE,
			title: localize('changeLanguage', 'Change Cell Language'),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyM),
				when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_EDITOR_EDITABLE, NOTEBOOK_CELL_EDITABLE)
			},
			metadata: {
				description: localize('changeLanguage', 'Change Cell Language'),
				args: [
					{
						name: 'range',
						description: 'The cell range',
						schema: {
							'type': 'object',
							'required': ['start', 'end'],
							'properties': {
								'start': {
									'type': 'number'
								},
								'end': {
									'type': 'number'
								}
							}
						}
					},
					{
						name: 'language',
						description: 'The target cell language',
						schema: {
							'type': 'string'
						}
					}
				]
			}
		});
	}

	protected override getCellContextFromArgs(accessor: ServicesAccessor, context?: ICellRange, ...additionalArgs: any[]): IChangeCellContext | undefined {
		if (!context || typeof context.start !== 'number' || typeof context.end !== 'number' || context.start >= context.end) {
			return;
		}

		const language = additionalArgs.length && typeof additionalArgs[0] === 'string' ? additionalArgs[0] : undefined;
		const activeEditorContext = this.getEditorContextFromArgsOrActive(accessor);

		if (!activeEditorContext || !activeEditorContext.notebookEditor.hasModel() || context.start >= activeEditorContext.notebookEditor.getLength()) {
			return;
		}

		// TODO@rebornix, support multiple cells
		return {
			notebookEditor: activeEditorContext.notebookEditor,
			cell: activeEditorContext.notebookEditor.cellAt(context.start)!,
			language
		};
	}


	async runWithContext(accessor: ServicesAccessor, context: IChangeCellContext): Promise<void> {
		if (context.language) {
			await this.setLanguage(context, context.language);
		} else {
			await this.showLanguagePicker(accessor, context);
		}
	}

	private async showLanguagePicker(accessor: ServicesAccessor, context: IChangeCellContext) {
		const topItems: ILanguagePickInput[] = [];
		const mainItems: ILanguagePickInput[] = [];

		const languageService = accessor.get(ILanguageService);
		const modelService = accessor.get(IModelService);
		const quickInputService = accessor.get(IQuickInputService);
		const languageDetectionService = accessor.get(ILanguageDetectionService);
		const kernelService = accessor.get(INotebookKernelService);

		let languages = context.notebookEditor.activeKernel?.supportedLanguages;
		if (!languages) {
			const matchResult = kernelService.getMatchingKernel(context.notebookEditor.textModel);
			const allSupportedLanguages = matchResult.all.flatMap(kernel => kernel.supportedLanguages);
			languages = allSupportedLanguages.length > 0 ? allSupportedLanguages : languageService.getRegisteredLanguageIds();
		}

		const providerLanguages = new Set([
			...languages,
			'markdown'
		]);

		providerLanguages.forEach(languageId => {
			let description: string;
			if (context.cell.cellKind === CellKind.Markup ? (languageId === 'markdown') : (languageId === context.cell.language)) {
				description = localize('languageDescription', "({0}) - Current Language", languageId);
			} else {
				description = localize('languageDescriptionConfigured', "({0})", languageId);
			}

			const languageName = languageService.getLanguageName(languageId);
			if (!languageName) {
				// Notebook has unrecognized language
				return;
			}

			const item: ILanguagePickInput = {
				label: languageName,
				iconClasses: getIconClasses(modelService, languageService, this.getFakeResource(languageName, languageService)),
				description,
				languageId
			};

			if (languageId === 'markdown' || languageId === context.cell.language) {
				topItems.push(item);
			} else {
				mainItems.push(item);
			}
		});

		mainItems.sort((a, b) => {
			return a.description.localeCompare(b.description);
		});

		// Offer to "Auto Detect"
		const autoDetectMode: IQuickPickItem = {
			label: localize('autoDetect', "Auto Detect")
		};

		const picks: QuickPickInput[] = [
			autoDetectMode,
			{ type: 'separator', label: localize('languagesPicks', "languages (identifier)") },
			...topItems,
			{ type: 'separator' },
			...mainItems
		];

		const selection = await quickInputService.pick(picks, { placeHolder: localize('pickLanguageToConfigure', "Select Language Mode") });
		const languageId = selection === autoDetectMode
			? await languageDetectionService.detectLanguage(context.cell.uri)
			: (selection as ILanguagePickInput)?.languageId;

		if (languageId) {
			await this.setLanguage(context, languageId);
		}
	}

	private async setLanguage(context: IChangeCellContext, languageId: string) {
		await setCellToLanguage(languageId, context);
	}

	/**
	 * Copied from editorStatus.ts
	 */
	private getFakeResource(lang: string, languageService: ILanguageService): URI | undefined {
		let fakeResource: URI | undefined;

		const languageId = languageService.getLanguageIdByLanguageName(lang);
		if (languageId) {
			const extensions = languageService.getExtensions(languageId);
			if (extensions.length) {
				fakeResource = URI.file(extensions[0]);
			} else {
				const filenames = languageService.getFilenames(languageId);
				if (filenames.length) {
					fakeResource = URI.file(filenames[0]);
				}
			}
		}

		return fakeResource;
	}
});

registerAction2(class DetectCellLanguageAction extends NotebookCellAction {
	constructor() {
		super({
			id: DETECT_CELL_LANGUAGE,
			title: localize2('detectLanguage', "Accept Detected Language for Cell"),
			f1: true,
			precondition: ContextKeyExpr.and(NOTEBOOK_EDITOR_EDITABLE, NOTEBOOK_CELL_EDITABLE),
			keybinding: { primary: KeyCode.KeyD | KeyMod.Alt | KeyMod.Shift, weight: KeybindingWeight.WorkbenchContrib }
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void> {
		const languageDetectionService = accessor.get(ILanguageDetectionService);
		const notificationService = accessor.get(INotificationService);
		const kernelService = accessor.get(INotebookKernelService);
		const kernel = kernelService.getSelectedOrSuggestedKernel(context.notebookEditor.textModel);
		const providerLanguages = [...kernel?.supportedLanguages ?? []];
		providerLanguages.push('markdown');
		const detection = await languageDetectionService.detectLanguage(context.cell.uri, providerLanguages);
		if (detection) {
			setCellToLanguage(detection, context);
		} else {
			notificationService.warn(localize('noDetection', "Unable to detect cell language"));
		}
	}
});

async function setCellToLanguage(languageId: string, context: IChangeCellContext) {
	if (languageId === 'markdown' && context.cell?.language !== 'markdown') {
		const idx = context.notebookEditor.getCellIndex(context.cell);
		await changeCellToKind(CellKind.Markup, { cell: context.cell, notebookEditor: context.notebookEditor, ui: true }, 'markdown', Mimes.markdown);
		const newCell = context.notebookEditor.cellAt(idx);

		if (newCell) {
			await context.notebookEditor.focusNotebookCell(newCell, 'editor');
		}
	} else if (languageId !== 'markdown' && context.cell?.cellKind === CellKind.Markup) {
		await changeCellToKind(CellKind.Code, { cell: context.cell, notebookEditor: context.notebookEditor, ui: true }, languageId);
	} else {
		const index = context.notebookEditor.textModel.cells.indexOf(context.cell.model);
		context.notebookEditor.textModel.applyEdits(
			[{ editType: CellEditType.CellLanguage, index, language: languageId }],
			true, undefined, () => undefined, undefined, !context.notebookEditor.isReadOnly
		);
	}
}

registerAction2(class SelectNotebookIndentation extends NotebookAction {
	constructor() {
		super({
			id: SELECT_NOTEBOOK_INDENTATION_ID,
			title: localize2('selectNotebookIndentation', 'Select Indentation'),
			f1: true,
			precondition: ContextKeyExpr.and(NOTEBOOK_IS_ACTIVE_EDITOR, NOTEBOOK_EDITOR_EDITABLE, NOTEBOOK_CELL_EDITABLE),
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		await this.showNotebookIndentationPicker(accessor, context);
	}

	private async showNotebookIndentationPicker(accessor: ServicesAccessor, context: INotebookActionContext) {
		const quickInputService = accessor.get(IQuickInputService);
		const editorService = accessor.get(IEditorService);
		const instantiationService = accessor.get(IInstantiationService);

		const activeNotebook = getNotebookEditorFromEditorPane(editorService.activeEditorPane);
		if (!activeNotebook || activeNotebook.isDisposed) {
			return quickInputService.pick([{ label: localize('noNotebookEditor', "No notebook editor active at this time") }]);
		}

		if (activeNotebook.isReadOnly) {
			return quickInputService.pick([{ label: localize('noWritableCodeEditor', "The active notebook editor is read-only.") }]);
		}

		const picks: QuickPickInput<IQuickPickItem & { run(): void }>[] = [
			new NotebookIndentUsingTabs(), // indent using tabs
			new NotebookIndentUsingSpaces(), // indent using spaces
			new NotebookChangeTabDisplaySize(), // change tab size
			new NotebookIndentationToTabsAction(), // convert indentation to tabs
			new NotebookIndentationToSpacesAction() // convert indentation to spaces
		].map(item => {
			return {
				id: item.desc.id,
				label: item.desc.title.toString(),
				run: () => {
					instantiationService.invokeFunction(item.run);
				}
			};
		});

		picks.splice(3, 0, { type: 'separator', label: localize('indentConvert', "convert file") });
		picks.unshift({ type: 'separator', label: localize('indentView', "change view") });

		const action = await quickInputService.pick(picks, { placeHolder: localize('pickAction', "Select Action"), matchOnDetail: true });
		if (!action) {
			return;
		}
		action.run();
		context.notebookEditor.focus();
		return;
	}
});

registerAction2(class CommentSelectedCellsAction extends NotebookMultiCellAction {
	constructor() {
		super({
			id: COMMENT_SELECTED_CELLS_ID,
			title: localize('commentSelectedCells', "Comment Selected Cells"),
			keybinding: {
				when: ContextKeyExpr.and(
					NOTEBOOK_EDITOR_FOCUSED,
					NOTEBOOK_EDITOR_EDITABLE,
					ContextKeyExpr.not(InputFocusedContextKey),
				),
				primary: KeyMod.CtrlCmd | KeyCode.Slash,
				weight: KeybindingWeight.WorkbenchContrib
			}
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext): Promise<void> {
		const languageConfigurationService = accessor.get(ILanguageConfigurationService);

		context.selectedCells.forEach(async cellViewModel => {
			const textModel = await cellViewModel.resolveTextModel();

			const commentsOptions = cellViewModel.commentOptions;
			const cellCommentCommand = new LineCommentCommand(
				languageConfigurationService,
				new Selection(1, 1, textModel.getLineCount(), textModel.getLineMaxColumn(textModel.getLineCount())), // comment the entire cell
				textModel.getOptions().tabSize,
				Type.Toggle,
				commentsOptions.insertSpace ?? true,
				commentsOptions.ignoreEmptyLines ?? true,
				false
			);

			// store any selections that are in the cell, allows them to be shifted by comments and preserved
			const cellEditorSelections = cellViewModel.getSelections();
			const initialTrackedRangesIDs: string[] = cellEditorSelections.map(selection => {
				return textModel._setTrackedRange(null, selection, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges);
			});

			CommandExecutor.executeCommands(textModel, cellEditorSelections, [cellCommentCommand]);

			const newTrackedSelections = initialTrackedRangesIDs.map(i => {
				return textModel._getTrackedRange(i);
			}).filter(r => !!r).map((range,) => {
				return new Selection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
			});
			cellViewModel.setSelections(newTrackedSelections ?? []);
		}); // end of cells forEach
	}

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/controller/executeActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/controller/executeActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Iterable } from '../../../../../base/common/iterator.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { URI, UriComponents } from '../../../../../base/common/uri.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { localize, localize2 } from '../../../../../nls.js';
import { MenuId, MenuRegistry, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IDebugService } from '../../../debug/common/debug.js';
import { CTX_INLINE_CHAT_FOCUSED } from '../../../inlineChat/common/inlineChat.js';
import { insertCell } from './cellOperations.js';
import { CELL_TITLE_CELL_GROUP_ID, CellToolbarOrder, INotebookActionContext, INotebookCellActionContext, INotebookCellToolbarActionContext, INotebookCommandContext, NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT, NotebookAction, NotebookCellAction, NotebookMultiCellAction, cellExecutionArgs, getContextFromActiveEditor, getContextFromUri, parseMultiCellExecutionArgs } from './coreActions.js';
import { CellEditState, CellFocusMode, EXECUTE_CELL_COMMAND_ID, IActiveNotebookEditor, ICellViewModel, IFocusNotebookCellOptions, ScrollToRevealBehavior } from '../notebookBrowser.js';
import * as icons from '../notebookIcons.js';
import { CellKind, CellUri, NotebookSetting } from '../../common/notebookCommon.js';
import { NOTEBOOK_CELL_EXECUTING, NOTEBOOK_CELL_EXECUTION_STATE, NOTEBOOK_CELL_LIST_FOCUSED, NOTEBOOK_CELL_TYPE, NOTEBOOK_HAS_RUNNING_CELL, NOTEBOOK_HAS_SOMETHING_RUNNING, NOTEBOOK_INTERRUPTIBLE_KERNEL, NOTEBOOK_IS_ACTIVE_EDITOR, NOTEBOOK_KERNEL_COUNT, NOTEBOOK_KERNEL_SOURCE_COUNT, NOTEBOOK_LAST_CELL_FAILED, NOTEBOOK_MISSING_KERNEL_EXTENSION } from '../../common/notebookContextKeys.js';
import { NotebookEditorInput } from '../../common/notebookEditorInput.js';
import { INotebookExecutionStateService } from '../../common/notebookExecutionStateService.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { CodeCellViewModel } from '../viewModel/codeCellViewModel.js';

const EXECUTE_NOTEBOOK_COMMAND_ID = 'notebook.execute';
const CANCEL_NOTEBOOK_COMMAND_ID = 'notebook.cancelExecution';
const INTERRUPT_NOTEBOOK_COMMAND_ID = 'notebook.interruptExecution';
const CANCEL_CELL_COMMAND_ID = 'notebook.cell.cancelExecution';
const EXECUTE_CELL_FOCUS_CONTAINER_COMMAND_ID = 'notebook.cell.executeAndFocusContainer';
const EXECUTE_CELL_SELECT_BELOW = 'notebook.cell.executeAndSelectBelow';
const EXECUTE_CELL_INSERT_BELOW = 'notebook.cell.executeAndInsertBelow';
const EXECUTE_CELL_AND_BELOW = 'notebook.cell.executeCellAndBelow';
const EXECUTE_CELLS_ABOVE = 'notebook.cell.executeCellsAbove';
const RENDER_ALL_MARKDOWN_CELLS = 'notebook.renderAllMarkdownCells';
const REVEAL_RUNNING_CELL = 'notebook.revealRunningCell';
const REVEAL_LAST_FAILED_CELL = 'notebook.revealLastFailedCell';

// If this changes, update getCodeCellExecutionContextKeyService to match
export const executeCondition = ContextKeyExpr.and(
	NOTEBOOK_CELL_TYPE.isEqualTo('code'),
	ContextKeyExpr.or(
		ContextKeyExpr.greater(NOTEBOOK_KERNEL_COUNT.key, 0),
		ContextKeyExpr.greater(NOTEBOOK_KERNEL_SOURCE_COUNT.key, 0),
		NOTEBOOK_MISSING_KERNEL_EXTENSION
	));

export const executeThisCellCondition = ContextKeyExpr.and(
	executeCondition,
	NOTEBOOK_CELL_EXECUTING.toNegated());

export const executeSectionCondition = ContextKeyExpr.and(
	NOTEBOOK_CELL_TYPE.isEqualTo('markup'),
);

function renderAllMarkdownCells(context: INotebookActionContext): void {
	for (let i = 0; i < context.notebookEditor.getLength(); i++) {
		const cell = context.notebookEditor.cellAt(i);

		if (cell.cellKind === CellKind.Markup) {
			cell.updateEditState(CellEditState.Preview, 'renderAllMarkdownCells');
		}
	}
}

async function runCell(editorGroupsService: IEditorGroupsService, context: INotebookActionContext, editorService?: IEditorService): Promise<void> {
	const group = editorGroupsService.activeGroup;

	if (group) {
		if (group.activeEditor) {
			group.pinEditor(group.activeEditor);
		}
	}

	// If auto-reveal is enabled, ensure the notebook editor is visible before revealing cells
	if (context.autoReveal && (context.cell || context.selectedCells?.length) && editorService) {
		editorService.openEditor({ resource: context.notebookEditor.textModel.uri, options: { revealIfOpened: true } });
	}

	if (context.ui && context.cell) {
		if (context.autoReveal) {
			handleAutoReveal(context.cell, context.notebookEditor);
		}
		await context.notebookEditor.executeNotebookCells(Iterable.single(context.cell));
	} else if (context.selectedCells?.length || context.cell) {
		const selectedCells = context.selectedCells?.length ? context.selectedCells : [context.cell!];
		const firstCell = selectedCells[0];

		if (firstCell && context.autoReveal) {
			handleAutoReveal(firstCell, context.notebookEditor);
		}
		await context.notebookEditor.executeNotebookCells(selectedCells);
	}

	let foundEditor: ICodeEditor | undefined = undefined;
	for (const [, codeEditor] of context.notebookEditor.codeEditors) {
		if (isEqual(codeEditor.getModel()?.uri, (context.cell ?? context.selectedCells?.[0])?.uri)) {
			foundEditor = codeEditor;
			break;
		}
	}

	if (!foundEditor) {
		return;
	}
}

const SMART_VIEWPORT_TOP_REVEAL_PADDING = 20; // enough to not cut off top of cell toolbar
const SMART_VIEWPORT_BOTTOM_REVEAL_PADDING = 60; // enough to show full bottom of output element + tiny buffer below that vertical bar
function handleAutoReveal(cell: ICellViewModel, notebookEditor: IActiveNotebookEditor): void {
	// always focus the container, blue bar is a good visual aid in tracking what's happening
	notebookEditor.focusNotebookCell(cell, 'container', { skipReveal: true });

	// Handle markup cells with simple reveal
	if (cell.cellKind === CellKind.Markup) {
		const cellIndex = notebookEditor.getCellIndex(cell);
		notebookEditor.revealCellRangeInView({ start: cellIndex, end: cellIndex + 1 });
		return;
	}

	// Ensure we're working with a code cell - we need the CodeCellViewModel type for accessing layout properties like outputTotalHeight
	if (!(cell instanceof CodeCellViewModel)) {
		return;
	}

	// Get all dimensions
	const cellEditorScrollTop = notebookEditor.getAbsoluteTopOfElement(cell);
	const cellEditorScrollBottom = cellEditorScrollTop + cell.layoutInfo.outputContainerOffset;

	const cellOutputHeight = cell.layoutInfo.outputTotalHeight;
	const cellOutputScrollBottom = notebookEditor.getAbsoluteBottomOfElement(cell);

	const viewportHeight = notebookEditor.getLayoutInfo().height;
	const viewportHeight34 = viewportHeight * 0.34;
	const viewportHeight66 = viewportHeight * 0.66;

	const totalHeight = cell.layoutInfo.totalHeight;

	const isFullyVisible = cellEditorScrollTop >= notebookEditor.scrollTop && cellOutputScrollBottom <= notebookEditor.scrollBottom;
	const isEditorBottomVisible = ((cellEditorScrollBottom - 25 /* padding for the cell status bar */) >= notebookEditor.scrollTop) &&
		((cellEditorScrollBottom + 25 /* padding to see a sliver of the beginning of outputs */) <= notebookEditor.scrollBottom);

	// Common scrolling functions
	const revealWithTopPadding = (position: number) => { notebookEditor.setScrollTop(position - SMART_VIEWPORT_TOP_REVEAL_PADDING); };
	const revealWithNoPadding = (position: number) => { notebookEditor.setScrollTop(position); };
	const revealWithBottomPadding = (position: number) => { notebookEditor.setScrollTop(position + SMART_VIEWPORT_BOTTOM_REVEAL_PADDING); };

	// CASE 0: Total is already visible
	if (isFullyVisible) {
		return;
	}

	// CASE 1: Total fits within viewport
	if (totalHeight <= viewportHeight && !isEditorBottomVisible) {
		revealWithTopPadding(cellEditorScrollTop);
		return;
	}

	// CASE 2: Total doesn't fit in the viewport
	if (totalHeight > viewportHeight && !isEditorBottomVisible) {
		if (cellOutputHeight > 0 && cellOutputHeight >= viewportHeight66) {
			// has large outputs -- Show 34% editor, 66% output
			revealWithNoPadding(cellEditorScrollBottom - viewportHeight34);
		} else if (cellOutputHeight > 0) {
			// has small outputs -- Show output at viewport bottom
			revealWithBottomPadding(cellOutputScrollBottom - viewportHeight);
		} else {
			// No outputs, just big cell -- put editor bottom @ 2/3 of viewport height
			revealWithNoPadding(cellEditorScrollBottom - viewportHeight66);
		}
	}
}

registerAction2(class RenderAllMarkdownCellsAction extends NotebookAction {
	constructor() {
		super({
			id: RENDER_ALL_MARKDOWN_CELLS,
			title: localize('notebookActions.renderMarkdown', "Render All Markdown Cells"),
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		renderAllMarkdownCells(context);
	}
});

registerAction2(class ExecuteNotebookAction extends NotebookAction {
	constructor() {
		super({
			id: EXECUTE_NOTEBOOK_COMMAND_ID,
			title: localize('notebookActions.executeNotebook', "Run All"),
			icon: icons.executeAllIcon,
			metadata: {
				description: localize('notebookActions.executeNotebook', "Run All"),
				args: [
					{
						name: 'uri',
						description: 'The document uri'
					}
				]
			},
			menu: [
				{
					id: MenuId.EditorTitle,
					order: -1,
					group: 'navigation',
					when: ContextKeyExpr.and(
						NOTEBOOK_IS_ACTIVE_EDITOR,
						ContextKeyExpr.or(NOTEBOOK_INTERRUPTIBLE_KERNEL.toNegated(), NOTEBOOK_HAS_SOMETHING_RUNNING.toNegated()),
						ContextKeyExpr.notEquals('config.notebook.globalToolbar', true)
					)
				},
				{
					id: MenuId.NotebookToolbar,
					order: -1,
					group: 'navigation/execute',
					when: ContextKeyExpr.and(
						ContextKeyExpr.or(
							NOTEBOOK_INTERRUPTIBLE_KERNEL.toNegated(),
							NOTEBOOK_HAS_SOMETHING_RUNNING.toNegated(),
						),
						ContextKeyExpr.and(NOTEBOOK_HAS_SOMETHING_RUNNING, NOTEBOOK_INTERRUPTIBLE_KERNEL.toNegated())?.negate(),
						ContextKeyExpr.equals('config.notebook.globalToolbar', true)
					)
				}
			]
		});
	}

	override getEditorContextFromArgsOrActive(accessor: ServicesAccessor, context?: UriComponents): INotebookActionContext | undefined {
		return getContextFromUri(accessor, context) ?? getContextFromActiveEditor(accessor.get(IEditorService));
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		renderAllMarkdownCells(context);

		const editorService = accessor.get(IEditorService);
		const editor = editorService.findEditors({
			resource: context.notebookEditor.textModel.uri,
			typeId: NotebookEditorInput.ID,
			editorId: context.notebookEditor.textModel.viewType
		}).at(0);
		const editorGroupService = accessor.get(IEditorGroupsService);

		if (editor) {
			const group = editorGroupService.getGroup(editor.groupId);
			group?.pinEditor(editor.editor);
		}

		return context.notebookEditor.executeNotebookCells();
	}
});

registerAction2(class ExecuteCell extends NotebookMultiCellAction {
	constructor() {
		super({
			id: EXECUTE_CELL_COMMAND_ID,
			precondition: executeThisCellCondition,
			title: localize('notebookActions.execute', "Execute Cell"),
			keybinding: {
				when: NOTEBOOK_CELL_LIST_FOCUSED,
				primary: KeyMod.WinCtrl | KeyCode.Enter,
				win: {
					primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Enter
				},
				weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT
			},
			menu: {
				id: MenuId.NotebookCellExecutePrimary,
				when: executeThisCellCondition,
				group: 'inline'
			},
			metadata: {
				description: localize('notebookActions.execute', "Execute Cell"),
				args: cellExecutionArgs
			},
			icon: icons.executeIcon
		});
	}

	override parseArgs(accessor: ServicesAccessor, ...args: unknown[]): INotebookCommandContext | undefined {
		return parseMultiCellExecutionArgs(accessor, ...args);
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		const editorGroupsService = accessor.get(IEditorGroupsService);
		const editorService = accessor.get(IEditorService);

		if (context.ui) {
			await context.notebookEditor.focusNotebookCell(context.cell, 'container', { skipReveal: true });
		}

		await runCell(editorGroupsService, context, editorService);
	}
});

registerAction2(class ExecuteAboveCells extends NotebookMultiCellAction {
	constructor() {
		super({
			id: EXECUTE_CELLS_ABOVE,
			precondition: executeCondition,
			title: localize('notebookActions.executeAbove', "Execute Above Cells"),
			menu: [
				{
					id: MenuId.NotebookCellExecute,
					when: ContextKeyExpr.and(
						executeCondition,
						ContextKeyExpr.equals(`config.${NotebookSetting.consolidatedRunButton}`, true))
				},
				{
					id: MenuId.NotebookCellTitle,
					order: CellToolbarOrder.ExecuteAboveCells,
					group: CELL_TITLE_CELL_GROUP_ID,
					when: ContextKeyExpr.and(
						executeCondition,
						ContextKeyExpr.equals(`config.${NotebookSetting.consolidatedRunButton}`, false))
				}
			],
			icon: icons.executeAboveIcon
		});
	}

	override parseArgs(accessor: ServicesAccessor, ...args: unknown[]): INotebookCommandContext | undefined {
		return parseMultiCellExecutionArgs(accessor, ...args);
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		let endCellIdx: number | undefined = undefined;
		if (context.ui) {
			endCellIdx = context.notebookEditor.getCellIndex(context.cell);
			await context.notebookEditor.focusNotebookCell(context.cell, 'container', { skipReveal: true });
		} else {
			endCellIdx = Math.min(...context.selectedCells.map(cell => context.notebookEditor.getCellIndex(cell)));
		}

		if (typeof endCellIdx === 'number') {
			const range = { start: 0, end: endCellIdx };
			const cells = context.notebookEditor.getCellsInRange(range);
			context.notebookEditor.executeNotebookCells(cells);
		}
	}
});

registerAction2(class ExecuteCellAndBelow extends NotebookMultiCellAction {
	constructor() {
		super({
			id: EXECUTE_CELL_AND_BELOW,
			precondition: executeCondition,
			title: localize('notebookActions.executeBelow', "Execute Cell and Below"),
			menu: [
				{
					id: MenuId.NotebookCellExecute,
					when: ContextKeyExpr.and(
						executeCondition,
						ContextKeyExpr.equals(`config.${NotebookSetting.consolidatedRunButton}`, true))
				},
				{
					id: MenuId.NotebookCellTitle,
					order: CellToolbarOrder.ExecuteCellAndBelow,
					group: CELL_TITLE_CELL_GROUP_ID,
					when: ContextKeyExpr.and(
						executeCondition,
						ContextKeyExpr.equals(`config.${NotebookSetting.consolidatedRunButton}`, false))
				}
			],
			icon: icons.executeBelowIcon
		});
	}

	override parseArgs(accessor: ServicesAccessor, ...args: unknown[]): INotebookCommandContext | undefined {
		return parseMultiCellExecutionArgs(accessor, ...args);
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		let startCellIdx: number | undefined = undefined;
		if (context.ui) {
			startCellIdx = context.notebookEditor.getCellIndex(context.cell);
			await context.notebookEditor.focusNotebookCell(context.cell, 'container', { skipReveal: true });
		} else {
			startCellIdx = Math.min(...context.selectedCells.map(cell => context.notebookEditor.getCellIndex(cell)));
		}

		if (typeof startCellIdx === 'number') {
			const range = { start: startCellIdx, end: context.notebookEditor.getLength() };
			const cells = context.notebookEditor.getCellsInRange(range);
			context.notebookEditor.executeNotebookCells(cells);
		}
	}
});

registerAction2(class ExecuteCellFocusContainer extends NotebookMultiCellAction {
	constructor() {
		super({
			id: EXECUTE_CELL_FOCUS_CONTAINER_COMMAND_ID,
			precondition: executeThisCellCondition,
			title: localize('notebookActions.executeAndFocusContainer', "Execute Cell and Focus Container"),
			metadata: {
				description: localize('notebookActions.executeAndFocusContainer', "Execute Cell and Focus Container"),
				args: cellExecutionArgs
			},
			icon: icons.executeIcon
		});
	}

	override parseArgs(accessor: ServicesAccessor, ...args: unknown[]): INotebookCommandContext | undefined {
		return parseMultiCellExecutionArgs(accessor, ...args);
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		const editorGroupsService = accessor.get(IEditorGroupsService);
		const editorService = accessor.get(IEditorService);

		if (context.ui) {
			await context.notebookEditor.focusNotebookCell(context.cell, 'container', { skipReveal: true });
		} else {
			const firstCell = context.selectedCells[0];

			if (firstCell) {
				await context.notebookEditor.focusNotebookCell(firstCell, 'container', { skipReveal: true });
			}
		}

		await runCell(editorGroupsService, context, editorService);
	}
});

const cellCancelCondition = ContextKeyExpr.or(
	ContextKeyExpr.equals(NOTEBOOK_CELL_EXECUTION_STATE.key, 'executing'),
	ContextKeyExpr.equals(NOTEBOOK_CELL_EXECUTION_STATE.key, 'pending'),
);

registerAction2(class CancelExecuteCell extends NotebookMultiCellAction {
	constructor() {
		super({
			id: CANCEL_CELL_COMMAND_ID,
			precondition: cellCancelCondition,
			title: localize('notebookActions.cancel', "Stop Cell Execution"),
			icon: icons.stopIcon,
			menu: {
				id: MenuId.NotebookCellExecutePrimary,
				when: cellCancelCondition,
				group: 'inline'
			},
			metadata: {
				description: localize('notebookActions.cancel', "Stop Cell Execution"),
				args: [
					{
						name: 'options',
						description: 'The cell range options',
						schema: {
							'type': 'object',
							'required': ['ranges'],
							'properties': {
								'ranges': {
									'type': 'array',
									items: [
										{
											'type': 'object',
											'required': ['start', 'end'],
											'properties': {
												'start': {
													'type': 'number'
												},
												'end': {
													'type': 'number'
												}
											}
										}
									]
								},
								'document': {
									'type': 'object',
									'description': 'The document uri',
								}
							}
						}
					}
				]
			},
		});
	}

	override parseArgs(accessor: ServicesAccessor, ...args: unknown[]): INotebookCommandContext | undefined {
		return parseMultiCellExecutionArgs(accessor, ...args);
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		if (context.ui) {
			await context.notebookEditor.focusNotebookCell(context.cell, 'container', { skipReveal: true });
			return context.notebookEditor.cancelNotebookCells(Iterable.single(context.cell));
		} else {
			return context.notebookEditor.cancelNotebookCells(context.selectedCells);
		}
	}
});

registerAction2(class ExecuteCellSelectBelow extends NotebookCellAction {
	constructor() {
		super({
			id: EXECUTE_CELL_SELECT_BELOW,
			precondition: ContextKeyExpr.or(executeThisCellCondition, NOTEBOOK_CELL_TYPE.isEqualTo('markup')),
			title: localize('notebookActions.executeAndSelectBelow', "Execute Notebook Cell and Select Below"),
			keybinding: {
				when: ContextKeyExpr.and(
					NOTEBOOK_CELL_LIST_FOCUSED,
					CTX_INLINE_CHAT_FOCUSED.negate()
				),
				primary: KeyMod.Shift | KeyCode.Enter,
				weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT
			},
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void> {
		const editorGroupsService = accessor.get(IEditorGroupsService);
		const editorService = accessor.get(IEditorService);
		const idx = context.notebookEditor.getCellIndex(context.cell);
		if (typeof idx !== 'number') {
			return;
		}
		const languageService = accessor.get(ILanguageService);

		const config = accessor.get(IConfigurationService);
		const scrollBehavior = config.getValue(NotebookSetting.scrollToRevealCell);
		let focusOptions: IFocusNotebookCellOptions;
		if (scrollBehavior === 'none') {
			focusOptions = { skipReveal: true };
		} else {
			focusOptions = {
				revealBehavior: scrollBehavior === 'fullCell' ? ScrollToRevealBehavior.fullCell : ScrollToRevealBehavior.firstLine
			};
		}

		if (context.cell.cellKind === CellKind.Markup) {
			const nextCell = context.notebookEditor.cellAt(idx + 1);
			context.cell.updateEditState(CellEditState.Preview, EXECUTE_CELL_SELECT_BELOW);
			if (nextCell) {
				await context.notebookEditor.focusNotebookCell(nextCell, 'container', focusOptions);
			} else {
				const newCell = insertCell(languageService, context.notebookEditor, idx, CellKind.Markup, 'below');

				if (newCell) {
					await context.notebookEditor.focusNotebookCell(newCell, 'editor', focusOptions);
				}
			}
			return;
		} else {
			const nextCell = context.notebookEditor.cellAt(idx + 1);
			if (nextCell) {
				await context.notebookEditor.focusNotebookCell(nextCell, 'container', focusOptions);
			} else {
				const newCell = insertCell(languageService, context.notebookEditor, idx, CellKind.Code, 'below');

				if (newCell) {
					await context.notebookEditor.focusNotebookCell(newCell, 'editor', focusOptions);
				}
			}

			return runCell(editorGroupsService, context, editorService);
		}
	}
});

registerAction2(class ExecuteCellInsertBelow extends NotebookCellAction {
	constructor() {
		super({
			id: EXECUTE_CELL_INSERT_BELOW,
			precondition: ContextKeyExpr.or(executeThisCellCondition, NOTEBOOK_CELL_TYPE.isEqualTo('markup')),
			title: localize('notebookActions.executeAndInsertBelow', "Execute Notebook Cell and Insert Below"),
			keybinding: {
				when: NOTEBOOK_CELL_LIST_FOCUSED,
				primary: KeyMod.Alt | KeyCode.Enter,
				weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT
			},
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void> {
		const editorGroupsService = accessor.get(IEditorGroupsService);
		const editorService = accessor.get(IEditorService);
		const idx = context.notebookEditor.getCellIndex(context.cell);
		const languageService = accessor.get(ILanguageService);
		const newFocusMode = context.cell.focusMode === CellFocusMode.Editor ? 'editor' : 'container';

		const newCell = insertCell(languageService, context.notebookEditor, idx, context.cell.cellKind, 'below');
		if (newCell) {
			await context.notebookEditor.focusNotebookCell(newCell, newFocusMode);
		}

		if (context.cell.cellKind === CellKind.Markup) {
			context.cell.updateEditState(CellEditState.Preview, EXECUTE_CELL_INSERT_BELOW);
		} else {
			runCell(editorGroupsService, context, editorService);
		}
	}
});

class CancelNotebook extends NotebookAction {
	override getEditorContextFromArgsOrActive(accessor: ServicesAccessor, context?: UriComponents): INotebookActionContext | undefined {
		return getContextFromUri(accessor, context) ?? getContextFromActiveEditor(accessor.get(IEditorService));
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		return context.notebookEditor.cancelNotebookCells();
	}
}

registerAction2(class CancelAllNotebook extends CancelNotebook {
	constructor() {
		super({
			id: CANCEL_NOTEBOOK_COMMAND_ID,
			title: localize2('notebookActions.cancelNotebook', "Stop Execution"),
			icon: icons.stopIcon,
			menu: [
				{
					id: MenuId.EditorTitle,
					order: -1,
					group: 'navigation',
					when: ContextKeyExpr.and(
						NOTEBOOK_IS_ACTIVE_EDITOR,
						NOTEBOOK_HAS_SOMETHING_RUNNING,
						NOTEBOOK_INTERRUPTIBLE_KERNEL.toNegated(),
						ContextKeyExpr.notEquals('config.notebook.globalToolbar', true)
					)
				},
				{
					id: MenuId.NotebookToolbar,
					order: -1,
					group: 'navigation/execute',
					when: ContextKeyExpr.and(
						NOTEBOOK_HAS_SOMETHING_RUNNING,
						NOTEBOOK_INTERRUPTIBLE_KERNEL.toNegated(),
						ContextKeyExpr.equals('config.notebook.globalToolbar', true)
					)
				}
			]
		});
	}
});

registerAction2(class InterruptNotebook extends CancelNotebook {
	constructor() {
		super({
			id: INTERRUPT_NOTEBOOK_COMMAND_ID,
			title: localize2('notebookActions.interruptNotebook', "Interrupt"),
			precondition: ContextKeyExpr.and(
				NOTEBOOK_HAS_SOMETHING_RUNNING,
				NOTEBOOK_INTERRUPTIBLE_KERNEL
			),
			icon: icons.stopIcon,
			menu: [
				{
					id: MenuId.EditorTitle,
					order: -1,
					group: 'navigation',
					when: ContextKeyExpr.and(
						NOTEBOOK_IS_ACTIVE_EDITOR,
						NOTEBOOK_HAS_SOMETHING_RUNNING,
						NOTEBOOK_INTERRUPTIBLE_KERNEL,
						ContextKeyExpr.notEquals('config.notebook.globalToolbar', true)
					)
				},
				{
					id: MenuId.NotebookToolbar,
					order: -1,
					group: 'navigation/execute',
					when: ContextKeyExpr.and(
						NOTEBOOK_HAS_SOMETHING_RUNNING,
						NOTEBOOK_INTERRUPTIBLE_KERNEL,
						ContextKeyExpr.equals('config.notebook.globalToolbar', true)
					)
				},
				{
					id: MenuId.InteractiveToolbar,
					group: 'navigation/execute'
				}
			]
		});
	}
});


MenuRegistry.appendMenuItem(MenuId.NotebookToolbar, {
	title: localize('revealRunningCellShort', "Go To"),
	submenu: MenuId.NotebookCellExecuteGoTo,
	group: 'navigation/execute',
	order: 20,
	icon: ThemeIcon.modify(icons.executingStateIcon, 'spin')
});

registerAction2(class RevealRunningCellAction extends NotebookAction {
	constructor() {
		super({
			id: REVEAL_RUNNING_CELL,
			title: localize('revealRunningCell', "Go to Running Cell"),
			tooltip: localize('revealRunningCell', "Go to Running Cell"),
			shortTitle: localize('revealRunningCell', "Go to Running Cell"),
			precondition: NOTEBOOK_HAS_RUNNING_CELL,
			menu: [
				{
					id: MenuId.EditorTitle,
					when: ContextKeyExpr.and(
						NOTEBOOK_IS_ACTIVE_EDITOR,
						NOTEBOOK_HAS_RUNNING_CELL,
						ContextKeyExpr.notEquals('config.notebook.globalToolbar', true)
					),
					group: 'navigation',
					order: 0
				},
				{
					id: MenuId.NotebookCellExecuteGoTo,
					when: ContextKeyExpr.and(
						NOTEBOOK_IS_ACTIVE_EDITOR,
						NOTEBOOK_HAS_RUNNING_CELL,
						ContextKeyExpr.equals('config.notebook.globalToolbar', true)
					),
					group: 'navigation/execute',
					order: 20
				},
				{
					id: MenuId.InteractiveToolbar,
					when: ContextKeyExpr.and(
						NOTEBOOK_HAS_RUNNING_CELL,
						ContextKeyExpr.equals('activeEditor', 'workbench.editor.interactive')
					),
					group: 'navigation',
					order: 10
				}
			],
			icon: ThemeIcon.modify(icons.executingStateIcon, 'spin')
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		const notebookExecutionStateService = accessor.get(INotebookExecutionStateService);
		const notebook = context.notebookEditor.textModel.uri;
		const executingCells = notebookExecutionStateService.getCellExecutionsForNotebook(notebook);
		if (executingCells[0]) {
			const topStackFrameCell = this.findCellAtTopFrame(accessor, notebook);
			const focusHandle = topStackFrameCell ?? executingCells[0].cellHandle;
			const cell = context.notebookEditor.getCellByHandle(focusHandle);
			if (cell) {
				context.notebookEditor.focusNotebookCell(cell, 'container');
			}
		}
	}

	private findCellAtTopFrame(accessor: ServicesAccessor, notebook: URI): number | undefined {
		const debugService = accessor.get(IDebugService);
		for (const session of debugService.getModel().getSessions()) {
			for (const thread of session.getAllThreads()) {
				const sf = thread.getTopStackFrame();
				if (sf) {
					const parsed = CellUri.parse(sf.source.uri);
					if (parsed && parsed.notebook.toString() === notebook.toString()) {
						return parsed.handle;
					}
				}
			}
		}

		return undefined;
	}
});

registerAction2(class RevealLastFailedCellAction extends NotebookAction {
	constructor() {
		super({
			id: REVEAL_LAST_FAILED_CELL,
			title: localize('revealLastFailedCell', "Go to Most Recently Failed Cell"),
			tooltip: localize('revealLastFailedCell', "Go to Most Recently Failed Cell"),
			shortTitle: localize('revealLastFailedCellShort', "Go to Most Recently Failed Cell"),
			precondition: NOTEBOOK_LAST_CELL_FAILED,
			menu: [
				{
					id: MenuId.EditorTitle,
					when: ContextKeyExpr.and(
						NOTEBOOK_IS_ACTIVE_EDITOR,
						NOTEBOOK_LAST_CELL_FAILED,
						NOTEBOOK_HAS_RUNNING_CELL.toNegated(),
						ContextKeyExpr.notEquals('config.notebook.globalToolbar', true)
					),
					group: 'navigation',
					order: 0
				},
				{
					id: MenuId.NotebookCellExecuteGoTo,
					when: ContextKeyExpr.and(
						NOTEBOOK_IS_ACTIVE_EDITOR,
						NOTEBOOK_LAST_CELL_FAILED,
						NOTEBOOK_HAS_RUNNING_CELL.toNegated(),
						ContextKeyExpr.equals('config.notebook.globalToolbar', true)
					),
					group: 'navigation/execute',
					order: 20
				},
			],
			icon: icons.errorStateIcon,
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		const notebookExecutionStateService = accessor.get(INotebookExecutionStateService);
		const notebook = context.notebookEditor.textModel.uri;
		const lastFailedCellHandle = notebookExecutionStateService.getLastFailedCellForNotebook(notebook);
		if (lastFailedCellHandle !== undefined) {
			const lastFailedCell = context.notebookEditor.getCellByHandle(lastFailedCellHandle);
			if (lastFailedCell) {
				context.notebookEditor.focusNotebookCell(lastFailedCell, 'container');
			}
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/controller/foldingController.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/controller/foldingController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_IS_ACTIVE_EDITOR } from '../../common/notebookContextKeys.js';
import { INotebookEditor, INotebookEditorMouseEvent, INotebookEditorContribution, getNotebookEditorFromEditorPane, CellFoldingState } from '../notebookBrowser.js';
import { FoldingModel } from '../viewModel/foldingModel.js'; import { CellKind } from '../../common/notebookCommon.js';
import { ICellRange } from '../../common/notebookRange.js';
import { registerNotebookContribution } from '../notebookEditorExtensions.js';
import { registerAction2, Action2 } from '../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { InputFocusedContextKey } from '../../../../../platform/contextkey/common/contextkeys.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { NOTEBOOK_ACTIONS_CATEGORY } from './coreActions.js';
import { localize, localize2 } from '../../../../../nls.js';
import { FoldingRegion } from '../../../../../editor/contrib/folding/browser/foldingRanges.js';
import { ICommandMetadata } from '../../../../../platform/commands/common/commands.js';
import { NotebookViewModel } from '../viewModel/notebookViewModelImpl.js';

export class FoldingController extends Disposable implements INotebookEditorContribution {
	static id: string = 'workbench.notebook.foldingController';

	private _foldingModel: FoldingModel | null = null;
	private readonly _localStore = this._register(new DisposableStore());

	constructor(private readonly _notebookEditor: INotebookEditor) {
		super();

		this._register(this._notebookEditor.onMouseUp(e => { this.onMouseUp(e); }));

		this._register(this._notebookEditor.onDidChangeModel(() => {
			this._localStore.clear();

			if (!this._notebookEditor.hasModel()) {
				return;
			}

			this._localStore.add(this._notebookEditor.onDidChangeCellState(e => {
				if (e.source.editStateChanged && e.cell.cellKind === CellKind.Markup) {
					this._foldingModel?.recompute();
				}
			}));

			this._foldingModel = new FoldingModel();
			this._localStore.add(this._foldingModel);
			this._foldingModel.attachViewModel(this._notebookEditor.getViewModel());

			this._localStore.add(this._foldingModel.onDidFoldingRegionChanged(() => {
				this._updateEditorFoldingRanges();
			}));
		}));
	}

	saveViewState(): ICellRange[] {
		return this._foldingModel?.getMemento() || [];
	}

	restoreViewState(state: ICellRange[] | undefined) {
		this._foldingModel?.applyMemento(state || []);
		this._updateEditorFoldingRanges();
	}

	setFoldingStateDown(index: number, state: CellFoldingState, levels: number) {
		const doCollapse = state === CellFoldingState.Collapsed;
		const region = this._foldingModel!.getRegionAtLine(index + 1);
		const regions: FoldingRegion[] = [];
		if (region) {
			if (region.isCollapsed !== doCollapse) {
				regions.push(region);
			}
			if (levels > 1) {
				const regionsInside = this._foldingModel!.getRegionsInside(region, (r, level: number) => r.isCollapsed !== doCollapse && level < levels);
				regions.push(...regionsInside);
			}
		}

		regions.forEach(r => this._foldingModel!.setCollapsed(r.regionIndex, state === CellFoldingState.Collapsed));
		this._updateEditorFoldingRanges();
	}

	setFoldingStateUp(index: number, state: CellFoldingState, levels: number) {
		if (!this._foldingModel) {
			return;
		}

		const regions = this._foldingModel.getAllRegionsAtLine(index + 1, (region, level) => region.isCollapsed !== (state === CellFoldingState.Collapsed) && level <= levels);
		regions.forEach(r => this._foldingModel!.setCollapsed(r.regionIndex, state === CellFoldingState.Collapsed));
		this._updateEditorFoldingRanges();
	}

	private _updateEditorFoldingRanges() {
		if (!this._foldingModel) {
			return;
		}

		if (!this._notebookEditor.hasModel()) {
			return;
		}

		const vm = this._notebookEditor.getViewModel() as NotebookViewModel;

		vm.updateFoldingRanges(this._foldingModel.regions);
		const hiddenRanges = vm.getHiddenRanges();
		this._notebookEditor.setHiddenAreas(hiddenRanges);
	}

	onMouseUp(e: INotebookEditorMouseEvent) {
		if (!e.event.target) {
			return;
		}

		if (!this._notebookEditor.hasModel()) {
			return;
		}

		const viewModel = this._notebookEditor.getViewModel() as NotebookViewModel;
		const target = e.event.target as HTMLElement;

		if (target.classList.contains('codicon-notebook-collapsed') || target.classList.contains('codicon-notebook-expanded')) {
			const parent = target.parentElement as HTMLElement;

			if (!parent.classList.contains('notebook-folding-indicator')) {
				return;
			}

			// folding icon

			const cellViewModel = e.target;
			const modelIndex = viewModel.getCellIndex(cellViewModel);
			const state = viewModel.getFoldingState(modelIndex);

			if (state === CellFoldingState.None) {
				return;
			}

			this.setFoldingStateUp(modelIndex, state === CellFoldingState.Collapsed ? CellFoldingState.Expanded : CellFoldingState.Collapsed, 1);
			this._notebookEditor.focusElement(cellViewModel);
		}

		return;
	}

	recompute() {
		this._foldingModel?.recompute();
	}
}

registerNotebookContribution(FoldingController.id, FoldingController);


const NOTEBOOK_FOLD_COMMAND_LABEL = localize('fold.cell', "Fold Cell");
const NOTEBOOK_UNFOLD_COMMAND_LABEL = localize2('unfold.cell', "Unfold Cell");

const FOLDING_COMMAND_ARGS: Pick<ICommandMetadata, 'args'> = {
	args: [{
		isOptional: true,
		name: 'index',
		description: 'The cell index',
		schema: {
			'type': 'object',
			'required': ['index', 'direction'],
			'properties': {
				'index': {
					'type': 'number'
				},
				'direction': {
					'type': 'string',
					'enum': ['up', 'down'],
					'default': 'down'
				},
				'levels': {
					'type': 'number',
					'default': 1
				},
			}
		}
	}]
};

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.fold',
			title: localize2('fold.cell', "Fold Cell"),
			category: NOTEBOOK_ACTIONS_CATEGORY,
			keybinding: {
				when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, ContextKeyExpr.not(InputFocusedContextKey)),
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.BracketLeft,
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.BracketLeft,
					secondary: [KeyCode.LeftArrow],
				},
				secondary: [KeyCode.LeftArrow],
				weight: KeybindingWeight.WorkbenchContrib
			},
			metadata: {
				description: NOTEBOOK_FOLD_COMMAND_LABEL,
				args: FOLDING_COMMAND_ARGS.args
			},
			precondition: NOTEBOOK_IS_ACTIVE_EDITOR,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor, args?: { index: number; levels: number; direction: 'up' | 'down' }): Promise<void> {
		const editorService = accessor.get(IEditorService);

		const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);
		if (!editor) {
			return;
		}

		if (!editor.hasModel()) {
			return;
		}

		const levels = args && args.levels || 1;
		const direction = args && args.direction === 'up' ? 'up' : 'down';
		let index: number | undefined = undefined;

		if (args) {
			index = args.index;
		} else {
			const activeCell = editor.getActiveCell();
			if (!activeCell) {
				return;
			}
			index = editor.getCellIndex(activeCell);
		}

		const controller = editor.getContribution<FoldingController>(FoldingController.id);
		if (index !== undefined) {
			const targetCell = (index < 0 || index >= editor.getLength()) ? undefined : editor.cellAt(index);
			if (targetCell?.cellKind === CellKind.Code && direction === 'down') {
				return;
			}

			if (direction === 'up') {
				controller.setFoldingStateUp(index, CellFoldingState.Collapsed, levels);
			} else {
				controller.setFoldingStateDown(index, CellFoldingState.Collapsed, levels);
			}

			const viewIndex = editor.getViewModel().getNearestVisibleCellIndexUpwards(index);
			editor.focusElement(editor.cellAt(viewIndex));
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.unfold',
			title: NOTEBOOK_UNFOLD_COMMAND_LABEL,
			category: NOTEBOOK_ACTIONS_CATEGORY,
			keybinding: {
				when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, ContextKeyExpr.not(InputFocusedContextKey)),
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.BracketRight,
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.BracketRight,
					secondary: [KeyCode.RightArrow],
				},
				secondary: [KeyCode.RightArrow],
				weight: KeybindingWeight.WorkbenchContrib
			},
			metadata: {
				description: NOTEBOOK_UNFOLD_COMMAND_LABEL,
				args: FOLDING_COMMAND_ARGS.args
			},
			precondition: NOTEBOOK_IS_ACTIVE_EDITOR,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor, args?: { index: number; levels: number; direction: 'up' | 'down' }): Promise<void> {
		const editorService = accessor.get(IEditorService);

		const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);
		if (!editor) {
			return;
		}

		const levels = args && args.levels || 1;
		const direction = args && args.direction === 'up' ? 'up' : 'down';
		let index: number | undefined = undefined;

		if (args) {
			index = args.index;
		} else {
			const activeCell = editor.getActiveCell();
			if (!activeCell) {
				return;
			}
			index = editor.getCellIndex(activeCell);
		}

		const controller = editor.getContribution<FoldingController>(FoldingController.id);
		if (index !== undefined) {
			if (direction === 'up') {
				controller.setFoldingStateUp(index, CellFoldingState.Expanded, levels);
			} else {
				controller.setFoldingStateDown(index, CellFoldingState.Expanded, levels);
			}
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/controller/insertCellActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/controller/insertCellActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { localize } from '../../../../../nls.js';
import { IAction2Options, MenuId, MenuRegistry, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { InputFocusedContext } from '../../../../../platform/contextkey/common/contextkeys.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { insertCell } from './cellOperations.js';
import { INotebookActionContext, NotebookAction } from './coreActions.js';
import { NOTEBOOK_CELL_LIST_FOCUSED, NOTEBOOK_EDITOR_EDITABLE } from '../../common/notebookContextKeys.js';
import { CellViewModel } from '../viewModel/notebookViewModelImpl.js';
import { CellKind, NotebookSetting } from '../../common/notebookCommon.js';
import { INotebookKernelHistoryService } from '../../common/notebookKernelService.js';

const INSERT_CODE_CELL_ABOVE_COMMAND_ID = 'notebook.cell.insertCodeCellAbove';
const INSERT_CODE_CELL_BELOW_COMMAND_ID = 'notebook.cell.insertCodeCellBelow';
const INSERT_CODE_CELL_ABOVE_AND_FOCUS_CONTAINER_COMMAND_ID = 'notebook.cell.insertCodeCellAboveAndFocusContainer';
const INSERT_CODE_CELL_BELOW_AND_FOCUS_CONTAINER_COMMAND_ID = 'notebook.cell.insertCodeCellBelowAndFocusContainer';
const INSERT_CODE_CELL_AT_TOP_COMMAND_ID = 'notebook.cell.insertCodeCellAtTop';
const INSERT_MARKDOWN_CELL_ABOVE_COMMAND_ID = 'notebook.cell.insertMarkdownCellAbove';
const INSERT_MARKDOWN_CELL_BELOW_COMMAND_ID = 'notebook.cell.insertMarkdownCellBelow';
const INSERT_MARKDOWN_CELL_AT_TOP_COMMAND_ID = 'notebook.cell.insertMarkdownCellAtTop';

export function insertNewCell(accessor: ServicesAccessor, context: INotebookActionContext, kind: CellKind, direction: 'above' | 'below', focusEditor: boolean) {
	let newCell: CellViewModel | null = null;
	if (context.ui) {
		context.notebookEditor.focus();
	}

	const languageService = accessor.get(ILanguageService);
	const kernelHistoryService = accessor.get(INotebookKernelHistoryService);

	if (context.cell) {
		const idx = context.notebookEditor.getCellIndex(context.cell);
		newCell = insertCell(languageService, context.notebookEditor, idx, kind, direction, undefined, true, kernelHistoryService);
	} else {
		const focusRange = context.notebookEditor.getFocus();
		const next = Math.max(focusRange.end - 1, 0);
		newCell = insertCell(languageService, context.notebookEditor, next, kind, direction, undefined, true, kernelHistoryService);
	}

	return newCell;
}

export abstract class InsertCellCommand extends NotebookAction {
	constructor(
		desc: Readonly<IAction2Options>,
		private kind: CellKind,
		private direction: 'above' | 'below',
		private focusEditor: boolean
	) {
		super(desc);
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		const newCell = await insertNewCell(accessor, context, this.kind, this.direction, this.focusEditor);

		if (newCell) {
			await context.notebookEditor.focusNotebookCell(newCell, this.focusEditor ? 'editor' : 'container');
		}
	}
}

registerAction2(class InsertCodeCellAboveAction extends InsertCellCommand {
	constructor() {
		super(
			{
				id: INSERT_CODE_CELL_ABOVE_COMMAND_ID,
				title: localize('notebookActions.insertCodeCellAbove', "Insert Code Cell Above"),
				keybinding: {
					primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Enter,
					when: ContextKeyExpr.and(NOTEBOOK_CELL_LIST_FOCUSED, InputFocusedContext.toNegated()),
					weight: KeybindingWeight.WorkbenchContrib
				},
				menu: {
					id: MenuId.NotebookCellInsert,
					order: 0
				}
			},
			CellKind.Code,
			'above',
			true);
	}
});



registerAction2(class InsertCodeCellAboveAndFocusContainerAction extends InsertCellCommand {
	constructor() {
		super(
			{
				id: INSERT_CODE_CELL_ABOVE_AND_FOCUS_CONTAINER_COMMAND_ID,
				title: localize('notebookActions.insertCodeCellAboveAndFocusContainer', "Insert Code Cell Above and Focus Container")
			},
			CellKind.Code,
			'above',
			false);
	}
});

registerAction2(class InsertCodeCellBelowAction extends InsertCellCommand {
	constructor() {
		super(
			{
				id: INSERT_CODE_CELL_BELOW_COMMAND_ID,
				title: localize('notebookActions.insertCodeCellBelow', "Insert Code Cell Below"),
				keybinding: {
					primary: KeyMod.CtrlCmd | KeyCode.Enter,
					when: ContextKeyExpr.and(NOTEBOOK_CELL_LIST_FOCUSED, InputFocusedContext.toNegated()),
					weight: KeybindingWeight.WorkbenchContrib
				},
				menu: {
					id: MenuId.NotebookCellInsert,
					order: 1
				}
			},
			CellKind.Code,
			'below',
			true);
	}
});

registerAction2(class InsertCodeCellBelowAndFocusContainerAction extends InsertCellCommand {
	constructor() {
		super(
			{
				id: INSERT_CODE_CELL_BELOW_AND_FOCUS_CONTAINER_COMMAND_ID,
				title: localize('notebookActions.insertCodeCellBelowAndFocusContainer', "Insert Code Cell Below and Focus Container"),
			},
			CellKind.Code,
			'below',
			false);
	}
});


registerAction2(class InsertMarkdownCellAboveAction extends InsertCellCommand {
	constructor() {
		super(
			{
				id: INSERT_MARKDOWN_CELL_ABOVE_COMMAND_ID,
				title: localize('notebookActions.insertMarkdownCellAbove', "Insert Markdown Cell Above"),
				menu: {
					id: MenuId.NotebookCellInsert,
					order: 2
				}
			},
			CellKind.Markup,
			'above',
			true);
	}
});

registerAction2(class InsertMarkdownCellBelowAction extends InsertCellCommand {
	constructor() {
		super(
			{
				id: INSERT_MARKDOWN_CELL_BELOW_COMMAND_ID,
				title: localize('notebookActions.insertMarkdownCellBelow', "Insert Markdown Cell Below"),
				menu: {
					id: MenuId.NotebookCellInsert,
					order: 3
				}
			},
			CellKind.Markup,
			'below',
			true);
	}
});


registerAction2(class InsertCodeCellAtTopAction extends NotebookAction {
	constructor() {
		super(
			{
				id: INSERT_CODE_CELL_AT_TOP_COMMAND_ID,
				title: localize('notebookActions.insertCodeCellAtTop', "Add Code Cell At Top"),
				f1: false
			});
	}

	override async run(accessor: ServicesAccessor, context?: INotebookActionContext): Promise<void> {
		context = context ?? this.getEditorContextFromArgsOrActive(accessor);
		if (context) {
			this.runWithContext(accessor, context);
		}
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		const languageService = accessor.get(ILanguageService);
		const kernelHistoryService = accessor.get(INotebookKernelHistoryService);
		const newCell = insertCell(languageService, context.notebookEditor, 0, CellKind.Code, 'above', undefined, true, kernelHistoryService);

		if (newCell) {
			await context.notebookEditor.focusNotebookCell(newCell, 'editor');
		}
	}
});

registerAction2(class InsertMarkdownCellAtTopAction extends NotebookAction {
	constructor() {
		super(
			{
				id: INSERT_MARKDOWN_CELL_AT_TOP_COMMAND_ID,
				title: localize('notebookActions.insertMarkdownCellAtTop', "Add Markdown Cell At Top"),
				f1: false
			});
	}

	override async run(accessor: ServicesAccessor, context?: INotebookActionContext): Promise<void> {
		context = context ?? this.getEditorContextFromArgsOrActive(accessor);
		if (context) {
			this.runWithContext(accessor, context);
		}
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		const languageService = accessor.get(ILanguageService);
		const kernelHistoryService = accessor.get(INotebookKernelHistoryService);

		const newCell = insertCell(languageService, context.notebookEditor, 0, CellKind.Markup, 'above', undefined, true, kernelHistoryService);

		if (newCell) {
			await context.notebookEditor.focusNotebookCell(newCell, 'editor');
		}
	}
});

MenuRegistry.appendMenuItem(MenuId.NotebookCellBetween, {
	command: {
		id: INSERT_CODE_CELL_BELOW_COMMAND_ID,
		title: '$(add) ' + localize('notebookActions.menu.insertCode', "Code"),
		tooltip: localize('notebookActions.menu.insertCode.tooltip', "Add Code Cell")
	},
	order: 0,
	group: 'inline',
	when: ContextKeyExpr.and(
		NOTEBOOK_EDITOR_EDITABLE.isEqualTo(true),
		ContextKeyExpr.notEquals('config.notebook.experimental.insertToolbarAlignment', 'left')
	)
});

MenuRegistry.appendMenuItem(MenuId.NotebookCellBetween, {
	command: {
		id: INSERT_CODE_CELL_BELOW_COMMAND_ID,
		title: localize('notebookActions.menu.insertCode.minimalToolbar', "Add Code"),
		icon: Codicon.add,
		tooltip: localize('notebookActions.menu.insertCode.tooltip', "Add Code Cell")
	},
	order: 0,
	group: 'inline',
	when: ContextKeyExpr.and(
		NOTEBOOK_EDITOR_EDITABLE.isEqualTo(true),
		ContextKeyExpr.equals('config.notebook.experimental.insertToolbarAlignment', 'left')
	)
});

MenuRegistry.appendMenuItem(MenuId.NotebookToolbar, {
	command: {
		id: INSERT_CODE_CELL_BELOW_COMMAND_ID,
		icon: Codicon.add,
		title: localize('notebookActions.menu.insertCode.ontoolbar', "Code"),
		tooltip: localize('notebookActions.menu.insertCode.tooltip', "Add Code Cell")
	},
	order: -5,
	group: 'navigation/add',
	when: ContextKeyExpr.and(
		NOTEBOOK_EDITOR_EDITABLE.isEqualTo(true),
		ContextKeyExpr.notEquals('config.notebook.insertToolbarLocation', 'betweenCells'),
		ContextKeyExpr.notEquals('config.notebook.insertToolbarLocation', 'hidden')
	)
});

MenuRegistry.appendMenuItem(MenuId.NotebookCellListTop, {
	command: {
		id: INSERT_CODE_CELL_AT_TOP_COMMAND_ID,
		title: '$(add) ' + localize('notebookActions.menu.insertCode', "Code"),
		tooltip: localize('notebookActions.menu.insertCode.tooltip', "Add Code Cell")
	},
	order: 0,
	group: 'inline',
	when: ContextKeyExpr.and(
		NOTEBOOK_EDITOR_EDITABLE.isEqualTo(true),
		ContextKeyExpr.notEquals('config.notebook.experimental.insertToolbarAlignment', 'left')
	)
});

MenuRegistry.appendMenuItem(MenuId.NotebookCellListTop, {
	command: {
		id: INSERT_CODE_CELL_AT_TOP_COMMAND_ID,
		title: localize('notebookActions.menu.insertCode.minimaltoolbar', "Add Code"),
		icon: Codicon.add,
		tooltip: localize('notebookActions.menu.insertCode.tooltip', "Add Code Cell")
	},
	order: 0,
	group: 'inline',
	when: ContextKeyExpr.and(
		NOTEBOOK_EDITOR_EDITABLE.isEqualTo(true),
		ContextKeyExpr.equals('config.notebook.experimental.insertToolbarAlignment', 'left')
	)
});


MenuRegistry.appendMenuItem(MenuId.NotebookCellBetween, {
	command: {
		id: INSERT_MARKDOWN_CELL_BELOW_COMMAND_ID,
		title: '$(add) ' + localize('notebookActions.menu.insertMarkdown', "Markdown"),
		tooltip: localize('notebookActions.menu.insertMarkdown.tooltip', "Add Markdown Cell")
	},
	order: 1,
	group: 'inline',
	when: ContextKeyExpr.and(
		NOTEBOOK_EDITOR_EDITABLE.isEqualTo(true),
		ContextKeyExpr.notEquals('config.notebook.experimental.insertToolbarAlignment', 'left')
	)
});

MenuRegistry.appendMenuItem(MenuId.NotebookToolbar, {
	command: {
		id: INSERT_MARKDOWN_CELL_BELOW_COMMAND_ID,
		icon: Codicon.add,
		title: localize('notebookActions.menu.insertMarkdown.ontoolbar', "Markdown"),
		tooltip: localize('notebookActions.menu.insertMarkdown.tooltip', "Add Markdown Cell")
	},
	order: -5,
	group: 'navigation/add',
	when: ContextKeyExpr.and(
		NOTEBOOK_EDITOR_EDITABLE.isEqualTo(true),
		ContextKeyExpr.notEquals('config.notebook.insertToolbarLocation', 'betweenCells'),
		ContextKeyExpr.notEquals('config.notebook.insertToolbarLocation', 'hidden'),
		ContextKeyExpr.notEquals(`config.${NotebookSetting.globalToolbarShowLabel}`, false),
		ContextKeyExpr.notEquals(`config.${NotebookSetting.globalToolbarShowLabel}`, 'never')
	)
});

MenuRegistry.appendMenuItem(MenuId.NotebookCellListTop, {
	command: {
		id: INSERT_MARKDOWN_CELL_AT_TOP_COMMAND_ID,
		title: '$(add) ' + localize('notebookActions.menu.insertMarkdown', "Markdown"),
		tooltip: localize('notebookActions.menu.insertMarkdown.tooltip', "Add Markdown Cell")
	},
	order: 1,
	group: 'inline',
	when: ContextKeyExpr.and(
		NOTEBOOK_EDITOR_EDITABLE.isEqualTo(true),
		ContextKeyExpr.notEquals('config.notebook.experimental.insertToolbarAlignment', 'left')
	)
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/controller/layoutActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/controller/layoutActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../../../base/common/uri.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Categories } from '../../../../../platform/action/common/actionCommonCategories.js';
import { Action2, MenuId, MenuRegistry, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputService, IQuickPickItem } from '../../../../../platform/quickinput/common/quickInput.js';
import { NOTEBOOK_ACTIONS_CATEGORY } from './coreActions.js';
import { getNotebookEditorFromEditorPane } from '../notebookBrowser.js';
import { INotebookEditorService } from '../services/notebookEditorService.js';
import { NotebookSetting } from '../../common/notebookCommon.js';
import { NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_IS_ACTIVE_EDITOR } from '../../common/notebookContextKeys.js';
import { INotebookService } from '../../common/notebookService.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IPreferencesService } from '../../../../services/preferences/common/preferences.js';

registerAction2(class NotebookConfigureLayoutAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.notebook.layout.select',
			title: localize2('workbench.notebook.layout.select.label', "Select between Notebook Layouts"),
			f1: true,
			precondition: ContextKeyExpr.equals(`config.${NotebookSetting.openGettingStarted}`, true),
			category: NOTEBOOK_ACTIONS_CATEGORY,
			menu: [
				{
					id: MenuId.EditorTitle,
					group: 'notebookLayout',
					when: ContextKeyExpr.and(
						NOTEBOOK_IS_ACTIVE_EDITOR,
						ContextKeyExpr.notEquals('config.notebook.globalToolbar', true),
						ContextKeyExpr.equals(`config.${NotebookSetting.openGettingStarted}`, true)
					),
					order: 0
				},
				{
					id: MenuId.NotebookToolbar,
					group: 'notebookLayout',
					when: ContextKeyExpr.and(
						ContextKeyExpr.equals('config.notebook.globalToolbar', true),
						ContextKeyExpr.equals(`config.${NotebookSetting.openGettingStarted}`, true)
					),
					order: 0
				}
			]
		});
	}
	run(accessor: ServicesAccessor): void {
		accessor.get(ICommandService).executeCommand('workbench.action.openWalkthrough', { category: 'notebooks', step: 'notebookProfile' }, true);
	}
});

registerAction2(class NotebookConfigureLayoutAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.notebook.layout.configure',
			title: localize2('workbench.notebook.layout.configure.label', "Customize Notebook Layout"),
			f1: true,
			category: NOTEBOOK_ACTIONS_CATEGORY,
			menu: [
				{
					id: MenuId.NotebookToolbar,
					group: 'notebookLayout',
					when: ContextKeyExpr.equals('config.notebook.globalToolbar', true),
					order: 1
				}
			]
		});
	}
	run(accessor: ServicesAccessor): void {
		accessor.get(IPreferencesService).openSettings({ jsonEditor: false, query: '@tag:notebookLayout' });
	}
});

registerAction2(class NotebookConfigureLayoutFromEditorTitle extends Action2 {
	constructor() {
		super({
			id: 'workbench.notebook.layout.configure.editorTitle',
			title: localize2('workbench.notebook.layout.configure.label', "Customize Notebook Layout"),
			f1: false,
			category: NOTEBOOK_ACTIONS_CATEGORY,
			menu: [
				{
					id: MenuId.NotebookEditorLayoutConfigure,
					group: 'notebookLayout',
					when: NOTEBOOK_IS_ACTIVE_EDITOR,
					order: 1
				}
			]
		});
	}
	run(accessor: ServicesAccessor): void {
		accessor.get(IPreferencesService).openSettings({ jsonEditor: false, query: '@tag:notebookLayout' });
	}
});

MenuRegistry.appendMenuItem(MenuId.EditorTitle, {
	submenu: MenuId.NotebookEditorLayoutConfigure,
	title: localize2('customizeNotebook', "Customize Notebook..."),
	icon: Codicon.gear,
	group: 'navigation',
	order: -1,
	when: NOTEBOOK_IS_ACTIVE_EDITOR
});

registerAction2(class ToggleLineNumberFromEditorTitle extends Action2 {
	constructor() {
		super({
			id: 'notebook.toggleLineNumbersFromEditorTitle',
			title: localize2('notebook.toggleLineNumbers', 'Toggle Notebook Line Numbers'),
			precondition: NOTEBOOK_EDITOR_FOCUSED,
			menu: [
				{
					id: MenuId.NotebookEditorLayoutConfigure,
					group: 'notebookLayoutDetails',
					order: 1,
					when: NOTEBOOK_IS_ACTIVE_EDITOR
				}],
			category: NOTEBOOK_ACTIONS_CATEGORY,
			f1: true,
			toggled: {
				condition: ContextKeyExpr.notEquals('config.notebook.lineNumbers', 'off'),
				title: localize('notebook.showLineNumbers', "Notebook Line Numbers"),
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		return accessor.get(ICommandService).executeCommand('notebook.toggleLineNumbers');
	}
});

registerAction2(class ToggleCellToolbarPositionFromEditorTitle extends Action2 {
	constructor() {
		super({
			id: 'notebook.toggleCellToolbarPositionFromEditorTitle',
			title: localize2('notebook.toggleCellToolbarPosition', 'Toggle Cell Toolbar Position'),
			menu: [{
				id: MenuId.NotebookEditorLayoutConfigure,
				group: 'notebookLayoutDetails',
				order: 3
			}],
			category: NOTEBOOK_ACTIONS_CATEGORY,
			f1: false
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		return accessor.get(ICommandService).executeCommand('notebook.toggleCellToolbarPosition', ...args);
	}
});

registerAction2(class ToggleBreadcrumbFromEditorTitle extends Action2 {
	constructor() {
		super({
			id: 'breadcrumbs.toggleFromEditorTitle',
			title: localize2('notebook.toggleBreadcrumb', 'Toggle Breadcrumbs'),
			menu: [{
				id: MenuId.NotebookEditorLayoutConfigure,
				group: 'notebookLayoutDetails',
				order: 2
			}],
			f1: false
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		return accessor.get(ICommandService).executeCommand('breadcrumbs.toggle');
	}
});

registerAction2(class SaveMimeTypeDisplayOrder extends Action2 {
	constructor() {
		super({
			id: 'notebook.saveMimeTypeOrder',
			title: localize2('notebook.saveMimeTypeOrder', "Save Mimetype Display Order"),
			f1: true,
			category: NOTEBOOK_ACTIONS_CATEGORY,
			precondition: NOTEBOOK_IS_ACTIVE_EDITOR,
		});
	}

	run(accessor: ServicesAccessor) {
		const service = accessor.get(INotebookService);
		const disposables = new DisposableStore();
		const qp = disposables.add(accessor.get(IQuickInputService).createQuickPick<IQuickPickItem & { target: ConfigurationTarget }>());
		qp.placeholder = localize('notebook.placeholder', 'Settings file to save in');
		qp.items = [
			{ target: ConfigurationTarget.USER, label: localize('saveTarget.machine', 'User Settings') },
			{ target: ConfigurationTarget.WORKSPACE, label: localize('saveTarget.workspace', 'Workspace Settings') },
		];

		disposables.add(qp.onDidAccept(() => {
			const target = qp.selectedItems[0]?.target;
			if (target !== undefined) {
				service.saveMimeDisplayOrder(target);
			}
			qp.dispose();
		}));

		disposables.add(qp.onDidHide(() => disposables.dispose()));

		qp.show();
	}
});

registerAction2(class NotebookWebviewResetAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.notebook.layout.webview.reset',
			title: localize2('workbench.notebook.layout.webview.reset.label', "Reset Notebook Webview"),
			f1: false,
			category: NOTEBOOK_ACTIONS_CATEGORY
		});
	}
	run(accessor: ServicesAccessor, args?: UriComponents): void {
		const editorService = accessor.get(IEditorService);

		if (args) {
			const uri = URI.revive(args);
			const notebookEditorService = accessor.get(INotebookEditorService);
			const widgets = notebookEditorService.listNotebookEditors().filter(widget => widget.hasModel() && widget.textModel.uri.toString() === uri.toString());
			for (const widget of widgets) {
				if (widget.hasModel()) {
					widget.getInnerWebview()?.reload();
				}
			}
		} else {
			const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);
			if (!editor) {
				return;
			}

			editor.getInnerWebview()?.reload();
		}
	}
});

registerAction2(class ToggleNotebookStickyScroll extends Action2 {
	constructor() {
		super({
			id: 'notebook.action.toggleNotebookStickyScroll',
			title: {
				...localize2('toggleStickyScroll', "Toggle Notebook Sticky Scroll"),
				mnemonicTitle: localize({ key: 'mitoggleNotebookStickyScroll', comment: ['&& denotes a mnemonic'] }, "&&Toggle Notebook Sticky Scroll"),
			},
			category: Categories.View,
			toggled: {
				condition: ContextKeyExpr.equals('config.notebook.stickyScroll.enabled', true),
				title: localize('notebookStickyScroll', "Toggle Notebook Sticky Scroll"),
				mnemonicTitle: localize({ key: 'mitoggleNotebookStickyScroll', comment: ['&& denotes a mnemonic'] }, "&&Toggle Notebook Sticky Scroll"),
			},
			menu: [
				{ id: MenuId.CommandPalette },
				{ id: MenuId.NotebookStickyScrollContext, group: 'notebookView', order: 2 },
				{ id: MenuId.NotebookToolbarContext, group: 'notebookView', order: 2 }
			]
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);
		const newValue = !configurationService.getValue('notebook.stickyScroll.enabled');
		return configurationService.updateValue('notebook.stickyScroll.enabled', newValue);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/controller/notebookIndentationActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/controller/notebookIndentationActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../../nls.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { IBulkEditService, ResourceTextEdit } from '../../../../../editor/browser/services/bulkEditService.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IQuickInputService } from '../../../../../platform/quickinput/common/quickInput.js';
import { INotebookEditorService } from '../services/notebookEditorService.js';
import { NotebookSetting } from '../../common/notebookCommon.js';
import { isNotebookEditorInput } from '../../common/notebookEditorInput.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';

export class NotebookIndentUsingTabs extends Action2 {
	public static readonly ID = 'notebook.action.indentUsingTabs';

	constructor() {
		super({
			id: NotebookIndentUsingTabs.ID,
			title: nls.localize('indentUsingTabs', "Indent Using Tabs"),
			precondition: undefined,
		});
	}

	override run(accessor: ServicesAccessor, ...args: unknown[]): void {
		changeNotebookIndentation(accessor, false, false);
	}
}

export class NotebookIndentUsingSpaces extends Action2 {
	public static readonly ID = 'notebook.action.indentUsingSpaces';

	constructor() {
		super({
			id: NotebookIndentUsingSpaces.ID,
			title: nls.localize('indentUsingSpaces', "Indent Using Spaces"),
			precondition: undefined,
		});
	}

	override run(accessor: ServicesAccessor, ...args: unknown[]): void {
		changeNotebookIndentation(accessor, true, false);
	}
}

export class NotebookChangeTabDisplaySize extends Action2 {
	public static readonly ID = 'notebook.action.changeTabDisplaySize';

	constructor() {
		super({
			id: NotebookChangeTabDisplaySize.ID,
			title: nls.localize('changeTabDisplaySize', "Change Tab Display Size"),
			precondition: undefined,
		});
	}

	override run(accessor: ServicesAccessor, ...args: unknown[]): void {
		changeNotebookIndentation(accessor, true, true);
	}
}

export class NotebookIndentationToSpacesAction extends Action2 {
	public static readonly ID = 'notebook.action.convertIndentationToSpaces';

	constructor() {
		super({
			id: NotebookIndentationToSpacesAction.ID,
			title: nls.localize('convertIndentationToSpaces', "Convert Indentation to Spaces"),
			precondition: undefined,
		});
	}

	override run(accessor: ServicesAccessor, ...args: unknown[]): void {
		convertNotebookIndentation(accessor, true);
	}
}

export class NotebookIndentationToTabsAction extends Action2 {
	public static readonly ID = 'notebook.action.convertIndentationToTabs';

	constructor() {
		super({
			id: NotebookIndentationToTabsAction.ID,
			title: nls.localize('convertIndentationToTabs', "Convert Indentation to Tabs"),
			precondition: undefined,
		});
	}

	override run(accessor: ServicesAccessor, ...args: unknown[]): void {
		convertNotebookIndentation(accessor, false);
	}
}

function changeNotebookIndentation(accessor: ServicesAccessor, insertSpaces: boolean, displaySizeOnly: boolean) {
	const editorService = accessor.get(IEditorService);
	const configurationService = accessor.get(IConfigurationService);
	const notebookEditorService = accessor.get(INotebookEditorService);
	const quickInputService = accessor.get(IQuickInputService);

	// keep this check here to pop on non-notebook actions
	const activeInput = editorService.activeEditorPane?.input;
	const isNotebook = isNotebookEditorInput(activeInput);
	if (!isNotebook) {
		return;
	}

	// get notebook editor to access all codeEditors
	const notebookEditor = notebookEditorService.retrieveExistingWidgetFromURI(activeInput.resource)?.value;
	if (!notebookEditor) {
		return;
	}

	const picks = [1, 2, 3, 4, 5, 6, 7, 8].map(n => ({
		id: n.toString(),
		label: n.toString(),
	}));

	// store the initial values of the configuration
	const initialConfig = configurationService.getValue(NotebookSetting.cellEditorOptionsCustomizations) as Record<string, unknown>;
	const initialInsertSpaces = initialConfig['editor.insertSpaces'];
	// remove the initial values from the configuration
	delete initialConfig['editor.indentSize'];
	delete initialConfig['editor.tabSize'];
	delete initialConfig['editor.insertSpaces'];

	setTimeout(() => {
		quickInputService.pick(picks, { placeHolder: nls.localize({ key: 'selectTabWidth', comment: ['Tab corresponds to the tab key'] }, "Select Tab Size for Current File") }).then(pick => {
			if (pick) {
				const pickedVal = parseInt(pick.label, 10);
				if (displaySizeOnly) {
					configurationService.updateValue(NotebookSetting.cellEditorOptionsCustomizations, {
						...initialConfig,
						'editor.tabSize': pickedVal,
						'editor.indentSize': pickedVal,
						'editor.insertSpaces': initialInsertSpaces
					});
				} else {
					configurationService.updateValue(NotebookSetting.cellEditorOptionsCustomizations, {
						...initialConfig,
						'editor.tabSize': pickedVal,
						'editor.indentSize': pickedVal,
						'editor.insertSpaces': insertSpaces
					});
				}

			}
		});
	}, 50/* quick input is sensitive to being opened so soon after another */);
}

function convertNotebookIndentation(accessor: ServicesAccessor, tabsToSpaces: boolean): void {
	const editorService = accessor.get(IEditorService);
	const configurationService = accessor.get(IConfigurationService);
	const logService = accessor.get(ILogService);
	const textModelService = accessor.get(ITextModelService);
	const notebookEditorService = accessor.get(INotebookEditorService);
	const bulkEditService = accessor.get(IBulkEditService);

	// keep this check here to pop on non-notebook
	const activeInput = editorService.activeEditorPane?.input;
	const isNotebook = isNotebookEditorInput(activeInput);
	if (!isNotebook) {
		return;
	}

	// get notebook editor to access all codeEditors
	const notebookTextModel = notebookEditorService.retrieveExistingWidgetFromURI(activeInput.resource)?.value?.textModel;
	if (!notebookTextModel) {
		return;
	}

	const disposable = new DisposableStore();
	try {
		Promise.all(notebookTextModel.cells.map(async cell => {
			const ref = await textModelService.createModelReference(cell.uri);
			disposable.add(ref);
			const textEditorModel = ref.object.textEditorModel;

			const modelOpts = cell.textModel?.getOptions();
			if (!modelOpts) {
				return;
			}

			const edits = getIndentationEditOperations(textEditorModel, modelOpts.tabSize, tabsToSpaces);

			bulkEditService.apply(edits, { label: nls.localize('convertIndentation', "Convert Indentation"), code: 'undoredo.convertIndentation', });

		})).then(() => {
			// store the initial values of the configuration
			const initialConfig = configurationService.getValue(NotebookSetting.cellEditorOptionsCustomizations) as Record<string, unknown>;
			const initialIndentSize = initialConfig['editor.indentSize'];
			const initialTabSize = initialConfig['editor.tabSize'];
			// remove the initial values from the configuration
			delete initialConfig['editor.indentSize'];
			delete initialConfig['editor.tabSize'];
			delete initialConfig['editor.insertSpaces'];

			configurationService.updateValue(NotebookSetting.cellEditorOptionsCustomizations, {
				...initialConfig,
				'editor.tabSize': initialTabSize,
				'editor.indentSize': initialIndentSize,
				'editor.insertSpaces': tabsToSpaces
			});
			disposable.dispose();
		});
	} catch {
		logService.error('Failed to convert indentation to spaces for notebook cells.');
	}
}

function getIndentationEditOperations(model: ITextModel, tabSize: number, tabsToSpaces: boolean): ResourceTextEdit[] {
	if (model.getLineCount() === 1 && model.getLineMaxColumn(1) === 1) {
		// Model is empty
		return [];
	}

	let spaces = '';
	for (let i = 0; i < tabSize; i++) {
		spaces += ' ';
	}

	const spacesRegExp = new RegExp(spaces, 'gi');

	const edits: ResourceTextEdit[] = [];
	for (let lineNumber = 1, lineCount = model.getLineCount(); lineNumber <= lineCount; lineNumber++) {
		let lastIndentationColumn = model.getLineFirstNonWhitespaceColumn(lineNumber);
		if (lastIndentationColumn === 0) {
			lastIndentationColumn = model.getLineMaxColumn(lineNumber);
		}

		if (lastIndentationColumn === 1) {
			continue;
		}

		const originalIndentationRange = new Range(lineNumber, 1, lineNumber, lastIndentationColumn);
		const originalIndentation = model.getValueInRange(originalIndentationRange);
		const newIndentation = (
			tabsToSpaces
				? originalIndentation.replace(/\t/ig, spaces)
				: originalIndentation.replace(spacesRegExp, '\t')
		);
		edits.push(new ResourceTextEdit(model.uri, { range: originalIndentationRange, text: newIndentation }));
	}
	return edits;
}

registerAction2(NotebookIndentUsingSpaces);
registerAction2(NotebookIndentUsingTabs);
registerAction2(NotebookChangeTabDisplaySize);
registerAction2(NotebookIndentationToSpacesAction);
registerAction2(NotebookIndentationToTabsAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/controller/sectionActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/controller/sectionActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { NotebookOutlineContext } from '../contrib/outline/notebookOutline.js';
import { FoldingController } from './foldingController.js';
import { CellEditState, CellFoldingState, ICellViewModel, INotebookEditor } from '../notebookBrowser.js';
import * as icons from '../notebookIcons.js';
import { OutlineEntry } from '../viewModel/OutlineEntry.js';
import { CellKind } from '../../common/notebookCommon.js';
import { OutlineTarget } from '../../../../services/outline/browser/outline.js';
import { CELL_TITLE_CELL_GROUP_ID, CellToolbarOrder } from './coreActions.js';
import { executeSectionCondition } from './executeActions.js';

export type NotebookOutlineEntryArgs = {
	notebookEditor: INotebookEditor;
	outlineEntry: OutlineEntry;
};

export type NotebookCellArgs = {
	notebookEditor: INotebookEditor;
	cell: ICellViewModel;
};

export class NotebookRunSingleCellInSection extends Action2 {
	constructor() {
		super({
			id: 'notebook.section.runSingleCell',
			title: {
				...localize2('runCell', "Run Cell"),
				mnemonicTitle: localize({ key: 'mirunCell', comment: ['&& denotes a mnemonic'] }, "&&Run Cell"),
			},
			shortTitle: localize('runCell', "Run Cell"),
			icon: icons.executeIcon,
			menu: [
				{
					id: MenuId.NotebookOutlineActionMenu,
					group: 'inline',
					order: 1,
					when: ContextKeyExpr.and(
						NotebookOutlineContext.CellKind.isEqualTo(CellKind.Code),
						NotebookOutlineContext.OutlineElementTarget.isEqualTo(OutlineTarget.OutlinePane),
						NotebookOutlineContext.CellHasChildren.toNegated(),
						NotebookOutlineContext.CellHasHeader.toNegated(),
					)
				}
			]
		});
	}

	override async run(_accessor: ServicesAccessor, context: any): Promise<void> {
		if (!checkOutlineEntryContext(context)) {
			return;
		}

		context.notebookEditor.executeNotebookCells([context.outlineEntry.cell]);
	}
}

export class NotebookRunCellsInSection extends Action2 {
	constructor() {
		super({
			id: 'notebook.section.runCells',
			title: {
				...localize2('runCellsInSection', "Run Cells In Section"),
				mnemonicTitle: localize({ key: 'mirunCellsInSection', comment: ['&& denotes a mnemonic'] }, "&&Run Cells In Section"),
			},
			shortTitle: localize('runCellsInSection', "Run Cells In Section"),
			icon: icons.executeIcon, // TODO @Yoyokrazy replace this with new icon later
			menu: [
				{
					id: MenuId.NotebookStickyScrollContext,
					group: 'notebookExecution',
					order: 1
				},
				{
					id: MenuId.NotebookOutlineActionMenu,
					group: 'inline',
					order: 1,
					when: ContextKeyExpr.and(
						NotebookOutlineContext.CellKind.isEqualTo(CellKind.Markup),
						NotebookOutlineContext.OutlineElementTarget.isEqualTo(OutlineTarget.OutlinePane),
						NotebookOutlineContext.CellHasChildren,
						NotebookOutlineContext.CellHasHeader,
					)
				},
				{
					id: MenuId.NotebookCellTitle,
					order: CellToolbarOrder.RunSection,
					group: CELL_TITLE_CELL_GROUP_ID,
					when: executeSectionCondition
				}
			]
		});
	}

	override async run(_accessor: ServicesAccessor, context: any): Promise<void> {
		let cell: ICellViewModel;
		if (checkOutlineEntryContext(context)) {
			cell = context.outlineEntry.cell;
		} else if (checkNotebookCellContext(context)) {
			cell = context.cell;
		} else {
			return;
		}

		if (cell.getEditState() === CellEditState.Editing) {
			const foldingController = context.notebookEditor.getContribution<FoldingController>(FoldingController.id);
			foldingController.recompute();
		}

		const cellIdx = context.notebookEditor.getViewModel()?.getCellIndex(cell);
		if (cellIdx === undefined) {
			return;
		}
		const sectionIdx = context.notebookEditor.getViewModel()?.getFoldingStartIndex(cellIdx);
		if (sectionIdx === undefined) {
			return;
		}
		const length = context.notebookEditor.getViewModel()?.getFoldedLength(sectionIdx);
		if (length === undefined) {
			return;
		}

		const cells = context.notebookEditor.getCellsInRange({ start: sectionIdx, end: sectionIdx + length + 1 });
		context.notebookEditor.executeNotebookCells(cells);
	}
}

export class NotebookFoldSection extends Action2 {
	constructor() {
		super({
			id: 'notebook.section.foldSection',
			title: {
				...localize2('foldSection', "Fold Section"),
				mnemonicTitle: localize({ key: 'mifoldSection', comment: ['&& denotes a mnemonic'] }, "&&Fold Section"),
			},
			shortTitle: localize('foldSection', "Fold Section"),
			menu: [
				{
					id: MenuId.NotebookOutlineActionMenu,
					group: 'notebookFolding',
					order: 2,
					when: ContextKeyExpr.and(
						NotebookOutlineContext.CellKind.isEqualTo(CellKind.Markup),
						NotebookOutlineContext.OutlineElementTarget.isEqualTo(OutlineTarget.OutlinePane),
						NotebookOutlineContext.CellHasChildren,
						NotebookOutlineContext.CellHasHeader,
						NotebookOutlineContext.CellFoldingState.isEqualTo(CellFoldingState.Expanded)
					)
				}
			]
		});
	}

	override async run(_accessor: ServicesAccessor, context: any): Promise<void> {
		if (!checkOutlineEntryContext(context)) {
			return;
		}

		this.toggleFoldRange(context.outlineEntry, context.notebookEditor);
	}

	private toggleFoldRange(entry: OutlineEntry, notebookEditor: INotebookEditor) {
		const foldingController = notebookEditor.getContribution<FoldingController>(FoldingController.id);
		const index = entry.index;
		const headerLevel = entry.level;
		const newFoldingState = CellFoldingState.Collapsed;

		foldingController.setFoldingStateDown(index, newFoldingState, headerLevel);
	}
}

export class NotebookExpandSection extends Action2 {
	constructor() {
		super({
			id: 'notebook.section.expandSection',
			title: {
				...localize2('expandSection', "Expand Section"),
				mnemonicTitle: localize({ key: 'miexpandSection', comment: ['&& denotes a mnemonic'] }, "&&Expand Section"),
			},
			shortTitle: localize('expandSection', "Expand Section"),
			menu: [
				{
					id: MenuId.NotebookOutlineActionMenu,
					group: 'notebookFolding',
					order: 2,
					when: ContextKeyExpr.and(
						NotebookOutlineContext.CellKind.isEqualTo(CellKind.Markup),
						NotebookOutlineContext.OutlineElementTarget.isEqualTo(OutlineTarget.OutlinePane),
						NotebookOutlineContext.CellHasChildren,
						NotebookOutlineContext.CellHasHeader,
						NotebookOutlineContext.CellFoldingState.isEqualTo(CellFoldingState.Collapsed)
					)
				}
			]
		});
	}

	override async run(_accessor: ServicesAccessor, context: any): Promise<void> {
		if (!checkOutlineEntryContext(context)) {
			return;
		}

		this.toggleFoldRange(context.outlineEntry, context.notebookEditor);
	}

	private toggleFoldRange(entry: OutlineEntry, notebookEditor: INotebookEditor) {
		const foldingController = notebookEditor.getContribution<FoldingController>(FoldingController.id);
		const index = entry.index;
		const headerLevel = entry.level;
		const newFoldingState = CellFoldingState.Expanded;

		foldingController.setFoldingStateDown(index, newFoldingState, headerLevel);
	}
}

/**
 * Take in context args and check if they exist. True if action is run from notebook sticky scroll context menu or
 * notebook outline context menu.
 *
 * @param context - Notebook Outline Context containing a notebook editor and outline entry
 * @returns true if context is valid, false otherwise
 */
function checkOutlineEntryContext(context: any): context is NotebookOutlineEntryArgs {
	return !!(context && context.notebookEditor && context.outlineEntry);
}

/**
 * Take in context args and check if they exist. True if action is run from a cell toolbar menu (potentially from the
 * notebook cell container or cell editor context menus, but not tested or implemented atm)
 *
 * @param context - Notebook Outline Context containing a notebook editor and outline entry
 * @returns true if context is valid, false otherwise
 */
function checkNotebookCellContext(context: any): context is NotebookCellArgs {
	return !!(context && context.notebookEditor && context.cell);
}

registerAction2(NotebookRunSingleCellInSection);
registerAction2(NotebookRunCellsInSection);
registerAction2(NotebookFoldSection);
registerAction2(NotebookExpandSection);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/controller/variablesActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/controller/variablesActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize2 } from '../../../../../nls.js';
import { MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IViewsService } from '../../../../services/views/common/viewsService.js';
import { KERNEL_HAS_VARIABLE_PROVIDER } from '../../common/notebookContextKeys.js';
import { NOTEBOOK_VARIABLE_VIEW_ENABLED } from '../contrib/notebookVariables/notebookVariableContextKeys.js';
import * as icons from '../notebookIcons.js';

import { INotebookActionContext, NotebookAction } from './coreActions.js';

const OPEN_VARIABLES_VIEW_COMMAND_ID = 'notebook.openVariablesView';

registerAction2(class OpenVariablesViewAction extends NotebookAction {

	constructor() {
		super({
			id: OPEN_VARIABLES_VIEW_COMMAND_ID,
			title: localize2('notebookActions.openVariablesView', "Variables"),
			icon: icons.variablesViewIcon,
			menu: [
				{
					id: MenuId.InteractiveToolbar,
					group: 'navigation',
					when: ContextKeyExpr.and(
						KERNEL_HAS_VARIABLE_PROVIDER,
						// jupyter extension currently contributes their own goto variables button
						ContextKeyExpr.notEquals('jupyter.kernel.isjupyter', true),
						NOTEBOOK_VARIABLE_VIEW_ENABLED
					)
				},
				{
					id: MenuId.EditorTitle,
					order: -1,
					group: 'navigation',
					when: ContextKeyExpr.and(
						KERNEL_HAS_VARIABLE_PROVIDER,
						// jupyter extension currently contributes their own goto variables button
						ContextKeyExpr.notEquals('jupyter.kernel.isjupyter', true),
						ContextKeyExpr.notEquals('config.notebook.globalToolbar', true),
						NOTEBOOK_VARIABLE_VIEW_ENABLED
					)
				},
				{
					id: MenuId.NotebookToolbar,
					order: -1,
					group: 'navigation',
					when: ContextKeyExpr.and(
						KERNEL_HAS_VARIABLE_PROVIDER,
						// jupyter extension currently contributes their own goto variables button
						ContextKeyExpr.notEquals('jupyter.kernel.isjupyter', true),
						ContextKeyExpr.equals('config.notebook.globalToolbar', true),
						NOTEBOOK_VARIABLE_VIEW_ENABLED
					)
				}
			]
		});
	}

	override async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext) {
		const variableViewId = 'workbench.notebook.variables';
		accessor.get(IViewsService).openView(variableViewId, true);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/controller/chat/cellChatActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/controller/chat/cellChatActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../../base/common/codicons.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../../../base/common/keyCodes.js';
import { localize, localize2 } from '../../../../../../nls.js';
import { MenuId, MenuRegistry, registerAction2 } from '../../../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../../../platform/contextkey/common/contextkey.js';
import { InputFocusedContextKey } from '../../../../../../platform/contextkey/common/contextkeys.js';
import { ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { CTX_INLINE_CHAT_REQUEST_IN_PROGRESS, CTX_INLINE_CHAT_RESPONSE_TYPE, CTX_INLINE_CHAT_VISIBLE, InlineChatResponseType, MENU_INLINE_CHAT_WIDGET_STATUS } from '../../../../inlineChat/common/inlineChat.js';
import { CTX_NOTEBOOK_CHAT_HAS_AGENT } from './notebookChatContext.js';
import { INotebookActionContext, NotebookAction, getContextFromActiveEditor, getEditorFromArgsOrActivePane } from '../coreActions.js';
import { insertNewCell } from '../insertCellActions.js';
import { CellKind, NotebookSetting } from '../../../common/notebookCommon.js';
import { NOTEBOOK_EDITOR_EDITABLE, NOTEBOOK_EDITOR_FOCUSED } from '../../../common/notebookContextKeys.js';
import { Iterable } from '../../../../../../base/common/iterator.js';
import { ICodeEditor } from '../../../../../../editor/browser/editorBrowser.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { ChatContextKeys } from '../../../../chat/common/chatContextKeys.js';
import { InlineChatController } from '../../../../inlineChat/browser/inlineChatController.js';
import { EditorAction2 } from '../../../../../../editor/browser/editorExtensions.js';

interface IInsertCellWithChatArgs extends INotebookActionContext {
	input?: string;
	autoSend?: boolean;
	source?: string;
}

async function startChat(accessor: ServicesAccessor, context: INotebookActionContext, index: number, input?: string, autoSend?: boolean, source?: string) {
	const configurationService = accessor.get(IConfigurationService);
	const commandService = accessor.get(ICommandService);

	if (configurationService.getValue<boolean>(NotebookSetting.cellGenerate) || configurationService.getValue<boolean>(NotebookSetting.cellChat)) {
		const activeCell = context.notebookEditor.getActiveCell();
		const targetCell = activeCell?.getTextLength() === 0 && source !== 'insertToolbar' ? activeCell : (await insertNewCell(accessor, context, CellKind.Code, 'below', true));

		if (targetCell) {
			targetCell.enableAutoLanguageDetection();
			await context.notebookEditor.revealFirstLineIfOutsideViewport(targetCell);
			const codeEditor = context.notebookEditor.codeEditors.find(ce => ce[0] === targetCell)?.[1];
			if (codeEditor) {
				codeEditor.focus();
				commandService.executeCommand('inlineChat.start');
			}
		}
	}
}

registerAction2(class extends NotebookAction {
	constructor() {
		super(
			{
				id: 'notebook.cell.chat.start',
				title: {
					value: '$(sparkle) ' + localize('notebookActions.menu.insertCodeCellWithChat', "Generate"),
					original: '$(sparkle) Generate',
				},
				tooltip: localize('notebookActions.menu.insertCodeCellWithChat.tooltip', "Start Chat to Generate Code"),
				metadata: {
					description: localize('notebookActions.menu.insertCodeCellWithChat.tooltip', "Start Chat to Generate Code"),
					args: [
						{
							name: 'args',
							schema: {
								type: 'object',
								required: ['index'],
								properties: {
									'index': {
										type: 'number'
									},
									'input': {
										type: 'string'
									},
									'autoSend': {
										type: 'boolean'
									}
								}
							}
						}
					]
				},
				f1: false,
				keybinding: {
					when: ContextKeyExpr.and(
						NOTEBOOK_EDITOR_FOCUSED,
						NOTEBOOK_EDITOR_EDITABLE.isEqualTo(true),
						ContextKeyExpr.not(InputFocusedContextKey),
						CTX_NOTEBOOK_CHAT_HAS_AGENT,
						ContextKeyExpr.or(
							ContextKeyExpr.equals(`config.${NotebookSetting.cellChat}`, true),
							ContextKeyExpr.equals(`config.${NotebookSetting.cellGenerate}`, true)
						)
					),
					weight: KeybindingWeight.WorkbenchContrib,
					primary: KeyMod.CtrlCmd | KeyCode.KeyI,
					secondary: [KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyI)],
				},
				menu: [
					{
						id: MenuId.NotebookCellBetween,
						group: 'inline',
						order: -1,
						when: ContextKeyExpr.and(
							NOTEBOOK_EDITOR_EDITABLE.isEqualTo(true),
							CTX_NOTEBOOK_CHAT_HAS_AGENT,
							ContextKeyExpr.or(
								ContextKeyExpr.equals(`config.${NotebookSetting.cellChat}`, true),
								ContextKeyExpr.equals(`config.${NotebookSetting.cellGenerate}`, true)
							)
						)
					}
				]
			});
	}

	override getEditorContextFromArgsOrActive(accessor: ServicesAccessor, ...args: any[]): IInsertCellWithChatArgs | undefined {
		const [firstArg] = args;
		if (!firstArg) {
			const notebookEditor = getEditorFromArgsOrActivePane(accessor);
			if (!notebookEditor) {
				return undefined;
			}

			const activeCell = notebookEditor.getActiveCell();
			if (!activeCell) {
				return undefined;
			}

			return {
				cell: activeCell,
				notebookEditor,
				input: undefined,
				autoSend: undefined
			};
		}

		if (typeof firstArg !== 'object' || typeof firstArg.index !== 'number') {
			return undefined;
		}

		const notebookEditor = getEditorFromArgsOrActivePane(accessor);
		if (!notebookEditor) {
			return undefined;
		}

		const cell = firstArg.index <= 0 ? undefined : notebookEditor.cellAt(firstArg.index - 1);

		return {
			cell,
			notebookEditor,
			input: firstArg.input,
			autoSend: firstArg.autoSend
		};
	}

	async runWithContext(accessor: ServicesAccessor, context: IInsertCellWithChatArgs) {
		const index = Math.max(0, context.cell ? context.notebookEditor.getCellIndex(context.cell) + 1 : 0);
		await startChat(accessor, context, index, context.input, context.autoSend, context.source);
	}
});

registerAction2(class extends NotebookAction {
	constructor() {
		super(
			{
				id: 'notebook.cell.chat.startAtTop',
				title: {
					value: '$(sparkle) ' + localize('notebookActions.menu.insertCodeCellWithChat', "Generate"),
					original: '$(sparkle) Generate',
				},
				tooltip: localize('notebookActions.menu.insertCodeCellWithChat.tooltip', "Start Chat to Generate Code"),
				f1: false,
				menu: [
					{
						id: MenuId.NotebookCellListTop,
						group: 'inline',
						order: -1,
						when: ContextKeyExpr.and(
							NOTEBOOK_EDITOR_EDITABLE.isEqualTo(true),
							CTX_NOTEBOOK_CHAT_HAS_AGENT,
							ContextKeyExpr.or(
								ContextKeyExpr.equals(`config.${NotebookSetting.cellChat}`, true),
								ContextKeyExpr.equals(`config.${NotebookSetting.cellGenerate}`, true)
							)
						)
					},
				]
			});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext) {
		await startChat(accessor, context, 0, '', false);
	}
});

MenuRegistry.appendMenuItem(MenuId.NotebookToolbar, {
	command: {
		id: 'notebook.cell.chat.start',
		icon: Codicon.sparkle,
		title: localize('notebookActions.menu.insertCode.ontoolbar', "Generate"),
		tooltip: localize('notebookActions.menu.insertCode.tooltip', "Start Chat to Generate Code")
	},
	order: -10,
	group: 'navigation/add',
	when: ContextKeyExpr.and(
		NOTEBOOK_EDITOR_EDITABLE.isEqualTo(true),
		ContextKeyExpr.notEquals('config.notebook.insertToolbarLocation', 'betweenCells'),
		ContextKeyExpr.notEquals('config.notebook.insertToolbarLocation', 'hidden'),
		CTX_NOTEBOOK_CHAT_HAS_AGENT,
		ContextKeyExpr.or(
			ContextKeyExpr.equals(`config.${NotebookSetting.cellChat}`, true),
			ContextKeyExpr.equals(`config.${NotebookSetting.cellGenerate}`, true)
		)
	)
});

export class AcceptChangesAndRun extends EditorAction2 {

	constructor() {
		super({
			id: 'notebook.inlineChat.acceptChangesAndRun',
			title: localize2('notebook.apply1', "Accept and Run"),
			shortTitle: localize('notebook.apply2', 'Accept & Run'),
			tooltip: localize('notebook.apply3', 'Accept the changes and run the cell'),
			icon: Codicon.check,
			f1: true,
			precondition: ContextKeyExpr.and(
				NOTEBOOK_EDITOR_EDITABLE.isEqualTo(true),
				CTX_INLINE_CHAT_VISIBLE,
			),
			keybinding: undefined,
			menu: [{
				id: MENU_INLINE_CHAT_WIDGET_STATUS,
				group: '0_main',
				order: 2,
				when: ContextKeyExpr.and(
					NOTEBOOK_EDITOR_EDITABLE.isEqualTo(true),
					ChatContextKeys.inputHasText.toNegated(),
					CTX_INLINE_CHAT_REQUEST_IN_PROGRESS.toNegated(),
					CTX_INLINE_CHAT_RESPONSE_TYPE.isEqualTo(InlineChatResponseType.MessagesAndEdits)
				)
			}]
		});
	}

	override runEditorCommand(accessor: ServicesAccessor, codeEditor: ICodeEditor) {
		const editor = getContextFromActiveEditor(accessor.get(IEditorService));
		const ctrl = InlineChatController.get(codeEditor);

		if (!editor || !ctrl) {
			return;
		}

		const matchedCell = editor.notebookEditor.codeEditors.find(e => e[1] === codeEditor);
		const cell = matchedCell?.[0];

		if (!cell) {
			return;
		}

		ctrl.acceptSession();
		return editor.notebookEditor.executeNotebookCells(Iterable.single(cell));
	}
}
registerAction2(AcceptChangesAndRun);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/controller/chat/notebook.chat.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/controller/chat/notebook.chat.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { codiconsLibrary } from '../../../../../../base/common/codiconsLibrary.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../../base/common/network.js';
import { Position } from '../../../../../../editor/common/core/position.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { IWordAtPosition } from '../../../../../../editor/common/core/wordHelper.js';
import { CompletionContext, CompletionItemKind, CompletionList } from '../../../../../../editor/common/languages.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { ILanguageFeaturesService } from '../../../../../../editor/common/services/languageFeatures.js';
import { localize } from '../../../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputService, IQuickPickItem } from '../../../../../../platform/quickinput/common/quickInput.js';
import { IWorkbenchContribution, registerWorkbenchContribution2, WorkbenchPhase } from '../../../../../common/contributions.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { IChatWidget, IChatWidgetService } from '../../../../chat/browser/chat.js';
import { IChatContextPicker, IChatContextPickerItem, IChatContextPickerPickItem, IChatContextPickService } from '../../../../chat/browser/chatContextPickService.js';
import { ChatDynamicVariableModel } from '../../../../chat/browser/contrib/chatDynamicVariables.js';
import { computeCompletionRanges } from '../../../../chat/browser/contrib/chatInputCompletions.js';
import { IChatAgentService } from '../../../../chat/common/chatAgents.js';
import { ChatContextKeys } from '../../../../chat/common/chatContextKeys.js';
import { chatVariableLeader } from '../../../../chat/common/chatParserTypes.js';
import { ChatAgentLocation } from '../../../../chat/common/constants.js';
import { NOTEBOOK_CELL_HAS_OUTPUTS, NOTEBOOK_CELL_OUTPUT_MIME_TYPE_LIST_FOR_CHAT, NOTEBOOK_CELL_OUTPUT_MIMETYPE } from '../../../common/notebookContextKeys.js';
import { INotebookKernelService } from '../../../common/notebookKernelService.js';
import { createNotebookOutputVariableEntry, NOTEBOOK_CELL_OUTPUT_MIME_TYPE_LIST_FOR_CHAT_CONST } from '../../contrib/chat/notebookChatUtils.js';
import { getNotebookEditorFromEditorPane, ICellOutputViewModel, INotebookEditor } from '../../notebookBrowser.js';
import * as icons from '../../notebookIcons.js';
import { getOutputViewModelFromId } from '../cellOutputActions.js';
import { INotebookOutputActionContext, NOTEBOOK_ACTIONS_CATEGORY } from '../coreActions.js';
import './cellChatActions.js';
import { CTX_NOTEBOOK_CHAT_HAS_AGENT } from './notebookChatContext.js';

const NotebookKernelVariableKey = 'kernelVariable';

class NotebookChatContribution extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.notebookChatContribution';

	private readonly _ctxHasProvider: IContextKey<boolean>;

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@IChatAgentService chatAgentService: IChatAgentService,
		@IEditorService private readonly editorService: IEditorService,
		@IChatWidgetService private readonly chatWidgetService: IChatWidgetService,
		@INotebookKernelService private readonly notebookKernelService: INotebookKernelService,
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
		@IChatContextPickService chatContextPickService: IChatContextPickService
	) {
		super();

		this._register(chatContextPickService.registerChatContextItem(new KernelVariableContextPicker(this.editorService, this.notebookKernelService)));

		this._ctxHasProvider = CTX_NOTEBOOK_CHAT_HAS_AGENT.bindTo(contextKeyService);

		const updateNotebookAgentStatus = () => {
			const hasNotebookAgent = Boolean(chatAgentService.getDefaultAgent(ChatAgentLocation.Notebook));
			this._ctxHasProvider.set(hasNotebookAgent);
		};

		updateNotebookAgentStatus();
		this._register(chatAgentService.onDidChangeAgents(updateNotebookAgentStatus));

		this._register(this.languageFeaturesService.completionProvider.register({ scheme: Schemas.vscodeChatInput, hasAccessToAllModels: true }, {
			_debugDisplayName: 'chatKernelDynamicCompletions',
			triggerCharacters: [chatVariableLeader],
			provideCompletionItems: async (model: ITextModel, position: Position, _context: CompletionContext, token: CancellationToken) => {
				const widget = this.chatWidgetService.getWidgetByInputUri(model.uri);
				if (!widget || !widget.supportsFileReferences) {
					return null;
				}

				if (widget.location !== ChatAgentLocation.Notebook) {
					return null;
				}

				const variableNameDef = new RegExp(`${chatVariableLeader}\\w*`, 'g');
				const range = computeCompletionRanges(model, position, variableNameDef, true);
				if (!range) {
					return null;
				}

				const result: CompletionList = { suggestions: [] };

				const afterRange = new Range(position.lineNumber, range.replace.startColumn, position.lineNumber, range.replace.startColumn + `${chatVariableLeader}${NotebookKernelVariableKey}:`.length);
				result.suggestions.push({
					label: `${chatVariableLeader}${NotebookKernelVariableKey}`,
					insertText: `${chatVariableLeader}${NotebookKernelVariableKey}:`,
					detail: localize('pickKernelVariableLabel', "Pick a variable from the kernel"),
					range,
					kind: CompletionItemKind.Text,
					command: { id: SelectAndInsertKernelVariableAction.ID, title: SelectAndInsertKernelVariableAction.ID, arguments: [{ widget, range: afterRange }] },
					sortText: 'z'
				});

				await this.addKernelVariableCompletion(widget, result, range, token);

				return result;
			}
		}));

		// output context
		NOTEBOOK_CELL_OUTPUT_MIME_TYPE_LIST_FOR_CHAT.bindTo(contextKeyService).set(NOTEBOOK_CELL_OUTPUT_MIME_TYPE_LIST_FOR_CHAT_CONST);
	}

	private async addKernelVariableCompletion(widget: IChatWidget, result: CompletionList, info: { insert: Range; replace: Range; varWord: IWordAtPosition | null }, token: CancellationToken) {
		let pattern: string | undefined;
		if (info.varWord?.word && info.varWord.word.startsWith(chatVariableLeader)) {
			pattern = info.varWord.word.toLowerCase().slice(1);
		}

		const notebook = getNotebookEditorFromEditorPane(this.editorService.activeEditorPane)?.getViewModel()?.notebookDocument;

		if (!notebook) {
			return;
		}

		const selectedKernel = this.notebookKernelService.getMatchingKernel(notebook).selected;
		const hasVariableProvider = selectedKernel?.hasVariableProvider;

		if (!hasVariableProvider) {
			return;
		}

		const variables = selectedKernel.provideVariables(notebook.uri, undefined, 'named', 0, CancellationToken.None);

		for await (const variable of variables) {
			if (pattern && !variable.name.toLowerCase().includes(pattern)) {
				continue;
			}

			result.suggestions.push({
				label: { label: variable.name, description: variable.type },
				insertText: `${chatVariableLeader}${NotebookKernelVariableKey}:${variable.name} `,
				filterText: `${chatVariableLeader}${variable.name}`,
				range: info,
				kind: CompletionItemKind.Variable,
				sortText: 'z',
				command: { id: SelectAndInsertKernelVariableAction.ID, title: SelectAndInsertKernelVariableAction.ID, arguments: [{ widget, range: info.insert, variable: variable.name }] },
				detail: variable.type,
				documentation: variable.value,
			});
		}
	}
}

export class SelectAndInsertKernelVariableAction extends Action2 {
	constructor() {
		super({
			id: SelectAndInsertKernelVariableAction.ID,
			title: '' // not displayed
		});
	}

	static readonly ID = 'notebook.chat.selectAndInsertKernelVariable';

	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const notebookKernelService = accessor.get(INotebookKernelService);
		const quickInputService = accessor.get(IQuickInputService);

		const notebook = getNotebookEditorFromEditorPane(editorService.activeEditorPane)?.getViewModel()?.notebookDocument;

		if (!notebook) {
			return;
		}

		const context = args[0] as { widget: IChatWidget; range?: Range; variable?: string } | undefined;
		if (!context || !('widget' in context) || !('range' in context)) {
			return;
		}

		const widget = context.widget;
		const range = context.range;
		const variable = context.variable;

		if (variable !== undefined) {
			this.addVariableReference(widget, variable, range, false);
			return;
		}

		const selectedKernel = notebookKernelService.getMatchingKernel(notebook).selected;
		const hasVariableProvider = selectedKernel?.hasVariableProvider;

		if (!hasVariableProvider) {
			return;
		}

		const variables = selectedKernel.provideVariables(notebook.uri, undefined, 'named', 0, CancellationToken.None);

		const quickPickItems: IQuickPickItem[] = [];
		for await (const variable of variables) {
			quickPickItems.push({
				label: variable.name,
				description: variable.value,
				detail: variable.type,
			});
		}

		const placeHolder = quickPickItems.length > 0
			? localize('selectKernelVariablePlaceholder', "Select a kernel variable")
			: localize('noKernelVariables', "No kernel variables found");

		const pickedVariable = await quickInputService.pick(quickPickItems, { placeHolder });
		if (!pickedVariable) {
			return;
		}

		this.addVariableReference(widget, pickedVariable.label, range, true);
	}

	private addVariableReference(widget: IChatWidget, variableName: string, range?: Range, updateText?: boolean) {
		if (range) {
			const text = `#kernelVariable:${variableName}`;

			if (updateText) {
				const editor = widget.inputEditor;
				const success = editor.executeEdits('chatInsertFile', [{ range, text: text + ' ' }]);
				if (!success) {
					return;
				}
			}

			widget.getContrib<ChatDynamicVariableModel>(ChatDynamicVariableModel.ID)?.addReference({
				id: 'vscode.notebook.variable',
				range: { startLineNumber: range.startLineNumber, startColumn: range.startColumn, endLineNumber: range.endLineNumber, endColumn: range.startColumn + text.length },
				data: variableName,
				fullName: variableName,
				icon: codiconsLibrary.variable,
			});
		} else {
			widget.attachmentModel.addContext({
				id: 'vscode.notebook.variable',
				name: variableName,
				value: variableName,
				icon: codiconsLibrary.variable,
				kind: 'generic'
			});
		}
	}
}

class KernelVariableContextPicker implements IChatContextPickerItem {

	readonly type = 'pickerPick';
	readonly label = localize('chatContext.notebook.kernelVariable', 'Kernel Variable...');
	readonly icon = Codicon.serverEnvironment;

	constructor(
		@IEditorService private readonly editorService: IEditorService,
		@INotebookKernelService private readonly notebookKernelService: INotebookKernelService,
	) { }

	isEnabled(widget: IChatWidget): Promise<boolean> | boolean {
		return widget.location === ChatAgentLocation.Notebook && Boolean(getNotebookEditorFromEditorPane(this.editorService.activeEditorPane)?.getViewModel()?.notebookDocument);
	}

	asPicker(): IChatContextPicker {

		const picks = (async () => {

			const notebook = getNotebookEditorFromEditorPane(this.editorService.activeEditorPane)?.getViewModel()?.notebookDocument;

			if (!notebook) {
				return [];
			}

			const selectedKernel = this.notebookKernelService.getMatchingKernel(notebook).selected;
			const hasVariableProvider = selectedKernel?.hasVariableProvider;

			if (!hasVariableProvider) {
				return [];
			}

			const variables = selectedKernel.provideVariables(notebook.uri, undefined, 'named', 0, CancellationToken.None);

			const result: IChatContextPickerPickItem[] = [];
			for await (const variable of variables) {
				result.push({
					label: variable.name,
					description: variable.value,
					asAttachment: () => {
						return {
							kind: 'generic',
							id: 'vscode.notebook.variable',
							name: variable.name,
							value: variable.value,
							icon: codiconsLibrary.variable,
						};
					},
				});
			}

			return result;
		})();

		return {
			placeholder: localize('chatContext.notebook.kernelVariable.placeholder', 'Select a kernel variable'),
			picks
		};
	}
}


registerAction2(class AddCellOutputToChatAction extends Action2 {
	constructor() {
		super({
			id: 'notebook.cellOutput.addToChat',
			title: localize('notebookActions.addOutputToChat', "Add Cell Output to Chat"),
			menu: {
				id: MenuId.NotebookOutputToolbar,
				when: ContextKeyExpr.and(NOTEBOOK_CELL_HAS_OUTPUTS, ContextKeyExpr.in(NOTEBOOK_CELL_OUTPUT_MIMETYPE.key, NOTEBOOK_CELL_OUTPUT_MIME_TYPE_LIST_FOR_CHAT.key)),
				order: 10,
				group: 'notebook_chat_actions'
			},
			category: NOTEBOOK_ACTIONS_CATEGORY,
			icon: icons.copyIcon,
			precondition: ChatContextKeys.enabled
		});
	}

	private getNoteboookEditor(editorService: IEditorService, outputContext: INotebookOutputActionContext | { outputViewModel: ICellOutputViewModel } | undefined): INotebookEditor | undefined {
		if (outputContext && 'notebookEditor' in outputContext) {
			return outputContext.notebookEditor;
		}
		return getNotebookEditorFromEditorPane(editorService.activeEditorPane);
	}

	async run(accessor: ServicesAccessor, outputContext: INotebookOutputActionContext | { outputViewModel: ICellOutputViewModel } | undefined): Promise<void> {
		const notebookEditor = this.getNoteboookEditor(accessor.get(IEditorService), outputContext);

		if (!notebookEditor) {
			return;
		}

		let outputViewModel: ICellOutputViewModel | undefined;
		if (outputContext && 'outputId' in outputContext && typeof outputContext.outputId === 'string') {
			outputViewModel = getOutputViewModelFromId(outputContext.outputId, notebookEditor);
		} else if (outputContext && 'outputViewModel' in outputContext) {
			outputViewModel = outputContext.outputViewModel;
		}

		if (!outputViewModel) {
			// not able to find the output from the provided context, use the active cell
			const activeCell = notebookEditor.getActiveCell();
			if (!activeCell) {
				return;
			}

			if (activeCell.focusedOutputId !== undefined) {
				outputViewModel = activeCell.outputsViewModels.find(output => {
					return output.model.outputId === activeCell.focusedOutputId;
				});
			} else {
				outputViewModel = activeCell.outputsViewModels.find(output => output.pickedMimeType?.isTrusted);
			}
		}

		if (!outputViewModel) {
			return;
		}

		const mimeType = outputViewModel.pickedMimeType?.mimeType;

		const chatWidgetService = accessor.get(IChatWidgetService);
		const widget = await chatWidgetService.revealWidget();
		if (widget && mimeType && NOTEBOOK_CELL_OUTPUT_MIME_TYPE_LIST_FOR_CHAT_CONST.includes(mimeType)) {

			const entry = createNotebookOutputVariableEntry(outputViewModel, mimeType, notebookEditor);
			if (!entry) {
				return;
			}

			widget.attachmentModel.addContext(entry);
			(await chatWidgetService.revealWidget())?.focusInput();
		}
	}

});

registerAction2(SelectAndInsertKernelVariableAction);
registerWorkbenchContribution2(NotebookChatContribution.ID, NotebookChatContribution, WorkbenchPhase.BlockRestore);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/controller/chat/notebookChatContext.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/controller/chat/notebookChatContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../../nls.js';
import { RawContextKey } from '../../../../../../platform/contextkey/common/contextkey.js';

export const CTX_NOTEBOOK_CHAT_HAS_AGENT = new RawContextKey<boolean>('notebookChatAgentRegistered', false, localize('notebookChatAgentRegistered', "Whether a chat agent for notebook is registered"));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/diffCellEditorOptions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/diffCellEditorOptions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDiffEditorConstructionOptions } from '../../../../../editor/browser/editorBrowser.js';
import { IEditorOptions } from '../../../../../editor/common/config/editorOptions.js';

/**
 * Do not leave at 12, when at 12 and we have whitespace and only one line,
 * then there's not enough space for the button `Show Whitespace Differences`
 */
const fixedEditorPaddingSingleLineCells = {
	top: 24,
	bottom: 24
};
const fixedEditorPadding = {
	top: 12,
	bottom: 12
};

export function getEditorPadding(lineCount: number) {
	return lineCount === 1 ? fixedEditorPaddingSingleLineCells : fixedEditorPadding;
}

export const fixedEditorOptions: IEditorOptions = {
	padding: fixedEditorPadding,
	scrollBeyondLastLine: false,
	scrollbar: {
		verticalScrollbarSize: 14,
		horizontal: 'auto',
		vertical: 'auto',
		useShadows: true,
		verticalHasArrows: false,
		horizontalHasArrows: false,
		alwaysConsumeMouseWheel: false,
	},
	renderLineHighlightOnlyWhenFocus: true,
	overviewRulerLanes: 0,
	overviewRulerBorder: false,
	selectOnLineNumbers: false,
	wordWrap: 'off',
	lineNumbers: 'off',
	glyphMargin: true,
	fixedOverflowWidgets: true,
	minimap: { enabled: false },
	renderValidationDecorations: 'on',
	renderLineHighlight: 'none',
	readOnly: true
};

export const fixedDiffEditorOptions: IDiffEditorConstructionOptions = {
	...fixedEditorOptions,
	glyphMargin: true,
	enableSplitViewResizing: false,
	renderIndicators: true,
	renderMarginRevertIcon: false,
	readOnly: false,
	isInEmbeddedEditor: true,
	renderOverviewRuler: false,
	wordWrap: 'off',
	diffWordWrap: 'off',
	diffAlgorithm: 'advanced',
	renderSideBySide: true,
	useInlineViewWhenSpaceIsLimited: false
};
```

--------------------------------------------------------------------------------

````
