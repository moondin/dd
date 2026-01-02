---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 218
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 218 of 552)

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

---[FILE: src/vs/editor/common/tokens/lineTokens.ts]---
Location: vscode-main/src/vs/editor/common/tokens/lineTokens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILanguageIdCodec } from '../languages.js';
import { FontStyle, ColorId, StandardTokenType, MetadataConsts, ITokenPresentation, TokenMetadata } from '../encodedTokenAttributes.js';
import { IPosition } from '../core/position.js';
import { ITextModel } from '../model.js';
import { OffsetRange } from '../core/ranges/offsetRange.js';
import { onUnexpectedError } from '../../../base/common/errors.js';


export interface IViewLineTokens {
	languageIdCodec: ILanguageIdCodec;
	equals(other: IViewLineTokens): boolean;
	getCount(): number;
	getStandardTokenType(tokenIndex: number): StandardTokenType;
	getForeground(tokenIndex: number): ColorId;
	getEndOffset(tokenIndex: number): number;
	getClassName(tokenIndex: number): string;
	getInlineStyle(tokenIndex: number, colorMap: string[]): string;
	getPresentation(tokenIndex: number): ITokenPresentation;
	findTokenIndexAtOffset(offset: number): number;
	getLineContent(): string;
	getMetadata(tokenIndex: number): number;
	getLanguageId(tokenIndex: number): string;
	getTokenText(tokenIndex: number): string;
	forEach(callback: (tokenIndex: number) => void): void;
}

export class LineTokens implements IViewLineTokens {
	public static createEmpty(lineContent: string, decoder: ILanguageIdCodec): LineTokens {
		const defaultMetadata = LineTokens.defaultTokenMetadata;

		const tokens = new Uint32Array(2);
		tokens[0] = lineContent.length;
		tokens[1] = defaultMetadata;

		return new LineTokens(tokens, lineContent, decoder);
	}

	public static createFromTextAndMetadata(data: { text: string; metadata: number }[], decoder: ILanguageIdCodec): LineTokens {
		let offset: number = 0;
		let fullText: string = '';
		const tokens = new Array<number>();
		for (const { text, metadata } of data) {
			tokens.push(offset + text.length, metadata);
			offset += text.length;
			fullText += text;
		}
		return new LineTokens(new Uint32Array(tokens), fullText, decoder);
	}

	public static convertToEndOffset(tokens: Uint32Array, lineTextLength: number): void {
		const tokenCount = (tokens.length >>> 1);
		const lastTokenIndex = tokenCount - 1;
		for (let tokenIndex = 0; tokenIndex < lastTokenIndex; tokenIndex++) {
			tokens[tokenIndex << 1] = tokens[(tokenIndex + 1) << 1];
		}
		tokens[lastTokenIndex << 1] = lineTextLength;
	}

	public static findIndexInTokensArray(tokens: Uint32Array, desiredIndex: number): number {
		if (tokens.length <= 2) {
			return 0;
		}

		let low = 0;
		let high = (tokens.length >>> 1) - 1;

		while (low < high) {

			const mid = low + Math.floor((high - low) / 2);
			const endOffset = tokens[(mid << 1)];

			if (endOffset === desiredIndex) {
				return mid + 1;
			} else if (endOffset < desiredIndex) {
				low = mid + 1;
			} else if (endOffset > desiredIndex) {
				high = mid;
			}
		}

		return low;
	}

	_lineTokensBrand: void = undefined;

	private readonly _tokens: Uint32Array;
	private readonly _tokensCount: number;
	private readonly _text: string;

	public readonly languageIdCodec: ILanguageIdCodec;

	public static defaultTokenMetadata = (
		(FontStyle.None << MetadataConsts.FONT_STYLE_OFFSET)
		| (ColorId.DefaultForeground << MetadataConsts.FOREGROUND_OFFSET)
		| (ColorId.DefaultBackground << MetadataConsts.BACKGROUND_OFFSET)
	) >>> 0;

	constructor(tokens: Uint32Array, text: string, decoder: ILanguageIdCodec) {
		const tokensLength = tokens.length > 1 ? tokens[tokens.length - 2] : 0;
		if (tokensLength !== text.length) {
			onUnexpectedError(new Error('Token length and text length do not match!'));
		}
		this._tokens = tokens;
		this._tokensCount = (this._tokens.length >>> 1);
		this._text = text;
		this.languageIdCodec = decoder;
	}

	public getTextLength(): number {
		return this._text.length;
	}

	public equals(other: IViewLineTokens): boolean {
		if (other instanceof LineTokens) {
			return this.slicedEquals(other, 0, this._tokensCount);
		}
		return false;
	}

	public slicedEquals(other: LineTokens, sliceFromTokenIndex: number, sliceTokenCount: number): boolean {
		if (this._text !== other._text) {
			return false;
		}
		if (this._tokensCount !== other._tokensCount) {
			return false;
		}
		const from = (sliceFromTokenIndex << 1);
		const to = from + (sliceTokenCount << 1);
		for (let i = from; i < to; i++) {
			if (this._tokens[i] !== other._tokens[i]) {
				return false;
			}
		}
		return true;
	}

	public getLineContent(): string {
		return this._text;
	}

	public getCount(): number {
		return this._tokensCount;
	}

	public getStartOffset(tokenIndex: number): number {
		if (tokenIndex > 0) {
			return this._tokens[(tokenIndex - 1) << 1];
		}
		return 0;
	}

	public getMetadata(tokenIndex: number): number {
		const metadata = this._tokens[(tokenIndex << 1) + 1];
		return metadata;
	}

	public getLanguageId(tokenIndex: number): string {
		const metadata = this._tokens[(tokenIndex << 1) + 1];
		const languageId = TokenMetadata.getLanguageId(metadata);
		return this.languageIdCodec.decodeLanguageId(languageId);
	}

	public getStandardTokenType(tokenIndex: number): StandardTokenType {
		const metadata = this._tokens[(tokenIndex << 1) + 1];
		return TokenMetadata.getTokenType(metadata);
	}

	public getForeground(tokenIndex: number): ColorId {
		const metadata = this._tokens[(tokenIndex << 1) + 1];
		return TokenMetadata.getForeground(metadata);
	}

	public getClassName(tokenIndex: number): string {
		const metadata = this._tokens[(tokenIndex << 1) + 1];
		return TokenMetadata.getClassNameFromMetadata(metadata);
	}

	public getInlineStyle(tokenIndex: number, colorMap: string[]): string {
		const metadata = this._tokens[(tokenIndex << 1) + 1];
		return TokenMetadata.getInlineStyleFromMetadata(metadata, colorMap);
	}

	public getPresentation(tokenIndex: number): ITokenPresentation {
		const metadata = this._tokens[(tokenIndex << 1) + 1];
		return TokenMetadata.getPresentationFromMetadata(metadata);
	}

	public getEndOffset(tokenIndex: number): number {
		return this._tokens[tokenIndex << 1];
	}

	/**
	 * Find the token containing offset `offset`.
	 * @param offset The search offset
	 * @return The index of the token containing the offset.
	 */
	public findTokenIndexAtOffset(offset: number): number {
		return LineTokens.findIndexInTokensArray(this._tokens, offset);
	}

	public inflate(): IViewLineTokens {
		return this;
	}

	public sliceAndInflate(startOffset: number, endOffset: number, deltaOffset: number): IViewLineTokens {
		return new SliceLineTokens(this, startOffset, endOffset, deltaOffset);
	}

	public sliceZeroCopy(range: OffsetRange): IViewLineTokens {
		return this.sliceAndInflate(range.start, range.endExclusive, 0);
	}

	/**
	 * @pure
	 * @param insertTokens Must be sorted by offset.
	*/
	public withInserted(insertTokens: { offset: number; text: string; tokenMetadata: number }[]): LineTokens {
		if (insertTokens.length === 0) {
			return this;
		}

		let nextOriginalTokenIdx = 0;
		let nextInsertTokenIdx = 0;
		let text = '';
		const newTokens = new Array<number>();

		let originalEndOffset = 0;
		while (true) {
			const nextOriginalTokenEndOffset = nextOriginalTokenIdx < this._tokensCount ? this._tokens[nextOriginalTokenIdx << 1] : -1;
			const nextInsertToken = nextInsertTokenIdx < insertTokens.length ? insertTokens[nextInsertTokenIdx] : null;

			if (nextOriginalTokenEndOffset !== -1 && (nextInsertToken === null || nextOriginalTokenEndOffset <= nextInsertToken.offset)) {
				// original token ends before next insert token
				text += this._text.substring(originalEndOffset, nextOriginalTokenEndOffset);
				const metadata = this._tokens[(nextOriginalTokenIdx << 1) + 1];
				newTokens.push(text.length, metadata);
				nextOriginalTokenIdx++;
				originalEndOffset = nextOriginalTokenEndOffset;

			} else if (nextInsertToken) {
				if (nextInsertToken.offset > originalEndOffset) {
					// insert token is in the middle of the next token.
					text += this._text.substring(originalEndOffset, nextInsertToken.offset);
					const metadata = this._tokens[(nextOriginalTokenIdx << 1) + 1];
					newTokens.push(text.length, metadata);
					originalEndOffset = nextInsertToken.offset;
				}

				text += nextInsertToken.text;
				newTokens.push(text.length, nextInsertToken.tokenMetadata);
				nextInsertTokenIdx++;
			} else {
				break;
			}
		}

		return new LineTokens(new Uint32Array(newTokens), text, this.languageIdCodec);
	}

	public getTokensInRange(range: OffsetRange): TokenArray {
		const builder = new TokenArrayBuilder();

		const startTokenIndex = this.findTokenIndexAtOffset(range.start);
		const endTokenIndex = this.findTokenIndexAtOffset(range.endExclusive);

		for (let tokenIndex = startTokenIndex; tokenIndex <= endTokenIndex; tokenIndex++) {
			const tokenRange = new OffsetRange(this.getStartOffset(tokenIndex), this.getEndOffset(tokenIndex));
			const length = tokenRange.intersectionLength(range);
			if (length > 0) {
				builder.add(length, this.getMetadata(tokenIndex));
			}
		}

		return builder.build();
	}

	public getTokenText(tokenIndex: number): string {
		const startOffset = this.getStartOffset(tokenIndex);
		const endOffset = this.getEndOffset(tokenIndex);
		const text = this._text.substring(startOffset, endOffset);
		return text;
	}

	public forEach(callback: (tokenIndex: number) => void): void {
		const tokenCount = this.getCount();
		for (let tokenIndex = 0; tokenIndex < tokenCount; tokenIndex++) {
			callback(tokenIndex);
		}
	}

	toString(): string {
		let result = '';
		this.forEach((i) => {
			result += `[${this.getTokenText(i)}]{${this.getClassName(i)}}`;
		});
		return result;
	}
}

class SliceLineTokens implements IViewLineTokens {

	private readonly _source: LineTokens;
	private readonly _startOffset: number;
	private readonly _endOffset: number;
	private readonly _deltaOffset: number;

	private readonly _firstTokenIndex: number;
	private readonly _tokensCount: number;

	public readonly languageIdCodec: ILanguageIdCodec;

	constructor(source: LineTokens, startOffset: number, endOffset: number, deltaOffset: number) {
		this._source = source;
		this._startOffset = startOffset;
		this._endOffset = endOffset;
		this._deltaOffset = deltaOffset;
		this._firstTokenIndex = source.findTokenIndexAtOffset(startOffset);
		this.languageIdCodec = source.languageIdCodec;

		this._tokensCount = 0;
		for (let i = this._firstTokenIndex, len = source.getCount(); i < len; i++) {
			const tokenStartOffset = source.getStartOffset(i);
			if (tokenStartOffset >= endOffset) {
				break;
			}
			this._tokensCount++;
		}
	}

	public getMetadata(tokenIndex: number): number {
		return this._source.getMetadata(this._firstTokenIndex + tokenIndex);
	}

	public getLanguageId(tokenIndex: number): string {
		return this._source.getLanguageId(this._firstTokenIndex + tokenIndex);
	}

	public getLineContent(): string {
		return this._source.getLineContent().substring(this._startOffset, this._endOffset);
	}

	public equals(other: IViewLineTokens): boolean {
		if (other instanceof SliceLineTokens) {
			return (
				this._startOffset === other._startOffset
				&& this._endOffset === other._endOffset
				&& this._deltaOffset === other._deltaOffset
				&& this._source.slicedEquals(other._source, this._firstTokenIndex, this._tokensCount)
			);
		}
		return false;
	}

	public getCount(): number {
		return this._tokensCount;
	}

	public getStandardTokenType(tokenIndex: number): StandardTokenType {
		return this._source.getStandardTokenType(this._firstTokenIndex + tokenIndex);
	}

	public getForeground(tokenIndex: number): ColorId {
		return this._source.getForeground(this._firstTokenIndex + tokenIndex);
	}

	public getEndOffset(tokenIndex: number): number {
		const tokenEndOffset = this._source.getEndOffset(this._firstTokenIndex + tokenIndex);
		return Math.min(this._endOffset, tokenEndOffset) - this._startOffset + this._deltaOffset;
	}

	public getClassName(tokenIndex: number): string {
		return this._source.getClassName(this._firstTokenIndex + tokenIndex);
	}

	public getInlineStyle(tokenIndex: number, colorMap: string[]): string {
		return this._source.getInlineStyle(this._firstTokenIndex + tokenIndex, colorMap);
	}

	public getPresentation(tokenIndex: number): ITokenPresentation {
		return this._source.getPresentation(this._firstTokenIndex + tokenIndex);
	}

	public findTokenIndexAtOffset(offset: number): number {
		return this._source.findTokenIndexAtOffset(offset + this._startOffset - this._deltaOffset) - this._firstTokenIndex;
	}

	public getTokenText(tokenIndex: number): string {
		const adjustedTokenIndex = this._firstTokenIndex + tokenIndex;
		const tokenStartOffset = this._source.getStartOffset(adjustedTokenIndex);
		const tokenEndOffset = this._source.getEndOffset(adjustedTokenIndex);
		let text = this._source.getTokenText(adjustedTokenIndex);
		if (tokenStartOffset < this._startOffset) {
			text = text.substring(this._startOffset - tokenStartOffset);
		}
		if (tokenEndOffset > this._endOffset) {
			text = text.substring(0, text.length - (tokenEndOffset - this._endOffset));
		}
		return text;
	}

	public forEach(callback: (tokenIndex: number) => void): void {
		for (let tokenIndex = 0; tokenIndex < this.getCount(); tokenIndex++) {
			callback(tokenIndex);
		}
	}
}

export function getStandardTokenTypeAtPosition(model: ITextModel, position: IPosition): StandardTokenType | undefined {
	const lineNumber = position.lineNumber;
	if (!model.tokenization.isCheapToTokenize(lineNumber)) {
		return undefined;
	}
	model.tokenization.forceTokenization(lineNumber);
	const lineTokens = model.tokenization.getLineTokens(lineNumber);
	const tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
	const tokenType = lineTokens.getStandardTokenType(tokenIndex);
	return tokenType;
}



/**
 * This class represents a sequence of tokens.
 * Conceptually, each token has a length and a metadata number.
 * A token array might be used to annotate a string with metadata.
 * Use {@link TokenArrayBuilder} to efficiently create a token array.
 *
 * TODO: Make this class more efficient (e.g. by using a Int32Array).
*/
export class TokenArray {
	public static fromLineTokens(lineTokens: LineTokens): TokenArray {
		const tokenInfo: TokenInfo[] = [];
		for (let i = 0; i < lineTokens.getCount(); i++) {
			tokenInfo.push(new TokenInfo(lineTokens.getEndOffset(i) - lineTokens.getStartOffset(i), lineTokens.getMetadata(i)));
		}
		return TokenArray.create(tokenInfo);
	}

	public static create(tokenInfo: TokenInfo[]): TokenArray {
		return new TokenArray(tokenInfo);
	}

	private constructor(
		private readonly _tokenInfo: TokenInfo[]
	) { }

	public toLineTokens(lineContent: string, decoder: ILanguageIdCodec): LineTokens {
		return LineTokens.createFromTextAndMetadata(this.map((r, t) => ({ text: r.substring(lineContent), metadata: t.metadata })), decoder);
	}

	public forEach(cb: (range: OffsetRange, tokenInfo: TokenInfo) => void): void {
		let lengthSum = 0;
		for (const tokenInfo of this._tokenInfo) {
			const range = new OffsetRange(lengthSum, lengthSum + tokenInfo.length);
			cb(range, tokenInfo);
			lengthSum += tokenInfo.length;
		}
	}

	public map<T>(cb: (range: OffsetRange, tokenInfo: TokenInfo) => T): T[] {
		const result: T[] = [];
		let lengthSum = 0;
		for (const tokenInfo of this._tokenInfo) {
			const range = new OffsetRange(lengthSum, lengthSum + tokenInfo.length);
			result.push(cb(range, tokenInfo));
			lengthSum += tokenInfo.length;
		}
		return result;
	}

	public slice(range: OffsetRange): TokenArray {
		const result: TokenInfo[] = [];
		let lengthSum = 0;
		for (const tokenInfo of this._tokenInfo) {
			const tokenStart = lengthSum;
			const tokenEndEx = tokenStart + tokenInfo.length;
			if (tokenEndEx > range.start) {
				if (tokenStart >= range.endExclusive) {
					break;
				}

				const deltaBefore = Math.max(0, range.start - tokenStart);
				const deltaAfter = Math.max(0, tokenEndEx - range.endExclusive);

				result.push(new TokenInfo(tokenInfo.length - deltaBefore - deltaAfter, tokenInfo.metadata));
			}

			lengthSum += tokenInfo.length;
		}
		return TokenArray.create(result);
	}

	public append(other: TokenArray): TokenArray {
		const result: TokenInfo[] = this._tokenInfo.concat(other._tokenInfo);
		return TokenArray.create(result);
	}
}

export type ITokenMetadata = number;

export class TokenInfo {
	constructor(
		public readonly length: number,
		public readonly metadata: ITokenMetadata
	) { }
}
/**
 * TODO: Make this class more efficient (e.g. by using a Int32Array).
*/

export class TokenArrayBuilder {
	private readonly _tokens: TokenInfo[] = [];

	public add(length: number, metadata: ITokenMetadata): void {
		this._tokens.push(new TokenInfo(length, metadata));
	}

	public build(): TokenArray {
		return TokenArray.create(this._tokens);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/tokens/sparseMultilineTokens.ts]---
Location: vscode-main/src/vs/editor/common/tokens/sparseMultilineTokens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';
import { Position } from '../core/position.js';
import { IRange, Range } from '../core/range.js';
import { countEOL } from '../core/misc/eolCounter.js';
import { ITextModel } from '../model.js';
import { RateLimiter } from './common.js';

/**
 * Represents sparse tokens over a contiguous range of lines.
 */
export class SparseMultilineTokens {

	public static create(startLineNumber: number, tokens: Uint32Array): SparseMultilineTokens {
		return new SparseMultilineTokens(startLineNumber, new SparseMultilineTokensStorage(tokens));
	}

	private _startLineNumber: number;
	private _endLineNumber: number;
	private readonly _tokens: SparseMultilineTokensStorage;

	/**
	 * (Inclusive) start line number for these tokens.
	 */
	public get startLineNumber(): number {
		return this._startLineNumber;
	}

	/**
	 * (Inclusive) end line number for these tokens.
	 */
	public get endLineNumber(): number {
		return this._endLineNumber;
	}

	private constructor(startLineNumber: number, tokens: SparseMultilineTokensStorage) {
		this._startLineNumber = startLineNumber;
		this._tokens = tokens;
		this._endLineNumber = this._startLineNumber + this._tokens.getMaxDeltaLine();
	}

	public toString(): string {
		return this._tokens.toString(this._startLineNumber);
	}

	private _updateEndLineNumber(): void {
		this._endLineNumber = this._startLineNumber + this._tokens.getMaxDeltaLine();
	}

	public isEmpty(): boolean {
		return this._tokens.isEmpty();
	}

	public getLineTokens(lineNumber: number): SparseLineTokens | null {
		if (this._startLineNumber <= lineNumber && lineNumber <= this._endLineNumber) {
			return this._tokens.getLineTokens(lineNumber - this._startLineNumber);
		}
		return null;
	}

	public getRange(): Range | null {
		const deltaRange = this._tokens.getRange();
		if (!deltaRange) {
			return deltaRange;
		}
		return new Range(this._startLineNumber + deltaRange.startLineNumber, deltaRange.startColumn, this._startLineNumber + deltaRange.endLineNumber, deltaRange.endColumn);
	}

	public removeTokens(range: Range): void {
		const startLineIndex = range.startLineNumber - this._startLineNumber;
		const endLineIndex = range.endLineNumber - this._startLineNumber;

		this._startLineNumber += this._tokens.removeTokens(startLineIndex, range.startColumn - 1, endLineIndex, range.endColumn - 1);
		this._updateEndLineNumber();
	}

	public split(range: Range): [SparseMultilineTokens, SparseMultilineTokens] {
		// split tokens to two:
		// a) all the tokens before `range`
		// b) all the tokens after `range`
		const startLineIndex = range.startLineNumber - this._startLineNumber;
		const endLineIndex = range.endLineNumber - this._startLineNumber;

		const [a, b, bDeltaLine] = this._tokens.split(startLineIndex, range.startColumn - 1, endLineIndex, range.endColumn - 1);
		return [new SparseMultilineTokens(this._startLineNumber, a), new SparseMultilineTokens(this._startLineNumber + bDeltaLine, b)];
	}

	public applyEdit(range: IRange, text: string): void {
		const [eolCount, firstLineLength, lastLineLength] = countEOL(text);
		this.acceptEdit(range, eolCount, firstLineLength, lastLineLength, text.length > 0 ? text.charCodeAt(0) : CharCode.Null);
	}

	public acceptEdit(range: IRange, eolCount: number, firstLineLength: number, lastLineLength: number, firstCharCode: number): void {
		this._acceptDeleteRange(range);
		this._acceptInsertText(new Position(range.startLineNumber, range.startColumn), eolCount, firstLineLength, lastLineLength, firstCharCode);
		this._updateEndLineNumber();
	}

	private _acceptDeleteRange(range: IRange): void {
		if (range.startLineNumber === range.endLineNumber && range.startColumn === range.endColumn) {
			// Nothing to delete
			return;
		}

		const firstLineIndex = range.startLineNumber - this._startLineNumber;
		const lastLineIndex = range.endLineNumber - this._startLineNumber;

		if (lastLineIndex < 0) {
			// this deletion occurs entirely before this block, so we only need to adjust line numbers
			const deletedLinesCount = lastLineIndex - firstLineIndex;
			this._startLineNumber -= deletedLinesCount;
			return;
		}

		const tokenMaxDeltaLine = this._tokens.getMaxDeltaLine();

		if (firstLineIndex >= tokenMaxDeltaLine + 1) {
			// this deletion occurs entirely after this block, so there is nothing to do
			return;
		}

		if (firstLineIndex < 0 && lastLineIndex >= tokenMaxDeltaLine + 1) {
			// this deletion completely encompasses this block
			this._startLineNumber = 0;
			this._tokens.clear();
			return;
		}

		if (firstLineIndex < 0) {
			const deletedBefore = -firstLineIndex;
			this._startLineNumber -= deletedBefore;

			this._tokens.acceptDeleteRange(range.startColumn - 1, 0, 0, lastLineIndex, range.endColumn - 1);
		} else {
			this._tokens.acceptDeleteRange(0, firstLineIndex, range.startColumn - 1, lastLineIndex, range.endColumn - 1);
		}
	}

	private _acceptInsertText(position: Position, eolCount: number, firstLineLength: number, lastLineLength: number, firstCharCode: number): void {

		if (eolCount === 0 && firstLineLength === 0) {
			// Nothing to insert
			return;
		}

		const lineIndex = position.lineNumber - this._startLineNumber;

		if (lineIndex < 0) {
			// this insertion occurs before this block, so we only need to adjust line numbers
			this._startLineNumber += eolCount;
			return;
		}

		const tokenMaxDeltaLine = this._tokens.getMaxDeltaLine();

		if (lineIndex >= tokenMaxDeltaLine + 1) {
			// this insertion occurs after this block, so there is nothing to do
			return;
		}

		this._tokens.acceptInsertText(lineIndex, position.column - 1, eolCount, firstLineLength, lastLineLength, firstCharCode);
	}

	public reportIfInvalid(model: ITextModel): void {
		this._tokens.reportIfInvalid(model, this._startLineNumber);
	}
}

class SparseMultilineTokensStorage {
	/**
	 * The encoding of tokens is:
	 *  4*i    deltaLine (from `startLineNumber`)
	 *  4*i+1  startCharacter (from the line start)
	 *  4*i+2  endCharacter (from the line start)
	 *  4*i+3  metadata
	 */
	private readonly _tokens: Uint32Array;
	private _tokenCount: number;

	constructor(tokens: Uint32Array) {
		this._tokens = tokens;
		this._tokenCount = tokens.length / 4;
	}

	public toString(startLineNumber: number): string {
		const pieces: string[] = [];
		for (let i = 0; i < this._tokenCount; i++) {
			pieces.push(`(${this._getDeltaLine(i) + startLineNumber},${this._getStartCharacter(i)}-${this._getEndCharacter(i)})`);
		}
		return `[${pieces.join(',')}]`;
	}

	public getMaxDeltaLine(): number {
		const tokenCount = this._getTokenCount();
		if (tokenCount === 0) {
			return -1;
		}
		return this._getDeltaLine(tokenCount - 1);
	}

	public getRange(): Range | null {
		const tokenCount = this._getTokenCount();
		if (tokenCount === 0) {
			return null;
		}
		const startChar = this._getStartCharacter(0);
		const maxDeltaLine = this._getDeltaLine(tokenCount - 1);
		const endChar = this._getEndCharacter(tokenCount - 1);
		return new Range(0, startChar + 1, maxDeltaLine, endChar + 1);
	}

	private _getTokenCount(): number {
		return this._tokenCount;
	}

	private _getDeltaLine(tokenIndex: number): number {
		return this._tokens[4 * tokenIndex];
	}

	private _getStartCharacter(tokenIndex: number): number {
		return this._tokens[4 * tokenIndex + 1];
	}

	private _getEndCharacter(tokenIndex: number): number {
		return this._tokens[4 * tokenIndex + 2];
	}

	public isEmpty(): boolean {
		return (this._getTokenCount() === 0);
	}

	public getLineTokens(deltaLine: number): SparseLineTokens | null {
		let low = 0;
		let high = this._getTokenCount() - 1;

		while (low < high) {
			const mid = low + Math.floor((high - low) / 2);
			const midDeltaLine = this._getDeltaLine(mid);

			if (midDeltaLine < deltaLine) {
				low = mid + 1;
			} else if (midDeltaLine > deltaLine) {
				high = mid - 1;
			} else {
				let min = mid;
				while (min > low && this._getDeltaLine(min - 1) === deltaLine) {
					min--;
				}
				let max = mid;
				while (max < high && this._getDeltaLine(max + 1) === deltaLine) {
					max++;
				}
				return new SparseLineTokens(this._tokens.subarray(4 * min, 4 * max + 4));
			}
		}

		if (this._getDeltaLine(low) === deltaLine) {
			return new SparseLineTokens(this._tokens.subarray(4 * low, 4 * low + 4));
		}

		return null;
	}

	public clear(): void {
		this._tokenCount = 0;
	}

	public removeTokens(startDeltaLine: number, startChar: number, endDeltaLine: number, endChar: number): number {
		const tokens = this._tokens;
		const tokenCount = this._tokenCount;
		let newTokenCount = 0;
		let hasDeletedTokens = false;
		let firstDeltaLine = 0;
		for (let i = 0; i < tokenCount; i++) {
			const srcOffset = 4 * i;
			const tokenDeltaLine = tokens[srcOffset];
			const tokenStartCharacter = tokens[srcOffset + 1];
			const tokenEndCharacter = tokens[srcOffset + 2];
			const tokenMetadata = tokens[srcOffset + 3];

			if (
				(tokenDeltaLine > startDeltaLine || (tokenDeltaLine === startDeltaLine && tokenEndCharacter >= startChar))
				&& (tokenDeltaLine < endDeltaLine || (tokenDeltaLine === endDeltaLine && tokenStartCharacter <= endChar))
			) {
				hasDeletedTokens = true;
			} else {
				if (newTokenCount === 0) {
					firstDeltaLine = tokenDeltaLine;
				}
				if (hasDeletedTokens) {
					// must move the token to the left
					const destOffset = 4 * newTokenCount;
					tokens[destOffset] = tokenDeltaLine - firstDeltaLine;
					tokens[destOffset + 1] = tokenStartCharacter;
					tokens[destOffset + 2] = tokenEndCharacter;
					tokens[destOffset + 3] = tokenMetadata;
				} else if (firstDeltaLine !== 0) {
					// must adjust the delta line in place
					tokens[srcOffset] = tokenDeltaLine - firstDeltaLine;
				}
				newTokenCount++;
			}
		}

		this._tokenCount = newTokenCount;

		return firstDeltaLine;
	}

	public split(startDeltaLine: number, startChar: number, endDeltaLine: number, endChar: number): [SparseMultilineTokensStorage, SparseMultilineTokensStorage, number] {
		const tokens = this._tokens;
		const tokenCount = this._tokenCount;
		const aTokens: number[] = [];
		const bTokens: number[] = [];
		let destTokens: number[] = aTokens;
		let destOffset = 0;
		let destFirstDeltaLine: number = 0;
		for (let i = 0; i < tokenCount; i++) {
			const srcOffset = 4 * i;
			const tokenDeltaLine = tokens[srcOffset];
			const tokenStartCharacter = tokens[srcOffset + 1];
			const tokenEndCharacter = tokens[srcOffset + 2];
			const tokenMetadata = tokens[srcOffset + 3];

			if ((tokenDeltaLine > startDeltaLine || (tokenDeltaLine === startDeltaLine && tokenEndCharacter >= startChar))) {
				if ((tokenDeltaLine < endDeltaLine || (tokenDeltaLine === endDeltaLine && tokenStartCharacter <= endChar))) {
					// this token is touching the range
					continue;
				} else {
					// this token is after the range
					if (destTokens !== bTokens) {
						// this token is the first token after the range
						destTokens = bTokens;
						destOffset = 0;
						destFirstDeltaLine = tokenDeltaLine;
					}
				}
			}

			destTokens[destOffset++] = tokenDeltaLine - destFirstDeltaLine;
			destTokens[destOffset++] = tokenStartCharacter;
			destTokens[destOffset++] = tokenEndCharacter;
			destTokens[destOffset++] = tokenMetadata;
		}

		return [new SparseMultilineTokensStorage(new Uint32Array(aTokens)), new SparseMultilineTokensStorage(new Uint32Array(bTokens)), destFirstDeltaLine];
	}

	public acceptDeleteRange(horizontalShiftForFirstLineTokens: number, startDeltaLine: number, startCharacter: number, endDeltaLine: number, endCharacter: number): void {
		// This is a bit complex, here are the cases I used to think about this:
		//
		// 1. The token starts before the deletion range
		// 1a. The token is completely before the deletion range
		//               -----------
		//                          xxxxxxxxxxx
		// 1b. The token starts before, the deletion range ends after the token
		//               -----------
		//                      xxxxxxxxxxx
		// 1c. The token starts before, the deletion range ends precisely with the token
		//               ---------------
		//                      xxxxxxxx
		// 1d. The token starts before, the deletion range is inside the token
		//               ---------------
		//                    xxxxx
		//
		// 2. The token starts at the same position with the deletion range
		// 2a. The token starts at the same position, and ends inside the deletion range
		//               -------
		//               xxxxxxxxxxx
		// 2b. The token starts at the same position, and ends at the same position as the deletion range
		//               ----------
		//               xxxxxxxxxx
		// 2c. The token starts at the same position, and ends after the deletion range
		//               -------------
		//               xxxxxxx
		//
		// 3. The token starts inside the deletion range
		// 3a. The token is inside the deletion range
		//                -------
		//             xxxxxxxxxxxxx
		// 3b. The token starts inside the deletion range, and ends at the same position as the deletion range
		//                ----------
		//             xxxxxxxxxxxxx
		// 3c. The token starts inside the deletion range, and ends after the deletion range
		//                ------------
		//             xxxxxxxxxxx
		//
		// 4. The token starts after the deletion range
		//                  -----------
		//          xxxxxxxx
		//
		const tokens = this._tokens;
		const tokenCount = this._tokenCount;
		const deletedLineCount = (endDeltaLine - startDeltaLine);
		let newTokenCount = 0;
		let hasDeletedTokens = false;
		for (let i = 0; i < tokenCount; i++) {
			const srcOffset = 4 * i;
			let tokenDeltaLine = tokens[srcOffset];
			let tokenStartCharacter = tokens[srcOffset + 1];
			let tokenEndCharacter = tokens[srcOffset + 2];
			const tokenMetadata = tokens[srcOffset + 3];

			if (tokenDeltaLine < startDeltaLine || (tokenDeltaLine === startDeltaLine && tokenEndCharacter <= startCharacter)) {
				// 1a. The token is completely before the deletion range
				// => nothing to do
				newTokenCount++;
				continue;
			} else if (tokenDeltaLine === startDeltaLine && tokenStartCharacter < startCharacter) {
				// 1b, 1c, 1d
				// => the token survives, but it needs to shrink
				if (tokenDeltaLine === endDeltaLine && tokenEndCharacter > endCharacter) {
					// 1d. The token starts before, the deletion range is inside the token
					// => the token shrinks by the deletion character count
					tokenEndCharacter -= (endCharacter - startCharacter);
				} else {
					// 1b. The token starts before, the deletion range ends after the token
					// 1c. The token starts before, the deletion range ends precisely with the token
					// => the token shrinks its ending to the deletion start
					tokenEndCharacter = startCharacter;
				}
			} else if (tokenDeltaLine === startDeltaLine && tokenStartCharacter === startCharacter) {
				// 2a, 2b, 2c
				if (tokenDeltaLine === endDeltaLine && tokenEndCharacter > endCharacter) {
					// 2c. The token starts at the same position, and ends after the deletion range
					// => the token shrinks by the deletion character count
					tokenEndCharacter -= (endCharacter - startCharacter);
				} else {
					// 2a. The token starts at the same position, and ends inside the deletion range
					// 2b. The token starts at the same position, and ends at the same position as the deletion range
					// => the token is deleted
					hasDeletedTokens = true;
					continue;
				}
			} else if (tokenDeltaLine < endDeltaLine || (tokenDeltaLine === endDeltaLine && tokenStartCharacter < endCharacter)) {
				// 3a, 3b, 3c
				if (tokenDeltaLine === endDeltaLine && tokenEndCharacter > endCharacter) {
					// 3c. The token starts inside the deletion range, and ends after the deletion range
					// => the token moves to continue right after the deletion
					tokenDeltaLine = startDeltaLine;
					tokenStartCharacter = startCharacter;
					tokenEndCharacter = tokenStartCharacter + (tokenEndCharacter - endCharacter);
				} else {
					// 3a. The token is inside the deletion range
					// 3b. The token starts inside the deletion range, and ends at the same position as the deletion range
					// => the token is deleted
					hasDeletedTokens = true;
					continue;
				}
			} else if (tokenDeltaLine > endDeltaLine) {
				// 4. (partial) The token starts after the deletion range, on a line below...
				if (deletedLineCount === 0 && !hasDeletedTokens) {
					// early stop, there is no need to walk all the tokens and do nothing...
					newTokenCount = tokenCount;
					break;
				}
				tokenDeltaLine -= deletedLineCount;
			} else if (tokenDeltaLine === endDeltaLine && tokenStartCharacter >= endCharacter) {
				// 4. (continued) The token starts after the deletion range, on the last line where a deletion occurs
				if (horizontalShiftForFirstLineTokens && tokenDeltaLine === 0) {
					tokenStartCharacter += horizontalShiftForFirstLineTokens;
					tokenEndCharacter += horizontalShiftForFirstLineTokens;
				}
				tokenDeltaLine -= deletedLineCount;
				tokenStartCharacter -= (endCharacter - startCharacter);
				tokenEndCharacter -= (endCharacter - startCharacter);
			} else {
				throw new Error(`Not possible!`);
			}

			const destOffset = 4 * newTokenCount;
			tokens[destOffset] = tokenDeltaLine;
			tokens[destOffset + 1] = tokenStartCharacter;
			tokens[destOffset + 2] = tokenEndCharacter;
			tokens[destOffset + 3] = tokenMetadata;
			newTokenCount++;
		}

		this._tokenCount = newTokenCount;
	}

	public acceptInsertText(deltaLine: number, character: number, eolCount: number, firstLineLength: number, lastLineLength: number, firstCharCode: number): void {
		// Here are the cases I used to think about this:
		//
		// 1. The token is completely before the insertion point
		//            -----------   |
		// 2. The token ends precisely at the insertion point
		//            -----------|
		// 3. The token contains the insertion point
		//            -----|------
		// 4. The token starts precisely at the insertion point
		//            |-----------
		// 5. The token is completely after the insertion point
		//            |   -----------
		//
		const isInsertingPreciselyOneWordCharacter = (
			eolCount === 0
			&& firstLineLength === 1
			&& (
				(firstCharCode >= CharCode.Digit0 && firstCharCode <= CharCode.Digit9)
				|| (firstCharCode >= CharCode.A && firstCharCode <= CharCode.Z)
				|| (firstCharCode >= CharCode.a && firstCharCode <= CharCode.z)
			)
		);
		const tokens = this._tokens;
		const tokenCount = this._tokenCount;
		for (let i = 0; i < tokenCount; i++) {
			const offset = 4 * i;
			let tokenDeltaLine = tokens[offset];
			let tokenStartCharacter = tokens[offset + 1];
			let tokenEndCharacter = tokens[offset + 2];

			if (tokenDeltaLine < deltaLine || (tokenDeltaLine === deltaLine && tokenEndCharacter < character)) {
				// 1. The token is completely before the insertion point
				// => nothing to do
				continue;
			} else if (tokenDeltaLine === deltaLine && tokenEndCharacter === character) {
				// 2. The token ends precisely at the insertion point
				// => expand the end character only if inserting precisely one character that is a word character
				if (isInsertingPreciselyOneWordCharacter) {
					tokenEndCharacter += 1;
				} else {
					continue;
				}
			} else if (tokenDeltaLine === deltaLine && tokenStartCharacter < character && character < tokenEndCharacter) {
				// 3. The token contains the insertion point
				if (eolCount === 0) {
					// => just expand the end character
					tokenEndCharacter += firstLineLength;
				} else {
					// => cut off the token
					tokenEndCharacter = character;
				}
			} else {
				// 4. or 5.
				if (tokenDeltaLine === deltaLine && tokenStartCharacter === character) {
					// 4. The token starts precisely at the insertion point
					// => grow the token (by keeping its start constant) only if inserting precisely one character that is a word character
					// => otherwise behave as in case 5.
					if (isInsertingPreciselyOneWordCharacter) {
						continue;
					}
				}
				// => the token must move and keep its size constant
				if (tokenDeltaLine === deltaLine) {
					tokenDeltaLine += eolCount;
					// this token is on the line where the insertion is taking place
					if (eolCount === 0) {
						tokenStartCharacter += firstLineLength;
						tokenEndCharacter += firstLineLength;
					} else {
						const tokenLength = tokenEndCharacter - tokenStartCharacter;
						tokenStartCharacter = lastLineLength + (tokenStartCharacter - character);
						tokenEndCharacter = tokenStartCharacter + tokenLength;
					}
				} else {
					tokenDeltaLine += eolCount;
				}
			}

			tokens[offset] = tokenDeltaLine;
			tokens[offset + 1] = tokenStartCharacter;
			tokens[offset + 2] = tokenEndCharacter;
		}
	}

	private static _rateLimiter = new RateLimiter(10 / 60); // limit to 10 times per minute

	public reportIfInvalid(model: ITextModel, startLineNumber: number): void {
		for (let i = 0; i < this._tokenCount; i++) {
			const lineNumber = this._getDeltaLine(i) + startLineNumber;

			if (lineNumber < 1) {
				SparseMultilineTokensStorage._rateLimiter.runIfNotLimited(() => {
					console.error('Invalid Semantic Tokens Data From Extension: lineNumber < 1');
				});
			} else if (lineNumber > model.getLineCount()) {
				SparseMultilineTokensStorage._rateLimiter.runIfNotLimited(() => {
					console.error('Invalid Semantic Tokens Data From Extension: lineNumber > model.getLineCount()');
				});
			} else if (this._getEndCharacter(i) > model.getLineLength(lineNumber)) {
				SparseMultilineTokensStorage._rateLimiter.runIfNotLimited(() => {
					console.error('Invalid Semantic Tokens Data From Extension: end character > model.getLineLength(lineNumber)');
				});
			}
		}
	}
}

export class SparseLineTokens {

	private readonly _tokens: Uint32Array;

	constructor(tokens: Uint32Array) {
		this._tokens = tokens;
	}

	public getCount(): number {
		return this._tokens.length / 4;
	}

	public getStartCharacter(tokenIndex: number): number {
		return this._tokens[4 * tokenIndex + 1];
	}

	public getEndCharacter(tokenIndex: number): number {
		return this._tokens[4 * tokenIndex + 2];
	}

	public getMetadata(tokenIndex: number): number {
		return this._tokens[4 * tokenIndex + 3];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/tokens/sparseTokensStore.ts]---
Location: vscode-main/src/vs/editor/common/tokens/sparseTokensStore.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from '../../../base/common/arrays.js';
import { IRange, Range } from '../core/range.js';
import { LineTokens } from './lineTokens.js';
import { SparseMultilineTokens } from './sparseMultilineTokens.js';
import { ILanguageIdCodec } from '../languages.js';
import { MetadataConsts } from '../encodedTokenAttributes.js';
import { ITextModel } from '../model.js';

/**
 * Represents sparse tokens in a text model.
 */
export class SparseTokensStore {

	private _pieces: SparseMultilineTokens[];
	private _isComplete: boolean;
	private readonly _languageIdCodec: ILanguageIdCodec;

	constructor(languageIdCodec: ILanguageIdCodec) {
		this._pieces = [];
		this._isComplete = false;
		this._languageIdCodec = languageIdCodec;
	}

	public flush(): void {
		this._pieces = [];
		this._isComplete = false;
	}

	public isEmpty(): boolean {
		return (this._pieces.length === 0);
	}

	public set(pieces: SparseMultilineTokens[] | null, isComplete: boolean, textModel: ITextModel | undefined = undefined): void {
		this._pieces = pieces || [];
		this._isComplete = isComplete;

		if (textModel) {
			for (const p of this._pieces) {
				p.reportIfInvalid(textModel);
			}
		}
	}

	public setPartial(_range: Range, pieces: SparseMultilineTokens[]): Range {
		// console.log(`setPartial ${_range} ${pieces.map(p => p.toString()).join(', ')}`);

		let range = _range;
		if (pieces.length > 0) {
			const _firstRange = pieces[0].getRange();
			const _lastRange = pieces[pieces.length - 1].getRange();
			if (!_firstRange || !_lastRange) {
				return _range;
			}
			range = _range.plusRange(_firstRange).plusRange(_lastRange);
		}

		let insertPosition: { index: number } | null = null;
		for (let i = 0, len = this._pieces.length; i < len; i++) {
			const piece = this._pieces[i];
			if (piece.endLineNumber < range.startLineNumber) {
				// this piece is before the range
				continue;
			}

			if (piece.startLineNumber > range.endLineNumber) {
				// this piece is after the range, so mark the spot before this piece
				// as a good insertion position and stop looping
				insertPosition = insertPosition || { index: i };
				break;
			}

			// this piece might intersect with the range
			piece.removeTokens(range);

			if (piece.isEmpty()) {
				// remove the piece if it became empty
				this._pieces.splice(i, 1);
				i--;
				len--;
				continue;
			}

			if (piece.endLineNumber < range.startLineNumber) {
				// after removal, this piece is before the range
				continue;
			}

			if (piece.startLineNumber > range.endLineNumber) {
				// after removal, this piece is after the range
				insertPosition = insertPosition || { index: i };
				continue;
			}

			// after removal, this piece contains the range
			const [a, b] = piece.split(range);
			if (a.isEmpty()) {
				// this piece is actually after the range
				insertPosition = insertPosition || { index: i };
				continue;
			}
			if (b.isEmpty()) {
				// this piece is actually before the range
				continue;
			}
			this._pieces.splice(i, 1, a, b);
			i++;
			len++;

			insertPosition = insertPosition || { index: i };
		}

		insertPosition = insertPosition || { index: this._pieces.length };

		if (pieces.length > 0) {
			this._pieces = arrays.arrayInsert(this._pieces, insertPosition.index, pieces);
		}

		// console.log(`I HAVE ${this._pieces.length} pieces`);
		// console.log(`${this._pieces.map(p => p.toString()).join('\n')}`);

		return range;
	}

	public isComplete(): boolean {
		return this._isComplete;
	}

	public addSparseTokens(lineNumber: number, aTokens: LineTokens): LineTokens {
		if (aTokens.getTextLength() === 0) {
			// Don't do anything for empty lines
			return aTokens;
		}

		const pieces = this._pieces;

		if (pieces.length === 0) {
			return aTokens;
		}

		const pieceIndex = SparseTokensStore._findFirstPieceWithLine(pieces, lineNumber);
		const bTokens = pieces[pieceIndex].getLineTokens(lineNumber);

		if (!bTokens) {
			return aTokens;
		}

		const aLen = aTokens.getCount();
		const bLen = bTokens.getCount();

		let aIndex = 0;
		const result: number[] = [];
		let resultLen = 0;
		let lastEndOffset = 0;

		const emitToken = (endOffset: number, metadata: number) => {
			if (endOffset === lastEndOffset) {
				return;
			}
			lastEndOffset = endOffset;
			result[resultLen++] = endOffset;
			result[resultLen++] = metadata;
		};

		for (let bIndex = 0; bIndex < bLen; bIndex++) {
			// bTokens is not validated yet, but aTokens is. We want to make sure that the LineTokens we return
			// are valid, so we clamp the ranges to ensure that.
			const bStartCharacter = Math.min(bTokens.getStartCharacter(bIndex), aTokens.getTextLength());
			const bEndCharacter = Math.min(bTokens.getEndCharacter(bIndex), aTokens.getTextLength());
			const bMetadata = bTokens.getMetadata(bIndex);

			const bMask = (
				((bMetadata & MetadataConsts.SEMANTIC_USE_ITALIC) ? MetadataConsts.ITALIC_MASK : 0)
				| ((bMetadata & MetadataConsts.SEMANTIC_USE_BOLD) ? MetadataConsts.BOLD_MASK : 0)
				| ((bMetadata & MetadataConsts.SEMANTIC_USE_UNDERLINE) ? MetadataConsts.UNDERLINE_MASK : 0)
				| ((bMetadata & MetadataConsts.SEMANTIC_USE_STRIKETHROUGH) ? MetadataConsts.STRIKETHROUGH_MASK : 0)
				| ((bMetadata & MetadataConsts.SEMANTIC_USE_FOREGROUND) ? MetadataConsts.FOREGROUND_MASK : 0)
				| ((bMetadata & MetadataConsts.SEMANTIC_USE_BACKGROUND) ? MetadataConsts.BACKGROUND_MASK : 0)
			) >>> 0;
			const aMask = (~bMask) >>> 0;

			// push any token from `a` that is before `b`
			while (aIndex < aLen && aTokens.getEndOffset(aIndex) <= bStartCharacter) {
				emitToken(aTokens.getEndOffset(aIndex), aTokens.getMetadata(aIndex));
				aIndex++;
			}

			// push the token from `a` if it intersects the token from `b`
			if (aIndex < aLen && aTokens.getStartOffset(aIndex) < bStartCharacter) {
				emitToken(bStartCharacter, aTokens.getMetadata(aIndex));
			}

			// skip any tokens from `a` that are contained inside `b`
			while (aIndex < aLen && aTokens.getEndOffset(aIndex) < bEndCharacter) {
				emitToken(aTokens.getEndOffset(aIndex), (aTokens.getMetadata(aIndex) & aMask) | (bMetadata & bMask));
				aIndex++;
			}

			if (aIndex < aLen) {
				emitToken(bEndCharacter, (aTokens.getMetadata(aIndex) & aMask) | (bMetadata & bMask));
				if (aTokens.getEndOffset(aIndex) === bEndCharacter) {
					// `a` ends exactly at the same spot as `b`!
					aIndex++;
				}
			} else {
				const aMergeIndex = Math.min(Math.max(0, aIndex - 1), aLen - 1);

				// push the token from `b`
				emitToken(bEndCharacter, (aTokens.getMetadata(aMergeIndex) & aMask) | (bMetadata & bMask));
			}
		}

		// push the remaining tokens from `a`
		while (aIndex < aLen) {
			emitToken(aTokens.getEndOffset(aIndex), aTokens.getMetadata(aIndex));
			aIndex++;
		}

		return new LineTokens(new Uint32Array(result), aTokens.getLineContent(), this._languageIdCodec);
	}

	private static _findFirstPieceWithLine(pieces: SparseMultilineTokens[], lineNumber: number): number {
		let low = 0;
		let high = pieces.length - 1;

		while (low < high) {
			let mid = low + Math.floor((high - low) / 2);

			if (pieces[mid].endLineNumber < lineNumber) {
				low = mid + 1;
			} else if (pieces[mid].startLineNumber > lineNumber) {
				high = mid - 1;
			} else {
				while (mid > low && pieces[mid - 1].startLineNumber <= lineNumber && lineNumber <= pieces[mid - 1].endLineNumber) {
					mid--;
				}
				return mid;
			}
		}

		return low;
	}

	public acceptEdit(range: IRange, eolCount: number, firstLineLength: number, lastLineLength: number, firstCharCode: number): void {
		for (let i = 0; i < this._pieces.length; i++) {
			const piece = this._pieces[i];
			piece.acceptEdit(range, eolCount, firstLineLength, lastLineLength, firstCharCode);

			if (piece.isEmpty()) {
				// Remove empty pieces
				this._pieces.splice(i, 1);
				i--;
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/tokens/tokenWithTextArray.ts]---
Location: vscode-main/src/vs/editor/common/tokens/tokenWithTextArray.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { OffsetRange } from '../core/ranges/offsetRange.js';
import { ILanguageIdCodec } from '../languages.js';
import { LineTokens } from './lineTokens.js';

/**
 * This class represents a sequence of tokens.
 * Conceptually, each token has a length and a metadata number.
 * A token array might be used to annotate a string with metadata.
 * Use {@link TokenWithTextArrayBuilder} to efficiently create a token array.
 *
 * TODO: Make this class more efficient (e.g. by using a Int32Array).
*/
export class TokenWithTextArray {
	public static fromLineTokens(lineTokens: LineTokens): TokenWithTextArray {
		const tokenInfo: TokenWithTextInfo[] = [];
		for (let i = 0; i < lineTokens.getCount(); i++) {
			tokenInfo.push(new TokenWithTextInfo(lineTokens.getTokenText(i), lineTokens.getMetadata(i)));
		}
		return TokenWithTextArray.create(tokenInfo);
	}

	public static create(tokenInfo: TokenWithTextInfo[]): TokenWithTextArray {
		return new TokenWithTextArray(tokenInfo);
	}

	private constructor(
		private readonly _tokenInfo: TokenWithTextInfo[],
	) { }

	public toLineTokens(decoder: ILanguageIdCodec): LineTokens {
		return LineTokens.createFromTextAndMetadata(this.map((_r, t) => ({ text: t.text, metadata: t.metadata })), decoder);
	}

	public forEach(cb: (range: OffsetRange, tokenInfo: TokenWithTextInfo) => void): void {
		let lengthSum = 0;
		for (const tokenInfo of this._tokenInfo) {
			const range = new OffsetRange(lengthSum, lengthSum + tokenInfo.text.length);
			cb(range, tokenInfo);
			lengthSum += tokenInfo.text.length;
		}
	}

	public map<T>(cb: (range: OffsetRange, tokenInfo: TokenWithTextInfo) => T): T[] {
		const result: T[] = [];
		let lengthSum = 0;
		for (const tokenInfo of this._tokenInfo) {
			const range = new OffsetRange(lengthSum, lengthSum + tokenInfo.text.length);
			result.push(cb(range, tokenInfo));
			lengthSum += tokenInfo.text.length;
		}
		return result;
	}

	public slice(range: OffsetRange): TokenWithTextArray {
		const result: TokenWithTextInfo[] = [];
		let lengthSum = 0;
		for (const tokenInfo of this._tokenInfo) {
			const tokenStart = lengthSum;
			const tokenEndEx = tokenStart + tokenInfo.text.length;
			if (tokenEndEx > range.start) {
				if (tokenStart >= range.endExclusive) {
					break;
				}

				const deltaBefore = Math.max(0, range.start - tokenStart);
				const deltaAfter = Math.max(0, tokenEndEx - range.endExclusive);

				result.push(new TokenWithTextInfo(tokenInfo.text.slice(deltaBefore, tokenInfo.text.length - deltaAfter), tokenInfo.metadata));
			}

			lengthSum += tokenInfo.text.length;
		}
		return TokenWithTextArray.create(result);
	}

	public append(other: TokenWithTextArray): TokenWithTextArray {
		const result: TokenWithTextInfo[] = this._tokenInfo.concat(other._tokenInfo);
		return TokenWithTextArray.create(result);
	}
}

export type TokenMetadata = number;

export class TokenWithTextInfo {
	constructor(
		public readonly text: string,
		public readonly metadata: TokenMetadata,
	) { }
}

/**
 * TODO: Make this class more efficient (e.g. by using a Int32Array).
*/
export class TokenWithTextArrayBuilder {
	private readonly _tokens: TokenWithTextInfo[] = [];

	public add(text: string, metadata: TokenMetadata): void {
		this._tokens.push(new TokenWithTextInfo(text, metadata));
	}

	public build(): TokenWithTextArray {
		return TokenWithTextArray.create(this._tokens);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewLayout/lineDecorations.ts]---
Location: vscode-main/src/vs/editor/common/viewLayout/lineDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as strings from '../../../base/common/strings.js';
import { Constants } from '../../../base/common/uint.js';
import { InlineDecoration, InlineDecorationType } from '../viewModel/inlineDecorations.js';
import { LinePartMetadata } from './linePart.js';

export class LineDecoration {
	_lineDecorationBrand: void = undefined;

	constructor(
		public readonly startColumn: number,
		public readonly endColumn: number,
		public readonly className: string,
		public readonly type: InlineDecorationType
	) {
	}

	private static _equals(a: LineDecoration, b: LineDecoration): boolean {
		return (
			a.startColumn === b.startColumn
			&& a.endColumn === b.endColumn
			&& a.className === b.className
			&& a.type === b.type
		);
	}

	public static equalsArr(a: readonly LineDecoration[], b: readonly LineDecoration[]): boolean {
		const aLen = a.length;
		const bLen = b.length;
		if (aLen !== bLen) {
			return false;
		}
		for (let i = 0; i < aLen; i++) {
			if (!LineDecoration._equals(a[i], b[i])) {
				return false;
			}
		}
		return true;
	}

	public static extractWrapped(arr: LineDecoration[], startOffset: number, endOffset: number): LineDecoration[] {
		if (arr.length === 0) {
			return arr;
		}
		const startColumn = startOffset + 1;
		const endColumn = endOffset + 1;
		const lineLength = endOffset - startOffset;
		const r = [];
		let rLength = 0;
		for (const dec of arr) {
			if (dec.endColumn <= startColumn || dec.startColumn >= endColumn) {
				continue;
			}
			r[rLength++] = new LineDecoration(Math.max(1, dec.startColumn - startColumn + 1), Math.min(lineLength + 1, dec.endColumn - startColumn + 1), dec.className, dec.type);
		}
		return r;
	}

	public static filter(lineDecorations: InlineDecoration[], lineNumber: number, minLineColumn: number, maxLineColumn: number): LineDecoration[] {
		if (lineDecorations.length === 0) {
			return [];
		}

		const result: LineDecoration[] = [];
		let resultLen = 0;

		for (let i = 0, len = lineDecorations.length; i < len; i++) {
			const d = lineDecorations[i];
			const range = d.range;

			if (range.endLineNumber < lineNumber || range.startLineNumber > lineNumber) {
				// Ignore decorations that sit outside this line
				continue;
			}

			if (range.isEmpty() && (d.type === InlineDecorationType.Regular || d.type === InlineDecorationType.RegularAffectingLetterSpacing)) {
				// Ignore empty range decorations
				continue;
			}

			const startColumn = (range.startLineNumber === lineNumber ? range.startColumn : minLineColumn);
			const endColumn = (range.endLineNumber === lineNumber ? range.endColumn : maxLineColumn);

			result[resultLen++] = new LineDecoration(startColumn, endColumn, d.inlineClassName, d.type);
		}

		return result;
	}

	private static _typeCompare(a: InlineDecorationType, b: InlineDecorationType): number {
		const ORDER = [2, 0, 1, 3];
		return ORDER[a] - ORDER[b];
	}

	public static compare(a: LineDecoration, b: LineDecoration): number {
		if (a.startColumn !== b.startColumn) {
			return a.startColumn - b.startColumn;
		}

		if (a.endColumn !== b.endColumn) {
			return a.endColumn - b.endColumn;
		}

		const typeCmp = LineDecoration._typeCompare(a.type, b.type);
		if (typeCmp !== 0) {
			return typeCmp;
		}

		if (a.className !== b.className) {
			return a.className < b.className ? -1 : 1;
		}

		return 0;
	}
}

export class DecorationSegment {
	startOffset: number;
	endOffset: number;
	className: string;
	metadata: number;

	constructor(startOffset: number, endOffset: number, className: string, metadata: number) {
		this.startOffset = startOffset;
		this.endOffset = endOffset;
		this.className = className;
		this.metadata = metadata;
	}
}

class Stack {
	public count: number;
	private readonly stopOffsets: number[];
	private readonly classNames: string[];
	private readonly metadata: number[];

	constructor() {
		this.stopOffsets = [];
		this.classNames = [];
		this.metadata = [];
		this.count = 0;
	}

	private static _metadata(metadata: number[]): number {
		let result = 0;
		for (let i = 0, len = metadata.length; i < len; i++) {
			result |= metadata[i];
		}
		return result;
	}

	public consumeLowerThan(maxStopOffset: number, nextStartOffset: number, result: DecorationSegment[]): number {

		while (this.count > 0 && this.stopOffsets[0] < maxStopOffset) {
			let i = 0;

			// Take all equal stopping offsets
			while (i + 1 < this.count && this.stopOffsets[i] === this.stopOffsets[i + 1]) {
				i++;
			}

			// Basically we are consuming the first i + 1 elements of the stack
			result.push(new DecorationSegment(nextStartOffset, this.stopOffsets[i], this.classNames.join(' '), Stack._metadata(this.metadata)));
			nextStartOffset = this.stopOffsets[i] + 1;

			// Consume them
			this.stopOffsets.splice(0, i + 1);
			this.classNames.splice(0, i + 1);
			this.metadata.splice(0, i + 1);
			this.count -= (i + 1);
		}

		if (this.count > 0 && nextStartOffset < maxStopOffset) {
			result.push(new DecorationSegment(nextStartOffset, maxStopOffset - 1, this.classNames.join(' '), Stack._metadata(this.metadata)));
			nextStartOffset = maxStopOffset;
		}

		return nextStartOffset;
	}

	public insert(stopOffset: number, className: string, metadata: number): void {
		if (this.count === 0 || this.stopOffsets[this.count - 1] <= stopOffset) {
			// Insert at the end
			this.stopOffsets.push(stopOffset);
			this.classNames.push(className);
			this.metadata.push(metadata);
		} else {
			// Find the insertion position for `stopOffset`
			for (let i = 0; i < this.count; i++) {
				if (this.stopOffsets[i] >= stopOffset) {
					this.stopOffsets.splice(i, 0, stopOffset);
					this.classNames.splice(i, 0, className);
					this.metadata.splice(i, 0, metadata);
					break;
				}
			}
		}
		this.count++;
		return;
	}
}

export class LineDecorationsNormalizer {
	/**
	 * Normalize line decorations. Overlapping decorations will generate multiple segments
	 */
	public static normalize(lineContent: string, lineDecorations: LineDecoration[]): DecorationSegment[] {
		if (lineDecorations.length === 0) {
			return [];
		}

		const result: DecorationSegment[] = [];

		const stack = new Stack();
		let nextStartOffset = 0;

		for (let i = 0, len = lineDecorations.length; i < len; i++) {
			const d = lineDecorations[i];
			let startColumn = d.startColumn;
			let endColumn = d.endColumn;
			const className = d.className;
			const metadata = (
				d.type === InlineDecorationType.Before
					? LinePartMetadata.PSEUDO_BEFORE
					: d.type === InlineDecorationType.After
						? LinePartMetadata.PSEUDO_AFTER
						: 0
			);

			// If the position would end up in the middle of a high-low surrogate pair, we move it to before the pair
			if (startColumn > 1) {
				const charCodeBefore = lineContent.charCodeAt(startColumn - 2);
				if (strings.isHighSurrogate(charCodeBefore)) {
					startColumn--;
				}
			}

			if (endColumn > 1) {
				const charCodeBefore = lineContent.charCodeAt(endColumn - 2);
				if (strings.isHighSurrogate(charCodeBefore)) {
					endColumn--;
				}
			}

			const currentStartOffset = startColumn - 1;
			const currentEndOffset = endColumn - 2;

			nextStartOffset = stack.consumeLowerThan(currentStartOffset, nextStartOffset, result);

			if (stack.count === 0) {
				nextStartOffset = currentStartOffset;
			}
			stack.insert(currentEndOffset, className, metadata);
		}

		stack.consumeLowerThan(Constants.MAX_SAFE_SMALL_INTEGER, nextStartOffset, result);

		return result;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewLayout/lineHeights.ts]---
Location: vscode-main/src/vs/editor/common/viewLayout/lineHeights.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { binarySearch2 } from '../../../base/common/arrays.js';
import { intersection } from '../../../base/common/collections.js';

export class CustomLine {

	public index: number;
	public lineNumber: number;
	public specialHeight: number;
	public prefixSum: number;
	public maximumSpecialHeight: number;
	public decorationId: string;
	public deleted: boolean;

	constructor(decorationId: string, index: number, lineNumber: number, specialHeight: number, prefixSum: number) {
		this.decorationId = decorationId;
		this.index = index;
		this.lineNumber = lineNumber;
		this.specialHeight = specialHeight;
		this.prefixSum = prefixSum;
		this.maximumSpecialHeight = specialHeight;
		this.deleted = false;
	}
}

/**
 * Manages line heights in the editor with support for custom line heights from decorations.
 *
 * This class maintains an ordered collection of line heights, where each line can have either
 * the default height or a custom height specified by decorations. It supports efficient querying
 * of individual line heights as well as accumulated heights up to a specific line.
 *
 * Line heights are stored in a sorted array for efficient binary search operations. Each line
 * with custom height is represented by a {@link CustomLine} object which tracks its special height,
 * accumulated height prefix sum, and associated decoration ID.
 *
 * The class optimizes performance by:
 * - Using binary search to locate lines in the ordered array
 * - Batching updates through a pending changes mechanism
 * - Computing prefix sums for O(1) accumulated height lookup
 * - Tracking maximum height for lines with multiple decorations
 * - Efficiently handling document changes (line insertions and deletions)
 *
 * When lines are inserted or deleted, the manager updates line numbers and prefix sums
 * for all affected lines. It also handles special cases like decorations that span
 * the insertion/deletion points by re-applying those decorations appropriately.
 *
 * All query operations automatically commit pending changes to ensure consistent results.
 * Clients can modify line heights by adding or removing custom line height decorations,
 * which are tracked by their unique decoration IDs.
 */
export class LineHeightsManager {

	private _decorationIDToCustomLine: ArrayMap<string, CustomLine> = new ArrayMap<string, CustomLine>();
	private _orderedCustomLines: CustomLine[] = [];
	private _pendingSpecialLinesToInsert: CustomLine[] = [];
	private _invalidIndex: number = 0;
	private _defaultLineHeight: number;
	private _hasPending: boolean = false;

	constructor(defaultLineHeight: number, customLineHeightData: ICustomLineHeightData[]) {
		this._defaultLineHeight = defaultLineHeight;
		if (customLineHeightData.length > 0) {
			for (const data of customLineHeightData) {
				this.insertOrChangeCustomLineHeight(data.decorationId, data.startLineNumber, data.endLineNumber, data.lineHeight);
			}
			this.commit();
		}
	}

	set defaultLineHeight(defaultLineHeight: number) {
		this._defaultLineHeight = defaultLineHeight;
	}

	get defaultLineHeight() {
		return this._defaultLineHeight;
	}

	public removeCustomLineHeight(decorationID: string): void {
		const customLines = this._decorationIDToCustomLine.get(decorationID);
		if (!customLines) {
			return;
		}
		this._decorationIDToCustomLine.delete(decorationID);
		for (const customLine of customLines) {
			customLine.deleted = true;
			this._invalidIndex = Math.min(this._invalidIndex, customLine.index);
		}
		this._hasPending = true;
	}

	public insertOrChangeCustomLineHeight(decorationId: string, startLineNumber: number, endLineNumber: number, lineHeight: number): void {
		this.removeCustomLineHeight(decorationId);
		for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
			const customLine = new CustomLine(decorationId, -1, lineNumber, lineHeight, 0);
			this._pendingSpecialLinesToInsert.push(customLine);
		}
		this._hasPending = true;
	}

	public heightForLineNumber(lineNumber: number): number {
		const searchIndex = this._binarySearchOverOrderedCustomLinesArray(lineNumber);
		if (searchIndex >= 0) {
			return this._orderedCustomLines[searchIndex].maximumSpecialHeight;
		}
		return this._defaultLineHeight;
	}

	public getAccumulatedLineHeightsIncludingLineNumber(lineNumber: number): number {
		const searchIndex = this._binarySearchOverOrderedCustomLinesArray(lineNumber);
		if (searchIndex >= 0) {
			return this._orderedCustomLines[searchIndex].prefixSum + this._orderedCustomLines[searchIndex].maximumSpecialHeight;
		}
		if (searchIndex === -1) {
			return this._defaultLineHeight * lineNumber;
		}
		const modifiedIndex = -(searchIndex + 1);
		const previousSpecialLine = this._orderedCustomLines[modifiedIndex - 1];
		return previousSpecialLine.prefixSum + previousSpecialLine.maximumSpecialHeight + this._defaultLineHeight * (lineNumber - previousSpecialLine.lineNumber);
	}

	public onLinesDeleted(fromLineNumber: number, toLineNumber: number): void {
		const deleteCount = toLineNumber - fromLineNumber + 1;
		const numberOfCustomLines = this._orderedCustomLines.length;
		const candidateStartIndexOfDeletion = this._binarySearchOverOrderedCustomLinesArray(fromLineNumber);
		let startIndexOfDeletion: number;
		if (candidateStartIndexOfDeletion >= 0) {
			startIndexOfDeletion = candidateStartIndexOfDeletion;
			for (let i = candidateStartIndexOfDeletion - 1; i >= 0; i--) {
				if (this._orderedCustomLines[i].lineNumber === fromLineNumber) {
					startIndexOfDeletion--;
				} else {
					break;
				}
			}
		} else {
			startIndexOfDeletion = candidateStartIndexOfDeletion === -(numberOfCustomLines + 1) && candidateStartIndexOfDeletion !== -1 ? numberOfCustomLines - 1 : - (candidateStartIndexOfDeletion + 1);
		}
		const candidateEndIndexOfDeletion = this._binarySearchOverOrderedCustomLinesArray(toLineNumber);
		let endIndexOfDeletion: number;
		if (candidateEndIndexOfDeletion >= 0) {
			endIndexOfDeletion = candidateEndIndexOfDeletion;
			for (let i = candidateEndIndexOfDeletion + 1; i < numberOfCustomLines; i++) {
				if (this._orderedCustomLines[i].lineNumber === toLineNumber) {
					endIndexOfDeletion++;
				} else {
					break;
				}
			}
		} else {
			endIndexOfDeletion = candidateEndIndexOfDeletion === -(numberOfCustomLines + 1) && candidateEndIndexOfDeletion !== -1 ? numberOfCustomLines - 1 : - (candidateEndIndexOfDeletion + 1);
		}
		const isEndIndexBiggerThanStartIndex = endIndexOfDeletion > startIndexOfDeletion;
		const isEndIndexEqualToStartIndexAndCoversCustomLine = endIndexOfDeletion === startIndexOfDeletion
			&& this._orderedCustomLines[startIndexOfDeletion]
			&& this._orderedCustomLines[startIndexOfDeletion].lineNumber >= fromLineNumber
			&& this._orderedCustomLines[startIndexOfDeletion].lineNumber <= toLineNumber;

		if (isEndIndexBiggerThanStartIndex || isEndIndexEqualToStartIndexAndCoversCustomLine) {
			let maximumSpecialHeightOnDeletedInterval = 0;
			for (let i = startIndexOfDeletion; i <= endIndexOfDeletion; i++) {
				maximumSpecialHeightOnDeletedInterval = Math.max(maximumSpecialHeightOnDeletedInterval, this._orderedCustomLines[i].maximumSpecialHeight);
			}
			let prefixSumOnDeletedInterval = 0;
			if (startIndexOfDeletion > 0) {
				const previousSpecialLine = this._orderedCustomLines[startIndexOfDeletion - 1];
				prefixSumOnDeletedInterval = previousSpecialLine.prefixSum + previousSpecialLine.maximumSpecialHeight + this._defaultLineHeight * (fromLineNumber - previousSpecialLine.lineNumber - 1);
			} else {
				prefixSumOnDeletedInterval = fromLineNumber > 0 ? (fromLineNumber - 1) * this._defaultLineHeight : 0;
			}
			const firstSpecialLineDeleted = this._orderedCustomLines[startIndexOfDeletion];
			const lastSpecialLineDeleted = this._orderedCustomLines[endIndexOfDeletion];
			const firstSpecialLineAfterDeletion = this._orderedCustomLines[endIndexOfDeletion + 1];
			const heightOfFirstLineAfterDeletion = firstSpecialLineAfterDeletion && firstSpecialLineAfterDeletion.lineNumber === toLineNumber + 1 ? firstSpecialLineAfterDeletion.maximumSpecialHeight : this._defaultLineHeight;
			const totalHeightDeleted = lastSpecialLineDeleted.prefixSum
				+ lastSpecialLineDeleted.maximumSpecialHeight
				- firstSpecialLineDeleted.prefixSum
				+ this._defaultLineHeight * (toLineNumber - lastSpecialLineDeleted.lineNumber)
				+ this._defaultLineHeight * (firstSpecialLineDeleted.lineNumber - fromLineNumber)
				+ heightOfFirstLineAfterDeletion - maximumSpecialHeightOnDeletedInterval;

			const decorationIdsSeen = new Set<string>();
			const newOrderedCustomLines: CustomLine[] = [];
			const newDecorationIDToSpecialLine = new ArrayMap<string, CustomLine>();
			let numberOfDeletions = 0;
			for (let i = 0; i < this._orderedCustomLines.length; i++) {
				const customLine = this._orderedCustomLines[i];
				if (i < startIndexOfDeletion) {
					newOrderedCustomLines.push(customLine);
					newDecorationIDToSpecialLine.add(customLine.decorationId, customLine);
				} else if (i >= startIndexOfDeletion && i <= endIndexOfDeletion) {
					const decorationId = customLine.decorationId;
					if (!decorationIdsSeen.has(decorationId)) {
						customLine.index -= numberOfDeletions;
						customLine.lineNumber = fromLineNumber;
						customLine.prefixSum = prefixSumOnDeletedInterval;
						customLine.maximumSpecialHeight = maximumSpecialHeightOnDeletedInterval;
						newOrderedCustomLines.push(customLine);
						newDecorationIDToSpecialLine.add(customLine.decorationId, customLine);
					} else {
						numberOfDeletions++;
					}
				} else if (i > endIndexOfDeletion) {
					customLine.index -= numberOfDeletions;
					customLine.lineNumber -= deleteCount;
					customLine.prefixSum -= totalHeightDeleted;
					newOrderedCustomLines.push(customLine);
					newDecorationIDToSpecialLine.add(customLine.decorationId, customLine);
				}
				decorationIdsSeen.add(customLine.decorationId);
			}
			this._orderedCustomLines = newOrderedCustomLines;
			this._decorationIDToCustomLine = newDecorationIDToSpecialLine;
		} else {
			const totalHeightDeleted = deleteCount * this._defaultLineHeight;
			for (let i = endIndexOfDeletion; i < this._orderedCustomLines.length; i++) {
				const customLine = this._orderedCustomLines[i];
				if (customLine.lineNumber > toLineNumber) {
					customLine.lineNumber -= deleteCount;
					customLine.prefixSum -= totalHeightDeleted;
				}
			}
		}
	}

	public onLinesInserted(fromLineNumber: number, toLineNumber: number): void {
		const insertCount = toLineNumber - fromLineNumber + 1;
		const candidateStartIndexOfInsertion = this._binarySearchOverOrderedCustomLinesArray(fromLineNumber);
		let startIndexOfInsertion: number;
		if (candidateStartIndexOfInsertion >= 0) {
			startIndexOfInsertion = candidateStartIndexOfInsertion;
			for (let i = candidateStartIndexOfInsertion - 1; i >= 0; i--) {
				if (this._orderedCustomLines[i].lineNumber === fromLineNumber) {
					startIndexOfInsertion--;
				} else {
					break;
				}
			}
		} else {
			startIndexOfInsertion = -(candidateStartIndexOfInsertion + 1);
		}
		const toReAdd: ICustomLineHeightData[] = [];
		const decorationsImmediatelyAfter = new Set<string>();
		for (let i = startIndexOfInsertion; i < this._orderedCustomLines.length; i++) {
			if (this._orderedCustomLines[i].lineNumber === fromLineNumber) {
				decorationsImmediatelyAfter.add(this._orderedCustomLines[i].decorationId);
			}
		}
		const decorationsImmediatelyBefore = new Set<string>();
		for (let i = startIndexOfInsertion - 1; i >= 0; i--) {
			if (this._orderedCustomLines[i].lineNumber === fromLineNumber - 1) {
				decorationsImmediatelyBefore.add(this._orderedCustomLines[i].decorationId);
			}
		}
		const decorationsWithGaps = intersection(decorationsImmediatelyBefore, decorationsImmediatelyAfter);
		for (let i = startIndexOfInsertion; i < this._orderedCustomLines.length; i++) {
			this._orderedCustomLines[i].lineNumber += insertCount;
			this._orderedCustomLines[i].prefixSum += this._defaultLineHeight * insertCount;
		}

		if (decorationsWithGaps.size > 0) {
			for (const decorationId of decorationsWithGaps) {
				const decoration = this._decorationIDToCustomLine.get(decorationId);
				if (decoration) {
					const startLineNumber = decoration.reduce((min, l) => Math.min(min, l.lineNumber), fromLineNumber); // min
					const endLineNumber = decoration.reduce((max, l) => Math.max(max, l.lineNumber), fromLineNumber); // max
					const lineHeight = decoration.reduce((max, l) => Math.max(max, l.specialHeight), 0);
					toReAdd.push({
						decorationId,
						startLineNumber,
						endLineNumber,
						lineHeight
					});
				}
			}

			for (const dec of toReAdd) {
				this.insertOrChangeCustomLineHeight(dec.decorationId, dec.startLineNumber, dec.endLineNumber, dec.lineHeight);
			}
			this.commit();
		}
	}

	public commit(): void {
		if (!this._hasPending) {
			return;
		}
		for (const pendingChange of this._pendingSpecialLinesToInsert) {
			const candidateInsertionIndex = this._binarySearchOverOrderedCustomLinesArray(pendingChange.lineNumber);
			const insertionIndex = candidateInsertionIndex >= 0 ? candidateInsertionIndex : -(candidateInsertionIndex + 1);
			this._orderedCustomLines.splice(insertionIndex, 0, pendingChange);
			this._invalidIndex = Math.min(this._invalidIndex, insertionIndex);
		}
		this._pendingSpecialLinesToInsert = [];
		const newDecorationIDToSpecialLine = new ArrayMap<string, CustomLine>();
		const newOrderedSpecialLines: CustomLine[] = [];

		for (let i = 0; i < this._invalidIndex; i++) {
			const customLine = this._orderedCustomLines[i];
			newOrderedSpecialLines.push(customLine);
			newDecorationIDToSpecialLine.add(customLine.decorationId, customLine);
		}

		let numberOfDeletions = 0;
		let previousSpecialLine: CustomLine | undefined = (this._invalidIndex > 0) ? newOrderedSpecialLines[this._invalidIndex - 1] : undefined;
		for (let i = this._invalidIndex; i < this._orderedCustomLines.length; i++) {
			const customLine = this._orderedCustomLines[i];
			if (customLine.deleted) {
				numberOfDeletions++;
				continue;
			}
			customLine.index = i - numberOfDeletions;
			if (previousSpecialLine && previousSpecialLine.lineNumber === customLine.lineNumber) {
				customLine.maximumSpecialHeight = previousSpecialLine.maximumSpecialHeight;
				customLine.prefixSum = previousSpecialLine.prefixSum;
			} else {
				let maximumSpecialHeight = customLine.specialHeight;
				for (let j = i; j < this._orderedCustomLines.length; j++) {
					const nextSpecialLine = this._orderedCustomLines[j];
					if (nextSpecialLine.deleted) {
						continue;
					}
					if (nextSpecialLine.lineNumber !== customLine.lineNumber) {
						break;
					}
					maximumSpecialHeight = Math.max(maximumSpecialHeight, nextSpecialLine.specialHeight);
				}
				customLine.maximumSpecialHeight = maximumSpecialHeight;

				let prefixSum: number;
				if (previousSpecialLine) {
					prefixSum = previousSpecialLine.prefixSum + previousSpecialLine.maximumSpecialHeight + this._defaultLineHeight * (customLine.lineNumber - previousSpecialLine.lineNumber - 1);
				} else {
					prefixSum = this._defaultLineHeight * (customLine.lineNumber - 1);
				}
				customLine.prefixSum = prefixSum;
			}
			previousSpecialLine = customLine;
			newOrderedSpecialLines.push(customLine);
			newDecorationIDToSpecialLine.add(customLine.decorationId, customLine);
		}
		this._orderedCustomLines = newOrderedSpecialLines;
		this._decorationIDToCustomLine = newDecorationIDToSpecialLine;
		this._invalidIndex = Infinity;
		this._hasPending = false;
	}

	private _binarySearchOverOrderedCustomLinesArray(lineNumber: number): number {
		return binarySearch2(this._orderedCustomLines.length, (index) => {
			const line = this._orderedCustomLines[index];
			if (line.lineNumber === lineNumber) {
				return 0;
			} else if (line.lineNumber < lineNumber) {
				return -1;
			} else {
				return 1;
			}
		});
	}
}

export interface ICustomLineHeightData {
	readonly decorationId: string;
	readonly startLineNumber: number;
	readonly endLineNumber: number;
	readonly lineHeight: number;
}

class ArrayMap<K, T> {

	private _map: Map<K, T[]> = new Map<K, T[]>();

	constructor() { }

	add(key: K, value: T) {
		const array = this._map.get(key);
		if (!array) {
			this._map.set(key, [value]);
		} else {
			array.push(value);
		}
	}

	get(key: K): T[] | undefined {
		return this._map.get(key);
	}

	delete(key: K): void {
		this._map.delete(key);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewLayout/linePart.ts]---
Location: vscode-main/src/vs/editor/common/viewLayout/linePart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum LinePartMetadata {
	IS_WHITESPACE = 1,
	PSEUDO_BEFORE = 2,
	PSEUDO_AFTER = 4,

	IS_WHITESPACE_MASK = 0b001,
	PSEUDO_BEFORE_MASK = 0b010,
	PSEUDO_AFTER_MASK = 0b100,
}

export class LinePart {
	_linePartBrand: void = undefined;

	constructor(
		/**
		 * last char index of this token (not inclusive).
		 */
		public readonly endIndex: number,
		public readonly type: string,
		public readonly metadata: number,
		public readonly containsRTL: boolean
	) { }

	public isWhitespace(): boolean {
		return (this.metadata & LinePartMetadata.IS_WHITESPACE_MASK ? true : false);
	}

	public isPseudoAfter(): boolean {
		return (this.metadata & LinePartMetadata.PSEUDO_AFTER_MASK ? true : false);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewLayout/linesLayout.ts]---
Location: vscode-main/src/vs/editor/common/viewLayout/linesLayout.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEditorWhitespace, IPartialViewLinesViewportData, ILineHeightChangeAccessor, IViewWhitespaceViewportData, IWhitespaceChangeAccessor } from '../viewModel.js';
import * as strings from '../../../base/common/strings.js';
import { ICustomLineHeightData, LineHeightsManager } from './lineHeights.js';

interface IPendingChange { id: string; newAfterLineNumber: number; newHeight: number }
interface IPendingRemove { id: string }

class PendingChanges {
	private _hasPending: boolean;
	private _inserts: EditorWhitespace[];
	private _changes: IPendingChange[];
	private _removes: IPendingRemove[];

	constructor() {
		this._hasPending = false;
		this._inserts = [];
		this._changes = [];
		this._removes = [];
	}

	public insert(x: EditorWhitespace): void {
		this._hasPending = true;
		this._inserts.push(x);
	}

	public change(x: IPendingChange): void {
		this._hasPending = true;
		this._changes.push(x);
	}

	public remove(x: IPendingRemove): void {
		this._hasPending = true;
		this._removes.push(x);
	}

	public commit(linesLayout: LinesLayout): void {
		if (!this._hasPending) {
			return;
		}

		const inserts = this._inserts;
		const changes = this._changes;
		const removes = this._removes;

		this._hasPending = false;
		this._inserts = [];
		this._changes = [];
		this._removes = [];

		linesLayout._commitPendingChanges(inserts, changes, removes);
	}
}

export class EditorWhitespace implements IEditorWhitespace {
	public id: string;
	public afterLineNumber: number;
	public ordinal: number;
	public height: number;
	public minWidth: number;
	public prefixSum: number;

	constructor(id: string, afterLineNumber: number, ordinal: number, height: number, minWidth: number) {
		this.id = id;
		this.afterLineNumber = afterLineNumber;
		this.ordinal = ordinal;
		this.height = height;
		this.minWidth = minWidth;
		this.prefixSum = 0;
	}
}

/**
 * Layouting of objects that take vertical space (by having a height) and push down other objects.
 *
 * These objects are basically either text (lines) or spaces between those lines (whitespaces).
 * This provides commodity operations for working with lines that contain whitespace that pushes lines lower (vertically).
 */
export class LinesLayout {

	private static INSTANCE_COUNT = 0;

	private readonly _instanceId: string;
	private readonly _pendingChanges: PendingChanges;
	private _lastWhitespaceId: number;
	private _arr: EditorWhitespace[];
	private _prefixSumValidIndex: number;
	private _minWidth: number;
	private _lineCount: number;
	private _paddingTop: number;
	private _paddingBottom: number;
	private _lineHeightsManager: LineHeightsManager;

	constructor(lineCount: number, defaultLineHeight: number, paddingTop: number, paddingBottom: number, customLineHeightData: ICustomLineHeightData[]) {
		this._instanceId = strings.singleLetterHash(++LinesLayout.INSTANCE_COUNT);
		this._pendingChanges = new PendingChanges();
		this._lastWhitespaceId = 0;
		this._arr = [];
		this._prefixSumValidIndex = -1;
		this._minWidth = -1; /* marker for not being computed */
		this._lineCount = lineCount;
		this._paddingTop = paddingTop;
		this._paddingBottom = paddingBottom;
		this._lineHeightsManager = new LineHeightsManager(defaultLineHeight, customLineHeightData);
	}

	/**
	 * Find the insertion index for a new value inside a sorted array of values.
	 * If the value is already present in the sorted array, the insertion index will be after the already existing value.
	 */
	public static findInsertionIndex(arr: EditorWhitespace[], afterLineNumber: number, ordinal: number): number {
		let low = 0;
		let high = arr.length;

		while (low < high) {
			const mid = ((low + high) >>> 1);

			if (afterLineNumber === arr[mid].afterLineNumber) {
				if (ordinal < arr[mid].ordinal) {
					high = mid;
				} else {
					low = mid + 1;
				}
			} else if (afterLineNumber < arr[mid].afterLineNumber) {
				high = mid;
			} else {
				low = mid + 1;
			}
		}

		return low;
	}

	/**
	 * Change the height of a line in pixels.
	 */
	public setDefaultLineHeight(lineHeight: number): void {
		this._lineHeightsManager.defaultLineHeight = lineHeight;
	}

	/**
	 * Changes the padding used to calculate vertical offsets.
	 */
	public setPadding(paddingTop: number, paddingBottom: number): void {
		this._paddingTop = paddingTop;
		this._paddingBottom = paddingBottom;
	}

	/**
	 * Set the number of lines.
	 *
	 * @param lineCount New number of lines.
	 */
	public onFlushed(lineCount: number, customLineHeightData: ICustomLineHeightData[]): void {
		this._lineCount = lineCount;
		this._lineHeightsManager = new LineHeightsManager(this._lineHeightsManager.defaultLineHeight, customLineHeightData);
	}

	public changeLineHeights(callback: (accessor: ILineHeightChangeAccessor) => void): boolean {
		let hadAChange = false;
		try {
			const accessor: ILineHeightChangeAccessor = {
				insertOrChangeCustomLineHeight: (decorationId: string, startLineNumber: number, endLineNumber: number, lineHeight: number): void => {
					hadAChange = true;
					this._lineHeightsManager.insertOrChangeCustomLineHeight(decorationId, startLineNumber, endLineNumber, lineHeight);
				},
				removeCustomLineHeight: (decorationId: string): void => {
					hadAChange = true;
					this._lineHeightsManager.removeCustomLineHeight(decorationId);
				}
			};
			callback(accessor);
		} finally {
			this._lineHeightsManager.commit();
		}
		return hadAChange;
	}

	public changeWhitespace(callback: (accessor: IWhitespaceChangeAccessor) => void): boolean {
		let hadAChange = false;
		try {
			const accessor: IWhitespaceChangeAccessor = {
				insertWhitespace: (afterLineNumber: number, ordinal: number, heightInPx: number, minWidth: number): string => {
					hadAChange = true;
					afterLineNumber = afterLineNumber | 0;
					ordinal = ordinal | 0;
					heightInPx = heightInPx | 0;
					minWidth = minWidth | 0;
					const id = this._instanceId + (++this._lastWhitespaceId);
					this._pendingChanges.insert(new EditorWhitespace(id, afterLineNumber, ordinal, heightInPx, minWidth));
					return id;
				},
				changeOneWhitespace: (id: string, newAfterLineNumber: number, newHeight: number): void => {
					hadAChange = true;
					newAfterLineNumber = newAfterLineNumber | 0;
					newHeight = newHeight | 0;
					this._pendingChanges.change({ id, newAfterLineNumber, newHeight });
				},
				removeWhitespace: (id: string): void => {
					hadAChange = true;
					this._pendingChanges.remove({ id });
				}
			};
			callback(accessor);
		} finally {
			this._pendingChanges.commit(this);
		}
		return hadAChange;
	}

	public _commitPendingChanges(inserts: EditorWhitespace[], changes: IPendingChange[], removes: IPendingRemove[]): void {
		if (inserts.length > 0 || removes.length > 0) {
			this._minWidth = -1; /* marker for not being computed */
		}

		if (inserts.length + changes.length + removes.length <= 1) {
			// when only one thing happened, handle it "delicately"
			for (const insert of inserts) {
				this._insertWhitespace(insert);
			}
			for (const change of changes) {
				this._changeOneWhitespace(change.id, change.newAfterLineNumber, change.newHeight);
			}
			for (const remove of removes) {
				const index = this._findWhitespaceIndex(remove.id);
				if (index === -1) {
					continue;
				}
				this._removeWhitespace(index);
			}
			return;
		}

		// simply rebuild the entire datastructure

		const toRemove = new Set<string>();
		for (const remove of removes) {
			toRemove.add(remove.id);
		}

		const toChange = new Map<string, IPendingChange>();
		for (const change of changes) {
			toChange.set(change.id, change);
		}

		const applyRemoveAndChange = (whitespaces: EditorWhitespace[]): EditorWhitespace[] => {
			const result: EditorWhitespace[] = [];
			for (const whitespace of whitespaces) {
				if (toRemove.has(whitespace.id)) {
					continue;
				}
				if (toChange.has(whitespace.id)) {
					const change = toChange.get(whitespace.id)!;
					whitespace.afterLineNumber = change.newAfterLineNumber;
					whitespace.height = change.newHeight;
				}
				result.push(whitespace);
			}
			return result;
		};

		const result = applyRemoveAndChange(this._arr).concat(applyRemoveAndChange(inserts));
		result.sort((a, b) => {
			if (a.afterLineNumber === b.afterLineNumber) {
				return a.ordinal - b.ordinal;
			}
			return a.afterLineNumber - b.afterLineNumber;
		});

		this._arr = result;
		this._prefixSumValidIndex = -1;
	}

	private _insertWhitespace(whitespace: EditorWhitespace): void {
		const insertIndex = LinesLayout.findInsertionIndex(this._arr, whitespace.afterLineNumber, whitespace.ordinal);
		this._arr.splice(insertIndex, 0, whitespace);
		this._prefixSumValidIndex = Math.min(this._prefixSumValidIndex, insertIndex - 1);
	}

	private _findWhitespaceIndex(id: string): number {
		const arr = this._arr;
		for (let i = 0, len = arr.length; i < len; i++) {
			if (arr[i].id === id) {
				return i;
			}
		}
		return -1;
	}

	private _changeOneWhitespace(id: string, newAfterLineNumber: number, newHeight: number): void {
		const index = this._findWhitespaceIndex(id);
		if (index === -1) {
			return;
		}
		if (this._arr[index].height !== newHeight) {
			this._arr[index].height = newHeight;
			this._prefixSumValidIndex = Math.min(this._prefixSumValidIndex, index - 1);
		}
		if (this._arr[index].afterLineNumber !== newAfterLineNumber) {
			// `afterLineNumber` changed for this whitespace

			// Record old whitespace
			const whitespace = this._arr[index];

			// Since changing `afterLineNumber` can trigger a reordering, we're gonna remove this whitespace
			this._removeWhitespace(index);

			whitespace.afterLineNumber = newAfterLineNumber;

			// And add it again
			this._insertWhitespace(whitespace);
		}
	}

	private _removeWhitespace(removeIndex: number): void {
		this._arr.splice(removeIndex, 1);
		this._prefixSumValidIndex = Math.min(this._prefixSumValidIndex, removeIndex - 1);
	}

	/**
	 * Notify the layouter that lines have been deleted (a continuous zone of lines).
	 *
	 * @param fromLineNumber The line number at which the deletion started, inclusive
	 * @param toLineNumber The line number at which the deletion ended, inclusive
	 */
	public onLinesDeleted(fromLineNumber: number, toLineNumber: number): void {
		fromLineNumber = fromLineNumber | 0;
		toLineNumber = toLineNumber | 0;

		this._lineCount -= (toLineNumber - fromLineNumber + 1);
		for (let i = 0, len = this._arr.length; i < len; i++) {
			const afterLineNumber = this._arr[i].afterLineNumber;

			if (fromLineNumber <= afterLineNumber && afterLineNumber <= toLineNumber) {
				// The line this whitespace was after has been deleted
				//  => move whitespace to before first deleted line
				this._arr[i].afterLineNumber = fromLineNumber - 1;
			} else if (afterLineNumber > toLineNumber) {
				// The line this whitespace was after has been moved up
				//  => move whitespace up
				this._arr[i].afterLineNumber -= (toLineNumber - fromLineNumber + 1);
			}
		}
		this._lineHeightsManager.onLinesDeleted(fromLineNumber, toLineNumber);
	}

	/**
	 * Notify the layouter that lines have been inserted (a continuous zone of lines).
	 *
	 * @param fromLineNumber The line number at which the insertion started, inclusive
	 * @param toLineNumber The line number at which the insertion ended, inclusive.
	 */
	public onLinesInserted(fromLineNumber: number, toLineNumber: number): void {
		fromLineNumber = fromLineNumber | 0;
		toLineNumber = toLineNumber | 0;

		this._lineCount += (toLineNumber - fromLineNumber + 1);
		for (let i = 0, len = this._arr.length; i < len; i++) {
			const afterLineNumber = this._arr[i].afterLineNumber;

			if (fromLineNumber <= afterLineNumber) {
				this._arr[i].afterLineNumber += (toLineNumber - fromLineNumber + 1);
			}
		}
		this._lineHeightsManager.onLinesInserted(fromLineNumber, toLineNumber);
	}

	/**
	 * Get the sum of all the whitespaces.
	 */
	public getWhitespacesTotalHeight(): number {
		if (this._arr.length === 0) {
			return 0;
		}
		return this.getWhitespacesAccumulatedHeight(this._arr.length - 1);
	}

	/**
	 * Return the sum of the heights of the whitespaces at [0..index].
	 * This includes the whitespace at `index`.
	 *
	 * @param index The index of the whitespace.
	 * @return The sum of the heights of all whitespaces before the one at `index`, including the one at `index`.
	 */
	public getWhitespacesAccumulatedHeight(index: number): number {
		index = index | 0;

		let startIndex = Math.max(0, this._prefixSumValidIndex + 1);
		if (startIndex === 0) {
			this._arr[0].prefixSum = this._arr[0].height;
			startIndex++;
		}

		for (let i = startIndex; i <= index; i++) {
			this._arr[i].prefixSum = this._arr[i - 1].prefixSum + this._arr[i].height;
		}
		this._prefixSumValidIndex = Math.max(this._prefixSumValidIndex, index);
		return this._arr[index].prefixSum;
	}

	/**
	 * Get the sum of heights for all objects.
	 *
	 * @return The sum of heights for all objects.
	 */
	public getLinesTotalHeight(): number {
		const linesHeight = this._lineHeightsManager.getAccumulatedLineHeightsIncludingLineNumber(this._lineCount);
		const whitespacesHeight = this.getWhitespacesTotalHeight();

		return linesHeight + whitespacesHeight + this._paddingTop + this._paddingBottom;
	}

	/**
	 * Returns the accumulated height of whitespaces before the given line number.
	 *
	 * @param lineNumber The line number
	 */
	public getWhitespaceAccumulatedHeightBeforeLineNumber(lineNumber: number): number {
		lineNumber = lineNumber | 0;

		const lastWhitespaceBeforeLineNumber = this._findLastWhitespaceBeforeLineNumber(lineNumber);

		if (lastWhitespaceBeforeLineNumber === -1) {
			return 0;
		}

		return this.getWhitespacesAccumulatedHeight(lastWhitespaceBeforeLineNumber);
	}

	private _findLastWhitespaceBeforeLineNumber(lineNumber: number): number {
		lineNumber = lineNumber | 0;

		// Find the whitespace before line number
		const arr = this._arr;
		let low = 0;
		let high = arr.length - 1;

		while (low <= high) {
			const delta = (high - low) | 0;
			const halfDelta = (delta / 2) | 0;
			const mid = (low + halfDelta) | 0;

			if (arr[mid].afterLineNumber < lineNumber) {
				if (mid + 1 >= arr.length || arr[mid + 1].afterLineNumber >= lineNumber) {
					return mid;
				} else {
					low = (mid + 1) | 0;
				}
			} else {
				high = (mid - 1) | 0;
			}
		}

		return -1;
	}

	private _findFirstWhitespaceAfterLineNumber(lineNumber: number): number {
		lineNumber = lineNumber | 0;

		const lastWhitespaceBeforeLineNumber = this._findLastWhitespaceBeforeLineNumber(lineNumber);
		const firstWhitespaceAfterLineNumber = lastWhitespaceBeforeLineNumber + 1;

		if (firstWhitespaceAfterLineNumber < this._arr.length) {
			return firstWhitespaceAfterLineNumber;
		}

		return -1;
	}

	/**
	 * Find the index of the first whitespace which has `afterLineNumber` >= `lineNumber`.
	 * @return The index of the first whitespace with `afterLineNumber` >= `lineNumber` or -1 if no whitespace is found.
	 */
	public getFirstWhitespaceIndexAfterLineNumber(lineNumber: number): number {
		lineNumber = lineNumber | 0;

		return this._findFirstWhitespaceAfterLineNumber(lineNumber);
	}

	/**
	 * Get the vertical offset (the sum of heights for all objects above) a certain line number.
	 *
	 * @param lineNumber The line number
	 * @return The sum of heights for all objects above `lineNumber`.
	 */
	public getVerticalOffsetForLineNumber(lineNumber: number, includeViewZones = false): number {
		lineNumber = lineNumber | 0;

		let previousLinesHeight: number;
		if (lineNumber > 1) {
			previousLinesHeight = this._lineHeightsManager.getAccumulatedLineHeightsIncludingLineNumber(lineNumber - 1);
		} else {
			previousLinesHeight = 0;
		}

		const previousWhitespacesHeight = this.getWhitespaceAccumulatedHeightBeforeLineNumber(lineNumber - (includeViewZones ? 1 : 0));

		return previousLinesHeight + previousWhitespacesHeight + this._paddingTop;
	}

	public getLineHeightForLineNumber(lineNumber: number): number {
		return this._lineHeightsManager.heightForLineNumber(lineNumber);
	}

	/**
	 * Get the vertical offset (the sum of heights for all objects above) a certain line number and also the line height of the line.
	 *
	 * @param lineNumber The line number
	 * @return The sum of heights for all objects above `lineNumber`.
	 */
	public getVerticalOffsetAfterLineNumber(lineNumber: number, includeViewZones = false): number {
		lineNumber = lineNumber | 0;
		const previousLinesHeight = this._lineHeightsManager.getAccumulatedLineHeightsIncludingLineNumber(lineNumber);
		const previousWhitespacesHeight = this.getWhitespaceAccumulatedHeightBeforeLineNumber(lineNumber + (includeViewZones ? 1 : 0));
		return previousLinesHeight + previousWhitespacesHeight + this._paddingTop;
	}

	/**
	 * Returns if there is any whitespace in the document.
	 */
	public hasWhitespace(): boolean {
		return this.getWhitespacesCount() > 0;
	}

	/**
	 * The maximum min width for all whitespaces.
	 */
	public getWhitespaceMinWidth(): number {
		if (this._minWidth === -1) {
			let minWidth = 0;
			for (let i = 0, len = this._arr.length; i < len; i++) {
				minWidth = Math.max(minWidth, this._arr[i].minWidth);
			}
			this._minWidth = minWidth;
		}
		return this._minWidth;
	}

	/**
	 * Check if `verticalOffset` is below all lines.
	 */
	public isAfterLines(verticalOffset: number): boolean {
		const totalHeight = this.getLinesTotalHeight();
		return verticalOffset > totalHeight;
	}

	public isInTopPadding(verticalOffset: number): boolean {
		if (this._paddingTop === 0) {
			return false;
		}
		return (verticalOffset < this._paddingTop);
	}

	public isInBottomPadding(verticalOffset: number): boolean {
		if (this._paddingBottom === 0) {
			return false;
		}
		const totalHeight = this.getLinesTotalHeight();
		return (verticalOffset >= totalHeight - this._paddingBottom);
	}

	/**
	 * Find the first line number that is at or after vertical offset `verticalOffset`.
	 * i.e. if getVerticalOffsetForLine(line) is x and getVerticalOffsetForLine(line + 1) is y, then
	 * getLineNumberAtOrAfterVerticalOffset(i) = line, x <= i < y.
	 *
	 * @param verticalOffset The vertical offset to search at.
	 * @return The line number at or after vertical offset `verticalOffset`.
	 */
	public getLineNumberAtOrAfterVerticalOffset(verticalOffset: number): number {
		verticalOffset = verticalOffset | 0;

		if (verticalOffset < 0) {
			return 1;
		}

		const linesCount = this._lineCount | 0;
		let minLineNumber = 1;
		let maxLineNumber = linesCount;

		while (minLineNumber < maxLineNumber) {
			const midLineNumber = ((minLineNumber + maxLineNumber) / 2) | 0;

			const lineHeight = this.getLineHeightForLineNumber(midLineNumber);
			const midLineNumberVerticalOffset = this.getVerticalOffsetForLineNumber(midLineNumber) | 0;

			if (verticalOffset >= midLineNumberVerticalOffset + lineHeight) {
				// vertical offset is after mid line number
				minLineNumber = midLineNumber + 1;
			} else if (verticalOffset >= midLineNumberVerticalOffset) {
				// Hit
				return midLineNumber;
			} else {
				// vertical offset is before mid line number, but mid line number could still be what we're searching for
				maxLineNumber = midLineNumber;
			}
		}

		if (minLineNumber > linesCount) {
			return linesCount;
		}

		return minLineNumber;
	}

	/**
	 * Get all the lines and their relative vertical offsets that are positioned between `verticalOffset1` and `verticalOffset2`.
	 *
	 * @param verticalOffset1 The beginning of the viewport.
	 * @param verticalOffset2 The end of the viewport.
	 * @return A structure describing the lines positioned between `verticalOffset1` and `verticalOffset2`.
	 */
	public getLinesViewportData(verticalOffset1: number, verticalOffset2: number): IPartialViewLinesViewportData {
		verticalOffset1 = verticalOffset1 | 0;
		verticalOffset2 = verticalOffset2 | 0;

		// Find first line number
		// We don't live in a perfect world, so the line number might start before or after verticalOffset1
		const startLineNumber = this.getLineNumberAtOrAfterVerticalOffset(verticalOffset1) | 0;
		const startLineNumberVerticalOffset = this.getVerticalOffsetForLineNumber(startLineNumber) | 0;

		let endLineNumber = this._lineCount | 0;

		// Also keep track of what whitespace we've got
		let whitespaceIndex = this.getFirstWhitespaceIndexAfterLineNumber(startLineNumber) | 0;
		const whitespaceCount = this.getWhitespacesCount() | 0;
		let currentWhitespaceHeight: number;
		let currentWhitespaceAfterLineNumber: number;

		if (whitespaceIndex === -1) {
			whitespaceIndex = whitespaceCount;
			currentWhitespaceAfterLineNumber = endLineNumber + 1;
			currentWhitespaceHeight = 0;
		} else {
			currentWhitespaceAfterLineNumber = this.getAfterLineNumberForWhitespaceIndex(whitespaceIndex) | 0;
			currentWhitespaceHeight = this.getHeightForWhitespaceIndex(whitespaceIndex) | 0;
		}

		let currentVerticalOffset = startLineNumberVerticalOffset;
		let currentLineRelativeOffset = currentVerticalOffset;

		// IE (all versions) cannot handle units above about 1,533,908 px, so every 500k pixels bring numbers down
		const STEP_SIZE = 500000;
		let bigNumbersDelta = 0;
		if (startLineNumberVerticalOffset >= STEP_SIZE) {
			// Compute a delta that guarantees that lines are positioned at `lineHeight` increments
			bigNumbersDelta = Math.floor(startLineNumberVerticalOffset / STEP_SIZE) * STEP_SIZE;
			bigNumbersDelta = Math.floor(bigNumbersDelta / this._lineHeightsManager.defaultLineHeight) * this._lineHeightsManager.defaultLineHeight;

			currentLineRelativeOffset -= bigNumbersDelta;
		}

		const linesOffsets: number[] = [];

		const verticalCenter = verticalOffset1 + (verticalOffset2 - verticalOffset1) / 2;
		let centeredLineNumber = -1;

		// Figure out how far the lines go
		for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
			const lineHeight = this.getLineHeightForLineNumber(lineNumber);
			if (centeredLineNumber === -1) {
				const currentLineTop = currentVerticalOffset;
				const currentLineBottom = currentVerticalOffset + lineHeight;
				if ((currentLineTop <= verticalCenter && verticalCenter < currentLineBottom) || currentLineTop > verticalCenter) {
					centeredLineNumber = lineNumber;
				}
			}

			// Count current line height in the vertical offsets
			currentVerticalOffset += lineHeight;
			linesOffsets[lineNumber - startLineNumber] = currentLineRelativeOffset;

			// Next line starts immediately after this one
			currentLineRelativeOffset += lineHeight;
			while (currentWhitespaceAfterLineNumber === lineNumber) {
				// Push down next line with the height of the current whitespace
				currentLineRelativeOffset += currentWhitespaceHeight;

				// Count current whitespace in the vertical offsets
				currentVerticalOffset += currentWhitespaceHeight;
				whitespaceIndex++;

				if (whitespaceIndex >= whitespaceCount) {
					currentWhitespaceAfterLineNumber = endLineNumber + 1;
				} else {
					currentWhitespaceAfterLineNumber = this.getAfterLineNumberForWhitespaceIndex(whitespaceIndex) | 0;
					currentWhitespaceHeight = this.getHeightForWhitespaceIndex(whitespaceIndex) | 0;
				}
			}

			if (currentVerticalOffset >= verticalOffset2) {
				// We have covered the entire viewport area, time to stop
				endLineNumber = lineNumber;
				break;
			}
		}

		if (centeredLineNumber === -1) {
			centeredLineNumber = endLineNumber;
		}

		const endLineNumberVerticalOffset = this.getVerticalOffsetForLineNumber(endLineNumber) | 0;

		let completelyVisibleStartLineNumber = startLineNumber;
		let completelyVisibleEndLineNumber = endLineNumber;

		if (completelyVisibleStartLineNumber < completelyVisibleEndLineNumber) {
			if (startLineNumberVerticalOffset < verticalOffset1) {
				completelyVisibleStartLineNumber++;
			}
		}
		if (completelyVisibleStartLineNumber < completelyVisibleEndLineNumber) {
			const endLineHeight = this.getLineHeightForLineNumber(endLineNumber);
			if (endLineNumberVerticalOffset + endLineHeight > verticalOffset2) {
				completelyVisibleEndLineNumber--;
			}
		}

		return {
			bigNumbersDelta: bigNumbersDelta,
			startLineNumber: startLineNumber,
			endLineNumber: endLineNumber,
			relativeVerticalOffset: linesOffsets,
			centeredLineNumber: centeredLineNumber,
			completelyVisibleStartLineNumber: completelyVisibleStartLineNumber,
			completelyVisibleEndLineNumber: completelyVisibleEndLineNumber,
			lineHeight: this._lineHeightsManager.defaultLineHeight,
		};
	}

	public getVerticalOffsetForWhitespaceIndex(whitespaceIndex: number): number {
		whitespaceIndex = whitespaceIndex | 0;

		const afterLineNumber = this.getAfterLineNumberForWhitespaceIndex(whitespaceIndex);

		let previousLinesHeight: number;
		if (afterLineNumber >= 1) {
			previousLinesHeight = this._lineHeightsManager.getAccumulatedLineHeightsIncludingLineNumber(afterLineNumber);
		} else {
			previousLinesHeight = 0;
		}

		let previousWhitespacesHeight: number;
		if (whitespaceIndex > 0) {
			previousWhitespacesHeight = this.getWhitespacesAccumulatedHeight(whitespaceIndex - 1);
		} else {
			previousWhitespacesHeight = 0;
		}
		return previousLinesHeight + previousWhitespacesHeight + this._paddingTop;
	}

	public getWhitespaceIndexAtOrAfterVerticallOffset(verticalOffset: number): number {
		verticalOffset = verticalOffset | 0;

		let minWhitespaceIndex = 0;
		let maxWhitespaceIndex = this.getWhitespacesCount() - 1;

		if (maxWhitespaceIndex < 0) {
			return -1;
		}

		// Special case: nothing to be found
		const maxWhitespaceVerticalOffset = this.getVerticalOffsetForWhitespaceIndex(maxWhitespaceIndex);
		const maxWhitespaceHeight = this.getHeightForWhitespaceIndex(maxWhitespaceIndex);
		if (verticalOffset >= maxWhitespaceVerticalOffset + maxWhitespaceHeight) {
			return -1;
		}

		while (minWhitespaceIndex < maxWhitespaceIndex) {
			const midWhitespaceIndex = Math.floor((minWhitespaceIndex + maxWhitespaceIndex) / 2);

			const midWhitespaceVerticalOffset = this.getVerticalOffsetForWhitespaceIndex(midWhitespaceIndex);
			const midWhitespaceHeight = this.getHeightForWhitespaceIndex(midWhitespaceIndex);

			if (verticalOffset >= midWhitespaceVerticalOffset + midWhitespaceHeight) {
				// vertical offset is after whitespace
				minWhitespaceIndex = midWhitespaceIndex + 1;
			} else if (verticalOffset >= midWhitespaceVerticalOffset) {
				// Hit
				return midWhitespaceIndex;
			} else {
				// vertical offset is before whitespace, but midWhitespaceIndex might still be what we're searching for
				maxWhitespaceIndex = midWhitespaceIndex;
			}
		}
		return minWhitespaceIndex;
	}

	/**
	 * Get exactly the whitespace that is layouted at `verticalOffset`.
	 *
	 * @param verticalOffset The vertical offset.
	 * @return Precisely the whitespace that is layouted at `verticaloffset` or null.
	 */
	public getWhitespaceAtVerticalOffset(verticalOffset: number): IViewWhitespaceViewportData | null {
		verticalOffset = verticalOffset | 0;

		const candidateIndex = this.getWhitespaceIndexAtOrAfterVerticallOffset(verticalOffset);

		if (candidateIndex < 0) {
			return null;
		}

		if (candidateIndex >= this.getWhitespacesCount()) {
			return null;
		}

		const candidateTop = this.getVerticalOffsetForWhitespaceIndex(candidateIndex);

		if (candidateTop > verticalOffset) {
			return null;
		}

		const candidateHeight = this.getHeightForWhitespaceIndex(candidateIndex);
		const candidateId = this.getIdForWhitespaceIndex(candidateIndex);
		const candidateAfterLineNumber = this.getAfterLineNumberForWhitespaceIndex(candidateIndex);

		return {
			id: candidateId,
			afterLineNumber: candidateAfterLineNumber,
			verticalOffset: candidateTop,
			height: candidateHeight
		};
	}

	/**
	 * Get a list of whitespaces that are positioned between `verticalOffset1` and `verticalOffset2`.
	 *
	 * @param verticalOffset1 The beginning of the viewport.
	 * @param verticalOffset2 The end of the viewport.
	 * @return An array with all the whitespaces in the viewport. If no whitespace is in viewport, the array is empty.
	 */
	public getWhitespaceViewportData(verticalOffset1: number, verticalOffset2: number): IViewWhitespaceViewportData[] {
		verticalOffset1 = verticalOffset1 | 0;
		verticalOffset2 = verticalOffset2 | 0;

		const startIndex = this.getWhitespaceIndexAtOrAfterVerticallOffset(verticalOffset1);
		const endIndex = this.getWhitespacesCount() - 1;

		if (startIndex < 0) {
			return [];
		}

		const result: IViewWhitespaceViewportData[] = [];
		for (let i = startIndex; i <= endIndex; i++) {
			const top = this.getVerticalOffsetForWhitespaceIndex(i);
			const height = this.getHeightForWhitespaceIndex(i);
			if (top >= verticalOffset2) {
				break;
			}

			result.push({
				id: this.getIdForWhitespaceIndex(i),
				afterLineNumber: this.getAfterLineNumberForWhitespaceIndex(i),
				verticalOffset: top,
				height: height
			});
		}

		return result;
	}

	/**
	 * Get all whitespaces.
	 */
	public getWhitespaces(): IEditorWhitespace[] {
		return this._arr.slice(0);
	}

	/**
	 * The number of whitespaces.
	 */
	public getWhitespacesCount(): number {
		return this._arr.length;
	}

	/**
	 * Get the `id` for whitespace at index `index`.
	 *
	 * @param index The index of the whitespace.
	 * @return `id` of whitespace at `index`.
	 */
	public getIdForWhitespaceIndex(index: number): string {
		index = index | 0;

		return this._arr[index].id;
	}

	/**
	 * Get the `afterLineNumber` for whitespace at index `index`.
	 *
	 * @param index The index of the whitespace.
	 * @return `afterLineNumber` of whitespace at `index`.
	 */
	public getAfterLineNumberForWhitespaceIndex(index: number): number {
		index = index | 0;

		return this._arr[index].afterLineNumber;
	}

	/**
	 * Get the `height` for whitespace at index `index`.
	 *
	 * @param index The index of the whitespace.
	 * @return `height` of whitespace at `index`.
	 */
	public getHeightForWhitespaceIndex(index: number): number {
		index = index | 0;

		return this._arr[index].height;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewLayout/viewLayout.ts]---
Location: vscode-main/src/vs/editor/common/viewLayout/viewLayout.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event, Emitter } from '../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { IScrollPosition, ScrollEvent, Scrollable, ScrollbarVisibility, INewScrollPosition } from '../../../base/common/scrollable.js';
import { ConfigurationChangedEvent, EditorOption } from '../config/editorOptions.js';
import { ScrollType } from '../editorCommon.js';
import { IEditorConfiguration } from '../config/editorConfiguration.js';
import { LinesLayout } from './linesLayout.js';
import { IEditorWhitespace, IPartialViewLinesViewportData, ILineHeightChangeAccessor, IViewLayout, IViewWhitespaceViewportData, IWhitespaceChangeAccessor, Viewport } from '../viewModel.js';
import { ContentSizeChangedEvent } from '../viewModelEventDispatcher.js';
import { ICustomLineHeightData } from './lineHeights.js';

const SMOOTH_SCROLLING_TIME = 125;

class EditorScrollDimensions {

	public readonly width: number;
	public readonly contentWidth: number;
	public readonly scrollWidth: number;

	public readonly height: number;
	public readonly contentHeight: number;
	public readonly scrollHeight: number;

	constructor(
		width: number,
		contentWidth: number,
		height: number,
		contentHeight: number,
	) {
		width = width | 0;
		contentWidth = contentWidth | 0;
		height = height | 0;
		contentHeight = contentHeight | 0;

		if (width < 0) {
			width = 0;
		}
		if (contentWidth < 0) {
			contentWidth = 0;
		}

		if (height < 0) {
			height = 0;
		}
		if (contentHeight < 0) {
			contentHeight = 0;
		}

		this.width = width;
		this.contentWidth = contentWidth;
		this.scrollWidth = Math.max(width, contentWidth);

		this.height = height;
		this.contentHeight = contentHeight;
		this.scrollHeight = Math.max(height, contentHeight);
	}

	public equals(other: EditorScrollDimensions): boolean {
		return (
			this.width === other.width
			&& this.contentWidth === other.contentWidth
			&& this.height === other.height
			&& this.contentHeight === other.contentHeight
		);
	}
}

class EditorScrollable extends Disposable {

	private readonly _scrollable: Scrollable;
	private _dimensions: EditorScrollDimensions;

	public readonly onDidScroll: Event<ScrollEvent>;

	private readonly _onDidContentSizeChange = this._register(new Emitter<ContentSizeChangedEvent>());
	public readonly onDidContentSizeChange: Event<ContentSizeChangedEvent> = this._onDidContentSizeChange.event;

	constructor(smoothScrollDuration: number, scheduleAtNextAnimationFrame: (callback: () => void) => IDisposable) {
		super();
		this._dimensions = new EditorScrollDimensions(0, 0, 0, 0);
		this._scrollable = this._register(new Scrollable({
			forceIntegerValues: true,
			smoothScrollDuration,
			scheduleAtNextAnimationFrame
		}));
		this.onDidScroll = this._scrollable.onScroll;
	}

	public getScrollable(): Scrollable {
		return this._scrollable;
	}

	public setSmoothScrollDuration(smoothScrollDuration: number): void {
		this._scrollable.setSmoothScrollDuration(smoothScrollDuration);
	}

	public validateScrollPosition(scrollPosition: INewScrollPosition): IScrollPosition {
		return this._scrollable.validateScrollPosition(scrollPosition);
	}

	public getScrollDimensions(): EditorScrollDimensions {
		return this._dimensions;
	}

	public setScrollDimensions(dimensions: EditorScrollDimensions): void {
		if (this._dimensions.equals(dimensions)) {
			return;
		}

		const oldDimensions = this._dimensions;
		this._dimensions = dimensions;

		this._scrollable.setScrollDimensions({
			width: dimensions.width,
			scrollWidth: dimensions.scrollWidth,
			height: dimensions.height,
			scrollHeight: dimensions.scrollHeight
		}, true);

		const contentWidthChanged = (oldDimensions.contentWidth !== dimensions.contentWidth);
		const contentHeightChanged = (oldDimensions.contentHeight !== dimensions.contentHeight);
		if (contentWidthChanged || contentHeightChanged) {
			this._onDidContentSizeChange.fire(new ContentSizeChangedEvent(
				oldDimensions.contentWidth, oldDimensions.contentHeight,
				dimensions.contentWidth, dimensions.contentHeight
			));
		}
	}

	public getFutureScrollPosition(): IScrollPosition {
		return this._scrollable.getFutureScrollPosition();
	}

	public getCurrentScrollPosition(): IScrollPosition {
		return this._scrollable.getCurrentScrollPosition();
	}

	public setScrollPositionNow(update: INewScrollPosition): void {
		this._scrollable.setScrollPositionNow(update);
	}

	public setScrollPositionSmooth(update: INewScrollPosition): void {
		this._scrollable.setScrollPositionSmooth(update);
	}

	public hasPendingScrollAnimation(): boolean {
		return this._scrollable.hasPendingScrollAnimation();
	}
}

export class ViewLayout extends Disposable implements IViewLayout {

	private readonly _configuration: IEditorConfiguration;
	private readonly _linesLayout: LinesLayout;
	private _maxLineWidth: number;
	private _overlayWidgetsMinWidth: number;

	private readonly _scrollable: EditorScrollable;
	public readonly onDidScroll: Event<ScrollEvent>;
	public readonly onDidContentSizeChange: Event<ContentSizeChangedEvent>;

	constructor(configuration: IEditorConfiguration, lineCount: number, customLineHeightData: ICustomLineHeightData[], scheduleAtNextAnimationFrame: (callback: () => void) => IDisposable) {
		super();

		this._configuration = configuration;
		const options = this._configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);
		const padding = options.get(EditorOption.padding);

		this._linesLayout = new LinesLayout(lineCount, options.get(EditorOption.lineHeight), padding.top, padding.bottom, customLineHeightData);
		this._maxLineWidth = 0;
		this._overlayWidgetsMinWidth = 0;

		this._scrollable = this._register(new EditorScrollable(0, scheduleAtNextAnimationFrame));
		this._configureSmoothScrollDuration();

		this._scrollable.setScrollDimensions(new EditorScrollDimensions(
			layoutInfo.contentWidth,
			0,
			layoutInfo.height,
			0
		));
		this.onDidScroll = this._scrollable.onDidScroll;
		this.onDidContentSizeChange = this._scrollable.onDidContentSizeChange;

		this._updateHeight();
	}

	public override dispose(): void {
		super.dispose();
	}

	public getScrollable(): Scrollable {
		return this._scrollable.getScrollable();
	}

	public onHeightMaybeChanged(): void {
		this._updateHeight();
	}

	private _configureSmoothScrollDuration(): void {
		this._scrollable.setSmoothScrollDuration(this._configuration.options.get(EditorOption.smoothScrolling) ? SMOOTH_SCROLLING_TIME : 0);
	}

	// ---- begin view event handlers

	public onConfigurationChanged(e: ConfigurationChangedEvent): void {
		const options = this._configuration.options;
		if (e.hasChanged(EditorOption.lineHeight)) {
			this._linesLayout.setDefaultLineHeight(options.get(EditorOption.lineHeight));
		}
		if (e.hasChanged(EditorOption.padding)) {
			const padding = options.get(EditorOption.padding);
			this._linesLayout.setPadding(padding.top, padding.bottom);
		}
		if (e.hasChanged(EditorOption.layoutInfo)) {
			const layoutInfo = options.get(EditorOption.layoutInfo);
			const width = layoutInfo.contentWidth;
			const height = layoutInfo.height;
			const scrollDimensions = this._scrollable.getScrollDimensions();
			const contentWidth = scrollDimensions.contentWidth;
			this._scrollable.setScrollDimensions(new EditorScrollDimensions(
				width,
				scrollDimensions.contentWidth,
				height,
				this._getContentHeight(width, height, contentWidth)
			));
		} else {
			this._updateHeight();
		}
		if (e.hasChanged(EditorOption.smoothScrolling)) {
			this._configureSmoothScrollDuration();
		}
	}
	public onFlushed(lineCount: number, customLineHeightData: ICustomLineHeightData[]): void {
		this._linesLayout.onFlushed(lineCount, customLineHeightData);
	}
	public onLinesDeleted(fromLineNumber: number, toLineNumber: number): void {
		this._linesLayout.onLinesDeleted(fromLineNumber, toLineNumber);
	}
	public onLinesInserted(fromLineNumber: number, toLineNumber: number): void {
		this._linesLayout.onLinesInserted(fromLineNumber, toLineNumber);
	}

	// ---- end view event handlers

	private _getHorizontalScrollbarHeight(width: number, scrollWidth: number): number {
		const options = this._configuration.options;
		const scrollbar = options.get(EditorOption.scrollbar);
		if (scrollbar.horizontal === ScrollbarVisibility.Hidden) {
			// horizontal scrollbar not visible
			return 0;
		}
		if (width >= scrollWidth) {
			// horizontal scrollbar not visible
			return 0;
		}
		return scrollbar.horizontalScrollbarSize;
	}

	private _getContentHeight(width: number, height: number, contentWidth: number): number {
		const options = this._configuration.options;

		let result = this._linesLayout.getLinesTotalHeight();
		if (options.get(EditorOption.scrollBeyondLastLine)) {
			result += Math.max(0, height - options.get(EditorOption.lineHeight) - options.get(EditorOption.padding).bottom);
		} else if (!options.get(EditorOption.scrollbar).ignoreHorizontalScrollbarInContentHeight) {
			result += this._getHorizontalScrollbarHeight(width, contentWidth);
		}

		return result;
	}

	private _updateHeight(): void {
		const scrollDimensions = this._scrollable.getScrollDimensions();
		const width = scrollDimensions.width;
		const height = scrollDimensions.height;
		const contentWidth = scrollDimensions.contentWidth;
		this._scrollable.setScrollDimensions(new EditorScrollDimensions(
			width,
			scrollDimensions.contentWidth,
			height,
			this._getContentHeight(width, height, contentWidth)
		));
	}

	// ---- Layouting logic

	public getCurrentViewport(): Viewport {
		const scrollDimensions = this._scrollable.getScrollDimensions();
		const currentScrollPosition = this._scrollable.getCurrentScrollPosition();
		return new Viewport(
			currentScrollPosition.scrollTop,
			currentScrollPosition.scrollLeft,
			scrollDimensions.width,
			scrollDimensions.height
		);
	}

	public getFutureViewport(): Viewport {
		const scrollDimensions = this._scrollable.getScrollDimensions();
		const currentScrollPosition = this._scrollable.getFutureScrollPosition();
		return new Viewport(
			currentScrollPosition.scrollTop,
			currentScrollPosition.scrollLeft,
			scrollDimensions.width,
			scrollDimensions.height
		);
	}

	private _computeContentWidth(): number {
		const options = this._configuration.options;
		const maxLineWidth = this._maxLineWidth;
		const wrappingInfo = options.get(EditorOption.wrappingInfo);
		const fontInfo = options.get(EditorOption.fontInfo);
		const layoutInfo = options.get(EditorOption.layoutInfo);
		if (wrappingInfo.isViewportWrapping) {
			const minimap = options.get(EditorOption.minimap);
			if (maxLineWidth > layoutInfo.contentWidth + fontInfo.typicalHalfwidthCharacterWidth) {
				// This is a case where viewport wrapping is on, but the line extends above the viewport
				if (minimap.enabled && minimap.side === 'right') {
					// We need to accomodate the scrollbar width
					return maxLineWidth + layoutInfo.verticalScrollbarWidth;
				}
			}
			return maxLineWidth;
		} else {
			const extraHorizontalSpace = options.get(EditorOption.scrollBeyondLastColumn) * fontInfo.typicalHalfwidthCharacterWidth;
			const whitespaceMinWidth = this._linesLayout.getWhitespaceMinWidth();
			return Math.max(maxLineWidth + extraHorizontalSpace + layoutInfo.verticalScrollbarWidth, whitespaceMinWidth, this._overlayWidgetsMinWidth);
		}
	}

	public setMaxLineWidth(maxLineWidth: number): void {
		this._maxLineWidth = maxLineWidth;
		this._updateContentWidth();
	}

	public setOverlayWidgetsMinWidth(maxMinWidth: number): void {
		this._overlayWidgetsMinWidth = maxMinWidth;
		this._updateContentWidth();
	}

	private _updateContentWidth(): void {
		const scrollDimensions = this._scrollable.getScrollDimensions();
		this._scrollable.setScrollDimensions(new EditorScrollDimensions(
			scrollDimensions.width,
			this._computeContentWidth(),
			scrollDimensions.height,
			scrollDimensions.contentHeight
		));

		// The height might depend on the fact that there is a horizontal scrollbar or not
		this._updateHeight();
	}

	// ---- view state

	public saveState(): { scrollTop: number; scrollTopWithoutViewZones: number; scrollLeft: number } {
		const currentScrollPosition = this._scrollable.getFutureScrollPosition();
		const scrollTop = currentScrollPosition.scrollTop;
		const firstLineNumberInViewport = this._linesLayout.getLineNumberAtOrAfterVerticalOffset(scrollTop);
		const whitespaceAboveFirstLine = this._linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(firstLineNumberInViewport);
		return {
			scrollTop: scrollTop,
			scrollTopWithoutViewZones: scrollTop - whitespaceAboveFirstLine,
			scrollLeft: currentScrollPosition.scrollLeft
		};
	}

	// ----
	public changeWhitespace(callback: (accessor: IWhitespaceChangeAccessor) => void): boolean {
		const hadAChange = this._linesLayout.changeWhitespace(callback);
		if (hadAChange) {
			this.onHeightMaybeChanged();
		}
		return hadAChange;
	}

	public changeSpecialLineHeights(callback: (accessor: ILineHeightChangeAccessor) => void): boolean {
		const hadAChange = this._linesLayout.changeLineHeights(callback);
		if (hadAChange) {
			this.onHeightMaybeChanged();
		}
		return hadAChange;
	}

	public getVerticalOffsetForLineNumber(lineNumber: number, includeViewZones: boolean = false): number {
		return this._linesLayout.getVerticalOffsetForLineNumber(lineNumber, includeViewZones);
	}
	public getVerticalOffsetAfterLineNumber(lineNumber: number, includeViewZones: boolean = false): number {
		return this._linesLayout.getVerticalOffsetAfterLineNumber(lineNumber, includeViewZones);
	}
	public getLineHeightForLineNumber(lineNumber: number): number {
		return this._linesLayout.getLineHeightForLineNumber(lineNumber);
	}
	public isAfterLines(verticalOffset: number): boolean {
		return this._linesLayout.isAfterLines(verticalOffset);
	}
	public isInTopPadding(verticalOffset: number): boolean {
		return this._linesLayout.isInTopPadding(verticalOffset);
	}
	public isInBottomPadding(verticalOffset: number): boolean {
		return this._linesLayout.isInBottomPadding(verticalOffset);
	}

	public getLineNumberAtVerticalOffset(verticalOffset: number): number {
		return this._linesLayout.getLineNumberAtOrAfterVerticalOffset(verticalOffset);
	}

	public getWhitespaceAtVerticalOffset(verticalOffset: number): IViewWhitespaceViewportData | null {
		return this._linesLayout.getWhitespaceAtVerticalOffset(verticalOffset);
	}
	public getLinesViewportData(): IPartialViewLinesViewportData {
		const visibleBox = this.getCurrentViewport();
		return this._linesLayout.getLinesViewportData(visibleBox.top, visibleBox.top + visibleBox.height);
	}
	public getLinesViewportDataAtScrollTop(scrollTop: number): IPartialViewLinesViewportData {
		// do some minimal validations on scrollTop
		const scrollDimensions = this._scrollable.getScrollDimensions();
		if (scrollTop + scrollDimensions.height > scrollDimensions.scrollHeight) {
			scrollTop = scrollDimensions.scrollHeight - scrollDimensions.height;
		}
		if (scrollTop < 0) {
			scrollTop = 0;
		}
		return this._linesLayout.getLinesViewportData(scrollTop, scrollTop + scrollDimensions.height);
	}
	public getWhitespaceViewportData(): IViewWhitespaceViewportData[] {
		const visibleBox = this.getCurrentViewport();
		return this._linesLayout.getWhitespaceViewportData(visibleBox.top, visibleBox.top + visibleBox.height);
	}
	public getWhitespaces(): IEditorWhitespace[] {
		return this._linesLayout.getWhitespaces();
	}

	// ----

	public getContentWidth(): number {
		const scrollDimensions = this._scrollable.getScrollDimensions();
		return scrollDimensions.contentWidth;
	}
	public getScrollWidth(): number {
		const scrollDimensions = this._scrollable.getScrollDimensions();
		return scrollDimensions.scrollWidth;
	}
	public getContentHeight(): number {
		const scrollDimensions = this._scrollable.getScrollDimensions();
		return scrollDimensions.contentHeight;
	}
	public getScrollHeight(): number {
		const scrollDimensions = this._scrollable.getScrollDimensions();
		return scrollDimensions.scrollHeight;
	}

	public getCurrentScrollLeft(): number {
		const currentScrollPosition = this._scrollable.getCurrentScrollPosition();
		return currentScrollPosition.scrollLeft;
	}
	public getCurrentScrollTop(): number {
		const currentScrollPosition = this._scrollable.getCurrentScrollPosition();
		return currentScrollPosition.scrollTop;
	}

	public validateScrollPosition(scrollPosition: INewScrollPosition): IScrollPosition {
		return this._scrollable.validateScrollPosition(scrollPosition);
	}

	public setScrollPosition(position: INewScrollPosition, type: ScrollType): void {
		if (type === ScrollType.Immediate) {
			this._scrollable.setScrollPositionNow(position);
		} else {
			this._scrollable.setScrollPositionSmooth(position);
		}
	}

	public hasPendingScrollAnimation(): boolean {
		return this._scrollable.hasPendingScrollAnimation();
	}

	public deltaScrollNow(deltaScrollLeft: number, deltaScrollTop: number): void {
		const currentScrollPosition = this._scrollable.getCurrentScrollPosition();
		this._scrollable.setScrollPositionNow({
			scrollLeft: currentScrollPosition.scrollLeft + deltaScrollLeft,
			scrollTop: currentScrollPosition.scrollTop + deltaScrollTop
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewLayout/viewLineRenderer.ts]---
Location: vscode-main/src/vs/editor/common/viewLayout/viewLineRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../nls.js';
import { CharCode } from '../../../base/common/charCode.js';
import * as strings from '../../../base/common/strings.js';
import { IViewLineTokens } from '../tokens/lineTokens.js';
import { StringBuilder } from '../core/stringBuilder.js';
import { LineDecoration, LineDecorationsNormalizer } from './lineDecorations.js';
import { LinePart, LinePartMetadata } from './linePart.js';
import { OffsetRange } from '../core/ranges/offsetRange.js';
import { InlineDecorationType } from '../viewModel/inlineDecorations.js';
import { TextDirection } from '../model.js';

export const enum RenderWhitespace {
	None = 0,
	Boundary = 1,
	Selection = 2,
	Trailing = 3,
	All = 4
}

export interface IRenderLineInputOptions {
	useMonospaceOptimizations: boolean;
	canUseHalfwidthRightwardsArrow: boolean;
	lineContent: string;
	continuesWithWrappedLine: boolean;
	isBasicASCII: boolean;
	containsRTL: boolean;
	fauxIndentLength: number;
	lineTokens: IViewLineTokens;
	lineDecorations: LineDecoration[];
	tabSize: number;
	startVisibleColumn: number;
	spaceWidth: number;
	middotWidth: number;
	wsmiddotWidth: number;
	stopRenderingLineAfter: number;
	renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all';
	renderControlCharacters: boolean;
	fontLigatures: boolean;
	selectionsOnLine: OffsetRange[] | null;
	textDirection: TextDirection | null;
	verticalScrollbarSize: number;
	renderNewLineWhenEmpty: boolean;
}

export class RenderLineInput {

	public readonly useMonospaceOptimizations: boolean;
	public readonly canUseHalfwidthRightwardsArrow: boolean;
	public readonly lineContent: string;
	public readonly continuesWithWrappedLine: boolean;
	public readonly isBasicASCII: boolean;
	public readonly containsRTL: boolean;
	public readonly fauxIndentLength: number;
	public readonly lineTokens: IViewLineTokens;
	public readonly lineDecorations: LineDecoration[];
	public readonly tabSize: number;
	public readonly startVisibleColumn: number;
	public readonly spaceWidth: number;
	public readonly renderSpaceWidth: number;
	public readonly renderSpaceCharCode: number;
	public readonly stopRenderingLineAfter: number;
	public readonly renderWhitespace: RenderWhitespace;
	public readonly renderControlCharacters: boolean;
	public readonly fontLigatures: boolean;
	public readonly textDirection: TextDirection | null;
	public readonly verticalScrollbarSize: number;

	/**
	 * Defined only when renderWhitespace is 'selection'. Selections are non-overlapping,
	 * and ordered by position within the line.
	 */
	public readonly selectionsOnLine: OffsetRange[] | null;
	/**
	 * When rendering an empty line, whether to render a new line instead
	 */
	public readonly renderNewLineWhenEmpty: boolean;

	public get isLTR(): boolean {
		return !this.containsRTL && this.textDirection !== TextDirection.RTL;
	}

	constructor(
		useMonospaceOptimizations: boolean,
		canUseHalfwidthRightwardsArrow: boolean,
		lineContent: string,
		continuesWithWrappedLine: boolean,
		isBasicASCII: boolean,
		containsRTL: boolean,
		fauxIndentLength: number,
		lineTokens: IViewLineTokens,
		lineDecorations: LineDecoration[],
		tabSize: number,
		startVisibleColumn: number,
		spaceWidth: number,
		middotWidth: number,
		wsmiddotWidth: number,
		stopRenderingLineAfter: number,
		renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all',
		renderControlCharacters: boolean,
		fontLigatures: boolean,
		selectionsOnLine: OffsetRange[] | null,
		textDirection: TextDirection | null,
		verticalScrollbarSize: number,
		renderNewLineWhenEmpty: boolean = false,
	) {
		this.useMonospaceOptimizations = useMonospaceOptimizations;
		this.canUseHalfwidthRightwardsArrow = canUseHalfwidthRightwardsArrow;
		this.lineContent = lineContent;
		this.continuesWithWrappedLine = continuesWithWrappedLine;
		this.isBasicASCII = isBasicASCII;
		this.containsRTL = containsRTL;
		this.fauxIndentLength = fauxIndentLength;
		this.lineTokens = lineTokens;
		this.lineDecorations = lineDecorations.sort(LineDecoration.compare);
		this.tabSize = tabSize;
		this.startVisibleColumn = startVisibleColumn;
		this.spaceWidth = spaceWidth;
		this.stopRenderingLineAfter = stopRenderingLineAfter;
		this.renderWhitespace = (
			renderWhitespace === 'all'
				? RenderWhitespace.All
				: renderWhitespace === 'boundary'
					? RenderWhitespace.Boundary
					: renderWhitespace === 'selection'
						? RenderWhitespace.Selection
						: renderWhitespace === 'trailing'
							? RenderWhitespace.Trailing
							: RenderWhitespace.None
		);
		this.renderControlCharacters = renderControlCharacters;
		this.fontLigatures = fontLigatures;
		this.selectionsOnLine = selectionsOnLine && selectionsOnLine.sort((a, b) => a.start < b.start ? -1 : 1);
		this.renderNewLineWhenEmpty = renderNewLineWhenEmpty;
		this.textDirection = textDirection;
		this.verticalScrollbarSize = verticalScrollbarSize;

		const wsmiddotDiff = Math.abs(wsmiddotWidth - spaceWidth);
		const middotDiff = Math.abs(middotWidth - spaceWidth);
		if (wsmiddotDiff < middotDiff) {
			this.renderSpaceWidth = wsmiddotWidth;
			this.renderSpaceCharCode = 0x2E31; // U+2E31 - WORD SEPARATOR MIDDLE DOT
		} else {
			this.renderSpaceWidth = middotWidth;
			this.renderSpaceCharCode = 0xB7; // U+00B7 - MIDDLE DOT
		}
	}

	private sameSelection(otherSelections: OffsetRange[] | null): boolean {
		if (this.selectionsOnLine === null) {
			return otherSelections === null;
		}

		if (otherSelections === null) {
			return false;
		}

		if (otherSelections.length !== this.selectionsOnLine.length) {
			return false;
		}

		for (let i = 0; i < this.selectionsOnLine.length; i++) {
			if (!this.selectionsOnLine[i].equals(otherSelections[i])) {
				return false;
			}
		}

		return true;
	}

	public equals(other: RenderLineInput): boolean {
		return (
			this.useMonospaceOptimizations === other.useMonospaceOptimizations
			&& this.canUseHalfwidthRightwardsArrow === other.canUseHalfwidthRightwardsArrow
			&& this.lineContent === other.lineContent
			&& this.continuesWithWrappedLine === other.continuesWithWrappedLine
			&& this.isBasicASCII === other.isBasicASCII
			&& this.containsRTL === other.containsRTL
			&& this.fauxIndentLength === other.fauxIndentLength
			&& this.tabSize === other.tabSize
			&& this.startVisibleColumn === other.startVisibleColumn
			&& this.spaceWidth === other.spaceWidth
			&& this.renderSpaceWidth === other.renderSpaceWidth
			&& this.renderSpaceCharCode === other.renderSpaceCharCode
			&& this.stopRenderingLineAfter === other.stopRenderingLineAfter
			&& this.renderWhitespace === other.renderWhitespace
			&& this.renderControlCharacters === other.renderControlCharacters
			&& this.fontLigatures === other.fontLigatures
			&& LineDecoration.equalsArr(this.lineDecorations, other.lineDecorations)
			&& this.lineTokens.equals(other.lineTokens)
			&& this.sameSelection(other.selectionsOnLine)
			&& this.textDirection === other.textDirection
			&& this.verticalScrollbarSize === other.verticalScrollbarSize
			&& this.renderNewLineWhenEmpty === other.renderNewLineWhenEmpty
		);
	}
}

const enum CharacterMappingConstants {
	PART_INDEX_MASK = 0b11111111111111110000000000000000,
	CHAR_INDEX_MASK = 0b00000000000000001111111111111111,

	CHAR_INDEX_OFFSET = 0,
	PART_INDEX_OFFSET = 16
}

export class DomPosition {
	constructor(
		public readonly partIndex: number,
		public readonly charIndex: number
	) { }
}

/**
 * Provides a both direction mapping between a line's character and its rendered position.
 */
export class CharacterMapping {

	private static getPartIndex(partData: number): number {
		return (partData & CharacterMappingConstants.PART_INDEX_MASK) >>> CharacterMappingConstants.PART_INDEX_OFFSET;
	}

	private static getCharIndex(partData: number): number {
		return (partData & CharacterMappingConstants.CHAR_INDEX_MASK) >>> CharacterMappingConstants.CHAR_INDEX_OFFSET;
	}

	public readonly length: number;
	private readonly _data: Uint32Array;
	private readonly _horizontalOffset: Uint32Array;

	constructor(length: number, partCount: number) {
		this.length = length;
		this._data = new Uint32Array(this.length);
		this._horizontalOffset = new Uint32Array(this.length);
	}

	public setColumnInfo(column: number, partIndex: number, charIndex: number, horizontalOffset: number): void {
		const partData = (
			(partIndex << CharacterMappingConstants.PART_INDEX_OFFSET)
			| (charIndex << CharacterMappingConstants.CHAR_INDEX_OFFSET)
		) >>> 0;
		this._data[column - 1] = partData;
		this._horizontalOffset[column - 1] = horizontalOffset;
	}

	public getHorizontalOffset(column: number): number {
		if (this._horizontalOffset.length === 0) {
			// No characters on this line
			return 0;
		}
		return this._horizontalOffset[column - 1];
	}

	private charOffsetToPartData(charOffset: number): number {
		if (this.length === 0) {
			return 0;
		}
		if (charOffset < 0) {
			return this._data[0];
		}
		if (charOffset >= this.length) {
			return this._data[this.length - 1];
		}
		return this._data[charOffset];
	}

	public getDomPosition(column: number): DomPosition {
		const partData = this.charOffsetToPartData(column - 1);
		const partIndex = CharacterMapping.getPartIndex(partData);
		const charIndex = CharacterMapping.getCharIndex(partData);
		return new DomPosition(partIndex, charIndex);
	}

	public getColumn(domPosition: DomPosition, partLength: number): number {
		const charOffset = this.partDataToCharOffset(domPosition.partIndex, partLength, domPosition.charIndex);
		return charOffset + 1;
	}

	private partDataToCharOffset(partIndex: number, partLength: number, charIndex: number): number {
		if (this.length === 0) {
			return 0;
		}

		const searchEntry = (
			(partIndex << CharacterMappingConstants.PART_INDEX_OFFSET)
			| (charIndex << CharacterMappingConstants.CHAR_INDEX_OFFSET)
		) >>> 0;

		let min = 0;
		let max = this.length - 1;
		while (min + 1 < max) {
			const mid = ((min + max) >>> 1);
			const midEntry = this._data[mid];
			if (midEntry === searchEntry) {
				return mid;
			} else if (midEntry > searchEntry) {
				max = mid;
			} else {
				min = mid;
			}
		}

		if (min === max) {
			return min;
		}

		const minEntry = this._data[min];
		const maxEntry = this._data[max];

		if (minEntry === searchEntry) {
			return min;
		}
		if (maxEntry === searchEntry) {
			return max;
		}

		const minPartIndex = CharacterMapping.getPartIndex(minEntry);
		const minCharIndex = CharacterMapping.getCharIndex(minEntry);

		const maxPartIndex = CharacterMapping.getPartIndex(maxEntry);
		let maxCharIndex: number;

		if (minPartIndex !== maxPartIndex) {
			// sitting between parts
			maxCharIndex = partLength;
		} else {
			maxCharIndex = CharacterMapping.getCharIndex(maxEntry);
		}

		const minEntryDistance = charIndex - minCharIndex;
		const maxEntryDistance = maxCharIndex - charIndex;

		if (minEntryDistance <= maxEntryDistance) {
			return min;
		}
		return max;
	}

	public inflate() {
		const result: [number, number, number][] = [];
		for (let i = 0; i < this.length; i++) {
			const partData = this._data[i];
			const partIndex = CharacterMapping.getPartIndex(partData);
			const charIndex = CharacterMapping.getCharIndex(partData);
			const visibleColumn = this._horizontalOffset[i];
			result.push([partIndex, charIndex, visibleColumn]);
		}
		return result;
	}
}

export const enum ForeignElementType {
	None = 0,
	Before = 1,
	After = 2
}

export class RenderLineOutput {
	_renderLineOutputBrand: void = undefined;

	readonly characterMapping: CharacterMapping;
	readonly containsForeignElements: ForeignElementType;

	constructor(characterMapping: CharacterMapping, containsForeignElements: ForeignElementType) {
		this.characterMapping = characterMapping;
		this.containsForeignElements = containsForeignElements;
	}
}

export function renderViewLine(input: RenderLineInput, sb: StringBuilder): RenderLineOutput {
	if (input.lineContent.length === 0) {

		if (input.lineDecorations.length > 0) {
			// This line is empty, but it contains inline decorations
			sb.appendString(`<span>`);

			let beforeCount = 0;
			let afterCount = 0;
			let containsForeignElements = ForeignElementType.None;
			for (const lineDecoration of input.lineDecorations) {
				if (lineDecoration.type === InlineDecorationType.Before || lineDecoration.type === InlineDecorationType.After) {
					sb.appendString(`<span class="`);
					sb.appendString(lineDecoration.className);
					sb.appendString(`"></span>`);

					if (lineDecoration.type === InlineDecorationType.Before) {
						containsForeignElements |= ForeignElementType.Before;
						beforeCount++;
					}
					if (lineDecoration.type === InlineDecorationType.After) {
						containsForeignElements |= ForeignElementType.After;
						afterCount++;
					}
				}
			}

			sb.appendString(`</span>`);

			const characterMapping = new CharacterMapping(1, beforeCount + afterCount);
			characterMapping.setColumnInfo(1, beforeCount, 0, 0);

			return new RenderLineOutput(
				characterMapping,
				containsForeignElements
			);
		}

		// completely empty line
		if (input.renderNewLineWhenEmpty) {
			sb.appendString('<span><span>\n</span></span>');
		} else {
			sb.appendString('<span><span></span></span>');
		}
		return new RenderLineOutput(
			new CharacterMapping(0, 0),
			ForeignElementType.None
		);
	}

	return _renderLine(resolveRenderLineInput(input), sb);
}

export class RenderLineOutput2 {
	constructor(
		public readonly characterMapping: CharacterMapping,
		public readonly html: string,
		public readonly containsForeignElements: ForeignElementType
	) {
	}
}

export function renderViewLine2(input: RenderLineInput): RenderLineOutput2 {
	const sb = new StringBuilder(10000);
	const out = renderViewLine(input, sb);
	return new RenderLineOutput2(out.characterMapping, sb.build(), out.containsForeignElements);
}

class ResolvedRenderLineInput {
	constructor(
		public readonly fontIsMonospace: boolean,
		public readonly canUseHalfwidthRightwardsArrow: boolean,
		public readonly lineContent: string,
		public readonly len: number,
		public readonly isOverflowing: boolean,
		public readonly overflowingCharCount: number,
		public readonly parts: LinePart[],
		public readonly containsForeignElements: ForeignElementType,
		public readonly fauxIndentLength: number,
		public readonly tabSize: number,
		public readonly startVisibleColumn: number,
		public readonly spaceWidth: number,
		public readonly renderSpaceCharCode: number,
		public readonly renderWhitespace: RenderWhitespace,
		public readonly renderControlCharacters: boolean,
	) {
		//
	}
}

function resolveRenderLineInput(input: RenderLineInput): ResolvedRenderLineInput {
	const lineContent = input.lineContent;

	let isOverflowing: boolean;
	let overflowingCharCount: number;
	let len: number;

	if (input.stopRenderingLineAfter !== -1 && input.stopRenderingLineAfter < lineContent.length) {
		isOverflowing = true;
		overflowingCharCount = lineContent.length - input.stopRenderingLineAfter;
		len = input.stopRenderingLineAfter;
	} else {
		isOverflowing = false;
		overflowingCharCount = 0;
		len = lineContent.length;
	}

	let tokens = transformAndRemoveOverflowing(lineContent, input.containsRTL, input.lineTokens, input.fauxIndentLength, len);
	if (input.renderControlCharacters && !input.isBasicASCII) {
		// Calling `extractControlCharacters` before adding (possibly empty) line parts
		// for inline decorations. `extractControlCharacters` removes empty line parts.
		tokens = extractControlCharacters(lineContent, tokens);
	}
	if (input.renderWhitespace === RenderWhitespace.All ||
		input.renderWhitespace === RenderWhitespace.Boundary ||
		(input.renderWhitespace === RenderWhitespace.Selection && !!input.selectionsOnLine) ||
		(input.renderWhitespace === RenderWhitespace.Trailing && !input.continuesWithWrappedLine)
	) {
		tokens = _applyRenderWhitespace(input, lineContent, len, tokens);
	}
	let containsForeignElements = ForeignElementType.None;
	if (input.lineDecorations.length > 0) {
		for (let i = 0, len = input.lineDecorations.length; i < len; i++) {
			const lineDecoration = input.lineDecorations[i];
			if (lineDecoration.type === InlineDecorationType.RegularAffectingLetterSpacing) {
				// Pretend there are foreign elements... although not 100% accurate.
				containsForeignElements |= ForeignElementType.Before;
			} else if (lineDecoration.type === InlineDecorationType.Before) {
				containsForeignElements |= ForeignElementType.Before;
			} else if (lineDecoration.type === InlineDecorationType.After) {
				containsForeignElements |= ForeignElementType.After;
			}
		}
		tokens = _applyInlineDecorations(lineContent, len, tokens, input.lineDecorations);
	}
	if (!input.containsRTL) {
		// We can never split RTL text, as it ruins the rendering
		tokens = splitLargeTokens(lineContent, tokens, !input.isBasicASCII || input.fontLigatures);
	} else {
		// Split the first token if it contains both leading whitespace and RTL text
		tokens = splitLeadingWhitespaceFromRTL(lineContent, tokens);
	}

	return new ResolvedRenderLineInput(
		input.useMonospaceOptimizations,
		input.canUseHalfwidthRightwardsArrow,
		lineContent,
		len,
		isOverflowing,
		overflowingCharCount,
		tokens,
		containsForeignElements,
		input.fauxIndentLength,
		input.tabSize,
		input.startVisibleColumn,
		input.spaceWidth,
		input.renderSpaceCharCode,
		input.renderWhitespace,
		input.renderControlCharacters
	);
}

/**
 * In the rendering phase, characters are always looped until token.endIndex.
 * Ensure that all tokens end before `len` and the last one ends precisely at `len`.
 */
function transformAndRemoveOverflowing(lineContent: string, lineContainsRTL: boolean, tokens: IViewLineTokens, fauxIndentLength: number, len: number): LinePart[] {
	const result: LinePart[] = [];
	let resultLen = 0;

	// The faux indent part of the line should have no token type
	if (fauxIndentLength > 0) {
		result[resultLen++] = new LinePart(fauxIndentLength, '', 0, false);
	}
	let startOffset = fauxIndentLength;
	for (let tokenIndex = 0, tokensLen = tokens.getCount(); tokenIndex < tokensLen; tokenIndex++) {
		const endIndex = tokens.getEndOffset(tokenIndex);
		if (endIndex <= fauxIndentLength) {
			// The faux indent part of the line should have no token type
			continue;
		}
		const type = tokens.getClassName(tokenIndex);
		if (endIndex >= len) {
			const tokenContainsRTL = (lineContainsRTL ? strings.containsRTL(lineContent.substring(startOffset, len)) : false);
			result[resultLen++] = new LinePart(len, type, 0, tokenContainsRTL);
			break;
		}
		const tokenContainsRTL = (lineContainsRTL ? strings.containsRTL(lineContent.substring(startOffset, endIndex)) : false);
		result[resultLen++] = new LinePart(endIndex, type, 0, tokenContainsRTL);
		startOffset = endIndex;
	}

	return result;
}

/**
 * written as a const enum to get value inlining.
 */
const enum Constants {
	LongToken = 50
}

/**
 * See https://github.com/microsoft/vscode/issues/6885.
 * It appears that having very large spans causes very slow reading of character positions.
 * So here we try to avoid that.
 */
function splitLargeTokens(lineContent: string, tokens: LinePart[], onlyAtSpaces: boolean): LinePart[] {
	let lastTokenEndIndex = 0;
	const result: LinePart[] = [];
	let resultLen = 0;

	if (onlyAtSpaces) {
		// Split only at spaces => we need to walk each character
		for (let i = 0, len = tokens.length; i < len; i++) {
			const token = tokens[i];
			const tokenEndIndex = token.endIndex;
			if (lastTokenEndIndex + Constants.LongToken < tokenEndIndex) {
				const tokenType = token.type;
				const tokenMetadata = token.metadata;
				const tokenContainsRTL = token.containsRTL;

				let lastSpaceOffset = -1;
				let currTokenStart = lastTokenEndIndex;
				for (let j = lastTokenEndIndex; j < tokenEndIndex; j++) {
					if (lineContent.charCodeAt(j) === CharCode.Space) {
						lastSpaceOffset = j;
					}
					if (lastSpaceOffset !== -1 && j - currTokenStart >= Constants.LongToken) {
						// Split at `lastSpaceOffset` + 1
						result[resultLen++] = new LinePart(lastSpaceOffset + 1, tokenType, tokenMetadata, tokenContainsRTL);
						currTokenStart = lastSpaceOffset + 1;
						lastSpaceOffset = -1;
					}
				}
				if (currTokenStart !== tokenEndIndex) {
					result[resultLen++] = new LinePart(tokenEndIndex, tokenType, tokenMetadata, tokenContainsRTL);
				}
			} else {
				result[resultLen++] = token;
			}

			lastTokenEndIndex = tokenEndIndex;
		}
	} else {
		// Split anywhere => we don't need to walk each character
		for (let i = 0, len = tokens.length; i < len; i++) {
			const token = tokens[i];
			const tokenEndIndex = token.endIndex;
			const diff = (tokenEndIndex - lastTokenEndIndex);
			if (diff > Constants.LongToken) {
				const tokenType = token.type;
				const tokenMetadata = token.metadata;
				const tokenContainsRTL = token.containsRTL;
				const piecesCount = Math.ceil(diff / Constants.LongToken);
				for (let j = 1; j < piecesCount; j++) {
					const pieceEndIndex = lastTokenEndIndex + (j * Constants.LongToken);
					result[resultLen++] = new LinePart(pieceEndIndex, tokenType, tokenMetadata, tokenContainsRTL);
				}
				result[resultLen++] = new LinePart(tokenEndIndex, tokenType, tokenMetadata, tokenContainsRTL);
			} else {
				result[resultLen++] = token;
			}
			lastTokenEndIndex = tokenEndIndex;
		}
	}

	return result;
}

/**
 * Splits leading whitespace from the first token if it contains RTL text.
 */
function splitLeadingWhitespaceFromRTL(lineContent: string, tokens: LinePart[]): LinePart[] {
	if (tokens.length === 0) {
		return tokens;
	}

	const firstToken = tokens[0];
	if (!firstToken.containsRTL) {
		return tokens;
	}

	// Check if the first token starts with whitespace
	const firstTokenEndIndex = firstToken.endIndex;
	let firstNonWhitespaceIndex = 0;
	for (let i = 0; i < firstTokenEndIndex; i++) {
		const charCode = lineContent.charCodeAt(i);
		if (charCode !== CharCode.Space && charCode !== CharCode.Tab) {
			firstNonWhitespaceIndex = i;
			break;
		}
	}

	if (firstNonWhitespaceIndex === 0) {
		// No leading whitespace
		return tokens;
	}

	// Split the first token into leading whitespace and the rest
	const result: LinePart[] = [];
	result.push(new LinePart(firstNonWhitespaceIndex, firstToken.type, firstToken.metadata, false));
	result.push(new LinePart(firstTokenEndIndex, firstToken.type, firstToken.metadata, firstToken.containsRTL));

	// Add remaining tokens
	for (let i = 1; i < tokens.length; i++) {
		result.push(tokens[i]);
	}

	return result;
}

function isControlCharacter(charCode: number): boolean {
	if (charCode < 32) {
		return (charCode !== CharCode.Tab);
	}
	if (charCode === 127) {
		// DEL
		return true;
	}

	if (
		(charCode >= 0x202A && charCode <= 0x202E)
		|| (charCode >= 0x2066 && charCode <= 0x2069)
		|| (charCode >= 0x200E && charCode <= 0x200F)
		|| charCode === 0x061C
	) {
		// Unicode Directional Formatting Characters
		// LRE	U+202A	LEFT-TO-RIGHT EMBEDDING
		// RLE	U+202B	RIGHT-TO-LEFT EMBEDDING
		// PDF	U+202C	POP DIRECTIONAL FORMATTING
		// LRO	U+202D	LEFT-TO-RIGHT OVERRIDE
		// RLO	U+202E	RIGHT-TO-LEFT OVERRIDE
		// LRI	U+2066	LEFT-TO-RIGHT ISOLATE
		// RLI	U+2067	RIGHT-TO-LEFT ISOLATE
		// FSI	U+2068	FIRST STRONG ISOLATE
		// PDI	U+2069	POP DIRECTIONAL ISOLATE
		// LRM	U+200E	LEFT-TO-RIGHT MARK
		// RLM	U+200F	RIGHT-TO-LEFT MARK
		// ALM	U+061C	ARABIC LETTER MARK
		return true;
	}

	return false;
}

function extractControlCharacters(lineContent: string, tokens: LinePart[]): LinePart[] {
	const result: LinePart[] = [];
	let lastLinePart: LinePart = new LinePart(0, '', 0, false);
	let charOffset = 0;
	for (const token of tokens) {
		const tokenEndIndex = token.endIndex;
		for (; charOffset < tokenEndIndex; charOffset++) {
			const charCode = lineContent.charCodeAt(charOffset);
			if (isControlCharacter(charCode)) {
				if (charOffset > lastLinePart.endIndex) {
					// emit previous part if it has text
					lastLinePart = new LinePart(charOffset, token.type, token.metadata, token.containsRTL);
					result.push(lastLinePart);
				}
				lastLinePart = new LinePart(charOffset + 1, 'mtkcontrol', token.metadata, false);
				result.push(lastLinePart);
			}
		}
		if (charOffset > lastLinePart.endIndex) {
			// emit previous part if it has text
			lastLinePart = new LinePart(tokenEndIndex, token.type, token.metadata, token.containsRTL);
			result.push(lastLinePart);
		}
	}
	return result;
}

/**
 * Whitespace is rendered by "replacing" tokens with a special-purpose `mtkw` type that is later recognized in the rendering phase.
 * Moreover, a token is created for every visual indent because on some fonts the glyphs used for rendering whitespace (&rarr; or &middot;) do not have the same width as &nbsp;.
 * The rendering phase will generate `style="width:..."` for these tokens.
 */
function _applyRenderWhitespace(input: RenderLineInput, lineContent: string, len: number, tokens: LinePart[]): LinePart[] {

	const continuesWithWrappedLine = input.continuesWithWrappedLine;
	const fauxIndentLength = input.fauxIndentLength;
	const tabSize = input.tabSize;
	const startVisibleColumn = input.startVisibleColumn;
	const useMonospaceOptimizations = input.useMonospaceOptimizations;
	const selections = input.selectionsOnLine;
	const onlyBoundary = (input.renderWhitespace === RenderWhitespace.Boundary);
	const onlyTrailing = (input.renderWhitespace === RenderWhitespace.Trailing);
	const generateLinePartForEachWhitespace = (input.renderSpaceWidth !== input.spaceWidth);

	const result: LinePart[] = [];
	let resultLen = 0;
	let tokenIndex = 0;
	let tokenType = tokens[tokenIndex].type;
	let tokenContainsRTL = tokens[tokenIndex].containsRTL;
	let tokenEndIndex = tokens[tokenIndex].endIndex;
	const tokensLength = tokens.length;

	let lineIsEmptyOrWhitespace = false;
	let firstNonWhitespaceIndex = strings.firstNonWhitespaceIndex(lineContent);
	let lastNonWhitespaceIndex: number;
	if (firstNonWhitespaceIndex === -1) {
		lineIsEmptyOrWhitespace = true;
		firstNonWhitespaceIndex = len;
		lastNonWhitespaceIndex = len;
	} else {
		lastNonWhitespaceIndex = strings.lastNonWhitespaceIndex(lineContent);
	}

	let wasInWhitespace = false;
	let currentSelectionIndex = 0;
	let currentSelection = selections && selections[currentSelectionIndex];
	let tmpIndent = startVisibleColumn % tabSize;
	for (let charIndex = fauxIndentLength; charIndex < len; charIndex++) {
		const chCode = lineContent.charCodeAt(charIndex);

		if (currentSelection && currentSelection.endExclusive <= charIndex) {
			currentSelectionIndex++;
			currentSelection = selections && selections[currentSelectionIndex];
		}

		let isInWhitespace: boolean;
		if (charIndex < firstNonWhitespaceIndex || charIndex > lastNonWhitespaceIndex) {
			// in leading or trailing whitespace
			isInWhitespace = true;
		} else if (chCode === CharCode.Tab) {
			// a tab character is rendered both in all and boundary cases
			isInWhitespace = true;
		} else if (chCode === CharCode.Space) {
			// hit a space character
			if (onlyBoundary) {
				// rendering only boundary whitespace
				if (wasInWhitespace) {
					isInWhitespace = true;
				} else {
					const nextChCode = (charIndex + 1 < len ? lineContent.charCodeAt(charIndex + 1) : CharCode.Null);
					isInWhitespace = (nextChCode === CharCode.Space || nextChCode === CharCode.Tab);
				}
			} else {
				isInWhitespace = true;
			}
		} else {
			isInWhitespace = false;
		}

		// If rendering whitespace on selection, check that the charIndex falls within a selection
		if (isInWhitespace && selections) {
			isInWhitespace = !!currentSelection && currentSelection.start <= charIndex && charIndex < currentSelection.endExclusive;
		}

		// If rendering only trailing whitespace, check that the charIndex points to trailing whitespace.
		if (isInWhitespace && onlyTrailing) {
			isInWhitespace = lineIsEmptyOrWhitespace || charIndex > lastNonWhitespaceIndex;
		}

		if (isInWhitespace && tokenContainsRTL) {
			// If the token contains RTL text, breaking it up into multiple line parts
			// to render whitespace might affect the browser's bidi layout.
			//
			// We render whitespace in such tokens only if the whitespace
			// is the leading or the trailing whitespace of the line,
			// which doesn't affect the browser's bidi layout.
			if (charIndex >= firstNonWhitespaceIndex && charIndex <= lastNonWhitespaceIndex) {
				isInWhitespace = false;
			}
		}

		if (wasInWhitespace) {
			// was in whitespace token
			if (!isInWhitespace || (!useMonospaceOptimizations && tmpIndent >= tabSize)) {
				// leaving whitespace token or entering a new indent
				if (generateLinePartForEachWhitespace) {
					const lastEndIndex = (resultLen > 0 ? result[resultLen - 1].endIndex : fauxIndentLength);
					for (let i = lastEndIndex + 1; i <= charIndex; i++) {
						result[resultLen++] = new LinePart(i, 'mtkw', LinePartMetadata.IS_WHITESPACE, false);
					}
				} else {
					result[resultLen++] = new LinePart(charIndex, 'mtkw', LinePartMetadata.IS_WHITESPACE, false);
				}
				tmpIndent = tmpIndent % tabSize;
			}
		} else {
			// was in regular token
			if (charIndex === tokenEndIndex || (isInWhitespace && charIndex > fauxIndentLength)) {
				result[resultLen++] = new LinePart(charIndex, tokenType, 0, tokenContainsRTL);
				tmpIndent = tmpIndent % tabSize;
			}
		}

		if (chCode === CharCode.Tab) {
			tmpIndent = tabSize;
		} else if (strings.isFullWidthCharacter(chCode)) {
			tmpIndent += 2;
		} else {
			tmpIndent++;
		}

		wasInWhitespace = isInWhitespace;

		while (charIndex === tokenEndIndex) {
			tokenIndex++;
			if (tokenIndex < tokensLength) {
				tokenType = tokens[tokenIndex].type;
				tokenContainsRTL = tokens[tokenIndex].containsRTL;
				tokenEndIndex = tokens[tokenIndex].endIndex;
			} else {
				break;
			}
		}
	}

	let generateWhitespace = false;
	if (wasInWhitespace) {
		// was in whitespace token
		if (continuesWithWrappedLine && onlyBoundary) {
			const lastCharCode = (len > 0 ? lineContent.charCodeAt(len - 1) : CharCode.Null);
			const prevCharCode = (len > 1 ? lineContent.charCodeAt(len - 2) : CharCode.Null);
			const isSingleTrailingSpace = (lastCharCode === CharCode.Space && (prevCharCode !== CharCode.Space && prevCharCode !== CharCode.Tab));
			if (!isSingleTrailingSpace) {
				generateWhitespace = true;
			}
		} else {
			generateWhitespace = true;
		}
	}

	if (generateWhitespace) {
		if (generateLinePartForEachWhitespace) {
			const lastEndIndex = (resultLen > 0 ? result[resultLen - 1].endIndex : fauxIndentLength);
			for (let i = lastEndIndex + 1; i <= len; i++) {
				result[resultLen++] = new LinePart(i, 'mtkw', LinePartMetadata.IS_WHITESPACE, false);
			}
		} else {
			result[resultLen++] = new LinePart(len, 'mtkw', LinePartMetadata.IS_WHITESPACE, false);
		}
	} else {
		result[resultLen++] = new LinePart(len, tokenType, 0, tokenContainsRTL);
	}

	return result;
}

/**
 * Inline decorations are "merged" on top of tokens.
 * Special care must be taken when multiple inline decorations are at play and they overlap.
 */
function _applyInlineDecorations(lineContent: string, len: number, tokens: LinePart[], _lineDecorations: LineDecoration[]): LinePart[] {
	_lineDecorations.sort(LineDecoration.compare);
	const lineDecorations = LineDecorationsNormalizer.normalize(lineContent, _lineDecorations);
	const lineDecorationsLen = lineDecorations.length;

	let lineDecorationIndex = 0;
	const result: LinePart[] = [];
	let resultLen = 0;
	let lastResultEndIndex = 0;
	for (let tokenIndex = 0, len = tokens.length; tokenIndex < len; tokenIndex++) {
		const token = tokens[tokenIndex];
		const tokenEndIndex = token.endIndex;
		const tokenType = token.type;
		const tokenMetadata = token.metadata;
		const tokenContainsRTL = token.containsRTL;

		while (lineDecorationIndex < lineDecorationsLen && lineDecorations[lineDecorationIndex].startOffset < tokenEndIndex) {
			const lineDecoration = lineDecorations[lineDecorationIndex];

			if (lineDecoration.startOffset > lastResultEndIndex) {
				lastResultEndIndex = lineDecoration.startOffset;
				result[resultLen++] = new LinePart(lastResultEndIndex, tokenType, tokenMetadata, tokenContainsRTL);
			}

			if (lineDecoration.endOffset + 1 <= tokenEndIndex) {
				// This line decoration ends before this token ends
				lastResultEndIndex = lineDecoration.endOffset + 1;
				result[resultLen++] = new LinePart(lastResultEndIndex, tokenType + ' ' + lineDecoration.className, tokenMetadata | lineDecoration.metadata, tokenContainsRTL);
				lineDecorationIndex++;
			} else {
				// This line decoration continues on to the next token
				lastResultEndIndex = tokenEndIndex;
				result[resultLen++] = new LinePart(lastResultEndIndex, tokenType + ' ' + lineDecoration.className, tokenMetadata | lineDecoration.metadata, tokenContainsRTL);
				break;
			}
		}

		if (tokenEndIndex > lastResultEndIndex) {
			lastResultEndIndex = tokenEndIndex;
			result[resultLen++] = new LinePart(lastResultEndIndex, tokenType, tokenMetadata, tokenContainsRTL);
		}
	}

	const lastTokenEndIndex = tokens[tokens.length - 1].endIndex;
	if (lineDecorationIndex < lineDecorationsLen && lineDecorations[lineDecorationIndex].startOffset === lastTokenEndIndex) {
		while (lineDecorationIndex < lineDecorationsLen && lineDecorations[lineDecorationIndex].startOffset === lastTokenEndIndex) {
			const lineDecoration = lineDecorations[lineDecorationIndex];
			result[resultLen++] = new LinePart(lastResultEndIndex, lineDecoration.className, lineDecoration.metadata, false);
			lineDecorationIndex++;
		}
	}

	return result;
}

/**
 * This function is on purpose not split up into multiple functions to allow runtime type inference (i.e. performance reasons).
 * Notice how all the needed data is fully resolved and passed in (i.e. no other calls).
 */
function _renderLine(input: ResolvedRenderLineInput, sb: StringBuilder): RenderLineOutput {
	const fontIsMonospace = input.fontIsMonospace;
	const canUseHalfwidthRightwardsArrow = input.canUseHalfwidthRightwardsArrow;
	const containsForeignElements = input.containsForeignElements;
	const lineContent = input.lineContent;
	const len = input.len;
	const isOverflowing = input.isOverflowing;
	const overflowingCharCount = input.overflowingCharCount;
	const parts = input.parts;
	const fauxIndentLength = input.fauxIndentLength;
	const tabSize = input.tabSize;
	const startVisibleColumn = input.startVisibleColumn;
	const spaceWidth = input.spaceWidth;
	const renderSpaceCharCode = input.renderSpaceCharCode;
	const renderWhitespace = input.renderWhitespace;
	const renderControlCharacters = input.renderControlCharacters;

	const characterMapping = new CharacterMapping(len + 1, parts.length);
	let lastCharacterMappingDefined = false;

	let charIndex = 0;
	let visibleColumn = startVisibleColumn;
	let charOffsetInPart = 0; // the character offset in the current part
	let charHorizontalOffset = 0; // the character horizontal position in terms of chars relative to line start

	let partDisplacement = 0;

	sb.appendString('<span>');

	for (let partIndex = 0, tokensLen = parts.length; partIndex < tokensLen; partIndex++) {

		const part = parts[partIndex];
		const partEndIndex = part.endIndex;
		const partType = part.type;
		const partContainsRTL = part.containsRTL;
		const partRendersWhitespace = (renderWhitespace !== RenderWhitespace.None && part.isWhitespace());
		const partRendersWhitespaceWithWidth = partRendersWhitespace && !fontIsMonospace && (partType === 'mtkw'/*only whitespace*/ || !containsForeignElements);
		const partIsEmptyAndHasPseudoAfter = (charIndex === partEndIndex && part.isPseudoAfter());
		charOffsetInPart = 0;

		sb.appendString('<span ');
		if (partContainsRTL) {
			sb.appendString('style="unicode-bidi:isolate" ');
		}
		sb.appendString('class="');
		sb.appendString(partRendersWhitespaceWithWidth ? 'mtkz' : partType);
		sb.appendASCIICharCode(CharCode.DoubleQuote);

		if (partRendersWhitespace) {

			let partWidth = 0;
			{
				let _charIndex = charIndex;
				let _visibleColumn = visibleColumn;

				for (; _charIndex < partEndIndex; _charIndex++) {
					const charCode = lineContent.charCodeAt(_charIndex);
					const charWidth = (charCode === CharCode.Tab ? (tabSize - (_visibleColumn % tabSize)) : 1) | 0;
					partWidth += charWidth;
					if (_charIndex >= fauxIndentLength) {
						_visibleColumn += charWidth;
					}
				}
			}

			if (partRendersWhitespaceWithWidth) {
				sb.appendString(' style="width:');
				sb.appendString(String(spaceWidth * partWidth));
				sb.appendString('px"');
			}
			sb.appendASCIICharCode(CharCode.GreaterThan);

			for (; charIndex < partEndIndex; charIndex++) {
				characterMapping.setColumnInfo(charIndex + 1, partIndex - partDisplacement, charOffsetInPart, charHorizontalOffset);
				partDisplacement = 0;
				const charCode = lineContent.charCodeAt(charIndex);

				let producedCharacters: number;
				let charWidth: number;

				if (charCode === CharCode.Tab) {
					producedCharacters = (tabSize - (visibleColumn % tabSize)) | 0;
					charWidth = producedCharacters;

					if (!canUseHalfwidthRightwardsArrow || charWidth > 1) {
						sb.appendCharCode(0x2192); // RIGHTWARDS ARROW
					} else {
						sb.appendCharCode(0xFFEB); // HALFWIDTH RIGHTWARDS ARROW
					}
					for (let space = 2; space <= charWidth; space++) {
						sb.appendCharCode(0xA0); // &nbsp;
					}

				} else { // must be CharCode.Space
					producedCharacters = 2;
					charWidth = 1;

					sb.appendCharCode(renderSpaceCharCode); // &middot; or word separator middle dot
					sb.appendCharCode(0x200C); // ZERO WIDTH NON-JOINER
				}

				charOffsetInPart += producedCharacters;
				charHorizontalOffset += charWidth;
				if (charIndex >= fauxIndentLength) {
					visibleColumn += charWidth;
				}
			}

		} else {

			sb.appendASCIICharCode(CharCode.GreaterThan);

			for (; charIndex < partEndIndex; charIndex++) {
				characterMapping.setColumnInfo(charIndex + 1, partIndex - partDisplacement, charOffsetInPart, charHorizontalOffset);
				partDisplacement = 0;
				const charCode = lineContent.charCodeAt(charIndex);

				let producedCharacters = 1;
				let charWidth = 1;

				switch (charCode) {
					case CharCode.Tab:
						producedCharacters = (tabSize - (visibleColumn % tabSize));
						charWidth = producedCharacters;
						for (let space = 1; space <= producedCharacters; space++) {
							sb.appendCharCode(0xA0); // &nbsp;
						}
						break;

					case CharCode.Space:
						sb.appendCharCode(0xA0); // &nbsp;
						break;

					case CharCode.LessThan:
						sb.appendString('&lt;');
						break;

					case CharCode.GreaterThan:
						sb.appendString('&gt;');
						break;

					case CharCode.Ampersand:
						sb.appendString('&amp;');
						break;

					case CharCode.Null:
						if (renderControlCharacters) {
							// See https://unicode-table.com/en/blocks/control-pictures/
							sb.appendCharCode(9216);
						} else {
							sb.appendString('&#00;');
						}
						break;

					case CharCode.UTF8_BOM:
					case CharCode.LINE_SEPARATOR:
					case CharCode.PARAGRAPH_SEPARATOR:
					case CharCode.NEXT_LINE:
						sb.appendCharCode(0xFFFD);
						break;

					default:
						if (strings.isFullWidthCharacter(charCode)) {
							charWidth++;
						}
						// See https://unicode-table.com/en/blocks/control-pictures/
						if (renderControlCharacters && charCode < 32) {
							sb.appendCharCode(9216 + charCode);
						} else if (renderControlCharacters && charCode === 127) {
							// DEL
							sb.appendCharCode(9249);
						} else if (renderControlCharacters && isControlCharacter(charCode)) {
							sb.appendString('[U+');
							sb.appendString(to4CharHex(charCode));
							sb.appendString(']');
							producedCharacters = 8;
							charWidth = producedCharacters;
						} else {
							sb.appendCharCode(charCode);
						}
				}

				charOffsetInPart += producedCharacters;
				charHorizontalOffset += charWidth;
				if (charIndex >= fauxIndentLength) {
					visibleColumn += charWidth;
				}
			}
		}

		if (partIsEmptyAndHasPseudoAfter) {
			partDisplacement++;
		} else {
			partDisplacement = 0;
		}

		if (charIndex >= len && !lastCharacterMappingDefined && part.isPseudoAfter()) {
			lastCharacterMappingDefined = true;
			characterMapping.setColumnInfo(charIndex + 1, partIndex, charOffsetInPart, charHorizontalOffset);
		}

		sb.appendString('</span>');

	}

	if (!lastCharacterMappingDefined) {
		// When getting client rects for the last character, we will position the
		// text range at the end of the span, insteaf of at the beginning of next span
		characterMapping.setColumnInfo(len + 1, parts.length - 1, charOffsetInPart, charHorizontalOffset);
	}

	if (isOverflowing) {
		sb.appendString('<span class="mtkoverflow">');
		sb.appendString(nls.localize('showMore', "Show more ({0})", renderOverflowingCharCount(overflowingCharCount)));
		sb.appendString('</span>');
	}

	sb.appendString('</span>');

	return new RenderLineOutput(characterMapping, containsForeignElements);
}

function to4CharHex(n: number): string {
	return n.toString(16).toUpperCase().padStart(4, '0');
}

function renderOverflowingCharCount(n: number): string {
	if (n < 1024) {
		return nls.localize('overflow.chars', "{0} chars", n);
	}
	if (n < 1024 * 1024) {
		return `${(n / 1024).toFixed(1)} KB`;
	}
	return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewLayout/viewLinesViewportData.ts]---
Location: vscode-main/src/vs/editor/common/viewLayout/viewLinesViewportData.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Range } from '../core/range.js';
import { Selection } from '../core/selection.js';
import { IPartialViewLinesViewportData, IViewModel, IViewWhitespaceViewportData, ViewLineRenderingData } from '../viewModel.js';
import { ViewModelDecoration } from '../viewModel/viewModelDecoration.js';

/**
 * Contains all data needed to render at a specific viewport.
 */
export class ViewportData {

	public readonly selections: Selection[];

	/**
	 * The line number at which to start rendering (inclusive).
	 */
	public readonly startLineNumber: number;

	/**
	 * The line number at which to end rendering (inclusive).
	 */
	public readonly endLineNumber: number;

	/**
	 * relativeVerticalOffset[i] is the `top` position for line at `i` + `startLineNumber`.
	 */
	public readonly relativeVerticalOffset: number[];

	/**
	 * The viewport as a range (startLineNumber,1) -> (endLineNumber,maxColumn(endLineNumber)).
	 */
	public readonly visibleRange: Range;

	/**
	 * Value to be substracted from `scrollTop` (in order to vertical offset numbers < 1MM)
	 */
	public readonly bigNumbersDelta: number;

	/**
	 * Positioning information about gaps whitespace.
	 */
	public readonly whitespaceViewportData: IViewWhitespaceViewportData[];

	private readonly _model: IViewModel;

	public readonly lineHeight: number;

	constructor(
		selections: Selection[],
		partialData: IPartialViewLinesViewportData,
		whitespaceViewportData: IViewWhitespaceViewportData[],
		model: IViewModel
	) {
		this.selections = selections;
		this.startLineNumber = partialData.startLineNumber | 0;
		this.endLineNumber = partialData.endLineNumber | 0;
		this.relativeVerticalOffset = partialData.relativeVerticalOffset;
		this.bigNumbersDelta = partialData.bigNumbersDelta | 0;
		this.lineHeight = partialData.lineHeight | 0;
		this.whitespaceViewportData = whitespaceViewportData;

		this._model = model;

		this.visibleRange = new Range(
			partialData.startLineNumber,
			this._model.getLineMinColumn(partialData.startLineNumber),
			partialData.endLineNumber,
			this._model.getLineMaxColumn(partialData.endLineNumber)
		);
	}

	public getViewLineRenderingData(lineNumber: number): ViewLineRenderingData {
		return this._model.getViewportViewLineRenderingData(this.visibleRange, lineNumber);
	}

	public getDecorationsInViewport(): ViewModelDecoration[] {
		return this._model.getDecorationsInViewport(this.visibleRange);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewModel/glyphLanesModel.ts]---
Location: vscode-main/src/vs/editor/common/viewModel/glyphLanesModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Range } from '../core/range.js';
import { GlyphMarginLane, IGlyphMarginLanesModel } from '../model.js';


const MAX_LANE = GlyphMarginLane.Right;

export class GlyphMarginLanesModel implements IGlyphMarginLanesModel {
	private lanes: Uint8Array;
	private persist = 0;
	private _requiredLanes = 1; // always render at least one lane

	constructor(maxLine: number) {
		this.lanes = new Uint8Array(Math.ceil(((maxLine + 1) * MAX_LANE) / 8));
	}

	public reset(maxLine: number) {
		const bytes = Math.ceil(((maxLine + 1) * MAX_LANE) / 8);
		if (this.lanes.length < bytes) {
			this.lanes = new Uint8Array(bytes);
		} else {
			this.lanes.fill(0);
		}
		this._requiredLanes = 1;
	}

	public get requiredLanes() {
		return this._requiredLanes;
	}

	public push(lane: GlyphMarginLane, range: Range, persist?: boolean): void {
		if (persist) {
			this.persist |= (1 << (lane - 1));
		}
		for (let i = range.startLineNumber; i <= range.endLineNumber; i++) {
			const bit = (MAX_LANE * i) + (lane - 1);
			this.lanes[bit >>> 3] |= (1 << (bit % 8));
			this._requiredLanes = Math.max(this._requiredLanes, this.countAtLine(i));
		}
	}

	public getLanesAtLine(lineNumber: number): GlyphMarginLane[] {
		const lanes: GlyphMarginLane[] = [];
		let bit = MAX_LANE * lineNumber;
		for (let i = 0; i < MAX_LANE; i++) {
			if (this.persist & (1 << i) || this.lanes[bit >>> 3] & (1 << (bit % 8))) {
				lanes.push(i + 1);
			}
			bit++;
		}

		return lanes.length ? lanes : [GlyphMarginLane.Center];
	}

	private countAtLine(lineNumber: number): number {
		let bit = MAX_LANE * lineNumber;
		let count = 0;
		for (let i = 0; i < MAX_LANE; i++) {
			if (this.persist & (1 << i) || this.lanes[bit >>> 3] & (1 << (bit % 8))) {
				count++;
			}
			bit++;
		}
		return count;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewModel/inlineDecorations.ts]---
Location: vscode-main/src/vs/editor/common/viewModel/inlineDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Range } from '../core/range.js';

export const enum InlineDecorationType {
	Regular = 0,
	Before = 1,
	After = 2,
	RegularAffectingLetterSpacing = 3
}

export class InlineDecoration {
	constructor(
		public readonly range: Range,
		public readonly inlineClassName: string,
		public readonly type: InlineDecorationType
	) { }
}

export class SingleLineInlineDecoration {
	constructor(
		public readonly startOffset: number,
		public readonly endOffset: number,
		public readonly inlineClassName: string,
		public readonly inlineClassNameAffectsLetterSpacing: boolean
	) {
	}

	toInlineDecoration(lineNumber: number): InlineDecoration {
		return new InlineDecoration(
			new Range(lineNumber, this.startOffset + 1, lineNumber, this.endOffset + 1),
			this.inlineClassName,
			this.inlineClassNameAffectsLetterSpacing ? InlineDecorationType.RegularAffectingLetterSpacing : InlineDecorationType.Regular
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/viewModel/minimapTokensColorTracker.ts]---
Location: vscode-main/src/vs/editor/common/viewModel/minimapTokensColorTracker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, markAsSingleton } from '../../../base/common/lifecycle.js';
import { RGBA8 } from '../core/misc/rgba.js';
import { TokenizationRegistry } from '../languages.js';
import { ColorId } from '../encodedTokenAttributes.js';

export class MinimapTokensColorTracker extends Disposable {
	private static _INSTANCE: MinimapTokensColorTracker | null = null;
	public static getInstance(): MinimapTokensColorTracker {
		if (!this._INSTANCE) {
			this._INSTANCE = markAsSingleton(new MinimapTokensColorTracker());
		}
		return this._INSTANCE;
	}

	private _colors!: RGBA8[];
	private _backgroundIsLight!: boolean;

	private readonly _onDidChange = new Emitter<void>();
	public readonly onDidChange: Event<void> = this._onDidChange.event;

	private constructor() {
		super();
		this._updateColorMap();
		this._register(TokenizationRegistry.onDidChange(e => {
			if (e.changedColorMap) {
				this._updateColorMap();
			}
		}));
	}

	private _updateColorMap(): void {
		const colorMap = TokenizationRegistry.getColorMap();
		if (!colorMap) {
			this._colors = [RGBA8.Empty];
			this._backgroundIsLight = true;
			return;
		}
		this._colors = [RGBA8.Empty];
		for (let colorId = 1; colorId < colorMap.length; colorId++) {
			const source = colorMap[colorId].rgba;
			// Use a VM friendly data-type
			this._colors[colorId] = new RGBA8(source.r, source.g, source.b, Math.round(source.a * 255));
		}
		const backgroundLuminosity = colorMap[ColorId.DefaultBackground].getRelativeLuminance();
		this._backgroundIsLight = backgroundLuminosity >= 0.5;
		this._onDidChange.fire(undefined);
	}

	public getColor(colorId: ColorId): RGBA8 {
		if (colorId < 1 || colorId >= this._colors.length) {
			// background color (basically invisible)
			colorId = ColorId.DefaultBackground;
		}
		return this._colors[colorId];
	}

	public backgroundIsLight(): boolean {
		return this._backgroundIsLight;
	}
}
```

--------------------------------------------------------------------------------

````
