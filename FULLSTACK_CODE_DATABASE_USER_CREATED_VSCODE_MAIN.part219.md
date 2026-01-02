---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 219
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 219 of 552)

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

---[FILE: src/vs/editor/common/viewModel/modelLineProjection.ts]---
Location: vscode-main/src/vs/editor/common/viewModel/modelLineProjection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LineTokens } from '../tokens/lineTokens.js';
import { Position } from '../core/position.js';
import { IRange } from '../core/range.js';
import { EndOfLinePreference, ITextModel, PositionAffinity } from '../model.js';
import { LineInjectedText } from '../textModelEvents.js';
import { InjectedText, ModelLineProjectionData } from '../modelLineProjectionData.js';
import { ViewLineData } from '../viewModel.js';
import { SingleLineInlineDecoration } from './inlineDecorations.js';

export interface IModelLineProjection {
	isVisible(): boolean;

	/**
	 * This invalidates the current instance (potentially reuses and returns it again).
	*/
	setVisible(isVisible: boolean): IModelLineProjection;

	getProjectionData(): ModelLineProjectionData | null;
	getViewLineCount(): number;
	getViewLineContent(model: ISimpleModel, modelLineNumber: number, outputLineIndex: number): string;
	getViewLineLength(model: ISimpleModel, modelLineNumber: number, outputLineIndex: number): number;
	getViewLineMinColumn(model: ISimpleModel, modelLineNumber: number, outputLineIndex: number): number;
	getViewLineMaxColumn(model: ISimpleModel, modelLineNumber: number, outputLineIndex: number): number;
	getViewLineData(model: ISimpleModel, modelLineNumber: number, outputLineIndex: number): ViewLineData;
	getViewLinesData(model: ISimpleModel, modelLineNumber: number, outputLineIdx: number, lineCount: number, globalStartIndex: number, needed: boolean[], result: Array<ViewLineData | null>): void;

	getModelColumnOfViewPosition(outputLineIndex: number, outputColumn: number): number;
	getViewPositionOfModelPosition(deltaLineNumber: number, inputColumn: number, affinity?: PositionAffinity): Position;
	getViewLineNumberOfModelPosition(deltaLineNumber: number, inputColumn: number): number;
	normalizePosition(outputLineIndex: number, outputPosition: Position, affinity: PositionAffinity): Position;

	getInjectedTextAt(outputLineIndex: number, column: number): InjectedText | null;
}

export interface ISimpleModel {
	tokenization: {
		getLineTokens(lineNumber: number): LineTokens;
	};
	getLineContent(lineNumber: number): string;
	getLineLength(lineNumber: number): number;
	getLineMinColumn(lineNumber: number): number;
	getLineMaxColumn(lineNumber: number): number;
	getValueInRange(range: IRange, eol?: EndOfLinePreference): string;
}

export function createModelLineProjection(lineBreakData: ModelLineProjectionData | null, isVisible: boolean): IModelLineProjection {
	if (lineBreakData === null) {
		// No mapping needed
		if (isVisible) {
			return IdentityModelLineProjection.INSTANCE;
		}
		return HiddenModelLineProjection.INSTANCE;
	} else {
		return new ModelLineProjection(lineBreakData, isVisible);
	}
}

/**
 * This projection is used to
 * * wrap model lines
 * * inject text
 */
class ModelLineProjection implements IModelLineProjection {
	private readonly _projectionData: ModelLineProjectionData;
	private _isVisible: boolean;

	constructor(lineBreakData: ModelLineProjectionData, isVisible: boolean) {
		this._projectionData = lineBreakData;
		this._isVisible = isVisible;
	}

	public isVisible(): boolean {
		return this._isVisible;
	}

	public setVisible(isVisible: boolean): IModelLineProjection {
		this._isVisible = isVisible;
		return this;
	}

	public getProjectionData(): ModelLineProjectionData | null {
		return this._projectionData;
	}

	public getViewLineCount(): number {
		if (!this._isVisible) {
			return 0;
		}
		return this._projectionData.getOutputLineCount();
	}

	public getViewLineContent(model: ISimpleModel, modelLineNumber: number, outputLineIndex: number): string {
		this._assertVisible();

		const startOffsetInInputWithInjections = outputLineIndex > 0 ? this._projectionData.breakOffsets[outputLineIndex - 1] : 0;
		const endOffsetInInputWithInjections = this._projectionData.breakOffsets[outputLineIndex];

		let r: string;
		if (this._projectionData.injectionOffsets !== null) {
			const injectedTexts = this._projectionData.injectionOffsets.map(
				(offset, idx) => new LineInjectedText(
					0,
					0,
					offset + 1,
					this._projectionData.injectionOptions![idx],
					0
				)
			);
			const lineWithInjections = LineInjectedText.applyInjectedText(
				model.getLineContent(modelLineNumber),
				injectedTexts
			);
			r = lineWithInjections.substring(startOffsetInInputWithInjections, endOffsetInInputWithInjections);
		} else {
			r = model.getValueInRange({
				startLineNumber: modelLineNumber,
				startColumn: startOffsetInInputWithInjections + 1,
				endLineNumber: modelLineNumber,
				endColumn: endOffsetInInputWithInjections + 1
			});
		}

		if (outputLineIndex > 0) {
			r = spaces(this._projectionData.wrappedTextIndentLength) + r;
		}

		return r;
	}

	public getViewLineLength(model: ISimpleModel, modelLineNumber: number, outputLineIndex: number): number {
		this._assertVisible();
		return this._projectionData.getLineLength(outputLineIndex);
	}

	public getViewLineMinColumn(_model: ITextModel, _modelLineNumber: number, outputLineIndex: number): number {
		this._assertVisible();
		return this._projectionData.getMinOutputOffset(outputLineIndex) + 1;
	}

	public getViewLineMaxColumn(model: ISimpleModel, modelLineNumber: number, outputLineIndex: number): number {
		this._assertVisible();
		return this._projectionData.getMaxOutputOffset(outputLineIndex) + 1;
	}

	/**
	 * Try using {@link getViewLinesData} instead.
	*/
	public getViewLineData(model: ISimpleModel, modelLineNumber: number, outputLineIndex: number): ViewLineData {
		const arr = new Array<ViewLineData>();
		this.getViewLinesData(model, modelLineNumber, outputLineIndex, 1, 0, [true], arr);
		return arr[0];
	}

	public getViewLinesData(model: ISimpleModel, modelLineNumber: number, outputLineIdx: number, lineCount: number, globalStartIndex: number, needed: boolean[], result: Array<ViewLineData | null>): void {
		this._assertVisible();

		const lineBreakData = this._projectionData;

		const injectionOffsets = lineBreakData.injectionOffsets;
		const injectionOptions = lineBreakData.injectionOptions;

		let inlineDecorationsPerOutputLine: SingleLineInlineDecoration[][] | null = null;

		if (injectionOffsets) {
			inlineDecorationsPerOutputLine = [];
			let totalInjectedTextLengthBefore = 0;
			let currentInjectedOffset = 0;

			for (let outputLineIndex = 0; outputLineIndex < lineBreakData.getOutputLineCount(); outputLineIndex++) {
				const inlineDecorations = new Array<SingleLineInlineDecoration>();
				inlineDecorationsPerOutputLine[outputLineIndex] = inlineDecorations;

				const lineStartOffsetInInputWithInjections = outputLineIndex > 0 ? lineBreakData.breakOffsets[outputLineIndex - 1] : 0;
				const lineEndOffsetInInputWithInjections = lineBreakData.breakOffsets[outputLineIndex];

				while (currentInjectedOffset < injectionOffsets.length) {
					const length = injectionOptions![currentInjectedOffset].content.length;
					const injectedTextStartOffsetInInputWithInjections = injectionOffsets[currentInjectedOffset] + totalInjectedTextLengthBefore;
					const injectedTextEndOffsetInInputWithInjections = injectedTextStartOffsetInInputWithInjections + length;

					if (injectedTextStartOffsetInInputWithInjections > lineEndOffsetInInputWithInjections) {
						// Injected text only starts in later wrapped lines.
						break;
					}

					if (lineStartOffsetInInputWithInjections < injectedTextEndOffsetInInputWithInjections) {
						// Injected text ends after or in this line (but also starts in or before this line).
						const options = injectionOptions![currentInjectedOffset];
						if (options.inlineClassName) {
							const offset = (outputLineIndex > 0 ? lineBreakData.wrappedTextIndentLength : 0);
							const start = offset + Math.max(injectedTextStartOffsetInInputWithInjections - lineStartOffsetInInputWithInjections, 0);
							const end = offset + Math.min(injectedTextEndOffsetInInputWithInjections - lineStartOffsetInInputWithInjections, lineEndOffsetInInputWithInjections - lineStartOffsetInInputWithInjections);
							if (start !== end) {
								inlineDecorations.push(new SingleLineInlineDecoration(start, end, options.inlineClassName, options.inlineClassNameAffectsLetterSpacing!));
							}
						}
					}

					if (injectedTextEndOffsetInInputWithInjections <= lineEndOffsetInInputWithInjections) {
						totalInjectedTextLengthBefore += length;
						currentInjectedOffset++;
					} else {
						// injected text breaks into next line, process it again
						break;
					}
				}
			}
		}

		let lineWithInjections: LineTokens;
		if (injectionOffsets) {
			const tokensToInsert: { offset: number; text: string; tokenMetadata: number }[] = [];

			for (let idx = 0; idx < injectionOffsets.length; idx++) {
				const offset = injectionOffsets[idx];
				const tokens = injectionOptions![idx].tokens;
				if (tokens) {
					tokens.forEach((range, info) => {
						tokensToInsert.push({
							offset,
							text: range.substring(injectionOptions![idx].content),
							tokenMetadata: info.metadata,
						});
					});
				} else {
					tokensToInsert.push({
						offset,
						text: injectionOptions![idx].content,
						tokenMetadata: LineTokens.defaultTokenMetadata,
					});
				}
			}

			lineWithInjections = model.tokenization.getLineTokens(modelLineNumber).withInserted(tokensToInsert);
		} else {
			lineWithInjections = model.tokenization.getLineTokens(modelLineNumber);
		}

		for (let outputLineIndex = outputLineIdx; outputLineIndex < outputLineIdx + lineCount; outputLineIndex++) {
			const globalIndex = globalStartIndex + outputLineIndex - outputLineIdx;
			if (!needed[globalIndex]) {
				result[globalIndex] = null;
				continue;
			}
			result[globalIndex] = this._getViewLineData(lineWithInjections, inlineDecorationsPerOutputLine ? inlineDecorationsPerOutputLine[outputLineIndex] : null, outputLineIndex);
		}
	}

	private _getViewLineData(lineWithInjections: LineTokens, inlineDecorations: null | SingleLineInlineDecoration[], outputLineIndex: number): ViewLineData {
		this._assertVisible();
		const lineBreakData = this._projectionData;
		const deltaStartIndex = (outputLineIndex > 0 ? lineBreakData.wrappedTextIndentLength : 0);

		const lineStartOffsetInInputWithInjections = outputLineIndex > 0 ? lineBreakData.breakOffsets[outputLineIndex - 1] : 0;
		const lineEndOffsetInInputWithInjections = lineBreakData.breakOffsets[outputLineIndex];
		const tokens = lineWithInjections.sliceAndInflate(lineStartOffsetInInputWithInjections, lineEndOffsetInInputWithInjections, deltaStartIndex);

		let lineContent = tokens.getLineContent();
		if (outputLineIndex > 0) {
			lineContent = spaces(lineBreakData.wrappedTextIndentLength) + lineContent;
		}

		const minColumn = this._projectionData.getMinOutputOffset(outputLineIndex) + 1;
		const maxColumn = lineContent.length + 1;
		const continuesWithWrappedLine = (outputLineIndex + 1 < this.getViewLineCount());
		const startVisibleColumn = (outputLineIndex === 0 ? 0 : lineBreakData.breakOffsetsVisibleColumn[outputLineIndex - 1]);

		return new ViewLineData(
			lineContent,
			continuesWithWrappedLine,
			minColumn,
			maxColumn,
			startVisibleColumn,
			tokens,
			inlineDecorations
		);
	}

	public getModelColumnOfViewPosition(outputLineIndex: number, outputColumn: number): number {
		this._assertVisible();
		return this._projectionData.translateToInputOffset(outputLineIndex, outputColumn - 1) + 1;
	}

	public getViewPositionOfModelPosition(deltaLineNumber: number, inputColumn: number, affinity: PositionAffinity = PositionAffinity.None): Position {
		this._assertVisible();
		const r = this._projectionData.translateToOutputPosition(inputColumn - 1, affinity);
		return r.toPosition(deltaLineNumber);
	}

	public getViewLineNumberOfModelPosition(deltaLineNumber: number, inputColumn: number): number {
		this._assertVisible();
		const r = this._projectionData.translateToOutputPosition(inputColumn - 1);
		return deltaLineNumber + r.outputLineIndex;
	}

	public normalizePosition(outputLineIndex: number, outputPosition: Position, affinity: PositionAffinity): Position {
		const baseViewLineNumber = outputPosition.lineNumber - outputLineIndex;
		const normalizedOutputPosition = this._projectionData.normalizeOutputPosition(outputLineIndex, outputPosition.column - 1, affinity);
		const result = normalizedOutputPosition.toPosition(baseViewLineNumber);
		return result;
	}

	public getInjectedTextAt(outputLineIndex: number, outputColumn: number): InjectedText | null {
		return this._projectionData.getInjectedText(outputLineIndex, outputColumn - 1);
	}

	private _assertVisible() {
		if (!this._isVisible) {
			throw new Error('Not supported');
		}
	}
}

/**
 * This projection does not change the model line.
*/
class IdentityModelLineProjection implements IModelLineProjection {
	public static readonly INSTANCE = new IdentityModelLineProjection();

	private constructor() { }

	public isVisible(): boolean {
		return true;
	}

	public setVisible(isVisible: boolean): IModelLineProjection {
		if (isVisible) {
			return this;
		}
		return HiddenModelLineProjection.INSTANCE;
	}

	public getProjectionData(): ModelLineProjectionData | null {
		return null;
	}

	public getViewLineCount(): number {
		return 1;
	}

	public getViewLineContent(model: ISimpleModel, modelLineNumber: number, _outputLineIndex: number): string {
		return model.getLineContent(modelLineNumber);
	}

	public getViewLineLength(model: ISimpleModel, modelLineNumber: number, _outputLineIndex: number): number {
		return model.getLineLength(modelLineNumber);
	}

	public getViewLineMinColumn(model: ISimpleModel, modelLineNumber: number, _outputLineIndex: number): number {
		return model.getLineMinColumn(modelLineNumber);
	}

	public getViewLineMaxColumn(model: ISimpleModel, modelLineNumber: number, _outputLineIndex: number): number {
		return model.getLineMaxColumn(modelLineNumber);
	}

	public getViewLineData(model: ISimpleModel, modelLineNumber: number, _outputLineIndex: number): ViewLineData {
		const lineTokens = model.tokenization.getLineTokens(modelLineNumber);
		const lineContent = lineTokens.getLineContent();
		return new ViewLineData(
			lineContent,
			false,
			1,
			lineContent.length + 1,
			0,
			lineTokens.inflate(),
			null
		);
	}

	public getViewLinesData(model: ISimpleModel, modelLineNumber: number, _fromOuputLineIndex: number, _toOutputLineIndex: number, globalStartIndex: number, needed: boolean[], result: Array<ViewLineData | null>): void {
		if (!needed[globalStartIndex]) {
			result[globalStartIndex] = null;
			return;
		}
		result[globalStartIndex] = this.getViewLineData(model, modelLineNumber, 0);
	}

	public getModelColumnOfViewPosition(_outputLineIndex: number, outputColumn: number): number {
		return outputColumn;
	}

	public getViewPositionOfModelPosition(deltaLineNumber: number, inputColumn: number): Position {
		return new Position(deltaLineNumber, inputColumn);
	}

	public getViewLineNumberOfModelPosition(deltaLineNumber: number, _inputColumn: number): number {
		return deltaLineNumber;
	}

	public normalizePosition(outputLineIndex: number, outputPosition: Position, affinity: PositionAffinity): Position {
		return outputPosition;
	}

	public getInjectedTextAt(_outputLineIndex: number, _outputColumn: number): InjectedText | null {
		return null;
	}
}

/**
 * This projection hides the model line.
 */
class HiddenModelLineProjection implements IModelLineProjection {
	public static readonly INSTANCE = new HiddenModelLineProjection();

	private constructor() { }

	public isVisible(): boolean {
		return false;
	}

	public setVisible(isVisible: boolean): IModelLineProjection {
		if (!isVisible) {
			return this;
		}
		return IdentityModelLineProjection.INSTANCE;
	}

	public getProjectionData(): ModelLineProjectionData | null {
		return null;
	}

	public getViewLineCount(): number {
		return 0;
	}

	public getViewLineContent(_model: ISimpleModel, _modelLineNumber: number, _outputLineIndex: number): string {
		throw new Error('Not supported');
	}

	public getViewLineLength(_model: ISimpleModel, _modelLineNumber: number, _outputLineIndex: number): number {
		throw new Error('Not supported');
	}

	public getViewLineMinColumn(_model: ISimpleModel, _modelLineNumber: number, _outputLineIndex: number): number {
		throw new Error('Not supported');
	}

	public getViewLineMaxColumn(_model: ISimpleModel, _modelLineNumber: number, _outputLineIndex: number): number {
		throw new Error('Not supported');
	}

	public getViewLineData(_model: ISimpleModel, _modelLineNumber: number, _outputLineIndex: number): ViewLineData {
		throw new Error('Not supported');
	}

	public getViewLinesData(_model: ISimpleModel, _modelLineNumber: number, _fromOuputLineIndex: number, _toOutputLineIndex: number, _globalStartIndex: number, _needed: boolean[], _result: ViewLineData[]): void {
		throw new Error('Not supported');
	}

	public getModelColumnOfViewPosition(_outputLineIndex: number, _outputColumn: number): number {
		throw new Error('Not supported');
	}

	public getViewPositionOfModelPosition(_deltaLineNumber: number, _inputColumn: number): Position {
		throw new Error('Not supported');
	}

	public getViewLineNumberOfModelPosition(_deltaLineNumber: number, _inputColumn: number): number {
		throw new Error('Not supported');
	}

	public normalizePosition(outputLineIndex: number, outputPosition: Position, affinity: PositionAffinity): Position {
		throw new Error('Not supported');
	}

	public getInjectedTextAt(_outputLineIndex: number, _outputColumn: number): InjectedText | null {
		throw new Error('Not supported');
	}
}

const _spaces: string[] = [''];
function spaces(count: number): string {
	if (count >= _spaces.length) {
		for (let i = 1; i <= count; i++) {
			_spaces[i] = _makeSpaces(i);
		}
	}
	return _spaces[count];
}

function _makeSpaces(count: number): string {
	return new Array(count + 1).join(' ');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewModel/monospaceLineBreaksComputer.ts]---
Location: vscode-main/src/vs/editor/common/viewModel/monospaceLineBreaksComputer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';
import * as strings from '../../../base/common/strings.js';
import { WrappingIndent, IComputedEditorOptions, EditorOption } from '../config/editorOptions.js';
import { CharacterClassifier } from '../core/characterClassifier.js';
import { FontInfo } from '../config/fontInfo.js';
import { LineInjectedText } from '../textModelEvents.js';
import { InjectedTextOptions } from '../model.js';
import { ILineBreaksComputerFactory, ILineBreaksComputer, ModelLineProjectionData } from '../modelLineProjectionData.js';

export class MonospaceLineBreaksComputerFactory implements ILineBreaksComputerFactory {
	public static create(options: IComputedEditorOptions): MonospaceLineBreaksComputerFactory {
		return new MonospaceLineBreaksComputerFactory(
			options.get(EditorOption.wordWrapBreakBeforeCharacters),
			options.get(EditorOption.wordWrapBreakAfterCharacters)
		);
	}

	private readonly classifier: WrappingCharacterClassifier;

	constructor(breakBeforeChars: string, breakAfterChars: string) {
		this.classifier = new WrappingCharacterClassifier(breakBeforeChars, breakAfterChars);
	}

	public createLineBreaksComputer(fontInfo: FontInfo, tabSize: number, wrappingColumn: number, wrappingIndent: WrappingIndent, wordBreak: 'normal' | 'keepAll', wrapOnEscapedLineFeeds: boolean): ILineBreaksComputer {
		const requests: string[] = [];
		const injectedTexts: (LineInjectedText[] | null)[] = [];
		const previousBreakingData: (ModelLineProjectionData | null)[] = [];
		return {
			addRequest: (lineText: string, injectedText: LineInjectedText[] | null, previousLineBreakData: ModelLineProjectionData | null) => {
				requests.push(lineText);
				injectedTexts.push(injectedText);
				previousBreakingData.push(previousLineBreakData);
			},
			finalize: () => {
				const columnsForFullWidthChar = fontInfo.typicalFullwidthCharacterWidth / fontInfo.typicalHalfwidthCharacterWidth;
				const result: (ModelLineProjectionData | null)[] = [];
				for (let i = 0, len = requests.length; i < len; i++) {
					const injectedText = injectedTexts[i];
					const previousLineBreakData = previousBreakingData[i];
					const lineText = requests[i];
					const isLineFeedWrappingEnabled = wrapOnEscapedLineFeeds && lineText.includes('"') && lineText.includes('\\n');
					if (previousLineBreakData && !previousLineBreakData.injectionOptions && !injectedText && !isLineFeedWrappingEnabled) {
						result[i] = createLineBreaksFromPreviousLineBreaks(this.classifier, previousLineBreakData, lineText, tabSize, wrappingColumn, columnsForFullWidthChar, wrappingIndent, wordBreak);
					} else {
						result[i] = createLineBreaks(this.classifier, lineText, injectedText, tabSize, wrappingColumn, columnsForFullWidthChar, wrappingIndent, wordBreak, isLineFeedWrappingEnabled);
					}
				}
				arrPool1.length = 0;
				arrPool2.length = 0;
				return result;
			}
		};
	}
}

const enum CharacterClass {
	NONE = 0,
	BREAK_BEFORE = 1,
	BREAK_AFTER = 2,
	BREAK_IDEOGRAPHIC = 3 // for Han and Kana.
}

class WrappingCharacterClassifier extends CharacterClassifier<CharacterClass> {

	constructor(BREAK_BEFORE: string, BREAK_AFTER: string) {
		super(CharacterClass.NONE);

		for (let i = 0; i < BREAK_BEFORE.length; i++) {
			this.set(BREAK_BEFORE.charCodeAt(i), CharacterClass.BREAK_BEFORE);
		}

		for (let i = 0; i < BREAK_AFTER.length; i++) {
			this.set(BREAK_AFTER.charCodeAt(i), CharacterClass.BREAK_AFTER);
		}
	}

	public override get(charCode: number): CharacterClass {
		if (charCode >= 0 && charCode < 256) {
			return <CharacterClass>this._asciiMap[charCode];
		} else {
			// Initialize CharacterClass.BREAK_IDEOGRAPHIC for these Unicode ranges:
			// 1. CJK Unified Ideographs (0x4E00 -- 0x9FFF)
			// 2. CJK Unified Ideographs Extension A (0x3400 -- 0x4DBF)
			// 3. Hiragana and Katakana (0x3040 -- 0x30FF)
			if (
				(charCode >= 0x3040 && charCode <= 0x30FF)
				|| (charCode >= 0x3400 && charCode <= 0x4DBF)
				|| (charCode >= 0x4E00 && charCode <= 0x9FFF)
			) {
				return CharacterClass.BREAK_IDEOGRAPHIC;
			}

			return <CharacterClass>(this._map.get(charCode) || this._defaultValue);
		}
	}
}

let arrPool1: number[] = [];
let arrPool2: number[] = [];

function createLineBreaksFromPreviousLineBreaks(classifier: WrappingCharacterClassifier, previousBreakingData: ModelLineProjectionData, lineText: string, tabSize: number, firstLineBreakColumn: number, columnsForFullWidthChar: number, wrappingIndent: WrappingIndent, wordBreak: 'normal' | 'keepAll'): ModelLineProjectionData | null {
	if (firstLineBreakColumn === -1) {
		return null;
	}

	const len = lineText.length;
	if (len <= 1) {
		return null;
	}

	const isKeepAll = (wordBreak === 'keepAll');

	const prevBreakingOffsets = previousBreakingData.breakOffsets;
	const prevBreakingOffsetsVisibleColumn = previousBreakingData.breakOffsetsVisibleColumn;

	const wrappedTextIndentLength = computeWrappedTextIndentLength(lineText, tabSize, firstLineBreakColumn, columnsForFullWidthChar, wrappingIndent);
	const wrappedLineBreakColumn = firstLineBreakColumn - wrappedTextIndentLength;

	const breakingOffsets: number[] = arrPool1;
	const breakingOffsetsVisibleColumn: number[] = arrPool2;
	let breakingOffsetsCount = 0;
	let lastBreakingOffset = 0;
	let lastBreakingOffsetVisibleColumn = 0;

	let breakingColumn = firstLineBreakColumn;
	const prevLen = prevBreakingOffsets.length;
	let prevIndex = 0;

	if (prevIndex >= 0) {
		let bestDistance = Math.abs(prevBreakingOffsetsVisibleColumn[prevIndex] - breakingColumn);
		while (prevIndex + 1 < prevLen) {
			const distance = Math.abs(prevBreakingOffsetsVisibleColumn[prevIndex + 1] - breakingColumn);
			if (distance >= bestDistance) {
				break;
			}
			bestDistance = distance;
			prevIndex++;
		}
	}

	while (prevIndex < prevLen) {
		// Allow for prevIndex to be -1 (for the case where we hit a tab when walking backwards from the first break)
		let prevBreakOffset = prevIndex < 0 ? 0 : prevBreakingOffsets[prevIndex];
		let prevBreakOffsetVisibleColumn = prevIndex < 0 ? 0 : prevBreakingOffsetsVisibleColumn[prevIndex];
		if (lastBreakingOffset > prevBreakOffset) {
			prevBreakOffset = lastBreakingOffset;
			prevBreakOffsetVisibleColumn = lastBreakingOffsetVisibleColumn;
		}

		let breakOffset = 0;
		let breakOffsetVisibleColumn = 0;

		let forcedBreakOffset = 0;
		let forcedBreakOffsetVisibleColumn = 0;

		// initially, we search as much as possible to the right (if it fits)
		if (prevBreakOffsetVisibleColumn <= breakingColumn) {
			let visibleColumn = prevBreakOffsetVisibleColumn;
			let prevCharCode = prevBreakOffset === 0 ? CharCode.Null : lineText.charCodeAt(prevBreakOffset - 1);
			let prevCharCodeClass = prevBreakOffset === 0 ? CharacterClass.NONE : classifier.get(prevCharCode);
			let entireLineFits = true;
			for (let i = prevBreakOffset; i < len; i++) {
				const charStartOffset = i;
				const charCode = lineText.charCodeAt(i);
				let charCodeClass: number;
				let charWidth: number;

				if (strings.isHighSurrogate(charCode)) {
					// A surrogate pair must always be considered as a single unit, so it is never to be broken
					i++;
					charCodeClass = CharacterClass.NONE;
					charWidth = 2;
				} else {
					charCodeClass = classifier.get(charCode);
					charWidth = computeCharWidth(charCode, visibleColumn, tabSize, columnsForFullWidthChar);
				}

				if (charStartOffset > lastBreakingOffset && canBreak(prevCharCode, prevCharCodeClass, charCode, charCodeClass, isKeepAll)) {
					breakOffset = charStartOffset;
					breakOffsetVisibleColumn = visibleColumn;
				}

				visibleColumn += charWidth;

				// check if adding character at `i` will go over the breaking column
				if (visibleColumn > breakingColumn) {
					// We need to break at least before character at `i`:
					if (charStartOffset > lastBreakingOffset) {
						forcedBreakOffset = charStartOffset;
						forcedBreakOffsetVisibleColumn = visibleColumn - charWidth;
					} else {
						// we need to advance at least by one character
						forcedBreakOffset = i + 1;
						forcedBreakOffsetVisibleColumn = visibleColumn;
					}

					if (visibleColumn - breakOffsetVisibleColumn > wrappedLineBreakColumn) {
						// Cannot break at `breakOffset` => reset it if it was set
						breakOffset = 0;
					}

					entireLineFits = false;
					break;
				}

				prevCharCode = charCode;
				prevCharCodeClass = charCodeClass;
			}

			if (entireLineFits) {
				// there is no more need to break => stop the outer loop!
				if (breakingOffsetsCount > 0) {
					// Add last segment, no need to assign to `lastBreakingOffset` and `lastBreakingOffsetVisibleColumn`
					breakingOffsets[breakingOffsetsCount] = prevBreakingOffsets[prevBreakingOffsets.length - 1];
					breakingOffsetsVisibleColumn[breakingOffsetsCount] = prevBreakingOffsetsVisibleColumn[prevBreakingOffsets.length - 1];
					breakingOffsetsCount++;
				}
				break;
			}
		}

		if (breakOffset === 0) {
			// must search left
			let visibleColumn = prevBreakOffsetVisibleColumn;
			let charCode = lineText.charCodeAt(prevBreakOffset);
			let charCodeClass = classifier.get(charCode);
			let hitATabCharacter = false;
			for (let i = prevBreakOffset - 1; i >= lastBreakingOffset; i--) {
				const charStartOffset = i + 1;
				const prevCharCode = lineText.charCodeAt(i);

				if (prevCharCode === CharCode.Tab) {
					// cannot determine the width of a tab when going backwards, so we must go forwards
					hitATabCharacter = true;
					break;
				}

				let prevCharCodeClass: number;
				let prevCharWidth: number;

				if (strings.isLowSurrogate(prevCharCode)) {
					// A surrogate pair must always be considered as a single unit, so it is never to be broken
					i--;
					prevCharCodeClass = CharacterClass.NONE;
					prevCharWidth = 2;
				} else {
					prevCharCodeClass = classifier.get(prevCharCode);
					prevCharWidth = (strings.isFullWidthCharacter(prevCharCode) ? columnsForFullWidthChar : 1);
				}

				if (visibleColumn <= breakingColumn) {
					if (forcedBreakOffset === 0) {
						forcedBreakOffset = charStartOffset;
						forcedBreakOffsetVisibleColumn = visibleColumn;
					}

					if (visibleColumn <= breakingColumn - wrappedLineBreakColumn) {
						// went too far!
						break;
					}

					if (canBreak(prevCharCode, prevCharCodeClass, charCode, charCodeClass, isKeepAll)) {
						breakOffset = charStartOffset;
						breakOffsetVisibleColumn = visibleColumn;
						break;
					}
				}

				visibleColumn -= prevCharWidth;
				charCode = prevCharCode;
				charCodeClass = prevCharCodeClass;
			}

			if (breakOffset !== 0) {
				const remainingWidthOfNextLine = wrappedLineBreakColumn - (forcedBreakOffsetVisibleColumn - breakOffsetVisibleColumn);
				if (remainingWidthOfNextLine <= tabSize) {
					const charCodeAtForcedBreakOffset = lineText.charCodeAt(forcedBreakOffset);
					let charWidth: number;
					if (strings.isHighSurrogate(charCodeAtForcedBreakOffset)) {
						// A surrogate pair must always be considered as a single unit, so it is never to be broken
						charWidth = 2;
					} else {
						charWidth = computeCharWidth(charCodeAtForcedBreakOffset, forcedBreakOffsetVisibleColumn, tabSize, columnsForFullWidthChar);
					}
					if (remainingWidthOfNextLine - charWidth < 0) {
						// it is not worth it to break at breakOffset, it just introduces an extra needless line!
						breakOffset = 0;
					}
				}
			}

			if (hitATabCharacter) {
				// cannot determine the width of a tab when going backwards, so we must go forwards from the previous break
				prevIndex--;
				continue;
			}
		}

		if (breakOffset === 0) {
			// Could not find a good breaking point
			breakOffset = forcedBreakOffset;
			breakOffsetVisibleColumn = forcedBreakOffsetVisibleColumn;
		}

		if (breakOffset <= lastBreakingOffset) {
			// Make sure that we are advancing (at least one character)
			const charCode = lineText.charCodeAt(lastBreakingOffset);
			if (strings.isHighSurrogate(charCode)) {
				// A surrogate pair must always be considered as a single unit, so it is never to be broken
				breakOffset = lastBreakingOffset + 2;
				breakOffsetVisibleColumn = lastBreakingOffsetVisibleColumn + 2;
			} else {
				breakOffset = lastBreakingOffset + 1;
				breakOffsetVisibleColumn = lastBreakingOffsetVisibleColumn + computeCharWidth(charCode, lastBreakingOffsetVisibleColumn, tabSize, columnsForFullWidthChar);
			}
		}

		lastBreakingOffset = breakOffset;
		breakingOffsets[breakingOffsetsCount] = breakOffset;
		lastBreakingOffsetVisibleColumn = breakOffsetVisibleColumn;
		breakingOffsetsVisibleColumn[breakingOffsetsCount] = breakOffsetVisibleColumn;
		breakingOffsetsCount++;
		breakingColumn = breakOffsetVisibleColumn + wrappedLineBreakColumn;

		while (prevIndex < 0 || (prevIndex < prevLen && prevBreakingOffsetsVisibleColumn[prevIndex] < breakOffsetVisibleColumn)) {
			prevIndex++;
		}

		let bestDistance = Math.abs(prevBreakingOffsetsVisibleColumn[prevIndex] - breakingColumn);
		while (prevIndex + 1 < prevLen) {
			const distance = Math.abs(prevBreakingOffsetsVisibleColumn[prevIndex + 1] - breakingColumn);
			if (distance >= bestDistance) {
				break;
			}
			bestDistance = distance;
			prevIndex++;
		}
	}

	if (breakingOffsetsCount === 0) {
		return null;
	}

	// Doing here some object reuse which ends up helping a huge deal with GC pauses!
	breakingOffsets.length = breakingOffsetsCount;
	breakingOffsetsVisibleColumn.length = breakingOffsetsCount;
	arrPool1 = previousBreakingData.breakOffsets;
	arrPool2 = previousBreakingData.breakOffsetsVisibleColumn;
	previousBreakingData.breakOffsets = breakingOffsets;
	previousBreakingData.breakOffsetsVisibleColumn = breakingOffsetsVisibleColumn;
	previousBreakingData.wrappedTextIndentLength = wrappedTextIndentLength;
	return previousBreakingData;
}

function createLineBreaks(classifier: WrappingCharacterClassifier, _lineText: string, injectedTexts: LineInjectedText[] | null, tabSize: number, firstLineBreakColumn: number, columnsForFullWidthChar: number, wrappingIndent: WrappingIndent, wordBreak: 'normal' | 'keepAll', wrapOnEscapedLineFeeds: boolean): ModelLineProjectionData | null {
	const lineText = LineInjectedText.applyInjectedText(_lineText, injectedTexts);

	let injectionOptions: InjectedTextOptions[] | null;
	let injectionOffsets: number[] | null;
	if (injectedTexts && injectedTexts.length > 0) {
		injectionOptions = injectedTexts.map(t => t.options);
		injectionOffsets = injectedTexts.map(text => text.column - 1);
	} else {
		injectionOptions = null;
		injectionOffsets = null;
	}

	if (firstLineBreakColumn === -1) {
		if (!injectionOptions) {
			return null;
		}
		// creating a `LineBreakData` with an invalid `breakOffsetsVisibleColumn` is OK
		// because `breakOffsetsVisibleColumn` will never be used because it contains injected text
		return new ModelLineProjectionData(injectionOffsets, injectionOptions, [lineText.length], [], 0);
	}

	const len = lineText.length;
	if (len <= 1) {
		if (!injectionOptions) {
			return null;
		}
		// creating a `LineBreakData` with an invalid `breakOffsetsVisibleColumn` is OK
		// because `breakOffsetsVisibleColumn` will never be used because it contains injected text
		return new ModelLineProjectionData(injectionOffsets, injectionOptions, [lineText.length], [], 0);
	}

	const isKeepAll = (wordBreak === 'keepAll');
	const wrappedTextIndentLength = computeWrappedTextIndentLength(lineText, tabSize, firstLineBreakColumn, columnsForFullWidthChar, wrappingIndent);
	const wrappedLineBreakColumn = firstLineBreakColumn - wrappedTextIndentLength;

	const breakingOffsets: number[] = [];
	const breakingOffsetsVisibleColumn: number[] = [];
	let breakingOffsetsCount: number = 0;
	let breakOffset = 0;
	let breakOffsetVisibleColumn = 0;

	let breakingColumn = firstLineBreakColumn;
	let prevCharCode = lineText.charCodeAt(0);
	let prevCharCodeClass = classifier.get(prevCharCode);
	let visibleColumn = computeCharWidth(prevCharCode, 0, tabSize, columnsForFullWidthChar);

	let startOffset = 1;
	if (strings.isHighSurrogate(prevCharCode)) {
		// A surrogate pair must always be considered as a single unit, so it is never to be broken
		visibleColumn += 1;
		prevCharCode = lineText.charCodeAt(1);
		prevCharCodeClass = classifier.get(prevCharCode);
		startOffset++;
	}

	for (let i = startOffset; i < len; i++) {
		const charStartOffset = i;
		const charCode = lineText.charCodeAt(i);
		let charCodeClass: CharacterClass;
		let charWidth: number;
		let wrapEscapedLineFeed = false;

		if (strings.isHighSurrogate(charCode)) {
			// A surrogate pair must always be considered as a single unit, so it is never to be broken
			i++;
			charCodeClass = CharacterClass.NONE;
			charWidth = 2;
		} else {
			charCodeClass = classifier.get(charCode);
			charWidth = computeCharWidth(charCode, visibleColumn, tabSize, columnsForFullWidthChar);
		}

		// literal \n shall trigger a softwrap
		if (wrapOnEscapedLineFeeds && isEscapedLineBreakAtPosition(lineText, i)) {
			breakOffset = charStartOffset;
			breakOffsetVisibleColumn = visibleColumn;
			wrapEscapedLineFeed = true;
		} else if (canBreak(prevCharCode, prevCharCodeClass, charCode, charCodeClass, isKeepAll)) {
			breakOffset = charStartOffset;
			breakOffsetVisibleColumn = visibleColumn;
		}

		visibleColumn += charWidth;

		// check if adding character at `i` will go over the breaking column
		if (visibleColumn > breakingColumn || wrapEscapedLineFeed) {
			// We need to break at least before character at `i`:

			if (breakOffset === 0 || visibleColumn - breakOffsetVisibleColumn > wrappedLineBreakColumn) {
				// Cannot break at `breakOffset`, must break at `i`
				breakOffset = charStartOffset;
				breakOffsetVisibleColumn = visibleColumn - charWidth;
			}

			breakingOffsets[breakingOffsetsCount] = breakOffset;
			breakingOffsetsVisibleColumn[breakingOffsetsCount] = breakOffsetVisibleColumn;
			breakingOffsetsCount++;
			breakingColumn = breakOffsetVisibleColumn + wrappedLineBreakColumn;
			breakOffset = 0;
		}

		prevCharCode = charCode;
		prevCharCodeClass = charCodeClass;
	}

	if (breakingOffsetsCount === 0 && (!injectedTexts || injectedTexts.length === 0)) {
		return null;
	}

	// Add last segment
	breakingOffsets[breakingOffsetsCount] = len;
	breakingOffsetsVisibleColumn[breakingOffsetsCount] = visibleColumn;

	return new ModelLineProjectionData(injectionOffsets, injectionOptions, breakingOffsets, breakingOffsetsVisibleColumn, wrappedTextIndentLength);
}

function computeCharWidth(charCode: number, visibleColumn: number, tabSize: number, columnsForFullWidthChar: number): number {
	if (charCode === CharCode.Tab) {
		return (tabSize - (visibleColumn % tabSize));
	}
	if (strings.isFullWidthCharacter(charCode)) {
		return columnsForFullWidthChar;
	}
	if (charCode < 32) {
		// when using `editor.renderControlCharacters`, the substitutions are often wide
		return columnsForFullWidthChar;
	}
	return 1;
}

function tabCharacterWidth(visibleColumn: number, tabSize: number): number {
	return (tabSize - (visibleColumn % tabSize));
}

/**
 * Checks if the current position in the text should trigger a soft wrap due to escaped line feeds.
 * This handles the wrapOnEscapedLineFeeds feature which allows \n sequences in strings to trigger wrapping.
 */
function isEscapedLineBreakAtPosition(lineText: string, i: number): boolean {
	if (i >= 2 && lineText.charAt(i - 1) === 'n') {
		// Check if there's an odd number of backslashes
		let escapeCount = 0;
		for (let j = i - 2; j >= 0; j--) {
			if (lineText.charAt(j) === '\\') {
				escapeCount++;
			} else {
				return escapeCount % 2 === 1;
			}
		}
	}
	return false;
}

/**
 * Kinsoku Shori : Don't break after a leading character, like an open bracket
 * Kinsoku Shori : Don't break before a trailing character, like a period
 */
function canBreak(prevCharCode: number, prevCharCodeClass: CharacterClass, charCode: number, charCodeClass: CharacterClass, isKeepAll: boolean): boolean {
	return (
		charCode !== CharCode.Space
		&& (
			(prevCharCodeClass === CharacterClass.BREAK_AFTER && charCodeClass !== CharacterClass.BREAK_AFTER) // break at the end of multiple BREAK_AFTER
			|| (prevCharCodeClass !== CharacterClass.BREAK_BEFORE && charCodeClass === CharacterClass.BREAK_BEFORE) // break at the start of multiple BREAK_BEFORE
			|| (!isKeepAll && prevCharCodeClass === CharacterClass.BREAK_IDEOGRAPHIC && charCodeClass !== CharacterClass.BREAK_AFTER)
			|| (!isKeepAll && charCodeClass === CharacterClass.BREAK_IDEOGRAPHIC && prevCharCodeClass !== CharacterClass.BREAK_BEFORE)
		)
	);
}

function computeWrappedTextIndentLength(lineText: string, tabSize: number, firstLineBreakColumn: number, columnsForFullWidthChar: number, wrappingIndent: WrappingIndent): number {
	let wrappedTextIndentLength = 0;
	if (wrappingIndent !== WrappingIndent.None) {
		const firstNonWhitespaceIndex = strings.firstNonWhitespaceIndex(lineText);
		if (firstNonWhitespaceIndex !== -1) {
			// Track existing indent

			for (let i = 0; i < firstNonWhitespaceIndex; i++) {
				const charWidth = (lineText.charCodeAt(i) === CharCode.Tab ? tabCharacterWidth(wrappedTextIndentLength, tabSize) : 1);
				wrappedTextIndentLength += charWidth;
			}

			// Increase indent of continuation lines, if desired
			const numberOfAdditionalTabs = (wrappingIndent === WrappingIndent.DeepIndent ? 2 : wrappingIndent === WrappingIndent.Indent ? 1 : 0);
			for (let i = 0; i < numberOfAdditionalTabs; i++) {
				const charWidth = tabCharacterWidth(wrappedTextIndentLength, tabSize);
				wrappedTextIndentLength += charWidth;
			}

			// Force sticking to beginning of line if no character would fit except for the indentation
			if (wrappedTextIndentLength + columnsForFullWidthChar > firstLineBreakColumn) {
				wrappedTextIndentLength = 0;
			}
		}
	}
	return wrappedTextIndentLength;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewModel/overviewZoneManager.ts]---
Location: vscode-main/src/vs/editor/common/viewModel/overviewZoneManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const enum Constants {
	MINIMUM_HEIGHT = 4
}

export class ColorZone {
	_colorZoneBrand: void = undefined;

	public readonly from: number;
	public readonly to: number;
	public readonly colorId: number;

	constructor(from: number, to: number, colorId: number) {
		this.from = from | 0;
		this.to = to | 0;
		this.colorId = colorId | 0;
	}

	public static compare(a: ColorZone, b: ColorZone): number {
		if (a.colorId === b.colorId) {
			if (a.from === b.from) {
				return a.to - b.to;
			}
			return a.from - b.from;
		}
		return a.colorId - b.colorId;
	}
}

/**
 * A zone in the overview ruler
 */
export class OverviewRulerZone {
	_overviewRulerZoneBrand: void = undefined;

	public readonly startLineNumber: number;
	public readonly endLineNumber: number;
	/**
	 * If set to 0, the height in lines will be determined based on `endLineNumber`.
	 */
	public readonly heightInLines: number;
	public readonly color: string;

	private _colorZone: ColorZone | null;

	constructor(
		startLineNumber: number,
		endLineNumber: number,
		heightInLines: number,
		color: string
	) {
		this.startLineNumber = startLineNumber;
		this.endLineNumber = endLineNumber;
		this.heightInLines = heightInLines;
		this.color = color;
		this._colorZone = null;
	}

	public static compare(a: OverviewRulerZone, b: OverviewRulerZone): number {
		if (a.color === b.color) {
			if (a.startLineNumber === b.startLineNumber) {
				if (a.heightInLines === b.heightInLines) {
					return a.endLineNumber - b.endLineNumber;
				}
				return a.heightInLines - b.heightInLines;
			}
			return a.startLineNumber - b.startLineNumber;
		}
		return a.color < b.color ? -1 : 1;
	}

	public setColorZone(colorZone: ColorZone): void {
		this._colorZone = colorZone;
	}

	public getColorZones(): ColorZone | null {
		return this._colorZone;
	}
}

export class OverviewZoneManager {

	private readonly _getVerticalOffsetForLine: (lineNumber: number) => number;
	private _zones: OverviewRulerZone[];
	private _colorZonesInvalid: boolean;
	private _lineHeight: number;
	private _domWidth: number;
	private _domHeight: number;
	private _outerHeight: number;
	private _pixelRatio: number;

	private _lastAssignedId: number;
	private readonly _color2Id: { [color: string]: number };
	private readonly _id2Color: string[];

	constructor(getVerticalOffsetForLine: (lineNumber: number) => number) {
		this._getVerticalOffsetForLine = getVerticalOffsetForLine;
		this._zones = [];
		this._colorZonesInvalid = false;
		this._lineHeight = 0;
		this._domWidth = 0;
		this._domHeight = 0;
		this._outerHeight = 0;
		this._pixelRatio = 1;

		this._lastAssignedId = 0;
		this._color2Id = Object.create(null);
		this._id2Color = [];
	}

	public getId2Color(): string[] {
		return this._id2Color;
	}

	public setZones(newZones: OverviewRulerZone[]): void {
		this._zones = newZones;
		this._zones.sort(OverviewRulerZone.compare);
	}

	public setLineHeight(lineHeight: number): boolean {
		if (this._lineHeight === lineHeight) {
			return false;
		}
		this._lineHeight = lineHeight;
		this._colorZonesInvalid = true;
		return true;
	}

	public setPixelRatio(pixelRatio: number): void {
		this._pixelRatio = pixelRatio;
		this._colorZonesInvalid = true;
	}

	public getDOMWidth(): number {
		return this._domWidth;
	}

	public getCanvasWidth(): number {
		return this._domWidth * this._pixelRatio;
	}

	public setDOMWidth(width: number): boolean {
		if (this._domWidth === width) {
			return false;
		}
		this._domWidth = width;
		this._colorZonesInvalid = true;
		return true;
	}

	public getDOMHeight(): number {
		return this._domHeight;
	}

	public getCanvasHeight(): number {
		return this._domHeight * this._pixelRatio;
	}

	public setDOMHeight(height: number): boolean {
		if (this._domHeight === height) {
			return false;
		}
		this._domHeight = height;
		this._colorZonesInvalid = true;
		return true;
	}

	public getOuterHeight(): number {
		return this._outerHeight;
	}

	public setOuterHeight(outerHeight: number): boolean {
		if (this._outerHeight === outerHeight) {
			return false;
		}
		this._outerHeight = outerHeight;
		this._colorZonesInvalid = true;
		return true;
	}

	public resolveColorZones(): ColorZone[] {
		const colorZonesInvalid = this._colorZonesInvalid;
		const lineHeight = Math.floor(this._lineHeight);
		const totalHeight = Math.floor(this.getCanvasHeight());
		const outerHeight = Math.floor(this._outerHeight);
		const heightRatio = totalHeight / outerHeight;
		const halfMinimumHeight = Math.floor(Constants.MINIMUM_HEIGHT * this._pixelRatio / 2);

		const allColorZones: ColorZone[] = [];
		for (let i = 0, len = this._zones.length; i < len; i++) {
			const zone = this._zones[i];

			if (!colorZonesInvalid) {
				const colorZone = zone.getColorZones();
				if (colorZone) {
					allColorZones.push(colorZone);
					continue;
				}
			}

			const offset1 = this._getVerticalOffsetForLine(zone.startLineNumber);
			const offset2 = (
				zone.heightInLines === 0
					? this._getVerticalOffsetForLine(zone.endLineNumber) + lineHeight
					: offset1 + zone.heightInLines * lineHeight
			);

			const y1 = Math.floor(heightRatio * offset1);
			const y2 = Math.floor(heightRatio * offset2);

			let ycenter = Math.floor((y1 + y2) / 2);
			let halfHeight = (y2 - ycenter);

			if (halfHeight < halfMinimumHeight) {
				halfHeight = halfMinimumHeight;
			}

			if (ycenter - halfHeight < 0) {
				ycenter = halfHeight;
			}
			if (ycenter + halfHeight > totalHeight) {
				ycenter = totalHeight - halfHeight;
			}

			const color = zone.color;
			let colorId = this._color2Id[color];
			if (!colorId) {
				colorId = (++this._lastAssignedId);
				this._color2Id[color] = colorId;
				this._id2Color[colorId] = color;
			}
			const colorZone = new ColorZone(ycenter - halfHeight, ycenter + halfHeight, colorId);

			zone.setColorZone(colorZone);
			allColorZones.push(colorZone);
		}

		this._colorZonesInvalid = false;

		allColorZones.sort(ColorZone.compare);
		return allColorZones;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewModel/screenReaderSimpleModel.ts]---
Location: vscode-main/src/vs/editor/common/viewModel/screenReaderSimpleModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { EndOfLinePreference } from '../model.js';

export interface ISimpleModel {
	getLineContent(lineNumber: number): string;
	getLineCount(): number;
	getLineMaxColumn(lineNumber: number): number;
	getValueInRange(range: Range, eol: EndOfLinePreference): string;
	getValueLengthInRange(range: Range, eol: EndOfLinePreference): number;
	modifyPosition(position: Position, offset: number): Position;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewModel/viewContext.ts]---
Location: vscode-main/src/vs/editor/common/viewModel/viewContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEditorConfiguration } from '../config/editorConfiguration.js';
import { ViewEventHandler } from '../viewEventHandler.js';
import { IViewLayout, IViewModel } from '../viewModel.js';
import { IColorTheme } from '../../../platform/theme/common/themeService.js';
import { EditorTheme } from '../editorTheme.js';

export class ViewContext {

	public readonly configuration: IEditorConfiguration;
	public readonly viewModel: IViewModel;
	public readonly viewLayout: IViewLayout;
	public readonly theme: EditorTheme;

	constructor(
		configuration: IEditorConfiguration,
		theme: IColorTheme,
		model: IViewModel
	) {
		this.configuration = configuration;
		this.theme = new EditorTheme(theme);
		this.viewModel = model;
		this.viewLayout = model.viewLayout;
	}

	public addEventHandler(eventHandler: ViewEventHandler): void {
		this.viewModel.addViewEventHandler(eventHandler);
	}

	public removeEventHandler(eventHandler: ViewEventHandler): void {
		this.viewModel.removeViewEventHandler(eventHandler);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewModel/viewModelDecoration.ts]---
Location: vscode-main/src/vs/editor/common/viewModel/viewModelDecoration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IModelDecoration, IModelDecorationOptions, ITextModel } from '../model.js';
import { Range } from '../core/range.js';
import { StandardTokenType } from '../encodedTokenAttributes.js';

export class ViewModelDecoration {
	_viewModelDecorationBrand: void = undefined;

	public readonly range: Range;
	public readonly options: IModelDecorationOptions;

	constructor(range: Range, options: IModelDecorationOptions) {
		this.range = range;
		this.options = options;
	}
}

export function isModelDecorationVisible(model: ITextModel, decoration: IModelDecoration): boolean {
	if (decoration.options.hideInCommentTokens && isModelDecorationInComment(model, decoration)) {
		return false;
	}

	if (decoration.options.hideInStringTokens && isModelDecorationInString(model, decoration)) {
		return false;
	}

	return true;
}

export function isModelDecorationInComment(model: ITextModel, decoration: IModelDecoration): boolean {
	return testTokensInRange(
		model,
		decoration.range,
		(tokenType) => tokenType === StandardTokenType.Comment
	);
}

export function isModelDecorationInString(model: ITextModel, decoration: IModelDecoration): boolean {
	return testTokensInRange(
		model,
		decoration.range,
		(tokenType) => tokenType === StandardTokenType.String
	);
}

/**
 * Calls the callback for every token that intersects the range.
 * If the callback returns `false`, iteration stops and `false` is returned.
 * Otherwise, `true` is returned.
 */
function testTokensInRange(model: ITextModel, range: Range, callback: (tokenType: StandardTokenType) => boolean): boolean {
	for (let lineNumber = range.startLineNumber; lineNumber <= range.endLineNumber; lineNumber++) {
		const lineTokens = model.tokenization.getLineTokens(lineNumber);
		const isFirstLine = lineNumber === range.startLineNumber;
		const isEndLine = lineNumber === range.endLineNumber;

		let tokenIdx = isFirstLine ? lineTokens.findTokenIndexAtOffset(range.startColumn - 1) : 0;
		while (tokenIdx < lineTokens.getCount()) {
			if (isEndLine) {
				const startOffset = lineTokens.getStartOffset(tokenIdx);
				if (startOffset > range.endColumn - 1) {
					break;
				}
			}

			const callbackResult = callback(lineTokens.getStandardTokenType(tokenIdx));
			if (!callbackResult) {
				return false;
			}
			tokenIdx++;
		}
	}
	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewModel/viewModelDecorations.ts]---
Location: vscode-main/src/vs/editor/common/viewModel/viewModelDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../base/common/lifecycle.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { IEditorConfiguration } from '../config/editorConfiguration.js';
import { IModelDecoration, ITextModel, PositionAffinity } from '../model.js';
import { IViewModelLines } from './viewModelLines.js';
import { filterFontDecorations, filterValidationDecorations } from '../config/editorOptions.js';
import { isModelDecorationVisible, ViewModelDecoration } from './viewModelDecoration.js';
import { InlineDecoration, InlineDecorationType } from './inlineDecorations.js';
import { ICoordinatesConverter } from '../coordinatesConverter.js';

/**
 * A collection of decorations in a range of lines.
 */
export interface IViewDecorationsCollection {
	/**
	 * decorations in the range of lines (ungrouped).
	 */
	readonly decorations: ViewModelDecoration[];
	/**
	 * inline decorations (grouped by each line in the range of lines).
	 */
	readonly inlineDecorations: InlineDecoration[][];
	/**
	 * Whether the decorations affect the fonts.
	 */
	readonly hasVariableFonts: boolean;
}

export class ViewModelDecorations implements IDisposable {

	private readonly editorId: number;
	private readonly model: ITextModel;
	private readonly configuration: IEditorConfiguration;
	private readonly _linesCollection: IViewModelLines;
	private readonly _coordinatesConverter: ICoordinatesConverter;

	private _decorationsCache: { [decorationId: string]: ViewModelDecoration };

	private _cachedModelDecorationsResolver: IViewDecorationsCollection | null;
	private _cachedModelDecorationsResolverViewRange: Range | null;

	constructor(editorId: number, model: ITextModel, configuration: IEditorConfiguration, linesCollection: IViewModelLines, coordinatesConverter: ICoordinatesConverter) {
		this.editorId = editorId;
		this.model = model;
		this.configuration = configuration;
		this._linesCollection = linesCollection;
		this._coordinatesConverter = coordinatesConverter;
		this._decorationsCache = Object.create(null);
		this._cachedModelDecorationsResolver = null;
		this._cachedModelDecorationsResolverViewRange = null;
	}

	private _clearCachedModelDecorationsResolver(): void {
		this._cachedModelDecorationsResolver = null;
		this._cachedModelDecorationsResolverViewRange = null;
	}

	public dispose(): void {
		this._decorationsCache = Object.create(null);
		this._clearCachedModelDecorationsResolver();
	}

	public reset(): void {
		this._decorationsCache = Object.create(null);
		this._clearCachedModelDecorationsResolver();
	}

	public onModelDecorationsChanged(): void {
		this._decorationsCache = Object.create(null);
		this._clearCachedModelDecorationsResolver();
	}

	public onLineMappingChanged(): void {
		this._decorationsCache = Object.create(null);

		this._clearCachedModelDecorationsResolver();
	}

	private _getOrCreateViewModelDecoration(modelDecoration: IModelDecoration): ViewModelDecoration {
		const id = modelDecoration.id;
		let r = this._decorationsCache[id];
		if (!r) {
			const modelRange = modelDecoration.range;
			const options = modelDecoration.options;
			let viewRange: Range;
			if (options.isWholeLine) {
				const start = this._coordinatesConverter.convertModelPositionToViewPosition(new Position(modelRange.startLineNumber, 1), PositionAffinity.Left, false, true);
				const end = this._coordinatesConverter.convertModelPositionToViewPosition(new Position(modelRange.endLineNumber, this.model.getLineMaxColumn(modelRange.endLineNumber)), PositionAffinity.Right);
				viewRange = new Range(start.lineNumber, start.column, end.lineNumber, end.column);
			} else {
				// For backwards compatibility reasons, we want injected text before any decoration.
				// Thus, move decorations to the right.
				viewRange = this._coordinatesConverter.convertModelRangeToViewRange(modelRange, PositionAffinity.Right);
			}
			r = new ViewModelDecoration(viewRange, options);
			this._decorationsCache[id] = r;
		}
		return r;
	}

	public getMinimapDecorationsInRange(range: Range): ViewModelDecoration[] {
		return this._getDecorationsInRange(range, true, false).decorations;
	}

	public getDecorationsViewportData(viewRange: Range): IViewDecorationsCollection {
		let cacheIsValid = (this._cachedModelDecorationsResolver !== null);
		cacheIsValid = cacheIsValid && (viewRange.equalsRange(this._cachedModelDecorationsResolverViewRange));
		if (!cacheIsValid) {
			this._cachedModelDecorationsResolver = this._getDecorationsInRange(viewRange, false, false);
			this._cachedModelDecorationsResolverViewRange = viewRange;
		}
		return this._cachedModelDecorationsResolver!;
	}

	public getDecorationsOnLine(lineNumber: number, onlyMinimapDecorations: boolean = false, onlyMarginDecorations: boolean = false): IViewDecorationsCollection {
		const range = new Range(lineNumber, this._linesCollection.getViewLineMinColumn(lineNumber), lineNumber, this._linesCollection.getViewLineMaxColumn(lineNumber));
		return this._getDecorationsInRange(range, onlyMinimapDecorations, onlyMarginDecorations);
	}

	private _getDecorationsInRange(viewRange: Range, onlyMinimapDecorations: boolean, onlyMarginDecorations: boolean): IViewDecorationsCollection {
		const modelDecorations = this._linesCollection.getDecorationsInRange(viewRange, this.editorId, filterValidationDecorations(this.configuration.options), filterFontDecorations(this.configuration.options), onlyMinimapDecorations, onlyMarginDecorations);
		const startLineNumber = viewRange.startLineNumber;
		const endLineNumber = viewRange.endLineNumber;

		const decorationsInViewport: ViewModelDecoration[] = [];
		let decorationsInViewportLen = 0;
		const inlineDecorations: InlineDecoration[][] = [];
		for (let j = startLineNumber; j <= endLineNumber; j++) {
			inlineDecorations[j - startLineNumber] = [];
		}

		let hasVariableFonts = false;
		for (let i = 0, len = modelDecorations.length; i < len; i++) {
			const modelDecoration = modelDecorations[i];
			const decorationOptions = modelDecoration.options;

			if (!isModelDecorationVisible(this.model, modelDecoration)) {
				continue;
			}

			const viewModelDecoration = this._getOrCreateViewModelDecoration(modelDecoration);
			const viewRange = viewModelDecoration.range;

			decorationsInViewport[decorationsInViewportLen++] = viewModelDecoration;

			if (decorationOptions.inlineClassName) {
				const inlineDecoration = new InlineDecoration(viewRange, decorationOptions.inlineClassName, decorationOptions.inlineClassNameAffectsLetterSpacing ? InlineDecorationType.RegularAffectingLetterSpacing : InlineDecorationType.Regular);
				const intersectedStartLineNumber = Math.max(startLineNumber, viewRange.startLineNumber);
				const intersectedEndLineNumber = Math.min(endLineNumber, viewRange.endLineNumber);
				for (let j = intersectedStartLineNumber; j <= intersectedEndLineNumber; j++) {
					inlineDecorations[j - startLineNumber].push(inlineDecoration);
				}
			}
			if (decorationOptions.beforeContentClassName) {
				if (startLineNumber <= viewRange.startLineNumber && viewRange.startLineNumber <= endLineNumber) {
					const inlineDecoration = new InlineDecoration(
						new Range(viewRange.startLineNumber, viewRange.startColumn, viewRange.startLineNumber, viewRange.startColumn),
						decorationOptions.beforeContentClassName,
						InlineDecorationType.Before
					);
					inlineDecorations[viewRange.startLineNumber - startLineNumber].push(inlineDecoration);
				}
			}
			if (decorationOptions.afterContentClassName) {
				if (startLineNumber <= viewRange.endLineNumber && viewRange.endLineNumber <= endLineNumber) {
					const inlineDecoration = new InlineDecoration(
						new Range(viewRange.endLineNumber, viewRange.endColumn, viewRange.endLineNumber, viewRange.endColumn),
						decorationOptions.afterContentClassName,
						InlineDecorationType.After
					);
					inlineDecorations[viewRange.endLineNumber - startLineNumber].push(inlineDecoration);
				}
			}
			if (decorationOptions.affectsFont) {
				hasVariableFonts = true;
			}
		}

		return {
			decorations: decorationsInViewport,
			inlineDecorations: inlineDecorations,
			hasVariableFonts
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewModel/viewModelImpl.ts]---
Location: vscode-main/src/vs/editor/common/viewModel/viewModelImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ArrayQueue } from '../../../base/common/arrays.js';
import { RunOnceScheduler } from '../../../base/common/async.js';
import { Color } from '../../../base/common/color.js';
import { Event } from '../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import * as platform from '../../../base/common/platform.js';
import * as strings from '../../../base/common/strings.js';
import { ConfigurationChangedEvent, EditorOption, filterValidationDecorations, filterFontDecorations } from '../config/editorOptions.js';
import { EDITOR_FONT_DEFAULTS } from '../config/fontInfo.js';
import { CursorsController } from '../cursor/cursor.js';
import { CursorConfiguration, CursorState, EditOperationType, IColumnSelectData, PartialCursorState } from '../cursorCommon.js';
import { CursorChangeReason } from '../cursorEvents.js';
import { IPosition, Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { ISelection, Selection } from '../core/selection.js';
import { ICommand, ICursorState, IViewState, ScrollType } from '../editorCommon.js';
import { IEditorConfiguration } from '../config/editorConfiguration.js';
import { EndOfLinePreference, IAttachedView, ICursorStateComputer, IGlyphMarginLanesModel, IIdentifiedSingleEditOperation, ITextModel, PositionAffinity, TextDirection, TrackedRangeStickiness } from '../model.js';
import { IActiveIndentGuideInfo, BracketGuideOptions, IndentGuide } from '../textModelGuides.js';
import { ModelDecorationMinimapOptions, ModelDecorationOptions, ModelDecorationOverviewRulerOptions } from '../model/textModel.js';
import * as textModelEvents from '../textModelEvents.js';
import { TokenizationRegistry } from '../languages.js';
import { ColorId } from '../encodedTokenAttributes.js';
import { ILanguageConfigurationService } from '../languages/languageConfigurationRegistry.js';
import { PLAINTEXT_LANGUAGE_ID } from '../languages/modesRegistry.js';
import { tokenizeLineToHTML } from '../languages/textToHtmlTokenizer.js';
import { EditorTheme } from '../editorTheme.js';
import * as viewEvents from '../viewEvents.js';
import { ViewLayout } from '../viewLayout/viewLayout.js';
import { MinimapTokensColorTracker } from './minimapTokensColorTracker.js';
import { ILineBreaksComputer, ILineBreaksComputerFactory, InjectedText } from '../modelLineProjectionData.js';
import { ViewEventHandler } from '../viewEventHandler.js';
import { ILineHeightChangeAccessor, IViewModel, IWhitespaceChangeAccessor, MinimapLinesRenderingData, OverviewRulerDecorationsGroup, ViewLineData, ViewLineRenderingData, ViewModelDecoration } from '../viewModel.js';
import { ViewModelDecorations } from './viewModelDecorations.js';
import { FocusChangedEvent, HiddenAreasChangedEvent, ModelContentChangedEvent, ModelDecorationsChangedEvent, ModelFontChangedEvent, ModelLanguageChangedEvent, ModelLanguageConfigurationChangedEvent, ModelLineHeightChangedEvent, ModelOptionsChangedEvent, ModelTokensChangedEvent, OutgoingViewModelEvent, ReadOnlyEditAttemptEvent, ScrollChangedEvent, ViewModelEventDispatcher, ViewModelEventsCollector, ViewZonesChangedEvent, WidgetFocusChangedEvent } from '../viewModelEventDispatcher.js';
import { IViewModelLines, ViewModelLinesFromModelAsIs, ViewModelLinesFromProjectedModel } from './viewModelLines.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';
import { GlyphMarginLanesModel } from './glyphLanesModel.js';
import { ICustomLineHeightData } from '../viewLayout/lineHeights.js';
import { TextModelEditSource } from '../textModelEditSource.js';
import { InlineDecoration } from './inlineDecorations.js';
import { ICoordinatesConverter } from '../coordinatesConverter.js';

const USE_IDENTITY_LINES_COLLECTION = true;

export class ViewModel extends Disposable implements IViewModel {

	private readonly _editorId: number;
	private readonly _configuration: IEditorConfiguration;
	public readonly model: ITextModel;
	private readonly _eventDispatcher: ViewModelEventDispatcher;
	public readonly onEvent: Event<OutgoingViewModelEvent>;
	public cursorConfig: CursorConfiguration;
	private readonly _updateConfigurationViewLineCount: RunOnceScheduler;
	private _hasFocus: boolean;
	private readonly _viewportStart: ViewportStart;
	private readonly _lines: IViewModelLines;
	public readonly coordinatesConverter: ICoordinatesConverter;
	public readonly viewLayout: ViewLayout;
	private readonly _cursor: CursorsController;
	private readonly _decorations: ViewModelDecorations;
	public readonly glyphLanes: IGlyphMarginLanesModel;

	constructor(
		editorId: number,
		configuration: IEditorConfiguration,
		model: ITextModel,
		domLineBreaksComputerFactory: ILineBreaksComputerFactory,
		monospaceLineBreaksComputerFactory: ILineBreaksComputerFactory,
		scheduleAtNextAnimationFrame: (callback: () => void) => IDisposable,
		private readonly languageConfigurationService: ILanguageConfigurationService,
		private readonly _themeService: IThemeService,
		private readonly _attachedView: IAttachedView,
		private readonly _transactionalTarget: IBatchableTarget,
	) {
		super();

		this._editorId = editorId;
		this._configuration = configuration;
		this.model = model;
		this._eventDispatcher = new ViewModelEventDispatcher();
		this.onEvent = this._eventDispatcher.onEvent;
		this.cursorConfig = new CursorConfiguration(this.model.getLanguageId(), this.model.getOptions(), this._configuration, this.languageConfigurationService);
		this._updateConfigurationViewLineCount = this._register(new RunOnceScheduler(() => this._updateConfigurationViewLineCountNow(), 0));
		this._hasFocus = false;
		this._viewportStart = ViewportStart.create(this.model);
		this.glyphLanes = new GlyphMarginLanesModel(0);

		if (USE_IDENTITY_LINES_COLLECTION && this.model.isTooLargeForTokenization()) {

			this._lines = new ViewModelLinesFromModelAsIs(this.model);

		} else {
			const options = this._configuration.options;
			const fontInfo = options.get(EditorOption.fontInfo);
			const wrappingStrategy = options.get(EditorOption.wrappingStrategy);
			const wrappingInfo = options.get(EditorOption.wrappingInfo);
			const wrappingIndent = options.get(EditorOption.wrappingIndent);
			const wordBreak = options.get(EditorOption.wordBreak);
			const wrapOnEscapedLineFeeds = options.get(EditorOption.wrapOnEscapedLineFeeds);

			this._lines = new ViewModelLinesFromProjectedModel(
				this._editorId,
				this.model,
				domLineBreaksComputerFactory,
				monospaceLineBreaksComputerFactory,
				fontInfo,
				this.model.getOptions().tabSize,
				wrappingStrategy,
				wrappingInfo.wrappingColumn,
				wrappingIndent,
				wordBreak,
				wrapOnEscapedLineFeeds
			);
		}

		this.coordinatesConverter = this._lines.createCoordinatesConverter();

		this._cursor = this._register(new CursorsController(model, this, this.coordinatesConverter, this.cursorConfig));

		this.viewLayout = this._register(new ViewLayout(this._configuration, this.getLineCount(), this._getCustomLineHeights(), scheduleAtNextAnimationFrame));

		this._register(this.viewLayout.onDidScroll((e) => {
			if (e.scrollTopChanged) {
				this._handleVisibleLinesChanged();
			}
			if (e.scrollTopChanged) {
				this._viewportStart.invalidate();
			}
			this._eventDispatcher.emitSingleViewEvent(new viewEvents.ViewScrollChangedEvent(e));
			this._eventDispatcher.emitOutgoingEvent(new ScrollChangedEvent(
				e.oldScrollWidth, e.oldScrollLeft, e.oldScrollHeight, e.oldScrollTop,
				e.scrollWidth, e.scrollLeft, e.scrollHeight, e.scrollTop
			));
		}));

		this._register(this.viewLayout.onDidContentSizeChange((e) => {
			this._eventDispatcher.emitOutgoingEvent(e);
		}));

		this._decorations = new ViewModelDecorations(this._editorId, this.model, this._configuration, this._lines, this.coordinatesConverter);

		this._registerModelEvents();

		this._register(this._configuration.onDidChangeFast((e) => {
			try {
				const eventsCollector = this._eventDispatcher.beginEmitViewEvents();
				this._onConfigurationChanged(eventsCollector, e);
			} finally {
				this._eventDispatcher.endEmitViewEvents();
			}
		}));

		this._register(MinimapTokensColorTracker.getInstance().onDidChange(() => {
			this._eventDispatcher.emitSingleViewEvent(new viewEvents.ViewTokensColorsChangedEvent());
		}));

		this._register(this._themeService.onDidColorThemeChange((theme) => {
			this._invalidateDecorationsColorCache();
			this._eventDispatcher.emitSingleViewEvent(new viewEvents.ViewThemeChangedEvent(theme));
		}));

		this._updateConfigurationViewLineCountNow();
	}

	public override dispose(): void {
		// First remove listeners, as disposing the lines might end up sending
		// model decoration changed events ... and we no longer care about them ...
		super.dispose();
		this._decorations.dispose();
		this._lines.dispose();
		this._viewportStart.dispose();
		this._eventDispatcher.dispose();
	}

	public createLineBreaksComputer(): ILineBreaksComputer {
		return this._lines.createLineBreaksComputer();
	}

	public addViewEventHandler(eventHandler: ViewEventHandler): void {
		this._eventDispatcher.addViewEventHandler(eventHandler);
	}

	public removeViewEventHandler(eventHandler: ViewEventHandler): void {
		this._eventDispatcher.removeViewEventHandler(eventHandler);
	}

	private _getCustomLineHeights(): ICustomLineHeightData[] {
		const allowVariableLineHeights = this._configuration.options.get(EditorOption.allowVariableLineHeights);
		if (!allowVariableLineHeights) {
			return [];
		}
		const decorations = this.model.getCustomLineHeightsDecorations(this._editorId);
		return decorations.map((d) => {
			const lineNumber = d.range.startLineNumber;
			const viewRange = this.coordinatesConverter.convertModelRangeToViewRange(new Range(lineNumber, 1, lineNumber, this.model.getLineMaxColumn(lineNumber)));
			return {
				decorationId: d.id,
				startLineNumber: viewRange.startLineNumber,
				endLineNumber: viewRange.endLineNumber,
				lineHeight: d.options.lineHeight || 0
			};
		});
	}

	private _updateConfigurationViewLineCountNow(): void {
		this._configuration.setViewLineCount(this._lines.getViewLineCount());
	}

	private getModelVisibleRanges(): Range[] {
		const linesViewportData = this.viewLayout.getLinesViewportData();
		const viewVisibleRange = new Range(
			linesViewportData.startLineNumber,
			this.getLineMinColumn(linesViewportData.startLineNumber),
			linesViewportData.endLineNumber,
			this.getLineMaxColumn(linesViewportData.endLineNumber)
		);
		const modelVisibleRanges = this._toModelVisibleRanges(viewVisibleRange);
		return modelVisibleRanges;
	}

	public visibleLinesStabilized(): void {
		const modelVisibleRanges = this.getModelVisibleRanges();
		this._attachedView.setVisibleLines(modelVisibleRanges, true);
	}

	private _handleVisibleLinesChanged(): void {
		const modelVisibleRanges = this.getModelVisibleRanges();
		this._attachedView.setVisibleLines(modelVisibleRanges, false);
	}

	public setHasFocus(hasFocus: boolean): void {
		this._hasFocus = hasFocus;
		this._cursor.setHasFocus(hasFocus);
		this._eventDispatcher.emitSingleViewEvent(new viewEvents.ViewFocusChangedEvent(hasFocus));
		this._eventDispatcher.emitOutgoingEvent(new FocusChangedEvent(!hasFocus, hasFocus));
	}

	public setHasWidgetFocus(hasWidgetFocus: boolean): void {
		this._eventDispatcher.emitOutgoingEvent(new WidgetFocusChangedEvent(!hasWidgetFocus, hasWidgetFocus));
	}

	public onCompositionStart(): void {
		this._eventDispatcher.emitSingleViewEvent(new viewEvents.ViewCompositionStartEvent());
	}

	public onCompositionEnd(): void {
		this._eventDispatcher.emitSingleViewEvent(new viewEvents.ViewCompositionEndEvent());
	}

	private _captureStableViewport(): StableViewport {
		// We might need to restore the current start view range, so save it (if available)
		// But only if the scroll position is not at the top of the file
		if (this._viewportStart.isValid && this.viewLayout.getCurrentScrollTop() > 0) {
			const previousViewportStartViewPosition = new Position(this._viewportStart.viewLineNumber, this.getLineMinColumn(this._viewportStart.viewLineNumber));
			const previousViewportStartModelPosition = this.coordinatesConverter.convertViewPositionToModelPosition(previousViewportStartViewPosition);
			return new StableViewport(previousViewportStartModelPosition, this._viewportStart.startLineDelta);
		}
		return new StableViewport(null, 0);
	}

	private _onConfigurationChanged(eventsCollector: ViewModelEventsCollector, e: ConfigurationChangedEvent): void {
		const stableViewport = this._captureStableViewport();
		const options = this._configuration.options;
		const fontInfo = options.get(EditorOption.fontInfo);
		const wrappingStrategy = options.get(EditorOption.wrappingStrategy);
		const wrappingInfo = options.get(EditorOption.wrappingInfo);
		const wrappingIndent = options.get(EditorOption.wrappingIndent);
		const wordBreak = options.get(EditorOption.wordBreak);

		if (this._lines.setWrappingSettings(fontInfo, wrappingStrategy, wrappingInfo.wrappingColumn, wrappingIndent, wordBreak)) {
			eventsCollector.emitViewEvent(new viewEvents.ViewFlushedEvent());
			eventsCollector.emitViewEvent(new viewEvents.ViewLineMappingChangedEvent());
			eventsCollector.emitViewEvent(new viewEvents.ViewDecorationsChangedEvent(null));
			this._cursor.onLineMappingChanged(eventsCollector);
			this._decorations.onLineMappingChanged();
			this.viewLayout.onFlushed(this.getLineCount(), this._getCustomLineHeights());

			this._updateConfigurationViewLineCount.schedule();
		}

		if (e.hasChanged(EditorOption.readOnly)) {
			// Must read again all decorations due to readOnly filtering
			this._decorations.reset();
			eventsCollector.emitViewEvent(new viewEvents.ViewDecorationsChangedEvent(null));
		}

		if (e.hasChanged(EditorOption.renderValidationDecorations)) {
			this._decorations.reset();
			eventsCollector.emitViewEvent(new viewEvents.ViewDecorationsChangedEvent(null));
		}

		eventsCollector.emitViewEvent(new viewEvents.ViewConfigurationChangedEvent(e));
		this.viewLayout.onConfigurationChanged(e);

		stableViewport.recoverViewportStart(this.coordinatesConverter, this.viewLayout);

		if (CursorConfiguration.shouldRecreate(e)) {
			this.cursorConfig = new CursorConfiguration(this.model.getLanguageId(), this.model.getOptions(), this._configuration, this.languageConfigurationService);
			this._cursor.updateConfiguration(this.cursorConfig);
		}
	}

	private _registerModelEvents(): void {

		this._register(this.model.onDidChangeContentOrInjectedText((e) => {
			try {
				const eventsCollector = this._eventDispatcher.beginEmitViewEvents();

				let hadOtherModelChange = false;
				let hadModelLineChangeThatChangedLineMapping = false;

				const changes = (e instanceof textModelEvents.InternalModelContentChangeEvent ? e.rawContentChangedEvent.changes : e.changes);
				const versionId = (e instanceof textModelEvents.InternalModelContentChangeEvent ? e.rawContentChangedEvent.versionId : null);

				// Do a first pass to compute line mappings, and a second pass to actually interpret them
				const lineBreaksComputer = this._lines.createLineBreaksComputer();
				for (const change of changes) {
					switch (change.changeType) {
						case textModelEvents.RawContentChangedType.LinesInserted: {
							for (let lineIdx = 0; lineIdx < change.detail.length; lineIdx++) {
								const line = change.detail[lineIdx];
								let injectedText = change.injectedTexts[lineIdx];
								if (injectedText) {
									injectedText = injectedText.filter(element => (!element.ownerId || element.ownerId === this._editorId));
								}
								lineBreaksComputer.addRequest(line, injectedText, null);
							}
							break;
						}
						case textModelEvents.RawContentChangedType.LineChanged: {
							let injectedText: textModelEvents.LineInjectedText[] | null = null;
							if (change.injectedText) {
								injectedText = change.injectedText.filter(element => (!element.ownerId || element.ownerId === this._editorId));
							}
							lineBreaksComputer.addRequest(change.detail, injectedText, null);
							break;
						}
					}
				}
				const lineBreaks = lineBreaksComputer.finalize();
				const lineBreakQueue = new ArrayQueue(lineBreaks);

				for (const change of changes) {
					switch (change.changeType) {
						case textModelEvents.RawContentChangedType.Flush: {
							this._lines.onModelFlushed();
							eventsCollector.emitViewEvent(new viewEvents.ViewFlushedEvent());
							this._decorations.reset();
							this.viewLayout.onFlushed(this.getLineCount(), this._getCustomLineHeights());
							hadOtherModelChange = true;
							break;
						}
						case textModelEvents.RawContentChangedType.LinesDeleted: {
							const linesDeletedEvent = this._lines.onModelLinesDeleted(versionId, change.fromLineNumber, change.toLineNumber);
							if (linesDeletedEvent !== null) {
								eventsCollector.emitViewEvent(linesDeletedEvent);
								this.viewLayout.onLinesDeleted(linesDeletedEvent.fromLineNumber, linesDeletedEvent.toLineNumber);
							}
							hadOtherModelChange = true;
							break;
						}
						case textModelEvents.RawContentChangedType.LinesInserted: {
							const insertedLineBreaks = lineBreakQueue.takeCount(change.detail.length);
							const linesInsertedEvent = this._lines.onModelLinesInserted(versionId, change.fromLineNumber, change.toLineNumber, insertedLineBreaks);
							if (linesInsertedEvent !== null) {
								eventsCollector.emitViewEvent(linesInsertedEvent);
								this.viewLayout.onLinesInserted(linesInsertedEvent.fromLineNumber, linesInsertedEvent.toLineNumber);
							}
							hadOtherModelChange = true;
							break;
						}
						case textModelEvents.RawContentChangedType.LineChanged: {
							const changedLineBreakData = lineBreakQueue.dequeue()!;
							const [lineMappingChanged, linesChangedEvent, linesInsertedEvent, linesDeletedEvent] =
								this._lines.onModelLineChanged(versionId, change.lineNumber, changedLineBreakData);
							hadModelLineChangeThatChangedLineMapping = lineMappingChanged;
							if (linesChangedEvent) {
								eventsCollector.emitViewEvent(linesChangedEvent);
							}
							if (linesInsertedEvent) {
								eventsCollector.emitViewEvent(linesInsertedEvent);
								this.viewLayout.onLinesInserted(linesInsertedEvent.fromLineNumber, linesInsertedEvent.toLineNumber);
							}
							if (linesDeletedEvent) {
								eventsCollector.emitViewEvent(linesDeletedEvent);
								this.viewLayout.onLinesDeleted(linesDeletedEvent.fromLineNumber, linesDeletedEvent.toLineNumber);
							}
							break;
						}
						case textModelEvents.RawContentChangedType.EOLChanged: {
							// Nothing to do. The new version will be accepted below
							break;
						}
					}
				}

				if (versionId !== null) {
					this._lines.acceptVersionId(versionId);
				}
				this.viewLayout.onHeightMaybeChanged();

				if (!hadOtherModelChange && hadModelLineChangeThatChangedLineMapping) {
					eventsCollector.emitViewEvent(new viewEvents.ViewLineMappingChangedEvent());
					eventsCollector.emitViewEvent(new viewEvents.ViewDecorationsChangedEvent(null));
					this._cursor.onLineMappingChanged(eventsCollector);
					this._decorations.onLineMappingChanged();
				}
			} finally {
				this._eventDispatcher.endEmitViewEvents();
			}

			// Update the configuration and reset the centered view line
			const viewportStartWasValid = this._viewportStart.isValid;
			this._viewportStart.invalidate();
			this._configuration.setModelLineCount(this.model.getLineCount());
			this._updateConfigurationViewLineCountNow();

			// Recover viewport
			if (!this._hasFocus && this.model.getAttachedEditorCount() >= 2 && viewportStartWasValid) {
				const modelRange = this.model._getTrackedRange(this._viewportStart.modelTrackedRange);
				if (modelRange) {
					const viewPosition = this.coordinatesConverter.convertModelPositionToViewPosition(modelRange.getStartPosition());
					const viewPositionTop = this.viewLayout.getVerticalOffsetForLineNumber(viewPosition.lineNumber);
					this.viewLayout.setScrollPosition({ scrollTop: viewPositionTop + this._viewportStart.startLineDelta }, ScrollType.Immediate);
				}
			}

			try {
				const eventsCollector = this._eventDispatcher.beginEmitViewEvents();
				if (e instanceof textModelEvents.InternalModelContentChangeEvent) {
					eventsCollector.emitOutgoingEvent(new ModelContentChangedEvent(e.contentChangedEvent));
				}
				this._cursor.onModelContentChanged(eventsCollector, e);
			} finally {
				this._eventDispatcher.endEmitViewEvents();
			}

			this._handleVisibleLinesChanged();
		}));

		const allowVariableLineHeights = this._configuration.options.get(EditorOption.allowVariableLineHeights);
		if (allowVariableLineHeights) {
			this._register(this.model.onDidChangeLineHeight((e) => {
				const filteredChanges = e.changes.filter((change) => change.ownerId === this._editorId || change.ownerId === 0);

				this.viewLayout.changeSpecialLineHeights((accessor: ILineHeightChangeAccessor) => {
					for (const change of filteredChanges) {
						const { decorationId, lineNumber, lineHeight } = change;
						const viewRange = this.coordinatesConverter.convertModelRangeToViewRange(new Range(lineNumber, 1, lineNumber, this.model.getLineMaxColumn(lineNumber)));
						if (lineHeight !== null) {
							accessor.insertOrChangeCustomLineHeight(decorationId, viewRange.startLineNumber, viewRange.endLineNumber, lineHeight);
						} else {
							accessor.removeCustomLineHeight(decorationId);
						}
					}
				});

				// recreate the model event using the filtered changes
				if (filteredChanges.length > 0) {
					const filteredEvent = new textModelEvents.ModelLineHeightChangedEvent(filteredChanges);
					this._eventDispatcher.emitOutgoingEvent(new ModelLineHeightChangedEvent(filteredEvent));
				}
			}));
		}

		const allowVariableFonts = this._configuration.options.get(EditorOption.effectiveAllowVariableFonts);
		if (allowVariableFonts) {
			this._register(this.model.onDidChangeFont((e) => {
				const filteredChanges = e.changes.filter((change) => change.ownerId === this._editorId || change.ownerId === 0);
				// recreate the model event using the filtered changes
				if (filteredChanges.length > 0) {
					const filteredEvent = new textModelEvents.ModelFontChangedEvent(filteredChanges);
					this._eventDispatcher.emitOutgoingEvent(new ModelFontChangedEvent(filteredEvent));
				}
			}));
		}

		this._register(this.model.onDidChangeTokens((e) => {
			const viewRanges: { fromLineNumber: number; toLineNumber: number }[] = [];
			for (let j = 0, lenJ = e.ranges.length; j < lenJ; j++) {
				const modelRange = e.ranges[j];
				const viewStartLineNumber = this.coordinatesConverter.convertModelPositionToViewPosition(new Position(modelRange.fromLineNumber, 1)).lineNumber;
				const viewEndLineNumber = this.coordinatesConverter.convertModelPositionToViewPosition(new Position(modelRange.toLineNumber, this.model.getLineMaxColumn(modelRange.toLineNumber))).lineNumber;
				viewRanges[j] = {
					fromLineNumber: viewStartLineNumber,
					toLineNumber: viewEndLineNumber
				};
			}
			this._eventDispatcher.emitSingleViewEvent(new viewEvents.ViewTokensChangedEvent(viewRanges));
			this._eventDispatcher.emitOutgoingEvent(new ModelTokensChangedEvent(e));
		}));

		this._register(this.model.onDidChangeLanguageConfiguration((e) => {
			this._eventDispatcher.emitSingleViewEvent(new viewEvents.ViewLanguageConfigurationEvent());
			this.cursorConfig = new CursorConfiguration(this.model.getLanguageId(), this.model.getOptions(), this._configuration, this.languageConfigurationService);
			this._cursor.updateConfiguration(this.cursorConfig);
			this._eventDispatcher.emitOutgoingEvent(new ModelLanguageConfigurationChangedEvent(e));
		}));

		this._register(this.model.onDidChangeLanguage((e) => {
			this.cursorConfig = new CursorConfiguration(this.model.getLanguageId(), this.model.getOptions(), this._configuration, this.languageConfigurationService);
			this._cursor.updateConfiguration(this.cursorConfig);
			this._eventDispatcher.emitOutgoingEvent(new ModelLanguageChangedEvent(e));
		}));

		this._register(this.model.onDidChangeOptions((e) => {
			// A tab size change causes a line mapping changed event => all view parts will repaint OK, no further event needed here
			if (this._lines.setTabSize(this.model.getOptions().tabSize)) {
				try {
					const eventsCollector = this._eventDispatcher.beginEmitViewEvents();
					eventsCollector.emitViewEvent(new viewEvents.ViewFlushedEvent());
					eventsCollector.emitViewEvent(new viewEvents.ViewLineMappingChangedEvent());
					eventsCollector.emitViewEvent(new viewEvents.ViewDecorationsChangedEvent(null));
					this._cursor.onLineMappingChanged(eventsCollector);
					this._decorations.onLineMappingChanged();
					this.viewLayout.onFlushed(this.getLineCount(), this._getCustomLineHeights());
				} finally {
					this._eventDispatcher.endEmitViewEvents();
				}
				this._updateConfigurationViewLineCount.schedule();
			}

			this.cursorConfig = new CursorConfiguration(this.model.getLanguageId(), this.model.getOptions(), this._configuration, this.languageConfigurationService);
			this._cursor.updateConfiguration(this.cursorConfig);

			this._eventDispatcher.emitOutgoingEvent(new ModelOptionsChangedEvent(e));
		}));

		this._register(this.model.onDidChangeDecorations((e) => {
			this._decorations.onModelDecorationsChanged();
			this._eventDispatcher.emitSingleViewEvent(new viewEvents.ViewDecorationsChangedEvent(e));
			this._eventDispatcher.emitOutgoingEvent(new ModelDecorationsChangedEvent(e));
		}));
	}

	private readonly hiddenAreasModel = new HiddenAreasModel();
	private previousHiddenAreas: readonly Range[] = [];

	public getFontSizeAtPosition(position: IPosition): string | null {
		const allowVariableFonts = this._configuration.options.get(EditorOption.effectiveAllowVariableFonts);
		if (!allowVariableFonts) {
			return null;
		}
		const fontDecorations = this.model.getFontDecorationsInRange(Range.fromPositions(position), this._editorId);
		let fontSize: string = this._configuration.options.get(EditorOption.fontInfo).fontSize + 'px';
		for (const fontDecoration of fontDecorations) {
			if (fontDecoration.options.fontSize) {
				fontSize = fontDecoration.options.fontSize;
				break;
			}
		}
		return fontSize;
	}

	/**
	 * @param forceUpdate If true, the hidden areas will be updated even if the new ranges are the same as the previous ranges.
	 * This is because the model might have changed, which resets the hidden areas, but not the last cached value.
	 * This needs a better fix in the future.
	*/
	public setHiddenAreas(ranges: Range[], source?: unknown, forceUpdate?: boolean): void {
		this.hiddenAreasModel.setHiddenAreas(source, ranges);
		const mergedRanges = this.hiddenAreasModel.getMergedRanges();
		if (mergedRanges === this.previousHiddenAreas && !forceUpdate) {
			return;
		}

		this.previousHiddenAreas = mergedRanges;

		const stableViewport = this._captureStableViewport();

		let lineMappingChanged = false;
		try {
			const eventsCollector = this._eventDispatcher.beginEmitViewEvents();
			lineMappingChanged = this._lines.setHiddenAreas(mergedRanges);
			if (lineMappingChanged) {
				eventsCollector.emitViewEvent(new viewEvents.ViewFlushedEvent());
				eventsCollector.emitViewEvent(new viewEvents.ViewLineMappingChangedEvent());
				eventsCollector.emitViewEvent(new viewEvents.ViewDecorationsChangedEvent(null));
				this._cursor.onLineMappingChanged(eventsCollector);
				this._decorations.onLineMappingChanged();
				this.viewLayout.onFlushed(this.getLineCount(), this._getCustomLineHeights());
				this.viewLayout.onHeightMaybeChanged();
			}

			const firstModelLineInViewPort = stableViewport.viewportStartModelPosition?.lineNumber;
			const firstModelLineIsHidden = firstModelLineInViewPort && mergedRanges.some(range => range.startLineNumber <= firstModelLineInViewPort && firstModelLineInViewPort <= range.endLineNumber);
			if (!firstModelLineIsHidden) {
				stableViewport.recoverViewportStart(this.coordinatesConverter, this.viewLayout);
			}
		} finally {
			this._eventDispatcher.endEmitViewEvents();
		}
		this._updateConfigurationViewLineCount.schedule();

		if (lineMappingChanged) {
			this._eventDispatcher.emitOutgoingEvent(new HiddenAreasChangedEvent());
		}
	}

	public getVisibleRangesPlusViewportAboveBelow(): Range[] {
		const layoutInfo = this._configuration.options.get(EditorOption.layoutInfo);
		const lineHeight = this._configuration.options.get(EditorOption.lineHeight);
		const linesAround = Math.max(20, Math.round(layoutInfo.height / lineHeight));
		const partialData = this.viewLayout.getLinesViewportData();
		const startViewLineNumber = Math.max(1, partialData.completelyVisibleStartLineNumber - linesAround);
		const endViewLineNumber = Math.min(this.getLineCount(), partialData.completelyVisibleEndLineNumber + linesAround);

		return this._toModelVisibleRanges(new Range(
			startViewLineNumber, this.getLineMinColumn(startViewLineNumber),
			endViewLineNumber, this.getLineMaxColumn(endViewLineNumber)
		));
	}

	public getVisibleRanges(): Range[] {
		const visibleViewRange = this.getCompletelyVisibleViewRange();
		return this._toModelVisibleRanges(visibleViewRange);
	}

	public getHiddenAreas(): Range[] {
		return this._lines.getHiddenAreas();
	}

	private _toModelVisibleRanges(visibleViewRange: Range): Range[] {
		const visibleRange = this.coordinatesConverter.convertViewRangeToModelRange(visibleViewRange);
		const hiddenAreas = this._lines.getHiddenAreas();

		if (hiddenAreas.length === 0) {
			return [visibleRange];
		}

		const result: Range[] = [];
		let resultLen = 0;
		let startLineNumber = visibleRange.startLineNumber;
		let startColumn = visibleRange.startColumn;
		const endLineNumber = visibleRange.endLineNumber;
		const endColumn = visibleRange.endColumn;
		for (let i = 0, len = hiddenAreas.length; i < len; i++) {
			const hiddenStartLineNumber = hiddenAreas[i].startLineNumber;
			const hiddenEndLineNumber = hiddenAreas[i].endLineNumber;

			if (hiddenEndLineNumber < startLineNumber) {
				continue;
			}
			if (hiddenStartLineNumber > endLineNumber) {
				continue;
			}

			if (startLineNumber < hiddenStartLineNumber) {
				result[resultLen++] = new Range(
					startLineNumber, startColumn,
					hiddenStartLineNumber - 1, this.model.getLineMaxColumn(hiddenStartLineNumber - 1)
				);
			}
			startLineNumber = hiddenEndLineNumber + 1;
			startColumn = 1;
		}

		if (startLineNumber < endLineNumber || (startLineNumber === endLineNumber && startColumn < endColumn)) {
			result[resultLen++] = new Range(
				startLineNumber, startColumn,
				endLineNumber, endColumn
			);
		}

		return result;
	}

	public getCompletelyVisibleViewRange(): Range {
		const partialData = this.viewLayout.getLinesViewportData();
		const startViewLineNumber = partialData.completelyVisibleStartLineNumber;
		const endViewLineNumber = partialData.completelyVisibleEndLineNumber;

		return new Range(
			startViewLineNumber, this.getLineMinColumn(startViewLineNumber),
			endViewLineNumber, this.getLineMaxColumn(endViewLineNumber)
		);
	}

	public getCompletelyVisibleViewRangeAtScrollTop(scrollTop: number): Range {
		const partialData = this.viewLayout.getLinesViewportDataAtScrollTop(scrollTop);
		const startViewLineNumber = partialData.completelyVisibleStartLineNumber;
		const endViewLineNumber = partialData.completelyVisibleEndLineNumber;

		return new Range(
			startViewLineNumber, this.getLineMinColumn(startViewLineNumber),
			endViewLineNumber, this.getLineMaxColumn(endViewLineNumber)
		);
	}

	public saveState(): IViewState {
		const compatViewState = this.viewLayout.saveState();

		const scrollTop = compatViewState.scrollTop;
		const firstViewLineNumber = this.viewLayout.getLineNumberAtVerticalOffset(scrollTop);
		const firstPosition = this.coordinatesConverter.convertViewPositionToModelPosition(new Position(firstViewLineNumber, this.getLineMinColumn(firstViewLineNumber)));
		const firstPositionDeltaTop = this.viewLayout.getVerticalOffsetForLineNumber(firstViewLineNumber) - scrollTop;

		return {
			scrollLeft: compatViewState.scrollLeft,
			firstPosition: firstPosition,
			firstPositionDeltaTop: firstPositionDeltaTop
		};
	}

	public reduceRestoreState(state: IViewState): { scrollLeft: number; scrollTop: number } {
		if (typeof state.firstPosition === 'undefined') {
			// This is a view state serialized by an older version
			return this._reduceRestoreStateCompatibility(state);
		}

		const modelPosition = this.model.validatePosition(state.firstPosition);
		const viewPosition = this.coordinatesConverter.convertModelPositionToViewPosition(modelPosition);
		const scrollTop = this.viewLayout.getVerticalOffsetForLineNumber(viewPosition.lineNumber) - state.firstPositionDeltaTop;
		return {
			scrollLeft: state.scrollLeft,
			scrollTop: scrollTop
		};
	}

	private _reduceRestoreStateCompatibility(state: IViewState): { scrollLeft: number; scrollTop: number } {
		return {
			scrollLeft: state.scrollLeft,
			scrollTop: state.scrollTopWithoutViewZones!
		};
	}

	private getTabSize(): number {
		return this.model.getOptions().tabSize;
	}

	public getLineCount(): number {
		return this._lines.getViewLineCount();
	}

	/**
	 * Gives a hint that a lot of requests are about to come in for these line numbers.
	 */
	public setViewport(startLineNumber: number, endLineNumber: number, centeredLineNumber: number): void {
		this._viewportStart.update(this, startLineNumber);
	}

	public getActiveIndentGuide(lineNumber: number, minLineNumber: number, maxLineNumber: number): IActiveIndentGuideInfo {
		return this._lines.getActiveIndentGuide(lineNumber, minLineNumber, maxLineNumber);
	}

	public getLinesIndentGuides(startLineNumber: number, endLineNumber: number): number[] {
		return this._lines.getViewLinesIndentGuides(startLineNumber, endLineNumber);
	}

	public getBracketGuidesInRangeByLine(startLineNumber: number, endLineNumber: number, activePosition: IPosition | null, options: BracketGuideOptions): IndentGuide[][] {
		return this._lines.getViewLinesBracketGuides(startLineNumber, endLineNumber, activePosition, options);
	}

	public getLineContent(lineNumber: number): string {
		return this._lines.getViewLineContent(lineNumber);
	}

	public getLineLength(lineNumber: number): number {
		return this._lines.getViewLineLength(lineNumber);
	}

	public getLineMinColumn(lineNumber: number): number {
		return this._lines.getViewLineMinColumn(lineNumber);
	}

	public getLineMaxColumn(lineNumber: number): number {
		return this._lines.getViewLineMaxColumn(lineNumber);
	}

	public getLineFirstNonWhitespaceColumn(lineNumber: number): number {
		const result = strings.firstNonWhitespaceIndex(this.getLineContent(lineNumber));
		if (result === -1) {
			return 0;
		}
		return result + 1;
	}

	public getLineLastNonWhitespaceColumn(lineNumber: number): number {
		const result = strings.lastNonWhitespaceIndex(this.getLineContent(lineNumber));
		if (result === -1) {
			return 0;
		}
		return result + 2;
	}

	public getMinimapDecorationsInRange(range: Range): ViewModelDecoration[] {
		return this._decorations.getMinimapDecorationsInRange(range);
	}

	public getDecorationsInViewport(visibleRange: Range): ViewModelDecoration[] {
		return this._decorations.getDecorationsViewportData(visibleRange).decorations;
	}

	public getInjectedTextAt(viewPosition: Position): InjectedText | null {
		return this._lines.getInjectedTextAt(viewPosition);
	}

	private _getTextDirection(lineNumber: number, decorations: ViewModelDecoration[]): TextDirection {
		let rtlCount = 0;

		for (const decoration of decorations) {
			const range = decoration.range;
			if (range.startLineNumber > lineNumber || range.endLineNumber < lineNumber) {
				continue;
			}
			const textDirection = decoration.options.textDirection;
			if (textDirection === TextDirection.RTL) {
				rtlCount++;
			} else if (textDirection === TextDirection.LTR) {
				rtlCount--;
			}
		}

		return rtlCount > 0 ? TextDirection.RTL : TextDirection.LTR;
	}

	public getTextDirection(lineNumber: number): TextDirection {
		const decorationsCollection = this._decorations.getDecorationsOnLine(lineNumber);
		return this._getTextDirection(lineNumber, decorationsCollection.decorations);
	}

	public getViewportViewLineRenderingData(visibleRange: Range, lineNumber: number): ViewLineRenderingData {
		const viewportDecorationsCollection = this._decorations.getDecorationsViewportData(visibleRange);
		const inlineDecorations = viewportDecorationsCollection.inlineDecorations[lineNumber - visibleRange.startLineNumber];
		return this._getViewLineRenderingData(lineNumber, inlineDecorations, viewportDecorationsCollection.hasVariableFonts, viewportDecorationsCollection.decorations);
	}

	public getViewLineRenderingData(lineNumber: number): ViewLineRenderingData {
		const decorationsCollection = this._decorations.getDecorationsOnLine(lineNumber);
		return this._getViewLineRenderingData(lineNumber, decorationsCollection.inlineDecorations[0], decorationsCollection.hasVariableFonts, decorationsCollection.decorations);
	}

	private _getViewLineRenderingData(lineNumber: number, inlineDecorations: InlineDecoration[], hasVariableFonts: boolean, decorations: ViewModelDecoration[]): ViewLineRenderingData {
		const mightContainRTL = this.model.mightContainRTL();
		const mightContainNonBasicASCII = this.model.mightContainNonBasicASCII();
		const tabSize = this.getTabSize();
		const lineData = this._lines.getViewLineData(lineNumber);

		if (lineData.inlineDecorations) {
			inlineDecorations = [
				...inlineDecorations,
				...lineData.inlineDecorations.map(d =>
					d.toInlineDecoration(lineNumber)
				)
			];
		}

		return new ViewLineRenderingData(
			lineData.minColumn,
			lineData.maxColumn,
			lineData.content,
			lineData.continuesWithWrappedLine,
			mightContainRTL,
			mightContainNonBasicASCII,
			lineData.tokens,
			inlineDecorations,
			tabSize,
			lineData.startVisibleColumn,
			this._getTextDirection(lineNumber, decorations),
			hasVariableFonts
		);
	}

	public getViewLineData(lineNumber: number): ViewLineData {
		return this._lines.getViewLineData(lineNumber);
	}

	public getMinimapLinesRenderingData(startLineNumber: number, endLineNumber: number, needed: boolean[]): MinimapLinesRenderingData {
		const result = this._lines.getViewLinesData(startLineNumber, endLineNumber, needed);
		return new MinimapLinesRenderingData(
			this.getTabSize(),
			result
		);
	}

	public getAllOverviewRulerDecorations(theme: EditorTheme): OverviewRulerDecorationsGroup[] {
		const decorations = this.model.getOverviewRulerDecorations(this._editorId, filterValidationDecorations(this._configuration.options), filterFontDecorations(this._configuration.options));
		const result = new OverviewRulerDecorations();
		for (const decoration of decorations) {
			const decorationOptions = <ModelDecorationOptions>decoration.options;
			const opts = decorationOptions.overviewRuler;
			if (!opts) {
				continue;
			}
			const lane = <number>opts.position;
			if (lane === 0) {
				continue;
			}
			const color = opts.getColor(theme.value);
			const viewStartLineNumber = this.coordinatesConverter.getViewLineNumberOfModelPosition(decoration.range.startLineNumber, decoration.range.startColumn);
			const viewEndLineNumber = this.coordinatesConverter.getViewLineNumberOfModelPosition(decoration.range.endLineNumber, decoration.range.endColumn);

			result.accept(color, decorationOptions.zIndex, viewStartLineNumber, viewEndLineNumber, lane);
		}
		return result.asArray;
	}

	private _invalidateDecorationsColorCache(): void {
		const decorations = this.model.getOverviewRulerDecorations();
		for (const decoration of decorations) {
			const opts1 = <ModelDecorationOverviewRulerOptions>decoration.options.overviewRuler;
			opts1?.invalidateCachedColor();
			const opts2 = <ModelDecorationMinimapOptions>decoration.options.minimap;
			opts2?.invalidateCachedColor();
		}
	}

	public getValueInRange(range: Range, eol: EndOfLinePreference): string {
		const modelRange = this.coordinatesConverter.convertViewRangeToModelRange(range);
		return this.model.getValueInRange(modelRange, eol);
	}

	public getValueLengthInRange(range: Range, eol: EndOfLinePreference): number {
		const modelRange = this.coordinatesConverter.convertViewRangeToModelRange(range);
		return this.model.getValueLengthInRange(modelRange, eol);
	}

	public modifyPosition(position: Position, offset: number): Position {
		const modelPosition = this.coordinatesConverter.convertViewPositionToModelPosition(position);
		const resultModelPosition = this.model.modifyPosition(modelPosition, offset);
		return this.coordinatesConverter.convertModelPositionToViewPosition(resultModelPosition);
	}

	public deduceModelPositionRelativeToViewPosition(viewAnchorPosition: Position, deltaOffset: number, lineFeedCnt: number): Position {
		const modelAnchor = this.coordinatesConverter.convertViewPositionToModelPosition(viewAnchorPosition);
		if (this.model.getEOL().length === 2) {
			// This model uses CRLF, so the delta must take that into account
			if (deltaOffset < 0) {
				deltaOffset -= lineFeedCnt;
			} else {
				deltaOffset += lineFeedCnt;
			}
		}

		const modelAnchorOffset = this.model.getOffsetAt(modelAnchor);
		const resultOffset = modelAnchorOffset + deltaOffset;
		return this.model.getPositionAt(resultOffset);
	}

	public getPlainTextToCopy(modelRanges: Range[], emptySelectionClipboard: boolean, forceCRLF: boolean): string | string[] {
		const newLineCharacter = forceCRLF ? '\r\n' : this.model.getEOL();

		modelRanges = modelRanges.slice(0);
		modelRanges.sort(Range.compareRangesUsingStarts);

		let hasEmptyRange = false;
		let hasNonEmptyRange = false;
		for (const range of modelRanges) {
			if (range.isEmpty()) {
				hasEmptyRange = true;
			} else {
				hasNonEmptyRange = true;
			}
		}

		if (!hasNonEmptyRange && !emptySelectionClipboard) {
			// all ranges are empty
			return '';
		}

		if (hasEmptyRange && emptySelectionClipboard) {
			// some (maybe all) empty selections
			const result: string[] = [];
			let prevModelLineNumber = 0;
			for (const modelRange of modelRanges) {
				const modelLineNumber = modelRange.startLineNumber;
				if (modelRange.isEmpty()) {
					if (modelLineNumber !== prevModelLineNumber) {
						result.push(this.model.getLineContent(modelLineNumber) + newLineCharacter);
					}
				} else {
					result.push(this.model.getValueInRange(modelRange, forceCRLF ? EndOfLinePreference.CRLF : EndOfLinePreference.TextDefined));
				}
				prevModelLineNumber = modelLineNumber;
			}
			return result.length === 1 ? result[0] : result;
		}

		const result: string[] = [];
		for (const modelRange of modelRanges) {
			if (!modelRange.isEmpty()) {
				result.push(this.model.getValueInRange(modelRange, forceCRLF ? EndOfLinePreference.CRLF : EndOfLinePreference.TextDefined));
			}
		}
		return result.length === 1 ? result[0] : result;
	}

	public getRichTextToCopy(modelRanges: Range[], emptySelectionClipboard: boolean): { html: string; mode: string } | null {
		const languageId = this.model.getLanguageId();
		if (languageId === PLAINTEXT_LANGUAGE_ID) {
			return null;
		}

		if (modelRanges.length !== 1) {
			// no multiple selection support at this time
			return null;
		}

		let range = modelRanges[0];
		if (range.isEmpty()) {
			if (!emptySelectionClipboard) {
				// nothing to copy
				return null;
			}
			const lineNumber = range.startLineNumber;
			range = new Range(lineNumber, this.model.getLineMinColumn(lineNumber), lineNumber, this.model.getLineMaxColumn(lineNumber));
		}

		const fontInfo = this._configuration.options.get(EditorOption.fontInfo);
		const colorMap = this._getColorMap();
		const hasBadChars = (/[:;\\\/<>]/.test(fontInfo.fontFamily));
		const useDefaultFontFamily = (hasBadChars || fontInfo.fontFamily === EDITOR_FONT_DEFAULTS.fontFamily);
		let fontFamily: string;
		if (useDefaultFontFamily) {
			fontFamily = EDITOR_FONT_DEFAULTS.fontFamily;
		} else {
			fontFamily = fontInfo.fontFamily;
			fontFamily = fontFamily.replace(/"/g, '\'');
			const hasQuotesOrIsList = /[,']/.test(fontFamily);
			if (!hasQuotesOrIsList) {
				const needsQuotes = /[+ ]/.test(fontFamily);
				if (needsQuotes) {
					fontFamily = `'${fontFamily}'`;
				}
			}
			fontFamily = `${fontFamily}, ${EDITOR_FONT_DEFAULTS.fontFamily}`;
		}

		return {
			mode: languageId,
			html: (
				`<div style="`
				+ `color: ${colorMap[ColorId.DefaultForeground]};`
				+ `background-color: ${colorMap[ColorId.DefaultBackground]};`
				+ `font-family: ${fontFamily};`
				+ `font-weight: ${fontInfo.fontWeight};`
				+ `font-size: ${fontInfo.fontSize}px;`
				+ `line-height: ${fontInfo.lineHeight}px;`
				+ `white-space: pre;`
				+ `">`
				+ this._getHTMLToCopy(range, colorMap)
				+ '</div>'
			)
		};
	}

	private _getHTMLToCopy(modelRange: Range, colorMap: string[]): string {
		const startLineNumber = modelRange.startLineNumber;
		const startColumn = modelRange.startColumn;
		const endLineNumber = modelRange.endLineNumber;
		const endColumn = modelRange.endColumn;

		const tabSize = this.getTabSize();

		let result = '';

		for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
			const lineTokens = this.model.tokenization.getLineTokens(lineNumber);
			const lineContent = lineTokens.getLineContent();
			const startOffset = (lineNumber === startLineNumber ? startColumn - 1 : 0);
			const endOffset = (lineNumber === endLineNumber ? endColumn - 1 : lineContent.length);

			if (lineContent === '') {
				result += '<br>';
			} else {
				result += tokenizeLineToHTML(lineContent, lineTokens.inflate(), colorMap, startOffset, endOffset, tabSize, platform.isWindows);
			}
		}

		return result;
	}

	private _getColorMap(): string[] {
		const colorMap = TokenizationRegistry.getColorMap();
		const result: string[] = ['#000000'];
		if (colorMap) {
			for (let i = 1, len = colorMap.length; i < len; i++) {
				result[i] = Color.Format.CSS.formatHex(colorMap[i]);
			}
		}
		return result;
	}

	//#region cursor operations

	public getPrimaryCursorState(): CursorState {
		return this._cursor.getPrimaryCursorState();
	}
	public getLastAddedCursorIndex(): number {
		return this._cursor.getLastAddedCursorIndex();
	}
	public getCursorStates(): CursorState[] {
		return this._cursor.getCursorStates();
	}
	public setCursorStates(source: string | null | undefined, reason: CursorChangeReason, states: PartialCursorState[] | null): boolean {
		return this._withViewEventsCollector(eventsCollector => this._cursor.setStates(eventsCollector, source, reason, states));
	}
	public getCursorColumnSelectData(): IColumnSelectData {
		return this._cursor.getCursorColumnSelectData();
	}
	public getCursorAutoClosedCharacters(): Range[] {
		return this._cursor.getAutoClosedCharacters();
	}
	public setCursorColumnSelectData(columnSelectData: IColumnSelectData): void {
		this._cursor.setCursorColumnSelectData(columnSelectData);
	}
	public getPrevEditOperationType(): EditOperationType {
		return this._cursor.getPrevEditOperationType();
	}
	public setPrevEditOperationType(type: EditOperationType): void {
		this._cursor.setPrevEditOperationType(type);
	}
	public getSelection(): Selection {
		return this._cursor.getSelection();
	}
	public getSelections(): Selection[] {
		return this._cursor.getSelections();
	}
	public getPosition(): Position {
		return this._cursor.getPrimaryCursorState().modelState.position;
	}
	public setSelections(source: string | null | undefined, selections: readonly ISelection[], reason = CursorChangeReason.NotSet): void {
		this._withViewEventsCollector(eventsCollector => this._cursor.setSelections(eventsCollector, source, selections, reason));
	}
	public saveCursorState(): ICursorState[] {
		return this._cursor.saveState();
	}
	public restoreCursorState(states: ICursorState[]): void {
		this._withViewEventsCollector(eventsCollector => this._cursor.restoreState(eventsCollector, states));
	}

	private _executeCursorEdit(callback: (eventsCollector: ViewModelEventsCollector) => void): void {
		if (this._cursor.context.cursorConfig.readOnly) {
			// we cannot edit when read only...
			this._eventDispatcher.emitOutgoingEvent(new ReadOnlyEditAttemptEvent());
			return;
		}
		this._withViewEventsCollector(callback);
	}
	public executeEdits(source: string | null | undefined, edits: IIdentifiedSingleEditOperation[], cursorStateComputer: ICursorStateComputer, reason: TextModelEditSource): void {
		this._executeCursorEdit(eventsCollector => this._cursor.executeEdits(eventsCollector, source, edits, cursorStateComputer, reason));
	}
	public startComposition(): void {
		this._executeCursorEdit(eventsCollector => this._cursor.startComposition(eventsCollector));
	}
	public endComposition(source?: string | null | undefined): void {
		this._executeCursorEdit(eventsCollector => this._cursor.endComposition(eventsCollector, source));
	}
	public type(text: string, source?: string | null | undefined): void {
		this._executeCursorEdit(eventsCollector => this._cursor.type(eventsCollector, text, source));
	}
	public compositionType(text: string, replacePrevCharCnt: number, replaceNextCharCnt: number, positionDelta: number, source?: string | null | undefined): void {
		this._executeCursorEdit(eventsCollector => this._cursor.compositionType(eventsCollector, text, replacePrevCharCnt, replaceNextCharCnt, positionDelta, source));
	}
	public paste(text: string, pasteOnNewLine: boolean, multicursorText?: string[] | null | undefined, source?: string | null | undefined): void {
		this._executeCursorEdit(eventsCollector => this._cursor.paste(eventsCollector, text, pasteOnNewLine, multicursorText, source));
	}
	public cut(source?: string | null | undefined): void {
		this._executeCursorEdit(eventsCollector => this._cursor.cut(eventsCollector, source));
	}
	public executeCommand(command: ICommand, source?: string | null | undefined): void {
		this._executeCursorEdit(eventsCollector => this._cursor.executeCommand(eventsCollector, command, source));
	}
	public executeCommands(commands: ICommand[], source?: string | null | undefined): void {
		this._executeCursorEdit(eventsCollector => this._cursor.executeCommands(eventsCollector, commands, source));
	}
	public revealAllCursors(source: string | null | undefined, revealHorizontal: boolean, minimalReveal: boolean = false): void {
		this._withViewEventsCollector(eventsCollector => this._cursor.revealAll(eventsCollector, source, minimalReveal, viewEvents.VerticalRevealType.Simple, revealHorizontal, ScrollType.Smooth));
	}
	public revealPrimaryCursor(source: string | null | undefined, revealHorizontal: boolean, minimalReveal: boolean = false): void {
		this._withViewEventsCollector(eventsCollector => this._cursor.revealPrimary(eventsCollector, source, minimalReveal, viewEvents.VerticalRevealType.Simple, revealHorizontal, ScrollType.Smooth));
	}
	public revealTopMostCursor(source: string | null | undefined): void {
		const viewPosition = this._cursor.getTopMostViewPosition();
		const viewRange = new Range(viewPosition.lineNumber, viewPosition.column, viewPosition.lineNumber, viewPosition.column);
		this._withViewEventsCollector(eventsCollector => eventsCollector.emitViewEvent(new viewEvents.ViewRevealRangeRequestEvent(source, false, viewRange, null, viewEvents.VerticalRevealType.Simple, true, ScrollType.Smooth)));
	}
	public revealBottomMostCursor(source: string | null | undefined): void {
		const viewPosition = this._cursor.getBottomMostViewPosition();
		const viewRange = new Range(viewPosition.lineNumber, viewPosition.column, viewPosition.lineNumber, viewPosition.column);
		this._withViewEventsCollector(eventsCollector => eventsCollector.emitViewEvent(new viewEvents.ViewRevealRangeRequestEvent(source, false, viewRange, null, viewEvents.VerticalRevealType.Simple, true, ScrollType.Smooth)));
	}
	public revealRange(source: string | null | undefined, revealHorizontal: boolean, viewRange: Range, verticalType: viewEvents.VerticalRevealType, scrollType: ScrollType): void {
		this._withViewEventsCollector(eventsCollector => eventsCollector.emitViewEvent(new viewEvents.ViewRevealRangeRequestEvent(source, false, viewRange, null, verticalType, revealHorizontal, scrollType)));
	}

	//#endregion

	//#region viewLayout
	public changeWhitespace(callback: (accessor: IWhitespaceChangeAccessor) => void): void {
		const hadAChange = this.viewLayout.changeWhitespace(callback);
		if (hadAChange) {
			this._eventDispatcher.emitSingleViewEvent(new viewEvents.ViewZonesChangedEvent());
			this._eventDispatcher.emitOutgoingEvent(new ViewZonesChangedEvent());
		}
	}
	//#endregion

	private _withViewEventsCollector<T>(callback: (eventsCollector: ViewModelEventsCollector) => T): T {
		return this._transactionalTarget.batchChanges(() => {
			try {
				const eventsCollector = this._eventDispatcher.beginEmitViewEvents();
				return callback(eventsCollector);
			} finally {
				this._eventDispatcher.endEmitViewEvents();
			}
		});
	}

	public batchEvents(callback: () => void): void {
		this._withViewEventsCollector(() => { callback(); });
	}

	normalizePosition(position: Position, affinity: PositionAffinity): Position {
		return this._lines.normalizePosition(position, affinity);
	}

	/**
	 * Gets the column at which indentation stops at a given line.
	 * @internal
	*/
	getLineIndentColumn(lineNumber: number): number {
		return this._lines.getLineIndentColumn(lineNumber);
	}
}

export interface IBatchableTarget {
	/**
	 * Allows the target to apply the changes introduced by the callback in a batch.
	*/
	batchChanges<T>(cb: () => T): T;
}

class ViewportStart implements IDisposable {

	public static create(model: ITextModel): ViewportStart {
		const viewportStartLineTrackedRange = model._setTrackedRange(null, new Range(1, 1, 1, 1), TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges);
		return new ViewportStart(model, 1, false, viewportStartLineTrackedRange, 0);
	}

	public get viewLineNumber(): number {
		return this._viewLineNumber;
	}

	public get isValid(): boolean {
		return this._isValid;
	}

	public get modelTrackedRange(): string {
		return this._modelTrackedRange;
	}

	public get startLineDelta(): number {
		return this._startLineDelta;
	}

	private constructor(
		private readonly _model: ITextModel,
		private _viewLineNumber: number,
		private _isValid: boolean,
		private _modelTrackedRange: string,
		private _startLineDelta: number,
	) { }

	public dispose(): void {
		this._model._setTrackedRange(this._modelTrackedRange, null, TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges);
	}

	public update(viewModel: IViewModel, startLineNumber: number): void {
		const position = viewModel.coordinatesConverter.convertViewPositionToModelPosition(new Position(startLineNumber, viewModel.getLineMinColumn(startLineNumber)));
		const viewportStartLineTrackedRange = viewModel.model._setTrackedRange(this._modelTrackedRange, new Range(position.lineNumber, position.column, position.lineNumber, position.column), TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges);
		const viewportStartLineTop = viewModel.viewLayout.getVerticalOffsetForLineNumber(startLineNumber);
		const scrollTop = viewModel.viewLayout.getCurrentScrollTop();

		this._viewLineNumber = startLineNumber;
		this._isValid = true;
		this._modelTrackedRange = viewportStartLineTrackedRange;
		this._startLineDelta = scrollTop - viewportStartLineTop;
	}

	public invalidate(): void {
		this._isValid = false;
	}
}

class OverviewRulerDecorations {

	private readonly _asMap: { [color: string]: OverviewRulerDecorationsGroup } = Object.create(null);
	readonly asArray: OverviewRulerDecorationsGroup[] = [];

	public accept(color: string, zIndex: number, startLineNumber: number, endLineNumber: number, lane: number): void {
		const prevGroup = this._asMap[color];

		if (prevGroup) {
			const prevData = prevGroup.data;
			const prevLane = prevData[prevData.length - 3];
			const prevEndLineNumber = prevData[prevData.length - 1];
			if (prevLane === lane && prevEndLineNumber + 1 >= startLineNumber) {
				// merge into prev
				if (endLineNumber > prevEndLineNumber) {
					prevData[prevData.length - 1] = endLineNumber;
				}
				return;
			}

			// push
			prevData.push(lane, startLineNumber, endLineNumber);
		} else {
			const group = new OverviewRulerDecorationsGroup(color, zIndex, [lane, startLineNumber, endLineNumber]);
			this._asMap[color] = group;
			this.asArray.push(group);
		}
	}
}

class HiddenAreasModel {
	private readonly hiddenAreas = new Map<unknown, Range[]>();
	private shouldRecompute = false;
	private ranges: Range[] = [];

	setHiddenAreas(source: unknown, ranges: Range[]): void {
		const existing = this.hiddenAreas.get(source);
		if (existing && rangeArraysEqual(existing, ranges)) {
			return;
		}
		this.hiddenAreas.set(source, ranges);
		this.shouldRecompute = true;
	}

	/**
	 * The returned array is immutable.
	*/
	getMergedRanges(): readonly Range[] {
		if (!this.shouldRecompute) {
			return this.ranges;
		}
		this.shouldRecompute = false;
		const newRanges = Array.from(this.hiddenAreas.values()).reduce((r, hiddenAreas) => mergeLineRangeArray(r, hiddenAreas), []);
		if (rangeArraysEqual(this.ranges, newRanges)) {
			return this.ranges;
		}
		this.ranges = newRanges;
		return this.ranges;
	}
}

function mergeLineRangeArray(arr1: Range[], arr2: Range[]): Range[] {
	const result: Range[] = [];
	let i = 0;
	let j = 0;
	while (i < arr1.length && j < arr2.length) {
		const item1 = arr1[i];
		const item2 = arr2[j];

		if (item1.endLineNumber < item2.startLineNumber - 1) {
			result.push(arr1[i++]);
		} else if (item2.endLineNumber < item1.startLineNumber - 1) {
			result.push(arr2[j++]);
		} else {
			const startLineNumber = Math.min(item1.startLineNumber, item2.startLineNumber);
			const endLineNumber = Math.max(item1.endLineNumber, item2.endLineNumber);
			result.push(new Range(startLineNumber, 1, endLineNumber, 1));
			i++;
			j++;
		}
	}
	while (i < arr1.length) {
		result.push(arr1[i++]);
	}
	while (j < arr2.length) {
		result.push(arr2[j++]);
	}
	return result;
}

function rangeArraysEqual(arr1: Range[], arr2: Range[]): boolean {
	if (arr1.length !== arr2.length) {
		return false;
	}
	for (let i = 0; i < arr1.length; i++) {
		if (!arr1[i].equalsRange(arr2[i])) {
			return false;
		}
	}
	return true;
}

/**
 * Maintain a stable viewport by trying to keep the first line in the viewport constant.
 */
class StableViewport {
	constructor(
		public readonly viewportStartModelPosition: Position | null,
		public readonly startLineDelta: number
	) { }

	public recoverViewportStart(coordinatesConverter: ICoordinatesConverter, viewLayout: ViewLayout): void {
		if (!this.viewportStartModelPosition) {
			return;
		}
		const viewPosition = coordinatesConverter.convertModelPositionToViewPosition(this.viewportStartModelPosition);
		const viewPositionTop = viewLayout.getVerticalOffsetForLineNumber(viewPosition.lineNumber);
		viewLayout.setScrollPosition({ scrollTop: viewPositionTop + this.startLineDelta }, ScrollType.Immediate);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewModel/viewModelLines.ts]---
Location: vscode-main/src/vs/editor/common/viewModel/viewModelLines.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from '../../../base/common/arrays.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { WrappingIndent } from '../config/editorOptions.js';
import { FontInfo } from '../config/fontInfo.js';
import { IPosition, Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { IModelDecoration, IModelDeltaDecoration, ITextModel, PositionAffinity } from '../model.js';
import { IActiveIndentGuideInfo, BracketGuideOptions, IndentGuide, IndentGuideHorizontalLine } from '../textModelGuides.js';
import { ModelDecorationOptions } from '../model/textModel.js';
import { LineInjectedText } from '../textModelEvents.js';
import * as viewEvents from '../viewEvents.js';
import { createModelLineProjection, IModelLineProjection } from './modelLineProjection.js';
import { ILineBreaksComputer, ModelLineProjectionData, InjectedText, ILineBreaksComputerFactory } from '../modelLineProjectionData.js';
import { ConstantTimePrefixSumComputer } from '../model/prefixSumComputer.js';
import { ViewLineData } from '../viewModel.js';
import { ICoordinatesConverter, IdentityCoordinatesConverter } from '../coordinatesConverter.js';

export interface IViewModelLines extends IDisposable {
	createCoordinatesConverter(): ICoordinatesConverter;

	setWrappingSettings(fontInfo: FontInfo, wrappingStrategy: 'simple' | 'advanced', wrappingColumn: number, wrappingIndent: WrappingIndent, wordBreak: 'normal' | 'keepAll'): boolean;
	setTabSize(newTabSize: number): boolean;
	getHiddenAreas(): Range[];
	setHiddenAreas(_ranges: readonly Range[]): boolean;

	createLineBreaksComputer(): ILineBreaksComputer;
	onModelFlushed(): void;
	onModelLinesDeleted(versionId: number | null, fromLineNumber: number, toLineNumber: number): viewEvents.ViewLinesDeletedEvent | null;
	onModelLinesInserted(versionId: number | null, fromLineNumber: number, toLineNumber: number, lineBreaks: (ModelLineProjectionData | null)[]): viewEvents.ViewLinesInsertedEvent | null;
	onModelLineChanged(versionId: number | null, lineNumber: number, lineBreakData: ModelLineProjectionData | null): [boolean, viewEvents.ViewLinesChangedEvent | null, viewEvents.ViewLinesInsertedEvent | null, viewEvents.ViewLinesDeletedEvent | null];
	acceptVersionId(versionId: number): void;

	getViewLineCount(): number;
	getActiveIndentGuide(viewLineNumber: number, minLineNumber: number, maxLineNumber: number): IActiveIndentGuideInfo;
	getViewLinesIndentGuides(viewStartLineNumber: number, viewEndLineNumber: number): number[];
	getViewLinesBracketGuides(startLineNumber: number, endLineNumber: number, activePosition: IPosition | null, options: BracketGuideOptions): IndentGuide[][];
	getViewLineContent(viewLineNumber: number): string;
	getViewLineLength(viewLineNumber: number): number;
	getViewLineMinColumn(viewLineNumber: number): number;
	getViewLineMaxColumn(viewLineNumber: number): number;
	getViewLineData(viewLineNumber: number): ViewLineData;
	getViewLinesData(viewStartLineNumber: number, viewEndLineNumber: number, needed: boolean[]): Array<ViewLineData | null>;

	getDecorationsInRange(range: Range, ownerId: number, filterOutValidation: boolean, filterFontDecorations: boolean, onlyMinimapDecorations: boolean, onlyMarginDecorations: boolean): IModelDecoration[];

	getInjectedTextAt(viewPosition: Position): InjectedText | null;

	normalizePosition(position: Position, affinity: PositionAffinity): Position;
	/**
	 * Gets the column at which indentation stops at a given line.
	 * @internal
	*/
	getLineIndentColumn(lineNumber: number): number;
}

export class ViewModelLinesFromProjectedModel implements IViewModelLines {
	private readonly _editorId: number;
	private readonly model: ITextModel;
	private _validModelVersionId: number;

	private readonly _domLineBreaksComputerFactory: ILineBreaksComputerFactory;
	private readonly _monospaceLineBreaksComputerFactory: ILineBreaksComputerFactory;

	private fontInfo: FontInfo;
	private tabSize: number;
	private wrappingColumn: number;
	private wrappingIndent: WrappingIndent;
	private wordBreak: 'normal' | 'keepAll';
	private wrappingStrategy: 'simple' | 'advanced';
	private wrapOnEscapedLineFeeds: boolean;

	private modelLineProjections!: IModelLineProjection[];

	/**
	 * Reflects the sum of the line counts of all projected model lines.
	*/
	private projectedModelLineLineCounts!: ConstantTimePrefixSumComputer;

	private hiddenAreasDecorationIds!: string[];

	constructor(
		editorId: number,
		model: ITextModel,
		domLineBreaksComputerFactory: ILineBreaksComputerFactory,
		monospaceLineBreaksComputerFactory: ILineBreaksComputerFactory,
		fontInfo: FontInfo,
		tabSize: number,
		wrappingStrategy: 'simple' | 'advanced',
		wrappingColumn: number,
		wrappingIndent: WrappingIndent,
		wordBreak: 'normal' | 'keepAll',
		wrapOnEscapedLineFeeds: boolean
	) {
		this._editorId = editorId;
		this.model = model;
		this._validModelVersionId = -1;
		this._domLineBreaksComputerFactory = domLineBreaksComputerFactory;
		this._monospaceLineBreaksComputerFactory = monospaceLineBreaksComputerFactory;
		this.fontInfo = fontInfo;
		this.tabSize = tabSize;
		this.wrappingStrategy = wrappingStrategy;
		this.wrappingColumn = wrappingColumn;
		this.wrappingIndent = wrappingIndent;
		this.wordBreak = wordBreak;
		this.wrapOnEscapedLineFeeds = wrapOnEscapedLineFeeds;

		this._constructLines(/*resetHiddenAreas*/true, null);
	}

	public dispose(): void {
		this.hiddenAreasDecorationIds = this.model.deltaDecorations(this.hiddenAreasDecorationIds, []);
	}

	public createCoordinatesConverter(): ICoordinatesConverter {
		return new CoordinatesConverter(this);
	}

	private _constructLines(resetHiddenAreas: boolean, previousLineBreaks: ((ModelLineProjectionData | null)[]) | null): void {
		this.modelLineProjections = [];

		if (resetHiddenAreas) {
			this.hiddenAreasDecorationIds = this.model.deltaDecorations(this.hiddenAreasDecorationIds, []);
		}

		const linesContent = this.model.getLinesContent();
		const injectedTextDecorations = this.model.getInjectedTextDecorations(this._editorId);
		const lineCount = linesContent.length;
		const lineBreaksComputer = this.createLineBreaksComputer();

		const injectedTextQueue = new arrays.ArrayQueue(LineInjectedText.fromDecorations(injectedTextDecorations));
		for (let i = 0; i < lineCount; i++) {
			const lineInjectedText = injectedTextQueue.takeWhile(t => t.lineNumber === i + 1);
			lineBreaksComputer.addRequest(linesContent[i], lineInjectedText, previousLineBreaks ? previousLineBreaks[i] : null);
		}
		const linesBreaks = lineBreaksComputer.finalize();

		const values: number[] = [];

		const hiddenAreas = this.hiddenAreasDecorationIds.map((areaId) => this.model.getDecorationRange(areaId)!).sort(Range.compareRangesUsingStarts);
		let hiddenAreaStart = 1, hiddenAreaEnd = 0;
		let hiddenAreaIdx = -1;
		let nextLineNumberToUpdateHiddenArea = (hiddenAreaIdx + 1 < hiddenAreas.length) ? hiddenAreaEnd + 1 : lineCount + 2;

		for (let i = 0; i < lineCount; i++) {
			const lineNumber = i + 1;

			if (lineNumber === nextLineNumberToUpdateHiddenArea) {
				hiddenAreaIdx++;
				hiddenAreaStart = hiddenAreas[hiddenAreaIdx].startLineNumber;
				hiddenAreaEnd = hiddenAreas[hiddenAreaIdx].endLineNumber;
				nextLineNumberToUpdateHiddenArea = (hiddenAreaIdx + 1 < hiddenAreas.length) ? hiddenAreaEnd + 1 : lineCount + 2;
			}

			const isInHiddenArea = (lineNumber >= hiddenAreaStart && lineNumber <= hiddenAreaEnd);
			const line = createModelLineProjection(linesBreaks[i], !isInHiddenArea);
			values[i] = line.getViewLineCount();
			this.modelLineProjections[i] = line;
		}

		this._validModelVersionId = this.model.getVersionId();

		this.projectedModelLineLineCounts = new ConstantTimePrefixSumComputer(values);
	}

	public getHiddenAreas(): Range[] {
		return this.hiddenAreasDecorationIds.map(
			(decId) => this.model.getDecorationRange(decId)!
		);
	}

	public setHiddenAreas(_ranges: Range[]): boolean {
		const validatedRanges = _ranges.map(r => this.model.validateRange(r));
		const newRanges = normalizeLineRanges(validatedRanges);

		// TODO@Martin: Please stop calling this method on each model change!

		// This checks if there really was a change
		const oldRanges = this.hiddenAreasDecorationIds.map((areaId) => this.model.getDecorationRange(areaId)!).sort(Range.compareRangesUsingStarts);
		if (newRanges.length === oldRanges.length) {
			let hasDifference = false;
			for (let i = 0; i < newRanges.length; i++) {
				if (!newRanges[i].equalsRange(oldRanges[i])) {
					hasDifference = true;
					break;
				}
			}
			if (!hasDifference) {
				return false;
			}
		}

		const newDecorations = newRanges.map<IModelDeltaDecoration>(
			(r) =>
			({
				range: r,
				options: ModelDecorationOptions.EMPTY,
			})
		);

		this.hiddenAreasDecorationIds = this.model.deltaDecorations(this.hiddenAreasDecorationIds, newDecorations);

		const hiddenAreas = newRanges;
		let hiddenAreaStart = 1, hiddenAreaEnd = 0;
		let hiddenAreaIdx = -1;
		let nextLineNumberToUpdateHiddenArea = (hiddenAreaIdx + 1 < hiddenAreas.length) ? hiddenAreaEnd + 1 : this.modelLineProjections.length + 2;

		let hasVisibleLine = false;
		for (let i = 0; i < this.modelLineProjections.length; i++) {
			const lineNumber = i + 1;

			if (lineNumber === nextLineNumberToUpdateHiddenArea) {
				hiddenAreaIdx++;
				hiddenAreaStart = hiddenAreas[hiddenAreaIdx].startLineNumber;
				hiddenAreaEnd = hiddenAreas[hiddenAreaIdx].endLineNumber;
				nextLineNumberToUpdateHiddenArea = (hiddenAreaIdx + 1 < hiddenAreas.length) ? hiddenAreaEnd + 1 : this.modelLineProjections.length + 2;
			}

			let lineChanged = false;
			if (lineNumber >= hiddenAreaStart && lineNumber <= hiddenAreaEnd) {
				// Line should be hidden
				if (this.modelLineProjections[i].isVisible()) {
					this.modelLineProjections[i] = this.modelLineProjections[i].setVisible(false);
					lineChanged = true;
				}
			} else {
				hasVisibleLine = true;
				// Line should be visible
				if (!this.modelLineProjections[i].isVisible()) {
					this.modelLineProjections[i] = this.modelLineProjections[i].setVisible(true);
					lineChanged = true;
				}
			}
			if (lineChanged) {
				const newOutputLineCount = this.modelLineProjections[i].getViewLineCount();
				this.projectedModelLineLineCounts.setValue(i, newOutputLineCount);
			}
		}

		if (!hasVisibleLine) {
			// Cannot have everything be hidden => reveal everything!
			this.setHiddenAreas([]);
		}

		return true;
	}

	public modelPositionIsVisible(modelLineNumber: number, _modelColumn: number): boolean {
		if (modelLineNumber < 1 || modelLineNumber > this.modelLineProjections.length) {
			// invalid arguments
			return false;
		}
		return this.modelLineProjections[modelLineNumber - 1].isVisible();
	}

	public getModelLineViewLineCount(modelLineNumber: number): number {
		if (modelLineNumber < 1 || modelLineNumber > this.modelLineProjections.length) {
			// invalid arguments
			return 1;
		}
		return this.modelLineProjections[modelLineNumber - 1].getViewLineCount();
	}

	public setTabSize(newTabSize: number): boolean {
		if (this.tabSize === newTabSize) {
			return false;
		}
		this.tabSize = newTabSize;

		this._constructLines(/*resetHiddenAreas*/false, null);

		return true;
	}

	public setWrappingSettings(fontInfo: FontInfo, wrappingStrategy: 'simple' | 'advanced', wrappingColumn: number, wrappingIndent: WrappingIndent, wordBreak: 'normal' | 'keepAll'): boolean {
		const equalFontInfo = this.fontInfo.equals(fontInfo);
		const equalWrappingStrategy = (this.wrappingStrategy === wrappingStrategy);
		const equalWrappingColumn = (this.wrappingColumn === wrappingColumn);
		const equalWrappingIndent = (this.wrappingIndent === wrappingIndent);
		const equalWordBreak = (this.wordBreak === wordBreak);
		if (equalFontInfo && equalWrappingStrategy && equalWrappingColumn && equalWrappingIndent && equalWordBreak) {
			return false;
		}

		const onlyWrappingColumnChanged = (equalFontInfo && equalWrappingStrategy && !equalWrappingColumn && equalWrappingIndent && equalWordBreak);

		this.fontInfo = fontInfo;
		this.wrappingStrategy = wrappingStrategy;
		this.wrappingColumn = wrappingColumn;
		this.wrappingIndent = wrappingIndent;
		this.wordBreak = wordBreak;

		let previousLineBreaks: ((ModelLineProjectionData | null)[]) | null = null;
		if (onlyWrappingColumnChanged) {
			previousLineBreaks = [];
			for (let i = 0, len = this.modelLineProjections.length; i < len; i++) {
				previousLineBreaks[i] = this.modelLineProjections[i].getProjectionData();
			}
		}

		this._constructLines(/*resetHiddenAreas*/false, previousLineBreaks);

		return true;
	}

	public createLineBreaksComputer(): ILineBreaksComputer {
		const lineBreaksComputerFactory = (
			this.wrappingStrategy === 'advanced'
				? this._domLineBreaksComputerFactory
				: this._monospaceLineBreaksComputerFactory
		);
		return lineBreaksComputerFactory.createLineBreaksComputer(this.fontInfo, this.tabSize, this.wrappingColumn, this.wrappingIndent, this.wordBreak, this.wrapOnEscapedLineFeeds);
	}

	public onModelFlushed(): void {
		this._constructLines(/*resetHiddenAreas*/true, null);
	}

	public onModelLinesDeleted(versionId: number | null, fromLineNumber: number, toLineNumber: number): viewEvents.ViewLinesDeletedEvent | null {
		if (!versionId || versionId <= this._validModelVersionId) {
			// Here we check for versionId in case the lines were reconstructed in the meantime.
			// We don't want to apply stale change events on top of a newer read model state.
			return null;
		}

		const outputFromLineNumber = (fromLineNumber === 1 ? 1 : this.projectedModelLineLineCounts.getPrefixSum(fromLineNumber - 1) + 1);
		const outputToLineNumber = this.projectedModelLineLineCounts.getPrefixSum(toLineNumber);

		this.modelLineProjections.splice(fromLineNumber - 1, toLineNumber - fromLineNumber + 1);
		this.projectedModelLineLineCounts.removeValues(fromLineNumber - 1, toLineNumber - fromLineNumber + 1);

		return new viewEvents.ViewLinesDeletedEvent(outputFromLineNumber, outputToLineNumber);
	}

	public onModelLinesInserted(versionId: number | null, fromLineNumber: number, _toLineNumber: number, lineBreaks: (ModelLineProjectionData | null)[]): viewEvents.ViewLinesInsertedEvent | null {
		if (!versionId || versionId <= this._validModelVersionId) {
			// Here we check for versionId in case the lines were reconstructed in the meantime.
			// We don't want to apply stale change events on top of a newer read model state.
			return null;
		}

		// cannot use this.getHiddenAreas() because those decorations have already seen the effect of this model change
		const isInHiddenArea = (fromLineNumber > 2 && !this.modelLineProjections[fromLineNumber - 2].isVisible());

		const outputFromLineNumber = (fromLineNumber === 1 ? 1 : this.projectedModelLineLineCounts.getPrefixSum(fromLineNumber - 1) + 1);

		let totalOutputLineCount = 0;
		const insertLines: IModelLineProjection[] = [];
		const insertPrefixSumValues: number[] = [];

		for (let i = 0, len = lineBreaks.length; i < len; i++) {
			const line = createModelLineProjection(lineBreaks[i], !isInHiddenArea);
			insertLines.push(line);

			const outputLineCount = line.getViewLineCount();
			totalOutputLineCount += outputLineCount;
			insertPrefixSumValues[i] = outputLineCount;
		}

		// TODO@Alex: use arrays.arrayInsert
		this.modelLineProjections =
			this.modelLineProjections.slice(0, fromLineNumber - 1)
				.concat(insertLines)
				.concat(this.modelLineProjections.slice(fromLineNumber - 1));

		this.projectedModelLineLineCounts.insertValues(fromLineNumber - 1, insertPrefixSumValues);

		return new viewEvents.ViewLinesInsertedEvent(outputFromLineNumber, outputFromLineNumber + totalOutputLineCount - 1);
	}

	public onModelLineChanged(versionId: number | null, lineNumber: number, lineBreakData: ModelLineProjectionData | null): [boolean, viewEvents.ViewLinesChangedEvent | null, viewEvents.ViewLinesInsertedEvent | null, viewEvents.ViewLinesDeletedEvent | null] {
		if (versionId !== null && versionId <= this._validModelVersionId) {
			// Here we check for versionId in case the lines were reconstructed in the meantime.
			// We don't want to apply stale change events on top of a newer read model state.
			return [false, null, null, null];
		}

		const lineIndex = lineNumber - 1;

		const oldOutputLineCount = this.modelLineProjections[lineIndex].getViewLineCount();
		const isVisible = this.modelLineProjections[lineIndex].isVisible();
		const line = createModelLineProjection(lineBreakData, isVisible);
		this.modelLineProjections[lineIndex] = line;
		const newOutputLineCount = this.modelLineProjections[lineIndex].getViewLineCount();

		let lineMappingChanged = false;
		let changeFrom = 0;
		let changeTo = -1;
		let insertFrom = 0;
		let insertTo = -1;
		let deleteFrom = 0;
		let deleteTo = -1;

		if (oldOutputLineCount > newOutputLineCount) {
			changeFrom = this.projectedModelLineLineCounts.getPrefixSum(lineNumber - 1) + 1;
			changeTo = changeFrom + newOutputLineCount - 1;
			deleteFrom = changeTo + 1;
			deleteTo = deleteFrom + (oldOutputLineCount - newOutputLineCount) - 1;
			lineMappingChanged = true;
		} else if (oldOutputLineCount < newOutputLineCount) {
			changeFrom = this.projectedModelLineLineCounts.getPrefixSum(lineNumber - 1) + 1;
			changeTo = changeFrom + oldOutputLineCount - 1;
			insertFrom = changeTo + 1;
			insertTo = insertFrom + (newOutputLineCount - oldOutputLineCount) - 1;
			lineMappingChanged = true;
		} else {
			changeFrom = this.projectedModelLineLineCounts.getPrefixSum(lineNumber - 1) + 1;
			changeTo = changeFrom + newOutputLineCount - 1;
		}

		this.projectedModelLineLineCounts.setValue(lineIndex, newOutputLineCount);

		const viewLinesChangedEvent = (changeFrom <= changeTo ? new viewEvents.ViewLinesChangedEvent(changeFrom, changeTo - changeFrom + 1) : null);
		const viewLinesInsertedEvent = (insertFrom <= insertTo ? new viewEvents.ViewLinesInsertedEvent(insertFrom, insertTo) : null);
		const viewLinesDeletedEvent = (deleteFrom <= deleteTo ? new viewEvents.ViewLinesDeletedEvent(deleteFrom, deleteTo) : null);

		return [lineMappingChanged, viewLinesChangedEvent, viewLinesInsertedEvent, viewLinesDeletedEvent];
	}

	public acceptVersionId(versionId: number): void {
		this._validModelVersionId = versionId;
		if (this.modelLineProjections.length === 1 && !this.modelLineProjections[0].isVisible()) {
			// At least one line must be visible => reset hidden areas
			this.setHiddenAreas([]);
		}
	}

	public getViewLineCount(): number {
		return this.projectedModelLineLineCounts.getTotalSum();
	}

	private _toValidViewLineNumber(viewLineNumber: number): number {
		if (viewLineNumber < 1) {
			return 1;
		}
		const viewLineCount = this.getViewLineCount();
		if (viewLineNumber > viewLineCount) {
			return viewLineCount;
		}
		return viewLineNumber | 0;
	}

	public getActiveIndentGuide(viewLineNumber: number, minLineNumber: number, maxLineNumber: number): IActiveIndentGuideInfo {
		viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
		minLineNumber = this._toValidViewLineNumber(minLineNumber);
		maxLineNumber = this._toValidViewLineNumber(maxLineNumber);

		const modelPosition = this.convertViewPositionToModelPosition(viewLineNumber, this.getViewLineMinColumn(viewLineNumber));
		const modelMinPosition = this.convertViewPositionToModelPosition(minLineNumber, this.getViewLineMinColumn(minLineNumber));
		const modelMaxPosition = this.convertViewPositionToModelPosition(maxLineNumber, this.getViewLineMinColumn(maxLineNumber));
		const result = this.model.guides.getActiveIndentGuide(modelPosition.lineNumber, modelMinPosition.lineNumber, modelMaxPosition.lineNumber);

		const viewStartPosition = this.convertModelPositionToViewPosition(result.startLineNumber, 1);
		const viewEndPosition = this.convertModelPositionToViewPosition(result.endLineNumber, this.model.getLineMaxColumn(result.endLineNumber));
		return {
			startLineNumber: viewStartPosition.lineNumber,
			endLineNumber: viewEndPosition.lineNumber,
			indent: result.indent
		};
	}

	// #region ViewLineInfo

	private getViewLineInfo(viewLineNumber: number): ViewLineInfo {
		viewLineNumber = this._toValidViewLineNumber(viewLineNumber);
		const r = this.projectedModelLineLineCounts.getIndexOf(viewLineNumber - 1);
		const lineIndex = r.index;
		const remainder = r.remainder;
		return new ViewLineInfo(lineIndex + 1, remainder);
	}

	private getMinColumnOfViewLine(viewLineInfo: ViewLineInfo): number {
		return this.modelLineProjections[viewLineInfo.modelLineNumber - 1].getViewLineMinColumn(
			this.model,
			viewLineInfo.modelLineNumber,
			viewLineInfo.modelLineWrappedLineIdx
		);
	}

	private getMaxColumnOfViewLine(viewLineInfo: ViewLineInfo): number {
		return this.modelLineProjections[viewLineInfo.modelLineNumber - 1].getViewLineMaxColumn(
			this.model,
			viewLineInfo.modelLineNumber,
			viewLineInfo.modelLineWrappedLineIdx
		);
	}

	private getModelStartPositionOfViewLine(viewLineInfo: ViewLineInfo): Position {
		const line = this.modelLineProjections[viewLineInfo.modelLineNumber - 1];
		const minViewColumn = line.getViewLineMinColumn(
			this.model,
			viewLineInfo.modelLineNumber,
			viewLineInfo.modelLineWrappedLineIdx
		);
		const column = line.getModelColumnOfViewPosition(
			viewLineInfo.modelLineWrappedLineIdx,
			minViewColumn
		);
		return new Position(viewLineInfo.modelLineNumber, column);
	}

	private getModelEndPositionOfViewLine(viewLineInfo: ViewLineInfo): Position {
		const line = this.modelLineProjections[viewLineInfo.modelLineNumber - 1];
		const maxViewColumn = line.getViewLineMaxColumn(
			this.model,
			viewLineInfo.modelLineNumber,
			viewLineInfo.modelLineWrappedLineIdx
		);
		const column = line.getModelColumnOfViewPosition(
			viewLineInfo.modelLineWrappedLineIdx,
			maxViewColumn
		);
		return new Position(viewLineInfo.modelLineNumber, column);
	}

	private getViewLineInfosGroupedByModelRanges(viewStartLineNumber: number, viewEndLineNumber: number): ViewLineInfoGroupedByModelRange[] {
		const startViewLine = this.getViewLineInfo(viewStartLineNumber);
		const endViewLine = this.getViewLineInfo(viewEndLineNumber);

		const result = new Array<ViewLineInfoGroupedByModelRange>();
		let lastVisibleModelPos: Position | null = this.getModelStartPositionOfViewLine(startViewLine);
		let viewLines = new Array<ViewLineInfo>();

		for (let curModelLine = startViewLine.modelLineNumber; curModelLine <= endViewLine.modelLineNumber; curModelLine++) {
			const line = this.modelLineProjections[curModelLine - 1];

			if (line.isVisible()) {
				const startOffset =
					curModelLine === startViewLine.modelLineNumber
						? startViewLine.modelLineWrappedLineIdx
						: 0;

				const endOffset =
					curModelLine === endViewLine.modelLineNumber
						? endViewLine.modelLineWrappedLineIdx + 1
						: line.getViewLineCount();

				for (let i = startOffset; i < endOffset; i++) {
					viewLines.push(new ViewLineInfo(curModelLine, i));
				}
			}

			if (!line.isVisible() && lastVisibleModelPos) {
				const lastVisibleModelPos2 = new Position(curModelLine - 1, this.model.getLineMaxColumn(curModelLine - 1) + 1);

				const modelRange = Range.fromPositions(lastVisibleModelPos, lastVisibleModelPos2);
				result.push(new ViewLineInfoGroupedByModelRange(modelRange, viewLines));
				viewLines = [];

				lastVisibleModelPos = null;
			} else if (line.isVisible() && !lastVisibleModelPos) {
				lastVisibleModelPos = new Position(curModelLine, 1);
			}
		}

		if (lastVisibleModelPos) {
			const modelRange = Range.fromPositions(lastVisibleModelPos, this.getModelEndPositionOfViewLine(endViewLine));
			result.push(new ViewLineInfoGroupedByModelRange(modelRange, viewLines));
		}

		return result;
	}

	// #endregion

	public getViewLinesBracketGuides(viewStartLineNumber: number, viewEndLineNumber: number, activeViewPosition: IPosition | null, options: BracketGuideOptions): IndentGuide[][] {
		const modelActivePosition = activeViewPosition ? this.convertViewPositionToModelPosition(activeViewPosition.lineNumber, activeViewPosition.column) : null;
		const resultPerViewLine: IndentGuide[][] = [];

		for (const group of this.getViewLineInfosGroupedByModelRanges(viewStartLineNumber, viewEndLineNumber)) {
			const modelRangeStartLineNumber = group.modelRange.startLineNumber;

			const bracketGuidesPerModelLine = this.model.guides.getLinesBracketGuides(
				modelRangeStartLineNumber,
				group.modelRange.endLineNumber,
				modelActivePosition,
				options
			);

			for (const viewLineInfo of group.viewLines) {

				const bracketGuides = bracketGuidesPerModelLine[viewLineInfo.modelLineNumber - modelRangeStartLineNumber];

				// visibleColumns stay as they are (this is a bug and needs to be fixed, but it is not a regression)
				// model-columns must be converted to view-model columns.
				const result = bracketGuides.map(g => {
					if (g.forWrappedLinesAfterColumn !== -1) {
						const p = this.modelLineProjections[viewLineInfo.modelLineNumber - 1].getViewPositionOfModelPosition(0, g.forWrappedLinesAfterColumn);
						if (p.lineNumber >= viewLineInfo.modelLineWrappedLineIdx) {
							return undefined;
						}
					}

					if (g.forWrappedLinesBeforeOrAtColumn !== -1) {
						const p = this.modelLineProjections[viewLineInfo.modelLineNumber - 1].getViewPositionOfModelPosition(0, g.forWrappedLinesBeforeOrAtColumn);
						if (p.lineNumber < viewLineInfo.modelLineWrappedLineIdx) {
							return undefined;
						}
					}

					if (!g.horizontalLine) {
						return g;
					}

					let column = -1;
					if (g.column !== -1) {
						const p = this.modelLineProjections[viewLineInfo.modelLineNumber - 1].getViewPositionOfModelPosition(0, g.column);
						if (p.lineNumber === viewLineInfo.modelLineWrappedLineIdx) {
							column = p.column;
						} else if (p.lineNumber < viewLineInfo.modelLineWrappedLineIdx) {
							column = this.getMinColumnOfViewLine(viewLineInfo);
						} else if (p.lineNumber > viewLineInfo.modelLineWrappedLineIdx) {
							return undefined;
						}
					}

					const viewPosition = this.convertModelPositionToViewPosition(viewLineInfo.modelLineNumber, g.horizontalLine.endColumn);
					const p = this.modelLineProjections[viewLineInfo.modelLineNumber - 1].getViewPositionOfModelPosition(0, g.horizontalLine.endColumn);
					if (p.lineNumber === viewLineInfo.modelLineWrappedLineIdx) {
						return new IndentGuide(g.visibleColumn, column, g.className,
							new IndentGuideHorizontalLine(g.horizontalLine.top,
								viewPosition.column),
							-1,
							-1,
						);
					} else if (p.lineNumber < viewLineInfo.modelLineWrappedLineIdx) {
						return undefined;
					} else {
						if (g.visibleColumn !== -1) {
							// Don't repeat horizontal lines that use visibleColumn for unrelated lines.
							return undefined;
						}
						return new IndentGuide(g.visibleColumn, column, g.className,
							new IndentGuideHorizontalLine(g.horizontalLine.top,
								this.getMaxColumnOfViewLine(viewLineInfo)
							),
							-1,
							-1,
						);
					}
				});
				resultPerViewLine.push(result.filter((r): r is IndentGuide => !!r));

			}
		}

		return resultPerViewLine;
	}

	public getViewLinesIndentGuides(viewStartLineNumber: number, viewEndLineNumber: number): number[] {
		// TODO: Use the same code as in `getViewLinesBracketGuides`.
		// Future TODO: Merge with `getViewLinesBracketGuides`.
		// However, this requires more refactoring of indent guides.
		viewStartLineNumber = this._toValidViewLineNumber(viewStartLineNumber);
		viewEndLineNumber = this._toValidViewLineNumber(viewEndLineNumber);

		const modelStart = this.convertViewPositionToModelPosition(viewStartLineNumber, this.getViewLineMinColumn(viewStartLineNumber));
		const modelEnd = this.convertViewPositionToModelPosition(viewEndLineNumber, this.getViewLineMaxColumn(viewEndLineNumber));

		let result: number[] = [];
		const resultRepeatCount: number[] = [];
		const resultRepeatOption: IndentGuideRepeatOption[] = [];
		const modelStartLineIndex = modelStart.lineNumber - 1;
		const modelEndLineIndex = modelEnd.lineNumber - 1;

		let reqStart: Position | null = null;
		for (let modelLineIndex = modelStartLineIndex; modelLineIndex <= modelEndLineIndex; modelLineIndex++) {
			const line = this.modelLineProjections[modelLineIndex];
			if (line.isVisible()) {
				const viewLineStartIndex = line.getViewLineNumberOfModelPosition(0, modelLineIndex === modelStartLineIndex ? modelStart.column : 1);
				const viewLineEndIndex = line.getViewLineNumberOfModelPosition(0, this.model.getLineMaxColumn(modelLineIndex + 1));
				const count = viewLineEndIndex - viewLineStartIndex + 1;
				let option = IndentGuideRepeatOption.BlockNone;
				if (count > 1 && line.getViewLineMinColumn(this.model, modelLineIndex + 1, viewLineEndIndex) === 1) {
					// wrapped lines should block indent guides
					option = (viewLineStartIndex === 0 ? IndentGuideRepeatOption.BlockSubsequent : IndentGuideRepeatOption.BlockAll);
				}
				resultRepeatCount.push(count);
				resultRepeatOption.push(option);
				// merge into previous request
				if (reqStart === null) {
					reqStart = new Position(modelLineIndex + 1, 0);
				}
			} else {
				// hit invisible line => flush request
				if (reqStart !== null) {
					result = result.concat(this.model.guides.getLinesIndentGuides(reqStart.lineNumber, modelLineIndex));
					reqStart = null;
				}
			}
		}

		if (reqStart !== null) {
			result = result.concat(this.model.guides.getLinesIndentGuides(reqStart.lineNumber, modelEnd.lineNumber));
			reqStart = null;
		}

		const viewLineCount = viewEndLineNumber - viewStartLineNumber + 1;
		const viewIndents = new Array<number>(viewLineCount);
		let currIndex = 0;
		for (let i = 0, len = result.length; i < len; i++) {
			let value = result[i];
			const count = Math.min(viewLineCount - currIndex, resultRepeatCount[i]);
			const option = resultRepeatOption[i];
			let blockAtIndex: number;
			if (option === IndentGuideRepeatOption.BlockAll) {
				blockAtIndex = 0;
			} else if (option === IndentGuideRepeatOption.BlockSubsequent) {
				blockAtIndex = 1;
			} else {
				blockAtIndex = count;
			}
			for (let j = 0; j < count; j++) {
				if (j === blockAtIndex) {
					value = 0;
				}
				viewIndents[currIndex++] = value;
			}
		}
		return viewIndents;
	}

	public getViewLineContent(viewLineNumber: number): string {
		const info = this.getViewLineInfo(viewLineNumber);
		return this.modelLineProjections[info.modelLineNumber - 1].getViewLineContent(this.model, info.modelLineNumber, info.modelLineWrappedLineIdx);
	}

	public getViewLineLength(viewLineNumber: number): number {
		const info = this.getViewLineInfo(viewLineNumber);
		return this.modelLineProjections[info.modelLineNumber - 1].getViewLineLength(this.model, info.modelLineNumber, info.modelLineWrappedLineIdx);
	}

	public getViewLineMinColumn(viewLineNumber: number): number {
		const info = this.getViewLineInfo(viewLineNumber);
		return this.modelLineProjections[info.modelLineNumber - 1].getViewLineMinColumn(this.model, info.modelLineNumber, info.modelLineWrappedLineIdx);
	}

	public getViewLineMaxColumn(viewLineNumber: number): number {
		const info = this.getViewLineInfo(viewLineNumber);
		return this.modelLineProjections[info.modelLineNumber - 1].getViewLineMaxColumn(this.model, info.modelLineNumber, info.modelLineWrappedLineIdx);
	}

	public getViewLineData(viewLineNumber: number): ViewLineData {
		const info = this.getViewLineInfo(viewLineNumber);
		return this.modelLineProjections[info.modelLineNumber - 1].getViewLineData(this.model, info.modelLineNumber, info.modelLineWrappedLineIdx);
	}

	public getViewLinesData(viewStartLineNumber: number, viewEndLineNumber: number, needed: boolean[]): ViewLineData[] {

		viewStartLineNumber = this._toValidViewLineNumber(viewStartLineNumber);
		viewEndLineNumber = this._toValidViewLineNumber(viewEndLineNumber);

		const start = this.projectedModelLineLineCounts.getIndexOf(viewStartLineNumber - 1);
		let viewLineNumber = viewStartLineNumber;
		const startModelLineIndex = start.index;
		const startRemainder = start.remainder;

		const result: ViewLineData[] = [];
		for (let modelLineIndex = startModelLineIndex, len = this.model.getLineCount(); modelLineIndex < len; modelLineIndex++) {
			const line = this.modelLineProjections[modelLineIndex];
			if (!line.isVisible()) {
				continue;
			}
			const fromViewLineIndex = (modelLineIndex === startModelLineIndex ? startRemainder : 0);
			let remainingViewLineCount = line.getViewLineCount() - fromViewLineIndex;

			let lastLine = false;
			if (viewLineNumber + remainingViewLineCount > viewEndLineNumber) {
				lastLine = true;
				remainingViewLineCount = viewEndLineNumber - viewLineNumber + 1;
			}

			line.getViewLinesData(this.model, modelLineIndex + 1, fromViewLineIndex, remainingViewLineCount, viewLineNumber - viewStartLineNumber, needed, result);

			viewLineNumber += remainingViewLineCount;

			if (lastLine) {
				break;
			}
		}

		return result;
	}

	public validateViewPosition(viewLineNumber: number, viewColumn: number, expectedModelPosition: Position): Position {
		viewLineNumber = this._toValidViewLineNumber(viewLineNumber);

		const r = this.projectedModelLineLineCounts.getIndexOf(viewLineNumber - 1);
		const lineIndex = r.index;
		const remainder = r.remainder;

		const line = this.modelLineProjections[lineIndex];

		const minColumn = line.getViewLineMinColumn(this.model, lineIndex + 1, remainder);
		const maxColumn = line.getViewLineMaxColumn(this.model, lineIndex + 1, remainder);
		if (viewColumn < minColumn) {
			viewColumn = minColumn;
		}
		if (viewColumn > maxColumn) {
			viewColumn = maxColumn;
		}

		const computedModelColumn = line.getModelColumnOfViewPosition(remainder, viewColumn);
		const computedModelPosition = this.model.validatePosition(new Position(lineIndex + 1, computedModelColumn));

		if (computedModelPosition.equals(expectedModelPosition)) {
			return new Position(viewLineNumber, viewColumn);
		}

		return this.convertModelPositionToViewPosition(expectedModelPosition.lineNumber, expectedModelPosition.column);
	}

	public validateViewRange(viewRange: Range, expectedModelRange: Range): Range {
		const validViewStart = this.validateViewPosition(viewRange.startLineNumber, viewRange.startColumn, expectedModelRange.getStartPosition());
		const validViewEnd = this.validateViewPosition(viewRange.endLineNumber, viewRange.endColumn, expectedModelRange.getEndPosition());
		return new Range(validViewStart.lineNumber, validViewStart.column, validViewEnd.lineNumber, validViewEnd.column);
	}

	public convertViewPositionToModelPosition(viewLineNumber: number, viewColumn: number): Position {
		const info = this.getViewLineInfo(viewLineNumber);

		const inputColumn = this.modelLineProjections[info.modelLineNumber - 1].getModelColumnOfViewPosition(info.modelLineWrappedLineIdx, viewColumn);
		// console.log('out -> in ' + viewLineNumber + ',' + viewColumn + ' ===> ' + (lineIndex+1) + ',' + inputColumn);
		return this.model.validatePosition(new Position(info.modelLineNumber, inputColumn));
	}

	public convertViewRangeToModelRange(viewRange: Range): Range {
		const start = this.convertViewPositionToModelPosition(viewRange.startLineNumber, viewRange.startColumn);
		const end = this.convertViewPositionToModelPosition(viewRange.endLineNumber, viewRange.endColumn);
		return new Range(start.lineNumber, start.column, end.lineNumber, end.column);
	}

	public convertModelPositionToViewPosition(_modelLineNumber: number, _modelColumn: number, affinity: PositionAffinity = PositionAffinity.None, allowZeroLineNumber: boolean = false, belowHiddenRanges: boolean = false): Position {

		const validPosition = this.model.validatePosition(new Position(_modelLineNumber, _modelColumn));
		const inputLineNumber = validPosition.lineNumber;
		const inputColumn = validPosition.column;

		let lineIndex = inputLineNumber - 1, lineIndexChanged = false;
		if (belowHiddenRanges) {
			while (lineIndex < this.modelLineProjections.length && !this.modelLineProjections[lineIndex].isVisible()) {
				lineIndex++;
				lineIndexChanged = true;
			}
		} else {
			while (lineIndex > 0 && !this.modelLineProjections[lineIndex].isVisible()) {
				lineIndex--;
				lineIndexChanged = true;
			}
		}
		if (lineIndex === 0 && !this.modelLineProjections[lineIndex].isVisible()) {
			// Could not reach a real line
			// console.log('in -> out ' + inputLineNumber + ',' + inputColumn + ' ===> ' + 1 + ',' + 1);
			// TODO@alexdima@hediet this isn't soo pretty
			return new Position(allowZeroLineNumber ? 0 : 1, 1);
		}
		const deltaLineNumber = 1 + this.projectedModelLineLineCounts.getPrefixSum(lineIndex);

		let r: Position;
		if (lineIndexChanged) {
			if (belowHiddenRanges) {
				r = this.modelLineProjections[lineIndex].getViewPositionOfModelPosition(deltaLineNumber, 1, affinity);
			} else {
				r = this.modelLineProjections[lineIndex].getViewPositionOfModelPosition(deltaLineNumber, this.model.getLineMaxColumn(lineIndex + 1), affinity);
			}
		} else {
			r = this.modelLineProjections[inputLineNumber - 1].getViewPositionOfModelPosition(deltaLineNumber, inputColumn, affinity);
		}

		// console.log('in -> out ' + inputLineNumber + ',' + inputColumn + ' ===> ' + r.lineNumber + ',' + r);
		return r;
	}

	/**
	 * @param affinity The affinity in case of an empty range. Has no effect for non-empty ranges.
	*/
	public convertModelRangeToViewRange(modelRange: Range, affinity: PositionAffinity = PositionAffinity.Left): Range {
		if (modelRange.isEmpty()) {
			const start = this.convertModelPositionToViewPosition(modelRange.startLineNumber, modelRange.startColumn, affinity);
			return Range.fromPositions(start);
		} else {
			const start = this.convertModelPositionToViewPosition(modelRange.startLineNumber, modelRange.startColumn, PositionAffinity.Right);
			const end = this.convertModelPositionToViewPosition(modelRange.endLineNumber, modelRange.endColumn, PositionAffinity.Left);
			return new Range(start.lineNumber, start.column, end.lineNumber, end.column);
		}
	}

	public getViewLineNumberOfModelPosition(modelLineNumber: number, modelColumn: number): number {
		let lineIndex = modelLineNumber - 1;
		if (this.modelLineProjections[lineIndex].isVisible()) {
			// this model line is visible
			const deltaLineNumber = 1 + this.projectedModelLineLineCounts.getPrefixSum(lineIndex);
			return this.modelLineProjections[lineIndex].getViewLineNumberOfModelPosition(deltaLineNumber, modelColumn);
		}

		// this model line is not visible
		while (lineIndex > 0 && !this.modelLineProjections[lineIndex].isVisible()) {
			lineIndex--;
		}
		if (lineIndex === 0 && !this.modelLineProjections[lineIndex].isVisible()) {
			// Could not reach a real line
			return 1;
		}
		const deltaLineNumber = 1 + this.projectedModelLineLineCounts.getPrefixSum(lineIndex);
		return this.modelLineProjections[lineIndex].getViewLineNumberOfModelPosition(deltaLineNumber, this.model.getLineMaxColumn(lineIndex + 1));
	}

	public getDecorationsInRange(range: Range, ownerId: number, filterOutValidation: boolean, filterFontDecorations: boolean, onlyMinimapDecorations: boolean, onlyMarginDecorations: boolean): IModelDecoration[] {
		const modelStart = this.convertViewPositionToModelPosition(range.startLineNumber, range.startColumn);
		const modelEnd = this.convertViewPositionToModelPosition(range.endLineNumber, range.endColumn);

		if (modelEnd.lineNumber - modelStart.lineNumber <= range.endLineNumber - range.startLineNumber) {
			// most likely there are no hidden lines => fast path
			// fetch decorations from column 1 to cover the case of wrapped lines that have whole line decorations at column 1
			return this.model.getDecorationsInRange(new Range(modelStart.lineNumber, 1, modelEnd.lineNumber, modelEnd.column), ownerId, filterOutValidation, filterFontDecorations, onlyMinimapDecorations, onlyMarginDecorations);
		}

		let result: IModelDecoration[] = [];
		const modelStartLineIndex = modelStart.lineNumber - 1;
		const modelEndLineIndex = modelEnd.lineNumber - 1;

		let reqStart: Position | null = null;
		for (let modelLineIndex = modelStartLineIndex; modelLineIndex <= modelEndLineIndex; modelLineIndex++) {
			const line = this.modelLineProjections[modelLineIndex];
			if (line.isVisible()) {
				// merge into previous request
				if (reqStart === null) {
					reqStart = new Position(modelLineIndex + 1, modelLineIndex === modelStartLineIndex ? modelStart.column : 1);
				}
			} else {
				// hit invisible line => flush request
				if (reqStart !== null) {
					const maxLineColumn = this.model.getLineMaxColumn(modelLineIndex);
					result = result.concat(this.model.getDecorationsInRange(new Range(reqStart.lineNumber, reqStart.column, modelLineIndex, maxLineColumn), ownerId, filterOutValidation, filterFontDecorations, onlyMinimapDecorations));
					reqStart = null;
				}
			}
		}

		if (reqStart !== null) {
			result = result.concat(this.model.getDecorationsInRange(new Range(reqStart.lineNumber, reqStart.column, modelEnd.lineNumber, modelEnd.column), ownerId, filterOutValidation, filterFontDecorations, onlyMinimapDecorations));
			reqStart = null;
		}

		result.sort((a, b) => {
			const res = Range.compareRangesUsingStarts(a.range, b.range);
			if (res === 0) {
				if (a.id < b.id) {
					return -1;
				}
				if (a.id > b.id) {
					return 1;
				}
				return 0;
			}
			return res;
		});

		// Eliminate duplicate decorations that might have intersected our visible ranges multiple times
		const finalResult: IModelDecoration[] = [];
		let finalResultLen = 0;
		let prevDecId: string | null = null;
		for (const dec of result) {
			const decId = dec.id;
			if (prevDecId === decId) {
				// skip
				continue;
			}
			prevDecId = decId;
			finalResult[finalResultLen++] = dec;
		}

		return finalResult;
	}

	public getInjectedTextAt(position: Position): InjectedText | null {
		const info = this.getViewLineInfo(position.lineNumber);
		return this.modelLineProjections[info.modelLineNumber - 1].getInjectedTextAt(info.modelLineWrappedLineIdx, position.column);
	}

	normalizePosition(position: Position, affinity: PositionAffinity): Position {
		const info = this.getViewLineInfo(position.lineNumber);
		return this.modelLineProjections[info.modelLineNumber - 1].normalizePosition(info.modelLineWrappedLineIdx, position, affinity);
	}

	public getLineIndentColumn(lineNumber: number): number {
		const info = this.getViewLineInfo(lineNumber);
		if (info.modelLineWrappedLineIdx === 0) {
			return this.model.getLineIndentColumn(info.modelLineNumber);
		}

		// wrapped lines have no indentation.
		// We deliberately don't handle the case that indentation is wrapped
		// to avoid two view lines reporting indentation for the very same model line.
		return 0;
	}
}

/**
 * Overlapping unsorted ranges:
 * [   )      [ )       [  )
 *    [    )      [       )
 * ->
 * Non overlapping sorted ranges:
 * [       )  [ ) [        )
 *
 * Note: This function only considers line information! Columns are ignored.
*/
function normalizeLineRanges(ranges: Range[]): Range[] {
	if (ranges.length === 0) {
		return [];
	}

	const sortedRanges = ranges.slice();
	sortedRanges.sort(Range.compareRangesUsingStarts);

	const result: Range[] = [];
	let currentRangeStart = sortedRanges[0].startLineNumber;
	let currentRangeEnd = sortedRanges[0].endLineNumber;

	for (let i = 1, len = sortedRanges.length; i < len; i++) {
		const range = sortedRanges[i];

		if (range.startLineNumber > currentRangeEnd + 1) {
			result.push(new Range(currentRangeStart, 1, currentRangeEnd, 1));
			currentRangeStart = range.startLineNumber;
			currentRangeEnd = range.endLineNumber;
		} else if (range.endLineNumber > currentRangeEnd) {
			currentRangeEnd = range.endLineNumber;
		}
	}
	result.push(new Range(currentRangeStart, 1, currentRangeEnd, 1));
	return result;
}

/**
 * Represents a view line. Can be used to efficiently query more information about it.
 */
class ViewLineInfo {
	public get isWrappedLineContinuation(): boolean {
		return this.modelLineWrappedLineIdx > 0;
	}

	constructor(
		public readonly modelLineNumber: number,
		public readonly modelLineWrappedLineIdx: number,
	) { }
}

/**
 * A list of view lines that have a contiguous span in the model.
*/
class ViewLineInfoGroupedByModelRange {
	constructor(public readonly modelRange: Range, public readonly viewLines: ViewLineInfo[]) {
	}
}

class CoordinatesConverter implements ICoordinatesConverter {
	private readonly _lines: ViewModelLinesFromProjectedModel;

	constructor(lines: ViewModelLinesFromProjectedModel) {
		this._lines = lines;
	}

	// View -> Model conversion and related methods

	public convertViewPositionToModelPosition(viewPosition: Position): Position {
		return this._lines.convertViewPositionToModelPosition(viewPosition.lineNumber, viewPosition.column);
	}

	public convertViewRangeToModelRange(viewRange: Range): Range {
		return this._lines.convertViewRangeToModelRange(viewRange);
	}

	public validateViewPosition(viewPosition: Position, expectedModelPosition: Position): Position {
		return this._lines.validateViewPosition(viewPosition.lineNumber, viewPosition.column, expectedModelPosition);
	}

	public validateViewRange(viewRange: Range, expectedModelRange: Range): Range {
		return this._lines.validateViewRange(viewRange, expectedModelRange);
	}

	// Model -> View conversion and related methods

	public convertModelPositionToViewPosition(modelPosition: Position, affinity?: PositionAffinity, allowZero?: boolean, belowHiddenRanges?: boolean): Position {
		return this._lines.convertModelPositionToViewPosition(modelPosition.lineNumber, modelPosition.column, affinity, allowZero, belowHiddenRanges);
	}

	public convertModelRangeToViewRange(modelRange: Range, affinity?: PositionAffinity): Range {
		return this._lines.convertModelRangeToViewRange(modelRange, affinity);
	}

	public modelPositionIsVisible(modelPosition: Position): boolean {
		return this._lines.modelPositionIsVisible(modelPosition.lineNumber, modelPosition.column);
	}

	public getModelLineViewLineCount(modelLineNumber: number): number {
		return this._lines.getModelLineViewLineCount(modelLineNumber);
	}

	public getViewLineNumberOfModelPosition(modelLineNumber: number, modelColumn: number): number {
		return this._lines.getViewLineNumberOfModelPosition(modelLineNumber, modelColumn);
	}
}

const enum IndentGuideRepeatOption {
	BlockNone = 0,
	BlockSubsequent = 1,
	BlockAll = 2
}

export class ViewModelLinesFromModelAsIs implements IViewModelLines {
	public readonly model: ITextModel;

	constructor(model: ITextModel) {
		this.model = model;
	}

	public dispose(): void {
	}

	public createCoordinatesConverter(): ICoordinatesConverter {
		return new IdentityCoordinatesConverter(this.model);
	}

	public getHiddenAreas(): Range[] {
		return [];
	}

	public setHiddenAreas(_ranges: Range[]): boolean {
		return false;
	}

	public setTabSize(_newTabSize: number): boolean {
		return false;
	}

	public setWrappingSettings(_fontInfo: FontInfo, _wrappingStrategy: 'simple' | 'advanced', _wrappingColumn: number, _wrappingIndent: WrappingIndent): boolean {
		return false;
	}

	public createLineBreaksComputer(): ILineBreaksComputer {
		const result: null[] = [];
		return {
			addRequest: (lineText: string, injectedText: LineInjectedText[] | null, previousLineBreakData: ModelLineProjectionData | null) => {
				result.push(null);
			},
			finalize: () => {
				return result;
			}
		};
	}

	public onModelFlushed(): void {
	}

	public onModelLinesDeleted(_versionId: number | null, fromLineNumber: number, toLineNumber: number): viewEvents.ViewLinesDeletedEvent | null {
		return new viewEvents.ViewLinesDeletedEvent(fromLineNumber, toLineNumber);
	}

	public onModelLinesInserted(_versionId: number | null, fromLineNumber: number, toLineNumber: number, lineBreaks: (ModelLineProjectionData | null)[]): viewEvents.ViewLinesInsertedEvent | null {
		return new viewEvents.ViewLinesInsertedEvent(fromLineNumber, toLineNumber);
	}

	public onModelLineChanged(_versionId: number | null, lineNumber: number, lineBreakData: ModelLineProjectionData | null): [boolean, viewEvents.ViewLinesChangedEvent | null, viewEvents.ViewLinesInsertedEvent | null, viewEvents.ViewLinesDeletedEvent | null] {
		return [false, new viewEvents.ViewLinesChangedEvent(lineNumber, 1), null, null];
	}

	public acceptVersionId(_versionId: number): void {
	}

	public getViewLineCount(): number {
		return this.model.getLineCount();
	}

	public getActiveIndentGuide(viewLineNumber: number, _minLineNumber: number, _maxLineNumber: number): IActiveIndentGuideInfo {
		return {
			startLineNumber: viewLineNumber,
			endLineNumber: viewLineNumber,
			indent: 0
		};
	}

	public getViewLinesBracketGuides(startLineNumber: number, endLineNumber: number, activePosition: IPosition | null): IndentGuide[][] {
		return new Array(endLineNumber - startLineNumber + 1).fill([]);
	}

	public getViewLinesIndentGuides(viewStartLineNumber: number, viewEndLineNumber: number): number[] {
		const viewLineCount = viewEndLineNumber - viewStartLineNumber + 1;
		const result = new Array<number>(viewLineCount);
		for (let i = 0; i < viewLineCount; i++) {
			result[i] = 0;
		}
		return result;
	}

	public getViewLineContent(viewLineNumber: number): string {
		return this.model.getLineContent(viewLineNumber);
	}

	public getViewLineLength(viewLineNumber: number): number {
		return this.model.getLineLength(viewLineNumber);
	}

	public getViewLineMinColumn(viewLineNumber: number): number {
		return this.model.getLineMinColumn(viewLineNumber);
	}

	public getViewLineMaxColumn(viewLineNumber: number): number {
		return this.model.getLineMaxColumn(viewLineNumber);
	}

	public getViewLineData(viewLineNumber: number): ViewLineData {
		const lineTokens = this.model.tokenization.getLineTokens(viewLineNumber);
		const lineContent = lineTokens.getLineContent();
		return new ViewLineData(
			lineContent,
			false,
			1,
			lineContent.length + 1,
			0,
			lineTokens.inflate(),
			null
		);
	}

	public getViewLinesData(viewStartLineNumber: number, viewEndLineNumber: number, needed: boolean[]): Array<ViewLineData | null> {
		const lineCount = this.model.getLineCount();
		viewStartLineNumber = Math.min(Math.max(1, viewStartLineNumber), lineCount);
		viewEndLineNumber = Math.min(Math.max(1, viewEndLineNumber), lineCount);

		const result: Array<ViewLineData | null> = [];
		for (let lineNumber = viewStartLineNumber; lineNumber <= viewEndLineNumber; lineNumber++) {
			const idx = lineNumber - viewStartLineNumber;
			result[idx] = needed[idx] ? this.getViewLineData(lineNumber) : null;
		}

		return result;
	}

	public getDecorationsInRange(range: Range, ownerId: number, filterOutValidation: boolean, filterFontDecorations: boolean, onlyMinimapDecorations: boolean, onlyMarginDecorations: boolean): IModelDecoration[] {
		return this.model.getDecorationsInRange(range, ownerId, filterOutValidation, filterFontDecorations, onlyMinimapDecorations, onlyMarginDecorations);
	}

	normalizePosition(position: Position, affinity: PositionAffinity): Position {
		return this.model.normalizePosition(position, affinity);
	}

	public getLineIndentColumn(lineNumber: number): number {
		return this.model.getLineIndentColumn(lineNumber);
	}

	public getInjectedTextAt(position: Position): InjectedText | null {
		// Identity lines collection does not support injected text.
		return null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/anchorSelect/browser/anchorSelect.css]---
Location: vscode-main/src/vs/editor/contrib/anchorSelect/browser/anchorSelect.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .selection-anchor {
	background-color: #007ACC;
	width: 2px !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/anchorSelect/browser/anchorSelect.ts]---
Location: vscode-main/src/vs/editor/contrib/anchorSelect/browser/anchorSelect.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import './anchorSelect.css';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorContributionInstantiation, registerEditorAction, registerEditorContribution, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { Selection } from '../../../common/core/selection.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { TrackedRangeStickiness } from '../../../common/model.js';
import { localize, localize2 } from '../../../../nls.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';

export const SelectionAnchorSet = new RawContextKey('selectionAnchorSet', false);

class SelectionAnchorController implements IEditorContribution {

	public static readonly ID = 'editor.contrib.selectionAnchorController';

	static get(editor: ICodeEditor): SelectionAnchorController | null {
		return editor.getContribution<SelectionAnchorController>(SelectionAnchorController.ID);
	}

	private decorationId: string | undefined;
	private selectionAnchorSetContextKey: IContextKey<boolean>;
	private modelChangeListener: IDisposable;

	constructor(
		private editor: ICodeEditor,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		this.selectionAnchorSetContextKey = SelectionAnchorSet.bindTo(contextKeyService);
		this.modelChangeListener = editor.onDidChangeModel(() => this.selectionAnchorSetContextKey.reset());
	}

	setSelectionAnchor(): void {
		if (this.editor.hasModel()) {
			const position = this.editor.getPosition();
			this.editor.changeDecorations((accessor) => {
				if (this.decorationId) {
					accessor.removeDecoration(this.decorationId);
				}
				this.decorationId = accessor.addDecoration(
					Selection.fromPositions(position, position),
					{
						description: 'selection-anchor',
						stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
						hoverMessage: new MarkdownString().appendText(localize('selectionAnchor', "Selection Anchor")),
						className: 'selection-anchor'
					}
				);
			});
			this.selectionAnchorSetContextKey.set(!!this.decorationId);
			alert(localize('anchorSet', "Anchor set at {0}:{1}", position.lineNumber, position.column));
		}
	}

	goToSelectionAnchor(): void {
		if (this.editor.hasModel() && this.decorationId) {
			const anchorPosition = this.editor.getModel().getDecorationRange(this.decorationId);
			if (anchorPosition) {
				this.editor.setPosition(anchorPosition.getStartPosition());
			}
		}
	}

	selectFromAnchorToCursor(): void {
		if (this.editor.hasModel() && this.decorationId) {
			const start = this.editor.getModel().getDecorationRange(this.decorationId);
			if (start) {
				const end = this.editor.getPosition();
				this.editor.setSelection(Selection.fromPositions(start.getStartPosition(), end));
				this.cancelSelectionAnchor();
			}
		}
	}

	cancelSelectionAnchor(): void {
		if (this.decorationId) {
			const decorationId = this.decorationId;
			this.editor.changeDecorations((accessor) => {
				accessor.removeDecoration(decorationId);
				this.decorationId = undefined;
			});
			this.selectionAnchorSetContextKey.set(false);
		}
	}

	dispose(): void {
		this.cancelSelectionAnchor();
		this.modelChangeListener.dispose();
	}
}

class SetSelectionAnchor extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.setSelectionAnchor',
			label: localize2('setSelectionAnchor', "Set Selection Anchor"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyB),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	async run(_accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		SelectionAnchorController.get(editor)?.setSelectionAnchor();
	}
}

class GoToSelectionAnchor extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.goToSelectionAnchor',
			label: localize2('goToSelectionAnchor', "Go to Selection Anchor"),
			precondition: SelectionAnchorSet,
		});
	}

	async run(_accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		SelectionAnchorController.get(editor)?.goToSelectionAnchor();
	}
}

class SelectFromAnchorToCursor extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.selectFromAnchorToCursor',
			label: localize2('selectFromAnchorToCursor', "Select from Anchor to Cursor"),
			precondition: SelectionAnchorSet,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyK),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	async run(_accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		SelectionAnchorController.get(editor)?.selectFromAnchorToCursor();
	}
}

class CancelSelectionAnchor extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.cancelSelectionAnchor',
			label: localize2('cancelSelectionAnchor', "Cancel Selection Anchor"),
			precondition: SelectionAnchorSet,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyCode.Escape,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	async run(_accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		SelectionAnchorController.get(editor)?.cancelSelectionAnchor();
	}
}

registerEditorContribution(SelectionAnchorController.ID, SelectionAnchorController, EditorContributionInstantiation.Lazy);
registerEditorAction(SetSelectionAnchor);
registerEditorAction(GoToSelectionAnchor);
registerEditorAction(SelectFromAnchorToCursor);
registerEditorAction(CancelSelectionAnchor);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/bracketMatching/browser/bracketMatching.css]---
Location: vscode-main/src/vs/editor/contrib/bracketMatching/browser/bracketMatching.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .bracket-match {
	box-sizing: border-box;
	background-color: var(--vscode-editorBracketMatch-background);
	border: 1px solid var(--vscode-editorBracketMatch-border);
}
```

--------------------------------------------------------------------------------

````
