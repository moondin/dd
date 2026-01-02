---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 419
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 419 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/diffComponents.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/diffComponents.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../base/browser/dom.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { DiffElementCellViewModelBase, getFormattedOutputJSON, OutputComparison, outputEqual, OUTPUT_EDITOR_HEIGHT_MAGIC, PropertyFoldingState, SideBySideDiffElementViewModel, SingleSideDiffElementViewModel, DiffElementPlaceholderViewModel, IDiffElementViewModelBase, NotebookDocumentMetadataViewModel } from './diffElementViewModel.js';
import { CellDiffSideBySideRenderTemplate, CellDiffSingleSideRenderTemplate, DiffSide, DIFF_CELL_MARGIN, INotebookTextDiffEditor, NOTEBOOK_DIFF_CELL_INPUT, NOTEBOOK_DIFF_CELL_PROPERTY, NOTEBOOK_DIFF_CELL_PROPERTY_EXPANDED, CellDiffPlaceholderRenderTemplate, IDiffCellMarginOverlay, NOTEBOOK_DIFF_CELL_IGNORE_WHITESPACE, NotebookDocumentDiffElementRenderTemplate, NOTEBOOK_DIFF_METADATA } from './notebookDiffEditorBrowser.js';
import { CodeEditorWidget, ICodeEditorWidgetOptions } from '../../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { CellEditType, CellUri, NotebookCellMetadata } from '../../common/notebookCommon.js';
import { ToolBar } from '../../../../../base/browser/ui/toolbar/toolbar.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IMenu, IMenuService, MenuId, MenuItemAction } from '../../../../../platform/actions/common/actions.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { getFlatActionBarActions } from '../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { CodiconActionViewItem } from '../view/cellParts/cellActionView.js';
import { collapsedIcon, expandedIcon } from '../notebookIcons.js';
import { OutputContainer } from './diffElementOutputs.js';
import { EditorExtensionsRegistry } from '../../../../../editor/browser/editorExtensions.js';
import { ContextMenuController } from '../../../../../editor/contrib/contextmenu/browser/contextmenu.js';
import { SnippetController2 } from '../../../../../editor/contrib/snippet/browser/snippetController2.js';
import { SuggestController } from '../../../../../editor/contrib/suggest/browser/suggestController.js';
import { MenuPreventer } from '../../../codeEditor/browser/menuPreventer.js';
import { SelectionClipboardContributionID } from '../../../codeEditor/browser/selectionClipboard.js';
import { TabCompletionController } from '../../../snippets/browser/tabCompletion.js';
import { renderIcon, renderLabelWithIcons } from '../../../../../base/browser/ui/iconLabel/iconLabels.js';
import * as editorCommon from '../../../../../editor/common/editorCommon.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { WorkbenchToolBar } from '../../../../../platform/actions/browser/toolbar.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { fixedDiffEditorOptions, fixedEditorOptions, getEditorPadding } from './diffCellEditorOptions.js';
import { AccessibilityVerbositySettingId } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { IAccessibilityService } from '../../../../../platform/accessibility/common/accessibility.js';
import { DiffEditorWidget } from '../../../../../editor/browser/widget/diffEditor/diffEditorWidget.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { DiffNestedCellViewModel } from './diffNestedCellViewModel.js';
import { localize } from '../../../../../nls.js';
import { Emitter } from '../../../../../base/common/event.js';
import { ITextResourceConfigurationService } from '../../../../../editor/common/services/textResourceConfiguration.js';
import { getFormattedMetadataJSON } from '../../common/model/notebookCellTextModel.js';
import { IDiffEditorOptions } from '../../../../../editor/common/config/editorOptions.js';
import { getUnchangedRegionSettings } from './unchangedEditorRegions.js';

export function getOptimizedNestedCodeEditorWidgetOptions(): ICodeEditorWidgetOptions {
	return {
		isSimpleWidget: false,
		contributions: EditorExtensionsRegistry.getSomeEditorContributions([
			MenuPreventer.ID,
			SelectionClipboardContributionID,
			ContextMenuController.ID,
			SuggestController.ID,
			SnippetController2.ID,
			TabCompletionController.ID,
		])
	};
}

export class CellDiffPlaceholderElement extends Disposable {
	constructor(
		placeholder: DiffElementPlaceholderViewModel,
		templateData: CellDiffPlaceholderRenderTemplate,
	) {
		super();
		templateData.body.classList.remove('left', 'right', 'full');
		const text = (placeholder.hiddenCells.length === 1) ?
			localize('hiddenCell', '{0} hidden cell', placeholder.hiddenCells.length) :
			localize('hiddenCells', '{0} hidden cells', placeholder.hiddenCells.length);
		templateData.placeholder.innerText = text;

		this._register(DOM.addDisposableListener(templateData.placeholder, 'dblclick', (e: MouseEvent) => {
			if (e.button !== 0) {
				return;
			}
			e.preventDefault();
			placeholder.showHiddenCells();
		}));
		this._register(templateData.marginOverlay.onAction(() => placeholder.showHiddenCells()));
		templateData.marginOverlay.show();
	}
}

class PropertyHeader extends Disposable {
	protected _foldingIndicator!: HTMLElement;
	protected _statusSpan!: HTMLElement;
	protected _description!: HTMLElement;
	protected _toolbar!: WorkbenchToolBar;
	protected _menu!: IMenu;
	protected _propertyExpanded?: IContextKey<boolean>;
	protected _propertyChanged?: IContextKey<boolean>;

	constructor(
		readonly cell: IDiffElementViewModelBase,
		readonly propertyHeaderContainer: HTMLElement,
		readonly notebookEditor: INotebookTextDiffEditor,
		readonly accessor: {
			updateInfoRendering: (renderOutput: boolean) => void;
			checkIfModified: () => false | { reason: string | undefined };
			getFoldingState: () => PropertyFoldingState;
			updateFoldingState: (newState: PropertyFoldingState) => void;
			unChangedLabel: string;
			changedLabel: string;
			prefix: string;
			menuId: MenuId;
		},
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@ICommandService private readonly commandService: ICommandService,
		@INotificationService private readonly notificationService: INotificationService,
		@IMenuService private readonly menuService: IMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IThemeService private readonly themeService: IThemeService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService
	) {
		super();
	}

	buildHeader(): void {
		this._foldingIndicator = DOM.append(this.propertyHeaderContainer, DOM.$('.property-folding-indicator'));
		this._foldingIndicator.classList.add(this.accessor.prefix);
		const metadataStatus = DOM.append(this.propertyHeaderContainer, DOM.$('div.property-status'));
		this._statusSpan = DOM.append(metadataStatus, DOM.$('span'));
		this._description = DOM.append(metadataStatus, DOM.$('span.property-description'));

		const cellToolbarContainer = DOM.append(this.propertyHeaderContainer, DOM.$('div.property-toolbar'));
		this._toolbar = this._register(new WorkbenchToolBar(cellToolbarContainer, {
			actionViewItemProvider: (action, options) => {
				if (action instanceof MenuItemAction) {
					const item = new CodiconActionViewItem(action, { hoverDelegate: options.hoverDelegate }, this.keybindingService, this.notificationService, this.contextKeyService, this.themeService, this.contextMenuService, this.accessibilityService);
					return item;
				}

				return undefined;
			}
		}, this.menuService, this.contextKeyService, this.contextMenuService, this.keybindingService, this.commandService, this.telemetryService));
		this._toolbar.context = this.cell;

		const scopedContextKeyService = this.contextKeyService.createScoped(cellToolbarContainer);
		this._register(scopedContextKeyService);
		this._propertyChanged = NOTEBOOK_DIFF_CELL_PROPERTY.bindTo(scopedContextKeyService);
		this._propertyExpanded = NOTEBOOK_DIFF_CELL_PROPERTY_EXPANDED.bindTo(scopedContextKeyService);

		this._menu = this._register(this.menuService.createMenu(this.accessor.menuId, scopedContextKeyService));
		this._register(this._menu.onDidChange(() => this.updateMenu()));

		this._register(this.notebookEditor.onMouseUp(e => {
			if (!e.event.target || e.target !== this.cell) {
				return;
			}

			const target = e.event.target as HTMLElement;

			if (
				target === this.propertyHeaderContainer ||
				target === this._foldingIndicator || this._foldingIndicator.contains(target) ||
				target === metadataStatus || metadataStatus.contains(target)
			) {
				const oldFoldingState = this.accessor.getFoldingState();
				this.accessor.updateFoldingState(oldFoldingState === PropertyFoldingState.Expanded ? PropertyFoldingState.Collapsed : PropertyFoldingState.Expanded);
				this._updateFoldingIcon();
				this.accessor.updateInfoRendering(this.cell.renderOutput);
			}
		}));

		this.refresh();
		this.accessor.updateInfoRendering(this.cell.renderOutput);
	}
	refresh() {
		this.updateMenu();
		this._updateFoldingIcon();

		const metadataChanged = this.accessor.checkIfModified();
		if (this._propertyChanged) {
			this._propertyChanged.set(!!metadataChanged);
		}
		if (metadataChanged) {
			this._statusSpan.textContent = this.accessor.changedLabel;
			this._statusSpan.style.fontWeight = 'bold';
			if (metadataChanged.reason) {
				this._description.textContent = metadataChanged.reason;
			}
			this.propertyHeaderContainer.classList.add('modified');
		} else {
			this._statusSpan.textContent = this.accessor.unChangedLabel;
			this._statusSpan.style.fontWeight = 'normal';
			this._description.textContent = '';
			this.propertyHeaderContainer.classList.remove('modified');
		}
	}

	private updateMenu() {
		const metadataChanged = this.accessor.checkIfModified();
		if (metadataChanged) {
			const actions = getFlatActionBarActions(this._menu.getActions({ shouldForwardArgs: true }));
			this._toolbar.setActions(actions);
		} else {
			this._toolbar.setActions([]);
		}
	}

	private _updateFoldingIcon() {
		if (this.accessor.getFoldingState() === PropertyFoldingState.Collapsed) {
			DOM.reset(this._foldingIndicator, renderIcon(collapsedIcon));
			this._propertyExpanded?.set(false);
		} else {
			DOM.reset(this._foldingIndicator, renderIcon(expandedIcon));
			this._propertyExpanded?.set(true);
		}

	}
}

interface IDiffElementLayoutState {
	outerWidth?: boolean;
	editorHeight?: boolean;
	metadataEditor?: boolean;
	metadataHeight?: boolean;
	outputTotalHeight?: boolean;
}


export class NotebookDocumentMetadataElement extends Disposable {
	private readonly _editor: DiffEditorWidget;
	private _editorViewStateChanged: boolean;
	private _toolbar!: ToolBar;
	private readonly _cellHeaderContainer: HTMLElement;
	private readonly _editorContainer: HTMLElement;
	private _cellHeader!: PropertyHeader;
	private _diffEditorContainer!: HTMLElement;

	constructor(
		readonly notebookEditor: INotebookTextDiffEditor,
		readonly viewModel: NotebookDocumentMetadataViewModel,
		readonly templateData: NotebookDocumentDiffElementRenderTemplate,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@IMenuService private readonly menuService: IMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@ITextResourceConfigurationService private readonly textConfigurationService: ITextResourceConfigurationService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();
		this._editor = templateData.sourceEditor;
		this._cellHeaderContainer = this.templateData.cellHeaderContainer;
		this._editorContainer = this.templateData.editorContainer;
		this._diffEditorContainer = this.templateData.diffEditorContainer;

		this._editorViewStateChanged = false;
		// init
		this._register(viewModel.onDidLayoutChange(e => {
			this.layout(e);
			this.updateBorders();
		}));
		this.buildBody();
		this.updateBorders();
	}

	buildBody(): void {
		const body = this.templateData.body;
		body.classList.remove('full');
		body.classList.add('full');

		this.updateSourceEditor();

		if (this.viewModel instanceof NotebookDocumentMetadataViewModel) {
			this._register(this.viewModel.modifiedMetadata.onDidChange(e => {
				this._cellHeader.refresh();
			}));
		}
	}
	protected layoutNotebookCell() {
		this.notebookEditor.layoutNotebookCell(
			this.viewModel,
			this.viewModel.layoutInfo.totalHeight
		);
	}

	updateBorders() {
		this.templateData.leftBorder.style.height = `${this.viewModel.layoutInfo.totalHeight - 32}px`;
		this.templateData.rightBorder.style.height = `${this.viewModel.layoutInfo.totalHeight - 32}px`;
		this.templateData.bottomBorder.style.top = `${this.viewModel.layoutInfo.totalHeight - 32}px`;
	}
	updateSourceEditor(): void {
		this._cellHeaderContainer.style.display = 'flex';
		this._cellHeaderContainer.innerText = '';
		this._editorContainer.classList.add('diff');

		const updateSourceEditor = () => {
			if (this.viewModel.cellFoldingState === PropertyFoldingState.Collapsed) {
				this._editorContainer.style.display = 'none';
				this.viewModel.editorHeight = 0;
				return;
			}

			const lineHeight = this.notebookEditor.getLayoutInfo().fontInfo.lineHeight || 17;
			const editorHeight = this.viewModel.layoutInfo.editorHeight !== 0 ? this.viewModel.layoutInfo.editorHeight : this.viewModel.computeInputEditorHeight(lineHeight);

			this._editorContainer.style.height = `${editorHeight}px`;
			this._editorContainer.style.display = 'block';

			const contentHeight = this._editor.getContentHeight();
			if (contentHeight >= 0) {
				this.viewModel.editorHeight = contentHeight;
			}
			return editorHeight;
		};
		const renderSourceEditor = () => {
			const editorHeight = updateSourceEditor();
			if (!editorHeight) {
				return;
			}

			// If there is only 1 line, then ensure we have the necessary padding to display the button for whitespaces.
			// E.g. assume we have a cell with 1 line and we add some whitespace,
			// Then diff editor displays the button `Show Whitespace Differences`, however with 12 paddings on the top, the
			// button can get cut off.
			const lineCount = this.viewModel.modifiedMetadata.textBuffer.getLineCount();
			const options: IDiffEditorOptions = {
				padding: getEditorPadding(lineCount)
			};
			const unchangedRegions = this._register(getUnchangedRegionSettings(this.configurationService));
			if (unchangedRegions.options.enabled) {
				options.hideUnchangedRegions = unchangedRegions.options;
			}
			this._editor.updateOptions(options);
			this._register(unchangedRegions.onDidChangeEnablement(() => {
				options.hideUnchangedRegions = unchangedRegions.options;
				this._editor.updateOptions(options);
			}));
			this._editor.layout({
				width: this.notebookEditor.getLayoutInfo().width - 2 * DIFF_CELL_MARGIN,
				height: editorHeight
			});
			this._register(this._editor.onDidContentSizeChange((e) => {
				if (this.viewModel.cellFoldingState === PropertyFoldingState.Expanded && e.contentHeightChanged && this.viewModel.layoutInfo.editorHeight !== e.contentHeight) {
					this.viewModel.editorHeight = e.contentHeight;
				}
			}));
			this._initializeSourceDiffEditor();
		};

		this._cellHeader = this._register(this.instantiationService.createInstance(
			PropertyHeader,
			this.viewModel,
			this._cellHeaderContainer,
			this.notebookEditor,
			{
				updateInfoRendering: () => renderSourceEditor(),
				checkIfModified: () => {
					return this.viewModel.originalMetadata.getHash() !== this.viewModel.modifiedMetadata.getHash() ? { reason: undefined } : false;
				},
				getFoldingState: () => this.viewModel.cellFoldingState,
				updateFoldingState: (state) => this.viewModel.cellFoldingState = state,
				unChangedLabel: 'Notebook Metadata',
				changedLabel: 'Notebook Metadata changed',
				prefix: 'metadata',
				menuId: MenuId.NotebookDiffDocumentMetadata
			}
		));
		this._cellHeader.buildHeader();
		renderSourceEditor();

		const scopedContextKeyService = this.contextKeyService.createScoped(this.templateData.inputToolbarContainer);
		this._register(scopedContextKeyService);
		const inputChanged = NOTEBOOK_DIFF_METADATA.bindTo(scopedContextKeyService);
		inputChanged.set(this.viewModel.originalMetadata.getHash() !== this.viewModel.modifiedMetadata.getHash());

		this._toolbar = this.templateData.toolbar;

		this._toolbar.context = this.viewModel;

		const refreshToolbar = () => {
			const hasChanges = this.viewModel.originalMetadata.getHash() !== this.viewModel.modifiedMetadata.getHash();
			inputChanged.set(hasChanges);

			if (hasChanges) {
				const menu = this.menuService.getMenuActions(MenuId.NotebookDiffDocumentMetadata, scopedContextKeyService, { shouldForwardArgs: true });
				const actions = getFlatActionBarActions(menu);
				this._toolbar.setActions(actions);
			} else {
				this._toolbar.setActions([]);
			}
		};

		this._register(this.viewModel.modifiedMetadata.onDidChange(() => {
			refreshToolbar();
		}));
		refreshToolbar();
	}

	private async _initializeSourceDiffEditor() {
		const [originalRef, modifiedRef] = await Promise.all([
			this.textModelService.createModelReference(this.viewModel.originalMetadata.uri),
			this.textModelService.createModelReference(this.viewModel.modifiedMetadata.uri)]);

		if (this._store.isDisposed) {
			originalRef.dispose();
			modifiedRef.dispose();
			return;
		}

		this._register(originalRef);
		this._register(modifiedRef);

		const vm = this._register(this._editor.createViewModel({
			original: originalRef.object.textEditorModel,
			modified: modifiedRef.object.textEditorModel,
		}));

		// Reduces flicker (compute this before setting the model)
		// Else when the model is set, the height of the editor will be x, after diff is computed, then height will be y.
		// & that results in flicker.
		await vm.waitForDiff();
		this._editor.setModel(vm);

		const handleViewStateChange = () => {
			this._editorViewStateChanged = true;
		};

		const handleScrollChange = (e: editorCommon.IScrollEvent) => {
			if (e.scrollTopChanged || e.scrollLeftChanged) {
				this._editorViewStateChanged = true;
			}
		};

		this.updateEditorOptionsForWhitespace();
		this._register(this._editor.getOriginalEditor().onDidChangeCursorSelection(handleViewStateChange));
		this._register(this._editor.getOriginalEditor().onDidScrollChange(handleScrollChange));
		this._register(this._editor.getModifiedEditor().onDidChangeCursorSelection(handleViewStateChange));
		this._register(this._editor.getModifiedEditor().onDidScrollChange(handleScrollChange));

		const editorViewState = this.viewModel.getSourceEditorViewState() as editorCommon.IDiffEditorViewState | null;
		if (editorViewState) {
			this._editor.restoreViewState(editorViewState);
		}

		const contentHeight = this._editor.getContentHeight();
		this.viewModel.editorHeight = contentHeight;
	}
	private updateEditorOptionsForWhitespace() {
		const editor = this._editor;
		const uri = editor.getModel()?.modified.uri || editor.getModel()?.original.uri;
		if (!uri) {
			return;
		}
		const ignoreTrimWhitespace = this.textConfigurationService.getValue<boolean>(uri, 'diffEditor.ignoreTrimWhitespace');
		editor.updateOptions({ ignoreTrimWhitespace });

		this._register(this.textConfigurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(uri, 'diffEditor') &&
				e.affectedKeys.has('diffEditor.ignoreTrimWhitespace')) {
				const ignoreTrimWhitespace = this.textConfigurationService.getValue<boolean>(uri, 'diffEditor.ignoreTrimWhitespace');
				editor.updateOptions({ ignoreTrimWhitespace });
			}
		}));
	}
	layout(state: IDiffElementLayoutState) {
		DOM.scheduleAtNextAnimationFrame(DOM.getWindow(this._diffEditorContainer), () => {
			if (state.editorHeight) {
				this._editorContainer.style.height = `${this.viewModel.layoutInfo.editorHeight}px`;
				this._editor.layout({
					width: this._editor.getViewWidth(),
					height: this.viewModel.layoutInfo.editorHeight
				});
			}

			if (state.outerWidth) {
				this._editorContainer.style.height = `${this.viewModel.layoutInfo.editorHeight}px`;
				this._editor.layout();
			}

			this.layoutNotebookCell();
		});
	}

	override dispose() {
		this._editor.setModel(null);

		if (this._editorViewStateChanged) {
			this.viewModel.saveSpirceEditorViewState(this._editor.saveViewState());
		}

		super.dispose();
	}
}


abstract class AbstractElementRenderer extends Disposable {
	protected readonly _metadataLocalDisposable = this._register(new DisposableStore());
	protected readonly _outputLocalDisposable = this._register(new DisposableStore());
	protected _ignoreMetadata: boolean = false;
	protected _ignoreOutputs: boolean = false;
	protected _cellHeaderContainer!: HTMLElement;
	protected _editorContainer!: HTMLElement;
	protected _cellHeader!: PropertyHeader;
	protected _metadataHeaderContainer!: HTMLElement;
	protected _metadataHeader!: PropertyHeader;
	protected _metadataInfoContainer!: HTMLElement;
	protected _metadataEditorContainer?: HTMLElement;
	protected readonly _metadataEditorDisposeStore!: DisposableStore;
	protected _metadataEditor?: CodeEditorWidget | DiffEditorWidget;

	protected _outputHeaderContainer!: HTMLElement;
	protected _outputHeader!: PropertyHeader;
	protected _outputInfoContainer!: HTMLElement;
	protected _outputEditorContainer?: HTMLElement;
	protected _outputViewContainer?: HTMLElement;
	protected _outputLeftContainer?: HTMLElement;
	protected _outputRightContainer?: HTMLElement;
	protected _outputMetadataContainer?: HTMLElement;
	protected _outputEmptyElement?: HTMLElement;
	protected _outputLeftView?: OutputContainer;
	protected _outputRightView?: OutputContainer;
	protected readonly _outputEditorDisposeStore!: DisposableStore;
	protected _outputEditor?: CodeEditorWidget | DiffEditorWidget;
	protected _outputMetadataEditor?: DiffEditorWidget;

	protected _diffEditorContainer!: HTMLElement;
	protected _diagonalFill?: HTMLElement;
	protected _isDisposed: boolean;

	constructor(
		readonly notebookEditor: INotebookTextDiffEditor,
		readonly cell: DiffElementCellViewModelBase,
		readonly templateData: CellDiffSingleSideRenderTemplate | CellDiffSideBySideRenderTemplate,
		readonly style: 'left' | 'right' | 'full',
		protected readonly instantiationService: IInstantiationService,
		protected readonly languageService: ILanguageService,
		protected readonly modelService: IModelService,
		protected readonly textModelService: ITextModelService,
		protected readonly contextMenuService: IContextMenuService,
		protected readonly keybindingService: IKeybindingService,
		protected readonly notificationService: INotificationService,
		protected readonly menuService: IMenuService,
		protected readonly contextKeyService: IContextKeyService,
		protected readonly configurationService: IConfigurationService,
		protected readonly textConfigurationService: ITextResourceConfigurationService
	) {
		super();
		// init
		this._isDisposed = false;
		this._metadataEditorDisposeStore = this._register(new DisposableStore());
		this._outputEditorDisposeStore = this._register(new DisposableStore());
		this._register(cell.onDidLayoutChange(e => {
			this.layout(e);
		}));
		this._register(cell.onDidLayoutChange(e => this.updateBorders()));
		this.init();
		this.buildBody();

		this._register(cell.onDidStateChange(() => {
			this.updateOutputRendering(this.cell.renderOutput);
		}));
	}

	abstract init(): void;
	abstract styleContainer(container: HTMLElement): void;
	abstract _buildOutput(): void;
	abstract _disposeOutput(): void;
	abstract _buildMetadata(): void;
	abstract _disposeMetadata(): void;

	buildBody(): void {
		const body = this.templateData.body;
		this._diffEditorContainer = this.templateData.diffEditorContainer;
		body.classList.remove('left', 'right', 'full');
		switch (this.style) {
			case 'left':
				body.classList.add('left');
				break;
			case 'right':
				body.classList.add('right');
				break;
			default:
				body.classList.add('full');
				break;
		}

		this.styleContainer(this._diffEditorContainer);
		this.updateSourceEditor();
		if (this.cell.modified) {
			this._register(this.cell.modified.textModel.onDidChangeContent(() => this._cellHeader.refresh()));
		}

		this._ignoreMetadata = this.configurationService.getValue('notebook.diff.ignoreMetadata');
		if (this._ignoreMetadata) {
			this._disposeMetadata();
		} else {
			this._buildMetadata();
		}

		this._ignoreOutputs = this.configurationService.getValue<boolean>('notebook.diff.ignoreOutputs') || !!(this.notebookEditor.textModel?.transientOptions.transientOutputs);
		if (this._ignoreOutputs) {
			this._disposeOutput();
		} else {
			this._buildOutput();
		}

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			let metadataLayoutChange = false;
			let outputLayoutChange = false;
			if (e.affectsConfiguration('notebook.diff.ignoreMetadata')) {
				const newValue = this.configurationService.getValue<boolean>('notebook.diff.ignoreMetadata');

				if (newValue !== undefined && this._ignoreMetadata !== newValue) {
					this._ignoreMetadata = newValue;

					this._metadataLocalDisposable.clear();
					if (this.configurationService.getValue('notebook.diff.ignoreMetadata')) {
						this._disposeMetadata();
					} else {
						this.cell.metadataStatusHeight = 25;
						this._buildMetadata();
						this.updateMetadataRendering();
						metadataLayoutChange = true;
					}
				}
			}

			if (e.affectsConfiguration('notebook.diff.ignoreOutputs')) {
				const newValue = this.configurationService.getValue<boolean>('notebook.diff.ignoreOutputs');

				if (newValue !== undefined && this._ignoreOutputs !== (newValue || this.notebookEditor.textModel?.transientOptions.transientOutputs)) {
					this._ignoreOutputs = newValue || !!(this.notebookEditor.textModel?.transientOptions.transientOutputs);

					this._outputLocalDisposable.clear();
					if (this._ignoreOutputs) {
						this._disposeOutput();
						this.cell.layoutChange();
					} else {
						this.cell.outputStatusHeight = 25;
						this._buildOutput();
						outputLayoutChange = true;
					}
				}
			}

			if (metadataLayoutChange || outputLayoutChange) {
				this.layout({ metadataHeight: metadataLayoutChange, outputTotalHeight: outputLayoutChange });
			}
		}));
	}

	updateMetadataRendering() {
		if (this.cell.metadataFoldingState === PropertyFoldingState.Expanded) {
			// we should expand the metadata editor
			this._metadataInfoContainer.style.display = 'block';

			if (!this._metadataEditorContainer || !this._metadataEditor) {
				// create editor
				this._metadataEditorContainer = DOM.append(this._metadataInfoContainer, DOM.$('.metadata-editor-container'));
				this._buildMetadataEditor();
			} else {
				this.cell.metadataHeight = this._metadataEditor.getContentHeight();
			}
		} else {
			// we should collapse the metadata editor
			this._metadataInfoContainer.style.display = 'none';
			// this._metadataEditorDisposeStore.clear();
			this.cell.metadataHeight = 0;
		}
	}

	updateOutputRendering(renderRichOutput: boolean) {
		if (this.cell.outputFoldingState === PropertyFoldingState.Expanded) {
			this._outputInfoContainer.style.display = 'block';
			if (renderRichOutput) {
				this._hideOutputsRaw();
				this._buildOutputRendererContainer();
				this._showOutputsRenderer();
				this._showOutputsEmptyView();
			} else {
				this._hideOutputsRenderer();
				this._buildOutputRawContainer();
				this._showOutputsRaw();
			}
		} else {
			this._outputInfoContainer.style.display = 'none';

			this._hideOutputsRaw();
			this._hideOutputsRenderer();
			this._hideOutputsEmptyView();
		}
	}

	private _buildOutputRawContainer() {
		if (!this._outputEditorContainer) {
			this._outputEditorContainer = DOM.append(this._outputInfoContainer, DOM.$('.output-editor-container'));
			this._buildOutputEditor();
		}
	}

	private _showOutputsRaw() {
		if (this._outputEditorContainer) {
			this._outputEditorContainer.style.display = 'block';
			this.cell.rawOutputHeight = this._outputEditor!.getContentHeight();
		}
	}

	private _showOutputsEmptyView() {
		this.cell.layoutChange();
	}

	protected _hideOutputsRaw() {
		if (this._outputEditorContainer) {
			this._outputEditorContainer.style.display = 'none';
			this.cell.rawOutputHeight = 0;
		}
	}

	protected _hideOutputsEmptyView() {
		this.cell.layoutChange();
	}

	abstract _buildOutputRendererContainer(): void;
	abstract _hideOutputsRenderer(): void;
	abstract _showOutputsRenderer(): void;

	private _applySanitizedMetadataChanges(currentMetadata: NotebookCellMetadata, newMetadata: any) {
		const result: { [key: string]: any } = {};
		try {
			const newMetadataObj = JSON.parse(newMetadata);
			const keys = new Set([...Object.keys(newMetadataObj)]);
			for (const key of keys) {
				switch (key as keyof NotebookCellMetadata) {
					case 'inputCollapsed':
					case 'outputCollapsed':
						// boolean
						if (typeof newMetadataObj[key] === 'boolean') {
							result[key] = newMetadataObj[key];
						} else {
							result[key] = currentMetadata[key as keyof NotebookCellMetadata];
						}
						break;

					default:
						result[key] = newMetadataObj[key];
						break;
				}
			}

			const index = this.notebookEditor.textModel!.cells.indexOf(this.cell.modified!.textModel);

			if (index < 0) {
				return;
			}

			this.notebookEditor.textModel!.applyEdits([
				{ editType: CellEditType.Metadata, index, metadata: result }
			], true, undefined, () => undefined, undefined, true);
		} catch {
		}
	}

	private async _buildMetadataEditor() {
		this._metadataEditorDisposeStore.clear();

		if (this.cell instanceof SideBySideDiffElementViewModel) {
			this._metadataEditor = this.instantiationService.createInstance(DiffEditorWidget, this._metadataEditorContainer!, {
				...fixedDiffEditorOptions,
				overflowWidgetsDomNode: this.notebookEditor.getOverflowContainerDomNode(),
				readOnly: false,
				originalEditable: false,
				ignoreTrimWhitespace: false,
				automaticLayout: false,
				dimension: {
					height: this.cell.layoutInfo.metadataHeight,
					width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), true, true)
				}
			}, {
				originalEditor: getOptimizedNestedCodeEditorWidgetOptions(),
				modifiedEditor: getOptimizedNestedCodeEditorWidgetOptions()
			});

			const unchangedRegions = this._register(getUnchangedRegionSettings(this.configurationService));
			if (unchangedRegions.options.enabled) {
				this._metadataEditor.updateOptions({ hideUnchangedRegions: unchangedRegions.options });
			}
			this._metadataEditorDisposeStore.add(unchangedRegions.onDidChangeEnablement(() => {
				if (this._metadataEditor) {
					this._metadataEditor.updateOptions({ hideUnchangedRegions: unchangedRegions.options });
				}
			}));


			this.layout({ metadataHeight: true });
			this._metadataEditorDisposeStore.add(this._metadataEditor);

			this._metadataEditorContainer?.classList.add('diff');

			const [originalMetadataModel, modifiedMetadataModel] = await Promise.all([
				this.textModelService.createModelReference(CellUri.generateCellPropertyUri(this.cell.originalDocument.uri, this.cell.original.handle, Schemas.vscodeNotebookCellMetadata)),
				this.textModelService.createModelReference(CellUri.generateCellPropertyUri(this.cell.modifiedDocument.uri, this.cell.modified.handle, Schemas.vscodeNotebookCellMetadata))
			]);

			if (this._isDisposed) {
				originalMetadataModel.dispose();
				modifiedMetadataModel.dispose();
				return;
			}

			this._metadataEditorDisposeStore.add(originalMetadataModel);
			this._metadataEditorDisposeStore.add(modifiedMetadataModel);
			const vm = this._metadataEditor.createViewModel({
				original: originalMetadataModel.object.textEditorModel,
				modified: modifiedMetadataModel.object.textEditorModel
			});
			this._metadataEditor.setModel(vm);
			// Reduces flicker (compute this before setting the model)
			// Else when the model is set, the height of the editor will be x, after diff is computed, then height will be y.
			// & that results in flicker.
			await vm.waitForDiff();

			if (this._isDisposed) {
				return;
			}

			this.cell.metadataHeight = this._metadataEditor.getContentHeight();

			this._metadataEditorDisposeStore.add(this._metadataEditor.onDidContentSizeChange((e) => {
				if (e.contentHeightChanged && this.cell.metadataFoldingState === PropertyFoldingState.Expanded) {
					this.cell.metadataHeight = e.contentHeight;
				}
			}));

			let respondingToContentChange = false;

			this._metadataEditorDisposeStore.add(modifiedMetadataModel.object.textEditorModel.onDidChangeContent(() => {
				respondingToContentChange = true;
				const value = modifiedMetadataModel.object.textEditorModel.getValue();
				this._applySanitizedMetadataChanges(this.cell.modified!.metadata, value);
				this._metadataHeader.refresh();
				respondingToContentChange = false;
			}));

			this._metadataEditorDisposeStore.add(this.cell.modified.textModel.onDidChangeMetadata(() => {
				if (respondingToContentChange) {
					return;
				}

				const modifiedMetadataSource = getFormattedMetadataJSON(this.notebookEditor.textModel?.transientOptions.transientCellMetadata, this.cell.modified?.metadata || {}, this.cell.modified?.language, true);
				modifiedMetadataModel.object.textEditorModel.setValue(modifiedMetadataSource);
			}));

			return;
		} else {
			this._metadataEditor = this.instantiationService.createInstance(CodeEditorWidget, this._metadataEditorContainer!, {
				...fixedEditorOptions,
				dimension: {
					width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, true),
					height: this.cell.layoutInfo.metadataHeight
				},
				overflowWidgetsDomNode: this.notebookEditor.getOverflowContainerDomNode(),
				readOnly: false,
				allowVariableLineHeights: false
			}, {});
			this.layout({ metadataHeight: true });
			this._metadataEditorDisposeStore.add(this._metadataEditor);

			const mode = this.languageService.createById('jsonc');
			const originalMetadataSource = getFormattedMetadataJSON(this.notebookEditor.textModel?.transientOptions.transientCellMetadata,
				this.cell.type === 'insert'
					? this.cell.modified!.metadata || {}
					: this.cell.original!.metadata || {}, undefined, true);
			const uri = this.cell.type === 'insert'
				? this.cell.modified!.uri
				: this.cell.original!.uri;
			const handle = this.cell.type === 'insert'
				? this.cell.modified!.handle
				: this.cell.original!.handle;

			const modelUri = CellUri.generateCellPropertyUri(uri, handle, Schemas.vscodeNotebookCellMetadata);
			const metadataModel = this.modelService.createModel(originalMetadataSource, mode, modelUri, false);
			this._metadataEditor.setModel(metadataModel);
			this._metadataEditorDisposeStore.add(metadataModel);

			this.cell.metadataHeight = this._metadataEditor.getContentHeight();

			this._metadataEditorDisposeStore.add(this._metadataEditor.onDidContentSizeChange((e) => {
				if (e.contentHeightChanged && this.cell.metadataFoldingState === PropertyFoldingState.Expanded) {
					this.cell.metadataHeight = e.contentHeight;
				}
			}));
		}
	}

	private _buildOutputEditor() {
		this._outputEditorDisposeStore.clear();

		if ((this.cell.type === 'modified' || this.cell.type === 'unchanged') && !this.notebookEditor.textModel!.transientOptions.transientOutputs) {
			const originalOutputsSource = getFormattedOutputJSON(this.cell.original?.outputs || []);
			const modifiedOutputsSource = getFormattedOutputJSON(this.cell.modified?.outputs || []);
			if (originalOutputsSource !== modifiedOutputsSource) {
				const mode = this.languageService.createById('json');
				const originalModel = this.modelService.createModel(originalOutputsSource, mode, undefined, true);
				const modifiedModel = this.modelService.createModel(modifiedOutputsSource, mode, undefined, true);
				this._outputEditorDisposeStore.add(originalModel);
				this._outputEditorDisposeStore.add(modifiedModel);

				const lineHeight = this.notebookEditor.getLayoutInfo().fontInfo.lineHeight || 17;
				const lineCount = Math.max(originalModel.getLineCount(), modifiedModel.getLineCount());
				this._outputEditor = this.instantiationService.createInstance(DiffEditorWidget, this._outputEditorContainer!, {
					...fixedDiffEditorOptions,
					overflowWidgetsDomNode: this.notebookEditor.getOverflowContainerDomNode(),
					readOnly: true,
					ignoreTrimWhitespace: false,
					automaticLayout: false,
					dimension: {
						height: Math.min(OUTPUT_EDITOR_HEIGHT_MAGIC, this.cell.layoutInfo.rawOutputHeight || lineHeight * lineCount),
						width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, true)
					},
					accessibilityVerbose: this.configurationService.getValue<boolean>(AccessibilityVerbositySettingId.DiffEditor) ?? false
				}, {
					originalEditor: getOptimizedNestedCodeEditorWidgetOptions(),
					modifiedEditor: getOptimizedNestedCodeEditorWidgetOptions()
				});
				this._outputEditorDisposeStore.add(this._outputEditor);

				this._outputEditorContainer?.classList.add('diff');

				this._outputEditor.setModel({
					original: originalModel,
					modified: modifiedModel
				});
				this._outputEditor.restoreViewState(this.cell.getOutputEditorViewState() as editorCommon.IDiffEditorViewState);

				this.cell.rawOutputHeight = this._outputEditor.getContentHeight();

				this._outputEditorDisposeStore.add(this._outputEditor.onDidContentSizeChange((e) => {
					if (e.contentHeightChanged && this.cell.outputFoldingState === PropertyFoldingState.Expanded) {
						this.cell.rawOutputHeight = e.contentHeight;
					}
				}));

				this._outputEditorDisposeStore.add(this.cell.modified!.textModel.onDidChangeOutputs(() => {
					const modifiedOutputsSource = getFormattedOutputJSON(this.cell.modified?.outputs || []);
					modifiedModel.setValue(modifiedOutputsSource);
					this._outputHeader.refresh();
				}));

				return;
			}
		}

		this._outputEditor = this.instantiationService.createInstance(CodeEditorWidget, this._outputEditorContainer!, {
			...fixedEditorOptions,
			dimension: {
				width: Math.min(OUTPUT_EDITOR_HEIGHT_MAGIC, this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, this.cell.type === 'unchanged' || this.cell.type === 'modified') - 32),
				height: this.cell.layoutInfo.rawOutputHeight
			},
			overflowWidgetsDomNode: this.notebookEditor.getOverflowContainerDomNode(),
			allowVariableLineHeights: false
		}, {});
		this._outputEditorDisposeStore.add(this._outputEditor);

		const mode = this.languageService.createById('json');
		const originaloutputSource = getFormattedOutputJSON(
			this.notebookEditor.textModel!.transientOptions.transientOutputs
				? []
				: this.cell.type === 'insert'
					? this.cell.modified?.outputs || []
					: this.cell.original?.outputs || []);
		const outputModel = this.modelService.createModel(originaloutputSource, mode, undefined, true);
		this._outputEditorDisposeStore.add(outputModel);
		this._outputEditor.setModel(outputModel);
		this._outputEditor.restoreViewState(this.cell.getOutputEditorViewState());

		this.cell.rawOutputHeight = this._outputEditor.getContentHeight();

		this._outputEditorDisposeStore.add(this._outputEditor.onDidContentSizeChange((e) => {
			if (e.contentHeightChanged && this.cell.outputFoldingState === PropertyFoldingState.Expanded) {
				this.cell.rawOutputHeight = e.contentHeight;
			}
		}));
	}

	protected layoutNotebookCell() {
		this.notebookEditor.layoutNotebookCell(
			this.cell,
			this.cell.layoutInfo.totalHeight
		);
	}

	updateBorders() {
		this.templateData.leftBorder.style.height = `${this.cell.layoutInfo.totalHeight - 32}px`;
		this.templateData.rightBorder.style.height = `${this.cell.layoutInfo.totalHeight - 32}px`;
		this.templateData.bottomBorder.style.top = `${this.cell.layoutInfo.totalHeight - 32}px`;
	}

	override dispose() {
		if (this._outputEditor) {
			this.cell.saveOutputEditorViewState(this._outputEditor.saveViewState());
		}

		if (this._metadataEditor) {
			this.cell.saveMetadataEditorViewState(this._metadataEditor.saveViewState());
		}

		this._metadataEditorDisposeStore.dispose();
		this._outputEditorDisposeStore.dispose();

		this._isDisposed = true;
		super.dispose();
	}

	abstract updateSourceEditor(): void;
	abstract layout(state: IDiffElementLayoutState): void;
}

abstract class SingleSideDiffElement extends AbstractElementRenderer {
	protected _editor!: CodeEditorWidget;
	override readonly cell: SingleSideDiffElementViewModel;
	override readonly templateData: CellDiffSingleSideRenderTemplate;
	abstract get nestedCellViewModel(): DiffNestedCellViewModel;
	abstract get readonly(): boolean;
	constructor(
		notebookEditor: INotebookTextDiffEditor,
		cell: SingleSideDiffElementViewModel,
		templateData: CellDiffSingleSideRenderTemplate,
		style: 'left' | 'right' | 'full',
		instantiationService: IInstantiationService,
		languageService: ILanguageService,
		modelService: IModelService,
		textModelService: ITextModelService,
		contextMenuService: IContextMenuService,
		keybindingService: IKeybindingService,
		notificationService: INotificationService,
		menuService: IMenuService,
		contextKeyService: IContextKeyService,
		configurationService: IConfigurationService,
		textConfigurationService: ITextResourceConfigurationService
	) {
		super(
			notebookEditor,
			cell,
			templateData,
			style,
			instantiationService,
			languageService,
			modelService,
			textModelService,
			contextMenuService,
			keybindingService,
			notificationService,
			menuService,
			contextKeyService,
			configurationService,
			textConfigurationService
		);
		this.cell = cell;
		this.templateData = templateData;

		this.updateBorders();
	}

	init() {
		this._diagonalFill = this.templateData.diagonalFill;
	}

	override buildBody() {
		const body = this.templateData.body;
		this._diffEditorContainer = this.templateData.diffEditorContainer;
		body.classList.remove('left', 'right', 'full');
		switch (this.style) {
			case 'left':
				body.classList.add('left');
				break;
			case 'right':
				body.classList.add('right');
				break;
			default:
				body.classList.add('full');
				break;
		}

		this.styleContainer(this._diffEditorContainer);
		this.updateSourceEditor();

		if (this.configurationService.getValue('notebook.diff.ignoreMetadata')) {
			this._disposeMetadata();
		} else {
			this._buildMetadata();
		}

		if (this.configurationService.getValue('notebook.diff.ignoreOutputs') || this.notebookEditor.textModel?.transientOptions.transientOutputs) {
			this._disposeOutput();
		} else {
			this._buildOutput();
		}

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			let metadataLayoutChange = false;
			let outputLayoutChange = false;
			if (e.affectsConfiguration('notebook.diff.ignoreMetadata')) {
				this._metadataLocalDisposable.clear();
				if (this.configurationService.getValue('notebook.diff.ignoreMetadata')) {
					this._disposeMetadata();
				} else {
					this.cell.metadataStatusHeight = 25;
					this._buildMetadata();
					this.updateMetadataRendering();
					metadataLayoutChange = true;
				}
			}

			if (e.affectsConfiguration('notebook.diff.ignoreOutputs')) {
				this._outputLocalDisposable.clear();
				if (this.configurationService.getValue('notebook.diff.ignoreOutputs') || this.notebookEditor.textModel?.transientOptions.transientOutputs) {
					this._disposeOutput();
				} else {
					this.cell.outputStatusHeight = 25;
					this._buildOutput();
					outputLayoutChange = true;
				}
			}

			if (metadataLayoutChange || outputLayoutChange) {
				this.layout({ metadataHeight: metadataLayoutChange, outputTotalHeight: outputLayoutChange });
			}
		}));
	}

	override updateSourceEditor(): void {
		this._cellHeaderContainer = this.templateData.cellHeaderContainer;
		this._cellHeaderContainer.style.display = 'flex';
		this._cellHeaderContainer.innerText = '';
		this._editorContainer = this.templateData.editorContainer;
		this._editorContainer.classList.add('diff');

		const renderSourceEditor = () => {
			if (this.cell.cellFoldingState === PropertyFoldingState.Collapsed) {
				this._editorContainer.style.display = 'none';
				this.cell.editorHeight = 0;
				return;
			}
			const lineHeight = this.notebookEditor.getLayoutInfo().fontInfo.lineHeight || 17;
			const editorHeight = this.cell.computeInputEditorHeight(lineHeight);

			this._editorContainer.style.height = `${editorHeight}px`;
			this._editorContainer.style.display = 'block';

			if (this._editor) {
				const contentHeight = this._editor.getContentHeight();
				if (contentHeight >= 0) {
					this.cell.editorHeight = contentHeight;
				}
				return;
			}

			this._editor = this.templateData.sourceEditor;
			this._editor.layout(
				{
					width: (this.notebookEditor.getLayoutInfo().width - 2 * DIFF_CELL_MARGIN) / 2 - 18,
					height: editorHeight
				}
			);
			this._editor.updateOptions({ readOnly: this.readonly });
			this.cell.editorHeight = editorHeight;

			this._register(this._editor.onDidContentSizeChange((e) => {
				if (this.cell.cellFoldingState === PropertyFoldingState.Expanded && e.contentHeightChanged && this.cell.layoutInfo.editorHeight !== e.contentHeight) {
					this.cell.editorHeight = e.contentHeight;
				}
			}));
			this._initializeSourceDiffEditor(this.nestedCellViewModel);
		};

		this._cellHeader = this._register(this.instantiationService.createInstance(
			PropertyHeader,
			this.cell,
			this._cellHeaderContainer,
			this.notebookEditor,
			{
				updateInfoRendering: () => renderSourceEditor(),
				checkIfModified: () => ({ reason: undefined }),
				getFoldingState: () => this.cell.cellFoldingState,
				updateFoldingState: (state) => this.cell.cellFoldingState = state,
				unChangedLabel: 'Input',
				changedLabel: 'Input',
				prefix: 'input',
				menuId: MenuId.NotebookDiffCellInputTitle
			}
		));
		this._cellHeader.buildHeader();
		renderSourceEditor();

		this._initializeSourceDiffEditor(this.nestedCellViewModel);
	}
	protected calculateDiagonalFillHeight() {
		return this.cell.layoutInfo.cellStatusHeight + this.cell.layoutInfo.editorHeight + this.cell.layoutInfo.editorMargin + this.cell.layoutInfo.metadataStatusHeight + this.cell.layoutInfo.metadataHeight + this.cell.layoutInfo.outputTotalHeight + this.cell.layoutInfo.outputStatusHeight;
	}

	private async _initializeSourceDiffEditor(modifiedCell: DiffNestedCellViewModel) {
		const modifiedRef = await this.textModelService.createModelReference(modifiedCell.uri);

		if (this._isDisposed) {
			return;
		}

		const modifiedTextModel = modifiedRef.object.textEditorModel;
		this._register(modifiedRef);

		this._editor!.setModel(modifiedTextModel);

		const editorViewState = this.cell.getSourceEditorViewState() as editorCommon.IDiffEditorViewState | null;
		if (editorViewState) {
			this._editor!.restoreViewState(editorViewState);
		}

		const contentHeight = this._editor!.getContentHeight();
		this.cell.editorHeight = contentHeight;
		const height = `${this.calculateDiagonalFillHeight()}px`;
		if (this._diagonalFill!.style.height !== height) {
			this._diagonalFill!.style.height = height;
		}
	}

	_disposeMetadata() {
		this.cell.metadataStatusHeight = 0;
		this.cell.metadataHeight = 0;
		this.templateData.cellHeaderContainer.style.display = 'none';
		this.templateData.metadataHeaderContainer.style.display = 'none';
		this.templateData.metadataInfoContainer.style.display = 'none';
		this._metadataEditor = undefined;
	}

	_buildMetadata() {
		this._metadataHeaderContainer = this.templateData.metadataHeaderContainer;
		this._metadataInfoContainer = this.templateData.metadataInfoContainer;
		this._metadataHeaderContainer.style.display = 'flex';
		this._metadataInfoContainer.style.display = 'block';
		this._metadataHeaderContainer.innerText = '';
		this._metadataInfoContainer.innerText = '';

		this._metadataHeader = this.instantiationService.createInstance(
			PropertyHeader,
			this.cell,
			this._metadataHeaderContainer,
			this.notebookEditor,
			{
				updateInfoRendering: this.updateMetadataRendering.bind(this),
				checkIfModified: () => {
					return this.cell.checkMetadataIfModified();
				},
				getFoldingState: () => {
					return this.cell.metadataFoldingState;
				},
				updateFoldingState: (state) => {
					this.cell.metadataFoldingState = state;
				},
				unChangedLabel: 'Metadata',
				changedLabel: 'Metadata changed',
				prefix: 'metadata',
				menuId: MenuId.NotebookDiffCellMetadataTitle
			}
		);
		this._metadataLocalDisposable.add(this._metadataHeader);
		this._metadataHeader.buildHeader();
	}

	_buildOutput() {
		this.templateData.outputHeaderContainer.style.display = 'flex';
		this.templateData.outputInfoContainer.style.display = 'block';

		this._outputHeaderContainer = this.templateData.outputHeaderContainer;
		this._outputInfoContainer = this.templateData.outputInfoContainer;

		this._outputHeaderContainer.innerText = '';
		this._outputInfoContainer.innerText = '';

		this._outputHeader = this.instantiationService.createInstance(
			PropertyHeader,
			this.cell,
			this._outputHeaderContainer,
			this.notebookEditor,
			{
				updateInfoRendering: this.updateOutputRendering.bind(this),
				checkIfModified: () => {
					return this.cell.checkIfOutputsModified();
				},
				getFoldingState: () => {
					return this.cell.outputFoldingState;
				},
				updateFoldingState: (state) => {
					this.cell.outputFoldingState = state;
				},
				unChangedLabel: 'Outputs',
				changedLabel: 'Outputs changed',
				prefix: 'output',
				menuId: MenuId.NotebookDiffCellOutputsTitle
			}
		);
		this._outputLocalDisposable.add(this._outputHeader);
		this._outputHeader.buildHeader();
	}

	_disposeOutput() {
		this._hideOutputsRaw();
		this._hideOutputsRenderer();
		this._hideOutputsEmptyView();

		this.cell.rawOutputHeight = 0;
		this.cell.outputMetadataHeight = 0;
		this.cell.outputStatusHeight = 0;
		this.templateData.outputHeaderContainer.style.display = 'none';
		this.templateData.outputInfoContainer.style.display = 'none';
		this._outputViewContainer = undefined;
	}
}
export class DeletedElement extends SingleSideDiffElement {
	constructor(
		notebookEditor: INotebookTextDiffEditor,
		cell: SingleSideDiffElementViewModel,
		templateData: CellDiffSingleSideRenderTemplate,
		@ILanguageService languageService: ILanguageService,
		@IModelService modelService: IModelService,
		@ITextModelService textModelService: ITextModelService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
		@INotificationService notificationService: INotificationService,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@ITextResourceConfigurationService textConfigurationService: ITextResourceConfigurationService,
	) {
		super(notebookEditor, cell, templateData, 'left', instantiationService, languageService, modelService, textModelService, contextMenuService, keybindingService, notificationService, menuService, contextKeyService, configurationService, textConfigurationService);
	}

	get nestedCellViewModel() {
		return this.cell.original!;
	}
	get readonly() {
		return true;
	}

	styleContainer(container: HTMLElement) {
		container.classList.remove('inserted');
		container.classList.add('removed');
	}

	layout(state: IDiffElementLayoutState) {
		DOM.scheduleAtNextAnimationFrame(DOM.getWindow(this._diffEditorContainer), () => {
			if ((state.editorHeight || state.outerWidth) && this._editor) {
				this._editorContainer.style.height = `${this.cell.layoutInfo.editorHeight}px`;
				this._editor.layout({
					width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, false),
					height: this.cell.layoutInfo.editorHeight
				});
			}

			if (state.outerWidth && this._editor) {
				this._editorContainer.style.height = `${this.cell.layoutInfo.editorHeight}px`;
				this._editor.layout();
			}

			if (state.metadataHeight || state.outerWidth) {
				this._metadataEditor?.layout({
					width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, false),
					height: this.cell.layoutInfo.metadataHeight
				});
			}

			if (state.outputTotalHeight || state.outerWidth) {
				this._outputEditor?.layout({
					width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, false),
					height: this.cell.layoutInfo.outputTotalHeight
				});
			}

			if (this._diagonalFill) {
				this._diagonalFill.style.height = `${this.calculateDiagonalFillHeight()}px`;
			}

			this.layoutNotebookCell();
		});
	}


	_buildOutputRendererContainer() {
		if (!this._outputViewContainer) {
			this._outputViewContainer = DOM.append(this._outputInfoContainer, DOM.$('.output-view-container'));
			this._outputEmptyElement = DOM.append(this._outputViewContainer, DOM.$('.output-empty-view'));
			const span = DOM.append(this._outputEmptyElement, DOM.$('span'));
			span.innerText = 'No outputs to render';

			if (!this.cell.original?.outputs.length) {
				this._outputEmptyElement.style.display = 'block';
			} else {
				this._outputEmptyElement.style.display = 'none';
			}

			this.cell.layoutChange();

			this._outputLeftView = this.instantiationService.createInstance(OutputContainer, this.notebookEditor, this.notebookEditor.textModel!, this.cell, this.cell.original!, DiffSide.Original, this._outputViewContainer);
			this._register(this._outputLeftView);
			this._outputLeftView.render();

			const removedOutputRenderListener = this.notebookEditor.onDidDynamicOutputRendered(e => {
				if (e.cell.uri.toString() === this.cell.original!.uri.toString()) {
					this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Original, this.cell.original!.id, ['nb-cellDeleted'], []);
					removedOutputRenderListener.dispose();
				}
			});

			this._register(removedOutputRenderListener);
		}

		this._outputViewContainer.style.display = 'block';
	}

	_decorate() {
		this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Original, this.cell.original!.id, ['nb-cellDeleted'], []);
	}

	_showOutputsRenderer() {
		if (this._outputViewContainer) {
			this._outputViewContainer.style.display = 'block';

			this._outputLeftView?.showOutputs();
			this._decorate();
		}
	}

	_hideOutputsRenderer() {
		if (this._outputViewContainer) {
			this._outputViewContainer.style.display = 'none';

			this._outputLeftView?.hideOutputs();
		}
	}

	override dispose() {
		if (this._editor) {
			this.cell.saveSpirceEditorViewState(this._editor.saveViewState());
		}

		super.dispose();
	}
}

export class InsertElement extends SingleSideDiffElement {
	constructor(
		notebookEditor: INotebookTextDiffEditor,
		cell: SingleSideDiffElementViewModel,
		templateData: CellDiffSingleSideRenderTemplate,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILanguageService languageService: ILanguageService,
		@IModelService modelService: IModelService,
		@ITextModelService textModelService: ITextModelService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
		@INotificationService notificationService: INotificationService,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@ITextResourceConfigurationService textConfigurationService: ITextResourceConfigurationService,
	) {
		super(notebookEditor, cell, templateData, 'right', instantiationService, languageService, modelService, textModelService, contextMenuService, keybindingService, notificationService, menuService, contextKeyService, configurationService, textConfigurationService);
	}
	get nestedCellViewModel() {
		return this.cell.modified!;
	}
	get readonly() {
		return false;
	}

	styleContainer(container: HTMLElement): void {
		container.classList.remove('removed');
		container.classList.add('inserted');
	}

	_buildOutputRendererContainer() {
		if (!this._outputViewContainer) {
			this._outputViewContainer = DOM.append(this._outputInfoContainer, DOM.$('.output-view-container'));
			this._outputEmptyElement = DOM.append(this._outputViewContainer, DOM.$('.output-empty-view'));
			this._outputEmptyElement.innerText = 'No outputs to render';

			if (!this.cell.modified?.outputs.length) {
				this._outputEmptyElement.style.display = 'block';
			} else {
				this._outputEmptyElement.style.display = 'none';
			}

			this.cell.layoutChange();

			this._outputRightView = this.instantiationService.createInstance(OutputContainer, this.notebookEditor, this.notebookEditor.textModel!, this.cell, this.cell.modified!, DiffSide.Modified, this._outputViewContainer);
			this._register(this._outputRightView);
			this._outputRightView.render();

			const insertOutputRenderListener = this.notebookEditor.onDidDynamicOutputRendered(e => {
				if (e.cell.uri.toString() === this.cell.modified!.uri.toString()) {
					this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Modified, this.cell.modified!.id, ['nb-cellAdded'], []);
					insertOutputRenderListener.dispose();
				}
			});
			this._register(insertOutputRenderListener);
		}

		this._outputViewContainer.style.display = 'block';
	}

	_decorate() {
		this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Modified, this.cell.modified!.id, ['nb-cellAdded'], []);
	}

	_showOutputsRenderer() {
		if (this._outputViewContainer) {
			this._outputViewContainer.style.display = 'block';
			this._outputRightView?.showOutputs();
			this._decorate();
		}
	}

	_hideOutputsRenderer() {
		if (this._outputViewContainer) {
			this._outputViewContainer.style.display = 'none';
			this._outputRightView?.hideOutputs();
		}
	}

	layout(state: IDiffElementLayoutState) {
		DOM.scheduleAtNextAnimationFrame(DOM.getWindow(this._diffEditorContainer), () => {
			if ((state.editorHeight || state.outerWidth) && this._editor) {
				this._editorContainer.style.height = `${this.cell.layoutInfo.editorHeight}px`;
				this._editor.layout({
					width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, false),
					height: this.cell.layoutInfo.editorHeight
				});
			}

			if (state.outerWidth && this._editor) {
				this._editorContainer.style.height = `${this.cell.layoutInfo.editorHeight}px`;
				this._editor.layout();
			}

			if (state.metadataHeight || state.outerWidth) {
				this._metadataEditor?.layout({
					width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, true),
					height: this.cell.layoutInfo.metadataHeight
				});
			}

			if (state.outputTotalHeight || state.outerWidth) {
				this._outputEditor?.layout({
					width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, false),
					height: this.cell.layoutInfo.outputTotalHeight
				});
			}

			this.layoutNotebookCell();

			if (this._diagonalFill) {
				this._diagonalFill.style.height = `${this.calculateDiagonalFillHeight()}px`;
			}
		});
	}

	override dispose() {
		if (this._editor) {
			this.cell.saveSpirceEditorViewState(this._editor.saveViewState());
		}

		super.dispose();
	}
}

export class ModifiedElement extends AbstractElementRenderer {
	private _editor?: DiffEditorWidget;
	private _editorViewStateChanged: boolean;
	protected _toolbar!: ToolBar;
	protected _menu!: IMenu;

	override readonly cell: SideBySideDiffElementViewModel;
	override readonly templateData: CellDiffSideBySideRenderTemplate;

	constructor(
		notebookEditor: INotebookTextDiffEditor,
		cell: SideBySideDiffElementViewModel,
		templateData: CellDiffSideBySideRenderTemplate,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILanguageService languageService: ILanguageService,
		@IModelService modelService: IModelService,
		@ITextModelService textModelService: ITextModelService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
		@INotificationService notificationService: INotificationService,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@ITextResourceConfigurationService textConfigurationService: ITextResourceConfigurationService,
	) {
		super(notebookEditor, cell, templateData, 'full', instantiationService, languageService, modelService, textModelService, contextMenuService, keybindingService, notificationService, menuService, contextKeyService, configurationService, textConfigurationService);
		this.cell = cell;
		this.templateData = templateData;
		this._editorViewStateChanged = false;

		this.updateBorders();
	}

	init() { }
	styleContainer(container: HTMLElement): void {
		container.classList.remove('inserted', 'removed');
	}

	override buildBody(): void {
		super.buildBody();
		if (this.cell.displayIconToHideUnmodifiedCells) {
			this._register(this.templateData.marginOverlay.onAction(() => this.cell.hideUnchangedCells()));
			this.templateData.marginOverlay.show();
		} else {
			this.templateData.marginOverlay.hide();
		}
	}
	_disposeMetadata() {
		this.cell.metadataStatusHeight = 0;
		this.cell.metadataHeight = 0;
		this.templateData.metadataHeaderContainer.style.display = 'none';
		this.templateData.metadataInfoContainer.style.display = 'none';
		this._metadataEditor = undefined;
	}

	_buildMetadata() {
		this._metadataHeaderContainer = this.templateData.metadataHeaderContainer;
		this._metadataInfoContainer = this.templateData.metadataInfoContainer;
		this._metadataHeaderContainer.style.display = 'flex';
		this._metadataInfoContainer.style.display = 'block';

		this._metadataHeaderContainer.innerText = '';
		this._metadataInfoContainer.innerText = '';

		this._metadataHeader = this.instantiationService.createInstance(
			PropertyHeader,
			this.cell,
			this._metadataHeaderContainer,
			this.notebookEditor,
			{
				updateInfoRendering: this.updateMetadataRendering.bind(this),
				checkIfModified: () => {
					return this.cell.checkMetadataIfModified();
				},
				getFoldingState: () => {
					return this.cell.metadataFoldingState;
				},
				updateFoldingState: (state) => {
					this.cell.metadataFoldingState = state;
				},
				unChangedLabel: 'Metadata',
				changedLabel: 'Metadata changed',
				prefix: 'metadata',
				menuId: MenuId.NotebookDiffCellMetadataTitle
			}
		);
		this._metadataLocalDisposable.add(this._metadataHeader);
		this._metadataHeader.buildHeader();
	}

	_disposeOutput() {
		this._hideOutputsRaw();
		this._hideOutputsRenderer();
		this._hideOutputsEmptyView();

		this.cell.rawOutputHeight = 0;
		this.cell.outputMetadataHeight = 0;
		this.cell.outputStatusHeight = 0;
		this.templateData.outputHeaderContainer.style.display = 'none';
		this.templateData.outputInfoContainer.style.display = 'none';
		this._outputViewContainer = undefined;
	}

	_buildOutput() {
		this.templateData.outputHeaderContainer.style.display = 'flex';
		this.templateData.outputInfoContainer.style.display = 'block';

		this._outputHeaderContainer = this.templateData.outputHeaderContainer;
		this._outputInfoContainer = this.templateData.outputInfoContainer;
		this._outputHeaderContainer.innerText = '';
		this._outputInfoContainer.innerText = '';

		if (this.cell.checkIfOutputsModified()) {
			this._outputInfoContainer.classList.add('modified');
		} else {
			this._outputInfoContainer.classList.remove('modified');
		}

		this._outputHeader = this.instantiationService.createInstance(
			PropertyHeader,
			this.cell,
			this._outputHeaderContainer,
			this.notebookEditor,
			{
				updateInfoRendering: this.updateOutputRendering.bind(this),
				checkIfModified: () => {
					return this.cell.checkIfOutputsModified();
				},
				getFoldingState: () => {
					return this.cell.outputFoldingState;
				},
				updateFoldingState: (state) => {
					this.cell.outputFoldingState = state;
				},
				unChangedLabel: 'Outputs',
				changedLabel: 'Outputs changed',
				prefix: 'output',
				menuId: MenuId.NotebookDiffCellOutputsTitle
			}
		);
		this._outputLocalDisposable.add(this._outputHeader);
		this._outputHeader.buildHeader();
	}

	_buildOutputRendererContainer() {
		if (!this._outputViewContainer) {
			this._outputViewContainer = DOM.append(this._outputInfoContainer, DOM.$('.output-view-container'));
			this._outputEmptyElement = DOM.append(this._outputViewContainer, DOM.$('.output-empty-view'));
			this._outputEmptyElement.innerText = 'No outputs to render';

			if (!this.cell.checkIfOutputsModified() && this.cell.modified.outputs.length === 0) {
				this._outputEmptyElement.style.display = 'block';
			} else {
				this._outputEmptyElement.style.display = 'none';
			}

			this.cell.layoutChange();

			this._register(this.cell.modified.textModel.onDidChangeOutputs(() => {
				// currently we only allow outputs change to the modified cell
				if (!this.cell.checkIfOutputsModified() && this.cell.modified.outputs.length === 0) {
					this._outputEmptyElement!.style.display = 'block';
				} else {
					this._outputEmptyElement!.style.display = 'none';
				}
				this._decorate();
			}));

			this._outputLeftContainer = DOM.append(this._outputViewContainer, DOM.$('.output-view-container-left'));
			this._outputRightContainer = DOM.append(this._outputViewContainer, DOM.$('.output-view-container-right'));
			this._outputMetadataContainer = DOM.append(this._outputViewContainer, DOM.$('.output-view-container-metadata'));

			const outputModified = this.cell.checkIfOutputsModified();
			const outputMetadataChangeOnly = outputModified
				&& outputModified.kind === OutputComparison.Metadata
				&& this.cell.original.outputs.length === 1
				&& this.cell.modified.outputs.length === 1
				&& outputEqual(this.cell.original.outputs[0], this.cell.modified.outputs[0]) === OutputComparison.Metadata;

			if (outputModified && !outputMetadataChangeOnly) {
				const originalOutputRenderListener = this.notebookEditor.onDidDynamicOutputRendered(e => {
					if (e.cell.uri.toString() === this.cell.original.uri.toString() && this.cell.checkIfOutputsModified()) {
						this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Original, this.cell.original.id, ['nb-cellDeleted'], []);
						originalOutputRenderListener.dispose();
					}
				});

				const modifiedOutputRenderListener = this.notebookEditor.onDidDynamicOutputRendered(e => {
					if (e.cell.uri.toString() === this.cell.modified.uri.toString() && this.cell.checkIfOutputsModified()) {
						this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Modified, this.cell.modified.id, ['nb-cellAdded'], []);
						modifiedOutputRenderListener.dispose();
					}
				});

				this._register(originalOutputRenderListener);
				this._register(modifiedOutputRenderListener);
			}

			// We should use the original text model here
			this._outputLeftView = this.instantiationService.createInstance(OutputContainer, this.notebookEditor, this.notebookEditor.textModel!, this.cell, this.cell.original, DiffSide.Original, this._outputLeftContainer);
			this._outputLeftView.render();
			this._register(this._outputLeftView);
			this._outputRightView = this.instantiationService.createInstance(OutputContainer, this.notebookEditor, this.notebookEditor.textModel!, this.cell, this.cell.modified, DiffSide.Modified, this._outputRightContainer);
			this._outputRightView.render();
			this._register(this._outputRightView);

			if (outputModified && !outputMetadataChangeOnly) {
				this._decorate();
			}

			if (outputMetadataChangeOnly) {

				this._outputMetadataContainer.style.top = `${this.cell.layoutInfo.rawOutputHeight}px`;
				// single output, metadata change, let's render a diff editor for metadata
				this._outputMetadataEditor = this.instantiationService.createInstance(DiffEditorWidget, this._outputMetadataContainer, {
					...fixedDiffEditorOptions,
					overflowWidgetsDomNode: this.notebookEditor.getOverflowContainerDomNode(),
					readOnly: true,
					ignoreTrimWhitespace: false,
					automaticLayout: false,
					dimension: {
						height: OUTPUT_EDITOR_HEIGHT_MAGIC,
						width: this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, true)
					}
				}, {
					originalEditor: getOptimizedNestedCodeEditorWidgetOptions(),
					modifiedEditor: getOptimizedNestedCodeEditorWidgetOptions()
				});

				this._register(this._outputMetadataEditor);
				const originalOutputMetadataSource = JSON.stringify(this.cell.original.outputs[0].metadata ?? {}, undefined, '\t');
				const modifiedOutputMetadataSource = JSON.stringify(this.cell.modified.outputs[0].metadata ?? {}, undefined, '\t');

				const mode = this.languageService.createById('json');
				const originalModel = this.modelService.createModel(originalOutputMetadataSource, mode, undefined, true);
				const modifiedModel = this.modelService.createModel(modifiedOutputMetadataSource, mode, undefined, true);

				this._outputMetadataEditor.setModel({
					original: originalModel,
					modified: modifiedModel
				});

				this.cell.outputMetadataHeight = this._outputMetadataEditor.getContentHeight();

				this._register(this._outputMetadataEditor.onDidContentSizeChange((e) => {
					this.cell.outputMetadataHeight = e.contentHeight;
				}));
			}
		}

		this._outputViewContainer.style.display = 'block';
	}

	_decorate() {
		if (this.cell.checkIfOutputsModified()) {
			this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Original, this.cell.original.id, ['nb-cellDeleted'], []);
			this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Modified, this.cell.modified.id, ['nb-cellAdded'], []);
		} else {
			this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Original, this.cell.original.id, [], ['nb-cellDeleted']);
			this.notebookEditor.deltaCellOutputContainerClassNames(DiffSide.Modified, this.cell.modified.id, [], ['nb-cellAdded']);
		}
	}

	_showOutputsRenderer() {
		if (this._outputViewContainer) {
			this._outputViewContainer.style.display = 'block';

			this._outputLeftView?.showOutputs();
			this._outputRightView?.showOutputs();
			this._outputMetadataEditor?.layout({
				width: this._editor?.getViewWidth() || this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, true),
				height: this.cell.layoutInfo.outputMetadataHeight
			});

			this._decorate();
		}
	}

	_hideOutputsRenderer() {
		if (this._outputViewContainer) {
			this._outputViewContainer.style.display = 'none';

			this._outputLeftView?.hideOutputs();
			this._outputRightView?.hideOutputs();
		}
	}

	updateSourceEditor(): void {
		this._cellHeaderContainer = this.templateData.cellHeaderContainer;
		this._cellHeaderContainer.style.display = 'flex';
		this._cellHeaderContainer.innerText = '';
		const modifiedCell = this.cell.modified;
		this._editorContainer = this.templateData.editorContainer;
		this._editorContainer.classList.add('diff');

		const renderSourceEditor = () => {
			if (this.cell.cellFoldingState === PropertyFoldingState.Collapsed) {
				this._editorContainer.style.display = 'none';
				this.cell.editorHeight = 0;
				return;
			}

			const lineCount = modifiedCell.textModel.textBuffer.getLineCount();
			const lineHeight = this.notebookEditor.getLayoutInfo().fontInfo.lineHeight || 17;
			const editorHeight = this.cell.layoutInfo.editorHeight !== 0 ? this.cell.layoutInfo.editorHeight : this.cell.computeInputEditorHeight(lineHeight);

			this._editorContainer.style.height = `${editorHeight}px`;
			this._editorContainer.style.display = 'block';

			if (this._editor) {
				const contentHeight = this._editor.getContentHeight();
				if (contentHeight >= 0) {
					this.cell.editorHeight = contentHeight;
				}
				return;
			}

			this._editor = this.templateData.sourceEditor;
			// If there is only 1 line, then ensure we have the necessary padding to display the button for whitespaces.
			// E.g. assume we have a cell with 1 line and we add some whitespace,
			// Then diff editor displays the button `Show Whitespace Differences`, however with 12 paddings on the top, the
			// button can get cut off.
			const options: IDiffEditorOptions = {
				padding: getEditorPadding(lineCount)
			};
			const unchangedRegions = this._register(getUnchangedRegionSettings(this.configurationService));
			if (unchangedRegions.options.enabled) {
				options.hideUnchangedRegions = unchangedRegions.options;
			}
			this._editor.updateOptions(options);
			this._register(unchangedRegions.onDidChangeEnablement(() => {
				options.hideUnchangedRegions = unchangedRegions.options;
				this._editor?.updateOptions(options);
			}));
			this._editor.layout({
				width: this.notebookEditor.getLayoutInfo().width - 2 * DIFF_CELL_MARGIN,
				height: editorHeight
			});
			this._register(this._editor.onDidContentSizeChange((e) => {
				if (this.cell.cellFoldingState === PropertyFoldingState.Expanded && e.contentHeightChanged && this.cell.layoutInfo.editorHeight !== e.contentHeight) {
					this.cell.editorHeight = e.contentHeight;
				}
			}));
			this._initializeSourceDiffEditor();
		};

		this._cellHeader = this._register(this.instantiationService.createInstance(
			PropertyHeader,
			this.cell,
			this._cellHeaderContainer,
			this.notebookEditor,
			{
				updateInfoRendering: () => renderSourceEditor(),
				checkIfModified: () => {
					return this.cell.modified?.textModel.getTextBufferHash() !== this.cell.original?.textModel.getTextBufferHash() ? { reason: undefined } : false;
				},
				getFoldingState: () => this.cell.cellFoldingState,
				updateFoldingState: (state) => this.cell.cellFoldingState = state,
				unChangedLabel: 'Input',
				changedLabel: 'Input changed',
				prefix: 'input',
				menuId: MenuId.NotebookDiffCellInputTitle
			}
		));
		this._cellHeader.buildHeader();
		renderSourceEditor();

		const scopedContextKeyService = this.contextKeyService.createScoped(this.templateData.inputToolbarContainer);
		this._register(scopedContextKeyService);
		const inputChanged = NOTEBOOK_DIFF_CELL_INPUT.bindTo(scopedContextKeyService);
		inputChanged.set(this.cell.modified.textModel.getTextBufferHash() !== this.cell.original.textModel.getTextBufferHash());

		const ignoreWhitespace = NOTEBOOK_DIFF_CELL_IGNORE_WHITESPACE.bindTo(scopedContextKeyService);
		const ignore = this.textConfigurationService.getValue<boolean>(this.cell.modified.uri, 'diffEditor.ignoreTrimWhitespace');
		ignoreWhitespace.set(ignore);

		this._toolbar = this.templateData.toolbar;

		this._toolbar.context = this.cell;

		const refreshToolbar = () => {
			const ignore = this.textConfigurationService.getValue<boolean>(this.cell.modified.uri, 'diffEditor.ignoreTrimWhitespace');
			ignoreWhitespace.set(ignore);
			const hasChanges = this.cell.modified.textModel.getTextBufferHash() !== this.cell.original.textModel.getTextBufferHash();
			inputChanged.set(hasChanges);

			if (hasChanges) {
				const menu = this.menuService.getMenuActions(MenuId.NotebookDiffCellInputTitle, scopedContextKeyService, { shouldForwardArgs: true });
				const actions = getFlatActionBarActions(menu);
				this._toolbar.setActions(actions);
			} else {
				this._toolbar.setActions([]);
			}
		};

		this._register(this.cell.modified.textModel.onDidChangeContent(() => refreshToolbar()));
		this._register(this.textConfigurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(this.cell.modified.uri, 'diffEditor') &&
				e.affectedKeys.has('diffEditor.ignoreTrimWhitespace')) {
				refreshToolbar();
			}
		}));
		refreshToolbar();
	}

	private async _initializeSourceDiffEditor() {
		const [originalRef, modifiedRef] = await Promise.all([
			this.textModelService.createModelReference(this.cell.original.uri),
			this.textModelService.createModelReference(this.cell.modified.uri)]);
		this._register(originalRef);
		this._register(modifiedRef);

		if (this._isDisposed) {
			originalRef.dispose();
			modifiedRef.dispose();
			return;
		}

		const vm = this._register(this._editor!.createViewModel({
			original: originalRef.object.textEditorModel,
			modified: modifiedRef.object.textEditorModel,
		}));

		// Reduces flicker (compute this before setting the model)
		// Else when the model is set, the height of the editor will be x, after diff is computed, then height will be y.
		// & that results in flicker.
		await vm.waitForDiff();
		this._editor!.setModel(vm);

		const handleViewStateChange = () => {
			this._editorViewStateChanged = true;
		};

		const handleScrollChange = (e: editorCommon.IScrollEvent) => {
			if (e.scrollTopChanged || e.scrollLeftChanged) {
				this._editorViewStateChanged = true;
			}
		};

		this.updateEditorOptionsForWhitespace();
		this._register(this._editor!.getOriginalEditor().onDidChangeCursorSelection(handleViewStateChange));
		this._register(this._editor!.getOriginalEditor().onDidScrollChange(handleScrollChange));
		this._register(this._editor!.getModifiedEditor().onDidChangeCursorSelection(handleViewStateChange));
		this._register(this._editor!.getModifiedEditor().onDidScrollChange(handleScrollChange));

		const editorViewState = this.cell.getSourceEditorViewState() as editorCommon.IDiffEditorViewState | null;
		if (editorViewState) {
			this._editor!.restoreViewState(editorViewState);
		}

		const contentHeight = this._editor!.getContentHeight();
		this.cell.editorHeight = contentHeight;
	}
	private updateEditorOptionsForWhitespace() {
		const editor = this._editor;
		if (!editor) {
			return;
		}
		const uri = editor.getModel()?.modified.uri || editor.getModel()?.original.uri;
		if (!uri) {
			return;
		}
		const ignoreTrimWhitespace = this.textConfigurationService.getValue<boolean>(uri, 'diffEditor.ignoreTrimWhitespace');
		editor.updateOptions({ ignoreTrimWhitespace });

		this._register(this.textConfigurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(uri, 'diffEditor') &&
				e.affectedKeys.has('diffEditor.ignoreTrimWhitespace')) {
				const ignoreTrimWhitespace = this.textConfigurationService.getValue<boolean>(uri, 'diffEditor.ignoreTrimWhitespace');
				editor.updateOptions({ ignoreTrimWhitespace });
			}
		}));
	}
	layout(state: IDiffElementLayoutState) {
		DOM.scheduleAtNextAnimationFrame(DOM.getWindow(this._diffEditorContainer), () => {
			if (state.editorHeight && this._editor) {
				this._editorContainer.style.height = `${this.cell.layoutInfo.editorHeight}px`;
				this._editor.layout({
					width: this._editor!.getViewWidth(),
					height: this.cell.layoutInfo.editorHeight
				});
			}

			if (state.outerWidth && this._editor) {
				this._editorContainer.style.height = `${this.cell.layoutInfo.editorHeight}px`;
				this._editor.layout();
			}

			if (state.metadataHeight || state.outerWidth) {
				if (this._metadataEditorContainer) {
					this._metadataEditorContainer.style.height = `${this.cell.layoutInfo.metadataHeight}px`;
					this._metadataEditor?.layout({
						width: this._editor?.getViewWidth() || this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, true),
						height: this.cell.layoutInfo.metadataHeight
					});
				}
			}

			if (state.outputTotalHeight || state.outerWidth) {
				if (this._outputEditorContainer) {
					this._outputEditorContainer.style.height = `${this.cell.layoutInfo.outputTotalHeight}px`;
					this._outputEditor?.layout({
						width: this._editor?.getViewWidth() || this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, true),
						height: this.cell.layoutInfo.outputTotalHeight
					});
				}

				if (this._outputMetadataContainer) {
					this._outputMetadataContainer.style.height = `${this.cell.layoutInfo.outputMetadataHeight}px`;
					this._outputMetadataContainer.style.top = `${this.cell.layoutInfo.outputTotalHeight - this.cell.layoutInfo.outputMetadataHeight}px`;
					this._outputMetadataEditor?.layout({
						width: this._editor?.getViewWidth() || this.cell.getComputedCellContainerWidth(this.notebookEditor.getLayoutInfo(), false, true),
						height: this.cell.layoutInfo.outputMetadataHeight
					});
				}
			}

			this.layoutNotebookCell();
		});
	}

	override dispose() {
		// The editor isn't disposed yet, it can be re-used.
		// However the model can be disposed before the editor & that causes issues.
		if (this._editor) {
			this._editor.setModel(null);
		}

		if (this._editor && this._editorViewStateChanged) {
			this.cell.saveSpirceEditorViewState(this._editor.saveViewState());
		}

		super.dispose();
	}
}


export class CollapsedCellOverlayWidget extends Disposable implements IDiffCellMarginOverlay {
	private readonly _nodes = DOM.h('div.diff-hidden-cells', [
		DOM.h('div.center@content', { style: { display: 'flex' } }, [
			DOM.$('a', {
				title: localize('showUnchangedCells', 'Show Unchanged Cells'),
				role: 'button',
				onclick: () => { this._action.fire(); }
			},
				...renderLabelWithIcons('$(unfold)'))]
		),
	]);

	private readonly _action = this._register(new Emitter<void>());
	public readonly onAction = this._action.event;
	constructor(
		private readonly container: HTMLElement
	) {
		super();

		this._nodes.root.style.display = 'none';
		container.appendChild(this._nodes.root);
	}

	public show() {
		this._nodes.root.style.display = 'block';
	}

	public hide() {
		this._nodes.root.style.display = 'none';
	}

	public override dispose() {
		this.hide();
		this.container.removeChild(this._nodes.root);
		DOM.reset(this._nodes.root);
		super.dispose();
	}
}

export class UnchangedCellOverlayWidget extends Disposable implements IDiffCellMarginOverlay {
	private readonly _nodes = DOM.h('div.diff-hidden-cells', [
		DOM.h('div.center@content', { style: { display: 'flex' } }, [
			DOM.$('a', {
				title: localize('hideUnchangedCells', 'Hide Unchanged Cells'),
				role: 'button',
				onclick: () => { this._action.fire(); }
			},
				...renderLabelWithIcons('$(fold)')
			),
		]
		),
	]);

	private readonly _action = this._register(new Emitter<void>());
	public readonly onAction = this._action.event;
	constructor(
		private readonly container: HTMLElement
	) {
		super();

		this._nodes.root.style.display = 'none';
		container.appendChild(this._nodes.root);
	}

	public show() {
		this._nodes.root.style.display = 'block';
	}

	public hide() {
		this._nodes.root.style.display = 'none';
	}
	public override dispose() {
		this.hide();
		this.container.removeChild(this._nodes.root);
		DOM.reset(this._nodes.root);
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/diffElementOutputs.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/diffElementOutputs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../base/browser/dom.js';
import * as nls from '../../../../../nls.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { DiffElementCellViewModelBase, SideBySideDiffElementViewModel } from './diffElementViewModel.js';
import { DiffSide, INotebookTextDiffEditor } from './notebookDiffEditorBrowser.js';
import { ICellOutputViewModel, IInsetRenderOutput, RenderOutputType } from '../notebookBrowser.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { NotebookCellOutputsSplice } from '../../common/notebookCommon.js';
import { INotebookService } from '../../common/notebookService.js';
import { DiffNestedCellViewModel } from './diffNestedCellViewModel.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { mimetypeIcon } from '../notebookIcons.js';
import { StandardKeyboardEvent } from '../../../../../base/browser/keyboardEvent.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { IQuickInputService, IQuickPickItem } from '../../../../../platform/quickinput/common/quickInput.js';

interface IMimeTypeRenderer extends IQuickPickItem {
	index: number;
}

export class OutputElement extends Disposable {
	readonly resizeListener = this._register(new DisposableStore());
	domNode!: HTMLElement;
	renderResult?: IInsetRenderOutput;

	constructor(
		private _notebookEditor: INotebookTextDiffEditor,
		private _notebookTextModel: NotebookTextModel,
		private _notebookService: INotebookService,
		private _quickInputService: IQuickInputService,
		private _diffElementViewModel: DiffElementCellViewModelBase,
		private _diffSide: DiffSide,
		private _nestedCell: DiffNestedCellViewModel,
		private _outputContainer: HTMLElement,
		readonly output: ICellOutputViewModel
	) {
		super();
	}

	render(index: number, beforeElement?: HTMLElement) {
		const outputItemDiv = document.createElement('div');
		let result: IInsetRenderOutput | undefined = undefined;

		const [mimeTypes, pick] = this.output.resolveMimeTypes(this._notebookTextModel, undefined);
		const pickedMimeTypeRenderer = this.output.pickedMimeType || mimeTypes[pick];
		if (mimeTypes.length > 1) {
			outputItemDiv.style.position = 'relative';
			const mimeTypePicker = DOM.$('.multi-mimetype-output');
			mimeTypePicker.classList.add(...ThemeIcon.asClassNameArray(mimetypeIcon));
			mimeTypePicker.tabIndex = 0;
			mimeTypePicker.title = nls.localize('mimeTypePicker', "Choose a different output mimetype, available mimetypes: {0}", mimeTypes.map(mimeType => mimeType.mimeType).join(', '));
			outputItemDiv.appendChild(mimeTypePicker);
			this.resizeListener.add(DOM.addStandardDisposableListener(mimeTypePicker, 'mousedown', async e => {
				if (e.leftButton) {
					e.preventDefault();
					e.stopPropagation();
					await this.pickActiveMimeTypeRenderer(this._notebookTextModel, this.output);
				}
			}));

			this.resizeListener.add((DOM.addDisposableListener(mimeTypePicker, DOM.EventType.KEY_DOWN, async e => {
				const event = new StandardKeyboardEvent(e);
				if ((event.equals(KeyCode.Enter) || event.equals(KeyCode.Space))) {
					e.preventDefault();
					e.stopPropagation();
					await this.pickActiveMimeTypeRenderer(this._notebookTextModel, this.output);
				}
			})));
		}

		const innerContainer = DOM.$('.output-inner-container');
		DOM.append(outputItemDiv, innerContainer);


		if (mimeTypes.length !== 0) {
			const renderer = this._notebookService.getRendererInfo(pickedMimeTypeRenderer.rendererId);
			result = renderer
				? { type: RenderOutputType.Extension, renderer, source: this.output, mimeType: pickedMimeTypeRenderer.mimeType }
				: this._renderMissingRenderer(this.output, pickedMimeTypeRenderer.mimeType);

			this.output.pickedMimeType = pickedMimeTypeRenderer;
		}

		this.domNode = outputItemDiv;
		this.renderResult = result;

		if (!result) {
			// this.viewCell.updateOutputHeight(index, 0);
			return;
		}

		if (beforeElement) {
			this._outputContainer.insertBefore(outputItemDiv, beforeElement);
		} else {
			this._outputContainer.appendChild(outputItemDiv);
		}

		this._notebookEditor.createOutput(
			this._diffElementViewModel,
			this._nestedCell,
			result,
			() => this.getOutputOffsetInCell(index),
			this._diffElementViewModel instanceof SideBySideDiffElementViewModel
				? this._diffSide
				: this._diffElementViewModel.type === 'insert' ? DiffSide.Modified : DiffSide.Original
		);
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
			htmlContent: p.outerHTML + a.outerHTML,
		};
	}

	private _renderMessage(viewModel: ICellOutputViewModel, message: string): IInsetRenderOutput {
		const el = DOM.$('p', undefined, message);
		return { type: RenderOutputType.Html, source: viewModel, htmlContent: el.outerHTML };
	}

	private async pickActiveMimeTypeRenderer(notebookTextModel: NotebookTextModel, viewModel: ICellOutputViewModel) {
		const [mimeTypes, currIndex] = viewModel.resolveMimeTypes(notebookTextModel, undefined);

		const items = mimeTypes.filter(mimeType => mimeType.isTrusted).map((mimeType, index): IMimeTypeRenderer => ({
			label: mimeType.mimeType,
			id: mimeType.mimeType,
			index: index,
			picked: index === currIndex,
			detail: this.generateRendererInfo(mimeType.rendererId),
			description: index === currIndex ? nls.localize('curruentActiveMimeType', "Currently Active") : undefined
		}));

		const disposables = new DisposableStore();
		const picker = disposables.add(this._quickInputService.createQuickPick());
		picker.items = items;
		picker.activeItems = items.filter(item => !!item.picked);
		picker.placeholder = items.length !== mimeTypes.length
			? nls.localize('promptChooseMimeTypeInSecure.placeHolder', "Select mimetype to render for current output. Rich mimetypes are available only when the notebook is trusted")
			: nls.localize('promptChooseMimeType.placeHolder', "Select mimetype to render for current output");

		const pick = await new Promise<number | undefined>(resolve => {
			disposables.add(picker.onDidAccept(() => {
				resolve(picker.selectedItems.length === 1 ? (picker.selectedItems[0] as IMimeTypeRenderer).index : undefined);
				disposables.dispose();
			}));
			picker.show();
		});

		if (pick === undefined) {
			return;
		}

		if (pick !== currIndex) {
			// user chooses another mimetype
			const index = this._nestedCell.outputsViewModels.indexOf(viewModel);
			const nextElement = this.domNode.nextElementSibling;
			this.resizeListener.clear();
			const element = this.domNode;
			if (element) {
				element.remove();
				this._notebookEditor.removeInset(
					this._diffElementViewModel,
					this._nestedCell,
					viewModel,
					this._diffSide
				);
			}

			viewModel.pickedMimeType = mimeTypes[pick];
			this.render(index, nextElement as HTMLElement);
		}
	}

	private generateRendererInfo(renderId: string): string {
		const renderInfo = this._notebookService.getRendererInfo(renderId);

		if (renderInfo) {
			const displayName = renderInfo.displayName !== '' ? renderInfo.displayName : renderInfo.id;
			return `${displayName} (${renderInfo.extensionId.value})`;
		}

		return nls.localize('builtinRenderInfo', "built-in");
	}

	getCellOutputCurrentIndex() {
		return this._diffElementViewModel.getNestedCellViewModel(this._diffSide).outputs.indexOf(this.output.model);
	}

	updateHeight(index: number, height: number) {
		this._diffElementViewModel.updateOutputHeight(this._diffSide, index, height);
	}

	getOutputOffsetInContainer(index: number) {
		return this._diffElementViewModel.getOutputOffsetInContainer(this._diffSide, index);
	}

	getOutputOffsetInCell(index: number) {
		return this._diffElementViewModel.getOutputOffsetInCell(this._diffSide, index);
	}
}

export class OutputContainer extends Disposable {
	private _outputEntries = new Map<ICellOutputViewModel, OutputElement>();
	constructor(
		private _editor: INotebookTextDiffEditor,
		private _notebookTextModel: NotebookTextModel,
		private _diffElementViewModel: DiffElementCellViewModelBase,
		private _nestedCellViewModel: DiffNestedCellViewModel,
		private _diffSide: DiffSide,
		private _outputContainer: HTMLElement,
		@INotebookService private _notebookService: INotebookService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
	) {
		super();
		this._register(this._diffElementViewModel.onDidLayoutChange(() => {
			this._outputEntries.forEach((value, key) => {
				const index = _nestedCellViewModel.outputs.indexOf(key.model);
				if (index >= 0) {
					const top = this._diffElementViewModel.getOutputOffsetInContainer(this._diffSide, index);
					value.domNode.style.top = `${top}px`;
				}
			});
		}));

		this._register(this._nestedCellViewModel.textModel.onDidChangeOutputs(splice => {
			this._updateOutputs(splice);
		}));
	}

	private _updateOutputs(splice: NotebookCellOutputsSplice) {
		const removedKeys: ICellOutputViewModel[] = [];

		this._outputEntries.forEach((value, key) => {
			if (this._nestedCellViewModel.outputsViewModels.indexOf(key) < 0) {
				// already removed
				removedKeys.push(key);
				// remove element from DOM
				value.domNode.remove();
				this._editor.removeInset(this._diffElementViewModel, this._nestedCellViewModel, key, this._diffSide);
			}
		});

		removedKeys.forEach(key => {
			this._outputEntries.get(key)?.dispose();
			this._outputEntries.delete(key);
		});

		let prevElement: HTMLElement | undefined = undefined;
		const outputsToRender = this._nestedCellViewModel.outputsViewModels;

		outputsToRender.reverse().forEach(output => {
			if (this._outputEntries.has(output)) {
				// already exist
				prevElement = this._outputEntries.get(output)!.domNode;
				return;
			}

			// newly added element
			const currIndex = this._nestedCellViewModel.outputsViewModels.indexOf(output);
			this._renderOutput(output, currIndex, prevElement);
			prevElement = this._outputEntries.get(output)?.domNode;
		});
	}
	render() {
		// TODO, outputs to render (should have a limit)
		for (let index = 0; index < this._nestedCellViewModel.outputsViewModels.length; index++) {
			const currOutput = this._nestedCellViewModel.outputsViewModels[index];

			// always add to the end
			this._renderOutput(currOutput, index, undefined);
		}
	}

	showOutputs() {
		for (let index = 0; index < this._nestedCellViewModel.outputsViewModels.length; index++) {
			const currOutput = this._nestedCellViewModel.outputsViewModels[index];
			// always add to the end
			this._editor.showInset(this._diffElementViewModel, currOutput.cellViewModel, currOutput, this._diffSide);
		}
	}

	hideOutputs() {
		this._outputEntries.forEach((outputElement, cellOutputViewModel) => {
			this._editor.hideInset(this._diffElementViewModel, this._nestedCellViewModel, cellOutputViewModel);
		});
	}

	private _renderOutput(currOutput: ICellOutputViewModel, index: number, beforeElement?: HTMLElement) {
		if (!this._outputEntries.has(currOutput)) {
			this._outputEntries.set(currOutput, new OutputElement(this._editor, this._notebookTextModel, this._notebookService, this._quickInputService, this._diffElementViewModel, this._diffSide, this._nestedCellViewModel, this._outputContainer, currOutput));
		}

		const renderElement = this._outputEntries.get(currOutput)!;
		renderElement.render(index, beforeElement);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/diffElementViewModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/diffElementViewModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { hash } from '../../../../../base/common/hash.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { DiffEditorWidget } from '../../../../../editor/browser/widget/diffEditor/diffEditorWidget.js';
import { FontInfo } from '../../../../../editor/common/config/fontInfo.js';
import * as editorCommon from '../../../../../editor/common/editorCommon.js';
import { getEditorPadding } from './diffCellEditorOptions.js';
import { DiffNestedCellViewModel } from './diffNestedCellViewModel.js';
import { NotebookDiffEditorEventDispatcher, NotebookDiffViewEventType } from './eventDispatcher.js';
import { CellDiffViewModelLayoutChangeEvent, DIFF_CELL_MARGIN, DiffSide, IDiffElementLayoutInfo } from './notebookDiffEditorBrowser.js';
import { CellLayoutState, IGenericCellViewModel } from '../notebookBrowser.js';
import { NotebookLayoutInfo } from '../notebookViewEvents.js';
import { getFormattedMetadataJSON, NotebookCellTextModel } from '../../common/model/notebookCellTextModel.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { CellUri, ICellOutput, INotebookTextModel, IOutputDto, IOutputItemDto } from '../../common/notebookCommon.js';
import { INotebookService } from '../../common/notebookService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { Schemas } from '../../../../../base/common/network.js';
import { IDiffEditorHeightCalculatorService } from './editorHeightCalculator.js';
import { NotebookDocumentMetadataTextModel } from '../../common/model/notebookMetadataTextModel.js';

const PropertyHeaderHeight = 25;

// From `.monaco-editor .diff-hidden-lines .center` in src/vs/editor/browser/widget/diffEditor/style.css
export const HeightOfHiddenLinesRegionInDiffEditor = 24;

export const DefaultLineHeight = 17;

export enum PropertyFoldingState {
	Expanded,
	Collapsed
}

export const OUTPUT_EDITOR_HEIGHT_MAGIC = 1440;

type ILayoutInfoDelta0 = { [K in keyof IDiffElementLayoutInfo]?: number; };
interface ILayoutInfoDelta extends ILayoutInfoDelta0 {
	rawOutputHeight?: number;
	recomputeOutput?: boolean;
}

export type IDiffElementViewModelBase = DiffElementCellViewModelBase | DiffElementPlaceholderViewModel | NotebookDocumentMetadataViewModel;

export abstract class DiffElementViewModelBase extends Disposable {
	protected _layoutInfoEmitter = this._register(new Emitter<CellDiffViewModelLayoutChangeEvent>());
	onDidLayoutChange = this._layoutInfoEmitter.event;
	abstract renderOutput: boolean;
	constructor(
		public readonly mainDocumentTextModel: INotebookTextModel,
		public readonly editorEventDispatcher: NotebookDiffEditorEventDispatcher,
		public readonly initData: {
			metadataStatusHeight: number;
			outputStatusHeight: number;
			fontInfo: FontInfo | undefined;
		}
	) {
		super();

		this._register(this.editorEventDispatcher.onDidChangeLayout(e => this._layoutInfoEmitter.fire({ outerWidth: true })));
	}

	abstract layoutChange(): void;
	abstract getHeight(lineHeight: number): number;
	abstract get totalHeight(): number;
}

export class DiffElementPlaceholderViewModel extends DiffElementViewModelBase {
	readonly type: 'placeholder' = 'placeholder';
	public hiddenCells: DiffElementCellViewModelBase[] = [];
	protected _unfoldHiddenCells = this._register(new Emitter<void>());
	onUnfoldHiddenCells = this._unfoldHiddenCells.event;

	public renderOutput: boolean = false;
	constructor(
		mainDocumentTextModel: INotebookTextModel,
		editorEventDispatcher: NotebookDiffEditorEventDispatcher,
		initData: {
			metadataStatusHeight: number;
			outputStatusHeight: number;
			fontInfo: FontInfo | undefined;
		}
	) {
		super(mainDocumentTextModel, editorEventDispatcher, initData);

	}
	get totalHeight() {
		return 24 + (2 * DIFF_CELL_MARGIN);
	}
	getHeight(_: number): number {
		return this.totalHeight;
	}
	override layoutChange(): void {
		//
	}
	showHiddenCells() {
		this._unfoldHiddenCells.fire();
	}
}


export class NotebookDocumentMetadataViewModel extends DiffElementViewModelBase {
	public readonly originalMetadata: NotebookDocumentMetadataTextModel;
	public readonly modifiedMetadata: NotebookDocumentMetadataTextModel;
	public cellFoldingState: PropertyFoldingState;
	protected _layoutInfo!: IDiffElementLayoutInfo;
	public renderOutput: boolean = false;
	set editorHeight(height: number) {
		this._layout({ editorHeight: height });
	}

	get editorHeight() {
		throw new Error('Use Cell.layoutInfo.editorHeight');
	}

	set editorMargin(margin: number) {
		this._layout({ editorMargin: margin });
	}

	get editorMargin() {
		throw new Error('Use Cell.layoutInfo.editorMargin');
	}
	get layoutInfo(): IDiffElementLayoutInfo {
		return this._layoutInfo;
	}

	get totalHeight() {
		return this.layoutInfo.totalHeight;
	}

	private _sourceEditorViewState: editorCommon.ICodeEditorViewState | editorCommon.IDiffEditorViewState | null = null;
	constructor(
		public readonly originalDocumentTextModel: INotebookTextModel,
		public readonly modifiedDocumentTextModel: INotebookTextModel,
		public readonly type: 'unchangedMetadata' | 'modifiedMetadata',
		editorEventDispatcher: NotebookDiffEditorEventDispatcher,
		initData: {
			metadataStatusHeight: number;
			outputStatusHeight: number;
			fontInfo: FontInfo | undefined;
		},
		notebookService: INotebookService,
		private readonly editorHeightCalculator: IDiffEditorHeightCalculatorService
	) {
		super(originalDocumentTextModel, editorEventDispatcher, initData);

		const cellStatusHeight = PropertyHeaderHeight;
		this._layoutInfo = {
			width: 0,
			editorHeight: 0,
			editorMargin: 0,
			metadataHeight: 0,
			cellStatusHeight,
			metadataStatusHeight: 0,
			rawOutputHeight: 0,
			outputTotalHeight: 0,
			outputStatusHeight: 0,
			outputMetadataHeight: 0,
			bodyMargin: 32,
			totalHeight: 82 + cellStatusHeight + 0,
			layoutState: CellLayoutState.Uninitialized
		};

		this.cellFoldingState = type === 'modifiedMetadata' ? PropertyFoldingState.Expanded : PropertyFoldingState.Collapsed;
		this.originalMetadata = this._register(new NotebookDocumentMetadataTextModel(originalDocumentTextModel));
		this.modifiedMetadata = this._register(new NotebookDocumentMetadataTextModel(modifiedDocumentTextModel));
	}

	public async computeHeights() {
		if (this.type === 'unchangedMetadata') {
			this.editorHeight = this.editorHeightCalculator.computeHeightFromLines(this.originalMetadata.textBuffer.getLineCount());
		} else {
			const original = this.originalMetadata.uri;
			const modified = this.modifiedMetadata.uri;
			this.editorHeight = await this.editorHeightCalculator.diffAndComputeHeight(original, modified);
		}
	}

	layoutChange() {
		this._layout({ recomputeOutput: true });
	}

	protected _layout(delta: ILayoutInfoDelta) {
		const width = delta.width !== undefined ? delta.width : this._layoutInfo.width;
		const editorHeight = delta.editorHeight !== undefined ? delta.editorHeight : this._layoutInfo.editorHeight;
		const editorMargin = delta.editorMargin !== undefined ? delta.editorMargin : this._layoutInfo.editorMargin;
		const cellStatusHeight = delta.cellStatusHeight !== undefined ? delta.cellStatusHeight : this._layoutInfo.cellStatusHeight;
		const bodyMargin = delta.bodyMargin !== undefined ? delta.bodyMargin : this._layoutInfo.bodyMargin;

		const totalHeight = editorHeight
			+ editorMargin
			+ cellStatusHeight
			+ bodyMargin;

		const newLayout: IDiffElementLayoutInfo = {
			width: width,
			editorHeight: editorHeight,
			editorMargin: editorMargin,
			metadataHeight: 0,
			cellStatusHeight,
			metadataStatusHeight: 0,
			outputTotalHeight: 0,
			outputStatusHeight: 0,
			bodyMargin: bodyMargin,
			rawOutputHeight: 0,
			outputMetadataHeight: 0,
			totalHeight: totalHeight,
			layoutState: CellLayoutState.Measured
		};

		let somethingChanged = false;

		const changeEvent: CellDiffViewModelLayoutChangeEvent = {};

		if (newLayout.width !== this._layoutInfo.width) {
			changeEvent.width = true;
			somethingChanged = true;
		}

		if (newLayout.editorHeight !== this._layoutInfo.editorHeight) {
			changeEvent.editorHeight = true;
			somethingChanged = true;
		}

		if (newLayout.editorMargin !== this._layoutInfo.editorMargin) {
			changeEvent.editorMargin = true;
			somethingChanged = true;
		}

		if (newLayout.cellStatusHeight !== this._layoutInfo.cellStatusHeight) {
			changeEvent.cellStatusHeight = true;
			somethingChanged = true;
		}

		if (newLayout.bodyMargin !== this._layoutInfo.bodyMargin) {
			changeEvent.bodyMargin = true;
			somethingChanged = true;
		}

		if (newLayout.totalHeight !== this._layoutInfo.totalHeight) {
			changeEvent.totalHeight = true;
			somethingChanged = true;
		}

		if (somethingChanged) {
			this._layoutInfo = newLayout;
			this._fireLayoutChangeEvent(changeEvent);
		}
	}

	getHeight(lineHeight: number) {
		if (this._layoutInfo.layoutState === CellLayoutState.Uninitialized) {
			const editorHeight = this.cellFoldingState === PropertyFoldingState.Collapsed ? 0 : this.computeInputEditorHeight(lineHeight);
			return this._computeTotalHeight(editorHeight);
		} else {
			return this._layoutInfo.totalHeight;
		}
	}

	private _computeTotalHeight(editorHeight: number) {
		const totalHeight = editorHeight
			+ this._layoutInfo.editorMargin
			+ this._layoutInfo.metadataHeight
			+ this._layoutInfo.cellStatusHeight
			+ this._layoutInfo.metadataStatusHeight
			+ this._layoutInfo.outputTotalHeight
			+ this._layoutInfo.outputStatusHeight
			+ this._layoutInfo.outputMetadataHeight
			+ this._layoutInfo.bodyMargin;

		return totalHeight;
	}

	public computeInputEditorHeight(_lineHeight: number): number {
		return this.editorHeightCalculator.computeHeightFromLines(Math.max(this.originalMetadata.textBuffer.getLineCount(), this.modifiedMetadata.textBuffer.getLineCount()));
	}

	private _fireLayoutChangeEvent(state: CellDiffViewModelLayoutChangeEvent) {
		this._layoutInfoEmitter.fire(state);
		this.editorEventDispatcher.emit([{ type: NotebookDiffViewEventType.CellLayoutChanged, source: this._layoutInfo }]);
	}

	getComputedCellContainerWidth(layoutInfo: NotebookLayoutInfo, diffEditor: boolean, fullWidth: boolean) {
		if (fullWidth) {
			return layoutInfo.width - 2 * DIFF_CELL_MARGIN + (diffEditor ? DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH : 0) - 2;
		}

		return (layoutInfo.width - 2 * DIFF_CELL_MARGIN + (diffEditor ? DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH : 0)) / 2 - 18 - 2;
	}

	getSourceEditorViewState(): editorCommon.ICodeEditorViewState | editorCommon.IDiffEditorViewState | null {
		return this._sourceEditorViewState;
	}

	saveSpirceEditorViewState(viewState: editorCommon.ICodeEditorViewState | editorCommon.IDiffEditorViewState | null) {
		this._sourceEditorViewState = viewState;
	}
}


export abstract class DiffElementCellViewModelBase extends DiffElementViewModelBase {
	public cellFoldingState: PropertyFoldingState;
	public metadataFoldingState: PropertyFoldingState;
	public outputFoldingState: PropertyFoldingState;
	protected _stateChangeEmitter = this._register(new Emitter<{ renderOutput: boolean }>());
	onDidStateChange = this._stateChangeEmitter.event;
	protected _layoutInfo!: IDiffElementLayoutInfo;

	public displayIconToHideUnmodifiedCells?: boolean;
	private _hideUnchangedCells = this._register(new Emitter<void>());
	public onHideUnchangedCells = this._hideUnchangedCells.event;

	hideUnchangedCells() {
		this._hideUnchangedCells.fire();
	}
	set rawOutputHeight(height: number) {
		this._layout({ rawOutputHeight: Math.min(OUTPUT_EDITOR_HEIGHT_MAGIC, height) });
	}

	get rawOutputHeight() {
		throw new Error('Use Cell.layoutInfo.rawOutputHeight');
	}

	set outputStatusHeight(height: number) {
		this._layout({ outputStatusHeight: height });
	}

	get outputStatusHeight() {
		throw new Error('Use Cell.layoutInfo.outputStatusHeight');
	}

	set outputMetadataHeight(height: number) {
		this._layout({ outputMetadataHeight: height });
	}

	get outputMetadataHeight() {
		throw new Error('Use Cell.layoutInfo.outputStatusHeight');
	}

	set editorHeight(height: number) {
		this._layout({ editorHeight: height });
	}

	get editorHeight() {
		throw new Error('Use Cell.layoutInfo.editorHeight');
	}

	set editorMargin(margin: number) {
		this._layout({ editorMargin: margin });
	}

	get editorMargin() {
		throw new Error('Use Cell.layoutInfo.editorMargin');
	}

	set metadataStatusHeight(height: number) {
		this._layout({ metadataStatusHeight: height });
	}

	get metadataStatusHeight() {
		throw new Error('Use Cell.layoutInfo.outputStatusHeight');
	}

	set metadataHeight(height: number) {
		this._layout({ metadataHeight: height });
	}

	get metadataHeight() {
		throw new Error('Use Cell.layoutInfo.metadataHeight');
	}

	private _renderOutput = true;

	set renderOutput(value: boolean) {
		this._renderOutput = value;
		this._layout({ recomputeOutput: true });
		this._stateChangeEmitter.fire({ renderOutput: this._renderOutput });
	}

	get renderOutput() {
		return this._renderOutput;
	}

	get layoutInfo(): IDiffElementLayoutInfo {
		return this._layoutInfo;
	}

	get totalHeight() {
		return this.layoutInfo.totalHeight;
	}

	protected get ignoreOutputs() {
		return this.configurationService.getValue<boolean>('notebook.diff.ignoreOutputs') || !!(this.mainDocumentTextModel?.transientOptions.transientOutputs);
	}

	protected get ignoreMetadata() {
		return this.configurationService.getValue<boolean>('notebook.diff.ignoreMetadata');
	}

	private _sourceEditorViewState: editorCommon.ICodeEditorViewState | editorCommon.IDiffEditorViewState | null = null;
	private _outputEditorViewState: editorCommon.ICodeEditorViewState | editorCommon.IDiffEditorViewState | null = null;
	private _metadataEditorViewState: editorCommon.ICodeEditorViewState | editorCommon.IDiffEditorViewState | null = null;
	public readonly original: DiffNestedCellViewModel | undefined;

	public readonly modified: DiffNestedCellViewModel | undefined;
	constructor(
		mainDocumentTextModel: INotebookTextModel,
		original: NotebookCellTextModel | undefined,
		modified: NotebookCellTextModel | undefined,
		readonly type: 'unchanged' | 'insert' | 'delete' | 'modified',
		editorEventDispatcher: NotebookDiffEditorEventDispatcher,
		initData: {
			metadataStatusHeight: number;
			outputStatusHeight: number;
			fontInfo: FontInfo | undefined;
		},
		notebookService: INotebookService,
		public readonly index: number,
		private readonly configurationService: IConfigurationService,
		public readonly diffEditorHeightCalculator: IDiffEditorHeightCalculatorService
	) {
		super(mainDocumentTextModel, editorEventDispatcher, initData);
		this.original = original ? this._register(new DiffNestedCellViewModel(original, notebookService)) : undefined;
		this.modified = modified ? this._register(new DiffNestedCellViewModel(modified, notebookService)) : undefined;
		const editorHeight = this._estimateEditorHeight(initData.fontInfo);
		const cellStatusHeight = PropertyHeaderHeight;
		this._layoutInfo = {
			width: 0,
			editorHeight: editorHeight,
			editorMargin: 0,
			metadataHeight: 0,
			cellStatusHeight,
			metadataStatusHeight: this.ignoreMetadata ? 0 : PropertyHeaderHeight,
			rawOutputHeight: 0,
			outputTotalHeight: 0,
			outputStatusHeight: this.ignoreOutputs ? 0 : PropertyHeaderHeight,
			outputMetadataHeight: 0,
			bodyMargin: 32,
			totalHeight: 82 + cellStatusHeight + editorHeight,
			layoutState: CellLayoutState.Uninitialized
		};

		this.cellFoldingState = modified?.getTextBufferHash() !== original?.getTextBufferHash() ? PropertyFoldingState.Expanded : PropertyFoldingState.Collapsed;
		this.metadataFoldingState = PropertyFoldingState.Collapsed;
		this.outputFoldingState = PropertyFoldingState.Collapsed;
	}

	layoutChange() {
		this._layout({ recomputeOutput: true });
	}

	private _estimateEditorHeight(fontInfo: FontInfo | undefined) {
		const lineHeight = fontInfo?.lineHeight ?? 17;

		switch (this.type) {
			case 'unchanged':
			case 'insert':
				{
					const lineCount = this.modified!.textModel.textBuffer.getLineCount();
					const editorHeight = lineCount * lineHeight + getEditorPadding(lineCount).top + getEditorPadding(lineCount).bottom;
					return editorHeight;
				}
			case 'delete':
			case 'modified':
				{
					const lineCount = this.original!.textModel.textBuffer.getLineCount();
					const editorHeight = lineCount * lineHeight + getEditorPadding(lineCount).top + getEditorPadding(lineCount).bottom;
					return editorHeight;
				}
		}
	}

	protected _layout(delta: ILayoutInfoDelta) {
		const width = delta.width !== undefined ? delta.width : this._layoutInfo.width;
		const editorHeight = delta.editorHeight !== undefined ? delta.editorHeight : this._layoutInfo.editorHeight;
		const editorMargin = delta.editorMargin !== undefined ? delta.editorMargin : this._layoutInfo.editorMargin;
		const metadataHeight = delta.metadataHeight !== undefined ? delta.metadataHeight : this._layoutInfo.metadataHeight;
		const cellStatusHeight = delta.cellStatusHeight !== undefined ? delta.cellStatusHeight : this._layoutInfo.cellStatusHeight;
		const metadataStatusHeight = delta.metadataStatusHeight !== undefined ? delta.metadataStatusHeight : this._layoutInfo.metadataStatusHeight;
		const rawOutputHeight = delta.rawOutputHeight !== undefined ? delta.rawOutputHeight : this._layoutInfo.rawOutputHeight;
		const outputStatusHeight = delta.outputStatusHeight !== undefined ? delta.outputStatusHeight : this._layoutInfo.outputStatusHeight;
		const bodyMargin = delta.bodyMargin !== undefined ? delta.bodyMargin : this._layoutInfo.bodyMargin;
		const outputMetadataHeight = delta.outputMetadataHeight !== undefined ? delta.outputMetadataHeight : this._layoutInfo.outputMetadataHeight;
		const outputHeight = this.ignoreOutputs ? 0 : (delta.recomputeOutput || delta.rawOutputHeight !== undefined || delta.outputMetadataHeight !== undefined) ? this._getOutputTotalHeight(rawOutputHeight, outputMetadataHeight) : this._layoutInfo.outputTotalHeight;

		const totalHeight = editorHeight
			+ editorMargin
			+ cellStatusHeight
			+ metadataHeight
			+ metadataStatusHeight
			+ outputHeight
			+ outputStatusHeight
			+ bodyMargin;

		const newLayout: IDiffElementLayoutInfo = {
			width: width,
			editorHeight: editorHeight,
			editorMargin: editorMargin,
			metadataHeight: metadataHeight,
			cellStatusHeight,
			metadataStatusHeight: metadataStatusHeight,
			outputTotalHeight: outputHeight,
			outputStatusHeight: outputStatusHeight,
			bodyMargin: bodyMargin,
			rawOutputHeight: rawOutputHeight,
			outputMetadataHeight: outputMetadataHeight,
			totalHeight: totalHeight,
			layoutState: CellLayoutState.Measured
		};

		let somethingChanged = false;

		const changeEvent: CellDiffViewModelLayoutChangeEvent = {};

		if (newLayout.width !== this._layoutInfo.width) {
			changeEvent.width = true;
			somethingChanged = true;
		}

		if (newLayout.editorHeight !== this._layoutInfo.editorHeight) {
			changeEvent.editorHeight = true;
			somethingChanged = true;
		}

		if (newLayout.editorMargin !== this._layoutInfo.editorMargin) {
			changeEvent.editorMargin = true;
			somethingChanged = true;
		}

		if (newLayout.metadataHeight !== this._layoutInfo.metadataHeight) {
			changeEvent.metadataHeight = true;
			somethingChanged = true;
		}

		if (newLayout.cellStatusHeight !== this._layoutInfo.cellStatusHeight) {
			changeEvent.cellStatusHeight = true;
			somethingChanged = true;
		}

		if (newLayout.metadataStatusHeight !== this._layoutInfo.metadataStatusHeight) {
			changeEvent.metadataStatusHeight = true;
			somethingChanged = true;
		}

		if (newLayout.outputTotalHeight !== this._layoutInfo.outputTotalHeight) {
			changeEvent.outputTotalHeight = true;
			somethingChanged = true;
		}

		if (newLayout.outputStatusHeight !== this._layoutInfo.outputStatusHeight) {
			changeEvent.outputStatusHeight = true;
			somethingChanged = true;
		}

		if (newLayout.bodyMargin !== this._layoutInfo.bodyMargin) {
			changeEvent.bodyMargin = true;
			somethingChanged = true;
		}

		if (newLayout.outputMetadataHeight !== this._layoutInfo.outputMetadataHeight) {
			changeEvent.outputMetadataHeight = true;
			somethingChanged = true;
		}

		if (newLayout.totalHeight !== this._layoutInfo.totalHeight) {
			changeEvent.totalHeight = true;
			somethingChanged = true;
		}

		if (somethingChanged) {
			this._layoutInfo = newLayout;
			this._fireLayoutChangeEvent(changeEvent);
		}
	}

	getHeight(lineHeight: number) {
		if (this._layoutInfo.layoutState === CellLayoutState.Uninitialized) {
			const editorHeight = this.cellFoldingState === PropertyFoldingState.Collapsed ? 0 : this.computeInputEditorHeight(lineHeight);
			return this._computeTotalHeight(editorHeight);
		} else {
			return this._layoutInfo.totalHeight;
		}
	}

	private _computeTotalHeight(editorHeight: number) {
		const totalHeight = editorHeight
			+ this._layoutInfo.editorMargin
			+ this._layoutInfo.metadataHeight
			+ this._layoutInfo.cellStatusHeight
			+ this._layoutInfo.metadataStatusHeight
			+ this._layoutInfo.outputTotalHeight
			+ this._layoutInfo.outputStatusHeight
			+ this._layoutInfo.outputMetadataHeight
			+ this._layoutInfo.bodyMargin;

		return totalHeight;
	}

	public computeInputEditorHeight(lineHeight: number): number {
		const lineCount = Math.max(this.original?.textModel.textBuffer.getLineCount() ?? 1, this.modified?.textModel.textBuffer.getLineCount() ?? 1);
		return this.diffEditorHeightCalculator.computeHeightFromLines(lineCount);
	}

	private _getOutputTotalHeight(rawOutputHeight: number, metadataHeight: number) {
		if (this.outputFoldingState === PropertyFoldingState.Collapsed) {
			return 0;
		}

		if (this.renderOutput) {
			if (this.isOutputEmpty()) {
				// single line;
				return 24;
			}
			return this.getRichOutputTotalHeight() + metadataHeight;
		} else {
			return rawOutputHeight;
		}
	}

	private _fireLayoutChangeEvent(state: CellDiffViewModelLayoutChangeEvent) {
		this._layoutInfoEmitter.fire(state);
		this.editorEventDispatcher.emit([{ type: NotebookDiffViewEventType.CellLayoutChanged, source: this._layoutInfo }]);
	}

	abstract checkIfInputModified(): false | { reason: string | undefined };
	abstract checkIfOutputsModified(): false | { reason: string | undefined };
	abstract checkMetadataIfModified(): false | { reason: string | undefined };
	abstract isOutputEmpty(): boolean;
	abstract getRichOutputTotalHeight(): number;
	abstract getCellByUri(cellUri: URI): IGenericCellViewModel;
	abstract getOutputOffsetInCell(diffSide: DiffSide, index: number): number;
	abstract getOutputOffsetInContainer(diffSide: DiffSide, index: number): number;
	abstract updateOutputHeight(diffSide: DiffSide, index: number, height: number): void;
	abstract getNestedCellViewModel(diffSide: DiffSide): DiffNestedCellViewModel;

	getComputedCellContainerWidth(layoutInfo: NotebookLayoutInfo, diffEditor: boolean, fullWidth: boolean) {
		if (fullWidth) {
			return layoutInfo.width - 2 * DIFF_CELL_MARGIN + (diffEditor ? DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH : 0) - 2;
		}

		return (layoutInfo.width - 2 * DIFF_CELL_MARGIN + (diffEditor ? DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH : 0)) / 2 - 18 - 2;
	}

	getOutputEditorViewState(): editorCommon.ICodeEditorViewState | editorCommon.IDiffEditorViewState | null {
		return this._outputEditorViewState;
	}

	saveOutputEditorViewState(viewState: editorCommon.ICodeEditorViewState | editorCommon.IDiffEditorViewState | null) {
		this._outputEditorViewState = viewState;
	}

	getMetadataEditorViewState(): editorCommon.ICodeEditorViewState | editorCommon.IDiffEditorViewState | null {
		return this._metadataEditorViewState;
	}

	saveMetadataEditorViewState(viewState: editorCommon.ICodeEditorViewState | editorCommon.IDiffEditorViewState | null) {
		this._metadataEditorViewState = viewState;
	}

	getSourceEditorViewState(): editorCommon.ICodeEditorViewState | editorCommon.IDiffEditorViewState | null {
		return this._sourceEditorViewState;
	}

	saveSpirceEditorViewState(viewState: editorCommon.ICodeEditorViewState | editorCommon.IDiffEditorViewState | null) {
		this._sourceEditorViewState = viewState;
	}
}

export class SideBySideDiffElementViewModel extends DiffElementCellViewModelBase {
	get originalDocument() {
		return this.otherDocumentTextModel;
	}

	get modifiedDocument() {
		return this.mainDocumentTextModel;
	}

	declare readonly original: DiffNestedCellViewModel;
	declare readonly modified: DiffNestedCellViewModel;
	override readonly type: 'unchanged' | 'modified';

	/**
	 * The height of the editor when the unchanged lines are collapsed.
	 */
	private editorHeightWithUnchangedLinesCollapsed?: number;
	constructor(
		mainDocumentTextModel: NotebookTextModel,
		readonly otherDocumentTextModel: NotebookTextModel,
		original: NotebookCellTextModel,
		modified: NotebookCellTextModel,
		type: 'unchanged' | 'modified',
		editorEventDispatcher: NotebookDiffEditorEventDispatcher,
		initData: {
			metadataStatusHeight: number;
			outputStatusHeight: number;
			fontInfo: FontInfo | undefined;
		},
		notebookService: INotebookService,
		configurationService: IConfigurationService,
		index: number,
		diffEditorHeightCalculator: IDiffEditorHeightCalculatorService
	) {
		super(
			mainDocumentTextModel,
			original,
			modified,
			type,
			editorEventDispatcher,
			initData,
			notebookService,
			index,
			configurationService,
			diffEditorHeightCalculator);

		this.type = type;

		this.cellFoldingState = this.modified.textModel.getValue() !== this.original.textModel.getValue() ? PropertyFoldingState.Expanded : PropertyFoldingState.Collapsed;
		this.metadataFoldingState = PropertyFoldingState.Collapsed;
		this.outputFoldingState = PropertyFoldingState.Collapsed;

		if (this.checkMetadataIfModified()) {
			this.metadataFoldingState = PropertyFoldingState.Expanded;
		}

		if (this.checkIfOutputsModified()) {
			this.outputFoldingState = PropertyFoldingState.Expanded;
		}

		this._register(this.original.onDidChangeOutputLayout(() => {
			this._layout({ recomputeOutput: true });
		}));

		this._register(this.modified.onDidChangeOutputLayout(() => {
			this._layout({ recomputeOutput: true });
		}));

		this._register(this.modified.textModel.onDidChangeContent(() => {
			if (mainDocumentTextModel.transientOptions.cellContentMetadata) {
				const cellMetadataKeys = [...Object.keys(mainDocumentTextModel.transientOptions.cellContentMetadata)];
				const modifiedMedataRaw = Object.assign({}, this.modified.metadata);
				const originalCellMetadata = this.original.metadata;
				for (const key of cellMetadataKeys) {
					if (Object.hasOwn(originalCellMetadata, key)) {
						modifiedMedataRaw[key] = originalCellMetadata[key];
					}
				}

				this.modified.textModel.metadata = modifiedMedataRaw;
			}
		}));
	}

	override checkIfInputModified(): false | { reason: string | undefined } {
		if (this.original.textModel.getTextBufferHash() === this.modified.textModel.getTextBufferHash()) {
			return false;
		}
		return {
			reason: 'Cell content has changed',
		};
	}
	checkIfOutputsModified() {
		if (this.mainDocumentTextModel.transientOptions.transientOutputs || this.ignoreOutputs) {
			return false;
		}

		const ret = outputsEqual(this.original?.outputs ?? [], this.modified?.outputs ?? []);

		if (ret === OutputComparison.Unchanged) {
			return false;
		}

		return {
			reason: ret === OutputComparison.Metadata ? 'Output metadata has changed' : undefined,
			kind: ret
		};
	}

	checkMetadataIfModified() {
		if (this.ignoreMetadata) {
			return false;
		}
		const modified = hash(getFormattedMetadataJSON(this.mainDocumentTextModel.transientOptions.transientCellMetadata, this.original?.metadata || {}, this.original?.language)) !== hash(getFormattedMetadataJSON(this.mainDocumentTextModel.transientOptions.transientCellMetadata, this.modified?.metadata ?? {}, this.modified?.language));
		if (modified) {
			return { reason: undefined };
		} else {
			return false;
		}
	}

	updateOutputHeight(diffSide: DiffSide, index: number, height: number) {
		if (diffSide === DiffSide.Original) {
			this.original.updateOutputHeight(index, height);
		} else {
			this.modified.updateOutputHeight(index, height);
		}
	}

	getOutputOffsetInContainer(diffSide: DiffSide, index: number) {
		if (diffSide === DiffSide.Original) {
			return this.original.getOutputOffset(index);
		} else {
			return this.modified.getOutputOffset(index);
		}
	}

	getOutputOffsetInCell(diffSide: DiffSide, index: number) {
		const offsetInOutputsContainer = this.getOutputOffsetInContainer(diffSide, index);

		return this._layoutInfo.editorHeight
			+ this._layoutInfo.editorMargin
			+ this._layoutInfo.metadataHeight
			+ this._layoutInfo.cellStatusHeight
			+ this._layoutInfo.metadataStatusHeight
			+ this._layoutInfo.outputStatusHeight
			+ this._layoutInfo.bodyMargin / 2
			+ offsetInOutputsContainer;
	}

	isOutputEmpty() {
		if (this.mainDocumentTextModel.transientOptions.transientOutputs) {
			return true;
		}

		if (this.checkIfOutputsModified()) {
			return false;
		}

		// outputs are not changed

		return (this.original?.outputs || []).length === 0;
	}

	getRichOutputTotalHeight() {
		return Math.max(this.original.getOutputTotalHeight(), this.modified.getOutputTotalHeight());
	}

	getNestedCellViewModel(diffSide: DiffSide): DiffNestedCellViewModel {
		return diffSide === DiffSide.Original ? this.original : this.modified;
	}

	getCellByUri(cellUri: URI): IGenericCellViewModel {
		if (cellUri.toString() === this.original.uri.toString()) {
			return this.original;
		} else {
			return this.modified;
		}
	}

	public override computeInputEditorHeight(lineHeight: number): number {
		if (this.type === 'modified' &&
			typeof this.editorHeightWithUnchangedLinesCollapsed === 'number' &&
			this.checkIfInputModified()) {
			return this.editorHeightWithUnchangedLinesCollapsed;
		}

		return super.computeInputEditorHeight(lineHeight);
	}

	private async computeModifiedInputEditorHeight() {
		if (this.checkIfInputModified()) {
			this.editorHeightWithUnchangedLinesCollapsed = this._layoutInfo.editorHeight = await this.diffEditorHeightCalculator.diffAndComputeHeight(this.original.uri, this.modified.uri);
		}
	}

	private async computeModifiedMetadataEditorHeight() {
		if (this.checkMetadataIfModified()) {
			const originalMetadataUri = CellUri.generateCellPropertyUri(this.originalDocument.uri, this.original.handle, Schemas.vscodeNotebookCellMetadata);
			const modifiedMetadataUri = CellUri.generateCellPropertyUri(this.modifiedDocument.uri, this.modified.handle, Schemas.vscodeNotebookCellMetadata);
			this._layoutInfo.metadataHeight = await this.diffEditorHeightCalculator.diffAndComputeHeight(originalMetadataUri, modifiedMetadataUri);
		}
	}

	public async computeEditorHeights() {
		if (this.type === 'unchanged') {
			return;
		}

		await Promise.all([this.computeModifiedInputEditorHeight(), this.computeModifiedMetadataEditorHeight()]);
	}

}

export class SingleSideDiffElementViewModel extends DiffElementCellViewModelBase {
	get cellViewModel() {
		return this.type === 'insert' ? this.modified! : this.original!;
	}

	get originalDocument() {
		if (this.type === 'insert') {
			return this.otherDocumentTextModel;
		} else {
			return this.mainDocumentTextModel;
		}
	}

	get modifiedDocument() {
		if (this.type === 'insert') {
			return this.mainDocumentTextModel;
		} else {
			return this.otherDocumentTextModel;
		}
	}

	override readonly type: 'insert' | 'delete';

	constructor(
		mainDocumentTextModel: NotebookTextModel,
		readonly otherDocumentTextModel: NotebookTextModel,
		original: NotebookCellTextModel | undefined,
		modified: NotebookCellTextModel | undefined,
		type: 'insert' | 'delete',
		editorEventDispatcher: NotebookDiffEditorEventDispatcher,
		initData: {
			metadataStatusHeight: number;
			outputStatusHeight: number;
			fontInfo: FontInfo | undefined;
		},
		notebookService: INotebookService,
		configurationService: IConfigurationService,
		diffEditorHeightCalculator: IDiffEditorHeightCalculatorService,
		index: number
	) {
		super(mainDocumentTextModel, original, modified, type, editorEventDispatcher, initData, notebookService, index, configurationService, diffEditorHeightCalculator);
		this.type = type;

		this._register(this.cellViewModel.onDidChangeOutputLayout(() => {
			this._layout({ recomputeOutput: true });
		}));
	}

	override checkIfInputModified(): false | { reason: string | undefined } {
		return {
			reason: 'Cell content has changed',
		};
	}

	getNestedCellViewModel(diffSide: DiffSide): DiffNestedCellViewModel {
		return this.type === 'insert' ? this.modified! : this.original!;
	}


	checkIfOutputsModified(): false | { reason: string | undefined } {
		return false;
	}

	checkMetadataIfModified(): false | { reason: string | undefined } {
		return false;
	}

	updateOutputHeight(diffSide: DiffSide, index: number, height: number) {
		this.cellViewModel?.updateOutputHeight(index, height);
	}

	getOutputOffsetInContainer(diffSide: DiffSide, index: number) {
		return this.cellViewModel.getOutputOffset(index);
	}

	getOutputOffsetInCell(diffSide: DiffSide, index: number) {
		const offsetInOutputsContainer = this.cellViewModel.getOutputOffset(index);

		return this._layoutInfo.editorHeight
			+ this._layoutInfo.editorMargin
			+ this._layoutInfo.metadataHeight
			+ this._layoutInfo.cellStatusHeight
			+ this._layoutInfo.metadataStatusHeight
			+ this._layoutInfo.outputStatusHeight
			+ this._layoutInfo.bodyMargin / 2
			+ offsetInOutputsContainer;
	}

	isOutputEmpty() {
		if (this.mainDocumentTextModel.transientOptions.transientOutputs) {
			return true;
		}

		// outputs are not changed

		return (this.original?.outputs || this.modified?.outputs || []).length === 0;
	}

	getRichOutputTotalHeight() {
		return this.cellViewModel?.getOutputTotalHeight() ?? 0;
	}

	getCellByUri(cellUri: URI): IGenericCellViewModel {
		return this.cellViewModel;
	}
}

export const enum OutputComparison {
	Unchanged = 0,
	Metadata = 1,
	Other = 2
}

export function outputEqual(a: ICellOutput, b: ICellOutput): OutputComparison {
	if (hash(a.metadata) === hash(b.metadata)) {
		return OutputComparison.Other;
	}

	// metadata not equal
	for (let j = 0; j < a.outputs.length; j++) {
		const aOutputItem = a.outputs[j];
		const bOutputItem = b.outputs[j];

		if (aOutputItem.mime !== bOutputItem.mime) {
			return OutputComparison.Other;
		}

		if (aOutputItem.data.buffer.length !== bOutputItem.data.buffer.length) {
			return OutputComparison.Other;
		}

		for (let k = 0; k < aOutputItem.data.buffer.length; k++) {
			if (aOutputItem.data.buffer[k] !== bOutputItem.data.buffer[k]) {
				return OutputComparison.Other;
			}
		}
	}

	return OutputComparison.Metadata;
}

function outputsEqual(original: ICellOutput[], modified: ICellOutput[]) {
	if (original.length !== modified.length) {
		return OutputComparison.Other;
	}

	const len = original.length;
	for (let i = 0; i < len; i++) {
		const a = original[i];
		const b = modified[i];

		if (hash(a.metadata) !== hash(b.metadata)) {
			return OutputComparison.Metadata;
		}

		if (a.outputs.length !== b.outputs.length) {
			return OutputComparison.Other;
		}

		for (let j = 0; j < a.outputs.length; j++) {
			const aOutputItem = a.outputs[j];
			const bOutputItem = b.outputs[j];

			if (aOutputItem.mime !== bOutputItem.mime) {
				return OutputComparison.Other;
			}

			if (aOutputItem.data.buffer.length !== bOutputItem.data.buffer.length) {
				return OutputComparison.Other;
			}

			for (let k = 0; k < aOutputItem.data.buffer.length; k++) {
				if (aOutputItem.data.buffer[k] !== bOutputItem.data.buffer[k]) {
					return OutputComparison.Other;
				}
			}
		}
	}

	return OutputComparison.Unchanged;
}

export function getStreamOutputData(outputs: IOutputItemDto[]) {
	if (!outputs.length) {
		return null;
	}

	const first = outputs[0];
	const mime = first.mime;
	const sameStream = !outputs.find(op => op.mime !== mime);

	if (sameStream) {
		return outputs.map(opit => opit.data.toString()).join('');
	} else {
		return null;
	}
}

export function getFormattedOutputJSON(outputs: IOutputDto[]) {
	if (outputs.length === 1) {
		const streamOutputData = getStreamOutputData(outputs[0].outputs);
		if (streamOutputData) {
			return streamOutputData;
		}
	}

	return JSON.stringify(outputs.map(output => {
		return ({
			metadata: output.metadata,
			outputItems: output.outputs.map(opit => ({
				mimeType: opit.mime,
				data: opit.data.toString()
			}))
		});
	}), undefined, '\t');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/diffNestedCellViewModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/diffNestedCellViewModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { PrefixSumComputer } from '../../../../../editor/common/model/prefixSumComputer.js';
import { IDiffNestedCellViewModel } from './notebookDiffEditorBrowser.js';
import { ICellOutputViewModel, IGenericCellViewModel } from '../notebookBrowser.js';
import { CellViewModelStateChangeEvent } from '../notebookViewEvents.js';
import { CellOutputViewModel } from '../viewModel/cellOutputViewModel.js';
import { NotebookCellTextModel } from '../../common/model/notebookCellTextModel.js';
import { INotebookService } from '../../common/notebookService.js';

export class DiffNestedCellViewModel extends Disposable implements IDiffNestedCellViewModel, IGenericCellViewModel {
	private _id: string;
	get id() {
		return this._id;
	}

	get outputs() {
		return this.textModel.outputs;
	}

	get language() {
		return this.textModel.language;
	}

	get metadata() {
		return this.textModel.metadata;
	}

	get uri() {
		return this.textModel.uri;
	}

	get handle() {
		return this.textModel.handle;
	}

	protected readonly _onDidChangeState: Emitter<CellViewModelStateChangeEvent> = this._register(new Emitter<CellViewModelStateChangeEvent>());

	private _hoveringOutput: boolean = false;
	public get outputIsHovered(): boolean {
		return this._hoveringOutput;
	}

	public set outputIsHovered(v: boolean) {
		this._hoveringOutput = v;
		this._onDidChangeState.fire({ outputIsHoveredChanged: true });
	}

	private _focusOnOutput: boolean = false;
	public get outputIsFocused(): boolean {
		return this._focusOnOutput;
	}

	public set outputIsFocused(v: boolean) {
		this._focusOnOutput = v;
		this._onDidChangeState.fire({ outputIsFocusedChanged: true });
	}

	private _focusInputInOutput: boolean = false;
	public get inputInOutputIsFocused(): boolean {
		return this._focusInputInOutput;
	}

	public set inputInOutputIsFocused(v: boolean) {
		this._focusInputInOutput = v;
	}

	private _outputViewModels: ICellOutputViewModel[];

	get outputsViewModels() {
		return this._outputViewModels;
	}

	protected _outputCollection: number[] = [];
	protected _outputsTop: PrefixSumComputer | null = null;

	protected readonly _onDidChangeOutputLayout = this._register(new Emitter<void>());
	readonly onDidChangeOutputLayout = this._onDidChangeOutputLayout.event;

	constructor(
		readonly textModel: NotebookCellTextModel,
		@INotebookService private _notebookService: INotebookService
	) {
		super();
		this._id = generateUuid();

		this._outputViewModels = this.textModel.outputs.map(output => new CellOutputViewModel(this, output, this._notebookService));
		this._register(this.textModel.onDidChangeOutputs((splice) => {
			this._outputCollection.splice(splice.start, splice.deleteCount, ...splice.newOutputs.map(() => 0));
			const removed = this._outputViewModels.splice(splice.start, splice.deleteCount, ...splice.newOutputs.map(output => new CellOutputViewModel(this, output, this._notebookService)));
			removed.forEach(vm => vm.dispose());

			this._outputsTop = null;
			this._onDidChangeOutputLayout.fire();
		}));
		this._outputCollection = new Array(this.textModel.outputs.length);
	}

	private _ensureOutputsTop() {
		if (!this._outputsTop) {
			const values = new Uint32Array(this._outputCollection.length);
			for (let i = 0; i < this._outputCollection.length; i++) {
				values[i] = this._outputCollection[i];
			}

			this._outputsTop = new PrefixSumComputer(values);
		}
	}

	getOutputOffset(index: number): number {
		this._ensureOutputsTop();

		if (index >= this._outputCollection.length) {
			throw new Error('Output index out of range!');
		}

		return this._outputsTop!.getPrefixSum(index - 1);
	}

	updateOutputHeight(index: number, height: number): void {
		if (index >= this._outputCollection.length) {
			throw new Error('Output index out of range!');
		}

		this._ensureOutputsTop();
		this._outputCollection[index] = height;
		if (this._outputsTop!.setValue(index, height)) {
			this._onDidChangeOutputLayout.fire();
		}
	}

	getOutputTotalHeight() {
		this._ensureOutputsTop();

		return this._outputsTop?.getTotalSum() ?? 0;
	}

	public override dispose(): void {
		super.dispose();

		this._outputViewModels.forEach(output => {
			output.dispose();
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/editorHeightCalculator.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/editorHeightCalculator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../base/common/uri.js';
import { UnchangedRegion } from '../../../../../editor/browser/widget/diffEditor/diffEditorViewModel.js';
import { IEditorWorkerService } from '../../../../../editor/common/services/editorWorker.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { getEditorPadding } from './diffCellEditorOptions.js';
import { HeightOfHiddenLinesRegionInDiffEditor } from './diffElementViewModel.js';

export interface IDiffEditorHeightCalculatorService {
	diffAndComputeHeight(original: URI, modified: URI): Promise<number>;
	computeHeightFromLines(lineCount: number): number;
}

export class DiffEditorHeightCalculatorService {
	constructor(
		private readonly lineHeight: number,
		@ITextModelService private readonly textModelResolverService: ITextModelService,
		@IEditorWorkerService private readonly editorWorkerService: IEditorWorkerService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) { }

	public async diffAndComputeHeight(original: URI, modified: URI): Promise<number> {
		const [originalModel, modifiedModel] = await Promise.all([this.textModelResolverService.createModelReference(original), this.textModelResolverService.createModelReference(modified)]);
		try {
			const diffChanges = await this.editorWorkerService.computeDiff(original, modified, {
				ignoreTrimWhitespace: true,
				maxComputationTimeMs: 0,
				computeMoves: false
			}, 'advanced').then(diff => diff?.changes || []);

			const unchangedRegionFeatureEnabled = this.configurationService.getValue<boolean>('diffEditor.hideUnchangedRegions.enabled');
			const minimumLineCount = this.configurationService.getValue<number>('diffEditor.hideUnchangedRegions.minimumLineCount');
			const contextLineCount = this.configurationService.getValue<number>('diffEditor.hideUnchangedRegions.contextLineCount');
			const originalLineCount = originalModel.object.textEditorModel.getLineCount();
			const modifiedLineCount = modifiedModel.object.textEditorModel.getLineCount();
			const unchanged = unchangedRegionFeatureEnabled ? UnchangedRegion.fromDiffs(diffChanges,
				originalLineCount,
				modifiedLineCount,
				minimumLineCount ?? 3,
				contextLineCount ?? 3) : [];

			const numberOfNewLines = diffChanges.reduce((prev, curr) => {
				if (curr.original.isEmpty && !curr.modified.isEmpty) {
					return prev + curr.modified.length;
				}
				if (!curr.original.isEmpty && !curr.modified.isEmpty && curr.modified.length > curr.original.length) {
					return prev + curr.modified.length - curr.original.length;
				}
				return prev;
			}, 0);
			const orginalNumberOfLines = originalModel.object.textEditorModel.getLineCount();
			const numberOfHiddenLines = unchanged.reduce((prev, curr) => prev + curr.lineCount, 0);
			const numberOfHiddenSections = unchanged.length;
			const unchangeRegionsHeight = numberOfHiddenSections * HeightOfHiddenLinesRegionInDiffEditor;
			const visibleLineCount = orginalNumberOfLines + numberOfNewLines - numberOfHiddenLines;

			// TODO: When we have a horizontal scrollbar, we need to add 12 to the height.
			// Right now there's no way to determine if a horizontal scrollbar is visible in the editor.
			return (visibleLineCount * this.lineHeight) + getEditorPadding(visibleLineCount).top + getEditorPadding(visibleLineCount).bottom + unchangeRegionsHeight;
		} finally {
			originalModel.dispose();
			modifiedModel.dispose();
		}
	}

	public computeHeightFromLines(lineCount: number): number {
		return lineCount * this.lineHeight + getEditorPadding(lineCount).top + getEditorPadding(lineCount).bottom;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/eventDispatcher.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/eventDispatcher.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IDiffElementLayoutInfo } from './notebookDiffEditorBrowser.js';
import { NotebookLayoutChangeEvent, NotebookLayoutInfo } from '../notebookViewEvents.js';

export enum NotebookDiffViewEventType {
	LayoutChanged = 1,
	CellLayoutChanged = 2
	// MetadataChanged = 2,
	// CellStateChanged = 3
}

export class NotebookDiffLayoutChangedEvent {
	public readonly type = NotebookDiffViewEventType.LayoutChanged;

	constructor(readonly source: NotebookLayoutChangeEvent, readonly value: NotebookLayoutInfo) {

	}
}

export class NotebookCellLayoutChangedEvent {
	public readonly type = NotebookDiffViewEventType.CellLayoutChanged;

	constructor(readonly source: IDiffElementLayoutInfo) {

	}
}

export type NotebookDiffViewEvent = NotebookDiffLayoutChangedEvent | NotebookCellLayoutChangedEvent;

export class NotebookDiffEditorEventDispatcher extends Disposable {
	protected readonly _onDidChangeLayout = this._register(new Emitter<NotebookDiffLayoutChangedEvent>());
	readonly onDidChangeLayout = this._onDidChangeLayout.event;

	protected readonly _onDidChangeCellLayout = this._register(new Emitter<NotebookCellLayoutChangedEvent>());
	readonly onDidChangeCellLayout = this._onDidChangeCellLayout.event;

	emit(events: NotebookDiffViewEvent[]) {
		for (let i = 0, len = events.length; i < len; i++) {
			const e = events[i];

			switch (e.type) {
				case NotebookDiffViewEventType.LayoutChanged:
					this._onDidChangeLayout.fire(e);
					break;
				case NotebookDiffViewEventType.CellLayoutChanged:
					this._onDidChangeCellLayout.fire(e);
					break;
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/notebookDiff.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/notebookDiff.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* .notebook-diff-editor {
	display: flex;
	flex-direction: row;
	height: 100%;
	width: 100%;
}
.notebook-diff-editor-modified,
.notebook-diff-editor-original {
	display: flex;
	height: 100%;
	width: 50%;
} */

.notebook-text-diff-editor {
	position: relative;
}

.notebook-text-diff-editor .cell-body {
	display: flex;
	flex-direction: row;
}

.notebook-text-diff-editor .cell-placeholder-body {
	display: flex;
	flex-direction: row;
}

.notebook-text-diff-editor .webview-cover {
	user-select: initial;
	-webkit-user-select: initial;
}

.notebook-text-diff-editor .cell-body .border-container {
	position: absolute;
	width: calc(100% - 32px);
}

.notebook-text-diff-editor .cell-body .border-container .top-border,
.notebook-text-diff-editor .cell-body .border-container .bottom-border {
	position: absolute;
	width: 100%;
}

.notebook-text-diff-editor .cell-body .border-container .left-border,
.notebook-text-diff-editor .cell-body .border-container .right-border {
	position: absolute;
}

.notebook-text-diff-editor .cell-body .border-container .right-border {
	left: 100%;
}

.notebook-text-diff-editor .cell-body.right {
	flex-direction: row-reverse;
}

.notebook-text-diff-editor .cell-body .diagonal-fill {
	display: none;
	width: 50%;
}

.notebook-text-diff-editor .cell-body .cell-diff-editor-container {
	width: 100%;
	/* why we overflow hidden at the beginning?*/
	/* overflow: hidden; */
}

.notebook-text-diff-editor > .notebook-diff-list-view > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row {
	cursor: default;
}

.notebook-text-diff-editor .cell-body .cell-diff-editor-container .metadata-editor-container.diff,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container .output-editor-container.diff,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container .editor-container.diff {
	/** 100% + diffOverviewWidth */
	width: calc(100%);
}

.notebook-text-diff-editor .cell-body .cell-diff-editor-container .metadata-editor-container .monaco-diff-editor .diffOverview,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container .editor-container.diff .monaco-diff-editor .diffOverview,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container .output-editor-container.diff .monaco-diff-editor .diffOverview {
	display: none;
}

.notebook-text-diff-editor .cell-body .cell-diff-editor-container .metadata-editor-container,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container .editor-container {
	box-sizing: border-box;
}

.notebook-text-diff-editor .cell-body.left .cell-diff-editor-container,
.notebook-text-diff-editor .cell-body.right .cell-diff-editor-container {
	display: inline-block;
	width: 50%;
}

.notebook-text-diff-editor .cell-body.left .diagonal-fill,
.notebook-text-diff-editor .cell-body.right .diagonal-fill {
	display: inline-block;
	width: 50%;
}

.notebook-text-diff-editor .cell-diff-editor-container .input-header-container,
.notebook-text-diff-editor .cell-diff-editor-container .output-header-container,
.notebook-text-diff-editor .cell-diff-editor-container .metadata-header-container {
	display: flex;
	height: 24px;
	align-items: center;
	cursor: default;
}

.notebook-text-diff-editor .cell-diff-editor-container .input-header-container .property-folding-indicator .codicon,
.notebook-text-diff-editor .cell-diff-editor-container .output-header-container .property-folding-indicator .codicon,
.notebook-text-diff-editor .cell-diff-editor-container .metadata-header-container .property-folding-indicator .codicon {
	visibility: visible;
	padding: 4px 0 0 6px;
	cursor: pointer;
}

.notebook-text-diff-editor .cell-diff-editor-container .input-header-container,
.notebook-text-diff-editor .cell-diff-editor-container .output-header-container,
.notebook-text-diff-editor .cell-diff-editor-container .metadata-header-container {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.notebook-text-diff-editor .cell-diff-editor-container .input-header-container,
.notebook-text-diff-editor .cell-diff-editor-container .output-header-container,
.notebook-text-diff-editor .cell-diff-editor-container .metadata-header-container {
	cursor: pointer;
}

.notebook-text-diff-editor .cell-diff-editor-container .input-header-container .property-toolbar,
.notebook-text-diff-editor .cell-diff-editor-container .output-header-container .property-toolbar,
.notebook-text-diff-editor .cell-diff-editor-container .metadata-header-container .property-toolbar {
	margin-left: auto;
}

.notebook-text-diff-editor .cell-diff-editor-container .input-header-container .property-status,
.notebook-text-diff-editor .cell-diff-editor-container .output-header-container .property-status,
.notebook-text-diff-editor .cell-diff-editor-container .metadata-header-container .property-status {
	font-size: 12px;
}

.notebook-text-diff-editor .cell-diff-editor-container .input-header-container .property-status span,
.notebook-text-diff-editor .cell-diff-editor-container .output-header-container .property-status span,
.notebook-text-diff-editor .cell-diff-editor-container .metadata-header-container .property-status span {
	margin: 0 0 0 5px;
	line-height: 21px;
}

.notebook-text-diff-editor .cell-diff-editor-container .input-header-container .property-status span.property-description,
.notebook-text-diff-editor .cell-diff-editor-container .output-header-container .property-status span.property-description,
.notebook-text-diff-editor .cell-diff-editor-container .metadata-header-container .property-status span.property-description {
	font-style: italic;
}

.notebook-text-diff-editor {
	overflow: hidden;
}

.monaco-workbench .notebook-text-diff-editor > .notebook-diff-list-view > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row {
	overflow: visible !important;
}

.monaco-workbench .notebook-text-diff-editor > .notebook-diff-list-view > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row,
.monaco-workbench .notebook-text-diff-editor > .notebook-diff-list-view > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row:hover,
.monaco-workbench .notebook-text-diff-editor > .notebook-diff-list-view > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused {
	outline: none !important;
	background-color: transparent !important;
}

.notebook-text-diff-editor .cell-diff-editor-container .editor-input-toolbar-container {
	position: absolute;
	right: 16px;
	top: 16px;
	margin: 1px 2px;
}

.monaco-workbench .notebook-text-diff-editor .cell-body {
	height: 0;
}

.monaco-workbench .notebook-text-diff-editor .cell-body .output-view-container {
	user-select: text;
	-webkit-user-select: text;
	white-space: initial;
	cursor: auto;
	position: relative;
}

.monaco-workbench .notebook-text-diff-editor .cell-body.left .output-view-container .output-inner-container,
.monaco-workbench .notebook-text-diff-editor .cell-body.right .output-view-container .output-inner-container {
	width: 100%;
	padding: 0px 8px;
	box-sizing: border-box;
	overflow-x: hidden;
}

.monaco-workbench .notebook-text-diff-editor .cell-body.left .output-view-container .output-inner-container {
	padding: 0px 8px 0px 32px;
}

.monaco-workbench .notebook-text-diff-editor .cell-body.right .output-view-container .output-inner-container {
	padding: 0px 8px 0px 32px;
}

.monaco-workbench .notebook-text-diff-editor .cell-body.full .output-view-container .output-inner-container {
	width: 100%;
	padding: 4px 8px 4px 32px;
	box-sizing: border-box;
	overflow: hidden;
}

.monaco-workbench .notebook-text-diff-editor .cell-body.full .output-info-container .output-view-container .output-view-container-left {
	top: 0;
	position: absolute;
	left: 0;
}

.monaco-workbench .notebook-text-diff-editor .cell-body.full .output-info-container .output-view-container .output-view-container-right {
	position: absolute;
	top: 0;
	left: 50%;
}

.monaco-workbench .notebook-text-diff-editor .cell-body.full .output-info-container .output-view-container .output-view-container-left,
.monaco-workbench .notebook-text-diff-editor .cell-body.full .output-info-container .output-view-container .output-view-container-right {
	width: 50%;
	display: inline-block;
}

.monaco-workbench .notebook-text-diff-editor .cell-body.full .output-info-container .output-view-container .output-view-container-left div.foreground,
.monaco-workbench .notebook-text-diff-editor .cell-body.full .output-info-container .output-view-container .output-view-container-right div.foreground {
	width: 100%;
}

.monaco-workbench .notebook-text-diff-editor .output-view-container > div.foreground {
	width: 100%;
	min-height: 24px;
	box-sizing: border-box;
}

.monaco-workbench .notebook-text-diff-editor .output-view-container .error_message {
	color: red;
}

.monaco-workbench .notebook-text-diff-editor .output-view-container .error > div {
	white-space: normal;
}

.monaco-workbench .notebook-text-diff-editor .output-view-container .error pre.traceback {
	box-sizing: border-box;
	padding: 8px 0;
	margin: 0px;
}

.monaco-workbench .notebook-text-diff-editor .output-view-container .error .traceback > span {
	display: block;
}

.monaco-workbench .notebook-text-diff-editor .output-view-container .display img {
	max-width: 100%;
}

.monaco-workbench .notebook-text-diff-editor .output-view-container .multi-mimetype-output {
	position: absolute;
	top: 4px;
	left: 8px;
	width: 16px;
	height: 16px;
	cursor: pointer;
	padding: 2px 4px 4px 2px;
}

.monaco-workbench .notebook-text-diff-editor .output-view-container .output-empty-view span {
	opacity: 0.7;
}

.monaco-workbench .notebook-text-diff-editor .output-view-container .output-empty-view {
	font-style: italic;
	height: 24px;
	margin: auto;
	padding-left: 12px;
}

.monaco-workbench .notebook-text-diff-editor .output-view-container pre {
	margin: 4px 0;
}

.monaco-workbench .notebook-text-diff-edito .monaco-list:focus-within .monaco-list-row.focused .codicon,
.monaco-workbench .notebook-text-diff-editor .monaco-list:focus-within .monaco-list-row.selected .codicon {
	color: inherit;
}

.monaco-workbench .notebook-text-diff-editor .output-view-container .output-view-container-metadata {
	position: relative;
}

/* Diff decorations */

.notebook-text-diff-editor .cell-body .codicon-diff-remove,
.notebook-text-diff-editor .cell-body .codicon-diff-insert {
	left: 4px !important;
	width: 15px !important;
}

.monaco-workbench .notebook-text-diff-editor > .monaco-list > .monaco-scrollable-element > .scrollbar.visible {
	z-index: var(--z-index-notebook-scrollbar);
	cursor: default;
}

.notebook-text-diff-editor .notebook-overview-ruler-container {
	position: absolute;
	top: 0;
	right: 0;
}

.notebook-text-diff-editor .notebook-overview-ruler-container .diffViewport {
	z-index: var(--notebook-diff-view-viewport-slider);
}

.notebook-text-diff-editor .diffViewport {
	background: var(--vscode-scrollbarSlider-background);
}

.notebook-text-diff-editor .diffViewport:hover {
	background: var(--vscode-scrollbarSlider-hoverBackground);
}

.notebook-text-diff-editor .diffViewport:active {
	background: var(--vscode-scrollbarSlider-activeBackground);
}

/** Diff cell borders */
.notebook-text-diff-editor .cell-body .border-container .top-border,
.notebook-text-diff-editor .cell-body .border-container .bottom-border,
.notebook-text-diff-editor .cell-diff-editor-container .output-header-container,
.notebook-text-diff-editor .cell-diff-editor-container .metadata-header-container {
	border-top: 1px solid var(--vscode-notebook-cellBorderColor);
}

.notebook-text-diff-editor .cell-body .border-container .left-border {
	border-left: 1px solid var(--vscode-notebook-cellBorderColor);
}

.notebook-text-diff-editor .cell-body .border-container .right-border {
	border-right: 1px solid var(--vscode-notebook-cellBorderColor);
}

/** Diff cell active borders */
.notebook-text-diff-editor .monaco-list-row.focused .cell-body .border-container .top-border,
.notebook-text-diff-editor .monaco-list-row.focused .cell-body .border-container .bottom-border {
	border-top: 1px solid var(--vscode-notebook-focusedEditorBorder);
}

.notebook-text-diff-editor .monaco-list-row.focused .cell-body .border-container .left-border {
	border-left: 1px solid var(--vscode-notebook-focusedEditorBorder);
}

.notebook-text-diff-editor .monaco-list-row.focused .cell-body .border-container .right-border {
	border-right: 1px solid var(--vscode-notebook-focusedEditorBorder);
}

/** Diff cell diff background */

.monaco-workbench .notebook-text-diff-editor .cell-body.full .output-info-container.modified .output-view-container .output-view-container-right div.foreground,
.monaco-workbench .notebook-text-diff-editor .cell-body.right .output-info-container .output-view-container div.foreground,
.monaco-workbench .notebook-text-diff-editor .cell-body.right .output-info-container .output-view-container div.output-empty-view,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.inserted .source-container,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.inserted .source-container .monaco-editor .margin,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.inserted .source-container .monaco-editor .monaco-editor-background,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.inserted .input-header-container,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.inserted .metadata-editor-container,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.inserted .metadata-editor-container .monaco-editor .margin,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.inserted .metadata-editor-container .monaco-editor .monaco-editor-background,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.inserted .output-editor-container,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.inserted .output-editor-container .monaco-editor .margin,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.inserted .output-editor-container .monaco-editor .monaco-editor-background,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.inserted .metadata-header-container,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.inserted .output-header-container {
	background-color: var(--vscode-diffEditor-insertedTextBackground);
}

.monaco-workbench .notebook-text-diff-editor .cell-body.full .output-info-container.modified .output-view-container .output-view-container-left div.foreground,
.monaco-workbench .notebook-text-diff-editor .cell-body.left .output-info-container .output-view-container div.foreground,
.monaco-workbench .notebook-text-diff-editor .cell-body.left .output-info-container .output-view-container div.output-empty-view,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.removed .source-container,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.removed .source-container .monaco-editor .margin,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.removed .source-container .monaco-editor .monaco-editor-background,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.removed .input-header-container,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.removed .metadata-editor-container,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.removed .metadata-editor-container .monaco-editor .margin,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.removed .metadata-editor-container .monaco-editor .monaco-editor-background,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.removed .output-editor-container,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.removed .output-editor-container .monaco-editor .margin,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.removed .output-editor-container .monaco-editor .monaco-editor-background,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.removed .metadata-header-container,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container.removed .output-header-container {
	background-color: var(--vscode-diffEditor-removedTextBackground);
}

/** Diff cell editor background */
.notebook-text-diff-editor .cell-body .cell-diff-editor-container .source-container .monaco-editor .margin,
.notebook-text-diff-editor .cell-body .cell-diff-editor-container .source-container .monaco-editor .monaco-editor-background {
	background: var(--vscode-notebook-cellEditorBackground, var(--vscode-editor-background));
}

/** Overlay to hide the unchanged cells */
.notebook-text-diff-editor .cell-body.full div.diff-hidden-cells {
	position: absolute;
	left: 0;

	font-size: 13px;
	line-height: 14px;
}

.notebook-text-diff-editor .cell-body.full div.diff-hidden-cells .center {
	color: var(--vscode-diffEditor-unchangedRegionForeground);
	overflow: hidden;
	display: block;
	white-space: nowrap;

	height: 24px;
}

.notebook-text-diff-editor .cell-body.full div.diff-hidden-cells .center span.codicon {
	vertical-align: middle;
}

.notebook-text-diff-editor .cell-body.full div.diff-hidden-cells .center a:hover .codicon {
	cursor: pointer;
}

/** Overlay to unhide the unchanged cells */
.notebook-text-diff-editor .cell-placeholder-body {
	background: var(--vscode-diffEditor-unchangedRegionBackground);
	color: var(--vscode-diffEditor-unchangedRegionForeground);
	min-height: 24px;
}

.notebook-text-diff-editor .cell-placeholder-body div.diff-hidden-cells .center {
	overflow: hidden;
	display: block;
	text-overflow: ellipsis;
	white-space: nowrap;

	height: 24px;
}

.notebook-text-diff-editor .cell-placeholder-body .text {
	/** Add a gap between text and the unfold icon */
	padding-left: 2px;
}

.notebook-text-diff-editor .cell-placeholder-body div.diff-hidden-cells .center span.codicon,
.notebook-text-diff-editor .cell-placeholder-body .text {
	vertical-align: middle;
}

.notebook-text-diff-editor .cell-placeholder-body div.diff-hidden-cells .center a:hover .codicon {
	cursor: pointer;
	color: var(--vscode-editorLink-activeForeground) !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/notebookDiffActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/notebookDiffActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IBulkEditService, ResourceTextEdit } from '../../../../../editor/browser/services/bulkEditService.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, ContextKeyExpression } from '../../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { ActiveEditorContext } from '../../../../common/contextkeys.js';
import { DiffElementCellViewModelBase, NotebookDocumentMetadataViewModel, SideBySideDiffElementViewModel } from './diffElementViewModel.js';
import { INotebookTextDiffEditor, NOTEBOOK_DIFF_CELL_IGNORE_WHITESPACE_KEY, NOTEBOOK_DIFF_CELL_INPUT, NOTEBOOK_DIFF_CELL_PROPERTY, NOTEBOOK_DIFF_CELL_PROPERTY_EXPANDED, NOTEBOOK_DIFF_HAS_UNCHANGED_CELLS, NOTEBOOK_DIFF_ITEM_DIFF_STATE, NOTEBOOK_DIFF_ITEM_KIND, NOTEBOOK_DIFF_METADATA, NOTEBOOK_DIFF_UNCHANGED_CELLS_HIDDEN } from './notebookDiffEditorBrowser.js';
import { NotebookTextDiffEditor } from './notebookDiffEditor.js';
import { NotebookDiffEditorInput } from '../../common/notebookDiffEditorInput.js';
import { nextChangeIcon, openAsTextIcon, previousChangeIcon, renderOutputIcon, revertIcon, toggleWhitespace } from '../notebookIcons.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../../../../platform/configuration/common/configurationRegistry.js';
import { ICommandActionTitle } from '../../../../../platform/action/common/action.js';
import { DEFAULT_EDITOR_ASSOCIATION } from '../../../../common/editor.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { CellEditType, ICellEditOperation, NOTEBOOK_DIFF_EDITOR_ID } from '../../common/notebookCommon.js';
import { ITextResourceConfigurationService } from '../../../../../editor/common/services/textResourceConfiguration.js';
import { NotebookMultiTextDiffEditor } from './notebookMultiDiffEditor.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import type { URI } from '../../../../../base/common/uri.js';
import { TextEditorSelectionRevealType, type ITextEditorOptions } from '../../../../../platform/editor/common/editor.js';
import product from '../../../../../platform/product/common/product.js';
import { ctxHasEditorModification, ctxHasRequestInProgress } from '../../../chat/browser/chatEditing/chatEditingEditorContextKeys.js';

// ActiveEditorContext.isEqualTo(SearchEditorConstants.SearchEditorID)

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.diff.openFile',
			icon: Codicon.goToFile,
			title: localize2('notebook.diff.openFile', 'Open File'),
			precondition: ContextKeyExpr.or(ActiveEditorContext.isEqualTo(NotebookTextDiffEditor.ID), ActiveEditorContext.isEqualTo(NotebookMultiTextDiffEditor.ID)),
			menu: [{
				id: MenuId.EditorTitle,
				group: 'navigation',
				when: ContextKeyExpr.or(ActiveEditorContext.isEqualTo(NotebookTextDiffEditor.ID), ActiveEditorContext.isEqualTo(NotebookMultiTextDiffEditor.ID)),
			}]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);

		const activeEditor = editorService.activeEditorPane;
		if (!activeEditor) {
			return;
		}
		if (activeEditor instanceof NotebookTextDiffEditor || activeEditor instanceof NotebookMultiTextDiffEditor) {
			const diffEditorInput = activeEditor.input as NotebookDiffEditorInput;
			const resource = diffEditorInput.modified.resource;
			await editorService.openEditor({ resource });
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.diff.cell.toggleCollapseUnchangedRegions',
			title: localize2('notebook.diff.cell.toggleCollapseUnchangedRegions', 'Toggle Collapse Unchanged Regions'),
			icon: Codicon.map,
			toggled: ContextKeyExpr.has('config.diffEditor.hideUnchangedRegions.enabled'),
			precondition: ActiveEditorContext.isEqualTo(NotebookTextDiffEditor.ID),
			menu: {
				id: MenuId.EditorTitle,
				group: 'navigation',
				when: ActiveEditorContext.isEqualTo(NotebookTextDiffEditor.ID),
			},
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const configurationService = accessor.get(IConfigurationService);
		const newValue = !configurationService.getValue<boolean>('diffEditor.hideUnchangedRegions.enabled');
		configurationService.updateValue('diffEditor.hideUnchangedRegions.enabled', newValue);
	}
});


registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.diff.switchToText',
			icon: openAsTextIcon,
			title: localize2('notebook.diff.switchToText', 'Open Text Diff Editor'),
			precondition: ContextKeyExpr.or(ActiveEditorContext.isEqualTo(NotebookTextDiffEditor.ID), ActiveEditorContext.isEqualTo(NotebookMultiTextDiffEditor.ID)),
			menu: [{
				id: MenuId.EditorTitle,
				group: 'navigation',
				when: ContextKeyExpr.or(ActiveEditorContext.isEqualTo(NotebookTextDiffEditor.ID), ActiveEditorContext.isEqualTo(NotebookMultiTextDiffEditor.ID)),
			}]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);

		const activeEditor = editorService.activeEditorPane;
		if (!activeEditor) {
			return;
		}
		if (activeEditor instanceof NotebookTextDiffEditor || activeEditor instanceof NotebookMultiTextDiffEditor) {
			const diffEditorInput = activeEditor.input as NotebookDiffEditorInput;

			await editorService.openEditor(
				{
					original: { resource: diffEditorInput.original.resource },
					modified: { resource: diffEditorInput.resource },
					label: diffEditorInput.getName(),
					options: {
						preserveFocus: false,
						override: DEFAULT_EDITOR_ASSOCIATION.id
					}
				});
		}
	}
});


registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.diffEditor.showUnchangedCells',
			title: localize2('showUnchangedCells', 'Show Unchanged Cells'),
			icon: Codicon.unfold,
			precondition: ContextKeyExpr.and(ActiveEditorContext.isEqualTo(NotebookMultiTextDiffEditor.ID), ContextKeyExpr.has(NOTEBOOK_DIFF_HAS_UNCHANGED_CELLS.key)),
			menu: {
				when: ContextKeyExpr.and(ActiveEditorContext.isEqualTo(NotebookMultiTextDiffEditor.ID), ContextKeyExpr.has(NOTEBOOK_DIFF_HAS_UNCHANGED_CELLS.key), ContextKeyExpr.equals(NOTEBOOK_DIFF_UNCHANGED_CELLS_HIDDEN.key, true)),
				id: MenuId.EditorTitle,
				order: 22,
				group: 'navigation',
			},
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const activeEditor = accessor.get(IEditorService).activeEditorPane;
		if (!activeEditor) {
			return;
		}
		if (activeEditor instanceof NotebookMultiTextDiffEditor) {
			activeEditor.showUnchanged();
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.diffEditor.hideUnchangedCells',
			title: localize2('hideUnchangedCells', 'Hide Unchanged Cells'),
			icon: Codicon.fold,
			precondition: ContextKeyExpr.and(ActiveEditorContext.isEqualTo(NotebookMultiTextDiffEditor.ID), ContextKeyExpr.has(NOTEBOOK_DIFF_HAS_UNCHANGED_CELLS.key)),
			menu: {
				when: ContextKeyExpr.and(ActiveEditorContext.isEqualTo(NotebookMultiTextDiffEditor.ID), ContextKeyExpr.has(NOTEBOOK_DIFF_HAS_UNCHANGED_CELLS.key), ContextKeyExpr.equals(NOTEBOOK_DIFF_UNCHANGED_CELLS_HIDDEN.key, false)),
				id: MenuId.EditorTitle,
				order: 22,
				group: 'navigation',
			},
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const activeEditor = accessor.get(IEditorService).activeEditorPane;
		if (!activeEditor) {
			return;
		}
		if (activeEditor instanceof NotebookMultiTextDiffEditor) {
			activeEditor.hideUnchanged();
		}
	}
});

registerAction2(class GoToFileAction extends Action2 {
	constructor() {
		super({
			id: 'notebook.diffEditor.2.goToCell',
			title: localize2('goToCell', 'Go To Cell'),
			icon: Codicon.goToFile,
			menu: {
				when: ContextKeyExpr.and(ActiveEditorContext.isEqualTo(NotebookMultiTextDiffEditor.ID), ContextKeyExpr.equals(NOTEBOOK_DIFF_ITEM_KIND.key, 'Cell'), ContextKeyExpr.notEquals(NOTEBOOK_DIFF_ITEM_DIFF_STATE.key, 'delete')),
				id: MenuId.MultiDiffEditorFileToolbar,
				order: 0,
				group: 'navigation',
			},
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const uri = args[0] as URI;
		const editorService = accessor.get(IEditorService);
		const activeEditorPane = editorService.activeEditorPane;
		if (!(activeEditorPane instanceof NotebookMultiTextDiffEditor)) {
			return;
		}

		await editorService.openEditor({
			resource: uri,
			options: {
				selectionRevealType: TextEditorSelectionRevealType.CenterIfOutsideViewport,
			} satisfies ITextEditorOptions,
		});
	}
});


registerAction2(class extends Action2 {
	constructor() {
		super(
			{
				id: 'notebook.diff.revertMetadata',
				title: localize('notebook.diff.revertMetadata', "Revert Notebook Metadata"),
				icon: revertIcon,
				f1: false,
				menu: {
					id: MenuId.NotebookDiffDocumentMetadata,
					when: NOTEBOOK_DIFF_METADATA,
				},
				precondition: NOTEBOOK_DIFF_METADATA

			}
		);
	}
	run(accessor: ServicesAccessor, context?: NotebookDocumentMetadataViewModel) {
		if (!context) {
			return;
		}

		const editorService = accessor.get(IEditorService);
		const activeEditorPane = editorService.activeEditorPane;
		if (!(activeEditorPane instanceof NotebookTextDiffEditor)) {
			return;
		}

		context.modifiedDocumentTextModel.applyEdits([{
			editType: CellEditType.DocumentMetadata,
			metadata: context.originalMetadata.metadata,
		}], true, undefined, () => undefined, undefined, true);
	}
});

const revertInput = localize('notebook.diff.cell.revertInput', "Revert Input");

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.diffEditor.2.cell.revertInput',
			title: revertInput,
			icon: revertIcon,
			menu: {
				when: ContextKeyExpr.and(ActiveEditorContext.isEqualTo(NotebookMultiTextDiffEditor.ID), ContextKeyExpr.equals(NOTEBOOK_DIFF_ITEM_KIND.key, 'Cell'), ContextKeyExpr.equals(NOTEBOOK_DIFF_ITEM_DIFF_STATE.key, 'modified')),
				id: MenuId.MultiDiffEditorFileToolbar,
				order: 2,
				group: 'navigation',
			},
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const uri = args[0] as URI;
		const editorService = accessor.get(IEditorService);
		const activeEditorPane = editorService.activeEditorPane;
		if (!(activeEditorPane instanceof NotebookMultiTextDiffEditor)) {
			return;
		}

		const item = activeEditorPane.getDiffElementViewModel(uri);
		if (item && item instanceof SideBySideDiffElementViewModel) {
			const modified = item.modified;
			const original = item.original;

			if (!original || !modified) {
				return;
			}

			const bulkEditService = accessor.get(IBulkEditService);
			await bulkEditService.apply([
				new ResourceTextEdit(modified.uri, { range: modified.textModel.getFullModelRange(), text: original.textModel.getValue() }),
			], { quotableLabel: 'Revert Notebook Cell Content Change' });
		}
	}
});

const revertOutputs = localize('notebook.diff.cell.revertOutputs', "Revert Outputs");

registerAction2(class extends Action2 {
	constructor() {
		super(
			{
				id: 'notebook.diffEditor.2.cell.revertOutputs',
				title: revertOutputs,
				icon: revertIcon,
				f1: false,
				menu: {
					when: ContextKeyExpr.and(ActiveEditorContext.isEqualTo(NotebookMultiTextDiffEditor.ID), ContextKeyExpr.equals(NOTEBOOK_DIFF_ITEM_KIND.key, 'Output'), ContextKeyExpr.equals(NOTEBOOK_DIFF_ITEM_DIFF_STATE.key, 'modified')),
					id: MenuId.MultiDiffEditorFileToolbar,
					order: 2,
					group: 'navigation',
				},
			}
		);
	}
	async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const uri = args[0] as URI;
		const editorService = accessor.get(IEditorService);
		const activeEditorPane = editorService.activeEditorPane;
		if (!(activeEditorPane instanceof NotebookMultiTextDiffEditor)) {
			return;
		}

		const item = activeEditorPane.getDiffElementViewModel(uri);
		if (item && item instanceof SideBySideDiffElementViewModel) {
			const original = item.original;

			const modifiedCellIndex = item.modifiedDocument.cells.findIndex(cell => cell.handle === item.modified.handle);
			if (modifiedCellIndex === -1) {
				return;
			}

			item.mainDocumentTextModel.applyEdits([{
				editType: CellEditType.Output, index: modifiedCellIndex, outputs: original.outputs
			}], true, undefined, () => undefined, undefined, true);
		}
	}
});

const revertMetadata = localize('notebook.diff.cell.revertMetadata', "Revert Metadata");

registerAction2(class extends Action2 {
	constructor() {
		super(
			{
				id: 'notebook.diffEditor.2.cell.revertMetadata',
				title: revertMetadata,
				icon: revertIcon,
				f1: false,
				menu: {
					when: ContextKeyExpr.and(ActiveEditorContext.isEqualTo(NotebookMultiTextDiffEditor.ID), ContextKeyExpr.equals(NOTEBOOK_DIFF_ITEM_KIND.key, 'Metadata'), ContextKeyExpr.equals(NOTEBOOK_DIFF_ITEM_DIFF_STATE.key, 'modified')),
					id: MenuId.MultiDiffEditorFileToolbar,
					order: 2,
					group: 'navigation',
				},
			}
		);
	}
	async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const uri = args[0] as URI;
		const editorService = accessor.get(IEditorService);
		const activeEditorPane = editorService.activeEditorPane;
		if (!(activeEditorPane instanceof NotebookMultiTextDiffEditor)) {
			return;
		}

		const item = activeEditorPane.getDiffElementViewModel(uri);
		if (item && item instanceof SideBySideDiffElementViewModel) {
			const original = item.original;

			const modifiedCellIndex = item.modifiedDocument.cells.findIndex(cell => cell.handle === item.modified.handle);
			if (modifiedCellIndex === -1) {
				return;
			}

			item.mainDocumentTextModel.applyEdits([{
				editType: CellEditType.Metadata, index: modifiedCellIndex, metadata: original.metadata
			}], true, undefined, () => undefined, undefined, true);
		}
	}
});


registerAction2(class extends Action2 {
	constructor() {
		super(
			{
				id: 'notebook.diff.cell.revertMetadata',
				title: revertMetadata,
				icon: revertIcon,
				f1: false,
				menu: {
					id: MenuId.NotebookDiffCellMetadataTitle,
					when: NOTEBOOK_DIFF_CELL_PROPERTY
				},
				precondition: NOTEBOOK_DIFF_CELL_PROPERTY
			}
		);
	}
	run(accessor: ServicesAccessor, context?: DiffElementCellViewModelBase) {
		if (!context) {
			return;
		}

		if (!(context instanceof SideBySideDiffElementViewModel)) {
			return;
		}

		const original = context.original;
		const modified = context.modified;

		const modifiedCellIndex = context.mainDocumentTextModel.cells.indexOf(modified.textModel);
		if (modifiedCellIndex === -1) {
			return;
		}

		const rawEdits: ICellEditOperation[] = [{ editType: CellEditType.Metadata, index: modifiedCellIndex, metadata: original.metadata }];
		if (context.original.language && context.modified.language !== context.original.language) {
			rawEdits.push({ editType: CellEditType.CellLanguage, index: modifiedCellIndex, language: context.original.language });
		}

		context.modifiedDocument.applyEdits(rawEdits, true, undefined, () => undefined, undefined, true);
	}
});

// registerAction2(class extends Action2 {
// 	constructor() {
// 		super(
// 			{
// 				id: 'notebook.diff.cell.switchOutputRenderingStyle',
// 				title: localize('notebook.diff.cell.switchOutputRenderingStyle', "Switch Outputs Rendering"),
// 				icon: renderOutputIcon,
// 				f1: false,
// 				menu: {
// 					id: MenuId.NotebookDiffCellOutputsTitle
// 				}
// 			}
// 		);
// 	}
// 	run(accessor: ServicesAccessor, context?: DiffElementViewModelBase) {
// 		if (!context) {
// 			return;
// 		}

// 		context.renderOutput = true;
// 	}
// });


registerAction2(class extends Action2 {
	constructor() {
		super(
			{
				id: 'notebook.diff.cell.switchOutputRenderingStyleToText',
				title: localize('notebook.diff.cell.switchOutputRenderingStyleToText', "Switch Output Rendering"),
				icon: renderOutputIcon,
				f1: false,
				menu: {
					id: MenuId.NotebookDiffCellOutputsTitle,
					when: NOTEBOOK_DIFF_CELL_PROPERTY_EXPANDED
				}
			}
		);
	}
	run(accessor: ServicesAccessor, context?: DiffElementCellViewModelBase) {
		if (!context) {
			return;
		}

		context.renderOutput = !context.renderOutput;
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super(
			{
				id: 'notebook.diff.cell.revertOutputs',
				title: localize('notebook.diff.cell.revertOutputs', "Revert Outputs"),
				icon: revertIcon,
				f1: false,
				menu: {
					id: MenuId.NotebookDiffCellOutputsTitle,
					when: NOTEBOOK_DIFF_CELL_PROPERTY
				},
				precondition: NOTEBOOK_DIFF_CELL_PROPERTY
			}
		);
	}
	run(accessor: ServicesAccessor, context?: DiffElementCellViewModelBase) {
		if (!context) {
			return;
		}

		if (!(context instanceof SideBySideDiffElementViewModel)) {
			return;
		}

		const original = context.original;
		const modified = context.modified;

		const modifiedCellIndex = context.mainDocumentTextModel.cells.indexOf(modified.textModel);
		if (modifiedCellIndex === -1) {
			return;
		}

		context.mainDocumentTextModel.applyEdits([{
			editType: CellEditType.Output, index: modifiedCellIndex, outputs: original.outputs
		}], true, undefined, () => undefined, undefined, true);
	}
});


registerAction2(class extends Action2 {
	constructor() {
		super(
			{
				id: 'notebook.toggle.diff.cell.ignoreTrimWhitespace',
				title: localize('ignoreTrimWhitespace.label', "Show Leading/Trailing Whitespace Differences"),
				icon: toggleWhitespace,
				f1: false,
				menu: {
					id: MenuId.NotebookDiffCellInputTitle,
					when: NOTEBOOK_DIFF_CELL_INPUT,
					order: 1,
				},
				precondition: NOTEBOOK_DIFF_CELL_INPUT,
				toggled: ContextKeyExpr.equals(NOTEBOOK_DIFF_CELL_IGNORE_WHITESPACE_KEY, false),
			}
		);
	}
	run(accessor: ServicesAccessor, context?: DiffElementCellViewModelBase) {
		const cell = context;
		if (!cell?.modified) {
			return;
		}
		const uri = cell.modified.uri;
		const configService = accessor.get(ITextResourceConfigurationService);
		const key = 'diffEditor.ignoreTrimWhitespace';
		const val = configService.getValue(uri, key);
		configService.updateValue(uri, key, !val);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super(
			{
				id: 'notebook.diff.cell.revertInput',
				title: revertInput,
				icon: revertIcon,
				f1: false,
				menu: {
					id: MenuId.NotebookDiffCellInputTitle,
					when: NOTEBOOK_DIFF_CELL_INPUT,
					order: 2
				},
				precondition: NOTEBOOK_DIFF_CELL_INPUT

			}
		);
	}
	run(accessor: ServicesAccessor, context?: DiffElementCellViewModelBase) {
		if (!context) {
			return;
		}

		const original = context.original;
		const modified = context.modified;

		if (!original || !modified) {
			return;
		}

		const bulkEditService = accessor.get(IBulkEditService);
		return bulkEditService.apply([
			new ResourceTextEdit(modified.uri, { range: modified.textModel.getFullModelRange(), text: original.textModel.getValue() }),
		], { quotableLabel: 'Revert Notebook Cell Content Change' });
	}
});

class ToggleRenderAction extends Action2 {
	constructor(id: string, title: string | ICommandActionTitle, precondition: ContextKeyExpression | undefined, toggled: ContextKeyExpression | undefined, order: number, private readonly toggleOutputs?: boolean, private readonly toggleMetadata?: boolean) {
		super({
			id: id,
			title,
			precondition: precondition,
			menu: [{
				id: MenuId.EditorTitle,
				group: 'notebook',
				when: precondition,
				order: order,
			}],
			toggled: toggled
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);

		if (this.toggleOutputs !== undefined) {
			const oldValue = configurationService.getValue('notebook.diff.ignoreOutputs');
			configurationService.updateValue('notebook.diff.ignoreOutputs', !oldValue);
		}

		if (this.toggleMetadata !== undefined) {
			const oldValue = configurationService.getValue('notebook.diff.ignoreMetadata');
			configurationService.updateValue('notebook.diff.ignoreMetadata', !oldValue);
		}
	}
}

registerAction2(class extends ToggleRenderAction {
	constructor() {
		super('notebook.diff.showOutputs',
			localize2('notebook.diff.showOutputs', 'Show Outputs Differences'),
			ContextKeyExpr.or(ActiveEditorContext.isEqualTo(NotebookTextDiffEditor.ID), ActiveEditorContext.isEqualTo(NotebookMultiTextDiffEditor.ID)),
			ContextKeyExpr.notEquals('config.notebook.diff.ignoreOutputs', true),
			2,
			true,
			undefined
		);
	}
});

registerAction2(class extends ToggleRenderAction {
	constructor() {
		super('notebook.diff.showMetadata',
			localize2('notebook.diff.showMetadata', 'Show Metadata Differences'),
			ContextKeyExpr.or(ActiveEditorContext.isEqualTo(NotebookTextDiffEditor.ID), ActiveEditorContext.isEqualTo(NotebookMultiTextDiffEditor.ID)),
			ContextKeyExpr.notEquals('config.notebook.diff.ignoreMetadata', true),
			1,
			undefined,
			true
		);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super(
			{
				id: 'notebook.diff.action.previous',
				title: localize('notebook.diff.action.previous.title', "Show Previous Change"),
				icon: previousChangeIcon,
				f1: false,
				keybinding: {
					primary: KeyMod.Shift | KeyMod.Alt | KeyCode.F3,
					weight: KeybindingWeight.WorkbenchContrib,
					when: ActiveEditorContext.isEqualTo(NotebookTextDiffEditor.ID)
				},
				menu: {
					id: MenuId.EditorTitle,
					group: 'navigation',
					when: ActiveEditorContext.isEqualTo(NotebookTextDiffEditor.ID)
				}
			}
		);
	}
	run(accessor: ServicesAccessor) {
		const editorService: IEditorService = accessor.get(IEditorService);
		if (editorService.activeEditorPane?.getId() !== NOTEBOOK_DIFF_EDITOR_ID) {
			return;
		}

		const editor = editorService.activeEditorPane.getControl() as INotebookTextDiffEditor | undefined;
		editor?.previousChange();
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super(
			{
				id: 'notebook.diff.action.next',
				title: localize('notebook.diff.action.next.title', "Show Next Change"),
				icon: nextChangeIcon,
				f1: false,
				keybinding: {
					primary: KeyMod.Alt | KeyCode.F3,
					weight: KeybindingWeight.WorkbenchContrib,
					when: ActiveEditorContext.isEqualTo(NotebookTextDiffEditor.ID)
				},
				menu: {
					id: MenuId.EditorTitle,
					group: 'navigation',
					when: ActiveEditorContext.isEqualTo(NotebookTextDiffEditor.ID)
				}
			}
		);
	}
	run(accessor: ServicesAccessor) {
		const editorService: IEditorService = accessor.get(IEditorService);
		if (editorService.activeEditorPane?.getId() !== NOTEBOOK_DIFF_EDITOR_ID) {
			return;
		}

		const editor = editorService.activeEditorPane.getControl() as INotebookTextDiffEditor | undefined;
		editor?.nextChange();
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super(
			{
				id: 'notebook.diff.inline.toggle',
				title: localize('notebook.diff.inline.toggle.title', "Toggle Inline View"),
				menu: {
					id: MenuId.EditorTitle,
					group: '1_diff',
					order: 10,
					when: ContextKeyExpr.and(ActiveEditorContext.isEqualTo(NotebookTextDiffEditor.ID),
						ContextKeyExpr.equals('config.notebook.diff.experimental.toggleInline', true),
						ctxHasEditorModification.negate(), ctxHasRequestInProgress.negate())
				}
			}
		);
	}
	run(accessor: ServicesAccessor) {
		const editorService: IEditorService = accessor.get(IEditorService);
		if (editorService.activeEditorPane?.getId() !== NOTEBOOK_DIFF_EDITOR_ID) {
			return;
		}

		const editor = editorService.activeEditorPane.getControl() as INotebookTextDiffEditor | undefined;
		editor?.toggleInlineView();
	}
});



Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	id: 'notebook',
	order: 100,
	type: 'object',
	'properties': {
		'notebook.diff.ignoreMetadata': {
			type: 'boolean',
			default: false,
			markdownDescription: localize('notebook.diff.ignoreMetadata', "Hide Metadata Differences")
		},
		'notebook.diff.ignoreOutputs': {
			type: 'boolean',
			default: false,
			markdownDescription: localize('notebook.diff.ignoreOutputs', "Hide Outputs Differences")
		},
		'notebook.diff.experimental.toggleInline': {
			type: 'boolean',
			default: typeof product.quality === 'string' && product.quality !== 'stable', // only enable as default in insiders
			markdownDescription: localize('notebook.diff.toggleInline', "Enable the command to toggle the experimental notebook inline diff editor.")
		},
	}
});
```

--------------------------------------------------------------------------------

````
