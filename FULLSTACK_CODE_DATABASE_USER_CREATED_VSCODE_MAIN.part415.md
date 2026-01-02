---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 415
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 415 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/cellCommands/cellCommands.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/cellCommands/cellCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyChord, KeyCode, KeyMod } from '../../../../../../base/common/keyCodes.js';
import { Mimes } from '../../../../../../base/common/mime.js';
import { IBulkEditService, ResourceTextEdit } from '../../../../../../editor/browser/services/bulkEditService.js';
import { localize, localize2 } from '../../../../../../nls.js';
import { MenuId, registerAction2 } from '../../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../../../platform/contextkey/common/contextkey.js';
import { InputFocusedContext, InputFocusedContextKey } from '../../../../../../platform/contextkey/common/contextkeys.js';
import { ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ResourceNotebookCellEdit } from '../../../../bulkEdit/browser/bulkCellEdits.js';
import { changeCellToKind, computeCellLinesContents, copyCellRange, joinCellsWithSurrounds, joinSelectedCells, moveCellRange } from '../../controller/cellOperations.js';
import { cellExecutionArgs, CellOverflowToolbarGroups, CellToolbarOrder, CELL_TITLE_CELL_GROUP_ID, INotebookCellActionContext, INotebookCellToolbarActionContext, INotebookCommandContext, NotebookCellAction, NotebookMultiCellAction, parseMultiCellExecutionArgs } from '../../controller/coreActions.js';
import { CellFocusMode, EXPAND_CELL_INPUT_COMMAND_ID, EXPAND_CELL_OUTPUT_COMMAND_ID, ICellOutputViewModel, ICellViewModel, INotebookEditor } from '../../notebookBrowser.js';
import { NOTEBOOK_CELL_EDITABLE, NOTEBOOK_CELL_HAS_OUTPUTS, NOTEBOOK_CELL_INPUT_COLLAPSED, NOTEBOOK_CELL_LIST_FOCUSED, NOTEBOOK_CELL_OUTPUT_COLLAPSED, NOTEBOOK_CELL_TYPE, NOTEBOOK_EDITOR_EDITABLE, NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_IS_ACTIVE_EDITOR, NOTEBOOK_OUTPUT_FOCUSED } from '../../../common/notebookContextKeys.js';
import * as icons from '../../notebookIcons.js';
import { CellEditType, CellKind, NotebookSetting } from '../../../common/notebookCommon.js';
import { INotificationService } from '../../../../../../platform/notification/common/notification.js';
import { EditorContextKeys } from '../../../../../../editor/common/editorContextKeys.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';

//#region Move/Copy cells
const MOVE_CELL_UP_COMMAND_ID = 'notebook.cell.moveUp';
const MOVE_CELL_DOWN_COMMAND_ID = 'notebook.cell.moveDown';
const COPY_CELL_UP_COMMAND_ID = 'notebook.cell.copyUp';
const COPY_CELL_DOWN_COMMAND_ID = 'notebook.cell.copyDown';

registerAction2(class extends NotebookCellAction {
	constructor() {
		super(
			{
				id: MOVE_CELL_UP_COMMAND_ID,
				title: localize2('notebookActions.moveCellUp', "Move Cell Up"),
				icon: icons.moveUpIcon,
				keybinding: {
					primary: KeyMod.Alt | KeyCode.UpArrow,
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, InputFocusedContext.toNegated()),
					weight: KeybindingWeight.WorkbenchContrib
				},
				menu: {
					id: MenuId.NotebookCellTitle,
					when: ContextKeyExpr.equals('config.notebook.dragAndDropEnabled', false),
					group: CellOverflowToolbarGroups.Edit,
					order: 14
				}
			});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext) {
		return moveCellRange(context, 'up');
	}
});

registerAction2(class extends NotebookCellAction {
	constructor() {
		super(
			{
				id: MOVE_CELL_DOWN_COMMAND_ID,
				title: localize2('notebookActions.moveCellDown', "Move Cell Down"),
				icon: icons.moveDownIcon,
				keybinding: {
					primary: KeyMod.Alt | KeyCode.DownArrow,
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, InputFocusedContext.toNegated()),
					weight: KeybindingWeight.WorkbenchContrib
				},
				menu: {
					id: MenuId.NotebookCellTitle,
					when: ContextKeyExpr.equals('config.notebook.dragAndDropEnabled', false),
					group: CellOverflowToolbarGroups.Edit,
					order: 14
				}
			});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext) {
		return moveCellRange(context, 'down');
	}
});

registerAction2(class extends NotebookCellAction {
	constructor() {
		super(
			{
				id: COPY_CELL_UP_COMMAND_ID,
				title: localize2('notebookActions.copyCellUp', "Copy Cell Up"),
				keybinding: {
					primary: KeyMod.Alt | KeyMod.Shift | KeyCode.UpArrow,
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, InputFocusedContext.toNegated()),
					weight: KeybindingWeight.WorkbenchContrib
				}
			});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext) {
		return copyCellRange(context, 'up');
	}
});

registerAction2(class extends NotebookCellAction {
	constructor() {
		super(
			{
				id: COPY_CELL_DOWN_COMMAND_ID,
				title: localize2('notebookActions.copyCellDown', "Copy Cell Down"),
				keybinding: {
					primary: KeyMod.Alt | KeyMod.Shift | KeyCode.DownArrow,
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, InputFocusedContext.toNegated()),
					weight: KeybindingWeight.WorkbenchContrib
				},
				menu: {
					id: MenuId.NotebookCellTitle,
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_EDITOR_EDITABLE, NOTEBOOK_CELL_EDITABLE),
					group: CellOverflowToolbarGroups.Edit,
					order: 13
				}
			});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext) {
		return copyCellRange(context, 'down');
	}
});


//#endregion

//#region Join/Split

const SPLIT_CELL_COMMAND_ID = 'notebook.cell.split';
const JOIN_SELECTED_CELLS_COMMAND_ID = 'notebook.cell.joinSelected';
const JOIN_CELL_ABOVE_COMMAND_ID = 'notebook.cell.joinAbove';
const JOIN_CELL_BELOW_COMMAND_ID = 'notebook.cell.joinBelow';


registerAction2(class extends NotebookCellAction {
	constructor() {
		super(
			{
				id: SPLIT_CELL_COMMAND_ID,
				title: localize2('notebookActions.splitCell', "Split Cell"),
				menu: {
					id: MenuId.NotebookCellTitle,
					when: ContextKeyExpr.and(
						NOTEBOOK_EDITOR_EDITABLE,
						NOTEBOOK_CELL_EDITABLE,
						NOTEBOOK_CELL_INPUT_COLLAPSED.toNegated()
					),
					order: CellToolbarOrder.SplitCell,
					group: CELL_TITLE_CELL_GROUP_ID
				},
				icon: icons.splitCellIcon,
				keybinding: {
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_EDITOR_EDITABLE, NOTEBOOK_CELL_EDITABLE, EditorContextKeys.editorTextFocus),
					primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Backslash),
					weight: KeybindingWeight.WorkbenchContrib
				},
			});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext) {
		if (context.notebookEditor.isReadOnly) {
			return;
		}

		const bulkEditService = accessor.get(IBulkEditService);
		const cell = context.cell;
		const index = context.notebookEditor.getCellIndex(cell);
		const splitPoints = cell.focusMode === CellFocusMode.Container ? [{ lineNumber: 1, column: 1 }] : cell.getSelectionsStartPosition();
		if (splitPoints && splitPoints.length > 0) {
			await cell.resolveTextModel();

			if (!cell.hasModel()) {
				return;
			}

			const newLinesContents = computeCellLinesContents(cell, splitPoints);
			if (newLinesContents) {
				const language = cell.language;
				const kind = cell.cellKind;
				const mime = cell.mime;

				const textModel = await cell.resolveTextModel();
				await bulkEditService.apply(
					[
						new ResourceTextEdit(cell.uri, { range: textModel.getFullModelRange(), text: newLinesContents[0] }),
						new ResourceNotebookCellEdit(context.notebookEditor.textModel.uri,
							{
								editType: CellEditType.Replace,
								index: index + 1,
								count: 0,
								cells: newLinesContents.slice(1).map(line => ({
									cellKind: kind,
									language,
									mime,
									source: line,
									outputs: [],
									metadata: {}
								}))
							}
						)
					],
					{ quotableLabel: 'Split Notebook Cell' }
				);

				context.notebookEditor.cellAt(index + 1)?.updateEditState(cell.getEditState(), 'splitCell');
			}
		}
	}
});


registerAction2(class extends NotebookCellAction {
	constructor() {
		super(
			{
				id: JOIN_CELL_ABOVE_COMMAND_ID,
				title: localize2('notebookActions.joinCellAbove', "Join With Previous Cell"),
				keybinding: {
					when: NOTEBOOK_EDITOR_FOCUSED,
					primary: KeyMod.WinCtrl | KeyMod.Alt | KeyMod.Shift | KeyCode.KeyJ,
					weight: KeybindingWeight.WorkbenchContrib
				},
				menu: {
					id: MenuId.NotebookCellTitle,
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_EDITOR_EDITABLE),
					group: CellOverflowToolbarGroups.Edit,
					order: 10
				}
			});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext) {
		const bulkEditService = accessor.get(IBulkEditService);
		return joinCellsWithSurrounds(bulkEditService, context, 'above');
	}
});


registerAction2(class extends NotebookCellAction {
	constructor() {
		super(
			{
				id: JOIN_CELL_BELOW_COMMAND_ID,
				title: localize2('notebookActions.joinCellBelow', "Join With Next Cell"),
				keybinding: {
					when: NOTEBOOK_EDITOR_FOCUSED,
					primary: KeyMod.WinCtrl | KeyMod.Alt | KeyCode.KeyJ,
					weight: KeybindingWeight.WorkbenchContrib
				},
				menu: {
					id: MenuId.NotebookCellTitle,
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_EDITOR_EDITABLE),
					group: CellOverflowToolbarGroups.Edit,
					order: 11
				}
			});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext) {
		const bulkEditService = accessor.get(IBulkEditService);
		return joinCellsWithSurrounds(bulkEditService, context, 'below');
	}
});

registerAction2(class extends NotebookCellAction {
	constructor() {
		super(
			{
				id: JOIN_SELECTED_CELLS_COMMAND_ID,
				title: localize2('notebookActions.joinSelectedCells', "Join Selected Cells"),
				menu: {
					id: MenuId.NotebookCellTitle,
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_EDITOR_EDITABLE),
					group: CellOverflowToolbarGroups.Edit,
					order: 12
				}
			});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext) {
		const bulkEditService = accessor.get(IBulkEditService);
		const notificationService = accessor.get(INotificationService);
		return joinSelectedCells(bulkEditService, notificationService, context);
	}
});

//#endregion

//#region Change Cell Type

const CHANGE_CELL_TO_CODE_COMMAND_ID = 'notebook.cell.changeToCode';
const CHANGE_CELL_TO_MARKDOWN_COMMAND_ID = 'notebook.cell.changeToMarkdown';

registerAction2(class ChangeCellToCodeAction extends NotebookMultiCellAction {
	constructor() {
		super({
			id: CHANGE_CELL_TO_CODE_COMMAND_ID,
			title: localize2('notebookActions.changeCellToCode', "Change Cell to Code"),
			keybinding: {
				when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, ContextKeyExpr.not(InputFocusedContextKey), NOTEBOOK_OUTPUT_FOCUSED.toNegated()),
				primary: KeyCode.KeyY,
				weight: KeybindingWeight.WorkbenchContrib
			},
			precondition: ContextKeyExpr.and(NOTEBOOK_IS_ACTIVE_EDITOR, NOTEBOOK_CELL_TYPE.isEqualTo('markup')),
			menu: {
				id: MenuId.NotebookCellTitle,
				when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_EDITOR_EDITABLE, NOTEBOOK_CELL_EDITABLE, NOTEBOOK_CELL_TYPE.isEqualTo('markup')),
				group: CellOverflowToolbarGroups.Edit,
			}
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		await changeCellToKind(CellKind.Code, context);
	}
});

registerAction2(class ChangeCellToMarkdownAction extends NotebookMultiCellAction {
	constructor() {
		super({
			id: CHANGE_CELL_TO_MARKDOWN_COMMAND_ID,
			title: localize2('notebookActions.changeCellToMarkdown', "Change Cell to Markdown"),
			keybinding: {
				when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, ContextKeyExpr.not(InputFocusedContextKey), NOTEBOOK_OUTPUT_FOCUSED.toNegated()),
				primary: KeyCode.KeyM,
				weight: KeybindingWeight.WorkbenchContrib
			},
			precondition: ContextKeyExpr.and(NOTEBOOK_IS_ACTIVE_EDITOR, NOTEBOOK_CELL_TYPE.isEqualTo('code')),
			menu: {
				id: MenuId.NotebookCellTitle,
				when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_EDITOR_EDITABLE, NOTEBOOK_CELL_EDITABLE, NOTEBOOK_CELL_TYPE.isEqualTo('code')),
				group: CellOverflowToolbarGroups.Edit,
			}
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		await changeCellToKind(CellKind.Markup, context, 'markdown', Mimes.markdown);
	}
});

//#endregion

//#region Collapse Cell

const COLLAPSE_CELL_INPUT_COMMAND_ID = 'notebook.cell.collapseCellInput';
const COLLAPSE_CELL_OUTPUT_COMMAND_ID = 'notebook.cell.collapseCellOutput';
const COLLAPSE_ALL_CELL_INPUTS_COMMAND_ID = 'notebook.cell.collapseAllCellInputs';
const EXPAND_ALL_CELL_INPUTS_COMMAND_ID = 'notebook.cell.expandAllCellInputs';
const COLLAPSE_ALL_CELL_OUTPUTS_COMMAND_ID = 'notebook.cell.collapseAllCellOutputs';
const EXPAND_ALL_CELL_OUTPUTS_COMMAND_ID = 'notebook.cell.expandAllCellOutputs';
const TOGGLE_CELL_OUTPUTS_COMMAND_ID = 'notebook.cell.toggleOutputs';
const TOGGLE_CELL_OUTPUT_SCROLLING = 'notebook.cell.toggleOutputScrolling';

registerAction2(class CollapseCellInputAction extends NotebookMultiCellAction {
	constructor() {
		super({
			id: COLLAPSE_CELL_INPUT_COMMAND_ID,
			title: localize2('notebookActions.collapseCellInput', "Collapse Cell Input"),
			keybinding: {
				when: ContextKeyExpr.and(NOTEBOOK_CELL_LIST_FOCUSED, NOTEBOOK_CELL_INPUT_COLLAPSED.toNegated(), InputFocusedContext.toNegated()),
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyC),
				weight: KeybindingWeight.WorkbenchContrib
			}
		});
	}

	override parseArgs(accessor: ServicesAccessor, ...args: unknown[]): INotebookCommandContext | undefined {
		return parseMultiCellExecutionArgs(accessor, ...args);
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		if (context.ui) {
			context.cell.isInputCollapsed = true;
		} else {
			context.selectedCells.forEach(cell => cell.isInputCollapsed = true);
		}
	}
});

registerAction2(class ExpandCellInputAction extends NotebookMultiCellAction {
	constructor() {
		super({
			id: EXPAND_CELL_INPUT_COMMAND_ID,
			title: localize2('notebookActions.expandCellInput', "Expand Cell Input"),
			keybinding: {
				when: ContextKeyExpr.and(NOTEBOOK_CELL_LIST_FOCUSED, NOTEBOOK_CELL_INPUT_COLLAPSED),
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyC),
				weight: KeybindingWeight.WorkbenchContrib
			}
		});
	}

	override parseArgs(accessor: ServicesAccessor, ...args: unknown[]): INotebookCommandContext | undefined {
		return parseMultiCellExecutionArgs(accessor, ...args);
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		if (context.ui) {
			context.cell.isInputCollapsed = false;
		} else {
			context.selectedCells.forEach(cell => cell.isInputCollapsed = false);
		}
	}
});

registerAction2(class CollapseCellOutputAction extends NotebookMultiCellAction {
	constructor() {
		super({
			id: COLLAPSE_CELL_OUTPUT_COMMAND_ID,
			title: localize2('notebookActions.collapseCellOutput', "Collapse Cell Output"),
			keybinding: {
				when: ContextKeyExpr.and(NOTEBOOK_CELL_LIST_FOCUSED, NOTEBOOK_CELL_OUTPUT_COLLAPSED.toNegated(), InputFocusedContext.toNegated(), NOTEBOOK_CELL_HAS_OUTPUTS),
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyT),
				weight: KeybindingWeight.WorkbenchContrib
			}
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		if (context.ui) {
			context.cell.isOutputCollapsed = true;
		} else {
			context.selectedCells.forEach(cell => cell.isOutputCollapsed = true);
		}
	}
});

registerAction2(class ExpandCellOuputAction extends NotebookMultiCellAction {
	constructor() {
		super({
			id: EXPAND_CELL_OUTPUT_COMMAND_ID,
			title: localize2('notebookActions.expandCellOutput', "Expand Cell Output"),
			keybinding: {
				when: ContextKeyExpr.and(NOTEBOOK_CELL_LIST_FOCUSED, NOTEBOOK_CELL_OUTPUT_COLLAPSED),
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyT),
				weight: KeybindingWeight.WorkbenchContrib
			}
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		if (context.ui) {
			context.cell.isOutputCollapsed = false;
		} else {
			context.selectedCells.forEach(cell => cell.isOutputCollapsed = false);
		}
	}
});

registerAction2(class extends NotebookMultiCellAction {
	constructor() {
		super({
			id: TOGGLE_CELL_OUTPUTS_COMMAND_ID,
			precondition: NOTEBOOK_CELL_LIST_FOCUSED,
			title: localize2('notebookActions.toggleOutputs', "Toggle Outputs"),
			metadata: {
				description: localize('notebookActions.toggleOutputs', "Toggle Outputs"),
				args: cellExecutionArgs
			}
		});
	}

	override parseArgs(accessor: ServicesAccessor, ...args: unknown[]): INotebookCommandContext | undefined {
		return parseMultiCellExecutionArgs(accessor, ...args);
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		let cells: readonly ICellViewModel[] = [];
		if (context.ui) {
			cells = [context.cell];
		} else if (context.selectedCells) {
			cells = context.selectedCells;
		}

		for (const cell of cells) {
			cell.isOutputCollapsed = !cell.isOutputCollapsed;
		}
	}
});

registerAction2(class CollapseAllCellInputsAction extends NotebookMultiCellAction {
	constructor() {
		super({
			id: COLLAPSE_ALL_CELL_INPUTS_COMMAND_ID,
			title: localize2('notebookActions.collapseAllCellInput', "Collapse All Cell Inputs"),
			f1: true,
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		forEachCell(context.notebookEditor, cell => cell.isInputCollapsed = true);
	}
});

registerAction2(class ExpandAllCellInputsAction extends NotebookMultiCellAction {
	constructor() {
		super({
			id: EXPAND_ALL_CELL_INPUTS_COMMAND_ID,
			title: localize2('notebookActions.expandAllCellInput', "Expand All Cell Inputs"),
			f1: true
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		forEachCell(context.notebookEditor, cell => cell.isInputCollapsed = false);
	}
});

registerAction2(class CollapseAllCellOutputsAction extends NotebookMultiCellAction {
	constructor() {
		super({
			id: COLLAPSE_ALL_CELL_OUTPUTS_COMMAND_ID,
			title: localize2('notebookActions.collapseAllCellOutput', "Collapse All Cell Outputs"),
			f1: true,
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		forEachCell(context.notebookEditor, cell => cell.isOutputCollapsed = true);
	}
});

registerAction2(class ExpandAllCellOutputsAction extends NotebookMultiCellAction {
	constructor() {
		super({
			id: EXPAND_ALL_CELL_OUTPUTS_COMMAND_ID,
			title: localize2('notebookActions.expandAllCellOutput', "Expand All Cell Outputs"),
			f1: true
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		forEachCell(context.notebookEditor, cell => cell.isOutputCollapsed = false);
	}
});

registerAction2(class ToggleCellOutputScrolling extends NotebookMultiCellAction {
	constructor() {
		super({
			id: TOGGLE_CELL_OUTPUT_SCROLLING,
			title: localize2('notebookActions.toggleScrolling', "Toggle Scroll Cell Output"),
			keybinding: {
				when: ContextKeyExpr.and(NOTEBOOK_CELL_LIST_FOCUSED, InputFocusedContext.toNegated(), NOTEBOOK_CELL_HAS_OUTPUTS),
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyY),
				weight: KeybindingWeight.WorkbenchContrib
			}
		});
	}

	private toggleOutputScrolling(viewModel: ICellOutputViewModel, globalScrollSetting: boolean, collapsed: boolean) {
		const cellMetadata = viewModel.model.metadata;
		// TODO: when is cellMetadata undefined? Is that a case we need to support? It is currently a read-only property.
		if (cellMetadata) {
			const currentlyEnabled = cellMetadata['scrollable'] !== undefined ? cellMetadata['scrollable'] : globalScrollSetting;
			const shouldEnableScrolling = collapsed || !currentlyEnabled;
			cellMetadata['scrollable'] = shouldEnableScrolling;
			viewModel.resetRenderer();
		}
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		const globalScrolling = accessor.get(IConfigurationService).getValue<boolean>(NotebookSetting.outputScrolling);
		if (context.ui) {
			context.cell.outputsViewModels.forEach((viewModel) => {
				this.toggleOutputScrolling(viewModel, globalScrolling, context.cell.isOutputCollapsed);
			});
			context.cell.isOutputCollapsed = false;
		} else {
			context.selectedCells.forEach(cell => {
				cell.outputsViewModels.forEach((viewModel) => {
					this.toggleOutputScrolling(viewModel, globalScrolling, cell.isOutputCollapsed);
				});
				cell.isOutputCollapsed = false;
			});
		}
	}
});

//#endregion

function forEachCell(editor: INotebookEditor, callback: (cell: ICellViewModel, index: number) => void) {
	for (let i = 0; i < editor.getLength(); i++) {
		const cell = editor.cellAt(i);
		callback(cell!, i);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/cellDiagnostics/cellDiagnosticEditorContrib.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/cellDiagnostics/cellDiagnosticEditorContrib.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, IDisposable, toDisposable } from '../../../../../../base/common/lifecycle.js';
import { IMarkerData, IMarkerService } from '../../../../../../platform/markers/common/markers.js';
import { IRange } from '../../../../../../editor/common/core/range.js';
import { ICellExecutionStateChangedEvent, IExecutionStateChangedEvent, INotebookExecutionStateService, NotebookExecutionType } from '../../../common/notebookExecutionStateService.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { CellKind, NotebookSetting } from '../../../common/notebookCommon.js';
import { INotebookEditor, INotebookEditorContribution } from '../../notebookBrowser.js';
import { registerNotebookContribution } from '../../notebookEditorExtensions.js';
import { CodeCellViewModel } from '../../viewModel/codeCellViewModel.js';
import { Event } from '../../../../../../base/common/event.js';
import { IChatAgentService } from '../../../../chat/common/chatAgents.js';
import { ChatAgentLocation } from '../../../../chat/common/constants.js';
import { autorun } from '../../../../../../base/common/observable.js';

export class CellDiagnostics extends Disposable implements INotebookEditorContribution {

	static ID: string = 'workbench.notebook.cellDiagnostics';

	private enabled = false;
	private listening = false;
	private diagnosticsByHandle: Map<number, IDisposable[]> = new Map();

	constructor(
		private readonly notebookEditor: INotebookEditor,
		@INotebookExecutionStateService private readonly notebookExecutionStateService: INotebookExecutionStateService,
		@IMarkerService private readonly markerService: IMarkerService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();

		this.updateEnabled();

		this._register(chatAgentService.onDidChangeAgents(() => this.updateEnabled()));
		this._register(configurationService.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration(NotebookSetting.cellFailureDiagnostics)) {
				this.updateEnabled();
			}
		}));
	}

	private hasNotebookAgent(): boolean {
		const agents = this.chatAgentService.getAgents();
		return !!agents.find(agent => agent.locations.includes(ChatAgentLocation.Notebook));
	}

	private updateEnabled() {
		const settingEnabled = this.configurationService.getValue(NotebookSetting.cellFailureDiagnostics);
		if (this.enabled && (!settingEnabled || !this.hasNotebookAgent())) {
			this.enabled = false;
			this.clearAll();
		} else if (!this.enabled && settingEnabled && this.hasNotebookAgent()) {
			this.enabled = true;
			if (!this.listening) {
				this.listening = true;
				this._register(Event.accumulate<ICellExecutionStateChangedEvent | IExecutionStateChangedEvent>(
					this.notebookExecutionStateService.onDidChangeExecution, 200
				)((e) => this.handleChangeExecutionState(e)));
			}
		}
	}

	private handleChangeExecutionState(changes: (ICellExecutionStateChangedEvent | IExecutionStateChangedEvent)[]) {
		if (!this.enabled) {
			return;
		}

		const handled = new Set<number>();
		for (const e of changes.reverse()) {

			const notebookUri = this.notebookEditor.textModel?.uri;
			if (e.type === NotebookExecutionType.cell && notebookUri && e.affectsNotebook(notebookUri) && !handled.has(e.cellHandle)) {
				handled.add(e.cellHandle);
				if (!!e.changed) {
					// cell is running
					this.clear(e.cellHandle);
				} else {
					this.setDiagnostics(e.cellHandle);
				}
			}
		}
	}

	private clearAll() {
		for (const handle of this.diagnosticsByHandle.keys()) {
			this.clear(handle);
		}
	}

	public clear(cellHandle: number) {
		const disposables = this.diagnosticsByHandle.get(cellHandle);
		if (disposables) {
			for (const disposable of disposables) {
				disposable.dispose();
			}
			this.diagnosticsByHandle.delete(cellHandle);
		}
	}

	private setDiagnostics(cellHandle: number) {
		if (this.diagnosticsByHandle.has(cellHandle)) {
			// multiple diagnostics per cell not supported for now
			return;
		}

		const cell = this.notebookEditor.getCellByHandle(cellHandle);
		if (!cell || cell.cellKind !== CellKind.Code) {
			return;
		}

		const metadata = cell.model.internalMetadata;
		if (cell instanceof CodeCellViewModel && !metadata.lastRunSuccess && metadata?.error?.location) {
			const disposables: IDisposable[] = [];
			const errorLabel = metadata.error.name ? `${metadata.error.name}: ${metadata.error.message}` : metadata.error.message;
			const marker = this.createMarkerData(errorLabel, metadata.error.location);
			this.markerService.changeOne(CellDiagnostics.ID, cell.uri, [marker]);
			disposables.push(toDisposable(() => this.markerService.changeOne(CellDiagnostics.ID, cell.uri, [])));
			cell.executionErrorDiagnostic.set(metadata.error, undefined);
			disposables.push(toDisposable(() => cell.executionErrorDiagnostic.set(undefined, undefined)));
			disposables.push(autorun((r) => {
				if (!cell.executionErrorDiagnostic.read(r)) {
					this.clear(cellHandle);
				}
			}));
			disposables.push(cell.model.onDidChangeOutputs(() => {
				if (cell.model.outputs.length === 0) {
					this.clear(cellHandle);
				}
			}));
			disposables.push(cell.model.onDidChangeContent(() => {
				this.clear(cellHandle);
			}));
			this.diagnosticsByHandle.set(cellHandle, disposables);
		}
	}

	private createMarkerData(message: string, location: IRange): IMarkerData {
		return {
			severity: 8,
			message: message,
			startLineNumber: location.startLineNumber + 1,
			startColumn: location.startColumn + 1,
			endLineNumber: location.endLineNumber + 1,
			endColumn: location.endColumn + 1,
			source: 'Cell Execution Error'
		};
	}

	override dispose() {
		super.dispose();
		this.clearAll();
	}

}

registerNotebookContribution(CellDiagnostics.ID, CellDiagnostics);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/cellDiagnostics/cellDiagnostics.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/cellDiagnostics/cellDiagnostics.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './cellDiagnosticEditorContrib.js';
import './cellDiagnosticsActions.js';
import './diagnosticCellStatusBarContrib.js';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/cellDiagnostics/cellDiagnosticsActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/cellDiagnostics/cellDiagnosticsActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../../../base/common/keyCodes.js';
import { ServicesAccessor } from '../../../../../../editor/browser/editorExtensions.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { CodeActionController } from '../../../../../../editor/contrib/codeAction/browser/codeActionController.js';
import { CodeActionKind, CodeActionTriggerSource } from '../../../../../../editor/contrib/codeAction/common/types.js';
import { localize, localize2 } from '../../../../../../nls.js';
import { registerAction2 } from '../../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { INotebookCellActionContext, NotebookCellAction, findTargetCellEditor } from '../../controller/coreActions.js';
import { CodeCellViewModel } from '../../viewModel/codeCellViewModel.js';
import { NOTEBOOK_CELL_EDITOR_FOCUSED, NOTEBOOK_CELL_FOCUSED, NOTEBOOK_CELL_HAS_ERROR_DIAGNOSTICS } from '../../../common/notebookContextKeys.js';
import { InlineChatController } from '../../../../inlineChat/browser/inlineChatController.js';
import { IChatWidgetService } from '../../../../chat/browser/chat.js';

export const OPEN_CELL_FAILURE_ACTIONS_COMMAND_ID = 'notebook.cell.openFailureActions';
export const FIX_CELL_ERROR_COMMAND_ID = 'notebook.cell.chat.fixError';
export const EXPLAIN_CELL_ERROR_COMMAND_ID = 'notebook.cell.chat.explainError';

registerAction2(class extends NotebookCellAction {
	constructor() {
		super({
			id: OPEN_CELL_FAILURE_ACTIONS_COMMAND_ID,
			title: localize2('notebookActions.cellFailureActions', "Show Cell Failure Actions"),
			precondition: ContextKeyExpr.and(NOTEBOOK_CELL_FOCUSED, NOTEBOOK_CELL_HAS_ERROR_DIAGNOSTICS, NOTEBOOK_CELL_EDITOR_FOCUSED.toNegated()),
			f1: true,
			keybinding: {
				when: ContextKeyExpr.and(NOTEBOOK_CELL_FOCUSED, NOTEBOOK_CELL_HAS_ERROR_DIAGNOSTICS, NOTEBOOK_CELL_EDITOR_FOCUSED.toNegated()),
				primary: KeyMod.CtrlCmd | KeyCode.Period,
				weight: KeybindingWeight.WorkbenchContrib
			}
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void> {
		if (context.cell instanceof CodeCellViewModel) {
			const error = context.cell.executionErrorDiagnostic.get();
			if (error?.location) {
				const location = Range.lift({
					startLineNumber: error.location.startLineNumber + 1,
					startColumn: error.location.startColumn + 1,
					endLineNumber: error.location.endLineNumber + 1,
					endColumn: error.location.endColumn + 1
				});
				context.notebookEditor.setCellEditorSelection(context.cell, Range.lift(location));
				const editor = findTargetCellEditor(context, context.cell);
				if (editor) {
					const controller = CodeActionController.get(editor);
					controller?.manualTriggerAtCurrentPosition(
						localize('cellCommands.quickFix.noneMessage', "No code actions available"),
						CodeActionTriggerSource.Default,
						{ include: CodeActionKind.QuickFix });
				}
			}
		}
	}
});

registerAction2(class extends NotebookCellAction {
	constructor() {
		super({
			id: FIX_CELL_ERROR_COMMAND_ID,
			title: localize2('notebookActions.chatFixCellError', "Fix Cell Error"),
			precondition: ContextKeyExpr.and(NOTEBOOK_CELL_FOCUSED, NOTEBOOK_CELL_HAS_ERROR_DIAGNOSTICS, NOTEBOOK_CELL_EDITOR_FOCUSED.toNegated()),
			f1: true
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void> {
		if (context.cell instanceof CodeCellViewModel) {
			const error = context.cell.executionErrorDiagnostic.get();
			if (error?.location) {
				const location = Range.lift({
					startLineNumber: error.location.startLineNumber + 1,
					startColumn: error.location.startColumn + 1,
					endLineNumber: error.location.endLineNumber + 1,
					endColumn: error.location.endColumn + 1
				});
				context.notebookEditor.setCellEditorSelection(context.cell, Range.lift(location));
				const editor = findTargetCellEditor(context, context.cell);
				if (editor) {
					const controller = InlineChatController.get(editor);
					const message = error.name ? `${error.name}: ${error.message}` : error.message;
					if (controller) {
						await controller.run({ message: '/fix ' + message, initialRange: location, autoSend: true });
					}
				}
			}
		}
	}
});

registerAction2(class extends NotebookCellAction {
	constructor() {
		super({
			id: EXPLAIN_CELL_ERROR_COMMAND_ID,
			title: localize2('notebookActions.chatExplainCellError', "Explain Cell Error"),
			precondition: ContextKeyExpr.and(NOTEBOOK_CELL_FOCUSED, NOTEBOOK_CELL_HAS_ERROR_DIAGNOSTICS, NOTEBOOK_CELL_EDITOR_FOCUSED.toNegated()),
			f1: true
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void> {
		if (context.cell instanceof CodeCellViewModel) {
			const error = context.cell.executionErrorDiagnostic.get();
			if (error?.message) {
				const widgetService = accessor.get(IChatWidgetService);
				const chatWidget = await widgetService.revealWidget();
				const message = error.name ? `${error.name}: ${error.message}` : error.message;
				// TODO: can we add special prompt instructions? e.g. use "%pip install"
				chatWidget?.acceptInput('@workspace /explain ' + message,);
			}
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/cellDiagnostics/diagnosticCellStatusBarContrib.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/cellDiagnostics/diagnosticCellStatusBarContrib.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { autorun } from '../../../../../../base/common/observable.js';
import { localize } from '../../../../../../nls.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../../platform/keybinding/common/keybinding.js';
import { OPEN_CELL_FAILURE_ACTIONS_COMMAND_ID } from './cellDiagnosticsActions.js';
import { NotebookStatusBarController } from '../cellStatusBar/executionStatusBarItemController.js';
import { INotebookEditor, INotebookEditorContribution, INotebookViewModel } from '../../notebookBrowser.js';
import { registerNotebookContribution } from '../../notebookEditorExtensions.js';
import { CodeCellViewModel } from '../../viewModel/codeCellViewModel.js';
import { INotebookCellStatusBarItem, CellStatusbarAlignment } from '../../../common/notebookCommon.js';
import { ICellExecutionError } from '../../../common/notebookExecutionStateService.js';
import { IChatAgentService } from '../../../../chat/common/chatAgents.js';
import { ChatAgentLocation } from '../../../../chat/common/constants.js';

export class DiagnosticCellStatusBarContrib extends Disposable implements INotebookEditorContribution {
	static id: string = 'workbench.notebook.statusBar.diagtnostic';

	constructor(
		notebookEditor: INotebookEditor,
		@IInstantiationService instantiationService: IInstantiationService
	) {
		super();
		this._register(new NotebookStatusBarController(notebookEditor, (vm, cell) =>
			cell instanceof CodeCellViewModel ?
				instantiationService.createInstance(DiagnosticCellStatusBarItem, vm, cell) :
				Disposable.None
		));
	}
}
registerNotebookContribution(DiagnosticCellStatusBarContrib.id, DiagnosticCellStatusBarContrib);


class DiagnosticCellStatusBarItem extends Disposable {
	private _currentItemIds: string[] = [];

	constructor(
		private readonly _notebookViewModel: INotebookViewModel,
		private readonly cell: CodeCellViewModel,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
	) {
		super();
		this._register(autorun((reader) => this.updateSparkleItem(reader.readObservable(cell.executionErrorDiagnostic))));
	}

	private hasNotebookAgent(): boolean {
		const agents = this.chatAgentService.getAgents();
		return !!agents.find(agent => agent.locations.includes(ChatAgentLocation.Notebook));
	}

	private async updateSparkleItem(error: ICellExecutionError | undefined) {
		let item: INotebookCellStatusBarItem | undefined;

		if (error?.location && this.hasNotebookAgent()) {
			const keybinding = this.keybindingService.lookupKeybinding(OPEN_CELL_FAILURE_ACTIONS_COMMAND_ID)?.getLabel();
			const tooltip = localize('notebook.cell.status.diagnostic', "Quick Actions {0}", `(${keybinding})`);

			item = {
				text: `$(sparkle)`,
				tooltip,
				alignment: CellStatusbarAlignment.Left,
				command: OPEN_CELL_FAILURE_ACTIONS_COMMAND_ID,
				priority: Number.MAX_SAFE_INTEGER - 1
			};
		}

		const items = item ? [item] : [];
		this._currentItemIds = this._notebookViewModel.deltaCellStatusBarItems(this._currentItemIds, [{ handle: this.cell.handle, items }]);
	}

	override dispose() {
		super.dispose();
		this._notebookViewModel.deltaCellStatusBarItems(this._currentItemIds, [{ handle: this.cell.handle, items: [] }]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/cellStatusBar/contributedStatusBarItemController.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/cellStatusBar/contributedStatusBarItemController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Throttler } from '../../../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../../../base/common/cancellation.js';
import { Disposable, toDisposable } from '../../../../../../base/common/lifecycle.js';
import { NotebookVisibleCellObserver } from './notebookVisibleCellObserver.js';
import { ICellViewModel, INotebookEditor, INotebookEditorContribution, INotebookViewModel } from '../../notebookBrowser.js';
import { registerNotebookContribution } from '../../notebookEditorExtensions.js';
import { INotebookCellStatusBarService } from '../../../common/notebookCellStatusBarService.js';
import { INotebookCellStatusBarItemList } from '../../../common/notebookCommon.js';

export class ContributedStatusBarItemController extends Disposable implements INotebookEditorContribution {
	static id: string = 'workbench.notebook.statusBar.contributed';

	private readonly _visibleCells = new Map<number, CellStatusBarHelper>();

	private readonly _observer: NotebookVisibleCellObserver;

	constructor(
		private readonly _notebookEditor: INotebookEditor,
		@INotebookCellStatusBarService private readonly _notebookCellStatusBarService: INotebookCellStatusBarService
	) {
		super();
		this._observer = this._register(new NotebookVisibleCellObserver(this._notebookEditor));
		this._register(this._observer.onDidChangeVisibleCells(this._updateVisibleCells, this));

		this._updateEverything();
		this._register(this._notebookCellStatusBarService.onDidChangeProviders(this._updateEverything, this));
		this._register(this._notebookCellStatusBarService.onDidChangeItems(this._updateEverything, this));
	}

	private _updateEverything(): void {
		const newCells = this._observer.visibleCells.filter(cell => !this._visibleCells.has(cell.handle));
		const visibleCellHandles = new Set(this._observer.visibleCells.map(item => item.handle));
		const currentCellHandles = Array.from(this._visibleCells.keys());
		const removedCells = currentCellHandles.filter(handle => !visibleCellHandles.has(handle));
		const itemsToUpdate = currentCellHandles.filter(handle => visibleCellHandles.has(handle));

		this._updateVisibleCells({ added: newCells, removed: removedCells.map(handle => ({ handle })) });
		itemsToUpdate.forEach(handle => this._visibleCells.get(handle)?.update());
	}

	private _updateVisibleCells(e: {
		added: ICellViewModel[];
		removed: { handle: number }[];
	}): void {
		const vm = this._notebookEditor.getViewModel();
		if (!vm) {
			return;
		}

		for (const newCell of e.added) {
			const helper = new CellStatusBarHelper(vm, newCell, this._notebookCellStatusBarService);
			this._visibleCells.set(newCell.handle, helper);
		}

		for (const oldCell of e.removed) {
			this._visibleCells.get(oldCell.handle)?.dispose();
			this._visibleCells.delete(oldCell.handle);
		}
	}

	override dispose(): void {
		super.dispose();

		this._visibleCells.forEach(cell => cell.dispose());
		this._visibleCells.clear();
	}
}

class CellStatusBarHelper extends Disposable {
	private _currentItemIds: string[] = [];
	private _currentItemLists: INotebookCellStatusBarItemList[] = [];

	private _activeToken: CancellationTokenSource | undefined;
	private _isDisposed = false;

	private readonly _updateThrottler = this._register(new Throttler());

	constructor(
		private readonly _notebookViewModel: INotebookViewModel,
		private readonly _cell: ICellViewModel,
		private readonly _notebookCellStatusBarService: INotebookCellStatusBarService
	) {
		super();

		this._register(toDisposable(() => this._activeToken?.dispose(true)));
		this._updateSoon();
		this._register(this._cell.model.onDidChangeContent(() => this._updateSoon()));
		this._register(this._cell.model.onDidChangeLanguage(() => this._updateSoon()));
		this._register(this._cell.model.onDidChangeMetadata(() => this._updateSoon()));
		this._register(this._cell.model.onDidChangeInternalMetadata(() => this._updateSoon()));
		this._register(this._cell.model.onDidChangeOutputs(() => this._updateSoon()));
	}

	public update(): void {
		this._updateSoon();
	}
	private _updateSoon(): void {
		// Wait a tick to make sure that the event is fired to the EH before triggering status bar providers
		setTimeout(() => {
			if (!this._isDisposed) {
				this._updateThrottler.queue(() => this._update());
			}
		}, 0);
	}

	private async _update() {
		const cellIndex = this._notebookViewModel.getCellIndex(this._cell);
		const docUri = this._notebookViewModel.notebookDocument.uri;
		const viewType = this._notebookViewModel.notebookDocument.viewType;

		this._activeToken?.dispose(true);
		const tokenSource = this._activeToken = new CancellationTokenSource();
		const itemLists = await this._notebookCellStatusBarService.getStatusBarItemsForCell(docUri, cellIndex, viewType, tokenSource.token);
		if (tokenSource.token.isCancellationRequested) {
			itemLists.forEach(itemList => itemList.dispose && itemList.dispose());
			return;
		}

		const items = itemLists.map(itemList => itemList.items).flat();
		const newIds = this._notebookViewModel.deltaCellStatusBarItems(this._currentItemIds, [{ handle: this._cell.handle, items }]);

		this._currentItemLists.forEach(itemList => itemList.dispose && itemList.dispose());
		this._currentItemLists = itemLists;
		this._currentItemIds = newIds;
	}

	override dispose() {
		super.dispose();
		this._isDisposed = true;
		this._activeToken?.dispose(true);

		this._notebookViewModel.deltaCellStatusBarItems(this._currentItemIds, [{ handle: this._cell.handle, items: [] }]);
		this._currentItemLists.forEach(itemList => itemList.dispose && itemList.dispose());
	}
}

registerNotebookContribution(ContributedStatusBarItemController.id, ContributedStatusBarItemController);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/cellStatusBar/executionStatusBarItemController.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/cellStatusBar/executionStatusBarItemController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { disposableTimeout, RunOnceScheduler } from '../../../../../../base/common/async.js';
import { Disposable, dispose, IDisposable, MutableDisposable } from '../../../../../../base/common/lifecycle.js';
import { language } from '../../../../../../base/common/platform.js';
import { localize } from '../../../../../../nls.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { themeColorFromId } from '../../../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { ICellVisibilityChangeEvent, NotebookVisibleCellObserver } from './notebookVisibleCellObserver.js';
import { ICellViewModel, INotebookEditor, INotebookEditorContribution, INotebookViewModel } from '../../notebookBrowser.js';
import { registerNotebookContribution } from '../../notebookEditorExtensions.js';
import { cellStatusIconError, cellStatusIconSuccess } from '../../notebookEditorWidget.js';
import { errorStateIcon, executingStateIcon, pendingStateIcon, successStateIcon } from '../../notebookIcons.js';
import { CellStatusbarAlignment, INotebookCellStatusBarItem, NotebookCellExecutionState, NotebookCellInternalMetadata, NotebookSetting } from '../../../common/notebookCommon.js';
import { INotebookCellExecution, INotebookExecutionStateService, NotebookExecutionType } from '../../../common/notebookExecutionStateService.js';
import { INotebookService } from '../../../common/notebookService.js';
import { IMarkdownString } from '../../../../../../base/common/htmlContent.js';

export function formatCellDuration(duration: number, showMilliseconds: boolean = true): string {
	if (showMilliseconds && duration < 1000) {
		return `${duration}ms`;
	}

	const minutes = Math.floor(duration / 1000 / 60);
	const seconds = Math.floor(duration / 1000) % 60;
	const tenths = Math.floor((duration % 1000) / 100);

	if (minutes > 0) {
		return `${minutes}m ${seconds}.${tenths}s`;
	} else {
		return `${seconds}.${tenths}s`;
	}
}

export class NotebookStatusBarController extends Disposable {
	private readonly _visibleCells = new Map<number, IDisposable>();
	private readonly _observer: NotebookVisibleCellObserver;

	constructor(
		private readonly _notebookEditor: INotebookEditor,
		private readonly _itemFactory: (vm: INotebookViewModel, cell: ICellViewModel) => IDisposable,
	) {
		super();
		this._observer = this._register(new NotebookVisibleCellObserver(this._notebookEditor));
		this._register(this._observer.onDidChangeVisibleCells(this._updateVisibleCells, this));

		this._updateEverything();
	}

	private _updateEverything(): void {
		this._visibleCells.forEach(dispose);
		this._visibleCells.clear();
		this._updateVisibleCells({ added: this._observer.visibleCells, removed: [] });
	}

	private _updateVisibleCells(e: ICellVisibilityChangeEvent): void {
		const vm = this._notebookEditor.getViewModel();
		if (!vm) {
			return;
		}

		for (const oldCell of e.removed) {
			this._visibleCells.get(oldCell.handle)?.dispose();
			this._visibleCells.delete(oldCell.handle);
		}

		for (const newCell of e.added) {
			this._visibleCells.set(newCell.handle, this._itemFactory(vm, newCell));
		}
	}

	override dispose(): void {
		super.dispose();

		this._visibleCells.forEach(dispose);
		this._visibleCells.clear();
	}
}

export class ExecutionStateCellStatusBarContrib extends Disposable implements INotebookEditorContribution {
	static id: string = 'workbench.notebook.statusBar.execState';

	constructor(notebookEditor: INotebookEditor,
		@IInstantiationService instantiationService: IInstantiationService
	) {
		super();
		this._register(new NotebookStatusBarController(notebookEditor, (vm, cell) => instantiationService.createInstance(ExecutionStateCellStatusBarItem, vm, cell)));
	}
}
registerNotebookContribution(ExecutionStateCellStatusBarContrib.id, ExecutionStateCellStatusBarContrib);

/**
 * Shows the cell's execution state in the cell status bar. When the "executing" state is shown, it will be shown for a minimum brief time.
 */
class ExecutionStateCellStatusBarItem extends Disposable {
	private static readonly MIN_SPINNER_TIME = 500;

	private _currentItemIds: string[] = [];

	private _showedExecutingStateTime: number | undefined;
	private readonly _clearExecutingStateTimer = this._register(new MutableDisposable());

	constructor(
		private readonly _notebookViewModel: INotebookViewModel,
		private readonly _cell: ICellViewModel,
		@INotebookExecutionStateService private readonly _executionStateService: INotebookExecutionStateService
	) {
		super();

		this._update();
		this._register(this._executionStateService.onDidChangeExecution(e => {
			if (e.type === NotebookExecutionType.cell && e.affectsCell(this._cell.uri)) {
				this._update();
			}
		}));
		this._register(this._cell.model.onDidChangeInternalMetadata(() => this._update()));
	}

	private async _update() {
		const items = this._getItemsForCell();
		if (Array.isArray(items)) {
			this._currentItemIds = this._notebookViewModel.deltaCellStatusBarItems(this._currentItemIds, [{ handle: this._cell.handle, items }]);
		}
	}

	/**
	 *	Returns undefined if there should be no change, and an empty array if all items should be removed.
	 */
	private _getItemsForCell(): INotebookCellStatusBarItem[] | undefined {
		const runState = this._executionStateService.getCellExecution(this._cell.uri);

		// Show the execution spinner for a minimum time
		if (runState?.state === NotebookCellExecutionState.Executing && typeof this._showedExecutingStateTime !== 'number') {
			this._showedExecutingStateTime = Date.now();
		} else if (runState?.state !== NotebookCellExecutionState.Executing && typeof this._showedExecutingStateTime === 'number') {
			const timeUntilMin = ExecutionStateCellStatusBarItem.MIN_SPINNER_TIME - (Date.now() - this._showedExecutingStateTime);
			if (timeUntilMin > 0) {
				if (!this._clearExecutingStateTimer.value) {
					this._clearExecutingStateTimer.value = disposableTimeout(() => {
						this._showedExecutingStateTime = undefined;
						this._clearExecutingStateTimer.clear();
						this._update();
					}, timeUntilMin);
				}

				return undefined;
			} else {
				this._showedExecutingStateTime = undefined;
			}
		}

		const items = this._getItemForState(runState, this._cell.internalMetadata);
		return items;
	}

	private _getItemForState(runState: INotebookCellExecution | undefined, internalMetadata: NotebookCellInternalMetadata): INotebookCellStatusBarItem[] {
		const state = runState?.state;
		const { lastRunSuccess } = internalMetadata;
		if (!state && lastRunSuccess) {
			return [{
				text: `$(${successStateIcon.id})`,
				color: themeColorFromId(cellStatusIconSuccess),
				tooltip: localize('notebook.cell.status.success', "Success"),
				alignment: CellStatusbarAlignment.Left,
				priority: Number.MAX_SAFE_INTEGER
			} satisfies INotebookCellStatusBarItem];
		} else if (!state && lastRunSuccess === false) {
			return [{
				text: `$(${errorStateIcon.id})`,
				color: themeColorFromId(cellStatusIconError),
				tooltip: localize('notebook.cell.status.failed', "Failed"),
				alignment: CellStatusbarAlignment.Left,
				priority: Number.MAX_SAFE_INTEGER
			}];
		} else if (state === NotebookCellExecutionState.Pending || state === NotebookCellExecutionState.Unconfirmed) {
			return [{
				text: `$(${pendingStateIcon.id})`,
				tooltip: localize('notebook.cell.status.pending', "Pending"),
				alignment: CellStatusbarAlignment.Left,
				priority: Number.MAX_SAFE_INTEGER
			} satisfies INotebookCellStatusBarItem];
		} else if (state === NotebookCellExecutionState.Executing) {
			const icon = runState?.didPause ?
				executingStateIcon :
				ThemeIcon.modify(executingStateIcon, 'spin');
			return [{
				text: `$(${icon.id})`,
				tooltip: localize('notebook.cell.status.executing', "Executing"),
				alignment: CellStatusbarAlignment.Left,
				priority: Number.MAX_SAFE_INTEGER
			} satisfies INotebookCellStatusBarItem];
		}

		return [];
	}

	override dispose() {
		super.dispose();

		this._notebookViewModel.deltaCellStatusBarItems(this._currentItemIds, [{ handle: this._cell.handle, items: [] }]);
	}
}

export class TimerCellStatusBarContrib extends Disposable implements INotebookEditorContribution {
	static id: string = 'workbench.notebook.statusBar.execTimer';

	constructor(
		notebookEditor: INotebookEditor,
		@IInstantiationService instantiationService: IInstantiationService) {
		super();
		this._register(new NotebookStatusBarController(notebookEditor, (vm, cell) => instantiationService.createInstance(TimerCellStatusBarItem, vm, cell)));
	}
}
registerNotebookContribution(TimerCellStatusBarContrib.id, TimerCellStatusBarContrib);

const UPDATE_TIMER_GRACE_PERIOD = 200;

class TimerCellStatusBarItem extends Disposable {
	private static UPDATE_INTERVAL = 100;
	private _currentItemIds: string[] = [];

	private _scheduler: RunOnceScheduler;

	private _deferredUpdate: IDisposable | undefined;

	private _isVerbose: boolean;

	constructor(
		private readonly _notebookViewModel: INotebookViewModel,
		private readonly _cell: ICellViewModel,
		@INotebookExecutionStateService private readonly _executionStateService: INotebookExecutionStateService,
		@INotebookService private readonly _notebookService: INotebookService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		super();
		this._isVerbose = this._configurationService.getValue(NotebookSetting.cellExecutionTimeVerbosity) === 'verbose';

		this._scheduler = this._register(new RunOnceScheduler(() => this._update(), TimerCellStatusBarItem.UPDATE_INTERVAL));
		this._update();
		this._register(this._cell.model.onDidChangeInternalMetadata(() => this._update()));

		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(NotebookSetting.cellExecutionTimeVerbosity)) {
				this._isVerbose = this._configurationService.getValue(NotebookSetting.cellExecutionTimeVerbosity) === 'verbose';
				this._update();
			}
		}));
	}

	private async _update() {
		let timerItem: INotebookCellStatusBarItem | undefined;
		const runState = this._executionStateService.getCellExecution(this._cell.uri);
		const state = runState?.state;
		const startTime = this._cell.internalMetadata.runStartTime;
		const adjustment = this._cell.internalMetadata.runStartTimeAdjustment ?? 0;
		const endTime = this._cell.internalMetadata.runEndTime;

		if (runState?.didPause) {
			timerItem = undefined;
		} else if (state === NotebookCellExecutionState.Executing) {
			if (typeof startTime === 'number') {
				timerItem = this._getTimeItem(startTime, Date.now(), adjustment);
				this._scheduler.schedule();
			}
		} else if (!state) {
			if (typeof startTime === 'number' && typeof endTime === 'number') {
				const timerDuration = Date.now() - startTime + adjustment;
				const executionDuration = endTime - startTime;
				const renderDuration = this._cell.internalMetadata.renderDuration ?? {};

				timerItem = this._getTimeItem(startTime, endTime, undefined, {
					timerDuration,
					executionDuration,
					renderDuration
				});
			}
		}

		const items = timerItem ? [timerItem] : [];

		if (!items.length && !!runState) {
			if (!this._deferredUpdate) {
				this._deferredUpdate = disposableTimeout(() => {
					this._deferredUpdate = undefined;
					this._currentItemIds = this._notebookViewModel.deltaCellStatusBarItems(this._currentItemIds, [{ handle: this._cell.handle, items }]);
				}, UPDATE_TIMER_GRACE_PERIOD, this._store);
			}
		} else {
			this._deferredUpdate?.dispose();
			this._deferredUpdate = undefined;
			this._currentItemIds = this._notebookViewModel.deltaCellStatusBarItems(this._currentItemIds, [{ handle: this._cell.handle, items }]);
		}
	}

	private _getTimeItem(startTime: number, endTime: number, adjustment: number = 0, runtimeInformation?: { renderDuration: { [key: string]: number }; executionDuration: number; timerDuration: number }): INotebookCellStatusBarItem {
		const duration = endTime - startTime + adjustment;

		let tooltip: IMarkdownString | undefined;

		const lastExecution = new Date(endTime).toLocaleTimeString(language);

		if (runtimeInformation) {
			const { renderDuration, executionDuration, timerDuration } = runtimeInformation;

			let renderTimes = '';
			for (const key in renderDuration) {
				const rendererInfo = this._notebookService.getRendererInfo(key);

				const args = encodeURIComponent(JSON.stringify({
					extensionId: rendererInfo?.extensionId.value ?? '',
					issueBody:
						`Auto-generated text from notebook cell performance - Please add an explanation for the performance issue, including cell content if possible.\n` +
						`The duration for the renderer, ${rendererInfo?.displayName ?? key}, is slower than expected.\n` +
						`Execution Time: ${formatCellDuration(executionDuration)}\n` +
						`Renderer Duration: ${formatCellDuration(renderDuration[key])}\n`
				}));

				// Show a link to create an issue if the renderer was slow compared to the execution duration, or just exceptionally slow on its own
				const renderIssueLink = (renderDuration[key] > 200 && executionDuration < 2000) || renderDuration[key] > 1000;
				const linkText = rendererInfo?.displayName ?? key;
				const rendererTitle = renderIssueLink ? `[${linkText}](command:workbench.action.openIssueReporter?${args})` : `**${linkText}**`;
				renderTimes += `- ${rendererTitle} ${formatCellDuration(renderDuration[key])}\n`;
			}

			renderTimes += `\n*${localize('notebook.cell.statusBar.timerTooltip.reportIssueFootnote', "Use the links above to file an issue using the issue reporter.")}*\n`;

			tooltip = {
				value: localize('notebook.cell.statusBar.timerTooltip', "**Last Execution** {0}\n\n**Execution Time** {1}\n\n**Overhead Time** {2}\n\n**Render Times**\n\n{3}", lastExecution, formatCellDuration(executionDuration), formatCellDuration(timerDuration - executionDuration), renderTimes),
				isTrusted: true
			};

		}

		const executionText = this._isVerbose ?
			localize('notebook.cell.statusBar.timerVerbose', "Last Execution: {0}, Duration: {1}", lastExecution, formatCellDuration(duration, false)) :
			formatCellDuration(duration, false);

		return {
			text: executionText,
			alignment: CellStatusbarAlignment.Left,
			priority: Number.MAX_SAFE_INTEGER - 5,
			tooltip
		} satisfies INotebookCellStatusBarItem;
	}

	override dispose() {
		super.dispose();

		this._deferredUpdate?.dispose();
		this._notebookViewModel.deltaCellStatusBarItems(this._currentItemIds, [{ handle: this._cell.handle, items: [] }]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/cellStatusBar/notebookVisibleCellObserver.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/cellStatusBar/notebookVisibleCellObserver.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { diffSets } from '../../../../../../base/common/collections.js';
import { Emitter } from '../../../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { isDefined } from '../../../../../../base/common/types.js';
import { ICellViewModel, INotebookEditor } from '../../notebookBrowser.js';
import { cellRangesToIndexes } from '../../../common/notebookRange.js';

export interface ICellVisibilityChangeEvent {
	added: ICellViewModel[];
	removed: ICellViewModel[];
}

export class NotebookVisibleCellObserver extends Disposable {
	private readonly _onDidChangeVisibleCells = this._register(new Emitter<ICellVisibilityChangeEvent>());
	readonly onDidChangeVisibleCells = this._onDidChangeVisibleCells.event;

	private readonly _viewModelDisposables = this._register(new DisposableStore());

	private _visibleCells: ICellViewModel[] = [];

	get visibleCells(): ICellViewModel[] {
		return this._visibleCells;
	}

	constructor(private readonly _notebookEditor: INotebookEditor) {
		super();

		this._register(this._notebookEditor.onDidChangeVisibleRanges(this._updateVisibleCells, this));
		this._register(this._notebookEditor.onDidChangeModel(this._onModelChange, this));
		this._updateVisibleCells();
	}

	private _onModelChange() {
		this._viewModelDisposables.clear();
		if (this._notebookEditor.hasModel()) {
			this._viewModelDisposables.add(this._notebookEditor.onDidChangeViewCells(() => this.updateEverything()));
		}

		this.updateEverything();
	}

	protected updateEverything(): void {
		this._onDidChangeVisibleCells.fire({ added: [], removed: Array.from(this._visibleCells) });
		this._visibleCells = [];
		this._updateVisibleCells();
	}

	private _updateVisibleCells(): void {
		if (!this._notebookEditor.hasModel()) {
			return;
		}

		const newVisibleCells = cellRangesToIndexes(this._notebookEditor.visibleRanges)
			.map(index => this._notebookEditor.cellAt(index))
			.filter(isDefined);
		const newVisibleHandles = new Set(newVisibleCells.map(cell => cell.handle));
		const oldVisibleHandles = new Set(this._visibleCells.map(cell => cell.handle));
		const diff = diffSets(oldVisibleHandles, newVisibleHandles);

		const added = diff.added
			.map(handle => this._notebookEditor.getCellByHandle(handle))
			.filter(isDefined);
		const removed = diff.removed
			.map(handle => this._notebookEditor.getCellByHandle(handle))
			.filter(isDefined);

		this._visibleCells = newVisibleCells;
		this._onDidChangeVisibleCells.fire({
			added,
			removed
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/cellStatusBar/statusBarProviders.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/cellStatusBar/statusBarProviders.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../../base/common/map.js';
import { URI } from '../../../../../../base/common/uri.js';
import { ILanguageService } from '../../../../../../editor/common/languages/language.js';
import { localize } from '../../../../../../nls.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../../platform/keybinding/common/keybinding.js';
import { Registry } from '../../../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry } from '../../../../../common/contributions.js';
import { CHANGE_CELL_LANGUAGE, DETECT_CELL_LANGUAGE } from '../../notebookBrowser.js';
import { INotebookCellStatusBarService } from '../../../common/notebookCellStatusBarService.js';
import { CellKind, CellStatusbarAlignment, INotebookCellStatusBarItem, INotebookCellStatusBarItemList, INotebookCellStatusBarItemProvider } from '../../../common/notebookCommon.js';
import { INotebookKernelService } from '../../../common/notebookKernelService.js';
import { INotebookService } from '../../../common/notebookService.js';
import { ILanguageDetectionService, LanguageDetectionHintConfig } from '../../../../../services/languageDetection/common/languageDetectionWorkerService.js';
import { LifecyclePhase } from '../../../../../services/lifecycle/common/lifecycle.js';

class CellStatusBarLanguagePickerProvider implements INotebookCellStatusBarItemProvider {

	readonly viewType = '*';

	constructor(
		@INotebookService private readonly _notebookService: INotebookService,
		@ILanguageService private readonly _languageService: ILanguageService,
	) { }

	async provideCellStatusBarItems(uri: URI, index: number, _token: CancellationToken): Promise<INotebookCellStatusBarItemList | undefined> {
		const doc = this._notebookService.getNotebookTextModel(uri);
		const cell = doc?.cells[index];
		if (!cell) {
			return;
		}

		const statusBarItems: INotebookCellStatusBarItem[] = [];
		let displayLanguage = cell.language;
		if (cell.cellKind === CellKind.Markup) {
			displayLanguage = 'markdown';
		} else {
			const registeredId = this._languageService.getLanguageIdByLanguageName(cell.language);
			if (registeredId) {
				displayLanguage = this._languageService.getLanguageName(displayLanguage) ?? displayLanguage;
			} else {
				// add unregistered lanugage warning item
				const searchTooltip = localize('notebook.cell.status.searchLanguageExtensions', "Unknown cell language. Click to search for '{0}' extensions", cell.language);
				statusBarItems.push({
					text: `$(dialog-warning)`,
					command: { id: 'workbench.extensions.search', arguments: [`@tag:${cell.language}`], title: 'Search Extensions' },
					tooltip: searchTooltip,
					alignment: CellStatusbarAlignment.Right,
					priority: -Number.MAX_SAFE_INTEGER + 1
				});
			}
		}

		statusBarItems.push({
			text: displayLanguage,
			command: CHANGE_CELL_LANGUAGE,
			tooltip: localize('notebook.cell.status.language', "Select Cell Language Mode"),
			alignment: CellStatusbarAlignment.Right,
			priority: -Number.MAX_SAFE_INTEGER
		});
		return {
			items: statusBarItems
		};
	}
}

class CellStatusBarLanguageDetectionProvider implements INotebookCellStatusBarItemProvider {

	readonly viewType = '*';

	private cache = new ResourceMap<{
		contentVersion: number;
		updateTimestamp: number;
		cellLanguage: string;

		guess?: string;
	}>();

	constructor(
		@INotebookService private readonly _notebookService: INotebookService,
		@INotebookKernelService private readonly _notebookKernelService: INotebookKernelService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ILanguageDetectionService private readonly _languageDetectionService: ILanguageDetectionService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
	) { }

	async provideCellStatusBarItems(uri: URI, index: number, token: CancellationToken): Promise<INotebookCellStatusBarItemList | undefined> {
		const doc = this._notebookService.getNotebookTextModel(uri);
		const cell = doc?.cells[index];
		if (!cell) { return; }

		const enablementConfig = this._configurationService.getValue<LanguageDetectionHintConfig>('workbench.editor.languageDetectionHints');
		const enabled = typeof enablementConfig === 'object' && enablementConfig?.notebookEditors;
		if (!enabled) {
			return;
		}
		const cellUri = cell.uri;
		const contentVersion = cell.textModel?.getVersionId();
		if (!contentVersion) {
			return;
		}

		const currentLanguageId = cell.cellKind === CellKind.Markup ?
			'markdown' :
			(this._languageService.getLanguageIdByLanguageName(cell.language) || cell.language);

		if (!this.cache.has(cellUri)) {
			this.cache.set(cellUri, {
				cellLanguage: currentLanguageId, // force a re-compute upon a change in configured language
				updateTimestamp: 0, // facilitates a disposable-free debounce operation
				contentVersion: 1, // dont run for the initial contents, only on update
			});
		}

		const cached = this.cache.get(cellUri)!;
		if (cached.cellLanguage !== currentLanguageId || (cached.updateTimestamp < Date.now() - 1000 && cached.contentVersion !== contentVersion)) {
			cached.updateTimestamp = Date.now();
			cached.cellLanguage = currentLanguageId;
			cached.contentVersion = contentVersion;

			const kernel = this._notebookKernelService.getSelectedOrSuggestedKernel(doc);
			if (kernel) {
				const supportedLangs = [...kernel.supportedLanguages, 'markdown'];
				cached.guess = await this._languageDetectionService.detectLanguage(cell.uri, supportedLangs);
			}
		}

		const items: INotebookCellStatusBarItem[] = [];
		if (cached.guess && currentLanguageId !== cached.guess) {
			const detectedName = this._languageService.getLanguageName(cached.guess) || cached.guess;
			let tooltip = localize('notebook.cell.status.autoDetectLanguage', "Accept Detected Language: {0}", detectedName);
			const keybinding = this._keybindingService.lookupKeybinding(DETECT_CELL_LANGUAGE);
			const label = keybinding?.getLabel();
			if (label) {
				tooltip += ` (${label})`;
			}
			items.push({
				text: '$(lightbulb-autofix)',
				command: DETECT_CELL_LANGUAGE,
				tooltip,
				alignment: CellStatusbarAlignment.Right,
				priority: -Number.MAX_SAFE_INTEGER + 1
			});
		}

		return { items };
	}
}

class BuiltinCellStatusBarProviders extends Disposable {
	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@INotebookCellStatusBarService notebookCellStatusBarService: INotebookCellStatusBarService) {
		super();

		const builtinProviders = [
			CellStatusBarLanguagePickerProvider,
			CellStatusBarLanguageDetectionProvider,
		];
		builtinProviders.forEach(p => {
			this._register(notebookCellStatusBarService.registerCellStatusBarItemProvider(instantiationService.createInstance(p)));
		});
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(BuiltinCellStatusBarProviders, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/chat/notebookChatUtils.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/chat/notebookChatUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { normalizeDriveLetter } from '../../../../../../base/common/labels.js';
import { basenameOrAuthority } from '../../../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { localize } from '../../../../../../nls.js';
import { INotebookOutputVariableEntry } from '../../../../chat/common/chatVariableEntries.js';
import { CellUri } from '../../../common/notebookCommon.js';
import { ICellOutputViewModel, INotebookEditor } from '../../notebookBrowser.js';

export const NOTEBOOK_CELL_OUTPUT_MIME_TYPE_LIST_FOR_CHAT_CONST = [
	'text/plain',
	'text/html',
	'application/vnd.code.notebook.error',
	'application/vnd.code.notebook.stdout',
	'application/x.notebook.stdout',
	'application/x.notebook.stream',
	'application/vnd.code.notebook.stderr',
	'application/x.notebook.stderr',
	'image/png',
	'image/jpeg',
	'image/svg',
];

export function createNotebookOutputVariableEntry(outputViewModel: ICellOutputViewModel, mimeType: string, notebookEditor: INotebookEditor): INotebookOutputVariableEntry | undefined {

	// get the cell index
	const cellFromViewModelHandle = outputViewModel.cellViewModel.handle;
	const notebookModel = notebookEditor.textModel;
	const cell = notebookEditor.getCellByHandle(cellFromViewModelHandle);
	if (!cell || cell.outputsViewModels.length === 0 || !notebookModel) {
		return;
	}
	// uri of the cell
	const notebookUri = notebookModel.uri;
	const cellUri = cell.uri;
	const cellIndex = notebookModel.cells.indexOf(cell.model);

	// get the output index
	const outputId = outputViewModel?.model.outputId;
	let outputIndex: number = 0;
	if (outputId !== undefined) {
		// find the output index
		outputIndex = cell.outputsViewModels.findIndex(output => {
			return output.model.outputId === outputId;
		});
	}

	// construct the URI using the cell uri and output index
	const outputCellUri = CellUri.generateCellOutputUriWithIndex(notebookUri, cellUri, outputIndex);
	const fileName = normalizeDriveLetter(basenameOrAuthority(notebookUri));

	const l: INotebookOutputVariableEntry = {
		value: outputCellUri,
		id: outputCellUri.toString(),
		name: localize('notebookOutputCellLabel', "{0} • Cell {1} • Output {2}", fileName, `${cellIndex + 1}`, `${outputIndex + 1}`),
		icon: mimeType === 'application/vnd.code.notebook.error' ? ThemeIcon.fromId('error') : undefined,
		kind: 'notebookOutput',
		outputIndex,
		mimeType
	};

	return l;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/clipboard/notebookClipboard.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/clipboard/notebookClipboard.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../../../nls.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../../../common/contributions.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { NOTEBOOK_CELL_EDITABLE, NOTEBOOK_EDITOR_EDITABLE, NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_OUTPUT_FOCUSED } from '../../../common/notebookContextKeys.js';
import { cellRangeToViewCells, expandCellRangesWithHiddenCells, getNotebookEditorFromEditorPane, ICellViewModel, INotebookEditor } from '../../notebookBrowser.js';
import { CopyAction, CutAction, PasteAction } from '../../../../../../editor/contrib/clipboard/browser/clipboard.js';
import { IClipboardService } from '../../../../../../platform/clipboard/common/clipboardService.js';
import { cloneNotebookCellTextModel, NotebookCellTextModel } from '../../../common/model/notebookCellTextModel.js';
import { CellEditType, ICellEditOperation, ISelectionState, SelectionStateType } from '../../../common/notebookCommon.js';
import { INotebookService } from '../../../common/notebookService.js';
import * as platform from '../../../../../../base/common/platform.js';
import { Action2, MenuId, registerAction2 } from '../../../../../../platform/actions/common/actions.js';
import { CellOverflowToolbarGroups, INotebookActionContext, INotebookCellActionContext, NotebookAction, NotebookCellAction, NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT, NOTEBOOK_OUTPUT_WEBVIEW_ACTION_WEIGHT } from '../../controller/coreActions.js';
import { KeyCode, KeyMod } from '../../../../../../base/common/keyCodes.js';
import { ContextKeyExpr } from '../../../../../../platform/contextkey/common/contextkey.js';
import { InputFocusedContextKey } from '../../../../../../platform/contextkey/common/contextkeys.js';
import { KeybindingWeight } from '../../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { RedoCommand, UndoCommand } from '../../../../../../editor/browser/editorExtensions.js';
import { IWebview } from '../../../../webview/browser/webview.js';
import { Categories } from '../../../../../../platform/action/common/actionCommonCategories.js';
import { ILogService } from '../../../../../../platform/log/common/log.js';
import { ICommandService } from '../../../../../../platform/commands/common/commands.js';
import { showWindowLogActionId } from '../../../../../services/log/common/logConstants.js';
import { getActiveElement, getWindow, isEditableElement, isHTMLElement } from '../../../../../../base/browser/dom.js';

let _logging: boolean = false;
function toggleLogging() {
	_logging = !_logging;
}

function _log(loggerService: ILogService, str: string) {
	if (_logging) {
		loggerService.info(`[NotebookClipboard]: ${str}`);
	}
}

function getFocusedEditor(accessor: ServicesAccessor) {
	const loggerService = accessor.get(ILogService);
	const editorService = accessor.get(IEditorService);
	const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);
	if (!editor) {
		_log(loggerService, '[Revive Webview] No notebook editor found for active editor pane, bypass');
		return;
	}

	if (!editor.hasEditorFocus()) {
		_log(loggerService, '[Revive Webview] Notebook editor is not focused, bypass');
		return;
	}

	if (!editor.hasWebviewFocus()) {
		_log(loggerService, '[Revive Webview] Notebook editor backlayer webview is not focused, bypass');
		return;
	}
	// If none of the outputs have focus, then webview is not focused
	const view = editor.getViewModel();
	if (view && view.viewCells.every(cell => !cell.outputIsFocused && !cell.outputIsHovered)) {
		return;
	}

	return { editor, loggerService };
}
function getFocusedWebviewDelegate(accessor: ServicesAccessor): IWebview | undefined {
	const result = getFocusedEditor(accessor);
	if (!result) {
		return;
	}
	const webview = result.editor.getInnerWebview();
	_log(result.loggerService, '[Revive Webview] Notebook editor backlayer webview is focused');
	return webview;
}

function withWebview(accessor: ServicesAccessor, f: (webviewe: IWebview) => void) {
	const webview = getFocusedWebviewDelegate(accessor);
	if (webview) {
		f(webview);
		return true;
	}
	return false;
}

function withEditor(accessor: ServicesAccessor, f: (editor: INotebookEditor) => boolean) {
	const result = getFocusedEditor(accessor);
	return result ? f(result.editor) : false;
}

const PRIORITY = 105;

UndoCommand.addImplementation(PRIORITY, 'notebook-webview', accessor => {
	return withWebview(accessor, webview => webview.undo());
});

RedoCommand.addImplementation(PRIORITY, 'notebook-webview', accessor => {
	return withWebview(accessor, webview => webview.redo());
});

CopyAction?.addImplementation(PRIORITY, 'notebook-webview', accessor => {
	return withWebview(accessor, webview => webview.copy());
});

PasteAction?.addImplementation(PRIORITY, 'notebook-webview', accessor => {
	return withWebview(accessor, webview => webview.paste());
});

CutAction?.addImplementation(PRIORITY, 'notebook-webview', accessor => {
	return withWebview(accessor, webview => webview.cut());
});

export function runPasteCells(editor: INotebookEditor, activeCell: ICellViewModel | undefined, pasteCells: {
	items: NotebookCellTextModel[];
	isCopy: boolean;
}): boolean {
	if (!editor.hasModel()) {
		return false;
	}
	const textModel = editor.textModel;

	if (editor.isReadOnly) {
		return false;
	}

	const originalState: ISelectionState = {
		kind: SelectionStateType.Index,
		focus: editor.getFocus(),
		selections: editor.getSelections()
	};

	if (activeCell) {
		const currCellIndex = editor.getCellIndex(activeCell);
		const newFocusIndex = typeof currCellIndex === 'number' ? currCellIndex + 1 : 0;
		textModel.applyEdits([
			{
				editType: CellEditType.Replace,
				index: newFocusIndex,
				count: 0,
				cells: pasteCells.items.map(cell => cloneNotebookCellTextModel(cell))
			}
		], true, originalState, () => ({
			kind: SelectionStateType.Index,
			focus: { start: newFocusIndex, end: newFocusIndex + 1 },
			selections: [{ start: newFocusIndex, end: newFocusIndex + pasteCells.items.length }]
		}), undefined, true);
	} else {
		if (editor.getLength() !== 0) {
			return false;
		}

		textModel.applyEdits([
			{
				editType: CellEditType.Replace,
				index: 0,
				count: 0,
				cells: pasteCells.items.map(cell => cloneNotebookCellTextModel(cell))
			}
		], true, originalState, () => ({
			kind: SelectionStateType.Index,
			focus: { start: 0, end: 1 },
			selections: [{ start: 1, end: pasteCells.items.length + 1 }]
		}), undefined, true);
	}

	return true;
}

export function runCopyCells(accessor: ServicesAccessor, editor: INotebookEditor, targetCell: ICellViewModel | undefined): boolean {
	if (!editor.hasModel()) {
		return false;
	}

	if (editor.hasOutputTextSelection()) {
		getWindow(editor.getDomNode()).document.execCommand('copy');
		return true;
	}

	const clipboardService = accessor.get<IClipboardService>(IClipboardService);
	const notebookService = accessor.get<INotebookService>(INotebookService);
	const selections = editor.getSelections();

	if (targetCell) {
		const targetCellIndex = editor.getCellIndex(targetCell);
		const containingSelection = selections.find(selection => selection.start <= targetCellIndex && targetCellIndex < selection.end);

		if (!containingSelection) {
			clipboardService.writeText(targetCell.getText());
			notebookService.setToCopy([targetCell.model], true);
			return true;
		}
	}

	const selectionRanges = expandCellRangesWithHiddenCells(editor, editor.getSelections());
	const selectedCells = cellRangeToViewCells(editor, selectionRanges);

	if (!selectedCells.length) {
		return false;
	}

	clipboardService.writeText(selectedCells.map(cell => cell.getText()).join('\n'));
	notebookService.setToCopy(selectedCells.map(cell => cell.model), true);

	return true;
}
export function runCutCells(accessor: ServicesAccessor, editor: INotebookEditor, targetCell: ICellViewModel | undefined): boolean {
	if (!editor.hasModel() || editor.isReadOnly) {
		return false;
	}

	const textModel = editor.textModel;
	const clipboardService = accessor.get<IClipboardService>(IClipboardService);
	const notebookService = accessor.get<INotebookService>(INotebookService);
	const selections = editor.getSelections();

	if (targetCell) {
		// from ui
		const targetCellIndex = editor.getCellIndex(targetCell);
		const containingSelection = selections.find(selection => selection.start <= targetCellIndex && targetCellIndex < selection.end);

		if (!containingSelection) {
			clipboardService.writeText(targetCell.getText());
			// delete cell
			const focus = editor.getFocus();
			const newFocus = focus.end <= targetCellIndex ? focus : { start: focus.start - 1, end: focus.end - 1 };
			const newSelections = selections.map(selection => (selection.end <= targetCellIndex ? selection : { start: selection.start - 1, end: selection.end - 1 }));

			textModel.applyEdits([
				{ editType: CellEditType.Replace, index: targetCellIndex, count: 1, cells: [] }
			], true, { kind: SelectionStateType.Index, focus: editor.getFocus(), selections: selections }, () => ({ kind: SelectionStateType.Index, focus: newFocus, selections: newSelections }), undefined, true);

			notebookService.setToCopy([targetCell.model], false);
			return true;
		}
	}

	const focus = editor.getFocus();
	const containingSelection = selections.find(selection => selection.start <= focus.start && focus.end <= selection.end);

	if (!containingSelection) {
		// focus is out of any selection, we should only cut this cell
		const targetCell = editor.cellAt(focus.start);
		clipboardService.writeText(targetCell.getText());
		const newFocus = focus.end === editor.getLength() ? { start: focus.start - 1, end: focus.end - 1 } : focus;
		const newSelections = selections.map(selection => (selection.end <= focus.start ? selection : { start: selection.start - 1, end: selection.end - 1 }));
		textModel.applyEdits([
			{ editType: CellEditType.Replace, index: focus.start, count: 1, cells: [] }
		], true, { kind: SelectionStateType.Index, focus: editor.getFocus(), selections: selections }, () => ({ kind: SelectionStateType.Index, focus: newFocus, selections: newSelections }), undefined, true);

		notebookService.setToCopy([targetCell.model], false);
		return true;
	}

	const selectionRanges = expandCellRangesWithHiddenCells(editor, editor.getSelections());
	const selectedCells = cellRangeToViewCells(editor, selectionRanges);

	if (!selectedCells.length) {
		return false;
	}

	clipboardService.writeText(selectedCells.map(cell => cell.getText()).join('\n'));
	const edits: ICellEditOperation[] = selectionRanges.map(range => ({ editType: CellEditType.Replace, index: range.start, count: range.end - range.start, cells: [] }));
	const firstSelectIndex = selectionRanges[0].start;

	/**
	 * If we have cells, 0, 1, 2, 3, 4, 5, 6
	 * and cells 1, 2 are selected, and then we delete cells 1 and 2
	 * the new focused cell should still be at index 1
	 */
	const newFocusedCellIndex = firstSelectIndex < textModel.cells.length - 1
		? firstSelectIndex
		: Math.max(textModel.cells.length - 2, 0);

	textModel.applyEdits(edits, true, { kind: SelectionStateType.Index, focus: editor.getFocus(), selections: selectionRanges }, () => {
		return {
			kind: SelectionStateType.Index,
			focus: { start: newFocusedCellIndex, end: newFocusedCellIndex + 1 },
			selections: [{ start: newFocusedCellIndex, end: newFocusedCellIndex + 1 }]
		};
	}, undefined, true);
	notebookService.setToCopy(selectedCells.map(cell => cell.model), false);

	return true;
}

export class NotebookClipboardContribution extends Disposable {

	static readonly ID = 'workbench.contrib.notebookClipboard';

	constructor(@IEditorService private readonly _editorService: IEditorService) {
		super();

		const PRIORITY = 105;

		if (CopyAction) {
			this._register(CopyAction.addImplementation(PRIORITY, 'notebook-clipboard', accessor => {
				return this.runCopyAction(accessor);
			}));
		}

		if (PasteAction) {
			this._register(PasteAction.addImplementation(PRIORITY, 'notebook-clipboard', accessor => {
				return this.runPasteAction(accessor);
			}));
		}

		if (CutAction) {
			this._register(CutAction.addImplementation(PRIORITY, 'notebook-clipboard', accessor => {
				return this.runCutAction(accessor);
			}));
		}
	}

	private _getContext() {
		const editor = getNotebookEditorFromEditorPane(this._editorService.activeEditorPane);
		const activeCell = editor?.getActiveCell();

		return {
			editor,
			activeCell
		};
	}

	private _focusInsideEmebedMonaco(editor: INotebookEditor) {
		const windowSelection = getWindow(editor.getDomNode()).getSelection();

		if (windowSelection?.rangeCount !== 1) {
			return false;
		}

		const activeSelection = windowSelection.getRangeAt(0);
		if (activeSelection.startContainer === activeSelection.endContainer && activeSelection.endOffset - activeSelection.startOffset === 0) {
			return false;
		}

		let container: any = activeSelection.commonAncestorContainer;
		const body = editor.getDomNode();

		if (!body.contains(container)) {
			return false;
		}

		while (container
			&&
			container !== body) {
			if ((container as HTMLElement).classList && (container as HTMLElement).classList.contains('monaco-editor')) {
				return true;
			}

			container = container.parentNode;
		}

		return false;
	}

	runCopyAction(accessor: ServicesAccessor) {
		const loggerService = accessor.get(ILogService);

		const activeElement = getActiveElement();
		if (isHTMLElement(activeElement) && isEditableElement(activeElement)) {
			_log(loggerService, '[NotebookEditor] focus is on input or textarea element, bypass');
			return false;
		}

		const { editor } = this._getContext();
		if (!editor) {
			_log(loggerService, '[NotebookEditor] no active notebook editor, bypass');
			return false;
		}

		if (!editor.hasEditorFocus()) {
			_log(loggerService, '[NotebookEditor] focus is outside of the notebook editor, bypass');
			return false;
		}

		if (this._focusInsideEmebedMonaco(editor)) {
			_log(loggerService, '[NotebookEditor] focus is on embed monaco editor, bypass');
			return false;
		}

		_log(loggerService, '[NotebookEditor] run copy actions on notebook model');
		return runCopyCells(accessor, editor, undefined);
	}

	runPasteAction(accessor: ServicesAccessor) {
		const activeElement = <HTMLElement>getActiveElement();
		if (activeElement && isEditableElement(activeElement)) {
			return false;
		}

		const { editor, activeCell } = this._getContext();
		if (!editor || !editor.hasEditorFocus() || this._focusInsideEmebedMonaco(editor)) {
			return false;
		}

		const notebookService = accessor.get<INotebookService>(INotebookService);
		const pasteCells = notebookService.getToCopy();

		if (!pasteCells) {
			return false;
		}

		return runPasteCells(editor, activeCell, pasteCells);
	}

	runCutAction(accessor: ServicesAccessor) {
		const activeElement = <HTMLElement>getActiveElement();
		if (activeElement && isEditableElement(activeElement)) {
			return false;
		}

		const { editor } = this._getContext();
		if (!editor || !editor.hasEditorFocus() || this._focusInsideEmebedMonaco(editor)) {
			return false;
		}

		return runCutCells(accessor, editor, undefined);
	}
}

registerWorkbenchContribution2(NotebookClipboardContribution.ID, NotebookClipboardContribution, WorkbenchPhase.BlockRestore);

const COPY_CELL_COMMAND_ID = 'notebook.cell.copy';
const CUT_CELL_COMMAND_ID = 'notebook.cell.cut';
const PASTE_CELL_COMMAND_ID = 'notebook.cell.paste';
const PASTE_CELL_ABOVE_COMMAND_ID = 'notebook.cell.pasteAbove';

registerAction2(class extends NotebookCellAction {
	constructor() {
		super(
			{
				id: COPY_CELL_COMMAND_ID,
				title: localize('notebookActions.copy', "Copy Cell"),
				menu: {
					id: MenuId.NotebookCellTitle,
					when: NOTEBOOK_EDITOR_FOCUSED,
					group: CellOverflowToolbarGroups.Copy,
					order: 2,
				},
				keybinding: platform.isNative ? undefined : {
					primary: KeyMod.CtrlCmd | KeyCode.KeyC,
					win: { primary: KeyMod.CtrlCmd | KeyCode.KeyC, secondary: [KeyMod.CtrlCmd | KeyCode.Insert] },
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, ContextKeyExpr.not(InputFocusedContextKey)),
					weight: KeybindingWeight.WorkbenchContrib
				}
			});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext) {
		runCopyCells(accessor, context.notebookEditor, context.cell);
	}
});

registerAction2(class extends NotebookCellAction {
	constructor() {
		super(
			{
				id: CUT_CELL_COMMAND_ID,
				title: localize('notebookActions.cut', "Cut Cell"),
				menu: {
					id: MenuId.NotebookCellTitle,
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_EDITOR_EDITABLE, NOTEBOOK_CELL_EDITABLE),
					group: CellOverflowToolbarGroups.Copy,
					order: 1,
				},
				keybinding: platform.isNative ? undefined : {
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, ContextKeyExpr.not(InputFocusedContextKey)),
					primary: KeyMod.CtrlCmd | KeyCode.KeyX,
					win: { primary: KeyMod.CtrlCmd | KeyCode.KeyX, secondary: [KeyMod.Shift | KeyCode.Delete] },
					weight: KeybindingWeight.WorkbenchContrib
				}
			});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext) {
		runCutCells(accessor, context.notebookEditor, context.cell);
	}
});

registerAction2(class extends NotebookAction {
	constructor() {
		super(
			{
				id: PASTE_CELL_COMMAND_ID,
				title: localize('notebookActions.paste', "Paste Cell"),
				menu: {
					id: MenuId.NotebookCellTitle,
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_EDITOR_EDITABLE),
					group: CellOverflowToolbarGroups.Copy,
					order: 3,
				},
				keybinding: platform.isNative ? undefined : {
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, ContextKeyExpr.not(InputFocusedContextKey)),
					primary: KeyMod.CtrlCmd | KeyCode.KeyV,
					win: { primary: KeyMod.CtrlCmd | KeyCode.KeyV, secondary: [KeyMod.Shift | KeyCode.Insert] },
					linux: { primary: KeyMod.CtrlCmd | KeyCode.KeyV, secondary: [KeyMod.Shift | KeyCode.Insert] },
					weight: KeybindingWeight.EditorContrib
				}
			});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext) {
		const notebookService = accessor.get<INotebookService>(INotebookService);
		const pasteCells = notebookService.getToCopy();

		if (!context.notebookEditor.hasModel() || context.notebookEditor.isReadOnly) {
			return;
		}

		if (!pasteCells) {
			return;
		}

		runPasteCells(context.notebookEditor, context.cell, pasteCells);
	}
});

registerAction2(class extends NotebookCellAction {
	constructor() {
		super(
			{
				id: PASTE_CELL_ABOVE_COMMAND_ID,
				title: localize('notebookActions.pasteAbove', "Paste Cell Above"),
				keybinding: {
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, ContextKeyExpr.not(InputFocusedContextKey)),
					primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyV,
					weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT
				},
			});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext) {
		const notebookService = accessor.get<INotebookService>(INotebookService);
		const pasteCells = notebookService.getToCopy();
		const editor = context.notebookEditor;
		const textModel = editor.textModel;

		if (editor.isReadOnly) {
			return;
		}

		if (!pasteCells) {
			return;
		}

		const originalState: ISelectionState = {
			kind: SelectionStateType.Index,
			focus: editor.getFocus(),
			selections: editor.getSelections()
		};

		const currCellIndex = context.notebookEditor.getCellIndex(context.cell);
		const newFocusIndex = currCellIndex;
		textModel.applyEdits([
			{
				editType: CellEditType.Replace,
				index: currCellIndex,
				count: 0,
				cells: pasteCells.items.map(cell => cloneNotebookCellTextModel(cell))
			}
		], true, originalState, () => ({
			kind: SelectionStateType.Index,
			focus: { start: newFocusIndex, end: newFocusIndex + 1 },
			selections: [{ start: newFocusIndex, end: newFocusIndex + pasteCells.items.length }]
		}), undefined, true);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.toggleNotebookClipboardLog',
			title: localize2('toggleNotebookClipboardLog', 'Toggle Notebook Clipboard Troubleshooting'),
			category: Categories.Developer,
			f1: true
		});
	}

	run(accessor: ServicesAccessor): void {
		toggleLogging();
		if (_logging) {
			const commandService = accessor.get(ICommandService);
			commandService.executeCommand(showWindowLogActionId);
		}
	}
});


registerAction2(class extends NotebookCellAction {
	constructor() {
		super(
			{
				id: 'notebook.cell.output.selectAll',
				title: localize('notebook.cell.output.selectAll', "Select All"),
				keybinding: {
					primary: KeyMod.CtrlCmd | KeyCode.KeyA,
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_OUTPUT_FOCUSED),
					weight: NOTEBOOK_OUTPUT_WEBVIEW_ACTION_WEIGHT
				}
			});
	}

	async runWithContext(accessor: ServicesAccessor, _context: INotebookCellActionContext) {
		withEditor(accessor, editor => {
			if (!editor.hasEditorFocus()) {
				return false;
			}
			if (editor.hasEditorFocus() && !editor.hasWebviewFocus()) {
				return true;
			}
			const cell = editor.getActiveCell();
			if (!cell || !cell.outputIsFocused || !editor.hasWebviewFocus()) {
				return true;
			}
			if (cell.inputInOutputIsFocused) {
				editor.selectInputContents(cell);
			} else {
				editor.selectOutputContent(cell);
			}
			return true;
		});

	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/debug/notebookBreakpoints.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/debug/notebookBreakpoints.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, IDisposable } from '../../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../../base/common/map.js';
import { Schemas } from '../../../../../../base/common/network.js';
import { isEqual } from '../../../../../../base/common/resources.js';
import { Registry } from '../../../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContribution, IWorkbenchContributionsRegistry } from '../../../../../common/contributions.js';
import { IBreakpoint, IDebugService } from '../../../../debug/common/debug.js';
import { getNotebookEditorFromEditorPane } from '../../notebookBrowser.js';
import { NotebookTextModel } from '../../../common/model/notebookTextModel.js';
import { CellUri, NotebookCellsChangeType } from '../../../common/notebookCommon.js';
import { INotebookService } from '../../../common/notebookService.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { LifecyclePhase } from '../../../../../services/lifecycle/common/lifecycle.js';
import { hasKey } from '../../../../../../base/common/types.js';

class NotebookBreakpoints extends Disposable implements IWorkbenchContribution {
	constructor(
		@IDebugService private readonly _debugService: IDebugService,
		@INotebookService _notebookService: INotebookService,
		@IEditorService private readonly _editorService: IEditorService,
	) {
		super();

		const listeners = new ResourceMap<IDisposable>();
		this._register(_notebookService.onWillAddNotebookDocument(model => {
			listeners.set(model.uri, model.onWillAddRemoveCells(e => {
				// When deleting a cell, remove its breakpoints
				const debugModel = this._debugService.getModel();
				if (!debugModel.getBreakpoints().length) {
					return;
				}

				if (e.rawEvent.kind !== NotebookCellsChangeType.ModelChange) {
					return;
				}

				for (const change of e.rawEvent.changes) {
					const [start, deleteCount] = change;
					if (deleteCount > 0) {
						const deleted = model.cells.slice(start, start + deleteCount);
						for (const deletedCell of deleted) {
							const cellBps = debugModel.getBreakpoints({ uri: deletedCell.uri });
							cellBps.forEach(cellBp => this._debugService.removeBreakpoints(cellBp.getId()));
						}
					}
				}
			}));
		}));

		this._register(_notebookService.onWillRemoveNotebookDocument(model => {
			this.updateBreakpoints(model);
			listeners.get(model.uri)?.dispose();
			listeners.delete(model.uri);
		}));

		this._register(this._debugService.getModel().onDidChangeBreakpoints(e => {
			const newCellBp = e?.added?.find(bp => hasKey(bp, { uri: true }) && bp.uri.scheme === Schemas.vscodeNotebookCell) as IBreakpoint | undefined;
			if (newCellBp) {
				const parsed = CellUri.parse(newCellBp.uri);
				if (!parsed) {
					return;
				}

				const editor = getNotebookEditorFromEditorPane(this._editorService.activeEditorPane);
				if (!editor || !editor.hasModel() || editor.textModel.uri.toString() !== parsed.notebook.toString()) {
					return;
				}


				const cell = editor.getCellByHandle(parsed.handle);
				if (!cell) {
					return;
				}

				editor.focusElement(cell);
			}
		}));
	}

	private updateBreakpoints(model: NotebookTextModel): void {
		const bps = this._debugService.getModel().getBreakpoints();
		if (!bps.length || !model.cells.length) {
			return;
		}

		const idxMap = new ResourceMap<number>();
		model.cells.forEach((cell, i) => {
			idxMap.set(cell.uri, i);
		});

		bps.forEach(bp => {
			const idx = idxMap.get(bp.uri);
			if (typeof idx !== 'number') {
				return;
			}

			const notebook = CellUri.parse(bp.uri)?.notebook;
			if (!notebook) {
				return;
			}

			const newUri = CellUri.generate(notebook, idx);
			if (isEqual(newUri, bp.uri)) {
				return;
			}

			this._debugService.removeBreakpoints(bp.getId());
			this._debugService.addBreakpoints(newUri, [
				{
					column: bp.column,
					condition: bp.condition,
					enabled: bp.enabled,
					hitCondition: bp.hitCondition,
					logMessage: bp.logMessage,
					lineNumber: bp.lineNumber
				}
			]);
		});
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(NotebookBreakpoints, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/debug/notebookCellPausing.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/debug/notebookCellPausing.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../../../base/common/async.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../../base/common/uri.js';
import { Registry } from '../../../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContribution, IWorkbenchContributionsRegistry } from '../../../../../common/contributions.js';
import { IDebugService } from '../../../../debug/common/debug.js';
import { Thread } from '../../../../debug/common/debugModel.js';
import { CellUri } from '../../../common/notebookCommon.js';
import { CellExecutionUpdateType } from '../../../common/notebookExecutionService.js';
import { INotebookExecutionStateService } from '../../../common/notebookExecutionStateService.js';
import { LifecyclePhase } from '../../../../../services/lifecycle/common/lifecycle.js';

class NotebookCellPausing extends Disposable implements IWorkbenchContribution {
	private readonly _pausedCells = new Set<string>();

	private _scheduler: RunOnceScheduler;

	constructor(
		@IDebugService private readonly _debugService: IDebugService,
		@INotebookExecutionStateService private readonly _notebookExecutionStateService: INotebookExecutionStateService,
	) {
		super();

		this._register(_debugService.getModel().onDidChangeCallStack(() => {
			// First update using the stale callstack if the real callstack is empty, to reduce blinking while stepping.
			// After not pausing for 2s, update again with the latest callstack.
			this.onDidChangeCallStack(true);
			this._scheduler.schedule();
		}));
		this._scheduler = this._register(new RunOnceScheduler(() => this.onDidChangeCallStack(false), 2000));
	}

	private async onDidChangeCallStack(fallBackOnStaleCallstack: boolean): Promise<void> {
		const newPausedCells = new Set<string>();

		for (const session of this._debugService.getModel().getSessions()) {
			for (const thread of session.getAllThreads()) {
				let callStack = thread.getCallStack();
				if (fallBackOnStaleCallstack && !callStack.length) {
					callStack = (thread as Thread).getStaleCallStack();
				}

				callStack.forEach(sf => {
					const parsed = CellUri.parse(sf.source.uri);
					if (parsed) {
						newPausedCells.add(sf.source.uri.toString());
						this.editIsPaused(sf.source.uri, true);
					}
				});
			}
		}

		for (const uri of this._pausedCells) {
			if (!newPausedCells.has(uri)) {
				this.editIsPaused(URI.parse(uri), false);
				this._pausedCells.delete(uri);
			}
		}

		newPausedCells.forEach(cell => this._pausedCells.add(cell));
	}

	private editIsPaused(cellUri: URI, isPaused: boolean) {
		const parsed = CellUri.parse(cellUri);
		if (parsed) {
			const exeState = this._notebookExecutionStateService.getCellExecution(cellUri);
			if (exeState && (exeState.isPaused !== isPaused || !exeState.didPause)) {
				exeState.update([{
					editType: CellExecutionUpdateType.ExecutionState,
					didPause: true,
					isPaused
				}]);
			}
		}
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(NotebookCellPausing, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/debug/notebookDebugDecorations.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/debug/notebookDebugDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Delayer } from '../../../../../../base/common/async.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { IRange, Range } from '../../../../../../editor/common/core/range.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { debugIconBreakpointForeground } from '../../../../debug/browser/breakpointEditorContribution.js';
import { focusedStackFrameColor, topStackFrameColor } from '../../../../debug/browser/callStackEditorContribution.js';
import { IDebugService, IStackFrame } from '../../../../debug/common/debug.js';
import { INotebookCellDecorationOptions, INotebookDeltaCellDecoration, INotebookEditor, INotebookEditorContribution, NotebookOverviewRulerLane } from '../../notebookBrowser.js';
import { registerNotebookContribution } from '../../notebookEditorExtensions.js';
import { runningCellRulerDecorationColor } from '../../notebookEditorWidget.js';
import { CellUri, NotebookCellExecutionState } from '../../../common/notebookCommon.js';
import { INotebookExecutionStateService, NotebookExecutionType } from '../../../common/notebookExecutionStateService.js';

interface ICellAndRange {
	handle: number;
	range: IRange;
}

export class PausedCellDecorationContribution extends Disposable implements INotebookEditorContribution {
	static id: string = 'workbench.notebook.debug.pausedCellDecorations';

	private _currentTopDecorations: string[] = [];
	private _currentOtherDecorations: string[] = [];
	private _executingCellDecorations: string[] = [];

	constructor(
		private readonly _notebookEditor: INotebookEditor,
		@IDebugService private readonly _debugService: IDebugService,
		@INotebookExecutionStateService private readonly _notebookExecutionStateService: INotebookExecutionStateService,
	) {
		super();

		const delayer = this._register(new Delayer(200));
		this._register(_debugService.getModel().onDidChangeCallStack(() => this.updateExecutionDecorations()));
		this._register(_debugService.getViewModel().onDidFocusStackFrame(() => this.updateExecutionDecorations()));
		this._register(_notebookExecutionStateService.onDidChangeExecution(e => {
			if (e.type === NotebookExecutionType.cell && this._notebookEditor.textModel && e.affectsNotebook(this._notebookEditor.textModel.uri)) {
				delayer.trigger(() => this.updateExecutionDecorations());
			}
		}));
	}

	private updateExecutionDecorations(): void {
		const exes = this._notebookEditor.textModel ?
			this._notebookExecutionStateService.getCellExecutionsByHandleForNotebook(this._notebookEditor.textModel.uri)
			: undefined;

		const topFrameCellsAndRanges: ICellAndRange[] = [];
		let focusedFrameCellAndRange: ICellAndRange | undefined = undefined;

		const getNotebookCellAndRange = (sf: IStackFrame): ICellAndRange | undefined => {
			const parsed = CellUri.parse(sf.source.uri);
			if (parsed && parsed.notebook.toString() === this._notebookEditor.textModel?.uri.toString()) {
				return { handle: parsed.handle, range: sf.range };
			}
			return undefined;
		};

		for (const session of this._debugService.getModel().getSessions()) {
			for (const thread of session.getAllThreads()) {
				const topFrame = thread.getTopStackFrame();
				if (topFrame) {
					const notebookCellAndRange = getNotebookCellAndRange(topFrame);
					if (notebookCellAndRange) {
						topFrameCellsAndRanges.push(notebookCellAndRange);
						exes?.delete(notebookCellAndRange.handle);
					}
				}
			}
		}

		const focusedFrame = this._debugService.getViewModel().focusedStackFrame;
		if (focusedFrame && focusedFrame.thread.stopped) {
			const thisFocusedFrameCellAndRange = getNotebookCellAndRange(focusedFrame);
			if (thisFocusedFrameCellAndRange &&
				!topFrameCellsAndRanges.some(topFrame => topFrame.handle === thisFocusedFrameCellAndRange?.handle && Range.equalsRange(topFrame.range, thisFocusedFrameCellAndRange?.range))) {
				focusedFrameCellAndRange = thisFocusedFrameCellAndRange;
				exes?.delete(focusedFrameCellAndRange.handle);
			}
		}

		this.setTopFrameDecoration(topFrameCellsAndRanges);
		this.setFocusedFrameDecoration(focusedFrameCellAndRange);

		const exeHandles = exes ?
			Array.from(exes.entries())
				.filter(([_, exe]) => exe.state === NotebookCellExecutionState.Executing)
				.map(([handle]) => handle)
			: [];
		this.setExecutingCellDecorations(exeHandles);
	}

	private setTopFrameDecoration(handlesAndRanges: ICellAndRange[]): void {
		const newDecorations: INotebookDeltaCellDecoration[] = handlesAndRanges.map(({ handle, range }) => {
			const options: INotebookCellDecorationOptions = {
				overviewRuler: {
					color: topStackFrameColor,
					includeOutput: false,
					modelRanges: [range],
					position: NotebookOverviewRulerLane.Full
				}
			};
			return {
				handle,
				options
			};
		});

		this._currentTopDecorations = this._notebookEditor.deltaCellDecorations(this._currentTopDecorations, newDecorations);
	}

	private setFocusedFrameDecoration(focusedFrameCellAndRange: ICellAndRange | undefined): void {
		let newDecorations: INotebookDeltaCellDecoration[] = [];
		if (focusedFrameCellAndRange) {
			const options: INotebookCellDecorationOptions = {
				overviewRuler: {
					color: focusedStackFrameColor,
					includeOutput: false,
					modelRanges: [focusedFrameCellAndRange.range],
					position: NotebookOverviewRulerLane.Full
				}
			};
			newDecorations = [{
				handle: focusedFrameCellAndRange.handle,
				options
			}];
		}

		this._currentOtherDecorations = this._notebookEditor.deltaCellDecorations(this._currentOtherDecorations, newDecorations);
	}

	private setExecutingCellDecorations(handles: number[]): void {
		const newDecorations: INotebookDeltaCellDecoration[] = handles.map(handle => {
			const options: INotebookCellDecorationOptions = {
				overviewRuler: {
					color: runningCellRulerDecorationColor,
					includeOutput: false,
					modelRanges: [new Range(0, 0, 0, 0)],
					position: NotebookOverviewRulerLane.Left
				}
			};
			return {
				handle,
				options
			};
		});

		this._executingCellDecorations = this._notebookEditor.deltaCellDecorations(this._executingCellDecorations, newDecorations);
	}
}

registerNotebookContribution(PausedCellDecorationContribution.id, PausedCellDecorationContribution);

export class NotebookBreakpointDecorations extends Disposable implements INotebookEditorContribution {
	static id: string = 'workbench.notebook.debug.notebookBreakpointDecorations';

	private _currentDecorations: string[] = [];

	constructor(
		private readonly _notebookEditor: INotebookEditor,
		@IDebugService private readonly _debugService: IDebugService,
		@IConfigurationService private readonly _configService: IConfigurationService,
	) {
		super();
		this._register(_debugService.getModel().onDidChangeBreakpoints(() => this.updateDecorations()));
		this._register(_configService.onDidChangeConfiguration(e => e.affectsConfiguration('debug.showBreakpointsInOverviewRuler') && this.updateDecorations()));
	}

	private updateDecorations(): void {
		const enabled = this._configService.getValue('debug.showBreakpointsInOverviewRuler');
		const newDecorations = enabled ?
			this._debugService.getModel().getBreakpoints().map(breakpoint => {
				const parsed = CellUri.parse(breakpoint.uri);
				if (!parsed || parsed.notebook.toString() !== this._notebookEditor.textModel!.uri.toString()) {
					return null;
				}

				const options: INotebookCellDecorationOptions = {
					overviewRuler: {
						color: debugIconBreakpointForeground,
						includeOutput: false,
						modelRanges: [new Range(breakpoint.lineNumber, 0, breakpoint.lineNumber, 0)],
						position: NotebookOverviewRulerLane.Left
					}
				};
				return { handle: parsed.handle, options };
			}).filter(x => !!x) as INotebookDeltaCellDecoration[]
			: [];
		this._currentDecorations = this._notebookEditor.deltaCellDecorations(this._currentDecorations, newDecorations);
	}
}

registerNotebookContribution(NotebookBreakpointDecorations.id, NotebookBreakpointDecorations);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/editorHint/emptyCellEditorHint.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/editorHint/emptyCellEditorHint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../../../../base/common/network.js';
import { ICodeEditor } from '../../../../../../editor/browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../../../../editor/browser/editorExtensions.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IChatAgentService } from '../../../../chat/common/chatAgents.js';
import { EmptyTextEditorHintContribution } from '../../../../codeEditor/browser/emptyTextEditorHint/emptyTextEditorHint.js';
import { IInlineChatSessionService } from '../../../../inlineChat/browser/inlineChatSessionService.js';
import { getNotebookEditorFromEditorPane } from '../../notebookBrowser.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';

export class EmptyCellEditorHintContribution extends EmptyTextEditorHintContribution {
	public static readonly CONTRIB_ID = 'notebook.editor.contrib.emptyCellEditorHint';
	constructor(
		editor: ICodeEditor,
		@IEditorService private readonly _editorService: IEditorService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInlineChatSessionService inlineChatSessionService: IInlineChatSessionService,
		@IChatAgentService chatAgentService: IChatAgentService,
		@IInstantiationService instantiationService: IInstantiationService
	) {
		super(
			editor,
			configurationService,
			inlineChatSessionService,
			chatAgentService,
			instantiationService
		);

		const activeEditor = getNotebookEditorFromEditorPane(this._editorService.activeEditorPane);
		if (!activeEditor) {
			return;
		}

		this._register(activeEditor.onDidChangeActiveCell(() => this.update()));
	}

	protected override shouldRenderHint(): boolean {
		const model = this.editor.getModel();
		if (!model) {
			return false;
		}

		const isNotebookCell = model?.uri.scheme === Schemas.vscodeNotebookCell;
		if (!isNotebookCell) {
			return false;
		}

		const activeEditor = getNotebookEditorFromEditorPane(this._editorService.activeEditorPane);
		if (!activeEditor || !activeEditor.isDisposed) {
			return false;
		}

		const shouldRenderHint = super.shouldRenderHint();
		if (!shouldRenderHint) {
			return false;
		}

		const activeCell = activeEditor.getActiveCell();

		if (activeCell?.uri.fragment !== model.uri.fragment) {
			return false;
		}

		return true;
	}
}

registerEditorContribution(EmptyCellEditorHintContribution.CONTRIB_ID, EmptyCellEditorHintContribution, EditorContributionInstantiation.Eager); // eager because it needs to render a help message
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/editorStatusBar/editorStatusBar.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/editorStatusBar/editorStatusBar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../../../nls.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable } from '../../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../../base/common/network.js';
import { ILanguageFeaturesService } from '../../../../../../editor/common/services/languageFeatures.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../../../platform/log/common/log.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../../../common/contributions.js';
import { CENTER_ACTIVE_CELL } from '../navigation/arrow.js';
import { SELECT_KERNEL_ID } from '../../controller/coreActions.js';
import { SELECT_NOTEBOOK_INDENTATION_ID } from '../../controller/editActions.js';
import { INotebookEditor, getNotebookEditorFromEditorPane } from '../../notebookBrowser.js';
import { NotebookTextModel } from '../../../common/model/notebookTextModel.js';
import { NotebookCellsChangeType } from '../../../common/notebookCommon.js';
import { INotebookKernel, INotebookKernelService } from '../../../common/notebookKernelService.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { IStatusbarEntry, IStatusbarEntryAccessor, IStatusbarService, StatusbarAlignment } from '../../../../../services/statusbar/browser/statusbar.js';
import { IEditorGroupsService, IEditorPart } from '../../../../../services/editor/common/editorGroupsService.js';
import { Event } from '../../../../../../base/common/event.js';

class ImplictKernelSelector implements IDisposable {

	readonly dispose: () => void;

	constructor(
		notebook: NotebookTextModel,
		suggested: INotebookKernel,
		@INotebookKernelService notebookKernelService: INotebookKernelService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@ILogService logService: ILogService
	) {
		const disposables = new DisposableStore();
		this.dispose = disposables.dispose.bind(disposables);

		const selectKernel = () => {
			disposables.clear();
			notebookKernelService.selectKernelForNotebook(suggested, notebook);
		};

		// IMPLICITLY select a suggested kernel when the notebook has been changed
		// e.g change cell source, move cells, etc
		disposables.add(notebook.onDidChangeContent(e => {
			for (const event of e.rawEvents) {
				switch (event.kind) {
					case NotebookCellsChangeType.ChangeCellContent:
					case NotebookCellsChangeType.ModelChange:
					case NotebookCellsChangeType.Move:
					case NotebookCellsChangeType.ChangeCellLanguage:
						logService.trace('IMPLICIT kernel selection because of change event', event.kind);
						selectKernel();
						break;
				}
			}
		}));


		// IMPLICITLY select a suggested kernel when users start to hover. This should
		// be a strong enough hint that the user wants to interact with the notebook. Maybe
		// add more triggers like goto-providers or completion-providers
		disposables.add(languageFeaturesService.hoverProvider.register({ scheme: Schemas.vscodeNotebookCell, pattern: notebook.uri.path }, {
			provideHover() {
				logService.trace('IMPLICIT kernel selection because of hover');
				selectKernel();
				return undefined;
			}
		}));
	}
}

class KernelStatus extends Disposable implements IWorkbenchContribution {

	private readonly _editorDisposables = this._register(new DisposableStore());
	private readonly _kernelInfoElement = this._register(new DisposableStore());

	constructor(
		@IEditorService private readonly _editorService: IEditorService,
		@IStatusbarService private readonly _statusbarService: IStatusbarService,
		@INotebookKernelService private readonly _notebookKernelService: INotebookKernelService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();
		this._register(this._editorService.onDidActiveEditorChange(() => this._updateStatusbar()));
		this._updateStatusbar();
	}

	private _updateStatusbar() {
		this._editorDisposables.clear();

		const activeEditor = getNotebookEditorFromEditorPane(this._editorService.activeEditorPane);
		if (!activeEditor) {
			// not a notebook -> clean-up, done
			this._kernelInfoElement.clear();
			return;
		}

		const updateStatus = () => {
			if (activeEditor.notebookOptions.getDisplayOptions().globalToolbar) {
				// kernel info rendered in the notebook toolbar already
				this._kernelInfoElement.clear();
				return;
			}

			const notebook = activeEditor.textModel;
			if (notebook) {
				this._showKernelStatus(notebook);
			} else {
				this._kernelInfoElement.clear();
			}
		};

		this._editorDisposables.add(this._notebookKernelService.onDidAddKernel(updateStatus));
		this._editorDisposables.add(this._notebookKernelService.onDidChangeSelectedNotebooks(updateStatus));
		this._editorDisposables.add(this._notebookKernelService.onDidChangeNotebookAffinity(updateStatus));
		this._editorDisposables.add(activeEditor.onDidChangeModel(updateStatus));
		this._editorDisposables.add(activeEditor.notebookOptions.onDidChangeOptions(updateStatus));
		updateStatus();
	}

	private _showKernelStatus(notebook: NotebookTextModel) {

		this._kernelInfoElement.clear();

		const { selected, suggestions, all } = this._notebookKernelService.getMatchingKernel(notebook);
		const suggested = (suggestions.length === 1 ? suggestions[0] : undefined)
			?? (all.length === 1) ? all[0] : undefined;
		let isSuggested = false;

		if (all.length === 0) {
			// no kernel -> no status
			return;

		} else if (selected || suggested) {
			// selected or single kernel
			let kernel = selected;

			if (!kernel) {
				// proceed with suggested kernel - show UI and install handler that selects the kernel
				// when non trivial interactions with the notebook happen.
				kernel = suggested!;
				isSuggested = true;
				this._kernelInfoElement.add(this._instantiationService.createInstance(ImplictKernelSelector, notebook, kernel));
			}
			const tooltip = kernel.description ?? kernel.detail ?? kernel.label;
			this._kernelInfoElement.add(this._statusbarService.addEntry(
				{
					name: nls.localize('notebook.info', "Notebook Kernel Info"),
					text: `$(notebook-kernel-select) ${kernel.label}`,
					ariaLabel: kernel.label,
					tooltip: isSuggested ? nls.localize('tooltop', "{0} (suggestion)", tooltip) : tooltip,
					command: SELECT_KERNEL_ID,
				},
				SELECT_KERNEL_ID,
				StatusbarAlignment.RIGHT,
				10
			));

			this._kernelInfoElement.add(kernel.onDidChange(() => this._showKernelStatus(notebook)));


		} else {
			// multiple kernels -> show selection hint
			this._kernelInfoElement.add(this._statusbarService.addEntry(
				{
					name: nls.localize('notebook.select', "Notebook Kernel Selection"),
					text: nls.localize('kernel.select.label', "Select Kernel"),
					ariaLabel: nls.localize('kernel.select.label', "Select Kernel"),
					command: SELECT_KERNEL_ID,
					kind: 'prominent'
				},
				SELECT_KERNEL_ID,
				StatusbarAlignment.RIGHT,
				10
			));
		}
	}
}

class ActiveCellStatus extends Disposable implements IWorkbenchContribution {

	private readonly _itemDisposables = this._register(new DisposableStore());
	private readonly _accessor = this._register(new MutableDisposable<IStatusbarEntryAccessor>());

	constructor(
		@IEditorService private readonly _editorService: IEditorService,
		@IStatusbarService private readonly _statusbarService: IStatusbarService,
	) {
		super();
		this._register(this._editorService.onDidActiveEditorChange(() => this._update()));
		this._update();
	}

	private _update() {
		this._itemDisposables.clear();
		const activeEditor = getNotebookEditorFromEditorPane(this._editorService.activeEditorPane);
		if (activeEditor) {
			this._itemDisposables.add(activeEditor.onDidChangeSelection(() => this._show(activeEditor)));
			this._itemDisposables.add(activeEditor.onDidChangeActiveCell(() => this._show(activeEditor)));
			this._show(activeEditor);
		} else {
			this._accessor.clear();
		}
	}

	private _show(editor: INotebookEditor) {
		if (!editor.hasModel()) {
			this._accessor.clear();
			return;
		}

		const newText = this._getSelectionsText(editor);
		if (!newText) {
			this._accessor.clear();
			return;
		}

		const entry: IStatusbarEntry = {
			name: nls.localize('notebook.activeCellStatusName', "Notebook Editor Selections"),
			text: newText,
			ariaLabel: newText,
			command: CENTER_ACTIVE_CELL
		};
		if (!this._accessor.value) {
			this._accessor.value = this._statusbarService.addEntry(
				entry,
				'notebook.activeCellStatus',
				StatusbarAlignment.RIGHT,
				100
			);
		} else {
			this._accessor.value.update(entry);
		}
	}

	private _getSelectionsText(editor: INotebookEditor): string | undefined {
		if (!editor.hasModel()) {
			return undefined;
		}

		const activeCell = editor.getActiveCell();
		if (!activeCell) {
			return undefined;
		}

		const idxFocused = editor.getCellIndex(activeCell) + 1;
		const numSelected = editor.getSelections().reduce((prev, range) => prev + (range.end - range.start), 0);
		const totalCells = editor.getLength();
		return numSelected > 1 ?
			nls.localize('notebook.multiActiveCellIndicator', "Cell {0} ({1} selected)", idxFocused, numSelected) :
			nls.localize('notebook.singleActiveCellIndicator', "Cell {0} of {1}", idxFocused, totalCells);
	}
}

class NotebookIndentationStatus extends Disposable {

	private readonly _itemDisposables = this._register(new DisposableStore());
	private readonly _accessor = this._register(new MutableDisposable<IStatusbarEntryAccessor>());

	static readonly ID = 'selectNotebookIndentation';

	constructor(
		@IEditorService private readonly _editorService: IEditorService,
		@IStatusbarService private readonly _statusbarService: IStatusbarService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		super();
		this._register(this._editorService.onDidActiveEditorChange(() => this._update()));
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('editor') || e.affectsConfiguration('notebook')) {
				this._update();
			}
		}));
		this._update();
	}

	private _update() {
		this._itemDisposables.clear();
		const activeEditor = getNotebookEditorFromEditorPane(this._editorService.activeEditorPane);
		if (activeEditor) {
			this._show(activeEditor);
			this._itemDisposables.add(activeEditor.onDidChangeSelection(() => {
				this._accessor.clear();
				this._show(activeEditor);
			}));
		} else {
			this._accessor.clear();
		}
	}

	private _show(editor: INotebookEditor) {
		if (!editor.hasModel()) {
			this._accessor.clear();
			return;
		}

		const cellOptions = editor.getActiveCell()?.textModel?.getOptions();
		if (!cellOptions) {
			this._accessor.clear();
			return;
		}

		const cellEditorOverridesRaw = editor.notebookOptions.getDisplayOptions().editorOptionsCustomizations;
		const indentSize = cellEditorOverridesRaw?.['editor.indentSize'] ?? cellOptions?.indentSize;
		const insertSpaces = cellEditorOverridesRaw?.['editor.insertSpaces'] ?? cellOptions?.insertSpaces;
		const tabSize = cellEditorOverridesRaw?.['editor.tabSize'] ?? cellOptions?.tabSize;

		const width = typeof indentSize === 'number' ? indentSize : tabSize;

		const message = insertSpaces ? `Spaces: ${width}` : `Tab Size: ${width}`;
		const newText = message;
		if (!newText) {
			this._accessor.clear();
			return;
		}

		const entry: IStatusbarEntry = {
			name: nls.localize('notebook.indentation', "Notebook Indentation"),
			text: newText,
			ariaLabel: newText,
			tooltip: nls.localize('selectNotebookIndentation', "Select Indentation"),
			command: SELECT_NOTEBOOK_INDENTATION_ID
		};

		if (!this._accessor.value) {
			this._accessor.value = this._statusbarService.addEntry(
				entry,
				'notebook.status.indentation',
				StatusbarAlignment.RIGHT,
				100.4
			);
		} else {
			this._accessor.value.update(entry);
		}
	}
}

class NotebookEditorStatusContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'notebook.contrib.editorStatus';

	constructor(
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService
	) {
		super();

		for (const part of editorGroupService.parts) {
			this.createNotebookStatus(part);
		}

		this._register(editorGroupService.onDidCreateAuxiliaryEditorPart(part => this.createNotebookStatus(part)));
	}

	private createNotebookStatus(part: IEditorPart): void {
		const disposables = new DisposableStore();
		Event.once(part.onWillDispose)(() => disposables.dispose());

		const scopedInstantiationService = this.editorGroupService.getScopedInstantiationService(part);
		disposables.add(scopedInstantiationService.createInstance(KernelStatus));
		disposables.add(scopedInstantiationService.createInstance(ActiveCellStatus));
		disposables.add(scopedInstantiationService.createInstance(NotebookIndentationStatus));
	}
}

registerWorkbenchContribution2(NotebookEditorStatusContribution.ID, NotebookEditorStatusContribution, WorkbenchPhase.AfterRestored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/execute/executionEditorProgress.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/execute/executionEditorProgress.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { throttle } from '../../../../../../base/common/decorators.js';
import { Disposable, MutableDisposable } from '../../../../../../base/common/lifecycle.js';
import { INotebookEditor, INotebookEditorContribution } from '../../notebookBrowser.js';
import { registerNotebookContribution } from '../../notebookEditorExtensions.js';
import { NotebookCellExecutionState } from '../../../common/notebookCommon.js';
import { INotebookCellExecution, INotebookExecutionStateService } from '../../../common/notebookExecutionStateService.js';
import { IUserActivityService } from '../../../../../services/userActivity/common/userActivityService.js';

export class ExecutionEditorProgressController extends Disposable implements INotebookEditorContribution {
	static id: string = 'workbench.notebook.executionEditorProgress';

	private readonly _activityMutex = this._register(new MutableDisposable());

	constructor(
		private readonly _notebookEditor: INotebookEditor,
		@INotebookExecutionStateService private readonly _notebookExecutionStateService: INotebookExecutionStateService,
		@IUserActivityService private readonly _userActivity: IUserActivityService,
	) {
		super();

		this._register(_notebookEditor.onDidScroll(() => this._update()));

		this._register(_notebookExecutionStateService.onDidChangeExecution(e => {
			if (e.notebook.toString() !== this._notebookEditor.textModel?.uri.toString()) {
				return;
			}

			this._update();
		}));

		this._register(_notebookEditor.onDidChangeModel(() => this._update()));
	}

	@throttle(100)
	private _update() {
		if (!this._notebookEditor.hasModel()) {
			return;
		}

		const cellExecutions = this._notebookExecutionStateService.getCellExecutionsForNotebook(this._notebookEditor.textModel?.uri)
			.filter(exe => exe.state === NotebookCellExecutionState.Executing);
		const notebookExecution = this._notebookExecutionStateService.getExecution(this._notebookEditor.textModel?.uri);
		const executionIsVisible = (exe: INotebookCellExecution) => {
			for (const range of this._notebookEditor.visibleRanges) {
				for (const cell of this._notebookEditor.getCellsInRange(range)) {
					if (cell.handle === exe.cellHandle) {
						const top = this._notebookEditor.getAbsoluteTopOfElement(cell);
						if (this._notebookEditor.scrollTop < top + 5) {
							return true;
						}
					}
				}
			}

			return false;
		};

		const hasAnyExecution = cellExecutions.length || notebookExecution;
		if (hasAnyExecution && !this._activityMutex.value) {
			this._activityMutex.value = this._userActivity.markActive();
		} else if (!hasAnyExecution && this._activityMutex.value) {
			this._activityMutex.clear();
		}

		const shouldShowEditorProgressbarForCellExecutions = cellExecutions.length && !cellExecutions.some(executionIsVisible) && !cellExecutions.some(e => e.isPaused);
		const showEditorProgressBar = !!notebookExecution || shouldShowEditorProgressbarForCellExecutions;
		if (showEditorProgressBar) {
			this._notebookEditor.showProgress();
		} else {
			this._notebookEditor.hideProgress();
		}
	}
}


registerNotebookContribution(ExecutionEditorProgressController.id, ExecutionEditorProgressController);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/find/findFilters.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/find/findFilters.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../../base/common/event.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { INotebookFindScope, NotebookFindScopeType } from '../../../common/notebookCommon.js';

export interface INotebookFindChangeEvent {
	markupInput?: boolean;
	markupPreview?: boolean;
	codeInput?: boolean;
	codeOutput?: boolean;
	findScope?: boolean;
}

export class NotebookFindFilters extends Disposable {
	private readonly _onDidChange: Emitter<INotebookFindChangeEvent> = this._register(new Emitter<INotebookFindChangeEvent>());
	readonly onDidChange: Event<INotebookFindChangeEvent> = this._onDidChange.event;

	private _markupInput: boolean = true;

	get markupInput(): boolean {
		return this._markupInput;
	}

	set markupInput(value: boolean) {
		if (this._markupInput !== value) {
			this._markupInput = value;
			this._onDidChange.fire({ markupInput: value });
		}
	}

	private _markupPreview: boolean = true;

	get markupPreview(): boolean {
		return this._markupPreview;
	}

	set markupPreview(value: boolean) {
		if (this._markupPreview !== value) {
			this._markupPreview = value;
			this._onDidChange.fire({ markupPreview: value });
		}
	}
	private _codeInput: boolean = true;

	get codeInput(): boolean {
		return this._codeInput;
	}

	set codeInput(value: boolean) {
		if (this._codeInput !== value) {
			this._codeInput = value;
			this._onDidChange.fire({ codeInput: value });
		}
	}

	private _codeOutput: boolean = true;

	get codeOutput(): boolean {
		return this._codeOutput;
	}

	set codeOutput(value: boolean) {
		if (this._codeOutput !== value) {
			this._codeOutput = value;
			this._onDidChange.fire({ codeOutput: value });
		}
	}

	private _findScope: INotebookFindScope = { findScopeType: NotebookFindScopeType.None };

	get findScope(): INotebookFindScope {
		return this._findScope;
	}

	set findScope(value: INotebookFindScope) {
		if (this._findScope !== value) {
			this._findScope = value;
			this._onDidChange.fire({ findScope: true });
		}
	}


	private readonly _initialMarkupInput: boolean;
	private readonly _initialMarkupPreview: boolean;
	private readonly _initialCodeInput: boolean;
	private readonly _initialCodeOutput: boolean;

	constructor(
		markupInput: boolean,
		markupPreview: boolean,
		codeInput: boolean,
		codeOutput: boolean,
		findScope: INotebookFindScope
	) {
		super();

		this._markupInput = markupInput;
		this._markupPreview = markupPreview;
		this._codeInput = codeInput;
		this._codeOutput = codeOutput;
		this._findScope = findScope;

		this._initialMarkupInput = markupInput;
		this._initialMarkupPreview = markupPreview;
		this._initialCodeInput = codeInput;
		this._initialCodeOutput = codeOutput;
	}

	isModified(): boolean {
		// do not include findInSelection or either selectedRanges in the check. This will incorrectly mark the filter icon as modified
		return (
			this._markupInput !== this._initialMarkupInput
			|| this._markupPreview !== this._initialMarkupPreview
			|| this._codeInput !== this._initialCodeInput
			|| this._codeOutput !== this._initialCodeOutput
		);
	}

	update(v: NotebookFindFilters) {
		this._markupInput = v.markupInput;
		this._markupPreview = v.markupPreview;
		this._codeInput = v.codeInput;
		this._codeOutput = v.codeOutput;
		this._findScope = v.findScope;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/find/findMatchDecorationModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/find/findMatchDecorationModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { IModelDeltaDecoration } from '../../../../../../editor/common/model.js';
import { ModelDecorationOptions } from '../../../../../../editor/common/model/textModel.js';
import { FindDecorations } from '../../../../../../editor/contrib/find/browser/findDecorations.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { overviewRulerSelectionHighlightForeground, overviewRulerFindMatchForeground } from '../../../../../../platform/theme/common/colorRegistry.js';
import { CellFindMatchWithIndex, ICellModelDecorations, ICellModelDeltaDecorations, ICellViewModel, INotebookDeltaDecoration, INotebookEditor, NotebookOverviewRulerLane, } from '../../notebookBrowser.js';

export class FindMatchDecorationModel extends Disposable {
	private _allMatchesDecorations: ICellModelDecorations[] = [];
	private _currentMatchCellDecorations: string[] = [];
	private _allMatchesCellDecorations: string[] = [];
	private _currentMatchDecorations: { kind: 'input'; decorations: ICellModelDecorations[] } | { kind: 'output'; index: number } | null = null;

	constructor(
		private readonly _notebookEditor: INotebookEditor,
		private readonly ownerID: string,
	) {
		super();
	}

	public get currentMatchDecorations() {
		return this._currentMatchDecorations;
	}

	private clearDecorations() {
		this.clearCurrentFindMatchDecoration();
		this.setAllFindMatchesDecorations([]);
	}


	public async highlightCurrentFindMatchDecorationInCell(cell: ICellViewModel, cellRange: Range): Promise<number | null> {

		this.clearCurrentFindMatchDecoration();

		// match is an editor FindMatch, we update find match decoration in the editor
		// we will highlight the match in the webview
		this._notebookEditor.changeModelDecorations(accessor => {
			const findMatchesOptions: ModelDecorationOptions = FindDecorations._CURRENT_FIND_MATCH_DECORATION;

			const decorations: IModelDeltaDecoration[] = [
				{ range: cellRange, options: findMatchesOptions }
			];
			const deltaDecoration: ICellModelDeltaDecorations = {
				ownerId: cell.handle,
				decorations: decorations
			};

			this._currentMatchDecorations = {
				kind: 'input',
				decorations: accessor.deltaDecorations(this._currentMatchDecorations?.kind === 'input' ? this._currentMatchDecorations.decorations : [], [deltaDecoration])
			};
		});

		this._currentMatchCellDecorations = this._notebookEditor.deltaCellDecorations(this._currentMatchCellDecorations, [{
			handle: cell.handle,
			options: {
				overviewRuler: {
					color: overviewRulerSelectionHighlightForeground,
					modelRanges: [cellRange],
					includeOutput: false,
					position: NotebookOverviewRulerLane.Center
				}
			}
		}]);

		return null;
	}

	public async highlightCurrentFindMatchDecorationInWebview(cell: ICellViewModel, index: number): Promise<number | null> {

		this.clearCurrentFindMatchDecoration();

		const offset = await this._notebookEditor.findHighlightCurrent(index, this.ownerID);
		this._currentMatchDecorations = { kind: 'output', index: index };

		this._currentMatchCellDecorations = this._notebookEditor.deltaCellDecorations(this._currentMatchCellDecorations, [{
			handle: cell.handle,
			options: {
				overviewRuler: {
					color: overviewRulerSelectionHighlightForeground,
					modelRanges: [],
					includeOutput: true,
					position: NotebookOverviewRulerLane.Center
				}
			}
		} satisfies INotebookDeltaDecoration]);

		return offset;
	}

	public clearCurrentFindMatchDecoration() {
		if (this._currentMatchDecorations?.kind === 'input') {
			this._notebookEditor.changeModelDecorations(accessor => {
				accessor.deltaDecorations(this._currentMatchDecorations?.kind === 'input' ? this._currentMatchDecorations.decorations : [], []);
				this._currentMatchDecorations = null;
			});
		} else if (this._currentMatchDecorations?.kind === 'output') {
			this._notebookEditor.findUnHighlightCurrent(this._currentMatchDecorations.index, this.ownerID);
		}

		this._currentMatchCellDecorations = this._notebookEditor.deltaCellDecorations(this._currentMatchCellDecorations, []);
	}

	public setAllFindMatchesDecorations(cellFindMatches: CellFindMatchWithIndex[]) {
		this._notebookEditor.changeModelDecorations((accessor) => {

			const findMatchesOptions: ModelDecorationOptions = FindDecorations._FIND_MATCH_DECORATION;

			const deltaDecorations: ICellModelDeltaDecorations[] = cellFindMatches.map(cellFindMatch => {
				// Find matches
				const newFindMatchesDecorations: IModelDeltaDecoration[] = new Array<IModelDeltaDecoration>(cellFindMatch.contentMatches.length);
				for (let i = 0; i < cellFindMatch.contentMatches.length; i++) {
					newFindMatchesDecorations[i] = {
						range: cellFindMatch.contentMatches[i].range,
						options: findMatchesOptions
					};
				}

				return { ownerId: cellFindMatch.cell.handle, decorations: newFindMatchesDecorations };
			});

			this._allMatchesDecorations = accessor.deltaDecorations(this._allMatchesDecorations, deltaDecorations);
		});

		this._allMatchesCellDecorations = this._notebookEditor.deltaCellDecorations(this._allMatchesCellDecorations, cellFindMatches.map(cellFindMatch => {
			return {
				ownerId: cellFindMatch.cell.handle,
				handle: cellFindMatch.cell.handle,
				options: {
					overviewRuler: {
						color: overviewRulerFindMatchForeground,
						modelRanges: cellFindMatch.contentMatches.map(match => match.range),
						includeOutput: cellFindMatch.webviewMatches.length > 0,
						position: NotebookOverviewRulerLane.Center
					}
				}
			};
		}));
	}

	stopWebviewFind() {
		this._notebookEditor.findStop(this.ownerID);
	}

	override dispose() {
		this.clearDecorations();
		super.dispose();
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/find/findModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/find/findModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { findFirstIdxMonotonousOrArrLen } from '../../../../../../base/common/arraysFind.js';
import { CancelablePromise, createCancelablePromise, Delayer } from '../../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { Disposable, DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { FindMatch } from '../../../../../../editor/common/model.js';
import { PrefixSumComputer } from '../../../../../../editor/common/model/prefixSumComputer.js';
import { FindReplaceState, FindReplaceStateChangedEvent } from '../../../../../../editor/contrib/find/browser/findState.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { NotebookFindFilters } from './findFilters.js';
import { FindMatchDecorationModel } from './findMatchDecorationModel.js';
import { CellEditState, CellFindMatchWithIndex, CellWebviewFindMatch, ICellViewModel, INotebookEditor } from '../../notebookBrowser.js';
import { NotebookViewModel } from '../../viewModel/notebookViewModelImpl.js';
import { NotebookTextModel } from '../../../common/model/notebookTextModel.js';
import { CellKind, INotebookFindOptions, NotebookCellsChangeType } from '../../../common/notebookCommon.js';
import { hasKey } from '../../../../../../base/common/types.js';

export class CellFindMatchModel implements CellFindMatchWithIndex {
	readonly cell: ICellViewModel;
	readonly index: number;
	private _contentMatches: FindMatch[];
	private _webviewMatches: CellWebviewFindMatch[];
	get length() {
		return this._contentMatches.length + this._webviewMatches.length;
	}

	get contentMatches(): FindMatch[] {
		return this._contentMatches;
	}

	get webviewMatches(): CellWebviewFindMatch[] {
		return this._webviewMatches;
	}

	constructor(cell: ICellViewModel, index: number, contentMatches: FindMatch[], webviewMatches: CellWebviewFindMatch[]) {
		this.cell = cell;
		this.index = index;
		this._contentMatches = contentMatches;
		this._webviewMatches = webviewMatches;
	}

	getMatch(index: number) {
		if (index >= this.length) {
			throw new Error('NotebookCellFindMatch: index out of range');
		}

		if (index < this._contentMatches.length) {
			return this._contentMatches[index];
		}

		return this._webviewMatches[index - this._contentMatches.length];
	}
}

export class FindModel extends Disposable {
	private _findMatches: CellFindMatchWithIndex[] = [];
	protected _findMatchesStarts: PrefixSumComputer | null = null;
	private _currentMatch: number = -1;

	private readonly _throttledDelayer: Delayer<void>;
	private _computePromise: CancelablePromise<CellFindMatchWithIndex[] | null> | null = null;
	private readonly _modelDisposable = this._register(new DisposableStore());
	private _findMatchDecorationModel: FindMatchDecorationModel;

	get findMatches() {
		return this._findMatches;
	}

	get currentMatch() {
		return this._currentMatch;
	}

	constructor(
		private readonly _notebookEditor: INotebookEditor,
		private readonly _state: FindReplaceState<NotebookFindFilters>,
		@IConfigurationService private readonly _configurationService: IConfigurationService
	) {
		super();

		this._throttledDelayer = new Delayer(20);
		this._computePromise = null;

		this._register(_state.onFindReplaceStateChange(e => {
			this._updateCellStates(e);

			if (e.searchString || e.isRegex || e.matchCase || e.searchScope || e.wholeWord || (e.isRevealed && this._state.isRevealed) || e.filters || e.isReplaceRevealed) {
				this.research();
			}

			if (e.isRevealed && !this._state.isRevealed) {
				this.clear();
			}
		}));

		this._register(this._notebookEditor.onDidChangeModel(e => {
			this._registerModelListener(e);
		}));

		this._register(this._notebookEditor.onDidChangeCellState(e => {
			if (e.cell.cellKind === CellKind.Markup && e.source.editStateChanged) {
				// research when markdown cell is switching between markdown preview and editing mode.
				this.research();
			}
		}));

		if (this._notebookEditor.hasModel()) {
			this._registerModelListener(this._notebookEditor.textModel);
		}

		this._findMatchDecorationModel = new FindMatchDecorationModel(this._notebookEditor, this._notebookEditor.getId());
	}

	private _updateCellStates(e: FindReplaceStateChangedEvent) {
		if (!this._state.filters?.markupInput || !this._state.filters?.markupPreview || !this._state.filters?.findScope) {
			return;
		}

		// we only update cell state if users are using the hybrid mode (both input and preview are enabled)
		const updateEditingState = () => {
			const viewModel = this._notebookEditor.getViewModel() as NotebookViewModel | undefined;
			if (!viewModel) {
				return;
			}
			// search markup sources first to decide if a markup cell should be in editing mode
			const wordSeparators = this._configurationService.inspect<string>('editor.wordSeparators').value;
			const options: INotebookFindOptions = {
				regex: this._state.isRegex,
				wholeWord: this._state.wholeWord,
				caseSensitive: this._state.matchCase,
				wordSeparators: wordSeparators,
				includeMarkupInput: true,
				includeCodeInput: false,
				includeMarkupPreview: false,
				includeOutput: false,
				findScope: this._state.filters?.findScope,
			};

			const contentMatches = viewModel.find(this._state.searchString, options);
			for (let i = 0; i < viewModel.length; i++) {
				const cell = viewModel.cellAt(i);
				if (cell && cell.cellKind === CellKind.Markup) {
					const foundContentMatch = contentMatches.find(m => m.cell.handle === cell.handle && m.contentMatches.length > 0);
					const targetState = foundContentMatch ? CellEditState.Editing : CellEditState.Preview;
					const currentEditingState = cell.getEditState();

					if (currentEditingState === CellEditState.Editing && cell.editStateSource !== 'find') {
						// it's already in editing mode, we should not update
						continue;
					}
					if (currentEditingState !== targetState) {
						cell.updateEditState(targetState, 'find');
					}
				}
			}
		};


		if (e.isReplaceRevealed && !this._state.isReplaceRevealed) {
			// replace is hidden, we need to switch all markdown cells to preview mode
			const viewModel = this._notebookEditor.getViewModel() as NotebookViewModel | undefined;
			if (!viewModel) {
				return;
			}

			for (let i = 0; i < viewModel.length; i++) {
				const cell = viewModel.cellAt(i);
				if (cell && cell.cellKind === CellKind.Markup) {
					if (cell.getEditState() === CellEditState.Editing && cell.editStateSource === 'find') {
						cell.updateEditState(CellEditState.Preview, 'find');
					}
				}
			}

			return;
		}

		if (e.isReplaceRevealed) {
			updateEditingState();
		} else if ((e.filters || e.isRevealed || e.searchString || e.replaceString) && this._state.isRevealed && this._state.isReplaceRevealed) {
			updateEditingState();
		}
	}

	ensureFindMatches() {
		if (!this._findMatchesStarts) {
			this.set(this._findMatches, true);
		}
	}

	getCurrentMatch() {
		const nextIndex = this._findMatchesStarts!.getIndexOf(this._currentMatch);
		const cell = this._findMatches[nextIndex.index].cell;
		const match = this._findMatches[nextIndex.index].getMatch(nextIndex.remainder);

		return {
			cell,
			match,
			isModelMatch: nextIndex.remainder < this._findMatches[nextIndex.index].contentMatches.length
		};
	}

	refreshCurrentMatch(focus: { cell: ICellViewModel; range: Range }) {
		const findMatchIndex = this.findMatches.findIndex(match => match.cell === focus.cell);

		if (findMatchIndex === -1) {
			return;
		}

		const findMatch = this.findMatches[findMatchIndex];
		const index = findMatch.contentMatches.findIndex(match => match.range.intersectRanges(focus.range) !== null);

		if (index === undefined) {
			return;
		}

		const matchesBefore = findMatchIndex === 0 ? 0 : (this._findMatchesStarts?.getPrefixSum(findMatchIndex - 1) ?? 0);
		this._currentMatch = matchesBefore + index;

		this.highlightCurrentFindMatchDecoration(findMatchIndex, index).then(async offset => {
			await this.revealCellRange(findMatchIndex, index, offset);

			this._state.changeMatchInfo(
				this._currentMatch,
				this._findMatches.reduce((p, c) => p + c.length, 0),
				undefined
			);
		});
	}

	find(option: { previous: boolean } | { index: number }) {
		if (!this.findMatches.length) {
			return;
		}

		// let currCell;
		if (!this._findMatchesStarts) {
			this.set(this._findMatches, true);
			if (hasKey(option, { index: true })) {
				this._currentMatch = option.index;
			}
		} else {
			// const currIndex = this._findMatchesStarts!.getIndexOf(this._currentMatch);
			// currCell = this._findMatches[currIndex.index].cell;
			const totalVal = this._findMatchesStarts.getTotalSum();
			if (hasKey(option, { index: true })) {
				this._currentMatch = option.index;
			}
			else if (this._currentMatch === -1) {
				this._currentMatch = option.previous ? totalVal - 1 : 0;
			} else {
				const nextVal = (this._currentMatch + (option.previous ? -1 : 1) + totalVal) % totalVal;
				this._currentMatch = nextVal;
			}
		}

		const nextIndex = this._findMatchesStarts!.getIndexOf(this._currentMatch);
		// const newFocusedCell = this._findMatches[nextIndex.index].cell;
		this.highlightCurrentFindMatchDecoration(nextIndex.index, nextIndex.remainder).then(async offset => {
			await this.revealCellRange(nextIndex.index, nextIndex.remainder, offset);

			this._state.changeMatchInfo(
				this._currentMatch,
				this._findMatches.reduce((p, c) => p + c.length, 0),
				undefined
			);
		});
	}

	private async revealCellRange(cellIndex: number, matchIndex: number, outputOffset: number | null) {
		const findMatch = this._findMatches[cellIndex];
		if (matchIndex >= findMatch.contentMatches.length) {
			// reveal output range
			this._notebookEditor.focusElement(findMatch.cell);
			const index = this._notebookEditor.getCellIndex(findMatch.cell);
			if (index !== undefined) {
				// const range: ICellRange = { start: index, end: index + 1 };
				this._notebookEditor.revealCellOffsetInCenter(findMatch.cell, outputOffset ?? 0);
			}
		} else {
			const match = findMatch.getMatch(matchIndex) as FindMatch;
			if (findMatch.cell.getEditState() !== CellEditState.Editing) {
				findMatch.cell.updateEditState(CellEditState.Editing, 'find');
			}
			findMatch.cell.isInputCollapsed = false;
			this._notebookEditor.focusElement(findMatch.cell);
			this._notebookEditor.setCellEditorSelection(findMatch.cell, match.range);
			// First ensure the cell is visible in the notebook viewport
			await this._notebookEditor.revealInView(findMatch.cell);
			// Then reveal the specific range within the cell editor
			this._notebookEditor.revealRangeInCenterIfOutsideViewportAsync(findMatch.cell, match.range);
		}
	}

	private _registerModelListener(notebookTextModel?: NotebookTextModel) {
		this._modelDisposable.clear();

		if (notebookTextModel) {
			this._modelDisposable.add(notebookTextModel.onDidChangeContent((e) => {
				if (!e.rawEvents.some(event => event.kind === NotebookCellsChangeType.ChangeCellContent || event.kind === NotebookCellsChangeType.ModelChange)) {
					return;
				}

				this.research();
			}));
		}

		this.research();
	}

	async research() {
		return this._throttledDelayer.trigger(async () => {
			this._state.change({ isSearching: true }, false);
			await this._research();
			this._state.change({ isSearching: false }, false);
		});
	}

	async _research() {
		this._computePromise?.cancel();

		if (!this._state.isRevealed || !this._notebookEditor.hasModel()) {
			this.set([], false);
			return;
		}

		this._computePromise = createCancelablePromise(token => this._compute(token));

		const findMatches = await this._computePromise;
		if (!findMatches) {
			this.set([], false);
			return;
		}

		if (findMatches.length === 0) {
			this.set([], false);
			return;
		}

		const findFirstMatchAfterCellIndex = (cellIndex: number) => {
			const matchAfterSelection = findFirstIdxMonotonousOrArrLen(findMatches.map(match => match.index), index => index >= cellIndex);
			this._updateCurrentMatch(findMatches, this._matchesCountBeforeIndex(findMatches, matchAfterSelection));
		};

		if (this._currentMatch === -1) {
			// no active current match
			if (this._notebookEditor.getLength() === 0) {
				this.set(findMatches, false);
				return;
			} else {
				const focus = this._notebookEditor.getFocus().start;
				findFirstMatchAfterCellIndex(focus);
				this.set(findMatches, false);
				return;
			}
		}

		const oldCurrIndex = this._findMatchesStarts!.getIndexOf(this._currentMatch);
		const oldCurrCell = this._findMatches[oldCurrIndex.index].cell;
		const oldCurrMatchCellIndex = this._notebookEditor.getCellIndex(oldCurrCell);


		if (oldCurrMatchCellIndex < 0) {
			// the cell containing the active match is deleted
			if (this._notebookEditor.getLength() === 0) {
				this.set(findMatches, false);
				return;
			}

			findFirstMatchAfterCellIndex(oldCurrMatchCellIndex);
			return;
		}

		// the cell still exist
		const cell = this._notebookEditor.cellAt(oldCurrMatchCellIndex);
		// we will try restore the active find match in this cell, if it contains any find match

		if (cell.cellKind === CellKind.Markup && cell.getEditState() === CellEditState.Preview) {
			// find first match in this cell or below
			findFirstMatchAfterCellIndex(oldCurrMatchCellIndex);
			return;
		}

		// the cell is a markup cell in editing mode or a code cell, both should have monaco editor rendered

		if (!this._findMatchDecorationModel.currentMatchDecorations) {
			// no current highlight decoration
			findFirstMatchAfterCellIndex(oldCurrMatchCellIndex);
			return;
		}

		// check if there is monaco editor selection and find the first match, otherwise find the first match above current cell
		// this._findMatches[cellIndex].matches[matchIndex].range
		if (this._findMatchDecorationModel.currentMatchDecorations.kind === 'input') {
			const currentMatchDecorationId = this._findMatchDecorationModel.currentMatchDecorations.decorations.find(decoration => decoration.ownerId === cell.handle);

			if (!currentMatchDecorationId) {
				// current match decoration is no longer valid
				findFirstMatchAfterCellIndex(oldCurrMatchCellIndex);
				return;
			}

			const matchAfterSelection = findFirstIdxMonotonousOrArrLen(findMatches, match => match.index >= oldCurrMatchCellIndex) % findMatches.length;
			if (findMatches[matchAfterSelection].index > oldCurrMatchCellIndex) {
				// there is no search result in curr cell anymore, find the nearest one (from top to bottom)
				this._updateCurrentMatch(findMatches, this._matchesCountBeforeIndex(findMatches, matchAfterSelection));
				return;
			} else {
				// there are still some search results in current cell
				let currMatchRangeInEditor = cell.editorAttached && currentMatchDecorationId.decorations[0] ? cell.getCellDecorationRange(currentMatchDecorationId.decorations[0]) : null;

				if (currMatchRangeInEditor === null && oldCurrIndex.remainder < this._findMatches[oldCurrIndex.index].contentMatches.length) {
					currMatchRangeInEditor = (this._findMatches[oldCurrIndex.index].getMatch(oldCurrIndex.remainder) as FindMatch).range;
				}

				if (currMatchRangeInEditor !== null) {
					// we find a range for the previous current match, let's find the nearest one after it (can overlap)
					const cellMatch = findMatches[matchAfterSelection];
					const matchAfterOldSelection = findFirstIdxMonotonousOrArrLen(cellMatch.contentMatches, match => Range.compareRangesUsingStarts((match as FindMatch).range, currMatchRangeInEditor) >= 0);
					this._updateCurrentMatch(findMatches, this._matchesCountBeforeIndex(findMatches, matchAfterSelection) + matchAfterOldSelection);
				} else {
					// no range found, let's fall back to finding the nearest match
					this._updateCurrentMatch(findMatches, this._matchesCountBeforeIndex(findMatches, matchAfterSelection));
					return;
				}
			}
		} else {
			// output now has the highlight
			const matchAfterSelection = findFirstIdxMonotonousOrArrLen(findMatches.map(match => match.index), index => index >= oldCurrMatchCellIndex) % findMatches.length;
			this._updateCurrentMatch(findMatches, this._matchesCountBeforeIndex(findMatches, matchAfterSelection));
		}
	}

	private set(cellFindMatches: CellFindMatchWithIndex[] | null, autoStart: boolean): void {
		if (!cellFindMatches || !cellFindMatches.length) {
			this._findMatches = [];
			this._findMatchDecorationModel.setAllFindMatchesDecorations([]);

			this.constructFindMatchesStarts();
			this._currentMatch = -1;
			this._findMatchDecorationModel.clearCurrentFindMatchDecoration();

			this._state.changeMatchInfo(
				this._currentMatch,
				this._findMatches.reduce((p, c) => p + c.length, 0),
				undefined
			);
			return;
		}

		// all matches
		this._findMatches = cellFindMatches;
		this._findMatchDecorationModel.setAllFindMatchesDecorations(cellFindMatches || []);

		// current match
		this.constructFindMatchesStarts();

		if (autoStart) {
			this._currentMatch = 0;
			this.highlightCurrentFindMatchDecoration(0, 0);
		}

		this._state.changeMatchInfo(
			this._currentMatch,
			this._findMatches.reduce((p, c) => p + c.length, 0),
			undefined
		);
	}

	private async _compute(token: CancellationToken): Promise<CellFindMatchWithIndex[] | null> {
		if (!this._notebookEditor.hasModel()) {
			return null;
		}
		let ret: CellFindMatchWithIndex[] | null = null;
		const val = this._state.searchString;
		const wordSeparators = this._configurationService.inspect<string>('editor.wordSeparators').value;

		const options: INotebookFindOptions = {
			regex: this._state.isRegex,
			wholeWord: this._state.wholeWord,
			caseSensitive: this._state.matchCase,
			wordSeparators: wordSeparators,
			includeMarkupInput: this._state.filters?.markupInput ?? true,
			includeCodeInput: this._state.filters?.codeInput ?? true,
			includeMarkupPreview: !!this._state.filters?.markupPreview,
			includeOutput: !!this._state.filters?.codeOutput,
			findScope: this._state.filters?.findScope,
		};

		ret = await this._notebookEditor.find(val, options, token);

		if (token.isCancellationRequested) {
			return null;
		}

		return ret;
	}

	private _updateCurrentMatch(findMatches: CellFindMatchWithIndex[], currentMatchesPosition: number) {
		this._currentMatch = currentMatchesPosition % findMatches.length;
		this.set(findMatches, false);
		const nextIndex = this._findMatchesStarts!.getIndexOf(this._currentMatch);
		this.highlightCurrentFindMatchDecoration(nextIndex.index, nextIndex.remainder);

		this._state.changeMatchInfo(
			this._currentMatch,
			this._findMatches.reduce((p, c) => p + c.length, 0),
			undefined
		);
	}

	private _matchesCountBeforeIndex(findMatches: CellFindMatchWithIndex[], index: number) {
		let prevMatchesCount = 0;
		for (let i = 0; i < index; i++) {
			prevMatchesCount += findMatches[i].length;
		}

		return prevMatchesCount;
	}

	private constructFindMatchesStarts() {
		if (this._findMatches && this._findMatches.length) {
			const values = new Uint32Array(this._findMatches.length);
			for (let i = 0; i < this._findMatches.length; i++) {
				values[i] = this._findMatches[i].length;
			}

			this._findMatchesStarts = new PrefixSumComputer(values);
		} else {
			this._findMatchesStarts = null;
		}
	}


	private async highlightCurrentFindMatchDecoration(cellIndex: number, matchIndex: number): Promise<number | null> {
		const cell = this._findMatches[cellIndex].cell;
		const match = this._findMatches[cellIndex].getMatch(matchIndex);

		if (matchIndex < this._findMatches[cellIndex].contentMatches.length) {
			return this._findMatchDecorationModel.highlightCurrentFindMatchDecorationInCell(cell, (match as FindMatch).range);
		} else {
			return this._findMatchDecorationModel.highlightCurrentFindMatchDecorationInWebview(cell, (match as CellWebviewFindMatch).index);
		}
	}

	clear() {
		this._computePromise?.cancel();
		this._throttledDelayer.cancel();
		this.set([], false);
	}

	override dispose() {
		this._findMatchDecorationModel.dispose();
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/find/notebookFind.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/find/notebookFind.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/notebookFind.css';
import { KeyCode, KeyMod } from '../../../../../../base/common/keyCodes.js';
import { Schemas } from '../../../../../../base/common/network.js';
import { isEqual } from '../../../../../../base/common/resources.js';
import { URI } from '../../../../../../base/common/uri.js';
import { ICodeEditor } from '../../../../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../../../../editor/browser/services/codeEditorService.js';
import { EditorOption } from '../../../../../../editor/common/config/editorOptions.js';
import { EditorContextKeys } from '../../../../../../editor/common/editorContextKeys.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { FindStartFocusAction, getSelectionSearchString, IFindStartOptions, NextMatchFindAction, PreviousMatchFindAction, StartFindAction, StartFindReplaceAction } from '../../../../../../editor/contrib/find/browser/findController.js';
import { localize2 } from '../../../../../../nls.js';
import { Action2, registerAction2 } from '../../../../../../platform/actions/common/actions.js';

import { ContextKeyExpr } from '../../../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IShowNotebookFindWidgetOptions, NotebookFindContrib } from './notebookFindWidget.js';
import { INotebookCommandContext, NotebookMultiCellAction } from '../../controller/coreActions.js';
import { getNotebookEditorFromEditorPane, INotebookEditor } from '../../notebookBrowser.js';
import { registerNotebookContribution } from '../../notebookEditorExtensions.js';
import { CellUri, NotebookFindScopeType } from '../../../common/notebookCommon.js';
import { INTERACTIVE_WINDOW_IS_ACTIVE_EDITOR, NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_IS_ACTIVE_EDITOR } from '../../../common/notebookContextKeys.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { CONTEXT_FIND_WIDGET_VISIBLE } from '../../../../../../editor/contrib/find/browser/findModel.js';

registerNotebookContribution(NotebookFindContrib.id, NotebookFindContrib);

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.hideFind',
			title: localize2('notebookActions.hideFind', 'Hide Find in Notebook'),
			keybinding: {
				when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, CONTEXT_FIND_WIDGET_VISIBLE),
				primary: KeyCode.Escape,
				weight: KeybindingWeight.EditorContrib + 5
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);

		if (!editor) {
			return;
		}

		const controller = editor.getContribution<NotebookFindContrib>(NotebookFindContrib.id);
		controller.hide();
		editor.focus();
	}
});

registerAction2(class extends NotebookMultiCellAction {
	constructor() {
		super({
			id: 'notebook.find',
			title: localize2('notebookActions.findInNotebook', 'Find in Notebook'),
			keybinding: {
				when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, ContextKeyExpr.or(NOTEBOOK_IS_ACTIVE_EDITOR, INTERACTIVE_WINDOW_IS_ACTIVE_EDITOR), EditorContextKeys.focus.toNegated()),
				primary: KeyCode.KeyF | KeyMod.CtrlCmd,
				weight: KeybindingWeight.WorkbenchContrib
			}
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);

		if (!editor) {
			return;
		}

		const controller = editor.getContribution<NotebookFindContrib>(NotebookFindContrib.id);
		controller.show(undefined, { findScope: { findScopeType: NotebookFindScopeType.None } });
	}
});

function notebookContainsTextModel(uri: URI, textModel: ITextModel) {
	if (textModel.uri.scheme === Schemas.vscodeNotebookCell) {
		const cellUri = CellUri.parse(textModel.uri);
		if (cellUri && isEqual(cellUri.notebook, uri)) {
			return true;
		}
	}

	return false;
}

function getSearchStringOptions(editor: ICodeEditor, opts: IFindStartOptions) {
	// Get the search string result, following the same logic in _start function in 'vs/editor/contrib/find/browser/findController'
	if (opts.seedSearchStringFromSelection === 'single') {
		const selectionSearchString = getSelectionSearchString(editor, opts.seedSearchStringFromSelection, opts.seedSearchStringFromNonEmptySelection);
		if (selectionSearchString) {
			return {
				searchString: selectionSearchString,
				selection: editor.getSelection()
			};
		}
	} else if (opts.seedSearchStringFromSelection === 'multiple' && !opts.updateSearchScope) {
		const selectionSearchString = getSelectionSearchString(editor, opts.seedSearchStringFromSelection);
		if (selectionSearchString) {
			return {
				searchString: selectionSearchString,
				selection: editor.getSelection()
			};
		}
	}

	return undefined;
}

function isNotebookEditorValidForSearch(accessor: ServicesAccessor, editor: INotebookEditor | undefined, codeEditor: ICodeEditor) {
	if (!editor) {
		return false;
	}

	if (!codeEditor.hasModel()) {
		return false;
	}

	if (!editor.hasEditorFocus() && !editor.hasWebviewFocus()) {
		const codeEditorService = accessor.get(ICodeEditorService);
		// check if the active pane contains the active text editor
		const textEditor = codeEditorService.getFocusedCodeEditor() || codeEditorService.getActiveCodeEditor();
		if (editor.hasModel() && textEditor && textEditor.hasModel() && notebookContainsTextModel(editor.textModel.uri, textEditor.getModel())) {
			// the active text editor is in notebook editor
			return true;
		} else {
			return false;
		}
	}
	return true;
}

function openFindWidget(controller: NotebookFindContrib | undefined, editor: INotebookEditor | undefined, codeEditor: ICodeEditor | undefined, focusWidget: boolean = true) {
	if (!editor || !codeEditor || !controller) {
		return false;
	}

	if (!codeEditor.hasModel()) {
		return false;
	}

	const searchStringOptions = getSearchStringOptions(codeEditor, {
		forceRevealReplace: false,
		seedSearchStringFromSelection: codeEditor.getOption(EditorOption.find).seedSearchStringFromSelection !== 'never' ? 'single' : 'none',
		seedSearchStringFromNonEmptySelection: codeEditor.getOption(EditorOption.find).seedSearchStringFromSelection === 'selection',
		seedSearchStringFromGlobalClipboard: codeEditor.getOption(EditorOption.find).globalFindClipboard,
		shouldFocus: FindStartFocusAction.FocusFindInput,
		shouldAnimate: true,
		updateSearchScope: false,
		loop: codeEditor.getOption(EditorOption.find).loop
	});

	let options: IShowNotebookFindWidgetOptions | undefined = undefined;
	const uri = codeEditor.getModel().uri;
	const data = CellUri.parse(uri);
	if (searchStringOptions?.selection && data) {
		const cell = editor.getCellByHandle(data.handle);
		if (cell) {
			options = {
				searchStringSeededFrom: { cell, range: searchStringOptions.selection },
				focus: focusWidget
			};
		}
	} else {
		options = { focus: focusWidget };
	}

	controller.show(searchStringOptions?.searchString, options);
	return true;
}

function findWidgetAction(accessor: ServicesAccessor, codeEditor: ICodeEditor, next: boolean): boolean {
	const editorService = accessor.get(IEditorService);
	const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);

	if (!isNotebookEditorValidForSearch(accessor, editor, codeEditor)) {
		return false;
	}

	const controller = editor?.getContribution<NotebookFindContrib>(NotebookFindContrib.id);
	if (!controller) {
		return false;
	}

	// Check if find widget is already visible
	if (controller.isVisible()) {
		// Find widget is open, navigate
		next ? controller.findNext() : controller.findPrevious();
		return true;
	} else {
		// Find widget is not open, open it without focusing the widget (keep focus in editor)
		return openFindWidget(controller, editor, codeEditor, false);
	}
}

async function runFind(accessor: ServicesAccessor, next: boolean): Promise<void> {
	const editorService = accessor.get(IEditorService);
	const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);

	if (!editor) {
		return;
	}

	const controller = editor.getContribution<NotebookFindContrib>(NotebookFindContrib.id);
	if (controller && controller.isVisible()) {
		next ? controller.findNext() : controller.findPrevious();
	}
}

StartFindAction.addImplementation(100, (accessor: ServicesAccessor, codeEditor: ICodeEditor, args: any) => {
	const editorService = accessor.get(IEditorService);
	const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);

	if (!isNotebookEditorValidForSearch(accessor, editor, codeEditor)) {
		return false;
	}

	const controller = editor?.getContribution<NotebookFindContrib>(NotebookFindContrib.id);
	return openFindWidget(controller, editor, codeEditor, true);
});

StartFindReplaceAction.addImplementation(100, (accessor: ServicesAccessor, codeEditor: ICodeEditor, args: any) => {
	const editorService = accessor.get(IEditorService);
	const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);

	if (!editor) {
		return false;
	}

	if (!codeEditor.hasModel()) {
		return false;
	}

	const controller = editor.getContribution<NotebookFindContrib>(NotebookFindContrib.id);

	const searchStringOptions = getSearchStringOptions(codeEditor, {
		forceRevealReplace: false,
		seedSearchStringFromSelection: codeEditor.getOption(EditorOption.find).seedSearchStringFromSelection !== 'never' ? 'single' : 'none',
		seedSearchStringFromNonEmptySelection: codeEditor.getOption(EditorOption.find).seedSearchStringFromSelection === 'selection',
		seedSearchStringFromGlobalClipboard: codeEditor.getOption(EditorOption.find).globalFindClipboard,
		shouldFocus: FindStartFocusAction.FocusFindInput,
		shouldAnimate: true,
		updateSearchScope: false,
		loop: codeEditor.getOption(EditorOption.find).loop
	});

	if (controller) {
		controller.replace(searchStringOptions?.searchString);
		return true;
	}

	return false;
});

NextMatchFindAction.addImplementation(100, (accessor: ServicesAccessor, codeEditor: ICodeEditor, args: any) => {
	return findWidgetAction(accessor, codeEditor, true);
});

PreviousMatchFindAction.addImplementation(100, (accessor: ServicesAccessor, codeEditor: ICodeEditor, args: any) => {
	return findWidgetAction(accessor, codeEditor, false);
});

// Widget-focused keybindings - these handle F3/Shift+F3 when the notebook find widget has focus
// This follows the same pattern as the text editor which has separate keybindings for widget focus
registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.findNext.fromWidget',
			title: localize2('notebook.findNext.fromWidget', 'Find Next'),
			keybinding: {
				when: ContextKeyExpr.and(
					NOTEBOOK_EDITOR_FOCUSED,
					CONTEXT_FIND_WIDGET_VISIBLE
				),
				primary: KeyCode.F3,
				mac: { primary: KeyMod.CtrlCmd | KeyCode.KeyG, secondary: [KeyCode.F3] },
				weight: KeybindingWeight.WorkbenchContrib + 1
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		return runFind(accessor, true);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.findPrevious.fromWidget',
			title: localize2('notebook.findPrevious.fromWidget', 'Find Previous'),
			keybinding: {
				when: ContextKeyExpr.and(
					NOTEBOOK_EDITOR_FOCUSED,
					CONTEXT_FIND_WIDGET_VISIBLE
				),
				primary: KeyMod.Shift | KeyCode.F3,
				mac: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyG, secondary: [KeyMod.Shift | KeyCode.F3] },
				weight: KeybindingWeight.WorkbenchContrib + 1
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		return runFind(accessor, false);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/find/notebookFindReplaceWidget.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/find/notebookFindReplaceWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .simple-fr-find-part-wrapper {
	overflow: hidden;
	z-index: 10;
	position: absolute;
	top: -45px;
	right: 18px;
	width: var(--notebook-find-width);
	max-width: calc(100% - 28px - 28px - 8px);
	padding: 0 var(--notebook-find-horizontal-padding);
	transition: top 200ms linear;
	visibility: hidden;
	background-color: var(--vscode-editorWidget-background) !important;
	color: var(--vscode-editorWidget-foreground);
	box-shadow: 0 0 8px 2px var(--vscode-widget-shadow);
	border-bottom-left-radius: 4px;
	border-bottom-right-radius: 4px;
}

.monaco-workbench.monaco-reduce-motion .simple-fr-find-part-wrapper {
	transition: top 0ms linear;
}

.monaco-workbench .notebookOverlay .simple-fr-find-part-wrapper.visible {
	z-index: 100;
}

.monaco-workbench .simple-fr-find-part {
	/* visibility: hidden;		Use visibility to maintain flex layout while hidden otherwise interferes with transition */
	z-index: 10;
	position: relative;
	top: 0px;
	display: flex;
	padding: 4px;
	align-items: center;
	pointer-events: all;
	margin: 0 0 0 17px;
}

.monaco-workbench .simple-fr-replace-part {
	/* visibility: hidden;		Use visibility to maintain flex layout while hidden otherwise interferes with transition */
	z-index: 10;
	position: relative;
	top: 0px;
	display: flex;
	padding: 4px;
	align-items: center;
	pointer-events: all;
	margin: 0 0 0 17px;
}

.monaco-workbench .simple-fr-find-part-wrapper .find-replace-progress {
	width: 100%;
	height: 2px;
	position: absolute;
}

.monaco-workbench .simple-fr-find-part-wrapper .find-replace-progress .monaco-progress-container {
	top: 0px !important;
	z-index: 100 !important;
}

.monaco-workbench .simple-fr-find-part-wrapper .monaco-findInput {
	width: 224px;
}

.monaco-workbench .simple-fr-find-part-wrapper .button {
	width: 20px;
	height: 20px;
	flex: initial;
	margin-left: 3px;
	background-position: 50%;
	background-repeat: no-repeat;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
}

.monaco-workbench .simple-fr-find-part-wrapper.visible .simple-fr-find-part {
	visibility: visible;
}

.monaco-workbench .simple-fr-find-part-wrapper .toggle {
	position: absolute;
	top: 0;
	width: 18px;
	height: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 0px;
	pointer-events: all;
}

.monaco-workbench .simple-fr-find-part-wrapper.visible {
	visibility: visible;
}

.monaco-workbench .simple-fr-find-part-wrapper.visible-transition {
	top: 0;
}

.monaco-workbench .simple-fr-find-part .monaco-findInput {
	flex: 1;
}

.monaco-workbench .simple-fr-find-part .button {
	min-width: 20px;
	width: 20px;
	height: 20px;
	display: flex;
	flex: initial;
	margin-left: 3px;
	background-position: center center;
	background-repeat: no-repeat;
	cursor: pointer;
}

.monaco-workbench .simple-fr-find-part-wrapper .button.disabled {
	opacity: 0.3;
	cursor: default;
}

.monaco-workbench .simple-fr-find-part-wrapper .monaco-custom-toggle.disabled {
	opacity: 0.3;
	cursor: default;
	user-select: none;
	-webkit-user-select: none;
	pointer-events: none;
	background-color: inherit !important;
}

.monaco-workbench .simple-fr-find-part-wrapper .find-filter-button {
	color: inherit;
	margin-left: 2px;
	float: left;
	cursor: pointer;
	box-sizing: border-box;
	user-select: none;
	-webkit-user-select: none;
}

.find-filter-button .monaco-action-bar .action-label {
	padding: 0;
}

.monaco-workbench .simple-fr-find-part .monaco-inputbox > .ibwrapper > .input,
.monaco-workbench .simple-fr-replace-part .monaco-inputbox > .ibwrapper > .input {
	height: 24px;
}
.monaco-workbench .simple-fr-find-part-wrapper .monaco-sash {
	left: 0 !important;
	background-color: var(--vscode-editorWidget-resizeBorder, var(--vscode-editorWidget-border));
}
```

--------------------------------------------------------------------------------

````
