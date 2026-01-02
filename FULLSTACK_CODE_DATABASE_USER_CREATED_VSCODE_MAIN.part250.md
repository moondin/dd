---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 250
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 250 of 552)

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

---[FILE: src/vs/editor/test/common/model/tokensStore.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/tokensStore.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ISingleEditOperation } from '../../../common/core/editOperation.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { ColorId, FontStyle, MetadataConsts, TokenMetadata } from '../../../common/encodedTokenAttributes.js';
import { ILanguageConfigurationService, LanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { TextModel } from '../../../common/model/textModel.js';
import { LanguageIdCodec } from '../../../common/services/languagesRegistry.js';
import { LineTokens } from '../../../common/tokens/lineTokens.js';
import { SparseMultilineTokens } from '../../../common/tokens/sparseMultilineTokens.js';
import { SparseTokensStore } from '../../../common/tokens/sparseTokensStore.js';
import { createModelServices, createTextModel, instantiateTextModel } from '../testTextModel.js';

suite('TokensStore', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const SEMANTIC_COLOR = 5 as ColorId;

	function parseTokensState(state: string[]): { text: string; tokens: SparseMultilineTokens } {
		const text: string[] = [];
		const tokens: number[] = [];
		let baseLine = 1;
		for (let i = 0; i < state.length; i++) {
			const line = state[i];

			let startOffset = 0;
			let lineText = '';
			while (true) {
				const firstPipeOffset = line.indexOf('|', startOffset);
				if (firstPipeOffset === -1) {
					break;
				}
				const secondPipeOffset = line.indexOf('|', firstPipeOffset + 1);
				if (secondPipeOffset === -1) {
					break;
				}
				if (firstPipeOffset + 1 === secondPipeOffset) {
					// skip ||
					lineText += line.substring(startOffset, secondPipeOffset + 1);
					startOffset = secondPipeOffset + 1;
					continue;
				}

				lineText += line.substring(startOffset, firstPipeOffset);
				const tokenStartCharacter = lineText.length;
				const tokenLength = secondPipeOffset - firstPipeOffset - 1;
				const metadata = (
					SEMANTIC_COLOR << MetadataConsts.FOREGROUND_OFFSET
					| MetadataConsts.SEMANTIC_USE_FOREGROUND
				);

				if (tokens.length === 0) {
					baseLine = i + 1;
				}
				tokens.push(i + 1 - baseLine, tokenStartCharacter, tokenStartCharacter + tokenLength, metadata);

				lineText += line.substr(firstPipeOffset + 1, tokenLength);
				startOffset = secondPipeOffset + 1;
			}

			lineText += line.substring(startOffset);

			text.push(lineText);
		}

		return {
			text: text.join('\n'),
			tokens: SparseMultilineTokens.create(baseLine, new Uint32Array(tokens))
		};
	}

	function extractState(model: TextModel): string[] {
		const result: string[] = [];
		for (let lineNumber = 1; lineNumber <= model.getLineCount(); lineNumber++) {
			const lineTokens = model.tokenization.getLineTokens(lineNumber);
			const lineContent = model.getLineContent(lineNumber);

			let lineText = '';
			for (let i = 0; i < lineTokens.getCount(); i++) {
				const tokenStartCharacter = lineTokens.getStartOffset(i);
				const tokenEndCharacter = lineTokens.getEndOffset(i);
				const metadata = lineTokens.getMetadata(i);
				const color = TokenMetadata.getForeground(metadata);
				const tokenText = lineContent.substring(tokenStartCharacter, tokenEndCharacter);
				if (color === SEMANTIC_COLOR) {
					lineText += `|${tokenText}|`;
				} else {
					lineText += tokenText;
				}
			}

			result.push(lineText);
		}
		return result;
	}

	function testTokensAdjustment(rawInitialState: string[], edits: ISingleEditOperation[], rawFinalState: string[]) {
		const initialState = parseTokensState(rawInitialState);
		const model = createTextModel(initialState.text);
		model.tokenization.setSemanticTokens([initialState.tokens], true);

		model.applyEdits(edits);

		const actualState = extractState(model);
		assert.deepStrictEqual(actualState, rawFinalState);

		model.dispose();
	}

	test('issue #86303 - color shifting between different tokens', () => {
		testTokensAdjustment(
			[
				`import { |URI| } from 'vs/base/common/uri';`,
				`const foo = |URI|.parse('hey');`
			],
			[
				{ range: new Range(2, 9, 2, 10), text: '' }
			],
			[
				`import { |URI| } from 'vs/base/common/uri';`,
				`const fo = |URI|.parse('hey');`
			]
		);
	});

	test('deleting a newline', () => {
		testTokensAdjustment(
			[
				`import { |URI| } from 'vs/base/common/uri';`,
				`const foo = |URI|.parse('hey');`
			],
			[
				{ range: new Range(1, 42, 2, 1), text: '' }
			],
			[
				`import { |URI| } from 'vs/base/common/uri';const foo = |URI|.parse('hey');`
			]
		);
	});

	test('inserting a newline', () => {
		testTokensAdjustment(
			[
				`import { |URI| } from 'vs/base/common/uri';const foo = |URI|.parse('hey');`
			],
			[
				{ range: new Range(1, 42, 1, 42), text: '\n' }
			],
			[
				`import { |URI| } from 'vs/base/common/uri';`,
				`const foo = |URI|.parse('hey');`
			]
		);
	});

	test('deleting a newline 2', () => {
		testTokensAdjustment(
			[
				`import { `,
				`    |URI| } from 'vs/base/common/uri';const foo = |URI|.parse('hey');`
			],
			[
				{ range: new Range(1, 10, 2, 5), text: '' }
			],
			[
				`import { |URI| } from 'vs/base/common/uri';const foo = |URI|.parse('hey');`
			]
		);
	});

	test('issue #179268: a complex edit', () => {
		testTokensAdjustment(
			[
				`|export| |'interior_material_selector.dart'|;`,
				`|export| |'mileage_selector.dart'|;`,
				`|export| |'owners_selector.dart'|;`,
				`|export| |'price_selector.dart'|;`,
				`|export| |'seat_count_selector.dart'|;`,
				`|export| |'year_selector.dart'|;`,
				`|export| |'winter_options_selector.dart'|;|export| |'camera_selector.dart'|;`
			],
			[
				{ range: new Range(1, 9, 1, 9), text: `camera_selector.dart';\nexport '` },
				{ range: new Range(6, 9, 7, 9), text: `` },
				{ range: new Range(7, 39, 7, 39), text: `\n` },
				{ range: new Range(7, 47, 7, 48), text: `ye` },
				{ range: new Range(7, 49, 7, 51), text: `` },
				{ range: new Range(7, 52, 7, 53), text: `` },
			],
			[
				`|export| |'|camera_selector.dart';`,
				`export 'interior_material_selector.dart';`,
				`|export| |'mileage_selector.dart'|;`,
				`|export| |'owners_selector.dart'|;`,
				`|export| |'price_selector.dart'|;`,
				`|export| |'seat_count_selector.dart'|;`,
				`|export| |'||winter_options_selector.dart'|;`,
				`|export| |'year_selector.dart'|;`
			]
		);
	});

	test('issue #91936: Semantic token color highlighting fails on line with selected text', () => {
		const model = createTextModel('                    else if ($s = 08) then \'\\b\'');
		model.tokenization.setSemanticTokens([
			SparseMultilineTokens.create(1, new Uint32Array([
				0, 20, 24, 0b01111000000000010000,
				0, 25, 27, 0b01111000000000010000,
				0, 28, 29, 0b00001000000000010000,
				0, 29, 31, 0b10000000000000010000,
				0, 32, 33, 0b00001000000000010000,
				0, 34, 36, 0b00110000000000010000,
				0, 36, 37, 0b00001000000000010000,
				0, 38, 42, 0b01111000000000010000,
				0, 43, 47, 0b01011000000000010000,
			]))
		], true);
		const lineTokens = model.tokenization.getLineTokens(1);
		const decodedTokens: number[] = [];
		for (let i = 0, len = lineTokens.getCount(); i < len; i++) {
			decodedTokens.push(lineTokens.getEndOffset(i), lineTokens.getMetadata(i));
		}

		assert.deepStrictEqual(decodedTokens, [
			20, 0b10000000001000010000000001,
			24, 0b10000001111000010000000001,
			25, 0b10000000001000010000000001,
			27, 0b10000001111000010000000001,
			28, 0b10000000001000010000000001,
			29, 0b10000000001000010000000001,
			31, 0b10000010000000010000000001,
			32, 0b10000000001000010000000001,
			33, 0b10000000001000010000000001,
			34, 0b10000000001000010000000001,
			36, 0b10000000110000010000000001,
			37, 0b10000000001000010000000001,
			38, 0b10000000001000010000000001,
			42, 0b10000001111000010000000001,
			43, 0b10000000001000010000000001,
			47, 0b10000001011000010000000001
		]);

		model.dispose();
	});

	test('issue #147944: Language id "vs.editor.nullLanguage" is not configured nor known', () => {
		const disposables = new DisposableStore();
		const instantiationService = createModelServices(disposables, [
			[ILanguageConfigurationService, LanguageConfigurationService]
		]);
		const model = disposables.add(instantiateTextModel(instantiationService, '--[[\n\n]]'));
		model.tokenization.setSemanticTokens([
			SparseMultilineTokens.create(1, new Uint32Array([
				0, 2, 4, 0b100000000000010000,
				1, 0, 0, 0b100000000000010000,
				2, 0, 2, 0b100000000000010000,
			]))
		], true);
		assert.strictEqual(model.getWordAtPosition(new Position(2, 1)), null);
		disposables.dispose();
	});

	test('partial tokens 1', () => {
		const codec = new LanguageIdCodec();
		const store = new SparseTokensStore(codec);

		// setPartial: [1,1 -> 31,2], [(5,5-10),(10,5-10),(15,5-10),(20,5-10),(25,5-10),(30,5-10)]
		store.setPartial(new Range(1, 1, 31, 2), [
			SparseMultilineTokens.create(5, new Uint32Array([
				0, 5, 10, 1,
				5, 5, 10, 2,
				10, 5, 10, 3,
				15, 5, 10, 4,
				20, 5, 10, 5,
				25, 5, 10, 6,
			]))
		]);

		// setPartial: [18,1 -> 42,1], [(20,5-10),(25,5-10),(30,5-10),(35,5-10),(40,5-10)]
		store.setPartial(new Range(18, 1, 42, 1), [
			SparseMultilineTokens.create(20, new Uint32Array([
				0, 5, 10, 4,
				5, 5, 10, 5,
				10, 5, 10, 6,
				15, 5, 10, 7,
				20, 5, 10, 8,
			]))
		]);

		// setPartial: [1,1 -> 31,2], [(5,5-10),(10,5-10),(15,5-10),(20,5-10),(25,5-10),(30,5-10)]
		store.setPartial(new Range(1, 1, 31, 2), [
			SparseMultilineTokens.create(5, new Uint32Array([
				0, 5, 10, 1,
				5, 5, 10, 2,
				10, 5, 10, 3,
				15, 5, 10, 4,
				20, 5, 10, 5,
				25, 5, 10, 6,
			]))
		]);

		const lineTokens = store.addSparseTokens(10, new LineTokens(new Uint32Array([12, 1]), `enum Enum1 {`, codec));
		assert.strictEqual(lineTokens.getCount(), 3);
	});

	test('partial tokens 2', () => {
		const codec = new LanguageIdCodec();
		const store = new SparseTokensStore(codec);

		// setPartial: [1,1 -> 31,2], [(5,5-10),(10,5-10),(15,5-10),(20,5-10),(25,5-10),(30,5-10)]
		store.setPartial(new Range(1, 1, 31, 2), [
			SparseMultilineTokens.create(5, new Uint32Array([
				0, 5, 10, 1,
				5, 5, 10, 2,
				10, 5, 10, 3,
				15, 5, 10, 4,
				20, 5, 10, 5,
				25, 5, 10, 6,
			]))
		]);

		// setPartial: [6,1 -> 36,2], [(10,5-10),(15,5-10),(20,5-10),(25,5-10),(30,5-10),(35,5-10)]
		store.setPartial(new Range(6, 1, 36, 2), [
			SparseMultilineTokens.create(10, new Uint32Array([
				0, 5, 10, 2,
				5, 5, 10, 3,
				10, 5, 10, 4,
				15, 5, 10, 5,
				20, 5, 10, 6,
			]))
		]);

		// setPartial: [17,1 -> 42,1], [(20,5-10),(25,5-10),(30,5-10),(35,5-10),(40,5-10)]
		store.setPartial(new Range(17, 1, 42, 1), [
			SparseMultilineTokens.create(20, new Uint32Array([
				0, 5, 10, 4,
				5, 5, 10, 5,
				10, 5, 10, 6,
				15, 5, 10, 7,
				20, 5, 10, 8,
			]))
		]);

		const lineTokens = store.addSparseTokens(20, new LineTokens(new Uint32Array([12, 1]), `enum Enum1 {`, codec));
		assert.strictEqual(lineTokens.getCount(), 3);
	});

	test('partial tokens 3', () => {
		const codec = new LanguageIdCodec();
		const store = new SparseTokensStore(codec);

		// setPartial: [1,1 -> 31,2], [(5,5-10),(10,5-10),(15,5-10),(20,5-10),(25,5-10),(30,5-10)]
		store.setPartial(new Range(1, 1, 31, 2), [
			SparseMultilineTokens.create(5, new Uint32Array([
				0, 5, 10, 1,
				5, 5, 10, 2,
				10, 5, 10, 3,
				15, 5, 10, 4,
				20, 5, 10, 5,
				25, 5, 10, 6,
			]))
		]);

		// setPartial: [11,1 -> 16,2], [(15,5-10),(20,5-10)]
		store.setPartial(new Range(11, 1, 16, 2), [
			SparseMultilineTokens.create(10, new Uint32Array([
				0, 5, 10, 3,
				5, 5, 10, 4,
			]))
		]);

		const lineTokens = store.addSparseTokens(5, new LineTokens(new Uint32Array([12, 1]), `enum Enum1 {`, codec));
		assert.strictEqual(lineTokens.getCount(), 3);
	});

	test('issue #94133: Semantic colors stick around when using (only) range provider', () => {
		const codec = new LanguageIdCodec();
		const store = new SparseTokensStore(codec);

		// setPartial: [1,1 -> 1,20] [(1,9-11)]
		store.setPartial(new Range(1, 1, 1, 20), [
			SparseMultilineTokens.create(1, new Uint32Array([
				0, 9, 11, 1,
			]))
		]);

		// setPartial: [1,1 -> 1,20], []
		store.setPartial(new Range(1, 1, 1, 20), []);

		const lineTokens = store.addSparseTokens(1, new LineTokens(new Uint32Array([12, 1]), `enum Enum1 {`, codec));
		assert.strictEqual(lineTokens.getCount(), 1);
	});

	test('bug', () => {
		function createTokens(str: string): SparseMultilineTokens {
			str = str.replace(/^\[\(/, '');
			str = str.replace(/\)\]$/, '');
			const strTokens = str.split('),(');
			const result: number[] = [];
			let firstLineNumber = 0;
			for (const strToken of strTokens) {
				const pieces = strToken.split(',');
				const chars = pieces[1].split('-');
				const lineNumber = parseInt(pieces[0], 10);
				const startChar = parseInt(chars[0], 10);
				const endChar = parseInt(chars[1], 10);
				if (firstLineNumber === 0) {
					// this is the first line
					firstLineNumber = lineNumber;
				}
				result.push(lineNumber - firstLineNumber, startChar, endChar, (lineNumber + startChar) % 13);
			}
			return SparseMultilineTokens.create(firstLineNumber, new Uint32Array(result));
		}

		const codec = new LanguageIdCodec();
		const store = new SparseTokensStore(codec);
		// setPartial [36446,1 -> 36475,115] [(36448,24-29),(36448,33-46),(36448,47-54),(36450,25-35),(36450,36-50),(36451,28-33),(36451,36-49),(36451,50-57),(36452,35-53),(36452,54-62),(36454,33-38),(36454,41-54),(36454,55-60),(36455,35-53),(36455,54-62),(36457,33-44),(36457,45-49),(36457,50-56),(36457,62-83),(36457,84-88),(36458,35-53),(36458,54-62),(36460,33-37),(36460,38-42),(36460,47-57),(36460,58-67),(36461,35-53),(36461,54-62),(36463,34-38),(36463,39-45),(36463,46-51),(36463,54-63),(36463,64-71),(36463,76-80),(36463,81-87),(36463,88-92),(36463,97-107),(36463,108-119),(36464,35-53),(36464,54-62),(36466,33-71),(36466,72-76),(36467,35-53),(36467,54-62),(36469,24-29),(36469,33-46),(36469,47-54),(36470,24-35),(36470,38-46),(36473,25-35),(36473,36-51),(36474,28-33),(36474,36-49),(36474,50-58),(36475,35-53),(36475,54-62)]
		store.setPartial(
			new Range(36446, 1, 36475, 115),
			[createTokens('[(36448,24-29),(36448,33-46),(36448,47-54),(36450,25-35),(36450,36-50),(36451,28-33),(36451,36-49),(36451,50-57),(36452,35-53),(36452,54-62),(36454,33-38),(36454,41-54),(36454,55-60),(36455,35-53),(36455,54-62),(36457,33-44),(36457,45-49),(36457,50-56),(36457,62-83),(36457,84-88),(36458,35-53),(36458,54-62),(36460,33-37),(36460,38-42),(36460,47-57),(36460,58-67),(36461,35-53),(36461,54-62),(36463,34-38),(36463,39-45),(36463,46-51),(36463,54-63),(36463,64-71),(36463,76-80),(36463,81-87),(36463,88-92),(36463,97-107),(36463,108-119),(36464,35-53),(36464,54-62),(36466,33-71),(36466,72-76),(36467,35-53),(36467,54-62),(36469,24-29),(36469,33-46),(36469,47-54),(36470,24-35),(36470,38-46),(36473,25-35),(36473,36-51),(36474,28-33),(36474,36-49),(36474,50-58),(36475,35-53),(36475,54-62)]')]
		);
		// setPartial [36436,1 -> 36464,142] [(36437,33-37),(36437,38-42),(36437,47-57),(36437,58-67),(36438,35-53),(36438,54-62),(36440,24-29),(36440,33-46),(36440,47-53),(36442,25-35),(36442,36-50),(36443,30-39),(36443,42-46),(36443,47-53),(36443,54-58),(36443,63-73),(36443,74-84),(36443,87-91),(36443,92-98),(36443,101-105),(36443,106-112),(36443,113-119),(36444,28-37),(36444,38-42),(36444,47-57),(36444,58-75),(36444,80-95),(36444,96-105),(36445,35-53),(36445,54-62),(36448,24-29),(36448,33-46),(36448,47-54),(36450,25-35),(36450,36-50),(36451,28-33),(36451,36-49),(36451,50-57),(36452,35-53),(36452,54-62),(36454,33-38),(36454,41-54),(36454,55-60),(36455,35-53),(36455,54-62),(36457,33-44),(36457,45-49),(36457,50-56),(36457,62-83),(36457,84-88),(36458,35-53),(36458,54-62),(36460,33-37),(36460,38-42),(36460,47-57),(36460,58-67),(36461,35-53),(36461,54-62),(36463,34-38),(36463,39-45),(36463,46-51),(36463,54-63),(36463,64-71),(36463,76-80),(36463,81-87),(36463,88-92),(36463,97-107),(36463,108-119),(36464,35-53),(36464,54-62)]
		store.setPartial(
			new Range(36436, 1, 36464, 142),
			[createTokens('[(36437,33-37),(36437,38-42),(36437,47-57),(36437,58-67),(36438,35-53),(36438,54-62),(36440,24-29),(36440,33-46),(36440,47-53),(36442,25-35),(36442,36-50),(36443,30-39),(36443,42-46),(36443,47-53),(36443,54-58),(36443,63-73),(36443,74-84),(36443,87-91),(36443,92-98),(36443,101-105),(36443,106-112),(36443,113-119),(36444,28-37),(36444,38-42),(36444,47-57),(36444,58-75),(36444,80-95),(36444,96-105),(36445,35-53),(36445,54-62),(36448,24-29),(36448,33-46),(36448,47-54),(36450,25-35),(36450,36-50),(36451,28-33),(36451,36-49),(36451,50-57),(36452,35-53),(36452,54-62),(36454,33-38),(36454,41-54),(36454,55-60),(36455,35-53),(36455,54-62),(36457,33-44),(36457,45-49),(36457,50-56),(36457,62-83),(36457,84-88),(36458,35-53),(36458,54-62),(36460,33-37),(36460,38-42),(36460,47-57),(36460,58-67),(36461,35-53),(36461,54-62),(36463,34-38),(36463,39-45),(36463,46-51),(36463,54-63),(36463,64-71),(36463,76-80),(36463,81-87),(36463,88-92),(36463,97-107),(36463,108-119),(36464,35-53),(36464,54-62)]')]
		);
		// setPartial [36457,1 -> 36485,140] [(36457,33-44),(36457,45-49),(36457,50-56),(36457,62-83),(36457,84-88),(36458,35-53),(36458,54-62),(36460,33-37),(36460,38-42),(36460,47-57),(36460,58-67),(36461,35-53),(36461,54-62),(36463,34-38),(36463,39-45),(36463,46-51),(36463,54-63),(36463,64-71),(36463,76-80),(36463,81-87),(36463,88-92),(36463,97-107),(36463,108-119),(36464,35-53),(36464,54-62),(36466,33-71),(36466,72-76),(36467,35-53),(36467,54-62),(36469,24-29),(36469,33-46),(36469,47-54),(36470,24-35),(36470,38-46),(36473,25-35),(36473,36-51),(36474,28-33),(36474,36-49),(36474,50-58),(36475,35-53),(36475,54-62),(36477,28-32),(36477,33-37),(36477,42-52),(36477,53-69),(36478,32-36),(36478,37-41),(36478,46-56),(36478,57-74),(36479,32-36),(36479,37-41),(36479,46-56),(36479,57-76),(36480,32-36),(36480,37-41),(36480,46-56),(36480,57-68),(36481,32-36),(36481,37-41),(36481,46-56),(36481,57-68),(36482,39-57),(36482,58-66),(36484,34-38),(36484,39-45),(36484,46-50),(36484,55-65),(36484,66-82),(36484,86-97),(36484,98-102),(36484,103-109),(36484,111-124),(36484,125-133),(36485,39-57),(36485,58-66)]
		store.setPartial(
			new Range(36457, 1, 36485, 140),
			[createTokens('[(36457,33-44),(36457,45-49),(36457,50-56),(36457,62-83),(36457,84-88),(36458,35-53),(36458,54-62),(36460,33-37),(36460,38-42),(36460,47-57),(36460,58-67),(36461,35-53),(36461,54-62),(36463,34-38),(36463,39-45),(36463,46-51),(36463,54-63),(36463,64-71),(36463,76-80),(36463,81-87),(36463,88-92),(36463,97-107),(36463,108-119),(36464,35-53),(36464,54-62),(36466,33-71),(36466,72-76),(36467,35-53),(36467,54-62),(36469,24-29),(36469,33-46),(36469,47-54),(36470,24-35),(36470,38-46),(36473,25-35),(36473,36-51),(36474,28-33),(36474,36-49),(36474,50-58),(36475,35-53),(36475,54-62),(36477,28-32),(36477,33-37),(36477,42-52),(36477,53-69),(36478,32-36),(36478,37-41),(36478,46-56),(36478,57-74),(36479,32-36),(36479,37-41),(36479,46-56),(36479,57-76),(36480,32-36),(36480,37-41),(36480,46-56),(36480,57-68),(36481,32-36),(36481,37-41),(36481,46-56),(36481,57-68),(36482,39-57),(36482,58-66),(36484,34-38),(36484,39-45),(36484,46-50),(36484,55-65),(36484,66-82),(36484,86-97),(36484,98-102),(36484,103-109),(36484,111-124),(36484,125-133),(36485,39-57),(36485,58-66)]')]
		);
		// setPartial [36441,1 -> 36469,56] [(36442,25-35),(36442,36-50),(36443,30-39),(36443,42-46),(36443,47-53),(36443,54-58),(36443,63-73),(36443,74-84),(36443,87-91),(36443,92-98),(36443,101-105),(36443,106-112),(36443,113-119),(36444,28-37),(36444,38-42),(36444,47-57),(36444,58-75),(36444,80-95),(36444,96-105),(36445,35-53),(36445,54-62),(36448,24-29),(36448,33-46),(36448,47-54),(36450,25-35),(36450,36-50),(36451,28-33),(36451,36-49),(36451,50-57),(36452,35-53),(36452,54-62),(36454,33-38),(36454,41-54),(36454,55-60),(36455,35-53),(36455,54-62),(36457,33-44),(36457,45-49),(36457,50-56),(36457,62-83),(36457,84-88),(36458,35-53),(36458,54-62),(36460,33-37),(36460,38-42),(36460,47-57),(36460,58-67),(36461,35-53),(36461,54-62),(36463,34-38),(36463,39-45),(36463,46-51),(36463,54-63),(36463,64-71),(36463,76-80),(36463,81-87),(36463,88-92),(36463,97-107),(36463,108-119),(36464,35-53),(36464,54-62),(36466,33-71),(36466,72-76),(36467,35-53),(36467,54-62),(36469,24-29),(36469,33-46),(36469,47-54),(36470,24-35)]
		store.setPartial(
			new Range(36441, 1, 36469, 56),
			[createTokens('[(36442,25-35),(36442,36-50),(36443,30-39),(36443,42-46),(36443,47-53),(36443,54-58),(36443,63-73),(36443,74-84),(36443,87-91),(36443,92-98),(36443,101-105),(36443,106-112),(36443,113-119),(36444,28-37),(36444,38-42),(36444,47-57),(36444,58-75),(36444,80-95),(36444,96-105),(36445,35-53),(36445,54-62),(36448,24-29),(36448,33-46),(36448,47-54),(36450,25-35),(36450,36-50),(36451,28-33),(36451,36-49),(36451,50-57),(36452,35-53),(36452,54-62),(36454,33-38),(36454,41-54),(36454,55-60),(36455,35-53),(36455,54-62),(36457,33-44),(36457,45-49),(36457,50-56),(36457,62-83),(36457,84-88),(36458,35-53),(36458,54-62),(36460,33-37),(36460,38-42),(36460,47-57),(36460,58-67),(36461,35-53),(36461,54-62),(36463,34-38),(36463,39-45),(36463,46-51),(36463,54-63),(36463,64-71),(36463,76-80),(36463,81-87),(36463,88-92),(36463,97-107),(36463,108-119),(36464,35-53),(36464,54-62),(36466,33-71),(36466,72-76),(36467,35-53),(36467,54-62),(36469,24-29),(36469,33-46),(36469,47-54),(36470,24-35)]')]
		);

		const lineTokens = store.addSparseTokens(36451, new LineTokens(new Uint32Array([60, 1]), `                        if (flags & ModifierFlags.Ambient) {`, codec));
		assert.strictEqual(lineTokens.getCount(), 7);
	});


	test('issue #95949: Identifiers are colored in bold when targetting keywords', () => {

		function createTMMetadata(foreground: number, fontStyle: number, languageId: number): number {
			return (
				(languageId << MetadataConsts.LANGUAGEID_OFFSET)
				| (fontStyle << MetadataConsts.FONT_STYLE_OFFSET)
				| (foreground << MetadataConsts.FOREGROUND_OFFSET)
			) >>> 0;
		}

		function toArr(lineTokens: LineTokens): number[] {
			const r: number[] = [];
			for (let i = 0; i < lineTokens.getCount(); i++) {
				r.push(lineTokens.getEndOffset(i));
				r.push(lineTokens.getMetadata(i));
			}
			return r;
		}

		const codec = new LanguageIdCodec();
		const store = new SparseTokensStore(codec);

		store.set([
			SparseMultilineTokens.create(1, new Uint32Array([
				0, 6, 11, (1 << MetadataConsts.FOREGROUND_OFFSET) | MetadataConsts.SEMANTIC_USE_FOREGROUND,
			]))
		], true);

		const lineTokens = store.addSparseTokens(1, new LineTokens(new Uint32Array([
			5, createTMMetadata(5, FontStyle.Bold, 53),
			14, createTMMetadata(1, FontStyle.None, 53),
			17, createTMMetadata(6, FontStyle.None, 53),
			18, createTMMetadata(1, FontStyle.None, 53),
		]), `const hello = 123;`, codec));

		const actual = toArr(lineTokens);
		assert.deepStrictEqual(actual, [
			5, createTMMetadata(5, FontStyle.Bold, 53),
			6, createTMMetadata(1, FontStyle.None, 53),
			11, createTMMetadata(1, FontStyle.None, 53),
			14, createTMMetadata(1, FontStyle.None, 53),
			17, createTMMetadata(6, FontStyle.None, 53),
			18, createTMMetadata(1, FontStyle.None, 53)
		]);
	});


	test('BUG: setPartial with startLineNumber > 1 and token removal creates invalid state', () => {
		/**
		 * The bug is the same regardless of the starting line number.
		 * If a piece starts at line 5 and all tokens are removed via setPartial:
		 * - startLineNumber stays at 5
		 * - endLineNumber becomes 5 + (-1) = 4
		 */
		const codec = new LanguageIdCodec();
		const store = new SparseTokensStore(codec);

		// Set initial tokens on line 5
		store.set([
			SparseMultilineTokens.create(5, new Uint32Array([
				0, 5, 10, 1,  // line 5, chars 5-10
			]))
		], false);

		assert.strictEqual(store.isEmpty(), false);

		// Remove all tokens via setPartial
		store.setPartial(new Range(5, 1, 5, 20), []);

		// BUG: During processing, pieces can have invalid line numbers
		// The store should remove empty pieces and remain valid
		assert.strictEqual(store.isEmpty(), true,
			'Store should be empty after setPartial removes all tokens');
	});

	test('BUG: setPartial with split that creates empty first piece with invalid line numbers', () => {
		const codec = new LanguageIdCodec();
		const store = new SparseTokensStore(codec);

		// Set initial tokens - token is on line 11
		store.set([
			SparseMultilineTokens.create(1, new Uint32Array([
				10, 5, 10, 1,  // line 11 (deltaLine=10 from startLineNumber=1), chars 5-10
			]))
		], false);

		// setPartial with a range [1,1 -> 5,1] that will cause a split where the first piece is empty
		store.setPartial(new Range(1, 1, 5, 1), []);

		assert.strictEqual(store.isEmpty(), false, 'Store should still have the token on line 11');

		// The token at line 11 should be retrievable after the split
		const lineTokens = store.addSparseTokens(11, new LineTokens(new Uint32Array([22, 1]), `    test line text    `, codec));
		assert.strictEqual(lineTokens.getCount(), 3, 'Should have 3 tokens: base token start + semantic token from line 11 + base token end');
		assert.strictEqual(lineTokens.getStartOffset(1), 5, 'Semantic token should start at offset 5');
		assert.strictEqual(lineTokens.getEndOffset(1), 10, 'Semantic token should end at offset 10');
	});

	test('piece with startLineNumber 0 and endLineNumber -1 after encompassing deletion', () => {
		const codec = new LanguageIdCodec();
		const store = new SparseTokensStore(codec);

		// Set initial tokens on lines 5-10
		const piece = SparseMultilineTokens.create(5, new Uint32Array([
			0, 0, 5, 1,  // line 5, chars 0-5
			5, 0, 5, 2,  // line 10, chars 0-5
		]));

		store.set([piece], false);

		// Verify initial state
		assert.strictEqual(piece.startLineNumber, 5);
		assert.strictEqual(piece.endLineNumber, 10);
		assert.strictEqual(piece.isEmpty(), false);

		// Perform an edit that completely encompasses the token range
		// Delete from line 1 to line 20 (encompasses lines 5-10)
		// This triggers the case in _acceptDeleteRange where:
		// if (firstLineIndex < 0 && lastLineIndex >= tokenMaxDeltaLine + 1)
		// Which sets this._startLineNumber = 0 and calls this._tokens.clear()
		store.acceptEdit(
			{ startLineNumber: 1, startColumn: 1, endLineNumber: 20, endColumn: 1 },
			0, // eolCount - no new lines inserted
			0, // firstLineLength
			0, // lastLineLength
			0  // firstCharCode
		);

		// After an encompassing deletion, the piece should be empty
		assert.strictEqual(piece.isEmpty(), true, 'Piece should be empty after encompassing deletion');

		// EXPECTED BEHAVIOR: The store should be empty (no pieces with invalid line numbers)
		// Currently fails because the piece remains with startLineNumber=0, endLineNumber=-1
		assert.strictEqual(store.isEmpty(), true, 'Store should be empty after all tokens are deleted by encompassing edit');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/tokenStore.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/tokenStore.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { TextModel } from '../../../common/model/textModel.js';
import { LeafNode, ListNode, TokenQuality, TokenStore } from '../../../common/model/tokens/treeSitter/tokenStore.js';

suite('TokenStore', () => {
	let textModel: TextModel;
	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		textModel = {
			getValueLength: () => 11
		} as TextModel;
	});

	test('constructs with empty model', () => {
		const store = new TokenStore(textModel);
		assert.ok(store.root);
		assert.strictEqual(store.root.length, textModel.getValueLength());
	});

	test('builds store with single token', () => {
		const store = new TokenStore(textModel);
		store.buildStore([{
			startOffsetInclusive: 0,
			length: 5,
			token: 1
		}], TokenQuality.Accurate);
		assert.strictEqual(store.root.length, 5);
	});

	test('builds store with multiple tokens', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 3, token: 1 },
			{ startOffsetInclusive: 3, length: 3, token: 2 },
			{ startOffsetInclusive: 6, length: 4, token: 3 }
		], TokenQuality.Accurate);
		assert.ok(store.root);
		assert.strictEqual(store.root.length, 10);
	});

	test('creates balanced tree structure', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 2, token: 1 },
			{ startOffsetInclusive: 2, length: 2, token: 2 },
			{ startOffsetInclusive: 4, length: 2, token: 3 },
			{ startOffsetInclusive: 6, length: 2, token: 4 }
		], TokenQuality.Accurate);

		const root = store.root as ListNode;
		assert.ok(root.children);
		assert.strictEqual(root.children.length, 2);
		assert.strictEqual(root.children[0].length, 4);
		assert.strictEqual(root.children[1].length, 4);
	});

	test('creates deep tree structure', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 1, token: 1 },
			{ startOffsetInclusive: 1, length: 1, token: 2 },
			{ startOffsetInclusive: 2, length: 1, token: 3 },
			{ startOffsetInclusive: 3, length: 1, token: 4 },
			{ startOffsetInclusive: 4, length: 1, token: 5 },
			{ startOffsetInclusive: 5, length: 1, token: 6 },
			{ startOffsetInclusive: 6, length: 1, token: 7 },
			{ startOffsetInclusive: 7, length: 1, token: 8 }
		], TokenQuality.Accurate);

		const root = store.root as ListNode;
		assert.ok(root.children);
		assert.strictEqual(root.children.length, 2);
		assert.ok((root.children[0] as ListNode).children);
		assert.strictEqual((root.children[0] as ListNode).children.length, 2);
		assert.ok(((root.children[0] as ListNode).children[0] as ListNode).children);
		assert.strictEqual(((root.children[0] as ListNode).children[0] as ListNode).children.length, 2);
	});

	test('updates single token in middle', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 3, token: 1 },
			{ startOffsetInclusive: 3, length: 3, token: 2 },
			{ startOffsetInclusive: 6, length: 3, token: 3 }
		], TokenQuality.Accurate);

		store.update(3, [
			{ startOffsetInclusive: 3, length: 3, token: 4 }
		], TokenQuality.Accurate);

		const tokens = store.root as ListNode;
		assert.strictEqual((tokens.children[0] as LeafNode).token, 1);
		assert.strictEqual((tokens.children[1] as LeafNode).token, 4);
		assert.strictEqual((tokens.children[2] as LeafNode).token, 3);
	});

	test('updates multiple consecutive tokens', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 3, token: 1 },
			{ startOffsetInclusive: 3, length: 3, token: 2 },
			{ startOffsetInclusive: 6, length: 3, token: 3 }
		], TokenQuality.Accurate);

		store.update(6, [
			{ startOffsetInclusive: 3, length: 3, token: 4 },
			{ startOffsetInclusive: 6, length: 3, token: 5 }
		], TokenQuality.Accurate);

		const tokens = store.root as ListNode;
		assert.strictEqual((tokens.children[0] as LeafNode).token, 1);
		assert.strictEqual((tokens.children[1] as LeafNode).token, 4);
		assert.strictEqual((tokens.children[2] as LeafNode).token, 5);
	});

	test('updates tokens at start of document', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 3, token: 1 },
			{ startOffsetInclusive: 3, length: 3, token: 2 },
			{ startOffsetInclusive: 6, length: 3, token: 3 }
		], TokenQuality.Accurate);

		store.update(3, [
			{ startOffsetInclusive: 0, length: 3, token: 4 }
		], TokenQuality.Accurate);

		const tokens = store.root as ListNode;
		assert.strictEqual((tokens.children[0] as LeafNode).token, 4);
		assert.strictEqual((tokens.children[1] as LeafNode).token, 2);
		assert.strictEqual((tokens.children[2] as LeafNode).token, 3);
	});

	test('updates tokens at end of document', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 3, token: 1 },
			{ startOffsetInclusive: 3, length: 3, token: 2 },
			{ startOffsetInclusive: 6, length: 3, token: 3 }
		], TokenQuality.Accurate);

		store.update(3, [
			{ startOffsetInclusive: 6, length: 3, token: 4 }
		], TokenQuality.Accurate);

		const tokens = store.root as ListNode;
		assert.strictEqual((tokens.children[0] as LeafNode).token, 1);
		assert.strictEqual((tokens.children[1] as LeafNode).token, 2);
		assert.strictEqual((tokens.children[2] as LeafNode).token, 4);
	});

	test('updates length of tokens', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 3, token: 1 },
			{ startOffsetInclusive: 3, length: 3, token: 2 },
			{ startOffsetInclusive: 6, length: 3, token: 3 }
		], TokenQuality.Accurate);

		store.update(6, [
			{ startOffsetInclusive: 3, length: 5, token: 4 }
		], TokenQuality.Accurate);

		const tokens = store.root as ListNode;
		assert.strictEqual((tokens.children[0] as LeafNode).token, 1);
		assert.strictEqual(tokens.children[0].length, 3);
		assert.strictEqual((tokens.children[1] as LeafNode).token, 4);
		assert.strictEqual(tokens.children[1].length, 5);
	});

	test('update deeply nested tree with new token length in the middle', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 1, token: 1 },
			{ startOffsetInclusive: 1, length: 1, token: 2 },
			{ startOffsetInclusive: 2, length: 1, token: 3 },
			{ startOffsetInclusive: 3, length: 1, token: 4 },
			{ startOffsetInclusive: 4, length: 1, token: 5 },
			{ startOffsetInclusive: 5, length: 1, token: 6 },
			{ startOffsetInclusive: 6, length: 1, token: 7 },
			{ startOffsetInclusive: 7, length: 1, token: 8 }
		], TokenQuality.Accurate);

		// Update token in the middle (position 3-4) to span 3-6
		store.update(3, [
			{ startOffsetInclusive: 3, length: 3, token: 9 }
		], TokenQuality.Accurate);

		const root = store.root as ListNode;
		// Verify the structure remains balanced
		assert.strictEqual(root.children.length, 3);
		assert.strictEqual((root.children[0] as ListNode).children.length, 2);

		// Verify the lengths are updated correctly
		assert.strictEqual(root.children[0].length, 2); // First 2 tokens
		assert.strictEqual(root.children[1].length, 4); // Token 3 + our new longer token
		assert.strictEqual(root.children[2].length, 2); // Last 2 tokens
	});

	test('update deeply nested tree with a range of tokens that causes tokens to split', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 3, token: 1 },
			{ startOffsetInclusive: 3, length: 3, token: 2 },
			{ startOffsetInclusive: 6, length: 4, token: 3 },
			{ startOffsetInclusive: 10, length: 5, token: 4 },
			{ startOffsetInclusive: 15, length: 4, token: 5 },
			{ startOffsetInclusive: 19, length: 3, token: 6 },
			{ startOffsetInclusive: 22, length: 5, token: 7 },
			{ startOffsetInclusive: 27, length: 3, token: 8 }
		], TokenQuality.Accurate);

		// Update token in the middle which causes tokens to split
		store.update(8, [
			{ startOffsetInclusive: 12, length: 4, token: 9 },
			{ startOffsetInclusive: 16, length: 4, token: 10 }
		], TokenQuality.Accurate);

		const root = store.root as ListNode;
		// Verify the structure remains balanced
		assert.strictEqual(root.children.length, 2);
		assert.strictEqual((root.children[0] as ListNode).children.length, 2);

		// Verify the lengths are updated correctly
		assert.strictEqual(root.children[0].length, 12);
		assert.strictEqual(root.children[1].length, 18);
	});

	test('getTokensInRange returns tokens in middle of document', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 3, token: 1 },
			{ startOffsetInclusive: 3, length: 3, token: 2 },
			{ startOffsetInclusive: 6, length: 3, token: 3 }
		], TokenQuality.Accurate);

		const tokens = store.getTokensInRange(3, 6);
		assert.deepStrictEqual(tokens, [{ startOffsetInclusive: 3, length: 3, token: 2 }]);
	});

	test('getTokensInRange returns tokens at start of document', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 3, token: 1 },
			{ startOffsetInclusive: 3, length: 3, token: 2 },
			{ startOffsetInclusive: 6, length: 3, token: 3 }
		], TokenQuality.Accurate);

		const tokens = store.getTokensInRange(0, 3);
		assert.deepStrictEqual(tokens, [{ startOffsetInclusive: 0, length: 3, token: 1 }]);
	});

	test('getTokensInRange returns tokens at end of document', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 3, token: 1 },
			{ startOffsetInclusive: 3, length: 3, token: 2 },
			{ startOffsetInclusive: 6, length: 3, token: 3 }
		], TokenQuality.Accurate);

		const tokens = store.getTokensInRange(6, 9);
		assert.deepStrictEqual(tokens, [{ startOffsetInclusive: 6, length: 3, token: 3 }]);
	});

	test('getTokensInRange returns multiple tokens across nodes', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 1, token: 1 },
			{ startOffsetInclusive: 1, length: 1, token: 2 },
			{ startOffsetInclusive: 2, length: 1, token: 3 },
			{ startOffsetInclusive: 3, length: 1, token: 4 },
			{ startOffsetInclusive: 4, length: 1, token: 5 },
			{ startOffsetInclusive: 5, length: 1, token: 6 }
		], TokenQuality.Accurate);

		const tokens = store.getTokensInRange(2, 5);
		assert.deepStrictEqual(tokens, [
			{ startOffsetInclusive: 2, length: 1, token: 3 },
			{ startOffsetInclusive: 3, length: 1, token: 4 },
			{ startOffsetInclusive: 4, length: 1, token: 5 }
		]);
	});

	test('Realistic scenario one', () => {
		// inspired by this snippet, with the update adding a space in the constructor's curly braces:
		// /*
		// */
		// class XY {
		// 	constructor() {}
		// }

		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 3, token: 164164 },
			{ startOffsetInclusive: 3, length: 1, token: 32836 },
			{ startOffsetInclusive: 4, length: 3, token: 164164 },
			{ startOffsetInclusive: 7, length: 2, token: 32836 },
			{ startOffsetInclusive: 9, length: 5, token: 196676 },
			{ startOffsetInclusive: 14, length: 1, token: 32836 },
			{ startOffsetInclusive: 15, length: 2, token: 557124 },
			{ startOffsetInclusive: 17, length: 4, token: 32836 },
			{ startOffsetInclusive: 21, length: 1, token: 32836 },
			{ startOffsetInclusive: 22, length: 11, token: 196676 },
			{ startOffsetInclusive: 33, length: 7, token: 32836 },
			{ startOffsetInclusive: 40, length: 3, token: 32836 }
		], TokenQuality.Accurate);

		store.update(33, [
			{ startOffsetInclusive: 9, length: 5, token: 196676 },
			{ startOffsetInclusive: 14, length: 1, token: 32836 },
			{ startOffsetInclusive: 15, length: 2, token: 557124 },
			{ startOffsetInclusive: 17, length: 4, token: 32836 },
			{ startOffsetInclusive: 21, length: 1, token: 32836 },
			{ startOffsetInclusive: 22, length: 11, token: 196676 },
			{ startOffsetInclusive: 33, length: 8, token: 32836 },
			{ startOffsetInclusive: 41, length: 3, token: 32836 }
		], TokenQuality.Accurate);

	});
	test('Realistic scenario two', () => {
		// inspired by this snippet, with the update deleteing the space in the body of class x
		// class x {
		//
		// }
		// class y {

		// }

		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 5, token: 196676 },
			{ startOffsetInclusive: 5, length: 1, token: 32836 },
			{ startOffsetInclusive: 6, length: 1, token: 557124 },
			{ startOffsetInclusive: 7, length: 4, token: 32836 },
			{ startOffsetInclusive: 11, length: 3, token: 32836 },
			{ startOffsetInclusive: 14, length: 3, token: 32836 },
			{ startOffsetInclusive: 17, length: 5, token: 196676 },
			{ startOffsetInclusive: 22, length: 1, token: 32836 },
			{ startOffsetInclusive: 23, length: 1, token: 557124 },
			{ startOffsetInclusive: 24, length: 4, token: 32836 },
			{ startOffsetInclusive: 28, length: 2, token: 32836 },
			{ startOffsetInclusive: 30, length: 1, token: 32836 }
		], TokenQuality.Accurate);
		const tokens0 = store.getTokensInRange(0, 16);
		assert.deepStrictEqual(tokens0, [
			{ token: 196676, startOffsetInclusive: 0, length: 5 },
			{ token: 32836, startOffsetInclusive: 5, length: 1 },
			{ token: 557124, startOffsetInclusive: 6, length: 1 },
			{ token: 32836, startOffsetInclusive: 7, length: 4 },
			{ token: 32836, startOffsetInclusive: 11, length: 3 },
			{ token: 32836, startOffsetInclusive: 14, length: 2 }
		]);

		store.update(14, [
			{ startOffsetInclusive: 0, length: 5, token: 196676 },
			{ startOffsetInclusive: 5, length: 1, token: 32836 },
			{ startOffsetInclusive: 6, length: 1, token: 557124 },
			{ startOffsetInclusive: 7, length: 4, token: 32836 },
			{ startOffsetInclusive: 11, length: 2, token: 32836 },
			{ startOffsetInclusive: 13, length: 3, token: 32836 }
		], TokenQuality.Accurate);

		const tokens = store.getTokensInRange(0, 16);
		assert.deepStrictEqual(tokens, [
			{ token: 196676, startOffsetInclusive: 0, length: 5 },
			{ token: 32836, startOffsetInclusive: 5, length: 1 },
			{ token: 557124, startOffsetInclusive: 6, length: 1 },
			{ token: 32836, startOffsetInclusive: 7, length: 4 },
			{ token: 32836, startOffsetInclusive: 11, length: 2 },
			{ token: 32836, startOffsetInclusive: 13, length: 3 }
		]);
	});
	test('Realistic scenario three', () => {
		// inspired by this snippet, with the update adding a space after the { in the constructor
		// /*--
		//  --*/
		//  class TreeViewPane {
		// 	constructor(
		// 		options: IViewletViewOptions,
		// 	) {
		// 	}
		// }


		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 5, token: 164164 },
			{ startOffsetInclusive: 5, length: 1, token: 32836 },
			{ startOffsetInclusive: 6, length: 5, token: 164164 },
			{ startOffsetInclusive: 11, length: 2, token: 32836 },
			{ startOffsetInclusive: 13, length: 5, token: 196676 },
			{ startOffsetInclusive: 18, length: 1, token: 32836 },
			{ startOffsetInclusive: 19, length: 12, token: 557124 },
			{ startOffsetInclusive: 31, length: 4, token: 32836 },
			{ startOffsetInclusive: 35, length: 1, token: 32836 },
			{ startOffsetInclusive: 36, length: 11, token: 196676 },
			{ startOffsetInclusive: 47, length: 3, token: 32836 },
			{ startOffsetInclusive: 50, length: 2, token: 32836 },
			{ startOffsetInclusive: 52, length: 7, token: 327748 },
			{ startOffsetInclusive: 59, length: 1, token: 98372 },
			{ startOffsetInclusive: 60, length: 1, token: 32836 },
			{ startOffsetInclusive: 61, length: 19, token: 557124 },
			{ startOffsetInclusive: 80, length: 1, token: 32836 },
			{ startOffsetInclusive: 81, length: 2, token: 32836 },
			{ startOffsetInclusive: 83, length: 6, token: 32836 },
			{ startOffsetInclusive: 89, length: 4, token: 32836 },
			{ startOffsetInclusive: 93, length: 3, token: 32836 }
		], TokenQuality.Accurate);
		const tokens0 = store.getTokensInRange(36, 59);
		assert.deepStrictEqual(tokens0, [
			{ token: 196676, startOffsetInclusive: 36, length: 11 },
			{ token: 32836, startOffsetInclusive: 47, length: 3 },
			{ token: 32836, startOffsetInclusive: 50, length: 2 },
			{ token: 327748, startOffsetInclusive: 52, length: 7 }
		]);

		store.update(82, [
			{ startOffsetInclusive: 13, length: 5, token: 196676 },
			{ startOffsetInclusive: 18, length: 1, token: 32836 },
			{ startOffsetInclusive: 19, length: 12, token: 557124 },
			{ startOffsetInclusive: 31, length: 4, token: 32836 },
			{ startOffsetInclusive: 35, length: 1, token: 32836 },
			{ startOffsetInclusive: 36, length: 11, token: 196676 },
			{ startOffsetInclusive: 47, length: 3, token: 32836 },
			{ startOffsetInclusive: 50, length: 2, token: 32836 },
			{ startOffsetInclusive: 52, length: 7, token: 327748 },
			{ startOffsetInclusive: 59, length: 1, token: 98372 },
			{ startOffsetInclusive: 60, length: 1, token: 32836 },
			{ startOffsetInclusive: 61, length: 19, token: 557124 },
			{ startOffsetInclusive: 80, length: 1, token: 32836 },
			{ startOffsetInclusive: 81, length: 2, token: 32836 },
			{ startOffsetInclusive: 83, length: 7, token: 32836 },
			{ startOffsetInclusive: 90, length: 4, token: 32836 },
			{ startOffsetInclusive: 94, length: 3, token: 32836 }
		], TokenQuality.Accurate);

		const tokens = store.getTokensInRange(36, 59);
		assert.deepStrictEqual(tokens, [
			{ token: 196676, startOffsetInclusive: 36, length: 11 },
			{ token: 32836, startOffsetInclusive: 47, length: 3 },
			{ token: 32836, startOffsetInclusive: 50, length: 2 },
			{ token: 327748, startOffsetInclusive: 52, length: 7 }
		]);
	});
	test('Realistic scenario four', () => {
		// inspired by this snippet, with the update adding a new line after the return true;
		// function x() {
		// 	return true;
		// }

		// class Y {
		// 	private z = false;
		// }

		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 8, token: 196676 },
			{ startOffsetInclusive: 8, length: 1, token: 32836 },
			{ startOffsetInclusive: 9, length: 1, token: 524356 },
			{ startOffsetInclusive: 10, length: 6, token: 32836 },
			{ startOffsetInclusive: 16, length: 1, token: 32836 },
			{ startOffsetInclusive: 17, length: 6, token: 589892 },
			{ startOffsetInclusive: 23, length: 1, token: 32836 },
			{ startOffsetInclusive: 24, length: 4, token: 196676 },
			{ startOffsetInclusive: 28, length: 1, token: 32836 },
			{ startOffsetInclusive: 29, length: 2, token: 32836 },
			{ startOffsetInclusive: 31, length: 3, token: 32836 }, // This is the closing curly brace + newline chars
			{ startOffsetInclusive: 34, length: 2, token: 32836 },
			{ startOffsetInclusive: 36, length: 5, token: 196676 },
			{ startOffsetInclusive: 41, length: 1, token: 32836 },
			{ startOffsetInclusive: 42, length: 1, token: 557124 },
			{ startOffsetInclusive: 43, length: 4, token: 32836 },
			{ startOffsetInclusive: 47, length: 1, token: 32836 },
			{ startOffsetInclusive: 48, length: 7, token: 196676 },
			{ startOffsetInclusive: 55, length: 1, token: 32836 },
			{ startOffsetInclusive: 56, length: 1, token: 327748 },
			{ startOffsetInclusive: 57, length: 1, token: 32836 },
			{ startOffsetInclusive: 58, length: 1, token: 98372 },
			{ startOffsetInclusive: 59, length: 1, token: 32836 },
			{ startOffsetInclusive: 60, length: 5, token: 196676 },
			{ startOffsetInclusive: 65, length: 1, token: 32836 },
			{ startOffsetInclusive: 66, length: 2, token: 32836 },
			{ startOffsetInclusive: 68, length: 1, token: 32836 }
		], TokenQuality.Accurate);
		const tokens0 = store.getTokensInRange(36, 59);
		assert.deepStrictEqual(tokens0, [
			{ startOffsetInclusive: 36, length: 5, token: 196676 },
			{ startOffsetInclusive: 41, length: 1, token: 32836 },
			{ startOffsetInclusive: 42, length: 1, token: 557124 },
			{ startOffsetInclusive: 43, length: 4, token: 32836 },
			{ startOffsetInclusive: 47, length: 1, token: 32836 },
			{ startOffsetInclusive: 48, length: 7, token: 196676 },
			{ startOffsetInclusive: 55, length: 1, token: 32836 },
			{ startOffsetInclusive: 56, length: 1, token: 327748 },
			{ startOffsetInclusive: 57, length: 1, token: 32836 },
			{ startOffsetInclusive: 58, length: 1, token: 98372 }
		]);

		// insert a tab + new line after `return true;` (like hitting enter after the ;)
		store.update(32, [
			{ startOffsetInclusive: 0, length: 8, token: 196676 },
			{ startOffsetInclusive: 8, length: 1, token: 32836 },
			{ startOffsetInclusive: 9, length: 1, token: 524356 },
			{ startOffsetInclusive: 10, length: 6, token: 32836 },
			{ startOffsetInclusive: 16, length: 1, token: 32836 },
			{ startOffsetInclusive: 17, length: 6, token: 589892 },
			{ startOffsetInclusive: 23, length: 1, token: 32836 },
			{ startOffsetInclusive: 24, length: 4, token: 196676 },
			{ startOffsetInclusive: 28, length: 1, token: 32836 },
			{ startOffsetInclusive: 29, length: 2, token: 32836 },
			{ startOffsetInclusive: 31, length: 3, token: 32836 }, // This is the new line, which consists of 3 characters: \t\r\n
			{ startOffsetInclusive: 34, length: 2, token: 32836 }
		], TokenQuality.Accurate);

		const tokens1 = store.getTokensInRange(36, 59);
		assert.deepStrictEqual(tokens1, [
			{ startOffsetInclusive: 36, length: 2, token: 32836 },
			{ startOffsetInclusive: 38, length: 2, token: 32836 },
			{ startOffsetInclusive: 40, length: 5, token: 196676 },
			{ startOffsetInclusive: 45, length: 1, token: 32836 },
			{ startOffsetInclusive: 46, length: 1, token: 557124 },
			{ startOffsetInclusive: 47, length: 4, token: 32836 },
			{ startOffsetInclusive: 51, length: 1, token: 32836 },
			{ startOffsetInclusive: 52, length: 7, token: 196676 }
		]);

		// Delete the tab character
		store.update(37, [
			{ startOffsetInclusive: 0, length: 8, token: 196676 },
			{ startOffsetInclusive: 8, length: 1, token: 32836 },
			{ startOffsetInclusive: 9, length: 1, token: 524356 },
			{ startOffsetInclusive: 10, length: 6, token: 32836 },
			{ startOffsetInclusive: 16, length: 1, token: 32836 },
			{ startOffsetInclusive: 17, length: 6, token: 589892 },
			{ startOffsetInclusive: 23, length: 1, token: 32836 },
			{ startOffsetInclusive: 24, length: 4, token: 196676 },
			{ startOffsetInclusive: 28, length: 1, token: 32836 },
			{ startOffsetInclusive: 29, length: 2, token: 32836 },
			{ startOffsetInclusive: 31, length: 2, token: 32836 }, // This is the changed line: \t\r\n to \r\n
			{ startOffsetInclusive: 33, length: 3, token: 32836 }
		], TokenQuality.Accurate);

		const tokens2 = store.getTokensInRange(36, 59);
		assert.deepStrictEqual(tokens2, [
			{ startOffsetInclusive: 36, length: 1, token: 32836 },
			{ startOffsetInclusive: 37, length: 2, token: 32836 },
			{ startOffsetInclusive: 39, length: 5, token: 196676 },
			{ startOffsetInclusive: 44, length: 1, token: 32836 },
			{ startOffsetInclusive: 45, length: 1, token: 557124 },
			{ startOffsetInclusive: 46, length: 4, token: 32836 },
			{ startOffsetInclusive: 50, length: 1, token: 32836 },
			{ startOffsetInclusive: 51, length: 7, token: 196676 },
			{ startOffsetInclusive: 58, length: 1, token: 32836 }
		]);

	});

	test('Insert new line and remove tabs (split tokens)', () => {
		// class A {
		// 	a() {
		// 	}
		// }
		//
		// interface I {
		//
		// }

		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 5, token: 196676 },
			{ startOffsetInclusive: 5, length: 1, token: 32836 },
			{ startOffsetInclusive: 6, length: 1, token: 557124 },
			{ startOffsetInclusive: 7, length: 3, token: 32836 },
			{ startOffsetInclusive: 10, length: 1, token: 32836 },
			{ startOffsetInclusive: 11, length: 1, token: 524356 },
			{ startOffsetInclusive: 12, length: 5, token: 32836 },
			{ startOffsetInclusive: 17, length: 3, token: 32836 }, // This is the closing curly brace line of a()
			{ startOffsetInclusive: 20, length: 2, token: 32836 },
			{ startOffsetInclusive: 22, length: 1, token: 32836 },
			{ startOffsetInclusive: 23, length: 9, token: 196676 },
			{ startOffsetInclusive: 32, length: 1, token: 32836 },
			{ startOffsetInclusive: 33, length: 1, token: 557124 },
			{ startOffsetInclusive: 34, length: 3, token: 32836 },
			{ startOffsetInclusive: 37, length: 1, token: 32836 },
			{ startOffsetInclusive: 38, length: 1, token: 32836 }
		], TokenQuality.Accurate);

		const tokens0 = store.getTokensInRange(23, 39);
		assert.deepStrictEqual(tokens0, [
			{ startOffsetInclusive: 23, length: 9, token: 196676 },
			{ startOffsetInclusive: 32, length: 1, token: 32836 },
			{ startOffsetInclusive: 33, length: 1, token: 557124 },
			{ startOffsetInclusive: 34, length: 3, token: 32836 },
			{ startOffsetInclusive: 37, length: 1, token: 32836 },
			{ startOffsetInclusive: 38, length: 1, token: 32836 }
		]);

		// Insert a new line after a() { }, which will add 2 tabs
		store.update(21, [
			{ startOffsetInclusive: 0, length: 5, token: 196676 },
			{ startOffsetInclusive: 5, length: 1, token: 32836 },
			{ startOffsetInclusive: 6, length: 1, token: 557124 },
			{ startOffsetInclusive: 7, length: 3, token: 32836 },
			{ startOffsetInclusive: 10, length: 1, token: 32836 },
			{ startOffsetInclusive: 11, length: 1, token: 524356 },
			{ startOffsetInclusive: 12, length: 5, token: 32836 },
			{ startOffsetInclusive: 17, length: 3, token: 32836 },
			{ startOffsetInclusive: 20, length: 3, token: 32836 },
			{ startOffsetInclusive: 23, length: 1, token: 32836 }
		], TokenQuality.Accurate);

		const tokens1 = store.getTokensInRange(26, 42);
		assert.deepStrictEqual(tokens1, [
			{ startOffsetInclusive: 26, length: 9, token: 196676 },
			{ startOffsetInclusive: 35, length: 1, token: 32836 },
			{ startOffsetInclusive: 36, length: 1, token: 557124 },
			{ startOffsetInclusive: 37, length: 3, token: 32836 },
			{ startOffsetInclusive: 40, length: 1, token: 32836 },
			{ startOffsetInclusive: 41, length: 1, token: 32836 }
		]);

		// Insert another new line at the cursor, which will also cause the 2 tabs to be deleted
		store.update(24, [
			{ startOffsetInclusive: 0, length: 5, token: 196676 },
			{ startOffsetInclusive: 5, length: 1, token: 32836 },
			{ startOffsetInclusive: 6, length: 1, token: 557124 },
			{ startOffsetInclusive: 7, length: 3, token: 32836 },
			{ startOffsetInclusive: 10, length: 1, token: 32836 },
			{ startOffsetInclusive: 11, length: 1, token: 524356 },
			{ startOffsetInclusive: 12, length: 5, token: 32836 },
			{ startOffsetInclusive: 17, length: 3, token: 32836 },
			{ startOffsetInclusive: 20, length: 1, token: 32836 },
			{ startOffsetInclusive: 21, length: 2, token: 32836 },
			{ startOffsetInclusive: 23, length: 1, token: 32836 }
		], TokenQuality.Accurate);

		const tokens2 = store.getTokensInRange(26, 42);
		assert.deepStrictEqual(tokens2, [
			{ startOffsetInclusive: 26, length: 9, token: 196676 },
			{ startOffsetInclusive: 35, length: 1, token: 32836 },
			{ startOffsetInclusive: 36, length: 1, token: 557124 },
			{ startOffsetInclusive: 37, length: 3, token: 32836 },
			{ startOffsetInclusive: 40, length: 1, token: 32836 },
			{ startOffsetInclusive: 41, length: 1, token: 32836 }
		]);
	});

	test('delete removes tokens in the middle', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 3, token: 1 },
			{ startOffsetInclusive: 3, length: 3, token: 2 },
			{ startOffsetInclusive: 6, length: 3, token: 3 }
		], TokenQuality.Accurate);
		store.delete(3, 3); // delete 3 chars starting at offset 3
		const tokens = store.getTokensInRange(0, 9);
		assert.deepStrictEqual(tokens, [
			{ startOffsetInclusive: 0, length: 3, token: 1 },
			{ startOffsetInclusive: 3, length: 3, token: 3 }
		]);
	});

	test('delete merges partially affected token', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 5, token: 1 },
			{ startOffsetInclusive: 5, length: 5, token: 2 }
		], TokenQuality.Accurate);
		store.delete(3, 4); // removes 4 chars within token 1 and partially token 2
		const tokens = store.getTokensInRange(0, 10);
		assert.deepStrictEqual(tokens, [
			{ startOffsetInclusive: 0, length: 4, token: 1 },
			// token 2 is now shifted left by 4
			{ startOffsetInclusive: 4, length: 3, token: 2 }
		]);
	});

	test('replace a token with a slightly larger token', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 5, token: 1 },
			{ startOffsetInclusive: 5, length: 1, token: 2 },
			{ startOffsetInclusive: 6, length: 1, token: 2 },
			{ startOffsetInclusive: 7, length: 17, token: 2 },
			{ startOffsetInclusive: 24, length: 1, token: 2 },
			{ startOffsetInclusive: 25, length: 5, token: 2 },
			{ startOffsetInclusive: 30, length: 1, token: 2 },
			{ startOffsetInclusive: 31, length: 1, token: 2 },
			{ startOffsetInclusive: 32, length: 5, token: 2 }
		], TokenQuality.Accurate);
		store.update(17, [{ startOffsetInclusive: 7, length: 19, token: 0 }], TokenQuality.Accurate); // removes 4 chars within token 1 and partially token 2
		const tokens = store.getTokensInRange(0, 39);
		assert.deepStrictEqual(tokens, [
			{ startOffsetInclusive: 0, length: 5, token: 1 },
			{ startOffsetInclusive: 5, length: 1, token: 2 },
			{ startOffsetInclusive: 6, length: 1, token: 2 },
			{ startOffsetInclusive: 7, length: 19, token: 0 },
			{ startOffsetInclusive: 26, length: 1, token: 2 },
			{ startOffsetInclusive: 27, length: 5, token: 2 },
			{ startOffsetInclusive: 32, length: 1, token: 2 },
			{ startOffsetInclusive: 33, length: 1, token: 2 },
			{ startOffsetInclusive: 34, length: 5, token: 2 }
		]);
	});

	test('replace a character from a large token', () => {
		const store = new TokenStore(textModel);
		store.buildStore([
			{ startOffsetInclusive: 0, length: 2, token: 1 },
			{ startOffsetInclusive: 2, length: 5, token: 2 },
			{ startOffsetInclusive: 7, length: 1, token: 3 }
		], TokenQuality.Accurate);
		store.delete(1, 3);
		const tokens = store.getTokensInRange(0, 7);
		assert.deepStrictEqual(tokens, [
			{ startOffsetInclusive: 0, length: 2, token: 1 },
			{ startOffsetInclusive: 2, length: 1, token: 2 },
			{ startOffsetInclusive: 3, length: 3, token: 2 },
			{ startOffsetInclusive: 6, length: 1, token: 3 }
		]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/bracketPairColorizer/beforeEditPositionMapper.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/bracketPairColorizer/beforeEditPositionMapper.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { splitLines } from '../../../../../base/common/strings.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Position } from '../../../../common/core/position.js';
import { IRange, Range } from '../../../../common/core/range.js';
import { BeforeEditPositionMapper, TextEditInfo } from '../../../../common/model/bracketPairsTextModelPart/bracketPairsTree/beforeEditPositionMapper.js';
import { Length, lengthOfString, lengthToObj, lengthToPosition, toLength } from '../../../../common/model/bracketPairsTextModelPart/bracketPairsTree/length.js';

suite('Bracket Pair Colorizer - BeforeEditPositionMapper', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Single-Line 1', () => {
		assert.deepStrictEqual(
			compute(
				[
					'0123456789',
				],
				[
					new TextEdit(toLength(0, 4), toLength(0, 7), 'xy')
				]
			),
			[
				'0  1  2  3  x  y  7  8  9  ', // The line

				'0  0  0  0  0  0  0  0  0  0  ', // the old line numbers
				'0  1  2  3  4  5  7  8  9  10 ', // the old columns

				'0  0  0  0  0  0  ∞  ∞  ∞  ∞  ', // line count until next change
				'4  3  2  1  0  0  ∞  ∞  ∞  ∞  ', // column count until next change
			]
		);
	});

	test('Single-Line 2', () => {
		assert.deepStrictEqual(
			compute(
				[
					'0123456789',
				],
				[
					new TextEdit(toLength(0, 2), toLength(0, 4), 'xxxx'),
					new TextEdit(toLength(0, 6), toLength(0, 6), 'yy')
				]
			),
			[
				'0  1  x  x  x  x  4  5  y  y  6  7  8  9  ',

				'0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  ',
				'0  1  2  3  4  5  4  5  6  7  6  7  8  9  10 ',

				'0  0  0  0  0  0  0  0  0  0  ∞  ∞  ∞  ∞  ∞  ',
				'2  1  0  0  0  0  2  1  0  0  ∞  ∞  ∞  ∞  ∞  ',
			]
		);
	});

	test('Multi-Line Replace 1', () => {
		assert.deepStrictEqual(
			compute(
				[
					'₀₁₂₃₄₅₆₇₈₉',
					'0123456789',
					'⁰¹²³⁴⁵⁶⁷⁸⁹',

				],
				[
					new TextEdit(toLength(0, 3), toLength(1, 3), 'xy'),
				]
			),
			[
				'₀  ₁  ₂  x  y  3  4  5  6  7  8  9  ',

				'0  0  0  0  0  1  1  1  1  1  1  1  1  ',
				'0  1  2  3  4  3  4  5  6  7  8  9  10 ',

				'0  0  0  0  0  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ',
				'3  2  1  0  0  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ',
				// ------------------
				'⁰  ¹  ²  ³  ⁴  ⁵  ⁶  ⁷  ⁸  ⁹  ',

				'2  2  2  2  2  2  2  2  2  2  2  ',
				'0  1  2  3  4  5  6  7  8  9  10 ',

				'∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ',
				'∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ',
			]
		);
	});

	test('Multi-Line Replace 2', () => {
		assert.deepStrictEqual(
			compute(
				[
					'₀₁₂₃₄₅₆₇₈₉',
					'012345678',
					'⁰¹²³⁴⁵⁶⁷⁸⁹',

				],
				[
					new TextEdit(toLength(0, 3), toLength(1, 0), 'ab'),
					new TextEdit(toLength(1, 5), toLength(1, 7), 'c'),
				]
			),
			[
				'₀  ₁  ₂  a  b  0  1  2  3  4  c  7  8  ',

				'0  0  0  0  0  1  1  1  1  1  1  1  1  1  ',
				'0  1  2  3  4  0  1  2  3  4  5  7  8  9  ',

				'0  0  0  0  0  0  0  0  0  0  0  ∞  ∞  ∞  ',
				'3  2  1  0  0  5  4  3  2  1  0  ∞  ∞  ∞  ',
				// ------------------
				'⁰  ¹  ²  ³  ⁴  ⁵  ⁶  ⁷  ⁸  ⁹  ',

				'2  2  2  2  2  2  2  2  2  2  2  ',
				'0  1  2  3  4  5  6  7  8  9  10 ',

				'∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ',
				'∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ',
			]
		);
	});

	test('Multi-Line Replace 3', () => {
		assert.deepStrictEqual(
			compute(
				[
					'₀₁₂₃₄₅₆₇₈₉',
					'012345678',
					'⁰¹²³⁴⁵⁶⁷⁸⁹',

				],
				[
					new TextEdit(toLength(0, 3), toLength(1, 0), 'ab'),
					new TextEdit(toLength(1, 5), toLength(1, 7), 'c'),
					new TextEdit(toLength(1, 8), toLength(2, 4), 'd'),
				]
			),
			[
				'₀  ₁  ₂  a  b  0  1  2  3  4  c  7  d  ⁴  ⁵  ⁶  ⁷  ⁸  ⁹  ',

				'0  0  0  0  0  1  1  1  1  1  1  1  1  2  2  2  2  2  2  2  ',
				'0  1  2  3  4  0  1  2  3  4  5  7  8  4  5  6  7  8  9  10 ',

				'0  0  0  0  0  0  0  0  0  0  0  0  0  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ',
				'3  2  1  0  0  5  4  3  2  1  0  1  0  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ',
			]
		);
	});

	test('Multi-Line Insert 1', () => {
		assert.deepStrictEqual(
			compute(
				[
					'012345678',

				],
				[
					new TextEdit(toLength(0, 3), toLength(0, 5), 'a\nb'),
				]
			),
			[
				'0  1  2  a  ',

				'0  0  0  0  0  ',
				'0  1  2  3  4  ',

				'0  0  0  0  0  ',
				'3  2  1  0  0  ',
				// ------------------
				'b  5  6  7  8  ',

				'1  0  0  0  0  0  ',
				'0  5  6  7  8  9  ',

				'0  ∞  ∞  ∞  ∞  ∞  ',
				'0  ∞  ∞  ∞  ∞  ∞  ',
			]
		);
	});

	test('Multi-Line Insert 2', () => {
		assert.deepStrictEqual(
			compute(
				[
					'012345678',

				],
				[
					new TextEdit(toLength(0, 3), toLength(0, 5), 'a\nb'),
					new TextEdit(toLength(0, 7), toLength(0, 8), 'x\ny'),
				]
			),
			[
				'0  1  2  a  ',

				'0  0  0  0  0  ',
				'0  1  2  3  4  ',

				'0  0  0  0  0  ',
				'3  2  1  0  0  ',
				// ------------------
				'b  5  6  x  ',

				'1  0  0  0  0  ',
				'0  5  6  7  8  ',

				'0  0  0  0  0  ',
				'0  2  1  0  0  ',
				// ------------------
				'y  8  ',

				'1  0  0  ',
				'0  8  9  ',

				'0  ∞  ∞  ',
				'0  ∞  ∞  ',
			]
		);
	});

	test('Multi-Line Replace/Insert 1', () => {
		assert.deepStrictEqual(
			compute(
				[
					'₀₁₂₃₄₅₆₇₈₉',
					'012345678',
					'⁰¹²³⁴⁵⁶⁷⁸⁹',

				],
				[
					new TextEdit(toLength(0, 3), toLength(1, 1), 'aaa\nbbb'),
				]
			),
			[
				'₀  ₁  ₂  a  a  a  ',
				'0  0  0  0  0  0  0  ',
				'0  1  2  3  4  5  6  ',

				'0  0  0  0  0  0  0  ',
				'3  2  1  0  0  0  0  ',
				// ------------------
				'b  b  b  1  2  3  4  5  6  7  8  ',

				'1  1  1  1  1  1  1  1  1  1  1  1  ',
				'0  1  2  1  2  3  4  5  6  7  8  9  ',

				'0  0  0  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ',
				'0  0  0  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ',
				// ------------------
				'⁰  ¹  ²  ³  ⁴  ⁵  ⁶  ⁷  ⁸  ⁹  ',

				'2  2  2  2  2  2  2  2  2  2  2  ',
				'0  1  2  3  4  5  6  7  8  9  10 ',

				'∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ',
				'∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ',
			]
		);
	});

	test('Multi-Line Replace/Insert 2', () => {
		assert.deepStrictEqual(
			compute(
				[
					'₀₁₂₃₄₅₆₇₈₉',
					'012345678',
					'⁰¹²³⁴⁵⁶⁷⁸⁹',

				],
				[
					new TextEdit(toLength(0, 3), toLength(1, 1), 'aaa\nbbb'),
					new TextEdit(toLength(1, 5), toLength(1, 5), 'x\ny'),
					new TextEdit(toLength(1, 7), toLength(2, 4), 'k\nl'),
				]
			),
			[
				'₀  ₁  ₂  a  a  a  ',

				'0  0  0  0  0  0  0  ',
				'0  1  2  3  4  5  6  ',

				'0  0  0  0  0  0  0  ',
				'3  2  1  0  0  0  0  ',
				// ------------------
				'b  b  b  1  2  3  4  x  ',

				'1  1  1  1  1  1  1  1  1  ',
				'0  1  2  1  2  3  4  5  6  ',

				'0  0  0  0  0  0  0  0  0  ',
				'0  0  0  4  3  2  1  0  0  ',
				// ------------------
				'y  5  6  k  ',

				'2  1  1  1  1  ',
				'0  5  6  7  8  ',

				'0  0  0  0  0  ',
				'0  2  1  0  0  ',
				// ------------------
				'l  ⁴  ⁵  ⁶  ⁷  ⁸  ⁹  ',

				'2  2  2  2  2  2  2  2  ',
				'0  4  5  6  7  8  9  10 ',

				'0  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ',
				'0  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ',
			]
		);
	});
});

/** @pure */
function compute(inputArr: string[], edits: TextEdit[]): string[] {
	const newLines = splitLines(applyLineColumnEdits(inputArr.join('\n'), edits.map(e => ({
		text: e.newText,
		range: Range.fromPositions(lengthToPosition(e.startOffset), lengthToPosition(e.endOffset))
	}))));

	const mapper = new BeforeEditPositionMapper(edits);

	const result = new Array<string>();

	let lineIdx = 0;
	for (const line of newLines) {
		let lineLine = '';
		let colLine = '';
		let lineStr = '';

		let colDist = '';
		let lineDist = '';

		for (let colIdx = 0; colIdx <= line.length; colIdx++) {
			const before = mapper.getOffsetBeforeChange(toLength(lineIdx, colIdx));
			const beforeObj = lengthToObj(before);
			if (colIdx < line.length) {
				lineStr += rightPad(line[colIdx], 3);
			}
			lineLine += rightPad('' + beforeObj.lineCount, 3);
			colLine += rightPad('' + beforeObj.columnCount, 3);

			const distLen = mapper.getDistanceToNextChange(toLength(lineIdx, colIdx));
			if (distLen === null) {
				lineDist += '∞  ';
				colDist += '∞  ';
			} else {
				const dist = lengthToObj(distLen);
				lineDist += rightPad('' + dist.lineCount, 3);
				colDist += rightPad('' + dist.columnCount, 3);
			}
		}
		result.push(lineStr);

		result.push(lineLine);
		result.push(colLine);

		result.push(lineDist);
		result.push(colDist);

		lineIdx++;
	}

	return result;
}

export class TextEdit extends TextEditInfo {
	constructor(
		startOffset: Length,
		endOffset: Length,
		public readonly newText: string
	) {
		super(
			startOffset,
			endOffset,
			lengthOfString(newText)
		);
	}
}

class PositionOffsetTransformer {
	private readonly lineStartOffsetByLineIdx: number[];

	constructor(text: string) {
		this.lineStartOffsetByLineIdx = [];
		this.lineStartOffsetByLineIdx.push(0);
		for (let i = 0; i < text.length; i++) {
			if (text.charAt(i) === '\n') {
				this.lineStartOffsetByLineIdx.push(i + 1);
			}
		}
	}

	getOffset(position: Position): number {
		return this.lineStartOffsetByLineIdx[position.lineNumber - 1] + position.column - 1;
	}
}

function applyLineColumnEdits(text: string, edits: { range: IRange; text: string }[]): string {
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

function rightPad(str: string, len: number): string {
	while (str.length < len) {
		str += ' ';
	}
	return str;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/bracketPairColorizer/brackets.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/bracketPairColorizer/brackets.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { LanguageAgnosticBracketTokens } from '../../../../common/model/bracketPairsTextModelPart/bracketPairsTree/brackets.js';
import { SmallImmutableSet, DenseKeyProvider } from '../../../../common/model/bracketPairsTextModelPart/bracketPairsTree/smallImmutableSet.js';
import { Token, TokenKind } from '../../../../common/model/bracketPairsTextModelPart/bracketPairsTree/tokenizer.js';
import { TestLanguageConfigurationService } from '../../modes/testLanguageConfigurationService.js';

suite('Bracket Pair Colorizer - Brackets', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('Basic', () => {
		const languageId = 'testMode1';
		const denseKeyProvider = new DenseKeyProvider<string>();
		const getImmutableSet = (elements: string[]) => {
			let newSet = SmallImmutableSet.getEmpty();
			elements.forEach(x => newSet = newSet.add(`${languageId}:::${x}`, denseKeyProvider));
			return newSet;
		};
		const getKey = (value: string) => {
			return denseKeyProvider.getKey(`${languageId}:::${value}`);
		};

		const disposableStore = new DisposableStore();
		const languageConfigService = disposableStore.add(new TestLanguageConfigurationService());
		disposableStore.add(languageConfigService.register(languageId, {
			brackets: [
				['{', '}'], ['[', ']'], ['(', ')'],
				['begin', 'end'], ['case', 'endcase'], ['casez', 'endcase'],					// Verilog
				['\\left(', '\\right)'], ['\\left(', '\\right.'], ['\\left.', '\\right)'],		// LaTeX Parentheses
				['\\left[', '\\right]'], ['\\left[', '\\right.'], ['\\left.', '\\right]']		// LaTeX Brackets
			]
		}));

		const brackets = new LanguageAgnosticBracketTokens(denseKeyProvider, l => languageConfigService.getLanguageConfiguration(l));
		const bracketsExpected = [
			{ text: '{', length: 1, kind: 'OpeningBracket', bracketId: getKey('{'), bracketIds: getImmutableSet(['{']) },
			{ text: '[', length: 1, kind: 'OpeningBracket', bracketId: getKey('['), bracketIds: getImmutableSet(['[']) },
			{ text: '(', length: 1, kind: 'OpeningBracket', bracketId: getKey('('), bracketIds: getImmutableSet(['(']) },
			{ text: 'begin', length: 5, kind: 'OpeningBracket', bracketId: getKey('begin'), bracketIds: getImmutableSet(['begin']) },
			{ text: 'case', length: 4, kind: 'OpeningBracket', bracketId: getKey('case'), bracketIds: getImmutableSet(['case']) },
			{ text: 'casez', length: 5, kind: 'OpeningBracket', bracketId: getKey('casez'), bracketIds: getImmutableSet(['casez']) },
			{ text: '\\left(', length: 6, kind: 'OpeningBracket', bracketId: getKey('\\left('), bracketIds: getImmutableSet(['\\left(']) },
			{ text: '\\left.', length: 6, kind: 'OpeningBracket', bracketId: getKey('\\left.'), bracketIds: getImmutableSet(['\\left.']) },
			{ text: '\\left[', length: 6, kind: 'OpeningBracket', bracketId: getKey('\\left['), bracketIds: getImmutableSet(['\\left[']) },

			{ text: '}', length: 1, kind: 'ClosingBracket', bracketId: getKey('{'), bracketIds: getImmutableSet(['{']) },
			{ text: ']', length: 1, kind: 'ClosingBracket', bracketId: getKey('['), bracketIds: getImmutableSet(['[']) },
			{ text: ')', length: 1, kind: 'ClosingBracket', bracketId: getKey('('), bracketIds: getImmutableSet(['(']) },
			{ text: 'end', length: 3, kind: 'ClosingBracket', bracketId: getKey('begin'), bracketIds: getImmutableSet(['begin']) },
			{ text: 'endcase', length: 7, kind: 'ClosingBracket', bracketId: getKey('case'), bracketIds: getImmutableSet(['case', 'casez']) },
			{ text: '\\right)', length: 7, kind: 'ClosingBracket', bracketId: getKey('\\left('), bracketIds: getImmutableSet(['\\left(', '\\left.']) },
			{ text: '\\right.', length: 7, kind: 'ClosingBracket', bracketId: getKey('\\left('), bracketIds: getImmutableSet(['\\left(', '\\left[']) },
			{ text: '\\right]', length: 7, kind: 'ClosingBracket', bracketId: getKey('\\left['), bracketIds: getImmutableSet(['\\left[', '\\left.']) }
		];
		const bracketsActual = bracketsExpected.map(x => tokenToObject(brackets.getToken(x.text, languageId), x.text));

		assert.deepStrictEqual(bracketsActual, bracketsExpected);

		disposableStore.dispose();
	});
});

function tokenToObject(token: Token | undefined, text: string): any {
	if (token === undefined) {
		return undefined;
	}
	return {
		text: text,
		length: token.length,
		bracketId: token.bracketId,
		bracketIds: token.bracketIds,
		kind: {
			[TokenKind.ClosingBracket]: 'ClosingBracket',
			[TokenKind.OpeningBracket]: 'OpeningBracket',
			[TokenKind.Text]: 'Text',
		}[token.kind],
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/bracketPairColorizer/combineTextEditInfos.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/bracketPairColorizer/combineTextEditInfos.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../common/core/range.js';
import { TextReplacement } from '../../../../common/core/edits/textEdit.js';
import { TextEditInfo } from '../../../../common/model/bracketPairsTextModelPart/bracketPairsTree/beforeEditPositionMapper.js';
import { combineTextEditInfos } from '../../../../common/model/bracketPairsTextModelPart/bracketPairsTree/combineTextEditInfos.js';
import { lengthAdd, lengthToObj, lengthToPosition, positionToLength, toLength } from '../../../../common/model/bracketPairsTextModelPart/bracketPairsTree/length.js';
import { TextModel } from '../../../../common/model/textModel.js';
import { Random } from '../../core/random.js';
import { createTextModel } from '../../testTextModel.js';

suite('combineTextEditInfos', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	for (let seed = 0; seed < 50; seed++) {
		test('test' + seed, () => {
			runTest(seed);
		});
	}
});

function runTest(seed: number) {
	const rng = Random.create(seed);

	const str = 'abcde\nfghij\nklmno\npqrst\n';
	const textModelS0 = createTextModel(str);

	const edits1 = getRandomEditInfos(textModelS0, rng.nextIntRange(1, 4), rng);
	const textModelS1 = createTextModel(textModelS0.getValue());
	textModelS1.applyEdits(edits1.map(e => toEdit(e)));

	const edits2 = getRandomEditInfos(textModelS1, rng.nextIntRange(1, 4), rng);
	const textModelS2 = createTextModel(textModelS1.getValue());
	textModelS2.applyEdits(edits2.map(e => toEdit(e)));

	const combinedEdits = combineTextEditInfos(edits1, edits2);
	for (const edit of combinedEdits) {
		const range = Range.fromPositions(lengthToPosition(edit.startOffset), lengthToPosition(lengthAdd(edit.startOffset, edit.newLength)));
		const value = textModelS2.getValueInRange(range);
		if (!value.match(/^(L|C|\n)*$/)) {
			throw new Error('Invalid edit: ' + value);
		}
		textModelS2.applyEdits([{
			range,
			text: textModelS0.getValueInRange(Range.fromPositions(lengthToPosition(edit.startOffset), lengthToPosition(edit.endOffset))),
		}]);
	}

	assert.deepStrictEqual(textModelS2.getValue(), textModelS0.getValue());

	textModelS0.dispose();
	textModelS1.dispose();
	textModelS2.dispose();
}

export function getRandomEditInfos(textModel: TextModel, count: number, rng: Random, disjoint: boolean = false): TextEditInfo[] {
	const edits: TextEditInfo[] = [];
	let i = 0;
	for (let j = 0; j < count; j++) {
		edits.push(getRandomEdit(textModel, i, rng));
		i = textModel.getOffsetAt(lengthToPosition(edits[j].endOffset)) + (disjoint ? 1 : 0);
	}
	return edits;
}

function getRandomEdit(textModel: TextModel, rangeOffsetStart: number, rng: Random): TextEditInfo {
	const textModelLength = textModel.getValueLength();
	const offsetStart = rng.nextIntRange(rangeOffsetStart, textModelLength);
	const offsetEnd = rng.nextIntRange(offsetStart, textModelLength);

	const lineCount = rng.nextIntRange(0, 3);
	const columnCount = rng.nextIntRange(0, 5);

	return new TextEditInfo(positionToLength(textModel.getPositionAt(offsetStart)), positionToLength(textModel.getPositionAt(offsetEnd)), toLength(lineCount, columnCount));
}

function toEdit(editInfo: TextEditInfo): TextReplacement {
	const l = lengthToObj(editInfo.newLength);
	let text = '';

	for (let i = 0; i < l.lineCount; i++) {
		text += 'LLL\n';
	}
	for (let i = 0; i < l.columnCount; i++) {
		text += 'C';
	}

	return new TextReplacement(
		Range.fromPositions(
			lengthToPosition(editInfo.startOffset),
			lengthToPosition(editInfo.endOffset)
		),
		text
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/bracketPairColorizer/concat23Trees.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/bracketPairColorizer/concat23Trees.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { AstNode, AstNodeKind, ListAstNode, TextAstNode } from '../../../../common/model/bracketPairsTextModelPart/bracketPairsTree/ast.js';
import { concat23Trees } from '../../../../common/model/bracketPairsTextModelPart/bracketPairsTree/concat23Trees.js';
import { toLength } from '../../../../common/model/bracketPairsTextModelPart/bracketPairsTree/length.js';

suite('Bracket Pair Colorizer - mergeItems', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Clone', () => {
		const tree = ListAstNode.create([
			new TextAstNode(toLength(1, 1)),
			new TextAstNode(toLength(1, 1)),
		]);

		assert.ok(equals(tree, tree.deepClone()));
	});

	function equals(node1: AstNode, node2: AstNode): boolean {
		if (node1.length !== node2.length) {
			return false;
		}

		if (node1.children.length !== node2.children.length) {
			return false;
		}

		for (let i = 0; i < node1.children.length; i++) {
			if (!equals(node1.children[i], node2.children[i])) {
				return false;
			}
		}

		if (!node1.missingOpeningBracketIds.equals(node2.missingOpeningBracketIds)) {
			return false;
		}

		if (node1.kind === AstNodeKind.Pair && node2.kind === AstNodeKind.Pair) {
			return true;
		} else if (node1.kind === node2.kind) {
			return true;
		}

		return false;
	}

	function testMerge(lists: AstNode[]) {
		const node = (concat23Trees(lists.map(l => l.deepClone())) || ListAstNode.create([])).flattenLists();
		// This trivial merge does not maintain the (2,3) tree invariant.
		const referenceNode = ListAstNode.create(lists).flattenLists();

		assert.ok(equals(node, referenceNode), 'merge23Trees failed');
	}

	test('Empty List', () => {
		testMerge([]);
	});

	test('Same Height Lists', () => {
		const textNode = new TextAstNode(toLength(1, 1));
		const tree = ListAstNode.create([textNode.deepClone(), textNode.deepClone()]);
		testMerge([tree.deepClone(), tree.deepClone(), tree.deepClone(), tree.deepClone(), tree.deepClone()]);
	});

	test('Different Height Lists 1', () => {
		const textNode = new TextAstNode(toLength(1, 1));
		const tree1 = ListAstNode.create([textNode.deepClone(), textNode.deepClone()]);
		const tree2 = ListAstNode.create([tree1.deepClone(), tree1.deepClone()]);

		testMerge([tree1, tree2]);
	});

	test('Different Height Lists 2', () => {
		const textNode = new TextAstNode(toLength(1, 1));
		const tree1 = ListAstNode.create([textNode.deepClone(), textNode.deepClone()]);
		const tree2 = ListAstNode.create([tree1.deepClone(), tree1.deepClone()]);

		testMerge([tree2, tree1]);
	});

	test('Different Height Lists 3', () => {
		const textNode = new TextAstNode(toLength(1, 1));
		const tree1 = ListAstNode.create([textNode.deepClone(), textNode.deepClone()]);
		const tree2 = ListAstNode.create([tree1.deepClone(), tree1.deepClone()]);

		testMerge([tree2, tree1, tree1, tree2, tree2]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/bracketPairColorizer/getBracketPairsInRange.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/bracketPairColorizer/getBracketPairsInRange.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore, disposeOnReturn } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { StandardTokenType } from '../../../../common/encodedTokenAttributes.js';
import { TokenizationRegistry } from '../../../../common/languages.js';
import { ILanguageService } from '../../../../common/languages/language.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { TextModel } from '../../../../common/model/textModel.js';
import { BracketPairInfo } from '../../../../common/textModelBracketPairs.js';
import { TokenInfo, TokenizedDocument } from './tokenizer.test.js';
import { createModelServices, instantiateTextModel } from '../../testTextModel.js';

suite('Bracket Pair Colorizer - getBracketPairsInRange', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function createTextModelWithColorizedBracketPairs(store: DisposableStore, text: string): TextModel {
		const languageId = 'testLanguage';
		const instantiationService = createModelServices(store);
		const languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
		const languageService = instantiationService.get(ILanguageService);
		store.add(languageService.registerLanguage({
			id: languageId,
		}));

		const encodedMode1 = languageService.languageIdCodec.encodeLanguageId(languageId);
		const document = new TokenizedDocument([
			new TokenInfo(text, encodedMode1, StandardTokenType.Other, true)
		]);
		store.add(TokenizationRegistry.register(languageId, document.getTokenizationSupport()));

		store.add(languageConfigurationService.register(languageId, {
			brackets: [
				['<', '>']
			],
			colorizedBracketPairs: [
				['{', '}'],
				['[', ']'],
				['(', ')'],
			]
		}));
		const textModel = store.add(instantiateTextModel(instantiationService, text, languageId));
		return textModel;
	}

	test('Basic 1', () => {
		disposeOnReturn(store => {
			const doc = new AnnotatedDocument(`{ ( [] ¹ ) [ ² { } ] () } []`);
			const model = createTextModelWithColorizedBracketPairs(store, doc.text);
			model.tokenization.getLineTokens(1).getLanguageId(0);
			assert.deepStrictEqual(
				model.bracketPairs
					.getBracketPairsInRange(doc.range(1, 2))
					.map(bracketPairToJSON)
					.toArray(),
				[
					{
						level: 0,
						range: '[1,1 -> 1,2]',
						openRange: '[1,1 -> 1,2]',
						closeRange: '[1,23 -> 1,24]',
					},
					{
						level: 1,
						range: '[1,3 -> 1,4]',
						openRange: '[1,3 -> 1,4]',
						closeRange: '[1,9 -> 1,10]',
					},
					{
						level: 1,
						range: '[1,11 -> 1,12]',
						openRange: '[1,11 -> 1,12]',
						closeRange: '[1,18 -> 1,19]',
					},
				]
			);
		});
	});

	test('Basic 2', () => {
		disposeOnReturn(store => {
			const doc = new AnnotatedDocument(`{ ( [] ¹ ²) [  { } ] () } []`);
			const model = createTextModelWithColorizedBracketPairs(store, doc.text);
			assert.deepStrictEqual(
				model.bracketPairs
					.getBracketPairsInRange(doc.range(1, 2))
					.map(bracketPairToJSON)
					.toArray(),
				[
					{
						level: 0,
						range: '[1,1 -> 1,2]',
						openRange: '[1,1 -> 1,2]',
						closeRange: '[1,23 -> 1,24]',
					},
					{
						level: 1,
						range: '[1,3 -> 1,4]',
						openRange: '[1,3 -> 1,4]',
						closeRange: '[1,9 -> 1,10]',
					},
				]
			);
		});
	});

	test('Basic Empty', () => {
		disposeOnReturn(store => {
			const doc = new AnnotatedDocument(`¹ ² { ( [] ) [  { } ] () } []`);
			const model = createTextModelWithColorizedBracketPairs(store, doc.text);
			assert.deepStrictEqual(
				model.bracketPairs
					.getBracketPairsInRange(doc.range(1, 2))
					.map(bracketPairToJSON)
					.toArray(),
				[]
			);
		});
	});

	test('Basic All', () => {
		disposeOnReturn(store => {
			const doc = new AnnotatedDocument(`¹ { ( [] ) [  { } ] () } [] ²`);
			const model = createTextModelWithColorizedBracketPairs(store, doc.text);
			assert.deepStrictEqual(
				model.bracketPairs
					.getBracketPairsInRange(doc.range(1, 2))
					.map(bracketPairToJSON)
					.toArray(),
				[
					{
						level: 0,
						range: '[1,2 -> 1,3]',
						openRange: '[1,2 -> 1,3]',
						closeRange: '[1,23 -> 1,24]',
					},
					{
						level: 1,
						range: '[1,4 -> 1,5]',
						openRange: '[1,4 -> 1,5]',
						closeRange: '[1,9 -> 1,10]',
					},
					{
						level: 2,
						range: '[1,6 -> 1,7]',
						openRange: '[1,6 -> 1,7]',
						closeRange: '[1,7 -> 1,8]',
					},
					{
						level: 1,
						range: '[1,11 -> 1,12]',
						openRange: '[1,11 -> 1,12]',
						closeRange: '[1,18 -> 1,19]',
					},
					{
						level: 2,
						range: '[1,14 -> 1,15]',
						openRange: '[1,14 -> 1,15]',
						closeRange: '[1,16 -> 1,17]',
					},
					{
						level: 1,
						range: '[1,20 -> 1,21]',
						openRange: '[1,20 -> 1,21]',
						closeRange: '[1,21 -> 1,22]',
					},
					{
						level: 0,
						range: '[1,25 -> 1,26]',
						openRange: '[1,25 -> 1,26]',
						closeRange: '[1,26 -> 1,27]',
					},
				]
			);
		});
	});

	test('getBracketsInRange', () => {
		disposeOnReturn(store => {
			const doc = new AnnotatedDocument(`¹ { [ ( [ [ (  ) ] ] ) ] } { } ²`);
			const model = createTextModelWithColorizedBracketPairs(store, doc.text);
			assert.deepStrictEqual(
				model.bracketPairs
					.getBracketsInRange(doc.range(1, 2))
					.map(b => ({ level: b.nestingLevel, levelEqualBracketType: b.nestingLevelOfEqualBracketType, range: b.range.toString() }))
					.toArray(),
				[
					{
						level: 0,
						levelEqualBracketType: 0,
						range: '[1,2 -> 1,3]'
					},
					{
						level: 1,
						levelEqualBracketType: 0,
						range: '[1,4 -> 1,5]'
					},
					{
						level: 2,
						levelEqualBracketType: 0,
						range: '[1,6 -> 1,7]'
					},
					{
						level: 3,
						levelEqualBracketType: 1,
						range: '[1,8 -> 1,9]'
					},
					{
						level: 4,
						levelEqualBracketType: 2,
						range: '[1,10 -> 1,11]'
					},
					{
						level: 5,
						levelEqualBracketType: 1,
						range: '[1,12 -> 1,13]'
					},
					{
						level: 5,
						levelEqualBracketType: 1,
						range: '[1,15 -> 1,16]'
					},
					{
						level: 4,
						levelEqualBracketType: 2,
						range: '[1,17 -> 1,18]'
					},
					{
						level: 3,
						levelEqualBracketType: 1,
						range: '[1,19 -> 1,20]'
					},
					{
						level: 2,
						levelEqualBracketType: 0,
						range: '[1,21 -> 1,22]'
					},
					{
						level: 1,
						levelEqualBracketType: 0,
						range: '[1,23 -> 1,24]'
					},
					{
						level: 0,
						levelEqualBracketType: 0,
						range: '[1,25 -> 1,26]'
					},
					{
						level: 0,
						levelEqualBracketType: 0,
						range: '[1,27 -> 1,28]'
					},
					{
						level: 0,
						levelEqualBracketType: 0,
						range: '[1,29 -> 1,30]'
					},
				]
			);
		});
	});

	test('Test Error Brackets', () => {
		disposeOnReturn(store => {
			const doc = new AnnotatedDocument(`¹ { () ] ² `);
			const model = createTextModelWithColorizedBracketPairs(store, doc.text);
			assert.deepStrictEqual(
				model.bracketPairs
					.getBracketsInRange(doc.range(1, 2))
					.map(b => ({ level: b.nestingLevel, range: b.range.toString(), isInvalid: b.isInvalid }))
					.toArray(),
				[
					{
						level: 0,
						isInvalid: true,
						range: '[1,2 -> 1,3]',
					},
					{
						level: 1,
						isInvalid: false,
						range: '[1,4 -> 1,5]',
					},
					{
						level: 1,
						isInvalid: false,
						range: '[1,5 -> 1,6]',
					},
					{
						level: 0,
						isInvalid: true,
						range: '[1,7 -> 1,8]'
					}
				]
			);
		});
	});


	test('colorizedBracketsVSBrackets', () => {
		disposeOnReturn(store => {
			const doc = new AnnotatedDocument(`¹ {} [<()>] <{>} ²`);
			const model = createTextModelWithColorizedBracketPairs(store, doc.text);
			assert.deepStrictEqual(
				model.bracketPairs
					.getBracketsInRange(doc.range(1, 2), true)
					.map(b => ({ level: b.nestingLevel, levelEqualBracketType: b.nestingLevelOfEqualBracketType, range: b.range.toString() }))
					.toArray(),
				[
					{
						level: 0,
						levelEqualBracketType: 0,
						range: '[1,2 -> 1,3]',
					},
					{
						level: 0,
						levelEqualBracketType: 0,
						range: '[1,3 -> 1,4]',
					},
					{
						level: 0,
						levelEqualBracketType: 0,
						range: '[1,5 -> 1,6]',
					},
					{
						level: 1,
						levelEqualBracketType: 0,
						range: '[1,7 -> 1,8]',
					},
					{
						level: 1,
						levelEqualBracketType: 0,
						range: '[1,8 -> 1,9]',
					},
					{
						level: 0,
						levelEqualBracketType: 0,
						range: '[1,10 -> 1,11]',
					},
					{
						level: 0,
						levelEqualBracketType: 0,
						range: '[1,13 -> 1,14]',
					},
					{
						level: -1,
						levelEqualBracketType: 0,
						range: '[1,15 -> 1,16]',
					},
				]
			);

			assert.deepStrictEqual(
				model.bracketPairs
					.getBracketsInRange(doc.range(1, 2), false)
					.map(b => ({ level: b.nestingLevel, levelEqualBracketType: b.nestingLevelOfEqualBracketType, range: b.range.toString() }))
					.toArray(),
				[
					{
						level: 0,
						levelEqualBracketType: 0,
						range: '[1,2 -> 1,3]',
					},
					{
						level: 0,
						levelEqualBracketType: 0,
						range: '[1,3 -> 1,4]',
					},
					{
						level: 0,
						levelEqualBracketType: 0,
						range: '[1,5 -> 1,6]',
					},
					{
						level: 1,
						levelEqualBracketType: 0,
						range: '[1,6 -> 1,7]',
					},
					{
						level: 2,
						levelEqualBracketType: 0,
						range: '[1,7 -> 1,8]',
					},
					{
						level: 2,
						levelEqualBracketType: 0,
						range: '[1,8 -> 1,9]',
					},
					{
						level: 1,
						levelEqualBracketType: 0,
						range: '[1,9 -> 1,10]',
					},
					{
						level: 0,
						levelEqualBracketType: 0,
						range: '[1,10 -> 1,11]',
					},
					{
						level: 0,
						levelEqualBracketType: 0,
						range: '[1,12 -> 1,13]',
					},
					{
						level: 1,
						levelEqualBracketType: 0,
						range: '[1,13 -> 1,14]',
					},
					{
						level: 0,
						levelEqualBracketType: 0,
						range: '[1,14 -> 1,15]',
					},
					{
						level: -1,
						levelEqualBracketType: 0,
						range: '[1,15 -> 1,16]',
					},
				]
			);
		});
	});
});

function bracketPairToJSON(pair: BracketPairInfo): unknown {
	return {
		level: pair.nestingLevel,
		range: pair.openingBracketRange.toString(),
		openRange: pair.openingBracketRange.toString(),
		closeRange: pair.closingBracketRange?.toString() || null,
	};
}

class PositionOffsetTransformer {
	private readonly lineStartOffsetByLineIdx: number[];

	constructor(text: string) {
		this.lineStartOffsetByLineIdx = [];
		this.lineStartOffsetByLineIdx.push(0);
		for (let i = 0; i < text.length; i++) {
			if (text.charAt(i) === '\n') {
				this.lineStartOffsetByLineIdx.push(i + 1);
			}
		}
	}

	getOffset(position: Position): number {
		return this.lineStartOffsetByLineIdx[position.lineNumber - 1] + position.column - 1;
	}

	getPosition(offset: number): Position {
		const lineNumber = this.lineStartOffsetByLineIdx.findIndex(lineStartOffset => lineStartOffset <= offset);
		return new Position(lineNumber + 1, offset - this.lineStartOffsetByLineIdx[lineNumber] + 1);
	}
}

class AnnotatedDocument {
	public readonly text: string;
	private readonly positions: ReadonlyMap<number, Position>;

	constructor(src: string) {
		const numbers = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

		let text = '';
		const offsetPositions = new Map<number, number>();

		let offset = 0;
		for (let i = 0; i < src.length; i++) {
			const idx = numbers.indexOf(src[i]);
			if (idx >= 0) {
				offsetPositions.set(idx, offset);
			} else {
				text += src[i];
				offset++;
			}
		}

		this.text = text;

		const mapper = new PositionOffsetTransformer(this.text);
		const positions = new Map<number, Position>();
		for (const [idx, offset] of offsetPositions.entries()) {
			positions.set(idx, mapper.getPosition(offset));
		}
		this.positions = positions;
	}

	range(start: number, end: number): Range {
		return Range.fromPositions(this.positions.get(start)!, this.positions.get(end)!);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/bracketPairColorizer/length.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/bracketPairColorizer/length.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Length, lengthAdd, lengthDiffNonNegative, lengthToObj, toLength } from '../../../../common/model/bracketPairsTextModelPart/bracketPairsTree/length.js';

suite('Bracket Pair Colorizer - Length', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function toStr(length: Length): string {
		return lengthToObj(length).toString();
	}

	test('Basic', () => {
		const l1 = toLength(100, 10);
		assert.strictEqual(lengthToObj(l1).lineCount, 100);
		assert.strictEqual(lengthToObj(l1).columnCount, 10);

		assert.deepStrictEqual(toStr(lengthAdd(l1, toLength(100, 10))), '200,10');
		assert.deepStrictEqual(toStr(lengthAdd(l1, toLength(0, 10))), '100,20');
	});

	test('lengthDiffNonNeg', () => {
		assert.deepStrictEqual(
			toStr(
				lengthDiffNonNegative(
					toLength(100, 10),
					toLength(100, 20))
			),
			'0,10'
		);

		assert.deepStrictEqual(
			toStr(
				lengthDiffNonNegative(
					toLength(100, 10),
					toLength(101, 20))
			),
			'1,20'
		);

		assert.deepStrictEqual(
			toStr(
				lengthDiffNonNegative(
					toLength(101, 30),
					toLength(101, 20))
			),
			'0,0'
		);

		assert.deepStrictEqual(
			toStr(
				lengthDiffNonNegative(
					toLength(102, 10),
					toLength(101, 20))
			),
			'0,0'
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/bracketPairColorizer/smallImmutableSet.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/bracketPairColorizer/smallImmutableSet.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { DenseKeyProvider, SmallImmutableSet } from '../../../../common/model/bracketPairsTextModelPart/bracketPairsTree/smallImmutableSet.js';

suite('Bracket Pair Colorizer - ImmutableSet', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Basic', () => {
		const keyProvider = new DenseKeyProvider<string>();

		const empty = SmallImmutableSet.getEmpty<string>();
		const items1 = empty.add('item1', keyProvider);
		const items12 = items1.add('item2', keyProvider);
		const items2 = empty.add('item2', keyProvider);
		const items21 = items2.add('item1', keyProvider);

		const items3 = empty.add('item3', keyProvider);

		assert.strictEqual(items12.intersects(items1), true);
		assert.strictEqual(items12.has('item1', keyProvider), true);

		assert.strictEqual(items12.intersects(items3), false);
		assert.strictEqual(items12.has('item3', keyProvider), false);

		assert.strictEqual(items21.equals(items12), true);
		assert.strictEqual(items21.equals(items2), false);
	});

	test('Many Elements', () => {
		const keyProvider = new DenseKeyProvider<string>();

		let set = SmallImmutableSet.getEmpty<string>();

		for (let i = 0; i < 100; i++) {
			keyProvider.getKey(`item${i}`);
			if (i % 2 === 0) {
				set = set.add(`item${i}`, keyProvider);
			}
		}

		for (let i = 0; i < 100; i++) {
			assert.strictEqual(set.has(`item${i}`, keyProvider), i % 2 === 0);
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/bracketPairColorizer/tokenizer.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/bracketPairColorizer/tokenizer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { LanguageId, MetadataConsts, StandardTokenType } from '../../../../common/encodedTokenAttributes.js';
import { EncodedTokenizationResult, IState, ITokenizationSupport, TokenizationRegistry } from '../../../../common/languages.js';
import { ILanguageService } from '../../../../common/languages/language.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { LanguageAgnosticBracketTokens } from '../../../../common/model/bracketPairsTextModelPart/bracketPairsTree/brackets.js';
import { Length, lengthAdd, lengthsToRange, lengthZero } from '../../../../common/model/bracketPairsTextModelPart/bracketPairsTree/length.js';
import { DenseKeyProvider } from '../../../../common/model/bracketPairsTextModelPart/bracketPairsTree/smallImmutableSet.js';
import { TextBufferTokenizer, Token, Tokenizer, TokenKind } from '../../../../common/model/bracketPairsTextModelPart/bracketPairsTree/tokenizer.js';
import { TextModel } from '../../../../common/model/textModel.js';
import { createModelServices, instantiateTextModel } from '../../testTextModel.js';

suite('Bracket Pair Colorizer - Tokenizer', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Basic', () => {
		const mode1 = 'testMode1';
		const disposableStore = new DisposableStore();
		const instantiationService = createModelServices(disposableStore);
		const languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
		const languageService = instantiationService.get(ILanguageService);
		disposableStore.add(languageService.registerLanguage({ id: mode1 }));
		const encodedMode1 = languageService.languageIdCodec.encodeLanguageId(mode1);

		const denseKeyProvider = new DenseKeyProvider<string>();

		const tStandard = (text: string) => new TokenInfo(text, encodedMode1, StandardTokenType.Other, true);
		const tComment = (text: string) => new TokenInfo(text, encodedMode1, StandardTokenType.Comment, true);
		const document = new TokenizedDocument([
			tStandard(' { } '), tStandard('be'), tStandard('gin end'), tStandard('\n'),
			tStandard('hello'), tComment('{'), tStandard('}'),
		]);

		disposableStore.add(TokenizationRegistry.register(mode1, document.getTokenizationSupport()));
		disposableStore.add(languageConfigurationService.register(mode1, {
			brackets: [['{', '}'], ['[', ']'], ['(', ')'], ['begin', 'end']],
		}));

		const model = disposableStore.add(instantiateTextModel(instantiationService, document.getText(), mode1));
		model.tokenization.forceTokenization(model.getLineCount());

		const brackets = new LanguageAgnosticBracketTokens(denseKeyProvider, l => languageConfigurationService.getLanguageConfiguration(l));

		const tokens = readAllTokens(new TextBufferTokenizer(model, brackets));

		assert.deepStrictEqual(toArr(tokens, model, denseKeyProvider), [
			{ text: ' ', bracketId: null, bracketIds: [], kind: 'Text' },
			{
				text: '{',
				bracketId: 'testMode1:::{',
				bracketIds: ['testMode1:::{'],
				kind: 'OpeningBracket',
			},
			{ text: ' ', bracketId: null, bracketIds: [], kind: 'Text' },
			{
				text: '}',
				bracketId: 'testMode1:::{',
				bracketIds: ['testMode1:::{'],
				kind: 'ClosingBracket',
			},
			{ text: ' ', bracketId: null, bracketIds: [], kind: 'Text' },
			{
				text: 'begin',
				bracketId: 'testMode1:::begin',
				bracketIds: ['testMode1:::begin'],
				kind: 'OpeningBracket',
			},
			{ text: ' ', bracketId: null, bracketIds: [], kind: 'Text' },
			{
				text: 'end',
				bracketId: 'testMode1:::begin',
				bracketIds: ['testMode1:::begin'],
				kind: 'ClosingBracket',
			},
			{ text: '\nhello{', bracketId: null, bracketIds: [], kind: 'Text' },
			{
				text: '}',
				bracketId: 'testMode1:::{',
				bracketIds: ['testMode1:::{'],
				kind: 'ClosingBracket',
			},
		]);

		disposableStore.dispose();
	});
});

function readAllTokens(tokenizer: Tokenizer): Token[] {
	const tokens = new Array<Token>();
	while (true) {
		const token = tokenizer.read();
		if (!token) {
			break;
		}
		tokens.push(token);
	}
	return tokens;
}

function toArr(tokens: Token[], model: TextModel, keyProvider: DenseKeyProvider<string>): any[] {
	const result = new Array<any>();
	let offset = lengthZero;
	for (const token of tokens) {
		result.push(tokenToObj(token, offset, model, keyProvider));
		offset = lengthAdd(offset, token.length);
	}
	return result;
}

function tokenToObj(token: Token, offset: Length, model: TextModel, keyProvider: DenseKeyProvider<any>): any {
	return {
		text: model.getValueInRange(lengthsToRange(offset, lengthAdd(offset, token.length))),
		bracketId: keyProvider.reverseLookup(token.bracketId) || null,
		bracketIds: keyProvider.reverseLookupSet(token.bracketIds),
		kind: {
			[TokenKind.ClosingBracket]: 'ClosingBracket',
			[TokenKind.OpeningBracket]: 'OpeningBracket',
			[TokenKind.Text]: 'Text',
		}[token.kind]
	};
}

export class TokenizedDocument {
	private readonly tokensByLine: readonly TokenInfo[][];
	constructor(tokens: TokenInfo[]) {
		const tokensByLine = new Array<TokenInfo[]>();
		let curLine = new Array<TokenInfo>();

		for (const token of tokens) {
			const lines = token.text.split('\n');
			let first = true;
			while (lines.length > 0) {
				if (!first) {
					tokensByLine.push(curLine);
					curLine = new Array<TokenInfo>();
				} else {
					first = false;
				}

				if (lines[0].length > 0) {
					curLine.push(token.withText(lines[0]));
				}
				lines.pop();
			}
		}

		tokensByLine.push(curLine);

		this.tokensByLine = tokensByLine;
	}

	getText() {
		return this.tokensByLine.map(t => t.map(t => t.text).join('')).join('\n');
	}

	getTokenizationSupport(): ITokenizationSupport {
		class State implements IState {
			constructor(public readonly lineNumber: number) { }

			clone(): IState {
				return new State(this.lineNumber);
			}

			equals(other: IState): boolean {
				return this.lineNumber === (other as State).lineNumber;
			}
		}

		return {
			getInitialState: () => new State(0),
			tokenize: () => { throw new Error('Method not implemented.'); },
			tokenizeEncoded: (line: string, hasEOL: boolean, state: IState): EncodedTokenizationResult => {
				const state2 = state as State;
				const tokens = this.tokensByLine[state2.lineNumber];
				const arr = new Array<number>();
				let offset = 0;
				for (const t of tokens) {
					arr.push(offset, t.getMetadata());
					offset += t.text.length;
				}

				return new EncodedTokenizationResult(new Uint32Array(arr), [], new State(state2.lineNumber + 1));
			}
		};
	}
}

export class TokenInfo {
	constructor(
		public readonly text: string,
		public readonly languageId: LanguageId,
		public readonly tokenType: StandardTokenType,
		public readonly hasBalancedBrackets: boolean,
	) { }

	getMetadata(): number {
		return (
			(((this.languageId << MetadataConsts.LANGUAGEID_OFFSET) |
				(this.tokenType << MetadataConsts.TOKEN_TYPE_OFFSET)) >>>
				0) |
			(this.hasBalancedBrackets ? MetadataConsts.BALANCED_BRACKETS_MASK : 0)
		);
	}

	withText(text: string): TokenInfo {
		return new TokenInfo(text, this.languageId, this.tokenType, this.hasBalancedBrackets);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/linesTextBuffer/linesTextBuffer.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/linesTextBuffer/linesTextBuffer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../common/core/range.js';
import { DefaultEndOfLine } from '../../../../common/model.js';
import { IValidatedEditOperation, PieceTreeTextBuffer } from '../../../../common/model/pieceTreeTextBuffer/pieceTreeTextBuffer.js';
import { createTextBufferFactory } from '../../../../common/model/textModel.js';

suite('PieceTreeTextBuffer._getInverseEdits', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function editOp(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number, text: string[] | null): IValidatedEditOperation {
		return {
			sortIndex: 0,
			identifier: null,
			range: new Range(startLineNumber, startColumn, endLineNumber, endColumn),
			rangeOffset: 0,
			rangeLength: 0,
			text: text ? text.join('\n') : '',
			eolCount: text ? text.length - 1 : 0,
			firstLineLength: text ? text[0].length : 0,
			lastLineLength: text ? text[text.length - 1].length : 0,
			forceMoveMarkers: false,
			isAutoWhitespaceEdit: false
		};
	}

	function inverseEditOp(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number): Range {
		return new Range(startLineNumber, startColumn, endLineNumber, endColumn);
	}

	function assertInverseEdits(ops: IValidatedEditOperation[], expected: Range[]): void {
		const actual = PieceTreeTextBuffer._getInverseEditRanges(ops);
		assert.deepStrictEqual(actual, expected);
	}

	test('single insert', () => {
		assertInverseEdits(
			[
				editOp(1, 1, 1, 1, ['hello'])
			],
			[
				inverseEditOp(1, 1, 1, 6)
			]
		);
	});

	test('Bug 19872: Undo is funky', () => {
		assertInverseEdits(
			[
				editOp(2, 1, 2, 2, ['']),
				editOp(3, 1, 4, 2, [''])
			],
			[
				inverseEditOp(2, 1, 2, 1),
				inverseEditOp(3, 1, 3, 1)
			]
		);
	});

	test('two single unrelated inserts', () => {
		assertInverseEdits(
			[
				editOp(1, 1, 1, 1, ['hello']),
				editOp(2, 1, 2, 1, ['world'])
			],
			[
				inverseEditOp(1, 1, 1, 6),
				inverseEditOp(2, 1, 2, 6)
			]
		);
	});

	test('two single inserts 1', () => {
		assertInverseEdits(
			[
				editOp(1, 1, 1, 1, ['hello']),
				editOp(1, 2, 1, 2, ['world'])
			],
			[
				inverseEditOp(1, 1, 1, 6),
				inverseEditOp(1, 7, 1, 12)
			]
		);
	});

	test('two single inserts 2', () => {
		assertInverseEdits(
			[
				editOp(1, 1, 1, 1, ['hello']),
				editOp(1, 4, 1, 4, ['world'])
			],
			[
				inverseEditOp(1, 1, 1, 6),
				inverseEditOp(1, 9, 1, 14)
			]
		);
	});

	test('multiline insert', () => {
		assertInverseEdits(
			[
				editOp(1, 1, 1, 1, ['hello', 'world'])
			],
			[
				inverseEditOp(1, 1, 2, 6)
			]
		);
	});

	test('two unrelated multiline inserts', () => {
		assertInverseEdits(
			[
				editOp(1, 1, 1, 1, ['hello', 'world']),
				editOp(2, 1, 2, 1, ['how', 'are', 'you?']),
			],
			[
				inverseEditOp(1, 1, 2, 6),
				inverseEditOp(3, 1, 5, 5),
			]
		);
	});

	test('two multiline inserts 1', () => {
		assertInverseEdits(
			[
				editOp(1, 1, 1, 1, ['hello', 'world']),
				editOp(1, 2, 1, 2, ['how', 'are', 'you?']),
			],
			[
				inverseEditOp(1, 1, 2, 6),
				inverseEditOp(2, 7, 4, 5),
			]
		);
	});

	test('single delete', () => {
		assertInverseEdits(
			[
				editOp(1, 1, 1, 6, null)
			],
			[
				inverseEditOp(1, 1, 1, 1)
			]
		);
	});

	test('two single unrelated deletes', () => {
		assertInverseEdits(
			[
				editOp(1, 1, 1, 6, null),
				editOp(2, 1, 2, 6, null)
			],
			[
				inverseEditOp(1, 1, 1, 1),
				inverseEditOp(2, 1, 2, 1)
			]
		);
	});

	test('two single deletes 1', () => {
		assertInverseEdits(
			[
				editOp(1, 1, 1, 6, null),
				editOp(1, 7, 1, 12, null)
			],
			[
				inverseEditOp(1, 1, 1, 1),
				inverseEditOp(1, 2, 1, 2)
			]
		);
	});

	test('two single deletes 2', () => {
		assertInverseEdits(
			[
				editOp(1, 1, 1, 6, null),
				editOp(1, 9, 1, 14, null)
			],
			[
				inverseEditOp(1, 1, 1, 1),
				inverseEditOp(1, 4, 1, 4)
			]
		);
	});

	test('multiline delete', () => {
		assertInverseEdits(
			[
				editOp(1, 1, 2, 6, null)
			],
			[
				inverseEditOp(1, 1, 1, 1)
			]
		);
	});

	test('two unrelated multiline deletes', () => {
		assertInverseEdits(
			[
				editOp(1, 1, 2, 6, null),
				editOp(3, 1, 5, 5, null),
			],
			[
				inverseEditOp(1, 1, 1, 1),
				inverseEditOp(2, 1, 2, 1),
			]
		);
	});

	test('two multiline deletes 1', () => {
		assertInverseEdits(
			[
				editOp(1, 1, 2, 6, null),
				editOp(2, 7, 4, 5, null),
			],
			[
				inverseEditOp(1, 1, 1, 1),
				inverseEditOp(1, 2, 1, 2),
			]
		);
	});

	test('single replace', () => {
		assertInverseEdits(
			[
				editOp(1, 1, 1, 6, ['Hello world'])
			],
			[
				inverseEditOp(1, 1, 1, 12)
			]
		);
	});

	test('two replaces', () => {
		assertInverseEdits(
			[
				editOp(1, 1, 1, 6, ['Hello world']),
				editOp(1, 7, 1, 8, ['How are you?']),
			],
			[
				inverseEditOp(1, 1, 1, 12),
				inverseEditOp(1, 13, 1, 25)
			]
		);
	});

	test('many edits', () => {
		assertInverseEdits(
			[
				editOp(1, 2, 1, 2, ['', '  ']),
				editOp(1, 5, 1, 6, ['']),
				editOp(1, 9, 1, 9, ['', ''])
			],
			[
				inverseEditOp(1, 2, 2, 3),
				inverseEditOp(2, 6, 2, 6),
				inverseEditOp(2, 9, 3, 1)
			]
		);
	});
});

suite('PieceTreeTextBuffer._toSingleEditOperation', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function editOp(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number, rangeOffset: number, rangeLength: number, text: string[] | null): IValidatedEditOperation {
		return {
			sortIndex: 0,
			identifier: null,
			range: new Range(startLineNumber, startColumn, endLineNumber, endColumn),
			rangeOffset: rangeOffset,
			rangeLength: rangeLength,
			text: text ? text.join('\n') : '',
			eolCount: text ? text.length - 1 : 0,
			firstLineLength: text ? text[0].length : 0,
			lastLineLength: text ? text[text.length - 1].length : 0,
			forceMoveMarkers: false,
			isAutoWhitespaceEdit: false
		};
	}

	function testToSingleEditOperation(original: string[], edits: IValidatedEditOperation[], expected: IValidatedEditOperation): void {
		const { disposable, textBuffer } = createTextBufferFactory(original.join('\n')).create(DefaultEndOfLine.LF);

		const actual = (<PieceTreeTextBuffer>textBuffer)._toSingleEditOperation(edits);
		assert.deepStrictEqual(actual, expected);
		disposable.dispose();
	}

	test('one edit op is unchanged', () => {
		testToSingleEditOperation(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 3, 1, 3, 2, 0, [' new line', 'No longer'])
			],
			editOp(1, 3, 1, 3, 2, 0, [' new line', 'No longer'])
		);
	});

	test('two edits on one line', () => {
		testToSingleEditOperation([
			'My First Line',
			'\t\tMy Second Line',
			'    Third Line',
			'',
			'1'
		], [
			editOp(1, 1, 1, 3, 0, 2, ['Your']),
			editOp(1, 4, 1, 4, 3, 0, ['Interesting ']),
			editOp(2, 3, 2, 6, 16, 3, null)
		],
			editOp(1, 1, 2, 6, 0, 19, [
				'Your Interesting First Line',
				'\t\t'
			]));
	});

	test('insert multiple newlines', () => {
		testToSingleEditOperation(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 3, 1, 3, 2, 0, ['', '', '', '', '']),
				editOp(3, 15, 3, 15, 45, 0, ['a', 'b'])
			],
			editOp(1, 3, 3, 15, 2, 43, [
				'',
				'',
				'',
				'',
				' First Line',
				'\t\tMy Second Line',
				'    Third Linea',
				'b'
			])
		);
	});

	test('delete empty text', () => {
		testToSingleEditOperation(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'1'
			],
			[
				editOp(1, 1, 1, 1, 0, 0, [''])
			],
			editOp(1, 1, 1, 1, 0, 0, [''])
		);
	});

	test('two unrelated edits', () => {
		testToSingleEditOperation(
			[
				'My First Line',
				'\t\tMy Second Line',
				'    Third Line',
				'',
				'123'
			],
			[
				editOp(2, 1, 2, 3, 14, 2, ['\t']),
				editOp(3, 1, 3, 5, 31, 4, [''])
			],
			editOp(2, 1, 3, 5, 14, 21, ['\tMy Second Line', ''])
		);
	});

	test('many edits', () => {
		testToSingleEditOperation(
			[
				'{"x" : 1}'
			],
			[
				editOp(1, 2, 1, 2, 1, 0, ['\n  ']),
				editOp(1, 5, 1, 6, 4, 1, ['']),
				editOp(1, 9, 1, 9, 8, 0, ['\n'])
			],
			editOp(1, 2, 1, 9, 1, 7, [
				'',
				'  "x": 1',
				''
			])
		);
	});

	test('many edits reversed', () => {
		testToSingleEditOperation(
			[
				'{',
				'  "x": 1',
				'}'
			],
			[
				editOp(1, 2, 2, 3, 1, 3, ['']),
				editOp(2, 6, 2, 6, 7, 0, [' ']),
				editOp(2, 9, 3, 1, 10, 1, [''])
			],
			editOp(1, 2, 3, 1, 1, 10, ['"x" : 1'])
		);
	});

	test('replacing newlines 1', () => {
		testToSingleEditOperation(
			[
				'{',
				'"a": true,',
				'',
				'"b": true',
				'}'
			],
			[
				editOp(1, 2, 2, 1, 1, 1, ['', '\t']),
				editOp(2, 11, 4, 1, 12, 2, ['', '\t'])
			],
			editOp(1, 2, 4, 1, 1, 13, [
				'',
				'\t"a": true,',
				'\t'
			])
		);
	});

	test('replacing newlines 2', () => {
		testToSingleEditOperation(
			[
				'some text',
				'some more text',
				'now comes an empty line',
				'',
				'after empty line',
				'and the last line'
			],
			[
				editOp(1, 5, 3, 1, 4, 21, [' text', 'some more text', 'some more text']),
				editOp(3, 2, 4, 1, 26, 23, ['o more lines', 'asd', 'asd', 'asd']),
				editOp(5, 1, 5, 6, 50, 5, ['zzzzzzzz']),
				editOp(5, 11, 6, 16, 60, 22, ['1', '2', '3', '4'])
			],
			editOp(1, 5, 6, 16, 4, 78, [
				' text',
				'some more text',
				'some more textno more lines',
				'asd',
				'asd',
				'asd',
				'zzzzzzzz empt1',
				'2',
				'3',
				'4'
			])
		);
	});

	test('advanced', () => {
		testToSingleEditOperation(
			[
				' {       "d": [',
				'             null',
				'        ] /*comment*/',
				'        ,"e": /*comment*/ [null] }',
			],
			[
				editOp(1, 1, 1, 2, 0, 1, ['']),
				editOp(1, 3, 1, 10, 2, 7, ['', '  ']),
				editOp(1, 16, 2, 14, 15, 14, ['', '    ']),
				editOp(2, 18, 3, 9, 33, 9, ['', '  ']),
				editOp(3, 22, 4, 9, 55, 9, ['']),
				editOp(4, 10, 4, 10, 65, 0, ['', '  ']),
				editOp(4, 28, 4, 28, 83, 0, ['', '    ']),
				editOp(4, 32, 4, 32, 87, 0, ['', '  ']),
				editOp(4, 33, 4, 34, 88, 1, ['', ''])
			],
			editOp(1, 1, 4, 34, 0, 89, [
				'{',
				'  "d": [',
				'    null',
				'  ] /*comment*/,',
				'  "e": /*comment*/ [',
				'    null',
				'  ]',
				''
			])
		);
	});

	test('advanced simplified', () => {
		testToSingleEditOperation(
			[
				'   abc',
				' ,def'
			],
			[
				editOp(1, 1, 1, 4, 0, 3, ['']),
				editOp(1, 7, 2, 2, 6, 2, ['']),
				editOp(2, 3, 2, 3, 9, 0, ['', ''])
			],
			editOp(1, 1, 2, 3, 0, 9, [
				'abc,',
				''
			])
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/linesTextBuffer/linesTextBufferBuilder.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/linesTextBuffer/linesTextBufferBuilder.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as strings from '../../../../../base/common/strings.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { DefaultEndOfLine } from '../../../../common/model.js';
import { createTextBufferFactory } from '../../../../common/model/textModel.js';

function testTextBufferFactory(text: string, eol: string, mightContainNonBasicASCII: boolean, mightContainRTL: boolean): void {
	const { disposable, textBuffer } = createTextBufferFactory(text).create(DefaultEndOfLine.LF);

	assert.strictEqual(textBuffer.mightContainNonBasicASCII(), mightContainNonBasicASCII);
	assert.strictEqual(textBuffer.mightContainRTL(), mightContainRTL);
	assert.strictEqual(textBuffer.getEOL(), eol);
	disposable.dispose();
}

suite('ModelBuilder', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('t1', () => {
		testTextBufferFactory('', '\n', false, false);
	});

	test('t2', () => {
		testTextBufferFactory('Hello world', '\n', false, false);
	});

	test('t3', () => {
		testTextBufferFactory('Hello world\nHow are you?', '\n', false, false);
	});

	test('t4', () => {
		testTextBufferFactory('Hello world\nHow are you?\nIs everything good today?\nDo you enjoy the weather?', '\n', false, false);
	});

	test('carriage return detection (1 \\r\\n 2 \\n)', () => {
		testTextBufferFactory('Hello world\r\nHow are you?\nIs everything good today?\nDo you enjoy the weather?', '\n', false, false);
	});

	test('carriage return detection (2 \\r\\n 1 \\n)', () => {
		testTextBufferFactory('Hello world\r\nHow are you?\r\nIs everything good today?\nDo you enjoy the weather?', '\r\n', false, false);
	});

	test('carriage return detection (3 \\r\\n 0 \\n)', () => {
		testTextBufferFactory('Hello world\r\nHow are you?\r\nIs everything good today?\r\nDo you enjoy the weather?', '\r\n', false, false);
	});

	test('BOM handling', () => {
		testTextBufferFactory(strings.UTF8_BOM_CHARACTER + 'Hello world!', '\n', false, false);
	});

	test('RTL handling 2', () => {
		testTextBufferFactory('Hello world!זוהי עובדה מבוססת שדעתו', '\n', true, true);
	});

	test('RTL handling 3', () => {
		testTextBufferFactory('Hello world!זוהי \nעובדה מבוססת שדעתו', '\n', true, true);
	});

	test('ASCII handling 1', () => {
		testTextBufferFactory('Hello world!!\nHow do you do?', '\n', false, false);
	});
	test('ASCII handling 2', () => {
		testTextBufferFactory('Hello world!!\nHow do you do?Züricha📚📚b', '\n', true, false);
	});
});
```

--------------------------------------------------------------------------------

````
