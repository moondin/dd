---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 225
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 225 of 552)

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

---[FILE: src/vs/editor/contrib/folding/browser/foldingRanges.ts]---
Location: vscode-main/src/vs/editor/contrib/folding/browser/foldingRanges.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SelectedLines } from './folding.js';

export interface ILineRange {
	startLineNumber: number;
	endLineNumber: number;
}

export const enum FoldSource {
	provider = 0,
	userDefined = 1,
	recovered = 2
}

export const foldSourceAbbr = {
	[FoldSource.provider]: ' ',
	[FoldSource.userDefined]: 'u',
	[FoldSource.recovered]: 'r',
};

export interface FoldRange {
	startLineNumber: number;
	endLineNumber: number;
	type: string | undefined;
	isCollapsed: boolean;
	source: FoldSource;
}

export const MAX_FOLDING_REGIONS = 0xFFFF;
export const MAX_LINE_NUMBER = 0xFFFFFF;

const MASK_INDENT = 0xFF000000;

class BitField {
	private readonly _states: Uint32Array;
	constructor(size: number) {
		const numWords = Math.ceil(size / 32);
		this._states = new Uint32Array(numWords);
	}

	public get(index: number): boolean {
		const arrayIndex = (index / 32) | 0;
		const bit = index % 32;
		return (this._states[arrayIndex] & (1 << bit)) !== 0;
	}

	public set(index: number, newState: boolean) {
		const arrayIndex = (index / 32) | 0;
		const bit = index % 32;
		const value = this._states[arrayIndex];
		if (newState) {
			this._states[arrayIndex] = value | (1 << bit);
		} else {
			this._states[arrayIndex] = value & ~(1 << bit);
		}
	}
}

export class FoldingRegions {
	private readonly _startIndexes: Uint32Array;
	private readonly _endIndexes: Uint32Array;
	private readonly _collapseStates: BitField;
	private readonly _userDefinedStates: BitField;
	private readonly _recoveredStates: BitField;

	private _parentsComputed: boolean;
	private readonly _types: Array<string | undefined> | undefined;

	constructor(startIndexes: Uint32Array, endIndexes: Uint32Array, types?: Array<string | undefined>) {
		if (startIndexes.length !== endIndexes.length || startIndexes.length > MAX_FOLDING_REGIONS) {
			throw new Error('invalid startIndexes or endIndexes size');
		}
		this._startIndexes = startIndexes;
		this._endIndexes = endIndexes;
		this._collapseStates = new BitField(startIndexes.length);
		this._userDefinedStates = new BitField(startIndexes.length);
		this._recoveredStates = new BitField(startIndexes.length);
		this._types = types;
		this._parentsComputed = false;
	}

	private ensureParentIndices() {
		if (!this._parentsComputed) {
			this._parentsComputed = true;
			const parentIndexes: number[] = [];
			const isInsideLast = (startLineNumber: number, endLineNumber: number) => {
				const index = parentIndexes[parentIndexes.length - 1];
				return this.getStartLineNumber(index) <= startLineNumber && this.getEndLineNumber(index) >= endLineNumber;
			};
			for (let i = 0, len = this._startIndexes.length; i < len; i++) {
				const startLineNumber = this._startIndexes[i];
				const endLineNumber = this._endIndexes[i];
				if (startLineNumber > MAX_LINE_NUMBER || endLineNumber > MAX_LINE_NUMBER) {
					throw new Error('startLineNumber or endLineNumber must not exceed ' + MAX_LINE_NUMBER);
				}
				while (parentIndexes.length > 0 && !isInsideLast(startLineNumber, endLineNumber)) {
					parentIndexes.pop();
				}
				const parentIndex = parentIndexes.length > 0 ? parentIndexes[parentIndexes.length - 1] : -1;
				parentIndexes.push(i);
				this._startIndexes[i] = startLineNumber + ((parentIndex & 0xFF) << 24);
				this._endIndexes[i] = endLineNumber + ((parentIndex & 0xFF00) << 16);
			}
		}
	}

	public get length(): number {
		return this._startIndexes.length;
	}

	public getStartLineNumber(index: number): number {
		return this._startIndexes[index] & MAX_LINE_NUMBER;
	}

	public getEndLineNumber(index: number): number {
		return this._endIndexes[index] & MAX_LINE_NUMBER;
	}

	public getType(index: number): string | undefined {
		return this._types ? this._types[index] : undefined;
	}

	public hasTypes() {
		return !!this._types;
	}

	public isCollapsed(index: number): boolean {
		return this._collapseStates.get(index);
	}

	public setCollapsed(index: number, newState: boolean) {
		this._collapseStates.set(index, newState);
	}

	private isUserDefined(index: number): boolean {
		return this._userDefinedStates.get(index);
	}

	private setUserDefined(index: number, newState: boolean) {
		return this._userDefinedStates.set(index, newState);
	}

	private isRecovered(index: number): boolean {
		return this._recoveredStates.get(index);
	}

	private setRecovered(index: number, newState: boolean) {
		return this._recoveredStates.set(index, newState);
	}

	public getSource(index: number): FoldSource {
		if (this.isUserDefined(index)) {
			return FoldSource.userDefined;
		} else if (this.isRecovered(index)) {
			return FoldSource.recovered;
		}
		return FoldSource.provider;
	}

	public setSource(index: number, source: FoldSource): void {
		if (source === FoldSource.userDefined) {
			this.setUserDefined(index, true);
			this.setRecovered(index, false);
		} else if (source === FoldSource.recovered) {
			this.setUserDefined(index, false);
			this.setRecovered(index, true);
		} else {
			this.setUserDefined(index, false);
			this.setRecovered(index, false);
		}
	}

	public setCollapsedAllOfType(type: string, newState: boolean) {
		let hasChanged = false;
		if (this._types) {
			for (let i = 0; i < this._types.length; i++) {
				if (this._types[i] === type) {
					this.setCollapsed(i, newState);
					hasChanged = true;
				}
			}
		}
		return hasChanged;
	}

	public toRegion(index: number): FoldingRegion {
		return new FoldingRegion(this, index);
	}

	public getParentIndex(index: number) {
		this.ensureParentIndices();
		const parent = ((this._startIndexes[index] & MASK_INDENT) >>> 24) + ((this._endIndexes[index] & MASK_INDENT) >>> 16);
		if (parent === MAX_FOLDING_REGIONS) {
			return -1;
		}
		return parent;
	}

	public contains(index: number, line: number) {
		return this.getStartLineNumber(index) <= line && this.getEndLineNumber(index) >= line;
	}

	private findIndex(line: number) {
		let low = 0, high = this._startIndexes.length;
		if (high === 0) {
			return -1; // no children
		}
		while (low < high) {
			const mid = Math.floor((low + high) / 2);
			if (line < this.getStartLineNumber(mid)) {
				high = mid;
			} else {
				low = mid + 1;
			}
		}
		return low - 1;
	}

	public findRange(line: number): number {
		let index = this.findIndex(line);
		if (index >= 0) {
			const endLineNumber = this.getEndLineNumber(index);
			if (endLineNumber >= line) {
				return index;
			}
			index = this.getParentIndex(index);
			while (index !== -1) {
				if (this.contains(index, line)) {
					return index;
				}
				index = this.getParentIndex(index);
			}
		}
		return -1;
	}


	public toString() {
		const res: string[] = [];
		for (let i = 0; i < this.length; i++) {
			res[i] = `[${foldSourceAbbr[this.getSource(i)]}${this.isCollapsed(i) ? '+' : '-'}] ${this.getStartLineNumber(i)}/${this.getEndLineNumber(i)}`;
		}
		return res.join(', ');
	}

	public toFoldRange(index: number): FoldRange {
		return {
			startLineNumber: this._startIndexes[index] & MAX_LINE_NUMBER,
			endLineNumber: this._endIndexes[index] & MAX_LINE_NUMBER,
			type: this._types ? this._types[index] : undefined,
			isCollapsed: this.isCollapsed(index),
			source: this.getSource(index)
		};
	}

	public static fromFoldRanges(ranges: FoldRange[]): FoldingRegions {
		const rangesLength = ranges.length;
		const startIndexes = new Uint32Array(rangesLength);
		const endIndexes = new Uint32Array(rangesLength);
		let types: Array<string | undefined> | undefined = [];
		let gotTypes = false;
		for (let i = 0; i < rangesLength; i++) {
			const range = ranges[i];
			startIndexes[i] = range.startLineNumber;
			endIndexes[i] = range.endLineNumber;
			types.push(range.type);
			if (range.type) {
				gotTypes = true;
			}
		}
		if (!gotTypes) {
			types = undefined;
		}
		const regions = new FoldingRegions(startIndexes, endIndexes, types);
		for (let i = 0; i < rangesLength; i++) {
			if (ranges[i].isCollapsed) {
				regions.setCollapsed(i, true);
			}
			regions.setSource(i, ranges[i].source);
		}
		return regions;
	}

	/**
	 * Two inputs, each a FoldingRegions or a FoldRange[], are merged.
	 * Each input must be pre-sorted on startLineNumber.
	 * The first list is assumed to always include all regions currently defined by range providers.
	 * The second list only contains the previously collapsed and all manual ranges.
	 * If the line position matches, the range of the new range is taken, and the range is no longer manual
	 * When an entry in one list overlaps an entry in the other, the second list's entry "wins" and
	 * overlapping entries in the first list are discarded.
	 * Invalid entries are discarded. An entry is invalid if:
	 * 		the start and end line numbers aren't a valid range of line numbers,
	 * 		it is out of sequence or has the same start line as a preceding entry,
	 * 		it overlaps a preceding entry and is not fully contained by that entry.
	 */
	public static sanitizeAndMerge(
		rangesA: FoldingRegions | FoldRange[],
		rangesB: FoldingRegions | FoldRange[],
		maxLineNumber: number | undefined,
		selection?: SelectedLines
	): FoldRange[] {

		maxLineNumber = maxLineNumber ?? Number.MAX_VALUE;

		const getIndexedFunction = (r: FoldingRegions | FoldRange[], limit: number) => {
			return Array.isArray(r)
				? ((i: number) => { return (i < limit) ? r[i] : undefined; })
				: ((i: number) => { return (i < limit) ? r.toFoldRange(i) : undefined; });
		};
		const getA = getIndexedFunction(rangesA, rangesA.length);
		const getB = getIndexedFunction(rangesB, rangesB.length);
		let indexA = 0;
		let indexB = 0;
		let nextA = getA(0);
		let nextB = getB(0);

		const stackedRanges: FoldRange[] = [];
		let topStackedRange: FoldRange | undefined;
		let prevLineNumber = 0;
		const resultRanges: FoldRange[] = [];

		while (nextA || nextB) {

			let useRange: FoldRange | undefined = undefined;
			if (nextB && (!nextA || nextA.startLineNumber >= nextB.startLineNumber)) {
				if (nextA && nextA.startLineNumber === nextB.startLineNumber) {
					if (nextB.source === FoldSource.userDefined) {
						// a user defined range (possibly unfolded)
						useRange = nextB;
					} else {
						// a previously folded range or a (possibly unfolded) recovered range
						useRange = nextA;
						// stays collapsed if the range still has the same number of lines or the selection is not in the range or after it
						useRange.isCollapsed = nextB.isCollapsed && (nextA.endLineNumber === nextB.endLineNumber || !selection?.startsInside(nextA.startLineNumber + 1, nextA.endLineNumber + 1));
						useRange.source = FoldSource.provider;
					}
					nextA = getA(++indexA); // not necessary, just for speed
				} else {
					useRange = nextB;
					if (nextB.isCollapsed && nextB.source === FoldSource.provider) {
						// a previously collapsed range
						useRange.source = FoldSource.recovered;
					}
				}
				nextB = getB(++indexB);
			} else {
				// nextA is next. The user folded B set takes precedence and we sometimes need to look
				// ahead in it to check for an upcoming conflict.
				let scanIndex = indexB;
				let prescanB = nextB;
				while (true) {
					if (!prescanB || prescanB.startLineNumber > nextA!.endLineNumber) {
						useRange = nextA;
						break; // no conflict, use this nextA
					}
					if (prescanB.source === FoldSource.userDefined && prescanB.endLineNumber > nextA!.endLineNumber) {
						// we found a user folded range, it wins
						break; // without setting nextResult, so this nextA gets skipped
					}
					prescanB = getB(++scanIndex);
				}
				nextA = getA(++indexA);
			}

			if (useRange) {
				while (topStackedRange
					&& topStackedRange.endLineNumber < useRange.startLineNumber) {
					topStackedRange = stackedRanges.pop();
				}
				if (useRange.endLineNumber > useRange.startLineNumber
					&& useRange.startLineNumber > prevLineNumber
					&& useRange.endLineNumber <= maxLineNumber
					&& (!topStackedRange
						|| topStackedRange.endLineNumber >= useRange.endLineNumber)) {
					resultRanges.push(useRange);
					prevLineNumber = useRange.startLineNumber;
					if (topStackedRange) {
						stackedRanges.push(topStackedRange);
					}
					topStackedRange = useRange;
				}
			}

		}
		return resultRanges;
	}

}

export class FoldingRegion {

	constructor(private readonly ranges: FoldingRegions, private index: number) {
	}

	public get startLineNumber() {
		return this.ranges.getStartLineNumber(this.index);
	}

	public get endLineNumber() {
		return this.ranges.getEndLineNumber(this.index);
	}

	public get regionIndex() {
		return this.index;
	}

	public get parentIndex() {
		return this.ranges.getParentIndex(this.index);
	}

	public get isCollapsed() {
		return this.ranges.isCollapsed(this.index);
	}

	containedBy(range: ILineRange): boolean {
		return range.startLineNumber <= this.startLineNumber && range.endLineNumber >= this.endLineNumber;
	}
	containsLine(lineNumber: number) {
		return this.startLineNumber <= lineNumber && lineNumber <= this.endLineNumber;
	}
	hidesLine(lineNumber: number) {
		return this.startLineNumber < lineNumber && lineNumber <= this.endLineNumber;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/folding/browser/hiddenRangeModel.ts]---
Location: vscode-main/src/vs/editor/contrib/folding/browser/hiddenRangeModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { findFirstIdxMonotonousOrArrLen } from '../../../../base/common/arraysFind.js';

import { Emitter, Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { IRange, Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { IModelContentChangedEvent } from '../../../common/textModelEvents.js';
import { countEOL } from '../../../common/core/misc/eolCounter.js';
import { FoldingModel } from './foldingModel.js';

export class HiddenRangeModel {

	private readonly _foldingModel: FoldingModel;
	private _hiddenRanges: IRange[];
	private _foldingModelListener: IDisposable | null;
	private readonly _updateEventEmitter = new Emitter<IRange[]>();
	private _hasLineChanges: boolean = false;

	public get onDidChange(): Event<IRange[]> { return this._updateEventEmitter.event; }
	public get hiddenRanges() { return this._hiddenRanges; }

	public constructor(model: FoldingModel) {
		this._foldingModel = model;
		this._foldingModelListener = model.onDidChange(_ => this.updateHiddenRanges());
		this._hiddenRanges = [];
		if (model.regions.length) {
			this.updateHiddenRanges();
		}
	}

	public notifyChangeModelContent(e: IModelContentChangedEvent) {
		if (this._hiddenRanges.length && !this._hasLineChanges) {
			this._hasLineChanges = e.changes.some(change => {
				return change.range.endLineNumber !== change.range.startLineNumber || countEOL(change.text)[0] !== 0;
			});
		}
	}

	private updateHiddenRanges(): void {
		let updateHiddenAreas = false;
		const newHiddenAreas: IRange[] = [];
		let i = 0; // index into hidden
		let k = 0;

		let lastCollapsedStart = Number.MAX_VALUE;
		let lastCollapsedEnd = -1;

		const ranges = this._foldingModel.regions;
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

			if (!updateHiddenAreas && k < this._hiddenRanges.length && this._hiddenRanges[k].startLineNumber === startLineNumber && this._hiddenRanges[k].endLineNumber === endLineNumber) {
				// reuse the old ranges
				newHiddenAreas.push(this._hiddenRanges[k]);
				k++;
			} else {
				updateHiddenAreas = true;
				newHiddenAreas.push(new Range(startLineNumber, 1, endLineNumber, 1));
			}
			lastCollapsedStart = startLineNumber;
			lastCollapsedEnd = endLineNumber;
		}
		if (this._hasLineChanges || updateHiddenAreas || k < this._hiddenRanges.length) {
			this.applyHiddenRanges(newHiddenAreas);
		}
	}

	private applyHiddenRanges(newHiddenAreas: IRange[]) {
		this._hiddenRanges = newHiddenAreas;
		this._hasLineChanges = false;
		this._updateEventEmitter.fire(newHiddenAreas);
	}

	public hasRanges() {
		return this._hiddenRanges.length > 0;
	}

	public isHidden(line: number): boolean {
		return findRange(this._hiddenRanges, line) !== null;
	}

	public adjustSelections(selections: Selection[]): boolean {
		let hasChanges = false;
		const editorModel = this._foldingModel.textModel;
		let lastRange: IRange | null = null;

		const adjustLine = (line: number) => {
			if (!lastRange || !isInside(line, lastRange)) {
				lastRange = findRange(this._hiddenRanges, line);
			}
			if (lastRange) {
				return lastRange.startLineNumber - 1;
			}
			return null;
		};
		for (let i = 0, len = selections.length; i < len; i++) {
			let selection = selections[i];
			const adjustedStartLine = adjustLine(selection.startLineNumber);
			if (adjustedStartLine) {
				selection = selection.setStartPosition(adjustedStartLine, editorModel.getLineMaxColumn(adjustedStartLine));
				hasChanges = true;
			}
			const adjustedEndLine = adjustLine(selection.endLineNumber);
			if (adjustedEndLine) {
				selection = selection.setEndPosition(adjustedEndLine, editorModel.getLineMaxColumn(adjustedEndLine));
				hasChanges = true;
			}
			selections[i] = selection;
		}
		return hasChanges;
	}


	public dispose() {
		if (this.hiddenRanges.length > 0) {
			this._hiddenRanges = [];
			this._updateEventEmitter.fire(this._hiddenRanges);
		}
		if (this._foldingModelListener) {
			this._foldingModelListener.dispose();
			this._foldingModelListener = null;
		}
	}
}

function isInside(line: number, range: IRange) {
	return line >= range.startLineNumber && line <= range.endLineNumber;
}
function findRange(ranges: IRange[], line: number): IRange | null {
	const i = findFirstIdxMonotonousOrArrLen(ranges, r => line < r.startLineNumber) - 1;
	if (i >= 0 && ranges[i].endLineNumber >= line) {
		return ranges[i];
	}
	return null;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/folding/browser/indentRangeProvider.ts]---
Location: vscode-main/src/vs/editor/contrib/folding/browser/indentRangeProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ITextModel } from '../../../common/model.js';
import { computeIndentLevel } from '../../../common/model/utils.js';
import { FoldingMarkers } from '../../../common/languages/languageConfiguration.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { FoldingRegions, MAX_LINE_NUMBER } from './foldingRanges.js';
import { FoldingLimitReporter, RangeProvider } from './folding.js';

const MAX_FOLDING_REGIONS_FOR_INDENT_DEFAULT = 5000;

const ID_INDENT_PROVIDER = 'indent';

export class IndentRangeProvider implements RangeProvider {
	readonly id = ID_INDENT_PROVIDER;

	constructor(
		private readonly editorModel: ITextModel,
		private readonly languageConfigurationService: ILanguageConfigurationService,
		private readonly foldingRangesLimit: FoldingLimitReporter
	) { }

	dispose() { }

	compute(cancelationToken: CancellationToken,): Promise<FoldingRegions> {
		const foldingRules = this.languageConfigurationService.getLanguageConfiguration(this.editorModel.getLanguageId()).foldingRules;
		const offSide = foldingRules && !!foldingRules.offSide;
		const markers = foldingRules && foldingRules.markers;
		return Promise.resolve(computeRanges(this.editorModel, offSide, markers, this.foldingRangesLimit));
	}
}

// public only for testing
export class RangesCollector {
	private readonly _startIndexes: number[];
	private readonly _endIndexes: number[];
	private readonly _indentOccurrences: number[];
	private _length: number;
	private readonly _foldingRangesLimit: FoldingLimitReporter;

	constructor(foldingRangesLimit: FoldingLimitReporter) {
		this._startIndexes = [];
		this._endIndexes = [];
		this._indentOccurrences = [];
		this._length = 0;
		this._foldingRangesLimit = foldingRangesLimit;
	}

	public insertFirst(startLineNumber: number, endLineNumber: number, indent: number) {
		if (startLineNumber > MAX_LINE_NUMBER || endLineNumber > MAX_LINE_NUMBER) {
			return;
		}
		const index = this._length;
		this._startIndexes[index] = startLineNumber;
		this._endIndexes[index] = endLineNumber;
		this._length++;
		if (indent < 1000) {
			this._indentOccurrences[indent] = (this._indentOccurrences[indent] || 0) + 1;
		}
	}

	public toIndentRanges(model: ITextModel) {
		const limit = this._foldingRangesLimit.limit;
		if (this._length <= limit) {
			this._foldingRangesLimit.update(this._length, false);

			// reverse and create arrays of the exact length
			const startIndexes = new Uint32Array(this._length);
			const endIndexes = new Uint32Array(this._length);
			for (let i = this._length - 1, k = 0; i >= 0; i--, k++) {
				startIndexes[k] = this._startIndexes[i];
				endIndexes[k] = this._endIndexes[i];
			}
			return new FoldingRegions(startIndexes, endIndexes);
		} else {
			this._foldingRangesLimit.update(this._length, limit);

			let entries = 0;
			let maxIndent = this._indentOccurrences.length;
			for (let i = 0; i < this._indentOccurrences.length; i++) {
				const n = this._indentOccurrences[i];
				if (n) {
					if (n + entries > limit) {
						maxIndent = i;
						break;
					}
					entries += n;
				}
			}
			const tabSize = model.getOptions().tabSize;
			// reverse and create arrays of the exact length
			const startIndexes = new Uint32Array(limit);
			const endIndexes = new Uint32Array(limit);
			for (let i = this._length - 1, k = 0; i >= 0; i--) {
				const startIndex = this._startIndexes[i];
				const lineContent = model.getLineContent(startIndex);
				const indent = computeIndentLevel(lineContent, tabSize);
				if (indent < maxIndent || (indent === maxIndent && entries++ < limit)) {
					startIndexes[k] = startIndex;
					endIndexes[k] = this._endIndexes[i];
					k++;
				}
			}
			return new FoldingRegions(startIndexes, endIndexes);
		}

	}
}


interface PreviousRegion {
	indent: number; // indent or -2 if a marker
	endAbove: number; // end line number for the region above
	line: number; // start line of the region. Only used for marker regions.
}

const foldingRangesLimitDefault: FoldingLimitReporter = {
	limit: MAX_FOLDING_REGIONS_FOR_INDENT_DEFAULT,
	update: () => { }
};

export function computeRanges(model: ITextModel, offSide: boolean, markers?: FoldingMarkers, foldingRangesLimit: FoldingLimitReporter = foldingRangesLimitDefault): FoldingRegions {
	const tabSize = model.getOptions().tabSize;
	const result = new RangesCollector(foldingRangesLimit);

	let pattern: RegExp | undefined = undefined;
	if (markers) {
		pattern = new RegExp(`(${markers.start.source})|(?:${markers.end.source})`);
	}

	const previousRegions: PreviousRegion[] = [];
	const line = model.getLineCount() + 1;
	previousRegions.push({ indent: -1, endAbove: line, line }); // sentinel, to make sure there's at least one entry

	for (let line = model.getLineCount(); line > 0; line--) {
		const lineContent = model.getLineContent(line);
		const indent = computeIndentLevel(lineContent, tabSize);
		let previous = previousRegions[previousRegions.length - 1];
		if (indent === -1) {
			if (offSide) {
				// for offSide languages, empty lines are associated to the previous block
				// note: the next block is already written to the results, so this only
				// impacts the end position of the block before
				previous.endAbove = line;
			}
			continue; // only whitespace
		}
		let m;
		if (pattern && (m = lineContent.match(pattern))) {
			// folding pattern match
			if (m[1]) { // start pattern match
				// discard all regions until the folding pattern
				let i = previousRegions.length - 1;
				while (i > 0 && previousRegions[i].indent !== -2) {
					i--;
				}
				if (i > 0) {
					previousRegions.length = i + 1;
					previous = previousRegions[i];

					// new folding range from pattern, includes the end line
					result.insertFirst(line, previous.line, indent);
					previous.line = line;
					previous.indent = indent;
					previous.endAbove = line;
					continue;
				} else {
					// no end marker found, treat line as a regular line
				}
			} else { // end pattern match
				previousRegions.push({ indent: -2, endAbove: line, line });
				continue;
			}
		}
		if (previous.indent > indent) {
			// discard all regions with larger indent
			do {
				previousRegions.pop();
				previous = previousRegions[previousRegions.length - 1];
			} while (previous.indent > indent);

			// new folding range
			const endLineNumber = previous.endAbove - 1;
			if (endLineNumber - line >= 1) { // needs at east size 1
				result.insertFirst(line, endLineNumber, indent);
			}
		}
		if (previous.indent === indent) {
			previous.endAbove = line;
		} else { // previous.indent < indent
			// new region with a bigger indent
			previousRegions.push({ indent, endAbove: line, line });
		}
	}
	return result.toIndentRanges(model);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/folding/browser/syntaxRangeProvider.ts]---
Location: vscode-main/src/vs/editor/contrib/folding/browser/syntaxRangeProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ITextModel } from '../../../common/model.js';
import { FoldingContext, FoldingRange, FoldingRangeProvider } from '../../../common/languages.js';
import { FoldingLimitReporter, RangeProvider } from './folding.js';
import { FoldingRegions, MAX_LINE_NUMBER } from './foldingRanges.js';

export interface IFoldingRangeData extends FoldingRange {
	rank: number;
}

const foldingContext: FoldingContext = {
};

const ID_SYNTAX_PROVIDER = 'syntax';

export class SyntaxRangeProvider implements RangeProvider {

	readonly id = ID_SYNTAX_PROVIDER;

	readonly disposables: DisposableStore;

	constructor(
		private readonly editorModel: ITextModel,
		private readonly providers: FoldingRangeProvider[],
		readonly handleFoldingRangesChange: () => void,
		private readonly foldingRangesLimit: FoldingLimitReporter,
		private readonly fallbackRangeProvider: RangeProvider | undefined // used when all providers return null
	) {
		this.disposables = new DisposableStore();
		if (fallbackRangeProvider) {
			this.disposables.add(fallbackRangeProvider);
		}

		for (const provider of providers) {
			if (typeof provider.onDidChange === 'function') {
				this.disposables.add(provider.onDidChange(handleFoldingRangesChange));
			}
		}
	}

	compute(cancellationToken: CancellationToken): Promise<FoldingRegions | null> {
		return collectSyntaxRanges(this.providers, this.editorModel, cancellationToken).then(ranges => {
			if (this.editorModel.isDisposed()) {
				return null;
			}
			if (ranges) {
				const res = sanitizeRanges(ranges, this.foldingRangesLimit);
				return res;
			}
			return this.fallbackRangeProvider?.compute(cancellationToken) ?? null;
		});
	}

	dispose() {
		this.disposables.dispose();
	}
}

function collectSyntaxRanges(providers: FoldingRangeProvider[], model: ITextModel, cancellationToken: CancellationToken): Promise<IFoldingRangeData[] | null> {
	let rangeData: IFoldingRangeData[] | null = null;
	const promises = providers.map((provider, i) => {
		return Promise.resolve(provider.provideFoldingRanges(model, foldingContext, cancellationToken)).then(ranges => {
			if (cancellationToken.isCancellationRequested) {
				return;
			}
			if (Array.isArray(ranges)) {
				if (!Array.isArray(rangeData)) {
					rangeData = [];
				}
				const nLines = model.getLineCount();
				for (const r of ranges) {
					if (r.start > 0 && r.end > r.start && r.end <= nLines) {
						rangeData.push({ start: r.start, end: r.end, rank: i, kind: r.kind });
					}
				}
			}
		}, onUnexpectedExternalError);
	});
	return Promise.all(promises).then(_ => {
		return rangeData;
	});
}

class RangesCollector {
	private readonly _startIndexes: number[];
	private readonly _endIndexes: number[];
	private readonly _nestingLevels: number[];
	private readonly _nestingLevelCounts: number[];
	private readonly _types: Array<string | undefined>;
	private _length: number;
	private readonly _foldingRangesLimit: FoldingLimitReporter;

	constructor(foldingRangesLimit: FoldingLimitReporter) {
		this._startIndexes = [];
		this._endIndexes = [];
		this._nestingLevels = [];
		this._nestingLevelCounts = [];
		this._types = [];
		this._length = 0;
		this._foldingRangesLimit = foldingRangesLimit;
	}

	public add(startLineNumber: number, endLineNumber: number, type: string | undefined, nestingLevel: number) {
		if (startLineNumber > MAX_LINE_NUMBER || endLineNumber > MAX_LINE_NUMBER) {
			return;
		}
		const index = this._length;
		this._startIndexes[index] = startLineNumber;
		this._endIndexes[index] = endLineNumber;
		this._nestingLevels[index] = nestingLevel;
		this._types[index] = type;
		this._length++;
		if (nestingLevel < 30) {
			this._nestingLevelCounts[nestingLevel] = (this._nestingLevelCounts[nestingLevel] || 0) + 1;
		}
	}

	public toIndentRanges() {
		const limit = this._foldingRangesLimit.limit;
		if (this._length <= limit) {
			this._foldingRangesLimit.update(this._length, false);

			const startIndexes = new Uint32Array(this._length);
			const endIndexes = new Uint32Array(this._length);
			for (let i = 0; i < this._length; i++) {
				startIndexes[i] = this._startIndexes[i];
				endIndexes[i] = this._endIndexes[i];
			}
			return new FoldingRegions(startIndexes, endIndexes, this._types);
		} else {
			this._foldingRangesLimit.update(this._length, limit);

			let entries = 0;
			let maxLevel = this._nestingLevelCounts.length;
			for (let i = 0; i < this._nestingLevelCounts.length; i++) {
				const n = this._nestingLevelCounts[i];
				if (n) {
					if (n + entries > limit) {
						maxLevel = i;
						break;
					}
					entries += n;
				}
			}

			const startIndexes = new Uint32Array(limit);
			const endIndexes = new Uint32Array(limit);
			const types: Array<string | undefined> = [];
			for (let i = 0, k = 0; i < this._length; i++) {
				const level = this._nestingLevels[i];
				if (level < maxLevel || (level === maxLevel && entries++ < limit)) {
					startIndexes[k] = this._startIndexes[i];
					endIndexes[k] = this._endIndexes[i];
					types[k] = this._types[i];
					k++;
				}
			}
			return new FoldingRegions(startIndexes, endIndexes, types);
		}

	}

}

export function sanitizeRanges(rangeData: IFoldingRangeData[], foldingRangesLimit: FoldingLimitReporter): FoldingRegions {
	const sorted = rangeData.sort((d1, d2) => {
		let diff = d1.start - d2.start;
		if (diff === 0) {
			diff = d1.rank - d2.rank;
		}
		return diff;
	});
	const collector = new RangesCollector(foldingRangesLimit);

	let top: IFoldingRangeData | undefined = undefined;
	const previous: IFoldingRangeData[] = [];
	for (const entry of sorted) {
		if (!top) {
			top = entry;
			collector.add(entry.start, entry.end, entry.kind && entry.kind.value, previous.length);
		} else {
			if (entry.start > top.start) {
				if (entry.end <= top.end) {
					previous.push(top);
					top = entry;
					collector.add(entry.start, entry.end, entry.kind && entry.kind.value, previous.length);
				} else {
					if (entry.start > top.end) {
						do {
							top = previous.pop();
						} while (top && entry.start > top.end);
						if (top) {
							previous.push(top);
						}
						top = entry;
					}
					collector.add(entry.start, entry.end, entry.kind && entry.kind.value, previous.length);
				}
			}
		}
	}
	return collector.toIndentRanges();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/folding/test/browser/foldingModel.test.ts]---
Location: vscode-main/src/vs/editor/contrib/folding/test/browser/foldingModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { escapeRegExpCharacters } from '../../../../../base/common/strings.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { EditOperation } from '../../../../common/core/editOperation.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { Selection } from '../../../../common/core/selection.js';
import { IModelDecorationsChangeAccessor, ITextModel, TrackedRangeStickiness } from '../../../../common/model.js';
import { ModelDecorationOptions } from '../../../../common/model/textModel.js';
import { toSelectedLines } from '../../browser/folding.js';
import { FoldingModel, getNextFoldLine, getParentFoldLine, getPreviousFoldLine, setCollapseStateAtLevel, setCollapseStateForMatchingLines, setCollapseStateForRest, setCollapseStateLevelsDown, setCollapseStateLevelsUp, setCollapseStateUp } from '../../browser/foldingModel.js';
import { FoldingRegion } from '../../browser/foldingRanges.js';
import { computeRanges } from '../../browser/indentRangeProvider.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';


interface ExpectedRegion {
	startLineNumber: number;
	endLineNumber: number;
	isCollapsed: boolean;
}

interface ExpectedDecoration {
	line: number;
	type: 'hidden' | 'collapsed' | 'expanded';
}

export class TestDecorationProvider {

	private static readonly collapsedDecoration = ModelDecorationOptions.register({
		description: 'test',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		linesDecorationsClassName: 'folding'
	});

	private static readonly expandedDecoration = ModelDecorationOptions.register({
		description: 'test',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		linesDecorationsClassName: 'folding'
	});

	private static readonly hiddenDecoration = ModelDecorationOptions.register({
		description: 'test',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		linesDecorationsClassName: 'folding'
	});

	constructor(private model: ITextModel) {
	}

	getDecorationOption(isCollapsed: boolean, isHidden: boolean): ModelDecorationOptions {
		if (isHidden) {
			return TestDecorationProvider.hiddenDecoration;
		}
		if (isCollapsed) {
			return TestDecorationProvider.collapsedDecoration;
		}
		return TestDecorationProvider.expandedDecoration;
	}

	changeDecorations<T>(callback: (changeAccessor: IModelDecorationsChangeAccessor) => T): (T | null) {
		return this.model.changeDecorations(callback);
	}

	removeDecorations(decorationIds: string[]): void {
		this.model.changeDecorations((changeAccessor) => {
			changeAccessor.deltaDecorations(decorationIds, []);
		});
	}

	getDecorations(): ExpectedDecoration[] {
		const decorations = this.model.getAllDecorations();
		const res: ExpectedDecoration[] = [];
		for (const decoration of decorations) {
			if (decoration.options === TestDecorationProvider.hiddenDecoration) {
				res.push({ line: decoration.range.startLineNumber, type: 'hidden' });
			} else if (decoration.options === TestDecorationProvider.collapsedDecoration) {
				res.push({ line: decoration.range.startLineNumber, type: 'collapsed' });
			} else if (decoration.options === TestDecorationProvider.expandedDecoration) {
				res.push({ line: decoration.range.startLineNumber, type: 'expanded' });
			}
		}
		return res;
	}
}

suite('Folding Model', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	function r(startLineNumber: number, endLineNumber: number, isCollapsed: boolean = false): ExpectedRegion {
		return { startLineNumber, endLineNumber, isCollapsed };
	}

	function d(line: number, type: 'hidden' | 'collapsed' | 'expanded'): ExpectedDecoration {
		return { line, type };
	}

	function assertRegion(actual: FoldingRegion | null, expected: ExpectedRegion | null, message?: string) {
		assert.strictEqual(!!actual, !!expected, message);
		if (actual && expected) {
			assert.strictEqual(actual.startLineNumber, expected.startLineNumber, message);
			assert.strictEqual(actual.endLineNumber, expected.endLineNumber, message);
			assert.strictEqual(actual.isCollapsed, expected.isCollapsed, message);
		}
	}

	function assertFoldedRanges(foldingModel: FoldingModel, expectedRegions: ExpectedRegion[], message?: string) {
		const actualRanges: ExpectedRegion[] = [];
		const actual = foldingModel.regions;
		for (let i = 0; i < actual.length; i++) {
			if (actual.isCollapsed(i)) {
				actualRanges.push(r(actual.getStartLineNumber(i), actual.getEndLineNumber(i)));
			}
		}
		assert.deepStrictEqual(actualRanges, expectedRegions, message);
	}

	function assertRanges(foldingModel: FoldingModel, expectedRegions: ExpectedRegion[], message?: string) {
		const actualRanges: ExpectedRegion[] = [];
		const actual = foldingModel.regions;
		for (let i = 0; i < actual.length; i++) {
			actualRanges.push(r(actual.getStartLineNumber(i), actual.getEndLineNumber(i), actual.isCollapsed(i)));
		}
		assert.deepStrictEqual(actualRanges, expectedRegions, message);
	}

	function assertDecorations(foldingModel: FoldingModel, expectedDecoration: ExpectedDecoration[], message?: string) {
		const decorationProvider = foldingModel.decorationProvider as TestDecorationProvider;
		assert.deepStrictEqual(decorationProvider.getDecorations(), expectedDecoration, message);
	}

	function assertRegions(actual: FoldingRegion[], expectedRegions: ExpectedRegion[], message?: string) {
		assert.deepStrictEqual(actual.map(r => ({ startLineNumber: r.startLineNumber, endLineNumber: r.endLineNumber, isCollapsed: r.isCollapsed })), expectedRegions, message);
	}

	test('getRegionAtLine', () => {
		const lines = [
		/* 1*/	'/**',
		/* 2*/	' * Comment',
		/* 3*/	' */',
		/* 4*/	'class A {',
		/* 5*/	'  void foo() {',
		/* 6*/	'    // comment {',
		/* 7*/	'  }',
		/* 8*/	'}'];

		const textModel = createTextModel(lines.join('\n'));
		try {
			const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));

			const ranges = computeRanges(textModel, false, undefined);
			foldingModel.update(ranges);

			const r1 = r(1, 3, false);
			const r2 = r(4, 7, false);
			const r3 = r(5, 6, false);

			assertRanges(foldingModel, [r1, r2, r3]);

			assertRegion(foldingModel.getRegionAtLine(1), r1, '1');
			assertRegion(foldingModel.getRegionAtLine(2), r1, '2');
			assertRegion(foldingModel.getRegionAtLine(3), r1, '3');
			assertRegion(foldingModel.getRegionAtLine(4), r2, '4');
			assertRegion(foldingModel.getRegionAtLine(5), r3, '5');
			assertRegion(foldingModel.getRegionAtLine(6), r3, '5');
			assertRegion(foldingModel.getRegionAtLine(7), r2, '6');
			assertRegion(foldingModel.getRegionAtLine(8), null, '7');
		} finally {
			textModel.dispose();
		}


	});

	test('collapse', () => {
		const lines = [
		/* 1*/	'/**',
		/* 2*/	' * Comment',
		/* 3*/	' */',
		/* 4*/	'class A {',
		/* 5*/	'  void foo() {',
		/* 6*/	'    // comment {',
		/* 7*/	'  }',
		/* 8*/	'}'];

		const textModel = createTextModel(lines.join('\n'));
		try {
			const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));

			const ranges = computeRanges(textModel, false, undefined);
			foldingModel.update(ranges);

			const r1 = r(1, 3, false);
			const r2 = r(4, 7, false);
			const r3 = r(5, 6, false);

			assertRanges(foldingModel, [r1, r2, r3]);

			foldingModel.toggleCollapseState([foldingModel.getRegionAtLine(1)!]);
			foldingModel.update(ranges);

			assertRanges(foldingModel, [r(1, 3, true), r2, r3]);

			foldingModel.toggleCollapseState([foldingModel.getRegionAtLine(5)!]);
			foldingModel.update(ranges);

			assertRanges(foldingModel, [r(1, 3, true), r2, r(5, 6, true)]);

			foldingModel.toggleCollapseState([foldingModel.getRegionAtLine(7)!]);
			foldingModel.update(ranges);

			assertRanges(foldingModel, [r(1, 3, true), r(4, 7, true), r(5, 6, true)]);

			textModel.dispose();
		} finally {
			textModel.dispose();
		}

	});

	test('update', () => {
		const lines = [
		/* 1*/	'/**',
		/* 2*/	' * Comment',
		/* 3*/	' */',
		/* 4*/	'class A {',
		/* 5*/	'  void foo() {',
		/* 6*/	'    // comment {',
		/* 7*/	'  }',
		/* 8*/	'}'];

		const textModel = createTextModel(lines.join('\n'));
		try {
			const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));

			const ranges = computeRanges(textModel, false, undefined);
			foldingModel.update(ranges);

			const r1 = r(1, 3, false);
			const r2 = r(4, 7, false);
			const r3 = r(5, 6, false);

			assertRanges(foldingModel, [r1, r2, r3]);
			foldingModel.toggleCollapseState([foldingModel.getRegionAtLine(2)!, foldingModel.getRegionAtLine(5)!]);

			textModel.applyEdits([EditOperation.insert(new Position(4, 1), '//hello\n')]);

			foldingModel.update(computeRanges(textModel, false, undefined));

			assertRanges(foldingModel, [r(1, 3, true), r(5, 8, false), r(6, 7, true)]);
		} finally {
			textModel.dispose();
		}
	});

	test('delete', () => {
		const lines = [
		/* 1*/	'function foo() {',
		/* 2*/	'  switch (x) {',
		/* 3*/	'    case 1:',
		/* 4*/	'      //hello1',
		/* 5*/	'      break;',
		/* 6*/	'    case 2:',
		/* 7*/	'      //hello2',
		/* 8*/	'      break;',
		/* 9*/	'    case 3:',
		/* 10*/	'      //hello3',
		/* 11*/	'      break;',
		/* 12*/	'  }',
		/* 13*/	'}'];

		const textModel = createTextModel(lines.join('\n'));
		try {
			const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));

			const ranges = computeRanges(textModel, false, undefined);
			foldingModel.update(ranges);

			const r1 = r(1, 12, false);
			const r2 = r(2, 11, false);
			const r3 = r(3, 5, false);
			const r4 = r(6, 8, false);
			const r5 = r(9, 11, false);

			assertRanges(foldingModel, [r1, r2, r3, r4, r5]);
			foldingModel.toggleCollapseState([foldingModel.getRegionAtLine(6)!]);

			textModel.applyEdits([EditOperation.delete(new Range(6, 11, 9, 0))]);

			foldingModel.update(computeRanges(textModel, true, undefined), toSelectedLines([new Selection(7, 1, 7, 1)]));

			assertRanges(foldingModel, [r(1, 9, false), r(2, 8, false), r(3, 5, false), r(6, 8, false)]);
		} finally {
			textModel.dispose();
		}
	});

	test('getRegionsInside', () => {
		const lines = [
		/* 1*/	'/**',
		/* 2*/	' * Comment',
		/* 3*/	' */',
		/* 4*/	'class A {',
		/* 5*/	'  void foo() {',
		/* 6*/	'    // comment {',
		/* 7*/	'  }',
		/* 8*/	'}'];

		const textModel = createTextModel(lines.join('\n'));
		try {
			const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));

			const ranges = computeRanges(textModel, false, undefined);
			foldingModel.update(ranges);

			const r1 = r(1, 3, false);
			const r2 = r(4, 7, false);
			const r3 = r(5, 6, false);

			assertRanges(foldingModel, [r1, r2, r3]);
			const region1 = foldingModel.getRegionAtLine(r1.startLineNumber);
			const region2 = foldingModel.getRegionAtLine(r2.startLineNumber);
			const region3 = foldingModel.getRegionAtLine(r3.startLineNumber);

			assertRegions(foldingModel.getRegionsInside(null), [r1, r2, r3], '1');
			assertRegions(foldingModel.getRegionsInside(region1), [], '2');
			assertRegions(foldingModel.getRegionsInside(region2), [r3], '3');
			assertRegions(foldingModel.getRegionsInside(region3), [], '4');
		} finally {
			textModel.dispose();
		}

	});

	test('getRegionsInsideWithLevel', () => {
		const lines = [
			/* 1*/	'//#region',
			/* 2*/	'//#endregion',
			/* 3*/	'class A {',
			/* 4*/	'  void foo() {',
			/* 5*/	'    if (true) {',
			/* 6*/	'        return;',
			/* 7*/	'    }',
			/* 8*/	'    if (true) {',
			/* 9*/	'      return;',
			/* 10*/	'    }',
			/* 11*/	'  }',
			/* 12*/	'}'];

		const textModel = createTextModel(lines.join('\n'));
		try {

			const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));

			const ranges = computeRanges(textModel, false, { start: /^\/\/#region$/, end: /^\/\/#endregion$/ });
			foldingModel.update(ranges);

			const r1 = r(1, 2, false);
			const r2 = r(3, 11, false);
			const r3 = r(4, 10, false);
			const r4 = r(5, 6, false);
			const r5 = r(8, 9, false);

			const region1 = foldingModel.getRegionAtLine(r1.startLineNumber);
			const region2 = foldingModel.getRegionAtLine(r2.startLineNumber);
			const region3 = foldingModel.getRegionAtLine(r3.startLineNumber);

			assertRanges(foldingModel, [r1, r2, r3, r4, r5]);

			assertRegions(foldingModel.getRegionsInside(null, (r, level) => level === 1), [r1, r2], '1');
			assertRegions(foldingModel.getRegionsInside(null, (r, level) => level === 2), [r3], '2');
			assertRegions(foldingModel.getRegionsInside(null, (r, level) => level === 3), [r4, r5], '3');

			assertRegions(foldingModel.getRegionsInside(region2, (r, level) => level === 1), [r3], '4');
			assertRegions(foldingModel.getRegionsInside(region2, (r, level) => level === 2), [r4, r5], '5');
			assertRegions(foldingModel.getRegionsInside(region3, (r, level) => level === 1), [r4, r5], '6');

			assertRegions(foldingModel.getRegionsInside(region2, (r, level) => r.hidesLine(9)), [r3, r5], '7');

			assertRegions(foldingModel.getRegionsInside(region1, (r, level) => level === 1), [], '8');
		} finally {
			textModel.dispose();
		}

	});

	test('getRegionAtLine2', () => {
		const lines = [
		/* 1*/	'//#region',
		/* 2*/	'class A {',
		/* 3*/	'  void foo() {',
		/* 4*/	'    if (true) {',
		/* 5*/	'      //hello',
		/* 6*/	'    }',
		/* 7*/	'',
		/* 8*/	'  }',
		/* 9*/	'}',
		/* 10*/	'//#endregion',
		/* 11*/	''];

		const textModel = createTextModel(lines.join('\n'));
		try {
			const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));

			const ranges = computeRanges(textModel, false, { start: /^\/\/#region$/, end: /^\/\/#endregion$/ });
			foldingModel.update(ranges);

			const r1 = r(1, 10, false);
			const r2 = r(2, 8, false);
			const r3 = r(3, 7, false);
			const r4 = r(4, 5, false);

			assertRanges(foldingModel, [r1, r2, r3, r4]);

			assertRegions(foldingModel.getAllRegionsAtLine(1), [r1], '1');
			assertRegions(foldingModel.getAllRegionsAtLine(2), [r1, r2].reverse(), '2');
			assertRegions(foldingModel.getAllRegionsAtLine(3), [r1, r2, r3].reverse(), '3');
			assertRegions(foldingModel.getAllRegionsAtLine(4), [r1, r2, r3, r4].reverse(), '4');
			assertRegions(foldingModel.getAllRegionsAtLine(5), [r1, r2, r3, r4].reverse(), '5');
			assertRegions(foldingModel.getAllRegionsAtLine(6), [r1, r2, r3].reverse(), '6');
			assertRegions(foldingModel.getAllRegionsAtLine(7), [r1, r2, r3].reverse(), '7');
			assertRegions(foldingModel.getAllRegionsAtLine(8), [r1, r2].reverse(), '8');
			assertRegions(foldingModel.getAllRegionsAtLine(9), [r1], '9');
			assertRegions(foldingModel.getAllRegionsAtLine(10), [r1], '10');
			assertRegions(foldingModel.getAllRegionsAtLine(11), [], '10');
		} finally {
			textModel.dispose();
		}
	});

	test('setCollapseStateRecursivly', () => {
		const lines = [
		/* 1*/	'//#region',
		/* 2*/	'//#endregion',
		/* 3*/	'class A {',
		/* 4*/	'  void foo() {',
		/* 5*/	'    if (true) {',
		/* 6*/	'        return;',
		/* 7*/	'    }',
		/* 8*/	'',
		/* 9*/	'    if (true) {',
		/* 10*/	'      return;',
		/* 11*/	'    }',
		/* 12*/	'  }',
		/* 13*/	'}'];

		const textModel = createTextModel(lines.join('\n'));
		try {
			const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));

			const ranges = computeRanges(textModel, false, { start: /^\/\/#region$/, end: /^\/\/#endregion$/ });
			foldingModel.update(ranges);

			const r1 = r(1, 2, false);
			const r2 = r(3, 12, false);
			const r3 = r(4, 11, false);
			const r4 = r(5, 6, false);
			const r5 = r(9, 10, false);
			assertRanges(foldingModel, [r1, r2, r3, r4, r5]);

			setCollapseStateLevelsDown(foldingModel, true, Number.MAX_VALUE, [4]);
			assertFoldedRanges(foldingModel, [r3, r4, r5], '1');

			setCollapseStateLevelsDown(foldingModel, false, Number.MAX_VALUE, [8]);
			assertFoldedRanges(foldingModel, [], '2');

			setCollapseStateLevelsDown(foldingModel, true, Number.MAX_VALUE, [12]);
			assertFoldedRanges(foldingModel, [r2, r3, r4, r5], '1');

			setCollapseStateLevelsDown(foldingModel, false, Number.MAX_VALUE, [7]);
			assertFoldedRanges(foldingModel, [r2], '1');

			setCollapseStateLevelsDown(foldingModel, false);
			assertFoldedRanges(foldingModel, [], '1');

			setCollapseStateLevelsDown(foldingModel, true);
			assertFoldedRanges(foldingModel, [r1, r2, r3, r4, r5], '1');
		} finally {
			textModel.dispose();
		}

	});

	test('setCollapseStateAtLevel', () => {
		const lines = [
		/* 1*/	'//#region',
		/* 2*/	'//#endregion',
		/* 3*/	'class A {',
		/* 4*/	'  void foo() {',
		/* 5*/	'    if (true) {',
		/* 6*/	'        return;',
		/* 7*/	'    }',
		/* 8*/	'',
		/* 9*/	'    if (true) {',
		/* 10*/	'      return;',
		/* 11*/	'    }',
		/* 12*/	'  }',
		/* 13*/	'  //#region',
		/* 14*/	'  const bar = 9;',
		/* 15*/	'  //#endregion',
		/* 16*/	'}'];

		const textModel = createTextModel(lines.join('\n'));
		try {
			const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));

			const ranges = computeRanges(textModel, false, { start: /^\s*\/\/#region$/, end: /^\s*\/\/#endregion$/ });
			foldingModel.update(ranges);

			const r1 = r(1, 2, false);
			const r2 = r(3, 15, false);
			const r3 = r(4, 11, false);
			const r4 = r(5, 6, false);
			const r5 = r(9, 10, false);
			const r6 = r(13, 15, false);
			assertRanges(foldingModel, [r1, r2, r3, r4, r5, r6]);

			setCollapseStateAtLevel(foldingModel, 1, true, []);
			assertFoldedRanges(foldingModel, [r1, r2], '1');

			setCollapseStateAtLevel(foldingModel, 1, false, [5]);
			assertFoldedRanges(foldingModel, [r2], '2');

			setCollapseStateAtLevel(foldingModel, 1, false, [1]);
			assertFoldedRanges(foldingModel, [], '3');

			setCollapseStateAtLevel(foldingModel, 2, true, []);
			assertFoldedRanges(foldingModel, [r3, r6], '4');

			setCollapseStateAtLevel(foldingModel, 2, false, [5, 6]);
			assertFoldedRanges(foldingModel, [r3], '5');

			setCollapseStateAtLevel(foldingModel, 3, true, [4, 9]);
			assertFoldedRanges(foldingModel, [r3, r4], '6');

			setCollapseStateAtLevel(foldingModel, 3, false, [4, 9]);
			assertFoldedRanges(foldingModel, [r3], '7');
		} finally {
			textModel.dispose();
		}
	});

	test('setCollapseStateLevelsDown', () => {
		const lines = [
		/* 1*/	'//#region',
		/* 2*/	'//#endregion',
		/* 3*/	'class A {',
		/* 4*/	'  void foo() {',
		/* 5*/	'    if (true) {',
		/* 6*/	'        return;',
		/* 7*/	'    }',
		/* 8*/	'',
		/* 9*/	'    if (true) {',
		/* 10*/	'      return;',
		/* 11*/	'    }',
		/* 12*/	'  }',
		/* 13*/	'}'];

		const textModel = createTextModel(lines.join('\n'));
		try {
			const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));

			const ranges = computeRanges(textModel, false, { start: /^\/\/#region$/, end: /^\/\/#endregion$/ });
			foldingModel.update(ranges);

			const r1 = r(1, 2, false);
			const r2 = r(3, 12, false);
			const r3 = r(4, 11, false);
			const r4 = r(5, 6, false);
			const r5 = r(9, 10, false);
			assertRanges(foldingModel, [r1, r2, r3, r4, r5]);

			setCollapseStateLevelsDown(foldingModel, true, 1, [4]);
			assertFoldedRanges(foldingModel, [r3], '1');

			setCollapseStateLevelsDown(foldingModel, true, 2, [4]);
			assertFoldedRanges(foldingModel, [r3, r4, r5], '2');

			setCollapseStateLevelsDown(foldingModel, false, 2, [3]);
			assertFoldedRanges(foldingModel, [r4, r5], '3');

			setCollapseStateLevelsDown(foldingModel, false, 2, [2]);
			assertFoldedRanges(foldingModel, [r4, r5], '4');

			setCollapseStateLevelsDown(foldingModel, true, 4, [2]);
			assertFoldedRanges(foldingModel, [r1, r4, r5], '5');

			setCollapseStateLevelsDown(foldingModel, false, 4, [2, 3]);
			assertFoldedRanges(foldingModel, [], '6');
		} finally {
			textModel.dispose();
		}
	});

	test('setCollapseStateLevelsUp', () => {
		const lines = [
		/* 1*/	'//#region',
		/* 2*/	'//#endregion',
		/* 3*/	'class A {',
		/* 4*/	'  void foo() {',
		/* 5*/	'    if (true) {',
		/* 6*/	'        return;',
		/* 7*/	'    }',
		/* 8*/	'',
		/* 9*/	'    if (true) {',
		/* 10*/	'      return;',
		/* 11*/	'    }',
		/* 12*/	'  }',
		/* 13*/	'}'];

		const textModel = createTextModel(lines.join('\n'));
		try {
			const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));

			const ranges = computeRanges(textModel, false, { start: /^\/\/#region$/, end: /^\/\/#endregion$/ });
			foldingModel.update(ranges);

			const r1 = r(1, 2, false);
			const r2 = r(3, 12, false);
			const r3 = r(4, 11, false);
			const r4 = r(5, 6, false);
			const r5 = r(9, 10, false);
			assertRanges(foldingModel, [r1, r2, r3, r4, r5]);

			setCollapseStateLevelsUp(foldingModel, true, 1, [4]);
			assertFoldedRanges(foldingModel, [r3], '1');

			setCollapseStateLevelsUp(foldingModel, true, 2, [4]);
			assertFoldedRanges(foldingModel, [r2, r3], '2');

			setCollapseStateLevelsUp(foldingModel, false, 4, [1, 3, 4]);
			assertFoldedRanges(foldingModel, [], '3');

			setCollapseStateLevelsUp(foldingModel, true, 2, [10]);
			assertFoldedRanges(foldingModel, [r3, r5], '4');
		} finally {
			textModel.dispose();
		}

	});

	test('setCollapseStateUp', () => {
		const lines = [
		/* 1*/	'//#region',
		/* 2*/	'//#endregion',
		/* 3*/	'class A {',
		/* 4*/	'  void foo() {',
		/* 5*/	'    if (true) {',
		/* 6*/	'        return;',
		/* 7*/	'    }',
		/* 8*/	'',
		/* 9*/	'    if (true) {',
		/* 10*/	'      return;',
		/* 11*/	'    }',
		/* 12*/	'  }',
		/* 13*/	'}'];

		const textModel = createTextModel(lines.join('\n'));
		try {
			const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));

			const ranges = computeRanges(textModel, false, { start: /^\/\/#region$/, end: /^\/\/#endregion$/ });
			foldingModel.update(ranges);

			const r1 = r(1, 2, false);
			const r2 = r(3, 12, false);
			const r3 = r(4, 11, false);
			const r4 = r(5, 6, false);
			const r5 = r(9, 10, false);
			assertRanges(foldingModel, [r1, r2, r3, r4, r5]);

			setCollapseStateUp(foldingModel, true, [5]);
			assertFoldedRanges(foldingModel, [r4], '1');

			setCollapseStateUp(foldingModel, true, [5]);
			assertFoldedRanges(foldingModel, [r3, r4], '2');

			setCollapseStateUp(foldingModel, true, [4]);
			assertFoldedRanges(foldingModel, [r2, r3, r4], '2');
		} finally {
			textModel.dispose();
		}

	});


	test('setCollapseStateForMatchingLines', () => {
		const lines = [
		/* 1*/	'/**',
		/* 2*/	' * the class',
		/* 3*/	' */',
		/* 4*/	'class A {',
		/* 5*/	'  /**',
		/* 6*/	'   * the foo',
		/* 7*/	'   */',
		/* 8*/	'  void foo() {',
		/* 9*/	'    /*',
		/* 10*/	'     * the comment',
		/* 11*/	'     */',
		/* 12*/	'  }',
		/* 13*/	'}'];

		const textModel = createTextModel(lines.join('\n'));
		try {
			const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));

			const ranges = computeRanges(textModel, false, { start: /^\/\/#region$/, end: /^\/\/#endregion$/ });
			foldingModel.update(ranges);

			const r1 = r(1, 3, false);
			const r2 = r(4, 12, false);
			const r3 = r(5, 7, false);
			const r4 = r(8, 11, false);
			const r5 = r(9, 11, false);
			assertRanges(foldingModel, [r1, r2, r3, r4, r5]);

			const regExp = new RegExp('^\\s*' + escapeRegExpCharacters('/*'));
			setCollapseStateForMatchingLines(foldingModel, regExp, true);
			assertFoldedRanges(foldingModel, [r1, r3, r5], '1');
		} finally {
			textModel.dispose();
		}

	});


	test('setCollapseStateForRest', () => {
		const lines = [
		/* 1*/	'//#region',
		/* 2*/	'//#endregion',
		/* 3*/	'class A {',
		/* 4*/	'  void foo() {',
		/* 5*/	'    if (true) {',
		/* 6*/	'        return;',
		/* 7*/	'    }',
		/* 8*/	'',
		/* 9*/	'    if (true) {',
		/* 10*/	'      return;',
		/* 11*/	'    }',
		/* 12*/	'  }',
		/* 13*/	'}'];

		const textModel = createTextModel(lines.join('\n'));
		try {
			const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));

			const ranges = computeRanges(textModel, false, { start: /^\/\/#region$/, end: /^\/\/#endregion$/ });
			foldingModel.update(ranges);

			const r1 = r(1, 2, false);
			const r2 = r(3, 12, false);
			const r3 = r(4, 11, false);
			const r4 = r(5, 6, false);
			const r5 = r(9, 10, false);
			assertRanges(foldingModel, [r1, r2, r3, r4, r5]);

			setCollapseStateForRest(foldingModel, true, [5]);
			assertFoldedRanges(foldingModel, [r1, r5], '1');

			setCollapseStateForRest(foldingModel, false, [5]);
			assertFoldedRanges(foldingModel, [], '2');

			setCollapseStateForRest(foldingModel, true, [1]);
			assertFoldedRanges(foldingModel, [r2, r3, r4, r5], '3');

			setCollapseStateForRest(foldingModel, true, [3]);
			assertFoldedRanges(foldingModel, [r1, r2, r3, r4, r5], '3');

		} finally {
			textModel.dispose();
		}

	});


	test('folding decoration', () => {
		const lines = [
		/* 1*/	'class A {',
		/* 2*/	'  void foo() {',
		/* 3*/	'    if (true) {',
		/* 4*/	'      hoo();',
		/* 5*/	'    }',
		/* 6*/	'  }',
		/* 7*/	'}'];

		const textModel = createTextModel(lines.join('\n'));
		try {
			const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));

			const ranges = computeRanges(textModel, false, undefined);
			foldingModel.update(ranges);

			const r1 = r(1, 6, false);
			const r2 = r(2, 5, false);
			const r3 = r(3, 4, false);

			assertRanges(foldingModel, [r1, r2, r3]);
			assertDecorations(foldingModel, [d(1, 'expanded'), d(2, 'expanded'), d(3, 'expanded')]);

			foldingModel.toggleCollapseState([foldingModel.getRegionAtLine(2)!]);

			assertRanges(foldingModel, [r1, r(2, 5, true), r3]);
			assertDecorations(foldingModel, [d(1, 'expanded'), d(2, 'collapsed'), d(3, 'hidden')]);

			foldingModel.update(ranges);

			assertRanges(foldingModel, [r1, r(2, 5, true), r3]);
			assertDecorations(foldingModel, [d(1, 'expanded'), d(2, 'collapsed'), d(3, 'hidden')]);

			foldingModel.toggleCollapseState([foldingModel.getRegionAtLine(1)!]);

			assertRanges(foldingModel, [r(1, 6, true), r(2, 5, true), r3]);
			assertDecorations(foldingModel, [d(1, 'collapsed'), d(2, 'hidden'), d(3, 'hidden')]);

			foldingModel.update(ranges);

			assertRanges(foldingModel, [r(1, 6, true), r(2, 5, true), r3]);
			assertDecorations(foldingModel, [d(1, 'collapsed'), d(2, 'hidden'), d(3, 'hidden')]);

			foldingModel.toggleCollapseState([foldingModel.getRegionAtLine(1)!, foldingModel.getRegionAtLine(3)!]);

			assertRanges(foldingModel, [r1, r(2, 5, true), r(3, 4, true)]);
			assertDecorations(foldingModel, [d(1, 'expanded'), d(2, 'collapsed'), d(3, 'hidden')]);

			foldingModel.update(ranges);

			assertRanges(foldingModel, [r1, r(2, 5, true), r(3, 4, true)]);
			assertDecorations(foldingModel, [d(1, 'expanded'), d(2, 'collapsed'), d(3, 'hidden')]);

			textModel.dispose();
		} finally {
			textModel.dispose();
		}

	});

	test('fold jumping', () => {
		const lines = [
			/* 1*/	'class A {',
			/* 2*/	'  void foo() {',
			/* 3*/	'    if (1) {',
			/* 4*/	'      a();',
			/* 5*/	'    } else if (2) {',
			/* 6*/	'      if (true) {',
			/* 7*/	'        b();',
			/* 8*/	'      }',
			/* 9*/	'    } else {',
			/* 10*/	'      c();',
			/* 11*/	'    }',
			/* 12*/	'  }',
			/* 13*/	'}'
		];

		const textModel = createTextModel(lines.join('\n'));
		try {
			const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));

			const ranges = computeRanges(textModel, false, undefined);
			foldingModel.update(ranges);

			const r1 = r(1, 12, false);
			const r2 = r(2, 11, false);
			const r3 = r(3, 4, false);
			const r4 = r(5, 8, false);
			const r5 = r(6, 7, false);
			const r6 = r(9, 10, false);
			assertRanges(foldingModel, [r1, r2, r3, r4, r5, r6]);

			// Test jump to parent.
			assert.strictEqual(getParentFoldLine(7, foldingModel), 6);
			assert.strictEqual(getParentFoldLine(6, foldingModel), 5);
			assert.strictEqual(getParentFoldLine(5, foldingModel), 2);
			assert.strictEqual(getParentFoldLine(2, foldingModel), 1);
			assert.strictEqual(getParentFoldLine(1, foldingModel), null);

			// Test jump to previous.
			assert.strictEqual(getPreviousFoldLine(10, foldingModel), 9);
			assert.strictEqual(getPreviousFoldLine(9, foldingModel), 5);
			assert.strictEqual(getPreviousFoldLine(5, foldingModel), 3);
			assert.strictEqual(getPreviousFoldLine(3, foldingModel), null);
			// Test when not on a folding region start line.
			assert.strictEqual(getPreviousFoldLine(4, foldingModel), 3);
			assert.strictEqual(getPreviousFoldLine(7, foldingModel), 6);
			assert.strictEqual(getPreviousFoldLine(8, foldingModel), 6);

			// Test jump to next.
			assert.strictEqual(getNextFoldLine(3, foldingModel), 5);
			assert.strictEqual(getNextFoldLine(5, foldingModel), 9);
			assert.strictEqual(getNextFoldLine(9, foldingModel), null);
			// Test when not on a folding region start line.
			assert.strictEqual(getNextFoldLine(4, foldingModel), 5);
			assert.strictEqual(getNextFoldLine(7, foldingModel), 9);
			assert.strictEqual(getNextFoldLine(8, foldingModel), 9);

		} finally {
			textModel.dispose();
		}

	});

	test('fold jumping issue #129503', () => {
		const lines = [
			/* 1*/	'',
			/* 2*/	'if True:',
			/* 3*/	'  print(1)',
			/* 4*/	'if True:',
			/* 5*/	'  print(1)',
			/* 6*/	''
		];

		const textModel = createTextModel(lines.join('\n'));
		try {
			const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));

			const ranges = computeRanges(textModel, false, undefined);
			foldingModel.update(ranges);

			const r1 = r(2, 3, false);
			const r2 = r(4, 6, false);
			assertRanges(foldingModel, [r1, r2]);

			// Test jump to next.
			assert.strictEqual(getNextFoldLine(1, foldingModel), 2);
			assert.strictEqual(getNextFoldLine(2, foldingModel), 4);
			assert.strictEqual(getNextFoldLine(3, foldingModel), 4);
			assert.strictEqual(getNextFoldLine(4, foldingModel), null);
			assert.strictEqual(getNextFoldLine(5, foldingModel), null);
			assert.strictEqual(getNextFoldLine(6, foldingModel), null);

			// Test jump to previous.
			assert.strictEqual(getPreviousFoldLine(1, foldingModel), null);
			assert.strictEqual(getPreviousFoldLine(2, foldingModel), null);
			assert.strictEqual(getPreviousFoldLine(3, foldingModel), 2);
			assert.strictEqual(getPreviousFoldLine(4, foldingModel), 2);
			assert.strictEqual(getPreviousFoldLine(5, foldingModel), 4);
			assert.strictEqual(getPreviousFoldLine(6, foldingModel), 4);
		} finally {
			textModel.dispose();
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/folding/test/browser/foldingRanges.test.ts]---
Location: vscode-main/src/vs/editor/contrib/folding/test/browser/foldingRanges.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { FoldingMarkers } from '../../../../common/languages/languageConfiguration.js';
import { MAX_FOLDING_REGIONS, FoldRange, FoldingRegions, FoldSource } from '../../browser/foldingRanges.js';
import { RangesCollector, computeRanges } from '../../browser/indentRangeProvider.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';

const markers: FoldingMarkers = {
	start: /^#region$/,
	end: /^#endregion$/
};

suite('FoldingRanges', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	const foldRange = (from: number, to: number, collapsed: boolean | undefined = undefined, source: FoldSource = FoldSource.provider, type: string | undefined = undefined) =>
		<FoldRange>{
			startLineNumber: from,
			endLineNumber: to,
			type: type,
			isCollapsed: collapsed || false,
			source
		};
	const assertEqualRanges = (range1: FoldRange, range2: FoldRange, msg: string) => {
		assert.strictEqual(range1.startLineNumber, range2.startLineNumber, msg + ' start');
		assert.strictEqual(range1.endLineNumber, range2.endLineNumber, msg + ' end');
		assert.strictEqual(range1.type, range2.type, msg + ' type');
		assert.strictEqual(range1.isCollapsed, range2.isCollapsed, msg + ' collapsed');
		assert.strictEqual(range1.source, range2.source, msg + ' source');
	};

	test('test max folding regions', () => {
		const lines: string[] = [];
		const nRegions = MAX_FOLDING_REGIONS;
		const collector = new RangesCollector({ limit: MAX_FOLDING_REGIONS, update: () => { } });
		for (let i = 0; i < nRegions; i++) {
			const startLineNumber = lines.length;
			lines.push('#region');
			const endLineNumber = lines.length;
			lines.push('#endregion');
			collector.insertFirst(startLineNumber, endLineNumber, 0);
		}
		const model = createTextModel(lines.join('\n'));
		const actual = collector.toIndentRanges(model);
		assert.strictEqual(actual.length, nRegions, 'len');
		model.dispose();

	});

	test('findRange', () => {
		const lines = [
		/* 1*/	'#region',
		/* 2*/	'#endregion',
		/* 3*/	'class A {',
		/* 4*/	'  void foo() {',
		/* 5*/	'    if (true) {',
		/* 6*/	'        return;',
		/* 7*/	'    }',
		/* 8*/	'',
		/* 9*/	'    if (true) {',
		/* 10*/	'      return;',
		/* 11*/	'    }',
		/* 12*/	'  }',
		/* 13*/	'}'];

		const textModel = createTextModel(lines.join('\n'));
		try {
			const actual = computeRanges(textModel, false, markers);
			// let r0 = r(1, 2);
			// let r1 = r(3, 12);
			// let r2 = r(4, 11);
			// let r3 = r(5, 6);
			// let r4 = r(9, 10);

			assert.strictEqual(actual.findRange(1), 0, '1');
			assert.strictEqual(actual.findRange(2), 0, '2');
			assert.strictEqual(actual.findRange(3), 1, '3');
			assert.strictEqual(actual.findRange(4), 2, '4');
			assert.strictEqual(actual.findRange(5), 3, '5');
			assert.strictEqual(actual.findRange(6), 3, '6');
			assert.strictEqual(actual.findRange(7), 2, '7');
			assert.strictEqual(actual.findRange(8), 2, '8');
			assert.strictEqual(actual.findRange(9), 4, '9');
			assert.strictEqual(actual.findRange(10), 4, '10');
			assert.strictEqual(actual.findRange(11), 2, '11');
			assert.strictEqual(actual.findRange(12), 1, '12');
			assert.strictEqual(actual.findRange(13), -1, '13');
		} finally {
			textModel.dispose();
		}


	});

	test('setCollapsed', () => {
		const lines: string[] = [];
		const nRegions = 500;
		for (let i = 0; i < nRegions; i++) {
			lines.push('#region');
		}
		for (let i = 0; i < nRegions; i++) {
			lines.push('#endregion');
		}
		const model = createTextModel(lines.join('\n'));
		const actual = computeRanges(model, false, markers);
		assert.strictEqual(actual.length, nRegions, 'len');
		for (let i = 0; i < nRegions; i++) {
			actual.setCollapsed(i, i % 3 === 0);
		}
		for (let i = 0; i < nRegions; i++) {
			assert.strictEqual(actual.isCollapsed(i), i % 3 === 0, 'line' + i);
		}
		model.dispose();
	});

	test('sanitizeAndMerge1', () => {
		const regionSet1: FoldRange[] = [
			foldRange(0, 100),			// invalid, should be removed
			foldRange(1, 100, false, FoldSource.provider, 'A'),		// valid
			foldRange(1, 100, false, FoldSource.provider, 'Z'),		// invalid, duplicate start
			foldRange(10, 10, false),						// invalid, should be removed
			foldRange(20, 80, false, FoldSource.provider, 'C1'),		// valid inside 'B'
			foldRange(22, 80, true, FoldSource.provider, 'D1'),		// valid inside 'C1'
			foldRange(90, 101),								// invalid, should be removed
		];
		const regionSet2: FoldRange[] = [
			foldRange(20, 80, true),			    		// should merge with C1
			foldRange(18, 80, true),						// invalid, out of order
			foldRange(21, 81, true, FoldSource.provider, 'Z'),		// invalid, overlapping
			foldRange(22, 80, true, FoldSource.provider, 'D2'),		// should merge with D1
		];
		const result = FoldingRegions.sanitizeAndMerge(regionSet1, regionSet2, 100);
		assert.strictEqual(result.length, 3, 'result length1');
		assertEqualRanges(result[0], foldRange(1, 100, false, FoldSource.provider, 'A'), 'A1');
		assertEqualRanges(result[1], foldRange(20, 80, true, FoldSource.provider, 'C1'), 'C1');
		assertEqualRanges(result[2], foldRange(22, 80, true, FoldSource.provider, 'D1'), 'D1');
	});

	test('sanitizeAndMerge2', () => {
		const regionSet1: FoldRange[] = [
			foldRange(1, 100, false, FoldSource.provider, 'a1'),			// valid
			foldRange(2, 100, false, FoldSource.provider, 'a2'),			// valid
			foldRange(3, 19, false, FoldSource.provider, 'a3'),			// valid
			foldRange(20, 71, false, FoldSource.provider, 'a4'),			// overlaps b3
			foldRange(21, 29, false, FoldSource.provider, 'a5'),			// valid
			foldRange(81, 91, false, FoldSource.provider, 'a6'),			// overlaps b4
		];
		const regionSet2: FoldRange[] = [
			foldRange(30, 39, true, FoldSource.provider, 'b1'),			// valid, will be recovered
			foldRange(40, 49, true, FoldSource.userDefined, 'b2'),	// valid
			foldRange(50, 100, true, FoldSource.userDefined, 'b3'),	// overlaps a4
			foldRange(80, 90, true, FoldSource.userDefined, 'b4'),	// overlaps a6
			foldRange(92, 100, true, FoldSource.userDefined, 'b5'),	// valid
		];
		const result = FoldingRegions.sanitizeAndMerge(regionSet1, regionSet2, 100);
		assert.strictEqual(result.length, 9, 'result length1');
		assertEqualRanges(result[0], foldRange(1, 100, false, FoldSource.provider, 'a1'), 'P1');
		assertEqualRanges(result[1], foldRange(2, 100, false, FoldSource.provider, 'a2'), 'P2');
		assertEqualRanges(result[2], foldRange(3, 19, false, FoldSource.provider, 'a3'), 'P3');
		assertEqualRanges(result[3], foldRange(21, 29, false, FoldSource.provider, 'a5'), 'P4');
		assertEqualRanges(result[4], foldRange(30, 39, true, FoldSource.recovered, 'b1'), 'P5');
		assertEqualRanges(result[5], foldRange(40, 49, true, FoldSource.userDefined, 'b2'), 'P6');
		assertEqualRanges(result[6], foldRange(50, 100, true, FoldSource.userDefined, 'b3'), 'P7');
		assertEqualRanges(result[7], foldRange(80, 90, true, FoldSource.userDefined, 'b4'), 'P8');
		assertEqualRanges(result[8], foldRange(92, 100, true, FoldSource.userDefined, 'b5'), 'P9');
	});

	test('sanitizeAndMerge3', () => {
		const regionSet1: FoldRange[] = [
			foldRange(1, 100, false, FoldSource.provider, 'a1'),			// valid
			foldRange(10, 29, false, FoldSource.provider, 'a2'),			// matches manual hidden
			foldRange(35, 39, true, FoldSource.recovered, 'a3'),		// valid
		];
		const regionSet2: FoldRange[] = [
			foldRange(10, 29, true, FoldSource.recovered, 'b1'),		// matches a
			foldRange(20, 28, true, FoldSource.provider, 'b2'),			// should remain
			foldRange(30, 39, true, FoldSource.recovered, 'b3'),		// should remain
		];
		const result = FoldingRegions.sanitizeAndMerge(regionSet1, regionSet2, 100);
		assert.strictEqual(result.length, 5, 'result length3');
		assertEqualRanges(result[0], foldRange(1, 100, false, FoldSource.provider, 'a1'), 'R1');
		assertEqualRanges(result[1], foldRange(10, 29, true, FoldSource.provider, 'a2'), 'R2');
		assertEqualRanges(result[2], foldRange(20, 28, true, FoldSource.recovered, 'b2'), 'R3');
		assertEqualRanges(result[3], foldRange(30, 39, true, FoldSource.recovered, 'b3'), 'R3');
		assertEqualRanges(result[4], foldRange(35, 39, true, FoldSource.recovered, 'a3'), 'R4');
	});

	test('sanitizeAndMerge4', () => {
		const regionSet1: FoldRange[] = [
			foldRange(1, 100, false, FoldSource.provider, 'a1'),			// valid
		];
		const regionSet2: FoldRange[] = [
			foldRange(20, 28, true, FoldSource.provider, 'b1'),			// hidden
			foldRange(30, 38, true, FoldSource.provider, 'b2'),			// hidden
		];
		const result = FoldingRegions.sanitizeAndMerge(regionSet1, regionSet2, 100);
		assert.strictEqual(result.length, 3, 'result length4');
		assertEqualRanges(result[0], foldRange(1, 100, false, FoldSource.provider, 'a1'), 'R1');
		assertEqualRanges(result[1], foldRange(20, 28, true, FoldSource.recovered, 'b1'), 'R2');
		assertEqualRanges(result[2], foldRange(30, 38, true, FoldSource.recovered, 'b2'), 'R3');
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/folding/test/browser/hiddenRangeModel.test.ts]---
Location: vscode-main/src/vs/editor/contrib/folding/test/browser/hiddenRangeModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { IRange } from '../../../../common/core/range.js';
import { FoldingModel } from '../../browser/foldingModel.js';
import { HiddenRangeModel } from '../../browser/hiddenRangeModel.js';
import { computeRanges } from '../../browser/indentRangeProvider.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { TestDecorationProvider } from './foldingModel.test.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';


interface ExpectedRange {
	startLineNumber: number;
	endLineNumber: number;
}

suite('Hidden Range Model', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	function r(startLineNumber: number, endLineNumber: number): ExpectedRange {
		return { startLineNumber, endLineNumber };
	}

	function assertRanges(actual: IRange[], expectedRegions: ExpectedRange[], message?: string) {
		assert.deepStrictEqual(actual.map(r => ({ startLineNumber: r.startLineNumber, endLineNumber: r.endLineNumber })), expectedRegions, message);
	}

	test('hasRanges', () => {
		const lines = [
		/* 1*/	'/**',
		/* 2*/	' * Comment',
		/* 3*/	' */',
		/* 4*/	'class A {',
		/* 5*/	'  void foo() {',
		/* 6*/	'    if (true) {',
		/* 7*/	'      //hello',
		/* 8*/	'    }',
		/* 9*/	'  }',
		/* 10*/	'}'];

		const textModel = createTextModel(lines.join('\n'));
		const foldingModel = new FoldingModel(textModel, new TestDecorationProvider(textModel));
		const hiddenRangeModel = new HiddenRangeModel(foldingModel);
		try {
			assert.strictEqual(hiddenRangeModel.hasRanges(), false);

			const ranges = computeRanges(textModel, false, undefined);
			foldingModel.update(ranges);

			foldingModel.toggleCollapseState([foldingModel.getRegionAtLine(1)!, foldingModel.getRegionAtLine(6)!]);
			assertRanges(hiddenRangeModel.hiddenRanges, [r(2, 3), r(7, 7)]);

			assert.strictEqual(hiddenRangeModel.hasRanges(), true);
			assert.strictEqual(hiddenRangeModel.isHidden(1), false);
			assert.strictEqual(hiddenRangeModel.isHidden(2), true);
			assert.strictEqual(hiddenRangeModel.isHidden(3), true);
			assert.strictEqual(hiddenRangeModel.isHidden(4), false);
			assert.strictEqual(hiddenRangeModel.isHidden(5), false);
			assert.strictEqual(hiddenRangeModel.isHidden(6), false);
			assert.strictEqual(hiddenRangeModel.isHidden(7), true);
			assert.strictEqual(hiddenRangeModel.isHidden(8), false);
			assert.strictEqual(hiddenRangeModel.isHidden(9), false);
			assert.strictEqual(hiddenRangeModel.isHidden(10), false);

			foldingModel.toggleCollapseState([foldingModel.getRegionAtLine(4)!]);
			assertRanges(hiddenRangeModel.hiddenRanges, [r(2, 3), r(5, 9)]);

			assert.strictEqual(hiddenRangeModel.hasRanges(), true);
			assert.strictEqual(hiddenRangeModel.isHidden(1), false);
			assert.strictEqual(hiddenRangeModel.isHidden(2), true);
			assert.strictEqual(hiddenRangeModel.isHidden(3), true);
			assert.strictEqual(hiddenRangeModel.isHidden(4), false);
			assert.strictEqual(hiddenRangeModel.isHidden(5), true);
			assert.strictEqual(hiddenRangeModel.isHidden(6), true);
			assert.strictEqual(hiddenRangeModel.isHidden(7), true);
			assert.strictEqual(hiddenRangeModel.isHidden(8), true);
			assert.strictEqual(hiddenRangeModel.isHidden(9), true);
			assert.strictEqual(hiddenRangeModel.isHidden(10), false);

			foldingModel.toggleCollapseState([foldingModel.getRegionAtLine(1)!, foldingModel.getRegionAtLine(6)!, foldingModel.getRegionAtLine(4)!]);
			assertRanges(hiddenRangeModel.hiddenRanges, []);
			assert.strictEqual(hiddenRangeModel.hasRanges(), false);
			assert.strictEqual(hiddenRangeModel.isHidden(1), false);
			assert.strictEqual(hiddenRangeModel.isHidden(2), false);
			assert.strictEqual(hiddenRangeModel.isHidden(3), false);
			assert.strictEqual(hiddenRangeModel.isHidden(4), false);
			assert.strictEqual(hiddenRangeModel.isHidden(5), false);
			assert.strictEqual(hiddenRangeModel.isHidden(6), false);
			assert.strictEqual(hiddenRangeModel.isHidden(7), false);
			assert.strictEqual(hiddenRangeModel.isHidden(8), false);
			assert.strictEqual(hiddenRangeModel.isHidden(9), false);
			assert.strictEqual(hiddenRangeModel.isHidden(10), false);
		} finally {
			textModel.dispose();
			hiddenRangeModel.dispose();
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/folding/test/browser/indentFold.test.ts]---
Location: vscode-main/src/vs/editor/contrib/folding/test/browser/indentFold.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { computeRanges } from '../../browser/indentRangeProvider.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';

interface IndentRange {
	start: number;
	end: number;
}

suite('Indentation Folding', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	function r(start: number, end: number): IndentRange {
		return { start, end };
	}

	test('Limit by indent', () => {


		const lines = [
		/* 1*/	'A',
		/* 2*/	'  A',
		/* 3*/	'  A',
		/* 4*/	'    A',
		/* 5*/	'      A',
		/* 6*/	'    A',
		/* 7*/	'      A',
		/* 8*/	'      A',
		/* 9*/	'         A',
		/* 10*/	'      A',
		/* 11*/	'         A',
		/* 12*/	'  A',
		/* 13*/	'              A',
		/* 14*/	'                 A',
		/* 15*/	'A',
		/* 16*/	'  A'
		];
		const r1 = r(1, 14); //0
		const r2 = r(3, 11); //1
		const r3 = r(4, 5); //2
		const r4 = r(6, 11); //2
		const r5 = r(8, 9); //3
		const r6 = r(10, 11); //3
		const r7 = r(12, 14); //1
		const r8 = r(13, 14);//4
		const r9 = r(15, 16);//0

		const model = createTextModel(lines.join('\n'));

		function assertLimit(maxEntries: number, expectedRanges: IndentRange[], message: string) {
			let reported: number | false = false;
			const indentRanges = computeRanges(model, true, undefined, { limit: maxEntries, update: (computed, limited) => reported = limited });
			assert.ok(indentRanges.length <= maxEntries, 'max ' + message);
			const actual: IndentRange[] = [];
			for (let i = 0; i < indentRanges.length; i++) {
				actual.push({ start: indentRanges.getStartLineNumber(i), end: indentRanges.getEndLineNumber(i) });
			}
			assert.deepStrictEqual(actual, expectedRanges, message);
			assert.equal(reported, 9 <= maxEntries ? false : maxEntries, 'limited');
		}

		assertLimit(1000, [r1, r2, r3, r4, r5, r6, r7, r8, r9], '1000');
		assertLimit(9, [r1, r2, r3, r4, r5, r6, r7, r8, r9], '9');
		assertLimit(8, [r1, r2, r3, r4, r5, r6, r7, r9], '8');
		assertLimit(7, [r1, r2, r3, r4, r5, r7, r9], '7');
		assertLimit(6, [r1, r2, r3, r4, r7, r9], '6');
		assertLimit(5, [r1, r2, r3, r7, r9], '5');
		assertLimit(4, [r1, r2, r7, r9], '4');
		assertLimit(3, [r1, r2, r9], '3');
		assertLimit(2, [r1, r9], '2');
		assertLimit(1, [r1], '1');
		assertLimit(0, [], '0');

		model.dispose();
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/folding/test/browser/indentRangeProvider.test.ts]---
Location: vscode-main/src/vs/editor/contrib/folding/test/browser/indentRangeProvider.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { FoldingMarkers } from '../../../../common/languages/languageConfiguration.js';
import { computeRanges } from '../../browser/indentRangeProvider.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';

interface ExpectedIndentRange {
	startLineNumber: number;
	endLineNumber: number;
	parentIndex: number;
}

function assertRanges(lines: string[], expected: ExpectedIndentRange[], offside: boolean, markers?: FoldingMarkers): void {
	const model = createTextModel(lines.join('\n'));
	const actual = computeRanges(model, offside, markers);

	const actualRanges: ExpectedIndentRange[] = [];
	for (let i = 0; i < actual.length; i++) {
		actualRanges[i] = r(actual.getStartLineNumber(i), actual.getEndLineNumber(i), actual.getParentIndex(i));
	}
	assert.deepStrictEqual(actualRanges, expected);
	model.dispose();
}

function r(startLineNumber: number, endLineNumber: number, parentIndex: number, marker = false): ExpectedIndentRange {
	return { startLineNumber, endLineNumber, parentIndex };
}

suite('Indentation Folding', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	test('Fold one level', () => {
		const range = [
			'A',
			'  A',
			'  A',
			'  A'
		];
		assertRanges(range, [r(1, 4, -1)], true);
		assertRanges(range, [r(1, 4, -1)], false);
	});

	test('Fold two levels', () => {
		const range = [
			'A',
			'  A',
			'  A',
			'    A',
			'    A'
		];
		assertRanges(range, [r(1, 5, -1), r(3, 5, 0)], true);
		assertRanges(range, [r(1, 5, -1), r(3, 5, 0)], false);
	});

	test('Fold three levels', () => {
		const range = [
			'A',
			'  A',
			'    A',
			'      A',
			'A'
		];
		assertRanges(range, [r(1, 4, -1), r(2, 4, 0), r(3, 4, 1)], true);
		assertRanges(range, [r(1, 4, -1), r(2, 4, 0), r(3, 4, 1)], false);
	});

	test('Fold decreasing indent', () => {
		const range = [
			'    A',
			'  A',
			'A'
		];
		assertRanges(range, [], true);
		assertRanges(range, [], false);
	});

	test('Fold Java', () => {
		assertRanges([
		/* 1*/	'class A {',
		/* 2*/	'  void foo() {',
		/* 3*/	'    console.log();',
		/* 4*/	'    console.log();',
		/* 5*/	'  }',
		/* 6*/	'',
		/* 7*/	'  void bar() {',
		/* 8*/	'    console.log();',
		/* 9*/	'  }',
		/*10*/	'}',
		/*11*/	'interface B {',
		/*12*/	'  void bar();',
		/*13*/	'}',
		], [r(1, 9, -1), r(2, 4, 0), r(7, 8, 0), r(11, 12, -1)], false);
	});

	test('Fold Javadoc', () => {
		assertRanges([
		/* 1*/	'/**',
		/* 2*/	' * Comment',
		/* 3*/	' */',
		/* 4*/	'class A {',
		/* 5*/	'  void foo() {',
		/* 6*/	'  }',
		/* 7*/	'}',
		], [r(1, 3, -1), r(4, 6, -1)], false);
	});
	test('Fold Whitespace Java', () => {
		assertRanges([
		/* 1*/	'class A {',
		/* 2*/	'',
		/* 3*/	'  void foo() {',
		/* 4*/	'     ',
		/* 5*/	'     return 0;',
		/* 6*/	'  }',
		/* 7*/	'      ',
		/* 8*/	'}',
		], [r(1, 7, -1), r(3, 5, 0)], false);
	});

	test('Fold Whitespace Python', () => {
		assertRanges([
		/* 1*/	'def a:',
		/* 2*/	'  pass',
		/* 3*/	'   ',
		/* 4*/	'  def b:',
		/* 5*/	'    pass',
		/* 6*/	'  ',
		/* 7*/	'      ',
		/* 8*/	'def c: # since there was a deintent here'
		], [r(1, 5, -1), r(4, 5, 0)], true);
	});

	test('Fold Tabs', () => {
		assertRanges([
		/* 1*/	'class A {',
		/* 2*/	'\t\t',
		/* 3*/	'\tvoid foo() {',
		/* 4*/	'\t \t//hello',
		/* 5*/	'\t    return 0;',
		/* 6*/	'  \t}',
		/* 7*/	'      ',
		/* 8*/	'}',
		], [r(1, 7, -1), r(3, 5, 0)], false);
	});
});

const markers: FoldingMarkers = {
	start: /^\s*#region\b/,
	end: /^\s*#endregion\b/
};

suite('Folding with regions', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	test('Inside region, indented', () => {
		assertRanges([
		/* 1*/	'class A {',
		/* 2*/	'  #region',
		/* 3*/	'  void foo() {',
		/* 4*/	'     ',
		/* 5*/	'     return 0;',
		/* 6*/	'  }',
		/* 7*/	'  #endregion',
		/* 8*/	'}',
		], [r(1, 7, -1), r(2, 7, 0, true), r(3, 5, 1)], false, markers);
	});
	test('Inside region, not indented', () => {
		assertRanges([
		/* 1*/	'var x;',
		/* 2*/	'#region',
		/* 3*/	'void foo() {',
		/* 4*/	'     ',
		/* 5*/	'     return 0;',
		/* 6*/	'  }',
		/* 7*/	'#endregion',
		/* 8*/	'',
		], [r(2, 7, -1, true), r(3, 6, 0)], false, markers);
	});
	test('Empty Regions', () => {
		assertRanges([
		/* 1*/	'var x;',
		/* 2*/	'#region',
		/* 3*/	'#endregion',
		/* 4*/	'#region',
		/* 5*/	'',
		/* 6*/	'#endregion',
		/* 7*/	'var y;',
		], [r(2, 3, -1, true), r(4, 6, -1, true)], false, markers);
	});
	test('Nested Regions', () => {
		assertRanges([
		/* 1*/	'var x;',
		/* 2*/	'#region',
		/* 3*/	'#region',
		/* 4*/	'',
		/* 5*/	'#endregion',
		/* 6*/	'#endregion',
		/* 7*/	'var y;',
		], [r(2, 6, -1, true), r(3, 5, 0, true)], false, markers);
	});
	test('Nested Regions 2', () => {
		assertRanges([
		/* 1*/	'class A {',
		/* 2*/	'  #region',
		/* 3*/	'',
		/* 4*/	'  #region',
		/* 5*/	'',
		/* 6*/	'  #endregion',
		/* 7*/	'  // comment',
		/* 8*/	'  #endregion',
		/* 9*/	'}',
		], [r(1, 8, -1), r(2, 8, 0, true), r(4, 6, 1, true)], false, markers);
	});
	test('Incomplete Regions', () => {
		assertRanges([
		/* 1*/	'class A {',
		/* 2*/	'#region',
		/* 3*/	'  // comment',
		/* 4*/	'}',
		], [r(2, 3, -1)], false, markers);
	});
	test('Incomplete Regions 2', () => {
		assertRanges([
		/* 1*/	'',
		/* 2*/	'#region',
		/* 3*/	'#region',
		/* 4*/	'#region',
		/* 5*/	'  // comment',
		/* 6*/	'#endregion',
		/* 7*/	'#endregion',
		/* 8*/	' // hello',
		], [r(3, 7, -1, true), r(4, 6, 0, true)], false, markers);
	});
	test('Indented region before', () => {
		assertRanges([
		/* 1*/	'if (x)',
		/* 2*/	'  return;',
		/* 3*/	'',
		/* 4*/	'#region',
		/* 5*/	'  // comment',
		/* 6*/	'#endregion',
		], [r(1, 3, -1), r(4, 6, -1, true)], false, markers);
	});
	test('Indented region before 2', () => {
		assertRanges([
		/* 1*/	'if (x)',
		/* 2*/	'  log();',
		/* 3*/	'',
		/* 4*/	'    #region',
		/* 5*/	'      // comment',
		/* 6*/	'    #endregion',
		], [r(1, 6, -1), r(2, 6, 0), r(4, 6, 1, true)], false, markers);
	});
	test('Indented region in-between', () => {
		assertRanges([
		/* 1*/	'#region',
		/* 2*/	'  // comment',
		/* 3*/	'  if (x)',
		/* 4*/	'    return;',
		/* 5*/	'',
		/* 6*/	'#endregion',
		], [r(1, 6, -1, true), r(3, 5, 0)], false, markers);
	});
	test('Indented region after', () => {
		assertRanges([
		/* 1*/	'#region',
		/* 2*/	'  // comment',
		/* 3*/	'',
		/* 4*/	'#endregion',
		/* 5*/	'  if (x)',
		/* 6*/	'    return;',
		], [r(1, 4, -1, true), r(5, 6, -1)], false, markers);
	});
	test('With off-side', () => {
		assertRanges([
		/* 1*/	'#region',
		/* 2*/	'  ',
		/* 3*/	'',
		/* 4*/	'#endregion',
		/* 5*/	'',
		], [r(1, 4, -1, true)], true, markers);
	});
	test('Nested with off-side', () => {
		assertRanges([
		/* 1*/	'#region',
		/* 2*/	'  ',
		/* 3*/	'#region',
		/* 4*/	'',
		/* 5*/	'#endregion',
		/* 6*/	'',
		/* 7*/	'#endregion',
		/* 8*/	'',
		], [r(1, 7, -1, true), r(3, 5, 0, true)], true, markers);
	});
	test('Issue 35981', () => {
		assertRanges([
		/* 1*/	'function thisFoldsToEndOfPage() {',
		/* 2*/	'  const variable = []',
		/* 3*/	'    // #region',
		/* 4*/	'    .reduce((a, b) => a,[]);',
		/* 5*/	'}',
		/* 6*/	'',
		/* 7*/	'function thisFoldsProperly() {',
		/* 8*/	'  const foo = "bar"',
		/* 9*/	'}',
		], [r(1, 4, -1), r(2, 4, 0), r(7, 8, -1)], false, markers);
	});
	test('Misspelled Markers', () => {
		assertRanges([
		/* 1*/	'#Region',
		/* 2*/	'#endregion',
		/* 3*/	'#regionsandmore',
		/* 4*/	'#endregion',
		/* 5*/	'#region',
		/* 6*/	'#end region',
		/* 7*/	'#region',
		/* 8*/	'#endregionff',
		], [], true, markers);
	});
	test('Issue 79359', () => {
		assertRanges([
		/* 1*/	'#region',
		/* 2*/	'',
		/* 3*/	'class A',
		/* 4*/	'  foo',
		/* 5*/	'',
		/* 6*/	'class A',
		/* 7*/	'  foo',
		/* 8*/	'',
		/* 9*/	'#endregion',
		], [r(1, 9, -1, true), r(3, 4, 0), r(6, 7, 0)], true, markers);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/folding/test/browser/syntaxFold.test.ts]---
Location: vscode-main/src/vs/editor/contrib/folding/test/browser/syntaxFold.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { ITextModel } from '../../../../common/model.js';
import { FoldingContext, FoldingRange, FoldingRangeProvider, ProviderResult } from '../../../../common/languages.js';
import { SyntaxRangeProvider } from '../../browser/syntaxRangeProvider.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { FoldingLimitReporter } from '../../browser/folding.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

interface IndentRange {
	start: number;
	end: number;
}

class TestFoldingRangeProvider implements FoldingRangeProvider {
	constructor(private model: ITextModel, private ranges: IndentRange[]) {
	}

	provideFoldingRanges(model: ITextModel, context: FoldingContext, token: CancellationToken): ProviderResult<FoldingRange[]> {
		if (model === this.model) {
			return this.ranges;
		}
		return null;
	}
}

suite('Syntax folding', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	function r(start: number, end: number): IndentRange {
		return { start, end };
	}

	test('Limit by nesting level', async () => {
		const lines = [
			/* 1*/	'{',
			/* 2*/	'  A',
			/* 3*/	'  {',
			/* 4*/	'    {',
			/* 5*/	'      B',
			/* 6*/	'    }',
			/* 7*/	'    {',
			/* 8*/	'      A',
			/* 9*/	'      {',
			/* 10*/	'         A',
			/* 11*/	'      }',
			/* 12*/	'      {',
			/* 13*/	'        {',
			/* 14*/	'          {',
			/* 15*/	'             A',
			/* 16*/	'          }',
			/* 17*/	'        }',
			/* 18*/	'      }',
			/* 19*/	'    }',
			/* 20*/	'  }',
			/* 21*/	'}',
			/* 22*/	'{',
			/* 23*/	'  A',
			/* 24*/	'}',
		];

		const r1 = r(1, 20);  //0
		const r2 = r(3, 19);  //1
		const r3 = r(4, 5);   //2
		const r4 = r(7, 18);  //2
		const r5 = r(9, 10);  //3
		const r6 = r(12, 17); //4
		const r7 = r(13, 16); //5
		const r8 = r(14, 15); //6
		const r9 = r(22, 23); //0

		const model = createTextModel(lines.join('\n'));
		const ranges = [r1, r2, r3, r4, r5, r6, r7, r8, r9];
		const providers = [new TestFoldingRangeProvider(model, ranges)];

		async function assertLimit(maxEntries: number, expectedRanges: IndentRange[], message: string) {
			let reported: number | false = false;
			const foldingRangesLimit: FoldingLimitReporter = { limit: maxEntries, update: (computed, limited) => reported = limited };
			const syntaxRangeProvider = new SyntaxRangeProvider(model, providers, () => { }, foldingRangesLimit, undefined);
			try {
				const indentRanges = await syntaxRangeProvider.compute(CancellationToken.None);
				const actual: IndentRange[] = [];
				if (indentRanges) {
					for (let i = 0; i < indentRanges.length; i++) {
						actual.push({ start: indentRanges.getStartLineNumber(i), end: indentRanges.getEndLineNumber(i) });
					}
					assert.equal(reported, 9 <= maxEntries ? false : maxEntries, 'limited');
				}
				assert.deepStrictEqual(actual, expectedRanges, message);
			} finally {
				syntaxRangeProvider.dispose();
			}

		}

		await assertLimit(1000, [r1, r2, r3, r4, r5, r6, r7, r8, r9], '1000');
		await assertLimit(9, [r1, r2, r3, r4, r5, r6, r7, r8, r9], '9');
		await assertLimit(8, [r1, r2, r3, r4, r5, r6, r7, r9], '8');
		await assertLimit(7, [r1, r2, r3, r4, r5, r6, r9], '7');
		await assertLimit(6, [r1, r2, r3, r4, r5, r9], '6');
		await assertLimit(5, [r1, r2, r3, r4, r9], '5');
		await assertLimit(4, [r1, r2, r3, r9], '4');
		await assertLimit(3, [r1, r2, r9], '3');
		await assertLimit(2, [r1, r9], '2');
		await assertLimit(1, [r1], '1');
		await assertLimit(0, [], '0');

		model.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/fontZoom/browser/fontZoom.ts]---
Location: vscode-main/src/vs/editor/contrib/fontZoom/browser/fontZoom.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, registerEditorAction, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { EditorZoom } from '../../../common/config/editorZoom.js';
import * as nls from '../../../../nls.js';

class EditorFontZoomIn extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.fontZoomIn',
			label: nls.localize2('EditorFontZoomIn.label', "Increase Editor Font Size"),
			precondition: undefined
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		EditorZoom.setZoomLevel(EditorZoom.getZoomLevel() + 1);
	}
}

class EditorFontZoomOut extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.fontZoomOut',
			label: nls.localize2('EditorFontZoomOut.label', "Decrease Editor Font Size"),
			precondition: undefined
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		EditorZoom.setZoomLevel(EditorZoom.getZoomLevel() - 1);
	}
}

class EditorFontZoomReset extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.fontZoomReset',
			label: nls.localize2('EditorFontZoomReset.label', "Reset Editor Font Size"),
			precondition: undefined
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		EditorZoom.setZoomLevel(0);
	}
}

registerEditorAction(EditorFontZoomIn);
registerEditorAction(EditorFontZoomOut);
registerEditorAction(EditorFontZoomReset);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/format/browser/format.ts]---
Location: vscode-main/src/vs/editor/contrib/format/browser/format.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { asArray, isNonEmptyArray } from '../../../../base/common/arrays.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { IDisposable, IReference } from '../../../../base/common/lifecycle.js';
import { LinkedList } from '../../../../base/common/linkedList.js';
import { assertType } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { CodeEditorStateFlag, EditorStateCancellationTokenSource, TextModelCancellationTokenSource } from '../../editorState/browser/editorState.js';
import { IActiveCodeEditor, isCodeEditor } from '../../../browser/editorBrowser.js';
import { ServicesAccessor } from '../../../browser/editorExtensions.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { ScrollType } from '../../../common/editorCommon.js';
import { ITextModel } from '../../../common/model.js';
import { DocumentFormattingEditProvider, DocumentRangeFormattingEditProvider, FormattingOptions, TextEdit } from '../../../common/languages.js';
import { IEditorWorkerService } from '../../../common/services/editorWorker.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../common/services/resolverService.js';
import { FormattingEdit } from './formattingEdit.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { ExtensionIdentifierSet } from '../../../../platform/extensions/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IProgress } from '../../../../platform/progress/common/progress.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';

export function getRealAndSyntheticDocumentFormattersOrdered(
	documentFormattingEditProvider: LanguageFeatureRegistry<DocumentFormattingEditProvider>,
	documentRangeFormattingEditProvider: LanguageFeatureRegistry<DocumentRangeFormattingEditProvider>,
	model: ITextModel
): DocumentFormattingEditProvider[] {
	const result: DocumentFormattingEditProvider[] = [];
	const seen = new ExtensionIdentifierSet();

	// (1) add all document formatter
	const docFormatter = documentFormattingEditProvider.ordered(model);
	for (const formatter of docFormatter) {
		result.push(formatter);
		if (formatter.extensionId) {
			seen.add(formatter.extensionId);
		}
	}

	// (2) add all range formatter as document formatter (unless the same extension already did that)
	const rangeFormatter = documentRangeFormattingEditProvider.ordered(model);
	for (const formatter of rangeFormatter) {
		if (formatter.extensionId) {
			if (seen.has(formatter.extensionId)) {
				continue;
			}
			seen.add(formatter.extensionId);
		}
		result.push({
			displayName: formatter.displayName,
			extensionId: formatter.extensionId,
			provideDocumentFormattingEdits(model, options, token) {
				return formatter.provideDocumentRangeFormattingEdits(model, model.getFullModelRange(), options, token);
			}
		});
	}
	return result;
}

export const enum FormattingKind {
	File = 1,
	Selection = 2
}

export const enum FormattingMode {
	Explicit = 1,
	Silent = 2
}

export interface IFormattingEditProviderSelector {
	<T extends (DocumentFormattingEditProvider | DocumentRangeFormattingEditProvider)>(formatter: T[], document: ITextModel, mode: FormattingMode, kind: FormattingKind): Promise<T | undefined>;
}

export abstract class FormattingConflicts {

	private static readonly _selectors = new LinkedList<IFormattingEditProviderSelector>();

	static setFormatterSelector(selector: IFormattingEditProviderSelector): IDisposable {
		const remove = FormattingConflicts._selectors.unshift(selector);
		return { dispose: remove };
	}

	static async select<T extends (DocumentFormattingEditProvider | DocumentRangeFormattingEditProvider)>(formatter: T[], document: ITextModel, mode: FormattingMode, kind: FormattingKind): Promise<T | undefined> {
		if (formatter.length === 0) {
			return undefined;
		}
		const selector = Iterable.first(FormattingConflicts._selectors);
		if (selector) {
			return await selector(formatter, document, mode, kind);
		}
		return undefined;
	}
}

export async function formatDocumentRangesWithSelectedProvider(
	accessor: ServicesAccessor,
	editorOrModel: ITextModel | IActiveCodeEditor,
	rangeOrRanges: Range | Range[],
	mode: FormattingMode,
	progress: IProgress<DocumentRangeFormattingEditProvider>,
	token: CancellationToken,
	userGesture: boolean
): Promise<void> {

	const instaService = accessor.get(IInstantiationService);
	const { documentRangeFormattingEditProvider: documentRangeFormattingEditProviderRegistry } = accessor.get(ILanguageFeaturesService);
	const model = isCodeEditor(editorOrModel) ? editorOrModel.getModel() : editorOrModel;
	const provider = documentRangeFormattingEditProviderRegistry.ordered(model);
	const selected = await FormattingConflicts.select(provider, model, mode, FormattingKind.Selection);
	if (selected) {
		progress.report(selected);
		await instaService.invokeFunction(formatDocumentRangesWithProvider, selected, editorOrModel, rangeOrRanges, token, userGesture);
	}
}

export async function formatDocumentRangesWithProvider(
	accessor: ServicesAccessor,
	provider: DocumentRangeFormattingEditProvider,
	editorOrModel: ITextModel | IActiveCodeEditor,
	rangeOrRanges: Range | Range[],
	token: CancellationToken,
	userGesture: boolean
): Promise<boolean> {
	const workerService = accessor.get(IEditorWorkerService);
	const logService = accessor.get(ILogService);
	const accessibilitySignalService = accessor.get(IAccessibilitySignalService);

	let model: ITextModel;
	let cts: CancellationTokenSource;
	if (isCodeEditor(editorOrModel)) {
		model = editorOrModel.getModel();
		cts = new EditorStateCancellationTokenSource(editorOrModel, CodeEditorStateFlag.Value | CodeEditorStateFlag.Position, undefined, token);
	} else {
		model = editorOrModel;
		cts = new TextModelCancellationTokenSource(editorOrModel, token);
	}

	// make sure that ranges don't overlap nor touch each other
	const ranges: Range[] = [];
	let len = 0;
	for (const range of asArray(rangeOrRanges).sort(Range.compareRangesUsingStarts)) {
		if (len > 0 && Range.areIntersectingOrTouching(ranges[len - 1], range)) {
			ranges[len - 1] = Range.fromPositions(ranges[len - 1].getStartPosition(), range.getEndPosition());
		} else {
			len = ranges.push(range);
		}
	}

	const computeEdits = async (range: Range) => {
		logService.trace(`[format][provideDocumentRangeFormattingEdits] (request)`, provider.extensionId?.value, range);

		const result = (await provider.provideDocumentRangeFormattingEdits(
			model,
			range,
			model.getFormattingOptions(),
			cts.token
		)) || [];

		logService.trace(`[format][provideDocumentRangeFormattingEdits] (response)`, provider.extensionId?.value, result);

		return result;
	};

	const hasIntersectingEdit = (a: TextEdit[], b: TextEdit[]) => {
		if (!a.length || !b.length) {
			return false;
		}
		// quick exit if the list of ranges are completely unrelated [O(n)]
		const mergedA = a.reduce((acc, val) => { return Range.plusRange(acc, val.range); }, a[0].range);
		if (!b.some(x => { return Range.intersectRanges(mergedA, x.range); })) {
			return false;
		}
		// fallback to a complete check [O(n^2)]
		for (const edit of a) {
			for (const otherEdit of b) {
				if (Range.intersectRanges(edit.range, otherEdit.range)) {
					return true;
				}
			}
		}
		return false;
	};

	const allEdits: TextEdit[] = [];
	const rawEditsList: TextEdit[][] = [];
	try {
		if (typeof provider.provideDocumentRangesFormattingEdits === 'function') {
			logService.trace(`[format][provideDocumentRangeFormattingEdits] (request)`, provider.extensionId?.value, ranges);
			const result = (await provider.provideDocumentRangesFormattingEdits(
				model,
				ranges,
				model.getFormattingOptions(),
				cts.token
			)) || [];
			logService.trace(`[format][provideDocumentRangeFormattingEdits] (response)`, provider.extensionId?.value, result);
			rawEditsList.push(result);
		} else {

			for (const range of ranges) {
				if (cts.token.isCancellationRequested) {
					return true;
				}
				rawEditsList.push(await computeEdits(range));
			}

			for (let i = 0; i < ranges.length; ++i) {
				for (let j = i + 1; j < ranges.length; ++j) {
					if (cts.token.isCancellationRequested) {
						return true;
					}
					if (hasIntersectingEdit(rawEditsList[i], rawEditsList[j])) {
						// Merge ranges i and j into a single range, recompute the associated edits
						const mergedRange = Range.plusRange(ranges[i], ranges[j]);
						const edits = await computeEdits(mergedRange);
						ranges.splice(j, 1);
						ranges.splice(i, 1);
						ranges.push(mergedRange);
						rawEditsList.splice(j, 1);
						rawEditsList.splice(i, 1);
						rawEditsList.push(edits);
						// Restart scanning
						i = 0;
						j = 0;
					}
				}
			}
		}

		for (const rawEdits of rawEditsList) {
			if (cts.token.isCancellationRequested) {
				return true;
			}
			const minimalEdits = await workerService.computeMoreMinimalEdits(model.uri, rawEdits);
			if (minimalEdits) {
				allEdits.push(...minimalEdits);
			}
		}

		if (cts.token.isCancellationRequested) {
			return true;
		}
	} finally {
		cts.dispose();
	}

	if (allEdits.length === 0) {
		return false;
	}

	if (isCodeEditor(editorOrModel)) {
		// use editor to apply edits
		FormattingEdit.execute(editorOrModel, allEdits, true);
		editorOrModel.revealPositionInCenterIfOutsideViewport(editorOrModel.getPosition(), ScrollType.Immediate);

	} else {
		// use model to apply edits
		const [{ range }] = allEdits;
		const initialSelection = new Selection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
		model.pushEditOperations([initialSelection], allEdits.map(edit => {
			return {
				text: edit.text,
				range: Range.lift(edit.range),
				forceMoveMarkers: true
			};
		}), undoEdits => {
			for (const { range } of undoEdits) {
				if (Range.areIntersectingOrTouching(range, initialSelection)) {
					return [new Selection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn)];
				}
			}
			return null;
		});
	}
	accessibilitySignalService.playSignal(AccessibilitySignal.format, { userGesture });
	return true;
}

export async function formatDocumentWithSelectedProvider(
	accessor: ServicesAccessor,
	editorOrModel: ITextModel | IActiveCodeEditor,
	mode: FormattingMode,
	progress: IProgress<DocumentFormattingEditProvider>,
	token: CancellationToken,
	userGesture?: boolean
): Promise<void> {

	const instaService = accessor.get(IInstantiationService);
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	const model = isCodeEditor(editorOrModel) ? editorOrModel.getModel() : editorOrModel;
	const provider = getRealAndSyntheticDocumentFormattersOrdered(languageFeaturesService.documentFormattingEditProvider, languageFeaturesService.documentRangeFormattingEditProvider, model);
	const selected = await FormattingConflicts.select(provider, model, mode, FormattingKind.File);
	if (selected) {
		progress.report(selected);
		await instaService.invokeFunction(formatDocumentWithProvider, selected, editorOrModel, mode, token, userGesture);
	}
}

export async function formatDocumentWithProvider(
	accessor: ServicesAccessor,
	provider: DocumentFormattingEditProvider,
	editorOrModel: ITextModel | IActiveCodeEditor,
	mode: FormattingMode,
	token: CancellationToken,
	userGesture?: boolean
): Promise<boolean> {
	const workerService = accessor.get(IEditorWorkerService);
	const accessibilitySignalService = accessor.get(IAccessibilitySignalService);

	let model: ITextModel;
	let cts: CancellationTokenSource;
	if (isCodeEditor(editorOrModel)) {
		model = editorOrModel.getModel();
		cts = new EditorStateCancellationTokenSource(editorOrModel, CodeEditorStateFlag.Value | CodeEditorStateFlag.Position, undefined, token);
	} else {
		model = editorOrModel;
		cts = new TextModelCancellationTokenSource(editorOrModel, token);
	}

	let edits: TextEdit[] | undefined;
	try {
		const rawEdits = await provider.provideDocumentFormattingEdits(
			model,
			model.getFormattingOptions(),
			cts.token
		);

		edits = await workerService.computeMoreMinimalEdits(model.uri, rawEdits);

		if (cts.token.isCancellationRequested) {
			return true;
		}

	} finally {
		cts.dispose();
	}

	if (!edits || edits.length === 0) {
		return false;
	}

	if (isCodeEditor(editorOrModel)) {
		// use editor to apply edits
		FormattingEdit.execute(editorOrModel, edits, mode !== FormattingMode.Silent);

		if (mode !== FormattingMode.Silent) {
			editorOrModel.revealPositionInCenterIfOutsideViewport(editorOrModel.getPosition(), ScrollType.Immediate);
		}

	} else {
		// use model to apply edits
		const [{ range }] = edits;
		const initialSelection = new Selection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
		model.pushEditOperations([initialSelection], edits.map(edit => {
			return {
				text: edit.text,
				range: Range.lift(edit.range),
				forceMoveMarkers: true
			};
		}), undoEdits => {
			for (const { range } of undoEdits) {
				if (Range.areIntersectingOrTouching(range, initialSelection)) {
					return [new Selection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn)];
				}
			}
			return null;
		});
	}
	accessibilitySignalService.playSignal(AccessibilitySignal.format, { userGesture });
	return true;
}

export async function getDocumentRangeFormattingEditsUntilResult(
	workerService: IEditorWorkerService,
	languageFeaturesService: ILanguageFeaturesService,
	model: ITextModel,
	range: Range,
	options: FormattingOptions,
	token: CancellationToken
): Promise<TextEdit[] | undefined> {

	const providers = languageFeaturesService.documentRangeFormattingEditProvider.ordered(model);
	for (const provider of providers) {
		const rawEdits = await Promise.resolve(provider.provideDocumentRangeFormattingEdits(model, range, options, token)).catch(onUnexpectedExternalError);
		if (isNonEmptyArray(rawEdits)) {
			return await workerService.computeMoreMinimalEdits(model.uri, rawEdits);
		}
	}
	return undefined;
}

export async function getDocumentFormattingEditsUntilResult(
	workerService: IEditorWorkerService,
	languageFeaturesService: ILanguageFeaturesService,
	model: ITextModel,
	options: FormattingOptions,
	token: CancellationToken
): Promise<TextEdit[] | undefined> {

	const providers = getRealAndSyntheticDocumentFormattersOrdered(languageFeaturesService.documentFormattingEditProvider, languageFeaturesService.documentRangeFormattingEditProvider, model);
	for (const provider of providers) {
		const rawEdits = await Promise.resolve(provider.provideDocumentFormattingEdits(model, options, token)).catch(onUnexpectedExternalError);
		if (isNonEmptyArray(rawEdits)) {
			return await workerService.computeMoreMinimalEdits(model.uri, rawEdits);
		}
	}
	return undefined;
}

export async function getDocumentFormattingEditsWithSelectedProvider(
	workerService: IEditorWorkerService,
	languageFeaturesService: ILanguageFeaturesService,
	editorOrModel: ITextModel | IActiveCodeEditor,
	mode: FormattingMode,
	token: CancellationToken,
): Promise<TextEdit[] | undefined> {
	const model = isCodeEditor(editorOrModel) ? editorOrModel.getModel() : editorOrModel;
	const provider = getRealAndSyntheticDocumentFormattersOrdered(languageFeaturesService.documentFormattingEditProvider, languageFeaturesService.documentRangeFormattingEditProvider, model);
	const selected = await FormattingConflicts.select(provider, model, mode, FormattingKind.File);
	if (selected) {
		const rawEdits = await Promise.resolve(selected.provideDocumentFormattingEdits(model, model.getOptions(), token)).catch(onUnexpectedExternalError);
		return await workerService.computeMoreMinimalEdits(model.uri, rawEdits);
	}
	return undefined;
}

export function getOnTypeFormattingEdits(
	workerService: IEditorWorkerService,
	languageFeaturesService: ILanguageFeaturesService,
	model: ITextModel,
	position: Position,
	ch: string,
	options: FormattingOptions,
	token: CancellationToken
): Promise<TextEdit[] | null | undefined> {

	const providers = languageFeaturesService.onTypeFormattingEditProvider.ordered(model);

	if (providers.length === 0) {
		return Promise.resolve(undefined);
	}

	if (providers[0].autoFormatTriggerCharacters.indexOf(ch) < 0) {
		return Promise.resolve(undefined);
	}

	return Promise.resolve(providers[0].provideOnTypeFormattingEdits(model, position, ch, options, token)).catch(onUnexpectedExternalError).then(edits => {
		return workerService.computeMoreMinimalEdits(model.uri, edits);
	});
}

function isFormattingOptions(obj: unknown): obj is FormattingOptions {
	const candidate = obj as FormattingOptions | undefined;

	return !!candidate && typeof candidate === 'object' && typeof candidate.tabSize === 'number' && typeof candidate.insertSpaces === 'boolean';
}

CommandsRegistry.registerCommand('_executeFormatRangeProvider', async function (accessor, ...args) {
	const [resource, range, options] = args;
	assertType(URI.isUri(resource));
	assertType(Range.isIRange(range));

	const resolverService = accessor.get(ITextModelService);
	const workerService = accessor.get(IEditorWorkerService);
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	const reference = await resolverService.createModelReference(resource);
	try {
		return getDocumentRangeFormattingEditsUntilResult(workerService, languageFeaturesService, reference.object.textEditorModel, Range.lift(range), ensureFormattingOptions(options, reference), CancellationToken.None);
	} finally {
		reference.dispose();
	}
});

CommandsRegistry.registerCommand('_executeFormatDocumentProvider', async function (accessor, ...args) {
	const [resource, options] = args;
	assertType(URI.isUri(resource));

	const resolverService = accessor.get(ITextModelService);
	const workerService = accessor.get(IEditorWorkerService);
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	const reference = await resolverService.createModelReference(resource);
	try {
		return getDocumentFormattingEditsUntilResult(workerService, languageFeaturesService, reference.object.textEditorModel, ensureFormattingOptions(options, reference), CancellationToken.None);
	} finally {
		reference.dispose();
	}
});

CommandsRegistry.registerCommand('_executeFormatOnTypeProvider', async function (accessor, ...args) {
	const [resource, position, ch, options] = args;
	assertType(URI.isUri(resource));
	assertType(Position.isIPosition(position));
	assertType(typeof ch === 'string');

	const resolverService = accessor.get(ITextModelService);
	const workerService = accessor.get(IEditorWorkerService);
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	const reference = await resolverService.createModelReference(resource);
	try {
		return getOnTypeFormattingEdits(workerService, languageFeaturesService, reference.object.textEditorModel, Position.lift(position), ch, ensureFormattingOptions(options, reference), CancellationToken.None);
	} finally {
		reference.dispose();
	}
});
function ensureFormattingOptions(options: unknown, reference: IReference<IResolvedTextEditorModel>): FormattingOptions {
	let validatedOptions: FormattingOptions;
	if (isFormattingOptions(options)) {
		validatedOptions = options;
	} else {
		const modelOptions = reference.object.textEditorModel.getOptions();
		validatedOptions = {
			tabSize: modelOptions.tabSize,
			insertSpaces: modelOptions.insertSpaces
		};
	}

	return validatedOptions;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/format/browser/formatActions.ts]---
Location: vscode-main/src/vs/editor/contrib/format/browser/formatActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorContributionInstantiation, registerEditorAction, registerEditorContribution, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { CharacterSet } from '../../../common/core/characterClassifier.js';
import { Range } from '../../../common/core/range.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { IEditorWorkerService } from '../../../common/services/editorWorker.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { formatDocumentRangesWithSelectedProvider, formatDocumentWithSelectedProvider, FormattingMode, getOnTypeFormattingEdits } from './format.js';
import { FormattingEdit } from './formattingEdit.js';
import * as nls from '../../../../nls.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IEditorProgressService, Progress } from '../../../../platform/progress/common/progress.js';

export class FormatOnType implements IEditorContribution {

	public static readonly ID = 'editor.contrib.autoFormat';


	private readonly _disposables = new DisposableStore();
	private readonly _sessionDisposables = new DisposableStore();

	constructor(
		private readonly _editor: ICodeEditor,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@IEditorWorkerService private readonly _workerService: IEditorWorkerService,
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService
	) {
		this._disposables.add(_languageFeaturesService.onTypeFormattingEditProvider.onDidChange(this._update, this));
		this._disposables.add(_editor.onDidChangeModel(() => this._update()));
		this._disposables.add(_editor.onDidChangeModelLanguage(() => this._update()));
		this._disposables.add(_editor.onDidChangeConfiguration(e => {
			if (e.hasChanged(EditorOption.formatOnType)) {
				this._update();
			}
		}));
		this._update();
	}

	dispose(): void {
		this._disposables.dispose();
		this._sessionDisposables.dispose();
	}

	private _update(): void {

		// clean up
		this._sessionDisposables.clear();

		// we are disabled
		if (!this._editor.getOption(EditorOption.formatOnType)) {
			return;
		}

		// no model
		if (!this._editor.hasModel()) {
			return;
		}

		const model = this._editor.getModel();

		// no support
		const [support] = this._languageFeaturesService.onTypeFormattingEditProvider.ordered(model);
		if (!support || !support.autoFormatTriggerCharacters) {
			return;
		}

		// register typing listeners that will trigger the format
		const triggerChars = new CharacterSet();
		for (const ch of support.autoFormatTriggerCharacters) {
			triggerChars.add(ch.charCodeAt(0));
		}
		this._sessionDisposables.add(this._editor.onDidType((text: string) => {
			const lastCharCode = text.charCodeAt(text.length - 1);
			if (triggerChars.has(lastCharCode)) {
				this._trigger(String.fromCharCode(lastCharCode));
			}
		}));
	}

	private _trigger(ch: string): void {
		if (!this._editor.hasModel()) {
			return;
		}

		if (this._editor.getSelections().length > 1 || !this._editor.getSelection().isEmpty()) {
			return;
		}

		const model = this._editor.getModel();
		const position = this._editor.getPosition();
		const cts = new CancellationTokenSource();

		// install a listener that checks if edits happens before the
		// position on which we format right now. If so, we won't
		// apply the format edits
		const unbind = this._editor.onDidChangeModelContent((e) => {
			if (e.isFlush) {
				// a model.setValue() was called
				// cancel only once
				cts.cancel();
				unbind.dispose();
				return;
			}

			for (let i = 0, len = e.changes.length; i < len; i++) {
				const change = e.changes[i];
				if (change.range.endLineNumber <= position.lineNumber) {
					// cancel only once
					cts.cancel();
					unbind.dispose();
					return;
				}
			}
		});

		getOnTypeFormattingEdits(
			this._workerService,
			this._languageFeaturesService,
			model,
			position,
			ch,
			model.getFormattingOptions(),
			cts.token
		).then(edits => {
			if (cts.token.isCancellationRequested) {
				return;
			}
			if (isNonEmptyArray(edits)) {
				this._accessibilitySignalService.playSignal(AccessibilitySignal.format, { userGesture: false });
				FormattingEdit.execute(this._editor, edits, true);
			}
		}).finally(() => {
			unbind.dispose();
		});
	}
}

class FormatOnPaste implements IEditorContribution {

	public static readonly ID = 'editor.contrib.formatOnPaste';

	private readonly _callOnDispose = new DisposableStore();
	private readonly _callOnModel = new DisposableStore();

	constructor(
		private readonly editor: ICodeEditor,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		this._callOnDispose.add(editor.onDidChangeConfiguration(() => this._update()));
		this._callOnDispose.add(editor.onDidChangeModel(() => this._update()));
		this._callOnDispose.add(editor.onDidChangeModelLanguage(() => this._update()));
		this._callOnDispose.add(_languageFeaturesService.documentRangeFormattingEditProvider.onDidChange(this._update, this));
	}

	dispose(): void {
		this._callOnDispose.dispose();
		this._callOnModel.dispose();
	}

	private _update(): void {

		// clean up
		this._callOnModel.clear();

		// we are disabled
		if (!this.editor.getOption(EditorOption.formatOnPaste)) {
			return;
		}

		// no model
		if (!this.editor.hasModel()) {
			return;
		}

		// no formatter
		if (!this._languageFeaturesService.documentRangeFormattingEditProvider.has(this.editor.getModel())) {
			return;
		}

		this._callOnModel.add(this.editor.onDidPaste(({ range }) => this._trigger(range)));
	}

	private _trigger(range: Range): void {
		if (!this.editor.hasModel()) {
			return;
		}
		if (this.editor.getSelections().length > 1) {
			return;
		}
		this._instantiationService.invokeFunction(formatDocumentRangesWithSelectedProvider, this.editor, range, FormattingMode.Silent, Progress.None, CancellationToken.None, false).catch(onUnexpectedError);
	}
}

class FormatDocumentAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.formatDocument',
			label: nls.localize2('formatDocument.label', "Format Document"),
			precondition: ContextKeyExpr.and(EditorContextKeys.notInCompositeEditor, EditorContextKeys.writable, EditorContextKeys.hasDocumentFormattingProvider),
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.KeyF,
				linux: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyI },
				weight: KeybindingWeight.EditorContrib
			},
			contextMenuOpts: {
				group: '1_modification',
				order: 1.3
			}
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		if (editor.hasModel()) {
			const instaService = accessor.get(IInstantiationService);
			const progressService = accessor.get(IEditorProgressService);
			await progressService.showWhile(
				instaService.invokeFunction(formatDocumentWithSelectedProvider, editor, FormattingMode.Explicit, Progress.None, CancellationToken.None, true),
				250
			);
		}
	}
}

class FormatSelectionAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.formatSelection',
			label: nls.localize2('formatSelection.label', "Format Selection"),
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasDocumentSelectionFormattingProvider),
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyF),
				weight: KeybindingWeight.EditorContrib
			},
			contextMenuOpts: {
				when: EditorContextKeys.hasNonEmptySelection,
				group: '1_modification',
				order: 1.31
			}
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		if (!editor.hasModel()) {
			return;
		}
		const instaService = accessor.get(IInstantiationService);
		const model = editor.getModel();

		const ranges = editor.getSelections().map(range => {
			return range.isEmpty()
				? new Range(range.startLineNumber, 1, range.startLineNumber, model.getLineMaxColumn(range.startLineNumber))
				: range;
		});

		const progressService = accessor.get(IEditorProgressService);
		await progressService.showWhile(
			instaService.invokeFunction(formatDocumentRangesWithSelectedProvider, editor, ranges, FormattingMode.Explicit, Progress.None, CancellationToken.None, true),
			250
		);
	}
}

registerEditorContribution(FormatOnType.ID, FormatOnType, EditorContributionInstantiation.BeforeFirstInteraction);
registerEditorContribution(FormatOnPaste.ID, FormatOnPaste, EditorContributionInstantiation.BeforeFirstInteraction);
registerEditorAction(FormatDocumentAction);
registerEditorAction(FormatSelectionAction);

// this is the old format action that does both (format document OR format selection)
// and we keep it here such that existing keybinding configurations etc will still work
CommandsRegistry.registerCommand('editor.action.format', async accessor => {
	const editor = accessor.get(ICodeEditorService).getFocusedCodeEditor();
	if (!editor || !editor.hasModel()) {
		return;
	}
	const commandService = accessor.get(ICommandService);
	if (editor.getSelection().isEmpty()) {
		await commandService.executeCommand('editor.action.formatDocument');
	} else {
		await commandService.executeCommand('editor.action.formatSelection');
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/format/browser/formattingEdit.ts]---
Location: vscode-main/src/vs/editor/contrib/format/browser/formattingEdit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditOperation, ISingleEditOperation } from '../../../common/core/editOperation.js';
import { Range } from '../../../common/core/range.js';
import { EndOfLineSequence } from '../../../common/model.js';
import { TextEdit } from '../../../common/languages.js';
import { StableEditorScrollState } from '../../../browser/stableEditorScroll.js';

export class FormattingEdit {

	private static _handleEolEdits(editor: ICodeEditor, edits: TextEdit[]): ISingleEditOperation[] {
		let newEol: EndOfLineSequence | undefined = undefined;
		const singleEdits: ISingleEditOperation[] = [];

		for (const edit of edits) {
			if (typeof edit.eol === 'number') {
				newEol = edit.eol;
			}
			if (edit.range && typeof edit.text === 'string') {
				singleEdits.push(edit);
			}
		}

		if (typeof newEol === 'number') {
			if (editor.hasModel()) {
				editor.getModel().pushEOL(newEol);
			}
		}

		return singleEdits;
	}

	private static _isFullModelReplaceEdit(editor: ICodeEditor, edit: ISingleEditOperation): boolean {
		if (!editor.hasModel()) {
			return false;
		}
		const model = editor.getModel();
		const editRange = model.validateRange(edit.range);
		const fullModelRange = model.getFullModelRange();
		return fullModelRange.equalsRange(editRange);
	}

	static execute(editor: ICodeEditor, _edits: TextEdit[], addUndoStops: boolean) {
		if (addUndoStops) {
			editor.pushUndoStop();
		}
		const scrollState = StableEditorScrollState.capture(editor);
		const edits = FormattingEdit._handleEolEdits(editor, _edits);
		if (edits.length === 1 && FormattingEdit._isFullModelReplaceEdit(editor, edits[0])) {
			// We use replace semantics and hope that markers stay put...
			editor.executeEdits('formatEditsCommand', edits.map(edit => EditOperation.replace(Range.lift(edit.range), edit.text)));
		} else {
			editor.executeEdits('formatEditsCommand', edits.map(edit => EditOperation.replaceMove(Range.lift(edit.range), edit.text)));
		}
		if (addUndoStops) {
			editor.pushUndoStop();
		}
		scrollState.restoreRelativeVerticalPositionOfCursor(editor);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/gotoError/browser/gotoError.ts]---
Location: vscode-main/src/vs/editor/contrib/gotoError/browser/gotoError.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorCommand, EditorContributionInstantiation, IActionOptions, registerEditorAction, registerEditorCommand, registerEditorContribution, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { IMarkerNavigationService, MarkerList } from './markerNavigationService.js';
import * as nls from '../../../../nls.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { TextEditorSelectionRevealType } from '../../../../platform/editor/common/editor.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IMarker } from '../../../../platform/markers/common/markers.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { MarkerNavigationWidget } from './gotoErrorWidget.js';

export class MarkerController implements IEditorContribution {

	static readonly ID = 'editor.contrib.markerController';

	static get(editor: ICodeEditor): MarkerController | null {
		return editor.getContribution<MarkerController>(MarkerController.ID);
	}

	private readonly _editor: ICodeEditor;

	private readonly _widgetVisible: IContextKey<boolean>;
	private readonly _sessionDispoables = new DisposableStore();

	private _model?: MarkerList;
	private _widget?: MarkerNavigationWidget;

	constructor(
		editor: ICodeEditor,
		@IMarkerNavigationService private readonly _markerNavigationService: IMarkerNavigationService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@ICodeEditorService private readonly _editorService: ICodeEditorService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		this._editor = editor;
		this._widgetVisible = CONTEXT_MARKERS_NAVIGATION_VISIBLE.bindTo(this._contextKeyService);
	}

	dispose(): void {
		this._cleanUp();
		this._sessionDispoables.dispose();
	}

	private _cleanUp(): void {
		this._widgetVisible.reset();
		this._sessionDispoables.clear();
		this._widget = undefined;
		this._model = undefined;
	}

	private _getOrCreateModel(uri: URI | undefined): MarkerList {

		if (this._model && this._model.matches(uri)) {
			return this._model;
		}
		let reusePosition = false;
		if (this._model) {
			reusePosition = true;
			this._cleanUp();
		}

		this._model = this._markerNavigationService.getMarkerList(uri);
		if (reusePosition) {
			this._model.move(true, this._editor.getModel()!, this._editor.getPosition()!);
		}

		this._widget = this._instantiationService.createInstance(MarkerNavigationWidget, this._editor);
		this._widget.onDidClose(() => this.close(), this, this._sessionDispoables);
		this._widgetVisible.set(true);

		this._sessionDispoables.add(this._model);
		this._sessionDispoables.add(this._widget);

		// follow cursor
		this._sessionDispoables.add(this._editor.onDidChangeCursorPosition(e => {
			if (!this._model?.selected || !Range.containsPosition(this._model?.selected.marker, e.position)) {
				this._model?.resetIndex();
			}
		}));

		// update markers
		this._sessionDispoables.add(this._model.onDidChange(() => {
			if (!this._widget || !this._widget.position || !this._model) {
				return;
			}
			const info = this._model.find(this._editor.getModel()!.uri, this._widget.position);
			if (info) {
				this._widget.updateMarker(info.marker);
			} else {
				this._widget.showStale();
			}
		}));

		// open related
		this._sessionDispoables.add(this._widget.onDidSelectRelatedInformation(related => {
			this._editorService.openCodeEditor({
				resource: related.resource,
				options: { pinned: true, revealIfOpened: true, selection: Range.lift(related).collapseToStart() }
			}, this._editor);
			this.close(false);
		}));
		this._sessionDispoables.add(this._editor.onDidChangeModel(() => this._cleanUp()));

		return this._model;
	}

	close(focusEditor: boolean = true): void {
		this._cleanUp();
		if (focusEditor) {
			this._editor.focus();
		}
	}

	showAtMarker(marker: IMarker): void {
		if (!this._editor.hasModel()) {
			return;
		}

		const textModel = this._editor.getModel();
		const model = this._getOrCreateModel(textModel.uri);
		model.resetIndex();
		model.move(true, textModel, new Position(marker.startLineNumber, marker.startColumn));
		if (model.selected) {
			this._widget!.showAtMarker(model.selected.marker, model.selected.index, model.selected.total);
		}
	}

	async navigate(next: boolean, multiFile: boolean) {
		if (!this._editor.hasModel()) {
			return;
		}

		const textModel = this._editor.getModel();
		const model = this._getOrCreateModel(multiFile ? undefined : textModel.uri);
		model.move(next, textModel, this._editor.getPosition());
		if (!model.selected) {
			return;
		}
		if (model.selected.marker.resource.toString() !== textModel.uri.toString()) {
			// show in different editor
			this._cleanUp();
			const otherEditor = await this._editorService.openCodeEditor({
				resource: model.selected.marker.resource,
				options: { pinned: false, revealIfOpened: true, selectionRevealType: TextEditorSelectionRevealType.NearTop, selection: model.selected.marker }
			}, this._editor);

			if (otherEditor) {
				MarkerController.get(otherEditor)?.close();
				MarkerController.get(otherEditor)?.navigate(next, multiFile);
			}

		} else {
			// show in this editor
			this._widget!.showAtMarker(model.selected.marker, model.selected.index, model.selected.total);
		}
	}
}

class MarkerNavigationAction extends EditorAction {

	constructor(
		private readonly _next: boolean,
		private readonly _multiFile: boolean,
		opts: IActionOptions
	) {
		super(opts);
	}

	async run(_accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		if (editor.hasModel()) {
			await MarkerController.get(editor)?.navigate(this._next, this._multiFile);
		}
	}
}

export class NextMarkerAction extends MarkerNavigationAction {
	static ID: string = 'editor.action.marker.next';
	static LABEL = nls.localize2('markerAction.next.label', "Go to Next Problem (Error, Warning, Info)");
	constructor() {
		super(true, false, {
			id: NextMarkerAction.ID,
			label: NextMarkerAction.LABEL,
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.focus,
				primary: KeyMod.Alt | KeyCode.F8,
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				menuId: MarkerNavigationWidget.TitleMenu,
				title: NextMarkerAction.LABEL.value,
				icon: registerIcon('marker-navigation-next', Codicon.arrowDown, nls.localize('nextMarkerIcon', 'Icon for goto next marker.')),
				group: 'navigation',
				order: 1
			}
		});
	}
}

class PrevMarkerAction extends MarkerNavigationAction {
	static ID: string = 'editor.action.marker.prev';
	static LABEL = nls.localize2('markerAction.previous.label', "Go to Previous Problem (Error, Warning, Info)");
	constructor() {
		super(false, false, {
			id: PrevMarkerAction.ID,
			label: PrevMarkerAction.LABEL,
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.focus,
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.F8,
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				menuId: MarkerNavigationWidget.TitleMenu,
				title: PrevMarkerAction.LABEL.value,
				icon: registerIcon('marker-navigation-previous', Codicon.arrowUp, nls.localize('previousMarkerIcon', 'Icon for goto previous marker.')),
				group: 'navigation',
				order: 2
			}
		});
	}
}

class NextMarkerInFilesAction extends MarkerNavigationAction {
	constructor() {
		super(true, true, {
			id: 'editor.action.marker.nextInFiles',
			label: nls.localize2('markerAction.nextInFiles.label', "Go to Next Problem in Files (Error, Warning, Info)"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.focus,
				primary: KeyCode.F8,
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				menuId: MenuId.MenubarGoMenu,
				title: nls.localize({ key: 'miGotoNextProblem', comment: ['&& denotes a mnemonic'] }, "Next &&Problem"),
				group: '6_problem_nav',
				order: 1
			}
		});
	}
}

class PrevMarkerInFilesAction extends MarkerNavigationAction {
	constructor() {
		super(false, true, {
			id: 'editor.action.marker.prevInFiles',
			label: nls.localize2('markerAction.previousInFiles.label', "Go to Previous Problem in Files (Error, Warning, Info)"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.focus,
				primary: KeyMod.Shift | KeyCode.F8,
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				menuId: MenuId.MenubarGoMenu,
				title: nls.localize({ key: 'miGotoPreviousProblem', comment: ['&& denotes a mnemonic'] }, "Previous &&Problem"),
				group: '6_problem_nav',
				order: 2
			}
		});
	}
}

registerEditorContribution(MarkerController.ID, MarkerController, EditorContributionInstantiation.Lazy);
registerEditorAction(NextMarkerAction);
registerEditorAction(PrevMarkerAction);
registerEditorAction(NextMarkerInFilesAction);
registerEditorAction(PrevMarkerInFilesAction);

const CONTEXT_MARKERS_NAVIGATION_VISIBLE = new RawContextKey<boolean>('markersNavigationVisible', false);

const MarkerCommand = EditorCommand.bindToContribution<MarkerController>(MarkerController.get);

registerEditorCommand(new MarkerCommand({
	id: 'closeMarkersNavigation',
	precondition: CONTEXT_MARKERS_NAVIGATION_VISIBLE,
	handler: x => x.close(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 50,
		kbExpr: EditorContextKeys.focus,
		primary: KeyCode.Escape,
		secondary: [KeyMod.Shift | KeyCode.Escape]
	}
}));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/gotoError/browser/gotoErrorWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/gotoError/browser/gotoErrorWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { ScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { Color } from '../../../../base/common/color.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { DisposableStore, dispose } from '../../../../base/common/lifecycle.js';
import { basename } from '../../../../base/common/resources.js';
import { ScrollbarVisibility } from '../../../../base/common/scrollable.js';
import { splitLines } from '../../../../base/common/strings.js';
import './media/gotoErrorWidget.css';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Range } from '../../../common/core/range.js';
import { ScrollType } from '../../../common/editorCommon.js';
import { peekViewTitleForeground, peekViewTitleInfoForeground, PeekViewWidget } from '../../peekView/browser/peekView.js';
import * as nls from '../../../../nls.js';
import { getFlatActionBarActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IMarker, IRelatedInformation, MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { SeverityIcon } from '../../../../base/browser/ui/severityIcon/severityIcon.js';
import { contrastBorder, editorBackground, editorErrorBorder, editorErrorForeground, editorInfoBorder, editorInfoForeground, editorWarningBorder, editorWarningForeground, oneOf, registerColor, transparent } from '../../../../platform/theme/common/colorRegistry.js';
import { IColorTheme, IThemeService } from '../../../../platform/theme/common/themeService.js';

class MessageWidget {

	private _lines: number = 0;
	private _longestLineLength: number = 0;

	private readonly _editor: ICodeEditor;
	private readonly _messageBlock: HTMLDivElement;
	private readonly _relatedBlock: HTMLDivElement;
	private readonly _scrollable: ScrollableElement;
	private readonly _relatedDiagnostics = new WeakMap<HTMLElement, IRelatedInformation>();
	private readonly _disposables: DisposableStore = new DisposableStore();

	private _codeLink?: HTMLElement;

	constructor(
		parent: HTMLElement,
		editor: ICodeEditor,
		onRelatedInformation: (related: IRelatedInformation) => void,
		private readonly _openerService: IOpenerService,
		private readonly _labelService: ILabelService
	) {
		this._editor = editor;

		const domNode = document.createElement('div');
		domNode.className = 'descriptioncontainer';

		this._messageBlock = document.createElement('div');
		this._messageBlock.classList.add('message');
		this._messageBlock.setAttribute('aria-live', 'assertive');
		this._messageBlock.setAttribute('role', 'alert');
		domNode.appendChild(this._messageBlock);

		this._relatedBlock = document.createElement('div');
		domNode.appendChild(this._relatedBlock);
		this._disposables.add(dom.addStandardDisposableListener(this._relatedBlock, 'click', event => {
			event.preventDefault();
			const related = this._relatedDiagnostics.get(event.target);
			if (related) {
				onRelatedInformation(related);
			}
		}));

		this._scrollable = new ScrollableElement(domNode, {
			horizontal: ScrollbarVisibility.Auto,
			vertical: ScrollbarVisibility.Auto,
			useShadows: false,
			horizontalScrollbarSize: 6,
			verticalScrollbarSize: 6
		});
		parent.appendChild(this._scrollable.getDomNode());
		this._disposables.add(this._scrollable.onScroll(e => {
			domNode.style.left = `-${e.scrollLeft}px`;
			domNode.style.top = `-${e.scrollTop}px`;
		}));
		this._disposables.add(this._scrollable);
	}

	dispose(): void {
		dispose(this._disposables);
	}

	update(marker: IMarker): void {
		const { source, message, relatedInformation, code } = marker;
		let sourceAndCodeLength = (source?.length || 0) + '()'.length;
		if (code) {
			if (typeof code === 'string') {
				sourceAndCodeLength += code.length;
			} else {
				sourceAndCodeLength += code.value.length;
			}
		}

		const lines = splitLines(message);
		this._lines = lines.length;
		this._longestLineLength = 0;
		for (const line of lines) {
			this._longestLineLength = Math.max(line.length + sourceAndCodeLength, this._longestLineLength);
		}

		dom.clearNode(this._messageBlock);
		this._messageBlock.setAttribute('aria-label', this.getAriaLabel(marker));
		this._editor.applyFontInfo(this._messageBlock);
		let lastLineElement = this._messageBlock;
		for (const line of lines) {
			lastLineElement = document.createElement('div');
			lastLineElement.innerText = line;
			if (line === '') {
				lastLineElement.style.height = this._messageBlock.style.lineHeight;
			}
			this._messageBlock.appendChild(lastLineElement);
		}
		if (source || code) {
			const detailsElement = document.createElement('span');
			detailsElement.classList.add('details');
			lastLineElement.appendChild(detailsElement);
			if (source) {
				const sourceElement = document.createElement('span');
				sourceElement.innerText = source;
				sourceElement.classList.add('source');
				detailsElement.appendChild(sourceElement);
			}
			if (code) {
				if (typeof code === 'string') {
					const codeElement = document.createElement('span');
					codeElement.innerText = `(${code})`;
					codeElement.classList.add('code');
					detailsElement.appendChild(codeElement);
				} else {
					this._codeLink = dom.$('a.code-link');
					this._codeLink.setAttribute('href', `${code.target.toString()}`);

					this._codeLink.onclick = (e) => {
						this._openerService.open(code.target, { allowCommands: true });
						e.preventDefault();
						e.stopPropagation();
					};

					const codeElement = dom.append(this._codeLink, dom.$('span'));
					codeElement.innerText = code.value;
					detailsElement.appendChild(this._codeLink);
				}
			}
		}

		dom.clearNode(this._relatedBlock);
		this._editor.applyFontInfo(this._relatedBlock);
		if (isNonEmptyArray(relatedInformation)) {
			const relatedInformationNode = this._relatedBlock.appendChild(document.createElement('div'));
			relatedInformationNode.style.paddingTop = `${Math.floor(this._editor.getOption(EditorOption.lineHeight) * 0.66)}px`;
			this._lines += 1;

			for (const related of relatedInformation) {

				const container = document.createElement('div');

				const relatedResource = document.createElement('a');
				relatedResource.classList.add('filename');
				relatedResource.innerText = `${this._labelService.getUriBasenameLabel(related.resource)}(${related.startLineNumber}, ${related.startColumn}): `;
				relatedResource.title = this._labelService.getUriLabel(related.resource);
				this._relatedDiagnostics.set(relatedResource, related);

				const relatedMessage = document.createElement('span');
				relatedMessage.innerText = related.message;

				container.appendChild(relatedResource);
				container.appendChild(relatedMessage);

				this._lines += 1;
				relatedInformationNode.appendChild(container);
			}
		}

		const fontInfo = this._editor.getOption(EditorOption.fontInfo);
		const scrollWidth = Math.ceil(fontInfo.typicalFullwidthCharacterWidth * this._longestLineLength * 0.75);
		const scrollHeight = fontInfo.lineHeight * this._lines;
		this._scrollable.setScrollDimensions({ scrollWidth, scrollHeight });
	}

	layout(height: number, width: number): void {
		this._scrollable.getDomNode().style.height = `${height}px`;
		this._scrollable.getDomNode().style.width = `${width}px`;
		this._scrollable.setScrollDimensions({ width, height });
	}

	getHeightInLines(): number {
		return Math.min(17, this._lines);
	}

	private getAriaLabel(marker: IMarker): string {
		let severityLabel = '';
		switch (marker.severity) {
			case MarkerSeverity.Error:
				severityLabel = nls.localize('Error', "Error");
				break;
			case MarkerSeverity.Warning:
				severityLabel = nls.localize('Warning', "Warning");
				break;
			case MarkerSeverity.Info:
				severityLabel = nls.localize('Info', "Info");
				break;
			case MarkerSeverity.Hint:
				severityLabel = nls.localize('Hint', "Hint");
				break;
		}

		let ariaLabel = nls.localize('marker aria', "{0} at {1}. ", severityLabel, marker.startLineNumber + ':' + marker.startColumn);
		const model = this._editor.getModel();
		if (model && (marker.startLineNumber <= model.getLineCount()) && (marker.startLineNumber >= 1)) {
			const lineContent = model.getLineContent(marker.startLineNumber);
			ariaLabel = `${lineContent}, ${ariaLabel}`;
		}
		return ariaLabel;
	}
}

export class MarkerNavigationWidget extends PeekViewWidget {

	static readonly TitleMenu = new MenuId('gotoErrorTitleMenu');

	private _parentContainer!: HTMLElement;
	private _container!: HTMLElement;
	private _icon!: HTMLElement;
	private _message!: MessageWidget;
	private readonly _callOnDispose = new DisposableStore();
	private _severity: MarkerSeverity;
	private _backgroundColor?: Color;
	private readonly _onDidSelectRelatedInformation = new Emitter<IRelatedInformation>();
	private _heightInPixel!: number;

	readonly onDidSelectRelatedInformation: Event<IRelatedInformation> = this._onDidSelectRelatedInformation.event;

	constructor(
		editor: ICodeEditor,
		@IThemeService private readonly _themeService: IThemeService,
		@IOpenerService private readonly _openerService: IOpenerService,
		@IMenuService private readonly _menuService: IMenuService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@ILabelService private readonly _labelService: ILabelService
	) {
		super(editor, { showArrow: true, showFrame: true, isAccessible: true, frameWidth: 1 }, instantiationService);
		this._severity = MarkerSeverity.Warning;
		this._backgroundColor = Color.white;

		this._applyTheme(_themeService.getColorTheme());
		this._callOnDispose.add(_themeService.onDidColorThemeChange(this._applyTheme.bind(this)));

		this.create();
	}

	private _applyTheme(theme: IColorTheme) {
		this._backgroundColor = theme.getColor(editorMarkerNavigationBackground);
		let colorId = editorMarkerNavigationError;
		let headerBackground = editorMarkerNavigationErrorHeader;

		if (this._severity === MarkerSeverity.Warning) {
			colorId = editorMarkerNavigationWarning;
			headerBackground = editorMarkerNavigationWarningHeader;
		} else if (this._severity === MarkerSeverity.Info) {
			colorId = editorMarkerNavigationInfo;
			headerBackground = editorMarkerNavigationInfoHeader;
		}

		const frameColor = theme.getColor(colorId);
		const headerBg = theme.getColor(headerBackground);

		this.style({
			arrowColor: frameColor,
			frameColor: frameColor,
			headerBackgroundColor: headerBg,
			primaryHeadingColor: theme.getColor(peekViewTitleForeground),
			secondaryHeadingColor: theme.getColor(peekViewTitleInfoForeground)
		}); // style() will trigger _applyStyles
	}

	protected override _applyStyles(): void {
		if (this._parentContainer) {
			this._parentContainer.style.backgroundColor = this._backgroundColor ? this._backgroundColor.toString() : '';
		}
		super._applyStyles();
	}

	override dispose(): void {
		this._callOnDispose.dispose();
		super.dispose();
	}

	focus(): void {
		this._parentContainer.focus();
	}

	protected override _fillHead(container: HTMLElement): void {
		super._fillHead(container);

		this._disposables.add(this._actionbarWidget!.actionRunner.onWillRun(e => this.editor.focus()));

		const menu = this._menuService.getMenuActions(MarkerNavigationWidget.TitleMenu, this._contextKeyService);
		const actions = getFlatActionBarActions(menu);
		this._actionbarWidget!.push(actions, { label: false, icon: true, index: 0 });
	}

	protected override _fillTitleIcon(container: HTMLElement): void {
		this._icon = dom.append(container, dom.$(''));
	}

	protected _fillBody(container: HTMLElement): void {
		this._parentContainer = container;
		container.classList.add('marker-widget');
		this._parentContainer.tabIndex = 0;
		this._parentContainer.setAttribute('role', 'tooltip');

		this._container = document.createElement('div');
		container.appendChild(this._container);

		this._message = new MessageWidget(this._container, this.editor, related => this._onDidSelectRelatedInformation.fire(related), this._openerService, this._labelService);
		this._disposables.add(this._message);
	}

	override show(): void {
		throw new Error('call showAtMarker');
	}

	showAtMarker(marker: IMarker, markerIdx: number, markerCount: number): void {
		// update:
		// * title
		// * message
		this._container.classList.remove('stale');
		this._message.update(marker);

		// update frame color (only applied on 'show')
		this._severity = marker.severity;
		this._applyTheme(this._themeService.getColorTheme());

		// show
		const range = Range.lift(marker);
		const editorPosition = this.editor.getPosition();
		const position = editorPosition && range.containsPosition(editorPosition) ? editorPosition : range.getStartPosition();
		super.show(position, this.computeRequiredHeight());

		const model = this.editor.getModel();
		if (model) {
			const detail = markerCount > 1
				? nls.localize('problems', "{0} of {1} problems", markerIdx, markerCount)
				: nls.localize('change', "{0} of {1} problem", markerIdx, markerCount);
			this.setTitle(basename(model.uri), detail);
		}
		this._icon.className = `codicon ${SeverityIcon.className(MarkerSeverity.toSeverity(this._severity))}`;

		this.editor.revealPositionNearTop(position, ScrollType.Smooth);
		this.editor.focus();
	}

	updateMarker(marker: IMarker): void {
		this._container.classList.remove('stale');
		this._message.update(marker);
	}

	showStale() {
		this._container.classList.add('stale');
		this._relayout();
	}

	protected override _doLayoutBody(heightInPixel: number, widthInPixel: number): void {
		super._doLayoutBody(heightInPixel, widthInPixel);
		this._heightInPixel = heightInPixel;
		this._message.layout(heightInPixel, widthInPixel);
		this._container.style.height = `${heightInPixel}px`;
	}

	protected override _onWidth(widthInPixel: number): void {
		this._message.layout(this._heightInPixel, widthInPixel);
	}

	protected override _relayout(): void {
		super._relayout(this.computeRequiredHeight());
	}

	private computeRequiredHeight() {
		return 3 + this._message.getHeightInLines();
	}
}

// theming

const errorDefault = oneOf(editorErrorForeground, editorErrorBorder);
const warningDefault = oneOf(editorWarningForeground, editorWarningBorder);
const infoDefault = oneOf(editorInfoForeground, editorInfoBorder);

const editorMarkerNavigationError = registerColor('editorMarkerNavigationError.background', { dark: errorDefault, light: errorDefault, hcDark: contrastBorder, hcLight: contrastBorder }, nls.localize('editorMarkerNavigationError', 'Editor marker navigation widget error color.'));
const editorMarkerNavigationErrorHeader = registerColor('editorMarkerNavigationError.headerBackground', { dark: transparent(editorMarkerNavigationError, .1), light: transparent(editorMarkerNavigationError, .1), hcDark: null, hcLight: null }, nls.localize('editorMarkerNavigationErrorHeaderBackground', 'Editor marker navigation widget error heading background.'));

const editorMarkerNavigationWarning = registerColor('editorMarkerNavigationWarning.background', { dark: warningDefault, light: warningDefault, hcDark: contrastBorder, hcLight: contrastBorder }, nls.localize('editorMarkerNavigationWarning', 'Editor marker navigation widget warning color.'));
const editorMarkerNavigationWarningHeader = registerColor('editorMarkerNavigationWarning.headerBackground', { dark: transparent(editorMarkerNavigationWarning, .1), light: transparent(editorMarkerNavigationWarning, .1), hcDark: '#0C141F', hcLight: transparent(editorMarkerNavigationWarning, .2) }, nls.localize('editorMarkerNavigationWarningBackground', 'Editor marker navigation widget warning heading background.'));

const editorMarkerNavigationInfo = registerColor('editorMarkerNavigationInfo.background', { dark: infoDefault, light: infoDefault, hcDark: contrastBorder, hcLight: contrastBorder }, nls.localize('editorMarkerNavigationInfo', 'Editor marker navigation widget info color.'));
const editorMarkerNavigationInfoHeader = registerColor('editorMarkerNavigationInfo.headerBackground', { dark: transparent(editorMarkerNavigationInfo, .1), light: transparent(editorMarkerNavigationInfo, .1), hcDark: null, hcLight: null }, nls.localize('editorMarkerNavigationInfoHeaderBackground', 'Editor marker navigation widget info heading background.'));

const editorMarkerNavigationBackground = registerColor('editorMarkerNavigation.background', editorBackground, nls.localize('editorMarkerNavigationBackground', 'Editor marker navigation widget background.'));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/gotoError/browser/markerNavigationService.ts]---
Location: vscode-main/src/vs/editor/contrib/gotoError/browser/markerNavigationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { binarySearch2, equals } from '../../../../base/common/arrays.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { LinkedList } from '../../../../base/common/linkedList.js';
import { compare } from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { ITextModel } from '../../../common/model.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IMarker, IMarkerService, MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { isEqual } from '../../../../base/common/resources.js';

export class MarkerCoordinate {
	constructor(
		readonly marker: IMarker,
		readonly index: number,
		readonly total: number
	) { }
}

export class MarkerList {

	private readonly _onDidChange = new Emitter<void>();
	readonly onDidChange: Event<void> = this._onDidChange.event;

	private readonly _resourceFilter?: (uri: URI) => boolean;
	private readonly _dispoables = new DisposableStore();

	private _markers: IMarker[] = [];
	private _nextIdx: number = -1;

	constructor(
		resourceFilter: URI | ((uri: URI) => boolean) | undefined,
		@IMarkerService private readonly _markerService: IMarkerService,
		@IConfigurationService private readonly _configService: IConfigurationService,
	) {
		if (URI.isUri(resourceFilter)) {
			this._resourceFilter = uri => uri.toString() === resourceFilter.toString();
		} else if (resourceFilter) {
			this._resourceFilter = resourceFilter;
		}

		const compareOrder = this._configService.getValue<string>('problems.sortOrder');
		const compareMarker = (a: IMarker, b: IMarker): number => {
			let res = compare(a.resource.toString(), b.resource.toString());
			if (res === 0) {
				if (compareOrder === 'position') {
					res = Range.compareRangesUsingStarts(a, b) || MarkerSeverity.compare(a.severity, b.severity);
				} else {
					res = MarkerSeverity.compare(a.severity, b.severity) || Range.compareRangesUsingStarts(a, b);
				}
			}
			return res;
		};

		const updateMarker = () => {
			let newMarkers = this._markerService.read({
				resource: URI.isUri(resourceFilter) ? resourceFilter : undefined,
				severities: MarkerSeverity.Error | MarkerSeverity.Warning | MarkerSeverity.Info
			});
			if (typeof resourceFilter === 'function') {
				newMarkers = newMarkers.filter(m => this._resourceFilter!(m.resource));
			}
			newMarkers.sort(compareMarker);

			if (equals(newMarkers, this._markers, (a, b) =>
				a.resource.toString() === b.resource.toString()
				&& a.startLineNumber === b.startLineNumber
				&& a.startColumn === b.startColumn
				&& a.endLineNumber === b.endLineNumber
				&& a.endColumn === b.endColumn
				&& a.severity === b.severity
				&& a.message === b.message
			)) {
				return false;
			}

			this._markers = newMarkers;
			return true;
		};

		updateMarker();

		this._dispoables.add(_markerService.onMarkerChanged(uris => {
			if (!this._resourceFilter || uris.some(uri => this._resourceFilter!(uri))) {
				if (updateMarker()) {
					this._nextIdx = -1;
					this._onDidChange.fire();
				}
			}
		}));
	}

	dispose(): void {
		this._dispoables.dispose();
		this._onDidChange.dispose();
	}

	matches(uri: URI | undefined) {
		if (!this._resourceFilter && !uri) {
			return true;
		}
		if (!this._resourceFilter || !uri) {
			return false;
		}
		return this._resourceFilter(uri);
	}

	get selected(): MarkerCoordinate | undefined {
		const marker = this._markers[this._nextIdx];
		return marker && new MarkerCoordinate(marker, this._nextIdx + 1, this._markers.length);
	}

	private _initIdx(model: ITextModel, position: Position, fwd: boolean): void {

		let idx = this._markers.findIndex(marker => isEqual(marker.resource, model.uri));
		if (idx < 0) {
			// ignore model, position because this will be a different file
			idx = binarySearch2(this._markers.length, idx => compare(this._markers[idx].resource.toString(), model.uri.toString()));
			if (idx < 0) {
				idx = ~idx;
			}
			if (fwd) {
				this._nextIdx = idx;
			} else {
				this._nextIdx = (this._markers.length + idx - 1) % this._markers.length;
			}
		} else {
			// find marker for file
			let found = false;
			let wentPast = false;
			for (let i = idx; i < this._markers.length; i++) {
				let range = Range.lift(this._markers[i]);

				if (range.isEmpty()) {
					const word = model.getWordAtPosition(range.getStartPosition());
					if (word) {
						range = new Range(range.startLineNumber, word.startColumn, range.startLineNumber, word.endColumn);
					}
				}

				if (position && (range.containsPosition(position) || position.isBeforeOrEqual(range.getStartPosition()))) {
					this._nextIdx = i;
					found = true;
					wentPast = !range.containsPosition(position);
					break;
				}

				if (this._markers[i].resource.toString() !== model.uri.toString()) {
					break;
				}
			}

			if (!found) {
				// after the last change
				this._nextIdx = fwd ? 0 : this._markers.length - 1;
			} else if (wentPast && !fwd) {
				// we went past and have to go one back
				this._nextIdx -= 1;
			}
		}

		if (this._nextIdx < 0) {
			this._nextIdx = this._markers.length - 1;
		}
	}

	resetIndex() {
		this._nextIdx = -1;
	}

	move(fwd: boolean, model: ITextModel, position: Position): boolean {
		if (this._markers.length === 0) {
			return false;
		}

		const oldIdx = this._nextIdx;
		if (this._nextIdx === -1) {
			this._initIdx(model, position, fwd);
		} else if (fwd) {
			this._nextIdx = (this._nextIdx + 1) % this._markers.length;
		} else if (!fwd) {
			this._nextIdx = (this._nextIdx - 1 + this._markers.length) % this._markers.length;
		}

		if (oldIdx !== this._nextIdx) {
			return true;
		}
		return false;
	}

	find(uri: URI, position: Position): MarkerCoordinate | undefined {
		let idx = this._markers.findIndex(marker => marker.resource.toString() === uri.toString());
		if (idx < 0) {
			return undefined;
		}
		for (; idx < this._markers.length; idx++) {
			if (Range.containsPosition(this._markers[idx], position)) {
				return new MarkerCoordinate(this._markers[idx], idx + 1, this._markers.length);
			}
		}
		return undefined;
	}
}

export const IMarkerNavigationService = createDecorator<IMarkerNavigationService>('IMarkerNavigationService');

export interface IMarkerNavigationService {
	readonly _serviceBrand: undefined;
	registerProvider(provider: IMarkerListProvider): IDisposable;
	getMarkerList(resource: URI | undefined): MarkerList;
}

export interface IMarkerListProvider {
	getMarkerList(resource: URI | undefined): MarkerList | undefined;
}

class MarkerNavigationService implements IMarkerNavigationService, IMarkerListProvider {

	readonly _serviceBrand: undefined;

	private readonly _provider = new LinkedList<IMarkerListProvider>();

	constructor(
		@IMarkerService private readonly _markerService: IMarkerService,
		@IConfigurationService private readonly _configService: IConfigurationService,
	) { }

	registerProvider(provider: IMarkerListProvider): IDisposable {
		const remove = this._provider.unshift(provider);
		return toDisposable(() => remove());
	}

	getMarkerList(resource: URI | undefined): MarkerList {
		for (const provider of this._provider) {
			const result = provider.getMarkerList(resource);
			if (result) {
				return result;
			}
		}
		// default
		return new MarkerList(resource, this._markerService, this._configService);
	}
}

registerSingleton(IMarkerNavigationService, MarkerNavigationService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/gotoError/browser/media/gotoErrorWidget.css]---
Location: vscode-main/src/vs/editor/contrib/gotoError/browser/media/gotoErrorWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* marker zone */

.monaco-editor .peekview-widget .head .peekview-title .severity-icon {
	display: inline-block;
	vertical-align: text-top;
	margin-right: 4px;
}

.monaco-editor .marker-widget {
	text-overflow: ellipsis;
	white-space: nowrap;
}

.monaco-editor .marker-widget > .stale {
	opacity: 0.6;
	font-style: italic;
}

.monaco-editor .marker-widget .title {
	display: inline-block;
	padding-right: 5px;
}

.monaco-editor .marker-widget .descriptioncontainer {
	position: absolute;
	white-space: pre;
	user-select: text;
	-webkit-user-select: text;
	padding: 8px 12px 0 20px;
}

.monaco-editor .marker-widget .descriptioncontainer .message {
	display: flex;
	flex-direction: column;
}

.monaco-editor .marker-widget .descriptioncontainer .message .details {
	padding-left: 6px;
}

.monaco-editor .marker-widget .descriptioncontainer .message .source,
.monaco-editor .marker-widget .descriptioncontainer .message span.code {
	opacity: 0.6;
}

.monaco-editor .marker-widget .descriptioncontainer .message a.code-link {
	opacity: 0.6;
	color: inherit;
}

.monaco-editor .marker-widget .descriptioncontainer .message a.code-link:before {
	content: '(';
}

.monaco-editor .marker-widget .descriptioncontainer .message a.code-link:after {
	content: ')';
}

.monaco-editor .marker-widget .descriptioncontainer .message a.code-link > span {
	text-decoration: underline;
	/** Hack to force underline to show **/
	border-bottom: 1px solid transparent;
	text-underline-position: under;
	color: var(--vscode-textLink-activeForeground);
}

.monaco-editor .marker-widget .descriptioncontainer .filename {
	cursor: pointer;
	color: var(--vscode-textLink-activeForeground);
}
```

--------------------------------------------------------------------------------

````
