---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 420
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 420 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/notebookDiffEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/notebookDiffEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../../nls.js';
import * as DOM from '../../../../../base/browser/dom.js';
import { findLastIdx } from '../../../../../base/common/arraysFind.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IThemeService, registerThemingParticipant } from '../../../../../platform/theme/common/themeService.js';
import { EditorPaneSelectionChangeReason, EditorPaneSelectionCompareResult, IEditorOpenContext, IEditorPaneScrollPosition, IEditorPaneSelection, IEditorPaneSelectionChangeEvent, IEditorPaneWithScrolling, IEditorPaneWithSelection } from '../../../../common/editor.js';
import { getDefaultNotebookCreationOptions } from '../notebookEditorWidget.js';
import { IEditorGroup } from '../../../../services/editor/common/editorGroupsService.js';
import { NotebookDiffEditorInput } from '../../common/notebookDiffEditorInput.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { DiffElementCellViewModelBase, IDiffElementViewModelBase, SideBySideDiffElementViewModel } from './diffElementViewModel.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { CellDiffPlaceholderRenderer, CellDiffSideBySideRenderer, CellDiffSingleSideRenderer, NotebookCellTextDiffListDelegate, NotebookDocumentMetadataDiffRenderer, NotebookTextDiffList } from './notebookDiffList.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { diffDiagonalFill, editorBackground, focusBorder, foreground } from '../../../../../platform/theme/common/colorRegistry.js';
import { INotebookEditorWorkerService } from '../../common/services/notebookWorkerService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IEditorOptions as ICodeEditorOptions } from '../../../../../editor/common/config/editorOptions.js';
import { FontInfo } from '../../../../../editor/common/config/fontInfo.js';
import { createBareFontInfoFromRawSettings } from '../../../../../editor/common/config/fontInfoFromSettings.js';
import { PixelRatio } from '../../../../../base/browser/pixelRatio.js';
import { CellEditState, ICellOutputViewModel, IDisplayOutputLayoutUpdateRequest, IGenericCellViewModel, IInsetRenderOutput, INotebookEditorCreationOptions, INotebookEditorOptions } from '../notebookBrowser.js';
import { DiffSide, DIFF_CELL_MARGIN, IDiffCellInfo, INotebookTextDiffEditor, INotebookDiffViewModel } from './notebookDiffEditorBrowser.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { DisposableStore, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { EditorPane } from '../../../../browser/parts/editor/editorPane.js';
import { CellUri, INotebookDiffEditorModel, NOTEBOOK_DIFF_EDITOR_ID, NotebookSetting } from '../../common/notebookCommon.js';
import { URI } from '../../../../../base/common/uri.js';
import { SequencerByKey } from '../../../../../base/common/async.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { IMouseWheelEvent, StandardMouseEvent } from '../../../../../base/browser/mouseEvent.js';
import { DiffNestedCellViewModel } from './diffNestedCellViewModel.js';
import { BackLayerWebView, INotebookDelegateForWebview } from '../view/renderers/backLayerWebView.js';
import { NotebookDiffEditorEventDispatcher, NotebookDiffLayoutChangedEvent } from './eventDispatcher.js';
import { FontMeasurements } from '../../../../../editor/browser/config/fontMeasurements.js';
import { NotebookOptions } from '../notebookOptions.js';
import { NotebookLayoutInfo } from '../notebookViewEvents.js';
import { IEditorOptions } from '../../../../../platform/editor/common/editor.js';
import { cellIndexesToRanges, cellRangesToIndexes } from '../../common/notebookRange.js';
import { NotebookDiffOverviewRuler } from './notebookDiffOverviewRuler.js';
import { registerZIndex, ZIndex } from '../../../../../platform/layout/browser/zIndexRegistry.js';
import { NotebookDiffViewModel } from './notebookDiffViewModel.js';
import { INotebookService } from '../../common/notebookService.js';
import { DiffEditorHeightCalculatorService, IDiffEditorHeightCalculatorService } from './editorHeightCalculator.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { NotebookInlineDiffWidget } from './inlineDiff/notebookInlineDiffWidget.js';
import { IObservable, observableValue } from '../../../../../base/common/observable.js';

const $ = DOM.$;

class NotebookDiffEditorSelection implements IEditorPaneSelection {

	constructor(
		private readonly selections: number[]
	) { }

	compare(other: IEditorPaneSelection): EditorPaneSelectionCompareResult {
		if (!(other instanceof NotebookDiffEditorSelection)) {
			return EditorPaneSelectionCompareResult.DIFFERENT;
		}

		if (this.selections.length !== other.selections.length) {
			return EditorPaneSelectionCompareResult.DIFFERENT;
		}

		for (let i = 0; i < this.selections.length; i++) {
			if (this.selections[i] !== other.selections[i]) {
				return EditorPaneSelectionCompareResult.DIFFERENT;
			}
		}

		return EditorPaneSelectionCompareResult.IDENTICAL;
	}

	restore(options: IEditorOptions): INotebookEditorOptions {
		const notebookOptions: INotebookEditorOptions = {
			cellSelections: cellIndexesToRanges(this.selections)
		};

		Object.assign(notebookOptions, options);
		return notebookOptions;
	}
}

export class NotebookTextDiffEditor extends EditorPane implements INotebookTextDiffEditor, INotebookDelegateForWebview, IEditorPaneWithSelection, IEditorPaneWithScrolling {
	public static readonly ENTIRE_DIFF_OVERVIEW_WIDTH = 30;
	creationOptions: INotebookEditorCreationOptions = getDefaultNotebookCreationOptions();
	static readonly ID: string = NOTEBOOK_DIFF_EDITOR_ID;

	private _rootElement!: HTMLElement;
	private _listViewContainer!: HTMLElement;
	private _overflowContainer!: HTMLElement;
	private _overviewRulerContainer!: HTMLElement;
	private _overviewRuler!: NotebookDiffOverviewRuler;
	private _dimension: DOM.Dimension | undefined = undefined;
	private notebookDiffViewModel?: INotebookDiffViewModel;
	private _list!: NotebookTextDiffList;
	private _modifiedWebview: BackLayerWebView<IDiffCellInfo> | null = null;
	private _originalWebview: BackLayerWebView<IDiffCellInfo> | null = null;
	private _webviewTransparentCover: HTMLElement | null = null;
	private _fontInfo: FontInfo | undefined;
	private _inlineView = false;
	private _lastLayoutProperties: { dimension: DOM.Dimension; position: DOM.IDomPosition } | undefined;

	private readonly _onMouseUp = this._register(new Emitter<{ readonly event: MouseEvent; readonly target: IDiffElementViewModelBase }>());
	public readonly onMouseUp = this._onMouseUp.event;
	private readonly _onDidScroll = this._register(new Emitter<void>());
	readonly onDidScroll: Event<void> = this._onDidScroll.event;
	readonly onDidChangeScroll: Event<void> = this._onDidScroll.event;
	private _eventDispatcher: NotebookDiffEditorEventDispatcher | undefined;
	protected _scopeContextKeyService!: IContextKeyService;
	private _model: INotebookDiffEditorModel | null = null;
	private readonly diffEditorCalcuator: IDiffEditorHeightCalculatorService;
	private readonly _modifiedResourceDisposableStore = this._register(new DisposableStore());
	private inlineDiffWidget: NotebookInlineDiffWidget | undefined;

	get textModel() {
		return this._model?.modified.notebook;
	}

	get inlineNotebookEditor() {
		if (this._inlineView) {
			return this.inlineDiffWidget?.editorWidget;
		}
		return undefined;
	}

	private _revealFirst: boolean;
	private readonly _insetModifyQueueByOutputId = new SequencerByKey<string>();

	protected _onDidDynamicOutputRendered = this._register(new Emitter<{ cell: IGenericCellViewModel; output: ICellOutputViewModel }>());
	onDidDynamicOutputRendered = this._onDidDynamicOutputRendered.event;

	private readonly _notebookOptions: NotebookOptions;

	get notebookOptions() {
		return this._notebookOptions;
	}

	private readonly _localStore = this._register(new DisposableStore());

	private _layoutCancellationTokenSource?: CancellationTokenSource;

	private readonly _onDidChangeSelection = this._register(new Emitter<IEditorPaneSelectionChangeEvent>());
	readonly onDidChangeSelection = this._onDidChangeSelection.event;

	private _isDisposed: boolean = false;

	get isDisposed() {
		return this._isDisposed;
	}
	private readonly _currentChangedIndex = observableValue(this, -1);
	readonly currentChangedIndex: IObservable<number> = this._currentChangedIndex;

	constructor(
		group: IEditorGroup,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@INotebookEditorWorkerService private readonly notebookEditorWorkerService: INotebookEditorWorkerService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IStorageService storageService: IStorageService,
		@INotebookService private readonly notebookService: INotebookService,
		@IEditorService private readonly editorService: IEditorService,
	) {
		super(NotebookTextDiffEditor.ID, group, telemetryService, themeService, storageService);
		this.diffEditorCalcuator = this.instantiationService.createInstance(DiffEditorHeightCalculatorService, this.fontInfo.lineHeight);
		this._notebookOptions = instantiationService.createInstance(NotebookOptions, this.window, false, undefined);
		this._register(this._notebookOptions);
		this._revealFirst = true;
	}

	private get fontInfo() {
		if (!this._fontInfo) {
			this._fontInfo = this.createFontInfo();
		}

		return this._fontInfo;
	}

	private createFontInfo() {
		const editorOptions = this.configurationService.getValue<ICodeEditorOptions>('editor');
		return FontMeasurements.readFontInfo(this.window, createBareFontInfoFromRawSettings(editorOptions, PixelRatio.getInstance(this.window).value));
	}

	private isOverviewRulerEnabled(): boolean {
		return this.configurationService.getValue(NotebookSetting.diffOverviewRuler) ?? false;
	}

	getSelection(): IEditorPaneSelection | undefined {
		const selections = this._list.getFocus();
		return new NotebookDiffEditorSelection(selections);
	}

	toggleNotebookCellSelection(cell: IGenericCellViewModel) {
		// throw new Error('Method not implemented.');
	}

	updatePerformanceMetadata(cellId: string, executionId: string, duration: number, rendererId: string): void {
		// throw new Error('Method not implemented.');
	}

	async focusNotebookCell(cell: IGenericCellViewModel, focus: 'output' | 'editor' | 'container'): Promise<void> {
		// throw new Error('Method not implemented.');
	}

	async focusNextNotebookCell(cell: IGenericCellViewModel, focus: 'output' | 'editor' | 'container'): Promise<void> {
		// throw new Error('Method not implemented.');
	}

	didFocusOutputInputChange(inputFocused: boolean): void {
		// noop
	}

	getScrollTop() {
		return this._list?.scrollTop ?? 0;
	}

	getScrollHeight() {
		return this._list?.scrollHeight ?? 0;
	}

	getScrollPosition(): IEditorPaneScrollPosition {
		return {
			scrollTop: this.getScrollTop(),
			scrollLeft: this._list?.scrollLeft ?? 0
		};
	}

	setScrollPosition(scrollPosition: IEditorPaneScrollPosition): void {
		if (!this._list) {
			return;
		}

		this._list.scrollTop = scrollPosition.scrollTop;
		if (scrollPosition.scrollLeft !== undefined) {
			this._list.scrollLeft = scrollPosition.scrollLeft;
		}
	}

	delegateVerticalScrollbarPointerDown(browserEvent: PointerEvent) {
		this._list?.delegateVerticalScrollbarPointerDown(browserEvent);
	}

	updateOutputHeight(cellInfo: IDiffCellInfo, output: ICellOutputViewModel, outputHeight: number, isInit: boolean): void {
		const diffElement = cellInfo.diffElement;
		const cell = this.getCellByInfo(cellInfo);
		const outputIndex = cell.outputsViewModels.indexOf(output);

		if (diffElement instanceof SideBySideDiffElementViewModel) {
			const info = CellUri.parse(cellInfo.cellUri);
			if (!info) {
				return;
			}

			diffElement.updateOutputHeight(info.notebook.toString() === this._model?.original.resource.toString() ? DiffSide.Original : DiffSide.Modified, outputIndex, outputHeight);
		} else {
			diffElement.updateOutputHeight(diffElement.type === 'insert' ? DiffSide.Modified : DiffSide.Original, outputIndex, outputHeight);
		}

		if (isInit) {
			this._onDidDynamicOutputRendered.fire({ cell, output });
		}
	}

	setMarkupCellEditState(cellId: string, editState: CellEditState): void {
		// throw new Error('Method not implemented.');
	}
	didStartDragMarkupCell(cellId: string, event: { dragOffsetY: number }): void {
		// throw new Error('Method not implemented.');
	}
	didDragMarkupCell(cellId: string, event: { dragOffsetY: number }): void {
		// throw new Error('Method not implemented.');
	}
	didEndDragMarkupCell(cellId: string): void {
		// throw new Error('Method not implemented.');
	}
	didDropMarkupCell(cellId: string) {
		// throw new Error('Method not implemented.');
	}
	didResizeOutput(cellId: string): void {
		// throw new Error('Method not implemented.');
	}

	async toggleInlineView(): Promise<void> {
		this._layoutCancellationTokenSource?.dispose();

		this._inlineView = !this._inlineView;

		if (!this._lastLayoutProperties) {
			return;
		}

		if (this._inlineView) {
			this.layout(this._lastLayoutProperties?.dimension, this._lastLayoutProperties?.position);
			this.inlineDiffWidget?.show(this.input as NotebookDiffEditorInput, this._model?.modified.notebook, this._model?.original.notebook, this._options as INotebookEditorOptions | undefined);
		} else {
			this.layout(this._lastLayoutProperties?.dimension, this._lastLayoutProperties?.position);
			this.inlineDiffWidget?.hide();
		}

		this._layoutCancellationTokenSource = new CancellationTokenSource();
		this.updateLayout(this._layoutCancellationTokenSource.token);
	}

	protected createEditor(parent: HTMLElement): void {
		this._rootElement = DOM.append(parent, DOM.$('.notebook-text-diff-editor'));
		this._overflowContainer = document.createElement('div');
		this._overflowContainer.classList.add('notebook-overflow-widget-container', 'monaco-editor');
		DOM.append(parent, this._overflowContainer);

		const renderers = [
			this.instantiationService.createInstance(CellDiffSingleSideRenderer, this),
			this.instantiationService.createInstance(CellDiffSideBySideRenderer, this),
			this.instantiationService.createInstance(CellDiffPlaceholderRenderer, this),
			this.instantiationService.createInstance(NotebookDocumentMetadataDiffRenderer, this),
		];

		this._listViewContainer = DOM.append(this._rootElement, DOM.$('.notebook-diff-list-view'));

		this._list = this.instantiationService.createInstance(
			NotebookTextDiffList,
			'NotebookTextDiff',
			this._listViewContainer,
			this.instantiationService.createInstance(NotebookCellTextDiffListDelegate, this.window),
			renderers,
			this.contextKeyService,
			{
				setRowLineHeight: false,
				setRowHeight: false,
				supportDynamicHeights: true,
				horizontalScrolling: false,
				keyboardSupport: false,
				mouseSupport: true,
				multipleSelectionSupport: false,
				typeNavigationEnabled: true,
				paddingBottom: 0,
				// transformOptimization: (isMacintosh && isNative) || getTitleBarStyle(this.configurationService, this.environmentService) === 'native',
				styleController: (_suffix: string) => { return this._list; },
				overrideStyles: {
					listBackground: editorBackground,
					listActiveSelectionBackground: editorBackground,
					listActiveSelectionForeground: foreground,
					listFocusAndSelectionBackground: editorBackground,
					listFocusAndSelectionForeground: foreground,
					listFocusBackground: editorBackground,
					listFocusForeground: foreground,
					listHoverForeground: foreground,
					listHoverBackground: editorBackground,
					listHoverOutline: focusBorder,
					listFocusOutline: focusBorder,
					listInactiveSelectionBackground: editorBackground,
					listInactiveSelectionForeground: foreground,
					listInactiveFocusBackground: editorBackground,
					listInactiveFocusOutline: editorBackground,
				},
				accessibilityProvider: {
					getAriaLabel() { return null; },
					getWidgetAriaLabel() {
						return nls.localize('notebookTreeAriaLabel', "Notebook Text Diff");
					}
				},
				// focusNextPreviousDelegate: {
				// 	onFocusNext: (applyFocusNext: () => void) => this._updateForCursorNavigationMode(applyFocusNext),
				// 	onFocusPrevious: (applyFocusPrevious: () => void) => this._updateForCursorNavigationMode(applyFocusPrevious),
				// }
			}
		);

		this.inlineDiffWidget = this._register(this.instantiationService.createInstance(NotebookInlineDiffWidget, this._rootElement, this.group.id, this.window, this.notebookOptions, this._dimension));

		this._register(this._list);
		this._register(this._list.onMouseUp(e => {
			if (e.element) {
				if (typeof e.index === 'number') {
					this._list.setFocus([e.index]);
				}
				this._onMouseUp.fire({ event: e.browserEvent, target: e.element });
			}
		}));

		this._register(this._list.onDidScroll(() => {
			this._onDidScroll.fire();
		}));

		this._register(this._list.onDidChangeFocus(() => this._onDidChangeSelection.fire({ reason: EditorPaneSelectionChangeReason.USER })));

		this._overviewRulerContainer = document.createElement('div');
		this._overviewRulerContainer.classList.add('notebook-overview-ruler-container');
		this._rootElement.appendChild(this._overviewRulerContainer);
		this._registerOverviewRuler();

		// transparent cover
		this._webviewTransparentCover = DOM.append(this._list.rowsContainer, $('.webview-cover'));
		this._webviewTransparentCover.style.display = 'none';

		this._register(DOM.addStandardDisposableGenericMouseDownListener(this._overflowContainer, (e: StandardMouseEvent) => {
			if (e.target.classList.contains('slider') && this._webviewTransparentCover) {
				this._webviewTransparentCover.style.display = 'block';
			}
		}));

		this._register(DOM.addStandardDisposableGenericMouseUpListener(this._overflowContainer, () => {
			if (this._webviewTransparentCover) {
				// no matter when
				this._webviewTransparentCover.style.display = 'none';
			}
		}));

		this._register(this._list.onDidScroll(e => {
			this._webviewTransparentCover!.style.top = `${e.scrollTop}px`;
		}));
	}

	private _registerOverviewRuler() {
		this._overviewRuler = this._register(this.instantiationService.createInstance(NotebookDiffOverviewRuler, this, NotebookTextDiffEditor.ENTIRE_DIFF_OVERVIEW_WIDTH, this._overviewRulerContainer));
	}

	private _updateOutputsOffsetsInWebview(scrollTop: number, scrollHeight: number, activeWebview: BackLayerWebView<IDiffCellInfo>, getActiveNestedCell: (diffElement: DiffElementCellViewModelBase) => DiffNestedCellViewModel | undefined, diffSide: DiffSide) {
		activeWebview.element.style.height = `${scrollHeight}px`;

		if (activeWebview.insetMapping) {
			const updateItems: IDisplayOutputLayoutUpdateRequest[] = [];
			const removedItems: ICellOutputViewModel[] = [];
			activeWebview.insetMapping.forEach((value, key) => {
				const cell = getActiveNestedCell(value.cellInfo.diffElement);
				if (!cell) {
					return;
				}

				const viewIndex = this._list.indexOf(value.cellInfo.diffElement);

				if (viewIndex === undefined) {
					return;
				}

				if (cell.outputsViewModels.indexOf(key) < 0) {
					// output is already gone
					removedItems.push(key);
				} else {
					const cellTop = this._list.getCellViewScrollTop(value.cellInfo.diffElement);
					const outputIndex = cell.outputsViewModels.indexOf(key);
					const outputOffset = value.cellInfo.diffElement.getOutputOffsetInCell(diffSide, outputIndex);
					updateItems.push({
						cell,
						output: key,
						cellTop: cellTop,
						outputOffset: outputOffset,
						forceDisplay: false
					});
				}

			});

			activeWebview.removeInsets(removedItems);

			if (updateItems.length) {
				activeWebview.updateScrollTops(updateItems, []);
			}
		}
	}

	override async setInput(input: NotebookDiffEditorInput, options: INotebookEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		this.inlineDiffWidget?.hide();

		await super.setInput(input, options, context, token);

		const model = await input.resolve();
		if (this._model !== model) {
			this._detachModel();
			this._attachModel(model);
		}

		this._model = model;
		if (this._model === null) {
			return;
		}

		if (this._inlineView) {
			this._listViewContainer.style.display = 'none';
			this.inlineDiffWidget?.show(input, model.modified.notebook, model.original.notebook, options);
		} else {
			this._listViewContainer.style.display = 'block';
			this.inlineDiffWidget?.hide();
		}

		this._revealFirst = true;

		this._modifiedResourceDisposableStore.clear();

		this._layoutCancellationTokenSource = new CancellationTokenSource();

		this._modifiedResourceDisposableStore.add(Event.any(this._model.original.notebook.onDidChangeContent, this._model.modified.notebook.onDidChangeContent)(e => {
			// If the user has made changes to the notebook whilst in the diff editor,
			// then do not re-compute the diff of the notebook,
			// As change will result in re-computing diff and re-building entire diff view.
			if (this._model !== null && this.editorService.activeEditor !== input) {
				this._layoutCancellationTokenSource?.dispose();
				this._layoutCancellationTokenSource = new CancellationTokenSource();
				this.updateLayout(this._layoutCancellationTokenSource.token);
			}
		}));

		await this._createOriginalWebview(generateUuid(), this._model.original.viewType, this._model.original.resource);
		if (this._originalWebview) {
			this._modifiedResourceDisposableStore.add(this._originalWebview);
		}
		await this._createModifiedWebview(generateUuid(), this._model.modified.viewType, this._model.modified.resource);
		if (this._modifiedWebview) {
			this._modifiedResourceDisposableStore.add(this._modifiedWebview);
		}

		await this.updateLayout(this._layoutCancellationTokenSource.token, options?.cellSelections ? cellRangesToIndexes(options.cellSelections) : undefined);
	}

	override setVisible(visible: boolean): void {
		super.setVisible(visible);
		if (!visible) {
			this.inlineDiffWidget?.hide();
		}
	}

	private _detachModel() {
		this._localStore.clear();
		this._originalWebview?.dispose();
		this._originalWebview?.element.remove();
		this._originalWebview = null;
		this._modifiedWebview?.dispose();
		this._modifiedWebview?.element.remove();
		this._modifiedWebview = null;

		this.notebookDiffViewModel?.dispose();
		this.notebookDiffViewModel = undefined;

		this._modifiedResourceDisposableStore.clear();
		this._list.clear();

	}
	private _attachModel(model: INotebookDiffEditorModel) {
		this._model = model;
		this._eventDispatcher = new NotebookDiffEditorEventDispatcher();
		const updateInsets = () => {
			DOM.scheduleAtNextAnimationFrame(this.window, () => {
				if (this._isDisposed) {
					return;
				}

				if (this._modifiedWebview) {
					this._updateOutputsOffsetsInWebview(this._list.scrollTop, this._list.scrollHeight, this._modifiedWebview, (diffElement: DiffElementCellViewModelBase) => {
						return diffElement.modified;
					}, DiffSide.Modified);
				}

				if (this._originalWebview) {
					this._updateOutputsOffsetsInWebview(this._list.scrollTop, this._list.scrollHeight, this._originalWebview, (diffElement: DiffElementCellViewModelBase) => {
						return diffElement.original;
					}, DiffSide.Original);
				}
			});
		};

		this._localStore.add(this._list.onDidChangeContentHeight(() => {
			updateInsets();
		}));

		this._localStore.add(this._list.onDidChangeFocus((e) => {
			if (e.indexes.length && this.notebookDiffViewModel && e.indexes[0] < this.notebookDiffViewModel.items.length) {
				const selectedItem = this.notebookDiffViewModel.items[e.indexes[0]];
				const changedItems = this.notebookDiffViewModel.items.filter(item => item.type !== 'unchanged' && item.type !== 'unchangedMetadata' && item.type !== 'placeholder');
				if (selectedItem && selectedItem?.type !== 'placeholder' && selectedItem?.type !== 'unchanged' && selectedItem?.type !== 'unchangedMetadata') {
					return this._currentChangedIndex.set(changedItems.indexOf(selectedItem), undefined);
				}
			}
			return this._currentChangedIndex.set(-1, undefined);
		}));

		this._localStore.add(this._eventDispatcher.onDidChangeCellLayout(() => {
			updateInsets();
		}));

		const vm = this.notebookDiffViewModel = this._register(new NotebookDiffViewModel(this._model, this.notebookEditorWorkerService, this.configurationService, this._eventDispatcher!, this.notebookService, this.diffEditorCalcuator, this.fontInfo, undefined));
		this._localStore.add(this.notebookDiffViewModel.onDidChangeItems(e => {
			this._originalWebview?.removeInsets([...this._originalWebview?.insetMapping.keys()]);
			this._modifiedWebview?.removeInsets([...this._modifiedWebview?.insetMapping.keys()]);

			if (this._revealFirst && typeof e.firstChangeIndex === 'number' && e.firstChangeIndex > -1 && e.firstChangeIndex < this._list.length) {
				this._revealFirst = false;
				this._list.setFocus([e.firstChangeIndex]);
				this._list.reveal(e.firstChangeIndex, 0.3);
			}

			this._list.splice(e.start, e.deleteCount, e.elements);

			if (this.isOverviewRulerEnabled()) {
				this._overviewRuler.updateViewModels(vm.items, this._eventDispatcher);
			}
		}));
	}

	private async _createModifiedWebview(id: string, viewType: string, resource: URI): Promise<void> {
		this._modifiedWebview?.dispose();

		this._modifiedWebview = this.instantiationService.createInstance(BackLayerWebView, this, id, viewType, resource, {
			...this._notebookOptions.computeDiffWebviewOptions(),
			fontFamily: this._generateFontFamily()
		}, undefined) as BackLayerWebView<IDiffCellInfo>;
		// attach the webview container to the DOM tree first
		this._list.rowsContainer.insertAdjacentElement('afterbegin', this._modifiedWebview.element);
		this._modifiedWebview.createWebview(this.window);
		this._modifiedWebview.element.style.width = `calc(50% - 16px)`;
		this._modifiedWebview.element.style.left = `calc(50%)`;
	}
	_generateFontFamily(): string {
		return this.fontInfo.fontFamily ?? `"SF Mono", Monaco, Menlo, Consolas, "Ubuntu Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace`;
	}

	private async _createOriginalWebview(id: string, viewType: string, resource: URI): Promise<void> {
		this._originalWebview?.dispose();

		this._originalWebview = this.instantiationService.createInstance(BackLayerWebView, this, id, viewType, resource, {
			...this._notebookOptions.computeDiffWebviewOptions(),
			fontFamily: this._generateFontFamily()
		}, undefined) as BackLayerWebView<IDiffCellInfo>;
		// attach the webview container to the DOM tree first
		this._list.rowsContainer.insertAdjacentElement('afterbegin', this._originalWebview.element);
		this._originalWebview.createWebview(this.window);
		this._originalWebview.element.style.width = `calc(50% - 16px)`;
		this._originalWebview.element.style.left = `16px`;
	}

	override setOptions(options: INotebookEditorOptions | undefined): void {
		const selections = options?.cellSelections ? cellRangesToIndexes(options.cellSelections) : undefined;
		if (selections) {
			this._list.setFocus(selections);
		}
	}

	async updateLayout(token: CancellationToken, selections?: number[]) {
		if (!this._model || !this.notebookDiffViewModel) {
			return;
		}

		await this.notebookDiffViewModel.computeDiff(token);
		if (token.isCancellationRequested) {
			// after await the editor might be disposed.
			return;
		}

		if (selections) {
			this._list.setFocus(selections);
		}
	}

	scheduleOutputHeightAck(cellInfo: IDiffCellInfo, outputId: string, height: number) {
		const diffElement = cellInfo.diffElement;
		// const activeWebview = diffSide === DiffSide.Modified ? this._modifiedWebview : this._originalWebview;
		let diffSide = DiffSide.Original;

		if (diffElement instanceof SideBySideDiffElementViewModel) {
			const info = CellUri.parse(cellInfo.cellUri);
			if (!info) {
				return;
			}

			diffSide = info.notebook.toString() === this._model?.original.resource.toString() ? DiffSide.Original : DiffSide.Modified;
		} else {
			diffSide = diffElement.type === 'insert' ? DiffSide.Modified : DiffSide.Original;
		}

		const webview = diffSide === DiffSide.Modified ? this._modifiedWebview : this._originalWebview;

		DOM.scheduleAtNextAnimationFrame(this.window, () => {
			webview?.ackHeight([{ cellId: cellInfo.cellId, outputId, height }]);
		}, 10);
	}

	private pendingLayouts = new WeakMap<IDiffElementViewModelBase, IDisposable>();


	layoutNotebookCell(cell: IDiffElementViewModelBase, height: number) {
		const relayout = (cell: IDiffElementViewModelBase, height: number) => {
			this._list.updateElementHeight2(cell, height);
		};

		let disposable = this.pendingLayouts.get(cell);
		if (disposable) {
			this._localStore.delete(disposable);
		}

		let r: () => void;
		const layoutDisposable = DOM.scheduleAtNextAnimationFrame(this.window, () => {
			this.pendingLayouts.delete(cell);

			relayout(cell, height);
			r();
		});
		disposable = toDisposable(() => {
			layoutDisposable.dispose();
			r();
		});
		this._localStore.add(disposable);

		this.pendingLayouts.set(cell, disposable);

		return new Promise<void>(resolve => { r = resolve; });
	}

	setScrollTop(scrollTop: number): void {
		this._list.scrollTop = scrollTop;
	}

	triggerScroll(event: IMouseWheelEvent) {
		this._list.triggerScrollFromMouseWheelEvent(event);
	}

	firstChange(): void {
		if (!this.notebookDiffViewModel) {
			return;
		}
		// go to the first one
		const currentViewModels = this.notebookDiffViewModel.items;
		const index = currentViewModels.findIndex(vm => vm.type !== 'unchanged' && vm.type !== 'unchangedMetadata' && vm.type !== 'placeholder');
		if (index >= 0) {
			this._list.setFocus([index]);
			this._list.reveal(index);
		}
	}

	lastChange(): void {
		if (!this.notebookDiffViewModel) {
			return;
		}
		// go to the first one
		const currentViewModels = this.notebookDiffViewModel.items;
		const item = currentViewModels.slice().reverse().find(vm => vm.type !== 'unchanged' && vm.type !== 'unchangedMetadata' && vm.type !== 'placeholder');
		const index = item ? currentViewModels.indexOf(item) : -1;
		if (index >= 0) {
			this._list.setFocus([index]);
			this._list.reveal(index);
		}
	}

	previousChange(): void {
		if (!this.notebookDiffViewModel) {
			return;
		}
		let currFocus = this._list.getFocus()[0];

		if (isNaN(currFocus) || currFocus < 0) {
			currFocus = 0;
		}

		// find the index of previous change
		let prevChangeIndex = currFocus - 1;
		const currentViewModels = this.notebookDiffViewModel.items;
		while (prevChangeIndex >= 0) {
			const vm = currentViewModels[prevChangeIndex];
			if (vm.type !== 'unchanged' && vm.type !== 'unchangedMetadata' && vm.type !== 'placeholder') {
				break;
			}

			prevChangeIndex--;
		}

		if (prevChangeIndex >= 0) {
			this._list.setFocus([prevChangeIndex]);
			this._list.reveal(prevChangeIndex);
		} else {
			// go to the last one
			const index = findLastIdx(currentViewModels, vm => vm.type !== 'unchanged' && vm.type !== 'unchangedMetadata' && vm.type !== 'placeholder');
			if (index >= 0) {
				this._list.setFocus([index]);
				this._list.reveal(index);
			}
		}
	}

	nextChange(): void {
		if (!this.notebookDiffViewModel) {
			return;
		}
		let currFocus = this._list.getFocus()[0];

		if (isNaN(currFocus) || currFocus < 0) {
			currFocus = 0;
		}

		// find the index of next change
		let nextChangeIndex = currFocus + 1;
		const currentViewModels = this.notebookDiffViewModel.items;
		while (nextChangeIndex < currentViewModels.length) {
			const vm = currentViewModels[nextChangeIndex];
			if (vm.type !== 'unchanged' && vm.type !== 'unchangedMetadata' && vm.type !== 'placeholder') {
				break;
			}

			nextChangeIndex++;
		}

		if (nextChangeIndex < currentViewModels.length) {
			this._list.setFocus([nextChangeIndex]);
			this._list.reveal(nextChangeIndex);
		} else {
			// go to the first one
			const index = currentViewModels.findIndex(vm => vm.type !== 'unchanged' && vm.type !== 'unchangedMetadata' && vm.type !== 'placeholder');
			if (index >= 0) {
				this._list.setFocus([index]);
				this._list.reveal(index);
			}
		}
	}

	createOutput(cellDiffViewModel: DiffElementCellViewModelBase, cellViewModel: DiffNestedCellViewModel, output: IInsetRenderOutput, getOffset: () => number, diffSide: DiffSide): void {
		this._insetModifyQueueByOutputId.queue(output.source.model.outputId + (diffSide === DiffSide.Modified ? '-right' : 'left'), async () => {
			const activeWebview = diffSide === DiffSide.Modified ? this._modifiedWebview : this._originalWebview;
			if (!activeWebview) {
				return;
			}

			if (!activeWebview.insetMapping.has(output.source)) {
				const cellTop = this._list.getCellViewScrollTop(cellDiffViewModel);
				await activeWebview.createOutput({ diffElement: cellDiffViewModel, cellHandle: cellViewModel.handle, cellId: cellViewModel.id, cellUri: cellViewModel.uri }, output, cellTop, getOffset());
			} else {
				const cellTop = this._list.getCellViewScrollTop(cellDiffViewModel);
				const outputIndex = cellViewModel.outputsViewModels.indexOf(output.source);
				const outputOffset = cellDiffViewModel.getOutputOffsetInCell(diffSide, outputIndex);
				activeWebview.updateScrollTops([{
					cell: cellViewModel,
					output: output.source,
					cellTop,
					outputOffset,
					forceDisplay: true
				}], []);
			}
		});
	}

	updateMarkupCellHeight() {
		// TODO
	}

	getCellByInfo(cellInfo: IDiffCellInfo): IGenericCellViewModel {
		return cellInfo.diffElement.getCellByUri(cellInfo.cellUri);
	}

	getCellById(cellId: string): IGenericCellViewModel | undefined {
		throw new Error('Not implemented');
	}

	removeInset(cellDiffViewModel: DiffElementCellViewModelBase, cellViewModel: DiffNestedCellViewModel, displayOutput: ICellOutputViewModel, diffSide: DiffSide) {
		this._insetModifyQueueByOutputId.queue(displayOutput.model.outputId + (diffSide === DiffSide.Modified ? '-right' : 'left'), async () => {
			const activeWebview = diffSide === DiffSide.Modified ? this._modifiedWebview : this._originalWebview;
			if (!activeWebview) {
				return;
			}

			if (!activeWebview.insetMapping.has(displayOutput)) {
				return;
			}

			activeWebview.removeInsets([displayOutput]);
		});
	}

	showInset(cellDiffViewModel: DiffElementCellViewModelBase, cellViewModel: DiffNestedCellViewModel, displayOutput: ICellOutputViewModel, diffSide: DiffSide) {
		this._insetModifyQueueByOutputId.queue(displayOutput.model.outputId + (diffSide === DiffSide.Modified ? '-right' : 'left'), async () => {
			const activeWebview = diffSide === DiffSide.Modified ? this._modifiedWebview : this._originalWebview;
			if (!activeWebview) {
				return;
			}

			if (!activeWebview.insetMapping.has(displayOutput)) {
				return;
			}

			const cellTop = this._list.getCellViewScrollTop(cellDiffViewModel);
			const outputIndex = cellViewModel.outputsViewModels.indexOf(displayOutput);
			const outputOffset = cellDiffViewModel.getOutputOffsetInCell(diffSide, outputIndex);
			activeWebview.updateScrollTops([{
				cell: cellViewModel,
				output: displayOutput,
				cellTop,
				outputOffset,
				forceDisplay: true,
			}], []);
		});
	}

	hideInset(cellDiffViewModel: DiffElementCellViewModelBase, cellViewModel: DiffNestedCellViewModel, output: ICellOutputViewModel) {
		this._modifiedWebview?.hideInset(output);
		this._originalWebview?.hideInset(output);
	}

	// private async _resolveWebview(rightEditor: boolean): Promise<BackLayerWebView | null> {
	// 	if (rightEditor) {

	// 	}
	// }

	getDomNode() {
		return this._rootElement;
	}

	getOverflowContainerDomNode(): HTMLElement {
		return this._overflowContainer;
	}

	override getControl(): INotebookTextDiffEditor | undefined {
		return this;
	}

	override clearInput(): void {
		this.inlineDiffWidget?.hide();

		super.clearInput();

		this._modifiedResourceDisposableStore.clear();
		this._list?.splice(0, this._list?.length || 0);
		this._model = null;
		this.notebookDiffViewModel?.dispose();
		this.notebookDiffViewModel = undefined;
	}

	deltaCellOutputContainerClassNames(diffSide: DiffSide, cellId: string, added: string[], removed: string[]) {
		if (diffSide === DiffSide.Original) {
			this._originalWebview?.deltaCellOutputContainerClassNames(cellId, added, removed);
		} else {
			this._modifiedWebview?.deltaCellOutputContainerClassNames(cellId, added, removed);
		}
	}

	getLayoutInfo(): NotebookLayoutInfo {
		if (!this._list) {
			throw new Error('Editor is not initalized successfully');
		}

		return {
			width: this._dimension!.width,
			height: this._dimension!.height,
			fontInfo: this.fontInfo,
			scrollHeight: this._list?.getScrollHeight() ?? 0,
			stickyHeight: 0,
			listViewOffsetTop: 0,
		};
	}

	layout(dimension: DOM.Dimension, position: DOM.IDomPosition): void {
		this._rootElement.classList.toggle('mid-width', dimension.width < 1000 && dimension.width >= 600);
		this._rootElement.classList.toggle('narrow-width', dimension.width < 600);
		const overviewRulerEnabled = this.isOverviewRulerEnabled();
		this._dimension = dimension.with(dimension.width - (overviewRulerEnabled ? NotebookTextDiffEditor.ENTIRE_DIFF_OVERVIEW_WIDTH : 0));

		this._listViewContainer.style.height = `${dimension.height}px`;
		this._listViewContainer.style.width = `${this._dimension.width}px`;

		if (this._inlineView) {
			this._listViewContainer.style.display = 'none';
			this.inlineDiffWidget?.setLayout(dimension, position);
		} else {
			this.inlineDiffWidget?.hide();
			this._listViewContainer.style.display = 'block';
			this._list?.layout(this._dimension.height, this._dimension.width);

			if (this._modifiedWebview) {
				this._modifiedWebview.element.style.width = `calc(50% - 16px)`;
				this._modifiedWebview.element.style.left = `calc(50%)`;
			}

			if (this._originalWebview) {
				this._originalWebview.element.style.width = `calc(50% - 16px)`;
				this._originalWebview.element.style.left = `16px`;
			}

			if (this._webviewTransparentCover) {
				this._webviewTransparentCover.style.height = `${this._dimension.height}px`;
				this._webviewTransparentCover.style.width = `${this._dimension.width}px`;
			}

			if (overviewRulerEnabled) {
				this._overviewRuler.layout();
			}
		}

		this._lastLayoutProperties = { dimension, position };

		this._eventDispatcher?.emit([new NotebookDiffLayoutChangedEvent({ width: true, fontInfo: true }, this.getLayoutInfo())]);
	}

	override dispose() {
		this._isDisposed = true;
		this._layoutCancellationTokenSource?.dispose();
		this._detachModel();
		super.dispose();
	}
}

registerZIndex(ZIndex.Base, 10, 'notebook-diff-view-viewport-slider');

registerThemingParticipant((theme, collector) => {
	const diffDiagonalFillColor = theme.getColor(diffDiagonalFill);
	collector.addRule(`
	.notebook-text-diff-editor .diagonal-fill {
		background-image: linear-gradient(
			-45deg,
			${diffDiagonalFillColor} 12.5%,
			#0000 12.5%, #0000 50%,
			${diffDiagonalFillColor} 50%, ${diffDiagonalFillColor} 62.5%,
			#0000 62.5%, #0000 100%
		);
		background-size: 8px 8px;
	}
	`);

	collector.addRule(`.notebook-text-diff-editor .cell-body { margin: ${DIFF_CELL_MARGIN}px; }`);
	// We do not want a left margin, as we add an overlay for expanind the collapsed/hidden cells.
	collector.addRule(`.notebook-text-diff-editor .cell-placeholder-body { margin: ${DIFF_CELL_MARGIN}px 0; }`);
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/notebookDiffEditorBrowser.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/notebookDiffEditorBrowser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CellLayoutState, ICellOutputViewModel, ICommonCellInfo, IGenericCellViewModel, IInsetRenderOutput, INotebookEditor } from '../notebookBrowser.js';
import { DiffElementCellViewModelBase, IDiffElementViewModelBase } from './diffElementViewModel.js';
import { Event } from '../../../../../base/common/event.js';
import { BareFontInfo } from '../../../../../editor/common/config/fontInfo.js';
import { DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { CodeEditorWidget } from '../../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { IMouseWheelEvent } from '../../../../../base/browser/mouseEvent.js';
import { RawContextKey } from '../../../../../platform/contextkey/common/contextkey.js';
import { NotebookOptions } from '../notebookOptions.js';
import { NotebookLayoutInfo } from '../notebookViewEvents.js';
import { WorkbenchToolBar } from '../../../../../platform/actions/browser/toolbar.js';
import { DiffEditorWidget } from '../../../../../editor/browser/widget/diffEditor/diffEditorWidget.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { localize } from '../../../../../nls.js';
import { IObservable } from '../../../../../base/common/observable.js';

export enum DiffSide {
	Original = 0,
	Modified = 1
}

export interface IDiffCellInfo extends ICommonCellInfo {
	diffElement: DiffElementCellViewModelBase;
}

export interface INotebookTextDiffEditor {
	notebookOptions: NotebookOptions;
	readonly textModel?: NotebookTextModel;
	inlineNotebookEditor: INotebookEditor | undefined;
	readonly currentChangedIndex: IObservable<number>;
	readonly onMouseUp: Event<{ readonly event: MouseEvent; readonly target: IDiffElementViewModelBase }>;
	readonly onDidScroll: Event<void>;
	readonly onDidDynamicOutputRendered: Event<{ cell: IGenericCellViewModel; output: ICellOutputViewModel }>;
	getOverflowContainerDomNode(): HTMLElement;
	getLayoutInfo(): NotebookLayoutInfo;
	getScrollTop(): number;
	getScrollHeight(): number;
	layoutNotebookCell(cell: IDiffElementViewModelBase, height: number): void;
	createOutput(cellDiffViewModel: DiffElementCellViewModelBase, cellViewModel: IDiffNestedCellViewModel, output: IInsetRenderOutput, getOffset: () => number, diffSide: DiffSide): void;
	showInset(cellDiffViewModel: DiffElementCellViewModelBase, cellViewModel: IDiffNestedCellViewModel, displayOutput: ICellOutputViewModel, diffSide: DiffSide): void;
	removeInset(cellDiffViewModel: DiffElementCellViewModelBase, cellViewModel: IDiffNestedCellViewModel, output: ICellOutputViewModel, diffSide: DiffSide): void;
	hideInset(cellDiffViewModel: DiffElementCellViewModelBase, cellViewModel: IDiffNestedCellViewModel, output: ICellOutputViewModel): void;
	/**
	 * Trigger the editor to scroll from scroll event programmatically
	 */
	triggerScroll(event: IMouseWheelEvent): void;
	delegateVerticalScrollbarPointerDown(browserEvent: PointerEvent): void;
	getCellByInfo(cellInfo: ICommonCellInfo): IGenericCellViewModel;
	focusNotebookCell(cell: IGenericCellViewModel, focus: 'editor' | 'container' | 'output'): Promise<void>;
	focusNextNotebookCell(cell: IGenericCellViewModel, focus: 'editor' | 'container' | 'output'): Promise<void>;
	updateOutputHeight(cellInfo: ICommonCellInfo, output: ICellOutputViewModel, height: number, isInit: boolean): void;
	deltaCellOutputContainerClassNames(diffSide: DiffSide, cellId: string, added: string[], removed: string[]): void;
	firstChange(): void;
	lastChange(): void;
	previousChange(): void;
	nextChange(): void;
	toggleInlineView(): void;
}

export interface IDiffNestedCellViewModel {

}

export interface CellDiffCommonRenderTemplate {
	readonly leftBorder: HTMLElement;
	readonly rightBorder: HTMLElement;
	readonly topBorder: HTMLElement;
	readonly bottomBorder: HTMLElement;
}

export interface CellDiffPlaceholderRenderTemplate {
	readonly container: HTMLElement;
	readonly placeholder: HTMLElement;
	readonly body: HTMLElement;
	readonly marginOverlay: IDiffCellMarginOverlay;
	readonly elementDisposables: DisposableStore;
}

export interface CellDiffSingleSideRenderTemplate extends CellDiffCommonRenderTemplate {
	readonly container: HTMLElement;
	readonly body: HTMLElement;
	readonly diffEditorContainer: HTMLElement;
	readonly diagonalFill: HTMLElement;
	readonly elementDisposables: DisposableStore;
	readonly cellHeaderContainer: HTMLElement;
	readonly editorContainer: HTMLElement;
	readonly sourceEditor: CodeEditorWidget;
	readonly metadataHeaderContainer: HTMLElement;
	readonly metadataInfoContainer: HTMLElement;
	readonly outputHeaderContainer: HTMLElement;
	readonly outputInfoContainer: HTMLElement;
}


export interface NotebookDocumentDiffElementRenderTemplate extends CellDiffCommonRenderTemplate {
	readonly container: HTMLElement;
	readonly body: HTMLElement;
	readonly diffEditorContainer: HTMLElement;
	readonly elementDisposables: DisposableStore;
	readonly cellHeaderContainer: HTMLElement;
	readonly sourceEditor: DiffEditorWidget;
	readonly editorContainer: HTMLElement;
	readonly inputToolbarContainer: HTMLElement;
	readonly toolbar: WorkbenchToolBar;
	readonly marginOverlay: IDiffCellMarginOverlay;
}

export interface IDiffCellMarginOverlay extends IDisposable {
	readonly onAction: Event<void>;
	show(): void;
	hide(): void;
}

export interface CellDiffSideBySideRenderTemplate extends CellDiffCommonRenderTemplate {
	readonly container: HTMLElement;
	readonly body: HTMLElement;
	readonly diffEditorContainer: HTMLElement;
	readonly elementDisposables: DisposableStore;
	readonly cellHeaderContainer: HTMLElement;
	readonly sourceEditor: DiffEditorWidget;
	readonly editorContainer: HTMLElement;
	readonly inputToolbarContainer: HTMLElement;
	readonly toolbar: WorkbenchToolBar;
	readonly metadataHeaderContainer: HTMLElement;
	readonly metadataInfoContainer: HTMLElement;
	readonly outputHeaderContainer: HTMLElement;
	readonly outputInfoContainer: HTMLElement;
	readonly marginOverlay: IDiffCellMarginOverlay;
}

export interface IDiffElementLayoutInfo {
	totalHeight: number;
	width: number;
	editorHeight: number;
	editorMargin: number;
	metadataHeight: number;
	cellStatusHeight: number;
	metadataStatusHeight: number;
	rawOutputHeight: number;
	outputMetadataHeight: number;
	outputTotalHeight: number;
	outputStatusHeight: number;
	bodyMargin: number;
	layoutState: CellLayoutState;
}

type IDiffElementSelfLayoutChangeEvent = { [K in keyof IDiffElementLayoutInfo]?: boolean };

export interface CellDiffViewModelLayoutChangeEvent extends IDiffElementSelfLayoutChangeEvent {
	font?: BareFontInfo;
	outerWidth?: boolean;
	metadataEditor?: boolean;
	outputEditor?: boolean;
	outputView?: boolean;
}

export const DIFF_CELL_MARGIN = 16;
export const NOTEBOOK_DIFF_CELL_INPUT = new RawContextKey<boolean>('notebook.diffEditor.cell.inputChanged', false);
export const NOTEBOOK_DIFF_METADATA = new RawContextKey<boolean>('notebook.diffEditor.metadataChanged', false);
export const NOTEBOOK_DIFF_CELL_IGNORE_WHITESPACE_KEY = 'notebook.diffEditor.cell.ignoreWhitespace';
export const NOTEBOOK_DIFF_CELL_IGNORE_WHITESPACE = new RawContextKey<boolean>(NOTEBOOK_DIFF_CELL_IGNORE_WHITESPACE_KEY, false);
export const NOTEBOOK_DIFF_CELL_PROPERTY = new RawContextKey<boolean>('notebook.diffEditor.cell.property.changed', false);
export const NOTEBOOK_DIFF_CELL_PROPERTY_EXPANDED = new RawContextKey<boolean>('notebook.diffEditor.cell.property.expanded', false);
export const NOTEBOOK_DIFF_CELLS_COLLAPSED = new RawContextKey<boolean>('notebook.diffEditor.allCollapsed', undefined, localize('notebook.diffEditor.allCollapsed', "Whether all cells in notebook diff editor are collapsed"));
export const NOTEBOOK_DIFF_HAS_UNCHANGED_CELLS = new RawContextKey<boolean>('notebook.diffEditor.hasUnchangedCells', undefined, localize('notebook.diffEditor.hasUnchangedCells', "Whether there are unchanged cells in the notebook diff editor"));
export const NOTEBOOK_DIFF_UNCHANGED_CELLS_HIDDEN = new RawContextKey<boolean>('notebook.diffEditor.unchangedCellsAreHidden', undefined, localize('notebook.diffEditor.unchangedCellsAreHidden', "Whether the unchanged cells in the notebook diff editor are hidden"));
export const NOTEBOOK_DIFF_ITEM_KIND = new RawContextKey<boolean>('notebook.diffEditor.item.kind', undefined, localize('notebook.diffEditor.item.kind', "The kind of item in the notebook diff editor, Cell, Metadata or Output"));
export const NOTEBOOK_DIFF_ITEM_DIFF_STATE = new RawContextKey<boolean>('notebook.diffEditor.item.state', undefined, localize('notebook.diffEditor.item.state', "The diff state of item in the notebook diff editor, delete, insert, modified or unchanged"));

export interface INotebookDiffViewModelUpdateEvent {
	readonly start: number;
	readonly deleteCount: number;
	readonly elements: readonly IDiffElementViewModelBase[];
	readonly firstChangeIndex?: number;
}

export interface INotebookDiffViewModel extends IDisposable {
	readonly items: readonly IDiffElementViewModelBase[];
	/**
	 * Triggered when ever there's a change in the view model items.
	 */
	readonly onDidChangeItems: Event<INotebookDiffViewModelUpdateEvent>;
	/**
	 * Computes the differences and generates the viewmodel.
	 * If view models are generated, then the onDidChangeItems is triggered.
	 * @param token
	 */
	computeDiff(token: CancellationToken): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/notebookDiffList.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/notebookDiffList.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './notebookDiff.css';
import { IListMouseEvent, IListRenderer, IListVirtualDelegate } from '../../../../../base/browser/ui/list/list.js';
import * as DOM from '../../../../../base/browser/dom.js';
import * as domStylesheets from '../../../../../base/browser/domStylesheets.js';
import { IListOptions, IListStyles, isMonacoEditor, IStyleController, MouseController } from '../../../../../base/browser/ui/list/listWidget.js';
import { DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { IListService, IWorkbenchListOptions, WorkbenchList } from '../../../../../platform/list/browser/listService.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { DiffElementPlaceholderViewModel, IDiffElementViewModelBase, NotebookDocumentMetadataViewModel, SideBySideDiffElementViewModel, SingleSideDiffElementViewModel } from './diffElementViewModel.js';
import { CellDiffPlaceholderRenderTemplate, CellDiffSideBySideRenderTemplate, CellDiffSingleSideRenderTemplate, DIFF_CELL_MARGIN, INotebookTextDiffEditor, NotebookDocumentDiffElementRenderTemplate } from './notebookDiffEditorBrowser.js';
import { CellDiffPlaceholderElement, CollapsedCellOverlayWidget, DeletedElement, getOptimizedNestedCodeEditorWidgetOptions, InsertElement, ModifiedElement, NotebookDocumentMetadataElement, UnchangedCellOverlayWidget } from './diffComponents.js';
import { CodeEditorWidget } from '../../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { DiffEditorWidget } from '../../../../../editor/browser/widget/diffEditor/diffEditorWidget.js';
import { IMenuService, MenuItemAction } from '../../../../../platform/actions/common/actions.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { CodiconActionViewItem } from '../view/cellParts/cellActionView.js';
import { IMouseWheelEvent } from '../../../../../base/browser/mouseEvent.js';
import { IEditorOptions } from '../../../../../editor/common/config/editorOptions.js';
import { createBareFontInfoFromRawSettings } from '../../../../../editor/common/config/fontInfoFromSettings.js';
import { PixelRatio } from '../../../../../base/browser/pixelRatio.js';
import { WorkbenchToolBar } from '../../../../../platform/actions/browser/toolbar.js';
import { fixedDiffEditorOptions, fixedEditorOptions } from './diffCellEditorOptions.js';
import { IAccessibilityService } from '../../../../../platform/accessibility/common/accessibility.js';
import { localize } from '../../../../../nls.js';
import { IEditorConstructionOptions } from '../../../../../editor/browser/config/editorConfiguration.js';
import { IDiffEditorConstructionOptions } from '../../../../../editor/browser/editorBrowser.js';
import { EditorExtensionsRegistry } from '../../../../../editor/browser/editorExtensions.js';

export class NotebookCellTextDiffListDelegate implements IListVirtualDelegate<IDiffElementViewModelBase> {
	private readonly lineHeight: number;

	constructor(
		targetWindow: Window,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		const editorOptions = this.configurationService.getValue<IEditorOptions>('editor');
		this.lineHeight = createBareFontInfoFromRawSettings(editorOptions, PixelRatio.getInstance(targetWindow).value).lineHeight;
	}

	getHeight(element: IDiffElementViewModelBase): number {
		return element.getHeight(this.lineHeight);
	}

	hasDynamicHeight(element: IDiffElementViewModelBase): boolean {
		return false;
	}

	getTemplateId(element: IDiffElementViewModelBase): string {
		switch (element.type) {
			case 'delete':
			case 'insert':
				return CellDiffSingleSideRenderer.TEMPLATE_ID;
			case 'modified':
			case 'unchanged':
				return CellDiffSideBySideRenderer.TEMPLATE_ID;
			case 'placeholder':
				return CellDiffPlaceholderRenderer.TEMPLATE_ID;
			case 'modifiedMetadata':
			case 'unchangedMetadata':
				return NotebookDocumentMetadataDiffRenderer.TEMPLATE_ID;
		}
	}
}

export class CellDiffPlaceholderRenderer implements IListRenderer<DiffElementPlaceholderViewModel, CellDiffPlaceholderRenderTemplate> {
	static readonly TEMPLATE_ID = 'cell_diff_placeholder';

	constructor(
		readonly notebookEditor: INotebookTextDiffEditor,
		@IInstantiationService protected readonly instantiationService: IInstantiationService
	) { }

	get templateId() {
		return CellDiffPlaceholderRenderer.TEMPLATE_ID;
	}

	renderTemplate(container: HTMLElement): CellDiffPlaceholderRenderTemplate {
		const body = DOM.$('.cell-placeholder-body');
		DOM.append(container, body);

		const elementDisposables = new DisposableStore();
		const marginOverlay = new CollapsedCellOverlayWidget(body);
		const contents = DOM.append(body, DOM.$('.contents'));
		const placeholder = DOM.append(contents, DOM.$('span.text', { title: localize('notebook.diff.hiddenCells.expandAll', 'Double click to show') }));

		return {
			body,
			container,
			placeholder,
			marginOverlay,
			elementDisposables
		};
	}

	renderElement(element: DiffElementPlaceholderViewModel, index: number, templateData: CellDiffPlaceholderRenderTemplate): void {
		templateData.body.classList.remove('left', 'right', 'full');
		templateData.elementDisposables.add(this.instantiationService.createInstance(CellDiffPlaceholderElement, element, templateData));
	}

	disposeTemplate(templateData: CellDiffPlaceholderRenderTemplate): void {
		templateData.container.innerText = '';
	}

	disposeElement(element: DiffElementPlaceholderViewModel, index: number, templateData: CellDiffPlaceholderRenderTemplate): void {
		templateData.elementDisposables.clear();
	}
}

export class NotebookDocumentMetadataDiffRenderer implements IListRenderer<NotebookDocumentMetadataViewModel, NotebookDocumentDiffElementRenderTemplate> {
	static readonly TEMPLATE_ID = 'notebook_metadata_diff_side_by_side';

	constructor(
		readonly notebookEditor: INotebookTextDiffEditor,
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
		@IContextMenuService protected readonly contextMenuService: IContextMenuService,
		@IKeybindingService protected readonly keybindingService: IKeybindingService,
		@IMenuService protected readonly menuService: IMenuService,
		@IContextKeyService protected readonly contextKeyService: IContextKeyService,
		@INotificationService protected readonly notificationService: INotificationService,
		@IThemeService protected readonly themeService: IThemeService,
		@IAccessibilityService protected readonly accessibilityService: IAccessibilityService
	) { }

	get templateId() {
		return NotebookDocumentMetadataDiffRenderer.TEMPLATE_ID;
	}

	renderTemplate(container: HTMLElement): NotebookDocumentDiffElementRenderTemplate {
		const body = DOM.$('.cell-body');
		DOM.append(container, body);
		const diffEditorContainer = DOM.$('.cell-diff-editor-container');
		DOM.append(body, diffEditorContainer);

		const cellHeaderContainer = DOM.append(diffEditorContainer, DOM.$('.input-header-container'));
		const sourceContainer = DOM.append(diffEditorContainer, DOM.$('.source-container'));
		const { editor, editorContainer } = this._buildSourceEditor(sourceContainer);

		const inputToolbarContainer = DOM.append(sourceContainer, DOM.$('.editor-input-toolbar-container'));
		const cellToolbarContainer = DOM.append(inputToolbarContainer, DOM.$('div.property-toolbar'));
		const toolbar = this.instantiationService.createInstance(WorkbenchToolBar, cellToolbarContainer, {
			actionViewItemProvider: (action, options) => {
				if (action instanceof MenuItemAction) {
					const item = new CodiconActionViewItem(action, { hoverDelegate: options.hoverDelegate }, this.keybindingService, this.notificationService, this.contextKeyService, this.themeService, this.contextMenuService, this.accessibilityService);
					return item;
				}

				return undefined;
			},
			highlightToggledItems: true
		});

		const borderContainer = DOM.append(body, DOM.$('.border-container'));
		const leftBorder = DOM.append(borderContainer, DOM.$('.left-border'));
		const rightBorder = DOM.append(borderContainer, DOM.$('.right-border'));
		const topBorder = DOM.append(borderContainer, DOM.$('.top-border'));
		const bottomBorder = DOM.append(borderContainer, DOM.$('.bottom-border'));
		const marginOverlay = new UnchangedCellOverlayWidget(body);
		const elementDisposables = new DisposableStore();

		return {
			body,
			container,
			diffEditorContainer,
			cellHeaderContainer,
			sourceEditor: editor,
			editorContainer,
			inputToolbarContainer,
			toolbar,
			leftBorder,
			rightBorder,
			topBorder,
			bottomBorder,
			marginOverlay,
			elementDisposables
		};
	}

	private _buildSourceEditor(sourceContainer: HTMLElement) {
		return buildDiffEditorWidget(this.instantiationService, this.notebookEditor, sourceContainer, { readOnly: true });
	}

	renderElement(element: NotebookDocumentMetadataViewModel, index: number, templateData: NotebookDocumentDiffElementRenderTemplate): void {
		templateData.body.classList.remove('full');
		templateData.elementDisposables.add(this.instantiationService.createInstance(NotebookDocumentMetadataElement, this.notebookEditor, element, templateData));
	}

	disposeTemplate(templateData: NotebookDocumentDiffElementRenderTemplate): void {
		templateData.container.innerText = '';
		templateData.sourceEditor.dispose();
		templateData.toolbar?.dispose();
		templateData.elementDisposables.dispose();
	}

	disposeElement(element: NotebookDocumentMetadataViewModel, index: number, templateData: NotebookDocumentDiffElementRenderTemplate): void {
		if (templateData.toolbar) {
			templateData.toolbar.context = undefined;
		}
		templateData.elementDisposables.clear();
	}
}


export class CellDiffSingleSideRenderer implements IListRenderer<SingleSideDiffElementViewModel, CellDiffSingleSideRenderTemplate | CellDiffSideBySideRenderTemplate> {
	static readonly TEMPLATE_ID = 'cell_diff_single';

	constructor(
		readonly notebookEditor: INotebookTextDiffEditor,
		@IInstantiationService protected readonly instantiationService: IInstantiationService
	) { }

	get templateId() {
		return CellDiffSingleSideRenderer.TEMPLATE_ID;
	}

	renderTemplate(container: HTMLElement): CellDiffSingleSideRenderTemplate {
		const body = DOM.$('.cell-body');
		DOM.append(container, body);
		const diffEditorContainer = DOM.$('.cell-diff-editor-container');
		DOM.append(body, diffEditorContainer);

		const diagonalFill = DOM.append(body, DOM.$('.diagonal-fill'));

		const cellHeaderContainer = DOM.append(diffEditorContainer, DOM.$('.input-header-container'));
		const sourceContainer = DOM.append(diffEditorContainer, DOM.$('.source-container'));
		const { editor, editorContainer } = this._buildSourceEditor(sourceContainer);

		const metadataHeaderContainer = DOM.append(diffEditorContainer, DOM.$('.metadata-header-container'));
		const metadataInfoContainer = DOM.append(diffEditorContainer, DOM.$('.metadata-info-container'));

		const outputHeaderContainer = DOM.append(diffEditorContainer, DOM.$('.output-header-container'));
		const outputInfoContainer = DOM.append(diffEditorContainer, DOM.$('.output-info-container'));

		const borderContainer = DOM.append(body, DOM.$('.border-container'));
		const leftBorder = DOM.append(borderContainer, DOM.$('.left-border'));
		const rightBorder = DOM.append(borderContainer, DOM.$('.right-border'));
		const topBorder = DOM.append(borderContainer, DOM.$('.top-border'));
		const bottomBorder = DOM.append(borderContainer, DOM.$('.bottom-border'));

		return {
			body,
			container,
			editorContainer,
			diffEditorContainer,
			diagonalFill,
			cellHeaderContainer,
			sourceEditor: editor,
			metadataHeaderContainer,
			metadataInfoContainer,
			outputHeaderContainer,
			outputInfoContainer,
			leftBorder,
			rightBorder,
			topBorder,
			bottomBorder,
			elementDisposables: new DisposableStore()
		};
	}

	private _buildSourceEditor(sourceContainer: HTMLElement) {
		return buildSourceEditor(this.instantiationService, this.notebookEditor, sourceContainer);
	}

	renderElement(element: SingleSideDiffElementViewModel, index: number, templateData: CellDiffSingleSideRenderTemplate): void {
		templateData.body.classList.remove('left', 'right', 'full');

		switch (element.type) {
			case 'delete':
				templateData.elementDisposables.add(this.instantiationService.createInstance(DeletedElement, this.notebookEditor, element, templateData));
				return;
			case 'insert':
				templateData.elementDisposables.add(this.instantiationService.createInstance(InsertElement, this.notebookEditor, element, templateData));
				return;
			default:
				break;
		}
	}

	disposeTemplate(templateData: CellDiffSingleSideRenderTemplate): void {
		templateData.container.innerText = '';
		templateData.sourceEditor.dispose();
		templateData.elementDisposables.dispose();
	}

	disposeElement(element: SingleSideDiffElementViewModel, index: number, templateData: CellDiffSingleSideRenderTemplate): void {
		templateData.elementDisposables.clear();
	}
}


export class CellDiffSideBySideRenderer implements IListRenderer<SideBySideDiffElementViewModel, CellDiffSideBySideRenderTemplate> {
	static readonly TEMPLATE_ID = 'cell_diff_side_by_side';

	constructor(
		readonly notebookEditor: INotebookTextDiffEditor,
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
		@IContextMenuService protected readonly contextMenuService: IContextMenuService,
		@IKeybindingService protected readonly keybindingService: IKeybindingService,
		@IMenuService protected readonly menuService: IMenuService,
		@IContextKeyService protected readonly contextKeyService: IContextKeyService,
		@INotificationService protected readonly notificationService: INotificationService,
		@IThemeService protected readonly themeService: IThemeService,
		@IAccessibilityService protected readonly accessibilityService: IAccessibilityService
	) { }

	get templateId() {
		return CellDiffSideBySideRenderer.TEMPLATE_ID;
	}

	renderTemplate(container: HTMLElement): CellDiffSideBySideRenderTemplate {
		const body = DOM.$('.cell-body');
		DOM.append(container, body);
		const diffEditorContainer = DOM.$('.cell-diff-editor-container');
		DOM.append(body, diffEditorContainer);

		const cellHeaderContainer = DOM.append(diffEditorContainer, DOM.$('.input-header-container'));
		const sourceContainer = DOM.append(diffEditorContainer, DOM.$('.source-container'));
		const { editor, editorContainer } = this._buildSourceEditor(sourceContainer);

		const inputToolbarContainer = DOM.append(sourceContainer, DOM.$('.editor-input-toolbar-container'));
		const cellToolbarContainer = DOM.append(inputToolbarContainer, DOM.$('div.property-toolbar'));
		const toolbar = this.instantiationService.createInstance(WorkbenchToolBar, cellToolbarContainer, {
			actionViewItemProvider: (action, options) => {
				if (action instanceof MenuItemAction) {
					const item = new CodiconActionViewItem(action, { hoverDelegate: options.hoverDelegate }, this.keybindingService, this.notificationService, this.contextKeyService, this.themeService, this.contextMenuService, this.accessibilityService);
					return item;
				}

				return undefined;
			},
			highlightToggledItems: true
		});

		const metadataHeaderContainer = DOM.append(diffEditorContainer, DOM.$('.metadata-header-container'));
		const metadataInfoContainer = DOM.append(diffEditorContainer, DOM.$('.metadata-info-container'));

		const outputHeaderContainer = DOM.append(diffEditorContainer, DOM.$('.output-header-container'));
		const outputInfoContainer = DOM.append(diffEditorContainer, DOM.$('.output-info-container'));

		const borderContainer = DOM.append(body, DOM.$('.border-container'));
		const leftBorder = DOM.append(borderContainer, DOM.$('.left-border'));
		const rightBorder = DOM.append(borderContainer, DOM.$('.right-border'));
		const topBorder = DOM.append(borderContainer, DOM.$('.top-border'));
		const bottomBorder = DOM.append(borderContainer, DOM.$('.bottom-border'));
		const marginOverlay = new UnchangedCellOverlayWidget(body);
		const elementDisposables = new DisposableStore();

		return {
			body,
			container,
			diffEditorContainer,
			cellHeaderContainer,
			sourceEditor: editor,
			editorContainer,
			inputToolbarContainer,
			toolbar,
			metadataHeaderContainer,
			metadataInfoContainer,
			outputHeaderContainer,
			outputInfoContainer,
			leftBorder,
			rightBorder,
			topBorder,
			bottomBorder,
			marginOverlay,
			elementDisposables
		};
	}

	private _buildSourceEditor(sourceContainer: HTMLElement) {
		return buildDiffEditorWidget(this.instantiationService, this.notebookEditor, sourceContainer);
	}

	renderElement(element: SideBySideDiffElementViewModel, index: number, templateData: CellDiffSideBySideRenderTemplate): void {
		templateData.body.classList.remove('left', 'right', 'full');

		switch (element.type) {
			case 'unchanged':
				templateData.elementDisposables.add(this.instantiationService.createInstance(ModifiedElement, this.notebookEditor, element, templateData));
				return;
			case 'modified':
				templateData.elementDisposables.add(this.instantiationService.createInstance(ModifiedElement, this.notebookEditor, element, templateData));
				return;
			default:
				break;
		}
	}

	disposeTemplate(templateData: CellDiffSideBySideRenderTemplate): void {
		templateData.container.innerText = '';
		templateData.sourceEditor.dispose();
		templateData.toolbar?.dispose();
		templateData.elementDisposables.dispose();
	}

	disposeElement(element: SideBySideDiffElementViewModel, index: number, templateData: CellDiffSideBySideRenderTemplate): void {
		if (templateData.toolbar) {
			templateData.toolbar.context = undefined;
		}
		templateData.elementDisposables.clear();
	}
}

export class NotebookMouseController<T> extends MouseController<T> {
	protected override onViewPointer(e: IListMouseEvent<T>): void {
		if (isMonacoEditor(e.browserEvent.target as HTMLElement)) {
			const focus = typeof e.index === 'undefined' ? [] : [e.index];
			this.list.setFocus(focus, e.browserEvent);
		} else {
			super.onViewPointer(e);
		}
	}
}

export class NotebookTextDiffList extends WorkbenchList<IDiffElementViewModelBase> implements IDisposable, IStyleController {
	private styleElement?: HTMLStyleElement;

	get rowsContainer(): HTMLElement {
		return this.view.containerDomNode;
	}

	constructor(
		listUser: string,
		container: HTMLElement,
		delegate: IListVirtualDelegate<IDiffElementViewModelBase>,
		renderers: IListRenderer<IDiffElementViewModelBase, CellDiffSingleSideRenderTemplate | CellDiffSideBySideRenderTemplate | CellDiffPlaceholderRenderTemplate | NotebookDocumentDiffElementRenderTemplate>[],
		contextKeyService: IContextKeyService,
		options: IWorkbenchListOptions<IDiffElementViewModelBase>,
		@IListService listService: IListService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService) {
		super(listUser, container, delegate, renderers, options, contextKeyService, listService, configurationService, instantiationService);
	}

	protected override createMouseController(options: IListOptions<IDiffElementViewModelBase>): MouseController<IDiffElementViewModelBase> {
		return new NotebookMouseController(this);
	}

	getCellViewScrollTop(element: IDiffElementViewModelBase): number {
		const index = this.indexOf(element);
		// if (index === undefined || index < 0 || index >= this.length) {
		// 	this._getViewIndexUpperBound(element);
		// 	throw new ListError(this.listUser, `Invalid index ${index}`);
		// }

		return this.view.elementTop(index);
	}

	getScrollHeight() {
		return this.view.scrollHeight;
	}

	triggerScrollFromMouseWheelEvent(browserEvent: IMouseWheelEvent) {
		this.view.delegateScrollFromMouseWheelEvent(browserEvent);
	}

	delegateVerticalScrollbarPointerDown(browserEvent: PointerEvent) {
		this.view.delegateVerticalScrollbarPointerDown(browserEvent);
	}

	clear() {
		super.splice(0, this.length);
	}


	updateElementHeight2(element: IDiffElementViewModelBase, size: number) {
		const viewIndex = this.indexOf(element);
		const focused = this.getFocus();

		this.view.updateElementHeight(viewIndex, size, focused.length ? focused[0] : null);
	}

	override style(styles: IListStyles) {
		const selectorSuffix = this.view.domId;
		if (!this.styleElement) {
			this.styleElement = domStylesheets.createStyleSheet(this.view.domNode);
		}
		const suffix = selectorSuffix && `.${selectorSuffix}`;
		const content: string[] = [];

		if (styles.listBackground) {
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows { background: ${styles.listBackground}; }`);
		}

		if (styles.listFocusBackground) {
			content.push(`.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused { background-color: ${styles.listFocusBackground}; }`);
			content.push(`.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused:hover { background-color: ${styles.listFocusBackground}; }`); // overwrite :hover style in this case!
		}

		if (styles.listFocusForeground) {
			content.push(`.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused { color: ${styles.listFocusForeground}; }`);
		}

		if (styles.listActiveSelectionBackground) {
			content.push(`.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected { background-color: ${styles.listActiveSelectionBackground}; }`);
			content.push(`.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected:hover { background-color: ${styles.listActiveSelectionBackground}; }`); // overwrite :hover style in this case!
		}

		if (styles.listActiveSelectionForeground) {
			content.push(`.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected { color: ${styles.listActiveSelectionForeground}; }`);
		}

		if (styles.listFocusAndSelectionBackground) {
			content.push(`
				.monaco-drag-image${suffix},
				.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected.focused { background-color: ${styles.listFocusAndSelectionBackground}; }
			`);
		}

		if (styles.listFocusAndSelectionForeground) {
			content.push(`
				.monaco-drag-image${suffix},
				.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected.focused { color: ${styles.listFocusAndSelectionForeground}; }
			`);
		}

		if (styles.listInactiveFocusBackground) {
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused { background-color:  ${styles.listInactiveFocusBackground}; }`);
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused:hover { background-color:  ${styles.listInactiveFocusBackground}; }`); // overwrite :hover style in this case!
		}

		if (styles.listInactiveSelectionBackground) {
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected { background-color:  ${styles.listInactiveSelectionBackground}; }`);
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected:hover { background-color:  ${styles.listInactiveSelectionBackground}; }`); // overwrite :hover style in this case!
		}

		if (styles.listInactiveSelectionForeground) {
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected { color: ${styles.listInactiveSelectionForeground}; }`);
		}

		if (styles.listHoverBackground) {
			content.push(`.monaco-list${suffix}:not(.drop-target) > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row:hover:not(.selected):not(.focused) { background-color:  ${styles.listHoverBackground}; }`);
		}

		if (styles.listHoverForeground) {
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row:hover:not(.selected):not(.focused) { color:  ${styles.listHoverForeground}; }`);
		}

		if (styles.listSelectionOutline) {
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected { outline: 1px dotted ${styles.listSelectionOutline}; outline-offset: -1px; }`);
		}

		if (styles.listFocusOutline) {
			content.push(`
				.monaco-drag-image${suffix},
				.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused { outline: 1px solid ${styles.listFocusOutline}; outline-offset: -1px; }
			`);
		}

		if (styles.listInactiveFocusOutline) {
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused { outline: 1px dotted ${styles.listInactiveFocusOutline}; outline-offset: -1px; }`);
		}

		if (styles.listHoverOutline) {
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row:hover { outline: 1px dashed ${styles.listHoverOutline}; outline-offset: -1px; }`);
		}

		if (styles.listDropOverBackground) {
			content.push(`
				.monaco-list${suffix}.drop-target,
				.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows.drop-target,
				.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-row.drop-target { background-color: ${styles.listDropOverBackground} !important; color: inherit !important; }
			`);
		}

		const newStyles = content.join('\n');
		if (newStyles !== this.styleElement.textContent) {
			this.styleElement.textContent = newStyles;
		}
	}
}


function buildDiffEditorWidget(instantiationService: IInstantiationService, notebookEditor: INotebookTextDiffEditor, sourceContainer: HTMLElement, options: IDiffEditorConstructionOptions = {}) {
	const editorContainer = DOM.append(sourceContainer, DOM.$('.editor-container'));

	const editor = instantiationService.createInstance(DiffEditorWidget, editorContainer, {
		...fixedDiffEditorOptions,
		overflowWidgetsDomNode: notebookEditor.getOverflowContainerDomNode(),
		originalEditable: false,
		ignoreTrimWhitespace: false,
		automaticLayout: false,
		dimension: {
			height: 0,
			width: 0
		},
		renderSideBySide: true,
		useInlineViewWhenSpaceIsLimited: false,
		...options
	}, {
		originalEditor: getOptimizedNestedCodeEditorWidgetOptions(),
		modifiedEditor: getOptimizedNestedCodeEditorWidgetOptions()
	});

	return {
		editor,
		editorContainer
	};
}

function buildSourceEditor(instantiationService: IInstantiationService, notebookEditor: INotebookTextDiffEditor, sourceContainer: HTMLElement, options: IEditorConstructionOptions = {}) {
	const editorContainer = DOM.append(sourceContainer, DOM.$('.editor-container'));
	const skipContributions = [
		'editor.contrib.emptyTextEditorHint'
	];
	const editor = instantiationService.createInstance(CodeEditorWidget, editorContainer, {
		...fixedEditorOptions,
		glyphMargin: false,
		dimension: {
			width: (notebookEditor.getLayoutInfo().width - 2 * DIFF_CELL_MARGIN) / 2 - 18,
			height: 0
		},
		automaticLayout: false,
		overflowWidgetsDomNode: notebookEditor.getOverflowContainerDomNode(),
		allowVariableLineHeights: false,
		readOnly: true,
	}, {
		contributions: EditorExtensionsRegistry.getEditorContributions().filter(c => skipContributions.indexOf(c.id) === -1)
	});

	return { editor, editorContainer };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/notebookDiffOverviewRuler.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/notebookDiffOverviewRuler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../base/browser/dom.js';
import { createFastDomNode, FastDomNode } from '../../../../../base/browser/fastDomNode.js';
import { PixelRatio } from '../../../../../base/browser/pixelRatio.js';
import { Color } from '../../../../../base/common/color.js';
import { DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { defaultInsertColor, defaultRemoveColor, diffInserted, diffOverviewRulerInserted, diffOverviewRulerRemoved, diffRemoved } from '../../../../../platform/theme/common/colorRegistry.js';
import { IColorTheme, IThemeService, Themable } from '../../../../../platform/theme/common/themeService.js';
import { IDiffElementViewModelBase } from './diffElementViewModel.js';
import { NotebookDiffEditorEventDispatcher } from './eventDispatcher.js';
import { INotebookTextDiffEditor } from './notebookDiffEditorBrowser.js';

const MINIMUM_SLIDER_SIZE = 20;

export class NotebookDiffOverviewRuler extends Themable {
	private readonly _domNode: FastDomNode<HTMLCanvasElement>;
	private readonly _overviewViewportDomElement: FastDomNode<HTMLElement>;

	private _diffElementViewModels: readonly IDiffElementViewModelBase[] = [];
	private _lanes = 2;

	private _insertColor: Color | null;
	private _insertColorHex: string | null;
	private _removeColor: Color | null;
	private _removeColorHex: string | null;

	private readonly _disposables: DisposableStore;
	private _renderAnimationFrame: IDisposable | null;

	constructor(readonly notebookEditor: INotebookTextDiffEditor, readonly width: number, container: HTMLElement, @IThemeService themeService: IThemeService) {
		super(themeService);
		this._insertColor = null;
		this._removeColor = null;
		this._insertColorHex = null;
		this._removeColorHex = null;
		this._disposables = this._register(new DisposableStore());
		this._renderAnimationFrame = null;
		this._domNode = createFastDomNode(document.createElement('canvas'));
		this._domNode.setPosition('relative');
		this._domNode.setLayerHinting(true);
		this._domNode.setContain('strict');

		container.appendChild(this._domNode.domNode);

		this._overviewViewportDomElement = createFastDomNode(document.createElement('div'));
		this._overviewViewportDomElement.setClassName('diffViewport');
		this._overviewViewportDomElement.setPosition('absolute');
		this._overviewViewportDomElement.setWidth(width);
		container.appendChild(this._overviewViewportDomElement.domNode);

		this._register(PixelRatio.getInstance(DOM.getWindow(this._domNode.domNode)).onDidChange(() => {
			this._scheduleRender();
		}));

		this._register(this.themeService.onDidColorThemeChange(e => {
			const colorChanged = this.applyColors(e);
			if (colorChanged) {
				this._scheduleRender();
			}
		}));
		this.applyColors(this.themeService.getColorTheme());

		this._register(this.notebookEditor.onDidScroll(() => {
			this._renderOverviewViewport();
		}));

		this._register(DOM.addStandardDisposableListener(container, DOM.EventType.POINTER_DOWN, (e) => {
			this.notebookEditor.delegateVerticalScrollbarPointerDown(e);
		}));
	}

	private applyColors(theme: IColorTheme): boolean {
		const newInsertColor = theme.getColor(diffOverviewRulerInserted) || (theme.getColor(diffInserted) || defaultInsertColor).transparent(2);
		const newRemoveColor = theme.getColor(diffOverviewRulerRemoved) || (theme.getColor(diffRemoved) || defaultRemoveColor).transparent(2);
		const hasChanges = !newInsertColor.equals(this._insertColor) || !newRemoveColor.equals(this._removeColor);
		this._insertColor = newInsertColor;
		this._removeColor = newRemoveColor;
		if (this._insertColor) {
			this._insertColorHex = Color.Format.CSS.formatHexA(this._insertColor);
		}

		if (this._removeColor) {
			this._removeColorHex = Color.Format.CSS.formatHexA(this._removeColor);
		}

		return hasChanges;
	}

	layout() {
		this._layoutNow();
	}

	updateViewModels(elements: readonly IDiffElementViewModelBase[], eventDispatcher: NotebookDiffEditorEventDispatcher | undefined) {
		this._disposables.clear();

		this._diffElementViewModels = elements;

		if (eventDispatcher) {
			this._disposables.add(eventDispatcher.onDidChangeLayout(() => {
				this._scheduleRender();
			}));

			this._disposables.add(eventDispatcher.onDidChangeCellLayout(() => {
				this._scheduleRender();
			}));
		}

		this._scheduleRender();
	}

	private _scheduleRender(): void {
		if (this._renderAnimationFrame === null) {
			this._renderAnimationFrame = DOM.runAtThisOrScheduleAtNextAnimationFrame(DOM.getWindow(this._domNode.domNode), this._onRenderScheduled.bind(this), 16);
		}
	}

	private _onRenderScheduled(): void {
		this._renderAnimationFrame = null;
		this._layoutNow();
	}

	private _layoutNow() {
		const layoutInfo = this.notebookEditor.getLayoutInfo();
		const height = layoutInfo.height;
		const contentHeight = this._diffElementViewModels.map(view => view.totalHeight).reduce((a, b) => a + b, 0);
		const ratio = PixelRatio.getInstance(DOM.getWindow(this._domNode.domNode)).value;
		this._domNode.setWidth(this.width);
		this._domNode.setHeight(height);
		this._domNode.domNode.width = this.width * ratio;
		this._domNode.domNode.height = height * ratio;
		const ctx = this._domNode.domNode.getContext('2d')!;
		ctx.clearRect(0, 0, this.width * ratio, height * ratio);
		this._renderCanvas(ctx, this.width * ratio, height * ratio, contentHeight * ratio, ratio);
		this._renderOverviewViewport();
	}

	private _renderOverviewViewport(): void {
		const layout = this._computeOverviewViewport();
		if (!layout) {
			this._overviewViewportDomElement.setTop(0);
			this._overviewViewportDomElement.setHeight(0);
		} else {
			this._overviewViewportDomElement.setTop(layout.top);
			this._overviewViewportDomElement.setHeight(layout.height);
		}
	}

	private _computeOverviewViewport(): { height: number; top: number } | null {
		const layoutInfo = this.notebookEditor.getLayoutInfo();
		if (!layoutInfo) {
			return null;
		}

		const scrollTop = this.notebookEditor.getScrollTop();
		const scrollHeight = this.notebookEditor.getScrollHeight();

		const computedAvailableSize = Math.max(0, layoutInfo.height);
		const computedRepresentableSize = Math.max(0, computedAvailableSize - 2 * 0);
		const visibleSize = layoutInfo.height;
		const computedSliderSize = Math.round(Math.max(MINIMUM_SLIDER_SIZE, Math.floor(visibleSize * computedRepresentableSize / scrollHeight)));
		const computedSliderRatio = (computedRepresentableSize - computedSliderSize) / (scrollHeight - visibleSize);
		const computedSliderPosition = Math.round(scrollTop * computedSliderRatio);

		return {
			height: computedSliderSize,
			top: computedSliderPosition
		};
	}

	private _renderCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, scrollHeight: number, ratio: number) {
		if (!this._insertColorHex || !this._removeColorHex) {
			// no op when colors are not yet known
			return;
		}

		const laneWidth = width / this._lanes;
		let currentFrom = 0;
		for (let i = 0; i < this._diffElementViewModels.length; i++) {
			const element = this._diffElementViewModels[i];

			const cellHeight = Math.round((element.totalHeight / scrollHeight) * ratio * height);
			switch (element.type) {
				case 'insert':
					ctx.fillStyle = this._insertColorHex;
					ctx.fillRect(laneWidth, currentFrom, laneWidth, cellHeight);
					break;
				case 'delete':
					ctx.fillStyle = this._removeColorHex;
					ctx.fillRect(0, currentFrom, laneWidth, cellHeight);
					break;
				case 'unchanged':
				case 'unchangedMetadata':
					break;
				case 'modified':
				case 'modifiedMetadata':
					ctx.fillStyle = this._removeColorHex;
					ctx.fillRect(0, currentFrom, laneWidth, cellHeight);
					ctx.fillStyle = this._insertColorHex;
					ctx.fillRect(laneWidth, currentFrom, laneWidth, cellHeight);
					break;
			}


			currentFrom += cellHeight;
		}
	}

	override dispose() {
		if (this._renderAnimationFrame !== null) {
			this._renderAnimationFrame.dispose();
			this._renderAnimationFrame = null;
		}

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/notebookDiffViewModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/notebookDiffViewModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { IDiffResult } from '../../../../../base/common/diff/diff.js';
import { Emitter, type IValueWithChangeEvent } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore, dispose } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import type { URI } from '../../../../../base/common/uri.js';
import { FontInfo } from '../../../../../editor/common/config/fontInfo.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import type { ContextKeyValue } from '../../../../../platform/contextkey/common/contextkey.js';
import { MultiDiffEditorItem } from '../../../multiDiffEditor/browser/multiDiffSourceResolverService.js';
import { DiffElementCellViewModelBase, DiffElementPlaceholderViewModel, IDiffElementViewModelBase, NotebookDocumentMetadataViewModel, SideBySideDiffElementViewModel, SingleSideDiffElementViewModel } from './diffElementViewModel.js';
import { NotebookDiffEditorEventDispatcher } from './eventDispatcher.js';
import { INotebookDiffViewModel, INotebookDiffViewModelUpdateEvent, NOTEBOOK_DIFF_ITEM_DIFF_STATE, NOTEBOOK_DIFF_ITEM_KIND } from './notebookDiffEditorBrowser.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { CellUri, INotebookDiffEditorModel } from '../../common/notebookCommon.js';
import { INotebookService } from '../../common/notebookService.js';
import { INotebookEditorWorkerService } from '../../common/services/notebookWorkerService.js';
import { IDiffEditorHeightCalculatorService } from './editorHeightCalculator.js';
import { raceCancellation } from '../../../../../base/common/async.js';
import { computeDiff } from '../../common/notebookDiff.js';

export class NotebookDiffViewModel extends Disposable implements INotebookDiffViewModel, IValueWithChangeEvent<readonly MultiDiffEditorItem[]> {
	private readonly placeholderAndRelatedCells = new Map<DiffElementPlaceholderViewModel, DiffElementCellViewModelBase[]>();
	private readonly _items: IDiffElementViewModelBase[] = [];
	get items(): readonly IDiffElementViewModelBase[] {
		return this._items;
	}
	private readonly _onDidChangeItems = this._register(new Emitter<INotebookDiffViewModelUpdateEvent>());
	public readonly onDidChangeItems = this._onDidChangeItems.event;
	private readonly disposables = this._register(new DisposableStore());
	private _onDidChange = this._register(new Emitter<void>());
	private diffEditorItems: NotebookMultiDiffEditorItem[] = [];
	public onDidChange = this._onDidChange.event;
	private notebookMetadataViewModel?: NotebookDocumentMetadataViewModel;
	get value(): readonly NotebookMultiDiffEditorItem[] {
		return this.diffEditorItems
			.filter(item => item.type !== 'placeholder')
			.filter(item => {
				if (this._includeUnchanged) {
					return true;
				}
				if (item instanceof NotebookMultiDiffEditorCellItem) {
					return item.type === 'unchanged' && item.containerType === 'unchanged' ? false : true;
				}
				if (item instanceof NotebookMultiDiffEditorMetadataItem) {
					return item.type === 'unchanged' && item.containerType === 'unchanged' ? false : true;
				}
				if (item instanceof NotebookMultiDiffEditorOutputItem) {
					return item.type === 'unchanged' && item.containerType === 'unchanged' ? false : true;
				}
				return true;
			})
			.filter(item => item instanceof NotebookMultiDiffEditorOutputItem ? !this.hideOutput : true)
			.filter(item => item instanceof NotebookMultiDiffEditorMetadataItem ? !this.ignoreMetadata : true);
	}

	private _hasUnchangedCells?: boolean;
	public get hasUnchangedCells() {
		return this._hasUnchangedCells === true;
	}
	private _includeUnchanged?: boolean;
	public get includeUnchanged() {
		return this._includeUnchanged === true;
	}
	public set includeUnchanged(value) {
		this._includeUnchanged = value;
		this._onDidChange.fire();
	}
	private hideOutput?: boolean;
	private ignoreMetadata?: boolean;

	private originalCellViewModels: IDiffElementViewModelBase[] = [];
	constructor(private readonly model: INotebookDiffEditorModel,
		private readonly notebookEditorWorkerService: INotebookEditorWorkerService,
		private readonly configurationService: IConfigurationService,
		private readonly eventDispatcher: NotebookDiffEditorEventDispatcher,
		private readonly notebookService: INotebookService,
		private readonly diffEditorHeightCalculator: IDiffEditorHeightCalculatorService,
		private readonly fontInfo?: FontInfo,
		private readonly excludeUnchangedPlaceholder?: boolean,
	) {
		super();
		this.hideOutput = this.model.modified.notebook.transientOptions.transientOutputs || this.configurationService.getValue<boolean>('notebook.diff.ignoreOutputs');
		this.ignoreMetadata = this.configurationService.getValue('notebook.diff.ignoreMetadata');

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			let triggerChange = false;
			let metadataChanged = false;
			if (e.affectsConfiguration('notebook.diff.ignoreMetadata')) {
				const newValue = this.configurationService.getValue<boolean>('notebook.diff.ignoreMetadata');

				if (newValue !== undefined && this.ignoreMetadata !== newValue) {
					this.ignoreMetadata = newValue;
					triggerChange = true;
					metadataChanged = true;
				}
			}

			if (e.affectsConfiguration('notebook.diff.ignoreOutputs')) {
				const newValue = this.configurationService.getValue<boolean>('notebook.diff.ignoreOutputs');

				if (newValue !== undefined && this.hideOutput !== (newValue || this.model.modified.notebook.transientOptions.transientOutputs)) {
					this.hideOutput = newValue || !!(this.model.modified.notebook.transientOptions.transientOutputs);
					triggerChange = true;
				}
			}

			if (metadataChanged) {
				this.toggleNotebookMetadata();
			}
			if (triggerChange) {
				this._onDidChange.fire();
			}
		}));
	}
	override dispose() {
		this.clear();
		super.dispose();
	}
	private clear() {
		this.disposables.clear();
		dispose(Array.from(this.placeholderAndRelatedCells.keys()));
		this.placeholderAndRelatedCells.clear();
		dispose(this.originalCellViewModels);
		this.originalCellViewModels = [];
		dispose(this._items);
		this._items.splice(0, this._items.length);
	}

	async computeDiff(token: CancellationToken): Promise<void> {
		const diffResult = await raceCancellation(this.notebookEditorWorkerService.computeDiff(this.model.original.resource, this.model.modified.resource), token);
		if (!diffResult || token.isCancellationRequested) {
			// after await the editor might be disposed.
			return;
		}

		prettyChanges(this.model.original.notebook, this.model.modified.notebook, diffResult.cellsDiff);

		const { cellDiffInfo, firstChangeIndex } = computeDiff(this.model.original.notebook, this.model.modified.notebook, diffResult);
		if (isEqual(cellDiffInfo, this.originalCellViewModels, this.model)) {
			return;
		} else {
			await raceCancellation(this.updateViewModels(cellDiffInfo, diffResult.metadataChanged, firstChangeIndex), token);
			if (token.isCancellationRequested) {
				return;
			}
			this.updateDiffEditorItems();
		}
	}

	private toggleNotebookMetadata() {
		if (!this.notebookMetadataViewModel) {
			return;
		}

		if (this.ignoreMetadata) {
			if (this._items.length && this._items[0] === this.notebookMetadataViewModel) {
				this._items.splice(0, 1);
				this._onDidChangeItems.fire({ start: 0, deleteCount: 1, elements: [] });
			}
		} else {
			if (!this._items.length || this._items[0] !== this.notebookMetadataViewModel) {
				this._items.splice(0, 0, this.notebookMetadataViewModel);
				this._onDidChangeItems.fire({ start: 0, deleteCount: 0, elements: [this.notebookMetadataViewModel] });
			}
		}
	}
	private updateDiffEditorItems() {
		this.diffEditorItems = [];
		const originalSourceUri = this.model.original.resource!;
		const modifiedSourceUri = this.model.modified.resource!;
		this._hasUnchangedCells = false;
		this.items.forEach(item => {
			switch (item.type) {
				case 'delete': {
					this.diffEditorItems.push(new NotebookMultiDiffEditorCellItem(item.original!.uri, undefined, item.type, item.type));
					const originalMetadata = CellUri.generateCellPropertyUri(originalSourceUri, item.original!.handle, Schemas.vscodeNotebookCellMetadata);
					this.diffEditorItems.push(new NotebookMultiDiffEditorMetadataItem(originalMetadata, undefined, item.type, item.type));
					const originalOutput = CellUri.generateCellPropertyUri(originalSourceUri, item.original!.handle, Schemas.vscodeNotebookCellOutput);
					this.diffEditorItems.push(new NotebookMultiDiffEditorOutputItem(originalOutput, undefined, item.type, item.type));
					break;
				}
				case 'insert': {
					this.diffEditorItems.push(new NotebookMultiDiffEditorCellItem(undefined, item.modified!.uri, item.type, item.type));
					const modifiedMetadata = CellUri.generateCellPropertyUri(modifiedSourceUri, item.modified!.handle, Schemas.vscodeNotebookCellMetadata);
					this.diffEditorItems.push(new NotebookMultiDiffEditorMetadataItem(undefined, modifiedMetadata, item.type, item.type));
					const modifiedOutput = CellUri.generateCellPropertyUri(modifiedSourceUri, item.modified!.handle, Schemas.vscodeNotebookCellOutput);
					this.diffEditorItems.push(new NotebookMultiDiffEditorOutputItem(undefined, modifiedOutput, item.type, item.type));
					break;
				}
				case 'modified': {
					const cellType = item.checkIfInputModified() ? item.type : 'unchanged';
					const containerChanged = (item.checkIfInputModified() || item.checkMetadataIfModified() || item.checkIfOutputsModified()) ? item.type : 'unchanged';
					this.diffEditorItems.push(new NotebookMultiDiffEditorCellItem(item.original!.uri, item.modified!.uri, cellType, containerChanged));
					const originalMetadata = CellUri.generateCellPropertyUri(originalSourceUri, item.original!.handle, Schemas.vscodeNotebookCellMetadata);
					const modifiedMetadata = CellUri.generateCellPropertyUri(modifiedSourceUri, item.modified!.handle, Schemas.vscodeNotebookCellMetadata);
					this.diffEditorItems.push(new NotebookMultiDiffEditorMetadataItem(originalMetadata, modifiedMetadata, item.checkMetadataIfModified() ? item.type : 'unchanged', containerChanged));
					const originalOutput = CellUri.generateCellPropertyUri(originalSourceUri, item.original!.handle, Schemas.vscodeNotebookCellOutput);
					const modifiedOutput = CellUri.generateCellPropertyUri(modifiedSourceUri, item.modified!.handle, Schemas.vscodeNotebookCellOutput);
					this.diffEditorItems.push(new NotebookMultiDiffEditorOutputItem(originalOutput, modifiedOutput, item.checkIfOutputsModified() ? item.type : 'unchanged', containerChanged));
					break;
				}
				case 'unchanged': {
					this._hasUnchangedCells = true;
					this.diffEditorItems.push(new NotebookMultiDiffEditorCellItem(item.original!.uri, item.modified!.uri, item.type, item.type));
					const originalMetadata = CellUri.generateCellPropertyUri(originalSourceUri, item.original!.handle, Schemas.vscodeNotebookCellMetadata);
					const modifiedMetadata = CellUri.generateCellPropertyUri(modifiedSourceUri, item.modified!.handle, Schemas.vscodeNotebookCellMetadata);
					this.diffEditorItems.push(new NotebookMultiDiffEditorMetadataItem(originalMetadata, modifiedMetadata, item.type, item.type));
					const originalOutput = CellUri.generateCellPropertyUri(originalSourceUri, item.original!.handle, Schemas.vscodeNotebookCellOutput);
					const modifiedOutput = CellUri.generateCellPropertyUri(modifiedSourceUri, item.modified!.handle, Schemas.vscodeNotebookCellOutput);
					this.diffEditorItems.push(new NotebookMultiDiffEditorOutputItem(originalOutput, modifiedOutput, item.type, item.type));
					break;
				}
			}
		});

		this._onDidChange.fire();
	}

	private async updateViewModels(cellDiffInfo: CellDiffInfo[], metadataChanged: boolean, firstChangeIndex: number) {
		const cellViewModels = await this.createDiffViewModels(cellDiffInfo, metadataChanged);
		const oldLength = this._items.length;
		this.clear();
		this._items.splice(0, oldLength);

		let placeholder: DiffElementPlaceholderViewModel | undefined = undefined;
		this.originalCellViewModels = cellViewModels;
		cellViewModels.forEach((vm, index) => {
			if (vm.type === 'unchanged' && !this.excludeUnchangedPlaceholder) {
				if (!placeholder) {
					vm.displayIconToHideUnmodifiedCells = true;
					placeholder = new DiffElementPlaceholderViewModel(vm.mainDocumentTextModel, vm.editorEventDispatcher, vm.initData);
					this._items.push(placeholder);
					const placeholderItem = placeholder;

					this.disposables.add(placeholderItem.onUnfoldHiddenCells(() => {
						const hiddenCellViewModels = this.placeholderAndRelatedCells.get(placeholderItem);
						if (!Array.isArray(hiddenCellViewModels)) {
							return;
						}
						const start = this._items.indexOf(placeholderItem);
						this._items.splice(start, 1, ...hiddenCellViewModels);
						this._onDidChangeItems.fire({ start, deleteCount: 1, elements: hiddenCellViewModels });
					}));
					this.disposables.add(vm.onHideUnchangedCells(() => {
						const hiddenCellViewModels = this.placeholderAndRelatedCells.get(placeholderItem);
						if (!Array.isArray(hiddenCellViewModels)) {
							return;
						}
						const start = this._items.indexOf(vm);
						this._items.splice(start, hiddenCellViewModels.length, placeholderItem);
						this._onDidChangeItems.fire({ start, deleteCount: hiddenCellViewModels.length, elements: [placeholderItem] });
					}));
				}
				const hiddenCellViewModels = this.placeholderAndRelatedCells.get(placeholder) || [];
				hiddenCellViewModels.push(vm);
				this.placeholderAndRelatedCells.set(placeholder, hiddenCellViewModels);
				placeholder.hiddenCells.push(vm);
			} else {
				placeholder = undefined;
				this._items.push(vm);
			}
		});

		// Note, ensure all of the height calculations are done before firing the event.
		// This is to ensure that the diff editor is not resized multiple times, thereby avoiding flickering.
		this._onDidChangeItems.fire({ start: 0, deleteCount: oldLength, elements: this._items, firstChangeIndex });
	}
	private async createDiffViewModels(computedCellDiffs: CellDiffInfo[], metadataChanged: boolean) {
		const originalModel = this.model.original.notebook;
		const modifiedModel = this.model.modified.notebook;
		const initData = {
			metadataStatusHeight: this.configurationService.getValue('notebook.diff.ignoreMetadata') ? 0 : 25,
			outputStatusHeight: this.configurationService.getValue<boolean>('notebook.diff.ignoreOutputs') || !!(modifiedModel.transientOptions.transientOutputs) ? 0 : 25,
			fontInfo: this.fontInfo
		};

		const viewModels: (SingleSideDiffElementViewModel | SideBySideDiffElementViewModel | NotebookDocumentMetadataViewModel)[] = [];
		this.notebookMetadataViewModel = this._register(new NotebookDocumentMetadataViewModel(this.model.original.notebook, this.model.modified.notebook, metadataChanged ? 'modifiedMetadata' : 'unchangedMetadata', this.eventDispatcher, initData, this.notebookService, this.diffEditorHeightCalculator));
		if (!this.ignoreMetadata) {
			if (metadataChanged) {
				await this.notebookMetadataViewModel.computeHeights();
			}
			viewModels.push(this.notebookMetadataViewModel);
		}
		const cellViewModels = await Promise.all(computedCellDiffs.map(async (diff) => {
			switch (diff.type) {
				case 'delete': {
					return new SingleSideDiffElementViewModel(
						originalModel,
						modifiedModel,
						originalModel.cells[diff.originalCellIndex],
						undefined,
						'delete',
						this.eventDispatcher,
						initData,
						this.notebookService,
						this.configurationService,
						this.diffEditorHeightCalculator,
						diff.originalCellIndex
					);
				}
				case 'insert': {
					return new SingleSideDiffElementViewModel(
						modifiedModel,
						originalModel,
						undefined,
						modifiedModel.cells[diff.modifiedCellIndex],
						'insert',
						this.eventDispatcher,
						initData,
						this.notebookService,
						this.configurationService,
						this.diffEditorHeightCalculator,
						diff.modifiedCellIndex
					);
				}
				case 'modified': {
					const viewModel = new SideBySideDiffElementViewModel(
						this.model.modified.notebook,
						this.model.original.notebook,
						originalModel.cells[diff.originalCellIndex],
						modifiedModel.cells[diff.modifiedCellIndex],
						'modified',
						this.eventDispatcher,
						initData,
						this.notebookService,
						this.configurationService,
						diff.originalCellIndex,
						this.diffEditorHeightCalculator
					);
					// Reduces flicker (compute this before setting the model)
					// Else when the model is set, the height of the editor will be x, after diff is computed, then height will be y.
					// & that results in flicker.
					await viewModel.computeEditorHeights();
					return viewModel;
				}
				case 'unchanged': {
					return new SideBySideDiffElementViewModel(
						this.model.modified.notebook,
						this.model.original.notebook,
						originalModel.cells[diff.originalCellIndex],
						modifiedModel.cells[diff.modifiedCellIndex],
						'unchanged', this.eventDispatcher,
						initData,
						this.notebookService,
						this.configurationService,
						diff.originalCellIndex,
						this.diffEditorHeightCalculator
					);
				}
			}
		}));

		cellViewModels.forEach(vm => viewModels.push(vm));

		return viewModels;
	}

}


/**
 * making sure that swapping cells are always translated to `insert+delete`.
 */
export function prettyChanges(original: NotebookTextModel, modified: NotebookTextModel, diffResult: IDiffResult) {
	const changes = diffResult.changes;
	for (let i = 0; i < diffResult.changes.length - 1; i++) {
		// then we know there is another change after current one
		const curr = changes[i];
		const next = changes[i + 1];
		const x = curr.originalStart;
		const y = curr.modifiedStart;

		if (
			curr.originalLength === 1
			&& curr.modifiedLength === 0
			&& next.originalStart === x + 2
			&& next.originalLength === 0
			&& next.modifiedStart === y + 1
			&& next.modifiedLength === 1
			&& original.cells[x].getHashValue() === modified.cells[y + 1].getHashValue()
			&& original.cells[x + 1].getHashValue() === modified.cells[y].getHashValue()
		) {
			// this is a swap
			curr.originalStart = x;
			curr.originalLength = 0;
			curr.modifiedStart = y;
			curr.modifiedLength = 1;

			next.originalStart = x + 1;
			next.originalLength = 1;
			next.modifiedStart = y + 2;
			next.modifiedLength = 0;

			i++;
		}
	}
}

export type CellDiffInfo = {
	originalCellIndex: number;
	modifiedCellIndex: number;
	type: 'unchanged' | 'modified';
} |
{
	originalCellIndex: number;
	type: 'delete';
} |
{
	modifiedCellIndex: number;
	type: 'insert';
};

function isEqual(cellDiffInfo: CellDiffInfo[], viewModels: IDiffElementViewModelBase[], model: INotebookDiffEditorModel) {
	if (cellDiffInfo.length !== viewModels.length) {
		return false;
	}
	const originalModel = model.original.notebook;
	const modifiedModel = model.modified.notebook;
	for (let i = 0; i < viewModels.length; i++) {
		const a = cellDiffInfo[i];
		const b = viewModels[i];
		if (a.type !== b.type) {
			return false;
		}
		switch (a.type) {
			case 'delete': {
				if (originalModel.cells[a.originalCellIndex].handle !== b.original?.handle) {
					return false;
				}
				continue;
			}
			case 'insert': {
				if (modifiedModel.cells[a.modifiedCellIndex].handle !== b.modified?.handle) {
					return false;
				}
				continue;
			}
			default: {
				if (originalModel.cells[a.originalCellIndex].handle !== b.original?.handle) {
					return false;
				}
				if (modifiedModel.cells[a.modifiedCellIndex].handle !== b.modified?.handle) {
					return false;
				}
				continue;
			}
		}
	}

	return true;
}
export abstract class NotebookMultiDiffEditorItem extends MultiDiffEditorItem {
	constructor(
		originalUri: URI | undefined,
		modifiedUri: URI | undefined,
		goToFileUri: URI | undefined,
		public readonly type: IDiffElementViewModelBase['type'],
		public readonly containerType: IDiffElementViewModelBase['type'],
		public kind: 'Cell' | 'Metadata' | 'Output',
		contextKeys?: Record<string, ContextKeyValue>,
	) {
		super(originalUri, modifiedUri, goToFileUri, undefined, contextKeys);
	}
}

class NotebookMultiDiffEditorCellItem extends NotebookMultiDiffEditorItem {
	constructor(
		originalUri: URI | undefined,
		modifiedUri: URI | undefined,
		type: IDiffElementViewModelBase['type'],
		containerType: IDiffElementViewModelBase['type'],
	) {
		super(originalUri, modifiedUri, modifiedUri || originalUri, type, containerType, 'Cell', {
			[NOTEBOOK_DIFF_ITEM_KIND.key]: 'Cell',
			[NOTEBOOK_DIFF_ITEM_DIFF_STATE.key]: type
		});
	}
}

class NotebookMultiDiffEditorMetadataItem extends NotebookMultiDiffEditorItem {
	constructor(
		originalUri: URI | undefined,
		modifiedUri: URI | undefined,
		type: IDiffElementViewModelBase['type'],
		containerType: IDiffElementViewModelBase['type'],
	) {
		super(originalUri, modifiedUri, modifiedUri || originalUri, type, containerType, 'Metadata', {
			[NOTEBOOK_DIFF_ITEM_KIND.key]: 'Metadata',
			[NOTEBOOK_DIFF_ITEM_DIFF_STATE.key]: type
		});
	}
}

class NotebookMultiDiffEditorOutputItem extends NotebookMultiDiffEditorItem {
	constructor(
		originalUri: URI | undefined,
		modifiedUri: URI | undefined,
		type: IDiffElementViewModelBase['type'],
		containerType: IDiffElementViewModelBase['type'],
	) {
		super(originalUri, modifiedUri, modifiedUri || originalUri, type, containerType, 'Output', {
			[NOTEBOOK_DIFF_ITEM_KIND.key]: 'Output',
			[NOTEBOOK_DIFF_ITEM_DIFF_STATE.key]: type
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/notebookMultiDiffEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/notebookMultiDiffEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../base/browser/dom.js';
import { IWorkbenchUIElementFactory, type IResourceLabel } from '../../../../../editor/browser/widget/multiDiffEditor/workbenchUIElementFactory.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { IEditorOpenContext } from '../../../../common/editor.js';
import { IEditorGroup } from '../../../../services/editor/common/editorGroupsService.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { INotebookEditorWorkerService } from '../../common/services/notebookWorkerService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IEditorOptions as ICodeEditorOptions } from '../../../../../editor/common/config/editorOptions.js';
import { FontInfo } from '../../../../../editor/common/config/fontInfo.js';
import { createBareFontInfoFromRawSettings } from '../../../../../editor/common/config/fontInfoFromSettings.js';
import { PixelRatio } from '../../../../../base/browser/pixelRatio.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { EditorPane } from '../../../../browser/parts/editor/editorPane.js';
import { CellUri, INotebookDiffEditorModel, NOTEBOOK_MULTI_DIFF_EDITOR_ID } from '../../common/notebookCommon.js';
import { FontMeasurements } from '../../../../../editor/browser/config/fontMeasurements.js';
import { NotebookOptions } from '../notebookOptions.js';
import { INotebookService } from '../../common/notebookService.js';
import { NotebookMultiDiffEditorInput, NotebookMultiDiffEditorWidgetInput } from './notebookMultiDiffEditorInput.js';
import { MultiDiffEditorWidget } from '../../../../../editor/browser/widget/multiDiffEditor/multiDiffEditorWidget.js';
import { ResourceLabel } from '../../../../browser/labels.js';
import type { IMultiDiffEditorOptions } from '../../../../../editor/browser/widget/multiDiffEditor/multiDiffEditorWidgetImpl.js';
import { INotebookDocumentService } from '../../../../services/notebook/common/notebookDocumentService.js';
import { localize } from '../../../../../nls.js';
import { Schemas } from '../../../../../base/common/network.js';
import { getIconClassesForLanguageId } from '../../../../../editor/common/services/getIconClasses.js';
import { NotebookDiffViewModel } from './notebookDiffViewModel.js';
import { NotebookDiffEditorEventDispatcher } from './eventDispatcher.js';
import { NOTEBOOK_DIFF_CELLS_COLLAPSED, NOTEBOOK_DIFF_HAS_UNCHANGED_CELLS, NOTEBOOK_DIFF_UNCHANGED_CELLS_HIDDEN } from './notebookDiffEditorBrowser.js';
import type { DocumentDiffItemViewModel, MultiDiffEditorViewModel } from '../../../../../editor/browser/widget/multiDiffEditor/multiDiffEditorViewModel.js';
import type { URI } from '../../../../../base/common/uri.js';
import { type IDiffElementViewModelBase } from './diffElementViewModel.js';
import { autorun, transaction } from '../../../../../base/common/observable.js';
import { DiffEditorHeightCalculatorService } from './editorHeightCalculator.js';

export class NotebookMultiTextDiffEditor extends EditorPane {
	private _multiDiffEditorWidget?: MultiDiffEditorWidget;
	static readonly ID: string = NOTEBOOK_MULTI_DIFF_EDITOR_ID;
	private _fontInfo: FontInfo | undefined;
	protected _scopeContextKeyService!: IContextKeyService;
	private readonly modelSpecificResources: DisposableStore;
	private _model?: INotebookDiffEditorModel;
	private viewModel?: NotebookDiffViewModel;
	private widgetViewModel?: MultiDiffEditorViewModel;
	get textModel() {
		return this._model?.modified.notebook;
	}
	private _notebookOptions: NotebookOptions;
	get notebookOptions() {
		return this._notebookOptions;
	}
	private readonly ctxAllCollapsed: IContextKey<boolean>;
	private readonly ctxHasUnchangedCells: IContextKey<boolean>;
	private readonly ctxHiddenUnchangedCells: IContextKey<boolean>;

	constructor(
		group: IEditorGroup,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IContextKeyService private readonly _parentContextKeyService: IContextKeyService,
		@INotebookEditorWorkerService private readonly notebookEditorWorkerService: INotebookEditorWorkerService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IStorageService storageService: IStorageService,
		@INotebookService private readonly notebookService: INotebookService,
	) {
		super(NotebookMultiTextDiffEditor.ID, group, telemetryService, themeService, storageService);
		this.modelSpecificResources = this._register(new DisposableStore());
		this.ctxAllCollapsed = this._parentContextKeyService.createKey<boolean>(NOTEBOOK_DIFF_CELLS_COLLAPSED.key, false);
		this.ctxHasUnchangedCells = this._parentContextKeyService.createKey<boolean>(NOTEBOOK_DIFF_HAS_UNCHANGED_CELLS.key, false);
		this.ctxHiddenUnchangedCells = this._parentContextKeyService.createKey<boolean>(NOTEBOOK_DIFF_UNCHANGED_CELLS_HIDDEN.key, true);
		this._notebookOptions = instantiationService.createInstance(NotebookOptions, this.window, false, undefined);
		this._register(this._notebookOptions);
	}

	private get fontInfo() {
		if (!this._fontInfo) {
			this._fontInfo = this.createFontInfo();
		}

		return this._fontInfo;
	}
	override layout(dimension: DOM.Dimension, position?: DOM.IDomPosition): void {
		this._multiDiffEditorWidget!.layout(dimension);
	}

	private createFontInfo() {
		const editorOptions = this.configurationService.getValue<ICodeEditorOptions>('editor');
		return FontMeasurements.readFontInfo(this.window, createBareFontInfoFromRawSettings(editorOptions, PixelRatio.getInstance(this.window).value));
	}

	protected createEditor(parent: HTMLElement): void {
		this._multiDiffEditorWidget = this._register(this.instantiationService.createInstance(
			MultiDiffEditorWidget,
			parent,
			this.instantiationService.createInstance(WorkbenchUIElementFactory),
		));

		this._register(this._multiDiffEditorWidget.onDidChangeActiveControl(() => {
			this._onDidChangeControl.fire();
		}));
	}
	override async setInput(input: NotebookMultiDiffEditorInput, options: IMultiDiffEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		super.setInput(input, options, context, token);
		const model = await input.resolve();
		if (this._model !== model) {
			this._detachModel();
			this._model = model;
		}
		const eventDispatcher = this.modelSpecificResources.add(new NotebookDiffEditorEventDispatcher());
		const diffEditorHeightCalculator = this.instantiationService.createInstance(DiffEditorHeightCalculatorService, this.fontInfo.lineHeight);
		this.viewModel = this.modelSpecificResources.add(new NotebookDiffViewModel(model, this.notebookEditorWorkerService, this.configurationService, eventDispatcher, this.notebookService, diffEditorHeightCalculator, undefined, true));
		await this.viewModel.computeDiff(this.modelSpecificResources.add(new CancellationTokenSource()).token);
		this.ctxHasUnchangedCells.set(this.viewModel.hasUnchangedCells);
		this.ctxHasUnchangedCells.set(this.viewModel.hasUnchangedCells);

		const widgetInput = this.modelSpecificResources.add(NotebookMultiDiffEditorWidgetInput.createInput(this.viewModel, this.instantiationService));
		this.widgetViewModel = this.modelSpecificResources.add(await widgetInput.getViewModel());

		const itemsWeHaveSeen = new WeakSet<DocumentDiffItemViewModel>();
		this.modelSpecificResources.add(autorun(reader => {
			/** @description NotebookDiffEditor => Collapse unmodified items */
			if (!this.widgetViewModel || !this.viewModel) {
				return;
			}
			const items = this.widgetViewModel.items.read(reader);
			const diffItems = this.viewModel.value;
			if (items.length !== diffItems.length) {
				return;
			}

			// If cell has not changed, but metadata or output has changed, then collapse the cell & keep output/metadata expanded.
			// Similarly if the cell has changed, but the metadata or output has not, then expand the cell, but collapse output/metadata.
			transaction((tx) => {
				items.forEach(item => {
					// We do not want to mess with UI state if users change it, hence no need to collapse again.
					if (itemsWeHaveSeen.has(item)) {
						return;
					}
					itemsWeHaveSeen.add(item);
					const diffItem = diffItems.find(d => d.modifiedUri?.toString() === item.modifiedUri?.toString() && d.originalUri?.toString() === item.originalUri?.toString());
					if (diffItem && diffItem.type === 'unchanged') {
						item.collapsed.set(true, tx);
					}
				});
			});
		}));


		this._multiDiffEditorWidget!.setViewModel(this.widgetViewModel);
	}

	private _detachModel() {
		this.viewModel = undefined;
		this.modelSpecificResources.clear();
	}
	_generateFontFamily(): string {
		return this.fontInfo.fontFamily ?? `"SF Mono", Monaco, Menlo, Consolas, "Ubuntu Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace`;
	}
	override setOptions(options: IMultiDiffEditorOptions | undefined): void {
		super.setOptions(options);
	}

	override getControl() {
		return this._multiDiffEditorWidget!.getActiveControl();
	}

	override focus(): void {
		super.focus();

		this._multiDiffEditorWidget?.getActiveControl()?.focus();
	}

	override hasFocus(): boolean {
		return this._multiDiffEditorWidget?.getActiveControl()?.hasTextFocus() || super.hasFocus();
	}

	override clearInput(): void {
		super.clearInput();
		this._multiDiffEditorWidget!.setViewModel(undefined);
		this.modelSpecificResources.clear();
		this.viewModel = undefined;
		this.widgetViewModel = undefined;
	}

	public expandAll() {
		if (this.widgetViewModel) {
			this.widgetViewModel.expandAll();
			this.ctxAllCollapsed.set(false);
		}
	}
	public collapseAll() {
		if (this.widgetViewModel) {
			this.widgetViewModel.collapseAll();
			this.ctxAllCollapsed.set(true);
		}
	}

	public hideUnchanged() {
		if (this.viewModel) {
			this.viewModel.includeUnchanged = false;
			this.ctxHiddenUnchangedCells.set(true);
		}
	}

	public showUnchanged() {
		if (this.viewModel) {
			this.viewModel.includeUnchanged = true;
			this.ctxHiddenUnchangedCells.set(false);
		}
	}

	public getDiffElementViewModel(uri: URI): IDiffElementViewModelBase | undefined {
		if (uri.scheme === Schemas.vscodeNotebookCellOutput || uri.scheme === Schemas.vscodeNotebookCellOutputDiff ||
			uri.scheme === Schemas.vscodeNotebookCellMetadata || uri.scheme === Schemas.vscodeNotebookCellMetadataDiff
		) {
			const data = CellUri.parseCellPropertyUri(uri, uri.scheme);
			if (data) {
				uri = CellUri.generate(data.notebook, data.handle);
			}
		}
		if (uri.scheme === Schemas.vscodeNotebookMetadata) {
			return this.viewModel?.items.find(item =>
				item.type === 'modifiedMetadata' ||
				item.type === 'unchangedMetadata'
			);
		}
		return this.viewModel?.items.find(c => {
			switch (c.type) {
				case 'delete':
					return c.original?.uri.toString() === uri.toString();
				case 'insert':
					return c.modified?.uri.toString() === uri.toString();
				case 'modified':
				case 'unchanged':
					return c.modified?.uri.toString() === uri.toString() || c.original?.uri.toString() === uri.toString();
				default:
					return;
			}
		});
	}
}


class WorkbenchUIElementFactory implements IWorkbenchUIElementFactory {
	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@INotebookDocumentService private readonly notebookDocumentService: INotebookDocumentService,
		@INotebookService private readonly notebookService: INotebookService
	) { }

	createResourceLabel(element: HTMLElement): IResourceLabel {
		const label = this._instantiationService.createInstance(ResourceLabel, element, {});
		const that = this;
		return {
			setUri(uri, options = {}) {
				if (!uri) {
					label.element.clear();
				} else {
					let name = '';
					let description = '';
					let extraClasses: string[] | undefined = undefined;

					if (uri.scheme === Schemas.vscodeNotebookCell) {
						const notebookDocument = uri.scheme === Schemas.vscodeNotebookCell ? that.notebookDocumentService.getNotebook(uri) : undefined;
						const cellIndex = Schemas.vscodeNotebookCell ? that.notebookDocumentService.getNotebook(uri)?.getCellIndex(uri) : undefined;
						if (notebookDocument && cellIndex !== undefined) {
							name = localize('notebookCellLabel', "Cell {0}", `${cellIndex + 1}`);
							const nb = notebookDocument ? that.notebookService.getNotebookTextModel(notebookDocument?.uri) : undefined;
							const cellLanguage = nb && cellIndex !== undefined ? nb.cells[cellIndex].language : undefined;
							extraClasses = cellLanguage ? getIconClassesForLanguageId(cellLanguage) : undefined;
						}
					} else if (uri.scheme === Schemas.vscodeNotebookCellMetadata || uri.scheme === Schemas.vscodeNotebookCellMetadataDiff) {
						description = localize('notebookCellMetadataLabel', "Metadata");
					} else if (uri.scheme === Schemas.vscodeNotebookCellOutput || uri.scheme === Schemas.vscodeNotebookCellOutputDiff) {
						description = localize('notebookCellOutputLabel', "Output");
					}

					label.element.setResource({ name, description }, { strikethrough: options.strikethrough, forceLabel: true, hideIcon: !extraClasses, extraClasses });
				}
			},
			dispose() {
				label.dispose();
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/notebookMultiDiffEditorInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/notebookMultiDiffEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../base/common/uri.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { ITextResourceConfigurationService } from '../../../../../editor/common/services/textResourceConfiguration.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { MultiDiffEditorInput } from '../../../multiDiffEditor/browser/multiDiffEditorInput.js';
import { IMultiDiffSourceResolverService, IResolvedMultiDiffSource, type IMultiDiffSourceResolver } from '../../../multiDiffEditor/browser/multiDiffSourceResolverService.js';
import { NotebookDiffViewModel } from './notebookDiffViewModel.js';
import { NotebookDiffEditorInput } from '../../common/notebookDiffEditorInput.js';
import { NotebookEditorInput } from '../../common/notebookEditorInput.js';
import { ITextFileService } from '../../../../services/textfile/common/textfiles.js';

export const NotebookMultiDiffEditorScheme = 'multi-cell-notebook-diff-editor';

export class NotebookMultiDiffEditorInput extends NotebookDiffEditorInput {
	static override readonly ID: string = 'workbench.input.multiDiffNotebookInput';
	static override create(instantiationService: IInstantiationService, resource: URI, name: string | undefined, description: string | undefined, originalResource: URI, viewType: string) {
		const original = NotebookEditorInput.getOrCreate(instantiationService, originalResource, undefined, viewType);
		const modified = NotebookEditorInput.getOrCreate(instantiationService, resource, undefined, viewType);
		return instantiationService.createInstance(NotebookMultiDiffEditorInput, name, description, original, modified, viewType);
	}
}

export class NotebookMultiDiffEditorWidgetInput extends MultiDiffEditorInput implements IMultiDiffSourceResolver {
	public static createInput(notebookDiffViewModel: NotebookDiffViewModel, instantiationService: IInstantiationService): NotebookMultiDiffEditorWidgetInput {
		const multiDiffSource = URI.parse(`${NotebookMultiDiffEditorScheme}:${new Date().getMilliseconds().toString() + Math.random().toString()}`);
		return instantiationService.createInstance(
			NotebookMultiDiffEditorWidgetInput,
			multiDiffSource,
			notebookDiffViewModel
		);
	}
	constructor(
		multiDiffSource: URI,
		private readonly notebookDiffViewModel: NotebookDiffViewModel,
		@ITextModelService _textModelService: ITextModelService,
		@ITextResourceConfigurationService _textResourceConfigurationService: ITextResourceConfigurationService,
		@IInstantiationService _instantiationService: IInstantiationService,
		@IMultiDiffSourceResolverService _multiDiffSourceResolverService: IMultiDiffSourceResolverService,
		@ITextFileService _textFileService: ITextFileService,
	) {
		super(multiDiffSource, undefined, undefined, true, _textModelService, _textResourceConfigurationService, _instantiationService, _multiDiffSourceResolverService, _textFileService);
		this._register(_multiDiffSourceResolverService.registerResolver(this));
	}

	canHandleUri(uri: URI): boolean {
		return uri.toString() === this.multiDiffSource.toString();
	}

	async resolveDiffSource(_: URI): Promise<IResolvedMultiDiffSource> {
		return { resources: this.notebookDiffViewModel };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/unchangedEditorRegions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/unchangedEditorRegions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';

export type UnchangedEditorRegionOptions = {
	options: {
		enabled: boolean;
		contextLineCount: number;
		minimumLineCount: number;
		revealLineCount: number;
	};
	readonly onDidChangeEnablement: Event<boolean>;
};

export function getUnchangedRegionSettings(configurationService: IConfigurationService): (Readonly<UnchangedEditorRegionOptions> & IDisposable) {
	return createHideUnchangedRegionOptions(configurationService);
}

function createHideUnchangedRegionOptions(configurationService: IConfigurationService): UnchangedEditorRegionOptions & { dispose: () => void } {
	const disposables = new DisposableStore();
	const unchangedRegionsEnablementEmitter = disposables.add(new Emitter<boolean>());

	const result = {
		options: {
			enabled: configurationService.getValue<boolean>('diffEditor.hideUnchangedRegions.enabled'),
			minimumLineCount: configurationService.getValue<number>('diffEditor.hideUnchangedRegions.minimumLineCount'),
			contextLineCount: configurationService.getValue<number>('diffEditor.hideUnchangedRegions.contextLineCount'),
			revealLineCount: configurationService.getValue<number>('diffEditor.hideUnchangedRegions.revealLineCount'),
		},
		// We only care about enable/disablement.
		// If user changes counters when a diff editor is open, we do not care, might as well ask user to reload.
		// Simpler and almost never going to happen.
		onDidChangeEnablement: unchangedRegionsEnablementEmitter.event.bind(unchangedRegionsEnablementEmitter),
		dispose: () => disposables.dispose()
	};

	disposables.add(configurationService.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('diffEditor.hideUnchangedRegions.minimumLineCount')) {
			result.options.minimumLineCount = configurationService.getValue<number>('diffEditor.hideUnchangedRegions.minimumLineCount');
		}
		if (e.affectsConfiguration('diffEditor.hideUnchangedRegions.contextLineCount')) {
			result.options.contextLineCount = configurationService.getValue<number>('diffEditor.hideUnchangedRegions.contextLineCount');
		}
		if (e.affectsConfiguration('diffEditor.hideUnchangedRegions.revealLineCount')) {
			result.options.revealLineCount = configurationService.getValue<number>('diffEditor.hideUnchangedRegions.revealLineCount');
		}
		if (e.affectsConfiguration('diffEditor.hideUnchangedRegions.enabled')) {
			result.options.enabled = configurationService.getValue('diffEditor.hideUnchangedRegions.enabled');
			unchangedRegionsEnablementEmitter.fire(result.options.enabled);
		}

	}));

	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookCellDiffDecorator.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookCellDiffDecorator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore, toDisposable } from '../../../../../../base/common/lifecycle.js';
import { autorunWithStore, derived, observableFromEvent } from '../../../../../../base/common/observable.js';
import { INotebookEditor } from '../../notebookBrowser.js';
import { ThrottledDelayer } from '../../../../../../base/common/async.js';
import { ICodeEditor, IViewZone } from '../../../../../../editor/browser/editorBrowser.js';
import { IEditorWorkerService } from '../../../../../../editor/common/services/editorWorker.js';
import { EditorOption } from '../../../../../../editor/common/config/editorOptions.js';
import { themeColorFromId } from '../../../../../../base/common/themables.js';
import { RenderOptions, LineSource, renderLines } from '../../../../../../editor/browser/widget/diffEditor/components/diffEditorViewZones/renderLines.js';
import { diffAddDecoration, diffWholeLineAddDecoration, diffDeleteDecoration } from '../../../../../../editor/browser/widget/diffEditor/registrations.contribution.js';
import { IDocumentDiff } from '../../../../../../editor/common/diff/documentDiffProvider.js';
import { ITextModel, TrackedRangeStickiness, MinimapPosition, IModelDeltaDecoration, OverviewRulerLane } from '../../../../../../editor/common/model.js';
import { ModelDecorationOptions } from '../../../../../../editor/common/model/textModel.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { NotebookCellTextModel } from '../../../common/model/notebookCellTextModel.js';
import { DetailedLineRangeMapping } from '../../../../../../editor/common/diff/rangeMapping.js';
import { minimapGutterAddedBackground, minimapGutterDeletedBackground, minimapGutterModifiedBackground, overviewRulerAddedForeground, overviewRulerDeletedForeground, overviewRulerModifiedForeground } from '../../../../scm/common/quickDiff.js';
import { INotebookOriginalCellModelFactory } from './notebookOriginalCellModelFactory.js';
import { InlineDecoration, InlineDecorationType } from '../../../../../../editor/common/viewModel/inlineDecorations.js';

//TODO: allow client to set read-only - chateditsession should set read-only while making changes
export class NotebookCellDiffDecorator extends DisposableStore {
	private _viewZones: string[] = [];
	private readonly throttledDecorator = new ThrottledDelayer(50);
	private diffForPreviouslyAppliedDecorators?: IDocumentDiff;

	private readonly perEditorDisposables = this.add(new DisposableStore());
	constructor(
		notebookEditor: INotebookEditor,
		public readonly modifiedCell: NotebookCellTextModel,
		public readonly originalCell: NotebookCellTextModel,
		private readonly editor: ICodeEditor,
		@IEditorWorkerService private readonly _editorWorkerService: IEditorWorkerService,
		@INotebookOriginalCellModelFactory private readonly originalCellModelFactory: INotebookOriginalCellModelFactory,

	) {
		super();

		const onDidChangeVisibleRanges = observableFromEvent(notebookEditor.onDidChangeVisibleRanges, () => notebookEditor.visibleRanges);
		const editorObs = derived((r) => {
			const visibleRanges = onDidChangeVisibleRanges.read(r);
			const visibleCellHandles = visibleRanges.map(range => notebookEditor.getCellsInRange(range)).flat().map(c => c.handle);
			if (!visibleCellHandles.includes(modifiedCell.handle)) {
				return;
			}
			const editor = notebookEditor.codeEditors.find(item => item[0].handle === modifiedCell.handle)?.[1];
			if (editor?.getModel() !== this.modifiedCell.textModel) {
				return;
			}
			return editor;
		});

		this.add(autorunWithStore((r, store) => {
			const editor = editorObs.read(r);
			this.perEditorDisposables.clear();

			if (editor) {
				store.add(editor.onDidChangeModel(() => {
					this.perEditorDisposables.clear();
				}));
				store.add(editor.onDidChangeModelContent(() => {
					this.update(editor);
				}));
				store.add(editor.onDidChangeConfiguration((e) => {
					if (e.hasChanged(EditorOption.fontInfo) || e.hasChanged(EditorOption.lineHeight)) {
						this.update(editor);
					}
				}));
				this.update(editor);
			}
		}));
	}

	public update(editor: ICodeEditor): void {
		this.throttledDecorator.trigger(() => this._updateImpl(editor));
	}

	private async _updateImpl(editor: ICodeEditor) {
		if (this.isDisposed) {
			return;
		}
		if (editor.getOption(EditorOption.inDiffEditor)) {
			this.perEditorDisposables.clear();
			return;
		}
		const model = editor.getModel();
		if (!model || model !== this.modifiedCell.textModel) {
			this.perEditorDisposables.clear();
			return;
		}

		const originalModel = this.getOrCreateOriginalModel(editor);
		if (!originalModel) {
			this.perEditorDisposables.clear();
			return;
		}
		const version = model.getVersionId();
		const diff = await this._editorWorkerService.computeDiff(
			originalModel.uri,
			model.uri,
			{ computeMoves: true, ignoreTrimWhitespace: false, maxComputationTimeMs: Number.MAX_SAFE_INTEGER },
			'advanced'
		);


		if (this.isDisposed) {
			return;
		}


		if (diff && !diff.identical && this.modifiedCell.textModel && originalModel && model === editor.getModel() && editor.getModel()?.getVersionId() === version) {
			this._updateWithDiff(editor, originalModel, diff, this.modifiedCell.textModel);
		} else {
			this.perEditorDisposables.clear();
		}
	}

	private _originalModel?: ITextModel;
	private getOrCreateOriginalModel(editor: ICodeEditor) {
		if (!this._originalModel) {
			const model = editor.getModel();
			if (!model) {
				return;
			}
			this._originalModel = this.add(this.originalCellModelFactory.getOrCreate(model.uri, this.originalCell.getValue(), model.getLanguageId(), this.modifiedCell.cellKind)).object;
		}
		return this._originalModel;
	}

	private _updateWithDiff(editor: ICodeEditor, originalModel: ITextModel, diff: IDocumentDiff, currentModel: ITextModel): void {
		if (areDiffsEqual(diff, this.diffForPreviouslyAppliedDecorators)) {
			return;
		}
		this.perEditorDisposables.clear();
		const decorations = editor.createDecorationsCollection();
		this.perEditorDisposables.add(toDisposable(() => {
			editor.changeViewZones((viewZoneChangeAccessor) => {
				for (const id of this._viewZones) {
					viewZoneChangeAccessor.removeZone(id);
				}
			});
			this._viewZones = [];
			decorations.clear();
			this.diffForPreviouslyAppliedDecorators = undefined;
		}));

		this.diffForPreviouslyAppliedDecorators = diff;

		const chatDiffAddDecoration = ModelDecorationOptions.createDynamic({
			...diffAddDecoration,
			stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
		});
		const chatDiffWholeLineAddDecoration = ModelDecorationOptions.createDynamic({
			...diffWholeLineAddDecoration,
			stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		});
		const createOverviewDecoration = (overviewRulerColor: string, minimapColor: string) => {
			return ModelDecorationOptions.createDynamic({
				description: 'chat-editing-decoration',
				overviewRuler: { color: themeColorFromId(overviewRulerColor), position: OverviewRulerLane.Left },
				minimap: { color: themeColorFromId(minimapColor), position: MinimapPosition.Gutter },
			});
		};
		const modifiedDecoration = createOverviewDecoration(overviewRulerModifiedForeground, minimapGutterModifiedBackground);
		const addedDecoration = createOverviewDecoration(overviewRulerAddedForeground, minimapGutterAddedBackground);
		const deletedDecoration = createOverviewDecoration(overviewRulerDeletedForeground, minimapGutterDeletedBackground);

		editor.changeViewZones((viewZoneChangeAccessor) => {
			for (const id of this._viewZones) {
				viewZoneChangeAccessor.removeZone(id);
			}
			this._viewZones = [];
			const modifiedVisualDecorations: IModelDeltaDecoration[] = [];
			const mightContainNonBasicASCII = originalModel.mightContainNonBasicASCII();
			const mightContainRTL = originalModel.mightContainRTL();
			const renderOptions = RenderOptions.fromEditor(this.editor);
			const editorLineCount = currentModel.getLineCount();
			for (const diffEntry of diff.changes) {

				const originalRange = diffEntry.original;
				originalModel.tokenization.forceTokenization(Math.max(1, originalRange.endLineNumberExclusive - 1));
				const source = new LineSource(
					originalRange.mapToLineArray(l => originalModel.tokenization.getLineTokens(l)),
					[],
					mightContainNonBasicASCII,
					mightContainRTL,
				);
				const decorations: InlineDecoration[] = [];

				for (const i of diffEntry.innerChanges || []) {
					decorations.push(new InlineDecoration(
						i.originalRange.delta(-(diffEntry.original.startLineNumber - 1)),
						diffDeleteDecoration.className!,
						InlineDecorationType.Regular
					));

					// If the original range is empty, the start line number is 1 and the new range spans the entire file, don't draw an Added decoration
					if (!(i.originalRange.isEmpty() && i.originalRange.startLineNumber === 1 && i.modifiedRange.endLineNumber === editorLineCount) && !i.modifiedRange.isEmpty()) {
						modifiedVisualDecorations.push({
							range: i.modifiedRange, options: chatDiffAddDecoration
						});
					}
				}

				// Render an added decoration but don't also render a deleted decoration for newly inserted content at the start of the file
				// Note, this is a workaround for the `LineRange.isEmpty()` in diffEntry.original being `false` for newly inserted content
				const isCreatedContent = decorations.length === 1 && decorations[0].range.isEmpty() && diffEntry.original.startLineNumber === 1;

				if (!diffEntry.modified.isEmpty && !(isCreatedContent && (diffEntry.modified.endLineNumberExclusive - 1) === editorLineCount)) {
					modifiedVisualDecorations.push({
						range: diffEntry.modified.toInclusiveRange()!,
						options: chatDiffWholeLineAddDecoration
					});
				}

				if (diffEntry.original.isEmpty) {
					// insertion
					modifiedVisualDecorations.push({
						range: diffEntry.modified.toInclusiveRange()!,
						options: addedDecoration
					});
				} else if (diffEntry.modified.isEmpty) {
					// deletion
					modifiedVisualDecorations.push({
						range: new Range(diffEntry.modified.startLineNumber - 1, 1, diffEntry.modified.startLineNumber, 1),
						options: deletedDecoration
					});
				} else {
					// modification
					modifiedVisualDecorations.push({
						range: diffEntry.modified.toInclusiveRange()!,
						options: modifiedDecoration
					});
				}

				const domNode = document.createElement('div');
				domNode.className = 'chat-editing-original-zone view-lines line-delete monaco-mouse-cursor-text';
				const result = renderLines(source, renderOptions, decorations, domNode);

				if (!isCreatedContent) {

					const viewZoneData: IViewZone = {
						afterLineNumber: diffEntry.modified.startLineNumber - 1,
						heightInLines: result.heightInLines,
						domNode,
						ordinal: 50000 + 2 // more than https://github.com/microsoft/vscode/blob/bf52a5cfb2c75a7327c9adeaefbddc06d529dcad/src/vs/workbench/contrib/inlineChat/browser/inlineChatZoneWidget.ts#L42
					};

					this._viewZones.push(viewZoneChangeAccessor.addZone(viewZoneData));
				}
			}

			decorations.set(modifiedVisualDecorations);
		});
	}
}

function areDiffsEqual(a: IDocumentDiff | undefined, b: IDocumentDiff | undefined): boolean {
	if (a && b) {
		if (a.changes.length !== b.changes.length) {
			return false;
		}
		if (a.moves.length !== b.moves.length) {
			return false;
		}
		if (!areLineRangeMappinsEqual(a.changes, b.changes)) {
			return false;
		}
		if (!a.moves.some((move, i) => {
			const bMove = b.moves[i];
			if (!areLineRangeMappinsEqual(move.changes, bMove.changes)) {
				return true;
			}
			if (move.lineRangeMapping.changedLineCount !== bMove.lineRangeMapping.changedLineCount) {
				return true;
			}
			if (!move.lineRangeMapping.modified.equals(bMove.lineRangeMapping.modified)) {
				return true;
			}
			if (!move.lineRangeMapping.original.equals(bMove.lineRangeMapping.original)) {
				return true;
			}
			return false;
		})) {
			return false;
		}
		return true;
	} else if (!a && !b) {
		return true;
	} else {
		return false;
	}
}

function areLineRangeMappinsEqual(a: readonly DetailedLineRangeMapping[], b: readonly DetailedLineRangeMapping[]): boolean {
	if (a.length !== b.length) {
		return false;
	}
	if (a.some((c, i) => {
		const bChange = b[i];
		if (c.changedLineCount !== bChange.changedLineCount) {
			return true;
		}
		if ((c.innerChanges || []).length !== (bChange.innerChanges || []).length) {
			return true;
		}
		if ((c.innerChanges || []).some((innerC, innerIdx) => {
			const bInnerC = bChange.innerChanges![innerIdx];
			if (!innerC.modifiedRange.equalsRange(bInnerC.modifiedRange)) {
				return true;
			}
			if (!innerC.originalRange.equalsRange(bInnerC.originalRange)) {
				return true;
			}
			return false;
		})) {
			return true;
		}

		return false;
	})) {
		return false;
	}
	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookDeletedCellDecorator.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookDeletedCellDecorator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createTrustedTypesPolicy } from '../../../../../../base/browser/trustedTypes.js';
import { Disposable, DisposableStore, dispose, toDisposable } from '../../../../../../base/common/lifecycle.js';
import { splitLines } from '../../../../../../base/common/strings.js';
import { EditorOption } from '../../../../../../editor/common/config/editorOptions.js';
import { ILanguageService } from '../../../../../../editor/common/languages/language.js';
import { tokenizeToString } from '../../../../../../editor/common/languages/textToHtmlTokenizer.js';
import { NotebookCellTextModel } from '../../../common/model/notebookCellTextModel.js';
import { NotebookTextModel } from '../../../common/model/notebookTextModel.js';
import { DefaultLineHeight } from '../diffElementViewModel.js';
import { CellDiffInfo } from '../notebookDiffViewModel.js';
import { INotebookEditor, NotebookOverviewRulerLane } from '../../notebookBrowser.js';
import * as DOM from '../../../../../../base/browser/dom.js';
import { MenuWorkbenchToolBar, HiddenItemStrategy } from '../../../../../../platform/actions/browser/toolbar.js';
import { MenuId } from '../../../../../../platform/actions/common/actions.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../../../platform/instantiation/common/serviceCollection.js';
import { IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { overviewRulerDeletedForeground } from '../../../../scm/common/quickDiff.js';
import { IActionViewItemProvider } from '../../../../../../base/browser/ui/actionbar/actionbar.js';

const ttPolicy = createTrustedTypesPolicy('notebookRenderer', { createHTML: value => value });

export interface INotebookDeletedCellDecorator {
	getTop(deletedIndex: number): number | undefined;
}


export class NotebookDeletedCellDecorator extends Disposable implements INotebookDeletedCellDecorator {
	private readonly zoneRemover = this._register(new DisposableStore());
	private readonly createdViewZones = new Map<number, string>();
	private readonly deletedCellInfos = new Map<number, { height: number; previousIndex: number; offset: number }>();
	constructor(
		private readonly _notebookEditor: INotebookEditor,
		private readonly toolbar: { menuId: MenuId; className: string; telemetrySource?: string; argFactory: (deletedCellIndex: number) => any; actionViewItemProvider?: IActionViewItemProvider } | undefined,
		@ILanguageService private readonly languageService: ILanguageService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
	}

	public getTop(deletedIndex: number) {
		const info = this.deletedCellInfos.get(deletedIndex);
		if (!info) {
			return;
		}
		if (info.previousIndex === -1) {
			// deleted cell is before the first real cell
			return 0;
		}
		const cells = this._notebookEditor.getCellsInRange({ start: info.previousIndex, end: info.previousIndex + 1 });
		if (!cells.length) {
			return this._notebookEditor.getLayoutInfo().height + info.offset;
		}
		const cell = cells[0];
		const cellHeight = this._notebookEditor.getHeightOfElement(cell);
		const top = this._notebookEditor.getAbsoluteTopOfElement(cell);
		return top + cellHeight + info.offset;
	}

	reveal(deletedIndex: number) {
		const top = this.getTop(deletedIndex);
		if (typeof top === 'number') {
			this._notebookEditor.focusContainer();
			this._notebookEditor.revealOffsetInCenterIfOutsideViewport(top);

			const info = this.deletedCellInfos.get(deletedIndex);

			if (info) {
				const prevIndex = info.previousIndex === -1 ? 0 : info.previousIndex;
				this._notebookEditor.setFocus({ start: prevIndex, end: prevIndex });
				this._notebookEditor.setSelections([{ start: prevIndex, end: prevIndex }]);
			}
		}
	}

	public apply(diffInfo: CellDiffInfo[], original: NotebookTextModel): void {
		this.clear();

		let currentIndex = -1;
		const deletedCellsToRender: { cells: { cell: NotebookCellTextModel; originalIndex: number; previousIndex: number }[]; index: number } = { cells: [], index: 0 };
		diffInfo.forEach(diff => {
			if (diff.type === 'delete') {
				const deletedCell = original.cells[diff.originalCellIndex];
				if (deletedCell) {
					deletedCellsToRender.cells.push({ cell: deletedCell, originalIndex: diff.originalCellIndex, previousIndex: currentIndex });
					deletedCellsToRender.index = currentIndex;
				}
			} else {
				if (deletedCellsToRender.cells.length) {
					this._createWidget(deletedCellsToRender.index + 1, deletedCellsToRender.cells);
					deletedCellsToRender.cells.length = 0;
				}
				currentIndex = diff.modifiedCellIndex;
			}
		});
		if (deletedCellsToRender.cells.length) {
			this._createWidget(deletedCellsToRender.index + 1, deletedCellsToRender.cells);
		}
	}

	public clear() {
		this.deletedCellInfos.clear();
		this.zoneRemover.clear();
	}


	private _createWidget(index: number, cells: { cell: NotebookCellTextModel; originalIndex: number; previousIndex: number }[]) {
		this._createWidgetImpl(index, cells);
	}
	private async _createWidgetImpl(index: number, cells: { cell: NotebookCellTextModel; originalIndex: number; previousIndex: number }[]) {
		const rootContainer = document.createElement('div');
		const widgets: NotebookDeletedCellWidget[] = [];
		const heights = await Promise.all(cells.map(async cell => {
			const widget = new NotebookDeletedCellWidget(this._notebookEditor, this.toolbar, cell.cell.getValue(), cell.cell.language, rootContainer, cell.originalIndex, this.languageService, this.instantiationService);
			widgets.push(widget);
			const height = await widget.render();
			this.deletedCellInfos.set(cell.originalIndex, { height, previousIndex: cell.previousIndex, offset: 0 });
			return height;
		}));

		Array.from(this.deletedCellInfos.keys()).sort((a, b) => a - b).forEach((originalIndex) => {
			const previousDeletedCell = this.deletedCellInfos.get(originalIndex - 1);
			if (previousDeletedCell) {
				const deletedCell = this.deletedCellInfos.get(originalIndex);
				if (deletedCell) {
					deletedCell.offset = previousDeletedCell.height + previousDeletedCell.offset;
				}
			}
		});

		const totalHeight = heights.reduce<number>((prev, curr) => prev + curr, 0);

		this._notebookEditor.changeViewZones(accessor => {
			const notebookViewZone = {
				afterModelPosition: index,
				heightInPx: totalHeight + 4,
				domNode: rootContainer
			};

			const id = accessor.addZone(notebookViewZone);
			accessor.layoutZone(id);
			this.createdViewZones.set(index, id);

			const deletedCellOverviewRulereDecorationIds = this._notebookEditor.deltaCellDecorations([], [{
				viewZoneId: id,
				options: {
					overviewRuler: {
						color: overviewRulerDeletedForeground,
						position: NotebookOverviewRulerLane.Center,
					}
				}
			}]);
			this.zoneRemover.add(toDisposable(() => {
				if (this.createdViewZones.get(index) === id) {
					this.createdViewZones.delete(index);
				}
				if (!this._notebookEditor.isDisposed) {
					this._notebookEditor.changeViewZones(accessor => {
						accessor.removeZone(id);
						dispose(widgets);
					});

					this._notebookEditor.deltaCellDecorations(deletedCellOverviewRulereDecorationIds, []);
				}
			}));
		});
	}

}

export class NotebookDeletedCellWidget extends Disposable {
	private readonly container: HTMLElement;
	// private readonly toolbar: HTMLElement;

	constructor(
		private readonly _notebookEditor: INotebookEditor,
		private readonly _toolbarOptions: { menuId: MenuId; className: string; telemetrySource?: string; argFactory: (deletedCellIndex: number) => any; actionViewItemProvider?: IActionViewItemProvider } | undefined,
		private readonly code: string,
		private readonly language: string,
		container: HTMLElement,
		private readonly _originalIndex: number,
		@ILanguageService private readonly languageService: ILanguageService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
		this.container = DOM.append(container, document.createElement('div'));
		this._register(toDisposable(() => {
			container.removeChild(this.container);
		}));
	}

	public async render() {
		const code = this.code;
		const languageId = this.language;
		const codeHtml = await tokenizeToString(this.languageService, code, languageId);

		// const colorMap = this.getDefaultColorMap();
		const fontInfo = this._notebookEditor.getBaseCellEditorOptions(languageId).value;
		const fontFamilyVar = '--notebook-editor-font-family';
		const fontSizeVar = '--notebook-editor-font-size';
		const fontWeightVar = '--notebook-editor-font-weight';
		// If we have any editors, then use left layout of one of those.
		const editor = this._notebookEditor.codeEditors.map(c => c[1]).find(c => c);
		const layoutInfo = editor?.getOptions().get(EditorOption.layoutInfo);

		const style = ``
			+ `font-family: var(${fontFamilyVar});`
			+ `font-weight: var(${fontWeightVar});`
			+ `font-size: var(${fontSizeVar});`
			+ fontInfo.lineHeight ? `line-height: ${fontInfo.lineHeight}px;` : ''
				+ layoutInfo?.contentLeft ? `margin-left: ${layoutInfo}px;` : ''
		+ `white-space: pre;`;

		const rootContainer = this.container;
		rootContainer.classList.add('code-cell-row');

		if (this._toolbarOptions) {
			const toolbar = document.createElement('div');
			toolbar.className = this._toolbarOptions.className;
			rootContainer.appendChild(toolbar);

			const scopedInstaService = this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, this._notebookEditor.scopedContextKeyService])));
			const toolbarWidget = scopedInstaService.createInstance(MenuWorkbenchToolBar, toolbar, this._toolbarOptions.menuId, {
				telemetrySource: this._toolbarOptions.telemetrySource,
				hiddenItemStrategy: HiddenItemStrategy.NoHide,
				toolbarOptions: { primaryGroup: () => true },
				menuOptions: {
					renderShortTitle: true,
					arg: this._toolbarOptions.argFactory(this._originalIndex),
				},
				actionViewItemProvider: this._toolbarOptions.actionViewItemProvider
			});
			this._store.add(toolbarWidget);

			toolbar.style.position = 'absolute';
			toolbar.style.right = '40px';
			toolbar.style.zIndex = '10';
			toolbar.classList.add('hover'); // Show by default
		}

		const container = DOM.append(rootContainer, DOM.$('.cell-inner-container'));
		container.style.position = 'relative'; // Add this line

		const focusIndicatorLeft = DOM.append(container, DOM.$('.cell-focus-indicator.cell-focus-indicator-side.cell-focus-indicator-left'));
		const cellContainer = DOM.append(container, DOM.$('.cell.code'));
		DOM.append(focusIndicatorLeft, DOM.$('div.execution-count-label'));
		const editorPart = DOM.append(cellContainer, DOM.$('.cell-editor-part'));
		let editorContainer = DOM.append(editorPart, DOM.$('.cell-editor-container'));
		editorContainer = DOM.append(editorContainer, DOM.$('.code', { style }));
		if (fontInfo.fontFamily) {
			editorContainer.style.setProperty(fontFamilyVar, fontInfo.fontFamily);
		}
		if (fontInfo.fontSize) {
			editorContainer.style.setProperty(fontSizeVar, `${fontInfo.fontSize}px`);
		}
		if (fontInfo.fontWeight) {
			editorContainer.style.setProperty(fontWeightVar, fontInfo.fontWeight);
		}
		editorContainer.innerHTML = (ttPolicy?.createHTML(codeHtml) || codeHtml) as string;

		const lineCount = splitLines(code).length;
		const height = (lineCount * (fontInfo.lineHeight || DefaultLineHeight)) + 12 + 12; // We have 12px top and bottom in generated code HTML;
		const totalHeight = height + 16 + 16;

		return totalHeight;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookInlineDiff.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookInlineDiff.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../../base/common/lifecycle.js';
import { autorun } from '../../../../../../base/common/observable.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { NotebookCellTextModel } from '../../../common/model/notebookCellTextModel.js';
import { NotebookTextModel } from '../../../common/model/notebookTextModel.js';
import { INotebookEditorWorkerService } from '../../../common/services/notebookWorkerService.js';
import { CellDiffInfo } from '../notebookDiffViewModel.js';
import { INotebookEditorContribution, INotebookEditor } from '../../notebookBrowser.js';
import { registerNotebookContribution } from '../../notebookEditorExtensions.js';
import { NotebookCellDiffDecorator } from './notebookCellDiffDecorator.js';
import { NotebookDeletedCellDecorator } from './notebookDeletedCellDecorator.js';
import { NotebookInsertedCellDecorator } from './notebookInsertedCellDecorator.js';
import { INotebookLoggingService } from '../../../common/notebookLoggingService.js';
import { computeDiff } from '../../../common/notebookDiff.js';
import { InstantiationType, registerSingleton } from '../../../../../../platform/instantiation/common/extensions.js';
import { INotebookOriginalModelReferenceFactory, NotebookOriginalModelReferenceFactory } from './notebookOriginalModelRefFactory.js';
import { INotebookOriginalCellModelFactory, OriginalNotebookCellModelFactory } from './notebookOriginalCellModelFactory.js';

export class NotebookInlineDiffDecorationContribution extends Disposable implements INotebookEditorContribution {
	static ID: string = 'workbench.notebook.inlineDiffDecoration';

	private previous?: NotebookTextModel;
	private insertedCellDecorator: NotebookInsertedCellDecorator | undefined;
	private deletedCellDecorator: NotebookDeletedCellDecorator | undefined;
	private readonly cellDecorators = new Map<NotebookCellTextModel, NotebookCellDiffDecorator>();
	private cachedNotebookDiff?: { cellDiffInfo: CellDiffInfo[]; originalVersion: number; version: number };
	private listeners: IDisposable[] = [];

	constructor(
		private readonly notebookEditor: INotebookEditor,
		@INotebookEditorWorkerService private readonly notebookEditorWorkerService: INotebookEditorWorkerService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@INotebookLoggingService private readonly logService: INotebookLoggingService
	) {
		super();
		this.logService.debug('inlineDiff', 'Watching for previous model');

		this._register(autorun((reader) => {
			this.previous = this.notebookEditor.notebookOptions.previousModelToCompare.read(reader);
			if (this.previous) {
				this.logService.debug('inlineDiff', 'Previous model set');
				if (this.notebookEditor.hasModel()) {
					this.initialize();
				} else {
					this.logService.debug('inlineDiff', 'Waiting for model to attach');
					this.listeners.push(Event.once(this.notebookEditor.onDidAttachViewModel)(() => this.initialize()));
				}
			}
		}));
	}

	private clear() {

		this.listeners.forEach(l => l.dispose());
		this.cellDecorators.forEach((v, cell) => {
			v.dispose();
			this.cellDecorators.delete(cell);
		});
		this.insertedCellDecorator?.dispose();
		this.deletedCellDecorator?.dispose();
		this.cachedNotebookDiff = undefined;
		this.listeners = [];
		this.logService.debug('inlineDiff', 'Cleared decorations and listeners');
	}

	override dispose() {
		this.logService.debug('inlineDiff', 'Disposing');
		this.clear();
		super.dispose();
	}

	private initialize() {
		this.clear();

		if (!this.previous) {
			return;
		}

		this.insertedCellDecorator = this.instantiationService.createInstance(NotebookInsertedCellDecorator, this.notebookEditor);
		this.deletedCellDecorator = this.instantiationService.createInstance(NotebookDeletedCellDecorator, this.notebookEditor, undefined);

		this._update();
		const onVisibleChange = Event.debounce(this.notebookEditor.onDidChangeVisibleRanges, (e) => e, 100, undefined, undefined, undefined, this._store);
		this.listeners.push(onVisibleChange(() => this._update()));
		this.listeners.push(this.notebookEditor.onDidChangeModel(() => this._update()));
		if (this.notebookEditor.textModel) {
			const onContentChange = Event.debounce(this.notebookEditor.textModel!.onDidChangeContent, (_, event) => event, 100, undefined, undefined, undefined, this._store);
			const onOriginalContentChange = Event.debounce(this.previous.onDidChangeContent, (_, event) => event, 100, undefined, undefined, undefined, this._store);
			this.listeners.push(onContentChange(() => this._update()));
			this.listeners.push(onOriginalContentChange(() => this._update()));
		}
		this.logService.debug('inlineDiff', 'Initialized');
	}

	private async _update() {
		const current = this.notebookEditor.getViewModel()?.notebookDocument;
		if (!this.previous || !current) {
			this.logService.debug('inlineDiff', 'Update skipped - no original or current document');
			return;
		}

		if (!this.cachedNotebookDiff ||
			this.cachedNotebookDiff.originalVersion !== this.previous.versionId ||
			this.cachedNotebookDiff.version !== current.versionId) {

			let diffInfo: { cellDiffInfo: CellDiffInfo[] } = { cellDiffInfo: [] };
			try {
				const notebookDiff = await this.notebookEditorWorkerService.computeDiff(this.previous.uri, current.uri);
				diffInfo = computeDiff(this.previous, current, notebookDiff);
			} catch (e) {
				this.logService.error('inlineDiff', 'Error computing diff:\n' + e);
				return;
			}

			this.cachedNotebookDiff = { cellDiffInfo: diffInfo.cellDiffInfo, originalVersion: this.previous.versionId, version: current.versionId };

			this.insertedCellDecorator?.apply(diffInfo.cellDiffInfo);
			this.deletedCellDecorator?.apply(diffInfo.cellDiffInfo, this.previous);
		}

		await this.updateCells(this.previous, current, this.cachedNotebookDiff.cellDiffInfo);
	}

	private async updateCells(original: NotebookTextModel, modified: NotebookTextModel, cellDiffs: CellDiffInfo[]) {
		const validDiffDecorators = new Set<NotebookCellDiffDecorator>();
		cellDiffs.forEach((diff) => {
			if (diff.type === 'modified') {
				const modifiedCell = modified.cells[diff.modifiedCellIndex];
				const originalCell = original.cells[diff.originalCellIndex];
				const editor = this.notebookEditor.codeEditors.find(([vm,]) => vm.handle === modifiedCell.handle)?.[1];

				if (editor) {
					const currentDecorator = this.cellDecorators.get(modifiedCell);
					if ((currentDecorator?.modifiedCell !== modifiedCell || currentDecorator?.originalCell !== originalCell)) {
						currentDecorator?.dispose();
						const decorator = this.instantiationService.createInstance(NotebookCellDiffDecorator, this.notebookEditor, modifiedCell, originalCell, editor);
						this.cellDecorators.set(modifiedCell, decorator);
						validDiffDecorators.add(decorator);
						this._register(editor.onDidDispose(() => {
							decorator.dispose();
							if (this.cellDecorators.get(modifiedCell) === decorator) {
								this.cellDecorators.delete(modifiedCell);
							}
						}));
					} else if (currentDecorator) {
						validDiffDecorators.add(currentDecorator);
					}
				}
			}
		});

		// Dispose old decorators
		this.cellDecorators.forEach((v, cell) => {
			if (!validDiffDecorators.has(v)) {
				v.dispose();
				this.cellDecorators.delete(cell);
			}
		});
	}
}

registerNotebookContribution(NotebookInlineDiffDecorationContribution.ID, NotebookInlineDiffDecorationContribution);
registerSingleton(INotebookOriginalModelReferenceFactory, NotebookOriginalModelReferenceFactory, InstantiationType.Delayed);
registerSingleton(INotebookOriginalCellModelFactory, OriginalNotebookCellModelFactory, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookInlineDiffWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookInlineDiffWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import { CodeWindow } from '../../../../../../base/browser/window.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { EditorExtensionsRegistry } from '../../../../../../editor/browser/editorExtensions.js';
import { MenuId } from '../../../../../../platform/actions/common/actions.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { NotebookTextModel } from '../../../common/model/notebookTextModel.js';
import { NotebookDiffEditorInput } from '../../../common/notebookDiffEditorInput.js';
import { NotebookInlineDiffDecorationContribution } from './notebookInlineDiff.js';
import { INotebookEditorOptions } from '../../notebookBrowser.js';
import { NotebookEditorExtensionsRegistry } from '../../notebookEditorExtensions.js';
import { NotebookEditorWidget } from '../../notebookEditorWidget.js';
import { NotebookOptions } from '../../notebookOptions.js';
import { IBorrowValue, INotebookEditorService } from '../../services/notebookEditorService.js';

export class NotebookInlineDiffWidget extends Disposable {

	private widget: IBorrowValue<NotebookEditorWidget> = { value: undefined };
	private position: DOM.IDomPosition | undefined;

	get editorWidget() {
		return this.widget.value;
	}

	constructor(
		private readonly rootElement: HTMLElement,
		private readonly groupId: number,
		private readonly window: CodeWindow,
		private readonly options: NotebookOptions,
		private dimension: DOM.Dimension | undefined,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@INotebookEditorService private readonly widgetService: INotebookEditorService) {
		super();
	}

	async show(input: NotebookDiffEditorInput, model: NotebookTextModel | undefined, previousModel: NotebookTextModel | undefined, options: INotebookEditorOptions | undefined) {
		if (!this.widget.value) {
			this.createNotebookWidget(input, this.groupId, this.rootElement);
		}

		if (this.dimension) {
			this.widget.value?.layout(this.dimension, this.rootElement, this.position);
		}

		if (model) {
			await this.widget.value?.setOptions({ ...options });
			this.widget.value?.notebookOptions.previousModelToCompare.set(previousModel, undefined);

			await this.widget.value!.setModel(model, options?.viewState);
		}
	}

	hide() {
		if (this.widget.value) {
			this.widget.value.notebookOptions.previousModelToCompare.set(undefined, undefined);
			this.widget.value.onWillHide();
		}
	}

	setLayout(dimension: DOM.Dimension, position: DOM.IDomPosition) {
		this.dimension = dimension;
		this.position = position;
	}

	private createNotebookWidget(input: NotebookDiffEditorInput, groupId: number, rootElement: HTMLElement | undefined) {
		const contributions = NotebookEditorExtensionsRegistry.getSomeEditorContributions([NotebookInlineDiffDecorationContribution.ID]);
		const menuIds = {
			notebookToolbar: MenuId.NotebookToolbar,
			cellTitleToolbar: MenuId.NotebookCellTitle,
			cellDeleteToolbar: MenuId.NotebookCellDelete,
			cellInsertToolbar: MenuId.NotebookCellBetween,
			cellTopInsertToolbar: MenuId.NotebookCellListTop,
			cellExecuteToolbar: MenuId.NotebookCellExecute,
			cellExecutePrimary: undefined,
		};
		const skipContributions = [
			'editor.contrib.review',
			'editor.contrib.floatingClickMenu',
			'editor.contrib.dirtydiff',
			'editor.contrib.testingOutputPeek',
			'editor.contrib.testingDecorations',
			'store.contrib.stickyScrollController',
			'editor.contrib.findController',
			'editor.contrib.emptyTextEditorHint',
		];
		const cellEditorContributions = EditorExtensionsRegistry.getEditorContributions().filter(c => skipContributions.indexOf(c.id) === -1);

		this.widget = <IBorrowValue<NotebookEditorWidget>>this.instantiationService.invokeFunction(this.widgetService.retrieveWidget,
			groupId, input, { contributions, menuIds, cellEditorContributions, options: this.options }, this.dimension, this.window);
		if (this.rootElement && this.widget.value!.getDomNode()) {
			this.rootElement.setAttribute('aria-flowto', this.widget.value!.getDomNode().id || '');
			DOM.setParentFlowTo(this.widget.value!.getDomNode(), this.rootElement);
		}
	}

	override dispose(): void {
		super.dispose();
		if (this.widget.value) {
			this.widget.value.dispose();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookInsertedCellDecorator.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookInsertedCellDecorator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore, toDisposable } from '../../../../../../base/common/lifecycle.js';
import { CellDiffInfo } from '../notebookDiffViewModel.js';
import { INotebookEditor, NotebookOverviewRulerLane } from '../../notebookBrowser.js';
import { overviewRulerAddedForeground } from '../../../../scm/common/quickDiff.js';

export class NotebookInsertedCellDecorator extends Disposable {
	private readonly decorators = this._register(new DisposableStore());
	constructor(
		private readonly notebookEditor: INotebookEditor,
	) {
		super();

	}
	public apply(diffInfo: CellDiffInfo[]) {
		const model = this.notebookEditor.textModel;
		if (!model) {
			return;
		}
		const cells = diffInfo.filter(diff => diff.type === 'insert').map((diff) => model.cells[diff.modifiedCellIndex]);
		const ids = this.notebookEditor.deltaCellDecorations([], cells.map(cell => ({
			handle: cell.handle,
			options: {
				className: 'nb-insertHighlight', outputClassName: 'nb-insertHighlight', overviewRuler: {
					color: overviewRulerAddedForeground,
					modelRanges: [],
					includeOutput: true,
					position: NotebookOverviewRulerLane.Full
				}
			}
		})));
		this.clear();
		this.decorators.add(toDisposable(() => {
			if (!this.notebookEditor.isDisposed) {
				this.notebookEditor.deltaCellDecorations(ids, []);
			}
		}));
	}
	public clear() {
		this.decorators.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookModifiedCellDecorator.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookModifiedCellDecorator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore, toDisposable } from '../../../../../../base/common/lifecycle.js';
import { CellDiffInfo } from '../notebookDiffViewModel.js';
import { INotebookEditor, NotebookOverviewRulerLane } from '../../notebookBrowser.js';
import { NotebookCellTextModel } from '../../../common/model/notebookCellTextModel.js';
import { overviewRulerModifiedForeground } from '../../../../scm/common/quickDiff.js';

export class NotebookModifiedCellDecorator extends Disposable {
	private readonly decorators = this._register(new DisposableStore());
	constructor(
		private readonly notebookEditor: INotebookEditor,
	) {
		super();
	}

	public apply(diffInfo: CellDiffInfo[]) {
		const model = this.notebookEditor.textModel;
		if (!model) {
			return;
		}

		const modifiedCells: NotebookCellTextModel[] = [];
		for (const diff of diffInfo) {
			if (diff.type === 'modified') {
				const cell = model.cells[diff.modifiedCellIndex];
				modifiedCells.push(cell);
			}
		}

		const ids = this.notebookEditor.deltaCellDecorations([], modifiedCells.map(cell => ({
			handle: cell.handle,
			options: {
				overviewRuler: {
					color: overviewRulerModifiedForeground,
					modelRanges: [],
					includeOutput: true,
					position: NotebookOverviewRulerLane.Full
				}
			}
		})));

		this.clear();
		this.decorators.add(toDisposable(() => {
			if (!this.notebookEditor.isDisposed) {
				this.notebookEditor.deltaCellDecorations(ids, []);
			}
		}));
	}
	public clear() {
		this.decorators.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookOriginalCellModelFactory.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookOriginalCellModelFactory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IReference, ReferenceCollection } from '../../../../../../base/common/lifecycle.js';
import { createDecorator, IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { CellKind } from '../../../common/notebookCommon.js';
import { URI } from '../../../../../../base/common/uri.js';
import { ILanguageService } from '../../../../../../editor/common/languages/language.js';
import { IModelService } from '../../../../../../editor/common/services/model.js';


export const INotebookOriginalCellModelFactory = createDecorator<INotebookOriginalCellModelFactory>('INotebookOriginalCellModelFactory');

export interface INotebookOriginalCellModelFactory {
	readonly _serviceBrand: undefined;
	getOrCreate(uri: URI, cellValue: string, language: string, cellKind: CellKind): IReference<ITextModel>;
}


export class OriginalNotebookCellModelReferenceCollection extends ReferenceCollection<ITextModel> {
	constructor(@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly _languageService: ILanguageService,
	) {
		super();
	}

	protected override createReferencedObject(_key: string, uri: URI, cellValue: string, language: string, cellKind: CellKind): ITextModel {
		const scheme = `${uri.scheme}-chat-edit`;
		const originalCellUri = URI.from({ scheme, fragment: uri.fragment, path: uri.path });
		const languageSelection = this._languageService.getLanguageIdByLanguageName(language) ? this._languageService.createById(language) : cellKind === CellKind.Markup ? this._languageService.createById('markdown') : null;
		return this.modelService.createModel(cellValue, languageSelection, originalCellUri);
	}
	protected override destroyReferencedObject(_key: string, model: ITextModel): void {
		model.dispose();
	}
}

export class OriginalNotebookCellModelFactory implements INotebookOriginalCellModelFactory {
	readonly _serviceBrand: undefined;
	private readonly _data: OriginalNotebookCellModelReferenceCollection;
	constructor(@IInstantiationService instantiationService: IInstantiationService) {
		this._data = instantiationService.createInstance(OriginalNotebookCellModelReferenceCollection);
	}

	getOrCreate(uri: URI, cellValue: string, language: string, cellKind: CellKind): IReference<ITextModel> {
		return this._data.acquire(uri.toString(), uri, cellValue, language, cellKind);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookOriginalModelRefFactory.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookOriginalModelRefFactory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AsyncReferenceCollection, IReference, ReferenceCollection } from '../../../../../../base/common/lifecycle.js';
import { IModifiedFileEntry } from '../../../../chat/common/chatEditingService.js';
import { INotebookService } from '../../../common/notebookService.js';
import { bufferToStream, VSBuffer } from '../../../../../../base/common/buffer.js';
import { NotebookTextModel } from '../../../common/model/notebookTextModel.js';
import { createDecorator, IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { ITextModelService } from '../../../../../../editor/common/services/resolverService.js';


export const INotebookOriginalModelReferenceFactory = createDecorator<INotebookOriginalModelReferenceFactory>('INotebookOriginalModelReferenceFactory');

export interface INotebookOriginalModelReferenceFactory {
	readonly _serviceBrand: undefined;
	getOrCreate(fileEntry: IModifiedFileEntry, viewType: string): Promise<IReference<NotebookTextModel>>;
}


export class OriginalNotebookModelReferenceCollection extends ReferenceCollection<Promise<NotebookTextModel>> {
	private readonly modelsToDispose = new Set<string>();
	constructor(@INotebookService private readonly notebookService: INotebookService,
		@ITextModelService private readonly modelService: ITextModelService
	) {
		super();
	}

	protected override async createReferencedObject(key: string, fileEntry: IModifiedFileEntry, viewType: string): Promise<NotebookTextModel> {
		this.modelsToDispose.delete(key);
		const uri = fileEntry.originalURI;
		const model = this.notebookService.getNotebookTextModel(uri);
		if (model) {
			return model;
		}
		const modelRef = await this.modelService.createModelReference(uri);
		const bytes = VSBuffer.fromString(modelRef.object.textEditorModel.getValue());
		const stream = bufferToStream(bytes);
		modelRef.dispose();

		return this.notebookService.createNotebookTextModel(viewType, uri, stream);
	}
	protected override destroyReferencedObject(key: string, modelPromise: Promise<NotebookTextModel>): void {
		this.modelsToDispose.add(key);

		(async () => {
			try {
				const model = await modelPromise;

				if (!this.modelsToDispose.has(key)) {
					// return if model has been acquired again meanwhile
					return;
				}

				// Finally we can dispose the model
				model.dispose();
			} catch (error) {
				// ignore
			} finally {
				this.modelsToDispose.delete(key); // Untrack as being disposed
			}
		})();
	}
}

export class NotebookOriginalModelReferenceFactory implements INotebookOriginalModelReferenceFactory {
	readonly _serviceBrand: undefined;
	private _resourceModelCollection: OriginalNotebookModelReferenceCollection & ReferenceCollection<Promise<NotebookTextModel>> /* TS Fail */ | undefined = undefined;
	private get resourceModelCollection() {
		if (!this._resourceModelCollection) {
			this._resourceModelCollection = this.instantiationService.createInstance(OriginalNotebookModelReferenceCollection);
		}

		return this._resourceModelCollection;
	}

	private _asyncModelCollection: AsyncReferenceCollection<NotebookTextModel> | undefined = undefined;
	private get asyncModelCollection() {
		if (!this._asyncModelCollection) {
			this._asyncModelCollection = new AsyncReferenceCollection(this.resourceModelCollection);
		}

		return this._asyncModelCollection;
	}

	constructor(@IInstantiationService private readonly instantiationService: IInstantiationService) {
	}

	getOrCreate(fileEntry: IModifiedFileEntry, viewType: string): Promise<IReference<NotebookTextModel>> {
		return this.asyncModelCollection.acquire(fileEntry.originalURI.toString(), fileEntry, viewType);
	}
}
```

--------------------------------------------------------------------------------

````
