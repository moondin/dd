---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 212
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 212 of 552)

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

---[FILE: src/vs/editor/common/diff/defaultLinesDiffComputer/linesSliceCharSequence.ts]---
Location: vscode-main/src/vs/editor/common/diff/defaultLinesDiffComputer/linesSliceCharSequence.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { findLastIdxMonotonous, findLastMonotonous, findFirstMonotonous } from '../../../../base/common/arraysFind.js';
import { CharCode } from '../../../../base/common/charCode.js';
import { OffsetRange } from '../../core/ranges/offsetRange.js';
import { Position } from '../../core/position.js';
import { Range } from '../../core/range.js';
import { ISequence } from './algorithms/diffAlgorithm.js';
import { isSpace } from './utils.js';

export class LinesSliceCharSequence implements ISequence {
	private readonly elements: number[] = [];
	private readonly firstElementOffsetByLineIdx: number[] = [];
	private readonly lineStartOffsets: number[] = [];
	private readonly trimmedWsLengthsByLineIdx: number[] = [];

	constructor(public readonly lines: string[], private readonly range: Range, public readonly considerWhitespaceChanges: boolean) {
		this.firstElementOffsetByLineIdx.push(0);
		for (let lineNumber = this.range.startLineNumber; lineNumber <= this.range.endLineNumber; lineNumber++) {
			let line = lines[lineNumber - 1];
			let lineStartOffset = 0;
			if (lineNumber === this.range.startLineNumber && this.range.startColumn > 1) {
				lineStartOffset = this.range.startColumn - 1;
				line = line.substring(lineStartOffset);
			}
			this.lineStartOffsets.push(lineStartOffset);

			let trimmedWsLength = 0;
			if (!considerWhitespaceChanges) {
				const trimmedStartLine = line.trimStart();
				trimmedWsLength = line.length - trimmedStartLine.length;
				line = trimmedStartLine.trimEnd();
			}
			this.trimmedWsLengthsByLineIdx.push(trimmedWsLength);

			const lineLength = lineNumber === this.range.endLineNumber ? Math.min(this.range.endColumn - 1 - lineStartOffset - trimmedWsLength, line.length) : line.length;
			for (let i = 0; i < lineLength; i++) {
				this.elements.push(line.charCodeAt(i));
			}

			if (lineNumber < this.range.endLineNumber) {
				this.elements.push('\n'.charCodeAt(0));
				this.firstElementOffsetByLineIdx.push(this.elements.length);
			}
		}
	}

	toString() {
		return `Slice: "${this.text}"`;
	}

	get text(): string {
		return this.getText(new OffsetRange(0, this.length));
	}

	getText(range: OffsetRange): string {
		return this.elements.slice(range.start, range.endExclusive).map(e => String.fromCharCode(e)).join('');
	}

	getElement(offset: number): number {
		return this.elements[offset];
	}

	get length(): number {
		return this.elements.length;
	}

	public getBoundaryScore(length: number): number {
		//   a   b   c   ,           d   e   f
		// 11  0   0   12  15  6   13  0   0   11

		const prevCategory = getCategory(length > 0 ? this.elements[length - 1] : -1);
		const nextCategory = getCategory(length < this.elements.length ? this.elements[length] : -1);

		if (prevCategory === CharBoundaryCategory.LineBreakCR && nextCategory === CharBoundaryCategory.LineBreakLF) {
			// don't break between \r and \n
			return 0;
		}
		if (prevCategory === CharBoundaryCategory.LineBreakLF) {
			// prefer the linebreak before the change
			return 150;
		}

		let score = 0;
		if (prevCategory !== nextCategory) {
			score += 10;
			if (prevCategory === CharBoundaryCategory.WordLower && nextCategory === CharBoundaryCategory.WordUpper) {
				score += 1;
			}
		}

		score += getCategoryBoundaryScore(prevCategory);
		score += getCategoryBoundaryScore(nextCategory);

		return score;
	}

	public translateOffset(offset: number, preference: 'left' | 'right' = 'right'): Position {
		// find smallest i, so that lineBreakOffsets[i] <= offset using binary search
		const i = findLastIdxMonotonous(this.firstElementOffsetByLineIdx, (value) => value <= offset);
		const lineOffset = offset - this.firstElementOffsetByLineIdx[i];
		return new Position(
			this.range.startLineNumber + i,
			1 + this.lineStartOffsets[i] + lineOffset + ((lineOffset === 0 && preference === 'left') ? 0 : this.trimmedWsLengthsByLineIdx[i])
		);
	}

	public translateRange(range: OffsetRange): Range {
		const pos1 = this.translateOffset(range.start, 'right');
		const pos2 = this.translateOffset(range.endExclusive, 'left');
		if (pos2.isBefore(pos1)) {
			return Range.fromPositions(pos2, pos2);
		}
		return Range.fromPositions(pos1, pos2);
	}

	/**
	 * Finds the word that contains the character at the given offset
	 */
	public findWordContaining(offset: number): OffsetRange | undefined {
		if (offset < 0 || offset >= this.elements.length) {
			return undefined;
		}

		if (!isWordChar(this.elements[offset])) {
			return undefined;
		}

		// find start
		let start = offset;
		while (start > 0 && isWordChar(this.elements[start - 1])) {
			start--;
		}

		// find end
		let end = offset;
		while (end < this.elements.length && isWordChar(this.elements[end])) {
			end++;
		}

		return new OffsetRange(start, end);
	}

	/** fooBar has the two sub-words foo and bar */
	public findSubWordContaining(offset: number): OffsetRange | undefined {
		if (offset < 0 || offset >= this.elements.length) {
			return undefined;
		}

		if (!isWordChar(this.elements[offset])) {
			return undefined;
		}

		// find start
		let start = offset;
		while (start > 0 && isWordChar(this.elements[start - 1]) && !isUpperCase(this.elements[start])) {
			start--;
		}

		// find end
		let end = offset;
		while (end < this.elements.length && isWordChar(this.elements[end]) && !isUpperCase(this.elements[end])) {
			end++;
		}

		return new OffsetRange(start, end);
	}

	public countLinesIn(range: OffsetRange): number {
		return this.translateOffset(range.endExclusive).lineNumber - this.translateOffset(range.start).lineNumber;
	}

	public isStronglyEqual(offset1: number, offset2: number): boolean {
		return this.elements[offset1] === this.elements[offset2];
	}

	public extendToFullLines(range: OffsetRange): OffsetRange {
		const start = findLastMonotonous(this.firstElementOffsetByLineIdx, x => x <= range.start) ?? 0;
		const end = findFirstMonotonous(this.firstElementOffsetByLineIdx, x => range.endExclusive <= x) ?? this.elements.length;
		return new OffsetRange(start, end);
	}
}

function isWordChar(charCode: number): boolean {
	return charCode >= CharCode.a && charCode <= CharCode.z
		|| charCode >= CharCode.A && charCode <= CharCode.Z
		|| charCode >= CharCode.Digit0 && charCode <= CharCode.Digit9;
}

function isUpperCase(charCode: number): boolean {
	return charCode >= CharCode.A && charCode <= CharCode.Z;
}

const enum CharBoundaryCategory {
	WordLower,
	WordUpper,
	WordNumber,
	End,
	Other,
	Separator,
	Space,
	LineBreakCR,
	LineBreakLF,
}

const score: Record<CharBoundaryCategory, number> = {
	[CharBoundaryCategory.WordLower]: 0,
	[CharBoundaryCategory.WordUpper]: 0,
	[CharBoundaryCategory.WordNumber]: 0,
	[CharBoundaryCategory.End]: 10,
	[CharBoundaryCategory.Other]: 2,
	[CharBoundaryCategory.Separator]: 30,
	[CharBoundaryCategory.Space]: 3,
	[CharBoundaryCategory.LineBreakCR]: 10,
	[CharBoundaryCategory.LineBreakLF]: 10,
};

function getCategoryBoundaryScore(category: CharBoundaryCategory): number {
	return score[category];
}

function getCategory(charCode: number): CharBoundaryCategory {
	if (charCode === CharCode.LineFeed) {
		return CharBoundaryCategory.LineBreakLF;
	} else if (charCode === CharCode.CarriageReturn) {
		return CharBoundaryCategory.LineBreakCR;
	} else if (isSpace(charCode)) {
		return CharBoundaryCategory.Space;
	} else if (charCode >= CharCode.a && charCode <= CharCode.z) {
		return CharBoundaryCategory.WordLower;
	} else if (charCode >= CharCode.A && charCode <= CharCode.Z) {
		return CharBoundaryCategory.WordUpper;
	} else if (charCode >= CharCode.Digit0 && charCode <= CharCode.Digit9) {
		return CharBoundaryCategory.WordNumber;
	} else if (charCode === -1) {
		return CharBoundaryCategory.End;
	} else if (charCode === CharCode.Comma || charCode === CharCode.Semicolon) {
		return CharBoundaryCategory.Separator;
	} else {
		return CharBoundaryCategory.Other;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/diff/defaultLinesDiffComputer/utils.ts]---
Location: vscode-main/src/vs/editor/common/diff/defaultLinesDiffComputer/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../../base/common/charCode.js';
import { LineRange } from '../../core/ranges/lineRange.js';
import { DetailedLineRangeMapping } from '../rangeMapping.js';

export class Array2D<T> {
	private readonly array: T[] = [];

	constructor(public readonly width: number, public readonly height: number) {
		this.array = new Array<T>(width * height);
	}

	get(x: number, y: number): T {
		return this.array[x + y * this.width];
	}

	set(x: number, y: number, value: T): void {
		this.array[x + y * this.width] = value;
	}
}

export function isSpace(charCode: number): boolean {
	return charCode === CharCode.Space || charCode === CharCode.Tab;
}

export class LineRangeFragment {
	private static chrKeys = new Map<string, number>();

	private static getKey(chr: string): number {
		let key = this.chrKeys.get(chr);
		if (key === undefined) {
			key = this.chrKeys.size;
			this.chrKeys.set(chr, key);
		}
		return key;
	}

	private readonly totalCount: number;
	private readonly histogram: number[] = [];
	constructor(
		public readonly range: LineRange,
		public readonly lines: string[],
		public readonly source: DetailedLineRangeMapping,
	) {
		let counter = 0;
		for (let i = range.startLineNumber - 1; i < range.endLineNumberExclusive - 1; i++) {
			const line = lines[i];
			for (let j = 0; j < line.length; j++) {
				counter++;
				const chr = line[j];
				const key = LineRangeFragment.getKey(chr);
				this.histogram[key] = (this.histogram[key] || 0) + 1;
			}
			counter++;
			const key = LineRangeFragment.getKey('\n');
			this.histogram[key] = (this.histogram[key] || 0) + 1;
		}

		this.totalCount = counter;
	}

	public computeSimilarity(other: LineRangeFragment): number {
		let sumDifferences = 0;
		const maxLength = Math.max(this.histogram.length, other.histogram.length);
		for (let i = 0; i < maxLength; i++) {
			sumDifferences += Math.abs((this.histogram[i] ?? 0) - (other.histogram[i] ?? 0));
		}
		return 1 - (sumDifferences / (this.totalCount + other.totalCount));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/diff/defaultLinesDiffComputer/algorithms/diffAlgorithm.ts]---
Location: vscode-main/src/vs/editor/common/diff/defaultLinesDiffComputer/algorithms/diffAlgorithm.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { forEachAdjacent } from '../../../../../base/common/arrays.js';
import { BugIndicatingError } from '../../../../../base/common/errors.js';
import { OffsetRange } from '../../../core/ranges/offsetRange.js';

/**
 * Represents a synchronous diff algorithm. Should be executed in a worker.
*/
export interface IDiffAlgorithm {
	compute(sequence1: ISequence, sequence2: ISequence, timeout?: ITimeout): DiffAlgorithmResult;
}

export class DiffAlgorithmResult {
	static trivial(seq1: ISequence, seq2: ISequence): DiffAlgorithmResult {
		return new DiffAlgorithmResult([new SequenceDiff(OffsetRange.ofLength(seq1.length), OffsetRange.ofLength(seq2.length))], false);
	}

	static trivialTimedOut(seq1: ISequence, seq2: ISequence): DiffAlgorithmResult {
		return new DiffAlgorithmResult([new SequenceDiff(OffsetRange.ofLength(seq1.length), OffsetRange.ofLength(seq2.length))], true);
	}

	constructor(
		public readonly diffs: SequenceDiff[],
		/**
		 * Indicates if the time out was reached.
		 * In that case, the diffs might be an approximation and the user should be asked to rerun the diff with more time.
		 */
		public readonly hitTimeout: boolean,
	) { }
}

export class SequenceDiff {
	public static invert(sequenceDiffs: SequenceDiff[], doc1Length: number): SequenceDiff[] {
		const result: SequenceDiff[] = [];
		forEachAdjacent(sequenceDiffs, (a, b) => {
			result.push(SequenceDiff.fromOffsetPairs(
				a ? a.getEndExclusives() : OffsetPair.zero,
				b ? b.getStarts() : new OffsetPair(doc1Length, (a ? a.seq2Range.endExclusive - a.seq1Range.endExclusive : 0) + doc1Length)
			));
		});
		return result;
	}

	public static fromOffsetPairs(start: OffsetPair, endExclusive: OffsetPair): SequenceDiff {
		return new SequenceDiff(
			new OffsetRange(start.offset1, endExclusive.offset1),
			new OffsetRange(start.offset2, endExclusive.offset2),
		);
	}

	public static assertSorted(sequenceDiffs: SequenceDiff[]): void {
		let last: SequenceDiff | undefined = undefined;
		for (const cur of sequenceDiffs) {
			if (last) {
				if (!(last.seq1Range.endExclusive <= cur.seq1Range.start && last.seq2Range.endExclusive <= cur.seq2Range.start)) {
					throw new BugIndicatingError('Sequence diffs must be sorted');
				}
			}
			last = cur;
		}
	}

	constructor(
		public readonly seq1Range: OffsetRange,
		public readonly seq2Range: OffsetRange,
	) { }

	public swap(): SequenceDiff {
		return new SequenceDiff(this.seq2Range, this.seq1Range);
	}

	public toString(): string {
		return `${this.seq1Range} <-> ${this.seq2Range}`;
	}

	public join(other: SequenceDiff): SequenceDiff {
		return new SequenceDiff(this.seq1Range.join(other.seq1Range), this.seq2Range.join(other.seq2Range));
	}

	public delta(offset: number): SequenceDiff {
		if (offset === 0) {
			return this;
		}
		return new SequenceDiff(this.seq1Range.delta(offset), this.seq2Range.delta(offset));
	}

	public deltaStart(offset: number): SequenceDiff {
		if (offset === 0) {
			return this;
		}
		return new SequenceDiff(this.seq1Range.deltaStart(offset), this.seq2Range.deltaStart(offset));
	}

	public deltaEnd(offset: number): SequenceDiff {
		if (offset === 0) {
			return this;
		}
		return new SequenceDiff(this.seq1Range.deltaEnd(offset), this.seq2Range.deltaEnd(offset));
	}

	public intersectsOrTouches(other: SequenceDiff): boolean {
		return this.seq1Range.intersectsOrTouches(other.seq1Range) || this.seq2Range.intersectsOrTouches(other.seq2Range);
	}

	public intersect(other: SequenceDiff): SequenceDiff | undefined {
		const i1 = this.seq1Range.intersect(other.seq1Range);
		const i2 = this.seq2Range.intersect(other.seq2Range);
		if (!i1 || !i2) {
			return undefined;
		}
		return new SequenceDiff(i1, i2);
	}

	public getStarts(): OffsetPair {
		return new OffsetPair(this.seq1Range.start, this.seq2Range.start);
	}

	public getEndExclusives(): OffsetPair {
		return new OffsetPair(this.seq1Range.endExclusive, this.seq2Range.endExclusive);
	}
}

export class OffsetPair {
	public static readonly zero = new OffsetPair(0, 0);
	public static readonly max = new OffsetPair(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);

	constructor(
		public readonly offset1: number,
		public readonly offset2: number,
	) {
	}

	public toString(): string {
		return `${this.offset1} <-> ${this.offset2}`;
	}

	public delta(offset: number): OffsetPair {
		if (offset === 0) {
			return this;
		}
		return new OffsetPair(this.offset1 + offset, this.offset2 + offset);
	}

	public equals(other: OffsetPair): boolean {
		return this.offset1 === other.offset1 && this.offset2 === other.offset2;
	}
}

export interface ISequence {
	getElement(offset: number): number;
	get length(): number;

	/**
	 * The higher the score, the better that offset can be used to split the sequence.
	 * Is used to optimize insertions.
	 * Must not be negative.
	*/
	getBoundaryScore?(length: number): number;

	/**
	 * For line sequences, getElement returns a number representing trimmed lines.
	 * This however checks equality for the original lines.
	 * It prevents shifting to less matching lines.
	 */
	isStronglyEqual(offset1: number, offset2: number): boolean;
}

export interface ITimeout {
	isValid(): boolean;
}

export class InfiniteTimeout implements ITimeout {
	public static instance = new InfiniteTimeout();

	isValid(): boolean {
		return true;
	}
}

export class DateTimeout implements ITimeout {
	private readonly startTime = Date.now();
	private valid = true;

	constructor(private timeout: number) {
		if (timeout <= 0) {
			throw new BugIndicatingError('timeout must be positive');
		}
	}

	// Recommendation: Set a log-point `{this.disable()}` in the body
	public isValid(): boolean {
		const valid = Date.now() - this.startTime < this.timeout;
		if (!valid && this.valid) {
			this.valid = false; // timeout reached
		}
		return this.valid;
	}

	public disable() {
		this.timeout = Number.MAX_SAFE_INTEGER;
		this.isValid = () => true;
		this.valid = true;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/diff/defaultLinesDiffComputer/algorithms/dynamicProgrammingDiffing.ts]---
Location: vscode-main/src/vs/editor/common/diff/defaultLinesDiffComputer/algorithms/dynamicProgrammingDiffing.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { OffsetRange } from '../../../core/ranges/offsetRange.js';
import { IDiffAlgorithm, SequenceDiff, ISequence, ITimeout, InfiniteTimeout, DiffAlgorithmResult } from './diffAlgorithm.js';
import { Array2D } from '../utils.js';

/**
 * A O(MN) diffing algorithm that supports a score function.
 * The algorithm can be improved by processing the 2d array diagonally.
*/
export class DynamicProgrammingDiffing implements IDiffAlgorithm {
	compute(sequence1: ISequence, sequence2: ISequence, timeout: ITimeout = InfiniteTimeout.instance, equalityScore?: (offset1: number, offset2: number) => number): DiffAlgorithmResult {
		if (sequence1.length === 0 || sequence2.length === 0) {
			return DiffAlgorithmResult.trivial(sequence1, sequence2);
		}

		/**
		 * lcsLengths.get(i, j): Length of the longest common subsequence of sequence1.substring(0, i + 1) and sequence2.substring(0, j + 1).
		 */
		const lcsLengths = new Array2D<number>(sequence1.length, sequence2.length);
		const directions = new Array2D<number>(sequence1.length, sequence2.length);
		const lengths = new Array2D<number>(sequence1.length, sequence2.length);

		// ==== Initializing lcsLengths ====
		for (let s1 = 0; s1 < sequence1.length; s1++) {
			for (let s2 = 0; s2 < sequence2.length; s2++) {
				if (!timeout.isValid()) {
					return DiffAlgorithmResult.trivialTimedOut(sequence1, sequence2);
				}

				const horizontalLen = s1 === 0 ? 0 : lcsLengths.get(s1 - 1, s2);
				const verticalLen = s2 === 0 ? 0 : lcsLengths.get(s1, s2 - 1);

				let extendedSeqScore: number;
				if (sequence1.getElement(s1) === sequence2.getElement(s2)) {
					if (s1 === 0 || s2 === 0) {
						extendedSeqScore = 0;
					} else {
						extendedSeqScore = lcsLengths.get(s1 - 1, s2 - 1);
					}
					if (s1 > 0 && s2 > 0 && directions.get(s1 - 1, s2 - 1) === 3) {
						// Prefer consecutive diagonals
						extendedSeqScore += lengths.get(s1 - 1, s2 - 1);
					}
					extendedSeqScore += (equalityScore ? equalityScore(s1, s2) : 1);
				} else {
					extendedSeqScore = -1;
				}

				const newValue = Math.max(horizontalLen, verticalLen, extendedSeqScore);

				if (newValue === extendedSeqScore) {
					// Prefer diagonals
					const prevLen = s1 > 0 && s2 > 0 ? lengths.get(s1 - 1, s2 - 1) : 0;
					lengths.set(s1, s2, prevLen + 1);
					directions.set(s1, s2, 3);
				} else if (newValue === horizontalLen) {
					lengths.set(s1, s2, 0);
					directions.set(s1, s2, 1);
				} else if (newValue === verticalLen) {
					lengths.set(s1, s2, 0);
					directions.set(s1, s2, 2);
				}

				lcsLengths.set(s1, s2, newValue);
			}
		}

		// ==== Backtracking ====
		const result: SequenceDiff[] = [];
		let lastAligningPosS1: number = sequence1.length;
		let lastAligningPosS2: number = sequence2.length;

		function reportDecreasingAligningPositions(s1: number, s2: number): void {
			if (s1 + 1 !== lastAligningPosS1 || s2 + 1 !== lastAligningPosS2) {
				result.push(new SequenceDiff(
					new OffsetRange(s1 + 1, lastAligningPosS1),
					new OffsetRange(s2 + 1, lastAligningPosS2),
				));
			}
			lastAligningPosS1 = s1;
			lastAligningPosS2 = s2;
		}

		let s1 = sequence1.length - 1;
		let s2 = sequence2.length - 1;
		while (s1 >= 0 && s2 >= 0) {
			if (directions.get(s1, s2) === 3) {
				reportDecreasingAligningPositions(s1, s2);
				s1--;
				s2--;
			} else {
				if (directions.get(s1, s2) === 1) {
					s1--;
				} else {
					s2--;
				}
			}
		}
		reportDecreasingAligningPositions(-1, -1);
		result.reverse();
		return new DiffAlgorithmResult(result, false);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/diff/defaultLinesDiffComputer/algorithms/myersDiffAlgorithm.ts]---
Location: vscode-main/src/vs/editor/common/diff/defaultLinesDiffComputer/algorithms/myersDiffAlgorithm.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { OffsetRange } from '../../../core/ranges/offsetRange.js';
import { DiffAlgorithmResult, IDiffAlgorithm, ISequence, ITimeout, InfiniteTimeout, SequenceDiff } from './diffAlgorithm.js';

/**
 * An O(ND) diff algorithm that has a quadratic space worst-case complexity.
*/
export class MyersDiffAlgorithm implements IDiffAlgorithm {
	compute(seq1: ISequence, seq2: ISequence, timeout: ITimeout = InfiniteTimeout.instance): DiffAlgorithmResult {
		// These are common special cases.
		// The early return improves performance dramatically.
		if (seq1.length === 0 || seq2.length === 0) {
			return DiffAlgorithmResult.trivial(seq1, seq2);
		}

		const seqX = seq1; // Text on the x axis
		const seqY = seq2; // Text on the y axis

		function getXAfterSnake(x: number, y: number): number {
			while (x < seqX.length && y < seqY.length && seqX.getElement(x) === seqY.getElement(y)) {
				x++;
				y++;
			}
			return x;
		}

		let d = 0;
		// V[k]: X value of longest d-line that ends in diagonal k.
		// d-line: path from (0,0) to (x,y) that uses exactly d non-diagonals.
		// diagonal k: Set of points (x,y) with x-y = k.
		// k=1 -> (1,0),(2,1)
		const V = new FastInt32Array();
		V.set(0, getXAfterSnake(0, 0));

		const paths = new FastArrayNegativeIndices<SnakePath | null>();
		paths.set(0, V.get(0) === 0 ? null : new SnakePath(null, 0, 0, V.get(0)));

		let k = 0;

		loop: while (true) {
			d++;
			if (!timeout.isValid()) {
				return DiffAlgorithmResult.trivialTimedOut(seqX, seqY);
			}
			// The paper has `for (k = -d; k <= d; k += 2)`, but we can ignore diagonals that cannot influence the result.
			const lowerBound = -Math.min(d, seqY.length + (d % 2));
			const upperBound = Math.min(d, seqX.length + (d % 2));
			for (k = lowerBound; k <= upperBound; k += 2) {
				let step = 0;
				// We can use the X values of (d-1)-lines to compute X value of the longest d-lines.
				const maxXofDLineTop = k === upperBound ? -1 : V.get(k + 1); // We take a vertical non-diagonal (add a symbol in seqX)
				const maxXofDLineLeft = k === lowerBound ? -1 : V.get(k - 1) + 1; // We take a horizontal non-diagonal (+1 x) (delete a symbol in seqX)
				step++;
				const x = Math.min(Math.max(maxXofDLineTop, maxXofDLineLeft), seqX.length);
				const y = x - k;
				step++;
				if (x > seqX.length || y > seqY.length) {
					// This diagonal is irrelevant for the result.
					// TODO: Don't pay the cost for this in the next iteration.
					continue;
				}
				const newMaxX = getXAfterSnake(x, y);
				V.set(k, newMaxX);
				const lastPath = x === maxXofDLineTop ? paths.get(k + 1) : paths.get(k - 1);
				paths.set(k, newMaxX !== x ? new SnakePath(lastPath, x, y, newMaxX - x) : lastPath);

				if (V.get(k) === seqX.length && V.get(k) - k === seqY.length) {
					break loop;
				}
			}
		}

		let path = paths.get(k);
		const result: SequenceDiff[] = [];
		let lastAligningPosS1: number = seqX.length;
		let lastAligningPosS2: number = seqY.length;

		while (true) {
			const endX = path ? path.x + path.length : 0;
			const endY = path ? path.y + path.length : 0;

			if (endX !== lastAligningPosS1 || endY !== lastAligningPosS2) {
				result.push(new SequenceDiff(
					new OffsetRange(endX, lastAligningPosS1),
					new OffsetRange(endY, lastAligningPosS2),
				));
			}
			if (!path) {
				break;
			}
			lastAligningPosS1 = path.x;
			lastAligningPosS2 = path.y;

			path = path.prev;
		}

		result.reverse();
		return new DiffAlgorithmResult(result, false);
	}
}

class SnakePath {
	constructor(
		public readonly prev: SnakePath | null,
		public readonly x: number,
		public readonly y: number,
		public readonly length: number
	) {
	}
}

/**
 * An array that supports fast negative indices.
*/
class FastInt32Array {
	private positiveArr: Int32Array = new Int32Array(10);
	private negativeArr: Int32Array = new Int32Array(10);

	get(idx: number): number {
		if (idx < 0) {
			idx = -idx - 1;
			return this.negativeArr[idx];
		} else {
			return this.positiveArr[idx];
		}
	}

	set(idx: number, value: number): void {
		if (idx < 0) {
			idx = -idx - 1;
			if (idx >= this.negativeArr.length) {
				const arr = this.negativeArr;
				this.negativeArr = new Int32Array(arr.length * 2);
				this.negativeArr.set(arr);
			}
			this.negativeArr[idx] = value;
		} else {
			if (idx >= this.positiveArr.length) {
				const arr = this.positiveArr;
				this.positiveArr = new Int32Array(arr.length * 2);
				this.positiveArr.set(arr);
			}
			this.positiveArr[idx] = value;
		}
	}
}

/**
 * An array that supports fast negative indices.
*/
class FastArrayNegativeIndices<T> {
	private readonly positiveArr: T[] = [];
	private readonly negativeArr: T[] = [];

	get(idx: number): T {
		if (idx < 0) {
			idx = -idx - 1;
			return this.negativeArr[idx];
		} else {
			return this.positiveArr[idx];
		}
	}

	set(idx: number, value: T): void {
		if (idx < 0) {
			idx = -idx - 1;
			this.negativeArr[idx] = value;
		} else {
			this.positiveArr[idx] = value;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/autoIndent.ts]---
Location: vscode-main/src/vs/editor/common/languages/autoIndent.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as strings from '../../../base/common/strings.js';
import { Range } from '../core/range.js';
import { ITextModel } from '../model.js';
import { IndentAction } from './languageConfiguration.js';
import { IndentConsts } from './supports/indentRules.js';
import { EditorAutoIndentStrategy } from '../config/editorOptions.js';
import { ILanguageConfigurationService } from './languageConfigurationRegistry.js';
import { IViewLineTokens } from '../tokens/lineTokens.js';
import { IndentationContextProcessor, isLanguageDifferentFromLineStart, ProcessedIndentRulesSupport } from './supports/indentationLineProcessor.js';
import { CursorConfiguration } from '../cursorCommon.js';

export interface IVirtualModel {
	tokenization: {
		getLineTokens(lineNumber: number): IViewLineTokens;
		getLanguageId(): string;
		getLanguageIdAtPosition(lineNumber: number, column: number): string;
		forceTokenization?(lineNumber: number): void;
	};
	getLineContent(lineNumber: number): string;
}

export interface IIndentConverter {
	shiftIndent(indentation: string): string;
	unshiftIndent(indentation: string): string;
	normalizeIndentation?(indentation: string): string;
}

/**
 * Get nearest preceding line which doesn't match unIndentPattern or contains all whitespace.
 * Result:
 * -1: run into the boundary of embedded languages
 * 0: every line above are invalid
 * else: nearest preceding line of the same language
 */
function getPrecedingValidLine(model: IVirtualModel, lineNumber: number, processedIndentRulesSupport: ProcessedIndentRulesSupport) {
	const languageId = model.tokenization.getLanguageIdAtPosition(lineNumber, 0);
	if (lineNumber > 1) {
		let lastLineNumber: number;
		let resultLineNumber = -1;

		for (lastLineNumber = lineNumber - 1; lastLineNumber >= 1; lastLineNumber--) {
			if (model.tokenization.getLanguageIdAtPosition(lastLineNumber, 0) !== languageId) {
				return resultLineNumber;
			}
			const text = model.getLineContent(lastLineNumber);
			if (processedIndentRulesSupport.shouldIgnore(lastLineNumber) || /^\s+$/.test(text) || text === '') {
				resultLineNumber = lastLineNumber;
				continue;
			}

			return lastLineNumber;
		}
	}

	return -1;
}

/**
 * Get inherited indentation from above lines.
 * 1. Find the nearest preceding line which doesn't match unIndentedLinePattern.
 * 2. If this line matches indentNextLinePattern or increaseIndentPattern, it means that the indent level of `lineNumber` should be 1 greater than this line.
 * 3. If this line doesn't match any indent rules
 *   a. check whether the line above it matches indentNextLinePattern
 *   b. If not, the indent level of this line is the result
 *   c. If so, it means the indent of this line is *temporary*, go upward utill we find a line whose indent is not temporary (the same workflow a -> b -> c).
 * 4. Otherwise, we fail to get an inherited indent from aboves. Return null and we should not touch the indent of `lineNumber`
 *
 * This function only return the inherited indent based on above lines, it doesn't check whether current line should decrease or not.
 */
export function getInheritIndentForLine(
	autoIndent: EditorAutoIndentStrategy,
	model: IVirtualModel,
	lineNumber: number,
	honorIntentialIndent: boolean = true,
	languageConfigurationService: ILanguageConfigurationService
): { indentation: string; action: IndentAction | null; line?: number } | null {
	if (autoIndent < EditorAutoIndentStrategy.Full) {
		return null;
	}

	const indentRulesSupport = languageConfigurationService.getLanguageConfiguration(model.tokenization.getLanguageId()).indentRulesSupport;
	if (!indentRulesSupport) {
		return null;
	}
	const processedIndentRulesSupport = new ProcessedIndentRulesSupport(model, indentRulesSupport, languageConfigurationService);

	if (lineNumber <= 1) {
		return {
			indentation: '',
			action: null
		};
	}

	// Use no indent if this is the first non-blank line
	for (let priorLineNumber = lineNumber - 1; priorLineNumber > 0; priorLineNumber--) {
		if (model.getLineContent(priorLineNumber) !== '') {
			break;
		}
		if (priorLineNumber === 1) {
			return {
				indentation: '',
				action: null
			};
		}
	}

	const precedingUnIgnoredLine = getPrecedingValidLine(model, lineNumber, processedIndentRulesSupport);
	if (precedingUnIgnoredLine < 0) {
		return null;
	} else if (precedingUnIgnoredLine < 1) {
		return {
			indentation: '',
			action: null
		};
	}

	if (processedIndentRulesSupport.shouldIncrease(precedingUnIgnoredLine) || processedIndentRulesSupport.shouldIndentNextLine(precedingUnIgnoredLine)) {
		const precedingUnIgnoredLineContent = model.getLineContent(precedingUnIgnoredLine);
		return {
			indentation: strings.getLeadingWhitespace(precedingUnIgnoredLineContent),
			action: IndentAction.Indent,
			line: precedingUnIgnoredLine
		};
	} else if (processedIndentRulesSupport.shouldDecrease(precedingUnIgnoredLine)) {
		const precedingUnIgnoredLineContent = model.getLineContent(precedingUnIgnoredLine);
		return {
			indentation: strings.getLeadingWhitespace(precedingUnIgnoredLineContent),
			action: null,
			line: precedingUnIgnoredLine
		};
	} else {
		// precedingUnIgnoredLine can not be ignored.
		// it doesn't increase indent of following lines
		// it doesn't increase just next line
		// so current line is not affect by precedingUnIgnoredLine
		// and then we should get a correct inheritted indentation from above lines
		if (precedingUnIgnoredLine === 1) {
			return {
				indentation: strings.getLeadingWhitespace(model.getLineContent(precedingUnIgnoredLine)),
				action: null,
				line: precedingUnIgnoredLine
			};
		}

		const previousLine = precedingUnIgnoredLine - 1;

		const previousLineIndentMetadata = indentRulesSupport.getIndentMetadata(model.getLineContent(previousLine));
		if (!(previousLineIndentMetadata & (IndentConsts.INCREASE_MASK | IndentConsts.DECREASE_MASK)) &&
			(previousLineIndentMetadata & IndentConsts.INDENT_NEXTLINE_MASK)) {
			let stopLine = 0;
			for (let i = previousLine - 1; i > 0; i--) {
				if (processedIndentRulesSupport.shouldIndentNextLine(i)) {
					continue;
				}
				stopLine = i;
				break;
			}

			return {
				indentation: strings.getLeadingWhitespace(model.getLineContent(stopLine + 1)),
				action: null,
				line: stopLine + 1
			};
		}

		if (honorIntentialIndent) {
			return {
				indentation: strings.getLeadingWhitespace(model.getLineContent(precedingUnIgnoredLine)),
				action: null,
				line: precedingUnIgnoredLine
			};
		} else {
			// search from precedingUnIgnoredLine until we find one whose indent is not temporary
			for (let i = precedingUnIgnoredLine; i > 0; i--) {
				if (processedIndentRulesSupport.shouldIncrease(i)) {
					return {
						indentation: strings.getLeadingWhitespace(model.getLineContent(i)),
						action: IndentAction.Indent,
						line: i
					};
				} else if (processedIndentRulesSupport.shouldIndentNextLine(i)) {
					let stopLine = 0;
					for (let j = i - 1; j > 0; j--) {
						if (processedIndentRulesSupport.shouldIndentNextLine(i)) {
							continue;
						}
						stopLine = j;
						break;
					}

					return {
						indentation: strings.getLeadingWhitespace(model.getLineContent(stopLine + 1)),
						action: null,
						line: stopLine + 1
					};
				} else if (processedIndentRulesSupport.shouldDecrease(i)) {
					return {
						indentation: strings.getLeadingWhitespace(model.getLineContent(i)),
						action: null,
						line: i
					};
				}
			}

			return {
				indentation: strings.getLeadingWhitespace(model.getLineContent(1)),
				action: null,
				line: 1
			};
		}
	}
}

export function getGoodIndentForLine(
	autoIndent: EditorAutoIndentStrategy,
	virtualModel: IVirtualModel,
	languageId: string,
	lineNumber: number,
	indentConverter: IIndentConverter,
	languageConfigurationService: ILanguageConfigurationService
): string | null {
	if (autoIndent < EditorAutoIndentStrategy.Full) {
		return null;
	}

	const richEditSupport = languageConfigurationService.getLanguageConfiguration(languageId);
	if (!richEditSupport) {
		return null;
	}

	const indentRulesSupport = languageConfigurationService.getLanguageConfiguration(languageId).indentRulesSupport;
	if (!indentRulesSupport) {
		return null;
	}

	const processedIndentRulesSupport = new ProcessedIndentRulesSupport(virtualModel, indentRulesSupport, languageConfigurationService);
	const indent = getInheritIndentForLine(autoIndent, virtualModel, lineNumber, undefined, languageConfigurationService);

	if (indent) {
		const inheritLine = indent.line;
		if (inheritLine !== undefined) {
			// Apply enter action as long as there are only whitespace lines between inherited line and this line.
			let shouldApplyEnterRules = true;
			for (let inBetweenLine = inheritLine; inBetweenLine < lineNumber - 1; inBetweenLine++) {
				if (!/^\s*$/.test(virtualModel.getLineContent(inBetweenLine))) {
					shouldApplyEnterRules = false;
					break;
				}
			}
			if (shouldApplyEnterRules) {
				const enterResult = richEditSupport.onEnter(autoIndent, '', virtualModel.getLineContent(inheritLine), '');

				if (enterResult) {
					let indentation = strings.getLeadingWhitespace(virtualModel.getLineContent(inheritLine));

					if (enterResult.removeText) {
						indentation = indentation.substring(0, indentation.length - enterResult.removeText);
					}

					if (
						(enterResult.indentAction === IndentAction.Indent) ||
						(enterResult.indentAction === IndentAction.IndentOutdent)
					) {
						indentation = indentConverter.shiftIndent(indentation);
					} else if (enterResult.indentAction === IndentAction.Outdent) {
						indentation = indentConverter.unshiftIndent(indentation);
					}

					if (processedIndentRulesSupport.shouldDecrease(lineNumber)) {
						indentation = indentConverter.unshiftIndent(indentation);
					}

					if (enterResult.appendText) {
						indentation += enterResult.appendText;
					}

					return strings.getLeadingWhitespace(indentation);
				}
			}
		}

		if (processedIndentRulesSupport.shouldDecrease(lineNumber)) {
			if (indent.action === IndentAction.Indent) {
				return indent.indentation;
			} else {
				return indentConverter.unshiftIndent(indent.indentation);
			}
		} else {
			if (indent.action === IndentAction.Indent) {
				return indentConverter.shiftIndent(indent.indentation);
			} else {
				return indent.indentation;
			}
		}
	}
	return null;
}

export function getIndentForEnter(
	autoIndent: EditorAutoIndentStrategy,
	model: ITextModel,
	range: Range,
	indentConverter: IIndentConverter,
	languageConfigurationService: ILanguageConfigurationService
): { beforeEnter: string; afterEnter: string } | null {
	if (autoIndent < EditorAutoIndentStrategy.Full) {
		return null;
	}
	const languageId = model.getLanguageIdAtPosition(range.startLineNumber, range.startColumn);
	const indentRulesSupport = languageConfigurationService.getLanguageConfiguration(languageId).indentRulesSupport;
	if (!indentRulesSupport) {
		return null;
	}

	model.tokenization.forceTokenization(range.startLineNumber);
	const indentationContextProcessor = new IndentationContextProcessor(model, languageConfigurationService);
	const processedContextTokens = indentationContextProcessor.getProcessedTokenContextAroundRange(range);
	const afterEnterProcessedTokens = processedContextTokens.afterRangeProcessedTokens;
	const beforeEnterProcessedTokens = processedContextTokens.beforeRangeProcessedTokens;
	const beforeEnterIndent = strings.getLeadingWhitespace(beforeEnterProcessedTokens.getLineContent());

	const virtualModel = createVirtualModelWithModifiedTokensAtLine(model, range.startLineNumber, beforeEnterProcessedTokens);
	const languageIsDifferentFromLineStart = isLanguageDifferentFromLineStart(model, range.getStartPosition());
	const currentLine = model.getLineContent(range.startLineNumber);
	const currentLineIndent = strings.getLeadingWhitespace(currentLine);
	const afterEnterAction = getInheritIndentForLine(autoIndent, virtualModel, range.startLineNumber + 1, undefined, languageConfigurationService);
	if (!afterEnterAction) {
		const beforeEnter = languageIsDifferentFromLineStart ? currentLineIndent : beforeEnterIndent;
		return {
			beforeEnter: beforeEnter,
			afterEnter: beforeEnter
		};
	}

	let afterEnterIndent = languageIsDifferentFromLineStart ? currentLineIndent : afterEnterAction.indentation;

	if (afterEnterAction.action === IndentAction.Indent) {
		afterEnterIndent = indentConverter.shiftIndent(afterEnterIndent);
	}

	if (indentRulesSupport.shouldDecrease(afterEnterProcessedTokens.getLineContent())) {
		afterEnterIndent = indentConverter.unshiftIndent(afterEnterIndent);
	}

	return {
		beforeEnter: languageIsDifferentFromLineStart ? currentLineIndent : beforeEnterIndent,
		afterEnter: afterEnterIndent
	};
}

/**
 * We should always allow intentional indentation. It means, if users change the indentation of `lineNumber` and the content of
 * this line doesn't match decreaseIndentPattern, we should not adjust the indentation.
 */
export function getIndentActionForType(
	cursorConfig: CursorConfiguration,
	model: ITextModel,
	range: Range,
	ch: string,
	indentConverter: IIndentConverter,
	languageConfigurationService: ILanguageConfigurationService
): string | null {
	const autoIndent = cursorConfig.autoIndent;
	if (autoIndent < EditorAutoIndentStrategy.Full) {
		return null;
	}
	const languageIsDifferentFromLineStart = isLanguageDifferentFromLineStart(model, range.getStartPosition());
	if (languageIsDifferentFromLineStart) {
		// this line has mixed languages and indentation rules will not work
		return null;
	}

	const languageId = model.getLanguageIdAtPosition(range.startLineNumber, range.startColumn);
	const indentRulesSupport = languageConfigurationService.getLanguageConfiguration(languageId).indentRulesSupport;
	if (!indentRulesSupport) {
		return null;
	}

	const indentationContextProcessor = new IndentationContextProcessor(model, languageConfigurationService);
	const processedContextTokens = indentationContextProcessor.getProcessedTokenContextAroundRange(range);
	const beforeRangeText = processedContextTokens.beforeRangeProcessedTokens.getLineContent();
	const afterRangeText = processedContextTokens.afterRangeProcessedTokens.getLineContent();
	const textAroundRange = beforeRangeText + afterRangeText;
	const textAroundRangeWithCharacter = beforeRangeText + ch + afterRangeText;

	// If previous content already matches decreaseIndentPattern, it means indentation of this line should already be adjusted
	// Users might change the indentation by purpose and we should honor that instead of readjusting.
	if (!indentRulesSupport.shouldDecrease(textAroundRange) && indentRulesSupport.shouldDecrease(textAroundRangeWithCharacter)) {
		// after typing `ch`, the content matches decreaseIndentPattern, we should adjust the indent to a good manner.
		// 1. Get inherited indent action
		const r = getInheritIndentForLine(autoIndent, model, range.startLineNumber, false, languageConfigurationService);
		if (!r) {
			return null;
		}

		let indentation = r.indentation;
		if (r.action !== IndentAction.Indent) {
			indentation = indentConverter.unshiftIndent(indentation);
		}

		return indentation;
	}

	const previousLineNumber = range.startLineNumber - 1;
	if (previousLineNumber > 0) {
		const previousLine = model.getLineContent(previousLineNumber);
		if (indentRulesSupport.shouldIndentNextLine(previousLine) && indentRulesSupport.shouldIncrease(textAroundRangeWithCharacter)) {
			const inheritedIndentationData = getInheritIndentForLine(autoIndent, model, range.startLineNumber, false, languageConfigurationService);
			const inheritedIndentation = inheritedIndentationData?.indentation;
			if (inheritedIndentation !== undefined) {
				const currentLine = model.getLineContent(range.startLineNumber);
				const actualCurrentIndentation = strings.getLeadingWhitespace(currentLine);
				const inferredCurrentIndentation = indentConverter.shiftIndent(inheritedIndentation);
				// If the inferred current indentation is not equal to the actual current indentation, then the indentation has been intentionally changed, in that case keep it
				const inferredIndentationEqualsActual = inferredCurrentIndentation === actualCurrentIndentation;
				const textAroundRangeContainsOnlyWhitespace = /^\s*$/.test(textAroundRange);
				const autoClosingPairs = cursorConfig.autoClosingPairs.autoClosingPairsOpenByEnd.get(ch);
				const autoClosingPairExists = autoClosingPairs && autoClosingPairs.length > 0;
				const isChFirstNonWhitespaceCharacterAndInAutoClosingPair = autoClosingPairExists && textAroundRangeContainsOnlyWhitespace;
				if (inferredIndentationEqualsActual && isChFirstNonWhitespaceCharacterAndInAutoClosingPair) {
					return inheritedIndentation;
				}
			}
		}
	}

	return null;
}

export function getIndentMetadata(
	model: ITextModel,
	lineNumber: number,
	languageConfigurationService: ILanguageConfigurationService
): number | null {
	const indentRulesSupport = languageConfigurationService.getLanguageConfiguration(model.getLanguageId()).indentRulesSupport;
	if (!indentRulesSupport) {
		return null;
	}
	if (lineNumber < 1 || lineNumber > model.getLineCount()) {
		return null;
	}
	return indentRulesSupport.getIndentMetadata(model.getLineContent(lineNumber));
}

function createVirtualModelWithModifiedTokensAtLine(model: ITextModel, modifiedLineNumber: number, modifiedTokens: IViewLineTokens): IVirtualModel {
	const virtualModel: IVirtualModel = {
		tokenization: {
			getLineTokens: (lineNumber: number): IViewLineTokens => {
				if (lineNumber === modifiedLineNumber) {
					return modifiedTokens;
				} else {
					return model.tokenization.getLineTokens(lineNumber);
				}
			},
			getLanguageId: (): string => {
				return model.getLanguageId();
			},
			getLanguageIdAtPosition: (lineNumber: number, column: number): string => {
				return model.getLanguageIdAtPosition(lineNumber, column);
			},
		},
		getLineContent: (lineNumber: number): string => {
			if (lineNumber === modifiedLineNumber) {
				return modifiedTokens.getLineContent();
			} else {
				return model.getLineContent(lineNumber);
			}
		}
	};
	return virtualModel;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/defaultDocumentColorsComputer.ts]---
Location: vscode-main/src/vs/editor/common/languages/defaultDocumentColorsComputer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Color, HSLA } from '../../../base/common/color.js';
import { IPosition } from '../core/position.js';
import { IRange } from '../core/range.js';
import { IColor, IColorInformation } from '../languages.js';

export interface IDocumentColorComputerTarget {
	getValue(): string;
	positionAt(offset: number): IPosition;
	findMatches(regex: RegExp): RegExpMatchArray[];
}

function _parseCaptureGroups(captureGroups: IterableIterator<string>) {
	const values = [];
	for (const captureGroup of captureGroups) {
		const parsedNumber = Number(captureGroup);
		if (parsedNumber || parsedNumber === 0 && captureGroup.replace(/\s/g, '') !== '') {
			values.push(parsedNumber);
		}
	}
	return values;
}

function _toIColor(r: number, g: number, b: number, a: number): IColor {
	return {
		red: r / 255,
		blue: b / 255,
		green: g / 255,
		alpha: a
	};
}

function _findRange(model: IDocumentColorComputerTarget, match: RegExpMatchArray): IRange | undefined {
	const index = match.index;
	const length = match[0].length;
	if (index === undefined) {
		return;
	}
	const startPosition = model.positionAt(index);
	const range: IRange = {
		startLineNumber: startPosition.lineNumber,
		startColumn: startPosition.column,
		endLineNumber: startPosition.lineNumber,
		endColumn: startPosition.column + length
	};
	return range;
}

function _findHexColorInformation(range: IRange | undefined, hexValue: string) {
	if (!range) {
		return;
	}
	const parsedHexColor = Color.Format.CSS.parseHex(hexValue);
	if (!parsedHexColor) {
		return;
	}
	return {
		range: range,
		color: _toIColor(parsedHexColor.rgba.r, parsedHexColor.rgba.g, parsedHexColor.rgba.b, parsedHexColor.rgba.a)
	};
}

function _findRGBColorInformation(range: IRange | undefined, matches: RegExpMatchArray[], isAlpha: boolean) {
	if (!range || matches.length !== 1) {
		return;
	}
	const match = matches[0];
	const captureGroups = match.values();
	const parsedRegex = _parseCaptureGroups(captureGroups);
	return {
		range: range,
		color: _toIColor(parsedRegex[0], parsedRegex[1], parsedRegex[2], isAlpha ? parsedRegex[3] : 1)
	};
}

function _findHSLColorInformation(range: IRange | undefined, matches: RegExpMatchArray[], isAlpha: boolean) {
	if (!range || matches.length !== 1) {
		return;
	}
	const match = matches[0];
	const captureGroups = match.values();
	const parsedRegex = _parseCaptureGroups(captureGroups);
	const colorEquivalent = new Color(new HSLA(parsedRegex[0], parsedRegex[1] / 100, parsedRegex[2] / 100, isAlpha ? parsedRegex[3] : 1));
	return {
		range: range,
		color: _toIColor(colorEquivalent.rgba.r, colorEquivalent.rgba.g, colorEquivalent.rgba.b, colorEquivalent.rgba.a)
	};
}

function _findMatches(model: IDocumentColorComputerTarget | string, regex: RegExp): RegExpMatchArray[] {
	if (typeof model === 'string') {
		return [...model.matchAll(regex)];
	} else {
		return model.findMatches(regex);
	}
}

function computeColors(model: IDocumentColorComputerTarget): IColorInformation[] {
	const result: IColorInformation[] = [];
	// Early validation for RGB and HSL
	const initialValidationRegex = /\b(rgb|rgba|hsl|hsla)(\([0-9\s,.\%]*\))|^(#)([A-Fa-f0-9]{3})\b|^(#)([A-Fa-f0-9]{4})\b|^(#)([A-Fa-f0-9]{6})\b|^(#)([A-Fa-f0-9]{8})\b|(?<=['"\s])(#)([A-Fa-f0-9]{3})\b|(?<=['"\s])(#)([A-Fa-f0-9]{4})\b|(?<=['"\s])(#)([A-Fa-f0-9]{6})\b|(?<=['"\s])(#)([A-Fa-f0-9]{8})\b/gm;
	const initialValidationMatches = _findMatches(model, initialValidationRegex);

	// Potential colors have been found, validate the parameters
	if (initialValidationMatches.length > 0) {
		for (const initialMatch of initialValidationMatches) {
			const initialCaptureGroups = initialMatch.filter(captureGroup => captureGroup !== undefined);
			const colorScheme = initialCaptureGroups[1];
			const colorParameters = initialCaptureGroups[2];
			if (!colorParameters) {
				continue;
			}
			let colorInformation;
			if (colorScheme === 'rgb') {
				const regexParameters = /^\(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*\)$/gm;
				colorInformation = _findRGBColorInformation(_findRange(model, initialMatch), _findMatches(colorParameters, regexParameters), false);
			} else if (colorScheme === 'rgba') {
				const regexParameters = /^\(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(0[.][0-9]+|[.][0-9]+|[01][.]|[01])\s*\)$/gm;
				colorInformation = _findRGBColorInformation(_findRange(model, initialMatch), _findMatches(colorParameters, regexParameters), true);
			} else if (colorScheme === 'hsl') {
				const regexParameters = /^\(\s*((?:360(?:\.0+)?|(?:36[0]|3[0-5][0-9]|[12][0-9][0-9]|[1-9]?[0-9])(?:\.\d+)?))\s*[\s,]\s*(100(?:\.0+)?|\d{1,2}[.]\d*|\d{1,2})%\s*[\s,]\s*(100(?:\.0+)?|\d{1,2}[.]\d*|\d{1,2})%\s*\)$/gm;
				colorInformation = _findHSLColorInformation(_findRange(model, initialMatch), _findMatches(colorParameters, regexParameters), false);
			} else if (colorScheme === 'hsla') {
				const regexParameters = /^\(\s*((?:360(?:\.0+)?|(?:36[0]|3[0-5][0-9]|[12][0-9][0-9]|[1-9]?[0-9])(?:\.\d+)?))\s*[\s,]\s*(100(?:\.0+)?|\d{1,2}[.]\d*|\d{1,2})%\s*[\s,]\s*(100(?:\.0+)?|\d{1,2}[.]\d*|\d{1,2})%\s*[\s,]\s*(0[.][0-9]+|[.][0-9]+|[01][.]0*|[01])\s*\)$/gm;
				colorInformation = _findHSLColorInformation(_findRange(model, initialMatch), _findMatches(colorParameters, regexParameters), true);
			} else if (colorScheme === '#') {
				colorInformation = _findHexColorInformation(_findRange(model, initialMatch), colorScheme + colorParameters);
			}
			if (colorInformation) {
				result.push(colorInformation);
			}
		}
	}
	return result;
}

/**
 * Returns an array of all default document colors in the provided document
 */
export function computeDefaultDocumentColors(model: IDocumentColorComputerTarget): IColorInformation[] {
	if (!model || typeof model.getValue !== 'function' || typeof model.positionAt !== 'function') {
		// Unknown caller!
		return [];
	}
	return computeColors(model);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/enterAction.ts]---
Location: vscode-main/src/vs/editor/common/languages/enterAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Range } from '../core/range.js';
import { ITextModel } from '../model.js';
import { IndentAction, CompleteEnterAction } from './languageConfiguration.js';
import { EditorAutoIndentStrategy } from '../config/editorOptions.js';
import { getIndentationAtPosition, ILanguageConfigurationService } from './languageConfigurationRegistry.js';
import { IndentationContextProcessor } from './supports/indentationLineProcessor.js';

export function getEnterAction(
	autoIndent: EditorAutoIndentStrategy,
	model: ITextModel,
	range: Range,
	languageConfigurationService: ILanguageConfigurationService
): CompleteEnterAction | null {
	model.tokenization.forceTokenization(range.startLineNumber);
	const languageId = model.getLanguageIdAtPosition(range.startLineNumber, range.startColumn);
	const richEditSupport = languageConfigurationService.getLanguageConfiguration(languageId);
	if (!richEditSupport) {
		return null;
	}
	const indentationContextProcessor = new IndentationContextProcessor(model, languageConfigurationService);
	const processedContextTokens = indentationContextProcessor.getProcessedTokenContextAroundRange(range);
	const previousLineText = processedContextTokens.previousLineProcessedTokens.getLineContent();
	const beforeEnterText = processedContextTokens.beforeRangeProcessedTokens.getLineContent();
	const afterEnterText = processedContextTokens.afterRangeProcessedTokens.getLineContent();

	const enterResult = richEditSupport.onEnter(autoIndent, previousLineText, beforeEnterText, afterEnterText);
	if (!enterResult) {
		return null;
	}

	const indentAction = enterResult.indentAction;
	let appendText = enterResult.appendText;
	const removeText = enterResult.removeText || 0;

	// Here we add `\t` to appendText first because enterAction is leveraging appendText and removeText to change indentation.
	if (!appendText) {
		if (
			(indentAction === IndentAction.Indent) ||
			(indentAction === IndentAction.IndentOutdent)
		) {
			appendText = '\t';
		} else {
			appendText = '';
		}
	} else if (indentAction === IndentAction.Indent) {
		appendText = '\t' + appendText;
	}

	let indentation = getIndentationAtPosition(model, range.startLineNumber, range.startColumn);
	if (removeText) {
		indentation = indentation.substring(0, indentation.length - removeText);
	}

	return {
		indentAction: indentAction,
		appendText: appendText,
		removeText: removeText,
		indentation: indentation
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/language.ts]---
Location: vscode-main/src/vs/editor/common/languages/language.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { ILanguageIdCodec } from '../languages.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';

export const ILanguageService = createDecorator<ILanguageService>('languageService');

export interface ILanguageExtensionPoint {
	id: string;
	extensions?: string[];
	filenames?: string[];
	filenamePatterns?: string[];
	firstLine?: string;
	aliases?: string[];
	mimetypes?: string[];
	configuration?: URI;
	/**
	 * @internal
	 */
	icon?: ILanguageIcon;
}

export interface ILanguageSelection {
	readonly languageId: string;
	readonly onDidChange: Event<string>;
}

export interface ILanguageNameIdPair {
	readonly languageName: string;
	readonly languageId: string;
}

export interface ILanguageIcon {
	readonly light: URI;
	readonly dark: URI;
}

export interface ILanguageService {
	readonly _serviceBrand: undefined;

	/**
	 * A codec which can encode and decode a string `languageId` as a number.
	 */
	readonly languageIdCodec: ILanguageIdCodec;

	/**
	 * An event emitted when basic language features are requested for the first time.
	 * This event is emitted when embedded languages are encountered (e.g. JS code block inside Markdown)
	 * or when a language is associated to a text model.
	 *
	 * **Note**: Basic language features refers to language configuration related features.
	 * **Note**: This event is a superset of `onDidRequestRichLanguageFeatures`
	 */
	readonly onDidRequestBasicLanguageFeatures: Event<string>;

	/**
	 * An event emitted when rich language features are requested for the first time.
	 * This event is emitted when a language is associated to a text model.
	 *
	 * **Note**: Rich language features refers to tokenizers, language features based on providers, etc.
	 * **Note**: This event is a subset of `onDidRequestRichLanguageFeatures`
	 */
	readonly onDidRequestRichLanguageFeatures: Event<string>;

	/**
	 * An event emitted when languages have changed.
	 */
	readonly onDidChange: Event<void>;

	/**
	 * Register a language.
	 */
	registerLanguage(def: ILanguageExtensionPoint): IDisposable;

	/**
	 * Check if `languageId` is registered.
	 */
	isRegisteredLanguageId(languageId: string): boolean;

	/**
	 * Get a list of all registered languages.
	 */
	getRegisteredLanguageIds(): string[];

	/**
	 * Get a list of all registered languages with a name.
	 * If a language is explicitly registered without a name, it will not be part of the result.
	 * The result is sorted using by name case insensitive.
	 */
	getSortedRegisteredLanguageNames(): ILanguageNameIdPair[];

	/**
	 * Get the preferred language name for a language.
	 */
	getLanguageName(languageId: string): string | null;

	/**
	 * Get the mimetype for a language.
	 */
	getMimeType(languageId: string): string | null;

	/**
	 * Get the default icon for the language.
	 */
	getIcon(languageId: string): ILanguageIcon | null;

	/**
	 * Get all file extensions for a language.
	 */
	getExtensions(languageId: string): ReadonlyArray<string>;

	/**
	 * Get all file names for a language.
	 */
	getFilenames(languageId: string): ReadonlyArray<string>;

	/**
	 * Get all language configuration files for a language.
	 */
	getConfigurationFiles(languageId: string): ReadonlyArray<URI>;

	/**
	 * Look up a language by its name case insensitive.
	 */
	getLanguageIdByLanguageName(languageName: string): string | null;

	/**
	 * Look up a language by its mime type.
	 */
	getLanguageIdByMimeType(mimeType: string | null | undefined): string | null;

	/**
	 * Guess the language id for a resource.
	 */
	guessLanguageIdByFilepathOrFirstLine(resource: URI, firstLine?: string): string | null;

	/**
	 * Will fall back to 'plaintext' if `languageId` is unknown.
	 */
	createById(languageId: string | null | undefined): ILanguageSelection;

	/**
	 * Will fall back to 'plaintext' if `mimeType` is unknown.
	 */
	createByMimeType(mimeType: string | null | undefined): ILanguageSelection;

	/**
	 * Will fall back to 'plaintext' if the `languageId` cannot be determined.
	 */
	createByFilepathOrFirstLine(resource: URI | null, firstLine?: string): ILanguageSelection;

	/**
	 * Request basic language features for a language.
	 */
	requestBasicLanguageFeatures(languageId: string): void;

	/**
	 * Request rich language features for a language.
	 */
	requestRichLanguageFeatures(languageId: string): void;

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/languageConfiguration.ts]---
Location: vscode-main/src/vs/editor/common/languages/languageConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';
import { StandardTokenType } from '../encodedTokenAttributes.js';
import { ScopedLineTokens } from './supports.js';

/**
 * Configuration for line comments.
 */
export interface LineCommentConfig {
	/**
	 * The line comment token, like `//`
	 */
	comment: string;
	/**
	 * Whether the comment token should not be indented and placed at the first column.
	 * Defaults to false.
	 */
	noIndent?: boolean;
}

/**
 * Describes how comments for a language work.
 */
export interface CommentRule {
	/**
	 * The line comment token, like `// this is a comment`.
	 * Can be a string or an object with comment and optional noIndent properties.
	 */
	lineComment?: string | LineCommentConfig | null;
	/**
	 * The block comment character pair, like `/* block comment *&#47;`
	 */
	blockComment?: CharacterPair | null;
}

/**
 * The language configuration interface defines the contract between extensions and
 * various editor features, like automatic bracket insertion, automatic indentation etc.
 */
export interface LanguageConfiguration {
	/**
	 * The language's comment settings.
	 */
	comments?: CommentRule;
	/**
	 * The language's brackets.
	 * This configuration implicitly affects pressing Enter around these brackets.
	 */
	brackets?: CharacterPair[];
	/**
	 * The language's word definition.
	 * If the language supports Unicode identifiers (e.g. JavaScript), it is preferable
	 * to provide a word definition that uses exclusion of known separators.
	 * e.g.: A regex that matches anything except known separators (and dot is allowed to occur in a floating point number):
	 *   /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g
	 */
	wordPattern?: RegExp;
	/**
	 * The language's indentation settings.
	 */
	indentationRules?: IndentationRule;
	/**
	 * The language's rules to be evaluated when pressing Enter.
	 */
	onEnterRules?: OnEnterRule[];
	/**
	 * The language's auto closing pairs. The 'close' character is automatically inserted with the
	 * 'open' character is typed. If not set, the configured brackets will be used.
	 */
	autoClosingPairs?: IAutoClosingPairConditional[];
	/**
	 * The language's surrounding pairs. When the 'open' character is typed on a selection, the
	 * selected string is surrounded by the open and close characters. If not set, the autoclosing pairs
	 * settings will be used.
	 */
	surroundingPairs?: IAutoClosingPair[];
	/**
	 * Defines a list of bracket pairs that are colorized depending on their nesting level.
	 * If not set, the configured brackets will be used.
	*/
	colorizedBracketPairs?: CharacterPair[];
	/**
	 * Defines what characters must be after the cursor for bracket or quote autoclosing to occur when using the \'languageDefined\' autoclosing setting.
	 *
	 * This is typically the set of characters which can not start an expression, such as whitespace, closing brackets, non-unary operators, etc.
	 */
	autoCloseBefore?: string;

	/**
	 * The language's folding rules.
	 */
	folding?: FoldingRules;

	/**
	 * **Deprecated** Do not use.
	 *
	 * @deprecated Will be replaced by a better API soon.
	 */
	__electricCharacterSupport?: {
		docComment?: IDocComment;
	};
}

/**
 * @internal
 */
type OrUndefined<T> = { [P in keyof T]: T[P] | undefined };

/**
 * @internal
 */
export type ExplicitLanguageConfiguration = OrUndefined<Required<LanguageConfiguration>>;

/**
 * Describes indentation rules for a language.
 */
export interface IndentationRule {
	/**
	 * If a line matches this pattern, then all the lines after it should be unindented once (until another rule matches).
	 */
	decreaseIndentPattern: RegExp;
	/**
	 * If a line matches this pattern, then all the lines after it should be indented once (until another rule matches).
	 */
	increaseIndentPattern: RegExp;
	/**
	 * If a line matches this pattern, then **only the next line** after it should be indented once.
	 */
	indentNextLinePattern?: RegExp | null;
	/**
	 * If a line matches this pattern, then its indentation should not be changed and it should not be evaluated against the other rules.
	 */
	unIndentedLinePattern?: RegExp | null;

}

/**
 * Describes language specific folding markers such as '#region' and '#endregion'.
 * The start and end regexes will be tested against the contents of all lines and must be designed efficiently:
 * - the regex should start with '^'
 * - regexp flags (i, g) are ignored
 */
export interface FoldingMarkers {
	start: RegExp;
	end: RegExp;
}

/**
 * Describes folding rules for a language.
 */
export interface FoldingRules {
	/**
	 * Used by the indentation based strategy to decide whether empty lines belong to the previous or the next block.
	 * A language adheres to the off-side rule if blocks in that language are expressed by their indentation.
	 * See [wikipedia](https://en.wikipedia.org/wiki/Off-side_rule) for more information.
	 * If not set, `false` is used and empty lines belong to the previous block.
	 */
	offSide?: boolean;

	/**
	 * Region markers used by the language.
	 */
	markers?: FoldingMarkers;
}

/**
 * Describes a rule to be evaluated when pressing Enter.
 */
export interface OnEnterRule {
	/**
	 * This rule will only execute if the text before the cursor matches this regular expression.
	 */
	beforeText: RegExp;
	/**
	 * This rule will only execute if the text after the cursor matches this regular expression.
	 */
	afterText?: RegExp;
	/**
	 * This rule will only execute if the text above the this line matches this regular expression.
	 */
	previousLineText?: RegExp;
	/**
	 * The action to execute.
	 */
	action: EnterAction;
}

/**
 * Definition of documentation comments (e.g. Javadoc/JSdoc)
 */
export interface IDocComment {
	/**
	 * The string that starts a doc comment (e.g. '/**')
	 */
	open: string;
	/**
	 * The string that appears on the last line and closes the doc comment (e.g. ' * /').
	 */
	close?: string;
}

/**
 * A tuple of two characters, like a pair of
 * opening and closing brackets.
 */
export type CharacterPair = [string, string];

export interface IAutoClosingPair {
	open: string;
	close: string;
}

export interface IAutoClosingPairConditional extends IAutoClosingPair {
	notIn?: string[];
}

/**
 * Describes what to do with the indentation when pressing Enter.
 */
export enum IndentAction {
	/**
	 * Insert new line and copy the previous line's indentation.
	 */
	None = 0,
	/**
	 * Insert new line and indent once (relative to the previous line's indentation).
	 */
	Indent = 1,
	/**
	 * Insert two new lines:
	 *  - the first one indented which will hold the cursor
	 *  - the second one at the same indentation level
	 */
	IndentOutdent = 2,
	/**
	 * Insert new line and outdent once (relative to the previous line's indentation).
	 */
	Outdent = 3
}

/**
 * Describes what to do when pressing Enter.
 */
export interface EnterAction {
	/**
	 * Describe what to do with the indentation.
	 */
	indentAction: IndentAction;
	/**
	 * Describes text to be appended after the new line and after the indentation.
	 */
	appendText?: string;
	/**
	 * Describes the number of characters to remove from the new line's indentation.
	 */
	removeText?: number;
}

/**
 * @internal
 */
export interface CompleteEnterAction {
	/**
	 * Describe what to do with the indentation.
	 */
	indentAction: IndentAction;
	/**
	 * Describes text to be appended after the new line and after the indentation.
	 */
	appendText: string;
	/**
	 * Describes the number of characters to remove from the new line's indentation.
	 */
	removeText: number;
	/**
	 * The line's indentation minus removeText
	 */
	indentation: string;
}

/**
 * @internal
 */
export class StandardAutoClosingPairConditional {

	readonly open: string;
	readonly close: string;
	private readonly _inString: boolean;
	private readonly _inComment: boolean;
	private readonly _inRegEx: boolean;
	private _neutralCharacter: string | null = null;
	private _neutralCharacterSearched: boolean = false;

	constructor(source: IAutoClosingPairConditional) {
		this.open = source.open;
		this.close = source.close;

		// initially allowed in all tokens
		this._inString = true;
		this._inComment = true;
		this._inRegEx = true;

		if (Array.isArray(source.notIn)) {
			for (let i = 0, len = source.notIn.length; i < len; i++) {
				const notIn: string = source.notIn[i];
				switch (notIn) {
					case 'string':
						this._inString = false;
						break;
					case 'comment':
						this._inComment = false;
						break;
					case 'regex':
						this._inRegEx = false;
						break;
				}
			}
		}
	}

	public isOK(standardToken: StandardTokenType): boolean {
		switch (standardToken) {
			case StandardTokenType.Other:
				return true;
			case StandardTokenType.Comment:
				return this._inComment;
			case StandardTokenType.String:
				return this._inString;
			case StandardTokenType.RegEx:
				return this._inRegEx;
		}
	}

	public shouldAutoClose(context: ScopedLineTokens, column: number): boolean {
		// Always complete on empty line
		if (context.getTokenCount() === 0) {
			return true;
		}

		const tokenIndex = context.findTokenIndexAtOffset(column - 2);
		const standardTokenType = context.getStandardTokenType(tokenIndex);
		return this.isOK(standardTokenType);
	}

	private _findNeutralCharacterInRange(fromCharCode: number, toCharCode: number): string | null {
		for (let charCode = fromCharCode; charCode <= toCharCode; charCode++) {
			const character = String.fromCharCode(charCode);
			if (!this.open.includes(character) && !this.close.includes(character)) {
				return character;
			}
		}
		return null;
	}

	/**
	 * Find a character in the range [0-9a-zA-Z] that does not appear in the open or close
	 */
	public findNeutralCharacter(): string | null {
		if (!this._neutralCharacterSearched) {
			this._neutralCharacterSearched = true;
			if (!this._neutralCharacter) {
				this._neutralCharacter = this._findNeutralCharacterInRange(CharCode.Digit0, CharCode.Digit9);
			}
			if (!this._neutralCharacter) {
				this._neutralCharacter = this._findNeutralCharacterInRange(CharCode.a, CharCode.z);
			}
			if (!this._neutralCharacter) {
				this._neutralCharacter = this._findNeutralCharacterInRange(CharCode.A, CharCode.Z);
			}
		}
		return this._neutralCharacter;
	}
}

/**
 * @internal
 */
export class AutoClosingPairs {
	// it is useful to be able to get pairs using either end of open and close

	/** Key is first character of open */
	public readonly autoClosingPairsOpenByStart: Map<string, StandardAutoClosingPairConditional[]>;
	/** Key is last character of open */
	public readonly autoClosingPairsOpenByEnd: Map<string, StandardAutoClosingPairConditional[]>;
	/** Key is first character of close */
	public readonly autoClosingPairsCloseByStart: Map<string, StandardAutoClosingPairConditional[]>;
	/** Key is last character of close */
	public readonly autoClosingPairsCloseByEnd: Map<string, StandardAutoClosingPairConditional[]>;
	/** Key is close. Only has pairs that are a single character */
	public readonly autoClosingPairsCloseSingleChar: Map<string, StandardAutoClosingPairConditional[]>;

	constructor(autoClosingPairs: StandardAutoClosingPairConditional[]) {
		this.autoClosingPairsOpenByStart = new Map<string, StandardAutoClosingPairConditional[]>();
		this.autoClosingPairsOpenByEnd = new Map<string, StandardAutoClosingPairConditional[]>();
		this.autoClosingPairsCloseByStart = new Map<string, StandardAutoClosingPairConditional[]>();
		this.autoClosingPairsCloseByEnd = new Map<string, StandardAutoClosingPairConditional[]>();
		this.autoClosingPairsCloseSingleChar = new Map<string, StandardAutoClosingPairConditional[]>();
		for (const pair of autoClosingPairs) {
			appendEntry(this.autoClosingPairsOpenByStart, pair.open.charAt(0), pair);
			appendEntry(this.autoClosingPairsOpenByEnd, pair.open.charAt(pair.open.length - 1), pair);
			appendEntry(this.autoClosingPairsCloseByStart, pair.close.charAt(0), pair);
			appendEntry(this.autoClosingPairsCloseByEnd, pair.close.charAt(pair.close.length - 1), pair);
			if (pair.close.length === 1 && pair.open.length === 1) {
				appendEntry(this.autoClosingPairsCloseSingleChar, pair.close, pair);
			}
		}
	}
}

function appendEntry<K, V>(target: Map<K, V[]>, key: K, value: V): void {
	if (target.has(key)) {
		target.get(key)!.push(value);
	} else {
		target.set(key, [value]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/languageConfigurationRegistry.ts]---
Location: vscode-main/src/vs/editor/common/languages/languageConfigurationRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, IDisposable, markAsSingleton, toDisposable } from '../../../base/common/lifecycle.js';
import * as strings from '../../../base/common/strings.js';
import { ITextModel } from '../model.js';
import { DEFAULT_WORD_REGEXP, ensureValidWordDefinition } from '../core/wordHelper.js';
import { EnterAction, FoldingRules, IAutoClosingPair, IndentationRule, LanguageConfiguration, AutoClosingPairs, CharacterPair, ExplicitLanguageConfiguration } from './languageConfiguration.js';
import { CharacterPairSupport } from './supports/characterPair.js';
import { BracketElectricCharacterSupport } from './supports/electricCharacter.js';
import { IndentRulesSupport } from './supports/indentRules.js';
import { OnEnterSupport } from './supports/onEnter.js';
import { RichEditBrackets } from './supports/richEditBrackets.js';
import { EditorAutoIndentStrategy } from '../config/editorOptions.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { ILanguageService } from './language.js';
import { InstantiationType, registerSingleton } from '../../../platform/instantiation/common/extensions.js';
import { PLAINTEXT_LANGUAGE_ID } from './modesRegistry.js';
import { LanguageBracketsConfiguration } from './supports/languageBracketsConfiguration.js';

/**
 * Interface used to support insertion of mode specific comments.
 */
export interface ICommentsConfiguration {
	lineCommentToken?: string;
	lineCommentNoIndent?: boolean;
	blockCommentStartToken?: string;
	blockCommentEndToken?: string;
}

export interface ILanguageConfigurationService {
	readonly _serviceBrand: undefined;

	readonly onDidChange: Event<LanguageConfigurationServiceChangeEvent>;

	/**
	 * @param priority Use a higher number for higher priority
	 */
	register(languageId: string, configuration: LanguageConfiguration, priority?: number): IDisposable;

	getLanguageConfiguration(languageId: string): ResolvedLanguageConfiguration;

}

export class LanguageConfigurationServiceChangeEvent {
	constructor(public readonly languageId: string | undefined) { }

	public affects(languageId: string): boolean {
		return !this.languageId ? true : this.languageId === languageId;
	}
}

export const ILanguageConfigurationService = createDecorator<ILanguageConfigurationService>('languageConfigurationService');

export class LanguageConfigurationService extends Disposable implements ILanguageConfigurationService {
	_serviceBrand: undefined;

	private readonly _registry = this._register(new LanguageConfigurationRegistry());

	private readonly onDidChangeEmitter = this._register(new Emitter<LanguageConfigurationServiceChangeEvent>());
	public readonly onDidChange = this.onDidChangeEmitter.event;

	private readonly configurations = new Map<string, ResolvedLanguageConfiguration>();

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ILanguageService private readonly languageService: ILanguageService
	) {
		super();

		const languageConfigKeys = new Set(Object.values(customizedLanguageConfigKeys));

		this._register(this.configurationService.onDidChangeConfiguration((e) => {
			const globalConfigChanged = e.change.keys.some((k) =>
				languageConfigKeys.has(k)
			);
			const localConfigChanged = e.change.overrides
				.filter(([overrideLangName, keys]) =>
					keys.some((k) => languageConfigKeys.has(k))
				)
				.map(([overrideLangName]) => overrideLangName);

			if (globalConfigChanged) {
				this.configurations.clear();
				this.onDidChangeEmitter.fire(new LanguageConfigurationServiceChangeEvent(undefined));
			} else {
				for (const languageId of localConfigChanged) {
					if (this.languageService.isRegisteredLanguageId(languageId)) {
						this.configurations.delete(languageId);
						this.onDidChangeEmitter.fire(new LanguageConfigurationServiceChangeEvent(languageId));
					}
				}
			}
		}));

		this._register(this._registry.onDidChange((e) => {
			this.configurations.delete(e.languageId);
			this.onDidChangeEmitter.fire(new LanguageConfigurationServiceChangeEvent(e.languageId));
		}));
	}

	public register(languageId: string, configuration: LanguageConfiguration, priority?: number): IDisposable {
		return this._registry.register(languageId, configuration, priority);
	}

	public getLanguageConfiguration(languageId: string): ResolvedLanguageConfiguration {
		let result = this.configurations.get(languageId);
		if (!result) {
			result = computeConfig(languageId, this._registry, this.configurationService, this.languageService);
			this.configurations.set(languageId, result);
		}
		return result;
	}
}

function computeConfig(
	languageId: string,
	registry: LanguageConfigurationRegistry,
	configurationService: IConfigurationService,
	languageService: ILanguageService,
): ResolvedLanguageConfiguration {
	let languageConfig = registry.getLanguageConfiguration(languageId);

	if (!languageConfig) {
		if (!languageService.isRegisteredLanguageId(languageId)) {
			// this happens for the null language, which can be returned by monarch.
			// Instead of throwing an error, we just return a default config.
			return new ResolvedLanguageConfiguration(languageId, {});
		}
		languageConfig = new ResolvedLanguageConfiguration(languageId, {});
	}

	const customizedConfig = getCustomizedLanguageConfig(languageConfig.languageId, configurationService);
	const data = combineLanguageConfigurations([languageConfig.underlyingConfig, customizedConfig]);
	const config = new ResolvedLanguageConfiguration(languageConfig.languageId, data);
	return config;
}

const customizedLanguageConfigKeys = {
	brackets: 'editor.language.brackets',
	colorizedBracketPairs: 'editor.language.colorizedBracketPairs'
};

function getCustomizedLanguageConfig(languageId: string, configurationService: IConfigurationService): LanguageConfiguration {
	const brackets = configurationService.getValue(customizedLanguageConfigKeys.brackets, {
		overrideIdentifier: languageId,
	});

	const colorizedBracketPairs = configurationService.getValue(customizedLanguageConfigKeys.colorizedBracketPairs, {
		overrideIdentifier: languageId,
	});

	return {
		brackets: validateBracketPairs(brackets),
		colorizedBracketPairs: validateBracketPairs(colorizedBracketPairs),
	};
}

function validateBracketPairs(data: unknown): CharacterPair[] | undefined {
	if (!Array.isArray(data)) {
		return undefined;
	}
	return data.map(pair => {
		if (!Array.isArray(pair) || pair.length !== 2) {
			return undefined;
		}
		return [pair[0], pair[1]] as CharacterPair;
	}).filter((p): p is CharacterPair => !!p);
}

export function getIndentationAtPosition(model: ITextModel, lineNumber: number, column: number): string {
	const lineText = model.getLineContent(lineNumber);
	let indentation = strings.getLeadingWhitespace(lineText);
	if (indentation.length > column - 1) {
		indentation = indentation.substring(0, column - 1);
	}
	return indentation;
}

class ComposedLanguageConfiguration {
	private readonly _entries: LanguageConfigurationContribution[];
	private _order: number;
	private _resolved: ResolvedLanguageConfiguration | null = null;

	constructor(public readonly languageId: string) {
		this._entries = [];
		this._order = 0;
		this._resolved = null;
	}

	public register(
		configuration: LanguageConfiguration,
		priority: number
	): IDisposable {
		const entry = new LanguageConfigurationContribution(
			configuration,
			priority,
			++this._order
		);
		this._entries.push(entry);
		this._resolved = null;
		return markAsSingleton(toDisposable(() => {
			for (let i = 0; i < this._entries.length; i++) {
				if (this._entries[i] === entry) {
					this._entries.splice(i, 1);
					this._resolved = null;
					break;
				}
			}
		}));
	}

	public getResolvedConfiguration(): ResolvedLanguageConfiguration | null {
		if (!this._resolved) {
			const config = this._resolve();
			if (config) {
				this._resolved = new ResolvedLanguageConfiguration(
					this.languageId,
					config
				);
			}
		}
		return this._resolved;
	}

	private _resolve(): LanguageConfiguration | null {
		if (this._entries.length === 0) {
			return null;
		}
		this._entries.sort(LanguageConfigurationContribution.cmp);
		return combineLanguageConfigurations(this._entries.map(e => e.configuration));
	}
}

function combineLanguageConfigurations(configs: LanguageConfiguration[]): LanguageConfiguration {
	let result: ExplicitLanguageConfiguration = {
		comments: undefined,
		brackets: undefined,
		wordPattern: undefined,
		indentationRules: undefined,
		onEnterRules: undefined,
		autoClosingPairs: undefined,
		surroundingPairs: undefined,
		autoCloseBefore: undefined,
		folding: undefined,
		colorizedBracketPairs: undefined,
		__electricCharacterSupport: undefined,
	};
	for (const entry of configs) {
		result = {
			comments: entry.comments || result.comments,
			brackets: entry.brackets || result.brackets,
			wordPattern: entry.wordPattern || result.wordPattern,
			indentationRules: entry.indentationRules || result.indentationRules,
			onEnterRules: entry.onEnterRules || result.onEnterRules,
			autoClosingPairs: entry.autoClosingPairs || result.autoClosingPairs,
			surroundingPairs: entry.surroundingPairs || result.surroundingPairs,
			autoCloseBefore: entry.autoCloseBefore || result.autoCloseBefore,
			folding: entry.folding || result.folding,
			colorizedBracketPairs: entry.colorizedBracketPairs || result.colorizedBracketPairs,
			__electricCharacterSupport: entry.__electricCharacterSupport || result.__electricCharacterSupport,
		};
	}

	return result;
}

class LanguageConfigurationContribution {
	constructor(
		public readonly configuration: LanguageConfiguration,
		public readonly priority: number,
		public readonly order: number
	) { }

	public static cmp(a: LanguageConfigurationContribution, b: LanguageConfigurationContribution) {
		if (a.priority === b.priority) {
			// higher order last
			return a.order - b.order;
		}
		// higher priority last
		return a.priority - b.priority;
	}
}

export class LanguageConfigurationChangeEvent {
	constructor(public readonly languageId: string) { }
}

export class LanguageConfigurationRegistry extends Disposable {
	private readonly _entries = new Map<string, ComposedLanguageConfiguration>();

	private readonly _onDidChange = this._register(new Emitter<LanguageConfigurationChangeEvent>());
	public readonly onDidChange: Event<LanguageConfigurationChangeEvent> = this._onDidChange.event;

	constructor() {
		super();
		this._register(this.register(PLAINTEXT_LANGUAGE_ID, {
			brackets: [
				['(', ')'],
				['[', ']'],
				['{', '}'],
			],
			surroundingPairs: [
				{ open: '{', close: '}' },
				{ open: '[', close: ']' },
				{ open: '(', close: ')' },
				{ open: '<', close: '>' },
				{ open: '\"', close: '\"' },
				{ open: '\'', close: '\'' },
				{ open: '`', close: '`' },
			],
			colorizedBracketPairs: [],
			folding: {
				offSide: true
			}
		}, 0));
	}

	/**
	 * @param priority Use a higher number for higher priority
	 */
	public register(languageId: string, configuration: LanguageConfiguration, priority: number = 0): IDisposable {
		let entries = this._entries.get(languageId);
		if (!entries) {
			entries = new ComposedLanguageConfiguration(languageId);
			this._entries.set(languageId, entries);
		}

		const disposable = entries.register(configuration, priority);
		this._onDidChange.fire(new LanguageConfigurationChangeEvent(languageId));

		return markAsSingleton(toDisposable(() => {
			disposable.dispose();
			this._onDidChange.fire(new LanguageConfigurationChangeEvent(languageId));
		}));
	}

	public getLanguageConfiguration(languageId: string): ResolvedLanguageConfiguration | null {
		const entries = this._entries.get(languageId);
		return entries?.getResolvedConfiguration() || null;
	}
}

/**
 * Immutable.
*/
export class ResolvedLanguageConfiguration {
	private _brackets: RichEditBrackets | null;
	private _electricCharacter: BracketElectricCharacterSupport | null;
	private readonly _onEnterSupport: OnEnterSupport | null;

	public readonly comments: ICommentsConfiguration | null;
	public readonly characterPair: CharacterPairSupport;
	public readonly wordDefinition: RegExp;
	public readonly indentRulesSupport: IndentRulesSupport | null;
	public readonly indentationRules: IndentationRule | undefined;
	public readonly foldingRules: FoldingRules;
	public readonly bracketsNew: LanguageBracketsConfiguration;

	constructor(
		public readonly languageId: string,
		public readonly underlyingConfig: LanguageConfiguration
	) {
		this._brackets = null;
		this._electricCharacter = null;
		this._onEnterSupport =
			this.underlyingConfig.brackets ||
				this.underlyingConfig.indentationRules ||
				this.underlyingConfig.onEnterRules
				? new OnEnterSupport(this.underlyingConfig)
				: null;
		this.comments = ResolvedLanguageConfiguration._handleComments(this.underlyingConfig);
		this.characterPair = new CharacterPairSupport(this.underlyingConfig);

		this.wordDefinition = this.underlyingConfig.wordPattern || DEFAULT_WORD_REGEXP;
		this.indentationRules = this.underlyingConfig.indentationRules;
		if (this.underlyingConfig.indentationRules) {
			this.indentRulesSupport = new IndentRulesSupport(
				this.underlyingConfig.indentationRules
			);
		} else {
			this.indentRulesSupport = null;
		}
		this.foldingRules = this.underlyingConfig.folding || {};

		this.bracketsNew = new LanguageBracketsConfiguration(
			languageId,
			this.underlyingConfig
		);
	}

	public getWordDefinition(): RegExp {
		return ensureValidWordDefinition(this.wordDefinition);
	}

	public get brackets(): RichEditBrackets | null {
		if (!this._brackets && this.underlyingConfig.brackets) {
			this._brackets = new RichEditBrackets(
				this.languageId,
				this.underlyingConfig.brackets
			);
		}
		return this._brackets;
	}

	public get electricCharacter(): BracketElectricCharacterSupport | null {
		if (!this._electricCharacter) {
			this._electricCharacter = new BracketElectricCharacterSupport(
				this.brackets
			);
		}
		return this._electricCharacter;
	}

	public onEnter(
		autoIndent: EditorAutoIndentStrategy,
		previousLineText: string,
		beforeEnterText: string,
		afterEnterText: string
	): EnterAction | null {
		if (!this._onEnterSupport) {
			return null;
		}
		return this._onEnterSupport.onEnter(
			autoIndent,
			previousLineText,
			beforeEnterText,
			afterEnterText
		);
	}

	public getAutoClosingPairs(): AutoClosingPairs {
		return new AutoClosingPairs(this.characterPair.getAutoClosingPairs());
	}

	public getAutoCloseBeforeSet(forQuotes: boolean): string {
		return this.characterPair.getAutoCloseBeforeSet(forQuotes);
	}

	public getSurroundingPairs(): IAutoClosingPair[] {
		return this.characterPair.getSurroundingPairs();
	}

	private static _handleComments(
		conf: LanguageConfiguration
	): ICommentsConfiguration | null {
		const commentRule = conf.comments;
		if (!commentRule) {
			return null;
		}

		// comment configuration
		const comments: ICommentsConfiguration = {};

		if (commentRule.lineComment) {
			if (typeof commentRule.lineComment === 'string') {
				comments.lineCommentToken = commentRule.lineComment;
			} else {
				comments.lineCommentToken = commentRule.lineComment.comment;
				comments.lineCommentNoIndent = commentRule.lineComment.noIndent;
			}
		}
		if (commentRule.blockComment) {
			const [blockStart, blockEnd] = commentRule.blockComment;
			comments.blockCommentStartToken = blockStart;
			comments.blockCommentEndToken = blockEnd;
		}

		return comments;
	}
}

registerSingleton(ILanguageConfigurationService, LanguageConfigurationService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/linkComputer.ts]---
Location: vscode-main/src/vs/editor/common/languages/linkComputer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';
import { CharacterClassifier } from '../core/characterClassifier.js';
import { ILink } from '../languages.js';

export interface ILinkComputerTarget {
	getLineCount(): number;
	getLineContent(lineNumber: number): string;
}

export const enum State {
	Invalid = 0,
	Start = 1,
	H = 2,
	HT = 3,
	HTT = 4,
	HTTP = 5,
	F = 6,
	FI = 7,
	FIL = 8,
	BeforeColon = 9,
	AfterColon = 10,
	AlmostThere = 11,
	End = 12,
	Accept = 13,
	LastKnownState = 14 // marker, custom states may follow
}

export type Edge = [State, number, State];

class Uint8Matrix {

	private readonly _data: Uint8Array;
	public readonly rows: number;
	public readonly cols: number;

	constructor(rows: number, cols: number, defaultValue: number) {
		const data = new Uint8Array(rows * cols);
		for (let i = 0, len = rows * cols; i < len; i++) {
			data[i] = defaultValue;
		}

		this._data = data;
		this.rows = rows;
		this.cols = cols;
	}

	public get(row: number, col: number): number {
		return this._data[row * this.cols + col];
	}

	public set(row: number, col: number, value: number): void {
		this._data[row * this.cols + col] = value;
	}
}

export class StateMachine {

	private readonly _states: Uint8Matrix;
	private readonly _maxCharCode: number;

	constructor(edges: Edge[]) {
		let maxCharCode = 0;
		let maxState = State.Invalid;
		for (let i = 0, len = edges.length; i < len; i++) {
			const [from, chCode, to] = edges[i];
			if (chCode > maxCharCode) {
				maxCharCode = chCode;
			}
			if (from > maxState) {
				maxState = from;
			}
			if (to > maxState) {
				maxState = to;
			}
		}

		maxCharCode++;
		maxState++;

		const states = new Uint8Matrix(maxState, maxCharCode, State.Invalid);
		for (let i = 0, len = edges.length; i < len; i++) {
			const [from, chCode, to] = edges[i];
			states.set(from, chCode, to);
		}

		this._states = states;
		this._maxCharCode = maxCharCode;
	}

	public nextState(currentState: State, chCode: number): State {
		if (chCode < 0 || chCode >= this._maxCharCode) {
			return State.Invalid;
		}
		return this._states.get(currentState, chCode);
	}
}

// State machine for http:// or https:// or file://
let _stateMachine: StateMachine | null = null;
function getStateMachine(): StateMachine {
	if (_stateMachine === null) {
		_stateMachine = new StateMachine([
			[State.Start, CharCode.h, State.H],
			[State.Start, CharCode.H, State.H],
			[State.Start, CharCode.f, State.F],
			[State.Start, CharCode.F, State.F],

			[State.H, CharCode.t, State.HT],
			[State.H, CharCode.T, State.HT],

			[State.HT, CharCode.t, State.HTT],
			[State.HT, CharCode.T, State.HTT],

			[State.HTT, CharCode.p, State.HTTP],
			[State.HTT, CharCode.P, State.HTTP],

			[State.HTTP, CharCode.s, State.BeforeColon],
			[State.HTTP, CharCode.S, State.BeforeColon],
			[State.HTTP, CharCode.Colon, State.AfterColon],

			[State.F, CharCode.i, State.FI],
			[State.F, CharCode.I, State.FI],

			[State.FI, CharCode.l, State.FIL],
			[State.FI, CharCode.L, State.FIL],

			[State.FIL, CharCode.e, State.BeforeColon],
			[State.FIL, CharCode.E, State.BeforeColon],

			[State.BeforeColon, CharCode.Colon, State.AfterColon],

			[State.AfterColon, CharCode.Slash, State.AlmostThere],

			[State.AlmostThere, CharCode.Slash, State.End],
		]);
	}
	return _stateMachine;
}


const enum CharacterClass {
	None = 0,
	ForceTermination = 1,
	CannotEndIn = 2
}

let _classifier: CharacterClassifier<CharacterClass> | null = null;
function getClassifier(): CharacterClassifier<CharacterClass> {
	if (_classifier === null) {
		_classifier = new CharacterClassifier<CharacterClass>(CharacterClass.None);

		// allow-any-unicode-next-line
		const FORCE_TERMINATION_CHARACTERS = ' \t<>\'\"、。｡､，．：；‘〈「『〔（［｛｢｣｝］）〕』」〉’｀～…|';
		for (let i = 0; i < FORCE_TERMINATION_CHARACTERS.length; i++) {
			_classifier.set(FORCE_TERMINATION_CHARACTERS.charCodeAt(i), CharacterClass.ForceTermination);
		}

		const CANNOT_END_WITH_CHARACTERS = '.,;:';
		for (let i = 0; i < CANNOT_END_WITH_CHARACTERS.length; i++) {
			_classifier.set(CANNOT_END_WITH_CHARACTERS.charCodeAt(i), CharacterClass.CannotEndIn);
		}
	}
	return _classifier;
}

export class LinkComputer {

	private static _createLink(classifier: CharacterClassifier<CharacterClass>, line: string, lineNumber: number, linkBeginIndex: number, linkEndIndex: number): ILink {
		// Do not allow to end link in certain characters...
		let lastIncludedCharIndex = linkEndIndex - 1;
		do {
			const chCode = line.charCodeAt(lastIncludedCharIndex);
			const chClass = classifier.get(chCode);
			if (chClass !== CharacterClass.CannotEndIn) {
				break;
			}
			lastIncludedCharIndex--;
		} while (lastIncludedCharIndex > linkBeginIndex);

		// Handle links enclosed in parens, square brackets and curlys.
		if (linkBeginIndex > 0) {
			const charCodeBeforeLink = line.charCodeAt(linkBeginIndex - 1);
			const lastCharCodeInLink = line.charCodeAt(lastIncludedCharIndex);

			if (
				(charCodeBeforeLink === CharCode.OpenParen && lastCharCodeInLink === CharCode.CloseParen)
				|| (charCodeBeforeLink === CharCode.OpenSquareBracket && lastCharCodeInLink === CharCode.CloseSquareBracket)
				|| (charCodeBeforeLink === CharCode.OpenCurlyBrace && lastCharCodeInLink === CharCode.CloseCurlyBrace)
			) {
				// Do not end in ) if ( is before the link start
				// Do not end in ] if [ is before the link start
				// Do not end in } if { is before the link start
				lastIncludedCharIndex--;
			}
		}

		return {
			range: {
				startLineNumber: lineNumber,
				startColumn: linkBeginIndex + 1,
				endLineNumber: lineNumber,
				endColumn: lastIncludedCharIndex + 2
			},
			url: line.substring(linkBeginIndex, lastIncludedCharIndex + 1)
		};
	}

	public static computeLinks(model: ILinkComputerTarget, stateMachine: StateMachine = getStateMachine()): ILink[] {
		const classifier = getClassifier();

		const result: ILink[] = [];
		for (let i = 1, lineCount = model.getLineCount(); i <= lineCount; i++) {
			const line = model.getLineContent(i);
			const len = line.length;

			let j = 0;
			let linkBeginIndex = 0;
			let linkBeginChCode = 0;
			let state = State.Start;
			let hasOpenParens = false;
			let hasOpenSquareBracket = false;
			let inSquareBrackets = false;
			let hasOpenCurlyBracket = false;

			while (j < len) {

				let resetStateMachine = false;
				const chCode = line.charCodeAt(j);

				if (state === State.Accept) {
					let chClass: CharacterClass;
					switch (chCode) {
						case CharCode.OpenParen:
							hasOpenParens = true;
							chClass = CharacterClass.None;
							break;
						case CharCode.CloseParen:
							chClass = (hasOpenParens ? CharacterClass.None : CharacterClass.ForceTermination);
							break;
						case CharCode.OpenSquareBracket:
							inSquareBrackets = true;
							hasOpenSquareBracket = true;
							chClass = CharacterClass.None;
							break;
						case CharCode.CloseSquareBracket:
							inSquareBrackets = false;
							chClass = (hasOpenSquareBracket ? CharacterClass.None : CharacterClass.ForceTermination);
							break;
						case CharCode.OpenCurlyBrace:
							hasOpenCurlyBracket = true;
							chClass = CharacterClass.None;
							break;
						case CharCode.CloseCurlyBrace:
							chClass = (hasOpenCurlyBracket ? CharacterClass.None : CharacterClass.ForceTermination);
							break;

						// The following three rules make it that ' or " or ` are allowed inside links
						// only if the link is wrapped by some other quote character
						case CharCode.SingleQuote:
						case CharCode.DoubleQuote:
						case CharCode.BackTick:
							if (linkBeginChCode === chCode) {
								chClass = CharacterClass.ForceTermination;
							} else if (linkBeginChCode === CharCode.SingleQuote || linkBeginChCode === CharCode.DoubleQuote || linkBeginChCode === CharCode.BackTick) {
								chClass = CharacterClass.None;
							} else {
								chClass = CharacterClass.ForceTermination;
							}
							break;
						case CharCode.Asterisk:
							// `*` terminates a link if the link began with `*`
							chClass = (linkBeginChCode === CharCode.Asterisk) ? CharacterClass.ForceTermination : CharacterClass.None;
							break;
						case CharCode.Space:
							// ` ` allow space in between [ and ]
							chClass = (inSquareBrackets ? CharacterClass.None : CharacterClass.ForceTermination);
							break;
						default:
							chClass = classifier.get(chCode);
					}

					// Check if character terminates link
					if (chClass === CharacterClass.ForceTermination) {
						result.push(LinkComputer._createLink(classifier, line, i, linkBeginIndex, j));
						resetStateMachine = true;
					}
				} else if (state === State.End) {

					let chClass: CharacterClass;
					if (chCode === CharCode.OpenSquareBracket) {
						// Allow for the authority part to contain ipv6 addresses which contain [ and ]
						hasOpenSquareBracket = true;
						chClass = CharacterClass.None;
					} else {
						chClass = classifier.get(chCode);
					}

					// Check if character terminates link
					if (chClass === CharacterClass.ForceTermination) {
						resetStateMachine = true;
					} else {
						state = State.Accept;
					}
				} else {
					state = stateMachine.nextState(state, chCode);
					if (state === State.Invalid) {
						resetStateMachine = true;
					}
				}

				if (resetStateMachine) {
					state = State.Start;
					hasOpenParens = false;
					hasOpenSquareBracket = false;
					hasOpenCurlyBracket = false;

					// Record where the link started
					linkBeginIndex = j + 1;
					linkBeginChCode = chCode;
				}

				j++;
			}

			if (state === State.Accept) {
				result.push(LinkComputer._createLink(classifier, line, i, linkBeginIndex, len));
			}

		}

		return result;
	}
}

/**
 * Returns an array of all links contains in the provided
 * document. *Note* that this operation is computational
 * expensive and should not run in the UI thread.
 */
export function computeLinks(model: ILinkComputerTarget | null): ILink[] {
	if (!model || typeof model.getLineCount !== 'function' || typeof model.getLineContent !== 'function') {
		// Unknown caller!
		return [];
	}
	return LinkComputer.computeLinks(model);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/modesRegistry.ts]---
Location: vscode-main/src/vs/editor/common/languages/modesRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../nls.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { ILanguageExtensionPoint } from './language.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { Mimes } from '../../../base/common/mime.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../../platform/configuration/common/configurationRegistry.js';

// Define extension point ids
export const Extensions = {
	ModesRegistry: 'editor.modesRegistry'
};

export class EditorModesRegistry extends Disposable {

	private readonly _languages: ILanguageExtensionPoint[];

	private readonly _onDidChangeLanguages = this._register(new Emitter<void>());
	public readonly onDidChangeLanguages: Event<void> = this._onDidChangeLanguages.event;

	constructor() {
		super();
		this._languages = [];
	}

	public registerLanguage(def: ILanguageExtensionPoint): IDisposable {
		this._languages.push(def);
		this._onDidChangeLanguages.fire(undefined);
		return {
			dispose: () => {
				for (let i = 0, len = this._languages.length; i < len; i++) {
					if (this._languages[i] === def) {
						this._languages.splice(i, 1);
						return;
					}
				}
			}
		};
	}

	public getLanguages(): ReadonlyArray<ILanguageExtensionPoint> {
		return this._languages;
	}
}

export const ModesRegistry = new EditorModesRegistry();
Registry.add(Extensions.ModesRegistry, ModesRegistry);

export const PLAINTEXT_LANGUAGE_ID = 'plaintext';
export const PLAINTEXT_EXTENSION = '.txt';

ModesRegistry.registerLanguage({
	id: PLAINTEXT_LANGUAGE_ID,
	extensions: [PLAINTEXT_EXTENSION],
	aliases: [nls.localize('plainText.alias', "Plain Text"), 'text'],
	mimetypes: [Mimes.text]
});

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration)
	.registerDefaultConfigurations([{
		overrides: {
			'[plaintext]': {
				'editor.unicodeHighlight.ambiguousCharacters': false,
				'editor.unicodeHighlight.invisibleCharacters': false
			},
			// TODO: Below is a workaround for: https://github.com/microsoft/vscode/issues/240567
			'[go]': {
				'editor.insertSpaces': false
			},
			'[makefile]': {
				'editor.insertSpaces': false,
			},
			'[shellscript]': {
				'files.eol': '\n'
			},
			'[yaml]': {
				'editor.insertSpaces': true,
				'editor.tabSize': 2
			}
		}
	}]);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/nullTokenize.ts]---
Location: vscode-main/src/vs/editor/common/languages/nullTokenize.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Token, TokenizationResult, EncodedTokenizationResult, IState } from '../languages.js';
import { LanguageId, FontStyle, ColorId, StandardTokenType, MetadataConsts } from '../encodedTokenAttributes.js';

export const NullState: IState = new class implements IState {
	public clone(): IState {
		return this;
	}
	public equals(other: IState): boolean {
		return (this === other);
	}
};

export function nullTokenize(languageId: string, state: IState): TokenizationResult {
	return new TokenizationResult([new Token(0, '', languageId)], state);
}

export function nullTokenizeEncoded(languageId: LanguageId, state: IState | null): EncodedTokenizationResult {
	const tokens = new Uint32Array(2);
	tokens[0] = 0;
	tokens[1] = (
		(languageId << MetadataConsts.LANGUAGEID_OFFSET)
		| (StandardTokenType.Other << MetadataConsts.TOKEN_TYPE_OFFSET)
		| (FontStyle.None << MetadataConsts.FONT_STYLE_OFFSET)
		| (ColorId.DefaultForeground << MetadataConsts.FOREGROUND_OFFSET)
		| (ColorId.DefaultBackground << MetadataConsts.BACKGROUND_OFFSET)
	) >>> 0;

	return new EncodedTokenizationResult(tokens, [], state === null ? NullState : state);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/supports.ts]---
Location: vscode-main/src/vs/editor/common/languages/supports.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IViewLineTokens, LineTokens } from '../tokens/lineTokens.js';
import { StandardTokenType } from '../encodedTokenAttributes.js';
import { ILanguageIdCodec } from '../languages.js';

export function createScopedLineTokens(context: LineTokens, offset: number): ScopedLineTokens {
	const tokenCount = context.getCount();
	const tokenIndex = context.findTokenIndexAtOffset(offset);
	const desiredLanguageId = context.getLanguageId(tokenIndex);

	let lastTokenIndex = tokenIndex;
	while (lastTokenIndex + 1 < tokenCount && context.getLanguageId(lastTokenIndex + 1) === desiredLanguageId) {
		lastTokenIndex++;
	}

	let firstTokenIndex = tokenIndex;
	while (firstTokenIndex > 0 && context.getLanguageId(firstTokenIndex - 1) === desiredLanguageId) {
		firstTokenIndex--;
	}

	return new ScopedLineTokens(
		context,
		desiredLanguageId,
		firstTokenIndex,
		lastTokenIndex + 1,
		context.getStartOffset(firstTokenIndex),
		context.getEndOffset(lastTokenIndex)
	);
}

export class ScopedLineTokens {
	_scopedLineTokensBrand: void = undefined;

	public readonly languageIdCodec: ILanguageIdCodec;
	public readonly languageId: string;
	private readonly _actual: LineTokens;
	private readonly _firstTokenIndex: number;
	private readonly _lastTokenIndex: number;
	public readonly firstCharOffset: number;
	private readonly _lastCharOffset: number;

	constructor(
		actual: LineTokens,
		languageId: string,
		firstTokenIndex: number,
		lastTokenIndex: number,
		firstCharOffset: number,
		lastCharOffset: number
	) {
		this._actual = actual;
		this.languageId = languageId;
		this._firstTokenIndex = firstTokenIndex;
		this._lastTokenIndex = lastTokenIndex;
		this.firstCharOffset = firstCharOffset;
		this._lastCharOffset = lastCharOffset;
		this.languageIdCodec = actual.languageIdCodec;
	}

	public getLineContent(): string {
		const actualLineContent = this._actual.getLineContent();
		return actualLineContent.substring(this.firstCharOffset, this._lastCharOffset);
	}

	public getLineLength(): number {
		return this._lastCharOffset - this.firstCharOffset;
	}

	public getActualLineContentBefore(offset: number): string {
		const actualLineContent = this._actual.getLineContent();
		return actualLineContent.substring(0, this.firstCharOffset + offset);
	}

	public getTokenCount(): number {
		return this._lastTokenIndex - this._firstTokenIndex;
	}

	public findTokenIndexAtOffset(offset: number): number {
		return this._actual.findTokenIndexAtOffset(offset + this.firstCharOffset) - this._firstTokenIndex;
	}

	public getStandardTokenType(tokenIndex: number): StandardTokenType {
		return this._actual.getStandardTokenType(tokenIndex + this._firstTokenIndex);
	}

	public toIViewLineTokens(): IViewLineTokens {
		return this._actual.sliceAndInflate(this.firstCharOffset, this._lastCharOffset, 0);
	}
}

const enum IgnoreBracketsInTokens {
	value = StandardTokenType.Comment | StandardTokenType.String | StandardTokenType.RegEx
}

export function ignoreBracketsInToken(standardTokenType: StandardTokenType): boolean {
	return (standardTokenType & IgnoreBracketsInTokens.value) !== 0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/textToHtmlTokenizer.ts]---
Location: vscode-main/src/vs/editor/common/languages/textToHtmlTokenizer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';
import * as strings from '../../../base/common/strings.js';
import { IViewLineTokens, LineTokens } from '../tokens/lineTokens.js';
import { ILanguageIdCodec, IState, ITokenizationSupport, TokenizationRegistry } from '../languages.js';
import { LanguageId } from '../encodedTokenAttributes.js';
import { NullState, nullTokenizeEncoded } from './nullTokenize.js';
import { ILanguageService } from './language.js';

export type IReducedTokenizationSupport = Omit<ITokenizationSupport, 'tokenize'>;

const fallback: IReducedTokenizationSupport = {
	getInitialState: () => NullState,
	tokenizeEncoded: (buffer: string, hasEOL: boolean, state: IState) => nullTokenizeEncoded(LanguageId.Null, state)
};

export function tokenizeToStringSync(languageService: ILanguageService, text: string, languageId: string): string {
	return _tokenizeToString(text, languageService.languageIdCodec, TokenizationRegistry.get(languageId) || fallback);
}

export async function tokenizeToString(languageService: ILanguageService, text: string, languageId: string | null): Promise<string> {
	if (!languageId) {
		return _tokenizeToString(text, languageService.languageIdCodec, fallback);
	}
	const tokenizationSupport = await TokenizationRegistry.getOrCreate(languageId);
	return _tokenizeToString(text, languageService.languageIdCodec, tokenizationSupport || fallback);
}

export function tokenizeLineToHTML(text: string, viewLineTokens: IViewLineTokens, colorMap: string[], startOffset: number, endOffset: number, tabSize: number, useNbsp: boolean): string {
	let result = `<div>`;
	let charIndex = 0;
	let width = 0;

	let prevIsSpace = true;

	for (let tokenIndex = 0, tokenCount = viewLineTokens.getCount(); tokenIndex < tokenCount; tokenIndex++) {
		const tokenEndIndex = viewLineTokens.getEndOffset(tokenIndex);
		let partContent = '';

		for (; charIndex < tokenEndIndex && charIndex < endOffset; charIndex++) {
			const charCode = text.charCodeAt(charIndex);
			const isTab = charCode === CharCode.Tab;

			width += strings.isFullWidthCharacter(charCode) ? 2 : (isTab ? 0 : 1);

			if (charIndex < startOffset) {
				if (isTab) {
					const remainder = width % tabSize;
					width += remainder === 0 ? tabSize : tabSize - remainder;
				}
				continue;
			}

			switch (charCode) {
				case CharCode.Tab: {
					const remainder = width % tabSize;
					const insertSpacesCount = remainder === 0 ? tabSize : tabSize - remainder;
					width += insertSpacesCount;
					let spacesRemaining = insertSpacesCount;
					while (spacesRemaining > 0) {
						if (useNbsp && prevIsSpace) {
							partContent += '&#160;';
							prevIsSpace = false;
						} else {
							partContent += ' ';
							prevIsSpace = true;
						}
						spacesRemaining--;
					}
					break;
				}
				case CharCode.LessThan:
					partContent += '&lt;';
					prevIsSpace = false;
					break;

				case CharCode.GreaterThan:
					partContent += '&gt;';
					prevIsSpace = false;
					break;

				case CharCode.Ampersand:
					partContent += '&amp;';
					prevIsSpace = false;
					break;

				case CharCode.Null:
					partContent += '&#00;';
					prevIsSpace = false;
					break;

				case CharCode.UTF8_BOM:
				case CharCode.LINE_SEPARATOR:
				case CharCode.PARAGRAPH_SEPARATOR:
				case CharCode.NEXT_LINE:
					partContent += '\ufffd';
					prevIsSpace = false;
					break;

				case CharCode.CarriageReturn:
					// zero width space, because carriage return would introduce a line break
					partContent += '&#8203';
					prevIsSpace = false;
					break;

				case CharCode.Space:
					if (useNbsp && prevIsSpace) {
						partContent += '&#160;';
						prevIsSpace = false;
					} else {
						partContent += ' ';
						prevIsSpace = true;
					}
					break;

				default:
					partContent += String.fromCharCode(charCode);
					prevIsSpace = false;
			}
		}

		if (tokenEndIndex <= startOffset) {
			continue;
		}

		result += `<span style="${viewLineTokens.getInlineStyle(tokenIndex, colorMap)}">${partContent}</span>`;

		if (tokenEndIndex > endOffset || charIndex >= endOffset || startOffset >= endOffset) {
			break;
		}
	}

	result += `</div>`;
	return result;
}

export function _tokenizeToString(text: string, languageIdCodec: ILanguageIdCodec, tokenizationSupport: IReducedTokenizationSupport): string {
	let result = `<div class="monaco-tokenized-source">`;
	const lines = strings.splitLines(text);
	let currentState = tokenizationSupport.getInitialState();
	for (let i = 0, len = lines.length; i < len; i++) {
		const line = lines[i];

		if (i > 0) {
			result += `<br/>`;
		}

		const tokenizationResult = tokenizationSupport.tokenizeEncoded(line, true, currentState);
		LineTokens.convertToEndOffset(tokenizationResult.tokens, line.length);
		const lineTokens = new LineTokens(tokenizationResult.tokens, line, languageIdCodec);
		const viewLineTokens = lineTokens.inflate();

		let startOffset = 0;
		for (let j = 0, lenJ = viewLineTokens.getCount(); j < lenJ; j++) {
			const type = viewLineTokens.getClassName(j);
			const endIndex = viewLineTokens.getEndOffset(j);
			result += `<span class="${type}">${strings.escape(line.substring(startOffset, endIndex))}</span>`;
			startOffset = endIndex;
		}

		currentState = tokenizationResult.endState;
	}

	result += `</div>`;
	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/highlights/css.scm]---
Location: vscode-main/src/vs/editor/common/languages/highlights/css.scm

```text
; Order matters! Place lower precedence first.

[
  "{"
  "}"
  "("
  ")"
  "["
  "]"
] @punctuation.css

[
  "*="
] @keyword.operator.css

[
  "+"
  ">"
] @keyword.operator.combinator.css

(comment) @comment.block.css

; Selectors

(selectors) @meta.selector.css

(class_selector) @entity.other.attribute-name.class.css

(id_selector) @entity.other.attribute-name.id.css

(tag_name) @entity.name.tag.css

(universal_selector) @entity.name.tag.wildcard.css

(pseudo_class_selector) @entity.other.attribute-name.pseudo-class.css

(pseudo_element_selector
  "::" @entity.other.attribute-name.pseudo-element.css
  .
  (tag_name) @entity.other.attribute-name.pseudo-element.css)

(attribute_name) @entity.other.attribute-name.css

; @ Rules

[
  ("@import")
  ("@charset")
  ("@namespace")
  ("@media")
  ("@supports")
  ("@keyframes")
  (at_keyword)
] @keyword.control.at-rule.css

(keyword_query) @support.constant.media.css

(keyframes_name) @variable.parameter.keyframe-list.css

; Functions

(function_name) @support.function.css

; Properties

(property_name) @support.type.property-name.css

; Other values

(plain_value) @support.constant.property-value.css

; Strings

((string_value) @string.quoted.single.css
  (#match? @string.quoted.single.css "^'.*'$"))

((string_value) @string.quoted.double.css
  (#match? @string.quoted.double.css "^\".*\"$"))

; Numbers

([
  (integer_value)
  (float_value)
]) @constant.numeric.css

(unit) @keyword.other.unit.css

; Special values

(declaration
  ((property_name) @support.type.property-name.css
    (#eq? @support.type.property-name.css "font"))
  (plain_value) @support.constant.font-name.css)

((color_value) @constant.other.color.rgb-value.hex.css
  (#match? @constant.other.color.rgb-value.hex.css "^#.*"))

(call_expression
  (function_name) @meta.function.variable.css (#eq? @meta.function.variable.css "var")
  (arguments
    (plain_value) @variable.argument.css))

; Special Functions

(call_expression
  ((function_name) @support.function.url.css
    (#eq? @support.function.url.css "url"))
  (arguments
    (plain_value) @variable.parameter.url.css))

; Keywords

(important) @keyword.other.important.css
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/highlights/ini.scm]---
Location: vscode-main/src/vs/editor/common/languages/highlights/ini.scm

```text
; Order matters! Place lower precedence first.

(section_name (text) @entity.name.section.group-title)

(setting_name) @keyword.other.definition

(setting ("=") @punctuation.separator.key-value)

(comment) @comment.line.semicolon

((setting_value) @string.quoted.double
  (#match? @string.quoted.double "^\".*\""))
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/highlights/regex.scm]---
Location: vscode-main/src/vs/editor/common/languages/highlights/regex.scm

```text
; Order matters! Place lower precedence first.
[
  "?"
  "="
  "!"
] @keyword.operator.regexp

[
  "("
  ")"
] @punctuation.definition.group.regexp

[
  ">"
  "{"
  "}"
] @punctuation.regexp

[
  "["
  "]"
] @punctuation.definition.character-class.regexp

(
  ([
    "(?<"
  ] @punctuation.definition.group.assertion.regexp)
  .
  [
    "="
    "!"
  ] @punctuation.definition.group.assertion.regexp
) @meta.assertion.look-behind.regexp

(
  ([
    "(?"
  ] @punctuation.definition.group.assertion.regexp)
  .
  [
    "="
    "!"
  ] @punctuation.definition.group.assertion.regexp
) @meta.assertion.look-ahead.regexp

"(?:" @punctuation.definition.group.regexp @punctuation.definition.group.no-capture.regexp

(lookaround_assertion ("!") @punctuation.definition.group.assertion.regexp)

(named_capturing_group) @punctuation.definition.group.regexp

(group_name) @variable.other.regexp

[
  (control_letter_escape)
  (non_boundary_assertion)
] @string.escape.regexp

[
  (start_assertion)
  (end_assertion)
  (boundary_assertion)
] @keyword.control.anchor.regexp

(class_character) @constant.character-class.regexp

(identity_escape) @constant.character.escape.regexp

[
  ((identity_escape) @internal.regexp (#match? @internal.regexp "\\[^ux]"))
] @constant.character.escape.regexp

(
  ((identity_escape) @internal.regexp (#eq? @internal.regexp "\\u"))
  .
  (pattern_character) @constant.character.numeric.regexp
  .
  (pattern_character) @constant.character.numeric.regexp
  .
  (pattern_character) @constant.character.numeric.regexp
  .
  (pattern_character) @constant.character.numeric.regexp
) @constant.character.numeric.regexp

(
  ((identity_escape) @internal.regexp (#eq? @internal.regexp "\\x"))
  .
  (pattern_character) @constant.character.numeric.regexp
  .
  (pattern_character) @constant.character.numeric.regexp
) @constant.character.numeric.regexp

(
  ((identity_escape) @internal.regexp (#eq? @internal.regexp "\\x"))
  .
  (class_character) @constant.character.numeric.regexp
  .
  (class_character) @constant.character.numeric.regexp
) @constant.character.numeric.regexp

(control_escape) @constant.other.character-class.regexp

(character_class_escape) @constant.character.escape.regexp

(decimal_escape) @keyword.other.back-reference.regexp

("|") @keyword.operator.or.regexp

[
  "*"
  "+"
] @keyword.operator.quantifier.regexp

(count_quantifier) @keyword.operator.quantifier.regexp

[
  (lazy)
] @keyword.operator.quantifier.regexp

(optional ("?") @keyword.operator.quantifier.regexp)

(character_class
  [
    "^" @keyword.operator.negation.regexp
    (class_range "-" @constant.other.character-class.range.regexp)
  ])
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/highlights/typescript.scm]---
Location: vscode-main/src/vs/editor/common/languages/highlights/typescript.scm

```text
; Order matters! Place lower precedence first.

; Variables

(identifier) @variable.ts

(_
  object: (identifier) @variable.other.object.ts)

; Literals

(this) @variable.language.this.ts
(super) @variable.language.super.ts

(comment) @comment.ts

; TODO: This doesn't seem to be working
(escape_sequence) @constant.character.escape.ts

((string) @string.quoted.single.ts
  (#match? @string.quoted.single.ts "^'.*'$"))

((string) @string.quoted.double.ts
  (#match? @string.quoted.double.ts "^\".*\"$"))

([
  (template_string)
  (template_literal_type)
] @string.template.ts)

(template_substitution) @meta.template.expression.ts

(string .
  ([
    "\""
    "'"
  ]) @punctuation.definition.string.begin.ts)

(string
  ([
    "\""
    "'"
  ]) @punctuation.definition.string.end.ts .)

(template_string . ("`") @punctuation.definition.string.template.begin.ts)

(template_string ("`") @punctuation.definition.string.template.end.ts .)

; NOTE: the typescript grammar doesn't break regex into nice parts so as to capture parts of it separately
(regex) @string.regexp.ts
(number) @constant.numeric.ts

; Properties

(member_expression
  object: (this)
  property: (property_identifier) @variable.ts)

(member_expression
  property: (property_identifier) @variable.other.constant.ts
  (#match? @variable.other.constant.ts "^[A-Z][A-Z_]+$"))

[
  (property_identifier)
  (shorthand_property_identifier)
  (shorthand_property_identifier_pattern)] @variable.ts

; Function and method definitions

(function_expression
  name: (identifier) @entity.name.function.ts)
(function_signature
  name: (identifier) @entity.name.function.ts)
(function_declaration
  name: (identifier) @entity.name.function.ts)
(method_definition
  name: (property_identifier) @meta.definition.method.ts @entity.name.function.ts
  (#not-eq? @entity.name.function.ts "constructor"))
(method_definition
  name: (property_identifier) @meta.definition.method.ts @storage.type.ts
  (#eq? @storage.type.ts "constructor"))
(method_signature
  name: (property_identifier) @meta.definition.method.ts @entity.name.function.ts)
(generator_function_declaration
  "*" @keyword.generator.asterisk.ts)
(generator_function_declaration
  name: (identifier) @meta.definition.function.ts @entity.name.function.ts)

(pair
  key: (property_identifier) @entity.name.function.ts
  value: [(function_expression) (arrow_function)])

(assignment_expression
  left: (member_expression
    property: (property_identifier) @entity.name.function.ts)
  right: [(function_expression) (arrow_function)])

(variable_declarator
  name: (identifier) @entity.name.function.ts
  value: [(function_expression) (arrow_function)])

(assignment_expression
  left: (identifier) @entity.name.function.ts
  right: [(function_expression) (arrow_function)])

(required_parameter
  (identifier) @variable.parameter.ts)

(required_parameter
  (_
    ([
      (identifier)
      (shorthand_property_identifier_pattern)
    ]) @variable.parameter.ts))

(optional_parameter
  (identifier) @variable.parameter.ts)

(optional_parameter
  (_
    ([
      (identifier)
      (shorthand_property_identifier_pattern)
    ]) @variable.parameter.ts))

(catch_clause
  parameter: (identifier) @variable.parameter.ts)

(index_signature
  name: (identifier) @variable.parameter.ts)

(arrow_function
  parameter: (identifier) @variable.parameter.ts)

(type_predicate
  name: (identifier) @variable.parameter.ts)

; Function and method calls

(call_expression
  function: (identifier) @entity.name.function.ts)

(call_expression
  function: (member_expression
  	object: (identifier) @support.class.promise.ts)
    (#eq? @support.class.promise.ts "Promise"))

(call_expression
  function: (member_expression
    property: (property_identifier) @entity.name.function.ts))

(new_expression) @new.expr.ts

(new_expression
  constructor: (identifier) @entity.name.function.ts)


; Special identifiers

(predefined_type) @support.type.ts
(predefined_type (["string" "boolean" "number" "any" "unknown" "never" "void"])) @support.type.primitive.ts

(_
  (type_identifier) @entity.name.type.ts)

(type_annotation
  ([
    (type_identifier)
    (nested_type_identifier)
   ]) @meta.type.annotation.ts @entity.name.type.ts)

(class_declaration
  (type_identifier) @entity.name.type.class.ts)

(type_alias_declaration
  (type_identifier) @entity.name.type.alias.ts)
(type_alias_declaration
  value: (_
    (type_identifier) @entity.name.type.ts))

(interface_declaration
  (type_identifier) @entity.name.type.interface.ts)

(internal_module
  name: (identifier) @entity.name.type.ts)

(enum_declaration
  name: (identifier) @entity.name.type.enum.ts)

(
  [
    (_ name: (identifier))
    (shorthand_property_identifier)
    (shorthand_property_identifier_pattern)
  ] @variable.other.constant.ts
  (#match? @variable.other.constant.ts "^[A-Z][A-Z_]+$"))

(extends_clause
  value: (identifier) @entity.other.inherited-class.ts)

(extends_type_clause
  type: (type_identifier) @entity.other.inherited-class.ts)

(implements_clause
  (type_identifier) @entity.other.inherited-class.ts)

; Tokens

[
  ";"
  "?."
  "."
  ","
  ":"
  "?"
] @punctuation.delimiter.ts

[
  "!"
  "~"
  "==="
  "!=="
  "&&"
  "||"
  "??"
] @keyword.operator.logical.ts

(binary_expression ([
  "-"
  "+"
  "*"
  "/"
  "%"
  "^"
]) @keyword.operator.arithmetic.ts)

(binary_expression ([
  "<"
  "<="
  ">"
  ">="
]) @keyword.operator.relational.ts)

(unary_expression ([
  "-"
  "+"
]) @keyword.operator.arithmetic.ts)

[
  "="
] @keyword.operator.assignment.ts

(augmented_assignment_expression ([
  "-="
  "+="
  "*="
  "/="
  "%="
  "^="
  "&="
  "|="
  "&&="
  "||="
  "??="
]) @keyword.operator.assignment.compound.ts)

[
  "++"
] @keyword.operator.increment.ts

[
  "--"
] @keyword.operator.decrement.ts

[
  "**"
  "**="
  "<<"
  "<<="
  "=="
  "!="
  ">>"
  ">>="
  ">>>"
  ">>>="
  "~"
  "&"
  "|"
] @keyword.operator.ts

(union_type
  ("|") @keyword.operator.type.ts)

(intersection_type
  ("&") @keyword.operator.type.ts)

(type_annotation
  (":") @keyword.operator.type.annotation.ts)

(index_signature
  (":") @keyword.operator.type.annotation.ts)

(type_predicate_annotation
  (":") @keyword.operator.type.annotation.ts)

(conditional_type
  ([
    "?"
    ":"
  ]) @keyword.operator.ternary.ts)

[
  "{"
  "}"
  "("
  ")"
  "["
  "]"
] @punctuation.ts

(template_substitution
  "${" @punctuation.definition.template-expression.begin.ts
  "}" @punctuation.definition.template-expression.end.ts)

(template_type
  "${" @punctuation.definition.template-expression.begin.ts
  "}" @punctuation.definition.template-expression.end.ts)

(type_arguments
  "<" @punctuation.definition.typeparameters.begin.ts
  ">" @punctuation.definition.typeparameters.end.ts)

(type_parameters
  "<" @punctuation.definition.typeparameters.begin.ts
  ">" @punctuation.definition.typeparameters.end.ts)

; Keywords

("typeof") @keyword.operator.expression.typeof.ts

(binary_expression "instanceof" @keyword.operator.expression.instanceof.ts)

("of") @keyword.operator.expression.of.ts

("is") @keyword.operator.expression.is.ts

[
  "delete"
  "in"
  "infer"
  "keyof"
] @keyword.operator.expression.ts

[
  "as"
  "await"
  "break"
  "case"
  "catch"
  "continue"
  "default"
  "do"
  "else"
  "export"
  "finally"
  "for"
  "from"
  "if"
  "import"
  "require"
  "return"
  "satisfies"
  "switch"
  "throw"
  "try"
  "while"
  "yield"
] @keyword.control.ts

[
  "abstract"
  "async"
  "declare"
  "extends"
  "implements"
  "override"
  "private"
  "protected"
  "public"
  "readonly"
  "static"
] @storage.modifier.ts

[
  "=>"
  "class"
  "const"
  "enum"
  "function"
  "get"
  "interface"
  "let"
  "namespace"
  "set"
  "var"
] @storage.type.ts

("type") @storage.type.type.ts

[
  "module"
] @storage.type.namespace.ts

[
  "debugger"
  "target"
  "with"
] @keyword.ts

(regex_flags) @keyword.ts

(unary_expression
  "void" @keyword.operator.expression.void.ts)

[
  "new"
] @keyword.operator.new.ts

(public_field_definition
  ("?") @keyword.operator.optional.ts)

(property_signature
  ("?") @keyword.operator.optional.ts)

(method_signature
  ("?") @keyword.operator.optional.ts)

(optional_parameter
  ([
    "?"
    ":"
  ]) @keyword.operator.optional.ts)

(ternary_expression
  ([
    "?"
    ":"
  ]) @keyword.operator.ternary.ts)

(optional_chain
  ("?.") @punctuation.accessor.optional.ts)

(rest_pattern
  ("...") @keyword.operator.rest.ts)
(rest_type
  ("...") @keyword.operator.rest.ts)

(spread_element
  ("...") @keyword.operator.spread.ts)

; Language constants

[
  (null)
] @constant.language.null.ts

[
  (undefined)
] @constant.language.undefined.ts

((identifier) @constant.language.nan.ts
  (#eq? @constant.language.nan.ts "NaN"))

((identifier) @constant.language.infinity.ts
  (#eq? @constant.language.infinity.ts "Infinity"))

[
  (true)
] @constant.language.boolean.true.ts

[
  (false)
] @constant.language.boolean.false.ts

(literal_type
  [
    (null)
    (undefined)
    (true)
    (false)
  ] @support.type.builtin.ts)

(namespace_import
  "*" @constant.language.ts)
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/injections/typescript.scm]---
Location: vscode-main/src/vs/editor/common/languages/injections/typescript.scm

```text
((regex) @injection.content
  (#set! injection.language "regex"))
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/supports/characterPair.ts]---
Location: vscode-main/src/vs/editor/common/languages/supports/characterPair.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAutoClosingPair, StandardAutoClosingPairConditional, LanguageConfiguration } from '../languageConfiguration.js';

export class CharacterPairSupport {

	static readonly DEFAULT_AUTOCLOSE_BEFORE_LANGUAGE_DEFINED_QUOTES = ';:.,=}])> \n\t';
	static readonly DEFAULT_AUTOCLOSE_BEFORE_LANGUAGE_DEFINED_BRACKETS = '\'"`;:.,=}])> \n\t';
	static readonly DEFAULT_AUTOCLOSE_BEFORE_WHITESPACE = ' \n\t';

	private readonly _autoClosingPairs: StandardAutoClosingPairConditional[];
	private readonly _surroundingPairs: IAutoClosingPair[];
	private readonly _autoCloseBeforeForQuotes: string;
	private readonly _autoCloseBeforeForBrackets: string;

	constructor(config: LanguageConfiguration) {
		if (config.autoClosingPairs) {
			this._autoClosingPairs = config.autoClosingPairs.map(el => new StandardAutoClosingPairConditional(el));
		} else if (config.brackets) {
			this._autoClosingPairs = config.brackets.map(b => new StandardAutoClosingPairConditional({ open: b[0], close: b[1] }));
		} else {
			this._autoClosingPairs = [];
		}

		if (config.__electricCharacterSupport && config.__electricCharacterSupport.docComment) {
			const docComment = config.__electricCharacterSupport.docComment;
			// IDocComment is legacy, only partially supported
			this._autoClosingPairs.push(new StandardAutoClosingPairConditional({ open: docComment.open, close: docComment.close || '' }));
		}

		this._autoCloseBeforeForQuotes = typeof config.autoCloseBefore === 'string' ? config.autoCloseBefore : CharacterPairSupport.DEFAULT_AUTOCLOSE_BEFORE_LANGUAGE_DEFINED_QUOTES;
		this._autoCloseBeforeForBrackets = typeof config.autoCloseBefore === 'string' ? config.autoCloseBefore : CharacterPairSupport.DEFAULT_AUTOCLOSE_BEFORE_LANGUAGE_DEFINED_BRACKETS;

		this._surroundingPairs = config.surroundingPairs || this._autoClosingPairs;
	}

	public getAutoClosingPairs(): StandardAutoClosingPairConditional[] {
		return this._autoClosingPairs;
	}

	public getAutoCloseBeforeSet(forQuotes: boolean): string {
		return (forQuotes ? this._autoCloseBeforeForQuotes : this._autoCloseBeforeForBrackets);
	}

	public getSurroundingPairs(): IAutoClosingPair[] {
		return this._surroundingPairs;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/supports/electricCharacter.ts]---
Location: vscode-main/src/vs/editor/common/languages/supports/electricCharacter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../../base/common/arrays.js';
import { ScopedLineTokens, ignoreBracketsInToken } from '../supports.js';
import { BracketsUtils, RichEditBrackets } from './richEditBrackets.js';

/**
 * Interface used to support electric characters
 * @internal
 */
export interface IElectricAction {
	// The line will be indented at the same level of the line
	// which contains the matching given bracket type.
	matchOpenBracket: string;
}

export class BracketElectricCharacterSupport {

	private readonly _richEditBrackets: RichEditBrackets | null;

	constructor(richEditBrackets: RichEditBrackets | null) {
		this._richEditBrackets = richEditBrackets;
	}

	public getElectricCharacters(): string[] {
		const result: string[] = [];

		if (this._richEditBrackets) {
			for (const bracket of this._richEditBrackets.brackets) {
				for (const close of bracket.close) {
					const lastChar = close.charAt(close.length - 1);
					result.push(lastChar);
				}
			}
		}

		return distinct(result);
	}

	public onElectricCharacter(character: string, context: ScopedLineTokens, column: number): IElectricAction | null {
		if (!this._richEditBrackets || this._richEditBrackets.brackets.length === 0) {
			return null;
		}

		const tokenIndex = context.findTokenIndexAtOffset(column - 1);
		if (ignoreBracketsInToken(context.getStandardTokenType(tokenIndex))) {
			return null;
		}

		const reversedBracketRegex = this._richEditBrackets.reversedRegex;
		const text = context.getLineContent().substring(0, column - 1) + character;

		const r = BracketsUtils.findPrevBracketInRange(reversedBracketRegex, 1, text, 0, text.length);
		if (!r) {
			return null;
		}

		const bracketText = text.substring(r.startColumn - 1, r.endColumn - 1).toLowerCase();

		const isOpen = this._richEditBrackets.textIsOpenBracket[bracketText];
		if (isOpen) {
			return null;
		}

		const textBeforeBracket = context.getActualLineContentBefore(r.startColumn - 1);
		if (!/^\s*$/.test(textBeforeBracket)) {
			// There is other text on the line before the bracket
			return null;
		}

		return {
			matchOpenBracket: bracketText
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/supports/indentationLineProcessor.ts]---
Location: vscode-main/src/vs/editor/common/languages/supports/indentationLineProcessor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as strings from '../../../../base/common/strings.js';
import { Range } from '../../core/range.js';
import { ITextModel } from '../../model.js';
import { ILanguageConfigurationService } from '../languageConfigurationRegistry.js';
import { createScopedLineTokens, ScopedLineTokens } from '../supports.js';
import { IVirtualModel } from '../autoIndent.js';
import { IViewLineTokens, LineTokens } from '../../tokens/lineTokens.js';
import { IndentRulesSupport } from './indentRules.js';
import { StandardTokenType } from '../../encodedTokenAttributes.js';
import { Position } from '../../core/position.js';

/**
 * This class is a wrapper class around {@link IndentRulesSupport}.
 * It processes the lines by removing the language configuration brackets from the regex, string and comment tokens.
 * It then calls into the {@link IndentRulesSupport} to validate the indentation conditions.
 */
export class ProcessedIndentRulesSupport {

	private readonly _indentRulesSupport: IndentRulesSupport;
	private readonly _indentationLineProcessor: IndentationLineProcessor;

	constructor(
		model: IVirtualModel,
		indentRulesSupport: IndentRulesSupport,
		languageConfigurationService: ILanguageConfigurationService
	) {
		this._indentRulesSupport = indentRulesSupport;
		this._indentationLineProcessor = new IndentationLineProcessor(model, languageConfigurationService);
	}

	/**
	 * Apply the new indentation and return whether the indentation level should be increased after the given line number
	 */
	public shouldIncrease(lineNumber: number, newIndentation?: string): boolean {
		const processedLine = this._indentationLineProcessor.getProcessedLine(lineNumber, newIndentation);
		return this._indentRulesSupport.shouldIncrease(processedLine);
	}

	/**
	 * Apply the new indentation and return whether the indentation level should be decreased after the given line number
	 */
	public shouldDecrease(lineNumber: number, newIndentation?: string): boolean {
		const processedLine = this._indentationLineProcessor.getProcessedLine(lineNumber, newIndentation);
		return this._indentRulesSupport.shouldDecrease(processedLine);
	}

	/**
	 * Apply the new indentation and return whether the indentation level should remain unchanged at the given line number
	 */
	public shouldIgnore(lineNumber: number, newIndentation?: string): boolean {
		const processedLine = this._indentationLineProcessor.getProcessedLine(lineNumber, newIndentation);
		return this._indentRulesSupport.shouldIgnore(processedLine);
	}

	/**
	 * Apply the new indentation and return whether the indentation level should increase on the line after the given line number
	 */
	public shouldIndentNextLine(lineNumber: number, newIndentation?: string): boolean {
		const processedLine = this._indentationLineProcessor.getProcessedLine(lineNumber, newIndentation);
		return this._indentRulesSupport.shouldIndentNextLine(processedLine);
	}

}

/**
 * This class fetches the processed text around a range which can be used for indentation evaluation.
 * It returns:
 * - The processed text before the given range and on the same start line
 * - The processed text after the given range and on the same end line
 * - The processed text on the previous line
 */
export class IndentationContextProcessor {

	private readonly model: ITextModel;
	private readonly indentationLineProcessor: IndentationLineProcessor;

	constructor(
		model: ITextModel,
		languageConfigurationService: ILanguageConfigurationService
	) {
		this.model = model;
		this.indentationLineProcessor = new IndentationLineProcessor(model, languageConfigurationService);
	}

	/**
	 * Returns the processed text, stripped from the language configuration brackets within the string, comment and regex tokens, around the given range
	 */
	getProcessedTokenContextAroundRange(range: Range): {
		beforeRangeProcessedTokens: IViewLineTokens;
		afterRangeProcessedTokens: IViewLineTokens;
		previousLineProcessedTokens: IViewLineTokens;
	} {
		const beforeRangeProcessedTokens = this._getProcessedTokensBeforeRange(range);
		const afterRangeProcessedTokens = this._getProcessedTokensAfterRange(range);
		const previousLineProcessedTokens = this._getProcessedPreviousLineTokens(range);
		return { beforeRangeProcessedTokens, afterRangeProcessedTokens, previousLineProcessedTokens };
	}

	private _getProcessedTokensBeforeRange(range: Range): IViewLineTokens {
		this.model.tokenization.forceTokenization(range.startLineNumber);
		const lineTokens = this.model.tokenization.getLineTokens(range.startLineNumber);
		const scopedLineTokens = createScopedLineTokens(lineTokens, range.startColumn - 1);
		let slicedTokens: IViewLineTokens;
		if (isLanguageDifferentFromLineStart(this.model, range.getStartPosition())) {
			const columnIndexWithinScope = (range.startColumn - 1) - scopedLineTokens.firstCharOffset;
			const firstCharacterOffset = scopedLineTokens.firstCharOffset;
			const lastCharacterOffset = firstCharacterOffset + columnIndexWithinScope;
			slicedTokens = lineTokens.sliceAndInflate(firstCharacterOffset, lastCharacterOffset, 0);
		} else {
			const columnWithinLine = range.startColumn - 1;
			slicedTokens = lineTokens.sliceAndInflate(0, columnWithinLine, 0);
		}
		const processedTokens = this.indentationLineProcessor.getProcessedTokens(slicedTokens);
		return processedTokens;
	}

	private _getProcessedTokensAfterRange(range: Range): IViewLineTokens {
		const position: Position = range.isEmpty() ? range.getStartPosition() : range.getEndPosition();
		this.model.tokenization.forceTokenization(position.lineNumber);
		const lineTokens = this.model.tokenization.getLineTokens(position.lineNumber);
		const scopedLineTokens = createScopedLineTokens(lineTokens, position.column - 1);
		const columnIndexWithinScope = position.column - 1 - scopedLineTokens.firstCharOffset;
		const firstCharacterOffset = scopedLineTokens.firstCharOffset + columnIndexWithinScope;
		const lastCharacterOffset = scopedLineTokens.firstCharOffset + scopedLineTokens.getLineLength();
		const slicedTokens = lineTokens.sliceAndInflate(firstCharacterOffset, lastCharacterOffset, 0);
		const processedTokens = this.indentationLineProcessor.getProcessedTokens(slicedTokens);
		return processedTokens;
	}

	private _getProcessedPreviousLineTokens(range: Range): IViewLineTokens {
		const getScopedLineTokensAtEndColumnOfLine = (lineNumber: number): ScopedLineTokens => {
			this.model.tokenization.forceTokenization(lineNumber);
			const lineTokens = this.model.tokenization.getLineTokens(lineNumber);
			const endColumnOfLine = this.model.getLineMaxColumn(lineNumber) - 1;
			const scopedLineTokensAtEndColumn = createScopedLineTokens(lineTokens, endColumnOfLine);
			return scopedLineTokensAtEndColumn;
		};

		this.model.tokenization.forceTokenization(range.startLineNumber);
		const lineTokens = this.model.tokenization.getLineTokens(range.startLineNumber);
		const scopedLineTokens = createScopedLineTokens(lineTokens, range.startColumn - 1);
		const emptyTokens = LineTokens.createEmpty('', scopedLineTokens.languageIdCodec);
		const previousLineNumber = range.startLineNumber - 1;
		const isFirstLine = previousLineNumber === 0;
		if (isFirstLine) {
			return emptyTokens;
		}
		const canScopeExtendOnPreviousLine = scopedLineTokens.firstCharOffset === 0;
		if (!canScopeExtendOnPreviousLine) {
			return emptyTokens;
		}
		const scopedLineTokensAtEndColumnOfPreviousLine = getScopedLineTokensAtEndColumnOfLine(previousLineNumber);
		const doesLanguageContinueOnPreviousLine = scopedLineTokens.languageId === scopedLineTokensAtEndColumnOfPreviousLine.languageId;
		if (!doesLanguageContinueOnPreviousLine) {
			return emptyTokens;
		}
		const previousSlicedLineTokens = scopedLineTokensAtEndColumnOfPreviousLine.toIViewLineTokens();
		const processedTokens = this.indentationLineProcessor.getProcessedTokens(previousSlicedLineTokens);
		return processedTokens;
	}
}

/**
 * This class performs the actual processing of the indentation lines.
 * The brackets of the language configuration are removed from the regex, string and comment tokens.
 */
class IndentationLineProcessor {

	constructor(
		private readonly model: IVirtualModel,
		private readonly languageConfigurationService: ILanguageConfigurationService
	) { }

	/**
	 * Get the processed line for the given line number and potentially adjust the indentation level.
	 * Remove the language configuration brackets from the regex, string and comment tokens.
	 */
	getProcessedLine(lineNumber: number, newIndentation?: string): string {
		const replaceIndentation = (line: string, newIndentation: string): string => {
			const currentIndentation = strings.getLeadingWhitespace(line);
			const adjustedLine = newIndentation + line.substring(currentIndentation.length);
			return adjustedLine;
		};

		this.model.tokenization.forceTokenization?.(lineNumber);
		const tokens = this.model.tokenization.getLineTokens(lineNumber);
		let processedLine = this.getProcessedTokens(tokens).getLineContent();
		if (newIndentation !== undefined) {
			processedLine = replaceIndentation(processedLine, newIndentation);
		}
		return processedLine;
	}

	/**
	 * Process the line with the given tokens, remove the language configuration brackets from the regex, string and comment tokens.
	 */
	getProcessedTokens(tokens: IViewLineTokens): IViewLineTokens {

		const shouldRemoveBracketsFromTokenType = (tokenType: StandardTokenType): boolean => {
			return tokenType === StandardTokenType.String
				|| tokenType === StandardTokenType.RegEx
				|| tokenType === StandardTokenType.Comment;
		};

		const languageId = tokens.getLanguageId(0);
		const bracketsConfiguration = this.languageConfigurationService.getLanguageConfiguration(languageId).bracketsNew;
		const bracketsRegExp = bracketsConfiguration.getBracketRegExp({ global: true });
		const textAndMetadata: { text: string; metadata: number }[] = [];
		tokens.forEach((tokenIndex: number) => {
			const tokenType = tokens.getStandardTokenType(tokenIndex);
			let text = tokens.getTokenText(tokenIndex);
			if (shouldRemoveBracketsFromTokenType(tokenType)) {
				text = text.replace(bracketsRegExp, '');
			}
			const metadata = tokens.getMetadata(tokenIndex);
			textAndMetadata.push({ text, metadata });
		});
		const processedLineTokens = LineTokens.createFromTextAndMetadata(textAndMetadata, tokens.languageIdCodec);
		return processedLineTokens;
	}
}

export function isLanguageDifferentFromLineStart(model: ITextModel, position: Position): boolean {
	model.tokenization.forceTokenization(position.lineNumber);
	const lineTokens = model.tokenization.getLineTokens(position.lineNumber);
	const scopedLineTokens = createScopedLineTokens(lineTokens, position.column - 1);
	const doesScopeStartAtOffsetZero = scopedLineTokens.firstCharOffset === 0;
	const isScopedLanguageEqualToFirstLanguageOnLine = lineTokens.getLanguageId(0) === scopedLineTokens.languageId;
	const languageIsDifferentFromLineStart = !doesScopeStartAtOffsetZero && !isScopedLanguageEqualToFirstLanguageOnLine;
	return languageIsDifferentFromLineStart;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/supports/indentRules.ts]---
Location: vscode-main/src/vs/editor/common/languages/supports/indentRules.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IndentationRule } from '../languageConfiguration.js';

export const enum IndentConsts {
	INCREASE_MASK = 0b00000001,
	DECREASE_MASK = 0b00000010,
	INDENT_NEXTLINE_MASK = 0b00000100,
	UNINDENT_MASK = 0b00001000,
}

function resetGlobalRegex(reg: RegExp) {
	if (reg.global) {
		reg.lastIndex = 0;
	}

	return true;
}

export class IndentRulesSupport {

	private readonly _indentationRules: IndentationRule;

	constructor(indentationRules: IndentationRule) {
		this._indentationRules = indentationRules;
	}

	public shouldIncrease(text: string): boolean {
		if (this._indentationRules) {
			if (this._indentationRules.increaseIndentPattern && resetGlobalRegex(this._indentationRules.increaseIndentPattern) && this._indentationRules.increaseIndentPattern.test(text)) {
				return true;
			}
			// if (this._indentationRules.indentNextLinePattern && this._indentationRules.indentNextLinePattern.test(text)) {
			// 	return true;
			// }
		}
		return false;
	}

	public shouldDecrease(text: string): boolean {
		if (this._indentationRules && this._indentationRules.decreaseIndentPattern && resetGlobalRegex(this._indentationRules.decreaseIndentPattern) && this._indentationRules.decreaseIndentPattern.test(text)) {
			return true;
		}
		return false;
	}

	public shouldIndentNextLine(text: string): boolean {
		if (this._indentationRules && this._indentationRules.indentNextLinePattern && resetGlobalRegex(this._indentationRules.indentNextLinePattern) && this._indentationRules.indentNextLinePattern.test(text)) {
			return true;
		}

		return false;
	}

	public shouldIgnore(text: string): boolean {
		// the text matches `unIndentedLinePattern`
		if (this._indentationRules && this._indentationRules.unIndentedLinePattern && resetGlobalRegex(this._indentationRules.unIndentedLinePattern) && this._indentationRules.unIndentedLinePattern.test(text)) {
			return true;
		}

		return false;
	}

	public getIndentMetadata(text: string): number {
		let ret = 0;
		if (this.shouldIncrease(text)) {
			ret += IndentConsts.INCREASE_MASK;
		}
		if (this.shouldDecrease(text)) {
			ret += IndentConsts.DECREASE_MASK;
		}
		if (this.shouldIndentNextLine(text)) {
			ret += IndentConsts.INDENT_NEXTLINE_MASK;
		}
		if (this.shouldIgnore(text)) {
			ret += IndentConsts.UNINDENT_MASK;
		}
		return ret;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/supports/inplaceReplaceSupport.ts]---
Location: vscode-main/src/vs/editor/common/languages/supports/inplaceReplaceSupport.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IRange } from '../../core/range.js';
import { IInplaceReplaceSupportResult } from '../../languages.js';

export class BasicInplaceReplace {

	public static readonly INSTANCE = new BasicInplaceReplace();

	public navigateValueSet(range1: IRange, text1: string, range2: IRange, text2: string | null, up: boolean): IInplaceReplaceSupportResult | null {

		if (range1 && text1) {
			const result = this.doNavigateValueSet(text1, up);
			if (result) {
				return {
					range: range1,
					value: result
				};
			}
		}

		if (range2 && text2) {
			const result = this.doNavigateValueSet(text2, up);
			if (result) {
				return {
					range: range2,
					value: result
				};
			}
		}

		return null;
	}

	private doNavigateValueSet(text: string, up: boolean): string | null {
		const numberResult = this.numberReplace(text, up);
		if (numberResult !== null) {
			return numberResult;
		}
		return this.textReplace(text, up);
	}

	private numberReplace(value: string, up: boolean): string | null {
		const precision = Math.pow(10, value.length - (value.lastIndexOf('.') + 1));
		let n1 = Number(value);
		const n2 = parseFloat(value);

		if (!isNaN(n1) && !isNaN(n2) && n1 === n2) {

			if (n1 === 0 && !up) {
				return null; // don't do negative
				//			} else if(n1 === 9 && up) {
				//				return null; // don't insert 10 into a number
			} else {
				n1 = Math.floor(n1 * precision);
				n1 += up ? precision : -precision;
				return String(n1 / precision);
			}
		}

		return null;
	}

	private readonly _defaultValueSet: string[][] = [
		['true', 'false'],
		['True', 'False'],
		['Private', 'Public', 'Friend', 'ReadOnly', 'Partial', 'Protected', 'WriteOnly'],
		['public', 'protected', 'private'],
	];

	private textReplace(value: string, up: boolean): string | null {
		return this.valueSetsReplace(this._defaultValueSet, value, up);
	}

	private valueSetsReplace(valueSets: string[][], value: string, up: boolean): string | null {
		let result: string | null = null;
		for (let i = 0, len = valueSets.length; result === null && i < len; i++) {
			result = this.valueSetReplace(valueSets[i], value, up);
		}
		return result;
	}

	private valueSetReplace(valueSet: string[], value: string, up: boolean): string | null {
		let idx = valueSet.indexOf(value);
		if (idx >= 0) {
			idx += up ? +1 : -1;
			if (idx < 0) {
				idx = valueSet.length - 1;
			} else {
				idx %= valueSet.length;
			}
			return valueSet[idx];
		}
		return null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/supports/languageBracketsConfiguration.ts]---
Location: vscode-main/src/vs/editor/common/languages/supports/languageBracketsConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CachedFunction } from '../../../../base/common/cache.js';
import { RegExpOptions } from '../../../../base/common/strings.js';
import { LanguageConfiguration } from '../languageConfiguration.js';
import { createBracketOrRegExp } from './richEditBrackets.js';

/**
 * Captures all bracket related configurations for a single language.
 * Immutable.
*/
export class LanguageBracketsConfiguration {
	private readonly _openingBrackets: ReadonlyMap<string, OpeningBracketKind>;
	private readonly _closingBrackets: ReadonlyMap<string, ClosingBracketKind>;

	constructor(
		public readonly languageId: string,
		config: LanguageConfiguration,
	) {
		const bracketPairs = config.brackets ? filterValidBrackets(config.brackets) : [];
		const openingBracketInfos = new CachedFunction((bracket: string) => {
			const closing = new Set<ClosingBracketKind>();

			return {
				info: new OpeningBracketKind(this, bracket, closing),
				closing,
			};
		});
		const closingBracketInfos = new CachedFunction((bracket: string) => {
			const opening = new Set<OpeningBracketKind>();
			const openingColorized = new Set<OpeningBracketKind>();
			return {
				info: new ClosingBracketKind(this, bracket, opening, openingColorized),
				opening,
				openingColorized,
			};
		});

		for (const [open, close] of bracketPairs) {
			const opening = openingBracketInfos.get(open);
			const closing = closingBracketInfos.get(close);

			opening.closing.add(closing.info);
			closing.opening.add(opening.info);
		}

		// Treat colorized brackets as brackets, and mark them as colorized.
		const colorizedBracketPairs = config.colorizedBracketPairs
			? filterValidBrackets(config.colorizedBracketPairs)
			// If not configured: Take all brackets except `<` ... `>`
			// Many languages set < ... > as bracket pair, even though they also use it as comparison operator.
			// This leads to problems when colorizing this bracket, so we exclude it if not explicitly configured otherwise.
			// https://github.com/microsoft/vscode/issues/132476
			: bracketPairs.filter((p) => !(p[0] === '<' && p[1] === '>'));
		for (const [open, close] of colorizedBracketPairs) {
			const opening = openingBracketInfos.get(open);
			const closing = closingBracketInfos.get(close);

			opening.closing.add(closing.info);
			closing.openingColorized.add(opening.info);
			closing.opening.add(opening.info);
		}

		this._openingBrackets = new Map([...openingBracketInfos.cachedValues].map(([k, v]) => [k, v.info]));
		this._closingBrackets = new Map([...closingBracketInfos.cachedValues].map(([k, v]) => [k, v.info]));
	}

	/**
	 * No two brackets have the same bracket text.
	*/
	public get openingBrackets(): readonly OpeningBracketKind[] {
		return [...this._openingBrackets.values()];
	}

	/**
	 * No two brackets have the same bracket text.
	*/
	public get closingBrackets(): readonly ClosingBracketKind[] {
		return [...this._closingBrackets.values()];
	}

	public getOpeningBracketInfo(bracketText: string): OpeningBracketKind | undefined {
		return this._openingBrackets.get(bracketText);
	}

	public getClosingBracketInfo(bracketText: string): ClosingBracketKind | undefined {
		return this._closingBrackets.get(bracketText);
	}

	public getBracketInfo(bracketText: string): BracketKind | undefined {
		return this.getOpeningBracketInfo(bracketText) || this.getClosingBracketInfo(bracketText);
	}

	public getBracketRegExp(options?: RegExpOptions): RegExp {
		const brackets = Array.from([...this._openingBrackets.keys(), ...this._closingBrackets.keys()]);
		return createBracketOrRegExp(brackets, options);
	}
}

function filterValidBrackets(bracketPairs: [string, string][]): [string, string][] {
	return bracketPairs.filter(([open, close]) => open !== '' && close !== '');
}

export type BracketKind = OpeningBracketKind | ClosingBracketKind;

export class BracketKindBase {
	constructor(
		protected readonly config: LanguageBracketsConfiguration,
		public readonly bracketText: string,
	) { }

	public get languageId(): string {
		return this.config.languageId;
	}
}

export class OpeningBracketKind extends BracketKindBase {
	public readonly isOpeningBracket = true;

	constructor(
		config: LanguageBracketsConfiguration,
		bracketText: string,
		public readonly openedBrackets: ReadonlySet<ClosingBracketKind>,
	) {
		super(config, bracketText);
	}
}

export class ClosingBracketKind extends BracketKindBase {
	public readonly isOpeningBracket = false;

	constructor(
		config: LanguageBracketsConfiguration,
		bracketText: string,
		/**
		 * Non empty array of all opening brackets this bracket closes.
		*/
		public readonly openingBrackets: ReadonlySet<OpeningBracketKind>,
		private readonly openingColorizedBrackets: ReadonlySet<OpeningBracketKind>,
	) {
		super(config, bracketText);
	}

	/**
	 * Checks if this bracket closes the given other bracket.
	 * If the bracket infos come from different configurations, this method will return false.
	*/
	public closes(other: OpeningBracketKind): boolean {
		if (other['config'] !== this.config) {
			return false;
		}
		return this.openingBrackets.has(other);
	}

	public closesColorized(other: OpeningBracketKind): boolean {
		if (other['config'] !== this.config) {
			return false;
		}
		return this.openingColorizedBrackets.has(other);
	}

	public getOpeningBrackets(): readonly OpeningBracketKind[] {
		return [...this.openingBrackets];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/supports/onEnter.ts]---
Location: vscode-main/src/vs/editor/common/languages/supports/onEnter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedError } from '../../../../base/common/errors.js';
import * as strings from '../../../../base/common/strings.js';
import { CharacterPair, EnterAction, IndentAction, OnEnterRule } from '../languageConfiguration.js';
import { EditorAutoIndentStrategy } from '../../config/editorOptions.js';

export interface IOnEnterSupportOptions {
	brackets?: CharacterPair[];
	onEnterRules?: OnEnterRule[];
}

interface IProcessedBracketPair {
	open: string;
	close: string;
	openRegExp: RegExp;
	closeRegExp: RegExp;
}

export class OnEnterSupport {

	private readonly _brackets: IProcessedBracketPair[];
	private readonly _regExpRules: OnEnterRule[];

	constructor(opts: IOnEnterSupportOptions) {
		opts = opts || {};
		opts.brackets = opts.brackets || [
			['(', ')'],
			['{', '}'],
			['[', ']']
		];

		this._brackets = [];
		opts.brackets.forEach((bracket) => {
			const openRegExp = OnEnterSupport._createOpenBracketRegExp(bracket[0]);
			const closeRegExp = OnEnterSupport._createCloseBracketRegExp(bracket[1]);
			if (openRegExp && closeRegExp) {
				this._brackets.push({
					open: bracket[0],
					openRegExp: openRegExp,
					close: bracket[1],
					closeRegExp: closeRegExp,
				});
			}
		});
		this._regExpRules = opts.onEnterRules || [];
	}

	public onEnter(autoIndent: EditorAutoIndentStrategy, previousLineText: string, beforeEnterText: string, afterEnterText: string): EnterAction | null {
		// (1): `regExpRules`
		if (autoIndent >= EditorAutoIndentStrategy.Advanced) {
			for (let i = 0, len = this._regExpRules.length; i < len; i++) {
				const rule = this._regExpRules[i];
				const regResult = [{
					reg: rule.beforeText,
					text: beforeEnterText
				}, {
					reg: rule.afterText,
					text: afterEnterText
				}, {
					reg: rule.previousLineText,
					text: previousLineText
				}].every((obj): boolean => {
					if (!obj.reg) {
						return true;
					}

					obj.reg.lastIndex = 0; // To disable the effect of the "g" flag.
					return obj.reg.test(obj.text);
				});

				if (regResult) {
					return rule.action;
				}
			}
		}

		// (2): Special indent-outdent
		if (autoIndent >= EditorAutoIndentStrategy.Brackets) {
			if (beforeEnterText.length > 0 && afterEnterText.length > 0) {
				for (let i = 0, len = this._brackets.length; i < len; i++) {
					const bracket = this._brackets[i];
					if (bracket.openRegExp.test(beforeEnterText) && bracket.closeRegExp.test(afterEnterText)) {
						return { indentAction: IndentAction.IndentOutdent };
					}
				}
			}
		}


		// (4): Open bracket based logic
		if (autoIndent >= EditorAutoIndentStrategy.Brackets) {
			if (beforeEnterText.length > 0) {
				for (let i = 0, len = this._brackets.length; i < len; i++) {
					const bracket = this._brackets[i];
					if (bracket.openRegExp.test(beforeEnterText)) {
						return { indentAction: IndentAction.Indent };
					}
				}
			}
		}

		return null;
	}

	private static _createOpenBracketRegExp(bracket: string): RegExp | null {
		let str = strings.escapeRegExpCharacters(bracket);
		if (!/\B/.test(str.charAt(0))) {
			str = '\\b' + str;
		}
		str += '\\s*$';
		return OnEnterSupport._safeRegExp(str);
	}

	private static _createCloseBracketRegExp(bracket: string): RegExp | null {
		let str = strings.escapeRegExpCharacters(bracket);
		if (!/\B/.test(str.charAt(str.length - 1))) {
			str = str + '\\b';
		}
		str = '^\\s*' + str;
		return OnEnterSupport._safeRegExp(str);
	}

	private static _safeRegExp(def: string): RegExp | null {
		try {
			return new RegExp(def);
		} catch (err) {
			onUnexpectedError(err);
			return null;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/supports/richEditBrackets.ts]---
Location: vscode-main/src/vs/editor/common/languages/supports/richEditBrackets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as strings from '../../../../base/common/strings.js';
import * as stringBuilder from '../../core/stringBuilder.js';
import { Range } from '../../core/range.js';
import { CharacterPair } from '../languageConfiguration.js';

interface InternalBracket {
	open: string[];
	close: string[];
}

/**
 * Represents a grouping of colliding bracket pairs.
 *
 * Most of the times this contains a single bracket pair,
 * but sometimes this contains multiple bracket pairs in cases
 * where the same string appears as a closing bracket for multiple
 * bracket pairs, or the same string appears an opening bracket for
 * multiple bracket pairs.
 *
 * e.g. of a group containing a single pair:
 *   open: ['{'], close: ['}']
 *
 * e.g. of a group containing multiple pairs:
 *   open: ['if', 'for'], close: ['end', 'end']
 */
export class RichEditBracket {
	_richEditBracketBrand: void = undefined;

	readonly languageId: string;
	/**
	 * A 0-based consecutive unique identifier for this bracket pair.
	 * If a language has 5 bracket pairs, out of which 2 are grouped together,
	 * it is expected that the `index` goes from 0 to 4.
	 */
	readonly index: number;
	/**
	 * The open sequence for each bracket pair contained in this group.
	 *
	 * The open sequence at a specific index corresponds to the
	 * closing sequence at the same index.
	 *
	 * [ open[i], closed[i] ] represent a bracket pair.
	 */
	readonly open: string[];
	/**
	 * The close sequence for each bracket pair contained in this group.
	 *
	 * The close sequence at a specific index corresponds to the
	 * opening sequence at the same index.
	 *
	 * [ open[i], closed[i] ] represent a bracket pair.
	 */
	readonly close: string[];
	/**
	 * A regular expression that is useful to search for this bracket pair group in a string.
	 *
	 * This regular expression is built in a way that it is aware of the other bracket
	 * pairs defined for the language, so it might match brackets from other groups.
	 *
	 * See the fine details in `getRegexForBracketPair`.
	 */
	readonly forwardRegex: RegExp;
	/**
	 * A regular expression that is useful to search for this bracket pair group in a string backwards.
	 *
	 * This regular expression is built in a way that it is aware of the other bracket
	 * pairs defined for the language, so it might match brackets from other groups.
	 *
	 * See the fine defails in `getReversedRegexForBracketPair`.
	 */
	readonly reversedRegex: RegExp;
	private readonly _openSet: Set<string>;
	private readonly _closeSet: Set<string>;

	constructor(languageId: string, index: number, open: string[], close: string[], forwardRegex: RegExp, reversedRegex: RegExp) {
		this.languageId = languageId;
		this.index = index;
		this.open = open;
		this.close = close;
		this.forwardRegex = forwardRegex;
		this.reversedRegex = reversedRegex;
		this._openSet = RichEditBracket._toSet(this.open);
		this._closeSet = RichEditBracket._toSet(this.close);
	}

	/**
	 * Check if the provided `text` is an open bracket in this group.
	 */
	public isOpen(text: string) {
		return this._openSet.has(text);
	}

	/**
	 * Check if the provided `text` is a close bracket in this group.
	 */
	public isClose(text: string) {
		return this._closeSet.has(text);
	}

	private static _toSet(arr: string[]): Set<string> {
		const result = new Set<string>();
		for (const element of arr) {
			result.add(element);
		}
		return result;
	}
}

/**
 * Groups together brackets that have equal open or close sequences.
 *
 * For example, if the following brackets are defined:
 *   ['IF','END']
 *   ['for','end']
 *   ['{','}']
 *
 * Then the grouped brackets would be:
 *   { open: ['if', 'for'], close: ['end', 'end'] }
 *   { open: ['{'], close: ['}'] }
 *
 */
function groupFuzzyBrackets(brackets: readonly CharacterPair[]): InternalBracket[] {
	const N = brackets.length;

	brackets = brackets.map(b => [b[0].toLowerCase(), b[1].toLowerCase()]);

	const group: number[] = [];
	for (let i = 0; i < N; i++) {
		group[i] = i;
	}

	const areOverlapping = (a: CharacterPair, b: CharacterPair) => {
		const [aOpen, aClose] = a;
		const [bOpen, bClose] = b;
		return (aOpen === bOpen || aOpen === bClose || aClose === bOpen || aClose === bClose);
	};

	const mergeGroups = (g1: number, g2: number) => {
		const newG = Math.min(g1, g2);
		const oldG = Math.max(g1, g2);
		for (let i = 0; i < N; i++) {
			if (group[i] === oldG) {
				group[i] = newG;
			}
		}
	};

	// group together brackets that have the same open or the same close sequence
	for (let i = 0; i < N; i++) {
		const a = brackets[i];
		for (let j = i + 1; j < N; j++) {
			const b = brackets[j];
			if (areOverlapping(a, b)) {
				mergeGroups(group[i], group[j]);
			}
		}
	}

	const result: InternalBracket[] = [];
	for (let g = 0; g < N; g++) {
		const currentOpen: string[] = [];
		const currentClose: string[] = [];
		for (let i = 0; i < N; i++) {
			if (group[i] === g) {
				const [open, close] = brackets[i];
				currentOpen.push(open);
				currentClose.push(close);
			}
		}
		if (currentOpen.length > 0) {
			result.push({
				open: currentOpen,
				close: currentClose
			});
		}
	}
	return result;
}

export class RichEditBrackets {
	_richEditBracketsBrand: void = undefined;

	/**
	 * All groups of brackets defined for this language.
	 */
	public readonly brackets: RichEditBracket[];
	/**
	 * A regular expression that is useful to search for all bracket pairs in a string.
	 *
	 * See the fine details in `getRegexForBrackets`.
	 */
	public readonly forwardRegex: RegExp;
	/**
	 * A regular expression that is useful to search for all bracket pairs in a string backwards.
	 *
	 * See the fine details in `getReversedRegexForBrackets`.
	 */
	public readonly reversedRegex: RegExp;
	/**
	 * The length (i.e. str.length) for the longest bracket pair.
	 */
	public readonly maxBracketLength: number;
	/**
	 * A map useful for decoding a regex match and finding which bracket group was matched.
	 */
	public readonly textIsBracket: { [text: string]: RichEditBracket };
	/**
	 * A set useful for decoding if a regex match is the open bracket of a bracket pair.
	 */
	public readonly textIsOpenBracket: { [text: string]: boolean };

	constructor(languageId: string, _brackets: readonly CharacterPair[]) {
		const brackets = groupFuzzyBrackets(_brackets);

		this.brackets = brackets.map((b, index) => {
			return new RichEditBracket(
				languageId,
				index,
				b.open,
				b.close,
				getRegexForBracketPair(b.open, b.close, brackets, index),
				getReversedRegexForBracketPair(b.open, b.close, brackets, index)
			);
		});

		this.forwardRegex = getRegexForBrackets(this.brackets);
		this.reversedRegex = getReversedRegexForBrackets(this.brackets);

		this.textIsBracket = {};
		this.textIsOpenBracket = {};

		this.maxBracketLength = 0;
		for (const bracket of this.brackets) {
			for (const open of bracket.open) {
				this.textIsBracket[open] = bracket;
				this.textIsOpenBracket[open] = true;
				this.maxBracketLength = Math.max(this.maxBracketLength, open.length);
			}
			for (const close of bracket.close) {
				this.textIsBracket[close] = bracket;
				this.textIsOpenBracket[close] = false;
				this.maxBracketLength = Math.max(this.maxBracketLength, close.length);
			}
		}
	}
}

function collectSuperstrings(str: string, brackets: InternalBracket[], currentIndex: number, dest: string[]): void {
	for (let i = 0, len = brackets.length; i < len; i++) {
		if (i === currentIndex) {
			continue;
		}
		const bracket = brackets[i];
		for (const open of bracket.open) {
			if (open.indexOf(str) >= 0) {
				dest.push(open);
			}
		}
		for (const close of bracket.close) {
			if (close.indexOf(str) >= 0) {
				dest.push(close);
			}
		}
	}
}

function lengthcmp(a: string, b: string) {
	return a.length - b.length;
}

function unique(arr: string[]): string[] {
	if (arr.length <= 1) {
		return arr;
	}
	const result: string[] = [];
	const seen = new Set<string>();
	for (const element of arr) {
		if (seen.has(element)) {
			continue;
		}
		result.push(element);
		seen.add(element);
	}
	return result;
}

/**
 * Create a regular expression that can be used to search forward in a piece of text
 * for a group of bracket pairs. But this regex must be built in a way in which
 * it is aware of the other bracket pairs defined for the language.
 *
 * For example, if a language contains the following bracket pairs:
 *   ['begin', 'end']
 *   ['if', 'end if']
 * The two bracket pairs do not collide because no open or close brackets are equal.
 * So the function getRegexForBracketPair is called twice, once with
 * the ['begin'], ['end'] group consisting of one bracket pair, and once with
 * the ['if'], ['end if'] group consiting of the other bracket pair.
 *
 * But there could be a situation where an occurrence of 'end if' is mistaken
 * for an occurrence of 'end'.
 *
 * Therefore, for the bracket pair ['begin', 'end'], the regex will also
 * target 'end if'. The regex will be something like:
 *   /(\bend if\b)|(\bend\b)|(\bif\b)/
 *
 * The regex also searches for "superstrings" (other brackets that might be mistaken with the current bracket).
 *
 */
function getRegexForBracketPair(open: string[], close: string[], brackets: InternalBracket[], currentIndex: number): RegExp {
	// search in all brackets for other brackets that are a superstring of these brackets
	let pieces: string[] = [];
	pieces = pieces.concat(open);
	pieces = pieces.concat(close);
	for (let i = 0, len = pieces.length; i < len; i++) {
		collectSuperstrings(pieces[i], brackets, currentIndex, pieces);
	}
	pieces = unique(pieces);
	pieces.sort(lengthcmp);
	pieces.reverse();
	return createBracketOrRegExp(pieces);
}

/**
 * Matching a regular expression in JS can only be done "forwards". So JS offers natively only
 * methods to find the first match of a regex in a string. But sometimes, it is useful to
 * find the last match of a regex in a string. For such a situation, a nice solution is to
 * simply reverse the string and then search for a reversed regex.
 *
 * This function also has the fine details of `getRegexForBracketPair`. For the same example
 * given above, the regex produced here would look like:
 *   /(\bfi dne\b)|(\bdne\b)|(\bfi\b)/
 */
function getReversedRegexForBracketPair(open: string[], close: string[], brackets: InternalBracket[], currentIndex: number): RegExp {
	// search in all brackets for other brackets that are a superstring of these brackets
	let pieces: string[] = [];
	pieces = pieces.concat(open);
	pieces = pieces.concat(close);
	for (let i = 0, len = pieces.length; i < len; i++) {
		collectSuperstrings(pieces[i], brackets, currentIndex, pieces);
	}
	pieces = unique(pieces);
	pieces.sort(lengthcmp);
	pieces.reverse();
	return createBracketOrRegExp(pieces.map(toReversedString));
}

/**
 * Creates a regular expression that targets all bracket pairs.
 *
 * e.g. for the bracket pairs:
 *  ['{','}']
 *  ['begin,'end']
 *  ['for','end']
 * the regex would look like:
 *  /(\{)|(\})|(\bbegin\b)|(\bend\b)|(\bfor\b)/
 */
function getRegexForBrackets(brackets: RichEditBracket[]): RegExp {
	let pieces: string[] = [];
	for (const bracket of brackets) {
		for (const open of bracket.open) {
			pieces.push(open);
		}
		for (const close of bracket.close) {
			pieces.push(close);
		}
	}
	pieces = unique(pieces);
	return createBracketOrRegExp(pieces);
}

/**
 * Matching a regular expression in JS can only be done "forwards". So JS offers natively only
 * methods to find the first match of a regex in a string. But sometimes, it is useful to
 * find the last match of a regex in a string. For such a situation, a nice solution is to
 * simply reverse the string and then search for a reversed regex.
 *
 * e.g. for the bracket pairs:
 *  ['{','}']
 *  ['begin,'end']
 *  ['for','end']
 * the regex would look like:
 *  /(\{)|(\})|(\bnigeb\b)|(\bdne\b)|(\brof\b)/
 */
function getReversedRegexForBrackets(brackets: RichEditBracket[]): RegExp {
	let pieces: string[] = [];
	for (const bracket of brackets) {
		for (const open of bracket.open) {
			pieces.push(open);
		}
		for (const close of bracket.close) {
			pieces.push(close);
		}
	}
	pieces = unique(pieces);
	return createBracketOrRegExp(pieces.map(toReversedString));
}

function prepareBracketForRegExp(str: string): string {
	// This bracket pair uses letters like e.g. "begin" - "end"
	const insertWordBoundaries = (/^[\w ]+$/.test(str));
	str = strings.escapeRegExpCharacters(str);
	return (insertWordBoundaries ? `\\b${str}\\b` : str);
}

export function createBracketOrRegExp(pieces: string[], options?: strings.RegExpOptions): RegExp {
	const regexStr = `(${pieces.map(prepareBracketForRegExp).join(')|(')})`;
	return strings.createRegExp(regexStr, true, options);
}

const toReversedString = (function () {

	function reverse(str: string): string {
		// create a Uint16Array and then use a TextDecoder to create a string
		const arr = new Uint16Array(str.length);
		let offset = 0;
		for (let i = str.length - 1; i >= 0; i--) {
			arr[offset++] = str.charCodeAt(i);
		}
		return stringBuilder.getPlatformTextDecoder().decode(arr);
	}

	let lastInput: string | null = null;
	let lastOutput: string | null = null;
	return function toReversedString(str: string): string {
		if (lastInput !== str) {
			lastInput = str;
			lastOutput = reverse(lastInput);
		}
		return lastOutput!;
	};
})();

export class BracketsUtils {

	private static _findPrevBracketInText(reversedBracketRegex: RegExp, lineNumber: number, reversedText: string, offset: number): Range | null {
		const m = reversedText.match(reversedBracketRegex);

		if (!m) {
			return null;
		}

		const matchOffset = reversedText.length - (m.index || 0);
		const matchLength = m[0].length;
		const absoluteMatchOffset = offset + matchOffset;

		return new Range(lineNumber, absoluteMatchOffset - matchLength + 1, lineNumber, absoluteMatchOffset + 1);
	}

	public static findPrevBracketInRange(reversedBracketRegex: RegExp, lineNumber: number, lineText: string, startOffset: number, endOffset: number): Range | null {
		// Because JS does not support backwards regex search, we search forwards in a reversed string with a reversed regex ;)
		const reversedLineText = toReversedString(lineText);
		const reversedSubstr = reversedLineText.substring(lineText.length - endOffset, lineText.length - startOffset);
		return this._findPrevBracketInText(reversedBracketRegex, lineNumber, reversedSubstr, startOffset);
	}

	public static findNextBracketInText(bracketRegex: RegExp, lineNumber: number, text: string, offset: number): Range | null {
		const m = text.match(bracketRegex);

		if (!m) {
			return null;
		}

		const matchOffset = m.index || 0;
		const matchLength = m[0].length;
		if (matchLength === 0) {
			return null;
		}
		const absoluteMatchOffset = offset + matchOffset;

		return new Range(lineNumber, absoluteMatchOffset + 1, lineNumber, absoluteMatchOffset + 1 + matchLength);
	}

	public static findNextBracketInRange(bracketRegex: RegExp, lineNumber: number, lineText: string, startOffset: number, endOffset: number): Range | null {
		const substr = lineText.substring(startOffset, endOffset);
		return this.findNextBracketInText(bracketRegex, lineNumber, substr, startOffset);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages/supports/tokenization.ts]---
Location: vscode-main/src/vs/editor/common/languages/supports/tokenization.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Color } from '../../../../base/common/color.js';
import { IFontTokenOptions } from '../../../../platform/theme/common/themeService.js';
import { LanguageId, FontStyle, ColorId, StandardTokenType, MetadataConsts } from '../../encodedTokenAttributes.js';

export interface ITokenThemeRule {
	token: string;
	foreground?: string;
	background?: string;
	fontStyle?: string;
}

export class ParsedTokenThemeRule {
	_parsedThemeRuleBrand: void = undefined;

	readonly token: string;
	readonly index: number;

	/**
	 * -1 if not set. An or mask of `FontStyle` otherwise.
	 */
	readonly fontStyle: FontStyle;
	readonly foreground: string | null;
	readonly background: string | null;

	constructor(
		token: string,
		index: number,
		fontStyle: number,
		foreground: string | null,
		background: string | null,
	) {
		this.token = token;
		this.index = index;
		this.fontStyle = fontStyle;
		this.foreground = foreground;
		this.background = background;
	}
}

/**
 * Parse a raw theme into rules.
 */
export function parseTokenTheme(source: ITokenThemeRule[]): ParsedTokenThemeRule[] {
	if (!source || !Array.isArray(source)) {
		return [];
	}
	const result: ParsedTokenThemeRule[] = [];
	let resultLen = 0;
	for (let i = 0, len = source.length; i < len; i++) {
		const entry = source[i];

		let fontStyle: number = FontStyle.NotSet;
		if (typeof entry.fontStyle === 'string') {
			fontStyle = FontStyle.None;

			const segments = entry.fontStyle.split(' ');
			for (let j = 0, lenJ = segments.length; j < lenJ; j++) {
				const segment = segments[j];
				switch (segment) {
					case 'italic':
						fontStyle = fontStyle | FontStyle.Italic;
						break;
					case 'bold':
						fontStyle = fontStyle | FontStyle.Bold;
						break;
					case 'underline':
						fontStyle = fontStyle | FontStyle.Underline;
						break;
					case 'strikethrough':
						fontStyle = fontStyle | FontStyle.Strikethrough;
						break;
				}
			}
		}

		let foreground: string | null = null;
		if (typeof entry.foreground === 'string') {
			foreground = entry.foreground;
		}

		let background: string | null = null;
		if (typeof entry.background === 'string') {
			background = entry.background;
		}

		result[resultLen++] = new ParsedTokenThemeRule(
			entry.token || '',
			i,
			fontStyle,
			foreground,
			background
		);
	}

	return result;
}

/**
 * Resolve rules (i.e. inheritance).
 */
function resolveParsedTokenThemeRules(parsedThemeRules: ParsedTokenThemeRule[], customTokenColors: string[]): TokenTheme {

	// Sort rules lexicographically, and then by index if necessary
	parsedThemeRules.sort((a, b) => {
		const r = strcmp(a.token, b.token);
		if (r !== 0) {
			return r;
		}
		return a.index - b.index;
	});

	// Determine defaults
	let defaultFontStyle = FontStyle.None;
	let defaultForeground = '000000';
	let defaultBackground = 'ffffff';
	while (parsedThemeRules.length >= 1 && parsedThemeRules[0].token === '') {
		const incomingDefaults = parsedThemeRules.shift()!;
		if (incomingDefaults.fontStyle !== FontStyle.NotSet) {
			defaultFontStyle = incomingDefaults.fontStyle;
		}
		if (incomingDefaults.foreground !== null) {
			defaultForeground = incomingDefaults.foreground;
		}
		if (incomingDefaults.background !== null) {
			defaultBackground = incomingDefaults.background;
		}
	}
	const colorMap = new ColorMap();

	// start with token colors from custom token themes
	for (const color of customTokenColors) {
		colorMap.getId(color);
	}


	const foregroundColorId = colorMap.getId(defaultForeground);
	const backgroundColorId = colorMap.getId(defaultBackground);

	const defaults = new ThemeTrieElementRule(defaultFontStyle, foregroundColorId, backgroundColorId);
	const root = new ThemeTrieElement(defaults);
	for (let i = 0, len = parsedThemeRules.length; i < len; i++) {
		const rule = parsedThemeRules[i];
		root.insert(rule.token, rule.fontStyle, colorMap.getId(rule.foreground), colorMap.getId(rule.background));
	}

	return new TokenTheme(colorMap, root);
}

const colorRegExp = /^#?([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})?$/;

export class ColorMap {

	private _lastColorId: number;
	private readonly _id2color: Color[];
	private readonly _color2id: Map<string, ColorId>;

	constructor() {
		this._lastColorId = 0;
		this._id2color = [];
		this._color2id = new Map<string, ColorId>();
	}

	public getId(color: string | null): ColorId {
		if (color === null) {
			return 0;
		}
		const match = color.match(colorRegExp);
		if (!match) {
			throw new Error('Illegal value for token color: ' + color);
		}
		color = match[1].toUpperCase();
		let value = this._color2id.get(color);
		if (value) {
			return value;
		}
		value = ++this._lastColorId;
		this._color2id.set(color, value);
		this._id2color[value] = Color.fromHex('#' + color);
		return value;
	}

	public getColorMap(): Color[] {
		return this._id2color.slice(0);
	}

}

export class TokenTheme {

	public static createFromRawTokenTheme(source: ITokenThemeRule[], customTokenColors: string[]): TokenTheme {
		return this.createFromParsedTokenTheme(parseTokenTheme(source), customTokenColors);
	}

	public static createFromParsedTokenTheme(source: ParsedTokenThemeRule[], customTokenColors: string[]): TokenTheme {
		return resolveParsedTokenThemeRules(source, customTokenColors);
	}

	private readonly _colorMap: ColorMap;
	private readonly _root: ThemeTrieElement;
	private readonly _cache: Map<string, number>;

	constructor(colorMap: ColorMap, root: ThemeTrieElement) {
		this._colorMap = colorMap;
		this._root = root;
		this._cache = new Map<string, number>();
	}

	public getColorMap(): Color[] {
		return this._colorMap.getColorMap();
	}

	/**
	 * used for testing purposes
	 */
	public getThemeTrieElement(): ExternalThemeTrieElement {
		return this._root.toExternalThemeTrieElement();
	}

	public _match(token: string): ThemeTrieElementRule {
		return this._root.match(token);
	}

	public match(languageId: LanguageId, token: string): number {
		// The cache contains the metadata without the language bits set.
		let result = this._cache.get(token);
		if (typeof result === 'undefined') {
			const rule = this._match(token);
			const standardToken = toStandardTokenType(token);
			result = (
				rule.metadata
				| (standardToken << MetadataConsts.TOKEN_TYPE_OFFSET)
			) >>> 0;
			this._cache.set(token, result);
		}

		return (
			result
			| (languageId << MetadataConsts.LANGUAGEID_OFFSET)
		) >>> 0;
	}
}

const STANDARD_TOKEN_TYPE_REGEXP = /\b(comment|string|regex|regexp)\b/;
export function toStandardTokenType(tokenType: string): StandardTokenType {
	const m = tokenType.match(STANDARD_TOKEN_TYPE_REGEXP);
	if (!m) {
		return StandardTokenType.Other;
	}
	switch (m[1]) {
		case 'comment':
			return StandardTokenType.Comment;
		case 'string':
			return StandardTokenType.String;
		case 'regex':
			return StandardTokenType.RegEx;
		case 'regexp':
			return StandardTokenType.RegEx;
	}
	throw new Error('Unexpected match for standard token type!');
}

export function strcmp(a: string, b: string): number {
	if (a < b) {
		return -1;
	}
	if (a > b) {
		return 1;
	}
	return 0;
}

export class ThemeTrieElementRule {
	_themeTrieElementRuleBrand: void = undefined;

	private _fontStyle: FontStyle;
	private _foreground: ColorId;
	private _background: ColorId;
	public metadata: number;

	constructor(fontStyle: FontStyle, foreground: ColorId, background: ColorId) {
		this._fontStyle = fontStyle;
		this._foreground = foreground;
		this._background = background;
		this.metadata = (
			(this._fontStyle << MetadataConsts.FONT_STYLE_OFFSET)
			| (this._foreground << MetadataConsts.FOREGROUND_OFFSET)
			| (this._background << MetadataConsts.BACKGROUND_OFFSET)
		) >>> 0;
	}

	public clone(): ThemeTrieElementRule {
		return new ThemeTrieElementRule(this._fontStyle, this._foreground, this._background);
	}

	public acceptOverwrite(fontStyle: FontStyle, foreground: ColorId, background: ColorId): void {
		if (fontStyle !== FontStyle.NotSet) {
			this._fontStyle = fontStyle;
		}
		if (foreground !== ColorId.None) {
			this._foreground = foreground;
		}
		if (background !== ColorId.None) {
			this._background = background;
		}
		this.metadata = (
			(this._fontStyle << MetadataConsts.FONT_STYLE_OFFSET)
			| (this._foreground << MetadataConsts.FOREGROUND_OFFSET)
			| (this._background << MetadataConsts.BACKGROUND_OFFSET)
		) >>> 0;
	}
}

export class ExternalThemeTrieElement {

	public readonly mainRule: ThemeTrieElementRule;
	public readonly children: Map<string, ExternalThemeTrieElement>;

	constructor(
		mainRule: ThemeTrieElementRule,
		children: Map<string, ExternalThemeTrieElement> | { [key: string]: ExternalThemeTrieElement } = new Map<string, ExternalThemeTrieElement>()
	) {
		this.mainRule = mainRule;
		if (children instanceof Map) {
			this.children = children;
		} else {
			this.children = new Map<string, ExternalThemeTrieElement>();
			for (const key in children) {
				this.children.set(key, children[key]);
			}
		}
	}
}

export class ThemeTrieElement {
	_themeTrieElementBrand: void = undefined;

	private readonly _mainRule: ThemeTrieElementRule;
	private readonly _children: Map<string, ThemeTrieElement>;

	constructor(mainRule: ThemeTrieElementRule) {
		this._mainRule = mainRule;
		this._children = new Map<string, ThemeTrieElement>();
	}

	/**
	 * used for testing purposes
	 */
	public toExternalThemeTrieElement(): ExternalThemeTrieElement {
		const children = new Map<string, ExternalThemeTrieElement>();
		this._children.forEach((element, index) => {
			children.set(index, element.toExternalThemeTrieElement());
		});
		return new ExternalThemeTrieElement(this._mainRule, children);
	}

	public match(token: string): ThemeTrieElementRule {
		if (token === '') {
			return this._mainRule;
		}

		const dotIndex = token.indexOf('.');
		let head: string;
		let tail: string;
		if (dotIndex === -1) {
			head = token;
			tail = '';
		} else {
			head = token.substring(0, dotIndex);
			tail = token.substring(dotIndex + 1);
		}

		const child = this._children.get(head);
		if (typeof child !== 'undefined') {
			return child.match(tail);
		}

		return this._mainRule;
	}

	public insert(token: string, fontStyle: FontStyle, foreground: ColorId, background: ColorId): void {
		if (token === '') {
			// Merge into the main rule
			this._mainRule.acceptOverwrite(fontStyle, foreground, background);
			return;
		}

		const dotIndex = token.indexOf('.');
		let head: string;
		let tail: string;
		if (dotIndex === -1) {
			head = token;
			tail = '';
		} else {
			head = token.substring(0, dotIndex);
			tail = token.substring(dotIndex + 1);
		}

		let child = this._children.get(head);
		if (typeof child === 'undefined') {
			child = new ThemeTrieElement(this._mainRule.clone());
			this._children.set(head, child);
		}

		child.insert(tail, fontStyle, foreground, background);
	}
}

export function generateTokensCSSForColorMap(colorMap: readonly Color[]): string {
	const rules: string[] = [];
	for (let i = 1, len = colorMap.length; i < len; i++) {
		const color = colorMap[i];
		rules[i] = `.mtk${i} { color: ${color}; }`;
	}
	rules.push('.mtki { font-style: italic; }');
	rules.push('.mtkb { font-weight: bold; }');
	rules.push('.mtku { text-decoration: underline; text-underline-position: under; }');
	rules.push('.mtks { text-decoration: line-through; }');
	rules.push('.mtks.mtku { text-decoration: underline line-through; text-underline-position: under; }');
	return rules.join('\n');
}

export function generateTokensCSSForFontMap(fontMap: readonly IFontTokenOptions[]): string {
	const rules: string[] = [];
	const fonts = new Set<string>();
	for (let i = 1, len = fontMap.length; i < len; i++) {
		const font = fontMap[i];
		if (!font.fontFamily && !font.fontSize) {
			continue;
		}
		const className = classNameForFontTokenDecorations(font.fontFamily ?? '', font.fontSize ?? '');
		if (fonts.has(className)) {
			continue;
		}
		fonts.add(className);
		let rule = `.${className} {`;
		if (font.fontFamily) {
			rule += `font-family: ${font.fontFamily};`;
		}
		if (font.fontSize) {
			rule += `font-size: ${font.fontSize};`;
		}
		rule += `}`;
		rules.push(rule);
	}
	return rules.join('\n');
}

export function classNameForFontTokenDecorations(fontFamily: string, fontSize: string): string {
	return `font-decoration-${fontFamily.toLowerCase()}-${fontSize.toLowerCase()}`;
}
```

--------------------------------------------------------------------------------

````
