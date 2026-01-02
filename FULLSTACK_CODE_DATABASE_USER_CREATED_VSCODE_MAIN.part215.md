---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 215
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 215 of 552)

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

---[FILE: src/vs/editor/common/model/bracketPairsTextModelPart/fixBrackets.ts]---
Location: vscode-main/src/vs/editor/common/model/bracketPairsTextModelPart/fixBrackets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILanguageConfigurationService } from '../../languages/languageConfigurationRegistry.js';
import { AstNode, AstNodeKind } from './bracketPairsTree/ast.js';
import { LanguageAgnosticBracketTokens } from './bracketPairsTree/brackets.js';
import { Length, lengthAdd, lengthGetColumnCountIfZeroLineCount, lengthZero } from './bracketPairsTree/length.js';
import { parseDocument } from './bracketPairsTree/parser.js';
import { DenseKeyProvider } from './bracketPairsTree/smallImmutableSet.js';
import { ITokenizerSource, TextBufferTokenizer } from './bracketPairsTree/tokenizer.js';
import { IViewLineTokens } from '../../tokens/lineTokens.js';

export function fixBracketsInLine(tokens: IViewLineTokens, languageConfigurationService: ILanguageConfigurationService): string {
	const denseKeyProvider = new DenseKeyProvider<string>();
	const bracketTokens = new LanguageAgnosticBracketTokens(denseKeyProvider, (languageId) =>
		languageConfigurationService.getLanguageConfiguration(languageId)
	);
	const tokenizer = new TextBufferTokenizer(
		new StaticTokenizerSource([tokens]),
		bracketTokens
	);
	const node = parseDocument(tokenizer, [], undefined, true);

	let str = '';
	const line = tokens.getLineContent();

	function processNode(node: AstNode, offset: Length) {
		if (node.kind === AstNodeKind.Pair) {
			processNode(node.openingBracket, offset);
			offset = lengthAdd(offset, node.openingBracket.length);

			if (node.child) {
				processNode(node.child, offset);
				offset = lengthAdd(offset, node.child.length);
			}
			if (node.closingBracket) {
				processNode(node.closingBracket, offset);
				offset = lengthAdd(offset, node.closingBracket.length);
			} else {
				const singleLangBracketTokens = bracketTokens.getSingleLanguageBracketTokens(node.openingBracket.languageId);

				const closingTokenText = singleLangBracketTokens.findClosingTokenText(node.openingBracket.bracketIds);
				str += closingTokenText;
			}
		} else if (node.kind === AstNodeKind.UnexpectedClosingBracket) {
			// remove the bracket
		} else if (node.kind === AstNodeKind.Text || node.kind === AstNodeKind.Bracket) {
			str += line.substring(
				lengthGetColumnCountIfZeroLineCount(offset),
				lengthGetColumnCountIfZeroLineCount(lengthAdd(offset, node.length))
			);
		} else if (node.kind === AstNodeKind.List) {
			for (const child of node.children) {
				processNode(child, offset);
				offset = lengthAdd(offset, child.length);
			}
		}
	}

	processNode(node, lengthZero);

	return str;
}

class StaticTokenizerSource implements ITokenizerSource {
	constructor(private readonly lines: IViewLineTokens[]) { }

	getValue(): string {
		return this.lines.map(l => l.getLineContent()).join('\n');
	}
	getLineCount(): number {
		return this.lines.length;
	}
	getLineLength(lineNumber: number): number {
		return this.lines[lineNumber - 1].getLineContent().length;
	}

	tokenization = {
		getLineTokens: (lineNumber: number): IViewLineTokens => {
			return this.lines[lineNumber - 1];
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/ast.ts]---
Location: vscode-main/src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/ast.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BugIndicatingError } from '../../../../../base/common/errors.js';
import { CursorColumns } from '../../../core/cursorColumns.js';
import { BracketKind } from '../../../languages/supports/languageBracketsConfiguration.js';
import { ITextModel } from '../../../model.js';
import { Length, lengthAdd, lengthGetLineCount, lengthToObj, lengthZero } from './length.js';
import { SmallImmutableSet } from './smallImmutableSet.js';
import { OpeningBracketId } from './tokenizer.js';

export const enum AstNodeKind {
	Text = 0,
	Bracket = 1,
	Pair = 2,
	UnexpectedClosingBracket = 3,
	List = 4,
}

export type AstNode = PairAstNode | ListAstNode | BracketAstNode | InvalidBracketAstNode | TextAstNode;

/**
 * The base implementation for all AST nodes.
*/
abstract class BaseAstNode {
	public abstract readonly kind: AstNodeKind;

	public abstract readonly childrenLength: number;

	/**
	 * Might return null even if {@link idx} is smaller than {@link BaseAstNode.childrenLength}.
	*/
	public abstract getChild(idx: number): AstNode | null;

	/**
	 * Try to avoid using this property, as implementations might need to allocate the resulting array.
	*/
	public abstract readonly children: readonly AstNode[];

	/**
	 * Represents the set of all (potentially) missing opening bracket ids in this node.
	 * E.g. in `{ ] ) }` that set is {`[`, `(` }.
	*/
	public abstract readonly missingOpeningBracketIds: SmallImmutableSet<OpeningBracketId>;

	/**
	 * In case of a list, determines the height of the (2,3) tree.
	*/
	public abstract readonly listHeight: number;

	protected _length: Length;

	/**
	 * The length of the entire node, which should equal the sum of lengths of all children.
	*/
	public get length(): Length {
		return this._length;
	}

	public constructor(length: Length) {
		this._length = length;
	}

	/**
	 * @param openBracketIds The set of all opening brackets that have not yet been closed.
	 */
	public abstract canBeReused(
		openBracketIds: SmallImmutableSet<OpeningBracketId>
	): boolean;

	/**
	 * Flattens all lists in this AST. Only for debugging.
	 */
	public abstract flattenLists(): AstNode;

	/**
	 * Creates a deep clone.
	 */
	public abstract deepClone(): AstNode;

	public abstract computeMinIndentation(offset: Length, textModel: ITextModel): number;
}

/**
 * Represents a bracket pair including its child (e.g. `{ ... }`).
 * Might be unclosed.
 * Immutable, if all children are immutable.
*/
export class PairAstNode extends BaseAstNode {
	public static create(
		openingBracket: BracketAstNode,
		child: AstNode | null,
		closingBracket: BracketAstNode | null
	) {
		let length = openingBracket.length;
		if (child) {
			length = lengthAdd(length, child.length);
		}
		if (closingBracket) {
			length = lengthAdd(length, closingBracket.length);
		}
		return new PairAstNode(length, openingBracket, child, closingBracket, child ? child.missingOpeningBracketIds : SmallImmutableSet.getEmpty());
	}

	public get kind(): AstNodeKind.Pair {
		return AstNodeKind.Pair;
	}
	public get listHeight() {
		return 0;
	}
	public get childrenLength(): number {
		return 3;
	}
	public getChild(idx: number): AstNode | null {
		switch (idx) {
			case 0: return this.openingBracket;
			case 1: return this.child;
			case 2: return this.closingBracket;
		}
		throw new Error('Invalid child index');
	}

	/**
	 * Avoid using this property, it allocates an array!
	*/
	public get children() {
		const result: AstNode[] = [];
		result.push(this.openingBracket);
		if (this.child) {
			result.push(this.child);
		}
		if (this.closingBracket) {
			result.push(this.closingBracket);
		}
		return result;
	}

	private constructor(
		length: Length,
		public readonly openingBracket: BracketAstNode,
		public readonly child: AstNode | null,
		public readonly closingBracket: BracketAstNode | null,
		public readonly missingOpeningBracketIds: SmallImmutableSet<OpeningBracketId>
	) {
		super(length);
	}

	public canBeReused(openBracketIds: SmallImmutableSet<OpeningBracketId>) {
		if (this.closingBracket === null) {
			// Unclosed pair ast nodes only
			// end at the end of the document
			// or when a parent node is closed.

			// This could be improved:
			// Only return false if some next token is neither "undefined" nor a bracket that closes a parent.

			return false;
		}

		if (openBracketIds.intersects(this.missingOpeningBracketIds)) {
			return false;
		}

		return true;
	}

	public flattenLists(): PairAstNode {
		return PairAstNode.create(
			this.openingBracket.flattenLists(),
			this.child && this.child.flattenLists(),
			this.closingBracket && this.closingBracket.flattenLists()
		);
	}

	public deepClone(): PairAstNode {
		return new PairAstNode(
			this.length,
			this.openingBracket.deepClone(),
			this.child && this.child.deepClone(),
			this.closingBracket && this.closingBracket.deepClone(),
			this.missingOpeningBracketIds
		);
	}

	public computeMinIndentation(offset: Length, textModel: ITextModel): number {
		return this.child ? this.child.computeMinIndentation(lengthAdd(offset, this.openingBracket.length), textModel) : Number.MAX_SAFE_INTEGER;
	}
}

export abstract class ListAstNode extends BaseAstNode {
	/**
	 * This method uses more memory-efficient list nodes that can only store 2 or 3 children.
	*/
	public static create23(item1: AstNode, item2: AstNode, item3: AstNode | null, immutable: boolean = false): ListAstNode {
		let length = item1.length;
		let missingBracketIds = item1.missingOpeningBracketIds;

		if (item1.listHeight !== item2.listHeight) {
			throw new Error('Invalid list heights');
		}

		length = lengthAdd(length, item2.length);
		missingBracketIds = missingBracketIds.merge(item2.missingOpeningBracketIds);

		if (item3) {
			if (item1.listHeight !== item3.listHeight) {
				throw new Error('Invalid list heights');
			}
			length = lengthAdd(length, item3.length);
			missingBracketIds = missingBracketIds.merge(item3.missingOpeningBracketIds);
		}
		return immutable
			? new Immutable23ListAstNode(length, item1.listHeight + 1, item1, item2, item3, missingBracketIds)
			: new TwoThreeListAstNode(length, item1.listHeight + 1, item1, item2, item3, missingBracketIds);
	}

	public static create(items: AstNode[], immutable: boolean = false): ListAstNode {
		if (items.length === 0) {
			return this.getEmpty();
		} else {
			let length = items[0].length;
			let unopenedBrackets = items[0].missingOpeningBracketIds;
			for (let i = 1; i < items.length; i++) {
				length = lengthAdd(length, items[i].length);
				unopenedBrackets = unopenedBrackets.merge(items[i].missingOpeningBracketIds);
			}
			return immutable
				? new ImmutableArrayListAstNode(length, items[0].listHeight + 1, items, unopenedBrackets)
				: new ArrayListAstNode(length, items[0].listHeight + 1, items, unopenedBrackets);
		}
	}

	public static getEmpty() {
		return new ImmutableArrayListAstNode(lengthZero, 0, [], SmallImmutableSet.getEmpty());
	}

	public get kind(): AstNodeKind.List {
		return AstNodeKind.List;
	}

	public get missingOpeningBracketIds(): SmallImmutableSet<OpeningBracketId> {
		return this._missingOpeningBracketIds;
	}

	private cachedMinIndentation: number = -1;

	/**
	 * Use ListAstNode.create.
	*/
	constructor(
		length: Length,
		public readonly listHeight: number,
		private _missingOpeningBracketIds: SmallImmutableSet<OpeningBracketId>
	) {
		super(length);
	}

	protected throwIfImmutable(): void {
		// NOOP
	}

	protected abstract setChild(idx: number, child: AstNode): void;

	public makeLastElementMutable(): AstNode | undefined {
		this.throwIfImmutable();
		const childCount = this.childrenLength;
		if (childCount === 0) {
			return undefined;
		}
		const lastChild = this.getChild(childCount - 1)!;
		const mutable = lastChild.kind === AstNodeKind.List ? lastChild.toMutable() : lastChild;
		if (lastChild !== mutable) {
			this.setChild(childCount - 1, mutable);
		}
		return mutable;
	}

	public makeFirstElementMutable(): AstNode | undefined {
		this.throwIfImmutable();
		const childCount = this.childrenLength;
		if (childCount === 0) {
			return undefined;
		}
		const firstChild = this.getChild(0)!;
		const mutable = firstChild.kind === AstNodeKind.List ? firstChild.toMutable() : firstChild;
		if (firstChild !== mutable) {
			this.setChild(0, mutable);
		}
		return mutable;
	}

	public canBeReused(openBracketIds: SmallImmutableSet<OpeningBracketId>): boolean {
		if (openBracketIds.intersects(this.missingOpeningBracketIds)) {
			return false;
		}

		if (this.childrenLength === 0) {
			// Don't reuse empty lists.
			return false;
		}

		let lastChild: ListAstNode = this;
		while (lastChild.kind === AstNodeKind.List) {
			const lastLength = lastChild.childrenLength;
			if (lastLength === 0) {
				// Empty lists should never be contained in other lists.
				throw new BugIndicatingError();
			}
			lastChild = lastChild.getChild(lastLength - 1) as ListAstNode;
		}

		return lastChild.canBeReused(openBracketIds);
	}

	public handleChildrenChanged(): void {
		this.throwIfImmutable();

		const count = this.childrenLength;

		let length = this.getChild(0)!.length;
		let unopenedBrackets = this.getChild(0)!.missingOpeningBracketIds;

		for (let i = 1; i < count; i++) {
			const child = this.getChild(i)!;
			length = lengthAdd(length, child.length);
			unopenedBrackets = unopenedBrackets.merge(child.missingOpeningBracketIds);
		}

		this._length = length;
		this._missingOpeningBracketIds = unopenedBrackets;
		this.cachedMinIndentation = -1;
	}

	public flattenLists(): ListAstNode {
		const items: AstNode[] = [];
		for (const c of this.children) {
			const normalized = c.flattenLists();
			if (normalized.kind === AstNodeKind.List) {
				items.push(...normalized.children);
			} else {
				items.push(normalized);
			}
		}
		return ListAstNode.create(items);
	}

	public computeMinIndentation(offset: Length, textModel: ITextModel): number {
		if (this.cachedMinIndentation !== -1) {
			return this.cachedMinIndentation;
		}

		let minIndentation = Number.MAX_SAFE_INTEGER;
		let childOffset = offset;
		for (let i = 0; i < this.childrenLength; i++) {
			const child = this.getChild(i);
			if (child) {
				minIndentation = Math.min(minIndentation, child.computeMinIndentation(childOffset, textModel));
				childOffset = lengthAdd(childOffset, child.length);
			}
		}

		this.cachedMinIndentation = minIndentation;
		return minIndentation;
	}

	/**
	 * Creates a shallow clone that is mutable, or itself if it is already mutable.
	 */
	public abstract toMutable(): ListAstNode;

	public abstract appendChildOfSameHeight(node: AstNode): void;
	public abstract unappendChild(): AstNode | undefined;
	public abstract prependChildOfSameHeight(node: AstNode): void;
	public abstract unprependChild(): AstNode | undefined;
}

class TwoThreeListAstNode extends ListAstNode {
	public get childrenLength(): number {
		return this._item3 !== null ? 3 : 2;
	}
	public getChild(idx: number): AstNode | null {
		switch (idx) {
			case 0: return this._item1;
			case 1: return this._item2;
			case 2: return this._item3;
		}
		throw new Error('Invalid child index');
	}
	protected setChild(idx: number, node: AstNode): void {
		switch (idx) {
			case 0: this._item1 = node; return;
			case 1: this._item2 = node; return;
			case 2: this._item3 = node; return;
		}
		throw new Error('Invalid child index');
	}

	public get children(): readonly AstNode[] {
		return this._item3 ? [this._item1, this._item2, this._item3] : [this._item1, this._item2];
	}

	public get item1(): AstNode {
		return this._item1;
	}
	public get item2(): AstNode {
		return this._item2;
	}
	public get item3(): AstNode | null {
		return this._item3;
	}

	public constructor(
		length: Length,
		listHeight: number,
		private _item1: AstNode,
		private _item2: AstNode,
		private _item3: AstNode | null,
		missingOpeningBracketIds: SmallImmutableSet<OpeningBracketId>
	) {
		super(length, listHeight, missingOpeningBracketIds);
	}

	public deepClone(): ListAstNode {
		return new TwoThreeListAstNode(
			this.length,
			this.listHeight,
			this._item1.deepClone(),
			this._item2.deepClone(),
			this._item3 ? this._item3.deepClone() : null,
			this.missingOpeningBracketIds
		);
	}

	public appendChildOfSameHeight(node: AstNode): void {
		if (this._item3) {
			throw new Error('Cannot append to a full (2,3) tree node');
		}
		this.throwIfImmutable();
		this._item3 = node;
		this.handleChildrenChanged();
	}

	public unappendChild(): AstNode | undefined {
		if (!this._item3) {
			throw new Error('Cannot remove from a non-full (2,3) tree node');
		}
		this.throwIfImmutable();
		const result = this._item3;
		this._item3 = null;
		this.handleChildrenChanged();
		return result;
	}

	public prependChildOfSameHeight(node: AstNode): void {
		if (this._item3) {
			throw new Error('Cannot prepend to a full (2,3) tree node');
		}
		this.throwIfImmutable();
		this._item3 = this._item2;
		this._item2 = this._item1;
		this._item1 = node;
		this.handleChildrenChanged();
	}

	public unprependChild(): AstNode | undefined {
		if (!this._item3) {
			throw new Error('Cannot remove from a non-full (2,3) tree node');
		}
		this.throwIfImmutable();
		const result = this._item1;
		this._item1 = this._item2;
		this._item2 = this._item3;
		this._item3 = null;

		this.handleChildrenChanged();
		return result;
	}

	override toMutable(): ListAstNode {
		return this;
	}
}

/**
 * Immutable, if all children are immutable.
*/
class Immutable23ListAstNode extends TwoThreeListAstNode {
	override toMutable(): ListAstNode {
		return new TwoThreeListAstNode(this.length, this.listHeight, this.item1, this.item2, this.item3, this.missingOpeningBracketIds);
	}

	protected override throwIfImmutable(): void {
		throw new Error('this instance is immutable');
	}
}

/**
 * For debugging.
*/
class ArrayListAstNode extends ListAstNode {
	get childrenLength(): number {
		return this._children.length;
	}
	getChild(idx: number): AstNode | null {
		return this._children[idx];
	}
	protected setChild(idx: number, child: AstNode): void {
		this._children[idx] = child;
	}
	get children(): readonly AstNode[] {
		return this._children;
	}

	constructor(
		length: Length,
		listHeight: number,
		private readonly _children: AstNode[],
		missingOpeningBracketIds: SmallImmutableSet<OpeningBracketId>
	) {
		super(length, listHeight, missingOpeningBracketIds);
	}

	deepClone(): ListAstNode {
		const children = new Array<AstNode>(this._children.length);
		for (let i = 0; i < this._children.length; i++) {
			children[i] = this._children[i].deepClone();
		}
		return new ArrayListAstNode(this.length, this.listHeight, children, this.missingOpeningBracketIds);
	}

	public appendChildOfSameHeight(node: AstNode): void {
		this.throwIfImmutable();
		this._children.push(node);
		this.handleChildrenChanged();
	}

	public unappendChild(): AstNode | undefined {
		this.throwIfImmutable();
		const item = this._children.pop();
		this.handleChildrenChanged();
		return item;
	}

	public prependChildOfSameHeight(node: AstNode): void {
		this.throwIfImmutable();
		this._children.unshift(node);
		this.handleChildrenChanged();
	}

	public unprependChild(): AstNode | undefined {
		this.throwIfImmutable();
		const item = this._children.shift();
		this.handleChildrenChanged();
		return item;
	}

	public override toMutable(): ListAstNode {
		return this;
	}
}

/**
 * Immutable, if all children are immutable.
*/
class ImmutableArrayListAstNode extends ArrayListAstNode {
	override toMutable(): ListAstNode {
		return new ArrayListAstNode(this.length, this.listHeight, [...this.children], this.missingOpeningBracketIds);
	}

	protected override throwIfImmutable(): void {
		throw new Error('this instance is immutable');
	}
}

const emptyArray: readonly AstNode[] = [];

abstract class ImmutableLeafAstNode extends BaseAstNode {
	public get listHeight() {
		return 0;
	}
	public get childrenLength(): number {
		return 0;
	}
	public getChild(idx: number): AstNode | null {
		return null;
	}
	public get children(): readonly AstNode[] {
		return emptyArray;
	}

	public flattenLists(): this & AstNode {
		return this as this & AstNode;
	}
	public deepClone(): this & AstNode {
		return this as this & AstNode;
	}
}

export class TextAstNode extends ImmutableLeafAstNode {
	public get kind(): AstNodeKind.Text {
		return AstNodeKind.Text;
	}
	public get missingOpeningBracketIds(): SmallImmutableSet<OpeningBracketId> {
		return SmallImmutableSet.getEmpty();
	}

	public canBeReused(_openedBracketIds: SmallImmutableSet<OpeningBracketId>) {
		return true;
	}

	public computeMinIndentation(offset: Length, textModel: ITextModel): number {
		const start = lengthToObj(offset);
		// Text ast nodes don't have partial indentation (ensured by the tokenizer).
		// Thus, if this text node does not start at column 0, the first line cannot have any indentation at all.
		const startLineNumber = (start.columnCount === 0 ? start.lineCount : start.lineCount + 1) + 1;
		const endLineNumber = lengthGetLineCount(lengthAdd(offset, this.length)) + 1;

		let result = Number.MAX_SAFE_INTEGER;

		for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
			const firstNonWsColumn = textModel.getLineFirstNonWhitespaceColumn(lineNumber);
			const lineContent = textModel.getLineContent(lineNumber);
			if (firstNonWsColumn === 0) {
				continue;
			}

			const visibleColumn = CursorColumns.visibleColumnFromColumn(lineContent, firstNonWsColumn, textModel.getOptions().tabSize);
			result = Math.min(result, visibleColumn);
		}

		return result;
	}
}

export class BracketAstNode extends ImmutableLeafAstNode {
	public static create(
		length: Length,
		bracketInfo: BracketKind,
		bracketIds: SmallImmutableSet<OpeningBracketId>
	): BracketAstNode {
		const node = new BracketAstNode(length, bracketInfo, bracketIds);
		return node;
	}

	public get kind(): AstNodeKind.Bracket {
		return AstNodeKind.Bracket;
	}

	public get missingOpeningBracketIds(): SmallImmutableSet<OpeningBracketId> {
		return SmallImmutableSet.getEmpty();
	}

	private constructor(
		length: Length,
		public readonly bracketInfo: BracketKind,
		/**
		 * In case of a opening bracket, this is the id of the opening bracket.
		 * In case of a closing bracket, this contains the ids of all opening brackets it can close.
		*/
		public readonly bracketIds: SmallImmutableSet<OpeningBracketId>
	) {
		super(length);
	}

	public get text() {
		return this.bracketInfo.bracketText;
	}

	public get languageId() {
		return this.bracketInfo.languageId;
	}

	public canBeReused(_openedBracketIds: SmallImmutableSet<OpeningBracketId>) {
		// These nodes could be reused,
		// but not in a general way.
		// Their parent may be reused.
		return false;
	}

	public computeMinIndentation(offset: Length, textModel: ITextModel): number {
		return Number.MAX_SAFE_INTEGER;
	}
}

export class InvalidBracketAstNode extends ImmutableLeafAstNode {
	public get kind(): AstNodeKind.UnexpectedClosingBracket {
		return AstNodeKind.UnexpectedClosingBracket;
	}

	public readonly missingOpeningBracketIds: SmallImmutableSet<OpeningBracketId>;

	public constructor(closingBrackets: SmallImmutableSet<OpeningBracketId>, length: Length) {
		super(length);
		this.missingOpeningBracketIds = closingBrackets;
	}

	public canBeReused(openedBracketIds: SmallImmutableSet<OpeningBracketId>) {
		return !openedBracketIds.intersects(this.missingOpeningBracketIds);
	}

	public computeMinIndentation(offset: Length, textModel: ITextModel): number {
		return Number.MAX_SAFE_INTEGER;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/beforeEditPositionMapper.ts]---
Location: vscode-main/src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/beforeEditPositionMapper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Range } from '../../../core/range.js';
import { Length, lengthAdd, lengthDiffNonNegative, lengthLessThanEqual, lengthOfString, lengthToObj, positionToLength, toLength } from './length.js';
import { TextLength } from '../../../core/text/textLength.js';
import { IModelContentChange } from '../../mirrorTextModel.js';

export class TextEditInfo {
	public static fromModelContentChanges(changes: IModelContentChange[]): TextEditInfo[] {
		// Must be sorted in ascending order
		const edits = changes.map(c => {
			const range = Range.lift(c.range);
			return new TextEditInfo(
				positionToLength(range.getStartPosition()),
				positionToLength(range.getEndPosition()),
				lengthOfString(c.text)
			);
		}).reverse();
		return edits;
	}

	constructor(
		public readonly startOffset: Length,
		public readonly endOffset: Length,
		public readonly newLength: Length
	) {
	}

	toString(): string {
		return `[${lengthToObj(this.startOffset)}...${lengthToObj(this.endOffset)}) -> ${lengthToObj(this.newLength)}`;
	}
}

export class BeforeEditPositionMapper {
	private nextEditIdx = 0;
	private deltaOldToNewLineCount = 0;
	private deltaOldToNewColumnCount = 0;
	private deltaLineIdxInOld = -1;
	private readonly edits: readonly TextEditInfoCache[];

	/**
	 * @param edits Must be sorted by offset in ascending order.
	*/
	constructor(
		edits: readonly TextEditInfo[],
	) {
		this.edits = edits.map(edit => TextEditInfoCache.from(edit));
	}

	/**
	 * @param offset Must be equal to or greater than the last offset this method has been called with.
	*/
	getOffsetBeforeChange(offset: Length): Length {
		this.adjustNextEdit(offset);
		return this.translateCurToOld(offset);
	}

	/**
	 * @param offset Must be equal to or greater than the last offset this method has been called with.
	 * Returns null if there is no edit anymore.
	*/
	getDistanceToNextChange(offset: Length): Length | null {
		this.adjustNextEdit(offset);

		const nextEdit = this.edits[this.nextEditIdx];
		const nextChangeOffset = nextEdit ? this.translateOldToCur(nextEdit.offsetObj) : null;
		if (nextChangeOffset === null) {
			return null;
		}

		return lengthDiffNonNegative(offset, nextChangeOffset);
	}

	private translateOldToCur(oldOffsetObj: TextLength): Length {
		if (oldOffsetObj.lineCount === this.deltaLineIdxInOld) {
			return toLength(oldOffsetObj.lineCount + this.deltaOldToNewLineCount, oldOffsetObj.columnCount + this.deltaOldToNewColumnCount);
		} else {
			return toLength(oldOffsetObj.lineCount + this.deltaOldToNewLineCount, oldOffsetObj.columnCount);
		}
	}

	private translateCurToOld(newOffset: Length): Length {
		const offsetObj = lengthToObj(newOffset);
		if (offsetObj.lineCount - this.deltaOldToNewLineCount === this.deltaLineIdxInOld) {
			return toLength(offsetObj.lineCount - this.deltaOldToNewLineCount, offsetObj.columnCount - this.deltaOldToNewColumnCount);
		} else {
			return toLength(offsetObj.lineCount - this.deltaOldToNewLineCount, offsetObj.columnCount);
		}
	}

	private adjustNextEdit(offset: Length) {
		while (this.nextEditIdx < this.edits.length) {
			const nextEdit = this.edits[this.nextEditIdx];

			// After applying the edit, what is its end offset (considering all previous edits)?
			const nextEditEndOffsetInCur = this.translateOldToCur(nextEdit.endOffsetAfterObj);

			if (lengthLessThanEqual(nextEditEndOffsetInCur, offset)) {
				// We are after the edit, skip it
				this.nextEditIdx++;

				const nextEditEndOffsetInCurObj = lengthToObj(nextEditEndOffsetInCur);

				// Before applying the edit, what is its end offset (considering all previous edits)?
				const nextEditEndOffsetBeforeInCurObj = lengthToObj(this.translateOldToCur(nextEdit.endOffsetBeforeObj));

				const lineDelta = nextEditEndOffsetInCurObj.lineCount - nextEditEndOffsetBeforeInCurObj.lineCount;
				this.deltaOldToNewLineCount += lineDelta;

				const previousColumnDelta = this.deltaLineIdxInOld === nextEdit.endOffsetBeforeObj.lineCount ? this.deltaOldToNewColumnCount : 0;
				const columnDelta = nextEditEndOffsetInCurObj.columnCount - nextEditEndOffsetBeforeInCurObj.columnCount;
				this.deltaOldToNewColumnCount = previousColumnDelta + columnDelta;
				this.deltaLineIdxInOld = nextEdit.endOffsetBeforeObj.lineCount;
			} else {
				// We are in or before the edit.
				break;
			}
		}
	}
}

class TextEditInfoCache {
	static from(edit: TextEditInfo): TextEditInfoCache {
		return new TextEditInfoCache(edit.startOffset, edit.endOffset, edit.newLength);
	}

	public readonly endOffsetBeforeObj: TextLength;
	public readonly endOffsetAfterObj: TextLength;
	public readonly offsetObj: TextLength;

	constructor(
		startOffset: Length,
		endOffset: Length,
		textLength: Length,
	) {
		this.endOffsetBeforeObj = lengthToObj(endOffset);
		this.endOffsetAfterObj = lengthToObj(lengthAdd(startOffset, textLength));
		this.offsetObj = lengthToObj(startOffset);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/bracketPairsTree.ts]---
Location: vscode-main/src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/bracketPairsTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { Range } from '../../../core/range.js';
import { ITextModel } from '../../../model.js';
import { BracketInfo, BracketPairWithMinIndentationInfo, IFoundBracket } from '../../../textModelBracketPairs.js';
import { TextModel } from '../../textModel.js';
import { IModelContentChangedEvent, IModelTokensChangedEvent } from '../../../textModelEvents.js';
import { ResolvedLanguageConfiguration } from '../../../languages/languageConfigurationRegistry.js';
import { AstNode, AstNodeKind } from './ast.js';
import { TextEditInfo } from './beforeEditPositionMapper.js';
import { LanguageAgnosticBracketTokens } from './brackets.js';
import { Length, lengthAdd, lengthGreaterThanEqual, lengthLessThan, lengthLessThanEqual, lengthsToRange, lengthZero, positionToLength, toLength } from './length.js';
import { parseDocument } from './parser.js';
import { DenseKeyProvider } from './smallImmutableSet.js';
import { FastTokenizer, TextBufferTokenizer } from './tokenizer.js';
import { BackgroundTokenizationState } from '../../../tokenizationTextModelPart.js';
import { Position } from '../../../core/position.js';
import { CallbackIterable } from '../../../../../base/common/arrays.js';
import { combineTextEditInfos } from './combineTextEditInfos.js';
import { ClosingBracketKind, OpeningBracketKind } from '../../../languages/supports/languageBracketsConfiguration.js';

export class BracketPairsTree extends Disposable {
	private readonly didChangeEmitter;

	/*
		There are two trees:
		* The initial tree that has no token information and is used for performant initial bracket colorization.
		* The tree that used token information to detect bracket pairs.

		To prevent flickering, we only switch from the initial tree to tree with token information
		when tokenization completes.
		Since the text can be edited while background tokenization is in progress, we need to update both trees.
	*/
	private initialAstWithoutTokens: AstNode | undefined;
	private astWithTokens: AstNode | undefined;

	private readonly denseKeyProvider;
	private readonly brackets;

	public didLanguageChange(languageId: string): boolean {
		return this.brackets.didLanguageChange(languageId);
	}

	public readonly onDidChange;
	private queuedTextEditsForInitialAstWithoutTokens: TextEditInfo[];
	private queuedTextEdits: TextEditInfo[];

	public constructor(
		private readonly textModel: TextModel,
		private readonly getLanguageConfiguration: (languageId: string) => ResolvedLanguageConfiguration
	) {
		super();
		this.didChangeEmitter = new Emitter<void>();
		this.denseKeyProvider = new DenseKeyProvider<string>();
		this.brackets = new LanguageAgnosticBracketTokens(this.denseKeyProvider, this.getLanguageConfiguration);
		this.onDidChange = this.didChangeEmitter.event;
		this.queuedTextEditsForInitialAstWithoutTokens = [];
		this.queuedTextEdits = [];

		if (!textModel.tokenization.hasTokens) {
			const brackets = this.brackets.getSingleLanguageBracketTokens(this.textModel.getLanguageId());
			const tokenizer = new FastTokenizer(this.textModel.getValue(), brackets);
			this.initialAstWithoutTokens = parseDocument(tokenizer, [], undefined, true);
			this.astWithTokens = this.initialAstWithoutTokens;
		} else if (textModel.tokenization.backgroundTokenizationState === BackgroundTokenizationState.Completed) {
			// Skip the initial ast, as there is no flickering.
			// Directly create the tree with token information.
			this.initialAstWithoutTokens = undefined;
			this.astWithTokens = this.parseDocumentFromTextBuffer([], undefined, false);
		} else {
			// We missed some token changes already, so we cannot use the fast tokenizer + delta increments
			this.initialAstWithoutTokens = this.parseDocumentFromTextBuffer([], undefined, true);
			this.astWithTokens = this.initialAstWithoutTokens;
		}
	}

	//#region TextModel events

	public handleDidChangeBackgroundTokenizationState(): void {
		if (this.textModel.tokenization.backgroundTokenizationState === BackgroundTokenizationState.Completed) {
			const wasUndefined = this.initialAstWithoutTokens === undefined;
			// Clear the initial tree as we can use the tree with token information now.
			this.initialAstWithoutTokens = undefined;
			if (!wasUndefined) {
				this.didChangeEmitter.fire();
			}
		}
	}

	public handleDidChangeTokens({ ranges }: IModelTokensChangedEvent): void {
		const edits = ranges.map(r =>
			new TextEditInfo(
				toLength(r.fromLineNumber - 1, 0),
				toLength(r.toLineNumber, 0),
				toLength(r.toLineNumber - r.fromLineNumber + 1, 0)
			)
		);

		this.handleEdits(edits, true);

		if (!this.initialAstWithoutTokens) {
			this.didChangeEmitter.fire();
		}
	}

	public handleContentChanged(change: IModelContentChangedEvent) {
		const edits = TextEditInfo.fromModelContentChanges(change.changes);
		this.handleEdits(edits, false);
	}

	private handleEdits(edits: TextEditInfo[], tokenChange: boolean): void {
		// Lazily queue the edits and only apply them when the tree is accessed.
		const result = combineTextEditInfos(this.queuedTextEdits, edits);

		this.queuedTextEdits = result;
		if (this.initialAstWithoutTokens && !tokenChange) {
			this.queuedTextEditsForInitialAstWithoutTokens = combineTextEditInfos(this.queuedTextEditsForInitialAstWithoutTokens, edits);
		}
	}

	//#endregion

	private flushQueue() {
		if (this.queuedTextEdits.length > 0) {
			this.astWithTokens = this.parseDocumentFromTextBuffer(this.queuedTextEdits, this.astWithTokens, false);
			this.queuedTextEdits = [];
		}
		if (this.queuedTextEditsForInitialAstWithoutTokens.length > 0) {
			if (this.initialAstWithoutTokens) {
				this.initialAstWithoutTokens = this.parseDocumentFromTextBuffer(this.queuedTextEditsForInitialAstWithoutTokens, this.initialAstWithoutTokens, false);
			}
			this.queuedTextEditsForInitialAstWithoutTokens = [];
		}
	}

	/**
	 * @pure (only if isPure = true)
	*/
	private parseDocumentFromTextBuffer(edits: TextEditInfo[], previousAst: AstNode | undefined, immutable: boolean): AstNode {
		// Is much faster if `isPure = false`.
		const isPure = false;
		const previousAstClone = isPure ? previousAst?.deepClone() : previousAst;
		const tokenizer = new TextBufferTokenizer(this.textModel, this.brackets);
		const result = parseDocument(tokenizer, edits, previousAstClone, immutable);
		return result;
	}

	public getBracketsInRange(range: Range, onlyColorizedBrackets: boolean): CallbackIterable<BracketInfo> {
		this.flushQueue();

		const startOffset = toLength(range.startLineNumber - 1, range.startColumn - 1);
		const endOffset = toLength(range.endLineNumber - 1, range.endColumn - 1);
		return new CallbackIterable(cb => {
			const node = this.initialAstWithoutTokens || this.astWithTokens!;
			collectBrackets(node, lengthZero, node.length, startOffset, endOffset, cb, 0, 0, new Map(), onlyColorizedBrackets);
		});
	}

	public getBracketPairsInRange(range: Range, includeMinIndentation: boolean): CallbackIterable<BracketPairWithMinIndentationInfo> {
		this.flushQueue();

		const startLength = positionToLength(range.getStartPosition());
		const endLength = positionToLength(range.getEndPosition());

		return new CallbackIterable(cb => {
			const node = this.initialAstWithoutTokens || this.astWithTokens!;
			const context = new CollectBracketPairsContext(cb, includeMinIndentation, this.textModel);
			collectBracketPairs(node, lengthZero, node.length, startLength, endLength, context, 0, new Map());
		});
	}

	public getFirstBracketAfter(position: Position): IFoundBracket | null {
		this.flushQueue();

		const node = this.initialAstWithoutTokens || this.astWithTokens!;
		return getFirstBracketAfter(node, lengthZero, node.length, positionToLength(position));
	}

	public getFirstBracketBefore(position: Position): IFoundBracket | null {
		this.flushQueue();

		const node = this.initialAstWithoutTokens || this.astWithTokens!;
		return getFirstBracketBefore(node, lengthZero, node.length, positionToLength(position));
	}
}

function getFirstBracketBefore(node: AstNode, nodeOffsetStart: Length, nodeOffsetEnd: Length, position: Length): IFoundBracket | null {
	if (node.kind === AstNodeKind.List || node.kind === AstNodeKind.Pair) {
		const lengths: { nodeOffsetStart: Length; nodeOffsetEnd: Length }[] = [];
		for (const child of node.children) {
			nodeOffsetEnd = lengthAdd(nodeOffsetStart, child.length);
			lengths.push({ nodeOffsetStart, nodeOffsetEnd });
			nodeOffsetStart = nodeOffsetEnd;
		}
		for (let i = lengths.length - 1; i >= 0; i--) {
			const { nodeOffsetStart, nodeOffsetEnd } = lengths[i];
			if (lengthLessThan(nodeOffsetStart, position)) {
				const result = getFirstBracketBefore(node.children[i], nodeOffsetStart, nodeOffsetEnd, position);
				if (result) {
					return result;
				}
			}
		}
		return null;
	} else if (node.kind === AstNodeKind.UnexpectedClosingBracket) {
		return null;
	} else if (node.kind === AstNodeKind.Bracket) {
		const range = lengthsToRange(nodeOffsetStart, nodeOffsetEnd);
		return {
			bracketInfo: node.bracketInfo,
			range
		};
	}
	return null;
}

function getFirstBracketAfter(node: AstNode, nodeOffsetStart: Length, nodeOffsetEnd: Length, position: Length): IFoundBracket | null {
	if (node.kind === AstNodeKind.List || node.kind === AstNodeKind.Pair) {
		for (const child of node.children) {
			nodeOffsetEnd = lengthAdd(nodeOffsetStart, child.length);
			if (lengthLessThan(position, nodeOffsetEnd)) {
				const result = getFirstBracketAfter(child, nodeOffsetStart, nodeOffsetEnd, position);
				if (result) {
					return result;
				}
			}
			nodeOffsetStart = nodeOffsetEnd;
		}
		return null;
	} else if (node.kind === AstNodeKind.UnexpectedClosingBracket) {
		return null;
	} else if (node.kind === AstNodeKind.Bracket) {
		const range = lengthsToRange(nodeOffsetStart, nodeOffsetEnd);
		return {
			bracketInfo: node.bracketInfo,
			range
		};
	}
	return null;
}

function collectBrackets(
	node: AstNode,
	nodeOffsetStart: Length,
	nodeOffsetEnd: Length,
	startOffset: Length,
	endOffset: Length,
	push: (item: BracketInfo) => boolean,
	level: number,
	nestingLevelOfEqualBracketType: number,
	levelPerBracketType: Map<string, number>,
	onlyColorizedBrackets: boolean,
	parentPairIsIncomplete: boolean = false,
): boolean {
	if (level > 200) {
		return true;
	}

	whileLoop:
	while (true) {
		switch (node.kind) {
			case AstNodeKind.List: {
				const childCount = node.childrenLength;
				for (let i = 0; i < childCount; i++) {
					const child = node.getChild(i);
					if (!child) {
						continue;
					}
					nodeOffsetEnd = lengthAdd(nodeOffsetStart, child.length);
					if (
						lengthLessThanEqual(nodeOffsetStart, endOffset) &&
						lengthGreaterThanEqual(nodeOffsetEnd, startOffset)
					) {
						const childEndsAfterEnd = lengthGreaterThanEqual(nodeOffsetEnd, endOffset);
						if (childEndsAfterEnd) {
							// No child after this child in the requested window, don't recurse
							node = child;
							continue whileLoop;
						}

						const shouldContinue = collectBrackets(child, nodeOffsetStart, nodeOffsetEnd, startOffset, endOffset, push, level, 0, levelPerBracketType, onlyColorizedBrackets);
						if (!shouldContinue) {
							return false;
						}
					}
					nodeOffsetStart = nodeOffsetEnd;
				}
				return true;
			}
			case AstNodeKind.Pair: {
				const colorize = !onlyColorizedBrackets || !node.closingBracket || (node.closingBracket.bracketInfo as ClosingBracketKind).closesColorized(node.openingBracket.bracketInfo as OpeningBracketKind);

				let levelPerBracket = 0;
				if (levelPerBracketType) {
					let existing = levelPerBracketType.get(node.openingBracket.text);
					if (existing === undefined) {
						existing = 0;
					}
					levelPerBracket = existing;
					if (colorize) {
						existing++;
						levelPerBracketType.set(node.openingBracket.text, existing);
					}
				}

				const childCount = node.childrenLength;
				for (let i = 0; i < childCount; i++) {
					const child = node.getChild(i);
					if (!child) {
						continue;
					}
					nodeOffsetEnd = lengthAdd(nodeOffsetStart, child.length);
					if (
						lengthLessThanEqual(nodeOffsetStart, endOffset) &&
						lengthGreaterThanEqual(nodeOffsetEnd, startOffset)
					) {
						const childEndsAfterEnd = lengthGreaterThanEqual(nodeOffsetEnd, endOffset);
						if (childEndsAfterEnd && child.kind !== AstNodeKind.Bracket) {
							// No child after this child in the requested window, don't recurse
							// Don't do this for brackets because of unclosed/unopened brackets
							node = child;
							if (colorize) {
								level++;
								nestingLevelOfEqualBracketType = levelPerBracket + 1;
							} else {
								nestingLevelOfEqualBracketType = levelPerBracket;
							}
							continue whileLoop;
						}

						if (colorize || child.kind !== AstNodeKind.Bracket || !node.closingBracket) {
							const shouldContinue = collectBrackets(
								child,
								nodeOffsetStart,
								nodeOffsetEnd,
								startOffset,
								endOffset,
								push,
								colorize ? level + 1 : level,
								colorize ? levelPerBracket + 1 : levelPerBracket,
								levelPerBracketType,
								onlyColorizedBrackets,
								!node.closingBracket,
							);
							if (!shouldContinue) {
								return false;
							}
						}
					}
					nodeOffsetStart = nodeOffsetEnd;
				}

				levelPerBracketType?.set(node.openingBracket.text, levelPerBracket);

				return true;
			}
			case AstNodeKind.UnexpectedClosingBracket: {
				const range = lengthsToRange(nodeOffsetStart, nodeOffsetEnd);
				return push(new BracketInfo(range, level - 1, 0, true));
			}
			case AstNodeKind.Bracket: {
				const range = lengthsToRange(nodeOffsetStart, nodeOffsetEnd);
				return push(new BracketInfo(range, level - 1, nestingLevelOfEqualBracketType - 1, parentPairIsIncomplete));
			}
			case AstNodeKind.Text:
				return true;
		}
	}
}

class CollectBracketPairsContext {
	constructor(
		public readonly push: (item: BracketPairWithMinIndentationInfo) => boolean,
		public readonly includeMinIndentation: boolean,
		public readonly textModel: ITextModel,
	) {
	}
}

function collectBracketPairs(
	node: AstNode,
	nodeOffsetStart: Length,
	nodeOffsetEnd: Length,
	startOffset: Length,
	endOffset: Length,
	context: CollectBracketPairsContext,
	level: number,
	levelPerBracketType: Map<string, number>
): boolean {
	if (level > 200) {
		return true;
	}

	let shouldContinue = true;

	if (node.kind === AstNodeKind.Pair) {
		let levelPerBracket = 0;
		if (levelPerBracketType) {
			let existing = levelPerBracketType.get(node.openingBracket.text);
			if (existing === undefined) {
				existing = 0;
			}
			levelPerBracket = existing;
			existing++;
			levelPerBracketType.set(node.openingBracket.text, existing);
		}

		const openingBracketEnd = lengthAdd(nodeOffsetStart, node.openingBracket.length);
		let minIndentation = -1;
		if (context.includeMinIndentation) {
			minIndentation = node.computeMinIndentation(
				nodeOffsetStart,
				context.textModel
			);
		}

		shouldContinue = context.push(
			new BracketPairWithMinIndentationInfo(
				lengthsToRange(nodeOffsetStart, nodeOffsetEnd),
				lengthsToRange(nodeOffsetStart, openingBracketEnd),
				node.closingBracket
					? lengthsToRange(
						lengthAdd(openingBracketEnd, node.child?.length || lengthZero),
						nodeOffsetEnd
					)
					: undefined,
				level,
				levelPerBracket,
				node,
				minIndentation
			)
		);

		nodeOffsetStart = openingBracketEnd;
		if (shouldContinue && node.child) {
			const child = node.child;
			nodeOffsetEnd = lengthAdd(nodeOffsetStart, child.length);
			if (
				lengthLessThanEqual(nodeOffsetStart, endOffset) &&
				lengthGreaterThanEqual(nodeOffsetEnd, startOffset)
			) {
				shouldContinue = collectBracketPairs(
					child,
					nodeOffsetStart,
					nodeOffsetEnd,
					startOffset,
					endOffset,
					context,
					level + 1,
					levelPerBracketType
				);
				if (!shouldContinue) {
					return false;
				}
			}
		}

		levelPerBracketType?.set(node.openingBracket.text, levelPerBracket);
	} else {
		let curOffset = nodeOffsetStart;
		for (const child of node.children) {
			const childOffset = curOffset;
			curOffset = lengthAdd(curOffset, child.length);

			if (
				lengthLessThanEqual(childOffset, endOffset) &&
				lengthLessThanEqual(startOffset, curOffset)
			) {
				shouldContinue = collectBracketPairs(
					child,
					childOffset,
					curOffset,
					startOffset,
					endOffset,
					context,
					level,
					levelPerBracketType
				);
				if (!shouldContinue) {
					return false;
				}
			}
		}
	}
	return shouldContinue;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/brackets.ts]---
Location: vscode-main/src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/brackets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { escapeRegExpCharacters } from '../../../../../base/common/strings.js';
import { ResolvedLanguageConfiguration } from '../../../languages/languageConfigurationRegistry.js';
import { BracketKind } from '../../../languages/supports/languageBracketsConfiguration.js';
import { BracketAstNode } from './ast.js';
import { toLength } from './length.js';
import { DenseKeyProvider, identityKeyProvider, SmallImmutableSet } from './smallImmutableSet.js';
import { OpeningBracketId, Token, TokenKind } from './tokenizer.js';

export class BracketTokens {
	static createFromLanguage(configuration: ResolvedLanguageConfiguration, denseKeyProvider: DenseKeyProvider<string>): BracketTokens {
		function getId(bracketInfo: BracketKind): OpeningBracketId {
			return denseKeyProvider.getKey(`${bracketInfo.languageId}:::${bracketInfo.bracketText}`);
		}

		const map = new Map<string, Token>();
		for (const openingBracket of configuration.bracketsNew.openingBrackets) {
			const length = toLength(0, openingBracket.bracketText.length);
			const openingTextId = getId(openingBracket);
			const bracketIds = SmallImmutableSet.getEmpty().add(openingTextId, identityKeyProvider);
			map.set(openingBracket.bracketText, new Token(
				length,
				TokenKind.OpeningBracket,
				openingTextId,
				bracketIds,
				BracketAstNode.create(length, openingBracket, bracketIds)
			));
		}

		for (const closingBracket of configuration.bracketsNew.closingBrackets) {
			const length = toLength(0, closingBracket.bracketText.length);
			let bracketIds = SmallImmutableSet.getEmpty();
			const closingBrackets = closingBracket.getOpeningBrackets();
			for (const bracket of closingBrackets) {
				bracketIds = bracketIds.add(getId(bracket), identityKeyProvider);
			}
			map.set(closingBracket.bracketText, new Token(
				length,
				TokenKind.ClosingBracket,
				getId(closingBrackets[0]),
				bracketIds,
				BracketAstNode.create(length, closingBracket, bracketIds)
			));
		}

		return new BracketTokens(map);
	}

	private hasRegExp = false;
	private _regExpGlobal: RegExp | null = null;

	constructor(
		private readonly map: Map<string, Token>
	) { }

	getRegExpStr(): string | null {
		if (this.isEmpty) {
			return null;
		} else {
			const keys = [...this.map.keys()];
			keys.sort();
			keys.reverse();
			return keys.map(k => prepareBracketForRegExp(k)).join('|');
		}
	}

	/**
	 * Returns null if there is no such regexp (because there are no brackets).
	*/
	get regExpGlobal(): RegExp | null {
		if (!this.hasRegExp) {
			const regExpStr = this.getRegExpStr();
			this._regExpGlobal = regExpStr ? new RegExp(regExpStr, 'gi') : null;
			this.hasRegExp = true;
		}
		return this._regExpGlobal;
	}

	getToken(value: string): Token | undefined {
		return this.map.get(value.toLowerCase());
	}

	findClosingTokenText(openingBracketIds: SmallImmutableSet<OpeningBracketId>): string | undefined {
		for (const [closingText, info] of this.map) {
			if (info.kind === TokenKind.ClosingBracket && info.bracketIds.intersects(openingBracketIds)) {
				return closingText;
			}
		}
		return undefined;
	}

	get isEmpty(): boolean {
		return this.map.size === 0;
	}
}

function prepareBracketForRegExp(str: string): string {
	let escaped = escapeRegExpCharacters(str);
	// These bracket pair delimiters start or end with letters
	// see https://github.com/microsoft/vscode/issues/132162 https://github.com/microsoft/vscode/issues/150440
	if (/^[\w ]+/.test(str)) {
		escaped = `\\b${escaped}`;
	}
	if (/[\w ]+$/.test(str)) {
		escaped = `${escaped}\\b`;
	}
	return escaped;
}

export class LanguageAgnosticBracketTokens {
	private readonly languageIdToBracketTokens = new Map<string, BracketTokens>();

	constructor(
		private readonly denseKeyProvider: DenseKeyProvider<string>,
		private readonly getLanguageConfiguration: (languageId: string) => ResolvedLanguageConfiguration,
	) {
	}

	public didLanguageChange(languageId: string): boolean {
		// Report a change whenever the language configuration updates.
		return this.languageIdToBracketTokens.has(languageId);
	}

	getSingleLanguageBracketTokens(languageId: string): BracketTokens {
		let singleLanguageBracketTokens = this.languageIdToBracketTokens.get(languageId);
		if (!singleLanguageBracketTokens) {
			singleLanguageBracketTokens = BracketTokens.createFromLanguage(this.getLanguageConfiguration(languageId), this.denseKeyProvider);
			this.languageIdToBracketTokens.set(languageId, singleLanguageBracketTokens);
		}
		return singleLanguageBracketTokens;
	}

	getToken(value: string, languageId: string): Token | undefined {
		const singleLanguageBracketTokens = this.getSingleLanguageBracketTokens(languageId);
		return singleLanguageBracketTokens.getToken(value);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/combineTextEditInfos.ts]---
Location: vscode-main/src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/combineTextEditInfos.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ArrayQueue } from '../../../../../base/common/arrays.js';
import { TextEditInfo } from './beforeEditPositionMapper.js';
import { Length, lengthAdd, lengthDiffNonNegative, lengthEquals, lengthIsZero, lengthToObj, lengthZero, sumLengths } from './length.js';

export function combineTextEditInfos(textEditInfoFirst: TextEditInfo[], textEditInfoSecond: TextEditInfo[]): TextEditInfo[] {
	if (textEditInfoFirst.length === 0) {
		return textEditInfoSecond;
	}
	if (textEditInfoSecond.length === 0) {
		return textEditInfoFirst;
	}

	// s0: State before any edits
	const s0ToS1Map = new ArrayQueue(toLengthMapping(textEditInfoFirst));
	// s1: State after first edit, but before second edit
	const s1ToS2Map = toLengthMapping(textEditInfoSecond) as (LengthMapping | { lengthBefore: undefined; lengthAfter: undefined; modified: false })[];
	s1ToS2Map.push({ modified: false, lengthBefore: undefined, lengthAfter: undefined }); // Copy everything from old to new
	// s2: State after both edits

	let curItem: LengthMapping | undefined = s0ToS1Map.dequeue();

	/**
	 * @param s1Length Use undefined for length "infinity"
	 */
	function nextS0ToS1MapWithS1LengthOf(s1Length: Length | undefined): LengthMapping[] {
		if (s1Length === undefined) {
			const arr = s0ToS1Map.takeWhile(v => true) || [];
			if (curItem) {
				arr.unshift(curItem);
			}
			return arr;
		}

		const result: LengthMapping[] = [];
		while (curItem && !lengthIsZero(s1Length)) {
			const [item, remainingItem] = curItem.splitAt(s1Length);
			result.push(item);
			s1Length = lengthDiffNonNegative(item.lengthAfter, s1Length);
			curItem = remainingItem ?? s0ToS1Map.dequeue();
		}
		if (!lengthIsZero(s1Length)) {
			result.push(new LengthMapping(false, s1Length, s1Length));
		}
		return result;
	}

	const result: TextEditInfo[] = [];

	function pushEdit(startOffset: Length, endOffset: Length, newLength: Length): void {
		if (result.length > 0 && lengthEquals(result[result.length - 1].endOffset, startOffset)) {
			const lastResult = result[result.length - 1];
			result[result.length - 1] = new TextEditInfo(lastResult.startOffset, endOffset, lengthAdd(lastResult.newLength, newLength));
		} else {
			result.push({ startOffset, endOffset, newLength });
		}
	}

	let s0offset = lengthZero;
	for (const s1ToS2 of s1ToS2Map) {
		const s0ToS1Map = nextS0ToS1MapWithS1LengthOf(s1ToS2.lengthBefore);
		if (s1ToS2.modified) {
			const s0Length = sumLengths(s0ToS1Map, s => s.lengthBefore);
			const s0EndOffset = lengthAdd(s0offset, s0Length);
			pushEdit(s0offset, s0EndOffset, s1ToS2.lengthAfter);
			s0offset = s0EndOffset;
		} else {
			for (const s1 of s0ToS1Map) {
				const s0startOffset = s0offset;
				s0offset = lengthAdd(s0offset, s1.lengthBefore);
				if (s1.modified) {
					pushEdit(s0startOffset, s0offset, s1.lengthAfter);
				}
			}
		}
	}

	return result;
}

class LengthMapping {
	constructor(
		/**
		 * If false, length before and length after equal.
		 */
		public readonly modified: boolean,
		public readonly lengthBefore: Length,
		public readonly lengthAfter: Length,
	) {
	}

	splitAt(lengthAfter: Length): [LengthMapping, LengthMapping | undefined] {
		const remainingLengthAfter = lengthDiffNonNegative(lengthAfter, this.lengthAfter);
		if (lengthEquals(remainingLengthAfter, lengthZero)) {
			return [this, undefined];
		} else if (this.modified) {
			return [
				new LengthMapping(this.modified, this.lengthBefore, lengthAfter),
				new LengthMapping(this.modified, lengthZero, remainingLengthAfter)
			];
		} else {
			return [
				new LengthMapping(this.modified, lengthAfter, lengthAfter),
				new LengthMapping(this.modified, remainingLengthAfter, remainingLengthAfter)
			];
		}
	}

	toString(): string {
		return `${this.modified ? 'M' : 'U'}:${lengthToObj(this.lengthBefore)} -> ${lengthToObj(this.lengthAfter)}`;
	}
}

function toLengthMapping(textEditInfos: TextEditInfo[]): LengthMapping[] {
	const result: LengthMapping[] = [];
	let lastOffset = lengthZero;
	for (const textEditInfo of textEditInfos) {
		const spaceLength = lengthDiffNonNegative(lastOffset, textEditInfo.startOffset);
		if (!lengthIsZero(spaceLength)) {
			result.push(new LengthMapping(false, spaceLength, spaceLength));
		}

		const lengthBefore = lengthDiffNonNegative(textEditInfo.startOffset, textEditInfo.endOffset);
		result.push(new LengthMapping(true, lengthBefore, textEditInfo.newLength));
		lastOffset = textEditInfo.endOffset;
	}
	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/concat23Trees.ts]---
Location: vscode-main/src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/concat23Trees.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AstNode, AstNodeKind, ListAstNode } from './ast.js';

/**
 * Concatenates a list of (2,3) AstNode's into a single (2,3) AstNode.
 * This mutates the items of the input array!
 * If all items have the same height, this method has runtime O(items.length).
 * Otherwise, it has runtime O(items.length * max(log(items.length), items.max(i => i.height))).
*/
export function concat23Trees(items: AstNode[]): AstNode | null {
	if (items.length === 0) {
		return null;
	}
	if (items.length === 1) {
		return items[0];
	}

	let i = 0;
	/**
	 * Reads nodes of same height and concatenates them to a single node.
	*/
	function readNode(): AstNode | null {
		if (i >= items.length) {
			return null;
		}
		const start = i;
		const height = items[start].listHeight;

		i++;
		while (i < items.length && items[i].listHeight === height) {
			i++;
		}

		if (i - start >= 2) {
			return concat23TreesOfSameHeight(start === 0 && i === items.length ? items : items.slice(start, i), false);
		} else {
			return items[start];
		}
	}

	// The items might not have the same height.
	// We merge all items by using a binary concat operator.
	let first = readNode()!; // There must be a first item
	let second = readNode();
	if (!second) {
		return first;
	}

	for (let item = readNode(); item; item = readNode()) {
		// Prefer concatenating smaller trees, as the runtime of concat depends on the tree height.
		if (heightDiff(first, second) <= heightDiff(second, item)) {
			first = concat(first, second);
			second = item;
		} else {
			second = concat(second, item);
		}
	}

	const result = concat(first, second);
	return result;
}

export function concat23TreesOfSameHeight(items: AstNode[], createImmutableLists: boolean = false): AstNode | null {
	if (items.length === 0) {
		return null;
	}
	if (items.length === 1) {
		return items[0];
	}

	let length = items.length;
	// All trees have same height, just create parent nodes.
	while (length > 3) {
		const newLength = length >> 1;
		for (let i = 0; i < newLength; i++) {
			const j = i << 1;
			items[i] = ListAstNode.create23(items[j], items[j + 1], j + 3 === length ? items[j + 2] : null, createImmutableLists);
		}
		length = newLength;
	}
	return ListAstNode.create23(items[0], items[1], length >= 3 ? items[2] : null, createImmutableLists);
}

function heightDiff(node1: AstNode, node2: AstNode): number {
	return Math.abs(node1.listHeight - node2.listHeight);
}

function concat(node1: AstNode, node2: AstNode): AstNode {
	if (node1.listHeight === node2.listHeight) {
		return ListAstNode.create23(node1, node2, null, false);
	}
	else if (node1.listHeight > node2.listHeight) {
		// node1 is the tree we want to insert into
		return append(node1 as ListAstNode, node2);
	} else {
		return prepend(node2 as ListAstNode, node1);
	}
}

/**
 * Appends the given node to the end of this (2,3) tree.
 * Returns the new root.
*/
function append(list: ListAstNode, nodeToAppend: AstNode): AstNode {
	list = list.toMutable();
	let curNode: AstNode = list;
	const parents: ListAstNode[] = [];
	let nodeToAppendOfCorrectHeight: AstNode | undefined;
	while (true) {
		// assert nodeToInsert.listHeight <= curNode.listHeight
		if (nodeToAppend.listHeight === curNode.listHeight) {
			nodeToAppendOfCorrectHeight = nodeToAppend;
			break;
		}
		// assert 0 <= nodeToInsert.listHeight < curNode.listHeight
		if (curNode.kind !== AstNodeKind.List) {
			throw new Error('unexpected');
		}
		parents.push(curNode);
		// assert 2 <= curNode.childrenLength <= 3
		curNode = curNode.makeLastElementMutable()!;
	}
	// assert nodeToAppendOfCorrectHeight!.listHeight === curNode.listHeight
	for (let i = parents.length - 1; i >= 0; i--) {
		const parent = parents[i];
		if (nodeToAppendOfCorrectHeight) {
			// Can we take the element?
			if (parent.childrenLength >= 3) {
				// assert parent.childrenLength === 3 && parent.listHeight === nodeToAppendOfCorrectHeight.listHeight + 1

				// we need to split to maintain (2,3)-tree property.
				// Send the third element + the new element to the parent.
				nodeToAppendOfCorrectHeight = ListAstNode.create23(parent.unappendChild()!, nodeToAppendOfCorrectHeight, null, false);
			} else {
				parent.appendChildOfSameHeight(nodeToAppendOfCorrectHeight);
				nodeToAppendOfCorrectHeight = undefined;
			}
		} else {
			parent.handleChildrenChanged();
		}
	}
	if (nodeToAppendOfCorrectHeight) {
		return ListAstNode.create23(list, nodeToAppendOfCorrectHeight, null, false);
	} else {
		return list;
	}
}

/**
 * Prepends the given node to the end of this (2,3) tree.
 * Returns the new root.
*/
function prepend(list: ListAstNode, nodeToAppend: AstNode): AstNode {
	list = list.toMutable();
	let curNode: AstNode = list;
	const parents: ListAstNode[] = [];
	// assert nodeToInsert.listHeight <= curNode.listHeight
	while (nodeToAppend.listHeight !== curNode.listHeight) {
		// assert 0 <= nodeToInsert.listHeight < curNode.listHeight
		if (curNode.kind !== AstNodeKind.List) {
			throw new Error('unexpected');
		}
		parents.push(curNode);
		// assert 2 <= curNode.childrenFast.length <= 3
		curNode = curNode.makeFirstElementMutable()!;
	}
	let nodeToPrependOfCorrectHeight: AstNode | undefined = nodeToAppend;
	// assert nodeToAppendOfCorrectHeight!.listHeight === curNode.listHeight
	for (let i = parents.length - 1; i >= 0; i--) {
		const parent = parents[i];
		if (nodeToPrependOfCorrectHeight) {
			// Can we take the element?
			if (parent.childrenLength >= 3) {
				// assert parent.childrenLength === 3 && parent.listHeight === nodeToAppendOfCorrectHeight.listHeight + 1

				// we need to split to maintain (2,3)-tree property.
				// Send the third element + the new element to the parent.
				nodeToPrependOfCorrectHeight = ListAstNode.create23(nodeToPrependOfCorrectHeight, parent.unprependChild()!, null, false);
			} else {
				parent.prependChildOfSameHeight(nodeToPrependOfCorrectHeight);
				nodeToPrependOfCorrectHeight = undefined;
			}
		} else {
			parent.handleChildrenChanged();
		}
	}
	if (nodeToPrependOfCorrectHeight) {
		return ListAstNode.create23(nodeToPrependOfCorrectHeight, list, null, false);
	} else {
		return list;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/length.ts]---
Location: vscode-main/src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/length.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { splitLines } from '../../../../../base/common/strings.js';
import { Position } from '../../../core/position.js';
import { Range } from '../../../core/range.js';
import { TextLength } from '../../../core/text/textLength.js';

/**
 * The end must be greater than or equal to the start.
*/
export function lengthDiff(startLineCount: number, startColumnCount: number, endLineCount: number, endColumnCount: number): Length {
	return (startLineCount !== endLineCount)
		? toLength(endLineCount - startLineCount, endColumnCount)
		: toLength(0, endColumnCount - startColumnCount);
}

/**
 * Represents a non-negative length in terms of line and column count.
 * Does not allocate.
*/
export type Length = { _brand: 'Length' };

// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
export const lengthZero = 0 as any as Length;

export function lengthIsZero(length: Length): boolean {
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	return length as any as number === 0;
}

/*
 * We have 52 bits available in a JS number.
 * We use the upper 26 bits to store the line and the lower 26 bits to store the column.
 */
///*
const factor = 2 ** 26;
/*/
const factor = 1000000;
// */

export function toLength(lineCount: number, columnCount: number): Length {
	// llllllllllllllllllllllllllcccccccccccccccccccccccccc (52 bits)
	//       line count (26 bits)    column count (26 bits)

	// If there is no overflow (all values/sums below 2^26 = 67108864),
	// we have `toLength(lns1, cols1) + toLength(lns2, cols2) = toLength(lns1 + lns2, cols1 + cols2)`.

	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	return (lineCount * factor + columnCount) as any as Length;
}

export function lengthToObj(length: Length): TextLength {
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	const l = length as any as number;
	const lineCount = Math.floor(l / factor);
	const columnCount = l - lineCount * factor;
	return new TextLength(lineCount, columnCount);
}

export function lengthGetLineCount(length: Length): number {
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	return Math.floor(length as any as number / factor);
}

/**
 * Returns the amount of columns of the given length, assuming that it does not span any line.
*/
export function lengthGetColumnCountIfZeroLineCount(length: Length): number {
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	return length as any as number;
}


// [10 lines, 5 cols] + [ 0 lines, 3 cols] = [10 lines, 8 cols]
// [10 lines, 5 cols] + [20 lines, 3 cols] = [30 lines, 3 cols]
export function lengthAdd(length1: Length, length2: Length): Length;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lengthAdd(l1: any, l2: any): Length {
	let r = l1 + l2;
	if (l2 >= factor) { r = r - (l1 % factor); }
	return r;
}

export function sumLengths<T>(items: readonly T[], lengthFn: (item: T) => Length): Length {
	return items.reduce((a, b) => lengthAdd(a, lengthFn(b)), lengthZero);
}

export function lengthEquals(length1: Length, length2: Length): boolean {
	return length1 === length2;
}

/**
 * Returns a non negative length `result` such that `lengthAdd(length1, result) = length2`, or zero if such length does not exist.
 */
export function lengthDiffNonNegative(length1: Length, length2: Length): Length {
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	const l1 = length1 as any as number;
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	const l2 = length2 as any as number;

	const diff = l2 - l1;
	if (diff <= 0) {
		// line-count of length1 is higher than line-count of length2
		// or they are equal and column-count of length1 is higher than column-count of length2
		return lengthZero;
	}

	const lineCount1 = Math.floor(l1 / factor);
	const lineCount2 = Math.floor(l2 / factor);

	const colCount2 = l2 - lineCount2 * factor;

	if (lineCount1 === lineCount2) {
		const colCount1 = l1 - lineCount1 * factor;
		return toLength(0, colCount2 - colCount1);
	} else {
		return toLength(lineCount2 - lineCount1, colCount2);
	}
}

export function lengthLessThan(length1: Length, length2: Length): boolean {
	// First, compare line counts, then column counts.
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	return (length1 as any as number) < (length2 as any as number);
}

export function lengthLessThanEqual(length1: Length, length2: Length): boolean {
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	return (length1 as any as number) <= (length2 as any as number);
}

export function lengthGreaterThanEqual(length1: Length, length2: Length): boolean {
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	return (length1 as any as number) >= (length2 as any as number);
}

export function lengthToPosition(length: Length): Position {
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	const l = length as any as number;
	const lineCount = Math.floor(l / factor);
	const colCount = l - lineCount * factor;
	return new Position(lineCount + 1, colCount + 1);
}

export function positionToLength(position: Position): Length {
	return toLength(position.lineNumber - 1, position.column - 1);
}

export function lengthsToRange(lengthStart: Length, lengthEnd: Length): Range {
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	const l = lengthStart as any as number;
	const lineCount = Math.floor(l / factor);
	const colCount = l - lineCount * factor;

	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	const l2 = lengthEnd as any as number;
	const lineCount2 = Math.floor(l2 / factor);
	const colCount2 = l2 - lineCount2 * factor;

	return new Range(lineCount + 1, colCount + 1, lineCount2 + 1, colCount2 + 1);
}

export function lengthOfRange(range: Range): TextLength {
	if (range.startLineNumber === range.endLineNumber) {
		return new TextLength(0, range.endColumn - range.startColumn);
	} else {
		return new TextLength(range.endLineNumber - range.startLineNumber, range.endColumn - 1);
	}
}

export function lengthCompare(length1: Length, length2: Length): number {
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	const l1 = length1 as any as number;
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	const l2 = length2 as any as number;
	return l1 - l2;
}

export function lengthOfString(str: string): Length {
	const lines = splitLines(str);
	return toLength(lines.length - 1, lines[lines.length - 1].length);
}

export function lengthOfStringObj(str: string): TextLength {
	const lines = splitLines(str);
	return new TextLength(lines.length - 1, lines[lines.length - 1].length);
}

/**
 * Computes a numeric hash of the given length.
*/
export function lengthHash(length: Length): number {
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	return length as any;
}

export function lengthMax(length1: Length, length2: Length): Length {
	return length1 > length2 ? length1 : length2;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/nodeReader.ts]---
Location: vscode-main/src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/nodeReader.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AstNode } from './ast.js';
import { lengthAdd, lengthZero, Length, lengthLessThan } from './length.js';

/**
 * Allows to efficiently find a longest child at a given offset in a fixed node.
 * The requested offsets must increase monotonously.
*/
export class NodeReader {
	private readonly nextNodes: AstNode[];
	private readonly offsets: Length[];
	private readonly idxs: number[];
	private lastOffset: Length = lengthZero;

	constructor(node: AstNode) {
		this.nextNodes = [node];
		this.offsets = [lengthZero];
		this.idxs = [];
	}

	/**
	 * Returns the longest node at `offset` that satisfies the predicate.
	 * @param offset must be greater than or equal to the last offset this method has been called with!
	*/
	readLongestNodeAt(offset: Length, predicate: (node: AstNode) => boolean): AstNode | undefined {
		if (lengthLessThan(offset, this.lastOffset)) {
			throw new Error('Invalid offset');
		}
		this.lastOffset = offset;

		// Find the longest node of all those that are closest to the current offset.
		while (true) {
			const curNode = lastOrUndefined(this.nextNodes);

			if (!curNode) {
				return undefined;
			}
			const curNodeOffset = lastOrUndefined(this.offsets)!;

			if (lengthLessThan(offset, curNodeOffset)) {
				// The next best node is not here yet.
				// The reader must advance before a cached node is hit.
				return undefined;
			}

			if (lengthLessThan(curNodeOffset, offset)) {
				// The reader is ahead of the current node.
				if (lengthAdd(curNodeOffset, curNode.length) <= offset) {
					// The reader is after the end of the current node.
					this.nextNodeAfterCurrent();
				} else {
					// The reader is somewhere in the current node.
					const nextChildIdx = getNextChildIdx(curNode);
					if (nextChildIdx !== -1) {
						// Go to the first child and repeat.
						this.nextNodes.push(curNode.getChild(nextChildIdx)!);
						this.offsets.push(curNodeOffset);
						this.idxs.push(nextChildIdx);
					} else {
						// We don't have children
						this.nextNodeAfterCurrent();
					}
				}
			} else {
				// readerOffsetBeforeChange === curNodeOffset
				if (predicate(curNode)) {
					this.nextNodeAfterCurrent();
					return curNode;
				} else {
					const nextChildIdx = getNextChildIdx(curNode);
					// look for shorter node
					if (nextChildIdx === -1) {
						// There is no shorter node.
						this.nextNodeAfterCurrent();
						return undefined;
					} else {
						// Descend into first child & repeat.
						this.nextNodes.push(curNode.getChild(nextChildIdx)!);
						this.offsets.push(curNodeOffset);
						this.idxs.push(nextChildIdx);
					}
				}
			}
		}
	}

	// Navigates to the longest node that continues after the current node.
	private nextNodeAfterCurrent(): void {
		while (true) {
			const currentOffset = lastOrUndefined(this.offsets);
			const currentNode = lastOrUndefined(this.nextNodes);
			this.nextNodes.pop();
			this.offsets.pop();

			if (this.idxs.length === 0) {
				// We just popped the root node, there is no next node.
				break;
			}

			// Parent is not undefined, because idxs is not empty
			const parent = lastOrUndefined(this.nextNodes)!;
			const nextChildIdx = getNextChildIdx(parent, this.idxs[this.idxs.length - 1]);

			if (nextChildIdx !== -1) {
				this.nextNodes.push(parent.getChild(nextChildIdx)!);
				this.offsets.push(lengthAdd(currentOffset!, currentNode!.length));
				this.idxs[this.idxs.length - 1] = nextChildIdx;
				break;
			} else {
				this.idxs.pop();
			}
			// We fully consumed the parent.
			// Current node is now parent, so call nextNodeAfterCurrent again
		}
	}
}

function getNextChildIdx(node: AstNode, curIdx: number = -1): number | -1 {
	while (true) {
		curIdx++;
		if (curIdx >= node.childrenLength) {
			return -1;
		}
		if (node.getChild(curIdx)) {
			return curIdx;
		}
	}
}

function lastOrUndefined<T>(arr: readonly T[]): T | undefined {
	return arr.length > 0 ? arr[arr.length - 1] : undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/parser.ts]---
Location: vscode-main/src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/parser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AstNode, AstNodeKind, BracketAstNode, InvalidBracketAstNode, ListAstNode, PairAstNode, TextAstNode } from './ast.js';
import { BeforeEditPositionMapper, TextEditInfo } from './beforeEditPositionMapper.js';
import { SmallImmutableSet } from './smallImmutableSet.js';
import { lengthIsZero, lengthLessThan } from './length.js';
import { concat23Trees, concat23TreesOfSameHeight } from './concat23Trees.js';
import { NodeReader } from './nodeReader.js';
import { OpeningBracketId, Tokenizer, TokenKind } from './tokenizer.js';

/**
 * Non incrementally built ASTs are immutable.
*/
export function parseDocument(tokenizer: Tokenizer, edits: TextEditInfo[], oldNode: AstNode | undefined, createImmutableLists: boolean): AstNode {
	const parser = new Parser(tokenizer, edits, oldNode, createImmutableLists);
	return parser.parseDocument();
}

/**
 * Non incrementally built ASTs are immutable.
*/
class Parser {
	private readonly oldNodeReader?: NodeReader;
	private readonly positionMapper: BeforeEditPositionMapper;
	private _itemsConstructed: number = 0;
	private _itemsFromCache: number = 0;

	/**
	 * Reports how many nodes were constructed in the last parse operation.
	*/
	get nodesConstructed() {
		return this._itemsConstructed;
	}

	/**
	 * Reports how many nodes were reused in the last parse operation.
	*/
	get nodesReused() {
		return this._itemsFromCache;
	}

	constructor(
		private readonly tokenizer: Tokenizer,
		edits: TextEditInfo[],
		oldNode: AstNode | undefined,
		private readonly createImmutableLists: boolean,
	) {
		if (oldNode && createImmutableLists) {
			throw new Error('Not supported');
		}

		this.oldNodeReader = oldNode ? new NodeReader(oldNode) : undefined;
		this.positionMapper = new BeforeEditPositionMapper(edits);
	}

	parseDocument(): AstNode {
		this._itemsConstructed = 0;
		this._itemsFromCache = 0;

		let result = this.parseList(SmallImmutableSet.getEmpty(), 0);
		if (!result) {
			result = ListAstNode.getEmpty();
		}

		return result;
	}

	private parseList(
		openedBracketIds: SmallImmutableSet<OpeningBracketId>,
		level: number,
	): AstNode | null {
		const items: AstNode[] = [];

		while (true) {
			let child = this.tryReadChildFromCache(openedBracketIds);

			if (!child) {
				const token = this.tokenizer.peek();
				if (
					!token ||
					(token.kind === TokenKind.ClosingBracket &&
						token.bracketIds.intersects(openedBracketIds))
				) {
					break;
				}

				child = this.parseChild(openedBracketIds, level + 1);
			}

			if (child.kind === AstNodeKind.List && child.childrenLength === 0) {
				continue;
			}

			items.push(child);
		}

		// When there is no oldNodeReader, all items are created from scratch and must have the same height.
		const result = this.oldNodeReader ? concat23Trees(items) : concat23TreesOfSameHeight(items, this.createImmutableLists);
		return result;
	}

	private tryReadChildFromCache(openedBracketIds: SmallImmutableSet<number>): AstNode | undefined {
		if (this.oldNodeReader) {
			const maxCacheableLength = this.positionMapper.getDistanceToNextChange(this.tokenizer.offset);
			if (maxCacheableLength === null || !lengthIsZero(maxCacheableLength)) {
				const cachedNode = this.oldNodeReader.readLongestNodeAt(this.positionMapper.getOffsetBeforeChange(this.tokenizer.offset), curNode => {
					// The edit could extend the ending token, thus we cannot re-use nodes that touch the edit.
					// If there is no edit anymore, we can re-use the node in any case.
					if (maxCacheableLength !== null && !lengthLessThan(curNode.length, maxCacheableLength)) {
						// Either the node contains edited text or touches edited text.
						// In the latter case, brackets might have been extended (`end` -> `ending`), so even touching nodes cannot be reused.
						return false;
					}
					const canBeReused = curNode.canBeReused(openedBracketIds);
					return canBeReused;
				});

				if (cachedNode) {
					this._itemsFromCache++;
					this.tokenizer.skip(cachedNode.length);
					return cachedNode;
				}
			}
		}
		return undefined;
	}

	private parseChild(
		openedBracketIds: SmallImmutableSet<number>,
		level: number,
	): AstNode {
		this._itemsConstructed++;

		const token = this.tokenizer.read()!;

		switch (token.kind) {
			case TokenKind.ClosingBracket:
				return new InvalidBracketAstNode(token.bracketIds, token.length);

			case TokenKind.Text:
				return token.astNode as TextAstNode;

			case TokenKind.OpeningBracket: {
				if (level > 300) {
					// To prevent stack overflows
					return new TextAstNode(token.length);
				}

				const set = openedBracketIds.merge(token.bracketIds);
				const child = this.parseList(set, level + 1);

				const nextToken = this.tokenizer.peek();
				if (
					nextToken &&
					nextToken.kind === TokenKind.ClosingBracket &&
					(nextToken.bracketId === token.bracketId || nextToken.bracketIds.intersects(token.bracketIds))
				) {
					this.tokenizer.read();
					return PairAstNode.create(
						token.astNode as BracketAstNode,
						child,
						nextToken.astNode as BracketAstNode
					);
				} else {
					return PairAstNode.create(
						token.astNode as BracketAstNode,
						child,
						null
					);
				}
			}
			default:
				throw new Error('unexpected');
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/smallImmutableSet.ts]---
Location: vscode-main/src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/smallImmutableSet.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const emptyArr: number[] = [];

/**
 * Represents an immutable set that works best for a small number of elements (less than 32).
 * It uses bits to encode element membership efficiently.
*/
export class SmallImmutableSet<T> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private static cache = new Array<SmallImmutableSet<any>>(129);

	private static create<T>(items: number, additionalItems: readonly number[]): SmallImmutableSet<T> {
		if (items <= 128 && additionalItems.length === 0) {
			// We create a cache of 128=2^7 elements to cover all sets with up to 7 (dense) elements.
			let cached = SmallImmutableSet.cache[items];
			if (!cached) {
				cached = new SmallImmutableSet(items, additionalItems);
				SmallImmutableSet.cache[items] = cached;
			}
			return cached;
		}

		return new SmallImmutableSet(items, additionalItems);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private static empty = SmallImmutableSet.create<any>(0, emptyArr);
	public static getEmpty<T>(): SmallImmutableSet<T> {
		return this.empty;
	}

	private constructor(
		private readonly items: number,
		private readonly additionalItems: readonly number[]
	) {
	}

	public add(value: T, keyProvider: IDenseKeyProvider<T>): SmallImmutableSet<T> {
		const key = keyProvider.getKey(value);
		let idx = key >> 5; // divided by 32
		if (idx === 0) {
			// fast path
			const newItem = (1 << key) | this.items;
			if (newItem === this.items) {
				return this;
			}
			return SmallImmutableSet.create(newItem, this.additionalItems);
		}
		idx--;

		const newItems = this.additionalItems.slice(0);
		while (newItems.length < idx) {
			newItems.push(0);
		}
		newItems[idx] |= 1 << (key & 31);

		return SmallImmutableSet.create(this.items, newItems);
	}

	public has(value: T, keyProvider: IDenseKeyProvider<T>): boolean {
		const key = keyProvider.getKey(value);
		let idx = key >> 5; // divided by 32
		if (idx === 0) {
			// fast path
			return (this.items & (1 << key)) !== 0;
		}
		idx--;

		return ((this.additionalItems[idx] || 0) & (1 << (key & 31))) !== 0;
	}

	public merge(other: SmallImmutableSet<T>): SmallImmutableSet<T> {
		const merged = this.items | other.items;

		if (this.additionalItems === emptyArr && other.additionalItems === emptyArr) {
			// fast path
			if (merged === this.items) {
				return this;
			}
			if (merged === other.items) {
				return other;
			}
			return SmallImmutableSet.create(merged, emptyArr);
		}

		// This can be optimized, but it's not a common case
		const newItems: number[] = [];
		for (let i = 0; i < Math.max(this.additionalItems.length, other.additionalItems.length); i++) {
			const item1 = this.additionalItems[i] || 0;
			const item2 = other.additionalItems[i] || 0;
			newItems.push(item1 | item2);
		}

		return SmallImmutableSet.create(merged, newItems);
	}

	public intersects(other: SmallImmutableSet<T>): boolean {
		if ((this.items & other.items) !== 0) {
			return true;
		}

		for (let i = 0; i < Math.min(this.additionalItems.length, other.additionalItems.length); i++) {
			if ((this.additionalItems[i] & other.additionalItems[i]) !== 0) {
				return true;
			}
		}

		return false;
	}

	public equals(other: SmallImmutableSet<T>): boolean {
		if (this.items !== other.items) {
			return false;
		}

		if (this.additionalItems.length !== other.additionalItems.length) {
			return false;
		}

		for (let i = 0; i < this.additionalItems.length; i++) {
			if (this.additionalItems[i] !== other.additionalItems[i]) {
				return false;
			}
		}

		return true;
	}
}

export interface IDenseKeyProvider<T> {
	getKey(value: T): number;
}

export const identityKeyProvider: IDenseKeyProvider<number> = {
	getKey(value: number) {
		return value;
	}
};

/**
 * Assigns values a unique incrementing key.
*/
export class DenseKeyProvider<T> {
	private readonly items = new Map<T, number>();

	getKey(value: T): number {
		let existing = this.items.get(value);
		if (existing === undefined) {
			existing = this.items.size;
			this.items.set(value, existing);
		}
		return existing;
	}

	reverseLookup(value: number): T | undefined {
		return [...this.items].find(([_key, v]) => v === value)?.[0];
	}

	reverseLookupSet(set: SmallImmutableSet<T>): T[] {
		const result: T[] = [];
		for (const [key] of this.items) {
			if (set.has(key, this)) {
				result.push(key);
			}
		}
		return result;
	}

	keys(): IterableIterator<T> {
		return this.items.keys();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/tokenizer.ts]---
Location: vscode-main/src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/tokenizer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { NotSupportedError } from '../../../../../base/common/errors.js';
import { StandardTokenType, TokenMetadata } from '../../../encodedTokenAttributes.js';
import { IViewLineTokens } from '../../../tokens/lineTokens.js';
import { BracketAstNode, TextAstNode } from './ast.js';
import { BracketTokens, LanguageAgnosticBracketTokens } from './brackets.js';
import { Length, lengthAdd, lengthDiff, lengthGetColumnCountIfZeroLineCount, lengthToObj, lengthZero, toLength } from './length.js';
import { SmallImmutableSet } from './smallImmutableSet.js';

export interface Tokenizer {
	readonly offset: Length;
	readonly length: Length;

	read(): Token | null;
	peek(): Token | null;
	skip(length: Length): void;

	getText(): string;
}

export const enum TokenKind {
	Text = 0,
	OpeningBracket = 1,
	ClosingBracket = 2,
}

export type OpeningBracketId = number;

export class Token {
	constructor(
		readonly length: Length,
		readonly kind: TokenKind,
		/**
		 * If this token is an opening bracket, this is the id of the opening bracket.
		 * If this token is a closing bracket, this is the id of the first opening bracket that is closed by this bracket.
		 * Otherwise, it is -1.
		 */
		readonly bracketId: OpeningBracketId,
		/**
		 * If this token is an opening bracket, this just contains `bracketId`.
		 * If this token is a closing bracket, this lists all opening bracket ids, that it closes.
		 * Otherwise, it is empty.
		 */
		readonly bracketIds: SmallImmutableSet<OpeningBracketId>,
		readonly astNode: BracketAstNode | TextAstNode | undefined,
	) { }
}

export interface ITokenizerSource {
	getValue(): string;
	getLineCount(): number;
	getLineLength(lineNumber: number): number;

	tokenization: {
		getLineTokens(lineNumber: number): IViewLineTokens;
	};
}

export class TextBufferTokenizer implements Tokenizer {
	private readonly textBufferLineCount: number;
	private readonly textBufferLastLineLength: number;

	private readonly reader;

	constructor(
		private readonly textModel: ITokenizerSource,
		private readonly bracketTokens: LanguageAgnosticBracketTokens
	) {
		this.reader = new NonPeekableTextBufferTokenizer(this.textModel, this.bracketTokens);
		this._offset = lengthZero;
		this.didPeek = false;
		this.peeked = null;
		this.textBufferLineCount = textModel.getLineCount();
		this.textBufferLastLineLength = textModel.getLineLength(this.textBufferLineCount);
	}

	private _offset: Length;

	get offset() {
		return this._offset;
	}

	get length() {
		return toLength(this.textBufferLineCount - 1, this.textBufferLastLineLength);
	}

	getText() {
		return this.textModel.getValue();
	}

	skip(length: Length): void {
		this.didPeek = false;
		this._offset = lengthAdd(this._offset, length);
		const obj = lengthToObj(this._offset);
		this.reader.setPosition(obj.lineCount, obj.columnCount);
	}

	private didPeek;
	private peeked: Token | null;

	read(): Token | null {
		let token: Token | null;
		if (this.peeked) {
			this.didPeek = false;
			token = this.peeked;
		} else {
			token = this.reader.read();
		}
		if (token) {
			this._offset = lengthAdd(this._offset, token.length);
		}
		return token;
	}

	peek(): Token | null {
		if (!this.didPeek) {
			this.peeked = this.reader.read();
			this.didPeek = true;
		}
		return this.peeked;
	}
}

/**
 * Does not support peek.
*/
class NonPeekableTextBufferTokenizer {
	private readonly textBufferLineCount: number;
	private readonly textBufferLastLineLength: number;

	constructor(private readonly textModel: ITokenizerSource, private readonly bracketTokens: LanguageAgnosticBracketTokens) {
		this.textBufferLineCount = textModel.getLineCount();
		this.textBufferLastLineLength = textModel.getLineLength(this.textBufferLineCount);
	}

	private lineIdx = 0;
	private line: string | null = null;
	private lineCharOffset = 0;
	private lineTokens: IViewLineTokens | null = null;
	private lineTokenOffset = 0;

	public setPosition(lineIdx: number, column: number): void {
		// We must not jump into a token!
		if (lineIdx === this.lineIdx) {
			this.lineCharOffset = column;
			if (this.line !== null) {
				this.lineTokenOffset = this.lineCharOffset === 0 ? 0 : this.lineTokens!.findTokenIndexAtOffset(this.lineCharOffset);
			}
		} else {
			this.lineIdx = lineIdx;
			this.lineCharOffset = column;
			this.line = null;
		}
		this.peekedToken = null;
	}

	/** Must be a zero line token. The end of the document cannot be peeked. */
	private peekedToken: Token | null = null;

	public read(): Token | null {
		if (this.peekedToken) {
			const token = this.peekedToken;
			this.peekedToken = null;
			this.lineCharOffset += lengthGetColumnCountIfZeroLineCount(token.length);
			return token;
		}

		if (this.lineIdx > this.textBufferLineCount - 1 || (this.lineIdx === this.textBufferLineCount - 1 && this.lineCharOffset >= this.textBufferLastLineLength)) {
			// We are after the end
			return null;
		}

		if (this.line === null) {
			this.lineTokens = this.textModel.tokenization.getLineTokens(this.lineIdx + 1);
			this.line = this.lineTokens.getLineContent();
			this.lineTokenOffset = this.lineCharOffset === 0 ? 0 : this.lineTokens.findTokenIndexAtOffset(this.lineCharOffset);
		}

		const startLineIdx = this.lineIdx;
		const startLineCharOffset = this.lineCharOffset;

		// limits the length of text tokens.
		// If text tokens get too long, incremental updates will be slow
		let lengthHeuristic = 0;
		while (true) {
			const lineTokens = this.lineTokens!;
			const tokenCount = lineTokens.getCount();

			let peekedBracketToken: Token | null = null;

			if (this.lineTokenOffset < tokenCount) {
				const tokenMetadata = lineTokens.getMetadata(this.lineTokenOffset);
				while (this.lineTokenOffset + 1 < tokenCount && tokenMetadata === lineTokens.getMetadata(this.lineTokenOffset + 1)) {
					// Skip tokens that are identical.
					// Sometimes, (bracket) identifiers are split up into multiple tokens.
					this.lineTokenOffset++;
				}

				const isOther = TokenMetadata.getTokenType(tokenMetadata) === StandardTokenType.Other;
				const containsBracketType = TokenMetadata.containsBalancedBrackets(tokenMetadata);

				const endOffset = lineTokens.getEndOffset(this.lineTokenOffset);
				// Is there a bracket token next? Only consume text.
				if (containsBracketType && isOther && this.lineCharOffset < endOffset) {
					const languageId = lineTokens.getLanguageId(this.lineTokenOffset);
					const text = this.line.substring(this.lineCharOffset, endOffset);

					const brackets = this.bracketTokens.getSingleLanguageBracketTokens(languageId);
					const regexp = brackets.regExpGlobal;
					if (regexp) {
						regexp.lastIndex = 0;
						const match = regexp.exec(text);
						if (match) {
							peekedBracketToken = brackets.getToken(match[0])!;
							if (peekedBracketToken) {
								// Consume leading text of the token
								this.lineCharOffset += match.index;
							}
						}
					}
				}

				lengthHeuristic += endOffset - this.lineCharOffset;

				if (peekedBracketToken) {
					// Don't skip the entire token, as a single token could contain multiple brackets.

					if (startLineIdx !== this.lineIdx || startLineCharOffset !== this.lineCharOffset) {
						// There is text before the bracket
						this.peekedToken = peekedBracketToken;
						break;
					} else {
						// Consume the peeked token
						this.lineCharOffset += lengthGetColumnCountIfZeroLineCount(peekedBracketToken.length);
						return peekedBracketToken;
					}
				} else {
					// Skip the entire token, as the token contains no brackets at all.
					this.lineTokenOffset++;
					this.lineCharOffset = endOffset;
				}
			} else {
				if (this.lineIdx === this.textBufferLineCount - 1) {
					break;
				}
				this.lineIdx++;
				this.lineTokens = this.textModel.tokenization.getLineTokens(this.lineIdx + 1);
				this.lineTokenOffset = 0;
				this.line = this.lineTokens.getLineContent();
				this.lineCharOffset = 0;

				lengthHeuristic += 33; // max 1000/33 = 30 lines
				// This limits the amount of work to recompute min-indentation

				if (lengthHeuristic > 1000) {
					// only break (automatically) at the end of line.
					break;
				}
			}

			if (lengthHeuristic > 1500) {
				// Eventually break regardless of the line length so that
				// very long lines do not cause bad performance.
				// This effective limits max indentation to 500, as
				// indentation is not computed across multiple text nodes.
				break;
			}
		}

		// If a token contains some proper indentation, it also contains \n{INDENTATION+}(?!{INDENTATION}),
		// unless the line is too long.
		// Thus, the min indentation of the document is the minimum min indentation of every text node.
		const length = lengthDiff(startLineIdx, startLineCharOffset, this.lineIdx, this.lineCharOffset);
		return new Token(length, TokenKind.Text, -1, SmallImmutableSet.getEmpty(), new TextAstNode(length));
	}
}

export class FastTokenizer implements Tokenizer {
	private _offset: Length = lengthZero;
	private readonly tokens: readonly Token[];
	private idx = 0;

	constructor(private readonly text: string, brackets: BracketTokens) {
		const regExpStr = brackets.getRegExpStr();
		const regexp = regExpStr ? new RegExp(regExpStr + '|\n', 'gi') : null;

		const tokens: Token[] = [];

		let match: RegExpExecArray | null;
		let curLineCount = 0;
		let lastLineBreakOffset = 0;

		let lastTokenEndOffset = 0;
		let lastTokenEndLine = 0;

		const smallTextTokens0Line: Token[] = [];
		for (let i = 0; i < 60; i++) {
			smallTextTokens0Line.push(
				new Token(
					toLength(0, i), TokenKind.Text, -1, SmallImmutableSet.getEmpty(),
					new TextAstNode(toLength(0, i))
				)
			);
		}

		const smallTextTokens1Line: Token[] = [];
		for (let i = 0; i < 60; i++) {
			smallTextTokens1Line.push(
				new Token(
					toLength(1, i), TokenKind.Text, -1, SmallImmutableSet.getEmpty(),
					new TextAstNode(toLength(1, i))
				)
			);
		}

		if (regexp) {
			regexp.lastIndex = 0;
			// If a token contains indentation, it also contains \n{INDENTATION+}(?!{INDENTATION})
			while ((match = regexp.exec(text)) !== null) {
				const curOffset = match.index;
				const value = match[0];
				if (value === '\n') {
					curLineCount++;
					lastLineBreakOffset = curOffset + 1;
				} else {
					if (lastTokenEndOffset !== curOffset) {
						let token: Token;
						if (lastTokenEndLine === curLineCount) {
							const colCount = curOffset - lastTokenEndOffset;
							if (colCount < smallTextTokens0Line.length) {
								token = smallTextTokens0Line[colCount];
							} else {
								const length = toLength(0, colCount);
								token = new Token(length, TokenKind.Text, -1, SmallImmutableSet.getEmpty(), new TextAstNode(length));
							}
						} else {
							const lineCount = curLineCount - lastTokenEndLine;
							const colCount = curOffset - lastLineBreakOffset;
							if (lineCount === 1 && colCount < smallTextTokens1Line.length) {
								token = smallTextTokens1Line[colCount];
							} else {
								const length = toLength(lineCount, colCount);
								token = new Token(length, TokenKind.Text, -1, SmallImmutableSet.getEmpty(), new TextAstNode(length));
							}
						}
						tokens.push(token);
					}

					// value is matched by regexp, so the token must exist
					tokens.push(brackets.getToken(value)!);

					lastTokenEndOffset = curOffset + value.length;
					lastTokenEndLine = curLineCount;
				}
			}
		}

		const offset = text.length;

		if (lastTokenEndOffset !== offset) {
			const length = (lastTokenEndLine === curLineCount)
				? toLength(0, offset - lastTokenEndOffset)
				: toLength(curLineCount - lastTokenEndLine, offset - lastLineBreakOffset);
			tokens.push(new Token(length, TokenKind.Text, -1, SmallImmutableSet.getEmpty(), new TextAstNode(length)));
		}

		this.length = toLength(curLineCount, offset - lastLineBreakOffset);
		this.tokens = tokens;
	}

	get offset(): Length {
		return this._offset;
	}

	readonly length: Length;

	read(): Token | null {
		return this.tokens[this.idx++] || null;
	}

	peek(): Token | null {
		return this.tokens[this.idx] || null;
	}

	skip(length: Length): void {
		throw new NotSupportedError();
	}

	getText(): string {
		return this.text;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/pieceTreeTextBuffer/pieceTreeBase.ts]---
Location: vscode-main/src/vs/editor/common/model/pieceTreeTextBuffer/pieceTreeBase.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../../base/common/charCode.js';
import { Position } from '../../core/position.js';
import { Range } from '../../core/range.js';
import { FindMatch, ITextSnapshot, SearchData } from '../../model.js';
import { NodeColor, SENTINEL, TreeNode, fixInsert, leftest, rbDelete, righttest, updateTreeMetadata } from './rbTreeBase.js';
import { Searcher, createFindMatch, isValidMatch } from '../textModelSearch.js';

// const lfRegex = new RegExp(/\r\n|\r|\n/g);
const AverageBufferSize = 65535;

function createUintArray(arr: number[]): Uint32Array | Uint16Array {
	let r;
	if (arr[arr.length - 1] < 65536) {
		r = new Uint16Array(arr.length);
	} else {
		r = new Uint32Array(arr.length);
	}
	r.set(arr, 0);
	return r;
}

class LineStarts {
	constructor(
		public readonly lineStarts: Uint32Array | Uint16Array | number[],
		public readonly cr: number,
		public readonly lf: number,
		public readonly crlf: number,
		public readonly isBasicASCII: boolean
	) { }
}

export function createLineStartsFast(str: string, readonly: boolean = true): Uint32Array | Uint16Array | number[] {
	const r: number[] = [0];
	let rLength = 1;

	for (let i = 0, len = str.length; i < len; i++) {
		const chr = str.charCodeAt(i);

		if (chr === CharCode.CarriageReturn) {
			if (i + 1 < len && str.charCodeAt(i + 1) === CharCode.LineFeed) {
				// \r\n... case
				r[rLength++] = i + 2;
				i++; // skip \n
			} else {
				// \r... case
				r[rLength++] = i + 1;
			}
		} else if (chr === CharCode.LineFeed) {
			r[rLength++] = i + 1;
		}
	}
	if (readonly) {
		return createUintArray(r);
	} else {
		return r;
	}
}

export function createLineStarts(r: number[], str: string): LineStarts {
	r.length = 0;
	r[0] = 0;
	let rLength = 1;
	let cr = 0, lf = 0, crlf = 0;
	let isBasicASCII = true;
	for (let i = 0, len = str.length; i < len; i++) {
		const chr = str.charCodeAt(i);

		if (chr === CharCode.CarriageReturn) {
			if (i + 1 < len && str.charCodeAt(i + 1) === CharCode.LineFeed) {
				// \r\n... case
				crlf++;
				r[rLength++] = i + 2;
				i++; // skip \n
			} else {
				cr++;
				// \r... case
				r[rLength++] = i + 1;
			}
		} else if (chr === CharCode.LineFeed) {
			lf++;
			r[rLength++] = i + 1;
		} else {
			if (isBasicASCII) {
				if (chr !== CharCode.Tab && (chr < 32 || chr > 126)) {
					isBasicASCII = false;
				}
			}
		}
	}
	const result = new LineStarts(createUintArray(r), cr, lf, crlf, isBasicASCII);
	r.length = 0;

	return result;
}

interface NodePosition {
	/**
	 * Piece Index
	 */
	node: TreeNode;
	/**
	 * remainder in current piece.
	*/
	remainder: number;
	/**
	 * node start offset in document.
	 */
	nodeStartOffset: number;
}

interface BufferCursor {
	/**
	 * Line number in current buffer
	 */
	line: number;
	/**
	 * Column number in current buffer
	 */
	column: number;
}

export class Piece {
	readonly bufferIndex: number;
	readonly start: BufferCursor;
	readonly end: BufferCursor;
	readonly length: number;
	readonly lineFeedCnt: number;

	constructor(bufferIndex: number, start: BufferCursor, end: BufferCursor, lineFeedCnt: number, length: number) {
		this.bufferIndex = bufferIndex;
		this.start = start;
		this.end = end;
		this.lineFeedCnt = lineFeedCnt;
		this.length = length;
	}
}

export class StringBuffer {
	buffer: string;
	lineStarts: Uint32Array | Uint16Array | number[];

	constructor(buffer: string, lineStarts: Uint32Array | Uint16Array | number[]) {
		this.buffer = buffer;
		this.lineStarts = lineStarts;
	}
}

/**
 * Readonly snapshot for piece tree.
 * In a real multiple thread environment, to make snapshot reading always work correctly, we need to
 * 1. Make TreeNode.piece immutable, then reading and writing can run in parallel.
 * 2. TreeNode/Buffers normalization should not happen during snapshot reading.
 */
class PieceTreeSnapshot implements ITextSnapshot {
	private readonly _pieces: Piece[];
	private _index: number;
	private readonly _tree: PieceTreeBase;
	private readonly _BOM: string;

	constructor(tree: PieceTreeBase, BOM: string) {
		this._pieces = [];
		this._tree = tree;
		this._BOM = BOM;
		this._index = 0;
		if (tree.root !== SENTINEL) {
			tree.iterate(tree.root, node => {
				if (node !== SENTINEL) {
					this._pieces.push(node.piece);
				}
				return true;
			});
		}
	}

	read(): string | null {
		if (this._pieces.length === 0) {
			if (this._index === 0) {
				this._index++;
				return this._BOM;
			} else {
				return null;
			}
		}

		if (this._index > this._pieces.length - 1) {
			return null;
		}

		if (this._index === 0) {
			return this._BOM + this._tree.getPieceContent(this._pieces[this._index++]);
		}
		return this._tree.getPieceContent(this._pieces[this._index++]);
	}
}

interface CacheEntry {
	node: TreeNode;
	nodeStartOffset: number;
	nodeStartLineNumber?: number;
}

class PieceTreeSearchCache {
	private readonly _limit: number;
	private _cache: CacheEntry[];

	constructor(limit: number) {
		this._limit = limit;
		this._cache = [];
	}

	public get(offset: number): CacheEntry | null {
		for (let i = this._cache.length - 1; i >= 0; i--) {
			const nodePos = this._cache[i];
			if (nodePos.nodeStartOffset <= offset && nodePos.nodeStartOffset + nodePos.node.piece.length >= offset) {
				return nodePos;
			}
		}
		return null;
	}

	public get2(lineNumber: number): { node: TreeNode; nodeStartOffset: number; nodeStartLineNumber: number } | null {
		for (let i = this._cache.length - 1; i >= 0; i--) {
			const nodePos = this._cache[i];
			if (nodePos.nodeStartLineNumber && nodePos.nodeStartLineNumber < lineNumber && nodePos.nodeStartLineNumber + nodePos.node.piece.lineFeedCnt >= lineNumber) {
				return <{ node: TreeNode; nodeStartOffset: number; nodeStartLineNumber: number }>nodePos;
			}
		}
		return null;
	}

	public set(nodePosition: CacheEntry) {
		if (this._cache.length >= this._limit) {
			this._cache.shift();
		}
		this._cache.push(nodePosition);
	}

	public validate(offset: number) {
		let hasInvalidVal = false;
		const tmp: Array<CacheEntry | null> = this._cache;
		for (let i = 0; i < tmp.length; i++) {
			const nodePos = tmp[i]!;
			if (nodePos.node.parent === null || nodePos.nodeStartOffset >= offset) {
				tmp[i] = null;
				hasInvalidVal = true;
				continue;
			}
		}

		if (hasInvalidVal) {
			const newArr: CacheEntry[] = [];
			for (const entry of tmp) {
				if (entry !== null) {
					newArr.push(entry);
				}
			}

			this._cache = newArr;
		}
	}
}

export class PieceTreeBase {
	root!: TreeNode;
	protected _buffers!: StringBuffer[]; // 0 is change buffer, others are readonly original buffer.
	protected _lineCnt!: number;
	protected _length!: number;
	protected _EOL!: '\r\n' | '\n';
	protected _EOLLength!: number;
	protected _EOLNormalized!: boolean;
	private _lastChangeBufferPos!: BufferCursor;
	private _searchCache!: PieceTreeSearchCache;
	private _lastVisitedLine!: { lineNumber: number; value: string };

	constructor(chunks: StringBuffer[], eol: '\r\n' | '\n', eolNormalized: boolean) {
		this.create(chunks, eol, eolNormalized);
	}

	create(chunks: StringBuffer[], eol: '\r\n' | '\n', eolNormalized: boolean) {
		this._buffers = [
			new StringBuffer('', [0])
		];
		this._lastChangeBufferPos = { line: 0, column: 0 };
		this.root = SENTINEL;
		this._lineCnt = 1;
		this._length = 0;
		this._EOL = eol;
		this._EOLLength = eol.length;
		this._EOLNormalized = eolNormalized;

		let lastNode: TreeNode | null = null;
		for (let i = 0, len = chunks.length; i < len; i++) {
			if (chunks[i].buffer.length > 0) {
				if (!chunks[i].lineStarts) {
					chunks[i].lineStarts = createLineStartsFast(chunks[i].buffer);
				}

				const piece = new Piece(
					i + 1,
					{ line: 0, column: 0 },
					{ line: chunks[i].lineStarts.length - 1, column: chunks[i].buffer.length - chunks[i].lineStarts[chunks[i].lineStarts.length - 1] },
					chunks[i].lineStarts.length - 1,
					chunks[i].buffer.length
				);
				this._buffers.push(chunks[i]);
				lastNode = this.rbInsertRight(lastNode, piece);
			}
		}

		this._searchCache = new PieceTreeSearchCache(1);
		this._lastVisitedLine = { lineNumber: 0, value: '' };
		this.computeBufferMetadata();
	}

	normalizeEOL(eol: '\r\n' | '\n') {
		const averageBufferSize = AverageBufferSize;
		const min = averageBufferSize - Math.floor(averageBufferSize / 3);
		const max = min * 2;

		let tempChunk = '';
		let tempChunkLen = 0;
		const chunks: StringBuffer[] = [];

		this.iterate(this.root, node => {
			const str = this.getNodeContent(node);
			const len = str.length;
			if (tempChunkLen <= min || tempChunkLen + len < max) {
				tempChunk += str;
				tempChunkLen += len;
				return true;
			}

			// flush anyways
			const text = tempChunk.replace(/\r\n|\r|\n/g, eol);
			chunks.push(new StringBuffer(text, createLineStartsFast(text)));
			tempChunk = str;
			tempChunkLen = len;
			return true;
		});

		if (tempChunkLen > 0) {
			const text = tempChunk.replace(/\r\n|\r|\n/g, eol);
			chunks.push(new StringBuffer(text, createLineStartsFast(text)));
		}

		this.create(chunks, eol, true);
	}

	// #region Buffer API
	public getEOL(): '\r\n' | '\n' {
		return this._EOL;
	}

	public setEOL(newEOL: '\r\n' | '\n'): void {
		this._EOL = newEOL;
		this._EOLLength = this._EOL.length;
		this.normalizeEOL(newEOL);
	}

	public createSnapshot(BOM: string): ITextSnapshot {
		return new PieceTreeSnapshot(this, BOM);
	}

	public equal(other: PieceTreeBase): boolean {
		if (this.getLength() !== other.getLength()) {
			return false;
		}
		if (this.getLineCount() !== other.getLineCount()) {
			return false;
		}

		let offset = 0;
		const ret = this.iterate(this.root, node => {
			if (node === SENTINEL) {
				return true;
			}
			const str = this.getNodeContent(node);
			const len = str.length;
			const startPosition = other.nodeAt(offset);
			const endPosition = other.nodeAt(offset + len);
			const val = other.getValueInRange2(startPosition, endPosition);

			offset += len;
			return str === val;
		});

		return ret;
	}

	public getOffsetAt(lineNumber: number, column: number): number {
		let leftLen = 0; // inorder

		let x = this.root;

		while (x !== SENTINEL) {
			if (x.left !== SENTINEL && x.lf_left + 1 >= lineNumber) {
				x = x.left;
			} else if (x.lf_left + x.piece.lineFeedCnt + 1 >= lineNumber) {
				leftLen += x.size_left;
				// lineNumber >= 2
				const accumualtedValInCurrentIndex = this.getAccumulatedValue(x, lineNumber - x.lf_left - 2);
				return leftLen += accumualtedValInCurrentIndex + column - 1;
			} else {
				lineNumber -= x.lf_left + x.piece.lineFeedCnt;
				leftLen += x.size_left + x.piece.length;
				x = x.right;
			}
		}

		return leftLen;
	}

	public getPositionAt(offset: number): Position {
		offset = Math.floor(offset);
		offset = Math.max(0, offset);

		let x = this.root;
		let lfCnt = 0;
		const originalOffset = offset;

		while (x !== SENTINEL) {
			if (x.size_left !== 0 && x.size_left >= offset) {
				x = x.left;
			} else if (x.size_left + x.piece.length >= offset) {
				const out = this.getIndexOf(x, offset - x.size_left);

				lfCnt += x.lf_left + out.index;

				if (out.index === 0) {
					const lineStartOffset = this.getOffsetAt(lfCnt + 1, 1);
					const column = originalOffset - lineStartOffset;
					return new Position(lfCnt + 1, column + 1);
				}

				return new Position(lfCnt + 1, out.remainder + 1);
			} else {
				offset -= x.size_left + x.piece.length;
				lfCnt += x.lf_left + x.piece.lineFeedCnt;

				if (x.right === SENTINEL) {
					// last node
					const lineStartOffset = this.getOffsetAt(lfCnt + 1, 1);
					const column = originalOffset - offset - lineStartOffset;
					return new Position(lfCnt + 1, column + 1);
				} else {
					x = x.right;
				}
			}
		}

		return new Position(1, 1);
	}

	public getValueInRange(range: Range, eol?: string): string {
		if (range.startLineNumber === range.endLineNumber && range.startColumn === range.endColumn) {
			return '';
		}

		const startPosition = this.nodeAt2(range.startLineNumber, range.startColumn);
		const endPosition = this.nodeAt2(range.endLineNumber, range.endColumn);

		const value = this.getValueInRange2(startPosition, endPosition);
		if (eol) {
			if (eol !== this._EOL || !this._EOLNormalized) {
				return value.replace(/\r\n|\r|\n/g, eol);
			}

			if (eol === this.getEOL() && this._EOLNormalized) {
				if (eol === '\r\n') {

				}
				return value;
			}
			return value.replace(/\r\n|\r|\n/g, eol);
		}
		return value;
	}

	public getValueInRange2(startPosition: NodePosition, endPosition: NodePosition): string {
		if (startPosition.node === endPosition.node) {
			const node = startPosition.node;
			const buffer = this._buffers[node.piece.bufferIndex].buffer;
			const startOffset = this.offsetInBuffer(node.piece.bufferIndex, node.piece.start);
			return buffer.substring(startOffset + startPosition.remainder, startOffset + endPosition.remainder);
		}

		let x = startPosition.node;
		const buffer = this._buffers[x.piece.bufferIndex].buffer;
		const startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
		let ret = buffer.substring(startOffset + startPosition.remainder, startOffset + x.piece.length);

		x = x.next();
		while (x !== SENTINEL) {
			const buffer = this._buffers[x.piece.bufferIndex].buffer;
			const startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);

			if (x === endPosition.node) {
				ret += buffer.substring(startOffset, startOffset + endPosition.remainder);
				break;
			} else {
				ret += buffer.substr(startOffset, x.piece.length);
			}

			x = x.next();
		}

		return ret;
	}

	public getLinesContent(): string[] {
		const lines: string[] = [];
		let linesLength = 0;
		let currentLine = '';
		let danglingCR = false;

		this.iterate(this.root, node => {
			if (node === SENTINEL) {
				return true;
			}

			const piece = node.piece;
			let pieceLength = piece.length;
			if (pieceLength === 0) {
				return true;
			}

			const buffer = this._buffers[piece.bufferIndex].buffer;
			const lineStarts = this._buffers[piece.bufferIndex].lineStarts;

			const pieceStartLine = piece.start.line;
			const pieceEndLine = piece.end.line;
			let pieceStartOffset = lineStarts[pieceStartLine] + piece.start.column;

			if (danglingCR) {
				if (buffer.charCodeAt(pieceStartOffset) === CharCode.LineFeed) {
					// pretend the \n was in the previous piece..
					pieceStartOffset++;
					pieceLength--;
				}
				lines[linesLength++] = currentLine;
				currentLine = '';
				danglingCR = false;
				if (pieceLength === 0) {
					return true;
				}
			}

			if (pieceStartLine === pieceEndLine) {
				// this piece has no new lines
				if (!this._EOLNormalized && buffer.charCodeAt(pieceStartOffset + pieceLength - 1) === CharCode.CarriageReturn) {
					danglingCR = true;
					currentLine += buffer.substr(pieceStartOffset, pieceLength - 1);
				} else {
					currentLine += buffer.substr(pieceStartOffset, pieceLength);
				}
				return true;
			}

			// add the text before the first line start in this piece
			currentLine += (
				this._EOLNormalized
					? buffer.substring(pieceStartOffset, Math.max(pieceStartOffset, lineStarts[pieceStartLine + 1] - this._EOLLength))
					: buffer.substring(pieceStartOffset, lineStarts[pieceStartLine + 1]).replace(/(\r\n|\r|\n)$/, '')
			);
			lines[linesLength++] = currentLine;

			for (let line = pieceStartLine + 1; line < pieceEndLine; line++) {
				currentLine = (
					this._EOLNormalized
						? buffer.substring(lineStarts[line], lineStarts[line + 1] - this._EOLLength)
						: buffer.substring(lineStarts[line], lineStarts[line + 1]).replace(/(\r\n|\r|\n)$/, '')
				);
				lines[linesLength++] = currentLine;
			}

			if (!this._EOLNormalized && buffer.charCodeAt(lineStarts[pieceEndLine] + piece.end.column - 1) === CharCode.CarriageReturn) {
				danglingCR = true;
				if (piece.end.column === 0) {
					// The last line ended with a \r, let's undo the push, it will be pushed by next iteration
					linesLength--;
				} else {
					currentLine = buffer.substr(lineStarts[pieceEndLine], piece.end.column - 1);
				}
			} else {
				currentLine = buffer.substr(lineStarts[pieceEndLine], piece.end.column);
			}

			return true;
		});

		if (danglingCR) {
			lines[linesLength++] = currentLine;
			currentLine = '';
		}

		lines[linesLength++] = currentLine;
		return lines;
	}

	public getLength(): number {
		return this._length;
	}

	public getLineCount(): number {
		return this._lineCnt;
	}

	public getLineContent(lineNumber: number): string {
		if (this._lastVisitedLine.lineNumber === lineNumber) {
			return this._lastVisitedLine.value;
		}

		this._lastVisitedLine.lineNumber = lineNumber;

		if (lineNumber === this._lineCnt) {
			this._lastVisitedLine.value = this.getLineRawContent(lineNumber);
		} else if (this._EOLNormalized) {
			this._lastVisitedLine.value = this.getLineRawContent(lineNumber, this._EOLLength);
		} else {
			this._lastVisitedLine.value = this.getLineRawContent(lineNumber).replace(/(\r\n|\r|\n)$/, '');
		}

		return this._lastVisitedLine.value;
	}

	private _getCharCode(nodePos: NodePosition): number {
		if (nodePos.remainder === nodePos.node.piece.length) {
			// the char we want to fetch is at the head of next node.
			const matchingNode = nodePos.node.next();
			if (!matchingNode) {
				return 0;
			}

			const buffer = this._buffers[matchingNode.piece.bufferIndex];
			const startOffset = this.offsetInBuffer(matchingNode.piece.bufferIndex, matchingNode.piece.start);
			return buffer.buffer.charCodeAt(startOffset);
		} else {
			const buffer = this._buffers[nodePos.node.piece.bufferIndex];
			const startOffset = this.offsetInBuffer(nodePos.node.piece.bufferIndex, nodePos.node.piece.start);
			const targetOffset = startOffset + nodePos.remainder;

			return buffer.buffer.charCodeAt(targetOffset);
		}
	}

	public getLineCharCode(lineNumber: number, index: number): number {
		const nodePos = this.nodeAt2(lineNumber, index + 1);
		return this._getCharCode(nodePos);
	}

	public getLineLength(lineNumber: number): number {
		if (lineNumber === this.getLineCount()) {
			const startOffset = this.getOffsetAt(lineNumber, 1);
			return this.getLength() - startOffset;
		}
		return this.getOffsetAt(lineNumber + 1, 1) - this.getOffsetAt(lineNumber, 1) - this._EOLLength;
	}

	public getCharCode(offset: number): number {
		const nodePos = this.nodeAt(offset);
		return this._getCharCode(nodePos);
	}

	public getNearestChunk(offset: number): string {
		const nodePos = this.nodeAt(offset);
		if (nodePos.remainder === nodePos.node.piece.length) {
			// the offset is at the head of next node.
			const matchingNode = nodePos.node.next();
			if (!matchingNode || matchingNode === SENTINEL) {
				return '';
			}

			const buffer = this._buffers[matchingNode.piece.bufferIndex];
			const startOffset = this.offsetInBuffer(matchingNode.piece.bufferIndex, matchingNode.piece.start);
			return buffer.buffer.substring(startOffset, startOffset + matchingNode.piece.length);
		} else {
			const buffer = this._buffers[nodePos.node.piece.bufferIndex];
			const startOffset = this.offsetInBuffer(nodePos.node.piece.bufferIndex, nodePos.node.piece.start);
			const targetOffset = startOffset + nodePos.remainder;
			const targetEnd = startOffset + nodePos.node.piece.length;
			return buffer.buffer.substring(targetOffset, targetEnd);
		}
	}

	public findMatchesInNode(node: TreeNode, searcher: Searcher, startLineNumber: number, startColumn: number, startCursor: BufferCursor, endCursor: BufferCursor, searchData: SearchData, captureMatches: boolean, limitResultCount: number, resultLen: number, result: FindMatch[]) {
		const buffer = this._buffers[node.piece.bufferIndex];
		const startOffsetInBuffer = this.offsetInBuffer(node.piece.bufferIndex, node.piece.start);
		const start = this.offsetInBuffer(node.piece.bufferIndex, startCursor);
		const end = this.offsetInBuffer(node.piece.bufferIndex, endCursor);

		let m: RegExpExecArray | null;
		// Reset regex to search from the beginning
		const ret: BufferCursor = { line: 0, column: 0 };
		let searchText: string;
		let offsetInBuffer: (offset: number) => number;

		if (searcher._wordSeparators) {
			searchText = buffer.buffer.substring(start, end);
			offsetInBuffer = (offset: number) => offset + start;
			searcher.reset(0);
		} else {
			searchText = buffer.buffer;
			offsetInBuffer = (offset: number) => offset;
			searcher.reset(start);
		}

		do {
			m = searcher.next(searchText);

			if (m) {
				if (offsetInBuffer(m.index) >= end) {
					return resultLen;
				}
				this.positionInBuffer(node, offsetInBuffer(m.index) - startOffsetInBuffer, ret);
				const lineFeedCnt = this.getLineFeedCnt(node.piece.bufferIndex, startCursor, ret);
				const retStartColumn = ret.line === startCursor.line ? ret.column - startCursor.column + startColumn : ret.column + 1;
				const retEndColumn = retStartColumn + m[0].length;
				result[resultLen++] = createFindMatch(new Range(startLineNumber + lineFeedCnt, retStartColumn, startLineNumber + lineFeedCnt, retEndColumn), m, captureMatches);

				if (offsetInBuffer(m.index) + m[0].length >= end) {
					return resultLen;
				}
				if (resultLen >= limitResultCount) {
					return resultLen;
				}
			}

		} while (m);

		return resultLen;
	}

	public findMatchesLineByLine(searchRange: Range, searchData: SearchData, captureMatches: boolean, limitResultCount: number): FindMatch[] {
		const result: FindMatch[] = [];
		let resultLen = 0;
		const searcher = new Searcher(searchData.wordSeparators, searchData.regex);

		let startPosition = this.nodeAt2(searchRange.startLineNumber, searchRange.startColumn);
		if (startPosition === null) {
			return [];
		}
		const endPosition = this.nodeAt2(searchRange.endLineNumber, searchRange.endColumn);
		if (endPosition === null) {
			return [];
		}
		let start = this.positionInBuffer(startPosition.node, startPosition.remainder);
		const end = this.positionInBuffer(endPosition.node, endPosition.remainder);

		if (startPosition.node === endPosition.node) {
			this.findMatchesInNode(startPosition.node, searcher, searchRange.startLineNumber, searchRange.startColumn, start, end, searchData, captureMatches, limitResultCount, resultLen, result);
			return result;
		}

		let startLineNumber = searchRange.startLineNumber;

		let currentNode = startPosition.node;
		while (currentNode !== endPosition.node) {
			const lineBreakCnt = this.getLineFeedCnt(currentNode.piece.bufferIndex, start, currentNode.piece.end);

			if (lineBreakCnt >= 1) {
				// last line break position
				const lineStarts = this._buffers[currentNode.piece.bufferIndex].lineStarts;
				const startOffsetInBuffer = this.offsetInBuffer(currentNode.piece.bufferIndex, currentNode.piece.start);
				const nextLineStartOffset = lineStarts[start.line + lineBreakCnt];
				const startColumn = startLineNumber === searchRange.startLineNumber ? searchRange.startColumn : 1;
				resultLen = this.findMatchesInNode(currentNode, searcher, startLineNumber, startColumn, start, this.positionInBuffer(currentNode, nextLineStartOffset - startOffsetInBuffer), searchData, captureMatches, limitResultCount, resultLen, result);

				if (resultLen >= limitResultCount) {
					return result;
				}

				startLineNumber += lineBreakCnt;
			}

			const startColumn = startLineNumber === searchRange.startLineNumber ? searchRange.startColumn - 1 : 0;
			// search for the remaining content
			if (startLineNumber === searchRange.endLineNumber) {
				const text = this.getLineContent(startLineNumber).substring(startColumn, searchRange.endColumn - 1);
				resultLen = this._findMatchesInLine(searchData, searcher, text, searchRange.endLineNumber, startColumn, resultLen, result, captureMatches, limitResultCount);
				return result;
			}

			resultLen = this._findMatchesInLine(searchData, searcher, this.getLineContent(startLineNumber).substr(startColumn), startLineNumber, startColumn, resultLen, result, captureMatches, limitResultCount);

			if (resultLen >= limitResultCount) {
				return result;
			}

			startLineNumber++;
			startPosition = this.nodeAt2(startLineNumber, 1);
			currentNode = startPosition.node;
			start = this.positionInBuffer(startPosition.node, startPosition.remainder);
		}

		if (startLineNumber === searchRange.endLineNumber) {
			const startColumn = startLineNumber === searchRange.startLineNumber ? searchRange.startColumn - 1 : 0;
			const text = this.getLineContent(startLineNumber).substring(startColumn, searchRange.endColumn - 1);
			resultLen = this._findMatchesInLine(searchData, searcher, text, searchRange.endLineNumber, startColumn, resultLen, result, captureMatches, limitResultCount);
			return result;
		}

		const startColumn = startLineNumber === searchRange.startLineNumber ? searchRange.startColumn : 1;
		resultLen = this.findMatchesInNode(endPosition.node, searcher, startLineNumber, startColumn, start, end, searchData, captureMatches, limitResultCount, resultLen, result);
		return result;
	}

	private _findMatchesInLine(searchData: SearchData, searcher: Searcher, text: string, lineNumber: number, deltaOffset: number, resultLen: number, result: FindMatch[], captureMatches: boolean, limitResultCount: number): number {
		const wordSeparators = searchData.wordSeparators;
		if (!captureMatches && searchData.simpleSearch) {
			const searchString = searchData.simpleSearch;
			const searchStringLen = searchString.length;
			const textLength = text.length;

			let lastMatchIndex = -searchStringLen;
			while ((lastMatchIndex = text.indexOf(searchString, lastMatchIndex + searchStringLen)) !== -1) {
				if (!wordSeparators || isValidMatch(wordSeparators, text, textLength, lastMatchIndex, searchStringLen)) {
					result[resultLen++] = new FindMatch(new Range(lineNumber, lastMatchIndex + 1 + deltaOffset, lineNumber, lastMatchIndex + 1 + searchStringLen + deltaOffset), null);
					if (resultLen >= limitResultCount) {
						return resultLen;
					}
				}
			}
			return resultLen;
		}

		let m: RegExpExecArray | null;
		// Reset regex to search from the beginning
		searcher.reset(0);
		do {
			m = searcher.next(text);
			if (m) {
				result[resultLen++] = createFindMatch(new Range(lineNumber, m.index + 1 + deltaOffset, lineNumber, m.index + 1 + m[0].length + deltaOffset), m, captureMatches);
				if (resultLen >= limitResultCount) {
					return resultLen;
				}
			}
		} while (m);
		return resultLen;
	}

	// #endregion

	// #region Piece Table
	public insert(offset: number, value: string, eolNormalized: boolean = false): void {
		this._EOLNormalized = this._EOLNormalized && eolNormalized;
		this._lastVisitedLine.lineNumber = 0;
		this._lastVisitedLine.value = '';

		if (this.root !== SENTINEL) {
			const { node, remainder, nodeStartOffset } = this.nodeAt(offset);
			const piece = node.piece;
			const bufferIndex = piece.bufferIndex;
			const insertPosInBuffer = this.positionInBuffer(node, remainder);
			if (node.piece.bufferIndex === 0 &&
				piece.end.line === this._lastChangeBufferPos.line &&
				piece.end.column === this._lastChangeBufferPos.column &&
				(nodeStartOffset + piece.length === offset) &&
				value.length < AverageBufferSize
			) {
				// changed buffer
				this.appendToNode(node, value);
				this.computeBufferMetadata();
				return;
			}

			if (nodeStartOffset === offset) {
				this.insertContentToNodeLeft(value, node);
				this._searchCache.validate(offset);
			} else if (nodeStartOffset + node.piece.length > offset) {
				// we are inserting into the middle of a node.
				const nodesToDel: TreeNode[] = [];
				let newRightPiece = new Piece(
					piece.bufferIndex,
					insertPosInBuffer,
					piece.end,
					this.getLineFeedCnt(piece.bufferIndex, insertPosInBuffer, piece.end),
					this.offsetInBuffer(bufferIndex, piece.end) - this.offsetInBuffer(bufferIndex, insertPosInBuffer)
				);

				if (this.shouldCheckCRLF() && this.endWithCR(value)) {
					const headOfRight = this.nodeCharCodeAt(node, remainder);

					if (headOfRight === 10 /** \n */) {
						const newStart: BufferCursor = { line: newRightPiece.start.line + 1, column: 0 };
						newRightPiece = new Piece(
							newRightPiece.bufferIndex,
							newStart,
							newRightPiece.end,
							this.getLineFeedCnt(newRightPiece.bufferIndex, newStart, newRightPiece.end),
							newRightPiece.length - 1
						);

						value += '\n';
					}
				}

				// reuse node for content before insertion point.
				if (this.shouldCheckCRLF() && this.startWithLF(value)) {
					const tailOfLeft = this.nodeCharCodeAt(node, remainder - 1);
					if (tailOfLeft === 13 /** \r */) {
						const previousPos = this.positionInBuffer(node, remainder - 1);
						this.deleteNodeTail(node, previousPos);
						value = '\r' + value;

						if (node.piece.length === 0) {
							nodesToDel.push(node);
						}
					} else {
						this.deleteNodeTail(node, insertPosInBuffer);
					}
				} else {
					this.deleteNodeTail(node, insertPosInBuffer);
				}

				const newPieces = this.createNewPieces(value);
				if (newRightPiece.length > 0) {
					this.rbInsertRight(node, newRightPiece);
				}

				let tmpNode = node;
				for (let k = 0; k < newPieces.length; k++) {
					tmpNode = this.rbInsertRight(tmpNode, newPieces[k]);
				}
				this.deleteNodes(nodesToDel);
			} else {
				this.insertContentToNodeRight(value, node);
			}
		} else {
			// insert new node
			const pieces = this.createNewPieces(value);
			let node = this.rbInsertLeft(null, pieces[0]);

			for (let k = 1; k < pieces.length; k++) {
				node = this.rbInsertRight(node, pieces[k]);
			}
		}

		// todo, this is too brutal. Total line feed count should be updated the same way as lf_left.
		this.computeBufferMetadata();
	}

	public delete(offset: number, cnt: number): void {
		this._lastVisitedLine.lineNumber = 0;
		this._lastVisitedLine.value = '';

		if (cnt <= 0 || this.root === SENTINEL) {
			return;
		}

		const startPosition = this.nodeAt(offset);
		const endPosition = this.nodeAt(offset + cnt);
		const startNode = startPosition.node;
		const endNode = endPosition.node;

		if (startNode === endNode) {
			const startSplitPosInBuffer = this.positionInBuffer(startNode, startPosition.remainder);
			const endSplitPosInBuffer = this.positionInBuffer(startNode, endPosition.remainder);

			if (startPosition.nodeStartOffset === offset) {
				if (cnt === startNode.piece.length) { // delete node
					const next = startNode.next();
					rbDelete(this, startNode);
					this.validateCRLFWithPrevNode(next);
					this.computeBufferMetadata();
					return;
				}
				this.deleteNodeHead(startNode, endSplitPosInBuffer);
				this._searchCache.validate(offset);
				this.validateCRLFWithPrevNode(startNode);
				this.computeBufferMetadata();
				return;
			}

			if (startPosition.nodeStartOffset + startNode.piece.length === offset + cnt) {
				this.deleteNodeTail(startNode, startSplitPosInBuffer);
				this.validateCRLFWithNextNode(startNode);
				this.computeBufferMetadata();
				return;
			}

			// delete content in the middle, this node will be splitted to nodes
			this.shrinkNode(startNode, startSplitPosInBuffer, endSplitPosInBuffer);
			this.computeBufferMetadata();
			return;
		}

		const nodesToDel: TreeNode[] = [];

		const startSplitPosInBuffer = this.positionInBuffer(startNode, startPosition.remainder);
		this.deleteNodeTail(startNode, startSplitPosInBuffer);
		this._searchCache.validate(offset);
		if (startNode.piece.length === 0) {
			nodesToDel.push(startNode);
		}

		// update last touched node
		const endSplitPosInBuffer = this.positionInBuffer(endNode, endPosition.remainder);
		this.deleteNodeHead(endNode, endSplitPosInBuffer);
		if (endNode.piece.length === 0) {
			nodesToDel.push(endNode);
		}

		// delete nodes in between
		const secondNode = startNode.next();
		for (let node = secondNode; node !== SENTINEL && node !== endNode; node = node.next()) {
			nodesToDel.push(node);
		}

		const prev = startNode.piece.length === 0 ? startNode.prev() : startNode;
		this.deleteNodes(nodesToDel);
		this.validateCRLFWithNextNode(prev);
		this.computeBufferMetadata();
	}

	private insertContentToNodeLeft(value: string, node: TreeNode) {
		// we are inserting content to the beginning of node
		const nodesToDel: TreeNode[] = [];
		if (this.shouldCheckCRLF() && this.endWithCR(value) && this.startWithLF(node)) {
			// move `\n` to new node.

			const piece = node.piece;
			const newStart: BufferCursor = { line: piece.start.line + 1, column: 0 };
			const nPiece = new Piece(
				piece.bufferIndex,
				newStart,
				piece.end,
				this.getLineFeedCnt(piece.bufferIndex, newStart, piece.end),
				piece.length - 1
			);

			node.piece = nPiece;

			value += '\n';
			updateTreeMetadata(this, node, -1, -1);

			if (node.piece.length === 0) {
				nodesToDel.push(node);
			}
		}

		const newPieces = this.createNewPieces(value);
		let newNode = this.rbInsertLeft(node, newPieces[newPieces.length - 1]);
		for (let k = newPieces.length - 2; k >= 0; k--) {
			newNode = this.rbInsertLeft(newNode, newPieces[k]);
		}
		this.validateCRLFWithPrevNode(newNode);
		this.deleteNodes(nodesToDel);
	}

	private insertContentToNodeRight(value: string, node: TreeNode) {
		// we are inserting to the right of this node.
		if (this.adjustCarriageReturnFromNext(value, node)) {
			// move \n to the new node.
			value += '\n';
		}

		const newPieces = this.createNewPieces(value);
		const newNode = this.rbInsertRight(node, newPieces[0]);
		let tmpNode = newNode;

		for (let k = 1; k < newPieces.length; k++) {
			tmpNode = this.rbInsertRight(tmpNode, newPieces[k]);
		}

		this.validateCRLFWithPrevNode(newNode);
	}

	private positionInBuffer(node: TreeNode, remainder: number): BufferCursor;
	private positionInBuffer(node: TreeNode, remainder: number, ret: BufferCursor): null;
	private positionInBuffer(node: TreeNode, remainder: number, ret?: BufferCursor): BufferCursor | null {
		const piece = node.piece;
		const bufferIndex = node.piece.bufferIndex;
		const lineStarts = this._buffers[bufferIndex].lineStarts;

		const startOffset = lineStarts[piece.start.line] + piece.start.column;

		const offset = startOffset + remainder;

		// binary search offset between startOffset and endOffset
		let low = piece.start.line;
		let high = piece.end.line;

		let mid: number = 0;
		let midStop: number = 0;
		let midStart: number = 0;

		while (low <= high) {
			mid = low + ((high - low) / 2) | 0;
			midStart = lineStarts[mid];

			if (mid === high) {
				break;
			}

			midStop = lineStarts[mid + 1];

			if (offset < midStart) {
				high = mid - 1;
			} else if (offset >= midStop) {
				low = mid + 1;
			} else {
				break;
			}
		}

		if (ret) {
			ret.line = mid;
			ret.column = offset - midStart;
			return null;
		}

		return {
			line: mid,
			column: offset - midStart
		};
	}

	private getLineFeedCnt(bufferIndex: number, start: BufferCursor, end: BufferCursor): number {
		// we don't need to worry about start: abc\r|\n, or abc|\r, or abc|\n, or abc|\r\n doesn't change the fact that, there is one line break after start.
		// now let's take care of end: abc\r|\n, if end is in between \r and \n, we need to add line feed count by 1
		if (end.column === 0) {
			return end.line - start.line;
		}

		const lineStarts = this._buffers[bufferIndex].lineStarts;
		if (end.line === lineStarts.length - 1) { // it means, there is no \n after end, otherwise, there will be one more lineStart.
			return end.line - start.line;
		}

		const nextLineStartOffset = lineStarts[end.line + 1];
		const endOffset = lineStarts[end.line] + end.column;
		if (nextLineStartOffset > endOffset + 1) { // there are more than 1 character after end, which means it can't be \n
			return end.line - start.line;
		}
		// endOffset + 1 === nextLineStartOffset
		// character at endOffset is \n, so we check the character before first
		// if character at endOffset is \r, end.column is 0 and we can't get here.
		const previousCharOffset = endOffset - 1; // end.column > 0 so it's okay.
		const buffer = this._buffers[bufferIndex].buffer;

		if (buffer.charCodeAt(previousCharOffset) === 13) {
			return end.line - start.line + 1;
		} else {
			return end.line - start.line;
		}
	}

	private offsetInBuffer(bufferIndex: number, cursor: BufferCursor): number {
		const lineStarts = this._buffers[bufferIndex].lineStarts;
		return lineStarts[cursor.line] + cursor.column;
	}

	private deleteNodes(nodes: TreeNode[]): void {
		for (let i = 0; i < nodes.length; i++) {
			rbDelete(this, nodes[i]);
		}
	}

	private createNewPieces(text: string): Piece[] {
		if (text.length > AverageBufferSize) {
			// the content is large, operations like substring, charCode becomes slow
			// so here we split it into smaller chunks, just like what we did for CR/LF normalization
			const newPieces: Piece[] = [];
			while (text.length > AverageBufferSize) {
				const lastChar = text.charCodeAt(AverageBufferSize - 1);
				let splitText;
				if (lastChar === CharCode.CarriageReturn || (lastChar >= 0xD800 && lastChar <= 0xDBFF)) {
					// last character is \r or a high surrogate => keep it back
					splitText = text.substring(0, AverageBufferSize - 1);
					text = text.substring(AverageBufferSize - 1);
				} else {
					splitText = text.substring(0, AverageBufferSize);
					text = text.substring(AverageBufferSize);
				}

				const lineStarts = createLineStartsFast(splitText);
				newPieces.push(new Piece(
					this._buffers.length, /* buffer index */
					{ line: 0, column: 0 },
					{ line: lineStarts.length - 1, column: splitText.length - lineStarts[lineStarts.length - 1] },
					lineStarts.length - 1,
					splitText.length
				));
				this._buffers.push(new StringBuffer(splitText, lineStarts));
			}

			const lineStarts = createLineStartsFast(text);
			newPieces.push(new Piece(
				this._buffers.length, /* buffer index */
				{ line: 0, column: 0 },
				{ line: lineStarts.length - 1, column: text.length - lineStarts[lineStarts.length - 1] },
				lineStarts.length - 1,
				text.length
			));
			this._buffers.push(new StringBuffer(text, lineStarts));

			return newPieces;
		}

		let startOffset = this._buffers[0].buffer.length;
		const lineStarts = createLineStartsFast(text, false);

		let start = this._lastChangeBufferPos;
		if (this._buffers[0].lineStarts[this._buffers[0].lineStarts.length - 1] === startOffset
			&& startOffset !== 0
			&& this.startWithLF(text)
			&& this.endWithCR(this._buffers[0].buffer) // todo, we can check this._lastChangeBufferPos's column as it's the last one
		) {
			this._lastChangeBufferPos = { line: this._lastChangeBufferPos.line, column: this._lastChangeBufferPos.column + 1 };
			start = this._lastChangeBufferPos;

			for (let i = 0; i < lineStarts.length; i++) {
				lineStarts[i] += startOffset + 1;
			}

			this._buffers[0].lineStarts = (<number[]>this._buffers[0].lineStarts).concat(<number[]>lineStarts.slice(1));
			this._buffers[0].buffer += '_' + text;
			startOffset += 1;
		} else {
			if (startOffset !== 0) {
				for (let i = 0; i < lineStarts.length; i++) {
					lineStarts[i] += startOffset;
				}
			}
			this._buffers[0].lineStarts = (<number[]>this._buffers[0].lineStarts).concat(<number[]>lineStarts.slice(1));
			this._buffers[0].buffer += text;
		}

		const endOffset = this._buffers[0].buffer.length;
		const endIndex = this._buffers[0].lineStarts.length - 1;
		const endColumn = endOffset - this._buffers[0].lineStarts[endIndex];
		const endPos = { line: endIndex, column: endColumn };
		const newPiece = new Piece(
			0, /** todo@peng */
			start,
			endPos,
			this.getLineFeedCnt(0, start, endPos),
			endOffset - startOffset
		);
		this._lastChangeBufferPos = endPos;
		return [newPiece];
	}

	public getLinesRawContent(): string {
		return this.getContentOfSubTree(this.root);
	}

	public getLineRawContent(lineNumber: number, endOffset: number = 0): string {
		let x = this.root;

		let ret = '';
		const cache = this._searchCache.get2(lineNumber);
		if (cache) {
			x = cache.node;
			const prevAccumulatedValue = this.getAccumulatedValue(x, lineNumber - cache.nodeStartLineNumber - 1);
			const buffer = this._buffers[x.piece.bufferIndex].buffer;
			const startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
			if (cache.nodeStartLineNumber + x.piece.lineFeedCnt === lineNumber) {
				ret = buffer.substring(startOffset + prevAccumulatedValue, startOffset + x.piece.length);
			} else {
				const accumulatedValue = this.getAccumulatedValue(x, lineNumber - cache.nodeStartLineNumber);
				return buffer.substring(startOffset + prevAccumulatedValue, startOffset + accumulatedValue - endOffset);
			}
		} else {
			let nodeStartOffset = 0;
			const originalLineNumber = lineNumber;
			while (x !== SENTINEL) {
				if (x.left !== SENTINEL && x.lf_left >= lineNumber - 1) {
					x = x.left;
				} else if (x.lf_left + x.piece.lineFeedCnt > lineNumber - 1) {
					const prevAccumulatedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 2);
					const accumulatedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 1);
					const buffer = this._buffers[x.piece.bufferIndex].buffer;
					const startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
					nodeStartOffset += x.size_left;
					this._searchCache.set({
						node: x,
						nodeStartOffset,
						nodeStartLineNumber: originalLineNumber - (lineNumber - 1 - x.lf_left)
					});

					return buffer.substring(startOffset + prevAccumulatedValue, startOffset + accumulatedValue - endOffset);
				} else if (x.lf_left + x.piece.lineFeedCnt === lineNumber - 1) {
					const prevAccumulatedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 2);
					const buffer = this._buffers[x.piece.bufferIndex].buffer;
					const startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);

					ret = buffer.substring(startOffset + prevAccumulatedValue, startOffset + x.piece.length);
					break;
				} else {
					lineNumber -= x.lf_left + x.piece.lineFeedCnt;
					nodeStartOffset += x.size_left + x.piece.length;
					x = x.right;
				}
			}
		}

		// search in order, to find the node contains end column
		x = x.next();
		while (x !== SENTINEL) {
			const buffer = this._buffers[x.piece.bufferIndex].buffer;

			if (x.piece.lineFeedCnt > 0) {
				const accumulatedValue = this.getAccumulatedValue(x, 0);
				const startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);

				ret += buffer.substring(startOffset, startOffset + accumulatedValue - endOffset);
				return ret;
			} else {
				const startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
				ret += buffer.substr(startOffset, x.piece.length);
			}

			x = x.next();
		}

		return ret;
	}

	private computeBufferMetadata() {
		let x = this.root;

		let lfCnt = 1;
		let len = 0;

		while (x !== SENTINEL) {
			lfCnt += x.lf_left + x.piece.lineFeedCnt;
			len += x.size_left + x.piece.length;
			x = x.right;
		}

		this._lineCnt = lfCnt;
		this._length = len;
		this._searchCache.validate(this._length);
	}

	// #region node operations
	private getIndexOf(node: TreeNode, accumulatedValue: number): { index: number; remainder: number } {
		const piece = node.piece;
		const pos = this.positionInBuffer(node, accumulatedValue);
		const lineCnt = pos.line - piece.start.line;

		if (this.offsetInBuffer(piece.bufferIndex, piece.end) - this.offsetInBuffer(piece.bufferIndex, piece.start) === accumulatedValue) {
			// we are checking the end of this node, so a CRLF check is necessary.
			const realLineCnt = this.getLineFeedCnt(node.piece.bufferIndex, piece.start, pos);
			if (realLineCnt !== lineCnt) {
				// aha yes, CRLF
				return { index: realLineCnt, remainder: 0 };
			}
		}

		return { index: lineCnt, remainder: pos.column };
	}

	private getAccumulatedValue(node: TreeNode, index: number) {
		if (index < 0) {
			return 0;
		}
		const piece = node.piece;
		const lineStarts = this._buffers[piece.bufferIndex].lineStarts;
		const expectedLineStartIndex = piece.start.line + index + 1;
		if (expectedLineStartIndex > piece.end.line) {
			return lineStarts[piece.end.line] + piece.end.column - lineStarts[piece.start.line] - piece.start.column;
		} else {
			return lineStarts[expectedLineStartIndex] - lineStarts[piece.start.line] - piece.start.column;
		}
	}

	private deleteNodeTail(node: TreeNode, pos: BufferCursor) {
		const piece = node.piece;
		const originalLFCnt = piece.lineFeedCnt;
		const originalEndOffset = this.offsetInBuffer(piece.bufferIndex, piece.end);

		const newEnd = pos;
		const newEndOffset = this.offsetInBuffer(piece.bufferIndex, newEnd);
		const newLineFeedCnt = this.getLineFeedCnt(piece.bufferIndex, piece.start, newEnd);

		const lf_delta = newLineFeedCnt - originalLFCnt;
		const size_delta = newEndOffset - originalEndOffset;
		const newLength = piece.length + size_delta;

		node.piece = new Piece(
			piece.bufferIndex,
			piece.start,
			newEnd,
			newLineFeedCnt,
			newLength
		);

		updateTreeMetadata(this, node, size_delta, lf_delta);
	}

	private deleteNodeHead(node: TreeNode, pos: BufferCursor) {
		const piece = node.piece;
		const originalLFCnt = piece.lineFeedCnt;
		const originalStartOffset = this.offsetInBuffer(piece.bufferIndex, piece.start);

		const newStart = pos;
		const newLineFeedCnt = this.getLineFeedCnt(piece.bufferIndex, newStart, piece.end);
		const newStartOffset = this.offsetInBuffer(piece.bufferIndex, newStart);
		const lf_delta = newLineFeedCnt - originalLFCnt;
		const size_delta = originalStartOffset - newStartOffset;
		const newLength = piece.length + size_delta;
		node.piece = new Piece(
			piece.bufferIndex,
			newStart,
			piece.end,
			newLineFeedCnt,
			newLength
		);

		updateTreeMetadata(this, node, size_delta, lf_delta);
	}

	private shrinkNode(node: TreeNode, start: BufferCursor, end: BufferCursor) {
		const piece = node.piece;
		const originalStartPos = piece.start;
		const originalEndPos = piece.end;

		// old piece, originalStartPos, start
		const oldLength = piece.length;
		const oldLFCnt = piece.lineFeedCnt;
		const newEnd = start;
		const newLineFeedCnt = this.getLineFeedCnt(piece.bufferIndex, piece.start, newEnd);
		const newLength = this.offsetInBuffer(piece.bufferIndex, start) - this.offsetInBuffer(piece.bufferIndex, originalStartPos);

		node.piece = new Piece(
			piece.bufferIndex,
			piece.start,
			newEnd,
			newLineFeedCnt,
			newLength
		);

		updateTreeMetadata(this, node, newLength - oldLength, newLineFeedCnt - oldLFCnt);

		// new right piece, end, originalEndPos
		const newPiece = new Piece(
			piece.bufferIndex,
			end,
			originalEndPos,
			this.getLineFeedCnt(piece.bufferIndex, end, originalEndPos),
			this.offsetInBuffer(piece.bufferIndex, originalEndPos) - this.offsetInBuffer(piece.bufferIndex, end)
		);

		const newNode = this.rbInsertRight(node, newPiece);
		this.validateCRLFWithPrevNode(newNode);
	}

	private appendToNode(node: TreeNode, value: string): void {
		if (this.adjustCarriageReturnFromNext(value, node)) {
			value += '\n';
		}

		const hitCRLF = this.shouldCheckCRLF() && this.startWithLF(value) && this.endWithCR(node);
		const startOffset = this._buffers[0].buffer.length;
		this._buffers[0].buffer += value;
		const lineStarts = createLineStartsFast(value, false);
		for (let i = 0; i < lineStarts.length; i++) {
			lineStarts[i] += startOffset;
		}
		if (hitCRLF) {
			const prevStartOffset = this._buffers[0].lineStarts[this._buffers[0].lineStarts.length - 2];
			(<number[]>this._buffers[0].lineStarts).pop();
			// _lastChangeBufferPos is already wrong
			this._lastChangeBufferPos = { line: this._lastChangeBufferPos.line - 1, column: startOffset - prevStartOffset };
		}

		this._buffers[0].lineStarts = (<number[]>this._buffers[0].lineStarts).concat(<number[]>lineStarts.slice(1));
		const endIndex = this._buffers[0].lineStarts.length - 1;
		const endColumn = this._buffers[0].buffer.length - this._buffers[0].lineStarts[endIndex];
		const newEnd = { line: endIndex, column: endColumn };
		const newLength = node.piece.length + value.length;
		const oldLineFeedCnt = node.piece.lineFeedCnt;
		const newLineFeedCnt = this.getLineFeedCnt(0, node.piece.start, newEnd);
		const lf_delta = newLineFeedCnt - oldLineFeedCnt;

		node.piece = new Piece(
			node.piece.bufferIndex,
			node.piece.start,
			newEnd,
			newLineFeedCnt,
			newLength
		);

		this._lastChangeBufferPos = newEnd;
		updateTreeMetadata(this, node, value.length, lf_delta);
	}

	private nodeAt(offset: number): NodePosition {
		let x = this.root;
		const cache = this._searchCache.get(offset);
		if (cache) {
			return {
				node: cache.node,
				nodeStartOffset: cache.nodeStartOffset,
				remainder: offset - cache.nodeStartOffset
			};
		}

		let nodeStartOffset = 0;

		while (x !== SENTINEL) {
			if (x.size_left > offset) {
				x = x.left;
			} else if (x.size_left + x.piece.length >= offset) {
				nodeStartOffset += x.size_left;
				const ret = {
					node: x,
					remainder: offset - x.size_left,
					nodeStartOffset
				};
				this._searchCache.set(ret);
				return ret;
			} else {
				offset -= x.size_left + x.piece.length;
				nodeStartOffset += x.size_left + x.piece.length;
				x = x.right;
			}
		}

		return null!;
	}

	private nodeAt2(lineNumber: number, column: number): NodePosition {
		let x = this.root;
		let nodeStartOffset = 0;

		while (x !== SENTINEL) {
			if (x.left !== SENTINEL && x.lf_left >= lineNumber - 1) {
				x = x.left;
			} else if (x.lf_left + x.piece.lineFeedCnt > lineNumber - 1) {
				const prevAccumualtedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 2);
				const accumulatedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 1);
				nodeStartOffset += x.size_left;

				return {
					node: x,
					remainder: Math.min(prevAccumualtedValue + column - 1, accumulatedValue),
					nodeStartOffset
				};
			} else if (x.lf_left + x.piece.lineFeedCnt === lineNumber - 1) {
				const prevAccumualtedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 2);
				if (prevAccumualtedValue + column - 1 <= x.piece.length) {
					return {
						node: x,
						remainder: prevAccumualtedValue + column - 1,
						nodeStartOffset
					};
				} else {
					column -= x.piece.length - prevAccumualtedValue;
					break;
				}
			} else {
				lineNumber -= x.lf_left + x.piece.lineFeedCnt;
				nodeStartOffset += x.size_left + x.piece.length;
				x = x.right;
			}
		}

		// search in order, to find the node contains position.column
		x = x.next();
		while (x !== SENTINEL) {

			if (x.piece.lineFeedCnt > 0) {
				const accumulatedValue = this.getAccumulatedValue(x, 0);
				const nodeStartOffset = this.offsetOfNode(x);
				return {
					node: x,
					remainder: Math.min(column - 1, accumulatedValue),
					nodeStartOffset
				};
			} else {
				if (x.piece.length >= column - 1) {
					const nodeStartOffset = this.offsetOfNode(x);
					return {
						node: x,
						remainder: column - 1,
						nodeStartOffset
					};
				} else {
					column -= x.piece.length;
				}
			}

			x = x.next();
		}

		return null!;
	}

	private nodeCharCodeAt(node: TreeNode, offset: number): number {
		if (node.piece.lineFeedCnt < 1) {
			return -1;
		}
		const buffer = this._buffers[node.piece.bufferIndex];
		const newOffset = this.offsetInBuffer(node.piece.bufferIndex, node.piece.start) + offset;
		return buffer.buffer.charCodeAt(newOffset);
	}

	private offsetOfNode(node: TreeNode): number {
		if (!node) {
			return 0;
		}
		let pos = node.size_left;
		while (node !== this.root) {
			if (node.parent.right === node) {
				pos += node.parent.size_left + node.parent.piece.length;
			}

			node = node.parent;
		}

		return pos;
	}

	// #endregion

	// #region CRLF
	private shouldCheckCRLF() {
		return !(this._EOLNormalized && this._EOL === '\n');
	}

	private startWithLF(val: string | TreeNode): boolean {
		if (typeof val === 'string') {
			return val.charCodeAt(0) === 10;
		}

		if (val === SENTINEL || val.piece.lineFeedCnt === 0) {
			return false;
		}

		const piece = val.piece;
		const lineStarts = this._buffers[piece.bufferIndex].lineStarts;
		const line = piece.start.line;
		const startOffset = lineStarts[line] + piece.start.column;
		if (line === lineStarts.length - 1) {
			// last line, so there is no line feed at the end of this line
			return false;
		}
		const nextLineOffset = lineStarts[line + 1];
		if (nextLineOffset > startOffset + 1) {
			return false;
		}
		return this._buffers[piece.bufferIndex].buffer.charCodeAt(startOffset) === 10;
	}

	private endWithCR(val: string | TreeNode): boolean {
		if (typeof val === 'string') {
			return val.charCodeAt(val.length - 1) === 13;
		}

		if (val === SENTINEL || val.piece.lineFeedCnt === 0) {
			return false;
		}

		return this.nodeCharCodeAt(val, val.piece.length - 1) === 13;
	}

	private validateCRLFWithPrevNode(nextNode: TreeNode) {
		if (this.shouldCheckCRLF() && this.startWithLF(nextNode)) {
			const node = nextNode.prev();
			if (this.endWithCR(node)) {
				this.fixCRLF(node, nextNode);
			}
		}
	}

	private validateCRLFWithNextNode(node: TreeNode) {
		if (this.shouldCheckCRLF() && this.endWithCR(node)) {
			const nextNode = node.next();
			if (this.startWithLF(nextNode)) {
				this.fixCRLF(node, nextNode);
			}
		}
	}

	private fixCRLF(prev: TreeNode, next: TreeNode) {
		const nodesToDel: TreeNode[] = [];
		// update node
		const lineStarts = this._buffers[prev.piece.bufferIndex].lineStarts;
		let newEnd: BufferCursor;
		if (prev.piece.end.column === 0) {
			// it means, last line ends with \r, not \r\n
			newEnd = { line: prev.piece.end.line - 1, column: lineStarts[prev.piece.end.line] - lineStarts[prev.piece.end.line - 1] - 1 };
		} else {
			// \r\n
			newEnd = { line: prev.piece.end.line, column: prev.piece.end.column - 1 };
		}

		const prevNewLength = prev.piece.length - 1;
		const prevNewLFCnt = prev.piece.lineFeedCnt - 1;
		prev.piece = new Piece(
			prev.piece.bufferIndex,
			prev.piece.start,
			newEnd,
			prevNewLFCnt,
			prevNewLength
		);

		updateTreeMetadata(this, prev, -1, -1);
		if (prev.piece.length === 0) {
			nodesToDel.push(prev);
		}

		// update nextNode
		const newStart: BufferCursor = { line: next.piece.start.line + 1, column: 0 };
		const newLength = next.piece.length - 1;
		const newLineFeedCnt = this.getLineFeedCnt(next.piece.bufferIndex, newStart, next.piece.end);
		next.piece = new Piece(
			next.piece.bufferIndex,
			newStart,
			next.piece.end,
			newLineFeedCnt,
			newLength
		);

		updateTreeMetadata(this, next, -1, -1);
		if (next.piece.length === 0) {
			nodesToDel.push(next);
		}

		// create new piece which contains \r\n
		const pieces = this.createNewPieces('\r\n');
		this.rbInsertRight(prev, pieces[0]);
		// delete empty nodes

		for (let i = 0; i < nodesToDel.length; i++) {
			rbDelete(this, nodesToDel[i]);
		}
	}

	private adjustCarriageReturnFromNext(value: string, node: TreeNode): boolean {
		if (this.shouldCheckCRLF() && this.endWithCR(value)) {
			const nextNode = node.next();
			if (this.startWithLF(nextNode)) {
				// move `\n` forward
				value += '\n';

				if (nextNode.piece.length === 1) {
					rbDelete(this, nextNode);
				} else {

					const piece = nextNode.piece;
					const newStart: BufferCursor = { line: piece.start.line + 1, column: 0 };
					const newLength = piece.length - 1;
					const newLineFeedCnt = this.getLineFeedCnt(piece.bufferIndex, newStart, piece.end);
					nextNode.piece = new Piece(
						piece.bufferIndex,
						newStart,
						piece.end,
						newLineFeedCnt,
						newLength
					);

					updateTreeMetadata(this, nextNode, -1, -1);
				}
				return true;
			}
		}

		return false;
	}

	// #endregion

	// #endregion

	// #region Tree operations
	iterate(node: TreeNode, callback: (node: TreeNode) => boolean): boolean {
		if (node === SENTINEL) {
			return callback(SENTINEL);
		}

		const leftRet = this.iterate(node.left, callback);
		if (!leftRet) {
			return leftRet;
		}

		return callback(node) && this.iterate(node.right, callback);
	}

	private getNodeContent(node: TreeNode) {
		if (node === SENTINEL) {
			return '';
		}
		const buffer = this._buffers[node.piece.bufferIndex];
		const piece = node.piece;
		const startOffset = this.offsetInBuffer(piece.bufferIndex, piece.start);
		const endOffset = this.offsetInBuffer(piece.bufferIndex, piece.end);
		const currentContent = buffer.buffer.substring(startOffset, endOffset);
		return currentContent;
	}

	getPieceContent(piece: Piece) {
		const buffer = this._buffers[piece.bufferIndex];
		const startOffset = this.offsetInBuffer(piece.bufferIndex, piece.start);
		const endOffset = this.offsetInBuffer(piece.bufferIndex, piece.end);
		const currentContent = buffer.buffer.substring(startOffset, endOffset);
		return currentContent;
	}

	/**
	 *      node              node
	 *     /  \              /  \
	 *    a   b    <----   a    b
	 *                         /
	 *                        z
	 */
	private rbInsertRight(node: TreeNode | null, p: Piece): TreeNode {
		const z = new TreeNode(p, NodeColor.Red);
		z.left = SENTINEL;
		z.right = SENTINEL;
		z.parent = SENTINEL;
		z.size_left = 0;
		z.lf_left = 0;

		const x = this.root;
		if (x === SENTINEL) {
			this.root = z;
			z.color = NodeColor.Black;
		} else if (node!.right === SENTINEL) {
			node!.right = z;
			z.parent = node!;
		} else {
			const nextNode = leftest(node!.right);
			nextNode.left = z;
			z.parent = nextNode;
		}

		fixInsert(this, z);
		return z;
	}

	/**
	 *      node              node
	 *     /  \              /  \
	 *    a   b     ---->   a    b
	 *                       \
	 *                        z
	 */
	private rbInsertLeft(node: TreeNode | null, p: Piece): TreeNode {
		const z = new TreeNode(p, NodeColor.Red);
		z.left = SENTINEL;
		z.right = SENTINEL;
		z.parent = SENTINEL;
		z.size_left = 0;
		z.lf_left = 0;

		if (this.root === SENTINEL) {
			this.root = z;
			z.color = NodeColor.Black;
		} else if (node!.left === SENTINEL) {
			node!.left = z;
			z.parent = node!;
		} else {
			const prevNode = righttest(node!.left); // a
			prevNode.right = z;
			z.parent = prevNode;
		}

		fixInsert(this, z);
		return z;
	}

	private getContentOfSubTree(node: TreeNode): string {
		let str = '';

		this.iterate(node, node => {
			str += this.getNodeContent(node);
			return true;
		});

		return str;
	}
	// #endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/pieceTreeTextBuffer/pieceTreeTextBuffer.ts]---
Location: vscode-main/src/vs/editor/common/model/pieceTreeTextBuffer/pieceTreeTextBuffer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import * as strings from '../../../../base/common/strings.js';
import { Position } from '../../core/position.js';
import { Range } from '../../core/range.js';
import { ApplyEditsResult, EndOfLinePreference, FindMatch, IInternalModelContentChange, ISingleEditOperationIdentifier, ITextBuffer, ITextSnapshot, ValidAnnotatedEditOperation, IValidEditOperation, SearchData } from '../../model.js';
import { PieceTreeBase, StringBuffer } from './pieceTreeBase.js';
import { countEOL, StringEOL } from '../../core/misc/eolCounter.js';
import { TextChange } from '../../core/textChange.js';
import { Disposable } from '../../../../base/common/lifecycle.js';

export interface IValidatedEditOperation {
	sortIndex: number;
	identifier: ISingleEditOperationIdentifier | null;
	range: Range;
	rangeOffset: number;
	rangeLength: number;
	text: string;
	eolCount: number;
	firstLineLength: number;
	lastLineLength: number;
	forceMoveMarkers: boolean;
	isAutoWhitespaceEdit: boolean;
}

interface IReverseSingleEditOperation extends IValidEditOperation {
	sortIndex: number;
}

export class PieceTreeTextBuffer extends Disposable implements ITextBuffer {
	private _pieceTree: PieceTreeBase;
	private readonly _BOM: string;
	private _mightContainRTL: boolean;
	private _mightContainUnusualLineTerminators: boolean;
	private _mightContainNonBasicASCII: boolean;

	private readonly _onDidChangeContent: Emitter<void> = this._register(new Emitter<void>());
	public get onDidChangeContent(): Event<void> { return this._onDidChangeContent.event; }

	constructor(chunks: StringBuffer[], BOM: string, eol: '\r\n' | '\n', containsRTL: boolean, containsUnusualLineTerminators: boolean, isBasicASCII: boolean, eolNormalized: boolean) {
		super();
		this._BOM = BOM;
		this._mightContainNonBasicASCII = !isBasicASCII;
		this._mightContainRTL = containsRTL;
		this._mightContainUnusualLineTerminators = containsUnusualLineTerminators;
		this._pieceTree = new PieceTreeBase(chunks, eol, eolNormalized);
	}

	// #region TextBuffer
	public equals(other: ITextBuffer): boolean {
		if (!(other instanceof PieceTreeTextBuffer)) {
			return false;
		}
		if (this._BOM !== other._BOM) {
			return false;
		}
		if (this.getEOL() !== other.getEOL()) {
			return false;
		}
		return this._pieceTree.equal(other._pieceTree);
	}
	public mightContainRTL(): boolean {
		return this._mightContainRTL;
	}
	public mightContainUnusualLineTerminators(): boolean {
		return this._mightContainUnusualLineTerminators;
	}
	public resetMightContainUnusualLineTerminators(): void {
		this._mightContainUnusualLineTerminators = false;
	}
	public mightContainNonBasicASCII(): boolean {
		return this._mightContainNonBasicASCII;
	}
	public getBOM(): string {
		return this._BOM;
	}
	public getEOL(): '\r\n' | '\n' {
		return this._pieceTree.getEOL();
	}

	public createSnapshot(preserveBOM: boolean): ITextSnapshot {
		return this._pieceTree.createSnapshot(preserveBOM ? this._BOM : '');
	}

	public getOffsetAt(lineNumber: number, column: number): number {
		return this._pieceTree.getOffsetAt(lineNumber, column);
	}

	public getPositionAt(offset: number): Position {
		return this._pieceTree.getPositionAt(offset);
	}

	public getRangeAt(start: number, length: number): Range {
		const end = start + length;
		const startPosition = this.getPositionAt(start);
		const endPosition = this.getPositionAt(end);
		return new Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
	}

	public getValueInRange(range: Range, eol: EndOfLinePreference = EndOfLinePreference.TextDefined): string {
		if (range.isEmpty()) {
			return '';
		}

		const lineEnding = this._getEndOfLine(eol);
		return this._pieceTree.getValueInRange(range, lineEnding);
	}

	public getValueLengthInRange(range: Range, eol: EndOfLinePreference = EndOfLinePreference.TextDefined): number {
		if (range.isEmpty()) {
			return 0;
		}

		if (range.startLineNumber === range.endLineNumber) {
			return (range.endColumn - range.startColumn);
		}

		const startOffset = this.getOffsetAt(range.startLineNumber, range.startColumn);
		const endOffset = this.getOffsetAt(range.endLineNumber, range.endColumn);

		// offsets use the text EOL, so we need to compensate for length differences
		// if the requested EOL doesn't match the text EOL
		let eolOffsetCompensation = 0;
		const desiredEOL = this._getEndOfLine(eol);
		const actualEOL = this.getEOL();
		if (desiredEOL.length !== actualEOL.length) {
			const delta = desiredEOL.length - actualEOL.length;
			const eolCount = range.endLineNumber - range.startLineNumber;
			eolOffsetCompensation = delta * eolCount;
		}

		return endOffset - startOffset + eolOffsetCompensation;
	}

	public getCharacterCountInRange(range: Range, eol: EndOfLinePreference = EndOfLinePreference.TextDefined): number {
		if (this._mightContainNonBasicASCII) {
			// we must count by iterating

			let result = 0;

			const fromLineNumber = range.startLineNumber;
			const toLineNumber = range.endLineNumber;
			for (let lineNumber = fromLineNumber; lineNumber <= toLineNumber; lineNumber++) {
				const lineContent = this.getLineContent(lineNumber);
				const fromOffset = (lineNumber === fromLineNumber ? range.startColumn - 1 : 0);
				const toOffset = (lineNumber === toLineNumber ? range.endColumn - 1 : lineContent.length);

				for (let offset = fromOffset; offset < toOffset; offset++) {
					if (strings.isHighSurrogate(lineContent.charCodeAt(offset))) {
						result = result + 1;
						offset = offset + 1;
					} else {
						result = result + 1;
					}
				}
			}

			result += this._getEndOfLine(eol).length * (toLineNumber - fromLineNumber);

			return result;
		}

		return this.getValueLengthInRange(range, eol);
	}

	public getNearestChunk(offset: number): string {
		return this._pieceTree.getNearestChunk(offset);
	}

	public getLength(): number {
		return this._pieceTree.getLength();
	}

	public getLineCount(): number {
		return this._pieceTree.getLineCount();
	}

	public getLinesContent(): string[] {
		return this._pieceTree.getLinesContent();
	}

	public getLineContent(lineNumber: number): string {
		return this._pieceTree.getLineContent(lineNumber);
	}

	public getLineCharCode(lineNumber: number, index: number): number {
		return this._pieceTree.getLineCharCode(lineNumber, index);
	}

	public getCharCode(offset: number): number {
		return this._pieceTree.getCharCode(offset);
	}

	public getLineLength(lineNumber: number): number {
		return this._pieceTree.getLineLength(lineNumber);
	}

	public getLineMinColumn(lineNumber: number): number {
		return 1;
	}

	public getLineMaxColumn(lineNumber: number): number {
		return this.getLineLength(lineNumber) + 1;
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

	private _getEndOfLine(eol: EndOfLinePreference): string {
		switch (eol) {
			case EndOfLinePreference.LF:
				return '\n';
			case EndOfLinePreference.CRLF:
				return '\r\n';
			case EndOfLinePreference.TextDefined:
				return this.getEOL();
			default:
				throw new Error('Unknown EOL preference');
		}
	}

	public setEOL(newEOL: '\r\n' | '\n'): void {
		this._pieceTree.setEOL(newEOL);
	}

	public applyEdits(rawOperations: ValidAnnotatedEditOperation[], recordTrimAutoWhitespace: boolean, computeUndoEdits: boolean): ApplyEditsResult {
		let mightContainRTL = this._mightContainRTL;
		let mightContainUnusualLineTerminators = this._mightContainUnusualLineTerminators;
		let mightContainNonBasicASCII = this._mightContainNonBasicASCII;
		let canReduceOperations = true;

		let operations: IValidatedEditOperation[] = [];
		for (let i = 0; i < rawOperations.length; i++) {
			const op = rawOperations[i];
			if (canReduceOperations && op._isTracked) {
				canReduceOperations = false;
			}
			const validatedRange = op.range;
			if (op.text) {
				let textMightContainNonBasicASCII = true;
				if (!mightContainNonBasicASCII) {
					textMightContainNonBasicASCII = !strings.isBasicASCII(op.text);
					mightContainNonBasicASCII = textMightContainNonBasicASCII;
				}
				if (!mightContainRTL && textMightContainNonBasicASCII) {
					// check if the new inserted text contains RTL
					mightContainRTL = strings.containsRTL(op.text);
				}
				if (!mightContainUnusualLineTerminators && textMightContainNonBasicASCII) {
					// check if the new inserted text contains unusual line terminators
					mightContainUnusualLineTerminators = strings.containsUnusualLineTerminators(op.text);
				}
			}

			let validText = '';
			let eolCount = 0;
			let firstLineLength = 0;
			let lastLineLength = 0;
			if (op.text) {
				let strEOL: StringEOL;
				[eolCount, firstLineLength, lastLineLength, strEOL] = countEOL(op.text);

				const bufferEOL = this.getEOL();
				const expectedStrEOL = (bufferEOL === '\r\n' ? StringEOL.CRLF : StringEOL.LF);
				if (strEOL === StringEOL.Unknown || strEOL === expectedStrEOL) {
					validText = op.text;
				} else {
					validText = op.text.replace(/\r\n|\r|\n/g, bufferEOL);
				}
			}

			operations[i] = {
				sortIndex: i,
				identifier: op.identifier || null,
				range: validatedRange,
				rangeOffset: this.getOffsetAt(validatedRange.startLineNumber, validatedRange.startColumn),
				rangeLength: this.getValueLengthInRange(validatedRange),
				text: validText,
				eolCount: eolCount,
				firstLineLength: firstLineLength,
				lastLineLength: lastLineLength,
				forceMoveMarkers: Boolean(op.forceMoveMarkers),
				isAutoWhitespaceEdit: op.isAutoWhitespaceEdit || false
			};
		}

		// Sort operations ascending
		operations.sort(PieceTreeTextBuffer._sortOpsAscending);

		let hasTouchingRanges = false;
		for (let i = 0, count = operations.length - 1; i < count; i++) {
			const rangeEnd = operations[i].range.getEndPosition();
			const nextRangeStart = operations[i + 1].range.getStartPosition();

			if (nextRangeStart.isBeforeOrEqual(rangeEnd)) {
				if (nextRangeStart.isBefore(rangeEnd)) {
					// overlapping ranges
					throw new Error('Overlapping ranges are not allowed!');
				}
				hasTouchingRanges = true;
			}
		}

		if (canReduceOperations) {
			operations = this._reduceOperations(operations);
		}

		// Delta encode operations
		const reverseRanges = (computeUndoEdits || recordTrimAutoWhitespace ? PieceTreeTextBuffer._getInverseEditRanges(operations) : []);
		const newTrimAutoWhitespaceCandidates: { lineNumber: number; oldContent: string }[] = [];
		if (recordTrimAutoWhitespace) {
			for (let i = 0; i < operations.length; i++) {
				const op = operations[i];
				const reverseRange = reverseRanges[i];

				if (op.isAutoWhitespaceEdit && op.range.isEmpty()) {
					// Record already the future line numbers that might be auto whitespace removal candidates on next edit
					for (let lineNumber = reverseRange.startLineNumber; lineNumber <= reverseRange.endLineNumber; lineNumber++) {
						let currentLineContent = '';
						if (lineNumber === reverseRange.startLineNumber) {
							currentLineContent = this.getLineContent(op.range.startLineNumber);
							if (strings.firstNonWhitespaceIndex(currentLineContent) !== -1) {
								continue;
							}
						}
						newTrimAutoWhitespaceCandidates.push({ lineNumber: lineNumber, oldContent: currentLineContent });
					}
				}
			}
		}

		let reverseOperations: IReverseSingleEditOperation[] | null = null;
		if (computeUndoEdits) {

			let reverseRangeDeltaOffset = 0;
			reverseOperations = [];
			for (let i = 0; i < operations.length; i++) {
				const op = operations[i];
				const reverseRange = reverseRanges[i];
				const bufferText = this.getValueInRange(op.range);
				const reverseRangeOffset = op.rangeOffset + reverseRangeDeltaOffset;
				reverseRangeDeltaOffset += (op.text.length - bufferText.length);

				reverseOperations[i] = {
					sortIndex: op.sortIndex,
					identifier: op.identifier,
					range: reverseRange,
					text: bufferText,
					textChange: new TextChange(op.rangeOffset, bufferText, reverseRangeOffset, op.text)
				};
			}

			// Can only sort reverse operations when the order is not significant
			if (!hasTouchingRanges) {
				reverseOperations.sort((a, b) => a.sortIndex - b.sortIndex);
			}
		}


		this._mightContainRTL = mightContainRTL;
		this._mightContainUnusualLineTerminators = mightContainUnusualLineTerminators;
		this._mightContainNonBasicASCII = mightContainNonBasicASCII;

		const contentChanges = this._doApplyEdits(operations);

		let trimAutoWhitespaceLineNumbers: number[] | null = null;
		if (recordTrimAutoWhitespace && newTrimAutoWhitespaceCandidates.length > 0) {
			// sort line numbers auto whitespace removal candidates for next edit descending
			newTrimAutoWhitespaceCandidates.sort((a, b) => b.lineNumber - a.lineNumber);

			trimAutoWhitespaceLineNumbers = [];
			for (let i = 0, len = newTrimAutoWhitespaceCandidates.length; i < len; i++) {
				const lineNumber = newTrimAutoWhitespaceCandidates[i].lineNumber;
				if (i > 0 && newTrimAutoWhitespaceCandidates[i - 1].lineNumber === lineNumber) {
					// Do not have the same line number twice
					continue;
				}

				const prevContent = newTrimAutoWhitespaceCandidates[i].oldContent;
				const lineContent = this.getLineContent(lineNumber);

				if (lineContent.length === 0 || lineContent === prevContent || strings.firstNonWhitespaceIndex(lineContent) !== -1) {
					continue;
				}

				trimAutoWhitespaceLineNumbers.push(lineNumber);
			}
		}

		this._onDidChangeContent.fire();

		return new ApplyEditsResult(
			reverseOperations,
			contentChanges,
			trimAutoWhitespaceLineNumbers
		);
	}

	/**
	 * Transform operations such that they represent the same logic edit,
	 * but that they also do not cause OOM crashes.
	 */
	private _reduceOperations(operations: IValidatedEditOperation[]): IValidatedEditOperation[] {
		if (operations.length < 1000) {
			// We know from empirical testing that a thousand edits work fine regardless of their shape.
			return operations;
		}

		// At one point, due to how events are emitted and how each operation is handled,
		// some operations can trigger a high amount of temporary string allocations,
		// that will immediately get edited again.
		// e.g. a formatter inserting ridiculous ammounts of \n on a model with a single line
		// Therefore, the strategy is to collapse all the operations into a huge single edit operation
		return [this._toSingleEditOperation(operations)];
	}

	_toSingleEditOperation(operations: IValidatedEditOperation[]): IValidatedEditOperation {
		let forceMoveMarkers = false;
		const firstEditRange = operations[0].range;
		const lastEditRange = operations[operations.length - 1].range;
		const entireEditRange = new Range(firstEditRange.startLineNumber, firstEditRange.startColumn, lastEditRange.endLineNumber, lastEditRange.endColumn);
		let lastEndLineNumber = firstEditRange.startLineNumber;
		let lastEndColumn = firstEditRange.startColumn;
		const result: string[] = [];

		for (let i = 0, len = operations.length; i < len; i++) {
			const operation = operations[i];
			const range = operation.range;

			forceMoveMarkers = forceMoveMarkers || operation.forceMoveMarkers;

			// (1) -- Push old text
			result.push(this.getValueInRange(new Range(lastEndLineNumber, lastEndColumn, range.startLineNumber, range.startColumn)));

			// (2) -- Push new text
			if (operation.text.length > 0) {
				result.push(operation.text);
			}

			lastEndLineNumber = range.endLineNumber;
			lastEndColumn = range.endColumn;
		}

		const text = result.join('');
		const [eolCount, firstLineLength, lastLineLength] = countEOL(text);

		return {
			sortIndex: 0,
			identifier: operations[0].identifier,
			range: entireEditRange,
			rangeOffset: this.getOffsetAt(entireEditRange.startLineNumber, entireEditRange.startColumn),
			rangeLength: this.getValueLengthInRange(entireEditRange, EndOfLinePreference.TextDefined),
			text: text,
			eolCount: eolCount,
			firstLineLength: firstLineLength,
			lastLineLength: lastLineLength,
			forceMoveMarkers: forceMoveMarkers,
			isAutoWhitespaceEdit: false
		};
	}

	private _doApplyEdits(operations: IValidatedEditOperation[]): IInternalModelContentChange[] {
		operations.sort(PieceTreeTextBuffer._sortOpsDescending);

		const contentChanges: IInternalModelContentChange[] = [];

		// operations are from bottom to top
		for (let i = 0; i < operations.length; i++) {
			const op = operations[i];

			const startLineNumber = op.range.startLineNumber;
			const startColumn = op.range.startColumn;
			const endLineNumber = op.range.endLineNumber;
			const endColumn = op.range.endColumn;

			if (startLineNumber === endLineNumber && startColumn === endColumn && op.text.length === 0) {
				// no-op
				continue;
			}

			if (op.text) {
				// replacement
				this._pieceTree.delete(op.rangeOffset, op.rangeLength);
				this._pieceTree.insert(op.rangeOffset, op.text, true);

			} else {
				// deletion
				this._pieceTree.delete(op.rangeOffset, op.rangeLength);
			}

			const contentChangeRange = new Range(startLineNumber, startColumn, endLineNumber, endColumn);
			contentChanges.push({
				range: contentChangeRange,
				rangeLength: op.rangeLength,
				text: op.text,
				rangeOffset: op.rangeOffset,
				forceMoveMarkers: op.forceMoveMarkers
			});
		}
		return contentChanges;
	}

	findMatchesLineByLine(searchRange: Range, searchData: SearchData, captureMatches: boolean, limitResultCount: number): FindMatch[] {
		return this._pieceTree.findMatchesLineByLine(searchRange, searchData, captureMatches, limitResultCount);
	}

	// #endregion

	// #region helper
	// testing purpose.
	public getPieceTree(): PieceTreeBase {
		return this._pieceTree;
	}

	public static _getInverseEditRange(range: Range, text: string) {
		const startLineNumber = range.startLineNumber;
		const startColumn = range.startColumn;
		const [eolCount, firstLineLength, lastLineLength] = countEOL(text);
		let resultRange: Range;

		if (text.length > 0) {
			// the operation inserts something
			const lineCount = eolCount + 1;

			if (lineCount === 1) {
				// single line insert
				resultRange = new Range(startLineNumber, startColumn, startLineNumber, startColumn + firstLineLength);
			} else {
				// multi line insert
				resultRange = new Range(startLineNumber, startColumn, startLineNumber + lineCount - 1, lastLineLength + 1);
			}
		} else {
			// There is nothing to insert
			resultRange = new Range(startLineNumber, startColumn, startLineNumber, startColumn);
		}

		return resultRange;
	}

	/**
	 * Assumes `operations` are validated and sorted ascending
	 */
	public static _getInverseEditRanges(operations: IValidatedEditOperation[]): Range[] {
		const result: Range[] = [];

		let prevOpEndLineNumber: number = 0;
		let prevOpEndColumn: number = 0;
		let prevOp: IValidatedEditOperation | null = null;
		for (let i = 0, len = operations.length; i < len; i++) {
			const op = operations[i];

			let startLineNumber: number;
			let startColumn: number;

			if (prevOp) {
				if (prevOp.range.endLineNumber === op.range.startLineNumber) {
					startLineNumber = prevOpEndLineNumber;
					startColumn = prevOpEndColumn + (op.range.startColumn - prevOp.range.endColumn);
				} else {
					startLineNumber = prevOpEndLineNumber + (op.range.startLineNumber - prevOp.range.endLineNumber);
					startColumn = op.range.startColumn;
				}
			} else {
				startLineNumber = op.range.startLineNumber;
				startColumn = op.range.startColumn;
			}

			let resultRange: Range;

			if (op.text.length > 0) {
				// the operation inserts something
				const lineCount = op.eolCount + 1;

				if (lineCount === 1) {
					// single line insert
					resultRange = new Range(startLineNumber, startColumn, startLineNumber, startColumn + op.firstLineLength);
				} else {
					// multi line insert
					resultRange = new Range(startLineNumber, startColumn, startLineNumber + lineCount - 1, op.lastLineLength + 1);
				}
			} else {
				// There is nothing to insert
				resultRange = new Range(startLineNumber, startColumn, startLineNumber, startColumn);
			}

			prevOpEndLineNumber = resultRange.endLineNumber;
			prevOpEndColumn = resultRange.endColumn;

			result.push(resultRange);
			prevOp = op;
		}

		return result;
	}

	private static _sortOpsAscending(a: IValidatedEditOperation, b: IValidatedEditOperation): number {
		const r = Range.compareRangesUsingEnds(a.range, b.range);
		if (r === 0) {
			return a.sortIndex - b.sortIndex;
		}
		return r;
	}

	private static _sortOpsDescending(a: IValidatedEditOperation, b: IValidatedEditOperation): number {
		const r = Range.compareRangesUsingEnds(a.range, b.range);
		if (r === 0) {
			return b.sortIndex - a.sortIndex;
		}
		return -r;
	}
	// #endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/pieceTreeTextBuffer/pieceTreeTextBufferBuilder.ts]---
Location: vscode-main/src/vs/editor/common/model/pieceTreeTextBuffer/pieceTreeTextBufferBuilder.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../../base/common/charCode.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import * as strings from '../../../../base/common/strings.js';
import { DefaultEndOfLine, ITextBuffer, ITextBufferBuilder, ITextBufferFactory } from '../../model.js';
import { StringBuffer, createLineStarts, createLineStartsFast } from './pieceTreeBase.js';
import { PieceTreeTextBuffer } from './pieceTreeTextBuffer.js';

class PieceTreeTextBufferFactory implements ITextBufferFactory {

	constructor(
		private readonly _chunks: StringBuffer[],
		private readonly _bom: string,
		private readonly _cr: number,
		private readonly _lf: number,
		private readonly _crlf: number,
		private readonly _containsRTL: boolean,
		private readonly _containsUnusualLineTerminators: boolean,
		private readonly _isBasicASCII: boolean,
		private readonly _normalizeEOL: boolean
	) { }

	private _getEOL(defaultEOL: DefaultEndOfLine): '\r\n' | '\n' {
		const totalEOLCount = this._cr + this._lf + this._crlf;
		const totalCRCount = this._cr + this._crlf;
		if (totalEOLCount === 0) {
			// This is an empty file or a file with precisely one line
			return (defaultEOL === DefaultEndOfLine.LF ? '\n' : '\r\n');
		}
		if (totalCRCount > totalEOLCount / 2) {
			// More than half of the file contains \r\n ending lines
			return '\r\n';
		}
		// At least one line more ends in \n
		return '\n';
	}

	public create(defaultEOL: DefaultEndOfLine): { textBuffer: ITextBuffer; disposable: IDisposable } {
		const eol = this._getEOL(defaultEOL);
		const chunks = this._chunks;

		if (this._normalizeEOL &&
			((eol === '\r\n' && (this._cr > 0 || this._lf > 0))
				|| (eol === '\n' && (this._cr > 0 || this._crlf > 0)))
		) {
			// Normalize pieces
			for (let i = 0, len = chunks.length; i < len; i++) {
				const str = chunks[i].buffer.replace(/\r\n|\r|\n/g, eol);
				const newLineStart = createLineStartsFast(str);
				chunks[i] = new StringBuffer(str, newLineStart);
			}
		}

		const textBuffer = new PieceTreeTextBuffer(chunks, this._bom, eol, this._containsRTL, this._containsUnusualLineTerminators, this._isBasicASCII, this._normalizeEOL);
		return { textBuffer: textBuffer, disposable: textBuffer };
	}

	public getFirstLineText(lengthLimit: number): string {
		return this._chunks[0].buffer.substr(0, lengthLimit).split(/\r\n|\r|\n/)[0];
	}
}

export class PieceTreeTextBufferBuilder implements ITextBufferBuilder {
	private readonly chunks: StringBuffer[];
	private BOM: string;

	private _hasPreviousChar: boolean;
	private _previousChar: number;
	private readonly _tmpLineStarts: number[];

	private cr: number;
	private lf: number;
	private crlf: number;
	private containsRTL: boolean;
	private containsUnusualLineTerminators: boolean;
	private isBasicASCII: boolean;

	constructor() {
		this.chunks = [];
		this.BOM = '';

		this._hasPreviousChar = false;
		this._previousChar = 0;
		this._tmpLineStarts = [];

		this.cr = 0;
		this.lf = 0;
		this.crlf = 0;
		this.containsRTL = false;
		this.containsUnusualLineTerminators = false;
		this.isBasicASCII = true;
	}

	public acceptChunk(chunk: string): void {
		if (chunk.length === 0) {
			return;
		}

		if (this.chunks.length === 0) {
			if (strings.startsWithUTF8BOM(chunk)) {
				this.BOM = strings.UTF8_BOM_CHARACTER;
				chunk = chunk.substr(1);
			}
		}

		const lastChar = chunk.charCodeAt(chunk.length - 1);
		if (lastChar === CharCode.CarriageReturn || (lastChar >= 0xD800 && lastChar <= 0xDBFF)) {
			// last character is \r or a high surrogate => keep it back
			this._acceptChunk1(chunk.substr(0, chunk.length - 1), false);
			this._hasPreviousChar = true;
			this._previousChar = lastChar;
		} else {
			this._acceptChunk1(chunk, false);
			this._hasPreviousChar = false;
			this._previousChar = lastChar;
		}
	}

	private _acceptChunk1(chunk: string, allowEmptyStrings: boolean): void {
		if (!allowEmptyStrings && chunk.length === 0) {
			// Nothing to do
			return;
		}

		if (this._hasPreviousChar) {
			this._acceptChunk2(String.fromCharCode(this._previousChar) + chunk);
		} else {
			this._acceptChunk2(chunk);
		}
	}

	private _acceptChunk2(chunk: string): void {
		const lineStarts = createLineStarts(this._tmpLineStarts, chunk);

		this.chunks.push(new StringBuffer(chunk, lineStarts.lineStarts));
		this.cr += lineStarts.cr;
		this.lf += lineStarts.lf;
		this.crlf += lineStarts.crlf;

		if (!lineStarts.isBasicASCII) {
			// this chunk contains non basic ASCII characters
			this.isBasicASCII = false;
			if (!this.containsRTL) {
				this.containsRTL = strings.containsRTL(chunk);
			}
			if (!this.containsUnusualLineTerminators) {
				this.containsUnusualLineTerminators = strings.containsUnusualLineTerminators(chunk);
			}
		}
	}

	public finish(normalizeEOL: boolean = true): PieceTreeTextBufferFactory {
		this._finish();
		return new PieceTreeTextBufferFactory(
			this.chunks,
			this.BOM,
			this.cr,
			this.lf,
			this.crlf,
			this.containsRTL,
			this.containsUnusualLineTerminators,
			this.isBasicASCII,
			normalizeEOL
		);
	}

	private _finish(): void {
		if (this.chunks.length === 0) {
			this._acceptChunk1('', true);
		}

		if (this._hasPreviousChar) {
			this._hasPreviousChar = false;
			// recreate last chunk
			const lastChunk = this.chunks[this.chunks.length - 1];
			lastChunk.buffer += String.fromCharCode(this._previousChar);
			const newLineStarts = createLineStartsFast(lastChunk.buffer);
			lastChunk.lineStarts = newLineStarts;
			if (this._previousChar === CharCode.CarriageReturn) {
				this.cr++;
			}
		}
	}
}
```

--------------------------------------------------------------------------------

````
