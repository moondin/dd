---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 245
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 245 of 552)

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

---[FILE: src/vs/editor/test/browser/controller/cursorMoveCommand.test.ts]---
Location: vscode-main/src/vs/editor/test/browser/controller/cursorMoveCommand.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { CoreNavigationCommands } from '../../../browser/coreCommands.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { CursorMove } from '../../../common/cursor/cursorMoveCommands.js';
import { ViewModel } from '../../../common/viewModel/viewModelImpl.js';
import { ITestCodeEditor, withTestCodeEditor } from '../testCodeEditor.js';

suite('Cursor move command test', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const TEXT = [
		'    \tMy First Line\t ',
		'\tMy Second Line',
		'    Third Line🐶',
		'',
		'1'
	].join('\n');

	function executeTest(callback: (editor: ITestCodeEditor, viewModel: ViewModel) => void): void {
		withTestCodeEditor(TEXT, {}, (editor, viewModel) => {
			callback(editor, viewModel);
		});
	}

	test('move left should move to left character', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 8);
			moveLeft(viewModel);
			cursorEqual(viewModel, 1, 7);
		});
	});

	test('move left should move to left by n characters', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 8);
			moveLeft(viewModel, 3);
			cursorEqual(viewModel, 1, 5);
		});
	});

	test('move left should move to left by half line', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 8);
			moveLeft(viewModel, 1, CursorMove.RawUnit.HalfLine);
			cursorEqual(viewModel, 1, 1);
		});
	});

	test('move left moves to previous line', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 2, 3);
			moveLeft(viewModel, 10);
			cursorEqual(viewModel, 1, 21);
		});
	});

	test('move right should move to right character', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 5);
			moveRight(viewModel);
			cursorEqual(viewModel, 1, 6);
		});
	});

	test('move right should move to right by n characters', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 2);
			moveRight(viewModel, 6);
			cursorEqual(viewModel, 1, 8);
		});
	});

	test('move right should move to right by half line', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 4);
			moveRight(viewModel, 1, CursorMove.RawUnit.HalfLine);
			cursorEqual(viewModel, 1, 14);
		});
	});

	test('move right moves to next line', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 8);
			moveRight(viewModel, 100);
			cursorEqual(viewModel, 2, 1);
		});
	});

	test('move to first character of line from middle', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 8);
			moveToLineStart(viewModel);
			cursorEqual(viewModel, 1, 1);
		});
	});

	test('move to first character of line from first non white space character', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 6);
			moveToLineStart(viewModel);
			cursorEqual(viewModel, 1, 1);
		});
	});

	test('move to first character of line from first character', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 1);
			moveToLineStart(viewModel);
			cursorEqual(viewModel, 1, 1);
		});
	});

	test('move to first non white space character of line from middle', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 8);
			moveToLineFirstNonWhitespaceCharacter(viewModel);
			cursorEqual(viewModel, 1, 6);
		});
	});

	test('move to first non white space character of line from first non white space character', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 6);
			moveToLineFirstNonWhitespaceCharacter(viewModel);
			cursorEqual(viewModel, 1, 6);
		});
	});

	test('move to first non white space character of line from first character', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 1);
			moveToLineFirstNonWhitespaceCharacter(viewModel);
			cursorEqual(viewModel, 1, 6);
		});
	});

	test('move to end of line from middle', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 8);
			moveToLineEnd(viewModel);
			cursorEqual(viewModel, 1, 21);
		});
	});

	test('move to end of line from last non white space character', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 19);
			moveToLineEnd(viewModel);
			cursorEqual(viewModel, 1, 21);
		});
	});

	test('move to end of line from line end', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 21);
			moveToLineEnd(viewModel);
			cursorEqual(viewModel, 1, 21);
		});
	});

	test('move to last non white space character from middle', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 8);
			moveToLineLastNonWhitespaceCharacter(viewModel);
			cursorEqual(viewModel, 1, 19);
		});
	});

	test('move to last non white space character from last non white space character', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 19);
			moveToLineLastNonWhitespaceCharacter(viewModel);
			cursorEqual(viewModel, 1, 19);
		});
	});

	test('move to last non white space character from line end', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 21);
			moveToLineLastNonWhitespaceCharacter(viewModel);
			cursorEqual(viewModel, 1, 19);
		});
	});

	test('move to center of line not from center', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 8);
			moveToLineCenter(viewModel);
			cursorEqual(viewModel, 1, 11);
		});
	});

	test('move to center of line from center', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 11);
			moveToLineCenter(viewModel);
			cursorEqual(viewModel, 1, 11);
		});
	});

	test('move to center of line from start', () => {
		executeTest((editor, viewModel) => {
			moveToLineStart(viewModel);
			moveToLineCenter(viewModel);
			cursorEqual(viewModel, 1, 11);
		});
	});

	test('move to center of line from end', () => {
		executeTest((editor, viewModel) => {
			moveToLineEnd(viewModel);
			moveToLineCenter(viewModel);
			cursorEqual(viewModel, 1, 11);
		});
	});

	test('move up by cursor move command', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 3, 5);
			cursorEqual(viewModel, 3, 5);

			moveUp(viewModel, 2);
			cursorEqual(viewModel, 1, 5);

			moveUp(viewModel, 1);
			cursorEqual(viewModel, 1, 1);
		});
	});

	test('move up by model line cursor move command', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 3, 5);
			cursorEqual(viewModel, 3, 5);

			moveUpByModelLine(viewModel, 2);
			cursorEqual(viewModel, 1, 5);

			moveUpByModelLine(viewModel, 1);
			cursorEqual(viewModel, 1, 1);
		});
	});

	test('move down by model line cursor move command', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 3, 5);
			cursorEqual(viewModel, 3, 5);

			moveDownByModelLine(viewModel, 2);
			cursorEqual(viewModel, 5, 2);

			moveDownByModelLine(viewModel, 1);
			cursorEqual(viewModel, 5, 2);
		});
	});

	test('move up with selection by cursor move command', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 3, 5);
			cursorEqual(viewModel, 3, 5);

			moveUp(viewModel, 1, true);
			cursorEqual(viewModel, 2, 2, 3, 5);

			moveUp(viewModel, 1, true);
			cursorEqual(viewModel, 1, 5, 3, 5);
		});
	});

	test('move up and down with tabs by cursor move command', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 1, 5);
			cursorEqual(viewModel, 1, 5);

			moveDown(viewModel, 4);
			cursorEqual(viewModel, 5, 2);

			moveUp(viewModel, 1);
			cursorEqual(viewModel, 4, 1);

			moveUp(viewModel, 1);
			cursorEqual(viewModel, 3, 5);

			moveUp(viewModel, 1);
			cursorEqual(viewModel, 2, 2);

			moveUp(viewModel, 1);
			cursorEqual(viewModel, 1, 5);
		});
	});

	test('move up and down with end of lines starting from a long one by cursor move command', () => {
		executeTest((editor, viewModel) => {
			moveToEndOfLine(viewModel);
			cursorEqual(viewModel, 1, 21);

			moveToEndOfLine(viewModel);
			cursorEqual(viewModel, 1, 21);

			moveDown(viewModel, 2);
			cursorEqual(viewModel, 3, 17);

			moveDown(viewModel, 1);
			cursorEqual(viewModel, 4, 1);

			moveDown(viewModel, 1);
			cursorEqual(viewModel, 5, 2);

			moveUp(viewModel, 4);
			cursorEqual(viewModel, 1, 21);
		});
	});

	test('move to view top line moves to first visible line if it is first line', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(1, 1, 10, 1);

			moveTo(viewModel, 2, 2);
			moveToTop(viewModel);

			cursorEqual(viewModel, 1, 6);
		});
	});

	test('move to view top line moves to top visible line when first line is not visible', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(2, 1, 10, 1);

			moveTo(viewModel, 4, 1);
			moveToTop(viewModel);

			cursorEqual(viewModel, 2, 2);
		});
	});

	test('move to view top line moves to nth line from top', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(1, 1, 10, 1);

			moveTo(viewModel, 4, 1);
			moveToTop(viewModel, 3);

			cursorEqual(viewModel, 3, 5);
		});
	});

	test('move to view top line moves to last line if n is greater than last visible line number', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(1, 1, 3, 1);

			moveTo(viewModel, 2, 2);
			moveToTop(viewModel, 4);

			cursorEqual(viewModel, 3, 5);
		});
	});

	test('move to view center line moves to the center line', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(3, 1, 3, 1);

			moveTo(viewModel, 2, 2);
			moveToCenter(viewModel);

			cursorEqual(viewModel, 3, 5);
		});
	});

	test('move to view bottom line moves to last visible line if it is last line', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(1, 1, 5, 1);

			moveTo(viewModel, 2, 2);
			moveToBottom(viewModel);

			cursorEqual(viewModel, 5, 1);
		});
	});

	test('move to view bottom line moves to last visible line when last line is not visible', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(2, 1, 3, 1);

			moveTo(viewModel, 2, 2);
			moveToBottom(viewModel);

			cursorEqual(viewModel, 3, 5);
		});
	});

	test('move to view bottom line moves to nth line from bottom', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(1, 1, 5, 1);

			moveTo(viewModel, 4, 1);
			moveToBottom(viewModel, 3);

			cursorEqual(viewModel, 3, 5);
		});
	});

	test('move to view bottom line moves to first line if n is lesser than first visible line number', () => {
		executeTest((editor, viewModel) => {
			viewModel.getCompletelyVisibleViewRange = () => new Range(2, 1, 5, 1);

			moveTo(viewModel, 4, 1);
			moveToBottom(viewModel, 5);

			cursorEqual(viewModel, 2, 2);
		});
	});
});

suite('Cursor move by blankline test', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const TEXT = [
		'    \tMy First Line\t ',
		'\tMy Second Line',
		'    Third Line🐶',
		'',
		'1',
		'2',
		'3',
		'',
		'         ',
		'a',
		'b',
	].join('\n');

	function executeTest(callback: (editor: ITestCodeEditor, viewModel: ViewModel) => void): void {
		withTestCodeEditor(TEXT, {}, (editor, viewModel) => {
			callback(editor, viewModel);
		});
	}

	test('move down should move to start of next blank line', () => {
		executeTest((editor, viewModel) => {
			moveDownByBlankLine(viewModel, false);
			cursorEqual(viewModel, 4, 1);
		});
	});

	test('move up should move to start of previous blank line', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 7, 1);
			moveUpByBlankLine(viewModel, false);
			cursorEqual(viewModel, 4, 1);
		});
	});

	test('move down should skip over whitespace if already on blank line', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 8, 1);
			moveDownByBlankLine(viewModel, false);
			cursorEqual(viewModel, 11, 1);
		});
	});

	test('move up should skip over whitespace if already on blank line', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 9, 1);
			moveUpByBlankLine(viewModel, false);
			cursorEqual(viewModel, 4, 1);
		});
	});

	test('move up should go to first column of first line if not empty', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 2, 1);
			moveUpByBlankLine(viewModel, false);
			cursorEqual(viewModel, 1, 1);
		});
	});

	test('move down should go to first column of last line if not empty', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 10, 1);
			moveDownByBlankLine(viewModel, false);
			cursorEqual(viewModel, 11, 1);
		});
	});

	test('select down should select to start of next blank line', () => {
		executeTest((editor, viewModel) => {
			moveDownByBlankLine(viewModel, true);
			selectionEqual(viewModel.getSelection(), 4, 1, 1, 1);
		});
	});

	test('select up should select to start of previous blank line', () => {
		executeTest((editor, viewModel) => {
			moveTo(viewModel, 7, 1);
			moveUpByBlankLine(viewModel, true);
			selectionEqual(viewModel.getSelection(), 4, 1, 7, 1);
		});
	});
});

// Move command

function move(viewModel: ViewModel, args: any) {
	CoreNavigationCommands.CursorMove.runCoreEditorCommand(viewModel, args);
}

function moveToLineStart(viewModel: ViewModel) {
	move(viewModel, { to: CursorMove.RawDirection.WrappedLineStart });
}

function moveToLineFirstNonWhitespaceCharacter(viewModel: ViewModel) {
	move(viewModel, { to: CursorMove.RawDirection.WrappedLineFirstNonWhitespaceCharacter });
}

function moveToLineCenter(viewModel: ViewModel) {
	move(viewModel, { to: CursorMove.RawDirection.WrappedLineColumnCenter });
}

function moveToLineEnd(viewModel: ViewModel) {
	move(viewModel, { to: CursorMove.RawDirection.WrappedLineEnd });
}

function moveToLineLastNonWhitespaceCharacter(viewModel: ViewModel) {
	move(viewModel, { to: CursorMove.RawDirection.WrappedLineLastNonWhitespaceCharacter });
}

function moveLeft(viewModel: ViewModel, value?: number, by?: string, select?: boolean) {
	move(viewModel, { to: CursorMove.RawDirection.Left, by: by, value: value, select: select });
}

function moveRight(viewModel: ViewModel, value?: number, by?: string, select?: boolean) {
	move(viewModel, { to: CursorMove.RawDirection.Right, by: by, value: value, select: select });
}

function moveUp(viewModel: ViewModel, noOfLines: number = 1, select?: boolean) {
	move(viewModel, { to: CursorMove.RawDirection.Up, by: CursorMove.RawUnit.WrappedLine, value: noOfLines, select: select });
}

function moveUpByBlankLine(viewModel: ViewModel, select?: boolean) {
	move(viewModel, { to: CursorMove.RawDirection.PrevBlankLine, by: CursorMove.RawUnit.WrappedLine, select: select });
}

function moveUpByModelLine(viewModel: ViewModel, noOfLines: number = 1, select?: boolean) {
	move(viewModel, { to: CursorMove.RawDirection.Up, value: noOfLines, select: select });
}

function moveDown(viewModel: ViewModel, noOfLines: number = 1, select?: boolean) {
	move(viewModel, { to: CursorMove.RawDirection.Down, by: CursorMove.RawUnit.WrappedLine, value: noOfLines, select: select });
}

function moveDownByBlankLine(viewModel: ViewModel, select?: boolean) {
	move(viewModel, { to: CursorMove.RawDirection.NextBlankLine, by: CursorMove.RawUnit.WrappedLine, select: select });
}

function moveDownByModelLine(viewModel: ViewModel, noOfLines: number = 1, select?: boolean) {
	move(viewModel, { to: CursorMove.RawDirection.Down, value: noOfLines, select: select });
}

function moveToTop(viewModel: ViewModel, noOfLines: number = 1, select?: boolean) {
	move(viewModel, { to: CursorMove.RawDirection.ViewPortTop, value: noOfLines, select: select });
}

function moveToCenter(viewModel: ViewModel, select?: boolean) {
	move(viewModel, { to: CursorMove.RawDirection.ViewPortCenter, select: select });
}

function moveToBottom(viewModel: ViewModel, noOfLines: number = 1, select?: boolean) {
	move(viewModel, { to: CursorMove.RawDirection.ViewPortBottom, value: noOfLines, select: select });
}

function cursorEqual(viewModel: ViewModel, posLineNumber: number, posColumn: number, selLineNumber: number = posLineNumber, selColumn: number = posColumn) {
	positionEqual(viewModel.getPosition(), posLineNumber, posColumn);
	selectionEqual(viewModel.getSelection(), posLineNumber, posColumn, selLineNumber, selColumn);
}

function positionEqual(position: Position, lineNumber: number, column: number) {
	assert.deepStrictEqual(position, new Position(lineNumber, column), 'position equal');
}

function selectionEqual(selection: Selection, posLineNumber: number, posColumn: number, selLineNumber: number, selColumn: number) {
	assert.deepStrictEqual({
		selectionStartLineNumber: selection.selectionStartLineNumber,
		selectionStartColumn: selection.selectionStartColumn,
		positionLineNumber: selection.positionLineNumber,
		positionColumn: selection.positionColumn
	}, {
		selectionStartLineNumber: selLineNumber,
		selectionStartColumn: selColumn,
		positionLineNumber: posLineNumber,
		positionColumn: posColumn
	}, 'selection equal');
}

function moveTo(viewModel: ViewModel, lineNumber: number, column: number, inSelectionMode: boolean = false) {
	if (inSelectionMode) {
		CoreNavigationCommands.MoveToSelect.runCoreEditorCommand(viewModel, {
			position: new Position(lineNumber, column)
		});
	} else {
		CoreNavigationCommands.MoveTo.runCoreEditorCommand(viewModel, {
			position: new Position(lineNumber, column)
		});
	}
}

function moveToEndOfLine(viewModel: ViewModel, inSelectionMode: boolean = false) {
	if (inSelectionMode) {
		CoreNavigationCommands.CursorEndSelect.runCoreEditorCommand(viewModel, {});
	} else {
		CoreNavigationCommands.CursorEnd.runCoreEditorCommand(viewModel, {});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/controller/imeRecordedTypes.ts]---
Location: vscode-main/src/vs/editor/test/browser/controller/imeRecordedTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { OperatingSystem } from '../../../../base/common/platform.js';
import { IBrowser } from '../../../browser/controller/editContext/textArea/textAreaEditContextInput.js';

export interface IRecordedTextareaState {
	selectionDirection: 'forward' | 'backward' | 'none';
	selectionEnd: number;
	selectionStart: number;
	value: string;
}

export interface IRecordedKeyboardEvent {
	timeStamp: number;
	state: IRecordedTextareaState;
	type: 'keydown' | 'keypress' | 'keyup';
	altKey: boolean;
	charCode: number;
	code: string;
	ctrlKey: boolean;
	isComposing: boolean;
	key: string;
	keyCode: number;
	location: number;
	metaKey: boolean;
	repeat: boolean;
	shiftKey: boolean;
}

export interface IRecordedCompositionEvent {
	timeStamp: number;
	state: IRecordedTextareaState;
	type: 'compositionstart' | 'compositionupdate' | 'compositionend';
	data: string;
}

export interface IRecordedInputEvent {
	timeStamp: number;
	state: IRecordedTextareaState;
	type: 'beforeinput' | 'input';
	data: string | null;
	inputType: string;
	isComposing: boolean | undefined;
}

export type IRecordedEvent = IRecordedKeyboardEvent | IRecordedCompositionEvent | IRecordedInputEvent;

export interface IRecorded {
	env: {
		OS: OperatingSystem;
		browser: IBrowser;
	};
	initial: IRecordedTextareaState;
	events: IRecordedEvent[];
	final: IRecordedTextareaState;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/controller/imeRecorder.html]---
Location: vscode-main/src/vs/editor/test/browser/controller/imeRecorder.html

```html
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<style>
	</style>
</head>
<body>
	<button id="startRecording" type="button">Start Recording</button>
	<button id="endRecording" type="button">End Recording</button>
<script src="../../../../loader.js"></script>
<script>
	require.config({
		baseUrl: '../../../../../../out'
	});

	require(['vs/editor/test/browser/controller/imeRecorder'], function() {
	});
</script>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/controller/imeRecorder.ts]---
Location: vscode-main/src/vs/editor/test/browser/controller/imeRecorder.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { IRecorded, IRecordedCompositionEvent, IRecordedEvent, IRecordedInputEvent, IRecordedKeyboardEvent, IRecordedTextareaState } from './imeRecordedTypes.js';
import * as browser from '../../../../base/browser/browser.js';
import * as platform from '../../../../base/common/platform.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { TextAreaWrapper } from '../../../browser/controller/editContext/textArea/textAreaEditContextInput.js';

(() => {

	// eslint-disable-next-line no-restricted-syntax
	const startButton = <HTMLButtonElement>mainWindow.document.getElementById('startRecording')!;
	// eslint-disable-next-line no-restricted-syntax
	const endButton = <HTMLButtonElement>mainWindow.document.getElementById('endRecording')!;

	let inputarea: HTMLTextAreaElement;
	const disposables = new DisposableStore();
	let originTimeStamp = 0;
	let recorded: IRecorded = {
		env: null!,
		initial: null!,
		events: [],
		final: null!
	};

	const readTextareaState = (): IRecordedTextareaState => {
		return {
			selectionDirection: inputarea.selectionDirection,
			selectionEnd: inputarea.selectionEnd,
			selectionStart: inputarea.selectionStart,
			value: inputarea.value,
		};
	};

	startButton.onclick = () => {
		disposables.clear();
		startTest();
		originTimeStamp = 0;
		recorded = {
			env: {
				OS: platform.OS,
				browser: {
					isAndroid: browser.isAndroid,
					isFirefox: browser.isFirefox,
					isChrome: browser.isChrome,
					isSafari: browser.isSafari
				}
			},
			initial: readTextareaState(),
			events: [],
			final: null!
		};
	};
	endButton.onclick = () => {
		recorded.final = readTextareaState();
		console.log(printRecordedData());
	};

	function printRecordedData() {
		const lines = [];
		lines.push(`const recorded: IRecorded = {`);
		lines.push(`\tenv: ${JSON.stringify(recorded.env)}, `);
		lines.push(`\tinitial: ${printState(recorded.initial)}, `);
		lines.push(`\tevents: [\n\t\t${recorded.events.map(ev => printEvent(ev)).join(',\n\t\t')}\n\t],`);
		lines.push(`\tfinal: ${printState(recorded.final)},`);
		lines.push(`}`);

		return lines.join('\n');

		function printString(str: string) {
			return str.replace(/\\/g, '\\\\').replace(/'/g, '\\\'');
		}
		function printState(state: IRecordedTextareaState) {
			return `{ value: '${printString(state.value)}', selectionStart: ${state.selectionStart}, selectionEnd: ${state.selectionEnd}, selectionDirection: '${state.selectionDirection}' }`;
		}
		function printEvent(ev: IRecordedEvent) {
			if (ev.type === 'keydown' || ev.type === 'keypress' || ev.type === 'keyup') {
				return `{ timeStamp: ${ev.timeStamp.toFixed(2)}, state: ${printState(ev.state)}, type: '${ev.type}', altKey: ${ev.altKey}, charCode: ${ev.charCode}, code: '${ev.code}', ctrlKey: ${ev.ctrlKey}, isComposing: ${ev.isComposing}, key: '${ev.key}', keyCode: ${ev.keyCode}, location: ${ev.location}, metaKey: ${ev.metaKey}, repeat: ${ev.repeat}, shiftKey: ${ev.shiftKey} }`;
			}
			if (ev.type === 'compositionstart' || ev.type === 'compositionupdate' || ev.type === 'compositionend') {
				return `{ timeStamp: ${ev.timeStamp.toFixed(2)}, state: ${printState(ev.state)}, type: '${ev.type}', data: '${printString(ev.data)}' }`;
			}
			if (ev.type === 'beforeinput' || ev.type === 'input') {
				return `{ timeStamp: ${ev.timeStamp.toFixed(2)}, state: ${printState(ev.state)}, type: '${ev.type}', data: ${ev.data === null ? 'null' : `'${printString(ev.data)}'`}, inputType: '${ev.inputType}', isComposing: ${ev.isComposing} }`;
			}
			return JSON.stringify(ev);
		}
	}

	function startTest() {
		inputarea = document.createElement('textarea');
		mainWindow.document.body.appendChild(inputarea);
		inputarea.focus();
		disposables.add(toDisposable(() => {
			inputarea.remove();
		}));
		const wrapper = disposables.add(new TextAreaWrapper(inputarea));

		wrapper.setValue('', `aaaa`);
		wrapper.setSelectionRange('', 2, 2);

		const recordEvent = (e: IRecordedEvent) => {
			recorded.events.push(e);
		};

		const recordKeyboardEvent = (e: KeyboardEvent): void => {
			if (e.type !== 'keydown' && e.type !== 'keypress' && e.type !== 'keyup') {
				throw new Error(`Not supported!`);
			}
			if (originTimeStamp === 0) {
				originTimeStamp = e.timeStamp;
			}
			const ev: IRecordedKeyboardEvent = {
				timeStamp: e.timeStamp - originTimeStamp,
				state: readTextareaState(),
				type: e.type,
				altKey: e.altKey,
				charCode: e.charCode,
				code: e.code,
				ctrlKey: e.ctrlKey,
				isComposing: e.isComposing,
				key: e.key,
				keyCode: e.keyCode,
				location: e.location,
				metaKey: e.metaKey,
				repeat: e.repeat,
				shiftKey: e.shiftKey
			};
			recordEvent(ev);
		};

		const recordCompositionEvent = (e: CompositionEvent): void => {
			if (e.type !== 'compositionstart' && e.type !== 'compositionupdate' && e.type !== 'compositionend') {
				throw new Error(`Not supported!`);
			}
			if (originTimeStamp === 0) {
				originTimeStamp = e.timeStamp;
			}
			const ev: IRecordedCompositionEvent = {
				timeStamp: e.timeStamp - originTimeStamp,
				state: readTextareaState(),
				type: e.type,
				data: e.data,
			};
			recordEvent(ev);
		};

		const recordInputEvent = (e: InputEvent): void => {
			if (e.type !== 'beforeinput' && e.type !== 'input') {
				throw new Error(`Not supported!`);
			}
			if (originTimeStamp === 0) {
				originTimeStamp = e.timeStamp;
			}
			const ev: IRecordedInputEvent = {
				timeStamp: e.timeStamp - originTimeStamp,
				state: readTextareaState(),
				type: e.type,
				data: e.data,
				inputType: e.inputType,
				isComposing: e.isComposing,
			};
			recordEvent(ev);
		};

		wrapper.onKeyDown(recordKeyboardEvent);
		wrapper.onKeyPress(recordKeyboardEvent);
		wrapper.onKeyUp(recordKeyboardEvent);
		wrapper.onCompositionStart(recordCompositionEvent);
		wrapper.onCompositionUpdate(recordCompositionEvent);
		wrapper.onCompositionEnd(recordCompositionEvent);
		wrapper.onBeforeInput(recordInputEvent);
		wrapper.onInput(recordInputEvent);
	}

})();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/controller/imeTester.html]---
Location: vscode-main/src/vs/editor/test/browser/controller/imeTester.html

```html
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<style>
		.container {
			border-top: 1px solid #ccc;
			padding-top: 5px;
			clear: both;
			margin-top: 30px;
		}
		.container .title {
			margin-bottom: 10px;
		}
		.container button {
			float: left;
		}
		.container textarea {
			float: left;
			width: 200px;
			height: 100px;
			margin-left: 50px;
		}
		.container .output {
			float: left;
			background: lightblue;
			margin: 0;
			margin-left: 50px;
		}

		.container .check {
			float: left;
			background: grey;
			margin: 0;
			margin-left: 50px;
		}
		.container .check.good {
			background: lightgreen;
		}
	</style>
</head>
<body>
	<h3>Detailed setup steps at https://github.com/microsoft/vscode/wiki/IME-Test</h3>
<script src="../../../../loader.js"></script>
<script>
	require.config({
		baseUrl: '../../../../../../out'
	});

	require(['vs/editor/test/browser/controller/imeTester'], function(imeTester) {
		// console.log('loaded', imeTester);
		// imeTester.createTest();
	});
</script>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/browser/controller/imeTester.ts]---
Location: vscode-main/src/vs/editor/test/browser/controller/imeTester.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Position } from '../../../common/core/position.js';
import { IRange, Range } from '../../../common/core/range.js';
import { EndOfLinePreference } from '../../../common/model.js';
import * as dom from '../../../../base/browser/dom.js';
import * as browser from '../../../../base/browser/browser.js';
import * as platform from '../../../../base/common/platform.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { TestAccessibilityService } from '../../../../platform/accessibility/test/common/testAccessibilityService.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { SimplePagedScreenReaderStrategy } from '../../../browser/controller/editContext/screenReaderUtils.js';
import { ISimpleModel } from '../../../common/viewModel/screenReaderSimpleModel.js';
import { TextAreaState } from '../../../browser/controller/editContext/textArea/textAreaEditContextState.js';
import { ITextAreaInputHost, TextAreaInput, TextAreaWrapper } from '../../../browser/controller/editContext/textArea/textAreaEditContextInput.js';
import { Selection } from '../../../common/core/selection.js';

// To run this test, open imeTester.html

class SingleLineTestModel implements ISimpleModel {

	private _line: string;

	constructor(line: string) {
		this._line = line;
	}

	_setText(text: string) {
		this._line = text;
	}

	getLineContent(lineNumber: number): string {
		return this._line;
	}

	getLineMaxColumn(lineNumber: number): number {
		return this._line.length + 1;
	}

	getValueInRange(range: IRange, eol: EndOfLinePreference): string {
		return this._line.substring(range.startColumn - 1, range.endColumn - 1);
	}

	getValueLengthInRange(range: Range, eol: EndOfLinePreference): number {
		return this.getValueInRange(range, eol).length;
	}

	modifyPosition(position: Position, offset: number): Position {
		const column = Math.min(this.getLineMaxColumn(position.lineNumber), Math.max(1, position.column + offset));
		return new Position(position.lineNumber, column);
	}

	getModelLineContent(lineNumber: number): string {
		return this._line;
	}

	getLineCount(): number {
		return 1;
	}
}

class TestView {

	private readonly _model: SingleLineTestModel;

	constructor(model: SingleLineTestModel) {
		this._model = model;
	}

	public paint(output: HTMLElement) {
		dom.clearNode(output);
		for (let i = 1; i <= this._model.getLineCount(); i++) {
			const textNode = document.createTextNode(this._model.getModelLineContent(i));
			output.appendChild(textNode);
			const br = document.createElement('br');
			output.appendChild(br);
		}
	}
}

function doCreateTest(description: string, inputStr: string, expectedStr: string): HTMLElement {
	let cursorOffset: number = 0;
	let cursorLength: number = 0;

	const container = document.createElement('div');
	container.className = 'container';

	const title = document.createElement('div');
	title.className = 'title';

	const inputStrStrong = document.createElement('strong');
	inputStrStrong.innerText = inputStr;

	title.innerText = description + '. Type ';
	title.appendChild(inputStrStrong);

	container.appendChild(title);

	const startBtn = document.createElement('button');
	startBtn.innerText = 'Start';
	container.appendChild(startBtn);


	const input = document.createElement('textarea');
	input.setAttribute('rows', '10');
	input.setAttribute('cols', '40');
	container.appendChild(input);

	const model = new SingleLineTestModel('some  text');
	const screenReaderStrategy = new SimplePagedScreenReaderStrategy();
	const textAreaInputHost: ITextAreaInputHost = {
		context: null,
		getScreenReaderContent: (): TextAreaState => {
			const selection = new Selection(1, 1 + cursorOffset, 1, 1 + cursorOffset + cursorLength);

			const screenReaderContentState = screenReaderStrategy.fromEditorSelection(model, selection, 10, true);
			return TextAreaState.fromScreenReaderContentState(screenReaderContentState);
		},
		deduceModelPosition: (viewAnchorPosition: Position, deltaOffset: number, lineFeedCnt: number): Position => {
			return null!;
		}
	};

	const handler = new TextAreaInput(textAreaInputHost, new TextAreaWrapper(input), platform.OS, {
		isAndroid: browser.isAndroid,
		isFirefox: browser.isFirefox,
		isChrome: browser.isChrome,
		isSafari: browser.isSafari,
	}, new TestAccessibilityService(), new NullLogService());

	const output = document.createElement('pre');
	output.className = 'output';
	container.appendChild(output);

	const check = document.createElement('pre');
	check.className = 'check';
	container.appendChild(check);

	const br = document.createElement('br');
	br.style.clear = 'both';
	container.appendChild(br);

	const view = new TestView(model);

	const updatePosition = (off: number, len: number) => {
		cursorOffset = off;
		cursorLength = len;
		handler.writeNativeTextAreaContent('selection changed');
		handler.focusTextArea();
	};

	const updateModelAndPosition = (text: string, off: number, len: number) => {
		model._setText(text);
		updatePosition(off, len);
		view.paint(output);

		const expected = 'some ' + expectedStr + ' text';
		if (text === expected) {
			check.innerText = '[GOOD]';
			check.className = 'check good';
		} else {
			check.innerText = '[BAD]';
			check.className = 'check bad';
		}
		check.appendChild(document.createTextNode(expected));
	};

	handler.onType((e) => {
		console.log('type text: ' + e.text + ', replaceCharCnt: ' + e.replacePrevCharCnt);
		const text = model.getModelLineContent(1);
		const preText = text.substring(0, cursorOffset - e.replacePrevCharCnt);
		const postText = text.substring(cursorOffset + cursorLength);
		const midText = e.text;

		updateModelAndPosition(preText + midText + postText, (preText + midText).length, 0);
	});

	view.paint(output);

	startBtn.onclick = function () {
		updateModelAndPosition('some  text', 5, 0);
		input.focus();
	};

	return container;
}

const TESTS = [
	{ description: 'Japanese IME 1', in: 'sennsei [Enter]', out: 'せんせい' },
	{ description: 'Japanese IME 2', in: 'konnichiha [Enter]', out: 'こんいちは' },
	{ description: 'Japanese IME 3', in: 'mikann [Enter]', out: 'みかん' },
	{ description: 'Korean IME 1', in: 'gksrmf [Space]', out: '한글 ' },
	{ description: 'Chinese IME 1', in: '.,', out: '。，' },
	{ description: 'Chinese IME 2', in: 'ni [Space] hao [Space]', out: '你好' },
	{ description: 'Chinese IME 3', in: 'hazni [Space]', out: '哈祝你' },
	{ description: 'Mac dead key 1', in: '`.', out: '`.' },
	{ description: 'Mac hold key 1', in: 'e long press and 1', out: 'é' }
];

TESTS.forEach((t) => {
	mainWindow.document.body.appendChild(doCreateTest(t.description, t.in, t.out));
});
```

--------------------------------------------------------------------------------

````
