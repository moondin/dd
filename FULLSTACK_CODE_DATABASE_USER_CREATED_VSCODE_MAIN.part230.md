---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 230
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 230 of 552)

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

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/model/inlineSuggestionItem.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/model/inlineSuggestionItem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BugIndicatingError } from '../../../../../base/common/errors.js';
import { IObservable, ITransaction, observableSignal, observableValue } from '../../../../../base/common/observable.js';
import { commonPrefixLength, commonSuffixLength, splitLines } from '../../../../../base/common/strings.js';
import { URI } from '../../../../../base/common/uri.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { ISingleEditOperation } from '../../../../common/core/editOperation.js';
import { applyEditsToRanges, StringEdit, StringReplacement } from '../../../../common/core/edits/stringEdit.js';
import { TextEdit, TextReplacement } from '../../../../common/core/edits/textEdit.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { OffsetRange } from '../../../../common/core/ranges/offsetRange.js';
import { StringText } from '../../../../common/core/text/abstractText.js';
import { getPositionOffsetTransformerFromTextModel } from '../../../../common/core/text/getPositionOffsetTransformerFromTextModel.js';
import { PositionOffsetTransformerBase } from '../../../../common/core/text/positionToOffset.js';
import { TextLength } from '../../../../common/core/text/textLength.js';
import { linesDiffComputers } from '../../../../common/diff/linesDiffComputers.js';
import { Command, IInlineCompletionHint, InlineCompletion, InlineCompletionEndOfLifeReason, InlineCompletionHintStyle, InlineCompletionTriggerKind, InlineCompletionWarning, PartialAcceptInfo } from '../../../../common/languages.js';
import { ITextModel } from '../../../../common/model.js';
import { TextModelText } from '../../../../common/model/textModelText.js';
import { InlineCompletionViewData, InlineCompletionViewKind } from '../view/inlineEdits/inlineEditsViewInterface.js';
import { computeEditKind, InlineSuggestionEditKind } from './editKind.js';
import { inlineCompletionIsVisible } from './inlineCompletionIsVisible.js';
import { IInlineSuggestDataAction, IInlineSuggestDataActionEdit, InlineSuggestData, InlineSuggestionList, PartialAcceptance, RenameInfo, SnippetInfo } from './provideInlineCompletions.js';
import { InlineSuggestAlternativeAction } from './InlineSuggestAlternativeAction.js';

export type InlineSuggestionItem = InlineEditItem | InlineCompletionItem;

export namespace InlineSuggestionItem {
	export function create(
		data: InlineSuggestData,
		textModel: ITextModel,
		shouldDiffEdit: boolean = true, // TODO@benibenj it should only be created once and hence not meeded to be passed here
	): InlineSuggestionItem {
		if (!data.isInlineEdit && !data.action?.uri && data.action?.kind === 'edit') {
			return InlineCompletionItem.create(data, textModel, data.action);
		} else {
			return InlineEditItem.create(data, textModel, shouldDiffEdit);
		}
	}
}

export type InlineSuggestionAction = IInlineSuggestionActionEdit | IInlineSuggestionActionJumpTo;

export interface IInlineSuggestionActionEdit {
	kind: 'edit';
	textReplacement: TextReplacement;
	snippetInfo: SnippetInfo | undefined;
	stringEdit: StringEdit;
	uri: URI | undefined;
	alternativeAction: InlineSuggestAlternativeAction | undefined;
}

export interface IInlineSuggestionActionJumpTo {
	kind: 'jumpTo';
	position: Position;
	offset: number;
	uri: URI | undefined;
}

function hashInlineSuggestionAction(action: InlineSuggestionAction | undefined): string {
	const obj = action?.kind === 'edit' ? { ...action, alternativeAction: InlineSuggestAlternativeAction.toString(action.alternativeAction) } : action;
	return JSON.stringify(obj);
}

abstract class InlineSuggestionItemBase {
	constructor(
		protected readonly _data: InlineSuggestData,
		public readonly identity: InlineSuggestionIdentity,
		public readonly hint: InlineSuggestHint | undefined,
	) {
	}

	public abstract get action(): InlineSuggestionAction | undefined;

	/**
	 * A reference to the original inline completion list this inline completion has been constructed from.
	 * Used for event data to ensure referential equality.
	*/
	public get source(): InlineSuggestionList { return this._data.source; }

	public get isFromExplicitRequest(): boolean { return this._data.context.triggerKind === InlineCompletionTriggerKind.Explicit; }
	public get forwardStable(): boolean { return this.source.inlineSuggestions.enableForwardStability ?? false; }

	public get targetRange(): Range {
		if (this.hint) {
			return this.hint.range;
		}
		if (this.action?.kind === 'edit') {
			return this.action.textReplacement.range;
		} else if (this.action?.kind === 'jumpTo') {
			return Range.fromPositions(this.action.position);
		}
		throw new BugIndicatingError('InlineSuggestionItem: Either hint or action must be set');
	}

	public get semanticId(): string { return this.hash; }
	public get gutterMenuLinkAction(): Command | undefined { return this._sourceInlineCompletion.gutterMenuLinkAction; }
	public get command(): Command | undefined { return this._sourceInlineCompletion.command; }
	public get supportsRename(): boolean { return this._data.supportsRename; }
	public get warning(): InlineCompletionWarning | undefined { return this._sourceInlineCompletion.warning; }
	public get showInlineEditMenu(): boolean { return !!this._sourceInlineCompletion.showInlineEditMenu; }
	public get hash(): string {
		return hashInlineSuggestionAction(this.action);
	}
	/** @deprecated */
	public get shownCommand(): Command | undefined { return this._sourceInlineCompletion.shownCommand; }

	public get requestUuid(): string { return this._data.context.requestUuid; }

	public get partialAccepts(): PartialAcceptance { return this._data.partialAccepts; }

	/**
	 * A reference to the original inline completion this inline completion has been constructed from.
	 * Used for event data to ensure referential equality.
	*/
	private get _sourceInlineCompletion(): InlineCompletion { return this._data.sourceInlineCompletion; }


	public abstract withEdit(userEdit: StringEdit, textModel: ITextModel): InlineSuggestionItem | undefined;

	public abstract withIdentity(identity: InlineSuggestionIdentity): InlineSuggestionItem;
	public abstract canBeReused(model: ITextModel, position: Position): boolean;

	public abstract computeEditKind(model: ITextModel): InlineSuggestionEditKind | undefined;

	public addRef(): void {
		this.identity.addRef();
		this.source.addRef();
	}

	public removeRef(): void {
		this.identity.removeRef();
		this.source.removeRef();
	}

	public reportInlineEditShown(commandService: ICommandService, viewKind: InlineCompletionViewKind, viewData: InlineCompletionViewData, model: ITextModel, timeWhenShown: number) {
		const insertText = this.action?.kind === 'edit' ? this.action.textReplacement.text : ''; // TODO@hediet support insertText === undefined
		this._data.reportInlineEditShown(commandService, insertText, viewKind, viewData, this.computeEditKind(model), timeWhenShown);
	}

	public reportPartialAccept(acceptedCharacters: number, info: PartialAcceptInfo, partialAcceptance: PartialAcceptance) {
		this._data.reportPartialAccept(acceptedCharacters, info, partialAcceptance);
	}

	public reportEndOfLife(reason: InlineCompletionEndOfLifeReason): void {
		this._data.reportEndOfLife(reason);
	}

	public setEndOfLifeReason(reason: InlineCompletionEndOfLifeReason): void {
		this._data.setEndOfLifeReason(reason);
	}

	public setIsPreceeded(item: InlineSuggestionItem): void {
		this._data.setIsPreceeded(item.partialAccepts);
	}

	public setNotShownReasonIfNotSet(reason: string): void {
		this._data.setNotShownReason(reason);
	}

	/**
	 * Avoid using this method. Instead introduce getters for the needed properties.
	*/
	public getSourceCompletion(): InlineCompletion {
		return this._sourceInlineCompletion;
	}

	public setRenameProcessingInfo(info: RenameInfo): void {
		this._data.setRenameProcessingInfo(info);
	}

	public withAction(action: IInlineSuggestDataAction): InlineSuggestData {
		return this._data.withAction(action);
	}

	public addPerformanceMarker(marker: string): void {
		this._data.addPerformanceMarker(marker);
	}
}

export class InlineSuggestionIdentity {
	private static idCounter = 0;
	private readonly _onDispose = observableSignal(this);
	public readonly onDispose: IObservable<void> = this._onDispose;

	private readonly _jumpedTo = observableValue(this, false);
	public get jumpedTo(): IObservable<boolean> {
		return this._jumpedTo;
	}

	private _refCount = 1;
	public readonly id = 'InlineCompletionIdentity' + InlineSuggestionIdentity.idCounter++;

	addRef() {
		this._refCount++;
	}

	removeRef() {
		this._refCount--;
		if (this._refCount === 0) {
			this._onDispose.trigger(undefined);
		}
	}

	setJumpTo(tx: ITransaction | undefined): void {
		this._jumpedTo.set(true, tx);
	}
}

export class InlineSuggestHint {

	public static create(hint: IInlineCompletionHint) {
		return new InlineSuggestHint(
			Range.lift(hint.range),
			hint.content,
			hint.style,
		);
	}

	private constructor(
		public readonly range: Range,
		public readonly content: string,
		public readonly style: InlineCompletionHintStyle,
	) { }

	public withEdit(edit: StringEdit, positionOffsetTransformer: PositionOffsetTransformerBase): InlineSuggestHint | undefined {
		const offsetRange = new OffsetRange(
			positionOffsetTransformer.getOffset(this.range.getStartPosition()),
			positionOffsetTransformer.getOffset(this.range.getEndPosition())
		);

		const newOffsetRange = applyEditsToRanges([offsetRange], edit)[0];
		if (!newOffsetRange) {
			return undefined;
		}

		const newRange = positionOffsetTransformer.getRange(newOffsetRange);

		return new InlineSuggestHint(newRange, this.content, this.style);
	}
}

export class InlineCompletionItem extends InlineSuggestionItemBase {
	public static create(
		data: InlineSuggestData,
		textModel: ITextModel,
		action: IInlineSuggestDataActionEdit,
	): InlineCompletionItem {
		const identity = new InlineSuggestionIdentity();
		const transformer = getPositionOffsetTransformerFromTextModel(textModel);

		const insertText = action.insertText.replace(/\r\n|\r|\n/g, textModel.getEOL());

		const edit = reshapeInlineCompletion(new StringReplacement(transformer.getOffsetRange(action.range), insertText), textModel);
		const trimmedEdit = edit.removeCommonSuffixAndPrefix(textModel.getValue());
		const textEdit = transformer.getTextReplacement(edit);

		const displayLocation = data.hint ? InlineSuggestHint.create(data.hint) : undefined;

		return new InlineCompletionItem(edit, trimmedEdit, textEdit, textEdit.range, action.snippetInfo, data.additionalTextEdits, data, identity, displayLocation);
	}

	public readonly isInlineEdit = false;

	private constructor(
		private readonly _edit: StringReplacement,
		private readonly _trimmedEdit: StringReplacement,
		private readonly _textEdit: TextReplacement,
		private readonly _originalRange: Range,
		public readonly snippetInfo: SnippetInfo | undefined,
		public readonly additionalTextEdits: readonly ISingleEditOperation[],

		data: InlineSuggestData,
		identity: InlineSuggestionIdentity,
		displayLocation: InlineSuggestHint | undefined,
	) {
		super(data, identity, displayLocation);
	}

	override get action(): IInlineSuggestionActionEdit {
		return {
			kind: 'edit',
			textReplacement: this.getSingleTextEdit(),
			snippetInfo: this.snippetInfo,
			stringEdit: new StringEdit([this._trimmedEdit]),
			uri: undefined,
			alternativeAction: undefined,
		};
	}

	override get hash(): string {
		return JSON.stringify(this._trimmedEdit.toJson());
	}

	getSingleTextEdit(): TextReplacement { return this._textEdit; }

	override withIdentity(identity: InlineSuggestionIdentity): InlineCompletionItem {
		return new InlineCompletionItem(
			this._edit,
			this._trimmedEdit,
			this._textEdit,
			this._originalRange,
			this.snippetInfo,
			this.additionalTextEdits,
			this._data,
			identity,
			this.hint
		);
	}

	override withEdit(textModelEdit: StringEdit, textModel: ITextModel): InlineCompletionItem | undefined {
		const newEditRange = applyEditsToRanges([this._edit.replaceRange], textModelEdit);
		if (newEditRange.length === 0) {
			return undefined;
		}
		const newEdit = new StringReplacement(newEditRange[0], this._textEdit.text);
		const positionOffsetTransformer = getPositionOffsetTransformerFromTextModel(textModel);
		const newTextEdit = positionOffsetTransformer.getTextReplacement(newEdit);

		let newDisplayLocation = this.hint;
		if (newDisplayLocation) {
			newDisplayLocation = newDisplayLocation.withEdit(textModelEdit, positionOffsetTransformer);
			if (!newDisplayLocation) {
				return undefined;
			}
		}

		const trimmedEdit = newEdit.removeCommonSuffixAndPrefix(textModel.getValue());

		return new InlineCompletionItem(
			newEdit,
			trimmedEdit,
			newTextEdit,
			this._originalRange,
			this.snippetInfo,
			this.additionalTextEdits,
			this._data,
			this.identity,
			newDisplayLocation
		);
	}

	override canBeReused(model: ITextModel, position: Position): boolean {
		// TODO@hediet I believe this can be simplified to `return true;`, as applying an edit should kick out this suggestion.
		const updatedRange = this._textEdit.range;
		const result = !!updatedRange
			&& updatedRange.containsPosition(position)
			&& this.isVisible(model, position)
			&& TextLength.ofRange(updatedRange).isGreaterThanOrEqualTo(TextLength.ofRange(this._originalRange));
		return result;
	}

	public isVisible(model: ITextModel, cursorPosition: Position): boolean {
		const singleTextEdit = this.getSingleTextEdit();
		return inlineCompletionIsVisible(singleTextEdit, this._originalRange, model, cursorPosition);
	}

	override computeEditKind(model: ITextModel): InlineSuggestionEditKind | undefined {
		return computeEditKind(new StringEdit([this._edit]), model);
	}

	public get editRange(): Range { return this.getSingleTextEdit().range; }
	public get insertText(): string { return this.getSingleTextEdit().text; }
}

export class InlineEditItem extends InlineSuggestionItemBase {
	public static create(
		data: InlineSuggestData,
		textModel: ITextModel,
		shouldDiffEdit: boolean = true,
	): InlineEditItem {
		let action: InlineSuggestionAction | undefined;
		let edits: SingleUpdatedNextEdit[] = [];
		if (data.action?.kind === 'edit') {
			const offsetEdit = shouldDiffEdit ? getDiffedStringEdit(textModel, data.action.range, data.action.insertText) : getStringEdit(textModel, data.action.range, data.action.insertText); // TODO compute async
			const text = new TextModelText(textModel);
			const textEdit = TextEdit.fromStringEdit(offsetEdit, text);
			const singleTextEdit = offsetEdit.isEmpty() ? new TextReplacement(new Range(1, 1, 1, 1), '') : textEdit.toReplacement(text); // FIXME: .toReplacement() can throw because offsetEdit is empty because we get an empty diff in getStringEdit after diffing

			edits = offsetEdit.replacements.map(edit => {
				const replacedRange = Range.fromPositions(textModel.getPositionAt(edit.replaceRange.start), textModel.getPositionAt(edit.replaceRange.endExclusive));
				const replacedText = textModel.getValueInRange(replacedRange);
				return SingleUpdatedNextEdit.create(edit, replacedText);
			});

			action = {
				kind: 'edit',
				snippetInfo: data.action.snippetInfo,
				stringEdit: offsetEdit,
				textReplacement: singleTextEdit,
				uri: data.action.uri,
				alternativeAction: data.action.alternativeAction,
			};
		} else if (data.action?.kind === 'jumpTo') {
			action = {
				kind: 'jumpTo',
				position: data.action.position,
				offset: textModel.getOffsetAt(data.action.position),
				uri: data.action.uri,
			};
		} else {
			action = undefined;
			if (!data.hint) {
				throw new BugIndicatingError('InlineEditItem: action is undefined and no hint is provided');
			}
		}

		const identity = new InlineSuggestionIdentity();

		const hint = data.hint ? InlineSuggestHint.create(data.hint) : undefined;
		return new InlineEditItem(action, data, identity, edits, hint, false, textModel.getVersionId());
	}

	public readonly snippetInfo: SnippetInfo | undefined = undefined;
	public readonly additionalTextEdits: readonly ISingleEditOperation[] = [];
	public readonly isInlineEdit = true;

	private constructor(
		private readonly _action: InlineSuggestionAction | undefined,

		data: InlineSuggestData,

		identity: InlineSuggestionIdentity,
		private readonly _edits: readonly SingleUpdatedNextEdit[],
		hint: InlineSuggestHint | undefined,
		private readonly _lastChangePartOfInlineEdit = false,
		private readonly _inlineEditModelVersion: number,
	) {
		super(data, identity, hint);
	}

	public get updatedEditModelVersion(): number { return this._inlineEditModelVersion; }
	// public get updatedEdit(): StringEdit { return this._edit; }

	override get action(): InlineSuggestionAction | undefined {
		return this._action;
	}

	override withIdentity(identity: InlineSuggestionIdentity): InlineEditItem {
		return new InlineEditItem(
			this._action,
			this._data,
			identity,
			this._edits,
			this.hint,
			this._lastChangePartOfInlineEdit,
			this._inlineEditModelVersion,
		);
	}

	override canBeReused(model: ITextModel, position: Position): boolean {
		// TODO@hediet I believe this can be simplified to `return true;`, as applying an edit should kick out this suggestion.
		return this._lastChangePartOfInlineEdit && this.updatedEditModelVersion === model.getVersionId();
	}

	override withEdit(textModelChanges: StringEdit, textModel: ITextModel): InlineEditItem | undefined {
		const edit = this._applyTextModelChanges(textModelChanges, this._edits, textModel);
		return edit;
	}

	private _applyTextModelChanges(textModelChanges: StringEdit, edits: readonly SingleUpdatedNextEdit[], textModel: ITextModel): InlineEditItem | undefined {
		const positionOffsetTransformer = getPositionOffsetTransformerFromTextModel(textModel);

		let lastChangePartOfInlineEdit = false;
		let inlineEditModelVersion = this._inlineEditModelVersion;
		let newAction: InlineSuggestionAction | undefined;

		if (this.action?.kind === 'edit') { // TODO What about rename?
			edits = edits.map(innerEdit => innerEdit.applyTextModelChanges(textModelChanges));

			if (edits.some(edit => edit.edit === undefined)) {
				return undefined; // change is invalid, so we will have to drop the completion
			}


			const newTextModelVersion = textModel.getVersionId();
			lastChangePartOfInlineEdit = edits.some(edit => edit.lastChangeUpdatedEdit);
			if (lastChangePartOfInlineEdit) {
				inlineEditModelVersion = newTextModelVersion ?? -1;
			}

			if (newTextModelVersion === null || inlineEditModelVersion + 20 < newTextModelVersion) {
				return undefined; // the completion has been ignored for a while, remove it
			}

			edits = edits.filter(innerEdit => !innerEdit.edit!.isEmpty);
			if (edits.length === 0) {
				return undefined; // the completion has been typed by the user
			}

			const newEdit = new StringEdit(edits.map(edit => edit.edit!));

			const newTextEdit = positionOffsetTransformer.getTextEdit(newEdit).toReplacement(new TextModelText(textModel));

			newAction = {
				kind: 'edit',
				textReplacement: newTextEdit,
				snippetInfo: this.snippetInfo,
				stringEdit: newEdit,
				uri: this.action.uri,
				alternativeAction: this.action.alternativeAction,
			};
		} else if (this.action?.kind === 'jumpTo') {
			const jumpToOffset = this.action.offset;
			const newJumpToOffset = textModelChanges.applyToOffsetOrUndefined(jumpToOffset);
			if (newJumpToOffset === undefined) {
				return undefined;
			}
			const newJumpToPosition = positionOffsetTransformer.getPosition(newJumpToOffset);

			newAction = {
				kind: 'jumpTo',
				position: newJumpToPosition,
				offset: newJumpToOffset,
				uri: this.action.uri,
			};
		} else {
			newAction = undefined;
		}

		let newDisplayLocation = this.hint;
		if (newDisplayLocation) {
			newDisplayLocation = newDisplayLocation.withEdit(textModelChanges, positionOffsetTransformer);
			if (!newDisplayLocation) {
				return undefined;
			}
		}

		return new InlineEditItem(
			newAction,
			this._data,
			this.identity,
			edits,
			newDisplayLocation,
			lastChangePartOfInlineEdit,
			inlineEditModelVersion,
		);
	}

	override computeEditKind(model: ITextModel): InlineSuggestionEditKind | undefined {
		const edit = this.action?.kind === 'edit' ? this.action.stringEdit : undefined;
		if (!edit) {
			return undefined;
		}
		return computeEditKind(edit, model);
	}
}

function getDiffedStringEdit(textModel: ITextModel, editRange: Range, replaceText: string): StringEdit {
	const eol = textModel.getEOL();
	const editOriginalText = textModel.getValueInRange(editRange);
	const editReplaceText = replaceText.replace(/\r\n|\r|\n/g, eol);

	const diffAlgorithm = linesDiffComputers.getDefault();
	const lineDiffs = diffAlgorithm.computeDiff(
		splitLines(editOriginalText),
		splitLines(editReplaceText),
		{
			ignoreTrimWhitespace: false,
			computeMoves: false,
			extendToSubwords: true,
			maxComputationTimeMs: 50,
		}
	);

	const innerChanges = lineDiffs.changes.flatMap(c => c.innerChanges ?? []);

	function addRangeToPos(pos: Position, range: Range): Range {
		const start = TextLength.fromPosition(range.getStartPosition());
		return TextLength.ofRange(range).createRange(start.addToPosition(pos));
	}

	const modifiedText = new StringText(editReplaceText);

	const offsetEdit = new StringEdit(
		innerChanges.map(c => {
			const rangeInModel = addRangeToPos(editRange.getStartPosition(), c.originalRange);
			const originalRange = getPositionOffsetTransformerFromTextModel(textModel).getOffsetRange(rangeInModel);

			const replaceText = modifiedText.getValueOfRange(c.modifiedRange);
			const edit = new StringReplacement(originalRange, replaceText);

			const originalText = textModel.getValueInRange(rangeInModel);
			return reshapeInlineEdit(edit, originalText, innerChanges.length, textModel);
		})
	);

	return offsetEdit;
}

function getStringEdit(textModel: ITextModel, editRange: Range, replaceText: string): StringEdit {
	return new StringEdit([new StringReplacement(
		getPositionOffsetTransformerFromTextModel(textModel).getOffsetRange(editRange),
		replaceText
	)]);
}

class SingleUpdatedNextEdit {
	public static create(
		edit: StringReplacement,
		replacedText: string,
	): SingleUpdatedNextEdit {
		const prefixLength = commonPrefixLength(edit.newText, replacedText);
		const suffixLength = commonSuffixLength(edit.newText, replacedText);
		const trimmedNewText = edit.newText.substring(prefixLength, edit.newText.length - suffixLength);
		return new SingleUpdatedNextEdit(edit, trimmedNewText, prefixLength, suffixLength);
	}

	public get edit() { return this._edit; }
	public get lastChangeUpdatedEdit() { return this._lastChangeUpdatedEdit; }

	constructor(
		private _edit: StringReplacement | undefined,
		private _trimmedNewText: string,
		private _prefixLength: number,
		private _suffixLength: number,
		private _lastChangeUpdatedEdit: boolean = false,
	) {
	}

	public applyTextModelChanges(textModelChanges: StringEdit) {
		const c = this._clone();
		c._applyTextModelChanges(textModelChanges);
		return c;
	}

	private _clone(): SingleUpdatedNextEdit {
		return new SingleUpdatedNextEdit(
			this._edit,
			this._trimmedNewText,
			this._prefixLength,
			this._suffixLength,
			this._lastChangeUpdatedEdit,
		);
	}

	private _applyTextModelChanges(textModelChanges: StringEdit) {
		this._lastChangeUpdatedEdit = false; // TODO @benibenj make immutable

		if (!this._edit) {
			throw new BugIndicatingError('UpdatedInnerEdits: No edit to apply changes to');
		}

		const result = this._applyChanges(this._edit, textModelChanges);
		if (!result) {
			this._edit = undefined;
			return;
		}

		this._edit = result.edit;
		this._lastChangeUpdatedEdit = result.editHasChanged;
	}

	private _applyChanges(edit: StringReplacement, textModelChanges: StringEdit): { edit: StringReplacement; editHasChanged: boolean } | undefined {
		let editStart = edit.replaceRange.start;
		let editEnd = edit.replaceRange.endExclusive;
		let editReplaceText = edit.newText;
		let editHasChanged = false;

		const shouldPreserveEditShape = this._prefixLength > 0 || this._suffixLength > 0;

		for (let i = textModelChanges.replacements.length - 1; i >= 0; i--) {
			const change = textModelChanges.replacements[i];

			// INSERTIONS (only support inserting at start of edit)
			const isInsertion = change.newText.length > 0 && change.replaceRange.isEmpty;

			if (isInsertion && !shouldPreserveEditShape && change.replaceRange.start === editStart && editReplaceText.startsWith(change.newText)) {
				editStart += change.newText.length;
				editReplaceText = editReplaceText.substring(change.newText.length);
				editEnd += change.newText.length;
				editHasChanged = true;
				continue;
			}

			if (isInsertion && shouldPreserveEditShape && change.replaceRange.start === editStart + this._prefixLength && this._trimmedNewText.startsWith(change.newText)) {
				editEnd += change.newText.length;
				editHasChanged = true;
				this._prefixLength += change.newText.length;
				this._trimmedNewText = this._trimmedNewText.substring(change.newText.length);
				continue;
			}

			// DELETIONS
			const isDeletion = change.newText.length === 0 && change.replaceRange.length > 0;
			if (isDeletion && change.replaceRange.start >= editStart + this._prefixLength && change.replaceRange.endExclusive <= editEnd - this._suffixLength) {
				// user deleted text IN-BETWEEN the deletion range
				editEnd -= change.replaceRange.length;
				editHasChanged = true;
				continue;
			}

			// user did exactly the edit
			if (change.equals(edit)) {
				editHasChanged = true;
				editStart = change.replaceRange.endExclusive;
				editReplaceText = '';
				continue;
			}

			// MOVE EDIT
			if (change.replaceRange.start > editEnd) {
				// the change happens after the completion range
				continue;
			}
			if (change.replaceRange.endExclusive < editStart) {
				// the change happens before the completion range
				editStart += change.newText.length - change.replaceRange.length;
				editEnd += change.newText.length - change.replaceRange.length;
				continue;
			}

			// The change intersects the completion, so we will have to drop the completion
			return undefined;
		}

		// the resulting edit is a noop as the original and new text are the same
		if (this._trimmedNewText.length === 0 && editStart + this._prefixLength === editEnd - this._suffixLength) {
			return { edit: new StringReplacement(new OffsetRange(editStart + this._prefixLength, editStart + this._prefixLength), ''), editHasChanged: true };
		}

		return { edit: new StringReplacement(new OffsetRange(editStart, editEnd), editReplaceText), editHasChanged };
	}
}

function reshapeInlineCompletion(edit: StringReplacement, textModel: ITextModel): StringReplacement {
	// If the insertion is a multi line insertion starting on the next line
	// Move it forwards so that the multi line insertion starts on the current line
	const eol = textModel.getEOL();
	if (edit.replaceRange.isEmpty && edit.newText.includes(eol)) {
		edit = reshapeMultiLineInsertion(edit, textModel);
	}

	return edit;
}

function reshapeInlineEdit(edit: StringReplacement, originalText: string, totalInnerEdits: number, textModel: ITextModel): StringReplacement {
	// TODO: EOL are not properly trimmed by the diffAlgorithm #12680
	const eol = textModel.getEOL();
	if (edit.newText.endsWith(eol) && originalText.endsWith(eol)) {
		edit = new StringReplacement(edit.replaceRange.deltaEnd(-eol.length), edit.newText.slice(0, -eol.length));
	}

	// INSERTION
	// If the insertion ends with a new line and is inserted at the start of a line which has text,
	// we move the insertion to the end of the previous line if possible
	if (totalInnerEdits === 1 && edit.replaceRange.isEmpty && edit.newText.includes(eol)) {
		const startPosition = textModel.getPositionAt(edit.replaceRange.start);
		const hasTextOnInsertionLine = textModel.getLineLength(startPosition.lineNumber) !== 0;
		if (hasTextOnInsertionLine) {
			edit = reshapeMultiLineInsertion(edit, textModel);
		}
	}

	// The diff algorithm extended a simple edit to the entire word
	// shrink it back to a simple edit if it is deletion/insertion only
	if (totalInnerEdits === 1) {
		const prefixLength = commonPrefixLength(originalText, edit.newText);
		const suffixLength = commonSuffixLength(originalText.slice(prefixLength), edit.newText.slice(prefixLength));

		// reshape it back to an insertion
		if (prefixLength + suffixLength === originalText.length) {
			return new StringReplacement(edit.replaceRange.deltaStart(prefixLength).deltaEnd(-suffixLength), edit.newText.substring(prefixLength, edit.newText.length - suffixLength));
		}

		// reshape it back to a deletion
		if (prefixLength + suffixLength === edit.newText.length) {
			return new StringReplacement(edit.replaceRange.deltaStart(prefixLength).deltaEnd(-suffixLength), '');
		}
	}

	return edit;
}

function reshapeMultiLineInsertion(edit: StringReplacement, textModel: ITextModel): StringReplacement {
	if (!edit.replaceRange.isEmpty) {
		throw new BugIndicatingError('Unexpected original range');
	}

	if (edit.replaceRange.start === 0) {
		return edit;
	}

	const eol = textModel.getEOL();
	const startPosition = textModel.getPositionAt(edit.replaceRange.start);
	const startColumn = startPosition.column;
	const startLineNumber = startPosition.lineNumber;

	// If the insertion ends with a new line and is inserted at the start of a line which has text,
	// we move the insertion to the end of the previous line if possible
	if (startColumn === 1 && startLineNumber > 1 && edit.newText.endsWith(eol) && !edit.newText.startsWith(eol)) {
		return new StringReplacement(edit.replaceRange.delta(-1), eol + edit.newText.slice(0, -eol.length));
	}

	return edit;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/model/provideInlineCompletions.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/model/provideInlineCompletions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assertNever } from '../../../../../base/common/assert.js';
import { AsyncIterableProducer } from '../../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { BugIndicatingError, onUnexpectedExternalError } from '../../../../../base/common/errors.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { prefixedUuid } from '../../../../../base/common/uuid.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { ISingleEditOperation } from '../../../../common/core/editOperation.js';
import { StringReplacement } from '../../../../common/core/edits/stringEdit.js';
import { OffsetRange } from '../../../../common/core/ranges/offsetRange.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { TextReplacement } from '../../../../common/core/edits/textEdit.js';
import { InlineCompletionEndOfLifeReason, InlineCompletionEndOfLifeReasonKind, InlineCompletion, InlineCompletionContext, InlineCompletions, InlineCompletionsProvider, PartialAcceptInfo, InlineCompletionsDisposeReason, LifetimeSummary, ProviderId, IInlineCompletionHint } from '../../../../common/languages.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { ITextModel } from '../../../../common/model.js';
import { fixBracketsInLine } from '../../../../common/model/bracketPairsTextModelPart/fixBrackets.js';
import { SnippetParser, Text } from '../../../snippet/browser/snippetParser.js';
import { ErrorResult, getReadonlyEmptyArray } from '../utils.js';
import { groupByMap } from '../../../../../base/common/collections.js';
import { DirectedGraph } from './graph.js';
import { CachedFunction } from '../../../../../base/common/cache.js';
import { InlineCompletionViewData, InlineCompletionViewKind } from '../view/inlineEdits/inlineEditsViewInterface.js';
import { isDefined } from '../../../../../base/common/types.js';
import { inlineCompletionIsVisible } from './inlineCompletionIsVisible.js';
import { EditDeltaInfo } from '../../../../common/textModelEditSource.js';
import { URI } from '../../../../../base/common/uri.js';
import { InlineSuggestionEditKind } from './editKind.js';
import { InlineSuggestAlternativeAction } from './InlineSuggestAlternativeAction.js';

export type InlineCompletionContextWithoutUuid = Omit<InlineCompletionContext, 'requestUuid'>;

export function provideInlineCompletions(
	providers: InlineCompletionsProvider[],
	position: Position,
	model: ITextModel,
	context: InlineCompletionContextWithoutUuid,
	requestInfo: InlineSuggestRequestInfo,
	languageConfigurationService?: ILanguageConfigurationService,
): IInlineCompletionProviderResult {
	const requestUuid = prefixedUuid('icr');

	const cancellationTokenSource = new CancellationTokenSource();
	let cancelReason: InlineCompletionsDisposeReason | undefined = undefined;

	const contextWithUuid: InlineCompletionContext = { ...context, requestUuid: requestUuid };

	const defaultReplaceRange = getDefaultRange(position, model);

	const providersByGroupId = groupByMap(providers, p => p.groupId);
	const yieldsToGraph = DirectedGraph.from(providers, p => {
		return p.yieldsToGroupIds?.flatMap(groupId => providersByGroupId.get(groupId) ?? []) ?? [];
	});
	const { foundCycles } = yieldsToGraph.removeCycles();
	if (foundCycles.length > 0) {
		onUnexpectedExternalError(new Error(`Inline completions: cyclic yield-to dependency detected.`
			+ ` Path: ${foundCycles.map(s => s.toString ? s.toString() : ('' + s)).join(' -> ')}`));
	}

	let runningCount = 0;

	const queryProvider = new CachedFunction(async (provider: InlineCompletionsProvider<InlineCompletions>): Promise<InlineSuggestionList | undefined> => {
		try {
			runningCount++;
			if (cancellationTokenSource.token.isCancellationRequested) {
				return undefined;
			}

			const yieldsTo = yieldsToGraph.getOutgoing(provider);
			for (const p of yieldsTo) {
				// We know there is no cycle, so no recursion here
				const result = await queryProvider.get(p);
				if (result) {
					for (const item of result.inlineSuggestions.items) {
						if (item.isInlineEdit || typeof item.insertText !== 'string' && item.insertText !== undefined) {
							return undefined;
						}
						if (item.insertText !== undefined) {
							const t = new TextReplacement(Range.lift(item.range) ?? defaultReplaceRange, item.insertText);
							if (inlineCompletionIsVisible(t, undefined, model, position)) {
								return undefined;
							}
						}

						// else: inline completion is not visible, so lets not block
					}
				}
			}

			let result: InlineCompletions | null | undefined;
			const providerStartTime = Date.now();
			try {
				result = await provider.provideInlineCompletions(model, position, contextWithUuid, cancellationTokenSource.token);
			} catch (e) {
				onUnexpectedExternalError(e);
				return undefined;
			}
			const providerEndTime = Date.now();

			if (!result) {
				return undefined;
			}

			const data: InlineSuggestData[] = [];
			const list = new InlineSuggestionList(result, data, provider);
			list.addRef();
			runWhenCancelled(cancellationTokenSource.token, () => {
				return list.removeRef(cancelReason);
			});
			if (cancellationTokenSource.token.isCancellationRequested) {
				return undefined; // The list is disposed now, so we cannot return the items!
			}

			for (const item of result.items) {
				const r = toInlineSuggestData(item, list, defaultReplaceRange, model, languageConfigurationService, contextWithUuid, requestInfo, { startTime: providerStartTime, endTime: providerEndTime });
				if (ErrorResult.is(r)) {
					r.logError();
					continue;
				}
				data.push(r);
			}

			return list;
		} finally {
			runningCount--;
		}
	});

	const inlineCompletionLists = AsyncIterableProducer.fromPromisesResolveOrder(providers.map(p => queryProvider.get(p))).filter(isDefined);

	return {
		contextWithUuid,
		get didAllProvidersReturn() { return runningCount === 0; },
		lists: inlineCompletionLists,
		cancelAndDispose: reason => {
			if (cancelReason !== undefined) {
				return;
			}
			cancelReason = reason;
			cancellationTokenSource.dispose(true);
		}
	};
}

/** If the token is eventually cancelled, this will not leak either. */
export function runWhenCancelled(token: CancellationToken, callback: () => void): IDisposable {
	if (token.isCancellationRequested) {
		callback();
		return Disposable.None;
	} else {
		const listener = token.onCancellationRequested(() => {
			listener.dispose();
			callback();
		});
		return { dispose: () => listener.dispose() };
	}
}

export interface IInlineCompletionProviderResult {
	get didAllProvidersReturn(): boolean;

	contextWithUuid: InlineCompletionContext;

	cancelAndDispose(reason: InlineCompletionsDisposeReason): void;

	lists: AsyncIterableProducer<InlineSuggestionList>;
}

function toInlineSuggestData(
	inlineCompletion: InlineCompletion,
	source: InlineSuggestionList,
	defaultReplaceRange: Range,
	textModel: ITextModel,
	languageConfigurationService: ILanguageConfigurationService | undefined,
	context: InlineCompletionContext,
	requestInfo: InlineSuggestRequestInfo,
	providerRequestInfo: InlineSuggestProviderRequestInfo,
): InlineSuggestData | ErrorResult {

	let action: IInlineSuggestDataAction | undefined;
	const uri = inlineCompletion.uri ? URI.revive(inlineCompletion.uri) : undefined;

	if (inlineCompletion.jumpToPosition !== undefined) {
		action = {
			kind: 'jumpTo',
			position: Position.lift(inlineCompletion.jumpToPosition),
			uri,
		};
	} else if (inlineCompletion.insertText !== undefined) {
		let insertText: string;
		let snippetInfo: SnippetInfo | undefined;
		let range = inlineCompletion.range ? Range.lift(inlineCompletion.range) : defaultReplaceRange;

		if (typeof inlineCompletion.insertText === 'string') {
			insertText = inlineCompletion.insertText;

			if (languageConfigurationService && inlineCompletion.completeBracketPairs) {
				insertText = closeBrackets(
					insertText,
					range.getStartPosition(),
					textModel,
					languageConfigurationService
				);

				// Modify range depending on if brackets are added or removed
				const diff = insertText.length - inlineCompletion.insertText.length;
				if (diff !== 0) {
					range = new Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn + diff);
				}
			}

			snippetInfo = undefined;
		} else if ('snippet' in inlineCompletion.insertText) {
			const preBracketCompletionLength = inlineCompletion.insertText.snippet.length;

			if (languageConfigurationService && inlineCompletion.completeBracketPairs) {
				inlineCompletion.insertText.snippet = closeBrackets(
					inlineCompletion.insertText.snippet,
					range.getStartPosition(),
					textModel,
					languageConfigurationService
				);

				// Modify range depending on if brackets are added or removed
				const diff = inlineCompletion.insertText.snippet.length - preBracketCompletionLength;
				if (diff !== 0) {
					range = new Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn + diff);
				}
			}

			const snippet = new SnippetParser().parse(inlineCompletion.insertText.snippet);

			if (snippet.children.length === 1 && snippet.children[0] instanceof Text) {
				insertText = snippet.children[0].value;
				snippetInfo = undefined;
			} else {
				insertText = snippet.toString();
				snippetInfo = {
					snippet: inlineCompletion.insertText.snippet,
					range: range
				};
			}
		} else {
			assertNever(inlineCompletion.insertText);
		}
		action = {
			kind: 'edit',
			range,
			insertText,
			snippetInfo,
			uri,
			alternativeAction: undefined,
		};
	} else {
		action = undefined;
		if (!inlineCompletion.hint) {
			return ErrorResult.message('Inline completion has no insertText, jumpToPosition nor hint.');
		}
	}

	return new InlineSuggestData(
		action,
		inlineCompletion.hint,
		inlineCompletion.additionalTextEdits || getReadonlyEmptyArray(),
		inlineCompletion,
		source,
		context,
		inlineCompletion.isInlineEdit ?? false,
		inlineCompletion.supportsRename ?? false,
		requestInfo,
		providerRequestInfo,
		inlineCompletion.correlationId,
	);
}

export type InlineSuggestSku = { type: string; plan: string };

export type InlineSuggestRequestInfo = {
	startTime: number;
	editorType: InlineCompletionEditorType;
	languageId: string;
	reason: string;
	typingInterval: number;
	typingIntervalCharacterCount: number;
	availableProviders: ProviderId[];
	sku: InlineSuggestSku | undefined;
};

export type InlineSuggestProviderRequestInfo = {
	startTime: number;
	endTime: number;
};

export type PartialAcceptance = {
	characters: number;
	count: number;
	ratio: number;
};

export type RenameInfo = {
	createdRename: boolean;
	duration: number;
	timedOut?: boolean;
	droppedOtherEdits?: number;
	droppedRenameEdits?: number;
};

export type InlineSuggestViewData = {
	editorType: InlineCompletionEditorType;
	renderData?: InlineCompletionViewData;
	viewKind?: InlineCompletionViewKind;
};

export type IInlineSuggestDataAction = IInlineSuggestDataActionEdit | IInlineSuggestDataActionJumpTo;

export interface IInlineSuggestDataActionEdit {
	kind: 'edit';
	range: Range;
	insertText: string;
	snippetInfo: SnippetInfo | undefined;
	uri: URI | undefined;
	alternativeAction: InlineSuggestAlternativeAction | undefined;
}

export interface IInlineSuggestDataActionJumpTo {
	kind: 'jumpTo';
	position: Position;
	uri: URI | undefined;
}

export class InlineSuggestData {
	private _didShow = false;
	private _timeUntilShown: number | undefined = undefined;
	private _timeUntilActuallyShown: number | undefined = undefined;
	private _showStartTime: number | undefined = undefined;
	private _shownDuration: number = 0;
	private _showUncollapsedStartTime: number | undefined = undefined;
	private _showUncollapsedDuration: number = 0;
	private _notShownReason: string | undefined = undefined;

	private _viewData: InlineSuggestViewData;
	private _didReportEndOfLife = false;
	private _lastSetEndOfLifeReason: InlineCompletionEndOfLifeReason | undefined = undefined;
	private _isPreceeded = false;
	private _partiallyAcceptedCount = 0;
	private _partiallyAcceptedSinceOriginal: PartialAcceptance = { characters: 0, ratio: 0, count: 0 };
	private _renameInfo: RenameInfo | undefined = undefined;
	private _editKind: InlineSuggestionEditKind | undefined = undefined;

	get action(): IInlineSuggestDataAction | undefined {
		return this._action;
	}

	constructor(
		private _action: IInlineSuggestDataAction | undefined,
		public readonly hint: IInlineCompletionHint | undefined,
		public readonly additionalTextEdits: readonly ISingleEditOperation[],
		public readonly sourceInlineCompletion: InlineCompletion,
		public readonly source: InlineSuggestionList,
		public readonly context: InlineCompletionContext,
		public readonly isInlineEdit: boolean,
		public readonly supportsRename: boolean,
		private readonly _requestInfo: InlineSuggestRequestInfo,
		private readonly _providerRequestInfo: InlineSuggestProviderRequestInfo,
		private readonly _correlationId: string | undefined,
	) {
		this._viewData = { editorType: _requestInfo.editorType };
	}

	public get showInlineEditMenu() { return this.sourceInlineCompletion.showInlineEditMenu ?? false; }

	public get partialAccepts(): PartialAcceptance { return this._partiallyAcceptedSinceOriginal; }


	public async reportInlineEditShown(commandService: ICommandService, updatedInsertText: string, viewKind: InlineCompletionViewKind, viewData: InlineCompletionViewData, editKind: InlineSuggestionEditKind | undefined, timeWhenShown: number): Promise<void> {
		this.updateShownDuration(viewKind);

		if (this._didShow) {
			return;
		}
		this.addPerformanceMarker('shown');
		this._didShow = true;
		this._editKind = editKind;
		this._viewData.viewKind = viewKind;
		this._viewData.renderData = viewData;
		this._timeUntilShown = timeWhenShown - this._requestInfo.startTime;
		this._timeUntilActuallyShown = Date.now() - this._requestInfo.startTime;

		const editDeltaInfo = new EditDeltaInfo(viewData.lineCountModified, viewData.lineCountOriginal, viewData.characterCountModified, viewData.characterCountOriginal);
		this.source.provider.handleItemDidShow?.(this.source.inlineSuggestions, this.sourceInlineCompletion, updatedInsertText, editDeltaInfo);

		if (this.sourceInlineCompletion.shownCommand) {
			await commandService.executeCommand(this.sourceInlineCompletion.shownCommand.id, ...(this.sourceInlineCompletion.shownCommand.arguments || []));
		}
	}

	public reportPartialAccept(acceptedCharacters: number, info: PartialAcceptInfo, partialAcceptance: PartialAcceptance) {
		this._partiallyAcceptedCount++;
		this._partiallyAcceptedSinceOriginal.characters += partialAcceptance.characters;
		this._partiallyAcceptedSinceOriginal.ratio = Math.min(this._partiallyAcceptedSinceOriginal.ratio + (1 - this._partiallyAcceptedSinceOriginal.ratio) * partialAcceptance.ratio, 1);
		this._partiallyAcceptedSinceOriginal.count += partialAcceptance.count;

		this.source.provider.handlePartialAccept?.(
			this.source.inlineSuggestions,
			this.sourceInlineCompletion,
			acceptedCharacters,
			info
		);
	}

	/**
	 * Sends the end of life event to the provider.
	 * If no reason is provided, the last set reason is used.
	 * If no reason was set, the default reason is used.
	*/
	public reportEndOfLife(reason?: InlineCompletionEndOfLifeReason): void {
		if (this._didReportEndOfLife) {
			return;
		}
		this._didReportEndOfLife = true;
		this.reportInlineEditHidden();

		if (!reason) {
			reason = this._lastSetEndOfLifeReason ?? { kind: InlineCompletionEndOfLifeReasonKind.Ignored, userTypingDisagreed: false, supersededBy: undefined };
		}

		if (reason.kind === InlineCompletionEndOfLifeReasonKind.Rejected && this.source.provider.handleRejection) {
			this.source.provider.handleRejection(this.source.inlineSuggestions, this.sourceInlineCompletion);
		}

		if (this.source.provider.handleEndOfLifetime) {
			const summary: LifetimeSummary = {
				requestUuid: this.context.requestUuid,
				correlationId: this._correlationId,
				selectedSuggestionInfo: !!this.context.selectedSuggestionInfo,
				partiallyAccepted: this._partiallyAcceptedCount,
				partiallyAcceptedCountSinceOriginal: this._partiallyAcceptedSinceOriginal.count,
				partiallyAcceptedRatioSinceOriginal: this._partiallyAcceptedSinceOriginal.ratio,
				partiallyAcceptedCharactersSinceOriginal: this._partiallyAcceptedSinceOriginal.characters,
				shown: this._didShow,
				shownDuration: this._shownDuration,
				shownDurationUncollapsed: this._showUncollapsedDuration,
				editKind: this._editKind?.toString(),
				preceeded: this._isPreceeded,
				timeUntilShown: this._timeUntilShown,
				timeUntilActuallyShown: this._timeUntilActuallyShown,
				timeUntilProviderRequest: this._providerRequestInfo.startTime - this._requestInfo.startTime,
				timeUntilProviderResponse: this._providerRequestInfo.endTime - this._requestInfo.startTime,
				editorType: this._viewData.editorType,
				languageId: this._requestInfo.languageId,
				requestReason: this._requestInfo.reason,
				viewKind: this._viewData.viewKind,
				notShownReason: this._notShownReason,
				performanceMarkers: this.performance.toString(),
				renameCreated: this._renameInfo?.createdRename,
				renameDuration: this._renameInfo?.duration,
				renameTimedOut: this._renameInfo?.timedOut,
				renameDroppedOtherEdits: this._renameInfo?.droppedOtherEdits,
				renameDroppedRenameEdits: this._renameInfo?.droppedRenameEdits,
				typingInterval: this._requestInfo.typingInterval,
				typingIntervalCharacterCount: this._requestInfo.typingIntervalCharacterCount,
				skuPlan: this._requestInfo.sku?.plan,
				skuType: this._requestInfo.sku?.type,
				availableProviders: this._requestInfo.availableProviders.map(p => p.toString()).join(','),
				...this._viewData.renderData?.getData(),
			};
			this.source.provider.handleEndOfLifetime(this.source.inlineSuggestions, this.sourceInlineCompletion, reason, summary);
		}
	}

	public setIsPreceeded(partialAccepts: PartialAcceptance): void {
		this._isPreceeded = true;

		if (this._partiallyAcceptedSinceOriginal.characters !== 0 || this._partiallyAcceptedSinceOriginal.ratio !== 0 || this._partiallyAcceptedSinceOriginal.count !== 0) {
			console.warn('Expected partiallyAcceptedCountSinceOriginal to be { characters: 0, rate: 0, partialAcceptances: 0 } before setIsPreceeded.');
		}
		this._partiallyAcceptedSinceOriginal = partialAccepts;
	}

	public setNotShownReason(reason: string): void {
		this._notShownReason ??= reason;
	}

	/**
	 * Sets the end of life reason, but does not send the event to the provider yet.
	*/
	public setEndOfLifeReason(reason: InlineCompletionEndOfLifeReason): void {
		this.reportInlineEditHidden();
		this._lastSetEndOfLifeReason = reason;
	}

	private updateShownDuration(viewKind: InlineCompletionViewKind) {
		const timeNow = Date.now();
		if (!this._showStartTime) {
			this._showStartTime = timeNow;
		}

		const isCollapsed = viewKind === InlineCompletionViewKind.Collapsed;
		if (!isCollapsed && this._showUncollapsedStartTime === undefined) {
			this._showUncollapsedStartTime = timeNow;
		}

		if (isCollapsed && this._showUncollapsedStartTime !== undefined) {
			this._showUncollapsedDuration += timeNow - this._showUncollapsedStartTime;
		}
	}

	private reportInlineEditHidden() {
		if (this._showStartTime === undefined) {
			return;
		}
		const timeNow = Date.now();
		this._shownDuration += timeNow - this._showStartTime;
		this._showStartTime = undefined;

		if (this._showUncollapsedStartTime === undefined) {
			return;
		}
		this._showUncollapsedDuration += timeNow - this._showUncollapsedStartTime;
		this._showUncollapsedStartTime = undefined;
	}

	public setRenameProcessingInfo(info: RenameInfo): void {
		if (this._renameInfo) {
			throw new BugIndicatingError('Rename info has already been set.');
		}
		this._renameInfo = info;
	}

	public withAction(action: IInlineSuggestDataAction): InlineSuggestData {
		this._action = action;
		return this;
	}

	private performance = new InlineSuggestionsPerformance();
	public addPerformanceMarker(marker: string): void {
		this.performance.mark(marker);
	}
}

class InlineSuggestionsPerformance {
	private markers: { name: string; timeStamp: number }[] = [];
	constructor() {
		this.markers.push({ name: 'start', timeStamp: Date.now() });
	}

	mark(marker: string): void {
		this.markers.push({ name: marker, timeStamp: Date.now() });
	}

	toString(): string {
		const deltas = [];
		for (let i = 1; i < this.markers.length; i++) {
			const delta = this.markers[i].timeStamp - this.markers[i - 1].timeStamp;
			deltas.push({ [this.markers[i].name]: delta });
		}
		return JSON.stringify(deltas);
	}
}

export interface SnippetInfo {
	snippet: string;
	/* Could be different than the main range */
	range: Range;
}

export enum InlineCompletionEditorType {
	TextEditor = 'textEditor',
	DiffEditor = 'diffEditor',
	Notebook = 'notebook',
}

/**
 * A ref counted pointer to the computed `InlineCompletions` and the `InlineCompletionsProvider` that
 * computed them.
 */
export class InlineSuggestionList {
	private refCount = 0;
	constructor(
		public readonly inlineSuggestions: InlineCompletions,
		public readonly inlineSuggestionsData: readonly InlineSuggestData[],
		public readonly provider: InlineCompletionsProvider,
	) { }

	addRef(): void {
		this.refCount++;
	}

	removeRef(reason: InlineCompletionsDisposeReason = { kind: 'other' }): void {
		this.refCount--;
		if (this.refCount === 0) {
			for (const item of this.inlineSuggestionsData) {
				// Fallback if it has not been called before
				item.reportEndOfLife();
			}
			this.provider.disposeInlineCompletions(this.inlineSuggestions, reason);
		}
	}
}

function getDefaultRange(position: Position, model: ITextModel): Range {
	const word = model.getWordAtPosition(position);
	const maxColumn = model.getLineMaxColumn(position.lineNumber);
	// By default, always replace up until the end of the current line.
	// This default might be subject to change!
	return word
		? new Range(position.lineNumber, word.startColumn, position.lineNumber, maxColumn)
		: Range.fromPositions(position, position.with(undefined, maxColumn));
}

function closeBrackets(text: string, position: Position, model: ITextModel, languageConfigurationService: ILanguageConfigurationService): string {
	const currentLine = model.getLineContent(position.lineNumber);
	const edit = StringReplacement.replace(new OffsetRange(position.column - 1, currentLine.length), text);

	const proposedLineTokens = model.tokenization.tokenizeLinesAt(position.lineNumber, [edit.replace(currentLine)]);
	const textTokens = proposedLineTokens?.[0].sliceZeroCopy(edit.getRangeAfterReplace());
	if (!textTokens) {
		return text;
	}

	const fixedText = fixBracketsInLine(textTokens, languageConfigurationService);
	return fixedText;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/model/renameSymbolProcessor.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/model/renameSymbolProcessor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { raceTimeout } from '../../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { LcsDiff, StringDiffSequence } from '../../../../../base/common/diff/diff.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../nls.js';
import { CommandsRegistry, ICommandService } from '../../../../../platform/commands/common/commands.js';
import { ServicesAccessor } from '../../../../browser/editorExtensions.js';
import { IBulkEditService } from '../../../../browser/services/bulkEditService.js';
import { TextReplacement } from '../../../../common/core/edits/textEdit.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { StandardTokenType } from '../../../../common/encodedTokenAttributes.js';
import { Command, type Rejection, type WorkspaceEdit } from '../../../../common/languages.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { ITextModel } from '../../../../common/model.js';
import { ILanguageFeaturesService } from '../../../../common/services/languageFeatures.js';
import { EditSources, TextModelEditSource } from '../../../../common/textModelEditSource.js';
import { hasProvider, rawRename } from '../../../rename/browser/rename.js';
import { renameSymbolCommandId } from '../controller/commandIds.js';
import { InlineSuggestionItem } from './inlineSuggestionItem.js';
import { IInlineSuggestDataActionEdit, InlineCompletionContextWithoutUuid } from './provideInlineCompletions.js';
import { InlineSuggestAlternativeAction } from './InlineSuggestAlternativeAction.js';
import { Codicon } from '../../../../../base/common/codicons.js';

enum RenameKind {
	no = 'no',
	yes = 'yes',
	maybe = 'maybe'
}

namespace RenameKind {
	export function fromString(value: string): RenameKind {
		switch (value) {
			case 'no': return RenameKind.no;
			case 'yes': return RenameKind.yes;
			case 'maybe': return RenameKind.maybe;
			default: return RenameKind.no;
		}
	}
}

export type RenameEdits = {
	renames: { edits: TextReplacement[]; position: Position; oldName: string; newName: string };
	others: { edits: TextReplacement[] };
};

export class RenameInferenceEngine {

	public constructor() {
	}

	public inferRename(textModel: ITextModel, editRange: Range, insertText: string, wordDefinition: RegExp): RenameEdits | undefined {

		// Extend the edit range to full lines to capture prefix/suffix renames
		const extendedRange = new Range(editRange.startLineNumber, 1, editRange.endLineNumber, textModel.getLineMaxColumn(editRange.endLineNumber));
		const startDiff = editRange.startColumn - extendedRange.startColumn;
		const endDiff = extendedRange.endColumn - editRange.endColumn;

		const originalText = textModel.getValueInRange(extendedRange);
		const modifiedText =
			textModel.getValueInRange(new Range(extendedRange.startLineNumber, extendedRange.startColumn, extendedRange.startLineNumber, extendedRange.startColumn + startDiff)) +
			insertText +
			textModel.getValueInRange(new Range(extendedRange.endLineNumber, extendedRange.endColumn - endDiff, extendedRange.endLineNumber, extendedRange.endColumn));

		// console.log(`Original: ${originalText} \nmodified: ${modifiedText}`);
		const others: TextReplacement[] = [];
		const renames: TextReplacement[] = [];
		let oldName: string | undefined = undefined;
		let newName: string | undefined = undefined;
		let position: Position | undefined = undefined;

		const nesOffset = textModel.getOffsetAt(extendedRange.getStartPosition());

		const { changes: originalChanges } = (new LcsDiff(new StringDiffSequence(originalText), new StringDiffSequence(modifiedText))).ComputeDiff(true);
		if (originalChanges.length === 0) {
			return undefined;
		}

		// Fold the changes to larger changes if the gap between two changes is a full word. This covers cases like renaming
		// `foo` to `abcfoobar`
		const changes: typeof originalChanges = [];
		for (const change of originalChanges) {
			if (changes.length === 0) {
				changes.push(change);
				continue;
			}

			const lastChange = changes[changes.length - 1];
			const gapOriginalLength = change.originalStart - (lastChange.originalStart + lastChange.originalLength);

			if (gapOriginalLength > 0) {
				const gapStartOffset = nesOffset + lastChange.originalStart + lastChange.originalLength;
				const gapStartPos = textModel.getPositionAt(gapStartOffset);
				const wordRange = textModel.getWordAtPosition(gapStartPos);

				if (wordRange) {
					const wordStartOffset = textModel.getOffsetAt(new Position(gapStartPos.lineNumber, wordRange.startColumn));
					const wordEndOffset = textModel.getOffsetAt(new Position(gapStartPos.lineNumber, wordRange.endColumn));
					const gapEndOffset = gapStartOffset + gapOriginalLength;

					if (wordStartOffset <= gapStartOffset && gapEndOffset <= wordEndOffset && wordStartOffset <= gapEndOffset && gapEndOffset <= wordEndOffset) {
						lastChange.originalLength = (change.originalStart + change.originalLength) - lastChange.originalStart;
						lastChange.modifiedLength = (change.modifiedStart + change.modifiedLength) - lastChange.modifiedStart;
						continue;
					}
				}
			}

			changes.push(change);
		}

		let tokenDiff: number = 0;
		for (const change of changes) {
			const originalTextSegment = originalText.substring(change.originalStart, change.originalStart + change.originalLength);
			const insertedTextSegment = modifiedText.substring(change.modifiedStart, change.modifiedStart + change.modifiedLength);

			const startOffset = nesOffset + change.originalStart;
			const startPos = textModel.getPositionAt(startOffset);

			const endOffset = startOffset + change.originalLength;
			const endPos = textModel.getPositionAt(endOffset);

			const range = Range.fromPositions(startPos, endPos);

			const diff = insertedTextSegment.length - change.originalLength;

			// If the original text segment contains a whitespace character we don't consider this a rename since
			// identifiers in programming languages can't contain whitespace characters usually
			if (/\s/.test(originalTextSegment)) {
				others.push(new TextReplacement(range, insertedTextSegment));
				tokenDiff += diff;
				continue;
			}
			if (originalTextSegment.length > 0) {
				wordDefinition.lastIndex = 0;
				const match = wordDefinition.exec(originalTextSegment);
				if (match === null || match.index !== 0 || match[0].length !== originalTextSegment.length) {
					others.push(new TextReplacement(range, insertedTextSegment));
					tokenDiff += diff;
					continue;
				}
			}
			// If the inserted text contains a whitespace character we don't consider this a rename since identifiers in
			// programming languages can't contain whitespace characters usually
			if (/\s/.test(insertedTextSegment)) {
				others.push(new TextReplacement(range, insertedTextSegment));
				tokenDiff += diff;
				continue;
			}
			if (insertedTextSegment.length > 0) {
				wordDefinition.lastIndex = 0;
				const match = wordDefinition.exec(insertedTextSegment);
				if (match === null || match.index !== 0 || match[0].length !== insertedTextSegment.length) {
					others.push(new TextReplacement(range, insertedTextSegment));
					tokenDiff += diff;
					continue;
				}
			}

			const wordRange = textModel.getWordAtPosition(startPos);
			// If we don't have a word range at the start position of the current document then we
			// don't treat it as a rename assuming that the rename refactoring will fail as well since
			// there can't be an identifier at that position.
			if (wordRange === null) {
				others.push(new TextReplacement(range, insertedTextSegment));
				tokenDiff += diff;
				continue;
			}
			const originalStartColumn = change.originalStart + 1;
			const isInsertion = change.originalLength === 0 && change.modifiedLength > 0;
			let tokenInfo: { type: StandardTokenType; range: Range };
			// Word info is left aligned whereas token info is right aligned for insertions.
			// We prefer a suffix insertion for renames so we take the word range for the token info.
			if (isInsertion && originalStartColumn === wordRange.endColumn && wordRange.endColumn > wordRange.startColumn) {
				tokenInfo = this.getTokenAtPosition(textModel, new Position(startPos.lineNumber, wordRange.startColumn));
			} else {
				tokenInfo = this.getTokenAtPosition(textModel, startPos);
			}
			if (wordRange.startColumn !== tokenInfo.range.startColumn || wordRange.endColumn !== tokenInfo.range.endColumn) {
				others.push(new TextReplacement(range, insertedTextSegment));
				tokenDiff += diff;
				continue;
			}
			if (tokenInfo.type === StandardTokenType.Other) {

				let identifier = textModel.getValueInRange(tokenInfo.range);
				if (identifier.length === 0) {
					others.push(new TextReplacement(range, insertedTextSegment));
					tokenDiff += diff;
					continue;
				}
				if (oldName === undefined) {
					oldName = identifier;
				} else if (oldName !== identifier) {
					others.push(new TextReplacement(range, insertedTextSegment));
					tokenDiff += diff;
					continue;
				}

				// We assume that the new name starts at the same position as the old name from a token range perspective.
				const tokenStartPos = textModel.getOffsetAt(tokenInfo.range.getStartPosition()) - nesOffset + tokenDiff;
				const tokenEndPos = textModel.getOffsetAt(tokenInfo.range.getEndPosition()) - nesOffset + tokenDiff;
				identifier = modifiedText.substring(tokenStartPos, tokenEndPos + diff);
				if (identifier.length === 0) {
					others.push(new TextReplacement(range, insertedTextSegment));
					tokenDiff += diff;
					continue;
				}
				if (newName === undefined) {
					newName = identifier;
				} else if (newName !== identifier) {
					others.push(new TextReplacement(range, insertedTextSegment));
					tokenDiff += diff;
					continue;
				}

				if (position === undefined) {
					position = tokenInfo.range.getStartPosition();
				}

				if (oldName !== undefined && newName !== undefined && oldName.length > 0 && newName.length > 0 && oldName !== newName) {
					renames.push(new TextReplacement(tokenInfo.range, newName));
				} else {
					renames.push(new TextReplacement(range, insertedTextSegment));
				}
				tokenDiff += diff;
			} else {
				others.push(new TextReplacement(range, insertedTextSegment));
				tokenDiff += insertedTextSegment.length - change.originalLength;
			}
		}

		if (oldName === undefined || newName === undefined || position === undefined || oldName.length === 0 || newName.length === 0 || oldName === newName) {
			return undefined;
		}

		wordDefinition.lastIndex = 0;
		let match = wordDefinition.exec(oldName);
		if (match === null || match.index !== 0 || match[0].length !== oldName.length) {
			return undefined;
		}

		wordDefinition.lastIndex = 0;
		match = wordDefinition.exec(newName);
		if (match === null || match.index !== 0 || match[0].length !== newName.length) {
			return undefined;
		}

		return {
			renames: { edits: renames, position, oldName, newName },
			others: { edits: others }
		};
	}


	protected getTokenAtPosition(textModel: ITextModel, position: Position): { type: StandardTokenType; range: Range } {
		textModel.tokenization.tokenizeIfCheap(position.lineNumber);
		const tokens = textModel.tokenization.getLineTokens(position.lineNumber);
		const idx = tokens.findTokenIndexAtOffset(position.column - 1);
		return {
			type: tokens.getStandardTokenType(idx),
			range: new Range(position.lineNumber, 1 + tokens.getStartOffset(idx), position.lineNumber, 1 + tokens.getEndOffset(idx))
		};
	}
}

class RenameSymbolRunnable {

	private readonly _cancellationTokenSource: CancellationTokenSource;
	private readonly _promise: Promise<WorkspaceEdit & Rejection>;
	private _result: WorkspaceEdit & Rejection | undefined = undefined;

	constructor(languageFeaturesService: ILanguageFeaturesService, textModel: ITextModel, position: Position, newName: string) {
		this._cancellationTokenSource = new CancellationTokenSource();
		this._promise = rawRename(languageFeaturesService.renameProvider, textModel, position, newName, this._cancellationTokenSource.token);
	}

	public cancel(): void {
		this._cancellationTokenSource.cancel();
	}

	public async getCount(): Promise<number> {
		const result = await this.getResult();
		if (result === undefined) {
			return 0;
		}

		return result.edits.length;
	}

	public async getWorkspaceEdit(): Promise<WorkspaceEdit | undefined> {
		return this.getResult();
	}

	private async getResult(): Promise<WorkspaceEdit | undefined> {
		if (this._result === undefined) {
			this._result = await this._promise;
		}
		if (this._result.rejectReason) {
			return undefined;
		}
		return this._result;
	}
}

export class RenameSymbolProcessor extends Disposable {

	private readonly _renameInferenceEngine = new RenameInferenceEngine();

	private _renameRunnable: { id: string; runnable: RenameSymbolRunnable } | undefined;

	constructor(
		@ICommandService private readonly _commandService: ICommandService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@ILanguageConfigurationService private readonly _languageConfigurationService: ILanguageConfigurationService,
		@IBulkEditService bulkEditService: IBulkEditService,
	) {
		super();
		const self = this;
		this._register(CommandsRegistry.registerCommand(renameSymbolCommandId, async (_: ServicesAccessor, textModel: ITextModel, position: Position, newName: string, source: TextModelEditSource, id: string) => {
			if (self._renameRunnable === undefined) {
				return;
			}
			let workspaceEdit: WorkspaceEdit | undefined;
			if (self._renameRunnable.id !== id) {
				self._renameRunnable.runnable.cancel();
				self._renameRunnable = undefined;
				const runnable = new RenameSymbolRunnable(self._languageFeaturesService, textModel, position, newName);
				workspaceEdit = await runnable.getWorkspaceEdit();
			} else {
				workspaceEdit = await self._renameRunnable.runnable.getWorkspaceEdit();
				self._renameRunnable = undefined;
			}
			if (workspaceEdit === undefined) {
				return;
			}
			bulkEditService.apply(workspaceEdit, { reason: source });
		}));
	}

	public async proposeRenameRefactoring(textModel: ITextModel, suggestItem: InlineSuggestionItem, context: InlineCompletionContextWithoutUuid): Promise<InlineSuggestionItem> {
		if (!suggestItem.supportsRename || suggestItem.action?.kind !== 'edit' || context.selectedSuggestionInfo) {
			return suggestItem;
		}

		if (!hasProvider(this._languageFeaturesService.renameProvider, textModel)) {
			return suggestItem;
		}

		const start = Date.now();
		const edit = suggestItem.action.textReplacement;
		const languageConfiguration = this._languageConfigurationService.getLanguageConfiguration(textModel.getLanguageId());

		// Check synchronously if a rename is possible
		const edits = this._renameInferenceEngine.inferRename(textModel, edit.range, edit.text, languageConfiguration.wordDefinition);
		if (edits === undefined || edits.renames.edits.length === 0) {
			return suggestItem;
		}

		const { oldName, newName, position, edits: renameEdits } = edits.renames;

		// Check asynchronously if a rename is possible
		let timedOut = false;
		const check = await raceTimeout<RenameKind>(this.checkRenamePrecondition(suggestItem, textModel, position, oldName, newName), 100, () => { timedOut = true; });
		const renamePossible = check === RenameKind.yes || check === RenameKind.maybe;

		suggestItem.setRenameProcessingInfo({
			createdRename: renamePossible,
			duration: Date.now() - start,
			timedOut,
			droppedOtherEdits: renamePossible ? edits.others.edits.length : undefined,
			droppedRenameEdits: renamePossible ? renameEdits.length - 1 : undefined,
		});

		if (!renamePossible) {
			return suggestItem;
		}

		// Prepare the rename edits
		const id = suggestItem.identity.id;
		if (this._renameRunnable !== undefined) {
			this._renameRunnable.runnable.cancel();
			this._renameRunnable = undefined;
		}
		const runnable = new RenameSymbolRunnable(this._languageFeaturesService, textModel, position, newName);
		this._renameRunnable = { id, runnable };

		// Create alternative action
		const source = EditSources.inlineCompletionAccept({
			nes: suggestItem.isInlineEdit,
			requestUuid: suggestItem.requestUuid,
			providerId: suggestItem.source.provider.providerId,
			languageId: textModel.getLanguageId(),
			correlationId: suggestItem.getSourceCompletion().correlationId,
		});
		const command: Command = {
			id: renameSymbolCommandId,
			title: localize('rename', "Rename"),
			arguments: [textModel, position, newName, source, id],
		};
		const alternativeAction: InlineSuggestAlternativeAction = {
			label: localize('rename', "Rename"),
			icon: Codicon.replaceAll,
			command,
			count: runnable.getCount(),
		};
		const renameAction: IInlineSuggestDataActionEdit = {
			kind: 'edit',
			range: renameEdits[0].range,
			insertText: renameEdits[0].text,
			snippetInfo: suggestItem.snippetInfo,
			alternativeAction,
			uri: textModel.uri
		};

		return InlineSuggestionItem.create(suggestItem.withAction(renameAction), textModel, false);
	}

	private async checkRenamePrecondition(suggestItem: InlineSuggestionItem, textModel: ITextModel, position: Position, oldName: string, newName: string): Promise<RenameKind> {
		// const result = await prepareRename(this._languageFeaturesService.renameProvider, textModel, position, CancellationToken.None);
		// if (result === undefined || result.rejectReason) {
		// 	return RenameKind.no;
		// }
		// return oldName === result.text ? RenameKind.yes : RenameKind.no;

		try {
			const result = await this._commandService.executeCommand<RenameKind>('github.copilot.nes.prepareRename', textModel.uri, position, oldName, newName, suggestItem.requestUuid);
			if (result === undefined) {
				return RenameKind.no;
			} else {
				return RenameKind.fromString(result);
			}
		} catch (error) {
			return RenameKind.no;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/model/singleTextEditHelpers.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/model/singleTextEditHelpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { commonPrefixLength } from '../../../../../base/common/strings.js';
import { Range } from '../../../../common/core/range.js';
import { TextLength } from '../../../../common/core/text/textLength.js';
import { TextReplacement } from '../../../../common/core/edits/textEdit.js';
import { EndOfLinePreference, ITextModel } from '../../../../common/model.js';

export function singleTextRemoveCommonPrefix(edit: TextReplacement, model: ITextModel, validModelRange?: Range): TextReplacement {
	const modelRange = validModelRange ? edit.range.intersectRanges(validModelRange) : edit.range;
	if (!modelRange) {
		return edit;
	}
	const normalizedText = edit.text.replaceAll('\r\n', '\n');
	const valueToReplace = model.getValueInRange(modelRange, EndOfLinePreference.LF);
	const commonPrefixLen = commonPrefixLength(valueToReplace, normalizedText);
	const start = TextLength.ofText(valueToReplace.substring(0, commonPrefixLen)).addToPosition(edit.range.getStartPosition());
	const text = normalizedText.substring(commonPrefixLen);
	const range = Range.fromPositions(start, edit.range.getEndPosition());
	return new TextReplacement(range, text);
}

export function singleTextEditAugments(edit: TextReplacement, base: TextReplacement): boolean {
	// The augmented completion must replace the base range, but can replace even more
	return edit.text.startsWith(base.text) && rangeExtends(edit.range, base.range);
}

function rangeExtends(extendingRange: Range, rangeToExtend: Range): boolean {
	return rangeToExtend.getStartPosition().equals(extendingRange.getStartPosition())
		&& rangeToExtend.getEndPosition().isBeforeOrEqual(extendingRange.getEndPosition());
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/model/suggestWidgetAdapter.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/model/suggestWidgetAdapter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { compareBy, numberComparator } from '../../../../../base/common/arrays.js';
import { findFirstMax } from '../../../../../base/common/arraysFind.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { TextReplacement } from '../../../../common/core/edits/textEdit.js';
import { CompletionItemInsertTextRule, CompletionItemKind, SelectedSuggestionInfo } from '../../../../common/languages.js';
import { ITextModel } from '../../../../common/model.js';
import { singleTextEditAugments, singleTextRemoveCommonPrefix } from './singleTextEditHelpers.js';
import { SnippetParser } from '../../../snippet/browser/snippetParser.js';
import { SnippetSession } from '../../../snippet/browser/snippetSession.js';
import { CompletionItem } from '../../../suggest/browser/suggest.js';
import { SuggestController } from '../../../suggest/browser/suggestController.js';
import { ObservableCodeEditor } from '../../../../browser/observableCodeEditor.js';
import { observableFromEvent } from '../../../../../base/common/observable.js';

export class SuggestWidgetAdaptor extends Disposable {
	private isSuggestWidgetVisible: boolean = false;
	private isShiftKeyPressed = false;
	private _isActive = false;
	private _currentSuggestItemInfo: SuggestItemInfo | undefined = undefined;
	public get selectedItem(): SuggestItemInfo | undefined {
		return this._currentSuggestItemInfo;
	}
	private _onDidSelectedItemChange = this._register(new Emitter<void>());
	public readonly onDidSelectedItemChange: Event<void> = this._onDidSelectedItemChange.event;

	constructor(
		private readonly editor: ICodeEditor,
		private readonly suggestControllerPreselector: () => TextReplacement | undefined,
		private readonly onWillAccept: (item: SuggestItemInfo) => void,
	) {
		super();

		// See the command acceptAlternativeSelectedSuggestion that is bound to shift+tab
		this._register(editor.onKeyDown(e => {
			if (e.shiftKey && !this.isShiftKeyPressed) {
				this.isShiftKeyPressed = true;
				this.update(this._isActive);
			}
		}));
		this._register(editor.onKeyUp(e => {
			if (e.shiftKey && this.isShiftKeyPressed) {
				this.isShiftKeyPressed = false;
				this.update(this._isActive);
			}
		}));

		const suggestController = SuggestController.get(this.editor);
		if (suggestController) {
			this._register(suggestController.registerSelector({
				priority: 100,
				select: (model, pos, suggestItems) => {
					const textModel = this.editor.getModel();
					if (!textModel) {
						// Should not happen
						return -1;
					}

					const i = this.suggestControllerPreselector();
					const itemToPreselect = i ? singleTextRemoveCommonPrefix(i, textModel) : undefined;
					if (!itemToPreselect) {
						return -1;
					}
					const position = Position.lift(pos);

					const candidates = suggestItems
						.map((suggestItem, index) => {
							const suggestItemInfo = SuggestItemInfo.fromSuggestion(suggestController, textModel, position, suggestItem, this.isShiftKeyPressed);
							const suggestItemTextEdit = singleTextRemoveCommonPrefix(suggestItemInfo.getSingleTextEdit(), textModel);
							const valid = singleTextEditAugments(itemToPreselect, suggestItemTextEdit);
							return { index, valid, prefixLength: suggestItemTextEdit.text.length, suggestItem };
						})
						.filter(item => item && item.valid && item.prefixLength > 0);

					const result = findFirstMax(
						candidates,
						compareBy(s => s.prefixLength, numberComparator)
					);
					return result ? result.index : -1;
				}
			}));

			let isBoundToSuggestWidget = false;
			const bindToSuggestWidget = () => {
				if (isBoundToSuggestWidget) {
					return;
				}
				isBoundToSuggestWidget = true;

				this._register(suggestController.widget.value.onDidShow(() => {
					this.isSuggestWidgetVisible = true;
					this.update(true);
				}));
				this._register(suggestController.widget.value.onDidHide(() => {
					this.isSuggestWidgetVisible = false;
					this.update(false);
				}));
				this._register(suggestController.widget.value.onDidFocus(() => {
					this.isSuggestWidgetVisible = true;
					this.update(true);
				}));
			};

			this._register(Event.once(suggestController.model.onDidTrigger)(e => {
				bindToSuggestWidget();
			}));

			this._register(suggestController.onWillInsertSuggestItem(e => {
				const position = this.editor.getPosition();
				const model = this.editor.getModel();
				if (!position || !model) { return undefined; }

				const suggestItemInfo = SuggestItemInfo.fromSuggestion(
					suggestController,
					model,
					position,
					e.item,
					this.isShiftKeyPressed
				);

				this.onWillAccept(suggestItemInfo);
			}));
		}
		this.update(this._isActive);
	}

	private update(newActive: boolean): void {
		const newInlineCompletion = this.getSuggestItemInfo();

		if (this._isActive !== newActive || !suggestItemInfoEquals(this._currentSuggestItemInfo, newInlineCompletion)) {
			this._isActive = newActive;
			this._currentSuggestItemInfo = newInlineCompletion;

			this._onDidSelectedItemChange.fire();
		}
	}

	private getSuggestItemInfo(): SuggestItemInfo | undefined {
		const suggestController = SuggestController.get(this.editor);
		if (!suggestController || !this.isSuggestWidgetVisible) {
			return undefined;
		}

		const focusedItem = suggestController.widget.value.getFocusedItem();
		const position = this.editor.getPosition();
		const model = this.editor.getModel();

		if (!focusedItem || !position || !model) {
			return undefined;
		}

		return SuggestItemInfo.fromSuggestion(
			suggestController,
			model,
			position,
			focusedItem.item,
			this.isShiftKeyPressed
		);
	}

	public stopForceRenderingAbove(): void {
		const suggestController = SuggestController.get(this.editor);
		suggestController?.stopForceRenderingAbove();
	}

	public forceRenderingAbove(): void {
		const suggestController = SuggestController.get(this.editor);
		suggestController?.forceRenderingAbove();
	}
}

export class SuggestItemInfo {
	public static fromSuggestion(suggestController: SuggestController, model: ITextModel, position: Position, item: CompletionItem, toggleMode: boolean): SuggestItemInfo {
		let { insertText } = item.completion;
		let isSnippetText = false;
		if (item.completion.insertTextRules! & CompletionItemInsertTextRule.InsertAsSnippet) {
			const snippet = new SnippetParser().parse(insertText);

			if (snippet.children.length < 100) {
				// Adjust whitespace is expensive.
				SnippetSession.adjustWhitespace(model, position, true, snippet);
			}

			insertText = snippet.toString();
			isSnippetText = true;
		}

		const info = suggestController.getOverwriteInfo(item, toggleMode);

		return new SuggestItemInfo(
			Range.fromPositions(
				position.delta(0, -info.overwriteBefore),
				position.delta(0, Math.max(info.overwriteAfter, 0))
			),
			insertText,
			item.completion.kind,
			isSnippetText,
			item.container.incomplete ?? false,
		);
	}

	private constructor(
		public readonly range: Range,
		public readonly insertText: string,
		public readonly completionItemKind: CompletionItemKind,
		public readonly isSnippetText: boolean,
		public readonly listIncomplete: boolean,
	) { }

	public equals(other: SuggestItemInfo): boolean {
		return this.range.equalsRange(other.range)
			&& this.insertText === other.insertText
			&& this.completionItemKind === other.completionItemKind
			&& this.isSnippetText === other.isSnippetText;
	}

	public toSelectedSuggestionInfo(): SelectedSuggestionInfo {
		return new SelectedSuggestionInfo(this.range, this.insertText, this.completionItemKind, this.isSnippetText);
	}

	public getSingleTextEdit(): TextReplacement {
		return new TextReplacement(this.range, this.insertText);
	}
}

function suggestItemInfoEquals(a: SuggestItemInfo | undefined, b: SuggestItemInfo | undefined): boolean {
	if (a === b) {
		return true;
	}
	if (!a || !b) {
		return false;
	}
	return a.equals(b);
}

export class ObservableSuggestWidgetAdapter extends Disposable {
	private readonly _suggestWidgetAdaptor;

	public readonly selectedItem;

	constructor(
		private readonly _editorObs: ObservableCodeEditor,

		private readonly _handleSuggestAccepted: (item: SuggestItemInfo) => void,
		private readonly _suggestControllerPreselector: () => TextReplacement | undefined,
	) {
		super();
		this._suggestWidgetAdaptor = this._register(new SuggestWidgetAdaptor(
			this._editorObs.editor,
			() => {
				this._editorObs.forceUpdate();
				return this._suggestControllerPreselector();
			},
			(item) => this._editorObs.forceUpdate(_tx => {
				/** @description InlineCompletionsController.handleSuggestAccepted */
				this._handleSuggestAccepted(item);
			})
		));
		this.selectedItem = observableFromEvent(this, cb => this._suggestWidgetAdaptor.onDidSelectedItemChange(() => {
			this._editorObs.forceUpdate(_tx => cb(undefined));
		}), () => this._suggestWidgetAdaptor.selectedItem);
	}

	public stopForceRenderingAbove(): void {
		this._suggestWidgetAdaptor.stopForceRenderingAbove();
	}

	public forceRenderingAbove(): void {
		this._suggestWidgetAdaptor.forceRenderingAbove();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/model/typingSpeed.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/model/typingSpeed.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { sum } from '../../../../../base/common/arrays.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ITextModel } from '../../../../common/model.js';
import { IModelContentChangedEvent } from '../../../../common/textModelEvents.js';

interface TypingSession {
	startTime: number;
	endTime: number;
	characterCount: number; // Effective character count for typing interval calculation
}

interface TypingIntervalResult {
	averageInterval: number; // Average milliseconds between keystrokes
	characterCount: number; // Number of characters involved in the computation
}

/**
 * Tracks typing speed as average milliseconds between keystrokes.
 * Higher values indicate slower typing.
 */
export class TypingInterval extends Disposable {

	private readonly _typingSessions: TypingSession[] = [];
	private _currentSession: TypingSession | null = null;
	private _lastChangeTime = 0;
	private _cachedTypingIntervalResult: TypingIntervalResult | null = null;
	private _cacheInvalidated = true;

	// Configuration constants
	private static readonly MAX_SESSION_GAP_MS = 3_000; // 3 seconds max gap between keystrokes in a session
	private static readonly MIN_SESSION_DURATION_MS = 1_000; // Minimum session duration to consider
	private static readonly SESSION_HISTORY_LIMIT = 50; // Keep last 50 sessions for calculation
	private static readonly TYPING_SPEED_WINDOW_MS = 300_000; // 5 minutes window for speed calculation
	private static readonly MIN_CHARS_FOR_RELIABLE_SPEED = 20; // Minimum characters needed for reliable speed calculation

	/**
	 * Gets the current typing interval as average milliseconds between keystrokes
	 * and the number of characters involved in the computation.
	 * Higher interval values indicate slower typing.
	 * Returns { interval: 0, characterCount: 0 } if no typing data is available.
	 */
	public getTypingInterval(): TypingIntervalResult {
		if (this._cacheInvalidated || this._cachedTypingIntervalResult === null) {
			this._cachedTypingIntervalResult = this._calculateTypingInterval();
			this._cacheInvalidated = false;
		}
		return this._cachedTypingIntervalResult;
	}

	constructor(private readonly _textModel: ITextModel) {
		super();

		this._register(this._textModel.onDidChangeContent(e => this._updateTypingSpeed(e)));
	}

	private _updateTypingSpeed(change: IModelContentChangedEvent): void {
		const now = Date.now();

		if (!this._isUserTyping(change)) {
			this._finalizeCurrentSession();
			return;
		}

		// If too much time has passed since last change, start a new session
		if (this._currentSession && (now - this._lastChangeTime) > TypingInterval.MAX_SESSION_GAP_MS) {
			this._finalizeCurrentSession();
		}

		// Start new session if none exists
		if (!this._currentSession) {
			this._currentSession = {
				startTime: now,
				endTime: now,
				characterCount: 0
			};
		}

		// Update current session
		this._currentSession.endTime = now;
		this._currentSession.characterCount += this._getActualCharacterCount(change);

		this._lastChangeTime = now;
		this._cacheInvalidated = true;
	}

	private _getActualCharacterCount(change: IModelContentChangedEvent): number {
		let totalChars = 0;
		for (const c of change.changes) {
			// Count characters added or removed (use the larger of the two)
			totalChars += Math.max(c.text.length, c.rangeLength);
		}
		return totalChars;
	}

	private _isUserTyping(change: IModelContentChangedEvent): boolean {
		// If no detailed reasons, assume user typing
		if (!change.detailedReasons || change.detailedReasons.length === 0) {
			return false;
		}

		// Check if any of the reasons indicate actual user typing
		for (const reason of change.detailedReasons) {
			if (this._isUserTypingReason(reason)) {
				return true;
			}
		}

		return false;
	}

	private _isUserTypingReason(reason: any): boolean {
		// Handle undo/redo - not considered user typing
		if (reason.metadata.isUndoing || reason.metadata.isRedoing) {
			return false;
		}

		// Handle different source types
		switch (reason.metadata.source) {
			case 'cursor': {
				// Direct user input via cursor
				const kind = reason.metadata.kind;
				return kind === 'type' || kind === 'compositionType' || kind === 'compositionEnd';
			}

			default:
				// All other sources (paste, suggestions, code actions, etc.) are not user typing
				return false;
		}
	}

	private _finalizeCurrentSession(): void {
		if (!this._currentSession) {
			return;
		}

		const sessionDuration = this._currentSession.endTime - this._currentSession.startTime;

		// Only keep sessions that meet minimum duration and have actual content
		if (sessionDuration >= TypingInterval.MIN_SESSION_DURATION_MS && this._currentSession.characterCount > 0) {
			this._typingSessions.push(this._currentSession);

			// Limit session history
			if (this._typingSessions.length > TypingInterval.SESSION_HISTORY_LIMIT) {
				this._typingSessions.shift();
			}
		}

		this._currentSession = null;
	}

	private _calculateTypingInterval(): TypingIntervalResult {
		// Finalize current session for calculation
		if (this._currentSession) {
			const tempSession = { ...this._currentSession };
			const sessionDuration = tempSession.endTime - tempSession.startTime;
			if (sessionDuration >= TypingInterval.MIN_SESSION_DURATION_MS && tempSession.characterCount > 0) {
				const allSessions = [...this._typingSessions, tempSession];
				return this._calculateSpeedFromSessions(allSessions);
			}
		}

		return this._calculateSpeedFromSessions(this._typingSessions);
	}

	private _calculateSpeedFromSessions(sessions: TypingSession[]): TypingIntervalResult {
		if (sessions.length === 0) {
			return { averageInterval: 0, characterCount: 0 };
		}

		// Sort sessions by recency (most recent first) to ensure we get the most recent sessions
		const sortedSessions = [...sessions].sort((a, b) => b.endTime - a.endTime);

		// First, try the standard window
		const cutoffTime = Date.now() - TypingInterval.TYPING_SPEED_WINDOW_MS;
		const recentSessions = sortedSessions.filter(session => session.endTime > cutoffTime);
		const olderSessions = sortedSessions.splice(recentSessions.length);

		let totalChars = sum(recentSessions.map(session => session.characterCount));

		// If we don't have enough characters in the standard window, expand to include older sessions
		for (let i = 0; i < olderSessions.length && totalChars < TypingInterval.MIN_CHARS_FOR_RELIABLE_SPEED; i++) {
			recentSessions.push(olderSessions[i]);
			totalChars += olderSessions[i].characterCount;
		}

		const totalTime = sum(recentSessions.map(session => session.endTime - session.startTime));
		if (totalTime === 0 || totalChars <= 1) {
			return { averageInterval: 0, characterCount: totalChars };
		}

		// Calculate average milliseconds between keystrokes
		const keystrokeIntervals = Math.max(1, totalChars - 1);
		const avgMsBetweenKeystrokes = totalTime / keystrokeIntervals;

		return {
			averageInterval: Math.round(avgMsBetweenKeystrokes),
			characterCount: totalChars
		};
	}

	/**
	 * Reset all typing speed data
	 */
	public reset(): void {
		this._typingSessions.length = 0;
		this._currentSession = null;
		this._lastChangeTime = 0;
		this._cachedTypingIntervalResult = null;
		this._cacheInvalidated = true;
	}

	public override dispose(): void {
		this._finalizeCurrentSession();
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineSuggestionsView.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineSuggestionsView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createStyleSheetFromObservable } from '../../../../../base/browser/domStylesheets.js';
import { createHotClass } from '../../../../../base/common/hotReloadHelpers.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { derived, mapObservableArrayCached, derivedDisposable, derivedObservableWithCache, IObservable, ISettableObservable, constObservable, observableValue } from '../../../../../base/common/observable.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { observableCodeEditor } from '../../../../browser/observableCodeEditor.js';
import { EditorOption } from '../../../../common/config/editorOptions.js';
import { LineRange } from '../../../../common/core/ranges/lineRange.js';
import { InlineCompletionsHintsWidget } from '../hintsWidget/inlineCompletionsHintsWidget.js';
import { GhostTextOrReplacement } from '../model/ghostText.js';
import { InlineCompletionsModel } from '../model/inlineCompletionsModel.js';
import { InlineCompletionItem } from '../model/inlineSuggestionItem.js';
import { convertItemsToStableObservables } from '../utils.js';
import { GhostTextView, GhostTextWidgetWarning, IGhostTextWidgetData } from './ghostText/ghostTextView.js';
import { InlineEditsGutterIndicator, InlineEditsGutterIndicatorData, InlineSuggestionGutterMenuData, SimpleInlineSuggestModel } from './inlineEdits/components/gutterIndicatorView.js';
import { InlineEditsOnboardingExperience } from './inlineEdits/inlineEditsNewUsers.js';
import { InlineCompletionViewKind, InlineEditTabAction } from './inlineEdits/inlineEditsViewInterface.js';
import { InlineEditsViewAndDiffProducer } from './inlineEdits/inlineEditsViewProducer.js';

export class InlineSuggestionsView extends Disposable {
	public static hot = createHotClass(this);

	private readonly _ghostTexts = derived(this, (reader) => {
		const model = this._model.read(reader);
		return model?.ghostTexts.read(reader) ?? [];
	});

	private readonly _stablizedGhostTexts;
	private readonly _editorObs;
	private readonly _ghostTextWidgets;

	private readonly _inlineEdit = derived(this, reader => this._model.read(reader)?.inlineEditState.read(reader)?.inlineSuggestion);
	private readonly _everHadInlineEdit = derivedObservableWithCache<boolean>(this,
		(reader, last) => last || !!this._inlineEdit.read(reader)
			|| !!this._model.read(reader)?.inlineCompletionState.read(reader)?.inlineSuggestion?.showInlineEditMenu
	);

	// To break a cyclic dependency
	private readonly _indicatorIsHoverVisible = observableValue<IObservable<boolean> | undefined>(this, undefined);

	private readonly _showInlineEditCollapsed = derived(this, reader => {
		const s = this._model.read(reader)?.showCollapsed.read(reader) ?? false;
		return s && !this._indicatorIsHoverVisible.read(reader)?.read(reader);
	});

	private readonly _inlineEditWidget = derivedDisposable(reader => {
		if (!this._everHadInlineEdit.read(reader)) {
			return undefined;
		}
		return this._instantiationService.createInstance(InlineEditsViewAndDiffProducer, this._editor, this._model, this._showInlineEditCollapsed);
	});

	private readonly _fontFamily;

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _model: IObservable<InlineCompletionsModel | undefined>,
		private readonly _focusIsInMenu: ISettableObservable<boolean>,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		super();

		this._stablizedGhostTexts = convertItemsToStableObservables(this._ghostTexts, this._store);
		this._editorObs = observableCodeEditor(this._editor);

		this._ghostTextWidgets = mapObservableArrayCached(
			this,
			this._stablizedGhostTexts,
			(ghostText, store) => store.add(this._createGhostText(ghostText))
		).recomputeInitiallyAndOnChange(this._store);

		this._inlineEditWidget.recomputeInitiallyAndOnChange(this._store);

		this._fontFamily = this._editorObs.getOption(EditorOption.inlineSuggest).map(val => val.fontFamily);

		this._register(createStyleSheetFromObservable(derived(reader => {
			const fontFamily = this._fontFamily.read(reader);
			return `
.monaco-editor .ghost-text-decoration,
.monaco-editor .ghost-text-decoration-preview,
.monaco-editor .ghost-text {
	font-family: ${fontFamily};
}`;
		})));

		this._register(new InlineCompletionsHintsWidget(this._editor, this._model, this._instantiationService));

		this._indicator = this._register(this._instantiationService.createInstance(
			InlineEditsGutterIndicator,
			this._editorObs,
			derived(reader => {
				const s = this._gutterIndicatorState.read(reader);
				if (!s) { return undefined; }
				return new InlineEditsGutterIndicatorData(
					InlineSuggestionGutterMenuData.fromInlineSuggestion(s.inlineSuggestion),
					s.displayRange,
					SimpleInlineSuggestModel.fromInlineCompletionModel(s.model),
					s.inlineSuggestion.action?.kind === 'edit' ? s.inlineSuggestion.action.alternativeAction : undefined,
				);
			}),
			this._gutterIndicatorState.map((s, reader) => s?.tabAction.read(reader) ?? InlineEditTabAction.Inactive),
			this._gutterIndicatorState.map((s, reader) => s?.gutterIndicatorOffset.read(reader) ?? 0),
			this._inlineEditWidget.map((w, reader) => w?.view.inlineEditsIsHovered.read(reader) ?? false),
			this._focusIsInMenu,
		));
		this._indicatorIsHoverVisible.set(this._indicator.isHoverVisible, undefined);

		derived(reader => {
			const w = this._inlineEditWidget.read(reader);
			if (!w) { return undefined; }
			return reader.store.add(this._instantiationService.createInstance(
				InlineEditsOnboardingExperience,
				w._inlineEditModel,
				constObservable(this._indicator),
				w.view._inlineCollapsedView,
			));
		}).recomputeInitiallyAndOnChange(this._store);
	}

	private _createGhostText(ghostText: IObservable<GhostTextOrReplacement>): GhostTextView {
		return this._instantiationService.createInstance(
			GhostTextView,
			this._editor,
			derived(reader => {
				const model = this._model.read(reader);
				const inlineCompletion = model?.inlineCompletionState.read(reader)?.inlineSuggestion;
				if (!model || !inlineCompletion) {
					// editor.suggest.preview: true causes situations where we have ghost text, but no suggest preview.
					return {
						ghostText: ghostText.read(reader),
						handleInlineCompletionShown: () => { /* no-op */ },
						warning: undefined,
					};
				}
				return {
					ghostText: ghostText.read(reader),
					handleInlineCompletionShown: (viewData) => model.handleInlineSuggestionShown(inlineCompletion, InlineCompletionViewKind.GhostText, viewData, Date.now()),
					warning: GhostTextWidgetWarning.from(model?.warning.read(reader)),
				} satisfies IGhostTextWidgetData;
			}),
			{
				useSyntaxHighlighting: this._editorObs.getOption(EditorOption.inlineSuggest).map(v => v.syntaxHighlightingEnabled),
			},
		);
	}

	public shouldShowHoverAtViewZone(viewZoneId: string): boolean {
		return this._ghostTextWidgets.get()[0]?.ownsViewZone(viewZoneId) ?? false;
	}

	private readonly _gutterIndicatorState = derived(reader => {
		const model = this._model.read(reader);
		if (!model) {
			return undefined;
		}

		const state = model.state.read(reader);

		if (state?.kind === 'ghostText' && state.inlineSuggestion?.showInlineEditMenu) {
			return {
				displayRange: LineRange.ofLength(state.primaryGhostText.lineNumber, 1),
				tabAction: derived<InlineEditTabAction>(this,
					reader => this._editorObs.isFocused.read(reader) ? InlineEditTabAction.Accept : InlineEditTabAction.Inactive
				),
				gutterIndicatorOffset: constObservable(getGhostTextTopOffset(state.inlineSuggestion, this._editor)),
				inlineSuggestion: state.inlineSuggestion,
				model,
			};
		} else if (state?.kind === 'inlineEdit') {
			const inlineEditWidget = this._inlineEditWidget.read(reader)?.view;
			if (!inlineEditWidget) { return undefined; }

			const displayRange = inlineEditWidget.displayRange.read(reader);
			if (!displayRange) { return undefined; }
			return {
				displayRange,
				tabAction: derived(reader => {
					if (this._editorObs.isFocused.read(reader)) {
						if (model.tabShouldJumpToInlineEdit.read(reader)) { return InlineEditTabAction.Jump; }
						if (model.tabShouldAcceptInlineEdit.read(reader)) { return InlineEditTabAction.Accept; }
					}
					return InlineEditTabAction.Inactive;
				}),
				gutterIndicatorOffset: inlineEditWidget.gutterIndicatorOffset,
				inlineSuggestion: state.inlineSuggestion,
				model,
			};
		} else {
			return undefined;
		}
	});

	protected readonly _indicator;
}

function getGhostTextTopOffset(inlineCompletion: InlineCompletionItem, editor: ICodeEditor): number {
	const replacement = inlineCompletion.getSingleTextEdit();
	const textModel = editor.getModel();
	if (!textModel) {
		return 0;
	}

	const EOL = textModel.getEOL();
	if (replacement.range.isEmpty() && replacement.text.startsWith(EOL)) {
		const lineHeight = editor.getLineHeightForPosition(replacement.range.getStartPosition());
		return countPrefixRepeats(replacement.text, EOL) * lineHeight;
	}

	return 0;
}

function countPrefixRepeats(str: string, prefix: string): number {
	if (!prefix.length) {
		return 0;
	}
	let count = 0;
	let i = 0;
	while (str.startsWith(prefix, i)) {
		count++;
		i += prefix.length;
	}
	return count;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/ghostText/ghostTextView.css]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/ghostText/ghostTextView.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .suggest-preview-additional-widget {
	white-space: nowrap;
}

.monaco-editor .suggest-preview-additional-widget .content-spacer {
	color: transparent;
	white-space: pre;
}

.monaco-editor .suggest-preview-additional-widget .button {
	display: inline-block;
	cursor: pointer;
	text-decoration: underline;
	text-underline-position: under;
}

.monaco-editor .ghost-text-hidden {
	opacity: 0;
	font-size: 0;
}

.monaco-editor .ghost-text-decoration,
.monaco-editor .suggest-preview-text .ghost-text {
	font-style: italic;
}

.monaco-editor .suggest-preview-text.clickable .view-line {
	z-index: 1;
}

.monaco-editor .ghost-text-decoration.clickable,
.monaco-editor .ghost-text-decoration-preview.clickable,
.monaco-editor .suggest-preview-text.clickable .ghost-text {
	cursor: pointer;
}

.monaco-editor .inline-completion-text-to-replace {
	text-decoration: underline;
	text-underline-position: under;
}

.monaco-editor .ghost-text-decoration,
.monaco-editor .ghost-text-decoration-preview,
.monaco-editor .suggest-preview-text .ghost-text {
	&.syntax-highlighted {
		opacity: 0.7;
	}
	&:not(.syntax-highlighted) {
		color: var(--vscode-editorGhostText-foreground);
	}
	background-color: var(--vscode-editorGhostText-background);
	border: 1px solid var(--vscode-editorGhostText-border);
}

.monaco-editor .ghost-text-decoration.warning,
.monaco-editor .ghost-text-decoration-preview.warning,
.monaco-editor .suggest-preview-text .ghost-text.warning {
	background: var(--monaco-editor-warning-decoration) repeat-x bottom left;
	border-bottom: 4px double var(--vscode-editorWarning-border);
}

.ghost-text-view-warning-widget-icon {
	.codicon {
		color: var(--vscode-editorWarning-foreground) !important;
	}
}

.monaco-editor {
	.edits-fadeout-decoration {
		opacity: var(--animation-opacity, 1);
		background-color: var(--vscode-inlineEdit-modifiedChangedTextBackground);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/ghostText/ghostTextView.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/ghostText/ghostTextView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createTrustedTypesPolicy } from '../../../../../../base/browser/trustedTypes.js';
import { renderIcon } from '../../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../../../base/common/event.js';
import { Disposable, DisposableStore, MutableDisposable, toDisposable } from '../../../../../../base/common/lifecycle.js';
import { IObservable, autorun, autorunWithStore, constObservable, derived, derivedOpts, observableSignalFromEvent, observableValue } from '../../../../../../base/common/observable.js';
import * as strings from '../../../../../../base/common/strings.js';
import { applyFontInfo } from '../../../../../browser/config/domFontInfo.js';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidgetPosition, IViewZoneChangeAccessor, MouseTargetType } from '../../../../../browser/editorBrowser.js';
import { observableCodeEditor } from '../../../../../browser/observableCodeEditor.js';
import { EditorFontLigatures, EditorOption, IComputedEditorOptions } from '../../../../../common/config/editorOptions.js';
import { StringEdit, StringReplacement } from '../../../../../common/core/edits/stringEdit.js';
import { Position } from '../../../../../common/core/position.js';
import { Range } from '../../../../../common/core/range.js';
import { StringBuilder } from '../../../../../common/core/stringBuilder.js';
import { IconPath, InlineCompletionWarning } from '../../../../../common/languages.js';
import { ILanguageService } from '../../../../../common/languages/language.js';
import { IModelDeltaDecoration, ITextModel, InjectedTextCursorStops, PositionAffinity } from '../../../../../common/model.js';
import { LineTokens } from '../../../../../common/tokens/lineTokens.js';
import { LineDecoration } from '../../../../../common/viewLayout/lineDecorations.js';
import { RenderLineInput, renderViewLine } from '../../../../../common/viewLayout/viewLineRenderer.js';
import { GhostText, GhostTextReplacement, IGhostTextLine } from '../../model/ghostText.js';
import { RangeSingleLine } from '../../../../../common/core/ranges/rangeSingleLine.js';
import { ColumnRange } from '../../../../../common/core/ranges/columnRange.js';
import { addDisposableListener, getWindow, isHTMLElement, n } from '../../../../../../base/browser/dom.js';
import './ghostTextView.css';
import { IMouseEvent, StandardMouseEvent } from '../../../../../../base/browser/mouseEvent.js';
import { CodeEditorWidget } from '../../../../../browser/widget/codeEditor/codeEditorWidget.js';
import { TokenWithTextArray } from '../../../../../common/tokens/tokenWithTextArray.js';
import { InlineCompletionViewData } from '../inlineEdits/inlineEditsViewInterface.js';
import { InlineDecorationType } from '../../../../../common/viewModel/inlineDecorations.js';
import { equals, sum } from '../../../../../../base/common/arrays.js';
import { equalsIfDefinedC, IEquatable, thisEqualsC } from '../../../../../../base/common/equals.js';

export interface IGhostTextWidgetData {
	readonly ghostText: GhostText | GhostTextReplacement;
	readonly warning: GhostTextWidgetWarning | undefined;
	handleInlineCompletionShown(viewData: InlineCompletionViewData): void;
}

export class GhostTextWidgetWarning {
	public static from(warning: InlineCompletionWarning | undefined): GhostTextWidgetWarning | undefined {
		if (!warning) {
			return undefined;
		}
		return new GhostTextWidgetWarning(warning.icon);
	}

	constructor(
		public readonly icon: IconPath = Codicon.warning,
	) { }
}

const USE_SQUIGGLES_FOR_WARNING = true;
const GHOST_TEXT_CLASS_NAME = 'ghost-text';

export class GhostTextView extends Disposable {
	private readonly _isDisposed = observableValue(this, false);
	private readonly _editorObs;
	private readonly _warningState = derived(reader => {
		const model = this._data.read(reader);
		const warning = model?.warning;
		if (!model || !warning) { return undefined; }
		const gt = model.ghostText;
		return { lineNumber: gt.lineNumber, position: new Position(gt.lineNumber, gt.parts[0].column), icon: warning.icon };
	});

	private readonly _onDidClick = this._register(new Emitter<IMouseEvent>());
	public readonly onDidClick = this._onDidClick.event;

	private readonly _extraClasses: readonly string[];
	private readonly _isClickable: boolean;
	private readonly _shouldKeepCursorStable: boolean;
	private readonly _minReservedLineCount: IObservable<number>;
	private readonly _useSyntaxHighlighting: IObservable<boolean>;

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _data: IObservable<IGhostTextWidgetData | undefined>,
		options: {
			extraClasses?: readonly string[]; // TODO@benibenj improve
			isClickable?: boolean;
			shouldKeepCursorStable?: boolean;
			minReservedLineCount?: IObservable<number>;
			useSyntaxHighlighting?: IObservable<boolean>;
		},
		@ILanguageService private readonly _languageService: ILanguageService
	) {
		super();

		this._extraClasses = options.extraClasses ?? [];
		this._isClickable = options.isClickable ?? false;
		this._shouldKeepCursorStable = options.shouldKeepCursorStable ?? false;
		this._minReservedLineCount = options.minReservedLineCount ?? constObservable(0);
		this._useSyntaxHighlighting = options.useSyntaxHighlighting ?? constObservable(true);

		this._editorObs = observableCodeEditor(this._editor);
		this._additionalLinesWidget = this._register(
			new AdditionalLinesWidget(
				this._editor,
				derivedOpts({ owner: this, equalsFn: equalsIfDefinedC(thisEqualsC()) }, reader => {
					/** @description lines */
					const uiState = this._state.read(reader);
					return uiState ? new AdditionalLinesData(
						uiState.lineNumber,
						uiState.additionalLines,
						uiState.additionalReservedLineCount,
					) : undefined;
				}),
				this._shouldKeepCursorStable,
				this._isClickable
			)
		);
		this._isInlineTextHovered = this._editorObs.isTargetHovered(
			p => p.target.type === MouseTargetType.CONTENT_TEXT &&
				p.target.detail.injectedText?.options.attachedData instanceof GhostTextAttachedData &&
				p.target.detail.injectedText.options.attachedData.owner === this,
			this._store
		);

		this._register(toDisposable(() => { this._isDisposed.set(true, undefined); }));
		this._register(this._editorObs.setDecorations(this._decorations));

		if (this._isClickable) {
			this._register(this._additionalLinesWidget.onDidClick((e) => this._onDidClick.fire(e)));
			this._register(this._editor.onMouseUp(e => {
				if (e.target.type !== MouseTargetType.CONTENT_TEXT) {
					return;
				}
				const a = e.target.detail.injectedText?.options.attachedData;
				if (a instanceof GhostTextAttachedData && a.owner === this) {
					this._onDidClick.fire(e.event);
				}
			}));
		}

		this._register(autorun(reader => {
			const state = this._state.read(reader);
			state?.handleInlineCompletionShown(state.telemetryViewData);
		}));

		this._register(autorunWithStore((reader, store) => {
			if (USE_SQUIGGLES_FOR_WARNING) {
				return;
			}

			const state = this._warningState.read(reader);
			if (!state) {
				return;
			}

			const lineHeight = this._editorObs.getOption(EditorOption.lineHeight);
			store.add(this._editorObs.createContentWidget({
				position: constObservable<IContentWidgetPosition>({
					position: new Position(state.lineNumber, Number.MAX_SAFE_INTEGER),
					preference: [ContentWidgetPositionPreference.EXACT],
					positionAffinity: PositionAffinity.Right,
				}),
				allowEditorOverflow: false,
				domNode: n.div({
					class: 'ghost-text-view-warning-widget',
					style: {
						width: lineHeight,
						height: lineHeight,
						marginLeft: 4,
						color: 'orange',
					},
					ref: (dom) => {
						// eslint-disable-next-line local/code-no-any-casts
						(dom as any as WidgetDomElement).ghostTextViewWarningWidgetData = { range: Range.fromPositions(state.position) };
					}
				}, [
					n.div({
						class: 'ghost-text-view-warning-widget-icon',
						style: {
							width: '100%',
							height: '100%',
							display: 'flex',
							alignContent: 'center',
							alignItems: 'center',
						}
					},
						[renderIcon(state.icon)]
					)
				]).keepUpdated(store).element,
			}));
		}));
	}

	public static getWarningWidgetContext(domNode: HTMLElement): { range: Range } | undefined {
		// eslint-disable-next-line local/code-no-any-casts
		const data = (domNode as any as WidgetDomElement).ghostTextViewWarningWidgetData;
		if (data) {
			return data;
		} else if (domNode.parentElement) {
			return this.getWarningWidgetContext(domNode.parentElement);
		}
		return undefined;
	}

	private readonly _extraClassNames = derived(this, reader => {
		const extraClasses = this._extraClasses.slice();
		if (this._useSyntaxHighlighting.read(reader)) {
			extraClasses.push('syntax-highlighted');
		}
		if (USE_SQUIGGLES_FOR_WARNING && this._warningState.read(reader)) {
			extraClasses.push('warning');
		}
		const extraClassNames = extraClasses.map(c => ` ${c}`).join('');
		return extraClassNames;
	});

	private readonly _state = derived(this, reader => {
		if (this._isDisposed.read(reader)) { return undefined; }

		const props = this._data.read(reader);
		if (!props) { return undefined; }

		const textModel = this._editorObs.model.read(reader);
		if (!textModel) { return undefined; }

		const ghostText = props.ghostText;
		const replacedRange = ghostText instanceof GhostTextReplacement ? ghostText.columnRange : undefined;

		const syntaxHighlightingEnabled = this._useSyntaxHighlighting.read(reader);
		const extraClassNames = this._extraClassNames.read(reader);
		const { inlineTexts, additionalLines, hiddenRange, additionalLinesOriginalSuffix } = computeGhostTextViewData(ghostText, textModel, GHOST_TEXT_CLASS_NAME + extraClassNames);

		const currentLine = textModel.getLineContent(ghostText.lineNumber);
		const edit = new StringEdit(inlineTexts.map(t => StringReplacement.insert(t.column - 1, t.text)));
		const tokens = syntaxHighlightingEnabled ? textModel.tokenization.tokenizeLinesAt(ghostText.lineNumber, [edit.apply(currentLine), ...additionalLines.map(l => l.content)]) : undefined;
		const newRanges = edit.getNewRanges();
		const inlineTextsWithTokens = inlineTexts.map((t, idx) => ({ ...t, tokens: tokens?.[0]?.getTokensInRange(newRanges[idx]) }));

		const tokenizedAdditionalLines: LineData[] = additionalLines.map((l, idx) => {
			let content = tokens?.[idx + 1] ?? LineTokens.createEmpty(l.content, this._languageService.languageIdCodec);
			if (idx === additionalLines.length - 1 && additionalLinesOriginalSuffix) {
				const t = TokenWithTextArray.fromLineTokens(textModel.tokenization.getLineTokens(additionalLinesOriginalSuffix.lineNumber));
				const existingContent = t.slice(additionalLinesOriginalSuffix.columnRange.toZeroBasedOffsetRange());
				content = TokenWithTextArray.fromLineTokens(content).append(existingContent).toLineTokens(content.languageIdCodec);
			}
			return new LineData(
				content,
				l.decorations,
			);
		});

		const cursorColumn = this._editor.getSelection()?.getStartPosition().column!;
		const disjointInlineTexts = inlineTextsWithTokens.filter(inline => inline.text !== '');
		const hasInsertionOnCurrentLine = disjointInlineTexts.length !== 0;
		const telemetryViewData = new InlineCompletionViewData(
			(hasInsertionOnCurrentLine ? disjointInlineTexts[0].column : 1) - cursorColumn,
			hasInsertionOnCurrentLine ? 0 : (additionalLines.findIndex(line => line.content !== '') + 1),
			hasInsertionOnCurrentLine ? 1 : 0,
			additionalLines.length + (hasInsertionOnCurrentLine ? 1 : 0),
			0,
			sum(disjointInlineTexts.map(inline => inline.text.length)) + sum(tokenizedAdditionalLines.map(line => line.content.getTextLength())),
			disjointInlineTexts.length + (additionalLines.length > 0 ? 1 : 0),
			disjointInlineTexts.length > 1 && tokenizedAdditionalLines.length === 0 ? disjointInlineTexts.every(inline => inline.text === disjointInlineTexts[0].text) : undefined
		);

		return {
			replacedRange,
			inlineTexts: inlineTextsWithTokens,
			additionalLines: tokenizedAdditionalLines,
			hiddenRange,
			lineNumber: ghostText.lineNumber,
			additionalReservedLineCount: this._minReservedLineCount.read(reader),
			targetTextModel: textModel,
			syntaxHighlightingEnabled,
			telemetryViewData,
			handleInlineCompletionShown: props.handleInlineCompletionShown,
		};
	});

	private readonly _decorations = derived(this, reader => {
		const uiState = this._state.read(reader);
		if (!uiState) { return []; }

		const decorations: IModelDeltaDecoration[] = [];

		const extraClassNames = this._extraClassNames.read(reader);

		if (uiState.replacedRange) {
			decorations.push({
				range: uiState.replacedRange.toRange(uiState.lineNumber),
				options: { inlineClassName: 'inline-completion-text-to-replace' + extraClassNames, description: 'GhostTextReplacement' }
			});
		}

		if (uiState.hiddenRange) {
			decorations.push({
				range: uiState.hiddenRange.toRange(uiState.lineNumber),
				options: { inlineClassName: 'ghost-text-hidden', description: 'ghost-text-hidden', }
			});
		}

		for (const p of uiState.inlineTexts) {
			decorations.push({
				range: Range.fromPositions(new Position(uiState.lineNumber, p.column)),
				options: {
					description: 'ghost-text-decoration',
					after: {
						content: p.text,
						tokens: p.tokens,
						inlineClassName: (p.preview ? 'ghost-text-decoration-preview' : 'ghost-text-decoration')
							+ (this._isClickable ? ' clickable' : '')
							+ extraClassNames
							+ p.lineDecorations.map(d => ' ' + d.className).join(' '), // TODO: take the ranges into account for line decorations
						cursorStops: InjectedTextCursorStops.Left,
						attachedData: new GhostTextAttachedData(this),
					},
					showIfCollapsed: true,
				}
			});
		}

		return decorations;
	});

	private readonly _additionalLinesWidget;

	private readonly _isInlineTextHovered;

	public readonly isHovered = derived(this, reader => {
		if (this._isDisposed.read(reader)) { return false; }
		return this._isInlineTextHovered.read(reader) || this._additionalLinesWidget.isHovered.read(reader);
	});

	public readonly height = derived(this, reader => {
		const lineHeight = this._editorObs.getOption(EditorOption.lineHeight).read(reader);
		return lineHeight + (this._additionalLinesWidget.viewZoneHeight.read(reader) ?? 0);
	});

	public ownsViewZone(viewZoneId: string): boolean {
		return this._additionalLinesWidget.viewZoneId === viewZoneId;
	}
}

class GhostTextAttachedData {
	constructor(public readonly owner: GhostTextView) { }
}

interface WidgetDomElement {
	ghostTextViewWarningWidgetData?: {
		range: Range;
	};
}

function computeGhostTextViewData(ghostText: GhostText | GhostTextReplacement, textModel: ITextModel, ghostTextClassName: string) {
	const inlineTexts: { column: number; text: string; preview: boolean; lineDecorations: LineDecoration[] }[] = [];
	const additionalLines: { content: string; decorations: LineDecoration[] }[] = [];

	function addToAdditionalLines(ghLines: readonly IGhostTextLine[], className: string | undefined) {
		if (additionalLines.length > 0) {
			const lastLine = additionalLines[additionalLines.length - 1];
			if (className) {
				lastLine.decorations.push(new LineDecoration(
					lastLine.content.length + 1,
					lastLine.content.length + 1 + ghLines[0].line.length,
					className,
					InlineDecorationType.Regular
				));
			}
			lastLine.content += ghLines[0].line;

			ghLines = ghLines.slice(1);
		}
		for (const ghLine of ghLines) {
			additionalLines.push({
				content: ghLine.line,
				decorations: className ? [new LineDecoration(
					1,
					ghLine.line.length + 1,
					className,
					InlineDecorationType.Regular
				), ...ghLine.lineDecorations] : [...ghLine.lineDecorations]
			});
		}
	}

	const textBufferLine = textModel.getLineContent(ghostText.lineNumber);

	let hiddenTextStartColumn: number | undefined = undefined;
	let lastIdx = 0;
	for (const part of ghostText.parts) {
		let ghLines = part.lines;
		if (hiddenTextStartColumn === undefined) {
			inlineTexts.push({ column: part.column, text: ghLines[0].line, preview: part.preview, lineDecorations: ghLines[0].lineDecorations });
			ghLines = ghLines.slice(1);
		} else {
			addToAdditionalLines([{ line: textBufferLine.substring(lastIdx, part.column - 1), lineDecorations: [] }], undefined);
		}

		if (ghLines.length > 0) {
			addToAdditionalLines(ghLines, ghostTextClassName);
			if (hiddenTextStartColumn === undefined && part.column <= textBufferLine.length) {
				hiddenTextStartColumn = part.column;
			}
		}

		lastIdx = part.column - 1;
	}
	let additionalLinesOriginalSuffix: RangeSingleLine | undefined = undefined;
	if (hiddenTextStartColumn !== undefined) {
		additionalLinesOriginalSuffix = new RangeSingleLine(ghostText.lineNumber, new ColumnRange(lastIdx + 1, textBufferLine.length + 1));
	}

	const hiddenRange = hiddenTextStartColumn !== undefined ? new ColumnRange(hiddenTextStartColumn, textBufferLine.length + 1) : undefined;

	return {
		inlineTexts,
		additionalLines,
		hiddenRange,
		additionalLinesOriginalSuffix,
	};
}

class AdditionalLinesData implements IEquatable<AdditionalLinesData> {
	constructor(
		public readonly lineNumber: number,
		public readonly additionalLines: readonly LineData[],
		public readonly minReservedLineCount: number,
	) { }

	equals(other: AdditionalLinesData): boolean {
		if (this.lineNumber !== other.lineNumber) {
			return false;
		}
		if (this.minReservedLineCount !== other.minReservedLineCount) {
			return false;
		}
		return equals(this.additionalLines, other.additionalLines, thisEqualsC());
	}
}

export class AdditionalLinesWidget extends Disposable {
	private _viewZoneInfo: { viewZoneId: string; heightInLines: number; lineNumber: number } | undefined;
	public get viewZoneId(): string | undefined { return this._viewZoneInfo?.viewZoneId; }

	private _viewZoneHeight;
	public get viewZoneHeight(): IObservable<number | undefined> { return this._viewZoneHeight; }

	private readonly editorOptionsChanged;

	private readonly _onDidClick;
	public readonly onDidClick;

	private readonly _viewZoneListener;

	readonly isHovered;

	private hasBeenAccepted;

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _lines: IObservable<AdditionalLinesData | undefined>,
		private readonly _shouldKeepCursorStable: boolean,
		private readonly _isClickable: boolean,
	) {
		super();
		this._viewZoneHeight = observableValue<undefined | number>('viewZoneHeight', undefined);
		this.editorOptionsChanged = observableSignalFromEvent('editorOptionChanged', Event.filter(
			this._editor.onDidChangeConfiguration,
			e => e.hasChanged(EditorOption.disableMonospaceOptimizations)
				|| e.hasChanged(EditorOption.stopRenderingLineAfter)
				|| e.hasChanged(EditorOption.renderWhitespace)
				|| e.hasChanged(EditorOption.renderControlCharacters)
				|| e.hasChanged(EditorOption.fontLigatures)
				|| e.hasChanged(EditorOption.fontInfo)
				|| e.hasChanged(EditorOption.lineHeight)
		));
		this._onDidClick = this._register(new Emitter<IMouseEvent>());
		this.onDidClick = this._onDidClick.event;
		this._viewZoneListener = this._register(new MutableDisposable());
		this.isHovered = observableCodeEditor(this._editor).isTargetHovered(
			p => isTargetGhostText(p.target.element),
			this._store
		);
		this.hasBeenAccepted = false;

		if (this._editor instanceof CodeEditorWidget && this._shouldKeepCursorStable) {
			this._register(this._editor.onBeforeExecuteEdit(e => this.hasBeenAccepted = e.source === 'inlineSuggestion.accept'));
		}

		this._register(autorun(reader => {
			/** @description update view zone */
			const lines = this._lines.read(reader);
			this.editorOptionsChanged.read(reader);

			if (lines) {
				this.hasBeenAccepted = false;
				this.updateLines(lines.lineNumber, lines.additionalLines, lines.minReservedLineCount);
			} else {
				this.clear();
			}
		}));
	}

	public override dispose(): void {
		super.dispose();
		this.clear();
	}

	private clear(): void {
		this._viewZoneListener.clear();

		this._editor.changeViewZones((changeAccessor) => {
			this.removeActiveViewZone(changeAccessor);
		});
	}

	private updateLines(lineNumber: number, additionalLines: readonly LineData[], minReservedLineCount: number): void {
		const textModel = this._editor.getModel();
		if (!textModel) {
			return;
		}

		const { tabSize } = textModel.getOptions();

		observableCodeEditor(this._editor).transaction(_ => {
			this._editor.changeViewZones((changeAccessor) => {
				const store = new DisposableStore();

				this.removeActiveViewZone(changeAccessor);

				const heightInLines = Math.max(additionalLines.length, minReservedLineCount);
				if (heightInLines > 0) {
					const domNode = document.createElement('div');
					renderLines(domNode, tabSize, additionalLines, this._editor.getOptions(), this._isClickable);

					if (this._isClickable) {
						store.add(addDisposableListener(domNode, 'mousedown', (e) => {
							e.preventDefault(); // This prevents that the editor loses focus
						}));
						store.add(addDisposableListener(domNode, 'click', (e) => {
							if (isTargetGhostText(e.target)) {
								this._onDidClick.fire(new StandardMouseEvent(getWindow(e), e));
							}
						}));
					}

					this.addViewZone(changeAccessor, lineNumber, heightInLines, domNode);
				}

				this._viewZoneListener.value = store;
			});
		});
	}

	private addViewZone(changeAccessor: IViewZoneChangeAccessor, afterLineNumber: number, heightInLines: number, domNode: HTMLElement): void {
		const id = changeAccessor.addZone({
			afterLineNumber: afterLineNumber,
			heightInLines: heightInLines,
			domNode,
			afterColumnAffinity: PositionAffinity.Right,
			onComputedHeight: (height: number) => {
				this._viewZoneHeight.set(height, undefined); // TODO: can a transaction be used to avoid flickering?
			}
		});

		this.keepCursorStable(afterLineNumber, heightInLines);

		this._viewZoneInfo = { viewZoneId: id, heightInLines, lineNumber: afterLineNumber };
	}

	private removeActiveViewZone(changeAccessor: IViewZoneChangeAccessor): void {
		if (this._viewZoneInfo) {
			changeAccessor.removeZone(this._viewZoneInfo.viewZoneId);

			if (!this.hasBeenAccepted) {
				this.keepCursorStable(this._viewZoneInfo.lineNumber, -this._viewZoneInfo.heightInLines);
			}

			this._viewZoneInfo = undefined;
			this._viewZoneHeight.set(undefined, undefined);
		}
	}

	private keepCursorStable(lineNumber: number, heightInLines: number): void {
		if (!this._shouldKeepCursorStable) {
			return;
		}

		const cursorLineNumber = this._editor.getSelection()?.getStartPosition()?.lineNumber;
		if (cursorLineNumber !== undefined && lineNumber < cursorLineNumber) {
			this._editor.setScrollTop(this._editor.getScrollTop() + heightInLines * this._editor.getOption(EditorOption.lineHeight));
		}
	}
}

function isTargetGhostText(target: EventTarget | null): boolean {
	return isHTMLElement(target) && target.classList.contains(GHOST_TEXT_CLASS_NAME);
}

export class LineData implements IEquatable<LineData> {
	constructor(
		public readonly content: LineTokens, // Must not contain a linebreak!
		public readonly decorations: readonly LineDecoration[]
	) { }

	equals(other: LineData): boolean {
		if (!this.content.equals(other.content)) {
			return false;
		}
		return LineDecoration.equalsArr(this.decorations, other.decorations);
	}
}

function renderLines(domNode: HTMLElement, tabSize: number, lines: readonly LineData[], opts: IComputedEditorOptions, isClickable: boolean): void {
	const disableMonospaceOptimizations = opts.get(EditorOption.disableMonospaceOptimizations);
	const stopRenderingLineAfter = opts.get(EditorOption.stopRenderingLineAfter);
	// To avoid visual confusion, we don't want to render visible whitespace
	const renderWhitespace = 'none';
	const renderControlCharacters = opts.get(EditorOption.renderControlCharacters);
	const fontLigatures = opts.get(EditorOption.fontLigatures);
	const fontInfo = opts.get(EditorOption.fontInfo);
	const lineHeight = opts.get(EditorOption.lineHeight);

	let classNames = 'suggest-preview-text';
	if (isClickable) {
		classNames += ' clickable';
	}

	const sb = new StringBuilder(10000);
	sb.appendString(`<div class="${classNames}">`);

	for (let i = 0, len = lines.length; i < len; i++) {
		const lineData = lines[i];
		const lineTokens = lineData.content;
		sb.appendString('<div class="view-line');
		sb.appendString('" style="top:');
		sb.appendString(String(i * lineHeight));
		sb.appendString('px;width:1000000px;">');

		const line = lineTokens.getLineContent();
		const isBasicASCII = strings.isBasicASCII(line);
		const containsRTL = strings.containsRTL(line);

		renderViewLine(new RenderLineInput(
			(fontInfo.isMonospace && !disableMonospaceOptimizations),
			fontInfo.canUseHalfwidthRightwardsArrow,
			line,
			false,
			isBasicASCII,
			containsRTL,
			0,
			lineTokens,
			lineData.decorations.slice(),
			tabSize,
			0,
			fontInfo.spaceWidth,
			fontInfo.middotWidth,
			fontInfo.wsmiddotWidth,
			stopRenderingLineAfter,
			renderWhitespace,
			renderControlCharacters,
			fontLigatures !== EditorFontLigatures.OFF,
			null,
			null,
			0
		), sb);

		sb.appendString('</div>');
	}
	sb.appendString('</div>');

	applyFontInfo(domNode, fontInfo);
	const html = sb.build();
	const trustedhtml = ttPolicy ? ttPolicy.createHTML(html) : html;
	domNode.innerHTML = trustedhtml as string;
}

export const ttPolicy = createTrustedTypesPolicy('editorGhostText', { createHTML: value => value });
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsModel.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../../../base/common/event.js';
import { derived, IObservable } from '../../../../../../base/common/observable.js';
import { setTimeout0 } from '../../../../../../base/common/platform.js';
import { InlineCompletionsModel, isSuggestionInViewport } from '../../model/inlineCompletionsModel.js';
import { InlineSuggestHint } from '../../model/inlineSuggestionItem.js';
import { InlineCompletionViewData, InlineCompletionViewKind, InlineEditTabAction } from './inlineEditsViewInterface.js';
import { InlineEditWithChanges } from './inlineEditWithChanges.js';

/**
 * Warning: This is not per inline edit id and gets created often.
 * @deprecated TODO@hediet remove
*/
export class ModelPerInlineEdit {

	readonly isInDiffEditor: boolean;

	readonly displayLocation: InlineSuggestHint | undefined;


	/** Determines if the inline suggestion is fully in the view port */
	readonly inViewPort: IObservable<boolean>;

	readonly onDidAccept: Event<void>;

	constructor(
		private readonly _model: InlineCompletionsModel,
		readonly inlineEdit: InlineEditWithChanges,
		readonly tabAction: IObservable<InlineEditTabAction>,
	) {
		this.isInDiffEditor = this._model.isInDiffEditor;

		this.displayLocation = this.inlineEdit.inlineCompletion.hint;

		this.inViewPort = derived(this, reader => isSuggestionInViewport(this._model.editor, this.inlineEdit.inlineCompletion, reader));
		this.onDidAccept = this._model.onDidAccept;
	}

	accept(alternativeAction?: boolean) {
		this._model.accept(undefined, alternativeAction);
	}

	handleInlineEditShownNextFrame(viewKind: InlineCompletionViewKind, viewData: InlineCompletionViewData) {
		const item = this.inlineEdit.inlineCompletion;
		const timeWhenShown = Date.now();
		item.addRef();
		setTimeout0(() => {
			this._model.handleInlineSuggestionShown(item, viewKind, viewData, timeWhenShown);
			item.removeRef();
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsNewUsers.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsNewUsers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../../../base/common/async.js';
import { BugIndicatingError } from '../../../../../../base/common/errors.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable } from '../../../../../../base/common/lifecycle.js';
import { autorun, derived, IObservable, observableValue, runOnChange, runOnChangeWithCancellationToken } from '../../../../../../base/common/observable.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../../platform/storage/common/storage.js';
import { InlineEditsGutterIndicator } from './components/gutterIndicatorView.js';
import { ModelPerInlineEdit } from './inlineEditsModel.js';
import { InlineEditsCollapsedView } from './inlineEditsViews/inlineEditsCollapsedView.js';

enum UserKind {
	FirstTime = 'firstTime',
	SecondTime = 'secondTime',
	Active = 'active'
}

export class InlineEditsOnboardingExperience extends Disposable {

	private readonly _disposables = this._register(new MutableDisposable());

	private readonly _setupDone = observableValue({ name: 'setupDone' }, false);

	private readonly _activeCompletionId = derived<string | undefined>(reader => {
		const model = this._model.read(reader);
		if (!model) { return undefined; }

		if (!this._setupDone.read(reader)) { return undefined; }

		const indicator = this._indicator.read(reader);
		if (!indicator || !indicator.isVisible.read(reader)) { return undefined; }

		return model.inlineEdit.inlineCompletion.identity.id;
	});

	constructor(
		private readonly _model: IObservable<ModelPerInlineEdit | undefined>,
		private readonly _indicator: IObservable<InlineEditsGutterIndicator | undefined>,
		private readonly _collapsedView: InlineEditsCollapsedView,
		@IStorageService private readonly _storageService: IStorageService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		super();

		this._register(this._initializeDebugSetting());

		// Setup the onboarding experience for new users
		this._disposables.value = this.setupNewUserExperience();

		this._setupDone.set(true, undefined);
	}

	private setupNewUserExperience(): IDisposable | undefined {
		if (this.getNewUserType() === UserKind.Active) {
			return undefined;
		}

		const disposableStore = new DisposableStore();

		let userHasHoveredOverIcon = false;
		let inlineEditHasBeenAccepted = false;
		let firstTimeUserAnimationCount = 0;
		let secondTimeUserAnimationCount = 0;

		// pulse animation for new users
		disposableStore.add(runOnChangeWithCancellationToken(this._activeCompletionId, async (id, _, __, token) => {
			if (id === undefined) { return; }
			let userType = this.getNewUserType();

			// User Kind Transition
			switch (userType) {
				case UserKind.FirstTime: {
					if (firstTimeUserAnimationCount++ >= 5 || userHasHoveredOverIcon) {
						userType = UserKind.SecondTime;
						this.setNewUserType(userType);
					}
					break;
				}
				case UserKind.SecondTime: {
					if (secondTimeUserAnimationCount++ >= 3 && inlineEditHasBeenAccepted) {
						userType = UserKind.Active;
						this.setNewUserType(userType);
					}
					break;
				}
			}

			// Animation
			switch (userType) {
				case UserKind.FirstTime: {
					for (let i = 0; i < 3 && !token.isCancellationRequested; i++) {
						await this._indicator.get()?.triggerAnimation();
						await timeout(500);
					}
					break;
				}
				case UserKind.SecondTime: {
					this._indicator.get()?.triggerAnimation();
					break;
				}
			}
		}));

		disposableStore.add(autorun(reader => {
			if (this._collapsedView.isVisible.read(reader)) {
				if (this.getNewUserType() !== UserKind.Active) {
					this._collapsedView.triggerAnimation();
				}
			}
		}));

		// Remember when the user has hovered over the icon
		disposableStore.add(autorun((reader) => {
			const indicator = this._indicator.read(reader);
			if (!indicator) { return; }
			reader.store.add(runOnChange(indicator.isHoveredOverIcon, async (isHovered) => {
				if (isHovered) {
					userHasHoveredOverIcon = true;
				}
			}));
		}));

		// Remember when the user has accepted an inline edit
		disposableStore.add(autorun((reader) => {
			const model = this._model.read(reader);
			if (!model) { return; }
			reader.store.add(model.onDidAccept(() => {
				inlineEditHasBeenAccepted = true;
			}));
		}));

		return disposableStore;
	}

	private getNewUserType(): UserKind {
		return this._storageService.get('inlineEditsGutterIndicatorUserKind', StorageScope.APPLICATION, UserKind.FirstTime) as UserKind;
	}

	private setNewUserType(value: UserKind): void {
		switch (value) {
			case UserKind.FirstTime:
				throw new BugIndicatingError('UserKind should not be set to first time');
			case UserKind.SecondTime:
				break;
			case UserKind.Active:
				this._disposables.clear();
				break;
		}

		this._storageService.store('inlineEditsGutterIndicatorUserKind', value, StorageScope.APPLICATION, StorageTarget.USER);
	}

	private _initializeDebugSetting(): IDisposable {
		// Debug setting to reset the new user experience
		const hiddenDebugSetting = 'editor.inlineSuggest.edits.resetNewUserExperience';
		if (this._configurationService.getValue(hiddenDebugSetting)) {
			this._storageService.remove('inlineEditsGutterIndicatorUserKind', StorageScope.APPLICATION);
		}

		const disposable = this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(hiddenDebugSetting) && this._configurationService.getValue(hiddenDebugSetting)) {
				this._storageService.remove('inlineEditsGutterIndicatorUserKind', StorageScope.APPLICATION);
				this._disposables.value = this.setupNewUserExperience();
			}
		});

		return disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsView.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $ } from '../../../../../../base/browser/dom.js';
import { equals } from '../../../../../../base/common/equals.js';
import { BugIndicatingError, onUnexpectedError } from '../../../../../../base/common/errors.js';
import { Event } from '../../../../../../base/common/event.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { autorun, derived, derivedOpts, IObservable, IReader, mapObservableArrayCached, observableValue } from '../../../../../../base/common/observable.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { ICodeEditor } from '../../../../../browser/editorBrowser.js';
import { ObservableCodeEditor, observableCodeEditor } from '../../../../../browser/observableCodeEditor.js';
import { EditorOption } from '../../../../../common/config/editorOptions.js';
import { TextReplacement } from '../../../../../common/core/edits/textEdit.js';
import { Position } from '../../../../../common/core/position.js';
import { Range } from '../../../../../common/core/range.js';
import { LineRange } from '../../../../../common/core/ranges/lineRange.js';
import { AbstractText, StringText } from '../../../../../common/core/text/abstractText.js';
import { TextLength } from '../../../../../common/core/text/textLength.js';
import { DetailedLineRangeMapping, lineRangeMappingFromRangeMappings, RangeMapping } from '../../../../../common/diff/rangeMapping.js';
import { ITextModel } from '../../../../../common/model.js';
import { TextModel } from '../../../../../common/model/textModel.js';
import { InlineSuggestionIdentity } from '../../model/inlineSuggestionItem.js';
import { InlineSuggestionGutterMenuData, SimpleInlineSuggestModel } from './components/gutterIndicatorView.js';
import { InlineEditWithChanges } from './inlineEditWithChanges.js';
import { ModelPerInlineEdit } from './inlineEditsModel.js';
import { InlineCompletionViewData, InlineCompletionViewKind, InlineEditTabAction } from './inlineEditsViewInterface.js';
import { InlineEditsCollapsedView } from './inlineEditsViews/inlineEditsCollapsedView.js';
import { InlineEditsCustomView } from './inlineEditsViews/inlineEditsCustomView.js';
import { InlineEditsDeletionView } from './inlineEditsViews/inlineEditsDeletionView.js';
import { InlineEditsInsertionView } from './inlineEditsViews/inlineEditsInsertionView.js';
import { InlineEditsLineReplacementView } from './inlineEditsViews/inlineEditsLineReplacementView.js';
import { ILongDistanceHint, ILongDistanceViewState, InlineEditsLongDistanceHint } from './inlineEditsViews/longDistanceHint/inlineEditsLongDistanceHint.js';
import { InlineEditsSideBySideView } from './inlineEditsViews/inlineEditsSideBySideView.js';
import { InlineEditsWordReplacementView, WordReplacementsViewData } from './inlineEditsViews/inlineEditsWordReplacementView.js';
import { IOriginalEditorInlineDiffViewState, OriginalEditorInlineDiffView } from './inlineEditsViews/originalEditorInlineDiffView.js';
import { applyEditToModifiedRangeMappings, createReindentEdit } from './utils/utils.js';
import './view.css';
import { JumpToView } from './inlineEditsViews/jumpToView.js';
import { StringEdit } from '../../../../../common/core/edits/stringEdit.js';
import { OffsetRange } from '../../../../../common/core/ranges/offsetRange.js';
import { getPositionOffsetTransformerFromTextModel } from '../../../../../common/core/text/getPositionOffsetTransformerFromTextModel.js';

export class InlineEditsView extends Disposable {
	private readonly _editorObs: ObservableCodeEditor;

	private readonly _useCodeShifting;
	private readonly _renderSideBySide;
	private readonly _tabAction = derived<InlineEditTabAction>(reader => this._model.read(reader)?.tabAction.read(reader) ?? InlineEditTabAction.Inactive);

	private _previousView: { // TODO, move into identity
		id: string;
		view: ReturnType<typeof InlineEditsView.prototype._determineView>;
		editorWidth: number;
		timestamp: number;
	} | undefined;
	private readonly _showLongDistanceHint: IObservable<boolean>;

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _model: IObservable<ModelPerInlineEdit | undefined>,
		private readonly _simpleModel: IObservable<SimpleInlineSuggestModel | undefined>,
		private readonly _inlineSuggestInfo: IObservable<InlineSuggestionGutterMenuData | undefined>,
		private readonly _showCollapsed: IObservable<boolean>,

		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		super();
		this._editorObs = observableCodeEditor(this._editor);
		this._constructorDone = observableValue(this, false);

		this._previewTextModel = this._register(this._instantiationService.createInstance(
			TextModel,
			'',
			this._editor.getModel()!.getLanguageId(),
			{ ...TextModel.DEFAULT_CREATION_OPTIONS, bracketPairColorizationOptions: { enabled: true, independentColorPoolPerBracketType: false } },
			null
		));

		this._sideBySide = this._register(this._instantiationService.createInstance(InlineEditsSideBySideView,
			this._editor,
			this._model.map(m => m?.inlineEdit),
			this._previewTextModel,
			this._uiState.map(s => s && s.state?.kind === InlineCompletionViewKind.SideBySide ? ({
				newTextLineCount: s.newTextLineCount,
				isInDiffEditor: s.isInDiffEditor,
			}) : undefined),
			this._tabAction,
		));
		this._deletion = this._register(this._instantiationService.createInstance(InlineEditsDeletionView,
			this._editor,
			this._model.map(m => m?.inlineEdit),
			this._uiState.map(s => s && s.state?.kind === InlineCompletionViewKind.Deletion ? ({
				originalRange: s.state.originalRange,
				deletions: s.state.deletions,
				inDiffEditor: s.isInDiffEditor,
			}) : undefined),
			this._tabAction,
		));
		this._insertion = this._register(this._instantiationService.createInstance(InlineEditsInsertionView,
			this._editor,
			this._uiState.map(s => s && s.state?.kind === InlineCompletionViewKind.InsertionMultiLine ? ({
				lineNumber: s.state.lineNumber,
				startColumn: s.state.column,
				text: s.state.text,
				inDiffEditor: s.isInDiffEditor,
			}) : undefined),
			this._tabAction,
		));

		this._inlineCollapsedView = this._register(this._instantiationService.createInstance(InlineEditsCollapsedView,
			this._editor,
			this._model.map((m, reader) => this._uiState.read(reader)?.state?.kind === InlineCompletionViewKind.Collapsed ? m?.inlineEdit : undefined)
		));
		this._customView = this._register(this._instantiationService.createInstance(InlineEditsCustomView,
			this._editor,
			this._model.map((m, reader) => this._uiState.read(reader)?.state?.kind === InlineCompletionViewKind.Custom ? m?.displayLocation : undefined),
			this._tabAction,
		));

		this._showLongDistanceHint = this._editorObs.getOption(EditorOption.inlineSuggest).map(this, s => s.edits.showLongDistanceHint);
		this._longDistanceHint = derived(this, reader => {
			if (!this._showLongDistanceHint.read(reader)) {
				return undefined;
			}
			return reader.store.add(this._instantiationService.createInstance(InlineEditsLongDistanceHint,
				this._editor,
				this._uiState.map<ILongDistanceViewState | undefined>((s, reader) => s?.longDistanceHint ? ({
					hint: s.longDistanceHint,
					newTextLineCount: s.newTextLineCount,
					edit: s.edit,
					diff: s.diff,
					model: this._simpleModel.read(reader)!,
					inlineSuggestInfo: this._inlineSuggestInfo.read(reader)!,
					nextCursorPosition: s.nextCursorPosition,
				}) : undefined),
				this._previewTextModel,
				this._tabAction,
			));
		}).recomputeInitiallyAndOnChange(this._store);


		this._inlineDiffViewState = derived<IOriginalEditorInlineDiffViewState | undefined>(this, reader => {
			const e = this._uiState.read(reader);
			if (!e || !e.state) { return undefined; }
			if (e.state.kind === 'wordReplacements' || e.state.kind === 'insertionMultiLine' || e.state.kind === 'collapsed' || e.state.kind === 'custom' || e.state.kind === 'jumpTo') {
				return undefined;
			}
			return {
				modifiedText: new StringText(e.newText),
				diff: e.diff,
				mode: e.state.kind,
				modifiedCodeEditor: this._sideBySide.previewEditor,
				isInDiffEditor: e.isInDiffEditor,
			};
		});
		this._inlineDiffView = this._register(new OriginalEditorInlineDiffView(this._editor, this._inlineDiffViewState, this._previewTextModel));
		this._jumpToView = this._register(this._instantiationService.createInstance(JumpToView, this._editorObs, { style: 'label' }, derived(reader => {
			const s = this._uiState.read(reader);
			if (s?.state?.kind === InlineCompletionViewKind.JumpTo) {
				return { jumpToPosition: s.state.position };
			}
			return undefined;
		})));
		const wordReplacements = derivedOpts({
			equalsFn: equals.arrayC(equals.thisC())
		}, reader => {
			const s = this._uiState.read(reader);
			return s?.state?.kind === InlineCompletionViewKind.WordReplacements ? s.state.replacements.map(replacement => new WordReplacementsViewData(replacement, s.state?.alternativeAction)) : [];
		});
		this._wordReplacementViews = mapObservableArrayCached(this, wordReplacements, (viewData, store) => {
			return store.add(this._instantiationService.createInstance(InlineEditsWordReplacementView, this._editorObs, viewData, this._tabAction));
		});
		this._lineReplacementView = this._register(this._instantiationService.createInstance(InlineEditsLineReplacementView,
			this._editorObs,
			this._uiState.map(s => s?.state?.kind === InlineCompletionViewKind.LineReplacement ? ({
				originalRange: s.state.originalRange,
				modifiedRange: s.state.modifiedRange,
				modifiedLines: s.state.modifiedLines,
				replacements: s.state.replacements,
			}) : undefined),
			this._uiState.map(s => s?.isInDiffEditor ?? false),
			this._tabAction,
		));

		this._useCodeShifting = this._editorObs.getOption(EditorOption.inlineSuggest).map(s => s.edits.allowCodeShifting);
		this._renderSideBySide = this._editorObs.getOption(EditorOption.inlineSuggest).map(s => s.edits.renderSideBySide);

		this._register(autorun((reader) => {
			const model = this._model.read(reader);
			if (!model) {
				return;
			}
			reader.store.add(
				Event.any(
					this._sideBySide.onDidClick,
					this._lineReplacementView.onDidClick,
					this._insertion.onDidClick,
					...this._wordReplacementViews.read(reader).map(w => w.onDidClick),
					this._inlineDiffView.onDidClick,
					this._customView.onDidClick,
				)(clickEvent => {
					if (this._viewHasBeenShownLongerThan(350)) {
						clickEvent.event.preventDefault();
						model.accept(clickEvent.alternativeAction);
					}
				})
			);
		}));

		this._wordReplacementViews.recomputeInitiallyAndOnChange(this._store);

		const minEditorScrollHeight = derived(this, reader => {
			return Math.max(
				...this._wordReplacementViews.read(reader).map(v => v.minEditorScrollHeight.read(reader)),
				this._lineReplacementView.minEditorScrollHeight.read(reader),
				this._customView.minEditorScrollHeight.read(reader)
			);
		}).recomputeInitiallyAndOnChange(this._store);

		let viewZoneId: string | undefined;
		this._register(autorun(reader => {
			const minScrollHeight = minEditorScrollHeight.read(reader);
			const textModel = this._editorObs.model.read(reader);
			if (!textModel) { return; }

			this._editor.changeViewZones(accessor => {
				const scrollHeight = this._editor.getScrollHeight();
				const viewZoneHeight = minScrollHeight - scrollHeight + 1 /* Add 1px so there is a small gap */;

				if (viewZoneHeight !== 0 && viewZoneId !== undefined) {
					accessor.removeZone(viewZoneId);
					viewZoneId = undefined;
				}

				if (viewZoneHeight <= 0) {
					return;
				}

				viewZoneId = accessor.addZone({
					afterLineNumber: textModel.getLineCount(),
					heightInPx: viewZoneHeight,
					domNode: $('div.minScrollHeightViewZone'),
				});
			});
		}));

		this._constructorDone.set(true, undefined); // TODO: remove and use correct initialization order
	}

	public readonly displayRange = derived<LineRange | undefined>(this, reader => {
		const state = this._uiState.read(reader);
		if (!state) { return undefined; }
		if (state.state?.kind === 'custom') {
			const range = state.state.displayLocation?.range;
			if (!range) {
				throw new BugIndicatingError('custom view should have a range');
			}
			return new LineRange(range.startLineNumber, range.endLineNumber);
		}

		if (state.state?.kind === 'insertionMultiLine') {
			return this._insertion.originalLines.read(reader);
		}

		return state.edit.displayRange;
	});


	private _currentInlineEditCache: {
		inlineSuggestionIdentity: InlineSuggestionIdentity;
		firstCursorLineNumber: number;
	} | undefined = undefined;

	private _getLongDistanceHintState(model: ModelPerInlineEdit, reader: IReader): ILongDistanceHint | undefined {
		if (model.inlineEdit.inlineCompletion.identity.jumpedTo.read(reader)) {
			return undefined;
		}
		if (model.inlineEdit.action === undefined) {
			return undefined;
		}
		if (this._currentInlineEditCache?.inlineSuggestionIdentity !== model.inlineEdit.inlineCompletion.identity) {
			this._currentInlineEditCache = {
				inlineSuggestionIdentity: model.inlineEdit.inlineCompletion.identity,
				firstCursorLineNumber: model.inlineEdit.cursorPosition.lineNumber,
			};
		}
		return {
			lineNumber: this._currentInlineEditCache.firstCursorLineNumber,
			isVisible: !model.inViewPort.read(reader),
		};
	}

	private readonly _constructorDone;

	private readonly _uiState = derived<{
		state: ReturnType<typeof InlineEditsView.prototype._determineRenderState>;
		diff: DetailedLineRangeMapping[];
		edit: InlineEditWithChanges;
		newText: string;
		newTextLineCount: number;
		isInDiffEditor: boolean;
		longDistanceHint: ILongDistanceHint | undefined;
		nextCursorPosition: Position | null;
	} | undefined>(this, reader => {
		const model = this._model.read(reader);
		const textModel = this._editorObs.model.read(reader);
		if (!model || !textModel || !this._constructorDone.read(reader)) {
			return undefined;
		}

		const inlineEdit = model.inlineEdit;
		let diff: DetailedLineRangeMapping[];
		let mappings: RangeMapping[];

		let newText: AbstractText | undefined = undefined;

		if (inlineEdit.edit) {
			mappings = RangeMapping.fromEdit(inlineEdit.edit);
			newText = new StringText(inlineEdit.edit.apply(inlineEdit.originalText));
			diff = lineRangeMappingFromRangeMappings(mappings, inlineEdit.originalText, newText);
		} else {
			mappings = [];
			diff = [];
			newText = inlineEdit.originalText;
		}


		let state = this._determineRenderState(model, reader, diff, newText);
		if (!state) {
			onUnexpectedError(new Error(`unable to determine view: tried to render ${this._previousView?.view}`));
			return undefined;
		}

		const longDistanceHint = this._getLongDistanceHintState(model, reader);

		if (longDistanceHint && longDistanceHint.isVisible) {
			state.viewData.setLongDistanceViewData(longDistanceHint.lineNumber, inlineEdit.lineEdit.lineRange.startLineNumber);
		}

		if (state.kind === InlineCompletionViewKind.SideBySide) {
			const indentationAdjustmentEdit = createReindentEdit(newText.getValue(), inlineEdit.modifiedLineRange, textModel.getOptions().tabSize);
			newText = new StringText(indentationAdjustmentEdit.applyToString(newText.getValue()));

			mappings = applyEditToModifiedRangeMappings(mappings, indentationAdjustmentEdit);
			diff = lineRangeMappingFromRangeMappings(mappings, inlineEdit.originalText, newText);
		}

		this._previewTextModel.setLanguage(textModel.getLanguageId());

		const previousNewText = this._previewTextModel.getValue();
		if (previousNewText !== newText.getValue()) {
			this._previewTextModel.setEOL(textModel.getEndOfLineSequence());
			const updateOldValueEdit = StringEdit.replace(new OffsetRange(0, previousNewText.length), newText.getValue());
			const updateOldValueEditSmall = updateOldValueEdit.removeCommonSuffixPrefix(previousNewText);

			const textEdit = getPositionOffsetTransformerFromTextModel(this._previewTextModel).getTextEdit(updateOldValueEditSmall);
			this._previewTextModel.edit(textEdit);
		}

		if (this._showCollapsed.read(reader)) {
			state = { kind: InlineCompletionViewKind.Collapsed as const, viewData: state.viewData };
		}

		model.handleInlineEditShownNextFrame(state.kind, state.viewData);

		const nextCursorPosition = inlineEdit.action?.kind === 'jumpTo' ? inlineEdit.action.position : null;

		return {
			state,
			diff,
			edit: inlineEdit,
			newText: newText.getValue(),
			newTextLineCount: inlineEdit.modifiedLineRange.length,
			isInDiffEditor: model.isInDiffEditor,
			longDistanceHint,
			nextCursorPosition: nextCursorPosition,
		};
	});

	private readonly _previewTextModel;


	public readonly inlineEditsIsHovered = derived(this, reader => {
		return this._sideBySide.isHovered.read(reader)
			|| this._wordReplacementViews.read(reader).some(v => v.isHovered.read(reader))
			|| this._deletion.isHovered.read(reader)
			|| this._inlineDiffView.isHovered.read(reader)
			|| this._lineReplacementView.isHovered.read(reader)
			|| this._insertion.isHovered.read(reader)
			|| this._customView.isHovered.read(reader)
			|| this._longDistanceHint.map((v, r) => v?.isHovered.read(r) ?? false).read(reader);
	});

	private readonly _sideBySide;

	protected readonly _deletion;

	protected readonly _insertion;

	private readonly _inlineDiffViewState;

	public readonly _inlineCollapsedView;

	private readonly _customView;
	protected readonly _longDistanceHint;

	protected readonly _inlineDiffView;

	protected readonly _wordReplacementViews;

	protected readonly _lineReplacementView;

	protected readonly _jumpToView;

	public readonly gutterIndicatorOffset = derived<number>(this, reader => {
		// TODO: have a better way to tell the gutter indicator view where the edit is inside a viewzone
		if (this._uiState.read(reader)?.state?.kind === 'insertionMultiLine') {
			return this._insertion.startLineOffset.read(reader);
		}
		return 0;
	});

	private _getCacheId(model: ModelPerInlineEdit) {
		return model.inlineEdit.inlineCompletion.identity.id;
	}

	private _determineView(model: ModelPerInlineEdit, reader: IReader, diff: DetailedLineRangeMapping[], newText: AbstractText): InlineCompletionViewKind {
		// Check if we can use the previous view if it is the same InlineCompletion as previously shown
		const inlineEdit = model.inlineEdit;
		const canUseCache = this._previousView?.id === this._getCacheId(model);
		const reconsiderViewEditorWidthChange = this._previousView?.editorWidth !== this._editorObs.layoutInfoWidth.read(reader) &&
			(
				this._previousView?.view === InlineCompletionViewKind.SideBySide ||
				this._previousView?.view === InlineCompletionViewKind.LineReplacement
			);

		if (canUseCache && !reconsiderViewEditorWidthChange) {
			return this._previousView!.view;
		}

		const action = model.inlineEdit.inlineCompletion.action;
		if (action?.kind === 'edit' && action.alternativeAction) {
			return InlineCompletionViewKind.WordReplacements;
		}

		const uri = action?.kind === 'edit' ? action.uri : undefined;
		if (uri !== undefined) {
			return InlineCompletionViewKind.Custom;
		}

		if (model.displayLocation && !model.inlineEdit.inlineCompletion.identity.jumpedTo.read(reader)) {
			return InlineCompletionViewKind.Custom;
		}

		// Determine the view based on the edit / diff

		const numOriginalLines = inlineEdit.originalLineRange.length;
		const numModifiedLines = inlineEdit.modifiedLineRange.length;
		const inner = diff.flatMap(d => d.innerChanges ?? []);
		const isSingleInnerEdit = inner.length === 1;

		if (!model.isInDiffEditor) {
			if (
				isSingleInnerEdit
				&& this._useCodeShifting.read(reader) !== 'never'
				&& isSingleLineInsertion(diff)
			) {
				if (isSingleLineInsertionAfterPosition(diff, inlineEdit.cursorPosition)) {
					return InlineCompletionViewKind.InsertionInline;
				}

				// If we have a single line insertion before the cursor position, we do not want to move the cursor by inserting
				// the suggestion inline. Use a line replacement view instead. Do not use word replacement view.
				return InlineCompletionViewKind.LineReplacement;
			}

			if (isDeletion(inner, inlineEdit, newText)) {
				return InlineCompletionViewKind.Deletion;
			}

			if (isSingleMultiLineInsertion(diff) && this._useCodeShifting.read(reader) === 'always') {
				return InlineCompletionViewKind.InsertionMultiLine;
			}

			const allInnerChangesNotTooLong = inner.every(m => TextLength.ofRange(m.originalRange).columnCount < InlineEditsWordReplacementView.MAX_LENGTH && TextLength.ofRange(m.modifiedRange).columnCount < InlineEditsWordReplacementView.MAX_LENGTH);
			if (allInnerChangesNotTooLong && isSingleInnerEdit && numOriginalLines === 1 && numModifiedLines === 1) {
				// Do not show indentation changes with word replacement view
				const modifiedText = inner.map(m => newText.getValueOfRange(m.modifiedRange));
				const originalText = inner.map(m => model.inlineEdit.originalText.getValueOfRange(m.originalRange));
				if (!modifiedText.some(v => v.includes('\t')) && !originalText.some(v => v.includes('\t'))) {
					// Make sure there is no insertion, even if we grow them
					if (
						!inner.some(m => m.originalRange.isEmpty()) ||
						!growEditsUntilWhitespace(inner.map(m => new TextReplacement(m.originalRange, '')), inlineEdit.originalText).some(e => e.range.isEmpty() && TextLength.ofRange(e.range).columnCount < InlineEditsWordReplacementView.MAX_LENGTH)
					) {
						return InlineCompletionViewKind.WordReplacements;
					}
				}
			}
		}

		if (numOriginalLines > 0 && numModifiedLines > 0) {
			if (numOriginalLines === 1 && numModifiedLines === 1 && !model.isInDiffEditor /* prefer side by side in diff editor */) {
				return InlineCompletionViewKind.LineReplacement;
			}

			if (this._renderSideBySide.read(reader) !== 'never' && InlineEditsSideBySideView.fitsInsideViewport(this._editor, this._previewTextModel, inlineEdit, reader)) {
				return InlineCompletionViewKind.SideBySide;
			}

			return InlineCompletionViewKind.LineReplacement;
		}

		if (model.isInDiffEditor) {
			if (isDeletion(inner, inlineEdit, newText)) {
				return InlineCompletionViewKind.Deletion;
			}

			if (isSingleMultiLineInsertion(diff) && this._useCodeShifting.read(reader) === 'always') {
				return InlineCompletionViewKind.InsertionMultiLine;
			}
		}

		return InlineCompletionViewKind.SideBySide;
	}

	private _determineRenderState(model: ModelPerInlineEdit, reader: IReader, diff: DetailedLineRangeMapping[], newText: AbstractText) {
		if (model.inlineEdit.action?.kind === 'jumpTo') {
			return {
				kind: InlineCompletionViewKind.JumpTo as const,
				position: model.inlineEdit.action.position,
				viewData: emptyViewData,
			};
		}

		const inlineEdit = model.inlineEdit;

		let view = this._determineView(model, reader, diff, newText);
		if (this._willRenderAboveCursor(reader, inlineEdit, view)) {
			switch (view) {
				case InlineCompletionViewKind.LineReplacement:
				case InlineCompletionViewKind.WordReplacements:
					view = InlineCompletionViewKind.SideBySide;
					break;
			}
		}
		this._previousView = { id: this._getCacheId(model), view, editorWidth: this._editor.getLayoutInfo().width, timestamp: Date.now() };

		const inner = diff.flatMap(d => d.innerChanges ?? []);
		const textModel = this._editor.getModel()!;
		const stringChanges = inner.map(m => ({
			originalRange: m.originalRange,
			modifiedRange: m.modifiedRange,
			original: textModel.getValueInRange(m.originalRange),
			modified: newText.getValueOfRange(m.modifiedRange)
		}));

		const viewData = getViewData(inlineEdit, stringChanges, textModel);

		switch (view) {
			case InlineCompletionViewKind.InsertionInline: return { kind: InlineCompletionViewKind.InsertionInline as const, viewData };
			case InlineCompletionViewKind.SideBySide: return { kind: InlineCompletionViewKind.SideBySide as const, viewData };
			case InlineCompletionViewKind.Collapsed: return { kind: InlineCompletionViewKind.Collapsed as const, viewData };
			case InlineCompletionViewKind.Custom: return { kind: InlineCompletionViewKind.Custom as const, displayLocation: model.displayLocation, viewData };
		}

		if (view === InlineCompletionViewKind.Deletion) {
			return {
				kind: InlineCompletionViewKind.Deletion as const,
				originalRange: inlineEdit.originalLineRange,
				deletions: inner.map(m => m.originalRange),
				viewData,
			};
		}

		if (view === InlineCompletionViewKind.InsertionMultiLine) {
			const change = inner[0];
			return {
				kind: InlineCompletionViewKind.InsertionMultiLine as const,
				lineNumber: change.originalRange.startLineNumber,
				column: change.originalRange.startColumn,
				text: newText.getValueOfRange(change.modifiedRange),
				viewData,
			};
		}

		const replacements = stringChanges.map(m => new TextReplacement(m.originalRange, m.modified));
		if (replacements.length === 0) {
			return undefined;
		}

		if (view === InlineCompletionViewKind.WordReplacements) {
			let grownEdits = growEditsToEntireWord(replacements, inlineEdit.originalText);
			if (grownEdits.some(e => e.range.isEmpty())) {
				grownEdits = growEditsUntilWhitespace(replacements, inlineEdit.originalText);
			}

			return {
				kind: InlineCompletionViewKind.WordReplacements as const,
				replacements: grownEdits,
				alternativeAction: model.inlineEdit.action?.alternativeAction,
				viewData,
			};
		}

		if (view === InlineCompletionViewKind.LineReplacement) {
			return {
				kind: InlineCompletionViewKind.LineReplacement as const,
				originalRange: inlineEdit.originalLineRange,
				modifiedRange: inlineEdit.modifiedLineRange,
				modifiedLines: inlineEdit.modifiedLineRange.mapToLineArray(line => newText.getLineAt(line)),
				replacements: inner.map(m => ({ originalRange: m.originalRange, modifiedRange: m.modifiedRange })),
				viewData,
			};
		}

		return undefined;
	}

	private _willRenderAboveCursor(reader: IReader, inlineEdit: InlineEditWithChanges, view: InlineCompletionViewKind): boolean {
		const useCodeShifting = this._useCodeShifting.read(reader);
		if (useCodeShifting === 'always') {
			return false;
		}

		for (const cursorPosition of inlineEdit.multiCursorPositions) {
			if (view === InlineCompletionViewKind.WordReplacements &&
				cursorPosition.lineNumber === inlineEdit.originalLineRange.startLineNumber + 1
			) {
				return true;
			}

			if (view === InlineCompletionViewKind.LineReplacement &&
				cursorPosition.lineNumber >= inlineEdit.originalLineRange.endLineNumberExclusive &&
				cursorPosition.lineNumber < inlineEdit.modifiedLineRange.endLineNumberExclusive + inlineEdit.modifiedLineRange.length
			) {
				return true;
			}
		}

		return false;
	}

	private _viewHasBeenShownLongerThan(durationMs: number): boolean {
		const viewCreationTime = this._previousView?.timestamp;
		if (!viewCreationTime) {
			throw new BugIndicatingError('viewHasBeenShownLongThan called before a view has been shown');
		}

		const currentTime = Date.now();
		return (currentTime - viewCreationTime) >= durationMs;
	}
}

const emptyViewData = new InlineCompletionViewData(-1, -1, -1, -1, -1, -1, -1, true);
function getViewData(inlineEdit: InlineEditWithChanges, stringChanges: { originalRange: Range; modifiedRange: Range; original: string; modified: string }[], textModel: ITextModel) {
	if (!inlineEdit.edit) {
		return emptyViewData;
	}

	const cursorPosition = inlineEdit.cursorPosition;
	const startsWithEOL = stringChanges.length === 0 ? false : stringChanges[0].modified.startsWith(textModel.getEOL());
	const viewData = new InlineCompletionViewData(
		inlineEdit.edit.replacements.length === 0 ? 0 : inlineEdit.edit.replacements[0].range.getStartPosition().column - cursorPosition.column,
		inlineEdit.lineEdit.lineRange.startLineNumber - cursorPosition.lineNumber + (startsWithEOL && inlineEdit.lineEdit.lineRange.startLineNumber >= cursorPosition.lineNumber ? 1 : 0),
		inlineEdit.lineEdit.lineRange.length,
		inlineEdit.lineEdit.newLines.length,
		stringChanges.reduce((acc, r) => acc + r.original.length, 0),
		stringChanges.reduce((acc, r) => acc + r.modified.length, 0),
		stringChanges.length,
		stringChanges.every(r => r.original === stringChanges[0].original && r.modified === stringChanges[0].modified)
	);
	return viewData;
}

function isSingleLineInsertion(diff: DetailedLineRangeMapping[]) {
	return diff.every(m => m.innerChanges!.every(r => isWordInsertion(r)));

	function isWordInsertion(r: RangeMapping) {
		if (!r.originalRange.isEmpty()) {
			return false;
		}
		const isInsertionWithinLine = r.modifiedRange.startLineNumber === r.modifiedRange.endLineNumber;
		if (!isInsertionWithinLine) {
			return false;
		}
		return true;
	}
}

function isSingleLineInsertionAfterPosition(diff: DetailedLineRangeMapping[], position: Position | null) {
	if (!position) {
		return false;
	}

	if (!isSingleLineInsertion(diff)) {
		return false;
	}

	const pos = position;

	return diff.every(m => m.innerChanges!.every(r => isStableWordInsertion(r)));

	function isStableWordInsertion(r: RangeMapping) {
		const insertPosition = r.originalRange.getStartPosition();
		if (pos.isBeforeOrEqual(insertPosition)) {
			return true;
		}
		if (insertPosition.lineNumber < pos.lineNumber) {
			return true;
		}
		return false;
	}
}

function isSingleMultiLineInsertion(diff: DetailedLineRangeMapping[]) {
	const inner = diff.flatMap(d => d.innerChanges ?? []);
	if (inner.length !== 1) {
		return false;
	}

	const change = inner[0];
	if (!change.originalRange.isEmpty()) {
		return false;
	}

	if (change.modifiedRange.startLineNumber === change.modifiedRange.endLineNumber) {
		return false;
	}

	return true;
}

function isDeletion(inner: RangeMapping[], inlineEdit: InlineEditWithChanges, newText: AbstractText) {
	const innerValues = inner.map(m => ({ original: inlineEdit.originalText.getValueOfRange(m.originalRange), modified: newText.getValueOfRange(m.modifiedRange) }));
	return innerValues.every(({ original, modified }) => modified.trim() === '' && original.length > 0 && (original.length > modified.length || original.trim() !== ''));
}

function growEditsToEntireWord(replacements: TextReplacement[], originalText: AbstractText): TextReplacement[] {
	return _growEdits(replacements, originalText, (char) => /^[a-zA-Z]$/.test(char));
}

function growEditsUntilWhitespace(replacements: TextReplacement[], originalText: AbstractText): TextReplacement[] {
	return _growEdits(replacements, originalText, (char) => !(/^\s$/.test(char)));
}

function _growEdits(replacements: TextReplacement[], originalText: AbstractText, fn: (c: string) => boolean): TextReplacement[] {
	const result: TextReplacement[] = [];

	replacements.sort((a, b) => Range.compareRangesUsingStarts(a.range, b.range));

	for (const edit of replacements) {
		let startIndex = edit.range.startColumn - 1;
		let endIndex = edit.range.endColumn - 2;
		let prefix = '';
		let suffix = '';
		const startLineContent = originalText.getLineAt(edit.range.startLineNumber);
		const endLineContent = originalText.getLineAt(edit.range.endLineNumber);

		if (isIncluded(startLineContent[startIndex])) {
			// grow to the left
			while (isIncluded(startLineContent[startIndex - 1])) {
				prefix = startLineContent[startIndex - 1] + prefix;
				startIndex--;
			}
		}

		if (isIncluded(endLineContent[endIndex]) || endIndex < startIndex) {
			// grow to the right
			while (isIncluded(endLineContent[endIndex + 1])) {
				suffix += endLineContent[endIndex + 1];
				endIndex++;
			}
		}

		// create new edit and merge together if they are touching
		let newEdit = new TextReplacement(new Range(edit.range.startLineNumber, startIndex + 1, edit.range.endLineNumber, endIndex + 2), prefix + edit.text + suffix);
		if (result.length > 0 && Range.areIntersectingOrTouching(result[result.length - 1].range, newEdit.range)) {
			newEdit = TextReplacement.joinReplacements([result.pop()!, newEdit], originalText);
		}

		result.push(newEdit);
	}

	function isIncluded(c: string | undefined) {
		if (c === undefined) {
			return false;
		}
		return fn(c);
	}

	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViewInterface.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViewInterface.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getWindow } from '../../../../../../base/browser/dom.js';
import { IMouseEvent, StandardMouseEvent } from '../../../../../../base/browser/mouseEvent.js';
import { Event } from '../../../../../../base/common/event.js';
import { IObservable } from '../../../../../../base/common/observable.js';

export enum InlineEditTabAction {
	Jump = 'jump',
	Accept = 'accept',
	Inactive = 'inactive'
}

export class InlineEditClickEvent {
	static create(event: PointerEvent | MouseEvent, alternativeAction: boolean = false) {
		return new InlineEditClickEvent(new StandardMouseEvent(getWindow(event), event), alternativeAction);
	}
	constructor(
		public readonly event: IMouseEvent,
		public readonly alternativeAction: boolean = false
	) { }
}

export interface IInlineEditsView {
	isHovered: IObservable<boolean>;
	minEditorScrollHeight?: IObservable<number>;
	readonly onDidClick: Event<InlineEditClickEvent>;
}

// TODO: Move this out of here as it is also includes ghosttext
export enum InlineCompletionViewKind {
	GhostText = 'ghostText',
	Custom = 'custom',
	SideBySide = 'sideBySide',
	Deletion = 'deletion',
	InsertionInline = 'insertionInline',
	InsertionMultiLine = 'insertionMultiLine',
	WordReplacements = 'wordReplacements',
	LineReplacement = 'lineReplacement',
	Collapsed = 'collapsed',
	JumpTo = 'jumpTo'
}

export class InlineCompletionViewData {

	public longDistanceHintVisible: boolean | undefined = undefined;
	public longDistanceHintDistance: number | undefined = undefined;

	constructor(
		public readonly cursorColumnDistance: number,
		public readonly cursorLineDistance: number,
		public readonly lineCountOriginal: number,
		public readonly lineCountModified: number,
		public readonly characterCountOriginal: number,
		public readonly characterCountModified: number,
		public readonly disjointReplacements: number,
		public readonly sameShapeReplacements?: boolean
	) { }

	setLongDistanceViewData(lineNumber: number, inlineEditLineNumber: number): void {
		this.longDistanceHintVisible = true;
		this.longDistanceHintDistance = Math.abs(inlineEditLineNumber - lineNumber);
	}

	getData() {
		return {
			cursorColumnDistance: this.cursorColumnDistance,
			cursorLineDistance: this.cursorLineDistance,
			lineCountOriginal: this.lineCountOriginal,
			lineCountModified: this.lineCountModified,
			characterCountOriginal: this.characterCountOriginal,
			characterCountModified: this.characterCountModified,
			disjointReplacements: this.disjointReplacements,
			sameShapeReplacements: this.sameShapeReplacements,
			longDistanceHintVisible: this.longDistanceHintVisible,
			longDistanceHintDistance: this.longDistanceHintDistance
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViewProducer.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViewProducer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { derived, IObservable } from '../../../../../../base/common/observable.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { ICodeEditor } from '../../../../../browser/editorBrowser.js';
import { ObservableCodeEditor, observableCodeEditor } from '../../../../../browser/observableCodeEditor.js';
import { Range } from '../../../../../common/core/range.js';
import { TextReplacement, TextEdit } from '../../../../../common/core/edits/textEdit.js';
import { TextModelText } from '../../../../../common/model/textModelText.js';
import { InlineCompletionsModel } from '../../model/inlineCompletionsModel.js';
import { InlineEditWithChanges } from './inlineEditWithChanges.js';
import { ModelPerInlineEdit } from './inlineEditsModel.js';
import { InlineEditsView } from './inlineEditsView.js';
import { InlineEditTabAction } from './inlineEditsViewInterface.js';
import { InlineSuggestionGutterMenuData, SimpleInlineSuggestModel } from './components/gutterIndicatorView.js';

export class InlineEditsViewAndDiffProducer extends Disposable { // TODO: This class is no longer a diff producer. Rename it or get rid of it
	private readonly _editorObs: ObservableCodeEditor;

	private readonly _inlineEdit = derived<InlineEditWithChanges | undefined>(this, (reader) => {
		const model = this._model.read(reader);
		if (!model) { return undefined; }
		const textModel = this._editor.getModel();
		if (!textModel) { return undefined; }

		const state = model.inlineEditState.read(reader);
		if (!state) { return undefined; }
		const action = state.inlineSuggestion.action;

		const text = new TextModelText(textModel);

		let diffEdits: TextEdit | undefined;

		if (action?.kind === 'edit') {
			const editOffset = action.stringEdit;

			const edits = editOffset.replacements.map(e => {
				const innerEditRange = Range.fromPositions(
					textModel.getPositionAt(e.replaceRange.start),
					textModel.getPositionAt(e.replaceRange.endExclusive)
				);
				return new TextReplacement(innerEditRange, e.newText);
			});
			diffEdits = new TextEdit(edits);
		} else {
			diffEdits = undefined;
		}

		return new InlineEditWithChanges(
			text,
			action,
			diffEdits,
			model.primaryPosition.read(undefined),
			model.allPositions.read(undefined),
			state.inlineSuggestion.source.inlineSuggestions.commands ?? [],
			state.inlineSuggestion
		);
	});

	public readonly _inlineEditModel = derived<ModelPerInlineEdit | undefined>(this, reader => {
		const model = this._model.read(reader);
		if (!model) { return undefined; }
		const edit = this._inlineEdit.read(reader);
		if (!edit) { return undefined; }

		const tabAction = derived<InlineEditTabAction>(this, reader => {
			/** @description tabAction */
			if (this._editorObs.isFocused.read(reader)) {
				if (model.tabShouldJumpToInlineEdit.read(reader)) { return InlineEditTabAction.Jump; }
				if (model.tabShouldAcceptInlineEdit.read(reader)) { return InlineEditTabAction.Accept; }
			}
			return InlineEditTabAction.Inactive;
		});

		return new ModelPerInlineEdit(model, edit, tabAction);
	});

	public readonly view: InlineEditsView;

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _model: IObservable<InlineCompletionsModel | undefined>,
		private readonly _showCollapsed: IObservable<boolean>,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();

		this._editorObs = observableCodeEditor(this._editor);

		this.view = this._register(instantiationService.createInstance(InlineEditsView, this._editor, this._inlineEditModel,
			this._model.map(model => model ? SimpleInlineSuggestModel.fromInlineCompletionModel(model) : undefined),
			this._inlineEdit.map(e => e ? InlineSuggestionGutterMenuData.fromInlineSuggestion(e.inlineCompletion) : undefined),
			this._showCollapsed,
		));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditWithChanges.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditWithChanges.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LineReplacement } from '../../../../../common/core/edits/lineEdit.js';
import { TextEdit } from '../../../../../common/core/edits/textEdit.js';
import { Position } from '../../../../../common/core/position.js';
import { LineRange } from '../../../../../common/core/ranges/lineRange.js';
import { AbstractText } from '../../../../../common/core/text/abstractText.js';
import { InlineCompletionCommand } from '../../../../../common/languages.js';
import { InlineSuggestionAction, InlineSuggestionItem } from '../../model/inlineSuggestionItem.js';

export class InlineEditWithChanges {
	// TODO@hediet: Move the next 3 fields into the action
	public get lineEdit(): LineReplacement {
		if (this.action?.kind === 'jumpTo') {
			return new LineReplacement(LineRange.ofLength(this.action.position.lineNumber, 0), []);
		} else if (this.action?.kind === 'edit') {
			return LineReplacement.fromSingleTextEdit(this.edit!.toReplacement(this.originalText), this.originalText);
		}

		return new LineReplacement(new LineRange(1, 1), []);
	}

	public get originalLineRange(): LineRange { return this.lineEdit.lineRange; }
	public get modifiedLineRange(): LineRange { return this.lineEdit.toLineEdit().getNewLineRanges()[0]; }

	public get displayRange(): LineRange {
		return this.originalText.lineRange.intersect(
			this.originalLineRange.join(
				LineRange.ofLength(this.originalLineRange.startLineNumber, this.lineEdit.newLines.length)
			)
		)!;
	}

	constructor(
		public readonly originalText: AbstractText,
		public readonly action: InlineSuggestionAction | undefined,
		public readonly edit: TextEdit | undefined,
		public readonly cursorPosition: Position,
		public readonly multiCursorPositions: readonly Position[],
		public readonly commands: readonly InlineCompletionCommand[],
		public readonly inlineCompletion: InlineSuggestionItem,
	) {
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/theme.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/theme.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Color } from '../../../../../../base/common/color.js';
import { BugIndicatingError } from '../../../../../../base/common/errors.js';
import { IObservable, observableFromEventOpts } from '../../../../../../base/common/observable.js';
import { localize } from '../../../../../../nls.js';
import { buttonBackground, buttonForeground, buttonSecondaryBackground, buttonSecondaryForeground, diffInserted, diffInsertedLine, diffRemoved, editorBackground } from '../../../../../../platform/theme/common/colorRegistry.js';
import { ColorIdentifier, darken, registerColor, transparent } from '../../../../../../platform/theme/common/colorUtils.js';
import { IThemeService } from '../../../../../../platform/theme/common/themeService.js';
import { InlineEditTabAction } from './inlineEditsViewInterface.js';

export const originalBackgroundColor = registerColor(
	'inlineEdit.originalBackground',
	transparent(diffRemoved, 0.2),
	localize('inlineEdit.originalBackground', 'Background color for the original text in inline edits.'),
	true
);
export const modifiedBackgroundColor = registerColor(
	'inlineEdit.modifiedBackground',
	transparent(diffInserted, 0.3),
	localize('inlineEdit.modifiedBackground', 'Background color for the modified text in inline edits.'),
	true
);

export const originalChangedLineBackgroundColor = registerColor(
	'inlineEdit.originalChangedLineBackground',
	transparent(diffRemoved, 0.8),
	localize('inlineEdit.originalChangedLineBackground', 'Background color for the changed lines in the original text of inline edits.'),
	true
);

export const originalChangedTextOverlayColor = registerColor(
	'inlineEdit.originalChangedTextBackground',
	transparent(diffRemoved, 0.8),
	localize('inlineEdit.originalChangedTextBackground', 'Overlay color for the changed text in the original text of inline edits.'),
	true
);

export const modifiedChangedLineBackgroundColor = registerColor(
	'inlineEdit.modifiedChangedLineBackground',
	{
		light: transparent(diffInsertedLine, 0.7),
		dark: transparent(diffInsertedLine, 0.7),
		hcDark: diffInsertedLine,
		hcLight: diffInsertedLine
	},
	localize('inlineEdit.modifiedChangedLineBackground', 'Background color for the changed lines in the modified text of inline edits.'),
	true
);

export const modifiedChangedTextOverlayColor = registerColor(
	'inlineEdit.modifiedChangedTextBackground',
	transparent(diffInserted, 0.7),
	localize('inlineEdit.modifiedChangedTextBackground', 'Overlay color for the changed text in the modified text of inline edits.'),
	true
);

// ------- GUTTER INDICATOR -------

export const inlineEditIndicatorPrimaryForeground = registerColor(
	'inlineEdit.gutterIndicator.primaryForeground',
	buttonForeground,
	localize('inlineEdit.gutterIndicator.primaryForeground', 'Foreground color for the primary inline edit gutter indicator.')
);
export const inlineEditIndicatorPrimaryBorder = registerColor(
	'inlineEdit.gutterIndicator.primaryBorder',
	buttonBackground,
	localize('inlineEdit.gutterIndicator.primaryBorder', 'Border color for the primary inline edit gutter indicator.')
);
export const inlineEditIndicatorPrimaryBackground = registerColor(
	'inlineEdit.gutterIndicator.primaryBackground',
	{
		light: transparent(inlineEditIndicatorPrimaryBorder, 0.5),
		dark: transparent(inlineEditIndicatorPrimaryBorder, 0.4),
		hcDark: transparent(inlineEditIndicatorPrimaryBorder, 0.4),
		hcLight: transparent(inlineEditIndicatorPrimaryBorder, 0.5),
	},
	localize('inlineEdit.gutterIndicator.primaryBackground', 'Background color for the primary inline edit gutter indicator.')
);

export const inlineEditIndicatorSecondaryForeground = registerColor(
	'inlineEdit.gutterIndicator.secondaryForeground',
	buttonSecondaryForeground,
	localize('inlineEdit.gutterIndicator.secondaryForeground', 'Foreground color for the secondary inline edit gutter indicator.')
);
export const inlineEditIndicatorSecondaryBorder = registerColor(
	'inlineEdit.gutterIndicator.secondaryBorder',
	buttonSecondaryBackground,
	localize('inlineEdit.gutterIndicator.secondaryBorder', 'Border color for the secondary inline edit gutter indicator.')
);
export const inlineEditIndicatorSecondaryBackground = registerColor(
	'inlineEdit.gutterIndicator.secondaryBackground',
	inlineEditIndicatorSecondaryBorder,
	localize('inlineEdit.gutterIndicator.secondaryBackground', 'Background color for the secondary inline edit gutter indicator.')
);

export const inlineEditIndicatorSuccessfulForeground = registerColor(
	'inlineEdit.gutterIndicator.successfulForeground',
	buttonForeground,
	localize('inlineEdit.gutterIndicator.successfulForeground', 'Foreground color for the successful inline edit gutter indicator.')
);
export const inlineEditIndicatorSuccessfulBorder = registerColor(
	'inlineEdit.gutterIndicator.successfulBorder',
	buttonBackground,
	localize('inlineEdit.gutterIndicator.successfulBorder', 'Border color for the successful inline edit gutter indicator.')
);
export const inlineEditIndicatorSuccessfulBackground = registerColor(
	'inlineEdit.gutterIndicator.successfulBackground',
	inlineEditIndicatorSuccessfulBorder,
	localize('inlineEdit.gutterIndicator.successfulBackground', 'Background color for the successful inline edit gutter indicator.')
);

export const inlineEditIndicatorBackground = registerColor(
	'inlineEdit.gutterIndicator.background',
	{
		hcDark: transparent('tab.inactiveBackground', 0.5),
		hcLight: transparent('tab.inactiveBackground', 0.5),
		dark: transparent('tab.inactiveBackground', 0.5),
		light: '#5f5f5f18',
	},
	localize('inlineEdit.gutterIndicator.background', 'Background color for the inline edit gutter indicator.')
);

// ------- BORDER COLORS -------

const originalBorder = registerColor(
	'inlineEdit.originalBorder',
	{
		light: diffRemoved,
		dark: diffRemoved,
		hcDark: diffRemoved,
		hcLight: diffRemoved
	},
	localize('inlineEdit.originalBorder', 'Border color for the original text in inline edits.')
);

const modifiedBorder = registerColor(
	'inlineEdit.modifiedBorder',
	{
		light: darken(diffInserted, 0.6),
		dark: diffInserted,
		hcDark: diffInserted,
		hcLight: diffInserted
	},
	localize('inlineEdit.modifiedBorder', 'Border color for the modified text in inline edits.')
);

const tabWillAcceptModifiedBorder = registerColor(
	'inlineEdit.tabWillAcceptModifiedBorder',
	{
		light: darken(modifiedBorder, 0),
		dark: darken(modifiedBorder, 0),
		hcDark: darken(modifiedBorder, 0),
		hcLight: darken(modifiedBorder, 0)
	},
	localize('inlineEdit.tabWillAcceptModifiedBorder', 'Modified border color for the inline edits widget when tab will accept it.')
);

const tabWillAcceptOriginalBorder = registerColor(
	'inlineEdit.tabWillAcceptOriginalBorder',
	{
		light: darken(originalBorder, 0),
		dark: darken(originalBorder, 0),
		hcDark: darken(originalBorder, 0),
		hcLight: darken(originalBorder, 0)
	},
	localize('inlineEdit.tabWillAcceptOriginalBorder', 'Original border color for the inline edits widget over the original text when tab will accept it.')
);

export function getModifiedBorderColor(tabAction: IObservable<InlineEditTabAction>): IObservable<string> {
	return tabAction.map(a => a === InlineEditTabAction.Accept ? tabWillAcceptModifiedBorder : modifiedBorder);
}

export function getOriginalBorderColor(tabAction: IObservable<InlineEditTabAction>): IObservable<string> {
	return tabAction.map(a => a === InlineEditTabAction.Accept ? tabWillAcceptOriginalBorder : originalBorder);
}

export function getEditorBlendedColor(colorIdentifier: ColorIdentifier | IObservable<ColorIdentifier>, themeService: IThemeService): IObservable<Color> {
	let color: IObservable<Color>;
	if (typeof colorIdentifier === 'string') {
		color = observeColor(colorIdentifier, themeService);
	} else {
		color = colorIdentifier.map((identifier, reader) => observeColor(identifier, themeService).read(reader));
	}

	const backgroundColor = observeColor(editorBackground, themeService);

	return color.map((c, reader) => /** @description makeOpaque */ c.makeOpaque(backgroundColor.read(reader)));
}

export function observeColor(colorIdentifier: ColorIdentifier, themeService: IThemeService): IObservable<Color> {
	return observableFromEventOpts(
		{
			owner: { observeColor: colorIdentifier },
			equalsFn: (a: Color, b: Color) => a.equals(b),
			debugName: () => `observeColor(${colorIdentifier})`
		},
		themeService.onDidColorThemeChange,
		() => {
			const color = themeService.getColorTheme().getColor(colorIdentifier);
			if (!color) {
				throw new BugIndicatingError(`Missing color: ${colorIdentifier}`);
			}
			return color;
		}
	);
}

// Styles
export const INLINE_EDITS_BORDER_RADIUS = 3; // also used in CSS file
```

--------------------------------------------------------------------------------

````
