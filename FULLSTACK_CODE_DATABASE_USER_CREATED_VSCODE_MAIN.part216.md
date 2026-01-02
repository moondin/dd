---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 216
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 216 of 552)

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

---[FILE: src/vs/editor/common/model/pieceTreeTextBuffer/rbTreeBase.ts]---
Location: vscode-main/src/vs/editor/common/model/pieceTreeTextBuffer/rbTreeBase.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Piece, PieceTreeBase } from './pieceTreeBase.js';

export class TreeNode {
	parent: TreeNode;
	left: TreeNode;
	right: TreeNode;
	color: NodeColor;

	// Piece
	piece: Piece;
	size_left: number; // size of the left subtree (not inorder)
	lf_left: number; // line feeds cnt in the left subtree (not in order)

	constructor(piece: Piece, color: NodeColor) {
		this.piece = piece;
		this.color = color;
		this.size_left = 0;
		this.lf_left = 0;
		this.parent = this;
		this.left = this;
		this.right = this;
	}

	public next(): TreeNode {
		if (this.right !== SENTINEL) {
			return leftest(this.right);
		}

		let node: TreeNode = this;

		while (node.parent !== SENTINEL) {
			if (node.parent.left === node) {
				break;
			}

			node = node.parent;
		}

		if (node.parent === SENTINEL) {
			return SENTINEL;
		} else {
			return node.parent;
		}
	}

	public prev(): TreeNode {
		if (this.left !== SENTINEL) {
			return righttest(this.left);
		}

		let node: TreeNode = this;

		while (node.parent !== SENTINEL) {
			if (node.parent.right === node) {
				break;
			}

			node = node.parent;
		}

		if (node.parent === SENTINEL) {
			return SENTINEL;
		} else {
			return node.parent;
		}
	}

	public detach(): void {
		this.parent = null!;
		this.left = null!;
		this.right = null!;
	}
}

export const enum NodeColor {
	Black = 0,
	Red = 1,
}

export const SENTINEL: TreeNode = new TreeNode(null!, NodeColor.Black);
SENTINEL.parent = SENTINEL;
SENTINEL.left = SENTINEL;
SENTINEL.right = SENTINEL;
SENTINEL.color = NodeColor.Black;

export function leftest(node: TreeNode): TreeNode {
	while (node.left !== SENTINEL) {
		node = node.left;
	}
	return node;
}

export function righttest(node: TreeNode): TreeNode {
	while (node.right !== SENTINEL) {
		node = node.right;
	}
	return node;
}

function calculateSize(node: TreeNode): number {
	if (node === SENTINEL) {
		return 0;
	}

	return node.size_left + node.piece.length + calculateSize(node.right);
}

function calculateLF(node: TreeNode): number {
	if (node === SENTINEL) {
		return 0;
	}

	return node.lf_left + node.piece.lineFeedCnt + calculateLF(node.right);
}

function resetSentinel(): void {
	SENTINEL.parent = SENTINEL;
}

export function leftRotate(tree: PieceTreeBase, x: TreeNode) {
	const y = x.right;

	// fix size_left
	y.size_left += x.size_left + (x.piece ? x.piece.length : 0);
	y.lf_left += x.lf_left + (x.piece ? x.piece.lineFeedCnt : 0);
	x.right = y.left;

	if (y.left !== SENTINEL) {
		y.left.parent = x;
	}
	y.parent = x.parent;
	if (x.parent === SENTINEL) {
		tree.root = y;
	} else if (x.parent.left === x) {
		x.parent.left = y;
	} else {
		x.parent.right = y;
	}
	y.left = x;
	x.parent = y;
}

export function rightRotate(tree: PieceTreeBase, y: TreeNode) {
	const x = y.left;
	y.left = x.right;
	if (x.right !== SENTINEL) {
		x.right.parent = y;
	}
	x.parent = y.parent;

	// fix size_left
	y.size_left -= x.size_left + (x.piece ? x.piece.length : 0);
	y.lf_left -= x.lf_left + (x.piece ? x.piece.lineFeedCnt : 0);

	if (y.parent === SENTINEL) {
		tree.root = x;
	} else if (y === y.parent.right) {
		y.parent.right = x;
	} else {
		y.parent.left = x;
	}

	x.right = y;
	y.parent = x;
}

export function rbDelete(tree: PieceTreeBase, z: TreeNode) {
	let x: TreeNode;
	let y: TreeNode;

	if (z.left === SENTINEL) {
		y = z;
		x = y.right;
	} else if (z.right === SENTINEL) {
		y = z;
		x = y.left;
	} else {
		y = leftest(z.right);
		x = y.right;
	}

	if (y === tree.root) {
		tree.root = x;

		// if x is null, we are removing the only node
		x.color = NodeColor.Black;
		z.detach();
		resetSentinel();
		tree.root.parent = SENTINEL;

		return;
	}

	const yWasRed = (y.color === NodeColor.Red);

	if (y === y.parent.left) {
		y.parent.left = x;
	} else {
		y.parent.right = x;
	}

	if (y === z) {
		x.parent = y.parent;
		recomputeTreeMetadata(tree, x);
	} else {
		if (y.parent === z) {
			x.parent = y;
		} else {
			x.parent = y.parent;
		}

		// as we make changes to x's hierarchy, update size_left of subtree first
		recomputeTreeMetadata(tree, x);

		y.left = z.left;
		y.right = z.right;
		y.parent = z.parent;
		y.color = z.color;

		if (z === tree.root) {
			tree.root = y;
		} else {
			if (z === z.parent.left) {
				z.parent.left = y;
			} else {
				z.parent.right = y;
			}
		}

		if (y.left !== SENTINEL) {
			y.left.parent = y;
		}
		if (y.right !== SENTINEL) {
			y.right.parent = y;
		}
		// update metadata
		// we replace z with y, so in this sub tree, the length change is z.item.length
		y.size_left = z.size_left;
		y.lf_left = z.lf_left;
		recomputeTreeMetadata(tree, y);
	}

	z.detach();

	if (x.parent.left === x) {
		const newSizeLeft = calculateSize(x);
		const newLFLeft = calculateLF(x);
		if (newSizeLeft !== x.parent.size_left || newLFLeft !== x.parent.lf_left) {
			const delta = newSizeLeft - x.parent.size_left;
			const lf_delta = newLFLeft - x.parent.lf_left;
			x.parent.size_left = newSizeLeft;
			x.parent.lf_left = newLFLeft;
			updateTreeMetadata(tree, x.parent, delta, lf_delta);
		}
	}

	recomputeTreeMetadata(tree, x.parent);

	if (yWasRed) {
		resetSentinel();
		return;
	}

	// RB-DELETE-FIXUP
	let w: TreeNode;
	while (x !== tree.root && x.color === NodeColor.Black) {
		if (x === x.parent.left) {
			w = x.parent.right;

			if (w.color === NodeColor.Red) {
				w.color = NodeColor.Black;
				x.parent.color = NodeColor.Red;
				leftRotate(tree, x.parent);
				w = x.parent.right;
			}

			if (w.left.color === NodeColor.Black && w.right.color === NodeColor.Black) {
				w.color = NodeColor.Red;
				x = x.parent;
			} else {
				if (w.right.color === NodeColor.Black) {
					w.left.color = NodeColor.Black;
					w.color = NodeColor.Red;
					rightRotate(tree, w);
					w = x.parent.right;
				}

				w.color = x.parent.color;
				x.parent.color = NodeColor.Black;
				w.right.color = NodeColor.Black;
				leftRotate(tree, x.parent);
				x = tree.root;
			}
		} else {
			w = x.parent.left;

			if (w.color === NodeColor.Red) {
				w.color = NodeColor.Black;
				x.parent.color = NodeColor.Red;
				rightRotate(tree, x.parent);
				w = x.parent.left;
			}

			if (w.left.color === NodeColor.Black && w.right.color === NodeColor.Black) {
				w.color = NodeColor.Red;
				x = x.parent;

			} else {
				if (w.left.color === NodeColor.Black) {
					w.right.color = NodeColor.Black;
					w.color = NodeColor.Red;
					leftRotate(tree, w);
					w = x.parent.left;
				}

				w.color = x.parent.color;
				x.parent.color = NodeColor.Black;
				w.left.color = NodeColor.Black;
				rightRotate(tree, x.parent);
				x = tree.root;
			}
		}
	}
	x.color = NodeColor.Black;
	resetSentinel();
}

export function fixInsert(tree: PieceTreeBase, x: TreeNode) {
	recomputeTreeMetadata(tree, x);

	while (x !== tree.root && x.parent.color === NodeColor.Red) {
		if (x.parent === x.parent.parent.left) {
			const y = x.parent.parent.right;

			if (y.color === NodeColor.Red) {
				x.parent.color = NodeColor.Black;
				y.color = NodeColor.Black;
				x.parent.parent.color = NodeColor.Red;
				x = x.parent.parent;
			} else {
				if (x === x.parent.right) {
					x = x.parent;
					leftRotate(tree, x);
				}

				x.parent.color = NodeColor.Black;
				x.parent.parent.color = NodeColor.Red;
				rightRotate(tree, x.parent.parent);
			}
		} else {
			const y = x.parent.parent.left;

			if (y.color === NodeColor.Red) {
				x.parent.color = NodeColor.Black;
				y.color = NodeColor.Black;
				x.parent.parent.color = NodeColor.Red;
				x = x.parent.parent;
			} else {
				if (x === x.parent.left) {
					x = x.parent;
					rightRotate(tree, x);
				}
				x.parent.color = NodeColor.Black;
				x.parent.parent.color = NodeColor.Red;
				leftRotate(tree, x.parent.parent);
			}
		}
	}

	tree.root.color = NodeColor.Black;
}

export function updateTreeMetadata(tree: PieceTreeBase, x: TreeNode, delta: number, lineFeedCntDelta: number): void {
	// node length change or line feed count change
	while (x !== tree.root && x !== SENTINEL) {
		if (x.parent.left === x) {
			x.parent.size_left += delta;
			x.parent.lf_left += lineFeedCntDelta;
		}

		x = x.parent;
	}
}

export function recomputeTreeMetadata(tree: PieceTreeBase, x: TreeNode) {
	let delta = 0;
	let lf_delta = 0;
	if (x === tree.root) {
		return;
	}

	// go upwards till the node whose left subtree is changed.
	while (x !== tree.root && x === x.parent.right) {
		x = x.parent;
	}

	if (x === tree.root) {
		// well, it means we add a node to the end (inorder)
		return;
	}

	// x is the node whose right subtree is changed.
	x = x.parent;

	delta = calculateSize(x.left) - x.size_left;
	lf_delta = calculateLF(x.left) - x.lf_left;
	x.size_left += delta;
	x.lf_left += lf_delta;


	// go upwards till root. O(logN)
	while (x !== tree.root && (delta !== 0 || lf_delta !== 0)) {
		if (x.parent.left === x) {
			x.parent.size_left += delta;
			x.parent.lf_left += lf_delta;
		}

		x = x.parent;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/tokens/abstractSyntaxTokenBackend.ts]---
Location: vscode-main/src/vs/editor/common/model/tokens/abstractSyntaxTokenBackend.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals } from '../../../../base/common/arrays.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { LineRange } from '../../core/ranges/lineRange.js';
import { StandardTokenType } from '../../encodedTokenAttributes.js';
import { ILanguageIdCodec } from '../../languages.js';
import { IAttachedView } from '../../model.js';
import { TextModel } from '../textModel.js';
import { IModelContentChangedEvent, IModelTokensChangedEvent, IModelFontTokensChangedEvent } from '../../textModelEvents.js';
import { BackgroundTokenizationState } from '../../tokenizationTextModelPart.js';
import { LineTokens } from '../../tokens/lineTokens.js';
import { derivedOpts, IObservable, ISettableObservable, observableSignal, observableValueOpts } from '../../../../base/common/observable.js';
import { equalsIfDefinedC, thisEqualsC, arrayEqualsC } from '../../../../base/common/equals.js';

/**
 * @internal
 */
export class AttachedViews {
	private readonly _onDidChangeVisibleRanges = new Emitter<{ view: IAttachedView; state: AttachedViewState | undefined }>();
	public readonly onDidChangeVisibleRanges = this._onDidChangeVisibleRanges.event;

	private readonly _views = new Set<AttachedViewImpl>();
	private readonly _viewsChanged = observableSignal(this);

	public readonly visibleLineRanges: IObservable<readonly LineRange[]>;

	constructor() {
		this.visibleLineRanges = derivedOpts({
			owner: this,
			equalsFn: arrayEqualsC(thisEqualsC())
		}, reader => {
			this._viewsChanged.read(reader);
			const ranges = LineRange.joinMany(
				[...this._views].map(view => view.state.read(reader)?.visibleLineRanges ?? [])
			);
			return ranges;
		});
	}

	public attachView(): IAttachedView {
		const view = new AttachedViewImpl((state) => {
			this._onDidChangeVisibleRanges.fire({ view, state });
		});
		this._views.add(view);
		this._viewsChanged.trigger(undefined);
		return view;
	}

	public detachView(view: IAttachedView): void {
		this._views.delete(view as AttachedViewImpl);
		this._onDidChangeVisibleRanges.fire({ view, state: undefined });
		this._viewsChanged.trigger(undefined);
	}
}

/**
 * @internal
 */
export class AttachedViewState {
	constructor(
		readonly visibleLineRanges: readonly LineRange[],
		readonly stabilized: boolean,
	) { }

	public equals(other: AttachedViewState): boolean {
		if (this === other) {
			return true;
		}
		if (!equals(this.visibleLineRanges, other.visibleLineRanges, (a, b) => a.equals(b))) {
			return false;
		}
		if (this.stabilized !== other.stabilized) {
			return false;
		}
		return true;
	}
}

class AttachedViewImpl implements IAttachedView {
	private readonly _state: ISettableObservable<AttachedViewState | undefined>;
	public get state(): IObservable<AttachedViewState | undefined> { return this._state; }

	constructor(
		private readonly handleStateChange: (state: AttachedViewState) => void
	) {
		this._state = observableValueOpts<AttachedViewState | undefined>({ owner: this, equalsFn: equalsIfDefinedC((a, b) => a.equals(b)) }, undefined);
	}

	setVisibleLines(visibleLines: { startLineNumber: number; endLineNumber: number }[], stabilized: boolean): void {
		const visibleLineRanges = visibleLines.map((line) => new LineRange(line.startLineNumber, line.endLineNumber + 1));
		const state = new AttachedViewState(visibleLineRanges, stabilized);
		this._state.set(state, undefined, undefined);
		this.handleStateChange(state);
	}
}


export class AttachedViewHandler extends Disposable {
	private readonly runner = this._register(new RunOnceScheduler(() => this.update(), 50));

	private _computedLineRanges: readonly LineRange[] = [];
	private _lineRanges: readonly LineRange[] = [];
	public get lineRanges(): readonly LineRange[] { return this._lineRanges; }

	constructor(private readonly _refreshTokens: () => void) {
		super();
	}

	private update(): void {
		if (equals(this._computedLineRanges, this._lineRanges, (a, b) => a.equals(b))) {
			return;
		}
		this._computedLineRanges = this._lineRanges;
		this._refreshTokens();
	}

	public handleStateChange(state: AttachedViewState): void {
		this._lineRanges = state.visibleLineRanges;
		if (state.stabilized) {
			this.runner.cancel();
			this.update();
		} else {
			this.runner.schedule();
		}
	}
}

export abstract class AbstractSyntaxTokenBackend extends Disposable {
	protected abstract _backgroundTokenizationState: BackgroundTokenizationState;
	public get backgroundTokenizationState(): BackgroundTokenizationState {
		return this._backgroundTokenizationState;
	}

	protected abstract readonly _onDidChangeBackgroundTokenizationState: Emitter<void>;
	/** @internal, should not be exposed by the text model! */
	public abstract readonly onDidChangeBackgroundTokenizationState: Event<void>;

	protected readonly _onDidChangeTokens = this._register(new Emitter<IModelTokensChangedEvent>());
	/** @internal, should not be exposed by the text model! */
	public readonly onDidChangeTokens: Event<IModelTokensChangedEvent> = this._onDidChangeTokens.event;

	protected readonly _onDidChangeFontTokens: Emitter<IModelFontTokensChangedEvent> = this._register(new Emitter<IModelFontTokensChangedEvent>());
	/** @internal, should not be exposed by the text model! */
	public readonly onDidChangeFontTokens: Event<IModelFontTokensChangedEvent> = this._onDidChangeFontTokens.event;

	constructor(
		protected readonly _languageIdCodec: ILanguageIdCodec,
		protected readonly _textModel: TextModel,
	) {
		super();
	}

	public abstract todo_resetTokenization(fireTokenChangeEvent?: boolean): void;

	public abstract handleDidChangeAttached(): void;

	public abstract handleDidChangeContent(e: IModelContentChangedEvent): void;

	public abstract forceTokenization(lineNumber: number): void;

	public abstract hasAccurateTokensForLine(lineNumber: number): boolean;

	public abstract isCheapToTokenize(lineNumber: number): boolean;

	public tokenizeIfCheap(lineNumber: number): void {
		if (this.isCheapToTokenize(lineNumber)) {
			this.forceTokenization(lineNumber);
		}
	}

	public abstract getLineTokens(lineNumber: number): LineTokens;

	public abstract getTokenTypeIfInsertingCharacter(lineNumber: number, column: number, character: string): StandardTokenType;

	public abstract tokenizeLinesAt(lineNumber: number, lines: string[]): LineTokens[] | null;

	public abstract get hasTokens(): boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/tokens/annotations.ts]---
Location: vscode-main/src/vs/editor/common/model/tokens/annotations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { binarySearch2 } from '../../../../base/common/arrays.js';
import { StringEdit } from '../../core/edits/stringEdit.js';
import { OffsetRange } from '../../core/ranges/offsetRange.js';

export interface IAnnotation<T> {
	range: OffsetRange;
	annotation: T;
}

export interface IAnnotatedString<T> {
	/**
	 * Set annotations for a specific line.
	 * Annotations should be sorted and non-overlapping.
	 */
	setAnnotations(annotations: AnnotationsUpdate<T>): void;
	/**
	 * Return annotations intersecting with the given offset range.
	 */
	getAnnotationsIntersecting(range: OffsetRange): IAnnotation<T>[];
	/**
	 * Get all the annotations. Method is used for testing.
	 */
	getAllAnnotations(): IAnnotation<T>[];
	/**
	 * Apply a string edit to the annotated string.
	 * @returns The annotations that were deleted (became empty) as a result of the edit.
	 */
	applyEdit(edit: StringEdit): IAnnotation<T>[];
	/**
	 * Clone the annotated string.
	 */
	clone(): IAnnotatedString<T>;
}

export class AnnotatedString<T> implements IAnnotatedString<T> {

	/**
	 * Annotations are non intersecting and contiguous in the array.
	 */
	private _annotations: IAnnotation<T>[] = [];

	constructor(annotations: IAnnotation<T>[] = []) {
		this._annotations = annotations;
	}

	/**
	 * Set annotations for a specific range.
	 * Annotations should be sorted and non-overlapping.
	 * If the annotation value is undefined, the annotation is removed.
	 */
	public setAnnotations(annotations: AnnotationsUpdate<T>): void {
		for (const annotation of annotations.annotations) {
			const startIndex = this._getStartIndexOfIntersectingAnnotation(annotation.range.start);
			const endIndexExclusive = this._getEndIndexOfIntersectingAnnotation(annotation.range.endExclusive);
			if (annotation.annotation !== undefined) {
				this._annotations.splice(startIndex, endIndexExclusive - startIndex, { range: annotation.range, annotation: annotation.annotation });
			} else {
				this._annotations.splice(startIndex, endIndexExclusive - startIndex);
			}
		}
	}

	/**
	 * Returns all annotations that intersect with the given offset range.
	 */
	public getAnnotationsIntersecting(range: OffsetRange): IAnnotation<T>[] {
		const startIndex = this._getStartIndexOfIntersectingAnnotation(range.start);
		const endIndexExclusive = this._getEndIndexOfIntersectingAnnotation(range.endExclusive);
		return this._annotations.slice(startIndex, endIndexExclusive);
	}

	private _getStartIndexOfIntersectingAnnotation(offset: number): number {
		// Find index to the left of the offset
		const startIndexWhereToReplace = binarySearch2(this._annotations.length, (index) => {
			return this._annotations[index].range.start - offset;
		});
		let startIndex: number;
		if (startIndexWhereToReplace >= 0) {
			startIndex = startIndexWhereToReplace;
		} else {
			const candidate = this._annotations[- (startIndexWhereToReplace + 2)]?.range;
			if (candidate && offset >= candidate.start && offset <= candidate.endExclusive) {
				startIndex = - (startIndexWhereToReplace + 2);
			} else {
				startIndex = - (startIndexWhereToReplace + 1);
			}
		}
		return startIndex;
	}

	private _getEndIndexOfIntersectingAnnotation(offset: number): number {
		// Find index to the right of the offset
		const endIndexWhereToReplace = binarySearch2(this._annotations.length, (index) => {
			return this._annotations[index].range.endExclusive - offset;
		});
		let endIndexExclusive: number;
		if (endIndexWhereToReplace >= 0) {
			endIndexExclusive = endIndexWhereToReplace + 1;
		} else {
			const candidate = this._annotations[-(endIndexWhereToReplace + 1)]?.range;
			if (candidate && offset >= candidate.start && offset <= candidate.endExclusive) {
				endIndexExclusive = - endIndexWhereToReplace;
			} else {
				endIndexExclusive = - (endIndexWhereToReplace + 1);
			}
		}
		return endIndexExclusive;
	}

	/**
	 * Returns a copy of all annotations.
	 */
	public getAllAnnotations(): IAnnotation<T>[] {
		return this._annotations.slice();
	}

	/**
	 * Applies a string edit to the annotated string, updating annotation ranges accordingly.
	 * @param edit The string edit to apply.
	 * @returns The annotations that were deleted (became empty) as a result of the edit.
	 */
	public applyEdit(edit: StringEdit): IAnnotation<T>[] {
		const annotations = this._annotations.slice();

		// treat edits as deletion of the replace range and then as insertion that extends the first range
		const finalAnnotations: IAnnotation<T>[] = [];
		const deletedAnnotations: IAnnotation<T>[] = [];

		let offset = 0;

		for (const e of edit.replacements) {
			while (true) {
				// ranges before the current edit
				const annotation = annotations[0];
				if (!annotation) {
					break;
				}
				const range = annotation.range;
				if (range.endExclusive >= e.replaceRange.start) {
					break;
				}
				annotations.shift();
				const newAnnotation = { range: range.delta(offset), annotation: annotation.annotation };
				if (!newAnnotation.range.isEmpty) {
					finalAnnotations.push(newAnnotation);
				} else {
					deletedAnnotations.push(newAnnotation);
				}
			}

			const intersecting: IAnnotation<T>[] = [];
			while (true) {
				const annotation = annotations[0];
				if (!annotation) {
					break;
				}
				const range = annotation.range;
				if (!range.intersectsOrTouches(e.replaceRange)) {
					break;
				}
				annotations.shift();
				intersecting.push(annotation);
			}

			for (let i = intersecting.length - 1; i >= 0; i--) {
				const annotation = intersecting[i];
				let r = annotation.range;

				// Inserted text will extend the first intersecting annotation, if the edit truly overlaps it
				const shouldExtend = i === 0 && (e.replaceRange.endExclusive > r.start) && (e.replaceRange.start < r.endExclusive);
				// Annotation shrinks by the overlap then grows with the new text length
				const overlap = r.intersect(e.replaceRange)!.length;
				r = r.deltaEnd(-overlap + (shouldExtend ? e.newText.length : 0));

				// If the annotation starts after the edit start, shift left to the edit start position
				const rangeAheadOfReplaceRange = r.start - e.replaceRange.start;
				if (rangeAheadOfReplaceRange > 0) {
					r = r.delta(-rangeAheadOfReplaceRange);
				}

				// If annotation shouldn't be extended AND it is after or on edit start, move it after the newly inserted text
				if (!shouldExtend && rangeAheadOfReplaceRange >= 0) {
					r = r.delta(e.newText.length);
				}

				// We already took our offset into account.
				// Because we add r back to the queue (which then adds offset again),
				// we have to remove it here so as to not double count it.
				r = r.delta(-(e.newText.length - e.replaceRange.length));

				annotations.unshift({ annotation: annotation.annotation, range: r });
			}

			offset += e.newText.length - e.replaceRange.length;
		}

		while (true) {
			const annotation = annotations[0];
			if (!annotation) {
				break;
			}
			annotations.shift();
			const newAnnotation = { annotation: annotation.annotation, range: annotation.range.delta(offset) };
			if (!newAnnotation.range.isEmpty) {
				finalAnnotations.push(newAnnotation);
			} else {
				deletedAnnotations.push(newAnnotation);
			}
		}
		this._annotations = finalAnnotations;
		return deletedAnnotations;
	}

	/**
	 * Creates a shallow clone of this annotated string.
	 */
	public clone(): IAnnotatedString<T> {
		return new AnnotatedString<T>(this._annotations.slice());
	}
}

export interface IAnnotationUpdate<T> {
	range: OffsetRange;
	annotation: T | undefined;
}

type DefinedValue = object | string | number | boolean;

export type ISerializedAnnotation<TSerializedProperty extends DefinedValue> = {
	range: { start: number; endExclusive: number };
	annotation: TSerializedProperty | undefined;
};

export class AnnotationsUpdate<T> {

	public static create<T>(annotations: IAnnotationUpdate<T>[]): AnnotationsUpdate<T> {
		return new AnnotationsUpdate(annotations);
	}

	private _annotations: IAnnotationUpdate<T>[];

	private constructor(annotations: IAnnotationUpdate<T>[]) {
		this._annotations = annotations;
	}

	get annotations(): IAnnotationUpdate<T>[] {
		return this._annotations;
	}

	public rebase(edit: StringEdit): void {
		const annotatedString = new AnnotatedString<T | undefined>(this._annotations);
		annotatedString.applyEdit(edit);
		this._annotations = annotatedString.getAllAnnotations();
	}

	public serialize<TSerializedProperty extends DefinedValue>(serializingFunc: (annotation: T) => TSerializedProperty): ISerializedAnnotation<TSerializedProperty>[] {
		return this._annotations.map(annotation => {
			const range = { start: annotation.range.start, endExclusive: annotation.range.endExclusive };
			if (!annotation.annotation) {
				return { range, annotation: undefined };
			}
			return { range, annotation: serializingFunc(annotation.annotation) };
		});
	}

	static deserialize<T, TSerializedProperty extends DefinedValue>(serializedAnnotations: ISerializedAnnotation<TSerializedProperty>[], deserializingFunc: (annotation: TSerializedProperty) => T): AnnotationsUpdate<T> {
		const annotations: IAnnotationUpdate<T>[] = serializedAnnotations.map(serializedAnnotation => {
			const range = new OffsetRange(serializedAnnotation.range.start, serializedAnnotation.range.endExclusive);
			if (!serializedAnnotation.annotation) {
				return { range, annotation: undefined };
			}
			return { range, annotation: deserializingFunc(serializedAnnotation.annotation) };
		});
		return new AnnotationsUpdate(annotations);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/tokens/tokenizationFontDecorationsProvider.ts]---
Location: vscode-main/src/vs/editor/common/model/tokens/tokenizationFontDecorationsProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IModelDecoration, ITextModel } from '../../model.js';
import { TokenizationTextModelPart } from './tokenizationTextModelPart.js';
import { Range } from '../../core/range.js';
import { DecorationProvider, LineFontChangingDecoration, LineHeightChangingDecoration } from '../decorationProvider.js';
import { Emitter } from '../../../../base/common/event.js';
import { IFontTokenOption, IModelContentChangedEvent } from '../../textModelEvents.js';
import { classNameForFontTokenDecorations } from '../../languages/supports/tokenization.js';
import { Position } from '../../core/position.js';
import { AnnotatedString, AnnotationsUpdate, IAnnotatedString, IAnnotationUpdate } from './annotations.js';
import { OffsetRange } from '../../core/ranges/offsetRange.js';
import { offsetEditFromContentChanges } from '../textModelStringEdit.js';

export interface IFontTokenAnnotation {
	decorationId: string;
	fontToken: IFontTokenOption;
}

export class TokenizationFontDecorationProvider extends Disposable implements DecorationProvider {

	private static DECORATION_COUNT = 0;

	private readonly _onDidChangeLineHeight = new Emitter<Set<LineHeightChangingDecoration>>();
	public readonly onDidChangeLineHeight = this._onDidChangeLineHeight.event;

	private readonly _onDidChangeFont = new Emitter<Set<LineFontChangingDecoration>>();
	public readonly onDidChangeFont = this._onDidChangeFont.event;

	private _fontAnnotatedString: IAnnotatedString<IFontTokenAnnotation> = new AnnotatedString<IFontTokenAnnotation>();

	constructor(
		private readonly textModel: ITextModel,
		private readonly tokenizationTextModelPart: TokenizationTextModelPart
	) {
		super();
		this._register(this.tokenizationTextModelPart.onDidChangeFontTokens(fontChanges => {

			const linesChanged = new Set<number>();
			const fontTokenAnnotations: IAnnotationUpdate<IFontTokenAnnotation>[] = [];

			const affectedLineHeights = new Set<LineHeightChangingDecoration>();
			const affectedLineFonts = new Set<LineFontChangingDecoration>();

			for (const annotation of fontChanges.changes.annotations) {

				const startPosition = this.textModel.getPositionAt(annotation.range.start);
				const endPosition = this.textModel.getPositionAt(annotation.range.endExclusive);

				if (startPosition.lineNumber !== endPosition.lineNumber) {
					// The token should be always on a single line
					continue;
				}
				const lineNumber = startPosition.lineNumber;

				let fontTokenAnnotation: IAnnotationUpdate<IFontTokenAnnotation>;
				if (annotation.annotation === undefined) {
					fontTokenAnnotation = {
						range: annotation.range,
						annotation: undefined
					};
				} else {
					const decorationId = `tokenization-font-decoration-${TokenizationFontDecorationProvider.DECORATION_COUNT}`;
					const fontTokenDecoration: IFontTokenAnnotation = {
						fontToken: annotation.annotation,
						decorationId
					};
					fontTokenAnnotation = {
						range: annotation.range,
						annotation: fontTokenDecoration
					};
					TokenizationFontDecorationProvider.DECORATION_COUNT++;

					if (annotation.annotation.lineHeight) {
						affectedLineHeights.add(new LineHeightChangingDecoration(0, decorationId, lineNumber, annotation.annotation.lineHeight));
					}
					affectedLineFonts.add(new LineFontChangingDecoration(0, decorationId, lineNumber));

				}
				fontTokenAnnotations.push(fontTokenAnnotation);

				if (!linesChanged.has(lineNumber)) {
					// Signal the removal of the font tokenization decorations on the line number
					const lineNumberStartOffset = this.textModel.getOffsetAt(new Position(lineNumber, 1));
					const lineNumberEndOffset = this.textModel.getOffsetAt(new Position(lineNumber, this.textModel.getLineMaxColumn(lineNumber)));
					const lineOffsetRange = new OffsetRange(lineNumberStartOffset, lineNumberEndOffset);
					const lineAnnotations = this._fontAnnotatedString.getAnnotationsIntersecting(lineOffsetRange);
					for (const annotation of lineAnnotations) {
						const decorationId = annotation.annotation.decorationId;
						affectedLineHeights.add(new LineHeightChangingDecoration(0, decorationId, lineNumber, null));
						affectedLineFonts.add(new LineFontChangingDecoration(0, decorationId, lineNumber));
					}
					linesChanged.add(lineNumber);
				}
			}
			this._fontAnnotatedString.setAnnotations(AnnotationsUpdate.create(fontTokenAnnotations));
			this._onDidChangeLineHeight.fire(affectedLineHeights);
			this._onDidChangeFont.fire(affectedLineFonts);
		}));
	}

	public handleDidChangeContent(change: IModelContentChangedEvent) {
		const edits = offsetEditFromContentChanges(change.changes);
		const deletedAnnotations = this._fontAnnotatedString.applyEdit(edits);
		if (deletedAnnotations.length === 0) {
			return;
		}
		/* We should fire line and font change events if decorations have been added or removed
		 * No decorations are added on edit, but they can be removed */
		const affectedLineHeights = new Set<LineHeightChangingDecoration>();
		const affectedLineFonts = new Set<LineFontChangingDecoration>();
		for (const deletedAnnotation of deletedAnnotations) {
			const startPosition = this.textModel.getPositionAt(deletedAnnotation.range.start);
			const lineNumber = startPosition.lineNumber;
			const decorationId = deletedAnnotation.annotation.decorationId;
			affectedLineHeights.add(new LineHeightChangingDecoration(0, decorationId, lineNumber, null));
			affectedLineFonts.add(new LineFontChangingDecoration(0, decorationId, lineNumber));
		}
		this._onDidChangeLineHeight.fire(affectedLineHeights);
		this._onDidChangeFont.fire(affectedLineFonts);
	}

	public getDecorationsInRange(range: Range, ownerId?: number, filterOutValidation?: boolean, onlyMinimapDecorations?: boolean): IModelDecoration[] {
		const startOffsetOfRange = this.textModel.getOffsetAt(range.getStartPosition());
		const endOffsetOfRange = this.textModel.getOffsetAt(range.getEndPosition());
		const annotations = this._fontAnnotatedString.getAnnotationsIntersecting(new OffsetRange(startOffsetOfRange, endOffsetOfRange));

		const decorations: IModelDecoration[] = [];
		for (const annotation of annotations) {
			const annotationStartPosition = this.textModel.getPositionAt(annotation.range.start);
			const annotationEndPosition = this.textModel.getPositionAt(annotation.range.endExclusive);
			const range = Range.fromPositions(annotationStartPosition, annotationEndPosition);
			const anno = annotation.annotation;
			const className = classNameForFontTokenDecorations(anno.fontToken.fontFamily ?? '', anno.fontToken.fontSize ?? '');
			const affectsFont = !!(anno.fontToken.fontFamily || anno.fontToken.fontSize);
			const id = anno.decorationId;
			decorations.push({
				id: id,
				options: {
					description: 'FontOptionDecoration',
					inlineClassName: className,
					affectsFont
				},
				ownerId: 0,
				range
			});
		}
		return decorations;
	}

	public getAllDecorations(ownerId?: number, filterOutValidation?: boolean): IModelDecoration[] {
		return this.getDecorationsInRange(
			new Range(1, 1, this.textModel.getLineCount(), 1),
			ownerId,
			filterOutValidation
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/tokens/tokenizationTextModelPart.ts]---
Location: vscode-main/src/vs/editor/common/model/tokens/tokenizationTextModelPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../../base/common/charCode.js';
import { BugIndicatingError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { countEOL } from '../../core/misc/eolCounter.js';
import { IPosition, Position } from '../../core/position.js';
import { Range } from '../../core/range.js';
import { IWordAtPosition, getWordAtText } from '../../core/wordHelper.js';
import { StandardTokenType } from '../../encodedTokenAttributes.js';
import { ILanguageService } from '../../languages/language.js';
import { ILanguageConfigurationService, LanguageConfigurationServiceChangeEvent, ResolvedLanguageConfiguration } from '../../languages/languageConfigurationRegistry.js';
import { BracketPairsTextModelPart } from '../bracketPairsTextModelPart/bracketPairsImpl.js';
import { TextModel } from '../textModel.js';
import { TextModelPart } from '../textModelPart.js';
import { AbstractSyntaxTokenBackend, AttachedViews } from './abstractSyntaxTokenBackend.js';
import { TreeSitterSyntaxTokenBackend } from './treeSitter/treeSitterSyntaxTokenBackend.js';
import { IModelContentChangedEvent, IModelLanguageChangedEvent, IModelLanguageConfigurationChangedEvent, IModelTokensChangedEvent, IModelFontTokensChangedEvent } from '../../textModelEvents.js';
import { ITokenizationTextModelPart } from '../../tokenizationTextModelPart.js';
import { LineTokens } from '../../tokens/lineTokens.js';
import { SparseMultilineTokens } from '../../tokens/sparseMultilineTokens.js';
import { SparseTokensStore } from '../../tokens/sparseTokensStore.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { TokenizerSyntaxTokenBackend } from './tokenizerSyntaxTokenBackend.js';
import { ITreeSitterLibraryService } from '../../services/treeSitter/treeSitterLibraryService.js';
import { derived, IObservable, ISettableObservable, observableValue } from '../../../../base/common/observable.js';

export class TokenizationTextModelPart extends TextModelPart implements ITokenizationTextModelPart {
	private readonly _semanticTokens: SparseTokensStore;

	private readonly _onDidChangeLanguage: Emitter<IModelLanguageChangedEvent>;
	public readonly onDidChangeLanguage: Event<IModelLanguageChangedEvent>;

	private readonly _onDidChangeLanguageConfiguration: Emitter<IModelLanguageConfigurationChangedEvent>;
	public readonly onDidChangeLanguageConfiguration: Event<IModelLanguageConfigurationChangedEvent>;

	private readonly _onDidChangeTokens: Emitter<IModelTokensChangedEvent>;
	public readonly onDidChangeTokens: Event<IModelTokensChangedEvent>;

	private readonly _onDidChangeFontTokens: Emitter<IModelFontTokensChangedEvent> = this._register(new Emitter<IModelFontTokensChangedEvent>());
	public readonly onDidChangeFontTokens: Event<IModelFontTokensChangedEvent> = this._onDidChangeFontTokens.event;

	public readonly tokens: IObservable<AbstractSyntaxTokenBackend>;
	private readonly _useTreeSitter: IObservable<boolean>;
	private readonly _languageIdObs: ISettableObservable<string>;

	constructor(
		private readonly _textModel: TextModel,
		private readonly _bracketPairsTextModelPart: BracketPairsTextModelPart,
		private _languageId: string,
		private readonly _attachedViews: AttachedViews,
		@ILanguageService private readonly _languageService: ILanguageService,
		@ILanguageConfigurationService private readonly _languageConfigurationService: ILanguageConfigurationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITreeSitterLibraryService private readonly _treeSitterLibraryService: ITreeSitterLibraryService,
	) {
		super();

		this._languageIdObs = observableValue(this, this._languageId);

		this._useTreeSitter = derived(this, reader => {
			const languageId = this._languageIdObs.read(reader);
			return this._treeSitterLibraryService.supportsLanguage(languageId, reader);
		});

		this.tokens = derived(this, reader => {
			let tokens: AbstractSyntaxTokenBackend;
			if (this._useTreeSitter.read(reader)) {
				tokens = reader.store.add(this._instantiationService.createInstance(
					TreeSitterSyntaxTokenBackend,
					this._languageIdObs,
					this._languageService.languageIdCodec,
					this._textModel,
					this._attachedViews.visibleLineRanges
				));
			} else {
				tokens = reader.store.add(new TokenizerSyntaxTokenBackend(this._languageService.languageIdCodec, this._textModel, () => this._languageId, this._attachedViews));
			}

			reader.store.add(tokens.onDidChangeTokens(e => {
				this._emitModelTokensChangedEvent(e);
			}));
			reader.store.add(tokens.onDidChangeFontTokens(e => {
				if (!this._textModel._isDisposing()) {
					this._onDidChangeFontTokens.fire(e);
				}
			}));

			reader.store.add(tokens.onDidChangeBackgroundTokenizationState(e => {
				this._bracketPairsTextModelPart.handleDidChangeBackgroundTokenizationState();
			}));
			return tokens;
		});

		let hadTokens = false;
		this.tokens.recomputeInitiallyAndOnChange(this._store, value => {
			if (hadTokens) {
				// We need to reset the tokenization, as the new token provider otherwise won't have a chance to provide tokens until some action happens in the editor.
				// TODO@hediet: Look into why this is needed.
				value.todo_resetTokenization();
			}
			hadTokens = true;
		});

		this._semanticTokens = new SparseTokensStore(this._languageService.languageIdCodec);
		this._onDidChangeLanguage = this._register(new Emitter<IModelLanguageChangedEvent>());
		this.onDidChangeLanguage = this._onDidChangeLanguage.event;
		this._onDidChangeLanguageConfiguration = this._register(new Emitter<IModelLanguageConfigurationChangedEvent>());
		this.onDidChangeLanguageConfiguration = this._onDidChangeLanguageConfiguration.event;
		this._onDidChangeTokens = this._register(new Emitter<IModelTokensChangedEvent>());
		this.onDidChangeTokens = this._onDidChangeTokens.event;
		this._onDidChangeFontTokens = this._register(new Emitter<IModelFontTokensChangedEvent>());
		this.onDidChangeFontTokens = this._onDidChangeFontTokens.event;
	}

	_hasListeners(): boolean {
		// Note: _onDidChangeFontTokens is intentionally excluded because it's an internal event
		// that TokenizationFontDecorationProvider subscribes to during TextModel construction
		return (this._onDidChangeLanguage.hasListeners()
			|| this._onDidChangeLanguageConfiguration.hasListeners()
			|| this._onDidChangeTokens.hasListeners());
	}

	public handleLanguageConfigurationServiceChange(e: LanguageConfigurationServiceChangeEvent): void {
		if (e.affects(this._languageId)) {
			this._onDidChangeLanguageConfiguration.fire({});
		}
	}

	public handleDidChangeContent(e: IModelContentChangedEvent): void {
		if (e.isFlush) {
			this._semanticTokens.flush();
		} else if (!e.isEolChange) { // We don't have to do anything on an EOL change
			for (const c of e.changes) {
				const [eolCount, firstLineLength, lastLineLength] = countEOL(c.text);

				this._semanticTokens.acceptEdit(
					c.range,
					eolCount,
					firstLineLength,
					lastLineLength,
					c.text.length > 0 ? c.text.charCodeAt(0) : CharCode.Null
				);
			}
		}

		this.tokens.get().handleDidChangeContent(e);
	}

	public handleDidChangeAttached(): void {
		this.tokens.get().handleDidChangeAttached();
	}

	/**
	 * Includes grammar and semantic tokens.
	 */
	public getLineTokens(lineNumber: number): LineTokens {
		this.validateLineNumber(lineNumber);
		const syntacticTokens = this.tokens.get().getLineTokens(lineNumber);
		return this._semanticTokens.addSparseTokens(lineNumber, syntacticTokens);
	}

	private _emitModelTokensChangedEvent(e: IModelTokensChangedEvent): void {
		if (!this._textModel._isDisposing()) {
			this._bracketPairsTextModelPart.handleDidChangeTokens(e);
			this._onDidChangeTokens.fire(e);
		}
	}

	// #region Grammar Tokens

	private validateLineNumber(lineNumber: number): void {
		if (lineNumber < 1 || lineNumber > this._textModel.getLineCount()) {
			throw new BugIndicatingError('Illegal value for lineNumber');
		}
	}

	public get hasTokens(): boolean {
		return this.tokens.get().hasTokens;
	}

	public resetTokenization() {
		this.tokens.get().todo_resetTokenization();
	}

	public get backgroundTokenizationState() {
		return this.tokens.get().backgroundTokenizationState;
	}

	public forceTokenization(lineNumber: number): void {
		this.validateLineNumber(lineNumber);
		this.tokens.get().forceTokenization(lineNumber);
	}

	public hasAccurateTokensForLine(lineNumber: number): boolean {
		this.validateLineNumber(lineNumber);
		return this.tokens.get().hasAccurateTokensForLine(lineNumber);
	}

	public isCheapToTokenize(lineNumber: number): boolean {
		this.validateLineNumber(lineNumber);
		return this.tokens.get().isCheapToTokenize(lineNumber);
	}

	public tokenizeIfCheap(lineNumber: number): void {
		this.validateLineNumber(lineNumber);
		this.tokens.get().tokenizeIfCheap(lineNumber);
	}

	public getTokenTypeIfInsertingCharacter(lineNumber: number, column: number, character: string): StandardTokenType {
		return this.tokens.get().getTokenTypeIfInsertingCharacter(lineNumber, column, character);
	}

	public tokenizeLinesAt(lineNumber: number, lines: string[]): LineTokens[] | null {
		return this.tokens.get().tokenizeLinesAt(lineNumber, lines);
	}

	// #endregion

	// #region Semantic Tokens

	public setSemanticTokens(tokens: SparseMultilineTokens[] | null, isComplete: boolean): void {
		this._semanticTokens.set(tokens, isComplete, this._textModel);

		this._emitModelTokensChangedEvent({
			semanticTokensApplied: tokens !== null,
			ranges: [{ fromLineNumber: 1, toLineNumber: this._textModel.getLineCount() }],
		});
	}

	public hasCompleteSemanticTokens(): boolean {
		return this._semanticTokens.isComplete();
	}

	public hasSomeSemanticTokens(): boolean {
		return !this._semanticTokens.isEmpty();
	}

	public setPartialSemanticTokens(range: Range, tokens: SparseMultilineTokens[]): void {
		if (this.hasCompleteSemanticTokens()) {
			return;
		}
		const changedRange = this._textModel.validateRange(
			this._semanticTokens.setPartial(range, tokens)
		);

		this._emitModelTokensChangedEvent({
			semanticTokensApplied: true,
			ranges: [
				{
					fromLineNumber: changedRange.startLineNumber,
					toLineNumber: changedRange.endLineNumber,
				},
			],
		});
	}

	// #endregion

	// #region Utility Methods

	public getWordAtPosition(_position: IPosition): IWordAtPosition | null {
		this.assertNotDisposed();

		const position = this._textModel.validatePosition(_position);
		const lineContent = this._textModel.getLineContent(position.lineNumber);
		const lineTokens = this.getLineTokens(position.lineNumber);
		const tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);

		// (1). First try checking right biased word
		const [rbStartOffset, rbEndOffset] = TokenizationTextModelPart._findLanguageBoundaries(lineTokens, tokenIndex);
		const rightBiasedWord = getWordAtText(
			position.column,
			this.getLanguageConfiguration(lineTokens.getLanguageId(tokenIndex)).getWordDefinition(),
			lineContent.substring(rbStartOffset, rbEndOffset),
			rbStartOffset
		);
		// Make sure the result touches the original passed in position
		if (
			rightBiasedWord &&
			rightBiasedWord.startColumn <= _position.column &&
			_position.column <= rightBiasedWord.endColumn
		) {
			return rightBiasedWord;
		}

		// (2). Else, if we were at a language boundary, check the left biased word
		if (tokenIndex > 0 && rbStartOffset === position.column - 1) {
			// edge case, where `position` sits between two tokens belonging to two different languages
			const [lbStartOffset, lbEndOffset] = TokenizationTextModelPart._findLanguageBoundaries(
				lineTokens,
				tokenIndex - 1
			);
			const leftBiasedWord = getWordAtText(
				position.column,
				this.getLanguageConfiguration(lineTokens.getLanguageId(tokenIndex - 1)).getWordDefinition(),
				lineContent.substring(lbStartOffset, lbEndOffset),
				lbStartOffset
			);
			// Make sure the result touches the original passed in position
			if (
				leftBiasedWord &&
				leftBiasedWord.startColumn <= _position.column &&
				_position.column <= leftBiasedWord.endColumn
			) {
				return leftBiasedWord;
			}
		}

		return null;
	}

	private getLanguageConfiguration(languageId: string): ResolvedLanguageConfiguration {
		return this._languageConfigurationService.getLanguageConfiguration(languageId);
	}

	private static _findLanguageBoundaries(lineTokens: LineTokens, tokenIndex: number): [number, number] {
		const languageId = lineTokens.getLanguageId(tokenIndex);

		// go left until a different language is hit
		let startOffset = 0;
		for (let i = tokenIndex; i >= 0 && lineTokens.getLanguageId(i) === languageId; i--) {
			startOffset = lineTokens.getStartOffset(i);
		}

		// go right until a different language is hit
		let endOffset = lineTokens.getLineContent().length;
		for (
			let i = tokenIndex, tokenCount = lineTokens.getCount();
			i < tokenCount && lineTokens.getLanguageId(i) === languageId;
			i++
		) {
			endOffset = lineTokens.getEndOffset(i);
		}

		return [startOffset, endOffset];
	}

	public getWordUntilPosition(position: IPosition): IWordAtPosition {
		const wordAtPosition = this.getWordAtPosition(position);
		if (!wordAtPosition) {
			return { word: '', startColumn: position.column, endColumn: position.column, };
		}
		return {
			word: wordAtPosition.word.substr(0, position.column - wordAtPosition.startColumn),
			startColumn: wordAtPosition.startColumn,
			endColumn: position.column,
		};
	}

	// #endregion

	// #region Language Id handling

	public getLanguageId(): string {
		return this._languageId;
	}

	public getLanguageIdAtPosition(lineNumber: number, column: number): string {
		const position = this._textModel.validatePosition(new Position(lineNumber, column));
		const lineTokens = this.getLineTokens(position.lineNumber);
		return lineTokens.getLanguageId(lineTokens.findTokenIndexAtOffset(position.column - 1));
	}

	public setLanguageId(languageId: string, source: string = 'api'): void {
		if (this._languageId === languageId) {
			// There's nothing to do
			return;
		}

		const e: IModelLanguageChangedEvent = {
			oldLanguage: this._languageId,
			newLanguage: languageId,
			source
		};

		this._languageId = languageId;
		this._languageIdObs.set(languageId, undefined);
		this._bracketPairsTextModelPart.handleDidChangeLanguage(e);

		this._onDidChangeLanguage.fire(e);
		this._onDidChangeLanguageConfiguration.fire({});
	}

	// #endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/tokens/tokenizerSyntaxTokenBackend.ts]---
Location: vscode-main/src/vs/editor/common/model/tokens/tokenizerSyntaxTokenBackend.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { MutableDisposable, DisposableMap } from '../../../../base/common/lifecycle.js';
import { countEOL } from '../../core/misc/eolCounter.js';
import { Position } from '../../core/position.js';
import { LineRange } from '../../core/ranges/lineRange.js';
import { StandardTokenType } from '../../encodedTokenAttributes.js';
import { IBackgroundTokenizer, IState, ILanguageIdCodec, TokenizationRegistry, ITokenizationSupport, IBackgroundTokenizationStore } from '../../languages.js';
import { IAttachedView } from '../../model.js';
import { FontTokensUpdate, IModelContentChangedEvent } from '../../textModelEvents.js';
import { BackgroundTokenizationState } from '../../tokenizationTextModelPart.js';
import { ContiguousMultilineTokens } from '../../tokens/contiguousMultilineTokens.js';
import { ContiguousMultilineTokensBuilder } from '../../tokens/contiguousMultilineTokensBuilder.js';
import { ContiguousTokensStore } from '../../tokens/contiguousTokensStore.js';
import { LineTokens } from '../../tokens/lineTokens.js';
import { TextModel } from '../textModel.js';
import { TokenizerWithStateStoreAndTextModel, DefaultBackgroundTokenizer, TrackingTokenizationStateStore } from '../textModelTokens.js';
import { AbstractSyntaxTokenBackend, AttachedViewHandler, AttachedViews } from './abstractSyntaxTokenBackend.js';

/** For TextMate */
export class TokenizerSyntaxTokenBackend extends AbstractSyntaxTokenBackend {
	private _tokenizer: TokenizerWithStateStoreAndTextModel | null = null;
	protected _backgroundTokenizationState: BackgroundTokenizationState = BackgroundTokenizationState.InProgress;
	protected readonly _onDidChangeBackgroundTokenizationState: Emitter<void> = this._register(new Emitter<void>());
	public readonly onDidChangeBackgroundTokenizationState: Event<void> = this._onDidChangeBackgroundTokenizationState.event;

	private _defaultBackgroundTokenizer: DefaultBackgroundTokenizer | null = null;
	private readonly _backgroundTokenizer = this._register(new MutableDisposable<IBackgroundTokenizer>());

	private readonly _tokens = new ContiguousTokensStore(this._languageIdCodec);
	private _debugBackgroundTokens: ContiguousTokensStore | undefined;
	private _debugBackgroundStates: TrackingTokenizationStateStore<IState> | undefined;

	private readonly _debugBackgroundTokenizer = this._register(new MutableDisposable<IBackgroundTokenizer>());

	private readonly _attachedViewStates = this._register(new DisposableMap<IAttachedView, AttachedViewHandler>());

	constructor(
		languageIdCodec: ILanguageIdCodec,
		textModel: TextModel,
		private readonly getLanguageId: () => string,
		attachedViews: AttachedViews,
	) {
		super(languageIdCodec, textModel);

		this._register(TokenizationRegistry.onDidChange((e) => {
			const languageId = this.getLanguageId();
			if (e.changedLanguages.indexOf(languageId) === -1) {
				return;
			}
			this.todo_resetTokenization();
		}));

		this.todo_resetTokenization();

		this._register(attachedViews.onDidChangeVisibleRanges(({ view, state }) => {
			if (state) {
				let existing = this._attachedViewStates.get(view);
				if (!existing) {
					existing = new AttachedViewHandler(() => this.refreshRanges(existing!.lineRanges));
					this._attachedViewStates.set(view, existing);
				}
				existing.handleStateChange(state);
			} else {
				this._attachedViewStates.deleteAndDispose(view);
			}
		}));
	}

	public todo_resetTokenization(fireTokenChangeEvent: boolean = true): void {
		this._tokens.flush();
		this._debugBackgroundTokens?.flush();
		if (this._debugBackgroundStates) {
			this._debugBackgroundStates = new TrackingTokenizationStateStore(this._textModel.getLineCount());
		}
		if (fireTokenChangeEvent) {
			this._onDidChangeTokens.fire({
				semanticTokensApplied: false,
				ranges: [
					{
						fromLineNumber: 1,
						toLineNumber: this._textModel.getLineCount(),
					},
				],
			});
		}

		const initializeTokenization = (): [ITokenizationSupport, IState] | [null, null] => {
			if (this._textModel.isTooLargeForTokenization()) {
				return [null, null];
			}
			const tokenizationSupport = TokenizationRegistry.get(this.getLanguageId());
			if (!tokenizationSupport) {
				return [null, null];
			}
			let initialState: IState;
			try {
				initialState = tokenizationSupport.getInitialState();
			} catch (e) {
				onUnexpectedError(e);
				return [null, null];
			}
			return [tokenizationSupport, initialState];
		};

		const [tokenizationSupport, initialState] = initializeTokenization();
		if (tokenizationSupport && initialState) {
			this._tokenizer = new TokenizerWithStateStoreAndTextModel(this._textModel.getLineCount(), tokenizationSupport, this._textModel, this._languageIdCodec);
		} else {
			this._tokenizer = null;
		}

		this._backgroundTokenizer.clear();

		this._defaultBackgroundTokenizer = null;
		if (this._tokenizer) {
			const b: IBackgroundTokenizationStore = {
				setTokens: (tokens) => {
					this.setTokens(tokens);
				},
				setFontInfo: (changes: FontTokensUpdate) => {
					this.setFontInfo(changes);
				},
				backgroundTokenizationFinished: () => {
					if (this._backgroundTokenizationState === BackgroundTokenizationState.Completed) {
						// We already did a full tokenization and don't go back to progressing.
						return;
					}
					const newState = BackgroundTokenizationState.Completed;
					this._backgroundTokenizationState = newState;
					this._onDidChangeBackgroundTokenizationState.fire();
				},
				setEndState: (lineNumber, state) => {
					if (!this._tokenizer) { return; }
					const firstInvalidEndStateLineNumber = this._tokenizer.store.getFirstInvalidEndStateLineNumber();
					// Don't accept states for definitely valid states, the renderer is ahead of the worker!
					if (firstInvalidEndStateLineNumber !== null && lineNumber >= firstInvalidEndStateLineNumber) {
						this._tokenizer?.store.setEndState(lineNumber, state);
					}
				},
			};

			if (tokenizationSupport && tokenizationSupport.createBackgroundTokenizer && !tokenizationSupport.backgroundTokenizerShouldOnlyVerifyTokens) {
				this._backgroundTokenizer.value = tokenizationSupport.createBackgroundTokenizer(this._textModel, b);
			}
			if (!this._backgroundTokenizer.value && !this._textModel.isTooLargeForTokenization()) {
				this._backgroundTokenizer.value = this._defaultBackgroundTokenizer =
					new DefaultBackgroundTokenizer(this._tokenizer, b);
				this._defaultBackgroundTokenizer.handleChanges();
			}

			if (tokenizationSupport?.backgroundTokenizerShouldOnlyVerifyTokens && tokenizationSupport.createBackgroundTokenizer) {
				this._debugBackgroundTokens = new ContiguousTokensStore(this._languageIdCodec);
				this._debugBackgroundStates = new TrackingTokenizationStateStore(this._textModel.getLineCount());
				this._debugBackgroundTokenizer.clear();
				this._debugBackgroundTokenizer.value = tokenizationSupport.createBackgroundTokenizer(this._textModel, {
					setTokens: (tokens) => {
						this._debugBackgroundTokens?.setMultilineTokens(tokens, this._textModel);
					},
					setFontInfo: (changes: FontTokensUpdate) => {
						this.setFontInfo(changes);
					},
					backgroundTokenizationFinished() {
						// NO OP
					},
					setEndState: (lineNumber, state) => {
						this._debugBackgroundStates?.setEndState(lineNumber, state);
					},
				});
			} else {
				this._debugBackgroundTokens = undefined;
				this._debugBackgroundStates = undefined;
				this._debugBackgroundTokenizer.value = undefined;
			}
		}

		this.refreshAllVisibleLineTokens();
	}

	public handleDidChangeAttached() {
		this._defaultBackgroundTokenizer?.handleChanges();
	}

	public handleDidChangeContent(e: IModelContentChangedEvent): void {
		if (e.isFlush) {
			// Don't fire the event, as the view might not have got the text change event yet
			this.todo_resetTokenization(false);
		} else if (!e.isEolChange) { // We don't have to do anything on an EOL change
			for (const c of e.changes) {
				const [eolCount, firstLineLength] = countEOL(c.text);

				this._tokens.acceptEdit(c.range, eolCount, firstLineLength);
				this._debugBackgroundTokens?.acceptEdit(c.range, eolCount, firstLineLength);
			}
			this._debugBackgroundStates?.acceptChanges(e.changes);

			if (this._tokenizer) {
				this._tokenizer.store.acceptChanges(e.changes);
			}
			this._defaultBackgroundTokenizer?.handleChanges();
		}
	}

	private setTokens(tokens: ContiguousMultilineTokens[]): { changes: { fromLineNumber: number; toLineNumber: number }[] } {
		const { changes } = this._tokens.setMultilineTokens(tokens, this._textModel);

		if (changes.length > 0) {
			this._onDidChangeTokens.fire({ semanticTokensApplied: false, ranges: changes, });
		}

		return { changes: changes };
	}

	private setFontInfo(changes: FontTokensUpdate): void {
		this._onDidChangeFontTokens.fire({ changes });
	}

	private refreshAllVisibleLineTokens(): void {
		const ranges = LineRange.joinMany([...this._attachedViewStates].map(([_, s]) => s.lineRanges));
		this.refreshRanges(ranges);
	}

	private refreshRanges(ranges: readonly LineRange[]): void {
		for (const range of ranges) {
			this.refreshRange(range.startLineNumber, range.endLineNumberExclusive - 1);
		}
	}

	private refreshRange(startLineNumber: number, endLineNumber: number): void {
		if (!this._tokenizer) {
			return;
		}

		startLineNumber = Math.max(1, Math.min(this._textModel.getLineCount(), startLineNumber));
		endLineNumber = Math.min(this._textModel.getLineCount(), endLineNumber);

		const builder = new ContiguousMultilineTokensBuilder();
		const { heuristicTokens } = this._tokenizer.tokenizeHeuristically(builder, startLineNumber, endLineNumber);
		const changedTokens = this.setTokens(builder.finalize());

		if (heuristicTokens) {
			// We overrode tokens with heuristically computed ones.
			// Because old states might get reused (thus stopping invalidation),
			// we have to explicitly request the tokens for the changed ranges again.
			for (const c of changedTokens.changes) {
				this._backgroundTokenizer.value?.requestTokens(c.fromLineNumber, c.toLineNumber + 1);
			}
		}

		this._defaultBackgroundTokenizer?.checkFinished();
	}

	public forceTokenization(lineNumber: number): void {
		const builder = new ContiguousMultilineTokensBuilder();
		this._tokenizer?.updateTokensUntilLine(builder, lineNumber);
		this.setTokens(builder.finalize());
		this._defaultBackgroundTokenizer?.checkFinished();
	}

	public hasAccurateTokensForLine(lineNumber: number): boolean {
		if (!this._tokenizer) {
			return true;
		}
		return this._tokenizer.hasAccurateTokensForLine(lineNumber);
	}

	public isCheapToTokenize(lineNumber: number): boolean {
		if (!this._tokenizer) {
			return true;
		}
		return this._tokenizer.isCheapToTokenize(lineNumber);
	}

	public getLineTokens(lineNumber: number): LineTokens {
		const lineText = this._textModel.getLineContent(lineNumber);
		const result = this._tokens.getTokens(
			this._textModel.getLanguageId(),
			lineNumber - 1,
			lineText
		);
		if (this._debugBackgroundTokens && this._debugBackgroundStates && this._tokenizer) {
			if (this._debugBackgroundStates.getFirstInvalidEndStateLineNumberOrMax() > lineNumber && this._tokenizer.store.getFirstInvalidEndStateLineNumberOrMax() > lineNumber) {
				const backgroundResult = this._debugBackgroundTokens.getTokens(
					this._textModel.getLanguageId(),
					lineNumber - 1,
					lineText
				);
				if (!result.equals(backgroundResult) && this._debugBackgroundTokenizer.value?.reportMismatchingTokens) {
					this._debugBackgroundTokenizer.value.reportMismatchingTokens(lineNumber);
				}
			}
		}
		return result;
	}

	public getTokenTypeIfInsertingCharacter(lineNumber: number, column: number, character: string): StandardTokenType {
		if (!this._tokenizer) {
			return StandardTokenType.Other;
		}

		const position = this._textModel.validatePosition(new Position(lineNumber, column));
		this.forceTokenization(position.lineNumber);
		return this._tokenizer.getTokenTypeIfInsertingCharacter(position, character);
	}


	public tokenizeLinesAt(lineNumber: number, lines: string[]): LineTokens[] | null {
		if (!this._tokenizer) {
			return null;
		}
		this.forceTokenization(lineNumber);
		return this._tokenizer.tokenizeLinesAt(lineNumber, lines);
	}

	public get hasTokens(): boolean {
		return this._tokens.hasTokens;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/tokens/treeSitter/cursorUtils.ts]---
Location: vscode-main/src/vs/editor/common/model/tokens/treeSitter/cursorUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import type * as TreeSitter from '@vscode/tree-sitter-wasm';

export function gotoNextSibling(newCursor: TreeSitter.TreeCursor, oldCursor: TreeSitter.TreeCursor) {
	const n = newCursor.gotoNextSibling();
	const o = oldCursor.gotoNextSibling();
	if (n !== o) {
		throw new Error('Trees are out of sync');
	}
	return n && o;
}

export function gotoParent(newCursor: TreeSitter.TreeCursor, oldCursor: TreeSitter.TreeCursor) {
	const n = newCursor.gotoParent();
	const o = oldCursor.gotoParent();
	if (n !== o) {
		throw new Error('Trees are out of sync');
	}
	return n && o;
}

export function gotoNthChild(newCursor: TreeSitter.TreeCursor, oldCursor: TreeSitter.TreeCursor, index: number) {
	const n = newCursor.gotoFirstChild();
	const o = oldCursor.gotoFirstChild();
	if (n !== o) {
		throw new Error('Trees are out of sync');
	}
	if (index === 0) {
		return n && o;
	}
	for (let i = 1; i <= index; i++) {
		const nn = newCursor.gotoNextSibling();
		const oo = oldCursor.gotoNextSibling();
		if (nn !== oo) {
			throw new Error('Trees are out of sync');
		}
		if (!nn || !oo) {
			return false;
		}
	}
	return n && o;
}

export function nextSiblingOrParentSibling(newCursor: TreeSitter.TreeCursor, oldCursor: TreeSitter.TreeCursor) {
	do {
		if (newCursor.currentNode.nextSibling) {
			return gotoNextSibling(newCursor, oldCursor);
		}
		if (newCursor.currentNode.parent) {
			gotoParent(newCursor, oldCursor);
		}
	} while (newCursor.currentNode.nextSibling || newCursor.currentNode.parent);
	return false;
}

export function getClosestPreviousNodes(cursor: TreeSitter.TreeCursor, tree: TreeSitter.Tree): TreeSitter.Node | undefined {
	// Go up parents until the end of the parent is before the start of the current.
	const findPrev = tree.walk();
	findPrev.resetTo(cursor);

	const startingNode = cursor.currentNode;
	do {
		if (findPrev.currentNode.previousSibling && ((findPrev.currentNode.endIndex - findPrev.currentNode.startIndex) !== 0)) {
			findPrev.gotoPreviousSibling();
		} else {
			while (!findPrev.currentNode.previousSibling && findPrev.currentNode.parent) {
				findPrev.gotoParent();
			}
			findPrev.gotoPreviousSibling();
		}
	} while ((findPrev.currentNode.endIndex > startingNode.startIndex)
	&& (findPrev.currentNode.parent || findPrev.currentNode.previousSibling)

		&& (findPrev.currentNode.id !== startingNode.id));

	if ((findPrev.currentNode.id !== startingNode.id) && findPrev.currentNode.endIndex <= startingNode.startIndex) {
		return findPrev.currentNode;
	} else {
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/tokens/treeSitter/tokenStore.ts]---
Location: vscode-main/src/vs/editor/common/model/tokens/treeSitter/tokenStore.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { ITextModel } from '../../../model.js';

// Exported for tests
export class ListNode implements IDisposable {
	parent?: ListNode;
	private readonly _children: Node[] = [];
	get children(): ReadonlyArray<Node> { return this._children; }

	private _length: number = 0;
	get length(): number { return this._length; }

	constructor(public readonly height: number) { }

	static create(node1: Node, node2: Node) {
		const list = new ListNode(node1.height + 1);
		list.appendChild(node1);
		list.appendChild(node2);
		return list;
	}

	canAppendChild(): boolean {
		return this._children.length < 3;
	}

	appendChild(node: Node) {
		if (!this.canAppendChild()) {
			throw new Error('Cannot insert more than 3 children in a ListNode');
		}
		this._children.push(node);

		this._length += node.length;
		this._updateParentLength(node.length);
		if (!isLeaf(node)) {
			node.parent = this;
		}
	}

	private _updateParentLength(delta: number) {
		let updateParent = this.parent;
		while (updateParent) {
			updateParent._length += delta;
			updateParent = updateParent.parent;
		}
	}

	unappendChild(): Node {
		const child = this._children.pop()!;
		this._length -= child.length;
		this._updateParentLength(-child.length);
		return child;
	}

	prependChild(node: Node) {
		if (this._children.length >= 3) {
			throw new Error('Cannot prepend more than 3 children in a ListNode');
		}
		this._children.unshift(node);

		this._length += node.length;
		this._updateParentLength(node.length);
		if (!isLeaf(node)) {
			node.parent = this;
		}
	}

	unprependChild(): Node {
		const child = this._children.shift()!;
		this._length -= child.length;
		this._updateParentLength(-child.length);
		return child;
	}

	lastChild(): Node {
		return this._children[this._children.length - 1];
	}

	dispose() {
		this._children.splice(0, this._children.length);
	}
}

export enum TokenQuality {
	None = 0,
	ViewportGuess = 1,
	EditGuess = 2,
	Accurate = 3
}

type Node = ListNode | LeafNode;

// Exported for tests
export interface LeafNode {
	readonly length: number;
	token: number;
	tokenQuality: TokenQuality;
	height: 0;
}

export interface TokenUpdate {
	readonly startOffsetInclusive: number;
	readonly length: number;
	readonly token: number;
}

function isLeaf(node: Node): node is LeafNode {
	return (node as LeafNode).token !== undefined;
}

// Heavily inspired by https://github.com/microsoft/vscode/blob/4eb2658d592cb6114a7a393655574176cc790c5b/src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/concat23Trees.ts#L108-L109
function append(node: Node, nodeToAppend: Node): Node {
	let curNode = node;
	const parents: ListNode[] = [];
	let nodeToAppendOfCorrectHeight: Node | undefined;
	while (true) {
		if (nodeToAppend.height === curNode.height) {
			nodeToAppendOfCorrectHeight = nodeToAppend;
			break;
		}

		if (isLeaf(curNode)) {
			throw new Error('unexpected');
		}
		parents.push(curNode);
		curNode = curNode.lastChild();
	}
	for (let i = parents.length - 1; i >= 0; i--) {
		const parent = parents[i];
		if (nodeToAppendOfCorrectHeight) {
			// Can we take the element?
			if (parent.children.length >= 3) {
				// we need to split to maintain (2,3)-tree property.
				// Send the third element + the new element to the parent.
				const newList = ListNode.create(parent.unappendChild(), nodeToAppendOfCorrectHeight);
				nodeToAppendOfCorrectHeight = newList;
			} else {
				parent.appendChild(nodeToAppendOfCorrectHeight);
				nodeToAppendOfCorrectHeight = undefined;
			}
		}
	}
	if (nodeToAppendOfCorrectHeight) {
		const newList = new ListNode(nodeToAppendOfCorrectHeight.height + 1);
		newList.appendChild(node);
		newList.appendChild(nodeToAppendOfCorrectHeight);
		return newList;
	} else {
		return node;
	}
}

function prepend(list: Node, nodeToAppend: Node): Node {
	let curNode = list;
	const parents: ListNode[] = [];
	while (nodeToAppend.height !== curNode.height) {
		if (isLeaf(curNode)) {
			throw new Error('unexpected');
		}
		parents.push(curNode);
		// assert 2 <= curNode.childrenFast.length <= 3
		curNode = curNode.children[0] as ListNode;
	}
	let nodeToPrependOfCorrectHeight: Node | undefined = nodeToAppend;
	// assert nodeToAppendOfCorrectHeight!.listHeight === curNode.listHeight
	for (let i = parents.length - 1; i >= 0; i--) {
		const parent = parents[i];
		if (nodeToPrependOfCorrectHeight) {
			// Can we take the element?
			if (parent.children.length >= 3) {
				// we need to split to maintain (2,3)-tree property.
				// Send the third element + the new element to the parent.
				nodeToPrependOfCorrectHeight = ListNode.create(nodeToPrependOfCorrectHeight, parent.unprependChild());
			} else {
				parent.prependChild(nodeToPrependOfCorrectHeight);
				nodeToPrependOfCorrectHeight = undefined;
			}
		}
	}
	if (nodeToPrependOfCorrectHeight) {
		return ListNode.create(nodeToPrependOfCorrectHeight, list);
	} else {
		return list;
	}
}

function concat(node1: Node, node2: Node): Node {
	if (node1.height === node2.height) {
		return ListNode.create(node1, node2);
	}
	else if (node1.height > node2.height) {
		// node1 is the tree we want to insert into
		return append(node1, node2);
	} else {
		return prepend(node2, node1);
	}
}

export class TokenStore implements IDisposable {
	private _root: Node;
	get root(): Node {
		return this._root;
	}

	constructor(private readonly _textModel: ITextModel) {
		this._root = this.createEmptyRoot();
	}

	private createEmptyRoot(): Node {
		return {
			length: this._textModel.getValueLength(),
			token: 0,
			height: 0,
			tokenQuality: TokenQuality.None
		};
	}

	/**
	 *
	 * @param update all the tokens for the document in sequence
	 */
	buildStore(tokens: TokenUpdate[], tokenQuality: TokenQuality): void {
		this._root = this.createFromUpdates(tokens, tokenQuality);
	}

	private createFromUpdates(tokens: TokenUpdate[], tokenQuality: TokenQuality): Node {
		if (tokens.length === 0) {
			return this.createEmptyRoot();
		}
		let newRoot: Node = {
			length: tokens[0].length,
			token: tokens[0].token,
			height: 0,
			tokenQuality
		};
		for (let j = 1; j < tokens.length; j++) {
			newRoot = append(newRoot, { length: tokens[j].length, token: tokens[j].token, height: 0, tokenQuality });
		}
		return newRoot;
	}

	/**
	 *
	 * @param tokens tokens are in sequence in the document.
	 */
	update(length: number, tokens: TokenUpdate[], tokenQuality: TokenQuality) {
		if (tokens.length === 0) {
			return;
		}
		this.replace(length, tokens[0].startOffsetInclusive, tokens, tokenQuality);
	}

	delete(length: number, startOffset: number) {
		this.replace(length, startOffset, [], TokenQuality.EditGuess);
	}

	/**
	 *
	 * @param tokens tokens are in sequence in the document.
	 */
	private replace(length: number, updateOffsetStart: number, tokens: TokenUpdate[], tokenQuality: TokenQuality) {
		const firstUnchangedOffsetAfterUpdate = updateOffsetStart + length;
		// Find the last unchanged node preceding the update
		const precedingNodes: Node[] = [];
		// Find the first unchanged node after the update
		const postcedingNodes: Node[] = [];
		const stack: { node: Node; offset: number }[] = [{ node: this._root, offset: 0 }];

		while (stack.length > 0) {
			const node = stack.pop()!;
			const currentOffset = node.offset;

			if (currentOffset < updateOffsetStart && currentOffset + node.node.length <= updateOffsetStart) {
				if (!isLeaf(node.node)) {
					node.node.parent = undefined;
				}
				precedingNodes.push(node.node);
				continue;
			} else if (isLeaf(node.node) && (currentOffset < updateOffsetStart)) {
				// We have a partial preceding node
				precedingNodes.push({ length: updateOffsetStart - currentOffset, token: node.node.token, height: 0, tokenQuality: node.node.tokenQuality });
				// Node could also be postceeding, so don't continue
			}

			if ((updateOffsetStart <= currentOffset) && (currentOffset + node.node.length <= firstUnchangedOffsetAfterUpdate)) {
				continue;
			}

			if (currentOffset >= firstUnchangedOffsetAfterUpdate) {
				if (!isLeaf(node.node)) {
					node.node.parent = undefined;
				}
				postcedingNodes.push(node.node);
				continue;
			} else if (isLeaf(node.node) && (currentOffset + node.node.length > firstUnchangedOffsetAfterUpdate)) {
				// we have a partial postceeding node
				postcedingNodes.push({ length: currentOffset + node.node.length - firstUnchangedOffsetAfterUpdate, token: node.node.token, height: 0, tokenQuality: node.node.tokenQuality });
				continue;
			}

			if (!isLeaf(node.node)) {
				// Push children in reverse order to process them left-to-right when popping
				let childOffset = currentOffset + node.node.length;
				for (let i = node.node.children.length - 1; i >= 0; i--) {
					childOffset -= node.node.children[i].length;
					stack.push({ node: node.node.children[i], offset: childOffset });
				}
			}
		}

		let allNodes: Node[];
		if (tokens.length > 0) {
			allNodes = precedingNodes.concat(this.createFromUpdates(tokens, tokenQuality), postcedingNodes);
		} else {
			allNodes = precedingNodes.concat(postcedingNodes);
		}
		let newRoot: Node = allNodes[0];
		for (let i = 1; i < allNodes.length; i++) {
			newRoot = concat(newRoot, allNodes[i]);
		}

		this._root = newRoot ?? this.createEmptyRoot();
	}

	/**
	 *
	 * @param startOffsetInclusive
	 * @param endOffsetExclusive
	 * @param visitor Return true from visitor to exit early
	 * @returns
	 */
	private traverseInOrderInRange(startOffsetInclusive: number, endOffsetExclusive: number, visitor: (node: Node, offset: number) => boolean): void {
		const stack: { node: Node; offset: number }[] = [{ node: this._root, offset: 0 }];

		while (stack.length > 0) {
			const { node, offset } = stack.pop()!;
			const nodeEnd = offset + node.length;

			// Skip nodes that are completely before or after the range
			if (nodeEnd <= startOffsetInclusive || offset >= endOffsetExclusive) {
				continue;
			}

			if (visitor(node, offset)) {
				return;
			}

			if (!isLeaf(node)) {
				// Push children in reverse order to process them left-to-right when popping
				let childOffset = offset + node.length;
				for (let i = node.children.length - 1; i >= 0; i--) {
					childOffset -= node.children[i].length;
					stack.push({ node: node.children[i], offset: childOffset });
				}
			}
		}
	}

	getTokenAt(offset: number): TokenUpdate | undefined {
		let result: TokenUpdate | undefined;
		this.traverseInOrderInRange(offset, this._root.length, (node, offset) => {
			if (isLeaf(node)) {
				result = { token: node.token, startOffsetInclusive: offset, length: node.length };
				return true;
			}
			return false;
		});
		return result;
	}

	getTokensInRange(startOffsetInclusive: number, endOffsetExclusive: number): TokenUpdate[] {
		const result: { token: number; startOffsetInclusive: number; length: number }[] = [];
		this.traverseInOrderInRange(startOffsetInclusive, endOffsetExclusive, (node, offset) => {
			if (isLeaf(node)) {
				let clippedLength = node.length;
				let clippedOffset = offset;
				if ((offset < startOffsetInclusive) && (offset + node.length > endOffsetExclusive)) {
					clippedOffset = startOffsetInclusive;
					clippedLength = endOffsetExclusive - startOffsetInclusive;
				} else if (offset < startOffsetInclusive) {
					clippedLength -= (startOffsetInclusive - offset);
					clippedOffset = startOffsetInclusive;
				} else if (offset + node.length > endOffsetExclusive) {
					clippedLength -= (offset + node.length - endOffsetExclusive);
				}
				result.push({ token: node.token, startOffsetInclusive: clippedOffset, length: clippedLength });
			}
			return false;
		});
		return result;
	}

	markForRefresh(startOffsetInclusive: number, endOffsetExclusive: number): void {
		this.traverseInOrderInRange(startOffsetInclusive, endOffsetExclusive, (node) => {
			if (isLeaf(node)) {
				node.tokenQuality = TokenQuality.None;
			}
			return false;
		});
	}

	rangeHasTokens(startOffsetInclusive: number, endOffsetExclusive: number, minimumTokenQuality: TokenQuality): boolean {
		let hasAny = true;
		this.traverseInOrderInRange(startOffsetInclusive, endOffsetExclusive, (node) => {
			if (isLeaf(node) && (node.tokenQuality < minimumTokenQuality)) {
				hasAny = false;
			}
			return false;
		});
		return hasAny;
	}

	rangeNeedsRefresh(startOffsetInclusive: number, endOffsetExclusive: number): boolean {
		let needsRefresh = false;
		this.traverseInOrderInRange(startOffsetInclusive, endOffsetExclusive, (node) => {
			if (isLeaf(node) && (node.tokenQuality !== TokenQuality.Accurate)) {
				needsRefresh = true;
			}
			return false;
		});
		return needsRefresh;
	}

	getNeedsRefresh(): { startOffset: number; endOffset: number }[] {
		const result: { startOffset: number; endOffset: number }[] = [];

		this.traverseInOrderInRange(0, this._textModel.getValueLength(), (node, offset) => {
			if (isLeaf(node) && (node.tokenQuality !== TokenQuality.Accurate)) {
				if ((result.length > 0) && (result[result.length - 1].endOffset === offset)) {
					result[result.length - 1].endOffset += node.length;
				} else {
					result.push({ startOffset: offset, endOffset: offset + node.length });
				}
			}
			return false;
		});
		return result;
	}

	public deepCopy(): TokenStore {
		const newStore = new TokenStore(this._textModel);
		newStore._root = this._copyNodeIterative(this._root);
		return newStore;
	}

	private _copyNodeIterative(root: Node): Node {
		const newRoot = isLeaf(root)
			? { length: root.length, token: root.token, tokenQuality: root.tokenQuality, height: root.height }
			: new ListNode(root.height);

		const stack: Array<[Node, Node]> = [[root, newRoot]];

		while (stack.length > 0) {
			const [oldNode, clonedNode] = stack.pop()!;
			if (!isLeaf(oldNode)) {
				for (const child of oldNode.children) {
					const childCopy = isLeaf(child)
						? { length: child.length, token: child.token, tokenQuality: child.tokenQuality, height: child.height }
						: new ListNode(child.height);

					(clonedNode as ListNode).appendChild(childCopy);
					stack.push([child, childCopy]);
				}
			}
		}

		return newRoot;
	}

	/**
	 * Returns a string representation of the token tree using an iterative approach
	 */
	printTree(root: Node = this._root): string {
		const result: string[] = [];
		const stack: Array<[Node, number]> = [[root, 0]];

		while (stack.length > 0) {
			const [node, depth] = stack.pop()!;
			const indent = '  '.repeat(depth);

			if (isLeaf(node)) {
				result.push(`${indent}Leaf(length: ${node.length}, token: ${node.token}, refresh: ${node.tokenQuality})\n`);
			} else {
				result.push(`${indent}List(length: ${node.length})\n`);
				// Push children in reverse order so they get processed left-to-right
				for (let i = node.children.length - 1; i >= 0; i--) {
					stack.push([node.children[i], depth + 1]);
				}
			}
		}

		return result.join('');
	}

	dispose(): void {
		const stack: Array<[Node, boolean]> = [[this._root, false]];
		while (stack.length > 0) {
			const [node, visited] = stack.pop()!;
			if (isLeaf(node)) {
				// leaf node does not need to be disposed
			} else if (!visited) {
				stack.push([node, true]);
				for (let i = node.children.length - 1; i >= 0; i--) {
					stack.push([node.children[i], false]);
				}
			} else {
				node.dispose();
				node.parent = undefined;
			}
		}
		this._root = undefined!;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/tokens/treeSitter/treeSitterSyntaxTokenBackend.ts]---
Location: vscode-main/src/vs/editor/common/model/tokens/treeSitter/treeSitterSyntaxTokenBackend.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { toDisposable } from '../../../../../base/common/lifecycle.js';
import { StandardTokenType } from '../../../encodedTokenAttributes.js';
import { ILanguageIdCodec } from '../../../languages.js';
import { IModelContentChangedEvent } from '../../../textModelEvents.js';
import { BackgroundTokenizationState } from '../../../tokenizationTextModelPart.js';
import { LineTokens } from '../../../tokens/lineTokens.js';
import { TextModel } from '../../textModel.js';
import { AbstractSyntaxTokenBackend } from '../abstractSyntaxTokenBackend.js';
import { autorun, derived, IObservable, ObservablePromise } from '../../../../../base/common/observable.js';
import { TreeSitterTree } from './treeSitterTree.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { TreeSitterTokenizationImpl } from './treeSitterTokenizationImpl.js';
import { ITreeSitterLibraryService } from '../../../services/treeSitter/treeSitterLibraryService.js';
import { LineRange } from '../../../core/ranges/lineRange.js';

export class TreeSitterSyntaxTokenBackend extends AbstractSyntaxTokenBackend {
	protected _backgroundTokenizationState: BackgroundTokenizationState = BackgroundTokenizationState.InProgress;
	protected readonly _onDidChangeBackgroundTokenizationState: Emitter<void> = this._register(new Emitter<void>());
	public readonly onDidChangeBackgroundTokenizationState: Event<void> = this._onDidChangeBackgroundTokenizationState.event;

	private readonly _tree: IObservable<TreeSitterTree | undefined>;
	private readonly _tokenizationImpl: IObservable<TreeSitterTokenizationImpl | undefined>;

	constructor(
		private readonly _languageIdObs: IObservable<string>,
		languageIdCodec: ILanguageIdCodec,
		textModel: TextModel,
		visibleLineRanges: IObservable<readonly LineRange[]>,
		@ITreeSitterLibraryService private readonly _treeSitterLibraryService: ITreeSitterLibraryService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		super(languageIdCodec, textModel);


		const parserClassPromise = new ObservablePromise(this._treeSitterLibraryService.getParserClass());


		const parserClassObs = derived(this, reader => {
			const parser = parserClassPromise.promiseResult?.read(reader)?.getDataOrThrow();
			return parser;
		});


		this._tree = derived(this, reader => {
			const parserClass = parserClassObs.read(reader);
			if (!parserClass) {
				return undefined;
			}

			const currentLanguage = this._languageIdObs.read(reader);
			const treeSitterLang = this._treeSitterLibraryService.getLanguage(currentLanguage, false, reader);
			if (!treeSitterLang) {
				return undefined;
			}

			const parser = new parserClass();
			reader.store.add(toDisposable(() => {
				parser.delete();
			}));
			parser.setLanguage(treeSitterLang);

			const queries = this._treeSitterLibraryService.getInjectionQueries(currentLanguage, reader);
			if (queries === undefined) {
				return undefined;
			}

			return reader.store.add(this._instantiationService.createInstance(TreeSitterTree, currentLanguage, undefined, parser, parserClass, /*queries, */this._textModel));
		});


		this._tokenizationImpl = derived(this, reader => {
			const treeModel = this._tree.read(reader);
			if (!treeModel) {
				return undefined;
			}

			const queries = this._treeSitterLibraryService.getHighlightingQueries(treeModel.languageId, reader);
			if (!queries) {
				return undefined;
			}

			return reader.store.add(this._instantiationService.createInstance(TreeSitterTokenizationImpl, treeModel, queries, this._languageIdCodec, visibleLineRanges));
		});

		this._register(autorun(reader => {
			const tokModel = this._tokenizationImpl.read(reader);
			if (!tokModel) {
				return;
			}
			reader.store.add(tokModel.onDidChangeTokens((e) => {
				this._onDidChangeTokens.fire(e.changes);
			}));
			reader.store.add(tokModel.onDidChangeBackgroundTokenization(e => {
				this._backgroundTokenizationState = BackgroundTokenizationState.Completed;
				this._onDidChangeBackgroundTokenizationState.fire();
			}));
		}));
	}

	get tree(): IObservable<TreeSitterTree | undefined> {
		return this._tree;
	}

	get tokenizationImpl(): IObservable<TreeSitterTokenizationImpl | undefined> {
		return this._tokenizationImpl;
	}

	public getLineTokens(lineNumber: number): LineTokens {
		const model = this._tokenizationImpl.get();
		if (!model) {
			const content = this._textModel.getLineContent(lineNumber);
			return LineTokens.createEmpty(content, this._languageIdCodec);
		}
		return model.getLineTokens(lineNumber);
	}

	public todo_resetTokenization(fireTokenChangeEvent: boolean = true): void {
		if (fireTokenChangeEvent) {
			this._onDidChangeTokens.fire({
				semanticTokensApplied: false,
				ranges: [
					{
						fromLineNumber: 1,
						toLineNumber: this._textModel.getLineCount(),
					},
				],
			});
		}
	}

	public override handleDidChangeAttached(): void {
		// TODO @alexr00 implement for background tokenization
	}

	public override handleDidChangeContent(e: IModelContentChangedEvent): void {
		if (e.isFlush) {
			// Don't fire the event, as the view might not have got the text change event yet
			this.todo_resetTokenization(false);
		} else {
			const model = this._tokenizationImpl.get();
			model?.handleContentChanged(e);
		}

		const treeModel = this._tree.get();
		treeModel?.handleContentChange(e);
	}

	public override forceTokenization(lineNumber: number): void {
		const model = this._tokenizationImpl.get();
		if (!model) {
			return;
		}
		if (!model.hasAccurateTokensForLine(lineNumber)) {
			model.tokenizeEncoded(lineNumber);
		}
	}

	public override hasAccurateTokensForLine(lineNumber: number): boolean {
		const model = this._tokenizationImpl.get();
		if (!model) {
			return false;
		}
		return model.hasAccurateTokensForLine(lineNumber);
	}

	public override isCheapToTokenize(lineNumber: number): boolean {
		// TODO @alexr00 determine what makes it cheap to tokenize?
		return true;
	}

	public override getTokenTypeIfInsertingCharacter(lineNumber: number, column: number, character: string): StandardTokenType {
		// TODO @alexr00 implement once we have custom parsing and don't just feed in the whole text model value
		return StandardTokenType.Other;
	}

	public override tokenizeLinesAt(lineNumber: number, lines: string[]): LineTokens[] | null {
		const model = this._tokenizationImpl.get();
		if (!model) {
			return null;
		}
		return model.tokenizeLinesAt(lineNumber, lines);
	}

	public override get hasTokens(): boolean {
		const model = this._tokenizationImpl.get();
		if (!model) {
			return false;
		}
		return model.hasTokens();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/tokens/treeSitter/treeSitterTokenizationImpl.ts]---
Location: vscode-main/src/vs/editor/common/model/tokens/treeSitter/treeSitterTokenizationImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { setTimeout0 } from '../../../../../base/common/platform.js';
import { StopWatch } from '../../../../../base/common/stopwatch.js';
import { LanguageId } from '../../../encodedTokenAttributes.js';
import { ILanguageIdCodec, QueryCapture } from '../../../languages.js';
import { IModelContentChangedEvent, IModelTokensChangedEvent } from '../../../textModelEvents.js';
import { findLikelyRelevantLines } from '../../textModelTokens.js';
import { TokenStore, TokenUpdate, TokenQuality } from './tokenStore.js';
import { TreeSitterTree, RangeChange, RangeWithOffsets } from './treeSitterTree.js';
import type * as TreeSitter from '@vscode/tree-sitter-wasm';
import { autorun, autorunHandleChanges, IObservable, recordChanges, runOnChange } from '../../../../../base/common/observable.js';
import { LineRange } from '../../../core/ranges/lineRange.js';
import { LineTokens } from '../../../tokens/lineTokens.js';
import { Position } from '../../../core/position.js';
import { Range } from '../../../core/range.js';
import { isDefined } from '../../../../../base/common/types.js';
import { ITreeSitterThemeService } from '../../../services/treeSitter/treeSitterThemeService.js';
import { BugIndicatingError } from '../../../../../base/common/errors.js';

export class TreeSitterTokenizationImpl extends Disposable {
	private readonly _tokenStore: TokenStore;
	private _accurateVersion: number;
	private _guessVersion: number;

	private readonly _onDidChangeTokens: Emitter<{ changes: IModelTokensChangedEvent }> = this._register(new Emitter());
	public readonly onDidChangeTokens: Event<{ changes: IModelTokensChangedEvent }> = this._onDidChangeTokens.event;
	private readonly _onDidCompleteBackgroundTokenization: Emitter<void> = this._register(new Emitter());
	public readonly onDidChangeBackgroundTokenization: Event<void> = this._onDidCompleteBackgroundTokenization.event;

	private _encodedLanguageId: LanguageId;

	private get _textModel() {
		return this._tree.textModel;
	}

	constructor(
		private readonly _tree: TreeSitterTree,
		private readonly _highlightingQueries: TreeSitter.Query,
		private readonly _languageIdCodec: ILanguageIdCodec,
		private readonly _visibleLineRanges: IObservable<readonly LineRange[]>,

		@ITreeSitterThemeService private readonly _treeSitterThemeService: ITreeSitterThemeService,
	) {
		super();

		this._encodedLanguageId = this._languageIdCodec.encodeLanguageId(this._tree.languageId);

		this._register(runOnChange(this._treeSitterThemeService.onChange, () => {
			this._updateTheme();
		}));

		this._tokenStore = this._register(new TokenStore(this._textModel));
		this._accurateVersion = this._textModel.getVersionId();
		this._guessVersion = this._textModel.getVersionId();
		this._tokenStore.buildStore(this._createEmptyTokens(), TokenQuality.None);

		this._register(autorun(reader => {
			const visibleLineRanges = this._visibleLineRanges.read(reader);
			this._parseAndTokenizeViewPort(visibleLineRanges);
		}));

		this._register(autorunHandleChanges({
			owner: this,
			changeTracker: recordChanges({ tree: this._tree.tree }),
		}, (reader, ctx) => {
			const changeEvent = ctx.changes.at(0)?.change;
			if (ctx.changes.length > 1) {
				throw new BugIndicatingError('The tree changed twice in one transaction. This is currently not supported and should not happen.');
			}

			if (!changeEvent) {
				if (ctx.tree) {
					this._firstTreeUpdate(this._tree.treeLastParsedVersion.read(reader));
				}
			} else {
				if (this.hasTokens()) {
					// Mark the range for refresh immediately

					for (const range of changeEvent.ranges) {
						this._markForRefresh(range.newRange);
					}
				}

				// First time we see a tree we need to build a token store.
				if (!this.hasTokens()) {
					this._firstTreeUpdate(changeEvent.versionId);
				} else {
					this._handleTreeUpdate(changeEvent.ranges, changeEvent.versionId);
				}
			}
		}));
	}

	public handleContentChanged(e: IModelContentChangedEvent): void {
		this._guessVersion = e.versionId;
		for (const change of e.changes) {
			if (change.text.length > change.rangeLength) {
				// If possible, use the token before the change as the starting point for the new token.
				// This is more likely to let the new text be the correct color as typeing is usually at the end of the token.
				const offset = change.rangeOffset > 0 ? change.rangeOffset - 1 : change.rangeOffset;
				const oldToken = this._tokenStore.getTokenAt(offset);
				let newToken: TokenUpdate;
				if (oldToken) {
					// Insert. Just grow the token at this position to include the insert.
					newToken = { startOffsetInclusive: oldToken.startOffsetInclusive, length: oldToken.length + change.text.length - change.rangeLength, token: oldToken.token };
					// Also mark tokens that are in the range of the change as needing a refresh.
					this._tokenStore.markForRefresh(offset, change.rangeOffset + (change.text.length > change.rangeLength ? change.text.length : change.rangeLength));
				} else {
					// The document got larger and the change is at the end of the document.
					newToken = { startOffsetInclusive: offset, length: change.text.length, token: 0 };
				}
				this._tokenStore.update(oldToken?.length ?? 0, [newToken], TokenQuality.EditGuess);
			} else if (change.text.length < change.rangeLength) {
				// Delete. Delete the tokens at the corresponding range.
				const deletedCharCount = change.rangeLength - change.text.length;
				this._tokenStore.delete(deletedCharCount, change.rangeOffset);
			}
		}
	}

	public getLineTokens(lineNumber: number) {
		const content = this._textModel.getLineContent(lineNumber);
		const rawTokens = this.getTokens(lineNumber);
		return new LineTokens(rawTokens, content, this._languageIdCodec);
	}

	private _createEmptyTokens() {
		const emptyToken = this._emptyToken();
		const modelEndOffset = this._textModel.getValueLength();

		const emptyTokens: TokenUpdate[] = [this._emptyTokensForOffsetAndLength(0, modelEndOffset, emptyToken)];
		return emptyTokens;
	}

	private _emptyToken() {
		return this._treeSitterThemeService.findMetadata([], this._encodedLanguageId, false, undefined);
	}

	private _emptyTokensForOffsetAndLength(offset: number, length: number, emptyToken: number): TokenUpdate {
		return { token: emptyToken, length: offset + length, startOffsetInclusive: 0 };
	}

	public hasAccurateTokensForLine(lineNumber: number): boolean {
		return this.hasTokens(new Range(lineNumber, 1, lineNumber, this._textModel.getLineMaxColumn(lineNumber)));
	}

	public tokenizeLinesAt(lineNumber: number, lines: string[]): LineTokens[] | null {
		const rawLineTokens = this._guessTokensForLinesContent(lineNumber, lines);
		const lineTokens: LineTokens[] = [];
		if (!rawLineTokens) {
			return null;
		}
		for (let i = 0; i < rawLineTokens.length; i++) {
			lineTokens.push(new LineTokens(rawLineTokens[i], lines[i], this._languageIdCodec));
		}
		return lineTokens;
	}

	private _rangeHasTokens(range: Range, minimumTokenQuality: TokenQuality): boolean {
		return this._tokenStore.rangeHasTokens(this._textModel.getOffsetAt(range.getStartPosition()), this._textModel.getOffsetAt(range.getEndPosition()), minimumTokenQuality);
	}

	public hasTokens(accurateForRange?: Range): boolean {
		if (!accurateForRange || (this._guessVersion === this._accurateVersion)) {
			return true;
		}

		return !this._tokenStore.rangeNeedsRefresh(this._textModel.getOffsetAt(accurateForRange.getStartPosition()), this._textModel.getOffsetAt(accurateForRange.getEndPosition()));
	}

	public getTokens(line: number): Uint32Array {
		const lineStartOffset = this._textModel.getOffsetAt({ lineNumber: line, column: 1 });
		const lineEndOffset = this._textModel.getOffsetAt({ lineNumber: line, column: this._textModel.getLineLength(line) + 1 });
		const lineTokens = this._tokenStore.getTokensInRange(lineStartOffset, lineEndOffset);
		const result = new Uint32Array(lineTokens.length * 2);
		for (let i = 0; i < lineTokens.length; i++) {
			result[i * 2] = lineTokens[i].startOffsetInclusive - lineStartOffset + lineTokens[i].length;
			result[i * 2 + 1] = lineTokens[i].token;
		}
		return result;
	}

	getTokensInRange(range: Range, rangeStartOffset: number, rangeEndOffset: number, captures?: QueryCapture[]): TokenUpdate[] | undefined {
		const tokens = captures ? this._tokenizeCapturesWithMetadata(captures, rangeStartOffset, rangeEndOffset) : this._tokenize(range, rangeStartOffset, rangeEndOffset);
		if (tokens?.endOffsetsAndMetadata) {
			return this._rangeTokensAsUpdates(rangeStartOffset, tokens.endOffsetsAndMetadata);
		}
		return undefined;
	}

	private _updateTokensInStore(version: number, updates: { oldRangeLength?: number; newTokens: TokenUpdate[] }[], tokenQuality: TokenQuality): void {
		this._accurateVersion = version;
		for (const update of updates) {
			const lastToken = update.newTokens.length > 0 ? update.newTokens[update.newTokens.length - 1] : undefined;
			let oldRangeLength: number;
			if (lastToken && (this._guessVersion >= version)) {
				oldRangeLength = lastToken.startOffsetInclusive + lastToken.length - update.newTokens[0].startOffsetInclusive;
			} else if (update.oldRangeLength) {
				oldRangeLength = update.oldRangeLength;
			} else {
				oldRangeLength = 0;
			}
			this._tokenStore.update(oldRangeLength, update.newTokens, tokenQuality);
		}
	}

	private _markForRefresh(range: Range): void {
		this._tokenStore.markForRefresh(this._textModel.getOffsetAt(range.getStartPosition()), this._textModel.getOffsetAt(range.getEndPosition()));
	}

	private _getNeedsRefresh(): { range: Range; startOffset: number; endOffset: number }[] {
		const needsRefreshOffsetRanges = this._tokenStore.getNeedsRefresh();
		if (!needsRefreshOffsetRanges) {
			return [];
		}
		return needsRefreshOffsetRanges.map(range => ({
			range: Range.fromPositions(this._textModel.getPositionAt(range.startOffset), this._textModel.getPositionAt(range.endOffset)),
			startOffset: range.startOffset,
			endOffset: range.endOffset
		}));
	}


	private _parseAndTokenizeViewPort(lineRanges: readonly LineRange[]) {
		const viewportRanges = lineRanges.map(r => r.toInclusiveRange()).filter(isDefined);
		for (const range of viewportRanges) {
			const startOffsetOfRangeInDocument = this._textModel.getOffsetAt(range.getStartPosition());
			const endOffsetOfRangeInDocument = this._textModel.getOffsetAt(range.getEndPosition());
			const version = this._textModel.getVersionId();
			if (this._rangeHasTokens(range, TokenQuality.ViewportGuess)) {
				continue;
			}
			const content = this._textModel.getValueInRange(range);
			const tokenUpdates = this._forceParseAndTokenizeContent(range, startOffsetOfRangeInDocument, endOffsetOfRangeInDocument, content, true);
			if (!tokenUpdates || this._rangeHasTokens(range, TokenQuality.ViewportGuess)) {
				continue;
			}
			if (tokenUpdates.length === 0) {
				continue;
			}
			const lastToken = tokenUpdates[tokenUpdates.length - 1];
			const oldRangeLength = lastToken.startOffsetInclusive + lastToken.length - tokenUpdates[0].startOffsetInclusive;
			this._updateTokensInStore(version, [{ newTokens: tokenUpdates, oldRangeLength }], TokenQuality.ViewportGuess);
			this._onDidChangeTokens.fire({ changes: { semanticTokensApplied: false, ranges: [{ fromLineNumber: range.startLineNumber, toLineNumber: range.endLineNumber }] } });
		}
	}

	private _guessTokensForLinesContent(lineNumber: number, lines: string[]): Uint32Array[] | undefined {
		if (lines.length === 0) {
			return undefined;
		}
		const lineContent = lines.join(this._textModel.getEOL());
		const range = new Range(1, 1, lineNumber + lines.length, lines[lines.length - 1].length + 1);
		const startOffset = this._textModel.getOffsetAt({ lineNumber, column: 1 });
		const tokens = this._forceParseAndTokenizeContent(range, startOffset, startOffset + lineContent.length, lineContent, false);
		if (!tokens) {
			return undefined;
		}
		const tokensByLine: Uint32Array[] = new Array(lines.length);
		let tokensIndex: number = 0;
		let tokenStartOffset = 0;
		let lineStartOffset = 0;
		for (let i = 0; i < lines.length; i++) {
			const tokensForLine: EndOffsetToken[] = [];
			let moveToNextLine = false;
			for (let j = tokensIndex; (!moveToNextLine && (j < tokens.length)); j++) {
				const token = tokens[j];
				const lineAdjustedEndOffset = token.endOffset - lineStartOffset;
				const lineAdjustedStartOffset = tokenStartOffset - lineStartOffset;
				if (lineAdjustedEndOffset <= lines[i].length) {
					tokensForLine.push({ endOffset: lineAdjustedEndOffset, metadata: token.metadata });
					tokensIndex++;
				} else if (lineAdjustedStartOffset < lines[i].length) {
					const partialToken: EndOffsetToken = { endOffset: lines[i].length, metadata: token.metadata };
					tokensForLine.push(partialToken);
					moveToNextLine = true;
				} else {
					moveToNextLine = true;
				}
				tokenStartOffset = token.endOffset;
			}

			tokensByLine[i] = this._endOffsetTokensToUint32Array(tokensForLine);
			lineStartOffset += lines[i].length + this._textModel.getEOL().length;
		}

		return tokensByLine;
	}

	private _forceParseAndTokenizeContent(range: Range, startOffsetOfRangeInDocument: number, endOffsetOfRangeInDocument: number, content: string, asUpdate: true): TokenUpdate[] | undefined;
	private _forceParseAndTokenizeContent(range: Range, startOffsetOfRangeInDocument: number, endOffsetOfRangeInDocument: number, content: string, asUpdate: false): EndOffsetToken[] | undefined;
	private _forceParseAndTokenizeContent(range: Range, startOffsetOfRangeInDocument: number, endOffsetOfRangeInDocument: number, content: string, asUpdate: boolean): EndOffsetToken[] | TokenUpdate[] | undefined {
		const likelyRelevantLines = findLikelyRelevantLines(this._textModel, range.startLineNumber).likelyRelevantLines;
		const likelyRelevantPrefix = likelyRelevantLines.join(this._textModel.getEOL());

		const tree = this._tree.createParsedTreeSync(`${likelyRelevantPrefix}${content}`);
		if (!tree) {
			return;
		}

		const treeRange = new Range(1, 1, range.endLineNumber - range.startLineNumber + 1 + likelyRelevantLines.length, range.endColumn);
		const captures = this.captureAtRange(treeRange);
		const tokens = this._tokenizeCapturesWithMetadata(captures, likelyRelevantPrefix.length, endOffsetOfRangeInDocument - startOffsetOfRangeInDocument + likelyRelevantPrefix.length);
		tree.delete();

		if (!tokens) {
			return;
		}

		if (asUpdate) {
			return this._rangeTokensAsUpdates(startOffsetOfRangeInDocument, tokens.endOffsetsAndMetadata, likelyRelevantPrefix.length);
		} else {
			return tokens.endOffsetsAndMetadata;
		}
	}


	private _firstTreeUpdate(versionId: number) {
		return this._setViewPortTokens(versionId);
	}

	private _setViewPortTokens(versionId: number) {
		const rangeChanges = this._visibleLineRanges.get().map<RangeChange | undefined>(lineRange => {
			const range = lineRange.toInclusiveRange();
			if (!range) { return undefined; }
			const newRangeStartOffset = this._textModel.getOffsetAt(range.getStartPosition());
			const newRangeEndOffset = this._textModel.getOffsetAt(range.getEndPosition());
			return {
				newRange: range,
				newRangeEndOffset,
				newRangeStartOffset,
			};
		}).filter(isDefined);

		return this._handleTreeUpdate(rangeChanges, versionId);
	}

	/**
	 * Do not await in this method, it will cause a race
	 */
	private _handleTreeUpdate(ranges: RangeChange[], versionId: number) {
		const rangeChanges: RangeWithOffsets[] = [];
		const chunkSize = 1000;

		for (let i = 0; i < ranges.length; i++) {
			const rangeLinesLength = ranges[i].newRange.endLineNumber - ranges[i].newRange.startLineNumber;
			if (rangeLinesLength > chunkSize) {
				// Split the range into chunks to avoid long operations
				const fullRangeEndLineNumber = ranges[i].newRange.endLineNumber;
				let chunkLineStart = ranges[i].newRange.startLineNumber;
				let chunkColumnStart = ranges[i].newRange.startColumn;
				let chunkLineEnd = chunkLineStart + chunkSize;
				do {
					const chunkStartingPosition = new Position(chunkLineStart, chunkColumnStart);
					const chunkEndColumn = ((chunkLineEnd === ranges[i].newRange.endLineNumber) ? ranges[i].newRange.endColumn : this._textModel.getLineMaxColumn(chunkLineEnd));
					const chunkEndPosition = new Position(chunkLineEnd, chunkEndColumn);
					const chunkRange = Range.fromPositions(chunkStartingPosition, chunkEndPosition);

					rangeChanges.push({
						range: chunkRange,
						startOffset: this._textModel.getOffsetAt(chunkRange.getStartPosition()),
						endOffset: this._textModel.getOffsetAt(chunkRange.getEndPosition())
					});

					chunkLineStart = chunkLineEnd + 1;
					chunkColumnStart = 1;
					if (chunkLineEnd < fullRangeEndLineNumber && chunkLineEnd + chunkSize > fullRangeEndLineNumber) {
						chunkLineEnd = fullRangeEndLineNumber;
					} else {
						chunkLineEnd = chunkLineEnd + chunkSize;
					}
				} while (chunkLineEnd <= fullRangeEndLineNumber);
			} else {
				// Check that the previous range doesn't overlap
				if ((i === 0) || (rangeChanges[i - 1].endOffset < ranges[i].newRangeStartOffset)) {
					rangeChanges.push({
						range: ranges[i].newRange,
						startOffset: ranges[i].newRangeStartOffset,
						endOffset: ranges[i].newRangeEndOffset
					});
				} else if (rangeChanges[i - 1].endOffset < ranges[i].newRangeEndOffset) {
					// clip the range to the previous range
					const startPosition = this._textModel.getPositionAt(rangeChanges[i - 1].endOffset + 1);
					const range = new Range(startPosition.lineNumber, startPosition.column, ranges[i].newRange.endLineNumber, ranges[i].newRange.endColumn);
					rangeChanges.push({
						range,
						startOffset: rangeChanges[i - 1].endOffset + 1,
						endOffset: ranges[i].newRangeEndOffset
					});
				}
			}
		}

		// Get the captures immediately while the text model is correct
		const captures = rangeChanges.map(range => this._getCaptures(range.range));
		// Don't block
		return this._updateTreeForRanges(rangeChanges, versionId, captures).then(() => {
			if (!this._textModel.isDisposed() && (this._tree.treeLastParsedVersion.get() === this._textModel.getVersionId())) {
				this._refreshNeedsRefresh(versionId);
			}
		});
	}

	private async _updateTreeForRanges(rangeChanges: RangeWithOffsets[], versionId: number, captures: QueryCapture[][]) {
		let tokenUpdate: { newTokens: TokenUpdate[] } | undefined;

		for (let i = 0; i < rangeChanges.length; i++) {
			if (!this._textModel.isDisposed() && versionId !== this._textModel.getVersionId()) {
				// Our captures have become invalid and we need to re-capture
				break;
			}
			const capture = captures[i];
			const range = rangeChanges[i];

			const updates = this.getTokensInRange(range.range, range.startOffset, range.endOffset, capture);
			if (updates) {
				tokenUpdate = { newTokens: updates };
			} else {
				tokenUpdate = { newTokens: [] };
			}
			this._updateTokensInStore(versionId, [tokenUpdate], TokenQuality.Accurate);
			this._onDidChangeTokens.fire({
				changes: {
					semanticTokensApplied: false,
					ranges: [{ fromLineNumber: range.range.getStartPosition().lineNumber, toLineNumber: range.range.getEndPosition().lineNumber }]
				}
			});
			await new Promise<void>(resolve => setTimeout0(resolve));
		}
		this._onDidCompleteBackgroundTokenization.fire();
	}

	private _refreshNeedsRefresh(versionId: number) {
		const rangesToRefresh = this._getNeedsRefresh();
		if (rangesToRefresh.length === 0) {
			return;
		}
		const rangeChanges: RangeChange[] = new Array(rangesToRefresh.length);

		for (let i = 0; i < rangesToRefresh.length; i++) {
			const range = rangesToRefresh[i];
			rangeChanges[i] = {
				newRange: range.range,
				newRangeStartOffset: range.startOffset,
				newRangeEndOffset: range.endOffset
			};
		}

		this._handleTreeUpdate(rangeChanges, versionId);
	}

	private _rangeTokensAsUpdates(rangeOffset: number, endOffsetToken: EndOffsetToken[], startingOffsetInArray?: number) {
		const updates: TokenUpdate[] = [];
		let lastEnd = 0;
		for (const token of endOffsetToken) {
			if (token.endOffset <= lastEnd || (startingOffsetInArray && (token.endOffset < startingOffsetInArray))) {
				continue;
			}
			let tokenUpdate: TokenUpdate;
			if (startingOffsetInArray && (lastEnd < startingOffsetInArray)) {
				tokenUpdate = { startOffsetInclusive: rangeOffset + startingOffsetInArray, length: token.endOffset - startingOffsetInArray, token: token.metadata };
			} else {
				tokenUpdate = { startOffsetInclusive: rangeOffset + lastEnd, length: token.endOffset - lastEnd, token: token.metadata };
			}
			updates.push(tokenUpdate);
			lastEnd = token.endOffset;
		}
		return updates;
	}

	private _updateTheme() {
		const modelRange = this._textModel.getFullModelRange();
		this._markForRefresh(modelRange);
		this._parseAndTokenizeViewPort(this._visibleLineRanges.get());
	}

	// Was used for inspect editor tokens command
	captureAtPosition(lineNumber: number, column: number): QueryCapture[] {
		const captures = this.captureAtRangeWithInjections(new Range(lineNumber, column, lineNumber, column + 1));
		return captures;
	}

	// Was used for the colorization tests
	captureAtRangeTree(range: Range): QueryCapture[] {
		const captures = this.captureAtRangeWithInjections(range);
		return captures;
	}

	private captureAtRange(range: Range): QueryCapture[] {
		const tree = this._tree.tree.get();
		if (!tree) {
			return [];
		}
		// Tree sitter row is 0 based, column is 0 based
		return this._highlightingQueries.captures(tree.rootNode, { startPosition: { row: range.startLineNumber - 1, column: range.startColumn - 1 }, endPosition: { row: range.endLineNumber - 1, column: range.endColumn - 1 } }).map(capture => (
			{
				name: capture.name,
				text: capture.node.text,
				node: {
					startIndex: capture.node.startIndex,
					endIndex: capture.node.endIndex,
					startPosition: {
						lineNumber: capture.node.startPosition.row + 1,
						column: capture.node.startPosition.column + 1
					},
					endPosition: {
						lineNumber: capture.node.endPosition.row + 1,
						column: capture.node.endPosition.column + 1
					}
				},
				encodedLanguageId: this._encodedLanguageId
			}
		));
	}

	private captureAtRangeWithInjections(range: Range): QueryCapture[] {
		const captures: QueryCapture[] = this.captureAtRange(range);
		for (let i = 0; i < captures.length; i++) {
			const capture = captures[i];

			const capStartLine = capture.node.startPosition.lineNumber;
			const capEndLine = capture.node.endPosition.lineNumber;
			const capStartColumn = capture.node.startPosition.column;
			const capEndColumn = capture.node.endPosition.column;

			const startLine = ((capStartLine > range.startLineNumber) && (capStartLine < range.endLineNumber)) ? capStartLine : range.startLineNumber;
			const endLine = ((capEndLine > range.startLineNumber) && (capEndLine < range.endLineNumber)) ? capEndLine : range.endLineNumber;
			const startColumn = (capStartLine === range.startLineNumber) ? (capStartColumn < range.startColumn ? range.startColumn : capStartColumn) : (capStartLine < range.startLineNumber ? range.startColumn : capStartColumn);
			const endColumn = (capEndLine === range.endLineNumber) ? (capEndColumn > range.endColumn ? range.endColumn : capEndColumn) : (capEndLine > range.endLineNumber ? range.endColumn : capEndColumn);
			const injectionRange = new Range(startLine, startColumn, endLine, endColumn);

			const injection = this._getInjectionCaptures(capture, injectionRange);
			if (injection && injection.length > 0) {
				captures.splice(i + 1, 0, ...injection);
				i += injection.length;
			}
		}
		return captures;
	}

	/**
	 * Gets the tokens for a given line.
	 * Each token takes 2 elements in the array. The first element is the offset of the end of the token *in the line, not in the document*, and the second element is the metadata.
	 *
	 * @param lineNumber
	 * @returns
	 */
	public tokenizeEncoded(lineNumber: number) {
		const tokens = this._tokenizeEncoded(lineNumber);
		if (!tokens) {
			return undefined;
		}
		const updates = this._rangeTokensAsUpdates(this._textModel.getOffsetAt({ lineNumber, column: 1 }), tokens.result);
		if (tokens.versionId === this._textModel.getVersionId()) {
			this._updateTokensInStore(tokens.versionId, [{ newTokens: updates, oldRangeLength: this._textModel.getLineLength(lineNumber) }], TokenQuality.Accurate);
		}
	}

	public tokenizeEncodedInstrumented(lineNumber: number): { result: Uint32Array; captureTime: number; metadataTime: number } | undefined {
		const tokens = this._tokenizeEncoded(lineNumber);
		if (!tokens) {
			return undefined;
		}
		return { result: this._endOffsetTokensToUint32Array(tokens.result), captureTime: tokens.captureTime, metadataTime: tokens.metadataTime };
	}

	private _getCaptures(range: Range): QueryCapture[] {
		const captures = this.captureAtRangeWithInjections(range);
		return captures;
	}

	private _tokenize(range: Range, rangeStartOffset: number, rangeEndOffset: number): { endOffsetsAndMetadata: { endOffset: number; metadata: number }[]; versionId: number; captureTime: number; metadataTime: number } | undefined {
		const captures = this._getCaptures(range);
		const result = this._tokenizeCapturesWithMetadata(captures, rangeStartOffset, rangeEndOffset);
		if (!result) {
			return undefined;
		}
		return { ...result, versionId: this._tree.treeLastParsedVersion.get() };
	}

	private _createTokensFromCaptures(captures: QueryCapture[], rangeStartOffset: number, rangeEndOffset: number): { endOffsets: EndOffsetAndScopes[]; captureTime: number } | undefined {
		const tree = this._tree.tree.get();
		const stopwatch = StopWatch.create();
		const rangeLength = rangeEndOffset - rangeStartOffset;
		const encodedLanguageId = this._languageIdCodec.encodeLanguageId(this._tree.languageId);
		const baseScope: string = TREESITTER_BASE_SCOPES[this._tree.languageId] || 'source';

		if (captures.length === 0) {
			if (tree) {
				stopwatch.stop();
				const endOffsetsAndMetadata = [{ endOffset: rangeLength, scopes: [], encodedLanguageId }];
				return { endOffsets: endOffsetsAndMetadata, captureTime: stopwatch.elapsed() };
			}
			return undefined;
		}

		const endOffsetsAndScopes: EndOffsetAndScopes[] = Array(captures.length);
		endOffsetsAndScopes.fill({ endOffset: 0, scopes: [baseScope], encodedLanguageId });
		let tokenIndex = 0;

		const increaseSizeOfTokensByOneToken = () => {
			endOffsetsAndScopes.push({ endOffset: 0, scopes: [baseScope], encodedLanguageId });
		};

		const brackets = (capture: QueryCapture, startOffset: number): number[] | undefined => {
			return (capture.name.includes('punctuation') && capture.text) ? Array.from(capture.text.matchAll(BRACKETS)).map(match => startOffset + match.index) : undefined;
		};

		const addCurrentTokenToArray = (capture: QueryCapture, startOffset: number, endOffset: number, position?: number) => {
			if (position !== undefined) {
				const oldScopes = endOffsetsAndScopes[position].scopes;
				let oldBracket = endOffsetsAndScopes[position].bracket;
				// Check that the previous token ends at the same point that the current token starts
				const prevEndOffset = position > 0 ? endOffsetsAndScopes[position - 1].endOffset : 0;
				if (prevEndOffset !== startOffset) {
					let preInsertBracket: number[] | undefined = undefined;
					if (oldBracket && oldBracket.length > 0) {
						preInsertBracket = [];
						const postInsertBracket: number[] = [];
						for (let i = 0; i < oldBracket.length; i++) {
							const bracket = oldBracket[i];
							if (bracket < startOffset) {
								preInsertBracket.push(bracket);
							} else if (bracket > endOffset) {
								postInsertBracket.push(bracket);
							}
						}
						if (preInsertBracket.length === 0) {
							preInsertBracket = undefined;
						}
						if (postInsertBracket.length === 0) {
							oldBracket = undefined;
						} else {
							oldBracket = postInsertBracket;
						}
					}
					// We need to add some of the position token to cover the space
					endOffsetsAndScopes.splice(position, 0, { endOffset: startOffset, scopes: [...oldScopes], bracket: preInsertBracket, encodedLanguageId: capture.encodedLanguageId });
					position++;
					increaseSizeOfTokensByOneToken();
					tokenIndex++;
				}

				endOffsetsAndScopes.splice(position, 0, { endOffset: endOffset, scopes: [...oldScopes, capture.name], bracket: brackets(capture, startOffset), encodedLanguageId: capture.encodedLanguageId });
				endOffsetsAndScopes[tokenIndex].bracket = oldBracket;
			} else {
				endOffsetsAndScopes[tokenIndex] = { endOffset: endOffset, scopes: [baseScope, capture.name], bracket: brackets(capture, startOffset), encodedLanguageId: capture.encodedLanguageId };
			}
			tokenIndex++;
		};

		for (let captureIndex = 0; captureIndex < captures.length; captureIndex++) {
			const capture = captures[captureIndex];
			const tokenEndIndex = capture.node.endIndex < rangeEndOffset ? ((capture.node.endIndex < rangeStartOffset) ? rangeStartOffset : capture.node.endIndex) : rangeEndOffset;
			const tokenStartIndex = capture.node.startIndex < rangeStartOffset ? rangeStartOffset : capture.node.startIndex;

			const endOffset = tokenEndIndex - rangeStartOffset;

			// Not every character will get captured, so we need to make sure that our current capture doesn't bleed toward the start of the line and cover characters that it doesn't apply to.
			// We do this by creating a new token in the array if the previous token ends before the current token starts.
			let previousEndOffset: number;
			const currentTokenLength = tokenEndIndex - tokenStartIndex;
			if (captureIndex > 0) {
				previousEndOffset = endOffsetsAndScopes[(tokenIndex - 1)].endOffset;
			} else {
				previousEndOffset = tokenStartIndex - rangeStartOffset - 1;
			}
			const startOffset = endOffset - currentTokenLength;
			if ((previousEndOffset >= 0) && (previousEndOffset < startOffset)) {
				// Add en empty token to cover the space where there were no captures
				endOffsetsAndScopes[tokenIndex] = { endOffset: startOffset, scopes: [baseScope], encodedLanguageId: this._encodedLanguageId };
				tokenIndex++;

				increaseSizeOfTokensByOneToken();
			}

			if (currentTokenLength < 0) {
				// This happens when we have a token "gap" right at the end of the capture range. The last capture isn't used because it's start index isn't included in the range.
				continue;
			}

			if (previousEndOffset >= endOffset) {
				// walk back through the tokens until we find the one that contains the current token
				let withinTokenIndex = tokenIndex - 1;
				let previousTokenEndOffset = endOffsetsAndScopes[withinTokenIndex].endOffset;

				let previousTokenStartOffset = ((withinTokenIndex >= 2) ? endOffsetsAndScopes[withinTokenIndex - 1].endOffset : 0);
				do {

					// Check that the current token doesn't just replace the last token
					if ((previousTokenStartOffset + currentTokenLength) === previousTokenEndOffset) {
						if (previousTokenStartOffset === startOffset) {
							// Current token and previous token span the exact same characters, add the scopes to the previous token
							endOffsetsAndScopes[withinTokenIndex].scopes.push(capture.name);
							const oldBracket = endOffsetsAndScopes[withinTokenIndex].bracket;
							endOffsetsAndScopes[withinTokenIndex].bracket = ((oldBracket && (oldBracket.length > 0)) ? oldBracket : brackets(capture, startOffset));
						}
					} else if (previousTokenStartOffset <= startOffset) {
						addCurrentTokenToArray(capture, startOffset, endOffset, withinTokenIndex);
						break;
					}
					withinTokenIndex--;
					previousTokenStartOffset = ((withinTokenIndex >= 1) ? endOffsetsAndScopes[withinTokenIndex - 1].endOffset : 0);
					previousTokenEndOffset = ((withinTokenIndex >= 0) ? endOffsetsAndScopes[withinTokenIndex].endOffset : 0);
				} while (previousTokenEndOffset > startOffset);
			} else {
				// Just add the token to the array
				addCurrentTokenToArray(capture, startOffset, endOffset);
			}
		}

		// Account for uncaptured characters at the end of the line
		if ((endOffsetsAndScopes[tokenIndex - 1].endOffset < rangeLength)) {
			if (rangeLength - endOffsetsAndScopes[tokenIndex - 1].endOffset > 0) {
				increaseSizeOfTokensByOneToken();
				endOffsetsAndScopes[tokenIndex] = { endOffset: rangeLength, scopes: endOffsetsAndScopes[tokenIndex].scopes, encodedLanguageId: this._encodedLanguageId };
				tokenIndex++;
			}
		}
		for (let i = 0; i < endOffsetsAndScopes.length; i++) {
			const token = endOffsetsAndScopes[i];
			if (token.endOffset === 0 && i !== 0) {
				endOffsetsAndScopes.splice(i, endOffsetsAndScopes.length - i);
				break;
			}
		}
		const captureTime = stopwatch.elapsed();
		return { endOffsets: endOffsetsAndScopes as { endOffset: number; scopes: string[]; encodedLanguageId: LanguageId }[], captureTime };
	}

	private _getInjectionCaptures(parentCapture: QueryCapture, range: Range): QueryCapture[] {
		/*
				const injection = textModelTreeSitter.getInjection(parentCapture.node.startIndex, this._treeSitterModel.languageId);
				if (!injection?.tree || injection.versionId !== textModelTreeSitter.parseResult?.versionId) {
					return undefined;
				}

				const feature = TreeSitterTokenizationRegistry.get(injection.languageId);
				if (!feature) {
					return undefined;
				}
				return feature.tokSupport_captureAtRangeTree(range, injection.tree, textModelTreeSitter);*/
		return [];
	}

	private _tokenizeCapturesWithMetadata(captures: QueryCapture[], rangeStartOffset: number, rangeEndOffset: number): { endOffsetsAndMetadata: EndOffsetToken[]; captureTime: number; metadataTime: number } | undefined {
		const stopwatch = StopWatch.create();
		const emptyTokens = this._createTokensFromCaptures(captures, rangeStartOffset, rangeEndOffset);
		if (!emptyTokens) {
			return undefined;
		}
		const endOffsetsAndScopes: EndOffsetWithMeta[] = emptyTokens.endOffsets;
		for (let i = 0; i < endOffsetsAndScopes.length; i++) {
			const token = endOffsetsAndScopes[i];
			token.metadata = this._treeSitterThemeService.findMetadata(token.scopes, token.encodedLanguageId, !!token.bracket && (token.bracket.length > 0), undefined);
		}

		const metadataTime = stopwatch.elapsed();
		return { endOffsetsAndMetadata: endOffsetsAndScopes as { endOffset: number; scopes: string[]; metadata: number }[], captureTime: emptyTokens.captureTime, metadataTime };
	}

	private _tokenizeEncoded(lineNumber: number): { result: EndOffsetToken[]; captureTime: number; metadataTime: number; versionId: number } | undefined {
		const lineOffset = this._textModel.getOffsetAt({ lineNumber: lineNumber, column: 1 });
		const maxLine = this._textModel.getLineCount();
		const lineEndOffset = (lineNumber + 1 <= maxLine) ? this._textModel.getOffsetAt({ lineNumber: lineNumber + 1, column: 1 }) : this._textModel.getValueLength();
		const lineLength = lineEndOffset - lineOffset;

		const result = this._tokenize(new Range(lineNumber, 1, lineNumber, lineLength + 1), lineOffset, lineEndOffset);
		if (!result) {
			return undefined;
		}
		return { result: result.endOffsetsAndMetadata, captureTime: result.captureTime, metadataTime: result.metadataTime, versionId: result.versionId };
	}

	private _endOffsetTokensToUint32Array(endOffsetsAndMetadata: EndOffsetToken[]): Uint32Array {

		const uint32Array = new Uint32Array(endOffsetsAndMetadata.length * 2);
		for (let i = 0; i < endOffsetsAndMetadata.length; i++) {
			uint32Array[i * 2] = endOffsetsAndMetadata[i].endOffset;
			uint32Array[i * 2 + 1] = endOffsetsAndMetadata[i].metadata;
		}
		return uint32Array;
	}
}


interface EndOffsetToken {
	endOffset: number;
	metadata: number;
}

interface EndOffsetAndScopes {
	endOffset: number;
	scopes: string[];
	bracket?: number[];
	encodedLanguageId: LanguageId;
}

interface EndOffsetWithMeta extends EndOffsetAndScopes {
	metadata?: number;
}
export const TREESITTER_BASE_SCOPES: Record<string, string> = {
	'css': 'source.css',
	'typescript': 'source.ts',
	'ini': 'source.ini',
	'regex': 'source.regex',
};

const BRACKETS = /[\{\}\[\]\<\>\(\)]/g;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/tokens/treeSitter/treeSitterTree.ts]---
Location: vscode-main/src/vs/editor/common/model/tokens/treeSitter/treeSitterTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import type * as TreeSitter from '@vscode/tree-sitter-wasm';
import { TaskQueue } from '../../../../../base/common/async.js';
import { Disposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { IObservable, observableValue, transaction, IObservableWithChange } from '../../../../../base/common/observable.js';
import { setTimeout0 } from '../../../../../base/common/platform.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { TextLength } from '../../../core/text/textLength.js';
import { IModelContentChangedEvent } from '../../../textModelEvents.js';
import { IModelContentChange } from '../../mirrorTextModel.js';
import { TextModel } from '../../textModel.js';
import { gotoParent, getClosestPreviousNodes, nextSiblingOrParentSibling, gotoNthChild } from './cursorUtils.js';
import { Range } from '../../../core/range.js';

export class TreeSitterTree extends Disposable {

	private readonly _tree = observableValue<TreeSitter.Tree | undefined, TreeParseUpdateEvent>(this, undefined);
	public readonly tree: IObservableWithChange<TreeSitter.Tree | undefined, TreeParseUpdateEvent> = this._tree;

	private readonly _treeLastParsedVersion = observableValue(this, -1);
	public readonly treeLastParsedVersion: IObservable<number> = this._treeLastParsedVersion;

	private _lastFullyParsed: TreeSitter.Tree | undefined;
	private _lastFullyParsedWithEdits: TreeSitter.Tree | undefined;

	private _onDidChangeContentQueue: TaskQueue = new TaskQueue();

	constructor(
		public readonly languageId: string,
		private _ranges: TreeSitter.Range[] | undefined,
		// readonly treeSitterLanguage: Language,
		/** Must have the language set! */
		private readonly _parser: TreeSitter.Parser,
		private readonly _parserClass: typeof TreeSitter.Parser,
		// private readonly _injectionQuery: TreeSitter.Query,
		public readonly textModel: TextModel,
		@ILogService private readonly _logService: ILogService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService
	) {
		super();

		this._tree = observableValue(this, undefined);
		this.tree = this._tree;

		this._register(toDisposable(() => {
			this._tree.get()?.delete();
			this._lastFullyParsed?.delete();
			this._lastFullyParsedWithEdits?.delete();
			this._parser.delete();
		}));
		this.handleContentChange(undefined, this._ranges);
	}

	public handleContentChange(e: IModelContentChangedEvent | undefined, ranges?: TreeSitter.Range[]): void {
		const version = this.textModel.getVersionId();
		let newRanges: TreeSitter.Range[] = [];
		if (ranges) {
			newRanges = this._setRanges(ranges);
		}
		if (e) {
			this._applyEdits(e.changes);
		}

		this._onDidChangeContentQueue.clearPending();
		this._onDidChangeContentQueue.schedule(async () => {
			if (this._store.isDisposed) {
				// No need to continue the queue if we are disposed
				return;
			}

			const oldTree = this._lastFullyParsed;
			let changedNodes: TreeSitter.Range[] | undefined;
			if (this._lastFullyParsedWithEdits && this._lastFullyParsed) {
				changedNodes = this._findChangedNodes(this._lastFullyParsedWithEdits, this._lastFullyParsed);
			}

			const completed = await this._parseAndUpdateTree(version);
			if (completed) {
				let ranges: RangeChange[] | undefined;
				if (!changedNodes) {
					if (this._ranges) {
						ranges = this._ranges.map(r => ({ newRange: new Range(r.startPosition.row + 1, r.startPosition.column + 1, r.endPosition.row + 1, r.endPosition.column + 1), oldRangeLength: r.endIndex - r.startIndex, newRangeStartOffset: r.startIndex, newRangeEndOffset: r.endIndex }));
					}
				} else if (oldTree && changedNodes) {
					ranges = this._findTreeChanges(completed, changedNodes, newRanges);
				}
				if (!ranges) {
					ranges = [{ newRange: this.textModel.getFullModelRange(), newRangeStartOffset: 0, newRangeEndOffset: this.textModel.getValueLength() }];
				}

				const previousTree = this._tree.get();
				transaction(tx => {
					this._tree.set(completed, tx, { ranges, versionId: version });
					this._treeLastParsedVersion.set(version, tx);
				});
				previousTree?.delete();
			}
		});
	}

	get ranges(): TreeSitter.Range[] | undefined {
		return this._ranges;
	}

	public getInjectionTrees(startIndex: number, languageId: string): TreeSitterTree | undefined {
		// TODO
		return undefined;
	}

	private _applyEdits(changes: IModelContentChange[]) {
		for (const change of changes) {
			const originalTextLength = TextLength.ofRange(Range.lift(change.range));
			const newTextLength = TextLength.ofText(change.text);
			const summedTextLengths = change.text.length === 0 ? newTextLength : originalTextLength.add(newTextLength);
			const edit = {
				startIndex: change.rangeOffset,
				oldEndIndex: change.rangeOffset + change.rangeLength,
				newEndIndex: change.rangeOffset + change.text.length,
				startPosition: { row: change.range.startLineNumber - 1, column: change.range.startColumn - 1 },
				oldEndPosition: { row: change.range.endLineNumber - 1, column: change.range.endColumn - 1 },
				newEndPosition: { row: change.range.startLineNumber + summedTextLengths.lineCount - 1, column: summedTextLengths.lineCount ? summedTextLengths.columnCount : (change.range.endColumn + summedTextLengths.columnCount) }
			};
			this._tree.get()?.edit(edit);
			this._lastFullyParsedWithEdits?.edit(edit);
		}
	}

	private _findChangedNodes(newTree: TreeSitter.Tree, oldTree: TreeSitter.Tree): TreeSitter.Range[] | undefined {
		if ((this._ranges && this._ranges.every(range => range.startPosition.row !== newTree.rootNode.startPosition.row)) || newTree.rootNode.startPosition.row !== 0) {
			return [];
		}
		const newCursor = newTree.walk();
		const oldCursor = oldTree.walk();

		const nodes: TreeSitter.Range[] = [];
		let next = true;

		do {
			if (newCursor.currentNode.hasChanges) {
				// Check if only one of the children has changes.
				// If it's only one, then we go to that child.
				// If it's more then, we need to go to each child
				// If it's none, then we've found one of our ranges
				const newChildren = newCursor.currentNode.children;
				const indexChangedChildren: number[] = [];
				const changedChildren = newChildren.filter((c, index) => {
					if (c?.hasChanges || (oldCursor.currentNode.children.length <= index)) {
						indexChangedChildren.push(index);
						return true;
					}
					return false;
				});
				// If we have changes and we *had* an error, the whole node should be refreshed.
				if ((changedChildren.length === 0) || (newCursor.currentNode.hasError !== oldCursor.currentNode.hasError)) {
					// walk up again until we get to the first one that's named as unnamed nodes can be too granular
					while (newCursor.currentNode.parent && next && !newCursor.currentNode.isNamed) {
						next = gotoParent(newCursor, oldCursor);
					}
					// Use the end position of the previous node and the start position of the current node
					const newNode = newCursor.currentNode;
					const closestPreviousNode = getClosestPreviousNodes(newCursor, newTree) ?? newNode;
					nodes.push({
						startIndex: closestPreviousNode.startIndex,
						endIndex: newNode.endIndex,
						startPosition: closestPreviousNode.startPosition,
						endPosition: newNode.endPosition
					});
					next = nextSiblingOrParentSibling(newCursor, oldCursor);
				} else if (changedChildren.length >= 1) {
					next = gotoNthChild(newCursor, oldCursor, indexChangedChildren[0]);
				}
			} else {
				next = nextSiblingOrParentSibling(newCursor, oldCursor);
			}
		} while (next);

		newCursor.delete();
		oldCursor.delete();
		return nodes;
	}

	private _findTreeChanges(newTree: TreeSitter.Tree, changedNodes: TreeSitter.Range[], newRanges: TreeSitter.Range[]): RangeChange[] {
		let newRangeIndex = 0;
		const mergedChanges: RangeChange[] = [];

		// Find the parent in the new tree of the changed node
		for (let nodeIndex = 0; nodeIndex < changedNodes.length; nodeIndex++) {
			const node = changedNodes[nodeIndex];

			if (mergedChanges.length > 0) {
				if ((node.startIndex >= mergedChanges[mergedChanges.length - 1].newRangeStartOffset) && (node.endIndex <= mergedChanges[mergedChanges.length - 1].newRangeEndOffset)) {
					// This node is within the previous range, skip it
					continue;
				}
			}

			const cursor = newTree.walk();
			const cursorContainersNode = () => cursor.startIndex < node.startIndex && cursor.endIndex > node.endIndex;

			while (cursorContainersNode()) {
				// See if we can go to a child
				let child = cursor.gotoFirstChild();
				let foundChild = false;
				while (child) {
					if (cursorContainersNode() && cursor.currentNode.isNamed) {
						foundChild = true;
						break;
					} else {
						child = cursor.gotoNextSibling();
					}
				}
				if (!foundChild) {
					cursor.gotoParent();
					break;
				}
				if (cursor.currentNode.childCount === 0) {
					break;
				}
			}

			const startPosition = cursor.currentNode.startPosition;
			const endPosition = cursor.currentNode.endPosition;
			const startIndex = cursor.currentNode.startIndex;
			const endIndex = cursor.currentNode.endIndex;

			const newChange = { newRange: new Range(startPosition.row + 1, startPosition.column + 1, endPosition.row + 1, endPosition.column + 1), newRangeStartOffset: startIndex, newRangeEndOffset: endIndex };
			if ((newRangeIndex < newRanges.length) && rangesIntersect(newRanges[newRangeIndex], { startIndex, endIndex, startPosition, endPosition })) {
				// combine the new change with the range
				if (newRanges[newRangeIndex].startIndex < newChange.newRangeStartOffset) {
					newChange.newRange = newChange.newRange.setStartPosition(newRanges[newRangeIndex].startPosition.row + 1, newRanges[newRangeIndex].startPosition.column + 1);
					newChange.newRangeStartOffset = newRanges[newRangeIndex].startIndex;
				}
				if (newRanges[newRangeIndex].endIndex > newChange.newRangeEndOffset) {
					newChange.newRange = newChange.newRange.setEndPosition(newRanges[newRangeIndex].endPosition.row + 1, newRanges[newRangeIndex].endPosition.column + 1);
					newChange.newRangeEndOffset = newRanges[newRangeIndex].endIndex;
				}
				newRangeIndex++;
			} else if (newRangeIndex < newRanges.length && newRanges[newRangeIndex].endIndex < newChange.newRangeStartOffset) {
				// add the full range to the merged changes
				mergedChanges.push({
					newRange: new Range(newRanges[newRangeIndex].startPosition.row + 1, newRanges[newRangeIndex].startPosition.column + 1, newRanges[newRangeIndex].endPosition.row + 1, newRanges[newRangeIndex].endPosition.column + 1),
					newRangeStartOffset: newRanges[newRangeIndex].startIndex,
					newRangeEndOffset: newRanges[newRangeIndex].endIndex
				});
			}

			if ((mergedChanges.length > 0) && (mergedChanges[mergedChanges.length - 1].newRangeEndOffset >= newChange.newRangeStartOffset)) {
				// Merge the changes
				mergedChanges[mergedChanges.length - 1].newRange = Range.fromPositions(mergedChanges[mergedChanges.length - 1].newRange.getStartPosition(), newChange.newRange.getEndPosition());
				mergedChanges[mergedChanges.length - 1].newRangeEndOffset = newChange.newRangeEndOffset;
			} else {
				mergedChanges.push(newChange);
			}
		}
		return this._constrainRanges(mergedChanges);
	}

	private _constrainRanges(changes: RangeChange[]): RangeChange[] {
		if (!this._ranges) {
			return changes;
		}

		const constrainedChanges: RangeChange[] = [];
		let changesIndex = 0;
		let rangesIndex = 0;
		while (changesIndex < changes.length && rangesIndex < this._ranges.length) {
			const change = changes[changesIndex];
			const range = this._ranges[rangesIndex];
			if (change.newRangeEndOffset < range.startIndex) {
				// Change is before the range, move to the next change
				changesIndex++;
			} else if (change.newRangeStartOffset > range.endIndex) {
				// Change is after the range, move to the next range
				rangesIndex++;
			} else {
				// Change is within the range, constrain it
				const newRangeStartOffset = Math.max(change.newRangeStartOffset, range.startIndex);
				const newRangeEndOffset = Math.min(change.newRangeEndOffset, range.endIndex);
				const newRange = change.newRange.intersectRanges(new Range(range.startPosition.row + 1, range.startPosition.column + 1, range.endPosition.row + 1, range.endPosition.column + 1))!;
				constrainedChanges.push({
					newRange,
					newRangeEndOffset,
					newRangeStartOffset
				});
				// Remove the intersected range from the current change
				if (newRangeEndOffset < change.newRangeEndOffset) {
					change.newRange = Range.fromPositions(newRange.getEndPosition(), change.newRange.getEndPosition());
					change.newRangeStartOffset = newRangeEndOffset + 1;
				} else {
					// Move to the next change
					changesIndex++;
				}
			}
		}

		return constrainedChanges;
	}

	private async _parseAndUpdateTree(version: number): Promise<TreeSitter.Tree | undefined> {
		const tree = await this._parse();
		if (tree) {
			this._lastFullyParsed?.delete();
			this._lastFullyParsed = tree.copy();
			this._lastFullyParsedWithEdits?.delete();
			this._lastFullyParsedWithEdits = tree.copy();

			return tree;
		} else if (!this._tree.get()) {
			// No tree means this is the initial parse and there were edits
			// parse function doesn't handle this well and we can end up with an incorrect tree, so we reset
			this._parser.reset();
		}
		return undefined;
	}

	private _parse(): Promise<TreeSitter.Tree | undefined> {
		let parseType: TelemetryParseType = TelemetryParseType.Full;
		if (this._tree.get()) {
			parseType = TelemetryParseType.Incremental;
		}
		return this._parseAndYield(parseType);
	}

	private async _parseAndYield(parseType: TelemetryParseType): Promise<TreeSitter.Tree | undefined> {
		let time: number = 0;
		let passes: number = 0;
		const inProgressVersion = this.textModel.getVersionId();
		let newTree: TreeSitter.Tree | null | undefined;

		const progressCallback = newTimeOutProgressCallback();

		do {
			const timer = performance.now();

			newTree = this._parser.parse((index: number, position?: TreeSitter.Point) => this._parseCallback(index), this._tree.get(), { progressCallback, includedRanges: this._ranges });

			time += performance.now() - timer;
			passes++;

			// So long as this isn't the initial parse, even if the model changes and edits are applied, the tree parsing will continue correctly after the await.
			await new Promise<void>(resolve => setTimeout0(resolve));

		} while (!this._store.isDisposed && !newTree && inProgressVersion === this.textModel.getVersionId());
		this._sendParseTimeTelemetry(parseType, time, passes);
		return (newTree && (inProgressVersion === this.textModel.getVersionId())) ? newTree : undefined;
	}

	private _parseCallback(index: number): string | undefined {
		try {
			return this.textModel.getTextBuffer().getNearestChunk(index);
		} catch (e) {
			this._logService.debug('Error getting chunk for tree-sitter parsing', e);
		}
		return undefined;
	}

	private _setRanges(newRanges: TreeSitter.Range[]): TreeSitter.Range[] {
		const unKnownRanges: TreeSitter.Range[] = [];
		// If we have existing ranges, find the parts of the new ranges that are not included in the existing ones
		if (this._ranges) {
			for (const newRange of newRanges) {
				let isFullyIncluded = false;

				for (let i = 0; i < this._ranges.length; i++) {
					const existingRange = this._ranges[i];

					if (rangesEqual(existingRange, newRange) || rangesIntersect(existingRange, newRange)) {
						isFullyIncluded = true;
						break;
					}
				}

				if (!isFullyIncluded) {
					unKnownRanges.push(newRange);
				}
			}
		} else {
			// No existing ranges, all new ranges are unknown
			unKnownRanges.push(...newRanges);
		}

		this._ranges = newRanges;
		return unKnownRanges;
	}

	private _sendParseTimeTelemetry(parseType: TelemetryParseType, time: number, passes: number): void {
		this._logService.debug(`Tree parsing (${parseType}) took ${time} ms and ${passes} passes.`);
		type ParseTimeClassification = {
			owner: 'alexr00';
			comment: 'Used to understand how long it takes to parse a tree-sitter tree';
			languageId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The programming language ID.' };
			time: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The ms it took to parse' };
			passes: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of passes it took to parse' };
		};
		if (parseType === TelemetryParseType.Full) {
			this._telemetryService.publicLog2<{ languageId: string; time: number; passes: number }, ParseTimeClassification>(`treeSitter.fullParse`, { languageId: this.languageId, time, passes });
		} else {
			this._telemetryService.publicLog2<{ languageId: string; time: number; passes: number }, ParseTimeClassification>(`treeSitter.incrementalParse`, { languageId: this.languageId, time, passes });
		}
	}

	public createParsedTreeSync(src: string): TreeSitter.Tree | undefined {
		const parser = new this._parserClass();
		parser.setLanguage(this._parser.language);
		const tree = parser.parse(src);
		parser.delete();
		return tree ?? undefined;
	}
}

const enum TelemetryParseType {
	Full = 'fullParse',
	Incremental = 'incrementalParse'
}

export interface TreeParseUpdateEvent {
	ranges: RangeChange[];
	versionId: number;
}

export interface RangeWithOffsets {
	range: Range;
	startOffset: number;
	endOffset: number;
}

export interface RangeChange {
	newRange: Range;
	newRangeStartOffset: number;
	newRangeEndOffset: number;
}

function newTimeOutProgressCallback(): (state: TreeSitter.ParseState) => void {
	let lastYieldTime: number = performance.now();
	return function parseProgressCallback(_state: TreeSitter.ParseState) {
		const now = performance.now();
		if (now - lastYieldTime > 50) {
			lastYieldTime = now;
			return true;
		}
		return false;
	};
}
export function rangesEqual(a: TreeSitter.Range, b: TreeSitter.Range) {
	return (a.startPosition.row === b.startPosition.row)
		&& (a.startPosition.column === b.startPosition.column)
		&& (a.endPosition.row === b.endPosition.row)
		&& (a.endPosition.column === b.endPosition.column)
		&& (a.startIndex === b.startIndex)
		&& (a.endIndex === b.endIndex);
}

export function rangesIntersect(a: TreeSitter.Range, b: TreeSitter.Range) {
	return (a.startIndex <= b.startIndex && a.endIndex >= b.startIndex) ||
		(b.startIndex <= a.startIndex && b.endIndex >= a.startIndex);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/editorBaseApi.ts]---
Location: vscode-main/src/vs/editor/common/services/editorBaseApi.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import { Emitter } from '../../../base/common/event.js';
import { KeyChord, KeyMod as ConstKeyMod } from '../../../base/common/keyCodes.js';
import { URI } from '../../../base/common/uri.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { Selection } from '../core/selection.js';
import { Token } from '../languages.js';
import * as standaloneEnums from '../standalone/standaloneEnums.js';

export class KeyMod {
	public static readonly CtrlCmd: number = ConstKeyMod.CtrlCmd;
	public static readonly Shift: number = ConstKeyMod.Shift;
	public static readonly Alt: number = ConstKeyMod.Alt;
	public static readonly WinCtrl: number = ConstKeyMod.WinCtrl;

	public static chord(firstPart: number, secondPart: number): number {
		return KeyChord(firstPart, secondPart);
	}
}

export function createMonacoBaseAPI(): typeof monaco {
	return {
		editor: undefined!, // undefined override expected here
		languages: undefined!, // undefined override expected here
		CancellationTokenSource: CancellationTokenSource,
		Emitter: Emitter,
		KeyCode: standaloneEnums.KeyCode,
		KeyMod: KeyMod,
		Position: Position,
		Range: Range,
		Selection: Selection as unknown as typeof monaco.Selection,
		SelectionDirection: standaloneEnums.SelectionDirection,
		MarkerSeverity: standaloneEnums.MarkerSeverity,
		MarkerTag: standaloneEnums.MarkerTag,
		Uri: URI as unknown as typeof monaco.Uri,
		Token: Token
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/editorWebWorker.ts]---
Location: vscode-main/src/vs/editor/common/services/editorWebWorker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { stringDiff } from '../../../base/common/diff/diff.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { IWebWorkerServerRequestHandler } from '../../../base/common/worker/webWorker.js';
import { Position } from '../core/position.js';
import { IRange, Range } from '../core/range.js';
import { EndOfLineSequence, ITextModel } from '../model.js';
import { IMirrorTextModel, IModelChangedEvent } from '../model/mirrorTextModel.js';
import { IColorInformation, IInplaceReplaceSupportResult, ILink, TextEdit } from '../languages.js';
import { computeLinks } from '../languages/linkComputer.js';
import { BasicInplaceReplace } from '../languages/supports/inplaceReplaceSupport.js';
import { DiffAlgorithmName, IDiffComputationResult, ILineChange, IUnicodeHighlightsResult } from './editorWorker.js';
import { createMonacoBaseAPI } from './editorBaseApi.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
import { UnicodeTextModelHighlighter, UnicodeHighlighterOptions } from './unicodeTextModelHighlighter.js';
import { DiffComputer, IChange } from '../diff/legacyLinesDiffComputer.js';
import { ILinesDiffComputer, ILinesDiffComputerOptions } from '../diff/linesDiffComputer.js';
import { DetailedLineRangeMapping } from '../diff/rangeMapping.js';
import { linesDiffComputers } from '../diff/linesDiffComputers.js';
import { IDocumentDiffProviderOptions } from '../diff/documentDiffProvider.js';
import { BugIndicatingError } from '../../../base/common/errors.js';
import { computeDefaultDocumentColors } from '../languages/defaultDocumentColorsComputer.js';
import { FindSectionHeaderOptions, SectionHeader, findSectionHeaders } from './findSectionHeaders.js';
import { IRawModelData, IWorkerTextModelSyncChannelServer } from './textModelSync/textModelSync.protocol.js';
import { ICommonModel, WorkerTextModelSyncServer } from './textModelSync/textModelSync.impl.js';
import { ISerializedStringEdit, StringEdit } from '../core/edits/stringEdit.js';
import { StringText } from '../core/text/abstractText.js';
import { ensureDependenciesAreSet } from '../core/text/positionToOffset.js';

export interface IMirrorModel extends IMirrorTextModel {
	readonly uri: URI;
	readonly version: number;
	getValue(): string;
}

export interface IWorkerContext<H = {}> {
	/**
	 * A proxy to the main thread host object.
	 */
	host: H;
	/**
	 * Get all available mirror models in this worker.
	 */
	getMirrorModels(): IMirrorModel[];
}

/**
 * Range of a word inside a model.
 * @internal
 */
export interface IWordRange {
	/**
	 * The index where the word starts.
	 */
	readonly start: number;
	/**
	 * The index where the word ends.
	 */
	readonly end: number;
}

/**
 * @internal
 */
export class EditorWorker implements IDisposable, IWorkerTextModelSyncChannelServer, IWebWorkerServerRequestHandler {
	_requestHandlerBrand: void = undefined;

	private readonly _workerTextModelSyncServer = new WorkerTextModelSyncServer();

	constructor(
		private readonly _foreignModule: unknown | null = null
	) { }

	dispose(): void {
	}

	public async $ping() {
		return 'pong';
	}

	protected _getModel(uri: string): ICommonModel | undefined {
		return this._workerTextModelSyncServer.getModel(uri);
	}

	public getModels(): ICommonModel[] {
		return this._workerTextModelSyncServer.getModels();
	}

	public $acceptNewModel(data: IRawModelData): void {
		this._workerTextModelSyncServer.$acceptNewModel(data);
	}

	public $acceptModelChanged(uri: string, e: IModelChangedEvent): void {
		this._workerTextModelSyncServer.$acceptModelChanged(uri, e);
	}

	public $acceptRemovedModel(uri: string): void {
		this._workerTextModelSyncServer.$acceptRemovedModel(uri);
	}

	public async $computeUnicodeHighlights(url: string, options: UnicodeHighlighterOptions, range?: IRange): Promise<IUnicodeHighlightsResult> {
		const model = this._getModel(url);
		if (!model) {
			return { ranges: [], hasMore: false, ambiguousCharacterCount: 0, invisibleCharacterCount: 0, nonBasicAsciiCharacterCount: 0 };
		}
		return UnicodeTextModelHighlighter.computeUnicodeHighlights(model, options, range);
	}

	public async $findSectionHeaders(url: string, options: FindSectionHeaderOptions): Promise<SectionHeader[]> {
		const model = this._getModel(url);
		if (!model) {
			return [];
		}
		return findSectionHeaders(model, options);
	}

	// ---- BEGIN diff --------------------------------------------------------------------------

	public async $computeDiff(originalUrl: string, modifiedUrl: string, options: IDocumentDiffProviderOptions, algorithm: DiffAlgorithmName): Promise<IDiffComputationResult | null> {
		const original = this._getModel(originalUrl);
		const modified = this._getModel(modifiedUrl);
		if (!original || !modified) {
			return null;
		}

		const result = EditorWorker.computeDiff(original, modified, options, algorithm);
		return result;
	}

	private static computeDiff(originalTextModel: ICommonModel | ITextModel, modifiedTextModel: ICommonModel | ITextModel, options: IDocumentDiffProviderOptions, algorithm: DiffAlgorithmName): IDiffComputationResult {
		const diffAlgorithm: ILinesDiffComputer = algorithm === 'advanced' ? linesDiffComputers.getDefault() : linesDiffComputers.getLegacy();

		const originalLines = originalTextModel.getLinesContent();
		const modifiedLines = modifiedTextModel.getLinesContent();

		const result = diffAlgorithm.computeDiff(originalLines, modifiedLines, options);

		const identical = (result.changes.length > 0 ? false : this._modelsAreIdentical(originalTextModel, modifiedTextModel));

		function getLineChanges(changes: readonly DetailedLineRangeMapping[]): ILineChange[] {
			return changes.map(m => ([m.original.startLineNumber, m.original.endLineNumberExclusive, m.modified.startLineNumber, m.modified.endLineNumberExclusive, m.innerChanges?.map(m => [
				m.originalRange.startLineNumber,
				m.originalRange.startColumn,
				m.originalRange.endLineNumber,
				m.originalRange.endColumn,
				m.modifiedRange.startLineNumber,
				m.modifiedRange.startColumn,
				m.modifiedRange.endLineNumber,
				m.modifiedRange.endColumn,
			])]));
		}

		return {
			identical,
			quitEarly: result.hitTimeout,
			changes: getLineChanges(result.changes),
			moves: result.moves.map(m => ([
				m.lineRangeMapping.original.startLineNumber,
				m.lineRangeMapping.original.endLineNumberExclusive,
				m.lineRangeMapping.modified.startLineNumber,
				m.lineRangeMapping.modified.endLineNumberExclusive,
				getLineChanges(m.changes)
			])),
		};
	}

	private static _modelsAreIdentical(original: ICommonModel | ITextModel, modified: ICommonModel | ITextModel): boolean {
		const originalLineCount = original.getLineCount();
		const modifiedLineCount = modified.getLineCount();
		if (originalLineCount !== modifiedLineCount) {
			return false;
		}
		for (let line = 1; line <= originalLineCount; line++) {
			const originalLine = original.getLineContent(line);
			const modifiedLine = modified.getLineContent(line);
			if (originalLine !== modifiedLine) {
				return false;
			}
		}
		return true;
	}

	public async $computeDirtyDiff(originalUrl: string, modifiedUrl: string, ignoreTrimWhitespace: boolean): Promise<IChange[] | null> {
		const original = this._getModel(originalUrl);
		const modified = this._getModel(modifiedUrl);
		if (!original || !modified) {
			return null;
		}

		const originalLines = original.getLinesContent();
		const modifiedLines = modified.getLinesContent();
		const diffComputer = new DiffComputer(originalLines, modifiedLines, {
			shouldComputeCharChanges: false,
			shouldPostProcessCharChanges: false,
			shouldIgnoreTrimWhitespace: ignoreTrimWhitespace,
			shouldMakePrettyDiff: true,
			maxComputationTime: 1000
		});
		return diffComputer.computeDiff().changes;
	}

	public $computeStringDiff(original: string, modified: string, options: { maxComputationTimeMs: number }, algorithm: DiffAlgorithmName): ISerializedStringEdit {
		return computeStringDiff(original, modified, options, algorithm).toJson();
	}

	// ---- END diff --------------------------------------------------------------------------


	// ---- BEGIN minimal edits ---------------------------------------------------------------

	private static readonly _diffLimit = 100000;

	public async $computeMoreMinimalEdits(modelUrl: string, edits: TextEdit[], pretty: boolean): Promise<TextEdit[]> {
		const model = this._getModel(modelUrl);
		if (!model) {
			return edits;
		}

		const result: TextEdit[] = [];
		let lastEol: EndOfLineSequence | undefined = undefined;

		edits = edits.slice(0).sort((a, b) => {
			if (a.range && b.range) {
				return Range.compareRangesUsingStarts(a.range, b.range);
			}
			// eol only changes should go to the end
			const aRng = a.range ? 0 : 1;
			const bRng = b.range ? 0 : 1;
			return aRng - bRng;
		});

		// merge adjacent edits
		let writeIndex = 0;
		for (let readIndex = 1; readIndex < edits.length; readIndex++) {
			if (Range.getEndPosition(edits[writeIndex].range).equals(Range.getStartPosition(edits[readIndex].range))) {
				edits[writeIndex].range = Range.fromPositions(Range.getStartPosition(edits[writeIndex].range), Range.getEndPosition(edits[readIndex].range));
				edits[writeIndex].text += edits[readIndex].text;
			} else {
				writeIndex++;
				edits[writeIndex] = edits[readIndex];
			}
		}
		edits.length = writeIndex + 1;

		for (let { range, text, eol } of edits) {

			if (typeof eol === 'number') {
				lastEol = eol;
			}

			if (Range.isEmpty(range) && !text) {
				// empty change
				continue;
			}

			const original = model.getValueInRange(range);
			text = text.replace(/\r\n|\n|\r/g, model.eol);

			if (original === text) {
				// noop
				continue;
			}

			// make sure diff won't take too long
			if (Math.max(text.length, original.length) > EditorWorker._diffLimit) {
				result.push({ range, text });
				continue;
			}

			// compute diff between original and edit.text
			const changes = stringDiff(original, text, pretty);
			const editOffset = model.offsetAt(Range.lift(range).getStartPosition());

			for (const change of changes) {
				const start = model.positionAt(editOffset + change.originalStart);
				const end = model.positionAt(editOffset + change.originalStart + change.originalLength);
				const newEdit: TextEdit = {
					text: text.substr(change.modifiedStart, change.modifiedLength),
					range: { startLineNumber: start.lineNumber, startColumn: start.column, endLineNumber: end.lineNumber, endColumn: end.column }
				};

				if (model.getValueInRange(newEdit.range) !== newEdit.text) {
					result.push(newEdit);
				}
			}
		}

		if (typeof lastEol === 'number') {
			result.push({ eol: lastEol, text: '', range: { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 } });
		}

		return result;
	}

	public $computeHumanReadableDiff(modelUrl: string, edits: TextEdit[], options: ILinesDiffComputerOptions): TextEdit[] {
		const model = this._getModel(modelUrl);
		if (!model) {
			return edits;
		}

		const result: TextEdit[] = [];
		let lastEol: EndOfLineSequence | undefined = undefined;

		edits = edits.slice(0).sort((a, b) => {
			if (a.range && b.range) {
				return Range.compareRangesUsingStarts(a.range, b.range);
			}
			// eol only changes should go to the end
			const aRng = a.range ? 0 : 1;
			const bRng = b.range ? 0 : 1;
			return aRng - bRng;
		});

		for (let { range, text, eol } of edits) {

			if (typeof eol === 'number') {
				lastEol = eol;
			}

			if (Range.isEmpty(range) && !text) {
				// empty change
				continue;
			}

			const original = model.getValueInRange(range);
			text = text.replace(/\r\n|\n|\r/g, model.eol);

			if (original === text) {
				// noop
				continue;
			}

			// make sure diff won't take too long
			if (Math.max(text.length, original.length) > EditorWorker._diffLimit) {
				result.push({ range, text });
				continue;
			}

			// compute diff between original and edit.text

			const originalLines = original.split(/\r\n|\n|\r/);
			const modifiedLines = text.split(/\r\n|\n|\r/);

			const diff = linesDiffComputers.getDefault().computeDiff(originalLines, modifiedLines, options);

			const start = Range.lift(range).getStartPosition();

			function addPositions(pos1: Position, pos2: Position): Position {
				return new Position(pos1.lineNumber + pos2.lineNumber - 1, pos2.lineNumber === 1 ? pos1.column + pos2.column - 1 : pos2.column);
			}

			function getText(lines: string[], range: Range): string[] {
				const result: string[] = [];
				for (let i = range.startLineNumber; i <= range.endLineNumber; i++) {
					const line = lines[i - 1];
					if (i === range.startLineNumber && i === range.endLineNumber) {
						result.push(line.substring(range.startColumn - 1, range.endColumn - 1));
					} else if (i === range.startLineNumber) {
						result.push(line.substring(range.startColumn - 1));
					} else if (i === range.endLineNumber) {
						result.push(line.substring(0, range.endColumn - 1));
					} else {
						result.push(line);
					}
				}
				return result;
			}

			for (const c of diff.changes) {
				if (c.innerChanges) {
					for (const x of c.innerChanges) {
						result.push({
							range: Range.fromPositions(
								addPositions(start, x.originalRange.getStartPosition()),
								addPositions(start, x.originalRange.getEndPosition())
							),
							text: getText(modifiedLines, x.modifiedRange).join(model.eol)
						});
					}
				} else {
					throw new BugIndicatingError('The experimental diff algorithm always produces inner changes');
				}
			}
		}

		if (typeof lastEol === 'number') {
			result.push({ eol: lastEol, text: '', range: { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 } });
		}

		return result;
	}

	// ---- END minimal edits ---------------------------------------------------------------

	public async $computeLinks(modelUrl: string): Promise<ILink[] | null> {
		const model = this._getModel(modelUrl);
		if (!model) {
			return null;
		}

		return computeLinks(model);
	}

	// --- BEGIN default document colors -----------------------------------------------------------

	public async $computeDefaultDocumentColors(modelUrl: string): Promise<IColorInformation[] | null> {
		const model = this._getModel(modelUrl);
		if (!model) {
			return null;
		}
		return computeDefaultDocumentColors(model);
	}

	// ---- BEGIN suggest --------------------------------------------------------------------------

	private static readonly _suggestionsLimit = 10000;

	public async $textualSuggest(modelUrls: string[], leadingWord: string | undefined, wordDef: string, wordDefFlags: string): Promise<{ words: string[]; duration: number } | null> {

		const sw = new StopWatch();
		const wordDefRegExp = new RegExp(wordDef, wordDefFlags);
		const seen = new Set<string>();

		outer: for (const url of modelUrls) {
			const model = this._getModel(url);
			if (!model) {
				continue;
			}

			for (const word of model.words(wordDefRegExp)) {
				if (word === leadingWord || !isNaN(Number(word))) {
					continue;
				}
				seen.add(word);
				if (seen.size > EditorWorker._suggestionsLimit) {
					break outer;
				}
			}
		}

		return { words: Array.from(seen), duration: sw.elapsed() };
	}


	// ---- END suggest --------------------------------------------------------------------------

	//#region -- word ranges --

	public async $computeWordRanges(modelUrl: string, range: IRange, wordDef: string, wordDefFlags: string): Promise<{ [word: string]: IRange[] }> {
		const model = this._getModel(modelUrl);
		if (!model) {
			return Object.create(null);
		}
		const wordDefRegExp = new RegExp(wordDef, wordDefFlags);
		const result: { [word: string]: IRange[] } = Object.create(null);
		for (let line = range.startLineNumber; line < range.endLineNumber; line++) {
			const words = model.getLineWords(line, wordDefRegExp);
			for (const word of words) {
				if (!isNaN(Number(word.word))) {
					continue;
				}
				let array = result[word.word];
				if (!array) {
					array = [];
					result[word.word] = array;
				}
				array.push({
					startLineNumber: line,
					startColumn: word.startColumn,
					endLineNumber: line,
					endColumn: word.endColumn
				});
			}
		}
		return result;
	}

	//#endregion

	public async $navigateValueSet(modelUrl: string, range: IRange, up: boolean, wordDef: string, wordDefFlags: string): Promise<IInplaceReplaceSupportResult | null> {
		const model = this._getModel(modelUrl);
		if (!model) {
			return null;
		}

		const wordDefRegExp = new RegExp(wordDef, wordDefFlags);

		if (range.startColumn === range.endColumn) {
			range = {
				startLineNumber: range.startLineNumber,
				startColumn: range.startColumn,
				endLineNumber: range.endLineNumber,
				endColumn: range.endColumn + 1
			};
		}

		const selectionText = model.getValueInRange(range);

		const wordRange = model.getWordAtPosition({ lineNumber: range.startLineNumber, column: range.startColumn }, wordDefRegExp);
		if (!wordRange) {
			return null;
		}
		const word = model.getValueInRange(wordRange);
		const result = BasicInplaceReplace.INSTANCE.navigateValueSet(range, selectionText, wordRange, word, up);
		return result;
	}

	// ---- BEGIN foreign module support --------------------------------------------------------------------------

	// foreign method request
	public $fmr(method: string, args: unknown[]): Promise<unknown> {
		if (!this._foreignModule || typeof (this._foreignModule as Record<string, unknown>)[method] !== 'function') {
			return Promise.reject(new Error('Missing requestHandler or method: ' + method));
		}

		try {
			return Promise.resolve((this._foreignModule as Record<string, Function>)[method].apply(this._foreignModule, args));
		} catch (e) {
			return Promise.reject(e);
		}
	}

	// ---- END foreign module support --------------------------------------------------------------------------
}

// This is only available in a Web Worker
declare function importScripts(...urls: string[]): void;

if (typeof importScripts === 'function') {
	// Running in a web worker
	globalThis.monaco = createMonacoBaseAPI();
}

/**
 * @internal
*/
export function computeStringDiff(original: string, modified: string, options: { maxComputationTimeMs: number }, algorithm: DiffAlgorithmName): StringEdit {
	const diffAlgorithm: ILinesDiffComputer = algorithm === 'advanced' ? linesDiffComputers.getDefault() : linesDiffComputers.getLegacy();

	ensureDependenciesAreSet();

	const originalText = new StringText(original);
	const originalLines = originalText.getLines();
	const modifiedText = new StringText(modified);
	const modifiedLines = modifiedText.getLines();

	const result = diffAlgorithm.computeDiff(originalLines, modifiedLines, { ignoreTrimWhitespace: false, maxComputationTimeMs: options.maxComputationTimeMs, computeMoves: false, extendToSubwords: false });

	const textEdit = DetailedLineRangeMapping.toTextEdit(result.changes, modifiedText);
	const strEdit = originalText.getTransformer().getStringEdit(textEdit);

	return strEdit;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/editorWebWorkerMain.ts]---
Location: vscode-main/src/vs/editor/common/services/editorWebWorkerMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { bootstrapWebWorker } from '../../../base/common/worker/webWorkerBootstrap.js';
import { EditorWorker } from './editorWebWorker.js';

bootstrapWebWorker(() => new EditorWorker(null));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/editorWorker.ts]---
Location: vscode-main/src/vs/editor/common/services/editorWorker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { IRange } from '../core/range.js';
import { IDocumentDiff, IDocumentDiffProviderOptions } from '../diff/documentDiffProvider.js';
import { IChange } from '../diff/legacyLinesDiffComputer.js';
import { IColorInformation, IInplaceReplaceSupportResult, TextEdit } from '../languages.js';
import { UnicodeHighlighterOptions } from './unicodeTextModelHighlighter.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import type { EditorWorker } from './editorWebWorker.js';
import { SectionHeader, FindSectionHeaderOptions } from './findSectionHeaders.js';
import { StringEdit } from '../core/edits/stringEdit.js';

export const IEditorWorkerService = createDecorator<IEditorWorkerService>('editorWorkerService');

export type DiffAlgorithmName = 'legacy' | 'advanced';

export interface IEditorWorkerService {
	readonly _serviceBrand: undefined;

	canComputeUnicodeHighlights(uri: URI): boolean;
	computedUnicodeHighlights(uri: URI, options: UnicodeHighlighterOptions, range?: IRange): Promise<IUnicodeHighlightsResult>;

	/** Implementation in {@link EditorWorker.computeDiff} */
	computeDiff(original: URI, modified: URI, options: IDocumentDiffProviderOptions, algorithm: DiffAlgorithmName): Promise<IDocumentDiff | null>;

	canComputeDirtyDiff(original: URI, modified: URI): boolean;
	computeDirtyDiff(original: URI, modified: URI, ignoreTrimWhitespace: boolean): Promise<IChange[] | null>;

	computeMoreMinimalEdits(resource: URI, edits: TextEdit[] | null | undefined, pretty?: boolean): Promise<TextEdit[] | undefined>;
	computeHumanReadableDiff(resource: URI, edits: TextEdit[] | null | undefined): Promise<TextEdit[] | undefined>;

	computeStringEditFromDiff(original: string, modified: string, options: { maxComputationTimeMs: number }, algorithm: DiffAlgorithmName): Promise<StringEdit>;

	canComputeWordRanges(resource: URI): boolean;
	computeWordRanges(resource: URI, range: IRange): Promise<{ [word: string]: IRange[] } | null>;

	canNavigateValueSet(resource: URI): boolean;
	navigateValueSet(resource: URI, range: IRange, up: boolean): Promise<IInplaceReplaceSupportResult | null>;

	findSectionHeaders(uri: URI, options: FindSectionHeaderOptions): Promise<SectionHeader[]>;

	computeDefaultDocumentColors(uri: URI): Promise<IColorInformation[] | null>;

}

export interface IDiffComputationResult {
	quitEarly: boolean;
	changes: ILineChange[];
	identical: boolean;
	moves: ITextMove[];
}

export type ILineChange = [
	originalStartLine: number,
	originalEndLine: number,
	modifiedStartLine: number,
	modifiedEndLine: number,
	charChanges: ICharChange[] | undefined,
];

export type ICharChange = [
	originalStartLine: number,
	originalStartColumn: number,
	originalEndLine: number,
	originalEndColumn: number,

	modifiedStartLine: number,
	modifiedStartColumn: number,
	modifiedEndLine: number,
	modifiedEndColumn: number,
];

export type ITextMove = [
	originalStartLine: number,
	originalEndLine: number,
	modifiedStartLine: number,
	modifiedEndLine: number,
	changes: ILineChange[],
];

export interface IUnicodeHighlightsResult {
	ranges: IRange[];
	hasMore: boolean;
	nonBasicAsciiCharacterCount: number;
	invisibleCharacterCount: number;
	ambiguousCharacterCount: number;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/editorWorkerHost.ts]---
Location: vscode-main/src/vs/editor/common/services/editorWorkerHost.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWebWorkerServer, IWebWorkerClient } from '../../../base/common/worker/webWorker.js';

export abstract class EditorWorkerHost {
	public static CHANNEL_NAME = 'editorWorkerHost';
	public static getChannel(workerServer: IWebWorkerServer): EditorWorkerHost {
		return workerServer.getChannel<EditorWorkerHost>(EditorWorkerHost.CHANNEL_NAME);
	}
	public static setChannel(workerClient: IWebWorkerClient<unknown>, obj: EditorWorkerHost): void {
		workerClient.setChannel<EditorWorkerHost>(EditorWorkerHost.CHANNEL_NAME, obj);
	}

	// foreign host request
	abstract $fhr(method: string, args: unknown[]): Promise<unknown>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/findSectionHeaders.ts]---
Location: vscode-main/src/vs/editor/common/services/findSectionHeaders.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IRange } from '../core/range.js';
import { FoldingRules } from '../languages/languageConfiguration.js';
import { isMultilineRegexSource } from '../model/textModelSearch.js';
import { regExpLeadsToEndlessLoop } from '../../../base/common/strings.js';

export interface ISectionHeaderFinderTarget {
	getLineCount(): number;
	getLineContent(lineNumber: number): string;
}

export interface FindSectionHeaderOptions {
	foldingRules?: FoldingRules;
	findRegionSectionHeaders: boolean;
	findMarkSectionHeaders: boolean;
	markSectionHeaderRegex: string;
}

export interface SectionHeader {
	/**
	 * The location of the header text in the text model.
	 */
	range: IRange;
	/**
	 * The section header text.
	 */
	text: string;
	/**
	 * Whether the section header includes a separator line.
	 */
	hasSeparatorLine: boolean;
	/**
	 * This section should be omitted before rendering if it's not in a comment.
	 */
	shouldBeInComments: boolean;
}

const trimDashesRegex = /^-+|-+$/g;

const CHUNK_SIZE = 100;
const MAX_SECTION_LINES = 5;

/**
 * Find section headers in the model.
 *
 * @param model the text model to search in
 * @param options options to search with
 * @returns an array of section headers
 */
export function findSectionHeaders(model: ISectionHeaderFinderTarget, options: FindSectionHeaderOptions): SectionHeader[] {
	let headers: SectionHeader[] = [];
	if (options.findRegionSectionHeaders && options.foldingRules?.markers) {
		const regionHeaders = collectRegionHeaders(model, options);
		headers = headers.concat(regionHeaders);
	}
	if (options.findMarkSectionHeaders) {
		const markHeaders = collectMarkHeaders(model, options);
		headers = headers.concat(markHeaders);
	}
	return headers;
}

function collectRegionHeaders(model: ISectionHeaderFinderTarget, options: FindSectionHeaderOptions): SectionHeader[] {
	const regionHeaders: SectionHeader[] = [];
	const endLineNumber = model.getLineCount();
	for (let lineNumber = 1; lineNumber <= endLineNumber; lineNumber++) {
		const lineContent = model.getLineContent(lineNumber);
		const match = lineContent.match(options.foldingRules!.markers!.start);
		if (match) {
			const range = { startLineNumber: lineNumber, startColumn: match[0].length + 1, endLineNumber: lineNumber, endColumn: lineContent.length + 1 };
			if (range.endColumn > range.startColumn) {
				const sectionHeader = {
					range,
					...getHeaderText(lineContent.substring(match[0].length)),
					shouldBeInComments: false
				};
				if (sectionHeader.text || sectionHeader.hasSeparatorLine) {
					regionHeaders.push(sectionHeader);
				}
			}
		}
	}
	return regionHeaders;
}

export function collectMarkHeaders(model: ISectionHeaderFinderTarget, options: FindSectionHeaderOptions): SectionHeader[] {
	const markHeaders: SectionHeader[] = [];
	const endLineNumber = model.getLineCount();

	// Validate regex to prevent infinite loops
	if (!options.markSectionHeaderRegex || options.markSectionHeaderRegex.trim() === '') {
		return markHeaders;
	}

	// Create regex with flags for:
	// - 'd' for indices to get proper match positions
	// - 'm' for multi-line mode so ^ and $ match line starts/ends
	// - 's' for dot-all mode so . matches newlines
	const multiline = isMultilineRegexSource(options.markSectionHeaderRegex);
	const regex = new RegExp(options.markSectionHeaderRegex, `gdm${multiline ? 's' : ''}`);

	// Check if the regex would lead to an endless loop
	if (regExpLeadsToEndlessLoop(regex)) {
		return markHeaders;
	}

	// Process text in overlapping chunks for better performance
	for (let startLine = 1; startLine <= endLineNumber; startLine += CHUNK_SIZE - MAX_SECTION_LINES) {
		const endLine = Math.min(startLine + CHUNK_SIZE - 1, endLineNumber);
		const lines: string[] = [];

		// Collect lines for the current chunk
		for (let i = startLine; i <= endLine; i++) {
			lines.push(model.getLineContent(i));
		}

		const text = lines.join('\n');
		regex.lastIndex = 0;

		let match: RegExpExecArray | null;
		while ((match = regex.exec(text)) !== null) {
			// Calculate which line this match starts on by counting newlines before it
			const precedingText = text.substring(0, match.index);
			const lineOffset = (precedingText.match(/\n/g) || []).length;
			const lineNumber = startLine + lineOffset;

			// Calculate match height to check overlap properly
			const matchLines = match[0].split('\n');
			const matchHeight = matchLines.length;
			const matchEndLine = lineNumber + matchHeight - 1;

			// Calculate start column - need to find the start of the line containing the match
			const lineStartIndex = precedingText.lastIndexOf('\n') + 1;
			const startColumn = match.index - lineStartIndex + 1;

			// Calculate end column - need to handle multi-line matches
			const lastMatchLine = matchLines[matchLines.length - 1];
			const endColumn = matchHeight === 1 ? startColumn + match[0].length : lastMatchLine.length + 1;

			const range = {
				startLineNumber: lineNumber,
				startColumn,
				endLineNumber: matchEndLine,
				endColumn
			};

			const text2 = (match.groups ?? {})['label'] ?? '';
			const hasSeparatorLine = ((match.groups ?? {})['separator'] ?? '') !== '';

			const sectionHeader = {
				range,
				text: text2,
				hasSeparatorLine,
				shouldBeInComments: true
			};

			if (sectionHeader.text || sectionHeader.hasSeparatorLine) {
				// only push if the previous one doesn't have this same linbe
				if (markHeaders.length === 0 || markHeaders[markHeaders.length - 1].range.endLineNumber < sectionHeader.range.startLineNumber) {
					markHeaders.push(sectionHeader);
				}
			}

			// Move lastIndex past the current match to avoid infinite loop
			regex.lastIndex = match.index + match[0].length;
		}
	}

	return markHeaders;
}

function getHeaderText(text: string): { text: string; hasSeparatorLine: boolean } {
	text = text.trim();
	const hasSeparatorLine = text.startsWith('-');
	text = text.replace(trimDashesRegex, '');
	return { text, hasSeparatorLine };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/getIconClasses.ts]---
Location: vscode-main/src/vs/editor/common/services/getIconClasses.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../base/common/network.js';
import { DataUri } from '../../../base/common/resources.js';
import { URI, URI as uri } from '../../../base/common/uri.js';
import { PLAINTEXT_LANGUAGE_ID } from '../languages/modesRegistry.js';
import { ILanguageService } from '../languages/language.js';
import { IModelService } from './model.js';
import { FileKind } from '../../../platform/files/common/files.js';
import { ThemeIcon } from '../../../base/common/themables.js';

const fileIconDirectoryRegex = /(?:\/|^)(?:([^\/]+)\/)?([^\/]+)$/;

export function getIconClasses(modelService: IModelService, languageService: ILanguageService, resource: uri | undefined, fileKind?: FileKind, icon?: ThemeIcon | URI): string[] {
	if (ThemeIcon.isThemeIcon(icon)) {
		return [`codicon-${icon.id}`, 'predefined-file-icon'];
	}

	if (URI.isUri(icon)) {
		return [];
	}

	// we always set these base classes even if we do not have a path
	const classes = fileKind === FileKind.ROOT_FOLDER ? ['rootfolder-icon'] : fileKind === FileKind.FOLDER ? ['folder-icon'] : ['file-icon'];
	if (resource) {

		// Get the path and name of the resource. For data-URIs, we need to parse specially
		let name: string | undefined;
		if (resource.scheme === Schemas.data) {
			const metadata = DataUri.parseMetaData(resource);
			name = metadata.get(DataUri.META_DATA_LABEL);
		} else {
			const match = resource.path.match(fileIconDirectoryRegex);
			if (match) {
				name = fileIconSelectorEscape(match[2].toLowerCase());
				if (match[1]) {
					classes.push(`${fileIconSelectorEscape(match[1].toLowerCase())}-name-dir-icon`); // parent directory
				}

			} else {
				name = fileIconSelectorEscape(resource.authority.toLowerCase());
			}
		}

		// Root Folders
		if (fileKind === FileKind.ROOT_FOLDER) {
			classes.push(`${name}-root-name-folder-icon`);
		}

		// Folders
		else if (fileKind === FileKind.FOLDER) {
			classes.push(`${name}-name-folder-icon`);
		}

		// Files
		else {

			// Name & Extension(s)
			if (name) {
				classes.push(`${name}-name-file-icon`);
				classes.push(`name-file-icon`); // extra segment to increase file-name score
				// Avoid doing an explosive combination of extensions for very long filenames
				// (most file systems do not allow files > 255 length) with lots of `.` characters
				// https://github.com/microsoft/vscode/issues/116199
				if (name.length <= 255) {
					const dotSegments = name.split('.');
					for (let i = 1; i < dotSegments.length; i++) {
						classes.push(`${dotSegments.slice(i).join('.')}-ext-file-icon`); // add each combination of all found extensions if more than one
					}
				}
				classes.push(`ext-file-icon`); // extra segment to increase file-ext score
			}

			// Detected Mode
			const detectedLanguageId = detectLanguageId(modelService, languageService, resource);
			if (detectedLanguageId) {
				classes.push(`${fileIconSelectorEscape(detectedLanguageId)}-lang-file-icon`);
			}
		}
	}
	return classes;
}

export function getIconClassesForLanguageId(languageId: string): string[] {
	return ['file-icon', `${fileIconSelectorEscape(languageId)}-lang-file-icon`];
}

function detectLanguageId(modelService: IModelService, languageService: ILanguageService, resource: uri): string | null {
	if (!resource) {
		return null; // we need a resource at least
	}

	let languageId: string | null = null;

	// Data URI: check for encoded metadata
	if (resource.scheme === Schemas.data) {
		const metadata = DataUri.parseMetaData(resource);
		const mime = metadata.get(DataUri.META_DATA_MIME);

		if (mime) {
			languageId = languageService.getLanguageIdByMimeType(mime);
		}
	}

	// Any other URI: check for model if existing
	else {
		const model = modelService.getModel(resource);
		if (model) {
			languageId = model.getLanguageId();
		}
	}

	// only take if the language id is specific (aka no just plain text)
	if (languageId && languageId !== PLAINTEXT_LANGUAGE_ID) {
		return languageId;
	}

	// otherwise fallback to path based detection
	return languageService.guessLanguageIdByFilepathOrFirstLine(resource);
}

export function fileIconSelectorEscape(str: string): string {
	return str.replace(/[\s]/g, '/'); // HTML class names can not contain certain whitespace characters (https://dom.spec.whatwg.org/#interface-domtokenlist), use / instead, which doesn't exist in file names.
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/languageFeatureDebounce.ts]---
Location: vscode-main/src/vs/editor/common/services/languageFeatureDebounce.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { doHash } from '../../../base/common/hash.js';
import { LRUCache } from '../../../base/common/map.js';
import { clamp, MovingAverage, SlidingWindowAverage } from '../../../base/common/numbers.js';
import { LanguageFeatureRegistry } from '../languageFeatureRegistry.js';
import { ITextModel } from '../model.js';
import { IEnvironmentService } from '../../../platform/environment/common/environment.js';
import { InstantiationType, registerSingleton } from '../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { matchesScheme } from '../../../base/common/network.js';


export const ILanguageFeatureDebounceService = createDecorator<ILanguageFeatureDebounceService>('ILanguageFeatureDebounceService');

export interface ILanguageFeatureDebounceService {

	readonly _serviceBrand: undefined;

	for(feature: LanguageFeatureRegistry<object>, debugName: string, config?: { min?: number; max?: number; salt?: string }): IFeatureDebounceInformation;
}

export interface IFeatureDebounceInformation {
	get(model: ITextModel): number;
	update(model: ITextModel, value: number): number;
	default(): number;
}

namespace IdentityHash {
	const _hashes = new WeakMap<object, number>();
	let pool = 0;
	export function of(obj: object): number {
		let value = _hashes.get(obj);
		if (value === undefined) {
			value = ++pool;
			_hashes.set(obj, value);
		}
		return value;
	}
}

class NullDebounceInformation implements IFeatureDebounceInformation {

	constructor(private readonly _default: number) { }

	get(_model: ITextModel): number {
		return this._default;
	}
	update(_model: ITextModel, _value: number): number {
		return this._default;
	}
	default(): number {
		return this._default;
	}
}

class FeatureDebounceInformation implements IFeatureDebounceInformation {

	private readonly _cache = new LRUCache<string, SlidingWindowAverage>(50, 0.7);

	constructor(
		private readonly _logService: ILogService,
		private readonly _name: string,
		private readonly _registry: LanguageFeatureRegistry<object>,
		private readonly _default: number,
		private readonly _min: number,
		private readonly _max: number,
	) { }

	private _key(model: ITextModel): string {
		return model.id + this._registry.all(model).reduce((hashVal, obj) => doHash(IdentityHash.of(obj), hashVal), 0);
	}

	get(model: ITextModel): number {
		const key = this._key(model);
		const avg = this._cache.get(key);
		return avg
			? clamp(avg.value, this._min, this._max)
			: this.default();
	}

	update(model: ITextModel, value: number): number {
		const key = this._key(model);
		let avg = this._cache.get(key);
		if (!avg) {
			avg = new SlidingWindowAverage(6);
			this._cache.set(key, avg);
		}
		const newValue = clamp(avg.update(value), this._min, this._max);
		if (!matchesScheme(model.uri, 'output')) {
			this._logService.trace(`[DEBOUNCE: ${this._name}] for ${model.uri.toString()} is ${newValue}ms`);
		}
		return newValue;
	}

	private _overall(): number {
		const result = new MovingAverage();
		for (const [, avg] of this._cache) {
			result.update(avg.value);
		}
		return result.value;
	}

	default() {
		const value = (this._overall() | 0) || this._default;
		return clamp(value, this._min, this._max);
	}
}


export class LanguageFeatureDebounceService implements ILanguageFeatureDebounceService {

	declare _serviceBrand: undefined;

	private readonly _data = new Map<string, IFeatureDebounceInformation>();
	private readonly _isDev: boolean;

	constructor(
		@ILogService private readonly _logService: ILogService,
		@IEnvironmentService envService: IEnvironmentService,
	) {

		this._isDev = envService.isExtensionDevelopment || !envService.isBuilt;
	}

	for(feature: LanguageFeatureRegistry<object>, name: string, config?: { min?: number; max?: number; key?: string }): IFeatureDebounceInformation {
		const min = config?.min ?? 50;
		const max = config?.max ?? min ** 2;
		const extra = config?.key ?? undefined;
		const key = `${IdentityHash.of(feature)},${min}${extra ? ',' + extra : ''}`;
		let info = this._data.get(key);
		if (!info) {
			if (this._isDev) {
				this._logService.debug(`[DEBOUNCE: ${name}] is disabled in developed mode`);
				info = new NullDebounceInformation(min * 1.5);
			} else {
				info = new FeatureDebounceInformation(
					this._logService,
					name,
					feature,
					(this._overallAverage() | 0) || (min * 1.5), // default is overall default or derived from min-value
					min,
					max
				);
			}
			this._data.set(key, info);
		}
		return info;
	}

	private _overallAverage(): number {
		// Average of all language features. Not a great value but an approximation
		const result = new MovingAverage();
		for (const info of this._data.values()) {
			result.update(info.default());
		}
		return result.value;
	}
}

registerSingleton(ILanguageFeatureDebounceService, LanguageFeatureDebounceService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/services/languageFeatures.ts]---
Location: vscode-main/src/vs/editor/common/services/languageFeatures.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageFeatureRegistry, NotebookInfoResolver } from '../languageFeatureRegistry.js';
import { CodeActionProvider, CodeLensProvider, CompletionItemProvider, DeclarationProvider, DefinitionProvider, DocumentColorProvider, DocumentFormattingEditProvider, DocumentHighlightProvider, DocumentDropEditProvider, DocumentPasteEditProvider, DocumentRangeFormattingEditProvider, DocumentRangeSemanticTokensProvider, DocumentSemanticTokensProvider, DocumentSymbolProvider, EvaluatableExpressionProvider, FoldingRangeProvider, HoverProvider, ImplementationProvider, InlayHintsProvider, InlineCompletionsProvider, InlineValuesProvider, LinkedEditingRangeProvider, LinkProvider, MultiDocumentHighlightProvider, NewSymbolNamesProvider, OnTypeFormattingEditProvider, ReferenceProvider, RenameProvider, SelectionRangeProvider, SignatureHelpProvider, TypeDefinitionProvider } from '../languages.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';

export const ILanguageFeaturesService = createDecorator<ILanguageFeaturesService>('ILanguageFeaturesService');

export interface ILanguageFeaturesService {

	readonly _serviceBrand: undefined;

	readonly referenceProvider: LanguageFeatureRegistry<ReferenceProvider>;

	readonly definitionProvider: LanguageFeatureRegistry<DefinitionProvider>;

	readonly typeDefinitionProvider: LanguageFeatureRegistry<TypeDefinitionProvider>;

	readonly declarationProvider: LanguageFeatureRegistry<DeclarationProvider>;

	readonly implementationProvider: LanguageFeatureRegistry<ImplementationProvider>;

	readonly codeActionProvider: LanguageFeatureRegistry<CodeActionProvider>;

	readonly documentPasteEditProvider: LanguageFeatureRegistry<DocumentPasteEditProvider>;

	readonly renameProvider: LanguageFeatureRegistry<RenameProvider>;

	readonly newSymbolNamesProvider: LanguageFeatureRegistry<NewSymbolNamesProvider>;

	readonly documentFormattingEditProvider: LanguageFeatureRegistry<DocumentFormattingEditProvider>;

	readonly documentRangeFormattingEditProvider: LanguageFeatureRegistry<DocumentRangeFormattingEditProvider>;

	readonly onTypeFormattingEditProvider: LanguageFeatureRegistry<OnTypeFormattingEditProvider>;

	readonly documentSymbolProvider: LanguageFeatureRegistry<DocumentSymbolProvider>;

	readonly inlayHintsProvider: LanguageFeatureRegistry<InlayHintsProvider>;

	readonly colorProvider: LanguageFeatureRegistry<DocumentColorProvider>;

	readonly codeLensProvider: LanguageFeatureRegistry<CodeLensProvider>;

	readonly signatureHelpProvider: LanguageFeatureRegistry<SignatureHelpProvider>;

	readonly hoverProvider: LanguageFeatureRegistry<HoverProvider>;

	readonly documentHighlightProvider: LanguageFeatureRegistry<DocumentHighlightProvider>;

	readonly multiDocumentHighlightProvider: LanguageFeatureRegistry<MultiDocumentHighlightProvider>;

	readonly documentRangeSemanticTokensProvider: LanguageFeatureRegistry<DocumentRangeSemanticTokensProvider>;

	readonly documentSemanticTokensProvider: LanguageFeatureRegistry<DocumentSemanticTokensProvider>;

	readonly selectionRangeProvider: LanguageFeatureRegistry<SelectionRangeProvider>;

	readonly foldingRangeProvider: LanguageFeatureRegistry<FoldingRangeProvider>;

	readonly linkProvider: LanguageFeatureRegistry<LinkProvider>;

	readonly inlineCompletionsProvider: LanguageFeatureRegistry<InlineCompletionsProvider>;

	readonly completionProvider: LanguageFeatureRegistry<CompletionItemProvider>;

	readonly linkedEditingRangeProvider: LanguageFeatureRegistry<LinkedEditingRangeProvider>;

	readonly inlineValuesProvider: LanguageFeatureRegistry<InlineValuesProvider>;

	readonly evaluatableExpressionProvider: LanguageFeatureRegistry<EvaluatableExpressionProvider>;

	readonly documentDropEditProvider: LanguageFeatureRegistry<DocumentDropEditProvider>;

	// --

	setNotebookTypeResolver(resolver: NotebookInfoResolver | undefined): void;
}
```

--------------------------------------------------------------------------------

````
