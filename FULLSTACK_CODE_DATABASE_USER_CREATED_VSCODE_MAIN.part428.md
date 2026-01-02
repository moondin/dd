---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 428
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 428 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/common/model/notebookTextModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/model/notebookTextModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ISequence, LcsDiff } from '../../../../../base/common/diff/diff.js';
import { Emitter, Event, PauseableEmitter } from '../../../../../base/common/event.js';
import { hash } from '../../../../../base/common/hash.js';
import { Disposable, dispose, IDisposable } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { filter } from '../../../../../base/common/objects.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { hasKey, isDefined } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { FindMatch, ITextModel } from '../../../../../editor/common/model.js';
import { TextModel } from '../../../../../editor/common/model/textModel.js';
import { SearchParams } from '../../../../../editor/common/model/textModelSearch.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { IModelContentChangedEvent } from '../../../../../editor/common/textModelEvents.js';
import { IResourceUndoRedoElement, IUndoRedoElement, IUndoRedoService, IWorkspaceUndoRedoElement, UndoRedoElementType, UndoRedoGroup } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { ILanguageDetectionService } from '../../../../services/languageDetection/common/languageDetectionWorkerService.js';
import { SnapshotContext } from '../../../../services/workingCopy/common/fileWorkingCopy.js';
import { CellEditType, CellUri, diff, ICell, ICellDto2, ICellEditOperation, ICellOutput, INotebookSnapshotOptions, INotebookTextModel, IOutputDto, IOutputItemDto, ISelectionState, NotebookCellDefaultCollapseConfig, NotebookCellExecutionState, NotebookCellInternalMetadata, NotebookCellMetadata, NotebookCellOutputsSplice, NotebookCellsChangeType, NotebookCellTextModelSplice, NotebookData, NotebookDocumentMetadata, NotebookTextModelChangedEvent, NotebookTextModelWillAddRemoveEvent, NullablePartialNotebookCellInternalMetadata, NullablePartialNotebookCellMetadata, TransientOptions } from '../notebookCommon.js';
import { INotebookExecutionStateService } from '../notebookExecutionStateService.js';
import { INotebookLoggingService } from '../notebookLoggingService.js';
import { CellMetadataEdit, MoveCellEdit, SpliceCellsEdit } from './cellEdit.js';
import { NotebookCellOutputTextModel } from './notebookCellOutputTextModel.js';
import { NotebookCellTextModel } from './notebookCellTextModel.js';

class StackOperation implements IWorkspaceUndoRedoElement {
	type: UndoRedoElementType.Workspace;
	tag = 'notebookUndoRedoElement';

	public get code() {
		return this._operations.length === 1 ? this._operations[0].code : 'undoredo.notebooks.stackOperation';
	}

	private _operations: IUndoRedoElement[] = [];
	private _beginSelectionState: ISelectionState | undefined = undefined;
	private _resultSelectionState: ISelectionState | undefined = undefined;
	private _beginAlternativeVersionId: string;
	private _resultAlternativeVersionId: string;
	public get label() {
		return this._operations.length === 1 ? this._operations[0].label : 'edit';
	}

	constructor(
		readonly textModel: NotebookTextModel,
		readonly undoRedoGroup: UndoRedoGroup | undefined,
		private readonly _pauseableEmitter: PauseableEmitter<NotebookTextModelChangedEvent>,
		private readonly _postUndoRedo: (alternativeVersionId: string) => void,
		selectionState: ISelectionState | undefined,
		beginAlternativeVersionId: string
	) {
		this.type = UndoRedoElementType.Workspace;
		this._beginSelectionState = selectionState;
		this._beginAlternativeVersionId = beginAlternativeVersionId;
		this._resultAlternativeVersionId = beginAlternativeVersionId;
	}
	get resources(): readonly URI[] {
		return [this.textModel.uri];
	}

	get isEmpty(): boolean {
		return this._operations.length === 0;
	}

	pushEndState(alternativeVersionId: string, selectionState: ISelectionState | undefined) {
		// https://github.com/microsoft/vscode/issues/207523
		this._resultAlternativeVersionId = alternativeVersionId;
		this._resultSelectionState = selectionState || this._resultSelectionState;
	}

	pushEditOperation(element: IUndoRedoElement, beginSelectionState: ISelectionState | undefined, resultSelectionState: ISelectionState | undefined, alternativeVersionId: string) {
		if (this._operations.length === 0) {
			this._beginSelectionState = this._beginSelectionState ?? beginSelectionState;
		}
		this._operations.push(element);
		this._resultSelectionState = resultSelectionState;
		this._resultAlternativeVersionId = alternativeVersionId;
	}

	async undo(): Promise<void> {
		this._pauseableEmitter.pause();
		try {
			for (let i = this._operations.length - 1; i >= 0; i--) {
				await this._operations[i].undo();
			}
			this._postUndoRedo(this._beginAlternativeVersionId);
			this._pauseableEmitter.fire({
				rawEvents: [],
				synchronous: undefined,
				versionId: this.textModel.versionId,
				endSelectionState: this._beginSelectionState
			});
		} finally {
			this._pauseableEmitter.resume();
		}
	}

	async redo(): Promise<void> {
		this._pauseableEmitter.pause();
		try {
			for (let i = 0; i < this._operations.length; i++) {
				await this._operations[i].redo();
			}
			this._postUndoRedo(this._resultAlternativeVersionId);
			this._pauseableEmitter.fire({
				rawEvents: [],
				synchronous: undefined,
				versionId: this.textModel.versionId,
				endSelectionState: this._resultSelectionState
			});
		} finally {
			this._pauseableEmitter.resume();
		}

	}
}

class NotebookOperationManager {
	private _pendingStackOperation: StackOperation | null = null;
	private _isAppending: boolean = false;
	constructor(
		private readonly _textModel: NotebookTextModel,
		private _undoService: IUndoRedoService,
		private _pauseableEmitter: PauseableEmitter<NotebookTextModelChangedEvent>,
		private _postUndoRedo: (alternativeVersionId: string) => void
	) {
	}

	isUndoStackEmpty(): boolean {
		return this._pendingStackOperation === null || this._pendingStackOperation.isEmpty;
	}

	pushStackElement(alternativeVersionId: string, selectionState: ISelectionState | undefined) {
		if (this._pendingStackOperation && !this._pendingStackOperation.isEmpty) {
			this._pendingStackOperation.pushEndState(alternativeVersionId, selectionState);
			if (!this._isAppending) {
				this._undoService.pushElement(this._pendingStackOperation, this._pendingStackOperation.undoRedoGroup);
			}
		}
		this._isAppending = false;
		this._pendingStackOperation = null;
	}

	private _getOrCreateEditStackElement(beginSelectionState: ISelectionState | undefined, undoRedoGroup: UndoRedoGroup | undefined, alternativeVersionId: string) {
		return this._pendingStackOperation ??= new StackOperation(this._textModel, undoRedoGroup, this._pauseableEmitter, this._postUndoRedo, beginSelectionState, alternativeVersionId || '');
	}

	appendPreviousOperation(): boolean {
		const previous = this._undoService.getLastElement(this._textModel.uri) as StackOperation;
		if (previous && previous.tag === 'notebookUndoRedoElement') {
			this._pendingStackOperation = previous;
			this._isAppending = true;
			return true;
		}
		return false;
	}

	pushEditOperation(element: IUndoRedoElement, beginSelectionState: ISelectionState | undefined, resultSelectionState: ISelectionState | undefined, alternativeVersionId: string, undoRedoGroup: UndoRedoGroup | undefined) {
		const pendingStackOperation = this._getOrCreateEditStackElement(beginSelectionState, undoRedoGroup, alternativeVersionId);
		pendingStackOperation.pushEditOperation(element, beginSelectionState, resultSelectionState, alternativeVersionId);
	}
}

type TransformedEdit = {
	edit: ICellEditOperation;
	cellIndex: number;
	end: number | undefined;
	originalIndex: number;
};

class NotebookEventEmitter extends PauseableEmitter<NotebookTextModelChangedEvent> {
	get isEmpty() {
		return this._eventQueue.isEmpty();
	}

	isDirtyEvent() {
		for (const e of this._eventQueue) {
			for (let i = 0; i < e.rawEvents.length; i++) {
				if (!e.rawEvents[i].transient) {
					return true;
				}
			}
		}

		return false;
	}
}

export class NotebookTextModel extends Disposable implements INotebookTextModel {

	private _isDisposed = false;
	private readonly _onWillDispose: Emitter<void> = this._register(new Emitter<void>());
	private readonly _onWillAddRemoveCells = this._register(new Emitter<NotebookTextModelWillAddRemoveEvent>());
	private readonly _onDidChangeContent = this._register(new Emitter<NotebookTextModelChangedEvent>());
	readonly onWillDispose: Event<void> = this._onWillDispose.event;
	readonly onWillAddRemoveCells = this._onWillAddRemoveCells.event;
	readonly onDidChangeContent = this._onDidChangeContent.event;
	private _cellhandlePool: number = 0;
	private readonly _cellListeners: Map<number, IDisposable> = new Map();
	private _cells: NotebookCellTextModel[] = [];
	private _defaultCollapseConfig: NotebookCellDefaultCollapseConfig | undefined;

	metadata: NotebookDocumentMetadata = {};
	transientOptions: TransientOptions = { transientCellMetadata: {}, transientDocumentMetadata: {}, transientOutputs: false, cellContentMetadata: {} };
	private _versionId = 0;

	/**
	 * This alternative id is only for non-cell-content changes.
	 */
	private _notebookSpecificAlternativeId = 0;

	/**
	 * Unlike, versionId, this can go down (via undo) or go to previous values (via redo)
	 */
	private _alternativeVersionId: string = '1';
	private _operationManager: NotebookOperationManager;
	private _pauseableEmitter: NotebookEventEmitter;

	get length() {
		return this._cells.length;
	}

	get cells(): readonly NotebookCellTextModel[] {
		return this._cells;
	}

	get versionId() {
		return this._versionId;
	}

	get alternativeVersionId(): string {
		return this._alternativeVersionId;
	}

	get notebookType() {
		return this.viewType;
	}

	constructor(
		readonly viewType: string,
		readonly uri: URI,
		cells: ICellDto2[],
		metadata: NotebookDocumentMetadata,
		options: TransientOptions,
		@IUndoRedoService private readonly _undoService: IUndoRedoService,
		@IModelService private readonly _modelService: IModelService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@ILanguageDetectionService private readonly _languageDetectionService: ILanguageDetectionService,
		@INotebookExecutionStateService private readonly _notebookExecutionStateService: INotebookExecutionStateService,
		@INotebookLoggingService private readonly _notebookLoggingService: INotebookLoggingService
	) {
		super();
		this.transientOptions = options;
		this.metadata = metadata;
		this._initialize(cells);

		const maybeUpdateCellTextModel = (textModel: ITextModel) => {
			if (textModel.uri.scheme === Schemas.vscodeNotebookCell && textModel instanceof TextModel) {
				const cellUri = CellUri.parse(textModel.uri);
				if (cellUri && isEqual(cellUri.notebook, this.uri)) {
					const cellIdx = this._getCellIndexByHandle(cellUri.handle);
					if (cellIdx >= 0) {
						const cell = this.cells[cellIdx];
						if (cell) {
							cell.textModel = textModel;
						}
					}
				}
			}
		};
		this._register(_modelService.onModelAdded(e => maybeUpdateCellTextModel(e)));

		this._pauseableEmitter = this._register(new NotebookEventEmitter({
			merge: (events: NotebookTextModelChangedEvent[]) => {
				const first = events[0];

				const rawEvents = first.rawEvents;
				let versionId = first.versionId;
				let endSelectionState = first.endSelectionState;
				let synchronous = first.synchronous;

				for (let i = 1; i < events.length; i++) {
					rawEvents.push(...events[i].rawEvents);
					versionId = events[i].versionId;
					endSelectionState = events[i].endSelectionState !== undefined ? events[i].endSelectionState : endSelectionState;
					synchronous = events[i].synchronous !== undefined ? events[i].synchronous : synchronous;
				}

				return { rawEvents, versionId, endSelectionState, synchronous };
			}
		}));

		this._register(this._pauseableEmitter.event(e => {
			if (e.rawEvents.length) {
				this._onDidChangeContent.fire(e);
			}
		}));

		this._operationManager = new NotebookOperationManager(
			this,
			this._undoService,
			this._pauseableEmitter,
			(alternativeVersionId: string) => {
				this._increaseVersionId(true);
				this._overwriteAlternativeVersionId(alternativeVersionId);
			}
		);

		this._notebookLoggingService.trace('notebookTextModel', `Initialized notebook text model for ${uri.toString()}`);
	}

	setCellCollapseDefault(collapseConfig: NotebookCellDefaultCollapseConfig | undefined) {
		this._defaultCollapseConfig = collapseConfig;
	}

	_initialize(cells: ICellDto2[], triggerDirty?: boolean) {
		this._cells = [];
		this._versionId = 0;
		this._notebookSpecificAlternativeId = 0;

		const mainCells = cells.map(cell => {
			const cellHandle = this._cellhandlePool++;
			const cellUri = CellUri.generate(this.uri, cellHandle);
			return new NotebookCellTextModel(
				cellUri,
				cellHandle,
				cell,
				this.transientOptions,
				this._languageService,
				this._modelService.getCreationOptions(cell.language, cellUri, false).defaultEOL,
				this._defaultCollapseConfig,
				this._languageDetectionService,
				this._notebookLoggingService
			);
		});

		for (let i = 0; i < mainCells.length; i++) {
			const dirtyStateListener = mainCells[i].onDidChangeContent((e) => {
				this._bindCellContentHandler(mainCells[i], e);
			});

			this._cellListeners.set(mainCells[i].handle, dirtyStateListener);
			this._register(mainCells[i]);
		}

		this._cells.splice(0, 0, ...mainCells);
		this._alternativeVersionId = this._generateAlternativeId();

		if (triggerDirty) {
			this._pauseableEmitter.fire({
				rawEvents: [{ kind: NotebookCellsChangeType.Unknown, transient: false }],
				versionId: this.versionId,
				synchronous: true,
				endSelectionState: undefined
			});
		}
	}

	private _bindCellContentHandler(cell: NotebookCellTextModel, e: 'content' | 'language' | 'mime' | { type: 'model'; event: IModelContentChangedEvent }) {
		this._increaseVersionId(e === 'content' || (typeof e === 'object' && e.type === 'model'));
		switch (e) {
			case 'content':
				this._pauseableEmitter.fire({
					rawEvents: [{ kind: NotebookCellsChangeType.ChangeCellContent, index: this._getCellIndexByHandle(cell.handle), transient: false }],
					versionId: this.versionId,
					synchronous: true,
					endSelectionState: undefined
				});
				break;

			case 'language':
				this._pauseableEmitter.fire({
					rawEvents: [{ kind: NotebookCellsChangeType.ChangeCellLanguage, index: this._getCellIndexByHandle(cell.handle), language: cell.language, transient: false }],
					versionId: this.versionId,
					synchronous: true,
					endSelectionState: undefined
				});
				break;

			case 'mime':
				this._pauseableEmitter.fire({
					rawEvents: [{ kind: NotebookCellsChangeType.ChangeCellMime, index: this._getCellIndexByHandle(cell.handle), mime: cell.mime, transient: false }],
					versionId: this.versionId,
					synchronous: true,
					endSelectionState: undefined
				});
				break;

			default:
				if (typeof e === 'object' && e.type === 'model') {
					this._pauseableEmitter.fire({
						rawEvents: [{ kind: NotebookCellsChangeType.ChangeCellContent, index: this._getCellIndexByHandle(cell.handle), transient: false }],
						versionId: this.versionId,
						synchronous: true,
						endSelectionState: undefined
					});
				}
				break;
		}
	}

	private _generateAlternativeId() {
		return `${this._notebookSpecificAlternativeId}_` + this.cells.map(cell => cell.handle + ',' + cell.alternativeId).join(';');
	}

	override dispose() {
		if (this._isDisposed) {
			// NotebookEditorModel can be disposed twice, don't fire onWillDispose again
			return;
		}

		this._isDisposed = true;
		this._onWillDispose.fire();
		this._undoService.removeElements(this.uri);

		dispose(this._cellListeners.values());
		this._cellListeners.clear();

		dispose(this._cells);
		this._cells = [];
		super.dispose();
	}

	pushStackElement() {
		// https://github.com/microsoft/vscode/issues/207523
	}

	private _getCellIndexByHandle(handle: number) {
		return this.cells.findIndex(c => c.handle === handle);
	}

	private _getCellIndexWithOutputIdHandleFromEdits(outputId: string, rawEdits: ICellEditOperation[]) {
		const edit = rawEdits.find(e => hasKey(e, { outputs: true }) && e.outputs.some(o => o.outputId === outputId));
		if (edit) {
			if (hasKey(edit, { index: true })) {
				return edit.index;
			} else if (hasKey(edit, { handle: true })) {
				const cellIndex = this._getCellIndexByHandle(edit.handle);
				this._assertIndex(cellIndex);
				return cellIndex;
			}
		}

		return -1;
	}

	private _getCellIndexWithOutputIdHandle(outputId: string) {
		return this.cells.findIndex(c => !!c.outputs.find(o => o.outputId === outputId));
	}

	reset(cells: ICellDto2[], metadata: NotebookDocumentMetadata, transientOptions: TransientOptions): void {
		this.transientOptions = transientOptions;
		const executions = this._notebookExecutionStateService.getCellExecutionsForNotebook(this.uri);
		const executingCellHandles = executions.filter(exe => exe.state === NotebookCellExecutionState.Executing).map(exe => exe.cellHandle);
		const edits = NotebookTextModel.computeEdits(this, cells, executingCellHandles);

		this.applyEdits(
			[
				...edits,
				{ editType: CellEditType.DocumentMetadata, metadata }
			],
			true,
			undefined, () => undefined,
			undefined,
			false
		);
	}

	createSnapshot(options: INotebookSnapshotOptions): NotebookData {
		const transientOptions = options.transientOptions ?? this.transientOptions;
		const data: NotebookData = {
			metadata: filter(this.metadata, key => !transientOptions.transientDocumentMetadata[key]),
			cells: [],
		};

		let outputSize = 0;
		for (const cell of this.cells) {
			const cellData: ICellDto2 = {
				cellKind: cell.cellKind,
				language: cell.language,
				mime: cell.mime,
				source: cell.getValue(),
				outputs: [],
				internalMetadata: cell.internalMetadata
			};

			if (options.context === SnapshotContext.Backup && options.outputSizeLimit > 0) {
				cell.outputs.forEach(output => {
					output.outputs.forEach(item => {
						outputSize += item.data.byteLength;
					});
				});
				if (outputSize > options.outputSizeLimit) {
					throw new Error('Notebook too large to backup');
				}
			}

			cellData.outputs = !transientOptions.transientOutputs ? cell.outputs : [];
			cellData.metadata = filter(cell.metadata, key => !transientOptions.transientCellMetadata[key]);

			data.cells.push(cellData);
		}

		return data;
	}

	restoreSnapshot(snapshot: NotebookData, transientOptions?: TransientOptions): void {
		this.reset(snapshot.cells, snapshot.metadata, transientOptions ?? this.transientOptions);
	}

	static computeEdits(model: NotebookTextModel, cells: ICellDto2[], executingHandles: number[] = []): ICellEditOperation[] {
		const edits: ICellEditOperation[] = [];
		const isExecuting = (cell: NotebookCellTextModel) => executingHandles.includes(cell.handle);

		const commonPrefix = this._commonPrefix(model.cells, model.cells.length, 0, cells, cells.length, 0, isExecuting);

		if (commonPrefix > 0) {
			for (let i = 0; i < commonPrefix; i++) {
				edits.push(
					{
						editType: CellEditType.Metadata,
						index: i,
						metadata: cells[i].metadata ?? {}
					},
					...this._computeOutputEdit(i, model.cells[i].outputs, cells[i].outputs)
				);
			}
		}

		if (model.cells.length === cells.length && commonPrefix === model.cells.length) {
			return edits;
		}

		const commonSuffix = this._commonSuffix(model.cells, model.cells.length - commonPrefix, commonPrefix, cells, cells.length - commonPrefix, commonPrefix, isExecuting);

		if (commonSuffix > 0) {
			edits.push({ editType: CellEditType.Replace, index: commonPrefix, count: model.cells.length - commonPrefix - commonSuffix, cells: cells.slice(commonPrefix, cells.length - commonSuffix) });
		} else if (commonPrefix > 0) {
			edits.push({ editType: CellEditType.Replace, index: commonPrefix, count: model.cells.length - commonPrefix, cells: cells.slice(commonPrefix) });
		} else {
			edits.push({ editType: CellEditType.Replace, index: 0, count: model.cells.length, cells });
		}

		if (commonSuffix > 0) {
			// has same suffix
			for (let i = commonSuffix; i > 0; i--) {
				edits.push(
					{
						editType: CellEditType.Metadata,
						index: model.cells.length - i,
						metadata: cells[cells.length - i].metadata ?? {}
					},
					...this._computeOutputEdit(model.cells.length - i, model.cells[model.cells.length - i].outputs, cells[cells.length - i].outputs)
				);
			}
		}

		return edits;
	}

	private static _computeOutputEdit(index: number, a: ICellOutput[], b: IOutputDto[]): ICellEditOperation[] {
		if (a.length !== b.length) {
			return [
				{
					editType: CellEditType.Output,
					index: index,
					outputs: b,
					append: false
				}
			];
		}

		if (a.length === 0) {
			// no output
			return [];
		}

		// same length
		return b.map((output, i) => {
			return {
				editType: CellEditType.OutputItems,
				outputId: a[i].outputId,
				items: output.outputs,
				append: false
			};
		});
	}

	private static _commonPrefix(a: readonly NotebookCellTextModel[], aLen: number, aDelta: number, b: ICellDto2[], bLen: number, bDelta: number, isExecuting: (cell: NotebookCellTextModel) => boolean): number {
		const maxResult = Math.min(aLen, bLen);
		let result = 0;
		for (let i = 0; i < maxResult && a[aDelta + i].fastEqual(b[bDelta + i], isExecuting(a[aDelta + i])); i++) {
			result++;
		}

		return result;
	}

	private static _commonSuffix(a: readonly NotebookCellTextModel[], aLen: number, aDelta: number, b: ICellDto2[], bLen: number, bDelta: number, isExecuting: (cell: NotebookCellTextModel) => boolean): number {
		const maxResult = Math.min(aLen, bLen);
		let result = 0;
		for (let i = 0; i < maxResult && a[aDelta + aLen - i - 1].fastEqual(b[bDelta + bLen - i - 1], isExecuting(a[aDelta + aLen - i - 1])); i++) {
			result++;
		}
		return result;
	}

	private newCellsFromLastEdit = new Set<number>();
	private isOnlyEditingMetadataOnNewCells(rawEdits: ICellEditOperation[]): boolean {
		for (const edit of rawEdits) {
			if (edit.editType === CellEditType.PartialInternalMetadata) {
				continue;
			}
			if (edit.editType !== CellEditType.Metadata && edit.editType !== CellEditType.PartialMetadata) {
				return false;
			}

			if (hasKey(edit, { index: true }) && !this.newCellsFromLastEdit.has(this.cells[edit.index].handle)) {
				return false;
			}
			if (hasKey(edit, { handle: true }) && !this.newCellsFromLastEdit.has(edit.handle)) {
				return false;
			}
		}

		return true;
	}

	applyEdits(rawEdits: ICellEditOperation[], synchronous: boolean, beginSelectionState: ISelectionState | undefined, endSelectionsComputer: () => ISelectionState | undefined, undoRedoGroup: UndoRedoGroup | undefined, computeUndoRedo: boolean): boolean {
		this._notebookLoggingService.trace('textModelEdits', `Begin applying ${rawEdits.length} raw edits`);
		this._pauseableEmitter.pause();
		try {
			this._operationManager.pushStackElement(this._alternativeVersionId, undefined);

			if (computeUndoRedo && this.isOnlyEditingMetadataOnNewCells(rawEdits)) {
				if (!this._operationManager.appendPreviousOperation()) {
					// we can't append the previous operation, so just don't compute undo/redo
					computeUndoRedo = false;
				}
			} else if (computeUndoRedo) {
				this.newCellsFromLastEdit.clear();
			}

			try {
				this._doApplyEdits(rawEdits, synchronous, computeUndoRedo, beginSelectionState, undoRedoGroup);
				return true;
			} catch (err) {
				this._notebookLoggingService.error('textModelEdits', `Error while applying edits: ${err}`);
				throw err;
			} finally {
				if (!this._pauseableEmitter.isEmpty) {
					// Update selection and versionId after applying edits.
					const endSelections = endSelectionsComputer();
					this._increaseVersionId(this._operationManager.isUndoStackEmpty() && !this._pauseableEmitter.isDirtyEvent());

					// Finalize undo element
					this._operationManager.pushStackElement(this._alternativeVersionId, endSelections);

					// Broadcast changes
					this._pauseableEmitter.fire({ rawEvents: [], versionId: this.versionId, synchronous: synchronous, endSelectionState: endSelections });
					this._notebookLoggingService.trace('textModelEdits', `End applying ${rawEdits.length} raw edits`);
				}
			}
		} finally {
			this._pauseableEmitter.resume();
		}
	}

	private _doApplyEdits(rawEdits: ICellEditOperation[], synchronous: boolean, computeUndoRedo: boolean, beginSelectionState: ISelectionState | undefined, undoRedoGroup: UndoRedoGroup | undefined): void {
		const editsWithDetails = rawEdits.map((edit, index) => {
			let cellIndex: number = -1;
			if (hasKey(edit, { index: true })) {
				cellIndex = edit.index;
			} else if (hasKey(edit, { handle: true })) {
				cellIndex = this._getCellIndexByHandle(edit.handle);
				this._assertIndex(cellIndex);
			} else if (hasKey(edit, { outputId: true })) {
				cellIndex = this._getCellIndexWithOutputIdHandle(edit.outputId);
				if (this._indexIsInvalid(cellIndex)) {
					// The referenced output may have been created in this batch of edits
					cellIndex = this._getCellIndexWithOutputIdHandleFromEdits(edit.outputId, rawEdits.slice(0, index));
				}

				if (this._indexIsInvalid(cellIndex)) {
					// It's possible for an edit to refer to an output which was just cleared, ignore it without throwing
					return null;
				}
			} else if (edit.editType !== CellEditType.DocumentMetadata) {
				throw new Error('Invalid cell edit: ' + JSON.stringify(edit));
			}

			return {
				edit,
				cellIndex,
				end:
					(edit.editType === CellEditType.DocumentMetadata)
						? undefined
						: (edit.editType === CellEditType.Replace ? edit.index + edit.count : cellIndex),
				originalIndex: index
			};
		}).filter(isDefined);

		// compress all edits which have no side effects on cell index
		const edits = this._mergeCellEdits(editsWithDetails)
			.sort((a, b) => {
				if (a.end === undefined) {
					return -1;
				}

				if (b.end === undefined) {
					return -1;
				}

				return b.end - a.end || b.originalIndex - a.originalIndex;
			}).reduce((prev, curr) => {
				if (!prev.length) {
					// empty
					prev.push([curr]);
				} else {
					const last = prev[prev.length - 1];
					const index = last[0].cellIndex;

					if (curr.cellIndex === index) {
						last.push(curr);
					} else {
						prev.push([curr]);
					}
				}

				return prev;
			}, [] as TransformedEdit[][]).map(editsOnSameIndex => {
				const replaceEdits: TransformedEdit[] = [];
				const otherEdits: TransformedEdit[] = [];

				editsOnSameIndex.forEach(edit => {
					if (edit.edit.editType === CellEditType.Replace) {
						replaceEdits.push(edit);
					} else {
						otherEdits.push(edit);
					}
				});

				return [...otherEdits.reverse(), ...replaceEdits];
			});

		const flattenEdits = edits.flat();

		for (const { edit, cellIndex } of flattenEdits) {
			switch (edit.editType) {
				case CellEditType.Replace:
					this._replaceCells(edit.index, edit.count, edit.cells, synchronous, computeUndoRedo, beginSelectionState, undoRedoGroup);
					break;
				case CellEditType.Output: {
					this._assertIndex(cellIndex);
					const cell = this._cells[cellIndex];
					if (edit.append) {
						this._spliceNotebookCellOutputs(cell, { start: cell.outputs.length, deleteCount: 0, newOutputs: edit.outputs.map(op => new NotebookCellOutputTextModel(op)) }, true, computeUndoRedo);
					} else {
						this._spliceNotebookCellOutputs2(cell, edit.outputs, computeUndoRedo);
					}
					break;
				}
				case CellEditType.OutputItems:
					{
						this._assertIndex(cellIndex);
						const cell = this._cells[cellIndex];
						if (edit.append) {
							this._appendNotebookCellOutputItems(cell, edit.outputId, edit.items);
						} else {
							this._replaceNotebookCellOutputItems(cell, edit.outputId, edit.items);
						}
					}
					break;

				case CellEditType.Metadata:
					this._assertIndex(edit.index);
					this._changeCellMetadata(this._cells[edit.index], edit.metadata, computeUndoRedo, beginSelectionState, undoRedoGroup);
					break;
				case CellEditType.PartialMetadata:
					this._assertIndex(cellIndex);
					this._changeCellMetadataPartial(this._cells[cellIndex], edit.metadata, computeUndoRedo, beginSelectionState, undoRedoGroup);
					break;
				case CellEditType.PartialInternalMetadata:
					this._assertIndex(cellIndex);
					this._changeCellInternalMetadataPartial(this._cells[cellIndex], edit.internalMetadata);
					break;
				case CellEditType.CellLanguage:
					this._assertIndex(edit.index);
					this._changeCellLanguage(this._cells[edit.index], edit.language, computeUndoRedo, beginSelectionState, undoRedoGroup);
					break;
				case CellEditType.DocumentMetadata:
					this._updateNotebookCellMetadata(edit.metadata, computeUndoRedo, beginSelectionState, undoRedoGroup);
					break;
				case CellEditType.Move:
					this._moveCellToIdx(edit.index, edit.length, edit.newIdx, synchronous, computeUndoRedo, beginSelectionState, undefined, undoRedoGroup);
					break;
			}
		}
	}

	private _mergeCellEdits(rawEdits: TransformedEdit[]): TransformedEdit[] {
		const mergedEdits: TransformedEdit[] = [];

		rawEdits.forEach(edit => {
			if (mergedEdits.length) {
				const last = mergedEdits[mergedEdits.length - 1];

				if (last.edit.editType === CellEditType.Output
					&& last.edit.append
					&& edit.edit.editType === CellEditType.Output
					&& edit.edit.append
					&& last.cellIndex === edit.cellIndex
				) {
					last.edit.outputs = [...last.edit.outputs, ...edit.edit.outputs];
				} else if (last.edit.editType === CellEditType.Output
					&& !last.edit.append // last cell is not append
					&& last.edit.outputs.length === 0 // last cell is clear outputs
					&& edit.edit.editType === CellEditType.Output
					&& edit.edit.append
					&& last.cellIndex === edit.cellIndex
				) {
					last.edit.append = false;
					last.edit.outputs = edit.edit.outputs;
				} else {
					mergedEdits.push(edit);
				}
			} else {
				mergedEdits.push(edit);
			}
		});

		return mergedEdits;
	}

	private _replaceCells(index: number, count: number, cellDtos: ICellDto2[], synchronous: boolean, computeUndoRedo: boolean, beginSelectionState: ISelectionState | undefined, undoRedoGroup: UndoRedoGroup | undefined): void {

		if (count === 0 && cellDtos.length === 0) {
			return;
		}

		const oldViewCells = this._cells.slice(0);
		const oldSet = new Set();
		oldViewCells.forEach(cell => {
			oldSet.add(cell.handle);
		});

		// prepare remove
		for (let i = index; i < Math.min(index + count, this._cells.length); i++) {
			const cell = this._cells[i];
			this._cellListeners.get(cell.handle)?.dispose();
			this._cellListeners.delete(cell.handle);
		}

		// prepare add
		const cells = cellDtos.map(cellDto => {
			const cellHandle = this._cellhandlePool++;
			const cellUri = CellUri.generate(this.uri, cellHandle);
			if (!cellDto.outputs) {
				cellDto.outputs = [];
			}
			const cell = new NotebookCellTextModel(
				cellUri,
				cellHandle,
				cellDto,
				this.transientOptions,
				this._languageService,
				this._modelService.getCreationOptions(cellDto.language, cellUri, false).defaultEOL,
				this._defaultCollapseConfig,
				this._languageDetectionService,
				this._notebookLoggingService
			);
			const textModel = this._modelService.getModel(cellUri);
			if (textModel && textModel instanceof TextModel) {
				cell.textModel = textModel;
				cell.language = cellDto.language;
				cell.textModel.setValue(cellDto.source);
				cell.resetTextBuffer(cell.textModel.getTextBuffer());
			}
			const dirtyStateListener = cell.onDidChangeContent((e) => {
				this._bindCellContentHandler(cell, e);
			});

			this.newCellsFromLastEdit.add(cell.handle);
			this._cellListeners.set(cell.handle, dirtyStateListener);
			this._register(cell);
			return cell;
		});

		// compute change
		const cellsCopy = this._cells.slice(0);
		cellsCopy.splice(index, count, ...cells);
		const diffs = diff(this._cells, cellsCopy, cell => {
			return oldSet.has(cell.handle);
		}).map(diff => {
			return [diff.start, diff.deleteCount, diff.toInsert] as [number, number, NotebookCellTextModel[]];
		});
		this._onWillAddRemoveCells.fire({ rawEvent: { kind: NotebookCellsChangeType.ModelChange, changes: diffs } });

		// make change
		this._cells = cellsCopy;

		const undoDiff = diffs.map(diff => {
			const deletedCells = oldViewCells.slice(diff[0], diff[0] + diff[1]);

			return [diff[0], deletedCells, diff[2]] as [number, NotebookCellTextModel[], NotebookCellTextModel[]];
		});

		if (computeUndoRedo) {
			this._operationManager.pushEditOperation(new SpliceCellsEdit(this.uri, undoDiff, {
				insertCell: (index, cell, endSelections) => { this._insertNewCell(index, [cell], true, endSelections); },
				deleteCell: (index, endSelections) => { this._removeCell(index, 1, true, endSelections); },
				replaceCell: (index, count, cells, endSelections) => { this._replaceNewCells(index, count, cells, true, endSelections); },
			}, undefined, undefined), beginSelectionState, undefined, this._alternativeVersionId, undoRedoGroup);
		}

		// should be deferred
		this._pauseableEmitter.fire({
			rawEvents: [{ kind: NotebookCellsChangeType.ModelChange, changes: diffs, transient: false }],
			versionId: this.versionId,
			synchronous: synchronous,
			endSelectionState: undefined
		});
	}

	private _increaseVersionId(transient: boolean): void {
		this._versionId = this._versionId + 1;
		if (!transient) {
			this._notebookSpecificAlternativeId = this._versionId;
		}
		this._alternativeVersionId = this._generateAlternativeId();
	}

	private _overwriteAlternativeVersionId(newAlternativeVersionId: string): void {
		this._alternativeVersionId = newAlternativeVersionId;
		this._notebookSpecificAlternativeId = Number(newAlternativeVersionId.substring(0, newAlternativeVersionId.indexOf('_')));
	}

	private _updateNotebookCellMetadata(metadata: NotebookDocumentMetadata, computeUndoRedo: boolean, beginSelectionState: ISelectionState | undefined, undoRedoGroup: UndoRedoGroup | undefined) {
		const oldMetadata = this.metadata;
		const triggerDirtyChange = this._isDocumentMetadataChanged(this.metadata, metadata);

		if (triggerDirtyChange) {
			if (computeUndoRedo) {
				const that = this;
				this._operationManager.pushEditOperation(new class implements IResourceUndoRedoElement {
					readonly type: UndoRedoElementType.Resource = UndoRedoElementType.Resource;
					get resource() {
						return that.uri;
					}
					readonly label = 'Update Cell Metadata';
					readonly code = 'undoredo.textBufferEdit';
					undo() {
						that._updateNotebookCellMetadata(oldMetadata, false, beginSelectionState, undoRedoGroup);
					}
					redo() {
						that._updateNotebookCellMetadata(metadata, false, beginSelectionState, undoRedoGroup);
					}
				}(), beginSelectionState, undefined, this._alternativeVersionId, undoRedoGroup);
			}
		}

		this.metadata = metadata;
		this._pauseableEmitter.fire({
			rawEvents: [{ kind: NotebookCellsChangeType.ChangeDocumentMetadata, metadata: this.metadata, transient: !triggerDirtyChange }],
			versionId: this.versionId,
			synchronous: true,
			endSelectionState: undefined
		});
	}

	private _insertNewCell(index: number, cells: NotebookCellTextModel[], synchronous: boolean, endSelections: ISelectionState | undefined): void {
		for (let i = 0; i < cells.length; i++) {
			const dirtyStateListener = cells[i].onDidChangeContent((e) => {
				this._bindCellContentHandler(cells[i], e);
			});

			this._cellListeners.set(cells[i].handle, dirtyStateListener);
		}

		const changes: NotebookCellTextModelSplice<ICell>[] = [[index, 0, cells]];
		this._onWillAddRemoveCells.fire({ rawEvent: { kind: NotebookCellsChangeType.ModelChange, changes } });
		this._cells.splice(index, 0, ...cells);
		this._pauseableEmitter.fire({
			rawEvents: [{ kind: NotebookCellsChangeType.ModelChange, changes, transient: false }],
			versionId: this.versionId,
			synchronous: synchronous,
			endSelectionState: endSelections
		});

		return;
	}

	private _removeCell(index: number, count: number, synchronous: boolean, endSelections: ISelectionState | undefined) {
		for (let i = index; i < index + count; i++) {
			const cell = this._cells[i];
			this._cellListeners.get(cell.handle)?.dispose();
			this._cellListeners.delete(cell.handle);
		}
		const changes: NotebookCellTextModelSplice<ICell>[] = [[index, count, []]];
		this._onWillAddRemoveCells.fire({ rawEvent: { kind: NotebookCellsChangeType.ModelChange, changes } });
		this._cells.splice(index, count);
		this._pauseableEmitter.fire({
			rawEvents: [{ kind: NotebookCellsChangeType.ModelChange, changes, transient: false }],
			versionId: this.versionId,
			synchronous: synchronous,
			endSelectionState: endSelections
		});
	}

	private _replaceNewCells(index: number, count: number, cells: NotebookCellTextModel[], synchronous: boolean, endSelections: ISelectionState | undefined) {
		for (let i = index; i < index + count; i++) {
			const cell = this._cells[i];
			this._cellListeners.get(cell.handle)?.dispose();
			this._cellListeners.delete(cell.handle);
		}

		for (let i = 0; i < cells.length; i++) {
			const dirtyStateListener = cells[i].onDidChangeContent((e) => {
				this._bindCellContentHandler(cells[i], e);
			});

			this._cellListeners.set(cells[i].handle, dirtyStateListener);
		}

		const changes: NotebookCellTextModelSplice<ICell>[] = [[index, count, cells]];
		this._onWillAddRemoveCells.fire({ rawEvent: { kind: NotebookCellsChangeType.ModelChange, changes } });
		this._cells.splice(index, count, ...cells);
		this._pauseableEmitter.fire({
			rawEvents: [{ kind: NotebookCellsChangeType.ModelChange, changes, transient: false }],
			versionId: this.versionId,
			synchronous: synchronous,
			endSelectionState: endSelections
		});
	}

	private _isDocumentMetadataChanged(a: NotebookDocumentMetadata, b: NotebookDocumentMetadata) {
		const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
		for (const key of keys) {
			if (key === 'custom') {
				if (!this._customMetadataEqual(a[key], b[key])
					&&
					!(this.transientOptions.transientDocumentMetadata[key as keyof NotebookDocumentMetadata])
				) {
					return true;
				}
			} else if (
				(a[key as keyof NotebookDocumentMetadata] !== b[key as keyof NotebookDocumentMetadata])
				&&
				!(this.transientOptions.transientDocumentMetadata[key as keyof NotebookDocumentMetadata])
			) {
				return true;
			}
		}

		return false;
	}

	private _isCellMetadataChanged(a: NotebookCellMetadata, b: NotebookCellMetadata) {
		const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
		for (const key of keys) {
			if (
				(a[key as keyof NotebookCellMetadata] !== b[key as keyof NotebookCellMetadata])
				&&
				!(this.transientOptions.transientCellMetadata[key as keyof NotebookCellMetadata])
			) {
				return true;
			}
		}

		return false;
	}

	private _customMetadataEqual(a: any, b: any) {
		if (!a && !b) {
			// both of them are nullish or undefined
			return true;
		}

		if (!a || !b) {
			return false;
		}

		const aProps = Object.getOwnPropertyNames(a);
		const bProps = Object.getOwnPropertyNames(b);

		if (aProps.length !== bProps.length) {
			return false;
		}

		for (let i = 0; i < aProps.length; i++) {
			const propName = aProps[i];
			if (a[propName] !== b[propName]) {
				return false;
			}
		}

		return true;
	}

	private _changeCellMetadataPartial(cell: NotebookCellTextModel, metadata: NullablePartialNotebookCellMetadata, computeUndoRedo: boolean, beginSelectionState: ISelectionState | undefined, undoRedoGroup: UndoRedoGroup | undefined) {
		const newMetadata: NotebookCellMetadata = {
			...cell.metadata
		};
		let k: keyof NullablePartialNotebookCellMetadata;
		for (k in metadata) {
			const value = metadata[k] ?? undefined;
			newMetadata[k] = value;
		}

		return this._changeCellMetadata(cell, newMetadata, computeUndoRedo, beginSelectionState, undoRedoGroup);
	}

	private _changeCellMetadata(cell: NotebookCellTextModel, metadata: NotebookCellMetadata, computeUndoRedo: boolean, beginSelectionState: ISelectionState | undefined, undoRedoGroup: UndoRedoGroup | undefined) {
		const triggerDirtyChange = this._isCellMetadataChanged(cell.metadata, metadata);

		if (triggerDirtyChange) {
			if (computeUndoRedo) {
				const index = this._cells.indexOf(cell);
				this._operationManager.pushEditOperation(new CellMetadataEdit(this.uri, index, Object.freeze(cell.metadata), Object.freeze(metadata), {
					updateCellMetadata: (index, newMetadata) => {
						const cell = this._cells[index];
						if (!cell) {
							return;
						}
						this._changeCellMetadata(cell, newMetadata, false, beginSelectionState, undoRedoGroup);
					}
				}), beginSelectionState, undefined, this._alternativeVersionId, undoRedoGroup);
			}
		}

		// should be deferred
		cell.metadata = metadata;
		this._pauseableEmitter.fire({
			rawEvents: [{ kind: NotebookCellsChangeType.ChangeCellMetadata, index: this._cells.indexOf(cell), metadata: cell.metadata, transient: !triggerDirtyChange }],
			versionId: this.versionId,
			synchronous: true,
			endSelectionState: undefined
		});
	}

	private _changeCellInternalMetadataPartial(cell: NotebookCellTextModel, internalMetadata: NullablePartialNotebookCellInternalMetadata) {
		const newInternalMetadata: NotebookCellInternalMetadata = {
			...cell.internalMetadata
		};
		let k: keyof NotebookCellInternalMetadata;
		for (k in internalMetadata) {
			const value = internalMetadata[k] ?? undefined;
			(newInternalMetadata[k] as unknown) = value;
		}

		cell.internalMetadata = newInternalMetadata;
		this._pauseableEmitter.fire({
			rawEvents: [{ kind: NotebookCellsChangeType.ChangeCellInternalMetadata, index: this._cells.indexOf(cell), internalMetadata: cell.internalMetadata, transient: true }],
			versionId: this.versionId,
			synchronous: true,
			endSelectionState: undefined
		});
	}

	private _changeCellLanguage(cell: NotebookCellTextModel, languageId: string, computeUndoRedo: boolean, beginSelectionState: ISelectionState | undefined, undoRedoGroup: UndoRedoGroup | undefined) {
		if (cell.language === languageId) {
			return;
		}

		const oldLanguage = cell.language;
		cell.language = languageId;

		if (computeUndoRedo) {
			const that = this;
			this._operationManager.pushEditOperation(new class implements IResourceUndoRedoElement {
				readonly type: UndoRedoElementType.Resource = UndoRedoElementType.Resource;
				get resource() {
					return that.uri;
				}
				readonly label = 'Update Cell Language';
				readonly code = 'undoredo.textBufferEdit';
				undo() {
					that._changeCellLanguage(cell, oldLanguage, false, beginSelectionState, undoRedoGroup);
				}
				redo() {
					that._changeCellLanguage(cell, languageId, false, beginSelectionState, undoRedoGroup);
				}
			}(), beginSelectionState, undefined, this._alternativeVersionId, undoRedoGroup);
		}

		this._pauseableEmitter.fire({
			rawEvents: [{ kind: NotebookCellsChangeType.ChangeCellLanguage, index: this._cells.indexOf(cell), language: languageId, transient: false }],
			versionId: this.versionId,
			synchronous: true,
			endSelectionState: undefined
		});
	}

	private _spliceNotebookCellOutputs2(cell: NotebookCellTextModel, outputs: IOutputDto[], computeUndoRedo: boolean): void {
		if (outputs.length === 0 && cell.outputs.length === 0) {
			return;
		}

		if (outputs.length <= 1) {
			this._spliceNotebookCellOutputs(cell, { start: 0, deleteCount: cell.outputs.length, newOutputs: outputs.map(op => new NotebookCellOutputTextModel(op)) }, false, computeUndoRedo);
			return;
		}

		const diff = new LcsDiff(new OutputSequence(cell.outputs), new OutputSequence(outputs));
		const diffResult = diff.ComputeDiff(false);
		const splices: NotebookCellOutputsSplice[] = diffResult.changes.map(change => ({
			start: change.originalStart,
			deleteCount: change.originalLength,
			// create cell output text model only when it's inserted into the notebook document
			newOutputs: outputs.slice(change.modifiedStart, change.modifiedStart + change.modifiedLength).map(op => new NotebookCellOutputTextModel(op))
		}));
		splices.reverse().forEach(splice => {
			this._spliceNotebookCellOutputs(cell, splice, false, computeUndoRedo);
		});
	}

	private _spliceNotebookCellOutputs(cell: NotebookCellTextModel, splice: NotebookCellOutputsSplice, append: boolean, computeUndoRedo: boolean): void {
		cell.spliceNotebookCellOutputs(splice);
		this._pauseableEmitter.fire({
			rawEvents: [{
				kind: NotebookCellsChangeType.Output,
				index: this._cells.indexOf(cell),
				outputs: cell.outputs.map(output => output.asDto()) ?? [],
				append,
				transient: this.transientOptions.transientOutputs,
			}],
			versionId: this.versionId,
			synchronous: true,
			endSelectionState: undefined
		});
	}

	private _appendNotebookCellOutputItems(cell: NotebookCellTextModel, outputId: string, items: IOutputItemDto[]) {
		if (cell.changeOutputItems(outputId, true, items)) {
			this._pauseableEmitter.fire({
				rawEvents: [{
					kind: NotebookCellsChangeType.OutputItem,
					index: this._cells.indexOf(cell),
					outputId: outputId,
					outputItems: items,
					append: true,
					transient: this.transientOptions.transientOutputs

				}],
				versionId: this.versionId,
				synchronous: true,
				endSelectionState: undefined
			});
		}
	}

	private _replaceNotebookCellOutputItems(cell: NotebookCellTextModel, outputId: string, items: IOutputItemDto[]) {
		if (cell.changeOutputItems(outputId, false, items)) {
			this._pauseableEmitter.fire({
				rawEvents: [{
					kind: NotebookCellsChangeType.OutputItem,
					index: this._cells.indexOf(cell),
					outputId: outputId,
					outputItems: items,
					append: false,
					transient: this.transientOptions.transientOutputs

				}],
				versionId: this.versionId,
				synchronous: true,
				endSelectionState: undefined
			});
		}
	}

	private _moveCellToIdx(index: number, length: number, newIdx: number, synchronous: boolean, pushedToUndoStack: boolean, beforeSelections: ISelectionState | undefined, endSelections: ISelectionState | undefined, undoRedoGroup: UndoRedoGroup | undefined): boolean {
		if (pushedToUndoStack) {
			this._operationManager.pushEditOperation(new MoveCellEdit(this.uri, index, length, newIdx, {
				moveCell: (fromIndex: number, length: number, toIndex: number, beforeSelections: ISelectionState | undefined, endSelections: ISelectionState | undefined) => {
					this._moveCellToIdx(fromIndex, length, toIndex, true, false, beforeSelections, endSelections, undoRedoGroup);
				},
			}, beforeSelections, endSelections), beforeSelections, endSelections, this._alternativeVersionId, undoRedoGroup);
		}

		this._assertIndex(index);
		this._assertIndex(newIdx);

		const cells = this._cells.splice(index, length);
		this._cells.splice(newIdx, 0, ...cells);
		this._pauseableEmitter.fire({
			rawEvents: [{ kind: NotebookCellsChangeType.Move, index, length, newIdx, cells, transient: false }],
			versionId: this.versionId,
			synchronous: synchronous,
			endSelectionState: endSelections
		});

		return true;
	}

	private _assertIndex(index: number) {
		if (this._indexIsInvalid(index)) {
			throw new Error(`model index out of range ${index}`);
		}
	}

	private _indexIsInvalid(index: number): boolean {
		return index < 0 || index >= this._cells.length;
	}

	//#region Find
	findNextMatch(searchString: string, searchStart: { cellIndex: number; position: Position }, isRegex: boolean, matchCase: boolean, wordSeparators: string | null, searchEnd?: { cellIndex: number; position: Position }): { cell: NotebookCellTextModel; match: FindMatch } | null {
		// check if search cell index is valid
		this._assertIndex(searchStart.cellIndex);
		const searchParams = new SearchParams(searchString, isRegex, matchCase, wordSeparators);
		const searchData = searchParams.parseSearchRequest();

		if (!searchData) {
			return null;
		}

		let cellIndex = searchStart.cellIndex;
		let searchStartPosition = searchStart.position;

		let searchEndCell = this._cells.length;

		while (cellIndex < searchEndCell) {
			const cell = this._cells[cellIndex];

			// if we have wrapped back to the point of the initial search cell, we search from beginning to the provided searchEnd position
			const wrapFlag = searchEnd && cellIndex === searchEnd.cellIndex && searchStartPosition.isBefore(searchEnd.position);
			const searchRange = new Range(
				searchStartPosition.lineNumber,
				searchStartPosition.column,
				(wrapFlag) ? searchEnd.position.lineNumber : cell.textBuffer.getLineCount(),
				(wrapFlag) ? searchEnd.position.column : cell.textBuffer.getLineMaxColumn(cell.textBuffer.getLineCount())
			);

			const result = cell.textBuffer.findMatchesLineByLine(searchRange, searchData, false, 1);
			if (result.length > 0) {
				return { cell, match: result[0] };
			} else if (wrapFlag) { // this means there are no more valid matches in the notebook
				break;
			}

			// Move to the next cell
			cellIndex++;

			// wrap if a searchEnd is provided and we are past the end of the notebook
			if (searchEnd && cellIndex >= this._cells.length) {
				cellIndex = 0;
				searchEndCell = searchEnd.cellIndex + 1;
			}

			searchStartPosition = new Position(1, 1); // Reset position to start of the next cell
		}

		return null;
	}

	findMatches(searchString: string, isRegex: boolean, matchCase: boolean, wordSeparators: string | null): { cell: NotebookCellTextModel; matches: FindMatch[] }[] {
		const searchParams = new SearchParams(searchString, isRegex, matchCase, wordSeparators);
		const searchData = searchParams.parseSearchRequest();

		if (!searchData) {
			return [];
		}

		const results: { cell: NotebookCellTextModel; matches: FindMatch[] }[] = [];
		for (const cell of this._cells) {
			const searchRange = new Range(1, 1, cell.textBuffer.getLineCount(), cell.textBuffer.getLineMaxColumn(cell.textBuffer.getLineCount()));
			const matches = cell.textBuffer.findMatchesLineByLine(searchRange, searchData, false, 1000);

			if (matches.length > 0) {
				results.push({ cell, matches: matches });
			}
		}

		return results;
	}
	//#endregion
}

class OutputSequence implements ISequence {
	constructor(readonly outputs: IOutputDto[]) {
	}

	getElements(): Int32Array | number[] | string[] {
		return this.outputs.map(output => {
			return hash(output.outputs.map(output => ({
				mime: output.mime,
				data: output.data
			})));
		});
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/services/notebookCellMatching.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/services/notebookCellMatching.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { computeLevenshteinDistance } from '../../../../../base/common/diff/diff.js';
import { CellKind } from '../notebookCommon.js';


type EditCount = number;
type OriginalIndex = number;
type ModifiedIndex = number;
type CellEditCountCache = {
	modifiedToOriginal: Map<ModifiedIndex, Map<OriginalIndex, { editCount: EditCount }>>;
	originalToModified: Map<OriginalIndex, Map<ModifiedIndex, { editCount: EditCount }>>;
};

type ICell = {
	internalMetadata?: {
		internalId?: string;
	};
	getValue(): string;
	getLinesContent(): string[];
	cellKind: CellKind;
};

/**
 * Given a set of modified cells and original cells, this function will attempt to match the modified cells with the original cells.
 * E.g. Assume you have (original on left and modified on right):
 * =================
 * Cell A  | Cell a
 * Cell B  | Cell b
 * Cell C  | Cell d
 * Cell D  | Cell e
 * =================
 * Here we know that `Cell C` has been removed and `Cell e` has been added.
 * The mapping from modified to original will be as follows:
 * Cell a => Cell A
 * Cell b => Cell B
 * Cell d => Cell D
 * Cell e => <Does not match anything in original, hence a new Cell>
 * Cell C in original was not matched, hence it was deleted.
 *
 * Thus the return value is as follows:
 * [
 * { modified: 0, original: 0 },
 * { modified: 1, original: 1 },
 * { modified: 2, original: 3 },
 * { modified: 3, original: -1 },
 * ]
 * @returns
 */
export function matchCellBasedOnSimilarties(modifiedCells: ICell[], originalCells: ICell[]): { modified: number; original: number; percentage: number }[] {
	const cache: CellEditCountCache = {
		modifiedToOriginal: new Map<ModifiedIndex, Map<OriginalIndex, { editCount: EditCount }>>(),
		originalToModified: new Map<OriginalIndex, Map<ModifiedIndex, { editCount: EditCount }>>(),
	};
	const results: { modified: number; original: number; dist: number; percentage: number; possibleOriginal: number }[] = [];
	const mappedOriginalCellToModifiedCell = new Map<number, number>();
	const mappedModifiedIndexes = new Set<number>();
	const originalIndexWithMostEdits = new Map<number, { dist: number; modifiedIndex: number }>();
	const canOriginalIndexBeMappedToModifiedIndex = (originalIndex: number, value: { editCount: EditCount }) => {
		if (mappedOriginalCellToModifiedCell.has(originalIndex)) {
			return false;
		}
		const existingEdits = originalIndexWithMostEdits.get(originalIndex)?.dist ?? Number.MAX_SAFE_INTEGER;
		return value.editCount < existingEdits;
	};
	const trackMappedIndexes = (modifiedIndex: number, originalIndex: number) => {
		mappedOriginalCellToModifiedCell.set(originalIndex, modifiedIndex);
		mappedModifiedIndexes.add(modifiedIndex);
	};

	for (let i = 0; i < modifiedCells.length; i++) {
		const modifiedCell = modifiedCells[i];
		const { index, editCount: dist, percentage } = computeClosestCell({ cell: modifiedCell, index: i }, originalCells, true, cache, canOriginalIndexBeMappedToModifiedIndex);
		if (index >= 0 && dist === 0) {
			trackMappedIndexes(i, index);
			results.push({ modified: i, original: index, dist, percentage, possibleOriginal: index });
		} else {
			originalIndexWithMostEdits.set(index, { dist: dist, modifiedIndex: i });
			results.push({ modified: i, original: -1, dist: dist, percentage, possibleOriginal: index });
		}
	}

	results.forEach((result, i) => {
		if (result.original >= 0) {
			return;
		}

		/**
		 * I.e. Assume you have the following
		 * =================
		 * A a (this has ben matched)
		 * B b <not matched>
		 * C c <not matched>
		 * D d (these two have been matched)
		 * e e
		 * f f
		 * =================
		 * Just match A => a, B => b, C => c
		 */
		// Find the next cell that has been matched.
		const previousMatchedCell = i > 0 ? results.slice(0, i).reverse().find(r => r.original >= 0) : undefined;
		const previousMatchedOriginalIndex = previousMatchedCell?.original ?? -1;
		const previousMatchedModifiedIndex = previousMatchedCell?.modified ?? -1;
		const matchedCell = results.slice(i + 1).find(r => r.original >= 0);
		const unavailableIndexes = new Set<number>();
		const nextMatchedModifiedIndex = results.findIndex((item, idx) => idx > i && item.original >= 0);
		const nextMatchedOriginalIndex = nextMatchedModifiedIndex >= 0 ? results[nextMatchedModifiedIndex].original : -1;
		// Find the available indexes that we can match with.
		// We are only interested in b and c (anything after d is of no use).
		originalCells.forEach((_, i) => {
			if (mappedOriginalCellToModifiedCell.has(i)) {
				unavailableIndexes.add(i);
				return;
			}
			if (matchedCell && i >= matchedCell.original) {
				unavailableIndexes.add(i);
			}
			if (nextMatchedOriginalIndex >= 0 && i > nextMatchedOriginalIndex) {
				unavailableIndexes.add(i);
			}
		});


		const modifiedCell = modifiedCells[i];
		/**
		 * I.e. Assume you have the following
		 * =================
		 * A a (this has ben matched)
		 * B b <not matched because the % of change is too high, but we do have a probable match>
		 * C c <not matched>
		 * D d (these two have been matched)
		 * e e
		 * f f
		 * =================
		 * Given that we have a probable match for B => b, we can match it.
		 */
		if (result.original === -1 && result.possibleOriginal >= 0 && !unavailableIndexes.has(result.possibleOriginal) && canOriginalIndexBeMappedToModifiedIndex(result.possibleOriginal, { editCount: result.dist })) {
			trackMappedIndexes(i, result.possibleOriginal);
			result.original = result.possibleOriginal;
			return;
		}


		/**
		 * I.e. Assume you have the following
		 * =================
		 * A a (this has ben matched)
		 * B b <not matched>
		 * C c <not matched>
		 * D d (these two have been matched)
		 * =================
		 * Its possible that B matches better with c and C matches better with b.
		 * However given the fact that we have matched A => a and D => d.
		 * & if the indexes are an exact match.
		 * I.e. index of D in Modified === index of d in Original, and index of A in Modified === index of a in Original.
		 * Then this means there are absolutely no modifications.
		 * Hence we can just assign the indexes as is.
		 *
		 * NOTE: For this, we must ensure we have exactly the same number of items on either side.
		 * I.e. we have B, C remaining in Modified, and b, c remaining in Original.
		 * Thats 2 Modified items === 2 Original Items.
		 * If its not the same, then this means something has been deleted/inserted, and we cannot blindly map the indexes.
		*/
		if (previousMatchedOriginalIndex > 0 && previousMatchedModifiedIndex > 0 && previousMatchedOriginalIndex === previousMatchedModifiedIndex) {
			if ((nextMatchedModifiedIndex >= 0 ? nextMatchedModifiedIndex : modifiedCells.length - 1) === (nextMatchedOriginalIndex >= 0 ? nextMatchedOriginalIndex : originalCells.length - 1) && !unavailableIndexes.has(i) && i < originalCells.length) {
				const remainingModifiedItems = (nextMatchedModifiedIndex >= 0 ? nextMatchedModifiedIndex : modifiedCells.length) - previousMatchedModifiedIndex;
				const remainingOriginalItems = (nextMatchedOriginalIndex >= 0 ? nextMatchedOriginalIndex : originalCells.length) - previousMatchedOriginalIndex;
				if (remainingModifiedItems === remainingOriginalItems && modifiedCell.cellKind === originalCells[i].cellKind) {
					trackMappedIndexes(i, i);
					result.original = i;
					return;
				}
			}
		}
		/**
		 * I.e. Assume you have the following
		 * =================
		 * A a (this has ben matched)
		 * B b <not matched>
		 * C c <not matched>
		 * D d (these two have been matched)
		 * e e
		 * f f
		 * =================
		 * We can now try to match B with b and c and figure out which is best.
		 * RULE 1. Its possible that B will match best with c, howevber C matches better with c, meaning we should match B with b.
		 * To do this, we need to see if c has a better match with something else.
		*/
		// RULE 1
		// Try to find the next best match, but exclucde items that have a better match.
		const { index, percentage } = computeClosestCell({ cell: modifiedCell, index: i }, originalCells, false, cache, (originalIndex: number, originalValue: { editCount: EditCount }) => {
			if (unavailableIndexes.has(originalIndex)) {
				return false;
			}

			if (nextMatchedModifiedIndex > 0 || previousMatchedOriginalIndex > 0) {
				// See if we have a beter match for this.
				const matchesForThisOriginalIndex = cache.originalToModified.get(originalIndex);
				if (matchesForThisOriginalIndex && previousMatchedOriginalIndex < originalIndex) {
					const betterMatch = Array.from(matchesForThisOriginalIndex).find(([modifiedIndex, value]) => {
						if (modifiedIndex === i) {
							// This is the same modifeid entry.
							return false;
						}
						if (modifiedIndex >= nextMatchedModifiedIndex) {
							// We're only interested in matches that are before the next matched index.
							return false;
						}
						if (mappedModifiedIndexes.has(i)) {
							// This has already been matched.
							return false;
						}
						return value.editCount < originalValue.editCount;
					});
					if (betterMatch) {
						// We do have a better match for this, hence do not use this.
						return false;
					}
				}
			}
			return !unavailableIndexes.has(originalIndex);
		});

		/**
		 * I.e. Assume you have the following
		 * =================
		 * A a (this has ben matched)
		 * B bbbbbbbbbbbbbb <not matched>
		 * C cccccccccccccc <not matched>
		 * D d (these two have been matched)
		 * e e
		 * f f
		 * =================
		 * RULE 1 . Now when attempting to match `bbbbbbbbbbbb` with B, the number of edits is very high and the percentage is also very high.
		 * Basically majority of the text needs to be changed.
		 * However if the indexes line up perfectly well, and this is the best match, then use it.
		*
		 * Similarly its possible we're trying to match b with `BBBBBBBBBBBB` and the number of edits is very high, but the indexes line up perfectly well.
		*
		* RULE 2. However it is also possible that there's a better match with another cell
		* Assume we have
		 * =================
		 * AAAA     a (this has been matched)
		 * bbbbbbbb b <not matched>
		 * bbbb     c <not matched>
		 * dddd     d (these two have been matched)
		 * =================
		 * In this case if we use the algorithm of (1) above, we'll end up matching bbbb with b, and bbbbbbbb with c.
		 * But we're not really sure if this is the best match.
		 * In such cases try to match with the same cell index.
		 *
		*/
		// RULE 1 (got a match and the indexes line up perfectly well, use it regardless of the number of edits).
		if (index >= 0 && i > 0 && results[i - 1].original === index - 1) {
			trackMappedIndexes(i, index);
			results[i].original = index;
			return;
		}

		// RULE 2
		// Here we know that `AAAA => a`
		// Check if the previous cell has been matched.
		// And if the next modified and next original cells are a match.
		const nextOriginalCell = (i > 0 && originalCells.length > results[i - 1].original) ? results[i - 1].original + 1 : -1;
		const nextOriginalCellValue = i > 0 && nextOriginalCell >= 0 && nextOriginalCell < originalCells.length ? originalCells[nextOriginalCell].getValue() : undefined;
		if (index >= 0 && i > 0 && typeof nextOriginalCellValue === 'string' && !mappedOriginalCellToModifiedCell.has(nextOriginalCell)) {
			if (modifiedCell.getValue().includes(nextOriginalCellValue) || nextOriginalCellValue.includes(modifiedCell.getValue())) {
				trackMappedIndexes(i, nextOriginalCell);
				results[i].original = nextOriginalCell;
				return;
			}
		}

		if (percentage < 90 || (i === 0 && results.length === 1)) {
			trackMappedIndexes(i, index);
			results[i].original = index;
			return;
		}
	});

	return results;
}

function computeClosestCell({ cell, index: cellIndex }: { cell: ICell; index: number }, arr: readonly ICell[], ignoreEmptyCells: boolean, cache: CellEditCountCache, canOriginalIndexBeMappedToModifiedIndex: (originalIndex: number, value: { editCount: EditCount }) => boolean): { index: number; editCount: number; percentage: number } {
	let min_edits = Infinity;
	let min_index = -1;

	// Always give preference to internal Cell Id if found.
	const internalId = cell.internalMetadata?.internalId;
	if (internalId) {
		const internalIdIndex = arr.findIndex(cell => cell.internalMetadata?.internalId === internalId);
		if (internalIdIndex >= 0) {
			return { index: internalIdIndex, editCount: 0, percentage: Number.MAX_SAFE_INTEGER };
		}
	}

	for (let i = 0; i < arr.length; i++) {
		// Skip cells that are not of the same kind.
		if (arr[i].cellKind !== cell.cellKind) {
			continue;
		}
		const str = arr[i].getValue();
		const cacheEntry = cache.modifiedToOriginal.get(cellIndex) ?? new Map<OriginalIndex, { editCount: EditCount }>();
		const value = cacheEntry.get(i) ?? { editCount: computeNumberOfEdits(cell, arr[i]), };
		cacheEntry.set(i, value);
		cache.modifiedToOriginal.set(cellIndex, cacheEntry);

		const originalCacheEntry = cache.originalToModified.get(i) ?? new Map<ModifiedIndex, { editCount: EditCount }>();
		originalCacheEntry.set(cellIndex, value);
		cache.originalToModified.set(i, originalCacheEntry);

		if (!canOriginalIndexBeMappedToModifiedIndex(i, value)) {
			continue;
		}
		if (str.length === 0 && ignoreEmptyCells) {
			continue;
		}
		if (str === cell.getValue() && cell.getValue().length > 0) {
			return { index: i, editCount: 0, percentage: 0 };
		}

		if (value.editCount < min_edits) {
			min_edits = value.editCount;
			min_index = i;
		}
	}

	if (min_index === -1) {
		return { index: -1, editCount: Number.MAX_SAFE_INTEGER, percentage: Number.MAX_SAFE_INTEGER };
	}
	const percentage = !cell.getValue().length && !arr[min_index].getValue().length ? 0 : (cell.getValue().length ? (min_edits * 100 / cell.getValue().length) : Number.MAX_SAFE_INTEGER);
	return { index: min_index, editCount: min_edits, percentage };
}

function computeNumberOfEdits(modified: ICell, original: ICell) {
	if (modified.getValue() === original.getValue()) {
		return 0;
	}

	return computeLevenshteinDistance(modified.getValue(), original.getValue());
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/services/notebookWebWorker.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/services/notebookWebWorker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IDiffChange, ISequence, LcsDiff } from '../../../../../base/common/diff/diff.js';
import { doHash, hash, numberHash } from '../../../../../base/common/hash.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { IWebWorkerServerRequestHandler } from '../../../../../base/common/worker/webWorker.js';
import { PieceTreeTextBufferBuilder } from '../../../../../editor/common/model/pieceTreeTextBuffer/pieceTreeTextBufferBuilder.js';
import { CellKind, IMainCellDto, INotebookDiffResult, IOutputDto, NotebookCellInternalMetadata, NotebookCellMetadata, NotebookCellsChangedEventDto, NotebookCellsChangeType, NotebookCellTextModelSplice, NotebookDocumentMetadata, TransientDocumentMetadata } from '../notebookCommon.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { SearchParams } from '../../../../../editor/common/model/textModelSearch.js';
import { MirrorModel } from '../../../../../editor/common/services/textModelSync/textModelSync.impl.js';
import { DefaultEndOfLine } from '../../../../../editor/common/model.js';
import { IModelChangedEvent } from '../../../../../editor/common/model/mirrorTextModel.js';
import { filter } from '../../../../../base/common/objects.js';
import { matchCellBasedOnSimilarties } from './notebookCellMatching.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { DiffChange } from '../../../../../base/common/diff/diffChange.js';
import { computeDiff } from '../notebookDiff.js';

const PREFIX_FOR_UNMATCHED_ORIGINAL_CELLS = `unmatchedOriginalCell`;

class MirrorCell {
	private readonly textModel: MirrorModel;
	private _hash?: number;
	public get eol() {
		return this._eol === '\r\n' ? DefaultEndOfLine.CRLF : DefaultEndOfLine.LF;
	}
	constructor(
		public readonly handle: number,
		uri: URI,
		source: string[],
		private readonly _eol: string,
		versionId: number,
		public language: string,
		public cellKind: CellKind,
		public outputs: IOutputDto[],
		public metadata?: NotebookCellMetadata,
		public internalMetadata?: NotebookCellInternalMetadata,

	) {
		this.textModel = new MirrorModel(uri, source, _eol, versionId);
	}

	onEvents(e: IModelChangedEvent) {
		this.textModel.onEvents(e);
		this._hash = undefined;
	}
	getValue(): string {
		return this.textModel.getValue();
	}

	getLinesContent(): string[] {
		return this.textModel.getLinesContent();
	}
	getComparisonValue(): number {
		return this._hash ??= this._getHash();
	}

	private _getHash() {
		let hashValue = numberHash(104579, 0);

		hashValue = doHash(this.language, hashValue);
		hashValue = doHash(this.getValue(), hashValue);
		hashValue = doHash(this.metadata, hashValue);
		// For purpose of diffing only cellId matters, rest do not
		hashValue = doHash(this.internalMetadata?.internalId || '', hashValue);
		for (const op of this.outputs) {
			hashValue = doHash(op.metadata, hashValue);
			for (const output of op.outputs) {
				hashValue = doHash(output.mime, hashValue);
			}
		}

		const digests = this.outputs.flatMap(op =>
			op.outputs.map(o => hash(Array.from(o.data.buffer)))
		);
		for (const digest of digests) {
			hashValue = numberHash(digest, hashValue);
		}

		return hashValue;
	}
}

class MirrorNotebookDocument {
	constructor(
		readonly uri: URI,
		public cells: MirrorCell[],
		public metadata: NotebookDocumentMetadata,
		public transientDocumentMetadata: TransientDocumentMetadata,
	) {
	}

	acceptModelChanged(event: NotebookCellsChangedEventDto) {
		// note that the cell content change is not applied to the MirrorCell
		// but it's fine as if a cell content is modified after the first diff, its position will not change any more
		// TODO@rebornix, but it might lead to interesting bugs in the future.
		event.rawEvents.forEach(e => {
			if (e.kind === NotebookCellsChangeType.ModelChange) {
				this._spliceNotebookCells(e.changes);
			} else if (e.kind === NotebookCellsChangeType.Move) {
				const cells = this.cells.splice(e.index, 1);
				this.cells.splice(e.newIdx, 0, ...cells);
			} else if (e.kind === NotebookCellsChangeType.Output) {
				const cell = this.cells[e.index];
				cell.outputs = e.outputs;
			} else if (e.kind === NotebookCellsChangeType.ChangeCellLanguage) {
				this._assertIndex(e.index);
				const cell = this.cells[e.index];
				cell.language = e.language;
			} else if (e.kind === NotebookCellsChangeType.ChangeCellMetadata) {
				this._assertIndex(e.index);
				const cell = this.cells[e.index];
				cell.metadata = e.metadata;
			} else if (e.kind === NotebookCellsChangeType.ChangeCellInternalMetadata) {
				this._assertIndex(e.index);
				const cell = this.cells[e.index];
				cell.internalMetadata = e.internalMetadata;
			} else if (e.kind === NotebookCellsChangeType.ChangeDocumentMetadata) {
				this.metadata = e.metadata;
			}
		});
	}

	private _assertIndex(index: number): void {
		if (index < 0 || index >= this.cells.length) {
			throw new Error(`Illegal index ${index}. Cells length: ${this.cells.length}`);
		}
	}

	_spliceNotebookCells(splices: NotebookCellTextModelSplice<IMainCellDto>[]) {
		splices.reverse().forEach(splice => {
			const cellDtos = splice[2];
			const newCells = cellDtos.map(cell => {
				return new MirrorCell(
					cell.handle,
					URI.parse(cell.url),
					cell.source,
					cell.eol,
					cell.versionId,
					cell.language,
					cell.cellKind,
					cell.outputs,
					cell.metadata,
				);
			});

			this.cells.splice(splice[0], splice[1], ...newCells);
		});
	}
}

class CellSequence implements ISequence {

	static create(textModel: MirrorNotebookDocument) {
		const hashValue = textModel.cells.map(c => c.getComparisonValue());
		return new CellSequence(hashValue);
	}
	static createWithCellId(cells: MirrorCell[], includeCellContents?: boolean) {
		const hashValue = cells.map((c) => {
			if (includeCellContents) {
				return `${doHash(c.internalMetadata?.internalId, numberHash(104579, 0))}#${c.getComparisonValue()}`;
			} else {
				return `${doHash(c.internalMetadata?.internalId, numberHash(104579, 0))}}`;
			}
		});
		return new CellSequence(hashValue);
	}

	constructor(readonly hashValue: number[] | string[]) { }

	getElements(): string[] | number[] | Int32Array {
		return this.hashValue;
	}
}

export class NotebookWorker implements IWebWorkerServerRequestHandler, IDisposable {
	_requestHandlerBrand: void = undefined;

	private _models: { [uri: string]: MirrorNotebookDocument };

	constructor() {
		this._models = Object.create(null);
	}
	dispose(): void {
	}

	public $acceptNewModel(uri: string, metadata: NotebookDocumentMetadata, transientDocumentMetadata: TransientDocumentMetadata, cells: IMainCellDto[]): void {
		this._models[uri] = new MirrorNotebookDocument(URI.parse(uri), cells.map(dto => new MirrorCell(
			dto.handle,
			URI.parse(dto.url),
			dto.source,
			dto.eol,
			dto.versionId,
			dto.language,
			dto.cellKind,
			dto.outputs,
			dto.metadata,
			dto.internalMetadata
		)), metadata, transientDocumentMetadata);
	}

	public $acceptModelChanged(strURL: string, event: NotebookCellsChangedEventDto) {
		const model = this._models[strURL];
		model?.acceptModelChanged(event);
	}

	public $acceptCellModelChanged(strURL: string, handle: number, event: IModelChangedEvent) {
		const model = this._models[strURL];
		model.cells.find(cell => cell.handle === handle)?.onEvents(event);
	}

	public $acceptRemovedModel(strURL: string): void {
		if (!this._models[strURL]) {
			return;
		}
		delete this._models[strURL];
	}

	async $computeDiff(originalUrl: string, modifiedUrl: string): Promise<INotebookDiffResult> {
		const original = this._getModel(originalUrl);
		const modified = this._getModel(modifiedUrl);

		const originalModel = new NotebookTextModelFacade(original);
		const modifiedModel = new NotebookTextModelFacade(modified);

		const originalMetadata = filter(original.metadata, key => !original.transientDocumentMetadata[key]);
		const modifiedMetadata = filter(modified.metadata, key => !modified.transientDocumentMetadata[key]);
		const metadataChanged = JSON.stringify(originalMetadata) !== JSON.stringify(modifiedMetadata);
		// TODO@DonJayamanne
		// In the future we might want to avoid computing LCS of outputs
		// That will make this faster.
		const originalDiff = new LcsDiff(CellSequence.create(original), CellSequence.create(modified)).ComputeDiff(false);
		if (originalDiff.changes.length === 0) {
			return {
				metadataChanged,
				cellsDiff: originalDiff
			};
		}

		// This will return the mapping of the cells and what cells were inserted/deleted.
		// We do not care much about accuracy of the diff, but care about the mapping of unmodified cells.
		// That can be used as anchor points to find the cells that have changed.
		// And on cells that have changed, we can use similarity algorithms to find the mapping.
		// Eg as mentioned earlier, its possible after similarity algorithms we find that cells weren't inserted/deleted but were just modified.
		const cellMapping = computeDiff(originalModel, modifiedModel, { cellsDiff: { changes: originalDiff.changes, quitEarly: false }, metadataChanged: false, }).cellDiffInfo;

		// If we have no insertions/deletions, then this is a good diffing.
		if (cellMapping.every(c => c.type === 'modified' || c.type === 'unchanged')) {
			return {
				metadataChanged,
				cellsDiff: originalDiff
			};
		}

		let diffUsingCellIds = this.canComputeDiffWithCellIds(original, modified);
		if (!diffUsingCellIds) {
			/**
			 * Assume we have cells as follows
			 * Original   Modified
			 * A	  		A
			 * B			B
			 * C			e
			 * D			F
			 * E
			 * F
			 *
			 * Using LCS we know easily that A, B cells match.
			 * Using LCS it would look like C changed to e
			 * Using LCS D & E were removed.
			 *
			 * A human would be able to tell that cell C, D were removed.
			 * A human can tell that E changed to e because the code in the cells are very similar.
			 * Note the words `similar`, humans try to match cells based on certain heuristics.
			 * & the most obvious one is the similarity of the code in the cells.
			 *
			 * LCS has no notion of similarity, it only knows about equality.
			 * We can use other algorithms to find similarity.
			 * So if we eliminate A, B, we are left with C, D, E, F and we need to find what they map to in `e, F` in modifed document.
			 * We can use a similarity algorithm to find that.
			 *
			 * The purpose of using LCS first is to find the cells that have not changed.
			 * This avoids the need to use similarity algorithms on all cells.
			 *
			 * At the end of the day what we need is as follows
			 * A <=> A
			 * B <=> B
			 * C => Deleted
			 * D => Deleted
			 * E => e
			 * F => F
			 */



			// Note, if cells are swapped, then this compilicates things
			// Trying to solve diff manually is not easy.
			// Lets instead use LCS find the cells that haven't changed,
			// & the cells that have.
			// For the range of cells that have change, lets see if we can get better results using similarity algorithms.
			// Assume we have
			// Code Cell = print("Hello World")
			// Code Cell = print("Foo Bar")
			// We now change this to
			// MD Cell = # Description
			// Code Cell = print("Hello WorldZ")
			// Code Cell = print("Foo BarZ")
			// LCS will tell us that everything changed.
			// But using similarity algorithms we can tell that the first cell is new and last 2 changed.



			// Lets try the similarity algorithms on all cells.
			// We might fare better.
			const result = matchCellBasedOnSimilarties(modified.cells, original.cells);
			// If we have at least one match, then great.
			if (result.some(c => c.original !== -1)) {
				// We have managed to find similarities between cells.
				// Now we can definitely find what cell is new/removed.
				this.updateCellIdsBasedOnMappings(result, original.cells, modified.cells);
				diffUsingCellIds = true;
			}
		}

		if (!diffUsingCellIds) {
			return {
				metadataChanged,
				cellsDiff: originalDiff
			};
		}

		// At this stage we can use internalMetadata.cellId for tracking changes.
		// I.e. we compute LCS diff and the hashes of some cells from original will be equal to that in modified as we're using cellId.
		// Thus we can find what cells are new/deleted.
		// After that we can find whether the contents of the cells changed.
		const cellsInsertedOrDeletedDiff = new LcsDiff(CellSequence.createWithCellId(original.cells), CellSequence.createWithCellId(modified.cells)).ComputeDiff(false);
		const cellDiffInfo = computeDiff(originalModel, modifiedModel, { cellsDiff: { changes: cellsInsertedOrDeletedDiff.changes, quitEarly: false }, metadataChanged: false, }).cellDiffInfo;

		let processedIndex = 0;
		const changes: IDiffChange[] = [];
		cellsInsertedOrDeletedDiff.changes.forEach(change => {
			if (!change.originalLength && change.modifiedLength) {
				// Inserted.
				// Find all modified cells before this.
				const changeIndex = cellDiffInfo.findIndex(c => c.type === 'insert' && c.modifiedCellIndex === change.modifiedStart);
				cellDiffInfo.slice(processedIndex, changeIndex).forEach(c => {
					if (c.type === 'unchanged' || c.type === 'modified') {
						const originalCell = original.cells[c.originalCellIndex];
						const modifiedCell = modified.cells[c.modifiedCellIndex];
						const changed = c.type === 'modified' || originalCell.getComparisonValue() !== modifiedCell.getComparisonValue();
						if (changed) {
							changes.push(new DiffChange(c.originalCellIndex, 1, c.modifiedCellIndex, 1));
						}
					}
				});
				changes.push(change);
				processedIndex = changeIndex + 1;
			} else if (change.originalLength && !change.modifiedLength) {
				// Deleted.
				// Find all modified cells before this.
				const changeIndex = cellDiffInfo.findIndex(c => c.type === 'delete' && c.originalCellIndex === change.originalStart);
				cellDiffInfo.slice(processedIndex, changeIndex).forEach(c => {
					if (c.type === 'unchanged' || c.type === 'modified') {
						const originalCell = original.cells[c.originalCellIndex];
						const modifiedCell = modified.cells[c.modifiedCellIndex];
						const changed = c.type === 'modified' || originalCell.getComparisonValue() !== modifiedCell.getComparisonValue();
						if (changed) {
							changes.push(new DiffChange(c.originalCellIndex, 1, c.modifiedCellIndex, 1));
						}
					}
				});
				changes.push(change);
				processedIndex = changeIndex + 1;
			} else {
				// This could be a situation where a cell has been deleted on left and inserted on the right.
				// E.g. markdown cell deleted and code cell inserted.
				// But LCS shows them as a modification.
				const changeIndex = cellDiffInfo.findIndex(c => (c.type === 'delete' && c.originalCellIndex === change.originalStart) || (c.type === 'insert' && c.modifiedCellIndex === change.modifiedStart));
				cellDiffInfo.slice(processedIndex, changeIndex).forEach(c => {
					if (c.type === 'unchanged' || c.type === 'modified') {
						const originalCell = original.cells[c.originalCellIndex];
						const modifiedCell = modified.cells[c.modifiedCellIndex];
						const changed = c.type === 'modified' || originalCell.getComparisonValue() !== modifiedCell.getComparisonValue();
						if (changed) {
							changes.push(new DiffChange(c.originalCellIndex, 1, c.modifiedCellIndex, 1));
						}
					}
				});
				changes.push(change);
				processedIndex = changeIndex + 1;
			}
		});
		cellDiffInfo.slice(processedIndex).forEach(c => {
			if (c.type === 'unchanged' || c.type === 'modified') {
				const originalCell = original.cells[c.originalCellIndex];
				const modifiedCell = modified.cells[c.modifiedCellIndex];
				const changed = c.type === 'modified' || originalCell.getComparisonValue() !== modifiedCell.getComparisonValue();
				if (changed) {
					changes.push(new DiffChange(c.originalCellIndex, 1, c.modifiedCellIndex, 1));
				}
			}
		});

		return {
			metadataChanged,
			cellsDiff: {
				changes,
				quitEarly: false
			}
		};
	}

	canComputeDiffWithCellIds(original: MirrorNotebookDocument, modified: MirrorNotebookDocument): boolean {
		return this.canComputeDiffWithCellInternalIds(original, modified) || this.canComputeDiffWithCellMetadataIds(original, modified);
	}

	canComputeDiffWithCellInternalIds(original: MirrorNotebookDocument, modified: MirrorNotebookDocument): boolean {
		const originalCellIndexIds = original.cells.map((cell, index) => ({ index, id: (cell.internalMetadata?.internalId || '') as string }));
		const modifiedCellIndexIds = modified.cells.map((cell, index) => ({ index, id: (cell.internalMetadata?.internalId || '') as string }));
		// If we have a cell without an id, do not use metadata.id for diffing.
		if (originalCellIndexIds.some(c => !c.id) || modifiedCellIndexIds.some(c => !c.id)) {
			return false;
		}
		// If none of the ids in original can be found in modified, then we can't use metadata.id for diffing.
		// I.e. everything is new, no point trying.
		return originalCellIndexIds.some(c => modifiedCellIndexIds.find(m => m.id === c.id));
	}

	canComputeDiffWithCellMetadataIds(original: MirrorNotebookDocument, modified: MirrorNotebookDocument): boolean {
		const originalCellIndexIds = original.cells.map((cell, index) => ({ index, id: (cell.metadata?.id || '') as string }));
		const modifiedCellIndexIds = modified.cells.map((cell, index) => ({ index, id: (cell.metadata?.id || '') as string }));
		// If we have a cell without an id, do not use metadata.id for diffing.
		if (originalCellIndexIds.some(c => !c.id) || modifiedCellIndexIds.some(c => !c.id)) {
			return false;
		}
		// If none of the ids in original can be found in modified, then we can't use metadata.id for diffing.
		// I.e. everything is new, no point trying.
		if (originalCellIndexIds.every(c => !modifiedCellIndexIds.find(m => m.id === c.id))) {
			return false;
		}

		// Internally we use internalMetadata.cellId for diffing, hence update the internalMetadata.cellId
		original.cells.map((cell, index) => {
			cell.internalMetadata = cell.internalMetadata || {};
			cell.internalMetadata.internalId = cell.metadata?.id as string || '';
		});
		modified.cells.map((cell, index) => {
			cell.internalMetadata = cell.internalMetadata || {};
			cell.internalMetadata.internalId = cell.metadata?.id as string || '';
		});
		return true;
	}


	isOriginalCellMatchedWithModifiedCell(originalCell: MirrorCell) {
		return (originalCell.internalMetadata?.internalId as string || '').startsWith(PREFIX_FOR_UNMATCHED_ORIGINAL_CELLS);
	}
	updateCellIdsBasedOnMappings(mappings: { modified: number; original: number }[], originalCells: MirrorCell[], modifiedCells: MirrorCell[]): boolean {
		const uuids = new Map<number, string>();
		originalCells.map((cell, index) => {
			cell.internalMetadata = cell.internalMetadata || { internalId: '' };
			cell.internalMetadata.internalId = `${PREFIX_FOR_UNMATCHED_ORIGINAL_CELLS}${generateUuid()}`;
			const found = mappings.find(r => r.original === index);
			if (found) {
				// Do not use the indexes as ids.
				// If we do, then the hashes will be very similar except for last digit.
				cell.internalMetadata.internalId = generateUuid();
				uuids.set(found.modified, cell.internalMetadata.internalId as string);
			}
		});
		modifiedCells.map((cell, index) => {
			cell.internalMetadata = cell.internalMetadata || { internalId: '' };
			cell.internalMetadata.internalId = uuids.get(index) ?? generateUuid();
		});
		return true;
	}

	$canPromptRecommendation(modelUrl: string): boolean {
		const model = this._getModel(modelUrl);
		const cells = model.cells;

		for (let i = 0; i < cells.length; i++) {
			const cell = cells[i];
			if (cell.cellKind === CellKind.Markup) {
				continue;
			}

			if (cell.language !== 'python') {
				continue;
			}

			const searchParams = new SearchParams('import\\s*pandas|from\\s*pandas', true, false, null);
			const searchData = searchParams.parseSearchRequest();

			if (!searchData) {
				continue;
			}

			const builder = new PieceTreeTextBufferBuilder();
			builder.acceptChunk(cell.getValue());
			const bufferFactory = builder.finish(true);
			const textBuffer = bufferFactory.create(cell.eol).textBuffer;

			const lineCount = textBuffer.getLineCount();
			const maxLineCount = Math.min(lineCount, 20);
			const range = new Range(1, 1, maxLineCount, textBuffer.getLineLength(maxLineCount) + 1);
			const cellMatches = textBuffer.findMatchesLineByLine(range, searchData, true, 1);
			if (cellMatches.length > 0) {
				return true;
			}
		}

		return false;
	}

	protected _getModel(uri: string): MirrorNotebookDocument {
		return this._models[uri];
	}
}

export function create(): IWebWorkerServerRequestHandler {
	return new NotebookWorker();
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

interface ICell {
	cellKind: CellKind;
	getHashValue(): number;
	equal(cell: ICell): boolean;
}

class NotebookTextModelFacade {
	public readonly cells: readonly ICell[];
	constructor(
		readonly notebook: MirrorNotebookDocument
	) {

		this.cells = notebook.cells.map(cell => new NotebookCellTextModelFacade(cell));
	}

}
class NotebookCellTextModelFacade implements ICell {
	get cellKind(): CellKind {
		return this.cell.cellKind;
	}
	constructor(
		private readonly cell: MirrorCell
	) {
	}
	getHashValue(): number {
		return this.cell.getComparisonValue();
	}
	equal(cell: ICell): boolean {
		if (cell.cellKind !== this.cellKind) {
			return false;
		}
		return this.getHashValue() === cell.getHashValue();
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/services/notebookWebWorkerMain.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/services/notebookWebWorkerMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { bootstrapWebWorker } from '../../../../../base/common/worker/webWorkerBootstrap.js';
import { create } from './notebookWebWorker.js';

bootstrapWebWorker(create);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/common/services/notebookWorkerService.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/common/services/notebookWorkerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../base/common/uri.js';
import { createDecorator } from '../../../../../platform/instantiation/common/instantiation.js';
import { INotebookDiffResult } from '../notebookCommon.js';

export const ID_NOTEBOOK_EDITOR_WORKER_SERVICE = 'notebookEditorWorkerService';
export const INotebookEditorWorkerService = createDecorator<INotebookEditorWorkerService>(ID_NOTEBOOK_EDITOR_WORKER_SERVICE);

export interface INotebookEditorWorkerService {
	readonly _serviceBrand: undefined;

	canComputeDiff(original: URI, modified: URI): boolean;
	computeDiff(original: URI, modified: URI): Promise<INotebookDiffResult>;
	canPromptRecommendation(model: URI): Promise<boolean>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/cellDecorations.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/cellDecorations.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CellKind } from '../../common/notebookCommon.js';
import { withTestNotebook } from './testNotebookEditor.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Event } from '../../../../../base/common/event.js';

suite('CellDecorations', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('Add and remove a cell decoration', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel) => {
				const cell = viewModel.cellAt(0);
				assert.ok(cell);

				let added = false;
				Event.once(cell.onCellDecorationsChanged)(e => added = !!e.added.find(decoration => decoration.className === 'style1'));

				const decorationIds = cell.deltaCellDecorations([], [{ className: 'style1' }]);
				assert.ok(cell.getCellDecorations().find(dec => dec.className === 'style1'));

				let removed = false;
				Event.once(cell.onCellDecorationsChanged)(e => removed = !!e.removed.find(decoration => decoration.className === 'style1'));
				cell.deltaCellDecorations(decorationIds, []);

				assert.ok(!cell.getCellDecorations().find(dec => dec.className === 'style1'));
				assert.ok(added);
				assert.ok(removed);
			});
	});

	test('Removing one cell decoration should not remove all', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel) => {
				const cell = viewModel.cellAt(0);
				assert.ok(cell);

				const decorationIds = cell.deltaCellDecorations([], [{ className: 'style1', outputClassName: 'style1' }]);
				cell.deltaCellDecorations([], [{ className: 'style1' }]);

				let styleRemoved = false;
				let outputStyleRemoved = false;
				Event.once(cell.onCellDecorationsChanged)(e => {
					styleRemoved = !!e.removed.find(decoration => decoration.className === 'style1');
					outputStyleRemoved = !!e.removed.find(decoration => decoration.outputClassName === 'style1');
				});
				// remove the first style added, which should only remove the output class
				cell.deltaCellDecorations(decorationIds, []);

				assert.ok(!cell.getCellDecorations().find(dec => dec.outputClassName === 'style1'));
				assert.ok(cell.getCellDecorations().find(dec => dec.className === 'style1'));
				assert.ok(!styleRemoved);
				assert.ok(outputStyleRemoved);
			});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/cellDnd.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/cellDnd.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { performCellDropEdits } from '../../browser/view/cellParts/cellDnd.js';
import { CellKind } from '../../common/notebookCommon.js';
import { withTestNotebook } from './testNotebookEditor.js';
import assert from 'assert';
import { ICellRange } from '../../common/notebookRange.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

interface IBeginningState {
	startOrder: string[];
	selections: ICellRange[];
	focus: number;
}

interface IDragAction {
	dragIdx: number;
	dragOverIdx: number;
	direction: 'above' | 'below';
}

interface IEndState {
	endOrder: string[];
	selection: ICellRange;
	focus: number;
}

async function testCellDnd(beginning: IBeginningState, dragAction: IDragAction, end: IEndState) {
	await withTestNotebook(
		beginning.startOrder.map(text => [text, 'plaintext', CellKind.Code, []]),
		(editor, viewModel) => {
			editor.setSelections(beginning.selections);
			editor.setFocus({ start: beginning.focus, end: beginning.focus + 1 });
			performCellDropEdits(editor, viewModel.cellAt(dragAction.dragIdx)!, dragAction.direction, viewModel.cellAt(dragAction.dragOverIdx)!);

			for (const i in end.endOrder) {
				assert.equal(viewModel.viewCells[i].getText(), end.endOrder[i]);
			}

			assert.equal(editor.getSelections().length, 1);
			assert.deepStrictEqual(editor.getSelections()[0], end.selection);
			assert.deepStrictEqual(editor.getFocus(), { start: end.focus, end: end.focus + 1 });
		});
}

suite('cellDND', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('drag 1 cell', async () => {
		await testCellDnd(
			{
				startOrder: ['0', '1', '2', '3'],
				selections: [{ start: 0, end: 1 }],
				focus: 0
			},
			{
				dragIdx: 0,
				dragOverIdx: 1,
				direction: 'below'
			},
			{
				endOrder: ['1', '0', '2', '3'],
				selection: { start: 1, end: 2 },
				focus: 1
			}
		);
	});

	test('drag multiple contiguous cells down', async () => {
		await testCellDnd(
			{
				startOrder: ['0', '1', '2', '3'],
				selections: [{ start: 1, end: 3 }],
				focus: 1
			},
			{
				dragIdx: 1,
				dragOverIdx: 3,
				direction: 'below'
			},
			{
				endOrder: ['0', '3', '1', '2'],
				selection: { start: 2, end: 4 },
				focus: 2
			}
		);
	});

	test('drag multiple contiguous cells up', async () => {
		await testCellDnd(
			{
				startOrder: ['0', '1', '2', '3'],
				selections: [{ start: 2, end: 4 }],
				focus: 2
			},
			{
				dragIdx: 3,
				dragOverIdx: 0,
				direction: 'above'
			},
			{
				endOrder: ['2', '3', '0', '1'],
				selection: { start: 0, end: 2 },
				focus: 0
			}
		);
	});

	test('drag ranges down', async () => {
		await testCellDnd(
			{
				startOrder: ['0', '1', '2', '3'],
				selections: [{ start: 0, end: 1 }, { start: 2, end: 3 }],
				focus: 0
			},
			{
				dragIdx: 0,
				dragOverIdx: 3,
				direction: 'below'
			},
			{
				endOrder: ['1', '3', '0', '2'],
				selection: { start: 2, end: 4 },
				focus: 2
			}
		);
	});

	test('drag ranges up', async () => {
		await testCellDnd(
			{
				startOrder: ['0', '1', '2', '3'],
				selections: [{ start: 1, end: 2 }, { start: 3, end: 4 }],
				focus: 1
			},
			{
				dragIdx: 1,
				dragOverIdx: 0,
				direction: 'above'
			},
			{
				endOrder: ['1', '3', '0', '2'],
				selection: { start: 0, end: 2 },
				focus: 0
			}
		);
	});

	test('drag ranges between ranges', async () => {
		await testCellDnd(
			{
				startOrder: ['0', '1', '2', '3'],
				selections: [{ start: 0, end: 1 }, { start: 3, end: 4 }],
				focus: 0
			},
			{
				dragIdx: 0,
				dragOverIdx: 1,
				direction: 'below'
			},
			{
				endOrder: ['1', '0', '3', '2'],
				selection: { start: 1, end: 3 },
				focus: 1
			}
		);
	});

	test('drag ranges just above a range', async () => {
		await testCellDnd(
			{
				startOrder: ['0', '1', '2', '3'],
				selections: [{ start: 1, end: 2 }, { start: 3, end: 4 }],
				focus: 1
			},
			{
				dragIdx: 1,
				dragOverIdx: 1,
				direction: 'above'
			},
			{
				endOrder: ['0', '1', '3', '2'],
				selection: { start: 1, end: 3 },
				focus: 1
			}
		);
	});

	test('drag ranges inside a range', async () => {
		await testCellDnd(
			{
				startOrder: ['0', '1', '2', '3'],
				selections: [{ start: 0, end: 2 }, { start: 3, end: 4 }],
				focus: 0
			},
			{
				dragIdx: 0,
				dragOverIdx: 0,
				direction: 'below'
			},
			{
				endOrder: ['0', '1', '3', '2'],
				selection: { start: 0, end: 3 },
				focus: 0
			}
		);
	});

	test('dragged cell is not focused or selected', async () => {
		await testCellDnd(
			{
				startOrder: ['0', '1', '2', '3'],
				selections: [{ start: 1, end: 2 }],
				focus: 1
			},
			{
				dragIdx: 2,
				dragOverIdx: 3,
				direction: 'below'
			},
			{
				endOrder: ['0', '1', '3', '2'],
				selection: { start: 3, end: 4 },
				focus: 3
			}
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/cellOperations.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/cellOperations.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { FoldingModel, updateFoldingStateAtIndex } from '../../browser/viewModel/foldingModel.js';
import { changeCellToKind, computeCellLinesContents, copyCellRange, insertCell, joinNotebookCells, moveCellRange, runDeleteAction } from '../../browser/controller/cellOperations.js';
import { CellEditType, CellKind, SelectionStateType } from '../../common/notebookCommon.js';
import { withTestNotebook } from './testNotebookEditor.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { ResourceTextEdit } from '../../../../../editor/browser/services/bulkEditService.js';
import { ResourceNotebookCellEdit } from '../../../bulkEdit/browser/bulkCellEdits.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { ITextBuffer, ValidAnnotatedEditOperation } from '../../../../../editor/common/model.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('CellOperations', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('Move cells - single cell', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel) => {
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 1, end: 2 }, selections: [{ start: 1, end: 2 }] });
				const cell = viewModel.cellAt(1);
				assert.ok(cell);
				await moveCellRange({ notebookEditor: editor, cell: cell }, 'down');
				assert.strictEqual(viewModel.cellAt(2)?.getText(), 'var b = 1;');
				assert.strictEqual(cell, viewModel.cellAt(2));
			});
	});

	test('Move cells - multiple cells in a selection', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel) => {
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 1, end: 2 }, selections: [{ start: 0, end: 2 }] });
				await moveCellRange({ notebookEditor: editor }, 'down');
				assert.strictEqual(viewModel.cellAt(0)?.getText(), '# header b');
				assert.strictEqual(viewModel.cellAt(1)?.getText(), '# header a');
				assert.strictEqual(viewModel.cellAt(2)?.getText(), 'var b = 1;');
			});
	});

	test('Move cells - move with folding ranges', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel, ds) => {
				const foldingModel = ds.add(new FoldingModel());
				foldingModel.attachViewModel(viewModel);
				updateFoldingStateAtIndex(foldingModel, 0, true);
				updateFoldingStateAtIndex(foldingModel, 1, true);
				viewModel.updateFoldingRanges(foldingModel.regions);
				editor.setHiddenAreas([{ start: 1, end: 2 }]);
				editor.setHiddenAreas(viewModel.getHiddenRanges());

				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 0, end: 1 }, selections: [{ start: 0, end: 1 }] });
				await moveCellRange({ notebookEditor: editor }, 'down');
				assert.strictEqual(viewModel.cellAt(0)?.getText(), '# header b');
				assert.strictEqual(viewModel.cellAt(1)?.getText(), '# header a');
				assert.strictEqual(viewModel.cellAt(2)?.getText(), 'var b = 1;');
			});
	});


	test('Copy/duplicate cells - single cell', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel) => {
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 1, end: 2 }, selections: [{ start: 1, end: 2 }] });
				await copyCellRange({ notebookEditor: editor, cell: viewModel.cellAt(1)! }, 'down');
				assert.strictEqual(viewModel.length, 6);
				assert.strictEqual(viewModel.cellAt(1)?.getText(), 'var b = 1;');
				assert.strictEqual(viewModel.cellAt(2)?.getText(), 'var b = 1;');
			});
	});

	test('Copy/duplicate cells - target and selection are different, #119769', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel) => {
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 0, end: 1 }, selections: [{ start: 0, end: 1 }] });
				await copyCellRange({ notebookEditor: editor, cell: viewModel.cellAt(1)!, ui: true }, 'down');
				assert.strictEqual(viewModel.length, 6);
				assert.strictEqual(viewModel.cellAt(1)?.getText(), 'var b = 1;');
				assert.strictEqual(viewModel.cellAt(2)?.getText(), 'var b = 1;');
			});
	});

	test('Copy/duplicate cells - multiple cells in a selection', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel) => {
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 1, end: 2 }, selections: [{ start: 0, end: 2 }] });
				await copyCellRange({ notebookEditor: editor, cell: viewModel.cellAt(1)! }, 'down');
				assert.strictEqual(viewModel.length, 7);
				assert.strictEqual(viewModel.cellAt(0)?.getText(), '# header a');
				assert.strictEqual(viewModel.cellAt(1)?.getText(), 'var b = 1;');
				assert.strictEqual(viewModel.cellAt(2)?.getText(), '# header a');
				assert.strictEqual(viewModel.cellAt(3)?.getText(), 'var b = 1;');
			});
	});

	test('Copy/duplicate cells - move with folding ranges', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel, ds) => {
				const foldingModel = ds.add(new FoldingModel());
				foldingModel.attachViewModel(viewModel);
				updateFoldingStateAtIndex(foldingModel, 0, true);
				updateFoldingStateAtIndex(foldingModel, 1, true);
				viewModel.updateFoldingRanges(foldingModel.regions);
				editor.setHiddenAreas([{ start: 1, end: 2 }]);
				editor.setHiddenAreas(viewModel.getHiddenRanges());

				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 0, end: 1 }, selections: [{ start: 0, end: 1 }] });
				await copyCellRange({ notebookEditor: editor, cell: viewModel.cellAt(1)! }, 'down');
				assert.strictEqual(viewModel.length, 7);
				assert.strictEqual(viewModel.cellAt(0)?.getText(), '# header a');
				assert.strictEqual(viewModel.cellAt(1)?.getText(), 'var b = 1;');
				assert.strictEqual(viewModel.cellAt(2)?.getText(), '# header a');
				assert.strictEqual(viewModel.cellAt(3)?.getText(), 'var b = 1;');
			});
	});

	test('Copy/duplicate cells - should not share the same text buffer #102423', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel) => {
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 1, end: 2 }, selections: [{ start: 1, end: 2 }] });
				await copyCellRange({ notebookEditor: editor, cell: viewModel.cellAt(1)! }, 'down');
				assert.strictEqual(viewModel.length, 3);
				const cell1 = viewModel.cellAt(1);
				const cell2 = viewModel.cellAt(2);
				assert.ok(cell1);
				assert.ok(cell2);
				assert.strictEqual(cell1.getText(), 'var b = 1;');
				assert.strictEqual(viewModel.cellAt(2)?.getText(), 'var b = 1;');

				(cell1.textBuffer as ITextBuffer).applyEdits([
					new ValidAnnotatedEditOperation(null, new Range(1, 1, 1, 4), '', false, false, false)
				], false, true);
				assert.notStrictEqual(cell1.getText(), cell2.getText());
			});
	});

	test('Join cell with below - single cell', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel, accessor) => {
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 3, end: 4 }, selections: [{ start: 3, end: 4 }] });
				const ret = await joinNotebookCells(editor, { start: 3, end: 4 }, 'below');
				assert.strictEqual(ret?.edits.length, 2);
				assert.deepStrictEqual(ret?.edits[0], new ResourceTextEdit(viewModel.cellAt(3)!.uri, {
					range: new Range(1, 11, 1, 11), text: viewModel.cellAt(4)!.textBuffer.getEOL() + 'var c = 3;'
				}));
				assert.deepStrictEqual(ret?.edits[1], new ResourceNotebookCellEdit(editor.textModel.uri,
					{
						editType: CellEditType.Replace,
						index: 4,
						count: 1,
						cells: []
					}
				));
			});
	});

	test('Join cell with above - single cell', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel, accessor) => {
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 3, end: 4 }, selections: [{ start: 3, end: 4 }] });
				const ret = await joinNotebookCells(editor, { start: 4, end: 5 }, 'above');
				assert.strictEqual(ret?.edits.length, 2);
				assert.deepStrictEqual(ret?.edits[0], new ResourceTextEdit(viewModel.cellAt(3)!.uri, {
					range: new Range(1, 11, 1, 11), text: viewModel.cellAt(4)!.textBuffer.getEOL() + 'var c = 3;'
				}));
				assert.deepStrictEqual(ret?.edits[1], new ResourceNotebookCellEdit(editor.textModel.uri,
					{
						editType: CellEditType.Replace,
						index: 4,
						count: 1,
						cells: []
					}
				));
			});
	});

	test('Join cell with below - multiple cells', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel, accessor) => {
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 1, end: 2 }, selections: [{ start: 0, end: 2 }] });
				const ret = await joinNotebookCells(editor, { start: 0, end: 2 }, 'below');
				assert.strictEqual(ret?.edits.length, 2);
				assert.deepStrictEqual(ret?.edits[0], new ResourceTextEdit(viewModel.cellAt(0)!.uri, {
					range: new Range(1, 11, 1, 11), text: viewModel.cellAt(1)!.textBuffer.getEOL() + 'var b = 2;' + viewModel.cellAt(2)!.textBuffer.getEOL() + 'var c = 3;'
				}));
				assert.deepStrictEqual(ret?.edits[1], new ResourceNotebookCellEdit(editor.textModel.uri,
					{
						editType: CellEditType.Replace,
						index: 1,
						count: 2,
						cells: []
					}
				));
			});
	});

	test('Join cell with above - multiple cells', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel, accessor) => {
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 2, end: 3 }, selections: [{ start: 1, end: 3 }] });
				const ret = await joinNotebookCells(editor, { start: 1, end: 3 }, 'above');
				assert.strictEqual(ret?.edits.length, 2);
				assert.deepStrictEqual(ret?.edits[0], new ResourceTextEdit(viewModel.cellAt(0)!.uri, {
					range: new Range(1, 11, 1, 11), text: viewModel.cellAt(1)!.textBuffer.getEOL() + 'var b = 2;' + viewModel.cellAt(2)!.textBuffer.getEOL() + 'var c = 3;'
				}));
				assert.deepStrictEqual(ret?.edits[1], new ResourceNotebookCellEdit(editor.textModel.uri,
					{
						editType: CellEditType.Replace,
						index: 1,
						count: 2,
						cells: []
					}
				));
			});
	});

	test('Delete focus cell', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel) => {
				editor.setFocus({ start: 0, end: 1 });
				editor.setSelections([{ start: 0, end: 1 }]);
				runDeleteAction(editor, viewModel.cellAt(0)!);
				assert.strictEqual(viewModel.length, 2);
			});
	});

	test('Delete selected cells', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel) => {
				editor.setFocus({ start: 0, end: 1 });
				editor.setSelections([{ start: 0, end: 2 }]);
				runDeleteAction(editor, viewModel.cellAt(0)!);
				assert.strictEqual(viewModel.length, 1);
			});
	});

	test('Delete focus cell out of a selection', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}],
			],
			async (editor, viewModel) => {
				editor.setFocus({ start: 0, end: 1 });
				editor.setSelections([{ start: 2, end: 4 }]);
				runDeleteAction(editor, viewModel.cellAt(0)!);
				assert.strictEqual(viewModel.length, 3);
			});
	});

	test('Delete UI target', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel) => {
				editor.setFocus({ start: 0, end: 1 });
				editor.setSelections([{ start: 0, end: 1 }]);
				runDeleteAction(editor, viewModel.cellAt(2)!);
				assert.strictEqual(viewModel.length, 2);
				assert.strictEqual(viewModel.cellAt(0)?.getText(), 'var a = 1;');
				assert.strictEqual(viewModel.cellAt(1)?.getText(), 'var b = 2;');
			});
	});

	test('Delete UI target 2', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}],
				['var e = 5;', 'javascript', CellKind.Code, [], {}],
			],
			async (editor, viewModel) => {
				editor.setFocus({ start: 0, end: 1 });
				editor.setSelections([{ start: 0, end: 1 }, { start: 3, end: 5 }]);
				runDeleteAction(editor, viewModel.cellAt(1)!);
				assert.strictEqual(viewModel.length, 4);
				assert.deepStrictEqual(editor.getFocus(), { start: 0, end: 1 });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 0, end: 1 }, { start: 2, end: 4 }]);
			});
	});

	test('Delete UI target 3', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}],
				['var e = 5;', 'javascript', CellKind.Code, [], {}],
			],
			async (editor, viewModel) => {
				editor.setFocus({ start: 0, end: 1 });
				editor.setSelections([{ start: 2, end: 3 }]);
				runDeleteAction(editor, viewModel.cellAt(0)!);
				assert.strictEqual(viewModel.length, 4);
				assert.deepStrictEqual(editor.getFocus(), { start: 0, end: 1 });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 1, end: 2 }]);
			});
	});

	test('Delete UI target 4', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}],
				['var e = 5;', 'javascript', CellKind.Code, [], {}],
			],
			async (editor, viewModel) => {
				editor.setFocus({ start: 2, end: 3 });
				editor.setSelections([{ start: 3, end: 5 }]);
				runDeleteAction(editor, viewModel.cellAt(0)!);
				assert.strictEqual(viewModel.length, 4);
				assert.deepStrictEqual(editor.getFocus(), { start: 1, end: 2 });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 2, end: 4 }]);
			});
	});


	test('Delete last cell sets selection correctly', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel) => {
				editor.setFocus({ start: 2, end: 3 });
				editor.setSelections([{ start: 2, end: 3 }]);
				runDeleteAction(editor, viewModel.cellAt(2)!);
				assert.strictEqual(viewModel.length, 2);
				assert.deepStrictEqual(editor.getFocus(), { start: 1, end: 2 });
			});
	});

	test('#120187. Delete should work on multiple distinct selection', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel) => {
				editor.setFocus({ start: 0, end: 1 });
				editor.setSelections([{ start: 0, end: 1 }, { start: 3, end: 4 }]);
				runDeleteAction(editor, viewModel.cellAt(0)!);
				assert.strictEqual(viewModel.length, 2);
				assert.deepStrictEqual(editor.getFocus(), { start: 0, end: 1 });
			});
	});

	test('#120187. Delete should work on multiple distinct selection 2', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}],
				['var e = 5;', 'javascript', CellKind.Code, [], {}],
			],
			async (editor, viewModel) => {
				editor.setFocus({ start: 1, end: 2 });
				editor.setSelections([{ start: 1, end: 2 }, { start: 3, end: 5 }]);
				runDeleteAction(editor, viewModel.cellAt(1)!);
				assert.strictEqual(viewModel.length, 2);
				assert.deepStrictEqual(editor.getFocus(), { start: 1, end: 2 });
			});
	});

	test('Change cell kind - single cell', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel) => {
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 1, end: 2 }, selections: [{ start: 1, end: 2 }] });
				await changeCellToKind(CellKind.Markup, { notebookEditor: editor, cell: viewModel.cellAt(1)!, ui: true });
				assert.strictEqual(viewModel.cellAt(1)?.cellKind, CellKind.Markup);
			});
	});

	test('Change cell kind - multi cells', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel) => {
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 1, end: 2 }, selections: [{ start: 1, end: 2 }] });
				await changeCellToKind(CellKind.Markup, { notebookEditor: editor, selectedCells: [viewModel.cellAt(3)!, viewModel.cellAt(4)!], ui: false });
				assert.strictEqual(viewModel.cellAt(3)?.cellKind, CellKind.Markup);
				assert.strictEqual(viewModel.cellAt(4)?.cellKind, CellKind.Markup);
			});
	});


	test('split cell', async function () {
		await withTestNotebook(
			[
				['var b = 1;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, viewModel) => {
				assert.deepStrictEqual(computeCellLinesContents(viewModel.cellAt(0)!, [{ lineNumber: 1, column: 4 }]), [
					'var',
					' b = 1;'
				]);

				assert.deepStrictEqual(computeCellLinesContents(viewModel.cellAt(0)!, [{ lineNumber: 1, column: 4 }, { lineNumber: 1, column: 6 }]), [
					'var',
					' b',
					' = 1;'
				]);

				assert.deepStrictEqual(computeCellLinesContents(viewModel.cellAt(0)!, [{ lineNumber: 1, column: 1 }]), [
					'',
					'var b = 1;'
				]);

				assert.deepStrictEqual(computeCellLinesContents(viewModel.cellAt(0)!, [{ lineNumber: 1, column: 11 }]), [
					'var b = 1;',
					'',
				]);
			}
		);
	});

	test('Insert cell', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel, _ds, accessor) => {
				const languageService = accessor.get(ILanguageService);

				const insertedCellAbove = insertCell(languageService, editor, 4, CellKind.Code, 'above', 'var a = 0;');
				assert.strictEqual(viewModel.length, 6);
				assert.strictEqual(viewModel.cellAt(4), insertedCellAbove);

				const insertedCellBelow = insertCell(languageService, editor, 1, CellKind.Code, 'below', 'var a = 0;');
				assert.strictEqual(viewModel.length, 7);
				assert.strictEqual(viewModel.cellAt(2), insertedCellBelow);
			});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/cellOutput.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/cellOutput.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { CellOutputContainer } from '../../browser/view/cellParts/cellOutput.js';
import { CodeCellRenderTemplate } from '../../browser/view/notebookRenderingCommon.js';
import { CodeCellViewModel } from '../../browser/viewModel/codeCellViewModel.js';
import { CellKind, INotebookRendererInfo, IOutputDto } from '../../common/notebookCommon.js';
import { setupInstantiationService, withTestNotebook } from './testNotebookEditor.js';
import { FastDomNode } from '../../../../../base/browser/fastDomNode.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { INotebookService } from '../../common/notebookService.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { IMenu, IMenuService } from '../../../../../platform/actions/common/actions.js';
import { Event } from '../../../../../base/common/event.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { getAllOutputsText } from '../../browser/viewModel/cellOutputTextHelper.js';

suite('CellOutput', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();
	let instantiationService: TestInstantiationService;
	let outputMenus: IMenu[] = [];

	setup(() => {
		outputMenus = [];
		instantiationService = setupInstantiationService(store);
		instantiationService.stub(INotebookService, new class extends mock<INotebookService>() {
			override getOutputMimeTypeInfo(_textModel: any, _kernelProvides: readonly string[] | undefined, output: IOutputDto) {
				return [{
					rendererId: 'plainTextRendererId',
					mimeType: 'text/plain',
					isTrusted: true
				}, {
					rendererId: 'htmlRendererId',
					mimeType: 'text/html',
					isTrusted: true
				}, {
					rendererId: 'errorRendererId',
					mimeType: 'application/vnd.code.notebook.error',
					isTrusted: true
				}, {
					rendererId: 'stderrRendererId',
					mimeType: 'application/vnd.code.notebook.stderr',
					isTrusted: true
				}, {
					rendererId: 'stdoutRendererId',
					mimeType: 'application/vnd.code.notebook.stdout',
					isTrusted: true
				}]
					.filter(info => output.outputs.some(output => output.mime === info.mimeType));
			}
			override getRendererInfo(): INotebookRendererInfo {
				return {
					id: 'rendererId',
					displayName: 'Stubbed Renderer',
					extensionId: { _lower: 'id', value: 'id' },
				} as INotebookRendererInfo;
			}
		});
		instantiationService.stub(IMenuService, new class extends mock<IMenuService>() {
			override createMenu() {
				const menu = new class extends mock<IMenu>() {
					override onDidChange = Event.None;
					override getActions() { return []; }
					override dispose() { outputMenus = outputMenus.filter(item => item !== menu); }
				};
				outputMenus.push(menu);
				return menu;
			}
		});
	});

	test('Render cell output items with multiple mime types', async function () {
		const outputItem = { data: VSBuffer.fromString('output content'), mime: 'text/plain' };
		const htmlOutputItem = { data: VSBuffer.fromString('output content'), mime: 'text/html' };
		const output1: IOutputDto = { outputId: 'abc', outputs: [outputItem, htmlOutputItem] };
		const output2: IOutputDto = { outputId: 'def', outputs: [outputItem, htmlOutputItem] };

		await withTestNotebook(
			[
				['print(output content)', 'python', CellKind.Code, [output1, output2], {}],
			],
			(editor, viewModel, disposables, accessor) => {

				const cell = viewModel.viewCells[0] as CodeCellViewModel;
				const cellTemplate = createCellTemplate(disposables);
				const output = disposables.add(accessor.createInstance(CellOutputContainer, editor, cell, cellTemplate, { limit: 100 }));
				output.render();
				cell.outputsViewModels[0].setVisible(true);
				assert.strictEqual(outputMenus.length, 1, 'should have 1 output menus');
				assert(cellTemplate.outputContainer.domNode.style.display !== 'none', 'output container should be visible');
				cell.outputsViewModels[1].setVisible(true);
				assert.strictEqual(outputMenus.length, 2, 'should have 2 output menus');
				cell.outputsViewModels[1].setVisible(true);
				assert.strictEqual(outputMenus.length, 2, 'should still have 2 output menus');
			},
			instantiationService
		);
	});

	test('One of many cell outputs becomes hidden', async function () {
		const outputItem = { data: VSBuffer.fromString('output content'), mime: 'text/plain' };
		const htmlOutputItem = { data: VSBuffer.fromString('output content'), mime: 'text/html' };
		const output1: IOutputDto = { outputId: 'abc', outputs: [outputItem, htmlOutputItem] };
		const output2: IOutputDto = { outputId: 'def', outputs: [outputItem, htmlOutputItem] };
		const output3: IOutputDto = { outputId: 'ghi', outputs: [outputItem, htmlOutputItem] };

		await withTestNotebook(
			[
				['print(output content)', 'python', CellKind.Code, [output1, output2, output3], {}],
			],
			(editor, viewModel, disposables, accessor) => {

				const cell = viewModel.viewCells[0] as CodeCellViewModel;
				const cellTemplate = createCellTemplate(disposables);
				const output = disposables.add(accessor.createInstance(CellOutputContainer, editor, cell, cellTemplate, { limit: 100 }));
				output.render();
				cell.outputsViewModels[0].setVisible(true);
				cell.outputsViewModels[1].setVisible(true);
				cell.outputsViewModels[2].setVisible(true);
				cell.outputsViewModels[1].setVisible(false);
				assert(cellTemplate.outputContainer.domNode.style.display !== 'none', 'output container should be visible');
				assert.strictEqual(outputMenus.length, 2, 'should have 2 output menus');
			},
			instantiationService
		);
	});

	test('get all adjacent stream outputs', async () => {
		const stdout = { data: VSBuffer.fromString('stdout'), mime: 'application/vnd.code.notebook.stdout' };
		const stderr = { data: VSBuffer.fromString('stderr'), mime: 'application/vnd.code.notebook.stderr' };
		const output1: IOutputDto = { outputId: 'abc', outputs: [stdout] };
		const output2: IOutputDto = { outputId: 'abc', outputs: [stderr] };

		await withTestNotebook(
			[
				['print(output content)', 'python', CellKind.Code, [output1, output2], {}],
			],
			(_editor, viewModel) => {
				const cell = viewModel.viewCells[0];
				const notebook = viewModel.notebookDocument;
				const result = getAllOutputsText(notebook, cell);

				assert.strictEqual(result, 'stdoutstderr');
			},
			instantiationService
		);
	});

	test('get all mixed outputs of cell', async () => {
		const stdout = { data: VSBuffer.fromString('stdout'), mime: 'application/vnd.code.notebook.stdout' };
		const stderr = { data: VSBuffer.fromString('stderr'), mime: 'application/vnd.code.notebook.stderr' };
		const plainText = { data: VSBuffer.fromString('output content'), mime: 'text/plain' };
		const error = { data: VSBuffer.fromString(`{"name":"Error Name","message":"error message","stack":"error stack"}`), mime: 'application/vnd.code.notebook.error' };
		const output1: IOutputDto = { outputId: 'abc', outputs: [stdout] };
		const output2: IOutputDto = { outputId: 'abc', outputs: [stderr] };
		const output3: IOutputDto = { outputId: 'abc', outputs: [plainText] };
		const output4: IOutputDto = { outputId: 'abc', outputs: [error] };

		await withTestNotebook(
			[
				['print(output content)', 'python', CellKind.Code, [output1, output2, output3, output4], {}],
			],
			(_editor, viewModel) => {
				const cell = viewModel.viewCells[0];
				const notebook = viewModel.notebookDocument;
				const result = getAllOutputsText(notebook, cell);

				assert.strictEqual(result,
					'Cell output 1 of 3\n' +
					'stdoutstderr\n' +
					'Cell output 2 of 3\n' +
					'output content\n' +
					'Cell output 3 of 3\n' +
					'error stack'
				);
			},
			instantiationService
		);

	});


});

function createCellTemplate(disposables: DisposableStore) {
	return {
		outputContainer: new FastDomNode(document.createElement('div')),
		outputShowMoreContainer: new FastDomNode(document.createElement('div')),
		focusSinkElement: document.createElement('div'),
		templateDisposables: disposables,
		elementDisposables: disposables,
	} as unknown as CodeCellRenderTemplate;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookBrowser.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookBrowser.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ICellViewModel } from '../../browser/notebookBrowser.js';
import { CellKind } from '../../common/notebookCommon.js';
import { ICellRange } from '../../common/notebookRange.js';

/**
 * Return a set of ranges for the cells matching the given predicate
 */
function getRanges(cells: ICellViewModel[], included: (cell: ICellViewModel) => boolean): ICellRange[] {
	const ranges: ICellRange[] = [];
	let currentRange: ICellRange | undefined;

	cells.forEach((cell, idx) => {
		if (included(cell)) {
			if (!currentRange) {
				currentRange = { start: idx, end: idx + 1 };
				ranges.push(currentRange);
			} else {
				currentRange.end = idx + 1;
			}
		} else {
			currentRange = undefined;
		}
	});

	return ranges;
}


suite('notebookBrowser', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('getRanges', function () {
		const predicate = (cell: ICellViewModel) => cell.cellKind === CellKind.Code;

		test('all code', function () {
			const cells = [
				{ cellKind: CellKind.Code },
				{ cellKind: CellKind.Code },
			];
			assert.deepStrictEqual(getRanges(cells as ICellViewModel[], predicate), [{ start: 0, end: 2 }]);
		});

		test('none code', function () {
			const cells = [
				{ cellKind: CellKind.Markup },
				{ cellKind: CellKind.Markup },
			];
			assert.deepStrictEqual(getRanges(cells as ICellViewModel[], predicate), []);
		});

		test('start code', function () {
			const cells = [
				{ cellKind: CellKind.Code },
				{ cellKind: CellKind.Markup },
			];
			assert.deepStrictEqual(getRanges(cells as ICellViewModel[], predicate), [{ start: 0, end: 1 }]);
		});

		test('random', function () {
			const cells = [
				{ cellKind: CellKind.Code },
				{ cellKind: CellKind.Code },
				{ cellKind: CellKind.Markup },
				{ cellKind: CellKind.Code },
				{ cellKind: CellKind.Markup },
				{ cellKind: CellKind.Markup },
				{ cellKind: CellKind.Code },
			];
			assert.deepStrictEqual(getRanges(cells as ICellViewModel[], predicate), [{ start: 0, end: 2 }, { start: 3, end: 4 }, { start: 6, end: 7 }]);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookCellAnchor.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookCellAnchor.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ScrollEvent } from '../../../../../base/common/scrollable.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { CellFocusMode } from '../../browser/notebookBrowser.js';
import { NotebookCellAnchor } from '../../browser/view/notebookCellAnchor.js';
import { Emitter } from '../../../../../base/common/event.js';
import { INotebookExecutionStateService } from '../../common/notebookExecutionStateService.js';
import { CellKind, NotebookCellExecutionState, NotebookSetting } from '../../common/notebookCommon.js';
import { CodeCellViewModel } from '../../browser/viewModel/codeCellViewModel.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IListView } from '../../../../../base/browser/ui/list/listView.js';


suite('NotebookCellAnchor', () => {

	const store = ensureNoDisposablesAreLeakedInTestSuite();
	let focusedCell: CodeCellViewModel;
	let config: TestConfigurationService;
	let scrollEvent: Emitter<ScrollEvent>;
	let onDidStopExecution: Emitter<void>;
	let resizingCell: CodeCellViewModel;

	let cellAnchor: NotebookCellAnchor;

	setup(() => {
		config = new TestConfigurationService();
		scrollEvent = new Emitter<ScrollEvent>();
		onDidStopExecution = new Emitter<void>();

		const executionService = {
			getCellExecution: () => { return { state: NotebookCellExecutionState.Executing }; },
		} as unknown as INotebookExecutionStateService;

		resizingCell = {
			cellKind: CellKind.Code,
			onDidStopExecution: onDidStopExecution.event
		} as unknown as CodeCellViewModel;

		focusedCell = {
			focusMode: CellFocusMode.Container
		} as CodeCellViewModel;

		cellAnchor = store.add(new NotebookCellAnchor(executionService, config, scrollEvent.event));
	});

	// for the current implementation the code under test only cares about the focused cell
	// initial setup with focused cell at the bottom of the view
	class MockListView {
		focusedCellTop = 100;
		focusedCellHeight = 50;
		renderTop = 0;
		renderHeight = 150;
		element(_index: number) { return focusedCell; }
		elementTop(_index: number) { return this.focusedCellTop; }
		elementHeight(_index: number) { return this.focusedCellHeight; }
		getScrollTop() { return this.renderTop; }
	}

	test('Basic anchoring', async function () {

		focusedCell.focusMode = CellFocusMode.Editor;
		const listView = new MockListView() as unknown as IListView<CodeCellViewModel>;
		assert(cellAnchor.shouldAnchor(listView, 1, -10, resizingCell), 'should anchor if cell editor is focused');
		assert(cellAnchor.shouldAnchor(listView, 1, 10, resizingCell), 'should anchor if cell editor is focused');
		config.setUserConfiguration(NotebookSetting.scrollToRevealCell, 'none');
		assert(cellAnchor.shouldAnchor(listView, 1, 10, resizingCell), 'should anchor if cell editor is focused');

		config.setUserConfiguration(NotebookSetting.scrollToRevealCell, 'fullCell');
		focusedCell.focusMode = CellFocusMode.Container;
		assert(cellAnchor.shouldAnchor(listView, 1, 10, resizingCell), 'should anchor if cell is growing');
		focusedCell.focusMode = CellFocusMode.Output;
		assert(cellAnchor.shouldAnchor(listView, 1, 10, resizingCell), 'should anchor if cell is growing');

		assert(!cellAnchor.shouldAnchor(listView, 1, -10, resizingCell), 'should not anchor if not growing and editor not focused');

		config.setUserConfiguration(NotebookSetting.scrollToRevealCell, 'none');
		assert(!cellAnchor.shouldAnchor(listView, 1, 10, resizingCell), 'should not anchor if scroll on execute is disabled');
	});

	test('Anchor during execution until user scrolls up', async function () {
		const listView = new MockListView() as unknown as IListView<CodeCellViewModel>;
		const scrollDown = { oldScrollTop: 100, scrollTop: 150 } as ScrollEvent;
		const scrollUp = { oldScrollTop: 200, scrollTop: 150 } as ScrollEvent;

		assert(cellAnchor.shouldAnchor(listView, 1, 10, resizingCell));

		scrollEvent.fire(scrollDown);
		assert(cellAnchor.shouldAnchor(listView, 1, 10, resizingCell), 'cell should still be anchored after scrolling down');

		scrollEvent.fire(scrollUp);
		assert(!cellAnchor.shouldAnchor(listView, 1, 10, resizingCell), 'cell should not be anchored after scrolling up');
		focusedCell.focusMode = CellFocusMode.Editor;
		assert(cellAnchor.shouldAnchor(listView, 1, 10, resizingCell), 'cell should anchor again if the editor is focused');
		focusedCell.focusMode = CellFocusMode.Container;

		onDidStopExecution.fire();
		assert(cellAnchor.shouldAnchor(listView, 1, 10, resizingCell), 'cell should anchor for new execution');
	});

	test('Only anchor during when the focused cell will be pushed out of view', async function () {
		const mockListView = new MockListView();
		mockListView.focusedCellTop = 50;
		const listView = mockListView as unknown as IListView<CodeCellViewModel>;

		assert(!cellAnchor.shouldAnchor(listView, 1, 10, resizingCell), 'should not anchor if focused cell will still be fully visible after resize');
		focusedCell.focusMode = CellFocusMode.Editor;
		assert(cellAnchor.shouldAnchor(listView, 1, 10, resizingCell), 'cell should always anchor if the editor is focused');

		// fully visible focused cell would be pushed partially out of view
		assert(cellAnchor.shouldAnchor(listView, 1, 150, resizingCell), 'cell should be anchored if focused cell will be pushed out of view');
		mockListView.focusedCellTop = 110;
		// partially visible focused cell would be pushed further out of view
		assert(cellAnchor.shouldAnchor(listView, 1, 10, resizingCell), 'cell should be anchored if focused cell will be pushed out of view');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookCellLayoutManager.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookCellLayoutManager.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ICellViewModel } from '../../browser/notebookBrowser.js';
import { NotebookCellLayoutManager } from '../../browser/notebookCellLayoutManager.js';
import { INotebookCellList } from '../../browser/view/notebookRenderingCommon.js';
import { INotebookLoggingService } from '../../common/notebookLoggingService.js';
import { NotebookEditorWidget } from '../../browser/notebookEditorWidget.js';
import { NotebookViewModel } from '../../browser/viewModel/notebookViewModelImpl.js';
import { ICellRange } from '../../common/notebookRange.js';

suite('NotebookCellLayoutManager', () => {

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	const mockCellViewModel = () => {
		return { handle: 'cell1' } as unknown as ICellViewModel;
	};

	class MockList implements Pick<INotebookCellList, 'getViewIndex' | 'elementHeight' | 'inRenderingTransaction' | 'updateElementHeight2'> {
		private _height = new Map();
		getViewIndex(cell: ICellViewModel) { return this.cells.indexOf(cell) < 0 ? undefined : this.cells.indexOf(cell); }
		elementHeight(cell: ICellViewModel) { return this._height.get(cell) ?? 100; }
		inRenderingTransaction = false;
		updateElementHeight2(cell: ICellViewModel, height: number) { this._height.set(cell, height); }
		getViewIndexCalled = false;
		cells: ICellViewModel[] = [];
	}
	class MockLoggingService implements INotebookLoggingService {
		readonly _serviceBrand: undefined;
		debug() { }
		info() { }
		warn() { }
		error() { }
		trace() { }
	}
	class MockNotebookWidget implements Pick<NotebookEditorWidget, 'viewModel' | 'hasEditorFocus' | 'getAbsoluteTopOfElement' | 'getLength' | 'visibleRanges' | 'getDomNode'> {
		viewModel: NotebookViewModel | undefined = {
			hasCell: (cell: ICellViewModel) => true,
			getCellIndex: () => 0
		} as unknown as NotebookViewModel;
		hasEditorFocus() { return true; }
		getAbsoluteTopOfElement() { return 0; }
		getLength() { return 1; }
		visibleRanges: ICellRange[] = [{ start: 0, end: 0 }];
		getDomNode(): HTMLElement {
			return {
				style: {
					height: '100px'
				}
			} as HTMLElement;
		}
	}

	test('should update cell height', async () => {
		const cell = mockCellViewModel();
		const cell2 = mockCellViewModel();
		const list = new MockList();
		list.cells.push(cell);
		list.cells.push(cell2);
		const widget = new MockNotebookWidget();
		const mgr = store.add(new NotebookCellLayoutManager(widget as unknown as NotebookEditorWidget, list as unknown as INotebookCellList, new MockLoggingService()));
		mgr.layoutNotebookCell(cell, 200);
		mgr.layoutNotebookCell(cell2, 200);
		assert.strictEqual(list.elementHeight(cell), 200);
		assert.strictEqual(list.elementHeight(cell2), 200);
	});

	test('should schedule updates if already in a rendering transaction', async () => {
		const cell = mockCellViewModel();
		const cell2 = mockCellViewModel();
		const list = new MockList();
		list.inRenderingTransaction = true;
		list.cells.push(cell);
		list.cells.push(cell2);
		const widget = new MockNotebookWidget();
		const mgr = store.add(new NotebookCellLayoutManager(widget as unknown as NotebookEditorWidget, list as unknown as INotebookCellList, new MockLoggingService()));

		const promise = mgr.layoutNotebookCell(cell, 200);
		mgr.layoutNotebookCell(cell2, 200);
		assert.strictEqual(list.elementHeight(cell), 100);
		assert.strictEqual(list.elementHeight(cell2), 100);
		list.inRenderingTransaction = false;

		await promise;

		assert.strictEqual(list.elementHeight(cell), 200);
		assert.strictEqual(list.elementHeight(cell2), 200);
	});

	test('should not update if cell is hidden', async () => {
		const cell = mockCellViewModel();
		const list = new MockList();
		const widget = new MockNotebookWidget();
		const mgr = store.add(new NotebookCellLayoutManager(widget as unknown as NotebookEditorWidget, list as unknown as INotebookCellList, new MockLoggingService()));
		await mgr.layoutNotebookCell(cell, 200);
		assert.strictEqual(list.elementHeight(cell), 100);
	});

	test('should not update if height is unchanged', async () => {
		const cell = mockCellViewModel();
		const list = new MockList();
		list.cells.push(cell);
		const widget = new MockNotebookWidget();
		const mgr = store.add(new NotebookCellLayoutManager(widget as unknown as NotebookEditorWidget, list as unknown as INotebookCellList, new MockLoggingService()));
		await mgr.layoutNotebookCell(cell, 100);
		assert.strictEqual(list.elementHeight(cell), 100);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookCellList.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookCellList.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { CellKind, NotebookSetting } from '../../common/notebookCommon.js';
import { createNotebookCellList, setupInstantiationService, withTestNotebook } from './testNotebookEditor.js';

suite('NotebookCellList', () => {
	let testDisposables: DisposableStore;
	let instantiationService: TestInstantiationService;

	teardown(() => {
		testDisposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	let config: TestConfigurationService;
	setup(() => {
		testDisposables = new DisposableStore();
		instantiationService = setupInstantiationService(testDisposables);
		config = new TestConfigurationService();
		instantiationService.stub(IConfigurationService, config);
	});

	test('revealElementsInView: reveal fully visible cell should not scroll', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			async (editor, viewModel, disposables) => {
				viewModel.restoreEditorViewState({
					editingCells: [false, false, false, false, false],
					cellLineNumberStates: {},
					editorViewStates: [null, null, null, null, null],
					cellTotalHeights: [50, 100, 50, 100, 50],
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = createNotebookCellList(instantiationService, disposables);
				cellList.attachViewModel(viewModel);

				// render height 210, it can render 3 full cells and 1 partial cell
				cellList.layout(210, 100);
				// scroll a bit, scrollTop to bottom: 5, 215
				cellList.scrollTop = 5;

				// init scrollTop and scrollBottom
				assert.deepStrictEqual(cellList.scrollTop, 5);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 215);

				// reveal cell 1, top 50, bottom 150, which is fully visible in the viewport
				cellList.revealCells({ start: 1, end: 2 });
				assert.deepStrictEqual(cellList.scrollTop, 5);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 215);

				// reveal cell 2, top 150, bottom 200, which is fully visible in the viewport
				cellList.revealCells({ start: 2, end: 3 });
				assert.deepStrictEqual(cellList.scrollTop, 5);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 215);

				// reveal cell 3, top 200, bottom 300, which is partially visible in the viewport
				cellList.revealCells({ start: 3, end: 4 });
				assert.deepStrictEqual(cellList.scrollTop, 90);
			});
	});

	test('revealElementsInView: reveal partially visible cell', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			async (editor, viewModel, disposables) => {
				viewModel.restoreEditorViewState({
					editingCells: [false, false, false, false, false],
					editorViewStates: [null, null, null, null, null],
					cellTotalHeights: [50, 100, 50, 100, 50],
					cellLineNumberStates: {},
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = createNotebookCellList(instantiationService, disposables);
				cellList.attachViewModel(viewModel);

				// render height 210, it can render 3 full cells and 1 partial cell
				cellList.layout(210, 100);

				// init scrollTop and scrollBottom
				assert.deepStrictEqual(cellList.scrollTop, 0);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 210);

				// reveal cell 3, top 200, bottom 300, which is partially visible in the viewport
				cellList.revealCells({ start: 3, end: 4 });
				assert.deepStrictEqual(cellList.scrollTop, 90);

				// scroll to 5
				cellList.scrollTop = 5;
				assert.deepStrictEqual(cellList.scrollTop, 5);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 215);

				// reveal cell 0, top 0, bottom 50
				cellList.revealCells({ start: 0, end: 1 });
				assert.deepStrictEqual(cellList.scrollTop, 0);
			});
	});

	test('revealElementsInView: reveal cell out of viewport', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			async (editor, viewModel, disposables) => {
				viewModel.restoreEditorViewState({
					editingCells: [false, false, false, false, false],
					editorViewStates: [null, null, null, null, null],
					cellTotalHeights: [50, 100, 50, 100, 50],
					cellLineNumberStates: {},
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = createNotebookCellList(instantiationService, disposables);
				// without paddingBottom, the last 20 px will always be hidden due to `topInsertToolbarHeight`
				cellList.updateOptions({ paddingBottom: 100 });
				cellList.attachViewModel(viewModel);

				// render height 210, it can render 3 full cells and 1 partial cell
				cellList.layout(210, 100);

				// init scrollTop and scrollBottom
				assert.deepStrictEqual(cellList.scrollTop, 0);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 210);

				cellList.revealCells({ start: 4, end: 5 });
				assert.deepStrictEqual(cellList.scrollTop, 140);
				// assert.deepStrictEqual(cellList.getViewScrollBottom(), 330);
			});
	});

	test('updateElementHeight', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			async (editor, viewModel, disposables) => {
				viewModel.restoreEditorViewState({
					editingCells: [false, false, false, false, false],
					editorViewStates: [null, null, null, null, null],
					cellTotalHeights: [50, 100, 50, 100, 50],
					cellLineNumberStates: {},
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = createNotebookCellList(instantiationService, disposables);
				cellList.attachViewModel(viewModel);

				// render height 210, it can render 3 full cells and 1 partial cell
				cellList.layout(210, 100);

				// init scrollTop and scrollBottom
				assert.deepStrictEqual(cellList.scrollTop, 0);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 210);

				cellList.updateElementHeight(0, 60);
				assert.deepStrictEqual(cellList.scrollTop, 0);

				// scroll to 5
				cellList.scrollTop = 5;
				assert.deepStrictEqual(cellList.scrollTop, 5);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 215);

				cellList.updateElementHeight(0, 80);
				assert.deepStrictEqual(cellList.scrollTop, 5);
			});
	});

	test('updateElementHeight with anchor', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			async (editor, viewModel, disposables) => {
				viewModel.restoreEditorViewState({
					editingCells: [false, false, false, false, false],
					editorViewStates: [null, null, null, null, null],
					cellTotalHeights: [50, 100, 50, 100, 50],
					cellLineNumberStates: {},
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = createNotebookCellList(instantiationService, disposables);
				cellList.attachViewModel(viewModel);

				// render height 210, it can render 3 full cells and 1 partial cell
				cellList.layout(210, 100);

				// init scrollTop and scrollBottom
				assert.deepStrictEqual(cellList.scrollTop, 0);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 210);

				// scroll to 5
				cellList.updateElementHeight2(viewModel.cellAt(0)!, 50);
				cellList.scrollTop = 5;
				assert.deepStrictEqual(cellList.scrollTop, 5);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 215);

				cellList.setFocus([1]);
				cellList.updateElementHeight2(viewModel.cellAt(0)!, 100);
				assert.deepStrictEqual(cellList.scrollHeight, 400);

				// the first cell grows, and the focused cell will remain fully visible, so we don't scroll
				assert.deepStrictEqual(cellList.scrollTop, 5);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 215);

				cellList.updateElementHeight2(viewModel.cellAt(0)!, 150);
				// the first cell grows, and the focused cell will be pushed out of view, so we scroll down
				assert.deepStrictEqual(cellList.scrollTop, 55);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 265);

				// We don't anchor to the focused cell when cells shrink
				cellList.updateElementHeight2(viewModel.cellAt(0)!, 50);
				assert.deepStrictEqual(cellList.scrollTop, 55);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 265);

				// focus won't be visible after cell 0 grow to 250, so let's try to keep the focused cell visible
				cellList.updateElementHeight2(viewModel.cellAt(0)!, 250);
				assert.deepStrictEqual(cellList.scrollTop, 250 + 100 - cellList.renderHeight);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 250 + 100 - cellList.renderHeight + 210);
			});
	});

	test('updateElementHeight with no scrolling', async function () {
		config.setUserConfiguration(NotebookSetting.scrollToRevealCell, 'none');
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			async (editor, viewModel, disposables) => {
				viewModel.restoreEditorViewState({
					editingCells: [false, false, false, false, false],
					editorViewStates: [null, null, null, null, null],
					cellTotalHeights: [50, 100, 50, 100, 50],
					cellLineNumberStates: {},
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});
				const cellList = createNotebookCellList(instantiationService, disposables);
				cellList.attachViewModel(viewModel);

				// render height 210, it can render 3 full cells and 1 partial cell
				cellList.layout(210, 100);

				// init scrollTop and scrollBottom
				assert.deepStrictEqual(cellList.scrollTop, 0);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 210);

				// scroll to 5
				cellList.updateElementHeight2(viewModel.cellAt(0)!, 50);
				cellList.scrollTop = 5;
				assert.deepStrictEqual(cellList.scrollTop, 5);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 215);

				cellList.setFocus([1]);
				cellList.updateElementHeight2(viewModel.cellAt(0)!, 100);
				assert.deepStrictEqual(cellList.scrollHeight, 400);

				// Any change in cell size should not affect the scroll height with scrollToReveal set to none
				assert.deepStrictEqual(cellList.scrollTop, 5);

				cellList.updateElementHeight2(viewModel.cellAt(0)!, 50);
				assert.deepStrictEqual(cellList.scrollTop, 5);

				cellList.updateElementHeight2(viewModel.cellAt(0)!, 250);
				assert.deepStrictEqual(cellList.scrollTop, 5);
			});
	});

	test('updateElementHeight with no scroll setting and cell editor focused', async function () {
		config.setUserConfiguration(NotebookSetting.scrollToRevealCell, 'none');
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			async (editor, viewModel, disposables) => {
				viewModel.restoreEditorViewState({
					editingCells: [false, false, false, false, false],
					editorViewStates: [null, null, null, null, null],
					cellTotalHeights: [50, 100, 50, 100, 50],
					cellLineNumberStates: {},
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});
				const cellList = createNotebookCellList(instantiationService, disposables);
				cellList.attachViewModel(viewModel);

				// render height 210, it can render 3 full cells and 1 partial cell
				cellList.layout(210, 100);

				// init scrollTop and scrollBottom
				assert.deepStrictEqual(cellList.scrollTop, 0);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 210);

				cellList.setFocus([1]);

				editor.focusNotebookCell(cellList.viewModel?.cellAt(1)!, 'editor');
				cellList.updateElementHeight2(viewModel.cellAt(0)!, 100);
				assert.deepStrictEqual(cellList.scrollHeight, 400);

				// We have the cell editor focused, so we should anchor to that cell
				assert.deepStrictEqual(cellList.scrollTop, 50);

				cellList.updateElementHeight2(viewModel.cellAt(0)!, 50);
				assert.deepStrictEqual(cellList.scrollTop, 0);

				cellList.updateElementHeight2(viewModel.cellAt(0)!, 250);
				assert.deepStrictEqual(cellList.scrollTop, 250 + 100 - cellList.renderHeight);
			});
	});

	test('updateElementHeight with focused element out of viewport', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			async (editor, viewModel, disposables) => {
				viewModel.restoreEditorViewState({
					editingCells: [false, false, false, false, false],
					editorViewStates: [null, null, null, null, null],
					cellTotalHeights: [50, 100, 50, 100, 50],
					cellLineNumberStates: {},
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = createNotebookCellList(instantiationService, disposables);
				cellList.attachViewModel(viewModel);

				// render height 210, it can render 3 full cells and 1 partial cell
				cellList.layout(210, 100);

				// init scrollTop and scrollBottom
				assert.deepStrictEqual(cellList.scrollTop, 0);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 210);

				cellList.setFocus([4]);
				cellList.updateElementHeight2(viewModel.cellAt(1)!, 130);
				// the focus cell is not in the viewport, the scrolltop should not change at all
				assert.deepStrictEqual(cellList.scrollTop, 0);
			});
	});

	test('updateElementHeight of cells out of viewport should not trigger scroll #121140', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			async (editor, viewModel, disposables) => {
				viewModel.restoreEditorViewState({
					editingCells: [false, false, false, false, false],
					editorViewStates: [null, null, null, null, null],
					cellTotalHeights: [50, 100, 50, 100, 50],
					cellLineNumberStates: {},
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = createNotebookCellList(instantiationService, disposables);
				cellList.attachViewModel(viewModel);

				// render height 210, it can render 3 full cells and 1 partial cell
				cellList.layout(210, 100);

				// init scrollTop and scrollBottom
				assert.deepStrictEqual(cellList.scrollTop, 0);
				assert.deepStrictEqual(cellList.getViewScrollBottom(), 210);

				cellList.setFocus([1]);
				cellList.scrollTop = 80;
				assert.deepStrictEqual(cellList.scrollTop, 80);

				cellList.updateElementHeight2(viewModel.cellAt(0)!, 30);
				assert.deepStrictEqual(cellList.scrollTop, 60);
			});
	});

	test('visibleRanges should be exclusive of end', async function () {
		await withTestNotebook(
			[
			],
			async (editor, viewModel, disposables) => {
				const cellList = createNotebookCellList(instantiationService, disposables);
				cellList.attachViewModel(viewModel);

				// render height 210, it can render 3 full cells and 1 partial cell
				cellList.layout(100, 100);

				assert.deepStrictEqual(cellList.visibleRanges, []);
			});
	});

	test('visibleRanges should be exclusive of end 2', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, disposables) => {
				viewModel.restoreEditorViewState({
					editingCells: [false],
					editorViewStates: [null],
					cellTotalHeights: [50],
					cellLineNumberStates: {},
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = createNotebookCellList(instantiationService, disposables);
				cellList.attachViewModel(viewModel);

				// render height 210, it can render 3 full cells and 1 partial cell
				cellList.layout(100, 100);

				assert.deepStrictEqual(cellList.visibleRanges, [{ start: 0, end: 1 }]);
			});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookCommon.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookCommon.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { Mimes } from '../../../../../base/common/mime.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { CellKind, CellUri, diff, MimeTypeDisplayOrder, NotebookWorkingCopyTypeIdentifier } from '../../common/notebookCommon.js';
import { cellIndexesToRanges, cellRangesToIndexes, reduceCellRanges } from '../../common/notebookRange.js';
import { setupInstantiationService, TestCell } from './testNotebookEditor.js';

suite('NotebookCommon', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let languageService: ILanguageService;

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = setupInstantiationService(disposables);
		languageService = instantiationService.get(ILanguageService);
	});

	test('sortMimeTypes default orders', function () {
		assert.deepStrictEqual(new MimeTypeDisplayOrder().sort(
			[
				'application/json',
				'application/javascript',
				'text/html',
				'image/svg+xml',
				Mimes.latex,
				Mimes.markdown,
				'image/png',
				'image/jpeg',
				Mimes.text
			]),
			[
				'application/json',
				'application/javascript',
				'text/html',
				'image/svg+xml',
				Mimes.latex,
				Mimes.markdown,
				'image/png',
				'image/jpeg',
				Mimes.text
			]
		);

		assert.deepStrictEqual(new MimeTypeDisplayOrder().sort(
			[
				'application/json',
				Mimes.latex,
				Mimes.markdown,
				'application/javascript',
				'text/html',
				Mimes.text,
				'image/png',
				'image/jpeg',
				'image/svg+xml'
			]),
			[
				'application/json',
				'application/javascript',
				'text/html',
				'image/svg+xml',
				Mimes.latex,
				Mimes.markdown,
				'image/png',
				'image/jpeg',
				Mimes.text
			]
		);

		assert.deepStrictEqual(new MimeTypeDisplayOrder().sort(
			[
				Mimes.markdown,
				'application/json',
				Mimes.text,
				'image/jpeg',
				'application/javascript',
				'text/html',
				'image/png',
				'image/svg+xml'
			]),
			[
				'application/json',
				'application/javascript',
				'text/html',
				'image/svg+xml',
				Mimes.markdown,
				'image/png',
				'image/jpeg',
				Mimes.text
			]
		);

		disposables.dispose();
	});



	test('sortMimeTypes user orders', function () {
		assert.deepStrictEqual(
			new MimeTypeDisplayOrder([
				'image/png',
				Mimes.text,
				Mimes.markdown,
				'text/html',
				'application/json'
			]).sort(
				[
					'application/json',
					'application/javascript',
					'text/html',
					'image/svg+xml',
					Mimes.markdown,
					'image/png',
					'image/jpeg',
					Mimes.text
				]
			),
			[
				'image/png',
				Mimes.text,
				Mimes.markdown,
				'text/html',
				'application/json',
				'application/javascript',
				'image/svg+xml',
				'image/jpeg',
			]
		);

		assert.deepStrictEqual(
			new MimeTypeDisplayOrder([
				'application/json',
				'text/html',
				'text/html',
				Mimes.markdown,
				'application/json'
			]).sort([
				Mimes.markdown,
				'application/json',
				Mimes.text,
				'application/javascript',
				'text/html',
				'image/svg+xml',
				'image/jpeg',
				'image/png'
			]),
			[
				'application/json',
				'text/html',
				Mimes.markdown,
				'application/javascript',
				'image/svg+xml',
				'image/png',
				'image/jpeg',
				Mimes.text
			]
		);

		disposables.dispose();
	});

	test('prioritizes mimetypes', () => {
		const m = new MimeTypeDisplayOrder([
			Mimes.markdown,
			'text/html',
			'application/json'
		]);
		assert.deepStrictEqual(m.toArray(), [Mimes.markdown, 'text/html', 'application/json']);

		// no-op if already in the right order
		m.prioritize('text/html', ['application/json']);
		assert.deepStrictEqual(m.toArray(), [Mimes.markdown, 'text/html', 'application/json']);

		// sorts to highest priority
		m.prioritize('text/html', ['application/json', Mimes.markdown]);
		assert.deepStrictEqual(m.toArray(), ['text/html', Mimes.markdown, 'application/json']);

		// adds in new type
		m.prioritize('text/plain', ['application/json', Mimes.markdown]);
		assert.deepStrictEqual(m.toArray(), ['text/plain', 'text/html', Mimes.markdown, 'application/json']);

		// moves multiple, preserves order
		m.prioritize(Mimes.markdown, ['text/plain', 'application/json', Mimes.markdown]);
		assert.deepStrictEqual(m.toArray(), ['text/html', Mimes.markdown, 'text/plain', 'application/json']);

		// deletes multiple
		m.prioritize('text/plain', ['text/plain', 'text/html', Mimes.markdown]);
		assert.deepStrictEqual(m.toArray(), ['text/plain', 'text/html', Mimes.markdown, 'application/json']);

		// handles multiple mimetypes, unknown mimetype
		const m2 = new MimeTypeDisplayOrder(['a', 'b']);
		m2.prioritize('b', ['a', 'b', 'a', 'q']);
		assert.deepStrictEqual(m2.toArray(), ['b', 'a']);

		disposables.dispose();
	});

	test('sortMimeTypes glob', function () {
		assert.deepStrictEqual(
			new MimeTypeDisplayOrder([
				'application/vnd-vega*',
				Mimes.markdown,
				'text/html',
				'application/json'
			]).sort(
				[
					'application/json',
					'application/javascript',
					'text/html',
					'application/vnd-plot.json',
					'application/vnd-vega.json'
				]
			),
			[
				'application/vnd-vega.json',
				'text/html',
				'application/json',
				'application/vnd-plot.json',
				'application/javascript',
			],
			'glob *'
		);

		disposables.dispose();
	});

	test('diff cells', function () {
		const cells: TestCell[] = [];

		for (let i = 0; i < 5; i++) {
			cells.push(
				disposables.add(new TestCell('notebook', i, `var a = ${i};`, 'javascript', CellKind.Code, [], languageService))
			);
		}

		assert.deepStrictEqual(diff<TestCell>(cells, [], (cell) => {
			return cells.indexOf(cell) > -1;
		}), [
			{
				start: 0,
				deleteCount: 5,
				toInsert: []
			}
		]
		);

		assert.deepStrictEqual(diff<TestCell>([], cells, (cell) => {
			return false;
		}), [
			{
				start: 0,
				deleteCount: 0,
				toInsert: cells
			}
		]
		);

		const cellA = disposables.add(new TestCell('notebook', 6, 'var a = 6;', 'javascript', CellKind.Code, [], languageService));
		const cellB = disposables.add(new TestCell('notebook', 7, 'var a = 7;', 'javascript', CellKind.Code, [], languageService));

		const modifiedCells = [
			cells[0],
			cells[1],
			cellA,
			cells[3],
			cellB,
			cells[4]
		];

		const splices = diff<TestCell>(cells, modifiedCells, (cell) => {
			return cells.indexOf(cell) > -1;
		});

		assert.deepStrictEqual(splices,
			[
				{
					start: 2,
					deleteCount: 1,
					toInsert: [cellA]
				},
				{
					start: 4,
					deleteCount: 0,
					toInsert: [cellB]
				}
			]
		);

		disposables.dispose();
	});

});


suite('CellUri', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('parse, generate (file-scheme)', function () {

		const nb = URI.parse('file:///bar/følder/file.nb');
		const id = 17;

		const data = CellUri.generate(nb, id);
		const actual = CellUri.parse(data);
		assert.ok(Boolean(actual));
		assert.strictEqual(actual?.handle, id);
		assert.strictEqual(actual?.notebook.toString(), nb.toString());
	});

	test('parse, generate (foo-scheme)', function () {

		const nb = URI.parse('foo:///bar/følder/file.nb');
		const id = 17;

		const data = CellUri.generate(nb, id);
		const actual = CellUri.parse(data);
		assert.ok(Boolean(actual));
		assert.strictEqual(actual?.handle, id);
		assert.strictEqual(actual?.notebook.toString(), nb.toString());
	});

	test('stable order', function () {

		const nb = URI.parse('foo:///bar/følder/file.nb');
		const handles = [1, 2, 9, 10, 88, 100, 666666, 7777777];

		const uris = handles.map(h => CellUri.generate(nb, h)).sort();

		const strUris = uris.map(String).sort();
		const parsedUris = strUris.map(s => URI.parse(s));

		const actual = parsedUris.map(u => CellUri.parse(u)?.handle);

		assert.deepStrictEqual(actual, handles);
	});
});


suite('CellRange', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Cell range to index', function () {
		assert.deepStrictEqual(cellRangesToIndexes([]), []);
		assert.deepStrictEqual(cellRangesToIndexes([{ start: 0, end: 0 }]), []);
		assert.deepStrictEqual(cellRangesToIndexes([{ start: 0, end: 1 }]), [0]);
		assert.deepStrictEqual(cellRangesToIndexes([{ start: 0, end: 2 }]), [0, 1]);
		assert.deepStrictEqual(cellRangesToIndexes([{ start: 0, end: 2 }, { start: 2, end: 3 }]), [0, 1, 2]);
		assert.deepStrictEqual(cellRangesToIndexes([{ start: 0, end: 2 }, { start: 3, end: 4 }]), [0, 1, 3]);
	});

	test('Cell index to range', function () {
		assert.deepStrictEqual(cellIndexesToRanges([]), []);
		assert.deepStrictEqual(cellIndexesToRanges([0]), [{ start: 0, end: 1 }]);
		assert.deepStrictEqual(cellIndexesToRanges([0, 1]), [{ start: 0, end: 2 }]);
		assert.deepStrictEqual(cellIndexesToRanges([0, 1, 2]), [{ start: 0, end: 3 }]);
		assert.deepStrictEqual(cellIndexesToRanges([0, 1, 3]), [{ start: 0, end: 2 }, { start: 3, end: 4 }]);

		assert.deepStrictEqual(cellIndexesToRanges([1, 0]), [{ start: 0, end: 2 }]);
		assert.deepStrictEqual(cellIndexesToRanges([1, 2, 0]), [{ start: 0, end: 3 }]);
		assert.deepStrictEqual(cellIndexesToRanges([3, 1, 0]), [{ start: 0, end: 2 }, { start: 3, end: 4 }]);

		assert.deepStrictEqual(cellIndexesToRanges([9, 10]), [{ start: 9, end: 11 }]);
		assert.deepStrictEqual(cellIndexesToRanges([10, 9]), [{ start: 9, end: 11 }]);
	});

	test('Reduce ranges', function () {
		assert.deepStrictEqual(reduceCellRanges([{ start: 0, end: 1 }, { start: 1, end: 2 }]), [{ start: 0, end: 2 }]);
		assert.deepStrictEqual(reduceCellRanges([{ start: 0, end: 2 }, { start: 1, end: 3 }]), [{ start: 0, end: 3 }]);
		assert.deepStrictEqual(reduceCellRanges([{ start: 1, end: 3 }, { start: 0, end: 2 }]), [{ start: 0, end: 3 }]);
		assert.deepStrictEqual(reduceCellRanges([{ start: 0, end: 2 }, { start: 4, end: 5 }]), [{ start: 0, end: 2 }, { start: 4, end: 5 }]);

		assert.deepStrictEqual(reduceCellRanges([
			{ start: 0, end: 1 },
			{ start: 1, end: 2 },
			{ start: 4, end: 6 }
		]), [
			{ start: 0, end: 2 },
			{ start: 4, end: 6 }
		]);

		assert.deepStrictEqual(reduceCellRanges([
			{ start: 0, end: 1 },
			{ start: 1, end: 3 },
			{ start: 3, end: 4 }
		]), [
			{ start: 0, end: 4 }
		]);
	});

	test('Reduce ranges 2, empty ranges', function () {
		assert.deepStrictEqual(reduceCellRanges([{ start: 0, end: 0 }, { start: 0, end: 0 }]), [{ start: 0, end: 0 }]);
		assert.deepStrictEqual(reduceCellRanges([{ start: 0, end: 0 }, { start: 1, end: 2 }]), [{ start: 1, end: 2 }]);
		assert.deepStrictEqual(reduceCellRanges([{ start: 2, end: 2 }]), [{ start: 2, end: 2 }]);
	});
});

suite('NotebookWorkingCopyTypeIdentifier', function () {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('supports notebook type only', function () {
		const viewType = 'testViewType';
		const type = NotebookWorkingCopyTypeIdentifier.create(viewType);
		assert.deepEqual(NotebookWorkingCopyTypeIdentifier.parse(type), { notebookType: viewType, viewType });
		assert.strictEqual(NotebookWorkingCopyTypeIdentifier.parse('something'), undefined);
	});

	test('supports different viewtype', function () {
		const notebookType = { notebookType: 'testNotebookType', viewType: 'testViewType' };
		const type = NotebookWorkingCopyTypeIdentifier.create(notebookType.notebookType, notebookType.viewType);
		assert.deepEqual(NotebookWorkingCopyTypeIdentifier.parse(type), notebookType);
		assert.strictEqual(NotebookWorkingCopyTypeIdentifier.parse('something'), undefined);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookEditor.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookEditor.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { mock } from '../../../../../base/test/common/mock.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { FoldingModel, updateFoldingStateAtIndex } from '../../browser/viewModel/foldingModel.js';
import { expandCellRangesWithHiddenCells, INotebookEditor } from '../../browser/notebookBrowser.js';
import { CellKind } from '../../common/notebookCommon.js';
import { createNotebookCellList, setupInstantiationService, withTestNotebook } from './testNotebookEditor.js';
import { ListViewInfoAccessor } from '../../browser/view/notebookCellList.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';

suite('ListViewInfoAccessor', () => {
	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = setupInstantiationService(disposables);
	});

	test('basics', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, viewModel, ds) => {
				const foldingModel = ds.add(new FoldingModel());
				foldingModel.attachViewModel(viewModel);

				const cellList = ds.add(createNotebookCellList(instantiationService, ds));
				cellList.attachViewModel(viewModel);
				const listViewInfoAccessor = ds.add(new ListViewInfoAccessor(cellList));

				assert.strictEqual(listViewInfoAccessor.getViewIndex(viewModel.cellAt(0)!), 0);
				assert.strictEqual(listViewInfoAccessor.getViewIndex(viewModel.cellAt(1)!), 1);
				assert.strictEqual(listViewInfoAccessor.getViewIndex(viewModel.cellAt(2)!), 2);
				assert.strictEqual(listViewInfoAccessor.getViewIndex(viewModel.cellAt(3)!), 3);
				assert.strictEqual(listViewInfoAccessor.getViewIndex(viewModel.cellAt(4)!), 4);
				assert.deepStrictEqual(listViewInfoAccessor.getCellRangeFromViewRange(0, 1), { start: 0, end: 1 });
				assert.deepStrictEqual(listViewInfoAccessor.getCellRangeFromViewRange(1, 2), { start: 1, end: 2 });

				updateFoldingStateAtIndex(foldingModel, 0, true);
				updateFoldingStateAtIndex(foldingModel, 2, true);
				viewModel.updateFoldingRanges(foldingModel.regions);
				cellList.setHiddenAreas(viewModel.getHiddenRanges(), true);

				assert.strictEqual(listViewInfoAccessor.getViewIndex(viewModel.cellAt(0)!), 0);
				assert.strictEqual(listViewInfoAccessor.getViewIndex(viewModel.cellAt(1)!), -1);
				assert.strictEqual(listViewInfoAccessor.getViewIndex(viewModel.cellAt(2)!), 1);
				assert.strictEqual(listViewInfoAccessor.getViewIndex(viewModel.cellAt(3)!), -1);
				assert.strictEqual(listViewInfoAccessor.getViewIndex(viewModel.cellAt(4)!), -1);

				assert.deepStrictEqual(listViewInfoAccessor.getCellRangeFromViewRange(0, 1), { start: 0, end: 2 });
				assert.deepStrictEqual(listViewInfoAccessor.getCellRangeFromViewRange(1, 2), { start: 2, end: 5 });
				assert.deepStrictEqual(listViewInfoAccessor.getCellsFromViewRange(0, 1), viewModel.getCellsInRange({ start: 0, end: 2 }));
				assert.deepStrictEqual(listViewInfoAccessor.getCellsFromViewRange(1, 2), viewModel.getCellsInRange({ start: 2, end: 5 }));

				const notebookEditor = new class extends mock<INotebookEditor>() {
					override getViewIndexByModelIndex(index: number) { return listViewInfoAccessor.getViewIndex(viewModel.viewCells[index]!); }
					override getCellRangeFromViewRange(startIndex: number, endIndex: number) { return listViewInfoAccessor.getCellRangeFromViewRange(startIndex, endIndex); }
					override cellAt(index: number) { return viewModel.cellAt(index); }
				};

				assert.deepStrictEqual(expandCellRangesWithHiddenCells(notebookEditor, [{ start: 0, end: 1 }]), [{ start: 0, end: 2 }]);
				assert.deepStrictEqual(expandCellRangesWithHiddenCells(notebookEditor, [{ start: 2, end: 3 }]), [{ start: 2, end: 5 }]);
				assert.deepStrictEqual(expandCellRangesWithHiddenCells(notebookEditor, [{ start: 0, end: 1 }, { start: 2, end: 3 }]), [{ start: 0, end: 5 }]);
			});
	});
});
```

--------------------------------------------------------------------------------

````
