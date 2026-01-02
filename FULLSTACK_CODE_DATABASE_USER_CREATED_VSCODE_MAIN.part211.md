---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 211
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 211 of 552)

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

---[FILE: src/vs/editor/common/cursor/cursorTypeEditOperations.ts]---
Location: vscode-main/src/vs/editor/common/cursor/cursorTypeEditOperations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import * as strings from '../../../base/common/strings.js';
import { ReplaceCommand, ReplaceCommandWithOffsetCursorState, ReplaceCommandWithoutChangingPosition, ReplaceCommandThatPreservesSelection, ReplaceOvertypeCommand, ReplaceOvertypeCommandOnCompositionEnd } from '../commands/replaceCommand.js';
import { ShiftCommand } from '../commands/shiftCommand.js';
import { SurroundSelectionCommand } from '../commands/surroundSelectionCommand.js';
import { CursorConfiguration, EditOperationResult, EditOperationType, ICursorSimpleModel, isQuote } from '../cursorCommon.js';
import { WordCharacterClass, getMapForWordSeparators } from '../core/wordCharacterClassifier.js';
import { Range } from '../core/range.js';
import { Selection } from '../core/selection.js';
import { Position } from '../core/position.js';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from '../editorCommon.js';
import { ITextModel } from '../model.js';
import { EnterAction, IndentAction, StandardAutoClosingPairConditional } from '../languages/languageConfiguration.js';
import { getIndentationAtPosition } from '../languages/languageConfigurationRegistry.js';
import { IElectricAction } from '../languages/supports/electricCharacter.js';
import { EditorAutoClosingStrategy, EditorAutoIndentStrategy } from '../config/editorOptions.js';
import { createScopedLineTokens } from '../languages/supports.js';
import { getIndentActionForType, getIndentForEnter, getInheritIndentForLine } from '../languages/autoIndent.js';
import { getEnterAction } from '../languages/enterAction.js';
import { CompositionOutcome } from './cursorTypeOperations.js';

export class AutoIndentOperation {

	public static getEdits(config: CursorConfiguration, model: ITextModel, selections: Selection[], ch: string, isDoingComposition: boolean): EditOperationResult | undefined {
		if (!isDoingComposition && this._isAutoIndentType(config, model, selections)) {
			const indentationForSelections: { selection: Selection; indentation: string }[] = [];
			for (const selection of selections) {
				const indentation = this._findActualIndentationForSelection(config, model, selection, ch);
				if (indentation === null) {
					// Auto indentation failed
					return;
				}
				indentationForSelections.push({ selection, indentation });
			}
			const autoClosingPairClose = AutoClosingOpenCharTypeOperation.getAutoClosingPairClose(config, model, selections, ch, false);
			return this._getIndentationAndAutoClosingPairEdits(config, model, indentationForSelections, ch, autoClosingPairClose);
		}
		return;
	}

	private static _isAutoIndentType(config: CursorConfiguration, model: ITextModel, selections: Selection[]): boolean {
		if (config.autoIndent < EditorAutoIndentStrategy.Full) {
			return false;
		}
		for (let i = 0, len = selections.length; i < len; i++) {
			if (!model.tokenization.isCheapToTokenize(selections[i].getEndPosition().lineNumber)) {
				return false;
			}
		}
		return true;
	}

	private static _findActualIndentationForSelection(config: CursorConfiguration, model: ITextModel, selection: Selection, ch: string): string | null {
		const actualIndentation = getIndentActionForType(config, model, selection, ch, {
			shiftIndent: (indentation) => {
				return shiftIndent(config, indentation);
			},
			unshiftIndent: (indentation) => {
				return unshiftIndent(config, indentation);
			},
		}, config.languageConfigurationService);

		if (actualIndentation === null) {
			return null;
		}

		const currentIndentation = getIndentationAtPosition(model, selection.startLineNumber, selection.startColumn);
		if (actualIndentation === config.normalizeIndentation(currentIndentation)) {
			return null;
		}
		return actualIndentation;
	}

	private static _getIndentationAndAutoClosingPairEdits(config: CursorConfiguration, model: ITextModel, indentationForSelections: { selection: Selection; indentation: string }[], ch: string, autoClosingPairClose: string | null): EditOperationResult {
		const commands: ICommand[] = indentationForSelections.map(({ selection, indentation }) => {
			if (autoClosingPairClose !== null) {
				// Apply both auto closing pair edits and auto indentation edits
				const indentationEdit = this._getEditFromIndentationAndSelection(config, model, indentation, selection, ch, false);
				return new TypeWithIndentationAndAutoClosingCommand(indentationEdit, selection, ch, autoClosingPairClose);
			} else {
				// Apply only auto indentation edits
				const indentationEdit = this._getEditFromIndentationAndSelection(config, model, indentation, selection, ch, true);
				return typeCommand(indentationEdit.range, indentationEdit.text, false);
			}
		});
		const editOptions = { shouldPushStackElementBefore: true, shouldPushStackElementAfter: false };
		return new EditOperationResult(EditOperationType.TypingOther, commands, editOptions);
	}

	private static _getEditFromIndentationAndSelection(config: CursorConfiguration, model: ITextModel, indentation: string, selection: Selection, ch: string, includeChInEdit: boolean = true): { range: Range; text: string } {
		const startLineNumber = selection.startLineNumber;
		const firstNonWhitespaceColumn = model.getLineFirstNonWhitespaceColumn(startLineNumber);
		let text: string = config.normalizeIndentation(indentation);
		if (firstNonWhitespaceColumn !== 0) {
			const startLine = model.getLineContent(startLineNumber);
			text += startLine.substring(firstNonWhitespaceColumn - 1, selection.startColumn - 1);
		}
		text += includeChInEdit ? ch : '';
		const range = new Range(startLineNumber, 1, selection.endLineNumber, selection.endColumn);
		return { range, text };
	}
}

export class AutoClosingOvertypeOperation {

	public static getEdits(prevEditOperationType: EditOperationType, config: CursorConfiguration, model: ITextModel, selections: Selection[], autoClosedCharacters: Range[], ch: string): EditOperationResult | undefined {
		if (isAutoClosingOvertype(config, model, selections, autoClosedCharacters, ch)) {
			return this._runAutoClosingOvertype(prevEditOperationType, selections, ch);
		}
		return;
	}

	private static _runAutoClosingOvertype(prevEditOperationType: EditOperationType, selections: Selection[], ch: string): EditOperationResult {
		const commands: ICommand[] = [];
		for (let i = 0, len = selections.length; i < len; i++) {
			const selection = selections[i];
			const position = selection.getPosition();
			const typeSelection = new Range(position.lineNumber, position.column, position.lineNumber, position.column + 1);
			commands[i] = new ReplaceCommand(typeSelection, ch);
		}
		return new EditOperationResult(EditOperationType.TypingOther, commands, {
			shouldPushStackElementBefore: shouldPushStackElementBetween(prevEditOperationType, EditOperationType.TypingOther),
			shouldPushStackElementAfter: false
		});
	}
}

export class AutoClosingOvertypeWithInterceptorsOperation {

	public static getEdits(config: CursorConfiguration, model: ITextModel, selections: Selection[], autoClosedCharacters: Range[], ch: string): EditOperationResult | undefined {
		if (isAutoClosingOvertype(config, model, selections, autoClosedCharacters, ch)) {
			// Unfortunately, the close character is at this point "doubled", so we need to delete it...
			const commands = selections.map(s => new ReplaceCommand(new Range(s.positionLineNumber, s.positionColumn, s.positionLineNumber, s.positionColumn + 1), '', false));
			return new EditOperationResult(EditOperationType.TypingOther, commands, {
				shouldPushStackElementBefore: true,
				shouldPushStackElementAfter: false
			});
		}
		return;
	}
}

export class AutoClosingOpenCharTypeOperation {

	public static getEdits(config: CursorConfiguration, model: ITextModel, selections: Selection[], ch: string, chIsAlreadyTyped: boolean, isDoingComposition: boolean): EditOperationResult | undefined {
		if (!isDoingComposition) {
			const autoClosingPairClose = this.getAutoClosingPairClose(config, model, selections, ch, chIsAlreadyTyped);
			if (autoClosingPairClose !== null) {
				return this._runAutoClosingOpenCharType(selections, ch, chIsAlreadyTyped, autoClosingPairClose);
			}
		}
		return;
	}

	private static _runAutoClosingOpenCharType(selections: Selection[], ch: string, chIsAlreadyTyped: boolean, autoClosingPairClose: string): EditOperationResult {
		const commands: ICommand[] = [];
		for (let i = 0, len = selections.length; i < len; i++) {
			const selection = selections[i];
			commands[i] = new TypeWithAutoClosingCommand(selection, ch, !chIsAlreadyTyped, autoClosingPairClose);
		}
		return new EditOperationResult(EditOperationType.TypingOther, commands, {
			shouldPushStackElementBefore: true,
			shouldPushStackElementAfter: false
		});
	}

	public static getAutoClosingPairClose(config: CursorConfiguration, model: ITextModel, selections: Selection[], ch: string, chIsAlreadyTyped: boolean): string | null {
		for (const selection of selections) {
			if (!selection.isEmpty()) {
				return null;
			}
		}
		// This method is called both when typing (regularly) and when composition ends
		// This means that we need to work with a text buffer where sometimes `ch` is not
		// there (it is being typed right now) or with a text buffer where `ch` has already been typed
		//
		// In order to avoid adding checks for `chIsAlreadyTyped` in all places, we will work
		// with two conceptual positions, the position before `ch` and the position after `ch`
		//
		const positions: { lineNumber: number; beforeColumn: number; afterColumn: number }[] = selections.map((s) => {
			const position = s.getPosition();
			if (chIsAlreadyTyped) {
				return { lineNumber: position.lineNumber, beforeColumn: position.column - ch.length, afterColumn: position.column };
			} else {
				return { lineNumber: position.lineNumber, beforeColumn: position.column, afterColumn: position.column };
			}
		});
		// Find the longest auto-closing open pair in case of multiple ending in `ch`
		// e.g. when having [f","] and [","], it picks [f","] if the character before is f
		const pair = this._findAutoClosingPairOpen(config, model, positions.map(p => new Position(p.lineNumber, p.beforeColumn)), ch);
		if (!pair) {
			return null;
		}
		let autoCloseConfig: EditorAutoClosingStrategy;
		let shouldAutoCloseBefore: (ch: string) => boolean;

		const chIsQuote = isQuote(ch);
		if (chIsQuote) {
			autoCloseConfig = config.autoClosingQuotes;
			shouldAutoCloseBefore = config.shouldAutoCloseBefore.quote;
		} else {
			const pairIsForComments = config.blockCommentStartToken ? pair.open.includes(config.blockCommentStartToken) : false;
			if (pairIsForComments) {
				autoCloseConfig = config.autoClosingComments;
				shouldAutoCloseBefore = config.shouldAutoCloseBefore.comment;
			} else {
				autoCloseConfig = config.autoClosingBrackets;
				shouldAutoCloseBefore = config.shouldAutoCloseBefore.bracket;
			}
		}
		if (autoCloseConfig === 'never') {
			return null;
		}
		// Sometimes, it is possible to have two auto-closing pairs that have a containment relationship
		// e.g. when having [(,)] and [(*,*)]
		// - when typing (, the resulting state is (|)
		// - when typing *, the desired resulting state is (*|*), not (*|*))
		const containedPair = this._findContainedAutoClosingPair(config, pair);
		const containedPairClose = containedPair ? containedPair.close : '';
		let isContainedPairPresent = true;

		for (const position of positions) {
			const { lineNumber, beforeColumn, afterColumn } = position;
			const lineText = model.getLineContent(lineNumber);
			const lineBefore = lineText.substring(0, beforeColumn - 1);
			const lineAfter = lineText.substring(afterColumn - 1);

			if (!lineAfter.startsWith(containedPairClose)) {
				isContainedPairPresent = false;
			}
			// Only consider auto closing the pair if an allowed character follows or if another autoclosed pair closing brace follows
			if (lineAfter.length > 0) {
				const characterAfter = lineAfter.charAt(0);
				const isBeforeCloseBrace = this._isBeforeClosingBrace(config, lineAfter);
				if (!isBeforeCloseBrace && !shouldAutoCloseBefore(characterAfter)) {
					return null;
				}
			}
			// Do not auto-close ' or " after a word character
			if (pair.open.length === 1 && (ch === '\'' || ch === '"') && autoCloseConfig !== 'always') {
				const wordSeparators = getMapForWordSeparators(config.wordSeparators, []);
				if (lineBefore.length > 0) {
					const characterBefore = lineBefore.charCodeAt(lineBefore.length - 1);
					if (wordSeparators.get(characterBefore) === WordCharacterClass.Regular) {
						return null;
					}
				}
			}
			if (!model.tokenization.isCheapToTokenize(lineNumber)) {
				// Do not force tokenization
				return null;
			}
			model.tokenization.forceTokenization(lineNumber);
			const lineTokens = model.tokenization.getLineTokens(lineNumber);
			const scopedLineTokens = createScopedLineTokens(lineTokens, beforeColumn - 1);
			if (!pair.shouldAutoClose(scopedLineTokens, beforeColumn - scopedLineTokens.firstCharOffset)) {
				return null;
			}
			// Typing for example a quote could either start a new string, in which case auto-closing is desirable
			// or it could end a previously started string, in which case auto-closing is not desirable
			//
			// In certain cases, it is really not possible to look at the previous token to determine
			// what would happen. That's why we do something really unusual, we pretend to type a different
			// character and ask the tokenizer what the outcome of doing that is: after typing a neutral
			// character, are we in a string (i.e. the quote would most likely end a string) or not?
			//
			const neutralCharacter = pair.findNeutralCharacter();
			if (neutralCharacter) {
				const tokenType = model.tokenization.getTokenTypeIfInsertingCharacter(lineNumber, beforeColumn, neutralCharacter);
				if (!pair.isOK(tokenType)) {
					return null;
				}
			}
		}
		if (isContainedPairPresent) {
			return pair.close.substring(0, pair.close.length - containedPairClose.length);
		} else {
			return pair.close;
		}
	}

	/**
	 * Find another auto-closing pair that is contained by the one passed in.
	 *
	 * e.g. when having [(,)] and [(*,*)] as auto-closing pairs
	 * this method will find [(,)] as a containment pair for [(*,*)]
	 */
	private static _findContainedAutoClosingPair(config: CursorConfiguration, pair: StandardAutoClosingPairConditional): StandardAutoClosingPairConditional | null {
		if (pair.open.length <= 1) {
			return null;
		}
		const lastChar = pair.close.charAt(pair.close.length - 1);
		// get candidates with the same last character as close
		const candidates = config.autoClosingPairs.autoClosingPairsCloseByEnd.get(lastChar) || [];
		let result: StandardAutoClosingPairConditional | null = null;
		for (const candidate of candidates) {
			if (candidate.open !== pair.open && pair.open.includes(candidate.open) && pair.close.endsWith(candidate.close)) {
				if (!result || candidate.open.length > result.open.length) {
					result = candidate;
				}
			}
		}
		return result;
	}

	/**
	 * Determine if typing `ch` at all `positions` in the `model` results in an
	 * auto closing open sequence being typed.
	 *
	 * Auto closing open sequences can consist of multiple characters, which
	 * can lead to ambiguities. In such a case, the longest auto-closing open
	 * sequence is returned.
	 */
	private static _findAutoClosingPairOpen(config: CursorConfiguration, model: ITextModel, positions: Position[], ch: string): StandardAutoClosingPairConditional | null {
		const candidates = config.autoClosingPairs.autoClosingPairsOpenByEnd.get(ch);
		if (!candidates) {
			return null;
		}
		// Determine which auto-closing pair it is
		let result: StandardAutoClosingPairConditional | null = null;
		for (const candidate of candidates) {
			if (result === null || candidate.open.length > result.open.length) {
				let candidateIsMatch = true;
				for (const position of positions) {
					const relevantText = model.getValueInRange(new Range(position.lineNumber, position.column - candidate.open.length + 1, position.lineNumber, position.column));
					if (relevantText + ch !== candidate.open) {
						candidateIsMatch = false;
						break;
					}
				}
				if (candidateIsMatch) {
					result = candidate;
				}
			}
		}
		return result;
	}

	private static _isBeforeClosingBrace(config: CursorConfiguration, lineAfter: string) {
		// If the start of lineAfter can be interpretted as both a starting or ending brace, default to returning false
		const nextChar = lineAfter.charAt(0);
		const potentialStartingBraces = config.autoClosingPairs.autoClosingPairsOpenByStart.get(nextChar) || [];
		const potentialClosingBraces = config.autoClosingPairs.autoClosingPairsCloseByStart.get(nextChar) || [];

		const isBeforeStartingBrace = potentialStartingBraces.some(x => lineAfter.startsWith(x.open));
		const isBeforeClosingBrace = potentialClosingBraces.some(x => lineAfter.startsWith(x.close));

		return !isBeforeStartingBrace && isBeforeClosingBrace;
	}
}

export class CompositionEndOvertypeOperation {

	public static getEdits(config: CursorConfiguration, compositions: CompositionOutcome[]): EditOperationResult | null {
		const isOvertypeMode = config.inputMode === 'overtype';
		if (!isOvertypeMode) {
			return null;
		}
		const commands = compositions.map(composition => new ReplaceOvertypeCommandOnCompositionEnd(composition.insertedTextRange));
		return new EditOperationResult(EditOperationType.TypingOther, commands, {
			shouldPushStackElementBefore: true,
			shouldPushStackElementAfter: false
		});
	}
}

export class SurroundSelectionOperation {

	public static getEdits(config: CursorConfiguration, model: ITextModel, selections: Selection[], ch: string, isDoingComposition: boolean): EditOperationResult | undefined {
		if (!isDoingComposition && this._isSurroundSelectionType(config, model, selections, ch)) {
			return this._runSurroundSelectionType(config, selections, ch);
		}
		return;
	}

	private static _runSurroundSelectionType(config: CursorConfiguration, selections: Selection[], ch: string): EditOperationResult {
		const commands: ICommand[] = [];
		for (let i = 0, len = selections.length; i < len; i++) {
			const selection = selections[i];
			const closeCharacter = config.surroundingPairs[ch];
			commands[i] = new SurroundSelectionCommand(selection, ch, closeCharacter);
		}
		return new EditOperationResult(EditOperationType.Other, commands, {
			shouldPushStackElementBefore: true,
			shouldPushStackElementAfter: true
		});
	}

	private static _isSurroundSelectionType(config: CursorConfiguration, model: ITextModel, selections: Selection[], ch: string): boolean {
		if (!shouldSurroundChar(config, ch) || !config.surroundingPairs.hasOwnProperty(ch)) {
			return false;
		}
		const isTypingAQuoteCharacter = isQuote(ch);
		for (const selection of selections) {
			if (selection.isEmpty()) {
				return false;
			}
			let selectionContainsOnlyWhitespace = true;
			for (let lineNumber = selection.startLineNumber; lineNumber <= selection.endLineNumber; lineNumber++) {
				const lineText = model.getLineContent(lineNumber);
				const startIndex = (lineNumber === selection.startLineNumber ? selection.startColumn - 1 : 0);
				const endIndex = (lineNumber === selection.endLineNumber ? selection.endColumn - 1 : lineText.length);
				const selectedText = lineText.substring(startIndex, endIndex);
				if (/[^ \t]/.test(selectedText)) {
					// this selected text contains something other than whitespace
					selectionContainsOnlyWhitespace = false;
					break;
				}
			}
			if (selectionContainsOnlyWhitespace) {
				return false;
			}
			if (isTypingAQuoteCharacter && selection.startLineNumber === selection.endLineNumber && selection.startColumn + 1 === selection.endColumn) {
				const selectionText = model.getValueInRange(selection);
				if (isQuote(selectionText)) {
					// Typing a quote character on top of another quote character
					// => disable surround selection type
					return false;
				}
			}
		}
		return true;
	}
}

export class InterceptorElectricCharOperation {

	public static getEdits(prevEditOperationType: EditOperationType, config: CursorConfiguration, model: ITextModel, selections: Selection[], ch: string, isDoingComposition: boolean): EditOperationResult | undefined {
		// Electric characters make sense only when dealing with a single cursor,
		// as multiple cursors typing brackets for example would interfer with bracket matching
		if (!isDoingComposition && this._isTypeInterceptorElectricChar(config, model, selections)) {
			const r = this._typeInterceptorElectricChar(prevEditOperationType, config, model, selections[0], ch);
			if (r) {
				return r;
			}
		}
		return;
	}

	private static _isTypeInterceptorElectricChar(config: CursorConfiguration, model: ITextModel, selections: Selection[]) {
		if (selections.length === 1 && model.tokenization.isCheapToTokenize(selections[0].getEndPosition().lineNumber)) {
			return true;
		}
		return false;
	}

	private static _typeInterceptorElectricChar(prevEditOperationType: EditOperationType, config: CursorConfiguration, model: ITextModel, selection: Selection, ch: string): EditOperationResult | null {
		if (!config.electricChars.hasOwnProperty(ch) || !selection.isEmpty()) {
			return null;
		}
		const position = selection.getPosition();
		model.tokenization.forceTokenization(position.lineNumber);
		const lineTokens = model.tokenization.getLineTokens(position.lineNumber);
		let electricAction: IElectricAction | null;
		try {
			electricAction = config.onElectricCharacter(ch, lineTokens, position.column);
		} catch (e) {
			onUnexpectedError(e);
			return null;
		}
		if (!electricAction) {
			return null;
		}
		if (electricAction.matchOpenBracket) {
			const endColumn = (lineTokens.getLineContent() + ch).lastIndexOf(electricAction.matchOpenBracket) + 1;
			const match = model.bracketPairs.findMatchingBracketUp(electricAction.matchOpenBracket, {
				lineNumber: position.lineNumber,
				column: endColumn
			}, 500 /* give at most 500ms to compute */);
			if (match) {
				if (match.startLineNumber === position.lineNumber) {
					// matched something on the same line => no change in indentation
					return null;
				}
				const matchLine = model.getLineContent(match.startLineNumber);
				const matchLineIndentation = strings.getLeadingWhitespace(matchLine);
				const newIndentation = config.normalizeIndentation(matchLineIndentation);
				const lineText = model.getLineContent(position.lineNumber);
				const lineFirstNonBlankColumn = model.getLineFirstNonWhitespaceColumn(position.lineNumber) || position.column;
				const prefix = lineText.substring(lineFirstNonBlankColumn - 1, position.column - 1);
				const typeText = newIndentation + prefix + ch;
				const typeSelection = new Range(position.lineNumber, 1, position.lineNumber, position.column);
				const command = new ReplaceCommand(typeSelection, typeText);
				return new EditOperationResult(getTypingOperation(typeText, prevEditOperationType), [command], {
					shouldPushStackElementBefore: false,
					shouldPushStackElementAfter: true
				});
			}
		}
		return null;
	}
}

export class SimpleCharacterTypeOperation {

	public static getEdits(config: CursorConfiguration, prevEditOperationType: EditOperationType, selections: Selection[], ch: string, isDoingComposition: boolean): EditOperationResult {
		// A simple character type
		const commands: ICommand[] = [];
		for (let i = 0, len = selections.length; i < len; i++) {
			const ChosenReplaceCommand = config.inputMode === 'overtype' && !isDoingComposition ? ReplaceOvertypeCommand : ReplaceCommand;
			commands[i] = new ChosenReplaceCommand(selections[i], ch);
		}

		const opType = getTypingOperation(ch, prevEditOperationType);
		return new EditOperationResult(opType, commands, {
			shouldPushStackElementBefore: shouldPushStackElementBetween(prevEditOperationType, opType),
			shouldPushStackElementAfter: false
		});
	}
}

export class EnterOperation {

	public static getEdits(config: CursorConfiguration, model: ITextModel, selections: Selection[], ch: string, isDoingComposition: boolean): EditOperationResult | undefined {
		if (!isDoingComposition && ch === '\n') {
			const commands: ICommand[] = [];
			for (let i = 0, len = selections.length; i < len; i++) {
				commands[i] = this._enter(config, model, false, selections[i]);
			}
			return new EditOperationResult(EditOperationType.TypingOther, commands, {
				shouldPushStackElementBefore: true,
				shouldPushStackElementAfter: false,
			});
		}
		return;
	}

	private static _enter(config: CursorConfiguration, model: ITextModel, keepPosition: boolean, range: Range): ICommand {
		if (config.autoIndent === EditorAutoIndentStrategy.None) {
			return typeCommand(range, '\n', keepPosition);
		}
		if (!model.tokenization.isCheapToTokenize(range.getStartPosition().lineNumber) || config.autoIndent === EditorAutoIndentStrategy.Keep) {
			const lineText = model.getLineContent(range.startLineNumber);
			const indentation = strings.getLeadingWhitespace(lineText).substring(0, range.startColumn - 1);
			return typeCommand(range, '\n' + config.normalizeIndentation(indentation), keepPosition);
		}
		const r = getEnterAction(config.autoIndent, model, range, config.languageConfigurationService);
		if (r) {
			if (r.indentAction === IndentAction.None) {
				// Nothing special
				return typeCommand(range, '\n' + config.normalizeIndentation(r.indentation + r.appendText), keepPosition);

			} else if (r.indentAction === IndentAction.Indent) {
				// Indent once
				return typeCommand(range, '\n' + config.normalizeIndentation(r.indentation + r.appendText), keepPosition);

			} else if (r.indentAction === IndentAction.IndentOutdent) {
				// Ultra special
				const normalIndent = config.normalizeIndentation(r.indentation);
				const increasedIndent = config.normalizeIndentation(r.indentation + r.appendText);
				const typeText = '\n' + increasedIndent + '\n' + normalIndent;
				if (keepPosition) {
					return new ReplaceCommandWithoutChangingPosition(range, typeText, true);
				} else {
					return new ReplaceCommandWithOffsetCursorState(range, typeText, -1, increasedIndent.length - normalIndent.length, true);
				}
			} else if (r.indentAction === IndentAction.Outdent) {
				const actualIndentation = unshiftIndent(config, r.indentation);
				return typeCommand(range, '\n' + config.normalizeIndentation(actualIndentation + r.appendText), keepPosition);
			}
		}

		const lineText = model.getLineContent(range.startLineNumber);
		const indentation = strings.getLeadingWhitespace(lineText).substring(0, range.startColumn - 1);

		if (config.autoIndent >= EditorAutoIndentStrategy.Full) {
			const ir = getIndentForEnter(config.autoIndent, model, range, {
				unshiftIndent: (indent) => {
					return unshiftIndent(config, indent);
				},
				shiftIndent: (indent) => {
					return shiftIndent(config, indent);
				},
				normalizeIndentation: (indent) => {
					return config.normalizeIndentation(indent);
				}
			}, config.languageConfigurationService);

			if (ir) {
				let oldEndViewColumn = config.visibleColumnFromColumn(model, range.getEndPosition());
				const oldEndColumn = range.endColumn;
				const newLineContent = model.getLineContent(range.endLineNumber);
				const firstNonWhitespace = strings.firstNonWhitespaceIndex(newLineContent);
				if (firstNonWhitespace >= 0) {
					range = range.setEndPosition(range.endLineNumber, Math.max(range.endColumn, firstNonWhitespace + 1));
				} else {
					range = range.setEndPosition(range.endLineNumber, model.getLineMaxColumn(range.endLineNumber));
				}
				if (keepPosition) {
					return new ReplaceCommandWithoutChangingPosition(range, '\n' + config.normalizeIndentation(ir.afterEnter), true);
				} else {
					let offset = 0;
					if (oldEndColumn <= firstNonWhitespace + 1) {
						if (!config.insertSpaces) {
							oldEndViewColumn = Math.ceil(oldEndViewColumn / config.indentSize);
						}
						offset = Math.min(oldEndViewColumn + 1 - config.normalizeIndentation(ir.afterEnter).length - 1, 0);
					}
					return new ReplaceCommandWithOffsetCursorState(range, '\n' + config.normalizeIndentation(ir.afterEnter), 0, offset, true);
				}
			}
		}
		return typeCommand(range, '\n' + config.normalizeIndentation(indentation), keepPosition);
	}


	public static lineInsertBefore(config: CursorConfiguration, model: ITextModel | null, selections: Selection[] | null): ICommand[] {
		if (model === null || selections === null) {
			return [];
		}
		const commands: ICommand[] = [];
		for (let i = 0, len = selections.length; i < len; i++) {
			let lineNumber = selections[i].positionLineNumber;
			if (lineNumber === 1) {
				commands[i] = new ReplaceCommandWithoutChangingPosition(new Range(1, 1, 1, 1), '\n');
			} else {
				lineNumber--;
				const column = model.getLineMaxColumn(lineNumber);

				commands[i] = this._enter(config, model, false, new Range(lineNumber, column, lineNumber, column));
			}
		}
		return commands;
	}

	public static lineInsertAfter(config: CursorConfiguration, model: ITextModel | null, selections: Selection[] | null): ICommand[] {
		if (model === null || selections === null) {
			return [];
		}
		const commands: ICommand[] = [];
		for (let i = 0, len = selections.length; i < len; i++) {
			const lineNumber = selections[i].positionLineNumber;
			const column = model.getLineMaxColumn(lineNumber);
			commands[i] = this._enter(config, model, false, new Range(lineNumber, column, lineNumber, column));
		}
		return commands;
	}

	public static lineBreakInsert(config: CursorConfiguration, model: ITextModel, selections: Selection[]): ICommand[] {
		const commands: ICommand[] = [];
		for (let i = 0, len = selections.length; i < len; i++) {
			commands[i] = this._enter(config, model, true, selections[i]);
		}
		return commands;
	}
}

export class PasteOperation {

	public static getEdits(config: CursorConfiguration, model: ICursorSimpleModel, selections: Selection[], text: string, pasteOnNewLine: boolean, multicursorText: string[]) {
		const distributedPaste = this._distributePasteToCursors(config, selections, text, pasteOnNewLine, multicursorText);
		if (distributedPaste) {
			selections = selections.sort(Range.compareRangesUsingStarts);
			return this._distributedPaste(config, model, selections, distributedPaste);
		} else {
			return this._simplePaste(config, model, selections, text, pasteOnNewLine);
		}
	}

	private static _distributePasteToCursors(config: CursorConfiguration, selections: Selection[], text: string, pasteOnNewLine: boolean, multicursorText: string[]): string[] | null {
		if (selections.length === 1) {
			return null;
		}
		if (multicursorText && multicursorText.length === selections.length) {
			return multicursorText;
		}
		if (pasteOnNewLine) {
			return null;
		}
		if (config.multiCursorPaste === 'spread') {
			// Try to spread the pasted text in case the line count matches the cursor count
			// Remove trailing \n if present
			if (text.charCodeAt(text.length - 1) === CharCode.LineFeed) {
				text = text.substring(0, text.length - 1);
			}
			// Remove trailing \r if present
			if (text.charCodeAt(text.length - 1) === CharCode.CarriageReturn) {
				text = text.substring(0, text.length - 1);
			}
			const lines = strings.splitLines(text);
			if (lines.length === selections.length) {
				return lines;
			}
		}
		return null;
	}

	private static _distributedPaste(config: CursorConfiguration, model: ICursorSimpleModel, selections: Selection[], text: string[]): EditOperationResult {
		const commands: ICommand[] = [];
		for (let i = 0, len = selections.length; i < len; i++) {
			const shouldOvertypeOnPaste = config.overtypeOnPaste && config.inputMode === 'overtype';
			const ChosenReplaceCommand = shouldOvertypeOnPaste ? ReplaceOvertypeCommand : ReplaceCommand;
			commands[i] = new ChosenReplaceCommand(selections[i], text[i]);
		}
		return new EditOperationResult(EditOperationType.Other, commands, {
			shouldPushStackElementBefore: true,
			shouldPushStackElementAfter: true
		});
	}

	private static _simplePaste(config: CursorConfiguration, model: ICursorSimpleModel, selections: Selection[], text: string, pasteOnNewLine: boolean): EditOperationResult {
		const commands: ICommand[] = [];
		for (let i = 0, len = selections.length; i < len; i++) {
			const selection = selections[i];
			const position = selection.getPosition();
			if (pasteOnNewLine && !selection.isEmpty()) {
				pasteOnNewLine = false;
			}
			if (pasteOnNewLine && text.indexOf('\n') !== text.length - 1) {
				pasteOnNewLine = false;
			}
			if (pasteOnNewLine) {
				// Paste entire line at the beginning of line
				const typeSelection = new Range(position.lineNumber, 1, position.lineNumber, 1);
				commands[i] = new ReplaceCommandThatPreservesSelection(typeSelection, text, selection, true);
			} else {
				const shouldOvertypeOnPaste = config.overtypeOnPaste && config.inputMode === 'overtype';
				const ChosenReplaceCommand = shouldOvertypeOnPaste ? ReplaceOvertypeCommand : ReplaceCommand;
				commands[i] = new ChosenReplaceCommand(selection, text);
			}
		}
		return new EditOperationResult(EditOperationType.Other, commands, {
			shouldPushStackElementBefore: true,
			shouldPushStackElementAfter: true
		});
	}
}

export class CompositionOperation {

	public static getEdits(prevEditOperationType: EditOperationType, config: CursorConfiguration, model: ITextModel, selections: Selection[], text: string, replacePrevCharCnt: number, replaceNextCharCnt: number, positionDelta: number) {
		const commands = selections.map(selection => this._compositionType(model, selection, text, replacePrevCharCnt, replaceNextCharCnt, positionDelta));
		return new EditOperationResult(EditOperationType.TypingOther, commands, {
			shouldPushStackElementBefore: shouldPushStackElementBetween(prevEditOperationType, EditOperationType.TypingOther),
			shouldPushStackElementAfter: false
		});
	}

	private static _compositionType(model: ITextModel, selection: Selection, text: string, replacePrevCharCnt: number, replaceNextCharCnt: number, positionDelta: number): ICommand | null {
		if (!selection.isEmpty()) {
			// looks like https://github.com/microsoft/vscode/issues/2773
			// where a cursor operation occurred before a canceled composition
			// => ignore composition
			return null;
		}
		const pos = selection.getPosition();
		const startColumn = Math.max(1, pos.column - replacePrevCharCnt);
		const endColumn = Math.min(model.getLineMaxColumn(pos.lineNumber), pos.column + replaceNextCharCnt);
		const range = new Range(pos.lineNumber, startColumn, pos.lineNumber, endColumn);
		return new ReplaceCommandWithOffsetCursorState(range, text, 0, positionDelta);
	}
}

export class TypeWithoutInterceptorsOperation {

	public static getEdits(prevEditOperationType: EditOperationType, selections: Selection[], str: string): EditOperationResult {
		const commands: ICommand[] = [];
		for (let i = 0, len = selections.length; i < len; i++) {
			commands[i] = new ReplaceCommand(selections[i], str);
		}
		const opType = getTypingOperation(str, prevEditOperationType);
		return new EditOperationResult(opType, commands, {
			shouldPushStackElementBefore: shouldPushStackElementBetween(prevEditOperationType, opType),
			shouldPushStackElementAfter: false
		});
	}
}

export class TabOperation {

	public static getCommands(config: CursorConfiguration, model: ITextModel, selections: Selection[]) {
		const commands: ICommand[] = [];
		for (let i = 0, len = selections.length; i < len; i++) {
			const selection = selections[i];
			if (selection.isEmpty()) {
				const lineText = model.getLineContent(selection.startLineNumber);
				if (/^\s*$/.test(lineText) && model.tokenization.isCheapToTokenize(selection.startLineNumber)) {
					let goodIndent = this._goodIndentForLine(config, model, selection.startLineNumber);
					goodIndent = goodIndent || '\t';
					const possibleTypeText = config.normalizeIndentation(goodIndent);
					if (!lineText.startsWith(possibleTypeText)) {
						commands[i] = new ReplaceCommand(new Range(selection.startLineNumber, 1, selection.startLineNumber, lineText.length + 1), possibleTypeText, true);
						continue;
					}
				}
				commands[i] = this._replaceJumpToNextIndent(config, model, selection, true);
			} else {
				if (selection.startLineNumber === selection.endLineNumber) {
					const lineMaxColumn = model.getLineMaxColumn(selection.startLineNumber);
					if (selection.startColumn !== 1 || selection.endColumn !== lineMaxColumn) {
						// This is a single line selection that is not the entire line
						commands[i] = this._replaceJumpToNextIndent(config, model, selection, false);
						continue;
					}
				}
				commands[i] = new ShiftCommand(selection, {
					isUnshift: false,
					tabSize: config.tabSize,
					indentSize: config.indentSize,
					insertSpaces: config.insertSpaces,
					useTabStops: config.useTabStops,
					autoIndent: config.autoIndent
				}, config.languageConfigurationService);
			}
		}
		return commands;
	}

	private static _goodIndentForLine(config: CursorConfiguration, model: ITextModel, lineNumber: number): string | null {
		let action: IndentAction | EnterAction | null = null;
		let indentation: string = '';
		const expectedIndentAction = getInheritIndentForLine(config.autoIndent, model, lineNumber, false, config.languageConfigurationService);
		if (expectedIndentAction) {
			action = expectedIndentAction.action;
			indentation = expectedIndentAction.indentation;
		} else if (lineNumber > 1) {
			let lastLineNumber: number;
			for (lastLineNumber = lineNumber - 1; lastLineNumber >= 1; lastLineNumber--) {
				const lineText = model.getLineContent(lastLineNumber);
				const nonWhitespaceIdx = strings.lastNonWhitespaceIndex(lineText);
				if (nonWhitespaceIdx >= 0) {
					break;
				}
			}
			if (lastLineNumber < 1) {
				// No previous line with content found
				return null;
			}
			const maxColumn = model.getLineMaxColumn(lastLineNumber);
			const expectedEnterAction = getEnterAction(config.autoIndent, model, new Range(lastLineNumber, maxColumn, lastLineNumber, maxColumn), config.languageConfigurationService);
			if (expectedEnterAction) {
				indentation = expectedEnterAction.indentation + expectedEnterAction.appendText;
			}
		}
		if (action) {
			if (action === IndentAction.Indent) {
				indentation = shiftIndent(config, indentation);
			}
			if (action === IndentAction.Outdent) {
				indentation = unshiftIndent(config, indentation);
			}
			indentation = config.normalizeIndentation(indentation);
		}
		if (!indentation) {
			return null;
		}
		return indentation;
	}

	private static _replaceJumpToNextIndent(config: CursorConfiguration, model: ICursorSimpleModel, selection: Selection, insertsAutoWhitespace: boolean): ReplaceCommand {
		let typeText = '';
		const position = selection.getStartPosition();
		if (config.insertSpaces) {
			const visibleColumnFromColumn = config.visibleColumnFromColumn(model, position);
			const indentSize = config.indentSize;
			const spacesCnt = indentSize - (visibleColumnFromColumn % indentSize);
			for (let i = 0; i < spacesCnt; i++) {
				typeText += ' ';
			}
		} else {
			typeText = '\t';
		}
		return new ReplaceCommand(selection, typeText, insertsAutoWhitespace);
	}
}

export class BaseTypeWithAutoClosingCommand extends ReplaceCommandWithOffsetCursorState {

	private readonly _openCharacter: string;
	private readonly _closeCharacter: string;
	public closeCharacterRange: Range | null;
	public enclosingRange: Range | null;

	constructor(selection: Selection, text: string, lineNumberDeltaOffset: number, columnDeltaOffset: number, openCharacter: string, closeCharacter: string) {
		super(selection, text, lineNumberDeltaOffset, columnDeltaOffset);
		this._openCharacter = openCharacter;
		this._closeCharacter = closeCharacter;
		this.closeCharacterRange = null;
		this.enclosingRange = null;
	}

	protected _computeCursorStateWithRange(model: ITextModel, range: Range, helper: ICursorStateComputerData): Selection {
		this.closeCharacterRange = new Range(range.startLineNumber, range.endColumn - this._closeCharacter.length, range.endLineNumber, range.endColumn);
		this.enclosingRange = new Range(range.startLineNumber, range.endColumn - this._openCharacter.length - this._closeCharacter.length, range.endLineNumber, range.endColumn);
		return super.computeCursorState(model, helper);
	}
}

class TypeWithAutoClosingCommand extends BaseTypeWithAutoClosingCommand {

	constructor(selection: Selection, openCharacter: string, insertOpenCharacter: boolean, closeCharacter: string) {
		const text = (insertOpenCharacter ? openCharacter : '') + closeCharacter;
		const lineNumberDeltaOffset = 0;
		const columnDeltaOffset = -closeCharacter.length;
		super(selection, text, lineNumberDeltaOffset, columnDeltaOffset, openCharacter, closeCharacter);
	}

	public override computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		const inverseEditOperations = helper.getInverseEditOperations();
		const range = inverseEditOperations[0].range;
		return this._computeCursorStateWithRange(model, range, helper);
	}
}

class TypeWithIndentationAndAutoClosingCommand extends BaseTypeWithAutoClosingCommand {

	private readonly _autoIndentationEdit: { range: Range; text: string };
	private readonly _autoClosingEdit: { range: Range; text: string };

	constructor(autoIndentationEdit: { range: Range; text: string }, selection: Selection, openCharacter: string, closeCharacter: string) {
		const text = openCharacter + closeCharacter;
		const lineNumberDeltaOffset = 0;
		const columnDeltaOffset = openCharacter.length;
		super(selection, text, lineNumberDeltaOffset, columnDeltaOffset, openCharacter, closeCharacter);
		this._autoIndentationEdit = autoIndentationEdit;
		this._autoClosingEdit = { range: selection, text };
	}

	public override getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		builder.addTrackedEditOperation(this._autoIndentationEdit.range, this._autoIndentationEdit.text);
		builder.addTrackedEditOperation(this._autoClosingEdit.range, this._autoClosingEdit.text);
	}

	public override computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		const inverseEditOperations = helper.getInverseEditOperations();
		if (inverseEditOperations.length !== 2) {
			throw new Error('There should be two inverse edit operations!');
		}
		const range1 = inverseEditOperations[0].range;
		const range2 = inverseEditOperations[1].range;
		const range = range1.plusRange(range2);
		return this._computeCursorStateWithRange(model, range, helper);
	}
}

function getTypingOperation(typedText: string, previousTypingOperation: EditOperationType): EditOperationType {
	if (typedText === ' ') {
		return previousTypingOperation === EditOperationType.TypingFirstSpace
			|| previousTypingOperation === EditOperationType.TypingConsecutiveSpace
			? EditOperationType.TypingConsecutiveSpace
			: EditOperationType.TypingFirstSpace;
	}

	return EditOperationType.TypingOther;
}

function shouldPushStackElementBetween(previousTypingOperation: EditOperationType, typingOperation: EditOperationType): boolean {
	if (isTypingOperation(previousTypingOperation) && !isTypingOperation(typingOperation)) {
		// Always set an undo stop before non-type operations
		return true;
	}
	if (previousTypingOperation === EditOperationType.TypingFirstSpace) {
		// `abc |d`: No undo stop
		// `abc  |d`: Undo stop
		return false;
	}
	// Insert undo stop between different operation types
	return normalizeOperationType(previousTypingOperation) !== normalizeOperationType(typingOperation);
}

function normalizeOperationType(type: EditOperationType): EditOperationType | 'space' {
	return (type === EditOperationType.TypingConsecutiveSpace || type === EditOperationType.TypingFirstSpace)
		? 'space'
		: type;
}

function isTypingOperation(type: EditOperationType): boolean {
	return type === EditOperationType.TypingOther
		|| type === EditOperationType.TypingFirstSpace
		|| type === EditOperationType.TypingConsecutiveSpace;
}

function isAutoClosingOvertype(config: CursorConfiguration, model: ITextModel, selections: Selection[], autoClosedCharacters: Range[], ch: string): boolean {
	if (config.autoClosingOvertype === 'never') {
		return false;
	}
	if (!config.autoClosingPairs.autoClosingPairsCloseSingleChar.has(ch)) {
		return false;
	}
	for (let i = 0, len = selections.length; i < len; i++) {
		const selection = selections[i];
		if (!selection.isEmpty()) {
			return false;
		}
		const position = selection.getPosition();
		const lineText = model.getLineContent(position.lineNumber);
		const afterCharacter = lineText.charAt(position.column - 1);
		if (afterCharacter !== ch) {
			return false;
		}
		// Do not over-type quotes after a backslash
		const chIsQuote = isQuote(ch);
		const beforeCharacter = position.column > 2 ? lineText.charCodeAt(position.column - 2) : CharCode.Null;
		if (beforeCharacter === CharCode.Backslash && chIsQuote) {
			return false;
		}
		// Must over-type a closing character typed by the editor
		if (config.autoClosingOvertype === 'auto') {
			let found = false;
			for (let j = 0, lenJ = autoClosedCharacters.length; j < lenJ; j++) {
				const autoClosedCharacter = autoClosedCharacters[j];
				if (position.lineNumber === autoClosedCharacter.startLineNumber && position.column === autoClosedCharacter.startColumn) {
					found = true;
					break;
				}
			}
			if (!found) {
				return false;
			}
		}
	}
	return true;
}

function typeCommand(range: Range, text: string, keepPosition: boolean): ICommand {
	if (keepPosition) {
		return new ReplaceCommandWithoutChangingPosition(range, text, true);
	} else {
		return new ReplaceCommand(range, text, true);
	}
}

export function shiftIndent(config: CursorConfiguration, indentation: string, count?: number): string {
	count = count || 1;
	return ShiftCommand.shiftIndent(indentation, indentation.length + count, config.tabSize, config.indentSize, config.insertSpaces);
}

export function unshiftIndent(config: CursorConfiguration, indentation: string, count?: number): string {
	count = count || 1;
	return ShiftCommand.unshiftIndent(indentation, indentation.length + count, config.tabSize, config.indentSize, config.insertSpaces);
}

export function shouldSurroundChar(config: CursorConfiguration, ch: string): boolean {
	if (isQuote(ch)) {
		return (config.autoSurround === 'quotes' || config.autoSurround === 'languageDefined');
	} else {
		// Character is a bracket
		return (config.autoSurround === 'brackets' || config.autoSurround === 'languageDefined');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/cursor/cursorTypeOperations.ts]---
Location: vscode-main/src/vs/editor/common/cursor/cursorTypeOperations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ShiftCommand } from '../commands/shiftCommand.js';
import { CompositionSurroundSelectionCommand } from '../commands/surroundSelectionCommand.js';
import { CursorConfiguration, EditOperationResult, EditOperationType, ICursorSimpleModel, isQuote } from '../cursorCommon.js';
import { Range } from '../core/range.js';
import { Selection } from '../core/selection.js';
import { Position } from '../core/position.js';
import { ICommand } from '../editorCommon.js';
import { ITextModel } from '../model.js';
import { AutoClosingOpenCharTypeOperation, AutoClosingOvertypeOperation, AutoClosingOvertypeWithInterceptorsOperation, AutoIndentOperation, CompositionOperation, CompositionEndOvertypeOperation, EnterOperation, InterceptorElectricCharOperation, PasteOperation, shiftIndent, shouldSurroundChar, SimpleCharacterTypeOperation, SurroundSelectionOperation, TabOperation, TypeWithoutInterceptorsOperation, unshiftIndent } from './cursorTypeEditOperations.js';

export class TypeOperations {

	public static indent(config: CursorConfiguration, model: ICursorSimpleModel | null, selections: Selection[] | null): ICommand[] {
		if (model === null || selections === null) {
			return [];
		}

		const commands: ICommand[] = [];
		for (let i = 0, len = selections.length; i < len; i++) {
			commands[i] = new ShiftCommand(selections[i], {
				isUnshift: false,
				tabSize: config.tabSize,
				indentSize: config.indentSize,
				insertSpaces: config.insertSpaces,
				useTabStops: config.useTabStops,
				autoIndent: config.autoIndent
			}, config.languageConfigurationService);
		}
		return commands;
	}

	public static outdent(config: CursorConfiguration, model: ICursorSimpleModel, selections: Selection[]): ICommand[] {
		const commands: ICommand[] = [];
		for (let i = 0, len = selections.length; i < len; i++) {
			commands[i] = new ShiftCommand(selections[i], {
				isUnshift: true,
				tabSize: config.tabSize,
				indentSize: config.indentSize,
				insertSpaces: config.insertSpaces,
				useTabStops: config.useTabStops,
				autoIndent: config.autoIndent
			}, config.languageConfigurationService);
		}
		return commands;
	}

	public static shiftIndent(config: CursorConfiguration, indentation: string, count?: number): string {
		return shiftIndent(config, indentation, count);
	}

	public static unshiftIndent(config: CursorConfiguration, indentation: string, count?: number): string {
		return unshiftIndent(config, indentation, count);
	}

	public static paste(config: CursorConfiguration, model: ICursorSimpleModel, selections: Selection[], text: string, pasteOnNewLine: boolean, multicursorText: string[]): EditOperationResult {
		return PasteOperation.getEdits(config, model, selections, text, pasteOnNewLine, multicursorText);
	}

	public static tab(config: CursorConfiguration, model: ITextModel, selections: Selection[]): ICommand[] {
		return TabOperation.getCommands(config, model, selections);
	}

	public static compositionType(prevEditOperationType: EditOperationType, config: CursorConfiguration, model: ITextModel, selections: Selection[], text: string, replacePrevCharCnt: number, replaceNextCharCnt: number, positionDelta: number): EditOperationResult {
		return CompositionOperation.getEdits(prevEditOperationType, config, model, selections, text, replacePrevCharCnt, replaceNextCharCnt, positionDelta);
	}

	/**
	 * This is very similar with typing, but the character is already in the text buffer!
	 */
	public static compositionEndWithInterceptors(prevEditOperationType: EditOperationType, config: CursorConfiguration, model: ITextModel, compositions: CompositionOutcome[] | null, selections: Selection[], autoClosedCharacters: Range[]): EditOperationResult | null {
		if (!compositions) {
			// could not deduce what the composition did
			return null;
		}

		let insertedText: string | null = null;
		for (const composition of compositions) {
			if (insertedText === null) {
				insertedText = composition.insertedText;
			} else if (insertedText !== composition.insertedText) {
				// not all selections agree on what was typed
				return null;
			}
		}

		if (!insertedText || insertedText.length !== 1) {
			// we're only interested in the case where a single character was inserted
			return CompositionEndOvertypeOperation.getEdits(config, compositions);
		}

		const ch = insertedText;

		let hasDeletion = false;
		for (const composition of compositions) {
			if (composition.deletedText.length !== 0) {
				hasDeletion = true;
				break;
			}
		}

		if (hasDeletion) {
			// Check if this could have been a surround selection

			if (!shouldSurroundChar(config, ch) || !config.surroundingPairs.hasOwnProperty(ch)) {
				return null;
			}

			const isTypingAQuoteCharacter = isQuote(ch);

			for (const composition of compositions) {
				if (composition.deletedSelectionStart !== 0 || composition.deletedSelectionEnd !== composition.deletedText.length) {
					// more text was deleted than was selected, so this could not have been a surround selection
					return null;
				}
				if (/^[ \t]+$/.test(composition.deletedText)) {
					// deleted text was only whitespace
					return null;
				}
				if (isTypingAQuoteCharacter && isQuote(composition.deletedText)) {
					// deleted text was a quote
					return null;
				}
			}

			const positions: Position[] = [];
			for (const selection of selections) {
				if (!selection.isEmpty()) {
					return null;
				}
				positions.push(selection.getPosition());
			}

			if (positions.length !== compositions.length) {
				return null;
			}

			const commands: ICommand[] = [];
			for (let i = 0, len = positions.length; i < len; i++) {
				commands.push(new CompositionSurroundSelectionCommand(positions[i], compositions[i].deletedText, config.surroundingPairs[ch]));
			}
			return new EditOperationResult(EditOperationType.TypingOther, commands, {
				shouldPushStackElementBefore: true,
				shouldPushStackElementAfter: false
			});
		}

		const autoClosingOvertypeEdits = AutoClosingOvertypeWithInterceptorsOperation.getEdits(config, model, selections, autoClosedCharacters, ch);
		if (autoClosingOvertypeEdits !== undefined) {
			return autoClosingOvertypeEdits;
		}

		const autoClosingOpenCharEdits = AutoClosingOpenCharTypeOperation.getEdits(config, model, selections, ch, true, false);
		if (autoClosingOpenCharEdits !== undefined) {
			return autoClosingOpenCharEdits;
		}

		return CompositionEndOvertypeOperation.getEdits(config, compositions);
	}

	public static typeWithInterceptors(isDoingComposition: boolean, prevEditOperationType: EditOperationType, config: CursorConfiguration, model: ITextModel, selections: Selection[], autoClosedCharacters: Range[], ch: string): EditOperationResult {

		const enterEdits = EnterOperation.getEdits(config, model, selections, ch, isDoingComposition);
		if (enterEdits !== undefined) {
			return enterEdits;
		}

		const autoIndentEdits = AutoIndentOperation.getEdits(config, model, selections, ch, isDoingComposition);
		if (autoIndentEdits !== undefined) {
			return autoIndentEdits;
		}

		const autoClosingOverTypeEdits = AutoClosingOvertypeOperation.getEdits(prevEditOperationType, config, model, selections, autoClosedCharacters, ch);
		if (autoClosingOverTypeEdits !== undefined) {
			return autoClosingOverTypeEdits;
		}

		const autoClosingOpenCharEdits = AutoClosingOpenCharTypeOperation.getEdits(config, model, selections, ch, false, isDoingComposition);
		if (autoClosingOpenCharEdits !== undefined) {
			return autoClosingOpenCharEdits;
		}

		const surroundSelectionEdits = SurroundSelectionOperation.getEdits(config, model, selections, ch, isDoingComposition);
		if (surroundSelectionEdits !== undefined) {
			return surroundSelectionEdits;
		}

		const interceptorElectricCharOperation = InterceptorElectricCharOperation.getEdits(prevEditOperationType, config, model, selections, ch, isDoingComposition);
		if (interceptorElectricCharOperation !== undefined) {
			return interceptorElectricCharOperation;
		}

		return SimpleCharacterTypeOperation.getEdits(config, prevEditOperationType, selections, ch, isDoingComposition);
	}

	public static typeWithoutInterceptors(prevEditOperationType: EditOperationType, config: CursorConfiguration, model: ITextModel, selections: Selection[], str: string): EditOperationResult {
		return TypeWithoutInterceptorsOperation.getEdits(prevEditOperationType, selections, str);
	}
}

export class CompositionOutcome {
	constructor(
		public readonly deletedText: string,
		public readonly deletedSelectionStart: number,
		public readonly deletedSelectionEnd: number,
		public readonly insertedText: string,
		public readonly insertedSelectionStart: number,
		public readonly insertedSelectionEnd: number,
		public readonly insertedTextRange: Range,
	) { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/cursor/cursorWordOperations.ts]---
Location: vscode-main/src/vs/editor/common/cursor/cursorWordOperations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';
import * as strings from '../../../base/common/strings.js';
import { EditorAutoClosingEditStrategy, EditorAutoClosingStrategy } from '../config/editorOptions.js';
import { CursorConfiguration, ICursorSimpleModel, SelectionStartKind, SingleCursorState } from '../cursorCommon.js';
import { DeleteOperations } from './cursorDeleteOperations.js';
import { WordCharacterClass, WordCharacterClassifier, IntlWordSegmentData, getMapForWordSeparators } from '../core/wordCharacterClassifier.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { Selection } from '../core/selection.js';
import { ITextModel } from '../model.js';
import { IWordAtPosition } from '../core/wordHelper.js';
import { AutoClosingPairs } from '../languages/languageConfiguration.js';

interface IFindWordResult {
	/**
	 * The index where the word starts.
	 */
	start: number;
	/**
	 * The index where the word ends.
	 */
	end: number;
	/**
	 * The word type.
	 */
	wordType: WordType;
	/**
	 * The reason the word ended.
	 */
	nextCharClass: WordCharacterClass;
}

const enum WordType {
	None = 0,
	Regular = 1,
	Separator = 2
}

export const enum WordNavigationType {
	WordStart = 0,
	WordStartFast = 1,
	WordEnd = 2,
	WordAccessibility = 3 // Respect chrome definition of a word
}

export interface DeleteWordContext {
	wordSeparators: WordCharacterClassifier;
	model: ITextModel;
	selection: Selection;
	whitespaceHeuristics: boolean;
	autoClosingDelete: EditorAutoClosingEditStrategy;
	autoClosingBrackets: EditorAutoClosingStrategy;
	autoClosingQuotes: EditorAutoClosingStrategy;
	autoClosingPairs: AutoClosingPairs;
	autoClosedCharacters: Range[];
}

export class WordOperations {

	private static _createWord(lineContent: string, wordType: WordType, nextCharClass: WordCharacterClass, start: number, end: number): IFindWordResult {
		// console.log('WORD ==> ' + start + ' => ' + end + ':::: <<<' + lineContent.substring(start, end) + '>>>');
		return { start: start, end: end, wordType: wordType, nextCharClass: nextCharClass };
	}

	private static _createIntlWord(intlWord: IntlWordSegmentData, nextCharClass: WordCharacterClass): IFindWordResult {
		// console.log('INTL WORD ==> ' + intlWord.index + ' => ' + intlWord.index + intlWord.segment.length + ':::: <<<' + intlWord.segment + '>>>');
		return { start: intlWord.index, end: intlWord.index + intlWord.segment.length, wordType: WordType.Regular, nextCharClass: nextCharClass };
	}

	private static _findPreviousWordOnLine(wordSeparators: WordCharacterClassifier, model: ICursorSimpleModel, position: Position): IFindWordResult | null {
		const lineContent = model.getLineContent(position.lineNumber);
		return this._doFindPreviousWordOnLine(lineContent, wordSeparators, position);
	}

	private static _doFindPreviousWordOnLine(lineContent: string, wordSeparators: WordCharacterClassifier, position: Position): IFindWordResult | null {
		let wordType = WordType.None;

		const previousIntlWord = wordSeparators.findPrevIntlWordBeforeOrAtOffset(lineContent, position.column - 2);

		for (let chIndex = position.column - 2; chIndex >= 0; chIndex--) {
			const chCode = lineContent.charCodeAt(chIndex);
			const chClass = wordSeparators.get(chCode);

			if (previousIntlWord && chIndex === previousIntlWord.index) {
				return this._createIntlWord(previousIntlWord, chClass);
			}

			if (chClass === WordCharacterClass.Regular) {
				if (wordType === WordType.Separator) {
					return this._createWord(lineContent, wordType, chClass, chIndex + 1, this._findEndOfWord(lineContent, wordSeparators, wordType, chIndex + 1));
				}
				wordType = WordType.Regular;
			} else if (chClass === WordCharacterClass.WordSeparator) {
				if (wordType === WordType.Regular) {
					return this._createWord(lineContent, wordType, chClass, chIndex + 1, this._findEndOfWord(lineContent, wordSeparators, wordType, chIndex + 1));
				}
				wordType = WordType.Separator;
			} else if (chClass === WordCharacterClass.Whitespace) {
				if (wordType !== WordType.None) {
					return this._createWord(lineContent, wordType, chClass, chIndex + 1, this._findEndOfWord(lineContent, wordSeparators, wordType, chIndex + 1));
				}
			}
		}

		if (wordType !== WordType.None) {
			return this._createWord(lineContent, wordType, WordCharacterClass.Whitespace, 0, this._findEndOfWord(lineContent, wordSeparators, wordType, 0));
		}

		return null;
	}

	private static _findEndOfWord(lineContent: string, wordSeparators: WordCharacterClassifier, wordType: WordType, startIndex: number): number {

		const nextIntlWord = wordSeparators.findNextIntlWordAtOrAfterOffset(lineContent, startIndex);

		const len = lineContent.length;
		for (let chIndex = startIndex; chIndex < len; chIndex++) {
			const chCode = lineContent.charCodeAt(chIndex);
			const chClass = wordSeparators.get(chCode);

			if (nextIntlWord && chIndex === nextIntlWord.index + nextIntlWord.segment.length) {
				return chIndex;
			}

			if (chClass === WordCharacterClass.Whitespace) {
				return chIndex;
			}
			if (wordType === WordType.Regular && chClass === WordCharacterClass.WordSeparator) {
				return chIndex;
			}
			if (wordType === WordType.Separator && chClass === WordCharacterClass.Regular) {
				return chIndex;
			}
		}
		return len;
	}

	private static _findNextWordOnLine(wordSeparators: WordCharacterClassifier, model: ICursorSimpleModel, position: Position): IFindWordResult | null {
		const lineContent = model.getLineContent(position.lineNumber);
		return this._doFindNextWordOnLine(lineContent, wordSeparators, position);
	}

	private static _doFindNextWordOnLine(lineContent: string, wordSeparators: WordCharacterClassifier, position: Position): IFindWordResult | null {
		let wordType = WordType.None;
		const len = lineContent.length;

		const nextIntlWord = wordSeparators.findNextIntlWordAtOrAfterOffset(lineContent, position.column - 1);

		for (let chIndex = position.column - 1; chIndex < len; chIndex++) {
			const chCode = lineContent.charCodeAt(chIndex);
			const chClass = wordSeparators.get(chCode);

			if (nextIntlWord && chIndex === nextIntlWord.index) {
				return this._createIntlWord(nextIntlWord, chClass);
			}

			if (chClass === WordCharacterClass.Regular) {
				if (wordType === WordType.Separator) {
					return this._createWord(lineContent, wordType, chClass, this._findStartOfWord(lineContent, wordSeparators, wordType, chIndex - 1), chIndex);
				}
				wordType = WordType.Regular;
			} else if (chClass === WordCharacterClass.WordSeparator) {
				if (wordType === WordType.Regular) {
					return this._createWord(lineContent, wordType, chClass, this._findStartOfWord(lineContent, wordSeparators, wordType, chIndex - 1), chIndex);
				}
				wordType = WordType.Separator;
			} else if (chClass === WordCharacterClass.Whitespace) {
				if (wordType !== WordType.None) {
					return this._createWord(lineContent, wordType, chClass, this._findStartOfWord(lineContent, wordSeparators, wordType, chIndex - 1), chIndex);
				}
			}
		}

		if (wordType !== WordType.None) {
			return this._createWord(lineContent, wordType, WordCharacterClass.Whitespace, this._findStartOfWord(lineContent, wordSeparators, wordType, len - 1), len);
		}

		return null;
	}

	private static _findStartOfWord(lineContent: string, wordSeparators: WordCharacterClassifier, wordType: WordType, startIndex: number): number {

		const previousIntlWord = wordSeparators.findPrevIntlWordBeforeOrAtOffset(lineContent, startIndex);

		for (let chIndex = startIndex; chIndex >= 0; chIndex--) {
			const chCode = lineContent.charCodeAt(chIndex);
			const chClass = wordSeparators.get(chCode);

			if (previousIntlWord && chIndex === previousIntlWord.index) {
				return chIndex;
			}

			if (chClass === WordCharacterClass.Whitespace) {
				return chIndex + 1;
			}
			if (wordType === WordType.Regular && chClass === WordCharacterClass.WordSeparator) {
				return chIndex + 1;
			}
			if (wordType === WordType.Separator && chClass === WordCharacterClass.Regular) {
				return chIndex + 1;
			}
		}
		return 0;
	}

	public static moveWordLeft(wordSeparators: WordCharacterClassifier, model: ICursorSimpleModel, position: Position, wordNavigationType: WordNavigationType, hasMulticursor: boolean): Position {
		let lineNumber = position.lineNumber;
		let column = position.column;

		if (column === 1) {
			if (lineNumber > 1) {
				lineNumber = lineNumber - 1;
				column = model.getLineMaxColumn(lineNumber);
			}
		}

		let prevWordOnLine = WordOperations._findPreviousWordOnLine(wordSeparators, model, new Position(lineNumber, column));

		if (wordNavigationType === WordNavigationType.WordStart) {
			return new Position(lineNumber, prevWordOnLine ? prevWordOnLine.start + 1 : 1);
		}

		if (wordNavigationType === WordNavigationType.WordStartFast) {
			if (
				!hasMulticursor // avoid having multiple cursors stop at different locations when doing word start
				&& prevWordOnLine
				&& prevWordOnLine.wordType === WordType.Separator
				&& prevWordOnLine.end - prevWordOnLine.start === 1
				&& prevWordOnLine.nextCharClass === WordCharacterClass.Regular
			) {
				// Skip over a word made up of one single separator and followed by a regular character
				prevWordOnLine = WordOperations._findPreviousWordOnLine(wordSeparators, model, new Position(lineNumber, prevWordOnLine.start + 1));
			}

			return new Position(lineNumber, prevWordOnLine ? prevWordOnLine.start + 1 : 1);
		}

		if (wordNavigationType === WordNavigationType.WordAccessibility) {
			while (
				prevWordOnLine
				&& prevWordOnLine.wordType === WordType.Separator
			) {
				// Skip over words made up of only separators
				prevWordOnLine = WordOperations._findPreviousWordOnLine(wordSeparators, model, new Position(lineNumber, prevWordOnLine.start + 1));
			}

			return new Position(lineNumber, prevWordOnLine ? prevWordOnLine.start + 1 : 1);
		}

		// We are stopping at the ending of words

		if (prevWordOnLine && column <= prevWordOnLine.end + 1) {
			prevWordOnLine = WordOperations._findPreviousWordOnLine(wordSeparators, model, new Position(lineNumber, prevWordOnLine.start + 1));
		}

		return new Position(lineNumber, prevWordOnLine ? prevWordOnLine.end + 1 : 1);
	}

	public static _moveWordPartLeft(model: ICursorSimpleModel, position: Position): Position {
		const lineNumber = position.lineNumber;
		const maxColumn = model.getLineMaxColumn(lineNumber);

		if (position.column === 1) {
			return (lineNumber > 1 ? new Position(lineNumber - 1, model.getLineMaxColumn(lineNumber - 1)) : position);
		}

		const lineContent = model.getLineContent(lineNumber);
		for (let column = position.column - 1; column > 1; column--) {
			const left = lineContent.charCodeAt(column - 2);
			const right = lineContent.charCodeAt(column - 1);

			if (left === CharCode.Underline && right !== CharCode.Underline) {
				// snake_case_variables
				return new Position(lineNumber, column);
			}

			if (left === CharCode.Dash && right !== CharCode.Dash) {
				// kebab-case-variables
				return new Position(lineNumber, column);
			}

			if ((strings.isLowerAsciiLetter(left) || strings.isAsciiDigit(left)) && strings.isUpperAsciiLetter(right)) {
				// camelCaseVariables
				return new Position(lineNumber, column);
			}

			if (strings.isUpperAsciiLetter(left) && strings.isUpperAsciiLetter(right)) {
				// thisIsACamelCaseWithOneLetterWords
				if (column + 1 < maxColumn) {
					const rightRight = lineContent.charCodeAt(column);
					if (strings.isLowerAsciiLetter(rightRight) || strings.isAsciiDigit(rightRight)) {
						return new Position(lineNumber, column);
					}
				}
			}
		}

		return new Position(lineNumber, 1);
	}

	public static moveWordRight(wordSeparators: WordCharacterClassifier, model: ICursorSimpleModel, position: Position, wordNavigationType: WordNavigationType): Position {
		let lineNumber = position.lineNumber;
		let column = position.column;

		let movedDown = false;
		if (column === model.getLineMaxColumn(lineNumber)) {
			if (lineNumber < model.getLineCount()) {
				movedDown = true;
				lineNumber = lineNumber + 1;
				column = 1;
			}
		}

		let nextWordOnLine = WordOperations._findNextWordOnLine(wordSeparators, model, new Position(lineNumber, column));

		if (wordNavigationType === WordNavigationType.WordEnd) {
			if (nextWordOnLine && nextWordOnLine.wordType === WordType.Separator) {
				if (nextWordOnLine.end - nextWordOnLine.start === 1 && nextWordOnLine.nextCharClass === WordCharacterClass.Regular) {
					// Skip over a word made up of one single separator and followed by a regular character
					nextWordOnLine = WordOperations._findNextWordOnLine(wordSeparators, model, new Position(lineNumber, nextWordOnLine.end + 1));
				}
			}
			if (nextWordOnLine) {
				column = nextWordOnLine.end + 1;
			} else {
				column = model.getLineMaxColumn(lineNumber);
			}
		} else if (wordNavigationType === WordNavigationType.WordAccessibility) {
			if (movedDown) {
				// If we move to the next line, pretend that the cursor is right before the first character.
				// This is needed when the first word starts right at the first character - and in order not to miss it,
				// we need to start before.
				column = 0;
			}

			while (
				nextWordOnLine
				&& (nextWordOnLine.wordType === WordType.Separator
					|| nextWordOnLine.start + 1 <= column
				)
			) {
				// Skip over a word made up of one single separator
				// Also skip over word if it begins before current cursor position to ascertain we're moving forward at least 1 character.
				nextWordOnLine = WordOperations._findNextWordOnLine(wordSeparators, model, new Position(lineNumber, nextWordOnLine.end + 1));
			}

			if (nextWordOnLine) {
				column = nextWordOnLine.start + 1;
			} else {
				column = model.getLineMaxColumn(lineNumber);
			}
		} else {
			if (nextWordOnLine && !movedDown && column >= nextWordOnLine.start + 1) {
				nextWordOnLine = WordOperations._findNextWordOnLine(wordSeparators, model, new Position(lineNumber, nextWordOnLine.end + 1));
			}
			if (nextWordOnLine) {
				column = nextWordOnLine.start + 1;
			} else {
				column = model.getLineMaxColumn(lineNumber);
			}
		}

		return new Position(lineNumber, column);
	}

	public static _moveWordPartRight(model: ICursorSimpleModel, position: Position): Position {
		const lineNumber = position.lineNumber;
		const maxColumn = model.getLineMaxColumn(lineNumber);

		if (position.column === maxColumn) {
			return (lineNumber < model.getLineCount() ? new Position(lineNumber + 1, 1) : position);
		}

		const lineContent = model.getLineContent(lineNumber);
		for (let column = position.column + 1; column < maxColumn; column++) {
			const left = lineContent.charCodeAt(column - 2);
			const right = lineContent.charCodeAt(column - 1);

			if (left !== CharCode.Underline && right === CharCode.Underline) {
				// snake_case_variables
				return new Position(lineNumber, column);
			}

			if (left !== CharCode.Dash && right === CharCode.Dash) {
				// kebab-case-variables
				return new Position(lineNumber, column);
			}

			if ((strings.isLowerAsciiLetter(left) || strings.isAsciiDigit(left)) && strings.isUpperAsciiLetter(right)) {
				// camelCaseVariables
				return new Position(lineNumber, column);
			}

			if (strings.isUpperAsciiLetter(left) && strings.isUpperAsciiLetter(right)) {
				// thisIsACamelCaseWithOneLetterWords
				if (column + 1 < maxColumn) {
					const rightRight = lineContent.charCodeAt(column);
					if (strings.isLowerAsciiLetter(rightRight) || strings.isAsciiDigit(rightRight)) {
						return new Position(lineNumber, column);
					}
				}
			}
		}

		return new Position(lineNumber, maxColumn);
	}

	protected static _deleteWordLeftWhitespace(model: ICursorSimpleModel, position: Position): Range | null {
		const lineContent = model.getLineContent(position.lineNumber);
		const startIndex = position.column - 2;
		const lastNonWhitespace = strings.lastNonWhitespaceIndex(lineContent, startIndex);
		if (lastNonWhitespace + 1 < startIndex) {
			return new Range(position.lineNumber, lastNonWhitespace + 2, position.lineNumber, position.column);
		}
		return null;
	}

	public static deleteWordLeft(ctx: DeleteWordContext, wordNavigationType: WordNavigationType): Range | null {
		const wordSeparators = ctx.wordSeparators;
		const model = ctx.model;
		const selection = ctx.selection;
		const whitespaceHeuristics = ctx.whitespaceHeuristics;

		if (!selection.isEmpty()) {
			return selection;
		}

		if (DeleteOperations.isAutoClosingPairDelete(ctx.autoClosingDelete, ctx.autoClosingBrackets, ctx.autoClosingQuotes, ctx.autoClosingPairs.autoClosingPairsOpenByEnd, ctx.model, [ctx.selection], ctx.autoClosedCharacters)) {
			const position = ctx.selection.getPosition();
			return new Range(position.lineNumber, position.column - 1, position.lineNumber, position.column + 1);
		}

		const position = new Position(selection.positionLineNumber, selection.positionColumn);

		let lineNumber = position.lineNumber;
		let column = position.column;

		if (lineNumber === 1 && column === 1) {
			// Ignore deleting at beginning of file
			return null;
		}

		if (whitespaceHeuristics) {
			const r = this._deleteWordLeftWhitespace(model, position);
			if (r) {
				return r;
			}
		}

		let prevWordOnLine = WordOperations._findPreviousWordOnLine(wordSeparators, model, position);

		if (wordNavigationType === WordNavigationType.WordStart) {
			if (prevWordOnLine) {
				column = prevWordOnLine.start + 1;
			} else {
				if (column > 1) {
					column = 1;
				} else {
					lineNumber--;
					column = model.getLineMaxColumn(lineNumber);
				}
			}
		} else {
			if (prevWordOnLine && column <= prevWordOnLine.end + 1) {
				prevWordOnLine = WordOperations._findPreviousWordOnLine(wordSeparators, model, new Position(lineNumber, prevWordOnLine.start + 1));
			}
			if (prevWordOnLine) {
				column = prevWordOnLine.end + 1;
			} else {
				if (column > 1) {
					column = 1;
				} else {
					lineNumber--;
					column = model.getLineMaxColumn(lineNumber);
				}
			}
		}

		return new Range(lineNumber, column, position.lineNumber, position.column);
	}

	public static deleteInsideWord(wordSeparators: WordCharacterClassifier, model: ITextModel, selection: Selection, onlyWord: boolean = false): Range {
		if (!selection.isEmpty()) {
			return selection;
		}

		const position = new Position(selection.positionLineNumber, selection.positionColumn);

		const r = this._deleteInsideWordWhitespace(model, position);
		if (r) {
			return r;
		}

		return this._deleteInsideWordDetermineDeleteRange(wordSeparators, model, position, onlyWord);
	}

	private static _charAtIsWhitespace(str: string, index: number): boolean {
		const charCode = str.charCodeAt(index);
		return (charCode === CharCode.Space || charCode === CharCode.Tab);
	}

	private static _deleteInsideWordWhitespace(model: ICursorSimpleModel, position: Position): Range | null {
		const lineContent = model.getLineContent(position.lineNumber);
		const lineContentLength = lineContent.length;

		if (lineContentLength === 0) {
			// empty line
			return null;
		}

		let leftIndex = Math.max(position.column - 2, 0);
		if (!this._charAtIsWhitespace(lineContent, leftIndex)) {
			// touches a non-whitespace character to the left
			return null;
		}

		let rightIndex = Math.min(position.column - 1, lineContentLength - 1);
		if (!this._charAtIsWhitespace(lineContent, rightIndex)) {
			// touches a non-whitespace character to the right
			return null;
		}

		// walk over whitespace to the left
		while (leftIndex > 0 && this._charAtIsWhitespace(lineContent, leftIndex - 1)) {
			leftIndex--;
		}

		// walk over whitespace to the right
		while (rightIndex + 1 < lineContentLength && this._charAtIsWhitespace(lineContent, rightIndex + 1)) {
			rightIndex++;
		}

		return new Range(position.lineNumber, leftIndex + 1, position.lineNumber, rightIndex + 2);
	}

	private static _deleteInsideWordDetermineDeleteRange(wordSeparators: WordCharacterClassifier, model: ICursorSimpleModel, position: Position, onlyWord: boolean): Range {
		const lineContent = model.getLineContent(position.lineNumber);
		const lineLength = lineContent.length;
		if (lineLength === 0) {
			// empty line
			if (position.lineNumber > 1) {
				return new Range(position.lineNumber - 1, model.getLineMaxColumn(position.lineNumber - 1), position.lineNumber, 1);
			} else {
				if (position.lineNumber < model.getLineCount()) {
					return new Range(position.lineNumber, 1, position.lineNumber + 1, 1);
				} else {
					// empty model
					return new Range(position.lineNumber, 1, position.lineNumber, 1);
				}
			}
		}

		const touchesWord = (word: IFindWordResult) => {
			return (word.start + 1 <= position.column && position.column <= word.end + 1);
		};
		const createRangeWithPosition = (startColumn: number, endColumn: number) => {
			startColumn = Math.min(startColumn, position.column);
			endColumn = Math.max(endColumn, position.column);
			return new Range(position.lineNumber, startColumn, position.lineNumber, endColumn);
		};
		const deleteWordAndAdjacentWhitespace = (word: IFindWordResult) => {
			let startColumn = word.start + 1;
			let endColumn = word.end + 1;
			if (onlyWord) {
				return createRangeWithPosition(startColumn, endColumn);
			}
			let expandedToTheRight = false;
			while (endColumn - 1 < lineLength && this._charAtIsWhitespace(lineContent, endColumn - 1)) {
				expandedToTheRight = true;
				endColumn++;
			}
			if (!expandedToTheRight) {
				while (startColumn > 1 && this._charAtIsWhitespace(lineContent, startColumn - 2)) {
					startColumn--;
				}
			}
			return createRangeWithPosition(startColumn, endColumn);
		};

		const prevWordOnLine = WordOperations._findPreviousWordOnLine(wordSeparators, model, position);
		if (prevWordOnLine && touchesWord(prevWordOnLine)) {
			return deleteWordAndAdjacentWhitespace(prevWordOnLine);
		}
		const nextWordOnLine = WordOperations._findNextWordOnLine(wordSeparators, model, position);
		if (nextWordOnLine && touchesWord(nextWordOnLine)) {
			return deleteWordAndAdjacentWhitespace(nextWordOnLine);
		}
		if (prevWordOnLine && nextWordOnLine) {
			return createRangeWithPosition(prevWordOnLine.end + 1, nextWordOnLine.start + 1);
		}
		if (prevWordOnLine) {
			return createRangeWithPosition(prevWordOnLine.start + 1, prevWordOnLine.end + 1);
		}
		if (nextWordOnLine) {
			return createRangeWithPosition(nextWordOnLine.start + 1, nextWordOnLine.end + 1);
		}

		return createRangeWithPosition(1, lineLength + 1);
	}

	public static _deleteWordPartLeft(model: ICursorSimpleModel, selection: Selection): Range {
		if (!selection.isEmpty()) {
			return selection;
		}

		const pos = selection.getPosition();
		const toPosition = WordOperations._moveWordPartLeft(model, pos);
		return new Range(pos.lineNumber, pos.column, toPosition.lineNumber, toPosition.column);
	}

	private static _findFirstNonWhitespaceChar(str: string, startIndex: number): number {
		const len = str.length;
		for (let chIndex = startIndex; chIndex < len; chIndex++) {
			const ch = str.charAt(chIndex);
			if (ch !== ' ' && ch !== '\t') {
				return chIndex;
			}
		}
		return len;
	}

	protected static _deleteWordRightWhitespace(model: ICursorSimpleModel, position: Position): Range | null {
		const lineContent = model.getLineContent(position.lineNumber);
		const startIndex = position.column - 1;
		const firstNonWhitespace = this._findFirstNonWhitespaceChar(lineContent, startIndex);
		if (startIndex + 1 < firstNonWhitespace) {
			// bingo
			return new Range(position.lineNumber, position.column, position.lineNumber, firstNonWhitespace + 1);
		}
		return null;
	}

	public static deleteWordRight(ctx: DeleteWordContext, wordNavigationType: WordNavigationType): Range | null {
		const wordSeparators = ctx.wordSeparators;
		const model = ctx.model;
		const selection = ctx.selection;
		const whitespaceHeuristics = ctx.whitespaceHeuristics;

		if (!selection.isEmpty()) {
			return selection;
		}

		const position = new Position(selection.positionLineNumber, selection.positionColumn);

		let lineNumber = position.lineNumber;
		let column = position.column;

		const lineCount = model.getLineCount();
		const maxColumn = model.getLineMaxColumn(lineNumber);
		if (lineNumber === lineCount && column === maxColumn) {
			// Ignore deleting at end of file
			return null;
		}

		if (whitespaceHeuristics) {
			const r = this._deleteWordRightWhitespace(model, position);
			if (r) {
				return r;
			}
		}

		let nextWordOnLine = WordOperations._findNextWordOnLine(wordSeparators, model, position);

		if (wordNavigationType === WordNavigationType.WordEnd) {
			if (nextWordOnLine) {
				column = nextWordOnLine.end + 1;
			} else {
				if (column < maxColumn || lineNumber === lineCount) {
					column = maxColumn;
				} else {
					lineNumber++;
					nextWordOnLine = WordOperations._findNextWordOnLine(wordSeparators, model, new Position(lineNumber, 1));
					if (nextWordOnLine) {
						column = nextWordOnLine.start + 1;
					} else {
						column = model.getLineMaxColumn(lineNumber);
					}
				}
			}
		} else {
			if (nextWordOnLine && column >= nextWordOnLine.start + 1) {
				nextWordOnLine = WordOperations._findNextWordOnLine(wordSeparators, model, new Position(lineNumber, nextWordOnLine.end + 1));
			}
			if (nextWordOnLine) {
				column = nextWordOnLine.start + 1;
			} else {
				if (column < maxColumn || lineNumber === lineCount) {
					column = maxColumn;
				} else {
					lineNumber++;
					nextWordOnLine = WordOperations._findNextWordOnLine(wordSeparators, model, new Position(lineNumber, 1));
					if (nextWordOnLine) {
						column = nextWordOnLine.start + 1;
					} else {
						column = model.getLineMaxColumn(lineNumber);
					}
				}
			}
		}

		return new Range(lineNumber, column, position.lineNumber, position.column);
	}

	public static _deleteWordPartRight(model: ICursorSimpleModel, selection: Selection): Range {
		if (!selection.isEmpty()) {
			return selection;
		}

		const pos = selection.getPosition();
		const toPosition = WordOperations._moveWordPartRight(model, pos);
		return new Range(pos.lineNumber, pos.column, toPosition.lineNumber, toPosition.column);
	}

	private static _createWordAtPosition(model: ITextModel, lineNumber: number, word: IFindWordResult): IWordAtPosition {
		const range = new Range(lineNumber, word.start + 1, lineNumber, word.end + 1);
		return {
			word: model.getValueInRange(range),
			startColumn: range.startColumn,
			endColumn: range.endColumn
		};
	}

	public static getWordAtPosition(model: ITextModel, _wordSeparators: string, _intlSegmenterLocales: string[], position: Position): IWordAtPosition | null {
		const wordSeparators = getMapForWordSeparators(_wordSeparators, _intlSegmenterLocales);
		const prevWord = WordOperations._findPreviousWordOnLine(wordSeparators, model, position);
		if (prevWord && prevWord.wordType === WordType.Regular && prevWord.start <= position.column - 1 && position.column - 1 <= prevWord.end) {
			return WordOperations._createWordAtPosition(model, position.lineNumber, prevWord);
		}
		const nextWord = WordOperations._findNextWordOnLine(wordSeparators, model, position);
		if (nextWord && nextWord.wordType === WordType.Regular && nextWord.start <= position.column - 1 && position.column - 1 <= nextWord.end) {
			return WordOperations._createWordAtPosition(model, position.lineNumber, nextWord);
		}
		return null;
	}

	public static word(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean, position: Position): SingleCursorState {
		const wordSeparators = getMapForWordSeparators(config.wordSeparators, config.wordSegmenterLocales);
		const prevWord = WordOperations._findPreviousWordOnLine(wordSeparators, model, position);
		const nextWord = WordOperations._findNextWordOnLine(wordSeparators, model, position);

		if (!inSelectionMode) {
			// Entering word selection for the first time
			let startColumn: number;
			let endColumn: number;

			if (prevWord && prevWord.wordType === WordType.Regular && prevWord.start <= position.column - 1 && position.column - 1 <= prevWord.end) {
				// isTouchingPrevWord (Regular word)
				startColumn = prevWord.start + 1;
				endColumn = prevWord.end + 1;
			} else if (prevWord && prevWord.wordType === WordType.Separator && prevWord.start <= position.column - 1 && position.column - 1 < prevWord.end) {
				// isTouchingPrevWord (Separator word) - stricter check, don't include end boundary
				startColumn = prevWord.start + 1;
				endColumn = prevWord.end + 1;
			} else if (nextWord && nextWord.wordType === WordType.Regular && nextWord.start <= position.column - 1 && position.column - 1 <= nextWord.end) {
				// isTouchingNextWord (Regular word)
				startColumn = nextWord.start + 1;
				endColumn = nextWord.end + 1;
			} else if (nextWord && nextWord.wordType === WordType.Separator && nextWord.start <= position.column - 1 && position.column - 1 < nextWord.end) {
				// isTouchingNextWord (Separator word) - stricter check, don't include end boundary
				startColumn = nextWord.start + 1;
				endColumn = nextWord.end + 1;
			} else {
				if (prevWord) {
					startColumn = prevWord.end + 1;
				} else {
					startColumn = 1;
				}
				if (nextWord) {
					endColumn = nextWord.start + 1;
				} else {
					endColumn = model.getLineMaxColumn(position.lineNumber);
				}
			}

			return new SingleCursorState(
				new Range(position.lineNumber, startColumn, position.lineNumber, endColumn), SelectionStartKind.Word, 0,
				new Position(position.lineNumber, endColumn), 0
			);
		}

		let startColumn: number;
		let endColumn: number;

		if (prevWord && prevWord.wordType === WordType.Regular && prevWord.start < position.column - 1 && position.column - 1 < prevWord.end) {
			// isInsidePrevWord (Regular word)
			startColumn = prevWord.start + 1;
			endColumn = prevWord.end + 1;
		} else if (nextWord && nextWord.wordType === WordType.Regular && nextWord.start < position.column - 1 && position.column - 1 < nextWord.end) {
			// isInsideNextWord (Regular word)
			startColumn = nextWord.start + 1;
			endColumn = nextWord.end + 1;
		} else {
			startColumn = position.column;
			endColumn = position.column;
		}

		const lineNumber = position.lineNumber;
		let column: number;
		if (cursor.selectionStart.containsPosition(position)) {
			column = cursor.selectionStart.endColumn;
		} else if (position.isBeforeOrEqual(cursor.selectionStart.getStartPosition())) {
			column = startColumn;
			const possiblePosition = new Position(lineNumber, column);
			if (cursor.selectionStart.containsPosition(possiblePosition)) {
				column = cursor.selectionStart.endColumn;
			}
		} else {
			column = endColumn;
			const possiblePosition = new Position(lineNumber, column);
			if (cursor.selectionStart.containsPosition(possiblePosition)) {
				column = cursor.selectionStart.startColumn;
			}
		}

		return cursor.move(true, lineNumber, column, 0);
	}
}

export class WordPartOperations extends WordOperations {
	public static deleteWordPartLeft(ctx: DeleteWordContext): Range {
		const candidates = enforceDefined([
			WordOperations.deleteWordLeft(ctx, WordNavigationType.WordStart),
			WordOperations.deleteWordLeft(ctx, WordNavigationType.WordEnd),
			WordOperations._deleteWordPartLeft(ctx.model, ctx.selection)
		]);
		candidates.sort(Range.compareRangesUsingEnds);
		return candidates[2];
	}

	public static deleteWordPartRight(ctx: DeleteWordContext): Range {
		const candidates = enforceDefined([
			WordOperations.deleteWordRight(ctx, WordNavigationType.WordStart),
			WordOperations.deleteWordRight(ctx, WordNavigationType.WordEnd),
			WordOperations._deleteWordPartRight(ctx.model, ctx.selection)
		]);
		candidates.sort(Range.compareRangesUsingStarts);
		return candidates[0];
	}

	public static moveWordPartLeft(wordSeparators: WordCharacterClassifier, model: ICursorSimpleModel, position: Position, hasMulticursor: boolean): Position {
		const candidates = enforceDefined([
			WordOperations.moveWordLeft(wordSeparators, model, position, WordNavigationType.WordStart, hasMulticursor),
			WordOperations.moveWordLeft(wordSeparators, model, position, WordNavigationType.WordEnd, hasMulticursor),
			WordOperations._moveWordPartLeft(model, position)
		]);
		candidates.sort(Position.compare);
		return candidates[2];
	}

	public static moveWordPartRight(wordSeparators: WordCharacterClassifier, model: ICursorSimpleModel, position: Position): Position {
		const candidates = enforceDefined([
			WordOperations.moveWordRight(wordSeparators, model, position, WordNavigationType.WordStart),
			WordOperations.moveWordRight(wordSeparators, model, position, WordNavigationType.WordEnd),
			WordOperations._moveWordPartRight(model, position)
		]);
		candidates.sort(Position.compare);
		return candidates[0];
	}
}

function enforceDefined<T>(arr: Array<T | undefined | null>): T[] {
	return <T[]>arr.filter(el => Boolean(el));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/cursor/oneCursor.ts]---
Location: vscode-main/src/vs/editor/common/cursor/oneCursor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CursorState, ICursorSimpleModel, SelectionStartKind, SingleCursorState } from '../cursorCommon.js';
import { CursorContext } from './cursorContext.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { Selection } from '../core/selection.js';
import { PositionAffinity, TrackedRangeStickiness } from '../model.js';

/**
 * Represents a single cursor.
*/
export class Cursor {

	public modelState!: SingleCursorState;
	public viewState!: SingleCursorState;

	private _selTrackedRange: string | null;
	private _trackSelection: boolean;

	constructor(context: CursorContext) {
		this._selTrackedRange = null;
		this._trackSelection = true;

		this._setState(
			context,
			new SingleCursorState(new Range(1, 1, 1, 1), SelectionStartKind.Simple, 0, new Position(1, 1), 0),
			new SingleCursorState(new Range(1, 1, 1, 1), SelectionStartKind.Simple, 0, new Position(1, 1), 0)
		);
	}

	public dispose(context: CursorContext): void {
		this._removeTrackedRange(context);
	}

	public startTrackingSelection(context: CursorContext): void {
		this._trackSelection = true;
		this._updateTrackedRange(context);
	}

	public stopTrackingSelection(context: CursorContext): void {
		this._trackSelection = false;
		this._removeTrackedRange(context);
	}

	private _updateTrackedRange(context: CursorContext): void {
		if (!this._trackSelection) {
			// don't track the selection
			return;
		}
		this._selTrackedRange = context.model._setTrackedRange(this._selTrackedRange, this.modelState.selection, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges);
	}

	private _removeTrackedRange(context: CursorContext): void {
		this._selTrackedRange = context.model._setTrackedRange(this._selTrackedRange, null, TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges);
	}

	public asCursorState(): CursorState {
		return new CursorState(this.modelState, this.viewState);
	}

	public readSelectionFromMarkers(context: CursorContext): Selection {
		const range = context.model._getTrackedRange(this._selTrackedRange!)!;

		if (this.modelState.selection.isEmpty() && !range.isEmpty()) {
			// Avoid selecting text when recovering from markers
			return Selection.fromRange(range.collapseToEnd(), this.modelState.selection.getDirection());
		}

		return Selection.fromRange(range, this.modelState.selection.getDirection());
	}

	public ensureValidState(context: CursorContext): void {
		this._setState(context, this.modelState, this.viewState);
	}

	public setState(context: CursorContext, modelState: SingleCursorState | null, viewState: SingleCursorState | null): void {
		this._setState(context, modelState, viewState);
	}

	private static _validatePositionWithCache(viewModel: ICursorSimpleModel, position: Position, cacheInput: Position, cacheOutput: Position): Position {
		if (position.equals(cacheInput)) {
			return cacheOutput;
		}
		return viewModel.normalizePosition(position, PositionAffinity.None);
	}

	private static _validateViewState(viewModel: ICursorSimpleModel, viewState: SingleCursorState): SingleCursorState {
		const position = viewState.position;
		const sStartPosition = viewState.selectionStart.getStartPosition();
		const sEndPosition = viewState.selectionStart.getEndPosition();

		const validPosition = viewModel.normalizePosition(position, PositionAffinity.None);
		const validSStartPosition = this._validatePositionWithCache(viewModel, sStartPosition, position, validPosition);
		const validSEndPosition = this._validatePositionWithCache(viewModel, sEndPosition, sStartPosition, validSStartPosition);

		if (position.equals(validPosition) && sStartPosition.equals(validSStartPosition) && sEndPosition.equals(validSEndPosition)) {
			// fast path: the state is valid
			return viewState;
		}

		return new SingleCursorState(
			Range.fromPositions(validSStartPosition, validSEndPosition),
			viewState.selectionStartKind,
			viewState.selectionStartLeftoverVisibleColumns + sStartPosition.column - validSStartPosition.column,
			validPosition,
			viewState.leftoverVisibleColumns + position.column - validPosition.column,
		);
	}

	private _setState(context: CursorContext, modelState: SingleCursorState | null, viewState: SingleCursorState | null): void {
		if (viewState) {
			viewState = Cursor._validateViewState(context.viewModel, viewState);
		}

		if (!modelState) {
			if (!viewState) {
				return;
			}
			// We only have the view state => compute the model state
			const selectionStart = context.model.validateRange(
				context.coordinatesConverter.convertViewRangeToModelRange(viewState.selectionStart)
			);

			const position = context.model.validatePosition(
				context.coordinatesConverter.convertViewPositionToModelPosition(viewState.position)
			);

			modelState = new SingleCursorState(selectionStart, viewState.selectionStartKind, viewState.selectionStartLeftoverVisibleColumns, position, viewState.leftoverVisibleColumns);
		} else {
			// Validate new model state
			const selectionStart = context.model.validateRange(modelState.selectionStart);
			const selectionStartLeftoverVisibleColumns = modelState.selectionStart.equalsRange(selectionStart) ? modelState.selectionStartLeftoverVisibleColumns : 0;

			const position = context.model.validatePosition(
				modelState.position
			);
			const leftoverVisibleColumns = modelState.position.equals(position) ? modelState.leftoverVisibleColumns : 0;

			modelState = new SingleCursorState(selectionStart, modelState.selectionStartKind, selectionStartLeftoverVisibleColumns, position, leftoverVisibleColumns);
		}

		if (!viewState) {
			// We only have the model state => compute the view state
			const viewSelectionStart1 = context.coordinatesConverter.convertModelPositionToViewPosition(new Position(modelState.selectionStart.startLineNumber, modelState.selectionStart.startColumn));
			const viewSelectionStart2 = context.coordinatesConverter.convertModelPositionToViewPosition(new Position(modelState.selectionStart.endLineNumber, modelState.selectionStart.endColumn));
			const viewSelectionStart = new Range(viewSelectionStart1.lineNumber, viewSelectionStart1.column, viewSelectionStart2.lineNumber, viewSelectionStart2.column);
			const viewPosition = context.coordinatesConverter.convertModelPositionToViewPosition(modelState.position);
			viewState = new SingleCursorState(viewSelectionStart, modelState.selectionStartKind, modelState.selectionStartLeftoverVisibleColumns, viewPosition, modelState.leftoverVisibleColumns);
		} else {
			// Validate new view state
			const viewSelectionStart = context.coordinatesConverter.validateViewRange(viewState.selectionStart, modelState.selectionStart);
			const viewPosition = context.coordinatesConverter.validateViewPosition(viewState.position, modelState.position);
			viewState = new SingleCursorState(viewSelectionStart, modelState.selectionStartKind, modelState.selectionStartLeftoverVisibleColumns, viewPosition, modelState.leftoverVisibleColumns);
		}

		this.modelState = modelState;
		this.viewState = viewState;

		this._updateTrackedRange(context);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/diff/documentDiffProvider.ts]---
Location: vscode-main/src/vs/editor/common/diff/documentDiffProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Event } from '../../../base/common/event.js';
import { MovedText } from './linesDiffComputer.js';
import { DetailedLineRangeMapping } from './rangeMapping.js';
import { ITextModel } from '../model.js';

/**
 * A document diff provider computes the diff between two text models.
 * @internal
 */
export interface IDocumentDiffProvider {
	/**
	 * Computes the diff between the text models `original` and `modified`.
	 */
	computeDiff(original: ITextModel, modified: ITextModel, options: IDocumentDiffProviderOptions, cancellationToken: CancellationToken): Promise<IDocumentDiff>;

	/**
	 * Is fired when settings of the diff algorithm change that could alter the result of the diffing computation.
	 * Any user of this provider should recompute the diff when this event is fired.
	 */
	readonly onDidChange: Event<void>;
}

/**
 * Options for the diff computation.
 * @internal
 */
export interface IDocumentDiffProviderOptions {
	/**
	 * When set to true, the diff should ignore whitespace changes.
	 */
	ignoreTrimWhitespace: boolean;

	/**
	 * A diff computation should throw if it takes longer than this value.
	 */
	maxComputationTimeMs: number;

	/**
	 * If set, the diff computation should compute moves in addition to insertions and deletions.
	 */
	computeMoves: boolean;

	extendToSubwords?: boolean;
}

/**
 * Represents a diff between two text models.
 * @internal
 */
export interface IDocumentDiff {
	/**
	 * If true, both text models are identical (byte-wise).
	 */
	readonly identical: boolean;

	/**
	 * If true, the diff computation timed out and the diff might not be accurate.
	 */
	readonly quitEarly: boolean;

	/**
	 * Maps all modified line ranges in the original to the corresponding line ranges in the modified text model.
	 */
	readonly changes: readonly DetailedLineRangeMapping[];

	/**
	 * Sorted by original line ranges.
	 * The original line ranges and the modified line ranges must be disjoint (but can be touching).
	 */
	readonly moves: readonly MovedText[];
}


export const nullDocumentDiff: IDocumentDiff = Object.freeze({
	identical: true,
	quitEarly: false,
	changes: Object.freeze([]),
	moves: Object.freeze([])
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/diff/legacyLinesDiffComputer.ts]---
Location: vscode-main/src/vs/editor/common/diff/legacyLinesDiffComputer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';
import { IDiffChange, ISequence, LcsDiff, IDiffResult } from '../../../base/common/diff/diff.js';
import { ILinesDiffComputer, ILinesDiffComputerOptions, LinesDiff } from './linesDiffComputer.js';
import { RangeMapping, DetailedLineRangeMapping } from './rangeMapping.js';
import * as strings from '../../../base/common/strings.js';
import { Range } from '../core/range.js';
import { assertFn, checkAdjacentItems } from '../../../base/common/assert.js';
import { LineRange } from '../core/ranges/lineRange.js';

const MINIMUM_MATCHING_CHARACTER_LENGTH = 3;

export class LegacyLinesDiffComputer implements ILinesDiffComputer {
	computeDiff(originalLines: string[], modifiedLines: string[], options: ILinesDiffComputerOptions): LinesDiff {
		const diffComputer = new DiffComputer(originalLines, modifiedLines, {
			maxComputationTime: options.maxComputationTimeMs,
			shouldIgnoreTrimWhitespace: options.ignoreTrimWhitespace,
			shouldComputeCharChanges: true,
			shouldMakePrettyDiff: true,
			shouldPostProcessCharChanges: true,
		});
		const result = diffComputer.computeDiff();
		const changes: DetailedLineRangeMapping[] = [];
		let lastChange: DetailedLineRangeMapping | null = null;


		for (const c of result.changes) {
			let originalRange: LineRange;
			if (c.originalEndLineNumber === 0) {
				// Insertion
				originalRange = new LineRange(c.originalStartLineNumber + 1, c.originalStartLineNumber + 1);
			} else {
				originalRange = new LineRange(c.originalStartLineNumber, c.originalEndLineNumber + 1);
			}

			let modifiedRange: LineRange;
			if (c.modifiedEndLineNumber === 0) {
				// Deletion
				modifiedRange = new LineRange(c.modifiedStartLineNumber + 1, c.modifiedStartLineNumber + 1);
			} else {
				modifiedRange = new LineRange(c.modifiedStartLineNumber, c.modifiedEndLineNumber + 1);
			}

			let change = new DetailedLineRangeMapping(originalRange, modifiedRange, c.charChanges?.map(c => new RangeMapping(
				new Range(c.originalStartLineNumber, c.originalStartColumn, c.originalEndLineNumber, c.originalEndColumn),
				new Range(c.modifiedStartLineNumber, c.modifiedStartColumn, c.modifiedEndLineNumber, c.modifiedEndColumn),
			)));
			if (lastChange) {
				if (lastChange.modified.endLineNumberExclusive === change.modified.startLineNumber
					|| lastChange.original.endLineNumberExclusive === change.original.startLineNumber) {
					// join touching diffs. Probably moving diffs up/down in the algorithm causes touching diffs.
					change = new DetailedLineRangeMapping(
						lastChange.original.join(change.original),
						lastChange.modified.join(change.modified),
						lastChange.innerChanges && change.innerChanges ?
							lastChange.innerChanges.concat(change.innerChanges) : undefined
					);
					changes.pop();
				}
			}

			changes.push(change);
			lastChange = change;
		}

		assertFn(() => {
			return checkAdjacentItems(changes,
				(m1, m2) => m2.original.startLineNumber - m1.original.endLineNumberExclusive === m2.modified.startLineNumber - m1.modified.endLineNumberExclusive &&
					// There has to be an unchanged line in between (otherwise both diffs should have been joined)
					m1.original.endLineNumberExclusive < m2.original.startLineNumber &&
					m1.modified.endLineNumberExclusive < m2.modified.startLineNumber,
			);
		});

		return new LinesDiff(changes, [], result.quitEarly);
	}
}

export interface IDiffComputationResult {
	quitEarly: boolean;
	identical: boolean;

	/**
	 * The changes as (legacy) line change array.
	 * @deprecated Use `changes2` instead.
	 */
	changes: ILineChange[];

	/**
	 * The changes as (modern) line range mapping array.
	 */
	changes2: readonly DetailedLineRangeMapping[];
}

/**
 * A change
 */
export interface IChange {
	readonly originalStartLineNumber: number;
	readonly originalEndLineNumber: number;
	readonly modifiedStartLineNumber: number;
	readonly modifiedEndLineNumber: number;
}

/**
 * A character level change.
 */
export interface ICharChange extends IChange {
	readonly originalStartColumn: number;
	readonly originalEndColumn: number;
	readonly modifiedStartColumn: number;
	readonly modifiedEndColumn: number;
}

/**
 * A line change
 */
export interface ILineChange extends IChange {
	readonly charChanges: ICharChange[] | undefined;
}

export interface IDiffComputerResult {
	quitEarly: boolean;
	changes: ILineChange[];
}

function computeDiff(originalSequence: ISequence, modifiedSequence: ISequence, continueProcessingPredicate: () => boolean, pretty: boolean): IDiffResult {
	const diffAlgo = new LcsDiff(originalSequence, modifiedSequence, continueProcessingPredicate);
	return diffAlgo.ComputeDiff(pretty);
}

class LineSequence implements ISequence {

	public readonly lines: string[];
	private readonly _startColumns: number[];
	private readonly _endColumns: number[];

	constructor(lines: string[]) {
		const startColumns: number[] = [];
		const endColumns: number[] = [];
		for (let i = 0, length = lines.length; i < length; i++) {
			startColumns[i] = getFirstNonBlankColumn(lines[i], 1);
			endColumns[i] = getLastNonBlankColumn(lines[i], 1);
		}
		this.lines = lines;
		this._startColumns = startColumns;
		this._endColumns = endColumns;
	}

	public getElements(): Int32Array | number[] | string[] {
		const elements: string[] = [];
		for (let i = 0, len = this.lines.length; i < len; i++) {
			elements[i] = this.lines[i].substring(this._startColumns[i] - 1, this._endColumns[i] - 1);
		}
		return elements;
	}

	public getStrictElement(index: number): string {
		return this.lines[index];
	}

	public getStartLineNumber(i: number): number {
		return i + 1;
	}

	public getEndLineNumber(i: number): number {
		return i + 1;
	}

	public createCharSequence(shouldIgnoreTrimWhitespace: boolean, startIndex: number, endIndex: number): CharSequence {
		const charCodes: number[] = [];
		const lineNumbers: number[] = [];
		const columns: number[] = [];
		let len = 0;
		for (let index = startIndex; index <= endIndex; index++) {
			const lineContent = this.lines[index];
			const startColumn = (shouldIgnoreTrimWhitespace ? this._startColumns[index] : 1);
			const endColumn = (shouldIgnoreTrimWhitespace ? this._endColumns[index] : lineContent.length + 1);
			for (let col = startColumn; col < endColumn; col++) {
				charCodes[len] = lineContent.charCodeAt(col - 1);
				lineNumbers[len] = index + 1;
				columns[len] = col;
				len++;
			}
			if (!shouldIgnoreTrimWhitespace && index < endIndex) {
				// Add \n if trim whitespace is not ignored
				charCodes[len] = CharCode.LineFeed;
				lineNumbers[len] = index + 1;
				columns[len] = lineContent.length + 1;
				len++;
			}
		}
		return new CharSequence(charCodes, lineNumbers, columns);
	}
}

class CharSequence implements ISequence {

	private readonly _charCodes: number[];
	private readonly _lineNumbers: number[];
	private readonly _columns: number[];

	constructor(charCodes: number[], lineNumbers: number[], columns: number[]) {
		this._charCodes = charCodes;
		this._lineNumbers = lineNumbers;
		this._columns = columns;
	}

	public toString() {
		return (
			'[' + this._charCodes.map((s, idx) => (s === CharCode.LineFeed ? '\\n' : String.fromCharCode(s)) + `-(${this._lineNumbers[idx]},${this._columns[idx]})`).join(', ') + ']'
		);
	}

	private _assertIndex(index: number, arr: number[]): void {
		if (index < 0 || index >= arr.length) {
			throw new Error(`Illegal index`);
		}
	}

	public getElements(): Int32Array | number[] | string[] {
		return this._charCodes;
	}

	public getStartLineNumber(i: number): number {
		if (i > 0 && i === this._lineNumbers.length) {
			// the start line number of the element after the last element
			// is the end line number of the last element
			return this.getEndLineNumber(i - 1);
		}
		this._assertIndex(i, this._lineNumbers);

		return this._lineNumbers[i];
	}

	public getEndLineNumber(i: number): number {
		if (i === -1) {
			// the end line number of the element before the first element
			// is the start line number of the first element
			return this.getStartLineNumber(i + 1);
		}
		this._assertIndex(i, this._lineNumbers);

		if (this._charCodes[i] === CharCode.LineFeed) {
			return this._lineNumbers[i] + 1;
		}
		return this._lineNumbers[i];
	}

	public getStartColumn(i: number): number {
		if (i > 0 && i === this._columns.length) {
			// the start column of the element after the last element
			// is the end column of the last element
			return this.getEndColumn(i - 1);
		}
		this._assertIndex(i, this._columns);
		return this._columns[i];
	}

	public getEndColumn(i: number): number {
		if (i === -1) {
			// the end column of the element before the first element
			// is the start column of the first element
			return this.getStartColumn(i + 1);
		}
		this._assertIndex(i, this._columns);

		if (this._charCodes[i] === CharCode.LineFeed) {
			return 1;
		}
		return this._columns[i] + 1;
	}
}

class CharChange implements ICharChange {

	public originalStartLineNumber: number;
	public originalStartColumn: number;
	public originalEndLineNumber: number;
	public originalEndColumn: number;

	public modifiedStartLineNumber: number;
	public modifiedStartColumn: number;
	public modifiedEndLineNumber: number;
	public modifiedEndColumn: number;

	constructor(
		originalStartLineNumber: number,
		originalStartColumn: number,
		originalEndLineNumber: number,
		originalEndColumn: number,
		modifiedStartLineNumber: number,
		modifiedStartColumn: number,
		modifiedEndLineNumber: number,
		modifiedEndColumn: number
	) {
		this.originalStartLineNumber = originalStartLineNumber;
		this.originalStartColumn = originalStartColumn;
		this.originalEndLineNumber = originalEndLineNumber;
		this.originalEndColumn = originalEndColumn;
		this.modifiedStartLineNumber = modifiedStartLineNumber;
		this.modifiedStartColumn = modifiedStartColumn;
		this.modifiedEndLineNumber = modifiedEndLineNumber;
		this.modifiedEndColumn = modifiedEndColumn;
	}

	public static createFromDiffChange(diffChange: IDiffChange, originalCharSequence: CharSequence, modifiedCharSequence: CharSequence): CharChange {
		const originalStartLineNumber = originalCharSequence.getStartLineNumber(diffChange.originalStart);
		const originalStartColumn = originalCharSequence.getStartColumn(diffChange.originalStart);
		const originalEndLineNumber = originalCharSequence.getEndLineNumber(diffChange.originalStart + diffChange.originalLength - 1);
		const originalEndColumn = originalCharSequence.getEndColumn(diffChange.originalStart + diffChange.originalLength - 1);

		const modifiedStartLineNumber = modifiedCharSequence.getStartLineNumber(diffChange.modifiedStart);
		const modifiedStartColumn = modifiedCharSequence.getStartColumn(diffChange.modifiedStart);
		const modifiedEndLineNumber = modifiedCharSequence.getEndLineNumber(diffChange.modifiedStart + diffChange.modifiedLength - 1);
		const modifiedEndColumn = modifiedCharSequence.getEndColumn(diffChange.modifiedStart + diffChange.modifiedLength - 1);

		return new CharChange(
			originalStartLineNumber, originalStartColumn, originalEndLineNumber, originalEndColumn,
			modifiedStartLineNumber, modifiedStartColumn, modifiedEndLineNumber, modifiedEndColumn,
		);
	}
}

function postProcessCharChanges(rawChanges: IDiffChange[]): IDiffChange[] {
	if (rawChanges.length <= 1) {
		return rawChanges;
	}

	const result = [rawChanges[0]];
	let prevChange = result[0];

	for (let i = 1, len = rawChanges.length; i < len; i++) {
		const currChange = rawChanges[i];

		const originalMatchingLength = currChange.originalStart - (prevChange.originalStart + prevChange.originalLength);
		const modifiedMatchingLength = currChange.modifiedStart - (prevChange.modifiedStart + prevChange.modifiedLength);
		// Both of the above should be equal, but the continueProcessingPredicate may prevent this from being true
		const matchingLength = Math.min(originalMatchingLength, modifiedMatchingLength);

		if (matchingLength < MINIMUM_MATCHING_CHARACTER_LENGTH) {
			// Merge the current change into the previous one
			prevChange.originalLength = (currChange.originalStart + currChange.originalLength) - prevChange.originalStart;
			prevChange.modifiedLength = (currChange.modifiedStart + currChange.modifiedLength) - prevChange.modifiedStart;
		} else {
			// Add the current change
			result.push(currChange);
			prevChange = currChange;
		}
	}

	return result;
}

class LineChange implements ILineChange {
	public originalStartLineNumber: number;
	public originalEndLineNumber: number;
	public modifiedStartLineNumber: number;
	public modifiedEndLineNumber: number;
	public charChanges: CharChange[] | undefined;

	constructor(
		originalStartLineNumber: number,
		originalEndLineNumber: number,
		modifiedStartLineNumber: number,
		modifiedEndLineNumber: number,
		charChanges: CharChange[] | undefined
	) {
		this.originalStartLineNumber = originalStartLineNumber;
		this.originalEndLineNumber = originalEndLineNumber;
		this.modifiedStartLineNumber = modifiedStartLineNumber;
		this.modifiedEndLineNumber = modifiedEndLineNumber;
		this.charChanges = charChanges;
	}

	public static createFromDiffResult(shouldIgnoreTrimWhitespace: boolean, diffChange: IDiffChange, originalLineSequence: LineSequence, modifiedLineSequence: LineSequence, continueCharDiff: () => boolean, shouldComputeCharChanges: boolean, shouldPostProcessCharChanges: boolean): LineChange {
		let originalStartLineNumber: number;
		let originalEndLineNumber: number;
		let modifiedStartLineNumber: number;
		let modifiedEndLineNumber: number;
		let charChanges: CharChange[] | undefined = undefined;

		if (diffChange.originalLength === 0) {
			originalStartLineNumber = originalLineSequence.getStartLineNumber(diffChange.originalStart) - 1;
			originalEndLineNumber = 0;
		} else {
			originalStartLineNumber = originalLineSequence.getStartLineNumber(diffChange.originalStart);
			originalEndLineNumber = originalLineSequence.getEndLineNumber(diffChange.originalStart + diffChange.originalLength - 1);
		}

		if (diffChange.modifiedLength === 0) {
			modifiedStartLineNumber = modifiedLineSequence.getStartLineNumber(diffChange.modifiedStart) - 1;
			modifiedEndLineNumber = 0;
		} else {
			modifiedStartLineNumber = modifiedLineSequence.getStartLineNumber(diffChange.modifiedStart);
			modifiedEndLineNumber = modifiedLineSequence.getEndLineNumber(diffChange.modifiedStart + diffChange.modifiedLength - 1);
		}

		if (shouldComputeCharChanges && diffChange.originalLength > 0 && diffChange.originalLength < 20 && diffChange.modifiedLength > 0 && diffChange.modifiedLength < 20 && continueCharDiff()) {
			// Compute character changes for diff chunks of at most 20 lines...
			const originalCharSequence = originalLineSequence.createCharSequence(shouldIgnoreTrimWhitespace, diffChange.originalStart, diffChange.originalStart + diffChange.originalLength - 1);
			const modifiedCharSequence = modifiedLineSequence.createCharSequence(shouldIgnoreTrimWhitespace, diffChange.modifiedStart, diffChange.modifiedStart + diffChange.modifiedLength - 1);

			if (originalCharSequence.getElements().length > 0 && modifiedCharSequence.getElements().length > 0) {
				let rawChanges = computeDiff(originalCharSequence, modifiedCharSequence, continueCharDiff, true).changes;

				if (shouldPostProcessCharChanges) {
					rawChanges = postProcessCharChanges(rawChanges);
				}

				charChanges = [];
				for (let i = 0, length = rawChanges.length; i < length; i++) {
					charChanges.push(CharChange.createFromDiffChange(rawChanges[i], originalCharSequence, modifiedCharSequence));
				}
			}
		}

		return new LineChange(originalStartLineNumber, originalEndLineNumber, modifiedStartLineNumber, modifiedEndLineNumber, charChanges);
	}
}

export interface IDiffComputerOpts {
	shouldComputeCharChanges: boolean;
	shouldPostProcessCharChanges: boolean;
	shouldIgnoreTrimWhitespace: boolean;
	shouldMakePrettyDiff: boolean;
	maxComputationTime: number;
}

export class DiffComputer {

	private readonly shouldComputeCharChanges: boolean;
	private readonly shouldPostProcessCharChanges: boolean;
	private readonly shouldIgnoreTrimWhitespace: boolean;
	private readonly shouldMakePrettyDiff: boolean;
	private readonly originalLines: string[];
	private readonly modifiedLines: string[];
	private readonly original: LineSequence;
	private readonly modified: LineSequence;
	private readonly continueLineDiff: () => boolean;
	private readonly continueCharDiff: () => boolean;

	constructor(originalLines: string[], modifiedLines: string[], opts: IDiffComputerOpts) {
		this.shouldComputeCharChanges = opts.shouldComputeCharChanges;
		this.shouldPostProcessCharChanges = opts.shouldPostProcessCharChanges;
		this.shouldIgnoreTrimWhitespace = opts.shouldIgnoreTrimWhitespace;
		this.shouldMakePrettyDiff = opts.shouldMakePrettyDiff;
		this.originalLines = originalLines;
		this.modifiedLines = modifiedLines;
		this.original = new LineSequence(originalLines);
		this.modified = new LineSequence(modifiedLines);

		this.continueLineDiff = createContinueProcessingPredicate(opts.maxComputationTime);
		this.continueCharDiff = createContinueProcessingPredicate(opts.maxComputationTime === 0 ? 0 : Math.min(opts.maxComputationTime, 5000)); // never run after 5s for character changes...
	}

	public computeDiff(): IDiffComputerResult {

		if (this.original.lines.length === 1 && this.original.lines[0].length === 0) {
			// empty original => fast path
			if (this.modified.lines.length === 1 && this.modified.lines[0].length === 0) {
				return {
					quitEarly: false,
					changes: []
				};
			}

			return {
				quitEarly: false,
				changes: [{
					originalStartLineNumber: 1,
					originalEndLineNumber: 1,
					modifiedStartLineNumber: 1,
					modifiedEndLineNumber: this.modified.lines.length,
					charChanges: undefined
				}]
			};
		}

		if (this.modified.lines.length === 1 && this.modified.lines[0].length === 0) {
			// empty modified => fast path
			return {
				quitEarly: false,
				changes: [{
					originalStartLineNumber: 1,
					originalEndLineNumber: this.original.lines.length,
					modifiedStartLineNumber: 1,
					modifiedEndLineNumber: 1,
					charChanges: undefined
				}]
			};
		}

		const diffResult = computeDiff(this.original, this.modified, this.continueLineDiff, this.shouldMakePrettyDiff);
		const rawChanges = diffResult.changes;
		const quitEarly = diffResult.quitEarly;

		// The diff is always computed with ignoring trim whitespace
		// This ensures we get the prettiest diff

		if (this.shouldIgnoreTrimWhitespace) {
			const lineChanges: LineChange[] = [];
			for (let i = 0, length = rawChanges.length; i < length; i++) {
				lineChanges.push(LineChange.createFromDiffResult(this.shouldIgnoreTrimWhitespace, rawChanges[i], this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));
			}
			return {
				quitEarly: quitEarly,
				changes: lineChanges
			};
		}

		// Need to post-process and introduce changes where the trim whitespace is different
		// Note that we are looping starting at -1 to also cover the lines before the first change
		const result: LineChange[] = [];

		let originalLineIndex = 0;
		let modifiedLineIndex = 0;
		for (let i = -1 /* !!!! */, len = rawChanges.length; i < len; i++) {
			const nextChange = (i + 1 < len ? rawChanges[i + 1] : null);
			const originalStop = (nextChange ? nextChange.originalStart : this.originalLines.length);
			const modifiedStop = (nextChange ? nextChange.modifiedStart : this.modifiedLines.length);

			while (originalLineIndex < originalStop && modifiedLineIndex < modifiedStop) {
				const originalLine = this.originalLines[originalLineIndex];
				const modifiedLine = this.modifiedLines[modifiedLineIndex];

				if (originalLine !== modifiedLine) {
					// These lines differ only in trim whitespace

					// Check the leading whitespace
					{
						let originalStartColumn = getFirstNonBlankColumn(originalLine, 1);
						let modifiedStartColumn = getFirstNonBlankColumn(modifiedLine, 1);
						while (originalStartColumn > 1 && modifiedStartColumn > 1) {
							const originalChar = originalLine.charCodeAt(originalStartColumn - 2);
							const modifiedChar = modifiedLine.charCodeAt(modifiedStartColumn - 2);
							if (originalChar !== modifiedChar) {
								break;
							}
							originalStartColumn--;
							modifiedStartColumn--;
						}

						if (originalStartColumn > 1 || modifiedStartColumn > 1) {
							this._pushTrimWhitespaceCharChange(result,
								originalLineIndex + 1, 1, originalStartColumn,
								modifiedLineIndex + 1, 1, modifiedStartColumn
							);
						}
					}

					// Check the trailing whitespace
					{
						let originalEndColumn = getLastNonBlankColumn(originalLine, 1);
						let modifiedEndColumn = getLastNonBlankColumn(modifiedLine, 1);
						const originalMaxColumn = originalLine.length + 1;
						const modifiedMaxColumn = modifiedLine.length + 1;
						while (originalEndColumn < originalMaxColumn && modifiedEndColumn < modifiedMaxColumn) {
							const originalChar = originalLine.charCodeAt(originalEndColumn - 1);
							const modifiedChar = originalLine.charCodeAt(modifiedEndColumn - 1);
							if (originalChar !== modifiedChar) {
								break;
							}
							originalEndColumn++;
							modifiedEndColumn++;
						}

						if (originalEndColumn < originalMaxColumn || modifiedEndColumn < modifiedMaxColumn) {
							this._pushTrimWhitespaceCharChange(result,
								originalLineIndex + 1, originalEndColumn, originalMaxColumn,
								modifiedLineIndex + 1, modifiedEndColumn, modifiedMaxColumn
							);
						}
					}
				}
				originalLineIndex++;
				modifiedLineIndex++;
			}

			if (nextChange) {
				// Emit the actual change
				result.push(LineChange.createFromDiffResult(this.shouldIgnoreTrimWhitespace, nextChange, this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));

				originalLineIndex += nextChange.originalLength;
				modifiedLineIndex += nextChange.modifiedLength;
			}
		}

		return {
			quitEarly: quitEarly,
			changes: result
		};
	}

	private _pushTrimWhitespaceCharChange(
		result: LineChange[],
		originalLineNumber: number, originalStartColumn: number, originalEndColumn: number,
		modifiedLineNumber: number, modifiedStartColumn: number, modifiedEndColumn: number
	): void {
		if (this._mergeTrimWhitespaceCharChange(result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn)) {
			// Merged into previous
			return;
		}

		let charChanges: CharChange[] | undefined = undefined;
		if (this.shouldComputeCharChanges) {
			charChanges = [new CharChange(
				originalLineNumber, originalStartColumn, originalLineNumber, originalEndColumn,
				modifiedLineNumber, modifiedStartColumn, modifiedLineNumber, modifiedEndColumn
			)];
		}
		result.push(new LineChange(
			originalLineNumber, originalLineNumber,
			modifiedLineNumber, modifiedLineNumber,
			charChanges
		));
	}

	private _mergeTrimWhitespaceCharChange(
		result: LineChange[],
		originalLineNumber: number, originalStartColumn: number, originalEndColumn: number,
		modifiedLineNumber: number, modifiedStartColumn: number, modifiedEndColumn: number
	): boolean {
		const len = result.length;
		if (len === 0) {
			return false;
		}

		const prevChange = result[len - 1];

		if (prevChange.originalEndLineNumber === 0 || prevChange.modifiedEndLineNumber === 0) {
			// Don't merge with inserts/deletes
			return false;
		}

		if (prevChange.originalEndLineNumber === originalLineNumber && prevChange.modifiedEndLineNumber === modifiedLineNumber) {
			if (this.shouldComputeCharChanges && prevChange.charChanges) {
				prevChange.charChanges.push(new CharChange(
					originalLineNumber, originalStartColumn, originalLineNumber, originalEndColumn,
					modifiedLineNumber, modifiedStartColumn, modifiedLineNumber, modifiedEndColumn
				));
			}
			return true;
		}

		if (prevChange.originalEndLineNumber + 1 === originalLineNumber && prevChange.modifiedEndLineNumber + 1 === modifiedLineNumber) {
			prevChange.originalEndLineNumber = originalLineNumber;
			prevChange.modifiedEndLineNumber = modifiedLineNumber;
			if (this.shouldComputeCharChanges && prevChange.charChanges) {
				prevChange.charChanges.push(new CharChange(
					originalLineNumber, originalStartColumn, originalLineNumber, originalEndColumn,
					modifiedLineNumber, modifiedStartColumn, modifiedLineNumber, modifiedEndColumn
				));
			}
			return true;
		}

		return false;
	}
}

function getFirstNonBlankColumn(txt: string, defaultValue: number): number {
	const r = strings.firstNonWhitespaceIndex(txt);
	if (r === -1) {
		return defaultValue;
	}
	return r + 1;
}

function getLastNonBlankColumn(txt: string, defaultValue: number): number {
	const r = strings.lastNonWhitespaceIndex(txt);
	if (r === -1) {
		return defaultValue;
	}
	return r + 2;
}

function createContinueProcessingPredicate(maximumRuntime: number): () => boolean {
	if (maximumRuntime === 0) {
		return () => true;
	}

	const startTime = Date.now();
	return () => {
		return Date.now() - startTime < maximumRuntime;
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/diff/linesDiffComputer.ts]---
Location: vscode-main/src/vs/editor/common/diff/linesDiffComputer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DetailedLineRangeMapping, LineRangeMapping } from './rangeMapping.js';

export interface ILinesDiffComputer {
	computeDiff(originalLines: string[], modifiedLines: string[], options: ILinesDiffComputerOptions): LinesDiff;
}

export interface ILinesDiffComputerOptions {
	readonly ignoreTrimWhitespace: boolean;
	readonly maxComputationTimeMs: number;
	readonly computeMoves: boolean;
	readonly extendToSubwords?: boolean;
}

export class LinesDiff {
	constructor(
		readonly changes: readonly DetailedLineRangeMapping[],

		/**
		 * Sorted by original line ranges.
		 * The original line ranges and the modified line ranges must be disjoint (but can be touching).
		 */
		readonly moves: readonly MovedText[],

		/**
		 * Indicates if the time out was reached.
		 * In that case, the diffs might be an approximation and the user should be asked to rerun the diff with more time.
		 */
		readonly hitTimeout: boolean,
	) {
	}
}

export class MovedText {
	public readonly lineRangeMapping: LineRangeMapping;

	/**
	 * The diff from the original text to the moved text.
	 * Must be contained in the original/modified line range.
	 * Can be empty if the text didn't change (only moved).
	 */
	public readonly changes: readonly DetailedLineRangeMapping[];

	constructor(
		lineRangeMapping: LineRangeMapping,
		changes: readonly DetailedLineRangeMapping[],
	) {
		this.lineRangeMapping = lineRangeMapping;
		this.changes = changes;
	}

	public flip(): MovedText {
		return new MovedText(this.lineRangeMapping.flip(), this.changes.map(c => c.flip()));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/diff/linesDiffComputers.ts]---
Location: vscode-main/src/vs/editor/common/diff/linesDiffComputers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LegacyLinesDiffComputer } from './legacyLinesDiffComputer.js';
import { DefaultLinesDiffComputer } from './defaultLinesDiffComputer/defaultLinesDiffComputer.js';
import { ILinesDiffComputer } from './linesDiffComputer.js';

export const linesDiffComputers = {
	getLegacy: () => new LegacyLinesDiffComputer(),
	getDefault: () => new DefaultLinesDiffComputer(),
} satisfies Record<string, () => ILinesDiffComputer>;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/diff/rangeMapping.ts]---
Location: vscode-main/src/vs/editor/common/diff/rangeMapping.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { groupAdjacentBy } from '../../../base/common/arrays.js';
import { assertFn, checkAdjacentItems } from '../../../base/common/assert.js';
import { BugIndicatingError } from '../../../base/common/errors.js';
import { LineRange } from '../core/ranges/lineRange.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { TextReplacement, TextEdit } from '../core/edits/textEdit.js';
import { AbstractText } from '../core/text/abstractText.js';
import { IChange } from './legacyLinesDiffComputer.js';

/**
 * Maps a line range in the original text model to a line range in the modified text model.
 */
export class LineRangeMapping {
	public static inverse(mapping: readonly LineRangeMapping[], originalLineCount: number, modifiedLineCount: number): LineRangeMapping[] {
		const result: LineRangeMapping[] = [];
		let lastOriginalEndLineNumber = 1;
		let lastModifiedEndLineNumber = 1;

		for (const m of mapping) {
			const r = new LineRangeMapping(
				new LineRange(lastOriginalEndLineNumber, m.original.startLineNumber),
				new LineRange(lastModifiedEndLineNumber, m.modified.startLineNumber),
			);
			if (!r.modified.isEmpty) {
				result.push(r);
			}
			lastOriginalEndLineNumber = m.original.endLineNumberExclusive;
			lastModifiedEndLineNumber = m.modified.endLineNumberExclusive;
		}
		const r = new LineRangeMapping(
			new LineRange(lastOriginalEndLineNumber, originalLineCount + 1),
			new LineRange(lastModifiedEndLineNumber, modifiedLineCount + 1),
		);
		if (!r.modified.isEmpty) {
			result.push(r);
		}
		return result;
	}

	public static clip(mapping: readonly LineRangeMapping[], originalRange: LineRange, modifiedRange: LineRange): LineRangeMapping[] {
		const result: LineRangeMapping[] = [];
		for (const m of mapping) {
			const original = m.original.intersect(originalRange);
			const modified = m.modified.intersect(modifiedRange);
			if (original && !original.isEmpty && modified && !modified.isEmpty) {
				result.push(new LineRangeMapping(original, modified));
			}
		}
		return result;
	}

	/**
	 * The line range in the original text model.
	 */
	public readonly original: LineRange;

	/**
	 * The line range in the modified text model.
	 */
	public readonly modified: LineRange;

	constructor(
		originalRange: LineRange,
		modifiedRange: LineRange
	) {
		this.original = originalRange;
		this.modified = modifiedRange;
	}


	public toString(): string {
		return `{${this.original.toString()}->${this.modified.toString()}}`;
	}

	public flip(): LineRangeMapping {
		return new LineRangeMapping(this.modified, this.original);
	}

	public join(other: LineRangeMapping): LineRangeMapping {
		return new LineRangeMapping(
			this.original.join(other.original),
			this.modified.join(other.modified)
		);
	}

	public get changedLineCount() {
		return Math.max(this.original.length, this.modified.length);
	}

	/**
	 * This method assumes that the LineRangeMapping describes a valid diff!
	 * I.e. if one range is empty, the other range cannot be the entire document.
	 * It avoids various problems when the line range points to non-existing line-numbers.
	*/
	public toRangeMapping(): RangeMapping {
		const origInclusiveRange = this.original.toInclusiveRange();
		const modInclusiveRange = this.modified.toInclusiveRange();
		if (origInclusiveRange && modInclusiveRange) {
			return new RangeMapping(origInclusiveRange, modInclusiveRange);
		} else if (this.original.startLineNumber === 1 || this.modified.startLineNumber === 1) {
			if (!(this.modified.startLineNumber === 1 && this.original.startLineNumber === 1)) {
				// If one line range starts at 1, the other one must start at 1 as well.
				throw new BugIndicatingError('not a valid diff');
			}

			// Because one range is empty and both ranges start at line 1, none of the ranges can cover all lines.
			// Thus, `endLineNumberExclusive` is a valid line number.
			return new RangeMapping(
				new Range(this.original.startLineNumber, 1, this.original.endLineNumberExclusive, 1),
				new Range(this.modified.startLineNumber, 1, this.modified.endLineNumberExclusive, 1),
			);
		} else {
			// We can assume here that both startLineNumbers are greater than 1.
			return new RangeMapping(
				new Range(this.original.startLineNumber - 1, Number.MAX_SAFE_INTEGER, this.original.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER),
				new Range(this.modified.startLineNumber - 1, Number.MAX_SAFE_INTEGER, this.modified.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER),
			);
		}
	}

	/**
	 * This method assumes that the LineRangeMapping describes a valid diff!
	 * I.e. if one range is empty, the other range cannot be the entire document.
	 * It avoids various problems when the line range points to non-existing line-numbers.
	*/
	public toRangeMapping2(original: string[], modified: string[]): RangeMapping {
		if (isValidLineNumber(this.original.endLineNumberExclusive, original)
			&& isValidLineNumber(this.modified.endLineNumberExclusive, modified)) {
			return new RangeMapping(
				new Range(this.original.startLineNumber, 1, this.original.endLineNumberExclusive, 1),
				new Range(this.modified.startLineNumber, 1, this.modified.endLineNumberExclusive, 1),
			);
		}

		if (!this.original.isEmpty && !this.modified.isEmpty) {
			return new RangeMapping(
				Range.fromPositions(
					new Position(this.original.startLineNumber, 1),
					normalizePosition(new Position(this.original.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), original)
				),
				Range.fromPositions(
					new Position(this.modified.startLineNumber, 1),
					normalizePosition(new Position(this.modified.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), modified)
				),
			);
		}

		if (this.original.startLineNumber > 1 && this.modified.startLineNumber > 1) {
			return new RangeMapping(
				Range.fromPositions(
					normalizePosition(new Position(this.original.startLineNumber - 1, Number.MAX_SAFE_INTEGER), original),
					normalizePosition(new Position(this.original.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), original)
				),
				Range.fromPositions(
					normalizePosition(new Position(this.modified.startLineNumber - 1, Number.MAX_SAFE_INTEGER), modified),
					normalizePosition(new Position(this.modified.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), modified)
				),
			);
		}

		// Situation now: one range is empty and one range touches the last line and one range starts at line 1.
		// I don't think this can happen.

		throw new BugIndicatingError();
	}
}

function normalizePosition(position: Position, content: string[]): Position {
	if (position.lineNumber < 1) {
		return new Position(1, 1);
	}
	if (position.lineNumber > content.length) {
		return new Position(content.length, content[content.length - 1].length + 1);
	}
	const line = content[position.lineNumber - 1];
	if (position.column > line.length + 1) {
		return new Position(position.lineNumber, line.length + 1);
	}
	return position;
}

function isValidLineNumber(lineNumber: number, lines: string[]): boolean {
	return lineNumber >= 1 && lineNumber <= lines.length;
}

/**
 * Maps a line range in the original text model to a line range in the modified text model.
 * Also contains inner range mappings.
 */
export class DetailedLineRangeMapping extends LineRangeMapping {
	public static toTextEdit(mapping: readonly DetailedLineRangeMapping[], modified: AbstractText): TextEdit {
		const replacements: TextReplacement[] = [];
		for (const m of mapping) {
			for (const r of m.innerChanges ?? []) {
				const replacement = r.toTextEdit(modified);
				replacements.push(replacement);
			}
		}
		return new TextEdit(replacements);
	}

	public static fromRangeMappings(rangeMappings: RangeMapping[]): DetailedLineRangeMapping {
		const originalRange = LineRange.join(rangeMappings.map(r => LineRange.fromRangeInclusive(r.originalRange)));
		const modifiedRange = LineRange.join(rangeMappings.map(r => LineRange.fromRangeInclusive(r.modifiedRange)));
		return new DetailedLineRangeMapping(originalRange, modifiedRange, rangeMappings);
	}

	/**
	 * If inner changes have not been computed, this is set to undefined.
	 * Otherwise, it represents the character-level diff in this line range.
	 * The original range of each range mapping should be contained in the original line range (same for modified), exceptions are new-lines.
	 * Must not be an empty array.
	 */
	public readonly innerChanges: RangeMapping[] | undefined;

	constructor(
		originalRange: LineRange,
		modifiedRange: LineRange,
		innerChanges: RangeMapping[] | undefined
	) {
		super(originalRange, modifiedRange);
		this.innerChanges = innerChanges;
	}

	public override flip(): DetailedLineRangeMapping {
		return new DetailedLineRangeMapping(this.modified, this.original, this.innerChanges?.map(c => c.flip()));
	}

	public withInnerChangesFromLineRanges(): DetailedLineRangeMapping {
		return new DetailedLineRangeMapping(this.original, this.modified, [this.toRangeMapping()]);
	}
}

/**
 * Maps a range in the original text model to a range in the modified text model.
 */
export class RangeMapping {
	public static fromEdit(edit: TextEdit): RangeMapping[] {
		const newRanges = edit.getNewRanges();
		const result = edit.replacements.map((e, idx) => new RangeMapping(e.range, newRanges[idx]));
		return result;
	}

	public static fromEditJoin(edit: TextEdit): RangeMapping {
		const newRanges = edit.getNewRanges();
		const result = edit.replacements.map((e, idx) => new RangeMapping(e.range, newRanges[idx]));
		return RangeMapping.join(result);
	}

	public static join(rangeMappings: RangeMapping[]): RangeMapping {
		if (rangeMappings.length === 0) {
			throw new BugIndicatingError('Cannot join an empty list of range mappings');
		}
		let result = rangeMappings[0];
		for (let i = 1; i < rangeMappings.length; i++) {
			result = result.join(rangeMappings[i]);
		}
		return result;
	}

	public static assertSorted(rangeMappings: RangeMapping[]): void {
		for (let i = 1; i < rangeMappings.length; i++) {
			const previous = rangeMappings[i - 1];
			const current = rangeMappings[i];
			if (!(
				previous.originalRange.getEndPosition().isBeforeOrEqual(current.originalRange.getStartPosition())
				&& previous.modifiedRange.getEndPosition().isBeforeOrEqual(current.modifiedRange.getStartPosition())
			)) {
				throw new BugIndicatingError('Range mappings must be sorted');
			}
		}
	}

	/**
	 * The original range.
	 */
	readonly originalRange: Range;

	/**
	 * The modified range.
	 */
	readonly modifiedRange: Range;

	constructor(
		originalRange: Range,
		modifiedRange: Range
	) {
		this.originalRange = originalRange;
		this.modifiedRange = modifiedRange;
	}

	public toString(): string {
		return `{${this.originalRange.toString()}->${this.modifiedRange.toString()}}`;
	}

	public flip(): RangeMapping {
		return new RangeMapping(this.modifiedRange, this.originalRange);
	}

	/**
	 * Creates a single text edit that describes the change from the original to the modified text.
	*/
	public toTextEdit(modified: AbstractText): TextReplacement {
		const newText = modified.getValueOfRange(this.modifiedRange);
		return new TextReplacement(this.originalRange, newText);
	}

	public join(other: RangeMapping): RangeMapping {
		return new RangeMapping(
			this.originalRange.plusRange(other.originalRange),
			this.modifiedRange.plusRange(other.modifiedRange)
		);
	}
}

export function lineRangeMappingFromRangeMappings(alignments: readonly RangeMapping[], originalLines: AbstractText, modifiedLines: AbstractText, dontAssertStartLine: boolean = false): DetailedLineRangeMapping[] {
	const changes: DetailedLineRangeMapping[] = [];
	for (const g of groupAdjacentBy(
		alignments.map(a => getLineRangeMapping(a, originalLines, modifiedLines)),
		(a1, a2) =>
			a1.original.intersectsOrTouches(a2.original)
			|| a1.modified.intersectsOrTouches(a2.modified)
	)) {
		const first = g[0];
		const last = g[g.length - 1];

		changes.push(new DetailedLineRangeMapping(
			first.original.join(last.original),
			first.modified.join(last.modified),
			g.map(a => a.innerChanges![0]),
		));
	}

	assertFn(() => {
		if (!dontAssertStartLine && changes.length > 0) {
			if (changes[0].modified.startLineNumber !== changes[0].original.startLineNumber) {
				return false;
			}

			if (modifiedLines.length.lineCount - changes[changes.length - 1].modified.endLineNumberExclusive !== originalLines.length.lineCount - changes[changes.length - 1].original.endLineNumberExclusive) {
				return false;
			}
		}
		return checkAdjacentItems(changes,
			(m1, m2) => m2.original.startLineNumber - m1.original.endLineNumberExclusive === m2.modified.startLineNumber - m1.modified.endLineNumberExclusive &&
				// There has to be an unchanged line in between (otherwise both diffs should have been joined)
				m1.original.endLineNumberExclusive < m2.original.startLineNumber &&
				m1.modified.endLineNumberExclusive < m2.modified.startLineNumber,
		);
	});

	return changes;
}

export function getLineRangeMapping(rangeMapping: RangeMapping, originalLines: AbstractText, modifiedLines: AbstractText): DetailedLineRangeMapping {
	let lineStartDelta = 0;
	let lineEndDelta = 0;

	// rangeMapping describes the edit that replaces `rangeMapping.originalRange` with `newText := getText(modifiedLines, rangeMapping.modifiedRange)`.

	// original: ]xxx \n <- this line is not modified
	// modified: ]xx  \n
	if (rangeMapping.modifiedRange.endColumn === 1 && rangeMapping.originalRange.endColumn === 1
		&& rangeMapping.originalRange.startLineNumber + lineStartDelta <= rangeMapping.originalRange.endLineNumber
		&& rangeMapping.modifiedRange.startLineNumber + lineStartDelta <= rangeMapping.modifiedRange.endLineNumber) {
		// We can only do this if the range is not empty yet
		lineEndDelta = -1;
	}

	// original: xxx[ \n <- this line is not modified
	// modified: xxx[ \n
	if (rangeMapping.modifiedRange.startColumn - 1 >= modifiedLines.getLineLength(rangeMapping.modifiedRange.startLineNumber)
		&& rangeMapping.originalRange.startColumn - 1 >= originalLines.getLineLength(rangeMapping.originalRange.startLineNumber)
		&& rangeMapping.originalRange.startLineNumber <= rangeMapping.originalRange.endLineNumber + lineEndDelta
		&& rangeMapping.modifiedRange.startLineNumber <= rangeMapping.modifiedRange.endLineNumber + lineEndDelta) {
		// We can only do this if the range is not empty yet
		lineStartDelta = 1;
	}

	const originalLineRange = new LineRange(
		rangeMapping.originalRange.startLineNumber + lineStartDelta,
		rangeMapping.originalRange.endLineNumber + 1 + lineEndDelta
	);
	const modifiedLineRange = new LineRange(
		rangeMapping.modifiedRange.startLineNumber + lineStartDelta,
		rangeMapping.modifiedRange.endLineNumber + 1 + lineEndDelta
	);

	return new DetailedLineRangeMapping(originalLineRange, modifiedLineRange, [rangeMapping]);
}

export function lineRangeMappingFromChange(change: IChange): LineRangeMapping {
	let originalRange: LineRange;
	if (change.originalEndLineNumber === 0) {
		// Insertion
		originalRange = new LineRange(change.originalStartLineNumber + 1, change.originalStartLineNumber + 1);
	} else {
		originalRange = new LineRange(change.originalStartLineNumber, change.originalEndLineNumber + 1);
	}

	let modifiedRange: LineRange;
	if (change.modifiedEndLineNumber === 0) {
		// Deletion
		modifiedRange = new LineRange(change.modifiedStartLineNumber + 1, change.modifiedStartLineNumber + 1);
	} else {
		modifiedRange = new LineRange(change.modifiedStartLineNumber, change.modifiedEndLineNumber + 1);
	}

	return new LineRangeMapping(originalRange, modifiedRange);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/diff/defaultLinesDiffComputer/computeMovedLines.ts]---
Location: vscode-main/src/vs/editor/common/diff/defaultLinesDiffComputer/computeMovedLines.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITimeout, SequenceDiff } from './algorithms/diffAlgorithm.js';
import { DetailedLineRangeMapping, LineRangeMapping } from '../rangeMapping.js';
import { pushMany, compareBy, numberComparator, reverseOrder } from '../../../../base/common/arrays.js';
import { MonotonousArray, findLastMonotonous } from '../../../../base/common/arraysFind.js';
import { SetMap } from '../../../../base/common/map.js';
import { LineRange, LineRangeSet } from '../../core/ranges/lineRange.js';
import { LinesSliceCharSequence } from './linesSliceCharSequence.js';
import { LineRangeFragment, isSpace } from './utils.js';
import { MyersDiffAlgorithm } from './algorithms/myersDiffAlgorithm.js';
import { Range } from '../../core/range.js';

export function computeMovedLines(
	changes: DetailedLineRangeMapping[],
	originalLines: string[],
	modifiedLines: string[],
	hashedOriginalLines: number[],
	hashedModifiedLines: number[],
	timeout: ITimeout
): LineRangeMapping[] {
	let { moves, excludedChanges } = computeMovesFromSimpleDeletionsToSimpleInsertions(changes, originalLines, modifiedLines, timeout);

	if (!timeout.isValid()) { return []; }

	const filteredChanges = changes.filter(c => !excludedChanges.has(c));
	const unchangedMoves = computeUnchangedMoves(filteredChanges, hashedOriginalLines, hashedModifiedLines, originalLines, modifiedLines, timeout);
	pushMany(moves, unchangedMoves);

	moves = joinCloseConsecutiveMoves(moves);
	// Ignore too short moves
	moves = moves.filter(current => {
		const lines = current.original.toOffsetRange().slice(originalLines).map(l => l.trim());
		const originalText = lines.join('\n');
		return originalText.length >= 15 && countWhere(lines, l => l.length >= 2) >= 2;
	});
	moves = removeMovesInSameDiff(changes, moves);

	return moves;
}

function countWhere<T>(arr: T[], predicate: (t: T) => boolean): number {
	let count = 0;
	for (const t of arr) {
		if (predicate(t)) {
			count++;
		}
	}
	return count;
}

function computeMovesFromSimpleDeletionsToSimpleInsertions(
	changes: DetailedLineRangeMapping[],
	originalLines: string[],
	modifiedLines: string[],
	timeout: ITimeout,
) {
	const moves: LineRangeMapping[] = [];

	const deletions = changes
		.filter(c => c.modified.isEmpty && c.original.length >= 3)
		.map(d => new LineRangeFragment(d.original, originalLines, d));
	const insertions = new Set(changes
		.filter(c => c.original.isEmpty && c.modified.length >= 3)
		.map(d => new LineRangeFragment(d.modified, modifiedLines, d)));

	const excludedChanges = new Set<DetailedLineRangeMapping>();

	for (const deletion of deletions) {
		let highestSimilarity = -1;
		let best: LineRangeFragment | undefined;
		for (const insertion of insertions) {
			const similarity = deletion.computeSimilarity(insertion);
			if (similarity > highestSimilarity) {
				highestSimilarity = similarity;
				best = insertion;
			}
		}

		if (highestSimilarity > 0.90 && best) {
			insertions.delete(best);
			moves.push(new LineRangeMapping(deletion.range, best.range));
			excludedChanges.add(deletion.source);
			excludedChanges.add(best.source);
		}

		if (!timeout.isValid()) {
			return { moves, excludedChanges };
		}
	}

	return { moves, excludedChanges };
}

function computeUnchangedMoves(
	changes: DetailedLineRangeMapping[],
	hashedOriginalLines: number[],
	hashedModifiedLines: number[],
	originalLines: string[],
	modifiedLines: string[],
	timeout: ITimeout,
) {
	const moves: LineRangeMapping[] = [];

	const original3LineHashes = new SetMap<string, { range: LineRange }>();

	for (const change of changes) {
		for (let i = change.original.startLineNumber; i < change.original.endLineNumberExclusive - 2; i++) {
			const key = `${hashedOriginalLines[i - 1]}:${hashedOriginalLines[i + 1 - 1]}:${hashedOriginalLines[i + 2 - 1]}`;
			original3LineHashes.add(key, { range: new LineRange(i, i + 3) });
		}
	}

	interface PossibleMapping {
		modifiedLineRange: LineRange;
		originalLineRange: LineRange;
	}

	const possibleMappings: PossibleMapping[] = [];

	changes.sort(compareBy(c => c.modified.startLineNumber, numberComparator));

	for (const change of changes) {
		let lastMappings: PossibleMapping[] = [];
		for (let i = change.modified.startLineNumber; i < change.modified.endLineNumberExclusive - 2; i++) {
			const key = `${hashedModifiedLines[i - 1]}:${hashedModifiedLines[i + 1 - 1]}:${hashedModifiedLines[i + 2 - 1]}`;
			const currentModifiedRange = new LineRange(i, i + 3);

			const nextMappings: PossibleMapping[] = [];
			original3LineHashes.forEach(key, ({ range }) => {
				for (const lastMapping of lastMappings) {
					// does this match extend some last match?
					if (lastMapping.originalLineRange.endLineNumberExclusive + 1 === range.endLineNumberExclusive &&
						lastMapping.modifiedLineRange.endLineNumberExclusive + 1 === currentModifiedRange.endLineNumberExclusive) {
						lastMapping.originalLineRange = new LineRange(lastMapping.originalLineRange.startLineNumber, range.endLineNumberExclusive);
						lastMapping.modifiedLineRange = new LineRange(lastMapping.modifiedLineRange.startLineNumber, currentModifiedRange.endLineNumberExclusive);
						nextMappings.push(lastMapping);
						return;
					}
				}

				const mapping: PossibleMapping = {
					modifiedLineRange: currentModifiedRange,
					originalLineRange: range,
				};
				possibleMappings.push(mapping);
				nextMappings.push(mapping);
			});
			lastMappings = nextMappings;
		}

		if (!timeout.isValid()) {
			return [];
		}
	}

	possibleMappings.sort(reverseOrder(compareBy(m => m.modifiedLineRange.length, numberComparator)));

	const modifiedSet = new LineRangeSet();
	const originalSet = new LineRangeSet();

	for (const mapping of possibleMappings) {

		const diffOrigToMod = mapping.modifiedLineRange.startLineNumber - mapping.originalLineRange.startLineNumber;
		const modifiedSections = modifiedSet.subtractFrom(mapping.modifiedLineRange);
		const originalTranslatedSections = originalSet.subtractFrom(mapping.originalLineRange).getWithDelta(diffOrigToMod);

		const modifiedIntersectedSections = modifiedSections.getIntersection(originalTranslatedSections);

		for (const s of modifiedIntersectedSections.ranges) {
			if (s.length < 3) {
				continue;
			}
			const modifiedLineRange = s;
			const originalLineRange = s.delta(-diffOrigToMod);

			moves.push(new LineRangeMapping(originalLineRange, modifiedLineRange));

			modifiedSet.addRange(modifiedLineRange);
			originalSet.addRange(originalLineRange);
		}
	}

	moves.sort(compareBy(m => m.original.startLineNumber, numberComparator));

	const monotonousChanges = new MonotonousArray(changes);
	for (let i = 0; i < moves.length; i++) {
		const move = moves[i];
		const firstTouchingChangeOrig = monotonousChanges.findLastMonotonous(c => c.original.startLineNumber <= move.original.startLineNumber)!;
		const firstTouchingChangeMod = findLastMonotonous(changes, c => c.modified.startLineNumber <= move.modified.startLineNumber)!;
		const linesAbove = Math.max(
			move.original.startLineNumber - firstTouchingChangeOrig.original.startLineNumber,
			move.modified.startLineNumber - firstTouchingChangeMod.modified.startLineNumber
		);

		const lastTouchingChangeOrig = monotonousChanges.findLastMonotonous(c => c.original.startLineNumber < move.original.endLineNumberExclusive)!;
		const lastTouchingChangeMod = findLastMonotonous(changes, c => c.modified.startLineNumber < move.modified.endLineNumberExclusive)!;
		const linesBelow = Math.max(
			lastTouchingChangeOrig.original.endLineNumberExclusive - move.original.endLineNumberExclusive,
			lastTouchingChangeMod.modified.endLineNumberExclusive - move.modified.endLineNumberExclusive
		);

		let extendToTop: number;
		for (extendToTop = 0; extendToTop < linesAbove; extendToTop++) {
			const origLine = move.original.startLineNumber - extendToTop - 1;
			const modLine = move.modified.startLineNumber - extendToTop - 1;
			if (origLine > originalLines.length || modLine > modifiedLines.length) {
				break;
			}
			if (modifiedSet.contains(modLine) || originalSet.contains(origLine)) {
				break;
			}
			if (!areLinesSimilar(originalLines[origLine - 1], modifiedLines[modLine - 1], timeout)) {
				break;
			}
		}

		if (extendToTop > 0) {
			originalSet.addRange(new LineRange(move.original.startLineNumber - extendToTop, move.original.startLineNumber));
			modifiedSet.addRange(new LineRange(move.modified.startLineNumber - extendToTop, move.modified.startLineNumber));
		}

		let extendToBottom: number;
		for (extendToBottom = 0; extendToBottom < linesBelow; extendToBottom++) {
			const origLine = move.original.endLineNumberExclusive + extendToBottom;
			const modLine = move.modified.endLineNumberExclusive + extendToBottom;
			if (origLine > originalLines.length || modLine > modifiedLines.length) {
				break;
			}
			if (modifiedSet.contains(modLine) || originalSet.contains(origLine)) {
				break;
			}
			if (!areLinesSimilar(originalLines[origLine - 1], modifiedLines[modLine - 1], timeout)) {
				break;
			}
		}

		if (extendToBottom > 0) {
			originalSet.addRange(new LineRange(move.original.endLineNumberExclusive, move.original.endLineNumberExclusive + extendToBottom));
			modifiedSet.addRange(new LineRange(move.modified.endLineNumberExclusive, move.modified.endLineNumberExclusive + extendToBottom));
		}

		if (extendToTop > 0 || extendToBottom > 0) {
			moves[i] = new LineRangeMapping(
				new LineRange(move.original.startLineNumber - extendToTop, move.original.endLineNumberExclusive + extendToBottom),
				new LineRange(move.modified.startLineNumber - extendToTop, move.modified.endLineNumberExclusive + extendToBottom),
			);
		}
	}

	return moves;
}

function areLinesSimilar(line1: string, line2: string, timeout: ITimeout): boolean {
	if (line1.trim() === line2.trim()) { return true; }
	if (line1.length > 300 && line2.length > 300) { return false; }

	const myersDiffingAlgorithm = new MyersDiffAlgorithm();
	const result = myersDiffingAlgorithm.compute(
		new LinesSliceCharSequence([line1], new Range(1, 1, 1, line1.length), false),
		new LinesSliceCharSequence([line2], new Range(1, 1, 1, line2.length), false),
		timeout
	);
	let commonNonSpaceCharCount = 0;
	const inverted = SequenceDiff.invert(result.diffs, line1.length);
	for (const seq of inverted) {
		seq.seq1Range.forEach(idx => {
			if (!isSpace(line1.charCodeAt(idx))) {
				commonNonSpaceCharCount++;
			}
		});
	}

	function countNonWsChars(str: string): number {
		let count = 0;
		for (let i = 0; i < line1.length; i++) {
			if (!isSpace(str.charCodeAt(i))) {
				count++;
			}
		}
		return count;
	}

	const longerLineLength = countNonWsChars(line1.length > line2.length ? line1 : line2);
	const r = commonNonSpaceCharCount / longerLineLength > 0.6 && longerLineLength > 10;
	return r;
}

function joinCloseConsecutiveMoves(moves: LineRangeMapping[]): LineRangeMapping[] {
	if (moves.length === 0) {
		return moves;
	}

	moves.sort(compareBy(m => m.original.startLineNumber, numberComparator));

	const result = [moves[0]];
	for (let i = 1; i < moves.length; i++) {
		const last = result[result.length - 1];
		const current = moves[i];

		const originalDist = current.original.startLineNumber - last.original.endLineNumberExclusive;
		const modifiedDist = current.modified.startLineNumber - last.modified.endLineNumberExclusive;
		const currentMoveAfterLast = originalDist >= 0 && modifiedDist >= 0;

		if (currentMoveAfterLast && originalDist + modifiedDist <= 2) {
			result[result.length - 1] = last.join(current);
			continue;
		}

		result.push(current);
	}
	return result;
}

function removeMovesInSameDiff(changes: DetailedLineRangeMapping[], moves: LineRangeMapping[]) {
	const changesMonotonous = new MonotonousArray(changes);
	moves = moves.filter(m => {
		const diffBeforeEndOfMoveOriginal = changesMonotonous.findLastMonotonous(c => c.original.startLineNumber < m.original.endLineNumberExclusive)
			|| new LineRangeMapping(new LineRange(1, 1), new LineRange(1, 1));
		const diffBeforeEndOfMoveModified = findLastMonotonous(changes, c => c.modified.startLineNumber < m.modified.endLineNumberExclusive);

		const differentDiffs = diffBeforeEndOfMoveOriginal !== diffBeforeEndOfMoveModified;
		return differentDiffs;
	});
	return moves;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/diff/defaultLinesDiffComputer/defaultLinesDiffComputer.ts]---
Location: vscode-main/src/vs/editor/common/diff/defaultLinesDiffComputer/defaultLinesDiffComputer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals } from '../../../../base/common/arrays.js';
import { assertFn } from '../../../../base/common/assert.js';
import { LineRange } from '../../core/ranges/lineRange.js';
import { OffsetRange } from '../../core/ranges/offsetRange.js';
import { Position } from '../../core/position.js';
import { Range } from '../../core/range.js';
import { ArrayText } from '../../core/text/abstractText.js';
import { ILinesDiffComputer, ILinesDiffComputerOptions, LinesDiff, MovedText } from '../linesDiffComputer.js';
import { DetailedLineRangeMapping, LineRangeMapping, lineRangeMappingFromRangeMappings, RangeMapping } from '../rangeMapping.js';
import { DateTimeout, InfiniteTimeout, ITimeout, SequenceDiff } from './algorithms/diffAlgorithm.js';
import { DynamicProgrammingDiffing } from './algorithms/dynamicProgrammingDiffing.js';
import { MyersDiffAlgorithm } from './algorithms/myersDiffAlgorithm.js';
import { computeMovedLines } from './computeMovedLines.js';
import { extendDiffsToEntireWordIfAppropriate, optimizeSequenceDiffs, removeShortMatches, removeVeryShortMatchingLinesBetweenDiffs, removeVeryShortMatchingTextBetweenLongDiffs } from './heuristicSequenceOptimizations.js';
import { LineSequence } from './lineSequence.js';
import { LinesSliceCharSequence } from './linesSliceCharSequence.js';

export class DefaultLinesDiffComputer implements ILinesDiffComputer {
	private readonly dynamicProgrammingDiffing = new DynamicProgrammingDiffing();
	private readonly myersDiffingAlgorithm = new MyersDiffAlgorithm();

	computeDiff(originalLines: string[], modifiedLines: string[], options: ILinesDiffComputerOptions): LinesDiff {
		if (originalLines.length <= 1 && equals(originalLines, modifiedLines, (a, b) => a === b)) {
			return new LinesDiff([], [], false);
		}

		if (originalLines.length === 1 && originalLines[0].length === 0 || modifiedLines.length === 1 && modifiedLines[0].length === 0) {
			return new LinesDiff([
				new DetailedLineRangeMapping(
					new LineRange(1, originalLines.length + 1),
					new LineRange(1, modifiedLines.length + 1),
					[
						new RangeMapping(
							new Range(1, 1, originalLines.length, originalLines[originalLines.length - 1].length + 1),
							new Range(1, 1, modifiedLines.length, modifiedLines[modifiedLines.length - 1].length + 1),
						)
					]
				)
			], [], false);
		}

		const timeout = options.maxComputationTimeMs === 0 ? InfiniteTimeout.instance : new DateTimeout(options.maxComputationTimeMs);
		const considerWhitespaceChanges = !options.ignoreTrimWhitespace;

		const perfectHashes = new Map<string, number>();
		function getOrCreateHash(text: string): number {
			let hash = perfectHashes.get(text);
			if (hash === undefined) {
				hash = perfectHashes.size;
				perfectHashes.set(text, hash);
			}
			return hash;
		}

		const originalLinesHashes = originalLines.map((l) => getOrCreateHash(l.trim()));
		const modifiedLinesHashes = modifiedLines.map((l) => getOrCreateHash(l.trim()));

		const sequence1 = new LineSequence(originalLinesHashes, originalLines);
		const sequence2 = new LineSequence(modifiedLinesHashes, modifiedLines);

		const lineAlignmentResult = (() => {
			if (sequence1.length + sequence2.length < 1700) {
				// Use the improved algorithm for small files
				return this.dynamicProgrammingDiffing.compute(
					sequence1,
					sequence2,
					timeout,
					(offset1, offset2) =>
						originalLines[offset1] === modifiedLines[offset2]
							? modifiedLines[offset2].length === 0
								? 0.1
								: 1 + Math.log(1 + modifiedLines[offset2].length)
							: 0.99
				);
			}

			return this.myersDiffingAlgorithm.compute(
				sequence1,
				sequence2,
				timeout
			);
		})();

		let lineAlignments = lineAlignmentResult.diffs;
		let hitTimeout = lineAlignmentResult.hitTimeout;
		lineAlignments = optimizeSequenceDiffs(sequence1, sequence2, lineAlignments);
		lineAlignments = removeVeryShortMatchingLinesBetweenDiffs(sequence1, sequence2, lineAlignments);

		const alignments: RangeMapping[] = [];

		const scanForWhitespaceChanges = (equalLinesCount: number) => {
			if (!considerWhitespaceChanges) {
				return;
			}

			for (let i = 0; i < equalLinesCount; i++) {
				const seq1Offset = seq1LastStart + i;
				const seq2Offset = seq2LastStart + i;
				if (originalLines[seq1Offset] !== modifiedLines[seq2Offset]) {
					// This is because of whitespace changes, diff these lines
					const characterDiffs = this.refineDiff(originalLines, modifiedLines, new SequenceDiff(
						new OffsetRange(seq1Offset, seq1Offset + 1),
						new OffsetRange(seq2Offset, seq2Offset + 1),
					), timeout, considerWhitespaceChanges, options);
					for (const a of characterDiffs.mappings) {
						alignments.push(a);
					}
					if (characterDiffs.hitTimeout) {
						hitTimeout = true;
					}
				}
			}
		};

		let seq1LastStart = 0;
		let seq2LastStart = 0;

		for (const diff of lineAlignments) {
			assertFn(() => diff.seq1Range.start - seq1LastStart === diff.seq2Range.start - seq2LastStart);

			const equalLinesCount = diff.seq1Range.start - seq1LastStart;

			scanForWhitespaceChanges(equalLinesCount);

			seq1LastStart = diff.seq1Range.endExclusive;
			seq2LastStart = diff.seq2Range.endExclusive;

			const characterDiffs = this.refineDiff(originalLines, modifiedLines, diff, timeout, considerWhitespaceChanges, options);
			if (characterDiffs.hitTimeout) {
				hitTimeout = true;
			}
			for (const a of characterDiffs.mappings) {
				alignments.push(a);
			}
		}

		scanForWhitespaceChanges(originalLines.length - seq1LastStart);

		const original = new ArrayText(originalLines);
		const modified = new ArrayText(modifiedLines);

		const changes = lineRangeMappingFromRangeMappings(alignments, original, modified);

		let moves: MovedText[] = [];
		if (options.computeMoves) {
			moves = this.computeMoves(changes, originalLines, modifiedLines, originalLinesHashes, modifiedLinesHashes, timeout, considerWhitespaceChanges, options);
		}

		// Make sure all ranges are valid
		assertFn(() => {
			function validatePosition(pos: Position, lines: string[]): boolean {
				if (pos.lineNumber < 1 || pos.lineNumber > lines.length) { return false; }
				const line = lines[pos.lineNumber - 1];
				if (pos.column < 1 || pos.column > line.length + 1) { return false; }
				return true;
			}

			function validateRange(range: LineRange, lines: string[]): boolean {
				if (range.startLineNumber < 1 || range.startLineNumber > lines.length + 1) { return false; }
				if (range.endLineNumberExclusive < 1 || range.endLineNumberExclusive > lines.length + 1) { return false; }
				return true;
			}

			for (const c of changes) {
				if (!c.innerChanges) { return false; }
				for (const ic of c.innerChanges) {
					const valid = validatePosition(ic.modifiedRange.getStartPosition(), modifiedLines) && validatePosition(ic.modifiedRange.getEndPosition(), modifiedLines) &&
						validatePosition(ic.originalRange.getStartPosition(), originalLines) && validatePosition(ic.originalRange.getEndPosition(), originalLines);
					if (!valid) {
						return false;
					}
				}
				if (!validateRange(c.modified, modifiedLines) || !validateRange(c.original, originalLines)) {
					return false;
				}
			}
			return true;
		});

		return new LinesDiff(changes, moves, hitTimeout);
	}

	private computeMoves(
		changes: DetailedLineRangeMapping[],
		originalLines: string[],
		modifiedLines: string[],
		hashedOriginalLines: number[],
		hashedModifiedLines: number[],
		timeout: ITimeout,
		considerWhitespaceChanges: boolean,
		options: ILinesDiffComputerOptions,
	): MovedText[] {
		const moves = computeMovedLines(
			changes,
			originalLines,
			modifiedLines,
			hashedOriginalLines,
			hashedModifiedLines,
			timeout,
		);
		const movesWithDiffs = moves.map(m => {
			const moveChanges = this.refineDiff(originalLines, modifiedLines, new SequenceDiff(
				m.original.toOffsetRange(),
				m.modified.toOffsetRange(),
			), timeout, considerWhitespaceChanges, options);
			const mappings = lineRangeMappingFromRangeMappings(moveChanges.mappings, new ArrayText(originalLines), new ArrayText(modifiedLines), true);
			return new MovedText(m, mappings);
		});
		return movesWithDiffs;
	}

	private refineDiff(originalLines: string[], modifiedLines: string[], diff: SequenceDiff, timeout: ITimeout, considerWhitespaceChanges: boolean, options: ILinesDiffComputerOptions): { mappings: RangeMapping[]; hitTimeout: boolean } {
		const lineRangeMapping = toLineRangeMapping(diff);
		const rangeMapping = lineRangeMapping.toRangeMapping2(originalLines, modifiedLines);

		const slice1 = new LinesSliceCharSequence(originalLines, rangeMapping.originalRange, considerWhitespaceChanges);
		const slice2 = new LinesSliceCharSequence(modifiedLines, rangeMapping.modifiedRange, considerWhitespaceChanges);

		const diffResult = slice1.length + slice2.length < 500
			? this.dynamicProgrammingDiffing.compute(slice1, slice2, timeout)
			: this.myersDiffingAlgorithm.compute(slice1, slice2, timeout);

		const check = false;

		let diffs = diffResult.diffs;
		if (check) { SequenceDiff.assertSorted(diffs); }
		diffs = optimizeSequenceDiffs(slice1, slice2, diffs);
		if (check) { SequenceDiff.assertSorted(diffs); }
		diffs = extendDiffsToEntireWordIfAppropriate(slice1, slice2, diffs, (seq, idx) => seq.findWordContaining(idx));
		if (check) { SequenceDiff.assertSorted(diffs); }

		if (options.extendToSubwords) {
			diffs = extendDiffsToEntireWordIfAppropriate(slice1, slice2, diffs, (seq, idx) => seq.findSubWordContaining(idx), true);
			if (check) { SequenceDiff.assertSorted(diffs); }
		}

		diffs = removeShortMatches(slice1, slice2, diffs);
		if (check) { SequenceDiff.assertSorted(diffs); }
		diffs = removeVeryShortMatchingTextBetweenLongDiffs(slice1, slice2, diffs);
		if (check) { SequenceDiff.assertSorted(diffs); }

		const result = diffs.map(
			(d) =>
				new RangeMapping(
					slice1.translateRange(d.seq1Range),
					slice2.translateRange(d.seq2Range)
				)
		);

		if (check) { RangeMapping.assertSorted(result); }

		// Assert: result applied on original should be the same as diff applied to original

		return {
			mappings: result,
			hitTimeout: diffResult.hitTimeout,
		};
	}
}

function toLineRangeMapping(sequenceDiff: SequenceDiff) {
	return new LineRangeMapping(
		new LineRange(sequenceDiff.seq1Range.start + 1, sequenceDiff.seq1Range.endExclusive + 1),
		new LineRange(sequenceDiff.seq2Range.start + 1, sequenceDiff.seq2Range.endExclusive + 1),
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/diff/defaultLinesDiffComputer/heuristicSequenceOptimizations.ts]---
Location: vscode-main/src/vs/editor/common/diff/defaultLinesDiffComputer/heuristicSequenceOptimizations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { forEachWithNeighbors } from '../../../../base/common/arrays.js';
import { OffsetRange } from '../../core/ranges/offsetRange.js';
import { ISequence, OffsetPair, SequenceDiff } from './algorithms/diffAlgorithm.js';
import { LineSequence } from './lineSequence.js';
import { LinesSliceCharSequence } from './linesSliceCharSequence.js';

export function optimizeSequenceDiffs(sequence1: ISequence, sequence2: ISequence, sequenceDiffs: SequenceDiff[]): SequenceDiff[] {
	let result = sequenceDiffs;
	result = joinSequenceDiffsByShifting(sequence1, sequence2, result);
	// Sometimes, calling this function twice improves the result.
	// Uncomment the second invocation and run the tests to see the difference.
	result = joinSequenceDiffsByShifting(sequence1, sequence2, result);
	result = shiftSequenceDiffs(sequence1, sequence2, result);
	return result;
}

/**
 * This function fixes issues like this:
 * ```
 * import { Baz, Bar } from "foo";
 * ```
 * <->
 * ```
 * import { Baz, Bar, Foo } from "foo";
 * ```
 * Computed diff: [ {Add "," after Bar}, {Add "Foo " after space} }
 * Improved diff: [{Add ", Foo" after Bar}]
 */
function joinSequenceDiffsByShifting(sequence1: ISequence, sequence2: ISequence, sequenceDiffs: SequenceDiff[]): SequenceDiff[] {
	if (sequenceDiffs.length === 0) {
		return sequenceDiffs;
	}

	const result: SequenceDiff[] = [];
	result.push(sequenceDiffs[0]);

	// First move them all to the left as much as possible and join them if possible
	for (let i = 1; i < sequenceDiffs.length; i++) {
		const prevResult = result[result.length - 1];
		let cur = sequenceDiffs[i];

		if (cur.seq1Range.isEmpty || cur.seq2Range.isEmpty) {
			const length = cur.seq1Range.start - prevResult.seq1Range.endExclusive;
			let d;
			for (d = 1; d <= length; d++) {
				if (
					sequence1.getElement(cur.seq1Range.start - d) !== sequence1.getElement(cur.seq1Range.endExclusive - d) ||
					sequence2.getElement(cur.seq2Range.start - d) !== sequence2.getElement(cur.seq2Range.endExclusive - d)) {
					break;
				}
			}
			d--;

			if (d === length) {
				// Merge previous and current diff
				result[result.length - 1] = new SequenceDiff(
					new OffsetRange(prevResult.seq1Range.start, cur.seq1Range.endExclusive - length),
					new OffsetRange(prevResult.seq2Range.start, cur.seq2Range.endExclusive - length),
				);
				continue;
			}

			cur = cur.delta(-d);
		}

		result.push(cur);
	}

	const result2: SequenceDiff[] = [];
	// Then move them all to the right and join them again if possible
	for (let i = 0; i < result.length - 1; i++) {
		const nextResult = result[i + 1];
		let cur = result[i];

		if (cur.seq1Range.isEmpty || cur.seq2Range.isEmpty) {
			const length = nextResult.seq1Range.start - cur.seq1Range.endExclusive;
			let d;
			for (d = 0; d < length; d++) {
				if (
					!sequence1.isStronglyEqual(cur.seq1Range.start + d, cur.seq1Range.endExclusive + d) ||
					!sequence2.isStronglyEqual(cur.seq2Range.start + d, cur.seq2Range.endExclusive + d)
				) {
					break;
				}
			}

			if (d === length) {
				// Merge previous and current diff, write to result!
				result[i + 1] = new SequenceDiff(
					new OffsetRange(cur.seq1Range.start + length, nextResult.seq1Range.endExclusive),
					new OffsetRange(cur.seq2Range.start + length, nextResult.seq2Range.endExclusive),
				);
				continue;
			}

			if (d > 0) {
				cur = cur.delta(d);
			}
		}

		result2.push(cur);
	}

	if (result.length > 0) {
		result2.push(result[result.length - 1]);
	}

	return result2;
}

// align character level diffs at whitespace characters
// import { IBar } from "foo";
// import { I[Arr, I]Bar } from "foo";
// ->
// import { [IArr, ]IBar } from "foo";

// import { ITransaction, observableValue, transaction } from 'vs/base/common/observable';
// import { ITransaction, observable[FromEvent, observable]Value, transaction } from 'vs/base/common/observable';
// ->
// import { ITransaction, [observableFromEvent, ]observableValue, transaction } from 'vs/base/common/observable';

// collectBrackets(level + 1, levelPerBracketType);
// collectBrackets(level + 1, levelPerBracket[ + 1, levelPerBracket]Type);
// ->
// collectBrackets(level + 1, [levelPerBracket + 1, ]levelPerBracketType);

function shiftSequenceDiffs(sequence1: ISequence, sequence2: ISequence, sequenceDiffs: SequenceDiff[]): SequenceDiff[] {
	if (!sequence1.getBoundaryScore || !sequence2.getBoundaryScore) {
		return sequenceDiffs;
	}

	for (let i = 0; i < sequenceDiffs.length; i++) {
		const prevDiff = (i > 0 ? sequenceDiffs[i - 1] : undefined);
		const diff = sequenceDiffs[i];
		const nextDiff = (i + 1 < sequenceDiffs.length ? sequenceDiffs[i + 1] : undefined);

		const seq1ValidRange = new OffsetRange(prevDiff ? prevDiff.seq1Range.endExclusive + 1 : 0, nextDiff ? nextDiff.seq1Range.start - 1 : sequence1.length);
		const seq2ValidRange = new OffsetRange(prevDiff ? prevDiff.seq2Range.endExclusive + 1 : 0, nextDiff ? nextDiff.seq2Range.start - 1 : sequence2.length);

		if (diff.seq1Range.isEmpty) {
			sequenceDiffs[i] = shiftDiffToBetterPosition(diff, sequence1, sequence2, seq1ValidRange, seq2ValidRange);
		} else if (diff.seq2Range.isEmpty) {
			sequenceDiffs[i] = shiftDiffToBetterPosition(diff.swap(), sequence2, sequence1, seq2ValidRange, seq1ValidRange).swap();
		}
	}

	return sequenceDiffs;
}

function shiftDiffToBetterPosition(diff: SequenceDiff, sequence1: ISequence, sequence2: ISequence, seq1ValidRange: OffsetRange, seq2ValidRange: OffsetRange,) {
	const maxShiftLimit = 100; // To prevent performance issues

	// don't touch previous or next!
	let deltaBefore = 1;
	while (
		diff.seq1Range.start - deltaBefore >= seq1ValidRange.start &&
		diff.seq2Range.start - deltaBefore >= seq2ValidRange.start &&
		sequence2.isStronglyEqual(diff.seq2Range.start - deltaBefore, diff.seq2Range.endExclusive - deltaBefore) && deltaBefore < maxShiftLimit
	) {
		deltaBefore++;
	}
	deltaBefore--;

	let deltaAfter = 0;
	while (
		diff.seq1Range.start + deltaAfter < seq1ValidRange.endExclusive &&
		diff.seq2Range.endExclusive + deltaAfter < seq2ValidRange.endExclusive &&
		sequence2.isStronglyEqual(diff.seq2Range.start + deltaAfter, diff.seq2Range.endExclusive + deltaAfter) && deltaAfter < maxShiftLimit
	) {
		deltaAfter++;
	}

	if (deltaBefore === 0 && deltaAfter === 0) {
		return diff;
	}

	// Visualize `[sequence1.text, diff.seq1Range.start + deltaAfter]`
	// and `[sequence2.text, diff.seq2Range.start + deltaAfter, diff.seq2Range.endExclusive + deltaAfter]`

	let bestDelta = 0;
	let bestScore = -1;
	// find best scored delta
	for (let delta = -deltaBefore; delta <= deltaAfter; delta++) {
		const seq2OffsetStart = diff.seq2Range.start + delta;
		const seq2OffsetEndExclusive = diff.seq2Range.endExclusive + delta;
		const seq1Offset = diff.seq1Range.start + delta;

		const score = sequence1.getBoundaryScore!(seq1Offset) + sequence2.getBoundaryScore!(seq2OffsetStart) + sequence2.getBoundaryScore!(seq2OffsetEndExclusive);
		if (score > bestScore) {
			bestScore = score;
			bestDelta = delta;
		}
	}

	return diff.delta(bestDelta);
}

export function removeShortMatches(sequence1: ISequence, sequence2: ISequence, sequenceDiffs: SequenceDiff[]): SequenceDiff[] {
	const result: SequenceDiff[] = [];
	for (const s of sequenceDiffs) {
		const last = result[result.length - 1];
		if (!last) {
			result.push(s);
			continue;
		}

		if (s.seq1Range.start - last.seq1Range.endExclusive <= 2 || s.seq2Range.start - last.seq2Range.endExclusive <= 2) {
			result[result.length - 1] = new SequenceDiff(last.seq1Range.join(s.seq1Range), last.seq2Range.join(s.seq2Range));
		} else {
			result.push(s);
		}
	}

	return result;
}

export function extendDiffsToEntireWordIfAppropriate(
	sequence1: LinesSliceCharSequence,
	sequence2: LinesSliceCharSequence,
	sequenceDiffs: SequenceDiff[],
	findParent: (seq: LinesSliceCharSequence, idx: number) => OffsetRange | undefined,
	force: boolean = false,
): SequenceDiff[] {
	const equalMappings = SequenceDiff.invert(sequenceDiffs, sequence1.length);

	const additional: SequenceDiff[] = [];

	let lastPoint = new OffsetPair(0, 0);

	function scanWord(pair: OffsetPair, equalMapping: SequenceDiff) {
		if (pair.offset1 < lastPoint.offset1 || pair.offset2 < lastPoint.offset2) {
			return;
		}

		const w1 = findParent(sequence1, pair.offset1);
		const w2 = findParent(sequence2, pair.offset2);
		if (!w1 || !w2) {
			return;
		}
		let w = new SequenceDiff(w1, w2);
		const equalPart = w.intersect(equalMapping)!;

		let equalChars1 = equalPart.seq1Range.length;
		let equalChars2 = equalPart.seq2Range.length;

		// The words do not touch previous equals mappings, as we would have processed them already.
		// But they might touch the next ones.

		while (equalMappings.length > 0) {
			const next = equalMappings[0];
			const intersects = next.seq1Range.intersects(w.seq1Range) || next.seq2Range.intersects(w.seq2Range);
			if (!intersects) {
				break;
			}

			const v1 = findParent(sequence1, next.seq1Range.start);
			const v2 = findParent(sequence2, next.seq2Range.start);
			// Because there is an intersection, we know that the words are not empty.
			const v = new SequenceDiff(v1!, v2!);
			const equalPart = v.intersect(next)!;

			equalChars1 += equalPart.seq1Range.length;
			equalChars2 += equalPart.seq2Range.length;

			w = w.join(v);

			if (w.seq1Range.endExclusive >= next.seq1Range.endExclusive) {
				// The word extends beyond the next equal mapping.
				equalMappings.shift();
			} else {
				break;
			}
		}

		if ((force && equalChars1 + equalChars2 < w.seq1Range.length + w.seq2Range.length) || equalChars1 + equalChars2 < (w.seq1Range.length + w.seq2Range.length) * 2 / 3) {
			additional.push(w);
		}

		lastPoint = w.getEndExclusives();
	}

	while (equalMappings.length > 0) {
		const next = equalMappings.shift()!;
		if (next.seq1Range.isEmpty) {
			continue;
		}
		scanWord(next.getStarts(), next);
		// The equal parts are not empty, so -1 gives us a character that is equal in both parts.
		scanWord(next.getEndExclusives().delta(-1), next);
	}

	const merged = mergeSequenceDiffs(sequenceDiffs, additional);
	return merged;
}

function mergeSequenceDiffs(sequenceDiffs1: SequenceDiff[], sequenceDiffs2: SequenceDiff[]): SequenceDiff[] {
	const result: SequenceDiff[] = [];

	while (sequenceDiffs1.length > 0 || sequenceDiffs2.length > 0) {
		const sd1 = sequenceDiffs1[0];
		const sd2 = sequenceDiffs2[0];

		let next: SequenceDiff;
		if (sd1 && (!sd2 || sd1.seq1Range.start < sd2.seq1Range.start)) {
			next = sequenceDiffs1.shift()!;
		} else {
			next = sequenceDiffs2.shift()!;
		}

		if (result.length > 0 && result[result.length - 1].seq1Range.endExclusive >= next.seq1Range.start) {
			result[result.length - 1] = result[result.length - 1].join(next);
		} else {
			result.push(next);
		}
	}

	return result;
}

export function removeVeryShortMatchingLinesBetweenDiffs(sequence1: LineSequence, _sequence2: LineSequence, sequenceDiffs: SequenceDiff[]): SequenceDiff[] {
	let diffs = sequenceDiffs;
	if (diffs.length === 0) {
		return diffs;
	}

	let counter = 0;
	let shouldRepeat: boolean;
	do {
		shouldRepeat = false;

		const result: SequenceDiff[] = [
			diffs[0]
		];

		for (let i = 1; i < diffs.length; i++) {
			const cur = diffs[i];
			const lastResult = result[result.length - 1];

			function shouldJoinDiffs(before: SequenceDiff, after: SequenceDiff): boolean {
				const unchangedRange = new OffsetRange(lastResult.seq1Range.endExclusive, cur.seq1Range.start);

				const unchangedText = sequence1.getText(unchangedRange);
				const unchangedTextWithoutWs = unchangedText.replace(/\s/g, '');
				if (unchangedTextWithoutWs.length <= 4
					&& (before.seq1Range.length + before.seq2Range.length > 5 || after.seq1Range.length + after.seq2Range.length > 5)) {
					return true;
				}

				return false;
			}

			const shouldJoin = shouldJoinDiffs(lastResult, cur);
			if (shouldJoin) {
				shouldRepeat = true;
				result[result.length - 1] = result[result.length - 1].join(cur);
			} else {
				result.push(cur);
			}
		}

		diffs = result;
	} while (counter++ < 10 && shouldRepeat);

	return diffs;
}

export function removeVeryShortMatchingTextBetweenLongDiffs(sequence1: LinesSliceCharSequence, sequence2: LinesSliceCharSequence, sequenceDiffs: SequenceDiff[]): SequenceDiff[] {
	let diffs = sequenceDiffs;
	if (diffs.length === 0) {
		return diffs;
	}

	let counter = 0;
	let shouldRepeat: boolean;
	do {
		shouldRepeat = false;

		const result: SequenceDiff[] = [
			diffs[0]
		];

		for (let i = 1; i < diffs.length; i++) {
			const cur = diffs[i];
			const lastResult = result[result.length - 1];

			function shouldJoinDiffs(before: SequenceDiff, after: SequenceDiff): boolean {
				const unchangedRange = new OffsetRange(lastResult.seq1Range.endExclusive, cur.seq1Range.start);

				const unchangedLineCount = sequence1.countLinesIn(unchangedRange);
				if (unchangedLineCount > 5 || unchangedRange.length > 500) {
					return false;
				}

				const unchangedText = sequence1.getText(unchangedRange).trim();
				if (unchangedText.length > 20 || unchangedText.split(/\r\n|\r|\n/).length > 1) {
					return false;
				}

				const beforeLineCount1 = sequence1.countLinesIn(before.seq1Range);
				const beforeSeq1Length = before.seq1Range.length;
				const beforeLineCount2 = sequence2.countLinesIn(before.seq2Range);
				const beforeSeq2Length = before.seq2Range.length;

				const afterLineCount1 = sequence1.countLinesIn(after.seq1Range);
				const afterSeq1Length = after.seq1Range.length;
				const afterLineCount2 = sequence2.countLinesIn(after.seq2Range);
				const afterSeq2Length = after.seq2Range.length;

				// TODO: Maybe a neural net can be used to derive the result from these numbers

				const max = 2 * 40 + 50;
				function cap(v: number): number {
					return Math.min(v, max);
				}

				if (Math.pow(Math.pow(cap(beforeLineCount1 * 40 + beforeSeq1Length), 1.5) + Math.pow(cap(beforeLineCount2 * 40 + beforeSeq2Length), 1.5), 1.5)
					+ Math.pow(Math.pow(cap(afterLineCount1 * 40 + afterSeq1Length), 1.5) + Math.pow(cap(afterLineCount2 * 40 + afterSeq2Length), 1.5), 1.5) > ((max ** 1.5) ** 1.5) * 1.3) {
					return true;
				}
				return false;
			}

			const shouldJoin = shouldJoinDiffs(lastResult, cur);
			if (shouldJoin) {
				shouldRepeat = true;
				result[result.length - 1] = result[result.length - 1].join(cur);
			} else {
				result.push(cur);
			}
		}

		diffs = result;
	} while (counter++ < 10 && shouldRepeat);

	const newDiffs: SequenceDiff[] = [];

	// Remove short suffixes/prefixes
	forEachWithNeighbors(diffs, (prev, cur, next) => {
		let newDiff = cur;

		function shouldMarkAsChanged(text: string): boolean {
			return text.length > 0 && text.trim().length <= 3 && cur.seq1Range.length + cur.seq2Range.length > 100;
		}

		const fullRange1 = sequence1.extendToFullLines(cur.seq1Range);
		const prefix = sequence1.getText(new OffsetRange(fullRange1.start, cur.seq1Range.start));
		if (shouldMarkAsChanged(prefix)) {
			newDiff = newDiff.deltaStart(-prefix.length);
		}
		const suffix = sequence1.getText(new OffsetRange(cur.seq1Range.endExclusive, fullRange1.endExclusive));
		if (shouldMarkAsChanged(suffix)) {
			newDiff = newDiff.deltaEnd(suffix.length);
		}

		const availableSpace = SequenceDiff.fromOffsetPairs(
			prev ? prev.getEndExclusives() : OffsetPair.zero,
			next ? next.getStarts() : OffsetPair.max,
		);
		const result = newDiff.intersect(availableSpace)!;
		if (newDiffs.length > 0 && result.getStarts().equals(newDiffs[newDiffs.length - 1].getEndExclusives())) {
			newDiffs[newDiffs.length - 1] = newDiffs[newDiffs.length - 1].join(result);
		} else {
			newDiffs.push(result);
		}
	});

	return newDiffs;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/diff/defaultLinesDiffComputer/lineSequence.ts]---
Location: vscode-main/src/vs/editor/common/diff/defaultLinesDiffComputer/lineSequence.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../../base/common/charCode.js';
import { OffsetRange } from '../../core/ranges/offsetRange.js';
import { ISequence } from './algorithms/diffAlgorithm.js';

export class LineSequence implements ISequence {
	constructor(
		private readonly trimmedHash: number[],
		private readonly lines: string[]
	) { }

	getElement(offset: number): number {
		return this.trimmedHash[offset];
	}

	get length(): number {
		return this.trimmedHash.length;
	}

	getBoundaryScore(length: number): number {
		const indentationBefore = length === 0 ? 0 : getIndentation(this.lines[length - 1]);
		const indentationAfter = length === this.lines.length ? 0 : getIndentation(this.lines[length]);
		return 1000 - (indentationBefore + indentationAfter);
	}

	getText(range: OffsetRange): string {
		return this.lines.slice(range.start, range.endExclusive).join('\n');
	}

	isStronglyEqual(offset1: number, offset2: number): boolean {
		return this.lines[offset1] === this.lines[offset2];
	}
}

function getIndentation(str: string): number {
	let i = 0;
	while (i < str.length && (str.charCodeAt(i) === CharCode.Space || str.charCodeAt(i) === CharCode.Tab)) {
		i++;
	}
	return i;
}
```

--------------------------------------------------------------------------------

````
