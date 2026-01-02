---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 413
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 413 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/browser/notebookBrowser.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/notebookBrowser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeWindow } from '../../../../base/browser/window.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IEditorContributionDescription } from '../../../../editor/browser/editorExtensions.js';
import * as editorCommon from '../../../../editor/common/editorCommon.js';
import { FontInfo } from '../../../../editor/common/config/fontInfo.js';
import { IPosition } from '../../../../editor/common/core/position.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { FindMatch, IModelDeltaDecoration, IReadonlyTextBuffer, ITextModel, TrackedRangeStickiness } from '../../../../editor/common/model.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { ITextEditorOptions, ITextResourceEditorInput } from '../../../../platform/editor/common/editor.js';
import { IConstructorSignature } from '../../../../platform/instantiation/common/instantiation.js';
import { IEditorPane, IEditorPaneWithSelection } from '../../../common/editor.js';
import { CellViewModelStateChangeEvent, NotebookCellStateChangedEvent, NotebookLayoutInfo } from './notebookViewEvents.js';
import { NotebookCellTextModel } from '../common/model/notebookCellTextModel.js';
import { NotebookTextModel } from '../common/model/notebookTextModel.js';
import { CellKind, ICellOutput, INotebookCellStatusBarItem, INotebookRendererInfo, INotebookFindOptions, IOrderedMimeType, NotebookCellInternalMetadata, NotebookCellMetadata, NOTEBOOK_EDITOR_ID, NOTEBOOK_DIFF_EDITOR_ID } from '../common/notebookCommon.js';
import { isCompositeNotebookEditorInput } from '../common/notebookEditorInput.js';
import { INotebookKernel } from '../common/notebookKernelService.js';
import { NotebookOptions } from './notebookOptions.js';
import { cellRangesToIndexes, ICellRange, reduceCellRanges } from '../common/notebookRange.js';
import { IWebviewElement } from '../../webview/browser/webview.js';
import { IEditorCommentsOptions, IEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { IObservable } from '../../../../base/common/observable.js';
import { INotebookTextDiffEditor } from './diff/notebookDiffEditorBrowser.js';

//#region Shared commands
export const EXPAND_CELL_INPUT_COMMAND_ID = 'notebook.cell.expandCellInput';
export const EXECUTE_CELL_COMMAND_ID = 'notebook.cell.execute';
export const DETECT_CELL_LANGUAGE = 'notebook.cell.detectLanguage';
export const CHANGE_CELL_LANGUAGE = 'notebook.cell.changeLanguage';
export const QUIT_EDIT_CELL_COMMAND_ID = 'notebook.cell.quitEdit';
export const EXPAND_CELL_OUTPUT_COMMAND_ID = 'notebook.cell.expandCellOutput';


//#endregion

//#region Notebook extensions

// Hardcoding viewType/extension ID for now. TODO these should be replaced once we can
// look them up in the marketplace dynamically.
export const IPYNB_VIEW_TYPE = 'jupyter-notebook';
export const JUPYTER_EXTENSION_ID = 'ms-toolsai.jupyter';
/** @deprecated use the notebookKernel<Type> "keyword" instead */
export const KERNEL_EXTENSIONS = new Map<string, string>([
	[IPYNB_VIEW_TYPE, JUPYTER_EXTENSION_ID],
]);
// @TODO lramos15, place this in a similar spot to our normal recommendations.
export const KERNEL_RECOMMENDATIONS = new Map<string, Map<string, INotebookExtensionRecommendation>>();
KERNEL_RECOMMENDATIONS.set(IPYNB_VIEW_TYPE, new Map<string, INotebookExtensionRecommendation>());
KERNEL_RECOMMENDATIONS.get(IPYNB_VIEW_TYPE)?.set('python', {
	extensionIds: [
		'ms-python.python',
		JUPYTER_EXTENSION_ID
	],
	displayName: 'Python + Jupyter',
});

export interface INotebookExtensionRecommendation {
	readonly extensionIds: string[];
	readonly displayName?: string;
}

//#endregion

//#region  Output related types

// !! IMPORTANT !! ----------------------------------------------------------------------------------
// NOTE that you MUST update vs/workbench/contrib/notebook/browser/view/renderers/webviewPreloads.ts#L1986
// whenever changing the values of this const enum. The webviewPreloads-files manually inlines these values
// because it cannot have dependencies.
// !! IMPORTANT !! ----------------------------------------------------------------------------------
export const enum RenderOutputType {
	Html = 0,
	Extension = 1
}

export interface IRenderPlainHtmlOutput {
	readonly type: RenderOutputType.Html;
	readonly source: IDisplayOutputViewModel;
	readonly htmlContent: string;
}

export interface IRenderOutputViaExtension {
	readonly type: RenderOutputType.Extension;
	readonly source: IDisplayOutputViewModel;
	readonly mimeType: string;
	readonly renderer: INotebookRendererInfo;
}

export type IInsetRenderOutput = IRenderPlainHtmlOutput | IRenderOutputViaExtension;

export interface ICellOutputViewModel extends IDisposable {
	cellViewModel: IGenericCellViewModel;
	/**
	 * When rendering an output, `model` should always be used as we convert legacy `text/error` output to `display_data` output under the hood.
	 */
	model: ICellOutput;
	resolveMimeTypes(textModel: NotebookTextModel, kernelProvides: readonly string[] | undefined): [readonly IOrderedMimeType[], number];
	pickedMimeType: IOrderedMimeType | undefined;
	hasMultiMimeType(): boolean;
	readonly onDidResetRenderer: Event<void>;
	readonly visible: IObservable<boolean>;
	setVisible(visible: boolean, force?: boolean): void;
	resetRenderer(): void;
	toRawJSON(): any;
}

export interface IDisplayOutputViewModel extends ICellOutputViewModel {
	resolveMimeTypes(textModel: NotebookTextModel, kernelProvides: readonly string[] | undefined): [readonly IOrderedMimeType[], number];
}


//#endregion

//#region Shared types between the Notebook Editor and Notebook Diff Editor, they are mostly used for output rendering

export interface IGenericCellViewModel {
	id: string;
	handle: number;
	uri: URI;
	metadata: NotebookCellMetadata;
	outputIsHovered: boolean;
	outputIsFocused: boolean;
	inputInOutputIsFocused: boolean;
	outputsViewModels: ICellOutputViewModel[];
	getOutputOffset(index: number): number;
	updateOutputHeight(index: number, height: number, source?: string): void;
}

export interface IDisplayOutputLayoutUpdateRequest {
	readonly cell: IGenericCellViewModel;
	output: IDisplayOutputViewModel;
	cellTop: number;
	outputOffset: number;
	forceDisplay: boolean;
}

export interface ICommonCellInfo {
	readonly cellId: string;
	readonly cellHandle: number;
	readonly cellUri: URI;
	readonly executionId?: string;
}

export enum ScrollToRevealBehavior {
	fullCell,
	firstLine
}

export interface IFocusNotebookCellOptions {
	readonly skipReveal?: boolean;
	readonly focusEditorLine?: number;
	readonly revealBehavior?: ScrollToRevealBehavior | undefined;
	readonly outputId?: string;
	readonly altOutputId?: string;
	readonly outputWebviewFocused?: boolean;
}

//#endregion

export enum CellLayoutState {
	Uninitialized,
	Estimated,
	FromCache,
	Measured
}

/** LayoutInfo of the parts that are shared between all cell types. */
export interface CellLayoutInfo {
	readonly layoutState: CellLayoutState;
	readonly fontInfo: FontInfo | null;
	readonly chatHeight: number;
	readonly editorWidth: number;
	readonly editorHeight: number;
	readonly statusBarHeight: number;
	readonly commentOffset: number;
	readonly commentHeight: number;
	readonly bottomToolbarOffset: number;
	readonly totalHeight: number;
	readonly topMargin: number;
	readonly bottomMargin: number;
	readonly outlineWidth: number;
}

export interface CellLayoutChangeEvent {
	readonly font?: FontInfo;
	readonly outerWidth?: number;
	readonly commentHeight?: boolean;
}

export interface CodeCellLayoutInfo extends CellLayoutInfo {
	readonly estimatedHasHorizontalScrolling: boolean;
	readonly outputContainerOffset: number;
	readonly outputTotalHeight: number;
	readonly outputShowMoreContainerHeight: number;
	readonly outputShowMoreContainerOffset: number;
	readonly codeIndicatorHeight: number;
	readonly outputIndicatorHeight: number;
}

export interface CodeCellLayoutChangeEvent extends CellLayoutChangeEvent {
	readonly source?: string;
	readonly chatHeight?: boolean;
	readonly editorHeight?: boolean;
	readonly outputHeight?: boolean;
	readonly outputShowMoreContainerHeight?: number;
	readonly totalHeight?: boolean;
}

export interface MarkupCellLayoutInfo extends CellLayoutInfo {
	readonly previewHeight: number;
	readonly foldHintHeight: number;
}

export enum CellLayoutContext {
	Fold
}

export interface MarkupCellLayoutChangeEvent extends CellLayoutChangeEvent {
	readonly editorHeight?: number;
	readonly previewHeight?: number;
	totalHeight?: number;
	readonly context?: CellLayoutContext;
}

export interface ICommonCellViewModelLayoutChangeInfo {
	readonly totalHeight?: boolean | number;
	readonly outerWidth?: number;
	readonly context?: CellLayoutContext;
}
export interface ICellViewModel extends IGenericCellViewModel {
	readonly model: NotebookCellTextModel;
	readonly id: string;
	readonly textBuffer: IReadonlyTextBuffer;
	readonly layoutInfo: CellLayoutInfo;
	readonly onDidChangeLayout: Event<ICommonCellViewModelLayoutChangeInfo>;
	readonly onDidChangeCellStatusBarItems: Event<void>;
	readonly onCellDecorationsChanged: Event<{ added: INotebookCellDecorationOptions[]; removed: INotebookCellDecorationOptions[] }>;
	readonly onDidChangeState: Event<CellViewModelStateChangeEvent>;
	readonly onDidChangeEditorAttachState: Event<void>;
	readonly editStateSource: string;
	readonly editorAttached: boolean;
	isInputCollapsed: boolean;
	isOutputCollapsed: boolean;
	dragging: boolean;
	handle: number;
	uri: URI;
	language: string;
	readonly mime: string;
	cellKind: CellKind;
	lineNumbers: 'on' | 'off' | 'inherit';
	commentOptions: IEditorCommentsOptions;
	chatHeight: number;
	commentHeight: number;
	focusMode: CellFocusMode;
	focusedOutputId?: string | undefined;
	outputIsHovered: boolean;
	getText(): string;
	getAlternativeId(): number;
	getTextLength(): number;
	getHeight(lineHeight: number): number;
	metadata: NotebookCellMetadata;
	internalMetadata: NotebookCellInternalMetadata;
	textModel: ITextModel | undefined;
	hasModel(): this is IEditableCellViewModel;
	resolveTextModel(): Promise<ITextModel>;
	getSelections(): Selection[];
	setSelections(selections: Selection[]): void;
	getSelectionsStartPosition(): IPosition[] | undefined;
	getCellDecorations(): INotebookCellDecorationOptions[];
	getCellStatusBarItems(): INotebookCellStatusBarItem[];
	getEditState(): CellEditState;
	updateEditState(state: CellEditState, source: string): void;
	deltaModelDecorations(oldDecorations: readonly string[], newDecorations: readonly IModelDeltaDecoration[]): string[];
	getCellDecorationRange(id: string): Range | null;
	enableAutoLanguageDetection(): void;
}

export interface IEditableCellViewModel extends ICellViewModel {
	textModel: ITextModel;
}

export interface INotebookEditorMouseEvent {
	readonly event: MouseEvent;
	readonly target: ICellViewModel;
}

export interface INotebookEditorContribution {
	/**
	 * Dispose this contribution.
	 */
	dispose(): void;
	/**
	 * Store view state.
	 */
	saveViewState?(): unknown;
	/**
	 * Restore view state.
	 */
	restoreViewState?(state: unknown): void;
}

/**
 * Vertical Lane in the overview ruler of the notebook editor.
 */
export enum NotebookOverviewRulerLane {
	Left = 1,
	Center = 2,
	Right = 4,
	Full = 7
}

export interface INotebookCellDecorationOptions {
	className?: string;
	gutterClassName?: string;
	outputClassName?: string;
	topClassName?: string;
	overviewRuler?: {
		color: string;
		modelRanges: IRange[];
		includeOutput: boolean;
		position: NotebookOverviewRulerLane;
	};
}

export interface INotebookViewZoneDecorationOptions {
	overviewRuler?: {
		color: string;
		position: NotebookOverviewRulerLane;
	};
}

export interface INotebookDeltaCellDecoration {
	readonly handle: number;
	readonly options: INotebookCellDecorationOptions;
}

export interface INotebookDeltaViewZoneDecoration {
	readonly viewZoneId: string;
	readonly options: INotebookViewZoneDecorationOptions;
}

export function isNotebookCellDecoration(obj: unknown): obj is INotebookDeltaCellDecoration {
	return !!obj && typeof (obj as INotebookDeltaCellDecoration).handle === 'number';
}

export function isNotebookViewZoneDecoration(obj: unknown): obj is INotebookDeltaViewZoneDecoration {
	return !!obj && typeof (obj as INotebookDeltaViewZoneDecoration).viewZoneId === 'string';
}

export type INotebookDeltaDecoration = INotebookDeltaCellDecoration | INotebookDeltaViewZoneDecoration;

export interface INotebookDeltaCellStatusBarItems {
	readonly handle: number;
	readonly items: readonly INotebookCellStatusBarItem[];
}

export const enum CellRevealType {
	Default = 1,
	Top = 2,
	Center = 3,
	CenterIfOutsideViewport = 4,
	NearTopIfOutsideViewport = 5,
	FirstLineIfOutsideViewport = 6
}

export enum CellRevealRangeType {
	Default = 1,
	Center = 2,
	CenterIfOutsideViewport = 3,
}

export interface INotebookEditorOptions extends ITextEditorOptions {
	readonly cellOptions?: ITextResourceEditorInput;
	readonly cellRevealType?: CellRevealType;
	readonly cellSelections?: ICellRange[];
	readonly isReadOnly?: boolean;
	readonly viewState?: INotebookEditorViewState;
	readonly indexedCellOptions?: { index: number; selection?: IRange };
	readonly label?: string;
}

export type INotebookEditorContributionCtor = IConstructorSignature<INotebookEditorContribution, [INotebookEditor]>;

export interface INotebookEditorContributionDescription {
	id: string;
	ctor: INotebookEditorContributionCtor;
}

export interface INotebookEditorCreationOptions {
	readonly isReplHistory?: boolean;
	readonly isReadOnly?: boolean;
	readonly contributions?: INotebookEditorContributionDescription[];
	readonly cellEditorContributions?: IEditorContributionDescription[];
	readonly menuIds: {
		notebookToolbar: MenuId;
		cellTitleToolbar: MenuId;
		cellDeleteToolbar: MenuId;
		cellInsertToolbar: MenuId;
		cellTopInsertToolbar: MenuId;
		cellExecuteToolbar: MenuId;
		cellExecutePrimary?: MenuId;
	};
	readonly options?: NotebookOptions;
	readonly codeWindow?: CodeWindow;
}

export interface INotebookWebviewMessage {
	readonly message: unknown;
}

//#region Notebook View Model
export interface INotebookEditorViewState {
	editingCells: { [key: number]: boolean };
	collapsedInputCells: { [key: number]: boolean };
	collapsedOutputCells: { [key: number]: boolean };
	cellLineNumberStates: { [key: number]: 'on' | 'off' };
	editorViewStates: { [key: number]: editorCommon.ICodeEditorViewState | null };
	hiddenFoldingRanges?: ICellRange[];
	cellTotalHeights?: { [key: number]: number };
	scrollPosition?: { left: number; top: number };
	focus?: number;
	editorFocused?: boolean;
	contributionsState?: { [id: string]: unknown };
	selectedKernelId?: string;
}

export interface ICellModelDecorations {
	readonly ownerId: number;
	readonly decorations: readonly string[];
}

export interface ICellModelDeltaDecorations {
	readonly ownerId: number;
	readonly decorations: readonly IModelDeltaDecoration[];
}

export interface IModelDecorationsChangeAccessor {
	deltaDecorations(oldDecorations: ICellModelDecorations[], newDecorations: ICellModelDeltaDecorations[]): ICellModelDecorations[];
}

export interface INotebookViewZone {
	/**
	 * Use 0 to place a view zone before the first cell
	 */
	afterModelPosition: number;
	domNode: HTMLElement;

	heightInPx: number;
}

export interface INotebookViewZoneChangeAccessor {
	addZone(zone: INotebookViewZone): string;
	removeZone(id: string): void;
	layoutZone(id: string): void;
}

export interface INotebookCellOverlay {
	cell: ICellViewModel;
	domNode: HTMLElement;
}

export interface INotebookCellOverlayChangeAccessor {
	addOverlay(overlay: INotebookCellOverlay): string;
	removeOverlay(id: string): void;
	layoutOverlay(id: string): void;
}

export type NotebookViewCellsSplice = [
	number /* start */,
	number /* delete count */,
	ICellViewModel[]
];

export interface INotebookViewCellsUpdateEvent {
	readonly synchronous: boolean;
	readonly splices: readonly NotebookViewCellsSplice[];
}

export interface INotebookViewModel {
	notebookDocument: NotebookTextModel;
	readonly viewCells: ICellViewModel[];
	layoutInfo: NotebookLayoutInfo | null;
	viewType: string;
	readonly onDidChangeViewCells: Event<INotebookViewCellsUpdateEvent>;
	readonly onDidChangeSelection: Event<string>;
	readonly onDidFoldingStateChanged: Event<void>;
	getNearestVisibleCellIndexUpwards(index: number): number;
	getTrackedRange(id: string): ICellRange | null;
	setTrackedRange(id: string | null, newRange: ICellRange | null, newStickiness: TrackedRangeStickiness): string | null;
	getOverviewRulerDecorations(): INotebookDeltaViewZoneDecoration[];
	getSelections(): ICellRange[];
	getCellIndex(cell: ICellViewModel): number;
	getMostRecentlyExecutedCell(): ICellViewModel | undefined;
	deltaCellStatusBarItems(oldItems: string[], newItems: INotebookDeltaCellStatusBarItems[]): string[];
	getFoldedLength(index: number): number;
	getFoldingStartIndex(index: number): number;
	replaceOne(cell: ICellViewModel, range: Range, text: string): Promise<void>;
	replaceAll(matches: CellFindMatchWithIndex[], texts: string[]): Promise<void>;
}
//#endregion

export interface INotebookEditor {
	//#region Eventing
	readonly onDidChangeCellState: Event<NotebookCellStateChangedEvent>;
	readonly onDidChangeViewCells: Event<INotebookViewCellsUpdateEvent>;
	readonly onDidChangeVisibleRanges: Event<void>;
	readonly onDidChangeSelection: Event<void>;
	readonly onDidChangeFocus: Event<void>;
	/**
	 * An event emitted when the model of this editor has changed.
	 */
	readonly onDidChangeModel: Event<NotebookTextModel | undefined>;
	readonly onDidAttachViewModel: Event<void>;
	readonly onDidFocusWidget: Event<void>;
	readonly onDidBlurWidget: Event<void>;
	readonly onDidScroll: Event<void>;
	readonly onDidChangeLayout: Event<void>;
	readonly onDidChangeActiveCell: Event<void>;
	readonly onDidChangeActiveEditor: Event<INotebookEditor>;
	readonly onDidChangeActiveKernel: Event<void>;
	readonly onMouseUp: Event<INotebookEditorMouseEvent>;
	readonly onMouseDown: Event<INotebookEditorMouseEvent>;
	//#endregion

	//#region readonly properties
	readonly visibleRanges: ICellRange[];
	readonly textModel?: NotebookTextModel;
	readonly isVisible: boolean;
	readonly isReadOnly: boolean;
	readonly notebookOptions: NotebookOptions;
	readonly isDisposed: boolean;
	readonly activeKernel: INotebookKernel | undefined;
	readonly scrollTop: number;
	readonly scrollBottom: number;
	readonly scopedContextKeyService: IContextKeyService;
	/**
	 * Required for Composite Editor check. The interface should not be changed.
	 */
	readonly activeCodeEditor: ICodeEditor | undefined;
	readonly codeEditors: [ICellViewModel, ICodeEditor][];
	readonly activeCellAndCodeEditor: [ICellViewModel, ICodeEditor] | undefined;
	//#endregion

	getLength(): number;
	getSelections(): ICellRange[];
	setSelections(selections: ICellRange[]): void;
	getFocus(): ICellRange;
	setFocus(focus: ICellRange): void;
	getId(): string;

	getViewModel(): INotebookViewModel | undefined;
	hasModel(): this is IActiveNotebookEditor;
	dispose(): void;
	getDomNode(): HTMLElement;
	getInnerWebview(): IWebviewElement | undefined;
	getSelectionViewModels(): ICellViewModel[];
	getEditorViewState(): INotebookEditorViewState;
	restoreListViewState(viewState: INotebookEditorViewState | undefined): void;

	getBaseCellEditorOptions(language: string): IBaseCellEditorOptions;

	/**
	 * Focus the active cell in notebook cell list
	 */
	focus(): void;

	/**
	 * Focus the notebook cell list container
	 */
	focusContainer(clearSelection?: boolean): void;

	hasEditorFocus(): boolean;
	hasWebviewFocus(): boolean;

	hasOutputTextSelection(): boolean;
	setOptions(options: INotebookEditorOptions | undefined): Promise<void>;

	/**
	 * Select & focus cell
	 */
	focusElement(cell: ICellViewModel): void;

	/**
	 * Layout info for the notebook editor
	 */
	getLayoutInfo(): NotebookLayoutInfo;

	getVisibleRangesPlusViewportAboveAndBelow(): ICellRange[];

	/**
	 * Focus the container of a cell (the monaco editor inside is not focused).
	 */
	focusNotebookCell(cell: ICellViewModel, focus: 'editor' | 'container' | 'output', options?: IFocusNotebookCellOptions): Promise<void>;

	/**
	 * Execute the given notebook cells
	 */
	executeNotebookCells(cells?: Iterable<ICellViewModel>): Promise<void>;

	/**
	 * Cancel the given notebook cells
	 */
	cancelNotebookCells(cells?: Iterable<ICellViewModel>): Promise<void>;

	/**
	 * Get current active cell
	 */
	getActiveCell(): ICellViewModel | undefined;

	/**
	 * Layout the cell with a new height
	 */
	layoutNotebookCell(cell: ICellViewModel, height: number): Promise<void>;

	/**
	 * Render the output in webview layer
	 */
	createOutput(cell: ICellViewModel, output: IInsetRenderOutput, offset: number, createWhenIdle: boolean): Promise<void>;

	/**
	 * Update the output in webview layer with latest content. It will delegate to `createOutput` is the output is not rendered yet
	 */
	updateOutput(cell: ICellViewModel, output: IInsetRenderOutput, offset: number): Promise<void>;

	/**
	 * Copy the image in the specific cell output to the clipboard
	 */
	copyOutputImage(cellOutput: ICellOutputViewModel): Promise<void>;
	/**
	 * Select the contents of the first focused output of the cell.
	 * Implementation of Ctrl+A for an output item.
	 */
	selectOutputContent(cell: ICellViewModel): void;
	/**
	 * Select the active input element of the first focused output of the cell.
	 * Implementation of Ctrl+A for an input element in an output item.
	 */
	selectInputContents(cell: ICellViewModel): void;

	readonly onDidReceiveMessage: Event<INotebookWebviewMessage>;

	/**
	 * Send message to the webview for outputs.
	 */
	postMessage(message: any): void;

	/**
	 * Remove class name on the notebook editor root DOM node.
	 */
	addClassName(className: string): void;

	/**
	 * Remove class name on the notebook editor root DOM node.
	 */
	removeClassName(className: string): void;

	/**
	 * Set scrollTop value of the notebook editor.
	 */
	setScrollTop(scrollTop: number): void;

	/**
	 * The range will be revealed with as little scrolling as possible.
	 */
	revealCellRangeInView(range: ICellRange): void;

	/**
	 * Reveal cell into viewport.
	 */
	revealInView(cell: ICellViewModel): Promise<void>;

	/**
	 * Reveal cell into the top of viewport.
	 */
	revealInViewAtTop(cell: ICellViewModel): void;

	/**
	 * Reveal cell into viewport center.
	 */
	revealInCenter(cell: ICellViewModel): void;

	/**
	 * Reveal cell into viewport center if cell is currently out of the viewport.
	 */
	revealInCenterIfOutsideViewport(cell: ICellViewModel): Promise<void>;

	/**
	 * Reveal the first line of the cell into the view if the cell is outside of the viewport.
	 */
	revealFirstLineIfOutsideViewport(cell: ICellViewModel): Promise<void>;

	/**
	 * Reveal a line in notebook cell into viewport with minimal scrolling.
	 */
	revealLineInViewAsync(cell: ICellViewModel, line: number): Promise<void>;

	/**
	 * Reveal a line in notebook cell into viewport center.
	 */
	revealLineInCenterAsync(cell: ICellViewModel, line: number): Promise<void>;

	/**
	 * Reveal a line in notebook cell into viewport center.
	 */
	revealLineInCenterIfOutsideViewportAsync(cell: ICellViewModel, line: number): Promise<void>;

	/**
	 * Reveal a range in notebook cell into viewport with minimal scrolling.
	 */
	revealRangeInViewAsync(cell: ICellViewModel, range: Selection | Range): Promise<void>;

	/**
	 * Reveal a range in notebook cell into viewport center.
	 */
	revealRangeInCenterAsync(cell: ICellViewModel, range: Selection | Range): Promise<void>;

	/**
	 * Reveal a range in notebook cell into viewport center.
	 */
	revealRangeInCenterIfOutsideViewportAsync(cell: ICellViewModel, range: Selection | Range): Promise<void>;

	/**
	 * Reveal a position with `offset` in a cell into viewport center.
	 */
	revealCellOffsetInCenter(cell: ICellViewModel, offset: number): void;

	/**
	 * Reveal `offset` in the list view into viewport center if it is outside of the viewport.
	 */
	revealOffsetInCenterIfOutsideViewport(offset: number): void;

	/**
	 * Convert the view range to model range
	 * @param startIndex Inclusive
	 * @param endIndex Exclusive
	 */
	getCellRangeFromViewRange(startIndex: number, endIndex: number): ICellRange | undefined;

	/**
	 * Set hidden areas on cell text models.
	 */
	setHiddenAreas(_ranges: ICellRange[]): boolean;

	/**
	 * Set selectiosn on the text editor attached to the cell
	 */

	setCellEditorSelection(cell: ICellViewModel, selection: Range): void;

	/**
	 *Change the decorations on the notebook cell list
	 */

	deltaCellDecorations(oldDecorations: string[], newDecorations: INotebookDeltaDecoration[]): string[];

	/**
	 * Change the decorations on cell editors.
	 * The notebook is virtualized and this method should be called to create/delete editor decorations safely.
	 */
	changeModelDecorations<T>(callback: (changeAccessor: IModelDecorationsChangeAccessor) => T): T | null;

	changeViewZones(callback: (accessor: INotebookViewZoneChangeAccessor) => void): void;

	changeCellOverlays(callback: (accessor: INotebookCellOverlayChangeAccessor) => void): void;

	getViewZoneLayoutInfo(id: string): { top: number; height: number } | null;

	/**
	 * Get a contribution of this editor.
	 * @id Unique identifier of the contribution.
	 * @return The contribution or null if contribution not found.
	 */
	getContribution<T extends INotebookEditorContribution>(id: string): T;

	/**
	 * Get the view index of a cell at model `index`
	 */
	getViewIndexByModelIndex(index: number): number;
	getCellsInRange(range?: ICellRange): ReadonlyArray<ICellViewModel>;
	cellAt(index: number): ICellViewModel | undefined;
	getCellByHandle(handle: number): ICellViewModel | undefined;
	getCellIndex(cell: ICellViewModel): number | undefined;
	getNextVisibleCellIndex(index: number): number | undefined;
	getPreviousVisibleCellIndex(index: number): number | undefined;
	find(query: string, options: INotebookFindOptions, token: CancellationToken, skipWarmup?: boolean, shouldGetSearchPreviewInfo?: boolean, ownerID?: string): Promise<CellFindMatchWithIndex[]>;
	findHighlightCurrent(matchIndex: number, ownerID?: string): Promise<number>;
	findUnHighlightCurrent(matchIndex: number, ownerID?: string): Promise<void>;
	findStop(ownerID?: string): void;
	showProgress(): void;
	hideProgress(): void;

	getAbsoluteTopOfElement(cell: ICellViewModel): number;
	getAbsoluteBottomOfElement(cell: ICellViewModel): number;
	getHeightOfElement(cell: ICellViewModel): number;
}

export interface IActiveNotebookEditor extends INotebookEditor {
	getViewModel(): INotebookViewModel;
	textModel: NotebookTextModel;
	getFocus(): ICellRange;
	cellAt(index: number): ICellViewModel;
	getCellIndex(cell: ICellViewModel): number;
	getNextVisibleCellIndex(index: number): number;
}

export interface INotebookEditorPane extends IEditorPaneWithSelection {
	getControl(): INotebookEditor | undefined;
	readonly onDidChangeModel: Event<void>;
	textModel: NotebookTextModel | undefined;
}

export interface IBaseCellEditorOptions extends IDisposable {
	readonly value: IEditorOptions;
	readonly onDidChange: Event<void>;
}

/**
 * A mix of public interface and internal one (used by internal rendering code, e.g., cellRenderer)
 */
export interface INotebookEditorDelegate extends INotebookEditor {
	hasModel(): this is IActiveNotebookEditorDelegate;

	readonly creationOptions: INotebookEditorCreationOptions;
	readonly onDidChangeOptions: Event<void>;
	readonly onDidChangeDecorations: Event<void>;
	createMarkupPreview(cell: ICellViewModel): Promise<void>;
	unhideMarkupPreviews(cells: readonly ICellViewModel[]): Promise<void>;
	hideMarkupPreviews(cells: readonly ICellViewModel[]): Promise<void>;

	/**
	 * Remove the output from the webview layer
	 */
	removeInset(output: IDisplayOutputViewModel): void;

	/**
	 * Hide the inset in the webview layer without removing it
	 */
	hideInset(output: IDisplayOutputViewModel): void;
	deltaCellContainerClassNames(cellId: string, added: string[], removed: string[], cellKind: CellKind): void;
}

export interface IActiveNotebookEditorDelegate extends INotebookEditorDelegate {
	getViewModel(): INotebookViewModel;
	textModel: NotebookTextModel;
	getFocus(): ICellRange;
	cellAt(index: number): ICellViewModel;
	getCellIndex(cell: ICellViewModel): number;
	getNextVisibleCellIndex(index: number): number;
}

export interface ISearchPreviewInfo {
	line: string;
	range: {
		start: number;
		end: number;
	};
}

export interface CellWebviewFindMatch {
	readonly index: number;
	readonly searchPreviewInfo?: ISearchPreviewInfo;
}

export type CellContentFindMatch = FindMatch;

export interface CellFindMatch {
	cell: ICellViewModel;
	contentMatches: CellContentFindMatch[];
}

export interface CellFindMatchWithIndex {
	cell: ICellViewModel;
	index: number;
	length: number;
	getMatch(index: number): FindMatch | CellWebviewFindMatch;
	contentMatches: FindMatch[];
	webviewMatches: CellWebviewFindMatch[];
}

export enum CellEditState {
	/**
	 * Default state.
	 * For markup cells, this is the renderer version of the markup.
	 * For code cell, the browser focus should be on the container instead of the editor
	 */
	Preview,

	/**
	 * Editing mode. Source for markup or code is rendered in editors and the state will be persistent.
	 */
	Editing
}

export enum CellFocusMode {
	Container,
	Editor,
	Output,
	ChatInput
}

export enum CursorAtBoundary {
	None,
	Top,
	Bottom,
	Both
}

export enum CursorAtLineBoundary {
	None,
	Start,
	End,
	Both
}

export function getNotebookEditorFromEditorPane(editorPane?: IEditorPane): INotebookEditor | undefined {
	if (!editorPane) {
		return;
	}

	if (editorPane.getId() === NOTEBOOK_EDITOR_ID) {
		return editorPane.getControl() as INotebookEditor | undefined;
	}

	if (editorPane.getId() === NOTEBOOK_DIFF_EDITOR_ID) {
		return (editorPane.getControl() as INotebookTextDiffEditor).inlineNotebookEditor;
	}

	const input = editorPane.input;

	const isCompositeNotebook = input && isCompositeNotebookEditorInput(input);

	if (isCompositeNotebook) {
		return (editorPane.getControl() as { notebookEditor: INotebookEditor | undefined } | undefined)?.notebookEditor;
	}

	return undefined;
}

/**
 * ranges: model selections
 * this will convert model selections to view indexes first, and then include the hidden ranges in the list view
 */
export function expandCellRangesWithHiddenCells(editor: INotebookEditor, ranges: ICellRange[]) {
	// assuming ranges are sorted and no overlap
	const indexes = cellRangesToIndexes(ranges);
	const modelRanges: ICellRange[] = [];
	indexes.forEach(index => {
		const viewCell = editor.cellAt(index);

		if (!viewCell) {
			return;
		}

		const viewIndex = editor.getViewIndexByModelIndex(index);
		if (viewIndex < 0) {
			return;
		}

		const nextViewIndex = viewIndex + 1;
		const range = editor.getCellRangeFromViewRange(viewIndex, nextViewIndex);

		if (range) {
			modelRanges.push(range);
		}
	});

	return reduceCellRanges(modelRanges);
}

export function cellRangeToViewCells(editor: IActiveNotebookEditor, ranges: ICellRange[]) {
	const cells: ICellViewModel[] = [];
	reduceCellRanges(ranges).forEach(range => {
		cells.push(...editor.getCellsInRange(range));
	});

	return cells;
}

//#region Cell Folding
export const enum CellFoldingState {
	None,
	Expanded,
	Collapsed
}

export interface EditorFoldingStateDelegate {
	getCellIndex(cell: ICellViewModel): number;
	getFoldingState(index: number): CellFoldingState;
}
//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/notebookCellLayoutManager.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/notebookCellLayoutManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DeferredPromise } from '../../../../base/common/async.js';
import { Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { ICellViewModel } from './notebookBrowser.js';
import { NotebookEditorWidget } from './notebookEditorWidget.js';
import { INotebookCellList } from './view/notebookRenderingCommon.js';
import * as DOM from '../../../../base/browser/dom.js';
import { INotebookLoggingService } from '../common/notebookLoggingService.js';

export class NotebookCellLayoutManager extends Disposable {
	private _pendingLayouts: WeakMap<ICellViewModel, IDisposable> | null = new WeakMap<ICellViewModel, IDisposable>();
	private _layoutDisposables: Set<IDisposable> = new Set<IDisposable>();
	private readonly _layoutStack: string[] = [];
	private _isDisposed = false;
	constructor(
		private notebookWidget: NotebookEditorWidget,
		private _list: INotebookCellList,
		private loggingService: INotebookLoggingService
	) {
		super();
	}

	private checkStackDepth() {
		if (this._layoutStack.length > 30) {
			const layoutTrace = this._layoutStack.join(' -> ');
			throw new Error('NotebookCellLayoutManager: layout stack is too deep: ' + layoutTrace);
		}
	}

	async layoutNotebookCell(cell: ICellViewModel, height: number): Promise<void> {
		const layoutTag = `cell:${cell.handle}, height:${height}`;
		this.loggingService.debug('cell layout', layoutTag);
		const viewIndex = this._list.getViewIndex(cell);
		if (viewIndex === undefined) {
			// the cell is hidden
			return;
		}

		if (this._pendingLayouts?.has(cell)) {
			const oldPendingLayout = this._pendingLayouts.get(cell)!;
			oldPendingLayout.dispose();
			this._layoutDisposables.delete(oldPendingLayout);
		}

		const deferred = new DeferredPromise<void>();
		const doLayout = () => {
			const pendingLayout = this._pendingLayouts?.get(cell);
			this._pendingLayouts?.delete(cell);

			this._layoutStack.push(layoutTag);
			try {
				if (this._isDisposed) {
					return;
				}

				if (!this.notebookWidget.viewModel?.hasCell(cell)) {
					// Cell removed in the meantime?
					return;
				}

				if (this._list.getViewIndex(cell) === undefined) {
					// Cell can be hidden
					return;
				}

				if (this._list.elementHeight(cell) === height) {
					return;
				}

				this.checkStackDepth();

				if (!this.notebookWidget.hasEditorFocus()) {
					// Do not scroll inactive notebook
					// https://github.com/microsoft/vscode/issues/145340
					const cellIndex = this.notebookWidget.viewModel?.getCellIndex(cell);
					const visibleRanges = this.notebookWidget.visibleRanges;
					if (cellIndex !== undefined
						&& visibleRanges && visibleRanges.length && visibleRanges[0].start === cellIndex
						// cell is partially visible
						&& this._list.scrollTop > this.notebookWidget.getAbsoluteTopOfElement(cell)
					) {
						return this._list.updateElementHeight2(cell, height, Math.min(cellIndex + 1, this.notebookWidget.getLength() - 1));
					}
				}

				this._list.updateElementHeight2(cell, height);
			} finally {
				this._layoutStack.pop();
				deferred.complete(undefined);
				if (pendingLayout) {
					pendingLayout.dispose();
					this._layoutDisposables.delete(pendingLayout);
				}

			}
		};

		if (this._list.inRenderingTransaction) {
			const layoutDisposable = DOM.scheduleAtNextAnimationFrame(DOM.getWindow(this.notebookWidget.getDomNode()), doLayout);

			const disposable = toDisposable(() => {
				layoutDisposable.dispose();
				deferred.complete(undefined);
			});
			this._pendingLayouts?.set(cell, disposable);
			this._layoutDisposables.add(disposable);
		} else {
			doLayout();
		}

		return deferred.p;
	}

	override dispose() {
		super.dispose();
		this._isDisposed = true;
		this._layoutDisposables.forEach(d => d.dispose());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/notebookEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/notebookEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../base/browser/dom.js';
import { IActionViewItem } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { IAction, toAction } from '../../../../base/common/actions.js';
import { timeout } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { DisposableStore, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { extname, isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { localize } from '../../../../nls.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { ByteSize, FileOperationError, FileOperationResult, IFileService, TooLargeFileOperationError } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { DEFAULT_EDITOR_ASSOCIATION, EditorPaneSelectionChangeReason, EditorPaneSelectionCompareResult, EditorResourceAccessor, IEditorMemento, IEditorOpenContext, IEditorPane, IEditorPaneScrollPosition, IEditorPaneSelection, IEditorPaneSelectionChangeEvent, IEditorPaneWithScrolling, createEditorOpenError, createTooLargeFileError, isEditorOpenError } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { SELECT_KERNEL_ID } from './controller/coreActions.js';
import { INotebookEditorOptions, INotebookEditorPane, INotebookEditorViewState } from './notebookBrowser.js';
import { IBorrowValue, INotebookEditorService } from './services/notebookEditorService.js';
import { NotebookEditorWidget } from './notebookEditorWidget.js';
import { NotebooKernelActionViewItem } from './viewParts/notebookKernelView.js';
import { NotebookTextModel } from '../common/model/notebookTextModel.js';
import { CellKind, NOTEBOOK_EDITOR_ID, NotebookWorkingCopyTypeIdentifier } from '../common/notebookCommon.js';
import { NotebookEditorInput } from '../common/notebookEditorInput.js';
import { NotebookPerfMarks } from '../common/notebookPerformance.js';
import { GroupsOrder, IEditorGroup, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IEditorProgressService } from '../../../../platform/progress/common/progress.js';
import { InstallRecommendedExtensionAction } from '../../extensions/browser/extensionsActions.js';
import { INotebookService } from '../common/notebookService.js';
import { IExtensionsWorkbenchService } from '../../extensions/common/extensions.js';
import { EnablementState } from '../../../services/extensionManagement/common/extensionManagement.js';
import { IWorkingCopyBackupService } from '../../../services/workingCopy/common/workingCopyBackup.js';
import { streamToBuffer } from '../../../../base/common/buffer.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { IActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';

const NOTEBOOK_EDITOR_VIEW_STATE_PREFERENCE_KEY = 'NotebookEditorViewState';

export class NotebookEditor extends EditorPane implements INotebookEditorPane, IEditorPaneWithScrolling {
	static readonly ID: string = NOTEBOOK_EDITOR_ID;

	private readonly _editorMemento: IEditorMemento<INotebookEditorViewState>;
	private readonly _groupListener = this._register(new DisposableStore());
	private readonly _widgetDisposableStore: DisposableStore = this._register(new DisposableStore());
	private _widget: IBorrowValue<NotebookEditorWidget> = { value: undefined };
	private _rootElement!: HTMLElement;
	private _pagePosition?: { readonly dimension: DOM.Dimension; readonly position: DOM.IDomPosition };

	private readonly _inputListener = this._register(new MutableDisposable());

	// override onDidFocus and onDidBlur to be based on the NotebookEditorWidget element
	private readonly _onDidFocusWidget = this._register(new Emitter<void>());
	override get onDidFocus(): Event<void> { return this._onDidFocusWidget.event; }
	private readonly _onDidBlurWidget = this._register(new Emitter<void>());
	override get onDidBlur(): Event<void> { return this._onDidBlurWidget.event; }

	private readonly _onDidChangeModel = this._register(new Emitter<void>());
	readonly onDidChangeModel: Event<void> = this._onDidChangeModel.event;

	private readonly _onDidChangeSelection = this._register(new Emitter<IEditorPaneSelectionChangeEvent>());
	readonly onDidChangeSelection = this._onDidChangeSelection.event;

	protected readonly _onDidChangeScroll = this._register(new Emitter<void>());
	readonly onDidChangeScroll = this._onDidChangeScroll.event;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IStorageService storageService: IStorageService,
		@IEditorService private readonly _editorService: IEditorService,
		@IEditorGroupsService private readonly _editorGroupService: IEditorGroupsService,
		@INotebookEditorService private readonly _notebookWidgetService: INotebookEditorService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IFileService private readonly _fileService: IFileService,
		@ITextResourceConfigurationService configurationService: ITextResourceConfigurationService,
		@IEditorProgressService private readonly _editorProgressService: IEditorProgressService,
		@INotebookService private readonly _notebookService: INotebookService,
		@IExtensionsWorkbenchService private readonly _extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IWorkingCopyBackupService private readonly _workingCopyBackupService: IWorkingCopyBackupService,
		@ILogService private readonly logService: ILogService,
		@IPreferencesService private readonly _preferencesService: IPreferencesService
	) {
		super(NotebookEditor.ID, group, telemetryService, themeService, storageService);
		this._editorMemento = this.getEditorMemento<INotebookEditorViewState>(_editorGroupService, configurationService, NOTEBOOK_EDITOR_VIEW_STATE_PREFERENCE_KEY);

		this._register(this._fileService.onDidChangeFileSystemProviderCapabilities(e => this._onDidChangeFileSystemProvider(e.scheme)));
		this._register(this._fileService.onDidChangeFileSystemProviderRegistrations(e => this._onDidChangeFileSystemProvider(e.scheme)));
	}

	private _onDidChangeFileSystemProvider(scheme: string): void {
		if (this.input instanceof NotebookEditorInput && this.input.resource?.scheme === scheme) {
			this._updateReadonly(this.input);
		}
	}

	private _onDidChangeInputCapabilities(input: NotebookEditorInput): void {
		if (this.input === input) {
			this._updateReadonly(input);
		}
	}

	private _updateReadonly(input: NotebookEditorInput): void {
		this._widget.value?.setOptions({ isReadOnly: !!input.isReadonly() });
	}

	get textModel(): NotebookTextModel | undefined {
		return this._widget.value?.textModel;
	}

	override get minimumWidth(): number { return 220; }
	override get maximumWidth(): number { return Number.POSITIVE_INFINITY; }

	// these setters need to exist because this extends from EditorPane
	override set minimumWidth(value: number) { /*noop*/ }
	override set maximumWidth(value: number) { /*noop*/ }

	//#region Editor Core
	override get scopedContextKeyService(): IContextKeyService | undefined {
		return this._widget.value?.scopedContextKeyService;
	}

	protected createEditor(parent: HTMLElement): void {
		this._rootElement = DOM.append(parent, DOM.$('.notebook-editor'));
		this._rootElement.id = `notebook-editor-element-${generateUuid()}`;
	}

	override getActionViewItem(action: IAction, options: IActionViewItemOptions): IActionViewItem | undefined {
		if (action.id === SELECT_KERNEL_ID) {
			// this is being disposed by the consumer
			return this._register(this._instantiationService.createInstance(NotebooKernelActionViewItem, action, this, options));
		}
		return undefined;
	}

	override getControl(): NotebookEditorWidget | undefined {
		return this._widget.value;
	}

	override setVisible(visible: boolean): void {
		super.setVisible(visible);
		if (!visible) {
			this._widget.value?.onWillHide();
		}
	}

	protected override setEditorVisible(visible: boolean): void {
		super.setEditorVisible(visible);
		this._groupListener.clear();
		this._groupListener.add(this.group.onWillCloseEditor(e => this._saveEditorViewState(e.editor)));
		this._groupListener.add(this.group.onDidModelChange(() => {
			if (this._editorGroupService.activeGroup !== this.group) {
				this._widget?.value?.updateEditorFocus();
			}
		}));

		if (!visible) {
			this._saveEditorViewState(this.input);
			if (this.input && this._widget.value) {
				// the widget is not transfered to other editor inputs
				this._widget.value.onWillHide();
			}
		}
	}

	override focus() {
		super.focus();
		this._widget.value?.focus();
	}

	override hasFocus(): boolean {
		const value = this._widget.value;
		if (!value) {
			return false;
		}

		return !!value && (DOM.isAncestorOfActiveElement(value.getDomNode() || DOM.isAncestorOfActiveElement(value.getOverflowContainerDomNode())));
	}

	override async setInput(input: NotebookEditorInput, options: INotebookEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken, noRetry?: boolean): Promise<void> {
		try {
			let perfMarksCaptured = false;
			const fileOpenMonitor = timeout(10000);
			fileOpenMonitor.then(() => {
				perfMarksCaptured = true;
				this._handlePerfMark(perf, input);
			});

			const perf = new NotebookPerfMarks();
			perf.mark('startTime');

			this._inputListener.value = input.onDidChangeCapabilities(() => this._onDidChangeInputCapabilities(input));

			this._widgetDisposableStore.clear();

			// there currently is a widget which we still own so
			// we need to hide it before getting a new widget
			this._widget.value?.onWillHide();

			this._widget = <IBorrowValue<NotebookEditorWidget>>this._instantiationService.invokeFunction(this._notebookWidgetService.retrieveWidget, this.group.id, input, undefined, this._pagePosition?.dimension, this.window);

			if (this._rootElement && this._widget.value!.getDomNode()) {
				this._rootElement.setAttribute('aria-flowto', this._widget.value!.getDomNode().id || '');
				DOM.setParentFlowTo(this._widget.value!.getDomNode(), this._rootElement);
			}

			this._widgetDisposableStore.add(this._widget.value!.onDidChangeModel(() => this._onDidChangeModel.fire()));
			this._widgetDisposableStore.add(this._widget.value!.onDidChangeActiveCell(() => this._onDidChangeSelection.fire({ reason: EditorPaneSelectionChangeReason.USER })));

			if (this._pagePosition) {
				this._widget.value!.layout(this._pagePosition.dimension, this._rootElement, this._pagePosition.position);
			}

			// only now `setInput` and yield/await. this is AFTER the actual widget is ready. This is very important
			// so that others synchronously receive a notebook editor with the correct widget being set
			await super.setInput(input, options, context, token);
			const model = await input.resolve(options, perf);
			perf.mark('inputLoaded');

			// Check for cancellation
			if (token.isCancellationRequested) {
				return undefined;
			}

			// The widget has been taken away again. This can happen when the tab has been closed while
			// loading was in progress, in particular when open the same resource as different view type.
			// When this happen, retry once
			if (!this._widget.value) {
				if (noRetry) {
					return undefined;
				}
				return this.setInput(input, options, context, token, true);
			}

			if (model === null) {
				const knownProvider = this._notebookService.getViewTypeProvider(input.viewType);

				if (!knownProvider) {
					throw new Error(localize('fail.noEditor', "Cannot open resource with notebook editor type '{0}', please check if you have the right extension installed and enabled.", input.viewType));
				}

				await this._extensionsWorkbenchService.whenInitialized;
				const extensionInfo = this._extensionsWorkbenchService.local.find(e => e.identifier.id === knownProvider);

				throw createEditorOpenError(new Error(localize('fail.noEditor.extensionMissing', "Cannot open resource with notebook editor type '{0}', please check if you have the right extension installed and enabled.", input.viewType)), [
					toAction({
						id: 'workbench.notebook.action.installOrEnableMissing', label:
							extensionInfo
								? localize('notebookOpenEnableMissingViewType', "Enable extension for '{0}'", input.viewType)
								: localize('notebookOpenInstallMissingViewType', "Install extension for '{0}'", input.viewType)
						, run: async () => {
							const d = this._notebookService.onAddViewType(viewType => {
								if (viewType === input.viewType) {
									// serializer is registered, try to open again
									this._editorService.openEditor({ resource: input.resource });
									d.dispose();
								}
							});
							const extensionInfo = this._extensionsWorkbenchService.local.find(e => e.identifier.id === knownProvider);

							try {
								if (extensionInfo) {
									await this._extensionsWorkbenchService.setEnablement(extensionInfo, extensionInfo.enablementState === EnablementState.DisabledWorkspace ? EnablementState.EnabledWorkspace : EnablementState.EnabledGlobally);
								} else {
									await this._instantiationService.createInstance(InstallRecommendedExtensionAction, knownProvider).run();
								}
							} catch (ex) {
								this.logService.error(`Failed to install or enable extension ${knownProvider}`, ex);
								d.dispose();
							}
						}
					}),
					toAction({
						id: 'workbench.notebook.action.openAsText', label: localize('notebookOpenAsText', "Open As Text"), run: async () => {
							const backup = await this._workingCopyBackupService.resolve({ resource: input.resource, typeId: NotebookWorkingCopyTypeIdentifier.create(input.viewType) });
							if (backup) {
								// with a backup present, we must resort to opening the backup contents
								// as untitled text file to not show the wrong data to the user
								const contents = await streamToBuffer(backup.value);
								this._editorService.openEditor({ resource: undefined, contents: contents.toString() });
							} else {
								// without a backup present, we can open the original resource
								this._editorService.openEditor({ resource: input.resource, options: { override: DEFAULT_EDITOR_ASSOCIATION.id, pinned: true } });
							}
						}
					})
				], { allowDialog: true });

			}

			this._widgetDisposableStore.add(model.notebook.onDidChangeContent(() => this._onDidChangeSelection.fire({ reason: EditorPaneSelectionChangeReason.EDIT })));

			const viewState = options?.viewState ?? this._loadNotebookEditorViewState(input);

			// We might be moving the notebook widget between groups, and these services are tied to the group
			this._widget.value.setParentContextKeyService(this._contextKeyService);
			this._widget.value.setEditorProgressService(this._editorProgressService);

			await this._widget.value.setModel(model.notebook, viewState, perf);
			const isReadOnly = !!input.isReadonly();
			await this._widget.value.setOptions({ ...options, isReadOnly });
			this._widgetDisposableStore.add(this._widget.value.onDidFocusWidget(() => this._onDidFocusWidget.fire()));
			this._widgetDisposableStore.add(this._widget.value.onDidBlurWidget(() => this._onDidBlurWidget.fire()));

			this._widgetDisposableStore.add(this._editorGroupService.createEditorDropTarget(this._widget.value.getDomNode(), {
				containsGroup: (group) => this.group.id === group.id
			}));

			this._widgetDisposableStore.add(this._widget.value.onDidScroll(() => { this._onDidChangeScroll.fire(); }));

			perf.mark('editorLoaded');

			fileOpenMonitor.cancel();
			if (perfMarksCaptured) {
				return;
			}

			this._handlePerfMark(perf, input, model.notebook);
			this._onDidChangeControl.fire();
		} catch (e) {
			this.logService.warn('NotebookEditorWidget#setInput failed', e);
			if (isEditorOpenError(e)) {
				throw e;
			}

			// Handle case where a file is too large to open without confirmation
			if ((<FileOperationError>e).fileOperationResult === FileOperationResult.FILE_TOO_LARGE) {
				let message: string;
				if (e instanceof TooLargeFileOperationError) {
					message = localize('notebookTooLargeForHeapErrorWithSize', "The notebook is not displayed in the notebook editor because it is very large ({0}).", ByteSize.formatSize(e.size));
				} else {
					message = localize('notebookTooLargeForHeapErrorWithoutSize', "The notebook is not displayed in the notebook editor because it is very large.");
				}

				throw createTooLargeFileError(this.group, input, options, message, this._preferencesService);
			}

			const error = createEditorOpenError(e instanceof Error ? e : new Error((e ? e.message : '')), [
				toAction({
					id: 'workbench.notebook.action.openInTextEditor', label: localize('notebookOpenInTextEditor', "Open in Text Editor"), run: async () => {
						const activeEditorPane = this._editorService.activeEditorPane;
						if (!activeEditorPane) {
							return;
						}

						const activeEditorResource = EditorResourceAccessor.getCanonicalUri(activeEditorPane.input);
						if (!activeEditorResource) {
							return;
						}

						if (activeEditorResource.toString() === input.resource?.toString()) {
							// Replace the current editor with the text editor
							return this._editorService.openEditor({
								resource: activeEditorResource,
								options: {
									override: DEFAULT_EDITOR_ASSOCIATION.id,
									pinned: true // new file gets pinned by default
								}
							});
						}

						return;
					}
				})
			], { allowDialog: true });

			throw error;
		}
	}

	private _handlePerfMark(perf: NotebookPerfMarks, input: NotebookEditorInput, notebook?: NotebookTextModel) {
		const perfMarks = perf.value;

		type WorkbenchNotebookOpenClassification = {
			owner: 'rebornix';
			comment: 'The notebook file open metrics. Used to get a better understanding of the performance of notebook file opening';
			scheme: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'File system provider scheme for the notebook resource' };
			ext: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'File extension for the notebook resource' };
			viewType: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The view type of the notebook editor' };
			extensionActivated: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Extension activation time for the resource opening' };
			inputLoaded: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Editor Input loading time for the resource opening' };
			webviewCommLoaded: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Webview initialization time for the resource opening' };
			customMarkdownLoaded: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Custom markdown loading time for the resource opening' };
			editorLoaded: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Overall editor loading time for the resource opening' };
			codeCellCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Total number of code cell' };
			mdCellCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Total number of markdown cell' };
			outputCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Total number of cell outputs' };
			outputBytes: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Total number of bytes for all outputs' };
			codeLength: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Length of text in all code cells' };
			markdownLength: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Length of text in all markdown cells' };
			notebookStatsLoaded: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Time for generating the notebook level information for telemetry' };
		};

		type WorkbenchNotebookOpenEvent = {
			scheme: string;
			ext: string;
			viewType: string;
			extensionActivated: number;
			inputLoaded: number;
			webviewCommLoaded: number;
			customMarkdownLoaded: number | undefined;
			editorLoaded: number;
			codeCellCount: number | undefined;
			mdCellCount: number | undefined;
			outputCount: number | undefined;
			outputBytes: number | undefined;
			codeLength: number | undefined;
			markdownLength: number | undefined;
			notebookStatsLoaded: number | undefined;
		};

		const startTime = perfMarks['startTime'];
		const extensionActivated = perfMarks['extensionActivated'];
		const inputLoaded = perfMarks['inputLoaded'];
		const webviewCommLoaded = perfMarks['webviewCommLoaded'];
		const customMarkdownLoaded = perfMarks['customMarkdownLoaded'];
		const editorLoaded = perfMarks['editorLoaded'];

		let extensionActivationTimespan = -1;
		let inputLoadingTimespan = -1;
		let webviewCommLoadingTimespan = -1;
		let customMarkdownLoadingTimespan = -1;
		let editorLoadingTimespan = -1;

		if (startTime !== undefined && extensionActivated !== undefined) {
			extensionActivationTimespan = extensionActivated - startTime;

			if (inputLoaded !== undefined) {
				inputLoadingTimespan = inputLoaded - extensionActivated;
			}

			if (webviewCommLoaded !== undefined) {
				webviewCommLoadingTimespan = webviewCommLoaded - extensionActivated;

			}

			if (customMarkdownLoaded !== undefined) {
				customMarkdownLoadingTimespan = customMarkdownLoaded - startTime;
			}

			if (editorLoaded !== undefined) {
				editorLoadingTimespan = editorLoaded - startTime;
			}
		}

		// Notebook information
		let codeCellCount: number | undefined = undefined;
		let mdCellCount: number | undefined = undefined;
		let outputCount: number | undefined = undefined;
		let outputBytes: number | undefined = undefined;
		let codeLength: number | undefined = undefined;
		let markdownLength: number | undefined = undefined;
		let notebookStatsLoaded: number | undefined = undefined;
		if (notebook) {
			const stopWatch = new StopWatch();
			for (const cell of notebook.cells) {
				if (cell.cellKind === CellKind.Code) {
					codeCellCount = (codeCellCount || 0) + 1;
					codeLength = (codeLength || 0) + cell.getTextLength();
					outputCount = (outputCount || 0) + cell.outputs.length;
					outputBytes = (outputBytes || 0) + cell.outputs.reduce((prev, cur) => prev + cur.outputs.reduce((size, item) => size + item.data.byteLength, 0), 0);
				} else {
					mdCellCount = (mdCellCount || 0) + 1;
					markdownLength = (codeLength || 0) + cell.getTextLength();
				}
			}
			notebookStatsLoaded = stopWatch.elapsed();
		}

		this.logService.trace(`[NotebookEditor] open notebook perf ${notebook?.uri.toString() ?? ''} - extensionActivation: ${extensionActivationTimespan}, inputLoad: ${inputLoadingTimespan}, webviewComm: ${webviewCommLoadingTimespan}, customMarkdown: ${customMarkdownLoadingTimespan}, editorLoad: ${editorLoadingTimespan}`);

		this.telemetryService.publicLog2<WorkbenchNotebookOpenEvent, WorkbenchNotebookOpenClassification>('notebook/editorOpenPerf', {
			scheme: input.resource.scheme,
			ext: extname(input.resource),
			viewType: input.viewType,
			extensionActivated: extensionActivationTimespan,
			inputLoaded: inputLoadingTimespan,
			webviewCommLoaded: webviewCommLoadingTimespan,
			customMarkdownLoaded: customMarkdownLoadingTimespan,
			editorLoaded: editorLoadingTimespan,
			codeCellCount,
			mdCellCount,
			outputCount,
			outputBytes,
			codeLength,
			markdownLength,
			notebookStatsLoaded
		});
	}

	override clearInput(): void {
		this._inputListener.clear();

		if (this._widget.value) {
			this._saveEditorViewState(this.input);
			this._widget.value.onWillHide();
		}
		super.clearInput();
	}

	override setOptions(options: INotebookEditorOptions | undefined): void {
		this._widget.value?.setOptions(options);
		super.setOptions(options);
	}

	protected override saveState(): void {
		this._saveEditorViewState(this.input);
		super.saveState();
	}

	override getViewState(): INotebookEditorViewState | undefined {
		const input = this.input;
		if (!(input instanceof NotebookEditorInput)) {
			return undefined;
		}

		this._saveEditorViewState(input);
		return this._loadNotebookEditorViewState(input);
	}

	getSelection(): IEditorPaneSelection | undefined {
		if (this._widget.value) {
			const activeCell = this._widget.value.getActiveCell();
			if (activeCell) {
				const cellUri = activeCell.uri;
				return new NotebookEditorSelection(cellUri, activeCell.getSelections());
			}
		}

		return undefined;
	}

	getScrollPosition(): IEditorPaneScrollPosition {
		const widget = this.getControl();
		if (!widget) {
			throw new Error('Notebook widget has not yet been initialized');
		}

		return {
			scrollTop: widget.scrollTop,
			scrollLeft: 0,
		};
	}

	setScrollPosition(scrollPosition: IEditorPaneScrollPosition): void {
		const editor = this.getControl();
		if (!editor) {
			throw new Error('Control has not yet been initialized');
		}

		editor.setScrollTop(scrollPosition.scrollTop);
	}

	private _saveEditorViewState(input: EditorInput | undefined): void {
		if (this._widget.value && input instanceof NotebookEditorInput) {
			if (this._widget.value.isDisposed) {
				return;
			}

			const state = this._widget.value.getEditorViewState();
			this._editorMemento.saveEditorState(this.group, input.resource, state);
		}
	}

	private _loadNotebookEditorViewState(input: NotebookEditorInput): INotebookEditorViewState | undefined {
		const result = this._editorMemento.loadEditorState(this.group, input.resource);
		if (result) {
			return result;
		}
		// when we don't have a view state for the group/input-tuple then we try to use an existing
		// editor for the same resource.
		for (const group of this._editorGroupService.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE)) {
			if (group.activeEditorPane !== this && group.activeEditorPane instanceof NotebookEditor && group.activeEditor?.matches(input)) {
				return group.activeEditorPane._widget.value?.getEditorViewState();
			}
		}
		return;
	}

	layout(dimension: DOM.Dimension, position: DOM.IDomPosition): void {
		this._rootElement.classList.toggle('mid-width', dimension.width < 1000 && dimension.width >= 600);
		this._rootElement.classList.toggle('narrow-width', dimension.width < 600);
		this._pagePosition = { dimension, position };

		if (!this._widget.value || !(this.input instanceof NotebookEditorInput)) {
			return;
		}

		if (this.input.resource.toString() !== this.textModel?.uri.toString() && this._widget.value?.hasModel()) {
			// input and widget mismatch
			// this happens when
			// 1. open document A, pin the document
			// 2. open document B
			// 3. close document B
			// 4. a layout is triggered
			return;
		}

		if (this.isVisible()) {
			this._widget.value.layout(dimension, this._rootElement, position);
		}
	}

	//#endregion
}

class NotebookEditorSelection implements IEditorPaneSelection {

	constructor(
		private readonly cellUri: URI,
		private readonly selections: Selection[]
	) { }

	compare(other: IEditorPaneSelection): EditorPaneSelectionCompareResult {
		if (!(other instanceof NotebookEditorSelection)) {
			return EditorPaneSelectionCompareResult.DIFFERENT;
		}

		if (isEqual(this.cellUri, other.cellUri)) {
			return EditorPaneSelectionCompareResult.IDENTICAL;
		}

		return EditorPaneSelectionCompareResult.DIFFERENT;
	}

	restore(options: IEditorOptions): INotebookEditorOptions {
		const notebookOptions: INotebookEditorOptions = {
			cellOptions: {
				resource: this.cellUri,
				options: {
					selection: this.selections[0]
				}
			}
		};

		Object.assign(notebookOptions, options);

		return notebookOptions;
	}

	log(): string {
		return this.cellUri.fragment;
	}
}

export function isNotebookContainingCellEditor(editor: IEditorPane | undefined, codeEditor: ICodeEditor): boolean {
	if (editor?.getId() === NotebookEditor.ID) {
		const notebookWidget = editor.getControl() as NotebookEditorWidget;
		if (notebookWidget) {
			for (const [_, editor] of notebookWidget.codeEditors) {
				if (editor === codeEditor) {
					return true;
				}
			}
		}
	}
	return false;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/notebookEditorExtensions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/notebookEditorExtensions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrandedService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotebookEditor, INotebookEditorContribution, INotebookEditorContributionCtor, INotebookEditorContributionDescription } from './notebookBrowser.js';


class EditorContributionRegistry {
	public static readonly INSTANCE = new EditorContributionRegistry();
	private readonly editorContributions: INotebookEditorContributionDescription[];

	constructor() {
		this.editorContributions = [];
	}

	public registerEditorContribution<Services extends BrandedService[]>(id: string, ctor: { new(editor: INotebookEditor, ...services: Services): INotebookEditorContribution }): void {
		this.editorContributions.push({ id, ctor: ctor as INotebookEditorContributionCtor });
	}

	public getEditorContributions(): INotebookEditorContributionDescription[] {
		return this.editorContributions.slice(0);
	}
}

export function registerNotebookContribution<Services extends BrandedService[]>(id: string, ctor: { new(editor: INotebookEditor, ...services: Services): INotebookEditorContribution }): void {
	EditorContributionRegistry.INSTANCE.registerEditorContribution(id, ctor);
}

export namespace NotebookEditorExtensionsRegistry {

	export function getEditorContributions(): INotebookEditorContributionDescription[] {
		return EditorContributionRegistry.INSTANCE.getEditorContributions();
	}

	export function getSomeEditorContributions(ids: string[]): INotebookEditorContributionDescription[] {
		return EditorContributionRegistry.INSTANCE.getEditorContributions().filter(c => ids.indexOf(c.id) >= 0);
	}
}
```

--------------------------------------------------------------------------------

````
