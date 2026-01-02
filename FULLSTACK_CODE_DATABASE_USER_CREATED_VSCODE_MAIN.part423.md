---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 423
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 423 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/cellEditorOptions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/cellEditorOptions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../../base/common/event.js';
import { URI } from '../../../../../../base/common/uri.js';
import { IEditorOptions } from '../../../../../../editor/common/config/editorOptions.js';
import { localize, localize2 } from '../../../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../../../platform/configuration/common/configurationRegistry.js';
import { ContextKeyExpr } from '../../../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { Registry } from '../../../../../../platform/registry/common/platform.js';
import { ActiveEditorContext } from '../../../../../common/contextkeys.js';
import { INotebookCellToolbarActionContext, INotebookCommandContext, NotebookMultiCellAction, NOTEBOOK_ACTIONS_CATEGORY } from '../../controller/coreActions.js';
import { IBaseCellEditorOptions, ICellViewModel } from '../../notebookBrowser.js';
import { NOTEBOOK_CELL_LINE_NUMBERS, NOTEBOOK_EDITOR_FOCUSED } from '../../../common/notebookContextKeys.js';
import { CellContentPart } from '../cellPart.js';
import { NotebookCellInternalMetadata, NOTEBOOK_EDITOR_ID } from '../../../common/notebookCommon.js';
import { NotebookOptions } from '../../notebookOptions.js';
import { CellViewModelStateChangeEvent } from '../../notebookViewEvents.js';
import { ITextModelUpdateOptions } from '../../../../../../editor/common/model.js';

//todo@Yoyokrazy implenets is needed or not?
export class CellEditorOptions extends CellContentPart implements ITextModelUpdateOptions {
	private _lineNumbers: 'on' | 'off' | 'inherit' = 'inherit';
	private _tabSize?: number;
	private _indentSize?: number | 'tabSize';
	private _insertSpaces?: boolean;

	set tabSize(value: number | undefined) {
		if (this._tabSize !== value) {
			this._tabSize = value;
			this._onDidChange.fire();
		}
	}

	get tabSize() {
		return this._tabSize;
	}

	set indentSize(value: number | 'tabSize' | undefined) {
		if (this._indentSize !== value) {
			this._indentSize = value;
			this._onDidChange.fire();
		}
	}

	get indentSize() {
		return this._indentSize;
	}

	set insertSpaces(value: boolean | undefined) {
		if (this._insertSpaces !== value) {
			this._insertSpaces = value;
			this._onDidChange.fire();
		}
	}

	get insertSpaces() {
		return this._insertSpaces;
	}

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange: Event<void> = this._onDidChange.event;
	private _value: IEditorOptions;

	constructor(
		private readonly base: IBaseCellEditorOptions,
		readonly notebookOptions: NotebookOptions,
		readonly configurationService: IConfigurationService) {
		super();

		this._register(base.onDidChange(() => {
			this._recomputeOptions();
		}));

		this._value = this._computeEditorOptions();
	}

	override updateState(element: ICellViewModel, e: CellViewModelStateChangeEvent) {
		if (e.cellLineNumberChanged) {
			this.setLineNumbers(element.lineNumbers);
		}
	}

	private _recomputeOptions(): void {
		this._value = this._computeEditorOptions();
		this._onDidChange.fire();
	}

	private _computeEditorOptions() {
		const value = this.base.value; // base IEditorOptions

		// TODO @Yoyokrazy find a different way to get the editor overrides, this is not the right way
		const cellEditorOverridesRaw = this.notebookOptions.getDisplayOptions().editorOptionsCustomizations;
		const indentSize = cellEditorOverridesRaw?.['editor.indentSize'];
		if (indentSize !== undefined) {
			this.indentSize = indentSize;
		}
		const insertSpaces = cellEditorOverridesRaw?.['editor.insertSpaces'];
		if (insertSpaces !== undefined) {
			this.insertSpaces = insertSpaces;
		}
		const tabSize = cellEditorOverridesRaw?.['editor.tabSize'];
		if (tabSize !== undefined) {
			this.tabSize = tabSize;
		}

		let cellRenderLineNumber = value.lineNumbers;

		switch (this._lineNumbers) {
			case 'inherit':
				// inherit from the notebook setting
				if (this.configurationService.getValue<'on' | 'off'>('notebook.lineNumbers') === 'on') {
					if (value.lineNumbers === 'off') {
						cellRenderLineNumber = 'on';
					} // otherwise just use the editor setting
				} else {
					cellRenderLineNumber = 'off';
				}
				break;
			case 'on':
				// should turn on, ignore the editor line numbers off options
				if (value.lineNumbers === 'off') {
					cellRenderLineNumber = 'on';
				} // otherwise just use the editor setting
				break;
			case 'off':
				cellRenderLineNumber = 'off';
				break;
		}

		const overrides: Partial<IEditorOptions> = {};
		if (value.lineNumbers !== cellRenderLineNumber) {
			overrides.lineNumbers = cellRenderLineNumber;
		}

		if (this.notebookOptions.getLayoutConfiguration().disableRulers) {
			overrides.rulers = [];
		}

		return {
			...value,
			...overrides,
		};
	}

	getUpdatedValue(internalMetadata: NotebookCellInternalMetadata, cellUri: URI): IEditorOptions {
		const options = this.getValue(internalMetadata, cellUri);
		delete options.hover; // This is toggled by a debug editor contribution

		return options;
	}

	getValue(internalMetadata: NotebookCellInternalMetadata, cellUri: URI): IEditorOptions {
		return {
			...this._value,
			...{
				padding: this.notebookOptions.computeEditorPadding(internalMetadata, cellUri)
			}
		};
	}

	getDefaultValue(): IEditorOptions {
		return {
			...this._value,
			...{
				padding: { top: 12, bottom: 12 }
			}
		};
	}

	setLineNumbers(lineNumbers: 'on' | 'off' | 'inherit'): void {
		this._lineNumbers = lineNumbers;
		this._recomputeOptions();
	}
}

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	id: 'notebook',
	order: 100,
	type: 'object',
	'properties': {
		'notebook.lineNumbers': {
			type: 'string',
			enum: ['off', 'on'],
			default: 'off',
			markdownDescription: localize('notebook.lineNumbers', "Controls the display of line numbers in the cell editor.")
		}
	}
});

registerAction2(class ToggleLineNumberAction extends Action2 {
	constructor() {
		super({
			id: 'notebook.toggleLineNumbers',
			title: localize2('notebook.toggleLineNumbers', 'Toggle Notebook Line Numbers'),
			precondition: NOTEBOOK_EDITOR_FOCUSED,
			menu: [
				{
					id: MenuId.NotebookToolbar,
					group: 'notebookLayout',
					order: 2,
					when: ContextKeyExpr.equals('config.notebook.globalToolbar', true)
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
		const configurationService = accessor.get(IConfigurationService);
		const renderLiNumbers = configurationService.getValue<'on' | 'off'>('notebook.lineNumbers') === 'on';

		if (renderLiNumbers) {
			configurationService.updateValue('notebook.lineNumbers', 'off');
		} else {
			configurationService.updateValue('notebook.lineNumbers', 'on');
		}
	}
});

registerAction2(class ToggleActiveLineNumberAction extends NotebookMultiCellAction {
	constructor() {
		super({
			id: 'notebook.cell.toggleLineNumbers',
			title: localize('notebook.cell.toggleLineNumbers.title', "Show Cell Line Numbers"),
			precondition: ActiveEditorContext.isEqualTo(NOTEBOOK_EDITOR_ID),
			menu: [{
				id: MenuId.NotebookCellTitle,
				group: 'View',
				order: 1
			}],
			toggled: ContextKeyExpr.or(
				NOTEBOOK_CELL_LINE_NUMBERS.isEqualTo('on'),
				ContextKeyExpr.and(NOTEBOOK_CELL_LINE_NUMBERS.isEqualTo('inherit'), ContextKeyExpr.equals('config.notebook.lineNumbers', 'on'))
			)
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCommandContext | INotebookCellToolbarActionContext): Promise<void> {
		if (context.ui) {
			this.updateCell(accessor.get(IConfigurationService), context.cell);
		} else {
			const configurationService = accessor.get(IConfigurationService);
			context.selectedCells.forEach(cell => {
				this.updateCell(configurationService, cell);
			});
		}
	}

	private updateCell(configurationService: IConfigurationService, cell: ICellViewModel) {
		const renderLineNumbers = configurationService.getValue<'on' | 'off'>('notebook.lineNumbers') === 'on';
		const cellLineNumbers = cell.lineNumbers;
		// 'on', 'inherit' 	-> 'on'
		// 'on', 'off'		-> 'off'
		// 'on', 'on'		-> 'on'
		// 'off', 'inherit'	-> 'off'
		// 'off', 'off'		-> 'off'
		// 'off', 'on'		-> 'on'
		const currentLineNumberIsOn = cellLineNumbers === 'on' || (cellLineNumbers === 'inherit' && renderLineNumbers);

		if (currentLineNumberIsOn) {
			cell.lineNumbers = 'off';
		} else {
			cell.lineNumbers = 'on';
		}

	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/cellExecution.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/cellExecution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import { disposableTimeout } from '../../../../../../base/common/async.js';
import { DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { clamp } from '../../../../../../base/common/numbers.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { ICellViewModel, INotebookEditorDelegate } from '../../notebookBrowser.js';
import { CellContentPart } from '../cellPart.js';
import { CodeCellViewModel } from '../../viewModel/codeCellViewModel.js';
import { NotebookCellInternalMetadata } from '../../../common/notebookCommon.js';
import { INotebookExecutionStateService } from '../../../common/notebookExecutionStateService.js';
import { executingStateIcon } from '../../notebookIcons.js';
import { renderLabelWithIcons } from '../../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { CellViewModelStateChangeEvent } from '../../notebookViewEvents.js';
import { hasKey } from '../../../../../../base/common/types.js';

const UPDATE_EXECUTION_ORDER_GRACE_PERIOD = 200;

export class CellExecutionPart extends CellContentPart {
	private readonly kernelDisposables = this._register(new DisposableStore());
	private readonly _executionOrderContent: HTMLElement;

	constructor(
		private readonly _notebookEditor: INotebookEditorDelegate,
		private readonly _executionOrderLabel: HTMLElement,
		@INotebookExecutionStateService private readonly _notebookExecutionStateService: INotebookExecutionStateService
	) {
		super();

		// Add class to the outer container for styling
		this._executionOrderLabel.classList.add('cell-execution-order');

		// Create nested div for content
		this._executionOrderContent = DOM.append(this._executionOrderLabel, DOM.$('div'));

		// Add a method to watch for cell execution state changes
		this._register(this._notebookExecutionStateService.onDidChangeExecution(e => {
			if (this.currentCell && hasKey(e, { affectsCell: true }) && e.affectsCell(this.currentCell.uri)) {
				this._updatePosition();
			}
		}));

		this._register(this._notebookEditor.onDidChangeActiveKernel(() => {
			if (this.currentCell) {
				this.kernelDisposables.clear();

				if (this._notebookEditor.activeKernel) {
					this.kernelDisposables.add(this._notebookEditor.activeKernel.onDidChange(() => {
						if (this.currentCell) {
							this.updateExecutionOrder(this.currentCell.internalMetadata);
						}
					}));
				}

				this.updateExecutionOrder(this.currentCell.internalMetadata);
			}
		}));

		this._register(this._notebookEditor.onDidScroll(() => {
			this._updatePosition();
		}));
	}

	override didRenderCell(element: ICellViewModel): void {
		this.updateExecutionOrder(element.internalMetadata, true);
	}

	override updateState(element: ICellViewModel, e: CellViewModelStateChangeEvent): void {
		if (e.internalMetadataChanged) {
			this.updateExecutionOrder(element.internalMetadata);
		}
	}

	private updateExecutionOrder(internalMetadata: NotebookCellInternalMetadata, forceClear = false): void {
		if (this._notebookEditor.activeKernel?.implementsExecutionOrder || (!this._notebookEditor.activeKernel && typeof internalMetadata.executionOrder === 'number')) {
			// If the executionOrder was just cleared, and the cell is executing, wait just a bit before clearing the view to avoid flashing
			if (typeof internalMetadata.executionOrder !== 'number' && !forceClear && !!this._notebookExecutionStateService.getCellExecution(this.currentCell!.uri)) {
				const renderingCell = this.currentCell;
				disposableTimeout(() => {
					if (this.currentCell === renderingCell) {
						this.updateExecutionOrder(this.currentCell!.internalMetadata, true);
						this._updatePosition();
					}
				}, UPDATE_EXECUTION_ORDER_GRACE_PERIOD, this.cellDisposables);
				return;
			}

			const executionOrderLabel = typeof internalMetadata.executionOrder === 'number' ?
				`[${internalMetadata.executionOrder}]` :
				'[ ]';
			this._executionOrderContent.innerText = executionOrderLabel;

			// Call _updatePosition to refresh sticky status
			this._updatePosition();
		} else {
			this._executionOrderContent.innerText = '';
		}
	}

	override updateInternalLayoutNow(element: ICellViewModel): void {
		this._updatePosition();
	}

	private _updatePosition() {
		if (!this.currentCell) {
			return;
		}

		if (this.currentCell.isInputCollapsed) {
			DOM.hide(this._executionOrderLabel);
			return;
		}

		// Only show the execution order label when the cell is running
		const cellIsRunning = !!this._notebookExecutionStateService.getCellExecution(this.currentCell.uri);

		// Store sticky state before potentially removing the class
		const wasSticky = this._executionOrderLabel.classList.contains('sticky');

		if (!cellIsRunning) {
			// Keep showing the execution order label but remove sticky class
			this._executionOrderLabel.classList.remove('sticky');

			// If we were sticky and cell stopped running, restore the proper content
			if (wasSticky) {
				const executionOrder = this.currentCell.internalMetadata.executionOrder;
				const executionOrderLabel = typeof executionOrder === 'number' ?
					`[${executionOrder}]` :
					'[ ]';
				this._executionOrderContent.innerText = executionOrderLabel;
			}
		}

		DOM.show(this._executionOrderLabel);
		let top = this.currentCell.layoutInfo.editorHeight - 22 + this.currentCell.layoutInfo.statusBarHeight;

		if (this.currentCell instanceof CodeCellViewModel) {
			const elementTop = this._notebookEditor.getAbsoluteTopOfElement(this.currentCell);
			const editorBottom = elementTop + this.currentCell.layoutInfo.outputContainerOffset;
			const scrollBottom = this._notebookEditor.scrollBottom;
			const lineHeight = 22;

			const statusBarVisible = this.currentCell.layoutInfo.statusBarHeight > 0;

			// Sticky mode: cell is running and editor is not fully visible
			const offset = editorBottom - scrollBottom;
			top -= offset;
			top = clamp(
				top,
				lineHeight + 12, // line height + padding for single line
				this.currentCell.layoutInfo.editorHeight - lineHeight + this.currentCell.layoutInfo.statusBarHeight
			);

			if (scrollBottom <= editorBottom && cellIsRunning) {
				const isAlreadyIcon = this._executionOrderContent.classList.contains('sticky-spinner');
				// Add a class when it's in sticky mode for special styling
				if (!isAlreadyIcon) {
					this._executionOrderLabel.classList.add('sticky-spinner');
					// Only recreate the content if we're newly becoming sticky
					DOM.clearNode(this._executionOrderContent);
					const icon = ThemeIcon.modify(executingStateIcon, 'spin');
					DOM.append(this._executionOrderContent, ...renderLabelWithIcons(`$(${icon.id})`));
				}
				// When already sticky, we don't need to recreate the content
			} else if (!statusBarVisible && cellIsRunning) {
				// Status bar is hidden but cell is running: show execution order label at the bottom of the editor area
				const wasStickyHere = this._executionOrderLabel.classList.contains('sticky');
				this._executionOrderLabel.classList.remove('sticky');
				top = this.currentCell.layoutInfo.editorHeight - lineHeight; // Place at the bottom of the editor
				// Only update content if we were previously sticky or content is not correct
				// eslint-disable-next-line no-restricted-syntax
				const iconIsPresent = this._executionOrderContent.querySelector('.codicon') !== null;
				if (wasStickyHere || iconIsPresent) {
					const executionOrder = this.currentCell.internalMetadata.executionOrder;
					const executionOrderLabel = typeof executionOrder === 'number' ?
						`[${executionOrder}]` :
						'[ ]';
					this._executionOrderContent.innerText = executionOrderLabel;
				}
			} else {
				// Only update if the current state is sticky
				const currentlySticky = this._executionOrderLabel.classList.contains('sticky');
				this._executionOrderLabel.classList.remove('sticky');

				// When transitioning from sticky to non-sticky, restore the proper content
				if (currentlySticky) {
					const executionOrder = this.currentCell.internalMetadata.executionOrder;
					const executionOrderLabel = typeof executionOrder === 'number' ?
						`[${executionOrder}]` :
						'[ ]';
					this._executionOrderContent.innerText = executionOrderLabel;
				}
			}
		}

		this._executionOrderLabel.style.top = `${top}px`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/cellFocus.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/cellFocus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import { INotebookEditor } from '../../notebookBrowser.js';
import { CellContentPart } from '../cellPart.js';
import { CodeCellViewModel } from '../../viewModel/codeCellViewModel.js';

export class CellFocusPart extends CellContentPart {
	constructor(
		containerElement: HTMLElement,
		focusSinkElement: HTMLElement | undefined,
		notebookEditor: INotebookEditor
	) {
		super();

		this._register(DOM.addDisposableListener(containerElement, DOM.EventType.FOCUS, () => {
			if (this.currentCell) {
				notebookEditor.focusElement(this.currentCell);
			}
		}, true));

		if (focusSinkElement) {
			this._register(DOM.addDisposableListener(focusSinkElement, DOM.EventType.FOCUS, () => {
				if (this.currentCell && (this.currentCell as CodeCellViewModel).outputsViewModels.length) {
					notebookEditor.focusNotebookCell(this.currentCell, 'output');
				}
			}));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/cellFocusIndicator.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/cellFocusIndicator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import { FastDomNode } from '../../../../../../base/browser/fastDomNode.js';
import { CodeCellLayoutInfo, ICellViewModel, INotebookEditorDelegate } from '../../notebookBrowser.js';
import { CellContentPart } from '../cellPart.js';
import { CellTitleToolbarPart } from './cellToolbars.js';
import { CodeCellViewModel } from '../../viewModel/codeCellViewModel.js';
import { MarkupCellViewModel } from '../../viewModel/markupCellViewModel.js';
import { CellKind } from '../../../common/notebookCommon.js';

export class CellFocusIndicator extends CellContentPart {
	public codeFocusIndicator: FastDomNode<HTMLElement>;
	public outputFocusIndicator: FastDomNode<HTMLElement>;

	constructor(
		readonly notebookEditor: INotebookEditorDelegate,
		readonly titleToolbar: CellTitleToolbarPart,
		readonly top: FastDomNode<HTMLElement>,
		readonly left: FastDomNode<HTMLElement>,
		readonly right: FastDomNode<HTMLElement>,
		readonly bottom: FastDomNode<HTMLElement>
	) {
		super();

		this.codeFocusIndicator = new FastDomNode(DOM.append(
			this.left.domNode,
			DOM.$(
				'.codeOutput-focus-indicator-container',
				undefined,
				DOM.$('.codeOutput-focus-indicator.code-focus-indicator'))));

		this.outputFocusIndicator = new FastDomNode(DOM.append(
			this.left.domNode,
			DOM.$(
				'.codeOutput-focus-indicator-container',
				undefined,
				DOM.$('.codeOutput-focus-indicator.output-focus-indicator'))));

		this._register(DOM.addDisposableListener(this.codeFocusIndicator.domNode, DOM.EventType.CLICK, () => {
			if (this.currentCell) {
				this.currentCell.isInputCollapsed = !this.currentCell.isInputCollapsed;
			}
		}));
		this._register(DOM.addDisposableListener(this.outputFocusIndicator.domNode, DOM.EventType.CLICK, () => {
			if (this.currentCell) {
				this.currentCell.isOutputCollapsed = !this.currentCell.isOutputCollapsed;
			}
		}));

		this._register(DOM.addDisposableListener(this.left.domNode, DOM.EventType.DBLCLICK, e => {
			if (!this.currentCell || !this.notebookEditor.hasModel()) {
				return;
			}

			if (e.target !== this.left.domNode) {
				// Don't allow dblclick on the codeFocusIndicator/outputFocusIndicator
				return;
			}

			const clickedOnInput = e.offsetY < (this.currentCell.layoutInfo as CodeCellLayoutInfo).outputContainerOffset;
			if (clickedOnInput) {
				this.currentCell.isInputCollapsed = !this.currentCell.isInputCollapsed;
			} else {
				this.currentCell.isOutputCollapsed = !this.currentCell.isOutputCollapsed;
			}
		}));

		this._register(this.titleToolbar.onDidUpdateActions(() => {
			this.updateFocusIndicatorsForTitleMenu();
		}));
	}

	override updateInternalLayoutNow(element: ICellViewModel): void {
		if (element.cellKind === CellKind.Markup) {
			const indicatorPostion = this.notebookEditor.notebookOptions.computeIndicatorPosition(element.layoutInfo.totalHeight, (element as MarkupCellViewModel).layoutInfo.foldHintHeight, this.notebookEditor.textModel?.viewType);
			this.bottom.domNode.style.transform = `translateY(${indicatorPostion.bottomIndicatorTop + 6}px)`;
			this.left.setHeight(indicatorPostion.verticalIndicatorHeight);
			this.right.setHeight(indicatorPostion.verticalIndicatorHeight);
			this.codeFocusIndicator.setHeight(indicatorPostion.verticalIndicatorHeight - this.getIndicatorTopMargin() * 2 - element.layoutInfo.chatHeight);
		} else {
			const cell = element as CodeCellViewModel;
			const layoutInfo = this.notebookEditor.notebookOptions.getLayoutConfiguration();
			const bottomToolbarDimensions = this.notebookEditor.notebookOptions.computeBottomToolbarDimensions(this.notebookEditor.textModel?.viewType);
			const indicatorHeight = cell.layoutInfo.codeIndicatorHeight + cell.layoutInfo.outputIndicatorHeight + cell.layoutInfo.commentHeight;
			this.left.setHeight(indicatorHeight);
			this.right.setHeight(indicatorHeight);
			this.codeFocusIndicator.setHeight(cell.layoutInfo.codeIndicatorHeight);
			this.outputFocusIndicator.setHeight(Math.max(cell.layoutInfo.outputIndicatorHeight - cell.viewContext.notebookOptions.getLayoutConfiguration().focusIndicatorGap, 0));
			this.bottom.domNode.style.transform = `translateY(${cell.layoutInfo.totalHeight - bottomToolbarDimensions.bottomToolbarGap - layoutInfo.cellBottomMargin}px)`;
		}

		this.updateFocusIndicatorsForTitleMenu();
	}

	private updateFocusIndicatorsForTitleMenu(): void {
		const y = (this.currentCell?.layoutInfo.chatHeight ?? 0) + this.getIndicatorTopMargin();
		this.left.domNode.style.transform = `translateY(${y}px)`;
		this.right.domNode.style.transform = `translateY(${y}px)`;
	}

	private getIndicatorTopMargin() {
		const layoutInfo = this.notebookEditor.notebookOptions.getLayoutConfiguration();

		if (this.titleToolbar.hasActions) {
			return layoutInfo.editorToolbarHeight + layoutInfo.cellTopMargin;
		} else {
			return layoutInfo.cellTopMargin;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/cellOutput.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/cellOutput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import { FastDomNode } from '../../../../../../base/browser/fastDomNode.js';
import { renderMarkdown } from '../../../../../../base/browser/markdownRenderer.js';
import { Action } from '../../../../../../base/common/actions.js';
import { IMarkdownString } from '../../../../../../base/common/htmlContent.js';
import { Disposable, DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { MarshalledId } from '../../../../../../base/common/marshallingIds.js';
import * as nls from '../../../../../../nls.js';
import { getActionBarActions } from '../../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { WorkbenchToolBar } from '../../../../../../platform/actions/browser/toolbar.js';
import { IMenuService, MenuId } from '../../../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService } from '../../../../../../platform/opener/common/opener.js';
import { IQuickInputService, IQuickPickItem } from '../../../../../../platform/quickinput/common/quickInput.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { IExtensionsWorkbenchService } from '../../../../extensions/common/extensions.js';
import { ICellOutputViewModel, ICellViewModel, IInsetRenderOutput, INotebookEditorDelegate, JUPYTER_EXTENSION_ID, RenderOutputType } from '../../notebookBrowser.js';
import { mimetypeIcon } from '../../notebookIcons.js';
import { CellContentPart } from '../cellPart.js';
import { CodeCellRenderTemplate } from '../notebookRenderingCommon.js';
import { CodeCellViewModel } from '../../viewModel/codeCellViewModel.js';
import { NotebookTextModel } from '../../../common/model/notebookTextModel.js';
import { CellUri, IOrderedMimeType, NotebookCellExecutionState, NotebookCellOutputsSplice, RENDERER_NOT_AVAILABLE } from '../../../common/notebookCommon.js';
import { isTextStreamMime } from '../../../../../../base/common/mime.js';
import { INotebookExecutionStateService } from '../../../common/notebookExecutionStateService.js';
import { INotebookKernel } from '../../../common/notebookKernelService.js';
import { INotebookService } from '../../../common/notebookService.js';
import { COPY_OUTPUT_COMMAND_ID } from '../../controller/cellOutputActions.js';
import { autorun, observableValue } from '../../../../../../base/common/observable.js';
import { NOTEBOOK_CELL_HAS_HIDDEN_OUTPUTS, NOTEBOOK_CELL_IS_FIRST_OUTPUT, NOTEBOOK_CELL_OUTPUT_MIMETYPE } from '../../../common/notebookContextKeys.js';
import { TEXT_BASED_MIMETYPES } from '../../viewModel/cellOutputTextHelper.js';

interface IMimeTypeRenderer extends IQuickPickItem {
	index: number;
}

interface IRenderResult {
	initRenderIsSynchronous: false;
}

// DOM structure
//
//  #output
//  |
//  |  #output-inner-container
//  |                        |  #cell-output-toolbar
//  |                        |  #output-element
//  |                        |  #output-element
//  |                        |  #output-element
//  |  #output-inner-container
//  |                        |  #cell-output-toolbar
//  |                        |  #output-element
//  |  #output-inner-container
//  |                        |  #cell-output-toolbar
//  |                        |  #output-element
class CellOutputElement extends Disposable {
	private readonly toolbarDisposables = this._register(new DisposableStore());

	innerContainer?: HTMLElement;
	renderedOutputContainer!: HTMLElement;
	renderResult?: IInsetRenderOutput;

	private readonly contextKeyService: IContextKeyService;
	private toolbarAttached = false;

	constructor(
		private notebookEditor: INotebookEditorDelegate,
		private viewCell: CodeCellViewModel,
		private cellOutputContainer: CellOutputContainer,
		private outputContainer: FastDomNode<HTMLElement>,
		readonly output: ICellOutputViewModel,
		@INotebookService private readonly notebookService: INotebookService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IContextKeyService parentContextKeyService: IContextKeyService,
		@IMenuService private readonly menuService: IMenuService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		this.contextKeyService = parentContextKeyService;

		this._register(this.output.model.onDidChangeData(() => {
			this.rerender();
		}));

		this._register(this.output.onDidResetRenderer(() => {
			this.rerender();
		}));
	}

	detach() {
		this.renderedOutputContainer?.remove();

		let count = 0;
		if (this.innerContainer) {
			for (let i = 0; i < this.innerContainer.childNodes.length; i++) {
				if ((this.innerContainer.childNodes[i] as HTMLElement).className === 'rendered-output') {
					count++;
				}

				if (count > 1) {
					break;
				}
			}

			if (count === 0) {
				this.innerContainer.remove();
			}
		}

		this.notebookEditor.removeInset(this.output);
	}

	updateDOMTop(top: number) {
		if (this.innerContainer) {
			this.innerContainer.style.top = `${top}px`;
		}
	}

	rerender() {
		if (
			this.notebookEditor.hasModel() &&
			this.innerContainer &&
			this.renderResult &&
			this.renderResult.type === RenderOutputType.Extension
		) {
			// Output rendered by extension renderer got an update
			const [mimeTypes, pick] = this.output.resolveMimeTypes(this.notebookEditor.textModel, this.notebookEditor.activeKernel?.preloadProvides);
			const pickedMimeType = mimeTypes[pick];
			if (pickedMimeType.mimeType === this.renderResult.mimeType && pickedMimeType.rendererId === this.renderResult.renderer.id) {
				// Same mimetype, same renderer, call the extension renderer to update
				const index = this.viewCell.outputsViewModels.indexOf(this.output);
				this.notebookEditor.updateOutput(this.viewCell, this.renderResult, this.viewCell.getOutputOffset(index));
				return;
			}
		}

		if (!this.innerContainer) {
			// init rendering didn't happen
			const currOutputIndex = this.cellOutputContainer.renderedOutputEntries.findIndex(entry => entry.element === this);
			const previousSibling = currOutputIndex > 0 && !!(this.cellOutputContainer.renderedOutputEntries[currOutputIndex - 1].element.innerContainer?.parentElement)
				? this.cellOutputContainer.renderedOutputEntries[currOutputIndex - 1].element.innerContainer
				: undefined;
			this.render(previousSibling);
		} else {
			// Another mimetype or renderer is picked, we need to clear the current output and re-render
			const nextElement = this.innerContainer.nextElementSibling;
			this.toolbarDisposables.clear();
			const element = this.innerContainer;
			if (element) {
				element.remove();
				this.notebookEditor.removeInset(this.output);
			}

			this.render(nextElement as HTMLElement);
		}

		this._relayoutCell();
	}

	// insert after previousSibling
	private _generateInnerOutputContainer(previousSibling: HTMLElement | undefined, pickedMimeTypeRenderer: IOrderedMimeType) {
		this.innerContainer = DOM.$('.output-inner-container');

		if (previousSibling && previousSibling.nextElementSibling) {
			this.outputContainer.domNode.insertBefore(this.innerContainer, previousSibling.nextElementSibling);
		} else {
			this.outputContainer.domNode.appendChild(this.innerContainer);
		}

		this.innerContainer.setAttribute('output-mime-type', pickedMimeTypeRenderer.mimeType);
		return this.innerContainer;
	}

	render(previousSibling: HTMLElement | undefined): IRenderResult | undefined {
		const index = this.viewCell.outputsViewModels.indexOf(this.output);

		if (this.viewCell.isOutputCollapsed || !this.notebookEditor.hasModel()) {
			this.cellOutputContainer.flagAsStale();
			return undefined;
		}

		const notebookUri = CellUri.parse(this.viewCell.uri)?.notebook;
		if (!notebookUri) {
			return undefined;
		}

		const notebookTextModel = this.notebookEditor.textModel;

		const [mimeTypes, pick] = this.output.resolveMimeTypes(notebookTextModel, this.notebookEditor.activeKernel?.preloadProvides);
		const currentMimeType = mimeTypes[pick];
		if (!mimeTypes.find(mimeType => mimeType.isTrusted) || mimeTypes.length === 0) {
			this.viewCell.updateOutputHeight(index, 0, 'CellOutputElement#noMimeType');
			return undefined;
		}

		const selectedPresentation = mimeTypes[pick];
		let renderer = this.notebookService.getRendererInfo(selectedPresentation.rendererId);
		if (!renderer && selectedPresentation.mimeType.indexOf('text/') > -1) {
			renderer = this.notebookService.getRendererInfo('vscode.builtin-renderer');
		}

		const innerContainer = this._generateInnerOutputContainer(previousSibling, selectedPresentation);
		if (index === 0 || this.output.visible.get()) {
			this._attachToolbar(innerContainer, notebookTextModel, this.notebookEditor.activeKernel, index, currentMimeType, mimeTypes);
		} else {
			this._register(autorun((reader) => {
				const visible = reader.readObservable(this.output.visible);
				if (visible && !this.toolbarAttached) {
					this._attachToolbar(innerContainer, notebookTextModel, this.notebookEditor.activeKernel, index, currentMimeType, mimeTypes);
				} else if (!visible) {
					this.toolbarDisposables.clear();
				}
				this.cellOutputContainer.checkForHiddenOutputs();
			}));
			this.cellOutputContainer.hasHiddenOutputs.set(true, undefined);
		}

		this.renderedOutputContainer = DOM.append(innerContainer, DOM.$('.rendered-output'));


		this.renderResult = renderer
			? { type: RenderOutputType.Extension, renderer, source: this.output, mimeType: selectedPresentation.mimeType }
			: this._renderMissingRenderer(this.output, selectedPresentation.mimeType);

		this.output.pickedMimeType = selectedPresentation;

		if (!this.renderResult) {
			this.viewCell.updateOutputHeight(index, 0, 'CellOutputElement#renderResultUndefined');
			return undefined;
		}

		this.notebookEditor.createOutput(this.viewCell, this.renderResult, this.viewCell.getOutputOffset(index), false);
		innerContainer.classList.add('background');

		return { initRenderIsSynchronous: false };
	}

	private _renderMissingRenderer(viewModel: ICellOutputViewModel, preferredMimeType: string | undefined): IInsetRenderOutput {
		if (!viewModel.model.outputs.length) {
			return this._renderMessage(viewModel, nls.localize('empty', "Cell has no output"));
		}

		if (!preferredMimeType) {
			const mimeTypes = viewModel.model.outputs.map(op => op.mime);
			const mimeTypesMessage = mimeTypes.join(', ');
			return this._renderMessage(viewModel, nls.localize('noRenderer.2', "No renderer could be found for output. It has the following mimetypes: {0}", mimeTypesMessage));
		}

		return this._renderSearchForMimetype(viewModel, preferredMimeType);
	}

	private _renderSearchForMimetype(viewModel: ICellOutputViewModel, mimeType: string): IInsetRenderOutput {
		const query = `@tag:notebookRenderer ${mimeType}`;

		const p = DOM.$('p', undefined, `No renderer could be found for mimetype "${mimeType}", but one might be available on the Marketplace.`);
		const a = DOM.$('a', { href: `command:workbench.extensions.search?%22${query}%22`, class: 'monaco-button monaco-text-button', tabindex: 0, role: 'button', style: 'padding: 8px; text-decoration: none; color: rgb(255, 255, 255); background-color: rgb(14, 99, 156); max-width: 200px;' }, `Search Marketplace`);

		return {
			type: RenderOutputType.Html,
			source: viewModel,
			htmlContent: p.outerHTML + a.outerHTML
		};
	}

	private _renderMessage(viewModel: ICellOutputViewModel, message: string): IInsetRenderOutput {
		const el = DOM.$('p', undefined, message);
		return { type: RenderOutputType.Html, source: viewModel, htmlContent: el.outerHTML };
	}

	private shouldEnableCopy(mimeTypes: readonly IOrderedMimeType[]) {
		if (!mimeTypes.find(mimeType => TEXT_BASED_MIMETYPES.indexOf(mimeType.mimeType) || mimeType.mimeType.startsWith('image/'))) {
			return false;
		}

		if (isTextStreamMime(mimeTypes[0].mimeType)) {
			const cellViewModel = this.output.cellViewModel as ICellViewModel;
			const index = cellViewModel.outputsViewModels.indexOf(this.output);
			if (index > 0) {
				const previousOutput = cellViewModel.model.outputs[index - 1];
				// if the previous output was also a stream, the copy command will be in that output instead
				return !isTextStreamMime(previousOutput.outputs[0].mime);
			}
		}

		return true;
	}

	private async _attachToolbar(outputItemDiv: HTMLElement, notebookTextModel: NotebookTextModel, kernel: INotebookKernel | undefined, index: number, currentMimeType: IOrderedMimeType, mimeTypes: readonly IOrderedMimeType[]) {
		const hasMultipleMimeTypes = mimeTypes.filter(mimeType => mimeType.isTrusted).length > 1;
		const isCopyEnabled = this.shouldEnableCopy(mimeTypes);
		if (index > 0 && !hasMultipleMimeTypes && !isCopyEnabled) {
			// nothing to put in the toolbar
			return;
		}

		if (!this.notebookEditor.hasModel()) {
			return;
		}

		outputItemDiv.style.position = 'relative';
		const mimeTypePicker = DOM.$('.cell-output-toolbar');

		outputItemDiv.appendChild(mimeTypePicker);

		const toolbar = this.toolbarDisposables.add(this.instantiationService.createInstance(WorkbenchToolBar, mimeTypePicker, {
			renderDropdownAsChildElement: false
		}));
		toolbar.context = {
			ui: true,
			cell: this.output.cellViewModel as ICellViewModel,
			outputViewModel: this.output,
			notebookEditor: this.notebookEditor,
			$mid: MarshalledId.NotebookCellActionContext
		};

		// TODO: This could probably be a real registered action, but it has to talk to this output element
		const pickAction = this.toolbarDisposables.add(new Action('notebook.output.pickMimetype', nls.localize('pickMimeType', "Change Presentation"), ThemeIcon.asClassName(mimetypeIcon), undefined,
			async _context => this._pickActiveMimeTypeRenderer(outputItemDiv, notebookTextModel, kernel, this.output)));

		const menuContextKeyService = this.toolbarDisposables.add(this.contextKeyService.createScoped(outputItemDiv));
		const hasHiddenOutputs = NOTEBOOK_CELL_HAS_HIDDEN_OUTPUTS.bindTo(menuContextKeyService);
		const isFirstCellOutput = NOTEBOOK_CELL_IS_FIRST_OUTPUT.bindTo(menuContextKeyService);
		const cellOutputMimetype = NOTEBOOK_CELL_OUTPUT_MIMETYPE.bindTo(menuContextKeyService);
		isFirstCellOutput.set(index === 0);
		cellOutputMimetype.set(currentMimeType.mimeType);
		this.toolbarDisposables.add(autorun((r) => { hasHiddenOutputs.set(this.cellOutputContainer.hasHiddenOutputs.read(r)); }));
		const menu = this.toolbarDisposables.add(this.menuService.createMenu(MenuId.NotebookOutputToolbar, menuContextKeyService));

		const updateMenuToolbar = () => {
			let { secondary } = getActionBarActions(menu!.getActions({ shouldForwardArgs: true }), () => false);
			if (!isCopyEnabled) {
				secondary = secondary.filter((action) => action.id !== COPY_OUTPUT_COMMAND_ID);
			}
			if (hasMultipleMimeTypes) {
				secondary = [pickAction, ...secondary];
			}

			toolbar.setActions([], secondary);
		};
		updateMenuToolbar();
		this.toolbarDisposables.add(menu.onDidChange(updateMenuToolbar));
	}

	private async _pickActiveMimeTypeRenderer(outputItemDiv: HTMLElement, notebookTextModel: NotebookTextModel, kernel: INotebookKernel | undefined, viewModel: ICellOutputViewModel) {
		const [mimeTypes, currIndex] = viewModel.resolveMimeTypes(notebookTextModel, kernel?.preloadProvides);

		const items: IMimeTypeRenderer[] = [];
		const unsupportedItems: IMimeTypeRenderer[] = [];
		mimeTypes.forEach((mimeType, index) => {
			if (mimeType.isTrusted) {
				const arr = mimeType.rendererId === RENDERER_NOT_AVAILABLE ?
					unsupportedItems :
					items;
				arr.push({
					label: mimeType.mimeType,
					id: mimeType.mimeType,
					index: index,
					picked: index === currIndex,
					detail: this._generateRendererInfo(mimeType.rendererId),
					description: index === currIndex ? nls.localize('curruentActiveMimeType', "Currently Active") : undefined
				});
			}
		});

		if (unsupportedItems.some(m => JUPYTER_RENDERER_MIMETYPES.includes(m.id!))) {
			unsupportedItems.push({
				label: nls.localize('installJupyterPrompt', "Install additional renderers from the marketplace"),
				id: 'installRenderers',
				index: mimeTypes.length
			});
		}

		const disposables = new DisposableStore();
		const picker = disposables.add(this.quickInputService.createQuickPick({ useSeparators: true }));
		picker.items = [
			...items,
			{ type: 'separator' },
			...unsupportedItems
		];
		picker.activeItems = items.filter(item => !!item.picked);
		picker.placeholder = items.length !== mimeTypes.length
			? nls.localize('promptChooseMimeTypeInSecure.placeHolder', "Select mimetype to render for current output")
			: nls.localize('promptChooseMimeType.placeHolder', "Select mimetype to render for current output");

		const pick = await new Promise<IMimeTypeRenderer | undefined>(resolve => {
			disposables.add(picker.onDidAccept(() => {
				resolve(picker.selectedItems.length === 1 ? (picker.selectedItems[0] as IMimeTypeRenderer) : undefined);
				disposables.dispose();
			}));
			picker.show();
		});

		if (pick === undefined || pick.index === currIndex) {
			return;
		}

		if (pick.id === 'installRenderers') {
			this._showJupyterExtension();
			return;
		}

		// user chooses another mimetype
		const nextElement = outputItemDiv.nextElementSibling;
		this.toolbarDisposables.clear();
		const element = this.innerContainer;
		if (element) {
			element.remove();
			this.notebookEditor.removeInset(viewModel);
		}

		viewModel.pickedMimeType = mimeTypes[pick.index];
		this.viewCell.updateOutputMinHeight(this.viewCell.layoutInfo.outputTotalHeight);

		const { mimeType, rendererId } = mimeTypes[pick.index];
		this.notebookService.updateMimePreferredRenderer(notebookTextModel.viewType, mimeType, rendererId, mimeTypes.map(m => m.mimeType));
		this.render(nextElement as HTMLElement);
		this._validateFinalOutputHeight(false);
		this._relayoutCell();
	}

	private async _showJupyterExtension() {
		await this.extensionsWorkbenchService.openSearch(`@id:${JUPYTER_EXTENSION_ID}`);
	}

	private _generateRendererInfo(renderId: string): string {
		const renderInfo = this.notebookService.getRendererInfo(renderId);

		if (renderInfo) {
			const displayName = renderInfo.displayName !== '' ? renderInfo.displayName : renderInfo.id;
			return `${displayName} (${renderInfo.extensionId.value})`;
		}

		return nls.localize('unavailableRenderInfo', "renderer not available");
	}

	private _outputHeightTimer: Timeout | null = null;

	private _validateFinalOutputHeight(synchronous: boolean) {
		if (this._outputHeightTimer !== null) {
			clearTimeout(this._outputHeightTimer);
		}

		if (synchronous) {
			this.viewCell.unlockOutputHeight();
		} else {
			this._outputHeightTimer = setTimeout(() => {
				this.viewCell.unlockOutputHeight();
			}, 1000);
		}
	}

	private _relayoutCell() {
		this.notebookEditor.layoutNotebookCell(this.viewCell, this.viewCell.layoutInfo.totalHeight);
	}

	override dispose() {
		if (this._outputHeightTimer) {
			this.viewCell.unlockOutputHeight();
			clearTimeout(this._outputHeightTimer);
		}

		super.dispose();
	}
}

class OutputEntryViewHandler {
	constructor(
		readonly model: ICellOutputViewModel,
		readonly element: CellOutputElement
	) {

	}
}

const enum CellOutputUpdateContext {
	Execution = 1,
	Other = 2
}

export class CellOutputContainer extends CellContentPart {
	private _outputEntries: OutputEntryViewHandler[] = [];
	private _hasStaleOutputs: boolean = false;

	hasHiddenOutputs = observableValue<boolean>('hasHiddenOutputs', false);
	checkForHiddenOutputs() {
		if (this._outputEntries.find(entry => { return !entry.model.visible.get(); })) {
			this.hasHiddenOutputs.set(true, undefined);
		} else {
			this.hasHiddenOutputs.set(false, undefined);
		}
	}

	get renderedOutputEntries() {
		return this._outputEntries;
	}

	constructor(
		private notebookEditor: INotebookEditorDelegate,
		private viewCell: CodeCellViewModel,
		private readonly templateData: CodeCellRenderTemplate,
		private options: { limit: number },
		@IOpenerService private readonly openerService: IOpenerService,
		@INotebookExecutionStateService private readonly _notebookExecutionStateService: INotebookExecutionStateService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();

		this._register(viewCell.onDidStartExecution(() => {
			viewCell.updateOutputMinHeight(viewCell.layoutInfo.outputTotalHeight);
		}));

		this._register(viewCell.onDidStopExecution(() => {
			this._validateFinalOutputHeight(false);
		}));

		this._register(viewCell.onDidChangeOutputs(splice => {
			const executionState = this._notebookExecutionStateService.getCellExecution(viewCell.uri);
			const context = executionState ? CellOutputUpdateContext.Execution : CellOutputUpdateContext.Other;
			this._updateOutputs(splice, context);
		}));

		this._register(viewCell.onDidChangeLayout(() => {
			this.updateInternalLayoutNow(viewCell);
		}));
	}

	override updateInternalLayoutNow(viewCell: CodeCellViewModel) {
		this.templateData.outputContainer.setTop(viewCell.layoutInfo.outputContainerOffset);
		this.templateData.outputShowMoreContainer.setTop(viewCell.layoutInfo.outputShowMoreContainerOffset);

		this._outputEntries.forEach(entry => {
			const index = this.viewCell.outputsViewModels.indexOf(entry.model);
			if (index >= 0) {
				const top = this.viewCell.getOutputOffsetInContainer(index);
				entry.element.updateDOMTop(top);
			}
		});
	}

	render() {
		try {
			this._doRender();
		} finally {
			// TODO@rebornix, this is probably not necessary at all as cell layout change would send the update request.
			this._relayoutCell();
		}
	}

	/**
	 * Notify that an output may have been swapped out without the model getting rendered.
	 */
	flagAsStale() {
		this._hasStaleOutputs = true;
	}

	private _doRender() {
		if (this.viewCell.outputsViewModels.length > 0) {
			if (this.viewCell.layoutInfo.outputTotalHeight !== 0) {
				this.viewCell.updateOutputMinHeight(this.viewCell.layoutInfo.outputTotalHeight);
			}

			DOM.show(this.templateData.outputContainer.domNode);
			for (let index = 0; index < Math.min(this.options.limit, this.viewCell.outputsViewModels.length); index++) {
				const currOutput = this.viewCell.outputsViewModels[index];
				const entry = this.instantiationService.createInstance(CellOutputElement, this.notebookEditor, this.viewCell, this, this.templateData.outputContainer, currOutput);
				this._outputEntries.push(new OutputEntryViewHandler(currOutput, entry));
				entry.render(undefined);
			}

			if (this.viewCell.outputsViewModels.length > this.options.limit) {
				DOM.show(this.templateData.outputShowMoreContainer.domNode);
				this.viewCell.updateOutputShowMoreContainerHeight(46);
			}

			this._validateFinalOutputHeight(false);
		} else {
			// noop
			DOM.hide(this.templateData.outputContainer.domNode);
		}

		this.templateData.outputShowMoreContainer.domNode.innerText = '';
		if (this.viewCell.outputsViewModels.length > this.options.limit) {
			this.templateData.outputShowMoreContainer.domNode.appendChild(this._generateShowMoreElement(this.templateData.templateDisposables));
		} else {
			DOM.hide(this.templateData.outputShowMoreContainer.domNode);
			this.viewCell.updateOutputShowMoreContainerHeight(0);
		}
	}

	viewUpdateShowOutputs(initRendering: boolean): void {
		if (this._hasStaleOutputs) {
			this._hasStaleOutputs = false;
			this._outputEntries.forEach(entry => {
				entry.element.rerender();
			});
		}

		for (let index = 0; index < this._outputEntries.length; index++) {
			const viewHandler = this._outputEntries[index];
			const outputEntry = viewHandler.element;
			if (outputEntry.renderResult) {
				this.notebookEditor.createOutput(this.viewCell, outputEntry.renderResult as IInsetRenderOutput, this.viewCell.getOutputOffset(index), false);
			} else {
				outputEntry.render(undefined);
			}
		}

		this._relayoutCell();
	}

	viewUpdateHideOuputs(): void {
		for (let index = 0; index < this._outputEntries.length; index++) {
			this.notebookEditor.hideInset(this._outputEntries[index].model);
		}
	}

	private _outputHeightTimer: Timeout | null = null;

	private _validateFinalOutputHeight(synchronous: boolean) {
		if (this._outputHeightTimer !== null) {
			clearTimeout(this._outputHeightTimer);
		}

		const executionState = this._notebookExecutionStateService.getCellExecution(this.viewCell.uri);

		if (synchronous) {
			this.viewCell.unlockOutputHeight();
		} else if (executionState?.state !== NotebookCellExecutionState.Executing) {
			this._outputHeightTimer = setTimeout(() => {
				this.viewCell.unlockOutputHeight();
			}, 200);
		}
	}

	private _updateOutputs(splice: NotebookCellOutputsSplice, context: CellOutputUpdateContext = CellOutputUpdateContext.Other) {
		const previousOutputHeight = this.viewCell.layoutInfo.outputTotalHeight;

		// for cell output update, we make sure the cell does not shrink before the new outputs are rendered.
		this.viewCell.updateOutputMinHeight(previousOutputHeight);

		if (this.viewCell.outputsViewModels.length) {
			DOM.show(this.templateData.outputContainer.domNode);
		} else {
			DOM.hide(this.templateData.outputContainer.domNode);
		}

		this.viewCell.spliceOutputHeights(splice.start, splice.deleteCount, splice.newOutputs.map(_ => 0));
		this._renderNow(splice, context);
	}

	private _renderNow(splice: NotebookCellOutputsSplice, context: CellOutputUpdateContext) {
		if (splice.start >= this.options.limit) {
			// splice items out of limit
			return;
		}

		const firstGroupEntries = this._outputEntries.slice(0, splice.start);
		const deletedEntries = this._outputEntries.slice(splice.start, splice.start + splice.deleteCount);
		const secondGroupEntries = this._outputEntries.slice(splice.start + splice.deleteCount);
		let newlyInserted = this.viewCell.outputsViewModels.slice(splice.start, splice.start + splice.newOutputs.length);

		// [...firstGroup, ...deletedEntries, ...secondGroupEntries]  [...restInModel]
		// [...firstGroup, ...newlyInserted, ...secondGroupEntries, restInModel]
		if (firstGroupEntries.length + newlyInserted.length + secondGroupEntries.length > this.options.limit) {
			// exceeds limit again
			if (firstGroupEntries.length + newlyInserted.length > this.options.limit) {
				[...deletedEntries, ...secondGroupEntries].forEach(entry => {
					entry.element.detach();
					entry.element.dispose();
				});

				newlyInserted = newlyInserted.slice(0, this.options.limit - firstGroupEntries.length);
				const newlyInsertedEntries = newlyInserted.map(insert => {
					return new OutputEntryViewHandler(insert, this.instantiationService.createInstance(CellOutputElement, this.notebookEditor, this.viewCell, this, this.templateData.outputContainer, insert));
				});

				this._outputEntries = [...firstGroupEntries, ...newlyInsertedEntries];

				// render newly inserted outputs
				for (let i = firstGroupEntries.length; i < this._outputEntries.length; i++) {
					this._outputEntries[i].element.render(undefined);
				}
			} else {
				// part of secondGroupEntries are pushed out of view
				// now we have to be creative as secondGroupEntries might not use dedicated containers
				const elementsPushedOutOfView = secondGroupEntries.slice(this.options.limit - firstGroupEntries.length - newlyInserted.length);
				[...deletedEntries, ...elementsPushedOutOfView].forEach(entry => {
					entry.element.detach();
					entry.element.dispose();
				});

				// exclusive
				const reRenderRightBoundary = firstGroupEntries.length + newlyInserted.length;

				const newlyInsertedEntries = newlyInserted.map(insert => {
					return new OutputEntryViewHandler(insert, this.instantiationService.createInstance(CellOutputElement, this.notebookEditor, this.viewCell, this, this.templateData.outputContainer, insert));
				});

				this._outputEntries = [...firstGroupEntries, ...newlyInsertedEntries, ...secondGroupEntries.slice(0, this.options.limit - firstGroupEntries.length - newlyInserted.length)];

				for (let i = firstGroupEntries.length; i < reRenderRightBoundary; i++) {
					const previousSibling = i - 1 >= 0 && this._outputEntries[i - 1] && !!(this._outputEntries[i - 1].element.innerContainer?.parentElement) ? this._outputEntries[i - 1].element.innerContainer : undefined;
					this._outputEntries[i].element.render(previousSibling);
				}
			}
		} else {
			// after splice, it doesn't exceed
			deletedEntries.forEach(entry => {
				entry.element.detach();
				entry.element.dispose();
			});

			const reRenderRightBoundary = firstGroupEntries.length + newlyInserted.length;

			const newlyInsertedEntries = newlyInserted.map(insert => {
				return new OutputEntryViewHandler(insert, this.instantiationService.createInstance(CellOutputElement, this.notebookEditor, this.viewCell, this, this.templateData.outputContainer, insert));
			});

			let outputsNewlyAvailable: OutputEntryViewHandler[] = [];

			if (firstGroupEntries.length + newlyInsertedEntries.length + secondGroupEntries.length < this.viewCell.outputsViewModels.length) {
				const last = Math.min(this.options.limit, this.viewCell.outputsViewModels.length);
				outputsNewlyAvailable = this.viewCell.outputsViewModels.slice(firstGroupEntries.length + newlyInsertedEntries.length + secondGroupEntries.length, last).map(output => {
					return new OutputEntryViewHandler(output, this.instantiationService.createInstance(CellOutputElement, this.notebookEditor, this.viewCell, this, this.templateData.outputContainer, output));
				});
			}

			this._outputEntries = [...firstGroupEntries, ...newlyInsertedEntries, ...secondGroupEntries, ...outputsNewlyAvailable];

			for (let i = firstGroupEntries.length; i < reRenderRightBoundary; i++) {
				const previousSibling = i - 1 >= 0 && this._outputEntries[i - 1] && !!(this._outputEntries[i - 1].element.innerContainer?.parentElement) ? this._outputEntries[i - 1].element.innerContainer : undefined;
				this._outputEntries[i].element.render(previousSibling);
			}

			for (let i = 0; i < outputsNewlyAvailable.length; i++) {
				this._outputEntries[firstGroupEntries.length + newlyInserted.length + secondGroupEntries.length + i].element.render(undefined);
			}
		}

		if (this.viewCell.outputsViewModels.length > this.options.limit) {
			DOM.show(this.templateData.outputShowMoreContainer.domNode);
			if (!this.templateData.outputShowMoreContainer.domNode.hasChildNodes()) {
				this.templateData.outputShowMoreContainer.domNode.appendChild(this._generateShowMoreElement(this.templateData.templateDisposables));
			}
			this.viewCell.updateOutputShowMoreContainerHeight(46);
		} else {
			DOM.hide(this.templateData.outputShowMoreContainer.domNode);
		}

		this._relayoutCell();
		// if it's clearing all outputs, or outputs are all rendered synchronously
		// shrink immediately as the final output height will be zero.
		// if it's rerun, then the output clearing might be temporary, so we don't shrink immediately
		this._validateFinalOutputHeight(context === CellOutputUpdateContext.Other && this.viewCell.outputsViewModels.length === 0);
	}

	private _generateShowMoreElement(disposables: DisposableStore): HTMLElement {
		const md: IMarkdownString = {
			value: `There are more than ${this.options.limit} outputs, [show more (open the raw output data in a text editor) ...](command:workbench.action.openLargeOutput)`,
			isTrusted: true,
			supportThemeIcons: true
		};

		const rendered = disposables.add(renderMarkdown(md, {
			actionHandler: (content) => {
				if (content === 'command:workbench.action.openLargeOutput') {
					this.openerService.open(CellUri.generateCellOutputUriWithId(this.notebookEditor.textModel!.uri));
				}
			},
		}));

		rendered.element.classList.add('output-show-more');
		return rendered.element;
	}

	private _relayoutCell() {
		this.notebookEditor.layoutNotebookCell(this.viewCell, this.viewCell.layoutInfo.totalHeight);
	}

	override dispose() {
		this.viewCell.updateOutputMinHeight(0);

		if (this._outputHeightTimer) {
			clearTimeout(this._outputHeightTimer);
		}

		this._outputEntries.forEach(entry => {
			entry.element.dispose();
		});

		super.dispose();
	}
}

const JUPYTER_RENDERER_MIMETYPES = [
	'application/geo+json',
	'application/vdom.v1+json',
	'application/vnd.dataresource+json',
	'application/vnd.plotly.v1+json',
	'application/vnd.vega.v2+json',
	'application/vnd.vega.v3+json',
	'application/vnd.vega.v4+json',
	'application/vnd.vega.v5+json',
	'application/vnd.vegalite.v1+json',
	'application/vnd.vegalite.v2+json',
	'application/vnd.vegalite.v3+json',
	'application/vnd.vegalite.v4+json',
	'application/x-nteract-model-debug+json',
	'image/svg+xml',
	'text/latex',
	'text/vnd.plotly.v1+html',
	'application/vnd.jupyter.widget-view+json',
	'application/vnd.code.notebook.error'
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/cellProgressBar.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/cellProgressBar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ProgressBar } from '../../../../../../base/browser/ui/progressbar/progressbar.js';
import { defaultProgressBarStyles } from '../../../../../../platform/theme/browser/defaultStyles.js';
import { ICellViewModel } from '../../notebookBrowser.js';
import { CellViewModelStateChangeEvent } from '../../notebookViewEvents.js';
import { CellContentPart } from '../cellPart.js';
import { NotebookCellExecutionState } from '../../../common/notebookCommon.js';
import { ICellExecutionStateChangedEvent, INotebookExecutionStateService } from '../../../common/notebookExecutionStateService.js';

export class CellProgressBar extends CellContentPart {
	private readonly _progressBar: ProgressBar;
	private readonly _collapsedProgressBar: ProgressBar;

	constructor(
		editorContainer: HTMLElement,
		collapsedInputContainer: HTMLElement,
		@INotebookExecutionStateService private readonly _notebookExecutionStateService: INotebookExecutionStateService) {
		super();

		this._progressBar = this._register(new ProgressBar(editorContainer, defaultProgressBarStyles));
		this._progressBar.hide();

		this._collapsedProgressBar = this._register(new ProgressBar(collapsedInputContainer, defaultProgressBarStyles));
		this._collapsedProgressBar.hide();
	}

	override didRenderCell(element: ICellViewModel): void {
		this._updateForExecutionState(element);
	}

	override updateForExecutionState(element: ICellViewModel, e: ICellExecutionStateChangedEvent): void {
		this._updateForExecutionState(element, e);
	}

	override updateState(element: ICellViewModel, e: CellViewModelStateChangeEvent): void {
		if (e.metadataChanged || e.internalMetadataChanged) {
			this._updateForExecutionState(element);
		}

		if (e.inputCollapsedChanged) {
			const exeState = this._notebookExecutionStateService.getCellExecution(element.uri);
			if (element.isInputCollapsed) {
				this._progressBar.hide();
				if (exeState?.state === NotebookCellExecutionState.Executing) {
					this._updateForExecutionState(element);
				}
			} else {
				this._collapsedProgressBar.hide();
				if (exeState?.state === NotebookCellExecutionState.Executing) {
					this._updateForExecutionState(element);
				}
			}
		}
	}

	private _updateForExecutionState(element: ICellViewModel, e?: ICellExecutionStateChangedEvent): void {
		const exeState = e?.changed ?? this._notebookExecutionStateService.getCellExecution(element.uri);
		const progressBar = element.isInputCollapsed ? this._collapsedProgressBar : this._progressBar;
		if (exeState?.state === NotebookCellExecutionState.Executing && (!exeState.didPause || element.isInputCollapsed)) {
			showProgressBar(progressBar);
		} else {
			progressBar.hide();
		}
	}
}

function showProgressBar(progressBar: ProgressBar): void {
	progressBar.infinite().show(500);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/cellStatusPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/cellStatusPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../../../../base/browser/keyboardEvent.js';
import { SimpleIconLabel } from '../../../../../../base/browser/ui/iconLabel/simpleIconLabel.js';
import { WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../../../../base/common/actions.js';
import { toErrorMessage } from '../../../../../../base/common/errorMessage.js';
import { Emitter, Event } from '../../../../../../base/common/event.js';
import { stripIcons } from '../../../../../../base/common/iconLabels.js';
import { KeyCode } from '../../../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore, dispose } from '../../../../../../base/common/lifecycle.js';
import { MarshalledId } from '../../../../../../base/common/marshallingIds.js';
import { ICodeEditor } from '../../../../../../editor/browser/editorBrowser.js';
import { isThemeColor } from '../../../../../../editor/common/editorCommon.js';
import { ICommandService } from '../../../../../../platform/commands/common/commands.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { INotificationService } from '../../../../../../platform/notification/common/notification.js';
import { ITelemetryService } from '../../../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../../../platform/theme/common/themeService.js';
import { ThemeColor } from '../../../../../../base/common/themables.js';
import { INotebookCellActionContext } from '../../controller/coreActions.js';
import { CellFocusMode, ICellViewModel, INotebookEditorDelegate } from '../../notebookBrowser.js';
import { CellContentPart } from '../cellPart.js';
import { ClickTargetType, IClickTarget } from './cellWidgets.js';
import { CodeCellViewModel } from '../../viewModel/codeCellViewModel.js';
import { CellStatusbarAlignment, INotebookCellStatusBarItem } from '../../../common/notebookCommon.js';
import { IHoverDelegate, IHoverDelegateOptions } from '../../../../../../base/browser/ui/hover/hoverDelegate.js';
import { IHoverService } from '../../../../../../platform/hover/browser/hover.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { HoverPosition } from '../../../../../../base/browser/ui/hover/hoverWidget.js';
import type { IManagedHoverTooltipMarkdownString } from '../../../../../../base/browser/ui/hover/hover.js';

const $ = DOM.$;


export class CellEditorStatusBar extends CellContentPart {
	readonly statusBarContainer: HTMLElement;

	private readonly leftItemsContainer: HTMLElement;
	private readonly rightItemsContainer: HTMLElement;
	private readonly itemsDisposable: DisposableStore;

	private leftItems: CellStatusBarItem[] = [];
	private rightItems: CellStatusBarItem[] = [];
	private width: number = 0;

	private currentContext: INotebookCellActionContext | undefined;
	protected readonly _onDidClick: Emitter<IClickTarget> = this._register(new Emitter<IClickTarget>());
	readonly onDidClick: Event<IClickTarget> = this._onDidClick.event;

	private readonly hoverDelegate: IHoverDelegate;

	constructor(
		private readonly _notebookEditor: INotebookEditorDelegate,
		private readonly _cellContainer: HTMLElement,
		editorPart: HTMLElement,
		private readonly _editor: ICodeEditor | undefined,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IHoverService hoverService: IHoverService,
		@IConfigurationService configurationService: IConfigurationService,
		@IThemeService private readonly _themeService: IThemeService,
	) {
		super();
		this.statusBarContainer = DOM.append(editorPart, $('.cell-statusbar-container'));
		this.statusBarContainer.tabIndex = -1;
		const leftItemsContainer = DOM.append(this.statusBarContainer, $('.cell-status-left'));
		const rightItemsContainer = DOM.append(this.statusBarContainer, $('.cell-status-right'));
		this.leftItemsContainer = DOM.append(leftItemsContainer, $('.cell-contributed-items.cell-contributed-items-left'));
		this.rightItemsContainer = DOM.append(rightItemsContainer, $('.cell-contributed-items.cell-contributed-items-right'));

		this.itemsDisposable = this._register(new DisposableStore());

		this.hoverDelegate = new class implements IHoverDelegate {
			private _lastHoverHideTime: number = 0;

			readonly showHover = (options: IHoverDelegateOptions) => {
				options.position = options.position ?? {};
				options.position.hoverPosition = HoverPosition.ABOVE;
				return hoverService.showInstantHover(options);
			};

			readonly placement = 'element';

			get delay(): number {
				return Date.now() - this._lastHoverHideTime < 200
					? 0  // show instantly when a hover was recently shown
					: configurationService.getValue<number>('workbench.hover.delay');
			}

			onDidHideHover() {
				this._lastHoverHideTime = Date.now();
			}
		};

		this._register(this._themeService.onDidColorThemeChange(() => this.currentContext && this.updateContext(this.currentContext)));

		this._register(DOM.addDisposableListener(this.statusBarContainer, DOM.EventType.CLICK, e => {
			if (e.target === leftItemsContainer || e.target === rightItemsContainer || e.target === this.statusBarContainer) {
				// hit on empty space
				this._onDidClick.fire({
					type: ClickTargetType.Container,
					event: e
				});
			} else {
				const target = e.target;
				let itemHasCommand = false;
				if (target && DOM.isHTMLElement(target)) {
					const targetElement = <HTMLElement>target;
					if (targetElement.classList.contains('cell-status-item-has-command')) {
						itemHasCommand = true;
					} else if (targetElement.parentElement && targetElement.parentElement.classList.contains('cell-status-item-has-command')) {
						itemHasCommand = true;
					}
				}
				if (itemHasCommand) {
					this._onDidClick.fire({
						type: ClickTargetType.ContributedCommandItem,
						event: e
					});
				} else {
					// text
					this._onDidClick.fire({
						type: ClickTargetType.ContributedTextItem,
						event: e
					});
				}
			}
		}));
	}


	override didRenderCell(element: ICellViewModel): void {
		if (this._notebookEditor.hasModel()) {
			const context: (INotebookCellActionContext & { $mid: number }) = {
				ui: true,
				cell: element,
				notebookEditor: this._notebookEditor,
				$mid: MarshalledId.NotebookCellActionContext
			};
			this.updateContext(context);
		}

		if (this._editor) {
			// Focus Mode
			const updateFocusModeForEditorEvent = () => {
				if (this._editor && (this._editor.hasWidgetFocus() || (this.statusBarContainer.ownerDocument.activeElement && this.statusBarContainer.contains(this.statusBarContainer.ownerDocument.activeElement)))) {
					element.focusMode = CellFocusMode.Editor;
				} else {
					const currentMode = element.focusMode;
					if (currentMode === CellFocusMode.ChatInput) {
						element.focusMode = CellFocusMode.ChatInput;
					} else if (currentMode === CellFocusMode.Output && this._notebookEditor.hasWebviewFocus()) {
						element.focusMode = CellFocusMode.Output;
					} else {
						element.focusMode = CellFocusMode.Container;
					}
				}
			};

			this.cellDisposables.add(this._editor.onDidFocusEditorWidget(() => {
				updateFocusModeForEditorEvent();
			}));
			this.cellDisposables.add(this._editor.onDidBlurEditorWidget(() => {
				// this is for a special case:
				// users click the status bar empty space, which we will then focus the editor
				// so we don't want to update the focus state too eagerly, it will be updated with onDidFocusEditorWidget
				if (
					this._notebookEditor.hasEditorFocus() &&
					!(this.statusBarContainer.ownerDocument.activeElement && this.statusBarContainer.contains(this.statusBarContainer.ownerDocument.activeElement))) {
					updateFocusModeForEditorEvent();
				}
			}));

			// Mouse click handlers
			this.cellDisposables.add(this.onDidClick(e => {
				if (this.currentCell instanceof CodeCellViewModel && e.type !== ClickTargetType.ContributedCommandItem && this._editor) {
					const target = this._editor.getTargetAtClientPoint(e.event.clientX, e.event.clientY - this._notebookEditor.notebookOptions.computeEditorStatusbarHeight(this.currentCell.internalMetadata, this.currentCell.uri));
					if (target?.position) {
						this._editor.setPosition(target.position);
						this._editor.focus();
					}
				}
			}));
		}
	}

	override updateInternalLayoutNow(element: ICellViewModel): void {
		// todo@rebornix layer breaker
		this._cellContainer.classList.toggle('cell-statusbar-hidden', this._notebookEditor.notebookOptions.computeEditorStatusbarHeight(element.internalMetadata, element.uri) === 0);

		const layoutInfo = element.layoutInfo;
		const width = layoutInfo.editorWidth;
		if (!width) {
			return;
		}

		this.width = width;
		this.statusBarContainer.style.width = `${width}px`;

		const maxItemWidth = this.getMaxItemWidth();
		this.leftItems.forEach(item => item.maxWidth = maxItemWidth);
		this.rightItems.forEach(item => item.maxWidth = maxItemWidth);
	}

	private getMaxItemWidth() {
		return this.width / 2;
	}

	updateContext(context: INotebookCellActionContext) {
		this.currentContext = context;
		this.itemsDisposable.clear();

		if (!this.currentContext) {
			return;
		}

		this.itemsDisposable.add(this.currentContext.cell.onDidChangeLayout(() => {
			if (this.currentContext) {
				this.updateInternalLayoutNow(this.currentContext.cell);
			}
		}));
		this.itemsDisposable.add(this.currentContext.cell.onDidChangeCellStatusBarItems(() => this.updateRenderedItems()));
		this.itemsDisposable.add(this.currentContext.notebookEditor.onDidChangeActiveCell(() => this.updateActiveCell()));
		this.updateInternalLayoutNow(this.currentContext.cell);
		this.updateActiveCell();
		this.updateRenderedItems();
	}

	private updateActiveCell(): void {
		const isActiveCell = this.currentContext!.notebookEditor.getActiveCell() === this.currentContext?.cell;
		this.statusBarContainer.classList.toggle('is-active-cell', isActiveCell);
	}

	private updateRenderedItems(): void {
		const items = this.currentContext!.cell.getCellStatusBarItems();
		items.sort((itemA, itemB) => {
			return (itemB.priority ?? 0) - (itemA.priority ?? 0);
		});

		const maxItemWidth = this.getMaxItemWidth();
		const newLeftItems = items.filter(item => item.alignment === CellStatusbarAlignment.Left);
		const newRightItems = items.filter(item => item.alignment === CellStatusbarAlignment.Right).reverse();

		const updateItems = (renderedItems: CellStatusBarItem[], newItems: INotebookCellStatusBarItem[], container: HTMLElement) => {
			if (renderedItems.length > newItems.length) {
				const deleted = renderedItems.splice(newItems.length, renderedItems.length - newItems.length);
				for (const deletedItem of deleted) {
					deletedItem.container.remove();
					deletedItem.dispose();
				}
			}

			newItems.forEach((newLeftItem, i) => {
				const existingItem = renderedItems[i];
				if (existingItem) {
					existingItem.updateItem(newLeftItem, maxItemWidth);
				} else {
					const item = this._instantiationService.createInstance(CellStatusBarItem, this.currentContext!, this.hoverDelegate, this._editor, newLeftItem, maxItemWidth);
					renderedItems.push(item);
					container.appendChild(item.container);
				}
			});
		};

		updateItems(this.leftItems, newLeftItems, this.leftItemsContainer);
		updateItems(this.rightItems, newRightItems, this.rightItemsContainer);
	}

	override dispose() {
		super.dispose();
		dispose(this.leftItems);
		dispose(this.rightItems);
	}
}

class CellStatusBarItem extends Disposable {

	readonly container = $('.cell-status-item');

	set maxWidth(v: number) {
		this.container.style.maxWidth = v + 'px';
	}

	private _currentItem!: INotebookCellStatusBarItem;
	private readonly _itemDisposables = this._register(new DisposableStore());

	constructor(
		private readonly _context: INotebookCellActionContext,
		private readonly _hoverDelegate: IHoverDelegate,
		private readonly _editor: ICodeEditor | undefined,
		itemModel: INotebookCellStatusBarItem,
		maxWidth: number | undefined,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ICommandService private readonly _commandService: ICommandService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IThemeService private readonly _themeService: IThemeService,
		@IHoverService private readonly _hoverService: IHoverService,
	) {
		super();

		this.updateItem(itemModel, maxWidth);
	}

	updateItem(item: INotebookCellStatusBarItem, maxWidth: number | undefined) {
		this._itemDisposables.clear();

		if (!this._currentItem || this._currentItem.text !== item.text) {
			this._itemDisposables.add(new SimpleIconLabel(this.container)).text = item.text.replace(/\n/g, ' ');
		}

		const resolveColor = (color: ThemeColor | string) => {
			return isThemeColor(color) ?
				(this._themeService.getColorTheme().getColor(color.id)?.toString() || '') :
				color;
		};

		this.container.style.color = item.color ? resolveColor(item.color) : '';
		this.container.style.backgroundColor = item.backgroundColor ? resolveColor(item.backgroundColor) : '';
		this.container.style.opacity = item.opacity ? item.opacity : '';

		this.container.classList.toggle('cell-status-item-show-when-active', !!item.onlyShowWhenActive);

		if (typeof maxWidth === 'number') {
			this.maxWidth = maxWidth;
		}

		let ariaLabel: string;
		let role: string | undefined;
		if (item.accessibilityInformation) {
			ariaLabel = item.accessibilityInformation.label;
			role = item.accessibilityInformation.role;
		} else {
			ariaLabel = item.text ? stripIcons(item.text).trim() : '';
		}

		this.container.setAttribute('aria-label', ariaLabel);
		this.container.setAttribute('role', role || '');

		if (item.tooltip) {
			const hoverContent = typeof item.tooltip === 'string' ? item.tooltip : { markdown: item.tooltip, markdownNotSupportedFallback: undefined } satisfies IManagedHoverTooltipMarkdownString;
			this._itemDisposables.add(this._hoverService.setupManagedHover(this._hoverDelegate, this.container, hoverContent));
		}

		this.container.classList.toggle('cell-status-item-has-command', !!item.command);
		if (item.command) {
			this.container.tabIndex = 0;

			this._itemDisposables.add(DOM.addDisposableListener(this.container, DOM.EventType.CLICK, _e => {
				this.executeCommand();
			}));
			this._itemDisposables.add(DOM.addDisposableListener(this.container, DOM.EventType.KEY_DOWN, e => {
				const event = new StandardKeyboardEvent(e);
				if (event.equals(KeyCode.Space) || event.equals(KeyCode.Enter)) {
					this.executeCommand();
				}
			}));
		} else {
			this.container.removeAttribute('tabIndex');
		}

		this._currentItem = item;
	}

	private async executeCommand(): Promise<void> {
		const command = this._currentItem.command;
		if (!command) {
			return;
		}

		const id = typeof command === 'string' ? command : command.id;
		const args = typeof command === 'string' ? [] : command.arguments ?? [];

		if (typeof command === 'string' || !command.arguments || !Array.isArray(command.arguments) || command.arguments.length === 0) {
			args.unshift(this._context);
		}

		this._telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id, from: 'cell status bar' });
		try {
			this._editor?.focus();
			await this._commandService.executeCommand(id, ...args);
		} catch (error) {
			this._notificationService.error(toErrorMessage(error));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/cellToolbars.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/cellToolbars.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import { ToolBar } from '../../../../../../base/browser/ui/toolbar/toolbar.js';
import { IAction } from '../../../../../../base/common/actions.js';
import { disposableTimeout } from '../../../../../../base/common/async.js';
import { Emitter, Event } from '../../../../../../base/common/event.js';
import { MarshalledId } from '../../../../../../base/common/marshallingIds.js';
import { ServicesAccessor } from '../../../../../../editor/browser/editorExtensions.js';
import { createActionViewItem, getActionBarActions, MenuEntryActionViewItem, PrimaryAndSecondaryActions } from '../../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenu, IMenuService, MenuId, MenuItemAction } from '../../../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../../platform/keybinding/common/keybinding.js';
import { INotebookCellActionContext } from '../../controller/coreActions.js';
import { ICellViewModel, INotebookEditorDelegate } from '../../notebookBrowser.js';
import { CodiconActionViewItem } from './cellActionView.js';
import { CellOverlayPart } from '../cellPart.js';
import { registerCellToolbarStickyScroll } from './cellToolbarStickyScroll.js';
import { WorkbenchToolBar } from '../../../../../../platform/actions/browser/toolbar.js';
import { createInstantHoverDelegate } from '../../../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IHoverDelegate } from '../../../../../../base/browser/ui/hover/hoverDelegate.js';

export class BetweenCellToolbar extends CellOverlayPart {
	private _betweenCellToolbar: ToolBar | undefined;

	constructor(
		private readonly _notebookEditor: INotebookEditorDelegate,
		_titleToolbarContainer: HTMLElement,
		private readonly _bottomCellToolbarContainer: HTMLElement,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IMenuService private readonly menuService: IMenuService
	) {
		super();
	}

	private _initialize(): ToolBar {
		if (this._betweenCellToolbar) {
			return this._betweenCellToolbar;
		}

		const betweenCellToolbar = this._register(new ToolBar(this._bottomCellToolbarContainer, this.contextMenuService, {
			actionViewItemProvider: (action, options) => {
				if (action instanceof MenuItemAction) {
					if (this._notebookEditor.notebookOptions.getDisplayOptions().insertToolbarAlignment === 'center') {
						return this.instantiationService.createInstance(CodiconActionViewItem, action, { hoverDelegate: options.hoverDelegate });
					} else {
						return this.instantiationService.createInstance(MenuEntryActionViewItem, action, { hoverDelegate: options.hoverDelegate });
					}
				}

				return undefined;
			}
		}));

		this._betweenCellToolbar = betweenCellToolbar;
		const menu = this._register(this.menuService.createMenu(this._notebookEditor.creationOptions.menuIds.cellInsertToolbar, this.contextKeyService));
		const updateActions = () => {
			const actions = getCellToolbarActions(menu);
			betweenCellToolbar.setActions(actions.primary, actions.secondary);
		};

		this._register(menu.onDidChange(() => updateActions()));
		this._register(this._notebookEditor.notebookOptions.onDidChangeOptions((e) => {
			if (e.insertToolbarAlignment) {
				updateActions();
			}
		}));

		updateActions();

		return betweenCellToolbar;
	}

	override didRenderCell(element: ICellViewModel): void {
		const betweenCellToolbar = this._initialize();
		if (this._notebookEditor.hasModel()) {
			betweenCellToolbar.context = {
				ui: true,
				cell: element,
				notebookEditor: this._notebookEditor,
				source: 'insertToolbar',
				$mid: MarshalledId.NotebookCellActionContext
			} satisfies (INotebookCellActionContext & { source?: string; $mid: number });
		}
		this.updateInternalLayoutNow(element);
	}

	override updateInternalLayoutNow(element: ICellViewModel) {
		const bottomToolbarOffset = element.layoutInfo.bottomToolbarOffset;
		this._bottomCellToolbarContainer.style.transform = `translateY(${bottomToolbarOffset}px)`;
	}
}


export interface ICssClassDelegate {
	toggle: (className: string, force?: boolean) => void;
}

interface CellTitleToolbarModel {
	titleMenu: IMenu;
	actions: { primary: IAction[]; secondary: IAction[] };
	deleteMenu: IMenu;
	deleteActions: { primary: IAction[]; secondary: IAction[] };
}

interface CellTitleToolbarView {
	toolbar: ToolBar;
	deleteToolbar: ToolBar;
}

export class CellTitleToolbarPart extends CellOverlayPart {
	private _model: CellTitleToolbarModel | undefined;
	private _view: CellTitleToolbarView | undefined;
	private readonly _onDidUpdateActions: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidUpdateActions: Event<void> = this._onDidUpdateActions.event;

	get hasActions(): boolean {
		if (!this._model) {
			return false;
		}

		return this._model.actions.primary.length
			+ this._model.actions.secondary.length
			+ this._model.deleteActions.primary.length
			+ this._model.deleteActions.secondary.length
			> 0;
	}

	constructor(
		private readonly toolbarContainer: HTMLElement,
		private readonly _rootClassDelegate: ICssClassDelegate,
		private readonly toolbarId: MenuId,
		private readonly deleteToolbarId: MenuId,
		private readonly _notebookEditor: INotebookEditorDelegate,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IMenuService private readonly menuService: IMenuService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
	}

	private _initializeModel(): CellTitleToolbarModel {
		if (this._model) {
			return this._model;
		}

		const titleMenu = this._register(this.menuService.createMenu(this.toolbarId, this.contextKeyService));
		const deleteMenu = this._register(this.menuService.createMenu(this.deleteToolbarId, this.contextKeyService));
		const actions = getCellToolbarActions(titleMenu);
		const deleteActions = getCellToolbarActions(deleteMenu);

		this._model = {
			titleMenu,
			actions,
			deleteMenu,
			deleteActions
		};

		return this._model;
	}

	private _initialize(model: CellTitleToolbarModel, element: ICellViewModel): CellTitleToolbarView {
		if (this._view) {
			return this._view;
		}
		const hoverDelegate = this._register(createInstantHoverDelegate());
		const toolbar = this._register(this.instantiationService.createInstance(WorkbenchToolBar, this.toolbarContainer, {
			actionViewItemProvider: (action, options) => {
				return createActionViewItem(this.instantiationService, action, options);
			},
			renderDropdownAsChildElement: true,
			hoverDelegate
		}));

		const deleteToolbar = this._register(this.instantiationService.invokeFunction(accessor => createDeleteToolbar(accessor, this.toolbarContainer, hoverDelegate, 'cell-delete-toolbar')));
		if (model.deleteActions.primary.length !== 0 || model.deleteActions.secondary.length !== 0) {
			deleteToolbar.setActions(model.deleteActions.primary, model.deleteActions.secondary);
		}

		this.setupChangeListeners(toolbar, model.titleMenu, model.actions);
		this.setupChangeListeners(deleteToolbar, model.deleteMenu, model.deleteActions);

		this._view = {
			toolbar,
			deleteToolbar
		};

		return this._view;
	}

	override prepareRenderCell(element: ICellViewModel): void {
		this._initializeModel();
	}

	override didRenderCell(element: ICellViewModel): void {
		const model = this._initializeModel();
		const view = this._initialize(model, element);
		this.cellDisposables.add(registerCellToolbarStickyScroll(this._notebookEditor, element, this.toolbarContainer, { extraOffset: 4, min: -14 }));

		if (this._notebookEditor.hasModel()) {
			const toolbarContext: INotebookCellActionContext & { source?: string; $mid: number } = {
				ui: true,
				cell: element,
				notebookEditor: this._notebookEditor,
				source: 'cellToolbar',
				$mid: MarshalledId.NotebookCellActionContext
			};

			this.updateContext(view, toolbarContext);
		}
	}

	private updateContext(view: CellTitleToolbarView, toolbarContext: INotebookCellActionContext) {
		view.toolbar.context = toolbarContext;
		view.deleteToolbar.context = toolbarContext;
	}

	private setupChangeListeners(toolbar: ToolBar, menu: IMenu, initActions: { primary: IAction[]; secondary: IAction[] }): void {
		// #103926
		let dropdownIsVisible = false;
		let deferredUpdate: (() => void) | undefined;

		this.updateActions(toolbar, initActions);
		this._register(menu.onDidChange(() => {
			if (dropdownIsVisible) {
				const actions = getCellToolbarActions(menu);
				deferredUpdate = () => this.updateActions(toolbar, actions);
				return;
			}

			const actions = getCellToolbarActions(menu);
			this.updateActions(toolbar, actions);
		}));
		this._rootClassDelegate.toggle('cell-toolbar-dropdown-active', false);
		this._register(toolbar.onDidChangeDropdownVisibility(visible => {
			dropdownIsVisible = visible;
			this._rootClassDelegate.toggle('cell-toolbar-dropdown-active', visible);

			if (deferredUpdate && !visible) {
				disposableTimeout(() => {
					deferredUpdate?.();
				}, 0, this._store);

				deferredUpdate = undefined;
			}
		}));
	}

	private updateActions(toolbar: ToolBar, actions: { primary: IAction[]; secondary: IAction[] }) {
		const hadFocus = DOM.isAncestorOfActiveElement(toolbar.getElement());
		toolbar.setActions(actions.primary, actions.secondary);
		if (hadFocus) {
			this._notebookEditor.focus();
		}

		if (actions.primary.length || actions.secondary.length) {
			this._rootClassDelegate.toggle('cell-has-toolbar-actions', true);
			this._onDidUpdateActions.fire();
		} else {
			this._rootClassDelegate.toggle('cell-has-toolbar-actions', false);
			this._onDidUpdateActions.fire();
		}
	}
}

function getCellToolbarActions(menu: IMenu): PrimaryAndSecondaryActions {
	return getActionBarActions(menu.getActions({ shouldForwardArgs: true }), g => /^inline/.test(g));
}

function createDeleteToolbar(accessor: ServicesAccessor, container: HTMLElement, hoverDelegate: IHoverDelegate, elementClass?: string): ToolBar {
	const contextMenuService = accessor.get(IContextMenuService);
	const keybindingService = accessor.get(IKeybindingService);
	const instantiationService = accessor.get(IInstantiationService);
	const toolbar = new ToolBar(container, contextMenuService, {
		getKeyBinding: action => keybindingService.lookupKeybinding(action.id),
		actionViewItemProvider: (action, options) => {
			return createActionViewItem(instantiationService, action, options);
		},
		renderDropdownAsChildElement: true,
		hoverDelegate
	});

	if (elementClass) {
		toolbar.getElement().classList.add(elementClass);
	}

	return toolbar;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/cellToolbarStickyScroll.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/cellToolbarStickyScroll.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { combinedDisposable, IDisposable } from '../../../../../../base/common/lifecycle.js';
import { clamp } from '../../../../../../base/common/numbers.js';
import { ICellViewModel, INotebookEditor } from '../../notebookBrowser.js';

export function registerCellToolbarStickyScroll(notebookEditor: INotebookEditor, cell: ICellViewModel, element: HTMLElement, opts?: { extraOffset?: number; min?: number }): IDisposable {
	const extraOffset = opts?.extraOffset ?? 0;
	const min = opts?.min ?? 0;

	const updateForScroll = () => {
		if (cell.isInputCollapsed) {
			element.style.top = '';
		} else {
			const scrollTop = notebookEditor.scrollTop;
			const elementTop = notebookEditor.getAbsoluteTopOfElement(cell);
			const diff = scrollTop - elementTop + extraOffset;
			const maxTop = cell.layoutInfo.editorHeight + cell.layoutInfo.statusBarHeight - 45; // subtract roughly the height of the execution order label plus padding
			const top = maxTop > 20 ? // Don't move the run button if it can only move a very short distance
				clamp(min, diff, maxTop) :
				min;
			element.style.top = `${top}px`;
		}
	};

	updateForScroll();
	const disposables: IDisposable[] = [];
	disposables.push(
		notebookEditor.onDidScroll(() => updateForScroll()),
		notebookEditor.onDidChangeLayout(() => updateForScroll())
	);

	return combinedDisposable(...disposables);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/cellWidgets.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/cellWidgets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IClickTarget {
	type: ClickTargetType;
	event: MouseEvent;
}

export const enum ClickTargetType {
	Container = 0,
	ContributedTextItem = 1,
	ContributedCommandItem = 2
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/codeCell.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/codeCell.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// allow-any-unicode-comment-file

import { localize } from '../../../../../../nls.js';
import * as DOM from '../../../../../../base/browser/dom.js';
import { raceCancellation } from '../../../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { Event } from '../../../../../../base/common/event.js';
import { Disposable, IDisposable, toDisposable } from '../../../../../../base/common/lifecycle.js';
import { clamp } from '../../../../../../base/common/numbers.js';
import * as strings from '../../../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { EditorOption } from '../../../../../../editor/common/config/editorOptions.js';
import { IDimension } from '../../../../../../editor/common/core/2d/dimension.js';
import { ILanguageService } from '../../../../../../editor/common/languages/language.js';
import { tokenizeToStringSync } from '../../../../../../editor/common/languages/textToHtmlTokenizer.js';
import { IReadonlyTextBuffer, ITextModel } from '../../../../../../editor/common/model.js';
import { CodeActionController } from '../../../../../../editor/contrib/codeAction/browser/codeActionController.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../../platform/keybinding/common/keybinding.js';
import { INotebookExecutionStateService } from '../../../common/notebookExecutionStateService.js';
import { CellFocusMode, EXPAND_CELL_INPUT_COMMAND_ID, IActiveNotebookEditorDelegate } from '../../notebookBrowser.js';
import { CodeCellViewModel, outputDisplayLimit } from '../../viewModel/codeCellViewModel.js';
import { CellPartsCollection } from '../cellPart.js';
import { NotebookCellEditorPool } from '../notebookCellEditorPool.js';
import { CodeCellRenderTemplate, collapsedCellTTPolicy } from '../notebookRenderingCommon.js';
import { CellEditorOptions } from './cellEditorOptions.js';
import { CellOutputContainer } from './cellOutput.js';
import { CollapsedCodeCellExecutionIcon } from './codeCellExecutionIcon.js';
import { INotebookLoggingService } from '../../../common/notebookLoggingService.js';


export class CodeCell extends Disposable {
	private _outputContainerRenderer: CellOutputContainer;
	private _inputCollapseElement: HTMLElement | undefined;

	private _renderedInputCollapseState: boolean | undefined;
	private _renderedOutputCollapseState: boolean | undefined;
	private _isDisposed: boolean = false;
	private readonly cellParts: CellPartsCollection;

	private _collapsedExecutionIcon: CollapsedCodeCellExecutionIcon;
	private _cellEditorOptions: CellEditorOptions;
	private _useNewApproachForEditorLayout = true;
	private _pointerDownInEditor = false;
	private readonly _cellLayout: CodeCellLayout;
	private readonly _debug: (output: string) => void;
	constructor(
		private readonly notebookEditor: IActiveNotebookEditorDelegate,
		private readonly viewCell: CodeCellViewModel,
		private readonly templateData: CodeCellRenderTemplate,
		private readonly editorPool: NotebookCellEditorPool,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IConfigurationService private configurationService: IConfigurationService,
		@INotebookExecutionStateService notebookExecutionStateService: INotebookExecutionStateService,
		@INotebookLoggingService notebookLogService: INotebookLoggingService,
	) {
		super();
		const cellIndex = this.notebookEditor.getCellIndex(this.viewCell);
		const debugPrefix = `[Cell ${cellIndex}]`;
		const debug = this._debug = (output: string) => {
			notebookLogService.debug('CellLayout', `${debugPrefix} ${output}`);
		};

		this._cellEditorOptions = this._register(new CellEditorOptions(this.notebookEditor.getBaseCellEditorOptions(viewCell.language), this.notebookEditor.notebookOptions, this.configurationService));
		this._outputContainerRenderer = this.instantiationService.createInstance(CellOutputContainer, notebookEditor, viewCell, templateData, { limit: outputDisplayLimit });
		this.cellParts = this._register(templateData.cellParts.concatContentPart([this._cellEditorOptions, this._outputContainerRenderer], DOM.getWindow(notebookEditor.getDomNode())));

		const initialEditorDimension = { height: this.calculateInitEditorHeight(), width: this.viewCell.layoutInfo.editorWidth };
		this._cellLayout = new CodeCellLayout(this._useNewApproachForEditorLayout, notebookEditor, viewCell, templateData, { debug }, initialEditorDimension);
		this.initializeEditor(initialEditorDimension);
		this._renderedInputCollapseState = false; // editor is always expanded initially

		this.registerNotebookEditorListeners();
		this.registerViewCellLayoutChange();
		this.registerCellEditorEventListeners();
		this.registerMouseListener();

		this._register(Event.any(this.viewCell.onDidStartExecution, this.viewCell.onDidStopExecution)((e) => {
			this.cellParts.updateForExecutionState(this.viewCell, e);
		}));

		this._register(this.viewCell.onDidChangeState(e => {
			this.cellParts.updateState(this.viewCell, e);

			if (e.outputIsHoveredChanged) {
				this.updateForOutputHover();
			}

			if (e.outputIsFocusedChanged) {
				this.updateForOutputFocus();
			}

			if (e.metadataChanged || e.internalMetadataChanged) {
				this.updateEditorOptions();
			}

			if (e.inputCollapsedChanged || e.outputCollapsedChanged) {
				this.viewCell.pauseLayout();
				const updated = this.updateForCollapseState();
				this.viewCell.resumeLayout();
				if (updated) {
					this.relayoutCell();
				}
			}

			if (e.focusModeChanged) {
				this.updateEditorForFocusModeChange(true);
			}
		}));

		this.updateEditorOptions();
		this.updateEditorForFocusModeChange(false);
		this.updateForOutputHover();
		this.updateForOutputFocus();

		this.cellParts.scheduleRenderCell(this.viewCell);

		this._register(toDisposable(() => {
			this.cellParts.unrenderCell(this.viewCell);
		}));


		// Render Outputs
		this.viewCell.editorHeight = initialEditorDimension.height;
		this._outputContainerRenderer.render();
		this._renderedOutputCollapseState = false; // the output is always rendered initially
		// Need to do this after the intial renderOutput
		this.initialViewUpdateExpanded();

		this._register(this.viewCell.onLayoutInfoRead(() => {
			this.cellParts.prepareLayout();
		}));

		const executionItemElement = DOM.append(this.templateData.cellInputCollapsedContainer, DOM.$('.collapsed-execution-icon'));
		this._register(toDisposable(() => {
			executionItemElement.remove();
		}));
		this._collapsedExecutionIcon = this._register(this.instantiationService.createInstance(CollapsedCodeCellExecutionIcon, this.notebookEditor, this.viewCell, executionItemElement));
		this.updateForCollapseState();

		this._register(Event.runAndSubscribe(viewCell.onDidChangeOutputs, this.updateForOutputs.bind(this)));
		this._register(Event.runAndSubscribe(viewCell.onDidChangeLayout, this.updateForLayout.bind(this)));

		this._cellEditorOptions.setLineNumbers(this.viewCell.lineNumbers);
		templateData.editor.updateOptions(this._cellEditorOptions.getUpdatedValue(this.viewCell.internalMetadata, this.viewCell.uri));
	}

	private updateCodeCellOptions(templateData: CodeCellRenderTemplate) {
		templateData.editor.updateOptions(this._cellEditorOptions.getUpdatedValue(this.viewCell.internalMetadata, this.viewCell.uri));

		const cts = new CancellationTokenSource();
		this._register({ dispose() { cts.dispose(true); } });
		raceCancellation(this.viewCell.resolveTextModel(), cts.token).then(model => {
			if (this._isDisposed) {
				return;
			}

			if (model) {
				model.updateOptions({
					indentSize: this._cellEditorOptions.indentSize,
					tabSize: this._cellEditorOptions.tabSize,
					insertSpaces: this._cellEditorOptions.insertSpaces,
				});
			}
		});
	}

	private _pendingLayout: IDisposable | undefined;

	private updateForLayout(): void {
		this._pendingLayout?.dispose();
		this._pendingLayout = DOM.modify(DOM.getWindow(this.notebookEditor.getDomNode()), () => {
			this.cellParts.updateInternalLayoutNow(this.viewCell);
		});
	}

	private updateForOutputHover() {
		this.templateData.container.classList.toggle('cell-output-hover', this.viewCell.outputIsHovered);
	}

	private updateForOutputFocus() {
		this.templateData.container.classList.toggle('cell-output-focus', this.viewCell.outputIsFocused);
	}

	private calculateInitEditorHeight() {
		const lineNum = this.viewCell.lineCount;
		const lineHeight = this.viewCell.layoutInfo.fontInfo?.lineHeight || 17;
		const editorPadding = this.notebookEditor.notebookOptions.computeEditorPadding(this.viewCell.internalMetadata, this.viewCell.uri);
		const editorHeight = this.viewCell.layoutInfo.editorHeight === 0
			? lineNum * lineHeight + editorPadding.top + editorPadding.bottom
			: this.viewCell.layoutInfo.editorHeight;
		return editorHeight;
	}

	private initializeEditor(dimension: IDimension) {
		this._debug(`Initialize Editor ${dimension.height} x ${dimension.width}, Scroll Top = ${this.notebookEditor.scrollTop}`);
		this._cellLayout.layoutEditor('init');
		this.layoutEditor(dimension);

		const cts = new CancellationTokenSource();
		this._register({ dispose() { cts.dispose(true); } });
		raceCancellation(this.viewCell.resolveTextModel(), cts.token).then(model => {
			if (this._isDisposed || model?.isDisposed()) {
				return;
			}

			if (model && this.templateData.editor) {
				this._reigsterModelListeners(model);

				// set model can trigger view update, which can lead to dispose of this cell
				this.templateData.editor.setModel(model);

				if (this._isDisposed) {
					return;
				}

				model.updateOptions({
					indentSize: this._cellEditorOptions.indentSize,
					tabSize: this._cellEditorOptions.tabSize,
					insertSpaces: this._cellEditorOptions.insertSpaces,
				});
				this.viewCell.attachTextEditor(this.templateData.editor, this.viewCell.layoutInfo.estimatedHasHorizontalScrolling);
				const focusEditorIfNeeded = () => {
					if (
						this.notebookEditor.getActiveCell() === this.viewCell &&
						this.viewCell.focusMode === CellFocusMode.Editor &&
						(this.notebookEditor.hasEditorFocus() || this.notebookEditor.getDomNode().ownerDocument.activeElement === this.notebookEditor.getDomNode().ownerDocument.body)) // Don't steal focus from other workbench parts, but if body has focus, we can take it
					{
						this.templateData.editor.focus();
					}
				};
				focusEditorIfNeeded();

				const realContentHeight = this.templateData.editor.getContentHeight();
				if (realContentHeight !== dimension.height) {
					this.onCellEditorHeightChange('onDidResolveTextModel');
				}

				if (this._isDisposed) {
					return;
				}

				focusEditorIfNeeded();
			}

			this._register(this._cellEditorOptions.onDidChange(() => this.updateCodeCellOptions(this.templateData)));
		});
	}

	private updateForOutputs(): void {
		DOM.setVisibility(this.viewCell.outputsViewModels.length > 0, this.templateData.focusSinkElement);
	}

	private updateEditorOptions() {
		const editor = this.templateData.editor;
		if (!editor) {
			return;
		}

		const isReadonly = this.notebookEditor.isReadOnly;
		const padding = this.notebookEditor.notebookOptions.computeEditorPadding(this.viewCell.internalMetadata, this.viewCell.uri);
		const options = editor.getOptions();
		if (options.get(EditorOption.readOnly) !== isReadonly || options.get(EditorOption.padding) !== padding) {
			editor.updateOptions({
				readOnly: this.notebookEditor.isReadOnly, padding: this.notebookEditor.notebookOptions.computeEditorPadding(this.viewCell.internalMetadata, this.viewCell.uri)
			});
		}
	}

	private registerNotebookEditorListeners() {
		this._register(this.notebookEditor.onDidScroll(() => {
			this.adjustEditorPosition();
			this._cellLayout.layoutEditor('nbDidScroll');
		}));

		this._register(this.notebookEditor.onDidChangeLayout(() => {
			this.adjustEditorPosition();
			this.onCellWidthChange('nbLayoutChange');
		}));
	}

	private adjustEditorPosition() {
		if (this._useNewApproachForEditorLayout) {
			return;
		}
		const extraOffset = -6 /** distance to the top of the cell editor, which is 6px under the focus indicator */ - 1 /** border */;
		const min = 0;

		const scrollTop = this.notebookEditor.scrollTop;
		const elementTop = this.notebookEditor.getAbsoluteTopOfElement(this.viewCell);
		const diff = scrollTop - elementTop + extraOffset;

		const notebookEditorLayout = this.notebookEditor.getLayoutInfo();

		// we should stop adjusting the top when users are viewing the bottom of the cell editor
		const editorMaxHeight = notebookEditorLayout.height
			- notebookEditorLayout.stickyHeight
			- 26 /** notebook toolbar */;

		const maxTop =
			this.viewCell.layoutInfo.editorHeight
			// + this.viewCell.layoutInfo.statusBarHeight
			- editorMaxHeight
			;
		const top = maxTop > 20 ?
			clamp(min, diff, maxTop) :
			min;
		this.templateData.editorPart.style.top = `${top}px`;
		// scroll the editor with top
		this.templateData.editor.setScrollTop(top);
	}

	private registerViewCellLayoutChange() {
		this._register(this.viewCell.onDidChangeLayout((e) => {
			if (e.outerWidth !== undefined) {
				const layoutInfo = this.templateData.editor.getLayoutInfo();
				if (layoutInfo.width !== this.viewCell.layoutInfo.editorWidth) {
					this.onCellWidthChange('viewCellLayoutChange');
					this.adjustEditorPosition();
				}
			}
		}));
	}

	private registerCellEditorEventListeners() {
		this._register(this.templateData.editor.onDidContentSizeChange((e) => {
			if (e.contentHeightChanged) {
				if (this.viewCell.layoutInfo.editorHeight !== e.contentHeight) {
					this.onCellEditorHeightChange(`onDidContentSizeChange`);
					this.adjustEditorPosition();
				}
			}
		}));

		if (this._useNewApproachForEditorLayout) {
			this._register(this.templateData.editor.onDidScrollChange(e => {
				// Option 4: Gate scroll-driven reactions during active drag-selection
				if (this._pointerDownInEditor) {
					return;
				}
				if (this._cellLayout.editorVisibility === 'Invisible' || !this.templateData.editor.hasTextFocus()) {
					return;
				}
				if (this._cellLayout._lastChangedEditorScrolltop === e.scrollTop || this._cellLayout.isUpdatingLayout) {
					return;
				}
				const scrollTop = this.notebookEditor.scrollTop;
				const diff = e.scrollTop - (this._cellLayout._lastChangedEditorScrolltop ?? 0);
				if (this._cellLayout.editorVisibility === 'Full (Small Viewport)' && typeof this._cellLayout._lastChangedEditorScrolltop === 'number') {
					this._debug(`Scroll Change (1) = ${e.scrollTop} changed by ${diff} (notebook scrollTop: ${scrollTop}, setEditorScrollTop: ${e.scrollTop})`);
					// this.templateData.editor.setScrollTop(e.scrollTop);
				} else if (this._cellLayout.editorVisibility === 'Bottom Clipped' && typeof this._cellLayout._lastChangedEditorScrolltop === 'number') {
					this._debug(`Scroll Change (2) = ${e.scrollTop} changed by ${diff} (notebook scrollTop: ${scrollTop}, setNotebookScrollTop: ${scrollTop + e.scrollTop})`);
					this.notebookEditor.setScrollTop(scrollTop + e.scrollTop);
				} else if (this._cellLayout.editorVisibility === 'Top Clipped' && typeof this._cellLayout._lastChangedEditorScrolltop === 'number') {
					const newScrollTop = scrollTop + diff - 1;
					this._debug(`Scroll Change (3) = ${e.scrollTop} changed by ${diff} (notebook scrollTop: ${scrollTop}, setNotebookScrollTop?: ${newScrollTop})`);
					if (scrollTop !== newScrollTop) {
						this.notebookEditor.setScrollTop(newScrollTop);
					}
				} else {
					this._debug(`Scroll Change (4) = ${e.scrollTop} changed by ${diff} (notebook scrollTop: ${scrollTop})`);
					this._cellLayout._lastChangedEditorScrolltop = undefined;
				}
			}));
		}

		this._register(this.templateData.editor.onDidChangeCursorSelection((e) => {
			if (
				// do not reveal the cell into view if this selection change was caused by restoring editors
				e.source === 'restoreState' || e.oldModelVersionId === 0
				// nor if the text editor is not actually focused (e.g. inline chat is focused and modifying the cell content)
				|| !this.templateData.editor.hasTextFocus()
			) {
				return;
			}

			// Option 3: Avoid relayouts during active pointer drag to prevent stuck selection mode
			if (this._pointerDownInEditor && this._useNewApproachForEditorLayout) {
				return;
			}

			const selections = this.templateData.editor.getSelections();

			if (selections?.length) {
				const contentHeight = this.templateData.editor.getContentHeight();
				const layoutContentHeight = this.viewCell.layoutInfo.editorHeight;

				if (contentHeight !== layoutContentHeight) {
					if (!this._useNewApproachForEditorLayout) {
						this._debug(`onDidChangeCursorSelection`);
						this.onCellEditorHeightChange('onDidChangeCursorSelection');
					}

					if (this._isDisposed) {
						return;
					}
				}
				const lastSelection = selections[selections.length - 1];
				this.notebookEditor.revealRangeInViewAsync(this.viewCell, lastSelection);
			}
		}));

		this._register(this.templateData.editor.onDidBlurEditorWidget(() => {
			CodeActionController.get(this.templateData.editor)?.hideLightBulbWidget();
		}));
	}

	private _reigsterModelListeners(model: ITextModel) {
		this._register(model.onDidChangeTokens(() => {
			if (this.viewCell.isInputCollapsed && this._inputCollapseElement) {
				// flush the collapsed input with the latest tokens
				const content = this._getRichTextFromLineTokens(model);
				this._inputCollapseElement.innerHTML = (collapsedCellTTPolicy?.createHTML(content) ?? content) as string;
				this._attachInputExpandButton(this._inputCollapseElement);
			}
		}));
	}

	private registerMouseListener() {
		this._register(this.templateData.editor.onMouseDown(e => {
			// prevent default on right mouse click, otherwise it will trigger unexpected focus changes
			// the catch is, it means we don't allow customization of right button mouse down handlers other than the built in ones.
			if (e.event.rightButton) {
				e.event.preventDefault();
			}

			if (this._useNewApproachForEditorLayout) {
				// Track pointer-down to gate layout behavior (options 3 & 4)
				this._pointerDownInEditor = true;
				this._cellLayout.setPointerDown(true);
			}
		}));

		if (this._useNewApproachForEditorLayout) {
			// Ensure we reset pointer-down even if mouseup lands outside the editor
			const win = DOM.getWindow(this.notebookEditor.getDomNode());
			this._register(DOM.addDisposableListener(win, 'mouseup', () => {
				this._pointerDownInEditor = false;
				this._cellLayout.setPointerDown(false);
			}));
		}
	}

	private shouldPreserveEditor() {
		// The DOM focus needs to be adjusted:
		// when a cell editor should be focused
		// the document active element is inside the notebook editor or the document body (cell editor being disposed previously)
		return this.notebookEditor.getActiveCell() === this.viewCell
			&& this.viewCell.focusMode === CellFocusMode.Editor
			&& (this.notebookEditor.hasEditorFocus() || this.notebookEditor.getDomNode().ownerDocument.activeElement === this.notebookEditor.getDomNode().ownerDocument.body);
	}

	private updateEditorForFocusModeChange(sync: boolean) {
		if (this.shouldPreserveEditor()) {
			if (sync) {
				this.templateData.editor.focus();
			} else {
				this._register(DOM.runAtThisOrScheduleAtNextAnimationFrame(DOM.getWindow(this.templateData.container), () => {
					this.templateData.editor.focus();
				}));
			}
		}

		this.templateData.container.classList.toggle('cell-editor-focus', this.viewCell.focusMode === CellFocusMode.Editor);
		this.templateData.container.classList.toggle('cell-output-focus', this.viewCell.focusMode === CellFocusMode.Output);
	}
	private updateForCollapseState(): boolean {
		if (this.viewCell.isOutputCollapsed === this._renderedOutputCollapseState &&
			this.viewCell.isInputCollapsed === this._renderedInputCollapseState) {
			return false;
		}

		this.viewCell.layoutChange({ editorHeight: true });

		if (this.viewCell.isInputCollapsed) {
			this._collapseInput();
		} else {
			this._showInput();
		}

		if (this.viewCell.isOutputCollapsed) {
			this._collapseOutput();
		} else {
			this._showOutput(false);
		}

		this.relayoutCell();

		this._renderedOutputCollapseState = this.viewCell.isOutputCollapsed;
		this._renderedInputCollapseState = this.viewCell.isInputCollapsed;

		return true;
	}

	private _collapseInput() {
		// hide the editor and execution label, keep the run button
		DOM.hide(this.templateData.editorPart);
		this.templateData.container.classList.toggle('input-collapsed', true);

		// remove input preview
		this._removeInputCollapsePreview();

		this._collapsedExecutionIcon.setVisibility(true);

		// update preview
		const richEditorText = this.templateData.editor.hasModel() ? this._getRichTextFromLineTokens(this.templateData.editor.getModel()) : this._getRichText(this.viewCell.textBuffer, this.viewCell.language);
		const element = DOM.$('div.cell-collapse-preview');
		element.innerHTML = (collapsedCellTTPolicy?.createHTML(richEditorText) ?? richEditorText) as string;
		this._inputCollapseElement = element;
		this.templateData.cellInputCollapsedContainer.appendChild(element);
		this._attachInputExpandButton(element);

		DOM.show(this.templateData.cellInputCollapsedContainer);
	}

	private _attachInputExpandButton(element: HTMLElement) {
		const expandIcon = DOM.$('span.expandInputIcon');
		const keybinding = this.keybindingService.lookupKeybinding(EXPAND_CELL_INPUT_COMMAND_ID);
		if (keybinding) {
			element.title = localize('cellExpandInputButtonLabelWithDoubleClick', "Double-click to expand cell input ({0})", keybinding.getLabel());
			expandIcon.title = localize('cellExpandInputButtonLabel', "Expand Cell Input ({0})", keybinding.getLabel());
		}

		expandIcon.classList.add(...ThemeIcon.asClassNameArray(Codicon.more));
		element.appendChild(expandIcon);
	}

	private _showInput() {
		this._collapsedExecutionIcon.setVisibility(false);
		DOM.show(this.templateData.editorPart);
		DOM.hide(this.templateData.cellInputCollapsedContainer);
	}

	private _getRichText(buffer: IReadonlyTextBuffer, language: string) {
		return tokenizeToStringSync(this.languageService, buffer.getLineContent(1), language);
	}

	private _getRichTextFromLineTokens(model: ITextModel) {
		let result = `<div class="monaco-tokenized-source">`;

		const firstLineTokens = model.tokenization.getLineTokens(1);
		const viewLineTokens = firstLineTokens.inflate();
		const line = model.getLineContent(1);
		let startOffset = 0;
		for (let j = 0, lenJ = viewLineTokens.getCount(); j < lenJ; j++) {
			const type = viewLineTokens.getClassName(j);
			const endIndex = viewLineTokens.getEndOffset(j);
			result += `<span class="${type}">${strings.escape(line.substring(startOffset, endIndex))}</span>`;
			startOffset = endIndex;
		}

		result += `</div>`;
		return result;
	}

	private _removeInputCollapsePreview() {
		const children = this.templateData.cellInputCollapsedContainer.children;
		const elements = [];
		for (let i = 0; i < children.length; i++) {
			if (children[i].classList.contains('cell-collapse-preview')) {
				elements.push(children[i]);
			}
		}

		elements.forEach(element => {
			element.remove();
		});
	}

	private _updateOutputInnerContainer(hide: boolean) {
		const children = this.templateData.outputContainer.domNode.children;
		for (let i = 0; i < children.length; i++) {
			if (children[i].classList.contains('output-inner-container')) {
				DOM.setVisibility(!hide, children[i] as HTMLElement);
			}
		}
	}

	private _collapseOutput() {
		this.templateData.container.classList.toggle('output-collapsed', true);
		DOM.show(this.templateData.cellOutputCollapsedContainer);
		this._updateOutputInnerContainer(true);
		this._outputContainerRenderer.viewUpdateHideOuputs();
	}

	private _showOutput(initRendering: boolean) {
		this.templateData.container.classList.toggle('output-collapsed', false);
		DOM.hide(this.templateData.cellOutputCollapsedContainer);
		this._updateOutputInnerContainer(false);
		this._outputContainerRenderer.viewUpdateShowOutputs(initRendering);
	}

	private initialViewUpdateExpanded(): void {
		this.templateData.container.classList.toggle('input-collapsed', false);
		DOM.show(this.templateData.editorPart);
		DOM.hide(this.templateData.cellInputCollapsedContainer);
		this.templateData.container.classList.toggle('output-collapsed', false);
		this._showOutput(true);
	}

	private layoutEditor(dimension: IDimension): void {
		if (this._useNewApproachForEditorLayout) {
			return;
		}
		const editorLayout = this.notebookEditor.getLayoutInfo();
		const maxHeight = Math.min(
			editorLayout.height
			- editorLayout.stickyHeight
			- 26 /** notebook toolbar */,
			dimension.height
		);
		this._debug(`Layout Editor: Width = ${dimension.width}, Height = ${maxHeight} (Requested: ${dimension.height}, Editor Layout Height: ${editorLayout.height}, Sticky: ${editorLayout.stickyHeight})`);
		this.templateData.editor.layout({
			width: dimension.width,
			height: maxHeight
		}, true);
	}

	private onCellWidthChange(dbgReasonForChange: CellLayoutChangeReason): void {
		this._debug(`Cell Editor Width Change, ${dbgReasonForChange}, Content Height = ${this.templateData.editor.getContentHeight()}`);
		const height = this.templateData.editor.getContentHeight();
		if (this.templateData.editor.hasModel()) {
			this._debug(`**** Updating Cell Editor Height (1), ContentHeight: ${height}, CodeCellLayoutInfo.EditorWidth ${this.viewCell.layoutInfo.editorWidth}, EditorLayoutInfo ${this.templateData.editor.getLayoutInfo().height} ****`);
			this.viewCell.editorHeight = height;
			this.relayoutCell();
			this.layoutEditor(
				{
					width: this.viewCell.layoutInfo.editorWidth,
					height
				}
			);
		} else {
			this._debug(`Cell Editor Width Change without model, return (1), ContentHeight: ${height}, CodeCellLayoutInfo.EditorWidth ${this.viewCell.layoutInfo.editorWidth}, EditorLayoutInfo ${this.templateData.editor.getLayoutInfo().height}`);
		}
		this._cellLayout.layoutEditor(dbgReasonForChange);
	}

	private onCellEditorHeightChange(dbgReasonForChange: CellLayoutChangeReason): void {
		const height = this.templateData.editor.getContentHeight();
		if (!this.templateData.editor.hasModel()) {
			this._debug(`Cell Editor Height Change without model, return (2), ContentHeight: ${height}, CodeCellLayoutInfo.EditorWidth ${this.viewCell.layoutInfo.editorWidth}, EditorLayoutInfo ${this.templateData.editor.getLayoutInfo()}`);
		}
		this._debug(`Cell Editor Height Change (${dbgReasonForChange}): ${height}`);
		this._debug(`**** Updating Cell Editor Height (2), ContentHeight: ${height}, CodeCellLayoutInfo.EditorWidth ${this.viewCell.layoutInfo.editorWidth}, EditorLayoutInfo ${this.templateData.editor.getLayoutInfo().height} ****`);
		const viewLayout = this.templateData.editor.getLayoutInfo();
		this.viewCell.editorHeight = height;
		this.relayoutCell();
		this.layoutEditor(
			{
				width: viewLayout.width,
				height
			}
		);
		this._cellLayout.layoutEditor(dbgReasonForChange);
	}

	relayoutCell() {
		this.notebookEditor.layoutNotebookCell(this.viewCell, this.viewCell.layoutInfo.totalHeight);
	}

	override dispose() {
		this._isDisposed = true;

		// move focus back to the cell list otherwise the focus goes to body
		if (this.shouldPreserveEditor()) {
			// now the focus is on the monaco editor for the cell but detached from the rows.
			this.editorPool.preserveFocusedEditor(this.viewCell);
		}

		this.viewCell.detachTextEditor();
		this._removeInputCollapsePreview();
		this._outputContainerRenderer.dispose();
		this._pendingLayout?.dispose();

		super.dispose();
	}
}

type CellLayoutChangeReason = 'nbLayoutChange' | 'nbDidScroll' | 'viewCellLayoutChange' | 'init' | 'onDidChangeCursorSelection' | 'onDidContentSizeChange' | 'onDidResolveTextModel';

export class CodeCellLayout {
	private _editorVisibility?: 'Full' | 'Top Clipped' | 'Bottom Clipped' | 'Full (Small Viewport)' | 'Invisible';
	public get editorVisibility() {
		return this._editorVisibility;
	}
	private _isUpdatingLayout?: boolean;
	public get isUpdatingLayout() {
		return this._isUpdatingLayout;
	}
	public _previousScrollBottom?: number;
	public _lastChangedEditorScrolltop?: number;
	private _initialized: boolean = false;
	private _pointerDown: boolean = false;
	constructor(
		private readonly _enabled: boolean,
		private readonly notebookEditor: IActiveNotebookEditorDelegate,
		private readonly viewCell: CodeCellViewModel,
		private readonly templateData: CodeCellRenderTemplate,
		private readonly _logService: { debug: (output: string) => void },
		private readonly _initialEditorDimension: IDimension
	) {
	}

	public setPointerDown(isDown: boolean) {
		this._pointerDown = isDown;
	}
	/**
	 * Dynamically lays out the code cell's Monaco editor to simulate a "sticky" run/exec area while
	 * constraining the visible editor height to the notebook viewport. It adjusts two things:
	 *  - The absolute `top` offset of the editor part inside the cell (so the run / execution order
	 *    area remains visible for a limited vertical travel band ~45px).
	 *  - The editor's layout height plus the editor's internal scroll position (`editorScrollTop`) to
	 *    crop content when the cell is partially visible (top or bottom clipped) or when content is
	 *    taller than the viewport.
	 *
	 * ---------------------------------------------------------------------------
	 * SECTION 1. OVERALL NOTEBOOK VIEW (EACH CELL HAS AN 18px GAP ABOVE IT)
	 * Legend:
	 *   GAP (between cells & before first cell) ............. 18px
	 *   CELL PADDING (top & bottom inside cell) ............. 6px
	 *   STATUS BAR HEIGHT (typical) ......................... 22px
	 *   LINE HEIGHT (logic clamp) ........................... 21px
	 *   BORDER/OUTLINE HEIGHT (visual conceal adjustment) ... 1px
	 *   EDITOR_HEIGHT (example visible editor) .............. 200px (capped by viewport)
	 *   EDITOR_CONTENT_HEIGHT (example full content) ........ 380px (e.g. 50 lines)
	 *   extraOffset = -(CELL_PADDING + BORDER_HEIGHT) ....... -7
	 *
	 *   (The list ensures the editor's laid out height never exceeds viewport height.)
	 *
	 *   ┌────────────────────────────── Notebook Viewport (scrolling container) ────────────────────────────┐
	 *   │ (scrollTop)                                                                                       │
	 *   │                                                                                                   │
	 *   │  18px GAP (top spacing before first cell)                                                         │
	 *   │  ▼                                                                                                │
	 *   │  ┌──────── Cell A Outer Container ────────────────────────────────────────────────────────────┐   │
	 *   │  │ ▲ 6px top padding                                                                          │   │
	 *   │  │ │                                                                                          │   │
	 *   │  │ │  ┌─ Execution Order / Run Column (~45px vertical travel band)─┐  ┌─ Editor Part ───────┐ │   │
	 *   │  │ │  │ (Run button, execution # label)                            │  │ Visible Lines ...   │ │   │
	 *   │  │ │  │                                                            │  │                     │ │   │
	 *   │  │ │  │                                                            │  │ EDITOR_HEIGHT=200px │ │   │
	 *   │  │ │  │                                                            │  │ (Content=380px)     │ │   │
	 *   │  │ │  └────────────────────────────────────────────────────────────┘  └─────────────────────┘ │   │
	 *   │  │ │                                                                                          │   │
	 *   │  │ │  ┌─ Status Bar (22px) ─────────────────────────────────────────────────────────────────┐ │   │
	 *   │  │ │  │ language | indent | selection info | kernel/status bits ...                         │ │   │
	 *   │  │ │  └─────────────────────────────────────────────────────────────────────────────────────┘ │   │
	 *   │  │ │                                                                                          │   │
	 *   │  │ ▼ 6px bottom padding                                                                       │   │
	 *   │  └────────────────────────────────────────────────────────────────────────────────────────────┘   │
	 *   │  18px GAP                                                                                         │
	 *   │  ┌──────── Cell B Outer Container ────────────────────────────────────────────────────────────┐   │
	 *   │  │ (same structure as Cell A)                                                                 │   │
	 *   │  └────────────────────────────────────────────────────────────────────────────────────────────┘   │
	 *   │                                                                                                   │
	 *   │ (scrollBottom)                                                                                    │
	 *   └───────────────────────────────────────────────────────────────────────────────────────────────────┘
	 *
	 * SECTION 2. SINGLE CELL STRUCTURE (VERTICAL LAYERS)
	 *
	 *   Inter-Cell GAP (18px)
	 *   ┌─────────────────────────────── Cell Wrapper (<li>) ──────────────────────────────┐
	 *   │ ┌──────────────────────────── .cell-inner-container ───────────────────────────┐ │
	 *   │ │ 6px top padding                                                              │ │
	 *   │ │                                                                              │ │
	 *   │ │ ┌─ Left Gutter (Run / Exec / Focus Border) ─┬──────── Editor Part ─────────┐ │ │
	 *   │ │ │  Sticky vertical travel (~45px allowance) │  (Monaco surface)            │ │ │
	 *   │ │ │                                         │  Visible height 200px          │ │ │
	 *   │ │ │                                         │  Content height 380px          │ │ │
	 *   │ │ └─────────────────────────────────────────┴────────────────────────────────┘ │ │
	 *   │ │                                                                              │ │
	 *   │ │ ┌─ Status Bar (22px) ──────────────────────────────────────────────────────┐ │ │
	 *   │ │ │ language | indent | selection | kernel | state                           │ │ │
	 *   │ │ └──────────────────────────────────────────────────────────────────────────┘ │ │
	 *   │ │ 6px bottom padding                                                           │ │
	 *   │ └──────────────────────────────────────────────────────────────────────────────┘ │
	 *   │ (Outputs region begins at outputContainerOffset below input area)                │
	 *   └──────────────────────────────────────────────────────────────────────────────────┘
	 */
	public layoutEditor(reason: CellLayoutChangeReason): void {
		if (!this._enabled) {
			return;
		}
		const element = this.templateData.editorPart;
		if (this.viewCell.isInputCollapsed) {
			element.style.top = '';
			return;
		}

		const LINE_HEIGHT = this.notebookEditor.getLayoutInfo().fontInfo.lineHeight; // 21;
		const CELL_TOP_MARGIN = this.viewCell.layoutInfo.topMargin;
		const CELL_OUTLINE_WIDTH = this.viewCell.layoutInfo.outlineWidth; // 1 extra px for border (we don't want to be able to see the cell border when scrolling up);
		const STATUSBAR_HEIGHT = this.viewCell.layoutInfo.statusBarHeight;


		const editor = this.templateData.editor;
		const editorLayout = this.templateData.editor.getLayoutInfo();
		// If we've already initialized once, we should use the viewCell layout info for editor width.
		// E.g. when resizing VS Code window or notebook editor (horizontal space changes).
		const editorWidth = this._initialized && (reason === 'nbLayoutChange' || reason === 'viewCellLayoutChange') ? this.viewCell.layoutInfo.editorWidth : editorLayout.width;
		const editorHeight = this.viewCell.layoutInfo.editorHeight;
		const scrollTop = this.notebookEditor.scrollTop;
		const elementTop = this.notebookEditor.getAbsoluteTopOfElement(this.viewCell);
		const elementBottom = this.notebookEditor.getAbsoluteBottomOfElement(this.viewCell);
		const elementHeight = this.notebookEditor.getHeightOfElement(this.viewCell);
		const gotContentHeight = editor.getContentHeight();
		const editorContentHeight = Math.max((gotContentHeight === -1 ? editor.getLayoutInfo().height : gotContentHeight), gotContentHeight === -1 ? this._initialEditorDimension.height : gotContentHeight); // || this.calculatedEditorHeight || 0;
		const editorBottom = elementTop + this.viewCell.layoutInfo.outputContainerOffset;
		const scrollBottom = this.notebookEditor.scrollBottom;
		// When loading, scrollBottom -scrollTop === 0;
		const viewportHeight = scrollBottom - scrollTop === 0 ? this.notebookEditor.getLayoutInfo().height : scrollBottom - scrollTop;
		const outputContainerOffset = this.viewCell.layoutInfo.outputContainerOffset;
		const scrollDirection: 'down' | 'up' = typeof this._previousScrollBottom === 'number' ? (scrollBottom < this._previousScrollBottom ? 'up' : 'down') : 'down';
		this._previousScrollBottom = scrollBottom;

		let top = Math.max(0, scrollTop - elementTop - CELL_TOP_MARGIN - CELL_OUTLINE_WIDTH);
		const possibleEditorHeight = editorHeight - top;
		if (possibleEditorHeight < LINE_HEIGHT) {
			top = top - (LINE_HEIGHT - possibleEditorHeight) - CELL_OUTLINE_WIDTH;
		}

		let height = editorContentHeight;
		let editorScrollTop = 0;
		if (scrollTop <= (elementTop + CELL_TOP_MARGIN)) {
			const minimumEditorHeight = LINE_HEIGHT + this.notebookEditor.notebookOptions.getLayoutConfiguration().editorTopPadding;
			if (scrollBottom >= editorBottom) {
				height = clamp(editorContentHeight, minimumEditorHeight, editorContentHeight);
				this._editorVisibility = 'Full';
			} else {
				height = clamp(scrollBottom - (elementTop + CELL_TOP_MARGIN) - STATUSBAR_HEIGHT, minimumEditorHeight, editorContentHeight) + (2 * CELL_OUTLINE_WIDTH); // We don't want bottom border to be visible.;
				this._editorVisibility = 'Bottom Clipped';
				editorScrollTop = 0;
			}
		} else {
			if (viewportHeight <= editorContentHeight && scrollBottom <= editorBottom) {
				const minimumEditorHeight = LINE_HEIGHT + this.notebookEditor.notebookOptions.getLayoutConfiguration().editorTopPadding;
				height = clamp(viewportHeight - STATUSBAR_HEIGHT, minimumEditorHeight, editorContentHeight - STATUSBAR_HEIGHT) + (2 * CELL_OUTLINE_WIDTH); // We don't want bottom border to be visible.
				this._editorVisibility = 'Full (Small Viewport)';
				editorScrollTop = top;
			} else {
				const minimumEditorHeight = LINE_HEIGHT;
				height = clamp(editorContentHeight - (scrollTop - (elementTop + CELL_TOP_MARGIN)), minimumEditorHeight, editorContentHeight);
				// Check if the cell is visible.
				if (scrollTop > editorBottom) {
					this._editorVisibility = 'Invisible';
				} else {
					this._editorVisibility = 'Top Clipped';
				}
				editorScrollTop = editorContentHeight - height;
			}
		}

		this._logService.debug(`${reason} (${this._editorVisibility})`);
		this._logService.debug(`=> Editor Top = ${top}px (editHeight = ${editorHeight}, editContentHeight: ${editorContentHeight})`);
		this._logService.debug(`=> eleTop = ${elementTop}, eleBottom = ${elementBottom}, eleHeight = ${elementHeight}`);
		this._logService.debug(`=> scrollTop = ${scrollTop}, top = ${top}`);
		this._logService.debug(`=> cellTopMargin = ${CELL_TOP_MARGIN}, cellBottomMargin = ${this.viewCell.layoutInfo.topMargin}, cellOutline = ${CELL_OUTLINE_WIDTH}`);
		this._logService.debug(`=> scrollBottom: ${scrollBottom}, editBottom: ${editorBottom}, viewport: ${viewportHeight}, scroll: ${scrollDirection}, contOffset: ${outputContainerOffset})`);
		this._logService.debug(`=> Editor Height = ${height}px, Width: ${editorWidth}px, Initial Width: ${this._initialEditorDimension.width}, EditorScrollTop = ${editorScrollTop}px, StatusbarHeight = ${STATUSBAR_HEIGHT}, lineHeight = ${this.notebookEditor.getLayoutInfo().fontInfo.lineHeight}`);

		try {
			this._isUpdatingLayout = true;
			element.style.top = `${top}px`;
			editor.layout({
				width: this._initialized ? editorWidth : this._initialEditorDimension.width,
				height
			}, true);
			// Option 3: Avoid programmatic scrollTop changes while user is actively dragging selection
			if (!this._pointerDown && editorScrollTop >= 0) {
				this._lastChangedEditorScrolltop = editorScrollTop;
				editor.setScrollTop(editorScrollTop);
			}
		} finally {
			this._initialized = true;
			this._isUpdatingLayout = false;
			this._logService.debug('Updated Editor Layout');
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/codeCellExecutionIcon.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/codeCellExecutionIcon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import { renderLabelWithIcons } from '../../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../../nls.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { ICellViewModel, INotebookEditorDelegate } from '../../notebookBrowser.js';
import { errorStateIcon, executingStateIcon, pendingStateIcon, successStateIcon } from '../../notebookIcons.js';
import { NotebookCellExecutionState, NotebookCellInternalMetadata } from '../../../common/notebookCommon.js';
import { INotebookCellExecution, INotebookExecutionStateService, NotebookExecutionType } from '../../../common/notebookExecutionStateService.js';

interface IExecutionItem {
	text: string;
	tooltip?: string;
}

export class CollapsedCodeCellExecutionIcon extends Disposable {
	private _visible = false;

	constructor(
		_notebookEditor: INotebookEditorDelegate,
		private readonly _cell: ICellViewModel,
		private readonly _element: HTMLElement,
		@INotebookExecutionStateService private _executionStateService: INotebookExecutionStateService,
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

	setVisibility(visible: boolean): void {
		this._visible = visible;
		this._update();
	}

	private _update() {
		if (!this._visible) {
			return;
		}

		const runState = this._executionStateService.getCellExecution(this._cell.uri);
		const item = this._getItemForState(runState, this._cell.model.internalMetadata);
		if (item) {
			this._element.style.display = '';
			DOM.reset(this._element, ...renderLabelWithIcons(item.text));
			this._element.title = item.tooltip ?? '';
		} else {
			this._element.style.display = 'none';
			DOM.reset(this._element);
		}
	}

	private _getItemForState(runState: INotebookCellExecution | undefined, internalMetadata: NotebookCellInternalMetadata): IExecutionItem | undefined {
		const state = runState?.state;
		const { lastRunSuccess } = internalMetadata;
		if (!state && lastRunSuccess) {
			return {
				text: `$(${successStateIcon.id})`,
				tooltip: localize('notebook.cell.status.success', "Success"),
			};
		} else if (!state && lastRunSuccess === false) {
			return {
				text: `$(${errorStateIcon.id})`,
				tooltip: localize('notebook.cell.status.failure', "Failure"),
			};
		} else if (state === NotebookCellExecutionState.Pending || state === NotebookCellExecutionState.Unconfirmed) {
			return {
				text: `$(${pendingStateIcon.id})`,
				tooltip: localize('notebook.cell.status.pending', "Pending"),
			};
		} else if (state === NotebookCellExecutionState.Executing) {
			const icon = ThemeIcon.modify(executingStateIcon, 'spin');
			return {
				text: `$(${icon.id})`,
				tooltip: localize('notebook.cell.status.executing', "Executing"),
			};
		}

		return;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/codeCellRunToolbar.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/codeCellRunToolbar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ToolBar } from '../../../../../../base/browser/ui/toolbar/toolbar.js';
import { Action, IAction } from '../../../../../../base/common/actions.js';
import { DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { MarshalledId } from '../../../../../../base/common/marshallingIds.js';
import { EditorContextKeys } from '../../../../../../editor/common/editorContextKeys.js';
import { localize } from '../../../../../../nls.js';
import { DropdownWithPrimaryActionViewItem } from '../../../../../../platform/actions/browser/dropdownWithPrimaryActionViewItem.js';
import { getActionBarActions } from '../../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenu, IMenuService, MenuId, MenuItemAction } from '../../../../../../platform/actions/common/actions.js';
import { IContextKeyService, IScopedContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { InputFocusedContext } from '../../../../../../platform/contextkey/common/contextkeys.js';
import { IContextMenuService } from '../../../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../../platform/keybinding/common/keybinding.js';
import { INotebookCellActionContext } from '../../controller/coreActions.js';
import { ICellViewModel, INotebookEditorDelegate } from '../../notebookBrowser.js';
import { CellContentPart } from '../cellPart.js';
import { registerCellToolbarStickyScroll } from './cellToolbarStickyScroll.js';
import { NOTEBOOK_CELL_EXECUTION_STATE, NOTEBOOK_CELL_LIST_FOCUSED, NOTEBOOK_CELL_TYPE, NOTEBOOK_EDITOR_FOCUSED } from '../../../common/notebookContextKeys.js';

export class RunToolbar extends CellContentPart {
	private toolbar!: ToolBar;

	private primaryMenu: IMenu;
	private secondaryMenu: IMenu;

	constructor(
		readonly notebookEditor: INotebookEditorDelegate,
		readonly contextKeyService: IContextKeyService,
		readonly cellContainer: HTMLElement,
		readonly runButtonContainer: HTMLElement,
		primaryMenuId: MenuId,
		secondaryMenuId: MenuId,
		@IMenuService menuService: IMenuService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		this.primaryMenu = this._register(menuService.createMenu(primaryMenuId, contextKeyService));
		this.secondaryMenu = this._register(menuService.createMenu(secondaryMenuId, contextKeyService));
		this.createRunCellToolbar(runButtonContainer, cellContainer, contextKeyService);
		const updateActions = () => {
			const actions = this.getCellToolbarActions(this.primaryMenu);
			const primary = actions.primary[0]; // Only allow one primary action
			this.toolbar.setActions(primary ? [primary] : []);
		};
		updateActions();
		this._register(this.primaryMenu.onDidChange(updateActions));
		this._register(this.secondaryMenu.onDidChange(updateActions));
		this._register(this.notebookEditor.notebookOptions.onDidChangeOptions(updateActions));
	}

	override didRenderCell(element: ICellViewModel): void {
		this.cellDisposables.add(registerCellToolbarStickyScroll(this.notebookEditor, element, this.runButtonContainer));

		if (this.notebookEditor.hasModel()) {
			const context: INotebookCellActionContext & { $mid: number } = {
				ui: true,
				cell: element,
				notebookEditor: this.notebookEditor,
				$mid: MarshalledId.NotebookCellActionContext
			};
			this.toolbar.context = context;
		}
	}

	getCellToolbarActions(menu: IMenu): { primary: IAction[]; secondary: IAction[] } {
		return getActionBarActions(menu.getActions({ shouldForwardArgs: true }), g => /^inline/.test(g));
	}

	private createRunCellToolbar(container: HTMLElement, cellContainer: HTMLElement, contextKeyService: IContextKeyService) {
		const actionViewItemDisposables = this._register(new DisposableStore());
		const dropdownAction = this._register(new Action('notebook.moreRunActions', localize('notebook.moreRunActionsLabel', "More..."), 'codicon-chevron-down', true));

		const keybindingProvider = (action: IAction) => this.keybindingService.lookupKeybinding(action.id, executionContextKeyService);
		const executionContextKeyService = this._register(getCodeCellExecutionContextKeyService(contextKeyService));
		this.toolbar = this._register(new ToolBar(container, this.contextMenuService, {
			getKeyBinding: keybindingProvider,
			actionViewItemProvider: (_action, _options) => {
				actionViewItemDisposables.clear();

				const primary = this.getCellToolbarActions(this.primaryMenu).primary[0];
				if (!(primary instanceof MenuItemAction)) {
					return undefined;
				}

				const secondary = this.getCellToolbarActions(this.secondaryMenu).secondary;
				if (!secondary.length) {
					return undefined;
				}

				const item = this.instantiationService.createInstance(DropdownWithPrimaryActionViewItem,
					primary,
					dropdownAction,
					secondary,
					'notebook-cell-run-toolbar',
					{
						..._options,
						getKeyBinding: keybindingProvider
					});
				actionViewItemDisposables.add(item.onDidChangeDropdownVisibility(visible => {
					cellContainer.classList.toggle('cell-run-toolbar-dropdown-active', visible);
				}));

				return item;
			},
			renderDropdownAsChildElement: true
		}));
	}
}

export function getCodeCellExecutionContextKeyService(contextKeyService: IContextKeyService): IScopedContextKeyService {
	// Create a fake ContextKeyService, and look up the keybindings within this context.
	const executionContextKeyService = contextKeyService.createScoped(document.createElement('div'));
	InputFocusedContext.bindTo(executionContextKeyService).set(true);
	EditorContextKeys.editorTextFocus.bindTo(executionContextKeyService).set(true);
	EditorContextKeys.focus.bindTo(executionContextKeyService).set(true);
	EditorContextKeys.textInputFocus.bindTo(executionContextKeyService).set(true);
	NOTEBOOK_CELL_EXECUTION_STATE.bindTo(executionContextKeyService).set('idle');
	NOTEBOOK_CELL_LIST_FOCUSED.bindTo(executionContextKeyService).set(true);
	NOTEBOOK_EDITOR_FOCUSED.bindTo(executionContextKeyService).set(true);
	NOTEBOOK_CELL_TYPE.bindTo(executionContextKeyService).set('code');

	return executionContextKeyService;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/collapsedCellInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/collapsedCellInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import { INotebookEditor } from '../../notebookBrowser.js';
import { CellContentPart } from '../cellPart.js';

export class CollapsedCellInput extends CellContentPart {
	constructor(
		private readonly notebookEditor: INotebookEditor,
		cellInputCollapsedContainer: HTMLElement,
	) {
		super();

		this._register(DOM.addDisposableListener(cellInputCollapsedContainer, DOM.EventType.DBLCLICK, e => {
			if (!this.currentCell || !this.notebookEditor.hasModel()) {
				return;
			}

			if (this.currentCell.isInputCollapsed) {
				this.currentCell.isInputCollapsed = false;
			} else {
				this.currentCell.isOutputCollapsed = false;
			}
		}));

		this._register(DOM.addDisposableListener(cellInputCollapsedContainer, DOM.EventType.CLICK, e => {
			if (!this.currentCell || !this.notebookEditor.hasModel()) {
				return;
			}

			const element = e.target as HTMLElement;

			if (element && element.classList && element.classList.contains('expandInputIcon')) {
				// clicked on the expand icon
				this.currentCell.isInputCollapsed = false;
			}
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/collapsedCellOutput.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/collapsedCellOutput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { localize } from '../../../../../../nls.js';
import { IKeybindingService } from '../../../../../../platform/keybinding/common/keybinding.js';
import { EXPAND_CELL_OUTPUT_COMMAND_ID, INotebookEditor } from '../../notebookBrowser.js';
import { CellContentPart } from '../cellPart.js';

const $ = DOM.$;

export class CollapsedCellOutput extends CellContentPart {
	constructor(
		private readonly notebookEditor: INotebookEditor,
		cellOutputCollapseContainer: HTMLElement,
		@IKeybindingService keybindingService: IKeybindingService
	) {
		super();

		const placeholder = DOM.append(cellOutputCollapseContainer, $('span.expandOutputPlaceholder')) as HTMLElement;
		placeholder.textContent = localize('cellOutputsCollapsedMsg', "Outputs are collapsed");
		const expandIcon = DOM.append(cellOutputCollapseContainer, $('span.expandOutputIcon'));
		expandIcon.classList.add(...ThemeIcon.asClassNameArray(Codicon.more));

		const keybinding = keybindingService.lookupKeybinding(EXPAND_CELL_OUTPUT_COMMAND_ID);
		if (keybinding) {
			placeholder.title = localize('cellExpandOutputButtonLabelWithDoubleClick', "Double-click to expand cell output ({0})", keybinding.getLabel());
			cellOutputCollapseContainer.title = localize('cellExpandOutputButtonLabel', "Expand Cell Output (${0})", keybinding.getLabel());
		}

		DOM.hide(cellOutputCollapseContainer);

		this._register(DOM.addDisposableListener(expandIcon, DOM.EventType.CLICK, () => this.expand()));
		this._register(DOM.addDisposableListener(cellOutputCollapseContainer, DOM.EventType.DBLCLICK, () => this.expand()));
	}

	private expand() {
		if (!this.currentCell) {
			return;
		}

		if (!this.currentCell) {
			return;
		}

		const textModel = this.notebookEditor.textModel!;
		const index = textModel.cells.indexOf(this.currentCell.model);

		if (index < 0) {
			return;
		}

		this.currentCell.isOutputCollapsed = !this.currentCell.isOutputCollapsed;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/foldedCellHint.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/foldedCellHint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { localize } from '../../../../../../nls.js';
import { FoldingController } from '../../controller/foldingController.js';
import { CellEditState, CellFoldingState, INotebookEditor } from '../../notebookBrowser.js';
import { CellContentPart } from '../cellPart.js';
import { MarkupCellViewModel } from '../../viewModel/markupCellViewModel.js';
import { ICellRange } from '../../../common/notebookRange.js';
import { executingStateIcon } from '../../notebookIcons.js';
import { INotebookExecutionStateService } from '../../../common/notebookExecutionStateService.js';
import { CellKind, NotebookCellExecutionState } from '../../../common/notebookCommon.js';
import { MutableDisposable } from '../../../../../../base/common/lifecycle.js';

export class FoldedCellHint extends CellContentPart {

	private readonly _runButtonListener = this._register(new MutableDisposable());
	private readonly _cellExecutionListener = this._register(new MutableDisposable());

	constructor(
		private readonly _notebookEditor: INotebookEditor,
		private readonly _container: HTMLElement,
		@INotebookExecutionStateService private readonly _notebookExecutionStateService: INotebookExecutionStateService
	) {
		super();
	}

	override didRenderCell(element: MarkupCellViewModel): void {
		this.update(element);
	}

	private update(element: MarkupCellViewModel) {
		if (!this._notebookEditor.hasModel()) {
			this._cellExecutionListener.clear();
			this._runButtonListener.clear();
			return;
		}

		if (element.isInputCollapsed || element.getEditState() === CellEditState.Editing) {
			this._cellExecutionListener.clear();
			this._runButtonListener.clear();
			DOM.hide(this._container);
		} else if (element.foldingState === CellFoldingState.Collapsed) {
			const idx = this._notebookEditor.getViewModel().getCellIndex(element);
			const length = this._notebookEditor.getViewModel().getFoldedLength(idx);

			const runSectionButton = this.getRunFoldedSectionButton({ start: idx, end: idx + length + 1 });
			if (!runSectionButton) {
				DOM.reset(this._container, this.getHiddenCellsLabel(length), this.getHiddenCellHintButton(element));
			} else {
				DOM.reset(this._container, runSectionButton, this.getHiddenCellsLabel(length), this.getHiddenCellHintButton(element));
			}

			DOM.show(this._container);

			const foldHintTop = element.layoutInfo.previewHeight;
			this._container.style.top = `${foldHintTop}px`;
		} else {
			this._cellExecutionListener.clear();
			this._runButtonListener.clear();
			DOM.hide(this._container);
		}
	}

	private getHiddenCellsLabel(num: number): HTMLElement {
		const label = num === 1 ?
			localize('hiddenCellsLabel', "1 cell hidden") :
			localize('hiddenCellsLabelPlural', "{0} cells hidden", num);

		return DOM.$('span.notebook-folded-hint-label', undefined, label);
	}

	private getHiddenCellHintButton(element: MarkupCellViewModel): HTMLElement {
		const expandIcon = DOM.$('span.cell-expand-part-button');
		expandIcon.classList.add(...ThemeIcon.asClassNameArray(Codicon.more));
		this._register(DOM.addDisposableListener(expandIcon, DOM.EventType.CLICK, () => {
			const controller = this._notebookEditor.getContribution<FoldingController>(FoldingController.id);
			const idx = this._notebookEditor.getCellIndex(element);
			if (typeof idx === 'number') {
				controller.setFoldingStateDown(idx, CellFoldingState.Expanded, 1);
			}
		}));

		return expandIcon;
	}

	private getRunFoldedSectionButton(range: ICellRange): HTMLElement | undefined {
		const runAllContainer = DOM.$('span.folded-cell-run-section-button');
		const cells = this._notebookEditor.getCellsInRange(range);

		// Check if any cells are code cells, if not, we won't show the run button
		const hasCodeCells = cells.some(cell => cell.cellKind === CellKind.Code);
		if (!hasCodeCells) {
			return undefined;
		}

		const isRunning = cells.some(cell => {
			const cellExecution = this._notebookExecutionStateService.getCellExecution(cell.uri);
			return cellExecution && cellExecution.state === NotebookCellExecutionState.Executing;
		});

		const runAllIcon = isRunning ?
			ThemeIcon.modify(executingStateIcon, 'spin') :
			Codicon.play;
		runAllContainer.classList.add(...ThemeIcon.asClassNameArray(runAllIcon));

		this._runButtonListener.value = DOM.addDisposableListener(runAllContainer, DOM.EventType.CLICK, () => {
			this._notebookEditor.executeNotebookCells(cells);
		});

		this._cellExecutionListener.value = this._notebookExecutionStateService.onDidChangeExecution(() => {
			const isRunning = cells.some(cell => {
				const cellExecution = this._notebookExecutionStateService.getCellExecution(cell.uri);
				return cellExecution && cellExecution.state === NotebookCellExecutionState.Executing;
			});

			const runAllIcon = isRunning ?
				ThemeIcon.modify(executingStateIcon, 'spin') :
				Codicon.play;
			runAllContainer.className = '';
			runAllContainer.classList.add('folded-cell-run-section-button', ...ThemeIcon.asClassNameArray(runAllIcon));
		});

		return runAllContainer;
	}

	override updateInternalLayoutNow(element: MarkupCellViewModel) {
		this.update(element);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/markupCell.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/markupCell.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import * as domSanitize from '../../../../../../base/browser/domSanitize.js';
import { renderIcon } from '../../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { disposableTimeout, raceCancellation } from '../../../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { Disposable, DisposableStore, MutableDisposable, toDisposable } from '../../../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../../../editor/browser/editorBrowser.js';
import { CodeEditorWidget } from '../../../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { IEditorOptions } from '../../../../../../editor/common/config/editorOptions.js';
import { EditorContextKeys } from '../../../../../../editor/common/editorContextKeys.js';
import { ILanguageService } from '../../../../../../editor/common/languages/language.js';
import { tokenizeToStringSync } from '../../../../../../editor/common/languages/textToHtmlTokenizer.js';
import { IReadonlyTextBuffer } from '../../../../../../editor/common/model.js';
import { localize } from '../../../../../../nls.js';
import { IAccessibilityService } from '../../../../../../platform/accessibility/common/accessibility.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../../../platform/instantiation/common/serviceCollection.js';
import { IKeybindingService } from '../../../../../../platform/keybinding/common/keybinding.js';
import { CellEditState, CellFocusMode, CellFoldingState, EXPAND_CELL_INPUT_COMMAND_ID, IActiveNotebookEditorDelegate, ICellViewModel } from '../../notebookBrowser.js';
import { collapsedIcon, expandedIcon } from '../../notebookIcons.js';
import { CellEditorOptions } from './cellEditorOptions.js';
import { collapsedCellTTPolicy, MarkdownCellRenderTemplate } from '../notebookRenderingCommon.js';
import { MarkupCellViewModel } from '../../viewModel/markupCellViewModel.js';
import { WordHighlighterContribution } from '../../../../../../editor/contrib/wordHighlighter/browser/wordHighlighter.js';

export class MarkupCell extends Disposable {

	private editor: CodeEditorWidget | null = null;

	private markdownAccessibilityContainer!: HTMLElement;
	private editorPart: HTMLElement;

	private readonly localDisposables = this._register(new DisposableStore());
	private readonly focusSwitchDisposable = this._register(new MutableDisposable());
	private readonly editorDisposables = this._register(new DisposableStore());
	private foldingState: CellFoldingState;
	private cellEditorOptions: CellEditorOptions;
	private editorOptions: IEditorOptions;
	private _isDisposed: boolean = false;

	constructor(
		private readonly notebookEditor: IActiveNotebookEditorDelegate,
		private readonly viewCell: MarkupCellViewModel,
		private readonly templateData: MarkdownCellRenderTemplate,
		private readonly renderedEditors: Map<ICellViewModel, ICodeEditor | undefined>,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IConfigurationService private configurationService: IConfigurationService,
		@IKeybindingService private keybindingService: IKeybindingService,
	) {
		super();

		this.constructDOM();
		this.editorPart = templateData.editorPart;
		this.cellEditorOptions = this._register(new CellEditorOptions(this.notebookEditor.getBaseCellEditorOptions(viewCell.language), this.notebookEditor.notebookOptions, this.configurationService));
		this.cellEditorOptions.setLineNumbers(this.viewCell.lineNumbers);
		this.editorOptions = this.cellEditorOptions.getValue(this.viewCell.internalMetadata, this.viewCell.uri);

		this._register(toDisposable(() => renderedEditors.delete(this.viewCell)));
		this.registerListeners();

		// update for init state
		this.templateData.cellParts.scheduleRenderCell(this.viewCell);

		this._register(toDisposable(() => {
			this.templateData.cellParts.unrenderCell(this.viewCell);
		}));

		this._register(this.accessibilityService.onDidChangeScreenReaderOptimized(() => {
			this.viewUpdate();
		}));

		this.updateForHover();
		this.updateForFocusModeChange();
		this.foldingState = viewCell.foldingState;
		this.layoutFoldingIndicator();
		this.updateFoldingIconShowClass();

		// the markdown preview's height might already be updated after the renderer calls `element.getHeight()`
		if (this.viewCell.layoutInfo.totalHeight > 0) {
			this.relayoutCell();
		}

		this.viewUpdate();

		this.layoutCellParts();
		this._register(this.viewCell.onDidChangeLayout(() => {
			this.layoutCellParts();
		}));
	}

	layoutCellParts() {
		this.templateData.cellParts.updateInternalLayoutNow(this.viewCell);
	}

	private constructDOM() {
		// Create an element that is only used to announce markup cell content to screen readers
		const id = `aria-markup-cell-${this.viewCell.id}`;
		this.markdownAccessibilityContainer = this.templateData.cellContainer;
		this.markdownAccessibilityContainer.id = id;
		// Hide the element from non-screen readers
		this.markdownAccessibilityContainer.style.height = '1px';
		this.markdownAccessibilityContainer.style.overflow = 'hidden';
		this.markdownAccessibilityContainer.style.position = 'absolute';
		this.markdownAccessibilityContainer.style.top = '100000px';
		this.markdownAccessibilityContainer.style.left = '10000px';
		this.markdownAccessibilityContainer.ariaHidden = 'false';

		this.templateData.rootContainer.setAttribute('aria-describedby', id);
		this.templateData.container.classList.toggle('webview-backed-markdown-cell', true);
	}

	private registerListeners() {
		this._register(this.viewCell.onDidChangeState(e => {
			this.templateData.cellParts.updateState(this.viewCell, e);
		}));

		this._register(this.viewCell.model.onDidChangeMetadata(() => {
			this.viewUpdate();
		}));

		this._register(this.viewCell.onDidChangeState((e) => {
			if (e.editStateChanged || e.contentChanged) {
				this.viewUpdate();
			}

			if (e.focusModeChanged) {
				this.updateForFocusModeChange();
			}

			if (e.foldingStateChanged) {
				const foldingState = this.viewCell.foldingState;

				if (foldingState !== this.foldingState) {
					this.foldingState = foldingState;
					this.layoutFoldingIndicator();
				}
			}

			if (e.cellIsHoveredChanged) {
				this.updateForHover();
			}

			if (e.inputCollapsedChanged) {
				this.updateCollapsedState();
				this.viewUpdate();
			}

			if (e.cellLineNumberChanged) {
				this.cellEditorOptions.setLineNumbers(this.viewCell.lineNumbers);
			}
		}));

		this._register(this.notebookEditor.notebookOptions.onDidChangeOptions(e => {
			if (e.showFoldingControls) {
				this.updateFoldingIconShowClass();
			}
		}));

		this._register(this.viewCell.onDidChangeLayout((e) => {
			const layoutInfo = this.editor?.getLayoutInfo();
			if (e.outerWidth && this.viewCell.getEditState() === CellEditState.Editing && layoutInfo && layoutInfo.width !== this.viewCell.layoutInfo.editorWidth) {
				this.onCellEditorWidthChange();
			}
		}));

		this._register(this.cellEditorOptions.onDidChange(() => this.updateMarkupCellOptions()));
	}

	private updateMarkupCellOptions(): void {
		this.updateEditorOptions(this.cellEditorOptions.getUpdatedValue(this.viewCell.internalMetadata, this.viewCell.uri));

		if (this.editor) {
			this.editor.updateOptions(this.cellEditorOptions.getUpdatedValue(this.viewCell.internalMetadata, this.viewCell.uri));

			const cts = new CancellationTokenSource();
			this._register({ dispose() { cts.dispose(true); } });
			raceCancellation(this.viewCell.resolveTextModel(), cts.token).then(model => {
				if (this._isDisposed) {
					return;
				}

				if (model) {
					model.updateOptions({
						indentSize: this.cellEditorOptions.indentSize,
						tabSize: this.cellEditorOptions.tabSize,
						insertSpaces: this.cellEditorOptions.insertSpaces,
					});
				}
			});
		}
	}

	private updateCollapsedState() {
		if (this.viewCell.isInputCollapsed) {
			this.notebookEditor.hideMarkupPreviews([this.viewCell]);
		} else {
			this.notebookEditor.unhideMarkupPreviews([this.viewCell]);
		}
	}

	private updateForHover(): void {
		this.templateData.container.classList.toggle('markdown-cell-hover', this.viewCell.cellIsHovered);
	}

	private updateForFocusModeChange() {
		if (this.viewCell.focusMode === CellFocusMode.Editor) {
			this.focusEditorIfNeeded();
		}

		this.templateData.container.classList.toggle('cell-editor-focus', this.viewCell.focusMode === CellFocusMode.Editor);
	}

	override dispose() {
		this._isDisposed = true;

		// move focus back to the cell list otherwise the focus goes to body
		if (this.notebookEditor.getActiveCell() === this.viewCell && this.viewCell.focusMode === CellFocusMode.Editor && (this.notebookEditor.hasEditorFocus() || this.notebookEditor.getDomNode().ownerDocument.activeElement === this.notebookEditor.getDomNode().ownerDocument.body)) {
			this.notebookEditor.focusContainer();
		}

		this.viewCell.detachTextEditor();
		super.dispose();
	}

	private updateFoldingIconShowClass() {
		const showFoldingIcon = this.notebookEditor.notebookOptions.getDisplayOptions().showFoldingControls;
		this.templateData.foldingIndicator.classList.remove('mouseover', 'always');
		this.templateData.foldingIndicator.classList.add(showFoldingIcon);
	}

	private viewUpdate(): void {
		if (this.viewCell.isInputCollapsed) {
			this.viewUpdateCollapsed();
		} else if (this.viewCell.getEditState() === CellEditState.Editing) {
			this.viewUpdateEditing();
		} else {
			this.viewUpdatePreview();
		}
	}

	private viewUpdateCollapsed(): void {
		DOM.show(this.templateData.cellInputCollapsedContainer);
		DOM.hide(this.editorPart);

		this.templateData.cellInputCollapsedContainer.innerText = '';

		const markdownIcon = DOM.append(this.templateData.cellInputCollapsedContainer, DOM.$('span'));
		markdownIcon.classList.add(...ThemeIcon.asClassNameArray(Codicon.markdown));

		const element = DOM.$('div');
		element.classList.add('cell-collapse-preview');
		const richEditorText = this.getRichText(this.viewCell.textBuffer, this.viewCell.language);
		element.innerText = richEditorText;
		element.innerHTML = (collapsedCellTTPolicy?.createHTML(richEditorText) ?? richEditorText) as string;
		this.templateData.cellInputCollapsedContainer.appendChild(element);

		const expandIcon = DOM.append(element, DOM.$('span.expandInputIcon'));
		expandIcon.classList.add(...ThemeIcon.asClassNameArray(Codicon.more));
		const keybinding = this.keybindingService.lookupKeybinding(EXPAND_CELL_INPUT_COMMAND_ID);
		if (keybinding) {
			element.title = localize('cellExpandInputButtonLabelWithDoubleClick', "Double-click to expand cell input ({0})", keybinding.getLabel());
			expandIcon.title = localize('cellExpandInputButtonLabel', "Expand Cell Input ({0})", keybinding.getLabel());
		}

		this.markdownAccessibilityContainer.ariaHidden = 'true';

		this.templateData.container.classList.toggle('input-collapsed', true);
		this.viewCell.renderedMarkdownHeight = 0;
		this.viewCell.layoutChange({});
	}


	private getRichText(buffer: IReadonlyTextBuffer, language: string) {
		return tokenizeToStringSync(this.languageService, buffer.getLineContent(1), language);
	}

	private viewUpdateEditing(): void {
		// switch to editing mode
		let editorHeight: number;

		DOM.show(this.editorPart);
		this.markdownAccessibilityContainer.ariaHidden = 'true';
		DOM.hide(this.templateData.cellInputCollapsedContainer);

		this.notebookEditor.hideMarkupPreviews([this.viewCell]);

		this.templateData.container.classList.toggle('input-collapsed', false);
		this.templateData.container.classList.toggle('markdown-cell-edit-mode', true);

		if (this.editor && this.editor.hasModel()) {
			editorHeight = this.editor.getContentHeight();

			// not first time, we don't need to create editor
			this.viewCell.attachTextEditor(this.editor);
			this.focusEditorIfNeeded();

			this.bindEditorListeners(this.editor);

			this.editor.layout({
				width: this.viewCell.layoutInfo.editorWidth,
				height: editorHeight
			});
		} else {
			this.editorDisposables.clear();
			const width = this.notebookEditor.notebookOptions.computeMarkdownCellEditorWidth(this.notebookEditor.getLayoutInfo().width);
			const lineNum = this.viewCell.lineCount;
			const lineHeight = this.viewCell.layoutInfo.fontInfo?.lineHeight || 17;
			const editorPadding = this.notebookEditor.notebookOptions.computeEditorPadding(this.viewCell.internalMetadata, this.viewCell.uri);
			editorHeight = Math.max(lineNum, 1) * lineHeight + editorPadding.top + editorPadding.bottom;

			this.templateData.editorContainer.innerText = '';

			// create a special context key service that set the inCompositeEditor-contextkey
			const editorContextKeyService = this.contextKeyService.createScoped(this.templateData.editorPart);
			EditorContextKeys.inCompositeEditor.bindTo(editorContextKeyService).set(true);
			const editorInstaService = this.editorDisposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, editorContextKeyService])));
			this.editorDisposables.add(editorContextKeyService);

			this.editor = this.editorDisposables.add(editorInstaService.createInstance(CodeEditorWidget, this.templateData.editorContainer, {
				...this.editorOptions,
				dimension: {
					width: width,
					height: editorHeight
				},
				allowVariableLineHeights: false,
				// overflowWidgetsDomNode: this.notebookEditor.getOverflowContainerDomNode()
			}, {
				contributions: this.notebookEditor.creationOptions.cellEditorContributions
			}));
			this.templateData.currentEditor = this.editor;
			this.editorDisposables.add(this.editor.onDidBlurEditorWidget(() => {
				if (this.editor) {
					WordHighlighterContribution.get(this.editor)?.stopHighlighting();
				}
			}));
			this.editorDisposables.add(this.editor.onDidFocusEditorWidget(() => {
				if (this.editor) {
					WordHighlighterContribution.get(this.editor)?.restoreViewState(true);
				}
			}));

			const cts = new CancellationTokenSource();
			this.editorDisposables.add({ dispose() { cts.dispose(true); } });
			raceCancellation(this.viewCell.resolveTextModel(), cts.token).then(model => {
				if (!model) {
					return;
				}

				this.editor!.setModel(model);
				model.updateOptions({
					indentSize: this.cellEditorOptions.indentSize,
					tabSize: this.cellEditorOptions.tabSize,
					insertSpaces: this.cellEditorOptions.insertSpaces,
				});

				const realContentHeight = this.editor!.getContentHeight();
				if (realContentHeight !== editorHeight) {
					this.editor!.layout(
						{
							width: width,
							height: realContentHeight
						}
					);
					editorHeight = realContentHeight;
				}

				this.viewCell.attachTextEditor(this.editor!);

				if (this.viewCell.getEditState() === CellEditState.Editing) {
					this.focusEditorIfNeeded();
				}

				this.bindEditorListeners(this.editor!);

				this.viewCell.editorHeight = editorHeight;
			});
		}

		this.viewCell.editorHeight = editorHeight;
		this.focusEditorIfNeeded();
		this.renderedEditors.set(this.viewCell, this.editor);
	}

	private viewUpdatePreview(): void {
		this.viewCell.detachTextEditor();
		DOM.hide(this.editorPart);
		DOM.hide(this.templateData.cellInputCollapsedContainer);
		this.markdownAccessibilityContainer.ariaHidden = 'false';
		this.templateData.container.classList.toggle('input-collapsed', false);
		this.templateData.container.classList.toggle('markdown-cell-edit-mode', false);

		this.renderedEditors.delete(this.viewCell);

		this.markdownAccessibilityContainer.innerText = '';
		if (this.viewCell.renderedHtml) {
			if (this.accessibilityService.isScreenReaderOptimized()) {
				domSanitize.safeSetInnerHtml(this.markdownAccessibilityContainer, this.viewCell.renderedHtml);
			} else {
				DOM.clearNode(this.markdownAccessibilityContainer);
			}
		}

		this.notebookEditor.createMarkupPreview(this.viewCell);
	}

	private focusEditorIfNeeded() {
		if (this.viewCell.focusMode === CellFocusMode.Editor &&
			(this.notebookEditor.hasEditorFocus() || this.notebookEditor.getDomNode().ownerDocument.activeElement === this.notebookEditor.getDomNode().ownerDocument.body)
		) { // Don't steal focus from other workbench parts, but if body has focus, we can take it
			if (!this.editor) {
				return;
			}

			this.editor.focus();

			const primarySelection = this.editor.getSelection();
			if (!primarySelection) {
				return;
			}

			this.notebookEditor.revealRangeInViewAsync(this.viewCell, primarySelection);
		}
	}

	private layoutEditor(dimension: DOM.IDimension): void {
		this.editor?.layout(dimension);
	}

	private onCellEditorWidthChange(): void {
		const realContentHeight = this.editor!.getContentHeight();
		this.layoutEditor(
			{
				width: this.viewCell.layoutInfo.editorWidth,
				height: realContentHeight
			}
		);

		// LET the content size observer to handle it
		// this.viewCell.editorHeight = realContentHeight;
		// this.relayoutCell();
	}

	relayoutCell(): void {
		this.notebookEditor.layoutNotebookCell(this.viewCell, this.viewCell.layoutInfo.totalHeight);
		this.layoutFoldingIndicator();
	}

	updateEditorOptions(newValue: IEditorOptions): void {
		this.editorOptions = newValue;
		this.editor?.updateOptions(this.editorOptions);
	}

	private layoutFoldingIndicator() {
		switch (this.foldingState) {
			case CellFoldingState.None:
				this.templateData.foldingIndicator.style.display = 'none';
				this.templateData.foldingIndicator.innerText = '';
				break;
			case CellFoldingState.Collapsed:
				this.templateData.foldingIndicator.style.display = '';
				DOM.reset(this.templateData.foldingIndicator, renderIcon(collapsedIcon));
				break;
			case CellFoldingState.Expanded:
				this.templateData.foldingIndicator.style.display = '';
				DOM.reset(this.templateData.foldingIndicator, renderIcon(expandedIcon));
				break;

			default:
				break;
		}
	}

	private bindEditorListeners(editor: CodeEditorWidget) {

		this.localDisposables.clear();
		this.focusSwitchDisposable.clear();

		this.localDisposables.add(editor.onDidContentSizeChange(e => {
			if (e.contentHeightChanged) {
				this.onCellEditorHeightChange(editor, e.contentHeight);
			}
		}));

		this.localDisposables.add(editor.onDidChangeCursorSelection((e) => {
			if (e.source === 'restoreState') {
				// do not reveal the cell into view if this selection change was caused by restoring editors...
				return;
			}

			const selections = editor.getSelections();

			if (selections?.length) {
				const contentHeight = editor.getContentHeight();
				const layoutContentHeight = this.viewCell.layoutInfo.editorHeight;

				if (contentHeight !== layoutContentHeight) {
					this.onCellEditorHeightChange(editor, contentHeight);
				}
				const lastSelection = selections[selections.length - 1];
				this.notebookEditor.revealRangeInViewAsync(this.viewCell, lastSelection);
			}
		}));

		const updateFocusMode = () => this.viewCell.focusMode = editor.hasWidgetFocus() ? CellFocusMode.Editor : CellFocusMode.Container;
		this.localDisposables.add(editor.onDidFocusEditorWidget(() => {
			updateFocusMode();
		}));

		this.localDisposables.add(editor.onDidBlurEditorWidget(() => {
			// this is for a special case:
			// users click the status bar empty space, which we will then focus the editor
			// so we don't want to update the focus state too eagerly
			if (this.templateData.container.ownerDocument.activeElement?.contains(this.templateData.container)) {
				this.focusSwitchDisposable.value = disposableTimeout(() => updateFocusMode(), 300);
			} else {
				updateFocusMode();
			}
		}));

		updateFocusMode();
	}

	private onCellEditorHeightChange(editor: CodeEditorWidget, newHeight: number): void {
		const viewLayout = editor.getLayoutInfo();
		this.viewCell.editorHeight = newHeight;
		editor.layout(
			{
				width: viewLayout.width,
				height: newHeight
			}
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/chat/cellChatPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/chat/cellChatPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICellViewModel, INotebookEditorDelegate } from '../../../notebookBrowser.js';
import { CellContentPart } from '../../cellPart.js';

export class CellChatPart extends CellContentPart {
	// private _controller: NotebookCellChatController | undefined;

	get activeCell() {
		return this.currentCell;
	}

	constructor(
		_notebookEditor: INotebookEditorDelegate,
		_partContainer: HTMLElement,
	) {
		super();
	}

	override didRenderCell(element: ICellViewModel): void {
		super.didRenderCell(element);
	}

	override unrenderCell(element: ICellViewModel): void {
		super.unrenderCell(element);
	}

	override updateInternalLayoutNow(element: ICellViewModel): void {
	}

	override dispose() {
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

````
