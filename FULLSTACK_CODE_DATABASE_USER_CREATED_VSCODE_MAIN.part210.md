---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 210
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 210 of 552)

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

---[FILE: src/vs/editor/common/core/ranges/lineRange.ts]---
Location: vscode-main/src/vs/editor/common/core/ranges/lineRange.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BugIndicatingError } from '../../../../base/common/errors.js';
import { OffsetRange } from './offsetRange.js';
import { IRange, Range } from '../range.js';
import { findFirstIdxMonotonousOrArrLen, findLastIdxMonotonous, findLastMonotonous } from '../../../../base/common/arraysFind.js';
import { Comparator, compareBy, numberComparator } from '../../../../base/common/arrays.js';

/**
 * A range of lines (1-based).
 */
export class LineRange {
	public static ofLength(startLineNumber: number, length: number): LineRange {
		return new LineRange(startLineNumber, startLineNumber + length);
	}

	public static fromRange(range: IRange): LineRange {
		return new LineRange(range.startLineNumber, range.endLineNumber);
	}

	public static fromRangeInclusive(range: IRange): LineRange {
		return new LineRange(range.startLineNumber, range.endLineNumber + 1);
	}

	public static readonly compareByStart: Comparator<LineRange> = compareBy(l => l.startLineNumber, numberComparator);

	public static subtract(a: LineRange, b: LineRange | undefined): LineRange[] {
		if (!b) {
			return [a];
		}
		if (a.startLineNumber < b.startLineNumber && b.endLineNumberExclusive < a.endLineNumberExclusive) {
			return [
				new LineRange(a.startLineNumber, b.startLineNumber),
				new LineRange(b.endLineNumberExclusive, a.endLineNumberExclusive)
			];
		} else if (b.startLineNumber <= a.startLineNumber && a.endLineNumberExclusive <= b.endLineNumberExclusive) {
			return [];
		} else if (b.endLineNumberExclusive < a.endLineNumberExclusive) {
			return [new LineRange(Math.max(b.endLineNumberExclusive, a.startLineNumber), a.endLineNumberExclusive)];
		} else {
			return [new LineRange(a.startLineNumber, Math.min(b.startLineNumber, a.endLineNumberExclusive))];
		}
	}

	/**
	 * @param lineRanges An array of arrays of of sorted line ranges.
	 */
	public static joinMany(lineRanges: readonly (readonly LineRange[])[]): readonly LineRange[] {
		if (lineRanges.length === 0) {
			return [];
		}
		let result = new LineRangeSet(lineRanges[0].slice());
		for (let i = 1; i < lineRanges.length; i++) {
			result = result.getUnion(new LineRangeSet(lineRanges[i].slice()));
		}
		return result.ranges;
	}

	public static join(lineRanges: LineRange[]): LineRange {
		if (lineRanges.length === 0) {
			throw new BugIndicatingError('lineRanges cannot be empty');
		}
		let startLineNumber = lineRanges[0].startLineNumber;
		let endLineNumberExclusive = lineRanges[0].endLineNumberExclusive;
		for (let i = 1; i < lineRanges.length; i++) {
			startLineNumber = Math.min(startLineNumber, lineRanges[i].startLineNumber);
			endLineNumberExclusive = Math.max(endLineNumberExclusive, lineRanges[i].endLineNumberExclusive);
		}
		return new LineRange(startLineNumber, endLineNumberExclusive);
	}

	/**
	 * @internal
	 */
	public static deserialize(lineRange: ISerializedLineRange): LineRange {
		return new LineRange(lineRange[0], lineRange[1]);
	}

	/**
	 * The start line number.
	 */
	public readonly startLineNumber: number;

	/**
	 * The end line number (exclusive).
	 */
	public readonly endLineNumberExclusive: number;

	constructor(
		startLineNumber: number,
		endLineNumberExclusive: number,
	) {
		if (startLineNumber > endLineNumberExclusive) {
			throw new BugIndicatingError(`startLineNumber ${startLineNumber} cannot be after endLineNumberExclusive ${endLineNumberExclusive}`);
		}
		this.startLineNumber = startLineNumber;
		this.endLineNumberExclusive = endLineNumberExclusive;
	}

	/**
	 * Indicates if this line range contains the given line number.
	 */
	public contains(lineNumber: number): boolean {
		return this.startLineNumber <= lineNumber && lineNumber < this.endLineNumberExclusive;
	}

	public containsRange(range: LineRange): boolean {
		return this.startLineNumber <= range.startLineNumber && range.endLineNumberExclusive <= this.endLineNumberExclusive;
	}

	/**
	 * Indicates if this line range is empty.
	 */
	get isEmpty(): boolean {
		return this.startLineNumber === this.endLineNumberExclusive;
	}

	/**
	 * Moves this line range by the given offset of line numbers.
	 */
	public delta(offset: number): LineRange {
		return new LineRange(this.startLineNumber + offset, this.endLineNumberExclusive + offset);
	}

	public deltaLength(offset: number): LineRange {
		return new LineRange(this.startLineNumber, this.endLineNumberExclusive + offset);
	}

	/**
	 * The number of lines this line range spans.
	 */
	public get length(): number {
		return this.endLineNumberExclusive - this.startLineNumber;
	}

	/**
	 * Creates a line range that combines this and the given line range.
	 */
	public join(other: LineRange): LineRange {
		return new LineRange(
			Math.min(this.startLineNumber, other.startLineNumber),
			Math.max(this.endLineNumberExclusive, other.endLineNumberExclusive)
		);
	}

	public toString(): string {
		return `[${this.startLineNumber},${this.endLineNumberExclusive})`;
	}

	/**
	 * The resulting range is empty if the ranges do not intersect, but touch.
	 * If the ranges don't even touch, the result is undefined.
	 */
	public intersect(other: LineRange): LineRange | undefined {
		const startLineNumber = Math.max(this.startLineNumber, other.startLineNumber);
		const endLineNumberExclusive = Math.min(this.endLineNumberExclusive, other.endLineNumberExclusive);
		if (startLineNumber <= endLineNumberExclusive) {
			return new LineRange(startLineNumber, endLineNumberExclusive);
		}
		return undefined;
	}

	public intersectsStrict(other: LineRange): boolean {
		return this.startLineNumber < other.endLineNumberExclusive && other.startLineNumber < this.endLineNumberExclusive;
	}

	public intersectsOrTouches(other: LineRange): boolean {
		return this.startLineNumber <= other.endLineNumberExclusive && other.startLineNumber <= this.endLineNumberExclusive;
	}

	public equals(b: LineRange): boolean {
		return this.startLineNumber === b.startLineNumber && this.endLineNumberExclusive === b.endLineNumberExclusive;
	}

	public toInclusiveRange(): Range | null {
		if (this.isEmpty) {
			return null;
		}
		return new Range(this.startLineNumber, 1, this.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER);
	}

	/**
	 * @deprecated Using this function is discouraged because it might lead to bugs: The end position is not guaranteed to be a valid position!
	*/
	public toExclusiveRange(): Range {
		return new Range(this.startLineNumber, 1, this.endLineNumberExclusive, 1);
	}

	public mapToLineArray<T>(f: (lineNumber: number) => T): T[] {
		const result: T[] = [];
		for (let lineNumber = this.startLineNumber; lineNumber < this.endLineNumberExclusive; lineNumber++) {
			result.push(f(lineNumber));
		}
		return result;
	}

	public forEach(f: (lineNumber: number) => void): void {
		for (let lineNumber = this.startLineNumber; lineNumber < this.endLineNumberExclusive; lineNumber++) {
			f(lineNumber);
		}
	}

	/**
	 * @internal
	 */
	public serialize(): ISerializedLineRange {
		return [this.startLineNumber, this.endLineNumberExclusive];
	}

	/**
	 * Converts this 1-based line range to a 0-based offset range (subtracts 1!).
	 * @internal
	 */
	public toOffsetRange(): OffsetRange {
		return new OffsetRange(this.startLineNumber - 1, this.endLineNumberExclusive - 1);
	}

	public distanceToRange(other: LineRange): number {
		if (this.endLineNumberExclusive <= other.startLineNumber) {
			return other.startLineNumber - this.endLineNumberExclusive;
		}
		if (other.endLineNumberExclusive <= this.startLineNumber) {
			return this.startLineNumber - other.endLineNumberExclusive;
		}
		return 0;
	}

	public distanceToLine(lineNumber: number): number {
		if (this.contains(lineNumber)) {
			return 0;
		}
		if (lineNumber < this.startLineNumber) {
			return this.startLineNumber - lineNumber;
		}
		return lineNumber - this.endLineNumberExclusive;
	}

	public addMargin(marginTop: number, marginBottom: number): LineRange {
		return new LineRange(
			this.startLineNumber - marginTop,
			this.endLineNumberExclusive + marginBottom
		);
	}
}

export type ISerializedLineRange = [startLineNumber: number, endLineNumberExclusive: number];


export class LineRangeSet {
	constructor(
		/**
		 * Sorted by start line number.
		 * No two line ranges are touching or intersecting.
		 */
		private readonly _normalizedRanges: LineRange[] = []
	) {
	}

	get ranges(): readonly LineRange[] {
		return this._normalizedRanges;
	}

	addRange(range: LineRange): void {
		if (range.length === 0) {
			return;
		}

		// Idea: Find joinRange such that:
		// replaceRange = _normalizedRanges.replaceRange(joinRange, range.joinAll(joinRange.map(idx => this._normalizedRanges[idx])))

		// idx of first element that touches range or that is after range
		const joinRangeStartIdx = findFirstIdxMonotonousOrArrLen(this._normalizedRanges, r => r.endLineNumberExclusive >= range.startLineNumber);
		// idx of element after { last element that touches range or that is before range }
		const joinRangeEndIdxExclusive = findLastIdxMonotonous(this._normalizedRanges, r => r.startLineNumber <= range.endLineNumberExclusive) + 1;

		if (joinRangeStartIdx === joinRangeEndIdxExclusive) {
			// If there is no element that touches range, then joinRangeStartIdx === joinRangeEndIdxExclusive and that value is the index of the element after range
			this._normalizedRanges.splice(joinRangeStartIdx, 0, range);
		} else if (joinRangeStartIdx === joinRangeEndIdxExclusive - 1) {
			// Else, there is an element that touches range and in this case it is both the first and last element. Thus we can replace it
			const joinRange = this._normalizedRanges[joinRangeStartIdx];
			this._normalizedRanges[joinRangeStartIdx] = joinRange.join(range);
		} else {
			// First and last element are different - we need to replace the entire range
			const joinRange = this._normalizedRanges[joinRangeStartIdx].join(this._normalizedRanges[joinRangeEndIdxExclusive - 1]).join(range);
			this._normalizedRanges.splice(joinRangeStartIdx, joinRangeEndIdxExclusive - joinRangeStartIdx, joinRange);
		}
	}

	contains(lineNumber: number): boolean {
		const rangeThatStartsBeforeEnd = findLastMonotonous(this._normalizedRanges, r => r.startLineNumber <= lineNumber);
		return !!rangeThatStartsBeforeEnd && rangeThatStartsBeforeEnd.endLineNumberExclusive > lineNumber;
	}

	intersects(range: LineRange): boolean {
		const rangeThatStartsBeforeEnd = findLastMonotonous(this._normalizedRanges, r => r.startLineNumber < range.endLineNumberExclusive);
		return !!rangeThatStartsBeforeEnd && rangeThatStartsBeforeEnd.endLineNumberExclusive > range.startLineNumber;
	}

	getUnion(other: LineRangeSet): LineRangeSet {
		if (this._normalizedRanges.length === 0) {
			return other;
		}
		if (other._normalizedRanges.length === 0) {
			return this;
		}

		const result: LineRange[] = [];
		let i1 = 0;
		let i2 = 0;
		let current: LineRange | null = null;
		while (i1 < this._normalizedRanges.length || i2 < other._normalizedRanges.length) {
			let next: LineRange | null = null;
			if (i1 < this._normalizedRanges.length && i2 < other._normalizedRanges.length) {
				const lineRange1 = this._normalizedRanges[i1];
				const lineRange2 = other._normalizedRanges[i2];
				if (lineRange1.startLineNumber < lineRange2.startLineNumber) {
					next = lineRange1;
					i1++;
				} else {
					next = lineRange2;
					i2++;
				}
			} else if (i1 < this._normalizedRanges.length) {
				next = this._normalizedRanges[i1];
				i1++;
			} else {
				next = other._normalizedRanges[i2];
				i2++;
			}

			if (current === null) {
				current = next;
			} else {
				if (current.endLineNumberExclusive >= next.startLineNumber) {
					// merge
					current = new LineRange(current.startLineNumber, Math.max(current.endLineNumberExclusive, next.endLineNumberExclusive));
				} else {
					// push
					result.push(current);
					current = next;
				}
			}
		}
		if (current !== null) {
			result.push(current);
		}
		return new LineRangeSet(result);
	}

	/**
	 * Subtracts all ranges in this set from `range` and returns the result.
	 */
	subtractFrom(range: LineRange): LineRangeSet {
		// idx of first element that touches range or that is after range
		const joinRangeStartIdx = findFirstIdxMonotonousOrArrLen(this._normalizedRanges, r => r.endLineNumberExclusive >= range.startLineNumber);
		// idx of element after { last element that touches range or that is before range }
		const joinRangeEndIdxExclusive = findLastIdxMonotonous(this._normalizedRanges, r => r.startLineNumber <= range.endLineNumberExclusive) + 1;

		if (joinRangeStartIdx === joinRangeEndIdxExclusive) {
			return new LineRangeSet([range]);
		}

		const result: LineRange[] = [];
		let startLineNumber = range.startLineNumber;
		for (let i = joinRangeStartIdx; i < joinRangeEndIdxExclusive; i++) {
			const r = this._normalizedRanges[i];
			if (r.startLineNumber > startLineNumber) {
				result.push(new LineRange(startLineNumber, r.startLineNumber));
			}
			startLineNumber = r.endLineNumberExclusive;
		}
		if (startLineNumber < range.endLineNumberExclusive) {
			result.push(new LineRange(startLineNumber, range.endLineNumberExclusive));
		}

		return new LineRangeSet(result);
	}

	toString() {
		return this._normalizedRanges.map(r => r.toString()).join(', ');
	}

	getIntersection(other: LineRangeSet): LineRangeSet {
		const result: LineRange[] = [];

		let i1 = 0;
		let i2 = 0;
		while (i1 < this._normalizedRanges.length && i2 < other._normalizedRanges.length) {
			const r1 = this._normalizedRanges[i1];
			const r2 = other._normalizedRanges[i2];

			const i = r1.intersect(r2);
			if (i && !i.isEmpty) {
				result.push(i);
			}

			if (r1.endLineNumberExclusive < r2.endLineNumberExclusive) {
				i1++;
			} else {
				i2++;
			}
		}

		return new LineRangeSet(result);
	}

	getWithDelta(value: number): LineRangeSet {
		return new LineRangeSet(this._normalizedRanges.map(r => r.delta(value)));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/ranges/offsetRange.ts]---
Location: vscode-main/src/vs/editor/common/core/ranges/offsetRange.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BugIndicatingError } from '../../../../base/common/errors.js';

export interface IOffsetRange {
	readonly start: number;
	readonly endExclusive: number;
}

/**
 * A range of offsets (0-based).
*/
export class OffsetRange implements IOffsetRange {
	public static fromTo(start: number, endExclusive: number): OffsetRange {
		return new OffsetRange(start, endExclusive);
	}

	public static addRange(range: OffsetRange, sortedRanges: OffsetRange[]): void {
		let i = 0;
		while (i < sortedRanges.length && sortedRanges[i].endExclusive < range.start) {
			i++;
		}
		let j = i;
		while (j < sortedRanges.length && sortedRanges[j].start <= range.endExclusive) {
			j++;
		}
		if (i === j) {
			sortedRanges.splice(i, 0, range);
		} else {
			const start = Math.min(range.start, sortedRanges[i].start);
			const end = Math.max(range.endExclusive, sortedRanges[j - 1].endExclusive);
			sortedRanges.splice(i, j - i, new OffsetRange(start, end));
		}
	}

	public static tryCreate(start: number, endExclusive: number): OffsetRange | undefined {
		if (start > endExclusive) {
			return undefined;
		}
		return new OffsetRange(start, endExclusive);
	}

	public static ofLength(length: number): OffsetRange {
		return new OffsetRange(0, length);
	}

	public static ofStartAndLength(start: number, length: number): OffsetRange {
		return new OffsetRange(start, start + length);
	}

	public static emptyAt(offset: number): OffsetRange {
		return new OffsetRange(offset, offset);
	}

	constructor(public readonly start: number, public readonly endExclusive: number) {
		if (start > endExclusive) {
			throw new BugIndicatingError(`Invalid range: ${this.toString()}`);
		}
	}

	get isEmpty(): boolean {
		return this.start === this.endExclusive;
	}

	public delta(offset: number): OffsetRange {
		return new OffsetRange(this.start + offset, this.endExclusive + offset);
	}

	public deltaStart(offset: number): OffsetRange {
		return new OffsetRange(this.start + offset, this.endExclusive);
	}

	public deltaEnd(offset: number): OffsetRange {
		return new OffsetRange(this.start, this.endExclusive + offset);
	}

	public get length(): number {
		return this.endExclusive - this.start;
	}

	public toString() {
		return `[${this.start}, ${this.endExclusive})`;
	}

	public equals(other: OffsetRange): boolean {
		return this.start === other.start && this.endExclusive === other.endExclusive;
	}

	public containsRange(other: OffsetRange): boolean {
		return this.start <= other.start && other.endExclusive <= this.endExclusive;
	}

	public contains(offset: number): boolean {
		return this.start <= offset && offset < this.endExclusive;
	}

	/**
	 * for all numbers n: range1.contains(n) or range2.contains(n) => range1.join(range2).contains(n)
	 * The joined range is the smallest range that contains both ranges.
	 */
	public join(other: OffsetRange): OffsetRange {
		return new OffsetRange(Math.min(this.start, other.start), Math.max(this.endExclusive, other.endExclusive));
	}

	/**
	 * for all numbers n: range1.contains(n) and range2.contains(n) <=> range1.intersect(range2).contains(n)
	 *
	 * The resulting range is empty if the ranges do not intersect, but touch.
	 * If the ranges don't even touch, the result is undefined.
	 */
	public intersect(other: OffsetRange): OffsetRange | undefined {
		const start = Math.max(this.start, other.start);
		const end = Math.min(this.endExclusive, other.endExclusive);
		if (start <= end) {
			return new OffsetRange(start, end);
		}
		return undefined;
	}

	public intersectionLength(range: OffsetRange): number {
		const start = Math.max(this.start, range.start);
		const end = Math.min(this.endExclusive, range.endExclusive);
		return Math.max(0, end - start);
	}

	public intersects(other: OffsetRange): boolean {
		const start = Math.max(this.start, other.start);
		const end = Math.min(this.endExclusive, other.endExclusive);
		return start < end;
	}

	public intersectsOrTouches(other: OffsetRange): boolean {
		const start = Math.max(this.start, other.start);
		const end = Math.min(this.endExclusive, other.endExclusive);
		return start <= end;
	}

	public isBefore(other: OffsetRange): boolean {
		return this.endExclusive <= other.start;
	}

	public isAfter(other: OffsetRange): boolean {
		return this.start >= other.endExclusive;
	}

	public slice<T>(arr: readonly T[]): T[] {
		return arr.slice(this.start, this.endExclusive);
	}

	public substring(str: string): string {
		return str.substring(this.start, this.endExclusive);
	}

	/**
	 * Returns the given value if it is contained in this instance, otherwise the closest value that is contained.
	 * The range must not be empty.
	 */
	public clip(value: number): number {
		if (this.isEmpty) {
			throw new BugIndicatingError(`Invalid clipping range: ${this.toString()}`);
		}
		return Math.max(this.start, Math.min(this.endExclusive - 1, value));
	}

	/**
	 * Returns `r := value + k * length` such that `r` is contained in this range.
	 * The range must not be empty.
	 *
	 * E.g. `[5, 10).clipCyclic(10) === 5`, `[5, 10).clipCyclic(11) === 6` and `[5, 10).clipCyclic(4) === 9`.
	 */
	public clipCyclic(value: number): number {
		if (this.isEmpty) {
			throw new BugIndicatingError(`Invalid clipping range: ${this.toString()}`);
		}
		if (value < this.start) {
			return this.endExclusive - ((this.start - value) % this.length);
		}
		if (value >= this.endExclusive) {
			return this.start + ((value - this.start) % this.length);
		}
		return value;
	}

	public map<T>(f: (offset: number) => T): T[] {
		const result: T[] = [];
		for (let i = this.start; i < this.endExclusive; i++) {
			result.push(f(i));
		}
		return result;
	}

	public forEach(f: (offset: number) => void): void {
		for (let i = this.start; i < this.endExclusive; i++) {
			f(i);
		}
	}

	/**
	 * this: [ 5, 10), range: [10, 15) => [5, 15)]
	 * Throws if the ranges are not touching.
	*/
	public joinRightTouching(range: OffsetRange): OffsetRange {
		if (this.endExclusive !== range.start) {
			throw new BugIndicatingError(`Invalid join: ${this.toString()} and ${range.toString()}`);
		}
		return new OffsetRange(this.start, range.endExclusive);
	}

	public withMargin(margin: number): OffsetRange;
	public withMargin(marginStart: number, marginEnd: number): OffsetRange;
	public withMargin(marginStart: number, marginEnd?: number): OffsetRange {
		if (marginEnd === undefined) {
			marginEnd = marginStart;
		}
		return new OffsetRange(this.start - marginStart, this.endExclusive + marginEnd);
	}
}

export class OffsetRangeSet {
	private readonly _sortedRanges: OffsetRange[] = [];

	public get ranges(): OffsetRange[] {
		return [...this._sortedRanges];
	}

	public addRange(range: OffsetRange): void {
		let i = 0;
		while (i < this._sortedRanges.length && this._sortedRanges[i].endExclusive < range.start) {
			i++;
		}
		let j = i;
		while (j < this._sortedRanges.length && this._sortedRanges[j].start <= range.endExclusive) {
			j++;
		}
		if (i === j) {
			this._sortedRanges.splice(i, 0, range);
		} else {
			const start = Math.min(range.start, this._sortedRanges[i].start);
			const end = Math.max(range.endExclusive, this._sortedRanges[j - 1].endExclusive);
			this._sortedRanges.splice(i, j - i, new OffsetRange(start, end));
		}
	}

	public toString(): string {
		return this._sortedRanges.map(r => r.toString()).join(', ');
	}

	/**
	 * Returns of there is a value that is contained in this instance and the given range.
	 */
	public intersectsStrict(other: OffsetRange): boolean {
		// TODO use binary search
		let i = 0;
		while (i < this._sortedRanges.length && this._sortedRanges[i].endExclusive <= other.start) {
			i++;
		}
		return i < this._sortedRanges.length && this._sortedRanges[i].start < other.endExclusive;
	}

	public intersectWithRange(other: OffsetRange): OffsetRangeSet {
		// TODO use binary search + slice
		const result = new OffsetRangeSet();
		for (const range of this._sortedRanges) {
			const intersection = range.intersect(other);
			if (intersection) {
				result.addRange(intersection);
			}
		}
		return result;
	}

	public intersectWithRangeLength(other: OffsetRange): number {
		return this.intersectWithRange(other).length;
	}

	public get length(): number {
		return this._sortedRanges.reduce((prev, cur) => prev + cur.length, 0);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/ranges/rangeMapping.ts]---
Location: vscode-main/src/vs/editor/common/core/ranges/rangeMapping.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { findLastMonotonous } from '../../../../base/common/arraysFind.js';
import { Position } from '../position.js';
import { Range } from '../range.js';
import { TextLength } from '../text/textLength.js';

/**
 * Represents a list of mappings of ranges from one document to another.
 */
export class RangeMapping {
	constructor(public readonly mappings: readonly SingleRangeMapping[]) {
	}

	mapPosition(position: Position): PositionOrRange {
		const mapping = findLastMonotonous(this.mappings, m => m.original.getStartPosition().isBeforeOrEqual(position));
		if (!mapping) {
			return PositionOrRange.position(position);
		}
		if (mapping.original.containsPosition(position)) {
			return PositionOrRange.range(mapping.modified);
		}
		const l = TextLength.betweenPositions(mapping.original.getEndPosition(), position);
		return PositionOrRange.position(l.addToPosition(mapping.modified.getEndPosition()));
	}

	mapRange(range: Range): Range {
		const start = this.mapPosition(range.getStartPosition());
		const end = this.mapPosition(range.getEndPosition());
		return Range.fromPositions(
			start.range?.getStartPosition() ?? start.position!,
			end.range?.getEndPosition() ?? end.position!,
		);
	}

	reverse(): RangeMapping {
		return new RangeMapping(this.mappings.map(mapping => mapping.reverse()));
	}
}

export class SingleRangeMapping {
	constructor(
		public readonly original: Range,
		public readonly modified: Range,
	) {
	}

	reverse(): SingleRangeMapping {
		return new SingleRangeMapping(this.modified, this.original);
	}

	toString() {
		return `${this.original.toString()} -> ${this.modified.toString()}`;
	}
}

export class PositionOrRange {
	public static position(position: Position): PositionOrRange {
		return new PositionOrRange(position, undefined);
	}

	public static range(range: Range): PositionOrRange {
		return new PositionOrRange(undefined, range);
	}

	private constructor(
		public readonly position: Position | undefined,
		public readonly range: Range | undefined,
	) { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/ranges/rangeSingleLine.ts]---
Location: vscode-main/src/vs/editor/common/core/ranges/rangeSingleLine.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ColumnRange } from './columnRange.js';
import { Range } from '../range.js';

/**
 * Represents a column range in a single line.
*/
export class RangeSingleLine {
	public static fromRange(range: Range): RangeSingleLine | undefined {
		if (range.endLineNumber !== range.startLineNumber) {
			return undefined;
		}
		return new RangeSingleLine(range.startLineNumber, new ColumnRange(range.startColumn, range.endColumn));
	}

	constructor(
		/** 1-based */
		public readonly lineNumber: number,
		public readonly columnRange: ColumnRange,
	) { }

	toRange(): Range {
		return new Range(this.lineNumber, this.columnRange.startColumn, this.lineNumber, this.columnRange.endColumnExclusive);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/text/abstractText.ts]---
Location: vscode-main/src/vs/editor/common/core/text/abstractText.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assert } from '../../../../base/common/assert.js';
import { splitLines } from '../../../../base/common/strings.js';
import { Position } from '../position.js';
import { Range } from '../range.js';
import { LineRange } from '../ranges/lineRange.js';
import { OffsetRange } from '../ranges/offsetRange.js';
import { TextLength } from '../text/textLength.js';
import { PositionOffsetTransformer } from './positionToOffsetImpl.js';

export abstract class AbstractText {
	abstract getValueOfRange(range: Range): string;
	abstract readonly length: TextLength;

	get endPositionExclusive(): Position {
		return this.length.addToPosition(new Position(1, 1));
	}

	get lineRange(): LineRange {
		return this.length.toLineRange();
	}

	getValue(): string {
		return this.getValueOfRange(this.length.toRange());
	}

	getValueOfOffsetRange(range: OffsetRange): string {
		return this.getValueOfRange(this.getTransformer().getRange(range));
	}

	getLineLength(lineNumber: number): number {
		return this.getValueOfRange(new Range(lineNumber, 1, lineNumber, Number.MAX_SAFE_INTEGER)).length;
	}

	private _transformer: PositionOffsetTransformer | undefined = undefined;

	getTransformer(): PositionOffsetTransformer {
		if (!this._transformer) {
			this._transformer = new PositionOffsetTransformer(this.getValue());
		}
		return this._transformer;
	}

	getLineAt(lineNumber: number): string {
		return this.getValueOfRange(new Range(lineNumber, 1, lineNumber, Number.MAX_SAFE_INTEGER));
	}

	getLines(): string[] {
		const value = this.getValue();
		return splitLines(value);
	}

	getLinesOfRange(range: LineRange): string[] {
		return range.mapToLineArray(lineNumber => this.getLineAt(lineNumber));
	}

	equals(other: AbstractText): boolean {
		if (this === other) {
			return true;
		}
		return this.getValue() === other.getValue();
	}
}

export class LineBasedText extends AbstractText {
	constructor(
		private readonly _getLineContent: (lineNumber: number) => string,
		private readonly _lineCount: number
	) {
		assert(_lineCount >= 1);

		super();
	}

	override getValueOfRange(range: Range): string {
		if (range.startLineNumber === range.endLineNumber) {
			return this._getLineContent(range.startLineNumber).substring(range.startColumn - 1, range.endColumn - 1);
		}
		let result = this._getLineContent(range.startLineNumber).substring(range.startColumn - 1);
		for (let i = range.startLineNumber + 1; i < range.endLineNumber; i++) {
			result += '\n' + this._getLineContent(i);
		}
		result += '\n' + this._getLineContent(range.endLineNumber).substring(0, range.endColumn - 1);
		return result;
	}

	override getLineLength(lineNumber: number): number {
		return this._getLineContent(lineNumber).length;
	}

	get length(): TextLength {
		const lastLine = this._getLineContent(this._lineCount);
		return new TextLength(this._lineCount - 1, lastLine.length);
	}
}

export class ArrayText extends LineBasedText {
	constructor(lines: string[]) {
		super(
			lineNumber => lines[lineNumber - 1],
			lines.length
		);
	}
}

export class StringText extends AbstractText {
	private readonly _t;

	constructor(public readonly value: string) {
		super();
		this._t = new PositionOffsetTransformer(this.value);
	}

	getValueOfRange(range: Range): string {
		return this._t.getOffsetRange(range).substring(this.value);
	}

	get length(): TextLength {
		return this._t.textLength;
	}

	// Override the getTransformer method to return the cached transformer
	override getTransformer() {
		return this._t;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/text/getPositionOffsetTransformerFromTextModel.ts]---
Location: vscode-main/src/vs/editor/common/core/text/getPositionOffsetTransformerFromTextModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITextModel } from '../../model.js';
import { Position } from '../position.js';
import { PositionOffsetTransformerBase } from './positionToOffset.js';

export function getPositionOffsetTransformerFromTextModel(textModel: ITextModel): PositionOffsetTransformerBase {
	return new PositionOffsetTransformerWithTextModel(textModel);
}

class PositionOffsetTransformerWithTextModel extends PositionOffsetTransformerBase {
	constructor(private readonly _textModel: ITextModel) {
		super();
	}

	override getOffset(position: Position): number {
		return this._textModel.getOffsetAt(position);
	}

	override getPosition(offset: number): Position {
		return this._textModel.getPositionAt(offset);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/text/positionToOffset.ts]---
Location: vscode-main/src/vs/editor/common/core/text/positionToOffset.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { StringEdit, StringReplacement } from '../edits/stringEdit.js';
import { TextEdit, TextReplacement } from '../edits/textEdit.js';
import { _setPositionOffsetTransformerDependencies } from './positionToOffsetImpl.js';
import { TextLength } from './textLength.js';

export { PositionOffsetTransformerBase, PositionOffsetTransformer } from './positionToOffsetImpl.js';

_setPositionOffsetTransformerDependencies({
	StringEdit: StringEdit,
	StringReplacement: StringReplacement,
	TextReplacement: TextReplacement,
	TextEdit: TextEdit,
	TextLength: TextLength,
});

// TODO@hediet this is dept and needs to go. See https://github.com/microsoft/vscode/issues/251126.
export function ensureDependenciesAreSet(): void {
	// Noop
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/text/positionToOffsetImpl.ts]---
Location: vscode-main/src/vs/editor/common/core/text/positionToOffsetImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { findLastIdxMonotonous } from '../../../../base/common/arraysFind.js';
import { StringEdit, StringReplacement } from '../edits/stringEdit.js';
import { OffsetRange } from '../ranges/offsetRange.js';
import { Position } from '../position.js';
import { Range } from '../range.js';
import type { TextReplacement, TextEdit } from '../edits/textEdit.js';
import type { TextLength } from '../text/textLength.js';

export abstract class PositionOffsetTransformerBase {
	abstract getOffset(position: Position): number;

	getOffsetRange(range: Range): OffsetRange {
		return new OffsetRange(
			this.getOffset(range.getStartPosition()),
			this.getOffset(range.getEndPosition())
		);
	}

	abstract getPosition(offset: number): Position;

	getRange(offsetRange: OffsetRange): Range {
		return Range.fromPositions(
			this.getPosition(offsetRange.start),
			this.getPosition(offsetRange.endExclusive)
		);
	}

	getStringEdit(edit: TextEdit): StringEdit {
		const edits = edit.replacements.map(e => this.getStringReplacement(e));
		return new Deps.deps.StringEdit(edits);
	}

	getStringReplacement(edit: TextReplacement): StringReplacement {
		return new Deps.deps.StringReplacement(this.getOffsetRange(edit.range), edit.text);
	}

	getTextReplacement(edit: StringReplacement): TextReplacement {
		return new Deps.deps.TextReplacement(this.getRange(edit.replaceRange), edit.newText);
	}

	getTextEdit(edit: StringEdit): TextEdit {
		const edits = edit.replacements.map(e => this.getTextReplacement(e));
		return new Deps.deps.TextEdit(edits);
	}
}

interface IDeps {
	StringEdit: typeof StringEdit;
	StringReplacement: typeof StringReplacement;
	TextReplacement: typeof TextReplacement;
	TextEdit: typeof TextEdit;
	TextLength: typeof TextLength;
}

class Deps {
	static _deps: IDeps | undefined = undefined;
	static get deps(): IDeps {
		if (!this._deps) {
			throw new Error('Dependencies not set. Call _setDependencies first.');
		}
		return this._deps;
	}
}

/** This is to break circular module dependencies. */
export function _setPositionOffsetTransformerDependencies(deps: IDeps): void {
	Deps._deps = deps;
}

export class PositionOffsetTransformer extends PositionOffsetTransformerBase {
	private _lineStartOffsetByLineIdx: number[] | undefined;
	private _lineEndOffsetByLineIdx: number[] | undefined;

	constructor(public readonly text: string) {
		super();
	}

	private get lineStartOffsetByLineIdx(): number[] {
		if (!this._lineStartOffsetByLineIdx) {
			this._computeLineOffsets();
		}
		return this._lineStartOffsetByLineIdx!;
	}

	private get lineEndOffsetByLineIdx(): number[] {
		if (!this._lineEndOffsetByLineIdx) {
			this._computeLineOffsets();
		}
		return this._lineEndOffsetByLineIdx!;
	}

	private _computeLineOffsets(): void {
		this._lineStartOffsetByLineIdx = [];
		this._lineEndOffsetByLineIdx = [];

		this._lineStartOffsetByLineIdx.push(0);
		for (let i = 0; i < this.text.length; i++) {
			if (this.text.charAt(i) === '\n') {
				this._lineStartOffsetByLineIdx.push(i + 1);
				if (i > 0 && this.text.charAt(i - 1) === '\r') {
					this._lineEndOffsetByLineIdx.push(i - 1);
				} else {
					this._lineEndOffsetByLineIdx.push(i);
				}
			}
		}
		this._lineEndOffsetByLineIdx.push(this.text.length);
	}

	override getOffset(position: Position): number {
		const valPos = this._validatePosition(position);
		return this.lineStartOffsetByLineIdx[valPos.lineNumber - 1] + valPos.column - 1;
	}

	private _validatePosition(position: Position): Position {
		if (position.lineNumber < 1) {
			return new Position(1, 1);
		}
		const lineCount = this.textLength.lineCount + 1;
		if (position.lineNumber > lineCount) {
			const lineLength = this.getLineLength(lineCount);
			return new Position(lineCount, lineLength + 1);
		}
		if (position.column < 1) {
			return new Position(position.lineNumber, 1);
		}
		const lineLength = this.getLineLength(position.lineNumber);
		if (position.column - 1 > lineLength) {
			return new Position(position.lineNumber, lineLength + 1);
		}
		return position;
	}

	override getPosition(offset: number): Position {
		const idx = findLastIdxMonotonous(this.lineStartOffsetByLineIdx, i => i <= offset);
		const lineNumber = idx + 1;
		const column = offset - this.lineStartOffsetByLineIdx[idx] + 1;
		return new Position(lineNumber, column);
	}

	getTextLength(offsetRange: OffsetRange): TextLength {
		return Deps.deps.TextLength.ofRange(this.getRange(offsetRange));
	}

	get textLength(): TextLength {
		const lineIdx = this.lineStartOffsetByLineIdx.length - 1;
		return new Deps.deps.TextLength(lineIdx, this.text.length - this.lineStartOffsetByLineIdx[lineIdx]);
	}

	getLineLength(lineNumber: number): number {
		return this.lineEndOffsetByLineIdx[lineNumber - 1] - this.lineStartOffsetByLineIdx[lineNumber - 1];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/text/textLength.ts]---
Location: vscode-main/src/vs/editor/common/core/text/textLength.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { LineRange } from '../ranges/lineRange.js';
import { Position } from '../position.js';
import { Range } from '../range.js';
import { OffsetRange } from '../ranges/offsetRange.js';

/**
 * Represents a non-negative length of text in terms of line and column count.
*/
export class TextLength {
	public static zero = new TextLength(0, 0);

	public static lengthDiffNonNegative(start: TextLength, end: TextLength): TextLength {
		if (end.isLessThan(start)) {
			return TextLength.zero;
		}
		if (start.lineCount === end.lineCount) {
			return new TextLength(0, end.columnCount - start.columnCount);
		} else {
			return new TextLength(end.lineCount - start.lineCount, end.columnCount);
		}
	}

	public static betweenPositions(position1: Position, position2: Position): TextLength {
		if (position1.lineNumber === position2.lineNumber) {
			return new TextLength(0, position2.column - position1.column);
		} else {
			return new TextLength(position2.lineNumber - position1.lineNumber, position2.column - 1);
		}
	}

	public static fromPosition(pos: Position): TextLength {
		return new TextLength(pos.lineNumber - 1, pos.column - 1);
	}

	public static ofRange(range: Range) {
		return TextLength.betweenPositions(range.getStartPosition(), range.getEndPosition());
	}

	public static ofText(text: string): TextLength {
		let line = 0;
		let column = 0;
		for (const c of text) {
			if (c === '\n') {
				line++;
				column = 0;
			} else {
				column++;
			}
		}
		return new TextLength(line, column);
	}

	public static ofSubstr(str: string, range: OffsetRange): TextLength {
		return TextLength.ofText(range.substring(str));
	}

	public static sum<T>(fragments: readonly T[], getLength: (f: T) => TextLength): TextLength {
		return fragments.reduce((acc, f) => acc.add(getLength(f)), TextLength.zero);
	}

	constructor(
		public readonly lineCount: number,
		public readonly columnCount: number
	) { }

	public isZero() {
		return this.lineCount === 0 && this.columnCount === 0;
	}

	public isLessThan(other: TextLength): boolean {
		if (this.lineCount !== other.lineCount) {
			return this.lineCount < other.lineCount;
		}
		return this.columnCount < other.columnCount;
	}

	public isGreaterThan(other: TextLength): boolean {
		if (this.lineCount !== other.lineCount) {
			return this.lineCount > other.lineCount;
		}
		return this.columnCount > other.columnCount;
	}

	public isGreaterThanOrEqualTo(other: TextLength): boolean {
		if (this.lineCount !== other.lineCount) {
			return this.lineCount > other.lineCount;
		}
		return this.columnCount >= other.columnCount;
	}

	public equals(other: TextLength): boolean {
		return this.lineCount === other.lineCount && this.columnCount === other.columnCount;
	}

	public compare(other: TextLength): number {
		if (this.lineCount !== other.lineCount) {
			return this.lineCount - other.lineCount;
		}
		return this.columnCount - other.columnCount;
	}

	public add(other: TextLength): TextLength {
		if (other.lineCount === 0) {
			return new TextLength(this.lineCount, this.columnCount + other.columnCount);
		} else {
			return new TextLength(this.lineCount + other.lineCount, other.columnCount);
		}
	}

	public createRange(startPosition: Position): Range {
		if (this.lineCount === 0) {
			return new Range(startPosition.lineNumber, startPosition.column, startPosition.lineNumber, startPosition.column + this.columnCount);
		} else {
			return new Range(startPosition.lineNumber, startPosition.column, startPosition.lineNumber + this.lineCount, this.columnCount + 1);
		}
	}

	public toRange(): Range {
		return new Range(1, 1, this.lineCount + 1, this.columnCount + 1);
	}

	public toLineRange(): LineRange {
		return LineRange.ofLength(1, this.lineCount + 1);
	}

	public addToPosition(position: Position): Position {
		if (this.lineCount === 0) {
			return new Position(position.lineNumber, position.column + this.columnCount);
		} else {
			return new Position(position.lineNumber + this.lineCount, this.columnCount + 1);
		}
	}

	public addToRange(range: Range): Range {
		return Range.fromPositions(
			this.addToPosition(range.getStartPosition()),
			this.addToPosition(range.getEndPosition())
		);
	}

	toString() {
		return `${this.lineCount},${this.columnCount}`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/cursor/cursor.ts]---
Location: vscode-main/src/vs/editor/common/cursor/cursor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedError } from '../../../base/common/errors.js';
import * as strings from '../../../base/common/strings.js';
import { CursorCollection } from './cursorCollection.js';
import { CursorConfiguration, CursorState, EditOperationResult, EditOperationType, IColumnSelectData, PartialCursorState, ICursorSimpleModel } from '../cursorCommon.js';
import { CursorContext } from './cursorContext.js';
import { DeleteOperations } from './cursorDeleteOperations.js';
import { CursorChangeReason } from '../cursorEvents.js';
import { CompositionOutcome, TypeOperations } from './cursorTypeOperations.js';
import { BaseTypeWithAutoClosingCommand } from './cursorTypeEditOperations.js';
import { Position } from '../core/position.js';
import { Range, IRange } from '../core/range.js';
import { ISelection, Selection, SelectionDirection } from '../core/selection.js';
import * as editorCommon from '../editorCommon.js';
import { ITextModel, TrackedRangeStickiness, IModelDeltaDecoration, ICursorStateComputer, IIdentifiedSingleEditOperation, IValidEditOperation } from '../model.js';
import { RawContentChangedType, ModelInjectedTextChangedEvent, InternalModelContentChangeEvent } from '../textModelEvents.js';
import { VerticalRevealType, ViewCursorStateChangedEvent, ViewRevealRangeRequestEvent } from '../viewEvents.js';
import { dispose, Disposable } from '../../../base/common/lifecycle.js';
import { CursorStateChangedEvent, ViewModelEventsCollector } from '../viewModelEventDispatcher.js';
import { TextModelEditSource, EditSources } from '../textModelEditSource.js';
import { ICoordinatesConverter } from '../coordinatesConverter.js';

export class CursorsController extends Disposable {

	private readonly _model: ITextModel;
	private _knownModelVersionId: number;
	private readonly _viewModel: ICursorSimpleModel;
	private readonly _coordinatesConverter: ICoordinatesConverter;
	public context: CursorContext;
	private _cursors: CursorCollection;

	private _hasFocus: boolean;
	private _isHandling: boolean;
	private _compositionState: CompositionState | null;
	private _columnSelectData: IColumnSelectData | null;
	private _autoClosedActions: AutoClosedAction[];
	private _prevEditOperationType: EditOperationType;

	constructor(model: ITextModel, viewModel: ICursorSimpleModel, coordinatesConverter: ICoordinatesConverter, cursorConfig: CursorConfiguration) {
		super();
		this._model = model;
		this._knownModelVersionId = this._model.getVersionId();
		this._viewModel = viewModel;
		this._coordinatesConverter = coordinatesConverter;
		this.context = new CursorContext(this._model, this._viewModel, this._coordinatesConverter, cursorConfig);
		this._cursors = new CursorCollection(this.context);

		this._hasFocus = false;
		this._isHandling = false;
		this._compositionState = null;
		this._columnSelectData = null;
		this._autoClosedActions = [];
		this._prevEditOperationType = EditOperationType.Other;
	}

	public override dispose(): void {
		this._cursors.dispose();
		this._autoClosedActions = dispose(this._autoClosedActions);
		super.dispose();
	}

	public updateConfiguration(cursorConfig: CursorConfiguration): void {
		this.context = new CursorContext(this._model, this._viewModel, this._coordinatesConverter, cursorConfig);
		this._cursors.updateContext(this.context);
	}

	public onLineMappingChanged(eventsCollector: ViewModelEventsCollector): void {
		if (this._knownModelVersionId !== this._model.getVersionId()) {
			// There are model change events that I didn't yet receive.
			//
			// This can happen when editing the model, and the view model receives the change events first,
			// and the view model emits line mapping changed events, all before the cursor gets a chance to
			// recover from markers.
			//
			// The model change listener above will be called soon and we'll ensure a valid cursor state there.
			return;
		}
		// Ensure valid state
		this.setStates(eventsCollector, 'viewModel', CursorChangeReason.NotSet, this.getCursorStates());
	}

	public setHasFocus(hasFocus: boolean): void {
		this._hasFocus = hasFocus;
	}

	private _validateAutoClosedActions(): void {
		if (this._autoClosedActions.length > 0) {
			const selections: Range[] = this._cursors.getSelections();
			for (let i = 0; i < this._autoClosedActions.length; i++) {
				const autoClosedAction = this._autoClosedActions[i];
				if (!autoClosedAction.isValid(selections)) {
					autoClosedAction.dispose();
					this._autoClosedActions.splice(i, 1);
					i--;
				}
			}
		}
	}

	// ------ some getters/setters

	public getPrimaryCursorState(): CursorState {
		return this._cursors.getPrimaryCursor();
	}

	public getLastAddedCursorIndex(): number {
		return this._cursors.getLastAddedCursorIndex();
	}

	public getCursorStates(): CursorState[] {
		return this._cursors.getAll();
	}

	public setStates(eventsCollector: ViewModelEventsCollector, source: string | null | undefined, reason: CursorChangeReason, states: PartialCursorState[] | null): boolean {
		let reachedMaxCursorCount = false;
		const multiCursorLimit = this.context.cursorConfig.multiCursorLimit;
		if (states !== null && states.length > multiCursorLimit) {
			states = states.slice(0, multiCursorLimit);
			reachedMaxCursorCount = true;
		}

		const oldState = CursorModelState.from(this._model, this);

		this._cursors.setStates(states);
		this._cursors.normalize();
		this._columnSelectData = null;

		this._validateAutoClosedActions();

		return this._emitStateChangedIfNecessary(eventsCollector, source, reason, oldState, reachedMaxCursorCount);
	}

	public setCursorColumnSelectData(columnSelectData: IColumnSelectData): void {
		this._columnSelectData = columnSelectData;
	}

	public revealAll(eventsCollector: ViewModelEventsCollector, source: string | null | undefined, minimalReveal: boolean, verticalType: VerticalRevealType, revealHorizontal: boolean, scrollType: editorCommon.ScrollType): void {
		const viewPositions = this._cursors.getViewPositions();

		let revealViewRange: Range | null = null;
		let revealViewSelections: Selection[] | null = null;
		if (viewPositions.length > 1) {
			revealViewSelections = this._cursors.getViewSelections();
		} else {
			revealViewRange = Range.fromPositions(viewPositions[0], viewPositions[0]);
		}

		eventsCollector.emitViewEvent(new ViewRevealRangeRequestEvent(source, minimalReveal, revealViewRange, revealViewSelections, verticalType, revealHorizontal, scrollType));
	}

	public revealPrimary(eventsCollector: ViewModelEventsCollector, source: string | null | undefined, minimalReveal: boolean, verticalType: VerticalRevealType, revealHorizontal: boolean, scrollType: editorCommon.ScrollType): void {
		const primaryCursor = this._cursors.getPrimaryCursor();
		const revealViewSelections = [primaryCursor.viewState.selection];
		eventsCollector.emitViewEvent(new ViewRevealRangeRequestEvent(source, minimalReveal, null, revealViewSelections, verticalType, revealHorizontal, scrollType));
	}

	public saveState(): editorCommon.ICursorState[] {

		const result: editorCommon.ICursorState[] = [];

		const selections = this._cursors.getSelections();
		for (let i = 0, len = selections.length; i < len; i++) {
			const selection = selections[i];

			result.push({
				inSelectionMode: !selection.isEmpty(),
				selectionStart: {
					lineNumber: selection.selectionStartLineNumber,
					column: selection.selectionStartColumn,
				},
				position: {
					lineNumber: selection.positionLineNumber,
					column: selection.positionColumn,
				}
			});
		}

		return result;
	}

	public restoreState(eventsCollector: ViewModelEventsCollector, states: editorCommon.ICursorState[]): void {

		const desiredSelections: ISelection[] = [];

		for (let i = 0, len = states.length; i < len; i++) {
			const state = states[i];

			let positionLineNumber = 1;
			let positionColumn = 1;

			// Avoid missing properties on the literal
			if (state.position && state.position.lineNumber) {
				positionLineNumber = state.position.lineNumber;
			}
			if (state.position && state.position.column) {
				positionColumn = state.position.column;
			}

			let selectionStartLineNumber = positionLineNumber;
			let selectionStartColumn = positionColumn;

			// Avoid missing properties on the literal
			if (state.selectionStart && state.selectionStart.lineNumber) {
				selectionStartLineNumber = state.selectionStart.lineNumber;
			}
			if (state.selectionStart && state.selectionStart.column) {
				selectionStartColumn = state.selectionStart.column;
			}

			desiredSelections.push({
				selectionStartLineNumber: selectionStartLineNumber,
				selectionStartColumn: selectionStartColumn,
				positionLineNumber: positionLineNumber,
				positionColumn: positionColumn
			});
		}

		this.setStates(eventsCollector, 'restoreState', CursorChangeReason.NotSet, CursorState.fromModelSelections(desiredSelections));
		this.revealAll(eventsCollector, 'restoreState', false, VerticalRevealType.Simple, true, editorCommon.ScrollType.Immediate);
	}

	public onModelContentChanged(eventsCollector: ViewModelEventsCollector, event: InternalModelContentChangeEvent | ModelInjectedTextChangedEvent): void {
		if (event instanceof ModelInjectedTextChangedEvent) {
			// If injected texts change, the view positions of all cursors need to be updated.
			if (this._isHandling) {
				// The view positions will be updated when handling finishes
				return;
			}
			// setStates might remove markers, which could trigger a decoration change.
			// If there are injected text decorations for that line, `onModelContentChanged` is emitted again
			// and an endless recursion happens.
			// _isHandling prevents that.
			this._isHandling = true;
			try {
				this.setStates(eventsCollector, 'modelChange', CursorChangeReason.NotSet, this.getCursorStates());
			} finally {
				this._isHandling = false;
			}
		} else {
			const e = event.rawContentChangedEvent;
			this._knownModelVersionId = e.versionId;
			if (this._isHandling) {
				return;
			}

			const hadFlushEvent = e.containsEvent(RawContentChangedType.Flush);
			this._prevEditOperationType = EditOperationType.Other;

			if (hadFlushEvent) {
				// a model.setValue() was called
				this._cursors.dispose();
				this._cursors = new CursorCollection(this.context);
				this._validateAutoClosedActions();
				this._emitStateChangedIfNecessary(eventsCollector, 'model', CursorChangeReason.ContentFlush, null, false);
			} else {
				if (this._hasFocus && e.resultingSelection && e.resultingSelection.length > 0) {
					const cursorState = CursorState.fromModelSelections(e.resultingSelection);
					if (this.setStates(eventsCollector, 'modelChange', e.isUndoing ? CursorChangeReason.Undo : e.isRedoing ? CursorChangeReason.Redo : CursorChangeReason.RecoverFromMarkers, cursorState)) {
						this.revealAll(eventsCollector, 'modelChange', false, VerticalRevealType.Simple, true, editorCommon.ScrollType.Smooth);
					}
				} else {
					const selectionsFromMarkers = this._cursors.readSelectionFromMarkers();
					this.setStates(eventsCollector, 'modelChange', CursorChangeReason.RecoverFromMarkers, CursorState.fromModelSelections(selectionsFromMarkers));
				}
			}
		}
	}

	public getSelection(): Selection {
		return this._cursors.getPrimaryCursor().modelState.selection;
	}

	public getTopMostViewPosition(): Position {
		return this._cursors.getTopMostViewPosition();
	}

	public getBottomMostViewPosition(): Position {
		return this._cursors.getBottomMostViewPosition();
	}

	public getCursorColumnSelectData(): IColumnSelectData {
		if (this._columnSelectData) {
			return this._columnSelectData;
		}
		const primaryCursor = this._cursors.getPrimaryCursor();
		const viewSelectionStart = primaryCursor.viewState.selectionStart.getStartPosition();
		const viewPosition = primaryCursor.viewState.position;
		return {
			isReal: false,
			fromViewLineNumber: viewSelectionStart.lineNumber,
			fromViewVisualColumn: this.context.cursorConfig.visibleColumnFromColumn(this._viewModel, viewSelectionStart),
			toViewLineNumber: viewPosition.lineNumber,
			toViewVisualColumn: this.context.cursorConfig.visibleColumnFromColumn(this._viewModel, viewPosition),
		};
	}

	public getSelections(): Selection[] {
		return this._cursors.getSelections();
	}

	public getPosition(): Position {
		return this._cursors.getPrimaryCursor().modelState.position;
	}

	public setSelections(eventsCollector: ViewModelEventsCollector, source: string | null | undefined, selections: readonly ISelection[], reason: CursorChangeReason): void {
		this.setStates(eventsCollector, source, reason, CursorState.fromModelSelections(selections));
	}

	public getPrevEditOperationType(): EditOperationType {
		return this._prevEditOperationType;
	}

	public setPrevEditOperationType(type: EditOperationType): void {
		this._prevEditOperationType = type;
	}

	// ------ auxiliary handling logic

	private _pushAutoClosedAction(autoClosedCharactersRanges: Range[], autoClosedEnclosingRanges: Range[]): void {
		const autoClosedCharactersDeltaDecorations: IModelDeltaDecoration[] = [];
		const autoClosedEnclosingDeltaDecorations: IModelDeltaDecoration[] = [];

		for (let i = 0, len = autoClosedCharactersRanges.length; i < len; i++) {
			autoClosedCharactersDeltaDecorations.push({
				range: autoClosedCharactersRanges[i],
				options: {
					description: 'auto-closed-character',
					inlineClassName: 'auto-closed-character',
					stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
				}
			});
			autoClosedEnclosingDeltaDecorations.push({
				range: autoClosedEnclosingRanges[i],
				options: {
					description: 'auto-closed-enclosing',
					stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
				}
			});
		}

		const autoClosedCharactersDecorations = this._model.deltaDecorations([], autoClosedCharactersDeltaDecorations);
		const autoClosedEnclosingDecorations = this._model.deltaDecorations([], autoClosedEnclosingDeltaDecorations);
		this._autoClosedActions.push(new AutoClosedAction(this._model, autoClosedCharactersDecorations, autoClosedEnclosingDecorations));
	}

	private _executeEditOperation(opResult: EditOperationResult | null, editReason: TextModelEditSource): void {

		if (!opResult) {
			// Nothing to execute
			return;
		}

		if (opResult.shouldPushStackElementBefore) {
			this._model.pushStackElement();
		}

		const result = CommandExecutor.executeCommands(this._model, this._cursors.getSelections(), opResult.commands, editReason);
		if (result) {
			// The commands were applied correctly
			this._interpretCommandResult(result);

			// Check for auto-closing closed characters
			const autoClosedCharactersRanges: Range[] = [];
			const autoClosedEnclosingRanges: Range[] = [];

			for (let i = 0; i < opResult.commands.length; i++) {
				const command = opResult.commands[i];
				if (command instanceof BaseTypeWithAutoClosingCommand && command.enclosingRange && command.closeCharacterRange) {
					autoClosedCharactersRanges.push(command.closeCharacterRange);
					autoClosedEnclosingRanges.push(command.enclosingRange);
				}
			}

			if (autoClosedCharactersRanges.length > 0) {
				this._pushAutoClosedAction(autoClosedCharactersRanges, autoClosedEnclosingRanges);
			}

			this._prevEditOperationType = opResult.type;
		}

		if (opResult.shouldPushStackElementAfter) {
			this._model.pushStackElement();
		}
	}

	private _interpretCommandResult(cursorState: Selection[] | null): void {
		if (!cursorState || cursorState.length === 0) {
			cursorState = this._cursors.readSelectionFromMarkers();
		}

		this._columnSelectData = null;
		this._cursors.setSelections(cursorState);
		this._cursors.normalize();
	}

	// -----------------------------------------------------------------------------------------------------------
	// ----- emitting events

	private _emitStateChangedIfNecessary(eventsCollector: ViewModelEventsCollector, source: string | null | undefined, reason: CursorChangeReason, oldState: CursorModelState | null, reachedMaxCursorCount: boolean): boolean {
		const newState = CursorModelState.from(this._model, this);
		if (newState.equals(oldState)) {
			return false;
		}

		const selections = this._cursors.getSelections();
		const viewSelections = this._cursors.getViewSelections();

		// Let the view get the event first.
		eventsCollector.emitViewEvent(new ViewCursorStateChangedEvent(viewSelections, selections, reason));

		// Only after the view has been notified, let the rest of the world know...
		if (!oldState
			|| oldState.cursorState.length !== newState.cursorState.length
			|| newState.cursorState.some((newCursorState, i) => !newCursorState.modelState.equals(oldState.cursorState[i].modelState))
		) {
			const oldSelections = oldState ? oldState.cursorState.map(s => s.modelState.selection) : null;
			const oldModelVersionId = oldState ? oldState.modelVersionId : 0;
			eventsCollector.emitOutgoingEvent(new CursorStateChangedEvent(oldSelections, selections, oldModelVersionId, newState.modelVersionId, source || 'keyboard', reason, reachedMaxCursorCount));
		}

		return true;
	}

	// -----------------------------------------------------------------------------------------------------------
	// ----- handlers beyond this point

	private _findAutoClosingPairs(edits: IIdentifiedSingleEditOperation[]): [number, number][] | null {
		if (!edits.length) {
			return null;
		}

		const indices: [number, number][] = [];
		for (let i = 0, len = edits.length; i < len; i++) {
			const edit = edits[i];
			if (!edit.text || edit.text.indexOf('\n') >= 0) {
				return null;
			}

			const m = edit.text.match(/([)\]}>'"`])([^)\]}>'"`]*)$/);
			if (!m) {
				return null;
			}
			const closeChar = m[1];

			const autoClosingPairsCandidates = this.context.cursorConfig.autoClosingPairs.autoClosingPairsCloseSingleChar.get(closeChar);
			if (!autoClosingPairsCandidates || autoClosingPairsCandidates.length !== 1) {
				return null;
			}

			const openChar = autoClosingPairsCandidates[0].open;
			const closeCharIndex = edit.text.length - m[2].length - 1;
			const openCharIndex = edit.text.lastIndexOf(openChar, closeCharIndex - 1);
			if (openCharIndex === -1) {
				return null;
			}

			indices.push([openCharIndex, closeCharIndex]);
		}

		return indices;
	}

	public executeEdits(eventsCollector: ViewModelEventsCollector, source: string | null | undefined, edits: IIdentifiedSingleEditOperation[], cursorStateComputer: ICursorStateComputer, reason: TextModelEditSource): void {
		let autoClosingIndices: [number, number][] | null = null;
		if (source === 'snippet') {
			autoClosingIndices = this._findAutoClosingPairs(edits);
		}

		if (autoClosingIndices) {
			edits[0]._isTracked = true;
		}
		const autoClosedCharactersRanges: Range[] = [];
		const autoClosedEnclosingRanges: Range[] = [];
		const selections = this._model.pushEditOperations(this.getSelections(), edits, (undoEdits) => {
			if (autoClosingIndices) {
				for (let i = 0, len = autoClosingIndices.length; i < len; i++) {
					const [openCharInnerIndex, closeCharInnerIndex] = autoClosingIndices[i];
					const undoEdit = undoEdits[i];
					const lineNumber = undoEdit.range.startLineNumber;
					const openCharIndex = undoEdit.range.startColumn - 1 + openCharInnerIndex;
					const closeCharIndex = undoEdit.range.startColumn - 1 + closeCharInnerIndex;

					autoClosedCharactersRanges.push(new Range(lineNumber, closeCharIndex + 1, lineNumber, closeCharIndex + 2));
					autoClosedEnclosingRanges.push(new Range(lineNumber, openCharIndex + 1, lineNumber, closeCharIndex + 2));
				}
			}
			const selections = cursorStateComputer(undoEdits);
			if (selections) {
				// Don't recover the selection from markers because
				// we know what it should be.
				this._isHandling = true;
			}

			return selections;
		}, undefined, reason);
		if (selections) {
			this._isHandling = false;
			this.setSelections(eventsCollector, source, selections, CursorChangeReason.NotSet);
		}
		if (autoClosedCharactersRanges.length > 0) {
			this._pushAutoClosedAction(autoClosedCharactersRanges, autoClosedEnclosingRanges);
		}
	}

	private _executeEdit(callback: () => void, eventsCollector: ViewModelEventsCollector, source: string | null | undefined, cursorChangeReason: CursorChangeReason = CursorChangeReason.NotSet): void {
		if (this.context.cursorConfig.readOnly) {
			// we cannot edit when read only...
			return;
		}

		const oldState = CursorModelState.from(this._model, this);
		this._cursors.stopTrackingSelections();
		this._isHandling = true;

		try {
			this._cursors.ensureValidState();
			callback();
		} catch (err) {
			onUnexpectedError(err);
		}

		this._isHandling = false;
		this._cursors.startTrackingSelections();
		this._validateAutoClosedActions();
		if (this._emitStateChangedIfNecessary(eventsCollector, source, cursorChangeReason, oldState, false)) {
			this.revealAll(eventsCollector, source, false, VerticalRevealType.Simple, true, editorCommon.ScrollType.Smooth);
		}
	}

	public getAutoClosedCharacters(): Range[] {
		return AutoClosedAction.getAllAutoClosedCharacters(this._autoClosedActions);
	}

	public startComposition(eventsCollector: ViewModelEventsCollector): void {
		this._compositionState = new CompositionState(this._model, this.getSelections());
	}

	public endComposition(eventsCollector: ViewModelEventsCollector, source?: string | null | undefined): void {
		const reason = EditSources.cursor({ kind: 'compositionEnd', detailedSource: source });

		const compositionOutcome = this._compositionState ? this._compositionState.deduceOutcome(this._model, this.getSelections()) : null;
		this._compositionState = null;

		this._executeEdit(() => {
			if (source === 'keyboard') {
				// composition finishes, let's check if we need to auto complete if necessary.
				this._executeEditOperation(TypeOperations.compositionEndWithInterceptors(this._prevEditOperationType, this.context.cursorConfig, this._model, compositionOutcome, this.getSelections(), this.getAutoClosedCharacters()), reason);
			}
		}, eventsCollector, source);
	}

	public type(eventsCollector: ViewModelEventsCollector, text: string, source?: string | null | undefined): void {
		const reason = EditSources.cursor({ kind: 'type', detailedSource: source });

		this._executeEdit(() => {
			if (source === 'keyboard') {
				// If this event is coming straight from the keyboard, look for electric characters and enter

				const len = text.length;
				let offset = 0;
				while (offset < len) {
					const charLength = strings.nextCharLength(text, offset);
					const chr = text.substr(offset, charLength);

					// Here we must interpret each typed character individually
					this._executeEditOperation(TypeOperations.typeWithInterceptors(!!this._compositionState, this._prevEditOperationType, this.context.cursorConfig, this._model, this.getSelections(), this.getAutoClosedCharacters(), chr), reason);

					offset += charLength;
				}

			} else {
				this._executeEditOperation(TypeOperations.typeWithoutInterceptors(this._prevEditOperationType, this.context.cursorConfig, this._model, this.getSelections(), text), reason);
			}
		}, eventsCollector, source);
	}

	public compositionType(eventsCollector: ViewModelEventsCollector, text: string, replacePrevCharCnt: number, replaceNextCharCnt: number, positionDelta: number, source?: string | null | undefined): void {
		const reason = EditSources.cursor({ kind: 'compositionType', detailedSource: source });

		if (text.length === 0 && replacePrevCharCnt === 0 && replaceNextCharCnt === 0) {
			// this edit is a no-op
			if (positionDelta !== 0) {
				// but it still wants to move the cursor
				const newSelections = this.getSelections().map(selection => {
					const position = selection.getPosition();
					return new Selection(position.lineNumber, position.column + positionDelta, position.lineNumber, position.column + positionDelta);
				});
				this.setSelections(eventsCollector, source, newSelections, CursorChangeReason.NotSet);
			}
			return;
		}
		this._executeEdit(() => {
			this._executeEditOperation(TypeOperations.compositionType(this._prevEditOperationType, this.context.cursorConfig, this._model, this.getSelections(), text, replacePrevCharCnt, replaceNextCharCnt, positionDelta), reason);
		}, eventsCollector, source);
	}

	public paste(eventsCollector: ViewModelEventsCollector, text: string, pasteOnNewLine: boolean, multicursorText?: string[] | null | undefined, source?: string | null | undefined): void {
		const reason = EditSources.cursor({ kind: 'paste', detailedSource: source });

		this._executeEdit(() => {
			this._executeEditOperation(TypeOperations.paste(this.context.cursorConfig, this._model, this.getSelections(), text, pasteOnNewLine, multicursorText || []), reason);
		}, eventsCollector, source, CursorChangeReason.Paste);
	}

	public cut(eventsCollector: ViewModelEventsCollector, source?: string | null | undefined): void {
		const reason = EditSources.cursor({ kind: 'cut', detailedSource: source });
		this._executeEdit(() => {
			this._executeEditOperation(DeleteOperations.cut(this.context.cursorConfig, this._model, this.getSelections()), reason);
		}, eventsCollector, source);
	}

	public executeCommand(eventsCollector: ViewModelEventsCollector, command: editorCommon.ICommand, source?: string | null | undefined): void {
		const reason = EditSources.cursor({ kind: 'executeCommand', detailedSource: source });

		this._executeEdit(() => {
			this._cursors.killSecondaryCursors();

			this._executeEditOperation(new EditOperationResult(EditOperationType.Other, [command], {
				shouldPushStackElementBefore: false,
				shouldPushStackElementAfter: false
			}), reason);
		}, eventsCollector, source);
	}

	public executeCommands(eventsCollector: ViewModelEventsCollector, commands: editorCommon.ICommand[], source?: string | null | undefined): void {
		const reason = EditSources.cursor({ kind: 'executeCommands', detailedSource: source });

		this._executeEdit(() => {
			this._executeEditOperation(new EditOperationResult(EditOperationType.Other, commands, {
				shouldPushStackElementBefore: false,
				shouldPushStackElementAfter: false
			}), reason);
		}, eventsCollector, source);
	}
}

/**
 * A snapshot of the cursor and the model state
 */
class CursorModelState {
	public static from(model: ITextModel, cursor: CursorsController): CursorModelState {
		return new CursorModelState(model.getVersionId(), cursor.getCursorStates());
	}

	constructor(
		public readonly modelVersionId: number,
		public readonly cursorState: CursorState[],
	) {
	}

	public equals(other: CursorModelState | null): boolean {
		if (!other) {
			return false;
		}
		if (this.modelVersionId !== other.modelVersionId) {
			return false;
		}
		if (this.cursorState.length !== other.cursorState.length) {
			return false;
		}
		for (let i = 0, len = this.cursorState.length; i < len; i++) {
			if (!this.cursorState[i].equals(other.cursorState[i])) {
				return false;
			}
		}
		return true;
	}
}

class AutoClosedAction {

	public static getAllAutoClosedCharacters(autoClosedActions: AutoClosedAction[]): Range[] {
		let autoClosedCharacters: Range[] = [];
		for (const autoClosedAction of autoClosedActions) {
			autoClosedCharacters = autoClosedCharacters.concat(autoClosedAction.getAutoClosedCharactersRanges());
		}
		return autoClosedCharacters;
	}

	private readonly _model: ITextModel;

	private _autoClosedCharactersDecorations: string[];
	private _autoClosedEnclosingDecorations: string[];

	constructor(model: ITextModel, autoClosedCharactersDecorations: string[], autoClosedEnclosingDecorations: string[]) {
		this._model = model;
		this._autoClosedCharactersDecorations = autoClosedCharactersDecorations;
		this._autoClosedEnclosingDecorations = autoClosedEnclosingDecorations;
	}

	public dispose(): void {
		this._autoClosedCharactersDecorations = this._model.deltaDecorations(this._autoClosedCharactersDecorations, []);
		this._autoClosedEnclosingDecorations = this._model.deltaDecorations(this._autoClosedEnclosingDecorations, []);
	}

	public getAutoClosedCharactersRanges(): Range[] {
		const result: Range[] = [];
		for (let i = 0; i < this._autoClosedCharactersDecorations.length; i++) {
			const decorationRange = this._model.getDecorationRange(this._autoClosedCharactersDecorations[i]);
			if (decorationRange) {
				result.push(decorationRange);
			}
		}
		return result;
	}

	public isValid(selections: Range[]): boolean {
		const enclosingRanges: Range[] = [];
		for (let i = 0; i < this._autoClosedEnclosingDecorations.length; i++) {
			const decorationRange = this._model.getDecorationRange(this._autoClosedEnclosingDecorations[i]);
			if (decorationRange) {
				enclosingRanges.push(decorationRange);
				if (decorationRange.startLineNumber !== decorationRange.endLineNumber) {
					// Stop tracking if the range becomes multiline...
					return false;
				}
			}
		}
		enclosingRanges.sort(Range.compareRangesUsingStarts);

		selections.sort(Range.compareRangesUsingStarts);

		for (let i = 0; i < selections.length; i++) {
			if (i >= enclosingRanges.length) {
				return false;
			}
			if (!enclosingRanges[i].strictContainsRange(selections[i])) {
				return false;
			}
		}

		return true;
	}
}

interface IExecContext {
	readonly model: ITextModel;
	readonly selectionsBefore: Selection[];
	readonly trackedRanges: string[];
	readonly trackedRangesDirection: SelectionDirection[];
}

interface ICommandData {
	operations: IIdentifiedSingleEditOperation[];
	hadTrackedEditOperation: boolean;
}

interface ICommandsData {
	operations: IIdentifiedSingleEditOperation[];
	hadTrackedEditOperation: boolean;
}

export class CommandExecutor {

	public static executeCommands(model: ITextModel, selectionsBefore: Selection[], commands: (editorCommon.ICommand | null)[], editReason: TextModelEditSource = EditSources.unknown({ name: 'executeCommands' })): Selection[] | null {

		const ctx: IExecContext = {
			model: model,
			selectionsBefore: selectionsBefore,
			trackedRanges: [],
			trackedRangesDirection: []
		};

		const result = this._innerExecuteCommands(ctx, commands, editReason);

		for (let i = 0, len = ctx.trackedRanges.length; i < len; i++) {
			ctx.model._setTrackedRange(ctx.trackedRanges[i], null, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges);
		}

		return result;
	}

	private static _innerExecuteCommands(ctx: IExecContext, commands: (editorCommon.ICommand | null)[], editReason: TextModelEditSource): Selection[] | null {

		if (this._arrayIsEmpty(commands)) {
			return null;
		}

		const commandsData = this._getEditOperations(ctx, commands);
		if (commandsData.operations.length === 0) {
			return null;
		}

		const rawOperations = commandsData.operations;

		const loserCursorsMap = this._getLoserCursorMap(rawOperations);
		if (loserCursorsMap.hasOwnProperty('0')) {
			// These commands are very messed up
			console.warn('Ignoring commands');
			return null;
		}

		// Remove operations belonging to losing cursors
		const filteredOperations: IIdentifiedSingleEditOperation[] = [];
		for (let i = 0, len = rawOperations.length; i < len; i++) {
			if (!loserCursorsMap.hasOwnProperty(rawOperations[i].identifier!.major.toString())) {
				filteredOperations.push(rawOperations[i]);
			}
		}

		// TODO@Alex: find a better way to do this.
		// give the hint that edit operations are tracked to the model
		if (commandsData.hadTrackedEditOperation && filteredOperations.length > 0) {
			filteredOperations[0]._isTracked = true;
		}
		let selectionsAfter = ctx.model.pushEditOperations(ctx.selectionsBefore, filteredOperations, (inverseEditOperations: IValidEditOperation[]): Selection[] => {
			const groupedInverseEditOperations: IValidEditOperation[][] = [];
			for (let i = 0; i < ctx.selectionsBefore.length; i++) {
				groupedInverseEditOperations[i] = [];
			}
			for (const op of inverseEditOperations) {
				if (!op.identifier) {
					// perhaps auto whitespace trim edits
					continue;
				}
				groupedInverseEditOperations[op.identifier.major].push(op);
			}
			const minorBasedSorter = (a: IValidEditOperation, b: IValidEditOperation) => {
				return a.identifier!.minor - b.identifier!.minor;
			};
			const cursorSelections: Selection[] = [];
			for (let i = 0; i < ctx.selectionsBefore.length; i++) {
				if (groupedInverseEditOperations[i].length > 0) {
					groupedInverseEditOperations[i].sort(minorBasedSorter);
					cursorSelections[i] = commands[i]!.computeCursorState(ctx.model, {
						getInverseEditOperations: () => {
							return groupedInverseEditOperations[i];
						},

						getTrackedSelection: (id: string) => {
							const idx = parseInt(id, 10);
							const range = ctx.model._getTrackedRange(ctx.trackedRanges[idx])!;
							if (ctx.trackedRangesDirection[idx] === SelectionDirection.LTR) {
								return new Selection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
							}
							return new Selection(range.endLineNumber, range.endColumn, range.startLineNumber, range.startColumn);
						}
					});
				} else {
					cursorSelections[i] = ctx.selectionsBefore[i];
				}
			}
			return cursorSelections;
		}, undefined, editReason);
		if (!selectionsAfter) {
			selectionsAfter = ctx.selectionsBefore;
		}

		// Extract losing cursors
		const losingCursors: number[] = [];
		for (const losingCursorIndex in loserCursorsMap) {
			if (loserCursorsMap.hasOwnProperty(losingCursorIndex)) {
				losingCursors.push(parseInt(losingCursorIndex, 10));
			}
		}

		// Sort losing cursors descending
		losingCursors.sort((a: number, b: number): number => {
			return b - a;
		});

		// Remove losing cursors
		for (const losingCursor of losingCursors) {
			selectionsAfter.splice(losingCursor, 1);
		}

		return selectionsAfter;
	}

	private static _arrayIsEmpty(commands: (editorCommon.ICommand | null)[]): boolean {
		for (let i = 0, len = commands.length; i < len; i++) {
			if (commands[i]) {
				return false;
			}
		}
		return true;
	}

	private static _getEditOperations(ctx: IExecContext, commands: (editorCommon.ICommand | null)[]): ICommandsData {
		let operations: IIdentifiedSingleEditOperation[] = [];
		let hadTrackedEditOperation: boolean = false;

		for (let i = 0, len = commands.length; i < len; i++) {
			const command = commands[i];
			if (command) {
				const r = this._getEditOperationsFromCommand(ctx, i, command);
				operations = operations.concat(r.operations);
				hadTrackedEditOperation = hadTrackedEditOperation || r.hadTrackedEditOperation;
			}
		}
		return {
			operations: operations,
			hadTrackedEditOperation: hadTrackedEditOperation
		};
	}

	private static _getEditOperationsFromCommand(ctx: IExecContext, majorIdentifier: number, command: editorCommon.ICommand): ICommandData {
		// This method acts as a transaction, if the command fails
		// everything it has done is ignored
		const operations: IIdentifiedSingleEditOperation[] = [];
		let operationMinor = 0;

		const addEditOperation = (range: IRange, text: string | null, forceMoveMarkers: boolean = false) => {
			if (Range.isEmpty(range) && text === '') {
				// This command wants to add a no-op => no thank you
				return;
			}
			operations.push({
				identifier: {
					major: majorIdentifier,
					minor: operationMinor++
				},
				range: range,
				text: text,
				forceMoveMarkers: forceMoveMarkers,
				isAutoWhitespaceEdit: command.insertsAutoWhitespace
			});
		};

		let hadTrackedEditOperation = false;
		const addTrackedEditOperation = (selection: IRange, text: string | null, forceMoveMarkers?: boolean) => {
			hadTrackedEditOperation = true;
			addEditOperation(selection, text, forceMoveMarkers);
		};

		const trackSelection = (_selection: ISelection, trackPreviousOnEmpty?: boolean) => {
			const selection = Selection.liftSelection(_selection);
			let stickiness: TrackedRangeStickiness;
			if (selection.isEmpty()) {
				if (typeof trackPreviousOnEmpty === 'boolean') {
					if (trackPreviousOnEmpty) {
						stickiness = TrackedRangeStickiness.GrowsOnlyWhenTypingBefore;
					} else {
						stickiness = TrackedRangeStickiness.GrowsOnlyWhenTypingAfter;
					}
				} else {
					// Try to lock it with surrounding text
					const maxLineColumn = ctx.model.getLineMaxColumn(selection.startLineNumber);
					if (selection.startColumn === maxLineColumn) {
						stickiness = TrackedRangeStickiness.GrowsOnlyWhenTypingBefore;
					} else {
						stickiness = TrackedRangeStickiness.GrowsOnlyWhenTypingAfter;
					}
				}
			} else {
				stickiness = TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges;
			}

			const l = ctx.trackedRanges.length;
			const id = ctx.model._setTrackedRange(null, selection, stickiness);
			ctx.trackedRanges[l] = id;
			ctx.trackedRangesDirection[l] = selection.getDirection();
			return l.toString();
		};

		const editOperationBuilder: editorCommon.IEditOperationBuilder = {
			addEditOperation: addEditOperation,
			addTrackedEditOperation: addTrackedEditOperation,
			trackSelection: trackSelection
		};

		try {
			command.getEditOperations(ctx.model, editOperationBuilder);
		} catch (e) {
			// TODO@Alex use notification service if this should be user facing
			// e.friendlyMessage = nls.localize('corrupt.commands', "Unexpected exception while executing command.");
			onUnexpectedError(e);
			return {
				operations: [],
				hadTrackedEditOperation: false
			};
		}

		return {
			operations: operations,
			hadTrackedEditOperation: hadTrackedEditOperation
		};
	}

	private static _getLoserCursorMap(operations: IIdentifiedSingleEditOperation[]): { [index: string]: boolean } {
		// This is destructive on the array
		operations = operations.slice(0);

		// Sort operations with last one first
		operations.sort((a: IIdentifiedSingleEditOperation, b: IIdentifiedSingleEditOperation): number => {
			// Note the minus!
			return -(Range.compareRangesUsingEnds(a.range, b.range));
		});

		// Operations can not overlap!
		const loserCursorsMap: { [index: string]: boolean } = {};

		for (let i = 1; i < operations.length; i++) {
			const previousOp = operations[i - 1];
			const currentOp = operations[i];

			if (Range.getStartPosition(previousOp.range).isBefore(Range.getEndPosition(currentOp.range))) {

				let loserMajor: number;

				if (previousOp.identifier!.major > currentOp.identifier!.major) {
					// previousOp loses the battle
					loserMajor = previousOp.identifier!.major;
				} else {
					loserMajor = currentOp.identifier!.major;
				}

				loserCursorsMap[loserMajor.toString()] = true;

				for (let j = 0; j < operations.length; j++) {
					if (operations[j].identifier!.major === loserMajor) {
						operations.splice(j, 1);
						if (j < i) {
							i--;
						}
						j--;
					}
				}

				if (i > 0) {
					i--;
				}
			}
		}

		return loserCursorsMap;
	}
}

class CompositionLineState {
	constructor(
		public readonly text: string,
		public readonly lineNumber: number,
		public readonly startSelectionOffset: number,
		public readonly endSelectionOffset: number
	) { }
}

class CompositionState {

	private readonly _original: CompositionLineState[] | null;

	private static _capture(textModel: ITextModel, selections: Selection[]): CompositionLineState[] | null {
		const result: CompositionLineState[] = [];
		for (const selection of selections) {
			if (selection.startLineNumber !== selection.endLineNumber) {
				return null;
			}
			const lineNumber = selection.startLineNumber;
			result.push(new CompositionLineState(
				textModel.getLineContent(lineNumber),
				lineNumber,
				selection.startColumn - 1,
				selection.endColumn - 1
			));
		}
		return result;
	}

	constructor(textModel: ITextModel, selections: Selection[]) {
		this._original = CompositionState._capture(textModel, selections);
	}

	/**
	 * Returns the inserted text during this composition.
	 * If the composition resulted in existing text being changed (i.e. not a pure insertion) it returns null.
	 */
	deduceOutcome(textModel: ITextModel, selections: Selection[]): CompositionOutcome[] | null {
		if (!this._original) {
			return null;
		}
		const current = CompositionState._capture(textModel, selections);
		if (!current) {
			return null;
		}
		if (this._original.length !== current.length) {
			return null;
		}
		const result: CompositionOutcome[] = [];
		for (let i = 0, len = this._original.length; i < len; i++) {
			result.push(CompositionState._deduceOutcome(this._original[i], current[i]));
		}
		return result;
	}

	private static _deduceOutcome(original: CompositionLineState, current: CompositionLineState): CompositionOutcome {
		const commonPrefix = Math.min(
			original.startSelectionOffset,
			current.startSelectionOffset,
			strings.commonPrefixLength(original.text, current.text)
		);
		const commonSuffix = Math.min(
			original.text.length - original.endSelectionOffset,
			current.text.length - current.endSelectionOffset,
			strings.commonSuffixLength(original.text, current.text)
		);
		const deletedText = original.text.substring(commonPrefix, original.text.length - commonSuffix);
		const insertedTextStartOffset = commonPrefix;
		const insertedTextEndOffset = current.text.length - commonSuffix;
		const insertedText = current.text.substring(insertedTextStartOffset, insertedTextEndOffset);
		const insertedTextRange = new Range(current.lineNumber, insertedTextStartOffset + 1, current.lineNumber, insertedTextEndOffset + 1);
		return new CompositionOutcome(
			deletedText,
			original.startSelectionOffset - commonPrefix,
			original.endSelectionOffset - commonPrefix,
			insertedText,
			current.startSelectionOffset - commonPrefix,
			current.endSelectionOffset - commonPrefix,
			insertedTextRange
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/cursor/cursorAtomicMoveOperations.ts]---
Location: vscode-main/src/vs/editor/common/cursor/cursorAtomicMoveOperations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';
import { CursorColumns } from '../core/cursorColumns.js';

export const enum Direction {
	Left,
	Right,
	Nearest,
}

export class AtomicTabMoveOperations {
	/**
	 * Get the visible column at the position. If we get to a non-whitespace character first
	 * or past the end of string then return -1.
	 *
	 * **Note** `position` and the return value are 0-based.
	 */
	public static whitespaceVisibleColumn(lineContent: string, position: number, tabSize: number): [number, number, number] {
		const lineLength = lineContent.length;
		let visibleColumn = 0;
		let prevTabStopPosition = -1;
		let prevTabStopVisibleColumn = -1;
		for (let i = 0; i < lineLength; i++) {
			if (i === position) {
				return [prevTabStopPosition, prevTabStopVisibleColumn, visibleColumn];
			}
			if (visibleColumn % tabSize === 0) {
				prevTabStopPosition = i;
				prevTabStopVisibleColumn = visibleColumn;
			}
			const chCode = lineContent.charCodeAt(i);
			switch (chCode) {
				case CharCode.Space:
					visibleColumn += 1;
					break;
				case CharCode.Tab:
					// Skip to the next multiple of tabSize.
					visibleColumn = CursorColumns.nextRenderTabStop(visibleColumn, tabSize);
					break;
				default:
					return [-1, -1, -1];
			}
		}
		if (position === lineLength) {
			return [prevTabStopPosition, prevTabStopVisibleColumn, visibleColumn];
		}
		return [-1, -1, -1];
	}

	/**
	 * Return the position that should result from a move left, right or to the
	 * nearest tab, if atomic tabs are enabled. Left and right are used for the
	 * arrow key movements, nearest is used for mouse selection. It returns
	 * -1 if atomic tabs are not relevant and you should fall back to normal
	 * behaviour.
	 *
	 * **Note**: `position` and the return value are 0-based.
	 */
	public static atomicPosition(lineContent: string, position: number, tabSize: number, direction: Direction): number {
		const lineLength = lineContent.length;

		// Get the 0-based visible column corresponding to the position, or return
		// -1 if it is not in the initial whitespace.
		const [prevTabStopPosition, prevTabStopVisibleColumn, visibleColumn] = AtomicTabMoveOperations.whitespaceVisibleColumn(lineContent, position, tabSize);

		if (visibleColumn === -1) {
			return -1;
		}

		// Is the output left or right of the current position. The case for nearest
		// where it is the same as the current position is handled in the switch.
		let left: boolean;
		switch (direction) {
			case Direction.Left:
				left = true;
				break;
			case Direction.Right:
				left = false;
				break;
			case Direction.Nearest:
				// The code below assumes the output position is either left or right
				// of the input position. If it is the same, return immediately.
				if (visibleColumn % tabSize === 0) {
					return position;
				}
				// Go to the nearest indentation.
				left = visibleColumn % tabSize <= (tabSize / 2);
				break;
		}

		// If going left, we can just use the info about the last tab stop position and
		// last tab stop visible column that we computed in the first walk over the whitespace.
		if (left) {
			if (prevTabStopPosition === -1) {
				return -1;
			}
			// If the direction is left, we need to keep scanning right to ensure
			// that targetVisibleColumn + tabSize is before non-whitespace.
			// This is so that when we press left at the end of a partial
			// indentation it only goes one character. For example '      foo' with
			// tabSize 4, should jump from position 6 to position 5, not 4.
			let currentVisibleColumn = prevTabStopVisibleColumn;
			for (let i = prevTabStopPosition; i < lineLength; ++i) {
				if (currentVisibleColumn === prevTabStopVisibleColumn + tabSize) {
					// It is a full indentation.
					return prevTabStopPosition;
				}

				const chCode = lineContent.charCodeAt(i);
				switch (chCode) {
					case CharCode.Space:
						currentVisibleColumn += 1;
						break;
					case CharCode.Tab:
						currentVisibleColumn = CursorColumns.nextRenderTabStop(currentVisibleColumn, tabSize);
						break;
					default:
						return -1;
				}
			}
			if (currentVisibleColumn === prevTabStopVisibleColumn + tabSize) {
				return prevTabStopPosition;
			}
			// It must have been a partial indentation.
			return -1;
		}

		// We are going right.
		const targetVisibleColumn = CursorColumns.nextRenderTabStop(visibleColumn, tabSize);

		// We can just continue from where whitespaceVisibleColumn got to.
		let currentVisibleColumn = visibleColumn;
		for (let i = position; i < lineLength; i++) {
			if (currentVisibleColumn === targetVisibleColumn) {
				return i;
			}

			const chCode = lineContent.charCodeAt(i);
			switch (chCode) {
				case CharCode.Space:
					currentVisibleColumn += 1;
					break;
				case CharCode.Tab:
					currentVisibleColumn = CursorColumns.nextRenderTabStop(currentVisibleColumn, tabSize);
					break;
				default:
					return -1;
			}
		}
		// This condition handles when the target column is at the end of the line.
		if (currentVisibleColumn === targetVisibleColumn) {
			return lineLength;
		}
		return -1;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/cursor/cursorCollection.ts]---
Location: vscode-main/src/vs/editor/common/cursor/cursorCollection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { compareBy } from '../../../base/common/arrays.js';
import { findLastMax, findFirstMin } from '../../../base/common/arraysFind.js';
import { CursorState, PartialCursorState } from '../cursorCommon.js';
import { CursorContext } from './cursorContext.js';
import { Cursor } from './oneCursor.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { ISelection, Selection } from '../core/selection.js';

export class CursorCollection {

	private context: CursorContext;

	/**
	 * `cursors[0]` is the primary cursor, thus `cursors.length >= 1` is always true.
	 * `cursors.slice(1)` are secondary cursors.
	*/
	private cursors: Cursor[];

	// An index which identifies the last cursor that was added / moved (think Ctrl+drag)
	// This index refers to `cursors.slice(1)`, i.e. after removing the primary cursor.
	private lastAddedCursorIndex: number;

	constructor(context: CursorContext) {
		this.context = context;
		this.cursors = [new Cursor(context)];
		this.lastAddedCursorIndex = 0;
	}

	public dispose(): void {
		for (const cursor of this.cursors) {
			cursor.dispose(this.context);
		}
	}

	public startTrackingSelections(): void {
		for (const cursor of this.cursors) {
			cursor.startTrackingSelection(this.context);
		}
	}

	public stopTrackingSelections(): void {
		for (const cursor of this.cursors) {
			cursor.stopTrackingSelection(this.context);
		}
	}

	public updateContext(context: CursorContext): void {
		this.context = context;
	}

	public ensureValidState(): void {
		for (const cursor of this.cursors) {
			cursor.ensureValidState(this.context);
		}
	}

	public readSelectionFromMarkers(): Selection[] {
		return this.cursors.map(c => c.readSelectionFromMarkers(this.context));
	}

	public getAll(): CursorState[] {
		return this.cursors.map(c => c.asCursorState());
	}

	public getViewPositions(): Position[] {
		return this.cursors.map(c => c.viewState.position);
	}

	public getTopMostViewPosition(): Position {
		return findFirstMin(
			this.cursors,
			compareBy(c => c.viewState.position, Position.compare)
		)!.viewState.position;
	}

	public getBottomMostViewPosition(): Position {
		return findLastMax(
			this.cursors,
			compareBy(c => c.viewState.position, Position.compare)
		)!.viewState.position;
	}

	public getSelections(): Selection[] {
		return this.cursors.map(c => c.modelState.selection);
	}

	public getViewSelections(): Selection[] {
		return this.cursors.map(c => c.viewState.selection);
	}

	public setSelections(selections: ISelection[]): void {
		this.setStates(CursorState.fromModelSelections(selections));
	}

	public getPrimaryCursor(): CursorState {
		return this.cursors[0].asCursorState();
	}

	public setStates(states: PartialCursorState[] | null): void {
		if (states === null) {
			return;
		}
		this.cursors[0].setState(this.context, states[0].modelState, states[0].viewState);
		this._setSecondaryStates(states.slice(1));
	}

	/**
	 * Creates or disposes secondary cursors as necessary to match the number of `secondarySelections`.
	 */
	private _setSecondaryStates(secondaryStates: PartialCursorState[]): void {
		const secondaryCursorsLength = this.cursors.length - 1;
		const secondaryStatesLength = secondaryStates.length;

		if (secondaryCursorsLength < secondaryStatesLength) {
			const createCnt = secondaryStatesLength - secondaryCursorsLength;
			for (let i = 0; i < createCnt; i++) {
				this._addSecondaryCursor();
			}
		} else if (secondaryCursorsLength > secondaryStatesLength) {
			const removeCnt = secondaryCursorsLength - secondaryStatesLength;
			for (let i = 0; i < removeCnt; i++) {
				this._removeSecondaryCursor(this.cursors.length - 2);
			}
		}

		for (let i = 0; i < secondaryStatesLength; i++) {
			this.cursors[i + 1].setState(this.context, secondaryStates[i].modelState, secondaryStates[i].viewState);
		}
	}

	public killSecondaryCursors(): void {
		this._setSecondaryStates([]);
	}

	private _addSecondaryCursor(): void {
		this.cursors.push(new Cursor(this.context));
		this.lastAddedCursorIndex = this.cursors.length - 1;
	}

	public getLastAddedCursorIndex(): number {
		if (this.cursors.length === 1 || this.lastAddedCursorIndex === 0) {
			return 0;
		}
		return this.lastAddedCursorIndex;
	}

	private _removeSecondaryCursor(removeIndex: number): void {
		if (this.lastAddedCursorIndex >= removeIndex + 1) {
			this.lastAddedCursorIndex--;
		}
		this.cursors[removeIndex + 1].dispose(this.context);
		this.cursors.splice(removeIndex + 1, 1);
	}

	public normalize(): void {
		if (this.cursors.length === 1) {
			return;
		}
		const cursors = this.cursors.slice(0);

		interface SortedCursor {
			index: number;
			selection: Selection;
		}
		const sortedCursors: SortedCursor[] = [];
		for (let i = 0, len = cursors.length; i < len; i++) {
			sortedCursors.push({
				index: i,
				selection: cursors[i].modelState.selection,
			});
		}

		sortedCursors.sort(compareBy(s => s.selection, Range.compareRangesUsingStarts));

		for (let sortedCursorIndex = 0; sortedCursorIndex < sortedCursors.length - 1; sortedCursorIndex++) {
			const current = sortedCursors[sortedCursorIndex];
			const next = sortedCursors[sortedCursorIndex + 1];

			const currentSelection = current.selection;
			const nextSelection = next.selection;

			if (!this.context.cursorConfig.multiCursorMergeOverlapping) {
				continue;
			}

			let shouldMergeCursors: boolean;
			if (nextSelection.isEmpty() || currentSelection.isEmpty()) {
				// Merge touching cursors if one of them is collapsed
				shouldMergeCursors = nextSelection.getStartPosition().isBeforeOrEqual(currentSelection.getEndPosition());
			} else {
				// Merge only overlapping cursors (i.e. allow touching ranges)
				shouldMergeCursors = nextSelection.getStartPosition().isBefore(currentSelection.getEndPosition());
			}

			if (shouldMergeCursors) {
				const winnerSortedCursorIndex = current.index < next.index ? sortedCursorIndex : sortedCursorIndex + 1;
				const looserSortedCursorIndex = current.index < next.index ? sortedCursorIndex + 1 : sortedCursorIndex;

				const looserIndex = sortedCursors[looserSortedCursorIndex].index;
				const winnerIndex = sortedCursors[winnerSortedCursorIndex].index;

				const looserSelection = sortedCursors[looserSortedCursorIndex].selection;
				const winnerSelection = sortedCursors[winnerSortedCursorIndex].selection;

				if (!looserSelection.equalsSelection(winnerSelection)) {
					const resultingRange = looserSelection.plusRange(winnerSelection);
					const looserSelectionIsLTR = (looserSelection.selectionStartLineNumber === looserSelection.startLineNumber && looserSelection.selectionStartColumn === looserSelection.startColumn);
					const winnerSelectionIsLTR = (winnerSelection.selectionStartLineNumber === winnerSelection.startLineNumber && winnerSelection.selectionStartColumn === winnerSelection.startColumn);

					// Give more importance to the last added cursor (think Ctrl-dragging + hitting another cursor)
					let resultingSelectionIsLTR: boolean;
					if (looserIndex === this.lastAddedCursorIndex) {
						resultingSelectionIsLTR = looserSelectionIsLTR;
						this.lastAddedCursorIndex = winnerIndex;
					} else {
						// Winner takes it all
						resultingSelectionIsLTR = winnerSelectionIsLTR;
					}

					let resultingSelection: Selection;
					if (resultingSelectionIsLTR) {
						resultingSelection = new Selection(resultingRange.startLineNumber, resultingRange.startColumn, resultingRange.endLineNumber, resultingRange.endColumn);
					} else {
						resultingSelection = new Selection(resultingRange.endLineNumber, resultingRange.endColumn, resultingRange.startLineNumber, resultingRange.startColumn);
					}

					sortedCursors[winnerSortedCursorIndex].selection = resultingSelection;
					const resultingState = CursorState.fromModelSelection(resultingSelection);
					cursors[winnerIndex].setState(this.context, resultingState.modelState, resultingState.viewState);
				}

				for (const sortedCursor of sortedCursors) {
					if (sortedCursor.index > looserIndex) {
						sortedCursor.index--;
					}
				}

				cursors.splice(looserIndex, 1);
				sortedCursors.splice(looserSortedCursorIndex, 1);
				this._removeSecondaryCursor(looserIndex - 1);

				sortedCursorIndex--;
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/cursor/cursorColumnSelection.ts]---
Location: vscode-main/src/vs/editor/common/cursor/cursorColumnSelection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CursorConfiguration, ICursorSimpleModel, SingleCursorState, IColumnSelectData, SelectionStartKind } from '../cursorCommon.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';

export class ColumnSelection {

	public static columnSelect(config: CursorConfiguration, model: ICursorSimpleModel, fromLineNumber: number, fromVisibleColumn: number, toLineNumber: number, toVisibleColumn: number): IColumnSelectResult {
		const lineCount = Math.abs(toLineNumber - fromLineNumber) + 1;
		const reversed = (fromLineNumber > toLineNumber);
		const isRTL = (fromVisibleColumn > toVisibleColumn);
		const isLTR = (fromVisibleColumn < toVisibleColumn);

		const result: SingleCursorState[] = [];

		// console.log(`fromVisibleColumn: ${fromVisibleColumn}, toVisibleColumn: ${toVisibleColumn}`);

		for (let i = 0; i < lineCount; i++) {
			const lineNumber = fromLineNumber + (reversed ? -i : i);

			const startColumn = config.columnFromVisibleColumn(model, lineNumber, fromVisibleColumn);
			const endColumn = config.columnFromVisibleColumn(model, lineNumber, toVisibleColumn);
			const visibleStartColumn = config.visibleColumnFromColumn(model, new Position(lineNumber, startColumn));
			const visibleEndColumn = config.visibleColumnFromColumn(model, new Position(lineNumber, endColumn));

			// console.log(`lineNumber: ${lineNumber}: visibleStartColumn: ${visibleStartColumn}, visibleEndColumn: ${visibleEndColumn}`);

			if (isLTR) {
				if (visibleStartColumn > toVisibleColumn) {
					continue;
				}
				if (visibleEndColumn < fromVisibleColumn) {
					continue;
				}
			}

			if (isRTL) {
				if (visibleEndColumn > fromVisibleColumn) {
					continue;
				}
				if (visibleStartColumn < toVisibleColumn) {
					continue;
				}
			}

			result.push(new SingleCursorState(
				new Range(lineNumber, startColumn, lineNumber, startColumn), SelectionStartKind.Simple, 0,
				new Position(lineNumber, endColumn), 0
			));
		}

		if (result.length === 0) {
			// We are after all the lines, so add cursor at the end of each line
			for (let i = 0; i < lineCount; i++) {
				const lineNumber = fromLineNumber + (reversed ? -i : i);
				const maxColumn = model.getLineMaxColumn(lineNumber);

				result.push(new SingleCursorState(
					new Range(lineNumber, maxColumn, lineNumber, maxColumn), SelectionStartKind.Simple, 0,
					new Position(lineNumber, maxColumn), 0
				));
			}
		}

		return {
			viewStates: result,
			reversed: reversed,
			fromLineNumber: fromLineNumber,
			fromVisualColumn: fromVisibleColumn,
			toLineNumber: toLineNumber,
			toVisualColumn: toVisibleColumn
		};
	}

	public static columnSelectLeft(config: CursorConfiguration, model: ICursorSimpleModel, prevColumnSelectData: IColumnSelectData): IColumnSelectResult {
		let toViewVisualColumn = prevColumnSelectData.toViewVisualColumn;
		if (toViewVisualColumn > 0) {
			toViewVisualColumn--;
		}

		return ColumnSelection.columnSelect(config, model, prevColumnSelectData.fromViewLineNumber, prevColumnSelectData.fromViewVisualColumn, prevColumnSelectData.toViewLineNumber, toViewVisualColumn);
	}

	public static columnSelectRight(config: CursorConfiguration, model: ICursorSimpleModel, prevColumnSelectData: IColumnSelectData): IColumnSelectResult {
		let maxVisualViewColumn = 0;
		const minViewLineNumber = Math.min(prevColumnSelectData.fromViewLineNumber, prevColumnSelectData.toViewLineNumber);
		const maxViewLineNumber = Math.max(prevColumnSelectData.fromViewLineNumber, prevColumnSelectData.toViewLineNumber);
		for (let lineNumber = minViewLineNumber; lineNumber <= maxViewLineNumber; lineNumber++) {
			const lineMaxViewColumn = model.getLineMaxColumn(lineNumber);
			const lineMaxVisualViewColumn = config.visibleColumnFromColumn(model, new Position(lineNumber, lineMaxViewColumn));
			maxVisualViewColumn = Math.max(maxVisualViewColumn, lineMaxVisualViewColumn);
		}

		let toViewVisualColumn = prevColumnSelectData.toViewVisualColumn;
		if (toViewVisualColumn < maxVisualViewColumn) {
			toViewVisualColumn++;
		}

		return this.columnSelect(config, model, prevColumnSelectData.fromViewLineNumber, prevColumnSelectData.fromViewVisualColumn, prevColumnSelectData.toViewLineNumber, toViewVisualColumn);
	}

	public static columnSelectUp(config: CursorConfiguration, model: ICursorSimpleModel, prevColumnSelectData: IColumnSelectData, isPaged: boolean): IColumnSelectResult {
		const linesCount = isPaged ? config.pageSize : 1;
		const toViewLineNumber = Math.max(1, prevColumnSelectData.toViewLineNumber - linesCount);
		return this.columnSelect(config, model, prevColumnSelectData.fromViewLineNumber, prevColumnSelectData.fromViewVisualColumn, toViewLineNumber, prevColumnSelectData.toViewVisualColumn);
	}

	public static columnSelectDown(config: CursorConfiguration, model: ICursorSimpleModel, prevColumnSelectData: IColumnSelectData, isPaged: boolean): IColumnSelectResult {
		const linesCount = isPaged ? config.pageSize : 1;
		const toViewLineNumber = Math.min(model.getLineCount(), prevColumnSelectData.toViewLineNumber + linesCount);
		return this.columnSelect(config, model, prevColumnSelectData.fromViewLineNumber, prevColumnSelectData.fromViewVisualColumn, toViewLineNumber, prevColumnSelectData.toViewVisualColumn);
	}
}

export interface IColumnSelectResult {
	viewStates: SingleCursorState[];
	reversed: boolean;
	fromLineNumber: number;
	fromVisualColumn: number;
	toLineNumber: number;
	toVisualColumn: number;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/cursor/cursorContext.ts]---
Location: vscode-main/src/vs/editor/common/cursor/cursorContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITextModel } from '../model.js';
import { CursorConfiguration, ICursorSimpleModel } from '../cursorCommon.js';
import { ICoordinatesConverter } from '../coordinatesConverter.js';

export class CursorContext {
	_cursorContextBrand: void = undefined;

	public readonly model: ITextModel;
	public readonly viewModel: ICursorSimpleModel;
	public readonly coordinatesConverter: ICoordinatesConverter;
	public readonly cursorConfig: CursorConfiguration;

	constructor(model: ITextModel, viewModel: ICursorSimpleModel, coordinatesConverter: ICoordinatesConverter, cursorConfig: CursorConfiguration) {
		this.model = model;
		this.viewModel = viewModel;
		this.coordinatesConverter = coordinatesConverter;
		this.cursorConfig = cursorConfig;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/cursor/cursorDeleteOperations.ts]---
Location: vscode-main/src/vs/editor/common/cursor/cursorDeleteOperations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as strings from '../../../base/common/strings.js';
import { ReplaceCommand } from '../commands/replaceCommand.js';
import { EditorAutoClosingEditStrategy, EditorAutoClosingStrategy } from '../config/editorOptions.js';
import { CursorConfiguration, EditOperationResult, EditOperationType, ICursorSimpleModel, isQuote } from '../cursorCommon.js';
import { CursorColumns } from '../core/cursorColumns.js';
import { MoveOperations } from './cursorMoveOperations.js';
import { Range } from '../core/range.js';
import { Selection } from '../core/selection.js';
import { ICommand } from '../editorCommon.js';
import { StandardAutoClosingPairConditional } from '../languages/languageConfiguration.js';
import { Position } from '../core/position.js';

export class DeleteOperations {

	public static deleteRight(prevEditOperationType: EditOperationType, config: CursorConfiguration, model: ICursorSimpleModel, selections: Selection[]): [boolean, Array<ICommand | null>] {
		const commands: Array<ICommand | null> = [];
		let shouldPushStackElementBefore = (prevEditOperationType !== EditOperationType.DeletingRight);
		for (let i = 0, len = selections.length; i < len; i++) {
			const selection = selections[i];

			const deleteSelection = this.getDeleteRightRange(selection, model, config);

			if (deleteSelection.isEmpty()) {
				// Probably at end of file => ignore
				commands[i] = null;
				continue;
			}

			if (deleteSelection.startLineNumber !== deleteSelection.endLineNumber) {
				shouldPushStackElementBefore = true;
			}

			commands[i] = new ReplaceCommand(deleteSelection, '');
		}
		return [shouldPushStackElementBefore, commands];
	}

	private static getDeleteRightRange(selection: Selection, model: ICursorSimpleModel, config: CursorConfiguration): Range {
		if (!selection.isEmpty()) {
			return selection;
		}

		const position = selection.getPosition();
		const rightOfPosition = MoveOperations.right(config, model, position);

		if (config.trimWhitespaceOnDelete && rightOfPosition.lineNumber !== position.lineNumber) {
			// Smart line join (deleting leading whitespace) is on
			// (and) Delete is happening at the end of a line
			const currentLineHasContent = (model.getLineFirstNonWhitespaceColumn(position.lineNumber) > 0);
			const firstNonWhitespaceColumn = model.getLineFirstNonWhitespaceColumn(rightOfPosition.lineNumber);
			if (currentLineHasContent && firstNonWhitespaceColumn > 0) {
				// The next line has content
				return new Range(
					rightOfPosition.lineNumber,
					firstNonWhitespaceColumn,
					position.lineNumber,
					position.column
				);
			}
		}

		return new Range(
			rightOfPosition.lineNumber,
			rightOfPosition.column,
			position.lineNumber,
			position.column
		);
	}

	public static isAutoClosingPairDelete(
		autoClosingDelete: EditorAutoClosingEditStrategy,
		autoClosingBrackets: EditorAutoClosingStrategy,
		autoClosingQuotes: EditorAutoClosingStrategy,
		autoClosingPairsOpen: Map<string, StandardAutoClosingPairConditional[]>,
		model: ICursorSimpleModel,
		selections: Selection[],
		autoClosedCharacters: Range[]
	): boolean {
		if (autoClosingBrackets === 'never' && autoClosingQuotes === 'never') {
			return false;
		}
		if (autoClosingDelete === 'never') {
			return false;
		}

		for (let i = 0, len = selections.length; i < len; i++) {
			const selection = selections[i];
			const position = selection.getPosition();

			if (!selection.isEmpty()) {
				return false;
			}

			const lineText = model.getLineContent(position.lineNumber);
			if (position.column < 2 || position.column >= lineText.length + 1) {
				return false;
			}
			const character = lineText.charAt(position.column - 2);

			const autoClosingPairCandidates = autoClosingPairsOpen.get(character);
			if (!autoClosingPairCandidates) {
				return false;
			}

			if (isQuote(character)) {
				if (autoClosingQuotes === 'never') {
					return false;
				}
			} else {
				if (autoClosingBrackets === 'never') {
					return false;
				}
			}

			const afterCharacter = lineText.charAt(position.column - 1);

			let foundAutoClosingPair = false;
			for (const autoClosingPairCandidate of autoClosingPairCandidates) {
				if (autoClosingPairCandidate.open === character && autoClosingPairCandidate.close === afterCharacter) {
					foundAutoClosingPair = true;
				}
			}
			if (!foundAutoClosingPair) {
				return false;
			}

			// Must delete the pair only if it was automatically inserted by the editor
			if (autoClosingDelete === 'auto') {
				let found = false;
				for (let j = 0, lenJ = autoClosedCharacters.length; j < lenJ; j++) {
					const autoClosedCharacter = autoClosedCharacters[j];
					if (position.lineNumber === autoClosedCharacter.startLineNumber && position.column === autoClosedCharacter.startColumn) {
						found = true;
						break;
					}
				}
				if (!found) {
					return false;
				}
			}
		}

		return true;
	}

	private static _runAutoClosingPairDelete(config: CursorConfiguration, model: ICursorSimpleModel, selections: Selection[]): [boolean, ICommand[]] {
		const commands: ICommand[] = [];
		for (let i = 0, len = selections.length; i < len; i++) {
			const position = selections[i].getPosition();
			const deleteSelection = new Range(
				position.lineNumber,
				position.column - 1,
				position.lineNumber,
				position.column + 1
			);
			commands[i] = new ReplaceCommand(deleteSelection, '');
		}
		return [true, commands];
	}

	public static deleteLeft(prevEditOperationType: EditOperationType, config: CursorConfiguration, model: ICursorSimpleModel, selections: Selection[], autoClosedCharacters: Range[]): [boolean, Array<ICommand | null>] {
		if (this.isAutoClosingPairDelete(config.autoClosingDelete, config.autoClosingBrackets, config.autoClosingQuotes, config.autoClosingPairs.autoClosingPairsOpenByEnd, model, selections, autoClosedCharacters)) {
			return this._runAutoClosingPairDelete(config, model, selections);
		}

		const commands: Array<ICommand | null> = [];
		let shouldPushStackElementBefore = (prevEditOperationType !== EditOperationType.DeletingLeft);
		for (let i = 0, len = selections.length; i < len; i++) {
			const deleteRange = DeleteOperations.getDeleteLeftRange(selections[i], model, config);

			// Ignore empty delete ranges, as they have no effect
			// They happen if the cursor is at the beginning of the file.
			if (deleteRange.isEmpty()) {
				commands[i] = null;
				continue;
			}

			if (deleteRange.startLineNumber !== deleteRange.endLineNumber) {
				shouldPushStackElementBefore = true;
			}

			commands[i] = new ReplaceCommand(deleteRange, '');
		}
		return [shouldPushStackElementBefore, commands];

	}

	private static getDeleteLeftRange(selection: Selection, model: ICursorSimpleModel, config: CursorConfiguration): Range {
		if (!selection.isEmpty()) {
			return selection;
		}

		const position = selection.getPosition();

		// Unintend when using tab stops and cursor is within indentation
		if (config.useTabStops && position.column > 1) {
			const lineContent = model.getLineContent(position.lineNumber);

			const firstNonWhitespaceIndex = strings.firstNonWhitespaceIndex(lineContent);
			const lastIndentationColumn = (
				firstNonWhitespaceIndex === -1
					? /* entire string is whitespace */ lineContent.length + 1
					: firstNonWhitespaceIndex + 1
			);

			if (position.column <= lastIndentationColumn) {
				const fromVisibleColumn = config.visibleColumnFromColumn(model, position);
				const toVisibleColumn = CursorColumns.prevIndentTabStop(fromVisibleColumn, config.indentSize);
				const toColumn = config.columnFromVisibleColumn(model, position.lineNumber, toVisibleColumn);
				return new Range(position.lineNumber, toColumn, position.lineNumber, position.column);
			}
		}

		return Range.fromPositions(DeleteOperations.getPositionAfterDeleteLeft(position, model), position);
	}

	private static getPositionAfterDeleteLeft(position: Position, model: ICursorSimpleModel): Position {
		if (position.column > 1) {
			// Convert 1-based columns to 0-based offsets and back.
			const idx = strings.getLeftDeleteOffset(position.column - 1, model.getLineContent(position.lineNumber));
			return position.with(undefined, idx + 1);
		} else if (position.lineNumber > 1) {
			const newLine = position.lineNumber - 1;
			return new Position(newLine, model.getLineMaxColumn(newLine));
		} else {
			return position;
		}
	}

	public static cut(config: CursorConfiguration, model: ICursorSimpleModel, selections: Selection[]): EditOperationResult {
		const commands: Array<ICommand | null> = [];
		let lastCutRange: Range | null = null;
		selections.sort((a, b) => Position.compare(a.getStartPosition(), b.getEndPosition()));
		for (let i = 0, len = selections.length; i < len; i++) {
			const selection = selections[i];

			if (selection.isEmpty()) {
				if (config.emptySelectionClipboard) {
					// This is a full line cut

					const position = selection.getPosition();

					let startLineNumber: number,
						startColumn: number,
						endLineNumber: number,
						endColumn: number;

					if (position.lineNumber < model.getLineCount()) {
						// Cutting a line in the middle of the model
						startLineNumber = position.lineNumber;
						startColumn = 1;
						endLineNumber = position.lineNumber + 1;
						endColumn = 1;
					} else if (position.lineNumber > 1 && lastCutRange?.endLineNumber !== position.lineNumber) {
						// Cutting the last line & there are more than 1 lines in the model & a previous cut operation does not touch the current cut operation
						startLineNumber = position.lineNumber - 1;
						startColumn = model.getLineMaxColumn(position.lineNumber - 1);
						endLineNumber = position.lineNumber;
						endColumn = model.getLineMaxColumn(position.lineNumber);
					} else {
						// Cutting the single line that the model contains
						startLineNumber = position.lineNumber;
						startColumn = 1;
						endLineNumber = position.lineNumber;
						endColumn = model.getLineMaxColumn(position.lineNumber);
					}

					const deleteSelection = new Range(
						startLineNumber,
						startColumn,
						endLineNumber,
						endColumn
					);
					lastCutRange = deleteSelection;

					if (!deleteSelection.isEmpty()) {
						commands[i] = new ReplaceCommand(deleteSelection, '');
					} else {
						commands[i] = null;
					}
				} else {
					// Cannot cut empty selection
					commands[i] = null;
				}
			} else {
				commands[i] = new ReplaceCommand(selection, '');
			}
		}
		return new EditOperationResult(EditOperationType.Other, commands, {
			shouldPushStackElementBefore: true,
			shouldPushStackElementAfter: true
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/cursor/cursorMoveCommands.ts]---
Location: vscode-main/src/vs/editor/common/cursor/cursorMoveCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as types from '../../../base/common/types.js';
import { CursorState, ICursorSimpleModel, PartialCursorState, SelectionStartKind, SingleCursorState } from '../cursorCommon.js';
import { MoveOperations } from './cursorMoveOperations.js';
import { WordOperations } from './cursorWordOperations.js';
import { IPosition, Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { ICommandMetadata } from '../../../platform/commands/common/commands.js';
import { IViewModel } from '../viewModel.js';
import { TextDirection } from '../model.js';

export class CursorMoveCommands {

	public static addCursorDown(viewModel: IViewModel, cursors: CursorState[], useLogicalLine: boolean): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		let resultLen = 0;
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];
			result[resultLen++] = new CursorState(cursor.modelState, cursor.viewState);
			if (useLogicalLine) {
				result[resultLen++] = CursorState.fromModelState(MoveOperations.translateDown(viewModel.cursorConfig, viewModel.model, cursor.modelState));
			} else {
				result[resultLen++] = CursorState.fromViewState(MoveOperations.translateDown(viewModel.cursorConfig, viewModel, cursor.viewState));
			}
		}
		return result;
	}

	public static addCursorUp(viewModel: IViewModel, cursors: CursorState[], useLogicalLine: boolean): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		let resultLen = 0;
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];
			result[resultLen++] = new CursorState(cursor.modelState, cursor.viewState);
			if (useLogicalLine) {
				result[resultLen++] = CursorState.fromModelState(MoveOperations.translateUp(viewModel.cursorConfig, viewModel.model, cursor.modelState));
			} else {
				result[resultLen++] = CursorState.fromViewState(MoveOperations.translateUp(viewModel.cursorConfig, viewModel, cursor.viewState));
			}
		}
		return result;
	}

	public static moveToBeginningOfLine(viewModel: IViewModel, cursors: CursorState[], inSelectionMode: boolean): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];
			result[i] = this._moveToLineStart(viewModel, cursor, inSelectionMode);
		}

		return result;
	}

	private static _moveToLineStart(viewModel: IViewModel, cursor: CursorState, inSelectionMode: boolean): PartialCursorState {
		const currentViewStateColumn = cursor.viewState.position.column;
		const currentModelStateColumn = cursor.modelState.position.column;
		const isFirstLineOfWrappedLine = currentViewStateColumn === currentModelStateColumn;

		const currentViewStatelineNumber = cursor.viewState.position.lineNumber;
		const firstNonBlankColumn = viewModel.getLineFirstNonWhitespaceColumn(currentViewStatelineNumber);
		const isBeginningOfViewLine = currentViewStateColumn === firstNonBlankColumn;

		if (!isFirstLineOfWrappedLine && !isBeginningOfViewLine) {
			return this._moveToLineStartByView(viewModel, cursor, inSelectionMode);
		} else {
			return this._moveToLineStartByModel(viewModel, cursor, inSelectionMode);
		}
	}

	private static _moveToLineStartByView(viewModel: IViewModel, cursor: CursorState, inSelectionMode: boolean): PartialCursorState {
		return CursorState.fromViewState(
			MoveOperations.moveToBeginningOfLine(viewModel.cursorConfig, viewModel, cursor.viewState, inSelectionMode)
		);
	}

	private static _moveToLineStartByModel(viewModel: IViewModel, cursor: CursorState, inSelectionMode: boolean): PartialCursorState {
		return CursorState.fromModelState(
			MoveOperations.moveToBeginningOfLine(viewModel.cursorConfig, viewModel.model, cursor.modelState, inSelectionMode)
		);
	}

	public static moveToEndOfLine(viewModel: IViewModel, cursors: CursorState[], inSelectionMode: boolean, sticky: boolean): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];
			result[i] = this._moveToLineEnd(viewModel, cursor, inSelectionMode, sticky);
		}

		return result;
	}

	private static _moveToLineEnd(viewModel: IViewModel, cursor: CursorState, inSelectionMode: boolean, sticky: boolean): PartialCursorState {
		const viewStatePosition = cursor.viewState.position;
		const viewModelMaxColumn = viewModel.getLineMaxColumn(viewStatePosition.lineNumber);
		const isEndOfViewLine = viewStatePosition.column === viewModelMaxColumn;

		const modelStatePosition = cursor.modelState.position;
		const modelMaxColumn = viewModel.model.getLineMaxColumn(modelStatePosition.lineNumber);
		const isEndLineOfWrappedLine = viewModelMaxColumn - viewStatePosition.column === modelMaxColumn - modelStatePosition.column;

		if (isEndOfViewLine || isEndLineOfWrappedLine) {
			return this._moveToLineEndByModel(viewModel, cursor, inSelectionMode, sticky);
		} else {
			return this._moveToLineEndByView(viewModel, cursor, inSelectionMode, sticky);
		}
	}

	private static _moveToLineEndByView(viewModel: IViewModel, cursor: CursorState, inSelectionMode: boolean, sticky: boolean): PartialCursorState {
		return CursorState.fromViewState(
			MoveOperations.moveToEndOfLine(viewModel.cursorConfig, viewModel, cursor.viewState, inSelectionMode, sticky)
		);
	}

	private static _moveToLineEndByModel(viewModel: IViewModel, cursor: CursorState, inSelectionMode: boolean, sticky: boolean): PartialCursorState {
		return CursorState.fromModelState(
			MoveOperations.moveToEndOfLine(viewModel.cursorConfig, viewModel.model, cursor.modelState, inSelectionMode, sticky)
		);
	}

	public static expandLineSelection(viewModel: IViewModel, cursors: CursorState[]): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];

			const startLineNumber = cursor.modelState.selection.startLineNumber;
			const lineCount = viewModel.model.getLineCount();

			let endLineNumber = cursor.modelState.selection.endLineNumber;
			let endColumn: number;
			if (endLineNumber === lineCount) {
				endColumn = viewModel.model.getLineMaxColumn(lineCount);
			} else {
				endLineNumber++;
				endColumn = 1;
			}

			result[i] = CursorState.fromModelState(new SingleCursorState(
				new Range(startLineNumber, 1, startLineNumber, 1), SelectionStartKind.Simple, 0,
				new Position(endLineNumber, endColumn), 0
			));
		}
		return result;
	}

	public static moveToBeginningOfBuffer(viewModel: IViewModel, cursors: CursorState[], inSelectionMode: boolean): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];
			result[i] = CursorState.fromModelState(MoveOperations.moveToBeginningOfBuffer(viewModel.cursorConfig, viewModel.model, cursor.modelState, inSelectionMode));
		}
		return result;
	}

	public static moveToEndOfBuffer(viewModel: IViewModel, cursors: CursorState[], inSelectionMode: boolean): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];
			result[i] = CursorState.fromModelState(MoveOperations.moveToEndOfBuffer(viewModel.cursorConfig, viewModel.model, cursor.modelState, inSelectionMode));
		}
		return result;
	}

	public static selectAll(viewModel: IViewModel, cursor: CursorState): PartialCursorState {
		const lineCount = viewModel.model.getLineCount();
		const maxColumn = viewModel.model.getLineMaxColumn(lineCount);

		return CursorState.fromModelState(new SingleCursorState(
			new Range(1, 1, 1, 1), SelectionStartKind.Simple, 0,
			new Position(lineCount, maxColumn), 0
		));
	}

	public static line(viewModel: IViewModel, cursor: CursorState, inSelectionMode: boolean, _position: IPosition, _viewPosition: IPosition | undefined): PartialCursorState {
		const position = viewModel.model.validatePosition(_position);
		const viewPosition = (
			_viewPosition
				? viewModel.coordinatesConverter.validateViewPosition(new Position(_viewPosition.lineNumber, _viewPosition.column), position)
				: viewModel.coordinatesConverter.convertModelPositionToViewPosition(position)
		);

		if (!inSelectionMode) {
			// Entering line selection for the first time
			const lineCount = viewModel.model.getLineCount();

			let selectToLineNumber = position.lineNumber + 1;
			let selectToColumn = 1;
			if (selectToLineNumber > lineCount) {
				selectToLineNumber = lineCount;
				selectToColumn = viewModel.model.getLineMaxColumn(selectToLineNumber);
			}

			return CursorState.fromModelState(new SingleCursorState(
				new Range(position.lineNumber, 1, selectToLineNumber, selectToColumn), SelectionStartKind.Line, 0,
				new Position(selectToLineNumber, selectToColumn), 0
			));
		}

		// Continuing line selection
		const enteringLineNumber = cursor.modelState.selectionStart.getStartPosition().lineNumber;

		if (position.lineNumber < enteringLineNumber) {

			return CursorState.fromViewState(cursor.viewState.move(
				true, viewPosition.lineNumber, 1, 0
			));

		} else if (position.lineNumber > enteringLineNumber) {

			const lineCount = viewModel.getLineCount();

			let selectToViewLineNumber = viewPosition.lineNumber + 1;
			let selectToViewColumn = 1;
			if (selectToViewLineNumber > lineCount) {
				selectToViewLineNumber = lineCount;
				selectToViewColumn = viewModel.getLineMaxColumn(selectToViewLineNumber);
			}

			return CursorState.fromViewState(cursor.viewState.move(
				true, selectToViewLineNumber, selectToViewColumn, 0
			));

		} else {

			const endPositionOfSelectionStart = cursor.modelState.selectionStart.getEndPosition();
			return CursorState.fromModelState(cursor.modelState.move(
				true, endPositionOfSelectionStart.lineNumber, endPositionOfSelectionStart.column, 0
			));

		}
	}

	public static word(viewModel: IViewModel, cursor: CursorState, inSelectionMode: boolean, _position: IPosition): PartialCursorState {
		const position = viewModel.model.validatePosition(_position);
		return CursorState.fromModelState(WordOperations.word(viewModel.cursorConfig, viewModel.model, cursor.modelState, inSelectionMode, position));
	}

	public static cancelSelection(viewModel: IViewModel, cursor: CursorState): PartialCursorState {
		if (!cursor.modelState.hasSelection()) {
			return new CursorState(cursor.modelState, cursor.viewState);
		}

		const lineNumber = cursor.viewState.position.lineNumber;
		const column = cursor.viewState.position.column;

		return CursorState.fromViewState(new SingleCursorState(
			new Range(lineNumber, column, lineNumber, column), SelectionStartKind.Simple, 0,
			new Position(lineNumber, column), 0
		));
	}

	public static moveTo(viewModel: IViewModel, cursor: CursorState, inSelectionMode: boolean, _position: IPosition, _viewPosition: IPosition | undefined): PartialCursorState {
		if (inSelectionMode) {
			if (cursor.modelState.selectionStartKind === SelectionStartKind.Word) {
				return this.word(viewModel, cursor, inSelectionMode, _position);
			}
			if (cursor.modelState.selectionStartKind === SelectionStartKind.Line) {
				return this.line(viewModel, cursor, inSelectionMode, _position, _viewPosition);
			}
		}
		const position = viewModel.model.validatePosition(_position);
		const viewPosition = (
			_viewPosition
				? viewModel.coordinatesConverter.validateViewPosition(new Position(_viewPosition.lineNumber, _viewPosition.column), position)
				: viewModel.coordinatesConverter.convertModelPositionToViewPosition(position)
		);
		return CursorState.fromViewState(cursor.viewState.move(inSelectionMode, viewPosition.lineNumber, viewPosition.column, 0));
	}

	public static simpleMove(viewModel: IViewModel, cursors: CursorState[], direction: CursorMove.SimpleMoveDirection, inSelectionMode: boolean, value: number, unit: CursorMove.Unit): PartialCursorState[] | null {
		switch (direction) {
			case CursorMove.Direction.Left: {
				if (unit === CursorMove.Unit.HalfLine) {
					// Move left by half the current line length
					return this._moveHalfLineLeft(viewModel, cursors, inSelectionMode);
				} else {
					// Move left by `moveParams.value` columns
					return this._moveLeft(viewModel, cursors, inSelectionMode, value);
				}
			}
			case CursorMove.Direction.Right: {
				if (unit === CursorMove.Unit.HalfLine) {
					// Move right by half the current line length
					return this._moveHalfLineRight(viewModel, cursors, inSelectionMode);
				} else {
					// Move right by `moveParams.value` columns
					return this._moveRight(viewModel, cursors, inSelectionMode, value);
				}
			}
			case CursorMove.Direction.Up: {
				if (unit === CursorMove.Unit.WrappedLine) {
					// Move up by view lines
					return this._moveUpByViewLines(viewModel, cursors, inSelectionMode, value);
				} else {
					// Move up by model lines
					return this._moveUpByModelLines(viewModel, cursors, inSelectionMode, value);
				}
			}
			case CursorMove.Direction.Down: {
				if (unit === CursorMove.Unit.WrappedLine) {
					// Move down by view lines
					return this._moveDownByViewLines(viewModel, cursors, inSelectionMode, value);
				} else {
					// Move down by model lines
					return this._moveDownByModelLines(viewModel, cursors, inSelectionMode, value);
				}
			}
			case CursorMove.Direction.PrevBlankLine: {
				if (unit === CursorMove.Unit.WrappedLine) {
					return cursors.map(cursor => CursorState.fromViewState(MoveOperations.moveToPrevBlankLine(viewModel.cursorConfig, viewModel, cursor.viewState, inSelectionMode)));
				} else {
					return cursors.map(cursor => CursorState.fromModelState(MoveOperations.moveToPrevBlankLine(viewModel.cursorConfig, viewModel.model, cursor.modelState, inSelectionMode)));
				}
			}
			case CursorMove.Direction.NextBlankLine: {
				if (unit === CursorMove.Unit.WrappedLine) {
					return cursors.map(cursor => CursorState.fromViewState(MoveOperations.moveToNextBlankLine(viewModel.cursorConfig, viewModel, cursor.viewState, inSelectionMode)));
				} else {
					return cursors.map(cursor => CursorState.fromModelState(MoveOperations.moveToNextBlankLine(viewModel.cursorConfig, viewModel.model, cursor.modelState, inSelectionMode)));
				}
			}
			case CursorMove.Direction.WrappedLineStart: {
				// Move to the beginning of the current view line
				return this._moveToViewMinColumn(viewModel, cursors, inSelectionMode);
			}
			case CursorMove.Direction.WrappedLineFirstNonWhitespaceCharacter: {
				// Move to the first non-whitespace column of the current view line
				return this._moveToViewFirstNonWhitespaceColumn(viewModel, cursors, inSelectionMode);
			}
			case CursorMove.Direction.WrappedLineColumnCenter: {
				// Move to the "center" of the current view line
				return this._moveToViewCenterColumn(viewModel, cursors, inSelectionMode);
			}
			case CursorMove.Direction.WrappedLineEnd: {
				// Move to the end of the current view line
				return this._moveToViewMaxColumn(viewModel, cursors, inSelectionMode);
			}
			case CursorMove.Direction.WrappedLineLastNonWhitespaceCharacter: {
				// Move to the last non-whitespace column of the current view line
				return this._moveToViewLastNonWhitespaceColumn(viewModel, cursors, inSelectionMode);
			}
			default:
				return null;
		}

	}

	public static viewportMove(viewModel: IViewModel, cursors: CursorState[], direction: CursorMove.ViewportDirection, inSelectionMode: boolean, value: number): PartialCursorState[] | null {
		const visibleViewRange = viewModel.getCompletelyVisibleViewRange();
		const visibleModelRange = viewModel.coordinatesConverter.convertViewRangeToModelRange(visibleViewRange);
		switch (direction) {
			case CursorMove.Direction.ViewPortTop: {
				// Move to the nth line start in the viewport (from the top)
				const modelLineNumber = this._firstLineNumberInRange(viewModel.model, visibleModelRange, value);
				const modelColumn = viewModel.model.getLineFirstNonWhitespaceColumn(modelLineNumber);
				return [this._moveToModelPosition(viewModel, cursors[0], inSelectionMode, modelLineNumber, modelColumn)];
			}
			case CursorMove.Direction.ViewPortBottom: {
				// Move to the nth line start in the viewport (from the bottom)
				const modelLineNumber = this._lastLineNumberInRange(viewModel.model, visibleModelRange, value);
				const modelColumn = viewModel.model.getLineFirstNonWhitespaceColumn(modelLineNumber);
				return [this._moveToModelPosition(viewModel, cursors[0], inSelectionMode, modelLineNumber, modelColumn)];
			}
			case CursorMove.Direction.ViewPortCenter: {
				// Move to the line start in the viewport center
				const modelLineNumber = Math.round((visibleModelRange.startLineNumber + visibleModelRange.endLineNumber) / 2);
				const modelColumn = viewModel.model.getLineFirstNonWhitespaceColumn(modelLineNumber);
				return [this._moveToModelPosition(viewModel, cursors[0], inSelectionMode, modelLineNumber, modelColumn)];
			}
			case CursorMove.Direction.ViewPortIfOutside: {
				// Move to a position inside the viewport
				const result: PartialCursorState[] = [];
				for (let i = 0, len = cursors.length; i < len; i++) {
					const cursor = cursors[i];
					result[i] = this.findPositionInViewportIfOutside(viewModel, cursor, visibleViewRange, inSelectionMode);
				}
				return result;
			}
			default:
				return null;
		}
	}

	public static findPositionInViewportIfOutside(viewModel: IViewModel, cursor: CursorState, visibleViewRange: Range, inSelectionMode: boolean): PartialCursorState {
		const viewLineNumber = cursor.viewState.position.lineNumber;

		if (visibleViewRange.startLineNumber <= viewLineNumber && viewLineNumber <= visibleViewRange.endLineNumber - 1) {
			// Nothing to do, cursor is in viewport
			return new CursorState(cursor.modelState, cursor.viewState);

		} else {
			let newViewLineNumber: number;
			if (viewLineNumber > visibleViewRange.endLineNumber - 1) {
				newViewLineNumber = visibleViewRange.endLineNumber - 1;
			} else if (viewLineNumber < visibleViewRange.startLineNumber) {
				newViewLineNumber = visibleViewRange.startLineNumber;
			} else {
				newViewLineNumber = viewLineNumber;
			}
			const position = MoveOperations.vertical(viewModel.cursorConfig, viewModel, viewLineNumber, cursor.viewState.position.column, cursor.viewState.leftoverVisibleColumns, newViewLineNumber, false);
			return CursorState.fromViewState(cursor.viewState.move(inSelectionMode, position.lineNumber, position.column, position.leftoverVisibleColumns));
		}
	}

	/**
	 * Find the nth line start included in the range (from the start).
	 */
	private static _firstLineNumberInRange(model: ICursorSimpleModel, range: Range, count: number): number {
		let startLineNumber = range.startLineNumber;
		if (range.startColumn !== model.getLineMinColumn(startLineNumber)) {
			// Move on to the second line if the first line start is not included in the range
			startLineNumber++;
		}

		return Math.min(range.endLineNumber, startLineNumber + count - 1);
	}

	/**
	 * Find the nth line start included in the range (from the end).
	 */
	private static _lastLineNumberInRange(model: ICursorSimpleModel, range: Range, count: number): number {
		let startLineNumber = range.startLineNumber;
		if (range.startColumn !== model.getLineMinColumn(startLineNumber)) {
			// Move on to the second line if the first line start is not included in the range
			startLineNumber++;
		}

		return Math.max(startLineNumber, range.endLineNumber - count + 1);
	}

	private static _moveLeft(viewModel: IViewModel, cursors: CursorState[], inSelectionMode: boolean, noOfColumns: number): PartialCursorState[] {
		return cursors.map(cursor => {
			const direction = viewModel.getTextDirection(cursor.viewState.position.lineNumber);
			const isRtl = direction === TextDirection.RTL;

			return CursorState.fromViewState(
				isRtl
					? MoveOperations.moveRight(viewModel.cursorConfig, viewModel, cursor.viewState, inSelectionMode, noOfColumns)
					: MoveOperations.moveLeft(viewModel.cursorConfig, viewModel, cursor.viewState, inSelectionMode, noOfColumns)
			);
		});
	}

	private static _moveHalfLineLeft(viewModel: IViewModel, cursors: CursorState[], inSelectionMode: boolean): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];
			const viewLineNumber = cursor.viewState.position.lineNumber;
			const halfLine = Math.round(viewModel.getLineLength(viewLineNumber) / 2);
			result[i] = CursorState.fromViewState(MoveOperations.moveLeft(viewModel.cursorConfig, viewModel, cursor.viewState, inSelectionMode, halfLine));
		}
		return result;
	}

	private static _moveRight(viewModel: IViewModel, cursors: CursorState[], inSelectionMode: boolean, noOfColumns: number): PartialCursorState[] {
		return cursors.map(cursor => {
			const direction = viewModel.getTextDirection(cursor.viewState.position.lineNumber);
			const isRtl = direction === TextDirection.RTL;

			return CursorState.fromViewState(
				isRtl
					? MoveOperations.moveLeft(viewModel.cursorConfig, viewModel, cursor.viewState, inSelectionMode, noOfColumns)
					: MoveOperations.moveRight(viewModel.cursorConfig, viewModel, cursor.viewState, inSelectionMode, noOfColumns)
			);
		});
	}

	private static _moveHalfLineRight(viewModel: IViewModel, cursors: CursorState[], inSelectionMode: boolean): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];
			const viewLineNumber = cursor.viewState.position.lineNumber;
			const halfLine = Math.round(viewModel.getLineLength(viewLineNumber) / 2);
			result[i] = CursorState.fromViewState(MoveOperations.moveRight(viewModel.cursorConfig, viewModel, cursor.viewState, inSelectionMode, halfLine));
		}
		return result;
	}

	private static _moveDownByViewLines(viewModel: IViewModel, cursors: CursorState[], inSelectionMode: boolean, linesCount: number): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];
			result[i] = CursorState.fromViewState(MoveOperations.moveDown(viewModel.cursorConfig, viewModel, cursor.viewState, inSelectionMode, linesCount));
		}
		return result;
	}

	private static _moveDownByModelLines(viewModel: IViewModel, cursors: CursorState[], inSelectionMode: boolean, linesCount: number): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];
			result[i] = CursorState.fromModelState(MoveOperations.moveDown(viewModel.cursorConfig, viewModel.model, cursor.modelState, inSelectionMode, linesCount));
		}
		return result;
	}

	private static _moveUpByViewLines(viewModel: IViewModel, cursors: CursorState[], inSelectionMode: boolean, linesCount: number): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];
			result[i] = CursorState.fromViewState(MoveOperations.moveUp(viewModel.cursorConfig, viewModel, cursor.viewState, inSelectionMode, linesCount));
		}
		return result;
	}

	private static _moveUpByModelLines(viewModel: IViewModel, cursors: CursorState[], inSelectionMode: boolean, linesCount: number): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];
			result[i] = CursorState.fromModelState(MoveOperations.moveUp(viewModel.cursorConfig, viewModel.model, cursor.modelState, inSelectionMode, linesCount));
		}
		return result;
	}

	private static _moveToViewPosition(viewModel: IViewModel, cursor: CursorState, inSelectionMode: boolean, toViewLineNumber: number, toViewColumn: number): PartialCursorState {
		return CursorState.fromViewState(cursor.viewState.move(inSelectionMode, toViewLineNumber, toViewColumn, 0));
	}

	private static _moveToModelPosition(viewModel: IViewModel, cursor: CursorState, inSelectionMode: boolean, toModelLineNumber: number, toModelColumn: number): PartialCursorState {
		return CursorState.fromModelState(cursor.modelState.move(inSelectionMode, toModelLineNumber, toModelColumn, 0));
	}

	private static _moveToViewMinColumn(viewModel: IViewModel, cursors: CursorState[], inSelectionMode: boolean): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];
			const viewLineNumber = cursor.viewState.position.lineNumber;
			const viewColumn = viewModel.getLineMinColumn(viewLineNumber);
			result[i] = this._moveToViewPosition(viewModel, cursor, inSelectionMode, viewLineNumber, viewColumn);
		}
		return result;
	}

	private static _moveToViewFirstNonWhitespaceColumn(viewModel: IViewModel, cursors: CursorState[], inSelectionMode: boolean): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];
			const viewLineNumber = cursor.viewState.position.lineNumber;
			const viewColumn = viewModel.getLineFirstNonWhitespaceColumn(viewLineNumber);
			result[i] = this._moveToViewPosition(viewModel, cursor, inSelectionMode, viewLineNumber, viewColumn);
		}
		return result;
	}

	private static _moveToViewCenterColumn(viewModel: IViewModel, cursors: CursorState[], inSelectionMode: boolean): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];
			const viewLineNumber = cursor.viewState.position.lineNumber;
			const viewColumn = Math.round((viewModel.getLineMaxColumn(viewLineNumber) + viewModel.getLineMinColumn(viewLineNumber)) / 2);
			result[i] = this._moveToViewPosition(viewModel, cursor, inSelectionMode, viewLineNumber, viewColumn);
		}
		return result;
	}

	private static _moveToViewMaxColumn(viewModel: IViewModel, cursors: CursorState[], inSelectionMode: boolean): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];
			const viewLineNumber = cursor.viewState.position.lineNumber;
			const viewColumn = viewModel.getLineMaxColumn(viewLineNumber);
			result[i] = this._moveToViewPosition(viewModel, cursor, inSelectionMode, viewLineNumber, viewColumn);
		}
		return result;
	}

	private static _moveToViewLastNonWhitespaceColumn(viewModel: IViewModel, cursors: CursorState[], inSelectionMode: boolean): PartialCursorState[] {
		const result: PartialCursorState[] = [];
		for (let i = 0, len = cursors.length; i < len; i++) {
			const cursor = cursors[i];
			const viewLineNumber = cursor.viewState.position.lineNumber;
			const viewColumn = viewModel.getLineLastNonWhitespaceColumn(viewLineNumber);
			result[i] = this._moveToViewPosition(viewModel, cursor, inSelectionMode, viewLineNumber, viewColumn);
		}
		return result;
	}
}

export namespace CursorMove {

	const isCursorMoveArgs = function (arg: unknown): boolean {
		if (!types.isObject(arg)) {
			return false;
		}

		const cursorMoveArg: RawArguments = arg as RawArguments;

		if (!types.isString(cursorMoveArg.to)) {
			return false;
		}

		if (!types.isUndefined(cursorMoveArg.select) && !types.isBoolean(cursorMoveArg.select)) {
			return false;
		}

		if (!types.isUndefined(cursorMoveArg.by) && !types.isString(cursorMoveArg.by)) {
			return false;
		}

		if (!types.isUndefined(cursorMoveArg.value) && !types.isNumber(cursorMoveArg.value)) {
			return false;
		}

		if (!types.isUndefined(cursorMoveArg.noHistory) && !types.isBoolean(cursorMoveArg.noHistory)) {
			return false;
		}

		return true;
	};

	export const metadata: ICommandMetadata = {
		description: 'Move cursor to a logical position in the view',
		args: [
			{
				name: 'Cursor move argument object',
				description: `Property-value pairs that can be passed through this argument:
					* 'to': A mandatory logical position value providing where to move the cursor.
						\`\`\`
						'left', 'right', 'up', 'down', 'prevBlankLine', 'nextBlankLine',
						'wrappedLineStart', 'wrappedLineEnd', 'wrappedLineColumnCenter'
						'wrappedLineFirstNonWhitespaceCharacter', 'wrappedLineLastNonWhitespaceCharacter'
						'viewPortTop', 'viewPortCenter', 'viewPortBottom', 'viewPortIfOutside'
						\`\`\`
					* 'by': Unit to move. Default is computed based on 'to' value.
						\`\`\`
						'line', 'wrappedLine', 'character', 'halfLine'
						\`\`\`
					* 'value': Number of units to move. Default is '1'.
					* 'select': If 'true' makes the selection. Default is 'false'.
					* 'noHistory': If 'true' does not add the movement to navigation history. Default is 'false'.
				`,
				constraint: isCursorMoveArgs,
				schema: {
					'type': 'object',
					'required': ['to'],
					'properties': {
						'to': {
							'type': 'string',
							'enum': ['left', 'right', 'up', 'down', 'prevBlankLine', 'nextBlankLine', 'wrappedLineStart', 'wrappedLineEnd', 'wrappedLineColumnCenter', 'wrappedLineFirstNonWhitespaceCharacter', 'wrappedLineLastNonWhitespaceCharacter', 'viewPortTop', 'viewPortCenter', 'viewPortBottom', 'viewPortIfOutside']
						},
						'by': {
							'type': 'string',
							'enum': ['line', 'wrappedLine', 'character', 'halfLine']
						},
						'value': {
							'type': 'number',
							'default': 1
						},
						'select': {
							'type': 'boolean',
							'default': false
						},
						'noHistory': {
							'type': 'boolean',
							'default': false
						}
					}
				}
			}
		]
	};

	/**
	 * Positions in the view for cursor move command.
	 */
	export const RawDirection = {
		Left: 'left',
		Right: 'right',
		Up: 'up',
		Down: 'down',

		PrevBlankLine: 'prevBlankLine',
		NextBlankLine: 'nextBlankLine',

		WrappedLineStart: 'wrappedLineStart',
		WrappedLineFirstNonWhitespaceCharacter: 'wrappedLineFirstNonWhitespaceCharacter',
		WrappedLineColumnCenter: 'wrappedLineColumnCenter',
		WrappedLineEnd: 'wrappedLineEnd',
		WrappedLineLastNonWhitespaceCharacter: 'wrappedLineLastNonWhitespaceCharacter',

		ViewPortTop: 'viewPortTop',
		ViewPortCenter: 'viewPortCenter',
		ViewPortBottom: 'viewPortBottom',

		ViewPortIfOutside: 'viewPortIfOutside'
	};

	/**
	 * Units for Cursor move 'by' argument
	 */
	export const RawUnit = {
		Line: 'line',
		WrappedLine: 'wrappedLine',
		Character: 'character',
		HalfLine: 'halfLine'
	};

	/**
	 * Arguments for Cursor move command
	 */
	export interface RawArguments {
		to: string;
		select?: boolean;
		by?: string;
		value?: number;
		noHistory?: boolean;
	}

	export function parse(args: Partial<RawArguments>): ParsedArguments | null {
		if (!args.to) {
			// illegal arguments
			return null;
		}

		let direction: Direction;
		switch (args.to) {
			case RawDirection.Left:
				direction = Direction.Left;
				break;
			case RawDirection.Right:
				direction = Direction.Right;
				break;
			case RawDirection.Up:
				direction = Direction.Up;
				break;
			case RawDirection.Down:
				direction = Direction.Down;
				break;
			case RawDirection.PrevBlankLine:
				direction = Direction.PrevBlankLine;
				break;
			case RawDirection.NextBlankLine:
				direction = Direction.NextBlankLine;
				break;
			case RawDirection.WrappedLineStart:
				direction = Direction.WrappedLineStart;
				break;
			case RawDirection.WrappedLineFirstNonWhitespaceCharacter:
				direction = Direction.WrappedLineFirstNonWhitespaceCharacter;
				break;
			case RawDirection.WrappedLineColumnCenter:
				direction = Direction.WrappedLineColumnCenter;
				break;
			case RawDirection.WrappedLineEnd:
				direction = Direction.WrappedLineEnd;
				break;
			case RawDirection.WrappedLineLastNonWhitespaceCharacter:
				direction = Direction.WrappedLineLastNonWhitespaceCharacter;
				break;
			case RawDirection.ViewPortTop:
				direction = Direction.ViewPortTop;
				break;
			case RawDirection.ViewPortBottom:
				direction = Direction.ViewPortBottom;
				break;
			case RawDirection.ViewPortCenter:
				direction = Direction.ViewPortCenter;
				break;
			case RawDirection.ViewPortIfOutside:
				direction = Direction.ViewPortIfOutside;
				break;
			default:
				// illegal arguments
				return null;
		}

		let unit = Unit.None;
		switch (args.by) {
			case RawUnit.Line:
				unit = Unit.Line;
				break;
			case RawUnit.WrappedLine:
				unit = Unit.WrappedLine;
				break;
			case RawUnit.Character:
				unit = Unit.Character;
				break;
			case RawUnit.HalfLine:
				unit = Unit.HalfLine;
				break;
		}

		return {
			direction: direction,
			unit: unit,
			select: (!!args.select),
			value: (args.value || 1),
			noHistory: (!!args.noHistory)
		};
	}

	export interface ParsedArguments {
		direction: Direction;
		unit: Unit;
		select: boolean;
		value: number;
		noHistory: boolean;
	}

	export interface SimpleMoveArguments {
		direction: SimpleMoveDirection;
		unit: Unit;
		select: boolean;
		value: number;
	}

	export const enum Direction {
		Left,
		Right,
		Up,
		Down,
		PrevBlankLine,
		NextBlankLine,

		WrappedLineStart,
		WrappedLineFirstNonWhitespaceCharacter,
		WrappedLineColumnCenter,
		WrappedLineEnd,
		WrappedLineLastNonWhitespaceCharacter,

		ViewPortTop,
		ViewPortCenter,
		ViewPortBottom,

		ViewPortIfOutside,
	}

	export type SimpleMoveDirection = (
		Direction.Left
		| Direction.Right
		| Direction.Up
		| Direction.Down
		| Direction.PrevBlankLine
		| Direction.NextBlankLine
		| Direction.WrappedLineStart
		| Direction.WrappedLineFirstNonWhitespaceCharacter
		| Direction.WrappedLineColumnCenter
		| Direction.WrappedLineEnd
		| Direction.WrappedLineLastNonWhitespaceCharacter
	);

	export type ViewportDirection = (
		Direction.ViewPortTop
		| Direction.ViewPortCenter
		| Direction.ViewPortBottom
		| Direction.ViewPortIfOutside
	);

	export const enum Unit {
		None,
		Line,
		WrappedLine,
		Character,
		HalfLine,
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/cursor/cursorMoveOperations.ts]---
Location: vscode-main/src/vs/editor/common/cursor/cursorMoveOperations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as strings from '../../../base/common/strings.js';
import { Constants } from '../../../base/common/uint.js';
import { CursorColumns } from '../core/cursorColumns.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { AtomicTabMoveOperations, Direction } from './cursorAtomicMoveOperations.js';
import { CursorConfiguration, ICursorSimpleModel, SelectionStartKind, SingleCursorState } from '../cursorCommon.js';
import { PositionAffinity } from '../model.js';

export class CursorPosition {
	_cursorPositionBrand: void = undefined;

	public readonly lineNumber: number;
	public readonly column: number;
	public readonly leftoverVisibleColumns: number;

	constructor(lineNumber: number, column: number, leftoverVisibleColumns: number) {
		this.lineNumber = lineNumber;
		this.column = column;
		this.leftoverVisibleColumns = leftoverVisibleColumns;
	}
}

export class MoveOperations {
	public static leftPosition(model: ICursorSimpleModel, position: Position): Position {
		if (position.column > model.getLineMinColumn(position.lineNumber)) {
			return position.delta(undefined, -strings.prevCharLength(model.getLineContent(position.lineNumber), position.column - 1));
		} else if (position.lineNumber > 1) {
			const newLineNumber = position.lineNumber - 1;
			return new Position(newLineNumber, model.getLineMaxColumn(newLineNumber));
		} else {
			return position;
		}
	}

	private static leftPositionAtomicSoftTabs(model: ICursorSimpleModel, position: Position, tabSize: number): Position {
		if (position.column <= model.getLineIndentColumn(position.lineNumber)) {
			const minColumn = model.getLineMinColumn(position.lineNumber);
			const lineContent = model.getLineContent(position.lineNumber);
			const newPosition = AtomicTabMoveOperations.atomicPosition(lineContent, position.column - 1, tabSize, Direction.Left);
			if (newPosition !== -1 && newPosition + 1 >= minColumn) {
				return new Position(position.lineNumber, newPosition + 1);
			}
		}
		return this.leftPosition(model, position);
	}

	private static left(config: CursorConfiguration, model: ICursorSimpleModel, position: Position): CursorPosition {
		const pos = config.stickyTabStops
			? MoveOperations.leftPositionAtomicSoftTabs(model, position, config.tabSize)
			: MoveOperations.leftPosition(model, position);
		return new CursorPosition(pos.lineNumber, pos.column, 0);
	}

	/**
	 * @param noOfColumns Must be either `1`
	 * or `Math.round(viewModel.getLineContent(viewLineNumber).length / 2)` (for half lines).
	*/
	public static moveLeft(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean, noOfColumns: number): SingleCursorState {
		let lineNumber: number,
			column: number;

		if (cursor.hasSelection() && !inSelectionMode) {
			// If the user has a selection and does not want to extend it,
			// put the cursor at the beginning of the selection.
			lineNumber = cursor.selection.startLineNumber;
			column = cursor.selection.startColumn;
		} else {
			// This has no effect if noOfColumns === 1.
			// It is ok to do so in the half-line scenario.
			const pos = cursor.position.delta(undefined, -(noOfColumns - 1));
			// We clip the position before normalization, as normalization is not defined
			// for possibly negative columns.
			const normalizedPos = model.normalizePosition(MoveOperations.clipPositionColumn(pos, model), PositionAffinity.Left);
			const p = MoveOperations.left(config, model, normalizedPos);

			lineNumber = p.lineNumber;
			column = p.column;
		}

		return cursor.move(inSelectionMode, lineNumber, column, 0);
	}

	/**
	 * Adjusts the column so that it is within min/max of the line.
	*/
	private static clipPositionColumn(position: Position, model: ICursorSimpleModel): Position {
		return new Position(
			position.lineNumber,
			MoveOperations.clipRange(position.column, model.getLineMinColumn(position.lineNumber),
				model.getLineMaxColumn(position.lineNumber))
		);
	}

	private static clipRange(value: number, min: number, max: number): number {
		if (value < min) {
			return min;
		}
		if (value > max) {
			return max;
		}
		return value;
	}

	public static rightPosition(model: ICursorSimpleModel, lineNumber: number, column: number): Position {
		if (column < model.getLineMaxColumn(lineNumber)) {
			column = column + strings.nextCharLength(model.getLineContent(lineNumber), column - 1);
		} else if (lineNumber < model.getLineCount()) {
			lineNumber = lineNumber + 1;
			column = model.getLineMinColumn(lineNumber);
		}
		return new Position(lineNumber, column);
	}

	public static rightPositionAtomicSoftTabs(model: ICursorSimpleModel, lineNumber: number, column: number, tabSize: number, indentSize: number): Position {
		if (column < model.getLineIndentColumn(lineNumber)) {
			const lineContent = model.getLineContent(lineNumber);
			const newPosition = AtomicTabMoveOperations.atomicPosition(lineContent, column - 1, tabSize, Direction.Right);
			if (newPosition !== -1) {
				return new Position(lineNumber, newPosition + 1);
			}
		}
		return this.rightPosition(model, lineNumber, column);
	}

	public static right(config: CursorConfiguration, model: ICursorSimpleModel, position: Position): CursorPosition {
		const pos = config.stickyTabStops
			? MoveOperations.rightPositionAtomicSoftTabs(model, position.lineNumber, position.column, config.tabSize, config.indentSize)
			: MoveOperations.rightPosition(model, position.lineNumber, position.column);
		return new CursorPosition(pos.lineNumber, pos.column, 0);
	}

	public static moveRight(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean, noOfColumns: number): SingleCursorState {
		let lineNumber: number,
			column: number;

		if (cursor.hasSelection() && !inSelectionMode) {
			// If we are in selection mode, move right without selection cancels selection and puts cursor at the end of the selection
			lineNumber = cursor.selection.endLineNumber;
			column = cursor.selection.endColumn;
		} else {
			const pos = cursor.position.delta(undefined, noOfColumns - 1);
			const normalizedPos = model.normalizePosition(MoveOperations.clipPositionColumn(pos, model), PositionAffinity.Right);
			const r = MoveOperations.right(config, model, normalizedPos);
			lineNumber = r.lineNumber;
			column = r.column;
		}

		return cursor.move(inSelectionMode, lineNumber, column, 0);
	}

	public static vertical(config: CursorConfiguration, model: ICursorSimpleModel, lineNumber: number, column: number, leftoverVisibleColumns: number, newLineNumber: number, allowMoveOnEdgeLine: boolean, normalizationAffinity?: PositionAffinity): CursorPosition {
		const currentVisibleColumn = CursorColumns.visibleColumnFromColumn(model.getLineContent(lineNumber), column, config.tabSize) + leftoverVisibleColumns;
		const lineCount = model.getLineCount();
		const wasOnFirstPosition = (lineNumber === 1 && column === 1);
		const wasOnLastPosition = (lineNumber === lineCount && column === model.getLineMaxColumn(lineNumber));
		const wasAtEdgePosition = (newLineNumber < lineNumber ? wasOnFirstPosition : wasOnLastPosition);

		lineNumber = newLineNumber;
		if (lineNumber < 1) {
			lineNumber = 1;
			if (allowMoveOnEdgeLine) {
				column = model.getLineMinColumn(lineNumber);
			} else {
				column = Math.min(model.getLineMaxColumn(lineNumber), column);
			}
		} else if (lineNumber > lineCount) {
			lineNumber = lineCount;
			if (allowMoveOnEdgeLine) {
				column = model.getLineMaxColumn(lineNumber);
			} else {
				column = Math.min(model.getLineMaxColumn(lineNumber), column);
			}
		} else {
			column = config.columnFromVisibleColumn(model, lineNumber, currentVisibleColumn);
		}

		if (wasAtEdgePosition) {
			leftoverVisibleColumns = 0;
		} else {
			leftoverVisibleColumns = currentVisibleColumn - CursorColumns.visibleColumnFromColumn(model.getLineContent(lineNumber), column, config.tabSize);
		}

		if (normalizationAffinity !== undefined) {
			const position = new Position(lineNumber, column);
			const newPosition = model.normalizePosition(position, normalizationAffinity);
			leftoverVisibleColumns = leftoverVisibleColumns + (column - newPosition.column);
			lineNumber = newPosition.lineNumber;
			column = newPosition.column;
		}
		return new CursorPosition(lineNumber, column, leftoverVisibleColumns);
	}

	public static down(config: CursorConfiguration, model: ICursorSimpleModel, lineNumber: number, column: number, leftoverVisibleColumns: number, count: number, allowMoveOnLastLine: boolean): CursorPosition {
		return this.vertical(config, model, lineNumber, column, leftoverVisibleColumns, lineNumber + count, allowMoveOnLastLine, PositionAffinity.RightOfInjectedText);
	}

	public static moveDown(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean, linesCount: number): SingleCursorState {
		let lineNumber: number,
			column: number;

		if (cursor.hasSelection() && !inSelectionMode) {
			// If we are in selection mode, move down acts relative to the end of selection
			lineNumber = cursor.selection.endLineNumber;
			column = cursor.selection.endColumn;
		} else {
			lineNumber = cursor.position.lineNumber;
			column = cursor.position.column;
		}

		let i = 0;
		let r: CursorPosition;
		do {
			r = MoveOperations.down(config, model, lineNumber + i, column, cursor.leftoverVisibleColumns, linesCount, true);
			const np = model.normalizePosition(new Position(r.lineNumber, r.column), PositionAffinity.None);
			if (np.lineNumber > lineNumber) {
				break;
			}
		} while (i++ < 10 && lineNumber + i < model.getLineCount());

		return cursor.move(inSelectionMode, r.lineNumber, r.column, r.leftoverVisibleColumns);
	}

	public static translateDown(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState): SingleCursorState {
		const selection = cursor.selection;

		const selectionStart = MoveOperations.down(config, model, selection.selectionStartLineNumber, selection.selectionStartColumn, cursor.selectionStartLeftoverVisibleColumns, 1, false);
		const position = MoveOperations.down(config, model, selection.positionLineNumber, selection.positionColumn, cursor.leftoverVisibleColumns, 1, false);

		return new SingleCursorState(
			new Range(selectionStart.lineNumber, selectionStart.column, selectionStart.lineNumber, selectionStart.column),
			SelectionStartKind.Simple,
			selectionStart.leftoverVisibleColumns,
			new Position(position.lineNumber, position.column),
			position.leftoverVisibleColumns
		);
	}

	public static up(config: CursorConfiguration, model: ICursorSimpleModel, lineNumber: number, column: number, leftoverVisibleColumns: number, count: number, allowMoveOnFirstLine: boolean): CursorPosition {
		return this.vertical(config, model, lineNumber, column, leftoverVisibleColumns, lineNumber - count, allowMoveOnFirstLine, PositionAffinity.LeftOfInjectedText);
	}

	public static moveUp(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean, linesCount: number): SingleCursorState {
		let lineNumber: number,
			column: number;

		if (cursor.hasSelection() && !inSelectionMode) {
			// If we are in selection mode, move up acts relative to the beginning of selection
			lineNumber = cursor.selection.startLineNumber;
			column = cursor.selection.startColumn;
		} else {
			lineNumber = cursor.position.lineNumber;
			column = cursor.position.column;
		}

		const r = MoveOperations.up(config, model, lineNumber, column, cursor.leftoverVisibleColumns, linesCount, true);

		return cursor.move(inSelectionMode, r.lineNumber, r.column, r.leftoverVisibleColumns);
	}

	public static translateUp(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState): SingleCursorState {

		const selection = cursor.selection;

		const selectionStart = MoveOperations.up(config, model, selection.selectionStartLineNumber, selection.selectionStartColumn, cursor.selectionStartLeftoverVisibleColumns, 1, false);
		const position = MoveOperations.up(config, model, selection.positionLineNumber, selection.positionColumn, cursor.leftoverVisibleColumns, 1, false);

		return new SingleCursorState(
			new Range(selectionStart.lineNumber, selectionStart.column, selectionStart.lineNumber, selectionStart.column),
			SelectionStartKind.Simple,
			selectionStart.leftoverVisibleColumns,
			new Position(position.lineNumber, position.column),
			position.leftoverVisibleColumns
		);
	}

	private static _isBlankLine(model: ICursorSimpleModel, lineNumber: number): boolean {
		if (model.getLineFirstNonWhitespaceColumn(lineNumber) === 0) {
			// empty or contains only whitespace
			return true;
		}
		return false;
	}

	public static moveToPrevBlankLine(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean): SingleCursorState {
		let lineNumber = cursor.position.lineNumber;

		// If our current line is blank, move to the previous non-blank line
		while (lineNumber > 1 && this._isBlankLine(model, lineNumber)) {
			lineNumber--;
		}

		// Find the previous blank line
		while (lineNumber > 1 && !this._isBlankLine(model, lineNumber)) {
			lineNumber--;
		}

		return cursor.move(inSelectionMode, lineNumber, model.getLineMinColumn(lineNumber), 0);
	}

	public static moveToNextBlankLine(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean): SingleCursorState {
		const lineCount = model.getLineCount();
		let lineNumber = cursor.position.lineNumber;

		// If our current line is blank, move to the next non-blank line
		while (lineNumber < lineCount && this._isBlankLine(model, lineNumber)) {
			lineNumber++;
		}

		// Find the next blank line
		while (lineNumber < lineCount && !this._isBlankLine(model, lineNumber)) {
			lineNumber++;
		}

		return cursor.move(inSelectionMode, lineNumber, model.getLineMinColumn(lineNumber), 0);
	}

	public static moveToBeginningOfLine(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean): SingleCursorState {
		const lineNumber = cursor.position.lineNumber;
		const minColumn = model.getLineMinColumn(lineNumber);
		const firstNonBlankColumn = model.getLineFirstNonWhitespaceColumn(lineNumber) || minColumn;

		let column: number;

		const relevantColumnNumber = cursor.position.column;
		if (relevantColumnNumber === firstNonBlankColumn) {
			column = minColumn;
		} else {
			column = firstNonBlankColumn;
		}

		return cursor.move(inSelectionMode, lineNumber, column, 0);
	}

	public static moveToEndOfLine(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean, sticky: boolean): SingleCursorState {
		const lineNumber = cursor.position.lineNumber;
		const maxColumn = model.getLineMaxColumn(lineNumber);
		return cursor.move(inSelectionMode, lineNumber, maxColumn, sticky ? Constants.MAX_SAFE_SMALL_INTEGER - maxColumn : 0);
	}

	public static moveToBeginningOfBuffer(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean): SingleCursorState {
		return cursor.move(inSelectionMode, 1, 1, 0);
	}

	public static moveToEndOfBuffer(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean): SingleCursorState {
		const lastLineNumber = model.getLineCount();
		const lastColumn = model.getLineMaxColumn(lastLineNumber);

		return cursor.move(inSelectionMode, lastLineNumber, lastColumn, 0);
	}
}
```

--------------------------------------------------------------------------------

````
