---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 253
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 253 of 552)

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

---[FILE: src/vs/editor/test/common/viewLayout/viewLineRenderer.test.ts]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/viewLineRenderer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CharCode } from '../../../../base/common/charCode.js';
import * as strings from '../../../../base/common/strings.js';
import { assertSnapshot } from '../../../../base/test/common/snapshot.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { OffsetRange } from '../../../common/core/ranges/offsetRange.js';
import { MetadataConsts } from '../../../common/encodedTokenAttributes.js';
import { IViewLineTokens } from '../../../common/tokens/lineTokens.js';
import { LineDecoration } from '../../../common/viewLayout/lineDecorations.js';
import { CharacterMapping, DomPosition, IRenderLineInputOptions, RenderLineInput, RenderLineOutput2, renderViewLine2 as renderViewLine } from '../../../common/viewLayout/viewLineRenderer.js';
import { InlineDecorationType } from '../../../common/viewModel/inlineDecorations.js';
import { TestLineToken, TestLineTokens } from '../core/testLineToken.js';

const HTML_EXTENSION = { extension: 'html' };

function createViewLineTokens(viewLineTokens: TestLineToken[]): IViewLineTokens {
	return new TestLineTokens(viewLineTokens);
}

function createPart(endIndex: number, foreground: number): TestLineToken {
	return new TestLineToken(endIndex, (
		foreground << MetadataConsts.FOREGROUND_OFFSET
	) >>> 0);
}

function inflateRenderLineOutput(renderLineOutput: RenderLineOutput2) {
	// remove encompassing <span> to simplify test writing.
	let html = renderLineOutput.html;
	if (html.startsWith('<span>')) {
		html = html.replace(/^<span>/, '');
	}
	html = html.replace(/<\/span>$/, '');
	const spans: string[] = [];
	let lastIndex = 0;
	do {
		const newIndex = html.indexOf('<span', lastIndex + 1);
		if (newIndex === -1) {
			break;
		}
		spans.push(html.substring(lastIndex, newIndex));
		lastIndex = newIndex;
	} while (true);
	spans.push(html.substring(lastIndex));

	return {
		html: spans,
		mapping: renderLineOutput.characterMapping.inflate(),
	};
}

type IRelaxedRenderLineInputOptions = Partial<IRenderLineInputOptions>;

const defaultRenderLineInputOptions: IRenderLineInputOptions = {
	useMonospaceOptimizations: false,
	canUseHalfwidthRightwardsArrow: true,
	lineContent: '',
	continuesWithWrappedLine: false,
	isBasicASCII: true,
	containsRTL: false,
	fauxIndentLength: 0,
	lineTokens: createViewLineTokens([]),
	lineDecorations: [],
	tabSize: 4,
	startVisibleColumn: 0,
	spaceWidth: 10,
	middotWidth: 10,
	wsmiddotWidth: 10,
	stopRenderingLineAfter: -1,
	renderWhitespace: 'none',
	renderControlCharacters: false,
	fontLigatures: false,
	selectionsOnLine: null,
	textDirection: null,
	verticalScrollbarSize: 14,
	renderNewLineWhenEmpty: false
};

function createRenderLineInputOptions(opts: IRelaxedRenderLineInputOptions): IRenderLineInputOptions {
	return {
		...defaultRenderLineInputOptions,
		...opts
	};
}

function createRenderLineInput(opts: IRelaxedRenderLineInputOptions): RenderLineInput {
	const options = createRenderLineInputOptions(opts);
	return new RenderLineInput(
		options.useMonospaceOptimizations,
		options.canUseHalfwidthRightwardsArrow,
		options.lineContent,
		options.continuesWithWrappedLine,
		options.isBasicASCII,
		options.containsRTL,
		options.fauxIndentLength,
		options.lineTokens,
		options.lineDecorations,
		options.tabSize,
		options.startVisibleColumn,
		options.spaceWidth,
		options.middotWidth,
		options.wsmiddotWidth,
		options.stopRenderingLineAfter,
		options.renderWhitespace,
		options.renderControlCharacters,
		options.fontLigatures,
		options.selectionsOnLine,
		options.textDirection,
		options.verticalScrollbarSize,
		options.renderNewLineWhenEmpty
	);
}

suite('viewLineRenderer.renderLine', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function assertCharacterReplacement(lineContent: string, tabSize: number, expected: string, expectedCharOffsetInPart: number[]): void {
		const _actual = renderViewLine(createRenderLineInput({
			lineContent,
			isBasicASCII: strings.isBasicASCII(lineContent),
			lineTokens: createViewLineTokens([new TestLineToken(lineContent.length, 0)]),
			tabSize,
			spaceWidth: 0,
			middotWidth: 0,
			wsmiddotWidth: 0
		}));

		assert.strictEqual(_actual.html, '<span><span class="mtk0">' + expected + '</span></span>');
		const info = expectedCharOffsetInPart.map<CharacterMappingInfo>((absoluteOffset) => [absoluteOffset, [0, absoluteOffset]]);
		assertCharacterMapping3(_actual.characterMapping, info);
	}

	test('replaces spaces', () => {
		assertCharacterReplacement(' ', 4, '\u00a0', [0, 1]);
		assertCharacterReplacement('  ', 4, '\u00a0\u00a0', [0, 1, 2]);
		assertCharacterReplacement('a  b', 4, 'a\u00a0\u00a0b', [0, 1, 2, 3, 4]);
	});

	test('escapes HTML markup', () => {
		assertCharacterReplacement('a<b', 4, 'a&lt;b', [0, 1, 2, 3]);
		assertCharacterReplacement('a>b', 4, 'a&gt;b', [0, 1, 2, 3]);
		assertCharacterReplacement('a&b', 4, 'a&amp;b', [0, 1, 2, 3]);
	});

	test('replaces some bad characters', () => {
		assertCharacterReplacement('a\0b', 4, 'a&#00;b', [0, 1, 2, 3]);
		assertCharacterReplacement('a' + String.fromCharCode(CharCode.UTF8_BOM) + 'b', 4, 'a\ufffdb', [0, 1, 2, 3]);
		assertCharacterReplacement('a\u2028b', 4, 'a\ufffdb', [0, 1, 2, 3]);
	});

	test('handles tabs', () => {
		assertCharacterReplacement('\t', 4, '\u00a0\u00a0\u00a0\u00a0', [0, 4]);
		assertCharacterReplacement('x\t', 4, 'x\u00a0\u00a0\u00a0', [0, 1, 4]);
		assertCharacterReplacement('xx\t', 4, 'xx\u00a0\u00a0', [0, 1, 2, 4]);
		assertCharacterReplacement('xxx\t', 4, 'xxx\u00a0', [0, 1, 2, 3, 4]);
		assertCharacterReplacement('xxxx\t', 4, 'xxxx\u00a0\u00a0\u00a0\u00a0', [0, 1, 2, 3, 4, 8]);
	});

	function assertParts(lineContent: string, tabSize: number, parts: TestLineToken[], expected: string, info: CharacterMappingInfo[]): void {
		const _actual = renderViewLine(createRenderLineInput({
			lineContent,
			lineTokens: createViewLineTokens(parts),
			tabSize,
			spaceWidth: 0,
			middotWidth: 0,
			wsmiddotWidth: 0
		}));

		assert.strictEqual(_actual.html, '<span>' + expected + '</span>');
		assertCharacterMapping3(_actual.characterMapping, info);
	}

	test('empty line', () => {
		assertParts('', 4, [], '<span></span>', []);
	});

	test('uses part type', () => {
		assertParts('x', 4, [createPart(1, 10)], '<span class="mtk10">x</span>', [[0, [0, 0]], [1, [0, 1]]]);
		assertParts('x', 4, [createPart(1, 20)], '<span class="mtk20">x</span>', [[0, [0, 0]], [1, [0, 1]]]);
		assertParts('x', 4, [createPart(1, 30)], '<span class="mtk30">x</span>', [[0, [0, 0]], [1, [0, 1]]]);
	});

	test('two parts', () => {
		assertParts('xy', 4, [createPart(1, 1), createPart(2, 2)], '<span class="mtk1">x</span><span class="mtk2">y</span>', [[0, [0, 0]], [1, [1, 0]], [2, [1, 1]]]);
		assertParts('xyz', 4, [createPart(1, 1), createPart(3, 2)], '<span class="mtk1">x</span><span class="mtk2">yz</span>', [[0, [0, 0]], [1, [1, 0]], [2, [1, 1]], [3, [1, 2]]]);
		assertParts('xyz', 4, [createPart(2, 1), createPart(3, 2)], '<span class="mtk1">xy</span><span class="mtk2">z</span>', [[0, [0, 0]], [1, [0, 1]], [2, [1, 0]], [3, [1, 1]]]);
	});

	test('overflow', async () => {
		const _actual = renderViewLine(createRenderLineInput({
			lineContent: 'Hello world!',
			lineTokens: createViewLineTokens([
				createPart(1, 0),
				createPart(2, 1),
				createPart(3, 2),
				createPart(4, 3),
				createPart(5, 4),
				createPart(6, 5),
				createPart(7, 6),
				createPart(8, 7),
				createPart(9, 8),
				createPart(10, 9),
				createPart(11, 10),
				createPart(12, 11),
			]),
			stopRenderingLineAfter: 6,
			renderWhitespace: 'boundary'
		}));

		const inflated = inflateRenderLineOutput(_actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('typical line', async () => {
		const lineContent = '\t    export class Game { // http://test.com     ';
		const lineTokens = createViewLineTokens([
			createPart(5, 1),
			createPart(11, 2),
			createPart(12, 3),
			createPart(17, 4),
			createPart(18, 5),
			createPart(22, 6),
			createPart(23, 7),
			createPart(24, 8),
			createPart(25, 9),
			createPart(28, 10),
			createPart(43, 11),
			createPart(48, 12),
		]);
		const _actual = renderViewLine(createRenderLineInput({
			lineContent,
			lineTokens,
			renderWhitespace: 'boundary'
		}));

		const inflated = inflateRenderLineOutput(_actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #2255: Weird line rendering part 1', async () => {
		const lineContent = '\t\t\tcursorStyle:\t\t\t\t\t\t(prevOpts.cursorStyle !== newOpts.cursorStyle),';
		const lineTokens = createViewLineTokens([
			createPart(3, 1), // 3 chars
			createPart(15, 2), // 12 chars
			createPart(21, 3), // 6 chars
			createPart(22, 4), // 1 char
			createPart(43, 5), // 21 chars
			createPart(45, 6), // 2 chars
			createPart(46, 7), // 1 char
			createPart(66, 8), // 20 chars
			createPart(67, 9), // 1 char
			createPart(68, 10), // 2 chars
		]);
		const _actual = renderViewLine(createRenderLineInput({
			lineContent,
			lineTokens
		}));

		const inflated = inflateRenderLineOutput(_actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #2255: Weird line rendering part 2', async () => {
		const lineContent = ' \t\t\tcursorStyle:\t\t\t\t\t\t(prevOpts.cursorStyle !== newOpts.cursorStyle),';

		const lineTokens = createViewLineTokens([
			createPart(4, 1), // 4 chars
			createPart(16, 2), // 12 chars
			createPart(22, 3), // 6 chars
			createPart(23, 4), // 1 char
			createPart(44, 5), // 21 chars
			createPart(46, 6), // 2 chars
			createPart(47, 7), // 1 char
			createPart(67, 8), // 20 chars
			createPart(68, 9), // 1 char
			createPart(69, 10), // 2 chars
		]);
		const _actual = renderViewLine(createRenderLineInput({
			lineContent,
			lineTokens
		}));

		const inflated = inflateRenderLineOutput(_actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #91178: after decoration type shown before cursor', async () => {
		const lineContent = '//just a comment';
		const lineTokens = createViewLineTokens([
			createPart(16, 1)
		]);
		const actual = renderViewLine(createRenderLineInput({
			useMonospaceOptimizations: true,
			canUseHalfwidthRightwardsArrow: false,
			lineContent,
			lineTokens,
			lineDecorations: [
				new LineDecoration(13, 13, 'dec1', InlineDecorationType.After),
				new LineDecoration(13, 13, 'dec2', InlineDecorationType.Before),
			]
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue microsoft/monaco-editor#280: Improved source code rendering for RTL languages', async () => {
		const lineContent = 'var קודמות = \"מיותר קודמות צ\'ט של, אם לשון העברית שינויים ויש, אם\";';
		const lineTokens = createViewLineTokens([
			createPart(3, 6),
			createPart(13, 1),
			createPart(66, 20),
			createPart(67, 1),
		]);
		const _actual = renderViewLine(createRenderLineInput({
			lineContent,
			isBasicASCII: false,
			containsRTL: true,
			lineTokens
		}));

		const inflated = inflateRenderLineOutput(_actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #137036: Issue in RTL languages in recent versions', async () => {
		const lineContent = '<option value=\"العربية\">العربية</option>';
		const lineTokens = createViewLineTokens([
			createPart(1, 2),
			createPart(7, 3),
			createPart(8, 4),
			createPart(13, 5),
			createPart(14, 4),
			createPart(23, 6),
			createPart(24, 2),
			createPart(31, 4),
			createPart(33, 2),
			createPart(39, 3),
			createPart(40, 2),
		]);
		const _actual = renderViewLine(createRenderLineInput({
			lineContent,
			isBasicASCII: false,
			containsRTL: true,
			lineTokens
		}));

		const inflated = inflateRenderLineOutput(_actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #99589: Rendering whitespace influences bidi layout', async () => {
		const lineContent = '    [\"🖨️ چاپ فاکتور\",\"🎨 تنظیمات\"]';
		const lineTokens = createViewLineTokens([
			createPart(5, 2),
			createPart(21, 3),
			createPart(22, 2),
			createPart(34, 3),
			createPart(35, 2),
		]);
		const _actual = renderViewLine(createRenderLineInput({
			useMonospaceOptimizations: true,
			lineContent,
			isBasicASCII: false,
			containsRTL: true,
			lineTokens,
			renderWhitespace: 'all'
		}));

		const inflated = inflateRenderLineOutput(_actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #260239: HTML containing bidirectional text is rendered incorrectly', async () => {
		// Simulating HTML like: <p class="myclass" title="العربي">نشاط التدويل!</p>
		// The line contains both LTR (class="myclass") and RTL (title="العربي") attribute values
		const lineContent = '<p class="myclass" title="العربي">نشاط التدويل!</p>';
		const lineTokens = createViewLineTokens([
			createPart(1, 1),   // <
			createPart(2, 2),   // p
			createPart(3, 3),   // (space)
			createPart(8, 4),   // class
			createPart(9, 5),   // =
			createPart(10, 6),  // "
			createPart(17, 7),  // myclass
			createPart(18, 6),  // "
			createPart(19, 3),  // (space)
			createPart(24, 4),  // title
			createPart(25, 5),  // =
			createPart(26, 6),  // "
			createPart(32, 8),  // العربي (RTL text) - 6 Arabic characters from position 26-31
			createPart(33, 6),  // " - closing quote at position 32
			createPart(34, 1),  // >
			createPart(47, 9),  // نشاط التدويل! (RTL text) - 13 characters from position 34-46
			createPart(48, 1),  // <
			createPart(49, 2),  // /
			createPart(50, 2),  // p
			createPart(51, 1),  // >
		]);
		const _actual = renderViewLine(new RenderLineInput(
			false,
			true,
			lineContent,
			false,
			false,
			true,
			0,
			lineTokens,
			[],
			4,
			0,
			10,
			10,
			10,
			-1,
			'none',
			false,
			false,
			null,
			null,
			14
		));

		const inflated = inflateRenderLineOutput(_actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #274604: Mixed LTR and RTL in a single token', async () => {
		const lineContent = 'test.com##a:-abp-contains(إ)';
		const lineTokens = createViewLineTokens([
			createPart(lineContent.length, 1)
		]);
		const actual = renderViewLine(createRenderLineInput({
			lineContent,
			isBasicASCII: false,
			containsRTL: true,
			lineTokens
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #277693: Mixed LTR and RTL in a single token with template literal', async () => {
		const lineContent = 'نام کاربر: ${user.firstName}';
		const lineTokens = createViewLineTokens([
			createPart(9, 1),   // نام کاربر (RTL string content)
			createPart(11, 1),  // : (space)
			createPart(13, 2),  // ${ (template expression punctuation)
			createPart(17, 3),  // user (variable)
			createPart(18, 4),  // . (punctuation)
			createPart(27, 3),  // firstName (property)
			createPart(28, 2),  // } (template expression punctuation)
		]);
		const actual = renderViewLine(createRenderLineInput({
			lineContent,
			isBasicASCII: false,
			containsRTL: true,
			lineTokens
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #6885: Splits large tokens', async () => {
		//                                                                                                                  1         1         1
		//                        1         2         3         4         5         6         7         8         9         0         1         2
		//               1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234
		const _lineText = 'This is just a long line that contains very interesting text. This is just a long line that contains very interesting text.';

		function assertSplitsTokens(message: string, lineContent: string, expectedOutput: string[]): void {
			const lineTokens = createViewLineTokens([createPart(lineContent.length, 1)]);
			const actual = renderViewLine(createRenderLineInput({
				lineContent,
				lineTokens
			}));
			assert.strictEqual(actual.html, '<span>' + expectedOutput.join('') + '</span>', message);
		}

		// A token with 49 chars
		{
			assertSplitsTokens(
				'49 chars',
				_lineText.substr(0, 49),
				[
					'<span class="mtk1">This\u00a0is\u00a0just\u00a0a\u00a0long\u00a0line\u00a0that\u00a0contains\u00a0very\u00a0inter</span>',
				]
			);
		}

		// A token with 50 chars
		{
			assertSplitsTokens(
				'50 chars',
				_lineText.substr(0, 50),
				[
					'<span class="mtk1">This\u00a0is\u00a0just\u00a0a\u00a0long\u00a0line\u00a0that\u00a0contains\u00a0very\u00a0intere</span>',
				]
			);
		}

		// A token with 51 chars
		{
			assertSplitsTokens(
				'51 chars',
				_lineText.substr(0, 51),
				[
					'<span class="mtk1">This\u00a0is\u00a0just\u00a0a\u00a0long\u00a0line\u00a0that\u00a0contains\u00a0very\u00a0intere</span>',
					'<span class="mtk1">s</span>',
				]
			);
		}

		// A token with 99 chars
		{
			assertSplitsTokens(
				'99 chars',
				_lineText.substr(0, 99),
				[
					'<span class="mtk1">This\u00a0is\u00a0just\u00a0a\u00a0long\u00a0line\u00a0that\u00a0contains\u00a0very\u00a0intere</span>',
					'<span class="mtk1">sting\u00a0text.\u00a0This\u00a0is\u00a0just\u00a0a\u00a0long\u00a0line\u00a0that\u00a0contain</span>',
				]
			);
		}

		// A token with 100 chars
		{
			assertSplitsTokens(
				'100 chars',
				_lineText.substr(0, 100),
				[
					'<span class="mtk1">This\u00a0is\u00a0just\u00a0a\u00a0long\u00a0line\u00a0that\u00a0contains\u00a0very\u00a0intere</span>',
					'<span class="mtk1">sting\u00a0text.\u00a0This\u00a0is\u00a0just\u00a0a\u00a0long\u00a0line\u00a0that\u00a0contains</span>',
				]
			);
		}

		// A token with 101 chars
		{
			assertSplitsTokens(
				'101 chars',
				_lineText.substr(0, 101),
				[
					'<span class="mtk1">This\u00a0is\u00a0just\u00a0a\u00a0long\u00a0line\u00a0that\u00a0contains\u00a0very\u00a0intere</span>',
					'<span class="mtk1">sting\u00a0text.\u00a0This\u00a0is\u00a0just\u00a0a\u00a0long\u00a0line\u00a0that\u00a0contains</span>',
					'<span class="mtk1">\u00a0</span>',
				]
			);
		}
	});

	test('issue #21476: Does not split large tokens when ligatures are on', async () => {
		//                                                                                                                  1         1         1
		//                        1         2         3         4         5         6         7         8         9         0         1         2
		//               1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234
		const _lineText = 'This is just a long line that contains very interesting text. This is just a long line that contains very interesting text.';

		function assertSplitsTokens(message: string, lineContent: string, expectedOutput: string[]): void {
			const lineTokens = createViewLineTokens([createPart(lineContent.length, 1)]);
			const actual = renderViewLine(createRenderLineInput({
				lineContent,
				lineTokens,
				fontLigatures: true
			}));
			assert.strictEqual(actual.html, '<span>' + expectedOutput.join('') + '</span>', message);
		}

		// A token with 101 chars
		{
			assertSplitsTokens(
				'101 chars',
				_lineText.substr(0, 101),
				[
					'<span class="mtk1">This\u00a0is\u00a0just\u00a0a\u00a0long\u00a0line\u00a0that\u00a0contains\u00a0very\u00a0</span>',
					'<span class="mtk1">interesting\u00a0text.\u00a0This\u00a0is\u00a0just\u00a0a\u00a0long\u00a0line\u00a0that\u00a0</span>',
					'<span class="mtk1">contains\u00a0</span>',
				]
			);
		}
	});

	test('issue #20624: Unaligned surrogate pairs are corrupted at multiples of 50 columns', async () => {
		const lineContent = 'a𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷';
		const lineTokens = createViewLineTokens([createPart(lineContent.length, 1)]);
		const actual = renderViewLine(createRenderLineInput({
			lineContent,
			isBasicASCII: false,
			lineTokens
		}));

		await assertSnapshot(inflateRenderLineOutput(actual).html.join(''), HTML_EXTENSION);
	});

	test('issue #6885: Does not split large tokens in RTL text', async () => {
		const lineContent = 'את גרמנית בהתייחסות שמו, שנתי המשפט אל חפש, אם כתב אחרים ולחבר. של התוכן אודות בויקיפדיה כלל, של עזרה כימיה היא. על עמוד יוצרים מיתולוגיה סדר, אם שכל שתפו לעברית שינויים, אם שאלות אנגלית עזה. שמות בקלות מה סדר.';
		const lineTokens = createViewLineTokens([createPart(lineContent.length, 1)]);
		const actual = renderViewLine(createRenderLineInput({
			lineContent,
			isBasicASCII: false,
			containsRTL: true,
			lineTokens
		}));

		await assertSnapshot(actual.html, HTML_EXTENSION);
	});

	test('issue #95685: Uses unicode replacement character for Paragraph Separator', async () => {
		const lineContent = 'var ftext = [\u2029"Und", "dann", "eines"];';
		const lineTokens = createViewLineTokens([createPart(lineContent.length, 1)]);
		const actual = renderViewLine(createRenderLineInput({
			lineContent,
			isBasicASCII: false,
			lineTokens
		}));
		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #19673: Monokai Theme bad-highlighting in line wrap', async () => {
		const lineContent = '    MongoCallback<string>): void {';
		const lineTokens = createViewLineTokens([
			createPart(17, 1),
			createPart(18, 2),
			createPart(24, 3),
			createPart(26, 4),
			createPart(27, 5),
			createPart(28, 6),
			createPart(32, 7),
			createPart(34, 8),
		]);
		const _actual = renderViewLine(createRenderLineInput({
			useMonospaceOptimizations: true,
			lineContent,
			fauxIndentLength: 4,
			lineTokens
		}));

		const inflated = inflateRenderLineOutput(_actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});
});

type CharacterMappingInfo = [number, [number, number]];

function assertCharacterMapping3(actual: CharacterMapping, expectedInfo: CharacterMappingInfo[]): void {
	for (let i = 0; i < expectedInfo.length; i++) {
		const [horizontalOffset, [partIndex, charIndex]] = expectedInfo[i];

		const actualDomPosition = actual.getDomPosition(i + 1);
		assert.deepStrictEqual(actualDomPosition, new DomPosition(partIndex, charIndex), `getDomPosition(${i + 1})`);

		let partLength = charIndex + 1;
		for (let j = i + 1; j < expectedInfo.length; j++) {
			const [, [nextPartIndex, nextCharIndex]] = expectedInfo[j];
			if (nextPartIndex === partIndex) {
				partLength = nextCharIndex + 1;
			} else {
				break;
			}
		}

		const actualColumn = actual.getColumn(new DomPosition(partIndex, charIndex), partLength);
		assert.strictEqual(actualColumn, i + 1, `actual.getColumn(${partIndex}, ${charIndex})`);

		const actualHorizontalOffset = actual.getHorizontalOffset(i + 1);
		assert.strictEqual(actualHorizontalOffset, horizontalOffset, `actual.getHorizontalOffset(${i + 1})`);
	}

	assert.strictEqual(actual.length, expectedInfo.length, `length mismatch`);
}

suite('viewLineRenderer.renderLine 2', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function testCreateLineParts(fontIsMonospace: boolean, lineContent: string, tokens: TestLineToken[], fauxIndentLength: number, renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all', selections: OffsetRange[] | null) {
		const actual = renderViewLine(createRenderLineInput({
			useMonospaceOptimizations: fontIsMonospace,
			lineContent,
			fauxIndentLength,
			lineTokens: createViewLineTokens(tokens),
			renderWhitespace,
			selectionsOnLine: selections
		}));
		return inflateRenderLineOutput(actual);
	}

	test('issue #18616: Inline decorations ending at the text length are no longer rendered', async () => {
		const lineContent = 'https://microsoft.com';
		const actual = renderViewLine(createRenderLineInput({
			lineContent,
			lineTokens: createViewLineTokens([createPart(21, 3)]),
			lineDecorations: [new LineDecoration(1, 22, 'link', InlineDecorationType.Regular)]
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #19207: Link in Monokai is not rendered correctly', async () => {
		const lineContent = '\'let url = `http://***/_api/web/lists/GetByTitle(\\\'Teambuildingaanvragen\\\')/items`;\'';
		const actual = renderViewLine(createRenderLineInput({
			useMonospaceOptimizations: true,
			lineContent,
			lineTokens: createViewLineTokens([
				createPart(49, 6),
				createPart(51, 4),
				createPart(72, 6),
				createPart(74, 4),
				createPart(84, 6),
			]),
			lineDecorations: [
				new LineDecoration(13, 51, 'detected-link', InlineDecorationType.Regular)
			]
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('createLineParts simple', async () => {
		const actual = testCreateLineParts(
			false,
			'Hello world!',
			[
				createPart(12, 1)
			],
			0,
			'none',
			null
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts simple two tokens', async () => {
		const actual = testCreateLineParts(
			false,
			'Hello world!',
			[
				createPart(6, 1),
				createPart(12, 2)
			],
			0,
			'none',
			null
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts render whitespace - 4 leading spaces', async () => {
		const actual = testCreateLineParts(
			false,
			'    Hello world!    ',
			[
				createPart(4, 1),
				createPart(6, 2),
				createPart(20, 3)
			],
			0,
			'boundary',
			null
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts render whitespace - 8 leading spaces', async () => {
		const actual = testCreateLineParts(
			false,
			'        Hello world!        ',
			[
				createPart(8, 1),
				createPart(10, 2),
				createPart(28, 3)
			],
			0,
			'boundary',
			null
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts render whitespace - 2 leading tabs', async () => {
		const actual = testCreateLineParts(
			false,
			'\t\tHello world!\t',
			[
				createPart(2, 1),
				createPart(4, 2),
				createPart(15, 3)
			],
			0,
			'boundary',
			null
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts render whitespace - mixed leading spaces and tabs', async () => {
		const actual = testCreateLineParts(
			false,
			'  \t\t  Hello world! \t  \t   \t    ',
			[
				createPart(6, 1),
				createPart(8, 2),
				createPart(31, 3)
			],
			0,
			'boundary',
			null
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts render whitespace skips faux indent', async () => {
		const actual = testCreateLineParts(
			false,
			'\t\t  Hello world! \t  \t   \t    ',
			[
				createPart(4, 1),
				createPart(6, 2),
				createPart(29, 3)
			],
			2,
			'boundary',
			null
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts does not emit width for monospace fonts', async () => {
		const actual = testCreateLineParts(
			true,
			'\t\t  Hello world! \t  \t   \t    ',
			[
				createPart(4, 1),
				createPart(6, 2),
				createPart(29, 3)
			],
			2,
			'boundary',
			null
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts render whitespace in middle but not for one space', async () => {
		const actual = testCreateLineParts(
			false,
			'it  it it  it',
			[
				createPart(6, 1),
				createPart(7, 2),
				createPart(13, 3)
			],
			0,
			'boundary',
			null
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts render whitespace for all in middle', async () => {
		const actual = testCreateLineParts(
			false,
			' Hello world!\t',
			[
				createPart(4, 0),
				createPart(6, 1),
				createPart(14, 2)
			],
			0,
			'all',
			null
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts render whitespace for selection with no selections', async () => {
		const actual = testCreateLineParts(
			false,
			' Hello world!\t',
			[
				createPart(4, 0),
				createPart(6, 1),
				createPart(14, 2)
			],
			0,
			'selection',
			null
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts render whitespace for selection with whole line selection', async () => {
		const actual = testCreateLineParts(
			false,
			' Hello world!\t',
			[
				createPart(4, 0),
				createPart(6, 1),
				createPart(14, 2)
			],
			0,
			'selection',
			[new OffsetRange(0, 14)]
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts render whitespace for selection with selection spanning part of whitespace', async () => {
		const actual = testCreateLineParts(
			false,
			' Hello world!\t',
			[
				createPart(4, 0),
				createPart(6, 1),
				createPart(14, 2)
			],
			0,
			'selection',
			[new OffsetRange(0, 5)]
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts render whitespace for selection with multiple selections', async () => {
		const actual = testCreateLineParts(
			false,
			' Hello world!\t',
			[
				createPart(4, 0),
				createPart(6, 1),
				createPart(14, 2)
			],
			0,
			'selection',
			[new OffsetRange(0, 5), new OffsetRange(9, 14)]
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts render whitespace for selection with multiple, initially unsorted selections', async () => {
		const actual = testCreateLineParts(
			false,
			' Hello world!\t',
			[
				createPart(4, 0),
				createPart(6, 1),
				createPart(14, 2)
			],
			0,
			'selection',
			[new OffsetRange(9, 14), new OffsetRange(0, 5)]
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts render whitespace for selection with selections next to each other', async () => {
		const actual = testCreateLineParts(
			false,
			' * S',
			[
				createPart(4, 0)
			],
			0,
			'selection',
			[new OffsetRange(0, 1), new OffsetRange(1, 2), new OffsetRange(2, 3)]
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts render whitespace for trailing with leading, inner, and without trailing whitespace', async () => {
		const actual = testCreateLineParts(
			false,
			' Hello world!',
			[
				createPart(4, 0),
				createPart(6, 1),
				createPart(14, 2)
			],
			0,
			'trailing',
			null
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts render whitespace for trailing with leading, inner, and trailing whitespace', async () => {
		const actual = testCreateLineParts(
			false,
			' Hello world! \t',
			[
				createPart(4, 0),
				createPart(6, 1),
				createPart(15, 2)
			],
			0,
			'trailing',
			null
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts render whitespace for trailing with 8 leading and 8 trailing whitespaces', async () => {
		const actual = testCreateLineParts(
			false,
			'        Hello world!        ',
			[
				createPart(8, 1),
				createPart(10, 2),
				createPart(28, 3)
			],
			0,
			'trailing',
			null
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts render whitespace for trailing with line containing only whitespaces', async () => {
		const actual = testCreateLineParts(
			false,
			' \t ',
			[
				createPart(2, 0),
				createPart(3, 1),
			],
			0,
			'trailing',
			null
		);
		await assertSnapshot(actual.html.join(''), HTML_EXTENSION);
		await assertSnapshot(actual.mapping);
	});

	test('createLineParts can handle unsorted inline decorations', async () => {
		const actual = renderViewLine(createRenderLineInput({
			lineContent: 'Hello world',
			lineTokens: createViewLineTokens([createPart(11, 0)]),
			lineDecorations: [
				new LineDecoration(5, 7, 'a', InlineDecorationType.Regular),
				new LineDecoration(1, 3, 'b', InlineDecorationType.Regular),
				new LineDecoration(2, 8, 'c', InlineDecorationType.Regular),
			]
		}));

		// 01234567890
		// Hello world
		// ----aa-----
		// bb---------
		// -cccccc----

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #11485: Visible whitespace conflicts with before decorator attachment', async () => {

		const lineContent = '\tbla';

		const actual = renderViewLine(createRenderLineInput({
			lineContent,
			lineTokens: createViewLineTokens([createPart(4, 3)]),
			lineDecorations: [new LineDecoration(1, 2, 'before', InlineDecorationType.Before)],
			renderWhitespace: 'all',
			fontLigatures: true
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #32436: Non-monospace font + visible whitespace + After decorator causes line to "jump"', async () => {

		const lineContent = '\tbla';

		const actual = renderViewLine(createRenderLineInput({
			lineContent,
			lineTokens: createViewLineTokens([createPart(4, 3)]),
			lineDecorations: [new LineDecoration(2, 3, 'before', InlineDecorationType.Before)],
			renderWhitespace: 'all',
			fontLigatures: true
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #30133: Empty lines don\'t render inline decorations', async () => {

		const lineContent = '';

		const actual = renderViewLine(createRenderLineInput({
			lineContent,
			lineTokens: createViewLineTokens([createPart(0, 3)]),
			lineDecorations: [new LineDecoration(1, 2, 'before', InlineDecorationType.Before)],
			renderWhitespace: 'all',
			fontLigatures: true
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #37208: Collapsing bullet point containing emoji in Markdown document results in [??] character', async () => {

		const actual = renderViewLine(createRenderLineInput({
			useMonospaceOptimizations: true,
			lineContent: '  1. 🙏',
			isBasicASCII: false,
			lineTokens: createViewLineTokens([createPart(7, 3)]),
			lineDecorations: [new LineDecoration(7, 8, 'inline-folded', InlineDecorationType.After)],
			tabSize: 2,
			stopRenderingLineAfter: 10000
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #37401 #40127: Allow both before and after decorations on empty line', async () => {

		const actual = renderViewLine(createRenderLineInput({
			useMonospaceOptimizations: true,
			lineContent: '',
			lineTokens: createViewLineTokens([createPart(0, 3)]),
			lineDecorations: [
				new LineDecoration(1, 1, 'before', InlineDecorationType.Before),
				new LineDecoration(1, 1, 'after', InlineDecorationType.After),
			],
			tabSize: 2,
			stopRenderingLineAfter: 10000
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #118759: enable multiple text editor decorations in empty lines', async () => {

		const actual = renderViewLine(createRenderLineInput({
			useMonospaceOptimizations: true,
			lineContent: '',
			lineTokens: createViewLineTokens([createPart(0, 3)]),
			lineDecorations: [
				new LineDecoration(1, 1, 'after1', InlineDecorationType.After),
				new LineDecoration(1, 1, 'after2', InlineDecorationType.After),
				new LineDecoration(1, 1, 'before1', InlineDecorationType.Before),
				new LineDecoration(1, 1, 'before2', InlineDecorationType.Before),
			],
			tabSize: 2,
			stopRenderingLineAfter: 10000
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #38935: GitLens end-of-line blame no longer rendering', async () => {

		const actual = renderViewLine(createRenderLineInput({
			useMonospaceOptimizations: true,
			lineContent: '\t}',
			lineTokens: createViewLineTokens([createPart(2, 3)]),
			lineDecorations: [
				new LineDecoration(3, 3, 'ced-TextEditorDecorationType2-5e9b9b3f-3 ced-TextEditorDecorationType2-3', InlineDecorationType.Before),
				new LineDecoration(3, 3, 'ced-TextEditorDecorationType2-5e9b9b3f-4 ced-TextEditorDecorationType2-4', InlineDecorationType.After),
			],
			stopRenderingLineAfter: 10000
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #136622: Inline decorations are not rendering on non-ASCII lines when renderControlCharacters is on', async () => {

		const actual = renderViewLine(createRenderLineInput({
			useMonospaceOptimizations: true,
			lineContent: 'some text £',
			isBasicASCII: false,
			lineTokens: createViewLineTokens([createPart(11, 3)]),
			lineDecorations: [
				new LineDecoration(5, 5, 'inlineDec1', InlineDecorationType.After),
				new LineDecoration(6, 6, 'inlineDec2', InlineDecorationType.Before),
			],
			stopRenderingLineAfter: 10000,
			renderControlCharacters: true
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #22832: Consider fullwidth characters when rendering tabs', async () => {

		const actual = renderViewLine(createRenderLineInput({
			useMonospaceOptimizations: true,
			lineContent: 'asd = "擦"\t\t#asd',
			isBasicASCII: false,
			lineTokens: createViewLineTokens([createPart(15, 3)]),
			stopRenderingLineAfter: 10000
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #22832: Consider fullwidth characters when rendering tabs (render whitespace)', async () => {

		const actual = renderViewLine(createRenderLineInput({
			useMonospaceOptimizations: true,
			lineContent: 'asd = "擦"\t\t#asd',
			isBasicASCII: false,
			lineTokens: createViewLineTokens([createPart(15, 3)]),
			stopRenderingLineAfter: 10000,
			renderWhitespace: 'all'
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #22352: COMBINING ACUTE ACCENT (U+0301)', async () => {

		const actual = renderViewLine(createRenderLineInput({
			useMonospaceOptimizations: true,
			lineContent: '12345689012345678901234568901234567890123456890abába',
			isBasicASCII: false,
			lineTokens: createViewLineTokens([createPart(53, 3)]),
			stopRenderingLineAfter: 10000
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #22352: Partially Broken Complex Script Rendering of Tamil', async () => {

		const actual = renderViewLine(createRenderLineInput({
			useMonospaceOptimizations: true,
			lineContent: ' JoyShareல் பின்தொடர்ந்து, விடீயோ, ஜோக்குகள், அனிமேசன், நகைச்சுவை படங்கள் மற்றும் செய்திகளை பெறுவீர்',
			isBasicASCII: false,
			lineTokens: createViewLineTokens([createPart(100, 3)]),
			stopRenderingLineAfter: 10000
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #42700: Hindi characters are not being rendered properly', async () => {

		const actual = renderViewLine(createRenderLineInput({
			useMonospaceOptimizations: true,
			lineContent: ' वो ऐसा क्या है जो हमारे अंदर भी है और बाहर भी है। जिसकी वजह से हम सब हैं। जिसने इस सृष्टि की रचना की है।',
			isBasicASCII: false,
			lineTokens: createViewLineTokens([createPart(105, 3)]),
			stopRenderingLineAfter: 10000
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #38123: editor.renderWhitespace: "boundary" renders whitespace at line wrap point when line is wrapped', async () => {
		const actual = renderViewLine(createRenderLineInput({
			useMonospaceOptimizations: true,
			lineContent: 'This is a long line which never uses more than two spaces. ',
			continuesWithWrappedLine: true,
			lineTokens: createViewLineTokens([createPart(59, 3)]),
			stopRenderingLineAfter: 10000,
			renderWhitespace: 'boundary'
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #33525: Long line with ligatures takes a long time to paint decorations', async () => {
		const actual = renderViewLine(createRenderLineInput({
			canUseHalfwidthRightwardsArrow: false,
			lineContent: 'append data to append data to append data to append data to append data to append data to append data to append data to append data to append data to append data to append data to append data to',
			lineTokens: createViewLineTokens([createPart(194, 3)]),
			stopRenderingLineAfter: 10000,
			fontLigatures: true
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #33525: Long line with ligatures takes a long time to paint decorations - not possible', async () => {
		const actual = renderViewLine(createRenderLineInput({
			canUseHalfwidthRightwardsArrow: false,
			lineContent: 'appenddatatoappenddatatoappenddatatoappenddatatoappenddatatoappenddatatoappenddatatoappenddatatoappenddatatoappenddatatoappenddatatoappenddatatoappenddatato',
			lineTokens: createViewLineTokens([createPart(194, 3)]),
			stopRenderingLineAfter: 10000,
			fontLigatures: true
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #91936: Semantic token color highlighting fails on line with selected text', async () => {
		const actual = renderViewLine(createRenderLineInput({
			lineContent: '                    else if ($s = 08) then \'\\b\'',
			lineTokens: createViewLineTokens([
				createPart(20, 1),
				createPart(24, 15),
				createPart(25, 1),
				createPart(27, 15),
				createPart(28, 1),
				createPart(29, 1),
				createPart(29, 1),
				createPart(31, 16),
				createPart(32, 1),
				createPart(33, 1),
				createPart(34, 1),
				createPart(36, 6),
				createPart(36, 1),
				createPart(37, 1),
				createPart(38, 1),
				createPart(42, 15),
				createPart(43, 1),
				createPart(47, 11)
			]),
			stopRenderingLineAfter: 10000,
			renderWhitespace: 'selection',
			selectionsOnLine: [new OffsetRange(0, 47)],
			middotWidth: 11,
			wsmiddotWidth: 11
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #119416: Delete Control Character (U+007F / &#127;) displayed as space', async () => {
		const actual = renderViewLine(createRenderLineInput({
			canUseHalfwidthRightwardsArrow: false,
			lineContent: '[' + String.fromCharCode(127) + '] [' + String.fromCharCode(0) + ']',
			lineTokens: createViewLineTokens([createPart(7, 3)]),
			stopRenderingLineAfter: 10000,
			renderControlCharacters: true,
			fontLigatures: true
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #116939: Important control characters aren\'t rendered', async () => {
		const actual = renderViewLine(createRenderLineInput({
			canUseHalfwidthRightwardsArrow: false,
			lineContent: `transferBalance(5678,${String.fromCharCode(0x202E)}6776,4321${String.fromCharCode(0x202C)},"USD");`,
			isBasicASCII: false,
			lineTokens: createViewLineTokens([createPart(42, 3)]),
			stopRenderingLineAfter: 10000,
			renderControlCharacters: true
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	test('issue #124038: Multiple end-of-line text decorations get merged', async () => {
		const actual = renderViewLine(createRenderLineInput({
			useMonospaceOptimizations: true,
			canUseHalfwidthRightwardsArrow: false,
			lineContent: '    if',
			lineTokens: createViewLineTokens([createPart(4, 1), createPart(6, 2)]),
			lineDecorations: [
				new LineDecoration(7, 7, 'ced-1-TextEditorDecorationType2-17c14d98-3 ced-1-TextEditorDecorationType2-3', InlineDecorationType.Before),
				new LineDecoration(7, 7, 'ced-1-TextEditorDecorationType2-17c14d98-4 ced-1-TextEditorDecorationType2-4', InlineDecorationType.After),
				new LineDecoration(7, 7, 'ced-ghost-text-1-4', InlineDecorationType.After),
			],
			stopRenderingLineAfter: 10000,
			renderWhitespace: 'all'
		}));

		const inflated = inflateRenderLineOutput(actual);
		await assertSnapshot(inflated.html.join(''), HTML_EXTENSION);
		await assertSnapshot(inflated.mapping);
	});

	function createTestGetColumnOfLinePartOffset(lineContent: string, tabSize: number, parts: TestLineToken[], expectedPartLengths: number[]): (partIndex: number, partLength: number, offset: number, expected: number) => void {
		const renderLineOutput = renderViewLine(createRenderLineInput({
			lineContent,
			tabSize,
			lineTokens: createViewLineTokens(parts)
		}));

		return (partIndex: number, partLength: number, offset: number, expected: number) => {
			const actualColumn = renderLineOutput.characterMapping.getColumn(new DomPosition(partIndex, offset), partLength);
			assert.strictEqual(actualColumn, expected, 'getColumn for ' + partIndex + ', ' + offset);
		};
	}

	test('getColumnOfLinePartOffset 1 - simple text', () => {
		const testGetColumnOfLinePartOffset = createTestGetColumnOfLinePartOffset(
			'hello world',
			4,
			[
				createPart(11, 1)
			],
			[11]
		);
		testGetColumnOfLinePartOffset(0, 11, 0, 1);
		testGetColumnOfLinePartOffset(0, 11, 1, 2);
		testGetColumnOfLinePartOffset(0, 11, 2, 3);
		testGetColumnOfLinePartOffset(0, 11, 3, 4);
		testGetColumnOfLinePartOffset(0, 11, 4, 5);
		testGetColumnOfLinePartOffset(0, 11, 5, 6);
		testGetColumnOfLinePartOffset(0, 11, 6, 7);
		testGetColumnOfLinePartOffset(0, 11, 7, 8);
		testGetColumnOfLinePartOffset(0, 11, 8, 9);
		testGetColumnOfLinePartOffset(0, 11, 9, 10);
		testGetColumnOfLinePartOffset(0, 11, 10, 11);
		testGetColumnOfLinePartOffset(0, 11, 11, 12);
	});

	test('getColumnOfLinePartOffset 2 - regular JS', () => {
		const testGetColumnOfLinePartOffset = createTestGetColumnOfLinePartOffset(
			'var x = 3;',
			4,
			[
				createPart(3, 1),
				createPart(4, 2),
				createPart(5, 3),
				createPart(8, 4),
				createPart(9, 5),
				createPart(10, 6),
			],
			[3, 1, 1, 3, 1, 1]
		);
		testGetColumnOfLinePartOffset(0, 3, 0, 1);
		testGetColumnOfLinePartOffset(0, 3, 1, 2);
		testGetColumnOfLinePartOffset(0, 3, 2, 3);
		testGetColumnOfLinePartOffset(0, 3, 3, 4);
		testGetColumnOfLinePartOffset(1, 1, 0, 4);
		testGetColumnOfLinePartOffset(1, 1, 1, 5);
		testGetColumnOfLinePartOffset(2, 1, 0, 5);
		testGetColumnOfLinePartOffset(2, 1, 1, 6);
		testGetColumnOfLinePartOffset(3, 3, 0, 6);
		testGetColumnOfLinePartOffset(3, 3, 1, 7);
		testGetColumnOfLinePartOffset(3, 3, 2, 8);
		testGetColumnOfLinePartOffset(3, 3, 3, 9);
		testGetColumnOfLinePartOffset(4, 1, 0, 9);
		testGetColumnOfLinePartOffset(4, 1, 1, 10);
		testGetColumnOfLinePartOffset(5, 1, 0, 10);
		testGetColumnOfLinePartOffset(5, 1, 1, 11);
	});

	test('getColumnOfLinePartOffset 3 - tab with tab size 6', () => {
		const testGetColumnOfLinePartOffset = createTestGetColumnOfLinePartOffset(
			'\t',
			6,
			[
				createPart(1, 1)
			],
			[6]
		);
		testGetColumnOfLinePartOffset(0, 6, 0, 1);
		testGetColumnOfLinePartOffset(0, 6, 1, 1);
		testGetColumnOfLinePartOffset(0, 6, 2, 1);
		testGetColumnOfLinePartOffset(0, 6, 3, 1);
		testGetColumnOfLinePartOffset(0, 6, 4, 2);
		testGetColumnOfLinePartOffset(0, 6, 5, 2);
		testGetColumnOfLinePartOffset(0, 6, 6, 2);
	});

	test('getColumnOfLinePartOffset 4 - once indented line, tab size 4', () => {
		const testGetColumnOfLinePartOffset = createTestGetColumnOfLinePartOffset(
			'\tfunction',
			4,
			[
				createPart(1, 1),
				createPart(9, 2),
			],
			[4, 8]
		);
		testGetColumnOfLinePartOffset(0, 4, 0, 1);
		testGetColumnOfLinePartOffset(0, 4, 1, 1);
		testGetColumnOfLinePartOffset(0, 4, 2, 1);
		testGetColumnOfLinePartOffset(0, 4, 3, 2);
		testGetColumnOfLinePartOffset(0, 4, 4, 2);
		testGetColumnOfLinePartOffset(1, 8, 0, 2);
		testGetColumnOfLinePartOffset(1, 8, 1, 3);
		testGetColumnOfLinePartOffset(1, 8, 2, 4);
		testGetColumnOfLinePartOffset(1, 8, 3, 5);
		testGetColumnOfLinePartOffset(1, 8, 4, 6);
		testGetColumnOfLinePartOffset(1, 8, 5, 7);
		testGetColumnOfLinePartOffset(1, 8, 6, 8);
		testGetColumnOfLinePartOffset(1, 8, 7, 9);
		testGetColumnOfLinePartOffset(1, 8, 8, 10);
	});

	test('getColumnOfLinePartOffset 5 - twice indented line, tab size 4', () => {
		const testGetColumnOfLinePartOffset = createTestGetColumnOfLinePartOffset(
			'\t\tfunction',
			4,
			[
				createPart(2, 1),
				createPart(10, 2),
			],
			[8, 8]
		);
		testGetColumnOfLinePartOffset(0, 8, 0, 1);
		testGetColumnOfLinePartOffset(0, 8, 1, 1);
		testGetColumnOfLinePartOffset(0, 8, 2, 1);
		testGetColumnOfLinePartOffset(0, 8, 3, 2);
		testGetColumnOfLinePartOffset(0, 8, 4, 2);
		testGetColumnOfLinePartOffset(0, 8, 5, 2);
		testGetColumnOfLinePartOffset(0, 8, 6, 2);
		testGetColumnOfLinePartOffset(0, 8, 7, 3);
		testGetColumnOfLinePartOffset(0, 8, 8, 3);
		testGetColumnOfLinePartOffset(1, 8, 0, 3);
		testGetColumnOfLinePartOffset(1, 8, 1, 4);
		testGetColumnOfLinePartOffset(1, 8, 2, 5);
		testGetColumnOfLinePartOffset(1, 8, 3, 6);
		testGetColumnOfLinePartOffset(1, 8, 4, 7);
		testGetColumnOfLinePartOffset(1, 8, 5, 8);
		testGetColumnOfLinePartOffset(1, 8, 6, 9);
		testGetColumnOfLinePartOffset(1, 8, 7, 10);
		testGetColumnOfLinePartOffset(1, 8, 8, 11);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_can_handle_unsorted_inline_decorations.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_can_handle_unsorted_inline_decorations.0.html

```html
<span class="mtk0 b">H</span><span class="mtk0 b c">e</span><span class="mtk0 c">ll</span><span class="mtk0 a c">o </span><span class="mtk0 c">w</span><span class="mtk0">orld</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_can_handle_unsorted_inline_decorations.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_can_handle_unsorted_inline_decorations.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 1, 0, 1 ],
  [ 2, 0, 2 ],
  [ 2, 1, 3 ],
  [ 3, 0, 4 ],
  [ 3, 1, 5 ],
  [ 4, 0, 6 ],
  [ 5, 0, 7 ],
  [ 5, 1, 8 ],
  [ 5, 2, 9 ],
  [ 5, 3, 10 ],
  [ 5, 4, 11 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_does_not_emit_width_for_monospace_fonts.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_does_not_emit_width_for_monospace_fonts.0.html

```html
<span class="">        </span><span class="mtkw">·‌·‌</span><span class="mtk2">He</span><span class="mtk3">llo world!</span><span class="mtkw">·‌￫·‌·‌→ ·‌·‌·‌￫·‌·‌·‌·‌</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_does_not_emit_width_for_monospace_fonts.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_does_not_emit_width_for_monospace_fonts.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 4, 4 ],
  [ 1, 0, 8 ],
  [ 1, 2, 9 ],
  [ 2, 0, 10 ],
  [ 2, 1, 11 ],
  [ 3, 0, 12 ],
  [ 3, 1, 13 ],
  [ 3, 2, 14 ],
  [ 3, 3, 15 ],
  [ 3, 4, 16 ],
  [ 3, 5, 17 ],
  [ 3, 6, 18 ],
  [ 3, 7, 19 ],
  [ 3, 8, 20 ],
  [ 3, 9, 21 ],
  [ 4, 0, 22 ],
  [ 4, 2, 23 ],
  [ 4, 3, 24 ],
  [ 4, 5, 25 ],
  [ 4, 7, 26 ],
  [ 4, 9, 28 ],
  [ 4, 11, 29 ],
  [ 4, 13, 30 ],
  [ 4, 15, 31 ],
  [ 4, 16, 32 ],
  [ 4, 18, 33 ],
  [ 4, 20, 34 ],
  [ 4, 22, 35 ],
  [ 4, 24, 36 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_-_2_leading_tabs.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_-_2_leading_tabs.0.html

```html
<span class="mtkz" style="width:40px">→   </span><span class="mtkz" style="width:40px">→   </span><span class="mtk2">He</span><span class="mtk3">llo world!</span><span class="mtkz" style="width:40px">→   </span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_-_2_leading_tabs.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_-_2_leading_tabs.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 1, 0, 4 ],
  [ 2, 0, 8 ],
  [ 2, 1, 9 ],
  [ 3, 0, 10 ],
  [ 3, 1, 11 ],
  [ 3, 2, 12 ],
  [ 3, 3, 13 ],
  [ 3, 4, 14 ],
  [ 3, 5, 15 ],
  [ 3, 6, 16 ],
  [ 3, 7, 17 ],
  [ 3, 8, 18 ],
  [ 3, 9, 19 ],
  [ 4, 0, 20 ],
  [ 4, 4, 24 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_-_4_leading_spaces.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_-_4_leading_spaces.0.html

```html
<span class="mtkz" style="width:40px">·‌·‌·‌·‌</span><span class="mtk2">He</span><span class="mtk3">llo world!</span><span class="mtkz" style="width:40px">·‌·‌·‌·‌</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_-_4_leading_spaces.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_-_4_leading_spaces.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 2, 1 ],
  [ 0, 4, 2 ],
  [ 0, 6, 3 ],
  [ 1, 0, 4 ],
  [ 1, 1, 5 ],
  [ 2, 0, 6 ],
  [ 2, 1, 7 ],
  [ 2, 2, 8 ],
  [ 2, 3, 9 ],
  [ 2, 4, 10 ],
  [ 2, 5, 11 ],
  [ 2, 6, 12 ],
  [ 2, 7, 13 ],
  [ 2, 8, 14 ],
  [ 2, 9, 15 ],
  [ 3, 0, 16 ],
  [ 3, 2, 17 ],
  [ 3, 4, 18 ],
  [ 3, 6, 19 ],
  [ 3, 8, 20 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_-_8_leading_spaces.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_-_8_leading_spaces.0.html

```html
<span class="mtkz" style="width:40px">·‌·‌·‌·‌</span><span class="mtkz" style="width:40px">·‌·‌·‌·‌</span><span class="mtk2">He</span><span class="mtk3">llo world!</span><span class="mtkz" style="width:40px">·‌·‌·‌·‌</span><span class="mtkz" style="width:40px">·‌·‌·‌·‌</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_-_8_leading_spaces.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_-_8_leading_spaces.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 2, 1 ],
  [ 0, 4, 2 ],
  [ 0, 6, 3 ],
  [ 1, 0, 4 ],
  [ 1, 2, 5 ],
  [ 1, 4, 6 ],
  [ 1, 6, 7 ],
  [ 2, 0, 8 ],
  [ 2, 1, 9 ],
  [ 3, 0, 10 ],
  [ 3, 1, 11 ],
  [ 3, 2, 12 ],
  [ 3, 3, 13 ],
  [ 3, 4, 14 ],
  [ 3, 5, 15 ],
  [ 3, 6, 16 ],
  [ 3, 7, 17 ],
  [ 3, 8, 18 ],
  [ 3, 9, 19 ],
  [ 4, 0, 20 ],
  [ 4, 2, 21 ],
  [ 4, 4, 22 ],
  [ 4, 6, 23 ],
  [ 5, 0, 24 ],
  [ 5, 2, 25 ],
  [ 5, 4, 26 ],
  [ 5, 6, 27 ],
  [ 5, 8, 28 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_-_mixed_leading_spaces_and_tabs.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_-_mixed_leading_spaces_and_tabs.0.html

```html
<span class="mtkz" style="width:40px">·‌·‌→ </span><span class="mtkz" style="width:40px">→   </span><span class="mtkz" style="width:20px">·‌·‌</span><span class="mtk2">He</span><span class="mtk3">llo world!</span><span class="mtkz" style="width:20px">·‌￫</span><span class="mtkz" style="width:40px">·‌·‌→ </span><span class="mtkz" style="width:40px">·‌·‌·‌￫</span><span class="mtkz" style="width:40px">·‌·‌·‌·‌</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_-_mixed_leading_spaces_and_tabs.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_-_mixed_leading_spaces_and_tabs.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 2, 1 ],
  [ 0, 4, 2 ],
  [ 1, 0, 4 ],
  [ 2, 0, 8 ],
  [ 2, 2, 9 ],
  [ 3, 0, 10 ],
  [ 3, 1, 11 ],
  [ 4, 0, 12 ],
  [ 4, 1, 13 ],
  [ 4, 2, 14 ],
  [ 4, 3, 15 ],
  [ 4, 4, 16 ],
  [ 4, 5, 17 ],
  [ 4, 6, 18 ],
  [ 4, 7, 19 ],
  [ 4, 8, 20 ],
  [ 4, 9, 21 ],
  [ 5, 0, 22 ],
  [ 5, 2, 23 ],
  [ 6, 0, 24 ],
  [ 6, 2, 25 ],
  [ 6, 4, 26 ],
  [ 7, 0, 28 ],
  [ 7, 2, 29 ],
  [ 7, 4, 30 ],
  [ 7, 6, 31 ],
  [ 8, 0, 32 ],
  [ 8, 2, 33 ],
  [ 8, 4, 34 ],
  [ 8, 6, 35 ],
  [ 8, 8, 36 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_all_in_middle.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_all_in_middle.0.html

```html
<span class="mtkz" style="width:10px">·‌</span><span class="mtk0">Hel</span><span class="mtk1">lo</span><span class="mtkz" style="width:10px">·‌</span><span class="mtk2">world!</span><span class="mtkz" style="width:30px">→  </span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_all_in_middle.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_all_in_middle.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 1, 0, 1 ],
  [ 1, 1, 2 ],
  [ 1, 2, 3 ],
  [ 2, 0, 4 ],
  [ 2, 1, 5 ],
  [ 3, 0, 6 ],
  [ 4, 0, 7 ],
  [ 4, 1, 8 ],
  [ 4, 2, 9 ],
  [ 4, 3, 10 ],
  [ 4, 4, 11 ],
  [ 4, 5, 12 ],
  [ 5, 0, 13 ],
  [ 5, 3, 16 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_multiple_selections.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_multiple_selections.0.html

```html
<span class="mtkz" style="width:10px">·‌</span><span class="mtk0">Hel</span><span class="mtk1">lo</span><span class="mtk2"> world!</span><span class="mtkz" style="width:30px">→  </span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_multiple_selections.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_multiple_selections.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 1, 0, 1 ],
  [ 1, 1, 2 ],
  [ 1, 2, 3 ],
  [ 2, 0, 4 ],
  [ 2, 1, 5 ],
  [ 3, 0, 6 ],
  [ 3, 1, 7 ],
  [ 3, 2, 8 ],
  [ 3, 3, 9 ],
  [ 3, 4, 10 ],
  [ 3, 5, 11 ],
  [ 3, 6, 12 ],
  [ 4, 0, 13 ],
  [ 4, 3, 16 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_multiple__initially_unsorted_selections.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_multiple__initially_unsorted_selections.0.html

```html
<span class="mtkz" style="width:10px">·‌</span><span class="mtk0">Hel</span><span class="mtk1">lo</span><span class="mtk2"> world!</span><span class="mtkz" style="width:30px">→  </span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_multiple__initially_unsorted_selections.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_multiple__initially_unsorted_selections.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 1, 0, 1 ],
  [ 1, 1, 2 ],
  [ 1, 2, 3 ],
  [ 2, 0, 4 ],
  [ 2, 1, 5 ],
  [ 3, 0, 6 ],
  [ 3, 1, 7 ],
  [ 3, 2, 8 ],
  [ 3, 3, 9 ],
  [ 3, 4, 10 ],
  [ 3, 5, 11 ],
  [ 3, 6, 12 ],
  [ 4, 0, 13 ],
  [ 4, 3, 16 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_no_selections.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_no_selections.0.html

```html
<span class="mtk0"> Hel</span><span class="mtk1">lo</span><span class="mtk2"> world!   </span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_no_selections.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_no_selections.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 1, 0, 4 ],
  [ 1, 1, 5 ],
  [ 2, 0, 6 ],
  [ 2, 1, 7 ],
  [ 2, 2, 8 ],
  [ 2, 3, 9 ],
  [ 2, 4, 10 ],
  [ 2, 5, 11 ],
  [ 2, 6, 12 ],
  [ 2, 7, 13 ],
  [ 2, 10, 16 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_selections_next_to_each_other.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_selections_next_to_each_other.0.html

```html
<span class="mtkz" style="width:10px">·‌</span><span class="mtk0">*</span><span class="mtkz" style="width:10px">·‌</span><span class="mtk0">S</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_selections_next_to_each_other.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_selections_next_to_each_other.1.snap

```text
[ [ 0, 0, 0 ], [ 1, 0, 1 ], [ 2, 0, 2 ], [ 3, 0, 3 ], [ 3, 1, 4 ] ]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_selection_spanning_part_of_whitespace.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_selection_spanning_part_of_whitespace.0.html

```html
<span class="mtkz" style="width:10px">·‌</span><span class="mtk0">Hel</span><span class="mtk1">lo</span><span class="mtk2"> world!   </span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_selection_spanning_part_of_whitespace.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_selection_spanning_part_of_whitespace.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 1, 0, 1 ],
  [ 1, 1, 2 ],
  [ 1, 2, 3 ],
  [ 2, 0, 4 ],
  [ 2, 1, 5 ],
  [ 3, 0, 6 ],
  [ 3, 1, 7 ],
  [ 3, 2, 8 ],
  [ 3, 3, 9 ],
  [ 3, 4, 10 ],
  [ 3, 5, 11 ],
  [ 3, 6, 12 ],
  [ 3, 7, 13 ],
  [ 3, 10, 16 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_whole_line_selection.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_whole_line_selection.0.html

```html
<span class="mtkz" style="width:10px">·‌</span><span class="mtk0">Hel</span><span class="mtk1">lo</span><span class="mtkz" style="width:10px">·‌</span><span class="mtk2">world!</span><span class="mtkz" style="width:30px">→  </span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_whole_line_selection.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_selection_with_whole_line_selection.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 1, 0, 1 ],
  [ 1, 1, 2 ],
  [ 1, 2, 3 ],
  [ 2, 0, 4 ],
  [ 2, 1, 5 ],
  [ 3, 0, 6 ],
  [ 4, 0, 7 ],
  [ 4, 1, 8 ],
  [ 4, 2, 9 ],
  [ 4, 3, 10 ],
  [ 4, 4, 11 ],
  [ 4, 5, 12 ],
  [ 5, 0, 13 ],
  [ 5, 3, 16 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_trailing_with_8_leading_and_8_trailing_whitespaces.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_trailing_with_8_leading_and_8_trailing_whitespaces.0.html

```html
<span class="mtk1">        </span><span class="mtk2">He</span><span class="mtk3">llo world!</span><span class="mtkz" style="width:40px">·‌·‌·‌·‌</span><span class="mtkz" style="width:40px">·‌·‌·‌·‌</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_trailing_with_8_leading_and_8_trailing_whitespaces.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_trailing_with_8_leading_and_8_trailing_whitespaces.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 0, 6, 6 ],
  [ 0, 7, 7 ],
  [ 1, 0, 8 ],
  [ 1, 1, 9 ],
  [ 2, 0, 10 ],
  [ 2, 1, 11 ],
  [ 2, 2, 12 ],
  [ 2, 3, 13 ],
  [ 2, 4, 14 ],
  [ 2, 5, 15 ],
  [ 2, 6, 16 ],
  [ 2, 7, 17 ],
  [ 2, 8, 18 ],
  [ 2, 9, 19 ],
  [ 3, 0, 20 ],
  [ 3, 2, 21 ],
  [ 3, 4, 22 ],
  [ 3, 6, 23 ],
  [ 4, 0, 24 ],
  [ 4, 2, 25 ],
  [ 4, 4, 26 ],
  [ 4, 6, 27 ],
  [ 4, 8, 28 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_trailing_with_leading__inner__and_trailing_whitespace.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_trailing_with_leading__inner__and_trailing_whitespace.0.html

```html
<span class="mtk0"> Hel</span><span class="mtk1">lo</span><span class="mtk2"> world!</span><span class="mtkz" style="width:30px">·‌→ </span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_trailing_with_leading__inner__and_trailing_whitespace.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_trailing_with_leading__inner__and_trailing_whitespace.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 1, 0, 4 ],
  [ 1, 1, 5 ],
  [ 2, 0, 6 ],
  [ 2, 1, 7 ],
  [ 2, 2, 8 ],
  [ 2, 3, 9 ],
  [ 2, 4, 10 ],
  [ 2, 5, 11 ],
  [ 2, 6, 12 ],
  [ 3, 0, 13 ],
  [ 3, 2, 14 ],
  [ 3, 4, 16 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_trailing_with_leading__inner__and_without_trailing_whitespace.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_trailing_with_leading__inner__and_without_trailing_whitespace.0.html

```html
<span class="mtk0"> Hel</span><span class="mtk1">lo</span><span class="mtk2"> world!</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_trailing_with_leading__inner__and_without_trailing_whitespace.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_trailing_with_leading__inner__and_without_trailing_whitespace.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 1, 0, 4 ],
  [ 1, 1, 5 ],
  [ 2, 0, 6 ],
  [ 2, 1, 7 ],
  [ 2, 2, 8 ],
  [ 2, 3, 9 ],
  [ 2, 4, 10 ],
  [ 2, 5, 11 ],
  [ 2, 6, 12 ],
  [ 2, 7, 13 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_trailing_with_line_containing_only_whitespaces.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_trailing_with_line_containing_only_whitespaces.0.html

```html
<span class="mtkz" style="width:40px">·‌→  </span><span class="mtkz" style="width:10px">·‌</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_trailing_with_line_containing_only_whitespaces.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_for_trailing_with_line_containing_only_whitespaces.1.snap

```text
[ [ 0, 0, 0 ], [ 0, 2, 1 ], [ 1, 0, 4 ], [ 1, 2, 5 ] ]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_in_middle_but_not_for_one_space.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_in_middle_but_not_for_one_space.0.html

```html
<span class="mtk1">it</span><span class="mtkz" style="width:20px">·‌·‌</span><span class="mtk1">it</span><span class="mtk2"> </span><span class="mtk3">it</span><span class="mtkz" style="width:20px">·‌·‌</span><span class="mtk3">it</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_in_middle_but_not_for_one_space.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_in_middle_but_not_for_one_space.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 1, 0, 2 ],
  [ 1, 2, 3 ],
  [ 2, 0, 4 ],
  [ 2, 1, 5 ],
  [ 3, 0, 6 ],
  [ 4, 0, 7 ],
  [ 4, 1, 8 ],
  [ 5, 0, 9 ],
  [ 5, 2, 10 ],
  [ 6, 0, 11 ],
  [ 6, 1, 12 ],
  [ 6, 2, 13 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_skips_faux_indent.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_skips_faux_indent.0.html

```html
<span class="">        </span><span class="mtkz" style="width:20px">·‌·‌</span><span class="mtk2">He</span><span class="mtk3">llo world!</span><span class="mtkz" style="width:20px">·‌￫</span><span class="mtkz" style="width:40px">·‌·‌→ </span><span class="mtkz" style="width:40px">·‌·‌·‌￫</span><span class="mtkz" style="width:40px">·‌·‌·‌·‌</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_skips_faux_indent.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_render_whitespace_skips_faux_indent.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 4, 4 ],
  [ 1, 0, 8 ],
  [ 1, 2, 9 ],
  [ 2, 0, 10 ],
  [ 2, 1, 11 ],
  [ 3, 0, 12 ],
  [ 3, 1, 13 ],
  [ 3, 2, 14 ],
  [ 3, 3, 15 ],
  [ 3, 4, 16 ],
  [ 3, 5, 17 ],
  [ 3, 6, 18 ],
  [ 3, 7, 19 ],
  [ 3, 8, 20 ],
  [ 3, 9, 21 ],
  [ 4, 0, 22 ],
  [ 4, 2, 23 ],
  [ 5, 0, 24 ],
  [ 5, 2, 25 ],
  [ 5, 4, 26 ],
  [ 6, 0, 28 ],
  [ 6, 2, 29 ],
  [ 6, 4, 30 ],
  [ 6, 6, 31 ],
  [ 7, 0, 32 ],
  [ 7, 2, 33 ],
  [ 7, 4, 34 ],
  [ 7, 6, 35 ],
  [ 7, 8, 36 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_simple.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_simple.0.html

```html
<span class="mtk1">Hello world!</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_simple.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_simple.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 0, 6, 6 ],
  [ 0, 7, 7 ],
  [ 0, 8, 8 ],
  [ 0, 9, 9 ],
  [ 0, 10, 10 ],
  [ 0, 11, 11 ],
  [ 0, 12, 12 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_simple_two_tokens.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_simple_two_tokens.0.html

```html
<span class="mtk1">Hello </span><span class="mtk2">world!</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_simple_two_tokens.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_createLineParts_simple_two_tokens.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 1, 0, 6 ],
  [ 1, 1, 7 ],
  [ 1, 2, 8 ],
  [ 1, 3, 9 ],
  [ 1, 4, 10 ],
  [ 1, 5, 11 ],
  [ 1, 6, 12 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__11485__Visible_whitespace_conflicts_with_before_decorator_attachment.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__11485__Visible_whitespace_conflicts_with_before_decorator_attachment.0.html

```html
<span class="mtkw before">→   </span><span class="mtk3">bla</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__11485__Visible_whitespace_conflicts_with_before_decorator_attachment.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__11485__Visible_whitespace_conflicts_with_before_decorator_attachment.1.snap

```text
[ [ 0, 0, 0 ], [ 1, 0, 4 ], [ 1, 1, 5 ], [ 1, 2, 6 ], [ 1, 3, 7 ] ]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__116939__Important_control_characters_aren_t_rendered.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__116939__Important_control_characters_aren_t_rendered.0.html

```html
<span class="mtk3">transferBalance(5678,</span><span class="mtkcontrol">[U+202E]</span><span class="mtk3">6776,4321</span><span class="mtkcontrol">[U+202C]</span><span class="mtk3">,"USD");</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__116939__Important_control_characters_aren_t_rendered.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__116939__Important_control_characters_aren_t_rendered.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 0, 6, 6 ],
  [ 0, 7, 7 ],
  [ 0, 8, 8 ],
  [ 0, 9, 9 ],
  [ 0, 10, 10 ],
  [ 0, 11, 11 ],
  [ 0, 12, 12 ],
  [ 0, 13, 13 ],
  [ 0, 14, 14 ],
  [ 0, 15, 15 ],
  [ 0, 16, 16 ],
  [ 0, 17, 17 ],
  [ 0, 18, 18 ],
  [ 0, 19, 19 ],
  [ 0, 20, 20 ],
  [ 1, 0, 21 ],
  [ 2, 0, 29 ],
  [ 2, 1, 30 ],
  [ 2, 2, 31 ],
  [ 2, 3, 32 ],
  [ 2, 4, 33 ],
  [ 2, 5, 34 ],
  [ 2, 6, 35 ],
  [ 2, 7, 36 ],
  [ 2, 8, 37 ],
  [ 3, 0, 38 ],
  [ 4, 0, 46 ],
  [ 4, 1, 47 ],
  [ 4, 2, 48 ],
  [ 4, 3, 49 ],
  [ 4, 4, 50 ],
  [ 4, 5, 51 ],
  [ 4, 6, 52 ],
  [ 4, 7, 53 ],
  [ 4, 8, 54 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__118759__enable_multiple_text_editor_decorations_in_empty_lines.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__118759__enable_multiple_text_editor_decorations_in_empty_lines.0.html

```html
<span class="before1"></span><span class="before2"></span><span class="after1"></span><span class="after2"></span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__118759__enable_multiple_text_editor_decorations_in_empty_lines.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__118759__enable_multiple_text_editor_decorations_in_empty_lines.1.snap

```text
[ [ 2, 0, 0 ] ]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__119416__Delete_Control_Character__U_007F_____127___displayed_as_space.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__119416__Delete_Control_Character__U_007F_____127___displayed_as_space.0.html

```html
<span class="mtk3">[␡] [␀]</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__119416__Delete_Control_Character__U_007F_____127___displayed_as_space.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__119416__Delete_Control_Character__U_007F_____127___displayed_as_space.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 0, 6, 6 ],
  [ 0, 7, 7 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__124038__Multiple_end-of-line_text_decorations_get_merged.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__124038__Multiple_end-of-line_text_decorations_get_merged.0.html

```html
<span class="mtkw">·‌·‌·‌·‌</span><span class="mtk2">if</span><span class="ced-1-TextEditorDecorationType2-17c14d98-3 ced-1-TextEditorDecorationType2-3"></span><span class="ced-1-TextEditorDecorationType2-17c14d98-4 ced-1-TextEditorDecorationType2-4"></span><span class="ced-ghost-text-1-4"></span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__124038__Multiple_end-of-line_text_decorations_get_merged.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__124038__Multiple_end-of-line_text_decorations_get_merged.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 2, 1 ],
  [ 0, 4, 2 ],
  [ 0, 6, 3 ],
  [ 1, 0, 4 ],
  [ 1, 1, 5 ],
  [ 3, 0, 6 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__136622__Inline_decorations_are_not_rendering_on_non-ASCII_lines_when_renderControlCharacters_is_on.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__136622__Inline_decorations_are_not_rendering_on_non-ASCII_lines_when_renderControlCharacters_is_on.0.html

```html
<span class="mtk3">some</span><span class="mtk3 inlineDec1"></span><span class="mtk3"> </span><span class="mtk3 inlineDec2"></span><span class="mtk3">text £</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__136622__Inline_decorations_are_not_rendering_on_non-ASCII_lines_when_renderControlCharacters_is_on.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__136622__Inline_decorations_are_not_rendering_on_non-ASCII_lines_when_renderControlCharacters_is_on.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 1, 0, 4 ],
  [ 4, 0, 5 ],
  [ 4, 1, 6 ],
  [ 4, 2, 7 ],
  [ 4, 3, 8 ],
  [ 4, 4, 9 ],
  [ 4, 5, 10 ],
  [ 4, 6, 11 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__18616__Inline_decorations_ending_at_the_text_length_are_no_longer_rendered.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__18616__Inline_decorations_ending_at_the_text_length_are_no_longer_rendered.0.html

```html
<span class="mtk3 link">https://microsoft.com</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__18616__Inline_decorations_ending_at_the_text_length_are_no_longer_rendered.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__18616__Inline_decorations_ending_at_the_text_length_are_no_longer_rendered.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 0, 6, 6 ],
  [ 0, 7, 7 ],
  [ 0, 8, 8 ],
  [ 0, 9, 9 ],
  [ 0, 10, 10 ],
  [ 0, 11, 11 ],
  [ 0, 12, 12 ],
  [ 0, 13, 13 ],
  [ 0, 14, 14 ],
  [ 0, 15, 15 ],
  [ 0, 16, 16 ],
  [ 0, 17, 17 ],
  [ 0, 18, 18 ],
  [ 0, 19, 19 ],
  [ 0, 20, 20 ],
  [ 0, 21, 21 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__19207__Link_in_Monokai_is_not_rendered_correctly.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__19207__Link_in_Monokai_is_not_rendered_correctly.0.html

```html
<span class="mtk6">'let url = `</span><span class="mtk6 detected-link">http://***/_api/web/lists/GetByTitle(</span><span class="mtk4 detected-link">\</span><span class="mtk4">'</span><span class="mtk6">Teambuildingaanvragen</span><span class="mtk4">\'</span><span class="mtk6">)/items`;'</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__19207__Link_in_Monokai_is_not_rendered_correctly.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__19207__Link_in_Monokai_is_not_rendered_correctly.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 0, 6, 6 ],
  [ 0, 7, 7 ],
  [ 0, 8, 8 ],
  [ 0, 9, 9 ],
  [ 0, 10, 10 ],
  [ 0, 11, 11 ],
  [ 1, 0, 12 ],
  [ 1, 1, 13 ],
  [ 1, 2, 14 ],
  [ 1, 3, 15 ],
  [ 1, 4, 16 ],
  [ 1, 5, 17 ],
  [ 1, 6, 18 ],
  [ 1, 7, 19 ],
  [ 1, 8, 20 ],
  [ 1, 9, 21 ],
  [ 1, 10, 22 ],
  [ 1, 11, 23 ],
  [ 1, 12, 24 ],
  [ 1, 13, 25 ],
  [ 1, 14, 26 ],
  [ 1, 15, 27 ],
  [ 1, 16, 28 ],
  [ 1, 17, 29 ],
  [ 1, 18, 30 ],
  [ 1, 19, 31 ],
  [ 1, 20, 32 ],
  [ 1, 21, 33 ],
  [ 1, 22, 34 ],
  [ 1, 23, 35 ],
  [ 1, 24, 36 ],
  [ 1, 25, 37 ],
  [ 1, 26, 38 ],
  [ 1, 27, 39 ],
  [ 1, 28, 40 ],
  [ 1, 29, 41 ],
  [ 1, 30, 42 ],
  [ 1, 31, 43 ],
  [ 1, 32, 44 ],
  [ 1, 33, 45 ],
  [ 1, 34, 46 ],
  [ 1, 35, 47 ],
  [ 1, 36, 48 ],
  [ 2, 0, 49 ],
  [ 3, 0, 50 ],
  [ 4, 0, 51 ],
  [ 4, 1, 52 ],
  [ 4, 2, 53 ],
  [ 4, 3, 54 ],
  [ 4, 4, 55 ],
  [ 4, 5, 56 ],
  [ 4, 6, 57 ],
  [ 4, 7, 58 ],
  [ 4, 8, 59 ],
  [ 4, 9, 60 ],
  [ 4, 10, 61 ],
  [ 4, 11, 62 ],
  [ 4, 12, 63 ],
  [ 4, 13, 64 ],
  [ 4, 14, 65 ],
  [ 4, 15, 66 ],
  [ 4, 16, 67 ],
  [ 4, 17, 68 ],
  [ 4, 18, 69 ],
  [ 4, 19, 70 ],
  [ 4, 20, 71 ],
  [ 5, 0, 72 ],
  [ 5, 1, 73 ],
  [ 6, 0, 74 ],
  [ 6, 1, 75 ],
  [ 6, 2, 76 ],
  [ 6, 3, 77 ],
  [ 6, 4, 78 ],
  [ 6, 5, 79 ],
  [ 6, 6, 80 ],
  [ 6, 7, 81 ],
  [ 6, 8, 82 ],
  [ 6, 9, 83 ],
  [ 6, 10, 84 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__22352__COMBINING_ACUTE_ACCENT__U_0301_.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__22352__COMBINING_ACUTE_ACCENT__U_0301_.0.html

```html
<span class="mtk3">12345689012345678901234568901234567890123456890abába</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__22352__COMBINING_ACUTE_ACCENT__U_0301_.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__22352__COMBINING_ACUTE_ACCENT__U_0301_.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 0, 6, 6 ],
  [ 0, 7, 7 ],
  [ 0, 8, 8 ],
  [ 0, 9, 9 ],
  [ 0, 10, 10 ],
  [ 0, 11, 11 ],
  [ 0, 12, 12 ],
  [ 0, 13, 13 ],
  [ 0, 14, 14 ],
  [ 0, 15, 15 ],
  [ 0, 16, 16 ],
  [ 0, 17, 17 ],
  [ 0, 18, 18 ],
  [ 0, 19, 19 ],
  [ 0, 20, 20 ],
  [ 0, 21, 21 ],
  [ 0, 22, 22 ],
  [ 0, 23, 23 ],
  [ 0, 24, 24 ],
  [ 0, 25, 25 ],
  [ 0, 26, 26 ],
  [ 0, 27, 27 ],
  [ 0, 28, 28 ],
  [ 0, 29, 29 ],
  [ 0, 30, 30 ],
  [ 0, 31, 31 ],
  [ 0, 32, 32 ],
  [ 0, 33, 33 ],
  [ 0, 34, 34 ],
  [ 0, 35, 35 ],
  [ 0, 36, 36 ],
  [ 0, 37, 37 ],
  [ 0, 38, 38 ],
  [ 0, 39, 39 ],
  [ 0, 40, 40 ],
  [ 0, 41, 41 ],
  [ 0, 42, 42 ],
  [ 0, 43, 43 ],
  [ 0, 44, 44 ],
  [ 0, 45, 45 ],
  [ 0, 46, 46 ],
  [ 0, 47, 47 ],
  [ 0, 48, 48 ],
  [ 0, 49, 49 ],
  [ 0, 50, 50 ],
  [ 0, 51, 51 ],
  [ 0, 52, 52 ],
  [ 0, 53, 53 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__22352__Partially_Broken_Complex_Script_Rendering_of_Tamil.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__22352__Partially_Broken_Complex_Script_Rendering_of_Tamil.0.html

```html
<span class="mtk3"> JoyShareல் பின்தொடர்ந்து, விடீயோ, ஜோக்குகள், </span><span class="mtk3">அனிமேசன், நகைச்சுவை படங்கள் மற்றும் செய்திகளை </span><span class="mtk3">பெறுவீர்</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__22352__Partially_Broken_Complex_Script_Rendering_of_Tamil.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__22352__Partially_Broken_Complex_Script_Rendering_of_Tamil.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 0, 6, 6 ],
  [ 0, 7, 7 ],
  [ 0, 8, 8 ],
  [ 0, 9, 9 ],
  [ 0, 10, 10 ],
  [ 0, 11, 11 ],
  [ 0, 12, 12 ],
  [ 0, 13, 13 ],
  [ 0, 14, 14 ],
  [ 0, 15, 15 ],
  [ 0, 16, 16 ],
  [ 0, 17, 17 ],
  [ 0, 18, 18 ],
  [ 0, 19, 19 ],
  [ 0, 20, 20 ],
  [ 0, 21, 21 ],
  [ 0, 22, 22 ],
  [ 0, 23, 23 ],
  [ 0, 24, 24 ],
  [ 0, 25, 25 ],
  [ 0, 26, 26 ],
  [ 0, 27, 27 ],
  [ 0, 28, 28 ],
  [ 0, 29, 29 ],
  [ 0, 30, 30 ],
  [ 0, 31, 31 ],
  [ 0, 32, 32 ],
  [ 0, 33, 33 ],
  [ 0, 34, 34 ],
  [ 0, 35, 35 ],
  [ 0, 36, 36 ],
  [ 0, 37, 37 ],
  [ 0, 38, 38 ],
  [ 0, 39, 39 ],
  [ 0, 40, 40 ],
  [ 0, 41, 41 ],
  [ 0, 42, 42 ],
  [ 0, 43, 43 ],
  [ 0, 44, 44 ],
  [ 0, 45, 45 ],
  [ 1, 0, 46 ],
  [ 1, 1, 47 ],
  [ 1, 2, 48 ],
  [ 1, 3, 49 ],
  [ 1, 4, 50 ],
  [ 1, 5, 51 ],
  [ 1, 6, 52 ],
  [ 1, 7, 53 ],
  [ 1, 8, 54 ],
  [ 1, 9, 55 ],
  [ 1, 10, 56 ],
  [ 1, 11, 57 ],
  [ 1, 12, 58 ],
  [ 1, 13, 59 ],
  [ 1, 14, 60 ],
  [ 1, 15, 61 ],
  [ 1, 16, 62 ],
  [ 1, 17, 63 ],
  [ 1, 18, 64 ],
  [ 1, 19, 65 ],
  [ 1, 20, 66 ],
  [ 1, 21, 67 ],
  [ 1, 22, 68 ],
  [ 1, 23, 69 ],
  [ 1, 24, 70 ],
  [ 1, 25, 71 ],
  [ 1, 26, 72 ],
  [ 1, 27, 73 ],
  [ 1, 28, 74 ],
  [ 1, 29, 75 ],
  [ 1, 30, 76 ],
  [ 1, 31, 77 ],
  [ 1, 32, 78 ],
  [ 1, 33, 79 ],
  [ 1, 34, 80 ],
  [ 1, 35, 81 ],
  [ 1, 36, 82 ],
  [ 1, 37, 83 ],
  [ 1, 38, 84 ],
  [ 1, 39, 85 ],
  [ 1, 40, 86 ],
  [ 1, 41, 87 ],
  [ 1, 42, 88 ],
  [ 1, 43, 89 ],
  [ 1, 44, 90 ],
  [ 1, 45, 91 ],
  [ 2, 0, 92 ],
  [ 2, 1, 93 ],
  [ 2, 2, 94 ],
  [ 2, 3, 95 ],
  [ 2, 4, 96 ],
  [ 2, 5, 97 ],
  [ 2, 6, 98 ],
  [ 2, 7, 99 ],
  [ 2, 8, 100 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__22832__Consider_fullwidth_characters_when_rendering_tabs.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__22832__Consider_fullwidth_characters_when_rendering_tabs.0.html

```html
<span class="mtk3">asd = "擦"      #asd</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__22832__Consider_fullwidth_characters_when_rendering_tabs.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__22832__Consider_fullwidth_characters_when_rendering_tabs.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 0, 6, 6 ],
  [ 0, 7, 7 ],
  [ 0, 8, 9 ],
  [ 0, 9, 10 ],
  [ 0, 11, 12 ],
  [ 0, 15, 16 ],
  [ 0, 16, 17 ],
  [ 0, 17, 18 ],
  [ 0, 18, 19 ],
  [ 0, 19, 20 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__22832__Consider_fullwidth_characters_when_rendering_tabs__render_whitespace_.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__22832__Consider_fullwidth_characters_when_rendering_tabs__render_whitespace_.0.html

```html
<span class="mtk3">asd</span><span class="mtkw">·‌</span><span class="mtk3">=</span><span class="mtkw">·‌</span><span class="mtk3">"擦"</span><span class="mtkw">→ →   </span><span class="mtk3">#asd</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__22832__Consider_fullwidth_characters_when_rendering_tabs__render_whitespace_.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__22832__Consider_fullwidth_characters_when_rendering_tabs__render_whitespace_.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 1, 0, 3 ],
  [ 2, 0, 4 ],
  [ 3, 0, 5 ],
  [ 4, 0, 6 ],
  [ 4, 1, 7 ],
  [ 4, 2, 9 ],
  [ 5, 0, 10 ],
  [ 5, 2, 12 ],
  [ 6, 0, 16 ],
  [ 6, 1, 17 ],
  [ 6, 2, 18 ],
  [ 6, 3, 19 ],
  [ 6, 4, 20 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__30133__Empty_lines_don_t_render_inline_decorations.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__30133__Empty_lines_don_t_render_inline_decorations.0.html

```html
<span class="before"></span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__30133__Empty_lines_don_t_render_inline_decorations.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__30133__Empty_lines_don_t_render_inline_decorations.1.snap

```text
[ [ 1, 0, 0 ] ]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__32436__Non-monospace_font___visible_whitespace___After_decorator_causes_line_to__jump_.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__32436__Non-monospace_font___visible_whitespace___After_decorator_causes_line_to__jump_.0.html

```html
<span class="mtkz" style="width:40px">→   </span><span class="mtk3 before">b</span><span class="mtk3">la</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__32436__Non-monospace_font___visible_whitespace___After_decorator_causes_line_to__jump_.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__32436__Non-monospace_font___visible_whitespace___After_decorator_causes_line_to__jump_.1.snap

```text
[ [ 0, 0, 0 ], [ 1, 0, 4 ], [ 2, 0, 5 ], [ 2, 1, 6 ], [ 2, 2, 7 ] ]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__33525__Long_line_with_ligatures_takes_a_long_time_to_paint_decorations.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__33525__Long_line_with_ligatures_takes_a_long_time_to_paint_decorations.0.html

```html
<span class="mtk3">append data to append data to append data to </span><span class="mtk3">append data to append data to append data to </span><span class="mtk3">append data to append data to append data to </span><span class="mtk3">append data to append data to append data to </span><span class="mtk3">append data to</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__33525__Long_line_with_ligatures_takes_a_long_time_to_paint_decorations.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__33525__Long_line_with_ligatures_takes_a_long_time_to_paint_decorations.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 0, 6, 6 ],
  [ 0, 7, 7 ],
  [ 0, 8, 8 ],
  [ 0, 9, 9 ],
  [ 0, 10, 10 ],
  [ 0, 11, 11 ],
  [ 0, 12, 12 ],
  [ 0, 13, 13 ],
  [ 0, 14, 14 ],
  [ 0, 15, 15 ],
  [ 0, 16, 16 ],
  [ 0, 17, 17 ],
  [ 0, 18, 18 ],
  [ 0, 19, 19 ],
  [ 0, 20, 20 ],
  [ 0, 21, 21 ],
  [ 0, 22, 22 ],
  [ 0, 23, 23 ],
  [ 0, 24, 24 ],
  [ 0, 25, 25 ],
  [ 0, 26, 26 ],
  [ 0, 27, 27 ],
  [ 0, 28, 28 ],
  [ 0, 29, 29 ],
  [ 0, 30, 30 ],
  [ 0, 31, 31 ],
  [ 0, 32, 32 ],
  [ 0, 33, 33 ],
  [ 0, 34, 34 ],
  [ 0, 35, 35 ],
  [ 0, 36, 36 ],
  [ 0, 37, 37 ],
  [ 0, 38, 38 ],
  [ 0, 39, 39 ],
  [ 0, 40, 40 ],
  [ 0, 41, 41 ],
  [ 0, 42, 42 ],
  [ 0, 43, 43 ],
  [ 0, 44, 44 ],
  [ 1, 0, 45 ],
  [ 1, 1, 46 ],
  [ 1, 2, 47 ],
  [ 1, 3, 48 ],
  [ 1, 4, 49 ],
  [ 1, 5, 50 ],
  [ 1, 6, 51 ],
  [ 1, 7, 52 ],
  [ 1, 8, 53 ],
  [ 1, 9, 54 ],
  [ 1, 10, 55 ],
  [ 1, 11, 56 ],
  [ 1, 12, 57 ],
  [ 1, 13, 58 ],
  [ 1, 14, 59 ],
  [ 1, 15, 60 ],
  [ 1, 16, 61 ],
  [ 1, 17, 62 ],
  [ 1, 18, 63 ],
  [ 1, 19, 64 ],
  [ 1, 20, 65 ],
  [ 1, 21, 66 ],
  [ 1, 22, 67 ],
  [ 1, 23, 68 ],
  [ 1, 24, 69 ],
  [ 1, 25, 70 ],
  [ 1, 26, 71 ],
  [ 1, 27, 72 ],
  [ 1, 28, 73 ],
  [ 1, 29, 74 ],
  [ 1, 30, 75 ],
  [ 1, 31, 76 ],
  [ 1, 32, 77 ],
  [ 1, 33, 78 ],
  [ 1, 34, 79 ],
  [ 1, 35, 80 ],
  [ 1, 36, 81 ],
  [ 1, 37, 82 ],
  [ 1, 38, 83 ],
  [ 1, 39, 84 ],
  [ 1, 40, 85 ],
  [ 1, 41, 86 ],
  [ 1, 42, 87 ],
  [ 1, 43, 88 ],
  [ 1, 44, 89 ],
  [ 2, 0, 90 ],
  [ 2, 1, 91 ],
  [ 2, 2, 92 ],
  [ 2, 3, 93 ],
  [ 2, 4, 94 ],
  [ 2, 5, 95 ],
  [ 2, 6, 96 ],
  [ 2, 7, 97 ],
  [ 2, 8, 98 ],
  [ 2, 9, 99 ],
  [ 2, 10, 100 ],
  [ 2, 11, 101 ],
  [ 2, 12, 102 ],
  [ 2, 13, 103 ],
  [ 2, 14, 104 ],
  [ 2, 15, 105 ],
  [ 2, 16, 106 ],
  [ 2, 17, 107 ],
  [ 2, 18, 108 ],
  [ 2, 19, 109 ],
  [ 2, 20, 110 ],
  [ 2, 21, 111 ],
  [ 2, 22, 112 ],
  [ 2, 23, 113 ],
  [ 2, 24, 114 ],
  [ 2, 25, 115 ],
  [ 2, 26, 116 ],
  [ 2, 27, 117 ],
  [ 2, 28, 118 ],
  [ 2, 29, 119 ],
  [ 2, 30, 120 ],
  [ 2, 31, 121 ],
  [ 2, 32, 122 ],
  [ 2, 33, 123 ],
  [ 2, 34, 124 ],
  [ 2, 35, 125 ],
  [ 2, 36, 126 ],
  [ 2, 37, 127 ],
  [ 2, 38, 128 ],
  [ 2, 39, 129 ],
  [ 2, 40, 130 ],
  [ 2, 41, 131 ],
  [ 2, 42, 132 ],
  [ 2, 43, 133 ],
  [ 2, 44, 134 ],
  [ 3, 0, 135 ],
  [ 3, 1, 136 ],
  [ 3, 2, 137 ],
  [ 3, 3, 138 ],
  [ 3, 4, 139 ],
  [ 3, 5, 140 ],
  [ 3, 6, 141 ],
  [ 3, 7, 142 ],
  [ 3, 8, 143 ],
  [ 3, 9, 144 ],
  [ 3, 10, 145 ],
  [ 3, 11, 146 ],
  [ 3, 12, 147 ],
  [ 3, 13, 148 ],
  [ 3, 14, 149 ],
  [ 3, 15, 150 ],
  [ 3, 16, 151 ],
  [ 3, 17, 152 ],
  [ 3, 18, 153 ],
  [ 3, 19, 154 ],
  [ 3, 20, 155 ],
  [ 3, 21, 156 ],
  [ 3, 22, 157 ],
  [ 3, 23, 158 ],
  [ 3, 24, 159 ],
  [ 3, 25, 160 ],
  [ 3, 26, 161 ],
  [ 3, 27, 162 ],
  [ 3, 28, 163 ],
  [ 3, 29, 164 ],
  [ 3, 30, 165 ],
  [ 3, 31, 166 ],
  [ 3, 32, 167 ],
  [ 3, 33, 168 ],
  [ 3, 34, 169 ],
  [ 3, 35, 170 ],
  [ 3, 36, 171 ],
  [ 3, 37, 172 ],
  [ 3, 38, 173 ],
  [ 3, 39, 174 ],
  [ 3, 40, 175 ],
  [ 3, 41, 176 ],
  [ 3, 42, 177 ],
  [ 3, 43, 178 ],
  [ 3, 44, 179 ],
  [ 4, 0, 180 ],
  [ 4, 1, 181 ],
  [ 4, 2, 182 ],
  [ 4, 3, 183 ],
  [ 4, 4, 184 ],
  [ 4, 5, 185 ],
  [ 4, 6, 186 ],
  [ 4, 7, 187 ],
  [ 4, 8, 188 ],
  [ 4, 9, 189 ],
  [ 4, 10, 190 ],
  [ 4, 11, 191 ],
  [ 4, 12, 192 ],
  [ 4, 13, 193 ],
  [ 4, 14, 194 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__33525__Long_line_with_ligatures_takes_a_long_time_to_paint_decorations_-_not_possible.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__33525__Long_line_with_ligatures_takes_a_long_time_to_paint_decorations_-_not_possible.0.html

```html
<span class="mtk3">appenddatatoappenddatatoappenddatatoappenddatatoappenddatatoappenddatatoappenddatatoappenddatatoappenddatatoappenddatatoappenddatatoappenddatatoappenddatato</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__33525__Long_line_with_ligatures_takes_a_long_time_to_paint_decorations_-_not_possible.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__33525__Long_line_with_ligatures_takes_a_long_time_to_paint_decorations_-_not_possible.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 0, 6, 6 ],
  [ 0, 7, 7 ],
  [ 0, 8, 8 ],
  [ 0, 9, 9 ],
  [ 0, 10, 10 ],
  [ 0, 11, 11 ],
  [ 0, 12, 12 ],
  [ 0, 13, 13 ],
  [ 0, 14, 14 ],
  [ 0, 15, 15 ],
  [ 0, 16, 16 ],
  [ 0, 17, 17 ],
  [ 0, 18, 18 ],
  [ 0, 19, 19 ],
  [ 0, 20, 20 ],
  [ 0, 21, 21 ],
  [ 0, 22, 22 ],
  [ 0, 23, 23 ],
  [ 0, 24, 24 ],
  [ 0, 25, 25 ],
  [ 0, 26, 26 ],
  [ 0, 27, 27 ],
  [ 0, 28, 28 ],
  [ 0, 29, 29 ],
  [ 0, 30, 30 ],
  [ 0, 31, 31 ],
  [ 0, 32, 32 ],
  [ 0, 33, 33 ],
  [ 0, 34, 34 ],
  [ 0, 35, 35 ],
  [ 0, 36, 36 ],
  [ 0, 37, 37 ],
  [ 0, 38, 38 ],
  [ 0, 39, 39 ],
  [ 0, 40, 40 ],
  [ 0, 41, 41 ],
  [ 0, 42, 42 ],
  [ 0, 43, 43 ],
  [ 0, 44, 44 ],
  [ 0, 45, 45 ],
  [ 0, 46, 46 ],
  [ 0, 47, 47 ],
  [ 0, 48, 48 ],
  [ 0, 49, 49 ],
  [ 0, 50, 50 ],
  [ 0, 51, 51 ],
  [ 0, 52, 52 ],
  [ 0, 53, 53 ],
  [ 0, 54, 54 ],
  [ 0, 55, 55 ],
  [ 0, 56, 56 ],
  [ 0, 57, 57 ],
  [ 0, 58, 58 ],
  [ 0, 59, 59 ],
  [ 0, 60, 60 ],
  [ 0, 61, 61 ],
  [ 0, 62, 62 ],
  [ 0, 63, 63 ],
  [ 0, 64, 64 ],
  [ 0, 65, 65 ],
  [ 0, 66, 66 ],
  [ 0, 67, 67 ],
  [ 0, 68, 68 ],
  [ 0, 69, 69 ],
  [ 0, 70, 70 ],
  [ 0, 71, 71 ],
  [ 0, 72, 72 ],
  [ 0, 73, 73 ],
  [ 0, 74, 74 ],
  [ 0, 75, 75 ],
  [ 0, 76, 76 ],
  [ 0, 77, 77 ],
  [ 0, 78, 78 ],
  [ 0, 79, 79 ],
  [ 0, 80, 80 ],
  [ 0, 81, 81 ],
  [ 0, 82, 82 ],
  [ 0, 83, 83 ],
  [ 0, 84, 84 ],
  [ 0, 85, 85 ],
  [ 0, 86, 86 ],
  [ 0, 87, 87 ],
  [ 0, 88, 88 ],
  [ 0, 89, 89 ],
  [ 0, 90, 90 ],
  [ 0, 91, 91 ],
  [ 0, 92, 92 ],
  [ 0, 93, 93 ],
  [ 0, 94, 94 ],
  [ 0, 95, 95 ],
  [ 0, 96, 96 ],
  [ 0, 97, 97 ],
  [ 0, 98, 98 ],
  [ 0, 99, 99 ],
  [ 0, 100, 100 ],
  [ 0, 101, 101 ],
  [ 0, 102, 102 ],
  [ 0, 103, 103 ],
  [ 0, 104, 104 ],
  [ 0, 105, 105 ],
  [ 0, 106, 106 ],
  [ 0, 107, 107 ],
  [ 0, 108, 108 ],
  [ 0, 109, 109 ],
  [ 0, 110, 110 ],
  [ 0, 111, 111 ],
  [ 0, 112, 112 ],
  [ 0, 113, 113 ],
  [ 0, 114, 114 ],
  [ 0, 115, 115 ],
  [ 0, 116, 116 ],
  [ 0, 117, 117 ],
  [ 0, 118, 118 ],
  [ 0, 119, 119 ],
  [ 0, 120, 120 ],
  [ 0, 121, 121 ],
  [ 0, 122, 122 ],
  [ 0, 123, 123 ],
  [ 0, 124, 124 ],
  [ 0, 125, 125 ],
  [ 0, 126, 126 ],
  [ 0, 127, 127 ],
  [ 0, 128, 128 ],
  [ 0, 129, 129 ],
  [ 0, 130, 130 ],
  [ 0, 131, 131 ],
  [ 0, 132, 132 ],
  [ 0, 133, 133 ],
  [ 0, 134, 134 ],
  [ 0, 135, 135 ],
  [ 0, 136, 136 ],
  [ 0, 137, 137 ],
  [ 0, 138, 138 ],
  [ 0, 139, 139 ],
  [ 0, 140, 140 ],
  [ 0, 141, 141 ],
  [ 0, 142, 142 ],
  [ 0, 143, 143 ],
  [ 0, 144, 144 ],
  [ 0, 145, 145 ],
  [ 0, 146, 146 ],
  [ 0, 147, 147 ],
  [ 0, 148, 148 ],
  [ 0, 149, 149 ],
  [ 0, 150, 150 ],
  [ 0, 151, 151 ],
  [ 0, 152, 152 ],
  [ 0, 153, 153 ],
  [ 0, 154, 154 ],
  [ 0, 155, 155 ],
  [ 0, 156, 156 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__37208__Collapsing_bullet_point_containing_emoji_in_Markdown_document_results_in______character.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__37208__Collapsing_bullet_point_containing_emoji_in_Markdown_document_results_in______character.0.html

```html
<span class="mtk3">  1. </span><span class="mtk3 inline-folded">🙏</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__37208__Collapsing_bullet_point_containing_emoji_in_Markdown_document_results_in______character.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__37208__Collapsing_bullet_point_containing_emoji_in_Markdown_document_results_in______character.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 1, 0, 5 ],
  [ 1, 1, 6 ],
  [ 1, 2, 7 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__37401__40127__Allow_both_before_and_after_decorations_on_empty_line.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__37401__40127__Allow_both_before_and_after_decorations_on_empty_line.0.html

```html
<span class="before"></span><span class="after"></span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__37401__40127__Allow_both_before_and_after_decorations_on_empty_line.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__37401__40127__Allow_both_before_and_after_decorations_on_empty_line.1.snap

```text
[ [ 1, 0, 0 ] ]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__38123__editor_renderWhitespace___boundary__renders_whitespace_at_line_wrap_point_when_line_is_wrapped.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__38123__editor_renderWhitespace___boundary__renders_whitespace_at_line_wrap_point_when_line_is_wrapped.0.html

```html
<span class="mtk3">This is a long line which never uses more than two</span><span class="mtk3"> spaces.</span><span class="mtk3"> </span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__38123__editor_renderWhitespace___boundary__renders_whitespace_at_line_wrap_point_when_line_is_wrapped.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__38123__editor_renderWhitespace___boundary__renders_whitespace_at_line_wrap_point_when_line_is_wrapped.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 0, 6, 6 ],
  [ 0, 7, 7 ],
  [ 0, 8, 8 ],
  [ 0, 9, 9 ],
  [ 0, 10, 10 ],
  [ 0, 11, 11 ],
  [ 0, 12, 12 ],
  [ 0, 13, 13 ],
  [ 0, 14, 14 ],
  [ 0, 15, 15 ],
  [ 0, 16, 16 ],
  [ 0, 17, 17 ],
  [ 0, 18, 18 ],
  [ 0, 19, 19 ],
  [ 0, 20, 20 ],
  [ 0, 21, 21 ],
  [ 0, 22, 22 ],
  [ 0, 23, 23 ],
  [ 0, 24, 24 ],
  [ 0, 25, 25 ],
  [ 0, 26, 26 ],
  [ 0, 27, 27 ],
  [ 0, 28, 28 ],
  [ 0, 29, 29 ],
  [ 0, 30, 30 ],
  [ 0, 31, 31 ],
  [ 0, 32, 32 ],
  [ 0, 33, 33 ],
  [ 0, 34, 34 ],
  [ 0, 35, 35 ],
  [ 0, 36, 36 ],
  [ 0, 37, 37 ],
  [ 0, 38, 38 ],
  [ 0, 39, 39 ],
  [ 0, 40, 40 ],
  [ 0, 41, 41 ],
  [ 0, 42, 42 ],
  [ 0, 43, 43 ],
  [ 0, 44, 44 ],
  [ 0, 45, 45 ],
  [ 0, 46, 46 ],
  [ 0, 47, 47 ],
  [ 0, 48, 48 ],
  [ 0, 49, 49 ],
  [ 1, 0, 50 ],
  [ 1, 1, 51 ],
  [ 1, 2, 52 ],
  [ 1, 3, 53 ],
  [ 1, 4, 54 ],
  [ 1, 5, 55 ],
  [ 1, 6, 56 ],
  [ 1, 7, 57 ],
  [ 2, 0, 58 ],
  [ 2, 1, 59 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__38935__GitLens_end-of-line_blame_no_longer_rendering.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__38935__GitLens_end-of-line_blame_no_longer_rendering.0.html

```html
<span class="mtk3">    }</span><span class="ced-TextEditorDecorationType2-5e9b9b3f-3 ced-TextEditorDecorationType2-3"></span><span class="ced-TextEditorDecorationType2-5e9b9b3f-4 ced-TextEditorDecorationType2-4"></span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__38935__GitLens_end-of-line_blame_no_longer_rendering.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__38935__GitLens_end-of-line_blame_no_longer_rendering.1.snap

```text
[ [ 0, 0, 0 ], [ 0, 4, 4 ], [ 2, 0, 5 ] ]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__42700__Hindi_characters_are_not_being_rendered_properly.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__42700__Hindi_characters_are_not_being_rendered_properly.0.html

```html
<span class="mtk3"> वो ऐसा क्या है जो हमारे अंदर भी है और बाहर भी है। </span><span class="mtk3">जिसकी वजह से हम सब हैं। जिसने इस सृष्टि की रचना की </span><span class="mtk3">है।</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__42700__Hindi_characters_are_not_being_rendered_properly.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__42700__Hindi_characters_are_not_being_rendered_properly.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 0, 6, 6 ],
  [ 0, 7, 7 ],
  [ 0, 8, 8 ],
  [ 0, 9, 9 ],
  [ 0, 10, 10 ],
  [ 0, 11, 11 ],
  [ 0, 12, 12 ],
  [ 0, 13, 13 ],
  [ 0, 14, 14 ],
  [ 0, 15, 15 ],
  [ 0, 16, 16 ],
  [ 0, 17, 17 ],
  [ 0, 18, 18 ],
  [ 0, 19, 19 ],
  [ 0, 20, 20 ],
  [ 0, 21, 21 ],
  [ 0, 22, 22 ],
  [ 0, 23, 23 ],
  [ 0, 24, 24 ],
  [ 0, 25, 25 ],
  [ 0, 26, 26 ],
  [ 0, 27, 27 ],
  [ 0, 28, 28 ],
  [ 0, 29, 29 ],
  [ 0, 30, 30 ],
  [ 0, 31, 31 ],
  [ 0, 32, 32 ],
  [ 0, 33, 33 ],
  [ 0, 34, 34 ],
  [ 0, 35, 35 ],
  [ 0, 36, 36 ],
  [ 0, 37, 37 ],
  [ 0, 38, 38 ],
  [ 0, 39, 39 ],
  [ 0, 40, 40 ],
  [ 0, 41, 41 ],
  [ 0, 42, 42 ],
  [ 0, 43, 43 ],
  [ 0, 44, 44 ],
  [ 0, 45, 45 ],
  [ 0, 46, 46 ],
  [ 0, 47, 47 ],
  [ 0, 48, 48 ],
  [ 0, 49, 49 ],
  [ 0, 50, 50 ],
  [ 1, 0, 51 ],
  [ 1, 1, 52 ],
  [ 1, 2, 53 ],
  [ 1, 3, 54 ],
  [ 1, 4, 55 ],
  [ 1, 5, 56 ],
  [ 1, 6, 57 ],
  [ 1, 7, 58 ],
  [ 1, 8, 59 ],
  [ 1, 9, 60 ],
  [ 1, 10, 61 ],
  [ 1, 11, 62 ],
  [ 1, 12, 63 ],
  [ 1, 13, 64 ],
  [ 1, 14, 65 ],
  [ 1, 15, 66 ],
  [ 1, 16, 67 ],
  [ 1, 17, 68 ],
  [ 1, 18, 69 ],
  [ 1, 19, 70 ],
  [ 1, 20, 71 ],
  [ 1, 21, 72 ],
  [ 1, 22, 73 ],
  [ 1, 23, 74 ],
  [ 1, 24, 75 ],
  [ 1, 25, 76 ],
  [ 1, 26, 77 ],
  [ 1, 27, 78 ],
  [ 1, 28, 79 ],
  [ 1, 29, 80 ],
  [ 1, 30, 81 ],
  [ 1, 31, 82 ],
  [ 1, 32, 83 ],
  [ 1, 33, 84 ],
  [ 1, 34, 85 ],
  [ 1, 35, 86 ],
  [ 1, 36, 87 ],
  [ 1, 37, 88 ],
  [ 1, 38, 89 ],
  [ 1, 39, 90 ],
  [ 1, 40, 91 ],
  [ 1, 41, 92 ],
  [ 1, 42, 93 ],
  [ 1, 43, 94 ],
  [ 1, 44, 95 ],
  [ 1, 45, 96 ],
  [ 1, 46, 97 ],
  [ 1, 47, 98 ],
  [ 1, 48, 99 ],
  [ 1, 49, 100 ],
  [ 1, 50, 101 ],
  [ 2, 0, 102 ],
  [ 2, 1, 103 ],
  [ 2, 2, 104 ],
  [ 2, 3, 105 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__91936__Semantic_token_color_highlighting_fails_on_line_with_selected_text.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__91936__Semantic_token_color_highlighting_fails_on_line_with_selected_text.0.html

```html
<span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtkz" style="width:10px">·‌</span><span class="mtk15">else</span><span class="mtkz" style="width:10px">·‌</span><span class="mtk15">if</span><span class="mtkz" style="width:10px">·‌</span><span class="mtk1">(</span><span class="mtk16">$s</span><span class="mtkz" style="width:10px">·‌</span><span class="mtk1">=</span><span class="mtkz" style="width:10px">·‌</span><span class="mtk6">08</span><span class="mtk1">)</span><span class="mtkz" style="width:10px">·‌</span><span class="mtk15">then</span><span class="mtkz" style="width:10px">·‌</span><span class="mtk11">'\b'</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__91936__Semantic_token_color_highlighting_fails_on_line_with_selected_text.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_2_issue__91936__Semantic_token_color_highlighting_fails_on_line_with_selected_text.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 1, 0, 1 ],
  [ 2, 0, 2 ],
  [ 3, 0, 3 ],
  [ 4, 0, 4 ],
  [ 5, 0, 5 ],
  [ 6, 0, 6 ],
  [ 7, 0, 7 ],
  [ 8, 0, 8 ],
  [ 9, 0, 9 ],
  [ 10, 0, 10 ],
  [ 11, 0, 11 ],
  [ 12, 0, 12 ],
  [ 13, 0, 13 ],
  [ 14, 0, 14 ],
  [ 15, 0, 15 ],
  [ 16, 0, 16 ],
  [ 17, 0, 17 ],
  [ 18, 0, 18 ],
  [ 19, 0, 19 ],
  [ 20, 0, 20 ],
  [ 20, 1, 21 ],
  [ 20, 2, 22 ],
  [ 20, 3, 23 ],
  [ 21, 0, 24 ],
  [ 22, 0, 25 ],
  [ 22, 1, 26 ],
  [ 23, 0, 27 ],
  [ 24, 0, 28 ],
  [ 25, 0, 29 ],
  [ 25, 1, 30 ],
  [ 26, 0, 31 ],
  [ 27, 0, 32 ],
  [ 28, 0, 33 ],
  [ 29, 0, 34 ],
  [ 29, 1, 35 ],
  [ 30, 0, 36 ],
  [ 31, 0, 37 ],
  [ 32, 0, 38 ],
  [ 32, 1, 39 ],
  [ 32, 2, 40 ],
  [ 32, 3, 41 ],
  [ 33, 0, 42 ],
  [ 34, 0, 43 ],
  [ 34, 1, 44 ],
  [ 34, 2, 45 ],
  [ 34, 3, 46 ],
  [ 34, 4, 47 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue_microsoft_monaco-editor_280__Improved_source_code_rendering_for_RTL_languages.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue_microsoft_monaco-editor_280__Improved_source_code_rendering_for_RTL_languages.0.html

```html
<span class="mtk6">var</span><span style="unicode-bidi:isolate" class="mtk1"> קודמות = </span><span style="unicode-bidi:isolate" class="mtk20">"מיותר קודמות צ'ט של, אם לשון העברית שינויים ויש, אם"</span><span class="mtk1">;</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue_microsoft_monaco-editor_280__Improved_source_code_rendering_for_RTL_languages.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue_microsoft_monaco-editor_280__Improved_source_code_rendering_for_RTL_languages.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 1, 0, 3 ],
  [ 1, 1, 4 ],
  [ 1, 2, 5 ],
  [ 1, 3, 6 ],
  [ 1, 4, 7 ],
  [ 1, 5, 8 ],
  [ 1, 6, 9 ],
  [ 1, 7, 10 ],
  [ 1, 8, 11 ],
  [ 1, 9, 12 ],
  [ 2, 0, 13 ],
  [ 2, 1, 14 ],
  [ 2, 2, 15 ],
  [ 2, 3, 16 ],
  [ 2, 4, 17 ],
  [ 2, 5, 18 ],
  [ 2, 6, 19 ],
  [ 2, 7, 20 ],
  [ 2, 8, 21 ],
  [ 2, 9, 22 ],
  [ 2, 10, 23 ],
  [ 2, 11, 24 ],
  [ 2, 12, 25 ],
  [ 2, 13, 26 ],
  [ 2, 14, 27 ],
  [ 2, 15, 28 ],
  [ 2, 16, 29 ],
  [ 2, 17, 30 ],
  [ 2, 18, 31 ],
  [ 2, 19, 32 ],
  [ 2, 20, 33 ],
  [ 2, 21, 34 ],
  [ 2, 22, 35 ],
  [ 2, 23, 36 ],
  [ 2, 24, 37 ],
  [ 2, 25, 38 ],
  [ 2, 26, 39 ],
  [ 2, 27, 40 ],
  [ 2, 28, 41 ],
  [ 2, 29, 42 ],
  [ 2, 30, 43 ],
  [ 2, 31, 44 ],
  [ 2, 32, 45 ],
  [ 2, 33, 46 ],
  [ 2, 34, 47 ],
  [ 2, 35, 48 ],
  [ 2, 36, 49 ],
  [ 2, 37, 50 ],
  [ 2, 38, 51 ],
  [ 2, 39, 52 ],
  [ 2, 40, 53 ],
  [ 2, 41, 54 ],
  [ 2, 42, 55 ],
  [ 2, 43, 56 ],
  [ 2, 44, 57 ],
  [ 2, 45, 58 ],
  [ 2, 46, 59 ],
  [ 2, 47, 60 ],
  [ 2, 48, 61 ],
  [ 2, 49, 62 ],
  [ 2, 50, 63 ],
  [ 2, 51, 64 ],
  [ 2, 52, 65 ],
  [ 3, 0, 66 ],
  [ 3, 1, 67 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__137036__Issue_in_RTL_languages_in_recent_versions.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__137036__Issue_in_RTL_languages_in_recent_versions.0.html

```html
<span class="mtk2">&lt;</span><span class="mtk3">option</span><span class="mtk4"> </span><span class="mtk5">value</span><span class="mtk4">=</span><span style="unicode-bidi:isolate" class="mtk6">"العربية"</span><span class="mtk2">&gt;</span><span style="unicode-bidi:isolate" class="mtk4">العربية</span><span class="mtk2">&lt;/</span><span class="mtk3">option</span><span class="mtk2">&gt;</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__137036__Issue_in_RTL_languages_in_recent_versions.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__137036__Issue_in_RTL_languages_in_recent_versions.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 1, 0, 1 ],
  [ 1, 1, 2 ],
  [ 1, 2, 3 ],
  [ 1, 3, 4 ],
  [ 1, 4, 5 ],
  [ 1, 5, 6 ],
  [ 2, 0, 7 ],
  [ 3, 0, 8 ],
  [ 3, 1, 9 ],
  [ 3, 2, 10 ],
  [ 3, 3, 11 ],
  [ 3, 4, 12 ],
  [ 4, 0, 13 ],
  [ 5, 0, 14 ],
  [ 5, 1, 15 ],
  [ 5, 2, 16 ],
  [ 5, 3, 17 ],
  [ 5, 4, 18 ],
  [ 5, 5, 19 ],
  [ 5, 6, 20 ],
  [ 5, 7, 21 ],
  [ 5, 8, 22 ],
  [ 6, 0, 23 ],
  [ 7, 0, 24 ],
  [ 7, 1, 25 ],
  [ 7, 2, 26 ],
  [ 7, 3, 27 ],
  [ 7, 4, 28 ],
  [ 7, 5, 29 ],
  [ 7, 6, 30 ],
  [ 8, 0, 31 ],
  [ 8, 1, 32 ],
  [ 9, 0, 33 ],
  [ 9, 1, 34 ],
  [ 9, 2, 35 ],
  [ 9, 3, 36 ],
  [ 9, 4, 37 ],
  [ 9, 5, 38 ],
  [ 10, 0, 39 ],
  [ 10, 1, 40 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__19673__Monokai_Theme_bad-highlighting_in_line_wrap.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__19673__Monokai_Theme_bad-highlighting_in_line_wrap.0.html

```html
<span class="">    </span><span class="mtk1">MongoCallback</span><span class="mtk2">&lt;</span><span class="mtk3">string</span><span class="mtk4">&gt;)</span><span class="mtk5">:</span><span class="mtk6"> </span><span class="mtk7">void</span><span class="mtk8"> {</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__19673__Monokai_Theme_bad-highlighting_in_line_wrap.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__19673__Monokai_Theme_bad-highlighting_in_line_wrap.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 1, 0, 4 ],
  [ 1, 1, 5 ],
  [ 1, 2, 6 ],
  [ 1, 3, 7 ],
  [ 1, 4, 8 ],
  [ 1, 5, 9 ],
  [ 1, 6, 10 ],
  [ 1, 7, 11 ],
  [ 1, 8, 12 ],
  [ 1, 9, 13 ],
  [ 1, 10, 14 ],
  [ 1, 11, 15 ],
  [ 1, 12, 16 ],
  [ 2, 0, 17 ],
  [ 3, 0, 18 ],
  [ 3, 1, 19 ],
  [ 3, 2, 20 ],
  [ 3, 3, 21 ],
  [ 3, 4, 22 ],
  [ 3, 5, 23 ],
  [ 4, 0, 24 ],
  [ 4, 1, 25 ],
  [ 5, 0, 26 ],
  [ 6, 0, 27 ],
  [ 7, 0, 28 ],
  [ 7, 1, 29 ],
  [ 7, 2, 30 ],
  [ 7, 3, 31 ],
  [ 8, 0, 32 ],
  [ 8, 1, 33 ],
  [ 8, 2, 34 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__20624__Unaligned_surrogate_pairs_are_corrupted_at_multiples_of_50_columns.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__20624__Unaligned_surrogate_pairs_are_corrupted_at_multiples_of_50_columns.0.html

```html
<span class="mtk1">a𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷𠮷</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__2255__Weird_line_rendering_part_1.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__2255__Weird_line_rendering_part_1.0.html

```html
<span class="mtk1">            </span><span class="mtk2">cursorStyle:</span><span class="mtk3">                        </span><span class="mtk4">(</span><span class="mtk5">prevOpts.cursorStyle </span><span class="mtk6">!=</span><span class="mtk7">=</span><span class="mtk8"> newOpts.cursorStyle</span><span class="mtk9">)</span><span class="mtk10">,</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__2255__Weird_line_rendering_part_1.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__2255__Weird_line_rendering_part_1.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 4, 4 ],
  [ 0, 8, 8 ],
  [ 1, 0, 12 ],
  [ 1, 1, 13 ],
  [ 1, 2, 14 ],
  [ 1, 3, 15 ],
  [ 1, 4, 16 ],
  [ 1, 5, 17 ],
  [ 1, 6, 18 ],
  [ 1, 7, 19 ],
  [ 1, 8, 20 ],
  [ 1, 9, 21 ],
  [ 1, 10, 22 ],
  [ 1, 11, 23 ],
  [ 2, 0, 24 ],
  [ 2, 4, 28 ],
  [ 2, 8, 32 ],
  [ 2, 12, 36 ],
  [ 2, 16, 40 ],
  [ 2, 20, 44 ],
  [ 3, 0, 48 ],
  [ 4, 0, 49 ],
  [ 4, 1, 50 ],
  [ 4, 2, 51 ],
  [ 4, 3, 52 ],
  [ 4, 4, 53 ],
  [ 4, 5, 54 ],
  [ 4, 6, 55 ],
  [ 4, 7, 56 ],
  [ 4, 8, 57 ],
  [ 4, 9, 58 ],
  [ 4, 10, 59 ],
  [ 4, 11, 60 ],
  [ 4, 12, 61 ],
  [ 4, 13, 62 ],
  [ 4, 14, 63 ],
  [ 4, 15, 64 ],
  [ 4, 16, 65 ],
  [ 4, 17, 66 ],
  [ 4, 18, 67 ],
  [ 4, 19, 68 ],
  [ 4, 20, 69 ],
  [ 5, 0, 70 ],
  [ 5, 1, 71 ],
  [ 6, 0, 72 ],
  [ 7, 0, 73 ],
  [ 7, 1, 74 ],
  [ 7, 2, 75 ],
  [ 7, 3, 76 ],
  [ 7, 4, 77 ],
  [ 7, 5, 78 ],
  [ 7, 6, 79 ],
  [ 7, 7, 80 ],
  [ 7, 8, 81 ],
  [ 7, 9, 82 ],
  [ 7, 10, 83 ],
  [ 7, 11, 84 ],
  [ 7, 12, 85 ],
  [ 7, 13, 86 ],
  [ 7, 14, 87 ],
  [ 7, 15, 88 ],
  [ 7, 16, 89 ],
  [ 7, 17, 90 ],
  [ 7, 18, 91 ],
  [ 7, 19, 92 ],
  [ 8, 0, 93 ],
  [ 9, 0, 94 ],
  [ 9, 1, 95 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__2255__Weird_line_rendering_part_2.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__2255__Weird_line_rendering_part_2.0.html

```html
<span class="mtk1">            </span><span class="mtk2">cursorStyle:</span><span class="mtk3">                        </span><span class="mtk4">(</span><span class="mtk5">prevOpts.cursorStyle </span><span class="mtk6">!=</span><span class="mtk7">=</span><span class="mtk8"> newOpts.cursorStyle</span><span class="mtk9">)</span><span class="mtk10">,</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__2255__Weird_line_rendering_part_2.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__2255__Weird_line_rendering_part_2.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 4, 4 ],
  [ 0, 8, 8 ],
  [ 1, 0, 12 ],
  [ 1, 1, 13 ],
  [ 1, 2, 14 ],
  [ 1, 3, 15 ],
  [ 1, 4, 16 ],
  [ 1, 5, 17 ],
  [ 1, 6, 18 ],
  [ 1, 7, 19 ],
  [ 1, 8, 20 ],
  [ 1, 9, 21 ],
  [ 1, 10, 22 ],
  [ 1, 11, 23 ],
  [ 2, 0, 24 ],
  [ 2, 4, 28 ],
  [ 2, 8, 32 ],
  [ 2, 12, 36 ],
  [ 2, 16, 40 ],
  [ 2, 20, 44 ],
  [ 3, 0, 48 ],
  [ 4, 0, 49 ],
  [ 4, 1, 50 ],
  [ 4, 2, 51 ],
  [ 4, 3, 52 ],
  [ 4, 4, 53 ],
  [ 4, 5, 54 ],
  [ 4, 6, 55 ],
  [ 4, 7, 56 ],
  [ 4, 8, 57 ],
  [ 4, 9, 58 ],
  [ 4, 10, 59 ],
  [ 4, 11, 60 ],
  [ 4, 12, 61 ],
  [ 4, 13, 62 ],
  [ 4, 14, 63 ],
  [ 4, 15, 64 ],
  [ 4, 16, 65 ],
  [ 4, 17, 66 ],
  [ 4, 18, 67 ],
  [ 4, 19, 68 ],
  [ 4, 20, 69 ],
  [ 5, 0, 70 ],
  [ 5, 1, 71 ],
  [ 6, 0, 72 ],
  [ 7, 0, 73 ],
  [ 7, 1, 74 ],
  [ 7, 2, 75 ],
  [ 7, 3, 76 ],
  [ 7, 4, 77 ],
  [ 7, 5, 78 ],
  [ 7, 6, 79 ],
  [ 7, 7, 80 ],
  [ 7, 8, 81 ],
  [ 7, 9, 82 ],
  [ 7, 10, 83 ],
  [ 7, 11, 84 ],
  [ 7, 12, 85 ],
  [ 7, 13, 86 ],
  [ 7, 14, 87 ],
  [ 7, 15, 88 ],
  [ 7, 16, 89 ],
  [ 7, 17, 90 ],
  [ 7, 18, 91 ],
  [ 7, 19, 92 ],
  [ 8, 0, 93 ],
  [ 9, 0, 94 ],
  [ 9, 1, 95 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__260239__HTML_containing_bidirectional_text_is_rendered_incorrectly.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__260239__HTML_containing_bidirectional_text_is_rendered_incorrectly.0.html

```html
<span class="mtk1">&lt;</span><span class="mtk2">p</span><span class="mtk3"> </span><span class="mtk4">class</span><span class="mtk5">=</span><span class="mtk6">"</span><span class="mtk7">myclass</span><span class="mtk6">"</span><span class="mtk3"> </span><span class="mtk4">title</span><span class="mtk5">=</span><span class="mtk6">"</span><span style="unicode-bidi:isolate" class="mtk8">العربي</span><span class="mtk6">"</span><span class="mtk1">&gt;</span><span style="unicode-bidi:isolate" class="mtk9">نشاط التدويل!</span><span class="mtk1">&lt;</span><span class="mtk2">/</span><span class="mtk2">p</span><span class="mtk1">&gt;</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__260239__HTML_containing_bidirectional_text_is_rendered_incorrectly.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__260239__HTML_containing_bidirectional_text_is_rendered_incorrectly.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 1, 0, 1 ],
  [ 2, 0, 2 ],
  [ 3, 0, 3 ],
  [ 3, 1, 4 ],
  [ 3, 2, 5 ],
  [ 3, 3, 6 ],
  [ 3, 4, 7 ],
  [ 4, 0, 8 ],
  [ 5, 0, 9 ],
  [ 6, 0, 10 ],
  [ 6, 1, 11 ],
  [ 6, 2, 12 ],
  [ 6, 3, 13 ],
  [ 6, 4, 14 ],
  [ 6, 5, 15 ],
  [ 6, 6, 16 ],
  [ 7, 0, 17 ],
  [ 8, 0, 18 ],
  [ 9, 0, 19 ],
  [ 9, 1, 20 ],
  [ 9, 2, 21 ],
  [ 9, 3, 22 ],
  [ 9, 4, 23 ],
  [ 10, 0, 24 ],
  [ 11, 0, 25 ],
  [ 12, 0, 26 ],
  [ 12, 1, 27 ],
  [ 12, 2, 28 ],
  [ 12, 3, 29 ],
  [ 12, 4, 30 ],
  [ 12, 5, 31 ],
  [ 13, 0, 32 ],
  [ 14, 0, 33 ],
  [ 15, 0, 34 ],
  [ 15, 1, 35 ],
  [ 15, 2, 36 ],
  [ 15, 3, 37 ],
  [ 15, 4, 38 ],
  [ 15, 5, 39 ],
  [ 15, 6, 40 ],
  [ 15, 7, 41 ],
  [ 15, 8, 42 ],
  [ 15, 9, 43 ],
  [ 15, 10, 44 ],
  [ 15, 11, 45 ],
  [ 15, 12, 46 ],
  [ 16, 0, 47 ],
  [ 17, 0, 48 ],
  [ 18, 0, 49 ],
  [ 19, 0, 50 ],
  [ 19, 1, 51 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__274604__Mixed_LTR_and_RTL_in_a_single_token.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__274604__Mixed_LTR_and_RTL_in_a_single_token.0.html

```html
<span style="unicode-bidi:isolate" class="mtk1">test.com##a:-abp-contains(إ)</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__274604__Mixed_LTR_and_RTL_in_a_single_token.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__274604__Mixed_LTR_and_RTL_in_a_single_token.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 0, 6, 6 ],
  [ 0, 7, 7 ],
  [ 0, 8, 8 ],
  [ 0, 9, 9 ],
  [ 0, 10, 10 ],
  [ 0, 11, 11 ],
  [ 0, 12, 12 ],
  [ 0, 13, 13 ],
  [ 0, 14, 14 ],
  [ 0, 15, 15 ],
  [ 0, 16, 16 ],
  [ 0, 17, 17 ],
  [ 0, 18, 18 ],
  [ 0, 19, 19 ],
  [ 0, 20, 20 ],
  [ 0, 21, 21 ],
  [ 0, 22, 22 ],
  [ 0, 23, 23 ],
  [ 0, 24, 24 ],
  [ 0, 25, 25 ],
  [ 0, 26, 26 ],
  [ 0, 27, 27 ],
  [ 0, 28, 28 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__277693__Mixed_LTR_and_RTL_in_a_single_token_with_template_literal.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__277693__Mixed_LTR_and_RTL_in_a_single_token_with_template_literal.0.html

```html
<span style="unicode-bidi:isolate" class="mtk1">نام کاربر</span><span class="mtk1">: </span><span class="mtk2">${</span><span class="mtk3">user</span><span class="mtk4">.</span><span class="mtk3">firstName</span><span class="mtk2">}</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__277693__Mixed_LTR_and_RTL_in_a_single_token_with_template_literal.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__277693__Mixed_LTR_and_RTL_in_a_single_token_with_template_literal.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 0, 6, 6 ],
  [ 0, 7, 7 ],
  [ 0, 8, 8 ],
  [ 1, 0, 9 ],
  [ 1, 1, 10 ],
  [ 2, 0, 11 ],
  [ 2, 1, 12 ],
  [ 3, 0, 13 ],
  [ 3, 1, 14 ],
  [ 3, 2, 15 ],
  [ 3, 3, 16 ],
  [ 4, 0, 17 ],
  [ 5, 0, 18 ],
  [ 5, 1, 19 ],
  [ 5, 2, 20 ],
  [ 5, 3, 21 ],
  [ 5, 4, 22 ],
  [ 5, 5, 23 ],
  [ 5, 6, 24 ],
  [ 5, 7, 25 ],
  [ 5, 8, 26 ],
  [ 6, 0, 27 ],
  [ 6, 1, 28 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__6885__Does_not_split_large_tokens_in_RTL_text.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__6885__Does_not_split_large_tokens_in_RTL_text.0.html

```html
<span><span style="unicode-bidi:isolate" class="mtk1">את גרמנית בהתייחסות שמו, שנתי המשפט אל חפש, אם כתב אחרים ולחבר. של התוכן אודות בויקיפדיה כלל, של עזרה כימיה היא. על עמוד יוצרים מיתולוגיה סדר, אם שכל שתפו לעברית שינויים, אם שאלות אנגלית עזה. שמות בקלות מה סדר.</span></span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__91178__after_decoration_type_shown_before_cursor.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__91178__after_decoration_type_shown_before_cursor.0.html

```html
<span class="mtk1">//just a com</span><span class="mtk1 dec2"></span><span class="mtk1 dec1"></span><span class="mtk1">ment</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__91178__after_decoration_type_shown_before_cursor.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__91178__after_decoration_type_shown_before_cursor.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 0, 6, 6 ],
  [ 0, 7, 7 ],
  [ 0, 8, 8 ],
  [ 0, 9, 9 ],
  [ 0, 10, 10 ],
  [ 0, 11, 11 ],
  [ 2, 0, 12 ],
  [ 3, 1, 13 ],
  [ 3, 2, 14 ],
  [ 3, 3, 15 ],
  [ 3, 4, 16 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__95685__Uses_unicode_replacement_character_for_Paragraph_Separator.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__95685__Uses_unicode_replacement_character_for_Paragraph_Separator.0.html

```html
<span class="mtk1">var ftext = [�"Und", "dann", "eines"];</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__95685__Uses_unicode_replacement_character_for_Paragraph_Separator.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__95685__Uses_unicode_replacement_character_for_Paragraph_Separator.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 1, 1 ],
  [ 0, 2, 2 ],
  [ 0, 3, 3 ],
  [ 0, 4, 4 ],
  [ 0, 5, 5 ],
  [ 0, 6, 6 ],
  [ 0, 7, 7 ],
  [ 0, 8, 8 ],
  [ 0, 9, 9 ],
  [ 0, 10, 10 ],
  [ 0, 11, 11 ],
  [ 0, 12, 12 ],
  [ 0, 13, 13 ],
  [ 0, 14, 14 ],
  [ 0, 15, 15 ],
  [ 0, 16, 16 ],
  [ 0, 17, 17 ],
  [ 0, 18, 18 ],
  [ 0, 19, 19 ],
  [ 0, 20, 20 ],
  [ 0, 21, 21 ],
  [ 0, 22, 22 ],
  [ 0, 23, 23 ],
  [ 0, 24, 24 ],
  [ 0, 25, 25 ],
  [ 0, 26, 26 ],
  [ 0, 27, 27 ],
  [ 0, 28, 28 ],
  [ 0, 29, 29 ],
  [ 0, 30, 30 ],
  [ 0, 31, 31 ],
  [ 0, 32, 32 ],
  [ 0, 33, 33 ],
  [ 0, 34, 34 ],
  [ 0, 35, 35 ],
  [ 0, 36, 36 ],
  [ 0, 37, 37 ],
  [ 0, 38, 38 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__99589__Rendering_whitespace_influences_bidi_layout.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__99589__Rendering_whitespace_influences_bidi_layout.0.html

```html
<span class="mtkw">·‌·‌·‌·‌</span><span class="mtk2">[</span><span style="unicode-bidi:isolate" class="mtk3">"🖨️ چاپ فاکتور"</span><span class="mtk2">,</span><span style="unicode-bidi:isolate" class="mtk3">"🎨 تنظیمات"</span><span class="mtk2">]</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__99589__Rendering_whitespace_influences_bidi_layout.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_issue__99589__Rendering_whitespace_influences_bidi_layout.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 0, 2, 1 ],
  [ 0, 4, 2 ],
  [ 0, 6, 3 ],
  [ 1, 0, 4 ],
  [ 2, 0, 5 ],
  [ 2, 1, 6 ],
  [ 2, 2, 7 ],
  [ 2, 3, 8 ],
  [ 2, 4, 9 ],
  [ 2, 5, 10 ],
  [ 2, 6, 11 ],
  [ 2, 7, 12 ],
  [ 2, 8, 13 ],
  [ 2, 9, 14 ],
  [ 2, 10, 15 ],
  [ 2, 11, 16 ],
  [ 2, 12, 17 ],
  [ 2, 13, 18 ],
  [ 2, 14, 19 ],
  [ 2, 15, 20 ],
  [ 3, 0, 21 ],
  [ 4, 0, 22 ],
  [ 4, 1, 23 ],
  [ 4, 2, 24 ],
  [ 4, 3, 25 ],
  [ 4, 4, 26 ],
  [ 4, 5, 27 ],
  [ 4, 6, 28 ],
  [ 4, 7, 29 ],
  [ 4, 8, 30 ],
  [ 4, 9, 31 ],
  [ 4, 10, 32 ],
  [ 4, 11, 33 ],
  [ 5, 0, 34 ],
  [ 5, 1, 35 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_overflow.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_overflow.0.html

```html
<span class="mtk0">H</span><span class="mtk1">e</span><span class="mtk2">l</span><span class="mtk3">l</span><span class="mtk4">o</span><span class="mtk5"> </span><span class="mtkoverflow">Show more (6 chars)</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_overflow.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_overflow.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 1, 0, 1 ],
  [ 2, 0, 2 ],
  [ 3, 0, 3 ],
  [ 4, 0, 4 ],
  [ 5, 0, 5 ],
  [ 5, 1, 6 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_typical_line.0.html]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_typical_line.0.html

```html
<span class="mtkz" style="width:40px">→   </span><span class="mtkz" style="width:40px">·‌·‌·‌·‌</span><span class="mtk2">export</span><span class="mtk3"> </span><span class="mtk4">class</span><span class="mtk5"> </span><span class="mtk6">Game</span><span class="mtk7"> </span><span class="mtk8">{</span><span class="mtk9"> </span><span class="mtk10">// </span><span class="mtk11">http://test.com</span><span class="mtkz" style="width:20px">·‌·‌</span><span class="mtkz" style="width:30px">·‌·‌·‌</span>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_typical_line.1.snap]---
Location: vscode-main/src/vs/editor/test/common/viewLayout/__snapshots__/viewLineRenderer_renderLine_typical_line.1.snap

```text
[
  [ 0, 0, 0 ],
  [ 1, 0, 4 ],
  [ 1, 2, 5 ],
  [ 1, 4, 6 ],
  [ 1, 6, 7 ],
  [ 2, 0, 8 ],
  [ 2, 1, 9 ],
  [ 2, 2, 10 ],
  [ 2, 3, 11 ],
  [ 2, 4, 12 ],
  [ 2, 5, 13 ],
  [ 3, 0, 14 ],
  [ 4, 0, 15 ],
  [ 4, 1, 16 ],
  [ 4, 2, 17 ],
  [ 4, 3, 18 ],
  [ 4, 4, 19 ],
  [ 5, 0, 20 ],
  [ 6, 0, 21 ],
  [ 6, 1, 22 ],
  [ 6, 2, 23 ],
  [ 6, 3, 24 ],
  [ 7, 0, 25 ],
  [ 8, 0, 26 ],
  [ 9, 0, 27 ],
  [ 10, 0, 28 ],
  [ 10, 1, 29 ],
  [ 10, 2, 30 ],
  [ 11, 0, 31 ],
  [ 11, 1, 32 ],
  [ 11, 2, 33 ],
  [ 11, 3, 34 ],
  [ 11, 4, 35 ],
  [ 11, 5, 36 ],
  [ 11, 6, 37 ],
  [ 11, 7, 38 ],
  [ 11, 8, 39 ],
  [ 11, 9, 40 ],
  [ 11, 10, 41 ],
  [ 11, 11, 42 ],
  [ 11, 12, 43 ],
  [ 11, 13, 44 ],
  [ 11, 14, 45 ],
  [ 12, 0, 46 ],
  [ 12, 2, 47 ],
  [ 13, 0, 48 ],
  [ 13, 2, 49 ],
  [ 13, 4, 50 ],
  [ 13, 6, 51 ]
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewModel/glyphLanesModel.test.ts]---
Location: vscode-main/src/vs/editor/test/common/viewModel/glyphLanesModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { GlyphMarginLanesModel, } from '../../../common/viewModel/glyphLanesModel.js';
import { Range } from '../../../common/core/range.js';
import { GlyphMarginLane } from '../../../common/model.js';

suite('GlyphLanesModel', () => {
	let model: GlyphMarginLanesModel;

	ensureNoDisposablesAreLeakedInTestSuite();

	const lineRange = (startLineNumber: number, endLineNumber: number) => new Range(startLineNumber, 1, endLineNumber, 1);
	const assertLines = (fromLine: number, n: number, expected: GlyphMarginLane[][]) => {
		const result: GlyphMarginLane[][] = [];
		for (let i = 0; i < n; i++) {
			result.push(model.getLanesAtLine(fromLine + i));
		}
		assert.deepStrictEqual(result, expected, `fromLine: ${fromLine}, n: ${n}`);
	};

	setup(() => {
		model = new GlyphMarginLanesModel(10);
	});

	test('handles empty', () => {
		assert.equal(model.requiredLanes, 1);
		assertLines(1, 1, [
			[GlyphMarginLane.Center],
		]);
	});

	test('works with a single line range', () => {
		model.push(GlyphMarginLane.Left, lineRange(2, 3));
		assert.equal(model.requiredLanes, 1);
		assertLines(1, 5, [
			[GlyphMarginLane.Center], // 1
			[GlyphMarginLane.Left], // 2
			[GlyphMarginLane.Left], // 3
			[GlyphMarginLane.Center], // 4
			[GlyphMarginLane.Center], // 5
		]);
	});

	test('persists ranges', () => {
		model.push(GlyphMarginLane.Left, lineRange(2, 3), true);
		assert.equal(model.requiredLanes, 1);
		assertLines(1, 5, [
			[GlyphMarginLane.Left], // 1
			[GlyphMarginLane.Left], // 2
			[GlyphMarginLane.Left], // 3
			[GlyphMarginLane.Left], // 4
			[GlyphMarginLane.Left], // 5
		]);
	});

	test('handles overlaps', () => {
		model.push(GlyphMarginLane.Left, lineRange(6, 9));
		model.push(GlyphMarginLane.Right, lineRange(5, 7));
		model.push(GlyphMarginLane.Center, lineRange(7, 8));
		assert.equal(model.requiredLanes, 3);
		assertLines(5, 6, [
			[GlyphMarginLane.Right], // 5
			[GlyphMarginLane.Left, GlyphMarginLane.Right], // 6
			[GlyphMarginLane.Left, GlyphMarginLane.Center, GlyphMarginLane.Right], // 7
			[GlyphMarginLane.Left, GlyphMarginLane.Center], // 8
			[GlyphMarginLane.Left], // 9
			[GlyphMarginLane.Center], // 10
		]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewModel/lineBreakData.test.ts]---
Location: vscode-main/src/vs/editor/test/common/viewModel/lineBreakData.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { PositionAffinity } from '../../../common/model.js';
import { ModelDecorationInjectedTextOptions } from '../../../common/model/textModel.js';
import { ModelLineProjectionData } from '../../../common/modelLineProjectionData.js';

suite('Editor ViewModel - LineBreakData', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Basic', () => {
		const data = new ModelLineProjectionData([], [], [100], [0], 10);

		assert.strictEqual(data.translateToInputOffset(0, 50), 50);
		assert.strictEqual(data.translateToInputOffset(1, 60), 150);
	});

	function sequence(length: number, start = 0): number[] {
		const result = new Array<number>();
		for (let i = 0; i < length; i++) {
			result.push(i + start);
		}
		return result;
	}

	function testInverse(data: ModelLineProjectionData) {
		for (let i = 0; i < 100; i++) {
			const output = data.translateToOutputPosition(i);
			assert.deepStrictEqual(data.translateToInputOffset(output.outputLineIndex, output.outputOffset), i);
		}
	}

	function getInputOffsets(data: ModelLineProjectionData, outputLineIdx: number): number[] {
		return sequence(20).map(i => data.translateToInputOffset(outputLineIdx, i));
	}

	function getOutputOffsets(data: ModelLineProjectionData, affinity: PositionAffinity): string[] {
		return sequence(25).map(i => data.translateToOutputPosition(i, affinity).toString());
	}

	function mapTextToInjectedTextOptions(arr: string[]): ModelDecorationInjectedTextOptions[] {
		return arr.map(e => ModelDecorationInjectedTextOptions.from({ content: e }));
	}

	suite('Injected Text 1', () => {
		const data = new ModelLineProjectionData([2, 3, 10], mapTextToInjectedTextOptions(['1', '22', '333']), [10, 100], [], 10);

		test('getInputOffsetOfOutputPosition', () => {
			// For every view model position, what is the model position?
			assert.deepStrictEqual(getInputOffsets(data, 0), ([0, 1, 2, 2, 3, 3, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11, 12, 13]));
			assert.deepStrictEqual(getInputOffsets(data, 1), ([7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 9, 10, 10, 10, 10, 11, 12, 13]));
		});

		test('getOutputPositionOfInputOffset', () => {
			data.translateToOutputPosition(20);
			assert.deepStrictEqual(getOutputOffsets(data, PositionAffinity.None), [
				'0:0',
				'0:1',
				'0:2',
				'0:4',
				'0:7',
				'0:8',
				'0:9',
				'1:10',
				'1:11',
				'1:12',
				'1:13',
				'1:17',
				'1:18',
				'1:19',
				'1:20',
				'1:21',
				'1:22',
				'1:23',
				'1:24',
				'1:25',
				'1:26',
				'1:27',
				'1:28',
				'1:29',
				'1:30',
			]);

			assert.deepStrictEqual(getOutputOffsets(data, PositionAffinity.Left), [
				'0:0',
				'0:1',
				'0:2',
				'0:4',
				'0:7',
				'0:8',
				'0:9',
				'0:10',
				'1:11',
				'1:12',
				'1:13',
				'1:17',
				'1:18',
				'1:19',
				'1:20',
				'1:21',
				'1:22',
				'1:23',
				'1:24',
				'1:25',
				'1:26',
				'1:27',
				'1:28',
				'1:29',
				'1:30',
			]);

			assert.deepStrictEqual(getOutputOffsets(data, PositionAffinity.Right), [
				'0:0',
				'0:1',
				'0:3',
				'0:6',
				'0:7',
				'0:8',
				'0:9',
				'1:10',
				'1:11',
				'1:12',
				'1:16',
				'1:17',
				'1:18',
				'1:19',
				'1:20',
				'1:21',
				'1:22',
				'1:23',
				'1:24',
				'1:25',
				'1:26',
				'1:27',
				'1:28',
				'1:29',
				'1:30',
			]);
		});

		test('getInputOffsetOfOutputPosition is inverse of getOutputPositionOfInputOffset', () => {
			testInverse(data);
		});


		test('normalization', () => {
			assert.deepStrictEqual(
				sequence(25)
					.map((v) =>
						data.normalizeOutputPosition(1, v, PositionAffinity.Right)
					)
					.map((s) => s.toString()),
				[
					'1:0',
					'1:1',
					'1:2',
					'1:3',
					'1:4',
					'1:5',
					'1:6',
					'1:7',
					'1:8',
					'1:9',
					'1:10',
					'1:11',
					'1:12',
					'1:16',
					'1:16',
					'1:16',
					'1:16',
					'1:17',
					'1:18',
					'1:19',
					'1:20',
					'1:21',
					'1:22',
					'1:23',
					'1:24',
				]
			);
		});
	});

	suite('Injected Text 2', () => {
		const data = new ModelLineProjectionData([2, 2, 6], mapTextToInjectedTextOptions(['1', '22', '333']), [10, 100], [], 0);

		test('getInputOffsetOfOutputPosition', () => {
			assert.deepStrictEqual(
				getInputOffsets(data, 0),
				[0, 1, 2, 2, 2, 2, 3, 4, 5, 6, 6, 6, 6, 7, 8, 9, 10, 11, 12, 13]
			);
			assert.deepStrictEqual(
				getInputOffsets(data, 1),
				[
					6, 6, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
					23,
				]
			);
		});

		test('getInputOffsetOfOutputPosition is inverse of getOutputPositionOfInputOffset', () => {
			testInverse(data);
		});
	});

	suite('Injected Text 3', () => {
		const data = new ModelLineProjectionData([2, 2, 7], mapTextToInjectedTextOptions(['1', '22', '333']), [10, 100], [], 0);

		test('getInputOffsetOfOutputPosition', () => {
			assert.deepStrictEqual(
				getInputOffsets(data, 0),
				[0, 1, 2, 2, 2, 2, 3, 4, 5, 6, 7, 7, 7, 7, 8, 9, 10, 11, 12, 13]
			);
			assert.deepStrictEqual(
				getInputOffsets(data, 1),
				[
					7, 7, 7, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
					23,
				]
			);
		});

		test('getInputOffsetOfOutputPosition is inverse of getOutputPositionOfInputOffset', () => {
			testInverse(data);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewModel/monospaceLineBreaksComputer.test.ts]---
Location: vscode-main/src/vs/editor/test/common/viewModel/monospaceLineBreaksComputer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { EditorOptions, WrappingIndent } from '../../../common/config/editorOptions.js';
import { FontInfo } from '../../../common/config/fontInfo.js';
import { ILineBreaksComputerFactory, ModelLineProjectionData } from '../../../common/modelLineProjectionData.js';
import { MonospaceLineBreaksComputerFactory } from '../../../common/viewModel/monospaceLineBreaksComputer.js';

function parseAnnotatedText(annotatedText: string): { text: string; indices: number[] } {
	let text = '';
	let currentLineIndex = 0;
	const indices: number[] = [];
	for (let i = 0, len = annotatedText.length; i < len; i++) {
		if (annotatedText.charAt(i) === '|') {
			currentLineIndex++;
		} else {
			text += annotatedText.charAt(i);
			indices[text.length - 1] = currentLineIndex;
		}
	}
	return { text: text, indices: indices };
}

function toAnnotatedText(text: string, lineBreakData: ModelLineProjectionData | null): string {
	// Insert line break markers again, according to algorithm
	let actualAnnotatedText = '';
	if (lineBreakData) {
		let previousLineIndex = 0;
		for (let i = 0, len = text.length; i < len; i++) {
			const r = lineBreakData.translateToOutputPosition(i);
			if (previousLineIndex !== r.outputLineIndex) {
				previousLineIndex = r.outputLineIndex;
				actualAnnotatedText += '|';
			}
			actualAnnotatedText += text.charAt(i);
		}
	} else {
		// No wrapping
		actualAnnotatedText = text;
	}
	return actualAnnotatedText;
}

function getLineBreakData(factory: ILineBreaksComputerFactory, tabSize: number, breakAfter: number, columnsForFullWidthChar: number, wrappingIndent: WrappingIndent, wordBreak: 'normal' | 'keepAll', wrapOnEscapedLineFeeds: boolean, text: string, previousLineBreakData: ModelLineProjectionData | null): ModelLineProjectionData | null {
	const fontInfo = new FontInfo({
		pixelRatio: 1,
		fontFamily: 'testFontFamily',
		fontWeight: 'normal',
		fontSize: 14,
		fontFeatureSettings: '',
		fontVariationSettings: '',
		lineHeight: 19,
		letterSpacing: 0,
		isMonospace: true,
		typicalHalfwidthCharacterWidth: 7,
		typicalFullwidthCharacterWidth: 7 * columnsForFullWidthChar,
		canUseHalfwidthRightwardsArrow: true,
		spaceWidth: 7,
		middotWidth: 7,
		wsmiddotWidth: 7,
		maxDigitWidth: 7
	}, false);
	const lineBreaksComputer = factory.createLineBreaksComputer(fontInfo, tabSize, breakAfter, wrappingIndent, wordBreak, wrapOnEscapedLineFeeds);
	const previousLineBreakDataClone = previousLineBreakData ? new ModelLineProjectionData(null, null, previousLineBreakData.breakOffsets.slice(0), previousLineBreakData.breakOffsetsVisibleColumn.slice(0), previousLineBreakData.wrappedTextIndentLength) : null;
	lineBreaksComputer.addRequest(text, null, previousLineBreakDataClone);
	return lineBreaksComputer.finalize()[0];
}

function assertLineBreaks(factory: ILineBreaksComputerFactory, tabSize: number, breakAfter: number, annotatedText: string, wrappingIndent = WrappingIndent.None, wordBreak: 'normal' | 'keepAll' = 'normal'): ModelLineProjectionData | null {
	// Create version of `annotatedText` with line break markers removed
	const text = parseAnnotatedText(annotatedText).text;
	const lineBreakData = getLineBreakData(factory, tabSize, breakAfter, 2, wrappingIndent, wordBreak, false, text, null);
	const actualAnnotatedText = toAnnotatedText(text, lineBreakData);

	assert.strictEqual(actualAnnotatedText, annotatedText);

	return lineBreakData;
}

suite('Editor ViewModel - MonospaceLineBreaksComputer', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('MonospaceLineBreaksComputer', () => {

		const factory = new MonospaceLineBreaksComputerFactory('(', '\t).');

		// Empty string
		assertLineBreaks(factory, 4, 5, '');

		// No wrapping if not necessary
		assertLineBreaks(factory, 4, 5, 'aaa');
		assertLineBreaks(factory, 4, 5, 'aaaaa');
		assertLineBreaks(factory, 4, -1, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

		// Acts like hard wrapping if no char found
		assertLineBreaks(factory, 4, 5, 'aaaaa|a');

		// Honors wrapping character
		assertLineBreaks(factory, 4, 5, 'aaaaa|.');
		assertLineBreaks(factory, 4, 5, 'aaaaa|a.|aaa.|aa');
		assertLineBreaks(factory, 4, 5, 'aaaaa|a..|aaa.|aa');
		assertLineBreaks(factory, 4, 5, 'aaaaa|a...|aaa.|aa');
		assertLineBreaks(factory, 4, 5, 'aaaaa|a....|aaa.|aa');

		// Honors tabs when computing wrapping position
		assertLineBreaks(factory, 4, 5, '\t');
		assertLineBreaks(factory, 4, 5, '\t|aaa');
		assertLineBreaks(factory, 4, 5, '\t|a\t|aa');
		assertLineBreaks(factory, 4, 5, 'aa\ta');
		assertLineBreaks(factory, 4, 5, 'aa\t|aa');

		// Honors wrapping before characters (& gives it priority)
		assertLineBreaks(factory, 4, 5, 'aaa.|aa');
		assertLineBreaks(factory, 4, 5, 'aaa(.|aa');

		// Honors wrapping after characters (& gives it priority)
		assertLineBreaks(factory, 4, 5, 'aaa))|).aaa');
		assertLineBreaks(factory, 4, 5, 'aaa))|).|aaaa');
		assertLineBreaks(factory, 4, 5, 'aaa)|().|aaa');
		assertLineBreaks(factory, 4, 5, 'aaa|(().|aaa');
		assertLineBreaks(factory, 4, 5, 'aa.|(().|aaa');
		assertLineBreaks(factory, 4, 5, 'aa.|(.).|aaa');
	});

	function assertLineBreakDataEqual(a: ModelLineProjectionData | null, b: ModelLineProjectionData | null): void {
		if (!a || !b) {
			assert.deepStrictEqual(a, b);
			return;
		}
		assert.deepStrictEqual(a.breakOffsets, b.breakOffsets);
		assert.deepStrictEqual(a.wrappedTextIndentLength, b.wrappedTextIndentLength);
		for (let i = 0; i < a.breakOffsetsVisibleColumn.length; i++) {
			const diff = a.breakOffsetsVisibleColumn[i] - b.breakOffsetsVisibleColumn[i];
			assert.ok(diff < 0.001);
		}
	}

	function assertIncrementalLineBreaks(factory: ILineBreaksComputerFactory, text: string, tabSize: number, breakAfter1: number, annotatedText1: string, breakAfter2: number, annotatedText2: string, wrappingIndent = WrappingIndent.None, columnsForFullWidthChar: number = 2): void {
		// sanity check the test
		assert.strictEqual(text, parseAnnotatedText(annotatedText1).text);
		assert.strictEqual(text, parseAnnotatedText(annotatedText2).text);

		// check that the direct mapping is ok for 1
		const directLineBreakData1 = getLineBreakData(factory, tabSize, breakAfter1, columnsForFullWidthChar, wrappingIndent, 'normal', false, text, null);
		assert.strictEqual(toAnnotatedText(text, directLineBreakData1), annotatedText1);

		// check that the direct mapping is ok for 2
		const directLineBreakData2 = getLineBreakData(factory, tabSize, breakAfter2, columnsForFullWidthChar, wrappingIndent, 'normal', false, text, null);
		assert.strictEqual(toAnnotatedText(text, directLineBreakData2), annotatedText2);

		// check that going from 1 to 2 is ok
		const lineBreakData2from1 = getLineBreakData(factory, tabSize, breakAfter2, columnsForFullWidthChar, wrappingIndent, 'normal', false, text, directLineBreakData1);
		assert.strictEqual(toAnnotatedText(text, lineBreakData2from1), annotatedText2);
		assertLineBreakDataEqual(lineBreakData2from1, directLineBreakData2);

		// check that going from 2 to 1 is ok
		const lineBreakData1from2 = getLineBreakData(factory, tabSize, breakAfter1, columnsForFullWidthChar, wrappingIndent, 'normal', false, text, directLineBreakData2);
		assert.strictEqual(toAnnotatedText(text, lineBreakData1from2), annotatedText1);
		assertLineBreakDataEqual(lineBreakData1from2, directLineBreakData1);
	}

	test('MonospaceLineBreaksComputer incremental 1', () => {

		const factory = new MonospaceLineBreaksComputerFactory(EditorOptions.wordWrapBreakBeforeCharacters.defaultValue, EditorOptions.wordWrapBreakAfterCharacters.defaultValue);

		assertIncrementalLineBreaks(
			factory, 'just some text and more', 4,
			10, 'just some |text and |more',
			15, 'just some text |and more'
		);

		assertIncrementalLineBreaks(
			factory, 'Cu scripserit suscipiantur eos, in affert pericula contentiones sed, cetero sanctus et pro. Ius vidit magna regione te, sit ei elaboraret liberavisse. Mundi verear eu mea, eam vero scriptorem in, vix in menandri assueverit. Natum definiebas cu vim. Vim doming vocibus efficiantur id. In indoctum deseruisse voluptatum vim, ad debitis verterem sed.', 4,
			47, 'Cu scripserit suscipiantur eos, in affert |pericula contentiones sed, cetero sanctus et |pro. Ius vidit magna regione te, sit ei |elaboraret liberavisse. Mundi verear eu mea, |eam vero scriptorem in, vix in menandri |assueverit. Natum definiebas cu vim. Vim |doming vocibus efficiantur id. In indoctum |deseruisse voluptatum vim, ad debitis verterem |sed.',
			142, 'Cu scripserit suscipiantur eos, in affert pericula contentiones sed, cetero sanctus et pro. Ius vidit magna regione te, sit ei elaboraret |liberavisse. Mundi verear eu mea, eam vero scriptorem in, vix in menandri assueverit. Natum definiebas cu vim. Vim doming vocibus efficiantur |id. In indoctum deseruisse voluptatum vim, ad debitis verterem sed.',
		);

		assertIncrementalLineBreaks(
			factory, 'An his legere persecuti, oblique delicata efficiantur ex vix, vel at graecis officiis maluisset. Et per impedit voluptua, usu discere maiorum at. Ut assum ornatus temporibus vis, an sea melius pericula. Ea dicunt oblique phaedrum nam, eu duo movet nobis. His melius facilis eu, vim malorum temporibus ne. Nec no sale regione, meliore civibus placerat id eam. Mea alii fabulas definitionem te, agam volutpat ad vis, et per bonorum nonumes repudiandae.', 4,
			57, 'An his legere persecuti, oblique delicata efficiantur ex |vix, vel at graecis officiis maluisset. Et per impedit |voluptua, usu discere maiorum at. Ut assum ornatus |temporibus vis, an sea melius pericula. Ea dicunt |oblique phaedrum nam, eu duo movet nobis. His melius |facilis eu, vim malorum temporibus ne. Nec no sale |regione, meliore civibus placerat id eam. Mea alii |fabulas definitionem te, agam volutpat ad vis, et per |bonorum nonumes repudiandae.',
			58, 'An his legere persecuti, oblique delicata efficiantur ex |vix, vel at graecis officiis maluisset. Et per impedit |voluptua, usu discere maiorum at. Ut assum ornatus |temporibus vis, an sea melius pericula. Ea dicunt oblique |phaedrum nam, eu duo movet nobis. His melius facilis eu, |vim malorum temporibus ne. Nec no sale regione, meliore |civibus placerat id eam. Mea alii fabulas definitionem |te, agam volutpat ad vis, et per bonorum nonumes |repudiandae.'
		);

		assertIncrementalLineBreaks(
			factory, '\t\t"owner": "vscode",', 4,
			14, '\t\t"owner|": |"vscod|e",',
			16, '\t\t"owner":| |"vscode"|,',
			WrappingIndent.Same
		);

		assertIncrementalLineBreaks(
			factory, '🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇&👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬', 4,
			51, '🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇&|👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬',
			50, '🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇|&|👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬',
			WrappingIndent.Same
		);

		assertIncrementalLineBreaks(
			factory, '🐇👬&🌞🌖', 4,
			5, '🐇👬&|🌞🌖',
			4, '🐇👬|&|🌞🌖',
			WrappingIndent.Same
		);

		assertIncrementalLineBreaks(
			factory, '\t\tfunc(\'🌞🏇🍼🌞🏇🍼🐇&👬🌖🌞👬🌖🌞🏇🍼🐇👬\', WrappingIndent.Same);', 4,
			26, '\t\tfunc|(\'🌞🏇🍼🌞🏇🍼🐇&|👬🌖🌞👬🌖🌞🏇🍼🐇|👬\', |WrappingIndent.|Same);',
			27, '\t\tfunc|(\'🌞🏇🍼🌞🏇🍼🐇&|👬🌖🌞👬🌖🌞🏇🍼🐇|👬\', |WrappingIndent.|Same);',
			WrappingIndent.Same
		);

		assertIncrementalLineBreaks(
			factory, 'factory, "xtxtfunc(x"🌞🏇🍼🌞🏇🍼🐇&👬🌖🌞👬🌖🌞🏇🍼🐇👬x"', 4,
			16, 'factory, |"xtxtfunc|(x"🌞🏇🍼🌞🏇🍼|🐇&|👬🌖🌞👬🌖🌞🏇🍼|🐇👬x"',
			17, 'factory, |"xtxtfunc|(x"🌞🏇🍼🌞🏇🍼🐇|&👬🌖🌞👬🌖🌞🏇🍼|🐇👬x"',
			WrappingIndent.Same
		);
	});

	test('issue #95686: CRITICAL: loop forever on the monospaceLineBreaksComputer', () => {
		const factory = new MonospaceLineBreaksComputerFactory(EditorOptions.wordWrapBreakBeforeCharacters.defaultValue, EditorOptions.wordWrapBreakAfterCharacters.defaultValue);
		assertIncrementalLineBreaks(
			factory,
			'						<tr dmx-class:table-danger="(alt <= 50)" dmx-class:table-warning="(alt <= 200)" dmx-class:table-primary="(alt <= 400)" dmx-class:table-info="(alt <= 800)" dmx-class:table-success="(alt >= 400)">',
			4,
			179, '						<tr dmx-class:table-danger="(alt <= 50)" dmx-class:table-warning="(alt <= 200)" dmx-class:table-primary="(alt <= 400)" dmx-class:table-info="(alt <= 800)" |dmx-class:table-success="(alt >= 400)">',
			1, '	|	|	|	|	|	|<|t|r| |d|m|x|-|c|l|a|s|s|:|t|a|b|l|e|-|d|a|n|g|e|r|=|"|(|a|l|t| |<|=| |5|0|)|"| |d|m|x|-|c|l|a|s|s|:|t|a|b|l|e|-|w|a|r|n|i|n|g|=|"|(|a|l|t| |<|=| |2|0|0|)|"| |d|m|x|-|c|l|a|s|s|:|t|a|b|l|e|-|p|r|i|m|a|r|y|=|"|(|a|l|t| |<|=| |4|0|0|)|"| |d|m|x|-|c|l|a|s|s|:|t|a|b|l|e|-|i|n|f|o|=|"|(|a|l|t| |<|=| |8|0|0|)|"| |d|m|x|-|c|l|a|s|s|:|t|a|b|l|e|-|s|u|c|c|e|s|s|=|"|(|a|l|t| |>|=| |4|0|0|)|"|>',
			WrappingIndent.Same
		);
	});

	test('issue #110392: Occasional crash when resize with panel on the right', () => {
		const factory = new MonospaceLineBreaksComputerFactory(EditorOptions.wordWrapBreakBeforeCharacters.defaultValue, EditorOptions.wordWrapBreakAfterCharacters.defaultValue);
		assertIncrementalLineBreaks(
			factory,
			'你好 **hello** **hello** **hello-world** hey there!',
			4,
			15, '你好 **hello** |**hello** |**hello-world**| hey there!',
			1, '你|好| |*|*|h|e|l|l|o|*|*| |*|*|h|e|l|l|o|*|*| |*|*|h|e|l|l|o|-|w|o|r|l|d|*|*| |h|e|y| |t|h|e|r|e|!',
			WrappingIndent.Same,
			1.6605405405405405
		);
	});

	test('MonospaceLineBreaksComputer - CJK and Kinsoku Shori', () => {
		const factory = new MonospaceLineBreaksComputerFactory('(', '\t)');
		assertLineBreaks(factory, 4, 5, 'aa \u5b89|\u5b89');
		assertLineBreaks(factory, 4, 5, '\u3042 \u5b89|\u5b89');
		assertLineBreaks(factory, 4, 5, '\u3042\u3042|\u5b89\u5b89');
		assertLineBreaks(factory, 4, 5, 'aa |\u5b89)\u5b89|\u5b89');
		assertLineBreaks(factory, 4, 5, 'aa \u3042|\u5b89\u3042)|\u5b89');
		assertLineBreaks(factory, 4, 5, 'aa |(\u5b89aa|\u5b89');
	});

	test('MonospaceLineBreaksComputer - WrappingIndent.Same', () => {
		const factory = new MonospaceLineBreaksComputerFactory('', '\t ');
		assertLineBreaks(factory, 4, 38, ' *123456789012345678901234567890123456|7890', WrappingIndent.Same);
	});

	test('issue #16332: Scroll bar overlaying on top of text', () => {
		const factory = new MonospaceLineBreaksComputerFactory('', '\t ');
		assertLineBreaks(factory, 4, 24, 'a/ very/long/line/of/tex|t/that/expands/beyon|d/your/typical/line/|of/code/', WrappingIndent.Indent);
	});

	test('issue #35162: wrappingIndent not consistently working', () => {
		const factory = new MonospaceLineBreaksComputerFactory('', '\t ');
		const mapper = assertLineBreaks(factory, 4, 24, '                t h i s |i s |a l |o n |g l |i n |e', WrappingIndent.Indent);
		assert.strictEqual(mapper!.wrappedTextIndentLength, '                    '.length);
	});

	test('issue #75494: surrogate pairs', () => {
		const factory = new MonospaceLineBreaksComputerFactory('\t', ' ');
		assertLineBreaks(factory, 4, 49, '🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼|🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼🐇👬🌖🌞🏇🍼|🐇👬', WrappingIndent.Same);
	});

	test('issue #75494: surrogate pairs overrun 1', () => {
		const factory = new MonospaceLineBreaksComputerFactory(EditorOptions.wordWrapBreakBeforeCharacters.defaultValue, EditorOptions.wordWrapBreakAfterCharacters.defaultValue);
		assertLineBreaks(factory, 4, 4, '🐇👬|&|🌞🌖', WrappingIndent.Same);
	});

	test('issue #75494: surrogate pairs overrun 2', () => {
		const factory = new MonospaceLineBreaksComputerFactory(EditorOptions.wordWrapBreakBeforeCharacters.defaultValue, EditorOptions.wordWrapBreakAfterCharacters.defaultValue);
		assertLineBreaks(factory, 4, 17, 'factory, |"xtxtfunc|(x"🌞🏇🍼🌞🏇🍼🐇|&👬🌖🌞👬🌖🌞🏇🍼|🐇👬x"', WrappingIndent.Same);
	});

	test('MonospaceLineBreaksComputer - WrappingIndent.DeepIndent', () => {
		const factory = new MonospaceLineBreaksComputerFactory('', '\t ');
		const mapper = assertLineBreaks(factory, 4, 26, '        W e A r e T e s t |i n g D e |e p I n d |e n t a t |i o n', WrappingIndent.DeepIndent);
		assert.strictEqual(mapper!.wrappedTextIndentLength, '                '.length);
	});

	test('issue #33366: Word wrap algorithm behaves differently around punctuation', () => {
		const factory = new MonospaceLineBreaksComputerFactory(EditorOptions.wordWrapBreakBeforeCharacters.defaultValue, EditorOptions.wordWrapBreakAfterCharacters.defaultValue);
		assertLineBreaks(factory, 4, 23, 'this is a line of |text, text that sits |on a line', WrappingIndent.Same);
	});

	test('issue #152773: Word wrap algorithm behaves differently with bracket followed by comma', () => {
		const factory = new MonospaceLineBreaksComputerFactory(EditorOptions.wordWrapBreakBeforeCharacters.defaultValue, EditorOptions.wordWrapBreakAfterCharacters.defaultValue);
		assertLineBreaks(factory, 4, 24, 'this is a line of |(text), text that sits |on a line', WrappingIndent.Same);
	});

	test('issue #112382: Word wrap doesn\'t work well with control characters', () => {
		const factory = new MonospaceLineBreaksComputerFactory(EditorOptions.wordWrapBreakBeforeCharacters.defaultValue, EditorOptions.wordWrapBreakAfterCharacters.defaultValue);
		assertLineBreaks(factory, 4, 6, '\x06\x06\x06|\x06\x06\x06', WrappingIndent.Same);
	});

	test('Word break work well with Chinese/Japanese/Korean (CJK) text when setting normal', () => {
		const factory = new MonospaceLineBreaksComputerFactory(EditorOptions.wordWrapBreakBeforeCharacters.defaultValue, EditorOptions.wordWrapBreakAfterCharacters.defaultValue);
		assertLineBreaks(factory, 4, 5, '你好|1111', WrappingIndent.Same, 'normal');
	});

	test('Word break work well with Chinese/Japanese/Korean (CJK) text when setting keepAll', () => {
		const factory = new MonospaceLineBreaksComputerFactory(EditorOptions.wordWrapBreakBeforeCharacters.defaultValue, EditorOptions.wordWrapBreakAfterCharacters.defaultValue);
		assertLineBreaks(factory, 4, 8, '你好1111', WrappingIndent.Same, 'keepAll');
	});

	test('issue #258022: wrapOnEscapedLineFeeds: should work correctly after editor resize', () => {
		const factory = new MonospaceLineBreaksComputerFactory(EditorOptions.wordWrapBreakBeforeCharacters.defaultValue, EditorOptions.wordWrapBreakAfterCharacters.defaultValue);

		// Test text with escaped line feeds - simulates a JSON string with \n
		// The \n should trigger a soft wrap when wrapOnEscapedLineFeeds is enabled
		const text = '"Short text with\\nescaped newline and an escaped\\\\nbackslash"';

		// First, compute line breaks with wrapOnEscapedLineFeeds enabled at initial width
		const initialBreakData = getLineBreakData(factory, 4, 30, 2, WrappingIndent.None, 'normal', true, text, null);
		const initialAnnotatedText = toAnnotatedText(text, initialBreakData);

		// Verify the escaped \n triggers a wrap in the initial case
		assert.ok(initialAnnotatedText.includes('with\\n'), 'Initial case should wrap at escaped line feeds');

		// Now simulate editor resize by computing line breaks with different width using previous data
		// This triggers createLineBreaksFromPreviousLineBreaks which has the bug
		const resizedBreakData = getLineBreakData(factory, 4, 35, 2, WrappingIndent.None, 'normal', true, text, initialBreakData);
		const resizedAnnotatedText = toAnnotatedText(text, resizedBreakData);

		// Compute fresh line breaks at the new width (without using previous data)
		// This uses createLineBreaks which correctly handles wrapOnEscapedLineFeeds
		const freshBreakData = getLineBreakData(factory, 4, 35, 2, WrappingIndent.None, 'normal', true, text, null);
		const freshAnnotatedText = toAnnotatedText(text, freshBreakData);

		// Fresh computation should still wrap at escaped line feeds
		assert.ok(freshAnnotatedText.includes('with\\n'), 'Fresh computation should wrap at escaped line feeds');

		// BUG DEMONSTRATION: Incremental computation after resize doesn't handle escaped line feeds
		// The two results should be identical, but they're not due to the bug
		assert.strictEqual(
			resizedAnnotatedText,
			freshAnnotatedText,
			`Bug: Incremental and fresh computations differ for escaped line feeds.\n` +
			`Incremental (resize): ${resizedAnnotatedText}\n` +
			`Fresh computation:   ${freshAnnotatedText}\n` +
			`The incremental path (createLineBreaksFromPreviousLineBreaks) doesn't handle wrapOnEscapedLineFeeds`
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/viewModel/prefixSumComputer.test.ts]---
Location: vscode-main/src/vs/editor/test/common/viewModel/prefixSumComputer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { toUint32 } from '../../../../base/common/uint.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { PrefixSumComputer, PrefixSumIndexOfResult } from '../../../common/model/prefixSumComputer.js';

function toUint32Array(arr: number[]): Uint32Array {
	const len = arr.length;
	const r = new Uint32Array(len);
	for (let i = 0; i < len; i++) {
		r[i] = toUint32(arr[i]);
	}
	return r;
}

suite('Editor ViewModel - PrefixSumComputer', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('PrefixSumComputer', () => {
		let indexOfResult: PrefixSumIndexOfResult;

		const psc = new PrefixSumComputer(toUint32Array([1, 1, 2, 1, 3]));
		assert.strictEqual(psc.getTotalSum(), 8);
		assert.strictEqual(psc.getPrefixSum(-1), 0);
		assert.strictEqual(psc.getPrefixSum(0), 1);
		assert.strictEqual(psc.getPrefixSum(1), 2);
		assert.strictEqual(psc.getPrefixSum(2), 4);
		assert.strictEqual(psc.getPrefixSum(3), 5);
		assert.strictEqual(psc.getPrefixSum(4), 8);
		indexOfResult = psc.getIndexOf(0);
		assert.strictEqual(indexOfResult.index, 0);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(1);
		assert.strictEqual(indexOfResult.index, 1);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(2);
		assert.strictEqual(indexOfResult.index, 2);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(3);
		assert.strictEqual(indexOfResult.index, 2);
		assert.strictEqual(indexOfResult.remainder, 1);
		indexOfResult = psc.getIndexOf(4);
		assert.strictEqual(indexOfResult.index, 3);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(5);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(6);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 1);
		indexOfResult = psc.getIndexOf(7);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 2);
		indexOfResult = psc.getIndexOf(8);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 3);

		// [1, 2, 2, 1, 3]
		psc.setValue(1, 2);
		assert.strictEqual(psc.getTotalSum(), 9);
		assert.strictEqual(psc.getPrefixSum(0), 1);
		assert.strictEqual(psc.getPrefixSum(1), 3);
		assert.strictEqual(psc.getPrefixSum(2), 5);
		assert.strictEqual(psc.getPrefixSum(3), 6);
		assert.strictEqual(psc.getPrefixSum(4), 9);

		// [1, 0, 2, 1, 3]
		psc.setValue(1, 0);
		assert.strictEqual(psc.getTotalSum(), 7);
		assert.strictEqual(psc.getPrefixSum(0), 1);
		assert.strictEqual(psc.getPrefixSum(1), 1);
		assert.strictEqual(psc.getPrefixSum(2), 3);
		assert.strictEqual(psc.getPrefixSum(3), 4);
		assert.strictEqual(psc.getPrefixSum(4), 7);
		indexOfResult = psc.getIndexOf(0);
		assert.strictEqual(indexOfResult.index, 0);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(1);
		assert.strictEqual(indexOfResult.index, 2);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(2);
		assert.strictEqual(indexOfResult.index, 2);
		assert.strictEqual(indexOfResult.remainder, 1);
		indexOfResult = psc.getIndexOf(3);
		assert.strictEqual(indexOfResult.index, 3);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(4);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(5);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 1);
		indexOfResult = psc.getIndexOf(6);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 2);
		indexOfResult = psc.getIndexOf(7);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 3);

		// [1, 0, 0, 1, 3]
		psc.setValue(2, 0);
		assert.strictEqual(psc.getTotalSum(), 5);
		assert.strictEqual(psc.getPrefixSum(0), 1);
		assert.strictEqual(psc.getPrefixSum(1), 1);
		assert.strictEqual(psc.getPrefixSum(2), 1);
		assert.strictEqual(psc.getPrefixSum(3), 2);
		assert.strictEqual(psc.getPrefixSum(4), 5);
		indexOfResult = psc.getIndexOf(0);
		assert.strictEqual(indexOfResult.index, 0);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(1);
		assert.strictEqual(indexOfResult.index, 3);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(2);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(3);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 1);
		indexOfResult = psc.getIndexOf(4);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 2);
		indexOfResult = psc.getIndexOf(5);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 3);

		// [1, 0, 0, 0, 3]
		psc.setValue(3, 0);
		assert.strictEqual(psc.getTotalSum(), 4);
		assert.strictEqual(psc.getPrefixSum(0), 1);
		assert.strictEqual(psc.getPrefixSum(1), 1);
		assert.strictEqual(psc.getPrefixSum(2), 1);
		assert.strictEqual(psc.getPrefixSum(3), 1);
		assert.strictEqual(psc.getPrefixSum(4), 4);
		indexOfResult = psc.getIndexOf(0);
		assert.strictEqual(indexOfResult.index, 0);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(1);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(2);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 1);
		indexOfResult = psc.getIndexOf(3);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 2);
		indexOfResult = psc.getIndexOf(4);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 3);

		// [1, 1, 0, 1, 1]
		psc.setValue(1, 1);
		psc.setValue(3, 1);
		psc.setValue(4, 1);
		assert.strictEqual(psc.getTotalSum(), 4);
		assert.strictEqual(psc.getPrefixSum(0), 1);
		assert.strictEqual(psc.getPrefixSum(1), 2);
		assert.strictEqual(psc.getPrefixSum(2), 2);
		assert.strictEqual(psc.getPrefixSum(3), 3);
		assert.strictEqual(psc.getPrefixSum(4), 4);
		indexOfResult = psc.getIndexOf(0);
		assert.strictEqual(indexOfResult.index, 0);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(1);
		assert.strictEqual(indexOfResult.index, 1);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(2);
		assert.strictEqual(indexOfResult.index, 3);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(3);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 0);
		indexOfResult = psc.getIndexOf(4);
		assert.strictEqual(indexOfResult.index, 4);
		assert.strictEqual(indexOfResult.remainder, 1);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/defaultLinesDiffComputer.test.ts]---
Location: vscode-main/src/vs/editor/test/node/diffing/defaultLinesDiffComputer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Range } from '../../../common/core/range.js';
import { getLineRangeMapping, RangeMapping } from '../../../common/diff/rangeMapping.js';
import { OffsetRange } from '../../../common/core/ranges/offsetRange.js';
import { LinesSliceCharSequence } from '../../../common/diff/defaultLinesDiffComputer/linesSliceCharSequence.js';
import { MyersDiffAlgorithm } from '../../../common/diff/defaultLinesDiffComputer/algorithms/myersDiffAlgorithm.js';
import { DynamicProgrammingDiffing } from '../../../common/diff/defaultLinesDiffComputer/algorithms/dynamicProgrammingDiffing.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ArrayText } from '../../../common/core/text/abstractText.js';

suite('myers', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('1', () => {
		const s1 = new LinesSliceCharSequence(['hello world'], new Range(1, 1, 1, Number.MAX_SAFE_INTEGER), true);
		const s2 = new LinesSliceCharSequence(['hallo welt'], new Range(1, 1, 1, Number.MAX_SAFE_INTEGER), true);

		const a = true ? new MyersDiffAlgorithm() : new DynamicProgrammingDiffing();
		a.compute(s1, s2);
	});
});

suite('lineRangeMapping', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('Simple', () => {
		assert.deepStrictEqual(
			getLineRangeMapping(
				new RangeMapping(
					new Range(2, 1, 3, 1),
					new Range(2, 1, 2, 1)
				),
				new ArrayText([
					'const abc = "helloworld".split("");',
					'',
					''
				]),
				new ArrayText([
					'const asciiLower = "helloworld".split("");',
					''
				])
			).toString(),
			'{[2,3)->[2,2)}'
		);
	});

	test('Empty Lines', () => {
		assert.deepStrictEqual(
			getLineRangeMapping(
				new RangeMapping(
					new Range(2, 1, 2, 1),
					new Range(2, 1, 4, 1),
				),
				new ArrayText([
					'',
					'',
				]),
				new ArrayText([
					'',
					'',
					'',
					'',
				])
			).toString(),
			'{[2,2)->[2,4)}'
		);
	});
});

suite('LinesSliceCharSequence', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	const sequence = new LinesSliceCharSequence(
		[
			'line1: foo',
			'line2: fizzbuzz',
			'line3: barr',
			'line4: hello world',
			'line5: bazz',
		],
		new Range(2, 1, 5, 1), true
	);

	test('translateOffset', () => {
		assert.deepStrictEqual(
			{ result: OffsetRange.ofLength(sequence.length).map(offset => sequence.translateOffset(offset).toString()) },
			({
				result: [
					'(2,1)', '(2,2)', '(2,3)', '(2,4)', '(2,5)', '(2,6)', '(2,7)', '(2,8)', '(2,9)', '(2,10)', '(2,11)',
					'(2,12)', '(2,13)', '(2,14)', '(2,15)', '(2,16)',

					'(3,1)', '(3,2)', '(3,3)', '(3,4)', '(3,5)', '(3,6)', '(3,7)', '(3,8)', '(3,9)', '(3,10)', '(3,11)', '(3,12)',

					'(4,1)', '(4,2)', '(4,3)', '(4,4)', '(4,5)', '(4,6)', '(4,7)', '(4,8)', '(4,9)',
					'(4,10)', '(4,11)', '(4,12)', '(4,13)', '(4,14)', '(4,15)', '(4,16)', '(4,17)',
					'(4,18)', '(4,19)'
				]
			})
		);
	});

	test('extendToFullLines', () => {
		assert.deepStrictEqual(
			{ result: sequence.getText(sequence.extendToFullLines(new OffsetRange(20, 25))) },
			({ result: 'line3: barr\n' })
		);

		assert.deepStrictEqual(
			{ result: sequence.getText(sequence.extendToFullLines(new OffsetRange(20, 45))) },
			({ result: 'line3: barr\nline4: hello world\n' })
		);
	});
});
```

--------------------------------------------------------------------------------

````
