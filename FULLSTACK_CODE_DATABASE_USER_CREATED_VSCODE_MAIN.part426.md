---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 426
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 426 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/browser/viewModel/markupCellViewModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewModel/markupCellViewModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import * as UUID from '../../../../../base/common/uuid.js';
import * as editorCommon from '../../../../../editor/common/editorCommon.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { CellEditState, CellFindMatch, CellFoldingState, CellLayoutContext, CellLayoutState, EditorFoldingStateDelegate, ICellOutputViewModel, ICellViewModel, MarkupCellLayoutChangeEvent, MarkupCellLayoutInfo } from '../notebookBrowser.js';
import { BaseCellViewModel } from './baseCellViewModel.js';
import { NotebookCellTextModel } from '../../common/model/notebookCellTextModel.js';
import { CellKind, INotebookFindOptions } from '../../common/notebookCommon.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { ViewContext } from './viewContext.js';
import { IUndoRedoService } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { NotebookOptionsChangeEvent } from '../notebookOptions.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { NotebookCellStateChangedEvent, NotebookLayoutInfo } from '../notebookViewEvents.js';
import { IInlineChatSessionService } from '../../../inlineChat/browser/inlineChatSessionService.js';

export class MarkupCellViewModel extends BaseCellViewModel implements ICellViewModel {

	readonly cellKind = CellKind.Markup;

	private _layoutInfo: MarkupCellLayoutInfo;

	private _renderedHtml?: string;

	public get renderedHtml(): string | undefined { return this._renderedHtml; }
	public set renderedHtml(value: string | undefined) {
		if (this._renderedHtml !== value) {
			this._renderedHtml = value;
			this._onDidChangeState.fire({ contentChanged: true });
		}
	}

	get layoutInfo() {
		return this._layoutInfo;
	}

	private _previewHeight = 0;

	set renderedMarkdownHeight(newHeight: number) {
		this._previewHeight = newHeight;
		this._updateTotalHeight(this._computeTotalHeight());
	}

	private _chatHeight = 0;

	set chatHeight(newHeight: number) {
		this._chatHeight = newHeight;
		this._updateTotalHeight(this._computeTotalHeight());
	}

	get chatHeight() {
		return this._chatHeight;
	}

	private _editorHeight = 0;
	private _statusBarHeight = 0;
	set editorHeight(newHeight: number) {
		this._editorHeight = newHeight;
		this._statusBarHeight = this.viewContext.notebookOptions.computeStatusBarHeight();
		this._updateTotalHeight(this._computeTotalHeight());
	}

	get editorHeight() {
		throw new Error('MarkdownCellViewModel.editorHeight is write only');
	}

	protected readonly _onDidChangeLayout = this._register(new Emitter<MarkupCellLayoutChangeEvent>());
	readonly onDidChangeLayout = this._onDidChangeLayout.event;

	get foldingState() {
		return this.foldingDelegate.getFoldingState(this.foldingDelegate.getCellIndex(this));
	}

	private _hoveringOutput: boolean = false;
	public get outputIsHovered(): boolean {
		return this._hoveringOutput;
	}

	public set outputIsHovered(v: boolean) {
		this._hoveringOutput = v;
	}

	private _focusOnOutput: boolean = false;
	public get outputIsFocused(): boolean {
		return this._focusOnOutput;
	}

	public set outputIsFocused(v: boolean) {
		this._focusOnOutput = v;
	}

	public get inputInOutputIsFocused(): boolean {
		return false;
	}

	public set inputInOutputIsFocused(_: boolean) {
		//
	}

	private _hoveringCell = false;
	public get cellIsHovered(): boolean {
		return this._hoveringCell;
	}

	public set cellIsHovered(v: boolean) {
		this._hoveringCell = v;
		this._onDidChangeState.fire({ cellIsHoveredChanged: true });
	}

	constructor(
		viewType: string,
		model: NotebookCellTextModel,
		initialNotebookLayoutInfo: NotebookLayoutInfo | null,
		readonly foldingDelegate: EditorFoldingStateDelegate,
		readonly viewContext: ViewContext,
		@IConfigurationService configurationService: IConfigurationService,
		@ITextModelService textModelService: ITextModelService,
		@IUndoRedoService undoRedoService: IUndoRedoService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IInlineChatSessionService inlineChatSessionService: IInlineChatSessionService
	) {
		super(viewType, model, UUID.generateUuid(), viewContext, configurationService, textModelService, undoRedoService, codeEditorService, inlineChatSessionService);

		const { bottomToolbarGap } = this.viewContext.notebookOptions.computeBottomToolbarDimensions(this.viewType);
		const layoutConfiguration = this.viewContext.notebookOptions.getLayoutConfiguration();
		this._layoutInfo = {
			chatHeight: 0,
			editorHeight: 0,
			previewHeight: 0,
			fontInfo: initialNotebookLayoutInfo?.fontInfo || null,
			editorWidth: initialNotebookLayoutInfo?.width
				? this.viewContext.notebookOptions.computeMarkdownCellEditorWidth(initialNotebookLayoutInfo.width)
				: 0,
			commentOffset: 0,
			commentHeight: 0,
			bottomToolbarOffset: bottomToolbarGap,
			totalHeight: 100,
			layoutState: CellLayoutState.Uninitialized,
			foldHintHeight: 0,
			statusBarHeight: 0,
			outlineWidth: 1,
			bottomMargin: layoutConfiguration.markdownCellBottomMargin,
			topMargin: layoutConfiguration.markdownCellTopMargin,
		};

		this._register(this.onDidChangeState(e => {
			this.viewContext.eventDispatcher.emit([new NotebookCellStateChangedEvent(e, this.model)]);

			if (e.foldingStateChanged) {
				this._updateTotalHeight(this._computeTotalHeight(), CellLayoutContext.Fold);
			}
		}));
	}

	private _computeTotalHeight(): number {
		const layoutConfiguration = this.viewContext.notebookOptions.getLayoutConfiguration();
		const { bottomToolbarGap } = this.viewContext.notebookOptions.computeBottomToolbarDimensions(this.viewType);
		const foldHintHeight = this._computeFoldHintHeight();

		if (this.getEditState() === CellEditState.Editing) {
			return this._editorHeight
				+ layoutConfiguration.markdownCellTopMargin
				+ layoutConfiguration.markdownCellBottomMargin
				+ bottomToolbarGap
				+ this._statusBarHeight
				+ this._commentHeight;
		} else {
			// @rebornix
			// On file open, the previewHeight + bottomToolbarGap for a cell out of viewport can be 0
			// When it's 0, the list view will never try to render it anymore even if we scroll the cell into view.
			// Thus we make sure it's greater than 0
			return Math.max(1, this._previewHeight + bottomToolbarGap + foldHintHeight + this._commentHeight);
		}
	}

	private _computeFoldHintHeight(): number {
		return (this.getEditState() === CellEditState.Editing || this.foldingState !== CellFoldingState.Collapsed) ?
			0 : this.viewContext.notebookOptions.getLayoutConfiguration().markdownFoldHintHeight;
	}

	override updateOptions(e: NotebookOptionsChangeEvent) {
		super.updateOptions(e);
		if (e.cellStatusBarVisibility || e.insertToolbarPosition || e.cellToolbarLocation) {
			this._updateTotalHeight(this._computeTotalHeight());
		}
	}

	/**
	 * we put outputs stuff here to make compiler happy
	 */
	outputsViewModels: ICellOutputViewModel[] = [];
	getOutputOffset(index: number): number {
		// throw new Error('Method not implemented.');
		return -1;
	}
	updateOutputHeight(index: number, height: number): void {
		// throw new Error('Method not implemented.');
	}

	triggerFoldingStateChange() {
		this._onDidChangeState.fire({ foldingStateChanged: true });
	}

	private _updateTotalHeight(newHeight: number, context?: CellLayoutContext) {
		if (newHeight !== this.layoutInfo.totalHeight) {
			this.layoutChange({ totalHeight: newHeight, context });
		}
	}

	layoutChange(state: MarkupCellLayoutChangeEvent) {
		let totalHeight: number;
		let foldHintHeight: number;
		if (!this.isInputCollapsed) {
			totalHeight = state.totalHeight === undefined ?
				(this._layoutInfo.layoutState ===
					CellLayoutState.Uninitialized ?
					100 :
					this._layoutInfo.totalHeight) :
				state.totalHeight;
			// recompute
			foldHintHeight = this._computeFoldHintHeight();
		} else {
			totalHeight =
				this.viewContext.notebookOptions
					.computeCollapsedMarkdownCellHeight(this.viewType);
			state.totalHeight = totalHeight;

			foldHintHeight = 0;
		}
		let commentOffset: number;
		const notebookLayoutConfiguration = this.viewContext.notebookOptions.getLayoutConfiguration();
		if (this.getEditState() === CellEditState.Editing) {
			commentOffset = notebookLayoutConfiguration.editorToolbarHeight
				+ notebookLayoutConfiguration.cellTopMargin // CELL_TOP_MARGIN
				+ this._chatHeight
				+ this._editorHeight
				+ this._statusBarHeight;
		} else {
			commentOffset = this._previewHeight;
		}

		this._layoutInfo = {
			fontInfo: state.font || this._layoutInfo.fontInfo,
			editorWidth: state.outerWidth !== undefined ?
				this.viewContext.notebookOptions
					.computeMarkdownCellEditorWidth(state.outerWidth) :
				this._layoutInfo.editorWidth,
			chatHeight: this._chatHeight,
			editorHeight: this._editorHeight,
			statusBarHeight: this._statusBarHeight,
			previewHeight: this._previewHeight,
			bottomToolbarOffset: this.viewContext.notebookOptions
				.computeBottomToolbarOffset(
					totalHeight, this.viewType),
			totalHeight,
			layoutState: CellLayoutState.Measured,
			foldHintHeight,
			commentOffset,
			commentHeight: state.commentHeight ?
				this._commentHeight :
				this._layoutInfo.commentHeight,
			outlineWidth: 1,
			bottomMargin: notebookLayoutConfiguration.markdownCellBottomMargin,
			topMargin: notebookLayoutConfiguration.markdownCellTopMargin,
		};

		this._onDidChangeLayout.fire(state);
	}

	override restoreEditorViewState(editorViewStates: editorCommon.ICodeEditorViewState | null, totalHeight?: number) {
		super.restoreEditorViewState(editorViewStates);
		// we might already warmup the viewport so the cell has a total height computed
		if (totalHeight !== undefined && this.layoutInfo.layoutState === CellLayoutState.Uninitialized) {
			this._layoutInfo = {
				...this.layoutInfo,
				totalHeight: totalHeight,
				chatHeight: this._chatHeight,
				editorHeight: this._editorHeight,
				statusBarHeight: this._statusBarHeight,
				layoutState: CellLayoutState.FromCache,
			};
			this.layoutChange({});
		}
	}

	getDynamicHeight() {
		return null;
	}

	getHeight(lineHeight: number) {
		if (this._layoutInfo.layoutState === CellLayoutState.Uninitialized) {
			return 100;
		} else {
			return this._layoutInfo.totalHeight;
		}
	}

	protected onDidChangeTextModelContent(): void {
		this._onDidChangeState.fire({ contentChanged: true });
	}

	onDeselect() {
	}


	private readonly _hasFindResult = this._register(new Emitter<boolean>());
	public readonly hasFindResult: Event<boolean> = this._hasFindResult.event;

	startFind(value: string, options: INotebookFindOptions): CellFindMatch | null {
		const matches = super.cellStartFind(value, options);

		if (matches === null) {
			return null;
		}

		return {
			cell: this,
			contentMatches: matches
		};
	}

	override dispose() {
		super.dispose();
		(this.foldingDelegate as unknown) = null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewModel/notebookOutlineDataSource.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewModel/notebookOutlineDataSource.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { DisposableStore, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IMarkerService } from '../../../../../platform/markers/common/markers.js';
import { IActiveNotebookEditor, INotebookEditor } from '../notebookBrowser.js';
import { CellKind } from '../../common/notebookCommon.js';
import { OutlineChangeEvent, OutlineConfigKeys } from '../../../../services/outline/browser/outline.js';
import { OutlineEntry } from './OutlineEntry.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { INotebookOutlineEntryFactory, NotebookOutlineEntryFactory } from './notebookOutlineEntryFactory.js';

export interface INotebookCellOutlineDataSource {
	readonly activeElement: OutlineEntry | undefined;
	readonly entries: OutlineEntry[];
}

export class NotebookCellOutlineDataSource implements INotebookCellOutlineDataSource {

	private readonly _disposables = new DisposableStore();

	private readonly _onDidChange = new Emitter<OutlineChangeEvent>();
	readonly onDidChange: Event<OutlineChangeEvent> = this._onDidChange.event;

	private _uri: URI | undefined;
	private _entries: OutlineEntry[] = [];
	private _activeEntry?: OutlineEntry;

	constructor(
		private readonly _editor: INotebookEditor,
		@IMarkerService private readonly _markerService: IMarkerService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@INotebookOutlineEntryFactory private readonly _outlineEntryFactory: NotebookOutlineEntryFactory
	) {
		this.recomputeState();
	}

	get activeElement(): OutlineEntry | undefined {
		return this._activeEntry;
	}
	get entries(): OutlineEntry[] {
		return this._entries;
	}
	get isEmpty(): boolean {
		return this._entries.length === 0;
	}
	get uri() {
		return this._uri;
	}

	public async computeFullSymbols(cancelToken: CancellationToken) {
		try {
			const notebookEditorWidget = this._editor;

			const notebookCells = notebookEditorWidget?.getViewModel()?.viewCells.filter((cell) => cell.cellKind === CellKind.Code);

			if (notebookCells) {
				const promises: Promise<void>[] = [];
				// limit the number of cells so that we don't resolve an excessive amount of text models
				for (const cell of notebookCells.slice(0, 50)) {
					// gather all symbols asynchronously
					promises.push(this._outlineEntryFactory.cacheSymbols(cell, cancelToken));
				}
				await Promise.allSettled(promises);
			}
			this.recomputeState();
		} catch (err) {
			console.error('Failed to compute notebook outline symbols:', err);
			// Still recompute state with whatever symbols we have
			this.recomputeState();
		}
	}

	public recomputeState(): void {
		this._disposables.clear();
		this._activeEntry = undefined;
		this._uri = undefined;

		if (!this._editor.hasModel()) {
			return;
		}

		this._uri = this._editor.textModel.uri;

		const notebookEditorWidget: IActiveNotebookEditor = this._editor;

		if (notebookEditorWidget.getLength() === 0) {
			return;
		}

		const notebookCells = notebookEditorWidget.getViewModel().viewCells;

		const entries: OutlineEntry[] = [];
		for (const cell of notebookCells) {
			entries.push(...this._outlineEntryFactory.getOutlineEntries(cell, entries.length));
		}

		// build a tree from the list of entries
		if (entries.length > 0) {
			const result: OutlineEntry[] = [entries[0]];
			const parentStack: OutlineEntry[] = [entries[0]];

			for (let i = 1; i < entries.length; i++) {
				const entry = entries[i];

				while (true) {
					const len = parentStack.length;
					if (len === 0) {
						// root node
						result.push(entry);
						parentStack.push(entry);
						break;

					} else {
						const parentCandidate = parentStack[len - 1];
						if (parentCandidate.level < entry.level) {
							parentCandidate.addChild(entry);
							parentStack.push(entry);
							break;
						} else {
							parentStack.pop();
						}
					}
				}
			}
			this._entries = result;
		}

		// feature: show markers with each cell
		const markerServiceListener = new MutableDisposable();
		this._disposables.add(markerServiceListener);
		const updateMarkerUpdater = () => {
			if (notebookEditorWidget.isDisposed) {
				return;
			}

			const doUpdateMarker = (clear: boolean) => {
				for (const entry of this._entries) {
					if (clear) {
						entry.clearMarkers();
					} else {
						entry.updateMarkers(this._markerService);
					}
				}
			};
			const problem = this._configurationService.getValue('problems.visibility');
			if (problem === undefined) {
				return;
			}

			const config = this._configurationService.getValue(OutlineConfigKeys.problemsEnabled);

			if (problem && config) {
				markerServiceListener.value = this._markerService.onMarkerChanged(e => {
					if (notebookEditorWidget.isDisposed) {
						console.error('notebook editor is disposed');
						return;
					}

					if (e.some(uri => notebookEditorWidget.getCellsInRange().some(cell => isEqual(cell.uri, uri)))) {
						doUpdateMarker(false);
						this._onDidChange.fire({});
					}
				});
				doUpdateMarker(false);
			} else {
				markerServiceListener.clear();
				doUpdateMarker(true);
			}
		};
		updateMarkerUpdater();
		this._disposables.add(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('problems.visibility') || e.affectsConfiguration(OutlineConfigKeys.problemsEnabled)) {
				updateMarkerUpdater();
				this._onDidChange.fire({});
			}
		}));

		const { changeEventTriggered } = this.recomputeActive();
		if (!changeEventTriggered) {
			this._onDidChange.fire({});
		}
	}

	public recomputeActive(): { changeEventTriggered: boolean } {
		let newActive: OutlineEntry | undefined;
		const notebookEditorWidget = this._editor;

		if (notebookEditorWidget) {//TODO don't check for widget, only here if we do have
			if (notebookEditorWidget.hasModel() && notebookEditorWidget.getLength() > 0) {
				const cell = notebookEditorWidget.cellAt(notebookEditorWidget.getFocus().start);
				if (cell) {
					for (const entry of this._entries) {
						newActive = entry.find(cell, []);
						if (newActive) {
							break;
						}
					}
				}
			}
		}

		if (newActive !== this._activeEntry) {
			this._activeEntry = newActive;
			this._onDidChange.fire({ affectOnlyActiveElement: true });
			return { changeEventTriggered: true };
		}
		return { changeEventTriggered: false };
	}

	dispose(): void {
		this._entries.length = 0;
		this._activeEntry = undefined;
		this._disposables.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewModel/notebookOutlineDataSourceFactory.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewModel/notebookOutlineDataSourceFactory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ReferenceCollection, type IReference } from '../../../../../base/common/lifecycle.js';
import { IInstantiationService, createDecorator } from '../../../../../platform/instantiation/common/instantiation.js';
import type { INotebookEditor } from '../notebookBrowser.js';
import { NotebookCellOutlineDataSource } from './notebookOutlineDataSource.js';

class NotebookCellOutlineDataSourceReferenceCollection extends ReferenceCollection<NotebookCellOutlineDataSource> {
	constructor(@IInstantiationService private readonly instantiationService: IInstantiationService) {
		super();
	}
	protected override createReferencedObject(_key: string, editor: INotebookEditor): NotebookCellOutlineDataSource {
		return this.instantiationService.createInstance(NotebookCellOutlineDataSource, editor);
	}
	protected override destroyReferencedObject(_key: string, object: NotebookCellOutlineDataSource): void {
		object.dispose();
	}
}

export const INotebookCellOutlineDataSourceFactory = createDecorator<INotebookCellOutlineDataSourceFactory>('INotebookCellOutlineDataSourceFactory');

export interface INotebookCellOutlineDataSourceFactory {
	getOrCreate(editor: INotebookEditor): IReference<NotebookCellOutlineDataSource>;
}

export class NotebookCellOutlineDataSourceFactory implements INotebookCellOutlineDataSourceFactory {
	private readonly _data: NotebookCellOutlineDataSourceReferenceCollection;
	constructor(@IInstantiationService instantiationService: IInstantiationService) {
		this._data = instantiationService.createInstance(NotebookCellOutlineDataSourceReferenceCollection);
	}

	getOrCreate(editor: INotebookEditor): IReference<NotebookCellOutlineDataSource> {
		return this._data.acquire(editor.getId(), editor);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewModel/notebookOutlineEntryFactory.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewModel/notebookOutlineEntryFactory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { renderAsPlaintext } from '../../../../../base/browser/markdownRenderer.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { IOutlineModelService, OutlineModelService } from '../../../../../editor/contrib/documentSymbols/browser/outlineModel.js';
import { localize } from '../../../../../nls.js';
import { ICellViewModel } from '../notebookBrowser.js';
import { getMarkdownHeadersInCell } from './foldingModel.js';
import { OutlineEntry } from './OutlineEntry.js';
import { CellKind } from '../../common/notebookCommon.js';
import { INotebookExecutionStateService } from '../../common/notebookExecutionStateService.js';
import { IRange } from '../../../../../editor/common/core/range.js';
import { SymbolKind } from '../../../../../editor/common/languages.js';
import { createDecorator } from '../../../../../platform/instantiation/common/instantiation.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';

export const enum NotebookOutlineConstants {
	NonHeaderOutlineLevel = 7,
}

type entryDesc = {
	name: string;
	range: IRange;
	level: number;
	kind: SymbolKind;
};

function getMarkdownHeadersInCellFallbackToHtmlTags(fullContent: string) {
	const headers = Array.from(getMarkdownHeadersInCell(fullContent));
	if (headers.length) {
		return headers;
	}
	// no markdown syntax headers, try to find html tags
	const match = fullContent.match(/<h([1-6]).*>(.*)<\/h\1>/i);
	if (match) {
		const level = parseInt(match[1]);
		const text = match[2].trim();
		headers.push({ depth: level, text });
	}
	return headers;
}

export const INotebookOutlineEntryFactory = createDecorator<INotebookOutlineEntryFactory>('INotebookOutlineEntryFactory');

export interface INotebookOutlineEntryFactory {
	readonly _serviceBrand: undefined;

	getOutlineEntries(cell: ICellViewModel, index: number): OutlineEntry[];
	cacheSymbols(cell: ICellViewModel, cancelToken: CancellationToken): Promise<void>;
}

export class NotebookOutlineEntryFactory implements INotebookOutlineEntryFactory {

	declare readonly _serviceBrand: undefined;

	private cellOutlineEntryCache: Record<string, entryDesc[]> = {};
	private readonly cachedMarkdownOutlineEntries = new WeakMap<ICellViewModel, { alternativeId: number; headers: { depth: number; text: string }[] }>();
	constructor(
		@INotebookExecutionStateService private readonly executionStateService: INotebookExecutionStateService,
		@IOutlineModelService private readonly outlineModelService: IOutlineModelService,
		@ITextModelService private readonly textModelService: ITextModelService
	) { }

	public getOutlineEntries(cell: ICellViewModel, index: number): OutlineEntry[] {
		const entries: OutlineEntry[] = [];

		const isMarkdown = cell.cellKind === CellKind.Markup;

		// cap the amount of characters that we look at and use the following logic
		// - for MD prefer headings (each header is an entry)
		// - otherwise use the first none-empty line of the cell (MD or code)
		let content = getCellFirstNonEmptyLine(cell);
		let hasHeader = false;

		if (isMarkdown) {
			const fullContent = cell.getText().substring(0, 10000);
			const cache = this.cachedMarkdownOutlineEntries.get(cell);
			const headers = cache?.alternativeId === cell.getAlternativeId() ? cache.headers : Array.from(getMarkdownHeadersInCellFallbackToHtmlTags(fullContent));
			this.cachedMarkdownOutlineEntries.set(cell, { alternativeId: cell.getAlternativeId(), headers });

			for (const { depth, text } of headers) {
				hasHeader = true;
				entries.push(new OutlineEntry(index++, depth, cell, text, false, false));
			}

			if (!hasHeader) {
				content = renderAsPlaintext({ value: content });
			}
		}

		if (!hasHeader) {
			const exeState = !isMarkdown && this.executionStateService.getCellExecution(cell.uri);
			let preview = content.trim();

			if (!isMarkdown) {
				const cached = this.cellOutlineEntryCache[cell.id];

				// Gathering symbols from the model is an async operation, but this provider is syncronous.
				// So symbols need to be precached before this function is called to get the full list.
				if (cached) {
					// push code cell entry that is a parent of cached symbols, always necessary. filtering for quickpick done in that provider.
					entries.push(new OutlineEntry(index++, NotebookOutlineConstants.NonHeaderOutlineLevel, cell, preview, !!exeState, exeState ? exeState.isPaused : false));
					cached.forEach((entry) => {
						entries.push(new OutlineEntry(index++, entry.level, cell, entry.name, false, false, entry.range, entry.kind));
					});
				}
			}

			if (entries.length === 0) { // if there are no cached entries, use the first line of the cell as a code cell
				if (preview.length === 0) {
					// empty or just whitespace
					preview = localize('empty', "empty cell");
				}
				entries.push(new OutlineEntry(index++, NotebookOutlineConstants.NonHeaderOutlineLevel, cell, preview, !!exeState, exeState ? exeState.isPaused : false));
			}
		}

		return entries;
	}

	public async cacheSymbols(cell: ICellViewModel, cancelToken: CancellationToken) {
		if (cell.cellKind === CellKind.Markup) {
			return;
		}

		const ref = await this.textModelService.createModelReference(cell.uri);
		try {
			const textModel = ref.object.textEditorModel;
			const outlineModel = await this.outlineModelService.getOrCreate(textModel, cancelToken);
			const entries = createOutlineEntries(outlineModel.getTopLevelSymbols(), 8);
			this.cellOutlineEntryCache[cell.id] = entries;
		} finally {
			ref.dispose();
		}
	}
}

type outlineModel = Awaited<ReturnType<OutlineModelService['getOrCreate']>>;
type documentSymbol = ReturnType<outlineModel['getTopLevelSymbols']>[number];

function createOutlineEntries(symbols: documentSymbol[], level: number): entryDesc[] {
	const entries: entryDesc[] = [];
	symbols.forEach(symbol => {
		entries.push({ name: symbol.name, range: symbol.range, level, kind: symbol.kind });
		if (symbol.children) {
			entries.push(...createOutlineEntries(symbol.children, level + 1));
		}
	});
	return entries;
}

function getCellFirstNonEmptyLine(cell: ICellViewModel) {
	const textBuffer = cell.textBuffer;
	for (let i = 0; i < textBuffer.getLineCount(); i++) {
		const firstNonWhitespace = textBuffer.getLineFirstNonWhitespaceColumn(i + 1);
		const lineLength = textBuffer.getLineLength(i + 1);
		if (firstNonWhitespace < lineLength) {
			return textBuffer.getLineContent(i + 1);
		}
	}

	return cell.getText().substring(0, 100);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewModel/notebookViewModelImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewModel/notebookViewModelImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { groupBy } from '../../../../../base/common/collections.js';
import { onUnexpectedError } from '../../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { clamp } from '../../../../../base/common/numbers.js';
import * as strings from '../../../../../base/common/strings.js';
import { URI } from '../../../../../base/common/uri.js';
import { IBulkEditService, ResourceTextEdit } from '../../../../../editor/browser/services/bulkEditService.js';
import { Range } from '../../../../../editor/common/core/range.js';
import * as editorCommon from '../../../../../editor/common/editorCommon.js';
import { IWorkspaceTextEdit } from '../../../../../editor/common/languages.js';
import { FindMatch, IModelDecorationOptions, IModelDeltaDecoration, TrackedRangeStickiness } from '../../../../../editor/common/model.js';
import { MultiModelEditStackElement, SingleModelEditStackElement } from '../../../../../editor/common/model/editStack.js';
import { IntervalNode, IntervalTree } from '../../../../../editor/common/model/intervalTree.js';
import { ModelDecorationOptions } from '../../../../../editor/common/model/textModel.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { FoldingRegions } from '../../../../../editor/contrib/folding/browser/foldingRanges.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IUndoRedoService } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { CellFindMatchModel } from '../contrib/find/findModel.js';
import { CellEditState, CellFindMatchWithIndex, CellFoldingState, EditorFoldingStateDelegate, ICellModelDecorations, ICellModelDeltaDecorations, ICellViewModel, IModelDecorationsChangeAccessor, INotebookDeltaCellStatusBarItems, INotebookEditorViewState, INotebookViewCellsUpdateEvent, INotebookViewModel, INotebookDeltaDecoration, isNotebookCellDecoration, INotebookDeltaViewZoneDecoration } from '../notebookBrowser.js';
import { NotebookLayoutInfo, NotebookMetadataChangedEvent } from '../notebookViewEvents.js';
import { NotebookCellSelectionCollection } from './cellSelectionCollection.js';
import { CodeCellViewModel } from './codeCellViewModel.js';
import { MarkupCellViewModel } from './markupCellViewModel.js';
import { ViewContext } from './viewContext.js';
import { NotebookCellTextModel } from '../../common/model/notebookCellTextModel.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { CellKind, ICell, INotebookFindOptions, ISelectionState, NotebookCellsChangeType, NotebookCellTextModelSplice, NotebookFindScopeType, SelectionStateType } from '../../common/notebookCommon.js';
import { INotebookExecutionStateService, NotebookExecutionType } from '../../common/notebookExecutionStateService.js';
import { cellIndexesToRanges, cellRangesToIndexes, ICellRange, reduceCellRanges } from '../../common/notebookRange.js';

const invalidFunc = () => { throw new Error(`Invalid change accessor`); };

class DecorationsTree {
	private readonly _decorationsTree: IntervalTree;

	constructor() {
		this._decorationsTree = new IntervalTree();
	}

	public intervalSearch(start: number, end: number, filterOwnerId: number, filterOutValidation: boolean, filterFontDecorations: boolean, cachedVersionId: number, onlyMarginDecorations: boolean = false): IntervalNode[] {
		const r1 = this._decorationsTree.intervalSearch(start, end, filterOwnerId, filterOutValidation, filterFontDecorations, cachedVersionId, onlyMarginDecorations);
		return r1;
	}

	public search(filterOwnerId: number, filterOutValidation: boolean, filterFontDecorations: boolean, overviewRulerOnly: boolean, cachedVersionId: number, onlyMarginDecorations: boolean): IntervalNode[] {
		return this._decorationsTree.search(filterOwnerId, filterOutValidation, filterFontDecorations, cachedVersionId, onlyMarginDecorations);

	}

	public collectNodesFromOwner(ownerId: number): IntervalNode[] {
		const r1 = this._decorationsTree.collectNodesFromOwner(ownerId);
		return r1;
	}

	public collectNodesPostOrder(): IntervalNode[] {
		const r1 = this._decorationsTree.collectNodesPostOrder();
		return r1;
	}

	public insert(node: IntervalNode): void {
		this._decorationsTree.insert(node);
	}

	public delete(node: IntervalNode): void {
		this._decorationsTree.delete(node);
	}

	public resolveNode(node: IntervalNode, cachedVersionId: number): void {
		this._decorationsTree.resolveNode(node, cachedVersionId);
	}

	public acceptReplace(offset: number, length: number, textLength: number, forceMoveMarkers: boolean): void {
		this._decorationsTree.acceptReplace(offset, length, textLength, forceMoveMarkers);
	}
}

const TRACKED_RANGE_OPTIONS = [
	ModelDecorationOptions.register({ description: 'notebook-view-model-tracked-range-always-grows-when-typing-at-edges', stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges }),
	ModelDecorationOptions.register({ description: 'notebook-view-model-tracked-range-never-grows-when-typing-at-edges', stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges }),
	ModelDecorationOptions.register({ description: 'notebook-view-model-tracked-range-grows-only-when-typing-before', stickiness: TrackedRangeStickiness.GrowsOnlyWhenTypingBefore }),
	ModelDecorationOptions.register({ description: 'notebook-view-model-tracked-range-grows-only-when-typing-after', stickiness: TrackedRangeStickiness.GrowsOnlyWhenTypingAfter }),
];

function _normalizeOptions(options: IModelDecorationOptions): ModelDecorationOptions {
	if (options instanceof ModelDecorationOptions) {
		return options;
	}
	return ModelDecorationOptions.createDynamic(options);
}

let MODEL_ID = 0;

export interface NotebookViewModelOptions {
	isReadOnly: boolean;
}

export class NotebookViewModel extends Disposable implements EditorFoldingStateDelegate, INotebookViewModel {
	private readonly _localStore = this._register(new DisposableStore());
	private _handleToViewCellMapping = new Map<number, CellViewModel>();
	get options(): NotebookViewModelOptions { return this._options; }
	private readonly _onDidChangeOptions = this._register(new Emitter<void>());
	get onDidChangeOptions(): Event<void> { return this._onDidChangeOptions.event; }
	private _viewCells: CellViewModel[] = [];

	get viewCells(): ICellViewModel[] {
		return this._viewCells;
	}

	get length(): number {
		return this._viewCells.length;
	}

	get notebookDocument() {
		return this._notebook;
	}

	get uri() {
		return this._notebook.uri;
	}

	get metadata() {
		return this._notebook.metadata;
	}

	private get isRepl() {
		return this.viewType === 'repl';
	}

	private readonly _onDidChangeViewCells = this._register(new Emitter<INotebookViewCellsUpdateEvent>());
	get onDidChangeViewCells(): Event<INotebookViewCellsUpdateEvent> { return this._onDidChangeViewCells.event; }

	private _lastNotebookEditResource: URI[] = [];

	get lastNotebookEditResource(): URI | null {
		if (this._lastNotebookEditResource.length) {
			return this._lastNotebookEditResource[this._lastNotebookEditResource.length - 1];
		}
		return null;
	}

	get layoutInfo(): NotebookLayoutInfo | null {
		return this._layoutInfo;
	}

	private readonly _onDidChangeSelection = this._register(new Emitter<string>());
	get onDidChangeSelection(): Event<string> { return this._onDidChangeSelection.event; }

	private _selectionCollection = this._register(new NotebookCellSelectionCollection());

	private get selectionHandles() {
		const handlesSet = new Set<number>();
		const handles: number[] = [];
		cellRangesToIndexes(this._selectionCollection.selections).map(index => index < this.length ? this.cellAt(index) : undefined).forEach(cell => {
			if (cell && !handlesSet.has(cell.handle)) {
				handles.push(cell.handle);
			}
		});

		return handles;
	}

	private set selectionHandles(selectionHandles: number[]) {
		const indexes = selectionHandles.map(handle => this._viewCells.findIndex(cell => cell.handle === handle));
		this._selectionCollection.setSelections(cellIndexesToRanges(indexes), true, 'model');
	}

	private _decorationsTree = new DecorationsTree();
	private _decorations: { [decorationId: string]: IntervalNode } = Object.create(null);
	private _lastDecorationId: number = 0;
	private readonly _instanceId: string;
	public readonly id: string;
	private _foldingRanges: FoldingRegions | null = null;
	private _onDidFoldingStateChanged = new Emitter<void>();
	readonly onDidFoldingStateChanged: Event<void> = this._onDidFoldingStateChanged.event;
	private _hiddenRanges: ICellRange[] = [];
	private _focused: boolean = true;

	get focused() {
		return this._focused;
	}

	private _decorationIdToCellMap = new Map<string, number>();
	private _statusBarItemIdToCellMap = new Map<string, number>();

	private _lastOverviewRulerDecorationId: number = 0;
	private _overviewRulerDecorations = new Map<string, INotebookDeltaViewZoneDecoration>();

	constructor(
		public viewType: string,
		private _notebook: NotebookTextModel,
		private _viewContext: ViewContext,
		private _layoutInfo: NotebookLayoutInfo | null,
		private _options: NotebookViewModelOptions,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IBulkEditService private readonly _bulkEditService: IBulkEditService,
		@IUndoRedoService private readonly _undoService: IUndoRedoService,
		@ITextModelService private readonly _textModelService: ITextModelService,
		@INotebookExecutionStateService private readonly notebookExecutionStateService: INotebookExecutionStateService,
	) {
		super();

		MODEL_ID++;
		this.id = '$notebookViewModel' + MODEL_ID;
		this._instanceId = strings.singleLetterHash(MODEL_ID);

		const compute = (changes: NotebookCellTextModelSplice<ICell>[], synchronous: boolean) => {
			const diffs = changes.map(splice => {
				return [splice[0], splice[1], splice[2].map(cell => {
					return createCellViewModel(this._instantiationService, this, cell as NotebookCellTextModel, this._viewContext);
				})] as [number, number, CellViewModel[]];
			});

			diffs.reverse().forEach(diff => {
				const deletedCells = this._viewCells.splice(diff[0], diff[1], ...diff[2]);

				this._decorationsTree.acceptReplace(diff[0], diff[1], diff[2].length, true);
				deletedCells.forEach(cell => {
					this._handleToViewCellMapping.delete(cell.handle);
					// dispose the cell to release ref to the cell text document
					cell.dispose();
				});

				diff[2].forEach(cell => {
					this._handleToViewCellMapping.set(cell.handle, cell);
					this._localStore.add(cell);
				});
			});

			const selectionHandles = this.selectionHandles;

			this._onDidChangeViewCells.fire({
				synchronous: synchronous,
				splices: diffs
			});

			let endSelectionHandles: number[] = [];
			if (selectionHandles.length) {
				const primaryHandle = selectionHandles[0];
				const primarySelectionIndex = this._viewCells.indexOf(this.getCellByHandle(primaryHandle)!);
				endSelectionHandles = [primaryHandle];
				let delta = 0;

				for (let i = 0; i < diffs.length; i++) {
					const diff = diffs[0];
					if (diff[0] + diff[1] <= primarySelectionIndex) {
						delta += diff[2].length - diff[1];
						continue;
					}

					if (diff[0] > primarySelectionIndex) {
						endSelectionHandles = [primaryHandle];
						break;
					}

					if (diff[0] + diff[1] > primarySelectionIndex) {
						endSelectionHandles = [this._viewCells[diff[0] + delta].handle];
						break;
					}
				}
			}

			// TODO@rebornix
			const selectionIndexes = endSelectionHandles.map(handle => this._viewCells.findIndex(cell => cell.handle === handle));
			this._selectionCollection.setState(cellIndexesToRanges([selectionIndexes[0]])[0], cellIndexesToRanges(selectionIndexes), true, 'model');
		};

		this._register(this._notebook.onDidChangeContent(e => {
			for (let i = 0; i < e.rawEvents.length; i++) {
				const change = e.rawEvents[i];
				let changes: NotebookCellTextModelSplice<ICell>[] = [];
				const synchronous = e.synchronous ?? true;

				if (change.kind === NotebookCellsChangeType.ModelChange || change.kind === NotebookCellsChangeType.Initialize) {
					changes = change.changes;
					compute(changes, synchronous);
					continue;
				} else if (change.kind === NotebookCellsChangeType.Move) {
					compute([[change.index, change.length, []]], synchronous);
					compute([[change.newIdx, 0, change.cells]], synchronous);
				} else {
					continue;
				}
			}
		}));

		this._register(this._notebook.onDidChangeContent(contentChanges => {
			contentChanges.rawEvents.forEach(e => {
				if (e.kind === NotebookCellsChangeType.ChangeDocumentMetadata) {
					this._viewContext.eventDispatcher.emit([new NotebookMetadataChangedEvent(this._notebook.metadata)]);
				}
			});

			if (contentChanges.endSelectionState) {
				this.updateSelectionsState(contentChanges.endSelectionState);
			}
		}));

		this._register(this._viewContext.eventDispatcher.onDidChangeLayout((e) => {
			this._layoutInfo = e.value;

			this._viewCells.forEach(cell => {
				if (cell.cellKind === CellKind.Markup) {
					if (e.source.width || e.source.fontInfo) {
						cell.layoutChange({ outerWidth: e.value.width, font: e.value.fontInfo });
					}
				} else {
					if (e.source.width !== undefined) {
						cell.layoutChange({ outerWidth: e.value.width, font: e.value.fontInfo });
					}
				}
			});
		}));

		this._register(this._viewContext.notebookOptions.onDidChangeOptions(e => {
			for (let i = 0; i < this.length; i++) {
				const cell = this._viewCells[i];
				cell.updateOptions(e);
			}
		}));

		this._register(notebookExecutionStateService.onDidChangeExecution(e => {
			if (e.type !== NotebookExecutionType.cell) {
				return;
			}
			const cell = this.getCellByHandle(e.cellHandle);

			if (cell instanceof CodeCellViewModel) {
				cell.updateExecutionState(e);
			}
		}));

		this._register(this._selectionCollection.onDidChangeSelection(e => {
			this._onDidChangeSelection.fire(e);
		}));


		const viewCellCount = this.isRepl ? this._notebook.cells.length - 1 : this._notebook.cells.length;
		for (let i = 0; i < viewCellCount; i++) {
			this._viewCells.push(createCellViewModel(this._instantiationService, this, this._notebook.cells[i], this._viewContext));
		}


		this._viewCells.forEach(cell => {
			this._handleToViewCellMapping.set(cell.handle, cell);
		});
	}

	updateOptions(newOptions: Partial<NotebookViewModelOptions>) {
		this._options = { ...this._options, ...newOptions };
		this._viewCells.forEach(cell => cell.updateOptions({ readonly: this._options.isReadOnly }));
		this._onDidChangeOptions.fire();
	}

	getFocus() {
		return this._selectionCollection.focus;
	}

	getSelections() {
		return this._selectionCollection.selections;
	}

	getMostRecentlyExecutedCell(): ICellViewModel | undefined {
		const handle = this.notebookExecutionStateService.getLastCompletedCellForNotebook(this._notebook.uri);
		return handle !== undefined ? this.getCellByHandle(handle) : undefined;
	}

	setEditorFocus(focused: boolean) {
		this._focused = focused;
	}

	validateRange(cellRange: ICellRange | null | undefined): ICellRange | null {
		if (!cellRange) {
			return null;
		}

		const start = clamp(cellRange.start, 0, this.length);
		const end = clamp(cellRange.end, 0, this.length);

		if (start <= end) {
			return { start, end };
		} else {
			return { start: end, end: start };
		}
	}

	// selection change from list view's `setFocus` and `setSelection` should always use `source: view` to prevent events breaking the list view focus/selection change transaction
	updateSelectionsState(state: ISelectionState, source: 'view' | 'model' = 'model') {
		if (this._focused || source === 'model') {
			if (state.kind === SelectionStateType.Handle) {
				const primaryIndex = state.primary !== null ? this.getCellIndexByHandle(state.primary) : null;
				const primarySelection = primaryIndex !== null ? this.validateRange({ start: primaryIndex, end: primaryIndex + 1 }) : null;
				const selections = cellIndexesToRanges(state.selections.map(sel => this.getCellIndexByHandle(sel)))
					.map(range => this.validateRange(range))
					.filter(range => range !== null) as ICellRange[];
				this._selectionCollection.setState(primarySelection, reduceCellRanges(selections), true, source);
			} else {
				const primarySelection = this.validateRange(state.focus);
				const selections = state.selections
					.map(range => this.validateRange(range))
					.filter(range => range !== null) as ICellRange[];
				this._selectionCollection.setState(primarySelection, reduceCellRanges(selections), true, source);
			}
		}
	}

	getFoldingStartIndex(index: number): number {
		if (!this._foldingRanges) {
			return -1;
		}

		const range = this._foldingRanges.findRange(index + 1);
		const startIndex = this._foldingRanges.getStartLineNumber(range) - 1;
		return startIndex;
	}

	getFoldingState(index: number): CellFoldingState {
		if (!this._foldingRanges) {
			return CellFoldingState.None;
		}

		const range = this._foldingRanges.findRange(index + 1);
		const startIndex = this._foldingRanges.getStartLineNumber(range) - 1;

		if (startIndex !== index) {
			return CellFoldingState.None;
		}

		return this._foldingRanges.isCollapsed(range) ? CellFoldingState.Collapsed : CellFoldingState.Expanded;
	}

	getFoldedLength(index: number): number {
		if (!this._foldingRanges) {
			return 0;
		}

		const range = this._foldingRanges.findRange(index + 1);
		const startIndex = this._foldingRanges.getStartLineNumber(range) - 1;
		const endIndex = this._foldingRanges.getEndLineNumber(range) - 1;

		return endIndex - startIndex;
	}

	updateFoldingRanges(ranges: FoldingRegions) {
		this._foldingRanges = ranges;
		let updateHiddenAreas = false;
		const newHiddenAreas: ICellRange[] = [];

		let i = 0; // index into hidden
		let k = 0;

		let lastCollapsedStart = Number.MAX_VALUE;
		let lastCollapsedEnd = -1;

		for (; i < ranges.length; i++) {
			if (!ranges.isCollapsed(i)) {
				continue;
			}

			const startLineNumber = ranges.getStartLineNumber(i) + 1; // the first line is not hidden
			const endLineNumber = ranges.getEndLineNumber(i);
			if (lastCollapsedStart <= startLineNumber && endLineNumber <= lastCollapsedEnd) {
				// ignore ranges contained in collapsed regions
				continue;
			}

			if (!updateHiddenAreas && k < this._hiddenRanges.length && this._hiddenRanges[k].start + 1 === startLineNumber && (this._hiddenRanges[k].end + 1) === endLineNumber) {
				// reuse the old ranges
				newHiddenAreas.push(this._hiddenRanges[k]);
				k++;
			} else {
				updateHiddenAreas = true;
				newHiddenAreas.push({ start: startLineNumber - 1, end: endLineNumber - 1 });
			}
			lastCollapsedStart = startLineNumber;
			lastCollapsedEnd = endLineNumber;
		}

		if (updateHiddenAreas || k < this._hiddenRanges.length) {
			this._hiddenRanges = newHiddenAreas;
			this._onDidFoldingStateChanged.fire();
		}

		this._viewCells.forEach(cell => {
			if (cell.cellKind === CellKind.Markup) {
				cell.triggerFoldingStateChange();
			}
		});
	}

	getHiddenRanges() {
		return this._hiddenRanges;
	}

	getOverviewRulerDecorations(): INotebookDeltaViewZoneDecoration[] {
		return Array.from(this._overviewRulerDecorations.values());
	}

	getCellByHandle(handle: number) {
		return this._handleToViewCellMapping.get(handle);
	}

	getCellIndexByHandle(handle: number): number {
		return this._viewCells.findIndex(cell => cell.handle === handle);
	}

	getCellIndex(cell: ICellViewModel) {
		return this._viewCells.indexOf(cell as CellViewModel);
	}

	cellAt(index: number): CellViewModel | undefined {
		// if (index < 0 || index >= this.length) {
		// 	throw new Error(`Invalid index ${index}`);
		// }

		return this._viewCells[index];
	}

	getCellsInRange(range?: ICellRange): ReadonlyArray<ICellViewModel> {
		if (!range) {
			return this._viewCells.slice(0);
		}

		const validatedRange = this.validateRange(range);

		if (validatedRange) {
			const result: ICellViewModel[] = [];

			for (let i = validatedRange.start; i < validatedRange.end; i++) {
				result.push(this._viewCells[i]);
			}

			return result;
		}

		return [];
	}

	/**
	 * If this._viewCells[index] is visible then return index
	 */
	getNearestVisibleCellIndexUpwards(index: number) {
		for (let i = this._hiddenRanges.length - 1; i >= 0; i--) {
			const cellRange = this._hiddenRanges[i];
			const foldStart = cellRange.start - 1;
			const foldEnd = cellRange.end;

			if (foldStart > index) {
				continue;
			}

			if (foldStart <= index && foldEnd >= index) {
				return index;
			}

			// foldStart <= index, foldEnd < index
			break;
		}

		return index;
	}

	getNextVisibleCellIndex(index: number) {
		for (let i = 0; i < this._hiddenRanges.length; i++) {
			const cellRange = this._hiddenRanges[i];
			const foldStart = cellRange.start - 1;
			const foldEnd = cellRange.end;

			if (foldEnd < index) {
				continue;
			}

			// foldEnd >= index
			if (foldStart <= index) {
				return foldEnd + 1;
			}

			break;
		}

		return index + 1;
	}

	getPreviousVisibleCellIndex(index: number) {
		for (let i = this._hiddenRanges.length - 1; i >= 0; i--) {
			const cellRange = this._hiddenRanges[i];
			const foldStart = cellRange.start - 1;
			const foldEnd = cellRange.end;

			if (foldEnd < index) {
				return index;
			}

			if (foldStart <= index) {
				return foldStart;
			}
		}

		return index;
	}

	hasCell(cell: ICellViewModel) {
		return this._handleToViewCellMapping.has(cell.handle);
	}

	getVersionId() {
		return this._notebook.versionId;
	}

	getAlternativeId() {
		return this._notebook.alternativeVersionId;
	}

	getTrackedRange(id: string): ICellRange | null {
		return this._getDecorationRange(id);
	}

	private _getDecorationRange(decorationId: string): ICellRange | null {
		const node = this._decorations[decorationId];
		if (!node) {
			return null;
		}
		const versionId = this.getVersionId();
		if (node.cachedVersionId !== versionId) {
			this._decorationsTree.resolveNode(node, versionId);
		}
		if (node.range === null) {
			return { start: node.cachedAbsoluteStart - 1, end: node.cachedAbsoluteEnd - 1 };
		}

		return { start: node.range.startLineNumber - 1, end: node.range.endLineNumber - 1 };
	}

	setTrackedRange(id: string | null, newRange: ICellRange | null, newStickiness: TrackedRangeStickiness): string | null {
		const node = (id ? this._decorations[id] : null);

		if (!node) {
			if (!newRange) {
				return null;
			}

			return this._deltaCellDecorationsImpl(0, [], [{ range: new Range(newRange.start + 1, 1, newRange.end + 1, 1), options: TRACKED_RANGE_OPTIONS[newStickiness] }])[0];
		}

		if (!newRange) {
			// node exists, the request is to delete => delete node
			this._decorationsTree.delete(node);
			delete this._decorations[node.id];
			return null;
		}

		this._decorationsTree.delete(node);
		node.reset(this.getVersionId(), newRange.start, newRange.end + 1, new Range(newRange.start + 1, 1, newRange.end + 1, 1));
		node.setOptions(TRACKED_RANGE_OPTIONS[newStickiness]);
		this._decorationsTree.insert(node);
		return node.id;
	}

	private _deltaCellDecorationsImpl(ownerId: number, oldDecorationsIds: string[], newDecorations: IModelDeltaDecoration[]): string[] {
		const versionId = this.getVersionId();

		const oldDecorationsLen = oldDecorationsIds.length;
		let oldDecorationIndex = 0;

		const newDecorationsLen = newDecorations.length;
		let newDecorationIndex = 0;

		const result = new Array<string>(newDecorationsLen);
		while (oldDecorationIndex < oldDecorationsLen || newDecorationIndex < newDecorationsLen) {

			let node: IntervalNode | null = null;

			if (oldDecorationIndex < oldDecorationsLen) {
				// (1) get ourselves an old node
				do {
					node = this._decorations[oldDecorationsIds[oldDecorationIndex++]];
				} while (!node && oldDecorationIndex < oldDecorationsLen);

				// (2) remove the node from the tree (if it exists)
				if (node) {
					this._decorationsTree.delete(node);
				}
			}

			if (newDecorationIndex < newDecorationsLen) {
				// (3) create a new node if necessary
				if (!node) {
					const internalDecorationId = (++this._lastDecorationId);
					const decorationId = `${this._instanceId};${internalDecorationId}`;
					node = new IntervalNode(decorationId, 0, 0);
					this._decorations[decorationId] = node;
				}

				// (4) initialize node
				const newDecoration = newDecorations[newDecorationIndex];
				const range = newDecoration.range;
				const options = _normalizeOptions(newDecoration.options);

				node.ownerId = ownerId;
				node.reset(versionId, range.startLineNumber, range.endLineNumber, Range.lift(range));
				node.setOptions(options);

				this._decorationsTree.insert(node);

				result[newDecorationIndex] = node.id;

				newDecorationIndex++;
			} else {
				if (node) {
					delete this._decorations[node.id];
				}
			}
		}

		return result;
	}

	deltaCellDecorations(oldDecorations: string[], newDecorations: INotebookDeltaDecoration[]): string[] {
		oldDecorations.forEach(id => {
			const handle = this._decorationIdToCellMap.get(id);

			if (handle !== undefined) {
				const cell = this.getCellByHandle(handle);
				cell?.deltaCellDecorations([id], []);
				this._decorationIdToCellMap.delete(id);
			}

			this._overviewRulerDecorations.delete(id);
		});

		const result: string[] = [];

		newDecorations.forEach(decoration => {
			if (isNotebookCellDecoration(decoration)) {
				const cell = this.getCellByHandle(decoration.handle);
				const ret = cell?.deltaCellDecorations([], [decoration.options]) || [];
				ret.forEach(id => {
					this._decorationIdToCellMap.set(id, decoration.handle);
				});
				result.push(...ret);
			} else {
				const id = ++this._lastOverviewRulerDecorationId;
				const decorationId = `_overview_${this.id};${id}`;
				this._overviewRulerDecorations.set(decorationId, decoration);
				result.push(decorationId);
			}

		});

		return result;
	}

	deltaCellStatusBarItems(oldItems: string[], newItems: INotebookDeltaCellStatusBarItems[]): string[] {
		const deletesByHandle = groupBy(oldItems, id => this._statusBarItemIdToCellMap.get(id) ?? -1);

		const result: string[] = [];
		newItems.forEach(itemDelta => {
			const cell = this.getCellByHandle(itemDelta.handle);
			const deleted = deletesByHandle[itemDelta.handle] ?? [];
			delete deletesByHandle[itemDelta.handle];
			deleted.forEach(id => this._statusBarItemIdToCellMap.delete(id));

			const ret = cell?.deltaCellStatusBarItems(deleted, itemDelta.items) || [];
			ret.forEach(id => {
				this._statusBarItemIdToCellMap.set(id, itemDelta.handle);
			});

			result.push(...ret);
		});

		for (const _handle in deletesByHandle) {
			const handle = parseInt(_handle);
			const ids = deletesByHandle[handle]!;
			const cell = this.getCellByHandle(handle);
			cell?.deltaCellStatusBarItems(ids, []);
			ids.forEach(id => this._statusBarItemIdToCellMap.delete(id));
		}

		return result;
	}

	nearestCodeCellIndex(index: number /* exclusive */) {
		const nearest = this.viewCells.slice(0, index).reverse().findIndex(cell => cell.cellKind === CellKind.Code);
		if (nearest > -1) {
			return index - nearest - 1;
		} else {
			const nearestCellTheOtherDirection = this.viewCells.slice(index + 1).findIndex(cell => cell.cellKind === CellKind.Code);
			if (nearestCellTheOtherDirection > -1) {
				return index + 1 + nearestCellTheOtherDirection;
			}
			return -1;
		}
	}

	getEditorViewState(): INotebookEditorViewState {
		const editingCells: { [key: number]: boolean } = {};
		const collapsedInputCells: { [key: number]: boolean } = {};
		const collapsedOutputCells: { [key: number]: boolean } = {};
		const cellLineNumberStates: { [key: number]: 'on' | 'off' } = {};

		this._viewCells.forEach((cell, i) => {
			if (cell.getEditState() === CellEditState.Editing) {
				editingCells[i] = true;
			}

			if (cell.isInputCollapsed) {
				collapsedInputCells[i] = true;
			}

			if (cell instanceof CodeCellViewModel && cell.isOutputCollapsed) {
				collapsedOutputCells[i] = true;
			}

			if (cell.lineNumbers !== 'inherit') {
				cellLineNumberStates[i] = cell.lineNumbers;
			}
		});
		const editorViewStates: { [key: number]: editorCommon.ICodeEditorViewState } = {};
		this._viewCells.map(cell => ({ handle: cell.model.handle, state: cell.saveEditorViewState() })).forEach((viewState, i) => {
			if (viewState.state) {
				editorViewStates[i] = viewState.state;
			}
		});

		return {
			editingCells,
			editorViewStates,
			cellLineNumberStates,
			collapsedInputCells,
			collapsedOutputCells
		};
	}

	restoreEditorViewState(viewState: INotebookEditorViewState | undefined): void {
		if (!viewState) {
			return;
		}

		this._viewCells.forEach((cell, index) => {
			const isEditing = viewState.editingCells && viewState.editingCells[index];
			const editorViewState = viewState.editorViewStates && viewState.editorViewStates[index];

			cell.updateEditState(isEditing ? CellEditState.Editing : CellEditState.Preview, 'viewState');
			const cellHeight = viewState.cellTotalHeights ? viewState.cellTotalHeights[index] : undefined;
			cell.restoreEditorViewState(editorViewState, cellHeight);
			if (viewState.collapsedInputCells && viewState.collapsedInputCells[index]) {
				cell.isInputCollapsed = true;
			}
			if (viewState.collapsedOutputCells && viewState.collapsedOutputCells[index] && cell instanceof CodeCellViewModel) {
				cell.isOutputCollapsed = true;
			}
			if (viewState.cellLineNumberStates && viewState.cellLineNumberStates[index]) {
				cell.lineNumbers = viewState.cellLineNumberStates[index];
			}
		});
	}

	/**
	 * Editor decorations across cells. For example, find decorations for multiple code cells
	 * The reason that we can't completely delegate this to CodeEditorWidget is most of the time, the editors for cells are not created yet but we already have decorations for them.
	 */
	changeModelDecorations<T>(callback: (changeAccessor: IModelDecorationsChangeAccessor) => T): T | null {
		const changeAccessor: IModelDecorationsChangeAccessor = {
			deltaDecorations: (oldDecorations: ICellModelDecorations[], newDecorations: ICellModelDeltaDecorations[]): ICellModelDecorations[] => {
				return this._deltaModelDecorationsImpl(oldDecorations, newDecorations);
			}
		};

		let result: T | null = null;
		try {
			result = callback(changeAccessor);
		} catch (e) {
			onUnexpectedError(e);
		}

		changeAccessor.deltaDecorations = invalidFunc;

		return result;
	}

	private _deltaModelDecorationsImpl(oldDecorations: ICellModelDecorations[], newDecorations: ICellModelDeltaDecorations[]): ICellModelDecorations[] {

		const mapping = new Map<number, { cell: CellViewModel; oldDecorations: readonly string[]; newDecorations: readonly IModelDeltaDecoration[] }>();
		oldDecorations.forEach(oldDecoration => {
			const ownerId = oldDecoration.ownerId;

			if (!mapping.has(ownerId)) {
				const cell = this._viewCells.find(cell => cell.handle === ownerId);
				if (cell) {
					mapping.set(ownerId, { cell: cell, oldDecorations: [], newDecorations: [] });
				}
			}

			const data = mapping.get(ownerId)!;
			if (data) {
				data.oldDecorations = oldDecoration.decorations;
			}
		});

		newDecorations.forEach(newDecoration => {
			const ownerId = newDecoration.ownerId;

			if (!mapping.has(ownerId)) {
				const cell = this._viewCells.find(cell => cell.handle === ownerId);

				if (cell) {
					mapping.set(ownerId, { cell: cell, oldDecorations: [], newDecorations: [] });
				}
			}

			const data = mapping.get(ownerId)!;
			if (data) {
				data.newDecorations = newDecoration.decorations;
			}
		});

		const ret: ICellModelDecorations[] = [];
		mapping.forEach((value, ownerId) => {
			const cellRet = value.cell.deltaModelDecorations(value.oldDecorations, value.newDecorations);
			ret.push({
				ownerId: ownerId,
				decorations: cellRet
			});
		});

		return ret;
	}

	//#region Find
	find(value: string, options: INotebookFindOptions): CellFindMatchWithIndex[] {
		const matches: CellFindMatchWithIndex[] = [];
		let findCells: CellViewModel[] = [];

		if (options.findScope && (options.findScope.findScopeType === NotebookFindScopeType.Cells || options.findScope.findScopeType === NotebookFindScopeType.Text)) {
			const selectedRanges = options.findScope.selectedCellRanges?.map(range => this.validateRange(range)).filter(range => !!range) ?? [];
			const selectedIndexes = cellRangesToIndexes(selectedRanges);
			findCells = selectedIndexes.map(index => this._viewCells[index]);
		} else {
			findCells = this._viewCells;
		}

		findCells.forEach((cell, index) => {
			const cellMatches = cell.startFind(value, options);
			if (cellMatches) {
				matches.push(new CellFindMatchModel(
					cellMatches.cell,
					index,
					cellMatches.contentMatches,
					[]
				));
			}
		});

		// filter based on options and editing state

		return matches.filter(match => {
			if (match.cell.cellKind === CellKind.Code) {
				// code cell, we only include its match if include input is enabled
				return options.includeCodeInput;
			}

			// markup cell, it depends on the editing state
			if (match.cell.getEditState() === CellEditState.Editing) {
				// editing, even if we includeMarkupPreview
				return options.includeMarkupInput;
			} else {
				// cell in preview mode, we should only include it if includeMarkupPreview is false but includeMarkupInput is true
				// if includeMarkupPreview is true, then we should include the webview match result other than this
				return !options.includeMarkupPreview && options.includeMarkupInput;
			}
		}
		);
	}

	replaceOne(cell: ICellViewModel, range: Range, text: string): Promise<void> {
		const viewCell = cell as CellViewModel;
		this._lastNotebookEditResource.push(viewCell.uri);
		return viewCell.resolveTextModel().then(() => {
			this._bulkEditService.apply(
				[new ResourceTextEdit(cell.uri, { range, text })],
				{ quotableLabel: 'Notebook Replace' }
			);
		});
	}

	async replaceAll(matches: CellFindMatchWithIndex[], texts: string[]): Promise<void> {
		if (!matches.length) {
			return;
		}

		const textEdits: IWorkspaceTextEdit[] = [];
		this._lastNotebookEditResource.push(matches[0].cell.uri);

		matches.forEach(match => {
			match.contentMatches.forEach((singleMatch, index) => {
				textEdits.push({
					versionId: undefined,
					textEdit: { range: (singleMatch as FindMatch).range, text: texts[index] },
					resource: match.cell.uri
				});
			});
		});

		return Promise.all(matches.map(match => {
			return match.cell.resolveTextModel();
		})).then(async () => {
			this._bulkEditService.apply({ edits: textEdits }, { quotableLabel: 'Notebook Replace All' });
			return;
		});
	}

	//#endregion

	//#region Undo/Redo

	private async _withElement(element: SingleModelEditStackElement | MultiModelEditStackElement, callback: () => Promise<void>) {
		const viewCells = this._viewCells.filter(cell => element.matchesResource(cell.uri));
		const refs = await Promise.all(viewCells.map(cell => this._textModelService.createModelReference(cell.uri)));
		await callback();
		refs.forEach(ref => ref.dispose());
	}

	async undo() {

		const editStack = this._undoService.getElements(this.uri);
		const element = editStack.past.length ? editStack.past[editStack.past.length - 1] : undefined;

		if (element && element instanceof SingleModelEditStackElement || element instanceof MultiModelEditStackElement) {
			await this._withElement(element, async () => {
				await this._undoService.undo(this.uri);
			});

			return (element instanceof SingleModelEditStackElement) ? [element.resource] : element.resources;
		}

		await this._undoService.undo(this.uri);
		return [];
	}

	async redo() {

		const editStack = this._undoService.getElements(this.uri);
		const element = editStack.future[0];

		if (element && element instanceof SingleModelEditStackElement || element instanceof MultiModelEditStackElement) {
			await this._withElement(element, async () => {
				await this._undoService.redo(this.uri);
			});

			return (element instanceof SingleModelEditStackElement) ? [element.resource] : element.resources;
		}

		await this._undoService.redo(this.uri);

		return [];
	}

	//#endregion

	equal(notebook: NotebookTextModel) {
		return this._notebook === notebook;
	}

	override dispose() {
		this._localStore.clear();
		this._viewCells.forEach(cell => {
			cell.dispose();
		});

		super.dispose();
	}
}

export type CellViewModel = (CodeCellViewModel | MarkupCellViewModel) & ICellViewModel;

export function createCellViewModel(instantiationService: IInstantiationService, notebookViewModel: NotebookViewModel, cell: NotebookCellTextModel, viewContext: ViewContext) {
	if (cell.cellKind === CellKind.Code) {
		return instantiationService.createInstance(CodeCellViewModel, notebookViewModel.viewType, cell, notebookViewModel.layoutInfo, viewContext);
	} else {
		return instantiationService.createInstance(MarkupCellViewModel, notebookViewModel.viewType, cell, notebookViewModel.layoutInfo, notebookViewModel, viewContext);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewModel/OutlineEntry.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewModel/OutlineEntry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Codicon } from '../../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { IMarkerService, MarkerSeverity } from '../../../../../platform/markers/common/markers.js';
import { ICellViewModel } from '../notebookBrowser.js';
import { executingStateIcon } from '../notebookIcons.js';
import { CellKind } from '../../common/notebookCommon.js';
import { IRange } from '../../../../../editor/common/core/range.js';
import { SymbolKind, SymbolKinds } from '../../../../../editor/common/languages.js';

export interface IOutlineMarkerInfo {
	readonly count: number;
	readonly topSev: MarkerSeverity;
}

export class OutlineEntry {
	private _children: OutlineEntry[] = [];
	private _parent: OutlineEntry | undefined;
	private _markerInfo: IOutlineMarkerInfo | undefined;

	get icon(): ThemeIcon {
		if (this.symbolKind) {
			return SymbolKinds.toIcon(this.symbolKind);
		}
		return this.isExecuting && this.isPaused ? executingStateIcon :
			this.isExecuting ? ThemeIcon.modify(executingStateIcon, 'spin') :
				this.cell.cellKind === CellKind.Markup ? Codicon.markdown : Codicon.code;
	}

	constructor(
		readonly index: number,
		readonly level: number,
		readonly cell: ICellViewModel,
		readonly label: string,
		readonly isExecuting: boolean,
		readonly isPaused: boolean,
		readonly range?: IRange,
		readonly symbolKind?: SymbolKind,
	) { }

	addChild(entry: OutlineEntry) {
		this._children.push(entry);
		entry._parent = this;
	}

	get parent(): OutlineEntry | undefined {
		return this._parent;
	}

	get children(): Iterable<OutlineEntry> {
		return this._children;
	}

	get markerInfo(): IOutlineMarkerInfo | undefined {
		return this._markerInfo;
	}

	get position() {
		if (this.range) {
			return { startLineNumber: this.range.startLineNumber, startColumn: this.range.startColumn };
		}
		return undefined;
	}

	updateMarkers(markerService: IMarkerService): void {
		if (this.cell.cellKind === CellKind.Code) {
			// a code cell can have marker
			const marker = markerService.read({ resource: this.cell.uri, severities: MarkerSeverity.Error | MarkerSeverity.Warning });
			if (marker.length === 0) {
				this._markerInfo = undefined;
			} else {
				const topSev = marker.find(a => a.severity === MarkerSeverity.Error)?.severity ?? MarkerSeverity.Warning;
				this._markerInfo = { topSev, count: marker.length };
			}
		} else {
			// a markdown cell can inherit markers from its children
			let topChild: MarkerSeverity | undefined;
			for (const child of this.children) {
				child.updateMarkers(markerService);
				if (child.markerInfo) {
					topChild = !topChild ? child.markerInfo.topSev : Math.max(child.markerInfo.topSev, topChild);
				}
			}
			this._markerInfo = topChild && { topSev: topChild, count: 0 };
		}
	}

	clearMarkers(): void {
		this._markerInfo = undefined;
		for (const child of this.children) {
			child.clearMarkers();
		}
	}

	find(cell: ICellViewModel, parents: OutlineEntry[]): OutlineEntry | undefined {
		if (cell.id === this.cell.id) {
			return this;
		}
		parents.push(this);
		for (const child of this.children) {
			const result = child.find(cell, parents);
			if (result) {
				return result;
			}
		}
		parents.pop();
		return undefined;
	}

	asFlatList(bucket: OutlineEntry[]): void {
		bucket.push(this);
		for (const child of this.children) {
			child.asFlatList(bucket);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewModel/viewContext.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewModel/viewContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IBaseCellEditorOptions } from '../notebookBrowser.js';
import { NotebookEventDispatcher } from './eventDispatcher.js';
import { NotebookOptions } from '../notebookOptions.js';

export class ViewContext {
	constructor(
		readonly notebookOptions: NotebookOptions,
		readonly eventDispatcher: NotebookEventDispatcher,
		readonly getBaseCellEditorOptions: (language: string) => IBaseCellEditorOptions
	) {
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewParts/notebookCellOverlays.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewParts/notebookCellOverlays.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createFastDomNode, FastDomNode } from '../../../../../base/browser/fastDomNode.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { INotebookCellOverlay, INotebookCellOverlayChangeAccessor, INotebookViewCellsUpdateEvent } from '../notebookBrowser.js';
import { NotebookCellListView } from '../view/notebookCellListView.js';
import { CellViewModel } from '../viewModel/notebookViewModelImpl.js';

interface INotebookCellOverlayWidget {
	overlayId: string;
	overlay: INotebookCellOverlay;
	domNode: FastDomNode<HTMLElement>;
}

export class NotebookCellOverlays extends Disposable {
	private _lastOverlayId = 0;
	public domNode: FastDomNode<HTMLElement>;
	private _overlays: { [key: string]: INotebookCellOverlayWidget } = Object.create(null);

	constructor(
		private readonly listView: NotebookCellListView<CellViewModel>
	) {
		super();
		this.domNode = createFastDomNode(document.createElement('div'));
		this.domNode.setClassName('cell-overlays');
		this.domNode.setPosition('absolute');
		this.domNode.setAttribute('role', 'presentation');
		this.domNode.setAttribute('aria-hidden', 'true');
		this.domNode.setWidth('100%');

		this.listView.containerDomNode.appendChild(this.domNode.domNode);
	}

	changeCellOverlays(callback: (changeAccessor: INotebookCellOverlayChangeAccessor) => void): boolean {
		let overlaysHaveChanged = false;
		const changeAccessor: INotebookCellOverlayChangeAccessor = {
			addOverlay: (overlay: INotebookCellOverlay): string => {
				overlaysHaveChanged = true;
				return this._addOverlay(overlay);
			},
			removeOverlay: (id: string): void => {
				overlaysHaveChanged = true;
				this._removeOverlay(id);
			},
			layoutOverlay: (id: string): void => {
				overlaysHaveChanged = true;
				this._layoutOverlay(id);
			}
		};

		callback(changeAccessor);

		return overlaysHaveChanged;
	}

	onCellsChanged(e: INotebookViewCellsUpdateEvent): void {
		this.layout();
	}

	onHiddenRangesChange() {
		this.layout();
	}

	layout() {
		for (const id in this._overlays) {
			this._layoutOverlay(id);
		}
	}

	private _addOverlay(overlay: INotebookCellOverlay): string {
		const overlayId = `${++this._lastOverlayId}`;

		const overlayWidget = {
			overlayId,
			overlay,
			domNode: createFastDomNode(overlay.domNode)
		};

		this._overlays[overlayId] = overlayWidget;
		overlayWidget.domNode.setClassName('cell-overlay');
		overlayWidget.domNode.setPosition('absolute');
		this.domNode.appendChild(overlayWidget.domNode);

		return overlayId;
	}

	private _removeOverlay(id: string): void {
		const overlay = this._overlays[id];
		if (overlay) {
			// overlay.overlay.dispose();
			try {
				this.domNode.removeChild(overlay.domNode);
			} catch {
				// no op
			}

			delete this._overlays[id];
		}
	}

	private _layoutOverlay(id: string): void {
		const overlay = this._overlays[id];
		if (!overlay) {
			return;
		}

		const isInHiddenRanges = this._isInHiddenRanges(overlay);
		if (isInHiddenRanges) {
			overlay.domNode.setDisplay('none');
			return;
		}

		overlay.domNode.setDisplay('block');
		const index = this.listView.indexOf(overlay.overlay.cell as CellViewModel);
		if (index === -1) {
			// should not happen
			return;
		}

		const top = this.listView.elementTop(index);
		overlay.domNode.setTop(top);
	}

	private _isInHiddenRanges(zone: INotebookCellOverlayWidget) {
		const index = this.listView.indexOf(zone.overlay.cell as CellViewModel);
		if (index === -1) {
			return true;
		}

		return false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewParts/notebookEditorStickyScroll.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewParts/notebookEditorStickyScroll.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../base/browser/dom.js';
import { EventType as TouchEventType } from '../../../../../base/browser/touch.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { IMouseWheelEvent, StandardMouseEvent } from '../../../../../base/browser/mouseEvent.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore, type IReference } from '../../../../../base/common/lifecycle.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { CellFoldingState, INotebookEditor } from '../notebookBrowser.js';
import { INotebookCellList } from '../view/notebookRenderingCommon.js';
import { OutlineEntry } from '../viewModel/OutlineEntry.js';
import { NotebookCellOutlineDataSource } from '../viewModel/notebookOutlineDataSource.js';
import { CellKind } from '../../common/notebookCommon.js';
import { Delayer } from '../../../../../base/common/async.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { foldingCollapsedIcon, foldingExpandedIcon } from '../../../../../editor/contrib/folding/browser/foldingDecorations.js';
import { MarkupCellViewModel } from '../viewModel/markupCellViewModel.js';
import { FoldingController } from '../controller/foldingController.js';
import { NotebookOptionsChangeEvent } from '../notebookOptions.js';
import { NotebookOutlineEntryArgs } from '../controller/sectionActions.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { INotebookCellOutlineDataSourceFactory } from '../viewModel/notebookOutlineDataSourceFactory.js';

export class NotebookStickyLine extends Disposable {
	constructor(
		public readonly element: HTMLElement,
		public readonly foldingIcon: StickyFoldingIcon,
		public readonly header: HTMLElement,
		public readonly entry: OutlineEntry,
		public readonly notebookEditor: INotebookEditor,
	) {
		super();
		// click the header to focus the cell
		this._register(DOM.addDisposableListener(this.header, DOM.EventType.CLICK || TouchEventType.Tap, () => {
			this.focusCell();
		}));

		// click the folding icon to fold the range covered by the header
		this._register(DOM.addDisposableListener(this.foldingIcon.domNode, DOM.EventType.CLICK || TouchEventType.Tap, () => {
			if (this.entry.cell.cellKind === CellKind.Markup) {
				const currentFoldingState = (this.entry.cell as MarkupCellViewModel).foldingState;
				this.toggleFoldRange(currentFoldingState);
			}
		}));
	}

	private toggleFoldRange(currentState: CellFoldingState) {
		const foldingController = this.notebookEditor.getContribution<FoldingController>(FoldingController.id);

		const index = this.entry.index;
		const headerLevel = this.entry.level;
		const newFoldingState = (currentState === CellFoldingState.Collapsed) ? CellFoldingState.Expanded : CellFoldingState.Collapsed;

		foldingController.setFoldingStateDown(index, newFoldingState, headerLevel);
		this.focusCell();
	}

	private focusCell() {
		this.notebookEditor.focusNotebookCell(this.entry.cell, 'container');
		const cellScrollTop = this.notebookEditor.getAbsoluteTopOfElement(this.entry.cell);
		const parentCount = NotebookStickyLine.getParentCount(this.entry);
		// 1.1 addresses visible cell padding, to make sure we don't focus md cell and also render its sticky line
		this.notebookEditor.setScrollTop(cellScrollTop - (parentCount + 1.1) * 22);
	}

	static getParentCount(entry: OutlineEntry) {
		let count = 0;
		while (entry.parent) {
			count++;
			entry = entry.parent;
		}
		return count;
	}
}

class StickyFoldingIcon {

	public domNode: HTMLElement;

	constructor(
		public isCollapsed: boolean,
		public dimension: number
	) {
		this.domNode = document.createElement('div');
		this.domNode.style.width = `${dimension}px`;
		this.domNode.style.height = `${dimension}px`;
		this.domNode.className = ThemeIcon.asClassName(isCollapsed ? foldingCollapsedIcon : foldingExpandedIcon);
	}

	public setVisible(visible: boolean) {
		this.domNode.style.cursor = visible ? 'pointer' : 'default';
		this.domNode.style.opacity = visible ? '1' : '0';
	}
}

export class NotebookStickyScroll extends Disposable {
	private readonly _disposables = new DisposableStore();
	private currentStickyLines = new Map<OutlineEntry, { line: NotebookStickyLine; rendered: boolean }>();

	private readonly _onDidChangeNotebookStickyScroll = this._register(new Emitter<number>());
	readonly onDidChangeNotebookStickyScroll: Event<number> = this._onDidChangeNotebookStickyScroll.event;
	private notebookCellOutlineReference?: IReference<NotebookCellOutlineDataSource>;

	private readonly _layoutDisposableStore = this._register(new DisposableStore());

	getDomNode(): HTMLElement {
		return this.domNode;
	}

	getCurrentStickyHeight() {
		let height = 0;
		this.currentStickyLines.forEach((value) => {
			if (value.rendered) {
				height += 22;
			}
		});
		return height;
	}

	private setCurrentStickyLines(newStickyLines: Map<OutlineEntry, { line: NotebookStickyLine; rendered: boolean }>) {
		this.currentStickyLines = newStickyLines;
	}

	private compareStickyLineMaps(mapA: Map<OutlineEntry, { line: NotebookStickyLine; rendered: boolean }>, mapB: Map<OutlineEntry, { line: NotebookStickyLine; rendered: boolean }>): boolean {
		if (mapA.size !== mapB.size) {
			return false;
		}

		for (const [key, value] of mapA) {
			const otherValue = mapB.get(key);
			if (!otherValue || value.rendered !== otherValue.rendered) {
				return false;
			}
		}

		return true;
	}

	constructor(
		private readonly domNode: HTMLElement,
		private readonly notebookEditor: INotebookEditor,
		private readonly notebookCellList: INotebookCellList,
		private readonly layoutFn: (delta: number) => void,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();

		if (this.notebookEditor.notebookOptions.getDisplayOptions().stickyScrollEnabled) {
			this.init().catch(console.error);
		}

		this._register(this.notebookEditor.notebookOptions.onDidChangeOptions((e) => {
			if (e.stickyScrollEnabled || e.stickyScrollMode) {
				this.updateConfig(e);
			}
		}));

		this._register(DOM.addDisposableListener(this.domNode, DOM.EventType.CONTEXT_MENU, async (event: MouseEvent) => {
			this.onContextMenu(event);
		}));

		// Forward wheel events to the notebook editor to enable scrolling when hovering over sticky scroll
		this._register(DOM.addDisposableListener(this.domNode, DOM.EventType.WHEEL, (event: WheelEvent) => {
			this.notebookCellList.triggerScrollFromMouseWheelEvent(event as unknown as IMouseWheelEvent);
		}));
	}

	private onContextMenu(e: MouseEvent) {
		const event = new StandardMouseEvent(DOM.getWindow(this.domNode), e);

		const selectedElement = event.target.parentElement;
		const selectedOutlineEntry = Array.from(this.currentStickyLines.values()).find(entry => entry.line.element.contains(selectedElement))?.line.entry;
		if (!selectedOutlineEntry) {
			return;
		}

		const args: NotebookOutlineEntryArgs = {
			outlineEntry: selectedOutlineEntry,
			notebookEditor: this.notebookEditor,
		};

		this._contextMenuService.showContextMenu({
			menuId: MenuId.NotebookStickyScrollContext,
			getAnchor: () => event,
			menuActionOptions: { shouldForwardArgs: true, arg: args },
		});
	}

	private updateConfig(e: NotebookOptionsChangeEvent) {
		if (e.stickyScrollEnabled) {
			if (this.notebookEditor.notebookOptions.getDisplayOptions().stickyScrollEnabled) {
				this.init().catch(console.error);
			} else {
				this._disposables.clear();
				this.notebookCellOutlineReference?.dispose();
				this.disposeCurrentStickyLines();
				DOM.clearNode(this.domNode);
				this.updateDisplay();
			}
		} else if (e.stickyScrollMode && this.notebookEditor.notebookOptions.getDisplayOptions().stickyScrollEnabled && this.notebookCellOutlineReference?.object) {
			this.updateContent(computeContent(this.notebookEditor, this.notebookCellList, this.notebookCellOutlineReference?.object?.entries, this.getCurrentStickyHeight()));
		}
	}

	private async init() {
		const { object: notebookCellOutline } = this.notebookCellOutlineReference = this.instantiationService.invokeFunction((accessor) => accessor.get(INotebookCellOutlineDataSourceFactory).getOrCreate(this.notebookEditor));
		this._register(this.notebookCellOutlineReference);

		// Ensure symbols are computed first
		await notebookCellOutline.computeFullSymbols(CancellationToken.None);

		// Initial content update
		const computed = computeContent(this.notebookEditor, this.notebookCellList, notebookCellOutline.entries, this.getCurrentStickyHeight());
		this.updateContent(computed);

		// Set up outline change listener
		this._disposables.add(notebookCellOutline.onDidChange(() => {
			const computed = computeContent(this.notebookEditor, this.notebookCellList, notebookCellOutline.entries, this.getCurrentStickyHeight());
			if (!this.compareStickyLineMaps(computed, this.currentStickyLines)) {
				this.updateContent(computed);
			} else {
				// if we don't end up updating the content, we need to avoid leaking the map
				this.disposeStickyLineMap(computed);
			}
		}));

		// Handle view model changes
		this._disposables.add(this.notebookEditor.onDidAttachViewModel(async () => {
			// ensure recompute symbols when view model changes -- could be missed if outline is closed
			await notebookCellOutline.computeFullSymbols(CancellationToken.None);

			const computed = computeContent(this.notebookEditor, this.notebookCellList, notebookCellOutline.entries, this.getCurrentStickyHeight());
			this.updateContent(computed);
		}));

		this._disposables.add(this.notebookEditor.onDidScroll(() => {
			const d = new Delayer(100);
			d.trigger(() => {
				d.dispose();

				const computed = computeContent(this.notebookEditor, this.notebookCellList, notebookCellOutline.entries, this.getCurrentStickyHeight());
				if (!this.compareStickyLineMaps(computed, this.currentStickyLines)) {
					this.updateContent(computed);
				} else {
					// if we don't end up updating the content, we need to avoid leaking the map
					this.disposeStickyLineMap(computed);
				}
			});
		}));
	}

	// Add helper method to dispose a map of sticky lines
	private disposeStickyLineMap(map: Map<OutlineEntry, { line: NotebookStickyLine; rendered: boolean }>) {
		map.forEach(value => {
			if (value.line) {
				value.line.dispose();
			}
		});
	}

	// take in an cell index, and get the corresponding outline entry
	static getVisibleOutlineEntry(visibleIndex: number, notebookOutlineEntries: OutlineEntry[]): OutlineEntry | undefined {
		let left = 0;
		let right = notebookOutlineEntries.length - 1;

		while (left <= right) {
			const mid = Math.floor((left + right) / 2);
			if (notebookOutlineEntries[mid].index === visibleIndex) {
				// Exact match found
				const rootEntry = notebookOutlineEntries[mid];
				const flatList: OutlineEntry[] = [];
				rootEntry.asFlatList(flatList);
				return flatList.find(entry => entry.index === visibleIndex);
			} else if (notebookOutlineEntries[mid].index < visibleIndex) {
				left = mid + 1;
			} else {
				right = mid - 1;
			}
		}

		// No exact match found - get the closest smaller entry
		if (right >= 0) {
			const rootEntry = notebookOutlineEntries[right];
			const flatList: OutlineEntry[] = [];
			rootEntry.asFlatList(flatList);
			return flatList.find(entry => entry.index === visibleIndex);
		}

		return undefined;
	}

	private updateContent(newMap: Map<OutlineEntry, { line: NotebookStickyLine; rendered: boolean }>) {
		DOM.clearNode(this.domNode);
		this.disposeCurrentStickyLines();
		this.renderStickyLines(newMap, this.domNode);

		const oldStickyHeight = this.getCurrentStickyHeight();
		this.setCurrentStickyLines(newMap);

		// (+) = sticky height increased
		// (-) = sticky height decreased
		const sizeDelta = this.getCurrentStickyHeight() - oldStickyHeight;
		if (sizeDelta !== 0) {
			this._onDidChangeNotebookStickyScroll.fire(sizeDelta);

			const d = this._layoutDisposableStore.add(DOM.scheduleAtNextAnimationFrame(DOM.getWindow(this.getDomNode()), () => {
				this.layoutFn(sizeDelta);
				this.updateDisplay();

				this._layoutDisposableStore.delete(d);
			}));
		} else {
			this.updateDisplay();
		}
	}

	private updateDisplay() {
		const hasSticky = this.getCurrentStickyHeight() > 0;
		if (!hasSticky) {
			this.domNode.style.display = 'none';
		} else {
			this.domNode.style.display = 'block';
		}
	}

	static computeStickyHeight(entry: OutlineEntry) {
		let height = 0;
		if (entry.cell.cellKind === CellKind.Markup && entry.level < 7) {
			height += 22;
		}
		while (entry.parent) {
			height += 22;
			entry = entry.parent;
		}
		return height;
	}

	static checkCollapsedStickyLines(entry: OutlineEntry | undefined, numLinesToRender: number, notebookEditor: INotebookEditor) {
		let currentEntry = entry;
		const newMap = new Map<OutlineEntry, { line: NotebookStickyLine; rendered: boolean }>();

		const elementsToRender = [];
		while (currentEntry) {
			if (currentEntry.level >= 7) {
				// level 7+ represents a non-header entry, which we don't want to render
				currentEntry = currentEntry.parent;
				continue;
			}
			const lineToRender = NotebookStickyScroll.createStickyElement(currentEntry, notebookEditor);
			newMap.set(currentEntry, { line: lineToRender, rendered: false });
			elementsToRender.unshift(lineToRender);
			currentEntry = currentEntry.parent;
		}

		// iterate over elements to render, and append to container
		// break when we reach numLinesToRender
		for (let i = 0; i < elementsToRender.length; i++) {
			if (i >= numLinesToRender) {
				break;
			}
			newMap.set(elementsToRender[i].entry, { line: elementsToRender[i], rendered: true });
		}
		return newMap;
	}

	private renderStickyLines(stickyMap: Map<OutlineEntry, { line: NotebookStickyLine; rendered: boolean }>, containerElement: HTMLElement) {
		const reversedEntries = Array.from(stickyMap.entries()).reverse();
		for (const [, value] of reversedEntries) {
			if (!value.rendered) {
				continue;
			}
			containerElement.append(value.line.element);
		}
	}

	static createStickyElement(entry: OutlineEntry, notebookEditor: INotebookEditor) {
		const stickyElement = document.createElement('div');
		stickyElement.classList.add('notebook-sticky-scroll-element');

		const indentMode = notebookEditor.notebookOptions.getLayoutConfiguration().stickyScrollMode;
		if (indentMode === 'indented') {
			stickyElement.style.paddingLeft = NotebookStickyLine.getParentCount(entry) * 10 + 'px';
		}

		let isCollapsed = false;
		if (entry.cell.cellKind === CellKind.Markup) {
			isCollapsed = (entry.cell as MarkupCellViewModel).foldingState === CellFoldingState.Collapsed;
		}

		const stickyFoldingIcon = new StickyFoldingIcon(isCollapsed, 16);
		stickyFoldingIcon.domNode.classList.add('notebook-sticky-scroll-folding-icon');
		stickyFoldingIcon.setVisible(true);

		const stickyHeader = document.createElement('div');
		stickyHeader.classList.add('notebook-sticky-scroll-header');
		stickyHeader.innerText = entry.label;

		stickyElement.append(stickyFoldingIcon.domNode, stickyHeader);

		return new NotebookStickyLine(stickyElement, stickyFoldingIcon, stickyHeader, entry, notebookEditor);
	}

	private disposeCurrentStickyLines() {
		this.currentStickyLines.forEach((value) => {
			value.line.dispose();
		});
	}

	override dispose() {
		this._disposables.dispose();
		this.disposeCurrentStickyLines();
		this.notebookCellOutlineReference?.dispose();
		super.dispose();
	}
}

export function computeContent(notebookEditor: INotebookEditor, notebookCellList: INotebookCellList, notebookOutlineEntries: OutlineEntry[], renderedStickyHeight: number): Map<OutlineEntry, { line: NotebookStickyLine; rendered: boolean }> {
	// get data about the cell list within viewport ----------------------------------------------------------------------------------------
	const editorScrollTop = notebookEditor.scrollTop - renderedStickyHeight;
	const visibleRange = notebookEditor.visibleRanges[0];
	if (!visibleRange) {
		return new Map();
	}

	// edge case for cell 0 in the notebook is a header ------------------------------------------------------------------------------------
	if (visibleRange.start === 0) {
		const firstCell = notebookEditor.cellAt(0);
		const firstCellEntry = NotebookStickyScroll.getVisibleOutlineEntry(0, notebookOutlineEntries);
		if (firstCell && firstCellEntry && firstCell.cellKind === CellKind.Markup && firstCellEntry.level < 7) {
			if (notebookEditor.scrollTop > 22) {
				const newMap = NotebookStickyScroll.checkCollapsedStickyLines(firstCellEntry, 100, notebookEditor);
				return newMap;
			}
		}
	}

	// iterate over cells in viewport ------------------------------------------------------------------------------------------------------
	let cell;
	let cellEntry;
	const startIndex = visibleRange.start - 1; // -1 to account for cells hidden "under" sticky lines.
	for (let currentIndex = startIndex; currentIndex < visibleRange.end; currentIndex++) {
		// store data for current cell, and next cell
		cell = notebookEditor.cellAt(currentIndex);
		if (!cell) {
			return new Map();
		}
		cellEntry = NotebookStickyScroll.getVisibleOutlineEntry(currentIndex, notebookOutlineEntries);
		if (!cellEntry) {
			continue;
		}

		const nextCell = notebookEditor.cellAt(currentIndex + 1);
		if (!nextCell) {
			const sectionBottom = notebookEditor.getLayoutInfo().scrollHeight;
			const linesToRender = Math.floor((sectionBottom) / 22);
			const newMap = NotebookStickyScroll.checkCollapsedStickyLines(cellEntry, linesToRender, notebookEditor);
			return newMap;
		}
		const nextCellEntry = NotebookStickyScroll.getVisibleOutlineEntry(currentIndex + 1, notebookOutlineEntries);
		if (!nextCellEntry) {
			continue;
		}

		// check next cell, if markdown with non level 7 entry, that means this is the end of the section (new header) ---------------------
		if (nextCell.cellKind === CellKind.Markup && nextCellEntry.level < 7) {
			const sectionBottom = notebookCellList.getCellViewScrollTop(nextCell);
			const currentSectionStickyHeight = NotebookStickyScroll.computeStickyHeight(cellEntry);
			const nextSectionStickyHeight = NotebookStickyScroll.computeStickyHeight(nextCellEntry);

			// case: we can render the all sticky lines for the current section ------------------------------------------------------------
			if (editorScrollTop + currentSectionStickyHeight < sectionBottom) {
				const linesToRender = Math.floor((sectionBottom - editorScrollTop) / 22);
				const newMap = NotebookStickyScroll.checkCollapsedStickyLines(cellEntry, linesToRender, notebookEditor);
				return newMap;
			}

			// case: next section is the same size or bigger, render next entry -----------------------------------------------------------
			else if (nextSectionStickyHeight >= currentSectionStickyHeight) {
				const newMap = NotebookStickyScroll.checkCollapsedStickyLines(nextCellEntry, 100, notebookEditor);
				return newMap;
			}
			// case: next section is the smaller, shrink until next section height is greater than the available space ---------------------
			else if (nextSectionStickyHeight < currentSectionStickyHeight) {
				const availableSpace = sectionBottom - editorScrollTop;

				if (availableSpace >= nextSectionStickyHeight) {
					const linesToRender = Math.floor((availableSpace) / 22);
					const newMap = NotebookStickyScroll.checkCollapsedStickyLines(cellEntry, linesToRender, notebookEditor);
					return newMap;
				} else {
					const newMap = NotebookStickyScroll.checkCollapsedStickyLines(nextCellEntry, 100, notebookEditor);
					return newMap;
				}
			}
		}
	} // visible range loop close

	// case: all visible cells were non-header cells, so render any headers relevant to their section --------------------------------------
	const sectionBottom = notebookEditor.getLayoutInfo().scrollHeight;
	const linesToRender = Math.floor((sectionBottom - editorScrollTop) / 22);
	const newMap = NotebookStickyScroll.checkCollapsedStickyLines(cellEntry, linesToRender, notebookEditor);
	return newMap;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewParts/notebookEditorToolbar.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewParts/notebookEditorToolbar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../base/browser/dom.js';
import { StandardMouseEvent } from '../../../../../base/browser/mouseEvent.js';
import { DomScrollableElement } from '../../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { ToolBar } from '../../../../../base/browser/ui/toolbar/toolbar.js';
import { IAction, Separator } from '../../../../../base/common/actions.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { ScrollbarVisibility } from '../../../../../base/common/scrollable.js';
import { MenuEntryActionViewItem, SubmenuEntryActionViewItem } from '../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenu, IMenuService, MenuId, MenuItemAction, SubmenuItemAction } from '../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { SELECT_KERNEL_ID } from '../controller/coreActions.js';
import { NOTEBOOK_EDITOR_ID, NotebookSetting } from '../../common/notebookCommon.js';
import { INotebookEditorDelegate } from '../notebookBrowser.js';
import { NotebooKernelActionViewItem } from './notebookKernelView.js';
import { ActionViewWithLabel, UnifiedSubmenuActionView } from '../view/cellParts/cellActionView.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { NotebookOptions } from '../notebookOptions.js';
import { IActionViewItem, IActionViewItemProvider } from '../../../../../base/browser/ui/actionbar/actionbar.js';
import { disposableTimeout } from '../../../../../base/common/async.js';
import { HiddenItemStrategy, IWorkbenchToolBarOptions, WorkbenchToolBar } from '../../../../../platform/actions/browser/toolbar.js';
import { IActionViewItemOptions } from '../../../../../base/browser/ui/actionbar/actionViewItems.js';
import { WorkbenchHoverDelegate } from '../../../../../platform/hover/browser/hover.js';

interface IActionModel {
	action: IAction;
	size: number;
	visible: boolean;
	renderLabel: boolean;
}

export enum RenderLabel {
	Always = 0,
	Never = 1,
	Dynamic = 2
}

export type RenderLabelWithFallback = true | false | 'always' | 'never' | 'dynamic';

export function convertConfiguration(value: RenderLabelWithFallback): RenderLabel {
	switch (value) {
		case true:
			return RenderLabel.Always;
		case false:
			return RenderLabel.Never;
		case 'always':
			return RenderLabel.Always;
		case 'never':
			return RenderLabel.Never;
		case 'dynamic':
			return RenderLabel.Dynamic;
	}
}

const ICON_ONLY_ACTION_WIDTH = 21;
const TOGGLE_MORE_ACTION_WIDTH = 21;
const ACTION_PADDING = 8;

interface IActionLayoutStrategy {
	actionProvider: IActionViewItemProvider;
	calculateActions(leftToolbarContainerMaxWidth: number): { primaryActions: IAction[]; secondaryActions: IAction[] };
}

class WorkbenchAlwaysLabelStrategy implements IActionLayoutStrategy {
	constructor(
		readonly notebookEditor: INotebookEditorDelegate,
		readonly editorToolbar: NotebookEditorWorkbenchToolbar,
		readonly goToMenu: IMenu,
		readonly instantiationService: IInstantiationService) { }

	actionProvider(action: IAction, options: IActionViewItemOptions): IActionViewItem | undefined {
		if (action.id === SELECT_KERNEL_ID) {
			//	this is being disposed by the consumer
			return this.instantiationService.createInstance(NotebooKernelActionViewItem, action, this.notebookEditor, options);
		}

		if (action instanceof MenuItemAction) {
			return this.instantiationService.createInstance(ActionViewWithLabel, action, { hoverDelegate: options.hoverDelegate });
		}

		if (action instanceof SubmenuItemAction && action.item.submenu.id === MenuId.NotebookCellExecuteGoTo.id) {
			return this.instantiationService.createInstance(UnifiedSubmenuActionView, action, { hoverDelegate: options.hoverDelegate }, true, {
				getActions: () => {
					return this.goToMenu.getActions().find(([group]) => group === 'navigation/execute')?.[1] ?? [];
				}
			}, this.actionProvider.bind(this));
		}

		return undefined;
	}

	calculateActions(leftToolbarContainerMaxWidth: number): { primaryActions: IAction[]; secondaryActions: IAction[] } {
		const initialPrimaryActions = this.editorToolbar.primaryActions;
		const initialSecondaryActions = this.editorToolbar.secondaryActions;

		const actionOutput = workbenchCalculateActions(initialPrimaryActions, initialSecondaryActions, leftToolbarContainerMaxWidth);
		return {
			primaryActions: actionOutput.primaryActions.map(a => a.action),
			secondaryActions: actionOutput.secondaryActions
		};
	}
}

class WorkbenchNeverLabelStrategy implements IActionLayoutStrategy {
	constructor(
		readonly notebookEditor: INotebookEditorDelegate,
		readonly editorToolbar: NotebookEditorWorkbenchToolbar,
		readonly goToMenu: IMenu,
		readonly instantiationService: IInstantiationService) { }

	actionProvider(action: IAction, options: IActionViewItemOptions): IActionViewItem | undefined {
		if (action.id === SELECT_KERNEL_ID) {
			//	this is being disposed by the consumer
			return this.instantiationService.createInstance(NotebooKernelActionViewItem, action, this.notebookEditor, options);
		}

		if (action instanceof MenuItemAction) {
			return this.instantiationService.createInstance(MenuEntryActionViewItem, action, { hoverDelegate: options.hoverDelegate });
		}

		if (action instanceof SubmenuItemAction) {
			if (action.item.submenu.id === MenuId.NotebookCellExecuteGoTo.id) {
				return this.instantiationService.createInstance(UnifiedSubmenuActionView, action, { hoverDelegate: options.hoverDelegate }, false, {
					getActions: () => {
						return this.goToMenu.getActions().find(([group]) => group === 'navigation/execute')?.[1] ?? [];
					}
				}, this.actionProvider.bind(this));
			} else {
				return this.instantiationService.createInstance(SubmenuEntryActionViewItem, action, { hoverDelegate: options.hoverDelegate });
			}
		}

		return undefined;
	}

	calculateActions(leftToolbarContainerMaxWidth: number): { primaryActions: IAction[]; secondaryActions: IAction[] } {
		const initialPrimaryActions = this.editorToolbar.primaryActions;
		const initialSecondaryActions = this.editorToolbar.secondaryActions;

		const actionOutput = workbenchCalculateActions(initialPrimaryActions, initialSecondaryActions, leftToolbarContainerMaxWidth);
		return {
			primaryActions: actionOutput.primaryActions.map(a => a.action),
			secondaryActions: actionOutput.secondaryActions
		};
	}
}

class WorkbenchDynamicLabelStrategy implements IActionLayoutStrategy {
	constructor(
		readonly notebookEditor: INotebookEditorDelegate,
		readonly editorToolbar: NotebookEditorWorkbenchToolbar,
		readonly goToMenu: IMenu,
		readonly instantiationService: IInstantiationService) { }

	actionProvider(action: IAction, options: IActionViewItemOptions): IActionViewItem | undefined {
		if (action.id === SELECT_KERNEL_ID) {
			//	this is being disposed by the consumer
			return this.instantiationService.createInstance(NotebooKernelActionViewItem, action, this.notebookEditor, options);
		}

		const a = this.editorToolbar.primaryActions.find(a => a.action.id === action.id);
		if (!a || a.renderLabel) {
			if (action instanceof MenuItemAction) {
				return this.instantiationService.createInstance(ActionViewWithLabel, action, { hoverDelegate: options.hoverDelegate });
			}

			if (action instanceof SubmenuItemAction && action.item.submenu.id === MenuId.NotebookCellExecuteGoTo.id) {
				return this.instantiationService.createInstance(UnifiedSubmenuActionView, action, { hoverDelegate: options.hoverDelegate }, true, {
					getActions: () => {
						return this.goToMenu.getActions().find(([group]) => group === 'navigation/execute')?.[1] ?? [];
					}
				}, this.actionProvider.bind(this));
			}

			return undefined;
		} else {
			if (action instanceof MenuItemAction) {
				return this.instantiationService.createInstance(MenuEntryActionViewItem, action, { hoverDelegate: options.hoverDelegate });
			}

			if (action instanceof SubmenuItemAction) {
				if (action.item.submenu.id === MenuId.NotebookCellExecuteGoTo.id) {
					return this.instantiationService.createInstance(UnifiedSubmenuActionView, action, { hoverDelegate: options.hoverDelegate }, false, {
						getActions: () => {
							return this.goToMenu.getActions().find(([group]) => group === 'navigation/execute')?.[1] ?? [];
						}
					}, this.actionProvider.bind(this));
				} else {
					return this.instantiationService.createInstance(SubmenuEntryActionViewItem, action, { hoverDelegate: options.hoverDelegate });
				}
			}

			return undefined;
		}
	}

	calculateActions(leftToolbarContainerMaxWidth: number): { primaryActions: IAction[]; secondaryActions: IAction[] } {
		const initialPrimaryActions = this.editorToolbar.primaryActions;
		const initialSecondaryActions = this.editorToolbar.secondaryActions;

		const actionOutput = workbenchDynamicCalculateActions(initialPrimaryActions, initialSecondaryActions, leftToolbarContainerMaxWidth);
		return {
			primaryActions: actionOutput.primaryActions.map(a => a.action),
			secondaryActions: actionOutput.secondaryActions
		};
	}
}

export class NotebookEditorWorkbenchToolbar extends Disposable {
	private _leftToolbarScrollable!: DomScrollableElement;
	private _notebookTopLeftToolbarContainer!: HTMLElement;
	private _notebookTopRightToolbarContainer!: HTMLElement;
	private _notebookGlobalActionsMenu!: IMenu;
	private _executeGoToActionsMenu!: IMenu;
	private _notebookLeftToolbar!: WorkbenchToolBar;
	private _primaryActions: IActionModel[];
	get primaryActions(): IActionModel[] {
		return this._primaryActions;
	}
	private _secondaryActions: IAction[];
	get secondaryActions(): IAction[] {
		return this._secondaryActions;
	}
	private _notebookRightToolbar!: ToolBar;
	private _useGlobalToolbar: boolean = false;
	private _strategy!: IActionLayoutStrategy;
	private _renderLabel: RenderLabel = RenderLabel.Always;

	private _visible: boolean = false;
	set visible(visible: boolean) {
		if (this._visible !== visible) {
			this._visible = visible;
			this._onDidChangeVisibility.fire(visible);
		}
	}
	private readonly _onDidChangeVisibility = this._register(new Emitter<boolean>());
	readonly onDidChangeVisibility: Event<boolean> = this._onDidChangeVisibility.event;

	get useGlobalToolbar(): boolean {
		return this._useGlobalToolbar;
	}

	private _dimension: DOM.Dimension | null = null;

	private _deferredActionUpdate: IDisposable | undefined;

	constructor(
		readonly notebookEditor: INotebookEditorDelegate,
		readonly contextKeyService: IContextKeyService,
		readonly notebookOptions: NotebookOptions,
		readonly domNode: HTMLElement,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IMenuService private readonly menuService: IMenuService,
		@IEditorService private readonly editorService: IEditorService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
	) {
		super();

		this._primaryActions = [];
		this._secondaryActions = [];
		this._buildBody();

		this._register(Event.debounce<void, void>(
			this.editorService.onDidActiveEditorChange,
			(last, _current) => last,
			200
		)(this._updatePerEditorChange, this));

		this._registerNotebookActionsToolbar();

		this._register(DOM.addDisposableListener(this.domNode, DOM.EventType.CONTEXT_MENU, e => {
			const event = new StandardMouseEvent(DOM.getWindow(this.domNode), e);
			this.contextMenuService.showContextMenu({
				menuId: MenuId.NotebookToolbarContext,
				getAnchor: () => event,
			});
		}));
	}

	private _buildBody() {
		this._notebookTopLeftToolbarContainer = document.createElement('div');
		this._notebookTopLeftToolbarContainer.classList.add('notebook-toolbar-left');
		this._leftToolbarScrollable = new DomScrollableElement(this._notebookTopLeftToolbarContainer, {
			vertical: ScrollbarVisibility.Hidden,
			horizontal: ScrollbarVisibility.Visible,
			horizontalScrollbarSize: 3,
			useShadows: false,
			scrollYToX: true
		});
		this._register(this._leftToolbarScrollable);

		DOM.append(this.domNode, this._leftToolbarScrollable.getDomNode());
		this._notebookTopRightToolbarContainer = document.createElement('div');
		this._notebookTopRightToolbarContainer.classList.add('notebook-toolbar-right');
		DOM.append(this.domNode, this._notebookTopRightToolbarContainer);
	}

	private _updatePerEditorChange() {
		if (this.editorService.activeEditorPane?.getId() === NOTEBOOK_EDITOR_ID) {
			const notebookEditor = this.editorService.activeEditorPane.getControl() as INotebookEditorDelegate;
			if (notebookEditor === this.notebookEditor) {
				// this is the active editor
				this._showNotebookActionsinEditorToolbar();
				return;
			}
		}
	}

	private _registerNotebookActionsToolbar() {
		this._notebookGlobalActionsMenu = this._register(this.menuService.createMenu(this.notebookEditor.creationOptions.menuIds.notebookToolbar, this.contextKeyService));
		this._executeGoToActionsMenu = this._register(this.menuService.createMenu(MenuId.NotebookCellExecuteGoTo, this.contextKeyService));

		this._useGlobalToolbar = this.notebookOptions.getDisplayOptions().globalToolbar;
		this._renderLabel = this._convertConfiguration(this.configurationService.getValue(NotebookSetting.globalToolbarShowLabel));
		this._updateStrategy();

		const context = {
			ui: true,
			notebookEditor: this.notebookEditor,
			source: 'notebookToolbar'
		};

		const actionProvider = (action: IAction, options: IActionViewItemOptions) => {
			if (action.id === SELECT_KERNEL_ID) {
				// this is being disposed by the consumer
				return this.instantiationService.createInstance(NotebooKernelActionViewItem, action, this.notebookEditor, options);
			}

			if (this._renderLabel !== RenderLabel.Never) {
				const a = this._primaryActions.find(a => a.action.id === action.id);
				if (a && a.renderLabel) {
					return action instanceof MenuItemAction ? this.instantiationService.createInstance(ActionViewWithLabel, action, { hoverDelegate: options.hoverDelegate }) : undefined;
				} else {
					return action instanceof MenuItemAction ? this.instantiationService.createInstance(MenuEntryActionViewItem, action, { hoverDelegate: options.hoverDelegate }) : undefined;
				}
			} else {
				return action instanceof MenuItemAction ? this.instantiationService.createInstance(MenuEntryActionViewItem, action, { hoverDelegate: options.hoverDelegate }) : undefined;
			}
		};

		// Make sure both toolbars have the same hover delegate for instant hover to work
		// Due to the elements being further apart than normal toolbars, the default time limit is to short and has to be increased
		const hoverDelegate = this._register(this.instantiationService.createInstance(WorkbenchHoverDelegate, 'element', { instantHover: true }, {}));
		hoverDelegate.setInstantHoverTimeLimit(600);

		const leftToolbarOptions: IWorkbenchToolBarOptions = {
			hiddenItemStrategy: HiddenItemStrategy.RenderInSecondaryGroup,
			resetMenu: MenuId.NotebookToolbar,
			actionViewItemProvider: (action, options) => {
				return this._strategy.actionProvider(action, options);
			},
			getKeyBinding: action => this.keybindingService.lookupKeybinding(action.id),
			renderDropdownAsChildElement: true,
			hoverDelegate
		};

		this._notebookLeftToolbar = this.instantiationService.createInstance(
			WorkbenchToolBar,
			this._notebookTopLeftToolbarContainer,
			leftToolbarOptions
		);
		this._register(this._notebookLeftToolbar);
		this._notebookLeftToolbar.context = context;

		this._notebookRightToolbar = new ToolBar(this._notebookTopRightToolbarContainer, this.contextMenuService, {
			getKeyBinding: action => this.keybindingService.lookupKeybinding(action.id),
			actionViewItemProvider: actionProvider,
			renderDropdownAsChildElement: true,
			hoverDelegate
		});
		this._register(this._notebookRightToolbar);
		this._notebookRightToolbar.context = context;

		this._showNotebookActionsinEditorToolbar();
		let dropdownIsVisible = false;
		let deferredUpdate: (() => void) | undefined;

		this._register(this._notebookGlobalActionsMenu.onDidChange(() => {
			if (dropdownIsVisible) {
				deferredUpdate = () => this._showNotebookActionsinEditorToolbar();
				return;
			}

			if (this.notebookEditor.isVisible) {
				this._showNotebookActionsinEditorToolbar();
			}
		}));

		this._register(this._notebookLeftToolbar.onDidChangeDropdownVisibility(visible => {
			dropdownIsVisible = visible;

			if (deferredUpdate && !visible) {
				setTimeout(() => {
					deferredUpdate?.();
				}, 0);
				deferredUpdate = undefined;
			}
		}));

		this._register(this.notebookOptions.onDidChangeOptions(e => {
			if (e.globalToolbar !== undefined) {
				this._useGlobalToolbar = this.notebookOptions.getDisplayOptions().globalToolbar;
				this._showNotebookActionsinEditorToolbar();
			}
		}));

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(NotebookSetting.globalToolbarShowLabel)) {
				this._renderLabel = this._convertConfiguration(this.configurationService.getValue<RenderLabelWithFallback>(NotebookSetting.globalToolbarShowLabel));
				this._updateStrategy();
				const oldElement = this._notebookLeftToolbar.getElement();
				oldElement.remove();
				this._notebookLeftToolbar.dispose();

				this._notebookLeftToolbar = this.instantiationService.createInstance(
					WorkbenchToolBar,
					this._notebookTopLeftToolbarContainer,
					leftToolbarOptions
				);

				this._register(this._notebookLeftToolbar);
				this._notebookLeftToolbar.context = context;
				this._showNotebookActionsinEditorToolbar();
				return;
			}
		}));
	}

	private _updateStrategy() {
		switch (this._renderLabel) {
			case RenderLabel.Always:
				this._strategy = new WorkbenchAlwaysLabelStrategy(this.notebookEditor, this, this._executeGoToActionsMenu, this.instantiationService);
				break;
			case RenderLabel.Never:
				this._strategy = new WorkbenchNeverLabelStrategy(this.notebookEditor, this, this._executeGoToActionsMenu, this.instantiationService);
				break;
			case RenderLabel.Dynamic:
				this._strategy = new WorkbenchDynamicLabelStrategy(this.notebookEditor, this, this._executeGoToActionsMenu, this.instantiationService);
				break;
		}
	}

	private _convertConfiguration(value: RenderLabelWithFallback): RenderLabel {
		switch (value) {
			case true:
				return RenderLabel.Always;
			case false:
				return RenderLabel.Never;
			case 'always':
				return RenderLabel.Always;
			case 'never':
				return RenderLabel.Never;
			case 'dynamic':
				return RenderLabel.Dynamic;
		}
	}

	private _showNotebookActionsinEditorToolbar() {
		// when there is no view model, just ignore.
		if (!this.notebookEditor.hasModel()) {
			this._deferredActionUpdate?.dispose();
			this._deferredActionUpdate = undefined;
			this.visible = false;
			return;
		}

		if (this._deferredActionUpdate) {
			return;
		}

		if (!this._useGlobalToolbar) {
			this.domNode.style.display = 'none';
			this._deferredActionUpdate = undefined;
			this.visible = false;
		} else {
			this._deferredActionUpdate = disposableTimeout(async () => {
				await this._setNotebookActions();
				this.visible = true;
				this._deferredActionUpdate?.dispose();
				this._deferredActionUpdate = undefined;
			}, 50);
		}
	}

	private async _setNotebookActions() {
		const groups = this._notebookGlobalActionsMenu.getActions({ shouldForwardArgs: true, renderShortTitle: true });
		this.domNode.style.display = 'flex';
		const primaryLeftGroups = groups.filter(group => /^navigation/.test(group[0]));
		const primaryActions: IAction[] = [];
		primaryLeftGroups.sort((a, b) => {
			if (a[0] === 'navigation') {
				return 1;
			}

			if (b[0] === 'navigation') {
				return -1;
			}

			return 0;
		}).forEach((group, index) => {
			primaryActions.push(...group[1]);
			if (index < primaryLeftGroups.length - 1) {
				primaryActions.push(new Separator());
			}
		});
		const primaryRightGroup = groups.find(group => /^status/.test(group[0]));
		const primaryRightActions = primaryRightGroup ? primaryRightGroup[1] : [];
		const secondaryActions = groups.filter(group => !/^navigation/.test(group[0]) && !/^status/.test(group[0])).reduce((prev: (MenuItemAction | SubmenuItemAction)[], curr) => { prev.push(...curr[1]); return prev; }, []);

		this._notebookLeftToolbar.setActions([], []);

		this._primaryActions = primaryActions.map(action => ({
			action: action,
			size: (action instanceof Separator ? 1 : 0),
			renderLabel: true,
			visible: true
		}));
		this._notebookLeftToolbar.setActions(primaryActions, secondaryActions);
		this._secondaryActions = secondaryActions;

		this._notebookRightToolbar.setActions(primaryRightActions, []);
		this._secondaryActions = secondaryActions;


		if (this._dimension && this._dimension.width >= 0 && this._dimension.height >= 0) {
			this._cacheItemSizes(this._notebookLeftToolbar);
		}

		this._computeSizes();
	}

	private _cacheItemSizes(toolbar: WorkbenchToolBar) {
		for (let i = 0; i < toolbar.getItemsLength(); i++) {
			const action = toolbar.getItemAction(i);
			if (action && action.id !== 'toolbar.toggle.more') {
				const existing = this._primaryActions.find(a => a.action.id === action.id);
				if (existing) {
					existing.size = toolbar.getItemWidth(i);
				}
			}
		}
	}

	private _computeSizes() {
		const toolbar = this._notebookLeftToolbar;
		const rightToolbar = this._notebookRightToolbar;
		if (toolbar && rightToolbar && this._dimension && this._dimension.height >= 0 && this._dimension.width >= 0) {
			// compute size only if it's visible
			if (this._primaryActions.length === 0 && toolbar.getItemsLength() !== this._primaryActions.length) {
				this._cacheItemSizes(this._notebookLeftToolbar);
			}

			if (this._primaryActions.length === 0) {
				return;
			}

			const kernelWidth = (rightToolbar.getItemsLength() ? rightToolbar.getItemWidth(0) : 0) + ACTION_PADDING;
			const leftToolbarContainerMaxWidth = this._dimension.width - kernelWidth - (ACTION_PADDING + TOGGLE_MORE_ACTION_WIDTH) - (/** toolbar left margin */ACTION_PADDING) - (/** toolbar right margin */ACTION_PADDING);
			const calculatedActions = this._strategy.calculateActions(leftToolbarContainerMaxWidth);
			this._notebookLeftToolbar.setActions(calculatedActions.primaryActions, calculatedActions.secondaryActions);
		}
	}

	layout(dimension: DOM.Dimension) {
		this._dimension = dimension;

		if (!this._useGlobalToolbar) {
			this.domNode.style.display = 'none';
		} else {
			this.domNode.style.display = 'flex';
		}
		this._computeSizes();
	}

	override dispose() {
		this._notebookLeftToolbar.context = undefined;
		this._notebookRightToolbar.context = undefined;
		this._notebookLeftToolbar.dispose();
		this._notebookRightToolbar.dispose();
		this._notebookLeftToolbar = null!;
		this._notebookRightToolbar = null!;
		this._deferredActionUpdate?.dispose();
		this._deferredActionUpdate = undefined;

		super.dispose();
	}
}

export function workbenchCalculateActions(initialPrimaryActions: IActionModel[], initialSecondaryActions: IAction[], leftToolbarContainerMaxWidth: number): { primaryActions: IActionModel[]; secondaryActions: IAction[] } {
	return actionOverflowHelper(initialPrimaryActions, initialSecondaryActions, leftToolbarContainerMaxWidth, false);
}

export function workbenchDynamicCalculateActions(initialPrimaryActions: IActionModel[], initialSecondaryActions: IAction[], leftToolbarContainerMaxWidth: number): { primaryActions: IActionModel[]; secondaryActions: IAction[] } {

	if (initialPrimaryActions.length === 0) {
		return { primaryActions: [], secondaryActions: initialSecondaryActions };
	}

	// find true length of array, add 1 for each primary actions, ignoring an item when size = 0
	const visibleActionLength = initialPrimaryActions.filter(action => action.size !== 0).length;

	// step 1: try to fit all primary actions
	const totalWidthWithLabels = initialPrimaryActions.map(action => action.size).reduce((a, b) => a + b, 0) + (visibleActionLength - 1) * ACTION_PADDING;
	if (totalWidthWithLabels <= leftToolbarContainerMaxWidth) {
		initialPrimaryActions.forEach(action => {
			action.renderLabel = true;
		});
		return actionOverflowHelper(initialPrimaryActions, initialSecondaryActions, leftToolbarContainerMaxWidth, false);
	}

	// step 2: check if they fit without labels
	if ((visibleActionLength * ICON_ONLY_ACTION_WIDTH + (visibleActionLength - 1) * ACTION_PADDING) > leftToolbarContainerMaxWidth) {
		initialPrimaryActions.forEach(action => { action.renderLabel = false; });
		return actionOverflowHelper(initialPrimaryActions, initialSecondaryActions, leftToolbarContainerMaxWidth, true);
	}

	// step 3: render as many actions as possible with labels, rest without.
	let sum = 0;
	let lastActionWithLabel = -1;
	for (let i = 0; i < initialPrimaryActions.length; i++) {
		sum += initialPrimaryActions[i].size + ACTION_PADDING;

		if (initialPrimaryActions[i].action instanceof Separator) {
			// find group separator
			const remainingItems = initialPrimaryActions.slice(i + 1).filter(action => action.size !== 0); // todo: need to exclude size 0 items from this
			const newTotalSum = sum + (remainingItems.length === 0 ? 0 : (remainingItems.length * ICON_ONLY_ACTION_WIDTH + (remainingItems.length - 1) * ACTION_PADDING));
			if (newTotalSum <= leftToolbarContainerMaxWidth) {
				lastActionWithLabel = i;
			}
		} else {
			continue;
		}
	}

	// icons only don't fit either
	if (lastActionWithLabel < 0) {
		initialPrimaryActions.forEach(action => { action.renderLabel = false; });
		return actionOverflowHelper(initialPrimaryActions, initialSecondaryActions, leftToolbarContainerMaxWidth, true);
	}

	// render labels for the actions that have space
	initialPrimaryActions.slice(0, lastActionWithLabel + 1).forEach(action => { action.renderLabel = true; });
	initialPrimaryActions.slice(lastActionWithLabel + 1).forEach(action => { action.renderLabel = false; });
	return {
		primaryActions: initialPrimaryActions,
		secondaryActions: initialSecondaryActions
	};
}

function actionOverflowHelper(initialPrimaryActions: IActionModel[], initialSecondaryActions: IAction[], leftToolbarContainerMaxWidth: number, iconOnly: boolean): { primaryActions: IActionModel[]; secondaryActions: IAction[] } {
	const renderActions: IActionModel[] = [];
	const overflow: IAction[] = [];

	let currentSize = 0;
	let nonZeroAction = false;
	let containerFull = false;

	if (initialPrimaryActions.length === 0) {
		return { primaryActions: [], secondaryActions: initialSecondaryActions };
	}

	for (let i = 0; i < initialPrimaryActions.length; i++) {
		const actionModel = initialPrimaryActions[i];
		const itemSize = iconOnly ? (actionModel.size === 0 ? 0 : ICON_ONLY_ACTION_WIDTH) : actionModel.size;

		// if two separators in a row, ignore the second
		if (actionModel.action instanceof Separator && renderActions.length > 0 && renderActions[renderActions.length - 1].action instanceof Separator) {
			continue;
		}

		// if a separator is the first nonZero action, ignore it
		if (actionModel.action instanceof Separator && !nonZeroAction) {
			continue;
		}


		if (currentSize + itemSize <= leftToolbarContainerMaxWidth && !containerFull) {
			currentSize += ACTION_PADDING + itemSize;
			renderActions.push(actionModel);
			if (itemSize !== 0) {
				nonZeroAction = true;
			}
			if (actionModel.action instanceof Separator) {
				nonZeroAction = false;
			}
		} else {
			containerFull = true;
			if (itemSize === 0) { // size 0 implies a hidden item, keep in primary to allow for Workbench to handle visibility
				renderActions.push(actionModel);
			} else {
				if (actionModel.action instanceof Separator) { // never push a separator to overflow
					continue;
				}
				overflow.push(actionModel.action);
			}
		}
	}

	for (let i = (renderActions.length - 1); i > 0; i--) {
		const temp = renderActions[i];
		if (temp.size === 0) {
			continue;
		}
		if (temp.action instanceof Separator) {
			renderActions.splice(i, 1);
		}
		break;
	}


	if (renderActions.length && renderActions[renderActions.length - 1].action instanceof Separator) {
		renderActions.pop();
	}

	if (overflow.length !== 0) {
		overflow.push(new Separator());
	}

	if (iconOnly) {
		// if icon only mode, don't render both (+ code) and (+ markdown) buttons. remove of markdown action
		const markdownIndex = renderActions.findIndex(a => a.action.id === 'notebook.cell.insertMarkdownCellBelow');
		if (markdownIndex !== -1) {
			renderActions.splice(markdownIndex, 1);
		}
	}

	return {
		primaryActions: renderActions,
		secondaryActions: [...overflow, ...initialSecondaryActions]
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewParts/notebookEditorWidgetContextKeys.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewParts/notebookEditorWidgetContextKeys.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../base/browser/dom.js';
import { DisposableStore, dispose, IDisposable } from '../../../../../base/common/lifecycle.js';
import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { ICellViewModel, INotebookEditorDelegate, KERNEL_EXTENSIONS } from '../notebookBrowser.js';
import { KERNEL_HAS_VARIABLE_PROVIDER, NOTEBOOK_CELL_TOOLBAR_LOCATION, NOTEBOOK_HAS_OUTPUTS, NOTEBOOK_HAS_RUNNING_CELL, NOTEBOOK_HAS_SOMETHING_RUNNING, NOTEBOOK_INTERRUPTIBLE_KERNEL, NOTEBOOK_KERNEL, NOTEBOOK_KERNEL_COUNT, NOTEBOOK_KERNEL_SELECTED, NOTEBOOK_KERNEL_SOURCE_COUNT, NOTEBOOK_LAST_CELL_FAILED, NOTEBOOK_MISSING_KERNEL_EXTENSION, NOTEBOOK_USE_CONSOLIDATED_OUTPUT_BUTTON, NOTEBOOK_VIEW_TYPE } from '../../common/notebookContextKeys.js';
import { ICellExecutionStateChangedEvent, IExecutionStateChangedEvent, INotebookExecutionStateService, INotebookFailStateChangedEvent, NotebookExecutionType } from '../../common/notebookExecutionStateService.js';
import { INotebookKernelService } from '../../common/notebookKernelService.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';

export class NotebookEditorContextKeys {

	private readonly _notebookKernel: IContextKey<string>;
	private readonly _notebookKernelCount: IContextKey<number>;
	private readonly _notebookKernelSourceCount: IContextKey<number>;
	private readonly _notebookKernelSelected: IContextKey<boolean>;
	private readonly _interruptibleKernel: IContextKey<boolean>;
	private readonly _hasVariableProvider: IContextKey<boolean>;
	private readonly _someCellRunning: IContextKey<boolean>;
	private readonly _kernelRunning: IContextKey<boolean>;
	private readonly _hasOutputs: IContextKey<boolean>;
	private readonly _useConsolidatedOutputButton: IContextKey<boolean>;
	private readonly _viewType!: IContextKey<string>;
	private readonly _missingKernelExtension: IContextKey<boolean>;
	private readonly _cellToolbarLocation: IContextKey<'left' | 'right' | 'hidden'>;
	private readonly _lastCellFailed: IContextKey<boolean>;

	private readonly _disposables = new DisposableStore();
	private readonly _viewModelDisposables = new DisposableStore();
	private readonly _cellOutputsListeners: IDisposable[] = [];
	private readonly _selectedKernelDisposables = new DisposableStore();

	constructor(
		private readonly _editor: INotebookEditorDelegate,
		@INotebookKernelService private readonly _notebookKernelService: INotebookKernelService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@INotebookExecutionStateService private readonly _notebookExecutionStateService: INotebookExecutionStateService
	) {
		this._notebookKernel = NOTEBOOK_KERNEL.bindTo(contextKeyService);
		this._notebookKernelCount = NOTEBOOK_KERNEL_COUNT.bindTo(contextKeyService);
		this._notebookKernelSelected = NOTEBOOK_KERNEL_SELECTED.bindTo(contextKeyService);
		this._interruptibleKernel = NOTEBOOK_INTERRUPTIBLE_KERNEL.bindTo(contextKeyService);
		this._hasVariableProvider = KERNEL_HAS_VARIABLE_PROVIDER.bindTo(contextKeyService);
		this._someCellRunning = NOTEBOOK_HAS_RUNNING_CELL.bindTo(contextKeyService);
		this._kernelRunning = NOTEBOOK_HAS_SOMETHING_RUNNING.bindTo(contextKeyService);
		this._useConsolidatedOutputButton = NOTEBOOK_USE_CONSOLIDATED_OUTPUT_BUTTON.bindTo(contextKeyService);
		this._hasOutputs = NOTEBOOK_HAS_OUTPUTS.bindTo(contextKeyService);
		this._viewType = NOTEBOOK_VIEW_TYPE.bindTo(contextKeyService);
		this._missingKernelExtension = NOTEBOOK_MISSING_KERNEL_EXTENSION.bindTo(contextKeyService);
		this._notebookKernelSourceCount = NOTEBOOK_KERNEL_SOURCE_COUNT.bindTo(contextKeyService);
		this._cellToolbarLocation = NOTEBOOK_CELL_TOOLBAR_LOCATION.bindTo(contextKeyService);
		this._lastCellFailed = NOTEBOOK_LAST_CELL_FAILED.bindTo(contextKeyService);

		this._handleDidChangeModel();
		this._updateForNotebookOptions();

		this._disposables.add(_editor.onDidChangeModel(this._handleDidChangeModel, this));
		this._disposables.add(_notebookKernelService.onDidAddKernel(this._updateKernelContext, this));
		this._disposables.add(_notebookKernelService.onDidChangeSelectedNotebooks(this._updateKernelContext, this));
		this._disposables.add(_notebookKernelService.onDidChangeSourceActions(this._updateKernelContext, this));
		this._disposables.add(_editor.notebookOptions.onDidChangeOptions(this._updateForNotebookOptions, this));
		this._disposables.add(_extensionService.onDidChangeExtensions(this._updateForInstalledExtension, this));
		this._disposables.add(_notebookExecutionStateService.onDidChangeExecution(this._updateForExecution, this));
		this._disposables.add(_notebookExecutionStateService.onDidChangeLastRunFailState(this._updateForLastRunFailState, this));
	}

	dispose(): void {
		this._disposables.dispose();
		this._viewModelDisposables.dispose();
		this._selectedKernelDisposables.dispose();
		this._notebookKernelCount.reset();
		this._notebookKernelSourceCount.reset();
		this._interruptibleKernel.reset();
		this._hasVariableProvider.reset();
		this._someCellRunning.reset();
		this._kernelRunning.reset();
		this._viewType.reset();
		dispose(this._cellOutputsListeners);
		this._cellOutputsListeners.length = 0;
	}

	private _handleDidChangeModel(): void {

		this._updateKernelContext();
		this._updateForNotebookOptions();

		this._viewModelDisposables.clear();
		dispose(this._cellOutputsListeners);
		this._cellOutputsListeners.length = 0;

		if (!this._editor.hasModel()) {
			return;
		}

		const recomputeOutputsExistence = () => {
			let hasOutputs = false;
			if (this._editor.hasModel()) {
				for (let i = 0; i < this._editor.getLength(); i++) {
					if (this._editor.cellAt(i).outputsViewModels.length > 0) {
						hasOutputs = true;
						break;
					}
				}
			}

			this._hasOutputs.set(hasOutputs);
		};

		const layoutDisposable = this._viewModelDisposables.add(new DisposableStore());

		const addCellOutputsListener = (c: ICellViewModel) => {
			return c.model.onDidChangeOutputs(() => {
				layoutDisposable.clear();

				layoutDisposable.add(DOM.scheduleAtNextAnimationFrame(DOM.getWindow(this._editor.getDomNode()), () => {
					recomputeOutputsExistence();
				}));
			});
		};

		for (let i = 0; i < this._editor.getLength(); i++) {
			const cell = this._editor.cellAt(i);
			this._cellOutputsListeners.push(addCellOutputsListener(cell));
		}

		recomputeOutputsExistence();
		this._updateForInstalledExtension();

		this._viewModelDisposables.add(this._editor.onDidChangeViewCells(e => {
			[...e.splices].reverse().forEach(splice => {
				const [start, deleted, newCells] = splice;
				const deletedCellOutputStates = this._cellOutputsListeners.splice(start, deleted, ...newCells.map(addCellOutputsListener));
				dispose(deletedCellOutputStates);
			});
		}));
		this._viewType.set(this._editor.textModel.viewType);
	}
	private _updateForExecution(e: ICellExecutionStateChangedEvent | IExecutionStateChangedEvent): void {
		if (this._editor.textModel) {
			const notebookExe = this._notebookExecutionStateService.getExecution(this._editor.textModel.uri);
			const notebookCellExe = this._notebookExecutionStateService.getCellExecutionsForNotebook(this._editor.textModel.uri);
			this._kernelRunning.set(notebookCellExe.length > 0 || !!notebookExe);
			if (e.type === NotebookExecutionType.cell) {
				this._someCellRunning.set(notebookCellExe.length > 0);
			}
		} else {
			this._kernelRunning.set(false);
			if (e.type === NotebookExecutionType.cell) {
				this._someCellRunning.set(false);
			}
		}
	}

	private _updateForLastRunFailState(e: INotebookFailStateChangedEvent): void {
		if (e.notebook === this._editor.textModel?.uri) {
			this._lastCellFailed.set(e.visible);
		}
	}

	private async _updateForInstalledExtension(): Promise<void> {
		if (!this._editor.hasModel()) {
			return;
		}

		const viewType = this._editor.textModel.viewType;
		const kernelExtensionId = KERNEL_EXTENSIONS.get(viewType);
		this._missingKernelExtension.set(
			!!kernelExtensionId && !(await this._extensionService.getExtension(kernelExtensionId)));
	}

	private _updateKernelContext(): void {
		if (!this._editor.hasModel()) {
			this._notebookKernelCount.reset();
			this._notebookKernelSourceCount.reset();
			this._interruptibleKernel.reset();
			this._hasVariableProvider.reset();
			return;
		}

		const { selected, all } = this._notebookKernelService.getMatchingKernel(this._editor.textModel);
		const sourceActions = this._notebookKernelService.getSourceActions(this._editor.textModel, this._editor.scopedContextKeyService);
		this._notebookKernelCount.set(all.length);
		this._notebookKernelSourceCount.set(sourceActions.length);
		this._interruptibleKernel.set(selected?.implementsInterrupt ?? false);
		this._hasVariableProvider.set(selected?.hasVariableProvider ?? false);
		this._notebookKernelSelected.set(Boolean(selected));
		this._notebookKernel.set(selected?.id ?? '');

		this._selectedKernelDisposables.clear();
		if (selected) {
			this._selectedKernelDisposables.add(selected.onDidChange(() => {
				this._interruptibleKernel.set(selected?.implementsInterrupt ?? false);
			}));
		}
	}

	private _updateForNotebookOptions(): void {
		const layout = this._editor.notebookOptions.getDisplayOptions();
		this._useConsolidatedOutputButton.set(layout.consolidatedOutputButton);
		this._cellToolbarLocation.set(this._editor.notebookOptions.computeCellToolbarLocation(this._editor.textModel?.viewType));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewParts/notebookHorizontalTracker.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewParts/notebookHorizontalTracker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener, EventType, getWindow } from '../../../../../base/browser/dom.js';
import { IMouseWheelEvent } from '../../../../../base/browser/mouseEvent.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { isChrome, isMacintosh } from '../../../../../base/common/platform.js';
import { CodeEditorWidget } from '../../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { INotebookEditorDelegate } from '../notebookBrowser.js';

export class NotebookHorizontalTracker extends Disposable {
	constructor(
		private readonly _notebookEditor: INotebookEditorDelegate,
		private readonly _listViewScrollablement: HTMLElement,
	) {
		super();

		this._register(addDisposableListener(this._listViewScrollablement, EventType.MOUSE_WHEEL, (event: IMouseWheelEvent) => {
			let deltaX = event.deltaX;
			let deltaY = event.deltaY;
			let wheelDeltaX = event.wheelDeltaX;
			let wheelDeltaY = event.wheelDeltaY;
			const wheelDelta = event.wheelDelta;

			const shiftConvert = !isMacintosh && event.shiftKey;
			if (shiftConvert && !deltaX) {
				deltaX = deltaY;
				deltaY = 0;
				wheelDeltaX = wheelDeltaY;
				wheelDeltaY = 0;
			}

			if (deltaX === 0) {
				return;
			}

			const hoveringOnEditor = this._notebookEditor.codeEditors.find(editor => {
				const editorLayout = editor[1].getLayoutInfo();
				if (editorLayout.contentWidth === editorLayout.width) {
					// no overflow
					return false;
				}

				const editorDOM = editor[1].getDomNode();
				if (editorDOM && editorDOM.contains(event.target as HTMLElement)) {
					return true;
				}

				return false;
			});

			if (!hoveringOnEditor) {
				return;
			}

			const targetWindow = getWindow(event);
			const evt = {
				deltaMode: event.deltaMode,
				deltaX: deltaX,
				deltaY: 0,
				deltaZ: 0,
				wheelDelta: wheelDelta && isChrome ? (wheelDelta / targetWindow.devicePixelRatio) : wheelDelta,
				wheelDeltaX: wheelDeltaX && isChrome ? (wheelDeltaX / targetWindow.devicePixelRatio) : wheelDeltaX,
				wheelDeltaY: 0,
				detail: event.detail,
				shiftKey: event.shiftKey,
				type: event.type,
				defaultPrevented: false,
				preventDefault: () => { },
				stopPropagation: () => { }
			};

			(hoveringOnEditor[1] as CodeEditorWidget).delegateScrollFromMouseWheelEvent(evt as unknown as IMouseWheelEvent);
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewParts/notebookKernelQuickPickStrategy.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewParts/notebookKernelQuickPickStrategy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction } from '../../../../../base/common/actions.js';
import { groupBy } from '../../../../../base/common/arrays.js';
import { createCancelablePromise } from '../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { MarshalledId } from '../../../../../base/common/marshallingIds.js';
import { uppercaseFirstLetter } from '../../../../../base/common/strings.js';
import { Command } from '../../../../../editor/common/languages.js';
import { localize } from '../../../../../nls.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { ProgressLocation } from '../../../../../platform/progress/common/progress.js';
import { IQuickInputButton, IQuickInputService, IQuickPick, IQuickPickItem, QuickPickInput } from '../../../../../platform/quickinput/common/quickInput.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { IExtension, IExtensionsWorkbenchService } from '../../../extensions/common/extensions.js';
import { IActiveNotebookEditor, INotebookExtensionRecommendation, JUPYTER_EXTENSION_ID, KERNEL_RECOMMENDATIONS } from '../notebookBrowser.js';
import { NotebookEditorWidget } from '../notebookEditorWidget.js';
import { executingStateIcon, selectKernelIcon } from '../notebookIcons.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { INotebookKernel, INotebookKernelHistoryService, INotebookKernelMatchResult, INotebookKernelService, ISourceAction } from '../../common/notebookKernelService.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import { URI } from '../../../../../base/common/uri.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { INotebookTextModel } from '../../common/notebookCommon.js';
import { SELECT_KERNEL_ID } from '../controller/coreActions.js';
import { EnablementState, IExtensionManagementServerService } from '../../../../services/extensionManagement/common/extensionManagement.js';
import { areSameExtensions } from '../../../../../platform/extensionManagement/common/extensionManagementUtil.js';

type KernelPick = IQuickPickItem & { kernel: INotebookKernel };
function isKernelPick(item: QuickPickInput<IQuickPickItem>): item is KernelPick {
	return 'kernel' in item;
}
type GroupedKernelsPick = IQuickPickItem & { kernels: INotebookKernel[]; source: string };
function isGroupedKernelsPick(item: QuickPickInput<IQuickPickItem>): item is GroupedKernelsPick {
	return 'kernels' in item;
}
type SourcePick = IQuickPickItem & { action: ISourceAction };
function isSourcePick(item: QuickPickInput<IQuickPickItem>): item is SourcePick {
	return 'action' in item;
}
type InstallExtensionPick = IQuickPickItem & { extensionIds: string[] };
function isInstallExtensionPick(item: QuickPickInput<IQuickPickItem>): item is InstallExtensionPick {
	return item.id === 'installSuggested' && 'extensionIds' in item;
}
type SearchMarketplacePick = IQuickPickItem & { id: 'install' };
function isSearchMarketplacePick(item: QuickPickInput<IQuickPickItem>): item is SearchMarketplacePick {
	return item.id === 'install';
}

type KernelSourceQuickPickItem = IQuickPickItem & { command: Command; documentation?: string };
function isKernelSourceQuickPickItem(item: IQuickPickItem): item is KernelSourceQuickPickItem {
	return 'command' in item;
}

function supportAutoRun(item: QuickPickInput<IQuickPickItem>): item is IQuickPickItem {
	return 'autoRun' in item && !!item.autoRun;
}
type KernelQuickPickItem = (IQuickPickItem & { autoRun?: boolean }) | SearchMarketplacePick | InstallExtensionPick | KernelPick | GroupedKernelsPick | SourcePick | KernelSourceQuickPickItem;
const KERNEL_PICKER_UPDATE_DEBOUNCE = 200;

export type KernelQuickPickContext =
	{ id: string; extension: string } |
	{ notebookEditorId: string } |
	{ id: string; extension: string; notebookEditorId: string } |
	{ ui?: boolean; notebookEditor?: NotebookEditorWidget; skipIfAlreadySelected?: boolean };

export interface IKernelPickerStrategy {
	showQuickPick(editor: IActiveNotebookEditor, wantedKernelId?: string): Promise<boolean>;
}

function toKernelQuickPick(kernel: INotebookKernel, selected: INotebookKernel | undefined) {
	const res: KernelPick = {
		kernel,
		picked: kernel.id === selected?.id,
		label: kernel.label,
		description: kernel.description,
		detail: kernel.detail
	};
	if (kernel.id === selected?.id) {
		if (!res.description) {
			res.description = localize('current1', "Currently Selected");
		} else {
			res.description = localize('current2', "{0} - Currently Selected", res.description);
		}
	}
	return res;
}


abstract class KernelPickerStrategyBase implements IKernelPickerStrategy {
	constructor(
		protected readonly _notebookKernelService: INotebookKernelService,
		protected readonly _productService: IProductService,
		protected readonly _quickInputService: IQuickInputService,
		protected readonly _labelService: ILabelService,
		protected readonly _logService: ILogService,
		protected readonly _extensionWorkbenchService: IExtensionsWorkbenchService,
		protected readonly _extensionService: IExtensionService,
		protected readonly _commandService: ICommandService,
		protected readonly _extensionManagementServerService: IExtensionManagementServerService
	) { }

	async showQuickPick(editor: IActiveNotebookEditor, wantedId?: string, skipAutoRun?: boolean): Promise<boolean> {
		const notebook = editor.textModel;
		const scopedContextKeyService = editor.scopedContextKeyService;
		const matchResult = this._getMatchingResult(notebook);
		const { selected, all } = matchResult;

		let newKernel: INotebookKernel | undefined;
		if (wantedId) {
			for (const candidate of all) {
				if (candidate.id === wantedId) {
					newKernel = candidate;
					break;
				}
			}
			if (!newKernel) {
				this._logService.warn(`wanted kernel DOES NOT EXIST, wanted: ${wantedId}, all: ${all.map(k => k.id)}`);
				return false;
			}
		}

		if (newKernel) {
			this._selecteKernel(notebook, newKernel);
			return true;
		}


		const localDisposableStore = new DisposableStore();
		const quickPick = localDisposableStore.add(this._quickInputService.createQuickPick<KernelQuickPickItem>({ useSeparators: true }));
		const quickPickItems = this._getKernelPickerQuickPickItems(notebook, matchResult, this._notebookKernelService, scopedContextKeyService);

		if (quickPickItems.length === 1 && supportAutoRun(quickPickItems[0]) && !skipAutoRun) {
			const picked = await this._handleQuickPick(editor, quickPickItems[0], quickPickItems as KernelQuickPickItem[]);
			localDisposableStore.dispose();
			return picked;
		}

		quickPick.items = quickPickItems;
		quickPick.canSelectMany = false;
		quickPick.placeholder = selected
			? localize('prompt.placeholder.change', "Change kernel for '{0}'", this._labelService.getUriLabel(notebook.uri, { relative: true }))
			: localize('prompt.placeholder.select', "Select kernel for '{0}'", this._labelService.getUriLabel(notebook.uri, { relative: true }));

		quickPick.busy = this._notebookKernelService.getKernelDetectionTasks(notebook).length > 0;

		const kernelDetectionTaskListener = this._notebookKernelService.onDidChangeKernelDetectionTasks(() => {
			quickPick.busy = this._notebookKernelService.getKernelDetectionTasks(notebook).length > 0;
		});

		// run extension recommendataion task if quickPickItems is empty
		const extensionRecommendataionPromise = quickPickItems.length === 0
			? createCancelablePromise(token => this._showInstallKernelExtensionRecommendation(notebook, quickPick, this._extensionWorkbenchService, token))
			: undefined;

		const kernelChangeEventListener = Event.debounce<void, void>(
			Event.any(
				this._notebookKernelService.onDidChangeSourceActions,
				this._notebookKernelService.onDidAddKernel,
				this._notebookKernelService.onDidRemoveKernel,
				this._notebookKernelService.onDidChangeNotebookAffinity
			),
			(last, _current) => last,
			KERNEL_PICKER_UPDATE_DEBOUNCE
		)(async () => {
			// reset quick pick progress
			quickPick.busy = false;
			extensionRecommendataionPromise?.cancel();

			const currentActiveItems = quickPick.activeItems;
			const matchResult = this._getMatchingResult(notebook);
			const quickPickItems = this._getKernelPickerQuickPickItems(notebook, matchResult, this._notebookKernelService, scopedContextKeyService);
			quickPick.keepScrollPosition = true;

			// recalcuate active items
			const activeItems: KernelQuickPickItem[] = [];
			for (const item of currentActiveItems) {
				if (isKernelPick(item)) {
					const kernelId = item.kernel.id;
					const sameItem = quickPickItems.find(pi => isKernelPick(pi) && pi.kernel.id === kernelId) as KernelPick | undefined;
					if (sameItem) {
						activeItems.push(sameItem);
					}
				} else if (isSourcePick(item)) {
					const sameItem = quickPickItems.find(pi => isSourcePick(pi) && pi.action.action.id === item.action.action.id) as SourcePick | undefined;
					if (sameItem) {
						activeItems.push(sameItem);
					}
				}
			}

			quickPick.items = quickPickItems;
			quickPick.activeItems = activeItems;
		}, this);

		const pick = await new Promise<{ selected: KernelQuickPickItem | undefined; items: KernelQuickPickItem[] }>((resolve, reject) => {
			localDisposableStore.add(quickPick.onDidAccept(() => {
				const item = quickPick.selectedItems[0];
				if (item) {
					resolve({ selected: item, items: quickPick.items as KernelQuickPickItem[] });
				} else {
					resolve({ selected: undefined, items: quickPick.items as KernelQuickPickItem[] });
				}

				quickPick.hide();
			}));

			localDisposableStore.add(quickPick.onDidHide(() => {
				kernelDetectionTaskListener.dispose();
				kernelChangeEventListener.dispose();
				quickPick.dispose();
				resolve({ selected: undefined, items: quickPick.items as KernelQuickPickItem[] });
			}));
			quickPick.show();
		});

		localDisposableStore.dispose();

		if (pick.selected) {
			return await this._handleQuickPick(editor, pick.selected, pick.items);
		}

		return false;
	}

	protected _getMatchingResult(notebook: NotebookTextModel) {
		return this._notebookKernelService.getMatchingKernel(notebook);
	}

	protected abstract _getKernelPickerQuickPickItems(
		notebookTextModel: NotebookTextModel,
		matchResult: INotebookKernelMatchResult,
		notebookKernelService: INotebookKernelService,
		scopedContextKeyService: IContextKeyService
	): QuickPickInput<KernelQuickPickItem>[];

	protected async _handleQuickPick(editor: IActiveNotebookEditor, pick: KernelQuickPickItem, quickPickItems: KernelQuickPickItem[]): Promise<boolean> {
		if (isKernelPick(pick)) {
			const newKernel = pick.kernel;
			this._selecteKernel(editor.textModel, newKernel);
			return true;
		}

		// actions
		if (isSearchMarketplacePick(pick)) {
			await this._showKernelExtension(
				this._extensionWorkbenchService,
				this._extensionService,
				this._extensionManagementServerService,
				editor.textModel.viewType,
				[]
			);
			// suggestedExtension must be defined for this option to be shown, but still check to make TS happy
		} else if (isInstallExtensionPick(pick)) {
			await this._showKernelExtension(
				this._extensionWorkbenchService,
				this._extensionService,
				this._extensionManagementServerService,
				editor.textModel.viewType,
				pick.extensionIds,
				this._productService.quality !== 'stable'
			);
		} else if (isSourcePick(pick)) {
			// selected explicilty, it should trigger the execution?
			pick.action.runAction();
		}

		return true;
	}

	protected _selecteKernel(notebook: NotebookTextModel, kernel: INotebookKernel) {
		this._notebookKernelService.selectKernelForNotebook(kernel, notebook);
	}

	protected async _showKernelExtension(
		extensionWorkbenchService: IExtensionsWorkbenchService,
		extensionService: IExtensionService,
		extensionManagementServerService: IExtensionManagementServerService,
		viewType: string,
		extIds: string[],
		isInsiders?: boolean
	) {
		// If extension id is provided attempt to install the extension as the user has requested the suggested ones be installed
		const extensionsToInstall: IExtension[] = [];
		const extensionsToInstallOnRemote: IExtension[] = [];
		const extensionsToEnable: IExtension[] = [];

		for (const extId of extIds) {
			const extension = (await extensionWorkbenchService.getExtensions([{ id: extId }], CancellationToken.None))[0];
			if (extension.enablementState === EnablementState.DisabledGlobally || extension.enablementState === EnablementState.DisabledWorkspace || extension.enablementState === EnablementState.DisabledByEnvironment) {
				extensionsToEnable.push(extension);
			} else if (!extensionWorkbenchService.installed.some(e => areSameExtensions(e.identifier, extension.identifier))) {
				// Install this extension only if it hasn't already been installed.
				const canInstall = await extensionWorkbenchService.canInstall(extension);
				if (canInstall === true) {
					extensionsToInstall.push(extension);
				}
			} else if (extensionManagementServerService.remoteExtensionManagementServer) {
				// already installed, check if it should be installed on remote since we are not getting any kernels or kernel providers.
				if (extensionWorkbenchService.installed.some(e => areSameExtensions(e.identifier, extension.identifier) && e.server === extensionManagementServerService.remoteExtensionManagementServer)) {
					// extension exists on remote server. should not happen
					continue;
				} else {
					// extension doesn't exist on remote server
					const canInstall = await extensionWorkbenchService.canInstall(extension);
					if (canInstall) {
						extensionsToInstallOnRemote.push(extension);
					}
				}
			}
		}

		if (extensionsToInstall.length || extensionsToEnable.length || extensionsToInstallOnRemote.length) {
			await Promise.all([...extensionsToInstall.map(async extension => {
				await extensionWorkbenchService.install(
					extension,
					{
						installPreReleaseVersion: isInsiders ?? false,
						context: { skipWalkthrough: true },
					},
					ProgressLocation.Notification
				);
			}), ...extensionsToEnable.map(async extension => {
				switch (extension.enablementState) {
					case EnablementState.DisabledWorkspace:
						await extensionWorkbenchService.setEnablement([extension], EnablementState.EnabledWorkspace);
						return;
					case EnablementState.DisabledGlobally:
						await extensionWorkbenchService.setEnablement([extension], EnablementState.EnabledGlobally);
						return;
					case EnablementState.DisabledByEnvironment:
						await extensionWorkbenchService.setEnablement([extension], EnablementState.EnabledByEnvironment);
						return;
					default:
						break;
				}
			}), ...extensionsToInstallOnRemote.map(async extension => {
				await extensionWorkbenchService.installInServer(extension, this._extensionManagementServerService.remoteExtensionManagementServer!);
			})]);

			await extensionService.activateByEvent(`onNotebook:${viewType}`);
			return;
		}

		const pascalCased = viewType.split(/[^a-z0-9]/ig).map(uppercaseFirstLetter).join('');
		await extensionWorkbenchService.openSearch(`@tag:notebookKernel${pascalCased}`);
	}

	private async _showInstallKernelExtensionRecommendation(
		notebookTextModel: NotebookTextModel,
		quickPick: IQuickPick<KernelQuickPickItem, { useSeparators: true }>,
		extensionWorkbenchService: IExtensionsWorkbenchService,
		token: CancellationToken
	) {
		quickPick.busy = true;

		const newQuickPickItems = await this._getKernelRecommendationsQuickPickItems(notebookTextModel, extensionWorkbenchService);
		quickPick.busy = false;

		if (token.isCancellationRequested) {
			return;
		}

		if (newQuickPickItems && quickPick.items.length === 0) {
			quickPick.items = newQuickPickItems;
		}
	}

	protected async _getKernelRecommendationsQuickPickItems(
		notebookTextModel: NotebookTextModel,
		extensionWorkbenchService: IExtensionsWorkbenchService,
	): Promise<QuickPickInput<SearchMarketplacePick | InstallExtensionPick>[] | undefined> {
		const quickPickItems: QuickPickInput<SearchMarketplacePick | InstallExtensionPick>[] = [];

		const language = this.getSuggestedLanguage(notebookTextModel);
		const suggestedExtension: INotebookExtensionRecommendation | undefined = language ? this.getSuggestedKernelFromLanguage(notebookTextModel.viewType, language) : undefined;
		if (suggestedExtension) {
			await extensionWorkbenchService.queryLocal();

			const extensions = extensionWorkbenchService.installed.filter(e =>
				(e.enablementState === EnablementState.EnabledByEnvironment || e.enablementState === EnablementState.EnabledGlobally || e.enablementState === EnablementState.EnabledWorkspace)
				&& suggestedExtension.extensionIds.includes(e.identifier.id)
			);

			if (extensions.length === suggestedExtension.extensionIds.length) {
				// it's installed but might be detecting kernels
				return undefined;
			}

			// We have a suggested kernel, show an option to install it
			quickPickItems.push({
				id: 'installSuggested',
				description: suggestedExtension.displayName ?? suggestedExtension.extensionIds.join(', '),
				label: `$(${Codicon.lightbulb.id}) ` + localize('installSuggestedKernel', 'Install/Enable suggested extensions'),
				extensionIds: suggestedExtension.extensionIds
			} satisfies InstallExtensionPick);
		}
		// there is no kernel, show the install from marketplace
		quickPickItems.push({
			id: 'install',
			label: localize('searchForKernels', "Browse marketplace for kernel extensions"),
		} satisfies SearchMarketplacePick);

		return quickPickItems;
	}

	/**
	 * Examine the most common language in the notebook
	 * @param notebookTextModel The notebook text model
	 * @returns What the suggested language is for the notebook. Used for kernal installing
	 */
	private getSuggestedLanguage(notebookTextModel: NotebookTextModel): string | undefined {
		const metaData = notebookTextModel.metadata;
		const language_info = (metaData?.metadata as Record<string, unknown>)?.language_info as Record<string, string> | undefined;
		let suggestedKernelLanguage: string | undefined = language_info?.name;
		// TODO how do we suggest multi language notebooks?
		if (!suggestedKernelLanguage) {
			const cellLanguages = notebookTextModel.cells.map(cell => cell.language).filter(language => language !== 'markdown');
			// Check if cell languages is all the same
			if (cellLanguages.length > 1) {
				const firstLanguage = cellLanguages[0];
				if (cellLanguages.every(language => language === firstLanguage)) {
					suggestedKernelLanguage = firstLanguage;
				}
			}
		}
		return suggestedKernelLanguage;
	}

	/**
	 * Given a language and notebook view type suggest a kernel for installation
	 * @param language The language to find a suggested kernel extension for
	 * @returns A recommednation object for the recommended extension, else undefined
	 */
	private getSuggestedKernelFromLanguage(viewType: string, language: string): INotebookExtensionRecommendation | undefined {
		const recommendation = KERNEL_RECOMMENDATIONS.get(viewType)?.get(language);
		return recommendation;
	}
}

export class KernelPickerMRUStrategy extends KernelPickerStrategyBase {
	constructor(
		@INotebookKernelService _notebookKernelService: INotebookKernelService,
		@IProductService _productService: IProductService,
		@IQuickInputService _quickInputService: IQuickInputService,
		@ILabelService _labelService: ILabelService,
		@ILogService _logService: ILogService,
		@IExtensionsWorkbenchService _extensionWorkbenchService: IExtensionsWorkbenchService,
		@IExtensionService _extensionService: IExtensionService,
		@IExtensionManagementServerService _extensionManagementServerService: IExtensionManagementServerService,
		@ICommandService _commandService: ICommandService,
		@INotebookKernelHistoryService private readonly _notebookKernelHistoryService: INotebookKernelHistoryService,
		@IOpenerService private readonly _openerService: IOpenerService

	) {
		super(
			_notebookKernelService,
			_productService,
			_quickInputService,
			_labelService,
			_logService,
			_extensionWorkbenchService,
			_extensionService,
			_commandService,
			_extensionManagementServerService,
		);
	}

	protected _getKernelPickerQuickPickItems(notebookTextModel: NotebookTextModel, matchResult: INotebookKernelMatchResult, notebookKernelService: INotebookKernelService, scopedContextKeyService: IContextKeyService): QuickPickInput<KernelQuickPickItem>[] {
		const quickPickItems: QuickPickInput<KernelQuickPickItem>[] = [];

		if (matchResult.selected) {
			const kernelItem = toKernelQuickPick(matchResult.selected, matchResult.selected);
			quickPickItems.push(kernelItem);
		}

		matchResult.suggestions.filter(kernel => kernel.id !== matchResult.selected?.id).map(kernel => toKernelQuickPick(kernel, matchResult.selected))
			.forEach(kernel => {
				quickPickItems.push(kernel);
			});

		const shouldAutoRun = quickPickItems.length === 0;

		if (quickPickItems.length > 0) {
			quickPickItems.push({
				type: 'separator'
			});
		}

		// select another kernel quick pick
		quickPickItems.push({
			id: 'selectAnother',
			label: localize('selectAnotherKernel.more', "Select Another Kernel..."),
			autoRun: shouldAutoRun
		});

		return quickPickItems;
	}

	protected override _selecteKernel(notebook: NotebookTextModel, kernel: INotebookKernel): void {
		const currentInfo = this._notebookKernelService.getMatchingKernel(notebook);
		if (currentInfo.selected) {
			// there is already a selected kernel
			this._notebookKernelHistoryService.addMostRecentKernel(currentInfo.selected);
		}
		super._selecteKernel(notebook, kernel);
		this._notebookKernelHistoryService.addMostRecentKernel(kernel);
	}

	protected override _getMatchingResult(notebook: NotebookTextModel): INotebookKernelMatchResult {
		const { selected, all } = this._notebookKernelHistoryService.getKernels(notebook);
		const matchingResult = this._notebookKernelService.getMatchingKernel(notebook);
		return {
			selected: selected,
			all: matchingResult.all,
			suggestions: all,
			hidden: []
		};
	}

	protected override async _handleQuickPick(editor: IActiveNotebookEditor, pick: KernelQuickPickItem, items: KernelQuickPickItem[]): Promise<boolean> {
		if (pick.id === 'selectAnother') {
			return this.displaySelectAnotherQuickPick(editor, items.length === 1 && items[0] === pick);
		}

		return super._handleQuickPick(editor, pick, items);
	}

	private async displaySelectAnotherQuickPick(editor: IActiveNotebookEditor, kernelListEmpty: boolean): Promise<boolean> {
		const notebook: NotebookTextModel = editor.textModel;
		const disposables = new DisposableStore();
		const quickPick = disposables.add(this._quickInputService.createQuickPick<KernelQuickPickItem>({ useSeparators: true }));
		const quickPickItem = await new Promise<KernelQuickPickItem | IQuickInputButton | undefined>(resolve => {
			// select from kernel sources
			quickPick.title = kernelListEmpty ? localize('select', "Select Kernel") : localize('selectAnotherKernel', "Select Another Kernel");
			quickPick.placeholder = localize('selectKernel.placeholder', "Type to choose a kernel source");
			quickPick.busy = true;
			quickPick.buttons = [this._quickInputService.backButton];
			quickPick.show();

			disposables.add(quickPick.onDidTriggerButton(button => {
				if (button === this._quickInputService.backButton) {
					resolve(button);
				}
			}));
			disposables.add(quickPick.onDidTriggerItemButton(async (e) => {
				if (isKernelSourceQuickPickItem(e.item) && e.item.documentation !== undefined) {
					const uri = URI.isUri(e.item.documentation) ? URI.parse(e.item.documentation) : await this._commandService.executeCommand<URI>(e.item.documentation);
					if (uri) {
						void this._openerService.open(uri, { openExternal: true });
					}
				}
			}));
			disposables.add(quickPick.onDidAccept(async () => {
				resolve(quickPick.selectedItems[0]);
			}));
			disposables.add(quickPick.onDidHide(() => {
				resolve(undefined);
			}));

			this._calculdateKernelSources(editor).then(quickPickItems => {
				quickPick.items = quickPickItems;
				if (quickPick.items.length > 0) {
					quickPick.busy = false;
				}
			});

			disposables.add(Event.debounce<void, void>(
				Event.any(
					this._notebookKernelService.onDidChangeSourceActions,
					this._notebookKernelService.onDidAddKernel,
					this._notebookKernelService.onDidRemoveKernel
				),
				(last, _current) => last,
				KERNEL_PICKER_UPDATE_DEBOUNCE
			)(async () => {
				quickPick.busy = true;
				const quickPickItems = await this._calculdateKernelSources(editor);
				quickPick.items = quickPickItems;
				quickPick.busy = false;
			}));
		});

		quickPick.hide();
		disposables.dispose();

		if (quickPickItem === this._quickInputService.backButton) {
			return this.showQuickPick(editor, undefined, true);
		}

		if (quickPickItem) {
			const selectedKernelPickItem = quickPickItem as KernelQuickPickItem;
			if (isKernelSourceQuickPickItem(selectedKernelPickItem)) {
				try {
					const selectedKernelId = await this._executeCommand<string>(notebook, selectedKernelPickItem.command);
					if (selectedKernelId) {
						const { all } = await this._getMatchingResult(notebook);
						const kernel = all.find(kernel => kernel.id === `ms-toolsai.jupyter/${selectedKernelId}`);
						if (kernel) {
							await this._selecteKernel(notebook, kernel);
							return true;
						}
						return true;
					} else {
						return this.displaySelectAnotherQuickPick(editor, false);
					}
				} catch (ex) {
					return false;
				}
			} else if (isKernelPick(selectedKernelPickItem)) {
				await this._selecteKernel(notebook, selectedKernelPickItem.kernel);
				return true;
			} else if (isGroupedKernelsPick(selectedKernelPickItem)) {
				await this._selectOneKernel(notebook, selectedKernelPickItem.label, selectedKernelPickItem.kernels);
				return true;
			} else if (isSourcePick(selectedKernelPickItem)) {
				// selected explicilty, it should trigger the execution?
				try {
					await selectedKernelPickItem.action.runAction();
					return true;
				} catch (ex) {
					return false;
				}
			} else if (isSearchMarketplacePick(selectedKernelPickItem)) {
				await this._showKernelExtension(
					this._extensionWorkbenchService,
					this._extensionService,
					this._extensionManagementServerService,
					editor.textModel.viewType,
					[]
				);
				return true;
			} else if (isInstallExtensionPick(selectedKernelPickItem)) {
				await this._showKernelExtension(
					this._extensionWorkbenchService,
					this._extensionService,
					this._extensionManagementServerService,
					editor.textModel.viewType,
					selectedKernelPickItem.extensionIds,
					this._productService.quality !== 'stable'
				);
				return this.displaySelectAnotherQuickPick(editor, false);
			}
		}

		return false;
	}

	private async _calculdateKernelSources(editor: IActiveNotebookEditor) {
		const notebook: NotebookTextModel = editor.textModel;

		const sourceActionCommands = this._notebookKernelService.getSourceActions(notebook, editor.scopedContextKeyService);
		const actions = await this._notebookKernelService.getKernelSourceActions2(notebook);
		const matchResult = this._getMatchingResult(notebook);

		if (sourceActionCommands.length === 0 && matchResult.all.length === 0 && actions.length === 0) {
			return await this._getKernelRecommendationsQuickPickItems(notebook, this._extensionWorkbenchService) ?? [];
		}

		const others = matchResult.all.filter(item => item.extension.value !== JUPYTER_EXTENSION_ID);
		const quickPickItems: QuickPickInput<KernelQuickPickItem>[] = [];

		// group controllers by extension
		for (const group of groupBy(others, (a, b) => a.extension.value === b.extension.value ? 0 : 1)) {
			const extension = this._extensionService.extensions.find(extension => extension.identifier.value === group[0].extension.value);
			const source = extension?.displayName ?? extension?.description ?? group[0].extension.value;
			if (group.length > 1) {
				quickPickItems.push({
					label: source,
					kernels: group
				});
			} else {
				quickPickItems.push({
					label: group[0].label,
					kernel: group[0]
				});
			}
		}

		const validActions = actions.filter(action => action.command);

		quickPickItems.push(...validActions.map(action => {
			const buttons = action.documentation ? [{
				iconClass: ThemeIcon.asClassName(Codicon.info),
				tooltip: localize('learnMoreTooltip', 'Learn More'),
			}] : [];
			return {
				id: typeof action.command! === 'string' ? action.command : action.command!.id,
				label: action.label,
				description: action.description,
				command: action.command,
				documentation: action.documentation,
				buttons
			};
		}));

		for (const sourceAction of sourceActionCommands) {
			const res: SourcePick = {
				action: sourceAction,
				picked: false,
				label: sourceAction.action.label,
				tooltip: sourceAction.action.tooltip
			};

			quickPickItems.push(res);
		}

		return quickPickItems;
	}

	private async _selectOneKernel(notebook: NotebookTextModel, source: string, kernels: INotebookKernel[]) {
		const quickPickItems: QuickPickInput<KernelPick>[] = kernels.map(kernel => toKernelQuickPick(kernel, undefined));
		const localDisposableStore = new DisposableStore();
		const quickPick = localDisposableStore.add(this._quickInputService.createQuickPick<KernelQuickPickItem>({ useSeparators: true }));
		quickPick.items = quickPickItems;
		quickPick.canSelectMany = false;

		quickPick.title = localize('selectKernelFromExtension', "Select Kernel from {0}", source);

		localDisposableStore.add(quickPick.onDidAccept(async () => {
			if (quickPick.selectedItems && quickPick.selectedItems.length > 0 && isKernelPick(quickPick.selectedItems[0])) {
				await this._selecteKernel(notebook, quickPick.selectedItems[0].kernel);
			}

			quickPick.hide();
			quickPick.dispose();
		}));

		localDisposableStore.add(quickPick.onDidHide(() => {
			localDisposableStore.dispose();
		}));

		quickPick.show();
	}

	private async _executeCommand<T>(notebook: NotebookTextModel, command: string | Command): Promise<T | undefined | void> {
		const id = typeof command === 'string' ? command : command.id;
		const args = typeof command === 'string' ? [] : command.arguments ?? [];

		if (typeof command === 'string' || !command.arguments || !Array.isArray(command.arguments) || command.arguments.length === 0) {
			args.unshift({
				uri: notebook.uri,
				$mid: MarshalledId.NotebookActionContext
			});
		}

		if (typeof command === 'string') {
			return this._commandService.executeCommand(id);
		} else {
			return this._commandService.executeCommand(id, ...args);
		}
	}

	static updateKernelStatusAction(notebook: NotebookTextModel, action: IAction, notebookKernelService: INotebookKernelService, notebookKernelHistoryService: INotebookKernelHistoryService) {
		const detectionTasks = notebookKernelService.getKernelDetectionTasks(notebook);
		if (detectionTasks.length) {
			const info = notebookKernelService.getMatchingKernel(notebook);
			action.enabled = true;
			action.class = ThemeIcon.asClassName(ThemeIcon.modify(executingStateIcon, 'spin'));

			if (info.selected) {
				action.label = info.selected.label;
				const kernelInfo = info.selected.description ?? info.selected.detail;
				action.tooltip = kernelInfo
					? localize('kernels.selectedKernelAndKernelDetectionRunning', "Selected Kernel: {0} (Kernel Detection Tasks Running)", kernelInfo)
					: localize('kernels.detecting', "Detecting Kernels");
			} else {
				action.label = localize('kernels.detecting', "Detecting Kernels");
			}
			return;
		}

		const runningActions = notebookKernelService.getRunningSourceActions(notebook);

		const updateActionFromSourceAction = (sourceAction: ISourceAction, running: boolean) => {
			const sAction = sourceAction.action;
			action.class = running ? ThemeIcon.asClassName(ThemeIcon.modify(executingStateIcon, 'spin')) : ThemeIcon.asClassName(selectKernelIcon);
			action.label = sAction.label;
			action.enabled = true;
		};

		if (runningActions.length) {
			return updateActionFromSourceAction(runningActions[0] /** TODO handle multiple actions state */, true);
		}

		const { selected } = notebookKernelHistoryService.getKernels(notebook);

		if (selected) {
			action.label = selected.label;
			action.class = ThemeIcon.asClassName(selectKernelIcon);
			action.tooltip = selected.description ?? selected.detail ?? '';
		} else {
			action.label = localize('select', "Select Kernel");
			action.class = ThemeIcon.asClassName(selectKernelIcon);
			action.tooltip = '';
		}
	}

	static async resolveKernel(notebook: INotebookTextModel, notebookKernelService: INotebookKernelService, notebookKernelHistoryService: INotebookKernelHistoryService, commandService: ICommandService): Promise<INotebookKernel | undefined> {
		const alreadySelected = notebookKernelHistoryService.getKernels(notebook);

		if (alreadySelected.selected) {
			return alreadySelected.selected;
		}

		await commandService.executeCommand(SELECT_KERNEL_ID);
		const { selected } = notebookKernelHistoryService.getKernels(notebook);
		return selected;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewParts/notebookKernelView.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewParts/notebookKernelView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ActionViewItem, IActionViewItemOptions } from '../../../../../base/browser/ui/actionbar/actionViewItems.js';
import { Action, IAction } from '../../../../../base/common/actions.js';
import { Event } from '../../../../../base/common/event.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { NOTEBOOK_ACTIONS_CATEGORY, SELECT_KERNEL_ID } from '../controller/coreActions.js';
import { getNotebookEditorFromEditorPane, INotebookEditor } from '../notebookBrowser.js';
import { selectKernelIcon } from '../notebookIcons.js';
import { KernelPickerMRUStrategy, KernelQuickPickContext } from './notebookKernelQuickPickStrategy.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { NOTEBOOK_IS_ACTIVE_EDITOR, NOTEBOOK_KERNEL_COUNT } from '../../common/notebookContextKeys.js';
import { INotebookKernel, INotebookKernelHistoryService, INotebookKernelService } from '../../common/notebookKernelService.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';

function getEditorFromContext(editorService: IEditorService, context?: KernelQuickPickContext): INotebookEditor | undefined {
	let editor: INotebookEditor | undefined;
	if (context !== undefined && 'notebookEditorId' in context) {
		const editorId = context.notebookEditorId;
		const matchingEditor = editorService.visibleEditorPanes.find((editorPane) => {
			const notebookEditor = getNotebookEditorFromEditorPane(editorPane);
			return notebookEditor?.getId() === editorId;
		});
		editor = getNotebookEditorFromEditorPane(matchingEditor);
	} else if (context !== undefined && 'notebookEditor' in context) {
		editor = context?.notebookEditor;
	} else {
		editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);
	}

	return editor;
}

function shouldSkip(
	selected: INotebookKernel | undefined,
	controllerId: string | undefined,
	extensionId: string | undefined,
	context: KernelQuickPickContext | undefined): boolean {

	return !!(selected && (
		(context && 'skipIfAlreadySelected' in context && context.skipIfAlreadySelected) ||
		// target kernel is already selected
		(controllerId && selected.id === controllerId && ExtensionIdentifier.equals(selected.extension, extensionId))
	));
}

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: SELECT_KERNEL_ID,
			category: NOTEBOOK_ACTIONS_CATEGORY,
			title: localize2('notebookActions.selectKernel', 'Select Notebook Kernel'),
			icon: selectKernelIcon,
			f1: true,
			precondition: NOTEBOOK_IS_ACTIVE_EDITOR,
			menu: [{
				id: MenuId.EditorTitle,
				when: ContextKeyExpr.and(
					NOTEBOOK_IS_ACTIVE_EDITOR,
					ContextKeyExpr.notEquals('config.notebook.globalToolbar', true)
				),
				group: 'navigation',
				order: -10
			}, {
				id: MenuId.NotebookToolbar,
				when: ContextKeyExpr.equals('config.notebook.globalToolbar', true),
				group: 'status',
				order: -10
			}, {
				id: MenuId.InteractiveToolbar,
				when: NOTEBOOK_KERNEL_COUNT.notEqualsTo(0),
				group: 'status',
				order: -10
			}],
			metadata: {
				description: localize('notebookActions.selectKernel.args', "Notebook Kernel Args"),
				args: [
					{
						name: 'kernelInfo',
						description: 'The kernel info',
						schema: {
							'type': 'object',
							'required': ['id', 'extension'],
							'properties': {
								'id': {
									'type': 'string'
								},
								'extension': {
									'type': 'string'
								},
								'notebookEditorId': {
									'type': 'string'
								}
							}
						}
					}
				]
			},
		});
	}

	async run(accessor: ServicesAccessor, context?: KernelQuickPickContext): Promise<boolean> {
		const instantiationService = accessor.get(IInstantiationService);
		const editorService = accessor.get(IEditorService);

		const editor = getEditorFromContext(editorService, context);

		if (!editor || !editor.hasModel()) {
			return false;
		}

		let controllerId = context && 'id' in context ? context.id : undefined;
		let extensionId = context && 'extension' in context ? context.extension : undefined;

		if (controllerId && (typeof controllerId !== 'string' || typeof extensionId !== 'string')) {
			// validate context: id & extension MUST be strings
			controllerId = undefined;
			extensionId = undefined;
		}

		const notebook = editor.textModel;
		const notebookKernelService = accessor.get(INotebookKernelService);
		const { selected } = notebookKernelService.getMatchingKernel(notebook);

		if (shouldSkip(selected, controllerId, extensionId, context)) {
			return true;
		}

		const wantedKernelId = controllerId ? `${extensionId}/${controllerId}` : undefined;
		const strategy = instantiationService.createInstance(KernelPickerMRUStrategy);
		return strategy.showQuickPick(editor, wantedKernelId);
	}
});

export class NotebooKernelActionViewItem extends ActionViewItem {

	private _kernelLabel?: HTMLAnchorElement;

	constructor(
		actualAction: IAction,
		private readonly _editor: { onDidChangeModel: Event<void>; textModel: NotebookTextModel | undefined; scopedContextKeyService?: IContextKeyService } | INotebookEditor,
		options: IActionViewItemOptions,
		@INotebookKernelService private readonly _notebookKernelService: INotebookKernelService,
		@INotebookKernelHistoryService private readonly _notebookKernelHistoryService: INotebookKernelHistoryService,
	) {
		const action = new Action('fakeAction', undefined, ThemeIcon.asClassName(selectKernelIcon), true, (event) => actualAction.run(event));
		super(
			undefined,
			action,
			{ ...options, label: false, icon: true }
		);
		this._register(action);
		this._register(_editor.onDidChangeModel(this._update, this));
		this._register(_notebookKernelService.onDidAddKernel(this._update, this));
		this._register(_notebookKernelService.onDidRemoveKernel(this._update, this));
		this._register(_notebookKernelService.onDidChangeNotebookAffinity(this._update, this));
		this._register(_notebookKernelService.onDidChangeSelectedNotebooks(this._update, this));
		this._register(_notebookKernelService.onDidChangeSourceActions(this._update, this));
		this._register(_notebookKernelService.onDidChangeKernelDetectionTasks(this._update, this));
	}

	override render(container: HTMLElement): void {
		this._update();
		super.render(container);
		container.classList.add('kernel-action-view-item');
		this._kernelLabel = document.createElement('a');
		container.appendChild(this._kernelLabel);
		this.updateLabel();
	}

	protected override updateLabel() {
		if (this._kernelLabel) {
			this._kernelLabel.classList.add('kernel-label');
			this._kernelLabel.innerText = this._action.label;
		}
	}

	protected _update(): void {
		const notebook = this._editor.textModel;

		if (!notebook) {
			this._resetAction();
			return;
		}

		KernelPickerMRUStrategy.updateKernelStatusAction(notebook, this._action, this._notebookKernelService, this._notebookKernelHistoryService);

		this.updateClass();
	}

	private _resetAction(): void {
		this._action.enabled = false;
		this._action.label = '';
		this._action.class = '';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewParts/notebookOverviewRuler.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewParts/notebookOverviewRuler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getWindow } from '../../../../../base/browser/dom.js';
import { createFastDomNode, FastDomNode } from '../../../../../base/browser/fastDomNode.js';
import { PixelRatio } from '../../../../../base/browser/pixelRatio.js';
import { IThemeService, Themable } from '../../../../../platform/theme/common/themeService.js';
import { INotebookEditorDelegate, NotebookOverviewRulerLane } from '../notebookBrowser.js';

export class NotebookOverviewRuler extends Themable {
	private readonly _domNode: FastDomNode<HTMLCanvasElement>;
	private _lanes = 3;

	constructor(readonly notebookEditor: INotebookEditorDelegate, container: HTMLElement, @IThemeService themeService: IThemeService) {
		super(themeService);
		this._domNode = createFastDomNode(document.createElement('canvas'));
		this._domNode.setPosition('relative');
		this._domNode.setLayerHinting(true);
		this._domNode.setContain('strict');

		container.appendChild(this._domNode.domNode);

		this._register(notebookEditor.onDidChangeDecorations(() => {
			this.layout();
		}));

		this._register(PixelRatio.getInstance(getWindow(this._domNode.domNode)).onDidChange(() => {
			this.layout();
		}));
	}

	layout() {
		const width = 10;
		const layoutInfo = this.notebookEditor.getLayoutInfo();
		const scrollHeight = layoutInfo.scrollHeight;
		const height = layoutInfo.height;
		const ratio = PixelRatio.getInstance(getWindow(this._domNode.domNode)).value;
		this._domNode.setWidth(width);
		this._domNode.setHeight(height);
		this._domNode.domNode.width = width * ratio;
		this._domNode.domNode.height = height * ratio;
		const ctx = this._domNode.domNode.getContext('2d')!;
		ctx.clearRect(0, 0, width * ratio, height * ratio);
		this._render(ctx, width * ratio, height * ratio, scrollHeight * ratio, ratio);
	}

	private _render(ctx: CanvasRenderingContext2D, width: number, height: number, scrollHeight: number, ratio: number) {
		const viewModel = this.notebookEditor.getViewModel();
		const fontInfo = this.notebookEditor.getLayoutInfo().fontInfo;
		const laneWidth = width / this._lanes;

		let currentFrom = 0;

		if (viewModel) {
			for (let i = 0; i < viewModel.viewCells.length; i++) {
				const viewCell = viewModel.viewCells[i];
				const textBuffer = viewCell.textBuffer;
				const decorations = viewCell.getCellDecorations();
				const cellHeight = (viewCell.layoutInfo.totalHeight / scrollHeight) * ratio * height;

				decorations.filter(decoration => decoration.overviewRuler).forEach(decoration => {
					const overviewRuler = decoration.overviewRuler!;
					const fillStyle = this.getColor(overviewRuler.color) ?? '#000000';
					const lineHeight = Math.min(fontInfo.lineHeight, (viewCell.layoutInfo.editorHeight / scrollHeight / textBuffer.getLineCount()) * ratio * height);
					const lineNumbers = overviewRuler.modelRanges.map(range => range.startLineNumber).reduce((previous: number[], current: number) => {
						if (previous.length === 0) {
							previous.push(current);
						} else {
							const last = previous[previous.length - 1];
							if (last !== current) {
								previous.push(current);
							}
						}

						return previous;
					}, [] as number[]);

					let x = 0;
					switch (overviewRuler.position) {
						case NotebookOverviewRulerLane.Left:
							x = 0;
							break;
						case NotebookOverviewRulerLane.Center:
							x = laneWidth;
							break;
						case NotebookOverviewRulerLane.Right:
							x = laneWidth * 2;
							break;
						default:
							break;
					}

					const width = overviewRuler.position === NotebookOverviewRulerLane.Full ? laneWidth * 3 : laneWidth;

					for (let i = 0; i < lineNumbers.length; i++) {
						ctx.fillStyle = fillStyle;
						const lineNumber = lineNumbers[i];
						const offset = (lineNumber - 1) * lineHeight;
						ctx.fillRect(x, currentFrom + offset, width, lineHeight);
					}

					if (overviewRuler.includeOutput) {
						ctx.fillStyle = fillStyle;
						const outputOffset = (viewCell.layoutInfo.editorHeight / scrollHeight) * ratio * height;
						const decorationHeight = (fontInfo.lineHeight / scrollHeight) * ratio * height;
						ctx.fillRect(laneWidth, currentFrom + outputOffset, laneWidth, decorationHeight);
					}
				});

				currentFrom += cellHeight;
			}

			const overviewRulerDecorations = viewModel.getOverviewRulerDecorations();

			for (let i = 0; i < overviewRulerDecorations.length; i++) {
				const decoration = overviewRulerDecorations[i];
				if (!decoration.options.overviewRuler) {
					continue;
				}
				const viewZoneInfo = this.notebookEditor.getViewZoneLayoutInfo(decoration.viewZoneId);

				if (!viewZoneInfo) {
					continue;
				}

				const fillStyle = this.getColor(decoration.options.overviewRuler.color) ?? '#000000';
				let x = 0;
				switch (decoration.options.overviewRuler.position) {
					case NotebookOverviewRulerLane.Left:
						x = 0;
						break;
					case NotebookOverviewRulerLane.Center:
						x = laneWidth;
						break;
					case NotebookOverviewRulerLane.Right:
						x = laneWidth * 2;
						break;
					default:
						break;
				}

				const width = decoration.options.overviewRuler.position === NotebookOverviewRulerLane.Full ? laneWidth * 3 : laneWidth;

				ctx.fillStyle = fillStyle;

				const viewZoneHeight = (viewZoneInfo.height / scrollHeight) * ratio * height;
				const viewZoneTop = (viewZoneInfo.top / scrollHeight) * ratio * height;

				ctx.fillRect(x, viewZoneTop, width, viewZoneHeight);
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/viewParts/notebookTopCellToolbar.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/viewParts/notebookTopCellToolbar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../base/browser/dom.js';
import { Disposable, DisposableStore, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { HiddenItemStrategy, MenuWorkbenchToolBar } from '../../../../../platform/actions/browser/toolbar.js';
import { IMenuService, MenuItemAction } from '../../../../../platform/actions/common/actions.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { INotebookActionContext } from '../controller/coreActions.js';
import { INotebookEditorDelegate } from '../notebookBrowser.js';
import { NotebookOptions } from '../notebookOptions.js';
import { CodiconActionViewItem } from '../view/cellParts/cellActionView.js';

export class ListTopCellToolbar extends Disposable {
	private readonly topCellToolbarContainer: HTMLElement;
	private topCellToolbar: HTMLElement;
	private readonly viewZone: MutableDisposable<DisposableStore> = this._register(new MutableDisposable());
	private readonly _modelDisposables = this._register(new DisposableStore());
	constructor(
		protected readonly notebookEditor: INotebookEditorDelegate,
		private readonly notebookOptions: NotebookOptions,
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
		@IContextMenuService protected readonly contextMenuService: IContextMenuService,
		@IMenuService protected readonly menuService: IMenuService
	) {
		super();

		this.topCellToolbarContainer = DOM.$('div');
		this.topCellToolbar = DOM.$('.cell-list-top-cell-toolbar-container');
		this.topCellToolbarContainer.appendChild(this.topCellToolbar);

		this._register(this.notebookEditor.onDidAttachViewModel(() => {
			this.updateTopToolbar();
		}));

		this._register(this.notebookOptions.onDidChangeOptions(e => {
			if (e.insertToolbarAlignment || e.insertToolbarPosition || e.cellToolbarLocation) {
				this.updateTopToolbar();
			}
		}));
	}

	private updateTopToolbar() {
		const layoutInfo = this.notebookOptions.getLayoutConfiguration();
		this.viewZone.value = new DisposableStore();

		if (layoutInfo.insertToolbarPosition === 'hidden' || layoutInfo.insertToolbarPosition === 'notebookToolbar') {
			const height = this.notebookOptions.computeTopInsertToolbarHeight(this.notebookEditor.textModel?.viewType);

			if (height !== 0) {
				// reserve whitespace to avoid overlap with cell toolbar
				this.notebookEditor.changeViewZones(accessor => {
					const id = accessor.addZone({
						afterModelPosition: 0,
						heightInPx: height,
						domNode: DOM.$('div')
					});
					accessor.layoutZone(id);
					this.viewZone.value?.add({
						dispose: () => {
							if (!this.notebookEditor.isDisposed) {
								this.notebookEditor.changeViewZones(accessor => {
									accessor.removeZone(id);
								});
							}
						}
					});
				});
			}
			return;
		}


		this.notebookEditor.changeViewZones(accessor => {
			const height = this.notebookOptions.computeTopInsertToolbarHeight(this.notebookEditor.textModel?.viewType);
			const id = accessor.addZone({
				afterModelPosition: 0,
				heightInPx: height,
				domNode: this.topCellToolbarContainer
			});
			accessor.layoutZone(id);

			this.viewZone.value?.add({
				dispose: () => {
					if (!this.notebookEditor.isDisposed) {
						this.notebookEditor.changeViewZones(accessor => {
							accessor.removeZone(id);
						});
					}
				}
			});

			DOM.clearNode(this.topCellToolbar);

			const toolbar = this.instantiationService.createInstance(MenuWorkbenchToolBar, this.topCellToolbar, this.notebookEditor.creationOptions.menuIds.cellTopInsertToolbar, {
				actionViewItemProvider: (action, options) => {
					if (action instanceof MenuItemAction) {
						const item = this.instantiationService.createInstance(CodiconActionViewItem, action, { hoverDelegate: options.hoverDelegate });
						return item;
					}

					return undefined;
				},
				menuOptions: {
					shouldForwardArgs: true
				},
				toolbarOptions: {
					primaryGroup: (g: string) => /^inline/.test(g),
				},
				hiddenItemStrategy: HiddenItemStrategy.Ignore,
			});

			if (this.notebookEditor.hasModel()) {
				toolbar.context = {
					notebookEditor: this.notebookEditor
				} satisfies INotebookActionContext;
			}

			this.viewZone.value?.add(toolbar);

			// update toolbar container css based on cell list length
			this.viewZone.value?.add(this.notebookEditor.onDidChangeModel(() => {
				this._modelDisposables.clear();

				if (this.notebookEditor.hasModel()) {
					this._modelDisposables.add(this.notebookEditor.onDidChangeViewCells(() => {
						this.updateClass();
					}));

					this.updateClass();
				}
			}));

			this.updateClass();
		});
	}

	private updateClass() {
		if (this.notebookEditor.hasModel() && this.notebookEditor.getLength() === 0) {
			this.topCellToolbar.classList.add('emptyNotebook');
		} else {
			this.topCellToolbar.classList.remove('emptyNotebook');
		}
	}
}
```

--------------------------------------------------------------------------------

````
