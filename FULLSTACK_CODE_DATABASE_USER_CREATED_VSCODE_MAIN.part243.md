---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 243
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 243 of 552)

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

---[FILE: src/vs/editor/test/browser/commands/shiftCommand.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/commands/shiftCommand.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ShiftCommand } from '../../../common/commands/shiftCommand.js';
import { EditorAutoIndentStrategy } from '../../../common/config/editorOptions.js';
import { ISingleEditOperation } from '../../../common/core/editOperation.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { ILanguageService } from '../../../common/languages/language.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { getEditOperation, testCommand } from '../testCommand.js';
import { javascriptOnEnterRules } from '../../common/modes/supports/onEnterRules.js';
import { TestLanguageConfigurationService } from '../../common/modes/testLanguageConfigurationService.js';
import { withEditorModel } from '../../common/testTextModel.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';

/**
 * Create single edit operation
 */
function createSingleEditOp(text: string, positionLineNumber: number, positionColumn: number, selectionLineNumber: number = positionLineNumber, selectionColumn: number = positionColumn): ISingleEditOperation {
	return {
		range: new Range(selectionLineNumber, selectionColumn, positionLineNumber, positionColumn),
		text: text,
		forceMoveMarkers: false
	};
}

class DocBlockCommentMode extends Disposable {

	public static languageId = 'commentMode';
	public readonly languageId = DocBlockCommentMode.languageId;

	constructor(
		@ILanguageService languageService: ILanguageService,
		@ILanguageConfigurationService languageConfigurationService: ILanguageConfigurationService
	) {
		super();
		this._register(languageService.registerLanguage({ id: this.languageId }));
		this._register(languageConfigurationService.register(this.languageId, {
			brackets: [
				['(', ')'],
				['{', '}'],
				['[', ']']
			],

			onEnterRules: javascriptOnEnterRules
		}));
	}
}

function testShiftCommand(lines: string[], languageId: string | null, useTabStops: boolean, selection: Selection, expectedLines: string[], expectedSelection: Selection, prepare?: (accessor: ServicesAccessor, disposables: DisposableStore) => void): void {
	testCommand(lines, languageId, selection, (accessor, sel) => new ShiftCommand(sel, {
		isUnshift: false,
		tabSize: 4,
		indentSize: 4,
		insertSpaces: false,
		useTabStops: useTabStops,
		autoIndent: EditorAutoIndentStrategy.Full,
	}, accessor.get(ILanguageConfigurationService)), expectedLines, expectedSelection, undefined, prepare);
}

function testUnshiftCommand(lines: string[], languageId: string | null, useTabStops: boolean, selection: Selection, expectedLines: string[], expectedSelection: Selection, prepare?: (accessor: ServicesAccessor, disposables: DisposableStore) => void): void {
	testCommand(lines, languageId, selection, (accessor, sel) => new ShiftCommand(sel, {
		isUnshift: true,
		tabSize: 4,
		indentSize: 4,
		insertSpaces: false,
		useTabStops: useTabStops,
		autoIndent: EditorAutoIndentStrategy.Full,
	}, accessor.get(ILanguageConfigurationService)), expectedLines, expectedSelection, undefined, prepare);
}

function prepareDocBlockCommentLanguage(accessor: ServicesAccessor, disposables: DisposableStore) {
	const languageConfigurationService = accessor.get(ILanguageConfigurationService);
	const languageService = accessor.get(ILanguageService);
	disposables.add(new DocBlockCommentMode(languageService, languageConfigurationService));
}

suite('Editor Commands - ShiftCommand', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	// --------- shift

	test('Bug 9503: Shifting without any selection', () => {
		testShiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(1, 1, 1, 1),
			[
				'\tMy First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			new Selection(1, 2, 1, 2)
		);
	});

	test('shift on single line selection 1', () => {
		testShiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(1, 3, 1, 1),
			[
				'\tMy First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			new Selection(1, 4, 1, 1)
		);
	});

	test('shift on single line selection 2', () => {
		testShiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(1, 1, 1, 3),
			[
				'\tMy First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			new Selection(1, 1, 1, 4)
		);
	});

	test('simple shift', () => {
		testShiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(1, 1, 2, 1),
			[
				'\tMy First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			new Selection(1, 1, 2, 1)
		);
	});

	test('shifting on two separate lines', () => {
		testShiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(1, 1, 2, 1),
			[
				'\tMy First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			new Selection(1, 1, 2, 1)
		);

		testShiftCommand(
			[
				'\tMy First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(2, 1, 3, 1),
			[
				'\tMy First Line',
				'\t\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			new Selection(2, 1, 3, 1)
		);
	});

	test('shifting on two lines', () => {
		testShiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(1, 2, 2, 2),
			[
				'\tMy First Line',
				'\t\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			new Selection(1, 3, 2, 2)
		);
	});

	test('shifting on two lines again', () => {
		testShiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(2, 2, 1, 2),
			[
				'\tMy First Line',
				'\t\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			new Selection(2, 2, 1, 3)
		);
	});

	test('shifting at end of file', () => {
		testShiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(4, 1, 5, 2),
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'\t123'
			],
			new Selection(4, 1, 5, 3)
		);
	});

	test('issue #1120 TAB should not indent empty lines in a multi-line selection', () => {
		testShiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(1, 1, 5, 2),
			[
				'\tMy First Line',
				'\t\t\tMy Second Line',
				'\t\tThird Line',
				'',
				'\t123'
			],
			new Selection(1, 1, 5, 3)
		);

		testShiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(4, 1, 5, 1),
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'\t',
				'123'
			],
			new Selection(4, 1, 5, 1)
		);
	});

	// --------- unshift

	test('unshift on single line selection 1', () => {
		testShiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(2, 3, 2, 1),
			[
				'My First Line',
				'\t\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			new Selection(2, 3, 2, 1)
		);
	});

	test('unshift on single line selection 2', () => {
		testShiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(2, 1, 2, 3),
			[
				'My First Line',
				'\t\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			new Selection(2, 1, 2, 3)
		);
	});

	test('simple unshift', () => {
		testUnshiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(1, 1, 2, 1),
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			new Selection(1, 1, 2, 1)
		);
	});

	test('unshifting on two lines 1', () => {
		testUnshiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(1, 2, 2, 2),
			[
				'My First Line',
				'\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			new Selection(1, 2, 2, 2)
		);
	});

	test('unshifting on two lines 2', () => {
		testUnshiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(2, 3, 2, 1),
			[
				'My First Line',
				'\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			new Selection(2, 2, 2, 1)
		);
	});

	test('unshifting at the end of the file', () => {
		testUnshiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(4, 1, 5, 2),
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			new Selection(4, 1, 5, 2)
		);
	});

	test('unshift many times + shift', () => {
		testUnshiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(1, 1, 5, 4),
			[
				'My First Line',
				'\tMy Second Line',
				'Third Line',
				'',
				'123'
			],
			new Selection(1, 1, 5, 4)
		);

		testUnshiftCommand(
			[
				'My First Line',
				'\tMy Second Line',
				'Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(1, 1, 5, 4),
			[
				'My First Line',
				'My Second Line',
				'Third Line',
				'',
				'123'
			],
			new Selection(1, 1, 5, 4)
		);

		testShiftCommand(
			[
				'My First Line',
				'My Second Line',
				'Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(1, 1, 5, 4),
			[
				'\tMy First Line',
				'\tMy Second Line',
				'\tThird Line',
				'',
				'\t123'
			],
			new Selection(1, 1, 5, 5)
		);
	});

	test('Bug 9119: Unshift from first column doesn\'t work', () => {
		testUnshiftCommand(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			null,
			true,
			new Selection(2, 1, 2, 1),
			[
				'My First Line',
				'\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			new Selection(2, 1, 2, 1)
		);
	});

	test('issue #348: indenting around doc block comments', () => {
		testShiftCommand(
			[
				'',
				'/**',
				' * a doc comment',
				' */',
				'function hello() {}'
			],
			DocBlockCommentMode.languageId,
			true,
			new Selection(1, 1, 5, 20),
			[
				'',
				'\t/**',
				'\t * a doc comment',
				'\t */',
				'\tfunction hello() {}'
			],
			new Selection(1, 1, 5, 21),
			prepareDocBlockCommentLanguage
		);

		testUnshiftCommand(
			[
				'',
				'/**',
				' * a doc comment',
				' */',
				'function hello() {}'
			],
			DocBlockCommentMode.languageId,
			true,
			new Selection(1, 1, 5, 20),
			[
				'',
				'/**',
				' * a doc comment',
				' */',
				'function hello() {}'
			],
			new Selection(1, 1, 5, 20),
			prepareDocBlockCommentLanguage
		);

		testUnshiftCommand(
			[
				'\t',
				'\t/**',
				'\t * a doc comment',
				'\t */',
				'\tfunction hello() {}'
			],
			DocBlockCommentMode.languageId,
			true,
			new Selection(1, 1, 5, 21),
			[
				'',
				'/**',
				' * a doc comment',
				' */',
				'function hello() {}'
			],
			new Selection(1, 1, 5, 20),
			prepareDocBlockCommentLanguage
		);
	});

	test('issue #1609: Wrong indentation of block comments', () => {
		testShiftCommand(
			[
				'',
				'/**',
				' * test',
				' *',
				' * @type {number}',
				' */',
				'var foo = 0;'
			],
			DocBlockCommentMode.languageId,
			true,
			new Selection(1, 1, 7, 13),
			[
				'',
				'\t/**',
				'\t * test',
				'\t *',
				'\t * @type {number}',
				'\t */',
				'\tvar foo = 0;'
			],
			new Selection(1, 1, 7, 14),
			prepareDocBlockCommentLanguage
		);
	});

	test('issue #1620: a) Line indent doesn\'t handle leading whitespace properly', () => {
		testCommand(
			[
				'   Written | Numeric',
				'       one | 1',
				'       two | 2',
				'     three | 3',
				'      four | 4',
				'      five | 5',
				'       six | 6',
				'     seven | 7',
				'     eight | 8',
				'      nine | 9',
				'       ten | 10',
				'    eleven | 11',
				'',
			],
			null,
			new Selection(1, 1, 13, 1),
			(accessor, sel) => new ShiftCommand(sel, {
				isUnshift: false,
				tabSize: 4,
				indentSize: 4,
				insertSpaces: true,
				useTabStops: false,
				autoIndent: EditorAutoIndentStrategy.Full,
			}, accessor.get(ILanguageConfigurationService)),
			[
				'       Written | Numeric',
				'           one | 1',
				'           two | 2',
				'         three | 3',
				'          four | 4',
				'          five | 5',
				'           six | 6',
				'         seven | 7',
				'         eight | 8',
				'          nine | 9',
				'           ten | 10',
				'        eleven | 11',
				'',
			],
			new Selection(1, 1, 13, 1)
		);
	});

	test('issue #1620: b) Line indent doesn\'t handle leading whitespace properly', () => {
		testCommand(
			[
				'       Written | Numeric',
				'           one | 1',
				'           two | 2',
				'         three | 3',
				'          four | 4',
				'          five | 5',
				'           six | 6',
				'         seven | 7',
				'         eight | 8',
				'          nine | 9',
				'           ten | 10',
				'        eleven | 11',
				'',
			],
			null,
			new Selection(1, 1, 13, 1),
			(accessor, sel) => new ShiftCommand(sel, {
				isUnshift: true,
				tabSize: 4,
				indentSize: 4,
				insertSpaces: true,
				useTabStops: false,
				autoIndent: EditorAutoIndentStrategy.Full,
			}, accessor.get(ILanguageConfigurationService)),
			[
				'   Written | Numeric',
				'       one | 1',
				'       two | 2',
				'     three | 3',
				'      four | 4',
				'      five | 5',
				'       six | 6',
				'     seven | 7',
				'     eight | 8',
				'      nine | 9',
				'       ten | 10',
				'    eleven | 11',
				'',
			],
			new Selection(1, 1, 13, 1)
		);
	});

	test('issue #1620: c) Line indent doesn\'t handle leading whitespace properly', () => {
		testCommand(
			[
				'       Written | Numeric',
				'           one | 1',
				'           two | 2',
				'         three | 3',
				'          four | 4',
				'          five | 5',
				'           six | 6',
				'         seven | 7',
				'         eight | 8',
				'          nine | 9',
				'           ten | 10',
				'        eleven | 11',
				'',
			],
			null,
			new Selection(1, 1, 13, 1),
			(accessor, sel) => new ShiftCommand(sel, {
				isUnshift: true,
				tabSize: 4,
				indentSize: 4,
				insertSpaces: false,
				useTabStops: false,
				autoIndent: EditorAutoIndentStrategy.Full,
			}, accessor.get(ILanguageConfigurationService)),
			[
				'   Written | Numeric',
				'       one | 1',
				'       two | 2',
				'     three | 3',
				'      four | 4',
				'      five | 5',
				'       six | 6',
				'     seven | 7',
				'     eight | 8',
				'      nine | 9',
				'       ten | 10',
				'    eleven | 11',
				'',
			],
			new Selection(1, 1, 13, 1)
		);
	});

	test('issue #1620: d) Line indent doesn\'t handle leading whitespace properly', () => {
		testCommand(
			[
				'\t   Written | Numeric',
				'\t       one | 1',
				'\t       two | 2',
				'\t     three | 3',
				'\t      four | 4',
				'\t      five | 5',
				'\t       six | 6',
				'\t     seven | 7',
				'\t     eight | 8',
				'\t      nine | 9',
				'\t       ten | 10',
				'\t    eleven | 11',
				'',
			],
			null,
			new Selection(1, 1, 13, 1),
			(accessor, sel) => new ShiftCommand(sel, {
				isUnshift: true,
				tabSize: 4,
				indentSize: 4,
				insertSpaces: true,
				useTabStops: false,
				autoIndent: EditorAutoIndentStrategy.Full,
			}, accessor.get(ILanguageConfigurationService)),
			[
				'   Written | Numeric',
				'       one | 1',
				'       two | 2',
				'     three | 3',
				'      four | 4',
				'      five | 5',
				'       six | 6',
				'     seven | 7',
				'     eight | 8',
				'      nine | 9',
				'       ten | 10',
				'    eleven | 11',
				'',
			],
			new Selection(1, 1, 13, 1)
		);
	});

	test('issue microsoft/monaco-editor#443: Indentation of a single row deletes selected text in some cases', () => {
		testCommand(
			[
				'Hello world!',
				'another line'
			],
			null,
			new Selection(1, 1, 1, 13),
			(accessor, sel) => new ShiftCommand(sel, {
				isUnshift: false,
				tabSize: 4,
				indentSize: 4,
				insertSpaces: false,
				useTabStops: true,
				autoIndent: EditorAutoIndentStrategy.Full,
			}, accessor.get(ILanguageConfigurationService)),
			[
				'\tHello world!',
				'another line'
			],
			new Selection(1, 1, 1, 14)
		);
	});

	test('bug #16815:Shift+Tab doesn\'t go back to tabstop', () => {

		const repeatStr = (str: string, cnt: number): string => {
			let r = '';
			for (let i = 0; i < cnt; i++) {
				r += str;
			}
			return r;
		};

		const testOutdent = (tabSize: number, indentSize: number, insertSpaces: boolean, lineText: string, expectedIndents: number) => {
			const oneIndent = insertSpaces ? repeatStr(' ', indentSize) : '\t';
			const expectedIndent = repeatStr(oneIndent, expectedIndents);
			if (lineText.length > 0) {
				_assertUnshiftCommand(tabSize, indentSize, insertSpaces, [lineText + 'aaa'], [createSingleEditOp(expectedIndent, 1, 1, 1, lineText.length + 1)]);
			} else {
				_assertUnshiftCommand(tabSize, indentSize, insertSpaces, [lineText + 'aaa'], []);
			}
		};

		const testIndent = (tabSize: number, indentSize: number, insertSpaces: boolean, lineText: string, expectedIndents: number) => {
			const oneIndent = insertSpaces ? repeatStr(' ', indentSize) : '\t';
			const expectedIndent = repeatStr(oneIndent, expectedIndents);
			_assertShiftCommand(tabSize, indentSize, insertSpaces, [lineText + 'aaa'], [createSingleEditOp(expectedIndent, 1, 1, 1, lineText.length + 1)]);
		};

		const testIndentation = (tabSize: number, indentSize: number, lineText: string, expectedOnOutdent: number, expectedOnIndent: number) => {
			testOutdent(tabSize, indentSize, true, lineText, expectedOnOutdent);
			testOutdent(tabSize, indentSize, false, lineText, expectedOnOutdent);

			testIndent(tabSize, indentSize, true, lineText, expectedOnIndent);
			testIndent(tabSize, indentSize, false, lineText, expectedOnIndent);
		};

		// insertSpaces: true
		// 0 => 0
		testIndentation(4, 4, '', 0, 1);

		// 1 => 0
		testIndentation(4, 4, '\t', 0, 2);
		testIndentation(4, 4, ' ', 0, 1);
		testIndentation(4, 4, ' \t', 0, 2);
		testIndentation(4, 4, '  ', 0, 1);
		testIndentation(4, 4, '  \t', 0, 2);
		testIndentation(4, 4, '   ', 0, 1);
		testIndentation(4, 4, '   \t', 0, 2);
		testIndentation(4, 4, '    ', 0, 2);

		// 2 => 1
		testIndentation(4, 4, '\t\t', 1, 3);
		testIndentation(4, 4, '\t ', 1, 2);
		testIndentation(4, 4, '\t \t', 1, 3);
		testIndentation(4, 4, '\t  ', 1, 2);
		testIndentation(4, 4, '\t  \t', 1, 3);
		testIndentation(4, 4, '\t   ', 1, 2);
		testIndentation(4, 4, '\t   \t', 1, 3);
		testIndentation(4, 4, '\t    ', 1, 3);
		testIndentation(4, 4, ' \t\t', 1, 3);
		testIndentation(4, 4, ' \t ', 1, 2);
		testIndentation(4, 4, ' \t \t', 1, 3);
		testIndentation(4, 4, ' \t  ', 1, 2);
		testIndentation(4, 4, ' \t  \t', 1, 3);
		testIndentation(4, 4, ' \t   ', 1, 2);
		testIndentation(4, 4, ' \t   \t', 1, 3);
		testIndentation(4, 4, ' \t    ', 1, 3);
		testIndentation(4, 4, '  \t\t', 1, 3);
		testIndentation(4, 4, '  \t ', 1, 2);
		testIndentation(4, 4, '  \t \t', 1, 3);
		testIndentation(4, 4, '  \t  ', 1, 2);
		testIndentation(4, 4, '  \t  \t', 1, 3);
		testIndentation(4, 4, '  \t   ', 1, 2);
		testIndentation(4, 4, '  \t   \t', 1, 3);
		testIndentation(4, 4, '  \t    ', 1, 3);
		testIndentation(4, 4, '   \t\t', 1, 3);
		testIndentation(4, 4, '   \t ', 1, 2);
		testIndentation(4, 4, '   \t \t', 1, 3);
		testIndentation(4, 4, '   \t  ', 1, 2);
		testIndentation(4, 4, '   \t  \t', 1, 3);
		testIndentation(4, 4, '   \t   ', 1, 2);
		testIndentation(4, 4, '   \t   \t', 1, 3);
		testIndentation(4, 4, '   \t    ', 1, 3);
		testIndentation(4, 4, '    \t', 1, 3);
		testIndentation(4, 4, '     ', 1, 2);
		testIndentation(4, 4, '     \t', 1, 3);
		testIndentation(4, 4, '      ', 1, 2);
		testIndentation(4, 4, '      \t', 1, 3);
		testIndentation(4, 4, '       ', 1, 2);
		testIndentation(4, 4, '       \t', 1, 3);
		testIndentation(4, 4, '        ', 1, 3);

		// 3 => 2
		testIndentation(4, 4, '         ', 2, 3);

		function _assertUnshiftCommand(tabSize: number, indentSize: number, insertSpaces: boolean, text: string[], expected: ISingleEditOperation[]): void {
			return withEditorModel(text, (model) => {
				const testLanguageConfigurationService = new TestLanguageConfigurationService();
				const op = new ShiftCommand(new Selection(1, 1, text.length + 1, 1), {
					isUnshift: true,
					tabSize: tabSize,
					indentSize: indentSize,
					insertSpaces: insertSpaces,
					useTabStops: true,
					autoIndent: EditorAutoIndentStrategy.Full,
				}, testLanguageConfigurationService);
				const actual = getEditOperation(model, op);
				assert.deepStrictEqual(actual, expected);
				testLanguageConfigurationService.dispose();
			});
		}

		function _assertShiftCommand(tabSize: number, indentSize: number, insertSpaces: boolean, text: string[], expected: ISingleEditOperation[]): void {
			return withEditorModel(text, (model) => {
				const testLanguageConfigurationService = new TestLanguageConfigurationService();
				const op = new ShiftCommand(new Selection(1, 1, text.length + 1, 1), {
					isUnshift: false,
					tabSize: tabSize,
					indentSize: indentSize,
					insertSpaces: insertSpaces,
					useTabStops: true,
					autoIndent: EditorAutoIndentStrategy.Full,
				}, testLanguageConfigurationService);
				const actual = getEditOperation(model, op);
				assert.deepStrictEqual(actual, expected);
				testLanguageConfigurationService.dispose();
			});
		}
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/commands/sideEditing.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/commands/sideEditing.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { EditOperation, ISingleEditOperation } from '../../../common/core/editOperation.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { withTestCodeEditor } from '../testCodeEditor.js';

function testCommand(lines: string[], selections: Selection[], edits: ISingleEditOperation[], expectedLines: string[], expectedSelections: Selection[]): void {
	withTestCodeEditor(lines, {}, (editor, viewModel) => {
		const model = editor.getModel()!;

		viewModel.setSelections('tests', selections);

		model.applyEdits(edits);

		assert.deepStrictEqual(model.getLinesContent(), expectedLines);

		const actualSelections = viewModel.getSelections();
		assert.deepStrictEqual(actualSelections.map(s => s.toString()), expectedSelections.map(s => s.toString()));

	});
}

suite('Editor Side Editing - collapsed selection', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('replace at selection', () => {
		testCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth'
			],
			[new Selection(1, 1, 1, 1)],
			[
				EditOperation.replace(new Selection(1, 1, 1, 1), 'something ')
			],
			[
				'something first',
				'second line',
				'third line',
				'fourth'
			],
			[new Selection(1, 11, 1, 11)]
		);
	});

	test('replace at selection 2', () => {
		testCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth'
			],
			[new Selection(1, 1, 1, 6)],
			[
				EditOperation.replace(new Selection(1, 1, 1, 6), 'something')
			],
			[
				'something',
				'second line',
				'third line',
				'fourth'
			],
			[new Selection(1, 1, 1, 10)]
		);
	});

	test('insert at selection', () => {
		testCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth'
			],
			[new Selection(1, 1, 1, 1)],
			[
				EditOperation.insert(new Position(1, 1), 'something ')
			],
			[
				'something first',
				'second line',
				'third line',
				'fourth'
			],
			[new Selection(1, 11, 1, 11)]
		);
	});

	test('insert at selection sitting on max column', () => {
		testCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth'
			],
			[new Selection(1, 6, 1, 6)],
			[
				EditOperation.insert(new Position(1, 6), ' something\nnew ')
			],
			[
				'first something',
				'new ',
				'second line',
				'third line',
				'fourth'
			],
			[new Selection(2, 5, 2, 5)]
		);
	});

	test('issue #3994: replace on top of selection', () => {
		testCommand(
			[
				'$obj = New-Object "system.col"'
			],
			[new Selection(1, 30, 1, 30)],
			[
				EditOperation.replaceMove(new Range(1, 19, 1, 31), '"System.Collections"')
			],
			[
				'$obj = New-Object "System.Collections"'
			],
			[new Selection(1, 39, 1, 39)]
		);
	});

	test('issue #15267: Suggestion that adds a line - cursor goes to the wrong line ', () => {
		testCommand(
			[
				'package main',
				'',
				'import (',
				'	"fmt"',
				')',
				'',
				'func main(',
				'	fmt.Println(strings.Con)',
				'}'
			],
			[new Selection(8, 25, 8, 25)],
			[
				EditOperation.replaceMove(new Range(5, 1, 5, 1), '\t\"strings\"\n')
			],
			[
				'package main',
				'',
				'import (',
				'	"fmt"',
				'	"strings"',
				')',
				'',
				'func main(',
				'	fmt.Println(strings.Con)',
				'}'
			],
			[new Selection(9, 25, 9, 25)]
		);
	});

	test('issue #15236: Selections broke after deleting text using vscode.TextEditor.edit ', () => {
		testCommand(
			[
				'foofoofoo, foofoofoo, bar'
			],
			[new Selection(1, 1, 1, 10), new Selection(1, 12, 1, 21)],
			[
				EditOperation.replace(new Range(1, 1, 1, 10), ''),
				EditOperation.replace(new Range(1, 12, 1, 21), ''),
			],
			[
				', , bar'
			],
			[new Selection(1, 1, 1, 1), new Selection(1, 3, 1, 3)]
		);
	});
});

suite('SideEditing', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const LINES = [
		'My First Line',
		'My Second Line',
		'Third Line'
	];

	function _runTest(selection: Selection, editRange: Range, editText: string, editForceMoveMarkers: boolean, expected: Selection, msg: string): void {
		withTestCodeEditor(LINES.join('\n'), {}, (editor, viewModel) => {
			viewModel.setSelections('tests', [selection]);
			editor.getModel().applyEdits([{
				range: editRange,
				text: editText,
				forceMoveMarkers: editForceMoveMarkers
			}]);
			const actual = viewModel.getSelection();
			assert.deepStrictEqual(actual.toString(), expected.toString(), msg);
		});
	}

	function runTest(selection: Range, editRange: Range, editText: string, expected: Selection[][]): void {
		const sel1 = new Selection(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn);
		_runTest(sel1, editRange, editText, false, expected[0][0], '0-0-regular-no-force');
		_runTest(sel1, editRange, editText, true, expected[1][0], '1-0-regular-force');

		// RTL selection
		const sel2 = new Selection(selection.endLineNumber, selection.endColumn, selection.startLineNumber, selection.startColumn);
		_runTest(sel2, editRange, editText, false, expected[0][1], '0-1-inverse-no-force');
		_runTest(sel2, editRange, editText, true, expected[1][1], '1-1-inverse-force');
	}

	suite('insert', () => {
		suite('collapsed sel', () => {
			test('before', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 3, 1, 3), 'xx',
					[
						[new Selection(1, 6, 1, 6), new Selection(1, 6, 1, 6)],
						[new Selection(1, 6, 1, 6), new Selection(1, 6, 1, 6)],
					]
				);
			});
			test('equal', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 4, 1, 4), 'xx',
					[
						[new Selection(1, 6, 1, 6), new Selection(1, 6, 1, 6)],
						[new Selection(1, 6, 1, 6), new Selection(1, 6, 1, 6)],
					]
				);
			});
			test('after', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 5, 1, 5), 'xx',
					[
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
					]
				);
			});
		});
		suite('non-collapsed dec', () => {
			test('before', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 3), 'xx',
					[
						[new Selection(1, 6, 1, 11), new Selection(1, 11, 1, 6)],
						[new Selection(1, 6, 1, 11), new Selection(1, 11, 1, 6)],
					]
				);
			});
			test('start', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 4), 'xx',
					[
						[new Selection(1, 4, 1, 11), new Selection(1, 11, 1, 4)],
						[new Selection(1, 6, 1, 11), new Selection(1, 11, 1, 6)],
					]
				);
			});
			test('inside', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 5), 'xx',
					[
						[new Selection(1, 4, 1, 11), new Selection(1, 11, 1, 4)],
						[new Selection(1, 4, 1, 11), new Selection(1, 11, 1, 4)],
					]
				);
			});
			test('end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 9, 1, 9), 'xx',
					[
						[new Selection(1, 4, 1, 11), new Selection(1, 11, 1, 4)],
						[new Selection(1, 4, 1, 11), new Selection(1, 11, 1, 4)],
					]
				);
			});
			test('after', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 10, 1, 10), 'xx',
					[
						[new Selection(1, 4, 1, 9), new Selection(1, 9, 1, 4)],
						[new Selection(1, 4, 1, 9), new Selection(1, 9, 1, 4)],
					]
				);
			});
		});
	});

	suite('delete', () => {
		suite('collapsed dec', () => {
			test('edit.end < range.start', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 1, 1, 3), '',
					[
						[new Selection(1, 2, 1, 2), new Selection(1, 2, 1, 2)],
						[new Selection(1, 2, 1, 2), new Selection(1, 2, 1, 2)],
					]
				);
			});
			test('edit.end <= range.start', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 2, 1, 4), '',
					[
						[new Selection(1, 2, 1, 2), new Selection(1, 2, 1, 2)],
						[new Selection(1, 2, 1, 2), new Selection(1, 2, 1, 2)],
					]
				);
			});
			test('edit.start < range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 3, 1, 5), '',
					[
						[new Selection(1, 3, 1, 3), new Selection(1, 3, 1, 3)],
						[new Selection(1, 3, 1, 3), new Selection(1, 3, 1, 3)],
					]
				);
			});
			test('edit.start >= range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 4, 1, 6), '',
					[
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
					]
				);
			});
			test('edit.start > range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 5, 1, 7), '',
					[
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
					]
				);
			});
		});
		suite('non-collapsed dec', () => {
			test('edit.end < range.start', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 1, 1, 3), '',
					[
						[new Selection(1, 2, 1, 7), new Selection(1, 7, 1, 2)],
						[new Selection(1, 2, 1, 7), new Selection(1, 7, 1, 2)],
					]
				);
			});
			test('edit.end <= range.start', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 2, 1, 4), '',
					[
						[new Selection(1, 2, 1, 7), new Selection(1, 7, 1, 2)],
						[new Selection(1, 2, 1, 7), new Selection(1, 7, 1, 2)],
					]
				);
			});
			test('edit.start < range.start && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 5), '',
					[
						[new Selection(1, 3, 1, 7), new Selection(1, 7, 1, 3)],
						[new Selection(1, 3, 1, 7), new Selection(1, 7, 1, 3)],
					]
				);
			});

			test('edit.start < range.start && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 9), '',
					[
						[new Selection(1, 3, 1, 3), new Selection(1, 3, 1, 3)],
						[new Selection(1, 3, 1, 3), new Selection(1, 3, 1, 3)],
					]
				);
			});

			test('edit.start < range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 10), '',
					[
						[new Selection(1, 3, 1, 3), new Selection(1, 3, 1, 3)],
						[new Selection(1, 3, 1, 3), new Selection(1, 3, 1, 3)],
					]
				);
			});

			test('edit.start == range.start && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 6), '',
					[
						[new Selection(1, 4, 1, 7), new Selection(1, 7, 1, 4)],
						[new Selection(1, 4, 1, 7), new Selection(1, 7, 1, 4)],
					]
				);
			});

			test('edit.start == range.start && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 9), '',
					[
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
					]
				);
			});

			test('edit.start == range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 10), '',
					[
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
					]
				);
			});

			test('edit.start > range.start && edit.start < range.end && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 7), '',
					[
						[new Selection(1, 4, 1, 7), new Selection(1, 7, 1, 4)],
						[new Selection(1, 4, 1, 7), new Selection(1, 7, 1, 4)],
					]
				);
			});

			test('edit.start > range.start && edit.start < range.end && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 9), '',
					[
						[new Selection(1, 4, 1, 5), new Selection(1, 5, 1, 4)],
						[new Selection(1, 4, 1, 5), new Selection(1, 5, 1, 4)],
					]
				);
			});

			test('edit.start > range.start && edit.start < range.end && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 10), '',
					[
						[new Selection(1, 4, 1, 5), new Selection(1, 5, 1, 4)],
						[new Selection(1, 4, 1, 5), new Selection(1, 5, 1, 4)],
					]
				);
			});

			test('edit.start == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 9, 1, 11), '',
					[
						[new Selection(1, 4, 1, 9), new Selection(1, 9, 1, 4)],
						[new Selection(1, 4, 1, 9), new Selection(1, 9, 1, 4)],
					]
				);
			});

			test('edit.start > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 10, 1, 11), '',
					[
						[new Selection(1, 4, 1, 9), new Selection(1, 9, 1, 4)],
						[new Selection(1, 4, 1, 9), new Selection(1, 9, 1, 4)],
					]
				);
			});
		});
	});

	suite('replace short', () => {
		suite('collapsed dec', () => {
			test('edit.end < range.start', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 1, 1, 3), 'c',
					[
						[new Selection(1, 3, 1, 3), new Selection(1, 3, 1, 3)],
						[new Selection(1, 3, 1, 3), new Selection(1, 3, 1, 3)],
					]
				);
			});
			test('edit.end <= range.start', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 2, 1, 4), 'c',
					[
						[new Selection(1, 3, 1, 3), new Selection(1, 3, 1, 3)],
						[new Selection(1, 3, 1, 3), new Selection(1, 3, 1, 3)],
					]
				);
			});
			test('edit.start < range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 3, 1, 5), 'c',
					[
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
					]
				);
			});
			test('edit.start >= range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 4, 1, 6), 'c',
					[
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
						[new Selection(1, 5, 1, 5), new Selection(1, 5, 1, 5)],
					]
				);
			});
			test('edit.start > range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 5, 1, 7), 'c',
					[
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
					]
				);
			});
		});
		suite('non-collapsed dec', () => {
			test('edit.end < range.start', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 1, 1, 3), 'c',
					[
						[new Selection(1, 3, 1, 8), new Selection(1, 8, 1, 3)],
						[new Selection(1, 3, 1, 8), new Selection(1, 8, 1, 3)],
					]
				);
			});
			test('edit.end <= range.start', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 2, 1, 4), 'c',
					[
						[new Selection(1, 3, 1, 8), new Selection(1, 8, 1, 3)],
						[new Selection(1, 3, 1, 8), new Selection(1, 8, 1, 3)],
					]
				);
			});
			test('edit.start < range.start && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 5), 'c',
					[
						[new Selection(1, 4, 1, 8), new Selection(1, 8, 1, 4)],
						[new Selection(1, 4, 1, 8), new Selection(1, 8, 1, 4)],
					]
				);
			});
			test('edit.start < range.start && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 9), 'c',
					[
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
					]
				);
			});
			test('edit.start < range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 10), 'c',
					[
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
					]
				);
			});
			test('edit.start == range.start && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 6), 'c',
					[
						[new Selection(1, 4, 1, 8), new Selection(1, 8, 1, 4)],
						[new Selection(1, 5, 1, 8), new Selection(1, 8, 1, 5)],
					]
				);
			});
			test('edit.start == range.start && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 9), 'c',
					[
						[new Selection(1, 4, 1, 5), new Selection(1, 5, 1, 4)],
						[new Selection(1, 5, 1, 5), new Selection(1, 5, 1, 5)],
					]
				);
			});
			test('edit.start == range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 10), 'c',
					[
						[new Selection(1, 4, 1, 5), new Selection(1, 5, 1, 4)],
						[new Selection(1, 5, 1, 5), new Selection(1, 5, 1, 5)],
					]
				);
			});
			test('edit.start > range.start && edit.start < range.end && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 7), 'c',
					[
						[new Selection(1, 4, 1, 8), new Selection(1, 8, 1, 4)],
						[new Selection(1, 4, 1, 8), new Selection(1, 8, 1, 4)],
					]
				);
			});
			test('edit.start > range.start && edit.start < range.end && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 9), 'c',
					[
						[new Selection(1, 4, 1, 6), new Selection(1, 6, 1, 4)],
						[new Selection(1, 4, 1, 6), new Selection(1, 6, 1, 4)],
					]
				);
			});
			test('edit.start > range.start && edit.start < range.end && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 10), 'c',
					[
						[new Selection(1, 4, 1, 6), new Selection(1, 6, 1, 4)],
						[new Selection(1, 4, 1, 6), new Selection(1, 6, 1, 4)],
					]
				);
			});
			test('edit.start == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 9, 1, 11), 'c',
					[
						[new Selection(1, 4, 1, 9), new Selection(1, 9, 1, 4)],
						[new Selection(1, 4, 1, 10), new Selection(1, 10, 1, 4)],
					]
				);
			});
			test('edit.start > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 10, 1, 11), 'c',
					[
						[new Selection(1, 4, 1, 9), new Selection(1, 9, 1, 4)],
						[new Selection(1, 4, 1, 9), new Selection(1, 9, 1, 4)],
					]
				);
			});
		});
	});

	suite('replace long', () => {
		suite('collapsed dec', () => {
			test('edit.end < range.start', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 1, 1, 3), 'cccc',
					[
						[new Selection(1, 6, 1, 6), new Selection(1, 6, 1, 6)],
						[new Selection(1, 6, 1, 6), new Selection(1, 6, 1, 6)],
					]
				);
			});
			test('edit.end <= range.start', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 2, 1, 4), 'cccc',
					[
						[new Selection(1, 6, 1, 6), new Selection(1, 6, 1, 6)],
						[new Selection(1, 6, 1, 6), new Selection(1, 6, 1, 6)],
					]
				);
			});
			test('edit.start < range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 3, 1, 5), 'cccc',
					[
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
						[new Selection(1, 7, 1, 7), new Selection(1, 7, 1, 7)],
					]
				);
			});
			test('edit.start >= range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 4, 1, 6), 'cccc',
					[
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
						[new Selection(1, 8, 1, 8), new Selection(1, 8, 1, 8)],
					]
				);
			});
			test('edit.start > range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 5, 1, 7), 'cccc',
					[
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
						[new Selection(1, 4, 1, 4), new Selection(1, 4, 1, 4)],
					]
				);
			});
		});
		suite('non-collapsed dec', () => {
			test('edit.end < range.start', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 1, 1, 3), 'cccc',
					[
						[new Selection(1, 6, 1, 11), new Selection(1, 11, 1, 6)],
						[new Selection(1, 6, 1, 11), new Selection(1, 11, 1, 6)],
					]
				);
			});
			test('edit.end <= range.start', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 2, 1, 4), 'cccc',
					[
						[new Selection(1, 4, 1, 11), new Selection(1, 11, 1, 4)],
						[new Selection(1, 6, 1, 11), new Selection(1, 11, 1, 6)],
					]
				);
			});
			test('edit.start < range.start && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 5), 'cccc',
					[
						[new Selection(1, 4, 1, 11), new Selection(1, 11, 1, 4)],
						[new Selection(1, 7, 1, 11), new Selection(1, 11, 1, 7)],
					]
				);
			});
			test('edit.start < range.start && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 9), 'cccc',
					[
						[new Selection(1, 4, 1, 7), new Selection(1, 7, 1, 4)],
						[new Selection(1, 7, 1, 7), new Selection(1, 7, 1, 7)],
					]
				);
			});
			test('edit.start < range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 10), 'cccc',
					[
						[new Selection(1, 4, 1, 7), new Selection(1, 7, 1, 4)],
						[new Selection(1, 7, 1, 7), new Selection(1, 7, 1, 7)],
					]
				);
			});
			test('edit.start == range.start && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 6), 'cccc',
					[
						[new Selection(1, 4, 1, 11), new Selection(1, 11, 1, 4)],
						[new Selection(1, 8, 1, 11), new Selection(1, 11, 1, 8)],
					]
				);
			});
			test('edit.start == range.start && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 9), 'cccc',
					[
						[new Selection(1, 4, 1, 8), new Selection(1, 8, 1, 4)],
						[new Selection(1, 8, 1, 8), new Selection(1, 8, 1, 8)],
					]
				);
			});
			test('edit.start == range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 10), 'cccc',
					[
						[new Selection(1, 4, 1, 8), new Selection(1, 8, 1, 4)],
						[new Selection(1, 8, 1, 8), new Selection(1, 8, 1, 8)],
					]
				);
			});
			test('edit.start > range.start && edit.start < range.end && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 7), 'cccc',
					[
						[new Selection(1, 4, 1, 11), new Selection(1, 11, 1, 4)],
						[new Selection(1, 4, 1, 11), new Selection(1, 11, 1, 4)],
					]
				);
			});
			test('edit.start > range.start && edit.start < range.end && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 9), 'cccc',
					[
						[new Selection(1, 4, 1, 9), new Selection(1, 9, 1, 4)],
						[new Selection(1, 4, 1, 9), new Selection(1, 9, 1, 4)],
					]
				);
			});
			test('edit.start > range.start && edit.start < range.end && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 10), 'cccc',
					[
						[new Selection(1, 4, 1, 9), new Selection(1, 9, 1, 4)],
						[new Selection(1, 4, 1, 9), new Selection(1, 9, 1, 4)],
					]
				);
			});
			test('edit.start == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 9, 1, 11), 'cccc',
					[
						[new Selection(1, 4, 1, 9), new Selection(1, 9, 1, 4)],
						[new Selection(1, 4, 1, 13), new Selection(1, 13, 1, 4)],
					]
				);
			});
			test('edit.start > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 10, 1, 11), 'cccc',
					[
						[new Selection(1, 4, 1, 9), new Selection(1, 9, 1, 4)],
						[new Selection(1, 4, 1, 9), new Selection(1, 9, 1, 4)],
					]
				);
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/commands/trimTrailingWhitespaceCommand.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/commands/trimTrailingWhitespaceCommand.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { TrimTrailingWhitespaceCommand, trimTrailingWhitespace } from '../../../common/commands/trimTrailingWhitespaceCommand.js';
import { ISingleEditOperation } from '../../../common/core/editOperation.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { MetadataConsts, StandardTokenType } from '../../../common/encodedTokenAttributes.js';
import { EncodedTokenizationResult, ITokenizationSupport, TokenizationRegistry } from '../../../common/languages.js';
import { ILanguageService } from '../../../common/languages/language.js';
import { NullState } from '../../../common/languages/nullTokenize.js';
import { getEditOperation } from '../testCommand.js';
import { createModelServices, instantiateTextModel, withEditorModel } from '../../common/testTextModel.js';

/**
 * Create single edit operation
 */
function createInsertDeleteSingleEditOp(text: string | null, positionLineNumber: number, positionColumn: number, selectionLineNumber: number = positionLineNumber, selectionColumn: number = positionColumn): ISingleEditOperation {
	return {
		range: new Range(selectionLineNumber, selectionColumn, positionLineNumber, positionColumn),
		text: text
	};
}

/**
 * Create single edit operation
 */
function createSingleEditOp(text: string | null, positionLineNumber: number, positionColumn: number, selectionLineNumber: number = positionLineNumber, selectionColumn: number = positionColumn): ISingleEditOperation {
	return {
		range: new Range(selectionLineNumber, selectionColumn, positionLineNumber, positionColumn),
		text: text,
		forceMoveMarkers: false
	};
}

function assertTrimTrailingWhitespaceCommand(text: string[], expected: ISingleEditOperation[]): void {
	return withEditorModel(text, (model) => {
		const op = new TrimTrailingWhitespaceCommand(new Selection(1, 1, 1, 1), [], true);
		const actual = getEditOperation(model, op);
		assert.deepStrictEqual(actual, expected);
	});
}

function assertTrimTrailingWhitespace(text: string[], cursors: Position[], expected: ISingleEditOperation[]): void {
	return withEditorModel(text, (model) => {
		const actual = trimTrailingWhitespace(model, cursors, true);
		assert.deepStrictEqual(actual, expected);
	});
}

suite('Editor Commands - Trim Trailing Whitespace Command', () => {

	let disposables: DisposableStore;

	setup(() => {
		disposables = new DisposableStore();
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('remove trailing whitespace', function () {
		assertTrimTrailingWhitespaceCommand([''], []);
		assertTrimTrailingWhitespaceCommand(['text'], []);
		assertTrimTrailingWhitespaceCommand(['text   '], [createSingleEditOp(null, 1, 5, 1, 8)]);
		assertTrimTrailingWhitespaceCommand(['text\t   '], [createSingleEditOp(null, 1, 5, 1, 9)]);
		assertTrimTrailingWhitespaceCommand(['\t   '], [createSingleEditOp(null, 1, 1, 1, 5)]);
		assertTrimTrailingWhitespaceCommand(['text\t'], [createSingleEditOp(null, 1, 5, 1, 6)]);
		assertTrimTrailingWhitespaceCommand([
			'some text\t',
			'some more text',
			'\t  ',
			'even more text  ',
			'and some mixed\t   \t'
		], [
			createSingleEditOp(null, 1, 10, 1, 11),
			createSingleEditOp(null, 3, 1, 3, 4),
			createSingleEditOp(null, 4, 15, 4, 17),
			createSingleEditOp(null, 5, 15, 5, 20)
		]);


		assertTrimTrailingWhitespace(['text   '], [new Position(1, 1), new Position(1, 2), new Position(1, 3)], [createInsertDeleteSingleEditOp(null, 1, 5, 1, 8)]);
		assertTrimTrailingWhitespace(['text   '], [new Position(1, 1), new Position(1, 5)], [createInsertDeleteSingleEditOp(null, 1, 5, 1, 8)]);
		assertTrimTrailingWhitespace(['text   '], [new Position(1, 1), new Position(1, 5), new Position(1, 6)], [createInsertDeleteSingleEditOp(null, 1, 6, 1, 8)]);
		assertTrimTrailingWhitespace([
			'some text\t',
			'some more text',
			'\t  ',
			'even more text  ',
			'and some mixed\t   \t'
		], [], [
			createInsertDeleteSingleEditOp(null, 1, 10, 1, 11),
			createInsertDeleteSingleEditOp(null, 3, 1, 3, 4),
			createInsertDeleteSingleEditOp(null, 4, 15, 4, 17),
			createInsertDeleteSingleEditOp(null, 5, 15, 5, 20)
		]);
		assertTrimTrailingWhitespace([
			'some text\t',
			'some more text',
			'\t  ',
			'even more text  ',
			'and some mixed\t   \t'
		], [new Position(1, 11), new Position(3, 2), new Position(5, 1), new Position(4, 1), new Position(5, 10)], [
			createInsertDeleteSingleEditOp(null, 3, 2, 3, 4),
			createInsertDeleteSingleEditOp(null, 4, 15, 4, 17),
			createInsertDeleteSingleEditOp(null, 5, 15, 5, 20)
		]);
	});

	test('skips strings and regex if configured', function () {
		const instantiationService = createModelServices(disposables);
		const languageService = instantiationService.get(ILanguageService);
		const languageId = 'testLanguageId';
		const languageIdCodec = languageService.languageIdCodec;
		disposables.add(languageService.registerLanguage({ id: languageId }));
		const encodedLanguageId = languageIdCodec.encodeLanguageId(languageId);

		const otherMetadata = (
			(encodedLanguageId << MetadataConsts.LANGUAGEID_OFFSET)
			| (StandardTokenType.Other << MetadataConsts.TOKEN_TYPE_OFFSET)
			| (MetadataConsts.BALANCED_BRACKETS_MASK)
		) >>> 0;
		const stringMetadata = (
			(encodedLanguageId << MetadataConsts.LANGUAGEID_OFFSET)
			| (StandardTokenType.String << MetadataConsts.TOKEN_TYPE_OFFSET)
			| (MetadataConsts.BALANCED_BRACKETS_MASK)
		) >>> 0;

		const tokenizationSupport: ITokenizationSupport = {
			getInitialState: () => NullState,
			tokenize: undefined!,
			tokenizeEncoded: (line, hasEOL, state) => {
				switch (line) {
					case 'const a = `  ': {
						const tokens = new Uint32Array([
							0, otherMetadata,
							10, stringMetadata,
						]);
						return new EncodedTokenizationResult(tokens, [], state);
					}
					case '  a string  ': {
						const tokens = new Uint32Array([
							0, stringMetadata,
						]);
						return new EncodedTokenizationResult(tokens, [], state);
					}
					case '`;  ': {
						const tokens = new Uint32Array([
							0, stringMetadata,
							1, otherMetadata
						]);
						return new EncodedTokenizationResult(tokens, [], state);
					}
				}
				throw new Error(`Unexpected`);
			}
		};

		disposables.add(TokenizationRegistry.register(languageId, tokenizationSupport));

		const model = disposables.add(instantiateTextModel(
			instantiationService,
			[
				'const a = `  ',
				'  a string  ',
				'`;  ',
			].join('\n'),
			languageId
		));

		model.tokenization.forceTokenization(1);
		model.tokenization.forceTokenization(2);
		model.tokenization.forceTokenization(3);

		const op = new TrimTrailingWhitespaceCommand(new Selection(1, 1, 1, 1), [], false);
		const actual = getEditOperation(model, op);
		assert.deepStrictEqual(actual, [createSingleEditOp(null, 3, 3, 3, 5)]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/config/editorConfiguration.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/config/editorConfiguration.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IEnvConfiguration } from '../../../browser/config/editorConfiguration.js';
import { migrateOptions } from '../../../browser/config/migrateOptions.js';
import { ConfigurationChangedEvent, EditorOption, IEditorHoverOptions, IQuickSuggestionsOptions } from '../../../common/config/editorOptions.js';
import { EditorZoom } from '../../../common/config/editorZoom.js';
import { TestConfiguration } from './testConfiguration.js';
import { AccessibilitySupport } from '../../../../platform/accessibility/common/accessibility.js';

suite('Common Editor Config', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Zoom Level', () => {

		//Zoom levels are defined to go between -5, 20 inclusive
		const zoom = EditorZoom;

		zoom.setZoomLevel(0);
		assert.strictEqual(zoom.getZoomLevel(), 0);

		zoom.setZoomLevel(-0);
		assert.strictEqual(zoom.getZoomLevel(), 0);

		zoom.setZoomLevel(5);
		assert.strictEqual(zoom.getZoomLevel(), 5);

		zoom.setZoomLevel(-1);
		assert.strictEqual(zoom.getZoomLevel(), -1);

		zoom.setZoomLevel(9);
		assert.strictEqual(zoom.getZoomLevel(), 9);

		zoom.setZoomLevel(-9);
		assert.strictEqual(zoom.getZoomLevel(), -5);

		zoom.setZoomLevel(20);
		assert.strictEqual(zoom.getZoomLevel(), 20);

		zoom.setZoomLevel(-10);
		assert.strictEqual(zoom.getZoomLevel(), -5);

		zoom.setZoomLevel(9.1);
		assert.strictEqual(zoom.getZoomLevel(), 9.1);

		zoom.setZoomLevel(-9.1);
		assert.strictEqual(zoom.getZoomLevel(), -5);

		zoom.setZoomLevel(Infinity);
		assert.strictEqual(zoom.getZoomLevel(), 20);

		zoom.setZoomLevel(Number.NEGATIVE_INFINITY);
		assert.strictEqual(zoom.getZoomLevel(), -5);
	});

	class TestWrappingConfiguration extends TestConfiguration {
		protected override _readEnvConfiguration(): IEnvConfiguration {
			return {
				extraEditorClassName: '',
				outerWidth: 1000,
				outerHeight: 100,
				emptySelectionClipboard: true,
				pixelRatio: 1,
				accessibilitySupport: AccessibilitySupport.Unknown,
				editContextSupported: true,
			};
		}
	}

	function assertWrapping(config: TestConfiguration, isViewportWrapping: boolean, wrappingColumn: number): void {
		const options = config.options;
		const wrappingInfo = options.get(EditorOption.wrappingInfo);
		assert.strictEqual(wrappingInfo.isViewportWrapping, isViewportWrapping);
		assert.strictEqual(wrappingInfo.wrappingColumn, wrappingColumn);
	}

	test('wordWrap default', () => {
		const config = new TestWrappingConfiguration({});
		assertWrapping(config, false, -1);
		config.dispose();
	});

	test('wordWrap compat false', () => {
		const config = new TestWrappingConfiguration({
			// eslint-disable-next-line local/code-no-any-casts
			wordWrap: <any>false
		});
		assertWrapping(config, false, -1);
		config.dispose();
	});

	test('wordWrap compat true', () => {
		const config = new TestWrappingConfiguration({
			// eslint-disable-next-line local/code-no-any-casts
			wordWrap: <any>true
		});
		assertWrapping(config, true, 80);
		config.dispose();
	});

	test('wordWrap on', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'on'
		});
		assertWrapping(config, true, 80);
		config.dispose();
	});

	test('wordWrap on without minimap', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'on',
			minimap: {
				enabled: false
			}
		});
		assertWrapping(config, true, 88);
		config.dispose();
	});

	test('wordWrap on does not use wordWrapColumn', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'on',
			wordWrapColumn: 10
		});
		assertWrapping(config, true, 80);
		config.dispose();
	});

	test('wordWrap off', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'off'
		});
		assertWrapping(config, false, -1);
		config.dispose();
	});

	test('wordWrap off does not use wordWrapColumn', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'off',
			wordWrapColumn: 10
		});
		assertWrapping(config, false, -1);
		config.dispose();
	});

	test('wordWrap wordWrapColumn uses default wordWrapColumn', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'wordWrapColumn'
		});
		assertWrapping(config, false, 80);
		config.dispose();
	});

	test('wordWrap wordWrapColumn uses wordWrapColumn', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'wordWrapColumn',
			wordWrapColumn: 100
		});
		assertWrapping(config, false, 100);
		config.dispose();
	});

	test('wordWrap wordWrapColumn validates wordWrapColumn', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'wordWrapColumn',
			wordWrapColumn: -1
		});
		assertWrapping(config, false, 1);
		config.dispose();
	});

	test('wordWrap bounded uses default wordWrapColumn', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'bounded'
		});
		assertWrapping(config, true, 80);
		config.dispose();
	});

	test('wordWrap bounded uses wordWrapColumn', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'bounded',
			wordWrapColumn: 40
		});
		assertWrapping(config, true, 40);
		config.dispose();
	});

	test('wordWrap bounded validates wordWrapColumn', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'bounded',
			wordWrapColumn: -1
		});
		assertWrapping(config, true, 1);
		config.dispose();
	});

	test('issue #53152: Cannot assign to read only property \'enabled\' of object', () => {
		const hoverOptions: IEditorHoverOptions = {};
		Object.defineProperty(hoverOptions, 'enabled', {
			writable: false,
			value: 'on'
		});
		const config = new TestConfiguration({ hover: hoverOptions });

		assert.strictEqual(config.options.get(EditorOption.hover).enabled, 'on');
		config.updateOptions({ hover: { enabled: 'off' } });
		assert.strictEqual(config.options.get(EditorOption.hover).enabled, 'off');

		config.dispose();
	});

	test('does not emit event when nothing changes', () => {
		const config = new TestConfiguration({ glyphMargin: true, roundedSelection: false });
		let event: ConfigurationChangedEvent | null = null;
		const disposable = config.onDidChange(e => event = e);
		assert.strictEqual(config.options.get(EditorOption.glyphMargin), true);

		config.updateOptions({ glyphMargin: true });
		config.updateOptions({ roundedSelection: false });
		assert.strictEqual(event, null);
		config.dispose();
		disposable.dispose();
	});

	test('issue #94931: Unable to open source file', () => {
		const config = new TestConfiguration({ quickSuggestions: null! });
		const actual = <Readonly<Required<IQuickSuggestionsOptions>>>config.options.get(EditorOption.quickSuggestions);
		assert.deepStrictEqual(actual, {
			other: 'on',
			comments: 'off',
			strings: 'off'
		});
		config.dispose();
	});

	test('issue #102920: Can\'t snap or split view with JSON files', () => {
		const config = new TestConfiguration({ quickSuggestions: null! });
		config.updateOptions({ quickSuggestions: { strings: true } });
		const actual = <Readonly<Required<IQuickSuggestionsOptions>>>config.options.get(EditorOption.quickSuggestions);
		assert.deepStrictEqual(actual, {
			other: 'on',
			comments: 'off',
			strings: 'on'
		});
		config.dispose();
	});

	test('issue #151926: Untyped editor options apply', () => {
		const config = new TestConfiguration({});
		config.updateOptions({ unicodeHighlight: { allowedCharacters: { 'x': true } } });
		const actual = config.options.get(EditorOption.unicodeHighlighting);
		assert.deepStrictEqual(actual,
			{
				nonBasicASCII: 'inUntrustedWorkspace',
				invisibleCharacters: true,
				ambiguousCharacters: true,
				includeComments: 'inUntrustedWorkspace',
				includeStrings: 'inUntrustedWorkspace',
				allowedCharacters: { 'x': true },
				allowedLocales: { '_os': true, '_vscode': true }
			}
		);
		config.dispose();
	});
});

suite('migrateOptions', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function migrate(options: any): any {
		migrateOptions(options);
		return options;
	}

	test('wordWrap', () => {
		assert.deepStrictEqual(migrate({ wordWrap: true }), { wordWrap: 'on' });
		assert.deepStrictEqual(migrate({ wordWrap: false }), { wordWrap: 'off' });
	});
	test('lineNumbers', () => {
		assert.deepStrictEqual(migrate({ lineNumbers: true }), { lineNumbers: 'on' });
		assert.deepStrictEqual(migrate({ lineNumbers: false }), { lineNumbers: 'off' });
	});
	test('autoClosingBrackets', () => {
		assert.deepStrictEqual(migrate({ autoClosingBrackets: false }), { autoClosingBrackets: 'never', autoClosingQuotes: 'never', autoSurround: 'never' });
	});
	test('cursorBlinking', () => {
		assert.deepStrictEqual(migrate({ cursorBlinking: 'visible' }), { cursorBlinking: 'solid' });
	});
	test('renderWhitespace', () => {
		assert.deepStrictEqual(migrate({ renderWhitespace: true }), { renderWhitespace: 'boundary' });
		assert.deepStrictEqual(migrate({ renderWhitespace: false }), { renderWhitespace: 'none' });
	});
	test('renderLineHighlight', () => {
		assert.deepStrictEqual(migrate({ renderLineHighlight: true }), { renderLineHighlight: 'line' });
		assert.deepStrictEqual(migrate({ renderLineHighlight: false }), { renderLineHighlight: 'none' });
	});
	test('acceptSuggestionOnEnter', () => {
		assert.deepStrictEqual(migrate({ acceptSuggestionOnEnter: true }), { acceptSuggestionOnEnter: 'on' });
		assert.deepStrictEqual(migrate({ acceptSuggestionOnEnter: false }), { acceptSuggestionOnEnter: 'off' });
	});
	test('tabCompletion', () => {
		assert.deepStrictEqual(migrate({ tabCompletion: true }), { tabCompletion: 'onlySnippets' });
		assert.deepStrictEqual(migrate({ tabCompletion: false }), { tabCompletion: 'off' });
	});
	test('suggest.filteredTypes', () => {
		assert.deepStrictEqual(
			migrate({
				suggest: {
					filteredTypes: {
						method: false,
						function: false,
						constructor: false,
						deprecated: false,
						field: false,
						variable: false,
						class: false,
						struct: false,
						interface: false,
						module: false,
						property: false,
						event: false,
						operator: false,
						unit: false,
						value: false,
						constant: false,
						enum: false,
						enumMember: false,
						keyword: false,
						text: false,
						color: false,
						file: false,
						reference: false,
						folder: false,
						typeParameter: false,
						snippet: false,
					}
				}
			}), {
			suggest: {
				filteredTypes: undefined,
				showMethods: false,
				showFunctions: false,
				showConstructors: false,
				showDeprecated: false,
				showFields: false,
				showVariables: false,
				showClasses: false,
				showStructs: false,
				showInterfaces: false,
				showModules: false,
				showProperties: false,
				showEvents: false,
				showOperators: false,
				showUnits: false,
				showValues: false,
				showConstants: false,
				showEnums: false,
				showEnumMembers: false,
				showKeywords: false,
				showWords: false,
				showColors: false,
				showFiles: false,
				showReferences: false,
				showFolders: false,
				showTypeParameters: false,
				showSnippets: false,
			}
		});
	});
	test('quickSuggestions', () => {
		assert.deepStrictEqual(migrate({ quickSuggestions: true }), { quickSuggestions: { comments: 'on', strings: 'on', other: 'on' } });
		assert.deepStrictEqual(migrate({ quickSuggestions: false }), { quickSuggestions: { comments: 'off', strings: 'off', other: 'off' } });
		assert.deepStrictEqual(migrate({ quickSuggestions: { comments: 'on', strings: 'off' } }), { quickSuggestions: { comments: 'on', strings: 'off' } });
	});
	test('hover', () => {
		assert.deepStrictEqual(migrate({ hover: true }), { hover: { enabled: 'on' } });
		assert.deepStrictEqual(migrate({ hover: false }), { hover: { enabled: 'off' } });
	});
	test('parameterHints', () => {
		assert.deepStrictEqual(migrate({ parameterHints: true }), { parameterHints: { enabled: true } });
		assert.deepStrictEqual(migrate({ parameterHints: false }), { parameterHints: { enabled: false } });
	});
	test('autoIndent', () => {
		assert.deepStrictEqual(migrate({ autoIndent: true }), { autoIndent: 'full' });
		assert.deepStrictEqual(migrate({ autoIndent: false }), { autoIndent: 'advanced' });
	});
	test('matchBrackets', () => {
		assert.deepStrictEqual(migrate({ matchBrackets: true }), { matchBrackets: 'always' });
		assert.deepStrictEqual(migrate({ matchBrackets: false }), { matchBrackets: 'never' });
	});
	test('renderIndentGuides, highlightActiveIndentGuide', () => {
		assert.deepStrictEqual(migrate({ renderIndentGuides: true }), { renderIndentGuides: undefined, guides: { indentation: true } });
		assert.deepStrictEqual(migrate({ renderIndentGuides: false }), { renderIndentGuides: undefined, guides: { indentation: false } });
		assert.deepStrictEqual(migrate({ highlightActiveIndentGuide: true }), { highlightActiveIndentGuide: undefined, guides: { highlightActiveIndentation: true } });
		assert.deepStrictEqual(migrate({ highlightActiveIndentGuide: false }), { highlightActiveIndentGuide: undefined, guides: { highlightActiveIndentation: false } });
	});

	test('migration does not overwrite new setting', () => {
		assert.deepStrictEqual(migrate({ renderIndentGuides: true, guides: { indentation: false } }), { renderIndentGuides: undefined, guides: { indentation: false } });
		assert.deepStrictEqual(migrate({ highlightActiveIndentGuide: true, guides: { highlightActiveIndentation: false } }), { highlightActiveIndentGuide: undefined, guides: { highlightActiveIndentation: false } });
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/config/editorLayoutProvider.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/config/editorLayoutProvider.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ComputedEditorOptions } from '../../../browser/config/editorConfiguration.js';
import { EditorLayoutInfo, EditorLayoutInfoComputer, EditorMinimapOptions, EditorOption, EditorOptions, InternalEditorRenderLineNumbersOptions, InternalEditorScrollbarOptions, RenderLineNumbersType, RenderMinimap } from '../../../common/config/editorOptions.js';

interface IEditorLayoutProviderOpts {
	readonly outerWidth: number;
	readonly outerHeight: number;

	readonly showGlyphMargin: boolean;
	readonly lineHeight: number;

	readonly showLineNumbers: boolean;
	readonly lineNumbersMinChars: number;
	readonly lineNumbersDigitCount: number;
	maxLineNumber?: number;

	readonly lineDecorationsWidth: number;

	readonly typicalHalfwidthCharacterWidth: number;
	readonly maxDigitWidth: number;

	readonly verticalScrollbarWidth: number;
	readonly verticalScrollbarHasArrows: boolean;
	readonly scrollbarArrowSize: number;
	readonly horizontalScrollbarHeight: number;

	readonly minimap: boolean;
	readonly minimapSide: 'left' | 'right';
	readonly minimapRenderCharacters: boolean;
	readonly minimapMaxColumn: number;
	minimapSize?: 'proportional' | 'fill' | 'fit';
	readonly pixelRatio: number;
}

suite('Editor ViewLayout - EditorLayoutProvider', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function doTest(input: IEditorLayoutProviderOpts, expected: EditorLayoutInfo): void {
		const options = new ComputedEditorOptions();
		options._write(EditorOption.glyphMargin, input.showGlyphMargin);
		options._write(EditorOption.lineNumbersMinChars, input.lineNumbersMinChars);
		options._write(EditorOption.lineDecorationsWidth, input.lineDecorationsWidth);
		options._write(EditorOption.folding, false);
		options._write(EditorOption.padding, { top: 0, bottom: 0 });
		const minimapOptions: EditorMinimapOptions = {
			enabled: input.minimap,
			autohide: 'none',
			size: input.minimapSize || 'proportional',
			side: input.minimapSide,
			renderCharacters: input.minimapRenderCharacters,
			maxColumn: input.minimapMaxColumn,
			showSlider: 'mouseover',
			scale: 1,
			showRegionSectionHeaders: true,
			showMarkSectionHeaders: true,
			sectionHeaderFontSize: 9,
			sectionHeaderLetterSpacing: 1,
			markSectionHeaderRegex: '\\bMARK:\\s*(?<separator>\-?)\\s*(?<label>.*)$',
		};
		options._write(EditorOption.minimap, minimapOptions);
		const scrollbarOptions: InternalEditorScrollbarOptions = {
			arrowSize: input.scrollbarArrowSize,
			vertical: EditorOptions.scrollbar.defaultValue.vertical,
			horizontal: EditorOptions.scrollbar.defaultValue.horizontal,
			useShadows: EditorOptions.scrollbar.defaultValue.useShadows,
			verticalHasArrows: input.verticalScrollbarHasArrows,
			horizontalHasArrows: false,
			handleMouseWheel: EditorOptions.scrollbar.defaultValue.handleMouseWheel,
			alwaysConsumeMouseWheel: true,
			horizontalScrollbarSize: input.horizontalScrollbarHeight,
			horizontalSliderSize: EditorOptions.scrollbar.defaultValue.horizontalSliderSize,
			verticalScrollbarSize: input.verticalScrollbarWidth,
			verticalSliderSize: EditorOptions.scrollbar.defaultValue.verticalSliderSize,
			scrollByPage: EditorOptions.scrollbar.defaultValue.scrollByPage,
			ignoreHorizontalScrollbarInContentHeight: false,
		};
		options._write(EditorOption.scrollbar, scrollbarOptions);
		const lineNumbersOptions: InternalEditorRenderLineNumbersOptions = {
			renderType: input.showLineNumbers ? RenderLineNumbersType.On : RenderLineNumbersType.Off,
			renderFn: null
		};
		options._write(EditorOption.lineNumbers, lineNumbersOptions);

		options._write(EditorOption.wordWrap, 'off');
		options._write(EditorOption.wordWrapColumn, 80);
		options._write(EditorOption.wordWrapOverride1, 'inherit');
		options._write(EditorOption.wordWrapOverride2, 'inherit');
		options._write(EditorOption.accessibilitySupport, 'auto');

		const actual = EditorLayoutInfoComputer.computeLayout(options, {
			memory: null,
			outerWidth: input.outerWidth,
			outerHeight: input.outerHeight,
			isDominatedByLongLines: false,
			lineHeight: input.lineHeight,
			viewLineCount: input.maxLineNumber || Math.pow(10, input.lineNumbersDigitCount) - 1,
			lineNumbersDigitCount: input.lineNumbersDigitCount,
			typicalHalfwidthCharacterWidth: input.typicalHalfwidthCharacterWidth,
			maxDigitWidth: input.maxDigitWidth,
			pixelRatio: input.pixelRatio,
			glyphMarginDecorationLaneCount: 1,
		});
		assert.deepStrictEqual(actual, expected);
	}

	test('EditorLayoutProvider 1', () => {
		doTest({
			outerWidth: 1000,
			outerHeight: 800,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: false,
			lineNumbersMinChars: 0,
			lineNumbersDigitCount: 1,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 10,
			maxDigitWidth: 10,
			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,
			scrollbarArrowSize: 0,
			verticalScrollbarHasArrows: false,
			minimap: false,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			pixelRatio: 1,
		}, {
			width: 1000,
			height: 800,

			glyphMarginLeft: 0,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 0,
			lineNumbersWidth: 0,

			decorationsLeft: 0,
			decorationsWidth: 10,

			contentLeft: 10,
			contentWidth: 990,

			minimap: {
				renderMinimap: RenderMinimap.None,
				minimapLeft: 0,
				minimapWidth: 0,
				minimapHeightIsEditorHeight: false,
				minimapIsSampling: false,
				minimapScale: 1,
				minimapLineHeight: 1,
				minimapCanvasInnerWidth: 0,
				minimapCanvasInnerHeight: 800,
				minimapCanvasOuterWidth: 0,
				minimapCanvasOuterHeight: 800,
			},

			viewportColumn: 98,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,

			overviewRuler: {
				top: 0,
				width: 0,
				height: 800,
				right: 0
			}
		});
	});

	test('EditorLayoutProvider 1.1', () => {
		doTest({
			outerWidth: 1000,
			outerHeight: 800,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: false,
			lineNumbersMinChars: 0,
			lineNumbersDigitCount: 1,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 10,
			maxDigitWidth: 10,
			verticalScrollbarWidth: 11,
			horizontalScrollbarHeight: 12,
			scrollbarArrowSize: 13,
			verticalScrollbarHasArrows: true,
			minimap: false,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			pixelRatio: 1,
		}, {
			width: 1000,
			height: 800,

			glyphMarginLeft: 0,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 0,
			lineNumbersWidth: 0,

			decorationsLeft: 0,
			decorationsWidth: 10,

			contentLeft: 10,
			contentWidth: 990,

			minimap: {
				renderMinimap: RenderMinimap.None,
				minimapLeft: 0,
				minimapWidth: 0,
				minimapHeightIsEditorHeight: false,
				minimapIsSampling: false,
				minimapScale: 1,
				minimapLineHeight: 1,
				minimapCanvasInnerWidth: 0,
				minimapCanvasInnerHeight: 800,
				minimapCanvasOuterWidth: 0,
				minimapCanvasOuterHeight: 800,
			},

			viewportColumn: 97,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 11,
			horizontalScrollbarHeight: 12,

			overviewRuler: {
				top: 13,
				width: 11,
				height: (800 - 2 * 13),
				right: 0
			}
		});
	});

	test('EditorLayoutProvider 2', () => {
		doTest({
			outerWidth: 900,
			outerHeight: 800,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: false,
			lineNumbersMinChars: 0,
			lineNumbersDigitCount: 1,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 10,
			maxDigitWidth: 10,
			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,
			scrollbarArrowSize: 0,
			verticalScrollbarHasArrows: false,
			minimap: false,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			pixelRatio: 1,
		}, {
			width: 900,
			height: 800,

			glyphMarginLeft: 0,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 0,
			lineNumbersWidth: 0,

			decorationsLeft: 0,
			decorationsWidth: 10,

			contentLeft: 10,
			contentWidth: 890,

			minimap: {
				renderMinimap: RenderMinimap.None,
				minimapLeft: 0,
				minimapWidth: 0,
				minimapHeightIsEditorHeight: false,
				minimapIsSampling: false,
				minimapScale: 1,
				minimapLineHeight: 1,
				minimapCanvasInnerWidth: 0,
				minimapCanvasInnerHeight: 800,
				minimapCanvasOuterWidth: 0,
				minimapCanvasOuterHeight: 800,
			},

			viewportColumn: 88,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,

			overviewRuler: {
				top: 0,
				width: 0,
				height: 800,
				right: 0
			}
		});
	});

	test('EditorLayoutProvider 3', () => {
		doTest({
			outerWidth: 900,
			outerHeight: 900,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: false,
			lineNumbersMinChars: 0,
			lineNumbersDigitCount: 1,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 10,
			maxDigitWidth: 10,
			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,
			scrollbarArrowSize: 0,
			verticalScrollbarHasArrows: false,
			minimap: false,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			pixelRatio: 1,
		}, {
			width: 900,
			height: 900,

			glyphMarginLeft: 0,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 0,
			lineNumbersWidth: 0,

			decorationsLeft: 0,
			decorationsWidth: 10,

			contentLeft: 10,
			contentWidth: 890,

			minimap: {
				renderMinimap: RenderMinimap.None,
				minimapLeft: 0,
				minimapWidth: 0,
				minimapHeightIsEditorHeight: false,
				minimapIsSampling: false,
				minimapScale: 1,
				minimapLineHeight: 1,
				minimapCanvasInnerWidth: 0,
				minimapCanvasInnerHeight: 900,
				minimapCanvasOuterWidth: 0,
				minimapCanvasOuterHeight: 900,
			},

			viewportColumn: 88,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,

			overviewRuler: {
				top: 0,
				width: 0,
				height: 900,
				right: 0
			}
		});
	});

	test('EditorLayoutProvider 4', () => {
		doTest({
			outerWidth: 900,
			outerHeight: 900,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: false,
			lineNumbersMinChars: 5,
			lineNumbersDigitCount: 1,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 10,
			maxDigitWidth: 10,
			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,
			scrollbarArrowSize: 0,
			verticalScrollbarHasArrows: false,
			minimap: false,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			pixelRatio: 1,
		}, {
			width: 900,
			height: 900,

			glyphMarginLeft: 0,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 0,
			lineNumbersWidth: 0,

			decorationsLeft: 0,
			decorationsWidth: 10,

			contentLeft: 10,
			contentWidth: 890,

			minimap: {
				renderMinimap: RenderMinimap.None,
				minimapLeft: 0,
				minimapWidth: 0,
				minimapHeightIsEditorHeight: false,
				minimapIsSampling: false,
				minimapScale: 1,
				minimapLineHeight: 1,
				minimapCanvasInnerWidth: 0,
				minimapCanvasInnerHeight: 900,
				minimapCanvasOuterWidth: 0,
				minimapCanvasOuterHeight: 900,
			},

			viewportColumn: 88,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,

			overviewRuler: {
				top: 0,
				width: 0,
				height: 900,
				right: 0
			}
		});
	});

	test('EditorLayoutProvider 5', () => {
		doTest({
			outerWidth: 900,
			outerHeight: 900,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: true,
			lineNumbersMinChars: 5,
			lineNumbersDigitCount: 1,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 10,
			maxDigitWidth: 10,
			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,
			scrollbarArrowSize: 0,
			verticalScrollbarHasArrows: false,
			minimap: false,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			pixelRatio: 1,
		}, {
			width: 900,
			height: 900,

			glyphMarginLeft: 0,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 0,
			lineNumbersWidth: 50,

			decorationsLeft: 50,
			decorationsWidth: 10,

			contentLeft: 60,
			contentWidth: 840,

			minimap: {
				renderMinimap: RenderMinimap.None,
				minimapLeft: 0,
				minimapWidth: 0,
				minimapHeightIsEditorHeight: false,
				minimapIsSampling: false,
				minimapScale: 1,
				minimapLineHeight: 1,
				minimapCanvasInnerWidth: 0,
				minimapCanvasInnerHeight: 900,
				minimapCanvasOuterWidth: 0,
				minimapCanvasOuterHeight: 900,
			},

			viewportColumn: 83,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,

			overviewRuler: {
				top: 0,
				width: 0,
				height: 900,
				right: 0
			}
		});
	});

	test('EditorLayoutProvider 6', () => {
		doTest({
			outerWidth: 900,
			outerHeight: 900,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: true,
			lineNumbersMinChars: 5,
			lineNumbersDigitCount: 5,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 10,
			maxDigitWidth: 10,
			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,
			scrollbarArrowSize: 0,
			verticalScrollbarHasArrows: false,
			minimap: false,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			pixelRatio: 1,
		}, {
			width: 900,
			height: 900,

			glyphMarginLeft: 0,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 0,
			lineNumbersWidth: 50,

			decorationsLeft: 50,
			decorationsWidth: 10,

			contentLeft: 60,
			contentWidth: 840,

			minimap: {
				renderMinimap: RenderMinimap.None,
				minimapLeft: 0,
				minimapWidth: 0,
				minimapHeightIsEditorHeight: false,
				minimapIsSampling: false,
				minimapScale: 1,
				minimapLineHeight: 1,
				minimapCanvasInnerWidth: 0,
				minimapCanvasInnerHeight: 900,
				minimapCanvasOuterWidth: 0,
				minimapCanvasOuterHeight: 900,
			},

			viewportColumn: 83,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,

			overviewRuler: {
				top: 0,
				width: 0,
				height: 900,
				right: 0
			}
		});
	});

	test('EditorLayoutProvider 7', () => {
		doTest({
			outerWidth: 900,
			outerHeight: 900,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: true,
			lineNumbersMinChars: 5,
			lineNumbersDigitCount: 6,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 10,
			maxDigitWidth: 10,
			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,
			scrollbarArrowSize: 0,
			verticalScrollbarHasArrows: false,
			minimap: false,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			pixelRatio: 1,
		}, {
			width: 900,
			height: 900,

			glyphMarginLeft: 0,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 0,
			lineNumbersWidth: 60,

			decorationsLeft: 60,
			decorationsWidth: 10,

			contentLeft: 70,
			contentWidth: 830,

			minimap: {
				renderMinimap: RenderMinimap.None,
				minimapLeft: 0,
				minimapWidth: 0,
				minimapHeightIsEditorHeight: false,
				minimapIsSampling: false,
				minimapScale: 1,
				minimapLineHeight: 1,
				minimapCanvasInnerWidth: 0,
				minimapCanvasInnerHeight: 900,
				minimapCanvasOuterWidth: 0,
				minimapCanvasOuterHeight: 900,
			},

			viewportColumn: 82,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,

			overviewRuler: {
				top: 0,
				width: 0,
				height: 900,
				right: 0
			}
		});
	});

	test('EditorLayoutProvider 8', () => {
		doTest({
			outerWidth: 900,
			outerHeight: 900,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: true,
			lineNumbersMinChars: 5,
			lineNumbersDigitCount: 6,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 5,
			maxDigitWidth: 5,
			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,
			scrollbarArrowSize: 0,
			verticalScrollbarHasArrows: false,
			minimap: false,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			pixelRatio: 1,
		}, {
			width: 900,
			height: 900,

			glyphMarginLeft: 0,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 0,
			lineNumbersWidth: 30,

			decorationsLeft: 30,
			decorationsWidth: 10,

			contentLeft: 40,
			contentWidth: 860,

			minimap: {
				renderMinimap: RenderMinimap.None,
				minimapLeft: 0,
				minimapWidth: 0,
				minimapHeightIsEditorHeight: false,
				minimapIsSampling: false,
				minimapScale: 1,
				minimapLineHeight: 1,
				minimapCanvasInnerWidth: 0,
				minimapCanvasInnerHeight: 900,
				minimapCanvasOuterWidth: 0,
				minimapCanvasOuterHeight: 900,
			},

			viewportColumn: 171,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,

			overviewRuler: {
				top: 0,
				width: 0,
				height: 900,
				right: 0
			}
		});
	});

	test('EditorLayoutProvider 8 - rounds floats', () => {
		doTest({
			outerWidth: 900,
			outerHeight: 900,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: true,
			lineNumbersMinChars: 5,
			lineNumbersDigitCount: 6,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 5.05,
			maxDigitWidth: 5.05,
			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,
			scrollbarArrowSize: 0,
			verticalScrollbarHasArrows: false,
			minimap: false,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			pixelRatio: 1,
		}, {
			width: 900,
			height: 900,

			glyphMarginLeft: 0,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 0,
			lineNumbersWidth: 30,

			decorationsLeft: 30,
			decorationsWidth: 10,

			contentLeft: 40,
			contentWidth: 860,

			minimap: {
				renderMinimap: RenderMinimap.None,
				minimapLeft: 0,
				minimapWidth: 0,
				minimapHeightIsEditorHeight: false,
				minimapIsSampling: false,
				minimapScale: 1,
				minimapLineHeight: 1,
				minimapCanvasInnerWidth: 0,
				minimapCanvasInnerHeight: 900,
				minimapCanvasOuterWidth: 0,
				minimapCanvasOuterHeight: 900,
			},

			viewportColumn: 169,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,

			overviewRuler: {
				top: 0,
				width: 0,
				height: 900,
				right: 0
			}
		});
	});

	test('EditorLayoutProvider 9 - render minimap', () => {
		doTest({
			outerWidth: 1000,
			outerHeight: 800,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: false,
			lineNumbersMinChars: 0,
			lineNumbersDigitCount: 1,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 10,
			maxDigitWidth: 10,
			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,
			scrollbarArrowSize: 0,
			verticalScrollbarHasArrows: false,
			minimap: true,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			pixelRatio: 1,
		}, {
			width: 1000,
			height: 800,

			glyphMarginLeft: 0,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 0,
			lineNumbersWidth: 0,

			decorationsLeft: 0,
			decorationsWidth: 10,

			contentLeft: 10,
			contentWidth: 893,

			minimap: {
				renderMinimap: RenderMinimap.Text,
				minimapLeft: 903,
				minimapWidth: 97,
				minimapHeightIsEditorHeight: false,
				minimapIsSampling: false,
				minimapScale: 1,
				minimapLineHeight: 2,
				minimapCanvasInnerWidth: 97,
				minimapCanvasInnerHeight: 800,
				minimapCanvasOuterWidth: 97,
				minimapCanvasOuterHeight: 800,
			},

			viewportColumn: 89,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,

			overviewRuler: {
				top: 0,
				width: 0,
				height: 800,
				right: 0
			}
		});
	});

	test('EditorLayoutProvider 9 - render minimap with pixelRatio = 2', () => {
		doTest({
			outerWidth: 1000,
			outerHeight: 800,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: false,
			lineNumbersMinChars: 0,
			lineNumbersDigitCount: 1,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 10,
			maxDigitWidth: 10,
			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,
			scrollbarArrowSize: 0,
			verticalScrollbarHasArrows: false,
			minimap: true,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			pixelRatio: 2,
		}, {
			width: 1000,
			height: 800,

			glyphMarginLeft: 0,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 0,
			lineNumbersWidth: 0,

			decorationsLeft: 0,
			decorationsWidth: 10,

			contentLeft: 10,
			contentWidth: 893,

			minimap: {
				renderMinimap: RenderMinimap.Text,
				minimapLeft: 903,
				minimapWidth: 97,
				minimapHeightIsEditorHeight: false,
				minimapIsSampling: false,
				minimapScale: 2,
				minimapLineHeight: 4,
				minimapCanvasInnerWidth: 194,
				minimapCanvasInnerHeight: 1600,
				minimapCanvasOuterWidth: 97,
				minimapCanvasOuterHeight: 800,
			},

			viewportColumn: 89,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,

			overviewRuler: {
				top: 0,
				width: 0,
				height: 800,
				right: 0
			}
		});
	});

	test('EditorLayoutProvider 9 - render minimap with pixelRatio = 4', () => {
		doTest({
			outerWidth: 1000,
			outerHeight: 800,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: false,
			lineNumbersMinChars: 0,
			lineNumbersDigitCount: 1,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 10,
			maxDigitWidth: 10,
			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,
			scrollbarArrowSize: 0,
			verticalScrollbarHasArrows: false,
			minimap: true,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			pixelRatio: 4,
		}, {
			width: 1000,
			height: 800,

			glyphMarginLeft: 0,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 0,
			lineNumbersWidth: 0,

			decorationsLeft: 0,
			decorationsWidth: 10,

			contentLeft: 10,
			contentWidth: 935,

			minimap: {
				renderMinimap: RenderMinimap.Text,
				minimapLeft: 945,
				minimapWidth: 55,
				minimapHeightIsEditorHeight: false,
				minimapIsSampling: false,
				minimapScale: 2,
				minimapLineHeight: 4,
				minimapCanvasInnerWidth: 220,
				minimapCanvasInnerHeight: 3200,
				minimapCanvasOuterWidth: 55,
				minimapCanvasOuterHeight: 800,
			},

			viewportColumn: 93,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,

			overviewRuler: {
				top: 0,
				width: 0,
				height: 800,
				right: 0
			}
		});
	});

	test('EditorLayoutProvider 10 - render minimap to left', () => {
		doTest({
			outerWidth: 1000,
			outerHeight: 800,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: false,
			lineNumbersMinChars: 0,
			lineNumbersDigitCount: 1,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 10,
			maxDigitWidth: 10,
			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,
			scrollbarArrowSize: 0,
			verticalScrollbarHasArrows: false,
			minimap: true,
			minimapSide: 'left',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			pixelRatio: 4,
		}, {
			width: 1000,
			height: 800,

			glyphMarginLeft: 55,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 55,
			lineNumbersWidth: 0,

			decorationsLeft: 55,
			decorationsWidth: 10,

			contentLeft: 65,
			contentWidth: 935,

			minimap: {
				renderMinimap: RenderMinimap.Text,
				minimapLeft: 0,
				minimapWidth: 55,
				minimapHeightIsEditorHeight: false,
				minimapIsSampling: false,
				minimapScale: 2,
				minimapLineHeight: 4,
				minimapCanvasInnerWidth: 220,
				minimapCanvasInnerHeight: 3200,
				minimapCanvasOuterWidth: 55,
				minimapCanvasOuterHeight: 800,
			},

			viewportColumn: 93,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,

			overviewRuler: {
				top: 0,
				width: 0,
				height: 800,
				right: 0
			}
		});
	});

	test('EditorLayoutProvider 11 - minimap mode cover without sampling', () => {
		doTest({
			outerWidth: 1000,
			outerHeight: 800,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: false,
			lineNumbersMinChars: 0,
			lineNumbersDigitCount: 3,
			maxLineNumber: 120,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 10,
			maxDigitWidth: 10,
			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,
			scrollbarArrowSize: 0,
			verticalScrollbarHasArrows: false,
			minimap: true,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			minimapSize: 'fill',
			pixelRatio: 2,
		}, {
			width: 1000,
			height: 800,

			glyphMarginLeft: 0,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 0,
			lineNumbersWidth: 0,

			decorationsLeft: 0,
			decorationsWidth: 10,

			contentLeft: 10,
			contentWidth: 893,

			minimap: {
				renderMinimap: RenderMinimap.Text,
				minimapLeft: 903,
				minimapWidth: 97,
				minimapHeightIsEditorHeight: true,
				minimapIsSampling: false,
				minimapScale: 3,
				minimapLineHeight: 13,
				minimapCanvasInnerWidth: 291,
				minimapCanvasInnerHeight: 1560,
				minimapCanvasOuterWidth: 97,
				minimapCanvasOuterHeight: 800,
			},

			viewportColumn: 89,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,

			overviewRuler: {
				top: 0,
				width: 0,
				height: 800,
				right: 0
			}
		});
	});

	test('EditorLayoutProvider 12 - minimap mode cover with sampling', () => {
		doTest({
			outerWidth: 1000,
			outerHeight: 800,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: false,
			lineNumbersMinChars: 0,
			lineNumbersDigitCount: 4,
			maxLineNumber: 2500,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 10,
			maxDigitWidth: 10,
			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,
			scrollbarArrowSize: 0,
			verticalScrollbarHasArrows: false,
			minimap: true,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			minimapSize: 'fill',
			pixelRatio: 2,
		}, {
			width: 1000,
			height: 800,

			glyphMarginLeft: 0,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 0,
			lineNumbersWidth: 0,

			decorationsLeft: 0,
			decorationsWidth: 10,

			contentLeft: 10,
			contentWidth: 935,

			minimap: {
				renderMinimap: RenderMinimap.Text,
				minimapLeft: 945,
				minimapWidth: 55,
				minimapHeightIsEditorHeight: true,
				minimapIsSampling: true,
				minimapScale: 1,
				minimapLineHeight: 1,
				minimapCanvasInnerWidth: 110,
				minimapCanvasInnerHeight: 1600,
				minimapCanvasOuterWidth: 55,
				minimapCanvasOuterHeight: 800,
			},

			viewportColumn: 93,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,

			overviewRuler: {
				top: 0,
				width: 0,
				height: 800,
				right: 0
			}
		});
	});

	test('EditorLayoutProvider 13 - minimap mode contain without sampling', () => {
		doTest({
			outerWidth: 1000,
			outerHeight: 800,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: false,
			lineNumbersMinChars: 0,
			lineNumbersDigitCount: 3,
			maxLineNumber: 120,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 10,
			maxDigitWidth: 10,
			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,
			scrollbarArrowSize: 0,
			verticalScrollbarHasArrows: false,
			minimap: true,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			minimapSize: 'fit',
			pixelRatio: 2,
		}, {
			width: 1000,
			height: 800,

			glyphMarginLeft: 0,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 0,
			lineNumbersWidth: 0,

			decorationsLeft: 0,
			decorationsWidth: 10,

			contentLeft: 10,
			contentWidth: 893,

			minimap: {
				renderMinimap: RenderMinimap.Text,
				minimapLeft: 903,
				minimapWidth: 97,
				minimapHeightIsEditorHeight: false,
				minimapIsSampling: false,
				minimapScale: 2,
				minimapLineHeight: 4,
				minimapCanvasInnerWidth: 194,
				minimapCanvasInnerHeight: 1600,
				minimapCanvasOuterWidth: 97,
				minimapCanvasOuterHeight: 800,
			},

			viewportColumn: 89,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,

			overviewRuler: {
				top: 0,
				width: 0,
				height: 800,
				right: 0
			}
		});
	});

	test('EditorLayoutProvider 14 - minimap mode contain with sampling', () => {
		doTest({
			outerWidth: 1000,
			outerHeight: 800,
			showGlyphMargin: false,
			lineHeight: 16,
			showLineNumbers: false,
			lineNumbersMinChars: 0,
			lineNumbersDigitCount: 4,
			maxLineNumber: 2500,
			lineDecorationsWidth: 10,
			typicalHalfwidthCharacterWidth: 10,
			maxDigitWidth: 10,
			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,
			scrollbarArrowSize: 0,
			verticalScrollbarHasArrows: false,
			minimap: true,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 150,
			minimapSize: 'fit',
			pixelRatio: 2,
		}, {
			width: 1000,
			height: 800,

			glyphMarginLeft: 0,
			glyphMarginWidth: 0,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 0,
			lineNumbersWidth: 0,

			decorationsLeft: 0,
			decorationsWidth: 10,

			contentLeft: 10,
			contentWidth: 935,

			minimap: {
				renderMinimap: RenderMinimap.Text,
				minimapLeft: 945,
				minimapWidth: 55,
				minimapHeightIsEditorHeight: true,
				minimapIsSampling: true,
				minimapScale: 1,
				minimapLineHeight: 1,
				minimapCanvasInnerWidth: 110,
				minimapCanvasInnerHeight: 1600,
				minimapCanvasOuterWidth: 55,
				minimapCanvasOuterHeight: 800,
			},

			viewportColumn: 93,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 0,
			horizontalScrollbarHeight: 0,

			overviewRuler: {
				top: 0,
				width: 0,
				height: 800,
				right: 0
			}
		});
	});

	test('issue #31312: When wrapping, leave 2px for the cursor', () => {
		doTest({
			outerWidth: 1201,
			outerHeight: 422,
			showGlyphMargin: true,
			lineHeight: 30,
			showLineNumbers: true,
			lineNumbersMinChars: 3,
			lineNumbersDigitCount: 1,
			lineDecorationsWidth: 26,
			typicalHalfwidthCharacterWidth: 12.04296875,
			maxDigitWidth: 12.04296875,
			verticalScrollbarWidth: 14,
			horizontalScrollbarHeight: 10,
			scrollbarArrowSize: 11,
			verticalScrollbarHasArrows: false,
			minimap: true,
			minimapSide: 'right',
			minimapRenderCharacters: true,
			minimapMaxColumn: 120,
			pixelRatio: 2
		}, {
			width: 1201,
			height: 422,

			glyphMarginLeft: 0,
			glyphMarginWidth: 30,
			glyphMarginDecorationLaneCount: 1,

			lineNumbersLeft: 30,
			lineNumbersWidth: 36,

			decorationsLeft: 66,
			decorationsWidth: 26,

			contentLeft: 92,
			contentWidth: 1018,

			minimap: {
				renderMinimap: RenderMinimap.Text,
				minimapLeft: 1096,
				minimapWidth: 91,
				minimapHeightIsEditorHeight: false,
				minimapIsSampling: false,
				minimapScale: 2,
				minimapLineHeight: 4,
				minimapCanvasInnerWidth: 182,
				minimapCanvasInnerHeight: 844,
				minimapCanvasOuterWidth: 91,
				minimapCanvasOuterHeight: 422,
			},

			viewportColumn: 83,
			isWordWrapMinified: false,
			isViewportWrapping: false,
			wrappingColumn: -1,

			verticalScrollbarWidth: 14,
			horizontalScrollbarHeight: 10,

			overviewRuler: {
				top: 0,
				width: 14,
				height: 422,
				right: 0
			}
		});

	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/config/testConfiguration.ts]---
Location: vscode-main/src/vs/editor/test/browser/config/testConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditorConfiguration, IEnvConfiguration } from '../../../browser/config/editorConfiguration.js';
import { EditorFontLigatures, EditorFontVariations } from '../../../common/config/editorOptions.js';
import { BareFontInfo, FontInfo } from '../../../common/config/fontInfo.js';
import { TestCodeEditorCreationOptions } from '../testCodeEditor.js';
import { AccessibilitySupport } from '../../../../platform/accessibility/common/accessibility.js';
import { TestAccessibilityService } from '../../../../platform/accessibility/test/common/testAccessibilityService.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';

export class TestConfiguration extends EditorConfiguration {

	constructor(opts: Readonly<TestCodeEditorCreationOptions>) {
		super(false, MenuId.EditorContext, opts, null, new TestAccessibilityService());
	}

	protected override _readEnvConfiguration(): IEnvConfiguration {
		const envConfig = (this.getRawOptions() as TestCodeEditorCreationOptions).envConfig;
		return {
			extraEditorClassName: envConfig?.extraEditorClassName ?? '',
			outerWidth: envConfig?.outerWidth ?? 100,
			outerHeight: envConfig?.outerHeight ?? 100,
			emptySelectionClipboard: envConfig?.emptySelectionClipboard ?? true,
			pixelRatio: envConfig?.pixelRatio ?? 1,
			accessibilitySupport: envConfig?.accessibilitySupport ?? AccessibilitySupport.Unknown,
			editContextSupported: true
		};
	}

	protected override _readFontInfo(styling: BareFontInfo): FontInfo {
		return new FontInfo({
			pixelRatio: 1,
			fontFamily: 'mockFont',
			fontWeight: 'normal',
			fontSize: 14,
			fontFeatureSettings: EditorFontLigatures.OFF,
			fontVariationSettings: EditorFontVariations.OFF,
			lineHeight: 19,
			letterSpacing: 1.5,
			isMonospace: true,
			typicalHalfwidthCharacterWidth: 10,
			typicalFullwidthCharacterWidth: 20,
			canUseHalfwidthRightwardsArrow: true,
			spaceWidth: 10,
			middotWidth: 10,
			wsmiddotWidth: 10,
			maxDigitWidth: 10,
		}, true);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/controller/cursor.integrationTest.ts]---
Location: vscode-main/src/vs/editor/test/browser/controller/cursor.integrationTest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Selection } from '../../../common/core/selection.js';
import { withTestCodeEditor } from '../testCodeEditor.js';

suite('Editor Controller', () => {

	test('issue #23913: Greater than 1000+ multi cursor typing replacement text appears inverted, lines begin to drop off selection', function () {
		this.timeout(10000);
		const LINE_CNT = 2000;

		const text: string[] = [];
		for (let i = 0; i < LINE_CNT; i++) {
			text[i] = 'asd';
		}

		withTestCodeEditor(text, {}, (editor, viewModel) => {
			const model = editor.getModel();

			const selections: Selection[] = [];
			for (let i = 0; i < LINE_CNT; i++) {
				selections[i] = new Selection(i + 1, 1, i + 1, 1);
			}
			viewModel.setSelections('test', selections);

			viewModel.type('n', 'keyboard');
			viewModel.type('n', 'keyboard');

			for (let i = 0; i < LINE_CNT; i++) {
				assert.strictEqual(model.getLineContent(i + 1), 'nnasd', 'line #' + (i + 1));
			}

			assert.strictEqual(viewModel.getSelections().length, LINE_CNT);
			assert.strictEqual(viewModel.getSelections()[LINE_CNT - 1].startLineNumber, LINE_CNT);
		});
	});
});
```

--------------------------------------------------------------------------------

````
