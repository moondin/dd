---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 248
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 248 of 552)

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

---[FILE: src/vs/editor/test/common/core/range.test.ts]---
Location: vscode-main/src/vs/editor/test/common/core/range.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';

suite('Editor Core - Range', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('empty range', () => {
		const s = new Range(1, 1, 1, 1);
		assert.strictEqual(s.startLineNumber, 1);
		assert.strictEqual(s.startColumn, 1);
		assert.strictEqual(s.endLineNumber, 1);
		assert.strictEqual(s.endColumn, 1);
		assert.strictEqual(s.isEmpty(), true);
	});

	test('swap start and stop same line', () => {
		const s = new Range(1, 2, 1, 1);
		assert.strictEqual(s.startLineNumber, 1);
		assert.strictEqual(s.startColumn, 1);
		assert.strictEqual(s.endLineNumber, 1);
		assert.strictEqual(s.endColumn, 2);
		assert.strictEqual(s.isEmpty(), false);
	});

	test('swap start and stop', () => {
		const s = new Range(2, 1, 1, 2);
		assert.strictEqual(s.startLineNumber, 1);
		assert.strictEqual(s.startColumn, 2);
		assert.strictEqual(s.endLineNumber, 2);
		assert.strictEqual(s.endColumn, 1);
		assert.strictEqual(s.isEmpty(), false);
	});

	test('no swap same line', () => {
		const s = new Range(1, 1, 1, 2);
		assert.strictEqual(s.startLineNumber, 1);
		assert.strictEqual(s.startColumn, 1);
		assert.strictEqual(s.endLineNumber, 1);
		assert.strictEqual(s.endColumn, 2);
		assert.strictEqual(s.isEmpty(), false);
	});

	test('no swap', () => {
		const s = new Range(1, 1, 2, 1);
		assert.strictEqual(s.startLineNumber, 1);
		assert.strictEqual(s.startColumn, 1);
		assert.strictEqual(s.endLineNumber, 2);
		assert.strictEqual(s.endColumn, 1);
		assert.strictEqual(s.isEmpty(), false);
	});

	test('compareRangesUsingEnds', () => {
		let a: Range, b: Range;

		a = new Range(1, 1, 1, 3);
		b = new Range(1, 2, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) < 0, 'a.start < b.start, a.end < b.end');

		a = new Range(1, 1, 1, 3);
		b = new Range(1, 1, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) < 0, 'a.start = b.start, a.end < b.end');

		a = new Range(1, 2, 1, 3);
		b = new Range(1, 1, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) < 0, 'a.start > b.start, a.end < b.end');

		a = new Range(1, 1, 1, 4);
		b = new Range(1, 2, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) < 0, 'a.start < b.start, a.end = b.end');

		a = new Range(1, 1, 1, 4);
		b = new Range(1, 1, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) === 0, 'a.start = b.start, a.end = b.end');

		a = new Range(1, 2, 1, 4);
		b = new Range(1, 1, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) > 0, 'a.start > b.start, a.end = b.end');

		a = new Range(1, 1, 1, 5);
		b = new Range(1, 2, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) > 0, 'a.start < b.start, a.end > b.end');

		a = new Range(1, 1, 2, 4);
		b = new Range(1, 1, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) > 0, 'a.start = b.start, a.end > b.end');

		a = new Range(1, 2, 5, 1);
		b = new Range(1, 1, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) > 0, 'a.start > b.start, a.end > b.end');
	});

	test('containsPosition', () => {
		assert.strictEqual(new Range(2, 2, 5, 10).containsPosition(new Position(1, 3)), false);
		assert.strictEqual(new Range(2, 2, 5, 10).containsPosition(new Position(2, 1)), false);
		assert.strictEqual(new Range(2, 2, 5, 10).containsPosition(new Position(2, 2)), true);
		assert.strictEqual(new Range(2, 2, 5, 10).containsPosition(new Position(2, 3)), true);
		assert.strictEqual(new Range(2, 2, 5, 10).containsPosition(new Position(3, 1)), true);
		assert.strictEqual(new Range(2, 2, 5, 10).containsPosition(new Position(5, 9)), true);
		assert.strictEqual(new Range(2, 2, 5, 10).containsPosition(new Position(5, 10)), true);
		assert.strictEqual(new Range(2, 2, 5, 10).containsPosition(new Position(5, 11)), false);
		assert.strictEqual(new Range(2, 2, 5, 10).containsPosition(new Position(6, 1)), false);
	});

	test('containsRange', () => {
		assert.strictEqual(new Range(2, 2, 5, 10).containsRange(new Range(1, 3, 2, 2)), false);
		assert.strictEqual(new Range(2, 2, 5, 10).containsRange(new Range(2, 1, 2, 2)), false);
		assert.strictEqual(new Range(2, 2, 5, 10).containsRange(new Range(2, 2, 5, 11)), false);
		assert.strictEqual(new Range(2, 2, 5, 10).containsRange(new Range(2, 2, 6, 1)), false);
		assert.strictEqual(new Range(2, 2, 5, 10).containsRange(new Range(5, 9, 6, 1)), false);
		assert.strictEqual(new Range(2, 2, 5, 10).containsRange(new Range(5, 10, 6, 1)), false);
		assert.strictEqual(new Range(2, 2, 5, 10).containsRange(new Range(2, 2, 5, 10)), true);
		assert.strictEqual(new Range(2, 2, 5, 10).containsRange(new Range(2, 3, 5, 9)), true);
		assert.strictEqual(new Range(2, 2, 5, 10).containsRange(new Range(3, 100, 4, 100)), true);
	});

	test('areIntersecting', () => {
		assert.strictEqual(Range.areIntersecting(new Range(2, 2, 3, 2), new Range(4, 2, 5, 2)), false);
		assert.strictEqual(Range.areIntersecting(new Range(4, 2, 5, 2), new Range(2, 2, 3, 2)), false);
		assert.strictEqual(Range.areIntersecting(new Range(4, 2, 5, 2), new Range(5, 2, 6, 2)), false);
		assert.strictEqual(Range.areIntersecting(new Range(5, 2, 6, 2), new Range(4, 2, 5, 2)), false);
		assert.strictEqual(Range.areIntersecting(new Range(2, 2, 2, 7), new Range(2, 4, 2, 6)), true);
		assert.strictEqual(Range.areIntersecting(new Range(2, 2, 2, 7), new Range(2, 4, 2, 9)), true);
		assert.strictEqual(Range.areIntersecting(new Range(2, 4, 2, 9), new Range(2, 2, 2, 7)), true);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/core/stringBuilder.test.ts]---
Location: vscode-main/src/vs/editor/test/common/core/stringBuilder.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { writeUInt16LE } from '../../../../base/common/buffer.js';
import { CharCode } from '../../../../base/common/charCode.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { decodeUTF16LE, StringBuilder } from '../../../common/core/stringBuilder.js';

suite('decodeUTF16LE', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('issue #118041: unicode character undo bug 1', () => {
		const buff = new Uint8Array(2);
		writeUInt16LE(buff, '﻿'.charCodeAt(0), 0);
		const actual = decodeUTF16LE(buff, 0, 1);
		assert.deepStrictEqual(actual, '﻿');
	});

	test('issue #118041: unicode character undo bug 2', () => {
		const buff = new Uint8Array(4);
		writeUInt16LE(buff, 'a﻿'.charCodeAt(0), 0);
		writeUInt16LE(buff, 'a﻿'.charCodeAt(1), 2);
		const actual = decodeUTF16LE(buff, 0, 2);
		assert.deepStrictEqual(actual, 'a﻿');
	});

	test('issue #118041: unicode character undo bug 3', () => {
		const buff = new Uint8Array(6);
		writeUInt16LE(buff, 'a﻿b'.charCodeAt(0), 0);
		writeUInt16LE(buff, 'a﻿b'.charCodeAt(1), 2);
		writeUInt16LE(buff, 'a﻿b'.charCodeAt(2), 4);
		const actual = decodeUTF16LE(buff, 0, 3);
		assert.deepStrictEqual(actual, 'a﻿b');
	});

});

suite('StringBuilder', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('basic', () => {
		const sb = new StringBuilder(100);
		sb.appendASCIICharCode(CharCode.A);
		sb.appendASCIICharCode(CharCode.Space);
		sb.appendString('😊');
		assert.strictEqual(sb.build(), 'A 😊');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/core/stringEdit.test.ts]---
Location: vscode-main/src/vs/editor/test/common/core/stringEdit.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Random } from './random.js';
import { StringEdit, StringReplacement } from '../../../common/core/edits/stringEdit.js';
import { OffsetRange } from '../../../common/core/ranges/offsetRange.js';
import { ArrayEdit, ArrayReplacement } from '../../../common/core/edits/arrayEdit.js';

suite('Edit', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	suite('StringEdit', () => {
		test('basic', () => {
			const arr = '0123456789';
			const edit = StringEdit.replace(new OffsetRange(4, 6), 'xyz');
			const result = edit.apply(arr);
			assert.deepStrictEqual(result, '0123xyz6789');
		});

		test('inverse', () => {
			for (let i = 0; i < 1000; i++) {
				test('case' + i, () => {
					runTest(i);
				});
			}

			test.skip('fuzz', () => {
				for (let i = 0; i < 1_000_000; i++) {
					runTest(i);
				}
			});

			function runTest(seed: number) {
				const rng = Random.create(seed);

				const s0 = 'abcde\nfghij\nklmno\npqrst\n';

				const e = getRandomEdit(s0, rng.nextIntRange(1, 4), rng);
				const eInv = e.inverse(s0);

				assert.strictEqual(eInv.apply(e.apply(s0)), s0);
			}
		});

		suite('compose', () => {
			for (let i = 0; i < 1000; i++) {
				test('case' + i, () => {
					runTest(i);
				});
			}

			test.skip('fuzz', () => {
				for (let i = 0; i < 1_000_000; i++) {
					runTest(i);
				}
			});

			function runTest(seed: number) {
				const rng = Random.create(seed);

				const s0 = 'abcde\nfghij\nklmno\npqrst\n';

				const edits1 = getRandomEdit(s0, rng.nextIntRange(1, 4), rng);
				const s1 = edits1.apply(s0);

				const edits2 = getRandomEdit(s1, rng.nextIntRange(1, 4), rng);
				const s2 = edits2.apply(s1);

				const combinedEdits = edits1.compose(edits2);
				const s2C = combinedEdits.apply(s0);

				assert.strictEqual(s2C, s2);
			}
		});

		test('equals', () => {
			const edit1 = StringEdit.replace(new OffsetRange(4, 6), 'xyz');
			const edit2 = StringEdit.replace(new OffsetRange(4, 6), 'xyz');
			const edit3 = StringEdit.replace(new OffsetRange(5, 6), 'xyz');
			const edit4 = StringEdit.replace(new OffsetRange(4, 6), 'xy');

			assert.ok(edit1.equals(edit1));
			assert.ok(edit1.equals(edit2));
			assert.ok(edit2.equals(edit1));

			assert.ok(!edit1.equals(edit3));
			assert.ok(!edit1.equals(edit4));
		});

		test('getNewRanges', () => {
			const edit = StringEdit.create([
				new StringReplacement(new OffsetRange(4, 6), 'abcde'),
				new StringReplacement(new OffsetRange(7, 9), 'a'),
			]);
			const ranges = edit.getNewRanges();
			assert.deepStrictEqual(ranges, [
				new OffsetRange(4, 9),
				new OffsetRange(10, 11),
			]);
		});

		test('getJoinedReplaceRange', () => {
			const edit = StringEdit.create([
				new StringReplacement(new OffsetRange(4, 6), 'abcde'),
				new StringReplacement(new OffsetRange(7, 9), 'a'),
			]);
			const range = edit.getJoinedReplaceRange();
			assert.deepStrictEqual(range, new OffsetRange(4, 9));
		});

		test('getLengthDelta', () => {
			const edit = StringEdit.create([
				new StringReplacement(new OffsetRange(4, 6), 'abcde'),
				new StringReplacement(new OffsetRange(7, 9), 'a'),
			]);
			const delta = edit.getLengthDelta();
			assert.strictEqual(delta, 2);
			assert.strictEqual(edit.replacements[0].getLengthDelta(), 3);
			assert.strictEqual(edit.replacements[1].getLengthDelta(), -1);
		});
	});

	suite('ArrayEdit', () => {
		test('basic', () => {
			const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
			const edit = ArrayEdit.replace(new OffsetRange(4, 6), ['x', 'y', 'z']);
			const result = edit.apply(arr);
			assert.deepStrictEqual(result, ['0', '1', '2', '3', 'x', 'y', 'z', '6', '7', '8', '9']);
		});

		suite('compose', () => {
			for (let i = 0; i < 100; i++) {
				test('case' + i, () => {
					runTest(i);
				});
			}

			function runTest(seed: number) {
				const rng = Random.create(seed);

				const s0 = 'abcde\nfghij\nklmno\npqrst\n';

				const e1 = getRandomEdit(s0, rng.nextIntRange(1, 4), rng);
				const s1 = e1.apply(s0);

				const e2 = getRandomEdit(s1, rng.nextIntRange(1, 4), rng);

				const ae1 = ArrayEdit.create(e1.replacements.map(r => new ArrayReplacement(r.replaceRange, [...r.newText])));
				const ae2 = ArrayEdit.create(e2.replacements.map(r => new ArrayReplacement(r.replaceRange, [...r.newText])));
				const as0 = [...s0];
				const as1 = ae1.apply(as0);
				const as2 = ae2.apply(as1);
				const aCombinedEdits = ae1.compose(ae2);

				const as2C = aCombinedEdits.apply(as0);
				assert.deepStrictEqual(as2, as2C);
			}
		});
	});


	function getRandomEdit(str: string, count: number, rng: Random): StringEdit {
		const edits: StringReplacement[] = [];
		let i = 0;
		for (let j = 0; j < count; j++) {
			if (i >= str.length) {
				break;
			}
			edits.push(getRandomSingleEdit(str, i, rng));
			i = edits[j].replaceRange.endExclusive + 1;
		}
		return StringEdit.create(edits);
	}

	function getRandomSingleEdit(str: string, rangeOffsetStart: number, rng: Random): StringReplacement {
		const offsetStart = rng.nextIntRange(rangeOffsetStart, str.length);
		const offsetEnd = rng.nextIntRange(offsetStart, str.length);

		const textStart = rng.nextIntRange(0, str.length);
		const textLen = rng.nextIntRange(0, Math.min(7, str.length - textStart));

		return new StringReplacement(
			new OffsetRange(offsetStart, offsetEnd),
			str.substring(textStart, textStart + textLen)
		);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/core/testLineToken.ts]---
Location: vscode-main/src/vs/editor/test/common/core/testLineToken.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IViewLineTokens } from '../../../common/tokens/lineTokens.js';
import { ColorId, TokenMetadata, ITokenPresentation, StandardTokenType } from '../../../common/encodedTokenAttributes.js';
import { ILanguageIdCodec } from '../../../common/languages.js';

/**
 * A token on a line.
 */
export class TestLineToken {

	/**
	 * last char index of this token (not inclusive).
	 */
	public readonly endIndex: number;
	private readonly _metadata: number;

	constructor(endIndex: number, metadata: number) {
		this.endIndex = endIndex;
		this._metadata = metadata;
	}

	public getStandardTokenType(): StandardTokenType {
		return TokenMetadata.getTokenType(this._metadata);
	}

	public getForeground(): ColorId {
		return TokenMetadata.getForeground(this._metadata);
	}

	public getType(): string {
		return TokenMetadata.getClassNameFromMetadata(this._metadata);
	}

	public getInlineStyle(colorMap: string[]): string {
		return TokenMetadata.getInlineStyleFromMetadata(this._metadata, colorMap);
	}

	public getPresentation(): ITokenPresentation {
		return TokenMetadata.getPresentationFromMetadata(this._metadata);
	}

	private static _equals(a: TestLineToken, b: TestLineToken): boolean {
		return (
			a.endIndex === b.endIndex
			&& a._metadata === b._metadata
		);
	}

	public static equalsArr(a: TestLineToken[], b: TestLineToken[]): boolean {
		const aLen = a.length;
		const bLen = b.length;
		if (aLen !== bLen) {
			return false;
		}
		for (let i = 0; i < aLen; i++) {
			if (!this._equals(a[i], b[i])) {
				return false;
			}
		}
		return true;
	}
}

export class TestLineTokens implements IViewLineTokens {

	private readonly _actual: TestLineToken[];

	constructor(actual: TestLineToken[]) {
		this._actual = actual;
	}

	public equals(other: IViewLineTokens): boolean {
		if (other instanceof TestLineTokens) {
			return TestLineToken.equalsArr(this._actual, other._actual);
		}
		return false;
	}

	public getCount(): number {
		return this._actual.length;
	}

	public getStandardTokenType(tokenIndex: number): StandardTokenType {
		return this._actual[tokenIndex].getStandardTokenType();
	}

	public getForeground(tokenIndex: number): ColorId {
		return this._actual[tokenIndex].getForeground();
	}

	public getEndOffset(tokenIndex: number): number {
		return this._actual[tokenIndex].endIndex;
	}

	public getClassName(tokenIndex: number): string {
		return this._actual[tokenIndex].getType();
	}

	public getInlineStyle(tokenIndex: number, colorMap: string[]): string {
		return this._actual[tokenIndex].getInlineStyle(colorMap);
	}

	public getPresentation(tokenIndex: number): ITokenPresentation {
		return this._actual[tokenIndex].getPresentation();
	}

	public findTokenIndexAtOffset(offset: number): number {
		throw new Error('Not implemented');
	}

	public getLineContent(): string {
		throw new Error('Not implemented');
	}

	public getMetadata(tokenIndex: number): number {
		throw new Error('Method not implemented.');
	}

	public getLanguageId(tokenIndex: number): string {
		throw new Error('Method not implemented.');
	}

	public getTokenText(tokenIndex: number): string {
		throw new Error('Method not implemented.');
	}

	public forEach(callback: (tokenIndex: number) => void): void {
		throw new Error('Not implemented');
	}

	public get languageIdCodec(): ILanguageIdCodec {
		throw new Error('Not implemented');
	}
}

export class TestLineTokenFactory {

	public static inflateArr(tokens: Uint32Array): TestLineToken[] {
		const tokensCount = (tokens.length >>> 1);

		const result: TestLineToken[] = new Array<TestLineToken>(tokensCount);
		for (let i = 0; i < tokensCount; i++) {
			const endOffset = tokens[i << 1];
			const metadata = tokens[(i << 1) + 1];

			result[i] = new TestLineToken(endOffset, metadata);
		}

		return result;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/core/textEdit.test.ts]---
Location: vscode-main/src/vs/editor/test/common/core/textEdit.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { OffsetRange } from '../../../common/core/ranges/offsetRange.js';
import { StringText } from '../../../common/core/text/abstractText.js';
import { Random } from './random.js';

suite('TextEdit', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('inverse', () => {
		function runTest(seed: number): void {
			const rand = Random.create(seed);
			const source = new StringText(rand.nextMultiLineString(10, new OffsetRange(0, 10)));

			const edit = rand.nextTextEdit(source, rand.nextIntRange(1, 5));
			const invEdit = edit.inverse(source);

			const s1 = edit.apply(source);
			const s2 = invEdit.applyToString(s1);

			assert.deepStrictEqual(s2, source.value);
		}

		test.skip('brute-force', () => {
			for (let i = 0; i < 100_000; i++) {
				runTest(i);
			}
		});

		for (let seed = 0; seed < 20; seed++) {
			test(`test ${seed}`, () => runTest(seed));
		}
	});

	suite('compose', () => {
		function runTest(seed: number): void {
			const rand = Random.create(seed);

			const s0 = new StringText(rand.nextMultiLineString(10, new OffsetRange(0, 10)));

			const edits1 = rand.nextTextEdit(s0, rand.nextIntRange(1, 4));
			const s1 = edits1.applyToString(s0.value);

			const s1Text = new StringText(s1);
			const edits2 = rand.nextTextEdit(s1Text, rand.nextIntRange(1, 4));
			const s2 = edits2.applyToString(s1);

			const combinedEdits = edits1.compose(edits2);
			const s2C = combinedEdits.applyToString(s0.value);
			assert.strictEqual(s2C, s2);
		}

		test.skip('fuzz', function () {
			this.timeout(0);
			for (let i = 0; i < 1_000_000; i++) {
				runTest(i);
			}
		});

		for (let seed = 0; seed < 100; seed++) {
			test(`case ${seed}`, () => runTest(seed));
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/diff/diffComputer.test.ts]---
Location: vscode-main/src/vs/editor/test/common/diff/diffComputer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { Constants } from '../../../../base/common/uint.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Range } from '../../../common/core/range.js';
import { DiffComputer, ICharChange, ILineChange } from '../../../common/diff/legacyLinesDiffComputer.js';
import { IIdentifiedSingleEditOperation, ITextModel } from '../../../common/model.js';
import { createTextModel } from '../testTextModel.js';

function assertDiff(originalLines: string[], modifiedLines: string[], expectedChanges: ILineChange[], shouldComputeCharChanges: boolean = true, shouldPostProcessCharChanges: boolean = false, shouldIgnoreTrimWhitespace: boolean = false) {
	const diffComputer = new DiffComputer(originalLines, modifiedLines, {
		shouldComputeCharChanges,
		shouldPostProcessCharChanges,
		shouldIgnoreTrimWhitespace,
		shouldMakePrettyDiff: true,
		maxComputationTime: 0
	});
	const changes = diffComputer.computeDiff().changes;

	const mapCharChange = (charChange: ICharChange) => {
		return {
			originalStartLineNumber: charChange.originalStartLineNumber,
			originalStartColumn: charChange.originalStartColumn,
			originalEndLineNumber: charChange.originalEndLineNumber,
			originalEndColumn: charChange.originalEndColumn,
			modifiedStartLineNumber: charChange.modifiedStartLineNumber,
			modifiedStartColumn: charChange.modifiedStartColumn,
			modifiedEndLineNumber: charChange.modifiedEndLineNumber,
			modifiedEndColumn: charChange.modifiedEndColumn,
		};
	};

	const actual = changes.map((lineChange) => {
		return {
			originalStartLineNumber: lineChange.originalStartLineNumber,
			originalEndLineNumber: lineChange.originalEndLineNumber,
			modifiedStartLineNumber: lineChange.modifiedStartLineNumber,
			modifiedEndLineNumber: lineChange.modifiedEndLineNumber,
			charChanges: (lineChange.charChanges ? lineChange.charChanges.map(mapCharChange) : undefined)
		};
	});

	assert.deepStrictEqual(actual, expectedChanges);

	if (!shouldIgnoreTrimWhitespace) {
		// The diffs should describe how to apply edits to the original text model to get to the modified text model.

		const modifiedTextModel = createTextModel(modifiedLines.join('\n'));
		const expectedValue = modifiedTextModel.getValue();

		{
			// Line changes:
			const originalTextModel = createTextModel(originalLines.join('\n'));
			originalTextModel.applyEdits(changes.map(c => getLineEdit(c, modifiedTextModel)));
			assert.deepStrictEqual(originalTextModel.getValue(), expectedValue);
			originalTextModel.dispose();
		}

		if (shouldComputeCharChanges) {
			// Char changes:
			const originalTextModel = createTextModel(originalLines.join('\n'));
			originalTextModel.applyEdits(changes.flatMap(c => getCharEdits(c, modifiedTextModel)));
			assert.deepStrictEqual(originalTextModel.getValue(), expectedValue);
			originalTextModel.dispose();
		}

		modifiedTextModel.dispose();
	}
}

function getCharEdits(lineChange: ILineChange, modifiedTextModel: ITextModel): IIdentifiedSingleEditOperation[] {
	if (!lineChange.charChanges) {
		return [getLineEdit(lineChange, modifiedTextModel)];
	}
	return lineChange.charChanges.map(c => {
		const originalRange = new Range(c.originalStartLineNumber, c.originalStartColumn, c.originalEndLineNumber, c.originalEndColumn);
		const modifiedRange = new Range(c.modifiedStartLineNumber, c.modifiedStartColumn, c.modifiedEndLineNumber, c.modifiedEndColumn);
		return {
			range: originalRange,
			text: modifiedTextModel.getValueInRange(modifiedRange)
		};
	});
}

function getLineEdit(lineChange: ILineChange, modifiedTextModel: ITextModel): IIdentifiedSingleEditOperation {
	let originalRange: LineRange;
	if (lineChange.originalEndLineNumber === 0) {
		// Insertion
		originalRange = new LineRange(lineChange.originalStartLineNumber + 1, 0);
	} else {
		originalRange = new LineRange(lineChange.originalStartLineNumber, lineChange.originalEndLineNumber - lineChange.originalStartLineNumber + 1);
	}

	let modifiedRange: LineRange;
	if (lineChange.modifiedEndLineNumber === 0) {
		// Deletion
		modifiedRange = new LineRange(lineChange.modifiedStartLineNumber + 1, 0);
	} else {
		modifiedRange = new LineRange(lineChange.modifiedStartLineNumber, lineChange.modifiedEndLineNumber - lineChange.modifiedStartLineNumber + 1);
	}

	const [r1, r2] = diffFromLineRanges(originalRange, modifiedRange);
	return {
		range: r1,
		text: modifiedTextModel.getValueInRange(r2),
	};
}

function diffFromLineRanges(originalRange: LineRange, modifiedRange: LineRange): [Range, Range] {
	if (originalRange.startLineNumber === 1 || modifiedRange.startLineNumber === 1) {
		if (!originalRange.isEmpty && !modifiedRange.isEmpty) {
			return [
				new Range(
					originalRange.startLineNumber,
					1,
					originalRange.endLineNumberExclusive - 1,
					Constants.MAX_SAFE_SMALL_INTEGER,
				),
				new Range(
					modifiedRange.startLineNumber,
					1,
					modifiedRange.endLineNumberExclusive - 1,
					Constants.MAX_SAFE_SMALL_INTEGER,
				)
			];
		}

		// When one of them is one and one of them is empty, the other cannot be the last line of the document
		return [
			new Range(
				originalRange.startLineNumber,
				1,
				originalRange.endLineNumberExclusive,
				1,
			),
			new Range(
				modifiedRange.startLineNumber,
				1,
				modifiedRange.endLineNumberExclusive,
				1,
			)
		];
	}

	return [
		new Range(
			originalRange.startLineNumber - 1,
			Constants.MAX_SAFE_SMALL_INTEGER,
			originalRange.endLineNumberExclusive - 1,
			Constants.MAX_SAFE_SMALL_INTEGER,
		),
		new Range(
			modifiedRange.startLineNumber - 1,
			Constants.MAX_SAFE_SMALL_INTEGER,
			modifiedRange.endLineNumberExclusive - 1,
			Constants.MAX_SAFE_SMALL_INTEGER,
		)
	];
}

class LineRange {
	public constructor(
		public readonly startLineNumber: number,
		public readonly lineCount: number
	) { }

	public get isEmpty(): boolean {
		return this.lineCount === 0;
	}

	public get endLineNumberExclusive(): number {
		return this.startLineNumber + this.lineCount;
	}
}

function createLineDeletion(startLineNumber: number, endLineNumber: number, modifiedLineNumber: number): ILineChange {
	return {
		originalStartLineNumber: startLineNumber,
		originalEndLineNumber: endLineNumber,
		modifiedStartLineNumber: modifiedLineNumber,
		modifiedEndLineNumber: 0,
		charChanges: undefined
	};
}

function createLineInsertion(startLineNumber: number, endLineNumber: number, originalLineNumber: number): ILineChange {
	return {
		originalStartLineNumber: originalLineNumber,
		originalEndLineNumber: 0,
		modifiedStartLineNumber: startLineNumber,
		modifiedEndLineNumber: endLineNumber,
		charChanges: undefined
	};
}

function createLineChange(originalStartLineNumber: number, originalEndLineNumber: number, modifiedStartLineNumber: number, modifiedEndLineNumber: number, charChanges?: ICharChange[]): ILineChange {
	return {
		originalStartLineNumber: originalStartLineNumber,
		originalEndLineNumber: originalEndLineNumber,
		modifiedStartLineNumber: modifiedStartLineNumber,
		modifiedEndLineNumber: modifiedEndLineNumber,
		charChanges: charChanges
	};
}

function createCharChange(
	originalStartLineNumber: number, originalStartColumn: number, originalEndLineNumber: number, originalEndColumn: number,
	modifiedStartLineNumber: number, modifiedStartColumn: number, modifiedEndLineNumber: number, modifiedEndColumn: number
) {
	return {
		originalStartLineNumber: originalStartLineNumber,
		originalStartColumn: originalStartColumn,
		originalEndLineNumber: originalEndLineNumber,
		originalEndColumn: originalEndColumn,
		modifiedStartLineNumber: modifiedStartLineNumber,
		modifiedStartColumn: modifiedStartColumn,
		modifiedEndLineNumber: modifiedEndLineNumber,
		modifiedEndColumn: modifiedEndColumn
	};
}

suite('Editor Diff - DiffComputer', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	// ---- insertions

	test('one inserted line below', () => {
		const original = ['line'];
		const modified = ['line', 'new line'];
		const expected = [createLineInsertion(2, 2, 1)];
		assertDiff(original, modified, expected);
	});

	test('two inserted lines below', () => {
		const original = ['line'];
		const modified = ['line', 'new line', 'another new line'];
		const expected = [createLineInsertion(2, 3, 1)];
		assertDiff(original, modified, expected);
	});

	test('one inserted line above', () => {
		const original = ['line'];
		const modified = ['new line', 'line'];
		const expected = [createLineInsertion(1, 1, 0)];
		assertDiff(original, modified, expected);
	});

	test('two inserted lines above', () => {
		const original = ['line'];
		const modified = ['new line', 'another new line', 'line'];
		const expected = [createLineInsertion(1, 2, 0)];
		assertDiff(original, modified, expected);
	});

	test('one inserted line in middle', () => {
		const original = ['line1', 'line2', 'line3', 'line4'];
		const modified = ['line1', 'line2', 'new line', 'line3', 'line4'];
		const expected = [createLineInsertion(3, 3, 2)];
		assertDiff(original, modified, expected);
	});

	test('two inserted lines in middle', () => {
		const original = ['line1', 'line2', 'line3', 'line4'];
		const modified = ['line1', 'line2', 'new line', 'another new line', 'line3', 'line4'];
		const expected = [createLineInsertion(3, 4, 2)];
		assertDiff(original, modified, expected);
	});

	test('two inserted lines in middle interrupted', () => {
		const original = ['line1', 'line2', 'line3', 'line4'];
		const modified = ['line1', 'line2', 'new line', 'line3', 'another new line', 'line4'];
		const expected = [createLineInsertion(3, 3, 2), createLineInsertion(5, 5, 3)];
		assertDiff(original, modified, expected);
	});

	// ---- deletions

	test('one deleted line below', () => {
		const original = ['line', 'new line'];
		const modified = ['line'];
		const expected = [createLineDeletion(2, 2, 1)];
		assertDiff(original, modified, expected);
	});

	test('two deleted lines below', () => {
		const original = ['line', 'new line', 'another new line'];
		const modified = ['line'];
		const expected = [createLineDeletion(2, 3, 1)];
		assertDiff(original, modified, expected);
	});

	test('one deleted lines above', () => {
		const original = ['new line', 'line'];
		const modified = ['line'];
		const expected = [createLineDeletion(1, 1, 0)];
		assertDiff(original, modified, expected);
	});

	test('two deleted lines above', () => {
		const original = ['new line', 'another new line', 'line'];
		const modified = ['line'];
		const expected = [createLineDeletion(1, 2, 0)];
		assertDiff(original, modified, expected);
	});

	test('one deleted line in middle', () => {
		const original = ['line1', 'line2', 'new line', 'line3', 'line4'];
		const modified = ['line1', 'line2', 'line3', 'line4'];
		const expected = [createLineDeletion(3, 3, 2)];
		assertDiff(original, modified, expected);
	});

	test('two deleted lines in middle', () => {
		const original = ['line1', 'line2', 'new line', 'another new line', 'line3', 'line4'];
		const modified = ['line1', 'line2', 'line3', 'line4'];
		const expected = [createLineDeletion(3, 4, 2)];
		assertDiff(original, modified, expected);
	});

	test('two deleted lines in middle interrupted', () => {
		const original = ['line1', 'line2', 'new line', 'line3', 'another new line', 'line4'];
		const modified = ['line1', 'line2', 'line3', 'line4'];
		const expected = [createLineDeletion(3, 3, 2), createLineDeletion(5, 5, 3)];
		assertDiff(original, modified, expected);
	});

	// ---- changes

	test('one line changed: chars inserted at the end', () => {
		const original = ['line'];
		const modified = ['line changed'];
		const expected = [
			createLineChange(1, 1, 1, 1, [
				createCharChange(1, 5, 1, 5, 1, 5, 1, 13)
			])
		];
		assertDiff(original, modified, expected);
	});

	test('one line changed: chars inserted at the beginning', () => {
		const original = ['line'];
		const modified = ['my line'];
		const expected = [
			createLineChange(1, 1, 1, 1, [
				createCharChange(1, 1, 1, 1, 1, 1, 1, 4)
			])
		];
		assertDiff(original, modified, expected);
	});

	test('one line changed: chars inserted in the middle', () => {
		const original = ['abba'];
		const modified = ['abzzba'];
		const expected = [
			createLineChange(1, 1, 1, 1, [
				createCharChange(1, 3, 1, 3, 1, 3, 1, 5)
			])
		];
		assertDiff(original, modified, expected);
	});

	test('one line changed: chars inserted in the middle (two spots)', () => {
		const original = ['abba'];
		const modified = ['abzzbzza'];
		const expected = [
			createLineChange(1, 1, 1, 1, [
				createCharChange(1, 3, 1, 3, 1, 3, 1, 5),
				createCharChange(1, 4, 1, 4, 1, 6, 1, 8)
			])
		];
		assertDiff(original, modified, expected);
	});

	test('one line changed: chars deleted 1', () => {
		const original = ['abcdefg'];
		const modified = ['abcfg'];
		const expected = [
			createLineChange(1, 1, 1, 1, [
				createCharChange(1, 4, 1, 6, 1, 4, 1, 4)
			])
		];
		assertDiff(original, modified, expected);
	});

	test('one line changed: chars deleted 2', () => {
		const original = ['abcdefg'];
		const modified = ['acfg'];
		const expected = [
			createLineChange(1, 1, 1, 1, [
				createCharChange(1, 2, 1, 3, 1, 2, 1, 2),
				createCharChange(1, 4, 1, 6, 1, 3, 1, 3)
			])
		];
		assertDiff(original, modified, expected);
	});

	test('two lines changed 1', () => {
		const original = ['abcd', 'efgh'];
		const modified = ['abcz'];
		const expected = [
			createLineChange(1, 2, 1, 1, [
				createCharChange(1, 4, 2, 5, 1, 4, 1, 5)
			])
		];
		assertDiff(original, modified, expected);
	});

	test('two lines changed 2', () => {
		const original = ['foo', 'abcd', 'efgh', 'BAR'];
		const modified = ['foo', 'abcz', 'BAR'];
		const expected = [
			createLineChange(2, 3, 2, 2, [
				createCharChange(2, 4, 3, 5, 2, 4, 2, 5)
			])
		];
		assertDiff(original, modified, expected);
	});

	test('two lines changed 3', () => {
		const original = ['foo', 'abcd', 'efgh', 'BAR'];
		const modified = ['foo', 'abcz', 'zzzzefgh', 'BAR'];
		const expected = [
			createLineChange(2, 3, 2, 3, [
				createCharChange(2, 4, 2, 5, 2, 4, 2, 5),
				createCharChange(3, 1, 3, 1, 3, 1, 3, 5)
			])
		];
		assertDiff(original, modified, expected);
	});

	test('two lines changed 4', () => {
		const original = ['abc'];
		const modified = ['', '', 'axc', ''];
		const expected = [
			createLineChange(1, 1, 1, 4, [
				createCharChange(1, 1, 1, 1, 1, 1, 3, 1),
				createCharChange(1, 2, 1, 3, 3, 2, 3, 3),
				createCharChange(1, 4, 1, 4, 3, 4, 4, 1)
			])
		];
		assertDiff(original, modified, expected);
	});

	test('empty original sequence in char diff', () => {
		const original = ['abc', '', 'xyz'];
		const modified = ['abc', 'qwe', 'rty', 'xyz'];
		const expected = [
			createLineChange(2, 2, 2, 3)
		];
		assertDiff(original, modified, expected);
	});

	test('three lines changed', () => {
		const original = ['foo', 'abcd', 'efgh', 'BAR'];
		const modified = ['foo', 'zzzefgh', 'xxx', 'BAR'];
		const expected = [
			createLineChange(2, 3, 2, 3, [
				createCharChange(2, 1, 3, 1, 2, 1, 2, 4),
				createCharChange(3, 5, 3, 5, 2, 8, 3, 4),
			])
		];
		assertDiff(original, modified, expected);
	});

	test('big change part 1', () => {
		const original = ['foo', 'abcd', 'efgh', 'BAR'];
		const modified = ['hello', 'foo', 'zzzefgh', 'xxx', 'BAR'];
		const expected = [
			createLineInsertion(1, 1, 0),
			createLineChange(2, 3, 3, 4, [
				createCharChange(2, 1, 3, 1, 3, 1, 3, 4),
				createCharChange(3, 5, 3, 5, 3, 8, 4, 4)
			])
		];
		assertDiff(original, modified, expected);
	});

	test('big change part 2', () => {
		const original = ['foo', 'abcd', 'efgh', 'BAR', 'RAB'];
		const modified = ['hello', 'foo', 'zzzefgh', 'xxx', 'BAR'];
		const expected = [
			createLineInsertion(1, 1, 0),
			createLineChange(2, 3, 3, 4, [
				createCharChange(2, 1, 3, 1, 3, 1, 3, 4),
				createCharChange(3, 5, 3, 5, 3, 8, 4, 4)
			]),
			createLineDeletion(5, 5, 5)
		];
		assertDiff(original, modified, expected);
	});

	test('char change postprocessing merges', () => {
		const original = ['abba'];
		const modified = ['azzzbzzzbzzza'];
		const expected = [
			createLineChange(1, 1, 1, 1, [
				createCharChange(1, 2, 1, 4, 1, 2, 1, 13)
			])
		];
		assertDiff(original, modified, expected, true, true);
	});

	test('ignore trim whitespace', () => {
		const original = ['\t\t foo ', 'abcd', 'efgh', '\t\t BAR\t\t'];
		const modified = ['  hello\t', '\t foo   \t', 'zzzefgh', 'xxx', '   BAR   \t'];
		const expected = [
			createLineInsertion(1, 1, 0),
			createLineChange(2, 3, 3, 4, [
				createCharChange(2, 1, 2, 5, 3, 1, 3, 4),
				createCharChange(3, 5, 3, 5, 4, 1, 4, 4)
			])
		];
		assertDiff(original, modified, expected, true, false, true);
	});

	test('issue #12122 r.hasOwnProperty is not a function', () => {
		const original = ['hasOwnProperty'];
		const modified = ['hasOwnProperty', 'and another line'];
		const expected = [
			createLineInsertion(2, 2, 1)
		];
		assertDiff(original, modified, expected);
	});

	test('empty diff 1', () => {
		const original = [''];
		const modified = ['something'];
		const expected = [
			createLineChange(1, 1, 1, 1, undefined)
		];
		assertDiff(original, modified, expected, true, false, true);
	});

	test('empty diff 2', () => {
		const original = [''];
		const modified = ['something', 'something else'];
		const expected = [
			createLineChange(1, 1, 1, 2, undefined)
		];
		assertDiff(original, modified, expected, true, false, true);
	});

	test('empty diff 3', () => {
		const original = ['something', 'something else'];
		const modified = [''];
		const expected = [
			createLineChange(1, 2, 1, 1, undefined)
		];
		assertDiff(original, modified, expected, true, false, true);
	});

	test('empty diff 4', () => {
		const original = ['something'];
		const modified = [''];
		const expected = [
			createLineChange(1, 1, 1, 1, undefined)
		];
		assertDiff(original, modified, expected, true, false, true);
	});

	test('empty diff 5', () => {
		const original = [''];
		const modified = [''];
		const expected: ILineChange[] = [];
		assertDiff(original, modified, expected, true, false, true);
	});

	test('pretty diff 1', () => {
		const original = [
			'suite(function () {',
			'	test1() {',
			'		assert.ok(true);',
			'	}',
			'',
			'	test2() {',
			'		assert.ok(true);',
			'	}',
			'});',
			'',
		];
		const modified = [
			'// An insertion',
			'suite(function () {',
			'	test1() {',
			'		assert.ok(true);',
			'	}',
			'',
			'	test2() {',
			'		assert.ok(true);',
			'	}',
			'',
			'	test3() {',
			'		assert.ok(true);',
			'	}',
			'});',
			'',
		];
		const expected = [
			createLineInsertion(1, 1, 0),
			createLineInsertion(10, 13, 8)
		];
		assertDiff(original, modified, expected, true, false, true);
	});

	test('pretty diff 2', () => {
		const original = [
			'// Just a comment',
			'',
			'function compute(a, b, c, d) {',
			'	if (a) {',
			'		if (b) {',
			'			if (c) {',
			'				return 5;',
			'			}',
			'		}',
			'		// These next lines will be deleted',
			'		if (d) {',
			'			return -1;',
			'		}',
			'		return 0;',
			'	}',
			'}',
		];
		const modified = [
			'// Here is an inserted line',
			'// and another inserted line',
			'// and another one',
			'// Just a comment',
			'',
			'function compute(a, b, c, d) {',
			'	if (a) {',
			'		if (b) {',
			'			if (c) {',
			'				return 5;',
			'			}',
			'		}',
			'		return 0;',
			'	}',
			'}',
		];
		const expected = [
			createLineInsertion(1, 3, 0),
			createLineDeletion(10, 13, 12),
		];
		assertDiff(original, modified, expected, true, false, true);
	});

	test('pretty diff 3', () => {
		const original = [
			'class A {',
			'	/**',
			'	 * m1',
			'	 */',
			'	method1() {}',
			'',
			'	/**',
			'	 * m3',
			'	 */',
			'	method3() {}',
			'}',
		];
		const modified = [
			'class A {',
			'	/**',
			'	 * m1',
			'	 */',
			'	method1() {}',
			'',
			'	/**',
			'	 * m2',
			'	 */',
			'	method2() {}',
			'',
			'	/**',
			'	 * m3',
			'	 */',
			'	method3() {}',
			'}',
		];
		const expected = [
			createLineInsertion(7, 11, 6)
		];
		assertDiff(original, modified, expected, true, false, true);
	});

	test('issue #23636', () => {
		const original = [
			'if(!TextDrawLoad[playerid])',
			'{',
			'',
			'	TextDrawHideForPlayer(playerid,TD_AppleJob[3]);',
			'	TextDrawHideForPlayer(playerid,TD_AppleJob[4]);',
			'	if(!AppleJobTreesType[AppleJobTreesPlayerNum[playerid]])',
			'	{',
			'		for(new i=0;i<10;i++) if(StatusTD_AppleJobApples[playerid][i]) TextDrawHideForPlayer(playerid,TD_AppleJob[5+i]);',
			'	}',
			'	else',
			'	{',
			'		for(new i=0;i<10;i++) if(StatusTD_AppleJobApples[playerid][i]) TextDrawHideForPlayer(playerid,TD_AppleJob[15+i]);',
			'	}',
			'}',
			'else',
			'{',
			'	TextDrawHideForPlayer(playerid,TD_AppleJob[3]);',
			'	TextDrawHideForPlayer(playerid,TD_AppleJob[27]);',
			'	if(!AppleJobTreesType[AppleJobTreesPlayerNum[playerid]])',
			'	{',
			'		for(new i=0;i<10;i++) if(StatusTD_AppleJobApples[playerid][i]) TextDrawHideForPlayer(playerid,TD_AppleJob[28+i]);',
			'	}',
			'	else',
			'	{',
			'		for(new i=0;i<10;i++) if(StatusTD_AppleJobApples[playerid][i]) TextDrawHideForPlayer(playerid,TD_AppleJob[38+i]);',
			'	}',
			'}',
		];
		const modified = [
			'	if(!TextDrawLoad[playerid])',
			'	{',
			'	',
			'		TextDrawHideForPlayer(playerid,TD_AppleJob[3]);',
			'		TextDrawHideForPlayer(playerid,TD_AppleJob[4]);',
			'		if(!AppleJobTreesType[AppleJobTreesPlayerNum[playerid]])',
			'		{',
			'			for(new i=0;i<10;i++) if(StatusTD_AppleJobApples[playerid][i]) TextDrawHideForPlayer(playerid,TD_AppleJob[5+i]);',
			'		}',
			'		else',
			'		{',
			'			for(new i=0;i<10;i++) if(StatusTD_AppleJobApples[playerid][i]) TextDrawHideForPlayer(playerid,TD_AppleJob[15+i]);',
			'		}',
			'	}',
			'	else',
			'	{',
			'		TextDrawHideForPlayer(playerid,TD_AppleJob[3]);',
			'		TextDrawHideForPlayer(playerid,TD_AppleJob[27]);',
			'		if(!AppleJobTreesType[AppleJobTreesPlayerNum[playerid]])',
			'		{',
			'			for(new i=0;i<10;i++) if(StatusTD_AppleJobApples[playerid][i]) TextDrawHideForPlayer(playerid,TD_AppleJob[28+i]);',
			'		}',
			'		else',
			'		{',
			'			for(new i=0;i<10;i++) if(StatusTD_AppleJobApples[playerid][i]) TextDrawHideForPlayer(playerid,TD_AppleJob[38+i]);',
			'		}',
			'	}',
		];
		const expected = [
			createLineChange(
				1, 27, 1, 27,
				[
					createCharChange(1, 1, 1, 1, 1, 1, 1, 2),
					createCharChange(2, 1, 2, 1, 2, 1, 2, 2),
					createCharChange(3, 1, 3, 1, 3, 1, 3, 2),
					createCharChange(4, 1, 4, 1, 4, 1, 4, 2),
					createCharChange(5, 1, 5, 1, 5, 1, 5, 2),
					createCharChange(6, 1, 6, 1, 6, 1, 6, 2),
					createCharChange(7, 1, 7, 1, 7, 1, 7, 2),
					createCharChange(8, 1, 8, 1, 8, 1, 8, 2),
					createCharChange(9, 1, 9, 1, 9, 1, 9, 2),
					createCharChange(10, 1, 10, 1, 10, 1, 10, 2),
					createCharChange(11, 1, 11, 1, 11, 1, 11, 2),
					createCharChange(12, 1, 12, 1, 12, 1, 12, 2),
					createCharChange(13, 1, 13, 1, 13, 1, 13, 2),
					createCharChange(14, 1, 14, 1, 14, 1, 14, 2),
					createCharChange(15, 1, 15, 1, 15, 1, 15, 2),
					createCharChange(16, 1, 16, 1, 16, 1, 16, 2),
					createCharChange(17, 1, 17, 1, 17, 1, 17, 2),
					createCharChange(18, 1, 18, 1, 18, 1, 18, 2),
					createCharChange(19, 1, 19, 1, 19, 1, 19, 2),
					createCharChange(20, 1, 20, 1, 20, 1, 20, 2),
					createCharChange(21, 1, 21, 1, 21, 1, 21, 2),
					createCharChange(22, 1, 22, 1, 22, 1, 22, 2),
					createCharChange(23, 1, 23, 1, 23, 1, 23, 2),
					createCharChange(24, 1, 24, 1, 24, 1, 24, 2),
					createCharChange(25, 1, 25, 1, 25, 1, 25, 2),
					createCharChange(26, 1, 26, 1, 26, 1, 26, 2),
					createCharChange(27, 1, 27, 1, 27, 1, 27, 2),
				]
			)
			// createLineInsertion(7, 11, 6)
		];
		assertDiff(original, modified, expected, true, true, false);
	});

	test('issue #43922', () => {
		const original = [
			' * `yarn [install]` -- Install project NPM dependencies. This is automatically done when you first create the project. You should only need to run this if you add dependencies in `package.json`.',
		];
		const modified = [
			' * `yarn` -- Install project NPM dependencies. You should only need to run this if you add dependencies in `package.json`.',
		];
		const expected = [
			createLineChange(
				1, 1, 1, 1,
				[
					createCharChange(1, 9, 1, 19, 1, 9, 1, 9),
					createCharChange(1, 58, 1, 120, 1, 48, 1, 48),
				]
			)
		];
		assertDiff(original, modified, expected, true, true, false);
	});

	test('issue #42751', () => {
		const original = [
			'    1',
			'  2',
		];
		const modified = [
			'    1',
			'   3',
		];
		const expected = [
			createLineChange(
				2, 2, 2, 2,
				[
					createCharChange(2, 3, 2, 4, 2, 3, 2, 5)
				]
			)
		];
		assertDiff(original, modified, expected, true, true, false);
	});

	test('does not give character changes', () => {
		const original = [
			'    1',
			'  2',
			'A',
		];
		const modified = [
			'    1',
			'   3',
			' A',
		];
		const expected = [
			createLineChange(
				2, 3, 2, 3
			)
		];
		assertDiff(original, modified, expected, false, false, false);
	});

	test('issue #44422: Less than ideal diff results', () => {
		const original = [
			'export class C {',
			'',
			'	public m1(): void {',
			'		{',
			'		//2',
			'		//3',
			'		//4',
			'		//5',
			'		//6',
			'		//7',
			'		//8',
			'		//9',
			'		//10',
			'		//11',
			'		//12',
			'		//13',
			'		//14',
			'		//15',
			'		//16',
			'		//17',
			'		//18',
			'		}',
			'	}',
			'',
			'	public m2(): void {',
			'		if (a) {',
			'			if (b) {',
			'				//A1',
			'				//A2',
			'				//A3',
			'				//A4',
			'				//A5',
			'				//A6',
			'				//A7',
			'				//A8',
			'			}',
			'		}',
			'',
			'		//A9',
			'		//A10',
			'		//A11',
			'		//A12',
			'		//A13',
			'		//A14',
			'		//A15',
			'	}',
			'',
			'	public m3(): void {',
			'		if (a) {',
			'			//B1',
			'		}',
			'		//B2',
			'		//B3',
			'	}',
			'',
			'	public m4(): boolean {',
			'		//1',
			'		//2',
			'		//3',
			'		//4',
			'	}',
			'',
			'}',
		];
		const modified = [
			'export class C {',
			'',
			'	constructor() {',
			'',
			'',
			'',
			'',
			'	}',
			'',
			'	public m1(): void {',
			'		{',
			'		//2',
			'		//3',
			'		//4',
			'		//5',
			'		//6',
			'		//7',
			'		//8',
			'		//9',
			'		//10',
			'		//11',
			'		//12',
			'		//13',
			'		//14',
			'		//15',
			'		//16',
			'		//17',
			'		//18',
			'		}',
			'	}',
			'',
			'	public m4(): boolean {',
			'		//1',
			'		//2',
			'		//3',
			'		//4',
			'	}',
			'',
			'}',
		];
		const expected = [
			createLineChange(
				2, 0, 3, 9
			),
			createLineChange(
				25, 55, 31, 0
			)
		];
		assertDiff(original, modified, expected, false, false, false);
	});

	test('gives preference to matching longer lines', () => {
		const original = [
			'A',
			'A',
			'BB',
			'C',
		];
		const modified = [
			'A',
			'BB',
			'A',
			'D',
			'E',
			'A',
			'C',
		];
		const expected = [
			createLineChange(
				2, 2, 1, 0
			),
			createLineChange(
				3, 0, 3, 6
			)
		];
		assertDiff(original, modified, expected, false, false, false);
	});

	test('issue #119051: gives preference to fewer diff hunks', () => {
		const original = [
			'1',
			'',
			'',
			'2',
			'',
		];
		const modified = [
			'1',
			'',
			'1.5',
			'',
			'',
			'2',
			'',
			'3',
			'',
		];
		const expected = [
			createLineChange(
				2, 0, 3, 4
			),
			createLineChange(
				5, 0, 8, 9
			)
		];
		assertDiff(original, modified, expected, false, false, false);
	});

	test('issue #121436: Diff chunk contains an unchanged line part 1', () => {
		const original = [
			'if (cond) {',
			'    cmd',
			'}',
		];
		const modified = [
			'if (cond) {',
			'    if (other_cond) {',
			'        cmd',
			'    }',
			'}',
		];
		const expected = [
			createLineChange(
				1, 0, 2, 2
			),
			createLineChange(
				2, 0, 4, 4
			)
		];
		assertDiff(original, modified, expected, false, false, true);
	});

	test('issue #121436: Diff chunk contains an unchanged line part 2', () => {
		const original = [
			'if (cond) {',
			'    cmd',
			'}',
		];
		const modified = [
			'if (cond) {',
			'    if (other_cond) {',
			'        cmd',
			'    }',
			'}',
		];
		const expected = [
			createLineChange(
				1, 0, 2, 2
			),
			createLineChange(
				2, 2, 3, 3
			),
			createLineChange(
				2, 0, 4, 4
			)
		];
		assertDiff(original, modified, expected, false, false, false);
	});

	test('issue #169552: Assertion error when having both leading and trailing whitespace diffs', () => {
		const original = [
			'if True:',
			'    print(2)',
		];
		const modified = [
			'if True:',
			'\tprint(2) ',
		];
		const expected = [
			createLineChange(
				2, 2, 2, 2,
				[
					createCharChange(2, 1, 2, 5, 2, 1, 2, 2),
					createCharChange(2, 13, 2, 13, 2, 10, 2, 11),
				]
			),
		];
		assertDiff(original, modified, expected, true, false, false);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/languages/defaultDocumentColorsComputer.test.ts]---
Location: vscode-main/src/vs/editor/test/common/languages/defaultDocumentColorsComputer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as assert from 'assert';
import { computeDefaultDocumentColors } from '../../../common/languages/defaultDocumentColorsComputer.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('Default Document Colors Computer', () => {

	class TestDocumentModel {
		constructor(private content: string) { }

		getValue(): string {
			return this.content;
		}

		positionAt(offset: number) {
			const lines = this.content.substring(0, offset).split('\n');
			return {
				lineNumber: lines.length,
				column: lines[lines.length - 1].length + 1
			};
		}

		findMatches(regex: RegExp): RegExpMatchArray[] {
			return [...this.content.matchAll(regex)];
		}
	}

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Hex colors in strings should be detected', () => {
		// Test case from issue: hex color inside string is not detected
		const model = new TestDocumentModel(`const color = '#ff0000';`);
		const colors = computeDefaultDocumentColors(model);

		assert.strictEqual(colors.length, 1, 'Should detect one hex color');
		assert.strictEqual(colors[0].color.red, 1, 'Red component should be 1 (255/255)');
		assert.strictEqual(colors[0].color.green, 0, 'Green component should be 0');
		assert.strictEqual(colors[0].color.blue, 0, 'Blue component should be 0');
		assert.strictEqual(colors[0].color.alpha, 1, 'Alpha should be 1');
	});

	test('Hex colors in double quotes should be detected', () => {
		const model = new TestDocumentModel('const color = "#00ff00";');
		const colors = computeDefaultDocumentColors(model);

		assert.strictEqual(colors.length, 1, 'Should detect one hex color');
		assert.strictEqual(colors[0].color.red, 0, 'Red component should be 0');
		assert.strictEqual(colors[0].color.green, 1, 'Green component should be 1 (255/255)');
		assert.strictEqual(colors[0].color.blue, 0, 'Blue component should be 0');
	});

	test('Multiple hex colors in array should be detected', () => {
		const model = new TestDocumentModel(`const colors = ['#ff0000', '#00ff00', '#0000ff'];`);
		const colors = computeDefaultDocumentColors(model);

		assert.strictEqual(colors.length, 3, 'Should detect three hex colors');

		// First color: red
		assert.strictEqual(colors[0].color.red, 1, 'First color red component should be 1');
		assert.strictEqual(colors[0].color.green, 0, 'First color green component should be 0');
		assert.strictEqual(colors[0].color.blue, 0, 'First color blue component should be 0');

		// Second color: green
		assert.strictEqual(colors[1].color.red, 0, 'Second color red component should be 0');
		assert.strictEqual(colors[1].color.green, 1, 'Second color green component should be 1');
		assert.strictEqual(colors[1].color.blue, 0, 'Second color blue component should be 0');

		// Third color: blue
		assert.strictEqual(colors[2].color.red, 0, 'Third color red component should be 0');
		assert.strictEqual(colors[2].color.green, 0, 'Third color green component should be 0');
		assert.strictEqual(colors[2].color.blue, 1, 'Third color blue component should be 1');
	});

	test('Existing functionality should still work', () => {
		// Test cases that were already working
		const testCases = [
			{ content: `const color = ' #ff0000';`, name: 'hex with space before' },
			{ content: '#ff0000', name: 'hex at start of line' },
			{ content: '  #ff0000', name: 'hex with whitespace before' }
		];

		testCases.forEach(testCase => {
			const model = new TestDocumentModel(testCase.content);
			const colors = computeDefaultDocumentColors(model);
			assert.strictEqual(colors.length, 1, `Should still detect ${testCase.name}`);
		});
	});

	test('8-digit hex colors should also work', () => {
		const model = new TestDocumentModel(`const color = '#ff0000ff';`);
		const colors = computeDefaultDocumentColors(model);

		assert.strictEqual(colors.length, 1, 'Should detect one 8-digit hex color');
		assert.strictEqual(colors[0].color.red, 1, 'Red component should be 1');
		assert.strictEqual(colors[0].color.green, 0, 'Green component should be 0');
		assert.strictEqual(colors[0].color.blue, 0, 'Blue component should be 0');
		assert.strictEqual(colors[0].color.alpha, 1, 'Alpha should be 1 (ff/255)');
	});

	test('hsl 100 percent saturation works with decimals', () => {
		const model = new TestDocumentModel('const color = hsl(253, 100.00%, 47.10%);');
		const colors = computeDefaultDocumentColors(model);

		assert.strictEqual(colors.length, 1, 'Should detect one hsl color');
	});

	test('hsl 100 percent saturation works without decimals', () => {
		const model = new TestDocumentModel('const color = hsl(253, 100%, 47.10%);');
		const colors = computeDefaultDocumentColors(model);

		assert.strictEqual(colors.length, 1, 'Should detect one hsl color');
	});

	test('hsl not 100 percent saturation should also work', () => {
		const model = new TestDocumentModel('const color = hsl(0, 83.60%, 47.80%);');
		const colors = computeDefaultDocumentColors(model);

		assert.strictEqual(colors.length, 1, 'Should detect one hsl color');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/annotations.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/annotations.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { AnnotatedString, AnnotationsUpdate, IAnnotation, IAnnotationUpdate } from '../../../common/model/tokens/annotations.js';
import { OffsetRange } from '../../../common/core/ranges/offsetRange.js';
import { StringEdit } from '../../../common/core/edits/stringEdit.js';

// ============================================================================
// Visual Annotation Test Infrastructure
// ============================================================================
// This infrastructure allows representing annotations visually using brackets:
// - '[id:text]' marks an annotation with the given id covering 'text'
// - Plain text represents unannotated content
//
// Example: "Lorem [1:ipsum] dolor [2:sit] amet" represents:
//   - annotation "1" at offset 6-11 (content "ipsum")
//   - annotation "2" at offset 18-21 (content "sit")
//
// For updates:
// - '[id:text]' sets an annotation
// - '<id:text>' deletes an annotation in that range
// ============================================================================

/**
 * Parses a visual string representation into annotations.
 * The visual string uses '[id:text]' to mark annotation boundaries.
 * The id becomes the annotation value, and text is the annotated content.
 */
function parseVisualAnnotations(visual: string): { annotations: IAnnotation<string>[]; baseString: string } {
	const annotations: IAnnotation<string>[] = [];
	let baseString = '';
	let i = 0;

	while (i < visual.length) {
		if (visual[i] === '[') {
			// Find the colon and closing bracket
			const colonIdx = visual.indexOf(':', i + 1);
			const closeIdx = visual.indexOf(']', colonIdx + 1);
			if (colonIdx === -1 || closeIdx === -1) {
				throw new Error(`Invalid annotation format at position ${i}`);
			}
			const id = visual.substring(i + 1, colonIdx);
			const text = visual.substring(colonIdx + 1, closeIdx);
			const startOffset = baseString.length;
			baseString += text;
			annotations.push({ range: new OffsetRange(startOffset, baseString.length), annotation: id });
			i = closeIdx + 1;
		} else {
			baseString += visual[i];
			i++;
		}
	}

	return { annotations, baseString };
}

/**
 * Converts annotations to a visual string representation.
 * Uses '[id:text]' to mark annotation boundaries.
 *
 * @param annotations - The annotations to visualize
 * @param baseString - The base string content
 */
function toVisualString(
	annotations: IAnnotation<string>[],
	baseString: string
): string {
	if (annotations.length === 0) {
		return baseString;
	}

	// Sort annotations by start position
	const sortedAnnotations = [...annotations].sort((a, b) => a.range.start - b.range.start);

	// Build the visual representation
	let result = '';
	let pos = 0;

	for (const ann of sortedAnnotations) {
		// Add plain text before this annotation
		result += baseString.substring(pos, ann.range.start);
		// Add annotated content with id
		const annotatedText = baseString.substring(ann.range.start, ann.range.endExclusive);
		result += `[${ann.annotation}:${annotatedText}]`;
		pos = ann.range.endExclusive;
	}

	// Add remaining text after last annotation
	result += baseString.substring(pos);

	return result;
}

/**
 * Represents an AnnotatedString with its base string for visual testing.
 */
class VisualAnnotatedString {
	constructor(
		public readonly annotatedString: AnnotatedString<string>,
		public baseString: string
	) { }

	setAnnotations(update: AnnotationsUpdate<string>): void {
		this.annotatedString.setAnnotations(update);
	}

	applyEdit(edit: StringEdit): void {
		this.annotatedString.applyEdit(edit);
		this.baseString = edit.apply(this.baseString);
	}

	getAnnotationsIntersecting(range: OffsetRange): IAnnotation<string>[] {
		return this.annotatedString.getAnnotationsIntersecting(range);
	}

	getAllAnnotations(): IAnnotation<string>[] {
		return this.annotatedString.getAllAnnotations();
	}

	clone(): VisualAnnotatedString {
		return new VisualAnnotatedString(this.annotatedString.clone() as AnnotatedString<string>, this.baseString);
	}
}

/**
 * Creates a VisualAnnotatedString from a visual representation.
 */
function fromVisual(visual: string): VisualAnnotatedString {
	const { annotations, baseString } = parseVisualAnnotations(visual);
	return new VisualAnnotatedString(new AnnotatedString<string>(annotations), baseString);
}

/**
 * Converts a VisualAnnotatedString to a visual representation.
 */
function toVisual(vas: VisualAnnotatedString): string {
	return toVisualString(vas.getAllAnnotations(), vas.baseString);
}

/**
 * Parses visual update annotations, where:
 * - '[id:text]' represents an annotation to set
 * - '<id:text>' represents an annotation to delete (range is tracked but annotation is undefined)
 */
function parseVisualUpdate(visual: string): { updates: IAnnotationUpdate<string>[]; baseString: string } {
	const updates: IAnnotationUpdate<string>[] = [];
	let baseString = '';
	let i = 0;

	while (i < visual.length) {
		if (visual[i] === '[') {
			// Set annotation: [id:text]
			const colonIdx = visual.indexOf(':', i + 1);
			const closeIdx = visual.indexOf(']', colonIdx + 1);
			if (colonIdx === -1 || closeIdx === -1) {
				throw new Error(`Invalid annotation format at position ${i}`);
			}
			const id = visual.substring(i + 1, colonIdx);
			const text = visual.substring(colonIdx + 1, closeIdx);
			const startOffset = baseString.length;
			baseString += text;
			updates.push({ range: new OffsetRange(startOffset, baseString.length), annotation: id });
			i = closeIdx + 1;
		} else if (visual[i] === '<') {
			// Delete annotation: <id:text>
			const colonIdx = visual.indexOf(':', i + 1);
			const closeIdx = visual.indexOf('>', colonIdx + 1);
			if (colonIdx === -1 || closeIdx === -1) {
				throw new Error(`Invalid delete format at position ${i}`);
			}
			const text = visual.substring(colonIdx + 1, closeIdx);
			const startOffset = baseString.length;
			baseString += text;
			updates.push({ range: new OffsetRange(startOffset, baseString.length), annotation: undefined });
			i = closeIdx + 1;
		} else {
			baseString += visual[i];
			i++;
		}
	}

	return { updates, baseString };
}

/**
 * Creates an AnnotationsUpdate from a visual representation.
 */
function updateFromVisual(...visuals: string[]): AnnotationsUpdate<string> {
	const updates: IAnnotationUpdate<string>[] = [];

	for (const visual of visuals) {
		const { updates: parsedUpdates } = parseVisualUpdate(visual);
		updates.push(...parsedUpdates);
	}

	return AnnotationsUpdate.create(updates);
}

/**
 * Helper to create a StringEdit from visual notation.
 * Uses a pattern matching approach where:
 * - 'd' marks positions to delete
 * - 'i:text:' inserts 'text' at the marked position
 *
 * Simpler approach: just use offset-based helpers
 */
function editDelete(start: number, end: number): StringEdit {
	return StringEdit.replace(new OffsetRange(start, end), '');
}

function editInsert(pos: number, text: string): StringEdit {
	return StringEdit.insert(pos, text);
}

function editReplace(start: number, end: number, text: string): StringEdit {
	return StringEdit.replace(new OffsetRange(start, end), text);
}

/**
 * Asserts that a VisualAnnotatedString matches the expected visual representation.
 * Only compares annotations, not the base string (since setAnnotations doesn't change the base string).
 */
function assertVisual(vas: VisualAnnotatedString, expectedVisual: string): void {
	const actual = toVisual(vas);
	const { annotations: expectedAnnotations } = parseVisualAnnotations(expectedVisual);
	const actualAnnotations = vas.getAllAnnotations();

	// Compare annotations for better error messages
	if (actualAnnotations.length !== expectedAnnotations.length) {
		assert.fail(
			`Annotation count mismatch.\n` +
			`  Expected: ${expectedVisual}\n` +
			`  Actual:   ${actual}\n` +
			`  Expected ${expectedAnnotations.length} annotations, got ${actualAnnotations.length}`
		);
	}

	for (let i = 0; i < actualAnnotations.length; i++) {
		const expected = expectedAnnotations[i];
		const actualAnn = actualAnnotations[i];
		if (actualAnn.range.start !== expected.range.start || actualAnn.range.endExclusive !== expected.range.endExclusive) {
			assert.fail(
				`Annotation ${i} range mismatch.\n` +
				`  Expected: (${expected.range.start}, ${expected.range.endExclusive})\n` +
				`  Actual:   (${actualAnn.range.start}, ${actualAnn.range.endExclusive})\n` +
				`  Expected visual: ${expectedVisual}\n` +
				`  Actual visual:   ${actual}`
			);
		}
		if (actualAnn.annotation !== expected.annotation) {
			assert.fail(
				`Annotation ${i} value mismatch.\n` +
				`  Expected: "${expected.annotation}"\n` +
				`  Actual:   "${actualAnn.annotation}"`
			);
		}
	}
}

/**
 * Helper to visualize the effect of an edit on annotations.
 * Returns both before and after states as visual strings.
 */
function visualizeEdit(
	beforeAnnotations: string,
	edit: StringEdit
): { before: string; after: string } {
	const vas = fromVisual(beforeAnnotations);
	const before = toVisual(vas);

	vas.applyEdit(edit);

	const after = toVisual(vas);
	return { before, after };
}

// ============================================================================
// Visual Annotations Test Suite
// ============================================================================
// These tests use a visual representation for better readability:
// - '[id:text]' marks annotated regions with id and content
// - Plain text represents unannotated content
// - '<id:text>' marks regions to delete (in updates)
//
// Example: "Lorem [1:ipsum] dolor [2:sit] amet" represents two annotations:
//          "1" at (6,11) covering "ipsum", "2" at (18,21) covering "sit"
// ============================================================================

suite('Annotations Suite', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('setAnnotations 1', () => {
		const vas = fromVisual('[1:Lorem] ipsum [2:dolor] sit [3:amet]');
		vas.setAnnotations(updateFromVisual('[4:Lorem i]'));
		assertVisual(vas, '[4:Lorem i]psum [2:dolor] sit [3:amet]');
		vas.setAnnotations(updateFromVisual('Lorem ip[5:s]'));
		assertVisual(vas, '[4:Lorem i]p[5:s]um [2:dolor] sit [3:amet]');
	});

	test('setAnnotations 2', () => {
		const vas = fromVisual('[1:Lorem] ipsum [2:dolor] sit [3:amet]');
		vas.setAnnotations(updateFromVisual(
			'L<_:orem ipsum d>',
			'[4:Lorem ]'
		));
		assertVisual(vas, '[4:Lorem ]ipsum dolor sit [3:amet]');
		vas.setAnnotations(updateFromVisual(
			'Lorem <_:ipsum dolor sit amet>',
			'[5:Lor]'
		));
		assertVisual(vas, '[5:Lor]em ipsum dolor sit amet');
		vas.setAnnotations(updateFromVisual('L[6:or]'));
		assertVisual(vas, 'L[6:or]em ipsum dolor sit amet');
	});

	test('setAnnotations 3', () => {
		const vas = fromVisual('[1:Lorem] ipsum [2:dolor] sit [3:amet]');
		vas.setAnnotations(updateFromVisual('Lore[4:m ipsum dolor ]'));
		assertVisual(vas, 'Lore[4:m ipsum dolor ]sit [3:amet]');
		vas.setAnnotations(updateFromVisual('Lorem ipsum dolor sit [5:a]'));
		assertVisual(vas, 'Lore[4:m ipsum dolor ]sit [5:a]met');
	});

	test('getAnnotationsIntersecting 1', () => {
		const vas = fromVisual('[1:Lorem] ipsum [2:dolor] sit [3:amet]');
		const result1 = vas.getAnnotationsIntersecting(new OffsetRange(0, 13));
		assert.strictEqual(result1.length, 2);
		assert.deepStrictEqual(result1.map(a => a.annotation), ['1', '2']);
		const result2 = vas.getAnnotationsIntersecting(new OffsetRange(0, 22));
		assert.strictEqual(result2.length, 3);
		assert.deepStrictEqual(result2.map(a => a.annotation), ['1', '2', '3']);
	});

	test('getAnnotationsIntersecting 2', () => {
		const vas = fromVisual('[1:Lorem] [2:i]p[3:s]');

		const result1 = vas.getAnnotationsIntersecting(new OffsetRange(5, 7));
		assert.strictEqual(result1.length, 2);
		assert.deepStrictEqual(result1.map(a => a.annotation), ['1', '2']);
		const result2 = vas.getAnnotationsIntersecting(new OffsetRange(5, 9));
		assert.strictEqual(result2.length, 3);
		assert.deepStrictEqual(result2.map(a => a.annotation), ['1', '2', '3']);
	});

	test('getAnnotationsIntersecting 3', () => {
		const vas = fromVisual('[1:Lorem] ipsum [2:dolor]');
		const result1 = vas.getAnnotationsIntersecting(new OffsetRange(4, 13));
		assert.strictEqual(result1.length, 2);
		assert.deepStrictEqual(result1.map(a => a.annotation), ['1', '2']);
		vas.setAnnotations(updateFromVisual('[3:Lore]m[4: ipsu]'));
		assertVisual(vas, '[3:Lore]m[4: ipsu]m [2:dolor]');
		const result2 = vas.getAnnotationsIntersecting(new OffsetRange(7, 13));
		assert.strictEqual(result2.length, 2);
		assert.deepStrictEqual(result2.map(a => a.annotation), ['4', '2']);
	});

	test('getAnnotationsIntersecting 4', () => {
		const vas = fromVisual('[1:Lorem ipsum] sit');
		vas.setAnnotations(updateFromVisual('Lorem ipsum [2:sit]'));
		const result = vas.getAnnotationsIntersecting(new OffsetRange(2, 8));
		assert.strictEqual(result.length, 1);
		assert.deepStrictEqual(result.map(a => a.annotation), ['1']);
	});

	test('getAnnotationsIntersecting 5', () => {
		const vas = fromVisual('[1:Lorem ipsum] [2:dol] [3:or]');
		const result = vas.getAnnotationsIntersecting(new OffsetRange(1, 16));
		assert.strictEqual(result.length, 3);
		assert.deepStrictEqual(result.map(a => a.annotation), ['1', '2', '3']);
	});

	test('applyEdit 1 - deletion within annotation', () => {
		const result = visualizeEdit(
			'[1:Lorem] ipsum [2:dolor] sit [3:amet]',
			editDelete(0, 3)
		);
		assert.strictEqual(result.after, '[1:em] ipsum [2:dolor] sit [3:amet]');
	});

	test('applyEdit 2 - deletion and insertion within annotation', () => {
		const result = visualizeEdit(
			'[1:Lorem] ipsum [2:dolor] sit [3:amet]',
			editReplace(1, 3, 'XXXXX')
		);
		assert.strictEqual(result.after, '[1:LXXXXXem] ipsum [2:dolor] sit [3:amet]');
	});

	test('applyEdit 3 - deletion across several annotations', () => {
		const result = visualizeEdit(
			'[1:Lorem] ipsum [2:dolor] sit [3:amet]',
			editReplace(4, 22, 'XXXXX')
		);
		assert.strictEqual(result.after, '[1:LoreXXXXX][3:amet]');
	});

	test('applyEdit 4 - deletion between annotations', () => {
		const result = visualizeEdit(
			'[1:Lorem ip]sum and [2:dolor] sit [3:amet]',
			editDelete(10, 12)
		);
		assert.strictEqual(result.after, '[1:Lorem ip]suand [2:dolor] sit [3:amet]');
	});

	test('applyEdit 5 - deletion that covers annotation', () => {
		const result = visualizeEdit(
			'[1:Lorem] ipsum [2:dolor] sit [3:amet]',
			editDelete(0, 5)
		);
		assert.strictEqual(result.after, ' ipsum [2:dolor] sit [3:amet]');
	});

	test('applyEdit 6 - several edits', () => {
		const vas = fromVisual('[1:Lorem] ipsum [2:dolor] sit [3:amet]');
		const edit = StringEdit.compose([
			StringEdit.replace(new OffsetRange(0, 6), ''),
			StringEdit.replace(new OffsetRange(6, 12), ''),
			StringEdit.replace(new OffsetRange(12, 17), '')
		]);
		vas.applyEdit(edit);
		assertVisual(vas, 'ipsum sit [3:am]');
	});

	test('applyEdit 7 - several edits', () => {
		const vas = fromVisual('[1:Lorem] ipsum [2:dolor] sit [3:amet]');
		const edit1 = StringEdit.replace(new OffsetRange(0, 3), 'XXXX');
		const edit2 = StringEdit.replace(new OffsetRange(0, 2), '');
		vas.applyEdit(edit1.compose(edit2));
		assertVisual(vas, '[1:XXem] ipsum [2:dolor] sit [3:amet]');
	});

	test('applyEdit 9 - insertion at end of annotation', () => {
		const result = visualizeEdit(
			'[1:Lorem] ipsum [2:dolor] sit [3:amet]',
			editInsert(17, 'XXX')
		);
		assert.strictEqual(result.after, '[1:Lorem] ipsum [2:dolor]XXX sit [3:amet]');
	});

	test('applyEdit 10 - insertion in middle of annotation', () => {
		const result = visualizeEdit(
			'[1:Lorem] ipsum [2:dolor] sit [3:amet]',
			editInsert(14, 'XXX')
		);
		assert.strictEqual(result.after, '[1:Lorem] ipsum [2:doXXXlor] sit [3:amet]');
	});

	test('applyEdit 11 - replacement consuming annotation', () => {
		const result = visualizeEdit(
			'[1:L]o[2:rem] [3:i]',
			editReplace(1, 6, 'X')
		);
		assert.strictEqual(result.after, '[1:L]X[3:i]');
	});

	test('applyEdit 12 - multiple disjoint edits', () => {
		const vas = fromVisual('[1:Lorem] ipsum [2:dolor] sit [3:amet!] [4:done]');

		const edit = StringEdit.compose([
			StringEdit.insert(0, 'X'),
			StringEdit.delete(new OffsetRange(12, 13)),
			StringEdit.replace(new OffsetRange(21, 22), 'YY'),
			StringEdit.replace(new OffsetRange(28, 32), 'Z')
		]);
		vas.applyEdit(edit);
		assertVisual(vas, 'X[1:Lorem] ipsum[2:dolor] sitYY[3:amet!]Z[4:e]');
	});

	test('applyEdit 13 - edit on the left border', () => {
		const result = visualizeEdit(
			'lorem ipsum dolor[1: ]',
			editInsert(17, 'X')
		);
		assert.strictEqual(result.after, 'lorem ipsum dolorX[1: ]');
	});

	test('rebase', () => {
		const a = new VisualAnnotatedString(
			new AnnotatedString<string>([{ range: new OffsetRange(2, 5), annotation: '1' }]),
			'sitamet'
		);
		const b = a.clone();
		const update: AnnotationsUpdate<string> = AnnotationsUpdate.create([{ range: new OffsetRange(4, 5), annotation: '2' }]);

		b.setAnnotations(update);
		const edit: StringEdit = StringEdit.replace(new OffsetRange(1, 6), 'XXX');

		a.applyEdit(edit);
		b.applyEdit(edit);

		update.rebase(edit);

		a.setAnnotations(update);
		assert.deepStrictEqual(a.getAllAnnotations(), b.getAllAnnotations());
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/editableTextModel.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/editableTextModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ISingleEditOperation } from '../../../common/core/editOperation.js';
import { Range } from '../../../common/core/range.js';
import { EndOfLinePreference, EndOfLineSequence } from '../../../common/model.js';
import { MirrorTextModel } from '../../../common/model/mirrorTextModel.js';
import { IModelContentChangedEvent } from '../../../common/textModelEvents.js';
import { assertSyncedModels, testApplyEditsWithSyncedModels } from './editableTextModelTestUtils.js';
import { createTextModel } from '../testTextModel.js';

suite('EditorModel - EditableTextModel.applyEdits updates mightContainRTL', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function testApplyEdits(original: string[], edits: ISingleEditOperation[], before: boolean, after: boolean): void {
		const model = createTextModel(original.join('\n'));
		model.setEOL(EndOfLineSequence.LF);

		assert.strictEqual(model.mightContainRTL(), before);

		model.applyEdits(edits);
		assert.strictEqual(model.mightContainRTL(), after);
		model.dispose();
	}

	function editOp(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number, text: string[]): ISingleEditOperation {
		return {
			range: new Range(startLineNumber, startColumn, endLineNumber, endColumn),
			text: text.join('\n')
		};
	}

	test('start with RTL, insert LTR', () => {
		testApplyEdits(['Hello,\nזוהי עובדה מבוססת שדעתו'], [editOp(1, 1, 1, 1, ['hello'])], true, true);
	});

	test('start with RTL, delete RTL', () => {
		testApplyEdits(['Hello,\nזוהי עובדה מבוססת שדעתו'], [editOp(1, 1, 10, 10, [''])], true, true);
	});

	test('start with RTL, insert RTL', () => {
		testApplyEdits(['Hello,\nזוהי עובדה מבוססת שדעתו'], [editOp(1, 1, 1, 1, ['هناك حقيقة مثبتة منذ زمن طويل'])], true, true);
	});

	test('start with LTR, insert LTR', () => {
		testApplyEdits(['Hello,\nworld!'], [editOp(1, 1, 1, 1, ['hello'])], false, false);
	});

	test('start with LTR, insert RTL 1', () => {
		testApplyEdits(['Hello,\nworld!'], [editOp(1, 1, 1, 1, ['هناك حقيقة مثبتة منذ زمن طويل'])], false, true);
	});

	test('start with LTR, insert RTL 2', () => {
		testApplyEdits(['Hello,\nworld!'], [editOp(1, 1, 1, 1, ['זוהי עובדה מבוססת שדעתו'])], false, true);
	});
});


suite('EditorModel - EditableTextModel.applyEdits updates mightContainNonBasicASCII', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function testApplyEdits(original: string[], edits: ISingleEditOperation[], before: boolean, after: boolean): void {
		const model = createTextModel(original.join('\n'));
		model.setEOL(EndOfLineSequence.LF);

		assert.strictEqual(model.mightContainNonBasicASCII(), before);

		model.applyEdits(edits);
		assert.strictEqual(model.mightContainNonBasicASCII(), after);
		model.dispose();
	}

	function editOp(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number, text: string[]): ISingleEditOperation {
		return {
			range: new Range(startLineNumber, startColumn, endLineNumber, endColumn),
			text: text.join('\n')
		};
	}

	test('start with NON-ASCII, insert ASCII', () => {
		testApplyEdits(['Hello,\nZürich'], [editOp(1, 1, 1, 1, ['hello', 'second line'])], true, true);
	});

	test('start with NON-ASCII, delete NON-ASCII', () => {
		testApplyEdits(['Hello,\nZürich'], [editOp(1, 1, 10, 10, [''])], true, true);
	});

	test('start with NON-ASCII, insert NON-ASCII', () => {
		testApplyEdits(['Hello,\nZürich'], [editOp(1, 1, 1, 1, ['Zürich'])], true, true);
	});

	test('start with ASCII, insert ASCII', () => {
		testApplyEdits(['Hello,\nworld!'], [editOp(1, 1, 1, 1, ['hello', 'second line'])], false, false);
	});

	test('start with ASCII, insert NON-ASCII', () => {
		testApplyEdits(['Hello,\nworld!'], [editOp(1, 1, 1, 1, ['Zürich', 'Zürich'])], false, true);
	});

});

suite('EditorModel - EditableTextModel.applyEdits', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function editOp(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number, text: string[]): ISingleEditOperation {
		return {
			range: new Range(startLineNumber, startColumn, endLineNumber, endColumn),
			text: text.join('\n'),
			forceMoveMarkers: false
		};
	}

	test('high-low surrogates 1', () => {
		testApplyEditsWithSyncedModels(
			[
				'📚some',
				'very nice',
				'text'
			],
			[
				editOp(1, 2, 1, 2, ['a'])
			],
			[
				'a📚some',
				'very nice',
				'text'
			],
/*inputEditsAreInvalid*/true
		);
	});
	test('high-low surrogates 2', () => {
		testApplyEditsWithSyncedModels(
			[
				'📚some',
				'very nice',
				'text'
			],
			[
				editOp(1, 2, 1, 3, ['a'])
			],
			[
				'asome',
				'very nice',
				'text'
			],
/*inputEditsAreInvalid*/true
		);
	});
	test('high-low surrogates 3', () => {
		testApplyEditsWithSyncedModels(
			[
				'📚some',
				'very nice',
				'text'
			],
			[
				editOp(1, 1, 1, 2, ['a'])
			],
			[
				'asome',
				'very nice',
				'text'
			],
/*inputEditsAreInvalid*/true
		);
	});
	test('high-low surrogates 4', () => {
		testApplyEditsWithSyncedModels(
			[
				'📚some',
				'very nice',
				'text'
			],
			[
				editOp(1, 1, 1, 3, ['a'])
			],
			[
				'asome',
				'very nice',
				'text'
			],
/*inputEditsAreInvalid*/true
		);
	});

	test('Bug 19872: Undo is funky', () => {
		testApplyEditsWithSyncedModels(
			[
				'something',
				' A',
				'',
				' B',
				'something else'
			],
			[
				editOp(2, 1, 2, 2, ['']),
				editOp(3, 1, 4, 2, [''])
			],
			[
				'something',
				'A',
				'B',
				'something else'
			]
		);
	});

	test('Bug 19872: Undo is funky (2)', () => {
		testApplyEditsWithSyncedModels(
			[
				'something',
				'A',
				'B',
				'something else'
			],
			[
				editOp(2, 1, 2, 1, [' ']),
				editOp(3, 1, 3, 1, ['', ' '])
			],
			[
				'something',
				' A',
				'',
				' B',
				'something else'
			]
		);
	});

	test('insert empty text', () => {
		testApplyEditsWithSyncedModels(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 1, 1, 1, [''])
			],
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			]
		);
	});

	test('last op is no-op', () => {
		testApplyEditsWithSyncedModels(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 1, 1, 2, ['']),
				editOp(4, 1, 4, 1, [''])
			],
			[
				'y First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			]
		);
	});

	test('insert text without newline 1', () => {
		testApplyEditsWithSyncedModels(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 1, 1, 1, ['foo '])
			],
			[
				'foo My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			]
		);
	});

	test('insert text without newline 2', () => {
		testApplyEditsWithSyncedModels(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 3, 1, 3, [' foo'])
			],
			[
				'My foo First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			]
		);
	});

	test('insert one newline', () => {
		testApplyEditsWithSyncedModels(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 4, 1, 4, ['', ''])
			],
			[
				'My ',
				'First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			]
		);
	});

	test('insert text with one newline', () => {
		testApplyEditsWithSyncedModels(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 3, 1, 3, [' new line', 'No longer'])
			],
			[
				'My new line',
				'No longer First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			]
		);
	});

	test('insert text with two newlines', () => {
		testApplyEditsWithSyncedModels(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 3, 1, 3, [' new line', 'One more line in the middle', 'No longer'])
			],
			[
				'My new line',
				'One more line in the middle',
				'No longer First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			]
		);
	});

	test('insert text with many newlines', () => {
		testApplyEditsWithSyncedModels(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 3, 1, 3, ['', '', '', '', ''])
			],
			[
				'My',
				'',
				'',
				'',
				' First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			]
		);
	});

	test('insert multiple newlines', () => {
		testApplyEditsWithSyncedModels(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 3, 1, 3, ['', '', '', '', '']),
				editOp(3, 15, 3, 15, ['a', 'b'])
			],
			[
				'My',
				'',
				'',
				'',
				' First Line',
				'\t\tMy Second Line',
				'    Third Linea',
				'b',
				'',
				'1'
			]
		);
	});

	test('delete empty text', () => {
		testApplyEditsWithSyncedModels(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 1, 1, 1, [''])
			],
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			]
		);
	});

	test('delete text from one line', () => {
		testApplyEditsWithSyncedModels(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 1, 1, 2, [''])
			],
			[
				'y First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			]
		);
	});

	test('delete text from one line 2', () => {
		testApplyEditsWithSyncedModels(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 1, 1, 3, ['a'])
			],
			[
				'a First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			]
		);
	});

	test('delete all text from a line', () => {
		testApplyEditsWithSyncedModels(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 1, 1, 14, [''])
			],
			[
				'',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			]
		);
	});

	test('delete text from two lines', () => {
		testApplyEditsWithSyncedModels(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 4, 2, 6, [''])
			],
			[
				'My Second Line',
				'    Third Line',
				'',
				'1'
			]
		);
	});

	test('delete text from many lines', () => {
		testApplyEditsWithSyncedModels(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 4, 3, 5, [''])
			],
			[
				'My Third Line',
				'',
				'1'
			]
		);
	});

	test('delete everything', () => {
		testApplyEditsWithSyncedModels(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 1, 5, 2, [''])
			],
			[
				''
			]
		);
	});

	test('two unrelated edits', () => {
		testApplyEditsWithSyncedModels(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			[
				editOp(2, 1, 2, 3, ['\t']),
				editOp(3, 1, 3, 5, [''])
			],
			[
				'My First Line',
				'\tMy Second Line',
				'Third Line',
				'',
				'123'
			]
		);
	});

	test('two edits on one line', () => {
		testApplyEditsWithSyncedModels(
			[
				'\t\tfirst\t    ',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\t<!@#fifth#@!>\t\t'
			],
			[
				editOp(5, 3, 5, 7, ['']),
				editOp(5, 12, 5, 16, [''])
			],
			[
				'\t\tfirst\t    ',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\tfifth\t\t'
			]
		);
	});

	test('many edits', () => {
		testApplyEditsWithSyncedModels(
			[
				'{"x" : 1}'
			],
			[
				editOp(1, 2, 1, 2, ['\n  ']),
				editOp(1, 5, 1, 6, ['']),
				editOp(1, 9, 1, 9, ['\n'])
			],
			[
				'{',
				'  "x": 1',
				'}'
			]
		);
	});

	test('many edits reversed', () => {
		testApplyEditsWithSyncedModels(
			[
				'{',
				'  "x": 1',
				'}'
			],
			[
				editOp(1, 2, 2, 3, ['']),
				editOp(2, 6, 2, 6, [' ']),
				editOp(2, 9, 3, 1, [''])
			],
			[
				'{"x" : 1}'
			]
		);
	});

	test('replacing newlines 1', () => {
		testApplyEditsWithSyncedModels(
			[
				'{',
				'"a": true,',
				'',
				'"b": true',
				'}'
			],
			[
				editOp(1, 2, 2, 1, ['', '\t']),
				editOp(2, 11, 4, 1, ['', '\t'])
			],
			[
				'{',
				'\t"a": true,',
				'\t"b": true',
				'}'
			]
		);
	});

	test('replacing newlines 2', () => {
		testApplyEditsWithSyncedModels(
			[
				'some text',
				'some more text',
				'now comes an empty line',
				'',
				'after empty line',
				'and the last line'
			],
			[
				editOp(1, 5, 3, 1, [' text', 'some more text', 'some more text']),
				editOp(3, 2, 4, 1, ['o more lines', 'asd', 'asd', 'asd']),
				editOp(5, 1, 5, 6, ['zzzzzzzz']),
				editOp(5, 11, 6, 16, ['1', '2', '3', '4'])
			],
			[
				'some text',
				'some more text',
				'some more textno more lines',
				'asd',
				'asd',
				'asd',
				'zzzzzzzz empt1',
				'2',
				'3',
				'4ne'
			]
		);
	});

	test('advanced 1', () => {
		testApplyEditsWithSyncedModels(
			[
				' {       "d": [',
				'             null',
				'        ] /*comment*/',
				'        ,"e": /*comment*/ [null] }',
			],
			[
				editOp(1, 1, 1, 2, ['']),
				editOp(1, 3, 1, 10, ['', '  ']),
				editOp(1, 16, 2, 14, ['', '    ']),
				editOp(2, 18, 3, 9, ['', '  ']),
				editOp(3, 22, 4, 9, ['']),
				editOp(4, 10, 4, 10, ['', '  ']),
				editOp(4, 28, 4, 28, ['', '    ']),
				editOp(4, 32, 4, 32, ['', '  ']),
				editOp(4, 33, 4, 34, ['', ''])
			],
			[
				'{',
				'  "d": [',
				'    null',
				'  ] /*comment*/,',
				'  "e": /*comment*/ [',
				'    null',
				'  ]',
				'}',
			]
		);
	});

	test('advanced simplified', () => {
		testApplyEditsWithSyncedModels(
			[
				'   abc',
				' ,def'
			],
			[
				editOp(1, 1, 1, 4, ['']),
				editOp(1, 7, 2, 2, ['']),
				editOp(2, 3, 2, 3, ['', ''])
			],
			[
				'abc,',
				'def'
			]
		);
	});

	test('issue #144', () => {
		testApplyEditsWithSyncedModels(
			[
				'package caddy',
				'',
				'func main() {',
				'\tfmt.Println("Hello World! :)")',
				'}',
				''
			],
			[
				editOp(1, 1, 6, 1, [
					'package caddy',
					'',
					'import "fmt"',
					'',
					'func main() {',
					'\tfmt.Println("Hello World! :)")',
					'}',
					''
				])
			],
			[
				'package caddy',
				'',
				'import "fmt"',
				'',
				'func main() {',
				'\tfmt.Println("Hello World! :)")',
				'}',
				''
			]
		);
	});

	test('issue #2586 Replacing selected end-of-line with newline locks up the document', () => {
		testApplyEditsWithSyncedModels(
			[
				'something',
				'interesting'
			],
			[
				editOp(1, 10, 2, 1, ['', ''])
			],
			[
				'something',
				'interesting'
			]
		);
	});

	test('issue #3980', () => {
		testApplyEditsWithSyncedModels(
			[
				'class A {',
				'    someProperty = false;',
				'    someMethod() {',
				'    this.someMethod();',
				'    }',
				'}',
			],
			[
				editOp(1, 8, 1, 9, ['', '']),
				editOp(3, 17, 3, 18, ['', '']),
				editOp(3, 18, 3, 18, ['    ']),
				editOp(4, 5, 4, 5, ['    ']),
			],
			[
				'class A',
				'{',
				'    someProperty = false;',
				'    someMethod()',
				'    {',
				'        this.someMethod();',
				'    }',
				'}',
			]
		);
	});

	function testApplyEditsFails(original: string[], edits: ISingleEditOperation[]): void {
		const model = createTextModel(original.join('\n'));

		let hasThrown = false;
		try {
			model.applyEdits(edits);
		} catch (err) {
			hasThrown = true;
		}
		assert.ok(hasThrown, 'expected model.applyEdits to fail.');

		model.dispose();
	}

	test('touching edits: two inserts at the same position', () => {
		testApplyEditsWithSyncedModels(
			[
				'hello world'
			],
			[
				editOp(1, 1, 1, 1, ['a']),
				editOp(1, 1, 1, 1, ['b']),
			],
			[
				'abhello world'
			]
		);
	});

	test('touching edits: insert and replace touching', () => {
		testApplyEditsWithSyncedModels(
			[
				'hello world'
			],
			[
				editOp(1, 1, 1, 1, ['b']),
				editOp(1, 1, 1, 3, ['ab']),
			],
			[
				'babllo world'
			]
		);
	});

	test('overlapping edits: two overlapping replaces', () => {
		testApplyEditsFails(
			[
				'hello world'
			],
			[
				editOp(1, 1, 1, 2, ['b']),
				editOp(1, 1, 1, 3, ['ab']),
			]
		);
	});

	test('overlapping edits: two overlapping deletes', () => {
		testApplyEditsFails(
			[
				'hello world'
			],
			[
				editOp(1, 1, 1, 2, ['']),
				editOp(1, 1, 1, 3, ['']),
			]
		);
	});

	test('touching edits: two touching replaces', () => {
		testApplyEditsWithSyncedModels(
			[
				'hello world'
			],
			[
				editOp(1, 1, 1, 2, ['H']),
				editOp(1, 2, 1, 3, ['E']),
			],
			[
				'HEllo world'
			]
		);
	});

	test('touching edits: two touching deletes', () => {
		testApplyEditsWithSyncedModels(
			[
				'hello world'
			],
			[
				editOp(1, 1, 1, 2, ['']),
				editOp(1, 2, 1, 3, ['']),
			],
			[
				'llo world'
			]
		);
	});

	test('touching edits: insert and replace', () => {
		testApplyEditsWithSyncedModels(
			[
				'hello world'
			],
			[
				editOp(1, 1, 1, 1, ['H']),
				editOp(1, 1, 1, 3, ['e']),
			],
			[
				'Hello world'
			]
		);
	});

	test('touching edits: replace and insert', () => {
		testApplyEditsWithSyncedModels(
			[
				'hello world'
			],
			[
				editOp(1, 1, 1, 3, ['H']),
				editOp(1, 3, 1, 3, ['e']),
			],
			[
				'Hello world'
			]
		);
	});

	test('change while emitting events 1', () => {
		let disposable!: IDisposable;
		assertSyncedModels('Hello', (model, assertMirrorModels) => {
			model.applyEdits([{
				range: new Range(1, 6, 1, 6),
				text: ' world!',
				// forceMoveMarkers: false
			}]);

			assertMirrorModels();

		}, (model) => {
			let isFirstTime = true;
			disposable = model.onDidChangeContent(() => {
				if (!isFirstTime) {
					return;
				}
				isFirstTime = false;

				model.applyEdits([{
					range: new Range(1, 13, 1, 13),
					text: ' How are you?',
					// forceMoveMarkers: false
				}]);
			});
		});
		disposable.dispose();
	});

	test('change while emitting events 2', () => {
		let disposable!: IDisposable;
		assertSyncedModels('Hello', (model, assertMirrorModels) => {
			model.applyEdits([{
				range: new Range(1, 6, 1, 6),
				text: ' world!',
				// forceMoveMarkers: false
			}]);

			assertMirrorModels();

		}, (model) => {
			let isFirstTime = true;
			disposable = model.onDidChangeContent((e: IModelContentChangedEvent) => {
				if (!isFirstTime) {
					return;
				}
				isFirstTime = false;

				model.applyEdits([{
					range: new Range(1, 13, 1, 13),
					text: ' How are you?',
					// forceMoveMarkers: false
				}]);
			});
		});
		disposable.dispose();
	});

	test('issue #1580: Changes in line endings are not correctly reflected in the extension host, leading to invalid offsets sent to external refactoring tools', () => {
		const model = createTextModel('Hello\nWorld!');
		assert.strictEqual(model.getEOL(), '\n');

		const mirrorModel2 = new MirrorTextModel(null!, model.getLinesContent(), model.getEOL(), model.getVersionId());
		let mirrorModel2PrevVersionId = model.getVersionId();

		const disposable = model.onDidChangeContent((e: IModelContentChangedEvent) => {
			const versionId = e.versionId;
			if (versionId < mirrorModel2PrevVersionId) {
				console.warn('Model version id did not advance between edits (2)');
			}
			mirrorModel2PrevVersionId = versionId;
			mirrorModel2.onEvents(e);
		});

		const assertMirrorModels = () => {
			assert.strictEqual(mirrorModel2.getText(), model.getValue(), 'mirror model 2 text OK');
			assert.strictEqual(mirrorModel2.version, model.getVersionId(), 'mirror model 2 version OK');
		};

		model.setEOL(EndOfLineSequence.CRLF);
		assertMirrorModels();

		disposable.dispose();
		model.dispose();
		mirrorModel2.dispose();
	});

	test('issue #47733: Undo mangles unicode characters', () => {
		const model = createTextModel('\'👁\'');

		model.applyEdits([
			{ range: new Range(1, 1, 1, 1), text: '"' },
			{ range: new Range(1, 2, 1, 2), text: '"' },
		]);

		assert.strictEqual(model.getValue(EndOfLinePreference.LF), '"\'"👁\'');

		assert.deepStrictEqual(model.validateRange(new Range(1, 3, 1, 4)), new Range(1, 3, 1, 4));

		model.applyEdits([
			{ range: new Range(1, 1, 1, 2), text: null },
			{ range: new Range(1, 3, 1, 4), text: null },
		]);

		assert.strictEqual(model.getValue(EndOfLinePreference.LF), '\'👁\'');

		model.dispose();
	});

	test('issue #48741: Broken undo stack with move lines up with multiple cursors', () => {
		const model = createTextModel([
			'line1',
			'line2',
			'line3',
			'',
		].join('\n'));

		const undoEdits = model.applyEdits([
			{ range: new Range(4, 1, 4, 1), text: 'line3', },
			{ range: new Range(3, 1, 3, 6), text: null, },
			{ range: new Range(2, 1, 3, 1), text: null, },
			{ range: new Range(3, 6, 3, 6), text: '\nline2' }
		], true);

		model.applyEdits(undoEdits);

		assert.deepStrictEqual(model.getValue(), 'line1\nline2\nline3\n');

		model.dispose();
	});
});

suite('CRLF edit normalization', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('edit ending with \\r followed by \\n in buffer should strip trailing \\r', () => {
		// Document: "abc\r\ndef\r\n"
		// Edit: Replace range (1,1)-(1,4) "abc" with "xyz\r"
		// The \r at end of replacement should be stripped since next char is \n
		const model = createTextModel('abc\r\ndef\r\n');
		model.setEOL(EndOfLineSequence.CRLF);

		assert.strictEqual(model.getEOL(), '\r\n');
		assert.strictEqual(model.getLineCount(), 3);
		assert.strictEqual(model.getLineContent(1), 'abc');
		assert.strictEqual(model.getLineContent(2), 'def');

		model.applyEdits([
			{ range: new Range(1, 1, 1, 4), text: 'xyz\r' }
		]);

		// The trailing \r should be stripped, so we get "xyz" not "xyz\r"
		assert.strictEqual(model.getLineContent(1), 'xyz');
		assert.strictEqual(model.getLineContent(2), 'def');
		assert.strictEqual(model.getLineCount(), 3);

		model.dispose();
	});

	test('edit ending with \\r\\n should NOT be modified', () => {
		// Document: "abc\r\ndef\r\n"
		// Edit: Replace range (1,1)-(1,4) "abc" with "xyz\r\n"
		// This is a proper CRLF so should not be modified
		const model = createTextModel('abc\r\ndef\r\n');
		model.setEOL(EndOfLineSequence.CRLF);

		model.applyEdits([
			{ range: new Range(1, 1, 1, 4), text: 'xyz\r\n' }
		]);

		// Should add a new line
		assert.strictEqual(model.getLineContent(1), 'xyz');
		assert.strictEqual(model.getLineContent(2), '');
		assert.strictEqual(model.getLineContent(3), 'def');
		assert.strictEqual(model.getLineCount(), 4);

		model.dispose();
	});

	test('edit ending with \\r NOT followed by \\n should NOT be modified', () => {
		// Document: "abcdef" (no newline after)
		// Edit: Replace range (1,1)-(1,4) "abc" with "xyz\r"
		// Since there's no \n after the range, the \r should stay
		const model = createTextModel('abcdef');
		model.setEOL(EndOfLineSequence.CRLF);

		model.applyEdits([
			{ range: new Range(1, 1, 1, 4), text: 'xyz\r' }
		]);

		// The \r should cause a new line since buffer normalizes EOL
		// Actually since buffer uses CRLF, the lone \r will be normalized to \r\n
		assert.strictEqual(model.getLineCount(), 2);

		model.dispose();
	});

	test('edit in LF buffer should NOT strip trailing \\r', () => {
		// Document with LF: "abc\ndef\n"
		// Edit: Replace range (1,1)-(1,4) "abc" with "xyz\r"
		// Since buffer is LF, no special handling needed
		const model = createTextModel('abc\ndef\n');
		model.setEOL(EndOfLineSequence.LF);

		assert.strictEqual(model.getEOL(), '\n');
		assert.strictEqual(model.getLineCount(), 3);

		model.applyEdits([
			{ range: new Range(1, 1, 1, 4), text: 'xyz\r' }
		]);

		// The \r will be normalized to \n (buffer's EOL)
		assert.strictEqual(model.getLineCount(), 4);

		model.dispose();
	});

	test('LSP include sorting scenario - edit ending with \\r should be normalized', () => {
		// This is the real-world scenario from the issue
		// Document: "#include \"a.h\"\r\n#include \"c.h\"\r\n#include \"b.h\"\r\n"
		// Edit: Replace lines 1-3 with reordered includes ending with \r
		const model = createTextModel('#include "a.h"\r\n#include "c.h"\r\n#include "b.h"\r\n');
		model.setEOL(EndOfLineSequence.CRLF);

		assert.strictEqual(model.getEOL(), '\r\n');
		assert.strictEqual(model.getLineCount(), 4);
		assert.strictEqual(model.getLineContent(1), '#include "a.h"');
		assert.strictEqual(model.getLineContent(2), '#include "c.h"');
		assert.strictEqual(model.getLineContent(3), '#include "b.h"');

		// Edit: replace range (1,1)-(3,16) with text ending in \r
		// Range covers: #include "a.h"\r\n#include "c.h"\r\n#include "b.h"
		// Note: line 3 col 16 is after the last char "h" but before the \r\n
		model.applyEdits([
			{
				range: new Range(1, 1, 3, 16),
				text: '#include "a.h"\r\n#include "b.h"\r\n#include "c.h"\r'
			}
		]);

		// The trailing \r should be stripped because the next char after range is \n
		assert.strictEqual(model.getLineCount(), 4);
		assert.strictEqual(model.getLineContent(1), '#include "a.h"');
		assert.strictEqual(model.getLineContent(2), '#include "b.h"');
		assert.strictEqual(model.getLineContent(3), '#include "c.h"');
		assert.strictEqual(model.getLineContent(4), '');

		model.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/editableTextModelAuto.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/editableTextModelAuto.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../../base/common/charCode.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ISingleEditOperation } from '../../../common/core/editOperation.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { testApplyEditsWithSyncedModels } from './editableTextModelTestUtils.js';

const GENERATE_TESTS = false;

suite('EditorModel Auto Tests', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function editOp(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number, text: string[]): ISingleEditOperation {
		return {
			range: new Range(startLineNumber, startColumn, endLineNumber, endColumn),
			text: text.join('\n'),
			forceMoveMarkers: false
		};
	}

	test('auto1', () => {
		testApplyEditsWithSyncedModels(
			[
				'ioe',
				'',
				'yjct',
				'',
				'',
			],
			[
				editOp(1, 2, 1, 2, ['b', 'r', 'fq']),
				editOp(1, 4, 2, 1, ['', '']),
			],
			[
				'ib',
				'r',
				'fqoe',
				'',
				'yjct',
				'',
				'',
			]
		);
	});

	test('auto2', () => {
		testApplyEditsWithSyncedModels(
			[
				'f',
				'littnhskrq',
				'utxvsizqnk',
				'lslqz',
				'jxn',
				'gmm',
			],
			[
				editOp(1, 2, 1, 2, ['', 'o']),
				editOp(2, 4, 2, 4, ['zaq', 'avb']),
				editOp(2, 5, 6, 2, ['jlr', 'zl', 'j']),
			],
			[
				'f',
				'o',
				'litzaq',
				'avbtjlr',
				'zl',
				'jmm',
			]
		);
	});

	test('auto3', () => {
		testApplyEditsWithSyncedModels(
			[
				'ofw',
				'qsxmziuvzw',
				'rp',
				'qsnymek',
				'elth',
				'wmgzbwudxz',
				'iwsdkndh',
				'bujlbwb',
				'asuouxfv',
				'xuccnb',
			],
			[
				editOp(4, 3, 4, 3, ['']),
			],
			[
				'ofw',
				'qsxmziuvzw',
				'rp',
				'qsnymek',
				'elth',
				'wmgzbwudxz',
				'iwsdkndh',
				'bujlbwb',
				'asuouxfv',
				'xuccnb',
			]
		);
	});

	test('auto4', () => {
		testApplyEditsWithSyncedModels(
			[
				'fefymj',
				'qum',
				'vmiwxxaiqq',
				'dz',
				'lnqdgorosf',
			],
			[
				editOp(1, 3, 1, 5, ['hp']),
				editOp(1, 7, 2, 1, ['kcg', '', 'mpx']),
				editOp(2, 2, 2, 2, ['', 'aw', '']),
				editOp(2, 2, 2, 2, ['vqr', 'mo']),
				editOp(4, 2, 5, 3, ['xyc']),
			],
			[
				'fehpmjkcg',
				'',
				'mpxq',
				'aw',
				'vqr',
				'moum',
				'vmiwxxaiqq',
				'dxycqdgorosf',
			]
		);
	});
});

function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomString(minLength: number, maxLength: number): string {
	const length = getRandomInt(minLength, maxLength);
	let r = '';
	for (let i = 0; i < length; i++) {
		r += String.fromCharCode(getRandomInt(CharCode.a, CharCode.z));
	}
	return r;
}

function generateFile(small: boolean): string {
	const lineCount = getRandomInt(1, small ? 3 : 10);
	const lines: string[] = [];
	for (let i = 0; i < lineCount; i++) {
		lines.push(getRandomString(0, small ? 3 : 10));
	}
	return lines.join('\n');
}

function generateEdits(content: string): ITestModelEdit[] {

	const result: ITestModelEdit[] = [];
	let cnt = getRandomInt(1, 5);

	let maxOffset = content.length;

	while (cnt > 0 && maxOffset > 0) {

		const offset = getRandomInt(0, maxOffset);
		const length = getRandomInt(0, maxOffset - offset);
		const text = generateFile(true);

		result.push({
			offset: offset,
			length: length,
			text: text
		});

		maxOffset = offset;
		cnt--;
	}

	result.reverse();

	return result;
}

interface ITestModelEdit {
	offset: number;
	length: number;
	text: string;
}

class TestModel {

	public initialContent: string;
	public resultingContent: string;
	public edits: ISingleEditOperation[];

	private static _generateOffsetToPosition(content: string): Position[] {
		const result: Position[] = [];
		let lineNumber = 1;
		let column = 1;

		for (let offset = 0, len = content.length; offset <= len; offset++) {
			const ch = content.charAt(offset);

			result[offset] = new Position(lineNumber, column);

			if (ch === '\n') {
				lineNumber++;
				column = 1;
			} else {
				column++;
			}
		}

		return result;
	}

	constructor() {
		this.initialContent = generateFile(false);

		const edits = generateEdits(this.initialContent);

		const offsetToPosition = TestModel._generateOffsetToPosition(this.initialContent);
		this.edits = [];
		for (const edit of edits) {
			const startPosition = offsetToPosition[edit.offset];
			const endPosition = offsetToPosition[edit.offset + edit.length];
			this.edits.push({
				range: new Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column),
				text: edit.text
			});
		}

		this.resultingContent = this.initialContent;
		for (let i = edits.length - 1; i >= 0; i--) {
			this.resultingContent = (
				this.resultingContent.substring(0, edits[i].offset) +
				edits[i].text +
				this.resultingContent.substring(edits[i].offset + edits[i].length)
			);
		}
	}

	public print(): string {
		let r: string[] = [];
		r.push('testApplyEditsWithSyncedModels(');
		r.push('\t[');
		const initialLines = this.initialContent.split('\n');
		r = r.concat(initialLines.map((i) => `\t\t'${i}',`));
		r.push('\t],');
		r.push('\t[');
		r = r.concat(this.edits.map((i) => {
			const text = `['` + i.text!.split('\n').join(`', '`) + `']`;
			return `\t\teditOp(${i.range.startLineNumber}, ${i.range.startColumn}, ${i.range.endLineNumber}, ${i.range.endColumn}, ${text}),`;
		}));
		r.push('\t],');
		r.push('\t[');
		const resultLines = this.resultingContent.split('\n');
		r = r.concat(resultLines.map((i) => `\t\t'${i}',`));
		r.push('\t]');
		r.push(');');

		return r.join('\n');
	}
}

if (GENERATE_TESTS) {
	let number = 1;
	while (true) {

		console.log('------BEGIN NEW TEST: ' + number);

		const testModel = new TestModel();

		// console.log(testModel.print());

		console.log('------END NEW TEST: ' + (number++));

		try {
			testApplyEditsWithSyncedModels(
				testModel.initialContent.split('\n'),
				testModel.edits,
				testModel.resultingContent.split('\n')
			);
			// throw new Error('a');
		} catch (err) {
			console.log(err);
			console.log(testModel.print());
			break;
		}

		// break;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/editableTextModelTestUtils.ts]---
Location: vscode-main/src/vs/editor/test/common/model/editableTextModelTestUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ISingleEditOperation } from '../../../common/core/editOperation.js';
import { Position } from '../../../common/core/position.js';
import { EndOfLinePreference, EndOfLineSequence } from '../../../common/model.js';
import { MirrorTextModel } from '../../../common/model/mirrorTextModel.js';
import { TextModel } from '../../../common/model/textModel.js';
import { IModelContentChangedEvent } from '../../../common/textModelEvents.js';
import { createTextModel } from '../testTextModel.js';

export function testApplyEditsWithSyncedModels(original: string[], edits: ISingleEditOperation[], expected: string[], inputEditsAreInvalid: boolean = false): void {
	const originalStr = original.join('\n');
	const expectedStr = expected.join('\n');

	assertSyncedModels(originalStr, (model, assertMirrorModels) => {
		// Apply edits & collect inverse edits
		const inverseEdits = model.applyEdits(edits, true);

		// Assert edits produced expected result
		assert.deepStrictEqual(model.getValue(EndOfLinePreference.LF), expectedStr);

		assertMirrorModels();

		// Apply the inverse edits
		const inverseInverseEdits = model.applyEdits(inverseEdits, true);

		// Assert the inverse edits brought back model to original state
		assert.deepStrictEqual(model.getValue(EndOfLinePreference.LF), originalStr);

		if (!inputEditsAreInvalid) {
			const simplifyEdit = (edit: ISingleEditOperation) => {
				return {
					range: edit.range,
					text: edit.text,
					forceMoveMarkers: edit.forceMoveMarkers || false
				};
			};
			// Assert the inverse of the inverse edits are the original edits
			assert.deepStrictEqual(inverseInverseEdits.map(simplifyEdit), edits.map(simplifyEdit));
		}

		assertMirrorModels();
	});
}

const enum AssertDocumentLineMappingDirection {
	OffsetToPosition,
	PositionToOffset
}

function assertOneDirectionLineMapping(model: TextModel, direction: AssertDocumentLineMappingDirection, msg: string): void {
	const allText = model.getValue();

	let line = 1, column = 1, previousIsCarriageReturn = false;
	for (let offset = 0; offset <= allText.length; offset++) {
		// The position coordinate system cannot express the position between \r and \n
		const position: Position = new Position(line, column + (previousIsCarriageReturn ? -1 : 0));

		if (direction === AssertDocumentLineMappingDirection.OffsetToPosition) {
			const actualPosition = model.getPositionAt(offset);
			assert.strictEqual(actualPosition.toString(), position.toString(), msg + ' - getPositionAt mismatch for offset ' + offset);
		} else {
			// The position coordinate system cannot express the position between \r and \n
			const expectedOffset: number = offset + (previousIsCarriageReturn ? -1 : 0);
			const actualOffset = model.getOffsetAt(position);
			assert.strictEqual(actualOffset, expectedOffset, msg + ' - getOffsetAt mismatch for position ' + position.toString());
		}

		if (allText.charAt(offset) === '\n') {
			line++;
			column = 1;
		} else {
			column++;
		}

		previousIsCarriageReturn = (allText.charAt(offset) === '\r');
	}
}

function assertLineMapping(model: TextModel, msg: string): void {
	assertOneDirectionLineMapping(model, AssertDocumentLineMappingDirection.PositionToOffset, msg);
	assertOneDirectionLineMapping(model, AssertDocumentLineMappingDirection.OffsetToPosition, msg);
}


export function assertSyncedModels(text: string, callback: (model: TextModel, assertMirrorModels: () => void) => void, setup: ((model: TextModel) => void) | null = null): void {
	const model = createTextModel(text);
	model.setEOL(EndOfLineSequence.LF);
	assertLineMapping(model, 'model');

	if (setup) {
		setup(model);
		assertLineMapping(model, 'model');
	}

	const mirrorModel2 = new MirrorTextModel(null!, model.getLinesContent(), model.getEOL(), model.getVersionId());
	let mirrorModel2PrevVersionId = model.getVersionId();

	const disposable = model.onDidChangeContent((e: IModelContentChangedEvent) => {
		const versionId = e.versionId;
		if (versionId < mirrorModel2PrevVersionId) {
			console.warn('Model version id did not advance between edits (2)');
		}
		mirrorModel2PrevVersionId = versionId;
		mirrorModel2.onEvents(e);
	});

	const assertMirrorModels = () => {
		assertLineMapping(model, 'model');
		assert.strictEqual(mirrorModel2.getText(), model.getValue(), 'mirror model 2 text OK');
		assert.strictEqual(mirrorModel2.version, model.getVersionId(), 'mirror model 2 version OK');
	};

	callback(model, assertMirrorModels);

	disposable.dispose();
	model.dispose();
	mirrorModel2.dispose();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/editStack.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/editStack.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Selection } from '../../../common/core/selection.js';
import { TextChange } from '../../../common/core/textChange.js';
import { EndOfLineSequence } from '../../../common/model.js';
import { SingleModelEditStackData } from '../../../common/model/editStack.js';

suite('EditStack', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('issue #118041: unicode character undo bug', () => {
		const stackData = new SingleModelEditStackData(
			1,
			2,
			EndOfLineSequence.LF,
			EndOfLineSequence.LF,
			[new Selection(10, 2, 10, 2)],
			[new Selection(10, 1, 10, 1)],
			[new TextChange(428, '﻿', 428, '')]
		);

		const buff = stackData.serialize();
		const actual = SingleModelEditStackData.deserialize(buff);

		assert.deepStrictEqual(actual, stackData);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/intervalTree.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/intervalTree.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { TrackedRangeStickiness } from '../../../common/model.js';
import { IntervalNode, IntervalTree, NodeColor, SENTINEL, getNodeColor, intervalCompare, nodeAcceptEdit, setNodeStickiness } from '../../../common/model/intervalTree.js';

const GENERATE_TESTS = false;
const TEST_COUNT = GENERATE_TESTS ? 10000 : 0;
const PRINT_TREE = false;
const MIN_INTERVAL_START = 1;
const MAX_INTERVAL_END = 100;
const MIN_INSERTS = 1;
const MAX_INSERTS = 30;
const MIN_CHANGE_CNT = 10;
const MAX_CHANGE_CNT = 20;

suite('IntervalTree 1', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	class Interval {
		_intervalBrand: void = undefined;

		public start: number;
		public end: number;

		constructor(start: number, end: number) {
			this.start = start;
			this.end = end;
		}
	}

	class Oracle {
		public intervals: Interval[];

		constructor() {
			this.intervals = [];
		}

		public insert(interval: Interval): Interval {
			this.intervals.push(interval);
			this.intervals.sort((a, b) => {
				if (a.start === b.start) {
					return a.end - b.end;
				}
				return a.start - b.start;
			});
			return interval;
		}

		public delete(interval: Interval): void {
			for (let i = 0, len = this.intervals.length; i < len; i++) {
				if (this.intervals[i] === interval) {
					this.intervals.splice(i, 1);
					return;
				}
			}
		}

		public search(interval: Interval): Interval[] {
			const result: Interval[] = [];
			for (let i = 0, len = this.intervals.length; i < len; i++) {
				const int = this.intervals[i];
				if (int.start <= interval.end && int.end >= interval.start) {
					result.push(int);
				}
			}
			return result;
		}
	}

	class TestState {
		private _oracle: Oracle = new Oracle();
		private _tree: IntervalTree = new IntervalTree();
		private _lastNodeId = -1;
		private _treeNodes: Array<IntervalNode | null> = [];
		private _oracleNodes: Array<Interval | null> = [];

		public acceptOp(op: IOperation): void {

			if (op.type === 'insert') {
				if (PRINT_TREE) {
					console.log(`insert: {${JSON.stringify(new Interval(op.begin, op.end))}}`);
				}
				const nodeId = (++this._lastNodeId);
				this._treeNodes[nodeId] = new IntervalNode(null!, op.begin, op.end);
				this._tree.insert(this._treeNodes[nodeId]!);
				this._oracleNodes[nodeId] = this._oracle.insert(new Interval(op.begin, op.end));
			} else if (op.type === 'delete') {
				if (PRINT_TREE) {
					console.log(`delete: {${JSON.stringify(this._oracleNodes[op.id])}}`);
				}
				this._tree.delete(this._treeNodes[op.id]!);
				this._oracle.delete(this._oracleNodes[op.id]!);

				this._treeNodes[op.id] = null;
				this._oracleNodes[op.id] = null;
			} else if (op.type === 'change') {

				this._tree.delete(this._treeNodes[op.id]!);
				this._treeNodes[op.id]!.reset(0, op.begin, op.end, null!);
				this._tree.insert(this._treeNodes[op.id]!);

				this._oracle.delete(this._oracleNodes[op.id]!);
				this._oracleNodes[op.id]!.start = op.begin;
				this._oracleNodes[op.id]!.end = op.end;
				this._oracle.insert(this._oracleNodes[op.id]!);

			} else {
				const actualNodes = this._tree.intervalSearch(op.begin, op.end, 0, false, false, 0, false);
				const actual = actualNodes.map(n => new Interval(n.cachedAbsoluteStart, n.cachedAbsoluteEnd));
				const expected = this._oracle.search(new Interval(op.begin, op.end));
				assert.deepStrictEqual(actual, expected);
				return;
			}

			if (PRINT_TREE) {
				printTree(this._tree);
			}

			assertTreeInvariants(this._tree);

			const actual = this._tree.getAllInOrder().map(n => new Interval(n.cachedAbsoluteStart, n.cachedAbsoluteEnd));
			const expected = this._oracle.intervals;
			assert.deepStrictEqual(actual, expected);
		}

		public getExistingNodeId(index: number): number {
			let currIndex = -1;
			for (let i = 0; i < this._treeNodes.length; i++) {
				if (this._treeNodes[i] === null) {
					continue;
				}
				currIndex++;
				if (currIndex === index) {
					return i;
				}
			}
			throw new Error('unexpected');
		}
	}

	interface IInsertOperation {
		type: 'insert';
		begin: number;
		end: number;
	}

	interface IDeleteOperation {
		type: 'delete';
		id: number;
	}

	interface IChangeOperation {
		type: 'change';
		id: number;
		begin: number;
		end: number;
	}

	interface ISearchOperation {
		type: 'search';
		begin: number;
		end: number;
	}

	type IOperation = IInsertOperation | IDeleteOperation | IChangeOperation | ISearchOperation;

	function testIntervalTree(ops: IOperation[]): void {
		const state = new TestState();
		for (let i = 0; i < ops.length; i++) {
			state.acceptOp(ops[i]);
		}
	}

	function getRandomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getRandomRange(min: number, max: number): [number, number] {
		const begin = getRandomInt(min, max);
		let length: number;
		if (getRandomInt(1, 10) <= 2) {
			// large range
			length = getRandomInt(0, max - begin);
		} else {
			// small range
			length = getRandomInt(0, Math.min(max - begin, 10));
		}
		return [begin, begin + length];
	}

	class AutoTest {
		private _ops: IOperation[] = [];
		private _state: TestState = new TestState();
		private _insertCnt: number;
		private _deleteCnt: number;
		private _changeCnt: number;

		constructor() {
			this._insertCnt = getRandomInt(MIN_INSERTS, MAX_INSERTS);
			this._changeCnt = getRandomInt(MIN_CHANGE_CNT, MAX_CHANGE_CNT);
			this._deleteCnt = 0;
		}

		private _doRandomInsert(): void {
			const range = getRandomRange(MIN_INTERVAL_START, MAX_INTERVAL_END);
			this._run({
				type: 'insert',
				begin: range[0],
				end: range[1]
			});
		}

		private _doRandomDelete(): void {
			const idx = getRandomInt(Math.floor(this._deleteCnt / 2), this._deleteCnt - 1);
			this._run({
				type: 'delete',
				id: this._state.getExistingNodeId(idx)
			});
		}

		private _doRandomChange(): void {
			const idx = getRandomInt(0, this._deleteCnt - 1);
			const range = getRandomRange(MIN_INTERVAL_START, MAX_INTERVAL_END);
			this._run({
				type: 'change',
				id: this._state.getExistingNodeId(idx),
				begin: range[0],
				end: range[1]
			});
		}

		public run() {
			while (this._insertCnt > 0 || this._deleteCnt > 0 || this._changeCnt > 0) {
				if (this._insertCnt > 0) {
					this._doRandomInsert();
					this._insertCnt--;
					this._deleteCnt++;
				} else if (this._changeCnt > 0) {
					this._doRandomChange();
					this._changeCnt--;
				} else {
					this._doRandomDelete();
					this._deleteCnt--;
				}

				// Let's also search for something...
				const searchRange = getRandomRange(MIN_INTERVAL_START, MAX_INTERVAL_END);
				this._run({
					type: 'search',
					begin: searchRange[0],
					end: searchRange[1]
				});
			}
		}

		private _run(op: IOperation): void {
			this._ops.push(op);
			this._state.acceptOp(op);
		}

		public print(): void {
			console.log(`testIntervalTree(${JSON.stringify(this._ops)})`);
		}

	}

	suite('generated', () => {
		test('gen01', () => {
			testIntervalTree([
				{ type: 'insert', begin: 28, end: 35 },
				{ type: 'insert', begin: 52, end: 54 },
				{ type: 'insert', begin: 63, end: 69 }
			]);
		});

		test('gen02', () => {
			testIntervalTree([
				{ type: 'insert', begin: 80, end: 89 },
				{ type: 'insert', begin: 92, end: 100 },
				{ type: 'insert', begin: 99, end: 99 }
			]);
		});

		test('gen03', () => {
			testIntervalTree([
				{ type: 'insert', begin: 89, end: 96 },
				{ type: 'insert', begin: 71, end: 74 },
				{ type: 'delete', id: 1 }
			]);
		});

		test('gen04', () => {
			testIntervalTree([
				{ type: 'insert', begin: 44, end: 46 },
				{ type: 'insert', begin: 85, end: 88 },
				{ type: 'delete', id: 0 }
			]);
		});

		test('gen05', () => {
			testIntervalTree([
				{ type: 'insert', begin: 82, end: 90 },
				{ type: 'insert', begin: 69, end: 73 },
				{ type: 'delete', id: 0 },
				{ type: 'delete', id: 1 }
			]);
		});

		test('gen06', () => {
			testIntervalTree([
				{ type: 'insert', begin: 41, end: 63 },
				{ type: 'insert', begin: 98, end: 98 },
				{ type: 'insert', begin: 47, end: 51 },
				{ type: 'delete', id: 2 }
			]);
		});

		test('gen07', () => {
			testIntervalTree([
				{ type: 'insert', begin: 24, end: 26 },
				{ type: 'insert', begin: 11, end: 28 },
				{ type: 'insert', begin: 27, end: 30 },
				{ type: 'insert', begin: 80, end: 85 },
				{ type: 'delete', id: 1 }
			]);
		});

		test('gen08', () => {
			testIntervalTree([
				{ type: 'insert', begin: 100, end: 100 },
				{ type: 'insert', begin: 100, end: 100 }
			]);
		});

		test('gen09', () => {
			testIntervalTree([
				{ type: 'insert', begin: 58, end: 65 },
				{ type: 'insert', begin: 82, end: 96 },
				{ type: 'insert', begin: 58, end: 65 }
			]);
		});

		test('gen10', () => {
			testIntervalTree([
				{ type: 'insert', begin: 32, end: 40 },
				{ type: 'insert', begin: 25, end: 29 },
				{ type: 'insert', begin: 24, end: 32 }
			]);
		});

		test('gen11', () => {
			testIntervalTree([
				{ type: 'insert', begin: 25, end: 70 },
				{ type: 'insert', begin: 99, end: 100 },
				{ type: 'insert', begin: 46, end: 51 },
				{ type: 'insert', begin: 57, end: 57 },
				{ type: 'delete', id: 2 }
			]);
		});

		test('gen12', () => {
			testIntervalTree([
				{ type: 'insert', begin: 20, end: 26 },
				{ type: 'insert', begin: 10, end: 18 },
				{ type: 'insert', begin: 99, end: 99 },
				{ type: 'insert', begin: 37, end: 59 },
				{ type: 'delete', id: 2 }
			]);
		});

		test('gen13', () => {
			testIntervalTree([
				{ type: 'insert', begin: 3, end: 91 },
				{ type: 'insert', begin: 57, end: 57 },
				{ type: 'insert', begin: 35, end: 44 },
				{ type: 'insert', begin: 72, end: 81 },
				{ type: 'delete', id: 2 }
			]);
		});

		test('gen14', () => {
			testIntervalTree([
				{ type: 'insert', begin: 58, end: 61 },
				{ type: 'insert', begin: 34, end: 35 },
				{ type: 'insert', begin: 56, end: 62 },
				{ type: 'insert', begin: 69, end: 78 },
				{ type: 'delete', id: 0 }
			]);
		});

		test('gen15', () => {
			testIntervalTree([
				{ type: 'insert', begin: 63, end: 69 },
				{ type: 'insert', begin: 17, end: 24 },
				{ type: 'insert', begin: 3, end: 13 },
				{ type: 'insert', begin: 84, end: 94 },
				{ type: 'insert', begin: 18, end: 23 },
				{ type: 'insert', begin: 96, end: 98 },
				{ type: 'delete', id: 1 }
			]);
		});

		test('gen16', () => {
			testIntervalTree([
				{ type: 'insert', begin: 27, end: 27 },
				{ type: 'insert', begin: 42, end: 87 },
				{ type: 'insert', begin: 42, end: 49 },
				{ type: 'insert', begin: 69, end: 71 },
				{ type: 'insert', begin: 20, end: 27 },
				{ type: 'insert', begin: 8, end: 9 },
				{ type: 'insert', begin: 42, end: 49 },
				{ type: 'delete', id: 1 }
			]);
		});

		test('gen17', () => {
			testIntervalTree([
				{ type: 'insert', begin: 21, end: 23 },
				{ type: 'insert', begin: 83, end: 87 },
				{ type: 'insert', begin: 56, end: 58 },
				{ type: 'insert', begin: 1, end: 55 },
				{ type: 'insert', begin: 56, end: 59 },
				{ type: 'insert', begin: 58, end: 60 },
				{ type: 'insert', begin: 56, end: 65 },
				{ type: 'delete', id: 1 },
				{ type: 'delete', id: 0 },
				{ type: 'delete', id: 6 }
			]);
		});

		test('gen18', () => {
			testIntervalTree([
				{ type: 'insert', begin: 25, end: 25 },
				{ type: 'insert', begin: 67, end: 79 },
				{ type: 'delete', id: 0 },
				{ type: 'search', begin: 65, end: 75 }
			]);
		});

		test('force delta overflow', () => {
			// Search the IntervalNode ctor for FORCE_OVERFLOWING_TEST
			// to force that this test leads to a delta normalization
			testIntervalTree([
				{ type: 'insert', begin: 686081138593427, end: 733009856502260 },
				{ type: 'insert', begin: 591031326181669, end: 591031326181672 },
				{ type: 'insert', begin: 940037682731896, end: 940037682731903 },
				{ type: 'insert', begin: 598413641151120, end: 598413641151128 },
				{ type: 'insert', begin: 800564156553344, end: 800564156553351 },
				{ type: 'insert', begin: 894198957565481, end: 894198957565491 }
			]);
		});
	});

	// TEST_COUNT = 0;
	// PRINT_TREE = true;

	for (let i = 0; i < TEST_COUNT; i++) {
		if (i % 100 === 0) {
			console.log(`TEST ${i + 1}/${TEST_COUNT}`);
		}
		const test = new AutoTest();

		try {
			test.run();
		} catch (err) {
			console.log(err);
			test.print();
			return;
		}
	}

	suite('searching', () => {

		function createCormenTree(): IntervalTree {
			const r = new IntervalTree();
			const data: [number, number][] = [
				[16, 21],
				[8, 9],
				[25, 30],
				[5, 8],
				[15, 23],
				[17, 19],
				[26, 26],
				[0, 3],
				[6, 10],
				[19, 20]
			];
			data.forEach((int) => {
				const node = new IntervalNode(null!, int[0], int[1]);
				r.insert(node);
			});
			return r;
		}

		const T = createCormenTree();

		function assertIntervalSearch(start: number, end: number, expected: [number, number][]): void {
			const actualNodes = T.intervalSearch(start, end, 0, false, false, 0, false);
			const actual = actualNodes.map((n) => <[number, number]>[n.cachedAbsoluteStart, n.cachedAbsoluteEnd]);
			assert.deepStrictEqual(actual, expected);
		}

		test('cormen 1->2', () => {
			assertIntervalSearch(
				1, 2,
				[
					[0, 3],
				]
			);
		});

		test('cormen 4->8', () => {
			assertIntervalSearch(
				4, 8,
				[
					[5, 8],
					[6, 10],
					[8, 9],
				]
			);
		});

		test('cormen 10->15', () => {
			assertIntervalSearch(
				10, 15,
				[
					[6, 10],
					[15, 23],
				]
			);
		});

		test('cormen 21->25', () => {
			assertIntervalSearch(
				21, 25,
				[
					[15, 23],
					[16, 21],
					[25, 30],
				]
			);
		});

		test('cormen 24->24', () => {
			assertIntervalSearch(
				24, 24,
				[
				]
			);
		});
	});
});

suite('IntervalTree 2', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function assertNodeAcceptEdit(msg: string, nodeStart: number, nodeEnd: number, nodeStickiness: TrackedRangeStickiness, start: number, end: number, textLength: number, forceMoveMarkers: boolean, expectedNodeStart: number, expectedNodeEnd: number): void {
		const node = new IntervalNode('', nodeStart, nodeEnd);
		setNodeStickiness(node, nodeStickiness);
		nodeAcceptEdit(node, start, end, textLength, forceMoveMarkers);
		assert.deepStrictEqual([node.start, node.end], [expectedNodeStart, expectedNodeEnd], msg);
	}

	test('nodeAcceptEdit', () => {
		// A. collapsed decoration
		{
			// no-op
			assertNodeAcceptEdit('A.000', 0, 0, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 0, 0, 0, false, 0, 0);
			assertNodeAcceptEdit('A.001', 0, 0, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 0, 0, 0, false, 0, 0);
			assertNodeAcceptEdit('A.002', 0, 0, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 0, 0, 0, false, 0, 0);
			assertNodeAcceptEdit('A.003', 0, 0, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 0, 0, 0, false, 0, 0);
			assertNodeAcceptEdit('A.004', 0, 0, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 0, 0, 0, true, 0, 0);
			assertNodeAcceptEdit('A.005', 0, 0, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 0, 0, 0, true, 0, 0);
			assertNodeAcceptEdit('A.006', 0, 0, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 0, 0, 0, true, 0, 0);
			assertNodeAcceptEdit('A.007', 0, 0, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 0, 0, 0, true, 0, 0);
			// insertion
			assertNodeAcceptEdit('A.008', 0, 0, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 0, 0, 1, false, 0, 1);
			assertNodeAcceptEdit('A.009', 0, 0, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 0, 0, 1, false, 1, 1);
			assertNodeAcceptEdit('A.010', 0, 0, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 0, 0, 1, false, 0, 0);
			assertNodeAcceptEdit('A.011', 0, 0, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 0, 0, 1, false, 1, 1);
			assertNodeAcceptEdit('A.012', 0, 0, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 0, 0, 1, true, 1, 1);
			assertNodeAcceptEdit('A.013', 0, 0, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 0, 0, 1, true, 1, 1);
			assertNodeAcceptEdit('A.014', 0, 0, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 0, 0, 1, true, 1, 1);
			assertNodeAcceptEdit('A.015', 0, 0, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 0, 0, 1, true, 1, 1);
		}

		// B. non collapsed decoration
		{
			// no-op
			assertNodeAcceptEdit('B.000', 0, 5, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 0, 0, 0, false, 0, 5);
			assertNodeAcceptEdit('B.001', 0, 5, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 0, 0, 0, false, 0, 5);
			assertNodeAcceptEdit('B.002', 0, 5, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 0, 0, 0, false, 0, 5);
			assertNodeAcceptEdit('B.003', 0, 5, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 0, 0, 0, false, 0, 5);
			assertNodeAcceptEdit('B.004', 0, 5, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 0, 0, 0, true, 0, 5);
			assertNodeAcceptEdit('B.005', 0, 5, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 0, 0, 0, true, 0, 5);
			assertNodeAcceptEdit('B.006', 0, 5, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 0, 0, 0, true, 0, 5);
			assertNodeAcceptEdit('B.007', 0, 5, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 0, 0, 0, true, 0, 5);
			// insertion at start
			assertNodeAcceptEdit('B.008', 0, 5, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 0, 0, 1, false, 0, 6);
			assertNodeAcceptEdit('B.009', 0, 5, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 0, 0, 1, false, 1, 6);
			assertNodeAcceptEdit('B.010', 0, 5, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 0, 0, 1, false, 0, 6);
			assertNodeAcceptEdit('B.011', 0, 5, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 0, 0, 1, false, 1, 6);
			assertNodeAcceptEdit('B.012', 0, 5, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 0, 0, 1, true, 1, 6);
			assertNodeAcceptEdit('B.013', 0, 5, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 0, 0, 1, true, 1, 6);
			assertNodeAcceptEdit('B.014', 0, 5, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 0, 0, 1, true, 1, 6);
			assertNodeAcceptEdit('B.015', 0, 5, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 0, 0, 1, true, 1, 6);
			// insertion in middle
			assertNodeAcceptEdit('B.016', 0, 5, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 2, 2, 1, false, 0, 6);
			assertNodeAcceptEdit('B.017', 0, 5, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 2, 2, 1, false, 0, 6);
			assertNodeAcceptEdit('B.018', 0, 5, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 2, 2, 1, false, 0, 6);
			assertNodeAcceptEdit('B.019', 0, 5, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 2, 2, 1, false, 0, 6);
			assertNodeAcceptEdit('B.020', 0, 5, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 2, 2, 1, true, 0, 6);
			assertNodeAcceptEdit('B.021', 0, 5, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 2, 2, 1, true, 0, 6);
			assertNodeAcceptEdit('B.022', 0, 5, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 2, 2, 1, true, 0, 6);
			assertNodeAcceptEdit('B.023', 0, 5, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 2, 2, 1, true, 0, 6);
			// insertion at end
			assertNodeAcceptEdit('B.024', 0, 5, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 5, 5, 1, false, 0, 6);
			assertNodeAcceptEdit('B.025', 0, 5, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 5, 5, 1, false, 0, 5);
			assertNodeAcceptEdit('B.026', 0, 5, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 5, 5, 1, false, 0, 5);
			assertNodeAcceptEdit('B.027', 0, 5, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 5, 5, 1, false, 0, 6);
			assertNodeAcceptEdit('B.028', 0, 5, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 5, 5, 1, true, 0, 6);
			assertNodeAcceptEdit('B.029', 0, 5, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 5, 5, 1, true, 0, 6);
			assertNodeAcceptEdit('B.030', 0, 5, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 5, 5, 1, true, 0, 6);
			assertNodeAcceptEdit('B.031', 0, 5, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 5, 5, 1, true, 0, 6);

			// replace with larger text until start
			assertNodeAcceptEdit('B.032', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 4, 5, 2, false, 5, 11);
			assertNodeAcceptEdit('B.033', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 4, 5, 2, false, 6, 11);
			assertNodeAcceptEdit('B.034', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 4, 5, 2, false, 5, 11);
			assertNodeAcceptEdit('B.035', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 4, 5, 2, false, 6, 11);
			assertNodeAcceptEdit('B.036', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 4, 5, 2, true, 6, 11);
			assertNodeAcceptEdit('B.037', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 4, 5, 2, true, 6, 11);
			assertNodeAcceptEdit('B.038', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 4, 5, 2, true, 6, 11);
			assertNodeAcceptEdit('B.039', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 4, 5, 2, true, 6, 11);
			// replace with smaller text until start
			assertNodeAcceptEdit('B.040', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 3, 5, 1, false, 4, 9);
			assertNodeAcceptEdit('B.041', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 3, 5, 1, false, 4, 9);
			assertNodeAcceptEdit('B.042', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 3, 5, 1, false, 4, 9);
			assertNodeAcceptEdit('B.043', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 3, 5, 1, false, 4, 9);
			assertNodeAcceptEdit('B.044', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 3, 5, 1, true, 4, 9);
			assertNodeAcceptEdit('B.045', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 3, 5, 1, true, 4, 9);
			assertNodeAcceptEdit('B.046', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 3, 5, 1, true, 4, 9);
			assertNodeAcceptEdit('B.047', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 3, 5, 1, true, 4, 9);

			// replace with larger text select start
			assertNodeAcceptEdit('B.048', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 4, 6, 3, false, 5, 11);
			assertNodeAcceptEdit('B.049', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 4, 6, 3, false, 5, 11);
			assertNodeAcceptEdit('B.050', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 4, 6, 3, false, 5, 11);
			assertNodeAcceptEdit('B.051', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 4, 6, 3, false, 5, 11);
			assertNodeAcceptEdit('B.052', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 4, 6, 3, true, 7, 11);
			assertNodeAcceptEdit('B.053', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 4, 6, 3, true, 7, 11);
			assertNodeAcceptEdit('B.054', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 4, 6, 3, true, 7, 11);
			assertNodeAcceptEdit('B.055', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 4, 6, 3, true, 7, 11);
			// replace with smaller text select start
			assertNodeAcceptEdit('B.056', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 4, 6, 1, false, 5, 9);
			assertNodeAcceptEdit('B.057', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 4, 6, 1, false, 5, 9);
			assertNodeAcceptEdit('B.058', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 4, 6, 1, false, 5, 9);
			assertNodeAcceptEdit('B.059', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 4, 6, 1, false, 5, 9);
			assertNodeAcceptEdit('B.060', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 4, 6, 1, true, 5, 9);
			assertNodeAcceptEdit('B.061', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 4, 6, 1, true, 5, 9);
			assertNodeAcceptEdit('B.062', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 4, 6, 1, true, 5, 9);
			assertNodeAcceptEdit('B.063', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 4, 6, 1, true, 5, 9);

			// replace with larger text from start
			assertNodeAcceptEdit('B.064', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 5, 6, 2, false, 5, 11);
			assertNodeAcceptEdit('B.065', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 5, 6, 2, false, 5, 11);
			assertNodeAcceptEdit('B.066', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 5, 6, 2, false, 5, 11);
			assertNodeAcceptEdit('B.067', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 5, 6, 2, false, 5, 11);
			assertNodeAcceptEdit('B.068', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 5, 6, 2, true, 7, 11);
			assertNodeAcceptEdit('B.069', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 5, 6, 2, true, 7, 11);
			assertNodeAcceptEdit('B.070', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 5, 6, 2, true, 7, 11);
			assertNodeAcceptEdit('B.071', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 5, 6, 2, true, 7, 11);
			// replace with smaller text from start
			assertNodeAcceptEdit('B.072', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 5, 7, 1, false, 5, 9);
			assertNodeAcceptEdit('B.073', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 5, 7, 1, false, 5, 9);
			assertNodeAcceptEdit('B.074', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 5, 7, 1, false, 5, 9);
			assertNodeAcceptEdit('B.075', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 5, 7, 1, false, 5, 9);
			assertNodeAcceptEdit('B.076', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 5, 7, 1, true, 6, 9);
			assertNodeAcceptEdit('B.077', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 5, 7, 1, true, 6, 9);
			assertNodeAcceptEdit('B.078', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 5, 7, 1, true, 6, 9);
			assertNodeAcceptEdit('B.079', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 5, 7, 1, true, 6, 9);

			// replace with larger text to end
			assertNodeAcceptEdit('B.080', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 9, 10, 2, false, 5, 11);
			assertNodeAcceptEdit('B.081', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 9, 10, 2, false, 5, 10);
			assertNodeAcceptEdit('B.082', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 9, 10, 2, false, 5, 10);
			assertNodeAcceptEdit('B.083', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 9, 10, 2, false, 5, 11);
			assertNodeAcceptEdit('B.084', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 9, 10, 2, true, 5, 11);
			assertNodeAcceptEdit('B.085', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 9, 10, 2, true, 5, 11);
			assertNodeAcceptEdit('B.086', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 9, 10, 2, true, 5, 11);
			assertNodeAcceptEdit('B.087', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 9, 10, 2, true, 5, 11);
			// replace with smaller text to end
			assertNodeAcceptEdit('B.088', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 8, 10, 1, false, 5, 9);
			assertNodeAcceptEdit('B.089', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 8, 10, 1, false, 5, 9);
			assertNodeAcceptEdit('B.090', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 8, 10, 1, false, 5, 9);
			assertNodeAcceptEdit('B.091', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 8, 10, 1, false, 5, 9);
			assertNodeAcceptEdit('B.092', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 8, 10, 1, true, 5, 9);
			assertNodeAcceptEdit('B.093', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 8, 10, 1, true, 5, 9);
			assertNodeAcceptEdit('B.094', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 8, 10, 1, true, 5, 9);
			assertNodeAcceptEdit('B.095', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 8, 10, 1, true, 5, 9);

			// replace with larger text select end
			assertNodeAcceptEdit('B.096', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 9, 11, 3, false, 5, 10);
			assertNodeAcceptEdit('B.097', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 9, 11, 3, false, 5, 10);
			assertNodeAcceptEdit('B.098', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 9, 11, 3, false, 5, 10);
			assertNodeAcceptEdit('B.099', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 9, 11, 3, false, 5, 10);
			assertNodeAcceptEdit('B.100', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 9, 11, 3, true, 5, 12);
			assertNodeAcceptEdit('B.101', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 9, 11, 3, true, 5, 12);
			assertNodeAcceptEdit('B.102', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 9, 11, 3, true, 5, 12);
			assertNodeAcceptEdit('B.103', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 9, 11, 3, true, 5, 12);
			// replace with smaller text select end
			assertNodeAcceptEdit('B.104', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 9, 11, 1, false, 5, 10);
			assertNodeAcceptEdit('B.105', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 9, 11, 1, false, 5, 10);
			assertNodeAcceptEdit('B.106', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 9, 11, 1, false, 5, 10);
			assertNodeAcceptEdit('B.107', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 9, 11, 1, false, 5, 10);
			assertNodeAcceptEdit('B.108', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 9, 11, 1, true, 5, 10);
			assertNodeAcceptEdit('B.109', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 9, 11, 1, true, 5, 10);
			assertNodeAcceptEdit('B.110', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 9, 11, 1, true, 5, 10);
			assertNodeAcceptEdit('B.111', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 9, 11, 1, true, 5, 10);

			// replace with larger text from end
			assertNodeAcceptEdit('B.112', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 10, 11, 3, false, 5, 10);
			assertNodeAcceptEdit('B.113', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 10, 11, 3, false, 5, 10);
			assertNodeAcceptEdit('B.114', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 10, 11, 3, false, 5, 10);
			assertNodeAcceptEdit('B.115', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 10, 11, 3, false, 5, 10);
			assertNodeAcceptEdit('B.116', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 10, 11, 3, true, 5, 13);
			assertNodeAcceptEdit('B.117', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 10, 11, 3, true, 5, 13);
			assertNodeAcceptEdit('B.118', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 10, 11, 3, true, 5, 13);
			assertNodeAcceptEdit('B.119', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 10, 11, 3, true, 5, 13);
			// replace with smaller text from end
			assertNodeAcceptEdit('B.120', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 10, 12, 1, false, 5, 10);
			assertNodeAcceptEdit('B.121', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 10, 12, 1, false, 5, 10);
			assertNodeAcceptEdit('B.122', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 10, 12, 1, false, 5, 10);
			assertNodeAcceptEdit('B.123', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 10, 12, 1, false, 5, 10);
			assertNodeAcceptEdit('B.124', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 10, 12, 1, true, 5, 11);
			assertNodeAcceptEdit('B.125', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 10, 12, 1, true, 5, 11);
			assertNodeAcceptEdit('B.126', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 10, 12, 1, true, 5, 11);
			assertNodeAcceptEdit('B.127', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 10, 12, 1, true, 5, 11);

			// delete until start
			assertNodeAcceptEdit('B.128', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 4, 5, 0, false, 4, 9);
			assertNodeAcceptEdit('B.129', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 4, 5, 0, false, 4, 9);
			assertNodeAcceptEdit('B.130', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 4, 5, 0, false, 4, 9);
			assertNodeAcceptEdit('B.131', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 4, 5, 0, false, 4, 9);
			assertNodeAcceptEdit('B.132', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 4, 5, 0, true, 4, 9);
			assertNodeAcceptEdit('B.133', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 4, 5, 0, true, 4, 9);
			assertNodeAcceptEdit('B.134', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 4, 5, 0, true, 4, 9);
			assertNodeAcceptEdit('B.135', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 4, 5, 0, true, 4, 9);

			// delete select start
			assertNodeAcceptEdit('B.136', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 4, 6, 0, false, 4, 8);
			assertNodeAcceptEdit('B.137', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 4, 6, 0, false, 4, 8);
			assertNodeAcceptEdit('B.138', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 4, 6, 0, false, 4, 8);
			assertNodeAcceptEdit('B.139', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 4, 6, 0, false, 4, 8);
			assertNodeAcceptEdit('B.140', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 4, 6, 0, true, 4, 8);
			assertNodeAcceptEdit('B.141', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 4, 6, 0, true, 4, 8);
			assertNodeAcceptEdit('B.142', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 4, 6, 0, true, 4, 8);
			assertNodeAcceptEdit('B.143', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 4, 6, 0, true, 4, 8);

			// delete from start
			assertNodeAcceptEdit('B.144', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 5, 6, 0, false, 5, 9);
			assertNodeAcceptEdit('B.145', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 5, 6, 0, false, 5, 9);
			assertNodeAcceptEdit('B.146', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 5, 6, 0, false, 5, 9);
			assertNodeAcceptEdit('B.147', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 5, 6, 0, false, 5, 9);
			assertNodeAcceptEdit('B.148', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 5, 6, 0, true, 5, 9);
			assertNodeAcceptEdit('B.149', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 5, 6, 0, true, 5, 9);
			assertNodeAcceptEdit('B.150', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 5, 6, 0, true, 5, 9);
			assertNodeAcceptEdit('B.151', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 5, 6, 0, true, 5, 9);

			// delete to end
			assertNodeAcceptEdit('B.152', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 9, 10, 0, false, 5, 9);
			assertNodeAcceptEdit('B.153', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 9, 10, 0, false, 5, 9);
			assertNodeAcceptEdit('B.154', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 9, 10, 0, false, 5, 9);
			assertNodeAcceptEdit('B.155', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 9, 10, 0, false, 5, 9);
			assertNodeAcceptEdit('B.156', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 9, 10, 0, true, 5, 9);
			assertNodeAcceptEdit('B.157', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 9, 10, 0, true, 5, 9);
			assertNodeAcceptEdit('B.158', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 9, 10, 0, true, 5, 9);
			assertNodeAcceptEdit('B.159', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 9, 10, 0, true, 5, 9);

			// delete select end
			assertNodeAcceptEdit('B.160', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 9, 11, 0, false, 5, 9);
			assertNodeAcceptEdit('B.161', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 9, 11, 0, false, 5, 9);
			assertNodeAcceptEdit('B.162', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 9, 11, 0, false, 5, 9);
			assertNodeAcceptEdit('B.163', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 9, 11, 0, false, 5, 9);
			assertNodeAcceptEdit('B.164', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 9, 11, 0, true, 5, 9);
			assertNodeAcceptEdit('B.165', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 9, 11, 0, true, 5, 9);
			assertNodeAcceptEdit('B.166', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 9, 11, 0, true, 5, 9);
			assertNodeAcceptEdit('B.167', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 9, 11, 0, true, 5, 9);

			// delete from end
			assertNodeAcceptEdit('B.168', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 10, 11, 0, false, 5, 10);
			assertNodeAcceptEdit('B.169', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 10, 11, 0, false, 5, 10);
			assertNodeAcceptEdit('B.170', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 10, 11, 0, false, 5, 10);
			assertNodeAcceptEdit('B.171', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 10, 11, 0, false, 5, 10);
			assertNodeAcceptEdit('B.172', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 10, 11, 0, true, 5, 10);
			assertNodeAcceptEdit('B.173', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 10, 11, 0, true, 5, 10);
			assertNodeAcceptEdit('B.174', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 10, 11, 0, true, 5, 10);
			assertNodeAcceptEdit('B.175', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 10, 11, 0, true, 5, 10);

			// replace with larger text entire
			assertNodeAcceptEdit('B.176', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 5, 10, 3, false, 5, 8);
			assertNodeAcceptEdit('B.177', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 5, 10, 3, false, 5, 8);
			assertNodeAcceptEdit('B.178', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 5, 10, 3, false, 5, 8);
			assertNodeAcceptEdit('B.179', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 5, 10, 3, false, 5, 8);
			assertNodeAcceptEdit('B.180', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 5, 10, 3, true, 8, 8);
			assertNodeAcceptEdit('B.181', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 5, 10, 3, true, 8, 8);
			assertNodeAcceptEdit('B.182', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 5, 10, 3, true, 8, 8);
			assertNodeAcceptEdit('B.183', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 5, 10, 3, true, 8, 8);
			// replace with smaller text entire
			assertNodeAcceptEdit('B.184', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 5, 10, 7, false, 5, 12);
			assertNodeAcceptEdit('B.185', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 5, 10, 7, false, 5, 10);
			assertNodeAcceptEdit('B.186', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 5, 10, 7, false, 5, 10);
			assertNodeAcceptEdit('B.187', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 5, 10, 7, false, 5, 12);
			assertNodeAcceptEdit('B.188', 5, 10, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, 5, 10, 7, true, 12, 12);
			assertNodeAcceptEdit('B.189', 5, 10, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, 5, 10, 7, true, 12, 12);
			assertNodeAcceptEdit('B.190', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingBefore, 5, 10, 7, true, 12, 12);
			assertNodeAcceptEdit('B.191', 5, 10, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter, 5, 10, 7, true, 12, 12);

		}
	});
});

function printTree(T: IntervalTree): void {
	if (T.root === SENTINEL) {
		console.log(`~~ empty`);
		return;
	}
	const out: string[] = [];
	_printTree(T, T.root, '', 0, out);
	console.log(out.join(''));
}

function _printTree(T: IntervalTree, n: IntervalNode, indent: string, delta: number, out: string[]): void {
	out.push(`${indent}[${getNodeColor(n) === NodeColor.Red ? 'R' : 'B'},${n.delta}, ${n.start}->${n.end}, ${n.maxEnd}] : {${delta + n.start}->${delta + n.end}}, maxEnd: ${n.maxEnd + delta}\n`);
	if (n.left !== SENTINEL) {
		_printTree(T, n.left, indent + '    ', delta, out);
	} else {
		out.push(`${indent}    NIL\n`);
	}
	if (n.right !== SENTINEL) {
		_printTree(T, n.right, indent + '    ', delta + n.delta, out);
	} else {
		out.push(`${indent}    NIL\n`);
	}
}

//#region Assertion

function assertTreeInvariants(T: IntervalTree): void {
	assert(getNodeColor(SENTINEL) === NodeColor.Black);
	assert(SENTINEL.parent === SENTINEL);
	assert(SENTINEL.left === SENTINEL);
	assert(SENTINEL.right === SENTINEL);
	assert(SENTINEL.start === 0);
	assert(SENTINEL.end === 0);
	assert(SENTINEL.delta === 0);
	assert(T.root.parent === SENTINEL);
	assertValidTree(T);
}

function depth(n: IntervalNode): number {
	if (n === SENTINEL) {
		// The leafs are black
		return 1;
	}
	assert(depth(n.left) === depth(n.right));
	return (getNodeColor(n) === NodeColor.Black ? 1 : 0) + depth(n.left);
}

function assertValidNode(n: IntervalNode, delta: number): void {
	if (n === SENTINEL) {
		return;
	}

	const l = n.left;
	const r = n.right;

	if (getNodeColor(n) === NodeColor.Red) {
		assert(getNodeColor(l) === NodeColor.Black);
		assert(getNodeColor(r) === NodeColor.Black);
	}

	let expectedMaxEnd = n.end;
	if (l !== SENTINEL) {
		assert(intervalCompare(l.start + delta, l.end + delta, n.start + delta, n.end + delta) <= 0);
		expectedMaxEnd = Math.max(expectedMaxEnd, l.maxEnd);
	}
	if (r !== SENTINEL) {
		assert(intervalCompare(n.start + delta, n.end + delta, r.start + delta + n.delta, r.end + delta + n.delta) <= 0);
		expectedMaxEnd = Math.max(expectedMaxEnd, r.maxEnd + n.delta);
	}
	assert(n.maxEnd === expectedMaxEnd);

	assertValidNode(l, delta);
	assertValidNode(r, delta + n.delta);
}

function assertValidTree(T: IntervalTree): void {
	if (T.root === SENTINEL) {
		return;
	}
	assert(getNodeColor(T.root) === NodeColor.Black);
	assert(depth(T.root.left) === depth(T.root.right));
	assertValidNode(T.root, 0);
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/model.line.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/model.line.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Range } from '../../../common/core/range.js';
import { MetadataConsts } from '../../../common/encodedTokenAttributes.js';
import { EncodedTokenizationResult, IBackgroundTokenizationStore, IBackgroundTokenizer, IState, ITokenizationSupport, TokenizationRegistry, TokenizationResult } from '../../../common/languages.js';
import { ITextModel } from '../../../common/model.js';
import { computeIndentLevel } from '../../../common/model/utils.js';
import { ContiguousMultilineTokensBuilder } from '../../../common/tokens/contiguousMultilineTokensBuilder.js';
import { LineTokens } from '../../../common/tokens/lineTokens.js';
import { TestLineToken, TestLineTokenFactory } from '../core/testLineToken.js';
import { createTextModel } from '../testTextModel.js';

interface ILineEdit {
	startColumn: number;
	endColumn: number;
	text: string;
}

function assertLineTokens(__actual: LineTokens, _expected: TestToken[]): void {
	const tmp = TestToken.toTokens(_expected);
	LineTokens.convertToEndOffset(tmp, __actual.getLineContent().length);
	const expected = TestLineTokenFactory.inflateArr(tmp);
	const _actual = __actual.inflate();
	interface ITestToken {
		endIndex: number;
		type: string;
	}
	const actual: ITestToken[] = [];
	for (let i = 0, len = _actual.getCount(); i < len; i++) {
		actual[i] = {
			endIndex: _actual.getEndOffset(i),
			type: _actual.getClassName(i)
		};
	}
	const decode = (token: TestLineToken) => {
		return {
			endIndex: token.endIndex,
			type: token.getType()
		};
	};
	assert.deepStrictEqual(actual, expected.map(decode));
}

suite('ModelLine - getIndentLevel', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function assertIndentLevel(text: string, expected: number, tabSize: number = 4): void {
		const actual = computeIndentLevel(text, tabSize);
		assert.strictEqual(actual, expected, text);
	}

	test('getIndentLevel', () => {
		assertIndentLevel('', -1);
		assertIndentLevel(' ', -1);
		assertIndentLevel('   \t', -1);
		assertIndentLevel('Hello', 0);
		assertIndentLevel(' Hello', 1);
		assertIndentLevel('   Hello', 3);
		assertIndentLevel('\tHello', 4);
		assertIndentLevel(' \tHello', 4);
		assertIndentLevel('  \tHello', 4);
		assertIndentLevel('   \tHello', 4);
		assertIndentLevel('    \tHello', 8);
		assertIndentLevel('     \tHello', 8);
		assertIndentLevel('\t Hello', 5);
		assertIndentLevel('\t \tHello', 8);
	});
});

class TestToken {
	public readonly startOffset: number;
	public readonly color: number;

	constructor(startOffset: number, color: number) {
		this.startOffset = startOffset;
		this.color = color;
	}

	public static toTokens(tokens: TestToken[]): Uint32Array;
	public static toTokens(tokens: TestToken[] | null): Uint32Array | null {
		if (tokens === null) {
			return null;
		}
		const tokensLen = tokens.length;
		const result = new Uint32Array((tokensLen << 1));
		for (let i = 0; i < tokensLen; i++) {
			const token = tokens[i];
			result[(i << 1)] = token.startOffset;
			result[(i << 1) + 1] = (
				token.color << MetadataConsts.FOREGROUND_OFFSET
			) >>> 0;
		}
		return result;
	}
}

class ManualTokenizationSupport implements ITokenizationSupport {
	private readonly tokens = new Map<number, Uint32Array>();
	private readonly stores = new Set<IBackgroundTokenizationStore>();

	public setLineTokens(lineNumber: number, tokens: Uint32Array): void {
		const b = new ContiguousMultilineTokensBuilder();
		b.add(lineNumber, tokens);
		for (const s of this.stores) {
			s.setTokens(b.finalize());
		}
	}

	getInitialState(): IState {
		return new LineState(1);
	}

	tokenize(line: string, hasEOL: boolean, state: IState): TokenizationResult {
		throw new Error();
	}

	tokenizeEncoded(line: string, hasEOL: boolean, state: IState): EncodedTokenizationResult {
		const s = state as LineState;
		return new EncodedTokenizationResult(this.tokens.get(s.lineNumber)!, [], new LineState(s.lineNumber + 1));
	}

	/**
	 * Can be/return undefined if default background tokenization should be used.
	 */
	createBackgroundTokenizer?(textModel: ITextModel, store: IBackgroundTokenizationStore): IBackgroundTokenizer | undefined {
		this.stores.add(store);
		return {
			dispose: () => {
				this.stores.delete(store);
			},
			requestTokens(startLineNumber, endLineNumberExclusive) {
			},
		};
	}
}

class LineState implements IState {
	constructor(public readonly lineNumber: number) { }
	clone(): IState {
		return this;
	}
	equals(other: IState): boolean {
		return (other as LineState).lineNumber === this.lineNumber;
	}
}

suite('ModelLinesTokens', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	interface IBufferLineState {
		text: string;
		tokens: TestToken[];
	}

	interface IEdit {
		range: Range;
		text: string;
	}

	function testApplyEdits(initial: IBufferLineState[], edits: IEdit[], expected: IBufferLineState[]): void {
		const initialText = initial.map(el => el.text).join('\n');

		const s = new ManualTokenizationSupport();
		const d = TokenizationRegistry.register('test', s);

		const model = createTextModel(initialText, 'test');
		model.onBeforeAttached();
		for (let lineIndex = 0; lineIndex < initial.length; lineIndex++) {
			const lineTokens = initial[lineIndex].tokens;
			const lineTextLength = model.getLineMaxColumn(lineIndex + 1) - 1;
			const tokens = TestToken.toTokens(lineTokens);
			LineTokens.convertToEndOffset(tokens, lineTextLength);
			s.setLineTokens(lineIndex + 1, tokens);
		}

		model.applyEdits(edits.map((ed) => ({
			identifier: null,
			range: ed.range,
			text: ed.text,
			forceMoveMarkers: false
		})));

		for (let lineIndex = 0; lineIndex < expected.length; lineIndex++) {
			const actualLine = model.getLineContent(lineIndex + 1);
			const actualTokens = model.tokenization.getLineTokens(lineIndex + 1);
			assert.strictEqual(actualLine, expected[lineIndex].text);
			assertLineTokens(actualTokens, expected[lineIndex].tokens);
		}

		model.dispose();
		d.dispose();
	}

	test('single delete 1', () => {
		testApplyEdits(
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}],
			[{ range: new Range(1, 1, 1, 2), text: '' }],
			[{
				text: 'ello world',
				tokens: [new TestToken(0, 1), new TestToken(4, 2), new TestToken(5, 3)]
			}]
		);
	});

	test('single delete 2', () => {
		testApplyEdits(
			[{
				text: 'helloworld',
				tokens: [new TestToken(0, 1), new TestToken(5, 2)]
			}],
			[{ range: new Range(1, 3, 1, 8), text: '' }],
			[{
				text: 'herld',
				tokens: [new TestToken(0, 1), new TestToken(2, 2)]
			}]
		);
	});

	test('single delete 3', () => {
		testApplyEdits(
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}],
			[{ range: new Range(1, 1, 1, 6), text: '' }],
			[{
				text: ' world',
				tokens: [new TestToken(0, 2), new TestToken(1, 3)]
			}]
		);
	});

	test('single delete 4', () => {
		testApplyEdits(
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}],
			[{ range: new Range(1, 2, 1, 7), text: '' }],
			[{
				text: 'hworld',
				tokens: [new TestToken(0, 1), new TestToken(1, 3)]
			}]
		);
	});

	test('single delete 5', () => {
		testApplyEdits(
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}],
			[{ range: new Range(1, 1, 1, 12), text: '' }],
			[{
				text: '',
				tokens: [new TestToken(0, 1)]
			}]
		);
	});

	test('multi delete 6', () => {
		testApplyEdits(
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}, {
				text: 'hello world',
				tokens: [new TestToken(0, 4), new TestToken(5, 5), new TestToken(6, 6)]
			}, {
				text: 'hello world',
				tokens: [new TestToken(0, 7), new TestToken(5, 8), new TestToken(6, 9)]
			}],
			[{ range: new Range(1, 6, 3, 6), text: '' }],
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 8), new TestToken(6, 9)]
			}]
		);
	});

	test('multi delete 7', () => {
		testApplyEdits(
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}, {
				text: 'hello world',
				tokens: [new TestToken(0, 4), new TestToken(5, 5), new TestToken(6, 6)]
			}, {
				text: 'hello world',
				tokens: [new TestToken(0, 7), new TestToken(5, 8), new TestToken(6, 9)]
			}],
			[{ range: new Range(1, 12, 3, 12), text: '' }],
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}]
		);
	});

	test('multi delete 8', () => {
		testApplyEdits(
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}, {
				text: 'hello world',
				tokens: [new TestToken(0, 4), new TestToken(5, 5), new TestToken(6, 6)]
			}, {
				text: 'hello world',
				tokens: [new TestToken(0, 7), new TestToken(5, 8), new TestToken(6, 9)]
			}],
			[{ range: new Range(1, 1, 3, 1), text: '' }],
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 7), new TestToken(5, 8), new TestToken(6, 9)]
			}]
		);
	});

	test('multi delete 9', () => {
		testApplyEdits(
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}, {
				text: 'hello world',
				tokens: [new TestToken(0, 4), new TestToken(5, 5), new TestToken(6, 6)]
			}, {
				text: 'hello world',
				tokens: [new TestToken(0, 7), new TestToken(5, 8), new TestToken(6, 9)]
			}],
			[{ range: new Range(1, 12, 3, 1), text: '' }],
			[{
				text: 'hello worldhello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3), new TestToken(11, 7), new TestToken(16, 8), new TestToken(17, 9)]
			}]
		);
	});

	test('single insert 1', () => {
		testApplyEdits(
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}],
			[{ range: new Range(1, 1, 1, 1), text: 'xx' }],
			[{
				text: 'xxhello world',
				tokens: [new TestToken(0, 1), new TestToken(7, 2), new TestToken(8, 3)]
			}]
		);
	});

	test('single insert 2', () => {
		testApplyEdits(
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}],
			[{ range: new Range(1, 2, 1, 2), text: 'xx' }],
			[{
				text: 'hxxello world',
				tokens: [new TestToken(0, 1), new TestToken(7, 2), new TestToken(8, 3)]
			}]
		);
	});

	test('single insert 3', () => {
		testApplyEdits(
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}],
			[{ range: new Range(1, 6, 1, 6), text: 'xx' }],
			[{
				text: 'helloxx world',
				tokens: [new TestToken(0, 1), new TestToken(7, 2), new TestToken(8, 3)]
			}]
		);
	});

	test('single insert 4', () => {
		testApplyEdits(
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}],
			[{ range: new Range(1, 7, 1, 7), text: 'xx' }],
			[{
				text: 'hello xxworld',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(8, 3)]
			}]
		);
	});

	test('single insert 5', () => {
		testApplyEdits(
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}],
			[{ range: new Range(1, 12, 1, 12), text: 'xx' }],
			[{
				text: 'hello worldxx',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}]
		);
	});

	test('multi insert 6', () => {
		testApplyEdits(
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}],
			[{ range: new Range(1, 1, 1, 1), text: '\n' }],
			[{
				text: '',
				tokens: [new TestToken(0, 1)]
			}, {
				text: 'hello world',
				tokens: [new TestToken(0, 1)]
			}]
		);
	});

	test('multi insert 7', () => {
		testApplyEdits(
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}],
			[{ range: new Range(1, 12, 1, 12), text: '\n' }],
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}, {
				text: '',
				tokens: [new TestToken(0, 1)]
			}]
		);
	});

	test('multi insert 8', () => {
		testApplyEdits(
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}],
			[{ range: new Range(1, 7, 1, 7), text: '\n' }],
			[{
				text: 'hello ',
				tokens: [new TestToken(0, 1), new TestToken(5, 2)]
			}, {
				text: 'world',
				tokens: [new TestToken(0, 1)]
			}]
		);
	});

	test('multi insert 9', () => {
		testApplyEdits(
			[{
				text: 'hello world',
				tokens: [new TestToken(0, 1), new TestToken(5, 2), new TestToken(6, 3)]
			}, {
				text: 'hello world',
				tokens: [new TestToken(0, 4), new TestToken(5, 5), new TestToken(6, 6)]
			}],
			[{ range: new Range(1, 7, 1, 7), text: 'xx\nyy' }],
			[{
				text: 'hello xx',
				tokens: [new TestToken(0, 1), new TestToken(5, 2)]
			}, {
				text: 'yyworld',
				tokens: [new TestToken(0, 1)]
			}, {
				text: 'hello world',
				tokens: [new TestToken(0, 4), new TestToken(5, 5), new TestToken(6, 6)]
			}]
		);
	});

	function testLineEditTokens(initialText: string, initialTokens: TestToken[], edits: ILineEdit[], expectedText: string, expectedTokens: TestToken[]): void {
		testApplyEdits(
			[{
				text: initialText,
				tokens: initialTokens
			}],
			edits.map((ed) => ({
				range: new Range(1, ed.startColumn, 1, ed.endColumn),
				text: ed.text
			})),
			[{
				text: expectedText,
				tokens: expectedTokens
			}]
		);
	}

	test('insertion on empty line', () => {
		const s = new ManualTokenizationSupport();
		const d = TokenizationRegistry.register('test', s);

		const model = createTextModel('some text', 'test');
		const tokens = TestToken.toTokens([new TestToken(0, 1)]);
		LineTokens.convertToEndOffset(tokens, model.getLineMaxColumn(1) - 1);
		s.setLineTokens(1, tokens);

		model.applyEdits([{
			range: new Range(1, 1, 1, 10),
			text: ''
		}]);

		s.setLineTokens(1, new Uint32Array(0));

		model.applyEdits([{
			range: new Range(1, 1, 1, 1),
			text: 'a'
		}]);

		const actualTokens = model.tokenization.getLineTokens(1);
		assertLineTokens(actualTokens, [new TestToken(0, 1)]);

		model.dispose();
		d.dispose();
	});

	test('updates tokens on insertion 1', () => {
		testLineEditTokens(
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			[{
				startColumn: 1,
				endColumn: 1,
				text: 'a',
			}],
			'aabcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(5, 2),
				new TestToken(6, 3)
			]
		);
	});

	test('updates tokens on insertion 2', () => {
		testLineEditTokens(
			'aabcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(5, 2),
				new TestToken(6, 3)
			],
			[{
				startColumn: 2,
				endColumn: 2,
				text: 'x',
			}],
			'axabcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(6, 2),
				new TestToken(7, 3)
			]
		);
	});

	test('updates tokens on insertion 3', () => {
		testLineEditTokens(
			'axabcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(6, 2),
				new TestToken(7, 3)
			],
			[{
				startColumn: 3,
				endColumn: 3,
				text: 'stu',
			}],
			'axstuabcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(9, 2),
				new TestToken(10, 3)
			]
		);
	});

	test('updates tokens on insertion 4', () => {
		testLineEditTokens(
			'axstuabcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(9, 2),
				new TestToken(10, 3)
			],
			[{
				startColumn: 10,
				endColumn: 10,
				text: '\t',
			}],
			'axstuabcd\t efgh',
			[
				new TestToken(0, 1),
				new TestToken(10, 2),
				new TestToken(11, 3)
			]
		);
	});

	test('updates tokens on insertion 5', () => {
		testLineEditTokens(
			'axstuabcd\t efgh',
			[
				new TestToken(0, 1),
				new TestToken(10, 2),
				new TestToken(11, 3)
			],
			[{
				startColumn: 12,
				endColumn: 12,
				text: 'dd',
			}],
			'axstuabcd\t ddefgh',
			[
				new TestToken(0, 1),
				new TestToken(10, 2),
				new TestToken(13, 3)
			]
		);
	});

	test('updates tokens on insertion 6', () => {
		testLineEditTokens(
			'axstuabcd\t ddefgh',
			[
				new TestToken(0, 1),
				new TestToken(10, 2),
				new TestToken(13, 3)
			],
			[{
				startColumn: 18,
				endColumn: 18,
				text: 'xyz',
			}],
			'axstuabcd\t ddefghxyz',
			[
				new TestToken(0, 1),
				new TestToken(10, 2),
				new TestToken(13, 3)
			]
		);
	});

	test('updates tokens on insertion 7', () => {
		testLineEditTokens(
			'axstuabcd\t ddefghxyz',
			[
				new TestToken(0, 1),
				new TestToken(10, 2),
				new TestToken(13, 3)
			],
			[{
				startColumn: 1,
				endColumn: 1,
				text: 'x',
			}],
			'xaxstuabcd\t ddefghxyz',
			[
				new TestToken(0, 1),
				new TestToken(11, 2),
				new TestToken(14, 3)
			]
		);
	});

	test('updates tokens on insertion 8', () => {
		testLineEditTokens(
			'xaxstuabcd\t ddefghxyz',
			[
				new TestToken(0, 1),
				new TestToken(11, 2),
				new TestToken(14, 3)
			],
			[{
				startColumn: 22,
				endColumn: 22,
				text: 'x',
			}],
			'xaxstuabcd\t ddefghxyzx',
			[
				new TestToken(0, 1),
				new TestToken(11, 2),
				new TestToken(14, 3)
			]
		);
	});

	test('updates tokens on insertion 9', () => {
		testLineEditTokens(
			'xaxstuabcd\t ddefghxyzx',
			[
				new TestToken(0, 1),
				new TestToken(11, 2),
				new TestToken(14, 3)
			],
			[{
				startColumn: 2,
				endColumn: 2,
				text: '',
			}],
			'xaxstuabcd\t ddefghxyzx',
			[
				new TestToken(0, 1),
				new TestToken(11, 2),
				new TestToken(14, 3)
			]
		);
	});

	test('updates tokens on insertion 10', () => {
		testLineEditTokens(
			'',
			[],
			[{
				startColumn: 1,
				endColumn: 1,
				text: 'a',
			}],
			'a',
			[
				new TestToken(0, 1)
			]
		);
	});

	test('delete second token 2', () => {
		testLineEditTokens(
			'abcdefghij',
			[
				new TestToken(0, 1),
				new TestToken(3, 2),
				new TestToken(6, 3)
			],
			[{
				startColumn: 4,
				endColumn: 7,
				text: '',
			}],
			'abcghij',
			[
				new TestToken(0, 1),
				new TestToken(3, 3)
			]
		);
	});

	test('insert right before second token', () => {
		testLineEditTokens(
			'abcdefghij',
			[
				new TestToken(0, 1),
				new TestToken(3, 2),
				new TestToken(6, 3)
			],
			[{
				startColumn: 4,
				endColumn: 4,
				text: 'hello',
			}],
			'abchellodefghij',
			[
				new TestToken(0, 1),
				new TestToken(8, 2),
				new TestToken(11, 3)
			]
		);
	});

	test('delete first char', () => {
		testLineEditTokens(
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			[{
				startColumn: 1,
				endColumn: 2,
				text: '',
			}],
			'bcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(3, 2),
				new TestToken(4, 3)
			]
		);
	});

	test('delete 2nd and 3rd chars', () => {
		testLineEditTokens(
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			[{
				startColumn: 2,
				endColumn: 4,
				text: '',
			}],
			'ad efgh',
			[
				new TestToken(0, 1),
				new TestToken(2, 2),
				new TestToken(3, 3)
			]
		);
	});

	test('delete first token', () => {
		testLineEditTokens(
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			[{
				startColumn: 1,
				endColumn: 5,
				text: '',
			}],
			' efgh',
			[
				new TestToken(0, 2),
				new TestToken(1, 3)
			]
		);
	});

	test('delete second token', () => {
		testLineEditTokens(
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			[{
				startColumn: 5,
				endColumn: 6,
				text: '',
			}],
			'abcdefgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 3)
			]
		);
	});

	test('delete second token + a bit of the third one', () => {
		testLineEditTokens(
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			[{
				startColumn: 5,
				endColumn: 7,
				text: '',
			}],
			'abcdfgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 3)
			]
		);
	});

	test('delete second and third token', () => {
		testLineEditTokens(
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			[{
				startColumn: 5,
				endColumn: 10,
				text: '',
			}],
			'abcd',
			[
				new TestToken(0, 1)
			]
		);
	});

	test('delete everything', () => {
		testLineEditTokens(
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			[{
				startColumn: 1,
				endColumn: 10,
				text: '',
			}],
			'',
			[
				new TestToken(0, 1)
			]
		);
	});

	test('noop', () => {
		testLineEditTokens(
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			[{
				startColumn: 1,
				endColumn: 1,
				text: '',
			}],
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			]
		);
	});

	test('equivalent to deleting first two chars', () => {
		testLineEditTokens(
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			[{
				startColumn: 1,
				endColumn: 3,
				text: '',
			}],
			'cd efgh',
			[
				new TestToken(0, 1),
				new TestToken(2, 2),
				new TestToken(3, 3)
			]
		);
	});

	test('equivalent to deleting from 5 to the end', () => {
		testLineEditTokens(
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			[{
				startColumn: 5,
				endColumn: 10,
				text: '',
			}],
			'abcd',
			[
				new TestToken(0, 1)
			]
		);
	});

	test('updates tokens on replace 1', () => {
		testLineEditTokens(
			'Hello world, ciao',
			[
				new TestToken(0, 1),
				new TestToken(5, 0),
				new TestToken(6, 2),
				new TestToken(11, 0),
				new TestToken(13, 0)
			],
			[{
				startColumn: 1,
				endColumn: 6,
				text: 'Hi',
			}],
			'Hi world, ciao',
			[
				new TestToken(0, 0),
				new TestToken(3, 2),
				new TestToken(8, 0),
				new TestToken(10, 0),
			]
		);
	});

	test('updates tokens on replace 2', () => {
		testLineEditTokens(
			'Hello world, ciao',
			[
				new TestToken(0, 1),
				new TestToken(5, 0),
				new TestToken(6, 2),
				new TestToken(11, 0),
				new TestToken(13, 0),
			],
			[{
				startColumn: 1,
				endColumn: 6,
				text: 'Hi',
			}, {
				startColumn: 8,
				endColumn: 12,
				text: 'my friends',
			}],
			'Hi wmy friends, ciao',
			[
				new TestToken(0, 0),
				new TestToken(3, 2),
				new TestToken(14, 0),
				new TestToken(16, 0),
			]
		);
	});

	function testLineSplitTokens(initialText: string, initialTokens: TestToken[], splitColumn: number, expectedText1: string, expectedText2: string, expectedTokens: TestToken[]): void {
		testApplyEdits(
			[{
				text: initialText,
				tokens: initialTokens
			}],
			[{
				range: new Range(1, splitColumn, 1, splitColumn),
				text: '\n'
			}],
			[{
				text: expectedText1,
				tokens: expectedTokens
			}, {
				text: expectedText2,
				tokens: [new TestToken(0, 1)]
			}]
		);
	}

	test('split at the beginning', () => {
		testLineSplitTokens(
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			1,
			'',
			'abcd efgh',
			[
				new TestToken(0, 1),
			]
		);
	});

	test('split at the end', () => {
		testLineSplitTokens(
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			10,
			'abcd efgh',
			'',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			]
		);
	});

	test('split inthe middle 1', () => {
		testLineSplitTokens(
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			5,
			'abcd',
			' efgh',
			[
				new TestToken(0, 1)
			]
		);
	});

	test('split inthe middle 2', () => {
		testLineSplitTokens(
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			6,
			'abcd ',
			'efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2)
			]
		);
	});

	function testLineAppendTokens(aText: string, aTokens: TestToken[], bText: string, bTokens: TestToken[], expectedText: string, expectedTokens: TestToken[]): void {
		testApplyEdits(
			[{
				text: aText,
				tokens: aTokens
			}, {
				text: bText,
				tokens: bTokens
			}],
			[{
				range: new Range(1, aText.length + 1, 2, 1),
				text: ''
			}],
			[{
				text: expectedText,
				tokens: expectedTokens
			}]
		);
	}

	test('append empty 1', () => {
		testLineAppendTokens(
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			'',
			[],
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			]
		);
	});

	test('append empty 2', () => {
		testLineAppendTokens(
			'',
			[],
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			]
		);
	});

	test('append 1', () => {
		testLineAppendTokens(
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			],
			'abcd efgh',
			[
				new TestToken(0, 4),
				new TestToken(4, 5),
				new TestToken(5, 6)
			],
			'abcd efghabcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3),
				new TestToken(9, 4),
				new TestToken(13, 5),
				new TestToken(14, 6)
			]
		);
	});

	test('append 2', () => {
		testLineAppendTokens(
			'abcd ',
			[
				new TestToken(0, 1),
				new TestToken(4, 2)
			],
			'efgh',
			[
				new TestToken(0, 3)
			],
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			]
		);
	});

	test('append 3', () => {
		testLineAppendTokens(
			'abcd',
			[
				new TestToken(0, 1),
			],
			' efgh',
			[
				new TestToken(0, 2),
				new TestToken(1, 3)
			],
			'abcd efgh',
			[
				new TestToken(0, 1),
				new TestToken(4, 2),
				new TestToken(5, 3)
			]
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/model.modes.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/model.modes.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { EditOperation } from '../../../common/core/editOperation.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import * as languages from '../../../common/languages.js';
import { NullState } from '../../../common/languages/nullTokenize.js';
import { TextModel } from '../../../common/model/textModel.js';
import { createTextModel } from '../testTextModel.js';

// --------- utils

suite('Editor Model - Model Modes 1', () => {

	let calledFor: string[] = [];

	function getAndClear(): string[] {
		const result = calledFor;
		calledFor = [];
		return result;
	}

	const tokenizationSupport: languages.ITokenizationSupport = {
		getInitialState: () => NullState,
		tokenize: undefined!,
		tokenizeEncoded: (line: string, hasEOL: boolean, state: languages.IState): languages.EncodedTokenizationResult => {
			calledFor.push(line.charAt(0));
			return new languages.EncodedTokenizationResult(new Uint32Array(0), [], state);
		}
	};

	let thisModel: TextModel;
	let languageRegistration: IDisposable;

	setup(() => {
		const TEXT =
			'1\r\n' +
			'2\n' +
			'3\n' +
			'4\r\n' +
			'5';
		const LANGUAGE_ID = 'modelModeTest1';
		calledFor = [];
		languageRegistration = languages.TokenizationRegistry.register(LANGUAGE_ID, tokenizationSupport);
		thisModel = createTextModel(TEXT, LANGUAGE_ID);
	});

	teardown(() => {
		thisModel.dispose();
		languageRegistration.dispose();
		calledFor = [];
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('model calls syntax highlighter 1', () => {
		thisModel.tokenization.forceTokenization(1);
		assert.deepStrictEqual(getAndClear(), ['1']);
	});

	test('model calls syntax highlighter 2', () => {
		thisModel.tokenization.forceTokenization(2);
		assert.deepStrictEqual(getAndClear(), ['1', '2']);

		thisModel.tokenization.forceTokenization(2);
		assert.deepStrictEqual(getAndClear(), []);
	});

	test('model caches states', () => {
		thisModel.tokenization.forceTokenization(1);
		assert.deepStrictEqual(getAndClear(), ['1']);

		thisModel.tokenization.forceTokenization(2);
		assert.deepStrictEqual(getAndClear(), ['2']);

		thisModel.tokenization.forceTokenization(3);
		assert.deepStrictEqual(getAndClear(), ['3']);

		thisModel.tokenization.forceTokenization(4);
		assert.deepStrictEqual(getAndClear(), ['4']);

		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['5']);

		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), []);
	});

	test('model invalidates states for one line insert', () => {
		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['1', '2', '3', '4', '5']);

		thisModel.applyEdits([EditOperation.insert(new Position(1, 1), '-')]);
		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['-']);

		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), []);
	});

	test('model invalidates states for many lines insert', () => {
		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['1', '2', '3', '4', '5']);

		thisModel.applyEdits([EditOperation.insert(new Position(1, 1), '0\n-\n+')]);
		assert.strictEqual(thisModel.getLineCount(), 7);
		thisModel.tokenization.forceTokenization(7);
		assert.deepStrictEqual(getAndClear(), ['0', '-', '+']);

		thisModel.tokenization.forceTokenization(7);
		assert.deepStrictEqual(getAndClear(), []);
	});

	test('model invalidates states for one new line', () => {
		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['1', '2', '3', '4', '5']);

		thisModel.applyEdits([EditOperation.insert(new Position(1, 2), '\n')]);
		thisModel.applyEdits([EditOperation.insert(new Position(2, 1), 'a')]);
		thisModel.tokenization.forceTokenization(6);
		assert.deepStrictEqual(getAndClear(), ['1', 'a']);
	});

	test('model invalidates states for one line delete', () => {
		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['1', '2', '3', '4', '5']);

		thisModel.applyEdits([EditOperation.insert(new Position(1, 2), '-')]);
		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['1']);

		thisModel.applyEdits([EditOperation.delete(new Range(1, 1, 1, 2))]);
		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['-']);

		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), []);
	});

	test('model invalidates states for many lines delete', () => {
		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['1', '2', '3', '4', '5']);

		thisModel.applyEdits([EditOperation.delete(new Range(1, 1, 3, 1))]);
		thisModel.tokenization.forceTokenization(3);
		assert.deepStrictEqual(getAndClear(), ['3']);

		thisModel.tokenization.forceTokenization(3);
		assert.deepStrictEqual(getAndClear(), []);
	});
});

suite('Editor Model - Model Modes 2', () => {

	class ModelState2 implements languages.IState {
		prevLineContent: string;

		constructor(prevLineContent: string) {
			this.prevLineContent = prevLineContent;
		}

		clone(): languages.IState {
			return new ModelState2(this.prevLineContent);
		}

		equals(other: languages.IState): boolean {
			return (other instanceof ModelState2) && other.prevLineContent === this.prevLineContent;
		}
	}

	let calledFor: string[] = [];

	function getAndClear(): string[] {
		const actual = calledFor;
		calledFor = [];
		return actual;
	}

	const tokenizationSupport: languages.ITokenizationSupport = {
		getInitialState: () => new ModelState2(''),
		tokenize: undefined!,
		tokenizeEncoded: (line: string, hasEOL: boolean, state: languages.IState): languages.EncodedTokenizationResult => {
			calledFor.push(line);
			(<ModelState2>state).prevLineContent = line;
			return new languages.EncodedTokenizationResult(new Uint32Array(0), [], state);
		}
	};

	let thisModel: TextModel;
	let languageRegistration: IDisposable;

	setup(() => {
		const TEXT =
			'Line1' + '\r\n' +
			'Line2' + '\n' +
			'Line3' + '\n' +
			'Line4' + '\r\n' +
			'Line5';
		const LANGUAGE_ID = 'modelModeTest2';
		languageRegistration = languages.TokenizationRegistry.register(LANGUAGE_ID, tokenizationSupport);
		thisModel = createTextModel(TEXT, LANGUAGE_ID);
	});

	teardown(() => {
		thisModel.dispose();
		languageRegistration.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('getTokensForInvalidLines one text insert', () => {
		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['Line1', 'Line2', 'Line3', 'Line4', 'Line5']);
		thisModel.applyEdits([EditOperation.insert(new Position(1, 6), '-')]);
		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['Line1-', 'Line2']);
	});

	test('getTokensForInvalidLines two text insert', () => {
		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['Line1', 'Line2', 'Line3', 'Line4', 'Line5']);
		thisModel.applyEdits([
			EditOperation.insert(new Position(1, 6), '-'),
			EditOperation.insert(new Position(3, 6), '-')
		]);

		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['Line1-', 'Line2', 'Line3-', 'Line4']);
	});

	test('getTokensForInvalidLines one multi-line text insert, one small text insert', () => {
		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['Line1', 'Line2', 'Line3', 'Line4', 'Line5']);
		thisModel.applyEdits([EditOperation.insert(new Position(1, 6), '\nNew line\nAnother new line')]);
		thisModel.applyEdits([EditOperation.insert(new Position(5, 6), '-')]);
		thisModel.tokenization.forceTokenization(7);
		assert.deepStrictEqual(getAndClear(), ['Line1', 'New line', 'Another new line', 'Line2', 'Line3-', 'Line4']);
	});

	test('getTokensForInvalidLines one delete text', () => {
		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['Line1', 'Line2', 'Line3', 'Line4', 'Line5']);
		thisModel.applyEdits([EditOperation.delete(new Range(1, 1, 1, 5))]);
		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['1', 'Line2']);
	});

	test('getTokensForInvalidLines one line delete text', () => {
		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['Line1', 'Line2', 'Line3', 'Line4', 'Line5']);
		thisModel.applyEdits([EditOperation.delete(new Range(1, 1, 2, 1))]);
		thisModel.tokenization.forceTokenization(4);
		assert.deepStrictEqual(getAndClear(), ['Line2']);
	});

	test('getTokensForInvalidLines multiple lines delete text', () => {
		thisModel.tokenization.forceTokenization(5);
		assert.deepStrictEqual(getAndClear(), ['Line1', 'Line2', 'Line3', 'Line4', 'Line5']);
		thisModel.applyEdits([EditOperation.delete(new Range(1, 1, 3, 3))]);
		thisModel.tokenization.forceTokenization(3);
		assert.deepStrictEqual(getAndClear(), ['ne3', 'Line4']);
	});
});
```

--------------------------------------------------------------------------------

````
