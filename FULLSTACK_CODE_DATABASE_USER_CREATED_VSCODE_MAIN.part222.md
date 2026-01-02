---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 222
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 222 of 552)

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

---[FILE: src/vs/editor/contrib/comment/test/browser/lineCommentCommand.test.ts]---
Location: vscode-main/src/vs/editor/contrib/comment/test/browser/lineCommentCommand.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Selection } from '../../../../common/core/selection.js';
import { ICommand } from '../../../../common/editorCommon.js';
import { ColorId, MetadataConsts } from '../../../../common/encodedTokenAttributes.js';
import { EncodedTokenizationResult, IState, TokenizationRegistry } from '../../../../common/languages.js';
import { ILanguageService } from '../../../../common/languages/language.js';
import { CommentRule } from '../../../../common/languages/languageConfiguration.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { NullState } from '../../../../common/languages/nullTokenize.js';
import { ILinePreflightData, IPreflightData, ISimpleModel, LineCommentCommand, Type } from '../../browser/lineCommentCommand.js';
import { testCommand } from '../../../../test/browser/testCommand.js';
import { TestLanguageConfigurationService } from '../../../../test/common/modes/testLanguageConfigurationService.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';

function createTestCommandHelper(commentsConfig: CommentRule, commandFactory: (accessor: ServicesAccessor, selection: Selection) => ICommand): (lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection) => void {
	return (lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection) => {
		const languageId = 'commentMode';
		const prepare = (accessor: ServicesAccessor, disposables: DisposableStore) => {
			const languageConfigurationService = accessor.get(ILanguageConfigurationService);
			const languageService = accessor.get(ILanguageService);
			disposables.add(languageService.registerLanguage({ id: languageId }));
			disposables.add(languageConfigurationService.register(languageId, {
				comments: commentsConfig
			}));
		};
		testCommand(lines, languageId, selection, commandFactory, expectedLines, expectedSelection, false, prepare);
	};
}

suite('Editor Contrib - Line Comment Command', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const testLineCommentCommand = createTestCommandHelper(
		{ lineComment: '!@#', blockComment: ['<!@#', '#@!>'] },
		(accessor, sel) => new LineCommentCommand(accessor.get(ILanguageConfigurationService), sel, 4, Type.Toggle, true, true)
	);

	const testAddLineCommentCommand = createTestCommandHelper(
		{ lineComment: '!@#', blockComment: ['<!@#', '#@!>'] },
		(accessor, sel) => new LineCommentCommand(accessor.get(ILanguageConfigurationService), sel, 4, Type.ForceAdd, true, true)
	);

	const testLineCommentCommandTokenFirstColumn = createTestCommandHelper(
		{ lineComment: { comment: '!@#', noIndent: true }, blockComment: ['<!@#', '#@!>'] },
		(accessor, sel) => new LineCommentCommand(accessor.get(ILanguageConfigurationService), sel, 4, Type.Toggle, true, true)
	);

	test('comment single line', function () {
		testLineCommentCommand(
			[
				'some text',
				'\tsome more text'
			],
			new Selection(1, 1, 1, 1),
			[
				'!@# some text',
				'\tsome more text'
			],
			new Selection(1, 5, 1, 5)
		);
	});

	test('case insensitive', function () {
		const testLineCommentCommand = createTestCommandHelper(
			{ lineComment: 'rem' },
			(accessor, sel) => new LineCommentCommand(accessor.get(ILanguageConfigurationService), sel, 4, Type.Toggle, true, true)
		);

		testLineCommentCommand(
			[
				'REM some text'
			],
			new Selection(1, 1, 1, 1),
			[
				'some text'
			],
			new Selection(1, 1, 1, 1)
		);
	});

	test('comment with token column fixed', function () {
		testLineCommentCommandTokenFirstColumn(
			[
				'some text',
				'\tsome more text'
			],
			new Selection(2, 1, 2, 1),
			[
				'some text',
				'!@# \tsome more text'
			],
			new Selection(2, 5, 2, 5)
		);
	});

	function createSimpleModel(lines: string[]): ISimpleModel {
		return {
			getLineContent: (lineNumber: number) => {
				return lines[lineNumber - 1];
			}
		};
	}

	function createBasicLinePreflightData(commentTokens: string[]): ILinePreflightData[] {
		return commentTokens.map((commentString) => {
			const r: ILinePreflightData = {
				ignore: false,
				commentStr: commentString,
				commentStrOffset: 0,
				commentStrLength: commentString.length
			};
			return r;
		});
	}

	test('_analyzeLines', () => {
		const disposable = new DisposableStore();
		let r: IPreflightData;

		r = LineCommentCommand._analyzeLines(Type.Toggle, true, createSimpleModel([
			'\t\t',
			'    ',
			'    c',
			'\t\td'
		]), createBasicLinePreflightData(['//', 'rem', '!@#', '!@#']), 1, true, false, disposable.add(new TestLanguageConfigurationService()), 'plaintext');
		if (!r.supported) {
			throw new Error(`unexpected`);
		}

		assert.strictEqual(r.shouldRemoveComments, false);

		// Does not change `commentStr`
		assert.strictEqual(r.lines[0].commentStr, '//');
		assert.strictEqual(r.lines[1].commentStr, 'rem');
		assert.strictEqual(r.lines[2].commentStr, '!@#');
		assert.strictEqual(r.lines[3].commentStr, '!@#');

		// Fills in `isWhitespace`
		assert.strictEqual(r.lines[0].ignore, true);
		assert.strictEqual(r.lines[1].ignore, true);
		assert.strictEqual(r.lines[2].ignore, false);
		assert.strictEqual(r.lines[3].ignore, false);

		// Fills in `commentStrOffset`
		assert.strictEqual(r.lines[0].commentStrOffset, 2);
		assert.strictEqual(r.lines[1].commentStrOffset, 4);
		assert.strictEqual(r.lines[2].commentStrOffset, 4);
		assert.strictEqual(r.lines[3].commentStrOffset, 2);


		r = LineCommentCommand._analyzeLines(Type.Toggle, true, createSimpleModel([
			'\t\t',
			'    rem ',
			'    !@# c',
			'\t\t!@#d'
		]), createBasicLinePreflightData(['//', 'rem', '!@#', '!@#']), 1, true, false, disposable.add(new TestLanguageConfigurationService()), 'plaintext');
		if (!r.supported) {
			throw new Error(`unexpected`);
		}

		assert.strictEqual(r.shouldRemoveComments, true);

		// Does not change `commentStr`
		assert.strictEqual(r.lines[0].commentStr, '//');
		assert.strictEqual(r.lines[1].commentStr, 'rem');
		assert.strictEqual(r.lines[2].commentStr, '!@#');
		assert.strictEqual(r.lines[3].commentStr, '!@#');

		// Fills in `isWhitespace`
		assert.strictEqual(r.lines[0].ignore, true);
		assert.strictEqual(r.lines[1].ignore, false);
		assert.strictEqual(r.lines[2].ignore, false);
		assert.strictEqual(r.lines[3].ignore, false);

		// Fills in `commentStrOffset`
		assert.strictEqual(r.lines[0].commentStrOffset, 2);
		assert.strictEqual(r.lines[1].commentStrOffset, 4);
		assert.strictEqual(r.lines[2].commentStrOffset, 4);
		assert.strictEqual(r.lines[3].commentStrOffset, 2);

		// Fills in `commentStrLength`
		assert.strictEqual(r.lines[0].commentStrLength, 2);
		assert.strictEqual(r.lines[1].commentStrLength, 4);
		assert.strictEqual(r.lines[2].commentStrLength, 4);
		assert.strictEqual(r.lines[3].commentStrLength, 3);

		disposable.dispose();
	});

	test('_normalizeInsertionPoint', () => {

		const runTest = (mixedArr: any[], tabSize: number, expected: number[], testName: string) => {
			const model = createSimpleModel(mixedArr.filter((item, idx) => idx % 2 === 0));
			const offsets = mixedArr.filter((item, idx) => idx % 2 === 1).map(offset => {
				return {
					commentStrOffset: offset,
					ignore: false
				};
			});
			LineCommentCommand._normalizeInsertionPoint(model, offsets, 1, tabSize);
			const actual = offsets.map(item => item.commentStrOffset);
			assert.deepStrictEqual(actual, expected, testName);
		};

		// Bug 16696:[comment] comments not aligned in this case
		runTest([
			'  XX', 2,
			'    YY', 4
		], 4, [0, 0], 'Bug 16696');

		runTest([
			'\t\t\tXX', 3,
			'    \tYY', 5,
			'        ZZ', 8,
			'\t\tTT', 2
		], 4, [2, 5, 8, 2], 'Test1');

		runTest([
			'\t\t\t   XX', 6,
			'    \t\t\t\tYY', 8,
			'        ZZ', 8,
			'\t\t    TT', 6
		], 4, [2, 5, 8, 2], 'Test2');

		runTest([
			'\t\t', 2,
			'\t\t\t', 3,
			'\t\t\t\t', 4,
			'\t\t\t', 3
		], 4, [2, 2, 2, 2], 'Test3');

		runTest([
			'\t\t', 2,
			'\t\t\t', 3,
			'\t\t\t\t', 4,
			'\t\t\t', 3,
			'    ', 4
		], 2, [2, 2, 2, 2, 4], 'Test4');

		runTest([
			'\t\t', 2,
			'\t\t\t', 3,
			'\t\t\t\t', 4,
			'\t\t\t', 3,
			'    ', 4
		], 4, [1, 1, 1, 1, 4], 'Test5');

		runTest([
			' \t', 2,
			'  \t', 3,
			'   \t', 4,
			'    ', 4,
			'\t', 1
		], 4, [2, 3, 4, 4, 1], 'Test6');

		runTest([
			' \t\t', 3,
			'  \t\t', 4,
			'   \t\t', 5,
			'    \t', 5,
			'\t', 1
		], 4, [2, 3, 4, 4, 1], 'Test7');

		runTest([
			'\t', 1,
			'    ', 4
		], 4, [1, 4], 'Test8:4');
		runTest([
			'\t', 1,
			'   ', 3
		], 4, [0, 0], 'Test8:3');
		runTest([
			'\t', 1,
			'  ', 2
		], 4, [0, 0], 'Test8:2');
		runTest([
			'\t', 1,
			' ', 1
		], 4, [0, 0], 'Test8:1');
		runTest([
			'\t', 1,
			'', 0
		], 4, [0, 0], 'Test8:0');
	});

	test('detects indentation', function () {
		testLineCommentCommand(
			[
				'\tsome text',
				'\tsome more text'
			],
			new Selection(2, 2, 1, 1),
			[
				'\t!@# some text',
				'\t!@# some more text'
			],
			new Selection(2, 2, 1, 1)
		);
	});

	test('detects mixed indentation', function () {
		testLineCommentCommand(
			[
				'\tsome text',
				'    some more text'
			],
			new Selection(2, 2, 1, 1),
			[
				'\t!@# some text',
				'    !@# some more text'
			],
			new Selection(2, 2, 1, 1)
		);
	});

	test('ignores whitespace lines', function () {
		testLineCommentCommand(
			[
				'\tsome text',
				'\t   ',
				'',
				'\tsome more text'
			],
			new Selection(4, 2, 1, 1),
			[
				'\t!@# some text',
				'\t   ',
				'',
				'\t!@# some more text'
			],
			new Selection(4, 2, 1, 1)
		);
	});

	test('removes its own', function () {
		testLineCommentCommand(
			[
				'\t!@# some text',
				'\t   ',
				'\t\t!@# some more text'
			],
			new Selection(3, 2, 1, 1),
			[
				'\tsome text',
				'\t   ',
				'\t\tsome more text'
			],
			new Selection(3, 2, 1, 1)
		);
	});

	test('works in only whitespace', function () {
		testLineCommentCommand(
			[
				'\t    ',
				'\t',
				'\t\tsome more text'
			],
			new Selection(3, 1, 1, 1),
			[
				'\t!@#     ',
				'\t!@# ',
				'\t\tsome more text'
			],
			new Selection(3, 1, 1, 1)
		);
	});

	test('bug 9697 - whitespace before comment token', function () {
		testLineCommentCommand(
			[
				'\t !@#first',
				'\tsecond line'
			],
			new Selection(1, 1, 1, 1),
			[
				'\t first',
				'\tsecond line'
			],
			new Selection(1, 1, 1, 1)
		);
	});

	test('bug 10162 - line comment before caret', function () {
		testLineCommentCommand(
			[
				'first!@#',
				'\tsecond line'
			],
			new Selection(1, 1, 1, 1),
			[
				'!@# first!@#',
				'\tsecond line'
			],
			new Selection(1, 5, 1, 5)
		);
	});

	test('comment single line - leading whitespace', function () {
		testLineCommentCommand(
			[
				'first!@#',
				'\tsecond line'
			],
			new Selection(2, 3, 2, 1),
			[
				'first!@#',
				'\t!@# second line'
			],
			new Selection(2, 7, 2, 1)
		);
	});

	test('ignores invisible selection', function () {
		testLineCommentCommand(
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 1, 1, 1),
			[
				'!@# first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 1, 1, 5)
		);
	});

	test('multiple lines', function () {
		testLineCommentCommand(
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 4, 1, 1),
			[
				'!@# first',
				'!@# \tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 8, 1, 5)
		);
	});

	test('multiple modes on multiple lines', function () {
		testLineCommentCommand(
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(4, 4, 3, 1),
			[
				'first',
				'\tsecond line',
				'!@# third line',
				'!@# fourth line',
				'fifth'
			],
			new Selection(4, 8, 3, 5)
		);
	});

	test('toggle single line', function () {
		testLineCommentCommand(
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 1, 1),
			[
				'!@# first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 5, 1, 5)
		);

		testLineCommentCommand(
			[
				'!@# first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 4, 1, 4),
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 1, 1)
		);
	});

	test('toggle multiple lines', function () {
		testLineCommentCommand(
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 4, 1, 1),
			[
				'!@# first',
				'!@# \tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 8, 1, 5)
		);

		testLineCommentCommand(
			[
				'!@# first',
				'!@# \tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 7, 1, 4),
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 3, 1, 1)
		);
	});

	test('issue #5964: Ctrl+/ to create comment when cursor is at the beginning of the line puts the cursor in a strange position', () => {
		testLineCommentCommand(
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 1, 1),
			[
				'!@# first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 5, 1, 5)
		);
	});

	test('issue #35673: Comment hotkeys throws the cursor before the comment', () => {
		testLineCommentCommand(
			[
				'first',
				'',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 1, 2, 1),
			[
				'first',
				'!@# ',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 5, 2, 5)
		);

		testLineCommentCommand(
			[
				'first',
				'\t',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 2, 2, 2),
			[
				'first',
				'\t!@# ',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 6, 2, 6)
		);
	});

	test('issue #2837 "Add Line Comment" fault when blank lines involved', function () {
		testAddLineCommentCommand(
			[
				'    if displayName == "":',
				'        displayName = groupName',
				'    description = getAttr(attributes, "description")',
				'    mailAddress = getAttr(attributes, "mail")',
				'',
				'    print "||Group name|%s|" % displayName',
				'    print "||Description|%s|" % description',
				'    print "||Email address|[mailto:%s]|" % mailAddress`',
			],
			new Selection(1, 1, 8, 56),
			[
				'    !@# if displayName == "":',
				'    !@#     displayName = groupName',
				'    !@# description = getAttr(attributes, "description")',
				'    !@# mailAddress = getAttr(attributes, "mail")',
				'',
				'    !@# print "||Group name|%s|" % displayName',
				'    !@# print "||Description|%s|" % description',
				'    !@# print "||Email address|[mailto:%s]|" % mailAddress`',
			],
			new Selection(1, 1, 8, 60)
		);
	});

	test('issue #47004: Toggle comments shouldn\'t move cursor', () => {
		testAddLineCommentCommand(
			[
				'    A line',
				'    Another line'
			],
			new Selection(2, 7, 1, 1),
			[
				'    !@# A line',
				'    !@# Another line'
			],
			new Selection(2, 11, 1, 1)
		);
	});

	test('insertSpace false', () => {
		const testLineCommentCommand = createTestCommandHelper(
			{ lineComment: '!@#' },
			(accessor, sel) => new LineCommentCommand(accessor.get(ILanguageConfigurationService), sel, 4, Type.Toggle, false, true)
		);

		testLineCommentCommand(
			[
				'some text'
			],
			new Selection(1, 1, 1, 1),
			[
				'!@#some text'
			],
			new Selection(1, 4, 1, 4)
		);
	});

	test('insertSpace false does not remove space', () => {
		const testLineCommentCommand = createTestCommandHelper(
			{ lineComment: '!@#' },
			(accessor, sel) => new LineCommentCommand(accessor.get(ILanguageConfigurationService), sel, 4, Type.Toggle, false, true)
		);

		testLineCommentCommand(
			[
				'!@#    some text'
			],
			new Selection(1, 1, 1, 1),
			[
				'    some text'
			],
			new Selection(1, 1, 1, 1)
		);
	});
});

suite('ignoreEmptyLines false', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const testLineCommentCommand = createTestCommandHelper(
		{ lineComment: '!@#', blockComment: ['<!@#', '#@!>'] },
		(accessor, sel) => new LineCommentCommand(accessor.get(ILanguageConfigurationService), sel, 4, Type.Toggle, true, false)
	);

	test('does not ignore whitespace lines', () => {
		testLineCommentCommand(
			[
				'\tsome text',
				'\t   ',
				'',
				'\tsome more text'
			],
			new Selection(4, 2, 1, 1),
			[
				'!@# \tsome text',
				'!@# \t   ',
				'!@# ',
				'!@# \tsome more text'
			],
			new Selection(4, 6, 1, 5)
		);
	});

	test('removes its own', function () {
		testLineCommentCommand(
			[
				'\t!@# some text',
				'\t   ',
				'\t\t!@# some more text'
			],
			new Selection(3, 2, 1, 1),
			[
				'\tsome text',
				'\t   ',
				'\t\tsome more text'
			],
			new Selection(3, 2, 1, 1)
		);
	});

	test('works in only whitespace', function () {
		testLineCommentCommand(
			[
				'\t    ',
				'\t',
				'\t\tsome more text'
			],
			new Selection(3, 1, 1, 1),
			[
				'\t!@#     ',
				'\t!@# ',
				'\t\tsome more text'
			],
			new Selection(3, 1, 1, 1)
		);
	});

	test('comments single line', function () {
		testLineCommentCommand(
			[
				'some text',
				'\tsome more text'
			],
			new Selection(1, 1, 1, 1),
			[
				'!@# some text',
				'\tsome more text'
			],
			new Selection(1, 5, 1, 5)
		);
	});

	test('detects indentation', function () {
		testLineCommentCommand(
			[
				'\tsome text',
				'\tsome more text'
			],
			new Selection(2, 2, 1, 1),
			[
				'\t!@# some text',
				'\t!@# some more text'
			],
			new Selection(2, 2, 1, 1)
		);
	});
});

suite('Editor Contrib - Line Comment As Block Comment', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const testLineCommentCommand = createTestCommandHelper(
		{ lineComment: '', blockComment: ['(', ')'] },
		(accessor, sel) => new LineCommentCommand(accessor.get(ILanguageConfigurationService), sel, 4, Type.Toggle, true, true)
	);

	test('fall back to block comment command', function () {
		testLineCommentCommand(
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 1, 1),
			[
				'( first )',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 3, 1, 3)
		);
	});

	test('fall back to block comment command - toggle', function () {
		testLineCommentCommand(
			[
				'(first)',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 7, 1, 2),
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 6, 1, 1)
		);
	});

	test('bug 9513 - expand single line to uncomment auto block', function () {
		testLineCommentCommand(
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 1, 1),
			[
				'( first )',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 3, 1, 3)
		);
	});

	test('bug 9691 - always expand selection to line boundaries', function () {
		testLineCommentCommand(
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(3, 2, 1, 3),
			[
				'( first',
				'\tsecond line',
				'third line )',
				'fourth line',
				'fifth'
			],
			new Selection(3, 2, 1, 5)
		);

		testLineCommentCommand(
			[
				'(first',
				'\tsecond line',
				'third line)',
				'fourth line',
				'fifth'
			],
			new Selection(3, 11, 1, 2),
			[
				'first',
				'\tsecond line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(3, 11, 1, 1)
		);
	});
});

suite('Editor Contrib - Line Comment As Block Comment 2', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const testLineCommentCommand = createTestCommandHelper(
		{ lineComment: null, blockComment: ['<!@#', '#@!>'] },
		(accessor, sel) => new LineCommentCommand(accessor.get(ILanguageConfigurationService), sel, 4, Type.Toggle, true, true)
	);

	test('no selection => uses indentation', function () {
		testLineCommentCommand(
			[
				'\t\tfirst\t    ',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\t<!@#fifth#@!>\t\t'
			],
			new Selection(1, 1, 1, 1),
			[
				'\t\t<!@# first\t     #@!>',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\t<!@#fifth#@!>\t\t'
			],
			new Selection(1, 1, 1, 1)
		);

		testLineCommentCommand(
			[
				'\t\t<!@#first\t    #@!>',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\t<!@#fifth#@!>\t\t'
			],
			new Selection(1, 1, 1, 1),
			[
				'\t\tfirst\t   ',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\t<!@#fifth#@!>\t\t'
			],
			new Selection(1, 1, 1, 1)
		);
	});

	test('can remove', function () {
		testLineCommentCommand(
			[
				'\t\tfirst\t    ',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\t<!@#fifth#@!>\t\t'
			],
			new Selection(5, 1, 5, 1),
			[
				'\t\tfirst\t    ',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\tfifth\t\t'
			],
			new Selection(5, 1, 5, 1)
		);

		testLineCommentCommand(
			[
				'\t\tfirst\t    ',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\t<!@#fifth#@!>\t\t'
			],
			new Selection(5, 3, 5, 3),
			[
				'\t\tfirst\t    ',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\tfifth\t\t'
			],
			new Selection(5, 3, 5, 3)
		);

		testLineCommentCommand(
			[
				'\t\tfirst\t    ',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\t<!@#fifth#@!>\t\t'
			],
			new Selection(5, 4, 5, 4),
			[
				'\t\tfirst\t    ',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\tfifth\t\t'
			],
			new Selection(5, 3, 5, 3)
		);

		testLineCommentCommand(
			[
				'\t\tfirst\t    ',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\t<!@#fifth#@!>\t\t'
			],
			new Selection(5, 16, 5, 3),
			[
				'\t\tfirst\t    ',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\tfifth\t\t'
			],
			new Selection(5, 8, 5, 3)
		);

		testLineCommentCommand(
			[
				'\t\tfirst\t    ',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\t<!@#fifth#@!>\t\t'
			],
			new Selection(5, 12, 5, 7),
			[
				'\t\tfirst\t    ',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\tfifth\t\t'
			],
			new Selection(5, 8, 5, 3)
		);

		testLineCommentCommand(
			[
				'\t\tfirst\t    ',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\t<!@#fifth#@!>\t\t'
			],
			new Selection(5, 18, 5, 18),
			[
				'\t\tfirst\t    ',
				'\t\tsecond line',
				'\tthird line',
				'fourth line',
				'\t\tfifth\t\t'
			],
			new Selection(5, 10, 5, 10)
		);
	});

	test('issue #993: Remove comment does not work consistently in HTML', () => {
		testLineCommentCommand(
			[
				'     asd qwe',
				'     asd qwe',
				''
			],
			new Selection(1, 1, 3, 1),
			[
				'     <!@# asd qwe',
				'     asd qwe #@!>',
				''
			],
			new Selection(1, 1, 3, 1)
		);

		testLineCommentCommand(
			[
				'     <!@#asd qwe',
				'     asd qwe#@!>',
				''
			],
			new Selection(1, 1, 3, 1),
			[
				'     asd qwe',
				'     asd qwe',
				''
			],
			new Selection(1, 1, 3, 1)
		);
	});
});

suite('Editor Contrib - Line Comment in mixed modes', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const OUTER_LANGUAGE_ID = 'outerMode';
	const INNER_LANGUAGE_ID = 'innerMode';

	class OuterMode extends Disposable {
		private readonly languageId = OUTER_LANGUAGE_ID;
		constructor(
			commentsConfig: CommentRule,
			@ILanguageService languageService: ILanguageService,
			@ILanguageConfigurationService languageConfigurationService: ILanguageConfigurationService
		) {
			super();
			this._register(languageService.registerLanguage({ id: this.languageId }));
			this._register(languageConfigurationService.register(this.languageId, {
				comments: commentsConfig
			}));

			this._register(TokenizationRegistry.register(this.languageId, {
				getInitialState: (): IState => NullState,
				tokenize: () => {
					throw new Error('not implemented');
				},
				tokenizeEncoded: (line: string, hasEOL: boolean, state: IState): EncodedTokenizationResult => {
					const languageId = (/^  /.test(line) ? INNER_LANGUAGE_ID : OUTER_LANGUAGE_ID);
					const encodedLanguageId = languageService.languageIdCodec.encodeLanguageId(languageId);

					const tokens = new Uint32Array(1 << 1);
					tokens[(0 << 1)] = 0;
					tokens[(0 << 1) + 1] = (
						(ColorId.DefaultForeground << MetadataConsts.FOREGROUND_OFFSET)
						| (encodedLanguageId << MetadataConsts.LANGUAGEID_OFFSET)
					);
					return new EncodedTokenizationResult(tokens, [], state);
				}
			}));
		}
	}

	class InnerMode extends Disposable {
		private readonly languageId = INNER_LANGUAGE_ID;
		constructor(
			commentsConfig: CommentRule,
			@ILanguageService languageService: ILanguageService,
			@ILanguageConfigurationService languageConfigurationService: ILanguageConfigurationService
		) {
			super();
			this._register(languageService.registerLanguage({ id: this.languageId }));
			this._register(languageConfigurationService.register(this.languageId, {
				comments: commentsConfig
			}));
		}
	}

	function testLineCommentCommand(lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection): void {

		const setup = (accessor: ServicesAccessor, disposables: DisposableStore) => {
			const instantiationService = accessor.get(IInstantiationService);
			disposables.add(instantiationService.createInstance(OuterMode, { lineComment: '//', blockComment: ['/*', '*/'] }));
			disposables.add(instantiationService.createInstance(InnerMode, { lineComment: null, blockComment: ['{/*', '*/}'] }));
		};

		testCommand(
			lines,
			OUTER_LANGUAGE_ID,
			selection,
			(accessor, sel) => new LineCommentCommand(accessor.get(ILanguageConfigurationService), sel, 4, Type.Toggle, true, true),
			expectedLines,
			expectedSelection,
			true,
			setup
		);
	}

	test('issue #24047 (part 1): Commenting code in JSX files', () => {
		testLineCommentCommand(
			[
				'import React from \'react\';',
				'const Loader = () => (',
				'  <div>',
				'    Loading...',
				'  </div>',
				');',
				'export default Loader;'
			],
			new Selection(1, 1, 7, 22),
			[
				'// import React from \'react\';',
				'// const Loader = () => (',
				'//   <div>',
				'//     Loading...',
				'//   </div>',
				'// );',
				'// export default Loader;'
			],
			new Selection(1, 4, 7, 25),
		);
	});

	test('issue #24047 (part 2): Commenting code in JSX files', () => {
		testLineCommentCommand(
			[
				'import React from \'react\';',
				'const Loader = () => (',
				'  <div>',
				'    Loading...',
				'  </div>',
				');',
				'export default Loader;'
			],
			new Selection(3, 4, 3, 4),
			[
				'import React from \'react\';',
				'const Loader = () => (',
				'  {/* <div> */}',
				'    Loading...',
				'  </div>',
				');',
				'export default Loader;'
			],
			new Selection(3, 8, 3, 8),
		);
	});

	test('issue #36173: Commenting code in JSX tag body', () => {
		testLineCommentCommand(
			[
				'<div>',
				'  {123}',
				'</div>',
			],
			new Selection(2, 4, 2, 4),
			[
				'<div>',
				'  {/* {123} */}',
				'</div>',
			],
			new Selection(2, 8, 2, 8),
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/contextmenu/browser/contextmenu.ts]---
Location: vscode-main/src/vs/editor/contrib/contextmenu/browser/contextmenu.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { IKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { IMouseEvent, IMouseWheelEvent } from '../../../../base/browser/mouseEvent.js';
import { ActionViewItem } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { IAnchor } from '../../../../base/browser/ui/contextview/contextview.js';
import { IAction, Separator, SubmenuAction } from '../../../../base/common/actions.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { ResolvedKeybinding } from '../../../../base/common/keybindings.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { isIOS } from '../../../../base/common/platform.js';
import { ICodeEditor, IEditorMouseEvent, MouseTargetType } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorContributionInstantiation, registerEditorAction, registerEditorContribution, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IEditorContribution, ScrollType } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ITextModel } from '../../../common/model.js';
import * as nls from '../../../../nls.js';
import { IMenuService, MenuId, SubmenuItemAction } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService, IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IWorkspaceContextService, isStandaloneEditorWorkspace } from '../../../../platform/workspace/common/workspace.js';

export class ContextMenuController implements IEditorContribution {

	public static readonly ID = 'editor.contrib.contextmenu';

	public static get(editor: ICodeEditor): ContextMenuController | null {
		return editor.getContribution<ContextMenuController>(ContextMenuController.ID);
	}

	private readonly _toDispose = new DisposableStore();
	private _contextMenuIsBeingShownCount: number = 0;
	private readonly _editor: ICodeEditor;

	constructor(
		editor: ICodeEditor,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@IContextViewService private readonly _contextViewService: IContextViewService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IMenuService private readonly _menuService: IMenuService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService,
	) {
		this._editor = editor;

		this._toDispose.add(this._editor.onContextMenu((e: IEditorMouseEvent) => this._onContextMenu(e)));
		this._toDispose.add(this._editor.onMouseWheel((e: IMouseWheelEvent) => {
			if (this._contextMenuIsBeingShownCount > 0) {
				const view = this._contextViewService.getContextViewElement();
				const target = e.srcElement as HTMLElement;

				// Event triggers on shadow root host first
				// Check if the context view is under this host before hiding it #103169
				if (!(target.shadowRoot && dom.getShadowRoot(view) === target.shadowRoot)) {
					this._contextViewService.hideContextView();
				}
			}
		}));
		this._toDispose.add(this._editor.onKeyDown((e: IKeyboardEvent) => {
			if (!this._editor.getOption(EditorOption.contextmenu)) {
				return; // Context menu is turned off through configuration
			}
			if (e.keyCode === KeyCode.ContextMenu) {
				// Chrome is funny like that
				e.preventDefault();
				e.stopPropagation();
				this.showContextMenu();
			}
		}));
	}

	private _onContextMenu(e: IEditorMouseEvent): void {
		if (!this._editor.hasModel()) {
			return;
		}

		if (!this._editor.getOption(EditorOption.contextmenu)) {
			this._editor.focus();
			// Ensure the cursor is at the position of the mouse click
			if (e.target.position && !this._editor.getSelection().containsPosition(e.target.position)) {
				this._editor.setPosition(e.target.position);
			}
			return; // Context menu is turned off through configuration
		}

		if (e.target.type === MouseTargetType.OVERLAY_WIDGET) {
			return; // allow native menu on widgets to support right click on input field for example in find
		}
		if (e.target.type === MouseTargetType.CONTENT_TEXT && e.target.detail.injectedText) {
			return; // allow native menu on injected text
		}

		e.event.preventDefault();
		e.event.stopPropagation();

		if (e.target.type === MouseTargetType.SCROLLBAR) {
			return this._showScrollbarContextMenu(e.event);
		}

		if (e.target.type !== MouseTargetType.CONTENT_TEXT && e.target.type !== MouseTargetType.CONTENT_EMPTY && e.target.type !== MouseTargetType.TEXTAREA) {
			return; // only support mouse click into text or native context menu key for now
		}

		// Ensure the editor gets focus if it hasn't, so the right events are being sent to other contributions
		this._editor.focus();

		// Ensure the cursor is at the position of the mouse click
		if (e.target.position) {
			let hasSelectionAtPosition = false;
			for (const selection of this._editor.getSelections()) {
				if (selection.containsPosition(e.target.position)) {
					hasSelectionAtPosition = true;
					break;
				}
			}

			if (!hasSelectionAtPosition) {
				this._editor.setPosition(e.target.position);
			}
		}

		// Unless the user triggerd the context menu through Shift+F10, use the mouse position as menu position
		let anchor: IMouseEvent | null = null;
		if (e.target.type !== MouseTargetType.TEXTAREA) {
			anchor = e.event;
		}

		// Show the context menu
		this.showContextMenu(anchor);
	}

	public showContextMenu(anchor?: IMouseEvent | null): void {
		if (!this._editor.getOption(EditorOption.contextmenu)) {
			return; // Context menu is turned off through configuration
		}
		if (!this._editor.hasModel()) {
			return;
		}

		// Find actions available for menu
		const menuActions = this._getMenuActions(this._editor.getModel(),
			this._editor.contextMenuId);

		// Show menu if we have actions to show
		if (menuActions.length > 0) {
			this._doShowContextMenu(menuActions, anchor);
		}
	}

	private _getMenuActions(model: ITextModel, menuId: MenuId): IAction[] {
		const result: IAction[] = [];

		// get menu groups
		const groups = this._menuService.getMenuActions(menuId, this._contextKeyService, { arg: model.uri });

		// translate them into other actions
		for (const group of groups) {
			const [, actions] = group;
			let addedItems = 0;
			for (const action of actions) {
				if (action instanceof SubmenuItemAction) {
					const subActions = this._getMenuActions(model, action.item.submenu);
					if (subActions.length > 0) {
						result.push(new SubmenuAction(action.id, action.label, subActions));
						addedItems++;
					}
				} else {
					result.push(action);
					addedItems++;
				}
			}

			if (addedItems) {
				result.push(new Separator());
			}
		}

		if (result.length) {
			result.pop(); // remove last separator
		}

		return result;
	}

	private _doShowContextMenu(actions: IAction[], event: IMouseEvent | null = null): void {
		if (!this._editor.hasModel()) {
			return;
		}

		let anchor: IMouseEvent | IAnchor | null = event;
		if (!anchor) {
			// Ensure selection is visible
			this._editor.revealPosition(this._editor.getPosition(), ScrollType.Immediate);

			this._editor.render();
			const cursorCoords = this._editor.getScrolledVisiblePosition(this._editor.getPosition());

			// Translate to absolute editor position
			const editorCoords = dom.getDomNodePagePosition(this._editor.getDomNode());
			const posx = editorCoords.left + cursorCoords.left;
			const posy = editorCoords.top + cursorCoords.top + cursorCoords.height;

			anchor = { x: posx, y: posy };
		}

		const useShadowDOM = this._editor.getOption(EditorOption.useShadowDOM) && !isIOS; // Do not use shadow dom on IOS #122035

		// Show menu
		this._contextMenuIsBeingShownCount++;
		this._contextMenuService.showContextMenu({
			domForShadowRoot: useShadowDOM ? this._editor.getOverflowWidgetsDomNode() ?? this._editor.getDomNode() : undefined,

			getAnchor: () => anchor,

			getActions: () => actions,

			getActionViewItem: (action) => {
				const keybinding = this._keybindingFor(action);
				if (keybinding) {
					return new ActionViewItem(action, action, { label: true, keybinding: keybinding.getLabel(), isMenu: true });
				}

				const customAction = action as IAction & { getActionViewItem?: () => ActionViewItem };
				if (typeof customAction.getActionViewItem === 'function') {
					return customAction.getActionViewItem();
				}

				return new ActionViewItem(action, action, { icon: true, label: true, isMenu: true });
			},

			getKeyBinding: (action): ResolvedKeybinding | undefined => {
				return this._keybindingFor(action);
			},

			onHide: (wasCancelled: boolean) => {
				this._contextMenuIsBeingShownCount--;
			}
		});
	}

	private _showScrollbarContextMenu(anchor: IMouseEvent): void {
		if (!this._editor.hasModel()) {
			return;
		}

		if (isStandaloneEditorWorkspace(this._workspaceContextService.getWorkspace())) {
			// can't update the configuration properly in the standalone editor
			return;
		}

		const minimapOptions = this._editor.getOption(EditorOption.minimap);

		let lastId = 0;
		const createAction = (opts: { label: string; enabled?: boolean; checked?: boolean; run: () => void }): IAction => {
			return {
				id: `menu-action-${++lastId}`,
				label: opts.label,
				tooltip: '',
				class: undefined,
				enabled: (typeof opts.enabled === 'undefined' ? true : opts.enabled),
				checked: opts.checked,
				run: opts.run
			};
		};
		const createSubmenuAction = (label: string, actions: IAction[]): SubmenuAction => {
			return new SubmenuAction(
				`menu-action-${++lastId}`,
				label,
				actions,
				undefined
			);
		};
		const createEnumAction = <T>(label: string, enabled: boolean, configName: string, configuredValue: T, options: { label: string; value: T }[]): IAction => {
			if (!enabled) {
				return createAction({ label, enabled, run: () => { } });
			}
			const createRunner = (value: T) => {
				return () => {
					this._configurationService.updateValue(configName, value);
				};
			};
			const actions: IAction[] = [];
			for (const option of options) {
				actions.push(createAction({
					label: option.label,
					checked: configuredValue === option.value,
					run: createRunner(option.value)
				}));
			}
			return createSubmenuAction(
				label,
				actions
			);
		};

		const actions: IAction[] = [];
		actions.push(createAction({
			label: nls.localize('context.minimap.minimap', "Minimap"),
			checked: minimapOptions.enabled,
			run: () => {
				this._configurationService.updateValue(`editor.minimap.enabled`, !minimapOptions.enabled);
			}
		}));
		actions.push(new Separator());
		actions.push(createAction({
			label: nls.localize('context.minimap.renderCharacters', "Render Characters"),
			enabled: minimapOptions.enabled,
			checked: minimapOptions.renderCharacters,
			run: () => {
				this._configurationService.updateValue(`editor.minimap.renderCharacters`, !minimapOptions.renderCharacters);
			}
		}));
		actions.push(createEnumAction<'proportional' | 'fill' | 'fit'>(
			nls.localize('context.minimap.size', "Vertical size"),
			minimapOptions.enabled,
			'editor.minimap.size',
			minimapOptions.size,
			[{
				label: nls.localize('context.minimap.size.proportional', "Proportional"),
				value: 'proportional'
			}, {
				label: nls.localize('context.minimap.size.fill', "Fill"),
				value: 'fill'
			}, {
				label: nls.localize('context.minimap.size.fit', "Fit"),
				value: 'fit'
			}]
		));
		actions.push(createEnumAction<'always' | 'mouseover'>(
			nls.localize('context.minimap.slider', "Slider"),
			minimapOptions.enabled,
			'editor.minimap.showSlider',
			minimapOptions.showSlider,
			[{
				label: nls.localize('context.minimap.slider.mouseover', "Mouse Over"),
				value: 'mouseover'
			}, {
				label: nls.localize('context.minimap.slider.always', "Always"),
				value: 'always'
			}]
		));

		const useShadowDOM = this._editor.getOption(EditorOption.useShadowDOM) && !isIOS; // Do not use shadow dom on IOS #122035
		this._contextMenuIsBeingShownCount++;
		this._contextMenuService.showContextMenu({
			domForShadowRoot: useShadowDOM ? this._editor.getDomNode() : undefined,
			getAnchor: () => anchor,
			getActions: () => actions,
			onHide: (wasCancelled: boolean) => {
				this._contextMenuIsBeingShownCount--;
				this._editor.focus();
			}
		});
	}

	private _keybindingFor(action: IAction): ResolvedKeybinding | undefined {
		return this._keybindingService.lookupKeybinding(action.id);
	}

	public dispose(): void {
		if (this._contextMenuIsBeingShownCount > 0) {
			this._contextViewService.hideContextView();
		}

		this._toDispose.dispose();
	}
}

class ShowContextMenu extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.showContextMenu',
			label: nls.localize2('action.showContextMenu.label', "Show Editor Context Menu"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: KeyMod.Shift | KeyCode.F10,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		ContextMenuController.get(editor)?.showContextMenu();
	}
}

registerEditorContribution(ContextMenuController.ID, ContextMenuController, EditorContributionInstantiation.BeforeFirstInteraction);
registerEditorAction(ShowContextMenu);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/cursorUndo/browser/cursorUndo.ts]---
Location: vscode-main/src/vs/editor/contrib/cursorUndo/browser/cursorUndo.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorContributionInstantiation, registerEditorAction, registerEditorContribution, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { Selection } from '../../../common/core/selection.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import * as nls from '../../../../nls.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';

class CursorState {
	readonly selections: readonly Selection[];

	constructor(selections: readonly Selection[]) {
		this.selections = selections;
	}

	public equals(other: CursorState): boolean {
		const thisLen = this.selections.length;
		const otherLen = other.selections.length;
		if (thisLen !== otherLen) {
			return false;
		}
		for (let i = 0; i < thisLen; i++) {
			if (!this.selections[i].equalsSelection(other.selections[i])) {
				return false;
			}
		}
		return true;
	}
}

class StackElement {
	constructor(
		public readonly cursorState: CursorState,
		public readonly scrollTop: number,
		public readonly scrollLeft: number
	) { }
}

export class CursorUndoRedoController extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.cursorUndoRedoController';

	public static get(editor: ICodeEditor): CursorUndoRedoController | null {
		return editor.getContribution<CursorUndoRedoController>(CursorUndoRedoController.ID);
	}

	private readonly _editor: ICodeEditor;
	private _isCursorUndoRedo: boolean;

	private _undoStack: StackElement[];
	private _redoStack: StackElement[];

	constructor(editor: ICodeEditor) {
		super();
		this._editor = editor;
		this._isCursorUndoRedo = false;

		this._undoStack = [];
		this._redoStack = [];

		this._register(editor.onDidChangeModel((e) => {
			this._undoStack = [];
			this._redoStack = [];
		}));
		this._register(editor.onDidChangeModelContent((e) => {
			this._undoStack = [];
			this._redoStack = [];
		}));
		this._register(editor.onDidChangeCursorSelection((e) => {
			if (this._isCursorUndoRedo) {
				return;
			}
			if (!e.oldSelections) {
				return;
			}
			if (e.oldModelVersionId !== e.modelVersionId) {
				return;
			}
			const prevState = new CursorState(e.oldSelections);
			const isEqualToLastUndoStack = (this._undoStack.length > 0 && this._undoStack[this._undoStack.length - 1].cursorState.equals(prevState));
			if (!isEqualToLastUndoStack) {
				this._undoStack.push(new StackElement(prevState, editor.getScrollTop(), editor.getScrollLeft()));
				this._redoStack = [];
				if (this._undoStack.length > 50) {
					// keep the cursor undo stack bounded
					this._undoStack.shift();
				}
			}
		}));
	}

	public cursorUndo(): void {
		if (!this._editor.hasModel() || this._undoStack.length === 0) {
			return;
		}

		this._redoStack.push(new StackElement(new CursorState(this._editor.getSelections()), this._editor.getScrollTop(), this._editor.getScrollLeft()));
		this._applyState(this._undoStack.pop()!);
	}

	public cursorRedo(): void {
		if (!this._editor.hasModel() || this._redoStack.length === 0) {
			return;
		}

		this._undoStack.push(new StackElement(new CursorState(this._editor.getSelections()), this._editor.getScrollTop(), this._editor.getScrollLeft()));
		this._applyState(this._redoStack.pop()!);
	}

	private _applyState(stackElement: StackElement): void {
		this._isCursorUndoRedo = true;
		this._editor.setSelections(stackElement.cursorState.selections);
		this._editor.setScrollPosition({
			scrollTop: stackElement.scrollTop,
			scrollLeft: stackElement.scrollLeft
		});
		this._isCursorUndoRedo = false;
	}
}

export class CursorUndo extends EditorAction {
	constructor() {
		super({
			id: 'cursorUndo',
			label: nls.localize2('cursor.undo', "Cursor Undo"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: KeyMod.CtrlCmd | KeyCode.KeyU,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void {
		CursorUndoRedoController.get(editor)?.cursorUndo();
	}
}

export class CursorRedo extends EditorAction {
	constructor() {
		super({
			id: 'cursorRedo',
			label: nls.localize2('cursor.redo', "Cursor Redo"),
			precondition: undefined
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void {
		CursorUndoRedoController.get(editor)?.cursorRedo();
	}
}

registerEditorContribution(CursorUndoRedoController.ID, CursorUndoRedoController, EditorContributionInstantiation.Eager); // eager because it needs to listen to record cursor state ASAP
registerEditorAction(CursorUndo);
registerEditorAction(CursorRedo);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/cursorUndo/test/browser/cursorUndo.test.ts]---
Location: vscode-main/src/vs/editor/contrib/cursorUndo/test/browser/cursorUndo.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { CoreEditingCommands, CoreNavigationCommands } from '../../../../browser/coreCommands.js';
import { Selection } from '../../../../common/core/selection.js';
import { Handler } from '../../../../common/editorCommon.js';
import { CursorUndo, CursorUndoRedoController } from '../../browser/cursorUndo.js';
import { withTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';

suite('FindController', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const cursorUndoAction = new CursorUndo();

	test('issue #82535: Edge case with cursorUndo', () => {
		withTestCodeEditor('', {}, (editor) => {

			editor.registerAndInstantiateContribution(CursorUndoRedoController.ID, CursorUndoRedoController);

			// type hello
			editor.trigger('test', Handler.Type, { text: 'hello' });

			// press left
			editor.runCommand(CoreNavigationCommands.CursorLeft, {});

			// press Delete
			editor.runCommand(CoreEditingCommands.DeleteRight, {});
			assert.deepStrictEqual(editor.getValue(), 'hell');
			assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 5, 1, 5)]);

			// press left
			editor.runCommand(CoreNavigationCommands.CursorLeft, {});
			assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 4, 1, 4)]);

			// press Ctrl+U
			cursorUndoAction.run(null!, editor, {});
			assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 5, 1, 5)]);
		});
	});

	test('issue #82535: Edge case with cursorUndo (reverse)', () => {
		withTestCodeEditor('', {}, (editor) => {

			editor.registerAndInstantiateContribution(CursorUndoRedoController.ID, CursorUndoRedoController);

			// type hello
			editor.trigger('test', Handler.Type, { text: 'hell' });
			editor.trigger('test', Handler.Type, { text: 'o' });
			assert.deepStrictEqual(editor.getValue(), 'hello');
			assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 6, 1, 6)]);

			// press Ctrl+U
			cursorUndoAction.run(null!, editor, {});
			assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 6, 1, 6)]);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/diffEditorBreadcrumbs/browser/contribution.ts]---
Location: vscode-main/src/vs/editor/contrib/diffEditorBreadcrumbs/browser/contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { reverseOrder, compareBy, numberComparator } from '../../../../base/common/arrays.js';
import { observableValue, observableSignalFromEvent, autorunWithStore, IReader } from '../../../../base/common/observable.js';
import { HideUnchangedRegionsFeature, IDiffEditorBreadcrumbsSource } from '../../../browser/widget/diffEditor/features/hideUnchangedRegionsFeature.js';
import { DisposableCancellationTokenSource } from '../../../browser/widget/diffEditor/utils.js';
import { LineRange } from '../../../common/core/ranges/lineRange.js';
import { ITextModel } from '../../../common/model.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { IOutlineModelService, OutlineModel } from '../../documentSymbols/browser/outlineModel.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Event } from '../../../../base/common/event.js';
import { SymbolKind } from '../../../common/languages.js';

class DiffEditorBreadcrumbsSource extends Disposable implements IDiffEditorBreadcrumbsSource {
	private readonly _currentModel = observableValue<OutlineModel | undefined>(this, undefined);

	constructor(
		private readonly _textModel: ITextModel,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@IOutlineModelService private readonly _outlineModelService: IOutlineModelService,
	) {
		super();

		const documentSymbolProviderChanged = observableSignalFromEvent(
			'documentSymbolProvider.onDidChange',
			this._languageFeaturesService.documentSymbolProvider.onDidChange
		);

		const textModelChanged = observableSignalFromEvent(
			'_textModel.onDidChangeContent',
			Event.debounce<any>(e => this._textModel.onDidChangeContent(e), () => undefined, 100)
		);

		this._register(autorunWithStore(async (reader, store) => {
			documentSymbolProviderChanged.read(reader);
			textModelChanged.read(reader);

			const src = store.add(new DisposableCancellationTokenSource());
			const model = await this._outlineModelService.getOrCreate(this._textModel, src.token);
			if (store.isDisposed) { return; }

			this._currentModel.set(model, undefined);
		}));
	}

	public getBreadcrumbItems(startRange: LineRange, reader: IReader): { name: string; kind: SymbolKind; startLineNumber: number }[] {
		const m = this._currentModel.read(reader);
		if (!m) { return []; }
		const symbols = m.asListOfDocumentSymbols()
			.filter(s => startRange.contains(s.range.startLineNumber) && !startRange.contains(s.range.endLineNumber));
		symbols.sort(reverseOrder(compareBy(s => s.range.endLineNumber - s.range.startLineNumber, numberComparator)));
		return symbols.map(s => ({ name: s.name, kind: s.kind, startLineNumber: s.range.startLineNumber }));
	}

	public getAt(lineNumber: number, reader: IReader): { name: string; kind: SymbolKind; startLineNumber: number }[] {
		const m = this._currentModel.read(reader);
		if (!m) { return []; }
		const symbols = m.asListOfDocumentSymbols()
			.filter(s => new LineRange(s.range.startLineNumber, s.range.endLineNumber).contains(lineNumber));
		if (symbols.length === 0) { return []; }
		symbols.sort(reverseOrder(compareBy(s => s.range.endLineNumber - s.range.startLineNumber, numberComparator)));

		return symbols.map(s => ({ name: s.name, kind: s.kind, startLineNumber: s.range.startLineNumber }));
	}
}

HideUnchangedRegionsFeature.setBreadcrumbsSourceFactory((textModel, instantiationService) => {
	return instantiationService.createInstance(DiffEditorBreadcrumbsSource, textModel);
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/dnd/browser/dnd.css]---
Location: vscode-main/src/vs/editor/contrib/dnd/browser/dnd.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor.vs .dnd-target,
.monaco-editor.hc-light .dnd-target {
	border-right: 2px dotted black;
	color: white; /* opposite of black */
}
.monaco-editor.vs-dark .dnd-target {
	border-right: 2px dotted #AEAFAD;
	color: #51504f; /* opposite of #AEAFAD */
}
.monaco-editor.hc-black .dnd-target {
	border-right: 2px dotted #fff;
	color: #000; /* opposite of #fff */
}

.monaco-editor.mouse-default .view-lines,
.monaco-editor.vs-dark.mac.mouse-default .view-lines,
.monaco-editor.hc-black.mac.mouse-default .view-lines,
.monaco-editor.hc-light.mac.mouse-default .view-lines {
	cursor: default;
}
.monaco-editor.mouse-copy .view-lines,
.monaco-editor.vs-dark.mac.mouse-copy .view-lines,
.monaco-editor.hc-black.mac.mouse-copy .view-lines,
.monaco-editor.hc-light.mac.mouse-copy .view-lines {
	cursor: copy;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/dnd/browser/dnd.ts]---
Location: vscode-main/src/vs/editor/contrib/dnd/browser/dnd.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { IMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import './dnd.css';
import { ICodeEditor, IEditorMouseEvent, IMouseTarget, IPartialEditorMouseEvent, MouseTargetType } from '../../../browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { CodeEditorWidget } from '../../../browser/widget/codeEditor/codeEditorWidget.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { CursorChangeReason } from '../../../common/cursorEvents.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { IEditorContribution, IEditorDecorationsCollection, ScrollType } from '../../../common/editorCommon.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { DragAndDropCommand } from './dragAndDropCommand.js';

function hasTriggerModifier(e: IKeyboardEvent | IMouseEvent): boolean {
	if (isMacintosh) {
		return e.altKey;
	} else {
		return e.ctrlKey;
	}
}

export class DragAndDropController extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.dragAndDrop';

	private readonly _editor: ICodeEditor;
	private _dragSelection: Selection | null;
	private readonly _dndDecorationIds: IEditorDecorationsCollection;
	private _mouseDown: boolean;
	private _modifierPressed: boolean;
	static readonly TRIGGER_KEY_VALUE = isMacintosh ? KeyCode.Alt : KeyCode.Ctrl;

	static get(editor: ICodeEditor): DragAndDropController | null {
		return editor.getContribution<DragAndDropController>(DragAndDropController.ID);
	}

	constructor(editor: ICodeEditor) {
		super();
		this._editor = editor;
		this._dndDecorationIds = this._editor.createDecorationsCollection();
		this._register(this._editor.onMouseDown((e: IEditorMouseEvent) => this._onEditorMouseDown(e)));
		this._register(this._editor.onMouseUp((e: IEditorMouseEvent) => this._onEditorMouseUp(e)));
		this._register(this._editor.onMouseDrag((e: IEditorMouseEvent) => this._onEditorMouseDrag(e)));
		this._register(this._editor.onMouseDrop((e: IPartialEditorMouseEvent) => this._onEditorMouseDrop(e)));
		this._register(this._editor.onMouseDropCanceled(() => this._onEditorMouseDropCanceled()));
		this._register(this._editor.onKeyDown((e: IKeyboardEvent) => this.onEditorKeyDown(e)));
		this._register(this._editor.onKeyUp((e: IKeyboardEvent) => this.onEditorKeyUp(e)));
		this._register(this._editor.onDidBlurEditorWidget(() => this.onEditorBlur()));
		this._register(this._editor.onDidBlurEditorText(() => this.onEditorBlur()));
		this._mouseDown = false;
		this._modifierPressed = false;
		this._dragSelection = null;
	}

	private onEditorBlur() {
		this._removeDecoration();
		this._dragSelection = null;
		this._mouseDown = false;
		this._modifierPressed = false;
	}

	private onEditorKeyDown(e: IKeyboardEvent): void {
		if (!this._editor.getOption(EditorOption.dragAndDrop) || this._editor.getOption(EditorOption.columnSelection)) {
			return;
		}

		if (hasTriggerModifier(e)) {
			this._modifierPressed = true;
		}

		if (this._mouseDown && hasTriggerModifier(e)) {
			this._editor.updateOptions({
				mouseStyle: 'copy'
			});
		}
	}

	private onEditorKeyUp(e: IKeyboardEvent): void {
		if (!this._editor.getOption(EditorOption.dragAndDrop) || this._editor.getOption(EditorOption.columnSelection)) {
			return;
		}

		if (hasTriggerModifier(e)) {
			this._modifierPressed = false;
		}

		if (this._mouseDown && e.keyCode === DragAndDropController.TRIGGER_KEY_VALUE) {
			this._editor.updateOptions({
				mouseStyle: 'default'
			});
		}
	}

	private _onEditorMouseDown(mouseEvent: IEditorMouseEvent): void {
		this._mouseDown = true;
	}

	private _onEditorMouseUp(mouseEvent: IEditorMouseEvent): void {
		this._mouseDown = false;
		// Whenever users release the mouse, the drag and drop operation should finish and the cursor should revert to text.
		this._editor.updateOptions({
			mouseStyle: 'text'
		});
	}

	private _onEditorMouseDrag(mouseEvent: IEditorMouseEvent): void {
		const target = mouseEvent.target;

		if (this._dragSelection === null) {
			const selections = this._editor.getSelections() || [];
			const possibleSelections = selections.filter(selection => target.position && selection.containsPosition(target.position));
			if (possibleSelections.length === 1) {
				this._dragSelection = possibleSelections[0];
			} else {
				return;
			}
		}

		if (hasTriggerModifier(mouseEvent.event)) {
			this._editor.updateOptions({
				mouseStyle: 'copy'
			});
		} else {
			this._editor.updateOptions({
				mouseStyle: 'default'
			});
		}

		if (target.position) {
			if (this._dragSelection.containsPosition(target.position)) {
				this._removeDecoration();
			} else {
				this.showAt(target.position);
			}
		}
	}

	private _onEditorMouseDropCanceled() {
		this._editor.updateOptions({
			mouseStyle: 'text'
		});

		this._removeDecoration();
		this._dragSelection = null;
		this._mouseDown = false;
	}

	private _onEditorMouseDrop(mouseEvent: IPartialEditorMouseEvent): void {
		if (mouseEvent.target && (this._hitContent(mouseEvent.target) || this._hitMargin(mouseEvent.target)) && mouseEvent.target.position) {
			const newCursorPosition = new Position(mouseEvent.target.position.lineNumber, mouseEvent.target.position.column);

			if (this._dragSelection === null) {
				let newSelections: Selection[] | null = null;
				if (mouseEvent.event.shiftKey) {
					const primarySelection = this._editor.getSelection();
					if (primarySelection) {
						const { selectionStartLineNumber, selectionStartColumn } = primarySelection;
						newSelections = [new Selection(selectionStartLineNumber, selectionStartColumn, newCursorPosition.lineNumber, newCursorPosition.column)];
					}
				} else {
					newSelections = (this._editor.getSelections() || []).map(selection => {
						if (selection.containsPosition(newCursorPosition)) {
							return new Selection(newCursorPosition.lineNumber, newCursorPosition.column, newCursorPosition.lineNumber, newCursorPosition.column);
						} else {
							return selection;
						}
					});
				}
				// Use `mouse` as the source instead of `api` and setting the reason to explicit (to behave like any other mouse operation).
				(<CodeEditorWidget>this._editor).setSelections(newSelections || [], 'mouse', CursorChangeReason.Explicit);
			} else if (!this._dragSelection.containsPosition(newCursorPosition) ||
				(
					(
						hasTriggerModifier(mouseEvent.event) ||
						this._modifierPressed
					) && (
						this._dragSelection.getEndPosition().equals(newCursorPosition) || this._dragSelection.getStartPosition().equals(newCursorPosition)
					) // we allow users to paste content beside the selection
				)) {
				this._editor.pushUndoStop();
				this._editor.executeCommand(DragAndDropController.ID, new DragAndDropCommand(this._dragSelection, newCursorPosition, hasTriggerModifier(mouseEvent.event) || this._modifierPressed));
				this._editor.pushUndoStop();
			}
		}

		this._editor.updateOptions({
			mouseStyle: 'text'
		});

		this._removeDecoration();
		this._dragSelection = null;
		this._mouseDown = false;
	}

	private static readonly _DECORATION_OPTIONS = ModelDecorationOptions.register({
		description: 'dnd-target',
		className: 'dnd-target'
	});

	public showAt(position: Position): void {
		this._dndDecorationIds.set([{
			range: new Range(position.lineNumber, position.column, position.lineNumber, position.column),
			options: DragAndDropController._DECORATION_OPTIONS
		}]);
		this._editor.revealPosition(position, ScrollType.Immediate);
	}

	private _removeDecoration(): void {
		this._dndDecorationIds.clear();
	}

	private _hitContent(target: IMouseTarget): boolean {
		return target.type === MouseTargetType.CONTENT_TEXT ||
			target.type === MouseTargetType.CONTENT_EMPTY;
	}

	private _hitMargin(target: IMouseTarget): boolean {
		return target.type === MouseTargetType.GUTTER_GLYPH_MARGIN ||
			target.type === MouseTargetType.GUTTER_LINE_NUMBERS ||
			target.type === MouseTargetType.GUTTER_LINE_DECORATIONS;
	}

	public override dispose(): void {
		this._removeDecoration();
		this._dragSelection = null;
		this._mouseDown = false;
		this._modifierPressed = false;
		super.dispose();
	}
}

registerEditorContribution(DragAndDropController.ID, DragAndDropController, EditorContributionInstantiation.BeforeFirstInteraction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/dnd/browser/dragAndDropCommand.ts]---
Location: vscode-main/src/vs/editor/contrib/dnd/browser/dragAndDropCommand.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from '../../../common/editorCommon.js';
import { ITextModel } from '../../../common/model.js';


export class DragAndDropCommand implements ICommand {

	private readonly selection: Selection;
	private readonly targetPosition: Position;
	private targetSelection: Selection | null;
	private readonly copy: boolean;

	constructor(selection: Selection, targetPosition: Position, copy: boolean) {
		this.selection = selection;
		this.targetPosition = targetPosition;
		this.copy = copy;
		this.targetSelection = null;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		const text = model.getValueInRange(this.selection);
		if (!this.copy) {
			builder.addEditOperation(this.selection, null);
		}
		builder.addEditOperation(new Range(this.targetPosition.lineNumber, this.targetPosition.column, this.targetPosition.lineNumber, this.targetPosition.column), text);

		if (this.selection.containsPosition(this.targetPosition) && !(
			this.copy && (
				this.selection.getEndPosition().equals(this.targetPosition) || this.selection.getStartPosition().equals(this.targetPosition)
			) // we allow users to paste content beside the selection
		)) {
			this.targetSelection = this.selection;
			return;
		}

		if (this.copy) {
			this.targetSelection = new Selection(
				this.targetPosition.lineNumber,
				this.targetPosition.column,
				this.selection.endLineNumber - this.selection.startLineNumber + this.targetPosition.lineNumber,
				this.selection.startLineNumber === this.selection.endLineNumber ?
					this.targetPosition.column + this.selection.endColumn - this.selection.startColumn :
					this.selection.endColumn
			);
			return;
		}

		if (this.targetPosition.lineNumber > this.selection.endLineNumber) {
			// Drag the selection downwards
			this.targetSelection = new Selection(
				this.targetPosition.lineNumber - this.selection.endLineNumber + this.selection.startLineNumber,
				this.targetPosition.column,
				this.targetPosition.lineNumber,
				this.selection.startLineNumber === this.selection.endLineNumber ?
					this.targetPosition.column + this.selection.endColumn - this.selection.startColumn :
					this.selection.endColumn
			);
			return;
		}

		if (this.targetPosition.lineNumber < this.selection.endLineNumber) {
			// Drag the selection upwards
			this.targetSelection = new Selection(
				this.targetPosition.lineNumber,
				this.targetPosition.column,
				this.targetPosition.lineNumber + this.selection.endLineNumber - this.selection.startLineNumber,
				this.selection.startLineNumber === this.selection.endLineNumber ?
					this.targetPosition.column + this.selection.endColumn - this.selection.startColumn :
					this.selection.endColumn
			);
			return;
		}

		// The target position is at the same line as the selection's end position.
		if (this.selection.endColumn <= this.targetPosition.column) {
			// The target position is after the selection's end position
			this.targetSelection = new Selection(
				this.targetPosition.lineNumber - this.selection.endLineNumber + this.selection.startLineNumber,
				this.selection.startLineNumber === this.selection.endLineNumber ?
					this.targetPosition.column - this.selection.endColumn + this.selection.startColumn :
					this.targetPosition.column - this.selection.endColumn + this.selection.startColumn,
				this.targetPosition.lineNumber,
				this.selection.startLineNumber === this.selection.endLineNumber ?
					this.targetPosition.column :
					this.selection.endColumn
			);
		} else {
			// The target position is before the selection's end position. Since the selection doesn't contain the target position, the selection is one-line and target position is before this selection.
			this.targetSelection = new Selection(
				this.targetPosition.lineNumber - this.selection.endLineNumber + this.selection.startLineNumber,
				this.targetPosition.column,
				this.targetPosition.lineNumber,
				this.targetPosition.column + this.selection.endColumn - this.selection.startColumn
			);
		}
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		return this.targetSelection!;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/documentSymbols/browser/documentSymbols.ts]---
Location: vscode-main/src/vs/editor/contrib/documentSymbols/browser/documentSymbols.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { assertType } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { ITextModelService } from '../../../common/services/resolverService.js';
import { IOutlineModelService } from './outlineModel.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';

CommandsRegistry.registerCommand('_executeDocumentSymbolProvider', async function (accessor, ...args) {
	const [resource] = args;
	assertType(URI.isUri(resource));

	const outlineService = accessor.get(IOutlineModelService);
	const modelService = accessor.get(ITextModelService);

	const reference = await modelService.createModelReference(resource);
	try {
		return (await outlineService.getOrCreate(reference.object.textEditorModel, CancellationToken.None)).getTopLevelSymbols();
	} finally {
		reference.dispose();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/documentSymbols/browser/outlineModel.ts]---
Location: vscode-main/src/vs/editor/contrib/documentSymbols/browser/outlineModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { binarySearch, coalesceInPlace, equals } from '../../../../base/common/arrays.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { LRUCache } from '../../../../base/common/map.js';
import { commonPrefixLength } from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { IPosition, Position } from '../../../common/core/position.js';
import { IRange, Range } from '../../../common/core/range.js';
import { ITextModel } from '../../../common/model.js';
import { DocumentSymbol, DocumentSymbolProvider } from '../../../common/languages.js';
import { MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { IFeatureDebounceInformation, ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IModelService } from '../../../common/services/model.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';

export abstract class TreeElement {

	abstract id: string;
	abstract children: Map<string, TreeElement>;
	abstract parent: TreeElement | undefined;

	remove(): void {
		this.parent?.children.delete(this.id);
	}

	static findId(candidate: DocumentSymbol | string, container: TreeElement): string {
		// complex id-computation which contains the origin/extension,
		// the parent path, and some dedupe logic when names collide
		let candidateId: string;
		if (typeof candidate === 'string') {
			candidateId = `${container.id}/${candidate}`;
		} else {
			candidateId = `${container.id}/${candidate.name}`;
			if (container.children.get(candidateId) !== undefined) {
				candidateId = `${container.id}/${candidate.name}_${candidate.range.startLineNumber}_${candidate.range.startColumn}`;
			}
		}

		let id = candidateId;
		for (let i = 0; container.children.get(id) !== undefined; i++) {
			id = `${candidateId}_${i}`;
		}

		return id;
	}

	static getElementById(id: string, element: TreeElement): TreeElement | undefined {
		if (!id) {
			return undefined;
		}
		const len = commonPrefixLength(id, element.id);
		if (len === id.length) {
			return element;
		}
		if (len < element.id.length) {
			return undefined;
		}
		for (const [, child] of element.children) {
			// eslint-disable-next-line no-restricted-syntax
			const candidate = TreeElement.getElementById(id, child);
			if (candidate) {
				return candidate;
			}
		}
		return undefined;
	}

	static size(element: TreeElement): number {
		let res = 1;
		for (const [, child] of element.children) {
			res += TreeElement.size(child);
		}
		return res;
	}

	static empty(element: TreeElement): boolean {
		return element.children.size === 0;
	}
}

export interface IOutlineMarker {
	startLineNumber: number;
	startColumn: number;
	endLineNumber: number;
	endColumn: number;
	severity: MarkerSeverity;
}

export class OutlineElement extends TreeElement {

	children = new Map<string, OutlineElement>();
	marker: { count: number; topSev: MarkerSeverity } | undefined;

	constructor(
		readonly id: string,
		public parent: TreeElement | undefined,
		readonly symbol: DocumentSymbol
	) {
		super();
	}
}

export class OutlineGroup extends TreeElement {

	children = new Map<string, OutlineElement>();

	constructor(
		readonly id: string,
		public parent: TreeElement | undefined,
		readonly label: string,
		readonly order: number,
	) {
		super();
	}

	getItemEnclosingPosition(position: IPosition): OutlineElement | undefined {
		return position ? this._getItemEnclosingPosition(position, this.children) : undefined;
	}

	private _getItemEnclosingPosition(position: IPosition, children: Map<string, OutlineElement>): OutlineElement | undefined {
		for (const [, item] of children) {
			if (!item.symbol.range || !Range.containsPosition(item.symbol.range, position)) {
				continue;
			}
			return this._getItemEnclosingPosition(position, item.children) || item;
		}
		return undefined;
	}

	updateMarker(marker: IOutlineMarker[]): void {
		for (const [, child] of this.children) {
			this._updateMarker(marker, child);
		}
	}

	private _updateMarker(markers: IOutlineMarker[], item: OutlineElement): void {
		item.marker = undefined;

		// find the proper start index to check for item/marker overlap.
		const idx = binarySearch<IRange>(markers, item.symbol.range, Range.compareRangesUsingStarts);
		let start: number;
		if (idx < 0) {
			start = ~idx;
			if (start > 0 && Range.areIntersecting(markers[start - 1], item.symbol.range)) {
				start -= 1;
			}
		} else {
			start = idx;
		}

		const myMarkers: IOutlineMarker[] = [];
		let myTopSev: MarkerSeverity | undefined;

		for (; start < markers.length && Range.areIntersecting(item.symbol.range, markers[start]); start++) {
			// remove markers intersecting with this outline element
			// and store them in a 'private' array.
			const marker = markers[start];
			myMarkers.push(marker);
			(markers as Array<IOutlineMarker | undefined>)[start] = undefined;
			if (!myTopSev || marker.severity > myTopSev) {
				myTopSev = marker.severity;
			}
		}

		// Recurse into children and let them match markers that have matched
		// this outline element. This might remove markers from this element and
		// therefore we remember that we have had markers. That allows us to render
		// the dot, saying 'this element has children with markers'
		for (const [, child] of item.children) {
			this._updateMarker(myMarkers, child);
		}

		if (myTopSev) {
			item.marker = {
				count: myMarkers.length,
				topSev: myTopSev
			};
		}

		coalesceInPlace(markers);
	}
}

export class OutlineModel extends TreeElement {

	static create(registry: LanguageFeatureRegistry<DocumentSymbolProvider>, textModel: ITextModel, token: CancellationToken): Promise<OutlineModel> {

		const cts = new CancellationTokenSource(token);
		const result = new OutlineModel(textModel.uri);
		const provider = registry.ordered(textModel);
		const promises = provider.map((provider, index) => {

			const id = TreeElement.findId(`provider_${index}`, result);
			const group = new OutlineGroup(id, result, provider.displayName ?? 'Unknown Outline Provider', index);


			return Promise.resolve(provider.provideDocumentSymbols(textModel, cts.token)).then(result => {
				for (const info of result || []) {
					OutlineModel._makeOutlineElement(info, group);
				}
				return group;
			}, err => {
				onUnexpectedExternalError(err);
				return group;
			}).then(group => {
				if (!TreeElement.empty(group)) {
					result._groups.set(id, group);
				} else {
					group.remove();
				}
			});
		});

		const listener = registry.onDidChange(() => {
			const newProvider = registry.ordered(textModel);
			if (!equals(newProvider, provider)) {
				cts.cancel();
			}
		});

		return Promise.all(promises).then(() => {
			if (cts.token.isCancellationRequested && !token.isCancellationRequested) {
				return OutlineModel.create(registry, textModel, token);
			} else {
				return result._compact();
			}
		}).finally(() => {
			cts.dispose();
			listener.dispose();
			cts.dispose();
		});
	}

	private static _makeOutlineElement(info: DocumentSymbol, container: OutlineGroup | OutlineElement): void {
		const id = TreeElement.findId(info, container);
		const res = new OutlineElement(id, container, info);
		if (info.children) {
			for (const childInfo of info.children) {
				OutlineModel._makeOutlineElement(childInfo, res);
			}
		}
		container.children.set(res.id, res);
	}

	static get(element: TreeElement | undefined): OutlineModel | undefined {
		while (element) {
			if (element instanceof OutlineModel) {
				return element;
			}
			element = element.parent;
		}
		return undefined;
	}

	readonly id = 'root';
	readonly parent = undefined;

	protected _groups = new Map<string, OutlineGroup>();
	children = new Map<string, OutlineGroup | OutlineElement>();

	protected constructor(readonly uri: URI) {
		super();

		this.id = 'root';
		this.parent = undefined;
	}

	private _compact(): this {
		let count = 0;
		for (const [key, group] of this._groups) {
			if (group.children.size === 0) { // empty
				this._groups.delete(key);
			} else {
				count += 1;
			}
		}
		if (count !== 1) {
			//
			this.children = this._groups;
		} else {
			// adopt all elements of the first group
			const group = Iterable.first(this._groups.values())!;
			for (const [, child] of group.children) {
				child.parent = this;
				this.children.set(child.id, child);
			}
		}
		return this;
	}

	merge(other: OutlineModel): boolean {
		if (this.uri.toString() !== other.uri.toString()) {
			return false;
		}
		if (this._groups.size !== other._groups.size) {
			return false;
		}
		this._groups = other._groups;
		this.children = other.children;
		return true;
	}

	getItemEnclosingPosition(position: IPosition, context?: OutlineElement): OutlineElement | undefined {

		let preferredGroup: OutlineGroup | undefined;
		if (context) {
			let candidate = context.parent;
			while (candidate && !preferredGroup) {
				if (candidate instanceof OutlineGroup) {
					preferredGroup = candidate;
				}
				candidate = candidate.parent;
			}
		}

		let result: OutlineElement | undefined = undefined;
		for (const [, group] of this._groups) {
			result = group.getItemEnclosingPosition(position);
			if (result && (!preferredGroup || preferredGroup === group)) {
				break;
			}
		}
		return result;
	}

	getItemById(id: string): TreeElement | undefined {
		// eslint-disable-next-line no-restricted-syntax
		return TreeElement.getElementById(id, this);
	}

	updateMarker(marker: IOutlineMarker[]): void {
		// sort markers by start range so that we can use
		// outline element starts for quicker look up
		marker.sort(Range.compareRangesUsingStarts);

		for (const [, group] of this._groups) {
			group.updateMarker(marker.slice(0));
		}
	}

	getTopLevelSymbols(): DocumentSymbol[] {
		const roots: DocumentSymbol[] = [];
		for (const child of this.children.values()) {
			if (child instanceof OutlineElement) {
				roots.push(child.symbol);
			} else {
				roots.push(...Iterable.map(child.children.values(), child => child.symbol));
			}
		}
		return roots.sort((a, b) => Range.compareRangesUsingStarts(a.range, b.range));
	}

	asListOfDocumentSymbols(): DocumentSymbol[] {
		const roots = this.getTopLevelSymbols();
		const bucket: DocumentSymbol[] = [];
		OutlineModel._flattenDocumentSymbols(bucket, roots, '');
		return bucket.sort((a, b) =>
			Position.compare(Range.getStartPosition(a.range), Range.getStartPosition(b.range)) || Position.compare(Range.getEndPosition(b.range), Range.getEndPosition(a.range))
		);
	}

	private static _flattenDocumentSymbols(bucket: DocumentSymbol[], entries: DocumentSymbol[], overrideContainerLabel: string): void {
		for (const entry of entries) {
			bucket.push({
				kind: entry.kind,
				tags: entry.tags,
				name: entry.name,
				detail: entry.detail,
				containerName: entry.containerName || overrideContainerLabel,
				range: entry.range,
				selectionRange: entry.selectionRange,
				children: undefined, // we flatten it...
			});

			// Recurse over children
			if (entry.children) {
				OutlineModel._flattenDocumentSymbols(bucket, entry.children, entry.name);
			}
		}
	}
}


export const IOutlineModelService = createDecorator<IOutlineModelService>('IOutlineModelService');

export interface IOutlineModelService {
	_serviceBrand: undefined;
	getOrCreate(model: ITextModel, token: CancellationToken): Promise<OutlineModel>;
	getDebounceValue(textModel: ITextModel): number;
	getCachedModels(): Iterable<OutlineModel>;
}

interface CacheEntry {
	versionId: number;
	provider: DocumentSymbolProvider[];

	promiseCnt: number;
	source: CancellationTokenSource;
	promise: Promise<OutlineModel>;
	model: OutlineModel | undefined;
}

export class OutlineModelService implements IOutlineModelService {

	declare _serviceBrand: undefined;

	private readonly _disposables = new DisposableStore();
	private readonly _debounceInformation: IFeatureDebounceInformation;
	private readonly _cache = new LRUCache<string, CacheEntry>(15, 0.7);

	constructor(
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@ILanguageFeatureDebounceService debounces: ILanguageFeatureDebounceService,
		@IModelService modelService: IModelService
	) {
		this._debounceInformation = debounces.for(_languageFeaturesService.documentSymbolProvider, 'DocumentSymbols', { min: 350 });

		// don't cache outline models longer than their text model
		this._disposables.add(modelService.onModelRemoved(textModel => {
			this._cache.delete(textModel.id);
		}));
	}

	dispose(): void {
		this._disposables.dispose();
	}

	async getOrCreate(textModel: ITextModel, token: CancellationToken): Promise<OutlineModel> {

		const registry = this._languageFeaturesService.documentSymbolProvider;
		const provider = registry.ordered(textModel);

		let data = this._cache.get(textModel.id);
		if (!data || data.versionId !== textModel.getVersionId() || !equals(data.provider, provider)) {
			const source = new CancellationTokenSource();
			data = {
				versionId: textModel.getVersionId(),
				provider,
				promiseCnt: 0,
				source,
				promise: OutlineModel.create(registry, textModel, source.token),
				model: undefined,
			};
			this._cache.set(textModel.id, data);

			const now = Date.now();
			data.promise.then(outlineModel => {
				data!.model = outlineModel;
				this._debounceInformation.update(textModel, Date.now() - now);
			}).catch(_err => {
				this._cache.delete(textModel.id);
			});
		}

		if (data.model) {
			// resolved -> return data
			return data.model;
		}

		// increase usage counter
		data.promiseCnt += 1;

		const listener = token.onCancellationRequested(() => {
			// last -> cancel provider request, remove cached promise
			if (--data.promiseCnt === 0) {
				data.source.cancel();
				this._cache.delete(textModel.id);
			}
		});

		try {
			return await data.promise;
		} finally {
			listener.dispose();
		}
	}

	getDebounceValue(textModel: ITextModel): number {
		return this._debounceInformation.get(textModel);
	}

	getCachedModels(): Iterable<OutlineModel> {
		return Iterable.filter<OutlineModel | undefined, OutlineModel>(Iterable.map(this._cache.values(), entry => entry.model), model => model !== undefined);
	}
}

registerSingleton(IOutlineModelService, OutlineModelService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/documentSymbols/test/browser/outlineModel.test.ts]---
Location: vscode-main/src/vs/editor/contrib/documentSymbols/test/browser/outlineModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { Range } from '../../../../common/core/range.js';
import { DocumentSymbol, SymbolKind } from '../../../../common/languages.js';
import { LanguageFeatureDebounceService } from '../../../../common/services/languageFeatureDebounce.js';
import { LanguageFeaturesService } from '../../../../common/services/languageFeaturesService.js';
import { IModelService } from '../../../../common/services/model.js';
import { createModelServices, createTextModel } from '../../../../test/common/testTextModel.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { IMarker, MarkerSeverity } from '../../../../../platform/markers/common/markers.js';
import { OutlineElement, OutlineGroup, OutlineModel, OutlineModelService } from '../../browser/outlineModel.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('OutlineModel', function () {

	const disposables = new DisposableStore();
	const languageFeaturesService = new LanguageFeaturesService();

	teardown(function () {
		disposables.clear();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('OutlineModel#create, cached', async function () {

		const insta = createModelServices(disposables);
		const modelService = insta.get(IModelService);
		const envService = new class extends mock<IEnvironmentService>() {
			override isBuilt: boolean = true;
			override isExtensionDevelopment: boolean = false;
		};
		const service = new OutlineModelService(languageFeaturesService, new LanguageFeatureDebounceService(new NullLogService(), envService), modelService);

		const model = createTextModel('foo', undefined, undefined, URI.file('/fome/path.foo'));
		let count = 0;
		const reg = languageFeaturesService.documentSymbolProvider.register({ pattern: '**/path.foo' }, {
			provideDocumentSymbols() {
				count += 1;
				return [];
			}
		});

		await service.getOrCreate(model, CancellationToken.None);
		assert.strictEqual(count, 1);

		// cached
		await service.getOrCreate(model, CancellationToken.None);
		assert.strictEqual(count, 1);

		// new version
		model.applyEdits([{ text: 'XXX', range: new Range(1, 1, 1, 1) }]);
		await service.getOrCreate(model, CancellationToken.None);
		assert.strictEqual(count, 2);

		reg.dispose();
		model.dispose();
		service.dispose();
	});

	test('OutlineModel#create, cached/cancel', async function () {

		const insta = createModelServices(disposables);
		const modelService = insta.get(IModelService);
		const envService = new class extends mock<IEnvironmentService>() {
			override isBuilt: boolean = true;
			override isExtensionDevelopment: boolean = false;
		};
		const service = new OutlineModelService(languageFeaturesService, new LanguageFeatureDebounceService(new NullLogService(), envService), modelService);
		const model = createTextModel('foo', undefined, undefined, URI.file('/fome/path.foo'));
		let isCancelled = false;

		const reg = languageFeaturesService.documentSymbolProvider.register({ pattern: '**/path.foo' }, {
			provideDocumentSymbols(d, token) {
				return new Promise(resolve => {
					const l = token.onCancellationRequested(_ => {
						isCancelled = true;
						resolve(null);
						l.dispose();
					});
				});
			}
		});

		assert.strictEqual(isCancelled, false);
		const s1 = new CancellationTokenSource();
		service.getOrCreate(model, s1.token);
		const s2 = new CancellationTokenSource();
		service.getOrCreate(model, s2.token);

		s1.cancel();
		assert.strictEqual(isCancelled, false);

		s2.cancel();
		assert.strictEqual(isCancelled, true);

		reg.dispose();
		model.dispose();
		service.dispose();

	});

	function fakeSymbolInformation(range: Range, name: string = 'foo'): DocumentSymbol {
		return {
			name,
			detail: 'fake',
			kind: SymbolKind.Boolean,
			tags: [],
			selectionRange: range,
			range: range
		};
	}

	function fakeMarker(range: Range): IMarker {
		return { ...range, owner: 'ffff', message: 'test', severity: MarkerSeverity.Error, resource: null! };
	}

	test('OutlineElement - updateMarker', function () {

		const e0 = new OutlineElement('foo1', null!, fakeSymbolInformation(new Range(1, 1, 1, 10)));
		const e1 = new OutlineElement('foo2', null!, fakeSymbolInformation(new Range(2, 1, 5, 1)));
		const e2 = new OutlineElement('foo3', null!, fakeSymbolInformation(new Range(6, 1, 10, 10)));

		const group = new OutlineGroup('group', null!, null!, 1);
		group.children.set(e0.id, e0);
		group.children.set(e1.id, e1);
		group.children.set(e2.id, e2);

		const data = [fakeMarker(new Range(6, 1, 6, 7)), fakeMarker(new Range(1, 1, 1, 4)), fakeMarker(new Range(10, 2, 14, 1))];
		data.sort(Range.compareRangesUsingStarts); // model does this

		group.updateMarker(data);
		assert.strictEqual(data.length, 0); // all 'stolen'
		assert.strictEqual(e0.marker!.count, 1);
		assert.strictEqual(e1.marker, undefined);
		assert.strictEqual(e2.marker!.count, 2);

		group.updateMarker([]);
		assert.strictEqual(e0.marker, undefined);
		assert.strictEqual(e1.marker, undefined);
		assert.strictEqual(e2.marker, undefined);
	});

	test('OutlineElement - updateMarker, 2', function () {

		const p = new OutlineElement('A', null!, fakeSymbolInformation(new Range(1, 1, 11, 1)));
		const c1 = new OutlineElement('A/B', null!, fakeSymbolInformation(new Range(2, 4, 5, 4)));
		const c2 = new OutlineElement('A/C', null!, fakeSymbolInformation(new Range(6, 4, 9, 4)));

		const group = new OutlineGroup('group', null!, null!, 1);
		group.children.set(p.id, p);
		p.children.set(c1.id, c1);
		p.children.set(c2.id, c2);

		let data = [
			fakeMarker(new Range(2, 4, 5, 4))
		];

		group.updateMarker(data);
		assert.strictEqual(p.marker!.count, 0);
		assert.strictEqual(c1.marker!.count, 1);
		assert.strictEqual(c2.marker, undefined);

		data = [
			fakeMarker(new Range(2, 4, 5, 4)),
			fakeMarker(new Range(2, 6, 2, 8)),
			fakeMarker(new Range(7, 6, 7, 8)),
		];
		group.updateMarker(data);
		assert.strictEqual(p.marker!.count, 0);
		assert.strictEqual(c1.marker!.count, 2);
		assert.strictEqual(c2.marker!.count, 1);

		data = [
			fakeMarker(new Range(1, 4, 1, 11)),
			fakeMarker(new Range(7, 6, 7, 8)),
		];
		group.updateMarker(data);
		assert.strictEqual(p.marker!.count, 1);
		assert.strictEqual(c1.marker, undefined);
		assert.strictEqual(c2.marker!.count, 1);
	});

	test('OutlineElement - updateMarker/multiple groups', function () {

		const model = new class extends OutlineModel {
			constructor() {
				super(null!);
			}
			readyForTesting() {
				// eslint-disable-next-line local/code-no-any-casts
				this._groups = this.children as any;
			}
		};
		model.children.set('g1', new OutlineGroup('g1', model, null!, 1));
		model.children.get('g1')!.children.set('c1', new OutlineElement('c1', model.children.get('g1')!, fakeSymbolInformation(new Range(1, 1, 11, 1))));

		model.children.set('g2', new OutlineGroup('g2', model, null!, 1));
		model.children.get('g2')!.children.set('c2', new OutlineElement('c2', model.children.get('g2')!, fakeSymbolInformation(new Range(1, 1, 7, 1))));
		model.children.get('g2')!.children.get('c2')!.children.set('c2.1', new OutlineElement('c2.1', model.children.get('g2')!.children.get('c2')!, fakeSymbolInformation(new Range(1, 3, 2, 19))));
		model.children.get('g2')!.children.get('c2')!.children.set('c2.2', new OutlineElement('c2.2', model.children.get('g2')!.children.get('c2')!, fakeSymbolInformation(new Range(4, 1, 6, 10))));

		model.readyForTesting();

		const data = [
			fakeMarker(new Range(1, 1, 2, 8)),
			fakeMarker(new Range(6, 1, 6, 98)),
		];

		model.updateMarker(data);

		assert.strictEqual(model.children.get('g1')!.children.get('c1')!.marker!.count, 2);
		assert.strictEqual(model.children.get('g2')!.children.get('c2')!.children.get('c2.1')!.marker!.count, 1);
		assert.strictEqual(model.children.get('g2')!.children.get('c2')!.children.get('c2.2')!.marker!.count, 1);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/dropOrPasteInto/browser/copyPasteContribution.ts]---
Location: vscode-main/src/vs/editor/contrib/dropOrPasteInto/browser/copyPasteContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { HierarchicalKind } from '../../../../base/common/hierarchicalKind.js';
import { IJSONSchema, TypeFromJsonSchema } from '../../../../base/common/jsonSchema.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import * as nls from '../../../../nls.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorCommand, EditorContributionInstantiation, ServicesAccessor, registerEditorAction, registerEditorCommand, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { registerEditorFeature } from '../../../common/editorFeatures.js';
import { CopyPasteController, PastePreference, changePasteTypeCommandId, pasteWidgetVisibleCtx } from './copyPasteController.js';
import { DefaultPasteProvidersFeature, DefaultTextPasteOrDropEditProvider } from './defaultProviders.js';

export const pasteAsCommandId = 'editor.action.pasteAs';

registerEditorContribution(CopyPasteController.ID, CopyPasteController, EditorContributionInstantiation.Eager); // eager because it listens to events on the container dom node of the editor
registerEditorFeature(DefaultPasteProvidersFeature);

registerEditorCommand(new class extends EditorCommand {
	constructor() {
		super({
			id: changePasteTypeCommandId,
			precondition: pasteWidgetVisibleCtx,
			kbOpts: {
				weight: KeybindingWeight.EditorContrib,
				primary: KeyMod.CtrlCmd | KeyCode.Period,
			}
		});
	}

	public override runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor) {
		return CopyPasteController.get(editor)?.changePasteType();
	}
});

registerEditorCommand(new class extends EditorCommand {
	constructor() {
		super({
			id: 'editor.hidePasteWidget',
			precondition: pasteWidgetVisibleCtx,
			kbOpts: {
				weight: KeybindingWeight.EditorContrib,
				primary: KeyCode.Escape,
			}
		});
	}

	public override runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor) {
		CopyPasteController.get(editor)?.clearWidgets();
	}
});

registerEditorAction(class PasteAsAction extends EditorAction {
	private static readonly argsSchema = {
		oneOf: [
			{
				type: 'object',
				required: ['kind'],
				properties: {
					kind: {
						type: 'string',
						description: nls.localize('pasteAs.kind', "The kind of the paste edit to try pasting with.\nIf there are multiple edits for this kind, the editor will show a picker. If there are no edits of this kind, the editor will show an error message."),
					}
				},
			},
			{
				type: 'object',
				required: ['preferences'],
				properties: {
					preferences: {
						type: 'array',
						description: nls.localize('pasteAs.preferences', "List of preferred paste edit kind to try applying.\nThe first edit matching the preferences will be applied."),
						items: { type: 'string' }
					}
				},
			}
		]
	} as const satisfies IJSONSchema;

	constructor() {
		super({
			id: pasteAsCommandId,
			label: nls.localize2('pasteAs', "Paste As..."),
			precondition: EditorContextKeys.writable,
			metadata: {
				description: 'Paste as',
				args: [{
					name: 'args',
					schema: PasteAsAction.argsSchema
				}]
			},
			canTriggerInlineEdits: true,
		});
	}

	public override run(_accessor: ServicesAccessor, editor: ICodeEditor, args?: TypeFromJsonSchema<typeof PasteAsAction.argsSchema>) {
		let preference: PastePreference | undefined;
		if (args) {
			if ('kind' in args) {
				preference = { only: new HierarchicalKind(args.kind) };
			} else if ('preferences' in args) {
				preference = { preferences: args.preferences.map(kind => new HierarchicalKind(kind)) };
			}
		}
		return CopyPasteController.get(editor)?.pasteAs(preference);
	}
});

registerEditorAction(class extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.pasteAsText',
			label: nls.localize2('pasteAsText', "Paste as Text"),
			precondition: EditorContextKeys.writable,
			canTriggerInlineEdits: true,
		});
	}

	public override run(_accessor: ServicesAccessor, editor: ICodeEditor) {
		return CopyPasteController.get(editor)?.pasteAs({ providerId: DefaultTextPasteOrDropEditProvider.id });
	}
});

export type PreferredPasteConfiguration = string;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/dropOrPasteInto/browser/copyPasteController.ts]---
Location: vscode-main/src/vs/editor/contrib/dropOrPasteInto/browser/copyPasteController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener } from '../../../../base/browser/dom.js';
import { IAction } from '../../../../base/common/actions.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { CancelablePromise, createCancelablePromise, DeferredPromise, raceCancellation } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { createStringDataTransferItem, IReadonlyVSDataTransfer, matchesMimeType, UriList, VSDataTransfer } from '../../../../base/common/dataTransfer.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { HierarchicalKind } from '../../../../base/common/hierarchicalKind.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { Mimes } from '../../../../base/common/mime.js';
import * as platform from '../../../../base/common/platform.js';
import { upcast } from '../../../../base/common/types.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { localize } from '../../../../nls.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { ClipboardEventUtils, CopyOptions, InMemoryClipboardMetadataManager, PasteOptions } from '../../../browser/controller/editContext/clipboardUtils.js';
import { toExternalVSDataTransfer, toVSDataTransfer } from '../../../browser/dataTransfer.js';
import { ICodeEditor, PastePayload } from '../../../browser/editorBrowser.js';
import { IBulkEditService } from '../../../browser/services/bulkEditService.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IRange, Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { Handler, IEditorContribution } from '../../../common/editorCommon.js';
import { DocumentPasteContext, DocumentPasteEdit, DocumentPasteEditProvider, DocumentPasteTriggerKind } from '../../../common/languages.js';
import { ITextModel } from '../../../common/model.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { CodeEditorStateFlag, EditorStateCancellationTokenSource } from '../../editorState/browser/editorState.js';
import { InlineProgressManager } from '../../inlineProgress/browser/inlineProgress.js';
import { MessageController } from '../../message/browser/messageController.js';
import { PreferredPasteConfiguration } from './copyPasteContribution.js';
import { DefaultTextPasteOrDropEditProvider } from './defaultProviders.js';
import { createCombinedWorkspaceEdit, sortEditsByYieldTo } from './edit.js';
import { PostEditWidgetManager } from './postEditWidget.js';

export const changePasteTypeCommandId = 'editor.changePasteType';

export const pasteAsPreferenceConfig = 'editor.pasteAs.preferences';

export const pasteWidgetVisibleCtx = new RawContextKey<boolean>('pasteWidgetVisible', false, localize('pasteWidgetVisible', "Whether the paste widget is showing"));

const vscodeClipboardMime = 'application/vnd.code.copymetadata';

interface CopyMetadata {
	readonly id?: string;
	readonly providerCopyMimeTypes?: readonly string[];

	readonly defaultPastePayload: Omit<PastePayload, 'text'>;
}

type PasteEditWithProvider = DocumentPasteEdit & {
	provider: DocumentPasteEditProvider;
};


interface DocumentPasteWithProviderEditsSession {
	edits: readonly PasteEditWithProvider[];
	dispose(): void;
}

export type PastePreference =
	| { readonly only: HierarchicalKind }
	| { readonly preferences: readonly HierarchicalKind[] }
	| { readonly providerId: string } // Only used internally
	;

interface CopyOperation {
	readonly providerMimeTypes: readonly string[];
	readonly operation: CancelablePromise<IReadonlyVSDataTransfer | undefined>;
}

export class CopyPasteController extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.copyPasteActionController';

	public static get(editor: ICodeEditor): CopyPasteController | null {
		return editor.getContribution<CopyPasteController>(CopyPasteController.ID);
	}

	public static setConfigureDefaultAction(action: IAction) {
		CopyPasteController._configureDefaultAction = action;
	}

	private static _configureDefaultAction?: IAction;

	/**
	 * Global tracking the last copy operation.
	 *
	 * This is shared across all editors so that you can copy and paste between groups.
	 *
	 * TODO: figure out how to make this work with multiple windows
	 */
	private static _currentCopyOperation?: {
		readonly handle: string;
		readonly operations: ReadonlyArray<CopyOperation>;
	};

	private readonly _editor: ICodeEditor;

	private _currentPasteOperation?: CancelablePromise<void>;
	private _pasteAsActionContext?: { readonly preferred?: PastePreference };

	private readonly _pasteProgressManager: InlineProgressManager;
	private readonly _postPasteWidgetManager: PostEditWidgetManager<PasteEditWithProvider>;

	constructor(
		editor: ICodeEditor,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILogService private readonly _logService: ILogService,
		@IBulkEditService private readonly _bulkEditService: IBulkEditService,
		@IClipboardService private readonly _clipboardService: IClipboardService,
		@ICommandService private readonly _commandService: ICommandService,
		@IConfigurationService private readonly _configService: IConfigurationService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@IProgressService private readonly _progressService: IProgressService,
	) {
		super();

		this._editor = editor;

		const container = editor.getContainerDomNode();
		this._register(addDisposableListener(container, 'copy', e => this.handleCopy(e)));
		this._register(addDisposableListener(container, 'cut', e => this.handleCopy(e)));
		this._register(addDisposableListener(container, 'paste', e => this.handlePaste(e), true));

		this._pasteProgressManager = this._register(new InlineProgressManager('pasteIntoEditor', editor, instantiationService));

		this._postPasteWidgetManager = this._register(instantiationService.createInstance(PostEditWidgetManager, 'pasteIntoEditor', editor, pasteWidgetVisibleCtx,
			{ id: changePasteTypeCommandId, label: localize('postPasteWidgetTitle', "Show paste options...") },
			() => CopyPasteController._configureDefaultAction ? [CopyPasteController._configureDefaultAction] : []
		));
	}

	public changePasteType() {
		this._postPasteWidgetManager.tryShowSelector();
	}

	public async pasteAs(preferred?: PastePreference) {
		this._logService.trace('CopyPasteController.pasteAs');
		this._editor.focus();
		try {
			this._logService.trace('Before calling editor.action.clipboardPasteAction');
			this._pasteAsActionContext = { preferred };
			await this._commandService.executeCommand('editor.action.clipboardPasteAction');
		} finally {
			this._pasteAsActionContext = undefined;
		}
	}

	public clearWidgets() {
		this._postPasteWidgetManager.clear();
	}

	private isPasteAsEnabled(): boolean {
		return this._editor.getOption(EditorOption.pasteAs).enabled;
	}

	public async finishedPaste(): Promise<void> {
		await this._currentPasteOperation;
	}

	private handleCopy(e: ClipboardEvent) {
		CopyOptions.electronBugWorkaroundCopyEventHasFired = true;
		let id: string | null = null;
		if (e.clipboardData) {
			const [text, metadata] = ClipboardEventUtils.getTextData(e.clipboardData);
			const storedMetadata = metadata || InMemoryClipboardMetadataManager.INSTANCE.get(text);
			id = storedMetadata?.id || null;
			this._logService.trace('CopyPasteController#handleCopy for id : ', id, ' with text.length : ', text.length);
		} else {
			this._logService.trace('CopyPasteController#handleCopy');
		}
		if (!this._editor.hasTextFocus()) {
			this._logService.trace('CopyPasteController#handleCopy/earlyReturn1');
			return;
		}

		// Explicitly clear the clipboard internal state.
		// This is needed because on web, the browser clipboard is faked out using an in-memory store.
		// This means the resources clipboard is not properly updated when copying from the editor.
		this._clipboardService.clearInternalState?.();

		if (!e.clipboardData || !this.isPasteAsEnabled()) {
			this._logService.trace('CopyPasteController#handleCopy/earlyReturn2');
			return;
		}

		const model = this._editor.getModel();
		const selections = this._editor.getSelections();
		if (!model || !selections?.length) {
			this._logService.trace('CopyPasteController#handleCopy/earlyReturn3');
			return;
		}

		const enableEmptySelectionClipboard = this._editor.getOption(EditorOption.emptySelectionClipboard);

		let ranges: readonly IRange[] = selections;
		const wasFromEmptySelection = selections.length === 1 && selections[0].isEmpty();
		if (wasFromEmptySelection) {
			if (!enableEmptySelectionClipboard) {
				this._logService.trace('CopyPasteController#handleCopy/earlyReturn4');
				return;
			}

			ranges = [new Range(ranges[0].startLineNumber, 1, ranges[0].startLineNumber, 1 + model.getLineLength(ranges[0].startLineNumber))];
		}

		const toCopy = this._editor._getViewModel()?.getPlainTextToCopy(selections, enableEmptySelectionClipboard, platform.isWindows);
		const multicursorText = Array.isArray(toCopy) ? toCopy : null;

		const defaultPastePayload = {
			multicursorText,
			pasteOnNewLine: wasFromEmptySelection,
			mode: null
		};

		const providers = this._languageFeaturesService.documentPasteEditProvider
			.ordered(model)
			.filter(x => !!x.prepareDocumentPaste);
		if (!providers.length) {
			this.setCopyMetadata(e.clipboardData, { defaultPastePayload });
			this._logService.trace('CopyPasteController#handleCopy/earlyReturn5');
			return;
		}

		const dataTransfer = toVSDataTransfer(e.clipboardData);
		const providerCopyMimeTypes = providers.flatMap(x => x.copyMimeTypes ?? []);

		// Save off a handle pointing to data that VS Code maintains.
		const handle = id ?? generateUuid();
		this.setCopyMetadata(e.clipboardData, {
			id: handle,
			providerCopyMimeTypes,
			defaultPastePayload
		});

		const operations = providers.map((provider): CopyOperation => {
			return {
				providerMimeTypes: provider.copyMimeTypes,
				operation: createCancelablePromise(token =>
					provider.prepareDocumentPaste!(model, ranges, dataTransfer, token)
						.catch(err => {
							console.error(err);
							return undefined;
						}))
			};
		});

		CopyPasteController._currentCopyOperation?.operations.forEach(entry => entry.operation.cancel());
		CopyPasteController._currentCopyOperation = { handle, operations };
		this._logService.trace('CopyPasteController#handleCopy/end');
	}

	private async handlePaste(e: ClipboardEvent) {
		PasteOptions.electronBugWorkaroundPasteEventHasFired = true;
		if (e.clipboardData) {
			const [text, metadata] = ClipboardEventUtils.getTextData(e.clipboardData);
			const metadataComputed = metadata || InMemoryClipboardMetadataManager.INSTANCE.get(text);
			this._logService.trace('CopyPasteController#handlePaste for id : ', metadataComputed?.id);
		} else {
			this._logService.trace('CopyPasteController#handlePaste');
		}
		if (!e.clipboardData || !this._editor.hasTextFocus()) {
			this._logService.trace('CopyPasteController#handlePaste/earlyReturn1');
			return;
		}

		MessageController.get(this._editor)?.closeMessage();
		this._currentPasteOperation?.cancel();
		this._currentPasteOperation = undefined;

		const model = this._editor.getModel();
		const selections = this._editor.getSelections();
		if (!selections?.length || !model) {
			this._logService.trace('CopyPasteController#handlePaste/earlyReturn2');
			return;
		}

		if (
			this._editor.getOption(EditorOption.readOnly) // Never enabled if editor is readonly.
			|| (!this.isPasteAsEnabled() && !this._pasteAsActionContext) // Or feature disabled (but still enable if paste was explicitly requested)
		) {
			this._logService.trace('CopyPasteController#handlePaste/earlyReturn3');
			return;
		}

		const metadata = this.fetchCopyMetadata(e);
		this._logService.trace('CopyPasteController#handlePaste with metadata : ', metadata?.id, ' and text.length : ', e.clipboardData.getData('text/plain').length);
		const dataTransfer = toExternalVSDataTransfer(e.clipboardData);
		dataTransfer.delete(vscodeClipboardMime);

		const fileTypes = Array.from(e.clipboardData.files).map(file => file.type);

		const allPotentialMimeTypes = [
			...e.clipboardData.types,
			...fileTypes,
			...metadata?.providerCopyMimeTypes ?? [],
			// TODO: always adds `uri-list` because this get set if there are resources in the system clipboard.
			// However we can only check the system clipboard async. For this early check, just add it in.
			// We filter providers again once we have the final dataTransfer we will use.
			Mimes.uriList,
		];

		const allProviders = this._languageFeaturesService.documentPasteEditProvider
			.ordered(model)
			.filter(provider => {
				// Filter out providers that don't match the requested paste types
				const preference = this._pasteAsActionContext?.preferred;
				if (preference) {
					if (!this.providerMatchesPreference(provider, preference)) {
						return false;
					}
				}

				// And providers that don't handle any of mime types in the clipboard
				return provider.pasteMimeTypes?.some(type => matchesMimeType(type, allPotentialMimeTypes));
			});
		if (!allProviders.length) {
			if (this._pasteAsActionContext?.preferred) {
				this.showPasteAsNoEditMessage(selections, this._pasteAsActionContext.preferred);

				// Also prevent default paste from applying
				e.preventDefault();
				e.stopImmediatePropagation();
			}
			this._logService.trace('CopyPasteController#handlePaste/earlyReturn4');
			return;
		}

		// Prevent the editor's default paste handler from running.
		// Note that after this point, we are fully responsible for handling paste.
		// If we can't provider a paste for any reason, we need to explicitly delegate pasting back to the editor.
		e.preventDefault();
		e.stopImmediatePropagation();

		if (this._pasteAsActionContext) {
			this.showPasteAsPick(this._pasteAsActionContext.preferred, allProviders, selections, dataTransfer, metadata);
		} else {
			this.doPasteInline(allProviders, selections, dataTransfer, metadata, e);
		}
		this._logService.trace('CopyPasteController#handlePaste/end');
	}

	private showPasteAsNoEditMessage(selections: readonly Selection[], preference: PastePreference) {
		const kindLabel = 'only' in preference
			? preference.only.value
			: 'preferences' in preference
				? (preference.preferences.length ? preference.preferences.map(preference => preference.value).join(', ') : localize('noPreferences', "empty"))
				: preference.providerId;

		MessageController.get(this._editor)?.showMessage(localize('pasteAsError', "No paste edits for '{0}' found", kindLabel), selections[0].getStartPosition());
	}

	private doPasteInline(allProviders: readonly DocumentPasteEditProvider[], selections: readonly Selection[], dataTransfer: VSDataTransfer, metadata: CopyMetadata | undefined, clipboardEvent: ClipboardEvent): void {
		this._logService.trace('CopyPasteController#doPasteInline');
		const editor = this._editor;
		if (!editor.hasModel()) {
			return;
		}

		const editorStateCts = new EditorStateCancellationTokenSource(editor, CodeEditorStateFlag.Value | CodeEditorStateFlag.Selection, undefined);

		const p = createCancelablePromise(async (pToken) => {
			const editor = this._editor;
			if (!editor.hasModel()) {
				return;
			}
			const model = editor.getModel();

			const disposables = new DisposableStore();
			const cts = disposables.add(new CancellationTokenSource(pToken));
			disposables.add(editorStateCts.token.onCancellationRequested(() => cts.cancel()));

			const token = cts.token;
			try {
				await this.mergeInDataFromCopy(allProviders, dataTransfer, metadata, token);
				if (token.isCancellationRequested) {
					return;
				}

				const supportedProviders = allProviders.filter(provider => this.isSupportedPasteProvider(provider, dataTransfer));
				if (!supportedProviders.length
					|| (supportedProviders.length === 1 && supportedProviders[0] instanceof DefaultTextPasteOrDropEditProvider) // Only our default text provider is active
				) {
					return this.applyDefaultPasteHandler(dataTransfer, metadata, token, clipboardEvent);
				}

				const context: DocumentPasteContext = {
					triggerKind: DocumentPasteTriggerKind.Automatic,
				};

				const editSession = await this.getPasteEdits(supportedProviders, dataTransfer, model, selections, context, token);
				disposables.add(editSession);
				if (token.isCancellationRequested) {
					return;
				}

				// If the only edit returned is our default text edit, use the default paste handler
				if (editSession.edits.length === 1 && editSession.edits[0].provider instanceof DefaultTextPasteOrDropEditProvider) {
					return this.applyDefaultPasteHandler(dataTransfer, metadata, token, clipboardEvent);
				}

				if (editSession.edits.length) {
					const canShowWidget = editor.getOption(EditorOption.pasteAs).showPasteSelector === 'afterPaste';
					return this._postPasteWidgetManager.applyEditAndShowIfNeeded(selections, { activeEditIndex: this.getInitialActiveEditIndex(model, editSession.edits), allEdits: editSession.edits }, canShowWidget, async (edit, resolveToken) => {
						if (!edit.provider.resolveDocumentPasteEdit) {
							return edit;
						}

						const resolveP = edit.provider.resolveDocumentPasteEdit(edit, resolveToken);
						const showP = new DeferredPromise<void>();
						const resolved = await this._pasteProgressManager.showWhile(selections[0].getEndPosition(), localize('resolveProcess', "Resolving paste edit for '{0}'. Click to cancel", edit.title), raceCancellation(Promise.race([showP.p, resolveP]), resolveToken), {
							cancel: () => showP.cancel()
						}, 0);

						if (resolved) {
							edit.insertText = resolved.insertText;
							edit.additionalEdit = resolved.additionalEdit;
						}
						return edit;
					}, token);
				}

				await this.applyDefaultPasteHandler(dataTransfer, metadata, token, clipboardEvent);
			} finally {
				disposables.dispose();
				if (this._currentPasteOperation === p) {
					this._currentPasteOperation = undefined;
				}
			}
		});

		this._pasteProgressManager.showWhile(selections[0].getEndPosition(), localize('pasteIntoEditorProgress', "Running paste handlers. Click to cancel and do basic paste"), p, {
			cancel: async () => {
				p.cancel();
				if (editorStateCts.token.isCancellationRequested) {
					return;
				}

				await this.applyDefaultPasteHandler(dataTransfer, metadata, editorStateCts.token, clipboardEvent);
			}
		}).finally(() => {
			editorStateCts.dispose();
		});
		this._currentPasteOperation = p;
	}

	private showPasteAsPick(preference: PastePreference | undefined, allProviders: readonly DocumentPasteEditProvider[], selections: readonly Selection[], dataTransfer: VSDataTransfer, metadata: CopyMetadata | undefined): void {
		this._logService.trace('CopyPasteController#showPasteAsPick');
		const p = createCancelablePromise(async (token) => {
			const editor = this._editor;
			if (!editor.hasModel()) {
				return;
			}
			const model = editor.getModel();

			const disposables = new DisposableStore();
			const tokenSource = disposables.add(new EditorStateCancellationTokenSource(editor, CodeEditorStateFlag.Value | CodeEditorStateFlag.Selection, undefined, token));
			try {
				await this.mergeInDataFromCopy(allProviders, dataTransfer, metadata, tokenSource.token);
				if (tokenSource.token.isCancellationRequested) {
					return;
				}

				// Filter out any providers the don't match the full data transfer we will send them.
				let supportedProviders = allProviders.filter(provider => this.isSupportedPasteProvider(provider, dataTransfer, preference));
				if (preference) {
					// We are looking for a specific edit
					supportedProviders = supportedProviders.filter(provider => this.providerMatchesPreference(provider, preference));
				}

				const context: DocumentPasteContext = {
					triggerKind: DocumentPasteTriggerKind.PasteAs,
					only: preference && 'only' in preference ? preference.only : undefined,
				};
				let editSession = disposables.add(await this.getPasteEdits(supportedProviders, dataTransfer, model, selections, context, tokenSource.token));
				if (tokenSource.token.isCancellationRequested) {
					return;
				}

				// Filter out any edits that don't match the requested kind
				if (preference) {
					editSession = {
						edits: editSession.edits.filter(edit => {
							if ('only' in preference) {
								return preference.only.contains(edit.kind);
							} else if ('preferences' in preference) {
								return preference.preferences.some(preference => preference.contains(edit.kind));
							} else {
								return preference.providerId === edit.provider.id;
							}
						}),
						dispose: editSession.dispose
					};
				}

				if (!editSession.edits.length) {
					if (preference) {
						this.showPasteAsNoEditMessage(selections, preference);
					}
					return;
				}

				let pickedEdit: DocumentPasteEdit | undefined;
				if (preference) {
					pickedEdit = editSession.edits.at(0);
				} else {
					type ItemWithEdit = IQuickPickItem & { edit?: DocumentPasteEdit };
					const configureDefaultItem: ItemWithEdit = {
						id: 'editor.pasteAs.default',
						label: localize('pasteAsDefault', "Configure default paste action"),
						edit: undefined,
					};

					const selected = await this._quickInputService.pick<ItemWithEdit>(
						[
							...editSession.edits.map((edit): ItemWithEdit => ({
								label: edit.title,
								description: edit.kind?.value,
								edit,
							})),
							...(CopyPasteController._configureDefaultAction ? [
								upcast<IQuickPickSeparator>({ type: 'separator' }),
								{
									label: CopyPasteController._configureDefaultAction.label,
									edit: undefined,
								}
							] : [])
						], {
						placeHolder: localize('pasteAsPickerPlaceholder', "Select Paste Action"),
					});

					if (selected === configureDefaultItem) {
						CopyPasteController._configureDefaultAction?.run();
						return;
					}

					pickedEdit = selected?.edit;
				}

				if (!pickedEdit) {
					return;
				}

				const combinedWorkspaceEdit = createCombinedWorkspaceEdit(model.uri, selections, pickedEdit);
				await this._bulkEditService.apply(combinedWorkspaceEdit, { editor: this._editor });
			} finally {
				disposables.dispose();
				if (this._currentPasteOperation === p) {
					this._currentPasteOperation = undefined;
				}
			}
		});

		this._progressService.withProgress({
			location: ProgressLocation.Window,
			title: localize('pasteAsProgress', "Running paste handlers"),
		}, () => p);
	}

	private setCopyMetadata(dataTransfer: DataTransfer, metadata: CopyMetadata) {
		this._logService.trace('CopyPasteController#setCopyMetadata new id : ', metadata.id);
		dataTransfer.setData(vscodeClipboardMime, JSON.stringify(metadata));
	}

	private fetchCopyMetadata(e: ClipboardEvent): CopyMetadata | undefined {
		this._logService.trace('CopyPasteController#fetchCopyMetadata');
		if (!e.clipboardData) {
			return;
		}

		// Prefer using the clipboard data we saved off
		const rawMetadata = e.clipboardData.getData(vscodeClipboardMime);
		if (rawMetadata) {
			try {
				return JSON.parse(rawMetadata);
			} catch {
				return undefined;
			}
		}

		// Otherwise try to extract the generic text editor metadata
		const [_, metadata] = ClipboardEventUtils.getTextData(e.clipboardData);
		if (metadata) {
			return {
				defaultPastePayload: {
					mode: metadata.mode,
					multicursorText: metadata.multicursorText ?? null,
					pasteOnNewLine: !!metadata.isFromEmptySelection,
				},
			};
		}

		return undefined;
	}

	private async mergeInDataFromCopy(allProviders: readonly DocumentPasteEditProvider[], dataTransfer: VSDataTransfer, metadata: CopyMetadata | undefined, token: CancellationToken): Promise<void> {
		this._logService.trace('CopyPasteController#mergeInDataFromCopy with metadata : ', metadata?.id);
		if (metadata?.id && CopyPasteController._currentCopyOperation?.handle === metadata.id) {
			// Only resolve providers that have data we may care about
			const toResolve = CopyPasteController._currentCopyOperation.operations
				.filter(op => allProviders.some(provider => provider.pasteMimeTypes.some(type => matchesMimeType(type, op.providerMimeTypes))))
				.map(op => op.operation);

			const toMergeResults = await Promise.all(toResolve);
			if (token.isCancellationRequested) {
				return;
			}

			// Values from higher priority providers should overwrite values from lower priority ones.
			// Reverse the array to so that the calls to `DataTransfer.replace` later will do this
			for (const toMergeData of toMergeResults.reverse()) {
				if (toMergeData) {
					for (const [key, value] of toMergeData) {
						dataTransfer.replace(key, value);
					}
				}
			}
		}

		if (!dataTransfer.has(Mimes.uriList)) {
			const resources = await this._clipboardService.readResources();
			if (token.isCancellationRequested) {
				return;
			}

			if (resources.length) {
				dataTransfer.append(Mimes.uriList, createStringDataTransferItem(UriList.create(resources)));
			}
		}
	}

	private async getPasteEdits(providers: readonly DocumentPasteEditProvider[], dataTransfer: VSDataTransfer, model: ITextModel, selections: readonly Selection[], context: DocumentPasteContext, token: CancellationToken): Promise<DocumentPasteWithProviderEditsSession> {
		const disposables = new DisposableStore();

		const results = await raceCancellation(
			Promise.all(providers.map(async provider => {
				try {
					const edits = await provider.provideDocumentPasteEdits?.(model, selections, dataTransfer, context, token);
					if (edits) {
						disposables.add(edits);
					}
					return edits?.edits?.map(edit => ({ ...edit, provider }));
				} catch (err) {
					if (!isCancellationError(err)) {
						console.error(err);
					}
					return undefined;
				}
			})),
			token);
		const edits = coalesce(results ?? []).flat().filter(edit => {
			return !context.only || context.only.contains(edit.kind);
		});
		return {
			edits: sortEditsByYieldTo(edits),
			dispose: () => disposables.dispose()
		};
	}

	private async applyDefaultPasteHandler(dataTransfer: VSDataTransfer, metadata: CopyMetadata | undefined, token: CancellationToken, clipboardEvent: ClipboardEvent) {
		const textDataTransfer = dataTransfer.get(Mimes.text) ?? dataTransfer.get('text');
		const text = (await textDataTransfer?.asString()) ?? '';
		if (token.isCancellationRequested) {
			return;
		}

		const payload: PastePayload = {
			clipboardEvent,
			text,
			pasteOnNewLine: metadata?.defaultPastePayload.pasteOnNewLine ?? false,
			multicursorText: metadata?.defaultPastePayload.multicursorText ?? null,
			mode: null,
		};
		this._logService.trace('CopyPasteController#applyDefaultPasteHandler for id : ', metadata?.id);
		this._editor.trigger('keyboard', Handler.Paste, payload);
	}

	/**
	 * Filter out providers if they:
	 * - Don't handle any of the data transfer types we have
	 * - Don't match the preferred paste kind
	 */
	private isSupportedPasteProvider(provider: DocumentPasteEditProvider, dataTransfer: VSDataTransfer, preference?: PastePreference): boolean {
		if (!provider.pasteMimeTypes?.some(type => dataTransfer.matches(type))) {
			return false;
		}

		return !preference || this.providerMatchesPreference(provider, preference);
	}

	private providerMatchesPreference(provider: DocumentPasteEditProvider, preference: PastePreference): boolean {
		if ('only' in preference) {
			return provider.providedPasteEditKinds.some(providedKind => preference.only.contains(providedKind));
		} else if ('preferences' in preference) {
			return preference.preferences.some(providedKind => preference.preferences.some(preferredKind => preferredKind.contains(providedKind)));
		} else {
			return provider.id === preference.providerId;
		}
	}

	private getInitialActiveEditIndex(model: ITextModel, edits: readonly DocumentPasteEdit[]): number {
		const preferredProviders = this._configService.getValue<PreferredPasteConfiguration[]>(pasteAsPreferenceConfig, { resource: model.uri });
		for (const config of Array.isArray(preferredProviders) ? preferredProviders : []) {
			const desiredKind = new HierarchicalKind(config);
			const editIndex = edits.findIndex(edit => desiredKind.contains(edit.kind));
			if (editIndex >= 0) {
				return editIndex;
			}
		}

		return 0;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/dropOrPasteInto/browser/defaultProviders.ts]---
Location: vscode-main/src/vs/editor/contrib/dropOrPasteInto/browser/defaultProviders.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IReadonlyVSDataTransfer, UriList } from '../../../../base/common/dataTransfer.js';
import { HierarchicalKind } from '../../../../base/common/hierarchicalKind.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Mimes } from '../../../../base/common/mime.js';
import { Schemas } from '../../../../base/common/network.js';
import { relativePath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IPosition } from '../../../common/core/position.js';
import { IRange } from '../../../common/core/range.js';
import { DocumentDropEditProvider, DocumentDropEditsSession, DocumentPasteContext, DocumentPasteEdit, DocumentPasteEditProvider, DocumentPasteEditsSession, DocumentPasteTriggerKind } from '../../../common/languages.js';
import { LanguageFilter } from '../../../common/languageSelector.js';
import { ITextModel } from '../../../common/model.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';


abstract class SimplePasteAndDropProvider implements DocumentDropEditProvider, DocumentPasteEditProvider {

	readonly kind: HierarchicalKind;
	readonly providedDropEditKinds: HierarchicalKind[];
	readonly providedPasteEditKinds: HierarchicalKind[];

	abstract readonly dropMimeTypes: readonly string[] | undefined;
	readonly copyMimeTypes = [];
	abstract readonly pasteMimeTypes: readonly string[];

	constructor(kind: HierarchicalKind) {
		this.kind = kind;
		this.providedDropEditKinds = [this.kind];
		this.providedPasteEditKinds = [this.kind];
	}

	async provideDocumentPasteEdits(_model: ITextModel, _ranges: readonly IRange[], dataTransfer: IReadonlyVSDataTransfer, context: DocumentPasteContext, token: CancellationToken): Promise<DocumentPasteEditsSession | undefined> {
		const edit = await this.getEdit(dataTransfer, token);
		if (!edit) {
			return undefined;
		}

		return {
			edits: [{ insertText: edit.insertText, title: edit.title, kind: edit.kind, handledMimeType: edit.handledMimeType, yieldTo: edit.yieldTo }],
			dispose() { },
		};
	}

	async provideDocumentDropEdits(_model: ITextModel, _position: IPosition, dataTransfer: IReadonlyVSDataTransfer, token: CancellationToken): Promise<DocumentDropEditsSession | undefined> {
		const edit = await this.getEdit(dataTransfer, token);
		if (!edit) {
			return;
		}
		return {
			edits: [{ insertText: edit.insertText, title: edit.title, kind: edit.kind, handledMimeType: edit.handledMimeType, yieldTo: edit.yieldTo }],
			dispose() { },
		};
	}

	protected abstract getEdit(dataTransfer: IReadonlyVSDataTransfer, token: CancellationToken): Promise<DocumentPasteEdit | undefined>;
}

export class DefaultTextPasteOrDropEditProvider extends SimplePasteAndDropProvider {

	static readonly id = 'text';

	readonly id = DefaultTextPasteOrDropEditProvider.id;
	readonly dropMimeTypes = [Mimes.text];
	readonly pasteMimeTypes = [Mimes.text];

	constructor() {
		super(HierarchicalKind.Empty.append('text', 'plain'));
	}

	protected async getEdit(dataTransfer: IReadonlyVSDataTransfer, _token: CancellationToken): Promise<DocumentPasteEdit | undefined> {
		const textEntry = dataTransfer.get(Mimes.text);
		if (!textEntry) {
			return;
		}

		// Suppress if there's also a uriList entry.
		// Typically the uri-list contains the same text as the text entry so showing both is confusing.
		if (dataTransfer.has(Mimes.uriList)) {
			return;
		}

		const insertText = await textEntry.asString();
		return {
			handledMimeType: Mimes.text,
			title: localize('text.label', "Insert Plain Text"),
			insertText,
			kind: this.kind,
		};
	}
}

class PathProvider extends SimplePasteAndDropProvider {

	readonly dropMimeTypes = [Mimes.uriList];
	readonly pasteMimeTypes = [Mimes.uriList];

	constructor() {
		super(HierarchicalKind.Empty.append('uri', 'path', 'absolute'));
	}

	protected async getEdit(dataTransfer: IReadonlyVSDataTransfer, token: CancellationToken): Promise<DocumentPasteEdit | undefined> {
		const entries = await extractUriList(dataTransfer);
		if (!entries.length || token.isCancellationRequested) {
			return;
		}

		let uriCount = 0;
		const insertText = entries
			.map(({ uri, originalText }) => {
				if (uri.scheme === Schemas.file) {
					return uri.fsPath;
				} else {
					uriCount++;
					return originalText;
				}
			})
			.join(' ');

		let label: string;
		if (uriCount > 0) {
			// Dropping at least one generic uri (such as https) so use most generic label
			label = entries.length > 1
				? localize('defaultDropProvider.uriList.uris', "Insert Uris")
				: localize('defaultDropProvider.uriList.uri', "Insert Uri");
		} else {
			// All the paths are file paths
			label = entries.length > 1
				? localize('defaultDropProvider.uriList.paths', "Insert Paths")
				: localize('defaultDropProvider.uriList.path', "Insert Path");
		}

		return {
			handledMimeType: Mimes.uriList,
			insertText,
			title: label,
			kind: this.kind,
		};
	}
}

class RelativePathProvider extends SimplePasteAndDropProvider {

	readonly dropMimeTypes = [Mimes.uriList];
	readonly pasteMimeTypes = [Mimes.uriList];

	constructor(
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService
	) {
		super(HierarchicalKind.Empty.append('uri', 'path', 'relative'));
	}

	protected async getEdit(dataTransfer: IReadonlyVSDataTransfer, token: CancellationToken): Promise<DocumentPasteEdit | undefined> {
		const entries = await extractUriList(dataTransfer);
		if (!entries.length || token.isCancellationRequested) {
			return;
		}

		const relativeUris = coalesce(entries.map(({ uri }) => {
			const root = this._workspaceContextService.getWorkspaceFolder(uri);
			return root ? relativePath(root.uri, uri) : undefined;
		}));

		if (!relativeUris.length) {
			return;
		}

		return {
			handledMimeType: Mimes.uriList,
			insertText: relativeUris.join(' '),
			title: entries.length > 1
				? localize('defaultDropProvider.uriList.relativePaths', "Insert Relative Paths")
				: localize('defaultDropProvider.uriList.relativePath', "Insert Relative Path"),
			kind: this.kind,
		};
	}
}

class PasteHtmlProvider implements DocumentPasteEditProvider {

	public readonly kind = new HierarchicalKind('html');
	public readonly providedPasteEditKinds = [this.kind];

	public readonly copyMimeTypes = [];
	public readonly pasteMimeTypes = ['text/html'];

	private readonly _yieldTo = [{ mimeType: Mimes.text }];

	async provideDocumentPasteEdits(_model: ITextModel, _ranges: readonly IRange[], dataTransfer: IReadonlyVSDataTransfer, context: DocumentPasteContext, token: CancellationToken): Promise<DocumentPasteEditsSession | undefined> {
		if (context.triggerKind !== DocumentPasteTriggerKind.PasteAs && !context.only?.contains(this.kind)) {
			return;
		}

		const entry = dataTransfer.get('text/html');
		const htmlText = await entry?.asString();
		if (!htmlText || token.isCancellationRequested) {
			return;
		}

		return {
			dispose() { },
			edits: [{
				insertText: htmlText,
				yieldTo: this._yieldTo,
				title: localize('pasteHtmlLabel', 'Insert HTML'),
				kind: this.kind,
			}],
		};
	}
}

async function extractUriList(dataTransfer: IReadonlyVSDataTransfer): Promise<{ readonly uri: URI; readonly originalText: string }[]> {
	const urlListEntry = dataTransfer.get(Mimes.uriList);
	if (!urlListEntry) {
		return [];
	}

	const strUriList = await urlListEntry.asString();
	const entries: { readonly uri: URI; readonly originalText: string }[] = [];
	for (const entry of UriList.parse(strUriList)) {
		try {
			entries.push({ uri: URI.parse(entry), originalText: entry });
		} catch {
			// noop
		}
	}
	return entries;
}

const genericLanguageSelector: LanguageFilter = { scheme: '*', hasAccessToAllModels: true };

export class DefaultDropProvidersFeature extends Disposable {
	constructor(
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@IWorkspaceContextService workspaceContextService: IWorkspaceContextService,
	) {
		super();

		this._register(languageFeaturesService.documentDropEditProvider.register(genericLanguageSelector, new DefaultTextPasteOrDropEditProvider()));
		this._register(languageFeaturesService.documentDropEditProvider.register(genericLanguageSelector, new PathProvider()));
		this._register(languageFeaturesService.documentDropEditProvider.register(genericLanguageSelector, new RelativePathProvider(workspaceContextService)));
	}
}

export class DefaultPasteProvidersFeature extends Disposable {
	constructor(
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@IWorkspaceContextService workspaceContextService: IWorkspaceContextService,
	) {
		super();

		this._register(languageFeaturesService.documentPasteEditProvider.register(genericLanguageSelector, new DefaultTextPasteOrDropEditProvider()));
		this._register(languageFeaturesService.documentPasteEditProvider.register(genericLanguageSelector, new PathProvider()));
		this._register(languageFeaturesService.documentPasteEditProvider.register(genericLanguageSelector, new RelativePathProvider(workspaceContextService)));
		this._register(languageFeaturesService.documentPasteEditProvider.register(genericLanguageSelector, new PasteHtmlProvider()));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/dropOrPasteInto/browser/dropIntoEditorContribution.ts]---
Location: vscode-main/src/vs/editor/contrib/dropOrPasteInto/browser/dropIntoEditorContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorCommand, EditorContributionInstantiation, ServicesAccessor, registerEditorCommand, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { registerEditorFeature } from '../../../common/editorFeatures.js';
import { DefaultDropProvidersFeature } from './defaultProviders.js';
import { DropIntoEditorController, changeDropTypeCommandId, dropWidgetVisibleCtx } from './dropIntoEditorController.js';

registerEditorContribution(DropIntoEditorController.ID, DropIntoEditorController, EditorContributionInstantiation.BeforeFirstInteraction);
registerEditorFeature(DefaultDropProvidersFeature);

registerEditorCommand(new class extends EditorCommand {
	constructor() {
		super({
			id: changeDropTypeCommandId,
			precondition: dropWidgetVisibleCtx,
			kbOpts: {
				weight: KeybindingWeight.EditorContrib,
				primary: KeyMod.CtrlCmd | KeyCode.Period,
			}
		});
	}

	public override runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor, _args: unknown) {
		DropIntoEditorController.get(editor)?.changeDropType();
	}
});

registerEditorCommand(new class extends EditorCommand {
	constructor() {
		super({
			id: 'editor.hideDropWidget',
			precondition: dropWidgetVisibleCtx,
			kbOpts: {
				weight: KeybindingWeight.EditorContrib,
				primary: KeyCode.Escape,
			}
		});
	}

	public override runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor, _args: unknown) {
		DropIntoEditorController.get(editor)?.clearWidgets();
	}
});

export type PreferredDropConfiguration = string;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/dropOrPasteInto/browser/dropIntoEditorController.ts]---
Location: vscode-main/src/vs/editor/contrib/dropOrPasteInto/browser/dropIntoEditorController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction } from '../../../../base/common/actions.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { CancelablePromise, createCancelablePromise, raceCancellation } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { VSDataTransfer } from '../../../../base/common/dataTransfer.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { HierarchicalKind } from '../../../../base/common/hierarchicalKind.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { LocalSelectionTransfer } from '../../../../platform/dnd/browser/dnd.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { toExternalVSDataTransfer } from '../../../browser/dataTransfer.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IPosition } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { DocumentDropEdit, DocumentDropEditProvider } from '../../../common/languages.js';
import { ITextModel } from '../../../common/model.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { DraggedTreeItemsIdentifier } from '../../../common/services/treeViewsDnd.js';
import { ITreeViewsDnDService } from '../../../common/services/treeViewsDndService.js';
import { CodeEditorStateFlag, EditorStateCancellationTokenSource } from '../../editorState/browser/editorState.js';
import { InlineProgressManager } from '../../inlineProgress/browser/inlineProgress.js';
import { PreferredDropConfiguration } from './dropIntoEditorContribution.js';
import { sortEditsByYieldTo } from './edit.js';
import { PostEditWidgetManager } from './postEditWidget.js';

export const dropAsPreferenceConfig = 'editor.dropIntoEditor.preferences';

export const changeDropTypeCommandId = 'editor.changeDropType';

export const dropWidgetVisibleCtx = new RawContextKey<boolean>('dropWidgetVisible', false, localize('dropWidgetVisible', "Whether the drop widget is showing"));

export class DropIntoEditorController extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.dropIntoEditorController';

	public static get(editor: ICodeEditor): DropIntoEditorController | null {
		return editor.getContribution<DropIntoEditorController>(DropIntoEditorController.ID);
	}

	public static setConfigureDefaultAction(action: IAction) {
		this._configureDefaultAction = action;
	}

	private static _configureDefaultAction?: IAction;

	/**
	 * Global tracking the current drop operation.
	 *
	 * TODO: figure out how to make this work with multiple windows
	 */
	private static _currentDropOperation?: CancelablePromise<void>;

	private readonly _dropProgressManager: InlineProgressManager;
	private readonly _postDropWidgetManager: PostEditWidgetManager<DocumentDropEdit>;

	private readonly treeItemsTransfer = LocalSelectionTransfer.getInstance<DraggedTreeItemsIdentifier>();

	constructor(
		editor: ICodeEditor,
		@IInstantiationService instantiationService: IInstantiationService,
		@IConfigurationService private readonly _configService: IConfigurationService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@ITreeViewsDnDService private readonly _treeViewsDragAndDropService: ITreeViewsDnDService
	) {
		super();

		this._dropProgressManager = this._register(instantiationService.createInstance(InlineProgressManager, 'dropIntoEditor', editor));
		this._postDropWidgetManager = this._register(instantiationService.createInstance(PostEditWidgetManager, 'dropIntoEditor', editor, dropWidgetVisibleCtx,
			{ id: changeDropTypeCommandId, label: localize('postDropWidgetTitle', "Show drop options...") },
			() => DropIntoEditorController._configureDefaultAction ? [DropIntoEditorController._configureDefaultAction] : []));

		this._register(editor.onDropIntoEditor(e => this.onDropIntoEditor(editor, e.position, e.event)));
	}

	public clearWidgets() {
		this._postDropWidgetManager.clear();
	}

	public changeDropType() {
		this._postDropWidgetManager.tryShowSelector();
	}

	private async onDropIntoEditor(editor: ICodeEditor, position: IPosition, dragEvent: DragEvent) {
		if (!dragEvent.dataTransfer || !editor.hasModel()) {
			return;
		}

		DropIntoEditorController._currentDropOperation?.cancel();

		editor.focus();
		editor.setPosition(position);

		const p = createCancelablePromise(async (token) => {
			const disposables = new DisposableStore();

			const tokenSource = disposables.add(new EditorStateCancellationTokenSource(editor, CodeEditorStateFlag.Value, undefined, token));
			try {
				const ourDataTransfer = await this.extractDataTransferData(dragEvent);
				if (ourDataTransfer.size === 0 || tokenSource.token.isCancellationRequested) {
					return;
				}

				const model = editor.getModel();
				if (!model) {
					return;
				}

				const providers = this._languageFeaturesService.documentDropEditProvider
					.ordered(model)
					.filter(provider => {
						if (!provider.dropMimeTypes) {
							// Keep all providers that don't specify mime types
							return true;
						}
						return provider.dropMimeTypes.some(mime => ourDataTransfer.matches(mime));
					});

				const editSession = disposables.add(await this.getDropEdits(providers, model, position, ourDataTransfer, tokenSource.token));
				if (tokenSource.token.isCancellationRequested) {
					return;
				}

				if (editSession.edits.length) {
					const activeEditIndex = this.getInitialActiveEditIndex(model, editSession.edits);
					const canShowWidget = editor.getOption(EditorOption.dropIntoEditor).showDropSelector === 'afterDrop';
					// Pass in the parent token here as it tracks cancelling the entire drop operation
					await this._postDropWidgetManager.applyEditAndShowIfNeeded([Range.fromPositions(position)], { activeEditIndex, allEdits: editSession.edits }, canShowWidget, async edit => edit, token);
				}
			} finally {
				disposables.dispose();
				if (DropIntoEditorController._currentDropOperation === p) {
					DropIntoEditorController._currentDropOperation = undefined;
				}
			}
		});

		this._dropProgressManager.showWhile(position, localize('dropIntoEditorProgress', "Running drop handlers. Click to cancel"), p, { cancel: () => p.cancel() });
		DropIntoEditorController._currentDropOperation = p;
	}

	private async getDropEdits(providers: readonly DocumentDropEditProvider[], model: ITextModel, position: IPosition, dataTransfer: VSDataTransfer, token: CancellationToken) {
		const disposables = new DisposableStore();

		const results = await raceCancellation(Promise.all(providers.map(async provider => {
			try {
				const edits = await provider.provideDocumentDropEdits(model, position, dataTransfer, token);
				if (edits) {
					disposables.add(edits);
				}
				return edits?.edits.map(edit => ({ ...edit, providerId: provider.id }));
			} catch (err) {
				if (!isCancellationError(err)) {
					console.error(err);
				}
				console.error(err);
			}
			return undefined;
		})), token);

		const edits = coalesce(results ?? []).flat();
		return {
			edits: sortEditsByYieldTo(edits),
			dispose: () => disposables.dispose()
		};
	}

	private getInitialActiveEditIndex(model: ITextModel, edits: ReadonlyArray<DocumentDropEdit>): number {
		const preferredProviders = this._configService.getValue<PreferredDropConfiguration[]>(dropAsPreferenceConfig, { resource: model.uri });
		for (const config of Array.isArray(preferredProviders) ? preferredProviders : []) {
			const desiredKind = new HierarchicalKind(config);
			const editIndex = edits.findIndex(edit => edit.kind && desiredKind.contains(edit.kind));
			if (editIndex >= 0) {
				return editIndex;
			}
		}
		return 0;
	}

	private async extractDataTransferData(dragEvent: DragEvent): Promise<VSDataTransfer> {
		if (!dragEvent.dataTransfer) {
			return new VSDataTransfer();
		}

		const dataTransfer = toExternalVSDataTransfer(dragEvent.dataTransfer);

		if (this.treeItemsTransfer.hasData(DraggedTreeItemsIdentifier.prototype)) {
			const data = this.treeItemsTransfer.getData(DraggedTreeItemsIdentifier.prototype);
			if (Array.isArray(data)) {
				for (const id of data) {
					const treeDataTransfer = await this._treeViewsDragAndDropService.removeDragOperationTransfer(id.identifier);
					if (treeDataTransfer) {
						for (const [type, value] of treeDataTransfer) {
							dataTransfer.replace(type, value);
						}
					}
				}
			}
		}

		return dataTransfer;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/dropOrPasteInto/browser/edit.ts]---
Location: vscode-main/src/vs/editor/contrib/dropOrPasteInto/browser/edit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { ResourceTextEdit } from '../../../browser/services/bulkEditService.js';
import { DocumentDropEdit, DocumentPasteEdit, DropYieldTo, WorkspaceEdit } from '../../../common/languages.js';
import { Range } from '../../../common/core/range.js';
import { SnippetParser } from '../../snippet/browser/snippetParser.js';
import { HierarchicalKind } from '../../../../base/common/hierarchicalKind.js';

/**
 * Given a {@link DropOrPasteEdit} and set of ranges, creates a {@link WorkspaceEdit} that applies the insert text from
 * the {@link DropOrPasteEdit} at each range plus any additional edits.
 */
export function createCombinedWorkspaceEdit(uri: URI, ranges: readonly Range[], edit: DocumentPasteEdit | DocumentDropEdit): WorkspaceEdit {
	// If the edit insert text is empty, skip applying at each range
	if (typeof edit.insertText === 'string' ? edit.insertText === '' : edit.insertText.snippet === '') {
		return {
			edits: edit.additionalEdit?.edits ?? []
		};
	}

	return {
		edits: [
			...ranges.map(range =>
				new ResourceTextEdit(uri,
					{ range, text: typeof edit.insertText === 'string' ? SnippetParser.escape(edit.insertText) + '$0' : edit.insertText.snippet, insertAsSnippet: true }
				)),
			...(edit.additionalEdit?.edits ?? [])
		]
	};
}

export function sortEditsByYieldTo<T extends {
	readonly kind: HierarchicalKind | undefined;
	readonly handledMimeType?: string;
	readonly yieldTo?: readonly DropYieldTo[];
}>(edits: readonly T[]): T[] {
	function yieldsTo(yTo: DropYieldTo, other: T): boolean {
		if ('mimeType' in yTo) {
			return yTo.mimeType === other.handledMimeType;
		}
		return !!other.kind && yTo.kind.contains(other.kind);
	}

	// Build list of nodes each node yields to
	const yieldsToMap = new Map<T, T[]>();
	for (const edit of edits) {
		for (const yTo of edit.yieldTo ?? []) {
			for (const other of edits) {
				if (other === edit) {
					continue;
				}

				if (yieldsTo(yTo, other)) {
					let arr = yieldsToMap.get(edit);
					if (!arr) {
						arr = [];
						yieldsToMap.set(edit, arr);
					}
					arr.push(other);
				}
			}
		}
	}

	if (!yieldsToMap.size) {
		return Array.from(edits);
	}

	// Topological sort
	const visited = new Set<T>();
	const tempStack: T[] = [];

	function visit(nodes: T[]): T[] {
		if (!nodes.length) {
			return [];
		}

		const node = nodes[0];
		if (tempStack.includes(node)) {
			console.warn('Yield to cycle detected', node);
			return nodes;
		}

		if (visited.has(node)) {
			return visit(nodes.slice(1));
		}

		let pre: T[] = [];
		const yTo = yieldsToMap.get(node);
		if (yTo) {
			tempStack.push(node);
			pre = visit(yTo);
			tempStack.pop();
		}

		visited.add(node);

		return [...pre, node, ...visit(nodes.slice(1))];
	}

	return visit(Array.from(edits));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/dropOrPasteInto/browser/postEditWidget.css]---
Location: vscode-main/src/vs/editor/contrib/dropOrPasteInto/browser/postEditWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.post-edit-widget {
	box-shadow: 0 0 8px 2px var(--vscode-widget-shadow);
	border: 1px solid var(--vscode-widget-border, transparent);
	border-radius: 4px;
	color: var(--vscode-button-foreground);
	background-color: var(--vscode-button-background);
	overflow: hidden;
}

.post-edit-widget .monaco-button {
	padding: 2px;
	border: none;
	border-radius: 0;
}

.post-edit-widget .monaco-button:hover {
	background-color: var(--vscode-button-hoverBackground) !important;
}

.post-edit-widget .monaco-button .codicon {
	margin: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/dropOrPasteInto/browser/postEditWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/dropOrPasteInto/browser/postEditWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { IAction } from '../../../../base/common/actions.js';
import { raceCancellationError } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { localize } from '../../../../nls.js';
import { ActionListItemKind, IActionListItem } from '../../../../platform/actionWidget/browser/actionList.js';
import { IActionWidgetService } from '../../../../platform/actionWidget/browser/actionWidget.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidget, IContentWidgetPosition } from '../../../browser/editorBrowser.js';
import { IBulkEditResult, IBulkEditService } from '../../../browser/services/bulkEditService.js';
import { Range } from '../../../common/core/range.js';
import { DocumentDropEdit, DocumentPasteEdit } from '../../../common/languages.js';
import { TrackedRangeStickiness } from '../../../common/model.js';
import { CodeEditorStateFlag, EditorStateCancellationTokenSource } from '../../editorState/browser/editorState.js';
import { createCombinedWorkspaceEdit } from './edit.js';
import './postEditWidget.css';


interface EditSet<Edit extends DocumentPasteEdit | DocumentDropEdit> {
	readonly activeEditIndex: number;
	readonly allEdits: ReadonlyArray<Edit>;
}

interface ShowCommand {
	readonly id: string;
	readonly label: string;
}

class PostEditWidget<T extends DocumentPasteEdit | DocumentDropEdit> extends Disposable implements IContentWidget {
	private static readonly baseId = 'editor.widget.postEditWidget';

	readonly allowEditorOverflow = true;
	readonly suppressMouseDown = true;

	private domNode!: HTMLElement;
	private button!: Button;

	private readonly visibleContext: IContextKey<boolean>;

	constructor(
		private readonly typeId: string,
		private readonly editor: ICodeEditor,
		visibleContext: RawContextKey<boolean>,
		private readonly showCommand: ShowCommand,
		private readonly range: Range,
		private readonly edits: EditSet<T>,
		private readonly onSelectNewEdit: (editIndex: number) => void,
		private readonly additionalActions: readonly IAction[],
		@IContextKeyService contextKeyService: IContextKeyService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IActionWidgetService private readonly _actionWidgetService: IActionWidgetService,
	) {
		super();

		this.create();

		this.visibleContext = visibleContext.bindTo(contextKeyService);
		this.visibleContext.set(true);
		this._register(toDisposable(() => this.visibleContext.reset()));

		this.editor.addContentWidget(this);
		this.editor.layoutContentWidget(this);

		this._register(toDisposable((() => this.editor.removeContentWidget(this))));

		this._register(this.editor.onDidChangeCursorPosition(e => {
			this.dispose();
		}));

		this._register(Event.runAndSubscribe(_keybindingService.onDidUpdateKeybindings, () => {
			this._updateButtonTitle();
		}));
	}

	private _updateButtonTitle() {
		const binding = this._keybindingService.lookupKeybinding(this.showCommand.id)?.getLabel();
		this.button.element.title = this.showCommand.label + (binding ? ` (${binding})` : '');
	}

	private create(): void {
		this.domNode = dom.$('.post-edit-widget');

		this.button = this._register(new Button(this.domNode, {
			supportIcons: true,
		}));
		this.button.label = '$(insert)';

		this._register(dom.addDisposableListener(this.domNode, dom.EventType.CLICK, () => this.showSelector()));
	}

	getId(): string {
		return PostEditWidget.baseId + '.' + this.typeId;
	}

	getDomNode(): HTMLElement {
		return this.domNode;
	}

	getPosition(): IContentWidgetPosition | null {
		return {
			position: this.range.getEndPosition(),
			preference: [ContentWidgetPositionPreference.BELOW]
		};
	}

	showSelector() {
		const pos = dom.getDomNodePagePosition(this.button.element);
		const anchor = { x: pos.left + pos.width, y: pos.top + pos.height };

		this._actionWidgetService.show('postEditWidget', false,
			this.edits.allEdits.map((edit, i): IActionListItem<T> => {
				return {
					kind: ActionListItemKind.Action,
					item: edit,
					label: edit.title,
					disabled: false,
					canPreview: false,
					group: { title: '', icon: ThemeIcon.fromId(i === this.edits.activeEditIndex ? Codicon.check.id : Codicon.blank.id) },
				};
			}), {
			onHide: () => {
				this.editor.focus();
			},
			onSelect: (item) => {
				this._actionWidgetService.hide(false);

				const i = this.edits.allEdits.findIndex(edit => edit === item);
				if (i !== this.edits.activeEditIndex) {
					return this.onSelectNewEdit(i);
				}
			},
		}, anchor, this.editor.getDomNode() ?? undefined, this.additionalActions);
	}
}

export class PostEditWidgetManager<T extends DocumentPasteEdit | DocumentDropEdit> extends Disposable {

	private readonly _currentWidget = this._register(new MutableDisposable<PostEditWidget<T>>());

	constructor(
		private readonly _id: string,
		private readonly _editor: ICodeEditor,
		private readonly _visibleContext: RawContextKey<boolean>,
		private readonly _showCommand: ShowCommand,
		private readonly _getAdditionalActions: () => readonly IAction[],
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IBulkEditService private readonly _bulkEditService: IBulkEditService,
		@INotificationService private readonly _notificationService: INotificationService,
	) {
		super();

		this._register(Event.any(
			_editor.onDidChangeModel,
			_editor.onDidChangeModelContent,
		)(() => this.clear()));
	}

	public async applyEditAndShowIfNeeded(ranges: readonly Range[], edits: EditSet<T>, canShowWidget: boolean, resolve: (edit: T, token: CancellationToken) => Promise<T>, token: CancellationToken) {
		if (!ranges.length || !this._editor.hasModel()) {
			return;
		}

		const model = this._editor.getModel();
		const edit = edits.allEdits.at(edits.activeEditIndex);
		if (!edit) {
			return;
		}

		const onDidSelectEdit = async (newEditIndex: number) => {
			const model = this._editor.getModel();
			if (!model) {
				return;
			}

			await model.undo();
			this.applyEditAndShowIfNeeded(ranges, { activeEditIndex: newEditIndex, allEdits: edits.allEdits }, canShowWidget, resolve, token);
		};

		const handleError = (e: Error, message: string) => {
			if (isCancellationError(e)) {
				return;
			}

			this._notificationService.error(message);
			if (canShowWidget) {
				this.show(ranges[0], edits, onDidSelectEdit);
			}
		};

		const editorStateCts = new EditorStateCancellationTokenSource(this._editor, CodeEditorStateFlag.Value | CodeEditorStateFlag.Selection, undefined, token);
		let resolvedEdit: T;
		try {
			resolvedEdit = await raceCancellationError(resolve(edit, editorStateCts.token), editorStateCts.token);
		} catch (e) {
			return handleError(e, localize('resolveError', "Error resolving edit '{0}':\n{1}", edit.title, toErrorMessage(e)));
		} finally {
			editorStateCts.dispose();
		}

		if (token.isCancellationRequested) {
			return;
		}

		const combinedWorkspaceEdit = createCombinedWorkspaceEdit(model.uri, ranges, resolvedEdit);

		// Use a decoration to track edits around the trigger range
		const primaryRange = ranges[0];
		const editTrackingDecoration = model.deltaDecorations([], [{
			range: primaryRange,
			options: { description: 'paste-line-suffix', stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges }
		}]);

		this._editor.focus();
		let editResult: IBulkEditResult;
		let editRange: Range | null;
		try {
			editResult = await this._bulkEditService.apply(combinedWorkspaceEdit, { editor: this._editor, token });
			editRange = model.getDecorationRange(editTrackingDecoration[0]);
		} catch (e) {
			return handleError(e, localize('applyError', "Error applying edit '{0}':\n{1}", edit.title, toErrorMessage(e)));
		} finally {
			model.deltaDecorations(editTrackingDecoration, []);
		}

		if (token.isCancellationRequested) {
			return;
		}

		if (canShowWidget && editResult.isApplied && edits.allEdits.length > 1) {
			this.show(editRange ?? primaryRange, edits, onDidSelectEdit);
		}
	}

	public show(range: Range, edits: EditSet<T>, onDidSelectEdit: (newIndex: number) => void) {
		this.clear();

		if (this._editor.hasModel()) {
			this._currentWidget.value = this._instantiationService.createInstance(PostEditWidget<T>, this._id, this._editor, this._visibleContext, this._showCommand, range, edits, onDidSelectEdit, this._getAdditionalActions());
		}
	}

	public clear() {
		this._currentWidget.clear();
	}

	public tryShowSelector() {
		this._currentWidget.value?.showSelector();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/dropOrPasteInto/test/browser/editSort.test.ts]---
Location: vscode-main/src/vs/editor/contrib/dropOrPasteInto/test/browser/editSort.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { HierarchicalKind } from '../../../../../base/common/hierarchicalKind.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { DocumentDropEdit } from '../../../../common/languages.js';
import { sortEditsByYieldTo } from '../../browser/edit.js';


function createTestEdit(kind: string, args?: Partial<DocumentDropEdit>): DocumentDropEdit {
	return {
		title: '',
		insertText: '',
		kind: new HierarchicalKind(kind),
		...args,
	};
}

suite('sortEditsByYieldTo', () => {

	test('Should noop for empty edits', () => {
		const edits: DocumentDropEdit[] = [];

		assert.deepStrictEqual(sortEditsByYieldTo(edits), []);
	});

	test('Yielded to edit should get sorted after target', () => {
		const edits: DocumentDropEdit[] = [
			createTestEdit('a', { yieldTo: [{ kind: new HierarchicalKind('b') }] }),
			createTestEdit('b'),
		];
		assert.deepStrictEqual(sortEditsByYieldTo(edits).map(x => x.kind?.value), ['b', 'a']);
	});

	test('Should handle chain of yield to', () => {
		{
			const edits: DocumentDropEdit[] = [
				createTestEdit('c', { yieldTo: [{ kind: new HierarchicalKind('a') }] }),
				createTestEdit('a', { yieldTo: [{ kind: new HierarchicalKind('b') }] }),
				createTestEdit('b'),
			];

			assert.deepStrictEqual(sortEditsByYieldTo(edits).map(x => x.kind?.value), ['b', 'a', 'c']);
		}
		{
			const edits: DocumentDropEdit[] = [
				createTestEdit('a', { yieldTo: [{ kind: new HierarchicalKind('b') }] }),
				createTestEdit('c', { yieldTo: [{ kind: new HierarchicalKind('a') }] }),
				createTestEdit('b'),
			];

			assert.deepStrictEqual(sortEditsByYieldTo(edits).map(x => x.kind?.value), ['b', 'a', 'c']);
		}
	});

	test(`Should not reorder when yield to isn't used`, () => {
		const edits: DocumentDropEdit[] = [
			createTestEdit('c', { yieldTo: [{ kind: new HierarchicalKind('x') }] }),
			createTestEdit('a', { yieldTo: [{ kind: new HierarchicalKind('y') }] }),
			createTestEdit('b'),
		];

		assert.deepStrictEqual(sortEditsByYieldTo(edits).map(x => x.kind?.value), ['c', 'a', 'b']);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/editorState/browser/editorState.ts]---
Location: vscode-main/src/vs/editor/contrib/editorState/browser/editorState.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as strings from '../../../../base/common/strings.js';
import { ICodeEditor, IActiveCodeEditor } from '../../../browser/editorBrowser.js';
import { Position } from '../../../common/core/position.js';
import { Range, IRange } from '../../../common/core/range.js';
import { CancellationTokenSource, CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { ITextModel } from '../../../common/model.js';
import { EditorKeybindingCancellationTokenSource } from './keybindingCancellation.js';

export const enum CodeEditorStateFlag {
	Value = 1,
	Selection = 2,
	Position = 4,
	Scroll = 8
}

export class EditorState {

	private readonly flags: number;

	private readonly position: Position | null;
	private readonly selection: Range | null;
	private readonly modelVersionId: string | null;
	private readonly scrollLeft: number;
	private readonly scrollTop: number;

	constructor(editor: ICodeEditor, flags: number) {
		this.flags = flags;

		if ((this.flags & CodeEditorStateFlag.Value) !== 0) {
			const model = editor.getModel();
			this.modelVersionId = model ? strings.format('{0}#{1}', model.uri.toString(), model.getVersionId()) : null;
		} else {
			this.modelVersionId = null;
		}
		if ((this.flags & CodeEditorStateFlag.Position) !== 0) {
			this.position = editor.getPosition();
		} else {
			this.position = null;
		}
		if ((this.flags & CodeEditorStateFlag.Selection) !== 0) {
			this.selection = editor.getSelection();
		} else {
			this.selection = null;
		}
		if ((this.flags & CodeEditorStateFlag.Scroll) !== 0) {
			this.scrollLeft = editor.getScrollLeft();
			this.scrollTop = editor.getScrollTop();
		} else {
			this.scrollLeft = -1;
			this.scrollTop = -1;
		}
	}

	private _equals(other: unknown): boolean {

		if (!(other instanceof EditorState)) {
			return false;
		}
		const state = other;

		if (this.modelVersionId !== state.modelVersionId) {
			return false;
		}
		if (this.scrollLeft !== state.scrollLeft || this.scrollTop !== state.scrollTop) {
			return false;
		}
		if (!this.position && state.position || this.position && !state.position || this.position && state.position && !this.position.equals(state.position)) {
			return false;
		}
		if (!this.selection && state.selection || this.selection && !state.selection || this.selection && state.selection && !this.selection.equalsRange(state.selection)) {
			return false;
		}
		return true;
	}

	public validate(editor: ICodeEditor): boolean {
		return this._equals(new EditorState(editor, this.flags));
	}
}

/**
 * A cancellation token source that cancels when the editor changes as expressed
 * by the provided flags
 * @param range If provided, changes in position and selection within this range will not trigger cancellation
 */
export class EditorStateCancellationTokenSource extends EditorKeybindingCancellationTokenSource implements IDisposable {

	private readonly _listener = new DisposableStore();

	constructor(editor: IActiveCodeEditor, flags: CodeEditorStateFlag, range?: IRange, parent?: CancellationToken) {
		super(editor, parent);

		if (flags & CodeEditorStateFlag.Position) {
			this._listener.add(editor.onDidChangeCursorPosition(e => {
				if (!range || !Range.containsPosition(range, e.position)) {
					this.cancel();
				}
			}));
		}
		if (flags & CodeEditorStateFlag.Selection) {
			this._listener.add(editor.onDidChangeCursorSelection(e => {
				if (!range || !Range.containsRange(range, e.selection)) {
					this.cancel();
				}
			}));
		}
		if (flags & CodeEditorStateFlag.Scroll) {
			this._listener.add(editor.onDidScrollChange(_ => this.cancel()));
		}
		if (flags & CodeEditorStateFlag.Value) {
			this._listener.add(editor.onDidChangeModel(_ => this.cancel()));
			this._listener.add(editor.onDidChangeModelContent(_ => this.cancel()));
		}
	}

	override dispose() {
		this._listener.dispose();
		super.dispose();
	}
}

/**
 * A cancellation token source that cancels when the provided model changes
 */
export class TextModelCancellationTokenSource extends CancellationTokenSource implements IDisposable {

	private _listener: IDisposable;

	constructor(model: ITextModel, parent?: CancellationToken) {
		super(parent);
		this._listener = model.onDidChangeContent(() => this.cancel());
	}

	override dispose() {
		this._listener.dispose();
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/editorState/browser/keybindingCancellation.ts]---
Location: vscode-main/src/vs/editor/contrib/editorState/browser/keybindingCancellation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode } from '../../../../base/common/keyCodes.js';
import { EditorCommand, registerEditorCommand } from '../../../browser/editorExtensions.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { IContextKeyService, RawContextKey, IContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { CancellationTokenSource, CancellationToken } from '../../../../base/common/cancellation.js';
import { LinkedList } from '../../../../base/common/linkedList.js';
import { createDecorator, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { localize } from '../../../../nls.js';


const IEditorCancellationTokens = createDecorator<IEditorCancellationTokens>('IEditorCancelService');

interface IEditorCancellationTokens {
	readonly _serviceBrand: undefined;
	add(editor: ICodeEditor, cts: CancellationTokenSource): () => void;
	cancel(editor: ICodeEditor): void;
}

const ctxCancellableOperation = new RawContextKey('cancellableOperation', false, localize('cancellableOperation', 'Whether the editor runs a cancellable operation, e.g. like \'Peek References\''));

registerSingleton(IEditorCancellationTokens, class implements IEditorCancellationTokens {

	declare readonly _serviceBrand: undefined;

	private readonly _tokens = new WeakMap<ICodeEditor, { key: IContextKey<boolean>; tokens: LinkedList<CancellationTokenSource> }>();

	add(editor: ICodeEditor, cts: CancellationTokenSource): () => void {
		let data = this._tokens.get(editor);
		if (!data) {
			data = editor.invokeWithinContext(accessor => {
				const key = ctxCancellableOperation.bindTo(accessor.get(IContextKeyService));
				const tokens = new LinkedList<CancellationTokenSource>();
				return { key, tokens };
			});
			this._tokens.set(editor, data);
		}

		let removeFn: Function | undefined;

		data.key.set(true);
		removeFn = data.tokens.push(cts);

		return () => {
			// remove w/o cancellation
			if (removeFn) {
				removeFn();
				data.key.set(!data.tokens.isEmpty());
				removeFn = undefined;
			}
		};
	}

	cancel(editor: ICodeEditor): void {
		const data = this._tokens.get(editor);
		if (!data) {
			return;
		}
		// remove with cancellation
		const cts = data.tokens.pop();
		if (cts) {
			cts.cancel();
			data.key.set(!data.tokens.isEmpty());
		}
	}

}, InstantiationType.Delayed);

export class EditorKeybindingCancellationTokenSource extends CancellationTokenSource {

	private readonly _unregister: Function;

	constructor(readonly editor: ICodeEditor, parent?: CancellationToken) {
		super(parent);
		this._unregister = editor.invokeWithinContext(accessor => accessor.get(IEditorCancellationTokens).add(editor, this));
	}

	override dispose(): void {
		this._unregister();
		super.dispose();
	}
}

registerEditorCommand(new class extends EditorCommand {

	constructor() {
		super({
			id: 'editor.cancelOperation',
			kbOpts: {
				weight: KeybindingWeight.EditorContrib,
				primary: KeyCode.Escape
			},
			precondition: ctxCancellableOperation
		});
	}

	runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor): void {
		accessor.get(IEditorCancellationTokens).cancel(editor);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/editorState/test/browser/editorState.test.ts]---
Location: vscode-main/src/vs/editor/contrib/editorState/test/browser/editorState.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { Position } from '../../../../common/core/position.js';
import { Selection } from '../../../../common/core/selection.js';
import { ITextModel } from '../../../../common/model.js';
import { CodeEditorStateFlag, EditorState } from '../../browser/editorState.js';

interface IStubEditorState {
	model?: { uri?: URI; version?: number };
	position?: Position;
	selection?: Selection;
	scroll?: { left?: number; top?: number };
}

suite('Editor Core - Editor State', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const allFlags = (
		CodeEditorStateFlag.Value
		| CodeEditorStateFlag.Selection
		| CodeEditorStateFlag.Position
		| CodeEditorStateFlag.Scroll
	);

	test('empty editor state should be valid', () => {
		const result = validate({}, {});
		assert.strictEqual(result, true);
	});

	test('different model URIs should be invalid', () => {
		const result = validate(
			{ model: { uri: URI.parse('http://test1') } },
			{ model: { uri: URI.parse('http://test2') } }
		);

		assert.strictEqual(result, false);
	});

	test('different model versions should be invalid', () => {
		const result = validate(
			{ model: { version: 1 } },
			{ model: { version: 2 } }
		);

		assert.strictEqual(result, false);
	});

	test('different positions should be invalid', () => {
		const result = validate(
			{ position: new Position(1, 2) },
			{ position: new Position(2, 3) }
		);

		assert.strictEqual(result, false);
	});

	test('different selections should be invalid', () => {
		const result = validate(
			{ selection: new Selection(1, 2, 3, 4) },
			{ selection: new Selection(5, 2, 3, 4) }
		);

		assert.strictEqual(result, false);
	});

	test('different scroll positions should be invalid', () => {
		const result = validate(
			{ scroll: { left: 1, top: 2 } },
			{ scroll: { left: 3, top: 2 } }
		);

		assert.strictEqual(result, false);
	});


	function validate(source: IStubEditorState, target: IStubEditorState) {
		const sourceEditor = createEditor(source),
			targetEditor = createEditor(target);

		const result = new EditorState(sourceEditor, allFlags).validate(targetEditor);

		return result;
	}

	function createEditor({ model, position, selection, scroll }: IStubEditorState = {}): ICodeEditor {
		const mappedModel = model ? { uri: model.uri ? model.uri : URI.parse('http://dummy.org'), getVersionId: () => model.version } : null;

		return {
			// eslint-disable-next-line local/code-no-any-casts
			getModel: (): ITextModel => <any>mappedModel,
			getPosition: (): Position | undefined => position,
			getSelection: (): Selection | undefined => selection,
			getScrollLeft: (): number | undefined => scroll && scroll.left,
			getScrollTop: (): number | undefined => scroll && scroll.top
		} as ICodeEditor;
	}

});
```

--------------------------------------------------------------------------------

````
