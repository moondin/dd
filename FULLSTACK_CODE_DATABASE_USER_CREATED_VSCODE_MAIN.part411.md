---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 411
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 411 of 552)

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

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/model/mergeEditorModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/model/mergeEditorModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CompareResult, equals } from '../../../../../base/common/arrays.js';
import { BugIndicatingError } from '../../../../../base/common/errors.js';
import { autorunHandleChanges, derived, IObservable, IReader, ISettableObservable, ITransaction, keepObserved, observableValue, transaction, waitForState } from '../../../../../base/common/observable.js';
import { URI } from '../../../../../base/common/uri.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { localize } from '../../../../../nls.js';
import { IResourceUndoRedoElement, IUndoRedoService, UndoRedoElementType, UndoRedoGroup } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { EditorModel } from '../../../../common/editor/editorModel.js';
import { IMergeDiffComputer } from './diffComputer.js';
import { MergeEditorLineRange } from './lineRange.js';
import { DetailedLineRangeMapping, DocumentLineRangeMap, DocumentRangeMap, LineRangeMapping } from './mapping.js';
import { TextModelDiffChangeReason, TextModelDiffs, TextModelDiffState } from './textModelDiffs.js';
import { MergeEditorTelemetry } from '../telemetry.js';
import { leftJoin } from '../utils.js';
import { InputNumber, ModifiedBaseRange, ModifiedBaseRangeState, ModifiedBaseRangeStateKind } from './modifiedBaseRange.js';

export interface InputData {
	readonly textModel: ITextModel;
	readonly title: string | undefined;
	readonly detail: string | undefined;
	readonly description: string | undefined;
}

export class MergeEditorModel extends EditorModel {
	private readonly input1TextModelDiffs;
	private readonly input2TextModelDiffs;
	private readonly resultTextModelDiffs;
	public readonly modifiedBaseRanges;

	private readonly modifiedBaseRangeResultStates;

	private readonly resultSnapshot;

	constructor(
		readonly base: ITextModel,
		readonly input1: InputData,
		readonly input2: InputData,
		readonly resultTextModel: ITextModel,
		private readonly diffComputer: IMergeDiffComputer,
		private readonly options: { resetResult: boolean },
		public readonly telemetry: MergeEditorTelemetry,
		@ILanguageService private readonly languageService: ILanguageService,
		@IUndoRedoService private readonly undoRedoService: IUndoRedoService,
	) {
		super();
		this.input1TextModelDiffs = this._register(new TextModelDiffs(this.base, this.input1.textModel, this.diffComputer));
		this.input2TextModelDiffs = this._register(new TextModelDiffs(this.base, this.input2.textModel, this.diffComputer));
		this.resultTextModelDiffs = this._register(new TextModelDiffs(this.base, this.resultTextModel, this.diffComputer));
		this.modifiedBaseRanges = derived<ModifiedBaseRange[]>(this, (reader) => {
			const input1Diffs = this.input1TextModelDiffs.diffs.read(reader);
			const input2Diffs = this.input2TextModelDiffs.diffs.read(reader);
			return ModifiedBaseRange.fromDiffs(input1Diffs, input2Diffs, this.base, this.input1.textModel, this.input2.textModel);
		});
		this.modifiedBaseRangeResultStates = derived(this, reader => {
			const map = new Map<ModifiedBaseRange, ModifiedBaseRangeData>(
				this.modifiedBaseRanges.read(reader).map<[ModifiedBaseRange, ModifiedBaseRangeData]>((s) => [
					s, new ModifiedBaseRangeData(s)
				])
			);
			return map;
		});
		this.resultSnapshot = this.resultTextModel.createSnapshot();
		this.baseInput1Diffs = this.input1TextModelDiffs.diffs;
		this.baseInput2Diffs = this.input2TextModelDiffs.diffs;
		this.baseResultDiffs = this.resultTextModelDiffs.diffs;
		this.input1ResultMapping = derived(this, reader => {
			return this.getInputResultMapping(
				this.baseInput1Diffs.read(reader),
				this.baseResultDiffs.read(reader),
				this.input1.textModel.getLineCount(),
			);
		});
		this.resultInput1Mapping = derived(this, reader => this.input1ResultMapping.read(reader).reverse());
		this.input2ResultMapping = derived(this, reader => {
			return this.getInputResultMapping(
				this.baseInput2Diffs.read(reader),
				this.baseResultDiffs.read(reader),
				this.input2.textModel.getLineCount(),
			);
		});
		this.resultInput2Mapping = derived(this, reader => this.input2ResultMapping.read(reader).reverse());
		this.baseResultMapping = derived(this, reader => {
			const map = new DocumentLineRangeMap(this.baseResultDiffs.read(reader), -1);
			return new DocumentLineRangeMap(
				map.lineRangeMappings.map((m) =>
					m.inputRange.isEmpty || m.outputRange.isEmpty
						? new LineRangeMapping(
							// We can do this because two adjacent diffs have one line in between.
							m.inputRange.deltaStart(-1),
							m.outputRange.deltaStart(-1)
						)
						: m
				),
				map.inputLineCount
			);
		});
		this.resultBaseMapping = derived(this, reader => this.baseResultMapping.read(reader).reverse());
		this.diffComputingState = derived(this, reader => {
			const states = [
				this.input1TextModelDiffs,
				this.input2TextModelDiffs,
				this.resultTextModelDiffs,
			].map((s) => s.state.read(reader));

			if (states.some((s) => s === TextModelDiffState.initializing)) {
				return MergeEditorModelState.initializing;
			}
			if (states.some((s) => s === TextModelDiffState.updating)) {
				return MergeEditorModelState.updating;
			}
			return MergeEditorModelState.upToDate;
		});
		this.inputDiffComputingState = derived(this, reader => {
			const states = [
				this.input1TextModelDiffs,
				this.input2TextModelDiffs,
			].map((s) => s.state.read(reader));

			if (states.some((s) => s === TextModelDiffState.initializing)) {
				return MergeEditorModelState.initializing;
			}
			if (states.some((s) => s === TextModelDiffState.updating)) {
				return MergeEditorModelState.updating;
			}
			return MergeEditorModelState.upToDate;
		});
		this.isUpToDate = derived(this, reader => this.diffComputingState.read(reader) === MergeEditorModelState.upToDate);

		this.firstRun = true;
		this.unhandledConflictsCount = derived(this, reader => {
			const map = this.modifiedBaseRangeResultStates.read(reader);
			let unhandledCount = 0;
			for (const [_key, value] of map) {
				if (!value.handled.read(reader)) {
					unhandledCount++;
				}
			}
			return unhandledCount;
		});
		this.hasUnhandledConflicts = this.unhandledConflictsCount.map(value => /** @description hasUnhandledConflicts */ value > 0);

		this._register(keepObserved(this.modifiedBaseRangeResultStates));
		this._register(keepObserved(this.input1ResultMapping));
		this._register(keepObserved(this.input2ResultMapping));

		const initializePromise = this.initialize();

		this.onInitialized = waitForState(this.diffComputingState, state => state === MergeEditorModelState.upToDate).then(async () => {
			await initializePromise;
		});

		initializePromise.then(() => {
			let shouldRecomputeHandledFromAccepted = true;
			this._register(
				autorunHandleChanges(
					{
						changeTracker: {
							createChangeSummary: () => undefined,
							handleChange: (ctx) => {
								if (ctx.didChange(this.modifiedBaseRangeResultStates)) {
									shouldRecomputeHandledFromAccepted = true;
								}
								return ctx.didChange(this.resultTextModelDiffs.diffs)
									// Ignore non-text changes as we update the state directly
									? ctx.change === TextModelDiffChangeReason.textChange
									: true;
							},
						}
					},
					(reader) => {
						/** @description Merge Editor Model: Recompute State From Result */
						const states = this.modifiedBaseRangeResultStates.read(reader);
						if (!this.isUpToDate.read(reader)) {
							return;
						}
						const resultDiffs = this.resultTextModelDiffs.diffs.read(reader);
						transaction(tx => {
							/** @description Merge Editor Model: Recompute State */

							this.updateBaseRangeAcceptedState(resultDiffs, states, tx);

							if (shouldRecomputeHandledFromAccepted) {
								shouldRecomputeHandledFromAccepted = false;
								for (const [_range, observableState] of states) {
									const state = observableState.accepted.read(undefined);
									const handled = !(state.kind === ModifiedBaseRangeStateKind.base || state.kind === ModifiedBaseRangeStateKind.unrecognized);
									observableState.handledInput1.set(handled, tx);
									observableState.handledInput2.set(handled, tx);
								}
							}
						});
					}
				)
			);
		});
	}

	private async initialize(): Promise<void> {
		if (this.options.resetResult) {
			await this.reset();
		}
	}

	public async reset(): Promise<void> {
		await waitForState(this.inputDiffComputingState, state => state === MergeEditorModelState.upToDate);
		const states = this.modifiedBaseRangeResultStates.get();

		transaction(tx => {
			/** @description Set initial state */

			for (const [range, state] of states) {
				let newState: ModifiedBaseRangeState;
				let handled = false;
				if (range.input1Diffs.length === 0) {
					newState = ModifiedBaseRangeState.base.withInputValue(2, true);
					handled = true;
				} else if (range.input2Diffs.length === 0) {
					newState = ModifiedBaseRangeState.base.withInputValue(1, true);
					handled = true;
				} else if (range.isEqualChange) {
					newState = ModifiedBaseRangeState.base.withInputValue(1, true);
					handled = true;
				} else {
					newState = ModifiedBaseRangeState.base;
					handled = false;
				}

				state.accepted.set(newState, tx);
				state.computedFromDiffing = false;
				state.previousNonDiffingState = undefined;
				state.handledInput1.set(handled, tx);
				state.handledInput2.set(handled, tx);
			}

			this.resultTextModel.pushEditOperations(null, [{
				range: new Range(1, 1, Number.MAX_SAFE_INTEGER, 1),
				text: this.computeAutoMergedResult()
			}], () => null);
		});
	}

	private computeAutoMergedResult(): string {
		const baseRanges = this.modifiedBaseRanges.get();

		const baseLines = this.base.getLinesContent();
		const input1Lines = this.input1.textModel.getLinesContent();
		const input2Lines = this.input2.textModel.getLinesContent();

		const resultLines: string[] = [];
		function appendLinesToResult(source: string[], lineRange: MergeEditorLineRange) {
			for (let i = lineRange.startLineNumber; i < lineRange.endLineNumberExclusive; i++) {
				resultLines.push(source[i - 1]);
			}
		}

		let baseStartLineNumber = 1;

		for (const baseRange of baseRanges) {
			appendLinesToResult(baseLines, MergeEditorLineRange.fromLineNumbers(baseStartLineNumber, baseRange.baseRange.startLineNumber));
			baseStartLineNumber = baseRange.baseRange.endLineNumberExclusive;

			if (baseRange.input1Diffs.length === 0) {
				appendLinesToResult(input2Lines, baseRange.input2Range);
			} else if (baseRange.input2Diffs.length === 0) {
				appendLinesToResult(input1Lines, baseRange.input1Range);
			} else if (baseRange.isEqualChange) {
				appendLinesToResult(input1Lines, baseRange.input1Range);
			} else {
				appendLinesToResult(baseLines, baseRange.baseRange);
			}
		}

		appendLinesToResult(baseLines, MergeEditorLineRange.fromLineNumbers(baseStartLineNumber, baseLines.length + 1));

		return resultLines.join(this.resultTextModel.getEOL());
	}

	public hasBaseRange(baseRange: ModifiedBaseRange): boolean {
		return this.modifiedBaseRangeResultStates.get().has(baseRange);
	}

	public readonly baseInput1Diffs;

	public readonly baseInput2Diffs;
	public readonly baseResultDiffs;
	public get isApplyingEditInResult(): boolean { return this.resultTextModelDiffs.isApplyingChange; }
	public readonly input1ResultMapping;

	public readonly resultInput1Mapping;

	public readonly input2ResultMapping;

	public readonly resultInput2Mapping;

	private getInputResultMapping(inputLinesDiffs: DetailedLineRangeMapping[], resultDiffs: DetailedLineRangeMapping[], inputLineCount: number) {
		const map = DocumentLineRangeMap.betweenOutputs(inputLinesDiffs, resultDiffs, inputLineCount);
		return new DocumentLineRangeMap(
			map.lineRangeMappings.map((m) =>
				m.inputRange.isEmpty || m.outputRange.isEmpty
					? new LineRangeMapping(
						// We can do this because two adjacent diffs have one line in between.
						m.inputRange.deltaStart(-1),
						m.outputRange.deltaStart(-1)
					)
					: m
			),
			map.inputLineCount
		);
	}

	public readonly baseResultMapping;

	public readonly resultBaseMapping;

	public translateInputRangeToBase(input: 1 | 2, range: Range): Range {
		const baseInputDiffs = input === 1 ? this.baseInput1Diffs.get() : this.baseInput2Diffs.get();
		const map = new DocumentRangeMap(baseInputDiffs.flatMap(d => d.rangeMappings), 0).reverse();
		return map.projectRange(range).outputRange;
	}

	public translateBaseRangeToInput(input: 1 | 2, range: Range): Range {
		const baseInputDiffs = input === 1 ? this.baseInput1Diffs.get() : this.baseInput2Diffs.get();
		const map = new DocumentRangeMap(baseInputDiffs.flatMap(d => d.rangeMappings), 0);
		return map.projectRange(range).outputRange;
	}

	public getLineRangeInResult(baseRange: MergeEditorLineRange, reader?: IReader): MergeEditorLineRange {
		return this.resultTextModelDiffs.getResultLineRange(baseRange, reader);
	}

	public translateResultRangeToBase(range: Range): Range {
		const map = new DocumentRangeMap(this.baseResultDiffs.get().flatMap(d => d.rangeMappings), 0).reverse();
		return map.projectRange(range).outputRange;
	}

	public translateBaseRangeToResult(range: Range): Range {
		const map = new DocumentRangeMap(this.baseResultDiffs.get().flatMap(d => d.rangeMappings), 0);
		return map.projectRange(range).outputRange;
	}

	public findModifiedBaseRangesInRange(rangeInBase: MergeEditorLineRange): ModifiedBaseRange[] {
		// TODO use binary search
		return this.modifiedBaseRanges.get().filter(r => r.baseRange.intersectsOrTouches(rangeInBase));
	}

	public readonly diffComputingState;

	public readonly inputDiffComputingState;

	public readonly isUpToDate;

	public readonly onInitialized;

	private firstRun;
	private updateBaseRangeAcceptedState(resultDiffs: DetailedLineRangeMapping[], states: Map<ModifiedBaseRange, ModifiedBaseRangeData>, tx: ITransaction): void {
		const baseRangeWithStoreAndTouchingDiffs = leftJoin(
			states,
			resultDiffs,
			(baseRange, diff) =>
				baseRange[0].baseRange.intersectsOrTouches(diff.inputRange)
					? CompareResult.neitherLessOrGreaterThan
					: MergeEditorLineRange.compareByStart(
						baseRange[0].baseRange,
						diff.inputRange
					)
		);

		for (const row of baseRangeWithStoreAndTouchingDiffs) {
			const newState = this.computeState(row.left[0], row.rights);
			const data = row.left[1];
			const oldState = data.accepted.get();
			if (!oldState.equals(newState)) {
				if (!this.firstRun && !data.computedFromDiffing) {
					// Don't set this on the first run - the first run might be used to restore state.
					data.computedFromDiffing = true;
					data.previousNonDiffingState = oldState;
				}
				data.accepted.set(newState, tx);
			}
		}

		if (this.firstRun) {
			this.firstRun = false;
		}
	}

	private computeState(baseRange: ModifiedBaseRange, conflictingDiffs: DetailedLineRangeMapping[]): ModifiedBaseRangeState {
		if (conflictingDiffs.length === 0) {
			return ModifiedBaseRangeState.base;
		}
		const conflictingEdits = conflictingDiffs.map((d) => d.getLineEdit());

		function editsAgreeWithDiffs(diffs: readonly DetailedLineRangeMapping[]): boolean {
			return equals(
				conflictingEdits,
				diffs.map((d) => d.getLineEdit()),
				(a, b) => a.equals(b)
			);
		}

		if (editsAgreeWithDiffs(baseRange.input1Diffs)) {
			return ModifiedBaseRangeState.base.withInputValue(1, true);
		}
		if (editsAgreeWithDiffs(baseRange.input2Diffs)) {
			return ModifiedBaseRangeState.base.withInputValue(2, true);
		}

		const states = [
			ModifiedBaseRangeState.base.withInputValue(1, true).withInputValue(2, true, true),
			ModifiedBaseRangeState.base.withInputValue(2, true).withInputValue(1, true, true),
			ModifiedBaseRangeState.base.withInputValue(1, true).withInputValue(2, true, false),
			ModifiedBaseRangeState.base.withInputValue(2, true).withInputValue(1, true, false),
		];

		for (const s of states) {
			const { edit } = baseRange.getEditForBase(s);
			if (edit) {
				const resultRange = this.resultTextModelDiffs.getResultLineRange(baseRange.baseRange);
				const existingLines = resultRange.getLines(this.resultTextModel);

				if (equals(edit.newLines, existingLines, (a, b) => a === b)) {
					return s;
				}
			}
		}

		return ModifiedBaseRangeState.unrecognized;
	}

	public getState(baseRange: ModifiedBaseRange): IObservable<ModifiedBaseRangeState> {
		const existingState = this.modifiedBaseRangeResultStates.get().get(baseRange);
		if (!existingState) {
			throw new BugIndicatingError('object must be from this instance');
		}
		return existingState.accepted;
	}

	public setState(
		baseRange: ModifiedBaseRange,
		state: ModifiedBaseRangeState,
		_markInputAsHandled: boolean | InputNumber,
		tx: ITransaction,
		_pushStackElement: boolean = false
	): void {
		if (!this.isUpToDate.get()) {
			throw new BugIndicatingError('Cannot set state while updating');
		}

		const existingState = this.modifiedBaseRangeResultStates.get().get(baseRange);
		if (!existingState) {
			throw new BugIndicatingError('object must be from this instance');
		}

		const conflictingDiffs = this.resultTextModelDiffs.findTouchingDiffs(
			baseRange.baseRange
		);
		const group = new UndoRedoGroup();
		if (conflictingDiffs) {
			this.resultTextModelDiffs.removeDiffs(conflictingDiffs, tx, group);
		}

		const { edit, effectiveState } = baseRange.getEditForBase(state);

		existingState.accepted.set(effectiveState, tx);
		existingState.previousNonDiffingState = undefined;
		existingState.computedFromDiffing = false;

		const input1Handled = existingState.handledInput1.get();
		const input2Handled = existingState.handledInput2.get();

		if (!input1Handled || !input2Handled) {
			this.undoRedoService.pushElement(
				new MarkAsHandledUndoRedoElement(this.resultTextModel.uri, new WeakRef(this), new WeakRef(existingState), input1Handled, input2Handled),
				group
			);
		}

		if (edit) {
			this.resultTextModel.pushStackElement();
			this.resultTextModelDiffs.applyEditRelativeToOriginal(edit, tx, group);
			this.resultTextModel.pushStackElement();
		}

		// always set conflict as handled
		existingState.handledInput1.set(true, tx);
		existingState.handledInput2.set(true, tx);
	}

	public resetDirtyConflictsToBase(): void {
		transaction(tx => {
			/** @description Reset Unknown Base Range States */
			this.resultTextModel.pushStackElement();
			for (const range of this.modifiedBaseRanges.get()) {
				if (this.getState(range).get().kind === ModifiedBaseRangeStateKind.unrecognized) {
					this.setState(range, ModifiedBaseRangeState.base, false, tx, false);
				}
			}
			this.resultTextModel.pushStackElement();
		});
	}

	public isHandled(baseRange: ModifiedBaseRange): IObservable<boolean> {
		return this.modifiedBaseRangeResultStates.get().get(baseRange)!.handled;
	}

	public isInputHandled(baseRange: ModifiedBaseRange, inputNumber: InputNumber): IObservable<boolean> {
		const state = this.modifiedBaseRangeResultStates.get().get(baseRange)!;
		return inputNumber === 1 ? state.handledInput1 : state.handledInput2;
	}

	public setInputHandled(baseRange: ModifiedBaseRange, inputNumber: InputNumber, handled: boolean, tx: ITransaction): void {
		const state = this.modifiedBaseRangeResultStates.get().get(baseRange)!;
		if (state.handled.get() === handled) {
			return;
		}

		const dataRef = new WeakRef(ModifiedBaseRangeData);
		const modelRef = new WeakRef(this);

		this.undoRedoService.pushElement({
			type: UndoRedoElementType.Resource,
			resource: this.resultTextModel.uri,
			code: 'setInputHandled',
			label: localize('setInputHandled', "Set Input Handled"),
			redo() {
				const model = modelRef.deref();
				const data = dataRef.deref();
				if (model && !model.isDisposed() && data) {
					transaction(tx => {
						if (inputNumber === 1) {
							state.handledInput1.set(handled, tx);
						} else {
							state.handledInput2.set(handled, tx);
						}
					});
				}
			},
			undo() {
				const model = modelRef.deref();
				const data = dataRef.deref();
				if (model && !model.isDisposed() && data) {
					transaction(tx => {
						if (inputNumber === 1) {
							state.handledInput1.set(!handled, tx);
						} else {
							state.handledInput2.set(!handled, tx);
						}
					});
				}
			},
		});

		if (inputNumber === 1) {
			state.handledInput1.set(handled, tx);
		} else {
			state.handledInput2.set(handled, tx);
		}
	}

	public setHandled(baseRange: ModifiedBaseRange, handled: boolean, tx: ITransaction): void {
		const state = this.modifiedBaseRangeResultStates.get().get(baseRange)!;
		if (state.handled.get() === handled) {
			return;
		}

		state.handledInput1.set(handled, tx);
		state.handledInput2.set(handled, tx);
	}

	public readonly unhandledConflictsCount;

	public readonly hasUnhandledConflicts;

	public setLanguageId(languageId: string, source?: string): void {
		const language = this.languageService.createById(languageId);
		this.base.setLanguage(language, source);
		this.input1.textModel.setLanguage(language, source);
		this.input2.textModel.setLanguage(language, source);
		this.resultTextModel.setLanguage(language, source);
	}

	public getInitialResultValue(): string {
		const chunks: string[] = [];
		while (true) {
			const chunk = this.resultSnapshot.read();
			if (chunk === null) {
				break;
			}
			chunks.push(chunk);
		}
		return chunks.join();
	}

	public async getResultValueWithConflictMarkers(): Promise<string> {
		await waitForState(this.diffComputingState, state => state === MergeEditorModelState.upToDate);

		if (this.unhandledConflictsCount.get() === 0) {
			return this.resultTextModel.getValue();
		}

		const resultLines = this.resultTextModel.getLinesContent();
		const input1Lines = this.input1.textModel.getLinesContent();
		const input2Lines = this.input2.textModel.getLinesContent();

		const states = this.modifiedBaseRangeResultStates.get();

		const outputLines: string[] = [];
		function appendLinesToResult(source: string[], lineRange: MergeEditorLineRange) {
			for (let i = lineRange.startLineNumber; i < lineRange.endLineNumberExclusive; i++) {
				outputLines.push(source[i - 1]);
			}
		}

		let resultStartLineNumber = 1;

		for (const [range, state] of states) {
			if (state.handled.get()) {
				continue;
			}
			const resultRange = this.resultTextModelDiffs.getResultLineRange(range.baseRange);

			appendLinesToResult(resultLines, MergeEditorLineRange.fromLineNumbers(resultStartLineNumber, Math.max(resultStartLineNumber, resultRange.startLineNumber)));
			resultStartLineNumber = resultRange.endLineNumberExclusive;

			outputLines.push('<<<<<<<');
			if (state.accepted.get().kind === ModifiedBaseRangeStateKind.unrecognized) {
				// to prevent loss of data, use modified result as "ours"
				appendLinesToResult(resultLines, resultRange);
			} else {
				appendLinesToResult(input1Lines, range.input1Range);
			}
			outputLines.push('=======');
			appendLinesToResult(input2Lines, range.input2Range);
			outputLines.push('>>>>>>>');
		}

		appendLinesToResult(resultLines, MergeEditorLineRange.fromLineNumbers(resultStartLineNumber, resultLines.length + 1));
		return outputLines.join('\n');
	}

	public get conflictCount(): number {
		return arrayCount(this.modifiedBaseRanges.get(), r => r.isConflicting);
	}
	public get combinableConflictCount(): number {
		return arrayCount(this.modifiedBaseRanges.get(), r => r.isConflicting && r.canBeCombined);
	}

	public get conflictsResolvedWithBase(): number {
		return arrayCount(
			this.modifiedBaseRangeResultStates.get().entries(),
			([r, s]) =>
				r.isConflicting &&
				s.accepted.get().kind === ModifiedBaseRangeStateKind.base
		);
	}
	public get conflictsResolvedWithInput1(): number {
		return arrayCount(
			this.modifiedBaseRangeResultStates.get().entries(),
			([r, s]) =>
				r.isConflicting &&
				s.accepted.get().kind === ModifiedBaseRangeStateKind.input1
		);
	}
	public get conflictsResolvedWithInput2(): number {
		return arrayCount(
			this.modifiedBaseRangeResultStates.get().entries(),
			([r, s]) =>
				r.isConflicting &&
				s.accepted.get().kind === ModifiedBaseRangeStateKind.input2
		);
	}
	public get conflictsResolvedWithSmartCombination(): number {
		return arrayCount(
			this.modifiedBaseRangeResultStates.get().entries(),
			([r, s]: [ModifiedBaseRange, ModifiedBaseRangeData]) => {
				const state = s.accepted.get();
				return r.isConflicting && state.kind === ModifiedBaseRangeStateKind.both && state.smartCombination;
			}
		);
	}

	public get manuallySolvedConflictCountThatEqualNone(): number {
		return arrayCount(
			this.modifiedBaseRangeResultStates.get().entries(),
			([r, s]) =>
				r.isConflicting &&
				s.accepted.get().kind === ModifiedBaseRangeStateKind.unrecognized
		);
	}
	public get manuallySolvedConflictCountThatEqualSmartCombine(): number {
		return arrayCount(
			this.modifiedBaseRangeResultStates.get().entries(),
			([r, s]: [ModifiedBaseRange, ModifiedBaseRangeData]) => {
				const state = s.accepted.get();
				return r.isConflicting && s.computedFromDiffing && state.kind === ModifiedBaseRangeStateKind.both && state.smartCombination;
			}
		);
	}
	public get manuallySolvedConflictCountThatEqualInput1(): number {
		return arrayCount(
			this.modifiedBaseRangeResultStates.get().entries(),
			([r, s]: [ModifiedBaseRange, ModifiedBaseRangeData]) => {
				const state = s.accepted.get();
				return r.isConflicting && s.computedFromDiffing && state.kind === ModifiedBaseRangeStateKind.input1;
			}
		);
	}
	public get manuallySolvedConflictCountThatEqualInput2(): number {
		return arrayCount(
			this.modifiedBaseRangeResultStates.get().entries(),
			([r, s]: [ModifiedBaseRange, ModifiedBaseRangeData]) => {
				const state = s.accepted.get();
				return r.isConflicting && s.computedFromDiffing && state.kind === ModifiedBaseRangeStateKind.input2;
			}
		);
	}

	public get manuallySolvedConflictCountThatEqualNoneAndStartedWithBase(): number {
		return arrayCount(
			this.modifiedBaseRangeResultStates.get().entries(),
			([r, s]: [ModifiedBaseRange, ModifiedBaseRangeData]) => {
				const state = s.accepted.get();
				return r.isConflicting && state.kind === ModifiedBaseRangeStateKind.unrecognized && s.previousNonDiffingState?.kind === ModifiedBaseRangeStateKind.base;
			}
		);
	}
	public get manuallySolvedConflictCountThatEqualNoneAndStartedWithInput1(): number {
		return arrayCount(
			this.modifiedBaseRangeResultStates.get().entries(),
			([r, s]: [ModifiedBaseRange, ModifiedBaseRangeData]) => {
				const state = s.accepted.get();
				return r.isConflicting && state.kind === ModifiedBaseRangeStateKind.unrecognized && s.previousNonDiffingState?.kind === ModifiedBaseRangeStateKind.input1;
			}
		);
	}
	public get manuallySolvedConflictCountThatEqualNoneAndStartedWithInput2(): number {
		return arrayCount(
			this.modifiedBaseRangeResultStates.get().entries(),
			([r, s]: [ModifiedBaseRange, ModifiedBaseRangeData]) => {
				const state = s.accepted.get();
				return r.isConflicting && state.kind === ModifiedBaseRangeStateKind.unrecognized && s.previousNonDiffingState?.kind === ModifiedBaseRangeStateKind.input2;
			}
		);
	}
	public get manuallySolvedConflictCountThatEqualNoneAndStartedWithBothNonSmart(): number {
		return arrayCount(
			this.modifiedBaseRangeResultStates.get().entries(),
			([r, s]: [ModifiedBaseRange, ModifiedBaseRangeData]) => {
				const state = s.accepted.get();
				return r.isConflicting && state.kind === ModifiedBaseRangeStateKind.unrecognized && s.previousNonDiffingState?.kind === ModifiedBaseRangeStateKind.both && !s.previousNonDiffingState?.smartCombination;
			}
		);
	}
	public get manuallySolvedConflictCountThatEqualNoneAndStartedWithBothSmart(): number {
		return arrayCount(
			this.modifiedBaseRangeResultStates.get().entries(),
			([r, s]: [ModifiedBaseRange, ModifiedBaseRangeData]) => {
				const state = s.accepted.get();
				return r.isConflicting && state.kind === ModifiedBaseRangeStateKind.unrecognized && s.previousNonDiffingState?.kind === ModifiedBaseRangeStateKind.both && s.previousNonDiffingState?.smartCombination;
			}
		);
	}
}

function arrayCount<T>(array: Iterable<T>, predicate: (value: T) => boolean): number {
	let count = 0;
	for (const value of array) {
		if (predicate(value)) {
			count++;
		}
	}
	return count;
}

class ModifiedBaseRangeData {
	constructor(private readonly baseRange: ModifiedBaseRange) {
		this.accepted = observableValue(`BaseRangeState${this.baseRange.baseRange}`, ModifiedBaseRangeState.base);
		this.handledInput1 = observableValue(`BaseRangeHandledState${this.baseRange.baseRange}.Input1`, false);
		this.handledInput2 = observableValue(`BaseRangeHandledState${this.baseRange.baseRange}.Input2`, false);
		this.computedFromDiffing = false;
		this.previousNonDiffingState = undefined;
		this.handled = derived(this, reader => this.handledInput1.read(reader) && this.handledInput2.read(reader));
	}

	public accepted: ISettableObservable<ModifiedBaseRangeState>;
	public handledInput1: ISettableObservable<boolean>;
	public handledInput2: ISettableObservable<boolean>;

	public computedFromDiffing;
	public previousNonDiffingState: ModifiedBaseRangeState | undefined;

	public readonly handled;
}

export const enum MergeEditorModelState {
	initializing = 1,
	upToDate = 2,
	updating = 3,
}

class MarkAsHandledUndoRedoElement implements IResourceUndoRedoElement {
	public readonly code = 'undoMarkAsHandled';
	public readonly label = localize('undoMarkAsHandled', 'Undo Mark As Handled');

	public readonly type = UndoRedoElementType.Resource;

	constructor(
		public readonly resource: URI,
		private readonly mergeEditorModelRef: WeakRef<MergeEditorModel>,
		private readonly stateRef: WeakRef<ModifiedBaseRangeData>,
		private readonly input1Handled: boolean,
		private readonly input2Handled: boolean,
	) { }

	public redo() {
		const mergeEditorModel = this.mergeEditorModelRef.deref();
		if (!mergeEditorModel || mergeEditorModel.isDisposed()) {
			return;
		}
		const state = this.stateRef.deref();
		if (!state) { return; }
		transaction(tx => {
			state.handledInput1.set(true, tx);
			state.handledInput2.set(true, tx);
		});
	}
	public undo() {
		const mergeEditorModel = this.mergeEditorModelRef.deref();
		if (!mergeEditorModel || mergeEditorModel.isDisposed()) {
			return;
		}
		const state = this.stateRef.deref();
		if (!state) { return; }
		transaction(tx => {
			state.handledInput1.set(this.input1Handled, tx);
			state.handledInput2.set(this.input2Handled, tx);
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/model/modifiedBaseRange.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/model/modifiedBaseRange.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { compareBy, concatArrays, equals, numberComparator, tieBreakComparators } from '../../../../../base/common/arrays.js';
import { BugIndicatingError } from '../../../../../base/common/errors.js';
import { splitLines } from '../../../../../base/common/strings.js';
import { Constants } from '../../../../../base/common/uint.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { LineRangeEdit, RangeEdit } from './editing.js';
import { MergeEditorLineRange } from './lineRange.js';
import { DetailedLineRangeMapping, MappingAlignment } from './mapping.js';

/**
 * Describes modifications in input 1 and input 2 for a specific range in base.
 *
 * The UI offers a mechanism to either apply all changes from input 1 or input 2 or both.
 *
 * Immutable.
*/
export class ModifiedBaseRange {
	public static fromDiffs(
		diffs1: readonly DetailedLineRangeMapping[],
		diffs2: readonly DetailedLineRangeMapping[],
		baseTextModel: ITextModel,
		input1TextModel: ITextModel,
		input2TextModel: ITextModel
	): ModifiedBaseRange[] {
		const alignments = MappingAlignment.compute(diffs1, diffs2);
		return alignments.map(
			(a) => new ModifiedBaseRange(
				a.inputRange,
				baseTextModel,
				a.output1Range,
				input1TextModel,
				a.output1LineMappings,
				a.output2Range,
				input2TextModel,
				a.output2LineMappings
			)
		);
	}

	public readonly input1CombinedDiff;
	public readonly input2CombinedDiff;
	public readonly isEqualChange;

	constructor(
		public readonly baseRange: MergeEditorLineRange,
		public readonly baseTextModel: ITextModel,
		public readonly input1Range: MergeEditorLineRange,
		public readonly input1TextModel: ITextModel,

		/**
		 * From base to input1
		*/
		public readonly input1Diffs: readonly DetailedLineRangeMapping[],
		public readonly input2Range: MergeEditorLineRange,
		public readonly input2TextModel: ITextModel,

		/**
		 * From base to input2
		*/
		public readonly input2Diffs: readonly DetailedLineRangeMapping[]
	) {
		this.input1CombinedDiff = DetailedLineRangeMapping.join(this.input1Diffs);
		this.input2CombinedDiff = DetailedLineRangeMapping.join(this.input2Diffs);
		this.isEqualChange = equals(this.input1Diffs, this.input2Diffs, (a, b) => a.getLineEdit().equals(b.getLineEdit()));
		this.smartInput1LineRangeEdit = null;
		this.smartInput2LineRangeEdit = null;
		this.dumbInput1LineRangeEdit = null;
		this.dumbInput2LineRangeEdit = null;
		if (this.input1Diffs.length === 0 && this.input2Diffs.length === 0) {
			throw new BugIndicatingError('must have at least one diff');
		}
	}

	public getInputRange(inputNumber: 1 | 2): MergeEditorLineRange {
		return inputNumber === 1 ? this.input1Range : this.input2Range;
	}

	public getInputCombinedDiff(inputNumber: 1 | 2): DetailedLineRangeMapping | undefined {
		return inputNumber === 1 ? this.input1CombinedDiff : this.input2CombinedDiff;
	}

	public getInputDiffs(inputNumber: 1 | 2): readonly DetailedLineRangeMapping[] {
		return inputNumber === 1 ? this.input1Diffs : this.input2Diffs;
	}

	public get isConflicting(): boolean {
		return this.input1Diffs.length > 0 && this.input2Diffs.length > 0;
	}

	public get canBeCombined(): boolean {
		return this.smartCombineInputs(1) !== undefined;
	}

	public get isOrderRelevant(): boolean {
		const input1 = this.smartCombineInputs(1);
		const input2 = this.smartCombineInputs(2);
		if (!input1 || !input2) {
			return false;
		}
		return !input1.equals(input2);
	}

	public getEditForBase(state: ModifiedBaseRangeState): { edit: LineRangeEdit | undefined; effectiveState: ModifiedBaseRangeState } {
		const diffs: { diff: DetailedLineRangeMapping; inputNumber: InputNumber }[] = [];
		if (state.includesInput1 && this.input1CombinedDiff) {
			diffs.push({ diff: this.input1CombinedDiff, inputNumber: 1 });
		}
		if (state.includesInput2 && this.input2CombinedDiff) {
			diffs.push({ diff: this.input2CombinedDiff, inputNumber: 2 });
		}

		if (diffs.length === 0) {
			return { edit: undefined, effectiveState: ModifiedBaseRangeState.base };
		}
		if (diffs.length === 1) {
			return { edit: diffs[0].diff.getLineEdit(), effectiveState: ModifiedBaseRangeState.base.withInputValue(diffs[0].inputNumber, true, false) };
		}

		if (state.kind !== ModifiedBaseRangeStateKind.both) {
			throw new BugIndicatingError();
		}

		const smartCombinedEdit = state.smartCombination ? this.smartCombineInputs(state.firstInput) : this.dumbCombineInputs(state.firstInput);
		if (smartCombinedEdit) {
			return { edit: smartCombinedEdit, effectiveState: state };
		}

		return {
			edit: diffs[getOtherInputNumber(state.firstInput) - 1].diff.getLineEdit(),
			effectiveState: ModifiedBaseRangeState.base.withInputValue(
				getOtherInputNumber(state.firstInput),
				true,
				false
			),
		};
	}

	private smartInput1LineRangeEdit: LineRangeEdit | undefined | null;
	private smartInput2LineRangeEdit: LineRangeEdit | undefined | null;

	private smartCombineInputs(firstInput: 1 | 2): LineRangeEdit | undefined {
		if (firstInput === 1 && this.smartInput1LineRangeEdit !== null) {
			return this.smartInput1LineRangeEdit;
		} else if (firstInput === 2 && this.smartInput2LineRangeEdit !== null) {
			return this.smartInput2LineRangeEdit;
		}

		const combinedDiffs = concatArrays(
			this.input1Diffs.flatMap((diffs) =>
				diffs.rangeMappings.map((diff) => ({ diff, input: 1 as const }))
			),
			this.input2Diffs.flatMap((diffs) =>
				diffs.rangeMappings.map((diff) => ({ diff, input: 2 as const }))
			)
		).sort(
			tieBreakComparators(
				compareBy((d) => d.diff.inputRange, Range.compareRangesUsingStarts),
				compareBy((d) => (d.input === firstInput ? 1 : 2), numberComparator)
			)
		);

		const sortedEdits = combinedDiffs.map(d => {
			const sourceTextModel = d.input === 1 ? this.input1TextModel : this.input2TextModel;
			return new RangeEdit(d.diff.inputRange, sourceTextModel.getValueInRange(d.diff.outputRange));
		});

		const result = editsToLineRangeEdit(this.baseRange, sortedEdits, this.baseTextModel);
		if (firstInput === 1) {
			this.smartInput1LineRangeEdit = result;
		} else {
			this.smartInput2LineRangeEdit = result;
		}
		return result;
	}

	private dumbInput1LineRangeEdit: LineRangeEdit | undefined | null;
	private dumbInput2LineRangeEdit: LineRangeEdit | undefined | null;

	private dumbCombineInputs(firstInput: 1 | 2): LineRangeEdit | undefined {
		if (firstInput === 1 && this.dumbInput1LineRangeEdit !== null) {
			return this.dumbInput1LineRangeEdit;
		} else if (firstInput === 2 && this.dumbInput2LineRangeEdit !== null) {
			return this.dumbInput2LineRangeEdit;
		}

		let input1Lines = this.input1Range.getLines(this.input1TextModel);
		let input2Lines = this.input2Range.getLines(this.input2TextModel);
		if (firstInput === 2) {
			[input1Lines, input2Lines] = [input2Lines, input1Lines];
		}

		const result = new LineRangeEdit(this.baseRange, input1Lines.concat(input2Lines));
		if (firstInput === 1) {
			this.dumbInput1LineRangeEdit = result;
		} else {
			this.dumbInput2LineRangeEdit = result;
		}
		return result;
	}
}

function editsToLineRangeEdit(range: MergeEditorLineRange, sortedEdits: RangeEdit[], textModel: ITextModel): LineRangeEdit | undefined {
	let text = '';
	const startsLineBefore = range.startLineNumber > 1;
	let currentPosition = startsLineBefore
		? new Position(
			range.startLineNumber - 1,
			textModel.getLineMaxColumn(range.startLineNumber - 1)
		)
		: new Position(range.startLineNumber, 1);

	for (const edit of sortedEdits) {
		const diffStart = edit.range.getStartPosition();
		if (!currentPosition.isBeforeOrEqual(diffStart)) {
			return undefined;
		}
		let originalText = textModel.getValueInRange(Range.fromPositions(currentPosition, diffStart));
		if (diffStart.lineNumber > textModel.getLineCount()) {
			// assert diffStart.lineNumber === textModel.getLineCount() + 1
			// getValueInRange doesn't include this virtual line break, as the document ends the line before.
			// endsLineAfter will be false.
			originalText += '\n';
		}
		text += originalText;
		text += edit.newText;
		currentPosition = edit.range.getEndPosition();
	}

	const endsLineAfter = range.endLineNumberExclusive <= textModel.getLineCount();
	const end = endsLineAfter ? new Position(
		range.endLineNumberExclusive,
		1
	) : new Position(range.endLineNumberExclusive - 1, Constants.MAX_SAFE_SMALL_INTEGER);

	const originalText = textModel.getValueInRange(
		Range.fromPositions(currentPosition, end)
	);
	text += originalText;

	const lines = splitLines(text);
	if (startsLineBefore) {
		if (lines[0] !== '') {
			return undefined;
		}
		lines.shift();
	}
	if (endsLineAfter) {
		if (lines[lines.length - 1] !== '') {
			return undefined;
		}
		lines.pop();
	}
	return new LineRangeEdit(range, lines);
}

export enum ModifiedBaseRangeStateKind {
	base,
	input1,
	input2,
	both,
	unrecognized,
}

export type InputNumber = 1 | 2;

export function getOtherInputNumber(inputNumber: InputNumber): InputNumber {
	return inputNumber === 1 ? 2 : 1;
}

export abstract class AbstractModifiedBaseRangeState {
	constructor() { }

	abstract get kind(): ModifiedBaseRangeStateKind;

	public get includesInput1(): boolean { return false; }
	public get includesInput2(): boolean { return false; }

	public includesInput(inputNumber: InputNumber): boolean {
		return inputNumber === 1 ? this.includesInput1 : this.includesInput2;
	}

	public isInputIncluded(inputNumber: InputNumber): boolean {
		return inputNumber === 1 ? this.includesInput1 : this.includesInput2;
	}

	public abstract toString(): string;

	public abstract swap(): ModifiedBaseRangeState;

	public abstract withInputValue(inputNumber: InputNumber, value: boolean, smartCombination?: boolean): ModifiedBaseRangeState;

	public abstract equals(other: ModifiedBaseRangeState): boolean;

	public toggle(inputNumber: InputNumber) {
		return this.withInputValue(inputNumber, !this.includesInput(inputNumber), true);
	}

	public getInput(inputNumber: 1 | 2): InputState {
		if (!this.isInputIncluded(inputNumber)) {
			return InputState.excluded;
		}
		return InputState.first;
	}
}

export class ModifiedBaseRangeStateBase extends AbstractModifiedBaseRangeState {
	override get kind(): ModifiedBaseRangeStateKind.base { return ModifiedBaseRangeStateKind.base; }
	public override toString(): string { return 'base'; }
	public override swap(): ModifiedBaseRangeState { return this; }

	public override withInputValue(inputNumber: InputNumber, value: boolean, smartCombination: boolean = false): ModifiedBaseRangeState {
		if (inputNumber === 1) {
			return value ? new ModifiedBaseRangeStateInput1() : this;
		} else {
			return value ? new ModifiedBaseRangeStateInput2() : this;
		}
	}

	public override equals(other: ModifiedBaseRangeState): boolean {
		return other.kind === ModifiedBaseRangeStateKind.base;
	}
}

export class ModifiedBaseRangeStateInput1 extends AbstractModifiedBaseRangeState {
	override get kind(): ModifiedBaseRangeStateKind.input1 { return ModifiedBaseRangeStateKind.input1; }
	override get includesInput1(): boolean { return true; }
	public toString(): string { return '1✓'; }
	public override swap(): ModifiedBaseRangeState { return new ModifiedBaseRangeStateInput2(); }

	public override withInputValue(inputNumber: InputNumber, value: boolean, smartCombination: boolean = false): ModifiedBaseRangeState {
		if (inputNumber === 1) {
			return value ? this : new ModifiedBaseRangeStateBase();
		} else {
			return value ? new ModifiedBaseRangeStateBoth(1, smartCombination) : new ModifiedBaseRangeStateInput2();
		}
	}

	public override equals(other: ModifiedBaseRangeState): boolean {
		return other.kind === ModifiedBaseRangeStateKind.input1;
	}
}

export class ModifiedBaseRangeStateInput2 extends AbstractModifiedBaseRangeState {
	override get kind(): ModifiedBaseRangeStateKind.input2 { return ModifiedBaseRangeStateKind.input2; }
	override get includesInput2(): boolean { return true; }
	public toString(): string { return '2✓'; }
	public override swap(): ModifiedBaseRangeState { return new ModifiedBaseRangeStateInput1(); }

	public withInputValue(inputNumber: InputNumber, value: boolean, smartCombination: boolean = false): ModifiedBaseRangeState {
		if (inputNumber === 2) {
			return value ? this : new ModifiedBaseRangeStateBase();
		} else {
			return value ? new ModifiedBaseRangeStateBoth(2, smartCombination) : new ModifiedBaseRangeStateInput2();
		}
	}

	public override equals(other: ModifiedBaseRangeState): boolean {
		return other.kind === ModifiedBaseRangeStateKind.input2;
	}
}

export class ModifiedBaseRangeStateBoth extends AbstractModifiedBaseRangeState {
	constructor(
		public readonly firstInput: InputNumber,
		public readonly smartCombination: boolean
	) {
		super();
	}

	override get kind(): ModifiedBaseRangeStateKind.both { return ModifiedBaseRangeStateKind.both; }
	override get includesInput1(): boolean { return true; }
	override get includesInput2(): boolean { return true; }

	public toString(): string {
		return '2✓';
	}

	public override swap(): ModifiedBaseRangeState { return new ModifiedBaseRangeStateBoth(getOtherInputNumber(this.firstInput), this.smartCombination); }

	public withInputValue(inputNumber: InputNumber, value: boolean, smartCombination: boolean = false): ModifiedBaseRangeState {
		if (value) {
			return this;
		}
		return inputNumber === 1 ? new ModifiedBaseRangeStateInput2() : new ModifiedBaseRangeStateInput1();
	}

	public override equals(other: ModifiedBaseRangeState): boolean {
		return other.kind === ModifiedBaseRangeStateKind.both && this.firstInput === other.firstInput && this.smartCombination === other.smartCombination;
	}

	public override getInput(inputNumber: 1 | 2): InputState {
		return inputNumber === this.firstInput ? InputState.first : InputState.second;
	}
}

export class ModifiedBaseRangeStateUnrecognized extends AbstractModifiedBaseRangeState {
	override get kind(): ModifiedBaseRangeStateKind.unrecognized { return ModifiedBaseRangeStateKind.unrecognized; }
	public override toString(): string { return 'unrecognized'; }
	public override swap(): ModifiedBaseRangeState { return this; }

	public withInputValue(inputNumber: InputNumber, value: boolean, smartCombination: boolean = false): ModifiedBaseRangeState {
		if (!value) {
			return this;
		}
		return inputNumber === 1 ? new ModifiedBaseRangeStateInput1() : new ModifiedBaseRangeStateInput2();
	}

	public override equals(other: ModifiedBaseRangeState): boolean {
		return other.kind === ModifiedBaseRangeStateKind.unrecognized;
	}
}

export type ModifiedBaseRangeState = ModifiedBaseRangeStateBase | ModifiedBaseRangeStateInput1 | ModifiedBaseRangeStateInput2 | ModifiedBaseRangeStateInput2 | ModifiedBaseRangeStateBoth | ModifiedBaseRangeStateUnrecognized;

export namespace ModifiedBaseRangeState {
	export const base = new ModifiedBaseRangeStateBase();
	export const unrecognized = new ModifiedBaseRangeStateUnrecognized();
}

export const enum InputState {
	excluded = 0,
	first = 1,
	second = 2,
	unrecognized = 3
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/model/rangeUtils.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/model/rangeUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Position } from '../../../../../editor/common/core/position.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { TextLength } from '../../../../../editor/common/core/text/textLength.js';

export function rangeContainsPosition(range: Range, position: Position): boolean {
	if (position.lineNumber < range.startLineNumber || position.lineNumber > range.endLineNumber) {
		return false;
	}
	if (position.lineNumber === range.startLineNumber && position.column < range.startColumn) {
		return false;
	}
	if (position.lineNumber === range.endLineNumber && position.column >= range.endColumn) {
		return false;
	}
	return true;
}

export function lengthOfRange(range: Range): TextLength {
	if (range.startLineNumber === range.endLineNumber) {
		return new TextLength(0, range.endColumn - range.startColumn);
	} else {
		return new TextLength(range.endLineNumber - range.startLineNumber, range.endColumn - 1);
	}
}

export function lengthBetweenPositions(position1: Position, position2: Position): TextLength {
	if (position1.lineNumber === position2.lineNumber) {
		return new TextLength(0, position2.column - position1.column);
	} else {
		return new TextLength(position2.lineNumber - position1.lineNumber, position2.column - 1);
	}
}

export function addLength(position: Position, length: TextLength): Position {
	if (length.lineCount === 0) {
		return new Position(position.lineNumber, position.column + length.columnCount);
	} else {
		return new Position(position.lineNumber + length.lineCount, length.columnCount + 1);
	}
}

export function rangeIsBeforeOrTouching(range: Range, other: Range): boolean {
	return (
		range.endLineNumber < other.startLineNumber ||
		(range.endLineNumber === other.startLineNumber &&
			range.endColumn <= other.startColumn)
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/model/textModelDiffs.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/model/textModelDiffs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { compareBy, numberComparator } from '../../../../../base/common/arrays.js';
import { BugIndicatingError } from '../../../../../base/common/errors.js';
import { Disposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { DetailedLineRangeMapping } from './mapping.js';
import { LineRangeEdit } from './editing.js';
import { MergeEditorLineRange } from './lineRange.js';
import { ReentrancyBarrier } from '../../../../../base/common/controlFlow.js';
import { IMergeDiffComputer } from './diffComputer.js';
import { autorun, IObservableWithChange, IReader, ITransaction, observableSignal, observableValue, transaction } from '../../../../../base/common/observable.js';
import { UndoRedoGroup } from '../../../../../platform/undoRedo/common/undoRedo.js';

export class TextModelDiffs extends Disposable {
	private _recomputeCount = 0;
	private readonly _state = observableValue<TextModelDiffState, TextModelDiffChangeReason>(this, TextModelDiffState.initializing);
	private readonly _diffs = observableValue<DetailedLineRangeMapping[], TextModelDiffChangeReason>(this, []);

	private readonly _barrier = new ReentrancyBarrier();
	private _isDisposed = false;

	public get isApplyingChange() {
		return this._barrier.isOccupied;
	}

	constructor(
		private readonly baseTextModel: ITextModel,
		private readonly textModel: ITextModel,
		private readonly diffComputer: IMergeDiffComputer,
	) {
		super();

		const recomputeSignal = observableSignal('recompute');

		this._register(autorun(reader => {
			/** @description Update diff state */
			recomputeSignal.read(reader);
			this._recompute(reader);
		}));

		this._register(
			baseTextModel.onDidChangeContent(
				this._barrier.makeExclusiveOrSkip(() => {
					recomputeSignal.trigger(undefined);
				})
			)
		);
		this._register(
			textModel.onDidChangeContent(
				this._barrier.makeExclusiveOrSkip(() => {
					recomputeSignal.trigger(undefined);
				})
			)
		);
		this._register(toDisposable(() => {
			this._isDisposed = true;
		}));
	}

	public get state(): IObservableWithChange<TextModelDiffState, TextModelDiffChangeReason> {
		return this._state;
	}

	/**
	 * Diffs from base to input.
	*/
	public get diffs(): IObservableWithChange<DetailedLineRangeMapping[], TextModelDiffChangeReason> {
		return this._diffs;
	}

	private _isInitializing = true;

	private _recompute(reader: IReader): void {
		this._recomputeCount++;
		const currentRecomputeIdx = this._recomputeCount;

		if (this._state.get() === TextModelDiffState.initializing) {
			this._isInitializing = true;
		}

		transaction(tx => {
			/** @description Starting Diff Computation. */
			this._state.set(
				this._isInitializing ? TextModelDiffState.initializing : TextModelDiffState.updating,
				tx,
				TextModelDiffChangeReason.other
			);
		});

		const result = this.diffComputer.computeDiff(this.baseTextModel, this.textModel, reader);

		result.then((result) => {
			if (this._isDisposed) {
				return;
			}

			if (currentRecomputeIdx !== this._recomputeCount) {
				// There is a newer recompute call
				return;
			}

			transaction(tx => {
				/** @description Completed Diff Computation */
				if (result.diffs) {
					this._state.set(TextModelDiffState.upToDate, tx, TextModelDiffChangeReason.textChange);
					this._diffs.set(result.diffs, tx, TextModelDiffChangeReason.textChange);
				} else {
					this._state.set(TextModelDiffState.error, tx, TextModelDiffChangeReason.textChange);
				}
				this._isInitializing = false;
			});
		});
	}

	private ensureUpToDate(): void {
		if (this.state.get() !== TextModelDiffState.upToDate) {
			throw new BugIndicatingError('Cannot remove diffs when the model is not up to date');
		}
	}

	public removeDiffs(diffToRemoves: DetailedLineRangeMapping[], transaction: ITransaction | undefined, group?: UndoRedoGroup): void {
		this.ensureUpToDate();

		diffToRemoves.sort(compareBy((d) => d.inputRange.startLineNumber, numberComparator));
		diffToRemoves.reverse();

		let diffs = this._diffs.get();

		for (const diffToRemove of diffToRemoves) {
			// TODO improve performance
			const len = diffs.length;
			diffs = diffs.filter((d) => d !== diffToRemove);
			if (len === diffs.length) {
				throw new BugIndicatingError();
			}

			this._barrier.runExclusivelyOrThrow(() => {
				const edits = diffToRemove.getReverseLineEdit().toEdits(this.textModel.getLineCount());
				this.textModel.pushEditOperations(null, edits, () => null, group);
			});

			diffs = diffs.map((d) =>
				d.outputRange.isAfter(diffToRemove.outputRange)
					? d.addOutputLineDelta(diffToRemove.inputRange.length - diffToRemove.outputRange.length)
					: d
			);
		}

		this._diffs.set(diffs, transaction, TextModelDiffChangeReason.other);
	}

	/**
	 * Edit must be conflict free.
	 */
	public applyEditRelativeToOriginal(edit: LineRangeEdit, transaction: ITransaction | undefined, group?: UndoRedoGroup): void {
		this.ensureUpToDate();

		const editMapping = new DetailedLineRangeMapping(
			edit.range,
			this.baseTextModel,
			MergeEditorLineRange.fromLength(edit.range.startLineNumber, edit.newLines.length),
			this.textModel
		);

		let firstAfter = false;
		let delta = 0;
		const newDiffs = new Array<DetailedLineRangeMapping>();
		for (const diff of this.diffs.get()) {
			if (diff.inputRange.intersectsOrTouches(edit.range)) {
				throw new BugIndicatingError('Edit must be conflict free.');
			} else if (diff.inputRange.isAfter(edit.range)) {
				if (!firstAfter) {
					firstAfter = true;
					newDiffs.push(editMapping.addOutputLineDelta(delta));
				}

				newDiffs.push(diff.addOutputLineDelta(edit.newLines.length - edit.range.length));
			} else {
				newDiffs.push(diff);
			}

			if (!firstAfter) {
				delta += diff.outputRange.length - diff.inputRange.length;
			}
		}

		if (!firstAfter) {
			firstAfter = true;
			newDiffs.push(editMapping.addOutputLineDelta(delta));
		}

		this._barrier.runExclusivelyOrThrow(() => {
			const edits = new LineRangeEdit(edit.range.delta(delta), edit.newLines).toEdits(this.textModel.getLineCount());
			this.textModel.pushEditOperations(null, edits, () => null, group);
		});
		this._diffs.set(newDiffs, transaction, TextModelDiffChangeReason.other);
	}

	public findTouchingDiffs(baseRange: MergeEditorLineRange): DetailedLineRangeMapping[] {
		return this.diffs.get().filter(d => d.inputRange.intersectsOrTouches(baseRange));
	}

	private getResultLine(lineNumber: number, reader?: IReader): number | DetailedLineRangeMapping {
		let offset = 0;
		const diffs = reader ? this.diffs.read(reader) : this.diffs.get();
		for (const diff of diffs) {
			if (diff.inputRange.contains(lineNumber) || diff.inputRange.endLineNumberExclusive === lineNumber) {
				return diff;
			} else if (diff.inputRange.endLineNumberExclusive < lineNumber) {
				offset = diff.resultingDeltaFromOriginalToModified;
			} else {
				break;
			}
		}
		return lineNumber + offset;
	}

	public getResultLineRange(baseRange: MergeEditorLineRange, reader?: IReader): MergeEditorLineRange {
		let start = this.getResultLine(baseRange.startLineNumber, reader);
		if (typeof start !== 'number') {
			start = start.outputRange.startLineNumber;
		}
		let endExclusive = this.getResultLine(baseRange.endLineNumberExclusive, reader);
		if (typeof endExclusive !== 'number') {
			endExclusive = endExclusive.outputRange.endLineNumberExclusive;
		}

		return MergeEditorLineRange.fromLineNumbers(start, endExclusive);
	}
}

export const enum TextModelDiffChangeReason {
	other = 0,
	textChange = 1,
}

export const enum TextModelDiffState {
	initializing = 1,
	upToDate = 2,
	updating = 3,
	error = 4,
}

export interface ITextModelDiffsState {
	state: TextModelDiffState;
	diffs: DetailedLineRangeMapping[];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/view/colors.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/view/colors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../nls.js';
import { mergeCurrentHeaderBackground, mergeIncomingHeaderBackground, registerColor, transparent } from '../../../../../platform/theme/common/colorRegistry.js';

export const diff = registerColor(
	'mergeEditor.change.background',
	'#9bb95533',
	localize('mergeEditor.change.background', 'The background color for changes.')
);

export const diffWord = registerColor(
	'mergeEditor.change.word.background',
	{ dark: '#9ccc2c33', light: '#9ccc2c66', hcDark: '#9ccc2c33', hcLight: '#9ccc2c66', },
	localize('mergeEditor.change.word.background', 'The background color for word changes.')
);

export const diffBase = registerColor(
	'mergeEditor.changeBase.background',
	{ dark: '#4B1818FF', light: '#FFCCCCFF', hcDark: '#4B1818FF', hcLight: '#FFCCCCFF', },
	localize('mergeEditor.changeBase.background', 'The background color for changes in base.')
);

export const diffWordBase = registerColor(
	'mergeEditor.changeBase.word.background',
	{ dark: '#6F1313FF', light: '#FFA3A3FF', hcDark: '#6F1313FF', hcLight: '#FFA3A3FF', },
	localize('mergeEditor.changeBase.word.background', 'The background color for word changes in base.')
);

export const conflictBorderUnhandledUnfocused = registerColor(
	'mergeEditor.conflict.unhandledUnfocused.border',
	{ dark: '#ffa6007a', light: '#ffa600FF', hcDark: '#ffa6007a', hcLight: '#ffa6007a', },
	localize('mergeEditor.conflict.unhandledUnfocused.border', 'The border color of unhandled unfocused conflicts.')
);

export const conflictBorderUnhandledFocused = registerColor(
	'mergeEditor.conflict.unhandledFocused.border',
	'#ffa600',
	localize('mergeEditor.conflict.unhandledFocused.border', 'The border color of unhandled focused conflicts.')
);

export const conflictBorderHandledUnfocused = registerColor(
	'mergeEditor.conflict.handledUnfocused.border',
	'#86868649',
	localize('mergeEditor.conflict.handledUnfocused.border', 'The border color of handled unfocused conflicts.')
);

export const conflictBorderHandledFocused = registerColor(
	'mergeEditor.conflict.handledFocused.border',
	'#c1c1c1cc',
	localize('mergeEditor.conflict.handledFocused.border', 'The border color of handled focused conflicts.')
);

export const handledConflictMinimapOverViewRulerColor = registerColor(
	'mergeEditor.conflict.handled.minimapOverViewRuler',
	'#adaca8ee',
	localize('mergeEditor.conflict.handled.minimapOverViewRuler', 'The foreground color for changes in input 1.')
);

export const unhandledConflictMinimapOverViewRulerColor = registerColor(
	'mergeEditor.conflict.unhandled.minimapOverViewRuler',
	'#fcba03FF',
	localize('mergeEditor.conflict.unhandled.minimapOverViewRuler', 'The foreground color for changes in input 1.')
);

export const conflictingLinesBackground = registerColor(
	'mergeEditor.conflictingLines.background',
	'#ffea0047',
	localize('mergeEditor.conflictingLines.background', 'The background of the "Conflicting Lines" text.')
);

const contentTransparency = 0.4;
export const conflictInput1Background = registerColor(
	'mergeEditor.conflict.input1.background',
	transparent(mergeCurrentHeaderBackground, contentTransparency),
	localize('mergeEditor.conflict.input1.background', 'The background color of decorations in input 1.')
);

export const conflictInput2Background = registerColor(
	'mergeEditor.conflict.input2.background',
	transparent(mergeIncomingHeaderBackground, contentTransparency),
	localize('mergeEditor.conflict.input2.background', 'The background color of decorations in input 2.')
);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/view/conflictActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/view/conflictActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, h, isInShadowDOM, reset } from '../../../../../base/browser/dom.js';
import { createStyleSheet } from '../../../../../base/browser/domStylesheets.js';
import { renderLabelWithIcons } from '../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { hash } from '../../../../../base/common/hash.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun, derived, IObservable, transaction } from '../../../../../base/common/observable.js';
import { ICodeEditor, IViewZoneChangeAccessor } from '../../../../../editor/browser/editorBrowser.js';
import { EditorOption } from '../../../../../editor/common/config/editorOptions.js';
import { EDITOR_FONT_DEFAULTS } from '../../../../../editor/common/config/fontInfo.js';
import { localize } from '../../../../../nls.js';
import { ModifiedBaseRange, ModifiedBaseRangeState, ModifiedBaseRangeStateKind } from '../model/modifiedBaseRange.js';
import { FixedZoneWidget } from './fixedZoneWidget.js';
import { MergeEditorViewModel } from './viewModel.js';

export class ConflictActionsFactory extends Disposable {
	private readonly _styleClassName: string;
	private readonly _styleElement: HTMLStyleElement;

	constructor(private readonly _editor: ICodeEditor) {
		super();

		this._register(this._editor.onDidChangeConfiguration((e) => {
			if (e.hasChanged(EditorOption.fontInfo) || e.hasChanged(EditorOption.codeLensFontSize) || e.hasChanged(EditorOption.codeLensFontFamily)) {
				this._updateLensStyle();
			}
		}));

		this._styleClassName = '_conflictActionsFactory_' + hash(this._editor.getId()).toString(16);
		this._styleElement = createStyleSheet(
			isInShadowDOM(this._editor.getContainerDomNode())
				? this._editor.getContainerDomNode()
				: undefined, undefined, this._store
		);

		this._updateLensStyle();
	}

	private _updateLensStyle(): void {
		const { codeLensHeight, fontSize } = this._getLayoutInfo();
		const fontFamily = this._editor.getOption(EditorOption.codeLensFontFamily);
		const editorFontInfo = this._editor.getOption(EditorOption.fontInfo);

		const fontFamilyVar = `--codelens-font-family${this._styleClassName}`;
		const fontFeaturesVar = `--codelens-font-features${this._styleClassName}`;

		let newStyle = `
		.${this._styleClassName} { line-height: ${codeLensHeight}px; font-size: ${fontSize}px; padding-right: ${Math.round(fontSize * 0.5)}px; font-feature-settings: var(${fontFeaturesVar}) }
		.monaco-workbench .${this._styleClassName} span.codicon { line-height: ${codeLensHeight}px; font-size: ${fontSize}px; }
		`;
		if (fontFamily) {
			newStyle += `${this._styleClassName} { font-family: var(${fontFamilyVar}), ${EDITOR_FONT_DEFAULTS.fontFamily}}`;
		}
		this._styleElement.textContent = newStyle;
		this._editor.getContainerDomNode().style?.setProperty(fontFamilyVar, fontFamily ?? 'inherit');
		this._editor.getContainerDomNode().style?.setProperty(fontFeaturesVar, editorFontInfo.fontFeatureSettings);
	}

	private _getLayoutInfo() {
		const lineHeightFactor = Math.max(1.3, this._editor.getOption(EditorOption.lineHeight) / this._editor.getOption(EditorOption.fontSize));
		let fontSize = this._editor.getOption(EditorOption.codeLensFontSize);
		if (!fontSize || fontSize < 5) {
			fontSize = (this._editor.getOption(EditorOption.fontSize) * .9) | 0;
		}
		return {
			fontSize,
			codeLensHeight: (fontSize * lineHeightFactor) | 0,
		};
	}

	public createWidget(viewZoneChangeAccessor: IViewZoneChangeAccessor, lineNumber: number, items: IObservable<IContentWidgetAction[]>, viewZoneIdsToCleanUp: string[]): IDisposable {
		const layoutInfo = this._getLayoutInfo();
		return new ActionsContentWidget(
			this._editor,
			viewZoneChangeAccessor,
			lineNumber,
			layoutInfo.codeLensHeight + 2,
			this._styleClassName,
			items,
			viewZoneIdsToCleanUp,
		);
	}
}

export class ActionsSource {
	constructor(
		private readonly viewModel: MergeEditorViewModel,
		private readonly modifiedBaseRange: ModifiedBaseRange,
	) {
	}

	private getItemsInput(inputNumber: 1 | 2): IObservable<IContentWidgetAction[]> {
		return derived(reader => {
			/** @description items */
			const viewModel = this.viewModel;
			const modifiedBaseRange = this.modifiedBaseRange;

			if (!viewModel.model.hasBaseRange(modifiedBaseRange)) {
				return [];
			}

			const state = viewModel.model.getState(modifiedBaseRange).read(reader);
			const handled = viewModel.model.isHandled(modifiedBaseRange).read(reader);
			const model = viewModel.model;

			const result: IContentWidgetAction[] = [];

			const inputData = inputNumber === 1 ? viewModel.model.input1 : viewModel.model.input2;
			const showNonConflictingChanges = viewModel.showNonConflictingChanges.read(reader);

			if (!modifiedBaseRange.isConflicting && handled && !showNonConflictingChanges) {
				return [];
			}

			const otherInputNumber = inputNumber === 1 ? 2 : 1;

			if (state.kind !== ModifiedBaseRangeStateKind.unrecognized && !state.isInputIncluded(inputNumber)) {
				if (!state.isInputIncluded(otherInputNumber) || !this.viewModel.shouldUseAppendInsteadOfAccept.read(reader)) {
					result.push(
						command(localize('accept', "Accept {0}", inputData.title), async () => {
							transaction((tx) => {
								model.setState(
									modifiedBaseRange,
									state.withInputValue(inputNumber, true, false),
									inputNumber,
									tx
								);
								model.telemetry.reportAcceptInvoked(inputNumber, state.includesInput(otherInputNumber));
							});
						}, localize('acceptTooltip', "Accept {0} in the result document.", inputData.title))
					);

					if (modifiedBaseRange.canBeCombined) {
						const commandName = modifiedBaseRange.isOrderRelevant
							? localize('acceptBoth0First', "Accept Combination ({0} First)", inputData.title)
							: localize('acceptBoth', "Accept Combination");

						result.push(
							command(commandName, async () => {
								transaction((tx) => {
									model.setState(
										modifiedBaseRange,
										ModifiedBaseRangeState.base
											.withInputValue(inputNumber, true)
											.withInputValue(otherInputNumber, true, true),
										true,
										tx
									);
									model.telemetry.reportSmartCombinationInvoked(state.includesInput(otherInputNumber));
								});
							}, localize('acceptBothTooltip', "Accept an automatic combination of both sides in the result document.")),
						);
					}
				} else {
					result.push(
						command(localize('append', "Append {0}", inputData.title), async () => {
							transaction((tx) => {
								model.setState(
									modifiedBaseRange,
									state.withInputValue(inputNumber, true, false),
									inputNumber,
									tx
								);
								model.telemetry.reportAcceptInvoked(inputNumber, state.includesInput(otherInputNumber));
							});
						}, localize('appendTooltip', "Append {0} to the result document.", inputData.title))
					);

					if (modifiedBaseRange.canBeCombined) {
						result.push(
							command(localize('combine', "Accept Combination", inputData.title), async () => {
								transaction((tx) => {
									model.setState(
										modifiedBaseRange,
										state.withInputValue(inputNumber, true, true),
										inputNumber,
										tx
									);
									model.telemetry.reportSmartCombinationInvoked(state.includesInput(otherInputNumber));
								});
							}, localize('acceptBothTooltip', "Accept an automatic combination of both sides in the result document.")),
						);
					}
				}

				if (!model.isInputHandled(modifiedBaseRange, inputNumber).read(reader)) {
					result.push(
						command(
							localize('ignore', 'Ignore'),
							async () => {
								transaction((tx) => {
									model.setInputHandled(modifiedBaseRange, inputNumber, true, tx);
								});
							},
							localize('markAsHandledTooltip', "Don't take this side of the conflict.")
						)
					);
				}

			}
			return result;
		});
	}

	public readonly itemsInput1 = this.getItemsInput(1);
	public readonly itemsInput2 = this.getItemsInput(2);

	public readonly resultItems = derived(this, reader => {
		const viewModel = this.viewModel;
		const modifiedBaseRange = this.modifiedBaseRange;

		const state = viewModel.model.getState(modifiedBaseRange).read(reader);
		const model = viewModel.model;

		const result: IContentWidgetAction[] = [];

		if (state.kind === ModifiedBaseRangeStateKind.unrecognized) {
			result.push({
				text: localize('manualResolution', "Manual Resolution"),
				tooltip: localize('manualResolutionTooltip', "This conflict has been resolved manually."),
			});
		} else if (state.kind === ModifiedBaseRangeStateKind.base) {
			result.push({
				text: localize('noChangesAccepted', 'No Changes Accepted'),
				tooltip: localize(
					'noChangesAcceptedTooltip',
					'The current resolution of this conflict equals the common ancestor of both the right and left changes.'
				),
			});

		} else {
			const labels = [];
			if (state.includesInput1) {
				labels.push(model.input1.title);
			}
			if (state.includesInput2) {
				labels.push(model.input2.title);
			}
			if (state.kind === ModifiedBaseRangeStateKind.both && state.firstInput === 2) {
				labels.reverse();
			}
			result.push({
				text: `${labels.join(' + ')}`
			});
		}

		const stateToggles: IContentWidgetAction[] = [];
		if (state.includesInput1) {
			stateToggles.push(
				command(
					localize('remove', 'Remove {0}', model.input1.title),
					async () => {
						transaction((tx) => {
							model.setState(
								modifiedBaseRange,
								state.withInputValue(1, false),
								true,
								tx
							);
							model.telemetry.reportRemoveInvoked(1, state.includesInput(2));
						});
					},
					localize('removeTooltip', 'Remove {0} from the result document.', model.input1.title)
				)
			);
		}
		if (state.includesInput2) {
			stateToggles.push(
				command(
					localize('remove', 'Remove {0}', model.input2.title),
					async () => {
						transaction((tx) => {
							model.setState(
								modifiedBaseRange,
								state.withInputValue(2, false),
								true,
								tx
							);
							model.telemetry.reportRemoveInvoked(2, state.includesInput(1));
						});
					},
					localize('removeTooltip', 'Remove {0} from the result document.', model.input2.title)
				)
			);
		}
		if (
			state.kind === ModifiedBaseRangeStateKind.both &&
			state.firstInput === 2
		) {
			stateToggles.reverse();
		}
		result.push(...stateToggles);

		if (state.kind === ModifiedBaseRangeStateKind.unrecognized) {
			result.push(
				command(
					localize('resetToBase', 'Reset to base'),
					async () => {
						transaction((tx) => {
							model.setState(
								modifiedBaseRange,
								ModifiedBaseRangeState.base,
								true,
								tx
							);
							model.telemetry.reportResetToBaseInvoked();
						});
					},
					localize('resetToBaseTooltip', 'Reset this conflict to the common ancestor of both the right and left changes.')
				)
			);
		}

		return result;
	});

	public readonly isEmpty = derived(this, reader => {
		return this.itemsInput1.read(reader).length + this.itemsInput2.read(reader).length + this.resultItems.read(reader).length === 0;
	});

	public readonly inputIsEmpty = derived(this, reader => {
		return this.itemsInput1.read(reader).length + this.itemsInput2.read(reader).length === 0;
	});
}

function command(title: string, action: () => Promise<void>, tooltip?: string): IContentWidgetAction {
	return {
		text: title,
		action,
		tooltip,
	};
}

export interface IContentWidgetAction {
	text: string;
	tooltip?: string;
	action?: () => Promise<void>;
}

class ActionsContentWidget extends FixedZoneWidget {
	private readonly _domNode = h('div.merge-editor-conflict-actions').root;

	constructor(
		editor: ICodeEditor,
		viewZoneAccessor: IViewZoneChangeAccessor,
		afterLineNumber: number,
		height: number,

		className: string,
		items: IObservable<IContentWidgetAction[]>,
		viewZoneIdsToCleanUp: string[],
	) {
		super(editor, viewZoneAccessor, afterLineNumber, height, viewZoneIdsToCleanUp);

		this.widgetDomNode.appendChild(this._domNode);

		this._domNode.classList.add(className);

		this._register(autorun(reader => {
			/** @description update commands */
			const i = items.read(reader);
			this.setState(i);
		}));
	}

	private setState(items: IContentWidgetAction[]) {
		const children: HTMLElement[] = [];
		let isFirst = true;
		for (const item of items) {
			if (isFirst) {
				isFirst = false;
			} else {
				children.push($('span', undefined, '\u00a0|\u00a0'));
			}
			const title = renderLabelWithIcons(item.text);

			if (item.action) {
				children.push($('a', { title: item.tooltip, role: 'button', onclick: () => item.action!() }, ...title));
			} else {
				children.push($('span', { title: item.tooltip }, ...title));
			}
		}

		reset(this._domNode, ...children);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/view/editorGutter.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/view/editorGutter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { h, reset } from '../../../../../base/browser/dom.js';
import { Disposable, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun, IReader, observableFromEvent, observableSignal, observableSignalFromEvent, transaction } from '../../../../../base/common/observable.js';
import { CodeEditorWidget } from '../../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { MergeEditorLineRange } from '../model/lineRange.js';

export class EditorGutter<T extends IGutterItemInfo = IGutterItemInfo> extends Disposable {
	private readonly scrollTop;
	private readonly isScrollTopZero;
	private readonly modelAttached;

	private readonly editorOnDidChangeViewZones;
	private readonly editorOnDidContentSizeChange;
	private readonly domNodeSizeChanged;

	constructor(
		private readonly _editor: CodeEditorWidget,
		private readonly _domNode: HTMLElement,
		private readonly itemProvider: IGutterItemProvider<T>
	) {
		super();
		this.scrollTop = observableFromEvent(this,
			this._editor.onDidScrollChange,
			(e) => /** @description editor.onDidScrollChange */ this._editor.getScrollTop()
		);
		this.isScrollTopZero = this.scrollTop.map((scrollTop) => /** @description isScrollTopZero */ scrollTop === 0);
		this.modelAttached = observableFromEvent(this,
			this._editor.onDidChangeModel,
			(e) => /** @description editor.onDidChangeModel */ this._editor.hasModel()
		);
		this.editorOnDidChangeViewZones = observableSignalFromEvent('onDidChangeViewZones', this._editor.onDidChangeViewZones);
		this.editorOnDidContentSizeChange = observableSignalFromEvent('onDidContentSizeChange', this._editor.onDidContentSizeChange);
		this.domNodeSizeChanged = observableSignal('domNodeSizeChanged');
		this.views = new Map<string, ManagedGutterItemView>();
		this._domNode.className = 'gutter monaco-editor';
		const scrollDecoration = this._domNode.appendChild(
			h('div.scroll-decoration', { role: 'presentation', ariaHidden: 'true', style: { width: '100%' } })
				.root
		);

		const o = new ResizeObserver(() => {
			transaction(tx => {
				/** @description ResizeObserver: size changed */
				this.domNodeSizeChanged.trigger(tx);
			});
		});
		o.observe(this._domNode);
		this._register(toDisposable(() => o.disconnect()));

		this._register(autorun(reader => {
			/** @description update scroll decoration */
			scrollDecoration.className = this.isScrollTopZero.read(reader) ? '' : 'scroll-decoration';
		}));

		this._register(autorun(reader => /** @description EditorGutter.Render */ this.render(reader)));
	}

	override dispose(): void {
		super.dispose();

		reset(this._domNode);
	}

	private readonly views;

	private render(reader: IReader): void {
		if (!this.modelAttached.read(reader)) {
			return;
		}

		this.domNodeSizeChanged.read(reader);
		this.editorOnDidChangeViewZones.read(reader);
		this.editorOnDidContentSizeChange.read(reader);

		const scrollTop = this.scrollTop.read(reader);

		const visibleRanges = this._editor.getVisibleRanges();
		const unusedIds = new Set(this.views.keys());

		if (visibleRanges.length > 0) {
			const visibleRange = visibleRanges[0];

			const visibleRange2 = MergeEditorLineRange.fromLength(
				visibleRange.startLineNumber,
				visibleRange.endLineNumber - visibleRange.startLineNumber
			).deltaEnd(1);

			const gutterItems = this.itemProvider.getIntersectingGutterItems(
				visibleRange2,
				reader
			);

			for (const gutterItem of gutterItems) {
				if (!gutterItem.range.intersectsOrTouches(visibleRange2)) {
					continue;
				}

				unusedIds.delete(gutterItem.id);
				let view = this.views.get(gutterItem.id);
				if (!view) {
					const viewDomNode = document.createElement('div');
					this._domNode.appendChild(viewDomNode);
					const itemView = this.itemProvider.createView(
						gutterItem,
						viewDomNode
					);
					view = new ManagedGutterItemView(itemView, viewDomNode);
					this.views.set(gutterItem.id, view);
				} else {
					view.gutterItemView.update(gutterItem);
				}

				const top =
					gutterItem.range.startLineNumber <= this._editor.getModel()!.getLineCount()
						? this._editor.getTopForLineNumber(gutterItem.range.startLineNumber, true) - scrollTop
						: this._editor.getBottomForLineNumber(gutterItem.range.startLineNumber - 1, false) - scrollTop;
				const bottom = this._editor.getBottomForLineNumber(gutterItem.range.endLineNumberExclusive - 1, true) - scrollTop;

				const height = bottom - top;

				view.domNode.style.top = `${top}px`;
				view.domNode.style.height = `${height}px`;

				view.gutterItemView.layout(top, height, 0, this._domNode.clientHeight);
			}
		}

		for (const id of unusedIds) {
			const view = this.views.get(id)!;
			view.gutterItemView.dispose();
			view.domNode.remove();
			this.views.delete(id);
		}
	}
}

class ManagedGutterItemView {
	constructor(
		public readonly gutterItemView: IGutterItemView<any>,
		public readonly domNode: HTMLDivElement
	) { }
}

export interface IGutterItemProvider<TItem extends IGutterItemInfo> {
	getIntersectingGutterItems(range: MergeEditorLineRange, reader: IReader): TItem[];

	createView(item: TItem, target: HTMLElement): IGutterItemView<TItem>;
}

export interface IGutterItemInfo {
	id: string;
	range: MergeEditorLineRange;
}

export interface IGutterItemView<T extends IGutterItemInfo> extends IDisposable {
	update(item: T): void;
	layout(top: number, height: number, viewTop: number, viewHeight: number): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/view/fixedZoneWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/view/fixedZoneWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { h } from '../../../../../base/browser/dom.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ICodeEditor, IOverlayWidget, IViewZoneChangeAccessor } from '../../../../../editor/browser/editorBrowser.js';
import { Event } from '../../../../../base/common/event.js';

export abstract class FixedZoneWidget extends Disposable {
	private static counter = 0;
	private readonly overlayWidgetId = `fixedZoneWidget-${FixedZoneWidget.counter++}`;
	private readonly viewZoneId: string;

	protected readonly widgetDomNode = h('div.fixed-zone-widget').root;
	private readonly overlayWidget: IOverlayWidget = {
		getId: () => this.overlayWidgetId,
		getDomNode: () => this.widgetDomNode,
		getPosition: () => null
	};

	constructor(
		private readonly editor: ICodeEditor,
		viewZoneAccessor: IViewZoneChangeAccessor,
		afterLineNumber: number,
		height: number,
		viewZoneIdsToCleanUp: string[],
	) {
		super();

		this.viewZoneId = viewZoneAccessor.addZone({
			domNode: document.createElement('div'),
			afterLineNumber: afterLineNumber,
			heightInPx: height,
			ordinal: 50000 + 1,
			onComputedHeight: (height) => {
				this.widgetDomNode.style.height = `${height}px`;
			},
			onDomNodeTop: (top) => {
				this.widgetDomNode.style.top = `${top}px`;
			}
		});
		viewZoneIdsToCleanUp.push(this.viewZoneId);

		this._register(Event.runAndSubscribe(this.editor.onDidLayoutChange, () => {
			this.widgetDomNode.style.left = this.editor.getLayoutInfo().contentLeft + 'px';
		}));

		this.editor.addOverlayWidget(this.overlayWidget);

		this._register({
			dispose: () => {
				this.editor.removeOverlayWidget(this.overlayWidget);
			},
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/view/lineAlignment.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/view/lineAlignment.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { compareBy } from '../../../../../base/common/arrays.js';
import { assertFn, checkAdjacentItems } from '../../../../../base/common/assert.js';
import { isDefined } from '../../../../../base/common/types.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { TextLength } from '../../../../../editor/common/core/text/textLength.js';
import { RangeMapping } from '../model/mapping.js';
import { ModifiedBaseRange } from '../model/modifiedBaseRange.js';
import { addLength, lengthBetweenPositions, lengthOfRange } from '../model/rangeUtils.js';

export type LineAlignment = [input1LineNumber: number | undefined, baseLineNumber: number, input2LineNumber: number | undefined];

export function getAlignments(m: ModifiedBaseRange): LineAlignment[] {
	const equalRanges1 = toEqualRangeMappings(m.input1Diffs.flatMap(d => d.rangeMappings), m.baseRange.toExclusiveRange(), m.input1Range.toExclusiveRange());
	const equalRanges2 = toEqualRangeMappings(m.input2Diffs.flatMap(d => d.rangeMappings), m.baseRange.toExclusiveRange(), m.input2Range.toExclusiveRange());

	const commonRanges = splitUpCommonEqualRangeMappings(equalRanges1, equalRanges2);

	let result: LineAlignment[] = [];
	result.push([m.input1Range.startLineNumber - 1, m.baseRange.startLineNumber - 1, m.input2Range.startLineNumber - 1]);

	function isFullSync(lineAlignment: LineAlignment) {
		return lineAlignment.every((i) => i !== undefined);
	}

	// One base line has either up to one full sync or up to two half syncs.
	for (const m of commonRanges) {
		const lineAlignment: LineAlignment = [m.output1Pos?.lineNumber, m.inputPos.lineNumber, m.output2Pos?.lineNumber];
		const alignmentIsFullSync = isFullSync(lineAlignment);

		let shouldAdd = true;
		if (alignmentIsFullSync) {
			const isNewFullSyncAlignment = !result.some(r => isFullSync(r) && r.some((v, idx) => v !== undefined && v === lineAlignment[idx]));
			if (isNewFullSyncAlignment) {
				// Remove half syncs
				result = result.filter(r => !r.some((v, idx) => v !== undefined && v === lineAlignment[idx]));
			}
			shouldAdd = isNewFullSyncAlignment;
		} else {
			const isNew = !result.some(r => r.some((v, idx) => v !== undefined && v === lineAlignment[idx]));
			shouldAdd = isNew;
		}

		if (shouldAdd) {
			result.push(lineAlignment);
		} else {
			if (m.length.isGreaterThan(new TextLength(1, 0))) {
				result.push([
					m.output1Pos ? m.output1Pos.lineNumber + 1 : undefined,
					m.inputPos.lineNumber + 1,
					m.output2Pos ? m.output2Pos.lineNumber + 1 : undefined
				]);
			}
		}
	}

	const finalLineAlignment: LineAlignment = [m.input1Range.endLineNumberExclusive, m.baseRange.endLineNumberExclusive, m.input2Range.endLineNumberExclusive];
	result = result.filter(r => r.every((v, idx) => v !== finalLineAlignment[idx]));
	result.push(finalLineAlignment);

	assertFn(() => checkAdjacentItems(result.map(r => r[0]).filter(isDefined), (a, b) => a < b)
		&& checkAdjacentItems(result.map(r => r[1]).filter(isDefined), (a, b) => a <= b)
		&& checkAdjacentItems(result.map(r => r[2]).filter(isDefined), (a, b) => a < b)
		&& result.every(alignment => alignment.filter(isDefined).length >= 2)
	);

	return result;
}
interface CommonRangeMapping {
	output1Pos: Position | undefined;
	output2Pos: Position | undefined;
	inputPos: Position;
	length: TextLength;
}

function toEqualRangeMappings(diffs: RangeMapping[], inputRange: Range, outputRange: Range): RangeMapping[] {
	const result: RangeMapping[] = [];

	let equalRangeInputStart = inputRange.getStartPosition();
	let equalRangeOutputStart = outputRange.getStartPosition();

	for (const d of diffs) {
		const equalRangeMapping = new RangeMapping(
			Range.fromPositions(equalRangeInputStart, d.inputRange.getStartPosition()),
			Range.fromPositions(equalRangeOutputStart, d.outputRange.getStartPosition())
		);
		assertFn(() => lengthOfRange(equalRangeMapping.inputRange).equals(
			lengthOfRange(equalRangeMapping.outputRange)
		)
		);
		if (!equalRangeMapping.inputRange.isEmpty()) {
			result.push(equalRangeMapping);
		}

		equalRangeInputStart = d.inputRange.getEndPosition();
		equalRangeOutputStart = d.outputRange.getEndPosition();
	}

	const equalRangeMapping = new RangeMapping(
		Range.fromPositions(equalRangeInputStart, inputRange.getEndPosition()),
		Range.fromPositions(equalRangeOutputStart, outputRange.getEndPosition())
	);
	assertFn(() => lengthOfRange(equalRangeMapping.inputRange).equals(
		lengthOfRange(equalRangeMapping.outputRange)
	)
	);
	if (!equalRangeMapping.inputRange.isEmpty()) {
		result.push(equalRangeMapping);
	}

	return result;
}

/**
 * It is `result[i][0].inputRange.equals(result[i][1].inputRange)`.
*/
function splitUpCommonEqualRangeMappings(
	equalRangeMappings1: RangeMapping[],
	equalRangeMappings2: RangeMapping[]
): CommonRangeMapping[] {
	const result: CommonRangeMapping[] = [];

	const events: { input: 0 | 1; start: boolean; inputPos: Position; outputPos: Position }[] = [];
	for (const [input, rangeMappings] of [[0, equalRangeMappings1], [1, equalRangeMappings2]] as const) {
		for (const rangeMapping of rangeMappings) {
			events.push({
				input: input,
				start: true,
				inputPos: rangeMapping.inputRange.getStartPosition(),
				outputPos: rangeMapping.outputRange.getStartPosition()
			});
			events.push({
				input: input,
				start: false,
				inputPos: rangeMapping.inputRange.getEndPosition(),
				outputPos: rangeMapping.outputRange.getEndPosition()
			});
		}
	}

	events.sort(compareBy((m) => m.inputPos, Position.compare));

	const starts: [Position | undefined, Position | undefined] = [undefined, undefined];
	let lastInputPos: Position | undefined;

	for (const event of events) {
		if (lastInputPos && starts.some(s => !!s)) {
			const length = lengthBetweenPositions(lastInputPos, event.inputPos);
			if (!length.isZero()) {
				result.push({
					inputPos: lastInputPos,
					length,
					output1Pos: starts[0],
					output2Pos: starts[1]
				});
				if (starts[0]) {
					starts[0] = addLength(starts[0], length);
				}
				if (starts[1]) {
					starts[1] = addLength(starts[1], length);
				}
			}
		}

		starts[event.input] = event.start ? event.outputPos : undefined;
		lastInputPos = event.inputPos;
	}

	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/view/mergeEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/view/mergeEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Dimension, reset } from '../../../../../base/browser/dom.js';
import { Grid, GridNodeDescriptor, IView, SerializableGrid } from '../../../../../base/browser/ui/grid/grid.js';
import { Orientation } from '../../../../../base/browser/ui/splitview/splitview.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Color } from '../../../../../base/common/color.js';
import { BugIndicatingError, onUnexpectedError } from '../../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable, thenIfNotDisposed, toDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun, autorunWithStore, IObservable, IReader, observableValue, transaction } from '../../../../../base/common/observable.js';
import { basename, isEqual } from '../../../../../base/common/resources.js';
import { isDefined } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import './media/mergeEditor.css';
import { ICodeEditor, IViewZoneChangeAccessor } from '../../../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { IEditorOptions as ICodeEditorOptions } from '../../../../../editor/common/config/editorOptions.js';
import { ICodeEditorViewState, ScrollType } from '../../../../../editor/common/editorCommon.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { ITextResourceConfigurationService } from '../../../../../editor/common/services/textResourceConfiguration.js';
import { localize } from '../../../../../nls.js';
import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IEditorOptions, ITextEditorOptions, ITextResourceEditorInput } from '../../../../../platform/editor/common/editor.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { AbstractTextEditor } from '../../../../browser/parts/editor/textEditor.js';
import { DEFAULT_EDITOR_ASSOCIATION, EditorInputWithOptions, IEditorOpenContext, IResourceMergeEditorInput } from '../../../../common/editor.js';
import { EditorInput } from '../../../../common/editor/editorInput.js';
import { applyTextEditorOptions } from '../../../../common/editor/editorOptions.js';
import { readTransientState, writeTransientState } from '../../../codeEditor/browser/toggleWordWrap.js';
import { MergeEditorInput } from '../mergeEditorInput.js';
import { IMergeEditorInputModel } from '../mergeEditorInputModel.js';
import { MergeEditorModel } from '../model/mergeEditorModel.js';
import { deepMerge, PersistentStore } from '../utils.js';
import { BaseCodeEditorView } from './editors/baseCodeEditorView.js';
import { ScrollSynchronizer } from './scrollSynchronizer.js';
import { MergeEditorViewModel } from './viewModel.js';
import { ViewZoneComputer } from './viewZones.js';
import { ctxIsMergeEditor, ctxMergeBaseUri, ctxMergeEditorLayout, ctxMergeEditorShowBase, ctxMergeEditorShowBaseAtTop, ctxMergeEditorShowNonConflictingChanges, ctxMergeResultUri, MergeEditorLayoutKind } from '../../common/mergeEditor.js';
import { settingsSashBorder } from '../../../preferences/common/settingsEditorColorRegistry.js';
import { IEditorGroup, IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { IEditorResolverService, MergeEditorInputFactoryFunction, RegisteredEditorPriority } from '../../../../services/editor/common/editorResolverService.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import './colors.js';
import { InputCodeEditorView } from './editors/inputCodeEditorView.js';
import { ResultCodeEditorView } from './editors/resultCodeEditorView.js';

export class MergeEditor extends AbstractTextEditor<IMergeEditorViewState> {

	static readonly ID = 'mergeEditor';

	private readonly _sessionDisposables;
	private readonly _viewModel;

	public get viewModel(): IObservable<MergeEditorViewModel | undefined> {
		return this._viewModel;
	}

	private rootHtmlElement: HTMLElement | undefined;
	private readonly _grid;
	private readonly input1View;
	private readonly baseView;
	private readonly baseViewOptions;
	private readonly input2View;

	private readonly inputResultView;
	private readonly _layoutMode;
	private readonly _layoutModeObs;
	private readonly _ctxIsMergeEditor: IContextKey<boolean>;
	private readonly _ctxUsesColumnLayout: IContextKey<string>;
	private readonly _ctxShowBase: IContextKey<boolean>;
	private readonly _ctxShowBaseAtTop;
	private readonly _ctxResultUri: IContextKey<string>;
	private readonly _ctxBaseUri: IContextKey<string>;
	private readonly _ctxShowNonConflictingChanges: IContextKey<boolean>;
	private readonly _inputModel;
	public get inputModel(): IObservable<IMergeEditorInputModel | undefined> {
		return this._inputModel;
	}
	public get model(): MergeEditorModel | undefined {
		return this.inputModel.get()?.model;
	}

	private readonly viewZoneComputer;

	private readonly scrollSynchronizer;

	constructor(
		group: IEditorGroup,
		@IInstantiationService instantiation: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IStorageService storageService: IStorageService,
		@IThemeService themeService: IThemeService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@IEditorService editorService: IEditorService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@IFileService fileService: IFileService,
		@ICodeEditorService private readonly _codeEditorService: ICodeEditorService
	) {
		super(MergeEditor.ID, group, telemetryService, instantiation, storageService, textResourceConfigurationService, themeService, editorService, editorGroupService, fileService);
		this._sessionDisposables = new DisposableStore();
		this._viewModel = observableValue<MergeEditorViewModel | undefined>(this, undefined);
		this._grid = this._register(new MutableDisposable<Grid<IView>>());
		this.input1View = this._register(this.instantiationService.createInstance(InputCodeEditorView, 1, this._viewModel));
		this.baseView = observableValue<BaseCodeEditorView | undefined>(this, undefined);
		this.baseViewOptions = observableValue<Readonly<ICodeEditorOptions> | undefined>(this, undefined);
		this.input2View = this._register(this.instantiationService.createInstance(InputCodeEditorView, 2, this._viewModel));
		this.inputResultView = this._register(this.instantiationService.createInstance(ResultCodeEditorView, this._viewModel));
		this._layoutMode = this.instantiationService.createInstance(MergeEditorLayoutStore);
		this._layoutModeObs = observableValue(this, this._layoutMode.value);
		this._ctxIsMergeEditor = ctxIsMergeEditor.bindTo(this.contextKeyService);
		this._ctxUsesColumnLayout = ctxMergeEditorLayout.bindTo(this.contextKeyService);
		this._ctxShowBase = ctxMergeEditorShowBase.bindTo(this.contextKeyService);
		this._ctxShowBaseAtTop = ctxMergeEditorShowBaseAtTop.bindTo(this.contextKeyService);
		this._ctxResultUri = ctxMergeResultUri.bindTo(this.contextKeyService);
		this._ctxBaseUri = ctxMergeBaseUri.bindTo(this.contextKeyService);
		this._ctxShowNonConflictingChanges = ctxMergeEditorShowNonConflictingChanges.bindTo(this.contextKeyService);
		this._inputModel = observableValue<IMergeEditorInputModel | undefined>(this, undefined);
		this.viewZoneComputer = new ViewZoneComputer(
			this.input1View.editor,
			this.input2View.editor,
			this.inputResultView.editor,
		);
		this.scrollSynchronizer = this._register(new ScrollSynchronizer(this._viewModel, this.input1View, this.input2View, this.baseView, this.inputResultView, this._layoutModeObs));
		this._onDidChangeSizeConstraints = new Emitter<void>();
		this.onDidChangeSizeConstraints = this._onDidChangeSizeConstraints.event;
		this.baseViewDisposables = this._register(new DisposableStore());
		this.showNonConflictingChangesStore = this.instantiationService.createInstance(PersistentStore<boolean>, 'mergeEditor/showNonConflictingChanges');
		this.showNonConflictingChanges = observableValue(this, this.showNonConflictingChangesStore.get() ?? false);
	}

	override dispose(): void {
		this._sessionDisposables.dispose();
		this._ctxIsMergeEditor.reset();
		this._ctxUsesColumnLayout.reset();
		this._ctxShowNonConflictingChanges.reset();
		super.dispose();
	}

	// #region layout constraints

	private readonly _onDidChangeSizeConstraints;
	override readonly onDidChangeSizeConstraints: Event<void>;

	override get minimumWidth() {
		return this._layoutMode.value.kind === 'mixed'
			? this.input1View.view.minimumWidth + this.input2View.view.minimumWidth
			: this.input1View.view.minimumWidth + this.input2View.view.minimumWidth + this.inputResultView.view.minimumWidth;
	}

	// #endregion

	override getTitle(): string {
		if (this.input) {
			return this.input.getName();
		}

		return localize('mergeEditor', "Text Merge Editor");
	}

	protected createEditorControl(parent: HTMLElement, initialOptions: ICodeEditorOptions): void {
		this.rootHtmlElement = parent;
		parent.classList.add('merge-editor');
		this.applyLayout(this._layoutMode.value);
		this.applyOptions(initialOptions);
	}

	protected updateEditorControlOptions(options: ICodeEditorOptions): void {
		this.applyOptions(options);
	}

	private applyOptions(options: ICodeEditorOptions): void {
		const inputOptions: ICodeEditorOptions = deepMerge<ICodeEditorOptions>(options, {
			minimap: { enabled: false },
			glyphMargin: false,
			lineNumbersMinChars: 2
		});

		const readOnlyInputOptions: ICodeEditorOptions = deepMerge<ICodeEditorOptions>(inputOptions, {
			readOnly: true,
			readOnlyMessage: undefined
		});

		this.input1View.updateOptions(readOnlyInputOptions);
		this.input2View.updateOptions(readOnlyInputOptions);
		this.baseViewOptions.set({ ...this.input2View.editor.getRawOptions() }, undefined);
		this.inputResultView.updateOptions(inputOptions);
	}

	protected getMainControl(): ICodeEditor | undefined {
		return this.inputResultView.editor;
	}

	layout(dimension: Dimension): void {
		this._grid.value?.layout(dimension.width, dimension.height);
	}

	override async setInput(input: EditorInput, options: IEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		if (!(input instanceof MergeEditorInput)) {
			throw new BugIndicatingError('ONLY MergeEditorInput is supported');
		}
		await super.setInput(input, options, context, token);

		this._sessionDisposables.clear();
		transaction(tx => {
			this._viewModel.set(undefined, tx);
			this._inputModel.set(undefined, tx);
		});

		const inputModel = await input.resolve();
		const model = inputModel.model;

		const viewModel = this.instantiationService.createInstance(
			MergeEditorViewModel,
			model,
			this.input1View,
			this.input2View,
			this.inputResultView,
			this.baseView,
			this.showNonConflictingChanges,
		);

		model.telemetry.reportMergeEditorOpened({
			combinableConflictCount: model.combinableConflictCount,
			conflictCount: model.conflictCount,

			baseTop: this._layoutModeObs.get().showBaseAtTop,
			baseVisible: this._layoutModeObs.get().showBase,
			isColumnView: this._layoutModeObs.get().kind === 'columns',
		});

		transaction(tx => {
			this._viewModel.set(viewModel, tx);
			this._inputModel.set(inputModel, tx);
		});
		this._sessionDisposables.add(viewModel);

		// Track focus changes to update the editor name
		this._sessionDisposables.add(autorun(reader => {
			/** @description Update focused editor name based on focus */
			const focusedType = viewModel.focusedEditorType.read(reader);

			if (!(input instanceof MergeEditorInput)) {
				return;
			}

			input.updateFocusedEditor(focusedType || 'result');
		}));

		// Set/unset context keys based on input
		this._ctxResultUri.set(inputModel.resultUri.toString());
		this._ctxBaseUri.set(model.base.uri.toString());
		this._sessionDisposables.add(toDisposable(() => {
			this._ctxBaseUri.reset();
			this._ctxResultUri.reset();
		}));

		const viewZoneRegistrationStore = new DisposableStore();
		this._sessionDisposables.add(viewZoneRegistrationStore);
		// Set the view zones before restoring view state!
		// Otherwise scrolling will be off
		this._sessionDisposables.add(autorunWithStore((reader) => {
			/** @description update alignment view zones */
			const baseView = this.baseView.read(reader);

			const resultScrollTop = this.inputResultView.editor.getScrollTop();
			this.scrollSynchronizer.stopSync();

			viewZoneRegistrationStore.clear();

			this.inputResultView.editor.changeViewZones(resultViewZoneAccessor => {
				const layout = this._layoutModeObs.read(reader);
				const shouldAlignResult = layout.kind === 'columns';
				const shouldAlignBase = layout.kind === 'mixed' && !layout.showBaseAtTop;

				this.input1View.editor.changeViewZones(input1ViewZoneAccessor => {
					this.input2View.editor.changeViewZones(input2ViewZoneAccessor => {
						if (baseView) {
							baseView.editor.changeViewZones(baseViewZoneAccessor => {
								viewZoneRegistrationStore.add(this.setViewZones(reader,
									viewModel,
									this.input1View.editor,
									input1ViewZoneAccessor,
									this.input2View.editor,
									input2ViewZoneAccessor,
									baseView.editor,
									baseViewZoneAccessor,
									shouldAlignBase,
									this.inputResultView.editor,
									resultViewZoneAccessor,
									shouldAlignResult
								));
							});
						} else {
							viewZoneRegistrationStore.add(this.setViewZones(reader,
								viewModel,
								this.input1View.editor,
								input1ViewZoneAccessor,
								this.input2View.editor,
								input2ViewZoneAccessor,
								undefined,
								undefined,
								false,
								this.inputResultView.editor,
								resultViewZoneAccessor,
								shouldAlignResult
							));
						}
					});
				});
			});

			this.inputResultView.editor.setScrollTop(resultScrollTop, ScrollType.Smooth);

			this.scrollSynchronizer.startSync();
			this.scrollSynchronizer.updateScrolling();
		}));

		const viewState = this.loadEditorViewState(input, context);
		if (viewState) {
			this._applyViewState(viewState);
		} else {
			this._sessionDisposables.add(thenIfNotDisposed(model.onInitialized, () => {
				const firstConflict = model.modifiedBaseRanges.get().find(r => r.isConflicting);
				if (!firstConflict) {
					return;
				}
				this.input1View.editor.revealLineInCenter(firstConflict.input1Range.startLineNumber);
				transaction(tx => {
					/** @description setActiveModifiedBaseRange */
					viewModel.setActiveModifiedBaseRange(firstConflict, tx);
				});
			}));
		}

		// word wrap special case - sync transient state from result model to input[1|2] models
		const mirrorWordWrapTransientState = (candidate: ITextModel) => {
			const candidateState = readTransientState(candidate, this._codeEditorService);

			writeTransientState(model.input2.textModel, candidateState, this._codeEditorService);
			writeTransientState(model.input1.textModel, candidateState, this._codeEditorService);
			writeTransientState(model.resultTextModel, candidateState, this._codeEditorService);

			const baseTextModel = this.baseView.get()?.editor.getModel();
			if (baseTextModel) {
				writeTransientState(baseTextModel, candidateState, this._codeEditorService);
			}
		};
		this._sessionDisposables.add(this._codeEditorService.onDidChangeTransientModelProperty(candidate => {
			mirrorWordWrapTransientState(candidate);
		}));
		mirrorWordWrapTransientState(this.inputResultView.editor.getModel()!);

		// detect when base, input1, and input2 become empty and replace THIS editor with its result editor
		// TODO@jrieken@hediet this needs a better/cleaner solution
		// https://github.com/microsoft/vscode/issues/155940
		const that = this;
		this._sessionDisposables.add(new class {

			private readonly _disposable = new DisposableStore();

			constructor() {
				for (const model of this.baseInput1Input2()) {
					this._disposable.add(model.onDidChangeContent(() => this._checkBaseInput1Input2AllEmpty()));
				}
			}

			dispose() {
				this._disposable.dispose();
			}

			private *baseInput1Input2() {
				yield model.base;
				yield model.input1.textModel;
				yield model.input2.textModel;
			}

			private _checkBaseInput1Input2AllEmpty() {
				for (const model of this.baseInput1Input2()) {
					if (model.getValueLength() > 0) {
						return;
					}
				}
				// all empty -> replace this editor with a normal editor for result
				that.editorService.replaceEditors(
					[{ editor: input, replacement: { resource: input.result, options: { preserveFocus: true } }, forceReplaceDirty: true }],
					that.group
				);
			}
		});
	}

	private setViewZones(
		reader: IReader,
		viewModel: MergeEditorViewModel,
		input1Editor: ICodeEditor,
		input1ViewZoneAccessor: IViewZoneChangeAccessor,
		input2Editor: ICodeEditor,
		input2ViewZoneAccessor: IViewZoneChangeAccessor,
		baseEditor: ICodeEditor | undefined,
		baseViewZoneAccessor: IViewZoneChangeAccessor | undefined,
		shouldAlignBase: boolean,
		resultEditor: ICodeEditor,
		resultViewZoneAccessor: IViewZoneChangeAccessor,
		shouldAlignResult: boolean,
	): IDisposable {
		const input1ViewZoneIds: string[] = [];
		const input2ViewZoneIds: string[] = [];
		const baseViewZoneIds: string[] = [];
		const resultViewZoneIds: string[] = [];

		const viewZones = this.viewZoneComputer.computeViewZones(reader, viewModel, {
			codeLensesVisible: true,
			showNonConflictingChanges: this.showNonConflictingChanges.read(reader),
			shouldAlignBase,
			shouldAlignResult,
		});

		const disposableStore = new DisposableStore();

		if (baseViewZoneAccessor) {
			for (const v of viewZones.baseViewZones) {
				v.create(baseViewZoneAccessor, baseViewZoneIds, disposableStore);
			}
		}

		for (const v of viewZones.resultViewZones) {
			v.create(resultViewZoneAccessor, resultViewZoneIds, disposableStore);
		}

		for (const v of viewZones.input1ViewZones) {
			v.create(input1ViewZoneAccessor, input1ViewZoneIds, disposableStore);
		}

		for (const v of viewZones.input2ViewZones) {
			v.create(input2ViewZoneAccessor, input2ViewZoneIds, disposableStore);
		}

		disposableStore.add({
			dispose: () => {
				input1Editor.changeViewZones(a => {
					for (const zone of input1ViewZoneIds) {
						a.removeZone(zone);
					}
				});
				input2Editor.changeViewZones(a => {
					for (const zone of input2ViewZoneIds) {
						a.removeZone(zone);
					}
				});
				baseEditor?.changeViewZones(a => {
					for (const zone of baseViewZoneIds) {
						a.removeZone(zone);
					}
				});
				resultEditor.changeViewZones(a => {
					for (const zone of resultViewZoneIds) {
						a.removeZone(zone);
					}
				});
			}
		});

		return disposableStore;
	}

	override setOptions(options: ITextEditorOptions | undefined): void {
		super.setOptions(options);

		if (options) {
			applyTextEditorOptions(options, this.inputResultView.editor, ScrollType.Smooth);
		}
	}

	override clearInput(): void {
		super.clearInput();

		this._sessionDisposables.clear();

		for (const { editor } of [this.input1View, this.input2View, this.inputResultView]) {
			editor.setModel(null);
		}
	}

	override focus(): void {
		super.focus();

		(this.getControl() ?? this.inputResultView.editor).focus();
	}

	override hasFocus(): boolean {
		for (const { editor } of [this.input1View, this.input2View, this.inputResultView]) {
			if (editor.hasTextFocus()) {
				return true;
			}
		}
		return super.hasFocus();
	}

	protected override setEditorVisible(visible: boolean): void {
		super.setEditorVisible(visible);

		for (const { editor } of [this.input1View, this.input2View, this.inputResultView]) {
			if (visible) {
				editor.onVisible();
			} else {
				editor.onHide();
			}
		}

		this._ctxIsMergeEditor.set(visible);
	}

	// ---- interact with "outside world" via`getControl`, `scopedContextKeyService`: we only expose the result-editor keep the others internal

	override getControl(): ICodeEditor | undefined {
		return this.inputResultView.editor;
	}

	override get scopedContextKeyService(): IContextKeyService | undefined {
		const control = this.getControl();
		return control?.invokeWithinContext(accessor => accessor.get(IContextKeyService));
	}

	// --- layout

	public toggleBase(): void {
		this.setLayout({
			...this._layoutMode.value,
			showBase: !this._layoutMode.value.showBase
		});
	}

	public toggleShowBaseTop(): void {
		const showBaseTop = this._layoutMode.value.showBase && this._layoutMode.value.showBaseAtTop;
		this.setLayout({
			...this._layoutMode.value,
			showBaseAtTop: true,
			showBase: !showBaseTop,
		});
	}

	public toggleShowBaseCenter(): void {
		const showBaseCenter = this._layoutMode.value.showBase && !this._layoutMode.value.showBaseAtTop;
		this.setLayout({
			...this._layoutMode.value,
			showBaseAtTop: false,
			showBase: !showBaseCenter,
		});
	}

	public setLayoutKind(kind: MergeEditorLayoutKind): void {
		this.setLayout({
			...this._layoutMode.value,
			kind
		});
	}

	public setLayout(newLayout: IMergeEditorLayout): void {
		const value = this._layoutMode.value;
		if (JSON.stringify(value) === JSON.stringify(newLayout)) {
			return;
		}
		this.model?.telemetry.reportLayoutChange({
			baseTop: newLayout.showBaseAtTop,
			baseVisible: newLayout.showBase,
			isColumnView: newLayout.kind === 'columns',
		});
		this.applyLayout(newLayout);
	}

	private readonly baseViewDisposables;

	private applyLayout(layout: IMergeEditorLayout): void {
		transaction(tx => {
			/** @description applyLayout */

			if (layout.showBase && !this.baseView.get()) {
				this.baseViewDisposables.clear();
				const baseView = this.baseViewDisposables.add(
					this.instantiationService.createInstance(
						BaseCodeEditorView,
						this.viewModel
					)
				);
				this.baseViewDisposables.add(autorun(reader => {
					/** @description Update base view options */
					const options = this.baseViewOptions.read(reader);
					if (options) {
						baseView.updateOptions(options);
					}
				}));
				this.baseView.set(baseView, tx);
			} else if (!layout.showBase && this.baseView.get()) {
				this.baseView.set(undefined, tx);
				this.baseViewDisposables.clear();
			}

			if (layout.kind === 'mixed') {
				this.setGrid([
					layout.showBaseAtTop && layout.showBase ? {
						size: 38,
						data: this.baseView.get()!.view
					} : undefined,
					{
						size: 38,
						groups: [
							{ data: this.input1View.view },
							!layout.showBaseAtTop && layout.showBase ? { data: this.baseView.get()!.view } : undefined,
							{ data: this.input2View.view }
						].filter(isDefined)
					},
					{
						size: 62,
						data: this.inputResultView.view
					},
				].filter(isDefined));
			} else if (layout.kind === 'columns') {
				this.setGrid([
					layout.showBase ? {
						size: 40,
						data: this.baseView.get()!.view
					} : undefined,
					{
						size: 60,
						groups: [{ data: this.input1View.view }, { data: this.inputResultView.view }, { data: this.input2View.view }]
					},
				].filter(isDefined));
			}

			this._layoutMode.value = layout;
			this._ctxUsesColumnLayout.set(layout.kind);
			this._ctxShowBase.set(layout.showBase);
			this._ctxShowBaseAtTop.set(layout.showBaseAtTop);
			this._onDidChangeSizeConstraints.fire();
			this._layoutModeObs.set(layout, tx);
		});
	}

	private setGrid(descriptor: GridNodeDescriptor<any>[]) {
		let width = -1;
		let height = -1;
		if (this._grid.value) {
			width = this._grid.value.width;
			height = this._grid.value.height;
		}
		this._grid.value = SerializableGrid.from<any>({
			orientation: Orientation.VERTICAL,
			size: 100,
			groups: descriptor,
		}, {
			styles: { separatorBorder: this.theme.getColor(settingsSashBorder) ?? Color.transparent },
			proportionalLayout: true
		});

		reset(this.rootHtmlElement!, this._grid.value.element);
		// Only call layout after the elements have been added to the DOM,
		// so that they have a defined size.
		if (width !== -1) {
			this._grid.value.layout(width, height);
		}
	}

	private _applyViewState(state: IMergeEditorViewState | undefined) {
		if (!state) {
			return;
		}
		this.inputResultView.editor.restoreViewState(state);
		if (state.input1State) {
			this.input1View.editor.restoreViewState(state.input1State);
		}
		if (state.input2State) {
			this.input2View.editor.restoreViewState(state.input2State);
		}
		if (state.focusIndex >= 0) {
			[this.input1View.editor, this.input2View.editor, this.inputResultView.editor][state.focusIndex].focus();
		}
	}

	protected computeEditorViewState(resource: URI): IMergeEditorViewState | undefined {
		if (!isEqual(this.inputModel.get()?.resultUri, resource)) {
			return undefined;
		}
		const result = this.inputResultView.editor.saveViewState();
		if (!result) {
			return undefined;
		}
		const input1State = this.input1View.editor.saveViewState() ?? undefined;
		const input2State = this.input2View.editor.saveViewState() ?? undefined;
		const focusIndex = [this.input1View.editor, this.input2View.editor, this.inputResultView.editor].findIndex(editor => editor.hasWidgetFocus());
		return { ...result, input1State, input2State, focusIndex };
	}


	protected tracksEditorViewState(input: EditorInput): boolean {
		return input instanceof MergeEditorInput;
	}

	private readonly showNonConflictingChangesStore;
	private readonly showNonConflictingChanges;

	public toggleShowNonConflictingChanges(): void {
		this.showNonConflictingChanges.set(!this.showNonConflictingChanges.get(), undefined);
		this.showNonConflictingChangesStore.set(this.showNonConflictingChanges.get());
		this._ctxShowNonConflictingChanges.set(this.showNonConflictingChanges.get());
	}
}

export interface IMergeEditorLayout {
	readonly kind: MergeEditorLayoutKind;
	readonly showBase: boolean;
	readonly showBaseAtTop: boolean;
}

// TODO use PersistentStore
class MergeEditorLayoutStore {
	private static readonly _key = 'mergeEditor/layout';
	private _value: IMergeEditorLayout = { kind: 'mixed', showBase: false, showBaseAtTop: true };

	constructor(@IStorageService private _storageService: IStorageService) {
		const value = _storageService.get(MergeEditorLayoutStore._key, StorageScope.PROFILE, 'mixed');

		if (value === 'mixed' || value === 'columns') {
			this._value = { kind: value, showBase: false, showBaseAtTop: true };
		} else if (value) {
			try {
				this._value = JSON.parse(value);
			} catch (e) {
				onUnexpectedError(e);
			}
		}
	}

	get value() {
		return this._value;
	}

	set value(value: IMergeEditorLayout) {
		if (this._value !== value) {
			this._value = value;
			this._storageService.store(MergeEditorLayoutStore._key, JSON.stringify(this._value), StorageScope.PROFILE, StorageTarget.USER);
		}
	}
}

export class MergeEditorOpenHandlerContribution extends Disposable {

	constructor(
		@IEditorService private readonly _editorService: IEditorService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
	) {
		super();
		this._store.add(codeEditorService.registerCodeEditorOpenHandler(this.openCodeEditorFromMergeEditor.bind(this)));
	}

	private async openCodeEditorFromMergeEditor(input: ITextResourceEditorInput, _source: ICodeEditor | null, sideBySide?: boolean | undefined): Promise<ICodeEditor | null> {
		const activePane = this._editorService.activeEditorPane;
		if (!sideBySide
			&& input.options
			&& activePane instanceof MergeEditor
			&& activePane.getControl()
			&& activePane.input instanceof MergeEditorInput
			&& isEqual(input.resource, activePane.input.result)
		) {
			// Special: stay inside the merge editor when it is active and when the input
			// targets the result editor of the merge editor.
			const targetEditor = <ICodeEditor>activePane.getControl()!;
			applyTextEditorOptions(input.options, targetEditor, ScrollType.Smooth);
			return targetEditor;
		}

		// cannot handle this
		return null;
	}
}

export class MergeEditorResolverContribution extends Disposable {

	static readonly ID = 'workbench.contrib.mergeEditorResolver';

	constructor(
		@IEditorResolverService editorResolverService: IEditorResolverService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();

		const mergeEditorInputFactory: MergeEditorInputFactoryFunction = (mergeEditor: IResourceMergeEditorInput): EditorInputWithOptions => {
			return {
				editor: instantiationService.createInstance(
					MergeEditorInput,
					mergeEditor.base.resource,
					{
						uri: mergeEditor.input1.resource,
						title: mergeEditor.input1.label ?? basename(mergeEditor.input1.resource),
						description: mergeEditor.input1.description ?? '',
						detail: mergeEditor.input1.detail
					},
					{
						uri: mergeEditor.input2.resource,
						title: mergeEditor.input2.label ?? basename(mergeEditor.input2.resource),
						description: mergeEditor.input2.description ?? '',
						detail: mergeEditor.input2.detail
					},
					mergeEditor.result.resource
				)
			};
		};

		this._register(editorResolverService.registerEditor(
			`*`,
			{
				id: DEFAULT_EDITOR_ASSOCIATION.id,
				label: DEFAULT_EDITOR_ASSOCIATION.displayName,
				detail: DEFAULT_EDITOR_ASSOCIATION.providerDisplayName,
				priority: RegisteredEditorPriority.builtin
			},
			{},
			{
				createMergeEditorInput: mergeEditorInputFactory
			}
		));
	}
}

type IMergeEditorViewState = ICodeEditorViewState & {
	readonly input1State?: ICodeEditorViewState;
	readonly input2State?: ICodeEditorViewState;
	readonly focusIndex: number;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/view/scrollSynchronizer.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/view/scrollSynchronizer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import { derived, IObservable } from '../../../../../base/common/observable.js';
import { CodeEditorWidget } from '../../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { ScrollType } from '../../../../../editor/common/editorCommon.js';
import { DocumentLineRangeMap } from '../model/mapping.js';
import { ReentrancyBarrier } from '../../../../../base/common/controlFlow.js';
import { BaseCodeEditorView } from './editors/baseCodeEditorView.js';
import { IMergeEditorLayout } from './mergeEditor.js';
import { MergeEditorViewModel } from './viewModel.js';
import { InputCodeEditorView } from './editors/inputCodeEditorView.js';
import { ResultCodeEditorView } from './editors/resultCodeEditorView.js';
import { CodeEditorView } from './editors/codeEditorView.js';
import { BugIndicatingError } from '../../../../../base/common/errors.js';
import { isDefined } from '../../../../../base/common/types.js';

export class ScrollSynchronizer extends Disposable {
	private get model() { return this.viewModel.get()?.model; }

	private readonly reentrancyBarrier = new ReentrancyBarrier();

	public readonly updateScrolling: () => void;

	private get lockResultWithInputs() { return this.layout.get().kind === 'columns'; }
	private get lockBaseWithInputs() { return this.layout.get().kind === 'mixed' && !this.layout.get().showBaseAtTop; }

	private _isSyncing = true;

	constructor(
		private readonly viewModel: IObservable<MergeEditorViewModel | undefined>,
		private readonly input1View: InputCodeEditorView,
		private readonly input2View: InputCodeEditorView,
		private readonly baseView: IObservable<BaseCodeEditorView | undefined>,
		private readonly inputResultView: ResultCodeEditorView,
		private readonly layout: IObservable<IMergeEditorLayout>,
	) {
		super();

		const s = derived((reader) => {
			const baseView = this.baseView.read(reader);
			const editors = [this.input1View, this.input2View, this.inputResultView, baseView].filter(isDefined);

			const alignScrolling = (source: CodeEditorView, updateScrollLeft: boolean, updateScrollTop: boolean) => {
				this.reentrancyBarrier.runExclusivelyOrSkip(() => {
					if (updateScrollLeft) {
						const scrollLeft = source.editor.getScrollLeft();
						for (const editorView of editors) {
							if (editorView !== source) {
								editorView.editor.setScrollLeft(scrollLeft, ScrollType.Immediate);
							}
						}
					}
					if (updateScrollTop) {
						const scrollTop = source.editor.getScrollTop();
						for (const editorView of editors) {
							if (editorView !== source) {
								if (this._shouldLock(source, editorView)) {
									editorView.editor.setScrollTop(scrollTop, ScrollType.Immediate);
								} else {
									const m = this._getMapping(source, editorView);
									if (m) {
										this._synchronizeScrolling(source.editor, editorView.editor, m);
									}
								}
							}
						}
					}
				});
			};

			for (const editorView of editors) {
				reader.store.add(editorView.editor.onDidScrollChange(e => {
					if (!this._isSyncing) {
						return;
					}
					alignScrolling(editorView, e.scrollLeftChanged, e.scrollTopChanged);
				}));
			}

			return {
				update: () => {
					alignScrolling(this.inputResultView, true, true);
				}
			};
		}).recomputeInitiallyAndOnChange(this._store);

		this.updateScrolling = () => {
			s.get().update();
		};
	}

	public stopSync(): void {
		this._isSyncing = false;
	}

	public startSync(): void {
		this._isSyncing = true;
	}

	private _shouldLock(editor1: CodeEditorView, editor2: CodeEditorView): boolean {
		const isInput = (editor: CodeEditorView) => editor === this.input1View || editor === this.input2View;
		if (isInput(editor1) && editor2 === this.inputResultView || isInput(editor2) && editor1 === this.inputResultView) {
			return this.lockResultWithInputs;
		}
		if (isInput(editor1) && editor2 === this.baseView.get() || isInput(editor2) && editor1 === this.baseView.get()) {
			return this.lockBaseWithInputs;
		}
		if (isInput(editor1) && isInput(editor2)) {
			return true;
		}
		return false;
	}

	private _getMapping(editor1: CodeEditorView, editor2: CodeEditorView): DocumentLineRangeMap | undefined {
		if (editor1 === this.input1View) {
			if (editor2 === this.input2View) {
				return undefined;
			} else if (editor2 === this.inputResultView) {
				return this.model?.input1ResultMapping.get()!;
			} else if (editor2 === this.baseView.get()) {
				const b = this.model?.baseInput1Diffs.get();
				if (!b) { return undefined; }
				return new DocumentLineRangeMap(b, -1).reverse();
			}
		} else if (editor1 === this.input2View) {
			if (editor2 === this.input1View) {
				return undefined;
			} else if (editor2 === this.inputResultView) {
				return this.model?.input2ResultMapping.get()!;
			} else if (editor2 === this.baseView.get()) {
				const b = this.model?.baseInput2Diffs.get();
				if (!b) { return undefined; }
				return new DocumentLineRangeMap(b, -1).reverse();
			}
		} else if (editor1 === this.inputResultView) {
			if (editor2 === this.input1View) {
				return this.model?.resultInput1Mapping.get()!;
			} else if (editor2 === this.input2View) {
				return this.model?.resultInput2Mapping.get()!;
			} else if (editor2 === this.baseView.get()) {
				const b = this.model?.resultBaseMapping.get();
				if (!b) { return undefined; }
				return b;
			}
		} else if (editor1 === this.baseView.get()) {
			if (editor2 === this.input1View) {
				const b = this.model?.baseInput1Diffs.get();
				if (!b) { return undefined; }
				return new DocumentLineRangeMap(b, -1);
			} else if (editor2 === this.input2View) {
				const b = this.model?.baseInput2Diffs.get();
				if (!b) { return undefined; }
				return new DocumentLineRangeMap(b, -1);
			} else if (editor2 === this.inputResultView) {
				const b = this.model?.baseResultMapping.get();
				if (!b) { return undefined; }
				return b;
			}
		}

		throw new BugIndicatingError();
	}

	private _synchronizeScrolling(scrollingEditor: CodeEditorWidget, targetEditor: CodeEditorWidget, mapping: DocumentLineRangeMap | undefined) {
		if (!mapping) {
			return;
		}

		const visibleRanges = scrollingEditor.getVisibleRanges();
		if (visibleRanges.length === 0) {
			return;
		}
		const topLineNumber = visibleRanges[0].startLineNumber - 1;

		const result = mapping.project(topLineNumber);
		const sourceRange = result.inputRange;
		const targetRange = result.outputRange;

		const resultStartTopPx = targetEditor.getTopForLineNumber(targetRange.startLineNumber);
		const resultEndPx = targetEditor.getTopForLineNumber(targetRange.endLineNumberExclusive);

		const sourceStartTopPx = scrollingEditor.getTopForLineNumber(sourceRange.startLineNumber);
		const sourceEndPx = scrollingEditor.getTopForLineNumber(sourceRange.endLineNumberExclusive);

		const factor = Math.min((scrollingEditor.getScrollTop() - sourceStartTopPx) / (sourceEndPx - sourceStartTopPx), 1);
		const resultScrollPosition = resultStartTopPx + (resultEndPx - resultStartTopPx) * factor;

		targetEditor.setScrollTop(resultScrollPosition, ScrollType.Immediate);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/view/viewModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/view/viewModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { findLast } from '../../../../../base/common/arraysFind.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { derived, derivedObservableWithWritableCache, IObservable, IReader, ITransaction, observableValue, transaction } from '../../../../../base/common/observable.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { ScrollType } from '../../../../../editor/common/editorCommon.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { MergeEditorLineRange } from '../model/lineRange.js';
import { MergeEditorModel } from '../model/mergeEditorModel.js';
import { InputNumber, ModifiedBaseRange, ModifiedBaseRangeState } from '../model/modifiedBaseRange.js';
import { observableConfigValue } from '../../../../../platform/observable/common/platformObservableUtils.js';
import { BaseCodeEditorView } from './editors/baseCodeEditorView.js';
import { CodeEditorView } from './editors/codeEditorView.js';
import { InputCodeEditorView } from './editors/inputCodeEditorView.js';
import { ResultCodeEditorView } from './editors/resultCodeEditorView.js';

export class MergeEditorViewModel extends Disposable {
	private readonly manuallySetActiveModifiedBaseRange;

	private readonly attachedHistory;

	constructor(
		public readonly model: MergeEditorModel,
		public readonly inputCodeEditorView1: InputCodeEditorView,
		public readonly inputCodeEditorView2: InputCodeEditorView,
		public readonly resultCodeEditorView: ResultCodeEditorView,
		public readonly baseCodeEditorView: IObservable<BaseCodeEditorView | undefined>,
		public readonly showNonConflictingChanges: IObservable<boolean>,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@INotificationService private readonly notificationService: INotificationService,
	) {
		super();
		this.manuallySetActiveModifiedBaseRange = observableValue<
			{ range: ModifiedBaseRange | undefined; counter: number }
		>(this, { range: undefined, counter: 0 });
		this.attachedHistory = this._register(new AttachedHistory(this.model.resultTextModel));
		this.shouldUseAppendInsteadOfAccept = observableConfigValue<boolean>(
			'mergeEditor.shouldUseAppendInsteadOfAccept',
			false,
			this.configurationService,
		);
		this.counter = 0;
		this.lastFocusedEditor = derivedObservableWithWritableCache<
			{ view: CodeEditorView | undefined; counter: number }
		>(this, (reader, lastValue) => {
			const editors = [
				this.inputCodeEditorView1,
				this.inputCodeEditorView2,
				this.resultCodeEditorView,
				this.baseCodeEditorView.read(reader),
			];
			const view = editors.find((e) => e && e.isFocused.read(reader));
			return view ? { view, counter: this.counter++ } : lastValue || { view: undefined, counter: this.counter++ };
		});
		this.baseShowDiffAgainst = derived<1 | 2 | undefined>(this, reader => {
			const lastFocusedEditor = this.lastFocusedEditor.read(reader);
			if (lastFocusedEditor.view === this.inputCodeEditorView1) {
				return 1;
			} else if (lastFocusedEditor.view === this.inputCodeEditorView2) {
				return 2;
			}
			return undefined;
		});
		this.focusedEditorType = derived<MergeEditorType | undefined>(this, reader => {
			const lastFocusedEditor = this.lastFocusedEditor.read(reader);

			if (!lastFocusedEditor.view) {
				return undefined;
			}

			if (lastFocusedEditor.view === this.inputCodeEditorView1) {
				return 'input1';
			} else if (lastFocusedEditor.view === this.inputCodeEditorView2) {
				return 'input2';
			} else if (lastFocusedEditor.view === this.resultCodeEditorView) {
				return 'result';
			} else if (lastFocusedEditor.view === this.baseCodeEditorView.read(reader)) {
				return 'base';
			}

			return undefined;
		});
		this.selectionInBase = derived(this, reader => {
			const sourceEditor = this.lastFocusedEditor.read(reader).view;
			if (!sourceEditor) {
				return undefined;
			}
			const selections = sourceEditor.selection.read(reader) || [];

			const rangesInBase = selections.map((selection) => {
				if (sourceEditor === this.inputCodeEditorView1) {
					return this.model.translateInputRangeToBase(1, selection);
				} else if (sourceEditor === this.inputCodeEditorView2) {
					return this.model.translateInputRangeToBase(2, selection);
				} else if (sourceEditor === this.resultCodeEditorView) {
					return this.model.translateResultRangeToBase(selection);
				} else if (sourceEditor === this.baseCodeEditorView.read(reader)) {
					return selection;
				} else {
					return selection;
				}
			});

			return {
				rangesInBase,
				sourceEditor
			};
		});
		this.activeModifiedBaseRange = derived(this,
			(reader) => {
				/** @description activeModifiedBaseRange */
				const focusedEditor = this.lastFocusedEditor.read(reader);
				const manualRange = this.manuallySetActiveModifiedBaseRange.read(reader);
				if (manualRange.counter > focusedEditor.counter) {
					return manualRange.range;
				}

				if (!focusedEditor.view) {
					return;
				}
				const cursorLineNumber = focusedEditor.view.cursorLineNumber.read(reader);
				if (!cursorLineNumber) {
					return undefined;
				}

				const modifiedBaseRanges = this.model.modifiedBaseRanges.read(reader);
				return modifiedBaseRanges.find((r) => {
					const range = this.getRangeOfModifiedBaseRange(focusedEditor.view!, r, reader);
					return range.isEmpty
						? range.startLineNumber === cursorLineNumber
						: range.contains(cursorLineNumber);
				});
			}
		);

		this._register(resultCodeEditorView.editor.onDidChangeModelContent(e => {
			if (this.model.isApplyingEditInResult || e.isRedoing || e.isUndoing) {
				return;
			}

			const baseRangeStates: ModifiedBaseRange[] = [];

			for (const change of e.changes) {
				const rangeInBase = this.model.translateResultRangeToBase(Range.lift(change.range));
				const baseRanges = this.model.findModifiedBaseRangesInRange(MergeEditorLineRange.fromLength(rangeInBase.startLineNumber, rangeInBase.endLineNumber - rangeInBase.startLineNumber));
				if (baseRanges.length === 1) {
					const isHandled = this.model.isHandled(baseRanges[0]).get();
					if (!isHandled) {
						baseRangeStates.push(baseRanges[0]);
					}
				}
			}

			if (baseRangeStates.length === 0) {
				return;
			}

			const element = {
				model: this.model,
				redo() {
					transaction(tx => {
						/** @description Mark conflicts touched by manual edits as handled */
						for (const r of baseRangeStates) {
							this.model.setHandled(r, true, tx);
						}
					});
				},
				undo() {
					transaction(tx => {
						/** @description Mark conflicts touched by manual edits as handled */
						for (const r of baseRangeStates) {
							this.model.setHandled(r, false, tx);
						}
					});
				},
			};
			this.attachedHistory.pushAttachedHistoryElement(element);
			element.redo();
		}));
	}

	public readonly shouldUseAppendInsteadOfAccept;

	private counter;
	private readonly lastFocusedEditor;

	public readonly baseShowDiffAgainst;

	/**
	 * Returns an observable that tracks which editor type is currently focused
	 */
	public readonly focusedEditorType;

	public readonly selectionInBase;

	private getRangeOfModifiedBaseRange(editor: CodeEditorView, modifiedBaseRange: ModifiedBaseRange, reader: IReader | undefined): MergeEditorLineRange {
		if (editor === this.resultCodeEditorView) {
			return this.model.getLineRangeInResult(modifiedBaseRange.baseRange, reader);
		} else if (editor === this.baseCodeEditorView.get()) {
			return modifiedBaseRange.baseRange;
		} else {
			const input = editor === this.inputCodeEditorView1 ? 1 : 2;
			return modifiedBaseRange.getInputRange(input);
		}
	}

	public readonly activeModifiedBaseRange;

	public setActiveModifiedBaseRange(range: ModifiedBaseRange | undefined, tx: ITransaction): void {
		this.manuallySetActiveModifiedBaseRange.set({ range, counter: this.counter++ }, tx);
	}

	public setState(
		baseRange: ModifiedBaseRange,
		state: ModifiedBaseRangeState,
		tx: ITransaction,
		inputNumber: InputNumber,
	): void {
		this.manuallySetActiveModifiedBaseRange.set({ range: baseRange, counter: this.counter++ }, tx);
		this.model.setState(baseRange, state, inputNumber, tx);
		this.lastFocusedEditor.clearCache(tx);
	}

	private goToConflict(getModifiedBaseRange: (editor: CodeEditorView, curLineNumber: number) => ModifiedBaseRange | undefined): void {
		let editor = this.lastFocusedEditor.get().view;
		if (!editor) {
			editor = this.resultCodeEditorView;
		}
		const curLineNumber = editor.editor.getPosition()?.lineNumber;
		if (curLineNumber === undefined) {
			return;
		}
		const modifiedBaseRange = getModifiedBaseRange(editor, curLineNumber);
		if (modifiedBaseRange) {
			const range = this.getRangeOfModifiedBaseRange(editor, modifiedBaseRange, undefined);
			editor.editor.focus();

			let startLineNumber = range.startLineNumber;
			let endLineNumberExclusive = range.endLineNumberExclusive;
			if (range.startLineNumber > editor.editor.getModel()!.getLineCount()) {
				transaction(tx => {
					this.setActiveModifiedBaseRange(modifiedBaseRange, tx);
				});
				startLineNumber = endLineNumberExclusive = editor.editor.getModel()!.getLineCount();
			}

			editor.editor.setPosition({
				lineNumber: startLineNumber,
				column: editor.editor.getModel()!.getLineFirstNonWhitespaceColumn(startLineNumber),
			});
			editor.editor.revealLinesNearTop(startLineNumber, endLineNumberExclusive, ScrollType.Smooth);
		}
	}

	public goToNextModifiedBaseRange(predicate: (m: ModifiedBaseRange) => boolean): void {
		this.goToConflict(
			(e, l) =>
				this.model.modifiedBaseRanges
					.get()
					.find(
						(r) =>
							predicate(r) &&
							this.getRangeOfModifiedBaseRange(e, r, undefined).startLineNumber > l
					) ||
				this.model.modifiedBaseRanges
					.get()
					.find((r) => predicate(r))
		);
	}

	public goToPreviousModifiedBaseRange(predicate: (m: ModifiedBaseRange) => boolean): void {
		this.goToConflict(
			(e, l) =>
				findLast(
					this.model.modifiedBaseRanges.get(),
					(r) =>
						predicate(r) &&
						this.getRangeOfModifiedBaseRange(e, r, undefined).endLineNumberExclusive < l
				) ||
				findLast(
					this.model.modifiedBaseRanges.get(),
					(r) => predicate(r)
				)
		);
	}

	public toggleActiveConflict(inputNumber: 1 | 2): void {
		const activeModifiedBaseRange = this.activeModifiedBaseRange.get();
		if (!activeModifiedBaseRange) {
			this.notificationService.error(localize('noConflictMessage', "There is currently no conflict focused that can be toggled."));
			return;
		}
		transaction(tx => {
			/** @description Toggle Active Conflict */
			this.setState(
				activeModifiedBaseRange,
				this.model.getState(activeModifiedBaseRange).get().toggle(inputNumber),
				tx,
				inputNumber,
			);
		});
	}

	public acceptAll(inputNumber: 1 | 2): void {
		transaction(tx => {
			/** @description Toggle Active Conflict */
			for (const range of this.model.modifiedBaseRanges.get()) {
				this.setState(
					range,
					this.model.getState(range).get().withInputValue(inputNumber, true),
					tx,
					inputNumber
				);
			}
		});
	}
}

class AttachedHistory extends Disposable {
	private readonly attachedHistory: { element: IAttachedHistoryElement; altId: number }[];
	private previousAltId: number;

	constructor(private readonly model: ITextModel) {
		super();
		this.attachedHistory = [];
		this.previousAltId = this.model.getAlternativeVersionId();

		this._register(model.onDidChangeContent((e) => {
			const currentAltId = model.getAlternativeVersionId();

			if (e.isRedoing) {
				for (const item of this.attachedHistory) {
					if (this.previousAltId < item.altId && item.altId <= currentAltId) {
						item.element.redo();
					}
				}
			} else if (e.isUndoing) {
				for (let i = this.attachedHistory.length - 1; i >= 0; i--) {
					const item = this.attachedHistory[i];
					if (currentAltId < item.altId && item.altId <= this.previousAltId) {
						item.element.undo();
					}
				}

			} else {
				// The user destroyed the redo stack by performing a non redo/undo operation.
				// Thus we also need to remove all history elements after the last version id.
				while (
					this.attachedHistory.length > 0
					&& this.attachedHistory[this.attachedHistory.length - 1]!.altId > this.previousAltId
				) {
					this.attachedHistory.pop();
				}
			}

			this.previousAltId = currentAltId;
		}));
	}

	/**
	 * Pushes an history item that is tied to the last text edit (or an extension of it).
	 * When the last text edit is undone/redone, so is is this history item.
	 */
	public pushAttachedHistoryElement(element: IAttachedHistoryElement): void {
		this.attachedHistory.push({ altId: this.model.getAlternativeVersionId(), element });
	}
}

interface IAttachedHistoryElement {
	undo(): void;
	redo(): void;
}

export type MergeEditorType = 'input1' | 'input2' | 'result' | 'base';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/view/viewZones.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/view/viewZones.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $ } from '../../../../../base/browser/dom.js';
import { CompareResult } from '../../../../../base/common/arrays.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { IObservable, IReader } from '../../../../../base/common/observable.js';
import { ICodeEditor, IViewZoneChangeAccessor } from '../../../../../editor/browser/editorBrowser.js';
import { MergeEditorLineRange } from '../model/lineRange.js';
import { DetailedLineRangeMapping } from '../model/mapping.js';
import { ModifiedBaseRange } from '../model/modifiedBaseRange.js';
import { join } from '../utils.js';
import { ActionsSource, ConflictActionsFactory, IContentWidgetAction } from './conflictActions.js';
import { getAlignments } from './lineAlignment.js';
import { MergeEditorViewModel } from './viewModel.js';

export class ViewZoneComputer {
	private readonly conflictActionsFactoryInput1;
	private readonly conflictActionsFactoryInput2;
	private readonly conflictActionsFactoryResult;

	constructor(
		private readonly input1Editor: ICodeEditor,
		private readonly input2Editor: ICodeEditor,
		private readonly resultEditor: ICodeEditor,
	) {
		this.conflictActionsFactoryInput1 = new ConflictActionsFactory(this.input1Editor);
		this.conflictActionsFactoryInput2 = new ConflictActionsFactory(this.input2Editor);
		this.conflictActionsFactoryResult = new ConflictActionsFactory(this.resultEditor);
	}

	public computeViewZones(
		reader: IReader,
		viewModel: MergeEditorViewModel,
		options: {
			shouldAlignResult: boolean;
			shouldAlignBase: boolean;
			codeLensesVisible: boolean;
			showNonConflictingChanges: boolean;
		}
	): MergeEditorViewZones {
		let input1LinesAdded = 0;
		let input2LinesAdded = 0;
		let baseLinesAdded = 0;
		let resultLinesAdded = 0;

		const input1ViewZones: MergeEditorViewZone[] = [];
		const input2ViewZones: MergeEditorViewZone[] = [];
		const baseViewZones: MergeEditorViewZone[] = [];
		const resultViewZones: MergeEditorViewZone[] = [];

		const model = viewModel.model;

		const resultDiffs = model.baseResultDiffs.read(reader);
		const baseRangeWithStoreAndTouchingDiffs = join(
			model.modifiedBaseRanges.read(reader),
			resultDiffs,
			(baseRange, diff) =>
				baseRange.baseRange.intersectsOrTouches(diff.inputRange)
					? CompareResult.neitherLessOrGreaterThan
					: MergeEditorLineRange.compareByStart(
						baseRange.baseRange,
						diff.inputRange
					)
		);

		const shouldShowCodeLenses = options.codeLensesVisible;
		const showNonConflictingChanges = options.showNonConflictingChanges;

		let lastModifiedBaseRange: ModifiedBaseRange | undefined = undefined;
		let lastBaseResultDiff: DetailedLineRangeMapping | undefined = undefined;
		for (const m of baseRangeWithStoreAndTouchingDiffs) {
			if (shouldShowCodeLenses && m.left && (m.left.isConflicting || showNonConflictingChanges || !model.isHandled(m.left).read(reader))) {
				const actions = new ActionsSource(viewModel, m.left);
				if (options.shouldAlignResult || !actions.inputIsEmpty.read(reader)) {
					input1ViewZones.push(new CommandViewZone(this.conflictActionsFactoryInput1, m.left.input1Range.startLineNumber - 1, actions.itemsInput1));
					input2ViewZones.push(new CommandViewZone(this.conflictActionsFactoryInput2, m.left.input2Range.startLineNumber - 1, actions.itemsInput2));
					if (options.shouldAlignBase) {
						baseViewZones.push(new Placeholder(m.left.baseRange.startLineNumber - 1, 16));
					}
				}
				const afterLineNumber = m.left.baseRange.startLineNumber + (lastBaseResultDiff?.resultingDeltaFromOriginalToModified ?? 0) - 1;
				resultViewZones.push(new CommandViewZone(this.conflictActionsFactoryResult, afterLineNumber, actions.resultItems));

			}

			const lastResultDiff = m.rights.at(-1)!;
			if (lastResultDiff) {
				lastBaseResultDiff = lastResultDiff;
			}
			let alignedLines: LineAlignment[];
			if (m.left) {
				alignedLines = getAlignments(m.left).map(a => ({
					input1Line: a[0],
					baseLine: a[1],
					input2Line: a[2],
					resultLine: undefined,
				}));

				lastModifiedBaseRange = m.left;
				// This is a total hack.
				alignedLines[alignedLines.length - 1].resultLine =
					m.left.baseRange.endLineNumberExclusive
					+ (lastBaseResultDiff ? lastBaseResultDiff.resultingDeltaFromOriginalToModified : 0);

			} else {
				alignedLines = [{
					baseLine: lastResultDiff.inputRange.endLineNumberExclusive,
					input1Line: lastResultDiff.inputRange.endLineNumberExclusive + (lastModifiedBaseRange ? (lastModifiedBaseRange.input1Range.endLineNumberExclusive - lastModifiedBaseRange.baseRange.endLineNumberExclusive) : 0),
					input2Line: lastResultDiff.inputRange.endLineNumberExclusive + (lastModifiedBaseRange ? (lastModifiedBaseRange.input2Range.endLineNumberExclusive - lastModifiedBaseRange.baseRange.endLineNumberExclusive) : 0),
					resultLine: lastResultDiff.outputRange.endLineNumberExclusive,
				}];
			}

			for (const { input1Line, baseLine, input2Line, resultLine } of alignedLines) {
				if (!options.shouldAlignBase && (input1Line === undefined || input2Line === undefined)) {
					continue;
				}

				const input1Line_ =
					input1Line !== undefined ? input1Line + input1LinesAdded : -1;
				const input2Line_ =
					input2Line !== undefined ? input2Line + input2LinesAdded : -1;
				const baseLine_ = baseLine + baseLinesAdded;
				const resultLine_ = resultLine !== undefined ? resultLine + resultLinesAdded : -1;

				const max = Math.max(options.shouldAlignBase ? baseLine_ : 0, input1Line_, input2Line_, options.shouldAlignResult ? resultLine_ : 0);

				if (input1Line !== undefined) {
					const diffInput1 = max - input1Line_;
					if (diffInput1 > 0) {
						input1ViewZones.push(new Spacer(input1Line - 1, diffInput1));
						input1LinesAdded += diffInput1;
					}
				}

				if (input2Line !== undefined) {
					const diffInput2 = max - input2Line_;
					if (diffInput2 > 0) {
						input2ViewZones.push(new Spacer(input2Line - 1, diffInput2));
						input2LinesAdded += diffInput2;
					}
				}

				if (options.shouldAlignBase) {
					const diffBase = max - baseLine_;
					if (diffBase > 0) {
						baseViewZones.push(new Spacer(baseLine - 1, diffBase));
						baseLinesAdded += diffBase;
					}
				}

				if (options.shouldAlignResult && resultLine !== undefined) {
					const diffResult = max - resultLine_;
					if (diffResult > 0) {
						resultViewZones.push(new Spacer(resultLine - 1, diffResult));
						resultLinesAdded += diffResult;
					}
				}
			}
		}

		return new MergeEditorViewZones(input1ViewZones, input2ViewZones, baseViewZones, resultViewZones);
	}
}

interface LineAlignment {
	baseLine: number;
	input1Line?: number;
	input2Line?: number;
	resultLine?: number;
}

export class MergeEditorViewZones {
	constructor(
		public readonly input1ViewZones: readonly MergeEditorViewZone[],
		public readonly input2ViewZones: readonly MergeEditorViewZone[],
		public readonly baseViewZones: readonly MergeEditorViewZone[],
		public readonly resultViewZones: readonly MergeEditorViewZone[],
	) { }
}

/**
 * This is an abstract class to create various editor view zones.
*/
export abstract class MergeEditorViewZone {
	abstract create(viewZoneChangeAccessor: IViewZoneChangeAccessor, viewZoneIdsToCleanUp: string[], disposableStore: DisposableStore): void;
}

class Spacer extends MergeEditorViewZone {
	constructor(
		private readonly afterLineNumber: number,
		private readonly heightInLines: number
	) {
		super();
	}

	override create(
		viewZoneChangeAccessor: IViewZoneChangeAccessor,
		viewZoneIdsToCleanUp: string[],
		disposableStore: DisposableStore
	): void {
		viewZoneIdsToCleanUp.push(
			viewZoneChangeAccessor.addZone({
				afterLineNumber: this.afterLineNumber,
				heightInLines: this.heightInLines,
				domNode: $('div.diagonal-fill'),
			})
		);
	}
}

class Placeholder extends MergeEditorViewZone {
	constructor(
		private readonly afterLineNumber: number,
		private readonly heightPx: number
	) {
		super();
	}

	override create(
		viewZoneChangeAccessor: IViewZoneChangeAccessor,
		viewZoneIdsToCleanUp: string[],
		disposableStore: DisposableStore
	): void {
		viewZoneIdsToCleanUp.push(
			viewZoneChangeAccessor.addZone({
				afterLineNumber: this.afterLineNumber,
				heightInPx: this.heightPx,
				domNode: $('div.conflict-actions-placeholder'),
			})
		);
	}
}

class CommandViewZone extends MergeEditorViewZone {
	constructor(
		private readonly conflictActionsFactory: ConflictActionsFactory,
		private readonly lineNumber: number,
		private readonly items: IObservable<IContentWidgetAction[]>,
	) {
		super();
	}

	override create(viewZoneChangeAccessor: IViewZoneChangeAccessor, viewZoneIdsToCleanUp: string[], disposableStore: DisposableStore): void {
		disposableStore.add(
			this.conflictActionsFactory.createWidget(
				viewZoneChangeAccessor,
				this.lineNumber,
				this.items,
				viewZoneIdsToCleanUp,
			)
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/view/editors/baseCodeEditorView.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/view/editors/baseCodeEditorView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { h, reset } from '../../../../../../base/browser/dom.js';
import { renderLabelWithIcons } from '../../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { BugIndicatingError } from '../../../../../../base/common/errors.js';
import { IObservable, autorun, autorunWithStore, derived } from '../../../../../../base/common/observable.js';
import { IModelDeltaDecoration, MinimapPosition, OverviewRulerLane } from '../../../../../../editor/common/model.js';
import { localize } from '../../../../../../nls.js';
import { MenuId } from '../../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { applyObservableDecorations } from '../../utils.js';
import { handledConflictMinimapOverViewRulerColor, unhandledConflictMinimapOverViewRulerColor } from '../colors.js';
import { EditorGutter } from '../editorGutter.js';
import { MergeEditorViewModel } from '../viewModel.js';
import { CodeEditorView, TitleMenu, createSelectionsAutorun } from './codeEditorView.js';

export class BaseCodeEditorView extends CodeEditorView {
	constructor(
		viewModel: IObservable<MergeEditorViewModel | undefined>,
		@IInstantiationService instantiationService: IInstantiationService,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super(instantiationService, viewModel, configurationService);

		this._register(
			createSelectionsAutorun(this, (baseRange, viewModel) => baseRange)
		);

		this._register(
			instantiationService.createInstance(TitleMenu, MenuId.MergeBaseToolbar, this.htmlElements.title)
		);

		this._register(
			autorunWithStore((reader, store) => {
				/** @description update checkboxes */
				if (this.checkboxesVisible.read(reader)) {
					store.add(new EditorGutter(this.editor, this.htmlElements.gutterDiv, {
						getIntersectingGutterItems: (range, reader) => [],
						createView: (item, target) => { throw new BugIndicatingError(); },
					}));
				}
			})
		);

		this._register(
			autorun(reader => {
				/** @description update labels & text model */
				const vm = this.viewModel.read(reader);
				if (!vm) {
					return;
				}
				this.editor.setModel(vm.model.base);
				reset(this.htmlElements.title, ...renderLabelWithIcons(localize('base', 'Base')));

				const baseShowDiffAgainst = vm.baseShowDiffAgainst.read(reader);

				let node: Node | undefined = undefined;
				if (baseShowDiffAgainst) {
					const label = localize('compareWith', 'Comparing with {0}', baseShowDiffAgainst === 1 ? vm.model.input1.title : vm.model.input2.title);
					const tooltip = localize('compareWithTooltip', 'Differences are highlighted with a background color.');
					node = h('span', { title: tooltip }, [label]).root;
				}
				reset(this.htmlElements.description, ...(node ? [node] : []));
			})
		);

		this._register(applyObservableDecorations(this.editor, this.decorations));
	}

	private readonly decorations = derived(this, reader => {
		const viewModel = this.viewModel.read(reader);
		if (!viewModel) {
			return [];
		}
		const model = viewModel.model;
		const textModel = model.base;

		const activeModifiedBaseRange = viewModel.activeModifiedBaseRange.read(reader);
		const showNonConflictingChanges = viewModel.showNonConflictingChanges.read(reader);
		const showDeletionMarkers = this.showDeletionMarkers.read(reader);

		const result: IModelDeltaDecoration[] = [];
		for (const modifiedBaseRange of model.modifiedBaseRanges.read(reader)) {

			const range = modifiedBaseRange.baseRange;
			if (!range) {
				continue;
			}

			const isHandled = model.isHandled(modifiedBaseRange).read(reader);
			if (!modifiedBaseRange.isConflicting && isHandled && !showNonConflictingChanges) {
				continue;
			}

			const blockClassNames = ['merge-editor-block'];
			let blockPadding: [top: number, right: number, bottom: number, left: number] = [0, 0, 0, 0];
			if (isHandled) {
				blockClassNames.push('handled');
			}
			if (modifiedBaseRange === activeModifiedBaseRange) {
				blockClassNames.push('focused');
				blockPadding = [0, 2, 0, 2];
			}
			blockClassNames.push('base');

			const inputToDiffAgainst = viewModel.baseShowDiffAgainst.read(reader);

			if (inputToDiffAgainst) {
				for (const diff of modifiedBaseRange.getInputDiffs(inputToDiffAgainst)) {
					const range = diff.inputRange.toInclusiveRange();
					if (range) {
						result.push({
							range,
							options: {
								className: `merge-editor-diff base`,
								description: 'Merge Editor',
								isWholeLine: true,
							}
						});
					}

					for (const diff2 of diff.rangeMappings) {
						if (showDeletionMarkers || !diff2.inputRange.isEmpty()) {
							result.push({
								range: diff2.inputRange,
								options: {
									className: diff2.inputRange.isEmpty() ? `merge-editor-diff-empty-word base` : `merge-editor-diff-word base`,
									description: 'Merge Editor',
									showIfCollapsed: true,
								},
							});
						}
					}
				}
			}

			result.push({
				range: range.toInclusiveRangeOrEmpty(),
				options: {
					showIfCollapsed: true,
					blockClassName: blockClassNames.join(' '),
					blockPadding,
					blockIsAfterEnd: range.startLineNumber > textModel.getLineCount(),
					description: 'Merge Editor',
					minimap: {
						position: MinimapPosition.Gutter,
						color: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },
					},
					overviewRuler: modifiedBaseRange.isConflicting ? {
						position: OverviewRulerLane.Center,
						color: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },
					} : undefined
				}
			});
		}
		return result;
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/view/editors/codeEditorView.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/view/editors/codeEditorView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { h } from '../../../../../../base/browser/dom.js';
import { IView, IViewSize } from '../../../../../../base/browser/ui/grid/grid.js';
import { Emitter, Event } from '../../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../../base/common/lifecycle.js';
import { IObservable, autorun, derived, observableFromEvent } from '../../../../../../base/common/observable.js';
import { EditorExtensionsRegistry, IEditorContributionDescription } from '../../../../../../editor/browser/editorExtensions.js';
import { CodeEditorWidget } from '../../../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { IEditorOptions } from '../../../../../../editor/common/config/editorOptions.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { Selection } from '../../../../../../editor/common/core/selection.js';
import { CodeLensContribution } from '../../../../../../editor/contrib/codelens/browser/codelensController.js';
import { FoldingController } from '../../../../../../editor/contrib/folding/browser/folding.js';
import { MenuWorkbenchToolBar } from '../../../../../../platform/actions/browser/toolbar.js';
import { MenuId } from '../../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { DEFAULT_EDITOR_MAX_DIMENSIONS, DEFAULT_EDITOR_MIN_DIMENSIONS } from '../../../../../browser/parts/editor/editor.js';
import { setStyle } from '../../utils.js';
import { observableConfigValue } from '../../../../../../platform/observable/common/platformObservableUtils.js';
import { MergeEditorViewModel } from '../viewModel.js';

export abstract class CodeEditorView extends Disposable {
	readonly model;

	protected readonly htmlElements;

	private readonly _onDidViewChange;

	public readonly view: IView;

	protected readonly checkboxesVisible;
	protected readonly showDeletionMarkers;
	protected readonly useSimplifiedDecorations;

	public readonly editor;

	public updateOptions(newOptions: Readonly<IEditorOptions>): void {
		this.editor.updateOptions(newOptions);
	}

	public readonly isFocused;

	public readonly cursorPosition;

	public readonly selection;

	public readonly cursorLineNumber;

	constructor(
		private readonly instantiationService: IInstantiationService,
		public readonly viewModel: IObservable<undefined | MergeEditorViewModel>,
		private readonly configurationService: IConfigurationService,
	) {
		super();
		this.model = this.viewModel.map(m => /** @description model */ m?.model);
		this.htmlElements = h('div.code-view', [
			h('div.header@header', [
				h('span.title@title'),
				h('span.description@description'),
				h('span.detail@detail'),
				h('span.toolbar@toolbar'),
			]),
			h('div.container', [
				h('div.gutter@gutterDiv'),
				h('div@editor'),
			]),
		]);
		this._onDidViewChange = new Emitter<IViewSize | undefined>();
		this.view = {
			element: this.htmlElements.root,
			minimumWidth: DEFAULT_EDITOR_MIN_DIMENSIONS.width,
			maximumWidth: DEFAULT_EDITOR_MAX_DIMENSIONS.width,
			minimumHeight: DEFAULT_EDITOR_MIN_DIMENSIONS.height,
			maximumHeight: DEFAULT_EDITOR_MAX_DIMENSIONS.height,
			onDidChange: this._onDidViewChange.event,
			layout: (width: number, height: number, top: number, left: number) => {
				setStyle(this.htmlElements.root, { width, height, top, left });
				this.editor.layout({
					width: width - this.htmlElements.gutterDiv.clientWidth,
					height: height - this.htmlElements.header.clientHeight,
				});
			}
			// preferredWidth?: number | undefined;
			// preferredHeight?: number | undefined;
			// priority?: LayoutPriority | undefined;
			// snap?: boolean | undefined;
		};
		this.checkboxesVisible = observableConfigValue<boolean>('mergeEditor.showCheckboxes', false, this.configurationService);
		this.showDeletionMarkers = observableConfigValue<boolean>('mergeEditor.showDeletionMarkers', true, this.configurationService);
		this.useSimplifiedDecorations = observableConfigValue<boolean>('mergeEditor.useSimplifiedDecorations', false, this.configurationService);
		this.editor = this.instantiationService.createInstance(
			CodeEditorWidget,
			this.htmlElements.editor,
			{},
			{
				contributions: this.getEditorContributions(),
			}
		);
		this.isFocused = observableFromEvent(this,
			Event.any(this.editor.onDidBlurEditorWidget, this.editor.onDidFocusEditorWidget),
			() => /** @description editor.hasWidgetFocus */ this.editor.hasWidgetFocus()
		);
		this.cursorPosition = observableFromEvent(this,
			this.editor.onDidChangeCursorPosition,
			() => /** @description editor.getPosition */ this.editor.getPosition()
		);
		this.selection = observableFromEvent(this,
			this.editor.onDidChangeCursorSelection,
			() => /** @description editor.getSelections */ this.editor.getSelections()
		);
		this.cursorLineNumber = this.cursorPosition.map(p => /** @description cursorPosition.lineNumber */ p?.lineNumber);

	}

	protected getEditorContributions(): IEditorContributionDescription[] {
		return EditorExtensionsRegistry.getEditorContributions().filter(c => c.id !== FoldingController.ID && c.id !== CodeLensContribution.ID);
	}
}

export function createSelectionsAutorun(
	codeEditorView: CodeEditorView,
	translateRange: (baseRange: Range, viewModel: MergeEditorViewModel) => Range
): IDisposable {
	const selections = derived(reader => {
		/** @description selections */
		const viewModel = codeEditorView.viewModel.read(reader);
		if (!viewModel) {
			return [];
		}
		const baseRange = viewModel.selectionInBase.read(reader);
		if (!baseRange || baseRange.sourceEditor === codeEditorView) {
			return [];
		}
		return baseRange.rangesInBase.map(r => translateRange(r, viewModel));
	});

	return autorun(reader => {
		/** @description set selections */
		const ranges = selections.read(reader);
		if (ranges.length === 0) {
			return;
		}
		codeEditorView.editor.setSelections(ranges.map(r => new Selection(r.startLineNumber, r.startColumn, r.endLineNumber, r.endColumn)));
	});
}

export class TitleMenu extends Disposable {
	constructor(
		menuId: MenuId,
		targetHtmlElement: HTMLElement,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();

		const toolbar = instantiationService.createInstance(MenuWorkbenchToolBar, targetHtmlElement, menuId, {
			menuOptions: { renderShortTitle: true },
			toolbarOptions: { primaryGroup: (g) => g === 'primary' }
		});
		this._store.add(toolbar);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/view/editors/inputCodeEditorView.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/view/editors/inputCodeEditorView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener, EventType, h, reset } from '../../../../../../base/browser/dom.js';
import { renderLabelWithIcons } from '../../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { Toggle } from '../../../../../../base/browser/ui/toggle/toggle.js';
import { Action, IAction, Separator } from '../../../../../../base/common/actions.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { clamp } from '../../../../../../base/common/numbers.js';
import { autorun, autorunOpts, derived, derivedOpts, IObservable, ISettableObservable, ITransaction, observableValue, transaction } from '../../../../../../base/common/observable.js';
import { noBreakWhitespace } from '../../../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { isDefined } from '../../../../../../base/common/types.js';
import { IModelDeltaDecoration, MinimapPosition, OverviewRulerLane } from '../../../../../../editor/common/model.js';
import { localize } from '../../../../../../nls.js';
import { MenuId } from '../../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IContextMenuService } from '../../../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { defaultToggleStyles } from '../../../../../../platform/theme/browser/defaultStyles.js';
import { InputState, ModifiedBaseRange, ModifiedBaseRangeState } from '../../model/modifiedBaseRange.js';
import { applyObservableDecorations, setFields } from '../../utils.js';
import { handledConflictMinimapOverViewRulerColor, unhandledConflictMinimapOverViewRulerColor } from '../colors.js';
import { MergeEditorViewModel } from '../viewModel.js';
import { EditorGutter, IGutterItemInfo, IGutterItemView } from '../editorGutter.js';
import { CodeEditorView, createSelectionsAutorun, TitleMenu } from './codeEditorView.js';

export class InputCodeEditorView extends CodeEditorView {
	public readonly otherInputNumber;

	constructor(
		public readonly inputNumber: 1 | 2,
		viewModel: IObservable<MergeEditorViewModel | undefined>,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super(instantiationService, viewModel, configurationService);
		this.otherInputNumber = this.inputNumber === 1 ? 2 : 1;
		this.modifiedBaseRangeGutterItemInfos = derivedOpts({ debugName: `input${this.inputNumber}.modifiedBaseRangeGutterItemInfos` }, reader => {
			const viewModel = this.viewModel.read(reader);
			if (!viewModel) { return []; }
			const model = viewModel.model;
			const inputNumber = this.inputNumber;

			const showNonConflictingChanges = viewModel.showNonConflictingChanges.read(reader);

			return model.modifiedBaseRanges.read(reader)
				.filter((r) => r.getInputDiffs(this.inputNumber).length > 0 && (showNonConflictingChanges || r.isConflicting || !model.isHandled(r).read(reader)))
				.map((baseRange, idx) => new ModifiedBaseRangeGutterItemModel(idx.toString(), baseRange, inputNumber, viewModel));
		});
		this.decorations = derivedOpts({ debugName: `input${this.inputNumber}.decorations` }, reader => {
			const viewModel = this.viewModel.read(reader);
			if (!viewModel) {
				return [];
			}
			const model = viewModel.model;
			const textModel = (this.inputNumber === 1 ? model.input1 : model.input2).textModel;

			const activeModifiedBaseRange = viewModel.activeModifiedBaseRange.read(reader);

			const result = new Array<IModelDeltaDecoration>();

			const showNonConflictingChanges = viewModel.showNonConflictingChanges.read(reader);
			const showDeletionMarkers = this.showDeletionMarkers.read(reader);
			const diffWithThis = viewModel.baseCodeEditorView.read(reader) !== undefined && viewModel.baseShowDiffAgainst.read(reader) === this.inputNumber;
			const useSimplifiedDecorations = !diffWithThis && this.useSimplifiedDecorations.read(reader);

			for (const modifiedBaseRange of model.modifiedBaseRanges.read(reader)) {
				const range = modifiedBaseRange.getInputRange(this.inputNumber);
				if (!range) {
					continue;
				}

				const blockClassNames = ['merge-editor-block'];
				let blockPadding: [top: number, right: number, bottom: number, left: number] = [0, 0, 0, 0];
				const isHandled = model.isInputHandled(modifiedBaseRange, this.inputNumber).read(reader);
				if (isHandled) {
					blockClassNames.push('handled');
				}
				if (modifiedBaseRange === activeModifiedBaseRange) {
					blockClassNames.push('focused');
					blockPadding = [0, 2, 0, 2];
				}
				if (modifiedBaseRange.isConflicting) {
					blockClassNames.push('conflicting');
				}
				const inputClassName = this.inputNumber === 1 ? 'input i1' : 'input i2';
				blockClassNames.push(inputClassName);

				if (!modifiedBaseRange.isConflicting && !showNonConflictingChanges && isHandled) {
					continue;
				}

				if (useSimplifiedDecorations && !isHandled) {
					blockClassNames.push('use-simplified-decorations');
				}

				result.push({
					range: range.toInclusiveRangeOrEmpty(),
					options: {
						showIfCollapsed: true,
						blockClassName: blockClassNames.join(' '),
						blockPadding,
						blockIsAfterEnd: range.startLineNumber > textModel.getLineCount(),
						description: 'Merge Editor',
						minimap: {
							position: MinimapPosition.Gutter,
							color: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },
						},
						overviewRuler: modifiedBaseRange.isConflicting ? {
							position: OverviewRulerLane.Center,
							color: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },
						} : undefined
					}
				});

				if (!useSimplifiedDecorations && (modifiedBaseRange.isConflicting || !model.isHandled(modifiedBaseRange).read(reader))) {
					const inputDiffs = modifiedBaseRange.getInputDiffs(this.inputNumber);
					for (const diff of inputDiffs) {
						const range = diff.outputRange.toInclusiveRange();
						if (range) {
							result.push({
								range,
								options: {
									className: `merge-editor-diff ${inputClassName}`,
									description: 'Merge Editor',
									isWholeLine: true,
								}
							});
						}

						if (diff.rangeMappings) {
							for (const d of diff.rangeMappings) {
								if (showDeletionMarkers || !d.outputRange.isEmpty()) {
									result.push({
										range: d.outputRange,
										options: {
											className: d.outputRange.isEmpty() ? `merge-editor-diff-empty-word ${inputClassName}` : `merge-editor-diff-word ${inputClassName}`,
											description: 'Merge Editor',
											showIfCollapsed: true,
										}
									});
								}
							}
						}
					}
				}
			}
			return result;
		});

		this.htmlElements.root.classList.add(`input`);

		this._register(
			new EditorGutter(this.editor, this.htmlElements.gutterDiv, {
				getIntersectingGutterItems: (range, reader) => {
					if (this.checkboxesVisible.read(reader)) {
						return this.modifiedBaseRangeGutterItemInfos.read(reader);
					} else {
						return [];
					}
				},
				createView: (item, target) => new MergeConflictGutterItemView(item, target, contextMenuService),
			})
		);

		this._register(
			createSelectionsAutorun(this, (baseRange, viewModel) =>
				viewModel.model.translateBaseRangeToInput(this.inputNumber, baseRange)
			)
		);

		this._register(
			instantiationService.createInstance(
				TitleMenu,
				inputNumber === 1 ? MenuId.MergeInput1Toolbar : MenuId.MergeInput2Toolbar,
				this.htmlElements.toolbar
			)
		);

		this._register(autorunOpts({ debugName: `input${this.inputNumber}: update labels & text model` }, reader => {
			const vm = this.viewModel.read(reader);
			if (!vm) {
				return;
			}

			this.editor.setModel(this.inputNumber === 1 ? vm.model.input1.textModel : vm.model.input2.textModel);

			const title = this.inputNumber === 1
				? vm.model.input1.title || localize('input1', 'Input 1')
				: vm.model.input2.title || localize('input2', 'Input 2');

			const description = this.inputNumber === 1
				? vm.model.input1.description
				: vm.model.input2.description;

			const detail = this.inputNumber === 1
				? vm.model.input1.detail
				: vm.model.input2.detail;

			reset(this.htmlElements.title, ...renderLabelWithIcons(title));
			reset(this.htmlElements.description, ...(description ? renderLabelWithIcons(description) : []));
			reset(this.htmlElements.detail, ...(detail ? renderLabelWithIcons(detail) : []));
		}));


		this._register(applyObservableDecorations(this.editor, this.decorations));
	}

	private readonly modifiedBaseRangeGutterItemInfos;

	private readonly decorations;
}

export class ModifiedBaseRangeGutterItemModel implements IGutterItemInfo {
	private readonly model;
	public readonly range;

	constructor(
		public readonly id: string,
		private readonly baseRange: ModifiedBaseRange,
		private readonly inputNumber: 1 | 2,
		private readonly viewModel: MergeEditorViewModel
	) {
		this.model = this.viewModel.model;
		this.range = this.baseRange.getInputRange(this.inputNumber);
		this.enabled = this.model.isUpToDate;
		this.toggleState = derived(this, reader => {
			const input = this.model
				.getState(this.baseRange)
				.read(reader)
				.getInput(this.inputNumber);
			return input === InputState.second && !this.baseRange.isOrderRelevant
				? InputState.first
				: input;
		});
		this.state = derived(this, reader => {
			const active = this.viewModel.activeModifiedBaseRange.read(reader);
			if (!this.model.hasBaseRange(this.baseRange)) {
				return { handled: false, focused: false }; // Invalid state, should only be observed temporarily
			}
			return {
				handled: this.model.isHandled(this.baseRange).read(reader),
				focused: this.baseRange === active,
			};
		});
	}

	public readonly enabled;

	public readonly toggleState: IObservable<InputState>;

	public readonly state: IObservable<{ handled: boolean; focused: boolean }>;

	public setState(value: boolean, tx: ITransaction): void {
		this.viewModel.setState(
			this.baseRange,
			this.model
				.getState(this.baseRange)
				.get()
				.withInputValue(this.inputNumber, value),
			tx,
			this.inputNumber
		);
	}
	public toggleBothSides(): void {
		transaction(tx => {
			/** @description Context Menu: toggle both sides */
			const state = this.model
				.getState(this.baseRange)
				.get();
			this.model.setState(
				this.baseRange,
				state
					.toggle(this.inputNumber)
					.toggle(this.inputNumber === 1 ? 2 : 1),
				true,
				tx
			);
		});
	}

	public getContextMenuActions(): readonly IAction[] {
		const state = this.model.getState(this.baseRange).get();
		const handled = this.model.isHandled(this.baseRange).get();

		const update = (newState: ModifiedBaseRangeState) => {
			transaction(tx => {
				/** @description Context Menu: Update Base Range State */
				return this.viewModel.setState(this.baseRange, newState, tx, this.inputNumber);
			});
		};

		function action(id: string, label: string, targetState: ModifiedBaseRangeState, checked: boolean) {
			const action = new Action(id, label, undefined, true, () => {
				update(targetState);
			});
			action.checked = checked;
			return action;
		}
		const both = state.includesInput1 && state.includesInput2;

		return [
			this.baseRange.input1Diffs.length > 0
				? action(
					'mergeEditor.acceptInput1',
					localize('mergeEditor.accept', 'Accept {0}', this.model.input1.title),
					state.toggle(1),
					state.includesInput1
				)
				: undefined,
			this.baseRange.input2Diffs.length > 0
				? action(
					'mergeEditor.acceptInput2',
					localize('mergeEditor.accept', 'Accept {0}', this.model.input2.title),
					state.toggle(2),
					state.includesInput2
				)
				: undefined,
			this.baseRange.isConflicting
				? setFields(
					action(
						'mergeEditor.acceptBoth',
						localize(
							'mergeEditor.acceptBoth',
							'Accept Both'
						),
						state.withInputValue(1, !both).withInputValue(2, !both),
						both
					),
					{ enabled: this.baseRange.canBeCombined }
				)
				: undefined,
			new Separator(),
			this.baseRange.isConflicting
				? setFields(
					action(
						'mergeEditor.swap',
						localize('mergeEditor.swap', 'Swap'),
						state.swap(),
						false
					),
					{ enabled: !state.kind && (!both || this.baseRange.isOrderRelevant) }
				)
				: undefined,

			setFields(
				new Action(
					'mergeEditor.markAsHandled',
					localize('mergeEditor.markAsHandled', 'Mark as Handled'),
					undefined,
					true,
					() => {
						transaction((tx) => {
							/** @description Context Menu: Mark as handled */
							this.model.setHandled(this.baseRange, !handled, tx);
						});
					}
				),
				{ checked: handled }
			),
		].filter(isDefined);
	}
}

export class MergeConflictGutterItemView extends Disposable implements IGutterItemView<ModifiedBaseRangeGutterItemModel> {
	private readonly item: ISettableObservable<ModifiedBaseRangeGutterItemModel>;

	private readonly checkboxDiv: HTMLDivElement;
	private readonly isMultiLine = observableValue(this, false);

	constructor(
		item: ModifiedBaseRangeGutterItemModel,
		target: HTMLElement,
		contextMenuService: IContextMenuService,
	) {
		super();

		this.item = observableValue(this, item);

		const checkBox = new Toggle({
			isChecked: false,
			title: '',
			icon: Codicon.check,
			...defaultToggleStyles
		});
		checkBox.domNode.classList.add('accept-conflict-group');

		this._register(
			addDisposableListener(checkBox.domNode, EventType.MOUSE_DOWN, (e) => {
				const item = this.item.get();
				if (!item) {
					return;
				}

				if (e.button === /* Right */ 2) {
					e.stopPropagation();
					e.preventDefault();

					contextMenuService.showContextMenu({
						getAnchor: () => checkBox.domNode,
						getActions: () => item.getContextMenuActions(),
					});

				} else if (e.button === /* Middle */ 1) {
					e.stopPropagation();
					e.preventDefault();

					item.toggleBothSides();
				}
			})
		);

		this._register(
			autorun(reader => {
				/** @description Update Checkbox */
				const item = this.item.read(reader)!;
				const value = item.toggleState.read(reader);
				const iconMap: Record<InputState, { icon: ThemeIcon | undefined; checked: boolean; title: string }> = {
					[InputState.excluded]: { icon: undefined, checked: false, title: localize('accept.excluded', "Accept") },
					[InputState.unrecognized]: { icon: Codicon.circleFilled, checked: false, title: localize('accept.conflicting', "Accept (result is dirty)") },
					[InputState.first]: { icon: Codicon.check, checked: true, title: localize('accept.first', "Undo accept") },
					[InputState.second]: { icon: Codicon.checkAll, checked: true, title: localize('accept.second', "Undo accept (currently second)") },
				};
				const state = iconMap[value];
				checkBox.setIcon(state.icon);
				checkBox.checked = state.checked;
				checkBox.setTitle(state.title);

				if (!item.enabled.read(reader)) {
					checkBox.disable();
				} else {
					checkBox.enable();
				}
			})
		);

		this._register(autorun(reader => {
			/** @description Update Checkbox CSS ClassNames */
			const state = this.item.read(reader).state.read(reader);
			const classNames = [
				'merge-accept-gutter-marker',
				state.handled && 'handled',
				state.focused && 'focused',
				this.isMultiLine.read(reader) ? 'multi-line' : 'single-line',
			];
			target.className = classNames.filter(c => typeof c === 'string').join(' ');
		}));

		this._register(checkBox.onChange(() => {
			transaction(tx => {
				/** @description Handle Checkbox Change */
				this.item.get()!.setState(checkBox.checked, tx);
			});
		}));

		target.appendChild(h('div.background', [noBreakWhitespace]).root);
		target.appendChild(
			this.checkboxDiv = h('div.checkbox', [h('div.checkbox-background', [checkBox.domNode])]).root
		);
	}

	layout(top: number, height: number, viewTop: number, viewHeight: number): void {
		const checkboxHeight = this.checkboxDiv.clientHeight;
		const middleHeight = height / 2 - checkboxHeight / 2;

		const margin = checkboxHeight;

		let effectiveCheckboxTop = top + middleHeight;

		const preferredViewPortRange = [
			margin,
			viewTop + viewHeight - margin - checkboxHeight
		];

		const preferredParentRange = [
			top + margin,
			top + height - checkboxHeight - margin
		];

		if (preferredParentRange[0] < preferredParentRange[1]) {
			effectiveCheckboxTop = clamp(effectiveCheckboxTop, preferredViewPortRange[0], preferredViewPortRange[1]);
			effectiveCheckboxTop = clamp(effectiveCheckboxTop, preferredParentRange[0], preferredParentRange[1]);
		}

		this.checkboxDiv.style.top = `${effectiveCheckboxTop - top}px`;

		transaction((tx) => {
			/** @description MergeConflictGutterItemView: Update Is Multi Line */
			this.isMultiLine.set(height > 30, tx);
		});
	}

	update(baseRange: ModifiedBaseRangeGutterItemModel): void {
		transaction(tx => {
			/** @description MergeConflictGutterItemView: Updating new base range */
			this.item.set(baseRange, tx);
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/view/editors/resultCodeEditorView.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/view/editors/resultCodeEditorView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { reset } from '../../../../../../base/browser/dom.js';
import { ActionBar } from '../../../../../../base/browser/ui/actionbar/actionbar.js';
import { renderLabelWithIcons } from '../../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { CompareResult } from '../../../../../../base/common/arrays.js';
import { BugIndicatingError } from '../../../../../../base/common/errors.js';
import { toDisposable } from '../../../../../../base/common/lifecycle.js';
import { autorun, autorunWithStore, derived, IObservable } from '../../../../../../base/common/observable.js';
import { IModelDeltaDecoration, MinimapPosition, OverviewRulerLane } from '../../../../../../editor/common/model.js';
import { localize } from '../../../../../../nls.js';
import { MenuId } from '../../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../../../platform/label/common/label.js';
import { MergeEditorLineRange } from '../../model/lineRange.js';
import { applyObservableDecorations, join } from '../../utils.js';
import { handledConflictMinimapOverViewRulerColor, unhandledConflictMinimapOverViewRulerColor } from '../colors.js';
import { EditorGutter } from '../editorGutter.js';
import { MergeEditorViewModel } from '../viewModel.js';
import { ctxIsMergeResultEditor } from '../../../common/mergeEditor.js';
import { CodeEditorView, createSelectionsAutorun, TitleMenu } from './codeEditorView.js';

export class ResultCodeEditorView extends CodeEditorView {
	constructor(
		viewModel: IObservable<MergeEditorViewModel | undefined>,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILabelService private readonly _labelService: ILabelService,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super(instantiationService, viewModel, configurationService);

		this.editor.invokeWithinContext(accessor => {
			const contextKeyService = accessor.get(IContextKeyService);
			const isMergeResultEditor = ctxIsMergeResultEditor.bindTo(contextKeyService);
			isMergeResultEditor.set(true);
			this._register(toDisposable(() => isMergeResultEditor.reset()));
		});

		this.htmlElements.gutterDiv.style.width = '5px';
		this.htmlElements.root.classList.add(`result`);

		this._register(
			autorunWithStore((reader, store) => {
				/** @description update checkboxes */
				if (this.checkboxesVisible.read(reader)) {
					store.add(new EditorGutter(this.editor, this.htmlElements.gutterDiv, {
						getIntersectingGutterItems: (range, reader) => [],
						createView: (item, target) => { throw new BugIndicatingError(); },
					}));
				}
			})
		);

		this._register(autorun(reader => {
			/** @description update labels & text model */
			const vm = this.viewModel.read(reader);
			if (!vm) {
				return;
			}
			this.editor.setModel(vm.model.resultTextModel);
			reset(this.htmlElements.title, ...renderLabelWithIcons(localize('result', 'Result')));
			reset(this.htmlElements.description, ...renderLabelWithIcons(this._labelService.getUriLabel(vm.model.resultTextModel.uri, { relative: true })));
		}));


		const remainingConflictsActionBar = this._register(new ActionBar(this.htmlElements.detail));

		this._register(autorun(reader => {
			/** @description update remainingConflicts label */
			const vm = this.viewModel.read(reader);
			if (!vm) {
				return;
			}

			const model = vm.model;
			if (!model) {
				return;
			}
			const count = model.unhandledConflictsCount.read(reader);

			const text = count === 1
				? localize(
					'mergeEditor.remainingConflicts',
					'{0} Conflict Remaining',
					count
				)
				: localize(
					'mergeEditor.remainingConflict',
					'{0} Conflicts Remaining ',
					count
				);

			remainingConflictsActionBar.clear();
			remainingConflictsActionBar.push({
				class: undefined,
				enabled: count > 0,
				id: 'nextConflict',
				label: text,
				run() {
					vm.model.telemetry.reportConflictCounterClicked();
					vm.goToNextModifiedBaseRange(m => !model.isHandled(m).read(undefined));
				},
				tooltip: count > 0
					? localize('goToNextConflict', 'Go to next conflict')
					: localize('allConflictHandled', 'All conflicts handled, the merge can be completed now.'),
			});
		}));


		this._register(applyObservableDecorations(this.editor, this.decorations));

		this._register(
			createSelectionsAutorun(this, (baseRange, viewModel) =>
				viewModel.model.translateBaseRangeToResult(baseRange)
			)
		);

		this._register(
			instantiationService.createInstance(
				TitleMenu,
				MenuId.MergeInputResultToolbar,
				this.htmlElements.toolbar
			)
		);
	}

	private readonly decorations = derived(this, reader => {
		const viewModel = this.viewModel.read(reader);
		if (!viewModel) {
			return [];
		}
		const model = viewModel.model;
		const textModel = model.resultTextModel;
		const result = new Array<IModelDeltaDecoration>();

		const baseRangeWithStoreAndTouchingDiffs = join(
			model.modifiedBaseRanges.read(reader),
			model.baseResultDiffs.read(reader),
			(baseRange, diff) => baseRange.baseRange.intersectsOrTouches(diff.inputRange)
				? CompareResult.neitherLessOrGreaterThan
				: MergeEditorLineRange.compareByStart(
					baseRange.baseRange,
					diff.inputRange
				)
		);

		const activeModifiedBaseRange = viewModel.activeModifiedBaseRange.read(reader);

		const showNonConflictingChanges = viewModel.showNonConflictingChanges.read(reader);

		for (const m of baseRangeWithStoreAndTouchingDiffs) {
			const modifiedBaseRange = m.left;

			if (modifiedBaseRange) {
				const blockClassNames = ['merge-editor-block'];
				let blockPadding: [top: number, right: number, bottom: number, left: number] = [0, 0, 0, 0];
				const isHandled = model.isHandled(modifiedBaseRange).read(reader);
				if (isHandled) {
					blockClassNames.push('handled');
				}
				if (modifiedBaseRange === activeModifiedBaseRange) {
					blockClassNames.push('focused');
					blockPadding = [0, 2, 0, 2];
				}
				if (modifiedBaseRange.isConflicting) {
					blockClassNames.push('conflicting');
				}
				blockClassNames.push('result');

				if (!modifiedBaseRange.isConflicting && !showNonConflictingChanges && isHandled) {
					continue;
				}

				const range = model.getLineRangeInResult(modifiedBaseRange.baseRange, reader);
				result.push({
					range: range.toInclusiveRangeOrEmpty(),
					options: {
						showIfCollapsed: true,
						blockClassName: blockClassNames.join(' '),
						blockPadding,
						blockIsAfterEnd: range.startLineNumber > textModel.getLineCount(),
						description: 'Result Diff',
						minimap: {
							position: MinimapPosition.Gutter,
							color: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },
						},
						overviewRuler: modifiedBaseRange.isConflicting ? {
							position: OverviewRulerLane.Center,
							color: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },
						} : undefined
					}
				});
			}

			if (!modifiedBaseRange || modifiedBaseRange.isConflicting) {
				for (const diff of m.rights) {
					const range = diff.outputRange.toInclusiveRange();
					if (range) {
						result.push({
							range,
							options: {
								className: `merge-editor-diff result`,
								description: 'Merge Editor',
								isWholeLine: true,
							}
						});
					}

					if (diff.rangeMappings) {
						for (const d of diff.rangeMappings) {
							result.push({
								range: d.outputRange,
								options: {
									className: `merge-editor-diff-word result`,
									description: 'Merge Editor'
								}
							});
						}
					}
				}
			}
		}
		return result;
	});
}
```

--------------------------------------------------------------------------------

````
