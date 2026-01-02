---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 213
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 213 of 552)

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

---[FILE: src/vs/editor/common/model/decorationProvider.ts]---
Location: vscode-main/src/vs/editor/common/model/decorationProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Range } from '../core/range.js';
import { IModelDecoration } from '../model.js';

export interface DecorationProvider {
	/**
	 * Gets all the decorations in a range as an array. Only `startLineNumber` and `endLineNumber` from `range` are used for filtering.
	 * So for now it returns all the decorations on the same line as `range`.
	 * @param range The range to search in
	 * @param ownerId If set, it will ignore decorations belonging to other owners.
	 * @param filterOutValidation If set, it will ignore decorations specific to validation (i.e. warnings, errors).
	 * @return An array with the decorations
	 */
	getDecorationsInRange(range: Range, ownerId?: number, filterOutValidation?: boolean): IModelDecoration[];

	/**
	 * Gets all the decorations as an array.
	 * @param ownerId If set, it will ignore decorations belonging to other owners.
	 * @param filterOutValidation If set, it will ignore decorations specific to validation (i.e. warnings, errors).
	 */
	getAllDecorations(ownerId?: number, filterOutValidation?: boolean, onlyMinimapDecorations?: boolean): IModelDecoration[];

}

export class LineHeightChangingDecoration {

	public static toKey(obj: LineHeightChangingDecoration): string {
		return `${obj.ownerId};${obj.decorationId};${obj.lineNumber}`;
	}

	constructor(
		public readonly ownerId: number,
		public readonly decorationId: string,
		public readonly lineNumber: number,
		public readonly lineHeight: number | null
	) { }
}

export class LineFontChangingDecoration {

	public static toKey(obj: LineFontChangingDecoration): string {
		return `${obj.ownerId};${obj.decorationId};${obj.lineNumber}`;
	}

	constructor(
		public readonly ownerId: number,
		public readonly decorationId: string,
		public readonly lineNumber: number
	) { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/editStack.ts]---
Location: vscode-main/src/vs/editor/common/model/editStack.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../nls.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { Selection } from '../core/selection.js';
import { EndOfLineSequence, ICursorStateComputer, IValidEditOperation, ITextModel } from '../model.js';
import { TextModel } from './textModel.js';
import { IUndoRedoService, IResourceUndoRedoElement, UndoRedoElementType, IWorkspaceUndoRedoElement, UndoRedoGroup } from '../../../platform/undoRedo/common/undoRedo.js';
import { URI } from '../../../base/common/uri.js';
import { TextChange, compressConsecutiveTextChanges } from '../core/textChange.js';
import * as buffer from '../../../base/common/buffer.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { basename } from '../../../base/common/resources.js';
import { ISingleEditOperation } from '../core/editOperation.js';
import { EditSources, TextModelEditSource } from '../textModelEditSource.js';

function uriGetComparisonKey(resource: URI): string {
	return resource.toString();
}

export class SingleModelEditStackData {

	public static create(model: ITextModel, beforeCursorState: Selection[] | null): SingleModelEditStackData {
		const alternativeVersionId = model.getAlternativeVersionId();
		const eol = getModelEOL(model);
		return new SingleModelEditStackData(
			alternativeVersionId,
			alternativeVersionId,
			eol,
			eol,
			beforeCursorState,
			beforeCursorState,
			[]
		);
	}

	constructor(
		public readonly beforeVersionId: number,
		public afterVersionId: number,
		public readonly beforeEOL: EndOfLineSequence,
		public afterEOL: EndOfLineSequence,
		public readonly beforeCursorState: Selection[] | null,
		public afterCursorState: Selection[] | null,
		public changes: TextChange[]
	) { }

	public append(model: ITextModel, textChanges: TextChange[], afterEOL: EndOfLineSequence, afterVersionId: number, afterCursorState: Selection[] | null): void {
		if (textChanges.length > 0) {
			this.changes = compressConsecutiveTextChanges(this.changes, textChanges);
		}
		this.afterEOL = afterEOL;
		this.afterVersionId = afterVersionId;
		this.afterCursorState = afterCursorState;
	}

	private static _writeSelectionsSize(selections: Selection[] | null): number {
		return 4 + 4 * 4 * (selections ? selections.length : 0);
	}

	private static _writeSelections(b: Uint8Array, selections: Selection[] | null, offset: number): number {
		buffer.writeUInt32BE(b, (selections ? selections.length : 0), offset); offset += 4;
		if (selections) {
			for (const selection of selections) {
				buffer.writeUInt32BE(b, selection.selectionStartLineNumber, offset); offset += 4;
				buffer.writeUInt32BE(b, selection.selectionStartColumn, offset); offset += 4;
				buffer.writeUInt32BE(b, selection.positionLineNumber, offset); offset += 4;
				buffer.writeUInt32BE(b, selection.positionColumn, offset); offset += 4;
			}
		}
		return offset;
	}

	private static _readSelections(b: Uint8Array, offset: number, dest: Selection[]): number {
		const count = buffer.readUInt32BE(b, offset); offset += 4;
		for (let i = 0; i < count; i++) {
			const selectionStartLineNumber = buffer.readUInt32BE(b, offset); offset += 4;
			const selectionStartColumn = buffer.readUInt32BE(b, offset); offset += 4;
			const positionLineNumber = buffer.readUInt32BE(b, offset); offset += 4;
			const positionColumn = buffer.readUInt32BE(b, offset); offset += 4;
			dest.push(new Selection(selectionStartLineNumber, selectionStartColumn, positionLineNumber, positionColumn));
		}
		return offset;
	}

	public serialize(): ArrayBuffer {
		let necessarySize = (
			+ 4 // beforeVersionId
			+ 4 // afterVersionId
			+ 1 // beforeEOL
			+ 1 // afterEOL
			+ SingleModelEditStackData._writeSelectionsSize(this.beforeCursorState)
			+ SingleModelEditStackData._writeSelectionsSize(this.afterCursorState)
			+ 4 // change count
		);
		for (const change of this.changes) {
			necessarySize += change.writeSize();
		}

		const b = new Uint8Array(necessarySize);
		let offset = 0;
		buffer.writeUInt32BE(b, this.beforeVersionId, offset); offset += 4;
		buffer.writeUInt32BE(b, this.afterVersionId, offset); offset += 4;
		buffer.writeUInt8(b, this.beforeEOL, offset); offset += 1;
		buffer.writeUInt8(b, this.afterEOL, offset); offset += 1;
		offset = SingleModelEditStackData._writeSelections(b, this.beforeCursorState, offset);
		offset = SingleModelEditStackData._writeSelections(b, this.afterCursorState, offset);
		buffer.writeUInt32BE(b, this.changes.length, offset); offset += 4;
		for (const change of this.changes) {
			offset = change.write(b, offset);
		}
		return b.buffer;
	}

	public static deserialize(source: ArrayBuffer): SingleModelEditStackData {
		const b = new Uint8Array(source);
		let offset = 0;
		const beforeVersionId = buffer.readUInt32BE(b, offset); offset += 4;
		const afterVersionId = buffer.readUInt32BE(b, offset); offset += 4;
		const beforeEOL = buffer.readUInt8(b, offset); offset += 1;
		const afterEOL = buffer.readUInt8(b, offset); offset += 1;
		const beforeCursorState: Selection[] = [];
		offset = SingleModelEditStackData._readSelections(b, offset, beforeCursorState);
		const afterCursorState: Selection[] = [];
		offset = SingleModelEditStackData._readSelections(b, offset, afterCursorState);
		const changeCount = buffer.readUInt32BE(b, offset); offset += 4;
		const changes: TextChange[] = [];
		for (let i = 0; i < changeCount; i++) {
			offset = TextChange.read(b, offset, changes);
		}
		return new SingleModelEditStackData(
			beforeVersionId,
			afterVersionId,
			beforeEOL,
			afterEOL,
			beforeCursorState,
			afterCursorState,
			changes
		);
	}
}

export interface IUndoRedoDelegate {
	prepareUndoRedo(element: MultiModelEditStackElement): Promise<IDisposable> | IDisposable | void;
}

export class SingleModelEditStackElement implements IResourceUndoRedoElement {

	public model: ITextModel | URI;
	private _data: SingleModelEditStackData | ArrayBuffer;

	public get type(): UndoRedoElementType.Resource {
		return UndoRedoElementType.Resource;
	}

	public get resource(): URI {
		if (URI.isUri(this.model)) {
			return this.model;
		}
		return this.model.uri;
	}

	constructor(
		public readonly label: string,
		public readonly code: string,
		model: ITextModel,
		beforeCursorState: Selection[] | null
	) {
		this.model = model;
		this._data = SingleModelEditStackData.create(model, beforeCursorState);
	}

	public toString(): string {
		const data = (this._data instanceof SingleModelEditStackData ? this._data : SingleModelEditStackData.deserialize(this._data));
		return data.changes.map(change => change.toString()).join(', ');
	}

	public matchesResource(resource: URI): boolean {
		const uri = (URI.isUri(this.model) ? this.model : this.model.uri);
		return (uri.toString() === resource.toString());
	}

	public setModel(model: ITextModel | URI): void {
		this.model = model;
	}

	public canAppend(model: ITextModel): boolean {
		return (this.model === model && this._data instanceof SingleModelEditStackData);
	}

	public append(model: ITextModel, textChanges: TextChange[], afterEOL: EndOfLineSequence, afterVersionId: number, afterCursorState: Selection[] | null): void {
		if (this._data instanceof SingleModelEditStackData) {
			this._data.append(model, textChanges, afterEOL, afterVersionId, afterCursorState);
		}
	}

	public close(): void {
		if (this._data instanceof SingleModelEditStackData) {
			this._data = this._data.serialize();
		}
	}

	public open(): void {
		if (!(this._data instanceof SingleModelEditStackData)) {
			this._data = SingleModelEditStackData.deserialize(this._data);
		}
	}

	public undo(): void {
		if (URI.isUri(this.model)) {
			// don't have a model
			throw new Error(`Invalid SingleModelEditStackElement`);
		}
		if (this._data instanceof SingleModelEditStackData) {
			this._data = this._data.serialize();
		}
		const data = SingleModelEditStackData.deserialize(this._data);
		this.model._applyUndo(data.changes, data.beforeEOL, data.beforeVersionId, data.beforeCursorState);
	}

	public redo(): void {
		if (URI.isUri(this.model)) {
			// don't have a model
			throw new Error(`Invalid SingleModelEditStackElement`);
		}
		if (this._data instanceof SingleModelEditStackData) {
			this._data = this._data.serialize();
		}
		const data = SingleModelEditStackData.deserialize(this._data);
		this.model._applyRedo(data.changes, data.afterEOL, data.afterVersionId, data.afterCursorState);
	}

	public heapSize(): number {
		if (this._data instanceof SingleModelEditStackData) {
			this._data = this._data.serialize();
		}
		return this._data.byteLength + 168/*heap overhead*/;
	}
}

export class MultiModelEditStackElement implements IWorkspaceUndoRedoElement {

	public readonly type = UndoRedoElementType.Workspace;
	private _isOpen: boolean;

	private readonly _editStackElementsArr: SingleModelEditStackElement[];
	private readonly _editStackElementsMap: Map<string, SingleModelEditStackElement>;

	private _delegate: IUndoRedoDelegate | null;

	public get resources(): readonly URI[] {
		return this._editStackElementsArr.map(editStackElement => editStackElement.resource);
	}

	constructor(
		public readonly label: string,
		public readonly code: string,
		editStackElements: SingleModelEditStackElement[]
	) {
		this._isOpen = true;
		this._editStackElementsArr = editStackElements.slice(0);
		this._editStackElementsMap = new Map<string, SingleModelEditStackElement>();
		for (const editStackElement of this._editStackElementsArr) {
			const key = uriGetComparisonKey(editStackElement.resource);
			this._editStackElementsMap.set(key, editStackElement);
		}
		this._delegate = null;
	}

	public setDelegate(delegate: IUndoRedoDelegate): void {
		this._delegate = delegate;
	}

	public prepareUndoRedo(): Promise<IDisposable> | IDisposable | void {
		if (this._delegate) {
			return this._delegate.prepareUndoRedo(this);
		}
	}

	public getMissingModels(): URI[] {
		const result: URI[] = [];
		for (const editStackElement of this._editStackElementsArr) {
			if (URI.isUri(editStackElement.model)) {
				result.push(editStackElement.model);
			}
		}
		return result;
	}

	public matchesResource(resource: URI): boolean {
		const key = uriGetComparisonKey(resource);
		return (this._editStackElementsMap.has(key));
	}

	public setModel(model: ITextModel | URI): void {
		const key = uriGetComparisonKey(URI.isUri(model) ? model : model.uri);
		if (this._editStackElementsMap.has(key)) {
			this._editStackElementsMap.get(key)!.setModel(model);
		}
	}

	public canAppend(model: ITextModel): boolean {
		if (!this._isOpen) {
			return false;
		}
		const key = uriGetComparisonKey(model.uri);
		if (this._editStackElementsMap.has(key)) {
			const editStackElement = this._editStackElementsMap.get(key)!;
			return editStackElement.canAppend(model);
		}
		return false;
	}

	public append(model: ITextModel, textChanges: TextChange[], afterEOL: EndOfLineSequence, afterVersionId: number, afterCursorState: Selection[] | null): void {
		const key = uriGetComparisonKey(model.uri);
		const editStackElement = this._editStackElementsMap.get(key)!;
		editStackElement.append(model, textChanges, afterEOL, afterVersionId, afterCursorState);
	}

	public close(): void {
		this._isOpen = false;
	}

	public open(): void {
		// cannot reopen
	}

	public undo(): void {
		this._isOpen = false;

		for (const editStackElement of this._editStackElementsArr) {
			editStackElement.undo();
		}
	}

	public redo(): void {
		for (const editStackElement of this._editStackElementsArr) {
			editStackElement.redo();
		}
	}

	public heapSize(resource: URI): number {
		const key = uriGetComparisonKey(resource);
		if (this._editStackElementsMap.has(key)) {
			const editStackElement = this._editStackElementsMap.get(key)!;
			return editStackElement.heapSize();
		}
		return 0;
	}

	public split(): IResourceUndoRedoElement[] {
		return this._editStackElementsArr;
	}

	public toString(): string {
		const result: string[] = [];
		for (const editStackElement of this._editStackElementsArr) {
			result.push(`${basename(editStackElement.resource)}: ${editStackElement}`);
		}
		return `{${result.join(', ')}}`;
	}
}

export type EditStackElement = SingleModelEditStackElement | MultiModelEditStackElement;

function getModelEOL(model: ITextModel): EndOfLineSequence {
	const eol = model.getEOL();
	if (eol === '\n') {
		return EndOfLineSequence.LF;
	} else {
		return EndOfLineSequence.CRLF;
	}
}

export function isEditStackElement(element: IResourceUndoRedoElement | IWorkspaceUndoRedoElement | null): element is EditStackElement {
	if (!element) {
		return false;
	}
	return ((element instanceof SingleModelEditStackElement) || (element instanceof MultiModelEditStackElement));
}

export class EditStack {

	private readonly _model: TextModel;
	private readonly _undoRedoService: IUndoRedoService;

	constructor(model: TextModel, undoRedoService: IUndoRedoService) {
		this._model = model;
		this._undoRedoService = undoRedoService;
	}

	public pushStackElement(): void {
		const lastElement = this._undoRedoService.getLastElement(this._model.uri);
		if (isEditStackElement(lastElement)) {
			lastElement.close();
		}
	}

	public popStackElement(): void {
		const lastElement = this._undoRedoService.getLastElement(this._model.uri);
		if (isEditStackElement(lastElement)) {
			lastElement.open();
		}
	}

	public clear(): void {
		this._undoRedoService.removeElements(this._model.uri);
	}

	private _getOrCreateEditStackElement(beforeCursorState: Selection[] | null, group: UndoRedoGroup | undefined): EditStackElement {
		const lastElement = this._undoRedoService.getLastElement(this._model.uri);
		if (isEditStackElement(lastElement) && lastElement.canAppend(this._model)) {
			return lastElement;
		}
		const newElement = new SingleModelEditStackElement(nls.localize('edit', "Typing"), 'undoredo.textBufferEdit', this._model, beforeCursorState);
		this._undoRedoService.pushElement(newElement, group);
		return newElement;
	}

	public pushEOL(eol: EndOfLineSequence): void {
		const editStackElement = this._getOrCreateEditStackElement(null, undefined);
		this._model.setEOL(eol);
		editStackElement.append(this._model, [], getModelEOL(this._model), this._model.getAlternativeVersionId(), null);
	}

	public pushEditOperation(beforeCursorState: Selection[] | null, editOperations: ISingleEditOperation[], cursorStateComputer: ICursorStateComputer | null, group?: UndoRedoGroup, reason: TextModelEditSource = EditSources.unknown({ name: 'pushEditOperation' })): Selection[] | null {
		const editStackElement = this._getOrCreateEditStackElement(beforeCursorState, group);
		const inverseEditOperations = this._model.applyEdits(editOperations, true, reason);
		const afterCursorState = EditStack._computeCursorState(cursorStateComputer, inverseEditOperations);
		const textChanges = inverseEditOperations.map((op, index) => ({ index: index, textChange: op.textChange }));
		textChanges.sort((a, b) => {
			if (a.textChange.oldPosition === b.textChange.oldPosition) {
				return a.index - b.index;
			}
			return a.textChange.oldPosition - b.textChange.oldPosition;
		});
		editStackElement.append(this._model, textChanges.map(op => op.textChange), getModelEOL(this._model), this._model.getAlternativeVersionId(), afterCursorState);
		return afterCursorState;
	}

	private static _computeCursorState(cursorStateComputer: ICursorStateComputer | null, inverseEditOperations: IValidEditOperation[]): Selection[] | null {
		try {
			return cursorStateComputer ? cursorStateComputer(inverseEditOperations) : null;
		} catch (e) {
			onUnexpectedError(e);
			return null;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/fixedArray.ts]---
Location: vscode-main/src/vs/editor/common/model/fixedArray.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { arrayInsert } from '../../../base/common/arrays.js';

/**
 * An array that avoids being sparse by always
 * filling up unused indices with a default value.
 */
export class FixedArray<T> {
	private _store: T[] = [];

	constructor(
		private readonly _default: T
	) { }

	public get(index: number): T {
		if (index < this._store.length) {
			return this._store[index];
		}
		return this._default;
	}

	public set(index: number, value: T): void {
		while (index >= this._store.length) {
			this._store[this._store.length] = this._default;
		}
		this._store[index] = value;
	}

	public replace(index: number, oldLength: number, newLength: number): void {
		if (index >= this._store.length) {
			return;
		}

		if (oldLength === 0) {
			this.insert(index, newLength);
			return;
		} else if (newLength === 0) {
			this.delete(index, oldLength);
			return;
		}

		const before = this._store.slice(0, index);
		const after = this._store.slice(index + oldLength);
		const insertArr = arrayFill(newLength, this._default);
		this._store = before.concat(insertArr, after);
	}

	public delete(deleteIndex: number, deleteCount: number): void {
		if (deleteCount === 0 || deleteIndex >= this._store.length) {
			return;
		}
		this._store.splice(deleteIndex, deleteCount);
	}

	public insert(insertIndex: number, insertCount: number): void {
		if (insertCount === 0 || insertIndex >= this._store.length) {
			return;
		}
		const arr: T[] = [];
		for (let i = 0; i < insertCount; i++) {
			arr[i] = this._default;
		}
		this._store = arrayInsert(this._store, insertIndex, arr);
	}
}

function arrayFill<T>(length: number, value: T): T[] {
	const arr: T[] = [];
	for (let i = 0; i < length; i++) {
		arr[i] = value;
	}
	return arr;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/guidesTextModelPart.ts]---
Location: vscode-main/src/vs/editor/common/model/guidesTextModelPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { findLast } from '../../../base/common/arraysFind.js';
import * as strings from '../../../base/common/strings.js';
import { CursorColumns } from '../core/cursorColumns.js';
import { IPosition, Position } from '../core/position.js';
import { Range } from '../core/range.js';
import type { TextModel } from './textModel.js';
import { TextModelPart } from './textModelPart.js';
import { computeIndentLevel } from './utils.js';
import { ILanguageConfigurationService, ResolvedLanguageConfiguration } from '../languages/languageConfigurationRegistry.js';
import { BracketGuideOptions, HorizontalGuidesState, IActiveIndentGuideInfo, IGuidesTextModelPart, IndentGuide, IndentGuideHorizontalLine } from '../textModelGuides.js';
import { BugIndicatingError } from '../../../base/common/errors.js';

export class GuidesTextModelPart extends TextModelPart implements IGuidesTextModelPart {
	constructor(
		private readonly textModel: TextModel,
		private readonly languageConfigurationService: ILanguageConfigurationService
	) {
		super();
	}

	private getLanguageConfiguration(
		languageId: string
	): ResolvedLanguageConfiguration {
		return this.languageConfigurationService.getLanguageConfiguration(
			languageId
		);
	}

	private _computeIndentLevel(lineIndex: number): number {
		return computeIndentLevel(
			this.textModel.getLineContent(lineIndex + 1),
			this.textModel.getOptions().tabSize
		);
	}

	public getActiveIndentGuide(
		lineNumber: number,
		minLineNumber: number,
		maxLineNumber: number
	): IActiveIndentGuideInfo {
		this.assertNotDisposed();
		const lineCount = this.textModel.getLineCount();

		if (lineNumber < 1 || lineNumber > lineCount) {
			throw new BugIndicatingError('Illegal value for lineNumber');
		}

		const foldingRules = this.getLanguageConfiguration(
			this.textModel.getLanguageId()
		).foldingRules;
		const offSide = Boolean(foldingRules && foldingRules.offSide);

		let up_aboveContentLineIndex =
			-2; /* -2 is a marker for not having computed it */
		let up_aboveContentLineIndent = -1;
		let up_belowContentLineIndex =
			-2; /* -2 is a marker for not having computed it */
		let up_belowContentLineIndent = -1;
		const up_resolveIndents = (lineNumber: number) => {
			if (
				up_aboveContentLineIndex !== -1 &&
				(up_aboveContentLineIndex === -2 ||
					up_aboveContentLineIndex > lineNumber - 1)
			) {
				up_aboveContentLineIndex = -1;
				up_aboveContentLineIndent = -1;

				// must find previous line with content
				for (let lineIndex = lineNumber - 2; lineIndex >= 0; lineIndex--) {
					const indent = this._computeIndentLevel(lineIndex);
					if (indent >= 0) {
						up_aboveContentLineIndex = lineIndex;
						up_aboveContentLineIndent = indent;
						break;
					}
				}
			}

			if (up_belowContentLineIndex === -2) {
				up_belowContentLineIndex = -1;
				up_belowContentLineIndent = -1;

				// must find next line with content
				for (let lineIndex = lineNumber; lineIndex < lineCount; lineIndex++) {
					const indent = this._computeIndentLevel(lineIndex);
					if (indent >= 0) {
						up_belowContentLineIndex = lineIndex;
						up_belowContentLineIndent = indent;
						break;
					}
				}
			}
		};

		let down_aboveContentLineIndex =
			-2; /* -2 is a marker for not having computed it */
		let down_aboveContentLineIndent = -1;
		let down_belowContentLineIndex =
			-2; /* -2 is a marker for not having computed it */
		let down_belowContentLineIndent = -1;
		const down_resolveIndents = (lineNumber: number) => {
			if (down_aboveContentLineIndex === -2) {
				down_aboveContentLineIndex = -1;
				down_aboveContentLineIndent = -1;

				// must find previous line with content
				for (let lineIndex = lineNumber - 2; lineIndex >= 0; lineIndex--) {
					const indent = this._computeIndentLevel(lineIndex);
					if (indent >= 0) {
						down_aboveContentLineIndex = lineIndex;
						down_aboveContentLineIndent = indent;
						break;
					}
				}
			}

			if (
				down_belowContentLineIndex !== -1 &&
				(down_belowContentLineIndex === -2 ||
					down_belowContentLineIndex < lineNumber - 1)
			) {
				down_belowContentLineIndex = -1;
				down_belowContentLineIndent = -1;

				// must find next line with content
				for (let lineIndex = lineNumber; lineIndex < lineCount; lineIndex++) {
					const indent = this._computeIndentLevel(lineIndex);
					if (indent >= 0) {
						down_belowContentLineIndex = lineIndex;
						down_belowContentLineIndent = indent;
						break;
					}
				}
			}
		};

		let startLineNumber = 0;
		let goUp = true;
		let endLineNumber = 0;
		let goDown = true;
		let indent = 0;

		let initialIndent = 0;

		for (let distance = 0; goUp || goDown; distance++) {
			const upLineNumber = lineNumber - distance;
			const downLineNumber = lineNumber + distance;

			if (distance > 1 && (upLineNumber < 1 || upLineNumber < minLineNumber)) {
				goUp = false;
			}
			if (
				distance > 1 &&
				(downLineNumber > lineCount || downLineNumber > maxLineNumber)
			) {
				goDown = false;
			}
			if (distance > 50000) {
				// stop processing
				goUp = false;
				goDown = false;
			}

			let upLineIndentLevel: number = -1;
			if (goUp && upLineNumber >= 1) {
				// compute indent level going up
				const currentIndent = this._computeIndentLevel(upLineNumber - 1);
				if (currentIndent >= 0) {
					// This line has content (besides whitespace)
					// Use the line's indent
					up_belowContentLineIndex = upLineNumber - 1;
					up_belowContentLineIndent = currentIndent;
					upLineIndentLevel = Math.ceil(
						currentIndent / this.textModel.getOptions().indentSize
					);
				} else {
					up_resolveIndents(upLineNumber);
					upLineIndentLevel = this._getIndentLevelForWhitespaceLine(
						offSide,
						up_aboveContentLineIndent,
						up_belowContentLineIndent
					);
				}
			}

			let downLineIndentLevel = -1;
			if (goDown && downLineNumber <= lineCount) {
				// compute indent level going down
				const currentIndent = this._computeIndentLevel(downLineNumber - 1);
				if (currentIndent >= 0) {
					// This line has content (besides whitespace)
					// Use the line's indent
					down_aboveContentLineIndex = downLineNumber - 1;
					down_aboveContentLineIndent = currentIndent;
					downLineIndentLevel = Math.ceil(
						currentIndent / this.textModel.getOptions().indentSize
					);
				} else {
					down_resolveIndents(downLineNumber);
					downLineIndentLevel = this._getIndentLevelForWhitespaceLine(
						offSide,
						down_aboveContentLineIndent,
						down_belowContentLineIndent
					);
				}
			}

			if (distance === 0) {
				initialIndent = upLineIndentLevel;
				continue;
			}

			if (distance === 1) {
				if (
					downLineNumber <= lineCount &&
					downLineIndentLevel >= 0 &&
					initialIndent + 1 === downLineIndentLevel
				) {
					// This is the beginning of a scope, we have special handling here, since we want the
					// child scope indent to be active, not the parent scope
					goUp = false;
					startLineNumber = downLineNumber;
					endLineNumber = downLineNumber;
					indent = downLineIndentLevel;
					continue;
				}

				if (
					upLineNumber >= 1 &&
					upLineIndentLevel >= 0 &&
					upLineIndentLevel - 1 === initialIndent
				) {
					// This is the end of a scope, just like above
					goDown = false;
					startLineNumber = upLineNumber;
					endLineNumber = upLineNumber;
					indent = upLineIndentLevel;
					continue;
				}

				startLineNumber = lineNumber;
				endLineNumber = lineNumber;
				indent = initialIndent;
				if (indent === 0) {
					// No need to continue
					return { startLineNumber, endLineNumber, indent };
				}
			}

			if (goUp) {
				if (upLineIndentLevel >= indent) {
					startLineNumber = upLineNumber;
				} else {
					goUp = false;
				}
			}
			if (goDown) {
				if (downLineIndentLevel >= indent) {
					endLineNumber = downLineNumber;
				} else {
					goDown = false;
				}
			}
		}

		return { startLineNumber, endLineNumber, indent };
	}

	public getLinesBracketGuides(
		startLineNumber: number,
		endLineNumber: number,
		activePosition: IPosition | null,
		options: BracketGuideOptions
	): IndentGuide[][] {
		const result: IndentGuide[][] = [];
		for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
			result.push([]);
		}

		// If requested, this could be made configurable.
		const includeSingleLinePairs = true;

		const bracketPairs =
			this.textModel.bracketPairs.getBracketPairsInRangeWithMinIndentation(
				new Range(
					startLineNumber,
					1,
					endLineNumber,
					this.textModel.getLineMaxColumn(endLineNumber)
				)
			).toArray();

		let activeBracketPairRange: Range | undefined = undefined;
		if (activePosition && bracketPairs.length > 0) {
			const bracketsContainingActivePosition = (
				startLineNumber <= activePosition.lineNumber &&
					activePosition.lineNumber <= endLineNumber
					// We don't need to query the brackets again if the cursor is in the viewport
					? bracketPairs
					: this.textModel.bracketPairs.getBracketPairsInRange(
						Range.fromPositions(activePosition)
					).toArray()
			).filter((bp) => Range.strictContainsPosition(bp.range, activePosition));

			activeBracketPairRange = findLast(
				bracketsContainingActivePosition,
				(i) => includeSingleLinePairs || i.range.startLineNumber !== i.range.endLineNumber
			)?.range;
		}

		const independentColorPoolPerBracketType = this.textModel.getOptions().bracketPairColorizationOptions.independentColorPoolPerBracketType;
		const colorProvider = new BracketPairGuidesClassNames();

		for (const pair of bracketPairs) {
			/*


					{
					|
					}

					{
					|
					----}

				____{
				|test
				----}

				renderHorizontalEndLineAtTheBottom:
					{
					|
					|x}
					--
				renderHorizontalEndLineAtTheBottom:
				____{
				|test
				| x }
				----
			*/

			if (!pair.closingBracketRange) {
				continue;
			}

			const isActive = activeBracketPairRange && pair.range.equalsRange(activeBracketPairRange);

			if (!isActive && !options.includeInactive) {
				continue;
			}

			const className =
				colorProvider.getInlineClassName(pair.nestingLevel, pair.nestingLevelOfEqualBracketType, independentColorPoolPerBracketType) +
				(options.highlightActive && isActive
					? ' ' + colorProvider.activeClassName
					: '');


			const start = pair.openingBracketRange.getStartPosition();
			const end = pair.closingBracketRange.getStartPosition();

			const horizontalGuides = options.horizontalGuides === HorizontalGuidesState.Enabled || (options.horizontalGuides === HorizontalGuidesState.EnabledForActive && isActive);

			if (pair.range.startLineNumber === pair.range.endLineNumber) {
				if (includeSingleLinePairs && horizontalGuides) {

					result[pair.range.startLineNumber - startLineNumber].push(
						new IndentGuide(
							-1,
							pair.openingBracketRange.getEndPosition().column,
							className,
							new IndentGuideHorizontalLine(false, end.column),
							-1,
							-1,
						)
					);

				}
				continue;
			}

			const endVisibleColumn = this.getVisibleColumnFromPosition(end);
			const startVisibleColumn = this.getVisibleColumnFromPosition(
				pair.openingBracketRange.getStartPosition()
			);
			const guideVisibleColumn = Math.min(startVisibleColumn, endVisibleColumn, pair.minVisibleColumnIndentation + 1);

			let renderHorizontalEndLineAtTheBottom = false;


			const firstNonWsIndex = strings.firstNonWhitespaceIndex(
				this.textModel.getLineContent(
					pair.closingBracketRange.startLineNumber
				)
			);
			const hasTextBeforeClosingBracket = firstNonWsIndex < pair.closingBracketRange.startColumn - 1;
			if (hasTextBeforeClosingBracket) {
				renderHorizontalEndLineAtTheBottom = true;
			}


			const visibleGuideStartLineNumber = Math.max(start.lineNumber, startLineNumber);
			const visibleGuideEndLineNumber = Math.min(end.lineNumber, endLineNumber);

			const offset = renderHorizontalEndLineAtTheBottom ? 1 : 0;

			for (let l = visibleGuideStartLineNumber; l < visibleGuideEndLineNumber + offset; l++) {
				result[l - startLineNumber].push(
					new IndentGuide(
						guideVisibleColumn,
						-1,
						className,
						null,
						l === start.lineNumber ? start.column : -1,
						l === end.lineNumber ? end.column : -1
					)
				);
			}

			if (horizontalGuides) {
				if (start.lineNumber >= startLineNumber && startVisibleColumn > guideVisibleColumn) {
					result[start.lineNumber - startLineNumber].push(
						new IndentGuide(
							guideVisibleColumn,
							-1,
							className,
							new IndentGuideHorizontalLine(false, start.column),
							-1,
							-1,
						)
					);
				}

				if (end.lineNumber <= endLineNumber && endVisibleColumn > guideVisibleColumn) {
					result[end.lineNumber - startLineNumber].push(
						new IndentGuide(
							guideVisibleColumn,
							-1,
							className,
							new IndentGuideHorizontalLine(!renderHorizontalEndLineAtTheBottom, end.column),
							-1,
							-1,
						)
					);
				}
			}
		}

		for (const guides of result) {
			guides.sort((a, b) => a.visibleColumn - b.visibleColumn);
		}

		return result;
	}

	private getVisibleColumnFromPosition(position: Position): number {
		return (
			CursorColumns.visibleColumnFromColumn(
				this.textModel.getLineContent(position.lineNumber),
				position.column,
				this.textModel.getOptions().tabSize
			) + 1
		);
	}

	public getLinesIndentGuides(
		startLineNumber: number,
		endLineNumber: number
	): number[] {
		this.assertNotDisposed();
		const lineCount = this.textModel.getLineCount();

		if (startLineNumber < 1 || startLineNumber > lineCount) {
			throw new Error('Illegal value for startLineNumber');
		}
		if (endLineNumber < 1 || endLineNumber > lineCount) {
			throw new Error('Illegal value for endLineNumber');
		}

		const options = this.textModel.getOptions();
		const foldingRules = this.getLanguageConfiguration(
			this.textModel.getLanguageId()
		).foldingRules;
		const offSide = Boolean(foldingRules && foldingRules.offSide);

		const result: number[] = new Array<number>(
			endLineNumber - startLineNumber + 1
		);

		let aboveContentLineIndex =
			-2; /* -2 is a marker for not having computed it */
		let aboveContentLineIndent = -1;

		let belowContentLineIndex =
			-2; /* -2 is a marker for not having computed it */
		let belowContentLineIndent = -1;

		for (
			let lineNumber = startLineNumber;
			lineNumber <= endLineNumber;
			lineNumber++
		) {
			const resultIndex = lineNumber - startLineNumber;

			const currentIndent = this._computeIndentLevel(lineNumber - 1);
			if (currentIndent >= 0) {
				// This line has content (besides whitespace)
				// Use the line's indent
				aboveContentLineIndex = lineNumber - 1;
				aboveContentLineIndent = currentIndent;
				result[resultIndex] = Math.ceil(currentIndent / options.indentSize);
				continue;
			}

			if (aboveContentLineIndex === -2) {
				aboveContentLineIndex = -1;
				aboveContentLineIndent = -1;

				// must find previous line with content
				for (let lineIndex = lineNumber - 2; lineIndex >= 0; lineIndex--) {
					const indent = this._computeIndentLevel(lineIndex);
					if (indent >= 0) {
						aboveContentLineIndex = lineIndex;
						aboveContentLineIndent = indent;
						break;
					}
				}
			}

			if (
				belowContentLineIndex !== -1 &&
				(belowContentLineIndex === -2 || belowContentLineIndex < lineNumber - 1)
			) {
				belowContentLineIndex = -1;
				belowContentLineIndent = -1;

				// must find next line with content
				for (let lineIndex = lineNumber; lineIndex < lineCount; lineIndex++) {
					const indent = this._computeIndentLevel(lineIndex);
					if (indent >= 0) {
						belowContentLineIndex = lineIndex;
						belowContentLineIndent = indent;
						break;
					}
				}
			}

			result[resultIndex] = this._getIndentLevelForWhitespaceLine(
				offSide,
				aboveContentLineIndent,
				belowContentLineIndent
			);
		}
		return result;
	}

	private _getIndentLevelForWhitespaceLine(
		offSide: boolean,
		aboveContentLineIndent: number,
		belowContentLineIndent: number
	): number {
		const options = this.textModel.getOptions();

		if (aboveContentLineIndent === -1 || belowContentLineIndent === -1) {
			// At the top or bottom of the file
			return 0;
		} else if (aboveContentLineIndent < belowContentLineIndent) {
			// we are inside the region above
			return 1 + Math.floor(aboveContentLineIndent / options.indentSize);
		} else if (aboveContentLineIndent === belowContentLineIndent) {
			// we are in between two regions
			return Math.ceil(belowContentLineIndent / options.indentSize);
		} else {
			if (offSide) {
				// same level as region below
				return Math.ceil(belowContentLineIndent / options.indentSize);
			} else {
				// we are inside the region that ends below
				return 1 + Math.floor(belowContentLineIndent / options.indentSize);
			}
		}
	}
}

export class BracketPairGuidesClassNames {
	public readonly activeClassName = 'indent-active';

	getInlineClassName(nestingLevel: number, nestingLevelOfEqualBracketType: number, independentColorPoolPerBracketType: boolean): string {
		return this.getInlineClassNameOfLevel(independentColorPoolPerBracketType ? nestingLevelOfEqualBracketType : nestingLevel);
	}

	getInlineClassNameOfLevel(level: number): string {
		// To support a dynamic amount of colors up to 6 colors,
		// we use a number that is a lcm of all numbers from 1 to 6.
		return `bracket-indent-guide lvl-${level % 30}`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/indentationGuesser.ts]---
Location: vscode-main/src/vs/editor/common/model/indentationGuesser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';
import { ITextBuffer } from '../model.js';

class SpacesDiffResult {
	public spacesDiff: number = 0;
	public looksLikeAlignment: boolean = false;
}

/**
 * Compute the diff in spaces between two line's indentation.
 */
function spacesDiff(a: string, aLength: number, b: string, bLength: number, result: SpacesDiffResult): void {

	result.spacesDiff = 0;
	result.looksLikeAlignment = false;

	// This can go both ways (e.g.):
	//  - a: "\t"
	//  - b: "\t    "
	//  => This should count 1 tab and 4 spaces

	let i: number;

	for (i = 0; i < aLength && i < bLength; i++) {
		const aCharCode = a.charCodeAt(i);
		const bCharCode = b.charCodeAt(i);

		if (aCharCode !== bCharCode) {
			break;
		}
	}

	let aSpacesCnt = 0, aTabsCount = 0;
	for (let j = i; j < aLength; j++) {
		const aCharCode = a.charCodeAt(j);
		if (aCharCode === CharCode.Space) {
			aSpacesCnt++;
		} else {
			aTabsCount++;
		}
	}

	let bSpacesCnt = 0, bTabsCount = 0;
	for (let j = i; j < bLength; j++) {
		const bCharCode = b.charCodeAt(j);
		if (bCharCode === CharCode.Space) {
			bSpacesCnt++;
		} else {
			bTabsCount++;
		}
	}

	if (aSpacesCnt > 0 && aTabsCount > 0) {
		return;
	}
	if (bSpacesCnt > 0 && bTabsCount > 0) {
		return;
	}

	const tabsDiff = Math.abs(aTabsCount - bTabsCount);
	const spacesDiff = Math.abs(aSpacesCnt - bSpacesCnt);

	if (tabsDiff === 0) {
		// check if the indentation difference might be caused by alignment reasons
		// sometime folks like to align their code, but this should not be used as a hint
		result.spacesDiff = spacesDiff;

		if (spacesDiff > 0 && 0 <= bSpacesCnt - 1 && bSpacesCnt - 1 < a.length && bSpacesCnt < b.length) {
			if (b.charCodeAt(bSpacesCnt) !== CharCode.Space && a.charCodeAt(bSpacesCnt - 1) === CharCode.Space) {
				if (a.charCodeAt(a.length - 1) === CharCode.Comma) {
					// This looks like an alignment desire: e.g.
					// const a = b + c,
					//       d = b - c;
					result.looksLikeAlignment = true;
				}
			}
		}
		return;
	}
	if (spacesDiff % tabsDiff === 0) {
		result.spacesDiff = spacesDiff / tabsDiff;
		return;
	}
}

/**
 * Result for a guessIndentation
 */
export interface IGuessedIndentation {
	/**
	 * If indentation is based on spaces (`insertSpaces` = true), then what is the number of spaces that make an indent?
	 */
	tabSize: number;
	/**
	 * Is indentation based on spaces?
	 */
	insertSpaces: boolean;
}

export function guessIndentation(source: ITextBuffer, defaultTabSize: number, defaultInsertSpaces: boolean): IGuessedIndentation {
	// Look at most at the first 10k lines
	const linesCount = Math.min(source.getLineCount(), 10000);

	let linesIndentedWithTabsCount = 0;				// number of lines that contain at least one tab in indentation
	let linesIndentedWithSpacesCount = 0;			// number of lines that contain only spaces in indentation

	let previousLineText = '';						// content of latest line that contained non-whitespace chars
	let previousLineIndentation = 0;				// index at which latest line contained the first non-whitespace char

	const ALLOWED_TAB_SIZE_GUESSES = [2, 4, 6, 8, 3, 5, 7];	// prefer even guesses for `tabSize`, limit to [2, 8].
	const MAX_ALLOWED_TAB_SIZE_GUESS = 8;			// max(ALLOWED_TAB_SIZE_GUESSES) = 8

	const spacesDiffCount = [0, 0, 0, 0, 0, 0, 0, 0, 0];		// `tabSize` scores
	const tmp = new SpacesDiffResult();

	for (let lineNumber = 1; lineNumber <= linesCount; lineNumber++) {
		const currentLineLength = source.getLineLength(lineNumber);
		const currentLineText = source.getLineContent(lineNumber);

		// if the text buffer is chunk based, so long lines are cons-string, v8 will flattern the string when we check charCode.
		// checking charCode on chunks directly is cheaper.
		const useCurrentLineText = (currentLineLength <= 65536);

		let currentLineHasContent = false;			// does `currentLineText` contain non-whitespace chars
		let currentLineIndentation = 0;				// index at which `currentLineText` contains the first non-whitespace char
		let currentLineSpacesCount = 0;				// count of spaces found in `currentLineText` indentation
		let currentLineTabsCount = 0;				// count of tabs found in `currentLineText` indentation
		for (let j = 0, lenJ = currentLineLength; j < lenJ; j++) {
			const charCode = (useCurrentLineText ? currentLineText.charCodeAt(j) : source.getLineCharCode(lineNumber, j));

			if (charCode === CharCode.Tab) {
				currentLineTabsCount++;
			} else if (charCode === CharCode.Space) {
				currentLineSpacesCount++;
			} else {
				// Hit non whitespace character on this line
				currentLineHasContent = true;
				currentLineIndentation = j;
				break;
			}
		}

		// Ignore empty or only whitespace lines
		if (!currentLineHasContent) {
			continue;
		}

		if (currentLineTabsCount > 0) {
			linesIndentedWithTabsCount++;
		} else if (currentLineSpacesCount > 1) {
			linesIndentedWithSpacesCount++;
		}

		spacesDiff(previousLineText, previousLineIndentation, currentLineText, currentLineIndentation, tmp);

		if (tmp.looksLikeAlignment) {
			// if defaultInsertSpaces === true && the spaces count == tabSize, we may want to count it as valid indentation
			//
			// - item1
			//   - item2
			//
			// otherwise skip this line entirely
			//
			// const a = 1,
			//       b = 2;

			if (!(defaultInsertSpaces && defaultTabSize === tmp.spacesDiff)) {
				continue;
			}
		}

		const currentSpacesDiff = tmp.spacesDiff;
		if (currentSpacesDiff <= MAX_ALLOWED_TAB_SIZE_GUESS) {
			spacesDiffCount[currentSpacesDiff]++;
		}

		previousLineText = currentLineText;
		previousLineIndentation = currentLineIndentation;
	}

	let insertSpaces = defaultInsertSpaces;
	if (linesIndentedWithTabsCount !== linesIndentedWithSpacesCount) {
		insertSpaces = (linesIndentedWithTabsCount < linesIndentedWithSpacesCount);
	}

	let tabSize = defaultTabSize;

	// Guess tabSize only if inserting spaces...
	if (insertSpaces) {
		let tabSizeScore = (insertSpaces ? 0 : 0.1 * linesCount);

		// console.log("score threshold: " + tabSizeScore);

		ALLOWED_TAB_SIZE_GUESSES.forEach((possibleTabSize) => {
			const possibleTabSizeScore = spacesDiffCount[possibleTabSize];
			if (possibleTabSizeScore > tabSizeScore) {
				tabSizeScore = possibleTabSizeScore;
				tabSize = possibleTabSize;
			}
		});

		// Let a tabSize of 2 win even if it is not the maximum
		// (only in case 4 was guessed)
		if (tabSize === 4 && spacesDiffCount[4] > 0 && spacesDiffCount[2] > 0 && spacesDiffCount[2] >= spacesDiffCount[4] / 2) {
			tabSize = 2;
		}
	}


	// console.log('--------------------------');
	// console.log('linesIndentedWithTabsCount: ' + linesIndentedWithTabsCount + ', linesIndentedWithSpacesCount: ' + linesIndentedWithSpacesCount);
	// console.log('spacesDiffCount: ' + spacesDiffCount);
	// console.log('tabSize: ' + tabSize + ', tabSizeScore: ' + tabSizeScore);

	return {
		insertSpaces: insertSpaces,
		tabSize: tabSize
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/intervalTree.ts]---
Location: vscode-main/src/vs/editor/common/model/intervalTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Range } from '../core/range.js';
import { TrackedRangeStickiness, TrackedRangeStickiness as ActualTrackedRangeStickiness } from '../model.js';
import { ModelDecorationOptions } from './textModel.js';

//
// The red-black tree is based on the "Introduction to Algorithms" by Cormen, Leiserson and Rivest.
//

export const enum ClassName {
	EditorHintDecoration = 'squiggly-hint',
	EditorInfoDecoration = 'squiggly-info',
	EditorWarningDecoration = 'squiggly-warning',
	EditorErrorDecoration = 'squiggly-error',
	EditorUnnecessaryDecoration = 'squiggly-unnecessary',
	EditorUnnecessaryInlineDecoration = 'squiggly-inline-unnecessary',
	EditorDeprecatedInlineDecoration = 'squiggly-inline-deprecated'
}

export const enum NodeColor {
	Black = 0,
	Red = 1,
}

const enum Constants {
	ColorMask = 0b00000001,
	ColorMaskInverse = 0b11111110,
	ColorOffset = 0,

	IsVisitedMask = 0b00000010,
	IsVisitedMaskInverse = 0b11111101,
	IsVisitedOffset = 1,

	IsForValidationMask = 0b00000100,
	IsForValidationMaskInverse = 0b11111011,
	IsForValidationOffset = 2,

	StickinessMask = 0b00011000,
	StickinessMaskInverse = 0b11100111,
	StickinessOffset = 3,

	CollapseOnReplaceEditMask = 0b00100000,
	CollapseOnReplaceEditMaskInverse = 0b11011111,
	CollapseOnReplaceEditOffset = 5,

	IsMarginMask = 0b01000000,
	IsMarginMaskInverse = 0b10111111,
	IsMarginOffset = 6,

	AffectsFontMask = 0b10000000,
	AffectsFontMaskInverse = 0b01111111,
	AffectsFontOffset = 7,

	/**
	 * Due to how deletion works (in order to avoid always walking the right subtree of the deleted node),
	 * the deltas for nodes can grow and shrink dramatically. It has been observed, in practice, that unless
	 * the deltas are corrected, integer overflow will occur.
	 *
	 * The integer overflow occurs when 53 bits are used in the numbers, but we will try to avoid it as
	 * a node's delta gets below a negative 30 bits number.
	 *
	 * MIN SMI (SMall Integer) as defined in v8.
	 * one bit is lost for boxing/unboxing flag.
	 * one bit is lost for sign flag.
	 * See https://thibaultlaurens.github.io/javascript/2013/04/29/how-the-v8-engine-works/#tagged-values
	 */
	MIN_SAFE_DELTA = -(1 << 30),
	/**
	 * MAX SMI (SMall Integer) as defined in v8.
	 * one bit is lost for boxing/unboxing flag.
	 * one bit is lost for sign flag.
	 * See https://thibaultlaurens.github.io/javascript/2013/04/29/how-the-v8-engine-works/#tagged-values
	 */
	MAX_SAFE_DELTA = 1 << 30,
}

export function getNodeColor(node: IntervalNode): NodeColor {
	return ((node.metadata & Constants.ColorMask) >>> Constants.ColorOffset);
}
function setNodeColor(node: IntervalNode, color: NodeColor): void {
	node.metadata = (
		(node.metadata & Constants.ColorMaskInverse) | (color << Constants.ColorOffset)
	);
}
function getNodeIsVisited(node: IntervalNode): boolean {
	return ((node.metadata & Constants.IsVisitedMask) >>> Constants.IsVisitedOffset) === 1;
}
function setNodeIsVisited(node: IntervalNode, value: boolean): void {
	node.metadata = (
		(node.metadata & Constants.IsVisitedMaskInverse) | ((value ? 1 : 0) << Constants.IsVisitedOffset)
	);
}
function getNodeIsForValidation(node: IntervalNode): boolean {
	return ((node.metadata & Constants.IsForValidationMask) >>> Constants.IsForValidationOffset) === 1;
}
function setNodeIsForValidation(node: IntervalNode, value: boolean): void {
	node.metadata = (
		(node.metadata & Constants.IsForValidationMaskInverse) | ((value ? 1 : 0) << Constants.IsForValidationOffset)
	);
}
function getNodeIsInGlyphMargin(node: IntervalNode): boolean {
	return ((node.metadata & Constants.IsMarginMask) >>> Constants.IsMarginOffset) === 1;
}
function setNodeIsInGlyphMargin(node: IntervalNode, value: boolean): void {
	node.metadata = (
		(node.metadata & Constants.IsMarginMaskInverse) | ((value ? 1 : 0) << Constants.IsMarginOffset)
	);
}
function getNodeAffectsFont(node: IntervalNode): boolean {
	return ((node.metadata & Constants.AffectsFontMask) >>> Constants.AffectsFontOffset) === 1;
}
function setNodeAffectsFont(node: IntervalNode, value: boolean): void {
	node.metadata = (
		(node.metadata & Constants.AffectsFontMaskInverse) | ((value ? 1 : 0) << Constants.AffectsFontOffset)
	);
}
function getNodeStickiness(node: IntervalNode): TrackedRangeStickiness {
	return ((node.metadata & Constants.StickinessMask) >>> Constants.StickinessOffset);
}
function _setNodeStickiness(node: IntervalNode, stickiness: TrackedRangeStickiness): void {
	node.metadata = (
		(node.metadata & Constants.StickinessMaskInverse) | (stickiness << Constants.StickinessOffset)
	);
}
function getCollapseOnReplaceEdit(node: IntervalNode): boolean {
	return ((node.metadata & Constants.CollapseOnReplaceEditMask) >>> Constants.CollapseOnReplaceEditOffset) === 1;
}
function setCollapseOnReplaceEdit(node: IntervalNode, value: boolean): void {
	node.metadata = (
		(node.metadata & Constants.CollapseOnReplaceEditMaskInverse) | ((value ? 1 : 0) << Constants.CollapseOnReplaceEditOffset)
	);
}
export function setNodeStickiness(node: IntervalNode, stickiness: ActualTrackedRangeStickiness): void {
	_setNodeStickiness(node, <number>stickiness);
}

export class IntervalNode {

	/**
	 * contains binary encoded information for color, visited, isForValidation and stickiness.
	 */
	public metadata: number;

	public parent: IntervalNode;
	public left: IntervalNode;
	public right: IntervalNode;

	public start: number;
	public end: number;
	public delta: number;
	public maxEnd: number;

	public id: string;
	public ownerId: number;
	public options: ModelDecorationOptions;

	public cachedVersionId: number;
	public cachedAbsoluteStart: number;
	public cachedAbsoluteEnd: number;
	public range: Range | null;

	constructor(id: string, start: number, end: number) {
		this.metadata = 0;

		this.parent = this;
		this.left = this;
		this.right = this;
		setNodeColor(this, NodeColor.Red);

		this.start = start;
		this.end = end;
		// FORCE_OVERFLOWING_TEST: this.delta = start;
		this.delta = 0;
		this.maxEnd = end;

		this.id = id;
		this.ownerId = 0;
		this.options = null!;
		setNodeIsForValidation(this, false);
		setNodeIsInGlyphMargin(this, false);
		_setNodeStickiness(this, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges);
		setCollapseOnReplaceEdit(this, false);
		setNodeAffectsFont(this, false);

		this.cachedVersionId = 0;
		this.cachedAbsoluteStart = start;
		this.cachedAbsoluteEnd = end;
		this.range = null;

		setNodeIsVisited(this, false);
	}

	public reset(versionId: number, start: number, end: number, range: Range): void {
		this.start = start;
		this.end = end;
		this.maxEnd = end;
		this.cachedVersionId = versionId;
		this.cachedAbsoluteStart = start;
		this.cachedAbsoluteEnd = end;
		this.range = range;
	}

	public setOptions(options: ModelDecorationOptions) {
		this.options = options;
		const className = this.options.className;
		setNodeIsForValidation(this, (
			className === ClassName.EditorErrorDecoration
			|| className === ClassName.EditorWarningDecoration
			|| className === ClassName.EditorInfoDecoration
		));
		setNodeIsInGlyphMargin(this, this.options.glyphMarginClassName !== null);
		_setNodeStickiness(this, <number>this.options.stickiness);
		setCollapseOnReplaceEdit(this, this.options.collapseOnReplaceEdit);
		setNodeAffectsFont(this, this.options.affectsFont ?? false);
	}

	public setCachedOffsets(absoluteStart: number, absoluteEnd: number, cachedVersionId: number): void {
		if (this.cachedVersionId !== cachedVersionId) {
			this.range = null;
		}
		this.cachedVersionId = cachedVersionId;
		this.cachedAbsoluteStart = absoluteStart;
		this.cachedAbsoluteEnd = absoluteEnd;
	}

	public detach(): void {
		this.parent = null!;
		this.left = null!;
		this.right = null!;
	}
}

export const SENTINEL: IntervalNode = new IntervalNode(null!, 0, 0);
SENTINEL.parent = SENTINEL;
SENTINEL.left = SENTINEL;
SENTINEL.right = SENTINEL;
setNodeColor(SENTINEL, NodeColor.Black);

export class IntervalTree {

	public root: IntervalNode;
	public requestNormalizeDelta: boolean;

	constructor() {
		this.root = SENTINEL;
		this.requestNormalizeDelta = false;
	}

	public intervalSearch(start: number, end: number, filterOwnerId: number, filterOutValidation: boolean, filterFontDecorations: boolean, cachedVersionId: number, onlyMarginDecorations: boolean): IntervalNode[] {
		if (this.root === SENTINEL) {
			return [];
		}
		return intervalSearch(this, start, end, filterOwnerId, filterOutValidation, filterFontDecorations, cachedVersionId, onlyMarginDecorations);
	}

	public search(filterOwnerId: number, filterOutValidation: boolean, filterFontDecorations: boolean, cachedVersionId: number, onlyMarginDecorations: boolean): IntervalNode[] {
		if (this.root === SENTINEL) {
			return [];
		}
		return search(this, filterOwnerId, filterOutValidation, filterFontDecorations, cachedVersionId, onlyMarginDecorations);
	}

	/**
	 * Will not set `cachedAbsoluteStart` nor `cachedAbsoluteEnd` on the returned nodes!
	 */
	public collectNodesFromOwner(ownerId: number): IntervalNode[] {
		return collectNodesFromOwner(this, ownerId);
	}

	/**
	 * Will not set `cachedAbsoluteStart` nor `cachedAbsoluteEnd` on the returned nodes!
	 */
	public collectNodesPostOrder(): IntervalNode[] {
		return collectNodesPostOrder(this);
	}

	public insert(node: IntervalNode): void {
		rbTreeInsert(this, node);
		this._normalizeDeltaIfNecessary();
	}

	public delete(node: IntervalNode): void {
		rbTreeDelete(this, node);
		this._normalizeDeltaIfNecessary();
	}

	public resolveNode(node: IntervalNode, cachedVersionId: number): void {
		const initialNode = node;
		let delta = 0;
		while (node !== this.root) {
			if (node === node.parent.right) {
				delta += node.parent.delta;
			}
			node = node.parent;
		}

		const nodeStart = initialNode.start + delta;
		const nodeEnd = initialNode.end + delta;
		initialNode.setCachedOffsets(nodeStart, nodeEnd, cachedVersionId);
	}

	public acceptReplace(offset: number, length: number, textLength: number, forceMoveMarkers: boolean): void {
		// Our strategy is to remove all directly impacted nodes, and then add them back to the tree.

		// (1) collect all nodes that are intersecting this edit as nodes of interest
		const nodesOfInterest = searchForEditing(this, offset, offset + length);

		// (2) remove all nodes that are intersecting this edit
		for (let i = 0, len = nodesOfInterest.length; i < len; i++) {
			const node = nodesOfInterest[i];
			rbTreeDelete(this, node);
		}
		this._normalizeDeltaIfNecessary();

		// (3) edit all tree nodes except the nodes of interest
		noOverlapReplace(this, offset, offset + length, textLength);
		this._normalizeDeltaIfNecessary();

		// (4) edit the nodes of interest and insert them back in the tree
		for (let i = 0, len = nodesOfInterest.length; i < len; i++) {
			const node = nodesOfInterest[i];
			node.start = node.cachedAbsoluteStart;
			node.end = node.cachedAbsoluteEnd;
			nodeAcceptEdit(node, offset, (offset + length), textLength, forceMoveMarkers);
			node.maxEnd = node.end;
			rbTreeInsert(this, node);
		}
		this._normalizeDeltaIfNecessary();
	}

	public getAllInOrder(): IntervalNode[] {
		return search(this, 0, false, false, 0, false);
	}

	private _normalizeDeltaIfNecessary(): void {
		if (!this.requestNormalizeDelta) {
			return;
		}
		this.requestNormalizeDelta = false;
		normalizeDelta(this);
	}
}

//#region Delta Normalization
function normalizeDelta(T: IntervalTree): void {
	let node = T.root;
	let delta = 0;
	while (node !== SENTINEL) {

		if (node.left !== SENTINEL && !getNodeIsVisited(node.left)) {
			// go left
			node = node.left;
			continue;
		}

		if (node.right !== SENTINEL && !getNodeIsVisited(node.right)) {
			// go right
			delta += node.delta;
			node = node.right;
			continue;
		}

		// handle current node
		node.start = delta + node.start;
		node.end = delta + node.end;
		node.delta = 0;
		recomputeMaxEnd(node);

		setNodeIsVisited(node, true);

		// going up from this node
		setNodeIsVisited(node.left, false);
		setNodeIsVisited(node.right, false);
		if (node === node.parent.right) {
			delta -= node.parent.delta;
		}
		node = node.parent;
	}

	setNodeIsVisited(T.root, false);
}
//#endregion

//#region Editing

const enum MarkerMoveSemantics {
	MarkerDefined = 0,
	ForceMove = 1,
	ForceStay = 2
}

function adjustMarkerBeforeColumn(markerOffset: number, markerStickToPreviousCharacter: boolean, checkOffset: number, moveSemantics: MarkerMoveSemantics): boolean {
	if (markerOffset < checkOffset) {
		return true;
	}
	if (markerOffset > checkOffset) {
		return false;
	}
	if (moveSemantics === MarkerMoveSemantics.ForceMove) {
		return false;
	}
	if (moveSemantics === MarkerMoveSemantics.ForceStay) {
		return true;
	}
	return markerStickToPreviousCharacter;
}

/**
 * This is a lot more complicated than strictly necessary to maintain the same behaviour
 * as when decorations were implemented using two markers.
 */
export function nodeAcceptEdit(node: IntervalNode, start: number, end: number, textLength: number, forceMoveMarkers: boolean): void {
	const nodeStickiness = getNodeStickiness(node);
	const startStickToPreviousCharacter = (
		nodeStickiness === TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges
		|| nodeStickiness === TrackedRangeStickiness.GrowsOnlyWhenTypingBefore
	);
	const endStickToPreviousCharacter = (
		nodeStickiness === TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
		|| nodeStickiness === TrackedRangeStickiness.GrowsOnlyWhenTypingBefore
	);

	const deletingCnt = (end - start);
	const insertingCnt = textLength;
	const commonLength = Math.min(deletingCnt, insertingCnt);

	const nodeStart = node.start;
	let startDone = false;

	const nodeEnd = node.end;
	let endDone = false;

	if (start <= nodeStart && nodeEnd <= end && getCollapseOnReplaceEdit(node)) {
		// This edit encompasses the entire decoration range
		// and the decoration has asked to become collapsed
		node.start = start;
		startDone = true;
		node.end = start;
		endDone = true;
	}

	{
		const moveSemantics = forceMoveMarkers ? MarkerMoveSemantics.ForceMove : (deletingCnt > 0 ? MarkerMoveSemantics.ForceStay : MarkerMoveSemantics.MarkerDefined);
		if (!startDone && adjustMarkerBeforeColumn(nodeStart, startStickToPreviousCharacter, start, moveSemantics)) {
			startDone = true;
		}
		if (!endDone && adjustMarkerBeforeColumn(nodeEnd, endStickToPreviousCharacter, start, moveSemantics)) {
			endDone = true;
		}
	}

	if (commonLength > 0 && !forceMoveMarkers) {
		const moveSemantics = (deletingCnt > insertingCnt ? MarkerMoveSemantics.ForceStay : MarkerMoveSemantics.MarkerDefined);
		if (!startDone && adjustMarkerBeforeColumn(nodeStart, startStickToPreviousCharacter, start + commonLength, moveSemantics)) {
			startDone = true;
		}
		if (!endDone && adjustMarkerBeforeColumn(nodeEnd, endStickToPreviousCharacter, start + commonLength, moveSemantics)) {
			endDone = true;
		}
	}

	{
		const moveSemantics = forceMoveMarkers ? MarkerMoveSemantics.ForceMove : MarkerMoveSemantics.MarkerDefined;
		if (!startDone && adjustMarkerBeforeColumn(nodeStart, startStickToPreviousCharacter, end, moveSemantics)) {
			node.start = start + insertingCnt;
			startDone = true;
		}
		if (!endDone && adjustMarkerBeforeColumn(nodeEnd, endStickToPreviousCharacter, end, moveSemantics)) {
			node.end = start + insertingCnt;
			endDone = true;
		}
	}

	// Finish
	const deltaColumn = (insertingCnt - deletingCnt);
	if (!startDone) {
		node.start = Math.max(0, nodeStart + deltaColumn);
	}
	if (!endDone) {
		node.end = Math.max(0, nodeEnd + deltaColumn);
	}

	if (node.start > node.end) {
		node.end = node.start;
	}
}

function searchForEditing(T: IntervalTree, start: number, end: number): IntervalNode[] {
	// https://en.wikipedia.org/wiki/Interval_tree#Augmented_tree
	// Now, it is known that two intervals A and B overlap only when both
	// A.low <= B.high and A.high >= B.low. When searching the trees for
	// nodes overlapping with a given interval, you can immediately skip:
	//  a) all nodes to the right of nodes whose low value is past the end of the given interval.
	//  b) all nodes that have their maximum 'high' value below the start of the given interval.
	let node = T.root;
	let delta = 0;
	let nodeMaxEnd = 0;
	let nodeStart = 0;
	let nodeEnd = 0;
	const result: IntervalNode[] = [];
	let resultLen = 0;
	while (node !== SENTINEL) {
		if (getNodeIsVisited(node)) {
			// going up from this node
			setNodeIsVisited(node.left, false);
			setNodeIsVisited(node.right, false);
			if (node === node.parent.right) {
				delta -= node.parent.delta;
			}
			node = node.parent;
			continue;
		}

		if (!getNodeIsVisited(node.left)) {
			// first time seeing this node
			nodeMaxEnd = delta + node.maxEnd;
			if (nodeMaxEnd < start) {
				// cover case b) from above
				// there is no need to search this node or its children
				setNodeIsVisited(node, true);
				continue;
			}

			if (node.left !== SENTINEL) {
				// go left
				node = node.left;
				continue;
			}
		}

		// handle current node
		nodeStart = delta + node.start;
		if (nodeStart > end) {
			// cover case a) from above
			// there is no need to search this node or its right subtree
			setNodeIsVisited(node, true);
			continue;
		}

		nodeEnd = delta + node.end;
		if (nodeEnd >= start) {
			node.setCachedOffsets(nodeStart, nodeEnd, 0);
			result[resultLen++] = node;
		}
		setNodeIsVisited(node, true);

		if (node.right !== SENTINEL && !getNodeIsVisited(node.right)) {
			// go right
			delta += node.delta;
			node = node.right;
			continue;
		}
	}

	setNodeIsVisited(T.root, false);

	return result;
}

function noOverlapReplace(T: IntervalTree, start: number, end: number, textLength: number): void {
	// https://en.wikipedia.org/wiki/Interval_tree#Augmented_tree
	// Now, it is known that two intervals A and B overlap only when both
	// A.low <= B.high and A.high >= B.low. When searching the trees for
	// nodes overlapping with a given interval, you can immediately skip:
	//  a) all nodes to the right of nodes whose low value is past the end of the given interval.
	//  b) all nodes that have their maximum 'high' value below the start of the given interval.
	let node = T.root;
	let delta = 0;
	let nodeMaxEnd = 0;
	let nodeStart = 0;
	const editDelta = (textLength - (end - start));
	while (node !== SENTINEL) {
		if (getNodeIsVisited(node)) {
			// going up from this node
			setNodeIsVisited(node.left, false);
			setNodeIsVisited(node.right, false);
			if (node === node.parent.right) {
				delta -= node.parent.delta;
			}
			recomputeMaxEnd(node);
			node = node.parent;
			continue;
		}

		if (!getNodeIsVisited(node.left)) {
			// first time seeing this node
			nodeMaxEnd = delta + node.maxEnd;
			if (nodeMaxEnd < start) {
				// cover case b) from above
				// there is no need to search this node or its children
				setNodeIsVisited(node, true);
				continue;
			}

			if (node.left !== SENTINEL) {
				// go left
				node = node.left;
				continue;
			}
		}

		// handle current node
		nodeStart = delta + node.start;
		if (nodeStart > end) {
			node.start += editDelta;
			node.end += editDelta;
			node.delta += editDelta;
			if (node.delta < Constants.MIN_SAFE_DELTA || node.delta > Constants.MAX_SAFE_DELTA) {
				T.requestNormalizeDelta = true;
			}
			// cover case a) from above
			// there is no need to search this node or its right subtree
			setNodeIsVisited(node, true);
			continue;
		}

		setNodeIsVisited(node, true);

		if (node.right !== SENTINEL && !getNodeIsVisited(node.right)) {
			// go right
			delta += node.delta;
			node = node.right;
			continue;
		}
	}

	setNodeIsVisited(T.root, false);
}

//#endregion

//#region Searching

function collectNodesFromOwner(T: IntervalTree, ownerId: number): IntervalNode[] {
	let node = T.root;
	const result: IntervalNode[] = [];
	let resultLen = 0;
	while (node !== SENTINEL) {
		if (getNodeIsVisited(node)) {
			// going up from this node
			setNodeIsVisited(node.left, false);
			setNodeIsVisited(node.right, false);
			node = node.parent;
			continue;
		}

		if (node.left !== SENTINEL && !getNodeIsVisited(node.left)) {
			// go left
			node = node.left;
			continue;
		}

		// handle current node
		if (node.ownerId === ownerId) {
			result[resultLen++] = node;
		}

		setNodeIsVisited(node, true);

		if (node.right !== SENTINEL && !getNodeIsVisited(node.right)) {
			// go right
			node = node.right;
			continue;
		}
	}

	setNodeIsVisited(T.root, false);

	return result;
}

function collectNodesPostOrder(T: IntervalTree): IntervalNode[] {
	let node = T.root;
	const result: IntervalNode[] = [];
	let resultLen = 0;
	while (node !== SENTINEL) {
		if (getNodeIsVisited(node)) {
			// going up from this node
			setNodeIsVisited(node.left, false);
			setNodeIsVisited(node.right, false);
			node = node.parent;
			continue;
		}

		if (node.left !== SENTINEL && !getNodeIsVisited(node.left)) {
			// go left
			node = node.left;
			continue;
		}

		if (node.right !== SENTINEL && !getNodeIsVisited(node.right)) {
			// go right
			node = node.right;
			continue;
		}

		// handle current node
		result[resultLen++] = node;
		setNodeIsVisited(node, true);
	}

	setNodeIsVisited(T.root, false);

	return result;
}

function search(T: IntervalTree, filterOwnerId: number, filterOutValidation: boolean, filterFontDecorations: boolean, cachedVersionId: number, onlyMarginDecorations: boolean): IntervalNode[] {
	let node = T.root;
	let delta = 0;
	let nodeStart = 0;
	let nodeEnd = 0;
	const result: IntervalNode[] = [];
	let resultLen = 0;
	while (node !== SENTINEL) {
		if (getNodeIsVisited(node)) {
			// going up from this node
			setNodeIsVisited(node.left, false);
			setNodeIsVisited(node.right, false);
			if (node === node.parent.right) {
				delta -= node.parent.delta;
			}
			node = node.parent;
			continue;
		}

		if (node.left !== SENTINEL && !getNodeIsVisited(node.left)) {
			// go left
			node = node.left;
			continue;
		}

		// handle current node
		nodeStart = delta + node.start;
		nodeEnd = delta + node.end;

		node.setCachedOffsets(nodeStart, nodeEnd, cachedVersionId);

		let include = true;
		if (filterOwnerId && node.ownerId && node.ownerId !== filterOwnerId) {
			include = false;
		}
		if (filterOutValidation && getNodeIsForValidation(node)) {
			include = false;
		}
		if (filterFontDecorations && getNodeAffectsFont(node)) {
			include = false;
		}
		if (onlyMarginDecorations && !getNodeIsInGlyphMargin(node)) {
			include = false;
		}

		if (include) {
			result[resultLen++] = node;
		}

		setNodeIsVisited(node, true);

		if (node.right !== SENTINEL && !getNodeIsVisited(node.right)) {
			// go right
			delta += node.delta;
			node = node.right;
			continue;
		}
	}

	setNodeIsVisited(T.root, false);

	return result;
}

function intervalSearch(T: IntervalTree, intervalStart: number, intervalEnd: number, filterOwnerId: number, filterOutValidation: boolean, filterFontDecorations: boolean, cachedVersionId: number, onlyMarginDecorations: boolean): IntervalNode[] {
	// https://en.wikipedia.org/wiki/Interval_tree#Augmented_tree
	// Now, it is known that two intervals A and B overlap only when both
	// A.low <= B.high and A.high >= B.low. When searching the trees for
	// nodes overlapping with a given interval, you can immediately skip:
	//  a) all nodes to the right of nodes whose low value is past the end of the given interval.
	//  b) all nodes that have their maximum 'high' value below the start of the given interval.

	let node = T.root;
	let delta = 0;
	let nodeMaxEnd = 0;
	let nodeStart = 0;
	let nodeEnd = 0;
	const result: IntervalNode[] = [];
	let resultLen = 0;
	while (node !== SENTINEL) {
		if (getNodeIsVisited(node)) {
			// going up from this node
			setNodeIsVisited(node.left, false);
			setNodeIsVisited(node.right, false);
			if (node === node.parent.right) {
				delta -= node.parent.delta;
			}
			node = node.parent;
			continue;
		}

		if (!getNodeIsVisited(node.left)) {
			// first time seeing this node
			nodeMaxEnd = delta + node.maxEnd;
			if (nodeMaxEnd < intervalStart) {
				// cover case b) from above
				// there is no need to search this node or its children
				setNodeIsVisited(node, true);
				continue;
			}

			if (node.left !== SENTINEL) {
				// go left
				node = node.left;
				continue;
			}
		}

		// handle current node
		nodeStart = delta + node.start;
		if (nodeStart > intervalEnd) {
			// cover case a) from above
			// there is no need to search this node or its right subtree
			setNodeIsVisited(node, true);
			continue;
		}

		nodeEnd = delta + node.end;

		if (nodeEnd >= intervalStart) {
			// There is overlap
			node.setCachedOffsets(nodeStart, nodeEnd, cachedVersionId);

			let include = true;
			if (filterOwnerId && node.ownerId && node.ownerId !== filterOwnerId) {
				include = false;
			}
			if (filterOutValidation && getNodeIsForValidation(node)) {
				include = false;
			}
			if (filterFontDecorations && getNodeAffectsFont(node)) {
				include = false;
			}
			if (onlyMarginDecorations && !getNodeIsInGlyphMargin(node)) {
				include = false;
			}

			if (include) {
				result[resultLen++] = node;
			}
		}

		setNodeIsVisited(node, true);

		if (node.right !== SENTINEL && !getNodeIsVisited(node.right)) {
			// go right
			delta += node.delta;
			node = node.right;
			continue;
		}
	}

	setNodeIsVisited(T.root, false);

	return result;
}

//#endregion

//#region Insertion
function rbTreeInsert(T: IntervalTree, newNode: IntervalNode): IntervalNode {
	if (T.root === SENTINEL) {
		newNode.parent = SENTINEL;
		newNode.left = SENTINEL;
		newNode.right = SENTINEL;
		setNodeColor(newNode, NodeColor.Black);
		T.root = newNode;
		return T.root;
	}

	treeInsert(T, newNode);

	recomputeMaxEndWalkToRoot(newNode.parent);

	// repair tree
	let x = newNode;
	while (x !== T.root && getNodeColor(x.parent) === NodeColor.Red) {
		if (x.parent === x.parent.parent.left) {
			const y = x.parent.parent.right;

			if (getNodeColor(y) === NodeColor.Red) {
				setNodeColor(x.parent, NodeColor.Black);
				setNodeColor(y, NodeColor.Black);
				setNodeColor(x.parent.parent, NodeColor.Red);
				x = x.parent.parent;
			} else {
				if (x === x.parent.right) {
					x = x.parent;
					leftRotate(T, x);
				}
				setNodeColor(x.parent, NodeColor.Black);
				setNodeColor(x.parent.parent, NodeColor.Red);
				rightRotate(T, x.parent.parent);
			}
		} else {
			const y = x.parent.parent.left;

			if (getNodeColor(y) === NodeColor.Red) {
				setNodeColor(x.parent, NodeColor.Black);
				setNodeColor(y, NodeColor.Black);
				setNodeColor(x.parent.parent, NodeColor.Red);
				x = x.parent.parent;
			} else {
				if (x === x.parent.left) {
					x = x.parent;
					rightRotate(T, x);
				}
				setNodeColor(x.parent, NodeColor.Black);
				setNodeColor(x.parent.parent, NodeColor.Red);
				leftRotate(T, x.parent.parent);
			}
		}
	}

	setNodeColor(T.root, NodeColor.Black);

	return newNode;
}

function treeInsert(T: IntervalTree, z: IntervalNode): void {
	let delta: number = 0;
	let x = T.root;
	const zAbsoluteStart = z.start;
	const zAbsoluteEnd = z.end;
	while (true) {
		const cmp = intervalCompare(zAbsoluteStart, zAbsoluteEnd, x.start + delta, x.end + delta);
		if (cmp < 0) {
			// this node should be inserted to the left
			// => it is not affected by the node's delta
			if (x.left === SENTINEL) {
				z.start -= delta;
				z.end -= delta;
				z.maxEnd -= delta;
				x.left = z;
				break;
			} else {
				x = x.left;
			}
		} else {
			// this node should be inserted to the right
			// => it is not affected by the node's delta
			if (x.right === SENTINEL) {
				z.start -= (delta + x.delta);
				z.end -= (delta + x.delta);
				z.maxEnd -= (delta + x.delta);
				x.right = z;
				break;
			} else {
				delta += x.delta;
				x = x.right;
			}
		}
	}

	z.parent = x;
	z.left = SENTINEL;
	z.right = SENTINEL;
	setNodeColor(z, NodeColor.Red);
}
//#endregion

//#region Deletion
function rbTreeDelete(T: IntervalTree, z: IntervalNode): void {

	let x: IntervalNode;
	let y: IntervalNode;

	// RB-DELETE except we don't swap z and y in case c)
	// i.e. we always delete what's pointed at by z.

	if (z.left === SENTINEL) {
		x = z.right;
		y = z;

		// x's delta is no longer influenced by z's delta
		x.delta += z.delta;
		if (x.delta < Constants.MIN_SAFE_DELTA || x.delta > Constants.MAX_SAFE_DELTA) {
			T.requestNormalizeDelta = true;
		}
		x.start += z.delta;
		x.end += z.delta;

	} else if (z.right === SENTINEL) {
		x = z.left;
		y = z;

	} else {
		y = leftest(z.right);
		x = y.right;

		// y's delta is no longer influenced by z's delta,
		// but we don't want to walk the entire right-hand-side subtree of x.
		// we therefore maintain z's delta in y, and adjust only x
		x.start += y.delta;
		x.end += y.delta;
		x.delta += y.delta;
		if (x.delta < Constants.MIN_SAFE_DELTA || x.delta > Constants.MAX_SAFE_DELTA) {
			T.requestNormalizeDelta = true;
		}

		y.start += z.delta;
		y.end += z.delta;
		y.delta = z.delta;
		if (y.delta < Constants.MIN_SAFE_DELTA || y.delta > Constants.MAX_SAFE_DELTA) {
			T.requestNormalizeDelta = true;
		}
	}

	if (y === T.root) {
		T.root = x;
		setNodeColor(x, NodeColor.Black);

		z.detach();
		resetSentinel();
		recomputeMaxEnd(x);
		T.root.parent = SENTINEL;
		return;
	}

	const yWasRed = (getNodeColor(y) === NodeColor.Red);

	if (y === y.parent.left) {
		y.parent.left = x;
	} else {
		y.parent.right = x;
	}

	if (y === z) {
		x.parent = y.parent;
	} else {

		if (y.parent === z) {
			x.parent = y;
		} else {
			x.parent = y.parent;
		}

		y.left = z.left;
		y.right = z.right;
		y.parent = z.parent;
		setNodeColor(y, getNodeColor(z));

		if (z === T.root) {
			T.root = y;
		} else {
			if (z === z.parent.left) {
				z.parent.left = y;
			} else {
				z.parent.right = y;
			}
		}

		if (y.left !== SENTINEL) {
			y.left.parent = y;
		}
		if (y.right !== SENTINEL) {
			y.right.parent = y;
		}
	}

	z.detach();

	if (yWasRed) {
		recomputeMaxEndWalkToRoot(x.parent);
		if (y !== z) {
			recomputeMaxEndWalkToRoot(y);
			recomputeMaxEndWalkToRoot(y.parent);
		}
		resetSentinel();
		return;
	}

	recomputeMaxEndWalkToRoot(x);
	recomputeMaxEndWalkToRoot(x.parent);
	if (y !== z) {
		recomputeMaxEndWalkToRoot(y);
		recomputeMaxEndWalkToRoot(y.parent);
	}

	// RB-DELETE-FIXUP
	let w: IntervalNode;
	while (x !== T.root && getNodeColor(x) === NodeColor.Black) {

		if (x === x.parent.left) {
			w = x.parent.right;

			if (getNodeColor(w) === NodeColor.Red) {
				setNodeColor(w, NodeColor.Black);
				setNodeColor(x.parent, NodeColor.Red);
				leftRotate(T, x.parent);
				w = x.parent.right;
			}

			if (getNodeColor(w.left) === NodeColor.Black && getNodeColor(w.right) === NodeColor.Black) {
				setNodeColor(w, NodeColor.Red);
				x = x.parent;
			} else {
				if (getNodeColor(w.right) === NodeColor.Black) {
					setNodeColor(w.left, NodeColor.Black);
					setNodeColor(w, NodeColor.Red);
					rightRotate(T, w);
					w = x.parent.right;
				}

				setNodeColor(w, getNodeColor(x.parent));
				setNodeColor(x.parent, NodeColor.Black);
				setNodeColor(w.right, NodeColor.Black);
				leftRotate(T, x.parent);
				x = T.root;
			}

		} else {
			w = x.parent.left;

			if (getNodeColor(w) === NodeColor.Red) {
				setNodeColor(w, NodeColor.Black);
				setNodeColor(x.parent, NodeColor.Red);
				rightRotate(T, x.parent);
				w = x.parent.left;
			}

			if (getNodeColor(w.left) === NodeColor.Black && getNodeColor(w.right) === NodeColor.Black) {
				setNodeColor(w, NodeColor.Red);
				x = x.parent;

			} else {
				if (getNodeColor(w.left) === NodeColor.Black) {
					setNodeColor(w.right, NodeColor.Black);
					setNodeColor(w, NodeColor.Red);
					leftRotate(T, w);
					w = x.parent.left;
				}

				setNodeColor(w, getNodeColor(x.parent));
				setNodeColor(x.parent, NodeColor.Black);
				setNodeColor(w.left, NodeColor.Black);
				rightRotate(T, x.parent);
				x = T.root;
			}
		}
	}

	setNodeColor(x, NodeColor.Black);
	resetSentinel();
}

function leftest(node: IntervalNode): IntervalNode {
	while (node.left !== SENTINEL) {
		node = node.left;
	}
	return node;
}

function resetSentinel(): void {
	SENTINEL.parent = SENTINEL;
	SENTINEL.delta = 0; // optional
	SENTINEL.start = 0; // optional
	SENTINEL.end = 0; // optional
}
//#endregion

//#region Rotations
function leftRotate(T: IntervalTree, x: IntervalNode): void {
	const y = x.right;				// set y.

	y.delta += x.delta;				// y's delta is no longer influenced by x's delta
	if (y.delta < Constants.MIN_SAFE_DELTA || y.delta > Constants.MAX_SAFE_DELTA) {
		T.requestNormalizeDelta = true;
	}
	y.start += x.delta;
	y.end += x.delta;

	x.right = y.left;				// turn y's left subtree into x's right subtree.
	if (y.left !== SENTINEL) {
		y.left.parent = x;
	}
	y.parent = x.parent;			// link x's parent to y.
	if (x.parent === SENTINEL) {
		T.root = y;
	} else if (x === x.parent.left) {
		x.parent.left = y;
	} else {
		x.parent.right = y;
	}

	y.left = x;						// put x on y's left.
	x.parent = y;

	recomputeMaxEnd(x);
	recomputeMaxEnd(y);
}

function rightRotate(T: IntervalTree, y: IntervalNode): void {
	const x = y.left;

	y.delta -= x.delta;
	if (y.delta < Constants.MIN_SAFE_DELTA || y.delta > Constants.MAX_SAFE_DELTA) {
		T.requestNormalizeDelta = true;
	}
	y.start -= x.delta;
	y.end -= x.delta;

	y.left = x.right;
	if (x.right !== SENTINEL) {
		x.right.parent = y;
	}
	x.parent = y.parent;
	if (y.parent === SENTINEL) {
		T.root = x;
	} else if (y === y.parent.right) {
		y.parent.right = x;
	} else {
		y.parent.left = x;
	}

	x.right = y;
	y.parent = x;

	recomputeMaxEnd(y);
	recomputeMaxEnd(x);
}
//#endregion

//#region max end computation

function computeMaxEnd(node: IntervalNode): number {
	let maxEnd = node.end;
	if (node.left !== SENTINEL) {
		const leftMaxEnd = node.left.maxEnd;
		if (leftMaxEnd > maxEnd) {
			maxEnd = leftMaxEnd;
		}
	}
	if (node.right !== SENTINEL) {
		const rightMaxEnd = node.right.maxEnd + node.delta;
		if (rightMaxEnd > maxEnd) {
			maxEnd = rightMaxEnd;
		}
	}
	return maxEnd;
}

export function recomputeMaxEnd(node: IntervalNode): void {
	node.maxEnd = computeMaxEnd(node);
}

function recomputeMaxEndWalkToRoot(node: IntervalNode): void {
	while (node !== SENTINEL) {

		const maxEnd = computeMaxEnd(node);

		if (node.maxEnd === maxEnd) {
			// no need to go further
			return;
		}

		node.maxEnd = maxEnd;
		node = node.parent;
	}
}

//#endregion

//#region utils
export function intervalCompare(aStart: number, aEnd: number, bStart: number, bEnd: number): number {
	if (aStart === bStart) {
		return aEnd - bEnd;
	}
	return aStart - bStart;
}
//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/mirrorTextModel.ts]---
Location: vscode-main/src/vs/editor/common/model/mirrorTextModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { splitLines } from '../../../base/common/strings.js';
import { URI } from '../../../base/common/uri.js';
import { Position } from '../core/position.js';
import { IRange } from '../core/range.js';
import { PrefixSumComputer } from './prefixSumComputer.js';

export interface IModelContentChange {
	/**
	 * The old range that got replaced.
	 */
	readonly range: IRange;
	/**
	 * The offset of the range that got replaced.
	 */
	readonly rangeOffset: number;
	/**
	 * The length of the range that got replaced.
	 */
	readonly rangeLength: number;
	/**
	 * The new text for the range.
	 */
	readonly text: string;
}

export interface IModelChangedEvent {
	/**
	 * The actual changes.
	 */
	readonly changes: IModelContentChange[];
	/**
	 * The (new) end-of-line character.
	 */
	readonly eol: string;
	/**
	 * The new version id the model has transitioned to.
	 */
	readonly versionId: number;
	/**
	 * Flag that indicates that this event was generated while undoing.
	 */
	readonly isUndoing: boolean;
	/**
	 * Flag that indicates that this event was generated while redoing.
	 */
	readonly isRedoing: boolean;
}

export interface IMirrorTextModel {
	readonly version: number;
}

export class MirrorTextModel implements IMirrorTextModel {

	protected _uri: URI;
	protected _lines: string[];
	protected _eol: string;
	protected _versionId: number;
	protected _lineStarts: PrefixSumComputer | null;
	private _cachedTextValue: string | null;

	constructor(uri: URI, lines: string[], eol: string, versionId: number) {
		this._uri = uri;
		this._lines = lines;
		this._eol = eol;
		this._versionId = versionId;
		this._lineStarts = null;
		this._cachedTextValue = null;
	}

	dispose(): void {
		this._lines.length = 0;
	}

	get version(): number {
		return this._versionId;
	}

	getText(): string {
		if (this._cachedTextValue === null) {
			this._cachedTextValue = this._lines.join(this._eol);
		}
		return this._cachedTextValue;
	}

	onEvents(e: IModelChangedEvent): void {
		if (e.eol && e.eol !== this._eol) {
			this._eol = e.eol;
			this._lineStarts = null;
		}

		// Update my lines
		const changes = e.changes;
		for (const change of changes) {
			this._acceptDeleteRange(change.range);
			this._acceptInsertText(new Position(change.range.startLineNumber, change.range.startColumn), change.text);
		}

		this._versionId = e.versionId;
		this._cachedTextValue = null;
	}

	protected _ensureLineStarts(): void {
		if (!this._lineStarts) {
			const eolLength = this._eol.length;
			const linesLength = this._lines.length;
			const lineStartValues = new Uint32Array(linesLength);
			for (let i = 0; i < linesLength; i++) {
				lineStartValues[i] = this._lines[i].length + eolLength;
			}
			this._lineStarts = new PrefixSumComputer(lineStartValues);
		}
	}

	/**
	 * All changes to a line's text go through this method
	 */
	private _setLineText(lineIndex: number, newValue: string): void {
		this._lines[lineIndex] = newValue;
		if (this._lineStarts) {
			// update prefix sum
			this._lineStarts.setValue(lineIndex, this._lines[lineIndex].length + this._eol.length);
		}
	}

	private _acceptDeleteRange(range: IRange): void {

		if (range.startLineNumber === range.endLineNumber) {
			if (range.startColumn === range.endColumn) {
				// Nothing to delete
				return;
			}
			// Delete text on the affected line
			this._setLineText(range.startLineNumber - 1,
				this._lines[range.startLineNumber - 1].substring(0, range.startColumn - 1)
				+ this._lines[range.startLineNumber - 1].substring(range.endColumn - 1)
			);
			return;
		}

		// Take remaining text on last line and append it to remaining text on first line
		this._setLineText(range.startLineNumber - 1,
			this._lines[range.startLineNumber - 1].substring(0, range.startColumn - 1)
			+ this._lines[range.endLineNumber - 1].substring(range.endColumn - 1)
		);

		// Delete middle lines
		this._lines.splice(range.startLineNumber, range.endLineNumber - range.startLineNumber);
		if (this._lineStarts) {
			// update prefix sum
			this._lineStarts.removeValues(range.startLineNumber, range.endLineNumber - range.startLineNumber);
		}
	}

	private _acceptInsertText(position: Position, insertText: string): void {
		if (insertText.length === 0) {
			// Nothing to insert
			return;
		}
		const insertLines = splitLines(insertText);
		if (insertLines.length === 1) {
			// Inserting text on one line
			this._setLineText(position.lineNumber - 1,
				this._lines[position.lineNumber - 1].substring(0, position.column - 1)
				+ insertLines[0]
				+ this._lines[position.lineNumber - 1].substring(position.column - 1)
			);
			return;
		}

		// Append overflowing text from first line to the end of text to insert
		insertLines[insertLines.length - 1] += this._lines[position.lineNumber - 1].substring(position.column - 1);

		// Delete overflowing text from first line and insert text on first line
		this._setLineText(position.lineNumber - 1,
			this._lines[position.lineNumber - 1].substring(0, position.column - 1)
			+ insertLines[0]
		);

		// Insert new lines & store lengths
		const newLengths = new Uint32Array(insertLines.length - 1);
		for (let i = 1; i < insertLines.length; i++) {
			this._lines.splice(position.lineNumber + i - 1, 0, insertLines[i]);
			newLengths[i - 1] = insertLines[i].length + this._eol.length;
		}

		if (this._lineStarts) {
			// update prefix sum
			this._lineStarts.insertValues(position.lineNumber, newLengths);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/prefixSumComputer.ts]---
Location: vscode-main/src/vs/editor/common/model/prefixSumComputer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { arrayInsert } from '../../../base/common/arrays.js';
import { toUint32 } from '../../../base/common/uint.js';

export class PrefixSumComputer {

	/**
	 * values[i] is the value at index i
	 */
	private values: Uint32Array;

	/**
	 * prefixSum[i] = SUM(heights[j]), 0 <= j <= i
	 */
	private prefixSum: Uint32Array;

	/**
	 * prefixSum[i], 0 <= i <= prefixSumValidIndex can be trusted
	 */
	private readonly prefixSumValidIndex: Int32Array;

	constructor(values: Uint32Array) {
		this.values = values;
		this.prefixSum = new Uint32Array(values.length);
		this.prefixSumValidIndex = new Int32Array(1);
		this.prefixSumValidIndex[0] = -1;
	}

	public getCount(): number {
		return this.values.length;
	}

	public insertValues(insertIndex: number, insertValues: Uint32Array): boolean {
		insertIndex = toUint32(insertIndex);
		const oldValues = this.values;
		const oldPrefixSum = this.prefixSum;
		const insertValuesLen = insertValues.length;

		if (insertValuesLen === 0) {
			return false;
		}

		this.values = new Uint32Array(oldValues.length + insertValuesLen);
		this.values.set(oldValues.subarray(0, insertIndex), 0);
		this.values.set(oldValues.subarray(insertIndex), insertIndex + insertValuesLen);
		this.values.set(insertValues, insertIndex);

		if (insertIndex - 1 < this.prefixSumValidIndex[0]) {
			this.prefixSumValidIndex[0] = insertIndex - 1;
		}

		this.prefixSum = new Uint32Array(this.values.length);
		if (this.prefixSumValidIndex[0] >= 0) {
			this.prefixSum.set(oldPrefixSum.subarray(0, this.prefixSumValidIndex[0] + 1));
		}
		return true;
	}

	public setValue(index: number, value: number): boolean {
		index = toUint32(index);
		value = toUint32(value);

		if (this.values[index] === value) {
			return false;
		}
		this.values[index] = value;
		if (index - 1 < this.prefixSumValidIndex[0]) {
			this.prefixSumValidIndex[0] = index - 1;
		}
		return true;
	}

	public removeValues(startIndex: number, count: number): boolean {
		startIndex = toUint32(startIndex);
		count = toUint32(count);

		const oldValues = this.values;
		const oldPrefixSum = this.prefixSum;

		if (startIndex >= oldValues.length) {
			return false;
		}

		const maxCount = oldValues.length - startIndex;
		if (count >= maxCount) {
			count = maxCount;
		}

		if (count === 0) {
			return false;
		}

		this.values = new Uint32Array(oldValues.length - count);
		this.values.set(oldValues.subarray(0, startIndex), 0);
		this.values.set(oldValues.subarray(startIndex + count), startIndex);

		this.prefixSum = new Uint32Array(this.values.length);
		if (startIndex - 1 < this.prefixSumValidIndex[0]) {
			this.prefixSumValidIndex[0] = startIndex - 1;
		}
		if (this.prefixSumValidIndex[0] >= 0) {
			this.prefixSum.set(oldPrefixSum.subarray(0, this.prefixSumValidIndex[0] + 1));
		}
		return true;
	}

	public getTotalSum(): number {
		if (this.values.length === 0) {
			return 0;
		}
		return this._getPrefixSum(this.values.length - 1);
	}

	/**
	 * Returns the sum of the first `index + 1` many items.
	 * @returns `SUM(0 <= j <= index, values[j])`.
	 */
	public getPrefixSum(index: number): number {
		if (index < 0) {
			return 0;
		}

		index = toUint32(index);
		return this._getPrefixSum(index);
	}

	private _getPrefixSum(index: number): number {
		if (index <= this.prefixSumValidIndex[0]) {
			return this.prefixSum[index];
		}

		let startIndex = this.prefixSumValidIndex[0] + 1;
		if (startIndex === 0) {
			this.prefixSum[0] = this.values[0];
			startIndex++;
		}

		if (index >= this.values.length) {
			index = this.values.length - 1;
		}

		for (let i = startIndex; i <= index; i++) {
			this.prefixSum[i] = this.prefixSum[i - 1] + this.values[i];
		}
		this.prefixSumValidIndex[0] = Math.max(this.prefixSumValidIndex[0], index);
		return this.prefixSum[index];
	}

	public getIndexOf(sum: number): PrefixSumIndexOfResult {
		sum = Math.floor(sum);

		// Compute all sums (to get a fully valid prefixSum)
		this.getTotalSum();

		let low = 0;
		let high = this.values.length - 1;
		let mid = 0;
		let midStop = 0;
		let midStart = 0;

		while (low <= high) {
			mid = low + ((high - low) / 2) | 0;

			midStop = this.prefixSum[mid];
			midStart = midStop - this.values[mid];

			if (sum < midStart) {
				high = mid - 1;
			} else if (sum >= midStop) {
				low = mid + 1;
			} else {
				break;
			}
		}

		return new PrefixSumIndexOfResult(mid, sum - midStart);
	}
}

/**
 * {@link getIndexOf} has an amortized runtime complexity of O(1).
 *
 * ({@link PrefixSumComputer.getIndexOf} is just  O(log n))
*/
export class ConstantTimePrefixSumComputer {
	private _values: number[];
	private _isValid: boolean;
	private _validEndIndex: number;

	/**
	 * _prefixSum[i] = SUM(values[j]), 0 <= j <= i
	 */
	private _prefixSum: number[];

	/**
	 * _indexBySum[sum] = idx => _prefixSum[idx - 1] <= sum < _prefixSum[idx]
	*/
	private _indexBySum: number[];

	constructor(values: number[]) {
		this._values = values;
		this._isValid = false;
		this._validEndIndex = -1;
		this._prefixSum = [];
		this._indexBySum = [];
	}

	/**
	 * @returns SUM(0 <= j < values.length, values[j])
	 */
	public getTotalSum(): number {
		this._ensureValid();
		return this._indexBySum.length;
	}

	/**
	 * Returns the sum of the first `count` many items.
	 * @returns `SUM(0 <= j < count, values[j])`.
	 */
	public getPrefixSum(count: number): number {
		this._ensureValid();
		if (count === 0) {
			return 0;
		}
		return this._prefixSum[count - 1];
	}

	/**
	 * @returns `result`, such that `getPrefixSum(result.index) + result.remainder = sum`
	 */
	public getIndexOf(sum: number): PrefixSumIndexOfResult {
		this._ensureValid();
		const idx = this._indexBySum[sum];
		const viewLinesAbove = idx > 0 ? this._prefixSum[idx - 1] : 0;
		return new PrefixSumIndexOfResult(idx, sum - viewLinesAbove);
	}

	public removeValues(start: number, deleteCount: number): void {
		this._values.splice(start, deleteCount);
		this._invalidate(start);
	}

	public insertValues(insertIndex: number, insertArr: number[]): void {
		this._values = arrayInsert(this._values, insertIndex, insertArr);
		this._invalidate(insertIndex);
	}

	private _invalidate(index: number): void {
		this._isValid = false;
		this._validEndIndex = Math.min(this._validEndIndex, index - 1);
	}

	private _ensureValid(): void {
		if (this._isValid) {
			return;
		}

		for (let i = this._validEndIndex + 1, len = this._values.length; i < len; i++) {
			const value = this._values[i];
			const sumAbove = i > 0 ? this._prefixSum[i - 1] : 0;

			this._prefixSum[i] = sumAbove + value;
			for (let j = 0; j < value; j++) {
				this._indexBySum[sumAbove + j] = i;
			}
		}

		// trim things
		this._prefixSum.length = this._values.length;
		this._indexBySum.length = this._prefixSum[this._prefixSum.length - 1];

		// mark as valid
		this._isValid = true;
		this._validEndIndex = this._values.length - 1;
	}

	public setValue(index: number, value: number): void {
		if (this._values[index] === value) {
			// no change
			return;
		}
		this._values[index] = value;
		this._invalidate(index);
	}
}


export class PrefixSumIndexOfResult {
	_prefixSumIndexOfResultBrand: void = undefined;

	constructor(
		public readonly index: number,
		public readonly remainder: number
	) {
		this.index = index;
		this.remainder = remainder;
	}
}
```

--------------------------------------------------------------------------------

````
