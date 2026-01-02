---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 321
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 321 of 552)

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

---[FILE: src/vs/workbench/api/test/browser/extHostDocumentData.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostDocumentData.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { ExtHostDocumentData } from '../../common/extHostDocumentData.js';
import { Position } from '../../common/extHostTypes.js';
import { Range } from '../../../../editor/common/core/range.js';
import { MainThreadDocumentsShape } from '../../common/extHost.protocol.js';
import { IModelChangedEvent } from '../../../../editor/common/model/mirrorTextModel.js';
import { mock } from '../../../../base/test/common/mock.js';
import * as perfData from './extHostDocumentData.test.perf-data.js';
import { setDefaultGetWordAtTextConfig } from '../../../../editor/common/core/wordHelper.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('ExtHostDocumentData', () => {

	let data: ExtHostDocumentData;

	function assertPositionAt(offset: number, line: number, character: number) {
		const position = data.document.positionAt(offset);
		assert.strictEqual(position.line, line);
		assert.strictEqual(position.character, character);
	}

	function assertOffsetAt(line: number, character: number, offset: number) {
		const pos = new Position(line, character);
		const actual = data.document.offsetAt(pos);
		assert.strictEqual(actual, offset);
	}

	setup(function () {
		data = new ExtHostDocumentData(undefined!, URI.file(''), [
			'This is line one', //16
			'and this is line number two', //27
			'it is followed by #3', //20
			'and finished with the fourth.', //29
		], '\n', 1, 'text', false, 'utf8');
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('readonly-ness', () => {
		// eslint-disable-next-line local/code-no-any-casts
		assert.throws(() => (data as any).document.uri = null);
		// eslint-disable-next-line local/code-no-any-casts
		assert.throws(() => (data as any).document.fileName = 'foofile');
		// eslint-disable-next-line local/code-no-any-casts
		assert.throws(() => (data as any).document.isDirty = false);
		// eslint-disable-next-line local/code-no-any-casts
		assert.throws(() => (data as any).document.isUntitled = false);
		// eslint-disable-next-line local/code-no-any-casts
		assert.throws(() => (data as any).document.languageId = 'dddd');
		// eslint-disable-next-line local/code-no-any-casts
		assert.throws(() => (data as any).document.lineCount = 9);
	});

	test('save, when disposed', function () {
		let saved: URI;
		const data = new ExtHostDocumentData(new class extends mock<MainThreadDocumentsShape>() {
			override $trySaveDocument(uri: URI) {
				assert.ok(!saved);
				saved = uri;
				return Promise.resolve(true);
			}
		}, URI.parse('foo:bar'), [], '\n', 1, 'text', true, 'utf8');

		return data.document.save().then(() => {
			assert.strictEqual(saved.toString(), 'foo:bar');

			data.dispose();

			return data.document.save().then(() => {
				assert.ok(false, 'expected failure');
			}, err => {
				assert.ok(err);
			});
		});
	});

	test('read, when disposed', function () {
		data.dispose();

		const { document } = data;
		assert.strictEqual(document.lineCount, 4);
		assert.strictEqual(document.lineAt(0).text, 'This is line one');
	});

	test('lines', () => {

		assert.strictEqual(data.document.lineCount, 4);

		assert.throws(() => data.document.lineAt(-1));
		assert.throws(() => data.document.lineAt(data.document.lineCount));
		assert.throws(() => data.document.lineAt(Number.MAX_VALUE));
		assert.throws(() => data.document.lineAt(Number.MIN_VALUE));
		assert.throws(() => data.document.lineAt(0.8));

		let line = data.document.lineAt(0);
		assert.strictEqual(line.lineNumber, 0);
		assert.strictEqual(line.text.length, 16);
		assert.strictEqual(line.text, 'This is line one');
		assert.strictEqual(line.isEmptyOrWhitespace, false);
		assert.strictEqual(line.firstNonWhitespaceCharacterIndex, 0);

		data.onEvents({
			changes: [{
				range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 },
				rangeOffset: undefined!,
				rangeLength: undefined!,
				text: '\t '
			}],
			eol: undefined!,
			versionId: undefined!,
			isRedoing: false,
			isUndoing: false,
		});

		// line didn't change
		assert.strictEqual(line.text, 'This is line one');
		assert.strictEqual(line.firstNonWhitespaceCharacterIndex, 0);

		// fetch line again
		line = data.document.lineAt(0);
		assert.strictEqual(line.text, '\t This is line one');
		assert.strictEqual(line.firstNonWhitespaceCharacterIndex, 2);
	});

	test('line, issue #5704', function () {

		let line = data.document.lineAt(0);
		let { range, rangeIncludingLineBreak } = line;
		assert.strictEqual(range.end.line, 0);
		assert.strictEqual(range.end.character, 16);
		assert.strictEqual(rangeIncludingLineBreak.end.line, 1);
		assert.strictEqual(rangeIncludingLineBreak.end.character, 0);

		line = data.document.lineAt(data.document.lineCount - 1);
		range = line.range;
		rangeIncludingLineBreak = line.rangeIncludingLineBreak;
		assert.strictEqual(range.end.line, 3);
		assert.strictEqual(range.end.character, 29);
		assert.strictEqual(rangeIncludingLineBreak.end.line, 3);
		assert.strictEqual(rangeIncludingLineBreak.end.character, 29);

	});

	test('offsetAt', () => {
		assertOffsetAt(0, 0, 0);
		assertOffsetAt(0, 1, 1);
		assertOffsetAt(0, 16, 16);
		assertOffsetAt(1, 0, 17);
		assertOffsetAt(1, 3, 20);
		assertOffsetAt(2, 0, 45);
		assertOffsetAt(4, 29, 95);
		assertOffsetAt(4, 30, 95);
		assertOffsetAt(4, Number.MAX_VALUE, 95);
		assertOffsetAt(5, 29, 95);
		assertOffsetAt(Number.MAX_VALUE, 29, 95);
		assertOffsetAt(Number.MAX_VALUE, Number.MAX_VALUE, 95);
	});

	test('offsetAt, after remove', function () {

		data.onEvents({
			changes: [{
				range: { startLineNumber: 1, startColumn: 3, endLineNumber: 1, endColumn: 6 },
				rangeOffset: undefined!,
				rangeLength: undefined!,
				text: ''
			}],
			eol: undefined!,
			versionId: undefined!,
			isRedoing: false,
			isUndoing: false,
		});

		assertOffsetAt(0, 1, 1);
		assertOffsetAt(0, 13, 13);
		assertOffsetAt(1, 0, 14);
	});

	test('offsetAt, after replace', function () {

		data.onEvents({
			changes: [{
				range: { startLineNumber: 1, startColumn: 3, endLineNumber: 1, endColumn: 6 },
				rangeOffset: undefined!,
				rangeLength: undefined!,
				text: 'is could be'
			}],
			eol: undefined!,
			versionId: undefined!,
			isRedoing: false,
			isUndoing: false,
		});

		assertOffsetAt(0, 1, 1);
		assertOffsetAt(0, 24, 24);
		assertOffsetAt(1, 0, 25);
	});

	test('offsetAt, after insert line', function () {

		data.onEvents({
			changes: [{
				range: { startLineNumber: 1, startColumn: 3, endLineNumber: 1, endColumn: 6 },
				rangeOffset: undefined!,
				rangeLength: undefined!,
				text: 'is could be\na line with number'
			}],
			eol: undefined!,
			versionId: undefined!,
			isRedoing: false,
			isUndoing: false,
		});

		assertOffsetAt(0, 1, 1);
		assertOffsetAt(0, 13, 13);
		assertOffsetAt(1, 0, 14);
		assertOffsetAt(1, 18, 13 + 1 + 18);
		assertOffsetAt(1, 29, 13 + 1 + 29);
		assertOffsetAt(2, 0, 13 + 1 + 29 + 1);
	});

	test('offsetAt, after remove line', function () {

		data.onEvents({
			changes: [{
				range: { startLineNumber: 1, startColumn: 3, endLineNumber: 2, endColumn: 6 },
				rangeOffset: undefined!,
				rangeLength: undefined!,
				text: ''
			}],
			eol: undefined!,
			versionId: undefined!,
			isRedoing: false,
			isUndoing: false,
		});

		assertOffsetAt(0, 1, 1);
		assertOffsetAt(0, 2, 2);
		assertOffsetAt(1, 0, 25);
	});

	test('positionAt', () => {
		assertPositionAt(0, 0, 0);
		assertPositionAt(Number.MIN_VALUE, 0, 0);
		assertPositionAt(1, 0, 1);
		assertPositionAt(16, 0, 16);
		assertPositionAt(17, 1, 0);
		assertPositionAt(20, 1, 3);
		assertPositionAt(45, 2, 0);
		assertPositionAt(95, 3, 29);
		assertPositionAt(96, 3, 29);
		assertPositionAt(99, 3, 29);
		assertPositionAt(Number.MAX_VALUE, 3, 29);
	});

	test('getWordRangeAtPosition', () => {
		data = new ExtHostDocumentData(undefined!, URI.file(''), [
			'aaaa bbbb+cccc abc'
		], '\n', 1, 'text', false, 'utf8');

		let range = data.document.getWordRangeAtPosition(new Position(0, 2))!;
		assert.strictEqual(range.start.line, 0);
		assert.strictEqual(range.start.character, 0);
		assert.strictEqual(range.end.line, 0);
		assert.strictEqual(range.end.character, 4);

		// ignore bad regular expresson /.*/
		assert.throws(() => data.document.getWordRangeAtPosition(new Position(0, 2), /.*/)!);

		range = data.document.getWordRangeAtPosition(new Position(0, 5), /[a-z+]+/)!;
		assert.strictEqual(range.start.line, 0);
		assert.strictEqual(range.start.character, 5);
		assert.strictEqual(range.end.line, 0);
		assert.strictEqual(range.end.character, 14);

		range = data.document.getWordRangeAtPosition(new Position(0, 17), /[a-z+]+/)!;
		assert.strictEqual(range.start.line, 0);
		assert.strictEqual(range.start.character, 15);
		assert.strictEqual(range.end.line, 0);
		assert.strictEqual(range.end.character, 18);

		range = data.document.getWordRangeAtPosition(new Position(0, 11), /yy/)!;
		assert.strictEqual(range, undefined);
	});

	test('getWordRangeAtPosition doesn\'t quite use the regex as expected, #29102', function () {
		data = new ExtHostDocumentData(undefined!, URI.file(''), [
			'some text here',
			'/** foo bar */',
			'function() {',
			'	"far boo"',
			'}'
		], '\n', 1, 'text', false, 'utf8');

		let range = data.document.getWordRangeAtPosition(new Position(0, 0), /\/\*.+\*\//);
		assert.strictEqual(range, undefined);

		range = data.document.getWordRangeAtPosition(new Position(1, 0), /\/\*.+\*\//)!;
		assert.strictEqual(range.start.line, 1);
		assert.strictEqual(range.start.character, 0);
		assert.strictEqual(range.end.line, 1);
		assert.strictEqual(range.end.character, 14);

		range = data.document.getWordRangeAtPosition(new Position(3, 0), /("|').*\1/);
		assert.strictEqual(range, undefined);

		range = data.document.getWordRangeAtPosition(new Position(3, 1), /("|').*\1/)!;
		assert.strictEqual(range.start.line, 3);
		assert.strictEqual(range.start.character, 1);
		assert.strictEqual(range.end.line, 3);
		assert.strictEqual(range.end.character, 10);
	});


	test('getWordRangeAtPosition can freeze the extension host #95319', function () {

		const regex = /(https?:\/\/github\.com\/(([^\s]+)\/([^\s]+))\/([^\s]+\/)?(issues|pull)\/([0-9]+))|(([^\s]+)\/([^\s]+))?#([1-9][0-9]*)($|[\s\:\;\-\(\=])/;

		data = new ExtHostDocumentData(undefined!, URI.file(''), [
			perfData._$_$_expensive
		], '\n', 1, 'text', false, 'utf8');

		// this test only ensures that we eventually give and timeout (when searching "funny" words and long lines)
		// for the sake of speedy tests we lower the timeBudget here
		const config = setDefaultGetWordAtTextConfig({ maxLen: 1000, windowSize: 15, timeBudget: 30 });
		try {
			let range = data.document.getWordRangeAtPosition(new Position(0, 1_177_170), regex)!;
			assert.strictEqual(range, undefined);

			const pos = new Position(0, 1177170);
			range = data.document.getWordRangeAtPosition(pos)!;
			assert.ok(range);
			assert.ok(range.contains(pos));
			assert.strictEqual(data.document.getText(range), 'TaskDefinition');

		} finally {
			config.dispose();
		}
	});

	test('Rename popup sometimes populates with text on the left side omitted #96013', function () {

		const regex = /(-?\d*\.\d\w*)|([^\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g;
		const line = 'int abcdefhijklmnopqwvrstxyz;';

		data = new ExtHostDocumentData(undefined!, URI.file(''), [
			line
		], '\n', 1, 'text', false, 'utf8');

		const range = data.document.getWordRangeAtPosition(new Position(0, 27), regex)!;
		assert.strictEqual(range.start.line, 0);
		assert.strictEqual(range.end.line, 0);
		assert.strictEqual(range.start.character, 4);
		assert.strictEqual(range.end.character, 28);
	});

	test('Custom snippet $TM_SELECTED_TEXT not show suggestion #108892', function () {

		data = new ExtHostDocumentData(undefined!, URI.file(''), [
			`        <p><span xml:lang="en">Sheldon</span>, soprannominato "<span xml:lang="en">Shelly</span> dalla madre e dalla sorella, è nato a <span xml:lang="en">Galveston</span>, in <span xml:lang="en">Texas</span>, il 26 febbraio 1980 in un supermercato. È stato un bambino prodigio, come testimoniato dal suo quoziente d'intelligenza (187, di molto superiore alla norma) e dalla sua rapida carriera scolastica: si è diplomato all'eta di 11 anni approdando alla stessa età alla formazione universitaria e all'età di 16 anni ha ottenuto il suo primo dottorato di ricerca. All'inizio della serie e per gran parte di essa vive con il coinquilino Leonard nell'appartamento 4A al 2311 <span xml:lang="en">North Los Robles Avenue</span> di <span xml:lang="en">Pasadena</span>, per poi trasferirsi nell'appartamento di <span xml:lang="en">Penny</span> con <span xml:lang="en">Amy</span> nella decima stagione. Come più volte afferma lui stesso possiede una memoria eidetica e un orecchio assoluto. È stato educato da una madre estremamente religiosa e, in più occasioni, questo aspetto contrasta con il rigore scientifico di <span xml:lang="en">Sheldon</span>; tuttavia la donna sembra essere l'unica persona in grado di comandarlo a bacchetta.</p>`
		], '\n', 1, 'text', false, 'utf8');

		const pos = new Position(0, 55);
		const range = data.document.getWordRangeAtPosition(pos)!;
		assert.strictEqual(range.start.line, 0);
		assert.strictEqual(range.end.line, 0);
		assert.strictEqual(range.start.character, 47);
		assert.strictEqual(range.end.character, 61);
		assert.strictEqual(data.document.getText(range), 'soprannominato');
	});
});

enum AssertDocumentLineMappingDirection {
	OffsetToPosition,
	PositionToOffset
}

suite('ExtHostDocumentData updates line mapping', () => {

	function positionToStr(position: { line: number; character: number }): string {
		return '(' + position.line + ',' + position.character + ')';
	}

	function assertDocumentLineMapping(doc: ExtHostDocumentData, direction: AssertDocumentLineMappingDirection): void {
		const allText = doc.getText();

		let line = 0, character = 0, previousIsCarriageReturn = false;
		for (let offset = 0; offset <= allText.length; offset++) {
			// The position coordinate system cannot express the position between \r and \n
			const position: Position = new Position(line, character + (previousIsCarriageReturn ? -1 : 0));

			if (direction === AssertDocumentLineMappingDirection.OffsetToPosition) {
				const actualPosition = doc.document.positionAt(offset);
				assert.strictEqual(positionToStr(actualPosition), positionToStr(position), 'positionAt mismatch for offset ' + offset);
			} else {
				// The position coordinate system cannot express the position between \r and \n
				const expectedOffset: number = offset + (previousIsCarriageReturn ? -1 : 0);
				const actualOffset = doc.document.offsetAt(position);
				assert.strictEqual(actualOffset, expectedOffset, 'offsetAt mismatch for position ' + positionToStr(position));
			}

			if (allText.charAt(offset) === '\n') {
				line++;
				character = 0;
			} else {
				character++;
			}

			previousIsCarriageReturn = (allText.charAt(offset) === '\r');
		}
	}

	function createChangeEvent(range: Range, text: string, eol?: string): IModelChangedEvent {
		return {
			changes: [{
				range: range,
				rangeOffset: undefined!,
				rangeLength: undefined!,
				text: text
			}],
			eol: eol!,
			versionId: undefined!,
			isRedoing: false,
			isUndoing: false,
		};
	}

	function testLineMappingDirectionAfterEvents(lines: string[], eol: string, direction: AssertDocumentLineMappingDirection, e: IModelChangedEvent): void {
		const myDocument = new ExtHostDocumentData(undefined!, URI.file(''), lines.slice(0), eol, 1, 'text', false, 'utf8');
		assertDocumentLineMapping(myDocument, direction);

		myDocument.onEvents(e);
		assertDocumentLineMapping(myDocument, direction);
	}

	function testLineMappingAfterEvents(lines: string[], e: IModelChangedEvent): void {
		testLineMappingDirectionAfterEvents(lines, '\n', AssertDocumentLineMappingDirection.PositionToOffset, e);
		testLineMappingDirectionAfterEvents(lines, '\n', AssertDocumentLineMappingDirection.OffsetToPosition, e);

		testLineMappingDirectionAfterEvents(lines, '\r\n', AssertDocumentLineMappingDirection.PositionToOffset, e);
		testLineMappingDirectionAfterEvents(lines, '\r\n', AssertDocumentLineMappingDirection.OffsetToPosition, e);
	}

	ensureNoDisposablesAreLeakedInTestSuite();

	test('line mapping', () => {
		testLineMappingAfterEvents([
			'This is line one',
			'and this is line number two',
			'it is followed by #3',
			'and finished with the fourth.',
		], { changes: [], eol: undefined!, versionId: 7, isRedoing: false, isUndoing: false });
	});

	test('after remove', () => {
		testLineMappingAfterEvents([
			'This is line one',
			'and this is line number two',
			'it is followed by #3',
			'and finished with the fourth.',
		], createChangeEvent(new Range(1, 3, 1, 6), ''));
	});

	test('after replace', () => {
		testLineMappingAfterEvents([
			'This is line one',
			'and this is line number two',
			'it is followed by #3',
			'and finished with the fourth.',
		], createChangeEvent(new Range(1, 3, 1, 6), 'is could be'));
	});

	test('after insert line', () => {
		testLineMappingAfterEvents([
			'This is line one',
			'and this is line number two',
			'it is followed by #3',
			'and finished with the fourth.',
		], createChangeEvent(new Range(1, 3, 1, 6), 'is could be\na line with number'));
	});

	test('after insert two lines', () => {
		testLineMappingAfterEvents([
			'This is line one',
			'and this is line number two',
			'it is followed by #3',
			'and finished with the fourth.',
		], createChangeEvent(new Range(1, 3, 1, 6), 'is could be\na line with number\nyet another line'));
	});

	test('after remove line', () => {
		testLineMappingAfterEvents([
			'This is line one',
			'and this is line number two',
			'it is followed by #3',
			'and finished with the fourth.',
		], createChangeEvent(new Range(1, 3, 2, 6), ''));
	});

	test('after remove two lines', () => {
		testLineMappingAfterEvents([
			'This is line one',
			'and this is line number two',
			'it is followed by #3',
			'and finished with the fourth.',
		], createChangeEvent(new Range(1, 3, 3, 6), ''));
	});

	test('after deleting entire content', () => {
		testLineMappingAfterEvents([
			'This is line one',
			'and this is line number two',
			'it is followed by #3',
			'and finished with the fourth.',
		], createChangeEvent(new Range(1, 3, 4, 30), ''));
	});

	test('after replacing entire content', () => {
		testLineMappingAfterEvents([
			'This is line one',
			'and this is line number two',
			'it is followed by #3',
			'and finished with the fourth.',
		], createChangeEvent(new Range(1, 3, 4, 30), 'some new text\nthat\nspans multiple lines'));
	});

	test('after changing EOL to CRLF', () => {
		testLineMappingAfterEvents([
			'This is line one',
			'and this is line number two',
			'it is followed by #3',
			'and finished with the fourth.',
		], createChangeEvent(new Range(1, 1, 1, 1), '', '\r\n'));
	});

	test('after changing EOL to LF', () => {
		testLineMappingAfterEvents([
			'This is line one',
			'and this is line number two',
			'it is followed by #3',
			'and finished with the fourth.',
		], createChangeEvent(new Range(1, 1, 1, 1), '', '\n'));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostDocumentsAndEditors.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostDocumentsAndEditors.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { ExtHostDocumentsAndEditors } from '../../common/extHostDocumentsAndEditors.js';
import { TestRPCProtocol } from '../common/testRPCProtocol.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('ExtHostDocumentsAndEditors', () => {

	let editors: ExtHostDocumentsAndEditors;

	setup(function () {
		editors = new ExtHostDocumentsAndEditors(new TestRPCProtocol(), new NullLogService());
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('The value of TextDocument.isClosed is incorrect when a text document is closed, #27949', () => {

		editors.$acceptDocumentsAndEditorsDelta({
			addedDocuments: [{
				EOL: '\n',
				isDirty: true,
				languageId: 'fooLang',
				uri: URI.parse('foo:bar'),
				versionId: 1,
				lines: [
					'first',
					'second'
				],
				encoding: 'utf8'
			}]
		});

		return new Promise((resolve, reject) => {

			const d = editors.onDidRemoveDocuments(e => {
				try {

					for (const data of e) {
						assert.strictEqual(data.document.isClosed, true);
					}
					resolve(undefined);
				} catch (e) {
					reject(e);
				} finally {
					d.dispose();
				}
			});

			editors.$acceptDocumentsAndEditorsDelta({
				removedDocuments: [URI.parse('foo:bar')]
			});

		});
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostDocumentSaveParticipant.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostDocumentSaveParticipant.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { ExtHostDocuments } from '../../common/extHostDocuments.js';
import { ExtHostDocumentsAndEditors } from '../../common/extHostDocumentsAndEditors.js';
import { TextDocumentSaveReason, TextEdit, Position, EndOfLine } from '../../common/extHostTypes.js';
import { MainThreadTextEditorsShape, IWorkspaceEditDto, IWorkspaceTextEditDto, MainThreadBulkEditsShape } from '../../common/extHost.protocol.js';
import { ExtHostDocumentSaveParticipant } from '../../common/extHostDocumentSaveParticipant.js';
import { SingleProxyRPCProtocol } from '../common/testRPCProtocol.js';
import { SaveReason } from '../../../common/editor.js';
import type * as vscode from 'vscode';
import { mock } from '../../../../base/test/common/mock.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { nullExtensionDescription } from '../../../services/extensions/common/extensions.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { SerializableObjectWithBuffers } from '../../../services/extensions/common/proxyIdentifier.js';

function timeout(n: number) {
	return new Promise(resolve => setTimeout(resolve, n));
}

suite('ExtHostDocumentSaveParticipant', () => {

	const resource = URI.parse('foo:bar');
	const mainThreadBulkEdits = new class extends mock<MainThreadBulkEditsShape>() { };
	let documents: ExtHostDocuments;
	const nullLogService = new NullLogService();

	setup(() => {
		const documentsAndEditors = new ExtHostDocumentsAndEditors(SingleProxyRPCProtocol(null), new NullLogService());
		documentsAndEditors.$acceptDocumentsAndEditorsDelta({
			addedDocuments: [{
				isDirty: false,
				languageId: 'foo',
				uri: resource,
				versionId: 1,
				lines: ['foo'],
				EOL: '\n',
				encoding: 'utf8'
			}]
		});
		documents = new ExtHostDocuments(SingleProxyRPCProtocol(null), documentsAndEditors);
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('no listeners, no problem', () => {
		const participant = new ExtHostDocumentSaveParticipant(nullLogService, documents, mainThreadBulkEdits);
		return participant.$participateInSave(resource, SaveReason.EXPLICIT).then(() => assert.ok(true));
	});

	test('event delivery', () => {
		const participant = new ExtHostDocumentSaveParticipant(nullLogService, documents, mainThreadBulkEdits);

		let event: vscode.TextDocumentWillSaveEvent;
		const sub = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (e) {
			event = e;
		});

		return participant.$participateInSave(resource, SaveReason.EXPLICIT).then(() => {
			sub.dispose();

			assert.ok(event);
			assert.strictEqual(event.reason, TextDocumentSaveReason.Manual);
			assert.strictEqual(typeof event.waitUntil, 'function');
		});
	});

	test('event delivery, immutable', () => {
		const participant = new ExtHostDocumentSaveParticipant(nullLogService, documents, mainThreadBulkEdits);

		let event: vscode.TextDocumentWillSaveEvent;
		const sub = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (e) {
			event = e;
		});

		return participant.$participateInSave(resource, SaveReason.EXPLICIT).then(() => {
			sub.dispose();

			assert.ok(event);
			// eslint-disable-next-line local/code-no-any-casts
			assert.throws(() => { (event.document as any) = null!; });
		});
	});

	test('event delivery, bad listener', () => {
		const participant = new ExtHostDocumentSaveParticipant(nullLogService, documents, mainThreadBulkEdits);

		const sub = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (e) {
			throw new Error('💀');
		});

		return participant.$participateInSave(resource, SaveReason.EXPLICIT).then(values => {
			sub.dispose();

			const [first] = values;
			assert.strictEqual(first, false);
		});
	});

	test('event delivery, bad listener doesn\'t prevent more events', () => {
		const participant = new ExtHostDocumentSaveParticipant(nullLogService, documents, mainThreadBulkEdits);

		const sub1 = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (e) {
			throw new Error('💀');
		});
		let event: vscode.TextDocumentWillSaveEvent;
		const sub2 = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (e) {
			event = e;
		});

		return participant.$participateInSave(resource, SaveReason.EXPLICIT).then(() => {
			sub1.dispose();
			sub2.dispose();

			assert.ok(event);
		});
	});

	test('event delivery, in subscriber order', () => {
		const participant = new ExtHostDocumentSaveParticipant(nullLogService, documents, mainThreadBulkEdits);

		let counter = 0;
		const sub1 = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (event) {
			assert.strictEqual(counter++, 0);
		});

		const sub2 = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (event) {
			assert.strictEqual(counter++, 1);
		});

		return participant.$participateInSave(resource, SaveReason.EXPLICIT).then(() => {
			sub1.dispose();
			sub2.dispose();
		});
	});

	test('event delivery, ignore bad listeners', async () => {
		const participant = new ExtHostDocumentSaveParticipant(nullLogService, documents, mainThreadBulkEdits, { timeout: 5, errors: 1 });

		let callCount = 0;
		const sub = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (event) {
			callCount += 1;
			throw new Error('boom');
		});

		await participant.$participateInSave(resource, SaveReason.EXPLICIT);
		await participant.$participateInSave(resource, SaveReason.EXPLICIT);
		await participant.$participateInSave(resource, SaveReason.EXPLICIT);
		await participant.$participateInSave(resource, SaveReason.EXPLICIT);

		sub.dispose();
		assert.strictEqual(callCount, 2);
	});

	test('event delivery, overall timeout', async function () {
		const participant = new ExtHostDocumentSaveParticipant(nullLogService, documents, mainThreadBulkEdits, { timeout: 20, errors: 5 });

		// let callCount = 0;
		const calls: number[] = [];
		const sub1 = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (event) {
			calls.push(1);
		});

		const sub2 = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (event) {
			calls.push(2);
			event.waitUntil(timeout(100));
		});

		const sub3 = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (event) {
			calls.push(3);
		});

		const values = await participant.$participateInSave(resource, SaveReason.EXPLICIT);
		sub1.dispose();
		sub2.dispose();
		sub3.dispose();
		assert.deepStrictEqual(calls, [1, 2]);
		assert.strictEqual(values.length, 2);
	});

	test('event delivery, waitUntil', () => {
		const participant = new ExtHostDocumentSaveParticipant(nullLogService, documents, mainThreadBulkEdits);

		const sub = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (event) {

			event.waitUntil(timeout(10));
			event.waitUntil(timeout(10));
			event.waitUntil(timeout(10));
		});

		return participant.$participateInSave(resource, SaveReason.EXPLICIT).then(() => {
			sub.dispose();
		});

	});

	test('event delivery, waitUntil must be called sync', () => {
		const participant = new ExtHostDocumentSaveParticipant(nullLogService, documents, mainThreadBulkEdits);

		const sub = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (event) {

			event.waitUntil(new Promise<undefined>((resolve, reject) => {
				setTimeout(() => {
					try {
						assert.throws(() => event.waitUntil(timeout(10)));
						resolve(undefined);
					} catch (e) {
						reject(e);
					}

				}, 10);
			}));
		});

		return participant.$participateInSave(resource, SaveReason.EXPLICIT).then(() => {
			sub.dispose();
		});
	});

	test('event delivery, waitUntil will timeout', function () {

		const participant = new ExtHostDocumentSaveParticipant(nullLogService, documents, mainThreadBulkEdits, { timeout: 5, errors: 3 });

		const sub = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (event) {
			event.waitUntil(timeout(100));
		});

		return participant.$participateInSave(resource, SaveReason.EXPLICIT).then(values => {
			sub.dispose();

			const [first] = values;
			assert.strictEqual(first, false);
		});
	});

	test('event delivery, waitUntil failure handling', () => {
		const participant = new ExtHostDocumentSaveParticipant(nullLogService, documents, mainThreadBulkEdits);

		const sub1 = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (e) {
			e.waitUntil(Promise.reject(new Error('dddd')));
		});

		let event: vscode.TextDocumentWillSaveEvent;
		const sub2 = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (e) {
			event = e;
		});

		return participant.$participateInSave(resource, SaveReason.EXPLICIT).then(() => {
			assert.ok(event);
			sub1.dispose();
			sub2.dispose();
		});
	});

	test('event delivery, pushEdits sync', () => {

		let dto: IWorkspaceEditDto;
		const participant = new ExtHostDocumentSaveParticipant(nullLogService, documents, new class extends mock<MainThreadTextEditorsShape>() {
			$tryApplyWorkspaceEdit(_edits: SerializableObjectWithBuffers<IWorkspaceEditDto>) {
				dto = _edits.value;
				return Promise.resolve(true);
			}
		});

		const sub = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (e) {
			e.waitUntil(Promise.resolve([TextEdit.insert(new Position(0, 0), 'bar')]));
			e.waitUntil(Promise.resolve([TextEdit.setEndOfLine(EndOfLine.CRLF)]));
		});

		return participant.$participateInSave(resource, SaveReason.EXPLICIT).then(() => {
			sub.dispose();

			assert.strictEqual(dto.edits.length, 2);
			assert.ok((<IWorkspaceTextEditDto>dto.edits[0]).textEdit);
			assert.ok((<IWorkspaceTextEditDto>dto.edits[1]).textEdit);
		});
	});

	test('event delivery, concurrent change', () => {

		let edits: IWorkspaceEditDto;
		const participant = new ExtHostDocumentSaveParticipant(nullLogService, documents, new class extends mock<MainThreadTextEditorsShape>() {
			$tryApplyWorkspaceEdit(_edits: SerializableObjectWithBuffers<IWorkspaceEditDto>) {
				edits = _edits.value;
				return Promise.resolve(true);
			}
		});

		const sub = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (e) {

			// concurrent change from somewhere
			documents.$acceptModelChanged(resource, {
				changes: [{
					range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 },
					rangeOffset: undefined!,
					rangeLength: undefined!,
					text: 'bar'
				}],
				eol: undefined!,
				versionId: 2,
				isRedoing: false,
				isUndoing: false,
				detailedReason: undefined,
				isFlush: false,
				isEolChange: false,
			}, true);

			e.waitUntil(Promise.resolve([TextEdit.insert(new Position(0, 0), 'bar')]));
		});

		return participant.$participateInSave(resource, SaveReason.EXPLICIT).then(values => {
			sub.dispose();

			assert.strictEqual(edits, undefined);
			assert.strictEqual(values[0], false);
		});

	});

	test('event delivery, two listeners -> two document states', () => {

		const participant = new ExtHostDocumentSaveParticipant(nullLogService, documents, new class extends mock<MainThreadTextEditorsShape>() {
			$tryApplyWorkspaceEdit(dto: SerializableObjectWithBuffers<IWorkspaceEditDto>) {

				for (const edit of dto.value.edits) {

					const uri = URI.revive((<IWorkspaceTextEditDto>edit).resource);
					const { text, range } = (<IWorkspaceTextEditDto>edit).textEdit;
					documents.$acceptModelChanged(uri, {
						changes: [{
							range,
							text,
							rangeOffset: undefined!,
							rangeLength: undefined!,
						}],
						eol: undefined!,
						versionId: documents.getDocumentData(uri)!.version + 1,
						isRedoing: false,
						isUndoing: false,
						detailedReason: undefined,
						isFlush: false,
						isEolChange: false,
					}, true);
					// }
				}

				return Promise.resolve(true);
			}
		});

		const document = documents.getDocument(resource);

		const sub1 = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (e) {
			// the document state we started with
			assert.strictEqual(document.version, 1);
			assert.strictEqual(document.getText(), 'foo');

			e.waitUntil(Promise.resolve([TextEdit.insert(new Position(0, 0), 'bar')]));
		});

		const sub2 = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (e) {
			// the document state AFTER the first listener kicked in
			assert.strictEqual(document.version, 2);
			assert.strictEqual(document.getText(), 'barfoo');

			e.waitUntil(Promise.resolve([TextEdit.insert(new Position(0, 0), 'bar')]));
		});

		return participant.$participateInSave(resource, SaveReason.EXPLICIT).then(values => {
			sub1.dispose();
			sub2.dispose();

			// the document state AFTER eventing is done
			assert.strictEqual(document.version, 3);
			assert.strictEqual(document.getText(), 'barbarfoo');
		});

	});

	test('Log failing listener', function () {
		let didLogSomething = false;
		const participant = new ExtHostDocumentSaveParticipant(new class extends NullLogService {
			override error(message: string | Error, ...args: any[]): void {
				didLogSomething = true;
			}
		}, documents, mainThreadBulkEdits);


		const sub = participant.getOnWillSaveTextDocumentEvent(nullExtensionDescription)(function (e) {
			throw new Error('boom');
		});

		return participant.$participateInSave(resource, SaveReason.EXPLICIT).then(() => {
			sub.dispose();
			assert.strictEqual(didLogSomething, true);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostEditorTabs.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostEditorTabs.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { mock } from '../../../../base/test/common/mock.js';
import { IEditorTabDto, IEditorTabGroupDto, MainThreadEditorTabsShape, TabInputKind, TabModelOperationKind, TextInputDto } from '../../common/extHost.protocol.js';
import { ExtHostEditorTabs } from '../../common/extHostEditorTabs.js';
import { SingleProxyRPCProtocol } from '../common/testRPCProtocol.js';
import { TextMergeTabInput, TextTabInput } from '../../common/extHostTypes.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('ExtHostEditorTabs', function () {

	const defaultTabDto: IEditorTabDto = {
		id: 'uniquestring',
		input: { kind: TabInputKind.TextInput, uri: URI.parse('file://abc/def.txt') },
		isActive: true,
		isDirty: true,
		isPinned: true,
		isPreview: false,
		label: 'label1',
	};

	function createTabDto(dto?: Partial<IEditorTabDto>): IEditorTabDto {
		return { ...defaultTabDto, ...dto };
	}

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('Ensure empty model throws when accessing active group', function () {
		const extHostEditorTabs = new ExtHostEditorTabs(
			SingleProxyRPCProtocol(new class extends mock<MainThreadEditorTabsShape>() {
				// override/implement $moveTab or $closeTab
			})
		);

		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 0);
		// Active group should never be undefined (there is always an active group). Ensure accessing it undefined throws.
		// TODO @lramos15 Add a throw on the main side when a model is sent without an active group
		assert.throws(() => extHostEditorTabs.tabGroups.activeTabGroup);
	});

	test('single tab', function () {

		const extHostEditorTabs = new ExtHostEditorTabs(
			SingleProxyRPCProtocol(new class extends mock<MainThreadEditorTabsShape>() {
				// override/implement $moveTab or $closeTab
			})
		);

		const tab: IEditorTabDto = createTabDto({
			id: 'uniquestring',
			isActive: true,
			isDirty: true,
			isPinned: true,
			label: 'label1',
		});

		extHostEditorTabs.$acceptEditorTabModel([{
			isActive: true,
			viewColumn: 0,
			groupId: 12,
			tabs: [tab]
		}]);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		const [first] = extHostEditorTabs.tabGroups.all;
		assert.ok(first.activeTab);
		assert.strictEqual(first.tabs.indexOf(first.activeTab), 0);

		{
			extHostEditorTabs.$acceptEditorTabModel([{
				isActive: true,
				viewColumn: 0,
				groupId: 12,
				tabs: [tab]
			}]);
			assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
			const [first] = extHostEditorTabs.tabGroups.all;
			assert.ok(first.activeTab);
			assert.strictEqual(first.tabs.indexOf(first.activeTab), 0);
		}
	});

	test('Empty tab group', function () {
		const extHostEditorTabs = new ExtHostEditorTabs(
			SingleProxyRPCProtocol(new class extends mock<MainThreadEditorTabsShape>() {
				// override/implement $moveTab or $closeTab
			})
		);

		extHostEditorTabs.$acceptEditorTabModel([{
			isActive: true,
			viewColumn: 0,
			groupId: 12,
			tabs: []
		}]);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		const [first] = extHostEditorTabs.tabGroups.all;
		assert.strictEqual(first.activeTab, undefined);
		assert.strictEqual(first.tabs.length, 0);
	});

	test('Ensure tabGroup change events fires', function () {
		const extHostEditorTabs = new ExtHostEditorTabs(
			SingleProxyRPCProtocol(new class extends mock<MainThreadEditorTabsShape>() {
				// override/implement $moveTab or $closeTab
			})
		);

		let count = 0;
		store.add(extHostEditorTabs.tabGroups.onDidChangeTabGroups(() => count++));

		assert.strictEqual(count, 0);

		extHostEditorTabs.$acceptEditorTabModel([{
			isActive: true,
			viewColumn: 0,
			groupId: 12,
			tabs: []
		}]);
		assert.ok(extHostEditorTabs.tabGroups.activeTabGroup);
		const activeTabGroup: vscode.TabGroup = extHostEditorTabs.tabGroups.activeTabGroup;
		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		assert.strictEqual(activeTabGroup.tabs.length, 0);
		assert.strictEqual(count, 1);
	});

	test('Check TabGroupChangeEvent properties', function () {
		const extHostEditorTabs = new ExtHostEditorTabs(
			SingleProxyRPCProtocol(new class extends mock<MainThreadEditorTabsShape>() {
				// override/implement $moveTab or $closeTab
			})
		);

		const group1Data: IEditorTabGroupDto = {
			isActive: true,
			viewColumn: 0,
			groupId: 12,
			tabs: []
		};
		const group2Data: IEditorTabGroupDto = { ...group1Data, groupId: 13 };

		const events: vscode.TabGroupChangeEvent[] = [];
		store.add(extHostEditorTabs.tabGroups.onDidChangeTabGroups(e => events.push(e)));
		// OPEN
		extHostEditorTabs.$acceptEditorTabModel([group1Data]);
		assert.deepStrictEqual(events, [{
			changed: [],
			closed: [],
			opened: [extHostEditorTabs.tabGroups.activeTabGroup]
		}]);

		// OPEN, CHANGE
		events.length = 0;
		extHostEditorTabs.$acceptEditorTabModel([{ ...group1Data, isActive: false }, group2Data]);
		assert.deepStrictEqual(events, [{
			changed: [extHostEditorTabs.tabGroups.all[0]],
			closed: [],
			opened: [extHostEditorTabs.tabGroups.all[1]]
		}]);

		// CHANGE
		events.length = 0;
		extHostEditorTabs.$acceptEditorTabModel([group1Data, { ...group2Data, isActive: false }]);
		assert.deepStrictEqual(events, [{
			changed: extHostEditorTabs.tabGroups.all,
			closed: [],
			opened: []
		}]);

		// CLOSE, CHANGE
		events.length = 0;
		const oldActiveGroup = extHostEditorTabs.tabGroups.activeTabGroup;
		extHostEditorTabs.$acceptEditorTabModel([group2Data]);
		assert.deepStrictEqual(events, [{
			changed: extHostEditorTabs.tabGroups.all,
			closed: [oldActiveGroup],
			opened: []
		}]);
	});

	test('Ensure reference equality for activeTab and activeGroup', function () {
		const extHostEditorTabs = new ExtHostEditorTabs(
			SingleProxyRPCProtocol(new class extends mock<MainThreadEditorTabsShape>() {
				// override/implement $moveTab or $closeTab
			})
		);
		const tab = createTabDto({
			id: 'uniquestring',
			isActive: true,
			isDirty: true,
			isPinned: true,
			label: 'label1',
			editorId: 'default',
		});

		extHostEditorTabs.$acceptEditorTabModel([{
			isActive: true,
			viewColumn: 0,
			groupId: 12,
			tabs: [tab]
		}]);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		const [first] = extHostEditorTabs.tabGroups.all;
		assert.ok(first.activeTab);
		assert.strictEqual(first.tabs.indexOf(first.activeTab), 0);
		assert.strictEqual(first.activeTab, first.tabs[0]);
		assert.strictEqual(extHostEditorTabs.tabGroups.activeTabGroup, first);
	});

	test('TextMergeTabInput surfaces in the UI', function () {

		const extHostEditorTabs = new ExtHostEditorTabs(
			SingleProxyRPCProtocol(new class extends mock<MainThreadEditorTabsShape>() {
				// override/implement $moveTab or $closeTab
			})
		);

		const tab: IEditorTabDto = createTabDto({
			input: {
				kind: TabInputKind.TextMergeInput,
				base: URI.from({ scheme: 'test', path: 'base' }),
				input1: URI.from({ scheme: 'test', path: 'input1' }),
				input2: URI.from({ scheme: 'test', path: 'input2' }),
				result: URI.from({ scheme: 'test', path: 'result' }),
			}
		});

		extHostEditorTabs.$acceptEditorTabModel([{
			isActive: true,
			viewColumn: 0,
			groupId: 12,
			tabs: [tab]
		}]);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		const [first] = extHostEditorTabs.tabGroups.all;
		assert.ok(first.activeTab);
		assert.strictEqual(first.tabs.indexOf(first.activeTab), 0);
		assert.ok(first.activeTab.input instanceof TextMergeTabInput);
	});

	test('Ensure reference stability', function () {

		const extHostEditorTabs = new ExtHostEditorTabs(
			SingleProxyRPCProtocol(new class extends mock<MainThreadEditorTabsShape>() {
				// override/implement $moveTab or $closeTab
			})
		);
		const tabDto = createTabDto();

		// single dirty tab

		extHostEditorTabs.$acceptEditorTabModel([{
			isActive: true,
			viewColumn: 0,
			groupId: 12,
			tabs: [tabDto]
		}]);
		let all = extHostEditorTabs.tabGroups.all.map(group => group.tabs).flat();
		assert.strictEqual(all.length, 1);
		const apiTab1 = all[0];
		assert.ok(apiTab1.input instanceof TextTabInput);
		assert.strictEqual(tabDto.input.kind, TabInputKind.TextInput);
		const dtoResource = (tabDto.input as TextInputDto).uri;
		assert.strictEqual(apiTab1.input.uri.toString(), URI.revive(dtoResource).toString());
		assert.strictEqual(apiTab1.isDirty, true);


		// NOT DIRTY anymore

		const tabDto2: IEditorTabDto = { ...tabDto, isDirty: false };
		// Accept a simple update
		extHostEditorTabs.$acceptTabOperation({
			kind: TabModelOperationKind.TAB_UPDATE,
			index: 0,
			tabDto: tabDto2,
			groupId: 12
		});

		all = extHostEditorTabs.tabGroups.all.map(group => group.tabs).flat();
		assert.strictEqual(all.length, 1);
		const apiTab2 = all[0];
		assert.ok(apiTab1.input instanceof TextTabInput);
		assert.strictEqual(apiTab1.input.uri.toString(), URI.revive(dtoResource).toString());
		assert.strictEqual(apiTab2.isDirty, false);

		assert.strictEqual(apiTab1 === apiTab2, true);
	});

	test('Tab.isActive working', function () {

		const extHostEditorTabs = new ExtHostEditorTabs(
			SingleProxyRPCProtocol(new class extends mock<MainThreadEditorTabsShape>() {
				// override/implement $moveTab or $closeTab
			})
		);
		const tabDtoAAA = createTabDto({
			id: 'AAA',
			isActive: true,
			isDirty: true,
			isPinned: true,
			label: 'label1',
			input: { kind: TabInputKind.TextInput, uri: URI.parse('file://abc/AAA.txt') },
			editorId: 'default'
		});

		const tabDtoBBB = createTabDto({
			id: 'BBB',
			isActive: false,
			isDirty: true,
			isPinned: true,
			label: 'label1',
			input: { kind: TabInputKind.TextInput, uri: URI.parse('file://abc/BBB.txt') },
			editorId: 'default'
		});

		// single dirty tab

		extHostEditorTabs.$acceptEditorTabModel([{
			isActive: true,
			viewColumn: 0,
			groupId: 12,
			tabs: [tabDtoAAA, tabDtoBBB]
		}]);

		const all = extHostEditorTabs.tabGroups.all.map(group => group.tabs).flat();
		assert.strictEqual(all.length, 2);

		const activeTab1 = extHostEditorTabs.tabGroups.activeTabGroup?.activeTab;
		assert.ok(activeTab1?.input instanceof TextTabInput);
		assert.strictEqual(tabDtoAAA.input.kind, TabInputKind.TextInput);
		const dtoAAAResource = (tabDtoAAA.input as TextInputDto).uri;
		assert.strictEqual(activeTab1?.input?.uri.toString(), URI.revive(dtoAAAResource)?.toString());
		assert.strictEqual(activeTab1?.isActive, true);

		extHostEditorTabs.$acceptTabOperation({
			groupId: 12,
			index: 1,
			kind: TabModelOperationKind.TAB_UPDATE,
			tabDto: { ...tabDtoBBB, isActive: true } /// BBB is now active
		});

		const activeTab2 = extHostEditorTabs.tabGroups.activeTabGroup?.activeTab;
		assert.ok(activeTab2?.input instanceof TextTabInput);
		assert.strictEqual(tabDtoBBB.input.kind, TabInputKind.TextInput);
		const dtoBBBResource = (tabDtoBBB.input as TextInputDto).uri;
		assert.strictEqual(activeTab2?.input?.uri.toString(), URI.revive(dtoBBBResource)?.toString());
		assert.strictEqual(activeTab2?.isActive, true);
		assert.strictEqual(activeTab1?.isActive, false);
	});

	test('vscode.window.tagGroups is immutable', function () {

		const extHostEditorTabs = new ExtHostEditorTabs(
			SingleProxyRPCProtocol(new class extends mock<MainThreadEditorTabsShape>() {
				// override/implement $moveTab or $closeTab
			})
		);

		assert.throws(() => {
			// @ts-expect-error write to readonly prop
			extHostEditorTabs.tabGroups.activeTabGroup = undefined;
		});
		assert.throws(() => {
			// @ts-expect-error write to readonly prop
			extHostEditorTabs.tabGroups.all.length = 0;
		});
		assert.throws(() => {
			// @ts-expect-error write to readonly prop
			extHostEditorTabs.tabGroups.onDidChangeActiveTabGroup = undefined;
		});
		assert.throws(() => {
			// @ts-expect-error write to readonly prop
			extHostEditorTabs.tabGroups.onDidChangeTabGroups = undefined;
		});
	});

	test('Ensure close is called with all tab ids', function () {
		const closedTabIds: string[][] = [];
		const extHostEditorTabs = new ExtHostEditorTabs(
			SingleProxyRPCProtocol(new class extends mock<MainThreadEditorTabsShape>() {
				// override/implement $moveTab or $closeTab
				override async $closeTab(tabIds: string[], preserveFocus?: boolean) {
					closedTabIds.push(tabIds);
					return true;
				}
			})
		);
		const tab: IEditorTabDto = createTabDto({
			id: 'uniquestring',
			isActive: true,
			isDirty: true,
			isPinned: true,
			label: 'label1',
			editorId: 'default'
		});

		extHostEditorTabs.$acceptEditorTabModel([{
			isActive: true,
			viewColumn: 0,
			groupId: 12,
			tabs: [tab]
		}]);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		const activeTab = extHostEditorTabs.tabGroups.activeTabGroup?.activeTab;
		assert.ok(activeTab);
		extHostEditorTabs.tabGroups.close(activeTab, false);
		assert.strictEqual(closedTabIds.length, 1);
		assert.deepStrictEqual(closedTabIds[0], ['uniquestring']);
		// Close with array
		extHostEditorTabs.tabGroups.close([activeTab], false);
		assert.strictEqual(closedTabIds.length, 2);
		assert.deepStrictEqual(closedTabIds[1], ['uniquestring']);
	});

	test('Update tab only sends tab change event', async function () {
		const closedTabIds: string[][] = [];
		const extHostEditorTabs = new ExtHostEditorTabs(
			SingleProxyRPCProtocol(new class extends mock<MainThreadEditorTabsShape>() {
				// override/implement $moveTab or $closeTab
				override async $closeTab(tabIds: string[], preserveFocus?: boolean) {
					closedTabIds.push(tabIds);
					return true;
				}
			})
		);
		const tabDto: IEditorTabDto = createTabDto({
			id: 'uniquestring',
			isActive: true,
			isDirty: true,
			isPinned: true,
			label: 'label1',
			editorId: 'default'
		});

		extHostEditorTabs.$acceptEditorTabModel([{
			isActive: true,
			viewColumn: 0,
			groupId: 12,
			tabs: [tabDto]
		}]);

		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.map(g => g.tabs).flat().length, 1);

		const tab = extHostEditorTabs.tabGroups.all[0].tabs[0];


		const p = new Promise<vscode.TabChangeEvent>(resolve => store.add(extHostEditorTabs.tabGroups.onDidChangeTabs(resolve)));

		extHostEditorTabs.$acceptTabOperation({
			groupId: 12,
			index: 0,
			kind: TabModelOperationKind.TAB_UPDATE,
			tabDto: { ...tabDto, label: 'NEW LABEL' }
		});

		const changedTab = (await p).changed[0];

		assert.ok(tab === changedTab);
		assert.strictEqual(changedTab.label, 'NEW LABEL');

	});

	test('Active tab', function () {

		const extHostEditorTabs = new ExtHostEditorTabs(
			SingleProxyRPCProtocol(new class extends mock<MainThreadEditorTabsShape>() {
				// override/implement $moveTab or $closeTab
			})
		);

		const tab1: IEditorTabDto = createTabDto({
			id: 'uniquestring',
			isActive: true,
			isDirty: true,
			isPinned: true,
			label: 'label1',
		});

		const tab2: IEditorTabDto = createTabDto({
			isActive: false,
			id: 'uniquestring2',
		});

		const tab3: IEditorTabDto = createTabDto({
			isActive: false,
			id: 'uniquestring3',
		});

		extHostEditorTabs.$acceptEditorTabModel([{
			isActive: true,
			viewColumn: 0,
			groupId: 12,
			tabs: [tab1, tab2, tab3]
		}]);

		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.map(g => g.tabs).flat().length, 3);

		// Active tab is correct
		assert.strictEqual(extHostEditorTabs.tabGroups.activeTabGroup?.activeTab, extHostEditorTabs.tabGroups.activeTabGroup?.tabs[0]);

		// Switching active tab works
		tab1.isActive = false;
		tab2.isActive = true;
		extHostEditorTabs.$acceptTabOperation({
			groupId: 12,
			index: 0,
			kind: TabModelOperationKind.TAB_UPDATE,
			tabDto: tab1
		});
		extHostEditorTabs.$acceptTabOperation({
			groupId: 12,
			index: 1,
			kind: TabModelOperationKind.TAB_UPDATE,
			tabDto: tab2
		});
		assert.strictEqual(extHostEditorTabs.tabGroups.activeTabGroup?.activeTab, extHostEditorTabs.tabGroups.activeTabGroup?.tabs[1]);

		//Closing tabs out works
		tab3.isActive = true;
		extHostEditorTabs.$acceptEditorTabModel([{
			isActive: true,
			viewColumn: 0,
			groupId: 12,
			tabs: [tab3]
		}]);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.map(g => g.tabs).flat().length, 1);
		assert.strictEqual(extHostEditorTabs.tabGroups.activeTabGroup?.activeTab, extHostEditorTabs.tabGroups.activeTabGroup?.tabs[0]);

		// Closing out all tabs returns undefine active tab
		extHostEditorTabs.$acceptEditorTabModel([{
			isActive: true,
			viewColumn: 0,
			groupId: 12,
			tabs: []
		}]);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.map(g => g.tabs).flat().length, 0);
		assert.strictEqual(extHostEditorTabs.tabGroups.activeTabGroup?.activeTab, undefined);
	});

	test('Tab operations patches open and close correctly', function () {
		const extHostEditorTabs = new ExtHostEditorTabs(
			SingleProxyRPCProtocol(new class extends mock<MainThreadEditorTabsShape>() {
				// override/implement $moveTab or $closeTab
			})
		);

		const tab1: IEditorTabDto = createTabDto({
			id: 'uniquestring',
			isActive: true,
			label: 'label1',
		});

		const tab2: IEditorTabDto = createTabDto({
			isActive: false,
			id: 'uniquestring2',
			label: 'label2',
		});

		const tab3: IEditorTabDto = createTabDto({
			isActive: false,
			id: 'uniquestring3',
			label: 'label3',
		});

		extHostEditorTabs.$acceptEditorTabModel([{
			isActive: true,
			viewColumn: 0,
			groupId: 12,
			tabs: [tab1, tab2, tab3]
		}]);

		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.map(g => g.tabs).flat().length, 3);

		// Close tab 2
		extHostEditorTabs.$acceptTabOperation({
			groupId: 12,
			index: 1,
			kind: TabModelOperationKind.TAB_CLOSE,
			tabDto: tab2
		});
		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.map(g => g.tabs).flat().length, 2);

		// Close active tab and update tab 3 to be active
		extHostEditorTabs.$acceptTabOperation({
			groupId: 12,
			index: 0,
			kind: TabModelOperationKind.TAB_CLOSE,
			tabDto: tab1
		});
		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.map(g => g.tabs).flat().length, 1);
		tab3.isActive = true;
		extHostEditorTabs.$acceptTabOperation({
			groupId: 12,
			index: 0,
			kind: TabModelOperationKind.TAB_UPDATE,
			tabDto: tab3
		});
		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.map(g => g.tabs).flat().length, 1);
		assert.strictEqual(extHostEditorTabs.tabGroups.all[0]?.activeTab?.label, 'label3');

		// Open tab 2 back
		extHostEditorTabs.$acceptTabOperation({
			groupId: 12,
			index: 1,
			kind: TabModelOperationKind.TAB_OPEN,
			tabDto: tab2
		});
		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.map(g => g.tabs).flat().length, 2);
		assert.strictEqual(extHostEditorTabs.tabGroups.all[0]?.tabs[1]?.label, 'label2');
	});

	test('Tab operations patches move correctly', function () {
		const extHostEditorTabs = new ExtHostEditorTabs(
			SingleProxyRPCProtocol(new class extends mock<MainThreadEditorTabsShape>() {
				// override/implement $moveTab or $closeTab
			})
		);

		const tab1: IEditorTabDto = createTabDto({
			id: 'uniquestring',
			isActive: true,
			label: 'label1',
		});

		const tab2: IEditorTabDto = createTabDto({
			isActive: false,
			id: 'uniquestring2',
			label: 'label2',
		});

		const tab3: IEditorTabDto = createTabDto({
			isActive: false,
			id: 'uniquestring3',
			label: 'label3',
		});

		extHostEditorTabs.$acceptEditorTabModel([{
			isActive: true,
			viewColumn: 0,
			groupId: 12,
			tabs: [tab1, tab2, tab3]
		}]);

		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.map(g => g.tabs).flat().length, 3);

		// Move tab 2 to index 0
		extHostEditorTabs.$acceptTabOperation({
			groupId: 12,
			index: 0,
			oldIndex: 1,
			kind: TabModelOperationKind.TAB_MOVE,
			tabDto: tab2
		});
		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.map(g => g.tabs).flat().length, 3);
		assert.strictEqual(extHostEditorTabs.tabGroups.all[0]?.tabs[0]?.label, 'label2');

		// Move tab 3 to index 1
		extHostEditorTabs.$acceptTabOperation({
			groupId: 12,
			index: 1,
			oldIndex: 2,
			kind: TabModelOperationKind.TAB_MOVE,
			tabDto: tab3
		});
		assert.strictEqual(extHostEditorTabs.tabGroups.all.length, 1);
		assert.strictEqual(extHostEditorTabs.tabGroups.all.map(g => g.tabs).flat().length, 3);
		assert.strictEqual(extHostEditorTabs.tabGroups.all[0]?.tabs[1]?.label, 'label3');
		assert.strictEqual(extHostEditorTabs.tabGroups.all[0]?.tabs[0]?.label, 'label2');
		assert.strictEqual(extHostEditorTabs.tabGroups.all[0]?.tabs[2]?.label, 'label1');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostFileSystemEventService.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostFileSystemEventService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ExtHostFileSystemEventService } from '../../common/extHostFileSystemEventService.js';
import { IMainContext } from '../../common/extHost.protocol.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ExtHostFileSystemInfo } from '../../common/extHostFileSystemInfo.js';

suite('ExtHostFileSystemEventService', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('FileSystemWatcher ignore events properties are reversed #26851', function () {

		const protocol: IMainContext = {
			getProxy: () => { return undefined!; },
			set: undefined!,
			dispose: undefined!,
			assertRegistered: undefined!,
			drain: undefined!
		};

		const fileSystemInfo = new ExtHostFileSystemInfo();

		const watcher1 = new ExtHostFileSystemEventService(protocol, new NullLogService(), undefined!).createFileSystemWatcher(undefined!, undefined!, fileSystemInfo, undefined!, '**/somethingInteresting', {});
		assert.strictEqual(watcher1.ignoreChangeEvents, false);
		assert.strictEqual(watcher1.ignoreCreateEvents, false);
		assert.strictEqual(watcher1.ignoreDeleteEvents, false);
		watcher1.dispose();

		const watcher2 = new ExtHostFileSystemEventService(protocol, new NullLogService(), undefined!).createFileSystemWatcher(undefined!, undefined!, fileSystemInfo, undefined!, '**/somethingBoring', { ignoreCreateEvents: true, ignoreChangeEvents: true, ignoreDeleteEvents: true });
		assert.strictEqual(watcher2.ignoreChangeEvents, true);
		assert.strictEqual(watcher2.ignoreCreateEvents, true);
		assert.strictEqual(watcher2.ignoreDeleteEvents, true);
		watcher2.dispose();
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostLanguageFeatures.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostLanguageFeatures.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { TestInstantiationService } from '../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { setUnexpectedErrorHandler, errorHandler } from '../../../../base/common/errors.js';
import { URI } from '../../../../base/common/uri.js';
import * as types from '../../common/extHostTypes.js';
import { createTextModel } from '../../../../editor/test/common/testTextModel.js';
import { Position as EditorPosition, Position } from '../../../../editor/common/core/position.js';
import { Range as EditorRange } from '../../../../editor/common/core/range.js';
import { TestRPCProtocol } from '../common/testRPCProtocol.js';
import { IMarkerService } from '../../../../platform/markers/common/markers.js';
import { MarkerService } from '../../../../platform/markers/common/markerService.js';
import { ExtHostLanguageFeatures } from '../../common/extHostLanguageFeatures.js';
import { MainThreadLanguageFeatures } from '../../browser/mainThreadLanguageFeatures.js';
import { ExtHostCommands } from '../../common/extHostCommands.js';
import { MainThreadCommands } from '../../browser/mainThreadCommands.js';
import { ExtHostDocuments } from '../../common/extHostDocuments.js';
import { ExtHostDocumentsAndEditors } from '../../common/extHostDocumentsAndEditors.js';
import * as languages from '../../../../editor/common/languages.js';
import { getCodeLensModel } from '../../../../editor/contrib/codelens/browser/codelens.js';
import { getDefinitionsAtPosition, getImplementationsAtPosition, getTypeDefinitionsAtPosition, getDeclarationsAtPosition, getReferencesAtPosition } from '../../../../editor/contrib/gotoSymbol/browser/goToSymbol.js';
import { getHoversPromise } from '../../../../editor/contrib/hover/browser/getHover.js';
import { getOccurrencesAtPosition } from '../../../../editor/contrib/wordHighlighter/browser/wordHighlighter.js';
import { getCodeActions } from '../../../../editor/contrib/codeAction/browser/codeAction.js';
import { getWorkspaceSymbols } from '../../../contrib/search/common/search.js';
import { rename } from '../../../../editor/contrib/rename/browser/rename.js';
import { provideSignatureHelp } from '../../../../editor/contrib/parameterHints/browser/provideSignatureHelp.js';
import { provideSuggestionItems, CompletionOptions } from '../../../../editor/contrib/suggest/browser/suggest.js';
import { getDocumentFormattingEditsUntilResult, getDocumentRangeFormattingEditsUntilResult, getOnTypeFormattingEdits } from '../../../../editor/contrib/format/browser/format.js';
import { getLinks } from '../../../../editor/contrib/links/browser/getLinks.js';
import { MainContext, ExtHostContext } from '../../common/extHost.protocol.js';
import { ExtHostDiagnostics } from '../../common/extHostDiagnostics.js';
import type * as vscode from 'vscode';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { ITextModel, EndOfLineSequence } from '../../../../editor/common/model.js';
import { getColors } from '../../../../editor/contrib/colorPicker/browser/color.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { nullExtensionDescription as defaultExtension } from '../../../services/extensions/common/extensions.js';
import { provideSelectionRanges } from '../../../../editor/contrib/smartSelect/browser/smartSelect.js';
import { mock } from '../../../../base/test/common/mock.js';
import { IEditorWorkerService } from '../../../../editor/common/services/editorWorker.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { NullApiDeprecationService } from '../../common/extHostApiDeprecationService.js';
import { Progress } from '../../../../platform/progress/common/progress.js';
import { IExtHostFileSystemInfo } from '../../common/extHostFileSystemInfo.js';
import { URITransformerService } from '../../common/extHostUriTransformerService.js';
import { OutlineModel } from '../../../../editor/contrib/documentSymbols/browser/outlineModel.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { LanguageFeaturesService } from '../../../../editor/common/services/languageFeaturesService.js';
import { CodeActionTriggerSource } from '../../../../editor/contrib/codeAction/common/types.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IExtHostTelemetry } from '../../common/extHostTelemetry.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';

suite('ExtHostLanguageFeatures', function () {

	const defaultSelector = { scheme: 'far' };
	let model: ITextModel;
	let extHost: ExtHostLanguageFeatures;
	let mainThread: MainThreadLanguageFeatures;
	const disposables = new DisposableStore();
	let rpcProtocol: TestRPCProtocol;
	let languageFeaturesService: ILanguageFeaturesService;
	let originalErrorHandler: (e: any) => any;
	let instantiationService: TestInstantiationService;

	setup(() => {

		model = createTextModel(
			[
				'This is the first line',
				'This is the second line',
				'This is the third line',
			].join('\n'),
			undefined,
			undefined,
			URI.parse('far://testing/file.a'));

		rpcProtocol = new TestRPCProtocol();

		languageFeaturesService = new LanguageFeaturesService();

		// Use IInstantiationService to get typechecking when instantiating
		let inst: IInstantiationService;
		{
			instantiationService = new TestInstantiationService();
			instantiationService.stub(IMarkerService, MarkerService);
			instantiationService.set(ILanguageFeaturesService, languageFeaturesService);
			instantiationService.set(IUriIdentityService, new class extends mock<IUriIdentityService>() {
				override asCanonicalUri(uri: URI): URI {
					return uri;
				}
			});
			inst = instantiationService;
		}

		originalErrorHandler = errorHandler.getUnexpectedErrorHandler();
		setUnexpectedErrorHandler(() => { });

		const extHostDocumentsAndEditors = new ExtHostDocumentsAndEditors(rpcProtocol, new NullLogService());
		extHostDocumentsAndEditors.$acceptDocumentsAndEditorsDelta({
			addedDocuments: [{
				isDirty: false,
				versionId: model.getVersionId(),
				languageId: model.getLanguageId(),
				uri: model.uri,
				lines: model.getValue().split(model.getEOL()),
				EOL: model.getEOL(),
				encoding: 'utf8'
			}]
		});
		const extHostDocuments = new ExtHostDocuments(rpcProtocol, extHostDocumentsAndEditors);
		rpcProtocol.set(ExtHostContext.ExtHostDocuments, extHostDocuments);

		const commands = new ExtHostCommands(rpcProtocol, new NullLogService(), new class extends mock<IExtHostTelemetry>() {
			override onExtensionError(): boolean {
				return true;
			}
		});
		rpcProtocol.set(ExtHostContext.ExtHostCommands, commands);
		rpcProtocol.set(MainContext.MainThreadCommands, disposables.add(inst.createInstance(MainThreadCommands, rpcProtocol)));

		const diagnostics = new ExtHostDiagnostics(rpcProtocol, new NullLogService(), new class extends mock<IExtHostFileSystemInfo>() { }, extHostDocumentsAndEditors);
		rpcProtocol.set(ExtHostContext.ExtHostDiagnostics, diagnostics);

		extHost = new ExtHostLanguageFeatures(rpcProtocol, new URITransformerService(null), extHostDocuments, commands, diagnostics, new NullLogService(), NullApiDeprecationService, new class extends mock<IExtHostTelemetry>() {
			override onExtensionError(): boolean {
				return true;
			}
		});
		rpcProtocol.set(ExtHostContext.ExtHostLanguageFeatures, extHost);

		mainThread = rpcProtocol.set(MainContext.MainThreadLanguageFeatures, disposables.add(inst.createInstance(MainThreadLanguageFeatures, rpcProtocol)));
	});

	teardown(() => {
		disposables.clear();

		setUnexpectedErrorHandler(originalErrorHandler);
		model.dispose();
		mainThread.dispose();
		instantiationService.dispose();

		return rpcProtocol.sync();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	// --- outline

	test('DocumentSymbols, register/deregister', async () => {
		assert.strictEqual(languageFeaturesService.documentSymbolProvider.all(model).length, 0);
		const d1 = extHost.registerDocumentSymbolProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentSymbolProvider {
			provideDocumentSymbols() {
				return <vscode.SymbolInformation[]>[];
			}
		});

		await rpcProtocol.sync();
		assert.strictEqual(languageFeaturesService.documentSymbolProvider.all(model).length, 1);
		d1.dispose();
		return rpcProtocol.sync();

	});

	test('DocumentSymbols, evil provider', async () => {
		disposables.add(extHost.registerDocumentSymbolProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentSymbolProvider {
			provideDocumentSymbols(): any {
				throw new Error('evil document symbol provider');
			}
		}));
		disposables.add(extHost.registerDocumentSymbolProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentSymbolProvider {
			provideDocumentSymbols(): any {
				return [new types.SymbolInformation('test', types.SymbolKind.Field, new types.Range(0, 0, 0, 0))];
			}
		}));

		await rpcProtocol.sync();
		const value = (await OutlineModel.create(languageFeaturesService.documentSymbolProvider, model, CancellationToken.None)).asListOfDocumentSymbols();
		assert.strictEqual(value.length, 1);
	});

	test('DocumentSymbols, data conversion', async () => {
		disposables.add(extHost.registerDocumentSymbolProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentSymbolProvider {
			provideDocumentSymbols(): any {
				return [new types.SymbolInformation('test', types.SymbolKind.Field, new types.Range(0, 0, 0, 0))];
			}
		}));

		await rpcProtocol.sync();
		const value = (await OutlineModel.create(languageFeaturesService.documentSymbolProvider, model, CancellationToken.None)).asListOfDocumentSymbols();
		assert.strictEqual(value.length, 1);
		const entry = value[0];
		assert.strictEqual(entry.name, 'test');
		assert.deepStrictEqual(entry.range, { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 });
	});

	test('Quick Outline uses a not ideal sorting, #138502', async function () {
		const symbols = [
			{ name: 'containers', range: { startLineNumber: 1, startColumn: 1, endLineNumber: 4, endColumn: 26 } },
			{ name: 'container 0', range: { startLineNumber: 2, startColumn: 5, endLineNumber: 5, endColumn: 1 } },
			{ name: 'name', range: { startLineNumber: 2, startColumn: 5, endLineNumber: 2, endColumn: 16 } },
			{ name: 'ports', range: { startLineNumber: 3, startColumn: 5, endLineNumber: 5, endColumn: 1 } },
			{ name: 'ports 0', range: { startLineNumber: 4, startColumn: 9, endLineNumber: 4, endColumn: 26 } },
			{ name: 'containerPort', range: { startLineNumber: 4, startColumn: 9, endLineNumber: 4, endColumn: 26 } }
		];

		disposables.add(extHost.registerDocumentSymbolProvider(defaultExtension, defaultSelector, {
			provideDocumentSymbols: (doc, token): any => {
				return symbols.map(s => {
					return new types.SymbolInformation(
						s.name,
						types.SymbolKind.Object,
						new types.Range(s.range.startLineNumber - 1, s.range.startColumn - 1, s.range.endLineNumber - 1, s.range.endColumn - 1)
					);
				});
			}
		}));

		await rpcProtocol.sync();

		const value = (await OutlineModel.create(languageFeaturesService.documentSymbolProvider, model, CancellationToken.None)).asListOfDocumentSymbols();

		assert.strictEqual(value.length, 6);
		assert.deepStrictEqual(value.map(s => s.name), ['containers', 'container 0', 'name', 'ports', 'ports 0', 'containerPort']);
	});

	// --- code lens

	test('CodeLens, evil provider', async () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			disposables.add(extHost.registerCodeLensProvider(defaultExtension, defaultSelector, new class implements vscode.CodeLensProvider {
				provideCodeLenses(): any {
					throw new Error('evil');
				}
			}));
			disposables.add(extHost.registerCodeLensProvider(defaultExtension, defaultSelector, new class implements vscode.CodeLensProvider {
				provideCodeLenses() {
					return [new types.CodeLens(new types.Range(0, 0, 0, 0))];
				}
			}));

			await rpcProtocol.sync();
			const value = await getCodeLensModel(languageFeaturesService.codeLensProvider, model, CancellationToken.None);
			assert.strictEqual(value.lenses.length, 1);
			value.dispose();
		});
	});

	test('CodeLens, do not resolve a resolved lens', async () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			disposables.add(extHost.registerCodeLensProvider(defaultExtension, defaultSelector, new class implements vscode.CodeLensProvider {
				provideCodeLenses(): any {
					return [new types.CodeLens(
						new types.Range(0, 0, 0, 0),
						{ command: 'id', title: 'Title' })];
				}
				resolveCodeLens(): any {
					assert.ok(false, 'do not resolve');
				}
			}));

			await rpcProtocol.sync();
			const value = await getCodeLensModel(languageFeaturesService.codeLensProvider, model, CancellationToken.None);
			assert.strictEqual(value.lenses.length, 1);
			const [data] = value.lenses;
			const symbol = await Promise.resolve(data.provider.resolveCodeLens!(model, data.symbol, CancellationToken.None));
			assert.strictEqual(symbol!.command!.id, 'id');
			assert.strictEqual(symbol!.command!.title, 'Title');
			value.dispose();
		});
	});

	test('CodeLens, missing command', async () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			disposables.add(extHost.registerCodeLensProvider(defaultExtension, defaultSelector, new class implements vscode.CodeLensProvider {
				provideCodeLenses() {
					return [new types.CodeLens(new types.Range(0, 0, 0, 0))];
				}
			}));

			await rpcProtocol.sync();
			const value = await getCodeLensModel(languageFeaturesService.codeLensProvider, model, CancellationToken.None);
			assert.strictEqual(value.lenses.length, 1);
			const [data] = value.lenses;
			const symbol = await Promise.resolve(data.provider.resolveCodeLens!(model, data.symbol, CancellationToken.None));
			assert.strictEqual(symbol, undefined);
			value.dispose();
		});
	});

	// --- definition

	test('Definition, data conversion', async () => {

		disposables.add(extHost.registerDefinitionProvider(defaultExtension, defaultSelector, new class implements vscode.DefinitionProvider {
			provideDefinition(): any {
				return [new types.Location(model.uri, new types.Range(1, 2, 3, 4))];
			}
		}));

		await rpcProtocol.sync();
		const value = await getDefinitionsAtPosition(languageFeaturesService.definitionProvider, model, new EditorPosition(1, 1), false, CancellationToken.None);
		assert.strictEqual(value.length, 1);
		const [entry] = value;
		assert.deepStrictEqual(entry.range, { startLineNumber: 2, startColumn: 3, endLineNumber: 4, endColumn: 5 });
		assert.strictEqual(entry.uri.toString(), model.uri.toString());
	});

	test('Definition, one or many', async () => {

		disposables.add(extHost.registerDefinitionProvider(defaultExtension, defaultSelector, new class implements vscode.DefinitionProvider {
			provideDefinition(): any {
				return [new types.Location(model.uri, new types.Range(1, 1, 1, 1))];
			}
		}));
		disposables.add(extHost.registerDefinitionProvider(defaultExtension, defaultSelector, new class implements vscode.DefinitionProvider {
			provideDefinition(): any {
				return new types.Location(model.uri, new types.Range(2, 1, 1, 1));
			}
		}));

		await rpcProtocol.sync();
		const value = await getDefinitionsAtPosition(languageFeaturesService.definitionProvider, model, new EditorPosition(1, 1), false, CancellationToken.None);
		assert.strictEqual(value.length, 2);
	});

	test('Definition, registration order', async () => {

		disposables.add(extHost.registerDefinitionProvider(defaultExtension, defaultSelector, new class implements vscode.DefinitionProvider {
			provideDefinition(): any {
				return [new types.Location(URI.parse('far://first'), new types.Range(2, 3, 4, 5))];
			}
		}));

		disposables.add(extHost.registerDefinitionProvider(defaultExtension, defaultSelector, new class implements vscode.DefinitionProvider {
			provideDefinition(): any {
				return new types.Location(URI.parse('far://second'), new types.Range(1, 2, 3, 4));
			}
		}));

		await rpcProtocol.sync();
		const value = await getDefinitionsAtPosition(languageFeaturesService.definitionProvider, model, new EditorPosition(1, 1), false, CancellationToken.None);
		assert.strictEqual(value.length, 2);
		// let [first, second] = value;
		assert.strictEqual(value[0].uri.authority, 'second');
		assert.strictEqual(value[1].uri.authority, 'first');
	});

	test('Definition, evil provider', async () => {

		disposables.add(extHost.registerDefinitionProvider(defaultExtension, defaultSelector, new class implements vscode.DefinitionProvider {
			provideDefinition(): any {
				throw new Error('evil provider');
			}
		}));
		disposables.add(extHost.registerDefinitionProvider(defaultExtension, defaultSelector, new class implements vscode.DefinitionProvider {
			provideDefinition(): any {
				return new types.Location(model.uri, new types.Range(1, 1, 1, 1));
			}
		}));

		await rpcProtocol.sync();
		const value = await getDefinitionsAtPosition(languageFeaturesService.definitionProvider, model, new EditorPosition(1, 1), false, CancellationToken.None);
		assert.strictEqual(value.length, 1);
	});

	// -- declaration

	test('Declaration, data conversion', async () => {

		disposables.add(extHost.registerDeclarationProvider(defaultExtension, defaultSelector, new class implements vscode.DeclarationProvider {
			provideDeclaration(): any {
				return [new types.Location(model.uri, new types.Range(1, 2, 3, 4))];
			}
		}));

		await rpcProtocol.sync();
		const value = await getDeclarationsAtPosition(languageFeaturesService.declarationProvider, model, new EditorPosition(1, 1), false, CancellationToken.None);
		assert.strictEqual(value.length, 1);
		const [entry] = value;
		assert.deepStrictEqual(entry.range, { startLineNumber: 2, startColumn: 3, endLineNumber: 4, endColumn: 5 });
		assert.strictEqual(entry.uri.toString(), model.uri.toString());
	});

	// --- implementation

	test('Implementation, data conversion', async () => {

		disposables.add(extHost.registerImplementationProvider(defaultExtension, defaultSelector, new class implements vscode.ImplementationProvider {
			provideImplementation(): any {
				return [new types.Location(model.uri, new types.Range(1, 2, 3, 4))];
			}
		}));

		await rpcProtocol.sync();
		const value = await getImplementationsAtPosition(languageFeaturesService.implementationProvider, model, new EditorPosition(1, 1), false, CancellationToken.None);
		assert.strictEqual(value.length, 1);
		const [entry] = value;
		assert.deepStrictEqual(entry.range, { startLineNumber: 2, startColumn: 3, endLineNumber: 4, endColumn: 5 });
		assert.strictEqual(entry.uri.toString(), model.uri.toString());
	});

	// --- type definition

	test('Type Definition, data conversion', async () => {

		disposables.add(extHost.registerTypeDefinitionProvider(defaultExtension, defaultSelector, new class implements vscode.TypeDefinitionProvider {
			provideTypeDefinition(): any {
				return [new types.Location(model.uri, new types.Range(1, 2, 3, 4))];
			}
		}));

		await rpcProtocol.sync();
		const value = await getTypeDefinitionsAtPosition(languageFeaturesService.typeDefinitionProvider, model, new EditorPosition(1, 1), false, CancellationToken.None);
		assert.strictEqual(value.length, 1);
		const [entry] = value;
		assert.deepStrictEqual(entry.range, { startLineNumber: 2, startColumn: 3, endLineNumber: 4, endColumn: 5 });
		assert.strictEqual(entry.uri.toString(), model.uri.toString());
	});

	// --- extra info

	test('HoverProvider, word range at pos', async () => {

		disposables.add(extHost.registerHoverProvider(defaultExtension, defaultSelector, new class implements vscode.HoverProvider {
			provideHover(): any {
				return new types.Hover('Hello');
			}
		}));

		await rpcProtocol.sync();
		const hovers = await getHoversPromise(languageFeaturesService.hoverProvider, model, new EditorPosition(1, 1), CancellationToken.None);
		assert.strictEqual(hovers.length, 1);
		const [entry] = hovers;
		assert.deepStrictEqual(entry.range, { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 5 });
	});


	test('HoverProvider, given range', async () => {

		disposables.add(extHost.registerHoverProvider(defaultExtension, defaultSelector, new class implements vscode.HoverProvider {
			provideHover(): any {
				return new types.Hover('Hello', new types.Range(3, 0, 8, 7));
			}
		}));

		await rpcProtocol.sync();
		const hovers = await getHoversPromise(languageFeaturesService.hoverProvider, model, new EditorPosition(1, 1), CancellationToken.None);
		assert.strictEqual(hovers.length, 1);
		const [entry] = hovers;
		assert.deepStrictEqual(entry.range, { startLineNumber: 4, startColumn: 1, endLineNumber: 9, endColumn: 8 });
	});


	test('HoverProvider, registration order', async () => {
		disposables.add(extHost.registerHoverProvider(defaultExtension, defaultSelector, new class implements vscode.HoverProvider {
			provideHover(): any {
				return new types.Hover('registered first');
			}
		}));


		disposables.add(extHost.registerHoverProvider(defaultExtension, defaultSelector, new class implements vscode.HoverProvider {
			provideHover(): any {
				return new types.Hover('registered second');
			}
		}));

		await rpcProtocol.sync();
		const value = await getHoversPromise(languageFeaturesService.hoverProvider, model, new EditorPosition(1, 1), CancellationToken.None);
		assert.strictEqual(value.length, 2);
		const [first, second] = value;
		assert.strictEqual(first.contents[0].value, 'registered second');
		assert.strictEqual(second.contents[0].value, 'registered first');
	});


	test('HoverProvider, evil provider', async () => {

		disposables.add(extHost.registerHoverProvider(defaultExtension, defaultSelector, new class implements vscode.HoverProvider {
			provideHover(): any {
				throw new Error('evil');
			}
		}));
		disposables.add(extHost.registerHoverProvider(defaultExtension, defaultSelector, new class implements vscode.HoverProvider {
			provideHover(): any {
				return new types.Hover('Hello');
			}
		}));

		await rpcProtocol.sync();
		const hovers = await getHoversPromise(languageFeaturesService.hoverProvider, model, new EditorPosition(1, 1), CancellationToken.None);
		assert.strictEqual(hovers.length, 1);
	});

	// --- occurrences

	test('Occurrences, data conversion', async () => {

		disposables.add(extHost.registerDocumentHighlightProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentHighlightProvider {
			provideDocumentHighlights(): any {
				return [new types.DocumentHighlight(new types.Range(0, 0, 0, 4))];
			}
		}));

		await rpcProtocol.sync();
		const value = (await getOccurrencesAtPosition(languageFeaturesService.documentHighlightProvider, model, new EditorPosition(1, 2), CancellationToken.None))!;
		assert.strictEqual(value.size, 1);
		const [entry] = Array.from(value.values())[0];
		assert.deepStrictEqual(entry.range, { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 5 });
		assert.strictEqual(entry.kind, languages.DocumentHighlightKind.Text);
	});

	test('Occurrences, order 1/2', async () => {

		disposables.add(extHost.registerDocumentHighlightProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentHighlightProvider {
			provideDocumentHighlights(): any {
				return undefined;
			}
		}));
		disposables.add(extHost.registerDocumentHighlightProvider(defaultExtension, '*', new class implements vscode.DocumentHighlightProvider {
			provideDocumentHighlights(): any {
				return [new types.DocumentHighlight(new types.Range(0, 0, 0, 4))];
			}
		}));

		await rpcProtocol.sync();
		const value = (await getOccurrencesAtPosition(languageFeaturesService.documentHighlightProvider, model, new EditorPosition(1, 2), CancellationToken.None))!;
		assert.strictEqual(value.size, 1);
		const [entry] = Array.from(value.values())[0];
		assert.deepStrictEqual(entry.range, { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 5 });
		assert.strictEqual(entry.kind, languages.DocumentHighlightKind.Text);
	});

	test('Occurrences, order 2/2', async () => {

		disposables.add(extHost.registerDocumentHighlightProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentHighlightProvider {
			provideDocumentHighlights(): any {
				return [new types.DocumentHighlight(new types.Range(0, 0, 0, 2))];
			}
		}));
		disposables.add(extHost.registerDocumentHighlightProvider(defaultExtension, '*', new class implements vscode.DocumentHighlightProvider {
			provideDocumentHighlights(): any {
				return [new types.DocumentHighlight(new types.Range(0, 0, 0, 4))];
			}
		}));

		await rpcProtocol.sync();
		const value = (await getOccurrencesAtPosition(languageFeaturesService.documentHighlightProvider, model, new EditorPosition(1, 2), CancellationToken.None))!;
		assert.strictEqual(value.size, 1);
		const [entry] = Array.from(value.values())[0];
		assert.deepStrictEqual(entry.range, { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 3 });
		assert.strictEqual(entry.kind, languages.DocumentHighlightKind.Text);
	});

	test('Occurrences, evil provider', async () => {

		disposables.add(extHost.registerDocumentHighlightProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentHighlightProvider {
			provideDocumentHighlights(): any {
				throw new Error('evil');
			}
		}));

		disposables.add(extHost.registerDocumentHighlightProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentHighlightProvider {
			provideDocumentHighlights(): any {
				return [new types.DocumentHighlight(new types.Range(0, 0, 0, 4))];
			}
		}));

		await rpcProtocol.sync();
		const value = await getOccurrencesAtPosition(languageFeaturesService.documentHighlightProvider, model, new EditorPosition(1, 2), CancellationToken.None);
		assert.strictEqual(value!.size, 1);
	});

	// --- references

	test('References, registration order', async () => {

		disposables.add(extHost.registerReferenceProvider(defaultExtension, defaultSelector, new class implements vscode.ReferenceProvider {
			provideReferences(): any {
				return [new types.Location(URI.parse('far://register/first'), new types.Range(0, 0, 0, 0))];
			}
		}));

		disposables.add(extHost.registerReferenceProvider(defaultExtension, defaultSelector, new class implements vscode.ReferenceProvider {
			provideReferences(): any {
				return [new types.Location(URI.parse('far://register/second'), new types.Range(0, 0, 0, 0))];
			}
		}));

		await rpcProtocol.sync();
		const value = await getReferencesAtPosition(languageFeaturesService.referenceProvider, model, new EditorPosition(1, 2), false, false, CancellationToken.None);
		assert.strictEqual(value.length, 2);
		const [first, second] = value;
		assert.strictEqual(first.uri.path, '/second');
		assert.strictEqual(second.uri.path, '/first');
	});

	test('References, data conversion', async () => {

		disposables.add(extHost.registerReferenceProvider(defaultExtension, defaultSelector, new class implements vscode.ReferenceProvider {
			provideReferences(): any {
				return [new types.Location(model.uri, new types.Position(0, 0))];
			}
		}));

		await rpcProtocol.sync();
		const value = await getReferencesAtPosition(languageFeaturesService.referenceProvider, model, new EditorPosition(1, 2), false, false, CancellationToken.None);
		assert.strictEqual(value.length, 1);
		const [item] = value;
		assert.deepStrictEqual(item.range, { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 });
		assert.strictEqual(item.uri.toString(), model.uri.toString());
	});

	test('References, evil provider', async () => {

		disposables.add(extHost.registerReferenceProvider(defaultExtension, defaultSelector, new class implements vscode.ReferenceProvider {
			provideReferences(): any {
				throw new Error('evil');
			}
		}));
		disposables.add(extHost.registerReferenceProvider(defaultExtension, defaultSelector, new class implements vscode.ReferenceProvider {
			provideReferences(): any {
				return [new types.Location(model.uri, new types.Range(0, 0, 0, 0))];
			}
		}));

		await rpcProtocol.sync();
		const value = await getReferencesAtPosition(languageFeaturesService.referenceProvider, model, new EditorPosition(1, 2), false, false, CancellationToken.None);
		assert.strictEqual(value.length, 1);
	});

	// --- quick fix

	test('Quick Fix, command data conversion', async () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			disposables.add(extHost.registerCodeActionProvider(defaultExtension, defaultSelector, {
				provideCodeActions(): vscode.Command[] {
					return [
						{ command: 'test1', title: 'Testing1' },
						{ command: 'test2', title: 'Testing2' }
					];
				}
			}));

			await rpcProtocol.sync();
			const value = await getCodeActions(languageFeaturesService.codeActionProvider, model, model.getFullModelRange(), { type: languages.CodeActionTriggerType.Invoke, triggerAction: CodeActionTriggerSource.QuickFix }, Progress.None, CancellationToken.None);
			const { validActions: actions } = value;
			assert.strictEqual(actions.length, 2);
			const [first, second] = actions;
			assert.strictEqual(first.action.title, 'Testing1');
			assert.strictEqual(first.action.command!.id, 'test1');
			assert.strictEqual(second.action.title, 'Testing2');
			assert.strictEqual(second.action.command!.id, 'test2');
			value.dispose();
		});
	});

	test('Quick Fix, code action data conversion', async () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			disposables.add(extHost.registerCodeActionProvider(defaultExtension, defaultSelector, {
				provideCodeActions(): vscode.CodeAction[] {
					return [
						{
							title: 'Testing1',
							command: { title: 'Testing1Command', command: 'test1' },
							kind: types.CodeActionKind.Empty.append('test.scope')
						}
					];
				}
			}));

			await rpcProtocol.sync();
			const value = await getCodeActions(languageFeaturesService.codeActionProvider, model, model.getFullModelRange(), { type: languages.CodeActionTriggerType.Invoke, triggerAction: CodeActionTriggerSource.Default }, Progress.None, CancellationToken.None);
			const { validActions: actions } = value;
			assert.strictEqual(actions.length, 1);
			const [first] = actions;
			assert.strictEqual(first.action.title, 'Testing1');
			assert.strictEqual(first.action.command!.title, 'Testing1Command');
			assert.strictEqual(first.action.command!.id, 'test1');
			assert.strictEqual(first.action.kind, 'test.scope');
			value.dispose();
		});
	});


	test('Cannot read property \'id\' of undefined, #29469', async () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			disposables.add(extHost.registerCodeActionProvider(defaultExtension, defaultSelector, new class implements vscode.CodeActionProvider {
				provideCodeActions(): any {
					return [
						undefined,
						null,
						{ command: 'test', title: 'Testing' }
					];
				}
			}));

			await rpcProtocol.sync();
			const value = await getCodeActions(languageFeaturesService.codeActionProvider, model, model.getFullModelRange(), { type: languages.CodeActionTriggerType.Invoke, triggerAction: CodeActionTriggerSource.Default }, Progress.None, CancellationToken.None);
			const { validActions: actions } = value;
			assert.strictEqual(actions.length, 1);
			value.dispose();
		});
	});

	test('Quick Fix, evil provider', async () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			disposables.add(extHost.registerCodeActionProvider(defaultExtension, defaultSelector, new class implements vscode.CodeActionProvider {
				provideCodeActions(): any {
					throw new Error('evil');
				}
			}));
			disposables.add(extHost.registerCodeActionProvider(defaultExtension, defaultSelector, new class implements vscode.CodeActionProvider {
				provideCodeActions(): any {
					return [{ command: 'test', title: 'Testing' }];
				}
			}));

			await rpcProtocol.sync();
			const value = await getCodeActions(languageFeaturesService.codeActionProvider, model, model.getFullModelRange(), { type: languages.CodeActionTriggerType.Invoke, triggerAction: CodeActionTriggerSource.QuickFix }, Progress.None, CancellationToken.None);
			const { validActions: actions } = value;
			assert.strictEqual(actions.length, 1);
			value.dispose();
		});
	});

	// --- navigate types

	test('Navigate types, evil provider', async () => {

		disposables.add(extHost.registerWorkspaceSymbolProvider(defaultExtension, new class implements vscode.WorkspaceSymbolProvider {
			provideWorkspaceSymbols(): any {
				throw new Error('evil');
			}
		}));

		disposables.add(extHost.registerWorkspaceSymbolProvider(defaultExtension, new class implements vscode.WorkspaceSymbolProvider {
			provideWorkspaceSymbols(): any {
				return [new types.SymbolInformation('testing', types.SymbolKind.Array, new types.Range(0, 0, 1, 1))];
			}
		}));

		await rpcProtocol.sync();
		const value = await getWorkspaceSymbols('');
		assert.strictEqual(value.length, 1);
		const [first] = value;
		assert.strictEqual(first.symbol.name, 'testing');
	});

	test('Navigate types, de-duplicate results', async () => {
		const uri = URI.from({ scheme: 'foo', path: '/some/path' });
		disposables.add(extHost.registerWorkspaceSymbolProvider(defaultExtension, new class implements vscode.WorkspaceSymbolProvider {
			provideWorkspaceSymbols(): any {
				return [new types.SymbolInformation('ONE', types.SymbolKind.Array, undefined, new types.Location(uri, new types.Range(0, 0, 1, 1)))];
			}
		}));

		disposables.add(extHost.registerWorkspaceSymbolProvider(defaultExtension, new class implements vscode.WorkspaceSymbolProvider {
			provideWorkspaceSymbols(): any {
				return [new types.SymbolInformation('ONE', types.SymbolKind.Array, undefined, new types.Location(uri, new types.Range(0, 0, 1, 1)))]; // get de-duped
			}
		}));

		disposables.add(extHost.registerWorkspaceSymbolProvider(defaultExtension, new class implements vscode.WorkspaceSymbolProvider {
			provideWorkspaceSymbols(): any {
				return [new types.SymbolInformation('ONE', types.SymbolKind.Array, undefined, new types.Location(uri, undefined!))]; // NO dedupe because of resolve
			}
			resolveWorkspaceSymbol(a: vscode.SymbolInformation) {
				return a;
			}
		}));

		disposables.add(extHost.registerWorkspaceSymbolProvider(defaultExtension, new class implements vscode.WorkspaceSymbolProvider {
			provideWorkspaceSymbols(): any {
				return [new types.SymbolInformation('ONE', types.SymbolKind.Struct, undefined, new types.Location(uri, new types.Range(0, 0, 1, 1)))]; // NO dedupe because of kind
			}
		}));

		await rpcProtocol.sync();
		const value = await getWorkspaceSymbols('');
		assert.strictEqual(value.length, 3);
	});

	// --- rename

	test('Rename, evil provider 0/2', async () => {

		disposables.add(extHost.registerRenameProvider(defaultExtension, defaultSelector, new class implements vscode.RenameProvider {
			provideRenameEdits(): any {
				throw new class Foo { };
			}
		}));

		await rpcProtocol.sync();
		try {
			await rename(languageFeaturesService.renameProvider, model, new EditorPosition(1, 1), 'newName');
			throw Error();
		}
		catch (err) {
			// expected
		}
	});

	test('Rename, evil provider 1/2', async () => {

		disposables.add(extHost.registerRenameProvider(defaultExtension, defaultSelector, new class implements vscode.RenameProvider {
			provideRenameEdits(): any {
				throw Error('evil');
			}
		}));

		await rpcProtocol.sync();
		const value = await rename(languageFeaturesService.renameProvider, model, new EditorPosition(1, 1), 'newName');
		assert.strictEqual(value.rejectReason, 'evil');
	});

	test('Rename, evil provider 2/2', async () => {

		disposables.add(extHost.registerRenameProvider(defaultExtension, '*', new class implements vscode.RenameProvider {
			provideRenameEdits(): any {
				throw Error('evil');
			}
		}));

		disposables.add(extHost.registerRenameProvider(defaultExtension, defaultSelector, new class implements vscode.RenameProvider {
			provideRenameEdits(): any {
				const edit = new types.WorkspaceEdit();
				edit.replace(model.uri, new types.Range(0, 0, 0, 0), 'testing');
				return edit;
			}
		}));

		await rpcProtocol.sync();
		const value = await rename(languageFeaturesService.renameProvider, model, new EditorPosition(1, 1), 'newName');
		assert.strictEqual(value.edits.length, 1);
	});

	test('Rename, ordering', async () => {

		disposables.add(extHost.registerRenameProvider(defaultExtension, '*', new class implements vscode.RenameProvider {
			provideRenameEdits(): any {
				const edit = new types.WorkspaceEdit();
				edit.replace(model.uri, new types.Range(0, 0, 0, 0), 'testing');
				edit.replace(model.uri, new types.Range(1, 0, 1, 0), 'testing');
				return edit;
			}
		}));

		disposables.add(extHost.registerRenameProvider(defaultExtension, defaultSelector, new class implements vscode.RenameProvider {
			provideRenameEdits(): any {
				return;
			}
		}));

		await rpcProtocol.sync();
		const value = await rename(languageFeaturesService.renameProvider, model, new EditorPosition(1, 1), 'newName');
		// least relevant rename provider
		assert.strictEqual(value.edits.length, 2);
	});

	test('Multiple RenameProviders don\'t respect all possible PrepareRename handlers 1/2, #98352', async function () {

		const called = [false, false, false, false];

		disposables.add(extHost.registerRenameProvider(defaultExtension, defaultSelector, new class implements vscode.RenameProvider {
			prepareRename(document: vscode.TextDocument, position: vscode.Position,): vscode.ProviderResult<vscode.Range> {
				called[0] = true;
				const range = document.getWordRangeAtPosition(position);
				return range;
			}

			provideRenameEdits(): vscode.ProviderResult<vscode.WorkspaceEdit> {
				called[1] = true;
				return undefined;
			}
		}));

		disposables.add(extHost.registerRenameProvider(defaultExtension, defaultSelector, new class implements vscode.RenameProvider {
			prepareRename(document: vscode.TextDocument, position: vscode.Position,): vscode.ProviderResult<vscode.Range> {
				called[2] = true;
				return Promise.reject('Cannot rename this symbol2.');
			}
			provideRenameEdits(): vscode.ProviderResult<vscode.WorkspaceEdit> {
				called[3] = true;
				return undefined;
			}
		}));

		await rpcProtocol.sync();
		await rename(languageFeaturesService.renameProvider, model, new EditorPosition(1, 1), 'newName');

		assert.deepStrictEqual(called, [true, true, true, false]);
	});

	test('Multiple RenameProviders don\'t respect all possible PrepareRename handlers 2/2, #98352', async function () {

		const called = [false, false, false];

		disposables.add(extHost.registerRenameProvider(defaultExtension, defaultSelector, new class implements vscode.RenameProvider {
			prepareRename(document: vscode.TextDocument, position: vscode.Position,): vscode.ProviderResult<vscode.Range> {
				called[0] = true;
				const range = document.getWordRangeAtPosition(position);
				return range;
			}

			provideRenameEdits(): vscode.ProviderResult<vscode.WorkspaceEdit> {
				called[1] = true;
				return undefined;
			}
		}));

		disposables.add(extHost.registerRenameProvider(defaultExtension, defaultSelector, new class implements vscode.RenameProvider {

			provideRenameEdits(document: vscode.TextDocument, position: vscode.Position, newName: string,): vscode.ProviderResult<vscode.WorkspaceEdit> {
				called[2] = true;
				return new types.WorkspaceEdit();
			}
		}));

		await rpcProtocol.sync();
		await rename(languageFeaturesService.renameProvider, model, new EditorPosition(1, 1), 'newName');

		// first provider has NO prepare which means it is taken by default
		assert.deepStrictEqual(called, [false, false, true]);
	});

	// --- parameter hints

	test('Parameter Hints, order', async () => {

		disposables.add(extHost.registerSignatureHelpProvider(defaultExtension, defaultSelector, new class implements vscode.SignatureHelpProvider {
			provideSignatureHelp(): any {
				return undefined;
			}
		}, []));

		disposables.add(extHost.registerSignatureHelpProvider(defaultExtension, defaultSelector, new class implements vscode.SignatureHelpProvider {
			provideSignatureHelp(): vscode.SignatureHelp {
				return {
					signatures: [],
					activeParameter: 0,
					activeSignature: 0
				};
			}
		}, []));

		await rpcProtocol.sync();
		const value = await provideSignatureHelp(languageFeaturesService.signatureHelpProvider, model, new EditorPosition(1, 1), { triggerKind: languages.SignatureHelpTriggerKind.Invoke, isRetrigger: false }, CancellationToken.None);
		assert.ok(value);
	});

	test('Parameter Hints, evil provider', async () => {

		disposables.add(extHost.registerSignatureHelpProvider(defaultExtension, defaultSelector, new class implements vscode.SignatureHelpProvider {
			provideSignatureHelp(): any {
				throw new Error('evil');
			}
		}, []));

		await rpcProtocol.sync();
		const value = await provideSignatureHelp(languageFeaturesService.signatureHelpProvider, model, new EditorPosition(1, 1), { triggerKind: languages.SignatureHelpTriggerKind.Invoke, isRetrigger: false }, CancellationToken.None);
		assert.strictEqual(value, undefined);
	});

	// --- suggestions

	test('Suggest, order 1/3', async () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			disposables.add(extHost.registerCompletionItemProvider(defaultExtension, '*', new class implements vscode.CompletionItemProvider {
				provideCompletionItems(): any {
					return [new types.CompletionItem('testing1')];
				}
			}, []));

			disposables.add(extHost.registerCompletionItemProvider(defaultExtension, defaultSelector, new class implements vscode.CompletionItemProvider {
				provideCompletionItems(): any {
					return [new types.CompletionItem('testing2')];
				}
			}, []));

			await rpcProtocol.sync();
			const value = await provideSuggestionItems(languageFeaturesService.completionProvider, model, new EditorPosition(1, 1), new CompletionOptions(undefined, new Set<languages.CompletionItemKind>().add(languages.CompletionItemKind.Snippet)));
			assert.strictEqual(value.items.length, 1);
			assert.strictEqual(value.items[0].completion.insertText, 'testing2');
			value.disposable.dispose();
		});
	});

	test('Suggest, order 2/3', async () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			disposables.add(extHost.registerCompletionItemProvider(defaultExtension, '*', new class implements vscode.CompletionItemProvider {
				provideCompletionItems(): any {
					return [new types.CompletionItem('weak-selector')]; // weaker selector but result
				}
			}, []));

			disposables.add(extHost.registerCompletionItemProvider(defaultExtension, defaultSelector, new class implements vscode.CompletionItemProvider {
				provideCompletionItems(): any {
					return []; // stronger selector but not a good result;
				}
			}, []));

			await rpcProtocol.sync();
			const value = await provideSuggestionItems(languageFeaturesService.completionProvider, model, new EditorPosition(1, 1), new CompletionOptions(undefined, new Set<languages.CompletionItemKind>().add(languages.CompletionItemKind.Snippet)));
			assert.strictEqual(value.items.length, 1);
			assert.strictEqual(value.items[0].completion.insertText, 'weak-selector');
			value.disposable.dispose();
		});
	});

	test('Suggest, order 3/3', async () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			disposables.add(extHost.registerCompletionItemProvider(defaultExtension, defaultSelector, new class implements vscode.CompletionItemProvider {
				provideCompletionItems(): any {
					return [new types.CompletionItem('strong-1')];
				}
			}, []));

			disposables.add(extHost.registerCompletionItemProvider(defaultExtension, defaultSelector, new class implements vscode.CompletionItemProvider {
				provideCompletionItems(): any {
					return [new types.CompletionItem('strong-2')];
				}
			}, []));

			await rpcProtocol.sync();
			const value = await provideSuggestionItems(languageFeaturesService.completionProvider, model, new EditorPosition(1, 1), new CompletionOptions(undefined, new Set<languages.CompletionItemKind>().add(languages.CompletionItemKind.Snippet)));
			assert.strictEqual(value.items.length, 2);
			assert.strictEqual(value.items[0].completion.insertText, 'strong-1'); // sort by label
			assert.strictEqual(value.items[1].completion.insertText, 'strong-2');
			value.disposable.dispose();
		});
	});

	test('Suggest, evil provider', async () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			disposables.add(extHost.registerCompletionItemProvider(defaultExtension, defaultSelector, new class implements vscode.CompletionItemProvider {
				provideCompletionItems(): any {
					throw new Error('evil');
				}
			}, []));

			disposables.add(extHost.registerCompletionItemProvider(defaultExtension, defaultSelector, new class implements vscode.CompletionItemProvider {
				provideCompletionItems(): any {
					return [new types.CompletionItem('testing')];
				}
			}, []));


			await rpcProtocol.sync();
			const value = await provideSuggestionItems(languageFeaturesService.completionProvider, model, new EditorPosition(1, 1), new CompletionOptions(undefined, new Set<languages.CompletionItemKind>().add(languages.CompletionItemKind.Snippet)));
			assert.strictEqual(value.items[0].container.incomplete, false);
			value.disposable.dispose();
		});
	});

	test('Suggest, CompletionList', async () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			disposables.add(extHost.registerCompletionItemProvider(defaultExtension, defaultSelector, new class implements vscode.CompletionItemProvider {
				provideCompletionItems(): any {
					// eslint-disable-next-line local/code-no-any-casts
					return new types.CompletionList([<any>new types.CompletionItem('hello')], true);
				}
			}, []));

			await rpcProtocol.sync();
			await provideSuggestionItems(languageFeaturesService.completionProvider, model, new EditorPosition(1, 1), new CompletionOptions(undefined, new Set<languages.CompletionItemKind>().add(languages.CompletionItemKind.Snippet))).then(model => {
				assert.strictEqual(model.items[0].container.incomplete, true);
				model.disposable.dispose();
			});
		});
	});

	// --- format

	const NullWorkerService = new class extends mock<IEditorWorkerService>() {
		override computeMoreMinimalEdits(resource: URI, edits: languages.TextEdit[] | null | undefined): Promise<languages.TextEdit[] | undefined> {
			return Promise.resolve(edits ?? undefined);
		}
	};

	test('Format Doc, data conversion', async () => {
		disposables.add(extHost.registerDocumentFormattingEditProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentFormattingEditProvider {
			provideDocumentFormattingEdits(): any {
				return [new types.TextEdit(new types.Range(0, 0, 0, 0), 'testing'), types.TextEdit.setEndOfLine(types.EndOfLine.LF)];
			}
		}));

		await rpcProtocol.sync();
		const value = (await getDocumentFormattingEditsUntilResult(NullWorkerService, languageFeaturesService, model, { insertSpaces: true, tabSize: 4 }, CancellationToken.None))!;
		assert.strictEqual(value.length, 2);
		const [first, second] = value;
		assert.strictEqual(first.text, 'testing');
		assert.deepStrictEqual(first.range, { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 });
		assert.strictEqual(second.eol, EndOfLineSequence.LF);
		assert.strictEqual(second.text, '');
		assert.deepStrictEqual(second.range, { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 });
	});

	test('Format Doc, evil provider', async () => {
		disposables.add(extHost.registerDocumentFormattingEditProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentFormattingEditProvider {
			provideDocumentFormattingEdits(): any {
				throw new Error('evil');
			}
		}));

		await rpcProtocol.sync();
		return getDocumentFormattingEditsUntilResult(NullWorkerService, languageFeaturesService, model, { insertSpaces: true, tabSize: 4 }, CancellationToken.None);
	});

	test('Format Doc, order', async () => {

		disposables.add(extHost.registerDocumentFormattingEditProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentFormattingEditProvider {
			provideDocumentFormattingEdits(): any {
				return undefined;
			}
		}));

		disposables.add(extHost.registerDocumentFormattingEditProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentFormattingEditProvider {
			provideDocumentFormattingEdits(): any {
				return [new types.TextEdit(new types.Range(0, 0, 0, 0), 'testing')];
			}
		}));

		disposables.add(extHost.registerDocumentFormattingEditProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentFormattingEditProvider {
			provideDocumentFormattingEdits(): any {
				return undefined;
			}
		}));

		await rpcProtocol.sync();
		const value = (await getDocumentFormattingEditsUntilResult(NullWorkerService, languageFeaturesService, model, { insertSpaces: true, tabSize: 4 }, CancellationToken.None))!;
		assert.strictEqual(value.length, 1);
		const [first] = value;
		assert.strictEqual(first.text, 'testing');
		assert.deepStrictEqual(first.range, { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 });
	});

	test('Format Range, data conversion', async () => {
		disposables.add(extHost.registerDocumentRangeFormattingEditProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentRangeFormattingEditProvider {
			provideDocumentRangeFormattingEdits(): any {
				return [new types.TextEdit(new types.Range(0, 0, 0, 0), 'testing')];
			}
		}));

		await rpcProtocol.sync();
		const value = (await getDocumentRangeFormattingEditsUntilResult(NullWorkerService, languageFeaturesService, model, new EditorRange(1, 1, 1, 1), { insertSpaces: true, tabSize: 4 }, CancellationToken.None))!;
		assert.strictEqual(value.length, 1);
		const [first] = value;
		assert.strictEqual(first.text, 'testing');
		assert.deepStrictEqual(first.range, { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 });
	});

	test('Format Range, + format_doc', async () => {
		disposables.add(extHost.registerDocumentRangeFormattingEditProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentRangeFormattingEditProvider {
			provideDocumentRangeFormattingEdits(): any {
				return [new types.TextEdit(new types.Range(0, 0, 0, 0), 'range')];
			}
		}));
		disposables.add(extHost.registerDocumentRangeFormattingEditProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentRangeFormattingEditProvider {
			provideDocumentRangeFormattingEdits(): any {
				return [new types.TextEdit(new types.Range(2, 3, 4, 5), 'range2')];
			}
		}));
		disposables.add(extHost.registerDocumentFormattingEditProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentFormattingEditProvider {
			provideDocumentFormattingEdits(): any {
				return [new types.TextEdit(new types.Range(0, 0, 1, 1), 'doc')];
			}
		}));
		await rpcProtocol.sync();
		const value = (await getDocumentRangeFormattingEditsUntilResult(NullWorkerService, languageFeaturesService, model, new EditorRange(1, 1, 1, 1), { insertSpaces: true, tabSize: 4 }, CancellationToken.None))!;
		assert.strictEqual(value.length, 1);
		const [first] = value;
		assert.strictEqual(first.text, 'range2');
		assert.strictEqual(first.range.startLineNumber, 3);
		assert.strictEqual(first.range.startColumn, 4);
		assert.strictEqual(first.range.endLineNumber, 5);
		assert.strictEqual(first.range.endColumn, 6);
	});

	test('Format Range, evil provider', async () => {
		disposables.add(extHost.registerDocumentRangeFormattingEditProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentRangeFormattingEditProvider {
			provideDocumentRangeFormattingEdits(): any {
				throw new Error('evil');
			}
		}));

		await rpcProtocol.sync();
		return getDocumentRangeFormattingEditsUntilResult(NullWorkerService, languageFeaturesService, model, new EditorRange(1, 1, 1, 1), { insertSpaces: true, tabSize: 4 }, CancellationToken.None);
	});

	test('Format on Type, data conversion', async () => {

		disposables.add(extHost.registerOnTypeFormattingEditProvider(defaultExtension, defaultSelector, new class implements vscode.OnTypeFormattingEditProvider {
			provideOnTypeFormattingEdits(): any {
				return [new types.TextEdit(new types.Range(0, 0, 0, 0), arguments[2])];
			}
		}, [';']));

		await rpcProtocol.sync();
		const value = (await getOnTypeFormattingEdits(NullWorkerService, languageFeaturesService, model, new EditorPosition(1, 1), ';', { insertSpaces: true, tabSize: 2 }, CancellationToken.None))!;
		assert.strictEqual(value.length, 1);
		const [first] = value;
		assert.strictEqual(first.text, ';');
		assert.deepStrictEqual(first.range, { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 });
	});

	test('Links, data conversion', async () => {

		disposables.add(extHost.registerDocumentLinkProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentLinkProvider {
			provideDocumentLinks() {
				const link = new types.DocumentLink(new types.Range(0, 0, 1, 1), URI.parse('foo:bar#3'));
				link.tooltip = 'tooltip';
				return [link];
			}
		}));

		await rpcProtocol.sync();
		const { links } = disposables.add(await getLinks(languageFeaturesService.linkProvider, model, CancellationToken.None));
		assert.strictEqual(links.length, 1);
		const [first] = links;
		assert.strictEqual(first.url?.toString(), 'foo:bar#3');
		assert.deepStrictEqual(first.range, { startLineNumber: 1, startColumn: 1, endLineNumber: 2, endColumn: 2 });
		assert.strictEqual(first.tooltip, 'tooltip');
	});

	test('Links, evil provider', async () => {

		disposables.add(extHost.registerDocumentLinkProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentLinkProvider {
			provideDocumentLinks() {
				return [new types.DocumentLink(new types.Range(0, 0, 1, 1), URI.parse('foo:bar#3'))];
			}
		}));

		disposables.add(extHost.registerDocumentLinkProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentLinkProvider {
			provideDocumentLinks(): any {
				throw new Error();
			}
		}));

		await rpcProtocol.sync();
		const { links } = disposables.add(await getLinks(languageFeaturesService.linkProvider, model, CancellationToken.None));
		assert.strictEqual(links.length, 1);
		const [first] = links;
		assert.strictEqual(first.url?.toString(), 'foo:bar#3');
		assert.deepStrictEqual(first.range, { startLineNumber: 1, startColumn: 1, endLineNumber: 2, endColumn: 2 });
	});

	test('Document colors, data conversion', async () => {

		disposables.add(extHost.registerColorProvider(defaultExtension, defaultSelector, new class implements vscode.DocumentColorProvider {
			provideDocumentColors(): vscode.ColorInformation[] {
				return [new types.ColorInformation(new types.Range(0, 0, 0, 20), new types.Color(0.1, 0.2, 0.3, 0.4))];
			}
			provideColorPresentations(color: vscode.Color, context: { range: vscode.Range; document: vscode.TextDocument }): vscode.ColorPresentation[] {
				return [];
			}
		}));

		await rpcProtocol.sync();
		const value = await getColors(languageFeaturesService.colorProvider, model, CancellationToken.None);
		assert.strictEqual(value.length, 1);
		const [first] = value;
		assert.deepStrictEqual(first.colorInfo.color, { red: 0.1, green: 0.2, blue: 0.3, alpha: 0.4 });
		assert.deepStrictEqual(first.colorInfo.range, { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 21 });
	});

	// -- selection ranges

	test('Selection Ranges, data conversion', async () => {
		disposables.add(extHost.registerSelectionRangeProvider(defaultExtension, defaultSelector, new class implements vscode.SelectionRangeProvider {
			provideSelectionRanges() {
				return [
					new types.SelectionRange(new types.Range(0, 10, 0, 18), new types.SelectionRange(new types.Range(0, 2, 0, 20))),
				];
			}
		}));

		await rpcProtocol.sync();

		provideSelectionRanges(languageFeaturesService.selectionRangeProvider, model, [new Position(1, 17)], { selectLeadingAndTrailingWhitespace: true, selectSubwords: true }, CancellationToken.None).then(ranges => {
			assert.strictEqual(ranges.length, 1);
			assert.ok(ranges[0].length >= 2);
		});
	});

	test('Selection Ranges, bad data', async () => {

		try {
			const _a = new types.SelectionRange(new types.Range(0, 10, 0, 18),
				new types.SelectionRange(new types.Range(0, 11, 0, 18))
			);
			assert.ok(false, String(_a));
		} catch (err) {
			assert.ok(true);
		}

	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostMessagerService.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostMessagerService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { MainThreadMessageService } from '../../browser/mainThreadMessageService.js';
import { IDialogService, IPrompt, IPromptButton } from '../../../../platform/dialogs/common/dialogs.js';
import { INotificationService, INotification, NoOpNotification, INotificationHandle, Severity, IPromptChoice, IPromptOptions, IStatusMessageOptions, INotificationSource, INotificationSourceFilter, NotificationsFilter, IStatusHandle } from '../../../../platform/notification/common/notification.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { mock } from '../../../../base/test/common/mock.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Event } from '../../../../base/common/event.js';
import { TestDialogService } from '../../../../platform/dialogs/test/common/testDialogService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { TestExtensionService } from '../../../test/common/workbenchTestServices.js';

const emptyCommandService: ICommandService = {
	_serviceBrand: undefined,
	onWillExecuteCommand: () => Disposable.None,
	onDidExecuteCommand: () => Disposable.None,
	executeCommand: (commandId: string, ...args: unknown[]): Promise<any> => {
		return Promise.resolve(undefined);
	}
};

const emptyNotificationService = new class implements INotificationService {
	declare readonly _serviceBrand: undefined;
	readonly onDidChangeFilter: Event<void> = Event.None;
	notify(...args: unknown[]): never {
		throw new Error('not implemented');
	}
	info(...args: unknown[]): never {
		throw new Error('not implemented');
	}
	warn(...args: unknown[]): never {
		throw new Error('not implemented');
	}
	error(...args: unknown[]): never {
		throw new Error('not implemented');
	}
	prompt(severity: Severity, message: string, choices: IPromptChoice[], options?: IPromptOptions): INotificationHandle {
		throw new Error('not implemented');
	}
	status(message: string | Error, options?: IStatusMessageOptions): IStatusHandle {
		return { close: () => { } };
	}
	setFilter(): void {
		throw new Error('not implemented');
	}
	getFilter(source?: INotificationSource | undefined): NotificationsFilter {
		throw new Error('not implemented');
	}
	getFilters(): INotificationSourceFilter[] {
		throw new Error('not implemented');
	}
	removeFilter(sourceId: string): void {
		throw new Error('not implemented');
	}
};

class EmptyNotificationService implements INotificationService {
	declare readonly _serviceBrand: undefined;
	filter: boolean = false;
	constructor(private withNotify: (notification: INotification) => void) {
	}

	readonly onDidChangeFilter: Event<void> = Event.None;
	notify(notification: INotification): INotificationHandle {
		this.withNotify(notification);

		return new NoOpNotification();
	}
	info(message: any): void {
		throw new Error('Method not implemented.');
	}
	warn(message: any): void {
		throw new Error('Method not implemented.');
	}
	error(message: any): void {
		throw new Error('Method not implemented.');
	}
	prompt(severity: Severity, message: string, choices: IPromptChoice[], options?: IPromptOptions): INotificationHandle {
		throw new Error('Method not implemented');
	}
	status(message: string, options?: IStatusMessageOptions): IStatusHandle {
		return { close: () => { } };
	}
	setFilter(): void {
		throw new Error('Method not implemented.');
	}
	getFilter(source?: INotificationSource | undefined): NotificationsFilter {
		throw new Error('Method not implemented.');
	}
	getFilters(): INotificationSourceFilter[] {
		throw new Error('Method not implemented.');
	}
	removeFilter(sourceId: string): void {
		throw new Error('Method not implemented.');
	}
}

suite('ExtHostMessageService', function () {

	test('propagte handle on select', async function () {

		const service = new MainThreadMessageService(null!, new EmptyNotificationService(notification => {
			assert.strictEqual(notification.actions!.primary!.length, 1);
			queueMicrotask(() => notification.actions!.primary![0].run());
		}), emptyCommandService, new TestDialogService(), new TestExtensionService());

		const handle = await service.$showMessage(1, 'h', {}, [{ handle: 42, title: 'a thing', isCloseAffordance: true }]);
		assert.strictEqual(handle, 42);

		service.dispose();
	});

	suite('modal', () => {
		test('calls dialog service', async () => {
			const service = new MainThreadMessageService(null!, emptyNotificationService, emptyCommandService, new class extends mock<IDialogService>() {
				override prompt({ type, message, buttons, cancelButton }: IPrompt<any>) {
					assert.strictEqual(type, 1);
					assert.strictEqual(message, 'h');
					assert.strictEqual(buttons!.length, 1);
					assert.strictEqual((cancelButton as IPromptButton<unknown>)!.label, 'Cancel');
					return Promise.resolve({ result: buttons![0].run({ checkboxChecked: false }) });
				}
			} as IDialogService, new TestExtensionService());

			const handle = await service.$showMessage(1, 'h', { modal: true }, [{ handle: 42, title: 'a thing', isCloseAffordance: false }]);
			assert.strictEqual(handle, 42);

			service.dispose();
		});

		test('returns undefined when cancelled', async () => {
			const service = new MainThreadMessageService(null!, emptyNotificationService, emptyCommandService, new class extends mock<IDialogService>() {
				override prompt(prompt: IPrompt<any>) {
					return Promise.resolve({ result: (prompt.cancelButton as IPromptButton<unknown>)!.run({ checkboxChecked: false }) });
				}
			} as IDialogService, new TestExtensionService());

			const handle = await service.$showMessage(1, 'h', { modal: true }, [{ handle: 42, title: 'a thing', isCloseAffordance: false }]);
			assert.strictEqual(handle, undefined);

			service.dispose();
		});

		test('hides Cancel button when not needed', async () => {
			const service = new MainThreadMessageService(null!, emptyNotificationService, emptyCommandService, new class extends mock<IDialogService>() {
				override prompt({ type, message, buttons, cancelButton }: IPrompt<any>) {
					assert.strictEqual(buttons!.length, 0);
					assert.ok(cancelButton);
					return Promise.resolve({ result: (cancelButton as IPromptButton<unknown>).run({ checkboxChecked: false }) });
				}
			} as IDialogService, new TestExtensionService());

			const handle = await service.$showMessage(1, 'h', { modal: true }, [{ handle: 42, title: 'a thing', isCloseAffordance: true }]);
			assert.strictEqual(handle, 42);

			service.dispose();
		});
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostNotebook.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostNotebook.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as vscode from 'vscode';
import { ExtHostDocumentsAndEditors } from '../../common/extHostDocumentsAndEditors.js';
import { TestRPCProtocol } from '../common/testRPCProtocol.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { mock } from '../../../../base/test/common/mock.js';
import { IModelAddedData, MainContext, MainThreadCommandsShape, MainThreadNotebookShape, NotebookCellsChangedEventDto, NotebookOutputItemDto } from '../../common/extHost.protocol.js';
import { ExtHostNotebookController } from '../../common/extHostNotebook.js';
import { ExtHostNotebookDocument } from '../../common/extHostNotebookDocument.js';
import { CellKind, CellUri, NotebookCellsChangeType } from '../../../contrib/notebook/common/notebookCommon.js';
import { URI } from '../../../../base/common/uri.js';
import { ExtHostDocuments } from '../../common/extHostDocuments.js';
import { ExtHostCommands } from '../../common/extHostCommands.js';
import { nullExtensionDescription } from '../../../services/extensions/common/extensions.js';
import { isEqual } from '../../../../base/common/resources.js';
import { Event } from '../../../../base/common/event.js';
import { ExtHostNotebookDocuments } from '../../common/extHostNotebookDocuments.js';
import { SerializableObjectWithBuffers } from '../../../services/extensions/common/proxyIdentifier.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { IExtHostTelemetry } from '../../common/extHostTelemetry.js';
import { ExtHostConsumerFileSystem } from '../../common/extHostFileSystemConsumer.js';
import { ExtHostFileSystemInfo } from '../../common/extHostFileSystemInfo.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ExtHostSearch } from '../../common/extHostSearch.js';
import { URITransformerService } from '../../common/extHostUriTransformerService.js';

suite('NotebookCell#Document', function () {
	let rpcProtocol: TestRPCProtocol;
	let notebook: ExtHostNotebookDocument;
	let extHostDocumentsAndEditors: ExtHostDocumentsAndEditors;
	let extHostDocuments: ExtHostDocuments;
	let extHostNotebooks: ExtHostNotebookController;
	let extHostNotebookDocuments: ExtHostNotebookDocuments;
	let extHostConsumerFileSystem: ExtHostConsumerFileSystem;
	let extHostSearch: ExtHostSearch;

	const notebookUri = URI.parse('test:///notebook.file');
	const disposables = new DisposableStore();

	teardown(function () {
		disposables.clear();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(async function () {
		rpcProtocol = new TestRPCProtocol();
		rpcProtocol.set(MainContext.MainThreadCommands, new class extends mock<MainThreadCommandsShape>() {
			override $registerCommand() { }
		});
		rpcProtocol.set(MainContext.MainThreadNotebook, new class extends mock<MainThreadNotebookShape>() {
			override async $registerNotebookSerializer() { }
			override async $unregisterNotebookSerializer() { }
		});
		extHostDocumentsAndEditors = new ExtHostDocumentsAndEditors(rpcProtocol, new NullLogService());
		extHostDocuments = new ExtHostDocuments(rpcProtocol, extHostDocumentsAndEditors);
		extHostConsumerFileSystem = new ExtHostConsumerFileSystem(rpcProtocol, new ExtHostFileSystemInfo());
		extHostSearch = new ExtHostSearch(rpcProtocol, new URITransformerService(null), new NullLogService());
		extHostNotebooks = new ExtHostNotebookController(rpcProtocol, new ExtHostCommands(rpcProtocol, new NullLogService(), new class extends mock<IExtHostTelemetry>() {
			override onExtensionError(): boolean {
				return true;
			}
		}), extHostDocumentsAndEditors, extHostDocuments, extHostConsumerFileSystem, extHostSearch, new NullLogService());
		extHostNotebookDocuments = new ExtHostNotebookDocuments(extHostNotebooks);

		const reg = extHostNotebooks.registerNotebookSerializer(nullExtensionDescription, 'test', new class extends mock<vscode.NotebookSerializer>() { });
		extHostNotebooks.$acceptDocumentAndEditorsDelta(new SerializableObjectWithBuffers({
			addedDocuments: [{
				uri: notebookUri,
				viewType: 'test',
				versionId: 0,
				cells: [{
					handle: 0,
					uri: CellUri.generate(notebookUri, 0),
					source: ['### Heading'],
					eol: '\n',
					language: 'markdown',
					cellKind: CellKind.Markup,
					outputs: [],
				}, {
					handle: 1,
					uri: CellUri.generate(notebookUri, 1),
					source: ['console.log("aaa")', 'console.log("bbb")'],
					eol: '\n',
					language: 'javascript',
					cellKind: CellKind.Code,
					outputs: [],
				}],
			}],
			addedEditors: [{
				documentUri: notebookUri,
				id: '_notebook_editor_0',
				selections: [{ start: 0, end: 1 }],
				visibleRanges: [],
				viewType: 'test'
			}]
		}));
		extHostNotebooks.$acceptDocumentAndEditorsDelta(new SerializableObjectWithBuffers({ newActiveEditor: '_notebook_editor_0' }));

		notebook = extHostNotebooks.notebookDocuments[0]!;

		disposables.add(reg);
		disposables.add(notebook);
		disposables.add(extHostDocuments);
	});


	test('cell document is vscode.TextDocument', async function () {

		assert.strictEqual(notebook.apiNotebook.cellCount, 2);

		const [c1, c2] = notebook.apiNotebook.getCells();
		const d1 = extHostDocuments.getDocument(c1.document.uri);

		assert.ok(d1);
		assert.strictEqual(d1.languageId, c1.document.languageId);
		assert.strictEqual(d1.version, 1);

		const d2 = extHostDocuments.getDocument(c2.document.uri);
		assert.ok(d2);
		assert.strictEqual(d2.languageId, c2.document.languageId);
		assert.strictEqual(d2.version, 1);
	});

	test('cell document goes when notebook closes', async function () {
		const cellUris: string[] = [];
		for (const cell of notebook.apiNotebook.getCells()) {
			assert.ok(extHostDocuments.getDocument(cell.document.uri));
			cellUris.push(cell.document.uri.toString());
		}

		const removedCellUris: string[] = [];
		const reg = extHostDocuments.onDidRemoveDocument(doc => {
			removedCellUris.push(doc.uri.toString());
		});

		extHostNotebooks.$acceptDocumentAndEditorsDelta(new SerializableObjectWithBuffers({ removedDocuments: [notebook.uri] }));
		reg.dispose();

		assert.strictEqual(removedCellUris.length, 2);
		assert.deepStrictEqual(removedCellUris.sort(), cellUris.sort());
	});

	test('cell document is vscode.TextDocument after changing it', async function () {

		const p = new Promise<void>((resolve, reject) => {

			disposables.add(extHostNotebookDocuments.onDidChangeNotebookDocument(e => {
				try {
					assert.strictEqual(e.contentChanges.length, 1);
					assert.strictEqual(e.contentChanges[0].addedCells.length, 2);

					const [first, second] = e.contentChanges[0].addedCells;

					const doc1 = extHostDocuments.getAllDocumentData().find(data => isEqual(data.document.uri, first.document.uri));
					assert.ok(doc1);
					assert.strictEqual(doc1?.document === first.document, true);

					const doc2 = extHostDocuments.getAllDocumentData().find(data => isEqual(data.document.uri, second.document.uri));
					assert.ok(doc2);
					assert.strictEqual(doc2?.document === second.document, true);

					resolve();

				} catch (err) {
					reject(err);
				}
			}));

		});

		extHostNotebookDocuments.$acceptModelChanged(notebookUri, new SerializableObjectWithBuffers({
			versionId: notebook.apiNotebook.version + 1,
			rawEvents: [
				{
					kind: NotebookCellsChangeType.ModelChange,
					changes: [[0, 0, [{
						handle: 2,
						uri: CellUri.generate(notebookUri, 2),
						source: ['Hello', 'World', 'Hello World!'],
						eol: '\n',
						language: 'test',
						cellKind: CellKind.Code,
						outputs: [],
					}, {
						handle: 3,
						uri: CellUri.generate(notebookUri, 3),
						source: ['Hallo', 'Welt', 'Hallo Welt!'],
						eol: '\n',
						language: 'test',
						cellKind: CellKind.Code,
						outputs: [],
					}]]]
				}
			]
		}), false);

		await p;

	});

	test('cell document stays open when notebook is still open', async function () {

		const docs: vscode.TextDocument[] = [];
		const addData: IModelAddedData[] = [];
		for (const cell of notebook.apiNotebook.getCells()) {
			const doc = extHostDocuments.getDocument(cell.document.uri);
			assert.ok(doc);
			assert.strictEqual(extHostDocuments.getDocument(cell.document.uri).isClosed, false);
			docs.push(doc);
			addData.push({
				EOL: '\n',
				isDirty: doc.isDirty,
				lines: doc.getText().split('\n'),
				languageId: doc.languageId,
				uri: doc.uri,
				versionId: doc.version,
				encoding: 'utf8'
			});
		}

		// this call happens when opening a document on the main side
		extHostDocumentsAndEditors.$acceptDocumentsAndEditorsDelta({ addedDocuments: addData });

		// this call happens when closing a document from the main side
		extHostDocumentsAndEditors.$acceptDocumentsAndEditorsDelta({ removedDocuments: docs.map(d => d.uri) });

		// notebook is still open -> cell documents stay open
		for (const cell of notebook.apiNotebook.getCells()) {
			assert.ok(extHostDocuments.getDocument(cell.document.uri));
			assert.strictEqual(extHostDocuments.getDocument(cell.document.uri).isClosed, false);
		}

		// close notebook -> docs are closed
		extHostNotebooks.$acceptDocumentAndEditorsDelta(new SerializableObjectWithBuffers({ removedDocuments: [notebook.uri] }));
		for (const cell of notebook.apiNotebook.getCells()) {
			assert.throws(() => extHostDocuments.getDocument(cell.document.uri));
		}
		for (const doc of docs) {
			assert.strictEqual(doc.isClosed, true);
		}
	});

	test('cell document goes when cell is removed', async function () {

		assert.strictEqual(notebook.apiNotebook.cellCount, 2);
		const [cell1, cell2] = notebook.apiNotebook.getCells();

		extHostNotebookDocuments.$acceptModelChanged(notebook.uri, new SerializableObjectWithBuffers({
			versionId: 2,
			rawEvents: [
				{
					kind: NotebookCellsChangeType.ModelChange,
					changes: [[0, 1, []]]
				}
			]
		}), false);

		assert.strictEqual(notebook.apiNotebook.cellCount, 1);
		assert.strictEqual(cell1.document.isClosed, true); // ref still alive!
		assert.strictEqual(cell2.document.isClosed, false);

		assert.throws(() => extHostDocuments.getDocument(cell1.document.uri));
	});

	test('cell#index', function () {

		assert.strictEqual(notebook.apiNotebook.cellCount, 2);
		const [first, second] = notebook.apiNotebook.getCells();
		assert.strictEqual(first.index, 0);
		assert.strictEqual(second.index, 1);

		// remove first cell
		extHostNotebookDocuments.$acceptModelChanged(notebook.uri, new SerializableObjectWithBuffers({
			versionId: notebook.apiNotebook.version + 1,
			rawEvents: [{
				kind: NotebookCellsChangeType.ModelChange,
				changes: [[0, 1, []]]
			}]
		}), false);

		assert.strictEqual(notebook.apiNotebook.cellCount, 1);
		assert.strictEqual(second.index, 0);

		extHostNotebookDocuments.$acceptModelChanged(notebookUri, new SerializableObjectWithBuffers({
			versionId: notebook.apiNotebook.version + 1,
			rawEvents: [{
				kind: NotebookCellsChangeType.ModelChange,
				changes: [[0, 0, [{
					handle: 2,
					uri: CellUri.generate(notebookUri, 2),
					source: ['Hello', 'World', 'Hello World!'],
					eol: '\n',
					language: 'test',
					cellKind: CellKind.Code,
					outputs: [],
				}, {
					handle: 3,
					uri: CellUri.generate(notebookUri, 3),
					source: ['Hallo', 'Welt', 'Hallo Welt!'],
					eol: '\n',
					language: 'test',
					cellKind: CellKind.Code,
					outputs: [],
				}]]]
			}]
		}), false);

		assert.strictEqual(notebook.apiNotebook.cellCount, 3);
		assert.strictEqual(second.index, 2);
	});

	test('ERR MISSING extHostDocument for notebook cell: #116711', async function () {

		const p = Event.toPromise(extHostNotebookDocuments.onDidChangeNotebookDocument);

		// DON'T call this, make sure the cell-documents have not been created yet
		// assert.strictEqual(notebook.notebookDocument.cellCount, 2);

		extHostNotebookDocuments.$acceptModelChanged(notebook.uri, new SerializableObjectWithBuffers({
			versionId: 100,
			rawEvents: [{
				kind: NotebookCellsChangeType.ModelChange,
				changes: [[0, 2, [{
					handle: 3,
					uri: CellUri.generate(notebookUri, 3),
					source: ['### Heading'],
					eol: '\n',
					language: 'markdown',
					cellKind: CellKind.Markup,
					outputs: [],
				}, {
					handle: 4,
					uri: CellUri.generate(notebookUri, 4),
					source: ['console.log("aaa")', 'console.log("bbb")'],
					eol: '\n',
					language: 'javascript',
					cellKind: CellKind.Code,
					outputs: [],
				}]]]
			}]
		}), false);

		assert.strictEqual(notebook.apiNotebook.cellCount, 2);

		const event = await p;

		assert.strictEqual(event.notebook === notebook.apiNotebook, true);
		assert.strictEqual(event.contentChanges.length, 1);
		assert.strictEqual(event.contentChanges[0].range.end - event.contentChanges[0].range.start, 2);
		assert.strictEqual(event.contentChanges[0].removedCells[0].document.isClosed, true);
		assert.strictEqual(event.contentChanges[0].removedCells[1].document.isClosed, true);
		assert.strictEqual(event.contentChanges[0].addedCells.length, 2);
		assert.strictEqual(event.contentChanges[0].addedCells[0].document.isClosed, false);
		assert.strictEqual(event.contentChanges[0].addedCells[1].document.isClosed, false);
	});


	test('Opening a notebook results in VS Code firing the event onDidChangeActiveNotebookEditor twice #118470', function () {
		let count = 0;
		disposables.add(extHostNotebooks.onDidChangeActiveNotebookEditor(() => count += 1));

		extHostNotebooks.$acceptDocumentAndEditorsDelta(new SerializableObjectWithBuffers({
			addedEditors: [{
				documentUri: notebookUri,
				id: '_notebook_editor_2',
				selections: [{ start: 0, end: 1 }],
				visibleRanges: [],
				viewType: 'test'
			}]
		}));

		extHostNotebooks.$acceptDocumentAndEditorsDelta(new SerializableObjectWithBuffers({
			newActiveEditor: '_notebook_editor_2'
		}));

		assert.strictEqual(count, 1);
	});

	test('unset active notebook editor', function () {

		const editor = extHostNotebooks.activeNotebookEditor;
		assert.ok(editor !== undefined);

		extHostNotebooks.$acceptDocumentAndEditorsDelta(new SerializableObjectWithBuffers({ newActiveEditor: undefined }));
		assert.ok(extHostNotebooks.activeNotebookEditor === editor);

		extHostNotebooks.$acceptDocumentAndEditorsDelta(new SerializableObjectWithBuffers({}));
		assert.ok(extHostNotebooks.activeNotebookEditor === editor);

		extHostNotebooks.$acceptDocumentAndEditorsDelta(new SerializableObjectWithBuffers({ newActiveEditor: null }));
		assert.ok(extHostNotebooks.activeNotebookEditor === undefined);
	});

	test('change cell language triggers onDidChange events', async function () {

		const first = notebook.apiNotebook.cellAt(0);

		assert.strictEqual(first.document.languageId, 'markdown');

		const removed = Event.toPromise(extHostDocuments.onDidRemoveDocument);
		const added = Event.toPromise(extHostDocuments.onDidAddDocument);

		extHostNotebookDocuments.$acceptModelChanged(notebook.uri, new SerializableObjectWithBuffers({
			versionId: 12, rawEvents: [{
				kind: NotebookCellsChangeType.ChangeCellLanguage,
				index: 0,
				language: 'fooLang'
			}]
		}), false);

		const removedDoc = await removed;
		const addedDoc = await added;

		assert.strictEqual(first.document.languageId, 'fooLang');
		assert.ok(removedDoc === addedDoc);
	});

	test('onDidChangeNotebook-event, cell changes', async function () {

		const p = Event.toPromise(extHostNotebookDocuments.onDidChangeNotebookDocument);

		extHostNotebookDocuments.$acceptModelChanged(notebook.uri, new SerializableObjectWithBuffers({
			versionId: 12, rawEvents: [{
				kind: NotebookCellsChangeType.ChangeCellMetadata,
				index: 0,
				metadata: { foo: 1 }
			}, {
				kind: NotebookCellsChangeType.ChangeCellMetadata,
				index: 1,
				metadata: { foo: 2 },
			}, {
				kind: NotebookCellsChangeType.Output,
				index: 1,
				outputs: [
					{
						items: [{
							valueBytes: VSBuffer.fromByteArray([0, 2, 3]),
							mime: 'text/plain'
						}],
						outputId: '1'
					}
				]
			}]
		}), false, undefined);


		const event = await p;

		assert.strictEqual(event.notebook === notebook.apiNotebook, true);
		assert.strictEqual(event.contentChanges.length, 0);
		assert.strictEqual(event.cellChanges.length, 2);

		const [first, second] = event.cellChanges;
		assert.deepStrictEqual(first.metadata, first.cell.metadata);
		assert.deepStrictEqual(first.executionSummary, undefined);
		assert.deepStrictEqual(first.outputs, undefined);
		assert.deepStrictEqual(first.document, undefined);

		assert.deepStrictEqual(second.outputs, second.cell.outputs);
		assert.deepStrictEqual(second.metadata, second.cell.metadata);
		assert.deepStrictEqual(second.executionSummary, undefined);
		assert.deepStrictEqual(second.document, undefined);
	});

	test('onDidChangeNotebook-event, notebook metadata', async function () {

		const p = Event.toPromise(extHostNotebookDocuments.onDidChangeNotebookDocument);

		extHostNotebookDocuments.$acceptModelChanged(notebook.uri, new SerializableObjectWithBuffers({ versionId: 12, rawEvents: [] }), false, { foo: 2 });

		const event = await p;

		assert.strictEqual(event.notebook === notebook.apiNotebook, true);
		assert.strictEqual(event.contentChanges.length, 0);
		assert.strictEqual(event.cellChanges.length, 0);
		assert.deepStrictEqual(event.metadata, { foo: 2 });
	});

	test('onDidChangeNotebook-event, froozen data', async function () {

		const p = Event.toPromise(extHostNotebookDocuments.onDidChangeNotebookDocument);

		extHostNotebookDocuments.$acceptModelChanged(notebook.uri, new SerializableObjectWithBuffers({ versionId: 12, rawEvents: [] }), false, { foo: 2 });

		const event = await p;

		assert.ok(Object.isFrozen(event));
		assert.ok(Object.isFrozen(event.cellChanges));
		assert.ok(Object.isFrozen(event.contentChanges));
		assert.ok(Object.isFrozen(event.notebook));
		assert.ok(!Object.isFrozen(event.metadata));
	});

	test('change cell language and onDidChangeNotebookDocument', async function () {

		const p = Event.toPromise(extHostNotebookDocuments.onDidChangeNotebookDocument);

		const first = notebook.apiNotebook.cellAt(0);
		assert.strictEqual(first.document.languageId, 'markdown');

		extHostNotebookDocuments.$acceptModelChanged(notebook.uri, new SerializableObjectWithBuffers({
			versionId: 12,
			rawEvents: [{
				kind: NotebookCellsChangeType.ChangeCellLanguage,
				index: 0,
				language: 'fooLang'
			}]
		}), false);

		const event = await p;

		assert.strictEqual(event.notebook === notebook.apiNotebook, true);
		assert.strictEqual(event.contentChanges.length, 0);
		assert.strictEqual(event.cellChanges.length, 1);

		const [cellChange] = event.cellChanges;

		assert.strictEqual(cellChange.cell === first, true);
		assert.ok(cellChange.document === first.document);
		assert.ok(cellChange.executionSummary === undefined);
		assert.ok(cellChange.metadata === undefined);
		assert.ok(cellChange.outputs === undefined);
	});

	test('change notebook cell document and onDidChangeNotebookDocument', async function () {

		const p = Event.toPromise(extHostNotebookDocuments.onDidChangeNotebookDocument);

		const first = notebook.apiNotebook.cellAt(0);

		extHostNotebookDocuments.$acceptModelChanged(notebook.uri, new SerializableObjectWithBuffers({
			versionId: 12,
			rawEvents: [{
				kind: NotebookCellsChangeType.ChangeCellContent,
				index: 0
			}]
		}), false);

		const event = await p;

		assert.strictEqual(event.notebook === notebook.apiNotebook, true);
		assert.strictEqual(event.contentChanges.length, 0);
		assert.strictEqual(event.cellChanges.length, 1);

		const [cellChange] = event.cellChanges;

		assert.strictEqual(cellChange.cell === first, true);
		assert.ok(cellChange.document === first.document);
		assert.ok(cellChange.executionSummary === undefined);
		assert.ok(cellChange.metadata === undefined);
		assert.ok(cellChange.outputs === undefined);
	});

	async function replaceOutputs(cellIndex: number, outputId: string, outputItems: NotebookOutputItemDto[]) {
		const changeEvent = Event.toPromise(extHostNotebookDocuments.onDidChangeNotebookDocument);
		extHostNotebookDocuments.$acceptModelChanged(notebook.uri, new SerializableObjectWithBuffers<NotebookCellsChangedEventDto>({
			versionId: notebook.apiNotebook.version + 1,
			rawEvents: [{
				kind: NotebookCellsChangeType.Output,
				index: cellIndex,
				outputs: [{ outputId, items: outputItems }]
			}]
		}), false);
		await changeEvent;
	}
	async function appendOutputItem(cellIndex: number, outputId: string, outputItems: NotebookOutputItemDto[]) {
		const changeEvent = Event.toPromise(extHostNotebookDocuments.onDidChangeNotebookDocument);
		extHostNotebookDocuments.$acceptModelChanged(notebook.uri, new SerializableObjectWithBuffers<NotebookCellsChangedEventDto>({
			versionId: notebook.apiNotebook.version + 1,
			rawEvents: [{
				kind: NotebookCellsChangeType.OutputItem,
				index: cellIndex,
				append: true,
				outputId,
				outputItems
			}]
		}), false);
		await changeEvent;
	}
	test('Append multiple text/plain output items', async function () {
		await replaceOutputs(1, '1', [{ mime: 'text/plain', valueBytes: VSBuffer.fromString('foo') }]);
		await appendOutputItem(1, '1', [{ mime: 'text/plain', valueBytes: VSBuffer.fromString('bar') }]);
		await appendOutputItem(1, '1', [{ mime: 'text/plain', valueBytes: VSBuffer.fromString('baz') }]);


		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs.length, 1);
		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs[0].items.length, 3);
		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs[0].items[0].mime, 'text/plain');
		assert.strictEqual(VSBuffer.wrap(notebook.apiNotebook.cellAt(1).outputs[0].items[0].data).toString(), 'foo');
		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs[0].items[1].mime, 'text/plain');
		assert.strictEqual(VSBuffer.wrap(notebook.apiNotebook.cellAt(1).outputs[0].items[1].data).toString(), 'bar');
		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs[0].items[2].mime, 'text/plain');
		assert.strictEqual(VSBuffer.wrap(notebook.apiNotebook.cellAt(1).outputs[0].items[2].data).toString(), 'baz');
	});
	test('Append multiple stdout stream output items to an output with another mime', async function () {
		await replaceOutputs(1, '1', [{ mime: 'text/plain', valueBytes: VSBuffer.fromString('foo') }]);
		await appendOutputItem(1, '1', [{ mime: 'application/vnd.code.notebook.stdout', valueBytes: VSBuffer.fromString('bar') }]);
		await appendOutputItem(1, '1', [{ mime: 'application/vnd.code.notebook.stdout', valueBytes: VSBuffer.fromString('baz') }]);

		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs.length, 1);
		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs[0].items.length, 3);
		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs[0].items[0].mime, 'text/plain');
		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs[0].items[1].mime, 'application/vnd.code.notebook.stdout');
		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs[0].items[2].mime, 'application/vnd.code.notebook.stdout');
	});
	test('Compress multiple stdout stream output items', async function () {
		await replaceOutputs(1, '1', [{ mime: 'application/vnd.code.notebook.stdout', valueBytes: VSBuffer.fromString('foo') }]);
		await appendOutputItem(1, '1', [{ mime: 'application/vnd.code.notebook.stdout', valueBytes: VSBuffer.fromString('bar') }]);
		await appendOutputItem(1, '1', [{ mime: 'application/vnd.code.notebook.stdout', valueBytes: VSBuffer.fromString('baz') }]);

		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs.length, 1);
		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs[0].items.length, 1);
		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs[0].items[0].mime, 'application/vnd.code.notebook.stdout');
		assert.strictEqual(VSBuffer.wrap(notebook.apiNotebook.cellAt(1).outputs[0].items[0].data).toString(), 'foobarbaz');
	});
	test('Compress multiple stdout stream output items (with support for terminal escape code -> \u001b[A)', async function () {
		await replaceOutputs(1, '1', [{ mime: 'application/vnd.code.notebook.stdout', valueBytes: VSBuffer.fromString('\nfoo') }]);
		await appendOutputItem(1, '1', [{ mime: 'application/vnd.code.notebook.stdout', valueBytes: VSBuffer.fromString(`${String.fromCharCode(27)}[Abar`) }]);

		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs.length, 1);
		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs[0].items.length, 1);
		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs[0].items[0].mime, 'application/vnd.code.notebook.stdout');
		assert.strictEqual(VSBuffer.wrap(notebook.apiNotebook.cellAt(1).outputs[0].items[0].data).toString(), 'bar');
	});
	test('Compress multiple stdout stream output items (with support for terminal escape code -> \r character)', async function () {
		await replaceOutputs(1, '1', [{ mime: 'application/vnd.code.notebook.stdout', valueBytes: VSBuffer.fromString('foo') }]);
		await appendOutputItem(1, '1', [{ mime: 'application/vnd.code.notebook.stdout', valueBytes: VSBuffer.fromString(`\rbar`) }]);

		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs.length, 1);
		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs[0].items.length, 1);
		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs[0].items[0].mime, 'application/vnd.code.notebook.stdout');
		assert.strictEqual(VSBuffer.wrap(notebook.apiNotebook.cellAt(1).outputs[0].items[0].data).toString(), 'bar');
	});
	test('Compress multiple stderr stream output items', async function () {
		await replaceOutputs(1, '1', [{ mime: 'application/vnd.code.notebook.stderr', valueBytes: VSBuffer.fromString('foo') }]);
		await appendOutputItem(1, '1', [{ mime: 'application/vnd.code.notebook.stderr', valueBytes: VSBuffer.fromString('bar') }]);
		await appendOutputItem(1, '1', [{ mime: 'application/vnd.code.notebook.stderr', valueBytes: VSBuffer.fromString('baz') }]);

		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs.length, 1);
		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs[0].items.length, 1);
		assert.strictEqual(notebook.apiNotebook.cellAt(1).outputs[0].items[0].mime, 'application/vnd.code.notebook.stderr');
		assert.strictEqual(VSBuffer.wrap(notebook.apiNotebook.cellAt(1).outputs[0].items[0].data).toString(), 'foobarbaz');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostNotebookKernel.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostNotebookKernel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Barrier } from '../../../../base/common/async.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { ICellExecuteUpdateDto, ICellExecutionCompleteDto, INotebookKernelDto2, MainContext, MainThreadCommandsShape, MainThreadNotebookDocumentsShape, MainThreadNotebookKernelsShape, MainThreadNotebookShape } from '../../common/extHost.protocol.js';
import { ExtHostCommands } from '../../common/extHostCommands.js';
import { ExtHostDocuments } from '../../common/extHostDocuments.js';
import { ExtHostDocumentsAndEditors } from '../../common/extHostDocumentsAndEditors.js';
import { IExtHostInitDataService } from '../../common/extHostInitDataService.js';
import { ExtHostNotebookController } from '../../common/extHostNotebook.js';
import { ExtHostNotebookDocument } from '../../common/extHostNotebookDocument.js';
import { ExtHostNotebookDocuments } from '../../common/extHostNotebookDocuments.js';
import { ExtHostNotebookKernels } from '../../common/extHostNotebookKernels.js';
import { NotebookCellOutput, NotebookCellOutputItem } from '../../common/extHostTypes.js';
import { CellKind, CellUri, NotebookCellsChangeType } from '../../../contrib/notebook/common/notebookCommon.js';
import { CellExecutionUpdateType } from '../../../contrib/notebook/common/notebookExecutionService.js';
import { nullExtensionDescription } from '../../../services/extensions/common/extensions.js';
import { SerializableObjectWithBuffers } from '../../../services/extensions/common/proxyIdentifier.js';
import { TestRPCProtocol } from '../common/testRPCProtocol.js';
import { mock } from '../../../test/common/workbenchTestServices.js';
import { IExtHostTelemetry } from '../../common/extHostTelemetry.js';
import { ExtHostConsumerFileSystem } from '../../common/extHostFileSystemConsumer.js';
import { ExtHostFileSystemInfo } from '../../common/extHostFileSystemInfo.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ExtHostSearch } from '../../common/extHostSearch.js';
import { URITransformerService } from '../../common/extHostUriTransformerService.js';

suite('NotebookKernel', function () {
	let rpcProtocol: TestRPCProtocol;
	let extHostNotebookKernels: ExtHostNotebookKernels;
	let notebook: ExtHostNotebookDocument;
	let extHostDocumentsAndEditors: ExtHostDocumentsAndEditors;
	let extHostDocuments: ExtHostDocuments;
	let extHostNotebooks: ExtHostNotebookController;
	let extHostNotebookDocuments: ExtHostNotebookDocuments;
	let extHostCommands: ExtHostCommands;
	let extHostConsumerFileSystem: ExtHostConsumerFileSystem;
	let extHostSearch: ExtHostSearch;

	const notebookUri = URI.parse('test:///notebook.file');
	const kernelData = new Map<number, INotebookKernelDto2>();
	const disposables = new DisposableStore();

	const cellExecuteCreate: { notebook: UriComponents; cell: number }[] = [];
	const cellExecuteUpdates: ICellExecuteUpdateDto[] = [];
	const cellExecuteComplete: ICellExecutionCompleteDto[] = [];

	teardown(function () {
		disposables.clear();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(async function () {
		cellExecuteCreate.length = 0;
		cellExecuteUpdates.length = 0;
		cellExecuteComplete.length = 0;
		kernelData.clear();

		rpcProtocol = new TestRPCProtocol();
		rpcProtocol.set(MainContext.MainThreadCommands, new class extends mock<MainThreadCommandsShape>() {
			override $registerCommand() { }
		});
		rpcProtocol.set(MainContext.MainThreadNotebookKernels, new class extends mock<MainThreadNotebookKernelsShape>() {
			override async $addKernel(handle: number, data: INotebookKernelDto2): Promise<void> {
				kernelData.set(handle, data);
			}
			override $removeKernel(handle: number) {
				kernelData.delete(handle);
			}
			override $updateKernel(handle: number, data: Partial<INotebookKernelDto2>) {
				assert.strictEqual(kernelData.has(handle), true);
				kernelData.set(handle, { ...kernelData.get(handle)!, ...data, });
			}
			override $createExecution(handle: number, controllerId: string, uri: UriComponents, cellHandle: number): void {
				cellExecuteCreate.push({ notebook: uri, cell: cellHandle });
			}
			override $updateExecution(handle: number, data: SerializableObjectWithBuffers<ICellExecuteUpdateDto[]>): void {
				cellExecuteUpdates.push(...data.value);
			}
			override $completeExecution(handle: number, data: SerializableObjectWithBuffers<ICellExecutionCompleteDto>): void {
				cellExecuteComplete.push(data.value);
			}
		});
		rpcProtocol.set(MainContext.MainThreadNotebookDocuments, new class extends mock<MainThreadNotebookDocumentsShape>() {

		});
		rpcProtocol.set(MainContext.MainThreadNotebook, new class extends mock<MainThreadNotebookShape>() {
			override async $registerNotebookSerializer() { }
			override async $unregisterNotebookSerializer() { }
		});
		extHostDocumentsAndEditors = new ExtHostDocumentsAndEditors(rpcProtocol, new NullLogService());
		extHostDocuments = disposables.add(new ExtHostDocuments(rpcProtocol, extHostDocumentsAndEditors));
		extHostCommands = new ExtHostCommands(rpcProtocol, new NullLogService(), new class extends mock<IExtHostTelemetry>() {
			override onExtensionError(): boolean {
				return true;
			}
		});
		extHostConsumerFileSystem = new ExtHostConsumerFileSystem(rpcProtocol, new ExtHostFileSystemInfo());
		extHostSearch = new ExtHostSearch(rpcProtocol, new URITransformerService(null), new NullLogService());
		extHostNotebooks = new ExtHostNotebookController(rpcProtocol, extHostCommands, extHostDocumentsAndEditors, extHostDocuments, extHostConsumerFileSystem, extHostSearch, new NullLogService());

		extHostNotebookDocuments = new ExtHostNotebookDocuments(extHostNotebooks);

		extHostNotebooks.$acceptDocumentAndEditorsDelta(new SerializableObjectWithBuffers({
			addedDocuments: [{
				uri: notebookUri,
				viewType: 'test',
				versionId: 0,
				cells: [{
					handle: 0,
					uri: CellUri.generate(notebookUri, 0),
					source: ['### Heading'],
					eol: '\n',
					language: 'markdown',
					cellKind: CellKind.Markup,
					outputs: [],
				}, {
					handle: 1,
					uri: CellUri.generate(notebookUri, 1),
					source: ['console.log("aaa")', 'console.log("bbb")'],
					eol: '\n',
					language: 'javascript',
					cellKind: CellKind.Code,
					outputs: [],
				}],
			}],
			addedEditors: [{
				documentUri: notebookUri,
				id: '_notebook_editor_0',
				selections: [{ start: 0, end: 1 }],
				visibleRanges: [],
				viewType: 'test',
			}]
		}));
		extHostNotebooks.$acceptDocumentAndEditorsDelta(new SerializableObjectWithBuffers({ newActiveEditor: '_notebook_editor_0' }));

		notebook = extHostNotebooks.notebookDocuments[0]!;

		disposables.add(notebook);
		disposables.add(extHostDocuments);


		extHostNotebookKernels = new ExtHostNotebookKernels(
			rpcProtocol,
			new class extends mock<IExtHostInitDataService>() { },
			extHostNotebooks,
			extHostCommands,
			new NullLogService()
		);
	});

	test('create/dispose kernel', async function () {

		const kernel = extHostNotebookKernels.createNotebookController(nullExtensionDescription, 'foo', '*', 'Foo');

		// eslint-disable-next-line local/code-no-any-casts
		assert.throws(() => (<any>kernel).id = 'dd');
		// eslint-disable-next-line local/code-no-any-casts
		assert.throws(() => (<any>kernel).notebookType = 'dd');

		assert.ok(kernel);
		assert.strictEqual(kernel.id, 'foo');
		assert.strictEqual(kernel.label, 'Foo');
		assert.strictEqual(kernel.notebookType, '*');

		await rpcProtocol.sync();
		assert.strictEqual(kernelData.size, 1);

		const [first] = kernelData.values();
		assert.strictEqual(first.id, 'nullExtensionDescription/foo');
		assert.strictEqual(ExtensionIdentifier.equals(first.extensionId, nullExtensionDescription.identifier), true);
		assert.strictEqual(first.label, 'Foo');
		assert.strictEqual(first.notebookType, '*');

		kernel.dispose();
		await rpcProtocol.sync();
		assert.strictEqual(kernelData.size, 0);
	});

	test('update kernel', async function () {

		const kernel = disposables.add(extHostNotebookKernels.createNotebookController(nullExtensionDescription, 'foo', '*', 'Foo'));

		await rpcProtocol.sync();
		assert.ok(kernel);

		let [first] = kernelData.values();
		assert.strictEqual(first.id, 'nullExtensionDescription/foo');
		assert.strictEqual(first.label, 'Foo');

		kernel.label = 'Far';
		assert.strictEqual(kernel.label, 'Far');

		await rpcProtocol.sync();
		[first] = kernelData.values();
		assert.strictEqual(first.id, 'nullExtensionDescription/foo');
		assert.strictEqual(first.label, 'Far');
	});

	test('execute - simple createNotebookCellExecution', function () {
		const kernel = disposables.add(extHostNotebookKernels.createNotebookController(nullExtensionDescription, 'foo', '*', 'Foo'));

		extHostNotebookKernels.$acceptNotebookAssociation(0, notebook.uri, true);

		const cell1 = notebook.apiNotebook.cellAt(0);
		const task = kernel.createNotebookCellExecution(cell1);
		task.start();
		task.end(undefined);
	});

	test('createNotebookCellExecution, must be selected/associated', function () {
		const kernel = disposables.add(extHostNotebookKernels.createNotebookController(nullExtensionDescription, 'foo', '*', 'Foo'));
		assert.throws(() => {
			kernel.createNotebookCellExecution(notebook.apiNotebook.cellAt(0));
		});

		extHostNotebookKernels.$acceptNotebookAssociation(0, notebook.uri, true);
		const execution = kernel.createNotebookCellExecution(notebook.apiNotebook.cellAt(0));
		execution.end(true);
	});

	test('createNotebookCellExecution, cell must be alive', function () {
		const kernel = disposables.add(extHostNotebookKernels.createNotebookController(nullExtensionDescription, 'foo', '*', 'Foo'));

		const cell1 = notebook.apiNotebook.cellAt(0);

		extHostNotebookKernels.$acceptNotebookAssociation(0, notebook.uri, true);
		extHostNotebookDocuments.$acceptModelChanged(notebook.uri, new SerializableObjectWithBuffers({
			versionId: 12,
			rawEvents: [{
				kind: NotebookCellsChangeType.ModelChange,
				changes: [[0, notebook.apiNotebook.cellCount, []]]
			}]
		}), true);

		assert.strictEqual(cell1.index, -1);

		assert.throws(() => {
			kernel.createNotebookCellExecution(cell1);
		});
	});

	test('interrupt handler, cancellation', async function () {

		let interruptCallCount = 0;
		let tokenCancelCount = 0;

		const kernel = disposables.add(extHostNotebookKernels.createNotebookController(nullExtensionDescription, 'foo', '*', 'Foo'));
		kernel.interruptHandler = () => { interruptCallCount += 1; };
		extHostNotebookKernels.$acceptNotebookAssociation(0, notebook.uri, true);

		const cell1 = notebook.apiNotebook.cellAt(0);

		const task = kernel.createNotebookCellExecution(cell1);
		disposables.add(task.token.onCancellationRequested(() => tokenCancelCount += 1));

		await extHostNotebookKernels.$cancelCells(0, notebook.uri, [0]);
		assert.strictEqual(interruptCallCount, 1);
		assert.strictEqual(tokenCancelCount, 0);

		await extHostNotebookKernels.$cancelCells(0, notebook.uri, [0]);
		assert.strictEqual(interruptCallCount, 2);
		assert.strictEqual(tokenCancelCount, 0);

		// should cancelling the cells end the execution task?
		task.end(false);
	});

	test('set outputs on cancel', async function () {

		const kernel = disposables.add(extHostNotebookKernels.createNotebookController(nullExtensionDescription, 'foo', '*', 'Foo'));
		extHostNotebookKernels.$acceptNotebookAssociation(0, notebook.uri, true);

		const cell1 = notebook.apiNotebook.cellAt(0);
		const task = kernel.createNotebookCellExecution(cell1);
		task.start();

		const b = new Barrier();

		disposables.add(
			task.token.onCancellationRequested(async () => {
				await task.replaceOutput(new NotebookCellOutput([NotebookCellOutputItem.text('canceled')]));
				task.end(true);
				b.open(); // use barrier to signal that cancellation has happened
			})
		);

		cellExecuteUpdates.length = 0;
		await extHostNotebookKernels.$cancelCells(0, notebook.uri, [0]);

		await b.wait();

		assert.strictEqual(cellExecuteUpdates.length > 0, true);

		let found = false;
		for (const edit of cellExecuteUpdates) {
			if (edit.editType === CellExecutionUpdateType.Output) {
				assert.strictEqual(edit.append, false);
				assert.strictEqual(edit.outputs.length, 1);
				assert.strictEqual(edit.outputs[0].items.length, 1);
				assert.deepStrictEqual(Array.from(edit.outputs[0].items[0].valueBytes.buffer), Array.from(new TextEncoder().encode('canceled')));
				found = true;
			}
		}
		assert.ok(found);
	});

	test('set outputs on interrupt', async function () {

		const kernel = extHostNotebookKernels.createNotebookController(nullExtensionDescription, 'foo', '*', 'Foo');
		extHostNotebookKernels.$acceptNotebookAssociation(0, notebook.uri, true);


		const cell1 = notebook.apiNotebook.cellAt(0);
		const task = kernel.createNotebookCellExecution(cell1);
		task.start();

		kernel.interruptHandler = async _notebook => {
			assert.ok(notebook.apiNotebook === _notebook);
			await task.replaceOutput(new NotebookCellOutput([NotebookCellOutputItem.text('interrupted')]));
			task.end(true);
		};

		cellExecuteUpdates.length = 0;
		await extHostNotebookKernels.$cancelCells(0, notebook.uri, [0]);

		assert.strictEqual(cellExecuteUpdates.length > 0, true);

		let found = false;
		for (const edit of cellExecuteUpdates) {
			if (edit.editType === CellExecutionUpdateType.Output) {
				assert.strictEqual(edit.append, false);
				assert.strictEqual(edit.outputs.length, 1);
				assert.strictEqual(edit.outputs[0].items.length, 1);
				assert.deepStrictEqual(Array.from(edit.outputs[0].items[0].valueBytes.buffer), Array.from(new TextEncoder().encode('interrupted')));
				found = true;
			}
		}
		assert.ok(found);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostTelemetry.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostTelemetry.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ExtensionIdentifier, IExtensionDescription, TargetPlatform } from '../../../../platform/extensions/common/extensions.js';
import { DEFAULT_LOG_LEVEL, LogLevel } from '../../../../platform/log/common/log.js';
import { TelemetryLevel } from '../../../../platform/telemetry/common/telemetry.js';
import { TestTelemetryLoggerService } from '../../../../platform/telemetry/test/common/telemetryLogAppender.test.js';
import { IExtHostInitDataService } from '../../common/extHostInitDataService.js';
import { ExtHostTelemetry, ExtHostTelemetryLogger } from '../../common/extHostTelemetry.js';
import { IEnvironment } from '../../../services/extensions/common/extensionHostProtocol.js';
import { mock } from '../../../test/common/workbenchTestServices.js';
import type { TelemetryLoggerOptions, TelemetrySender } from 'vscode';

interface TelemetryLoggerSpy {
	dataArr: any[];
	exceptionArr: any[];
	flushCalled: boolean;
}

suite('ExtHostTelemetry', function () {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	const mockEnvironment: IEnvironment = {
		isExtensionDevelopmentDebug: false,
		extensionDevelopmentLocationURI: undefined,
		extensionTestsLocationURI: undefined,
		appRoot: undefined,
		appName: 'test',
		isExtensionTelemetryLoggingOnly: false,
		appHost: 'test',
		appLanguage: 'en',
		globalStorageHome: URI.parse('fake'),
		workspaceStorageHome: URI.parse('fake'),
		appUriScheme: 'test',
	};

	const mockTelemetryInfo = {
		firstSessionDate: '2020-01-01T00:00:00.000Z',
		sessionId: 'test',
		machineId: 'test',
		sqmId: 'test',
		devDeviceId: 'test'
	};

	const mockRemote = {
		authority: 'test',
		isRemote: false,
		connectionData: null
	};

	const mockExtensionIdentifier: IExtensionDescription = {
		identifier: new ExtensionIdentifier('test-extension'),
		targetPlatform: TargetPlatform.UNIVERSAL,
		isBuiltin: true,
		isUserBuiltin: true,
		isUnderDevelopment: true,
		name: 'test-extension',
		publisher: 'vscode',
		version: '1.0.0',
		engines: { vscode: '*' },
		extensionLocation: URI.parse('fake'),
		enabledApiProposals: undefined,
		preRelease: false,
	};

	const createExtHostTelemetry = () => {
		const extensionTelemetry = new ExtHostTelemetry(false, new class extends mock<IExtHostInitDataService>() {
			override environment: IEnvironment = mockEnvironment;
			override telemetryInfo = mockTelemetryInfo;
			override remote = mockRemote;
		}, new TestTelemetryLoggerService(DEFAULT_LOG_LEVEL));
		store.add(extensionTelemetry);
		extensionTelemetry.$initializeTelemetryLevel(TelemetryLevel.USAGE, true, { usage: true, error: true });
		return extensionTelemetry;
	};

	const createLogger = (functionSpy: TelemetryLoggerSpy, extHostTelemetry?: ExtHostTelemetry, options?: TelemetryLoggerOptions) => {
		const extensionTelemetry = extHostTelemetry ?? createExtHostTelemetry();
		// This is the appender which the extension would contribute
		const appender: TelemetrySender = {
			sendEventData: (eventName: string, data) => {
				functionSpy.dataArr.push({ eventName, data });
			},
			sendErrorData: (exception, data) => {
				functionSpy.exceptionArr.push({ exception, data });
			},
			flush: () => {
				functionSpy.flushCalled = true;
			}
		};

		if (extHostTelemetry) {
			store.add(extHostTelemetry);
		}

		const logger = extensionTelemetry.instantiateLogger(mockExtensionIdentifier, appender, options);
		store.add(logger);
		return logger;
	};

	test('Validate sender instances', function () {
		// eslint-disable-next-line local/code-no-any-casts
		assert.throws(() => ExtHostTelemetryLogger.validateSender(<any>null));
		// eslint-disable-next-line local/code-no-any-casts
		assert.throws(() => ExtHostTelemetryLogger.validateSender(<any>1));
		// eslint-disable-next-line local/code-no-any-casts
		assert.throws(() => ExtHostTelemetryLogger.validateSender(<any>{}));
		assert.throws(() => {
			// eslint-disable-next-line local/code-no-any-casts
			ExtHostTelemetryLogger.validateSender(<any>{
				sendErrorData: () => { },
				sendEventData: true
			});
		});
		assert.throws(() => {
			// eslint-disable-next-line local/code-no-any-casts
			ExtHostTelemetryLogger.validateSender(<any>{
				sendErrorData: 123,
				sendEventData: () => { },
			});
		});
		assert.throws(() => {
			// eslint-disable-next-line local/code-no-any-casts
			ExtHostTelemetryLogger.validateSender(<any>{
				sendErrorData: () => { },
				sendEventData: () => { },
				flush: true
			});
		});
	});

	test('Ensure logger gets proper telemetry level during initialization', function () {
		const extensionTelemetry = createExtHostTelemetry();
		let config = extensionTelemetry.getTelemetryDetails();
		assert.strictEqual(config.isCrashEnabled, true);
		assert.strictEqual(config.isUsageEnabled, true);
		assert.strictEqual(config.isErrorsEnabled, true);

		// Initialize would never be called twice, but this is just for testing
		extensionTelemetry.$initializeTelemetryLevel(TelemetryLevel.ERROR, true, { usage: true, error: true });
		config = extensionTelemetry.getTelemetryDetails();
		assert.strictEqual(config.isCrashEnabled, true);
		assert.strictEqual(config.isUsageEnabled, false);
		assert.strictEqual(config.isErrorsEnabled, true);

		extensionTelemetry.$initializeTelemetryLevel(TelemetryLevel.CRASH, true, { usage: true, error: true });
		config = extensionTelemetry.getTelemetryDetails();
		assert.strictEqual(config.isCrashEnabled, true);
		assert.strictEqual(config.isUsageEnabled, false);
		assert.strictEqual(config.isErrorsEnabled, false);

		extensionTelemetry.$initializeTelemetryLevel(TelemetryLevel.USAGE, true, { usage: false, error: true });
		config = extensionTelemetry.getTelemetryDetails();
		assert.strictEqual(config.isCrashEnabled, true);
		assert.strictEqual(config.isUsageEnabled, false);
		assert.strictEqual(config.isErrorsEnabled, true);
		extensionTelemetry.dispose();
	});

	test('Simple log event to TelemetryLogger', function () {
		const functionSpy: TelemetryLoggerSpy = { dataArr: [], exceptionArr: [], flushCalled: false };

		const logger = createLogger(functionSpy);

		logger.logUsage('test-event', { 'test-data': 'test-data' });
		assert.strictEqual(functionSpy.dataArr.length, 1);
		assert.strictEqual(functionSpy.dataArr[0].eventName, `${mockExtensionIdentifier.name}/test-event`);
		assert.strictEqual(functionSpy.dataArr[0].data['test-data'], 'test-data');

		logger.logUsage('test-event', { 'test-data': 'test-data' });
		assert.strictEqual(functionSpy.dataArr.length, 2);

		logger.logError('test-event', { 'test-data': 'test-data' });
		assert.strictEqual(functionSpy.dataArr.length, 3);

		logger.logError(new Error('test-error'), { 'test-data': 'test-data' });
		assert.strictEqual(functionSpy.dataArr.length, 3);
		assert.strictEqual(functionSpy.exceptionArr.length, 1);


		// Assert not flushed
		assert.strictEqual(functionSpy.flushCalled, false);

		// Call flush and assert that flush occurs
		logger.dispose();
		assert.strictEqual(functionSpy.flushCalled, true);

	});

	test('Simple log event to TelemetryLogger with options', function () {
		const functionSpy: TelemetryLoggerSpy = { dataArr: [], exceptionArr: [], flushCalled: false };

		const logger = createLogger(functionSpy, undefined, { additionalCommonProperties: { 'common.foo': 'bar' } });

		logger.logUsage('test-event', { 'test-data': 'test-data' });
		assert.strictEqual(functionSpy.dataArr.length, 1);
		assert.strictEqual(functionSpy.dataArr[0].eventName, `${mockExtensionIdentifier.name}/test-event`);
		assert.strictEqual(functionSpy.dataArr[0].data['test-data'], 'test-data');
		assert.strictEqual(functionSpy.dataArr[0].data['common.foo'], 'bar');

		logger.logUsage('test-event', { 'test-data': 'test-data' });
		assert.strictEqual(functionSpy.dataArr.length, 2);

		logger.logError('test-event', { 'test-data': 'test-data' });
		assert.strictEqual(functionSpy.dataArr.length, 3);

		logger.logError(new Error('test-error'), { 'test-data': 'test-data' });
		assert.strictEqual(functionSpy.dataArr.length, 3);
		assert.strictEqual(functionSpy.exceptionArr.length, 1);


		// Assert not flushed
		assert.strictEqual(functionSpy.flushCalled, false);

		// Call flush and assert that flush occurs
		logger.dispose();
		assert.strictEqual(functionSpy.flushCalled, true);

	});

	test('Log error should get common properties #193205', function () {
		const functionSpy: TelemetryLoggerSpy = { dataArr: [], exceptionArr: [], flushCalled: false };

		const logger = createLogger(functionSpy, undefined, { additionalCommonProperties: { 'common.foo': 'bar' } });
		logger.logError(new Error('Test error'));
		assert.strictEqual(functionSpy.exceptionArr.length, 1);
		assert.strictEqual(functionSpy.exceptionArr[0].data['common.foo'], 'bar');
		assert.strictEqual(functionSpy.exceptionArr[0].data['common.product'], 'test');

		logger.logError('test-error-event');
		assert.strictEqual(functionSpy.dataArr.length, 1);
		assert.strictEqual(functionSpy.dataArr[0].data['common.foo'], 'bar');
		assert.strictEqual(functionSpy.dataArr[0].data['common.product'], 'test');

		logger.logError('test-error-event', { 'test-data': 'test-data' });
		assert.strictEqual(functionSpy.dataArr.length, 2);
		assert.strictEqual(functionSpy.dataArr[1].data['common.foo'], 'bar');
		assert.strictEqual(functionSpy.dataArr[1].data['common.product'], 'test');

		logger.logError('test-error-event', { properties: { 'test-data': 'test-data' } });
		assert.strictEqual(functionSpy.dataArr.length, 3);
		assert.strictEqual(functionSpy.dataArr[2].data.properties['common.foo'], 'bar');
		assert.strictEqual(functionSpy.dataArr[2].data.properties['common.product'], 'test');

		logger.dispose();
		assert.strictEqual(functionSpy.flushCalled, true);
	});


	test('Ensure logger properly cleans PII', function () {
		const functionSpy: TelemetryLoggerSpy = { dataArr: [], exceptionArr: [], flushCalled: false };

		const logger = createLogger(functionSpy);

		// Log an event with a bunch of PII, this should all get cleaned out
		logger.logUsage('test-event', {
			'fake-password': 'pwd=123',
			'fake-email': 'no-reply@example.com',
			'fake-token': 'token=123',
			'fake-slack-token': 'xoxp-123',
			'fake-path': '/Users/username/.vscode/extensions',
		});

		assert.strictEqual(functionSpy.dataArr.length, 1);
		assert.strictEqual(functionSpy.dataArr[0].eventName, `${mockExtensionIdentifier.name}/test-event`);
		assert.strictEqual(functionSpy.dataArr[0].data['fake-password'], '<REDACTED: Generic Secret>');
		assert.strictEqual(functionSpy.dataArr[0].data['fake-email'], '<REDACTED: Email>');
		assert.strictEqual(functionSpy.dataArr[0].data['fake-token'], '<REDACTED: Generic Secret>');
		assert.strictEqual(functionSpy.dataArr[0].data['fake-slack-token'], '<REDACTED: Slack Token>');
		assert.strictEqual(functionSpy.dataArr[0].data['fake-path'], '<REDACTED: user-file-path>');
	});

	test('Ensure output channel is logged to', function () {

		// Have to re-duplicate code here because I the logger service isn't exposed in the simple setup functions
		const loggerService = new TestTelemetryLoggerService(LogLevel.Trace);
		const extensionTelemetry = new ExtHostTelemetry(false, new class extends mock<IExtHostInitDataService>() {
			override environment: IEnvironment = mockEnvironment;
			override telemetryInfo = mockTelemetryInfo;
			override remote = mockRemote;
		}, loggerService);
		extensionTelemetry.$initializeTelemetryLevel(TelemetryLevel.USAGE, true, { usage: true, error: true });

		const functionSpy: TelemetryLoggerSpy = { dataArr: [], exceptionArr: [], flushCalled: false };

		const logger = createLogger(functionSpy, extensionTelemetry);

		// Ensure headers are logged on instantiation
		assert.strictEqual(loggerService.createLogger().logs.length, 0);

		logger.logUsage('test-event', { 'test-data': 'test-data' });
		// Initial header is logged then the event
		assert.strictEqual(loggerService.createLogger().logs.length, 1);
		assert.ok(loggerService.createLogger().logs[0].startsWith('test-extension/test-event'));
	});
});
```

--------------------------------------------------------------------------------

````
