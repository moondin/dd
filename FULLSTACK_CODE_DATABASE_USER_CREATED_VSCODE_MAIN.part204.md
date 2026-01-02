---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 204
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 204 of 552)

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

---[FILE: src/vs/editor/browser/widget/diffEditor/diffEditorViewModel.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/diffEditorViewModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { IObservable, IReader, ISettableObservable, ITransaction, autorun, autorunWithStore, derived, observableSignal, observableSignalFromEvent, observableValue, transaction, waitForState } from '../../../../base/common/observable.js';
import { IDiffProviderFactoryService } from './diffProviderFactoryService.js';
import { filterWithPrevious } from './utils.js';
import { readHotReloadableExport } from '../../../../base/common/hotReloadHelpers.js';
import { ISerializedLineRange, LineRange, LineRangeSet } from '../../../common/core/ranges/lineRange.js';
import { DefaultLinesDiffComputer } from '../../../common/diff/defaultLinesDiffComputer/defaultLinesDiffComputer.js';
import { IDocumentDiff } from '../../../common/diff/documentDiffProvider.js';
import { MovedText } from '../../../common/diff/linesDiffComputer.js';
import { DetailedLineRangeMapping, LineRangeMapping, RangeMapping } from '../../../common/diff/rangeMapping.js';
import { IDiffEditorModel, IDiffEditorViewModel } from '../../../common/editorCommon.js';
import { ITextModel } from '../../../common/model.js';
import { TextEditInfo } from '../../../common/model/bracketPairsTextModelPart/bracketPairsTree/beforeEditPositionMapper.js';
import { combineTextEditInfos } from '../../../common/model/bracketPairsTextModelPart/bracketPairsTree/combineTextEditInfos.js';
import { DiffEditorOptions } from './diffEditorOptions.js';
import { optimizeSequenceDiffs } from '../../../common/diff/defaultLinesDiffComputer/heuristicSequenceOptimizations.js';
import { isDefined } from '../../../../base/common/types.js';
import { groupAdjacentBy } from '../../../../base/common/arrays.js';
import { softAssert } from '../../../../base/common/assert.js';

export class DiffEditorViewModel extends Disposable implements IDiffEditorViewModel {
	private readonly _isDiffUpToDate = observableValue<boolean>(this, false);
	public readonly isDiffUpToDate: IObservable<boolean> = this._isDiffUpToDate;

	private _lastDiff: IDocumentDiff | undefined;
	private readonly _diff = observableValue<DiffState | undefined>(this, undefined);
	public readonly diff: IObservable<DiffState | undefined> = this._diff;

	private readonly _unchangedRegions = observableValue<{ regions: UnchangedRegion[]; originalDecorationIds: string[]; modifiedDecorationIds: string[] } | undefined>(this, undefined);
	public readonly unchangedRegions: IObservable<UnchangedRegion[]> = derived(this, r => {
		if (this._options.hideUnchangedRegions.read(r)) {
			return this._unchangedRegions.read(r)?.regions ?? [];
		} else {
			// Reset state
			transaction(tx => {
				for (const r of this._unchangedRegions.read(undefined)?.regions || []) {
					r.collapseAll(tx);
				}
			});
			return [];
		}
	}
	);

	public readonly movedTextToCompare = observableValue<MovedText | undefined>(this, undefined);

	private readonly _activeMovedText = observableValue<MovedText | undefined>(this, undefined);
	private readonly _hoveredMovedText = observableValue<MovedText | undefined>(this, undefined);


	public readonly activeMovedText = derived(this, r => this.movedTextToCompare.read(r) ?? this._hoveredMovedText.read(r) ?? this._activeMovedText.read(r));

	public setActiveMovedText(movedText: MovedText | undefined): void {
		this._activeMovedText.set(movedText, undefined);
	}

	public setHoveredMovedText(movedText: MovedText | undefined): void {
		this._hoveredMovedText.set(movedText, undefined);
	}

	private readonly _cancellationTokenSource = new CancellationTokenSource();

	private readonly _diffProvider = derived(this, reader => {
		const diffProvider = this._diffProviderFactoryService.createDiffProvider({
			diffAlgorithm: this._options.diffAlgorithm.read(reader)
		});
		const onChangeSignal = observableSignalFromEvent('onDidChange', diffProvider.onDidChange);
		return {
			diffProvider,
			onChangeSignal,
		};
	});

	constructor(
		public readonly model: IDiffEditorModel,
		private readonly _options: DiffEditorOptions,
		@IDiffProviderFactoryService private readonly _diffProviderFactoryService: IDiffProviderFactoryService,
	) {
		super();

		this._register(toDisposable(() => this._cancellationTokenSource.cancel()));

		const contentChangedSignal = observableSignal('contentChangedSignal');
		const debouncer = this._register(new RunOnceScheduler(() => contentChangedSignal.trigger(undefined), 200));

		this._register(autorun(reader => {
			/** @description collapse touching unchanged ranges */

			const lastUnchangedRegions = this._unchangedRegions.read(reader);
			if (!lastUnchangedRegions || lastUnchangedRegions.regions.some(r => r.isDragged.read(reader))) {
				return;
			}

			const lastUnchangedRegionsOrigRanges = lastUnchangedRegions.originalDecorationIds
				.map(id => model.original.getDecorationRange(id))
				.map(r => r ? LineRange.fromRangeInclusive(r) : undefined);
			const lastUnchangedRegionsModRanges = lastUnchangedRegions.modifiedDecorationIds
				.map(id => model.modified.getDecorationRange(id))
				.map(r => r ? LineRange.fromRangeInclusive(r) : undefined);
			const updatedLastUnchangedRegions = lastUnchangedRegions.regions.map((r, idx) =>
				(!lastUnchangedRegionsOrigRanges[idx] || !lastUnchangedRegionsModRanges[idx]) ? undefined :
					new UnchangedRegion(
						lastUnchangedRegionsOrigRanges[idx].startLineNumber,
						lastUnchangedRegionsModRanges[idx].startLineNumber,
						lastUnchangedRegionsOrigRanges[idx].length,
						r.visibleLineCountTop.read(reader),
						r.visibleLineCountBottom.read(reader),
					)).filter(isDefined);

			const newRanges: UnchangedRegion[] = [];

			let didChange = false;
			for (const touching of groupAdjacentBy(updatedLastUnchangedRegions, (a, b) => a.getHiddenModifiedRange(reader).endLineNumberExclusive === b.getHiddenModifiedRange(reader).startLineNumber)) {
				if (touching.length > 1) {
					didChange = true;
					const sumLineCount = touching.reduce((sum, r) => sum + r.lineCount, 0);
					const r = new UnchangedRegion(touching[0].originalLineNumber, touching[0].modifiedLineNumber, sumLineCount, touching[0].visibleLineCountTop.read(undefined), touching[touching.length - 1].visibleLineCountBottom.read(undefined));
					newRanges.push(r);
				} else {
					newRanges.push(touching[0]);
				}
			}
			if (didChange) {
				const originalDecorationIds = model.original.deltaDecorations(
					lastUnchangedRegions.originalDecorationIds,
					newRanges.map(r => ({ range: r.originalUnchangedRange.toInclusiveRange()!, options: { description: 'unchanged' } }))
				);
				const modifiedDecorationIds = model.modified.deltaDecorations(
					lastUnchangedRegions.modifiedDecorationIds,
					newRanges.map(r => ({ range: r.modifiedUnchangedRange.toInclusiveRange()!, options: { description: 'unchanged' } }))
				);

				transaction(tx => {
					this._unchangedRegions.set(
						{
							regions: newRanges,
							originalDecorationIds,
							modifiedDecorationIds
						},
						tx
					);
				});
			}
		}));

		const updateUnchangedRegions = (result: IDocumentDiff, tx: ITransaction, reader?: IReader) => {
			const newUnchangedRegions = UnchangedRegion.fromDiffs(
				result.changes,
				model.original.getLineCount(),
				model.modified.getLineCount(),
				this._options.hideUnchangedRegionsMinimumLineCount.read(reader),
				this._options.hideUnchangedRegionsContextLineCount.read(reader),
			);

			// Transfer state from cur state
			let visibleRegions: LineRangeMapping[] | undefined = undefined;

			const lastUnchangedRegions = this._unchangedRegions.get();
			if (lastUnchangedRegions) {
				const lastUnchangedRegionsOrigRanges = lastUnchangedRegions.originalDecorationIds
					.map(id => model.original.getDecorationRange(id))
					.map(r => r ? LineRange.fromRangeInclusive(r) : undefined);
				const lastUnchangedRegionsModRanges = lastUnchangedRegions.modifiedDecorationIds
					.map(id => model.modified.getDecorationRange(id))
					.map(r => r ? LineRange.fromRangeInclusive(r) : undefined);
				const updatedLastUnchangedRegions = filterWithPrevious(
					lastUnchangedRegions.regions
						.map((r, idx) => {
							if (!lastUnchangedRegionsOrigRanges[idx] || !lastUnchangedRegionsModRanges[idx]) { return undefined; }
							const length = lastUnchangedRegionsOrigRanges[idx].length;
							return new UnchangedRegion(
								lastUnchangedRegionsOrigRanges[idx].startLineNumber,
								lastUnchangedRegionsModRanges[idx].startLineNumber,
								length,
								// The visible area can shrink by edits -> we have to account for this
								Math.min(r.visibleLineCountTop.get(), length),
								Math.min(r.visibleLineCountBottom.get(), length - r.visibleLineCountTop.get()),
							);
						}
						).filter(isDefined),
					(cur, prev) => !prev || (cur.modifiedLineNumber >= prev.modifiedLineNumber + prev.lineCount && cur.originalLineNumber >= prev.originalLineNumber + prev.lineCount)
				);

				let hiddenRegions = updatedLastUnchangedRegions.map(r => new LineRangeMapping(r.getHiddenOriginalRange(reader), r.getHiddenModifiedRange(reader)));
				hiddenRegions = LineRangeMapping.clip(hiddenRegions, LineRange.ofLength(1, model.original.getLineCount()), LineRange.ofLength(1, model.modified.getLineCount()));
				visibleRegions = LineRangeMapping.inverse(hiddenRegions, model.original.getLineCount(), model.modified.getLineCount());
			}

			const newUnchangedRegions2 = [];
			if (visibleRegions) {
				for (const r of newUnchangedRegions) {
					const intersecting = visibleRegions.filter(f => f.original.intersectsStrict(r.originalUnchangedRange) && f.modified.intersectsStrict(r.modifiedUnchangedRange));
					newUnchangedRegions2.push(...r.setVisibleRanges(intersecting, tx));
				}
			} else {
				newUnchangedRegions2.push(...newUnchangedRegions);
			}

			const originalDecorationIds = model.original.deltaDecorations(
				lastUnchangedRegions?.originalDecorationIds || [],
				newUnchangedRegions2.map(r => ({ range: r.originalUnchangedRange.toInclusiveRange()!, options: { description: 'unchanged' } }))
			);
			const modifiedDecorationIds = model.modified.deltaDecorations(
				lastUnchangedRegions?.modifiedDecorationIds || [],
				newUnchangedRegions2.map(r => ({ range: r.modifiedUnchangedRange.toInclusiveRange()!, options: { description: 'unchanged' } }))
			);

			this._unchangedRegions.set(
				{
					regions: newUnchangedRegions2,
					originalDecorationIds,
					modifiedDecorationIds
				},
				tx
			);
		};

		this._register(model.modified.onDidChangeContent((e) => {
			const diff = this._diff.get();
			if (diff) {
				const textEdits = TextEditInfo.fromModelContentChanges(e.changes);
				const result = applyModifiedEdits(this._lastDiff!, textEdits, model.original, model.modified);
				if (result) {
					this._lastDiff = result;
					transaction(tx => {
						this._diff.set(DiffState.fromDiffResult(this._lastDiff!), tx);
						updateUnchangedRegions(result, tx);
						const currentSyncedMovedText = this.movedTextToCompare.get();
						this.movedTextToCompare.set(currentSyncedMovedText ? this._lastDiff!.moves.find(m => m.lineRangeMapping.modified.intersect(currentSyncedMovedText.lineRangeMapping.modified)) : undefined, tx);
					});
				}
			}

			this._isDiffUpToDate.set(false, undefined);
			debouncer.schedule();
		}));
		this._register(model.original.onDidChangeContent((e) => {
			const diff = this._diff.get();
			if (diff) {
				const textEdits = TextEditInfo.fromModelContentChanges(e.changes);
				const result = applyOriginalEdits(this._lastDiff!, textEdits, model.original, model.modified);
				if (result) {
					this._lastDiff = result;
					transaction(tx => {
						this._diff.set(DiffState.fromDiffResult(this._lastDiff!), tx);
						updateUnchangedRegions(result, tx);
						const currentSyncedMovedText = this.movedTextToCompare.get();
						this.movedTextToCompare.set(currentSyncedMovedText ? this._lastDiff!.moves.find(m => m.lineRangeMapping.modified.intersect(currentSyncedMovedText.lineRangeMapping.modified)) : undefined, tx);
					});
				}
			}

			this._isDiffUpToDate.set(false, undefined);
			debouncer.schedule();
		}));

		this._register(autorunWithStore(async (reader, store) => {
			/** @description compute diff */

			// So that they get recomputed when these settings change
			this._options.hideUnchangedRegionsMinimumLineCount.read(reader);
			this._options.hideUnchangedRegionsContextLineCount.read(reader);

			debouncer.cancel();
			contentChangedSignal.read(reader);
			const documentDiffProvider = this._diffProvider.read(reader);
			documentDiffProvider.onChangeSignal.read(reader);

			readHotReloadableExport(DefaultLinesDiffComputer, reader);
			readHotReloadableExport(optimizeSequenceDiffs, reader);

			this._isDiffUpToDate.set(false, undefined);

			let originalTextEditInfos: TextEditInfo[] = [];
			store.add(model.original.onDidChangeContent((e) => {
				const edits = TextEditInfo.fromModelContentChanges(e.changes);
				originalTextEditInfos = combineTextEditInfos(originalTextEditInfos, edits);
			}));

			let modifiedTextEditInfos: TextEditInfo[] = [];
			store.add(model.modified.onDidChangeContent((e) => {
				const edits = TextEditInfo.fromModelContentChanges(e.changes);
				modifiedTextEditInfos = combineTextEditInfos(modifiedTextEditInfos, edits);
			}));

			let result = await documentDiffProvider.diffProvider.computeDiff(model.original, model.modified, {
				ignoreTrimWhitespace: this._options.ignoreTrimWhitespace.read(reader),
				maxComputationTimeMs: this._options.maxComputationTimeMs.read(reader),
				computeMoves: this._options.showMoves.read(reader),
			}, this._cancellationTokenSource.token);

			if (this._cancellationTokenSource.token.isCancellationRequested) {
				return;
			}
			if (model.original.isDisposed() || model.modified.isDisposed()) {
				// TODO@hediet fishy?
				return;
			}
			result = normalizeDocumentDiff(result, model.original, model.modified);
			result = applyOriginalEdits(result, originalTextEditInfos, model.original, model.modified) ?? result;
			result = applyModifiedEdits(result, modifiedTextEditInfos, model.original, model.modified) ?? result;

			transaction(tx => {
				/** @description write diff result */
				updateUnchangedRegions(result, tx);

				this._lastDiff = result;
				const state = DiffState.fromDiffResult(result);
				this._diff.set(state, tx);
				this._isDiffUpToDate.set(true, tx);
				const currentSyncedMovedText = this.movedTextToCompare.read(undefined);
				this.movedTextToCompare.set(currentSyncedMovedText ? this._lastDiff.moves.find(m => m.lineRangeMapping.modified.intersect(currentSyncedMovedText.lineRangeMapping.modified)) : undefined, tx);
			});
		}));
	}

	public ensureModifiedLineIsVisible(lineNumber: number, preference: RevealPreference, tx: ITransaction | undefined): void {
		if (this.diff.get()?.mappings.length === 0) {
			return;
		}
		const unchangedRegions = this._unchangedRegions.get()?.regions || [];
		for (const r of unchangedRegions) {
			if (r.getHiddenModifiedRange(undefined).contains(lineNumber)) {
				r.showModifiedLine(lineNumber, preference, tx);
				return;
			}
		}
	}

	public ensureOriginalLineIsVisible(lineNumber: number, preference: RevealPreference, tx: ITransaction | undefined): void {
		if (this.diff.get()?.mappings.length === 0) {
			return;
		}
		const unchangedRegions = this._unchangedRegions.get()?.regions || [];
		for (const r of unchangedRegions) {
			if (r.getHiddenOriginalRange(undefined).contains(lineNumber)) {
				r.showOriginalLine(lineNumber, preference, tx);
				return;
			}
		}
	}

	public async waitForDiff(): Promise<void> {
		await waitForState(this.isDiffUpToDate, s => s);
	}

	public serializeState(): SerializedState {
		const regions = this._unchangedRegions.get();
		return {
			collapsedRegions: regions?.regions.map(r => ({ range: r.getHiddenModifiedRange(undefined).serialize() }))
		};
	}

	public restoreSerializedState(state: SerializedState): void {
		const ranges = state.collapsedRegions?.map(r => LineRange.deserialize(r.range));
		const regions = this._unchangedRegions.get();
		if (!regions || !ranges) {
			return;
		}
		transaction(tx => {
			for (const r of regions.regions) {
				for (const range of ranges) {
					if (r.modifiedUnchangedRange.intersect(range)) {
						r.setHiddenModifiedRange(range, tx);
						break;
					}
				}
			}
		});
	}
}

function normalizeDocumentDiff(diff: IDocumentDiff, original: ITextModel, modified: ITextModel): IDocumentDiff {
	return {
		changes: diff.changes.map(c => new DetailedLineRangeMapping(
			c.original,
			c.modified,
			c.innerChanges ? c.innerChanges.map(i => normalizeRangeMapping(i, original, modified)) : undefined
		)),
		moves: diff.moves,
		identical: diff.identical,
		quitEarly: diff.quitEarly,
	};
}

function normalizeRangeMapping(rangeMapping: RangeMapping, original: ITextModel, modified: ITextModel): RangeMapping {
	let originalRange = rangeMapping.originalRange;
	let modifiedRange = rangeMapping.modifiedRange;
	if (
		originalRange.startColumn === 1 && modifiedRange.startColumn === 1 &&
		(originalRange.endColumn !== 1 || modifiedRange.endColumn !== 1) &&
		originalRange.endColumn === original.getLineMaxColumn(originalRange.endLineNumber)
		&& modifiedRange.endColumn === modified.getLineMaxColumn(modifiedRange.endLineNumber)
		&& originalRange.endLineNumber < original.getLineCount()
		&& modifiedRange.endLineNumber < modified.getLineCount()
	) {
		originalRange = originalRange.setEndPosition(originalRange.endLineNumber + 1, 1);
		modifiedRange = modifiedRange.setEndPosition(modifiedRange.endLineNumber + 1, 1);
	}
	return new RangeMapping(originalRange, modifiedRange);
}

interface SerializedState {
	collapsedRegions: { range: ISerializedLineRange }[] | undefined;
}

export class DiffState {
	public static fromDiffResult(result: IDocumentDiff): DiffState {
		return new DiffState(
			result.changes.map(c => new DiffMapping(c)),
			result.moves || [],
			result.identical,
			result.quitEarly,
		);
	}

	constructor(
		public readonly mappings: readonly DiffMapping[],
		public readonly movedTexts: readonly MovedText[],
		public readonly identical: boolean,
		public readonly quitEarly: boolean,
	) { }
}

export class DiffMapping {
	constructor(
		readonly lineRangeMapping: DetailedLineRangeMapping,
	) {
		/*
		readonly movedTo: MovedText | undefined,
		readonly movedFrom: MovedText | undefined,

		if (movedTo) {
			assertFn(() =>
				movedTo.lineRangeMapping.modifiedRange.equals(lineRangeMapping.modifiedRange)
				&& lineRangeMapping.originalRange.isEmpty
				&& !movedFrom
			);
		} else if (movedFrom) {
			assertFn(() =>
				movedFrom.lineRangeMapping.originalRange.equals(lineRangeMapping.originalRange)
				&& lineRangeMapping.modifiedRange.isEmpty
				&& !movedTo
			);
		}
		*/
	}
}

export class UnchangedRegion {
	public static fromDiffs(
		changes: readonly DetailedLineRangeMapping[],
		originalLineCount: number,
		modifiedLineCount: number,
		minHiddenLineCount: number,
		minContext: number,
	): UnchangedRegion[] {
		const inversedMappings = DetailedLineRangeMapping.inverse(changes, originalLineCount, modifiedLineCount);
		const result: UnchangedRegion[] = [];

		for (const mapping of inversedMappings) {
			let origStart = mapping.original.startLineNumber;
			let modStart = mapping.modified.startLineNumber;
			let length = mapping.original.length;

			const atStart = origStart === 1 && modStart === 1;
			const atEnd = origStart + length === originalLineCount + 1 && modStart + length === modifiedLineCount + 1;

			if ((atStart || atEnd) && length >= minContext + minHiddenLineCount) {
				if (atStart && !atEnd) {
					length -= minContext;
				}
				if (atEnd && !atStart) {
					origStart += minContext;
					modStart += minContext;
					length -= minContext;
				}
				result.push(new UnchangedRegion(origStart, modStart, length, 0, 0));
			} else if (length >= minContext * 2 + minHiddenLineCount) {
				origStart += minContext;
				modStart += minContext;
				length -= minContext * 2;
				result.push(new UnchangedRegion(origStart, modStart, length, 0, 0));
			}
		}

		return result;
	}

	public get originalUnchangedRange(): LineRange {
		return LineRange.ofLength(this.originalLineNumber, this.lineCount);
	}

	public get modifiedUnchangedRange(): LineRange {
		return LineRange.ofLength(this.modifiedLineNumber, this.lineCount);
	}

	private readonly _visibleLineCountTop = observableValue<number>(this, 0);
	public readonly visibleLineCountTop: ISettableObservable<number> = this._visibleLineCountTop;

	private readonly _visibleLineCountBottom = observableValue<number>(this, 0);
	public readonly visibleLineCountBottom: ISettableObservable<number> = this._visibleLineCountBottom;

	private readonly _shouldHideControls = derived(this, reader => /** @description isVisible */
		this.visibleLineCountTop.read(reader) + this.visibleLineCountBottom.read(reader) === this.lineCount && !this.isDragged.read(reader));

	public readonly isDragged = observableValue<undefined | 'bottom' | 'top'>(this, undefined);

	constructor(
		public readonly originalLineNumber: number,
		public readonly modifiedLineNumber: number,
		public readonly lineCount: number,
		visibleLineCountTop: number,
		visibleLineCountBottom: number,
	) {
		const visibleLineCountTop2 = Math.max(Math.min(visibleLineCountTop, this.lineCount), 0);
		const visibleLineCountBottom2 = Math.max(Math.min(visibleLineCountBottom, this.lineCount - visibleLineCountTop), 0);

		softAssert(visibleLineCountTop === visibleLineCountTop2);
		softAssert(visibleLineCountBottom === visibleLineCountBottom2);

		this._visibleLineCountTop.set(visibleLineCountTop2, undefined);
		this._visibleLineCountBottom.set(visibleLineCountBottom2, undefined);
	}

	public setVisibleRanges(visibleRanges: LineRangeMapping[], tx: ITransaction): UnchangedRegion[] {
		const result: UnchangedRegion[] = [];

		const hiddenModified = new LineRangeSet(visibleRanges.map(r => r.modified)).subtractFrom(this.modifiedUnchangedRange);

		let originalStartLineNumber = this.originalLineNumber;
		let modifiedStartLineNumber = this.modifiedLineNumber;
		const modifiedEndLineNumberEx = this.modifiedLineNumber + this.lineCount;
		if (hiddenModified.ranges.length === 0) {
			this.showAll(tx);
			result.push(this);
		} else {
			let i = 0;
			for (const r of hiddenModified.ranges) {
				const isLast = i === hiddenModified.ranges.length - 1;
				i++;

				const length = (isLast ? modifiedEndLineNumberEx : r.endLineNumberExclusive) - modifiedStartLineNumber;

				const newR = new UnchangedRegion(originalStartLineNumber, modifiedStartLineNumber, length, 0, 0);
				newR.setHiddenModifiedRange(r, tx);
				result.push(newR);

				originalStartLineNumber = newR.originalUnchangedRange.endLineNumberExclusive;
				modifiedStartLineNumber = newR.modifiedUnchangedRange.endLineNumberExclusive;
			}
		}

		return result;
	}

	public shouldHideControls(reader: IReader | undefined): boolean {
		return this._shouldHideControls.read(reader);
	}

	public getHiddenOriginalRange(reader: IReader | undefined): LineRange {
		return LineRange.ofLength(
			this.originalLineNumber + this._visibleLineCountTop.read(reader),
			this.lineCount - this._visibleLineCountTop.read(reader) - this._visibleLineCountBottom.read(reader),
		);
	}

	public getHiddenModifiedRange(reader: IReader | undefined): LineRange {
		return LineRange.ofLength(
			this.modifiedLineNumber + this._visibleLineCountTop.read(reader),
			this.lineCount - this._visibleLineCountTop.read(reader) - this._visibleLineCountBottom.read(reader),
		);
	}

	public setHiddenModifiedRange(range: LineRange, tx: ITransaction) {
		const visibleLineCountTop = range.startLineNumber - this.modifiedLineNumber;
		const visibleLineCountBottom = (this.modifiedLineNumber + this.lineCount) - range.endLineNumberExclusive;
		this.setState(visibleLineCountTop, visibleLineCountBottom, tx);
	}

	public getMaxVisibleLineCountTop() {
		return this.lineCount - this._visibleLineCountBottom.get();
	}

	public getMaxVisibleLineCountBottom() {
		return this.lineCount - this._visibleLineCountTop.get();
	}

	public showMoreAbove(count = 10, tx: ITransaction | undefined): void {
		const maxVisibleLineCountTop = this.getMaxVisibleLineCountTop();
		this._visibleLineCountTop.set(Math.min(this._visibleLineCountTop.get() + count, maxVisibleLineCountTop), tx);
	}

	public showMoreBelow(count = 10, tx: ITransaction | undefined): void {
		const maxVisibleLineCountBottom = this.lineCount - this._visibleLineCountTop.get();
		this._visibleLineCountBottom.set(Math.min(this._visibleLineCountBottom.get() + count, maxVisibleLineCountBottom), tx);
	}

	public showAll(tx: ITransaction | undefined): void {
		this._visibleLineCountBottom.set(this.lineCount - this._visibleLineCountTop.get(), tx);
	}

	public showModifiedLine(lineNumber: number, preference: RevealPreference, tx: ITransaction | undefined): void {
		const top = lineNumber + 1 - (this.modifiedLineNumber + this._visibleLineCountTop.get());
		const bottom = (this.modifiedLineNumber - this._visibleLineCountBottom.get() + this.lineCount) - lineNumber;
		if (preference === RevealPreference.FromCloserSide && top < bottom || preference === RevealPreference.FromTop) {
			this._visibleLineCountTop.set(this._visibleLineCountTop.get() + top, tx);
		} else {
			this._visibleLineCountBottom.set(this._visibleLineCountBottom.get() + bottom, tx);
		}
	}

	public showOriginalLine(lineNumber: number, preference: RevealPreference, tx: ITransaction | undefined): void {
		const top = lineNumber - this.originalLineNumber;
		const bottom = (this.originalLineNumber + this.lineCount) - lineNumber;
		if (preference === RevealPreference.FromCloserSide && top < bottom || preference === RevealPreference.FromTop) {
			this._visibleLineCountTop.set(Math.min(this._visibleLineCountTop.get() + bottom - top, this.getMaxVisibleLineCountTop()), tx);
		} else {
			this._visibleLineCountBottom.set(Math.min(this._visibleLineCountBottom.get() + top - bottom, this.getMaxVisibleLineCountBottom()), tx);
		}
	}

	public collapseAll(tx: ITransaction | undefined): void {
		this._visibleLineCountTop.set(0, tx);
		this._visibleLineCountBottom.set(0, tx);
	}

	public setState(visibleLineCountTop: number, visibleLineCountBottom: number, tx: ITransaction | undefined): void {
		visibleLineCountTop = Math.max(Math.min(visibleLineCountTop, this.lineCount), 0);
		visibleLineCountBottom = Math.max(Math.min(visibleLineCountBottom, this.lineCount - visibleLineCountTop), 0);

		this._visibleLineCountTop.set(visibleLineCountTop, tx);
		this._visibleLineCountBottom.set(visibleLineCountBottom, tx);
	}
}

export const enum RevealPreference {
	FromCloserSide,
	FromTop,
	FromBottom,
}

function applyOriginalEdits(diff: IDocumentDiff, textEdits: TextEditInfo[], originalTextModel: ITextModel, modifiedTextModel: ITextModel): IDocumentDiff | undefined {
	return undefined;
	/*
	TODO@hediet
	if (textEdits.length === 0) {
		return diff;
	}

	const diff2 = flip(diff);
	const diff3 = applyModifiedEdits(diff2, textEdits, modifiedTextModel, originalTextModel);
	if (!diff3) {
		return undefined;
	}
	return flip(diff3);*/
}
/*
function flip(diff: IDocumentDiff): IDocumentDiff {
	return {
		changes: diff.changes.map(c => c.flip()),
		moves: diff.moves.map(m => m.flip()),
		identical: diff.identical,
		quitEarly: diff.quitEarly,
	};
}
*/
function applyModifiedEdits(diff: IDocumentDiff, textEdits: TextEditInfo[], originalTextModel: ITextModel, modifiedTextModel: ITextModel): IDocumentDiff | undefined {
	return undefined;
	/*
	TODO@hediet
	if (textEdits.length === 0) {
		return diff;
	}
	if (diff.changes.some(c => !c.innerChanges) || diff.moves.length > 0) {
		// TODO support these cases
		return undefined;
	}

	const changes = applyModifiedEditsToLineRangeMappings(diff.changes, textEdits, originalTextModel, modifiedTextModel);

	const moves = diff.moves.map(m => {
		const newModifiedRange = applyEditToLineRange(m.lineRangeMapping.modified, textEdits);
		return newModifiedRange ? new MovedText(
			new SimpleLineRangeMapping(m.lineRangeMapping.original, newModifiedRange),
			applyModifiedEditsToLineRangeMappings(m.changes, textEdits, originalTextModel, modifiedTextModel),
		) : undefined;
	}).filter(isDefined);

	return {
		identical: false,
		quitEarly: false,
		changes,
		moves,
	};*/
}
/*
function applyEditToLineRange(range: LineRange, textEdits: TextEditInfo[]): LineRange | undefined {
	let rangeStartLineNumber = range.startLineNumber;
	let rangeEndLineNumberEx = range.endLineNumberExclusive;

	for (let i = textEdits.length - 1; i >= 0; i--) {
		const textEdit = textEdits[i];
		const textEditStartLineNumber = lengthGetLineCount(textEdit.startOffset) + 1;
		const textEditEndLineNumber = lengthGetLineCount(textEdit.endOffset) + 1;
		const newLengthLineCount = lengthGetLineCount(textEdit.newLength);
		const delta = newLengthLineCount - (textEditEndLineNumber - textEditStartLineNumber);

		if (textEditEndLineNumber < rangeStartLineNumber) {
			// the text edit is before us
			rangeStartLineNumber += delta;
			rangeEndLineNumberEx += delta;
		} else if (textEditStartLineNumber > rangeEndLineNumberEx) {
			// the text edit is after us
			// NOOP
		} else if (textEditStartLineNumber < rangeStartLineNumber && rangeEndLineNumberEx < textEditEndLineNumber) {
			// the range is fully contained in the text edit
			return undefined;
		} else if (textEditStartLineNumber < rangeStartLineNumber && textEditEndLineNumber <= rangeEndLineNumberEx) {
			// the text edit ends inside our range
			rangeStartLineNumber = textEditEndLineNumber + 1;
			rangeStartLineNumber += delta;
			rangeEndLineNumberEx += delta;
		} else if (rangeStartLineNumber <= textEditStartLineNumber && textEditEndLineNumber < rangeStartLineNumber) {
			// the text edit starts inside our range
			rangeEndLineNumberEx = textEditStartLineNumber;
		} else {
			rangeEndLineNumberEx += delta;
		}
	}

	return new LineRange(rangeStartLineNumber, rangeEndLineNumberEx);
}

function applyModifiedEditsToLineRangeMappings(changes: readonly LineRangeMapping[], textEdits: TextEditInfo[], originalTextModel: ITextModel, modifiedTextModel: ITextModel): LineRangeMapping[] {
	const diffTextEdits = changes.flatMap(c => c.innerChanges!.map(c => new TextEditInfo(
		positionToLength(c.originalRange.getStartPosition()),
		positionToLength(c.originalRange.getEndPosition()),
		lengthOfRange(c.modifiedRange).toLength(),
	)));

	const combined = combineTextEditInfos(diffTextEdits, textEdits);

	let lastOriginalEndOffset = lengthZero;
	let lastModifiedEndOffset = lengthZero;
	const rangeMappings = combined.map(c => {
		const modifiedStartOffset = lengthAdd(lastModifiedEndOffset, lengthDiffNonNegative(lastOriginalEndOffset, c.startOffset));
		lastOriginalEndOffset = c.endOffset;
		lastModifiedEndOffset = lengthAdd(modifiedStartOffset, c.newLength);

		return new RangeMapping(
			Range.fromPositions(lengthToPosition(c.startOffset), lengthToPosition(c.endOffset)),
			Range.fromPositions(lengthToPosition(modifiedStartOffset), lengthToPosition(lastModifiedEndOffset)),
		);
	});

	const newChanges = lineRangeMappingFromRangeMappings(
		rangeMappings,
		originalTextModel.getLinesContent(),
		modifiedTextModel.getLinesContent(),
	);
	return newChanges;
}
*/
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/diffEditorWidget.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/diffEditorWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { getWindow, h } from '../../../../base/browser/dom.js';
import { IBoundarySashes } from '../../../../base/browser/ui/sash/sash.js';
import { findLast } from '../../../../base/common/arraysFind.js';
import { BugIndicatingError, onUnexpectedError } from '../../../../base/common/errors.js';
import { Event } from '../../../../base/common/event.js';
import { readHotReloadableExport } from '../../../../base/common/hotReloadHelpers.js';
import { toDisposable } from '../../../../base/common/lifecycle.js';
import { IObservable, ITransaction, autorun, autorunWithStore, derived, derivedDisposable, disposableObservableValue, observableFromEvent, observableValue, recomputeInitiallyAndOnChange, subtransaction, transaction } from '../../../../base/common/observable.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { bindContextKey } from '../../../../platform/observable/common/platformObservableUtils.js';
import { IEditorProgressService } from '../../../../platform/progress/common/progress.js';
import { IDiffEditorOptions } from '../../../common/config/editorOptions.js';
import { IDimension } from '../../../common/core/2d/dimension.js';
import { LineRange } from '../../../common/core/ranges/lineRange.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { CursorChangeReason, ICursorPositionChangedEvent } from '../../../common/cursorEvents.js';
import { IDiffComputationResult, ILineChange } from '../../../common/diff/legacyLinesDiffComputer.js';
import { LineRangeMapping, RangeMapping } from '../../../common/diff/rangeMapping.js';
import { EditorType, IDiffEditorModel, IDiffEditorViewModel, IDiffEditorViewState } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { IIdentifiedSingleEditOperation } from '../../../common/model.js';
import { IEditorConstructionOptions } from '../../config/editorConfiguration.js';
import { ICodeEditor, IDiffEditor, IDiffEditorConstructionOptions } from '../../editorBrowser.js';
import { EditorExtensionsRegistry, IDiffEditorContributionDescription } from '../../editorExtensions.js';
import { ICodeEditorService } from '../../services/codeEditorService.js';
import { StableEditorScrollState } from '../../stableEditorScroll.js';
import { CodeEditorWidget, ICodeEditorWidgetOptions } from '../codeEditor/codeEditorWidget.js';
import { AccessibleDiffViewer, AccessibleDiffViewerModelFromEditors } from './components/accessibleDiffViewer.js';
import { DiffEditorDecorations } from './components/diffEditorDecorations.js';
import { DiffEditorEditors } from './components/diffEditorEditors.js';
import { DiffEditorSash, SashLayout } from './components/diffEditorSash.js';
import { DiffEditorViewZones } from './components/diffEditorViewZones/diffEditorViewZones.js';
import { DelegatingEditor } from './delegatingEditorImpl.js';
import { DiffEditorOptions } from './diffEditorOptions.js';
import { DiffEditorViewModel, DiffMapping, DiffState } from './diffEditorViewModel.js';
import { DiffEditorGutter } from './features/gutterFeature.js';
import { HideUnchangedRegionsFeature } from './features/hideUnchangedRegionsFeature.js';
import { MovedBlocksLinesFeature } from './features/movedBlocksLinesFeature.js';
import { OverviewRulerFeature } from './features/overviewRulerFeature.js';
import { RevertButtonsFeature } from './features/revertButtonsFeature.js';
import './style.css';
import { CSSStyle, ObservableElementSizeObserver, RefCounted, applyStyle, applyViewZones, translatePosition } from './utils.js';

export interface IDiffCodeEditorWidgetOptions {
	originalEditor?: ICodeEditorWidgetOptions;
	modifiedEditor?: ICodeEditorWidgetOptions;
}

export class DiffEditorWidget extends DelegatingEditor implements IDiffEditor {
	public static ENTIRE_DIFF_OVERVIEW_WIDTH = OverviewRulerFeature.ENTIRE_DIFF_OVERVIEW_WIDTH;

	private readonly elements;
	private readonly _diffModelSrc;
	private readonly _diffModel;
	public readonly onDidChangeModel;

	public get onDidContentSizeChange() { return this._editors.onDidContentSizeChange; }

	private readonly _contextKeyService;
	private readonly _instantiationService;
	private readonly _rootSizeObserver: ObservableElementSizeObserver;


	private readonly _sashLayout: SashLayout;
	private readonly _sash: IObservable<DiffEditorSash | undefined>;
	private readonly _boundarySashes;

	private _accessibleDiffViewerShouldBeVisible;
	private _accessibleDiffViewerVisible;
	private readonly _accessibleDiffViewer: IObservable<AccessibleDiffViewer>;
	private readonly _options: DiffEditorOptions;
	private readonly _editors: DiffEditorEditors;

	private readonly _overviewRulerPart: IObservable<OverviewRulerFeature | undefined>;
	private readonly _movedBlocksLinesPart;

	private readonly _gutter: IObservable<DiffEditorGutter | undefined>;

	public get collapseUnchangedRegions() { return this._options.hideUnchangedRegions.get(); }

	constructor(
		private readonly _domElement: HTMLElement,
		options: Readonly<IDiffEditorConstructionOptions>,
		codeEditorWidgetOptions: IDiffCodeEditorWidgetOptions,
		@IContextKeyService private readonly _parentContextKeyService: IContextKeyService,
		@IInstantiationService private readonly _parentInstantiationService: IInstantiationService,
		@ICodeEditorService private readonly _codeEditorService: ICodeEditorService,
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService,
		@IEditorProgressService private readonly _editorProgressService: IEditorProgressService,
	) {
		super();
		this.elements = h('div.monaco-diff-editor.side-by-side', { style: { position: 'relative', height: '100%' } }, [
			h('div.editor.original@original', { style: { position: 'absolute', height: '100%', } }),
			h('div.editor.modified@modified', { style: { position: 'absolute', height: '100%', } }),
			h('div.accessibleDiffViewer@accessibleDiffViewer', { style: { position: 'absolute', height: '100%' } }),
		]);
		this._diffModelSrc = this._register(disposableObservableValue<RefCounted<DiffEditorViewModel> | undefined>(this, undefined));
		this._diffModel = derived<DiffEditorViewModel | undefined>(this, reader => this._diffModelSrc.read(reader)?.object);
		this.onDidChangeModel = Event.fromObservableLight(this._diffModel);
		this._contextKeyService = this._register(this._parentContextKeyService.createScoped(this._domElement));
		this._instantiationService = this._register(this._parentInstantiationService.createChild(
			new ServiceCollection([IContextKeyService, this._contextKeyService])
		));
		this._boundarySashes = observableValue<IBoundarySashes | undefined>(this, undefined);
		this._accessibleDiffViewerShouldBeVisible = observableValue(this, false);
		this._accessibleDiffViewerVisible = derived(this, reader =>
			this._options.onlyShowAccessibleDiffViewer.read(reader)
				? true
				: this._accessibleDiffViewerShouldBeVisible.read(reader)
		);
		this._movedBlocksLinesPart = observableValue<MovedBlocksLinesFeature | undefined>(this, undefined);
		this._layoutInfo = derived(this, reader => {
			const fullWidth = this._rootSizeObserver.width.read(reader);
			const fullHeight = this._rootSizeObserver.height.read(reader);

			if (this._rootSizeObserver.automaticLayout) {
				this.elements.root.style.height = '100%';
			} else {
				this.elements.root.style.height = fullHeight + 'px';
			}

			const sash = this._sash.read(reader);

			const gutter = this._gutter.read(reader);
			const gutterWidth = gutter?.width.read(reader) ?? 0;

			const overviewRulerPartWidth = this._overviewRulerPart.read(reader)?.width ?? 0;

			let originalLeft: number, originalWidth: number, modifiedLeft: number, modifiedWidth: number, gutterLeft: number;

			const sideBySide = !!sash;
			if (sideBySide) {
				const sashLeft = sash.sashLeft.read(reader);
				const movedBlocksLinesWidth = this._movedBlocksLinesPart.read(reader)?.width.read(reader) ?? 0;

				originalLeft = 0;
				originalWidth = sashLeft - gutterWidth - movedBlocksLinesWidth;

				gutterLeft = sashLeft - gutterWidth;

				modifiedLeft = sashLeft;
				modifiedWidth = fullWidth - modifiedLeft - overviewRulerPartWidth;
			} else {
				gutterLeft = 0;

				const shouldHideOriginalLineNumbers = this._options.inlineViewHideOriginalLineNumbers.read(reader);
				originalLeft = gutterWidth;
				if (shouldHideOriginalLineNumbers) {
					originalWidth = 0;
				} else {
					originalWidth = Math.max(5, this._editors.originalObs.layoutInfoDecorationsLeft.read(reader));
				}

				modifiedLeft = gutterWidth + originalWidth;
				modifiedWidth = fullWidth - modifiedLeft - overviewRulerPartWidth;
			}

			this.elements.original.style.left = originalLeft + 'px';
			this.elements.original.style.width = originalWidth + 'px';
			this._editors.original.layout({ width: originalWidth, height: fullHeight }, true);

			gutter?.layout(gutterLeft);

			this.elements.modified.style.left = modifiedLeft + 'px';
			this.elements.modified.style.width = modifiedWidth + 'px';
			this._editors.modified.layout({ width: modifiedWidth, height: fullHeight }, true);

			return {
				modifiedEditor: this._editors.modified.getLayoutInfo(),
				originalEditor: this._editors.original.getLayoutInfo(),
			};
		});
		this._diffValue = this._diffModel.map((m, r) => m?.diff.read(r));
		this.onDidUpdateDiff = Event.fromObservableLight(this._diffValue);
		this._codeEditorService.willCreateDiffEditor();

		this._contextKeyService.createKey('isInDiffEditor', true);

		this._domElement.appendChild(this.elements.root);
		this._register(toDisposable(() => this.elements.root.remove()));

		this._rootSizeObserver = this._register(new ObservableElementSizeObserver(this.elements.root, options.dimension));
		this._rootSizeObserver.setAutomaticLayout(options.automaticLayout ?? false);

		this._options = this._instantiationService.createInstance(DiffEditorOptions, options);
		this._register(autorun(reader => {
			this._options.setWidth(this._rootSizeObserver.width.read(reader));
		}));

		this._contextKeyService.createKey(EditorContextKeys.isEmbeddedDiffEditor.key, false);
		this._register(bindContextKey(EditorContextKeys.isEmbeddedDiffEditor, this._contextKeyService,
			reader => this._options.isInEmbeddedEditor.read(reader)
		));
		this._register(bindContextKey(EditorContextKeys.comparingMovedCode, this._contextKeyService,
			reader => !!this._diffModel.read(reader)?.movedTextToCompare.read(reader)
		));
		this._register(bindContextKey(EditorContextKeys.diffEditorRenderSideBySideInlineBreakpointReached, this._contextKeyService,
			reader => this._options.couldShowInlineViewBecauseOfSize.read(reader)
		));
		this._register(bindContextKey(EditorContextKeys.diffEditorInlineMode, this._contextKeyService,
			reader => !this._options.renderSideBySide.read(reader)
		));

		this._register(bindContextKey(EditorContextKeys.hasChanges, this._contextKeyService,
			reader => (this._diffModel.read(reader)?.diff.read(reader)?.mappings.length ?? 0) > 0
		));

		this._editors = this._register(this._instantiationService.createInstance(
			DiffEditorEditors,
			this.elements.original,
			this.elements.modified,
			this._options,
			codeEditorWidgetOptions,
			(i, c, o, o2) => this._createInnerEditor(i, c, o, o2),
		));

		this._register(bindContextKey(EditorContextKeys.diffEditorOriginalWritable, this._contextKeyService,
			reader => this._options.originalEditable.read(reader)
		));
		this._register(bindContextKey(EditorContextKeys.diffEditorModifiedWritable, this._contextKeyService,
			reader => !this._options.readOnly.read(reader)
		));
		this._register(bindContextKey(EditorContextKeys.diffEditorOriginalUri, this._contextKeyService,
			reader => this._diffModel.read(reader)?.model.original.uri.toString() ?? ''
		));
		this._register(bindContextKey(EditorContextKeys.diffEditorModifiedUri, this._contextKeyService,
			reader => this._diffModel.read(reader)?.model.modified.uri.toString() ?? ''
		));

		this._overviewRulerPart = derivedDisposable(this, reader =>
			!this._options.renderOverviewRuler.read(reader)
				? undefined
				: this._instantiationService.createInstance(
					readHotReloadableExport(OverviewRulerFeature, reader),
					this._editors,
					this.elements.root,
					this._diffModel,
					this._rootSizeObserver.width,
					this._rootSizeObserver.height,
					this._layoutInfo.map(i => i.modifiedEditor),
				)
		).recomputeInitiallyAndOnChange(this._store);

		const dimensions = {
			height: this._rootSizeObserver.height,
			width: this._rootSizeObserver.width.map((w, reader) => w - (this._overviewRulerPart.read(reader)?.width ?? 0)),
		};

		this._sashLayout = new SashLayout(this._options, dimensions);

		this._sash = derivedDisposable(this, reader => {
			const showSash = this._options.renderSideBySide.read(reader);
			this.elements.root.classList.toggle('side-by-side', showSash);
			return !showSash ? undefined : new DiffEditorSash(
				this.elements.root,
				dimensions,
				this._options.enableSplitViewResizing,
				this._boundarySashes,
				this._sashLayout.sashLeft,
				() => this._sashLayout.resetSash(),
			);
		}).recomputeInitiallyAndOnChange(this._store);

		const unchangedRangesFeature = derivedDisposable(this, reader => /** @description UnchangedRangesFeature */
			this._instantiationService.createInstance(
				readHotReloadableExport(HideUnchangedRegionsFeature, reader),
				this._editors, this._diffModel, this._options
			)
		).recomputeInitiallyAndOnChange(this._store);

		derivedDisposable(this, reader => /** @description DiffEditorDecorations */
			this._instantiationService.createInstance(
				readHotReloadableExport(DiffEditorDecorations, reader),
				this._editors, this._diffModel, this._options, this,
			)
		).recomputeInitiallyAndOnChange(this._store);

		const origViewZoneIdsToIgnore = new Set<string>();
		const modViewZoneIdsToIgnore = new Set<string>();
		let isUpdatingViewZones = false;
		const viewZoneManager = derivedDisposable(this, reader => /** @description ViewZoneManager */
			this._instantiationService.createInstance(
				readHotReloadableExport(DiffEditorViewZones, reader),
				getWindow(this._domElement),
				this._editors,
				this._diffModel,
				this._options,
				this,
				() => isUpdatingViewZones || unchangedRangesFeature.read(undefined).isUpdatingHiddenAreas,
				origViewZoneIdsToIgnore,
				modViewZoneIdsToIgnore
			)
		).recomputeInitiallyAndOnChange(this._store);

		const originalViewZones = derived(this, (reader) => { /** @description originalViewZones */
			const orig = viewZoneManager.read(reader).viewZones.read(reader).orig;
			const orig2 = unchangedRangesFeature.read(reader).viewZones.read(reader).origViewZones;
			return orig.concat(orig2);
		});
		const modifiedViewZones = derived(this, (reader) => { /** @description modifiedViewZones */
			const mod = viewZoneManager.read(reader).viewZones.read(reader).mod;
			const mod2 = unchangedRangesFeature.read(reader).viewZones.read(reader).modViewZones;
			return mod.concat(mod2);
		});
		this._register(applyViewZones(this._editors.original, originalViewZones, isUpdatingOrigViewZones => {
			isUpdatingViewZones = isUpdatingOrigViewZones;
		}, origViewZoneIdsToIgnore));
		let scrollState: StableEditorScrollState | undefined;
		this._register(applyViewZones(this._editors.modified, modifiedViewZones, isUpdatingModViewZones => {
			isUpdatingViewZones = isUpdatingModViewZones;
			if (isUpdatingViewZones) {
				scrollState = StableEditorScrollState.capture(this._editors.modified);
			} else {
				scrollState?.restore(this._editors.modified);
				scrollState = undefined;
			}
		}, modViewZoneIdsToIgnore));

		this._accessibleDiffViewer = derivedDisposable(this, reader =>
			this._instantiationService.createInstance(
				readHotReloadableExport(AccessibleDiffViewer, reader),
				this.elements.accessibleDiffViewer,
				this._accessibleDiffViewerVisible,
				(visible, tx) => this._accessibleDiffViewerShouldBeVisible.set(visible, tx),
				this._options.onlyShowAccessibleDiffViewer.map(v => !v),
				this._rootSizeObserver.width,
				this._rootSizeObserver.height,
				this._diffModel.map((m, r) => m?.diff.read(r)?.mappings.map(m => m.lineRangeMapping)),
				new AccessibleDiffViewerModelFromEditors(this._editors),
			)
		).recomputeInitiallyAndOnChange(this._store);

		const visibility = this._accessibleDiffViewerVisible.map<CSSStyle['visibility']>(v => v ? 'hidden' : 'visible');
		this._register(applyStyle(this.elements.modified, { visibility }));
		this._register(applyStyle(this.elements.original, { visibility }));

		this._createDiffEditorContributions();

		this._codeEditorService.addDiffEditor(this);
		this._register(toDisposable(() => {
			this._codeEditorService.removeDiffEditor(this);
		}));

		this._gutter = derivedDisposable(this, reader => {
			return this._options.shouldRenderGutterMenu.read(reader)
				? this._instantiationService.createInstance(
					readHotReloadableExport(DiffEditorGutter, reader),
					this.elements.root,
					this._diffModel,
					this._editors,
					this._options,
					this._sashLayout,
					this._boundarySashes,
				)
				: undefined;
		});

		this._register(recomputeInitiallyAndOnChange(this._layoutInfo));

		derivedDisposable(this, reader => /** @description MovedBlocksLinesPart */
			new (readHotReloadableExport(MovedBlocksLinesFeature, reader))(
				this.elements.root,
				this._diffModel,
				this._layoutInfo.map(i => i.originalEditor),
				this._layoutInfo.map(i => i.modifiedEditor),
				this._editors,
			)
		).recomputeInitiallyAndOnChange(this._store, value => {
			// This is to break the layout info <-> moved blocks lines part dependency cycle.
			this._movedBlocksLinesPart.set(value, undefined);
		});

		this._register(Event.runAndSubscribe(this._editors.modified.onDidChangeCursorPosition, e => this._handleCursorPositionChange(e, true)));
		this._register(Event.runAndSubscribe(this._editors.original.onDidChangeCursorPosition, e => this._handleCursorPositionChange(e, false)));

		const isInitializingDiff = this._diffModel.map(this, (m, reader) => {
			/** @isInitializingDiff isDiffUpToDate */
			if (!m) { return undefined; }
			return m.diff.read(reader) === undefined && !m.isDiffUpToDate.read(reader);
		});
		this._register(autorunWithStore((reader, store) => {
			/** @description DiffEditorWidgetHelper.ShowProgress */
			if (isInitializingDiff.read(reader) === true) {
				const r = this._editorProgressService.show(true, 1000);
				store.add(toDisposable(() => r.done()));
			}
		}));

		this._register(autorunWithStore((reader, store) => {
			store.add(new (readHotReloadableExport(RevertButtonsFeature, reader))(this._editors, this._diffModel, this._options, this));
		}));

		this._register(autorunWithStore((reader, store) => {
			const model = this._diffModel.read(reader);
			if (!model) { return; }
			for (const m of [model.model.original, model.model.modified]) {
				store.add(m.onWillDispose(e => {
					onUnexpectedError(new BugIndicatingError('TextModel got disposed before DiffEditorWidget model got reset'));
					this.setModel(null);
				}));
			}
		}));

		this._register(autorun(reader => {
			this._options.setModel(this._diffModel.read(reader));
		}));
	}

	public getViewWidth(): number {
		return this._rootSizeObserver.width.get();
	}

	public getContentHeight() {
		return this._editors.modified.getContentHeight();
	}

	protected _createInnerEditor(instantiationService: IInstantiationService, container: HTMLElement, options: Readonly<IEditorConstructionOptions>, editorWidgetOptions: ICodeEditorWidgetOptions): CodeEditorWidget {
		const editor = instantiationService.createInstance(CodeEditorWidget, container, options, editorWidgetOptions);
		return editor;
	}

	private readonly _layoutInfo;

	private _createDiffEditorContributions() {
		const contributions: IDiffEditorContributionDescription[] = EditorExtensionsRegistry.getDiffEditorContributions();
		for (const desc of contributions) {
			try {
				this._register(this._instantiationService.createInstance(desc.ctor, this));
			} catch (err) {
				onUnexpectedError(err);
			}
		}
	}

	protected override get _targetEditor(): CodeEditorWidget { return this._editors.modified; }

	override getEditorType(): string { return EditorType.IDiffEditor; }

	override onVisible(): void {
		// TODO: Only compute diffs when diff editor is visible
		this._editors.original.onVisible();
		this._editors.modified.onVisible();
	}

	override onHide(): void {
		this._editors.original.onHide();
		this._editors.modified.onHide();
	}

	override layout(dimension?: IDimension | undefined): void {
		this._rootSizeObserver.observe(dimension);
	}

	override hasTextFocus(): boolean { return this._editors.original.hasTextFocus() || this._editors.modified.hasTextFocus(); }

	public override saveViewState(): IDiffEditorViewState {
		const originalViewState = this._editors.original.saveViewState();
		const modifiedViewState = this._editors.modified.saveViewState();
		return {
			original: originalViewState,
			modified: modifiedViewState,
			modelState: this._diffModel.get()?.serializeState(),
		};
	}

	public override restoreViewState(s: IDiffEditorViewState): void {
		if (s && s.original && s.modified) {
			const diffEditorState = s;
			this._editors.original.restoreViewState(diffEditorState.original);
			this._editors.modified.restoreViewState(diffEditorState.modified);
			if (diffEditorState.modelState) {
				// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
				this._diffModel.get()?.restoreSerializedState(diffEditorState.modelState as any);
			}
		}
	}

	public handleInitialized(): void {
		this._editors.original.handleInitialized();
		this._editors.modified.handleInitialized();
	}

	public createViewModel(model: IDiffEditorModel): IDiffEditorViewModel {
		return this._instantiationService.createInstance(DiffEditorViewModel, model, this._options);
	}

	override getModel(): IDiffEditorModel | null { return this._diffModel.get()?.model ?? null; }

	override setModel(model: IDiffEditorModel | null | IDiffEditorViewModel): void {
		const vm = !model ? null
			: ('model' in model) ? RefCounted.create(model).createNewRef(this)
				: RefCounted.create(this.createViewModel(model), this);
		this.setDiffModel(vm);
	}

	setDiffModel(viewModel: RefCounted<IDiffEditorViewModel> | null, tx?: ITransaction): void {
		const currentModel = this._diffModel.get();

		if (!viewModel && currentModel) {
			// Transitioning from a model to no-model
			this._accessibleDiffViewer.get().close();
		}

		if (this._diffModel.get() !== viewModel?.object) {
			subtransaction(tx, tx => {
				const vm = viewModel?.object;
				/** @description DiffEditorWidget.setModel */
				observableFromEvent.batchEventsGlobally(tx, () => {
					this._editors.original.setModel(vm ? vm.model.original : null);
					this._editors.modified.setModel(vm ? vm.model.modified : null);
				});
				const prevValueRef = this._diffModelSrc.get()?.createNewRef(this);
				this._diffModelSrc.set(viewModel?.createNewRef(this) as RefCounted<DiffEditorViewModel> | undefined, tx);
				setTimeout(() => {
					// async, so that this runs after the transaction finished.
					// TODO: use the transaction to schedule disposal
					prevValueRef?.dispose();
				}, 0);
			});
		}
	}

	/**
	 * @param changedOptions Only has values for top-level options that have actually changed.
	 */
	override updateOptions(changedOptions: IDiffEditorOptions): void {
		this._options.updateOptions(changedOptions);
	}

	getDomNode(): HTMLElement { return this.elements.root; }
	getContainerDomNode(): HTMLElement { return this._domElement; }
	getOriginalEditor(): ICodeEditor { return this._editors.original; }
	getModifiedEditor(): ICodeEditor { return this._editors.modified; }

	setBoundarySashes(sashes: IBoundarySashes): void {
		this._boundarySashes.set(sashes, undefined);
	}

	private readonly _diffValue;
	readonly onDidUpdateDiff: Event<void>;

	get ignoreTrimWhitespace(): boolean { return this._options.ignoreTrimWhitespace.get(); }

	get maxComputationTime(): number { return this._options.maxComputationTimeMs.get(); }

	get renderSideBySide(): boolean { return this._options.renderSideBySide.get(); }

	/**
	 * @deprecated Use `this.getDiffComputationResult().changes2` instead.
	 */
	getLineChanges(): ILineChange[] | null {
		const diffState = this._diffModel.get()?.diff.get();
		if (!diffState) { return null; }
		return toLineChanges(diffState);
	}

	getDiffComputationResult(): IDiffComputationResult | null {
		const diffState = this._diffModel.get()?.diff.get();
		if (!diffState) { return null; }

		return {
			changes: this.getLineChanges()!,
			changes2: diffState.mappings.map(m => m.lineRangeMapping),
			identical: diffState.identical,
			quitEarly: diffState.quitEarly,
		};
	}

	revert(diff: LineRangeMapping): void {
		const model = this._diffModel.get();
		if (!model || !model.isDiffUpToDate.get()) { return; }

		this._editors.modified.pushUndoStop();
		this._editors.modified.executeEdits('diffEditor', [
			{
				range: diff.modified.toExclusiveRange(),
				text: model.model.original.getValueInRange(diff.original.toExclusiveRange())
			}
		]);
		this._editors.modified.pushUndoStop();
	}

	revertRangeMappings(diffs: RangeMapping[]): void {
		const model = this._diffModel.get();
		if (!model || !model.isDiffUpToDate.get()) { return; }

		const changes: IIdentifiedSingleEditOperation[] = diffs.map<IIdentifiedSingleEditOperation>(c => ({
			range: c.modifiedRange,
			text: model.model.original.getValueInRange(c.originalRange)
		}));

		this._editors.modified.pushUndoStop();
		this._editors.modified.executeEdits('diffEditor', changes);
		this._editors.modified.pushUndoStop();
	}

	revertFocusedRangeMappings() {
		const model = this._diffModel.get();
		if (!model || !model.isDiffUpToDate.get()) { return; }

		const diffs = this._diffModel.get()?.diff.get()?.mappings;
		if (!diffs || diffs.length === 0) { return; }

		const modifiedEditor = this._editors.modified;
		if (!modifiedEditor.hasTextFocus()) { return; }

		const curLineNumber = modifiedEditor.getPosition()!.lineNumber;
		const selection = modifiedEditor.getSelection();
		const selectedRange = LineRange.fromRange(selection || new Range(curLineNumber, 0, curLineNumber, 0));
		const diffsToRevert = diffs.filter(d => {
			return d.lineRangeMapping.modified.intersect(selectedRange);
		});

		modifiedEditor.pushUndoStop();
		modifiedEditor.executeEdits('diffEditor', diffsToRevert.map(d => (
			{
				range: d.lineRangeMapping.modified.toExclusiveRange(),
				text: model.model.original.getValueInRange(d.lineRangeMapping.original.toExclusiveRange())
			}
		)));
		modifiedEditor.pushUndoStop();
	}


	private _goTo(diff: DiffMapping): void {
		this._editors.modified.setPosition(new Position(diff.lineRangeMapping.modified.startLineNumber, 1));
		this._editors.modified.revealRangeInCenter(diff.lineRangeMapping.modified.toExclusiveRange());
	}

	goToDiff(target: 'previous' | 'next'): void {
		const diffs = this._diffModel.get()?.diff.get()?.mappings;
		if (!diffs || diffs.length === 0) {
			return;
		}

		const curLineNumber = this._editors.modified.getPosition()!.lineNumber;
		let diff: DiffMapping | undefined;
		if (target === 'next') {
			const modifiedLineCount = this._editors.modified.getModel()!.getLineCount();
			if (modifiedLineCount === curLineNumber) {
				diff = diffs[0];
			} else {
				diff = diffs.find(d => d.lineRangeMapping.modified.startLineNumber > curLineNumber) ?? diffs[0];
			}
		} else {
			diff = findLast(diffs, d => d.lineRangeMapping.modified.startLineNumber < curLineNumber) ?? diffs[diffs.length - 1];
		}
		this._goTo(diff);

		if (diff.lineRangeMapping.modified.isEmpty) {
			this._accessibilitySignalService.playSignal(AccessibilitySignal.diffLineDeleted, { source: 'diffEditor.goToDiff' });
		} else if (diff.lineRangeMapping.original.isEmpty) {
			this._accessibilitySignalService.playSignal(AccessibilitySignal.diffLineInserted, { source: 'diffEditor.goToDiff' });
		} else if (diff) {
			this._accessibilitySignalService.playSignal(AccessibilitySignal.diffLineModified, { source: 'diffEditor.goToDiff' });
		}
	}

	revealFirstDiff(): void {
		const diffModel = this._diffModel.get();
		if (!diffModel) {
			return;
		}
		// wait for the diff computation to finish
		this.waitForDiff().then(() => {
			const diffs = diffModel.diff.get()?.mappings;
			if (!diffs || diffs.length === 0) {
				return;
			}
			this._goTo(diffs[0]);
		});
	}

	accessibleDiffViewerNext(): void { this._accessibleDiffViewer.get().next(); }

	accessibleDiffViewerPrev(): void { this._accessibleDiffViewer.get().prev(); }

	async waitForDiff(): Promise<void> {
		const diffModel = this._diffModel.get();
		if (!diffModel) { return; }
		await diffModel.waitForDiff();
	}

	mapToOtherSide(): { destination: CodeEditorWidget; destinationSelection: Range | undefined } {
		const isModifiedFocus = this._editors.modified.hasWidgetFocus();
		const source = isModifiedFocus ? this._editors.modified : this._editors.original;
		const destination = isModifiedFocus ? this._editors.original : this._editors.modified;

		let destinationSelection: Range | undefined;

		const sourceSelection = source.getSelection();
		if (sourceSelection) {
			const mappings = this._diffModel.get()?.diff.get()?.mappings.map(m => isModifiedFocus ? m.lineRangeMapping.flip() : m.lineRangeMapping);
			if (mappings) {
				const newRange1 = translatePosition(sourceSelection.getStartPosition(), mappings);
				const newRange2 = translatePosition(sourceSelection.getEndPosition(), mappings);
				destinationSelection = Range.plusRange(newRange1, newRange2);
			}
		}
		return { destination, destinationSelection };
	}

	switchSide(): void {
		const { destination, destinationSelection } = this.mapToOtherSide();
		destination.focus();
		if (destinationSelection) {
			destination.setSelection(destinationSelection);
		}
	}

	exitCompareMove(): void {
		const model = this._diffModel.get();
		if (!model) { return; }
		model.movedTextToCompare.set(undefined, undefined);
	}

	collapseAllUnchangedRegions(): void {
		const unchangedRegions = this._diffModel.get()?.unchangedRegions.get();
		if (!unchangedRegions) { return; }
		transaction(tx => {
			for (const region of unchangedRegions) {
				region.collapseAll(tx);
			}
		});
	}

	showAllUnchangedRegions(): void {
		const unchangedRegions = this._diffModel.get()?.unchangedRegions.get();
		if (!unchangedRegions) { return; }
		transaction(tx => {
			for (const region of unchangedRegions) {
				region.showAll(tx);
			}
		});
	}

	private _handleCursorPositionChange(e: ICursorPositionChangedEvent | undefined, isModifiedEditor: boolean): void {
		if (e?.reason === CursorChangeReason.Explicit) {
			const diff = this._diffModel.get()?.diff.get()?.mappings.find(m => isModifiedEditor ? m.lineRangeMapping.modified.contains(e.position.lineNumber) : m.lineRangeMapping.original.contains(e.position.lineNumber));
			if (diff?.lineRangeMapping.modified.isEmpty) {
				this._accessibilitySignalService.playSignal(AccessibilitySignal.diffLineDeleted, { source: 'diffEditor.cursorPositionChanged' });
			} else if (diff?.lineRangeMapping.original.isEmpty) {
				this._accessibilitySignalService.playSignal(AccessibilitySignal.diffLineInserted, { source: 'diffEditor.cursorPositionChanged' });
			} else if (diff) {
				this._accessibilitySignalService.playSignal(AccessibilitySignal.diffLineModified, { source: 'diffEditor.cursorPositionChanged' });
			}
		}
	}
}

export function toLineChanges(state: DiffState): ILineChange[] {
	return state.mappings.map(x => {
		const m = x.lineRangeMapping;
		let originalStartLineNumber: number;
		let originalEndLineNumber: number;
		let modifiedStartLineNumber: number;
		let modifiedEndLineNumber: number;
		let innerChanges = m.innerChanges;

		if (m.original.isEmpty) {
			// Insertion
			originalStartLineNumber = m.original.startLineNumber - 1;
			originalEndLineNumber = 0;
			innerChanges = undefined;
		} else {
			originalStartLineNumber = m.original.startLineNumber;
			originalEndLineNumber = m.original.endLineNumberExclusive - 1;
		}

		if (m.modified.isEmpty) {
			// Deletion
			modifiedStartLineNumber = m.modified.startLineNumber - 1;
			modifiedEndLineNumber = 0;
			innerChanges = undefined;
		} else {
			modifiedStartLineNumber = m.modified.startLineNumber;
			modifiedEndLineNumber = m.modified.endLineNumberExclusive - 1;
		}

		return {
			originalStartLineNumber,
			originalEndLineNumber,
			modifiedStartLineNumber,
			modifiedEndLineNumber,
			charChanges: innerChanges?.map(m => ({
				originalStartLineNumber: m.originalRange.startLineNumber,
				originalStartColumn: m.originalRange.startColumn,
				originalEndLineNumber: m.originalRange.endLineNumber,
				originalEndColumn: m.originalRange.endColumn,
				modifiedStartLineNumber: m.modifiedRange.startLineNumber,
				modifiedStartColumn: m.modifiedRange.startColumn,
				modifiedEndLineNumber: m.modifiedRange.endLineNumber,
				modifiedEndColumn: m.modifiedRange.endColumn,
			}))
		};
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/diffProviderFactoryService.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/diffProviderFactoryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService, createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { LineRange } from '../../../common/core/ranges/lineRange.js';
import { IDocumentDiff, IDocumentDiffProvider, IDocumentDiffProviderOptions } from '../../../common/diff/documentDiffProvider.js';
import { DetailedLineRangeMapping, RangeMapping } from '../../../common/diff/rangeMapping.js';
import { ITextModel } from '../../../common/model.js';
import { DiffAlgorithmName, IEditorWorkerService } from '../../../common/services/editorWorker.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';

export const IDiffProviderFactoryService = createDecorator<IDiffProviderFactoryService>('diffProviderFactoryService');

export interface IDocumentDiffFactoryOptions {
	readonly diffAlgorithm?: 'legacy' | 'advanced';
}

export interface IDiffProviderFactoryService {
	readonly _serviceBrand: undefined;
	createDiffProvider(options: IDocumentDiffFactoryOptions): IDocumentDiffProvider;
}

export class WorkerBasedDiffProviderFactoryService implements IDiffProviderFactoryService {
	readonly _serviceBrand: undefined;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) { }

	createDiffProvider(options: IDocumentDiffFactoryOptions): IDocumentDiffProvider {
		return this.instantiationService.createInstance(WorkerBasedDocumentDiffProvider, options);
	}
}

registerSingleton(IDiffProviderFactoryService, WorkerBasedDiffProviderFactoryService, InstantiationType.Delayed);

export class WorkerBasedDocumentDiffProvider implements IDocumentDiffProvider, IDisposable {
	private onDidChangeEventEmitter = new Emitter<void>();
	public readonly onDidChange: Event<void> = this.onDidChangeEventEmitter.event;

	private diffAlgorithm: DiffAlgorithmName | IDocumentDiffProvider = 'advanced';
	private diffAlgorithmOnDidChangeSubscription: IDisposable | undefined = undefined;

	private static readonly diffCache = new Map<string, { result: IDocumentDiff; context: string }>();

	constructor(
		options: IWorkerBasedDocumentDiffProviderOptions,
		@IEditorWorkerService private readonly editorWorkerService: IEditorWorkerService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
	) {
		this.setOptions(options);
	}

	public dispose(): void {
		this.diffAlgorithmOnDidChangeSubscription?.dispose();
	}

	async computeDiff(original: ITextModel, modified: ITextModel, options: IDocumentDiffProviderOptions, cancellationToken: CancellationToken): Promise<IDocumentDiff> {
		if (typeof this.diffAlgorithm !== 'string') {
			return this.diffAlgorithm.computeDiff(original, modified, options, cancellationToken);
		}

		if (original.isDisposed() || modified.isDisposed()) {
			// TODO@hediet
			return {
				changes: [],
				identical: true,
				quitEarly: false,
				moves: [],
			};
		}

		// This significantly speeds up the case when the original file is empty
		if (original.getLineCount() === 1 && original.getLineMaxColumn(1) === 1) {
			if (modified.getLineCount() === 1 && modified.getLineMaxColumn(1) === 1) {
				return {
					changes: [],
					identical: true,
					quitEarly: false,
					moves: [],
				};
			}

			return {
				changes: [
					new DetailedLineRangeMapping(
						new LineRange(1, 2),
						new LineRange(1, modified.getLineCount() + 1),
						[
							new RangeMapping(
								original.getFullModelRange(),
								modified.getFullModelRange(),
							)
						]
					)
				],
				identical: false,
				quitEarly: false,
				moves: [],
			};
		}

		const uriKey = JSON.stringify([original.uri.toString(), modified.uri.toString()]);
		const context = JSON.stringify([original.id, modified.id, original.getAlternativeVersionId(), modified.getAlternativeVersionId(), JSON.stringify(options)]);
		const c = WorkerBasedDocumentDiffProvider.diffCache.get(uriKey);
		if (c && c.context === context) {
			return c.result;
		}

		const sw = StopWatch.create();
		const result = await this.editorWorkerService.computeDiff(original.uri, modified.uri, options, this.diffAlgorithm);
		const timeMs = sw.elapsed();

		this.telemetryService.publicLog2<{
			timeMs: number;
			timedOut: boolean;
			detectedMoves: number;
		}, {
			owner: 'hediet';

			timeMs: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'To understand if the new diff algorithm is slower/faster than the old one' };
			timedOut: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'To understand how often the new diff algorithm times out' };
			detectedMoves: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'To understand how often the new diff algorithm detects moves' };

			comment: 'This event gives insight about the performance of the new diff algorithm.';
		}>('diffEditor.computeDiff', {
			timeMs,
			timedOut: result?.quitEarly ?? true,
			detectedMoves: options.computeMoves ? (result?.moves.length ?? 0) : -1,
		});

		if (cancellationToken.isCancellationRequested) {
			// Text models might be disposed!
			return {
				changes: [],
				identical: false,
				quitEarly: true,
				moves: [],
			};
		}

		if (!result) {
			throw new Error('no diff result available');
		}

		// max 10 items in cache
		if (WorkerBasedDocumentDiffProvider.diffCache.size > 10) {
			WorkerBasedDocumentDiffProvider.diffCache.delete(WorkerBasedDocumentDiffProvider.diffCache.keys().next().value!);
		}

		WorkerBasedDocumentDiffProvider.diffCache.set(uriKey, { result, context });
		return result;
	}

	public setOptions(newOptions: IWorkerBasedDocumentDiffProviderOptions): void {
		let didChange = false;
		if (newOptions.diffAlgorithm) {
			if (this.diffAlgorithm !== newOptions.diffAlgorithm) {
				this.diffAlgorithmOnDidChangeSubscription?.dispose();
				this.diffAlgorithmOnDidChangeSubscription = undefined;

				this.diffAlgorithm = newOptions.diffAlgorithm;
				if (typeof newOptions.diffAlgorithm !== 'string') {
					this.diffAlgorithmOnDidChangeSubscription = newOptions.diffAlgorithm.onDidChange(() => this.onDidChangeEventEmitter.fire());
				}
				didChange = true;
			}
		}
		if (didChange) {
			this.onDidChangeEventEmitter.fire();
		}
	}
}

interface IWorkerBasedDocumentDiffProviderOptions {
	readonly diffAlgorithm?: 'legacy' | 'advanced' | IDocumentDiffProvider;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/embeddedDiffEditorWidget.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/embeddedDiffEditorWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as objects from '../../../../base/common/objects.js';
import { ICodeEditor, IDiffEditorConstructionOptions } from '../../editorBrowser.js';
import { ICodeEditorService } from '../../services/codeEditorService.js';
import { DiffEditorWidget, IDiffCodeEditorWidgetOptions } from './diffEditorWidget.js';
import { ConfigurationChangedEvent, IDiffEditorOptions, IEditorOptions } from '../../../common/config/editorOptions.js';
import { IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IEditorProgressService } from '../../../../platform/progress/common/progress.js';
export class EmbeddedDiffEditorWidget extends DiffEditorWidget {

	private readonly _parentEditor: ICodeEditor;
	private readonly _overwriteOptions: IDiffEditorOptions;

	constructor(
		domElement: HTMLElement,
		options: Readonly<IDiffEditorConstructionOptions>,
		codeEditorWidgetOptions: IDiffCodeEditorWidgetOptions,
		parentEditor: ICodeEditor,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IAccessibilitySignalService accessibilitySignalService: IAccessibilitySignalService,
		@IEditorProgressService editorProgressService: IEditorProgressService
	) {
		super(domElement, parentEditor.getRawOptions(), codeEditorWidgetOptions, contextKeyService, instantiationService, codeEditorService, accessibilitySignalService, editorProgressService);

		this._parentEditor = parentEditor;
		this._overwriteOptions = options;

		// Overwrite parent's options
		super.updateOptions(this._overwriteOptions);

		this._register(parentEditor.onDidChangeConfiguration(e => this._onParentConfigurationChanged(e)));
	}

	getParentEditor(): ICodeEditor {
		return this._parentEditor;
	}

	private _onParentConfigurationChanged(e: ConfigurationChangedEvent): void {
		super.updateOptions(this._parentEditor.getRawOptions());
		super.updateOptions(this._overwriteOptions);
	}

	override updateOptions(newOptions: IEditorOptions): void {
		objects.mixin(this._overwriteOptions, newOptions, true);
		super.updateOptions(this._overwriteOptions);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/registrations.contribution.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/registrations.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { localize } from '../../../../nls.js';
import { registerColor } from '../../../../platform/theme/common/colorRegistry.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';

export const diffMoveBorder = registerColor(
	'diffEditor.move.border',
	'#8b8b8b9c',
	localize('diffEditor.move.border', 'The border color for text that got moved in the diff editor.')
);

export const diffMoveBorderActive = registerColor(
	'diffEditor.moveActive.border',
	'#FFA500',
	localize('diffEditor.moveActive.border', 'The active border color for text that got moved in the diff editor.')
);

export const diffEditorUnchangedRegionShadow = registerColor(
	'diffEditor.unchangedRegionShadow',
	{ dark: '#000000', light: '#737373BF', hcDark: '#000000', hcLight: '#737373BF', },
	localize('diffEditor.unchangedRegionShadow', 'The color of the shadow around unchanged region widgets.')
);

export const diffInsertIcon = registerIcon('diff-insert', Codicon.add, localize('diffInsertIcon', 'Line decoration for inserts in the diff editor.'));
export const diffRemoveIcon = registerIcon('diff-remove', Codicon.remove, localize('diffRemoveIcon', 'Line decoration for removals in the diff editor.'));

export const diffLineAddDecorationBackgroundWithIndicator = ModelDecorationOptions.register({
	className: 'line-insert',
	description: 'line-insert',
	isWholeLine: true,
	linesDecorationsClassName: 'insert-sign ' + ThemeIcon.asClassName(diffInsertIcon),
	marginClassName: 'gutter-insert',
});

export const diffLineDeleteDecorationBackgroundWithIndicator = ModelDecorationOptions.register({
	className: 'line-delete',
	description: 'line-delete',
	isWholeLine: true,
	linesDecorationsClassName: 'delete-sign ' + ThemeIcon.asClassName(diffRemoveIcon),
	marginClassName: 'gutter-delete',
});

export const diffLineAddDecorationBackground = ModelDecorationOptions.register({
	className: 'line-insert',
	description: 'line-insert',
	isWholeLine: true,
	marginClassName: 'gutter-insert',
});

export const diffLineDeleteDecorationBackground = ModelDecorationOptions.register({
	className: 'line-delete',
	description: 'line-delete',
	isWholeLine: true,
	marginClassName: 'gutter-delete',
});

export const diffAddDecoration = ModelDecorationOptions.register({
	className: 'char-insert',
	description: 'char-insert',
	shouldFillLineOnLineBreak: true,
});

export const diffWholeLineAddDecoration = ModelDecorationOptions.register({
	className: 'char-insert',
	description: 'char-insert',
	isWholeLine: true,
});

export const diffAddDecorationEmpty = ModelDecorationOptions.register({
	className: 'char-insert diff-range-empty',
	description: 'char-insert diff-range-empty',
});

export const diffDeleteDecoration = ModelDecorationOptions.register({
	className: 'char-delete',
	description: 'char-delete',
	shouldFillLineOnLineBreak: true,
});

export const diffWholeLineDeleteDecoration = ModelDecorationOptions.register({
	className: 'char-delete',
	description: 'char-delete',
	isWholeLine: true,
});

export const diffDeleteDecorationEmpty = ModelDecorationOptions.register({
	className: 'char-delete diff-range-empty',
	description: 'char-delete diff-range-empty',
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/style.css]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/style.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .diff-hidden-lines-widget {
	width: 100%;
}

.monaco-editor .diff-hidden-lines {
	height: 0px; /* The children each have a fixed height, the transform confuses the browser */
	transform: translate(0px, -10px);
	font-size: 13px;
	line-height: 14px;
}

.monaco-editor .diff-hidden-lines:not(.dragging) .top:hover,
.monaco-editor .diff-hidden-lines:not(.dragging) .bottom:hover,
.monaco-editor .diff-hidden-lines .top.dragging,
.monaco-editor .diff-hidden-lines .bottom.dragging {
	background-color: var(--vscode-focusBorder);
}

.monaco-editor .diff-hidden-lines .top,
.monaco-editor .diff-hidden-lines .bottom {
	transition: background-color 0.1s ease-out;
	height: 4px;
	background-color: transparent;
	background-clip: padding-box;
	border-bottom: 2px solid transparent;
	border-top: 4px solid transparent;
	/*cursor: n-resize;*/
}

.monaco-editor.draggingUnchangedRegion.canMoveTop:not(.canMoveBottom) *,
.monaco-editor .diff-hidden-lines .top.canMoveTop:not(.canMoveBottom),
.monaco-editor .diff-hidden-lines .bottom.canMoveTop:not(.canMoveBottom) {
	cursor: n-resize !important;
}

.monaco-editor.draggingUnchangedRegion:not(.canMoveTop).canMoveBottom *,
.monaco-editor .diff-hidden-lines .top:not(.canMoveTop).canMoveBottom,
.monaco-editor .diff-hidden-lines .bottom:not(.canMoveTop).canMoveBottom {
	cursor: s-resize !important;
}

.monaco-editor.draggingUnchangedRegion.canMoveTop.canMoveBottom *,
.monaco-editor .diff-hidden-lines .top.canMoveTop.canMoveBottom,
.monaco-editor .diff-hidden-lines .bottom.canMoveTop.canMoveBottom {
	cursor: ns-resize !important;
}

.monaco-editor .diff-hidden-lines .top {
	transform: translate(0px, 4px);
}

.monaco-editor .diff-hidden-lines .bottom {
	transform: translate(0px, -6px);
}

.monaco-editor .diff-unchanged-lines {
	background: var(--vscode-diffEditor-unchangedCodeBackground);
}

.monaco-editor .noModificationsOverlay {
	z-index: 1;
	background: var(--vscode-editor-background);

	display: flex;
	justify-content: center;
	align-items: center;
}


.monaco-editor .diff-hidden-lines .center {
	background: var(--vscode-diffEditor-unchangedRegionBackground);
	color: var(--vscode-diffEditor-unchangedRegionForeground);
	overflow: hidden;
	display: block;
	text-overflow: ellipsis;
	white-space: nowrap;

	height: 24px;
	box-shadow: inset 0 -5px 5px -7px var(--vscode-diffEditor-unchangedRegionShadow), inset 0 5px 5px -7px var(--vscode-diffEditor-unchangedRegionShadow);
}

.monaco-editor .diff-hidden-lines .center span.codicon {
	vertical-align: middle;
}

.monaco-editor .diff-hidden-lines .center a:hover .codicon {
	cursor: pointer;
	color: var(--vscode-editorLink-activeForeground) !important;
}

.monaco-editor .diff-hidden-lines div.breadcrumb-item {
	cursor: pointer;
}

.monaco-editor .diff-hidden-lines div.breadcrumb-item:hover {
	color: var(--vscode-editorLink-activeForeground);
}

.monaco-editor .movedOriginal {
	border: 2px solid var(--vscode-diffEditor-move-border);
}

.monaco-editor .movedModified {
	border: 2px solid var(--vscode-diffEditor-move-border);
}

.monaco-editor .movedOriginal.currentMove, .monaco-editor .movedModified.currentMove {
	border: 2px solid var(--vscode-diffEditor-moveActive-border);
}

.monaco-diff-editor .moved-blocks-lines path.currentMove {
	stroke: var(--vscode-diffEditor-moveActive-border);
}

.monaco-diff-editor .moved-blocks-lines path {
	pointer-events: visiblestroke;
}

.monaco-diff-editor .moved-blocks-lines .arrow {
	fill: var(--vscode-diffEditor-move-border);
}

.monaco-diff-editor .moved-blocks-lines .arrow.currentMove {
	fill: var(--vscode-diffEditor-moveActive-border);
}

.monaco-diff-editor .moved-blocks-lines .arrow-rectangle {
	fill: var(--vscode-editor-background);
}

.monaco-diff-editor .moved-blocks-lines {
	position: absolute;
	pointer-events: none;
}

.monaco-diff-editor .moved-blocks-lines path {
	fill: none;
	stroke: var(--vscode-diffEditor-move-border);
	stroke-width: 2;
}

.monaco-editor .char-delete.diff-range-empty {
	margin-left: -1px;
	border-left: solid var(--vscode-diffEditor-removedTextBackground) 3px;
}

.monaco-editor .char-insert.diff-range-empty {
	border-left: solid var(--vscode-diffEditor-insertedTextBackground) 3px;
}

.monaco-editor .fold-unchanged {
	cursor: pointer;
}

.monaco-diff-editor .diff-moved-code-block {
	display: flex;
	justify-content: flex-end;
	margin-top: -4px;
}

.monaco-diff-editor .diff-moved-code-block .action-bar .action-label.codicon {
	width: 12px;
	height: 12px;
	font-size: 12px;
}

/* ---------- DiffEditor ---------- */

.monaco-diff-editor .diffOverview {
	z-index: 9;
}

.monaco-diff-editor .diffOverview .diffViewport {
	z-index: 10;
}

/* colors not externalized: using transparancy on background */
.monaco-diff-editor.vs			.diffOverview { background: rgba(0, 0, 0, 0.03); }
.monaco-diff-editor.vs-dark		.diffOverview { background: rgba(255, 255, 255, 0.01); }

.monaco-scrollable-element.modified-in-monaco-diff-editor.vs		.scrollbar { background: rgba(0,0,0,0); }
.monaco-scrollable-element.modified-in-monaco-diff-editor.vs-dark	.scrollbar { background: rgba(0,0,0,0); }
.monaco-scrollable-element.modified-in-monaco-diff-editor.hc-black	.scrollbar { background: none; }
.monaco-scrollable-element.modified-in-monaco-diff-editor.hc-light	.scrollbar { background: none; }

.monaco-scrollable-element.modified-in-monaco-diff-editor .slider {
	z-index: 10;
}
.modified-in-monaco-diff-editor				.slider.active { background: rgba(171, 171, 171, .4); }
.modified-in-monaco-diff-editor.hc-black	.slider.active { background: none; }
.modified-in-monaco-diff-editor.hc-light	.slider.active { background: none; }

/* ---------- Diff ---------- */

.monaco-editor .insert-sign,
.monaco-diff-editor .insert-sign,
.monaco-editor .delete-sign,
.monaco-diff-editor .delete-sign {
	font-size: 11px !important;
	opacity: 0.7 !important;
	display: flex !important;
	align-items: center;
}
.monaco-editor.hc-black .insert-sign,
.monaco-diff-editor.hc-black .insert-sign,
.monaco-editor.hc-black .delete-sign,
.monaco-diff-editor.hc-black .delete-sign,
.monaco-editor.hc-light .insert-sign,
.monaco-diff-editor.hc-light .insert-sign,
.monaco-editor.hc-light .delete-sign,
.monaco-diff-editor.hc-light .delete-sign {
	opacity: 1;
}

.monaco-editor .inline-deleted-margin-view-zone {
	text-align: right;
}
.monaco-editor .inline-added-margin-view-zone {
	text-align: right;
}

.monaco-editor .arrow-revert-change {
	z-index: 10;
	position: absolute;
}

.monaco-editor .arrow-revert-change:hover {
	cursor: pointer;
}

/* ---------- Inline Diff ---------- */

.monaco-editor .view-zones .view-lines .view-line span {
	display: inline-block;
}

.monaco-editor .margin-view-zones .lightbulb-glyph:hover {
	cursor: pointer;
}

.monaco-editor .char-insert, .monaco-diff-editor .char-insert {
	background-color: var(--vscode-diffEditor-insertedTextBackground);
}

.monaco-editor .line-insert, .monaco-diff-editor .line-insert {
	background-color: var(--vscode-diffEditor-insertedLineBackground, var(--vscode-diffEditor-insertedTextBackground));
}

.monaco-editor .line-insert,
.monaco-editor .char-insert {
	box-sizing: border-box;
	border: 1px solid var(--vscode-diffEditor-insertedTextBorder);
}
.monaco-editor.hc-black .line-insert, .monaco-editor.hc-light .line-insert,
.monaco-editor.hc-black .char-insert, .monaco-editor.hc-light .char-insert {
	border-style: dashed;
}

.monaco-editor .line-delete,
.monaco-editor .char-delete {
	box-sizing: border-box;
	border: 1px solid var(--vscode-diffEditor-removedTextBorder);
}
.monaco-editor.hc-black .line-delete, .monaco-editor.hc-light .line-delete,
.monaco-editor.hc-black .char-delete, .monaco-editor.hc-light .char-delete {
	border-style: dashed;
}

.monaco-editor .inline-added-margin-view-zone,
.monaco-editor .gutter-insert, .monaco-diff-editor .gutter-insert {
	background-color: var(--vscode-diffEditorGutter-insertedLineBackground, var(--vscode-diffEditor-insertedLineBackground), var(--vscode-diffEditor-insertedTextBackground));
}

.monaco-editor .char-delete, .monaco-diff-editor .char-delete, .monaco-editor .inline-deleted-text {
	background-color: var(--vscode-diffEditor-removedTextBackground);
}

.monaco-editor .inline-deleted-text {
	text-decoration: line-through;
}

.monaco-editor .line-delete, .monaco-diff-editor .line-delete {
	background-color: var(--vscode-diffEditor-removedLineBackground, var(--vscode-diffEditor-removedTextBackground));
}

.monaco-editor .inline-deleted-margin-view-zone,
.monaco-editor .gutter-delete, .monaco-diff-editor .gutter-delete {
	background-color: var(--vscode-diffEditorGutter-removedLineBackground, var(--vscode-diffEditor-removedLineBackground), var(--vscode-diffEditor-removedTextBackground));
}

.monaco-diff-editor.side-by-side .editor.modified {
	box-shadow: -6px 0 5px -5px var(--vscode-scrollbar-shadow);
	border-left: 1px solid var(--vscode-diffEditor-border);
}

.monaco-diff-editor.side-by-side .editor.original {
	box-shadow: 6px 0 5px -5px var(--vscode-scrollbar-shadow);
	border-right: 1px solid var(--vscode-diffEditor-border);
}

.monaco-diff-editor .diffViewport {
	background: var(--vscode-scrollbarSlider-background);
}

.monaco-diff-editor .diffViewport:hover {
	background: var(--vscode-scrollbarSlider-hoverBackground);
}

.monaco-diff-editor .diffViewport:active {
	background: var(--vscode-scrollbarSlider-activeBackground);
}

.monaco-editor .diagonal-fill {
	background-image: linear-gradient(
		-45deg,
		var(--vscode-diffEditor-diagonalFill) 12.5%,
		#0000 12.5%, #0000 50%,
		var(--vscode-diffEditor-diagonalFill) 50%, var(--vscode-diffEditor-diagonalFill) 62.5%,
		#0000 62.5%, #0000 100%
	);
	background-size: 8px 8px;
}

.monaco-diff-editor .gutter {
	position: relative;
	overflow: hidden;
	flex-shrink: 0;
	flex-grow: 0;

	& > div {
		position: absolute;
	}

	.gutterItem {
		opacity: 0;
		transition: opacity 0.7s;

		&.showAlways {
			opacity: 1;
			transition: none;
		}

		&.noTransition {
			transition: none;
		}
	}

	&:hover .gutterItem {
		opacity: 1;
		transition: opacity 0.1s ease-in-out;
	}

	.gutterItem {
		.background {
			position: absolute;
			height: 100%;
			left: 50%;
			width: 1px;

			border-left: 2px var(--vscode-menu-separatorBackground) solid;
		}

		.buttons {
			position: absolute;
			/*height: 100%;*/
			width: 100%;

			display: flex;
			justify-content: center;
			align-items: center;

			.monaco-toolbar {
				height: fit-content;
				.monaco-action-bar  {
					line-height: 1;

					.actions-container {
						width: fit-content;
						border-radius: 4px;
						background: var(--vscode-editorGutter-itemBackground);

						.action-item {
							&:hover {
								background: var(--vscode-toolbar-hoverBackground);
							}

							.action-label {
								color: var(--vscode-editorGutter-itemGlyphForeground);
								padding: 1px 2px;
							}
						}
					}
				}
			}
		}
	}
}


.monaco-diff-editor .diff-hidden-lines-compact {
	display: flex;
	height: 11px;
	.line-left, .line-right {
		height: 1px;
		border-top: 1px solid;
		border-color: var(--vscode-editorCodeLens-foreground);
		opacity: 0.5;
		margin: auto;
		width: 100%;
	}

	.line-left {
		width: 20px;
	}

	.text {
		color: var(--vscode-editorCodeLens-foreground);
		text-wrap: nowrap;
		font-size: 11px;
		line-height: 11px;
		margin: 0 4px;
	}
}

.monaco-editor .line-delete-selectable {
	user-select: text !important;
	-webkit-user-select: text !important;
	z-index: 1 !important;
}

.line-delete-selectable .view-line {
	user-select: text !important;
	-webkit-user-select: text !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/utils.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDimension } from '../../../../base/browser/dom.js';
import { findLast } from '../../../../base/common/arraysFind.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Disposable, DisposableStore, IDisposable, IReference, toDisposable } from '../../../../base/common/lifecycle.js';
import { IObservable, IObservableWithChange, ISettableObservable, autorun, autorunHandleChanges, autorunOpts, autorunWithStore, observableValue, transaction } from '../../../../base/common/observable.js';
import { ElementSizeObserver } from '../../config/elementSizeObserver.js';
import { ICodeEditor, IOverlayWidget, IViewZone } from '../../editorBrowser.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { DetailedLineRangeMapping } from '../../../common/diff/rangeMapping.js';
import { IModelDeltaDecoration } from '../../../common/model.js';
import { TextLength } from '../../../common/core/text/textLength.js';

export function joinCombine<T>(arr1: readonly T[], arr2: readonly T[], keySelector: (val: T) => number, combine: (v1: T, v2: T) => T): readonly T[] {
	if (arr1.length === 0) {
		return arr2;
	}
	if (arr2.length === 0) {
		return arr1;
	}

	const result: T[] = [];
	let i = 0;
	let j = 0;
	while (i < arr1.length && j < arr2.length) {
		const val1 = arr1[i];
		const val2 = arr2[j];
		const key1 = keySelector(val1);
		const key2 = keySelector(val2);

		if (key1 < key2) {
			result.push(val1);
			i++;
		} else if (key1 > key2) {
			result.push(val2);
			j++;
		} else {
			result.push(combine(val1, val2));
			i++;
			j++;
		}
	}
	while (i < arr1.length) {
		result.push(arr1[i]);
		i++;
	}
	while (j < arr2.length) {
		result.push(arr2[j]);
		j++;
	}
	return result;
}

// TODO make utility
export function applyObservableDecorations(editor: ICodeEditor, decorations: IObservable<IModelDeltaDecoration[]>): IDisposable {
	const d = new DisposableStore();
	const decorationsCollection = editor.createDecorationsCollection();
	d.add(autorunOpts({ debugName: () => `Apply decorations from ${decorations.debugName}` }, reader => {
		const d = decorations.read(reader);
		decorationsCollection.set(d);
	}));
	d.add({
		dispose: () => {
			decorationsCollection.clear();
		}
	});
	return d;
}

export function appendRemoveOnDispose(parent: HTMLElement, child: HTMLElement) {
	parent.appendChild(child);
	return toDisposable(() => {
		child.remove();
	});
}

export function prependRemoveOnDispose(parent: HTMLElement, child: HTMLElement) {
	parent.prepend(child);
	return toDisposable(() => {
		child.remove();
	});
}

export class ObservableElementSizeObserver extends Disposable {
	private readonly elementSizeObserver: ElementSizeObserver;

	private readonly _width: ISettableObservable<number>;
	public get width(): IObservable<number> { return this._width; }

	private readonly _height: ISettableObservable<number>;
	public get height(): IObservable<number> { return this._height; }

	private _automaticLayout: boolean = false;
	public get automaticLayout(): boolean { return this._automaticLayout; }

	constructor(element: HTMLElement | null, dimension: IDimension | undefined) {
		super();

		this.elementSizeObserver = this._register(new ElementSizeObserver(element, dimension));
		this._width = observableValue(this, this.elementSizeObserver.getWidth());
		this._height = observableValue(this, this.elementSizeObserver.getHeight());

		this._register(this.elementSizeObserver.onDidChange(e => transaction(tx => {
			/** @description Set width/height from elementSizeObserver */
			this._width.set(this.elementSizeObserver.getWidth(), tx);
			this._height.set(this.elementSizeObserver.getHeight(), tx);
		})));
	}

	public observe(dimension?: IDimension): void {
		this.elementSizeObserver.observe(dimension);
	}

	public setAutomaticLayout(automaticLayout: boolean): void {
		this._automaticLayout = automaticLayout;
		if (automaticLayout) {
			this.elementSizeObserver.startObserving();
		} else {
			this.elementSizeObserver.stopObserving();
		}
	}
}

export function animatedObservable(targetWindow: Window, base: IObservableWithChange<number, boolean>, store: DisposableStore): IObservable<number> {
	let targetVal = base.get();
	let startVal = targetVal;
	let curVal = targetVal;
	const result = observableValue('animatedValue', targetVal);

	let animationStartMs: number = -1;
	const durationMs = 300;
	let animationFrame: number | undefined = undefined;

	store.add(autorunHandleChanges({
		changeTracker: {
			createChangeSummary: () => ({ animate: false }),
			handleChange: (ctx, s) => {
				if (ctx.didChange(base)) {
					s.animate = s.animate || ctx.change;
				}
				return true;
			}
		}
	}, (reader, s) => {
		/** @description update value */
		if (animationFrame !== undefined) {
			targetWindow.cancelAnimationFrame(animationFrame);
			animationFrame = undefined;
		}

		startVal = curVal;
		targetVal = base.read(reader);
		animationStartMs = Date.now() - (s.animate ? 0 : durationMs);

		update();
	}));

	function update() {
		const passedMs = Date.now() - animationStartMs;
		curVal = Math.floor(easeOutExpo(passedMs, startVal, targetVal - startVal, durationMs));

		if (passedMs < durationMs) {
			animationFrame = targetWindow.requestAnimationFrame(update);
		} else {
			curVal = targetVal;
		}

		result.set(curVal, undefined);
	}

	return result;
}

function easeOutExpo(t: number, b: number, c: number, d: number): number {
	return t === d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
}

export function deepMerge<T extends {}>(source1: T, source2: Partial<T>): T {
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	const result = {} as any as T;
	for (const key in source1) {
		result[key] = source1[key];
	}
	for (const key in source2) {
		const source2Value = source2[key];
		if (typeof result[key] === 'object' && source2Value && typeof source2Value === 'object') {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			result[key] = deepMerge<any>(result[key], source2Value);
		} else {
			// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
			result[key] = source2Value as any;
		}
	}
	return result;
}

export abstract class ViewZoneOverlayWidget extends Disposable {
	constructor(
		editor: ICodeEditor,
		viewZone: PlaceholderViewZone,
		htmlElement: HTMLElement,
	) {
		super();

		this._register(new ManagedOverlayWidget(editor, htmlElement));
		this._register(applyStyle(htmlElement, {
			height: viewZone.actualHeight,
			top: viewZone.actualTop,
		}));
	}
}

export interface IObservableViewZone extends IViewZone {
	// Causes the view zone to relayout.
	onChange?: IObservable<unknown>;

	// Tells a view zone its id.
	setZoneId?(zoneId: string): void;
}

export class PlaceholderViewZone implements IObservableViewZone {
	public readonly domNode;

	private readonly _actualTop;
	private readonly _actualHeight;

	public readonly actualTop: IObservable<number | undefined>;
	public readonly actualHeight: IObservable<number | undefined>;

	public readonly showInHiddenAreas;

	public get afterLineNumber(): number { return this._afterLineNumber.get(); }

	public readonly onChange?: IObservable<unknown>;

	constructor(
		private readonly _afterLineNumber: IObservable<number>,
		public readonly heightInPx: number,
	) {
		this.domNode = document.createElement('div');
		this._actualTop = observableValue<number | undefined>(this, undefined);
		this._actualHeight = observableValue<number | undefined>(this, undefined);
		this.actualTop = this._actualTop;
		this.actualHeight = this._actualHeight;
		this.showInHiddenAreas = true;
		this.onChange = this._afterLineNumber;
		this.onDomNodeTop = (top: number) => {
			this._actualTop.set(top, undefined);
		};
		this.onComputedHeight = (height: number) => {
			this._actualHeight.set(height, undefined);
		};
	}

	onDomNodeTop;

	onComputedHeight;
}


export class ManagedOverlayWidget implements IDisposable {
	private static _counter = 0;
	private readonly _overlayWidgetId = `managedOverlayWidget-${ManagedOverlayWidget._counter++}`;

	private readonly _overlayWidget: IOverlayWidget = {
		getId: () => this._overlayWidgetId,
		getDomNode: () => this._domElement,
		getPosition: () => null
	};

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _domElement: HTMLElement,
	) {
		this._editor.addOverlayWidget(this._overlayWidget);
	}

	dispose(): void {
		this._editor.removeOverlayWidget(this._overlayWidget);
	}
}

export interface CSSStyle {
	height: number | string;
	width: number | string;
	top: number | string;
	visibility: 'visible' | 'hidden' | 'collapse';
	display: 'block' | 'inline' | 'inline-block' | 'flex' | 'none';
	paddingLeft: number | string;
	paddingRight: number | string;
}

export function applyStyle(domNode: HTMLElement, style: Partial<{ [TKey in keyof CSSStyle]: CSSStyle[TKey] | IObservable<CSSStyle[TKey] | undefined> | undefined }>) {
	return autorun(reader => {
		/** @description applyStyle */
		for (let [key, val] of Object.entries(style)) {
			if (val && typeof val === 'object' && 'read' in val) {
				// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
				val = val.read(reader) as any;
			}
			if (typeof val === 'number') {
				val = `${val}px`;
			}
			key = key.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
			// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
			domNode.style[key as any] = val as any;
		}
	});
}

export function applyViewZones(editor: ICodeEditor, viewZones: IObservable<IObservableViewZone[]>, setIsUpdating?: (isUpdatingViewZones: boolean) => void, zoneIds?: Set<string>): IDisposable {
	const store = new DisposableStore();
	const lastViewZoneIds: string[] = [];

	store.add(autorunWithStore((reader, store) => {
		/** @description applyViewZones */
		const curViewZones = viewZones.read(reader);

		const viewZonIdsPerViewZone = new Map<IObservableViewZone, string>();
		const viewZoneIdPerOnChangeObservable = new Map<IObservable<unknown>, string>();

		// Add/remove view zones
		if (setIsUpdating) { setIsUpdating(true); }
		editor.changeViewZones(a => {
			for (const id of lastViewZoneIds) { a.removeZone(id); zoneIds?.delete(id); }
			lastViewZoneIds.length = 0;

			for (const z of curViewZones) {
				const id = a.addZone(z);
				if (z.setZoneId) {
					z.setZoneId(id);
				}
				lastViewZoneIds.push(id);
				zoneIds?.add(id);
				viewZonIdsPerViewZone.set(z, id);
			}
		});
		if (setIsUpdating) { setIsUpdating(false); }

		// Layout zone on change
		store.add(autorunHandleChanges({
			changeTracker: {
				createChangeSummary() {
					return { zoneIds: [] as string[] };
				},
				handleChange(context, changeSummary) {
					const id = viewZoneIdPerOnChangeObservable.get(context.changedObservable);
					if (id !== undefined) { changeSummary.zoneIds.push(id); }
					return true;
				},
			}
		}, (reader, changeSummary) => {
			/** @description layoutZone on change */
			for (const vz of curViewZones) {
				if (vz.onChange) {
					viewZoneIdPerOnChangeObservable.set(vz.onChange, viewZonIdsPerViewZone.get(vz)!);
					vz.onChange.read(reader);
				}
			}
			if (setIsUpdating) { setIsUpdating(true); }
			editor.changeViewZones(a => { for (const id of changeSummary.zoneIds) { a.layoutZone(id); } });
			if (setIsUpdating) { setIsUpdating(false); }
		}));
	}));

	store.add({
		dispose() {
			if (setIsUpdating) { setIsUpdating(true); }
			editor.changeViewZones(a => { for (const id of lastViewZoneIds) { a.removeZone(id); } });
			zoneIds?.clear();
			if (setIsUpdating) { setIsUpdating(false); }
		}
	});

	return store;
}

export class DisposableCancellationTokenSource extends CancellationTokenSource {
	public override dispose() {
		super.dispose(true);
	}
}

export function translatePosition(posInOriginal: Position, mappings: DetailedLineRangeMapping[]): Range {
	const mapping = findLast(mappings, m => m.original.startLineNumber <= posInOriginal.lineNumber);
	if (!mapping) {
		// No changes before the position
		return Range.fromPositions(posInOriginal);
	}

	if (mapping.original.endLineNumberExclusive <= posInOriginal.lineNumber) {
		const newLineNumber = posInOriginal.lineNumber - mapping.original.endLineNumberExclusive + mapping.modified.endLineNumberExclusive;
		return Range.fromPositions(new Position(newLineNumber, posInOriginal.column));
	}

	if (!mapping.innerChanges) {
		// Only for legacy algorithm
		return Range.fromPositions(new Position(mapping.modified.startLineNumber, 1));
	}

	const innerMapping = findLast(mapping.innerChanges, m => m.originalRange.getStartPosition().isBeforeOrEqual(posInOriginal));
	if (!innerMapping) {
		const newLineNumber = posInOriginal.lineNumber - mapping.original.startLineNumber + mapping.modified.startLineNumber;
		return Range.fromPositions(new Position(newLineNumber, posInOriginal.column));
	}

	if (innerMapping.originalRange.containsPosition(posInOriginal)) {
		return innerMapping.modifiedRange;
	} else {
		const l = lengthBetweenPositions(innerMapping.originalRange.getEndPosition(), posInOriginal);
		return Range.fromPositions(l.addToPosition(innerMapping.modifiedRange.getEndPosition()));
	}
}

function lengthBetweenPositions(position1: Position, position2: Position): TextLength {
	if (position1.lineNumber === position2.lineNumber) {
		return new TextLength(0, position2.column - position1.column);
	} else {
		return new TextLength(position2.lineNumber - position1.lineNumber, position2.column - 1);
	}
}

export function filterWithPrevious<T>(arr: T[], filter: (cur: T, prev: T | undefined) => boolean): T[] {
	let prev: T | undefined;
	return arr.filter(cur => {
		const result = filter(cur, prev);
		prev = cur;
		return result;
	});
}

export interface IRefCounted extends IDisposable {
	createNewRef(): this;
}

export abstract class RefCounted<T> implements IDisposable, IReference<T> {
	public static create<T extends IDisposable>(value: T, debugOwner: object | undefined = undefined): RefCounted<T> {
		return new BaseRefCounted(value, value, debugOwner);
	}

	public static createWithDisposable<T extends IDisposable>(value: T, disposable: IDisposable, debugOwner: object | undefined = undefined): RefCounted<T> {
		const store = new DisposableStore();
		store.add(disposable);
		store.add(value);
		return new BaseRefCounted(value, store, debugOwner);
	}

	public static createOfNonDisposable<T>(value: T, disposable: IDisposable, debugOwner: object | undefined = undefined): RefCounted<T> {
		return new BaseRefCounted(value, disposable, debugOwner);
	}

	public abstract createNewRef(debugOwner?: object | undefined): RefCounted<T>;

	public abstract dispose(): void;

	public abstract get object(): T;
}

class BaseRefCounted<T> extends RefCounted<T> {
	private _refCount = 1;
	private _isDisposed = false;
	private readonly _owners: object[] = [];

	constructor(
		public override readonly object: T,
		private readonly _disposable: IDisposable,
		private readonly _debugOwner: object | undefined,
	) {
		super();

		if (_debugOwner) {
			this._addOwner(_debugOwner);
		}
	}

	private _addOwner(debugOwner: object | undefined) {
		if (debugOwner) {
			this._owners.push(debugOwner);
		}
	}

	public createNewRef(debugOwner?: object | undefined): RefCounted<T> {
		this._refCount++;
		if (debugOwner) {
			this._addOwner(debugOwner);
		}
		return new ClonedRefCounted(this, debugOwner);
	}

	public dispose(): void {
		if (this._isDisposed) { return; }
		this._isDisposed = true;
		this._decreaseRefCount(this._debugOwner);
	}

	public _decreaseRefCount(debugOwner?: object | undefined): void {
		this._refCount--;
		if (this._refCount === 0) {
			this._disposable.dispose();
		}

		if (debugOwner) {
			const idx = this._owners.indexOf(debugOwner);
			if (idx !== -1) {
				this._owners.splice(idx, 1);
			}
		}
	}
}

class ClonedRefCounted<T> extends RefCounted<T> {
	private _isDisposed = false;
	constructor(
		private readonly _base: BaseRefCounted<T>,
		private readonly _debugOwner: object | undefined,
	) {
		super();
	}

	public get object(): T { return this._base.object; }

	public createNewRef(debugOwner?: object | undefined): RefCounted<T> {
		return this._base.createNewRef(debugOwner);
	}

	public dispose(): void {
		if (this._isDisposed) { return; }
		this._isDisposed = true;
		this._base._decreaseRefCount(this._debugOwner);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/components/accessibleDiffViewer.css]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/components/accessibleDiffViewer.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-diff-editor .diff-review {
	position: absolute;

}

.monaco-component.diff-review {
	user-select: none;
	-webkit-user-select: none;
	z-index: 99;


	.diff-review-line-number {
		text-align: right;
		display: inline-block;
		color: var(--vscode-editorLineNumber-foreground);
	}

	.diff-review-summary {
		padding-left: 10px;
	}

	.diff-review-shadow {
		position: absolute;
		box-shadow: var(--vscode-scrollbar-shadow) 0 -6px 6px -6px inset;
	}

	.diff-review-row {
		white-space: pre;
	}

	.diff-review-table {
		display: table;
		min-width: 100%;
	}

	.diff-review-row {
		display: table-row;
		width: 100%;
	}

	.diff-review-spacer {
		display: inline-block;
		width: 10px;
		vertical-align: middle;
	}

	.diff-review-spacer > .codicon {
		font-size: 9px !important;
	}

	.diff-review-actions {
		display: inline-block;
		position: absolute;
		right: 10px;
		top: 2px;
		z-index: 100;
	}

	.diff-review-actions .action-label {
		width: 16px;
		height: 16px;
		margin: 2px 0;
	}

	.revertButton {
		cursor: pointer;
	}

	.action-label {
		background: var(--vscode-editorActionList-background);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/components/accessibleDiffViewer.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/components/accessibleDiffViewer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener, addStandardDisposableListener, reset } from '../../../../../base/browser/dom.js';
import { createTrustedTypesPolicy } from '../../../../../base/browser/trustedTypes.js';
import { ActionBar } from '../../../../../base/browser/ui/actionbar/actionbar.js';
import { DomScrollableElement } from '../../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { forEachAdjacent, groupAdjacentBy } from '../../../../../base/common/arrays.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../../base/common/lifecycle.js';
import { IObservable, ITransaction, autorun, autorunWithStore, derived, observableValue, subtransaction, transaction } from '../../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { applyFontInfo } from '../../../config/domFontInfo.js';
import { applyStyle } from '../utils.js';
import { EditorFontLigatures, EditorOption, IComputedEditorOptions } from '../../../../common/config/editorOptions.js';
import { LineRange } from '../../../../common/core/ranges/lineRange.js';
import { OffsetRange } from '../../../../common/core/ranges/offsetRange.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { DetailedLineRangeMapping, LineRangeMapping } from '../../../../common/diff/rangeMapping.js';
import { ILanguageIdCodec } from '../../../../common/languages.js';
import { ILanguageService } from '../../../../common/languages/language.js';
import { ITextModel, TextModelResolvedOptions } from '../../../../common/model.js';
import { LineTokens } from '../../../../common/tokens/lineTokens.js';
import { RenderLineInput, renderViewLine2 } from '../../../../common/viewLayout/viewLineRenderer.js';
import { ViewLineRenderingData } from '../../../../common/viewModel.js';
import { localize } from '../../../../../nls.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { registerIcon } from '../../../../../platform/theme/common/iconRegistry.js';
import './accessibleDiffViewer.css';
import { DiffEditorEditors } from './diffEditorEditors.js';
import { toAction } from '../../../../../base/common/actions.js';

const accessibleDiffViewerInsertIcon = registerIcon('diff-review-insert', Codicon.add, localize('accessibleDiffViewerInsertIcon', 'Icon for \'Insert\' in accessible diff viewer.'));
const accessibleDiffViewerRemoveIcon = registerIcon('diff-review-remove', Codicon.remove, localize('accessibleDiffViewerRemoveIcon', 'Icon for \'Remove\' in accessible diff viewer.'));
const accessibleDiffViewerCloseIcon = registerIcon('diff-review-close', Codicon.close, localize('accessibleDiffViewerCloseIcon', 'Icon for \'Close\' in accessible diff viewer.'));

export interface IAccessibleDiffViewerModel {
	getOriginalModel(): ITextModel;
	getOriginalOptions(): IComputedEditorOptions;

	/**
	 * Should do: `setSelection`, `revealLine` and `focus`
	 */
	originalReveal(range: Range): void;

	getModifiedModel(): ITextModel;
	getModifiedOptions(): IComputedEditorOptions;
	/**
	 * Should do: `setSelection`, `revealLine` and `focus`
	 */
	modifiedReveal(range?: Range): void;
	modifiedSetSelection(range: Range): void;
	modifiedFocus(): void;

	getModifiedPosition(): Position | undefined;
}

export class AccessibleDiffViewer extends Disposable {
	public static _ttPolicy = createTrustedTypesPolicy('diffReview', { createHTML: value => value });

	constructor(
		private readonly _parentNode: HTMLElement,
		private readonly _visible: IObservable<boolean>,
		private readonly _setVisible: (visible: boolean, tx: ITransaction | undefined) => void,
		private readonly _canClose: IObservable<boolean>,
		private readonly _width: IObservable<number>,
		private readonly _height: IObservable<number>,
		private readonly _diffs: IObservable<DetailedLineRangeMapping[] | undefined>,
		private readonly _models: IAccessibleDiffViewerModel,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();
	}

	private readonly _state = derived(this, (reader) => {
		const visible = this._visible.read(reader);
		this._parentNode.style.visibility = visible ? 'visible' : 'hidden';
		if (!visible) {
			return null;
		}
		const model = reader.store.add(this._instantiationService.createInstance(ViewModel, this._diffs, this._models, this._setVisible, this._canClose));
		const view = reader.store.add(this._instantiationService.createInstance(View, this._parentNode, model, this._width, this._height, this._models));
		return { model, view, };
	}).recomputeInitiallyAndOnChange(this._store);

	next(): void {
		transaction(tx => {
			const isVisible = this._visible.get();
			this._setVisible(true, tx);
			if (isVisible) {
				this._state.get()!.model.nextGroup(tx);
			}
		});
	}

	prev(): void {
		transaction(tx => {
			this._setVisible(true, tx);
			this._state.get()!.model.previousGroup(tx);
		});
	}

	close(): void {
		transaction(tx => {
			this._setVisible(false, tx);
		});
	}
}

class ViewModel extends Disposable {
	private readonly _groups = observableValue<ViewElementGroup[]>(this, []);
	private readonly _currentGroupIdx = observableValue(this, 0);
	private readonly _currentElementIdx = observableValue(this, 0);

	public readonly groups: IObservable<ViewElementGroup[]> = this._groups;
	public readonly currentGroup: IObservable<ViewElementGroup | undefined>
		= this._currentGroupIdx.map((idx, r) => this._groups.read(r)[idx]);
	public readonly currentGroupIndex: IObservable<number> = this._currentGroupIdx;

	public readonly currentElement: IObservable<ViewElement | undefined>
		= this._currentElementIdx.map((idx, r) => this.currentGroup.read(r)?.lines[idx]);

	constructor(
		private readonly _diffs: IObservable<DetailedLineRangeMapping[] | undefined>,
		private readonly _models: IAccessibleDiffViewerModel,
		private readonly _setVisible: (visible: boolean, tx: ITransaction | undefined) => void,
		public readonly canClose: IObservable<boolean>,
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService,
	) {
		super();

		this._register(autorun(reader => {
			/** @description update groups */
			const diffs = this._diffs.read(reader);
			if (!diffs) {
				this._groups.set([], undefined);
				return;
			}

			const groups = computeViewElementGroups(
				diffs,
				this._models.getOriginalModel().getLineCount(),
				this._models.getModifiedModel().getLineCount()
			);

			transaction(tx => {
				const p = this._models.getModifiedPosition();
				if (p) {
					const nextGroup = groups.findIndex(g => p?.lineNumber < g.range.modified.endLineNumberExclusive);
					if (nextGroup !== -1) {
						this._currentGroupIdx.set(nextGroup, tx);
					}
				}
				this._groups.set(groups, tx);
			});
		}));

		this._register(autorun(reader => {
			/** @description play audio-cue for diff */
			const currentViewItem = this.currentElement.read(reader);
			if (currentViewItem?.type === LineType.Deleted) {
				this._accessibilitySignalService.playSignal(AccessibilitySignal.diffLineDeleted, { source: 'accessibleDiffViewer.currentElementChanged' });
			} else if (currentViewItem?.type === LineType.Added) {
				this._accessibilitySignalService.playSignal(AccessibilitySignal.diffLineInserted, { source: 'accessibleDiffViewer.currentElementChanged' });
			}
		}));

		this._register(autorun(reader => {
			/** @description select lines in editor */
			// This ensures editor commands (like revert/stage) work
			const currentViewItem = this.currentElement.read(reader);
			if (currentViewItem && currentViewItem.type !== LineType.Header) {
				const lineNumber = currentViewItem.modifiedLineNumber ?? currentViewItem.diff.modified.startLineNumber;
				this._models.modifiedSetSelection(Range.fromPositions(new Position(lineNumber, 1)));
			}
		}));
	}

	private _goToGroupDelta(delta: number, tx?: ITransaction): void {
		const groups = this.groups.get();
		if (!groups || groups.length <= 1) { return; }
		subtransaction(tx, tx => {
			this._currentGroupIdx.set(OffsetRange.ofLength(groups.length).clipCyclic(this._currentGroupIdx.get() + delta), tx);
			this._currentElementIdx.set(0, tx);
		});
	}

	nextGroup(tx?: ITransaction): void { this._goToGroupDelta(1, tx); }
	previousGroup(tx?: ITransaction): void { this._goToGroupDelta(-1, tx); }

	private _goToLineDelta(delta: number): void {
		const group = this.currentGroup.get();
		if (!group || group.lines.length <= 1) { return; }
		transaction(tx => {
			this._currentElementIdx.set(OffsetRange.ofLength(group.lines.length).clip(this._currentElementIdx.get() + delta), tx);
		});
	}

	goToNextLine(): void { this._goToLineDelta(1); }
	goToPreviousLine(): void { this._goToLineDelta(-1); }

	goToLine(line: ViewElement): void {
		const group = this.currentGroup.get();
		if (!group) { return; }
		const idx = group.lines.indexOf(line);
		if (idx === -1) { return; }
		transaction(tx => {
			this._currentElementIdx.set(idx, tx);
		});
	}

	revealCurrentElementInEditor(): void {
		if (!this.canClose.get()) { return; }
		this._setVisible(false, undefined);

		const curElem = this.currentElement.get();
		if (curElem) {
			if (curElem.type === LineType.Deleted) {
				this._models.originalReveal(Range.fromPositions(new Position(curElem.originalLineNumber, 1)));
			} else {
				this._models.modifiedReveal(
					curElem.type !== LineType.Header
						? Range.fromPositions(new Position(curElem.modifiedLineNumber, 1))
						: undefined
				);
			}
		}
	}

	close(): void {
		if (!this.canClose.get()) { return; }
		this._setVisible(false, undefined);
		this._models.modifiedFocus();
	}
}


const viewElementGroupLineMargin = 3;

function computeViewElementGroups(diffs: DetailedLineRangeMapping[], originalLineCount: number, modifiedLineCount: number): ViewElementGroup[] {
	const result: ViewElementGroup[] = [];

	for (const g of groupAdjacentBy(diffs, (a, b) => (b.modified.startLineNumber - a.modified.endLineNumberExclusive < 2 * viewElementGroupLineMargin))) {
		const viewElements: ViewElement[] = [];
		viewElements.push(new HeaderViewElement());

		const origFullRange = new LineRange(
			Math.max(1, g[0].original.startLineNumber - viewElementGroupLineMargin),
			Math.min(g[g.length - 1].original.endLineNumberExclusive + viewElementGroupLineMargin, originalLineCount + 1)
		);
		const modifiedFullRange = new LineRange(
			Math.max(1, g[0].modified.startLineNumber - viewElementGroupLineMargin),
			Math.min(g[g.length - 1].modified.endLineNumberExclusive + viewElementGroupLineMargin, modifiedLineCount + 1)
		);

		forEachAdjacent(g, (a, b) => {
			const origRange = new LineRange(a ? a.original.endLineNumberExclusive : origFullRange.startLineNumber, b ? b.original.startLineNumber : origFullRange.endLineNumberExclusive);
			const modifiedRange = new LineRange(a ? a.modified.endLineNumberExclusive : modifiedFullRange.startLineNumber, b ? b.modified.startLineNumber : modifiedFullRange.endLineNumberExclusive);

			origRange.forEach(origLineNumber => {
				viewElements.push(new UnchangedLineViewElement(origLineNumber, modifiedRange.startLineNumber + (origLineNumber - origRange.startLineNumber)));
			});

			if (b) {
				b.original.forEach(origLineNumber => {
					viewElements.push(new DeletedLineViewElement(b, origLineNumber));
				});
				b.modified.forEach(modifiedLineNumber => {
					viewElements.push(new AddedLineViewElement(b, modifiedLineNumber));
				});
			}
		});

		const modifiedRange = g[0].modified.join(g[g.length - 1].modified);
		const originalRange = g[0].original.join(g[g.length - 1].original);

		result.push(new ViewElementGroup(new LineRangeMapping(modifiedRange, originalRange), viewElements));
	}
	return result;
}

enum LineType {
	Header,
	Unchanged,
	Deleted,
	Added,
}

class ViewElementGroup {
	constructor(
		public readonly range: LineRangeMapping,
		public readonly lines: readonly ViewElement[],
	) { }
}

type ViewElement = HeaderViewElement | UnchangedLineViewElement | DeletedLineViewElement | AddedLineViewElement;

class HeaderViewElement {
	public readonly type = LineType.Header;
}

class DeletedLineViewElement {
	public readonly type = LineType.Deleted;

	public readonly modifiedLineNumber = undefined;

	constructor(
		public readonly diff: DetailedLineRangeMapping,
		public readonly originalLineNumber: number,
	) {
	}
}

class AddedLineViewElement {
	public readonly type = LineType.Added;

	public readonly originalLineNumber = undefined;

	constructor(
		public readonly diff: DetailedLineRangeMapping,
		public readonly modifiedLineNumber: number,
	) {
	}
}

class UnchangedLineViewElement {
	public readonly type = LineType.Unchanged;
	constructor(
		public readonly originalLineNumber: number,
		public readonly modifiedLineNumber: number,
	) {
	}
}

class View extends Disposable {
	public readonly domNode: HTMLElement;
	private readonly _content: HTMLElement;
	private readonly _scrollbar: DomScrollableElement;
	private readonly _actionBar: ActionBar;

	constructor(
		private readonly _element: HTMLElement,
		private readonly _model: ViewModel,
		private readonly _width: IObservable<number>,
		private readonly _height: IObservable<number>,
		private readonly _models: IAccessibleDiffViewerModel,
		@ILanguageService private readonly _languageService: ILanguageService,
	) {
		super();

		this.domNode = this._element;
		this.domNode.className = 'monaco-component diff-review monaco-editor-background';

		const actionBarContainer = document.createElement('div');
		actionBarContainer.className = 'diff-review-actions';
		this._actionBar = this._register(new ActionBar(
			actionBarContainer
		));
		this._register(autorun(reader => {
			/** @description update actions */
			this._actionBar.clear();
			if (this._model.canClose.read(reader)) {
				this._actionBar.push(toAction({
					id: 'diffreview.close',
					label: localize('label.close', "Close"),
					class: 'close-diff-review ' + ThemeIcon.asClassName(accessibleDiffViewerCloseIcon),
					enabled: true,
					run: async () => _model.close()
				}), { label: false, icon: true });
			}
		}));

		this._content = document.createElement('div');
		this._content.className = 'diff-review-content';
		this._content.setAttribute('role', 'code');
		this._scrollbar = this._register(new DomScrollableElement(this._content, {}));
		reset(this.domNode, this._scrollbar.getDomNode(), actionBarContainer);

		this._register(autorun(r => {
			this._height.read(r);
			this._width.read(r);
			this._scrollbar.scanDomNode();
		}));

		this._register(toDisposable(() => { reset(this.domNode); }));

		this._register(applyStyle(this.domNode, { width: this._width, height: this._height }));
		this._register(applyStyle(this._content, { width: this._width, height: this._height }));

		this._register(autorunWithStore((reader, store) => {
			/** @description render */
			this._model.currentGroup.read(reader);
			this._render(store);
		}));

		// TODO@hediet use commands
		this._register(addStandardDisposableListener(this.domNode, 'keydown', (e) => {
			if (
				e.equals(KeyCode.DownArrow)
				|| e.equals(KeyMod.CtrlCmd | KeyCode.DownArrow)
				|| e.equals(KeyMod.Alt | KeyCode.DownArrow)
			) {
				e.preventDefault();
				this._model.goToNextLine();
			}

			if (
				e.equals(KeyCode.UpArrow)
				|| e.equals(KeyMod.CtrlCmd | KeyCode.UpArrow)
				|| e.equals(KeyMod.Alt | KeyCode.UpArrow)
			) {
				e.preventDefault();
				this._model.goToPreviousLine();
			}

			if (
				e.equals(KeyCode.Escape)
				|| e.equals(KeyMod.CtrlCmd | KeyCode.Escape)
				|| e.equals(KeyMod.Alt | KeyCode.Escape)
				|| e.equals(KeyMod.Shift | KeyCode.Escape)
			) {
				e.preventDefault();
				this._model.close();
			}

			if (
				e.equals(KeyCode.Space)
				|| e.equals(KeyCode.Enter)
			) {
				e.preventDefault();
				this._model.revealCurrentElementInEditor();
			}
		}));
	}

	private _render(store: DisposableStore): void {
		const originalOptions = this._models.getOriginalOptions();
		const modifiedOptions = this._models.getModifiedOptions();

		const container = document.createElement('div');
		container.className = 'diff-review-table';
		container.setAttribute('role', 'list');
		container.setAttribute('aria-label', localize('ariaLabel', 'Accessible Diff Viewer. Use arrow up and down to navigate.'));
		applyFontInfo(container, modifiedOptions.get(EditorOption.fontInfo));

		reset(this._content, container);

		const originalModel = this._models.getOriginalModel();
		const modifiedModel = this._models.getModifiedModel();
		if (!originalModel || !modifiedModel) {
			return;
		}

		const originalModelOpts = originalModel.getOptions();
		const modifiedModelOpts = modifiedModel.getOptions();

		const lineHeight = modifiedOptions.get(EditorOption.lineHeight);
		const group = this._model.currentGroup.get();
		for (const viewItem of group?.lines || []) {
			if (!group) {
				break;
			}
			let row: HTMLDivElement;

			if (viewItem.type === LineType.Header) {

				const header = document.createElement('div');
				header.className = 'diff-review-row';
				header.setAttribute('role', 'listitem');

				const r = group.range;
				const diffIndex = this._model.currentGroupIndex.get();
				const diffsLength = this._model.groups.get().length;
				const getAriaLines = (lines: number) =>
					lines === 0 ? localize('no_lines_changed', "no lines changed")
						: lines === 1 ? localize('one_line_changed', "1 line changed")
							: localize('more_lines_changed', "{0} lines changed", lines);

				const originalChangedLinesCntAria = getAriaLines(r.original.length);
				const modifiedChangedLinesCntAria = getAriaLines(r.modified.length);
				header.setAttribute('aria-label', localize({
					key: 'header',
					comment: [
						'This is the ARIA label for a git diff header.',
						'A git diff header looks like this: @@ -154,12 +159,39 @@.',
						'That encodes that at original line 154 (which is now line 159), 12 lines were removed/changed with 39 lines.',
						'Variables 0 and 1 refer to the diff index out of total number of diffs.',
						'Variables 2 and 4 will be numbers (a line number).',
						'Variables 3 and 5 will be "no lines changed", "1 line changed" or "X lines changed", localized separately.'
					]
				}, "Difference {0} of {1}: original line {2}, {3}, modified line {4}, {5}",
					(diffIndex + 1),
					diffsLength,
					r.original.startLineNumber,
					originalChangedLinesCntAria,
					r.modified.startLineNumber,
					modifiedChangedLinesCntAria
				));

				const cell = document.createElement('div');
				cell.className = 'diff-review-cell diff-review-summary';
				// e.g.: `1/10: @@ -504,7 +517,7 @@`
				cell.appendChild(document.createTextNode(`${diffIndex + 1}/${diffsLength}: @@ -${r.original.startLineNumber},${r.original.length} +${r.modified.startLineNumber},${r.modified.length} @@`));
				header.appendChild(cell);

				row = header;
			} else {
				row = this._createRow(viewItem, lineHeight,
					this._width.get(), originalOptions, originalModel, originalModelOpts, modifiedOptions, modifiedModel, modifiedModelOpts,
				);
			}

			container.appendChild(row);

			const isSelectedObs = derived(reader => /** @description isSelected */ this._model.currentElement.read(reader) === viewItem);

			store.add(autorun(reader => {
				/** @description update tab index */
				const isSelected = isSelectedObs.read(reader);
				row.tabIndex = isSelected ? 0 : -1;
				if (isSelected) {
					row.focus();
				}
			}));

			store.add(addDisposableListener(row, 'focus', () => {
				this._model.goToLine(viewItem);
			}));
		}

		this._scrollbar.scanDomNode();
	}

	private _createRow(
		item: DeletedLineViewElement | AddedLineViewElement | UnchangedLineViewElement,
		lineHeight: number,
		width: number,
		originalOptions: IComputedEditorOptions, originalModel: ITextModel, originalModelOpts: TextModelResolvedOptions,
		modifiedOptions: IComputedEditorOptions, modifiedModel: ITextModel, modifiedModelOpts: TextModelResolvedOptions,
	): HTMLDivElement {
		const originalLayoutInfo = originalOptions.get(EditorOption.layoutInfo);
		const originalLineNumbersWidth = originalLayoutInfo.glyphMarginWidth + originalLayoutInfo.lineNumbersWidth;

		const modifiedLayoutInfo = modifiedOptions.get(EditorOption.layoutInfo);
		const modifiedLineNumbersWidth = 10 + modifiedLayoutInfo.glyphMarginWidth + modifiedLayoutInfo.lineNumbersWidth;

		let rowClassName: string = 'diff-review-row';
		let lineNumbersExtraClassName: string = '';
		const spacerClassName: string = 'diff-review-spacer';
		let spacerIcon: ThemeIcon | null = null;
		switch (item.type) {
			case LineType.Added:
				rowClassName = 'diff-review-row line-insert';
				lineNumbersExtraClassName = ' char-insert';
				spacerIcon = accessibleDiffViewerInsertIcon;
				break;
			case LineType.Deleted:
				rowClassName = 'diff-review-row line-delete';
				lineNumbersExtraClassName = ' char-delete';
				spacerIcon = accessibleDiffViewerRemoveIcon;
				break;
		}

		const row = document.createElement('div');
		row.style.minWidth = width + 'px';
		row.className = rowClassName;
		row.setAttribute('role', 'listitem');
		row.ariaLevel = '';

		const cell = document.createElement('div');
		cell.className = 'diff-review-cell';
		cell.style.height = `${lineHeight}px`;
		row.appendChild(cell);

		const originalLineNumber = document.createElement('span');
		originalLineNumber.style.width = (originalLineNumbersWidth + 'px');
		originalLineNumber.style.minWidth = (originalLineNumbersWidth + 'px');
		originalLineNumber.className = 'diff-review-line-number' + lineNumbersExtraClassName;
		if (item.originalLineNumber !== undefined) {
			originalLineNumber.appendChild(document.createTextNode(String(item.originalLineNumber)));
		} else {
			originalLineNumber.innerText = '\u00a0';
		}
		cell.appendChild(originalLineNumber);

		const modifiedLineNumber = document.createElement('span');
		modifiedLineNumber.style.width = (modifiedLineNumbersWidth + 'px');
		modifiedLineNumber.style.minWidth = (modifiedLineNumbersWidth + 'px');
		modifiedLineNumber.style.paddingRight = '10px';
		modifiedLineNumber.className = 'diff-review-line-number' + lineNumbersExtraClassName;
		if (item.modifiedLineNumber !== undefined) {
			modifiedLineNumber.appendChild(document.createTextNode(String(item.modifiedLineNumber)));
		} else {
			modifiedLineNumber.innerText = '\u00a0';
		}
		cell.appendChild(modifiedLineNumber);

		const spacer = document.createElement('span');
		spacer.className = spacerClassName;

		if (spacerIcon) {
			const spacerCodicon = document.createElement('span');
			spacerCodicon.className = ThemeIcon.asClassName(spacerIcon);
			spacerCodicon.innerText = '\u00a0\u00a0';
			spacer.appendChild(spacerCodicon);
		} else {
			spacer.innerText = '\u00a0\u00a0';
		}
		cell.appendChild(spacer);

		let lineContent: string;
		if (item.modifiedLineNumber !== undefined) {
			let html: string | TrustedHTML = this._getLineHtml(modifiedModel, modifiedOptions, modifiedModelOpts.tabSize, item.modifiedLineNumber, this._languageService.languageIdCodec);
			if (AccessibleDiffViewer._ttPolicy) {
				html = AccessibleDiffViewer._ttPolicy.createHTML(html);
			}
			cell.insertAdjacentHTML('beforeend', html as string);
			lineContent = modifiedModel.getLineContent(item.modifiedLineNumber);
		} else {
			let html: string | TrustedHTML = this._getLineHtml(originalModel, originalOptions, originalModelOpts.tabSize, item.originalLineNumber, this._languageService.languageIdCodec);
			if (AccessibleDiffViewer._ttPolicy) {
				html = AccessibleDiffViewer._ttPolicy.createHTML(html);
			}
			cell.insertAdjacentHTML('beforeend', html as string);
			lineContent = originalModel.getLineContent(item.originalLineNumber);
		}

		if (lineContent.length === 0) {
			lineContent = localize('blankLine', "blank");
		}

		let ariaLabel: string = '';
		switch (item.type) {
			case LineType.Unchanged:
				if (item.originalLineNumber === item.modifiedLineNumber) {
					ariaLabel = localize({ key: 'unchangedLine', comment: ['The placeholders are contents of the line and should not be translated.'] }, "{0} unchanged line {1}", lineContent, item.originalLineNumber);
				} else {
					ariaLabel = localize('equalLine', "{0} original line {1} modified line {2}", lineContent, item.originalLineNumber, item.modifiedLineNumber);
				}
				break;
			case LineType.Added:
				ariaLabel = localize('insertLine', "+ {0} modified line {1}", lineContent, item.modifiedLineNumber);
				break;
			case LineType.Deleted:
				ariaLabel = localize('deleteLine', "- {0} original line {1}", lineContent, item.originalLineNumber);
				break;
		}
		row.setAttribute('aria-label', ariaLabel);

		return row;
	}

	private _getLineHtml(model: ITextModel, options: IComputedEditorOptions, tabSize: number, lineNumber: number, languageIdCodec: ILanguageIdCodec): string {
		const lineContent = model.getLineContent(lineNumber);
		const fontInfo = options.get(EditorOption.fontInfo);
		const verticalScrollbarSize = options.get(EditorOption.scrollbar).verticalScrollbarSize;
		const lineTokens = LineTokens.createEmpty(lineContent, languageIdCodec);
		const isBasicASCII = ViewLineRenderingData.isBasicASCII(lineContent, model.mightContainNonBasicASCII());
		const containsRTL = ViewLineRenderingData.containsRTL(lineContent, isBasicASCII, model.mightContainRTL());
		const r = renderViewLine2(new RenderLineInput(
			(fontInfo.isMonospace && !options.get(EditorOption.disableMonospaceOptimizations)),
			fontInfo.canUseHalfwidthRightwardsArrow,
			lineContent,
			false,
			isBasicASCII,
			containsRTL,
			0,
			lineTokens,
			[],
			tabSize,
			0,
			fontInfo.spaceWidth,
			fontInfo.middotWidth,
			fontInfo.wsmiddotWidth,
			options.get(EditorOption.stopRenderingLineAfter),
			options.get(EditorOption.renderWhitespace),
			options.get(EditorOption.renderControlCharacters),
			options.get(EditorOption.fontLigatures) !== EditorFontLigatures.OFF,
			null,
			null,
			verticalScrollbarSize
		));

		return r.html;
	}
}

export class AccessibleDiffViewerModelFromEditors implements IAccessibleDiffViewerModel {
	constructor(private readonly editors: DiffEditorEditors) { }

	getOriginalModel(): ITextModel {
		return this.editors.original.getModel()!;
	}

	getOriginalOptions(): IComputedEditorOptions {
		return this.editors.original.getOptions();
	}

	originalReveal(range: Range): void {
		this.editors.original.revealRange(range);
		this.editors.original.setSelection(range);
		this.editors.original.focus();
	}

	getModifiedModel(): ITextModel {
		return this.editors.modified.getModel()!;
	}

	getModifiedOptions(): IComputedEditorOptions {
		return this.editors.modified.getOptions();
	}

	modifiedReveal(range?: Range | undefined): void {
		if (range) {
			this.editors.modified.revealRange(range);
			this.editors.modified.setSelection(range);
		}
		this.editors.modified.focus();
	}

	modifiedSetSelection(range: Range): void {
		this.editors.modified.setSelection(range);
	}

	modifiedFocus(): void {
		this.editors.modified.focus();
	}

	getModifiedPosition(): Position | undefined {
		return this.editors.modified.getPosition() ?? undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/components/diffEditorDecorations.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/components/diffEditorDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IObservable, derived } from '../../../../../base/common/observable.js';
import { DiffEditorEditors } from './diffEditorEditors.js';
import { allowsTrueInlineDiffRendering } from './diffEditorViewZones/diffEditorViewZones.js';
import { DiffEditorOptions } from '../diffEditorOptions.js';
import { DiffEditorViewModel } from '../diffEditorViewModel.js';
import { DiffEditorWidget } from '../diffEditorWidget.js';
import { MovedBlocksLinesFeature } from '../features/movedBlocksLinesFeature.js';
import { diffAddDecoration, diffAddDecorationEmpty, diffDeleteDecoration, diffDeleteDecorationEmpty, diffLineAddDecorationBackground, diffLineAddDecorationBackgroundWithIndicator, diffLineDeleteDecorationBackground, diffLineDeleteDecorationBackgroundWithIndicator, diffWholeLineAddDecoration, diffWholeLineDeleteDecoration } from '../registrations.contribution.js';
import { applyObservableDecorations } from '../utils.js';
import { IModelDeltaDecoration } from '../../../../common/model.js';

export class DiffEditorDecorations extends Disposable {
	constructor(
		private readonly _editors: DiffEditorEditors,
		private readonly _diffModel: IObservable<DiffEditorViewModel | undefined>,
		private readonly _options: DiffEditorOptions,
		widget: DiffEditorWidget,
	) {
		super();

		this._register(applyObservableDecorations(this._editors.original, this._decorations.map(d => d?.originalDecorations || [])));
		this._register(applyObservableDecorations(this._editors.modified, this._decorations.map(d => d?.modifiedDecorations || [])));
	}

	private readonly _decorations = derived(this, (reader) => {
		const diffModel = this._diffModel.read(reader);
		const diff = diffModel?.diff.read(reader);
		if (!diff) {
			return null;
		}

		const movedTextToCompare = this._diffModel.read(reader)!.movedTextToCompare.read(reader);
		const renderIndicators = this._options.renderIndicators.read(reader);
		const showEmptyDecorations = this._options.showEmptyDecorations.read(reader);

		const originalDecorations: IModelDeltaDecoration[] = [];
		const modifiedDecorations: IModelDeltaDecoration[] = [];
		if (!movedTextToCompare) {
			for (const m of diff.mappings) {
				if (!m.lineRangeMapping.original.isEmpty) {
					originalDecorations.push({ range: m.lineRangeMapping.original.toInclusiveRange()!, options: renderIndicators ? diffLineDeleteDecorationBackgroundWithIndicator : diffLineDeleteDecorationBackground });
				}
				if (!m.lineRangeMapping.modified.isEmpty) {
					modifiedDecorations.push({ range: m.lineRangeMapping.modified.toInclusiveRange()!, options: renderIndicators ? diffLineAddDecorationBackgroundWithIndicator : diffLineAddDecorationBackground });
				}

				if (m.lineRangeMapping.modified.isEmpty || m.lineRangeMapping.original.isEmpty) {
					if (!m.lineRangeMapping.original.isEmpty) {
						originalDecorations.push({ range: m.lineRangeMapping.original.toInclusiveRange()!, options: diffWholeLineDeleteDecoration });
					}
					if (!m.lineRangeMapping.modified.isEmpty) {
						modifiedDecorations.push({ range: m.lineRangeMapping.modified.toInclusiveRange()!, options: diffWholeLineAddDecoration });
					}
				} else {
					const useInlineDiff = this._options.useTrueInlineDiffRendering.read(reader) && allowsTrueInlineDiffRendering(m.lineRangeMapping);
					for (const i of m.lineRangeMapping.innerChanges || []) {
						// Don't show empty markers outside the line range
						if (m.lineRangeMapping.original.contains(i.originalRange.startLineNumber)) {
							originalDecorations.push({ range: i.originalRange, options: (i.originalRange.isEmpty() && showEmptyDecorations) ? diffDeleteDecorationEmpty : diffDeleteDecoration });
						}
						if (m.lineRangeMapping.modified.contains(i.modifiedRange.startLineNumber)) {
							modifiedDecorations.push({ range: i.modifiedRange, options: (i.modifiedRange.isEmpty() && showEmptyDecorations && !useInlineDiff) ? diffAddDecorationEmpty : diffAddDecoration });
						}
						if (useInlineDiff) {
							const deletedText = diffModel!.model.original.getValueInRange(i.originalRange);
							modifiedDecorations.push({
								range: i.modifiedRange,
								options: {
									description: 'deleted-text',
									before: {
										content: deletedText,
										inlineClassName: 'inline-deleted-text',
									},
									zIndex: 100000,
									showIfCollapsed: true,
								}
							});
						}
					}
				}
			}
		}

		if (movedTextToCompare) {
			for (const m of movedTextToCompare.changes) {
				const fullRangeOriginal = m.original.toInclusiveRange();
				if (fullRangeOriginal) {
					originalDecorations.push({ range: fullRangeOriginal, options: renderIndicators ? diffLineDeleteDecorationBackgroundWithIndicator : diffLineDeleteDecorationBackground });
				}
				const fullRangeModified = m.modified.toInclusiveRange();
				if (fullRangeModified) {
					modifiedDecorations.push({ range: fullRangeModified, options: renderIndicators ? diffLineAddDecorationBackgroundWithIndicator : diffLineAddDecorationBackground });
				}

				for (const i of m.innerChanges || []) {
					originalDecorations.push({ range: i.originalRange, options: diffDeleteDecoration });
					modifiedDecorations.push({ range: i.modifiedRange, options: diffAddDecoration });
				}
			}
		}
		const activeMovedText = this._diffModel.read(reader)!.activeMovedText.read(reader);

		for (const m of diff.movedTexts) {
			originalDecorations.push({
				range: m.lineRangeMapping.original.toInclusiveRange()!, options: {
					description: 'moved',
					blockClassName: 'movedOriginal' + (m === activeMovedText ? ' currentMove' : ''),
					blockPadding: [MovedBlocksLinesFeature.movedCodeBlockPadding, 0, MovedBlocksLinesFeature.movedCodeBlockPadding, MovedBlocksLinesFeature.movedCodeBlockPadding],
				}
			});

			modifiedDecorations.push({
				range: m.lineRangeMapping.modified.toInclusiveRange()!, options: {
					description: 'moved',
					blockClassName: 'movedModified' + (m === activeMovedText ? ' currentMove' : ''),
					blockPadding: [4, 0, 4, 4],
				}
			});
		}

		return { originalDecorations, modifiedDecorations };
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/components/diffEditorEditors.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/components/diffEditorEditors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IReader, autorunHandleChanges, derived, derivedOpts, observableFromEvent } from '../../../../../base/common/observable.js';
import { IEditorConstructionOptions } from '../../../config/editorConfiguration.js';
import { IDiffEditorConstructionOptions } from '../../../editorBrowser.js';
import { observableCodeEditor } from '../../../observableCodeEditor.js';
import { CodeEditorWidget, ICodeEditorWidgetOptions } from '../../codeEditor/codeEditorWidget.js';
import { IDiffCodeEditorWidgetOptions } from '../diffEditorWidget.js';
import { OverviewRulerFeature } from '../features/overviewRulerFeature.js';
import { EditorOptions, IEditorOptions } from '../../../../common/config/editorOptions.js';
import { Position } from '../../../../common/core/position.js';
import { IContentSizeChangedEvent } from '../../../../common/editorCommon.js';
import { localize } from '../../../../../nls.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { DiffEditorOptions } from '../diffEditorOptions.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';

export class DiffEditorEditors extends Disposable {
	public readonly original;
	public readonly modified;

	private readonly _onDidContentSizeChange;
	public get onDidContentSizeChange() { return this._onDidContentSizeChange.event; }

	public readonly modifiedScrollTop;
	public readonly modifiedScrollHeight;

	public readonly modifiedObs;
	public readonly originalObs;

	public readonly modifiedModel;

	public readonly modifiedSelections;
	public readonly modifiedCursor;

	public readonly originalCursor;

	public readonly isOriginalFocused;
	public readonly isModifiedFocused;

	public readonly isFocused;

	constructor(
		private readonly originalEditorElement: HTMLElement,
		private readonly modifiedEditorElement: HTMLElement,
		private readonly _options: DiffEditorOptions,
		private _argCodeEditorWidgetOptions: IDiffCodeEditorWidgetOptions,
		private readonly _createInnerEditor: (instantiationService: IInstantiationService, container: HTMLElement, options: Readonly<IEditorOptions>, editorWidgetOptions: ICodeEditorWidgetOptions) => CodeEditorWidget,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService
	) {
		super();
		this.original = this._register(this._createLeftHandSideEditor(this._options.editorOptions.get(), this._argCodeEditorWidgetOptions.originalEditor || {}));
		this.modified = this._register(this._createRightHandSideEditor(this._options.editorOptions.get(), this._argCodeEditorWidgetOptions.modifiedEditor || {}));
		this._onDidContentSizeChange = this._register(new Emitter<IContentSizeChangedEvent>());
		this.modifiedScrollTop = observableFromEvent(this, this.modified.onDidScrollChange, () => /** @description modified.getScrollTop */ this.modified.getScrollTop());
		this.modifiedScrollHeight = observableFromEvent(this, this.modified.onDidScrollChange, () => /** @description modified.getScrollHeight */ this.modified.getScrollHeight());
		this.modifiedObs = observableCodeEditor(this.modified);
		this.originalObs = observableCodeEditor(this.original);
		this.modifiedModel = this.modifiedObs.model;
		this.modifiedSelections = observableFromEvent(this, this.modified.onDidChangeCursorSelection, () => this.modified.getSelections() ?? []);
		this.modifiedCursor = derivedOpts({ owner: this, equalsFn: Position.equals }, reader => this.modifiedSelections.read(reader)[0]?.getPosition() ?? new Position(1, 1));
		this.originalCursor = observableFromEvent(this, this.original.onDidChangeCursorPosition, () => this.original.getPosition() ?? new Position(1, 1));
		this.isOriginalFocused = observableCodeEditor(this.original).isFocused;
		this.isModifiedFocused = observableCodeEditor(this.modified).isFocused;
		this.isFocused = derived(this, reader => this.isOriginalFocused.read(reader) || this.isModifiedFocused.read(reader));

		// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
		this._argCodeEditorWidgetOptions = null as any;

		this._register(autorunHandleChanges({
			changeTracker: {
				createChangeSummary: (): IDiffEditorConstructionOptions => ({}),
				handleChange: (ctx, changeSummary) => {
					if (ctx.didChange(_options.editorOptions)) {
						Object.assign(changeSummary, ctx.change.changedOptions);
					}
					return true;
				}
			}
		}, (reader, changeSummary) => {
			/** @description update editor options */
			_options.editorOptions.read(reader);

			this._options.renderSideBySide.read(reader);

			this.modified.updateOptions(this._adjustOptionsForRightHandSide(reader, changeSummary));
			this.original.updateOptions(this._adjustOptionsForLeftHandSide(reader, changeSummary));
		}));
	}

	private _createLeftHandSideEditor(options: Readonly<IDiffEditorConstructionOptions>, codeEditorWidgetOptions: ICodeEditorWidgetOptions): CodeEditorWidget {
		const leftHandSideOptions = this._adjustOptionsForLeftHandSide(undefined, options);
		const editor = this._constructInnerEditor(this._instantiationService, this.originalEditorElement, leftHandSideOptions, codeEditorWidgetOptions);

		const isInDiffLeftEditorKey = this._contextKeyService.createKey<boolean>('isInDiffLeftEditor', editor.hasWidgetFocus());
		this._register(editor.onDidFocusEditorWidget(() => isInDiffLeftEditorKey.set(true)));
		this._register(editor.onDidBlurEditorWidget(() => isInDiffLeftEditorKey.set(false)));

		return editor;
	}

	private _createRightHandSideEditor(options: Readonly<IDiffEditorConstructionOptions>, codeEditorWidgetOptions: ICodeEditorWidgetOptions): CodeEditorWidget {
		const rightHandSideOptions = this._adjustOptionsForRightHandSide(undefined, options);
		const editor = this._constructInnerEditor(this._instantiationService, this.modifiedEditorElement, rightHandSideOptions, codeEditorWidgetOptions);

		const isInDiffRightEditorKey = this._contextKeyService.createKey<boolean>('isInDiffRightEditor', editor.hasWidgetFocus());
		this._register(editor.onDidFocusEditorWidget(() => isInDiffRightEditorKey.set(true)));
		this._register(editor.onDidBlurEditorWidget(() => isInDiffRightEditorKey.set(false)));

		return editor;
	}

	private _constructInnerEditor(instantiationService: IInstantiationService, container: HTMLElement, options: Readonly<IEditorConstructionOptions>, editorWidgetOptions: ICodeEditorWidgetOptions): CodeEditorWidget {
		const editor = this._createInnerEditor(instantiationService, container, options, editorWidgetOptions);

		this._register(editor.onDidContentSizeChange(e => {
			const width = this.original.getContentWidth() + this.modified.getContentWidth() + OverviewRulerFeature.ENTIRE_DIFF_OVERVIEW_WIDTH;
			const height = Math.max(this.modified.getContentHeight(), this.original.getContentHeight());

			this._onDidContentSizeChange.fire({
				contentHeight: height,
				contentWidth: width,
				contentHeightChanged: e.contentHeightChanged,
				contentWidthChanged: e.contentWidthChanged
			});
		}));
		return editor;
	}

	private _adjustOptionsForLeftHandSide(_reader: IReader | undefined, changedOptions: Readonly<IDiffEditorConstructionOptions>): IEditorConstructionOptions {
		const result = this._adjustOptionsForSubEditor(changedOptions);
		if (!this._options.renderSideBySide.get()) {
			// never wrap hidden editor
			result.wordWrapOverride1 = 'off';
			result.wordWrapOverride2 = 'off';
			result.stickyScroll = { enabled: false };

			// Disable unicode highlighting for the original side in inline mode, as they are not shown anyway.
			result.unicodeHighlight = { nonBasicASCII: false, ambiguousCharacters: false, invisibleCharacters: false };
		} else {
			result.unicodeHighlight = this._options.editorOptions.get().unicodeHighlight || {};
			result.wordWrapOverride1 = this._options.diffWordWrap.get();
		}
		result.glyphMargin = this._options.renderSideBySide.get();

		if (changedOptions.originalAriaLabel) {
			result.ariaLabel = changedOptions.originalAriaLabel;
		}
		result.ariaLabel = this._updateAriaLabel(result.ariaLabel);
		result.readOnly = !this._options.originalEditable.get();
		result.dropIntoEditor = { enabled: !result.readOnly };
		result.extraEditorClassName = 'original-in-monaco-diff-editor';
		return result;
	}

	private _adjustOptionsForRightHandSide(reader: IReader | undefined, changedOptions: Readonly<IDiffEditorConstructionOptions>): IEditorConstructionOptions {
		const result = this._adjustOptionsForSubEditor(changedOptions);
		if (changedOptions.modifiedAriaLabel) {
			result.ariaLabel = changedOptions.modifiedAriaLabel;
		}
		result.ariaLabel = this._updateAriaLabel(result.ariaLabel);
		result.wordWrapOverride1 = this._options.diffWordWrap.get();
		result.revealHorizontalRightPadding = EditorOptions.revealHorizontalRightPadding.defaultValue + OverviewRulerFeature.ENTIRE_DIFF_OVERVIEW_WIDTH;
		result.scrollbar!.verticalHasArrows = false;
		result.extraEditorClassName = 'modified-in-monaco-diff-editor';
		return result;
	}

	private _adjustOptionsForSubEditor(options: Readonly<IDiffEditorConstructionOptions>): IEditorConstructionOptions {
		const clonedOptions = {
			...options,
			dimension: {
				height: 0,
				width: 0
			},
		};
		clonedOptions.inDiffEditor = true;
		clonedOptions.automaticLayout = false;
		clonedOptions.allowVariableLineHeights = false;
		clonedOptions.allowVariableFonts = false;
		clonedOptions.allowVariableFontsInAccessibilityMode = false;

		// Clone scrollbar options before changing them
		clonedOptions.scrollbar = { ...(clonedOptions.scrollbar || {}) };
		clonedOptions.folding = false;
		clonedOptions.codeLens = this._options.diffCodeLens.get();
		clonedOptions.fixedOverflowWidgets = true;

		// Clone minimap options before changing them
		clonedOptions.minimap = { ...(clonedOptions.minimap || {}) };
		clonedOptions.minimap.enabled = false;

		if (this._options.hideUnchangedRegions.get()) {
			clonedOptions.stickyScroll = { enabled: false };
		} else {
			clonedOptions.stickyScroll = this._options.editorOptions.get().stickyScroll;
		}
		return clonedOptions;
	}

	private _updateAriaLabel(ariaLabel: string | undefined): string | undefined {
		if (!ariaLabel) {
			ariaLabel = '';
		}
		const ariaNavigationTip = localize('diff-aria-navigation-tip', ' use {0} to open the accessibility help.', this._keybindingService.lookupKeybinding('editor.action.accessibilityHelp')?.getAriaLabel());
		if (this._options.accessibilityVerbose.get()) {
			return ariaLabel + ariaNavigationTip;
		} else if (ariaLabel) {
			return ariaLabel.replaceAll(ariaNavigationTip, '');
		}
		return '';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/components/diffEditorSash.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/components/diffEditorSash.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IBoundarySashes, ISashEvent, Orientation, Sash, SashState } from '../../../../../base/browser/ui/sash/sash.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IObservable, IReader, ISettableObservable, autorun, derivedWithSetter, observableValue } from '../../../../../base/common/observable.js';
import { DiffEditorOptions } from '../diffEditorOptions.js';

export class SashLayout {
	public readonly sashLeft = derivedWithSetter(this, reader => {
		const ratio = this._sashRatio.read(reader) ?? this._options.splitViewDefaultRatio.read(reader);
		return this._computeSashLeft(ratio, reader);
	}, (value, tx) => {
		const contentWidth = this.dimensions.width.get();
		this._sashRatio.set(value / contentWidth, tx);
	});

	private readonly _sashRatio = observableValue<number | undefined>(this, undefined);

	public resetSash(): void {
		this._sashRatio.set(undefined, undefined);
	}

	constructor(
		private readonly _options: DiffEditorOptions,
		public readonly dimensions: { height: IObservable<number>; width: IObservable<number> },
	) {
	}

	/** @pure */
	private _computeSashLeft(desiredRatio: number, reader: IReader | undefined): number {
		const contentWidth = this.dimensions.width.read(reader);
		const midPoint = Math.floor(this._options.splitViewDefaultRatio.read(reader) * contentWidth);
		const sashLeft = this._options.enableSplitViewResizing.read(reader) ? Math.floor(desiredRatio * contentWidth) : midPoint;

		const MINIMUM_EDITOR_WIDTH = 100;
		if (contentWidth <= MINIMUM_EDITOR_WIDTH * 2) {
			return midPoint;
		}
		if (sashLeft < MINIMUM_EDITOR_WIDTH) {
			return MINIMUM_EDITOR_WIDTH;
		}
		if (sashLeft > contentWidth - MINIMUM_EDITOR_WIDTH) {
			return contentWidth - MINIMUM_EDITOR_WIDTH;
		}
		return sashLeft;
	}
}

export class DiffEditorSash extends Disposable {
	private readonly _sash;

	private _startSashPosition: number | undefined;

	constructor(
		private readonly _domNode: HTMLElement,
		private readonly _dimensions: { height: IObservable<number>; width: IObservable<number> },
		private readonly _enabled: IObservable<boolean>,
		private readonly _boundarySashes: IObservable<IBoundarySashes | undefined>,
		public readonly sashLeft: ISettableObservable<number>,
		private readonly _resetSash: () => void,
	) {
		super();
		this._sash = this._register(new Sash(this._domNode, {
			getVerticalSashTop: (_sash: Sash): number => 0,
			getVerticalSashLeft: (_sash: Sash): number => this.sashLeft.get(),
			getVerticalSashHeight: (_sash: Sash): number => this._dimensions.height.get(),
		}, { orientation: Orientation.VERTICAL }));
		this._startSashPosition = undefined;

		this._register(this._sash.onDidStart(() => {
			this._startSashPosition = this.sashLeft.get();
		}));
		this._register(this._sash.onDidChange((e: ISashEvent) => {
			this.sashLeft.set(this._startSashPosition! + (e.currentX - e.startX), undefined);
		}));
		this._register(this._sash.onDidEnd(() => this._sash.layout()));
		this._register(this._sash.onDidReset(() => this._resetSash()));

		this._register(autorun(reader => {
			const sashes = this._boundarySashes.read(reader);
			if (sashes) {
				this._sash.orthogonalEndSash = sashes.bottom;
			}
		}));

		this._register(autorun(reader => {
			/** @description DiffEditorSash.layoutSash */
			const enabled = this._enabled.read(reader);
			this._sash.state = enabled ? SashState.Enabled : SashState.Disabled;
			this.sashLeft.read(reader);
			this._dimensions.height.read(reader);
			this._sash.layout();
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/components/diffEditorViewZones/copySelection.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/components/diffEditorViewZones/copySelection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener } from '../../../../../../base/browser/dom.js';
import { DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { Range } from '../../../../../common/core/range.js';
import { DetailedLineRangeMapping } from '../../../../../common/diff/rangeMapping.js';
import { ITextModel } from '../../../../../common/model.js';
import { IClipboardService } from '../../../../../../platform/clipboard/common/clipboardService.js';
import { RenderLinesResult } from './renderLines.js';

export interface IEnableViewZoneCopySelectionOptions {
	/** The view zone HTML element that contains the deleted codes. */
	domNode: HTMLElement;

	/** The diff entry for the current view zone. */
	diffEntry: DetailedLineRangeMapping;

	/** The original text model, to get the original text based on selection. */
	originalModel: ITextModel;

	/** The render lines result that can translate DOM positions to model positions. */
	renderLinesResult: RenderLinesResult;

	/** The clipboard service to write the selected text to. */
	clipboardService: IClipboardService;
}

export function enableCopySelection(options: IEnableViewZoneCopySelectionOptions): DisposableStore {
	const { domNode, renderLinesResult, diffEntry, originalModel, clipboardService } = options;
	const viewZoneDisposable = new DisposableStore();

	viewZoneDisposable.add(addDisposableListener(domNode, 'copy', (e) => {
		e.preventDefault();
		const selection = domNode.ownerDocument.getSelection();
		if (!selection || selection.rangeCount === 0) {
			return;
		}

		const domRange = selection.getRangeAt(0);
		if (!domRange || domRange.collapsed) {
			return;
		}

		const startElement = domRange.startContainer.nodeType === Node.TEXT_NODE
			? domRange.startContainer.parentElement
			: domRange.startContainer as HTMLElement;
		const endElement = domRange.endContainer.nodeType === Node.TEXT_NODE
			? domRange.endContainer.parentElement
			: domRange.endContainer as HTMLElement;

		if (!startElement || !endElement) {
			return;
		}

		const startPosition = renderLinesResult.getModelPositionAt(startElement, domRange.startOffset);
		const endPosition = renderLinesResult.getModelPositionAt(endElement, domRange.endOffset);

		if (!startPosition || !endPosition) {
			return;
		}

		const adjustedStart = startPosition.delta(diffEntry.original.startLineNumber - 1);
		const adjustedEnd = endPosition.delta(diffEntry.original.startLineNumber - 1);

		const range = adjustedEnd.isBefore(adjustedStart) ?
			Range.fromPositions(adjustedEnd, adjustedStart) :
			Range.fromPositions(adjustedStart, adjustedEnd);

		const selectedText = originalModel.getValueInRange(range);
		clipboardService.writeText(selectedText);
	}));

	return viewZoneDisposable;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/components/diffEditorViewZones/diffEditorViewZones.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/components/diffEditorViewZones/diffEditorViewZones.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, addDisposableListener } from '../../../../../../base/browser/dom.js';
import { ArrayQueue } from '../../../../../../base/common/arrays.js';
import { RunOnceScheduler } from '../../../../../../base/common/async.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { Disposable, DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { IObservable, autorun, derived, observableFromEvent, observableValue } from '../../../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { assertReturnsDefined } from '../../../../../../base/common/types.js';
import { applyFontInfo } from '../../../../config/domFontInfo.js';
import { CodeEditorWidget } from '../../../codeEditor/codeEditorWidget.js';
import { diffDeleteDecoration, diffRemoveIcon } from '../../registrations.contribution.js';
import { DiffEditorEditors } from '../diffEditorEditors.js';
import { DiffEditorViewModel, DiffMapping } from '../../diffEditorViewModel.js';
import { DiffEditorWidget } from '../../diffEditorWidget.js';
import { InlineDiffDeletedCodeMargin } from './inlineDiffDeletedCodeMargin.js';
import { LineSource, RenderOptions, renderLines } from './renderLines.js';
import { IObservableViewZone, animatedObservable, joinCombine } from '../../utils.js';
import { EditorOption } from '../../../../../common/config/editorOptions.js';
import { LineRange } from '../../../../../common/core/ranges/lineRange.js';
import { Position } from '../../../../../common/core/position.js';
import { DetailedLineRangeMapping } from '../../../../../common/diff/rangeMapping.js';
import { ScrollType } from '../../../../../common/editorCommon.js';
import { BackgroundTokenizationState } from '../../../../../common/tokenizationTextModelPart.js';
import { IClipboardService } from '../../../../../../platform/clipboard/common/clipboardService.js';
import { IContextMenuService } from '../../../../../../platform/contextview/browser/contextView.js';
import { DiffEditorOptions } from '../../diffEditorOptions.js';
import { Range } from '../../../../../common/core/range.js';
import { InlineDecoration, InlineDecorationType } from '../../../../../common/viewModel/inlineDecorations.js';

/**
 * Ensures both editors have the same height by aligning unchanged lines.
 * In inline view mode, inserts viewzones to show deleted code from the original text model in the modified code editor.
 * Synchronizes scrolling.
 *
 * Make sure to add the view zones!
 */
export class DiffEditorViewZones extends Disposable {
	private readonly _originalTopPadding;
	private readonly _originalScrollTop: IObservable<number>;
	private readonly _originalScrollOffset;
	private readonly _originalScrollOffsetAnimated;

	private readonly _modifiedTopPadding;
	private readonly _modifiedScrollTop: IObservable<number>;
	private readonly _modifiedScrollOffset;
	private readonly _modifiedScrollOffsetAnimated;

	public readonly viewZones: IObservable<{ orig: IObservableViewZone[]; mod: IObservableViewZone[] }>;

	constructor(
		private readonly _targetWindow: Window,
		private readonly _editors: DiffEditorEditors,
		private readonly _diffModel: IObservable<DiffEditorViewModel | undefined>,
		private readonly _options: DiffEditorOptions,
		private readonly _diffEditorWidget: DiffEditorWidget,
		private readonly _canIgnoreViewZoneUpdateEvent: () => boolean,
		private readonly _origViewZonesToIgnore: Set<string>,
		private readonly _modViewZonesToIgnore: Set<string>,
		@IClipboardService private readonly _clipboardService: IClipboardService,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
	) {
		super();
		this._originalTopPadding = observableValue(this, 0);
		this._originalScrollOffset = observableValue<number, boolean>(this, 0);
		this._originalScrollOffsetAnimated = animatedObservable(this._targetWindow, this._originalScrollOffset, this._store);
		this._modifiedTopPadding = observableValue(this, 0);
		this._modifiedScrollOffset = observableValue<number, boolean>(this, 0);
		this._modifiedScrollOffsetAnimated = animatedObservable(this._targetWindow, this._modifiedScrollOffset, this._store);

		const state = observableValue('invalidateAlignmentsState', 0);

		const updateImmediately = this._register(new RunOnceScheduler(() => {
			state.set(state.get() + 1, undefined);
		}, 0));

		this._register(this._editors.original.onDidChangeViewZones((_args) => { if (!this._canIgnoreViewZoneUpdateEvent()) { updateImmediately.schedule(); } }));
		this._register(this._editors.modified.onDidChangeViewZones((_args) => { if (!this._canIgnoreViewZoneUpdateEvent()) { updateImmediately.schedule(); } }));
		this._register(this._editors.original.onDidChangeConfiguration((args) => {
			if (args.hasChanged(EditorOption.wrappingInfo) || args.hasChanged(EditorOption.lineHeight)) { updateImmediately.schedule(); }
		}));
		this._register(this._editors.modified.onDidChangeConfiguration((args) => {
			if (args.hasChanged(EditorOption.wrappingInfo) || args.hasChanged(EditorOption.lineHeight)) { updateImmediately.schedule(); }
		}));

		const originalModelTokenizationCompleted = this._diffModel.map(m =>
			m ? observableFromEvent(this, m.model.original.onDidChangeTokens, () => m.model.original.tokenization.backgroundTokenizationState === BackgroundTokenizationState.Completed) : undefined
		).map((m, reader) => m?.read(reader));

		const alignments = derived<ILineRangeAlignment[] | null>((reader) => {
			/** @description alignments */
			const diffModel = this._diffModel.read(reader);
			const diff = diffModel?.diff.read(reader);
			if (!diffModel || !diff) { return null; }
			state.read(reader);
			const renderSideBySide = this._options.renderSideBySide.read(reader);
			const innerHunkAlignment = renderSideBySide;
			return computeRangeAlignment(
				this._editors.original,
				this._editors.modified,
				diff.mappings,
				this._origViewZonesToIgnore,
				this._modViewZonesToIgnore,
				innerHunkAlignment
			);
		});

		const alignmentsSyncedMovedText = derived<ILineRangeAlignment[] | null>((reader) => {
			/** @description alignmentsSyncedMovedText */
			const syncedMovedText = this._diffModel.read(reader)?.movedTextToCompare.read(reader);
			if (!syncedMovedText) { return null; }
			state.read(reader);
			const mappings = syncedMovedText.changes.map(c => new DiffMapping(c));
			// TODO dont include alignments outside syncedMovedText
			return computeRangeAlignment(
				this._editors.original,
				this._editors.modified,
				mappings,
				this._origViewZonesToIgnore,
				this._modViewZonesToIgnore,
				true
			);
		});

		function createFakeLinesDiv(): HTMLElement {
			const r = document.createElement('div');
			r.className = 'diagonal-fill';
			return r;
		}

		const alignmentViewZonesDisposables = this._register(new DisposableStore());
		this.viewZones = derived<{ orig: IObservableViewZone[]; mod: IObservableViewZone[] }>(this, (reader) => {
			alignmentViewZonesDisposables.clear();

			const alignmentsVal = alignments.read(reader) || [];

			const origViewZones: IObservableViewZone[] = [];
			const modViewZones: IObservableViewZone[] = [];

			const modifiedTopPaddingVal = this._modifiedTopPadding.read(reader);
			if (modifiedTopPaddingVal > 0) {
				modViewZones.push({
					afterLineNumber: 0,
					domNode: document.createElement('div'),
					heightInPx: modifiedTopPaddingVal,
					showInHiddenAreas: true,
					suppressMouseDown: true,
				});
			}
			const originalTopPaddingVal = this._originalTopPadding.read(reader);
			if (originalTopPaddingVal > 0) {
				origViewZones.push({
					afterLineNumber: 0,
					domNode: document.createElement('div'),
					heightInPx: originalTopPaddingVal,
					showInHiddenAreas: true,
					suppressMouseDown: true,
				});
			}

			const renderSideBySide = this._options.renderSideBySide.read(reader);

			const deletedCodeLineBreaksComputer = !renderSideBySide ? this._editors.modified._getViewModel()?.createLineBreaksComputer() : undefined;
			if (deletedCodeLineBreaksComputer) {
				const originalModel = this._editors.original.getModel()!;
				for (const a of alignmentsVal) {
					if (a.diff) {
						for (let i = a.originalRange.startLineNumber; i < a.originalRange.endLineNumberExclusive; i++) {
							// `i` can be out of bound when the diff has not been updated yet.
							// In this case, we do an early return.
							// TODO@hediet: Fix this by applying the edit directly to the diff model, so that the diff is always valid.
							if (i > originalModel.getLineCount()) {
								return { orig: origViewZones, mod: modViewZones };
							}
							deletedCodeLineBreaksComputer?.addRequest(originalModel.getLineContent(i), null, null);
						}
					}
				}
			}

			const lineBreakData = deletedCodeLineBreaksComputer?.finalize() ?? [];
			let lineBreakDataIdx = 0;

			const modLineHeight = this._editors.modified.getOption(EditorOption.lineHeight);

			const syncedMovedText = this._diffModel.read(reader)?.movedTextToCompare.read(reader);

			const mightContainNonBasicASCII = this._editors.original.getModel()?.mightContainNonBasicASCII() ?? false;
			const mightContainRTL = this._editors.original.getModel()?.mightContainRTL() ?? false;
			const renderOptions = RenderOptions.fromEditor(this._editors.modified);

			for (const a of alignmentsVal) {
				if (a.diff && !renderSideBySide && (!this._options.useTrueInlineDiffRendering.read(reader) || !allowsTrueInlineDiffRendering(a.diff))) {
					if (!a.originalRange.isEmpty) {
						originalModelTokenizationCompleted.read(reader); // Update view-zones once tokenization completes

						const deletedCodeDomNode = document.createElement('div');
						deletedCodeDomNode.classList.add('view-lines', 'line-delete', 'line-delete-selectable', 'monaco-mouse-cursor-text');
						const originalModel = this._editors.original.getModel()!;
						// `a.originalRange` can be out of bound when the diff has not been updated yet.
						// In this case, we do an early return.
						// TODO@hediet: Fix this by applying the edit directly to the diff model, so that the diff is always valid.
						if (a.originalRange.endLineNumberExclusive - 1 > originalModel.getLineCount()) {
							return { orig: origViewZones, mod: modViewZones };
						}
						const source = new LineSource(
							a.originalRange.mapToLineArray(l => originalModel.tokenization.getLineTokens(l)),
							a.originalRange.mapToLineArray(_ => lineBreakData[lineBreakDataIdx++]),
							mightContainNonBasicASCII,
							mightContainRTL,
						);
						const decorations: InlineDecoration[] = [];
						for (const i of a.diff.innerChanges || []) {
							decorations.push(new InlineDecoration(
								i.originalRange.delta(-(a.diff.original.startLineNumber - 1)),
								diffDeleteDecoration.className!,
								InlineDecorationType.Regular
							));
						}
						const result = renderLines(source, renderOptions, decorations, deletedCodeDomNode);

						const marginDomNode = document.createElement('div');
						marginDomNode.className = 'inline-deleted-margin-view-zone';
						applyFontInfo(marginDomNode, renderOptions.fontInfo);

						if (this._options.renderIndicators.read(reader)) {
							for (let i = 0; i < result.heightInLines; i++) {
								const marginElement = document.createElement('div');
								marginElement.className = `delete-sign ${ThemeIcon.asClassName(diffRemoveIcon)}`;
								marginElement.setAttribute('style', `position:absolute;top:${i * modLineHeight}px;width:${renderOptions.lineDecorationsWidth}px;height:${modLineHeight}px;right:0;`);
								marginDomNode.appendChild(marginElement);
							}
						}

						let zoneId: string | undefined = undefined;
						alignmentViewZonesDisposables.add(
							new InlineDiffDeletedCodeMargin(
								() => assertReturnsDefined(zoneId),
								marginDomNode,
								deletedCodeDomNode,
								this._editors.modified,
								a.diff,
								this._diffEditorWidget,
								result,
								this._editors.original.getModel()!,
								this._contextMenuService,
								this._clipboardService,
							)
						);

						for (let i = 0; i < result.viewLineCounts.length; i++) {
							const count = result.viewLineCounts[i];
							// Account for wrapped lines in the (collapsed) original editor (which doesn't wrap lines).
							if (count > 1) {
								origViewZones.push({
									afterLineNumber: a.originalRange.startLineNumber + i,
									domNode: createFakeLinesDiv(),
									heightInPx: (count - 1) * modLineHeight,
									showInHiddenAreas: true,
									suppressMouseDown: true,
								});
							}
						}

						modViewZones.push({
							afterLineNumber: a.modifiedRange.startLineNumber - 1,
							domNode: deletedCodeDomNode,
							heightInPx: result.heightInLines * modLineHeight,
							minWidthInPx: result.minWidthInPx,
							marginDomNode,
							setZoneId(id) { zoneId = id; },
							showInHiddenAreas: true,
							suppressMouseDown: false,
						});
					}

					const marginDomNode = document.createElement('div');
					marginDomNode.className = 'gutter-delete';

					origViewZones.push({
						afterLineNumber: a.originalRange.endLineNumberExclusive - 1,
						domNode: createFakeLinesDiv(),
						heightInPx: a.modifiedHeightInPx,
						marginDomNode,
						showInHiddenAreas: true,
						suppressMouseDown: true,
					});
				} else {
					const delta = a.modifiedHeightInPx - a.originalHeightInPx;
					if (delta > 0) {
						if (syncedMovedText?.lineRangeMapping.original.delta(-1).deltaLength(2).contains(a.originalRange.endLineNumberExclusive - 1)) {
							continue;
						}

						origViewZones.push({
							afterLineNumber: a.originalRange.endLineNumberExclusive - 1,
							domNode: createFakeLinesDiv(),
							heightInPx: delta,
							showInHiddenAreas: true,
							suppressMouseDown: true,
						});
					} else {
						if (syncedMovedText?.lineRangeMapping.modified.delta(-1).deltaLength(2).contains(a.modifiedRange.endLineNumberExclusive - 1)) {
							continue;
						}

						function createViewZoneMarginArrow(): HTMLElement {
							const arrow = document.createElement('div');
							arrow.className = 'arrow-revert-change ' + ThemeIcon.asClassName(Codicon.arrowRight);
							reader.store.add(addDisposableListener(arrow, 'mousedown', e => e.stopPropagation()));
							reader.store.add(addDisposableListener(arrow, 'click', e => {
								e.stopPropagation();
								_diffEditorWidget.revert(a.diff!);
							}));
							return $('div', {}, arrow);
						}

						let marginDomNode: HTMLElement | undefined = undefined;
						if (a.diff && a.diff.modified.isEmpty && this._options.shouldRenderOldRevertArrows.read(reader)) {
							marginDomNode = createViewZoneMarginArrow();
						}

						modViewZones.push({
							afterLineNumber: a.modifiedRange.endLineNumberExclusive - 1,
							domNode: createFakeLinesDiv(),
							heightInPx: -delta,
							marginDomNode,
							showInHiddenAreas: true,
							suppressMouseDown: true,
						});
					}
				}
			}

			for (const a of alignmentsSyncedMovedText.read(reader) ?? []) {
				if (!syncedMovedText?.lineRangeMapping.original.intersect(a.originalRange)
					|| !syncedMovedText?.lineRangeMapping.modified.intersect(a.modifiedRange)) {
					// ignore unrelated alignments outside the synced moved text
					continue;
				}

				const delta = a.modifiedHeightInPx - a.originalHeightInPx;
				if (delta > 0) {
					origViewZones.push({
						afterLineNumber: a.originalRange.endLineNumberExclusive - 1,
						domNode: createFakeLinesDiv(),
						heightInPx: delta,
						showInHiddenAreas: true,
						suppressMouseDown: true,
					});
				} else {
					modViewZones.push({
						afterLineNumber: a.modifiedRange.endLineNumberExclusive - 1,
						domNode: createFakeLinesDiv(),
						heightInPx: -delta,
						showInHiddenAreas: true,
						suppressMouseDown: true,
					});
				}
			}

			return { orig: origViewZones, mod: modViewZones };
		});

		let ignoreChange = false;
		this._register(this._editors.original.onDidScrollChange(e => {
			if (e.scrollLeftChanged && !ignoreChange) {
				ignoreChange = true;
				this._editors.modified.setScrollLeft(e.scrollLeft);
				ignoreChange = false;
			}
		}));
		this._register(this._editors.modified.onDidScrollChange(e => {
			if (e.scrollLeftChanged && !ignoreChange) {
				ignoreChange = true;
				this._editors.original.setScrollLeft(e.scrollLeft);
				ignoreChange = false;
			}
		}));

		this._originalScrollTop = observableFromEvent(this._editors.original.onDidScrollChange, () => /** @description original.getScrollTop */ this._editors.original.getScrollTop());
		this._modifiedScrollTop = observableFromEvent(this._editors.modified.onDidScrollChange, () => /** @description modified.getScrollTop */ this._editors.modified.getScrollTop());

		// origExtraHeight + origOffset - origScrollTop = modExtraHeight + modOffset - modScrollTop

		// origScrollTop = origExtraHeight + origOffset - modExtraHeight - modOffset + modScrollTop
		// modScrollTop = modExtraHeight + modOffset - origExtraHeight - origOffset + origScrollTop

		// origOffset - modOffset = heightOfLines(1..Y) - heightOfLines(1..X)
		// origScrollTop >= 0, modScrollTop >= 0

		this._register(autorun(reader => {
			/** @description update scroll modified */
			const newScrollTopModified = this._originalScrollTop.read(reader)
				- (this._originalScrollOffsetAnimated.read(undefined) - this._modifiedScrollOffsetAnimated.read(reader))
				- (this._originalTopPadding.read(undefined) - this._modifiedTopPadding.read(reader));
			if (newScrollTopModified !== this._editors.modified.getScrollTop()) {
				this._editors.modified.setScrollTop(newScrollTopModified, ScrollType.Immediate);
			}
		}));

		this._register(autorun(reader => {
			/** @description update scroll original */
			const newScrollTopOriginal = this._modifiedScrollTop.read(reader)
				- (this._modifiedScrollOffsetAnimated.read(undefined) - this._originalScrollOffsetAnimated.read(reader))
				- (this._modifiedTopPadding.read(undefined) - this._originalTopPadding.read(reader));
			if (newScrollTopOriginal !== this._editors.original.getScrollTop()) {
				this._editors.original.setScrollTop(newScrollTopOriginal, ScrollType.Immediate);
			}
		}));


		this._register(autorun(reader => {
			/** @description update editor top offsets */
			const m = this._diffModel.read(reader)?.movedTextToCompare.read(reader);

			let deltaOrigToMod = 0;
			if (m) {
				const trueTopOriginal = this._editors.original.getTopForLineNumber(m.lineRangeMapping.original.startLineNumber, true) - this._originalTopPadding.read(undefined);
				const trueTopModified = this._editors.modified.getTopForLineNumber(m.lineRangeMapping.modified.startLineNumber, true) - this._modifiedTopPadding.read(undefined);
				deltaOrigToMod = trueTopModified - trueTopOriginal;
			}

			if (deltaOrigToMod > 0) {
				this._modifiedTopPadding.set(0, undefined);
				this._originalTopPadding.set(deltaOrigToMod, undefined);
			} else if (deltaOrigToMod < 0) {
				this._modifiedTopPadding.set(-deltaOrigToMod, undefined);
				this._originalTopPadding.set(0, undefined);
			} else {
				setTimeout(() => {
					this._modifiedTopPadding.set(0, undefined);
					this._originalTopPadding.set(0, undefined);
				}, 400);
			}

			if (this._editors.modified.hasTextFocus()) {
				this._originalScrollOffset.set(this._modifiedScrollOffset.read(undefined) - deltaOrigToMod, undefined, true);
			} else {
				this._modifiedScrollOffset.set(this._originalScrollOffset.read(undefined) + deltaOrigToMod, undefined, true);
			}
		}));
	}
}

interface ILineRangeAlignment {
	originalRange: LineRange;
	modifiedRange: LineRange;

	// accounts for foreign viewzones and line wrapping
	originalHeightInPx: number;
	modifiedHeightInPx: number;

	/**
	 * If this range alignment is a direct result of a diff, then this is the diff's line mapping.
	 * Only used for inline-view.
	 */
	diff?: DetailedLineRangeMapping;
}

function computeRangeAlignment(
	originalEditor: CodeEditorWidget,
	modifiedEditor: CodeEditorWidget,
	diffs: readonly DiffMapping[],
	originalEditorAlignmentViewZones: ReadonlySet<string>,
	modifiedEditorAlignmentViewZones: ReadonlySet<string>,
	innerHunkAlignment: boolean,
): ILineRangeAlignment[] {
	const originalLineHeightOverrides = new ArrayQueue(getAdditionalLineHeights(originalEditor, originalEditorAlignmentViewZones));
	const modifiedLineHeightOverrides = new ArrayQueue(getAdditionalLineHeights(modifiedEditor, modifiedEditorAlignmentViewZones));

	const origLineHeight = originalEditor.getOption(EditorOption.lineHeight);
	const modLineHeight = modifiedEditor.getOption(EditorOption.lineHeight);

	const result: ILineRangeAlignment[] = [];

	let lastOriginalLineNumber = 0;
	let lastModifiedLineNumber = 0;

	function handleAlignmentsOutsideOfDiffs(untilOriginalLineNumberExclusive: number, untilModifiedLineNumberExclusive: number) {
		while (true) {
			let origNext = originalLineHeightOverrides.peek();
			let modNext = modifiedLineHeightOverrides.peek();
			if (origNext && origNext.lineNumber >= untilOriginalLineNumberExclusive) {
				origNext = undefined;
			}
			if (modNext && modNext.lineNumber >= untilModifiedLineNumberExclusive) {
				modNext = undefined;
			}
			if (!origNext && !modNext) {
				break;
			}

			const distOrig = origNext ? origNext.lineNumber - lastOriginalLineNumber : Number.MAX_VALUE;
			const distNext = modNext ? modNext.lineNumber - lastModifiedLineNumber : Number.MAX_VALUE;

			if (distOrig < distNext) {
				originalLineHeightOverrides.dequeue();
				modNext = {
					lineNumber: origNext!.lineNumber - lastOriginalLineNumber + lastModifiedLineNumber,
					heightInPx: 0,
				};
			} else if (distOrig > distNext) {
				modifiedLineHeightOverrides.dequeue();
				origNext = {
					lineNumber: modNext!.lineNumber - lastModifiedLineNumber + lastOriginalLineNumber,
					heightInPx: 0,
				};
			} else {
				originalLineHeightOverrides.dequeue();
				modifiedLineHeightOverrides.dequeue();
			}

			result.push({
				originalRange: LineRange.ofLength(origNext!.lineNumber, 1),
				modifiedRange: LineRange.ofLength(modNext!.lineNumber, 1),
				originalHeightInPx: origLineHeight + origNext!.heightInPx,
				modifiedHeightInPx: modLineHeight + modNext!.heightInPx,
				diff: undefined,
			});
		}
	}

	for (const m of diffs) {
		const c = m.lineRangeMapping;
		handleAlignmentsOutsideOfDiffs(c.original.startLineNumber, c.modified.startLineNumber);

		let first = true;
		let lastModLineNumber = c.modified.startLineNumber;
		let lastOrigLineNumber = c.original.startLineNumber;

		function emitAlignment(origLineNumberExclusive: number, modLineNumberExclusive: number, forceAlignment = false) {
			if (origLineNumberExclusive < lastOrigLineNumber || modLineNumberExclusive < lastModLineNumber) {
				return;
			}
			if (first) {
				first = false;
			} else if (!forceAlignment && (origLineNumberExclusive === lastOrigLineNumber || modLineNumberExclusive === lastModLineNumber)) {
				// This causes a re-alignment of an already aligned line.
				// However, we don't care for the final alignment.
				return;
			}
			const originalRange = new LineRange(lastOrigLineNumber, origLineNumberExclusive);
			const modifiedRange = new LineRange(lastModLineNumber, modLineNumberExclusive);
			if (originalRange.isEmpty && modifiedRange.isEmpty) {
				return;
			}

			const originalAdditionalHeight = originalLineHeightOverrides
				.takeWhile(v => v.lineNumber < origLineNumberExclusive)
				?.reduce((p, c) => p + c.heightInPx, 0) ?? 0;
			const modifiedAdditionalHeight = modifiedLineHeightOverrides
				.takeWhile(v => v.lineNumber < modLineNumberExclusive)
				?.reduce((p, c) => p + c.heightInPx, 0) ?? 0;

			result.push({
				originalRange,
				modifiedRange,
				originalHeightInPx: originalRange.length * origLineHeight + originalAdditionalHeight,
				modifiedHeightInPx: modifiedRange.length * modLineHeight + modifiedAdditionalHeight,
				diff: m.lineRangeMapping,
			});

			lastOrigLineNumber = origLineNumberExclusive;
			lastModLineNumber = modLineNumberExclusive;
		}

		if (innerHunkAlignment) {
			for (const i of c.innerChanges || []) {
				if (i.originalRange.startColumn > 1 && i.modifiedRange.startColumn > 1) {
					// There is some unmodified text on this line before the diff
					emitAlignment(i.originalRange.startLineNumber, i.modifiedRange.startLineNumber);
				}
				const originalModel = originalEditor.getModel()!;
				// When the diff is invalid, the ranges might be out of bounds (this should be fixed in the diff model by applying edits directly).
				const maxColumn = i.originalRange.endLineNumber <= originalModel.getLineCount() ? originalModel.getLineMaxColumn(i.originalRange.endLineNumber) : Number.MAX_SAFE_INTEGER;
				if (i.originalRange.endColumn < maxColumn) {
					// // There is some unmodified text on this line after the diff
					emitAlignment(i.originalRange.endLineNumber, i.modifiedRange.endLineNumber);
				}
			}
		}

		emitAlignment(c.original.endLineNumberExclusive, c.modified.endLineNumberExclusive, true);

		lastOriginalLineNumber = c.original.endLineNumberExclusive;
		lastModifiedLineNumber = c.modified.endLineNumberExclusive;
	}
	handleAlignmentsOutsideOfDiffs(Number.MAX_VALUE, Number.MAX_VALUE);

	return result;
}

interface AdditionalLineHeightInfo {
	lineNumber: number;
	heightInPx: number;
}

function getAdditionalLineHeights(editor: CodeEditorWidget, viewZonesToIgnore: ReadonlySet<string>): readonly AdditionalLineHeightInfo[] {
	const viewZoneHeights: { lineNumber: number; heightInPx: number }[] = [];
	const wrappingZoneHeights: { lineNumber: number; heightInPx: number }[] = [];

	const hasWrapping = editor.getOption(EditorOption.wrappingInfo).wrappingColumn !== -1;
	const coordinatesConverter = editor._getViewModel()!.coordinatesConverter;
	const editorLineHeight = editor.getOption(EditorOption.lineHeight);
	if (hasWrapping) {
		for (let i = 1; i <= editor.getModel()!.getLineCount(); i++) {
			const lineCount = coordinatesConverter.getModelLineViewLineCount(i);
			if (lineCount > 1) {
				wrappingZoneHeights.push({ lineNumber: i, heightInPx: editorLineHeight * (lineCount - 1) });
			}
		}
	}

	for (const w of editor.getWhitespaces()) {
		if (viewZonesToIgnore.has(w.id)) {
			continue;
		}
		const modelLineNumber = w.afterLineNumber === 0 ? 0 : coordinatesConverter.convertViewPositionToModelPosition(
			new Position(w.afterLineNumber, 1)
		).lineNumber;
		viewZoneHeights.push({ lineNumber: modelLineNumber, heightInPx: w.height });
	}

	const result = joinCombine(
		viewZoneHeights,
		wrappingZoneHeights,
		v => v.lineNumber,
		(v1, v2) => ({ lineNumber: v1.lineNumber, heightInPx: v1.heightInPx + v2.heightInPx })
	);

	return result;
}

export function allowsTrueInlineDiffRendering(mapping: DetailedLineRangeMapping): boolean {
	if (!mapping.innerChanges) {
		return false;
	}
	return mapping.innerChanges.every(c =>
		(rangeIsSingleLine(c.modifiedRange) && rangeIsSingleLine(c.originalRange))
		|| c.originalRange.equalsRange(new Range(1, 1, 1, 1))
	);
}

export function rangeIsSingleLine(range: Range): boolean {
	return range.startLineNumber === range.endLineNumber;
}
```

--------------------------------------------------------------------------------

````
