---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 251
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 251 of 552)

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

---[FILE: src/vs/editor/test/common/model/pieceTreeTextBuffer/pieceTreeTextBuffer.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/pieceTreeTextBuffer/pieceTreeTextBuffer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { WordCharacterClassifier } from '../../../../common/core/wordCharacterClassifier.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { DefaultEndOfLine, ITextSnapshot, SearchData } from '../../../../common/model.js';
import { PieceTreeBase } from '../../../../common/model/pieceTreeTextBuffer/pieceTreeBase.js';
import { PieceTreeTextBuffer } from '../../../../common/model/pieceTreeTextBuffer/pieceTreeTextBuffer.js';
import { PieceTreeTextBufferBuilder } from '../../../../common/model/pieceTreeTextBuffer/pieceTreeTextBufferBuilder.js';
import { NodeColor, SENTINEL, TreeNode } from '../../../../common/model/pieceTreeTextBuffer/rbTreeBase.js';
import { createTextModel } from '../../testTextModel.js';
import { splitLines } from '../../../../../base/common/strings.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\r\n';

function randomChar() {
	return alphabet[randomInt(alphabet.length)];
}

function randomInt(bound: number) {
	return Math.floor(Math.random() * bound);
}

function randomStr(len: number) {
	if (len === null) {
		len = 10;
	}
	return (function () {
		let j, ref;
		const results = [];
		for (
			j = 1, ref = len;
			1 <= ref ? j < ref : j > ref;
			1 <= ref ? j++ : j--
		) {
			results.push(randomChar());
		}
		return results;
	})().join('');
}

function trimLineFeed(text: string): string {
	if (text.length === 0) {
		return text;
	}

	if (text.length === 1) {
		if (
			text.charCodeAt(text.length - 1) === 10 ||
			text.charCodeAt(text.length - 1) === 13
		) {
			return '';
		}
		return text;
	}

	if (text.charCodeAt(text.length - 1) === 10) {
		if (text.charCodeAt(text.length - 2) === 13) {
			return text.slice(0, -2);
		}
		return text.slice(0, -1);
	}

	if (text.charCodeAt(text.length - 1) === 13) {
		return text.slice(0, -1);
	}

	return text;
}

//#region Assertion

function testLinesContent(str: string, pieceTable: PieceTreeBase) {
	const lines = splitLines(str);
	assert.strictEqual(pieceTable.getLineCount(), lines.length);
	assert.strictEqual(pieceTable.getLinesRawContent(), str);
	for (let i = 0; i < lines.length; i++) {
		assert.strictEqual(pieceTable.getLineContent(i + 1), lines[i]);
		assert.strictEqual(
			trimLineFeed(
				pieceTable.getValueInRange(
					new Range(
						i + 1,
						1,
						i + 1,
						lines[i].length + (i === lines.length - 1 ? 1 : 2)
					)
				)
			),
			lines[i]
		);
	}
}

function testLineStarts(str: string, pieceTable: PieceTreeBase) {
	const lineStarts = [0];

	// Reset regex to search from the beginning
	const _regex = new RegExp(/\r\n|\r|\n/g);
	_regex.lastIndex = 0;
	let prevMatchStartIndex = -1;
	let prevMatchLength = 0;

	let m: RegExpExecArray | null;
	do {
		if (prevMatchStartIndex + prevMatchLength === str.length) {
			// Reached the end of the line
			break;
		}

		m = _regex.exec(str);
		if (!m) {
			break;
		}

		const matchStartIndex = m.index;
		const matchLength = m[0].length;

		if (
			matchStartIndex === prevMatchStartIndex &&
			matchLength === prevMatchLength
		) {
			// Exit early if the regex matches the same range twice
			break;
		}

		prevMatchStartIndex = matchStartIndex;
		prevMatchLength = matchLength;

		lineStarts.push(matchStartIndex + matchLength);
	} while (m);

	for (let i = 0; i < lineStarts.length; i++) {
		assert.deepStrictEqual(
			pieceTable.getPositionAt(lineStarts[i]),
			new Position(i + 1, 1)
		);
		assert.strictEqual(pieceTable.getOffsetAt(i + 1, 1), lineStarts[i]);
	}

	for (let i = 1; i < lineStarts.length; i++) {
		const pos = pieceTable.getPositionAt(lineStarts[i] - 1);
		assert.strictEqual(
			pieceTable.getOffsetAt(pos.lineNumber, pos.column),
			lineStarts[i] - 1
		);
	}
}

function createTextBuffer(val: string[], normalizeEOL: boolean = true): PieceTreeTextBuffer {
	const bufferBuilder = new PieceTreeTextBufferBuilder();
	for (const chunk of val) {
		bufferBuilder.acceptChunk(chunk);
	}
	const factory = bufferBuilder.finish(normalizeEOL);
	return (<PieceTreeTextBuffer>factory.create(DefaultEndOfLine.LF).textBuffer);
}

function assertTreeInvariants(T: PieceTreeBase): void {
	assert(SENTINEL.color === NodeColor.Black);
	assert(SENTINEL.parent === SENTINEL);
	assert(SENTINEL.left === SENTINEL);
	assert(SENTINEL.right === SENTINEL);
	assert(SENTINEL.size_left === 0);
	assert(SENTINEL.lf_left === 0);
	assertValidTree(T);
}

function depth(n: TreeNode): number {
	if (n === SENTINEL) {
		// The leafs are black
		return 1;
	}
	assert(depth(n.left) === depth(n.right));
	return (n.color === NodeColor.Black ? 1 : 0) + depth(n.left);
}

function assertValidNode(n: TreeNode): { size: number; lf_cnt: number } {
	if (n === SENTINEL) {
		return { size: 0, lf_cnt: 0 };
	}

	const l = n.left;
	const r = n.right;

	if (n.color === NodeColor.Red) {
		assert(l.color === NodeColor.Black);
		assert(r.color === NodeColor.Black);
	}

	const actualLeft = assertValidNode(l);
	assert(actualLeft.lf_cnt === n.lf_left);
	assert(actualLeft.size === n.size_left);
	const actualRight = assertValidNode(r);

	return { size: n.size_left + n.piece.length + actualRight.size, lf_cnt: n.lf_left + n.piece.lineFeedCnt + actualRight.lf_cnt };
}

function assertValidTree(T: PieceTreeBase): void {
	if (T.root === SENTINEL) {
		return;
	}
	assert(T.root.color === NodeColor.Black);
	assert(depth(T.root.left) === depth(T.root.right));
	assertValidNode(T.root);
}

//#endregion

suite('inserts and deletes', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	test('basic insert/delete', () => {
		const pieceTree = createTextBuffer([
			'This is a document with some text.'
		]);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(34, 'This is some more text to insert at offset 34.');
		assert.strictEqual(
			pieceTable.getLinesRawContent(),
			'This is a document with some text.This is some more text to insert at offset 34.'
		);
		pieceTable.delete(42, 5);
		assert.strictEqual(
			pieceTable.getLinesRawContent(),
			'This is a document with some text.This is more text to insert at offset 34.'
		);
		assertTreeInvariants(pieceTable);
	});

	test('more inserts', () => {
		const pieceTree = createTextBuffer(['']);
		ds.add(pieceTree);
		const pt = pieceTree.getPieceTree();
		pt.insert(0, 'AAA');
		assert.strictEqual(pt.getLinesRawContent(), 'AAA');
		pt.insert(0, 'BBB');
		assert.strictEqual(pt.getLinesRawContent(), 'BBBAAA');
		pt.insert(6, 'CCC');
		assert.strictEqual(pt.getLinesRawContent(), 'BBBAAACCC');
		pt.insert(5, 'DDD');
		assert.strictEqual(pt.getLinesRawContent(), 'BBBAADDDACCC');
		assertTreeInvariants(pt);
	});

	test('more deletes', () => {
		const pieceTree = createTextBuffer(['012345678']);
		ds.add(pieceTree);
		const pt = pieceTree.getPieceTree();

		pt.delete(8, 1);
		assert.strictEqual(pt.getLinesRawContent(), '01234567');
		pt.delete(0, 1);
		assert.strictEqual(pt.getLinesRawContent(), '1234567');
		pt.delete(5, 1);
		assert.strictEqual(pt.getLinesRawContent(), '123457');
		pt.delete(5, 1);
		assert.strictEqual(pt.getLinesRawContent(), '12345');
		pt.delete(0, 5);
		assert.strictEqual(pt.getLinesRawContent(), '');
		assertTreeInvariants(pt);
	});

	test('random test 1', () => {
		let str = '';
		const pieceTree = createTextBuffer(['']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(0, 'ceLPHmFzvCtFeHkCBej ');
		str = str.substring(0, 0) + 'ceLPHmFzvCtFeHkCBej ' + str.substring(0);
		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		pieceTable.insert(8, 'gDCEfNYiBUNkSwtvB K ');
		str = str.substring(0, 8) + 'gDCEfNYiBUNkSwtvB K ' + str.substring(8);
		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		pieceTable.insert(38, 'cyNcHxjNPPoehBJldLS ');
		str = str.substring(0, 38) + 'cyNcHxjNPPoehBJldLS ' + str.substring(38);
		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		pieceTable.insert(59, 'ejMx\nOTgWlbpeDExjOk ');
		str = str.substring(0, 59) + 'ejMx\nOTgWlbpeDExjOk ' + str.substring(59);

		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		assertTreeInvariants(pieceTable);
	});

	test('random test 2', () => {
		let str = '';
		const pieceTree = createTextBuffer(['']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, 'VgPG ');
		str = str.substring(0, 0) + 'VgPG ' + str.substring(0);
		pieceTable.insert(2, 'DdWF ');
		str = str.substring(0, 2) + 'DdWF ' + str.substring(2);
		pieceTable.insert(0, 'hUJc ');
		str = str.substring(0, 0) + 'hUJc ' + str.substring(0);
		pieceTable.insert(8, 'lQEq ');
		str = str.substring(0, 8) + 'lQEq ' + str.substring(8);
		pieceTable.insert(10, 'Gbtp ');
		str = str.substring(0, 10) + 'Gbtp ' + str.substring(10);

		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		assertTreeInvariants(pieceTable);
	});

	test('random test 3', () => {
		let str = '';
		const pieceTree = createTextBuffer(['']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, 'gYSz');
		str = str.substring(0, 0) + 'gYSz' + str.substring(0);
		pieceTable.insert(1, 'mDQe');
		str = str.substring(0, 1) + 'mDQe' + str.substring(1);
		pieceTable.insert(1, 'DTMQ');
		str = str.substring(0, 1) + 'DTMQ' + str.substring(1);
		pieceTable.insert(2, 'GGZB');
		str = str.substring(0, 2) + 'GGZB' + str.substring(2);
		pieceTable.insert(12, 'wXpq');
		str = str.substring(0, 12) + 'wXpq' + str.substring(12);
		assert.strictEqual(pieceTable.getLinesRawContent(), str);
	});

	test('random delete 1', () => {
		let str = '';
		const pieceTree = createTextBuffer(['']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(0, 'vfb');
		str = str.substring(0, 0) + 'vfb' + str.substring(0);
		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		pieceTable.insert(0, 'zRq');
		str = str.substring(0, 0) + 'zRq' + str.substring(0);
		assert.strictEqual(pieceTable.getLinesRawContent(), str);

		pieceTable.delete(5, 1);
		str = str.substring(0, 5) + str.substring(5 + 1);
		assert.strictEqual(pieceTable.getLinesRawContent(), str);

		pieceTable.insert(1, 'UNw');
		str = str.substring(0, 1) + 'UNw' + str.substring(1);
		assert.strictEqual(pieceTable.getLinesRawContent(), str);

		pieceTable.delete(4, 3);
		str = str.substring(0, 4) + str.substring(4 + 3);
		assert.strictEqual(pieceTable.getLinesRawContent(), str);

		pieceTable.delete(1, 4);
		str = str.substring(0, 1) + str.substring(1 + 4);
		assert.strictEqual(pieceTable.getLinesRawContent(), str);

		pieceTable.delete(0, 1);
		str = str.substring(0, 0) + str.substring(0 + 1);
		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		assertTreeInvariants(pieceTable);
	});

	test('random delete 2', () => {
		let str = '';
		const pieceTree = createTextBuffer(['']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(0, 'IDT');
		str = str.substring(0, 0) + 'IDT' + str.substring(0);
		pieceTable.insert(3, 'wwA');
		str = str.substring(0, 3) + 'wwA' + str.substring(3);
		pieceTable.insert(3, 'Gnr');
		str = str.substring(0, 3) + 'Gnr' + str.substring(3);
		pieceTable.delete(6, 3);
		str = str.substring(0, 6) + str.substring(6 + 3);
		pieceTable.insert(4, 'eHp');
		str = str.substring(0, 4) + 'eHp' + str.substring(4);
		pieceTable.insert(1, 'UAi');
		str = str.substring(0, 1) + 'UAi' + str.substring(1);
		pieceTable.insert(2, 'FrR');
		str = str.substring(0, 2) + 'FrR' + str.substring(2);
		pieceTable.delete(6, 7);
		str = str.substring(0, 6) + str.substring(6 + 7);
		pieceTable.delete(3, 5);
		str = str.substring(0, 3) + str.substring(3 + 5);
		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		assertTreeInvariants(pieceTable);
	});

	test('random delete 3', () => {
		let str = '';
		const pieceTree = createTextBuffer(['']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, 'PqM');
		str = str.substring(0, 0) + 'PqM' + str.substring(0);
		pieceTable.delete(1, 2);
		str = str.substring(0, 1) + str.substring(1 + 2);
		pieceTable.insert(1, 'zLc');
		str = str.substring(0, 1) + 'zLc' + str.substring(1);
		pieceTable.insert(0, 'MEX');
		str = str.substring(0, 0) + 'MEX' + str.substring(0);
		pieceTable.insert(0, 'jZh');
		str = str.substring(0, 0) + 'jZh' + str.substring(0);
		pieceTable.insert(8, 'GwQ');
		str = str.substring(0, 8) + 'GwQ' + str.substring(8);
		pieceTable.delete(5, 6);
		str = str.substring(0, 5) + str.substring(5 + 6);
		pieceTable.insert(4, 'ktw');
		str = str.substring(0, 4) + 'ktw' + str.substring(4);
		pieceTable.insert(5, 'GVu');
		str = str.substring(0, 5) + 'GVu' + str.substring(5);
		pieceTable.insert(9, 'jdm');
		str = str.substring(0, 9) + 'jdm' + str.substring(9);
		pieceTable.insert(15, 'na\n');
		str = str.substring(0, 15) + 'na\n' + str.substring(15);
		pieceTable.delete(5, 8);
		str = str.substring(0, 5) + str.substring(5 + 8);
		pieceTable.delete(3, 4);
		str = str.substring(0, 3) + str.substring(3 + 4);
		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		assertTreeInvariants(pieceTable);
	});

	test('random insert/delete \\r bug 1', () => {
		let str = 'a';
		const pieceTree = createTextBuffer(['a']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.delete(0, 1);
		str = str.substring(0, 0) + str.substring(0 + 1);
		pieceTable.insert(0, '\r\r\n\n');
		str = str.substring(0, 0) + '\r\r\n\n' + str.substring(0);
		pieceTable.delete(3, 1);
		str = str.substring(0, 3) + str.substring(3 + 1);
		pieceTable.insert(2, '\n\n\ra');
		str = str.substring(0, 2) + '\n\n\ra' + str.substring(2);
		pieceTable.delete(4, 3);
		str = str.substring(0, 4) + str.substring(4 + 3);
		pieceTable.insert(2, '\na\r\r');
		str = str.substring(0, 2) + '\na\r\r' + str.substring(2);
		pieceTable.insert(6, '\ra\n\n');
		str = str.substring(0, 6) + '\ra\n\n' + str.substring(6);
		pieceTable.insert(0, 'aa\n\n');
		str = str.substring(0, 0) + 'aa\n\n' + str.substring(0);
		pieceTable.insert(5, '\n\na\r');
		str = str.substring(0, 5) + '\n\na\r' + str.substring(5);

		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		assertTreeInvariants(pieceTable);
	});

	test('random insert/delete \\r bug 2', () => {
		let str = 'a';
		const pieceTree = createTextBuffer(['a']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(1, '\naa\r');
		str = str.substring(0, 1) + '\naa\r' + str.substring(1);
		pieceTable.delete(0, 4);
		str = str.substring(0, 0) + str.substring(0 + 4);
		pieceTable.insert(1, '\r\r\na');
		str = str.substring(0, 1) + '\r\r\na' + str.substring(1);
		pieceTable.insert(2, '\n\r\ra');
		str = str.substring(0, 2) + '\n\r\ra' + str.substring(2);
		pieceTable.delete(4, 1);
		str = str.substring(0, 4) + str.substring(4 + 1);
		pieceTable.insert(8, '\r\n\r\r');
		str = str.substring(0, 8) + '\r\n\r\r' + str.substring(8);
		pieceTable.insert(7, '\n\n\na');
		str = str.substring(0, 7) + '\n\n\na' + str.substring(7);
		pieceTable.insert(13, 'a\n\na');
		str = str.substring(0, 13) + 'a\n\na' + str.substring(13);
		pieceTable.delete(17, 3);
		str = str.substring(0, 17) + str.substring(17 + 3);
		pieceTable.insert(2, 'a\ra\n');
		str = str.substring(0, 2) + 'a\ra\n' + str.substring(2);

		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		assertTreeInvariants(pieceTable);
	});

	test('random insert/delete \\r bug 3', () => {
		let str = 'a';
		const pieceTree = createTextBuffer(['a']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, '\r\na\r');
		str = str.substring(0, 0) + '\r\na\r' + str.substring(0);
		pieceTable.delete(2, 3);
		str = str.substring(0, 2) + str.substring(2 + 3);
		pieceTable.insert(2, 'a\r\n\r');
		str = str.substring(0, 2) + 'a\r\n\r' + str.substring(2);
		pieceTable.delete(4, 2);
		str = str.substring(0, 4) + str.substring(4 + 2);
		pieceTable.insert(4, 'a\n\r\n');
		str = str.substring(0, 4) + 'a\n\r\n' + str.substring(4);
		pieceTable.insert(1, 'aa\n\r');
		str = str.substring(0, 1) + 'aa\n\r' + str.substring(1);
		pieceTable.insert(7, '\na\r\n');
		str = str.substring(0, 7) + '\na\r\n' + str.substring(7);
		pieceTable.insert(5, '\n\na\r');
		str = str.substring(0, 5) + '\n\na\r' + str.substring(5);
		pieceTable.insert(10, '\r\r\n\r');
		str = str.substring(0, 10) + '\r\r\n\r' + str.substring(10);
		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		pieceTable.delete(21, 3);
		str = str.substring(0, 21) + str.substring(21 + 3);

		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		assertTreeInvariants(pieceTable);
	});

	test('random insert/delete \\r bug 4s', () => {
		let str = 'a';
		const pieceTree = createTextBuffer(['a']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.delete(0, 1);
		str = str.substring(0, 0) + str.substring(0 + 1);
		pieceTable.insert(0, '\naaa');
		str = str.substring(0, 0) + '\naaa' + str.substring(0);
		pieceTable.insert(2, '\n\naa');
		str = str.substring(0, 2) + '\n\naa' + str.substring(2);
		pieceTable.delete(1, 4);
		str = str.substring(0, 1) + str.substring(1 + 4);
		pieceTable.delete(3, 1);
		str = str.substring(0, 3) + str.substring(3 + 1);
		pieceTable.delete(1, 2);
		str = str.substring(0, 1) + str.substring(1 + 2);
		pieceTable.delete(0, 1);
		str = str.substring(0, 0) + str.substring(0 + 1);
		pieceTable.insert(0, 'a\n\n\r');
		str = str.substring(0, 0) + 'a\n\n\r' + str.substring(0);
		pieceTable.insert(2, 'aa\r\n');
		str = str.substring(0, 2) + 'aa\r\n' + str.substring(2);
		pieceTable.insert(3, 'a\naa');
		str = str.substring(0, 3) + 'a\naa' + str.substring(3);

		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		assertTreeInvariants(pieceTable);
	});
	test('random insert/delete \\r bug 5', () => {
		let str = '';
		const pieceTree = createTextBuffer(['']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, '\n\n\n\r');
		str = str.substring(0, 0) + '\n\n\n\r' + str.substring(0);
		pieceTable.insert(1, '\n\n\n\r');
		str = str.substring(0, 1) + '\n\n\n\r' + str.substring(1);
		pieceTable.insert(2, '\n\r\r\r');
		str = str.substring(0, 2) + '\n\r\r\r' + str.substring(2);
		pieceTable.insert(8, '\n\r\n\r');
		str = str.substring(0, 8) + '\n\r\n\r' + str.substring(8);
		pieceTable.delete(5, 2);
		str = str.substring(0, 5) + str.substring(5 + 2);
		pieceTable.insert(4, '\n\r\r\r');
		str = str.substring(0, 4) + '\n\r\r\r' + str.substring(4);
		pieceTable.insert(8, '\n\n\n\r');
		str = str.substring(0, 8) + '\n\n\n\r' + str.substring(8);
		pieceTable.delete(0, 7);
		str = str.substring(0, 0) + str.substring(0 + 7);
		pieceTable.insert(1, '\r\n\r\r');
		str = str.substring(0, 1) + '\r\n\r\r' + str.substring(1);
		pieceTable.insert(15, '\n\r\r\r');
		str = str.substring(0, 15) + '\n\r\r\r' + str.substring(15);

		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		assertTreeInvariants(pieceTable);
	});
});

suite('prefix sum for line feed', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	test('basic', () => {
		const pieceTree = createTextBuffer(['1\n2\n3\n4']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		assert.strictEqual(pieceTable.getLineCount(), 4);
		assert.deepStrictEqual(pieceTable.getPositionAt(0), new Position(1, 1));
		assert.deepStrictEqual(pieceTable.getPositionAt(1), new Position(1, 2));
		assert.deepStrictEqual(pieceTable.getPositionAt(2), new Position(2, 1));
		assert.deepStrictEqual(pieceTable.getPositionAt(3), new Position(2, 2));
		assert.deepStrictEqual(pieceTable.getPositionAt(4), new Position(3, 1));
		assert.deepStrictEqual(pieceTable.getPositionAt(5), new Position(3, 2));
		assert.deepStrictEqual(pieceTable.getPositionAt(6), new Position(4, 1));

		assert.strictEqual(pieceTable.getOffsetAt(1, 1), 0);
		assert.strictEqual(pieceTable.getOffsetAt(1, 2), 1);
		assert.strictEqual(pieceTable.getOffsetAt(2, 1), 2);
		assert.strictEqual(pieceTable.getOffsetAt(2, 2), 3);
		assert.strictEqual(pieceTable.getOffsetAt(3, 1), 4);
		assert.strictEqual(pieceTable.getOffsetAt(3, 2), 5);
		assert.strictEqual(pieceTable.getOffsetAt(4, 1), 6);
		assertTreeInvariants(pieceTable);
	});

	test('append', () => {
		const pieceTree = createTextBuffer(['a\nb\nc\nde']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(8, 'fh\ni\njk');

		assert.strictEqual(pieceTable.getLineCount(), 6);
		assert.deepStrictEqual(pieceTable.getPositionAt(9), new Position(4, 4));
		assert.strictEqual(pieceTable.getOffsetAt(1, 1), 0);
		assertTreeInvariants(pieceTable);
	});

	test('insert', () => {
		const pieceTree = createTextBuffer(['a\nb\nc\nde']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(7, 'fh\ni\njk');

		assert.strictEqual(pieceTable.getLineCount(), 6);
		assert.deepStrictEqual(pieceTable.getPositionAt(6), new Position(4, 1));
		assert.deepStrictEqual(pieceTable.getPositionAt(7), new Position(4, 2));
		assert.deepStrictEqual(pieceTable.getPositionAt(8), new Position(4, 3));
		assert.deepStrictEqual(pieceTable.getPositionAt(9), new Position(4, 4));
		assert.deepStrictEqual(pieceTable.getPositionAt(12), new Position(6, 1));
		assert.deepStrictEqual(pieceTable.getPositionAt(13), new Position(6, 2));
		assert.deepStrictEqual(pieceTable.getPositionAt(14), new Position(6, 3));

		assert.strictEqual(pieceTable.getOffsetAt(4, 1), 6);
		assert.strictEqual(pieceTable.getOffsetAt(4, 2), 7);
		assert.strictEqual(pieceTable.getOffsetAt(4, 3), 8);
		assert.strictEqual(pieceTable.getOffsetAt(4, 4), 9);
		assert.strictEqual(pieceTable.getOffsetAt(6, 1), 12);
		assert.strictEqual(pieceTable.getOffsetAt(6, 2), 13);
		assert.strictEqual(pieceTable.getOffsetAt(6, 3), 14);
		assertTreeInvariants(pieceTable);
	});

	test('delete', () => {
		const pieceTree = createTextBuffer(['a\nb\nc\ndefh\ni\njk']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.delete(7, 2);

		assert.strictEqual(pieceTable.getLinesRawContent(), 'a\nb\nc\ndh\ni\njk');
		assert.strictEqual(pieceTable.getLineCount(), 6);
		assert.deepStrictEqual(pieceTable.getPositionAt(6), new Position(4, 1));
		assert.deepStrictEqual(pieceTable.getPositionAt(7), new Position(4, 2));
		assert.deepStrictEqual(pieceTable.getPositionAt(8), new Position(4, 3));
		assert.deepStrictEqual(pieceTable.getPositionAt(9), new Position(5, 1));
		assert.deepStrictEqual(pieceTable.getPositionAt(11), new Position(6, 1));
		assert.deepStrictEqual(pieceTable.getPositionAt(12), new Position(6, 2));
		assert.deepStrictEqual(pieceTable.getPositionAt(13), new Position(6, 3));

		assert.strictEqual(pieceTable.getOffsetAt(4, 1), 6);
		assert.strictEqual(pieceTable.getOffsetAt(4, 2), 7);
		assert.strictEqual(pieceTable.getOffsetAt(4, 3), 8);
		assert.strictEqual(pieceTable.getOffsetAt(5, 1), 9);
		assert.strictEqual(pieceTable.getOffsetAt(6, 1), 11);
		assert.strictEqual(pieceTable.getOffsetAt(6, 2), 12);
		assert.strictEqual(pieceTable.getOffsetAt(6, 3), 13);
		assertTreeInvariants(pieceTable);
	});

	test('add+delete 1', () => {
		const pieceTree = createTextBuffer(['a\nb\nc\nde']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(8, 'fh\ni\njk');
		pieceTable.delete(7, 2);

		assert.strictEqual(pieceTable.getLinesRawContent(), 'a\nb\nc\ndh\ni\njk');
		assert.strictEqual(pieceTable.getLineCount(), 6);
		assert.deepStrictEqual(pieceTable.getPositionAt(6), new Position(4, 1));
		assert.deepStrictEqual(pieceTable.getPositionAt(7), new Position(4, 2));
		assert.deepStrictEqual(pieceTable.getPositionAt(8), new Position(4, 3));
		assert.deepStrictEqual(pieceTable.getPositionAt(9), new Position(5, 1));
		assert.deepStrictEqual(pieceTable.getPositionAt(11), new Position(6, 1));
		assert.deepStrictEqual(pieceTable.getPositionAt(12), new Position(6, 2));
		assert.deepStrictEqual(pieceTable.getPositionAt(13), new Position(6, 3));

		assert.strictEqual(pieceTable.getOffsetAt(4, 1), 6);
		assert.strictEqual(pieceTable.getOffsetAt(4, 2), 7);
		assert.strictEqual(pieceTable.getOffsetAt(4, 3), 8);
		assert.strictEqual(pieceTable.getOffsetAt(5, 1), 9);
		assert.strictEqual(pieceTable.getOffsetAt(6, 1), 11);
		assert.strictEqual(pieceTable.getOffsetAt(6, 2), 12);
		assert.strictEqual(pieceTable.getOffsetAt(6, 3), 13);
		assertTreeInvariants(pieceTable);
	});

	test('insert random bug 1: prefixSumComputer.removeValues(start, cnt) cnt is 1 based.', () => {
		let str = '';
		const pieceTree = createTextBuffer(['']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, ' ZX \n Z\nZ\n YZ\nY\nZXX ');
		str =
			str.substring(0, 0) +
			' ZX \n Z\nZ\n YZ\nY\nZXX ' +
			str.substring(0);
		pieceTable.insert(14, 'X ZZ\nYZZYZXXY Y XY\n ');
		str =
			str.substring(0, 14) + 'X ZZ\nYZZYZXXY Y XY\n ' + str.substring(14);

		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		testLineStarts(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('insert random bug 2: prefixSumComputer initialize does not do deep copy of UInt32Array.', () => {
		let str = '';
		const pieceTree = createTextBuffer(['']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, 'ZYZ\nYY XY\nX \nZ Y \nZ ');
		str =
			str.substring(0, 0) + 'ZYZ\nYY XY\nX \nZ Y \nZ ' + str.substring(0);
		pieceTable.insert(3, 'XXY \n\nY Y YYY  ZYXY ');
		str = str.substring(0, 3) + 'XXY \n\nY Y YYY  ZYXY ' + str.substring(3);

		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		testLineStarts(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('delete random bug 1: I forgot to update the lineFeedCnt when deletion is on one single piece.', () => {
		const pieceTree = createTextBuffer(['']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, 'ba\na\nca\nba\ncbab\ncaa ');
		pieceTable.insert(13, 'cca\naabb\ncac\nccc\nab ');
		pieceTable.delete(5, 8);
		pieceTable.delete(30, 2);
		pieceTable.insert(24, 'cbbacccbac\nbaaab\n\nc ');
		pieceTable.delete(29, 3);
		pieceTable.delete(23, 9);
		pieceTable.delete(21, 5);
		pieceTable.delete(30, 3);
		pieceTable.insert(3, 'cb\nac\nc\n\nacc\nbb\nb\nc ');
		pieceTable.delete(19, 5);
		pieceTable.insert(18, '\nbb\n\nacbc\ncbb\nc\nbb\n ');
		pieceTable.insert(65, 'cbccbac\nbc\n\nccabba\n ');
		pieceTable.insert(77, 'a\ncacb\n\nac\n\n\n\n\nabab ');
		pieceTable.delete(30, 9);
		pieceTable.insert(45, 'b\n\nc\nba\n\nbbbba\n\naa\n ');
		pieceTable.insert(82, 'ab\nbb\ncabacab\ncbc\na ');
		pieceTable.delete(123, 9);
		pieceTable.delete(71, 2);
		pieceTable.insert(33, 'acaa\nacb\n\naa\n\nc\n\n\n\n ');

		const str = pieceTable.getLinesRawContent();
		testLineStarts(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('delete random bug rb tree 1', () => {
		let str = '';
		const pieceTree = createTextBuffer([str]);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, 'YXXZ\n\nYY\n');
		str = str.substring(0, 0) + 'YXXZ\n\nYY\n' + str.substring(0);
		pieceTable.delete(0, 5);
		str = str.substring(0, 0) + str.substring(0 + 5);
		pieceTable.insert(0, 'ZXYY\nX\nZ\n');
		str = str.substring(0, 0) + 'ZXYY\nX\nZ\n' + str.substring(0);
		pieceTable.insert(10, '\nXY\nYXYXY');
		str = str.substring(0, 10) + '\nXY\nYXYXY' + str.substring(10);
		testLineStarts(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('delete random bug rb tree 2', () => {
		let str = '';
		const pieceTree = createTextBuffer([str]);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, 'YXXZ\n\nYY\n');
		str = str.substring(0, 0) + 'YXXZ\n\nYY\n' + str.substring(0);
		pieceTable.insert(0, 'ZXYY\nX\nZ\n');
		str = str.substring(0, 0) + 'ZXYY\nX\nZ\n' + str.substring(0);
		pieceTable.insert(10, '\nXY\nYXYXY');
		str = str.substring(0, 10) + '\nXY\nYXYXY' + str.substring(10);
		pieceTable.insert(8, 'YZXY\nZ\nYX');
		str = str.substring(0, 8) + 'YZXY\nZ\nYX' + str.substring(8);
		pieceTable.insert(12, 'XX\nXXYXYZ');
		str = str.substring(0, 12) + 'XX\nXXYXYZ' + str.substring(12);
		pieceTable.delete(0, 4);
		str = str.substring(0, 0) + str.substring(0 + 4);

		testLineStarts(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('delete random bug rb tree 3', () => {
		let str = '';
		const pieceTree = createTextBuffer([str]);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, 'YXXZ\n\nYY\n');
		str = str.substring(0, 0) + 'YXXZ\n\nYY\n' + str.substring(0);
		pieceTable.delete(7, 2);
		str = str.substring(0, 7) + str.substring(7 + 2);
		pieceTable.delete(6, 1);
		str = str.substring(0, 6) + str.substring(6 + 1);
		pieceTable.delete(0, 5);
		str = str.substring(0, 0) + str.substring(0 + 5);
		pieceTable.insert(0, 'ZXYY\nX\nZ\n');
		str = str.substring(0, 0) + 'ZXYY\nX\nZ\n' + str.substring(0);
		pieceTable.insert(10, '\nXY\nYXYXY');
		str = str.substring(0, 10) + '\nXY\nYXYXY' + str.substring(10);
		pieceTable.insert(8, 'YZXY\nZ\nYX');
		str = str.substring(0, 8) + 'YZXY\nZ\nYX' + str.substring(8);
		pieceTable.insert(12, 'XX\nXXYXYZ');
		str = str.substring(0, 12) + 'XX\nXXYXYZ' + str.substring(12);
		pieceTable.delete(0, 4);
		str = str.substring(0, 0) + str.substring(0 + 4);
		pieceTable.delete(30, 3);
		str = str.substring(0, 30) + str.substring(30 + 3);

		testLineStarts(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});
});

suite('offset 2 position', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	test('random tests bug 1', () => {
		let str = '';
		const pieceTree = createTextBuffer(['']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, 'huuyYzUfKOENwGgZLqn ');
		str = str.substring(0, 0) + 'huuyYzUfKOENwGgZLqn ' + str.substring(0);
		pieceTable.delete(18, 2);
		str = str.substring(0, 18) + str.substring(18 + 2);
		pieceTable.delete(3, 1);
		str = str.substring(0, 3) + str.substring(3 + 1);
		pieceTable.delete(12, 4);
		str = str.substring(0, 12) + str.substring(12 + 4);
		pieceTable.insert(3, 'hMbnVEdTSdhLlPevXKF ');
		str = str.substring(0, 3) + 'hMbnVEdTSdhLlPevXKF ' + str.substring(3);
		pieceTable.delete(22, 8);
		str = str.substring(0, 22) + str.substring(22 + 8);
		pieceTable.insert(4, 'S umSnYrqOmOAV\nEbZJ ');
		str = str.substring(0, 4) + 'S umSnYrqOmOAV\nEbZJ ' + str.substring(4);

		testLineStarts(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});
});

suite('get text in range', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	test('getContentInRange', () => {
		const pieceTree = createTextBuffer(['a\nb\nc\nde']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(8, 'fh\ni\njk');
		pieceTable.delete(7, 2);
		// 'a\nb\nc\ndh\ni\njk'

		assert.strictEqual(pieceTable.getValueInRange(new Range(1, 1, 1, 3)), 'a\n');
		assert.strictEqual(pieceTable.getValueInRange(new Range(2, 1, 2, 3)), 'b\n');
		assert.strictEqual(pieceTable.getValueInRange(new Range(3, 1, 3, 3)), 'c\n');
		assert.strictEqual(pieceTable.getValueInRange(new Range(4, 1, 4, 4)), 'dh\n');
		assert.strictEqual(pieceTable.getValueInRange(new Range(5, 1, 5, 3)), 'i\n');
		assert.strictEqual(pieceTable.getValueInRange(new Range(6, 1, 6, 3)), 'jk');
		assertTreeInvariants(pieceTable);
	});

	test('random test value in range', () => {
		let str = '';
		const pieceTree = createTextBuffer([str]);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(0, 'ZXXY');
		str = str.substring(0, 0) + 'ZXXY' + str.substring(0);
		pieceTable.insert(1, 'XZZY');
		str = str.substring(0, 1) + 'XZZY' + str.substring(1);
		pieceTable.insert(5, '\nX\n\n');
		str = str.substring(0, 5) + '\nX\n\n' + str.substring(5);
		pieceTable.insert(3, '\nXX\n');
		str = str.substring(0, 3) + '\nXX\n' + str.substring(3);
		pieceTable.insert(12, 'YYYX');
		str = str.substring(0, 12) + 'YYYX' + str.substring(12);

		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});
	test('random test value in range exception', () => {
		let str = '';
		const pieceTree = createTextBuffer([str]);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(0, 'XZ\nZ');
		str = str.substring(0, 0) + 'XZ\nZ' + str.substring(0);
		pieceTable.delete(0, 3);
		str = str.substring(0, 0) + str.substring(0 + 3);
		pieceTable.delete(0, 1);
		str = str.substring(0, 0) + str.substring(0 + 1);
		pieceTable.insert(0, 'ZYX\n');
		str = str.substring(0, 0) + 'ZYX\n' + str.substring(0);
		pieceTable.delete(0, 4);
		str = str.substring(0, 0) + str.substring(0 + 4);

		pieceTable.getValueInRange(new Range(1, 1, 1, 1));
		assertTreeInvariants(pieceTable);
	});

	test('random tests bug 1', () => {
		let str = '';
		const pieceTree = createTextBuffer(['']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, 'huuyYzUfKOENwGgZLqn ');
		str = str.substring(0, 0) + 'huuyYzUfKOENwGgZLqn ' + str.substring(0);
		pieceTable.delete(18, 2);
		str = str.substring(0, 18) + str.substring(18 + 2);
		pieceTable.delete(3, 1);
		str = str.substring(0, 3) + str.substring(3 + 1);
		pieceTable.delete(12, 4);
		str = str.substring(0, 12) + str.substring(12 + 4);
		pieceTable.insert(3, 'hMbnVEdTSdhLlPevXKF ');
		str = str.substring(0, 3) + 'hMbnVEdTSdhLlPevXKF ' + str.substring(3);
		pieceTable.delete(22, 8);
		str = str.substring(0, 22) + str.substring(22 + 8);
		pieceTable.insert(4, 'S umSnYrqOmOAV\nEbZJ ');
		str = str.substring(0, 4) + 'S umSnYrqOmOAV\nEbZJ ' + str.substring(4);
		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('random tests bug 2', () => {
		let str = '';
		const pieceTree = createTextBuffer(['']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, 'xfouRDZwdAHjVXJAMV\n ');
		str = str.substring(0, 0) + 'xfouRDZwdAHjVXJAMV\n ' + str.substring(0);
		pieceTable.insert(16, 'dBGndxpFZBEAIKykYYx ');
		str = str.substring(0, 16) + 'dBGndxpFZBEAIKykYYx ' + str.substring(16);
		pieceTable.delete(7, 6);
		str = str.substring(0, 7) + str.substring(7 + 6);
		pieceTable.delete(9, 7);
		str = str.substring(0, 9) + str.substring(9 + 7);
		pieceTable.delete(17, 6);
		str = str.substring(0, 17) + str.substring(17 + 6);
		pieceTable.delete(0, 4);
		str = str.substring(0, 0) + str.substring(0 + 4);
		pieceTable.insert(9, 'qvEFXCNvVkWgvykahYt ');
		str = str.substring(0, 9) + 'qvEFXCNvVkWgvykahYt ' + str.substring(9);
		pieceTable.delete(4, 6);
		str = str.substring(0, 4) + str.substring(4 + 6);
		pieceTable.insert(11, 'OcSChUYT\nzPEBOpsGmR ');
		str =
			str.substring(0, 11) + 'OcSChUYT\nzPEBOpsGmR ' + str.substring(11);
		pieceTable.insert(15, 'KJCozaXTvkE\nxnqAeTz ');
		str =
			str.substring(0, 15) + 'KJCozaXTvkE\nxnqAeTz ' + str.substring(15);

		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('get line content', () => {
		const pieceTree = createTextBuffer(['1']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		assert.strictEqual(pieceTable.getLineRawContent(1), '1');
		pieceTable.insert(1, '2');
		assert.strictEqual(pieceTable.getLineRawContent(1), '12');
		assertTreeInvariants(pieceTable);
	});

	test('get line content basic', () => {
		const pieceTree = createTextBuffer(['1\n2\n3\n4']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		assert.strictEqual(pieceTable.getLineRawContent(1), '1\n');
		assert.strictEqual(pieceTable.getLineRawContent(2), '2\n');
		assert.strictEqual(pieceTable.getLineRawContent(3), '3\n');
		assert.strictEqual(pieceTable.getLineRawContent(4), '4');
		assertTreeInvariants(pieceTable);
	});

	test('get line content after inserts/deletes', () => {
		const pieceTree = createTextBuffer(['a\nb\nc\nde']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(8, 'fh\ni\njk');
		pieceTable.delete(7, 2);
		// 'a\nb\nc\ndh\ni\njk'

		assert.strictEqual(pieceTable.getLineRawContent(1), 'a\n');
		assert.strictEqual(pieceTable.getLineRawContent(2), 'b\n');
		assert.strictEqual(pieceTable.getLineRawContent(3), 'c\n');
		assert.strictEqual(pieceTable.getLineRawContent(4), 'dh\n');
		assert.strictEqual(pieceTable.getLineRawContent(5), 'i\n');
		assert.strictEqual(pieceTable.getLineRawContent(6), 'jk');
		assertTreeInvariants(pieceTable);
	});

	test('random 1', () => {
		let str = '';
		const pieceTree = createTextBuffer(['']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(0, 'J eNnDzQpnlWyjmUu\ny ');
		str = str.substring(0, 0) + 'J eNnDzQpnlWyjmUu\ny ' + str.substring(0);
		pieceTable.insert(0, 'QPEeRAQmRwlJqtZSWhQ ');
		str = str.substring(0, 0) + 'QPEeRAQmRwlJqtZSWhQ ' + str.substring(0);
		pieceTable.delete(5, 1);
		str = str.substring(0, 5) + str.substring(5 + 1);

		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('random 2', () => {
		let str = '';
		const pieceTree = createTextBuffer(['']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, 'DZoQ tglPCRHMltejRI ');
		str = str.substring(0, 0) + 'DZoQ tglPCRHMltejRI ' + str.substring(0);
		pieceTable.insert(10, 'JRXiyYqJ qqdcmbfkKX ');
		str = str.substring(0, 10) + 'JRXiyYqJ qqdcmbfkKX ' + str.substring(10);
		pieceTable.delete(16, 3);
		str = str.substring(0, 16) + str.substring(16 + 3);
		pieceTable.delete(25, 1);
		str = str.substring(0, 25) + str.substring(25 + 1);
		pieceTable.insert(18, 'vH\nNlvfqQJPm\nSFkhMc ');
		str =
			str.substring(0, 18) + 'vH\nNlvfqQJPm\nSFkhMc ' + str.substring(18);

		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});
});

suite('CRLF', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	test('delete CR in CRLF 1', () => {
		const pieceTree = createTextBuffer([''], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, 'a\r\nb');
		pieceTable.delete(0, 2);

		assert.strictEqual(pieceTable.getLineCount(), 2);
		assertTreeInvariants(pieceTable);
	});

	test('delete CR in CRLF 2', () => {
		const pieceTree = createTextBuffer([''], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, 'a\r\nb');
		pieceTable.delete(2, 2);

		assert.strictEqual(pieceTable.getLineCount(), 2);
		assertTreeInvariants(pieceTable);
	});

	test('random bug 1', () => {
		let str = '';
		const pieceTree = createTextBuffer([''], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.insert(0, '\n\n\r\r');
		str = str.substring(0, 0) + '\n\n\r\r' + str.substring(0);
		pieceTable.insert(1, '\r\n\r\n');
		str = str.substring(0, 1) + '\r\n\r\n' + str.substring(1);
		pieceTable.delete(5, 3);
		str = str.substring(0, 5) + str.substring(5 + 3);
		pieceTable.delete(2, 3);
		str = str.substring(0, 2) + str.substring(2 + 3);

		const lines = splitLines(str);
		assert.strictEqual(pieceTable.getLineCount(), lines.length);
		assertTreeInvariants(pieceTable);
	});
	test('random bug 2', () => {
		let str = '';
		const pieceTree = createTextBuffer([''], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(0, '\n\r\n\r');
		str = str.substring(0, 0) + '\n\r\n\r' + str.substring(0);
		pieceTable.insert(2, '\n\r\r\r');
		str = str.substring(0, 2) + '\n\r\r\r' + str.substring(2);
		pieceTable.delete(4, 1);
		str = str.substring(0, 4) + str.substring(4 + 1);

		const lines = splitLines(str);
		assert.strictEqual(pieceTable.getLineCount(), lines.length);
		assertTreeInvariants(pieceTable);
	});
	test('random bug 3', () => {
		let str = '';
		const pieceTree = createTextBuffer([''], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(0, '\n\n\n\r');
		str = str.substring(0, 0) + '\n\n\n\r' + str.substring(0);
		pieceTable.delete(2, 2);
		str = str.substring(0, 2) + str.substring(2 + 2);
		pieceTable.delete(0, 2);
		str = str.substring(0, 0) + str.substring(0 + 2);
		pieceTable.insert(0, '\r\r\r\r');
		str = str.substring(0, 0) + '\r\r\r\r' + str.substring(0);
		pieceTable.insert(2, '\r\n\r\r');
		str = str.substring(0, 2) + '\r\n\r\r' + str.substring(2);
		pieceTable.insert(3, '\r\r\r\n');
		str = str.substring(0, 3) + '\r\r\r\n' + str.substring(3);

		const lines = splitLines(str);
		assert.strictEqual(pieceTable.getLineCount(), lines.length);
		assertTreeInvariants(pieceTable);
	});
	test('random bug 4', () => {
		let str = '';
		const pieceTree = createTextBuffer([''], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(0, '\n\n\n\n');
		str = str.substring(0, 0) + '\n\n\n\n' + str.substring(0);
		pieceTable.delete(3, 1);
		str = str.substring(0, 3) + str.substring(3 + 1);
		pieceTable.insert(1, '\r\r\r\r');
		str = str.substring(0, 1) + '\r\r\r\r' + str.substring(1);
		pieceTable.insert(6, '\r\n\n\r');
		str = str.substring(0, 6) + '\r\n\n\r' + str.substring(6);
		pieceTable.delete(5, 3);
		str = str.substring(0, 5) + str.substring(5 + 3);

		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});
	test('random bug 5', () => {
		let str = '';
		const pieceTree = createTextBuffer([''], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(0, '\n\n\n\n');
		str = str.substring(0, 0) + '\n\n\n\n' + str.substring(0);
		pieceTable.delete(3, 1);
		str = str.substring(0, 3) + str.substring(3 + 1);
		pieceTable.insert(0, '\n\r\r\n');
		str = str.substring(0, 0) + '\n\r\r\n' + str.substring(0);
		pieceTable.insert(4, '\n\r\r\n');
		str = str.substring(0, 4) + '\n\r\r\n' + str.substring(4);
		pieceTable.delete(4, 3);
		str = str.substring(0, 4) + str.substring(4 + 3);
		pieceTable.insert(5, '\r\r\n\r');
		str = str.substring(0, 5) + '\r\r\n\r' + str.substring(5);
		pieceTable.insert(12, '\n\n\n\r');
		str = str.substring(0, 12) + '\n\n\n\r' + str.substring(12);
		pieceTable.insert(5, '\r\r\r\n');
		str = str.substring(0, 5) + '\r\r\r\n' + str.substring(5);
		pieceTable.insert(20, '\n\n\r\n');
		str = str.substring(0, 20) + '\n\n\r\n' + str.substring(20);

		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});
	test('random bug 6', () => {
		let str = '';
		const pieceTree = createTextBuffer([''], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(0, '\n\r\r\n');
		str = str.substring(0, 0) + '\n\r\r\n' + str.substring(0);
		pieceTable.insert(4, '\r\n\n\r');
		str = str.substring(0, 4) + '\r\n\n\r' + str.substring(4);
		pieceTable.insert(3, '\r\n\n\n');
		str = str.substring(0, 3) + '\r\n\n\n' + str.substring(3);
		pieceTable.delete(4, 8);
		str = str.substring(0, 4) + str.substring(4 + 8);
		pieceTable.insert(4, '\r\n\n\r');
		str = str.substring(0, 4) + '\r\n\n\r' + str.substring(4);
		pieceTable.insert(0, '\r\n\n\r');
		str = str.substring(0, 0) + '\r\n\n\r' + str.substring(0);
		pieceTable.delete(4, 0);
		str = str.substring(0, 4) + str.substring(4 + 0);
		pieceTable.delete(8, 4);
		str = str.substring(0, 8) + str.substring(8 + 4);

		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});
	test('random bug 8', () => {
		let str = '';
		const pieceTree = createTextBuffer([''], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(0, '\r\n\n\r');
		str = str.substring(0, 0) + '\r\n\n\r' + str.substring(0);
		pieceTable.delete(1, 0);
		str = str.substring(0, 1) + str.substring(1 + 0);
		pieceTable.insert(3, '\n\n\n\r');
		str = str.substring(0, 3) + '\n\n\n\r' + str.substring(3);
		pieceTable.insert(7, '\n\n\r\n');
		str = str.substring(0, 7) + '\n\n\r\n' + str.substring(7);

		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});
	test('random bug 7', () => {
		let str = '';
		const pieceTree = createTextBuffer([''], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(0, '\r\r\n\n');
		str = str.substring(0, 0) + '\r\r\n\n' + str.substring(0);
		pieceTable.insert(4, '\r\n\n\r');
		str = str.substring(0, 4) + '\r\n\n\r' + str.substring(4);
		pieceTable.insert(7, '\n\r\r\r');
		str = str.substring(0, 7) + '\n\r\r\r' + str.substring(7);
		pieceTable.insert(11, '\n\n\r\n');
		str = str.substring(0, 11) + '\n\n\r\n' + str.substring(11);
		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('random bug 10', () => {
		let str = '';
		const pieceTree = createTextBuffer([''], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(0, 'qneW');
		str = str.substring(0, 0) + 'qneW' + str.substring(0);
		pieceTable.insert(0, 'YhIl');
		str = str.substring(0, 0) + 'YhIl' + str.substring(0);
		pieceTable.insert(0, 'qdsm');
		str = str.substring(0, 0) + 'qdsm' + str.substring(0);
		pieceTable.delete(7, 0);
		str = str.substring(0, 7) + str.substring(7 + 0);
		pieceTable.insert(12, 'iiPv');
		str = str.substring(0, 12) + 'iiPv' + str.substring(12);
		pieceTable.insert(9, 'V\rSA');
		str = str.substring(0, 9) + 'V\rSA' + str.substring(9);

		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('random bug 9', () => {
		let str = '';
		const pieceTree = createTextBuffer([''], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(0, '\n\n\n\n');
		str = str.substring(0, 0) + '\n\n\n\n' + str.substring(0);
		pieceTable.insert(3, '\n\r\n\r');
		str = str.substring(0, 3) + '\n\r\n\r' + str.substring(3);
		pieceTable.insert(2, '\n\r\n\n');
		str = str.substring(0, 2) + '\n\r\n\n' + str.substring(2);
		pieceTable.insert(0, '\n\n\r\r');
		str = str.substring(0, 0) + '\n\n\r\r' + str.substring(0);
		pieceTable.insert(3, '\r\r\r\r');
		str = str.substring(0, 3) + '\r\r\r\r' + str.substring(3);
		pieceTable.insert(3, '\n\n\r\r');
		str = str.substring(0, 3) + '\n\n\r\r' + str.substring(3);

		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});
});

suite('centralized lineStarts with CRLF', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	test('delete CR in CRLF 1', () => {
		const pieceTree = createTextBuffer(['a\r\nb'], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.delete(2, 2);
		assert.strictEqual(pieceTable.getLineCount(), 2);
		assertTreeInvariants(pieceTable);
	});
	test('delete CR in CRLF 2', () => {
		const pieceTree = createTextBuffer(['a\r\nb']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.delete(0, 2);

		assert.strictEqual(pieceTable.getLineCount(), 2);
		assertTreeInvariants(pieceTable);
	});

	test('random bug 1', () => {
		let str = '\n\n\r\r';
		const pieceTree = createTextBuffer(['\n\n\r\r'], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(1, '\r\n\r\n');
		str = str.substring(0, 1) + '\r\n\r\n' + str.substring(1);
		pieceTable.delete(5, 3);
		str = str.substring(0, 5) + str.substring(5 + 3);
		pieceTable.delete(2, 3);
		str = str.substring(0, 2) + str.substring(2 + 3);

		const lines = splitLines(str);
		assert.strictEqual(pieceTable.getLineCount(), lines.length);
		assertTreeInvariants(pieceTable);
	});
	test('random bug 2', () => {
		let str = '\n\r\n\r';
		const pieceTree = createTextBuffer(['\n\r\n\r'], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(2, '\n\r\r\r');
		str = str.substring(0, 2) + '\n\r\r\r' + str.substring(2);
		pieceTable.delete(4, 1);
		str = str.substring(0, 4) + str.substring(4 + 1);

		const lines = splitLines(str);
		assert.strictEqual(pieceTable.getLineCount(), lines.length);
		assertTreeInvariants(pieceTable);
	});

	test('random bug 3', () => {
		let str = '\n\n\n\r';
		const pieceTree = createTextBuffer(['\n\n\n\r'], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.delete(2, 2);
		str = str.substring(0, 2) + str.substring(2 + 2);
		pieceTable.delete(0, 2);
		str = str.substring(0, 0) + str.substring(0 + 2);
		pieceTable.insert(0, '\r\r\r\r');
		str = str.substring(0, 0) + '\r\r\r\r' + str.substring(0);
		pieceTable.insert(2, '\r\n\r\r');
		str = str.substring(0, 2) + '\r\n\r\r' + str.substring(2);
		pieceTable.insert(3, '\r\r\r\n');
		str = str.substring(0, 3) + '\r\r\r\n' + str.substring(3);

		const lines = splitLines(str);
		assert.strictEqual(pieceTable.getLineCount(), lines.length);
		assertTreeInvariants(pieceTable);
	});

	test('random bug 4', () => {
		let str = '\n\n\n\n';
		const pieceTree = createTextBuffer(['\n\n\n\n'], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.delete(3, 1);
		str = str.substring(0, 3) + str.substring(3 + 1);
		pieceTable.insert(1, '\r\r\r\r');
		str = str.substring(0, 1) + '\r\r\r\r' + str.substring(1);
		pieceTable.insert(6, '\r\n\n\r');
		str = str.substring(0, 6) + '\r\n\n\r' + str.substring(6);
		pieceTable.delete(5, 3);
		str = str.substring(0, 5) + str.substring(5 + 3);

		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('random bug 5', () => {
		let str = '\n\n\n\n';
		const pieceTree = createTextBuffer(['\n\n\n\n'], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.delete(3, 1);
		str = str.substring(0, 3) + str.substring(3 + 1);
		pieceTable.insert(0, '\n\r\r\n');
		str = str.substring(0, 0) + '\n\r\r\n' + str.substring(0);
		pieceTable.insert(4, '\n\r\r\n');
		str = str.substring(0, 4) + '\n\r\r\n' + str.substring(4);
		pieceTable.delete(4, 3);
		str = str.substring(0, 4) + str.substring(4 + 3);
		pieceTable.insert(5, '\r\r\n\r');
		str = str.substring(0, 5) + '\r\r\n\r' + str.substring(5);
		pieceTable.insert(12, '\n\n\n\r');
		str = str.substring(0, 12) + '\n\n\n\r' + str.substring(12);
		pieceTable.insert(5, '\r\r\r\n');
		str = str.substring(0, 5) + '\r\r\r\n' + str.substring(5);
		pieceTable.insert(20, '\n\n\r\n');
		str = str.substring(0, 20) + '\n\n\r\n' + str.substring(20);

		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('random bug 6', () => {
		let str = '\n\r\r\n';
		const pieceTree = createTextBuffer(['\n\r\r\n'], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(4, '\r\n\n\r');
		str = str.substring(0, 4) + '\r\n\n\r' + str.substring(4);
		pieceTable.insert(3, '\r\n\n\n');
		str = str.substring(0, 3) + '\r\n\n\n' + str.substring(3);
		pieceTable.delete(4, 8);
		str = str.substring(0, 4) + str.substring(4 + 8);
		pieceTable.insert(4, '\r\n\n\r');
		str = str.substring(0, 4) + '\r\n\n\r' + str.substring(4);
		pieceTable.insert(0, '\r\n\n\r');
		str = str.substring(0, 0) + '\r\n\n\r' + str.substring(0);
		pieceTable.delete(4, 0);
		str = str.substring(0, 4) + str.substring(4 + 0);
		pieceTable.delete(8, 4);
		str = str.substring(0, 8) + str.substring(8 + 4);

		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('random bug 7', () => {
		let str = '\r\n\n\r';
		const pieceTree = createTextBuffer(['\r\n\n\r'], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.delete(1, 0);
		str = str.substring(0, 1) + str.substring(1 + 0);
		pieceTable.insert(3, '\n\n\n\r');
		str = str.substring(0, 3) + '\n\n\n\r' + str.substring(3);
		pieceTable.insert(7, '\n\n\r\n');
		str = str.substring(0, 7) + '\n\n\r\n' + str.substring(7);

		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('random bug 8', () => {
		let str = '\r\r\n\n';
		const pieceTree = createTextBuffer(['\r\r\n\n'], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(4, '\r\n\n\r');
		str = str.substring(0, 4) + '\r\n\n\r' + str.substring(4);
		pieceTable.insert(7, '\n\r\r\r');
		str = str.substring(0, 7) + '\n\r\r\r' + str.substring(7);
		pieceTable.insert(11, '\n\n\r\n');
		str = str.substring(0, 11) + '\n\n\r\n' + str.substring(11);
		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('random bug 9', () => {
		let str = 'qneW';
		const pieceTree = createTextBuffer(['qneW'], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(0, 'YhIl');
		str = str.substring(0, 0) + 'YhIl' + str.substring(0);
		pieceTable.insert(0, 'qdsm');
		str = str.substring(0, 0) + 'qdsm' + str.substring(0);
		pieceTable.delete(7, 0);
		str = str.substring(0, 7) + str.substring(7 + 0);
		pieceTable.insert(12, 'iiPv');
		str = str.substring(0, 12) + 'iiPv' + str.substring(12);
		pieceTable.insert(9, 'V\rSA');
		str = str.substring(0, 9) + 'V\rSA' + str.substring(9);

		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('random bug 10', () => {
		let str = '\n\n\n\n';
		const pieceTree = createTextBuffer(['\n\n\n\n'], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.insert(3, '\n\r\n\r');
		str = str.substring(0, 3) + '\n\r\n\r' + str.substring(3);
		pieceTable.insert(2, '\n\r\n\n');
		str = str.substring(0, 2) + '\n\r\n\n' + str.substring(2);
		pieceTable.insert(0, '\n\n\r\r');
		str = str.substring(0, 0) + '\n\n\r\r' + str.substring(0);
		pieceTable.insert(3, '\r\r\r\r');
		str = str.substring(0, 3) + '\r\r\r\r' + str.substring(3);
		pieceTable.insert(3, '\n\n\r\r');
		str = str.substring(0, 3) + '\n\n\r\r' + str.substring(3);

		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('random chunk bug 1', () => {
		const pieceTree = createTextBuffer(['\n\r\r\n\n\n\r\n\r'], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		let str = '\n\r\r\n\n\n\r\n\r';
		pieceTable.delete(0, 2);
		str = str.substring(0, 0) + str.substring(0 + 2);
		pieceTable.insert(1, '\r\r\n\n');
		str = str.substring(0, 1) + '\r\r\n\n' + str.substring(1);
		pieceTable.insert(7, '\r\r\r\r');
		str = str.substring(0, 7) + '\r\r\r\r' + str.substring(7);

		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		testLineStarts(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('random chunk bug 2', () => {
		const pieceTree = createTextBuffer([
			'\n\r\n\n\n\r\n\r\n\r\r\n\n\n\r\r\n\r\n'
		], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		let str = '\n\r\n\n\n\r\n\r\n\r\r\n\n\n\r\r\n\r\n';
		pieceTable.insert(16, '\r\n\r\r');
		str = str.substring(0, 16) + '\r\n\r\r' + str.substring(16);
		pieceTable.insert(13, '\n\n\r\r');
		str = str.substring(0, 13) + '\n\n\r\r' + str.substring(13);
		pieceTable.insert(19, '\n\n\r\n');
		str = str.substring(0, 19) + '\n\n\r\n' + str.substring(19);
		pieceTable.delete(5, 0);
		str = str.substring(0, 5) + str.substring(5 + 0);
		pieceTable.delete(11, 2);
		str = str.substring(0, 11) + str.substring(11 + 2);

		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		testLineStarts(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('random chunk bug 3', () => {
		const pieceTree = createTextBuffer(['\r\n\n\n\n\n\n\r\n'], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		let str = '\r\n\n\n\n\n\n\r\n';
		pieceTable.insert(4, '\n\n\r\n\r\r\n\n\r');
		str = str.substring(0, 4) + '\n\n\r\n\r\r\n\n\r' + str.substring(4);
		pieceTable.delete(4, 4);
		str = str.substring(0, 4) + str.substring(4 + 4);
		pieceTable.insert(11, '\r\n\r\n\n\r\r\n\n');
		str = str.substring(0, 11) + '\r\n\r\n\n\r\r\n\n' + str.substring(11);
		pieceTable.delete(1, 2);
		str = str.substring(0, 1) + str.substring(1 + 2);

		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		testLineStarts(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('random chunk bug 4', () => {
		const pieceTree = createTextBuffer(['\n\r\n\r'], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		let str = '\n\r\n\r';
		pieceTable.insert(4, '\n\n\r\n');
		str = str.substring(0, 4) + '\n\n\r\n' + str.substring(4);
		pieceTable.insert(3, '\r\n\n\n');
		str = str.substring(0, 3) + '\r\n\n\n' + str.substring(3);

		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		testLineStarts(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});
});

suite('random is unsupervised', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	test('splitting large change buffer', function () {
		const pieceTree = createTextBuffer([''], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		let str = '';

		pieceTable.insert(0, 'WUZ\nXVZY\n');
		str = str.substring(0, 0) + 'WUZ\nXVZY\n' + str.substring(0);
		pieceTable.insert(8, '\r\r\nZXUWVW');
		str = str.substring(0, 8) + '\r\r\nZXUWVW' + str.substring(8);
		pieceTable.delete(10, 7);
		str = str.substring(0, 10) + str.substring(10 + 7);
		pieceTable.delete(10, 1);
		str = str.substring(0, 10) + str.substring(10 + 1);
		pieceTable.insert(4, 'VX\r\r\nWZVZ');
		str = str.substring(0, 4) + 'VX\r\r\nWZVZ' + str.substring(4);
		pieceTable.delete(11, 3);
		str = str.substring(0, 11) + str.substring(11 + 3);
		pieceTable.delete(12, 4);
		str = str.substring(0, 12) + str.substring(12 + 4);
		pieceTable.delete(8, 0);
		str = str.substring(0, 8) + str.substring(8 + 0);
		pieceTable.delete(10, 2);
		str = str.substring(0, 10) + str.substring(10 + 2);
		pieceTable.insert(0, 'VZXXZYZX\r');
		str = str.substring(0, 0) + 'VZXXZYZX\r' + str.substring(0);

		assert.strictEqual(pieceTable.getLinesRawContent(), str);

		testLineStarts(str, pieceTable);
		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('random insert delete', function () {
		this.timeout(500000);
		let str = '';
		const pieceTree = createTextBuffer([str], false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		// let output = '';
		for (let i = 0; i < 1000; i++) {
			if (Math.random() < 0.6) {
				// insert
				const text = randomStr(100);
				const pos = randomInt(str.length + 1);
				pieceTable.insert(pos, text);
				str = str.substring(0, pos) + text + str.substring(pos);
				// output += `pieceTable.insert(${pos}, '${text.replace(/\n/g, '\\n').replace(/\r/g, '\\r')}');\n`;
				// output += `str = str.substring(0, ${pos}) + '${text.replace(/\n/g, '\\n').replace(/\r/g, '\\r')}' + str.substring(${pos});\n`;
			} else {
				// delete
				const pos = randomInt(str.length);
				const length = Math.min(
					str.length - pos,
					Math.floor(Math.random() * 10)
				);
				pieceTable.delete(pos, length);
				str = str.substring(0, pos) + str.substring(pos + length);
				// output += `pieceTable.delete(${pos}, ${length});\n`;
				// output += `str = str.substring(0, ${pos}) + str.substring(${pos} + ${length});\n`

			}
		}
		// console.log(output);

		assert.strictEqual(pieceTable.getLinesRawContent(), str);

		testLineStarts(str, pieceTable);
		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('random chunks', function () {
		this.timeout(500000);
		const chunks: string[] = [];
		for (let i = 0; i < 5; i++) {
			chunks.push(randomStr(1000));
		}

		const pieceTree = createTextBuffer(chunks, false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		let str = chunks.join('');

		for (let i = 0; i < 1000; i++) {
			if (Math.random() < 0.6) {
				// insert
				const text = randomStr(100);
				const pos = randomInt(str.length + 1);
				pieceTable.insert(pos, text);
				str = str.substring(0, pos) + text + str.substring(pos);
			} else {
				// delete
				const pos = randomInt(str.length);
				const length = Math.min(
					str.length - pos,
					Math.floor(Math.random() * 10)
				);
				pieceTable.delete(pos, length);
				str = str.substring(0, pos) + str.substring(pos + length);
			}
		}

		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		testLineStarts(str, pieceTable);
		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('random chunks 2', function () {
		this.timeout(500000);
		const chunks: string[] = [];
		chunks.push(randomStr(1000));

		const pieceTree = createTextBuffer(chunks, false);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		let str = chunks.join('');

		for (let i = 0; i < 50; i++) {
			if (Math.random() < 0.6) {
				// insert
				const text = randomStr(30);
				const pos = randomInt(str.length + 1);
				pieceTable.insert(pos, text);
				str = str.substring(0, pos) + text + str.substring(pos);
			} else {
				// delete
				const pos = randomInt(str.length);
				const length = Math.min(
					str.length - pos,
					Math.floor(Math.random() * 10)
				);
				pieceTable.delete(pos, length);
				str = str.substring(0, pos) + str.substring(pos + length);
			}
			testLinesContent(str, pieceTable);
		}

		assert.strictEqual(pieceTable.getLinesRawContent(), str);
		testLineStarts(str, pieceTable);
		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});
});

suite('buffer api', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	test('equal', () => {
		const a = createTextBuffer(['abc']);
		const b = createTextBuffer(['ab', 'c']);
		const c = createTextBuffer(['abd']);
		const d = createTextBuffer(['abcd']);
		ds.add(a);
		ds.add(b);
		ds.add(c);
		ds.add(d);

		assert(a.getPieceTree().equal(b.getPieceTree()));
		assert(!a.getPieceTree().equal(c.getPieceTree()));
		assert(!a.getPieceTree().equal(d.getPieceTree()));
	});

	test('equal with more chunks', () => {
		const a = createTextBuffer(['ab', 'cd', 'e']);
		const b = createTextBuffer(['ab', 'c', 'de']);
		ds.add(a);
		ds.add(b);
		assert(a.getPieceTree().equal(b.getPieceTree()));
	});

	test('equal 2, empty buffer', () => {
		const a = createTextBuffer(['']);
		const b = createTextBuffer(['']);
		ds.add(a);
		ds.add(b);

		assert(a.getPieceTree().equal(b.getPieceTree()));
	});

	test('equal 3, empty buffer', () => {
		const a = createTextBuffer(['a']);
		const b = createTextBuffer(['']);
		ds.add(a);
		ds.add(b);

		assert(!a.getPieceTree().equal(b.getPieceTree()));
	});

	test('getLineCharCode - issue #45735', () => {
		const pieceTree = createTextBuffer(['LINE1\nline2']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		assert.strictEqual(pieceTable.getLineCharCode(1, 0), 'L'.charCodeAt(0), 'L');
		assert.strictEqual(pieceTable.getLineCharCode(1, 1), 'I'.charCodeAt(0), 'I');
		assert.strictEqual(pieceTable.getLineCharCode(1, 2), 'N'.charCodeAt(0), 'N');
		assert.strictEqual(pieceTable.getLineCharCode(1, 3), 'E'.charCodeAt(0), 'E');
		assert.strictEqual(pieceTable.getLineCharCode(1, 4), '1'.charCodeAt(0), '1');
		assert.strictEqual(pieceTable.getLineCharCode(1, 5), '\n'.charCodeAt(0), '\\n');
		assert.strictEqual(pieceTable.getLineCharCode(2, 0), 'l'.charCodeAt(0), 'l');
		assert.strictEqual(pieceTable.getLineCharCode(2, 1), 'i'.charCodeAt(0), 'i');
		assert.strictEqual(pieceTable.getLineCharCode(2, 2), 'n'.charCodeAt(0), 'n');
		assert.strictEqual(pieceTable.getLineCharCode(2, 3), 'e'.charCodeAt(0), 'e');
		assert.strictEqual(pieceTable.getLineCharCode(2, 4), '2'.charCodeAt(0), '2');
	});


	test('getLineCharCode - issue #47733', () => {
		const pieceTree = createTextBuffer(['', 'LINE1\n', 'line2']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		assert.strictEqual(pieceTable.getLineCharCode(1, 0), 'L'.charCodeAt(0), 'L');
		assert.strictEqual(pieceTable.getLineCharCode(1, 1), 'I'.charCodeAt(0), 'I');
		assert.strictEqual(pieceTable.getLineCharCode(1, 2), 'N'.charCodeAt(0), 'N');
		assert.strictEqual(pieceTable.getLineCharCode(1, 3), 'E'.charCodeAt(0), 'E');
		assert.strictEqual(pieceTable.getLineCharCode(1, 4), '1'.charCodeAt(0), '1');
		assert.strictEqual(pieceTable.getLineCharCode(1, 5), '\n'.charCodeAt(0), '\\n');
		assert.strictEqual(pieceTable.getLineCharCode(2, 0), 'l'.charCodeAt(0), 'l');
		assert.strictEqual(pieceTable.getLineCharCode(2, 1), 'i'.charCodeAt(0), 'i');
		assert.strictEqual(pieceTable.getLineCharCode(2, 2), 'n'.charCodeAt(0), 'n');
		assert.strictEqual(pieceTable.getLineCharCode(2, 3), 'e'.charCodeAt(0), 'e');
		assert.strictEqual(pieceTable.getLineCharCode(2, 4), '2'.charCodeAt(0), '2');
	});

	test('getNearestChunk', () => {
		const pieceTree = createTextBuffer(['012345678']);
		ds.add(pieceTree);
		const pt = pieceTree.getPieceTree();

		pt.insert(3, 'ABC');
		assert.equal(pt.getLineContent(1), '012ABC345678');
		assert.equal(pt.getNearestChunk(3), 'ABC');
		assert.equal(pt.getNearestChunk(6), '345678');

		pt.delete(9, 1);
		assert.equal(pt.getLineContent(1), '012ABC34578');
		assert.equal(pt.getNearestChunk(6), '345');
		assert.equal(pt.getNearestChunk(9), '78');
	});
});

suite('search offset cache', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	test('render white space exception', () => {
		const pieceTree = createTextBuffer(['class Name{\n\t\n\t\t\tget() {\n\n\t\t\t}\n\t\t}']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		let str = 'class Name{\n\t\n\t\t\tget() {\n\n\t\t\t}\n\t\t}';

		pieceTable.insert(12, 's');
		str = str.substring(0, 12) + 's' + str.substring(12);

		pieceTable.insert(13, 'e');
		str = str.substring(0, 13) + 'e' + str.substring(13);

		pieceTable.insert(14, 't');
		str = str.substring(0, 14) + 't' + str.substring(14);

		pieceTable.insert(15, '()');
		str = str.substring(0, 15) + '()' + str.substring(15);

		pieceTable.delete(16, 1);
		str = str.substring(0, 16) + str.substring(16 + 1);

		pieceTable.insert(17, '()');
		str = str.substring(0, 17) + '()' + str.substring(17);

		pieceTable.delete(18, 1);
		str = str.substring(0, 18) + str.substring(18 + 1);

		pieceTable.insert(18, '}');
		str = str.substring(0, 18) + '}' + str.substring(18);

		pieceTable.insert(12, '\n');
		str = str.substring(0, 12) + '\n' + str.substring(12);

		pieceTable.delete(12, 1);
		str = str.substring(0, 12) + str.substring(12 + 1);

		pieceTable.delete(18, 1);
		str = str.substring(0, 18) + str.substring(18 + 1);

		pieceTable.insert(18, '}');
		str = str.substring(0, 18) + '}' + str.substring(18);

		pieceTable.delete(17, 2);
		str = str.substring(0, 17) + str.substring(17 + 2);

		pieceTable.delete(16, 1);
		str = str.substring(0, 16) + str.substring(16 + 1);

		pieceTable.insert(16, ')');
		str = str.substring(0, 16) + ')' + str.substring(16);

		pieceTable.delete(15, 2);
		str = str.substring(0, 15) + str.substring(15 + 2);

		const content = pieceTable.getLinesRawContent();
		assert(content === str);
	});

	test('Line breaks replacement is not necessary when EOL is normalized', () => {
		const pieceTree = createTextBuffer(['abc']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		let str = 'abc';

		pieceTable.insert(3, 'def\nabc');
		str = str + 'def\nabc';

		testLineStarts(str, pieceTable);
		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('Line breaks replacement is not necessary when EOL is normalized 2', () => {
		const pieceTree = createTextBuffer(['abc\n']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		let str = 'abc\n';

		pieceTable.insert(4, 'def\nabc');
		str = str + 'def\nabc';

		testLineStarts(str, pieceTable);
		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('Line breaks replacement is not necessary when EOL is normalized 3', () => {
		const pieceTree = createTextBuffer(['abc\n']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		let str = 'abc\n';

		pieceTable.insert(2, 'def\nabc');
		str = str.substring(0, 2) + 'def\nabc' + str.substring(2);

		testLineStarts(str, pieceTable);
		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

	test('Line breaks replacement is not necessary when EOL is normalized 4', () => {
		const pieceTree = createTextBuffer(['abc\n']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		let str = 'abc\n';

		pieceTable.insert(3, 'def\nabc');
		str = str.substring(0, 3) + 'def\nabc' + str.substring(3);

		testLineStarts(str, pieceTable);
		testLinesContent(str, pieceTable);
		assertTreeInvariants(pieceTable);
	});

});

function getValueInSnapshot(snapshot: ITextSnapshot) {
	let ret = '';
	let tmp = snapshot.read();

	while (tmp !== null) {
		ret += tmp;
		tmp = snapshot.read();
	}

	return ret;
}
suite('snapshot', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('bug #45564, piece tree pieces should be immutable', () => {
		const model = createTextModel('\n');
		model.applyEdits([
			{
				range: new Range(2, 1, 2, 1),
				text: '!'
			}
		]);
		const snapshot = model.createSnapshot();
		const snapshot1 = model.createSnapshot();
		assert.strictEqual(model.getLinesContent().join('\n'), getValueInSnapshot(snapshot));

		model.applyEdits([
			{
				range: new Range(2, 1, 2, 2),
				text: ''
			}
		]);
		model.applyEdits([
			{
				range: new Range(2, 1, 2, 1),
				text: '!'
			}
		]);

		assert.strictEqual(model.getLinesContent().join('\n'), getValueInSnapshot(snapshot1));

		model.dispose();
	});

	test('immutable snapshot 1', () => {
		const model = createTextModel('abc\ndef');
		const snapshot = model.createSnapshot();
		model.applyEdits([
			{
				range: new Range(2, 1, 2, 4),
				text: ''
			}
		]);

		model.applyEdits([
			{
				range: new Range(1, 1, 2, 1),
				text: 'abc\ndef'
			}
		]);

		assert.strictEqual(model.getLinesContent().join('\n'), getValueInSnapshot(snapshot));

		model.dispose();
	});

	test('immutable snapshot 2', () => {
		const model = createTextModel('abc\ndef');
		const snapshot = model.createSnapshot();
		model.applyEdits([
			{
				range: new Range(2, 1, 2, 1),
				text: '!'
			}
		]);

		model.applyEdits([
			{
				range: new Range(2, 1, 2, 2),
				text: ''
			}
		]);

		assert.strictEqual(model.getLinesContent().join('\n'), getValueInSnapshot(snapshot));

		model.dispose();
	});

	test('immutable snapshot 3', () => {
		const model = createTextModel('abc\ndef');
		model.applyEdits([
			{
				range: new Range(2, 4, 2, 4),
				text: '!'
			}
		]);
		const snapshot = model.createSnapshot();
		model.applyEdits([
			{
				range: new Range(2, 5, 2, 5),
				text: '!'
			}
		]);

		assert.notStrictEqual(model.getLinesContent().join('\n'), getValueInSnapshot(snapshot));

		model.dispose();
	});
});

suite('chunk based search', () => {
	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	test('#45892. For some cases, the buffer is empty but we still try to search', () => {
		const pieceTree = createTextBuffer(['']);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();
		pieceTable.delete(0, 1);
		const ret = pieceTree.findMatchesLineByLine(new Range(1, 1, 1, 1), new SearchData(/abc/, new WordCharacterClassifier(',./', []), 'abc'), true, 1000);
		assert.strictEqual(ret.length, 0);
	});

	test('#45770. FindInNode should not cross node boundary.', () => {
		const pieceTree = createTextBuffer([
			[
				'balabalababalabalababalabalaba',
				'balabalababalabalababalabalaba',
				'',
				'* [ ] task1',
				'* [x] task2 balabalaba',
				'* [ ] task 3'
			].join('\n')
		]);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.delete(0, 62);
		pieceTable.delete(16, 1);

		pieceTable.insert(16, ' ');
		const ret = pieceTable.findMatchesLineByLine(new Range(1, 1, 4, 13), new SearchData(/\[/gi, new WordCharacterClassifier(',./', []), '['), true, 1000);
		assert.strictEqual(ret.length, 3);

		assert.deepStrictEqual(ret[0].range, new Range(2, 3, 2, 4));
		assert.deepStrictEqual(ret[1].range, new Range(3, 3, 3, 4));
		assert.deepStrictEqual(ret[2].range, new Range(4, 3, 4, 4));
	});

	test('search searching from the middle', () => {
		const pieceTree = createTextBuffer([
			[
				'def',
				'dbcabc'
			].join('\n')
		]);
		ds.add(pieceTree);
		const pieceTable = pieceTree.getPieceTree();

		pieceTable.delete(4, 1);
		let ret = pieceTable.findMatchesLineByLine(new Range(2, 3, 2, 6), new SearchData(/a/gi, null, 'a'), true, 1000);
		assert.strictEqual(ret.length, 1);
		assert.deepStrictEqual(ret[0].range, new Range(2, 3, 2, 4));

		pieceTable.delete(4, 1);
		ret = pieceTable.findMatchesLineByLine(new Range(2, 2, 2, 5), new SearchData(/a/gi, null, 'a'), true, 1000);
		assert.strictEqual(ret.length, 1);
		assert.deepStrictEqual(ret[0].range, new Range(2, 2, 2, 3));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/modes/languageConfiguration.test.ts]---
Location: vscode-main/src/vs/editor/test/common/modes/languageConfiguration.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { StandardTokenType } from '../../../common/encodedTokenAttributes.js';
import { StandardAutoClosingPairConditional } from '../../../common/languages/languageConfiguration.js';
import { TestLanguageConfigurationService } from './testLanguageConfigurationService.js';

suite('StandardAutoClosingPairConditional', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Missing notIn', () => {
		const v = new StandardAutoClosingPairConditional({ open: '{', close: '}' });
		assert.strictEqual(v.isOK(StandardTokenType.Other), true);
		assert.strictEqual(v.isOK(StandardTokenType.Comment), true);
		assert.strictEqual(v.isOK(StandardTokenType.String), true);
		assert.strictEqual(v.isOK(StandardTokenType.RegEx), true);
	});

	test('Empty notIn', () => {
		const v = new StandardAutoClosingPairConditional({ open: '{', close: '}', notIn: [] });
		assert.strictEqual(v.isOK(StandardTokenType.Other), true);
		assert.strictEqual(v.isOK(StandardTokenType.Comment), true);
		assert.strictEqual(v.isOK(StandardTokenType.String), true);
		assert.strictEqual(v.isOK(StandardTokenType.RegEx), true);
	});

	test('Invalid notIn', () => {
		const v = new StandardAutoClosingPairConditional({ open: '{', close: '}', notIn: ['bla'] });
		assert.strictEqual(v.isOK(StandardTokenType.Other), true);
		assert.strictEqual(v.isOK(StandardTokenType.Comment), true);
		assert.strictEqual(v.isOK(StandardTokenType.String), true);
		assert.strictEqual(v.isOK(StandardTokenType.RegEx), true);
	});

	test('notIn in strings', () => {
		const v = new StandardAutoClosingPairConditional({ open: '{', close: '}', notIn: ['string'] });
		assert.strictEqual(v.isOK(StandardTokenType.Other), true);
		assert.strictEqual(v.isOK(StandardTokenType.Comment), true);
		assert.strictEqual(v.isOK(StandardTokenType.String), false);
		assert.strictEqual(v.isOK(StandardTokenType.RegEx), true);
	});

	test('notIn in comments', () => {
		const v = new StandardAutoClosingPairConditional({ open: '{', close: '}', notIn: ['comment'] });
		assert.strictEqual(v.isOK(StandardTokenType.Other), true);
		assert.strictEqual(v.isOK(StandardTokenType.Comment), false);
		assert.strictEqual(v.isOK(StandardTokenType.String), true);
		assert.strictEqual(v.isOK(StandardTokenType.RegEx), true);
	});

	test('notIn in regex', () => {
		const v = new StandardAutoClosingPairConditional({ open: '{', close: '}', notIn: ['regex'] });
		assert.strictEqual(v.isOK(StandardTokenType.Other), true);
		assert.strictEqual(v.isOK(StandardTokenType.Comment), true);
		assert.strictEqual(v.isOK(StandardTokenType.String), true);
		assert.strictEqual(v.isOK(StandardTokenType.RegEx), false);
	});

	test('notIn in strings nor comments', () => {
		const v = new StandardAutoClosingPairConditional({ open: '{', close: '}', notIn: ['string', 'comment'] });
		assert.strictEqual(v.isOK(StandardTokenType.Other), true);
		assert.strictEqual(v.isOK(StandardTokenType.Comment), false);
		assert.strictEqual(v.isOK(StandardTokenType.String), false);
		assert.strictEqual(v.isOK(StandardTokenType.RegEx), true);
	});

	test('notIn in strings nor regex', () => {
		const v = new StandardAutoClosingPairConditional({ open: '{', close: '}', notIn: ['string', 'regex'] });
		assert.strictEqual(v.isOK(StandardTokenType.Other), true);
		assert.strictEqual(v.isOK(StandardTokenType.Comment), true);
		assert.strictEqual(v.isOK(StandardTokenType.String), false);
		assert.strictEqual(v.isOK(StandardTokenType.RegEx), false);
	});

	test('notIn in comments nor regex', () => {
		const v = new StandardAutoClosingPairConditional({ open: '{', close: '}', notIn: ['comment', 'regex'] });
		assert.strictEqual(v.isOK(StandardTokenType.Other), true);
		assert.strictEqual(v.isOK(StandardTokenType.Comment), false);
		assert.strictEqual(v.isOK(StandardTokenType.String), true);
		assert.strictEqual(v.isOK(StandardTokenType.RegEx), false);
	});

	test('notIn in strings, comments nor regex', () => {
		const v = new StandardAutoClosingPairConditional({ open: '{', close: '}', notIn: ['string', 'comment', 'regex'] });
		assert.strictEqual(v.isOK(StandardTokenType.Other), true);
		assert.strictEqual(v.isOK(StandardTokenType.Comment), false);
		assert.strictEqual(v.isOK(StandardTokenType.String), false);
		assert.strictEqual(v.isOK(StandardTokenType.RegEx), false);
	});

	test('language configurations priorities', () => {
		const languageConfigurationService = new TestLanguageConfigurationService();
		const id = 'testLang1';
		const d1 = languageConfigurationService.register(id, { comments: { lineComment: '1' } }, 100);
		const d2 = languageConfigurationService.register(id, { comments: { lineComment: '2' } }, 10);
		assert.strictEqual(languageConfigurationService.getLanguageConfiguration(id).comments?.lineCommentToken, '1');
		d1.dispose();
		d2.dispose();
		languageConfigurationService.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/modes/languageSelector.test.ts]---
Location: vscode-main/src/vs/editor/test/common/modes/languageSelector.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { LanguageSelector, score } from '../../../common/languageSelector.js';

suite('LanguageSelector', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	const model = {
		language: 'farboo',
		uri: URI.parse('file:///testbed/file.fb')
	};

	test('score, invalid selector', function () {
		assert.strictEqual(score({}, model.uri, model.language, true, undefined, undefined), 0);
		assert.strictEqual(score(undefined, model.uri, model.language, true, undefined, undefined), 0);
		assert.strictEqual(score(null!, model.uri, model.language, true, undefined, undefined), 0);
		assert.strictEqual(score('', model.uri, model.language, true, undefined, undefined), 0);
	});

	test('score, any language', function () {
		assert.strictEqual(score({ language: '*' }, model.uri, model.language, true, undefined, undefined), 5);
		assert.strictEqual(score('*', model.uri, model.language, true, undefined, undefined), 5);

		assert.strictEqual(score('*', URI.parse('foo:bar'), model.language, true, undefined, undefined), 5);
		assert.strictEqual(score('farboo', URI.parse('foo:bar'), model.language, true, undefined, undefined), 10);
	});

	test('score, default schemes', function () {

		const uri = URI.parse('git:foo/file.txt');
		const language = 'farboo';

		assert.strictEqual(score('*', uri, language, true, undefined, undefined), 5);
		assert.strictEqual(score('farboo', uri, language, true, undefined, undefined), 10);
		assert.strictEqual(score({ language: 'farboo', scheme: '' }, uri, language, true, undefined, undefined), 10);
		assert.strictEqual(score({ language: 'farboo', scheme: 'git' }, uri, language, true, undefined, undefined), 10);
		assert.strictEqual(score({ language: 'farboo', scheme: '*' }, uri, language, true, undefined, undefined), 10);
		assert.strictEqual(score({ language: 'farboo' }, uri, language, true, undefined, undefined), 10);
		assert.strictEqual(score({ language: '*' }, uri, language, true, undefined, undefined), 5);

		assert.strictEqual(score({ scheme: '*' }, uri, language, true, undefined, undefined), 5);
		assert.strictEqual(score({ scheme: 'git' }, uri, language, true, undefined, undefined), 10);
	});

	test('score, filter', function () {
		assert.strictEqual(score('farboo', model.uri, model.language, true, undefined, undefined), 10);
		assert.strictEqual(score({ language: 'farboo' }, model.uri, model.language, true, undefined, undefined), 10);
		assert.strictEqual(score({ language: 'farboo', scheme: 'file' }, model.uri, model.language, true, undefined, undefined), 10);
		assert.strictEqual(score({ language: 'farboo', scheme: 'http' }, model.uri, model.language, true, undefined, undefined), 0);

		assert.strictEqual(score({ pattern: '**/*.fb' }, model.uri, model.language, true, undefined, undefined), 10);
		assert.strictEqual(score({ pattern: '**/*.fb', scheme: 'file' }, model.uri, model.language, true, undefined, undefined), 10);
		assert.strictEqual(score({ pattern: '**/*.fb' }, URI.parse('foo:bar'), model.language, true, undefined, undefined), 0);
		assert.strictEqual(score({ pattern: '**/*.fb', scheme: 'foo' }, URI.parse('foo:bar'), model.language, true, undefined, undefined), 0);

		const doc = {
			uri: URI.parse('git:/my/file.js'),
			langId: 'javascript'
		};
		assert.strictEqual(score('javascript', doc.uri, doc.langId, true, undefined, undefined), 10); // 0;
		assert.strictEqual(score({ language: 'javascript', scheme: 'git' }, doc.uri, doc.langId, true, undefined, undefined), 10); // 10;
		assert.strictEqual(score('*', doc.uri, doc.langId, true, undefined, undefined), 5); // 5
		assert.strictEqual(score('fooLang', doc.uri, doc.langId, true, undefined, undefined), 0); // 0
		assert.strictEqual(score(['fooLang', '*'], doc.uri, doc.langId, true, undefined, undefined), 5); // 5
	});

	test('score, max(filters)', function () {
		const match = { language: 'farboo', scheme: 'file' };
		const fail = { language: 'farboo', scheme: 'http' };

		assert.strictEqual(score(match, model.uri, model.language, true, undefined, undefined), 10);
		assert.strictEqual(score(fail, model.uri, model.language, true, undefined, undefined), 0);
		assert.strictEqual(score([match, fail], model.uri, model.language, true, undefined, undefined), 10);
		assert.strictEqual(score([fail, fail], model.uri, model.language, true, undefined, undefined), 0);
		assert.strictEqual(score(['farboo', '*'], model.uri, model.language, true, undefined, undefined), 10);
		assert.strictEqual(score(['*', 'farboo'], model.uri, model.language, true, undefined, undefined), 10);
	});

	test('score hasAccessToAllModels', function () {
		const doc = {
			uri: URI.parse('file:/my/file.js'),
			langId: 'javascript'
		};
		assert.strictEqual(score('javascript', doc.uri, doc.langId, false, undefined, undefined), 0);
		assert.strictEqual(score({ language: 'javascript', scheme: 'file' }, doc.uri, doc.langId, false, undefined, undefined), 0);
		assert.strictEqual(score('*', doc.uri, doc.langId, false, undefined, undefined), 0);
		assert.strictEqual(score('fooLang', doc.uri, doc.langId, false, undefined, undefined), 0);
		assert.strictEqual(score(['fooLang', '*'], doc.uri, doc.langId, false, undefined, undefined), 0);

		assert.strictEqual(score({ language: 'javascript', scheme: 'file', hasAccessToAllModels: true }, doc.uri, doc.langId, false, undefined, undefined), 10);
		assert.strictEqual(score(['fooLang', '*', { language: '*', hasAccessToAllModels: true }], doc.uri, doc.langId, false, undefined, undefined), 5);
	});

	test('score, notebookType', function () {
		const obj = {
			uri: URI.parse('vscode-notebook-cell:///my/file.js#blabla'),
			langId: 'javascript',
			notebookType: 'fooBook',
			notebookUri: URI.parse('file:///my/file.js')
		};

		assert.strictEqual(score('javascript', obj.uri, obj.langId, true, undefined, undefined), 10);
		assert.strictEqual(score('javascript', obj.uri, obj.langId, true, obj.notebookUri, obj.notebookType), 10);
		assert.strictEqual(score({ notebookType: 'fooBook' }, obj.uri, obj.langId, true, obj.notebookUri, obj.notebookType), 10);
		assert.strictEqual(score({ notebookType: 'fooBook', language: 'javascript', scheme: 'file' }, obj.uri, obj.langId, true, obj.notebookUri, obj.notebookType), 10);
		assert.strictEqual(score({ notebookType: 'fooBook', language: '*' }, obj.uri, obj.langId, true, obj.notebookUri, obj.notebookType), 10);
		assert.strictEqual(score({ notebookType: '*', language: '*' }, obj.uri, obj.langId, true, obj.notebookUri, obj.notebookType), 5);
		assert.strictEqual(score({ notebookType: '*', language: 'javascript' }, obj.uri, obj.langId, true, obj.notebookUri, obj.notebookType), 10);
	});

	test('Snippet choices lost #149363', function () {
		const selector: LanguageSelector = {
			scheme: 'vscode-notebook-cell',
			pattern: '/some/path/file.py',
			language: 'python'
		};

		const modelUri = URI.parse('vscode-notebook-cell:///some/path/file.py');
		const nbUri = URI.parse('file:///some/path/file.py');
		assert.strictEqual(score(selector, modelUri, 'python', true, nbUri, 'jupyter'), 10);

		const selector2: LanguageSelector = {
			...selector,
			notebookType: 'jupyter'
		};

		assert.strictEqual(score(selector2, modelUri, 'python', true, nbUri, 'jupyter'), 0);
	});

	test('Document selector match - unexpected result value #60232', function () {
		const selector = {
			language: 'json',
			scheme: 'file',
			pattern: '**/*.interface.json'
		};
		const value = score(selector, URI.parse('file:///C:/Users/zlhe/Desktop/test.interface.json'), 'json', true, undefined, undefined);
		assert.strictEqual(value, 10);
	});

	test('Document selector match - platform paths #99938', function () {
		const selector = {
			pattern: {
				base: '/home/user/Desktop',
				pattern: '*.json'
			}
		};
		const value = score(selector, URI.file('/home/user/Desktop/test.json'), 'json', true, undefined, undefined);
		assert.strictEqual(value, 10);
	});

	test('NotebookType without notebook', function () {
		const obj = {
			uri: URI.parse('file:///my/file.bat'),
			langId: 'bat',
		};

		let value = score({
			language: 'bat',
			notebookType: 'xxx'
		}, obj.uri, obj.langId, true, undefined, undefined);
		assert.strictEqual(value, 0);

		value = score({
			language: 'bat',
			notebookType: '*'
		}, obj.uri, obj.langId, true, undefined, undefined);
		assert.strictEqual(value, 0);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/modes/linkComputer.test.ts]---
Location: vscode-main/src/vs/editor/test/common/modes/linkComputer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ILink } from '../../../common/languages.js';
import { ILinkComputerTarget, computeLinks } from '../../../common/languages/linkComputer.js';

class SimpleLinkComputerTarget implements ILinkComputerTarget {

	constructor(private _lines: string[]) {
		// Intentional Empty
	}

	public getLineCount(): number {
		return this._lines.length;
	}

	public getLineContent(lineNumber: number): string {
		return this._lines[lineNumber - 1];
	}
}

function myComputeLinks(lines: string[]): ILink[] {
	const target = new SimpleLinkComputerTarget(lines);
	return computeLinks(target);
}

function assertLink(text: string, extractedLink: string): void {
	let startColumn = 0,
		endColumn = 0,
		chr: string,
		i = 0;

	for (i = 0; i < extractedLink.length; i++) {
		chr = extractedLink.charAt(i);
		if (chr !== ' ' && chr !== '\t') {
			startColumn = i + 1;
			break;
		}
	}

	for (i = extractedLink.length - 1; i >= 0; i--) {
		chr = extractedLink.charAt(i);
		if (chr !== ' ' && chr !== '\t') {
			endColumn = i + 2;
			break;
		}
	}

	const r = myComputeLinks([text]);
	assert.deepStrictEqual(r, [{
		range: {
			startLineNumber: 1,
			startColumn: startColumn,
			endLineNumber: 1,
			endColumn: endColumn
		},
		url: extractedLink.substring(startColumn - 1, endColumn - 1)
	}]);
}

suite('Editor Modes - Link Computer', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Null model', () => {
		const r = computeLinks(null);
		assert.deepStrictEqual(r, []);
	});

	test('Parsing', () => {

		assertLink(
			'x = "http://foo.bar";',
			'     http://foo.bar  '
		);

		assertLink(
			'x = (http://foo.bar);',
			'     http://foo.bar  '
		);

		assertLink(
			'x = [http://foo.bar];',
			'     http://foo.bar  '
		);

		assertLink(
			'x = \'http://foo.bar\';',
			'     http://foo.bar  '
		);

		assertLink(
			'x =  http://foo.bar ;',
			'     http://foo.bar  '
		);

		assertLink(
			'x = <http://foo.bar>;',
			'     http://foo.bar  '
		);

		assertLink(
			'x = {http://foo.bar};',
			'     http://foo.bar  '
		);

		assertLink(
			'(see http://foo.bar)',
			'     http://foo.bar  '
		);
		assertLink(
			'[see http://foo.bar]',
			'     http://foo.bar  '
		);
		assertLink(
			'{see http://foo.bar}',
			'     http://foo.bar  '
		);
		assertLink(
			'<see http://foo.bar>',
			'     http://foo.bar  '
		);
		assertLink(
			'<url>http://mylink.com</url>',
			'     http://mylink.com      '
		);
		assertLink(
			'// Click here to learn more. https://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409',
			'                             https://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409'
		);
		assertLink(
			'// Click here to learn more. https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx',
			'                             https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx'
		);
		assertLink(
			'// https://github.com/projectkudu/kudu/blob/master/Kudu.Core/Scripts/selectNodeVersion.js',
			'   https://github.com/projectkudu/kudu/blob/master/Kudu.Core/Scripts/selectNodeVersion.js'
		);
		assertLink(
			'<!-- !!! Do not remove !!!   WebContentRef(link:https://go.microsoft.com/fwlink/?LinkId=166007, area:Admin, updated:2015, nextUpdate:2016, tags:SqlServer)   !!! Do not remove !!! -->',
			'                                                https://go.microsoft.com/fwlink/?LinkId=166007                                                                                        '
		);
		assertLink(
			'For instructions, see https://go.microsoft.com/fwlink/?LinkId=166007.</value>',
			'                      https://go.microsoft.com/fwlink/?LinkId=166007         '
		);
		assertLink(
			'For instructions, see https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx.</value>',
			'                      https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx         '
		);
		assertLink(
			'x = "https://en.wikipedia.org/wiki/Zürich";',
			'     https://en.wikipedia.org/wiki/Zürich  '
		);
		assertLink(
			'請參閱 http://go.microsoft.com/fwlink/?LinkId=761051。',
			'    http://go.microsoft.com/fwlink/?LinkId=761051 '
		);
		assertLink(
			'（請參閱 http://go.microsoft.com/fwlink/?LinkId=761051）',
			'     http://go.microsoft.com/fwlink/?LinkId=761051 '
		);

		assertLink(
			'x = "file:///foo.bar";',
			'     file:///foo.bar  '
		);
		assertLink(
			'x = "file://c:/foo.bar";',
			'     file://c:/foo.bar  '
		);

		assertLink(
			'x = "file://shares/foo.bar";',
			'     file://shares/foo.bar  '
		);

		assertLink(
			'x = "file://shäres/foo.bar";',
			'     file://shäres/foo.bar  '
		);
		assertLink(
			'Some text, then http://www.bing.com.',
			'                http://www.bing.com '
		);
		assertLink(
			'let url = `http://***/_api/web/lists/GetByTitle(\'Teambuildingaanvragen\')/items`;',
			'           http://***/_api/web/lists/GetByTitle(\'Teambuildingaanvragen\')/items  '
		);
	});

	test('issue #7855', () => {
		assertLink(
			'7. At this point, ServiceMain has been called.  There is no functionality presently in ServiceMain, but you can consult the [MSDN documentation](https://msdn.microsoft.com/en-us/library/windows/desktop/ms687414(v=vs.85).aspx) to add functionality as desired!',
			'                                                                                                                                                 https://msdn.microsoft.com/en-us/library/windows/desktop/ms687414(v=vs.85).aspx                                  '
		);
	});

	test('issue #62278: "Ctrl + click to follow link" for IPv6 URLs', () => {
		assertLink(
			'let x = "http://[::1]:5000/connect/token"',
			'         http://[::1]:5000/connect/token  '
		);
	});

	test('issue #70254: bold links dont open in markdown file using editor mode with ctrl + click', () => {
		assertLink(
			'2. Navigate to **https://portal.azure.com**',
			'                 https://portal.azure.com  '
		);
	});

	test('issue #86358: URL wrong recognition pattern', () => {
		assertLink(
			'POST|https://portal.azure.com|2019-12-05|',
			'     https://portal.azure.com            '
		);
	});

	test('issue #67022: Space as end of hyperlink isn\'t always good idea', () => {
		assertLink(
			'aa  https://foo.bar/[this is foo site]  aa',
			'    https://foo.bar/[this is foo site]    '
		);
	});

	test('issue #100353: Link detection stops at ＆(double-byte)', () => {
		assertLink(
			'aa  http://tree-mark.chips.jp/レーズン＆ベリーミックス  aa',
			'    http://tree-mark.chips.jp/レーズン＆ベリーミックス    '
		);
	});

	test('issue #121438: Link detection stops at【...】', () => {
		assertLink(
			'aa  https://zh.wikipedia.org/wiki/【我推的孩子】 aa',
			'    https://zh.wikipedia.org/wiki/【我推的孩子】   '
		);
	});

	test('issue #121438: Link detection stops at《...》', () => {
		assertLink(
			'aa  https://zh.wikipedia.org/wiki/《新青年》编辑部旧址 aa',
			'    https://zh.wikipedia.org/wiki/《新青年》编辑部旧址   '
		);
	});

	test('issue #121438: Link detection stops at “...”', () => {
		assertLink(
			'aa  https://zh.wikipedia.org/wiki/“常凯申”误译事件 aa',
			'    https://zh.wikipedia.org/wiki/“常凯申”误译事件   '
		);
	});

	test('issue #150905: Colon after bare hyperlink is treated as its part', () => {
		assertLink(
			'https://site.web/page.html: blah blah blah',
			'https://site.web/page.html                '
		);
	});

	// Removed because of #156875
	// test('issue #151631: Link parsing stoped where comments include a single quote ', () => {
	// 	assertLink(
	// 		`aa https://regexper.com/#%2F''%2F aa`,
	// 		`   https://regexper.com/#%2F''%2F   `,
	// 	);
	// });

	test('issue #156875: Links include quotes ', () => {
		assertLink(
			`"This file has been converted from https://github.com/jeff-hykin/better-c-syntax/blob/master/autogenerated/c.tmLanguage.json",`,
			`                                   https://github.com/jeff-hykin/better-c-syntax/blob/master/autogenerated/c.tmLanguage.json  `,
		);
	});

	test('issue #225513: Cmd-Click doesn\'t work on JSDoc {@link URL|LinkText} format ', () => {
		assertLink(
			` * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers|Promise.withResolvers}`,
			`          https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers                       `,
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/modes/testLanguageConfigurationService.ts]---
Location: vscode-main/src/vs/editor/test/common/modes/testLanguageConfigurationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter } from '../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { LanguageConfiguration } from '../../../common/languages/languageConfiguration.js';
import { ILanguageConfigurationService, LanguageConfigurationRegistry, LanguageConfigurationServiceChangeEvent, ResolvedLanguageConfiguration } from '../../../common/languages/languageConfigurationRegistry.js';

export class TestLanguageConfigurationService extends Disposable implements ILanguageConfigurationService {
	_serviceBrand: undefined;

	private readonly _registry = this._register(new LanguageConfigurationRegistry());

	private readonly _onDidChange = this._register(new Emitter<LanguageConfigurationServiceChangeEvent>());
	public readonly onDidChange = this._onDidChange.event;

	constructor() {
		super();
		this._register(this._registry.onDidChange((e) => this._onDidChange.fire(new LanguageConfigurationServiceChangeEvent(e.languageId))));
	}

	register(languageId: string, configuration: LanguageConfiguration, priority?: number): IDisposable {
		return this._registry.register(languageId, configuration, priority);
	}

	getLanguageConfiguration(languageId: string): ResolvedLanguageConfiguration {
		return this._registry.getLanguageConfiguration(languageId) ??
			new ResolvedLanguageConfiguration('unknown', {});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/modes/textToHtmlTokenizer.test.ts]---
Location: vscode-main/src/vs/editor/test/common/modes/textToHtmlTokenizer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ColorId, FontStyle, MetadataConsts } from '../../../common/encodedTokenAttributes.js';
import { EncodedTokenizationResult, IState, TokenizationRegistry } from '../../../common/languages.js';
import { ILanguageService } from '../../../common/languages/language.js';
import { _tokenizeToString, tokenizeLineToHTML } from '../../../common/languages/textToHtmlTokenizer.js';
import { LanguageIdCodec } from '../../../common/services/languagesRegistry.js';
import { TestLineToken, TestLineTokens } from '../core/testLineToken.js';
import { createModelServices } from '../testTextModel.js';
import { TestInstantiationService } from '../../../../platform/instantiation/test/common/instantiationServiceMock.js';

suite('Editor Modes - textToHtmlTokenizer', () => {

	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = createModelServices(disposables);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	function toStr(pieces: { className: string; text: string }[]): string {
		const resultArr = pieces.map((t) => `<span class="${t.className}">${t.text}</span>`);
		return resultArr.join('');
	}

	test('TextToHtmlTokenizer 1', () => {
		const mode = disposables.add(instantiationService.createInstance(Mode));
		const support = TokenizationRegistry.get(mode.languageId)!;

		const actual = _tokenizeToString('.abc..def...gh', new LanguageIdCodec(), support);
		const expected = [
			{ className: 'mtk7', text: '.' },
			{ className: 'mtk9', text: 'abc' },
			{ className: 'mtk7', text: '..' },
			{ className: 'mtk9', text: 'def' },
			{ className: 'mtk7', text: '...' },
			{ className: 'mtk9', text: 'gh' },
		];
		const expectedStr = `<div class="monaco-tokenized-source">${toStr(expected)}</div>`;

		assert.strictEqual(actual, expectedStr);
	});

	test('TextToHtmlTokenizer 2', () => {
		const mode = disposables.add(instantiationService.createInstance(Mode));
		const support = TokenizationRegistry.get(mode.languageId)!;

		const actual = _tokenizeToString('.abc..def...gh\n.abc..def...gh', new LanguageIdCodec(), support);
		const expected1 = [
			{ className: 'mtk7', text: '.' },
			{ className: 'mtk9', text: 'abc' },
			{ className: 'mtk7', text: '..' },
			{ className: 'mtk9', text: 'def' },
			{ className: 'mtk7', text: '...' },
			{ className: 'mtk9', text: 'gh' },
		];
		const expected2 = [
			{ className: 'mtk7', text: '.' },
			{ className: 'mtk9', text: 'abc' },
			{ className: 'mtk7', text: '..' },
			{ className: 'mtk9', text: 'def' },
			{ className: 'mtk7', text: '...' },
			{ className: 'mtk9', text: 'gh' },
		];
		const expectedStr1 = toStr(expected1);
		const expectedStr2 = toStr(expected2);
		const expectedStr = `<div class="monaco-tokenized-source">${expectedStr1}<br/>${expectedStr2}</div>`;

		assert.strictEqual(actual, expectedStr);
	});

	test('tokenizeLineToHTML', () => {
		const text = 'Ciao hello world!';
		const lineTokens = new TestLineTokens([
			new TestLineToken(
				4,
				(
					(3 << MetadataConsts.FOREGROUND_OFFSET)
					| ((FontStyle.Bold | FontStyle.Italic) << MetadataConsts.FONT_STYLE_OFFSET)
				) >>> 0
			),
			new TestLineToken(
				5,
				(
					(1 << MetadataConsts.FOREGROUND_OFFSET)
				) >>> 0
			),
			new TestLineToken(
				10,
				(
					(4 << MetadataConsts.FOREGROUND_OFFSET)
				) >>> 0
			),
			new TestLineToken(
				11,
				(
					(1 << MetadataConsts.FOREGROUND_OFFSET)
				) >>> 0
			),
			new TestLineToken(
				17,
				(
					(5 << MetadataConsts.FOREGROUND_OFFSET)
					| ((FontStyle.Underline) << MetadataConsts.FONT_STYLE_OFFSET)
				) >>> 0
			)
		]);
		const colorMap = [null!, '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'];

		assert.strictEqual(
			tokenizeLineToHTML(text, lineTokens, colorMap, 0, 17, 4, true),
			[
				'<div>',
				'<span style="color: #ff0000;font-style: italic;font-weight: bold;">Ciao</span>',
				'<span style="color: #000000;"> </span>',
				'<span style="color: #00ff00;">hello</span>',
				'<span style="color: #000000;"> </span>',
				'<span style="color: #0000ff;text-decoration: underline;">world!</span>',
				'</div>'
			].join('')
		);

		assert.strictEqual(
			tokenizeLineToHTML(text, lineTokens, colorMap, 0, 12, 4, true),
			[
				'<div>',
				'<span style="color: #ff0000;font-style: italic;font-weight: bold;">Ciao</span>',
				'<span style="color: #000000;"> </span>',
				'<span style="color: #00ff00;">hello</span>',
				'<span style="color: #000000;"> </span>',
				'<span style="color: #0000ff;text-decoration: underline;">w</span>',
				'</div>'
			].join('')
		);

		assert.strictEqual(
			tokenizeLineToHTML(text, lineTokens, colorMap, 0, 11, 4, true),
			[
				'<div>',
				'<span style="color: #ff0000;font-style: italic;font-weight: bold;">Ciao</span>',
				'<span style="color: #000000;"> </span>',
				'<span style="color: #00ff00;">hello</span>',
				'<span style="color: #000000;"> </span>',
				'</div>'
			].join('')
		);

		assert.strictEqual(
			tokenizeLineToHTML(text, lineTokens, colorMap, 1, 11, 4, true),
			[
				'<div>',
				'<span style="color: #ff0000;font-style: italic;font-weight: bold;">iao</span>',
				'<span style="color: #000000;"> </span>',
				'<span style="color: #00ff00;">hello</span>',
				'<span style="color: #000000;"> </span>',
				'</div>'
			].join('')
		);

		assert.strictEqual(
			tokenizeLineToHTML(text, lineTokens, colorMap, 4, 11, 4, true),
			[
				'<div>',
				'<span style="color: #000000;">&#160;</span>',
				'<span style="color: #00ff00;">hello</span>',
				'<span style="color: #000000;"> </span>',
				'</div>'
			].join('')
		);

		assert.strictEqual(
			tokenizeLineToHTML(text, lineTokens, colorMap, 5, 11, 4, true),
			[
				'<div>',
				'<span style="color: #00ff00;">hello</span>',
				'<span style="color: #000000;"> </span>',
				'</div>'
			].join('')
		);

		assert.strictEqual(
			tokenizeLineToHTML(text, lineTokens, colorMap, 5, 10, 4, true),
			[
				'<div>',
				'<span style="color: #00ff00;">hello</span>',
				'</div>'
			].join('')
		);

		assert.strictEqual(
			tokenizeLineToHTML(text, lineTokens, colorMap, 6, 9, 4, true),
			[
				'<div>',
				'<span style="color: #00ff00;">ell</span>',
				'</div>'
			].join('')
		);
	});
	test('tokenizeLineToHTML handle spaces #35954', () => {
		const text = '  Ciao   hello world!';
		const lineTokens = new TestLineTokens([
			new TestLineToken(
				2,
				(
					(1 << MetadataConsts.FOREGROUND_OFFSET)
				) >>> 0
			),
			new TestLineToken(
				6,
				(
					(3 << MetadataConsts.FOREGROUND_OFFSET)
					| ((FontStyle.Bold | FontStyle.Italic) << MetadataConsts.FONT_STYLE_OFFSET)
				) >>> 0
			),
			new TestLineToken(
				9,
				(
					(1 << MetadataConsts.FOREGROUND_OFFSET)
				) >>> 0
			),
			new TestLineToken(
				14,
				(
					(4 << MetadataConsts.FOREGROUND_OFFSET)
				) >>> 0
			),
			new TestLineToken(
				15,
				(
					(1 << MetadataConsts.FOREGROUND_OFFSET)
				) >>> 0
			),
			new TestLineToken(
				21,
				(
					(5 << MetadataConsts.FOREGROUND_OFFSET)
					| ((FontStyle.Underline) << MetadataConsts.FONT_STYLE_OFFSET)
				) >>> 0
			)
		]);
		const colorMap = [null!, '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'];

		assert.strictEqual(
			tokenizeLineToHTML(text, lineTokens, colorMap, 0, 21, 4, true),
			[
				'<div>',
				'<span style="color: #000000;">&#160; </span>',
				'<span style="color: #ff0000;font-style: italic;font-weight: bold;">Ciao</span>',
				'<span style="color: #000000;"> &#160; </span>',
				'<span style="color: #00ff00;">hello</span>',
				'<span style="color: #000000;"> </span>',
				'<span style="color: #0000ff;text-decoration: underline;">world!</span>',
				'</div>'
			].join('')
		);

		assert.strictEqual(
			tokenizeLineToHTML(text, lineTokens, colorMap, 0, 17, 4, true),
			[
				'<div>',
				'<span style="color: #000000;">&#160; </span>',
				'<span style="color: #ff0000;font-style: italic;font-weight: bold;">Ciao</span>',
				'<span style="color: #000000;"> &#160; </span>',
				'<span style="color: #00ff00;">hello</span>',
				'<span style="color: #000000;"> </span>',
				'<span style="color: #0000ff;text-decoration: underline;">wo</span>',
				'</div>'
			].join('')
		);

		assert.strictEqual(
			tokenizeLineToHTML(text, lineTokens, colorMap, 0, 3, 4, true),
			[
				'<div>',
				'<span style="color: #000000;">&#160; </span>',
				'<span style="color: #ff0000;font-style: italic;font-weight: bold;">C</span>',
				'</div>'
			].join('')
		);
	});

	test('tokenizeLineToHTML with tabs and non-zero startOffset #263387', () => {
		// This test demonstrates the issue where tab padding is calculated incorrectly
		// when startOffset is non-zero and there are tabs AFTER the start position.
		// The bug: tabsCharDelta doesn't account for characters before startOffset.

		const colorMap = [null!, '#000000', '#ffffff', '#ff0000', '#00ff00'];

		// Critical test case: "\ta\tb" starting at position 2 (skipping first tab and 'a')
		// Layout: First tab (pos 0) goes to column 4, 'a' (pos 1) at column 4,
		//         second tab (pos 2) should go from column 5 to column 8 (3 spaces)
		// With the bug: charIndex starts at 2, tabsCharDelta=0 (first tab was never seen)
		//   When processing second tab: insertSpacesCount = 4 - (2 + 0) % 4 = 2 spaces (WRONG!)
		//   The old code thinks it's at column 2, but it's actually at column 5
		const text = '\ta\tb';
		const lineTokens = new TestLineTokens([
			new TestLineToken(
				1,
				(
					(1 << MetadataConsts.FOREGROUND_OFFSET)
				) >>> 0
			),
			new TestLineToken(
				2,
				(
					(3 << MetadataConsts.FOREGROUND_OFFSET)
				) >>> 0
			),
			new TestLineToken(
				3,
				(
					(1 << MetadataConsts.FOREGROUND_OFFSET)
				) >>> 0
			),
			new TestLineToken(
				4,
				(
					(4 << MetadataConsts.FOREGROUND_OFFSET)
				) >>> 0
			)
		]);

		// First, verify the full line works correctly
		assert.strictEqual(
			tokenizeLineToHTML(text, lineTokens, colorMap, 0, 4, 4, true),
			[
				'<div>',
				'<span style="color: #000000;">&#160; &#160; </span>', // First tab: 4 spaces
				'<span style="color: #ff0000;">a</span>',               // 'a' at column 4
				'<span style="color: #000000;"> &#160; </span>',       // Second tab: 3 spaces (column 5 to 8)
				'<span style="color: #00ff00;">b</span>',
				'</div>'
			].join('')
		);

		// THE BUG: Starting at position 2 (after first tab and 'a')
		// Expected (with fix): 3 spaces for the second tab (column 5 to 8)
		// Buggy behavior (old code): 2 spaces (thinks it's at column 2, gives &#160; )
		// The fix correctly accounts for the skipped tab and 'a', outputting &#160; &#160;
		assert.strictEqual(
			tokenizeLineToHTML(text, lineTokens, colorMap, 2, 4, 4, true),
			[
				'<div>',
				'<span style="color: #000000;">&#160; &#160;</span>', // With fix: 3 spaces; with bug: only 2 spaces
				'<span style="color: #00ff00;">b</span>',
				'</div>'
			].join('')
		);
	});

});

class Mode extends Disposable {

	public readonly languageId = 'textToHtmlTokenizerMode';

	constructor(
		@ILanguageService languageService: ILanguageService
	) {
		super();
		this._register(languageService.registerLanguage({ id: this.languageId }));
		this._register(TokenizationRegistry.register(this.languageId, {
			getInitialState: (): IState => null!,
			tokenize: undefined!,
			tokenizeEncoded: (line: string, hasEOL: boolean, state: IState): EncodedTokenizationResult => {
				const tokensArr: number[] = [];
				let prevColor = -1 as ColorId;
				for (let i = 0; i < line.length; i++) {
					const colorId = (line.charAt(i) === '.' ? 7 : 9) as ColorId;
					if (prevColor !== colorId) {
						tokensArr.push(i);
						tokensArr.push((
							colorId << MetadataConsts.FOREGROUND_OFFSET
						) >>> 0);
					}
					prevColor = colorId;
				}

				const tokens = new Uint32Array(tokensArr.length);
				for (let i = 0; i < tokens.length; i++) {
					tokens[i] = tokensArr[i];
				}
				return new EncodedTokenizationResult(tokens, [], null!);
			}
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/modes/supports/autoClosingPairsRules.ts]---
Location: vscode-main/src/vs/editor/test/common/modes/supports/autoClosingPairsRules.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAutoClosingPair, IAutoClosingPairConditional } from '../../../../common/languages/languageConfiguration.js';

export const javascriptAutoClosingPairsRules: IAutoClosingPairConditional[] = [
	{ open: '{', close: '}' },
	{ open: '[', close: ']' },
	{ open: '(', close: ')' },
	{ open: '\'', close: '\'', notIn: ['string', 'comment'] },
	{ open: '"', close: '"', notIn: ['string'] },
	{ open: '`', close: '`', notIn: ['string', 'comment'] },
	{ open: '/**', close: ' */', notIn: ['string'] }
];

export const latexAutoClosingPairsRules: IAutoClosingPair[] = [
	{ open: '\\left(', close: '\\right)' },
	{ open: '\\left[', close: '\\right]' },
	{ open: '\\left\\{', close: '\\right\\}' },
	{ open: '\\bigl(', close: '\\bigr)' },
	{ open: '\\bigl[', close: '\\bigr]' },
	{ open: '\\bigl\\{', close: '\\bigr\\}' },
	{ open: '\\Bigl(', close: '\\Bigr)' },
	{ open: '\\Bigl[', close: '\\Bigr]' },
	{ open: '\\Bigl\\{', close: '\\Bigr\\}' },
	{ open: '\\biggl(', close: '\\biggr)' },
	{ open: '\\biggl[', close: '\\biggr]' },
	{ open: '\\biggl\\{', close: '\\biggr\\}' },
	{ open: '\\Biggl(', close: '\\Biggr)' },
	{ open: '\\Biggl[', close: '\\Biggr]' },
	{ open: '\\Biggl\\{', close: '\\Biggr\\}' },
	{ open: '\\(', close: '\\)' },
	{ open: '\\[', close: '\\]' },
	{ open: '\\{', close: '\\}' },
	{ open: '{', close: '}' },
	{ open: '[', close: ']' },
	{ open: '(', close: ')' },
	{ open: '`', close: '\'' },
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/modes/supports/bracketRules.ts]---
Location: vscode-main/src/vs/editor/test/common/modes/supports/bracketRules.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharacterPair } from '../../../../common/languages/languageConfiguration.js';

const standardBracketRules: CharacterPair[] = [
	['{', '}'],
	['[', ']'],
	['(', ')']
];

export const rubyBracketRules = standardBracketRules;

export const cppBracketRules = standardBracketRules;

export const goBracketRules = standardBracketRules;

export const phpBracketRules = standardBracketRules;

export const vbBracketRules = standardBracketRules;

export const luaBracketRules = standardBracketRules;

export const htmlBracketRules: CharacterPair[] = [
	['<!--', '-->'],
	['{', '}'],
	['(', ')']
];

export const typescriptBracketRules: CharacterPair[] = [
	['${', '}'],
	['{', '}'],
	['[', ']'],
	['(', ')']
];

export const latexBracketRules: CharacterPair[] = [
	['{', '}'],
	['[', ']'],
	['(', ')'],
	['[', ')'],
	['(', ']'],
	['\\left(', '\\right)'],
	['\\left(', '\\right.'],
	['\\left.', '\\right)'],
	['\\left[', '\\right]'],
	['\\left[', '\\right.'],
	['\\left.', '\\right]'],
	['\\left\\{', '\\right\\}'],
	['\\left\\{', '\\right.'],
	['\\left.', '\\right\\}'],
	['\\left<', '\\right>'],
	['\\bigl(', '\\bigr)'],
	['\\bigl[', '\\bigr]'],
	['\\bigl\\{', '\\bigr\\}'],
	['\\Bigl(', '\\Bigr)'],
	['\\Bigl[', '\\Bigr]'],
	['\\Bigl\\{', '\\Bigr\\}'],
	['\\biggl(', '\\biggr)'],
	['\\biggl[', '\\biggr]'],
	['\\biggl\\{', '\\biggr\\}'],
	['\\Biggl(', '\\Biggr)'],
	['\\Biggl[', '\\Biggr]'],
	['\\Biggl\\{', '\\Biggr\\}'],
	['\\langle', '\\rangle'],
	['\\lvert', '\\rvert'],
	['\\lVert', '\\rVert'],
	['\\left|', '\\right|'],
	['\\left\\vert', '\\right\\vert'],
	['\\left\\|', '\\right\\|'],
	['\\left\\Vert', '\\right\\Vert'],
	['\\left\\langle', '\\right\\rangle'],
	['\\left\\lvert', '\\right\\rvert'],
	['\\left\\lVert', '\\right\\rVert'],
	['\\bigl\\langle', '\\bigr\\rangle'],
	['\\bigl|', '\\bigr|'],
	['\\bigl\\vert', '\\bigr\\vert'],
	['\\bigl\\lvert', '\\bigr\\rvert'],
	['\\bigl\\|', '\\bigr\\|'],
	['\\bigl\\lVert', '\\bigr\\rVert'],
	['\\bigl\\Vert', '\\bigr\\Vert'],
	['\\Bigl\\langle', '\\Bigr\\rangle'],
	['\\Bigl|', '\\Bigr|'],
	['\\Bigl\\lvert', '\\Bigr\\rvert'],
	['\\Bigl\\vert', '\\Bigr\\vert'],
	['\\Bigl\\|', '\\Bigr\\|'],
	['\\Bigl\\lVert', '\\Bigr\\rVert'],
	['\\Bigl\\Vert', '\\Bigr\\Vert'],
	['\\biggl\\langle', '\\biggr\\rangle'],
	['\\biggl|', '\\biggr|'],
	['\\biggl\\lvert', '\\biggr\\rvert'],
	['\\biggl\\vert', '\\biggr\\vert'],
	['\\biggl\\|', '\\biggr\\|'],
	['\\biggl\\lVert', '\\biggr\\rVert'],
	['\\biggl\\Vert', '\\biggr\\Vert'],
	['\\Biggl\\langle', '\\Biggr\\rangle'],
	['\\Biggl|', '\\Biggr|'],
	['\\Biggl\\lvert', '\\Biggr\\rvert'],
	['\\Biggl\\vert', '\\Biggr\\vert'],
	['\\Biggl\\|', '\\Biggr\\|'],
	['\\Biggl\\lVert', '\\Biggr\\rVert'],
	['\\Biggl\\Vert', '\\Biggr\\Vert']
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/modes/supports/characterPair.test.ts]---
Location: vscode-main/src/vs/editor/test/common/modes/supports/characterPair.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { StandardTokenType } from '../../../../common/encodedTokenAttributes.js';
import { StandardAutoClosingPairConditional } from '../../../../common/languages/languageConfiguration.js';
import { CharacterPairSupport } from '../../../../common/languages/supports/characterPair.js';
import { TokenText, createFakeScopedLineTokens } from '../../modesTestUtils.js';

suite('CharacterPairSupport', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('only autoClosingPairs', () => {
		const characaterPairSupport = new CharacterPairSupport({ autoClosingPairs: [{ open: 'a', close: 'b' }] });
		assert.deepStrictEqual(characaterPairSupport.getAutoClosingPairs(), [new StandardAutoClosingPairConditional({ open: 'a', close: 'b' })]);
		assert.deepStrictEqual(characaterPairSupport.getSurroundingPairs(), [new StandardAutoClosingPairConditional({ open: 'a', close: 'b' })]);
	});

	test('only empty autoClosingPairs', () => {
		const characaterPairSupport = new CharacterPairSupport({ autoClosingPairs: [] });
		assert.deepStrictEqual(characaterPairSupport.getAutoClosingPairs(), []);
		assert.deepStrictEqual(characaterPairSupport.getSurroundingPairs(), []);
	});

	test('only brackets', () => {
		const characaterPairSupport = new CharacterPairSupport({ brackets: [['a', 'b']] });
		assert.deepStrictEqual(characaterPairSupport.getAutoClosingPairs(), [new StandardAutoClosingPairConditional({ open: 'a', close: 'b' })]);
		assert.deepStrictEqual(characaterPairSupport.getSurroundingPairs(), [new StandardAutoClosingPairConditional({ open: 'a', close: 'b' })]);
	});

	test('only empty brackets', () => {
		const characaterPairSupport = new CharacterPairSupport({ brackets: [] });
		assert.deepStrictEqual(characaterPairSupport.getAutoClosingPairs(), []);
		assert.deepStrictEqual(characaterPairSupport.getSurroundingPairs(), []);
	});

	test('only surroundingPairs', () => {
		const characaterPairSupport = new CharacterPairSupport({ surroundingPairs: [{ open: 'a', close: 'b' }] });
		assert.deepStrictEqual(characaterPairSupport.getAutoClosingPairs(), []);
		assert.deepStrictEqual(characaterPairSupport.getSurroundingPairs(), [{ open: 'a', close: 'b' }]);
	});

	test('only empty surroundingPairs', () => {
		const characaterPairSupport = new CharacterPairSupport({ surroundingPairs: [] });
		assert.deepStrictEqual(characaterPairSupport.getAutoClosingPairs(), []);
		assert.deepStrictEqual(characaterPairSupport.getSurroundingPairs(), []);
	});

	test('brackets is ignored when having autoClosingPairs', () => {
		const characaterPairSupport = new CharacterPairSupport({ autoClosingPairs: [], brackets: [['a', 'b']] });
		assert.deepStrictEqual(characaterPairSupport.getAutoClosingPairs(), []);
		assert.deepStrictEqual(characaterPairSupport.getSurroundingPairs(), []);
	});

	function testShouldAutoClose(characterPairSupport: CharacterPairSupport, line: TokenText[], column: number): boolean {
		const autoClosingPair = characterPairSupport.getAutoClosingPairs()[0];
		return autoClosingPair.shouldAutoClose(createFakeScopedLineTokens(line), column);
	}

	test('shouldAutoClosePair in empty line', () => {
		const sup = new CharacterPairSupport({ autoClosingPairs: [{ open: '{', close: '}', notIn: ['string', 'comment'] }] });
		const tokenText: TokenText[] = [];
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 1), true);
	});

	test('shouldAutoClosePair in not interesting line 1', () => {
		const sup = new CharacterPairSupport({ autoClosingPairs: [{ open: '{', close: '}', notIn: ['string', 'comment'] }] });
		const tokenText: TokenText[] = [
			{ text: 'do', type: StandardTokenType.Other }
		];
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 3), true);
	});

	test('shouldAutoClosePair in not interesting line 2', () => {
		const sup = new CharacterPairSupport({ autoClosingPairs: [{ open: '{', close: '}' }] });
		const tokenText: TokenText[] = [
			{ text: 'do', type: StandardTokenType.String }
		];
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 3), true);
	});

	test('shouldAutoClosePair in interesting line 1', () => {
		const sup = new CharacterPairSupport({ autoClosingPairs: [{ open: '{', close: '}', notIn: ['string', 'comment'] }] });
		const tokenText: TokenText[] = [
			{ text: '"a"', type: StandardTokenType.String }
		];
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 1), false);
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 2), false);
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 3), false);
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 4), false);
	});

	test('shouldAutoClosePair in interesting line 2', () => {
		const sup = new CharacterPairSupport({ autoClosingPairs: [{ open: '{', close: '}', notIn: ['string', 'comment'] }] });
		const tokenText: TokenText[] = [
			{ text: 'x=', type: StandardTokenType.Other },
			{ text: '"a"', type: StandardTokenType.String },
			{ text: ';', type: StandardTokenType.Other }
		];
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 1), true);
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 2), true);
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 3), true);
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 4), false);
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 5), false);
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 6), false);
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 7), true);
	});

	test('shouldAutoClosePair in interesting line 3', () => {
		const sup = new CharacterPairSupport({ autoClosingPairs: [{ open: '{', close: '}', notIn: ['string', 'comment'] }] });
		const tokenText: TokenText[] = [
			{ text: ' ', type: StandardTokenType.Other },
			{ text: '//a', type: StandardTokenType.Comment }
		];
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 1), true);
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 2), true);
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 3), false);
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 4), false);
		assert.strictEqual(testShouldAutoClose(sup, tokenText, 5), false);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/modes/supports/electricCharacter.test.ts]---
Location: vscode-main/src/vs/editor/test/common/modes/supports/electricCharacter.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { StandardTokenType } from '../../../../common/encodedTokenAttributes.js';
import { BracketElectricCharacterSupport, IElectricAction } from '../../../../common/languages/supports/electricCharacter.js';
import { RichEditBrackets } from '../../../../common/languages/supports/richEditBrackets.js';
import { TokenText, createFakeScopedLineTokens } from '../../modesTestUtils.js';

const fakeLanguageId = 'test';

suite('Editor Modes - Auto Indentation', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function _testOnElectricCharacter(electricCharacterSupport: BracketElectricCharacterSupport, line: TokenText[], character: string, offset: number): IElectricAction | null {
		return electricCharacterSupport.onElectricCharacter(character, createFakeScopedLineTokens(line), offset);
	}

	function testDoesNothing(electricCharacterSupport: BracketElectricCharacterSupport, line: TokenText[], character: string, offset: number): void {
		const actual = _testOnElectricCharacter(electricCharacterSupport, line, character, offset);
		assert.deepStrictEqual(actual, null);
	}

	function testMatchBracket(electricCharacterSupport: BracketElectricCharacterSupport, line: TokenText[], character: string, offset: number, matchOpenBracket: string): void {
		const actual = _testOnElectricCharacter(electricCharacterSupport, line, character, offset);
		assert.deepStrictEqual(actual, { matchOpenBracket: matchOpenBracket });
	}

	test('getElectricCharacters uses all sources and dedups', () => {
		const sup = new BracketElectricCharacterSupport(
			new RichEditBrackets(fakeLanguageId, [
				['{', '}'],
				['(', ')']
			])
		);

		assert.deepStrictEqual(sup.getElectricCharacters(), ['}', ')']);
	});

	test('matchOpenBracket', () => {
		const sup = new BracketElectricCharacterSupport(
			new RichEditBrackets(fakeLanguageId, [
				['{', '}'],
				['(', ')']
			])
		);

		testDoesNothing(sup, [{ text: '\t{', type: StandardTokenType.Other }], '\t', 1);
		testDoesNothing(sup, [{ text: '\t{', type: StandardTokenType.Other }], '\t', 2);
		testDoesNothing(sup, [{ text: '\t\t', type: StandardTokenType.Other }], '{', 3);

		testDoesNothing(sup, [{ text: '\t}', type: StandardTokenType.Other }], '\t', 1);
		testDoesNothing(sup, [{ text: '\t}', type: StandardTokenType.Other }], '\t', 2);
		testMatchBracket(sup, [{ text: '\t\t', type: StandardTokenType.Other }], '}', 3, '}');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/modes/supports/indentationRules.ts]---
Location: vscode-main/src/vs/editor/test/common/modes/supports/indentationRules.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const javascriptIndentationRules = {
	decreaseIndentPattern: /^((?!.*?\/\*).*\*\/)?\s*[\}\]\)].*$/,
	increaseIndentPattern: /^((?!\/\/).)*(\{([^}"'`]*|(\t|[ ])*\/\/.*)|\([^)"'`]*|\[[^\]"'`]*)$/,
	// e.g.  * ...| or */| or *-----*/|
	unIndentedLinePattern: /^(\t|[ ])*[ ]\*[^/]*\*\/\s*$|^(\t|[ ])*[ ]\*\/\s*$|^(\t|[ ])*[ ]\*([ ]([^\*]|\*(?!\/))*)?$/,
	indentNextLinePattern: /^((.*=>\s*)|((.*[^\w]+|\s*)(if|while|for)\s*\(.*\)\s*))$/,
};

export const rubyIndentationRules = {
	decreaseIndentPattern: /^\s*([}\]]([,)]?\s*(#|$)|\.[a-zA-Z_]\w*\b)|(end|rescue|ensure|else|elsif)\b|(in|when)\s)/,
	increaseIndentPattern: /^\s*((begin|class|(private|protected)\s+def|def|else|elsif|ensure|for|if|module|rescue|unless|until|when|in|while|case)|([^#]*\sdo\b)|([^#]*=\s*(case|if|unless)))\b([^#\{;]|(\"|'|\/).*\4)*(#.*)?$/,
};

export const phpIndentationRules = {
	increaseIndentPattern: /({(?!.*}).*|\(|\[|((else(\s)?)?if|else|for(each)?|while|switch|case).*:)\s*((\/[/*].*|)?$|\?>)/,
	decreaseIndentPattern: /^(.*\*\/)?\s*((\})|(\)+[;,])|(\]\)*[;,])|\b(else:)|\b((end(if|for(each)?|while|switch));))/,
};

export const goIndentationRules = {
	decreaseIndentPattern: /^\s*(\bcase\b.*:|\bdefault\b:|}[)}]*[),]?|\)[,]?)$/,
	increaseIndentPattern: /^.*(\bcase\b.*:|\bdefault\b:|(\b(func|if|else|switch|select|for|struct)\b.*)?{[^}"'`]*|\([^)"'`]*)$/,
};

export const htmlIndentationRules = {
	decreaseIndentPattern: /^\s*(<\/(?!html)[-_\.A-Za-z0-9]+\b[^>]*>|-->|\})/,
	increaseIndentPattern: /<(?!\?|(?:area|base|br|col|frame|hr|html|img|input|keygen|link|menuitem|meta|param|source|track|wbr)\b|[^>]*\/>)([-_\.A-Za-z0-9]+)(?=\s|>)\b[^>]*>(?!.*<\/\1>)|<!--(?!.*-->)|\{[^}"']*$/,
};

export const latexIndentationRules = {
	decreaseIndentPattern: /^\s*\\end{(?!document)/,
	increaseIndentPattern: /\\begin{(?!document)([^}]*)}(?!.*\\end{\1})/,
};

export const luaIndentationRules = {
	decreaseIndentPattern: /^\s*((\b(elseif|else|end|until)\b)|(\})|(\)))/,
	increaseIndentPattern: /^((?!(\-\-)).)*((\b(else|function|then|do|repeat)\b((?!\b(end|until)\b).)*)|(\{\s*))$/,
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/modes/supports/onEnter.test.ts]---
Location: vscode-main/src/vs/editor/test/common/modes/supports/onEnter.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { CharacterPair, IndentAction } from '../../../../common/languages/languageConfiguration.js';
import { OnEnterSupport } from '../../../../common/languages/supports/onEnter.js';
import { javascriptOnEnterRules } from './onEnterRules.js';
import { EditorAutoIndentStrategy } from '../../../../common/config/editorOptions.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('OnEnter', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('uses brackets', () => {
		const brackets: CharacterPair[] = [
			['(', ')'],
			['begin', 'end']
		];
		const support = new OnEnterSupport({
			brackets: brackets
		});
		const testIndentAction = (beforeText: string, afterText: string, expected: IndentAction) => {
			const actual = support.onEnter(EditorAutoIndentStrategy.Advanced, '', beforeText, afterText);
			if (expected === IndentAction.None) {
				assert.strictEqual(actual, null);
			} else {
				assert.strictEqual(actual!.indentAction, expected);
			}
		};

		testIndentAction('a', '', IndentAction.None);
		testIndentAction('', 'b', IndentAction.None);
		testIndentAction('(', 'b', IndentAction.Indent);
		testIndentAction('a', ')', IndentAction.None);
		testIndentAction('begin', 'ending', IndentAction.Indent);
		testIndentAction('abegin', 'end', IndentAction.None);
		testIndentAction('begin', ')', IndentAction.Indent);
		testIndentAction('begin', 'end', IndentAction.IndentOutdent);
		testIndentAction('begin ', ' end', IndentAction.IndentOutdent);
		testIndentAction(' begin', 'end//as', IndentAction.IndentOutdent);
		testIndentAction('(', ')', IndentAction.IndentOutdent);
		testIndentAction('( ', ')', IndentAction.IndentOutdent);
		testIndentAction('a(', ')b', IndentAction.IndentOutdent);

		testIndentAction('(', '', IndentAction.Indent);
		testIndentAction('(', 'foo', IndentAction.Indent);
		testIndentAction('begin', 'foo', IndentAction.Indent);
		testIndentAction('begin', '', IndentAction.Indent);
	});


	test('Issue #121125: onEnterRules with global modifier', () => {
		const support = new OnEnterSupport({
			onEnterRules: [
				{
					action: {
						appendText: '/// ',
						indentAction: IndentAction.Outdent
					},
					beforeText: /^\s*\/{3}.*$/gm
				}
			]
		});

		const testIndentAction = (previousLineText: string, beforeText: string, afterText: string, expectedIndentAction: IndentAction | null, expectedAppendText: string | null, removeText: number = 0) => {
			const actual = support.onEnter(EditorAutoIndentStrategy.Advanced, previousLineText, beforeText, afterText);
			if (expectedIndentAction === null) {
				assert.strictEqual(actual, null, 'isNull:' + beforeText);
			} else {
				assert.strictEqual(actual !== null, true, 'isNotNull:' + beforeText);
				assert.strictEqual(actual!.indentAction, expectedIndentAction, 'indentAction:' + beforeText);
				if (expectedAppendText !== null) {
					assert.strictEqual(actual!.appendText, expectedAppendText, 'appendText:' + beforeText);
				}
				if (removeText !== 0) {
					assert.strictEqual(actual!.removeText, removeText, 'removeText:' + beforeText);
				}
			}
		};

		testIndentAction('/// line', '/// line', '', IndentAction.Outdent, '/// ');
		testIndentAction('/// line', '/// line', '', IndentAction.Outdent, '/// ');
	});

	test('uses regExpRules', () => {
		const support = new OnEnterSupport({
			onEnterRules: javascriptOnEnterRules
		});
		const testIndentAction = (previousLineText: string, beforeText: string, afterText: string, expectedIndentAction: IndentAction | null, expectedAppendText: string | null, removeText: number = 0) => {
			const actual = support.onEnter(EditorAutoIndentStrategy.Advanced, previousLineText, beforeText, afterText);
			if (expectedIndentAction === null) {
				assert.strictEqual(actual, null, 'isNull:' + beforeText);
			} else {
				assert.strictEqual(actual !== null, true, 'isNotNull:' + beforeText);
				assert.strictEqual(actual!.indentAction, expectedIndentAction, 'indentAction:' + beforeText);
				if (expectedAppendText !== null) {
					assert.strictEqual(actual!.appendText, expectedAppendText, 'appendText:' + beforeText);
				}
				if (removeText !== 0) {
					assert.strictEqual(actual!.removeText, removeText, 'removeText:' + beforeText);
				}
			}
		};

		testIndentAction('', '\t/**', ' */', IndentAction.IndentOutdent, ' * ');
		testIndentAction('', '\t/**', '', IndentAction.None, ' * ');
		testIndentAction('', '\t/** * / * / * /', '', IndentAction.None, ' * ');
		testIndentAction('', '\t/** /*', '', IndentAction.None, ' * ');
		testIndentAction('', '/**', '', IndentAction.None, ' * ');
		testIndentAction('', '\t/**/', '', null, null);
		testIndentAction('', '\t/***/', '', null, null);
		testIndentAction('', '\t/*******/', '', null, null);
		testIndentAction('', '\t/** * * * * */', '', null, null);
		testIndentAction('', '\t/** */', '', null, null);
		testIndentAction('', '\t/** asdfg */', '', null, null);
		testIndentAction('', '\t/* asdfg */', '', null, null);
		testIndentAction('', '\t/* asdfg */', '', null, null);
		testIndentAction('', '\t/** asdfg */', '', null, null);
		testIndentAction('', '*/', '', null, null);
		testIndentAction('', '\t/*', '', null, null);
		testIndentAction('', '\t*', '', null, null);

		testIndentAction('\t/**', '\t *', '', IndentAction.None, '* ');
		testIndentAction('\t * something', '\t *', '', IndentAction.None, '* ');
		testIndentAction('\t *', '\t *', '', IndentAction.None, '* ');

		testIndentAction('', '\t */', '', IndentAction.None, null, 1);
		testIndentAction('', '\t * */', '', IndentAction.None, null, 1);
		testIndentAction('', '\t * * / * / * / */', '', null, null);

		testIndentAction('\t/**', '\t * ', '', IndentAction.None, '* ');
		testIndentAction('\t * something', '\t * ', '', IndentAction.None, '* ');
		testIndentAction('\t *', '\t * ', '', IndentAction.None, '* ');

		testIndentAction('/**', ' * ', '', IndentAction.None, '* ');
		testIndentAction(' * something', ' * ', '', IndentAction.None, '* ');
		testIndentAction(' *', ' * asdfsfagadfg', '', IndentAction.None, '* ');

		testIndentAction('/**', ' * asdfsfagadfg * * * ', '', IndentAction.None, '* ');
		testIndentAction(' * something', ' * asdfsfagadfg * * * ', '', IndentAction.None, '* ');
		testIndentAction(' *', ' * asdfsfagadfg * * * ', '', IndentAction.None, '* ');

		testIndentAction('/**', ' * /*', '', IndentAction.None, '* ');
		testIndentAction(' * something', ' * /*', '', IndentAction.None, '* ');
		testIndentAction(' *', ' * /*', '', IndentAction.None, '* ');

		testIndentAction('/**', ' * asdfsfagadfg * / * / * /', '', IndentAction.None, '* ');
		testIndentAction(' * something', ' * asdfsfagadfg * / * / * /', '', IndentAction.None, '* ');
		testIndentAction(' *', ' * asdfsfagadfg * / * / * /', '', IndentAction.None, '* ');

		testIndentAction('/**', ' * asdfsfagadfg * / * / * /*', '', IndentAction.None, '* ');
		testIndentAction(' * something', ' * asdfsfagadfg * / * / * /*', '', IndentAction.None, '* ');
		testIndentAction(' *', ' * asdfsfagadfg * / * / * /*', '', IndentAction.None, '* ');

		testIndentAction('', ' */', '', IndentAction.None, null, 1);
		testIndentAction(' */', ' * test() {', '', IndentAction.Indent, null, 0);
		testIndentAction('', '\t */', '', IndentAction.None, null, 1);
		testIndentAction('', '\t\t */', '', IndentAction.None, null, 1);
		testIndentAction('', '   */', '', IndentAction.None, null, 1);
		testIndentAction('', '     */', '', IndentAction.None, null, 1);
		testIndentAction('', '\t     */', '', IndentAction.None, null, 1);
		testIndentAction('', ' *--------------------------------------------------------------------------------------------*/', '', IndentAction.None, null, 1);

		// issue #43469
		testIndentAction('class A {', '    * test() {', '', IndentAction.Indent, null, 0);
		testIndentAction('', '    * test() {', '', IndentAction.Indent, null, 0);
		testIndentAction('    ', '    * test() {', '', IndentAction.Indent, null, 0);
		testIndentAction('class A {', '  * test() {', '', IndentAction.Indent, null, 0);
		testIndentAction('', '  * test() {', '', IndentAction.Indent, null, 0);
		testIndentAction('  ', '  * test() {', '', IndentAction.Indent, null, 0);
	});

	test('issue #141816', () => {
		const support = new OnEnterSupport({
			onEnterRules: javascriptOnEnterRules
		});
		const testIndentAction = (beforeText: string, afterText: string, expected: IndentAction) => {
			const actual = support.onEnter(EditorAutoIndentStrategy.Advanced, '', beforeText, afterText);
			if (expected === IndentAction.None) {
				assert.strictEqual(actual, null);
			} else {
				assert.strictEqual(actual!.indentAction, expected);
			}
		};

		testIndentAction('const r = /{/;', '', IndentAction.None);
		testIndentAction('const r = /{[0-9]/;', '', IndentAction.None);
		testIndentAction('const r = /[a-zA-Z]{/;', '', IndentAction.None);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/modes/supports/onEnterRules.ts]---
Location: vscode-main/src/vs/editor/test/common/modes/supports/onEnterRules.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IndentAction } from '../../../../common/languages/languageConfiguration.js';

export const javascriptOnEnterRules = [
	{
		// e.g. /** | */
		beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
		afterText: /^\s*\*\/$/,
		action: { indentAction: IndentAction.IndentOutdent, appendText: ' * ' }
	}, {
		// e.g. /** ...|
		beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
		action: { indentAction: IndentAction.None, appendText: ' * ' }
	}, {
		// e.g.  * ...|
		beforeText: /^(\t|[ ])*[ ]\*([ ]([^\*]|\*(?!\/))*)?$/,
		previousLineText: /(?=^(\s*(\/\*\*|\*)).*)(?=(?!(\s*\*\/)))/,
		action: { indentAction: IndentAction.None, appendText: '* ' }
	}, {
		// e.g.  */|
		beforeText: /^(\t|[ ])*[ ]\*\/\s*$/,
		action: { indentAction: IndentAction.None, removeText: 1 }
	},
	{
		// e.g.  *-----*/|
		beforeText: /^(\t|[ ])*[ ]\*[^/]*\*\/\s*$/,
		action: { indentAction: IndentAction.None, removeText: 1 }
	},
	{
		beforeText: /^\s*(\bcase\s.+:|\bdefault:)$/,
		afterText: /^(?!\s*(\bcase\b|\bdefault\b))/,
		action: { indentAction: IndentAction.Indent }
	},
	{
		previousLineText: /^\s*(((else ?)?if|for|while)\s*\(.*\)\s*|else\s*)$/,
		beforeText: /^\s+([^{i\s]|i(?!f\b))/,
		action: { indentAction: IndentAction.Outdent }
	},
	// Indent when pressing enter from inside ()
	{
		beforeText: /^.*\([^\)]*$/,
		afterText: /^\s*\).*$/,
		action: { indentAction: IndentAction.IndentOutdent, appendText: '\t' }
	},
	// Indent when pressing enter from inside {}
	{
		beforeText: /^.*\{[^\}]*$/,
		afterText: /^\s*\}.*$/,
		action: { indentAction: IndentAction.IndentOutdent, appendText: '\t' }
	},
	// Indent when pressing enter from inside []
	{
		beforeText: /^.*\[[^\]]*$/,
		afterText: /^\s*\].*$/,
		action: { indentAction: IndentAction.IndentOutdent, appendText: '\t' }
	},
];

export const phpOnEnterRules = [
	{
		beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
		afterText: /^\s*\*\/$/,
		action: {
			indentAction: IndentAction.IndentOutdent,
			appendText: ' * ',
		}
	},
	{
		beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
		action: {
			indentAction: IndentAction.None,
			appendText: ' * ',
		}
	},
	{
		beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
		action: {
			indentAction: IndentAction.None,
			appendText: '* ',
		}
	},
	{
		beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
		action: {
			indentAction: IndentAction.None,
			removeText: 1,
		}
	},
	{
		beforeText: /^(\t|(\ \ ))*\ \*[^/]*\*\/\s*$/,
		action: {
			indentAction: IndentAction.None,
			removeText: 1,
		}
	},
	{
		beforeText: /^\s+([^{i\s]|i(?!f\b))/,
		previousLineText: /^\s*(((else ?)?if|for(each)?|while)\s*\(.*\)\s*|else\s*)$/,
		action: {
			indentAction: IndentAction.Outdent
		}
	},
];

export const cppOnEnterRules = [
	{
		previousLineText: /^\s*(((else ?)?if|for|while)\s*\(.*\)\s*|else\s*)$/,
		beforeText: /^\s+([^{i\s]|i(?!f\b))/,
		action: {
			indentAction: IndentAction.Outdent
		}
	}
];

export const htmlOnEnterRules = [
	{
		beforeText: /<(?!(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr))([_:\w][_:\w\-.\d]*)(?:(?:[^'"/>]|"[^"]*"|'[^']*')*?(?!\/)>)[^<]*$/i,
		afterText: /^<\/([_:\w][_:\w\-.\d]*)\s*>/i,
		action: {
			indentAction: IndentAction.IndentOutdent
		}
	},
	{
		beforeText: /<(?!(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr))([_:\w][_:\w\-.\d]*)(?:(?:[^'"/>]|"[^"]*"|'[^']*')*?(?!\/)>)[^<]*$/i,
		action: {
			indentAction: IndentAction.Indent
		}
	}
];

/*
export enum IndentAction {
	None = 0,
	Indent = 1,
	IndentOutdent = 2,
	Outdent = 3
}
*/
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/modes/supports/richEditBrackets.test.ts]---
Location: vscode-main/src/vs/editor/test/common/modes/supports/richEditBrackets.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../common/core/range.js';
import { BracketsUtils } from '../../../../common/languages/supports/richEditBrackets.js';

suite('richEditBrackets', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function findPrevBracketInRange(reversedBracketRegex: RegExp, lineText: string, currentTokenStart: number, currentTokenEnd: number): Range | null {
		return BracketsUtils.findPrevBracketInRange(reversedBracketRegex, 1, lineText, currentTokenStart, currentTokenEnd);
	}

	function findNextBracketInRange(forwardBracketRegex: RegExp, lineText: string, currentTokenStart: number, currentTokenEnd: number): Range | null {
		return BracketsUtils.findNextBracketInRange(forwardBracketRegex, 1, lineText, currentTokenStart, currentTokenEnd);
	}

	test('findPrevBracketInToken one char 1', () => {
		const result = findPrevBracketInRange(/(\{)|(\})/i, '{', 0, 1);
		assert.strictEqual(result!.startColumn, 1);
		assert.strictEqual(result!.endColumn, 2);
	});

	test('findPrevBracketInToken one char 2', () => {
		const result = findPrevBracketInRange(/(\{)|(\})/i, '{{', 0, 1);
		assert.strictEqual(result!.startColumn, 1);
		assert.strictEqual(result!.endColumn, 2);
	});

	test('findPrevBracketInToken one char 3', () => {
		const result = findPrevBracketInRange(/(\{)|(\})/i, '{hello world!', 0, 13);
		assert.strictEqual(result!.startColumn, 1);
		assert.strictEqual(result!.endColumn, 2);
	});

	test('findPrevBracketInToken more chars 1', () => {
		const result = findPrevBracketInRange(/(olleh)/i, 'hello world!', 0, 12);
		assert.strictEqual(result!.startColumn, 1);
		assert.strictEqual(result!.endColumn, 6);
	});

	test('findPrevBracketInToken more chars 2', () => {
		const result = findPrevBracketInRange(/(olleh)/i, 'hello world!', 0, 5);
		assert.strictEqual(result!.startColumn, 1);
		assert.strictEqual(result!.endColumn, 6);
	});

	test('findPrevBracketInToken more chars 3', () => {
		const result = findPrevBracketInRange(/(olleh)/i, ' hello world!', 0, 6);
		assert.strictEqual(result!.startColumn, 2);
		assert.strictEqual(result!.endColumn, 7);
	});

	test('findNextBracketInToken one char', () => {
		const result = findNextBracketInRange(/(\{)|(\})/i, '{', 0, 1);
		assert.strictEqual(result!.startColumn, 1);
		assert.strictEqual(result!.endColumn, 2);
	});

	test('findNextBracketInToken more chars', () => {
		const result = findNextBracketInRange(/(world)/i, 'hello world!', 0, 12);
		assert.strictEqual(result!.startColumn, 7);
		assert.strictEqual(result!.endColumn, 12);
	});

	test('findNextBracketInToken with emoty result', () => {
		const result = findNextBracketInRange(/(\{)|(\})/i, '', 0, 0);
		assert.strictEqual(result, null);
	});

	test('issue #3894: [Handlebars] Curly braces edit issues', () => {
		const result = findPrevBracketInRange(/(\-\-!<)|(>\-\-)|(\{\{)|(\}\})/i, '{{asd}}', 0, 2);
		assert.strictEqual(result!.startColumn, 1);
		assert.strictEqual(result!.endColumn, 3);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/modes/supports/tokenization.test.ts]---
Location: vscode-main/src/vs/editor/test/common/modes/supports/tokenization.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { FontStyle } from '../../../../common/encodedTokenAttributes.js';
import { ColorMap, ExternalThemeTrieElement, ParsedTokenThemeRule, ThemeTrieElementRule, TokenTheme, parseTokenTheme, strcmp } from '../../../../common/languages/supports/tokenization.js';

suite('Token theme matching', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('gives higher priority to deeper matches', () => {
		const theme = TokenTheme.createFromRawTokenTheme([
			{ token: '', foreground: '100000', background: '200000' },
			{ token: 'punctuation.definition.string.begin.html', foreground: '300000' },
			{ token: 'punctuation.definition.string', foreground: '400000' },
		], []);

		const colorMap = new ColorMap();
		colorMap.getId('100000');
		const _B = colorMap.getId('200000');
		colorMap.getId('400000');
		const _D = colorMap.getId('300000');

		const actual = theme._match('punctuation.definition.string.begin.html');

		assert.deepStrictEqual(actual, new ThemeTrieElementRule(FontStyle.None, _D, _B));
	});

	test('can match', () => {
		const theme = TokenTheme.createFromRawTokenTheme([
			{ token: '', foreground: 'F8F8F2', background: '272822' },
			{ token: 'source', background: '100000' },
			{ token: 'something', background: '100000' },
			{ token: 'bar', background: '200000' },
			{ token: 'baz', background: '200000' },
			{ token: 'bar', fontStyle: 'bold' },
			{ token: 'constant', fontStyle: 'italic', foreground: '300000' },
			{ token: 'constant.numeric', foreground: '400000' },
			{ token: 'constant.numeric.hex', fontStyle: 'bold' },
			{ token: 'constant.numeric.oct', fontStyle: 'bold italic underline' },
			{ token: 'constant.numeric.bin', fontStyle: 'bold strikethrough' },
			{ token: 'constant.numeric.dec', fontStyle: '', foreground: '500000' },
			{ token: 'storage.object.bar', fontStyle: '', foreground: '600000' },
		], []);

		const colorMap = new ColorMap();
		const _A = colorMap.getId('F8F8F2');
		const _B = colorMap.getId('272822');
		const _C = colorMap.getId('200000');
		const _D = colorMap.getId('300000');
		const _E = colorMap.getId('400000');
		const _F = colorMap.getId('500000');
		const _G = colorMap.getId('100000');
		const _H = colorMap.getId('600000');

		function assertMatch(scopeName: string, expected: ThemeTrieElementRule): void {
			const actual = theme._match(scopeName);
			assert.deepStrictEqual(actual, expected, 'when matching <<' + scopeName + '>>');
		}

		function assertSimpleMatch(scopeName: string, fontStyle: FontStyle, foreground: number, background: number): void {
			assertMatch(scopeName, new ThemeTrieElementRule(fontStyle, foreground, background));
		}

		function assertNoMatch(scopeName: string): void {
			assertMatch(scopeName, new ThemeTrieElementRule(FontStyle.None, _A, _B));
		}

		// matches defaults
		assertNoMatch('');
		assertNoMatch('bazz');
		assertNoMatch('asdfg');

		// matches source
		assertSimpleMatch('source', FontStyle.None, _A, _G);
		assertSimpleMatch('source.ts', FontStyle.None, _A, _G);
		assertSimpleMatch('source.tss', FontStyle.None, _A, _G);

		// matches something
		assertSimpleMatch('something', FontStyle.None, _A, _G);
		assertSimpleMatch('something.ts', FontStyle.None, _A, _G);
		assertSimpleMatch('something.tss', FontStyle.None, _A, _G);

		// matches baz
		assertSimpleMatch('baz', FontStyle.None, _A, _C);
		assertSimpleMatch('baz.ts', FontStyle.None, _A, _C);
		assertSimpleMatch('baz.tss', FontStyle.None, _A, _C);

		// matches constant
		assertSimpleMatch('constant', FontStyle.Italic, _D, _B);
		assertSimpleMatch('constant.string', FontStyle.Italic, _D, _B);
		assertSimpleMatch('constant.hex', FontStyle.Italic, _D, _B);

		// matches constant.numeric
		assertSimpleMatch('constant.numeric', FontStyle.Italic, _E, _B);
		assertSimpleMatch('constant.numeric.baz', FontStyle.Italic, _E, _B);

		// matches constant.numeric.hex
		assertSimpleMatch('constant.numeric.hex', FontStyle.Bold, _E, _B);
		assertSimpleMatch('constant.numeric.hex.baz', FontStyle.Bold, _E, _B);

		// matches constant.numeric.oct
		assertSimpleMatch('constant.numeric.oct', FontStyle.Bold | FontStyle.Italic | FontStyle.Underline, _E, _B);
		assertSimpleMatch('constant.numeric.oct.baz', FontStyle.Bold | FontStyle.Italic | FontStyle.Underline, _E, _B);

		// matches constant.numeric.bin
		assertSimpleMatch('constant.numeric.bin', FontStyle.Bold | FontStyle.Strikethrough, _E, _B);
		assertSimpleMatch('constant.numeric.bin.baz', FontStyle.Bold | FontStyle.Strikethrough, _E, _B);

		// matches constant.numeric.dec
		assertSimpleMatch('constant.numeric.dec', FontStyle.None, _F, _B);
		assertSimpleMatch('constant.numeric.dec.baz', FontStyle.None, _F, _B);

		// matches storage.object.bar
		assertSimpleMatch('storage.object.bar', FontStyle.None, _H, _B);
		assertSimpleMatch('storage.object.bar.baz', FontStyle.None, _H, _B);

		// does not match storage.object.bar
		assertSimpleMatch('storage.object.bart', FontStyle.None, _A, _B);
		assertSimpleMatch('storage.object', FontStyle.None, _A, _B);
		assertSimpleMatch('storage', FontStyle.None, _A, _B);

		assertSimpleMatch('bar', FontStyle.Bold, _A, _C);
	});
});

suite('Token theme parsing', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('can parse', () => {

		const actual = parseTokenTheme([
			{ token: '', foreground: 'F8F8F2', background: '272822' },
			{ token: 'source', background: '100000' },
			{ token: 'something', background: '100000' },
			{ token: 'bar', background: '010000' },
			{ token: 'baz', background: '010000' },
			{ token: 'bar', fontStyle: 'bold' },
			{ token: 'constant', fontStyle: 'italic', foreground: 'ff0000' },
			{ token: 'constant.numeric', foreground: '00ff00' },
			{ token: 'constant.numeric.hex', fontStyle: 'bold' },
			{ token: 'constant.numeric.oct', fontStyle: 'bold italic underline' },
			{ token: 'constant.numeric.dec', fontStyle: '', foreground: '0000ff' },
		]);

		const expected = [
			new ParsedTokenThemeRule('', 0, FontStyle.NotSet, 'F8F8F2', '272822'),
			new ParsedTokenThemeRule('source', 1, FontStyle.NotSet, null, '100000'),
			new ParsedTokenThemeRule('something', 2, FontStyle.NotSet, null, '100000'),
			new ParsedTokenThemeRule('bar', 3, FontStyle.NotSet, null, '010000'),
			new ParsedTokenThemeRule('baz', 4, FontStyle.NotSet, null, '010000'),
			new ParsedTokenThemeRule('bar', 5, FontStyle.Bold, null, null),
			new ParsedTokenThemeRule('constant', 6, FontStyle.Italic, 'ff0000', null),
			new ParsedTokenThemeRule('constant.numeric', 7, FontStyle.NotSet, '00ff00', null),
			new ParsedTokenThemeRule('constant.numeric.hex', 8, FontStyle.Bold, null, null),
			new ParsedTokenThemeRule('constant.numeric.oct', 9, FontStyle.Bold | FontStyle.Italic | FontStyle.Underline, null, null),
			new ParsedTokenThemeRule('constant.numeric.dec', 10, FontStyle.None, '0000ff', null),
		];

		assert.deepStrictEqual(actual, expected);
	});
});

suite('Token theme resolving', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('strcmp works', () => {
		const actual = ['bar', 'z', 'zu', 'a', 'ab', ''].sort(strcmp);

		const expected = ['', 'a', 'ab', 'bar', 'z', 'zu'];
		assert.deepStrictEqual(actual, expected);
	});

	test('always has defaults', () => {
		const actual = TokenTheme.createFromParsedTokenTheme([], []);
		const colorMap = new ColorMap();
		const _A = colorMap.getId('000000');
		const _B = colorMap.getId('ffffff');
		assert.deepStrictEqual(actual.getColorMap(), colorMap.getColorMap());
		assert.deepStrictEqual(actual.getThemeTrieElement(), new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.None, _A, _B)));
	});

	test('respects incoming defaults 1', () => {
		const actual = TokenTheme.createFromParsedTokenTheme([
			new ParsedTokenThemeRule('', -1, FontStyle.NotSet, null, null)
		], []);
		const colorMap = new ColorMap();
		const _A = colorMap.getId('000000');
		const _B = colorMap.getId('ffffff');
		assert.deepStrictEqual(actual.getColorMap(), colorMap.getColorMap());
		assert.deepStrictEqual(actual.getThemeTrieElement(), new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.None, _A, _B)));
	});

	test('respects incoming defaults 2', () => {
		const actual = TokenTheme.createFromParsedTokenTheme([
			new ParsedTokenThemeRule('', -1, FontStyle.None, null, null)
		], []);
		const colorMap = new ColorMap();
		const _A = colorMap.getId('000000');
		const _B = colorMap.getId('ffffff');
		assert.deepStrictEqual(actual.getColorMap(), colorMap.getColorMap());
		assert.deepStrictEqual(actual.getThemeTrieElement(), new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.None, _A, _B)));
	});

	test('respects incoming defaults 3', () => {
		const actual = TokenTheme.createFromParsedTokenTheme([
			new ParsedTokenThemeRule('', -1, FontStyle.Bold, null, null)
		], []);
		const colorMap = new ColorMap();
		const _A = colorMap.getId('000000');
		const _B = colorMap.getId('ffffff');
		assert.deepStrictEqual(actual.getColorMap(), colorMap.getColorMap());
		assert.deepStrictEqual(actual.getThemeTrieElement(), new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.Bold, _A, _B)));
	});

	test('respects incoming defaults 4', () => {
		const actual = TokenTheme.createFromParsedTokenTheme([
			new ParsedTokenThemeRule('', -1, FontStyle.NotSet, 'ff0000', null)
		], []);
		const colorMap = new ColorMap();
		const _A = colorMap.getId('ff0000');
		const _B = colorMap.getId('ffffff');
		assert.deepStrictEqual(actual.getColorMap(), colorMap.getColorMap());
		assert.deepStrictEqual(actual.getThemeTrieElement(), new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.None, _A, _B)));
	});

	test('respects incoming defaults 5', () => {
		const actual = TokenTheme.createFromParsedTokenTheme([
			new ParsedTokenThemeRule('', -1, FontStyle.NotSet, null, 'ff0000')
		], []);
		const colorMap = new ColorMap();
		const _A = colorMap.getId('000000');
		const _B = colorMap.getId('ff0000');
		assert.deepStrictEqual(actual.getColorMap(), colorMap.getColorMap());
		assert.deepStrictEqual(actual.getThemeTrieElement(), new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.None, _A, _B)));
	});

	test('can merge incoming defaults', () => {
		const actual = TokenTheme.createFromParsedTokenTheme([
			new ParsedTokenThemeRule('', -1, FontStyle.NotSet, null, 'ff0000'),
			new ParsedTokenThemeRule('', -1, FontStyle.NotSet, '00ff00', null),
			new ParsedTokenThemeRule('', -1, FontStyle.Bold, null, null),
		], []);
		const colorMap = new ColorMap();
		const _A = colorMap.getId('00ff00');
		const _B = colorMap.getId('ff0000');
		assert.deepStrictEqual(actual.getColorMap(), colorMap.getColorMap());
		assert.deepStrictEqual(actual.getThemeTrieElement(), new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.Bold, _A, _B)));
	});

	test('defaults are inherited', () => {
		const actual = TokenTheme.createFromParsedTokenTheme([
			new ParsedTokenThemeRule('', -1, FontStyle.NotSet, 'F8F8F2', '272822'),
			new ParsedTokenThemeRule('var', -1, FontStyle.NotSet, 'ff0000', null)
		], []);
		const colorMap = new ColorMap();
		const _A = colorMap.getId('F8F8F2');
		const _B = colorMap.getId('272822');
		const _C = colorMap.getId('ff0000');
		assert.deepStrictEqual(actual.getColorMap(), colorMap.getColorMap());
		const root = new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.None, _A, _B), {
			'var': new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.None, _C, _B))
		});
		assert.deepStrictEqual(actual.getThemeTrieElement(), root);
	});

	test('same rules get merged', () => {
		const actual = TokenTheme.createFromParsedTokenTheme([
			new ParsedTokenThemeRule('', -1, FontStyle.NotSet, 'F8F8F2', '272822'),
			new ParsedTokenThemeRule('var', 1, FontStyle.Bold, null, null),
			new ParsedTokenThemeRule('var', 0, FontStyle.NotSet, 'ff0000', null),
		], []);
		const colorMap = new ColorMap();
		const _A = colorMap.getId('F8F8F2');
		const _B = colorMap.getId('272822');
		const _C = colorMap.getId('ff0000');
		assert.deepStrictEqual(actual.getColorMap(), colorMap.getColorMap());
		const root = new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.None, _A, _B), {
			'var': new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.Bold, _C, _B))
		});
		assert.deepStrictEqual(actual.getThemeTrieElement(), root);
	});

	test('rules are inherited 1', () => {
		const actual = TokenTheme.createFromParsedTokenTheme([
			new ParsedTokenThemeRule('', -1, FontStyle.NotSet, 'F8F8F2', '272822'),
			new ParsedTokenThemeRule('var', -1, FontStyle.Bold, 'ff0000', null),
			new ParsedTokenThemeRule('var.identifier', -1, FontStyle.NotSet, '00ff00', null),
		], []);
		const colorMap = new ColorMap();
		const _A = colorMap.getId('F8F8F2');
		const _B = colorMap.getId('272822');
		const _C = colorMap.getId('ff0000');
		const _D = colorMap.getId('00ff00');
		assert.deepStrictEqual(actual.getColorMap(), colorMap.getColorMap());
		const root = new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.None, _A, _B), {
			'var': new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.Bold, _C, _B), {
				'identifier': new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.Bold, _D, _B))
			})
		});
		assert.deepStrictEqual(actual.getThemeTrieElement(), root);
	});

	test('rules are inherited 2', () => {
		const actual = TokenTheme.createFromParsedTokenTheme([
			new ParsedTokenThemeRule('', -1, FontStyle.NotSet, 'F8F8F2', '272822'),
			new ParsedTokenThemeRule('var', -1, FontStyle.Bold, 'ff0000', null),
			new ParsedTokenThemeRule('var.identifier', -1, FontStyle.NotSet, '00ff00', null),
			new ParsedTokenThemeRule('constant', 4, FontStyle.Italic, '100000', null),
			new ParsedTokenThemeRule('constant.numeric', 5, FontStyle.NotSet, '200000', null),
			new ParsedTokenThemeRule('constant.numeric.hex', 6, FontStyle.Bold, null, null),
			new ParsedTokenThemeRule('constant.numeric.oct', 7, FontStyle.Bold | FontStyle.Italic | FontStyle.Underline, null, null),
			new ParsedTokenThemeRule('constant.numeric.dec', 8, FontStyle.None, '300000', null),
		], []);
		const colorMap = new ColorMap();
		const _A = colorMap.getId('F8F8F2');
		const _B = colorMap.getId('272822');
		const _C = colorMap.getId('100000');
		const _D = colorMap.getId('200000');
		const _E = colorMap.getId('300000');
		const _F = colorMap.getId('ff0000');
		const _G = colorMap.getId('00ff00');
		assert.deepStrictEqual(actual.getColorMap(), colorMap.getColorMap());
		const root = new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.None, _A, _B), {
			'var': new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.Bold, _F, _B), {
				'identifier': new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.Bold, _G, _B))
			}),
			'constant': new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.Italic, _C, _B), {
				'numeric': new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.Italic, _D, _B), {
					'hex': new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.Bold, _D, _B)),
					'oct': new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.Bold | FontStyle.Italic | FontStyle.Underline, _D, _B)),
					'dec': new ExternalThemeTrieElement(new ThemeTrieElementRule(FontStyle.None, _E, _B)),
				})
			})
		});
		assert.deepStrictEqual(actual.getThemeTrieElement(), root);
	});

	test('custom colors are first in color map', () => {
		const actual = TokenTheme.createFromParsedTokenTheme([
			new ParsedTokenThemeRule('var', -1, FontStyle.NotSet, 'F8F8F2', null)
		], [
			'000000', 'FFFFFF', '0F0F0F'
		]);
		const colorMap = new ColorMap();
		colorMap.getId('000000');
		colorMap.getId('FFFFFF');
		colorMap.getId('0F0F0F');
		colorMap.getId('F8F8F2');
		assert.deepStrictEqual(actual.getColorMap(), colorMap.getColorMap());
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/services/editorWebWorker.test.ts]---
Location: vscode-main/src/vs/editor/test/common/services/editorWebWorker.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Position } from '../../../common/core/position.js';
import { IRange, Range } from '../../../common/core/range.js';
import { TextEdit } from '../../../common/languages.js';
import { EditorWorker } from '../../../common/services/editorWebWorker.js';
import { ICommonModel } from '../../../common/services/textModelSync/textModelSync.impl.js';

suite('EditorWebWorker', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	class WorkerWithModels extends EditorWorker {

		getModel(uri: string) {
			return this._getModel(uri);
		}

		addModel(lines: string[], eol: string = '\n') {
			const uri = 'test:file#' + Date.now();
			this.$acceptNewModel({
				url: uri,
				versionId: 1,
				lines: lines,
				EOL: eol
			});
			return this._getModel(uri)!;
		}
	}

	let worker: WorkerWithModels;
	let model: ICommonModel;

	setup(() => {
		worker = new WorkerWithModels();
		model = worker.addModel([
			'This is line one', //16
			'and this is line number two', //27
			'it is followed by #3', //20
			'and finished with the fourth.', //29
		]);
	});

	function assertPositionAt(offset: number, line: number, column: number) {
		const position = model.positionAt(offset);
		assert.strictEqual(position.lineNumber, line);
		assert.strictEqual(position.column, column);
	}

	function assertOffsetAt(lineNumber: number, column: number, offset: number) {
		const actual = model.offsetAt({ lineNumber, column });
		assert.strictEqual(actual, offset);
	}

	test('ICommonModel#offsetAt', () => {
		assertOffsetAt(1, 1, 0);
		assertOffsetAt(1, 2, 1);
		assertOffsetAt(1, 17, 16);
		assertOffsetAt(2, 1, 17);
		assertOffsetAt(2, 4, 20);
		assertOffsetAt(3, 1, 45);
		assertOffsetAt(5, 30, 95);
		assertOffsetAt(5, 31, 95);
		assertOffsetAt(5, Number.MAX_VALUE, 95);
		assertOffsetAt(6, 30, 95);
		assertOffsetAt(Number.MAX_VALUE, 30, 95);
		assertOffsetAt(Number.MAX_VALUE, Number.MAX_VALUE, 95);
	});

	test('ICommonModel#positionAt', () => {
		assertPositionAt(0, 1, 1);
		assertPositionAt(Number.MIN_VALUE, 1, 1);
		assertPositionAt(1, 1, 2);
		assertPositionAt(16, 1, 17);
		assertPositionAt(17, 2, 1);
		assertPositionAt(20, 2, 4);
		assertPositionAt(45, 3, 1);
		assertPositionAt(95, 4, 30);
		assertPositionAt(96, 4, 30);
		assertPositionAt(99, 4, 30);
		assertPositionAt(Number.MAX_VALUE, 4, 30);
	});

	test('ICommonModel#validatePosition, issue #15882', function () {
		const model = worker.addModel(['{"id": "0001","type": "donut","name": "Cake","image":{"url": "images/0001.jpg","width": 200,"height": 200},"thumbnail":{"url": "images/thumbnails/0001.jpg","width": 32,"height": 32}}']);
		assert.strictEqual(model.offsetAt({ lineNumber: 1, column: 2 }), 1);
	});

	test('MoreMinimal', () => {

		return worker.$computeMoreMinimalEdits(model.uri.toString(), [{ text: 'This is line One', range: new Range(1, 1, 1, 17) }], false).then(edits => {
			assert.strictEqual(edits.length, 1);
			const [first] = edits;
			assert.strictEqual(first.text, 'O');
			assert.deepStrictEqual(first.range, { startLineNumber: 1, startColumn: 14, endLineNumber: 1, endColumn: 15 });
		});
	});

	test('MoreMinimal, merge adjacent edits', async function () {

		const model = worker.addModel([
			'one',
			'two',
			'three',
			'four',
			'five'
		], '\n');


		const newEdits = await worker.$computeMoreMinimalEdits(model.uri.toString(), [
			{
				range: new Range(1, 1, 2, 1),
				text: 'one\ntwo\nthree\n',
			}, {
				range: new Range(2, 1, 3, 1),
				text: '',
			}, {
				range: new Range(3, 1, 4, 1),
				text: '',
			}, {
				range: new Range(4, 2, 4, 3),
				text: '4',
			}, {
				range: new Range(5, 3, 5, 5),
				text: '5',
			}
		], false);

		assert.strictEqual(newEdits.length, 2);
		assert.strictEqual(newEdits[0].text, '4');
		assert.strictEqual(newEdits[1].text, '5');
	});

	test('MoreMinimal, issue #15385 newline changes only', function () {

		const model = worker.addModel([
			'{',
			'\t"a":1',
			'}'
		], '\n');

		return worker.$computeMoreMinimalEdits(model.uri.toString(), [{ text: '{\r\n\t"a":1\r\n}', range: new Range(1, 1, 3, 2) }], false).then(edits => {
			assert.strictEqual(edits.length, 0);
		});
	});

	test('MoreMinimal, issue #15385 newline changes and other', function () {

		const model = worker.addModel([
			'{',
			'\t"a":1',
			'}'
		], '\n');

		return worker.$computeMoreMinimalEdits(model.uri.toString(), [{ text: '{\r\n\t"b":1\r\n}', range: new Range(1, 1, 3, 2) }], false).then(edits => {
			assert.strictEqual(edits.length, 1);
			const [first] = edits;
			assert.strictEqual(first.text, 'b');
			assert.deepStrictEqual(first.range, { startLineNumber: 2, startColumn: 3, endLineNumber: 2, endColumn: 4 });
		});
	});

	test('MoreMinimal, issue #15385 newline changes and other 2/2', function () {

		const model = worker.addModel([
			'package main',	// 1
			'func foo() {',	// 2
			'}'				// 3
		]);

		return worker.$computeMoreMinimalEdits(model.uri.toString(), [{ text: '\n', range: new Range(3, 2, 4, 1000) }], false).then(edits => {
			assert.strictEqual(edits.length, 1);
			const [first] = edits;
			assert.strictEqual(first.text, '\n');
			assert.deepStrictEqual(first.range, { startLineNumber: 3, startColumn: 2, endLineNumber: 3, endColumn: 2 });
		});
	});

	async function testEdits(lines: string[], edits: TextEdit[]): Promise<unknown> {
		const model = worker.addModel(lines);

		const smallerEdits = await worker.$computeHumanReadableDiff(
			model.uri.toString(),
			edits,
			{ ignoreTrimWhitespace: false, maxComputationTimeMs: 0, computeMoves: false }
		);

		const t1 = applyEdits(model.getValue(), edits);
		const t2 = applyEdits(model.getValue(), smallerEdits);
		assert.deepStrictEqual(t1, t2);

		return smallerEdits.map(e => ({ range: Range.lift(e.range).toString(), text: e.text }));
	}


	test('computeHumanReadableDiff 1', async () => {
		assert.deepStrictEqual(
			await testEdits(
				[
					'function test() {}'
				],
				[{
					text: '\n/** Some Comment */\n',
					range: new Range(1, 1, 1, 1)
				}]),
			([{ range: '[1,1 -> 1,1]', text: '\n/** Some Comment */\n' }])
		);
	});

	test('computeHumanReadableDiff 2', async () => {
		assert.deepStrictEqual(
			await testEdits(
				[
					'function test() {}'
				],
				[{
					text: 'function test(myParam: number) { console.log(myParam); }',
					range: new Range(1, 1, 1, Number.MAX_SAFE_INTEGER)
				}]),
			([{ range: '[1,15 -> 1,15]', text: 'myParam: number' }, { range: '[1,18 -> 1,18]', text: ' console.log(myParam); ' }])
		);
	});

	test('computeHumanReadableDiff 3', async () => {
		assert.deepStrictEqual(
			await testEdits(
				[
					'',
					'',
					'',
					''
				],
				[{
					text: 'function test(myParam: number) { console.log(myParam); }\n\n',
					range: new Range(2, 1, 3, 20)
				}]),
			([{ range: '[2,1 -> 2,1]', text: 'function test(myParam: number) { console.log(myParam); }\n' }])
		);
	});

	test('computeHumanReadableDiff 4', async () => {
		assert.deepStrictEqual(
			await testEdits(
				[
					'function algorithm() {}',
				],
				[{
					text: 'function alm() {}',
					range: new Range(1, 1, 1, Number.MAX_SAFE_INTEGER)
				}]),
			([{ range: '[1,10 -> 1,19]', text: 'alm' }])
		);
	});

	test('[Bug] Getting Message "Overlapping ranges are not allowed" and nothing happens with Inline-Chat ', async function () {
		await testEdits(('const API = require(\'../src/api\');\n\ndescribe(\'API\', () => {\n  let api;\n  let database;\n\n  beforeAll(() => {\n    database = {\n      getAllBooks: jest.fn(),\n      getBooksByAuthor: jest.fn(),\n      getBooksByTitle: jest.fn(),\n    };\n    api = new API(database);\n  });\n\n  describe(\'GET /books\', () => {\n    it(\'should return all books\', async () => {\n      const mockBooks = [{ title: \'Book 1\' }, { title: \'Book 2\' }];\n      database.getAllBooks.mockResolvedValue(mockBooks);\n\n      const req = {};\n      const res = {\n        json: jest.fn(),\n      };\n\n      await api.register({\n        get: (path, handler) => {\n          if (path === \'/books\') {\n            handler(req, res);\n          }\n        },\n      });\n\n      expect(database.getAllBooks).toHaveBeenCalled();\n      expect(res.json).toHaveBeenCalledWith(mockBooks);\n    });\n  });\n\n  describe(\'GET /books/author/:author\', () => {\n    it(\'should return books by author\', async () => {\n      const mockAuthor = \'John Doe\';\n      const mockBooks = [{ title: \'Book 1\', author: mockAuthor }, { title: \'Book 2\', author: mockAuthor }];\n      database.getBooksByAuthor.mockResolvedValue(mockBooks);\n\n      const req = {\n        params: {\n          author: mockAuthor,\n        },\n      };\n      const res = {\n        json: jest.fn(),\n      };\n\n      await api.register({\n        get: (path, handler) => {\n          if (path === `/books/author/${mockAuthor}`) {\n            handler(req, res);\n          }\n        },\n      });\n\n      expect(database.getBooksByAuthor).toHaveBeenCalledWith(mockAuthor);\n      expect(res.json).toHaveBeenCalledWith(mockBooks);\n    });\n  });\n\n  describe(\'GET /books/title/:title\', () => {\n    it(\'should return books by title\', async () => {\n      const mockTitle = \'Book 1\';\n      const mockBooks = [{ title: mockTitle, author: \'John Doe\' }];\n      database.getBooksByTitle.mockResolvedValue(mockBooks);\n\n      const req = {\n        params: {\n          title: mockTitle,\n        },\n      };\n      const res = {\n        json: jest.fn(),\n      };\n\n      await api.register({\n        get: (path, handler) => {\n          if (path === `/books/title/${mockTitle}`) {\n            handler(req, res);\n          }\n        },\n      });\n\n      expect(database.getBooksByTitle).toHaveBeenCalledWith(mockTitle);\n      expect(res.json).toHaveBeenCalledWith(mockBooks);\n    });\n  });\n});\n').split('\n'),
			[{
				range: { startLineNumber: 1, startColumn: 1, endLineNumber: 96, endColumn: 1 },
				text: `const request = require('supertest');\nconst API = require('../src/api');\n\ndescribe('API', () => {\n  let api;\n  let database;\n\n  beforeAll(() => {\n    database = {\n      getAllBooks: jest.fn(),\n      getBooksByAuthor: jest.fn(),\n      getBooksByTitle: jest.fn(),\n    };\n    api = new API(database);\n  });\n\n  describe('GET /books', () => {\n    it('should return all books', async () => {\n      const mockBooks = [{ title: 'Book 1' }, { title: 'Book 2' }];\n      database.getAllBooks.mockResolvedValue(mockBooks);\n\n      const response = await request(api.app).get('/books');\n\n      expect(database.getAllBooks).toHaveBeenCalled();\n      expect(response.status).toBe(200);\n      expect(response.body).toEqual(mockBooks);\n    });\n  });\n\n  describe('GET /books/author/:author', () => {\n    it('should return books by author', async () => {\n      const mockAuthor = 'John Doe';\n      const mockBooks = [{ title: 'Book 1', author: mockAuthor }, { title: 'Book 2', author: mockAuthor }];\n      database.getBooksByAuthor.mockResolvedValue(mockBooks);\n\n      const response = await request(api.app).get(\`/books/author/\${mockAuthor}\`);\n\n      expect(database.getBooksByAuthor).toHaveBeenCalledWith(mockAuthor);\n      expect(response.status).toBe(200);\n      expect(response.body).toEqual(mockBooks);\n    });\n  });\n\n  describe('GET /books/title/:title', () => {\n    it('should return books by title', async () => {\n      const mockTitle = 'Book 1';\n      const mockBooks = [{ title: mockTitle, author: 'John Doe' }];\n      database.getBooksByTitle.mockResolvedValue(mockBooks);\n\n      const response = await request(api.app).get(\`/books/title/\${mockTitle}\`);\n\n      expect(database.getBooksByTitle).toHaveBeenCalledWith(mockTitle);\n      expect(response.status).toBe(200);\n      expect(response.body).toEqual(mockBooks);\n    });\n  });\n});\n`,
			}]
		);
	});

	test('ICommonModel#getValueInRange, issue #17424', function () {

		const model = worker.addModel([
			'package main',	// 1
			'func foo() {',	// 2
			'}'				// 3
		]);

		const value = model.getValueInRange({ startLineNumber: 3, startColumn: 1, endLineNumber: 4, endColumn: 1 });
		assert.strictEqual(value, '}');
	});


	test('textualSuggest, issue #17785', function () {

		const model = worker.addModel([
			'foobar',	// 1
			'f f'	// 2
		]);

		return worker.$textualSuggest([model.uri.toString()], 'f', '[a-z]+', 'img').then((result) => {
			if (!result) {
				assert.ok(false);
			}
			assert.strictEqual(result.words.length, 1);
			assert.strictEqual(typeof result.duration, 'number');
			assert.strictEqual(result.words[0], 'foobar');
		});
	});

	test('get words via iterator, issue #46930', function () {

		const model = worker.addModel([
			'one line',	// 1
			'two line',	// 2
			'',
			'past empty',
			'single',
			'',
			'and now we are done'
		]);

		const words: string[] = [...model.words(/[a-z]+/img)];

		assert.deepStrictEqual(words, ['one', 'line', 'two', 'line', 'past', 'empty', 'single', 'and', 'now', 'we', 'are', 'done']);
	});
});

function applyEdits(text: string, edits: { range: IRange; text: string }[]): string {
	const transformer = new PositionOffsetTransformer(text);
	const offsetEdits = edits.map(e => {
		const range = Range.lift(e.range);
		return ({
			startOffset: transformer.getOffset(range.getStartPosition()),
			endOffset: transformer.getOffset(range.getEndPosition()),
			text: e.text
		});
	});

	offsetEdits.sort((a, b) => b.startOffset - a.startOffset);

	for (const edit of offsetEdits) {
		text = text.substring(0, edit.startOffset) + edit.text + text.substring(edit.endOffset);
	}

	return text;
}

class PositionOffsetTransformer {
	private readonly lineStartOffsetByLineIdx: number[];

	constructor(private readonly text: string) {
		this.lineStartOffsetByLineIdx = [];
		this.lineStartOffsetByLineIdx.push(0);
		for (let i = 0; i < text.length; i++) {
			if (text.charAt(i) === '\n') {
				this.lineStartOffsetByLineIdx.push(i + 1);
			}
		}
		this.lineStartOffsetByLineIdx.push(text.length + 1);
	}

	getOffset(position: Position): number {
		const maxLineOffset = position.lineNumber >= this.lineStartOffsetByLineIdx.length ? this.text.length : (this.lineStartOffsetByLineIdx[position.lineNumber] - 1);
		return Math.min(this.lineStartOffsetByLineIdx[position.lineNumber - 1] + position.column - 1, maxLineOffset);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/services/findSectionHeaders.test.ts]---
Location: vscode-main/src/vs/editor/test/common/services/findSectionHeaders.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { FindSectionHeaderOptions, ISectionHeaderFinderTarget, findSectionHeaders } from '../../../common/services/findSectionHeaders.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

class TestSectionHeaderFinderTarget implements ISectionHeaderFinderTarget {
	constructor(private readonly lines: string[]) { }

	getLineCount(): number {
		return this.lines.length;
	}

	getLineContent(lineNumber: number): string {
		return this.lines[lineNumber - 1];
	}
}

suite('FindSectionHeaders', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('finds simple section headers', () => {
		const model = new TestSectionHeaderFinderTarget([
			'regular line',
			'MARK: My Section',
			'another line',
			'MARK: Another Section',
			'last line'
		]);

		const options: FindSectionHeaderOptions = {
			findRegionSectionHeaders: false,
			findMarkSectionHeaders: true,
			markSectionHeaderRegex: 'MARK:\\s*(?<label>.*)$'
		};

		const headers = findSectionHeaders(model, options);
		assert.strictEqual(headers.length, 2);

		assert.strictEqual(headers[0].text, 'My Section');
		assert.strictEqual(headers[0].range.startLineNumber, 2);
		assert.strictEqual(headers[0].range.endLineNumber, 2);

		assert.strictEqual(headers[1].text, 'Another Section');
		assert.strictEqual(headers[1].range.startLineNumber, 4);
		assert.strictEqual(headers[1].range.endLineNumber, 4);
	});

	test('finds section headers with separators', () => {
		const model = new TestSectionHeaderFinderTarget([
			'regular line',
			'MARK: -My Section',
			'another line',
			'MARK: - Another Section',
			'last line'
		]);

		const options: FindSectionHeaderOptions = {
			findRegionSectionHeaders: false,
			findMarkSectionHeaders: true,
			markSectionHeaderRegex: 'MARK:\\s*(?<separator>-?)\\s*(?<label>.*)$'
		};

		const headers = findSectionHeaders(model, options);
		assert.strictEqual(headers.length, 2);

		assert.strictEqual(headers[0].text, 'My Section');
		assert.strictEqual(headers[0].hasSeparatorLine, true);

		assert.strictEqual(headers[1].text, 'Another Section');
		assert.strictEqual(headers[1].hasSeparatorLine, true);
	});

	test('finds multi-line section headers with separators', () => {
		const model = new TestSectionHeaderFinderTarget([
			'regular line',
			'// ==========',
			'// My Section',
			'// ==========',
			'code...',
			'// ==========',
			'// Another Section',
			'// ==========',
			'more code...'
		]);

		const options: FindSectionHeaderOptions = {
			findRegionSectionHeaders: false,
			findMarkSectionHeaders: true,
			markSectionHeaderRegex: '^\/\/ =+\\n^\/\/ (?<label>[^\\n]+?)\\n^\/\/ =+$'
		};

		const headers = findSectionHeaders(model, options);
		assert.strictEqual(headers.length, 2);

		assert.strictEqual(headers[0].text, 'My Section');
		assert.strictEqual(headers[0].range.startLineNumber, 2);
		assert.strictEqual(headers[0].range.endLineNumber, 4);

		assert.strictEqual(headers[1].text, 'Another Section');
		assert.strictEqual(headers[1].range.startLineNumber, 6);
		assert.strictEqual(headers[1].range.endLineNumber, 8);
	});

	test('handles overlapping multi-line section headers correctly', () => {
		const model = new TestSectionHeaderFinderTarget([
			'// ==========',
			'// Section 1',
			'// ==========',
			'// ==========', // This line starts another header
			'// Section 2',
			'// ==========',
		]);

		const options: FindSectionHeaderOptions = {
			findRegionSectionHeaders: false,
			findMarkSectionHeaders: true,
			markSectionHeaderRegex: '^\/\/ =+\\n^\/\/ (?<label>[^\\n]+?)\\n^\/\/ =+$'
		};

		const headers = findSectionHeaders(model, options);
		assert.strictEqual(headers.length, 2);

		assert.strictEqual(headers[0].text, 'Section 1');
		assert.strictEqual(headers[0].range.startLineNumber, 1);
		assert.strictEqual(headers[0].range.endLineNumber, 3);

		assert.strictEqual(headers[1].text, 'Section 2');
		assert.strictEqual(headers[1].range.startLineNumber, 4);
		assert.strictEqual(headers[1].range.endLineNumber, 6);
	});

	test('section headers must be in comments when specified', () => {
		const model = new TestSectionHeaderFinderTarget([
			'// ==========',
			'// Section 1',  // This one is in a comment
			'// ==========',
			'==========',    // This one isn't
			'Section 2',
			'=========='
		]);

		const options: FindSectionHeaderOptions = {
			findRegionSectionHeaders: false,
			findMarkSectionHeaders: true,
			markSectionHeaderRegex: '^(?:\/\/ )?=+\\n^(?:\/\/ )?(?<label>[^\\n]+?)\\n^(?:\/\/ )?=+$'
		};

		// Both patterns match, but the second one should be filtered out by the token check
		const headers = findSectionHeaders(model, options);
		assert.strictEqual(headers[0].shouldBeInComments, true);
	});

	test('handles section headers at chunk boundaries', () => {
		// Create enough lines to ensure we cross chunk boundaries
		const lines: string[] = [];
		for (let i = 0; i < 150; i++) {
			lines.push('line ' + i);
		}

		// Add headers near the chunk boundary (chunk size is 100)
		lines[97] = '// ==========';
		lines[98] = '// Section 1';
		lines[99] = '// ==========';
		lines[100] = '// ==========';
		lines[101] = '// Section 2';
		lines[102] = '// ==========';

		const model = new TestSectionHeaderFinderTarget(lines);

		const options: FindSectionHeaderOptions = {
			findRegionSectionHeaders: false,
			findMarkSectionHeaders: true,
			markSectionHeaderRegex: '^\/\/ =+\\n^\/\/ (?<label>[^\\n]+?)\\n^\/\/ =+$'
		};

		const headers = findSectionHeaders(model, options);
		assert.strictEqual(headers.length, 2);

		assert.strictEqual(headers[0].text, 'Section 1');
		assert.strictEqual(headers[0].range.startLineNumber, 98);
		assert.strictEqual(headers[0].range.endLineNumber, 100);

		assert.strictEqual(headers[1].text, 'Section 2');
		assert.strictEqual(headers[1].range.startLineNumber, 101);
		assert.strictEqual(headers[1].range.endLineNumber, 103);
	});

	test('handles empty regex gracefully without infinite loop', () => {
		const model = new TestSectionHeaderFinderTarget([
			'line 1',
			'line 2',
			'line 3'
		]);

		const options: FindSectionHeaderOptions = {
			findRegionSectionHeaders: false,
			findMarkSectionHeaders: true,
			markSectionHeaderRegex: '' // Empty string that would cause infinite loop
		};

		const headers = findSectionHeaders(model, options);
		assert.strictEqual(headers.length, 0, 'Should return no headers for empty regex');
	});

	test('handles whitespace-only regex gracefully without infinite loop', () => {
		const model = new TestSectionHeaderFinderTarget([
			'line 1',
			'line 2',
			'line 3'
		]);

		const options: FindSectionHeaderOptions = {
			findRegionSectionHeaders: false,
			findMarkSectionHeaders: true,
			markSectionHeaderRegex: '   ' // Whitespace that would cause infinite loop
		};

		const headers = findSectionHeaders(model, options);
		assert.strictEqual(headers.length, 0, 'Should return no headers for whitespace-only regex');
	});

	test('correctly advances past matches without infinite loop', () => {
		const model = new TestSectionHeaderFinderTarget([
			'// ==========',
			'// Section 1',
			'// ==========',
			'some code',
			'// ==========',
			'// Section 2',
			'// ==========',
			'more code',
			'// ==========',
			'// Section 3',
			'// ==========',
		]);

		const options: FindSectionHeaderOptions = {
			findRegionSectionHeaders: false,
			findMarkSectionHeaders: true,
			markSectionHeaderRegex: '^\/\/ =+\\n^\/\/ (?<label>[^\\n]+?)\\n^\/\/ =+$'
		};

		const headers = findSectionHeaders(model, options);
		assert.strictEqual(headers.length, 3, 'Should find all three section headers');
		assert.strictEqual(headers[0].text, 'Section 1');
		assert.strictEqual(headers[1].text, 'Section 2');
		assert.strictEqual(headers[2].text, 'Section 3');
	});

	test('handles consecutive section headers correctly', () => {
		const model = new TestSectionHeaderFinderTarget([
			'// ==========',
			'// Section 1',
			'// ==========',
			'// ==========', // This line is both the end of Section 1 and start of Section 2
			'// Section 2',
			'// ==========',
		]);

		const options: FindSectionHeaderOptions = {
			findRegionSectionHeaders: false,
			findMarkSectionHeaders: true,
			markSectionHeaderRegex: '^\/\/ =+\\n^\/\/ (?<label>[^\\n]+?)\\n^\/\/ =+$'
		};

		const headers = findSectionHeaders(model, options);
		assert.strictEqual(headers.length, 2, 'Should find both section headers');
		assert.strictEqual(headers[0].text, 'Section 1');
		assert.strictEqual(headers[1].text, 'Section 2');
	});

	test('handles nested separators correctly', () => {
		const model = new TestSectionHeaderFinderTarget([
			'// ==============',
			'// Major Section',
			'// ==============',
			'',
			'// ----------',
			'// Subsection',
			'// ----------',
		]);

		const options: FindSectionHeaderOptions = {
			findRegionSectionHeaders: false,
			findMarkSectionHeaders: true,
			markSectionHeaderRegex: '^\/\/ [-=]+\\n^\/\/ (?<label>[^\\n]+?)\\n^\/\/ [-=]+$'
		};

		const headers = findSectionHeaders(model, options);
		assert.strictEqual(headers.length, 2, 'Should find both section headers');
		assert.strictEqual(headers[0].text, 'Major Section');
		assert.strictEqual(headers[1].text, 'Subsection');
	});

	test('handles section headers at chunk boundaries correctly', () => {
		const lines: string[] = [];
		// Fill up to near the chunk boundary (chunk size is 100)
		for (let i = 0; i < 97; i++) {
			lines.push(`line ${i}`);
		}

		// Add a section header that would cross the chunk boundary
		lines.push('// ==========');  // line 97
		lines.push('// Section 1'); // line 98
		lines.push('// =========='); // line 99
		lines.push('// =========='); // line 100 (chunk boundary)
		lines.push('// Section 2'); // line 101
		lines.push('// =========='); // line 102

		// Add more content after
		for (let i = 103; i < 150; i++) {
			lines.push(`line ${i}`);
		}

		const model = new TestSectionHeaderFinderTarget(lines);

		const options: FindSectionHeaderOptions = {
			findRegionSectionHeaders: false,
			findMarkSectionHeaders: true,
			markSectionHeaderRegex: '^\/\/ =+\\n^\/\/ (?<label>[^\\n]+?)\\n^\/\/ =+$'
		};

		const headers = findSectionHeaders(model, options);
		assert.strictEqual(headers.length, 2, 'Should find both section headers across chunk boundary');

		assert.strictEqual(headers[0].text, 'Section 1');
		assert.strictEqual(headers[0].range.startLineNumber, 98);
		assert.strictEqual(headers[0].range.endLineNumber, 100);

		assert.strictEqual(headers[1].text, 'Section 2');
		assert.strictEqual(headers[1].range.startLineNumber, 101);
		assert.strictEqual(headers[1].range.endLineNumber, 103);
	});

	test('handles overlapping section headers without duplicates', () => {
		const model = new TestSectionHeaderFinderTarget([
			'// ==========',  // Line 1
			'// Section 1',   // Line 2 - This is part of first header
			'// ==========',  // Line 3 - This is the end of first
			'// Section 2',   // Line 4 - This is not a header
			'// ==========',  // Line 5
			'// ==========',  // Line 6 - Start of second header
			'// Section 3',   // Line 7
			'// ==========='  // Line 8
		]);

		const options: FindSectionHeaderOptions = {
			findRegionSectionHeaders: false,
			findMarkSectionHeaders: true,
			markSectionHeaderRegex: '^\/\/ =+\\n^\/\/ (?<label>[^\\n]+?)\\n^\/\/ =+$'
		};

		const headers = findSectionHeaders(model, options);
		assert.strictEqual(headers.length, 2);

		assert.strictEqual(headers[0].text, 'Section 1');
		assert.strictEqual(headers[0].range.startLineNumber, 1);
		assert.strictEqual(headers[0].range.endLineNumber, 3);

		// assert.strictEqual(headers[1].text, 'Section 2');
		// assert.strictEqual(headers[1].range.startLineNumber, 3);
		// assert.strictEqual(headers[1].range.endLineNumber, 5);

		assert.strictEqual(headers[1].text, 'Section 3');
		assert.strictEqual(headers[1].range.startLineNumber, 6);
		assert.strictEqual(headers[1].range.endLineNumber, 8);
	});

	test('handles partially overlapping multiline section headers correctly', () => {
		const model = new TestSectionHeaderFinderTarget([
			'// ================',  // Line 1
			'// Major Section 1',   // Line 2
			'// ================',  // Line 3
			'// --------',         // Line 4 - Start of subsection that overlaps with end of major section
			'// Subsection 1.1',   // Line 5
			'// --------',         // Line 6
			'// ================',  // Line 7
			'// Major Section 2',   // Line 8
			'// ================',  // Line 9
		]);

		const options: FindSectionHeaderOptions = {
			findRegionSectionHeaders: false,
			findMarkSectionHeaders: true,
			markSectionHeaderRegex: '^\/\/ [-=]+\\n^\/\/ (?<label>[^\\n]+?)\\n^\/\/ [-=]+$'
		};

		const headers = findSectionHeaders(model, options);
		assert.strictEqual(headers.length, 3);

		assert.strictEqual(headers[0].text, 'Major Section 1');
		assert.strictEqual(headers[0].range.startLineNumber, 1);
		assert.strictEqual(headers[0].range.endLineNumber, 3);

		assert.strictEqual(headers[1].text, 'Subsection 1.1');
		assert.strictEqual(headers[1].range.startLineNumber, 4);
		assert.strictEqual(headers[1].range.endLineNumber, 6);

		assert.strictEqual(headers[2].text, 'Major Section 2');
		assert.strictEqual(headers[2].range.startLineNumber, 7);
		assert.strictEqual(headers[2].range.endLineNumber, 9);
	});
});
```

--------------------------------------------------------------------------------

````
