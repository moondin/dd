---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 171
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 171 of 552)

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

---[FILE: src/vs/base/browser/ui/tree/compressedObjectTreeModel.ts]---
Location: vscode-main/src/vs/base/browser/ui/tree/compressedObjectTreeModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IIdentityProvider } from '../list/list.js';
import { getVisibleState, IIndexTreeModelSpliceOptions, isFilterResult } from './indexTreeModel.js';
import { IObjectTreeModel, IObjectTreeModelOptions, IObjectTreeModelSetChildrenOptions, ObjectTreeModel } from './objectTreeModel.js';
import { ICollapseStateChangeEvent, IObjectTreeElement, ITreeListSpliceData, ITreeModel, ITreeModelSpliceEvent, ITreeNode, TreeError, TreeFilterResult, TreeVisibility, WeakMapper } from './tree.js';
import { equals } from '../../../common/arrays.js';
import { Event } from '../../../common/event.js';
import { Iterable } from '../../../common/iterator.js';

// Exported only for test reasons, do not use directly
export interface ICompressedTreeElement<T> extends IObjectTreeElement<T> {
	readonly children?: Iterable<ICompressedTreeElement<T>>;
	readonly incompressible?: boolean;
}

// Exported only for test reasons, do not use directly
export interface ICompressedTreeNode<T> {
	readonly elements: T[];
	readonly incompressible: boolean;
}

function noCompress<T>(element: ICompressedTreeElement<T>): ICompressedTreeElement<ICompressedTreeNode<T>> {
	const elements = [element.element];
	const incompressible = element.incompressible || false;

	return {
		element: { elements, incompressible },
		children: Iterable.map(Iterable.from(element.children), noCompress),
		collapsible: element.collapsible,
		collapsed: element.collapsed
	};
}

// Exported only for test reasons, do not use directly
export function compress<T>(element: ICompressedTreeElement<T>): ICompressedTreeElement<ICompressedTreeNode<T>> {
	const elements = [element.element];
	const incompressible = element.incompressible || false;

	let childrenIterator: Iterable<ICompressedTreeElement<T>>;
	let children: ICompressedTreeElement<T>[];

	while (true) {
		[children, childrenIterator] = Iterable.consume(Iterable.from(element.children), 2);

		if (children.length !== 1) {
			break;
		}

		if (children[0].incompressible) {
			break;
		}

		element = children[0];
		elements.push(element.element);
	}

	return {
		element: { elements, incompressible },
		children: Iterable.map(Iterable.concat(children, childrenIterator), compress),
		collapsible: element.collapsible,
		collapsed: element.collapsed
	};
}

function _decompress<T>(element: ICompressedTreeElement<ICompressedTreeNode<T>>, index = 0): ICompressedTreeElement<T> {
	let children: Iterable<ICompressedTreeElement<T>>;

	if (index < element.element.elements.length - 1) {
		children = [_decompress(element, index + 1)];
	} else {
		children = Iterable.map(Iterable.from(element.children), el => _decompress(el, 0));
	}

	if (index === 0 && element.element.incompressible) {
		return {
			element: element.element.elements[index],
			children,
			incompressible: true,
			collapsible: element.collapsible,
			collapsed: element.collapsed
		};
	}

	return {
		element: element.element.elements[index],
		children,
		collapsible: element.collapsible,
		collapsed: element.collapsed
	};
}

// Exported only for test reasons, do not use directly
export function decompress<T>(element: ICompressedTreeElement<ICompressedTreeNode<T>>): ICompressedTreeElement<T> {
	return _decompress(element, 0);
}

function splice<T>(treeElement: ICompressedTreeElement<T>, element: T, children: Iterable<ICompressedTreeElement<T>>): ICompressedTreeElement<T> {
	if (treeElement.element === element) {
		return { ...treeElement, children };
	}

	return { ...treeElement, children: Iterable.map(Iterable.from(treeElement.children), e => splice(e, element, children)) };
}

interface ICompressedObjectTreeModelOptions<T, TFilterData> extends IObjectTreeModelOptions<ICompressedTreeNode<T>, TFilterData> {
	readonly compressionEnabled?: boolean;
}

const wrapIdentityProvider = <T>(base: IIdentityProvider<T>): IIdentityProvider<ICompressedTreeNode<T>> => ({
	getId(node) {
		return node.elements.map(e => base.getId(e).toString()).join('\0');
	}
});

// Exported only for test reasons, do not use directly
export class CompressedObjectTreeModel<T, TFilterData = void> implements ITreeModel<ICompressedTreeNode<T> | null, TFilterData, T | null> {

	readonly rootRef = null;

	get onDidSpliceRenderedNodes(): Event<ITreeListSpliceData<ICompressedTreeNode<T> | null, TFilterData>> { return this.model.onDidSpliceRenderedNodes; }
	get onDidSpliceModel(): Event<ITreeModelSpliceEvent<ICompressedTreeNode<T> | null, TFilterData>> { return this.model.onDidSpliceModel; }
	get onDidChangeCollapseState(): Event<ICollapseStateChangeEvent<ICompressedTreeNode<T>, TFilterData>> { return this.model.onDidChangeCollapseState; }
	get onDidChangeRenderNodeCount(): Event<ITreeNode<ICompressedTreeNode<T>, TFilterData>> { return this.model.onDidChangeRenderNodeCount; }

	private model: ObjectTreeModel<ICompressedTreeNode<T>, TFilterData>;
	private nodes = new Map<T | null, ICompressedTreeNode<T>>();
	private enabled: boolean;
	private readonly identityProvider?: IIdentityProvider<ICompressedTreeNode<T>>;

	get size(): number { return this.nodes.size; }

	constructor(
		private user: string,
		options: ICompressedObjectTreeModelOptions<T, TFilterData> = {}
	) {
		this.model = new ObjectTreeModel(user, options);
		this.enabled = typeof options.compressionEnabled === 'undefined' ? true : options.compressionEnabled;
		this.identityProvider = options.identityProvider;
	}

	setChildren(
		element: T | null,
		children: Iterable<ICompressedTreeElement<T>> = Iterable.empty(),
		options: IObjectTreeModelSetChildrenOptions<T, TFilterData>,
	): void {
		// Diffs must be deep, since the compression can affect nested elements.
		// @see https://github.com/microsoft/vscode/pull/114237#issuecomment-759425034

		const diffIdentityProvider = options.diffIdentityProvider && wrapIdentityProvider(options.diffIdentityProvider);
		if (element === null) {
			const compressedChildren = Iterable.map(children, this.enabled ? compress : noCompress);
			this._setChildren(null, compressedChildren, { diffIdentityProvider, diffDepth: Infinity });
			return;
		}

		const compressedNode = this.nodes.get(element);

		if (!compressedNode) {
			throw new TreeError(this.user, 'Unknown compressed tree node');
		}

		const node = this.model.getNode(compressedNode) as ITreeNode<ICompressedTreeNode<T>, TFilterData>;
		const compressedParentNode = this.model.getParentNodeLocation(compressedNode);
		const parent = this.model.getNode(compressedParentNode) as ITreeNode<ICompressedTreeNode<T>, TFilterData>;

		const decompressedElement = decompress(node);
		const splicedElement = splice(decompressedElement, element, children);
		const recompressedElement = (this.enabled ? compress : noCompress)(splicedElement);

		// If the recompressed node is identical to the original, just set its children.
		// Saves work and churn diffing the parent element.
		const elementComparator = options.diffIdentityProvider
			? ((a: T, b: T) => options.diffIdentityProvider!.getId(a) === options.diffIdentityProvider!.getId(b))
			: undefined;
		if (equals(recompressedElement.element.elements, node.element.elements, elementComparator)) {
			this._setChildren(compressedNode, recompressedElement.children || Iterable.empty(), { diffIdentityProvider, diffDepth: 1 });
			return;
		}

		const parentChildren = parent.children
			.map(child => child === node ? recompressedElement : child);

		this._setChildren(parent.element, parentChildren, {
			diffIdentityProvider,
			diffDepth: node.depth - parent.depth,
		});
	}

	isCompressionEnabled(): boolean {
		return this.enabled;
	}

	setCompressionEnabled(enabled: boolean): void {
		if (enabled === this.enabled) {
			return;
		}

		this.enabled = enabled;

		const root = this.model.getNode();
		const rootChildren = root.children as ITreeNode<ICompressedTreeNode<T>>[];
		const decompressedRootChildren = Iterable.map(rootChildren, decompress);
		const recompressedRootChildren = Iterable.map(decompressedRootChildren, enabled ? compress : noCompress);

		// it should be safe to always use deep diff mode here if an identity
		// provider is available, since we know the raw nodes are unchanged.
		this._setChildren(null, recompressedRootChildren, {
			diffIdentityProvider: this.identityProvider,
			diffDepth: Infinity,
		});
	}

	private _setChildren(
		node: ICompressedTreeNode<T> | null,
		children: Iterable<IObjectTreeElement<ICompressedTreeNode<T>>>,
		options: IIndexTreeModelSpliceOptions<ICompressedTreeNode<T>, TFilterData>,
	): void {
		const insertedElements = new Set<T | null>();
		const onDidCreateNode = (node: ITreeNode<ICompressedTreeNode<T>, TFilterData>) => {
			for (const element of node.element.elements) {
				insertedElements.add(element);
				this.nodes.set(element, node.element);
			}
		};

		const onDidDeleteNode = (node: ITreeNode<ICompressedTreeNode<T>, TFilterData>) => {
			for (const element of node.element.elements) {
				if (!insertedElements.has(element)) {
					this.nodes.delete(element);
				}
			}
		};

		this.model.setChildren(node, children, { ...options, onDidCreateNode, onDidDeleteNode });
	}

	has(element: T | null): boolean {
		return this.nodes.has(element);
	}

	getListIndex(location: T | null): number {
		const node = this.getCompressedNode(location);
		return this.model.getListIndex(node);
	}

	getListRenderCount(location: T | null): number {
		const node = this.getCompressedNode(location);
		return this.model.getListRenderCount(node);
	}

	getNode(location?: T | null | undefined): ITreeNode<ICompressedTreeNode<T> | null, TFilterData> {
		if (typeof location === 'undefined') {
			return this.model.getNode();
		}

		const node = this.getCompressedNode(location);
		return this.model.getNode(node);
	}

	// TODO: review this
	getNodeLocation(node: ITreeNode<ICompressedTreeNode<T>, TFilterData>): T | null {
		const compressedNode = this.model.getNodeLocation(node);

		if (compressedNode === null) {
			return null;
		}

		return compressedNode.elements[compressedNode.elements.length - 1];
	}

	// TODO: review this
	getParentNodeLocation(location: T | null): T | null {
		const compressedNode = this.getCompressedNode(location);
		const parentNode = this.model.getParentNodeLocation(compressedNode);

		if (parentNode === null) {
			return null;
		}

		return parentNode.elements[parentNode.elements.length - 1];
	}

	getFirstElementChild(location: T | null): ICompressedTreeNode<T> | null | undefined {
		const compressedNode = this.getCompressedNode(location);
		return this.model.getFirstElementChild(compressedNode);
	}

	getLastElementAncestor(location?: T | null | undefined): ICompressedTreeNode<T> | null | undefined {
		const compressedNode = typeof location === 'undefined' ? undefined : this.getCompressedNode(location);
		return this.model.getLastElementAncestor(compressedNode);
	}

	isCollapsible(location: T | null): boolean {
		const compressedNode = this.getCompressedNode(location);
		return this.model.isCollapsible(compressedNode);
	}

	setCollapsible(location: T | null, collapsible?: boolean): boolean {
		const compressedNode = this.getCompressedNode(location);
		return this.model.setCollapsible(compressedNode, collapsible);
	}

	isCollapsed(location: T | null): boolean {
		const compressedNode = this.getCompressedNode(location);
		return this.model.isCollapsed(compressedNode);
	}

	setCollapsed(location: T | null, collapsed?: boolean | undefined, recursive?: boolean | undefined): boolean {
		const compressedNode = this.getCompressedNode(location);
		return this.model.setCollapsed(compressedNode, collapsed, recursive);
	}

	expandTo(location: T | null): void {
		const compressedNode = this.getCompressedNode(location);
		this.model.expandTo(compressedNode);
	}

	rerender(location: T | null): void {
		const compressedNode = this.getCompressedNode(location);
		this.model.rerender(compressedNode);
	}

	refilter(): void {
		this.model.refilter();
	}

	resort(location: T | null = null, recursive = true): void {
		const compressedNode = this.getCompressedNode(location);
		this.model.resort(compressedNode, recursive);
	}

	getCompressedNode(element: T | null): ICompressedTreeNode<T> | null {
		if (element === null) {
			return null;
		}

		const node = this.nodes.get(element);

		if (!node) {
			throw new TreeError(this.user, `Tree element not found: ${element}`);
		}

		return node;
	}
}

// Compressible Object Tree

export type ElementMapper<T> = (elements: T[]) => T;
export const DefaultElementMapper: ElementMapper<unknown> = elements => elements[elements.length - 1];

export type CompressedNodeUnwrapper<T> = (node: ICompressedTreeNode<T>) => T;
type CompressedNodeWeakMapper<T, TFilterData> = WeakMapper<ITreeNode<ICompressedTreeNode<T> | null, TFilterData>, ITreeNode<T | null, TFilterData>>;

class CompressedTreeNodeWrapper<T, TFilterData> implements ITreeNode<T | null, TFilterData> {

	get element(): T | null { return this.node.element === null ? null : this.unwrapper(this.node.element); }
	get children(): ITreeNode<T | null, TFilterData>[] { return this.node.children.map(node => new CompressedTreeNodeWrapper(this.unwrapper, node)); }
	get depth(): number { return this.node.depth; }
	get visibleChildrenCount(): number { return this.node.visibleChildrenCount; }
	get visibleChildIndex(): number { return this.node.visibleChildIndex; }
	get collapsible(): boolean { return this.node.collapsible; }
	get collapsed(): boolean { return this.node.collapsed; }
	get visible(): boolean { return this.node.visible; }
	get filterData(): TFilterData | undefined { return this.node.filterData; }

	constructor(
		private unwrapper: CompressedNodeUnwrapper<T>,
		private node: ITreeNode<ICompressedTreeNode<T> | null, TFilterData>
	) { }
}

function mapOptions<T, TFilterData>(compressedNodeUnwrapper: CompressedNodeUnwrapper<T>, options: ICompressibleObjectTreeModelOptions<T, TFilterData>): ICompressedObjectTreeModelOptions<T, TFilterData> {
	return {
		...options,
		identityProvider: options.identityProvider && {
			getId(node: ICompressedTreeNode<T>): { toString(): string } {
				return options.identityProvider!.getId(compressedNodeUnwrapper(node));
			}
		},
		sorter: options.sorter && {
			compare(node: ICompressedTreeNode<T>, otherNode: ICompressedTreeNode<T>): number {
				return options.sorter!.compare(node.elements[0], otherNode.elements[0]);
			}
		},
		filter: options.filter && {
			filter(node: ICompressedTreeNode<T>, parentVisibility: TreeVisibility): TreeFilterResult<TFilterData> {
				const elements = node.elements;
				for (let i = 0; i < elements.length - 1; i++) {
					const result = options.filter!.filter(elements[i], parentVisibility);
					parentVisibility = getVisibleState(isFilterResult(result) ? result.visibility : result);
				}
				return options.filter!.filter(elements[elements.length - 1], parentVisibility);
			}
		}
	};
}

export interface ICompressibleObjectTreeModelOptions<T, TFilterData> extends IObjectTreeModelOptions<T, TFilterData> {
	readonly compressionEnabled?: boolean;
	readonly elementMapper?: ElementMapper<T>;
}

export class CompressibleObjectTreeModel<T, TFilterData = void> implements IObjectTreeModel<T, TFilterData> {

	readonly rootRef = null;

	get onDidSpliceModel(): Event<ITreeModelSpliceEvent<T | null, TFilterData>> {
		return Event.map(this.model.onDidSpliceModel, ({ insertedNodes, deletedNodes }) => ({
			insertedNodes: insertedNodes.map(node => this.nodeMapper.map(node)),
			deletedNodes: deletedNodes.map(node => this.nodeMapper.map(node)),
		}));
	}

	get onDidSpliceRenderedNodes(): Event<ITreeListSpliceData<T | null, TFilterData>> {
		return Event.map(this.model.onDidSpliceRenderedNodes, ({ start, deleteCount, elements }) => ({
			start,
			deleteCount,
			elements: elements.map(node => this.nodeMapper.map(node))
		}));
	}

	get onDidChangeCollapseState(): Event<ICollapseStateChangeEvent<T | null, TFilterData>> {
		return Event.map(this.model.onDidChangeCollapseState, ({ node, deep }) => ({
			node: this.nodeMapper.map(node),
			deep
		}));
	}

	get onDidChangeRenderNodeCount(): Event<ITreeNode<T | null, TFilterData>> {
		return Event.map(this.model.onDidChangeRenderNodeCount, node => this.nodeMapper.map(node));
	}

	private elementMapper: ElementMapper<T>;
	private nodeMapper: CompressedNodeWeakMapper<T, TFilterData>;
	private model: CompressedObjectTreeModel<T, TFilterData>;

	constructor(
		user: string,
		options: ICompressibleObjectTreeModelOptions<T, TFilterData> = {}
	) {
		this.elementMapper = options.elementMapper || (DefaultElementMapper as ElementMapper<T>);
		const compressedNodeUnwrapper: CompressedNodeUnwrapper<T> = node => this.elementMapper(node.elements);
		this.nodeMapper = new WeakMapper(node => new CompressedTreeNodeWrapper(compressedNodeUnwrapper, node));

		this.model = new CompressedObjectTreeModel(user, mapOptions(compressedNodeUnwrapper, options));
	}

	setChildren(
		element: T | null,
		children: Iterable<ICompressedTreeElement<T>> = Iterable.empty(),
		options: IObjectTreeModelSetChildrenOptions<T, TFilterData> = {},
	): void {
		this.model.setChildren(element, children, options);
	}

	isCompressionEnabled(): boolean {
		return this.model.isCompressionEnabled();
	}

	setCompressionEnabled(enabled: boolean): void {
		this.model.setCompressionEnabled(enabled);
	}

	has(location: T | null): boolean {
		return this.model.has(location);
	}

	getListIndex(location: T | null): number {
		return this.model.getListIndex(location);
	}

	getListRenderCount(location: T | null): number {
		return this.model.getListRenderCount(location);
	}

	getNode(location?: T | null | undefined): ITreeNode<T | null, TFilterData> {
		return this.nodeMapper.map(this.model.getNode(location));
	}

	getNodeLocation(node: ITreeNode<T | null, TFilterData>): T | null {
		return node.element;
	}

	getParentNodeLocation(location: T | null): T | null {
		return this.model.getParentNodeLocation(location);
	}

	getFirstElementChild(location: T | null): T | null | undefined {
		const result = this.model.getFirstElementChild(location);

		if (result === null || typeof result === 'undefined') {
			return result;
		}

		return this.elementMapper(result.elements);
	}

	getLastElementAncestor(location?: T | null | undefined): T | null | undefined {
		const result = this.model.getLastElementAncestor(location);

		if (result === null || typeof result === 'undefined') {
			return result;
		}

		return this.elementMapper(result.elements);
	}

	isCollapsible(location: T | null): boolean {
		return this.model.isCollapsible(location);
	}

	setCollapsible(location: T | null, collapsed?: boolean): boolean {
		return this.model.setCollapsible(location, collapsed);
	}

	isCollapsed(location: T | null): boolean {
		return this.model.isCollapsed(location);
	}

	setCollapsed(location: T | null, collapsed?: boolean | undefined, recursive?: boolean | undefined): boolean {
		return this.model.setCollapsed(location, collapsed, recursive);
	}

	expandTo(location: T | null): void {
		return this.model.expandTo(location);
	}

	rerender(location: T | null): void {
		return this.model.rerender(location);
	}

	refilter(): void {
		return this.model.refilter();
	}

	resort(element: T | null = null, recursive = true): void {
		return this.model.resort(element, recursive);
	}

	getCompressedTreeNode(location: T | null = null): ITreeNode<ICompressedTreeNode<T> | null, TFilterData> {
		return this.model.getNode(location);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/tree/dataTree.ts]---
Location: vscode-main/src/vs/base/browser/ui/tree/dataTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IIdentityProvider, IListVirtualDelegate } from '../list/list.js';
import { AbstractTree, AbstractTreeViewState, IAbstractTreeOptions } from './abstractTree.js';
import { ObjectTreeModel } from './objectTreeModel.js';
import { IDataSource, ITreeElement, ITreeModel, ITreeNode, ITreeRenderer, ITreeSorter, TreeError } from './tree.js';
import { Iterable } from '../../../common/iterator.js';

export interface IDataTreeOptions<T, TFilterData = void> extends IAbstractTreeOptions<T, TFilterData> {
	readonly sorter?: ITreeSorter<T>;
}

export class DataTree<TInput, T, TFilterData = void> extends AbstractTree<T | null, TFilterData, T | null> {

	protected declare model: ObjectTreeModel<T, TFilterData>;
	private input: TInput | undefined;

	private identityProvider: IIdentityProvider<T> | undefined;
	private nodesByIdentity = new Map<string, ITreeNode<T, TFilterData>>();

	constructor(
		private user: string,
		container: HTMLElement,
		delegate: IListVirtualDelegate<T>,
		renderers: ITreeRenderer<T, TFilterData, unknown>[],
		private dataSource: IDataSource<TInput, T>,
		options: IDataTreeOptions<T, TFilterData> = {}
	) {
		super(user, container, delegate, renderers, options as IDataTreeOptions<T | null, TFilterData>);
		this.identityProvider = options.identityProvider;
	}

	// Model

	getInput(): TInput | undefined {
		return this.input;
	}

	setInput(input: TInput | undefined, viewState?: AbstractTreeViewState): void {
		if (viewState && !this.identityProvider) {
			throw new TreeError(this.user, 'Can\'t restore tree view state without an identity provider');
		}

		this.input = input;

		if (!input) {
			this.nodesByIdentity.clear();
			this.model.setChildren(null, Iterable.empty());
			return;
		}

		if (!viewState) {
			this._refresh(input);
			return;
		}

		const focus: T[] = [];
		const selection: T[] = [];

		const isCollapsed = (element: T) => {
			const id = this.identityProvider!.getId(element).toString();
			return !viewState.expanded[id];
		};

		const onDidCreateNode = (node: ITreeNode<T, TFilterData>) => {
			const id = this.identityProvider!.getId(node.element).toString();

			if (viewState.focus.has(id)) {
				focus.push(node.element);
			}

			if (viewState.selection.has(id)) {
				selection.push(node.element);
			}
		};

		this._refresh(input, isCollapsed, onDidCreateNode);
		this.setFocus(focus);
		this.setSelection(selection);

		if (viewState && typeof viewState.scrollTop === 'number') {
			this.scrollTop = viewState.scrollTop;
		}
	}

	updateChildren(element: TInput | T = this.input!): void {
		if (typeof this.input === 'undefined') {
			throw new TreeError(this.user, 'Tree input not set');
		}

		let isCollapsed: ((el: T) => boolean | undefined) | undefined;

		if (this.identityProvider) {
			isCollapsed = element => {
				const id = this.identityProvider!.getId(element).toString();
				const node = this.nodesByIdentity.get(id);

				if (!node) {
					return undefined;
				}

				return node.collapsed;
			};
		}

		this._refresh(element, isCollapsed);
	}

	resort(element: T | TInput = this.input!, recursive = true): void {
		this.model.resort((element === this.input ? null : element) as T, recursive);
	}

	// View

	refresh(element?: T): void {
		if (element === undefined) {
			this.view.rerender();
			return;
		}

		this.model.rerender(element);
	}

	// Implementation

	private _refresh(element: TInput | T, isCollapsed?: (el: T) => boolean | undefined, onDidCreateNode?: (node: ITreeNode<T, TFilterData>) => void): void {
		let onDidDeleteNode: ((node: ITreeNode<T, TFilterData>) => void) | undefined;

		if (this.identityProvider) {
			const insertedElements = new Set<string>();

			const outerOnDidCreateNode = onDidCreateNode;
			onDidCreateNode = (node: ITreeNode<T, TFilterData>) => {
				const id = this.identityProvider!.getId(node.element).toString();

				insertedElements.add(id);
				this.nodesByIdentity.set(id, node);

				outerOnDidCreateNode?.(node);
			};

			onDidDeleteNode = (node: ITreeNode<T, TFilterData>) => {
				const id = this.identityProvider!.getId(node.element).toString();

				if (!insertedElements.has(id)) {
					this.nodesByIdentity.delete(id);
				}
			};
		}

		this.model.setChildren((element === this.input ? null : element) as T, this.iterate(element, isCollapsed).elements, { onDidCreateNode, onDidDeleteNode });
	}

	private iterate(element: TInput | T, isCollapsed?: (el: T) => boolean | undefined): { elements: Iterable<ITreeElement<T>>; size: number } {
		const children = [...this.dataSource.getChildren(element)];
		const elements = Iterable.map(children, element => {
			const { elements: children, size } = this.iterate(element, isCollapsed);
			const collapsible = this.dataSource.hasChildren ? this.dataSource.hasChildren(element) : undefined;
			const collapsed = size === 0 ? undefined : (isCollapsed && isCollapsed(element));

			return { element, children, collapsible, collapsed };
		});

		return { elements, size: children.length };
	}

	protected createModel(user: string, options: IDataTreeOptions<T | null, TFilterData>): ITreeModel<T | null, TFilterData, T | null> {
		return new ObjectTreeModel(user, options);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/tree/indexTree.ts]---
Location: vscode-main/src/vs/base/browser/ui/tree/indexTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IListVirtualDelegate } from '../list/list.js';
import { AbstractTree, IAbstractTreeOptions } from './abstractTree.js';
import { IndexTreeModel } from './indexTreeModel.js';
import { ITreeElement, ITreeModel, ITreeRenderer, TreeError } from './tree.js';
import { Iterable } from '../../../common/iterator.js';
import './media/tree.css';

export interface IIndexTreeOptions<T, TFilterData = void> extends IAbstractTreeOptions<T, TFilterData> { }

export class IndexTree<T, TFilterData = void> extends AbstractTree<T, TFilterData, number[]> {

	protected declare model: IndexTreeModel<T, TFilterData>;

	constructor(
		private readonly user: string,
		container: HTMLElement,
		delegate: IListVirtualDelegate<T>,
		renderers: ITreeRenderer<T, TFilterData, unknown>[],
		private rootElement: T,
		options: IIndexTreeOptions<T, TFilterData> = {}
	) {
		super(user, container, delegate, renderers, options);
	}

	splice(location: number[], deleteCount: number, toInsert: Iterable<ITreeElement<T>> = Iterable.empty()): void {
		this.model.splice(location, deleteCount, toInsert);
	}

	rerender(location?: number[]): void {
		if (location === undefined) {
			this.view.rerender();
			return;
		}

		this.model.rerender(location);
	}

	updateElementHeight(location: number[], height: number): void {
		if (location.length === 0) {
			throw new TreeError(this.user, `Update element height failed: invalid location`);
		}

		const elementIndex = this.model.getListIndex(location);
		if (elementIndex === -1) {
			return;
		}

		this.view.updateElementHeight(elementIndex, height);
	}

	protected createModel(user: string, options: IIndexTreeOptions<T, TFilterData>): ITreeModel<T, TFilterData, number[]> {
		return new IndexTreeModel(user, this.rootElement, options);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/tree/indexTreeModel.ts]---
Location: vscode-main/src/vs/base/browser/ui/tree/indexTreeModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IIdentityProvider } from '../list/list.js';
import { ICollapseStateChangeEvent, ITreeElement, ITreeFilter, ITreeFilterDataResult, ITreeListSpliceData, ITreeModel, ITreeModelSpliceEvent, ITreeNode, TreeError, TreeVisibility } from './tree.js';
import { splice, tail } from '../../../common/arrays.js';
import { Delayer } from '../../../common/async.js';
import { MicrotaskDelay } from '../../../common/symbols.js';
import { LcsDiff } from '../../../common/diff/diff.js';
import { Emitter, Event, EventBufferer } from '../../../common/event.js';
import { Iterable } from '../../../common/iterator.js';

// Exported for tests
export interface IIndexTreeNode<T, TFilterData = void> extends ITreeNode<T, TFilterData> {
	readonly parent: IIndexTreeNode<T, TFilterData> | undefined;
	readonly children: IIndexTreeNode<T, TFilterData>[];
	visibleChildrenCount: number;
	visibleChildIndex: number;
	collapsible: boolean;
	collapsed: boolean;
	renderNodeCount: number;
	visibility: TreeVisibility;
	visible: boolean;
	filterData: TFilterData | undefined;
	lastDiffIds?: string[];
}

export function isFilterResult<T>(obj: unknown): obj is ITreeFilterDataResult<T> {
	return !!obj && (<ITreeFilterDataResult<T>>obj).visibility !== undefined;
}

export function getVisibleState(visibility: boolean | TreeVisibility): TreeVisibility {
	switch (visibility) {
		case true: return TreeVisibility.Visible;
		case false: return TreeVisibility.Hidden;
		default: return visibility;
	}
}

export interface IIndexTreeModelOptions<T, TFilterData> {
	readonly collapseByDefault?: boolean; // defaults to false
	readonly allowNonCollapsibleParents?: boolean; // defaults to false
	readonly filter?: ITreeFilter<T, TFilterData>;
	readonly autoExpandSingleChildren?: boolean;
}

export interface IIndexTreeModelSpliceOptions<T, TFilterData> {
	/**
	 * If set, child updates will recurse the given number of levels even if
	 * items in the splice operation are unchanged. `Infinity` is a valid value.
	 */
	readonly diffDepth?: number;

	/**
	 * Identity provider used to optimize splice() calls in the IndexTree. If
	 * this is not present, optimized splicing is not enabled.
	 *
	 * Warning: if this is present, calls to `setChildren()` will not replace
	 * or update nodes if their identity is the same, even if the elements are
	 * different. For this, you should call `rerender()`.
	 */
	readonly diffIdentityProvider?: IIdentityProvider<T>;

	/**
	 * Callback for when a node is created.
	 */
	onDidCreateNode?: (node: ITreeNode<T, TFilterData>) => void;

	/**
	 * Callback for when a node is deleted.
	 */
	onDidDeleteNode?: (node: ITreeNode<T, TFilterData>) => void;
}

interface CollapsibleStateUpdate {
	readonly collapsible: boolean;
}

interface CollapsedStateUpdate {
	readonly collapsed: boolean;
	readonly recursive: boolean;
}

type CollapseStateUpdate = CollapsibleStateUpdate | CollapsedStateUpdate;

function isCollapsibleStateUpdate(update: CollapseStateUpdate): update is CollapsibleStateUpdate {
	return 'collapsible' in update;
}

export class IndexTreeModel<T extends Exclude<unknown, undefined>, TFilterData = void> implements ITreeModel<T, TFilterData, number[]> {

	readonly rootRef = [];

	private root: IIndexTreeNode<T, TFilterData>;
	private eventBufferer = new EventBufferer();

	private readonly _onDidSpliceModel = new Emitter<ITreeModelSpliceEvent<T, TFilterData>>();
	readonly onDidSpliceModel = this._onDidSpliceModel.event;

	private readonly _onDidSpliceRenderedNodes = new Emitter<ITreeListSpliceData<T, TFilterData>>();
	readonly onDidSpliceRenderedNodes = this._onDidSpliceRenderedNodes.event;

	private readonly _onDidChangeCollapseState = new Emitter<ICollapseStateChangeEvent<T, TFilterData>>();
	readonly onDidChangeCollapseState: Event<ICollapseStateChangeEvent<T, TFilterData>> = this.eventBufferer.wrapEvent(this._onDidChangeCollapseState.event);

	private readonly _onDidChangeRenderNodeCount = new Emitter<ITreeNode<T, TFilterData>>();
	readonly onDidChangeRenderNodeCount: Event<ITreeNode<T, TFilterData>> = this.eventBufferer.wrapEvent(this._onDidChangeRenderNodeCount.event);

	private collapseByDefault: boolean;
	private allowNonCollapsibleParents: boolean;
	private filter?: ITreeFilter<T, TFilterData>;
	private autoExpandSingleChildren: boolean;

	private readonly refilterDelayer = new Delayer(MicrotaskDelay);

	constructor(
		private user: string,
		rootElement: T,
		options: IIndexTreeModelOptions<T, TFilterData> = {}
	) {
		this.collapseByDefault = typeof options.collapseByDefault === 'undefined' ? false : options.collapseByDefault;
		this.allowNonCollapsibleParents = options.allowNonCollapsibleParents ?? false;
		this.filter = options.filter;
		this.autoExpandSingleChildren = typeof options.autoExpandSingleChildren === 'undefined' ? false : options.autoExpandSingleChildren;

		this.root = {
			parent: undefined,
			element: rootElement,
			children: [],
			depth: 0,
			visibleChildrenCount: 0,
			visibleChildIndex: -1,
			collapsible: false,
			collapsed: false,
			renderNodeCount: 0,
			visibility: TreeVisibility.Visible,
			visible: true,
			filterData: undefined
		};
	}

	splice(
		location: number[],
		deleteCount: number,
		toInsert: Iterable<ITreeElement<T>> = Iterable.empty(),
		options: IIndexTreeModelSpliceOptions<T, TFilterData> = {},
	): void {
		if (location.length === 0) {
			throw new TreeError(this.user, 'Invalid tree location');
		}

		if (options.diffIdentityProvider) {
			this.spliceSmart(options.diffIdentityProvider, location, deleteCount, toInsert, options);
		} else {
			this.spliceSimple(location, deleteCount, toInsert, options);
		}
	}

	private spliceSmart(
		identity: IIdentityProvider<T>,
		location: number[],
		deleteCount: number,
		toInsertIterable: Iterable<ITreeElement<T>> = Iterable.empty(),
		options: IIndexTreeModelSpliceOptions<T, TFilterData>,
		recurseLevels = options.diffDepth ?? 0,
	) {
		const { parentNode } = this.getParentNodeWithListIndex(location);
		if (!parentNode.lastDiffIds) {
			return this.spliceSimple(location, deleteCount, toInsertIterable, options);
		}

		const toInsert = [...toInsertIterable];
		const index = location[location.length - 1];
		const diff = new LcsDiff(
			{ getElements: () => parentNode.lastDiffIds! },
			{
				getElements: () => [
					...parentNode.children.slice(0, index),
					...toInsert,
					...parentNode.children.slice(index + deleteCount),
				].map(e => identity.getId(e.element).toString())
			},
		).ComputeDiff(false);

		// if we were given a 'best effort' diff, use default behavior
		if (diff.quitEarly) {
			parentNode.lastDiffIds = undefined;
			return this.spliceSimple(location, deleteCount, toInsert, options);
		}

		const locationPrefix = location.slice(0, -1);
		const recurseSplice = (fromOriginal: number, fromModified: number, count: number) => {
			if (recurseLevels > 0) {
				for (let i = 0; i < count; i++) {
					fromOriginal--;
					fromModified--;
					this.spliceSmart(
						identity,
						[...locationPrefix, fromOriginal, 0],
						Number.MAX_SAFE_INTEGER,
						toInsert[fromModified].children,
						options,
						recurseLevels - 1,
					);
				}
			}
		};

		let lastStartO = Math.min(parentNode.children.length, index + deleteCount);
		let lastStartM = toInsert.length;
		for (const change of diff.changes.sort((a, b) => b.originalStart - a.originalStart)) {
			recurseSplice(lastStartO, lastStartM, lastStartO - (change.originalStart + change.originalLength));
			lastStartO = change.originalStart;
			lastStartM = change.modifiedStart - index;

			this.spliceSimple(
				[...locationPrefix, lastStartO],
				change.originalLength,
				Iterable.slice(toInsert, lastStartM, lastStartM + change.modifiedLength),
				options,
			);
		}

		// at this point, startO === startM === count since any remaining prefix should match
		recurseSplice(lastStartO, lastStartM, lastStartO);
	}

	private spliceSimple(
		location: number[],
		deleteCount: number,
		toInsert: Iterable<ITreeElement<T>> = Iterable.empty(),
		{ onDidCreateNode, onDidDeleteNode, diffIdentityProvider }: IIndexTreeModelSpliceOptions<T, TFilterData>,
	) {
		const { parentNode, listIndex, revealed, visible } = this.getParentNodeWithListIndex(location);
		const treeListElementsToInsert: ITreeNode<T, TFilterData>[] = [];
		const nodesToInsertIterator = Iterable.map(toInsert, el => this.createTreeNode(el, parentNode, parentNode.visible ? TreeVisibility.Visible : TreeVisibility.Hidden, revealed, treeListElementsToInsert, onDidCreateNode));

		const lastIndex = location[location.length - 1];

		// figure out what's the visible child start index right before the
		// splice point
		let visibleChildStartIndex = 0;

		for (let i = lastIndex; i >= 0 && i < parentNode.children.length; i--) {
			const child = parentNode.children[i];

			if (child.visible) {
				visibleChildStartIndex = child.visibleChildIndex;
				break;
			}
		}

		const nodesToInsert: IIndexTreeNode<T, TFilterData>[] = [];
		let insertedVisibleChildrenCount = 0;
		let renderNodeCount = 0;

		for (const child of nodesToInsertIterator) {
			nodesToInsert.push(child);
			renderNodeCount += child.renderNodeCount;

			if (child.visible) {
				child.visibleChildIndex = visibleChildStartIndex + insertedVisibleChildrenCount++;
			}
		}

		const deletedNodes = splice(parentNode.children, lastIndex, deleteCount, nodesToInsert);

		if (!diffIdentityProvider) {
			parentNode.lastDiffIds = undefined;
		} else if (parentNode.lastDiffIds) {
			splice(parentNode.lastDiffIds, lastIndex, deleteCount, nodesToInsert.map(n => diffIdentityProvider.getId(n.element).toString()));
		} else {
			parentNode.lastDiffIds = parentNode.children.map(n => diffIdentityProvider.getId(n.element).toString());
		}

		// figure out what is the count of deleted visible children
		let deletedVisibleChildrenCount = 0;

		for (const child of deletedNodes) {
			if (child.visible) {
				deletedVisibleChildrenCount++;
			}
		}

		// and adjust for all visible children after the splice point
		if (deletedVisibleChildrenCount !== 0) {
			for (let i = lastIndex + nodesToInsert.length; i < parentNode.children.length; i++) {
				const child = parentNode.children[i];

				if (child.visible) {
					child.visibleChildIndex -= deletedVisibleChildrenCount;
				}
			}
		}

		// update parent's visible children count
		parentNode.visibleChildrenCount += insertedVisibleChildrenCount - deletedVisibleChildrenCount;

		if (deletedNodes.length > 0 && onDidDeleteNode) {
			const visit = (node: ITreeNode<T, TFilterData>) => {
				onDidDeleteNode(node);
				node.children.forEach(visit);
			};

			deletedNodes.forEach(visit);
		}

		if (revealed && visible) {
			const visibleDeleteCount = deletedNodes.reduce((r, node) => r + (node.visible ? node.renderNodeCount : 0), 0);

			this._updateAncestorsRenderNodeCount(parentNode, renderNodeCount - visibleDeleteCount);
			this._onDidSpliceRenderedNodes.fire({ start: listIndex, deleteCount: visibleDeleteCount, elements: treeListElementsToInsert });
		}

		this._onDidSpliceModel.fire({ insertedNodes: nodesToInsert, deletedNodes });

		let node: IIndexTreeNode<T, TFilterData> | undefined = parentNode;

		while (node) {
			if (node.visibility === TreeVisibility.Recurse) {
				// delayed to avoid excessive refiltering, see #135941
				this.refilterDelayer.trigger(() => this.refilter());
				break;
			}

			node = node.parent;
		}
	}

	rerender(location: number[]): void {
		if (location.length === 0) {
			throw new TreeError(this.user, 'Invalid tree location');
		}

		const { node, listIndex, revealed } = this.getTreeNodeWithListIndex(location);

		if (node.visible && revealed) {
			this._onDidSpliceRenderedNodes.fire({ start: listIndex, deleteCount: 1, elements: [node] });
		}
	}

	has(location: number[]): boolean {
		return this.hasTreeNode(location);
	}

	getListIndex(location: number[]): number {
		const { listIndex, visible, revealed } = this.getTreeNodeWithListIndex(location);
		return visible && revealed ? listIndex : -1;
	}

	getListRenderCount(location: number[]): number {
		return this.getTreeNode(location).renderNodeCount;
	}

	isCollapsible(location: number[]): boolean {
		return this.getTreeNode(location).collapsible;
	}

	setCollapsible(location: number[], collapsible?: boolean): boolean {
		const node = this.getTreeNode(location);

		if (typeof collapsible === 'undefined') {
			collapsible = !node.collapsible;
		}

		const update: CollapsibleStateUpdate = { collapsible };
		return this.eventBufferer.bufferEvents(() => this._setCollapseState(location, update));
	}

	isCollapsed(location: number[]): boolean {
		return this.getTreeNode(location).collapsed;
	}

	setCollapsed(location: number[], collapsed?: boolean, recursive?: boolean): boolean {
		const node = this.getTreeNode(location);

		if (typeof collapsed === 'undefined') {
			collapsed = !node.collapsed;
		}

		const update: CollapsedStateUpdate = { collapsed, recursive: recursive || false };
		return this.eventBufferer.bufferEvents(() => this._setCollapseState(location, update));
	}

	private _setCollapseState(location: number[], update: CollapseStateUpdate): boolean {
		const { node, listIndex, revealed } = this.getTreeNodeWithListIndex(location);

		const result = this._setListNodeCollapseState(node, listIndex, revealed, update);

		if (node !== this.root && this.autoExpandSingleChildren && result && !isCollapsibleStateUpdate(update) && node.collapsible && !node.collapsed && !update.recursive) {
			let onlyVisibleChildIndex = -1;

			for (let i = 0; i < node.children.length; i++) {
				const child = node.children[i];

				if (child.visible) {
					if (onlyVisibleChildIndex > -1) {
						onlyVisibleChildIndex = -1;
						break;
					} else {
						onlyVisibleChildIndex = i;
					}
				}
			}

			if (onlyVisibleChildIndex > -1) {
				this._setCollapseState([...location, onlyVisibleChildIndex], update);
			}
		}

		return result;
	}

	private _setListNodeCollapseState(node: IIndexTreeNode<T, TFilterData>, listIndex: number, revealed: boolean, update: CollapseStateUpdate): boolean {
		const result = this._setNodeCollapseState(node, update, false);

		if (!revealed || !node.visible || !result) {
			return result;
		}

		const previousRenderNodeCount = node.renderNodeCount;
		const toInsert = this.updateNodeAfterCollapseChange(node);
		const deleteCount = previousRenderNodeCount - (listIndex === -1 ? 0 : 1);
		this._onDidSpliceRenderedNodes.fire({ start: listIndex + 1, deleteCount: deleteCount, elements: toInsert.slice(1) });

		return result;
	}

	private _setNodeCollapseState(node: IIndexTreeNode<T, TFilterData>, update: CollapseStateUpdate, deep: boolean): boolean {
		let result: boolean;

		if (node === this.root) {
			result = false;
		} else {
			if (isCollapsibleStateUpdate(update)) {
				result = node.collapsible !== update.collapsible;
				node.collapsible = update.collapsible;
			} else if (!node.collapsible) {
				result = false;
			} else {
				result = node.collapsed !== update.collapsed;
				node.collapsed = update.collapsed;
			}

			if (result) {
				this._onDidChangeCollapseState.fire({ node, deep });
			}
		}

		if (!isCollapsibleStateUpdate(update) && update.recursive) {
			for (const child of node.children) {
				result = this._setNodeCollapseState(child, update, true) || result;
			}
		}

		return result;
	}

	expandTo(location: number[]): void {
		this.eventBufferer.bufferEvents(() => {
			let node = this.getTreeNode(location);

			while (node.parent) {
				node = node.parent;
				location = location.slice(0, location.length - 1);

				if (node.collapsed) {
					this._setCollapseState(location, { collapsed: false, recursive: false });
				}
			}
		});
	}

	refilter(): void {
		const previousRenderNodeCount = this.root.renderNodeCount;
		const toInsert = this.updateNodeAfterFilterChange(this.root);
		this._onDidSpliceRenderedNodes.fire({ start: 0, deleteCount: previousRenderNodeCount, elements: toInsert });
		this.refilterDelayer.cancel();
	}

	private createTreeNode(
		treeElement: ITreeElement<T>,
		parent: IIndexTreeNode<T, TFilterData>,
		parentVisibility: TreeVisibility,
		revealed: boolean,
		treeListElements: ITreeNode<T, TFilterData>[],
		onDidCreateNode?: (node: ITreeNode<T, TFilterData>) => void
	): IIndexTreeNode<T, TFilterData> {
		const node: IIndexTreeNode<T, TFilterData> = {
			parent,
			element: treeElement.element,
			children: [],
			depth: parent.depth + 1,
			visibleChildrenCount: 0,
			visibleChildIndex: -1,
			collapsible: typeof treeElement.collapsible === 'boolean' ? treeElement.collapsible : (typeof treeElement.collapsed !== 'undefined'),
			collapsed: typeof treeElement.collapsed === 'undefined' ? this.collapseByDefault : treeElement.collapsed,
			renderNodeCount: 1,
			visibility: TreeVisibility.Visible,
			visible: true,
			filterData: undefined
		};

		const visibility = this._filterNode(node, parentVisibility);
		node.visibility = visibility;

		if (revealed) {
			treeListElements.push(node);
		}

		const childElements = treeElement.children || Iterable.empty();
		const childRevealed = revealed && visibility !== TreeVisibility.Hidden && !node.collapsed;

		let visibleChildrenCount = 0;
		let renderNodeCount = 1;

		for (const el of childElements) {
			const child = this.createTreeNode(el, node, visibility, childRevealed, treeListElements, onDidCreateNode);
			node.children.push(child);
			renderNodeCount += child.renderNodeCount;

			if (child.visible) {
				child.visibleChildIndex = visibleChildrenCount++;
			}
		}

		if (!this.allowNonCollapsibleParents) {
			node.collapsible = node.collapsible || node.children.length > 0;
		}

		node.visibleChildrenCount = visibleChildrenCount;
		node.visible = visibility === TreeVisibility.Recurse ? visibleChildrenCount > 0 : (visibility === TreeVisibility.Visible);

		if (!node.visible) {
			node.renderNodeCount = 0;

			if (revealed) {
				treeListElements.pop();
			}
		} else if (!node.collapsed) {
			node.renderNodeCount = renderNodeCount;
		}

		onDidCreateNode?.(node);

		return node;
	}

	private updateNodeAfterCollapseChange(node: IIndexTreeNode<T, TFilterData>): ITreeNode<T, TFilterData>[] {
		const previousRenderNodeCount = node.renderNodeCount;
		const result: ITreeNode<T, TFilterData>[] = [];

		this._updateNodeAfterCollapseChange(node, result);
		this._updateAncestorsRenderNodeCount(node.parent, result.length - previousRenderNodeCount);

		return result;
	}

	private _updateNodeAfterCollapseChange(node: IIndexTreeNode<T, TFilterData>, result: ITreeNode<T, TFilterData>[]): number {
		if (node.visible === false) {
			return 0;
		}

		result.push(node);
		node.renderNodeCount = 1;

		if (!node.collapsed) {
			for (const child of node.children) {
				node.renderNodeCount += this._updateNodeAfterCollapseChange(child, result);
			}
		}

		this._onDidChangeRenderNodeCount.fire(node);
		return node.renderNodeCount;
	}

	private updateNodeAfterFilterChange(node: IIndexTreeNode<T, TFilterData>): ITreeNode<T, TFilterData>[] {
		const previousRenderNodeCount = node.renderNodeCount;
		const result: ITreeNode<T, TFilterData>[] = [];

		this._updateNodeAfterFilterChange(node, node.visible ? TreeVisibility.Visible : TreeVisibility.Hidden, result);
		this._updateAncestorsRenderNodeCount(node.parent, result.length - previousRenderNodeCount);

		return result;
	}

	private _updateNodeAfterFilterChange(node: IIndexTreeNode<T, TFilterData>, parentVisibility: TreeVisibility, result: ITreeNode<T, TFilterData>[], revealed = true): boolean {
		let visibility: TreeVisibility;

		if (node !== this.root) {
			visibility = this._filterNode(node, parentVisibility);

			if (visibility === TreeVisibility.Hidden) {
				node.visible = false;
				node.renderNodeCount = 0;
				return false;
			}

			if (revealed) {
				result.push(node);
			}
		}

		const resultStartLength = result.length;
		node.renderNodeCount = node === this.root ? 0 : 1;

		let hasVisibleDescendants = false;
		if (!node.collapsed || visibility! !== TreeVisibility.Hidden) {
			let visibleChildIndex = 0;

			for (const child of node.children) {
				hasVisibleDescendants = this._updateNodeAfterFilterChange(child, visibility!, result, revealed && !node.collapsed) || hasVisibleDescendants;

				if (child.visible) {
					child.visibleChildIndex = visibleChildIndex++;
				}
			}

			node.visibleChildrenCount = visibleChildIndex;
		} else {
			node.visibleChildrenCount = 0;
		}

		if (node !== this.root) {
			node.visible = visibility! === TreeVisibility.Recurse ? hasVisibleDescendants : (visibility! === TreeVisibility.Visible);
			node.visibility = visibility!;
		}

		if (!node.visible) {
			node.renderNodeCount = 0;

			if (revealed) {
				result.pop();
			}
		} else if (!node.collapsed) {
			node.renderNodeCount += result.length - resultStartLength;
		}

		this._onDidChangeRenderNodeCount.fire(node);
		return node.visible;
	}

	private _updateAncestorsRenderNodeCount(node: IIndexTreeNode<T, TFilterData> | undefined, diff: number): void {
		if (diff === 0) {
			return;
		}

		while (node) {
			node.renderNodeCount += diff;
			this._onDidChangeRenderNodeCount.fire(node);
			node = node.parent;
		}
	}

	private _filterNode(node: IIndexTreeNode<T, TFilterData>, parentVisibility: TreeVisibility): TreeVisibility {
		const result = this.filter ? this.filter.filter(node.element, parentVisibility) : TreeVisibility.Visible;

		if (typeof result === 'boolean') {
			node.filterData = undefined;
			return result ? TreeVisibility.Visible : TreeVisibility.Hidden;
		} else if (isFilterResult<TFilterData>(result)) {
			node.filterData = result.data;
			return getVisibleState(result.visibility);
		} else {
			node.filterData = undefined;
			return getVisibleState(result);
		}
	}

	// cheap
	private hasTreeNode(location: number[], node: IIndexTreeNode<T, TFilterData> = this.root): boolean {
		if (!location || location.length === 0) {
			return true;
		}

		const [index, ...rest] = location;

		if (index < 0 || index > node.children.length) {
			return false;
		}

		return this.hasTreeNode(rest, node.children[index]);
	}

	// cheap
	private getTreeNode(location: number[], node: IIndexTreeNode<T, TFilterData> = this.root): IIndexTreeNode<T, TFilterData> {
		if (!location || location.length === 0) {
			return node;
		}

		const [index, ...rest] = location;

		if (index < 0 || index > node.children.length) {
			throw new TreeError(this.user, 'Invalid tree location');
		}

		return this.getTreeNode(rest, node.children[index]);
	}

	// expensive
	private getTreeNodeWithListIndex(location: number[]): { node: IIndexTreeNode<T, TFilterData>; listIndex: number; revealed: boolean; visible: boolean } {
		if (location.length === 0) {
			return { node: this.root, listIndex: -1, revealed: true, visible: false };
		}

		const { parentNode, listIndex, revealed, visible } = this.getParentNodeWithListIndex(location);
		const index = location[location.length - 1];

		if (index < 0 || index > parentNode.children.length) {
			throw new TreeError(this.user, 'Invalid tree location');
		}

		const node = parentNode.children[index];

		return { node, listIndex, revealed, visible: visible && node.visible };
	}

	private getParentNodeWithListIndex(location: number[], node: IIndexTreeNode<T, TFilterData> = this.root, listIndex: number = 0, revealed = true, visible = true): { parentNode: IIndexTreeNode<T, TFilterData>; listIndex: number; revealed: boolean; visible: boolean } {
		const [index, ...rest] = location;

		if (index < 0 || index > node.children.length) {
			throw new TreeError(this.user, 'Invalid tree location');
		}

		// TODO@joao perf!
		for (let i = 0; i < index; i++) {
			listIndex += node.children[i].renderNodeCount;
		}

		revealed = revealed && !node.collapsed;
		visible = visible && node.visible;

		if (rest.length === 0) {
			return { parentNode: node, listIndex, revealed, visible };
		}

		return this.getParentNodeWithListIndex(rest, node.children[index], listIndex + 1, revealed, visible);
	}

	getNode(location: number[] = []): ITreeNode<T, TFilterData> {
		return this.getTreeNode(location);
	}

	// TODO@joao perf!
	getNodeLocation(node: ITreeNode<T, TFilterData>): number[] {
		const location: number[] = [];
		let indexTreeNode = node as IIndexTreeNode<T, TFilterData>; // typing woes

		while (indexTreeNode.parent) {
			location.push(indexTreeNode.parent.children.indexOf(indexTreeNode));
			indexTreeNode = indexTreeNode.parent;
		}

		return location.reverse();
	}

	getParentNodeLocation(location: number[]): number[] | undefined {
		if (location.length === 0) {
			return undefined;
		} else if (location.length === 1) {
			return [];
		} else {
			return tail(location)[0];
		}
	}

	getFirstElementChild(location: number[]): T | undefined {
		const node = this.getTreeNode(location);

		if (node.children.length === 0) {
			return undefined;
		}

		return node.children[0].element;
	}

	getLastElementAncestor(location: number[] = []): T | undefined {
		const node = this.getTreeNode(location);

		if (node.children.length === 0) {
			return undefined;
		}

		return this._getLastElementAncestor(node);
	}

	private _getLastElementAncestor(node: ITreeNode<T, TFilterData>): T {
		if (node.children.length === 0) {
			return node.element;
		}

		return this._getLastElementAncestor(node.children[node.children.length - 1]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/tree/objectTree.ts]---
Location: vscode-main/src/vs/base/browser/ui/tree/objectTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IIdentityProvider, IKeyboardNavigationLabelProvider, IListVirtualDelegate } from '../list/list.js';
import { AbstractTree, IAbstractTreeOptions, IAbstractTreeOptionsUpdate, IStickyScrollDelegate, StickyScrollNode } from './abstractTree.js';
import { CompressibleObjectTreeModel, ElementMapper, ICompressedTreeElement, ICompressedTreeNode } from './compressedObjectTreeModel.js';
import { IObjectTreeModel, ObjectTreeModel } from './objectTreeModel.js';
import { ICollapseStateChangeEvent, IObjectTreeElement, ITreeElementRenderDetails, ITreeModel, ITreeNode, ITreeRenderer, ITreeSorter } from './tree.js';
import { memoize } from '../../../common/decorators.js';
import { Event } from '../../../common/event.js';
import { Iterable } from '../../../common/iterator.js';

export interface IObjectTreeOptions<T, TFilterData = void> extends IAbstractTreeOptions<T, TFilterData> {
	readonly sorter?: ITreeSorter<T>;
}

export interface IObjectTreeSetChildrenOptions<T> {

	/**
	 * If set, child updates will recurse the given number of levels even if
	 * items in the splice operation are unchanged. `Infinity` is a valid value.
	 */
	readonly diffDepth?: number;

	/**
	 * Identity provider used to optimize splice() calls in the IndexTree. If
	 * this is not present, optimized splicing is not enabled.
	 *
	 * Warning: if this is present, calls to `setChildren()` will not replace
	 * or update nodes if their identity is the same, even if the elements are
	 * different. For this, you should call `rerender()`.
	 */
	readonly diffIdentityProvider?: IIdentityProvider<T>;
}

export class ObjectTree<T, TFilterData = void> extends AbstractTree<T | null, TFilterData, T | null> {

	protected declare model: IObjectTreeModel<T, TFilterData>;

	override get onDidChangeCollapseState(): Event<ICollapseStateChangeEvent<T | null, TFilterData>> { return this.model.onDidChangeCollapseState; }

	constructor(
		protected readonly user: string,
		container: HTMLElement,
		delegate: IListVirtualDelegate<T>,
		renderers: ITreeRenderer<T, TFilterData, unknown>[],
		options: IObjectTreeOptions<T, TFilterData> = {}
	) {
		super(user, container, delegate, renderers, options as IObjectTreeOptions<T | null, TFilterData>);
	}

	setChildren(element: T | null, children: Iterable<IObjectTreeElement<T>> = Iterable.empty(), options?: IObjectTreeSetChildrenOptions<T>): void {
		this.model.setChildren(element, children, options);
	}

	rerender(element?: T): void {
		if (element === undefined) {
			this.view.rerender();
			return;
		}

		this.model.rerender(element);
	}

	updateElementHeight(element: T, height: number | undefined): void {
		const elementIndex = this.model.getListIndex(element);
		if (elementIndex === -1) {
			return;
		}

		this.view.updateElementHeight(elementIndex, height);
	}

	resort(element: T | null, recursive = true): void {
		this.model.resort(element, recursive);
	}

	hasElement(element: T): boolean {
		return this.model.has(element);
	}

	protected createModel(user: string, options: IObjectTreeOptions<T | null, TFilterData>): ITreeModel<T | null, TFilterData, T | null> {
		return new ObjectTreeModel(user, options);
	}
}

interface ICompressedTreeNodeProvider<T, TFilterData> {
	getCompressedTreeNode(location: T | null): ITreeNode<ICompressedTreeNode<T> | null, TFilterData>;
}

export interface ICompressibleTreeRenderer<T, TFilterData = void, TTemplateData = void> extends ITreeRenderer<T, TFilterData, TTemplateData> {
	renderCompressedElements(node: ITreeNode<ICompressedTreeNode<T>, TFilterData>, index: number, templateData: TTemplateData, details?: ITreeElementRenderDetails): void;
	disposeCompressedElements?(node: ITreeNode<ICompressedTreeNode<T>, TFilterData>, index: number, templateData: TTemplateData, details?: ITreeElementRenderDetails): void;
}

interface CompressibleTemplateData<T, TFilterData, TTemplateData> {
	compressedTreeNode: ITreeNode<ICompressedTreeNode<T>, TFilterData> | undefined;
	readonly data: TTemplateData;
}

class CompressibleRenderer<T, TFilterData, TTemplateData> implements ITreeRenderer<T, TFilterData, CompressibleTemplateData<T, TFilterData, TTemplateData>> {

	readonly templateId: string;
	readonly onDidChangeTwistieState: Event<T> | undefined;

	@memoize
	private get compressedTreeNodeProvider(): ICompressedTreeNodeProvider<T, TFilterData> {
		return this._compressedTreeNodeProvider();
	}

	constructor(private _compressedTreeNodeProvider: () => ICompressedTreeNodeProvider<T, TFilterData>, private stickyScrollDelegate: CompressibleStickyScrollDelegate<T, TFilterData>, private renderer: ICompressibleTreeRenderer<T, TFilterData, TTemplateData>) {
		this.templateId = renderer.templateId;

		if (renderer.onDidChangeTwistieState) {
			this.onDidChangeTwistieState = renderer.onDidChangeTwistieState;
		}
	}

	renderTemplate(container: HTMLElement): CompressibleTemplateData<T, TFilterData, TTemplateData> {
		const data = this.renderer.renderTemplate(container);
		return { compressedTreeNode: undefined, data };
	}

	renderElement(node: ITreeNode<T, TFilterData>, index: number, templateData: CompressibleTemplateData<T, TFilterData, TTemplateData>, details?: ITreeElementRenderDetails): void {
		let compressedTreeNode = this.stickyScrollDelegate.getCompressedNode(node);
		if (!compressedTreeNode) {
			compressedTreeNode = this.compressedTreeNodeProvider.getCompressedTreeNode(node.element) as ITreeNode<ICompressedTreeNode<T>, TFilterData>;
		}

		if (compressedTreeNode.element.elements.length === 1) {
			templateData.compressedTreeNode = undefined;
			this.renderer.renderElement(node, index, templateData.data, details);
		} else {
			templateData.compressedTreeNode = compressedTreeNode;
			this.renderer.renderCompressedElements(compressedTreeNode, index, templateData.data, details);
		}
	}

	disposeElement(node: ITreeNode<T, TFilterData>, index: number, templateData: CompressibleTemplateData<T, TFilterData, TTemplateData>, details?: ITreeElementRenderDetails): void {
		if (templateData.compressedTreeNode) {
			this.renderer.disposeCompressedElements?.(templateData.compressedTreeNode, index, templateData.data, details);
		} else {
			this.renderer.disposeElement?.(node, index, templateData.data, details);
		}
	}

	disposeTemplate(templateData: CompressibleTemplateData<T, TFilterData, TTemplateData>): void {
		this.renderer.disposeTemplate(templateData.data);
	}

	renderTwistie(element: T, twistieElement: HTMLElement): boolean {
		return this.renderer.renderTwistie?.(element, twistieElement) ?? false;
	}
}

class CompressibleStickyScrollDelegate<T, TFilterData> implements IStickyScrollDelegate<T, TFilterData> {

	private readonly compressedStickyNodes = new Map<ITreeNode<T, TFilterData>, ITreeNode<ICompressedTreeNode<T>, TFilterData>>();

	constructor(private readonly modelProvider: () => CompressibleObjectTreeModel<T, TFilterData>) { }

	getCompressedNode(node: ITreeNode<T, TFilterData>): ITreeNode<ICompressedTreeNode<T>, TFilterData> | undefined {
		return this.compressedStickyNodes.get(node);
	}

	constrainStickyScrollNodes(stickyNodes: StickyScrollNode<T, TFilterData>[], stickyScrollMaxItemCount: number, maxWidgetHeight: number): StickyScrollNode<T, TFilterData>[] {
		this.compressedStickyNodes.clear();
		if (stickyNodes.length === 0) {
			return [];
		}

		for (let i = 0; i < stickyNodes.length; i++) {
			const stickyNode = stickyNodes[i];
			const stickyNodeBottom = stickyNode.position + stickyNode.height;
			const followingReachesMaxHeight = i + 1 < stickyNodes.length && stickyNodeBottom + stickyNodes[i + 1].height > maxWidgetHeight;

			if (followingReachesMaxHeight || i >= stickyScrollMaxItemCount - 1 && stickyScrollMaxItemCount < stickyNodes.length) {
				const uncompressedStickyNodes = stickyNodes.slice(0, i);
				const overflowingStickyNodes = stickyNodes.slice(i);
				const compressedStickyNode = this.compressStickyNodes(overflowingStickyNodes);
				return [...uncompressedStickyNodes, compressedStickyNode];
			}

		}

		return stickyNodes;
	}

	private compressStickyNodes(stickyNodes: StickyScrollNode<T, TFilterData>[]): StickyScrollNode<T, TFilterData> {

		if (stickyNodes.length === 0) {
			throw new Error('Can\'t compress empty sticky nodes');
		}
		const compressionModel = this.modelProvider();
		if (!compressionModel.isCompressionEnabled()) {
			return stickyNodes[0];
		}

		// Collect all elements to be compressed
		const elements: T[] = [];
		for (let i = 0; i < stickyNodes.length; i++) {
			const stickyNode = stickyNodes[i];
			const compressedNode = compressionModel.getCompressedTreeNode(stickyNode.node.element);

			if (compressedNode.element) {
				// if an element is incompressible, it can't be compressed with it's parent element
				if (i !== 0 && compressedNode.element.incompressible) {
					break;
				}
				elements.push(...compressedNode.element.elements);
			}
		}

		if (elements.length < 2) {
			return stickyNodes[0];
		}

		// Compress the elements
		const lastStickyNode = stickyNodes[stickyNodes.length - 1];
		const compressedElement: ICompressedTreeNode<T> = { elements, incompressible: false };
		const compressedNode: ITreeNode<ICompressedTreeNode<T>, TFilterData> = { ...lastStickyNode.node, children: [], element: compressedElement };

		const stickyTreeNode = new Proxy(stickyNodes[0].node, {});

		const compressedStickyNode: StickyScrollNode<T, TFilterData> = {
			node: stickyTreeNode,
			startIndex: stickyNodes[0].startIndex,
			endIndex: lastStickyNode.endIndex,
			position: stickyNodes[0].position,
			height: stickyNodes[0].height,
		};

		this.compressedStickyNodes.set(stickyTreeNode, compressedNode);

		return compressedStickyNode;
	}
}

export interface ICompressibleKeyboardNavigationLabelProvider<T> extends IKeyboardNavigationLabelProvider<T> {
	getCompressedNodeKeyboardNavigationLabel(elements: T[]): { toString(): string | undefined } | undefined;
}

export interface ICompressibleObjectTreeOptions<T, TFilterData = void> extends IObjectTreeOptions<T, TFilterData> {
	readonly compressionEnabled?: boolean;
	readonly elementMapper?: ElementMapper<T>;
	readonly keyboardNavigationLabelProvider?: ICompressibleKeyboardNavigationLabelProvider<T>;
}

function asObjectTreeOptions<T, TFilterData>(compressedTreeNodeProvider: () => ICompressedTreeNodeProvider<T, TFilterData>, options?: ICompressibleObjectTreeOptions<T, TFilterData>): IObjectTreeOptions<T, TFilterData> | undefined {
	return options && {
		...options,
		keyboardNavigationLabelProvider: options.keyboardNavigationLabelProvider && {
			getKeyboardNavigationLabel(e: T) {
				let compressedTreeNode: ITreeNode<ICompressedTreeNode<T>, TFilterData>;

				try {
					compressedTreeNode = compressedTreeNodeProvider().getCompressedTreeNode(e) as ITreeNode<ICompressedTreeNode<T>, TFilterData>;
				} catch {
					return options.keyboardNavigationLabelProvider!.getKeyboardNavigationLabel(e);
				}

				if (compressedTreeNode.element.elements.length === 1) {
					return options.keyboardNavigationLabelProvider!.getKeyboardNavigationLabel(e);
				} else {
					return options.keyboardNavigationLabelProvider!.getCompressedNodeKeyboardNavigationLabel(compressedTreeNode.element.elements);
				}
			}
		}
	};
}

export interface ICompressibleObjectTreeOptionsUpdate<T> extends IAbstractTreeOptionsUpdate<T> {
	readonly compressionEnabled?: boolean;
}

export class CompressibleObjectTree<T, TFilterData = void> extends ObjectTree<T, TFilterData> implements ICompressedTreeNodeProvider<T, TFilterData> {

	protected declare model: CompressibleObjectTreeModel<T, TFilterData>;

	constructor(
		user: string,
		container: HTMLElement,
		delegate: IListVirtualDelegate<T>,
		renderers: ICompressibleTreeRenderer<T, TFilterData, unknown>[],
		options: ICompressibleObjectTreeOptions<T, TFilterData> = {}
	) {
		const compressedTreeNodeProvider = () => this;
		const stickyScrollDelegate = new CompressibleStickyScrollDelegate<T, TFilterData>(() => this.model);
		const compressibleRenderers = renderers.map(r => new CompressibleRenderer<T, TFilterData, unknown>(compressedTreeNodeProvider, stickyScrollDelegate, r));

		super(user, container, delegate, compressibleRenderers, { ...asObjectTreeOptions<T, TFilterData>(compressedTreeNodeProvider, options), stickyScrollDelegate });
	}

	override setChildren(element: T | null, children: Iterable<ICompressedTreeElement<T>> = Iterable.empty(), options?: IObjectTreeSetChildrenOptions<T>): void {
		this.model.setChildren(element, children, options);
	}

	protected override createModel(user: string, options: ICompressibleObjectTreeOptions<T | null, TFilterData>): ITreeModel<T | null, TFilterData, T | null> {
		return new CompressibleObjectTreeModel(user, options);
	}

	override updateOptions(optionsUpdate: ICompressibleObjectTreeOptionsUpdate<T | null> = {}): void {
		super.updateOptions(optionsUpdate);

		if (typeof optionsUpdate.compressionEnabled !== 'undefined') {
			this.model.setCompressionEnabled(optionsUpdate.compressionEnabled);
		}
	}

	getCompressedTreeNode(element: T | null = null): ITreeNode<ICompressedTreeNode<T> | null, TFilterData> {
		return this.model.getCompressedTreeNode(element);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/tree/objectTreeModel.ts]---
Location: vscode-main/src/vs/base/browser/ui/tree/objectTreeModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IIdentityProvider } from '../list/list.js';
import { IIndexTreeModelOptions, IIndexTreeModelSpliceOptions, IndexTreeModel } from './indexTreeModel.js';
import { ICollapseStateChangeEvent, IObjectTreeElement, ITreeElement, ITreeListSpliceData, ITreeModel, ITreeModelSpliceEvent, ITreeNode, ITreeSorter, ObjectTreeElementCollapseState, TreeError } from './tree.js';
import { Event } from '../../../common/event.js';
import { Iterable } from '../../../common/iterator.js';

export type ITreeNodeCallback<T, TFilterData> = (node: ITreeNode<T, TFilterData>) => void;

export interface IObjectTreeModel<T, TFilterData = void> extends ITreeModel<T | null, TFilterData, T | null> {
	setChildren(element: T | null, children: Iterable<IObjectTreeElement<T>> | undefined, options?: IObjectTreeModelSetChildrenOptions<T, TFilterData>): void;
	resort(element?: T | null, recursive?: boolean): void;
}

export interface IObjectTreeModelSetChildrenOptions<T, TFilterData> extends IIndexTreeModelSpliceOptions<T, TFilterData> {
}

export interface IObjectTreeModelOptions<T, TFilterData> extends IIndexTreeModelOptions<T, TFilterData> {
	readonly sorter?: ITreeSorter<T>;
	readonly identityProvider?: IIdentityProvider<T>;
}

export class ObjectTreeModel<T, TFilterData = void> implements IObjectTreeModel<T, TFilterData> {

	readonly rootRef = null;

	private model: IndexTreeModel<T | null, TFilterData>;
	private nodes = new Map<T | null, ITreeNode<T, TFilterData>>();
	private readonly nodesByIdentity = new Map<string, ITreeNode<T, TFilterData>>();
	private readonly identityProvider?: IIdentityProvider<T>;
	private sorter?: ITreeSorter<{ element: T }>;

	readonly onDidSpliceModel: Event<ITreeModelSpliceEvent<T | null, TFilterData>>;
	readonly onDidSpliceRenderedNodes: Event<ITreeListSpliceData<T | null, TFilterData>>;
	readonly onDidChangeCollapseState: Event<ICollapseStateChangeEvent<T, TFilterData>>;
	readonly onDidChangeRenderNodeCount: Event<ITreeNode<T, TFilterData>>;

	get size(): number { return this.nodes.size; }

	constructor(
		private user: string,
		options: IObjectTreeModelOptions<T, TFilterData> = {}
	) {
		this.model = new IndexTreeModel(user, null, options);
		this.onDidSpliceModel = this.model.onDidSpliceModel;
		this.onDidSpliceRenderedNodes = this.model.onDidSpliceRenderedNodes;
		this.onDidChangeCollapseState = this.model.onDidChangeCollapseState as Event<ICollapseStateChangeEvent<T, TFilterData>>;
		this.onDidChangeRenderNodeCount = this.model.onDidChangeRenderNodeCount as Event<ITreeNode<T, TFilterData>>;

		if (options.sorter) {
			this.sorter = {
				compare(a, b) {
					return options.sorter!.compare(a.element, b.element);
				}
			};
		}

		this.identityProvider = options.identityProvider;
	}

	setChildren(
		element: T | null,
		children: Iterable<IObjectTreeElement<T>> = Iterable.empty(),
		options: IObjectTreeModelSetChildrenOptions<T, TFilterData> = {},
	): void {
		const location = this.getElementLocation(element);
		this._setChildren(location, this.preserveCollapseState(children), options);
	}

	private _setChildren(
		location: number[],
		children: Iterable<ITreeElement<T>> = Iterable.empty(),
		options: IObjectTreeModelSetChildrenOptions<T, TFilterData>,
	): void {
		const insertedElements = new Set<T | null>();
		const insertedElementIds = new Set<string>();

		const onDidCreateNode = (node: ITreeNode<T | null, TFilterData>) => {
			if (node.element === null) {
				return;
			}

			const tnode = node as ITreeNode<T, TFilterData>;

			insertedElements.add(tnode.element);
			this.nodes.set(tnode.element, tnode);

			if (this.identityProvider) {
				const id = this.identityProvider.getId(tnode.element).toString();
				insertedElementIds.add(id);
				this.nodesByIdentity.set(id, tnode);
			}

			options.onDidCreateNode?.(tnode);
		};

		const onDidDeleteNode = (node: ITreeNode<T | null, TFilterData>) => {
			if (node.element === null) {
				return;
			}

			const tnode = node as ITreeNode<T, TFilterData>;

			if (!insertedElements.has(tnode.element)) {
				this.nodes.delete(tnode.element);
			}

			if (this.identityProvider) {
				const id = this.identityProvider.getId(tnode.element).toString();
				if (!insertedElementIds.has(id)) {
					this.nodesByIdentity.delete(id);
				}
			}

			options.onDidDeleteNode?.(tnode);
		};

		this.model.splice(
			[...location, 0],
			Number.MAX_VALUE,
			children,
			{ ...options, onDidCreateNode, onDidDeleteNode }
		);
	}

	private preserveCollapseState(elements: Iterable<IObjectTreeElement<T>> = Iterable.empty()): Iterable<ITreeElement<T>> {
		if (this.sorter) {
			elements = [...elements].sort(this.sorter.compare.bind(this.sorter));
		}

		return Iterable.map(elements, treeElement => {
			let node = this.nodes.get(treeElement.element);

			if (!node && this.identityProvider) {
				const id = this.identityProvider.getId(treeElement.element).toString();
				node = this.nodesByIdentity.get(id);
			}

			if (!node) {
				let collapsed: boolean | undefined;

				if (typeof treeElement.collapsed === 'undefined') {
					collapsed = undefined;
				} else if (treeElement.collapsed === ObjectTreeElementCollapseState.Collapsed || treeElement.collapsed === ObjectTreeElementCollapseState.PreserveOrCollapsed) {
					collapsed = true;
				} else if (treeElement.collapsed === ObjectTreeElementCollapseState.Expanded || treeElement.collapsed === ObjectTreeElementCollapseState.PreserveOrExpanded) {
					collapsed = false;
				} else {
					collapsed = Boolean(treeElement.collapsed);
				}

				return {
					...treeElement,
					children: this.preserveCollapseState(treeElement.children),
					collapsed
				};
			}

			const collapsible = typeof treeElement.collapsible === 'boolean' ? treeElement.collapsible : node.collapsible;
			let collapsed: boolean | undefined;

			if (typeof treeElement.collapsed === 'undefined' || treeElement.collapsed === ObjectTreeElementCollapseState.PreserveOrCollapsed || treeElement.collapsed === ObjectTreeElementCollapseState.PreserveOrExpanded) {
				collapsed = node.collapsed;
			} else if (treeElement.collapsed === ObjectTreeElementCollapseState.Collapsed) {
				collapsed = true;
			} else if (treeElement.collapsed === ObjectTreeElementCollapseState.Expanded) {
				collapsed = false;
			} else {
				collapsed = Boolean(treeElement.collapsed);
			}

			return {
				...treeElement,
				collapsible,
				collapsed,
				children: this.preserveCollapseState(treeElement.children)
			};
		});
	}

	rerender(element: T | null): void {
		const location = this.getElementLocation(element);
		this.model.rerender(location);
	}

	resort(element: T | null = null, recursive = true): void {
		if (!this.sorter) {
			return;
		}

		const location = this.getElementLocation(element);
		const node = this.model.getNode(location);

		this._setChildren(location, this.resortChildren(node, recursive), {});
	}

	private resortChildren(node: ITreeNode<T | null, TFilterData>, recursive: boolean, first = true): Iterable<ITreeElement<T>> {
		let childrenNodes = [...node.children] as ITreeNode<T, TFilterData>[];

		if (recursive || first) {
			childrenNodes = childrenNodes.sort(this.sorter!.compare.bind(this.sorter));
		}

		return Iterable.map<ITreeNode<T | null, TFilterData>, ITreeElement<T>>(childrenNodes, node => ({
			element: node.element as T,
			collapsible: node.collapsible,
			collapsed: node.collapsed,
			children: this.resortChildren(node, recursive, false)
		}));
	}

	getFirstElementChild(ref: T | null = null): T | null | undefined {
		const location = this.getElementLocation(ref);
		return this.model.getFirstElementChild(location);
	}

	getLastElementAncestor(ref: T | null = null): T | null | undefined {
		const location = this.getElementLocation(ref);
		return this.model.getLastElementAncestor(location);
	}

	has(element: T | null): boolean {
		return this.nodes.has(element);
	}

	getListIndex(element: T | null): number {
		const location = this.getElementLocation(element);
		return this.model.getListIndex(location);
	}

	getListRenderCount(element: T | null): number {
		const location = this.getElementLocation(element);
		return this.model.getListRenderCount(location);
	}

	isCollapsible(element: T | null): boolean {
		const location = this.getElementLocation(element);
		return this.model.isCollapsible(location);
	}

	setCollapsible(element: T | null, collapsible?: boolean): boolean {
		const location = this.getElementLocation(element);
		return this.model.setCollapsible(location, collapsible);
	}

	isCollapsed(element: T | null): boolean {
		const location = this.getElementLocation(element);
		return this.model.isCollapsed(location);
	}

	setCollapsed(element: T | null, collapsed?: boolean, recursive?: boolean): boolean {
		const location = this.getElementLocation(element);
		return this.model.setCollapsed(location, collapsed, recursive);
	}

	expandTo(element: T | null): void {
		const location = this.getElementLocation(element);
		this.model.expandTo(location);
	}

	refilter(): void {
		this.model.refilter();
	}

	getNode(element: T | null = null): ITreeNode<T | null, TFilterData> {
		if (element === null) {
			return this.model.getNode(this.model.rootRef);
		}

		const node = this.nodes.get(element);

		if (!node) {
			throw new TreeError(this.user, `Tree element not found: ${element}`);
		}

		return node;
	}

	getNodeLocation(node: ITreeNode<T, TFilterData>): T | null {
		return node.element;
	}

	getParentNodeLocation(element: T | null): T | null {
		if (element === null) {
			throw new TreeError(this.user, `Invalid getParentNodeLocation call`);
		}

		const node = this.nodes.get(element);

		if (!node) {
			throw new TreeError(this.user, `Tree element not found: ${element}`);
		}

		const location = this.model.getNodeLocation(node);
		const parentLocation = this.model.getParentNodeLocation(location);
		const parent = this.model.getNode(parentLocation);

		return parent.element;
	}

	private getElementLocation(element: T | null): number[] {
		if (element === null) {
			return [];
		}

		const node = this.nodes.get(element);

		if (!node) {
			throw new TreeError(this.user, `Tree element not found: ${element}`);
		}

		return this.model.getNodeLocation(node);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/tree/tree.ts]---
Location: vscode-main/src/vs/base/browser/ui/tree/tree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDragAndDropData } from '../../dnd.js';
import { IMouseEvent } from '../../mouseEvent.js';
import { IListDragAndDrop, IListDragOverReaction, IListElementRenderDetails, IListRenderer, ListDragOverEffectPosition, ListDragOverEffectType } from '../list/list.js';
import { ListViewTargetSector } from '../list/listView.js';
import { Event } from '../../../common/event.js';

export const enum TreeVisibility {

	/**
	 * The tree node should be hidden.
	 */
	Hidden,

	/**
	 * The tree node should be visible.
	 */
	Visible,

	/**
	 * The tree node should be visible if any of its descendants is visible.
	 */
	Recurse
}

/**
 * A composed filter result containing the visibility result as well as
 * metadata.
 */
export interface ITreeFilterDataResult<TFilterData> {

	/**
	 * Whether the node should be visible.
	 */
	visibility: boolean | TreeVisibility;

	/**
	 * Metadata about the element's visibility which gets forwarded to the
	 * renderer once the element gets rendered.
	 */
	data: TFilterData;
}

/**
 * The result of a filter call can be a boolean value indicating whether
 * the element should be visible or not, a value of type `TreeVisibility` or
 * an object composed of the visibility result as well as additional metadata
 * which gets forwarded to the renderer once the element gets rendered.
 */
export type TreeFilterResult<TFilterData> = boolean | TreeVisibility | ITreeFilterDataResult<TFilterData>;

/**
 * A tree filter is responsible for controlling the visibility of
 * elements in a tree.
 */
export interface ITreeFilter<T, TFilterData = void> {

	/**
	 * Returns whether this elements should be visible and, if affirmative,
	 * additional metadata which gets forwarded to the renderer once the element
	 * gets rendered.
	 *
	 * @param element The tree element.
	 */
	filter(element: T, parentVisibility: TreeVisibility): TreeFilterResult<TFilterData>;
}

export interface ITreeSorter<T> {
	compare(element: T, otherElement: T): number;
}

export interface ITreeElement<T> {
	readonly element: T;
	readonly children?: Iterable<ITreeElement<T>>;
	readonly collapsible?: boolean;
	readonly collapsed?: boolean;
}

export enum ObjectTreeElementCollapseState {
	Expanded,
	Collapsed,

	/**
	 * If the element is already in the tree, preserve its current state. Else, expand it.
	 */
	PreserveOrExpanded,

	/**
	 * If the element is already in the tree, preserve its current state. Else, collapse it.
	 */
	PreserveOrCollapsed,
}

export interface IObjectTreeElement<T> {
	readonly element: T;
	readonly children?: Iterable<IObjectTreeElement<T>>;
	readonly collapsible?: boolean;
	readonly collapsed?: boolean | ObjectTreeElementCollapseState;
}

export interface ITreeNode<T, TFilterData = void> {
	readonly element: T;
	readonly children: ITreeNode<T, TFilterData>[];
	readonly depth: number;
	readonly visibleChildrenCount: number;
	readonly visibleChildIndex: number;
	readonly collapsible: boolean;
	readonly collapsed: boolean;
	readonly visible: boolean;
	readonly filterData: TFilterData | undefined;
}

export interface ICollapseStateChangeEvent<T, TFilterData> {
	node: ITreeNode<T, TFilterData>;
	deep: boolean;
}

export interface ITreeListSpliceData<T, TFilterData> {
	start: number;
	deleteCount: number;
	elements: ITreeNode<T, TFilterData>[];
}

export interface ITreeModelSpliceEvent<T, TFilterData> {
	insertedNodes: ITreeNode<T, TFilterData>[];
	deletedNodes: ITreeNode<T, TFilterData>[];
}

export interface ITreeModel<T, TFilterData, TRef> {
	readonly rootRef: TRef;

	readonly onDidSpliceModel: Event<ITreeModelSpliceEvent<T, TFilterData>>;
	readonly onDidSpliceRenderedNodes: Event<ITreeListSpliceData<T, TFilterData>>;
	readonly onDidChangeCollapseState: Event<ICollapseStateChangeEvent<T, TFilterData>>;
	readonly onDidChangeRenderNodeCount: Event<ITreeNode<T, TFilterData>>;

	has(location: TRef): boolean;

	getListIndex(location: TRef): number;
	getListRenderCount(location: TRef): number;
	getNode(location?: TRef): ITreeNode<T, TFilterData>;
	getNodeLocation(node: ITreeNode<T, TFilterData>): TRef;
	getParentNodeLocation(location: TRef): TRef | undefined;

	getFirstElementChild(location: TRef): T | undefined;
	getLastElementAncestor(location?: TRef): T | undefined;

	isCollapsible(location: TRef): boolean;
	setCollapsible(location: TRef, collapsible?: boolean): boolean;
	isCollapsed(location: TRef): boolean;
	setCollapsed(location: TRef, collapsed?: boolean, recursive?: boolean): boolean;
	expandTo(location: TRef): void;

	rerender(location: TRef): void;
	refilter(): void;
}

export interface ITreeElementRenderDetails extends IListElementRenderDetails {
	readonly indent: number;
}

export interface ITreeRenderer<T, TFilterData = void, TTemplateData = void> extends IListRenderer<ITreeNode<T, TFilterData>, TTemplateData> {
	renderElement(element: ITreeNode<T, TFilterData>, index: number, templateData: TTemplateData, details?: ITreeElementRenderDetails): void;
	disposeElement?(element: ITreeNode<T, TFilterData>, index: number, templateData: TTemplateData, details?: ITreeElementRenderDetails): void;
	renderTwistie?(element: T, twistieElement: HTMLElement): boolean;
	readonly onDidChangeTwistieState?: Event<T>;
}

export interface ITreeEvent<T> {
	readonly elements: readonly T[];
	readonly browserEvent?: UIEvent;
}

export enum TreeMouseEventTarget {
	Unknown,
	Twistie,
	Element,
	Filter
}

export interface ITreeMouseEvent<T> {
	readonly browserEvent: MouseEvent;
	readonly element: T | null;
	readonly target: TreeMouseEventTarget;
}

export interface ITreeContextMenuEvent<T> {
	readonly browserEvent: UIEvent;
	readonly element: T | null;
	readonly anchor: HTMLElement | IMouseEvent;
	readonly isStickyScroll: boolean;
}

export interface ITreeNavigator<T> {
	current(): T | null;
	previous(): T | null;
	first(): T | null;
	last(): T | null;
	next(): T | null;
}

export interface IDataSource<TInput, T> {
	hasChildren?(element: TInput | T): boolean;
	getChildren(element: TInput | T): Iterable<T>;
}

export interface IAsyncDataSource<TInput, T> {
	hasChildren(element: TInput | T): boolean;
	getChildren(element: TInput | T): Iterable<T> | Promise<Iterable<T>>;
	getParent?(element: T): TInput | T;
}

export const enum TreeDragOverBubble {
	Down,
	Up
}

export interface ITreeDragOverReaction extends IListDragOverReaction {
	bubble?: TreeDragOverBubble;
	autoExpand?: boolean;
}

export const TreeDragOverReactions = {
	acceptBubbleUp(): ITreeDragOverReaction { return { accept: true, bubble: TreeDragOverBubble.Up }; },
	acceptBubbleDown(autoExpand = false): ITreeDragOverReaction { return { accept: true, bubble: TreeDragOverBubble.Down, autoExpand }; },
	acceptCopyBubbleUp(): ITreeDragOverReaction { return { accept: true, bubble: TreeDragOverBubble.Up, effect: { type: ListDragOverEffectType.Copy, position: ListDragOverEffectPosition.Over } }; },
	acceptCopyBubbleDown(autoExpand = false): ITreeDragOverReaction { return { accept: true, bubble: TreeDragOverBubble.Down, effect: { type: ListDragOverEffectType.Copy, position: ListDragOverEffectPosition.Over }, autoExpand }; }
};

export interface ITreeDragAndDrop<T> extends IListDragAndDrop<T> {
	onDragOver(data: IDragAndDropData, targetElement: T | undefined, targetIndex: number | undefined, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): boolean | ITreeDragOverReaction;
}

export class TreeError extends Error {

	constructor(user: string, message: string) {
		super(`TreeError [${user}] ${message}`);
	}
}

export class WeakMapper<K extends object, V> {

	constructor(private fn: (k: K) => V) { }

	private _map = new WeakMap<K, V>();

	map(key: K): V {
		let result = this._map.get(key);

		if (!result) {
			result = this.fn(key);
			this._map.set(key, result);
		}

		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/tree/treeDefaults.ts]---
Location: vscode-main/src/vs/base/browser/ui/tree/treeDefaults.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AsyncDataTree } from './asyncDataTree.js';
import { Action } from '../../../common/actions.js';
import * as nls from '../../../../nls.js';

export class CollapseAllAction<TInput, T, TFilterData = void> extends Action {

	constructor(private viewer: AsyncDataTree<TInput, T, TFilterData>, enabled: boolean) {
		super('vs.tree.collapse', nls.localize('collapse all', "Collapse All"), 'collapse-all', enabled);
	}

	override async run(): Promise<void> {
		this.viewer.collapseAll();
		this.viewer.setSelection([]);
		this.viewer.setFocus([]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/tree/media/paneviewlet.css]---
Location: vscode-main/src/vs/base/browser/ui/tree/media/paneviewlet.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-pane-view .pane > .pane-header h3.title {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	font-size: 11px;
	margin: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/tree/media/tree.css]---
Location: vscode-main/src/vs/base/browser/ui/tree/media/tree.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-tl-row {
	display: flex;
	height: 100%;
	align-items: center;
	position: relative;
}

.monaco-tl-row.disabled {
	cursor: default;
}
.monaco-tl-indent {
	height: 100%;
	position: absolute;
	top: 0;
	left: 16px;
	pointer-events: none;
}

.hide-arrows .monaco-tl-indent {
	left: 12px;
}

.monaco-tl-indent > .indent-guide {
	display: inline-block;
	box-sizing: border-box;
	height: 100%;
	border-left: 1px solid transparent;
	opacity: 0;
}

.monaco-enable-motion .monaco-tl-indent > .indent-guide {
	transition: opacity 0.1s linear;
}

.monaco-tl-twistie,
.monaco-tl-contents {
	height: 100%;
}

.monaco-tl-twistie {
	font-size: 10px;
	text-align: right;
	padding-right: 6px;
	flex-shrink: 0;
	width: 16px;
	display: flex !important;
	align-items: center;
	justify-content: center;
	transform: translateX(3px);
}

.monaco-tl-contents {
	flex: 1;
	overflow: hidden;
}

.monaco-tl-twistie::before {
	border-radius: 20px;
}

.monaco-tl-twistie.collapsed::before {
	transform: rotate(-90deg);
}

.monaco-tl-twistie.codicon-tree-item-loading::before {
	/* Use steps to throttle FPS to reduce CPU usage */
	animation: codicon-spin 1.25s steps(30) infinite;
}

.monaco-tree-type-filter {
	position: absolute;
	top: 0;
	right: 0;
	display: flex;
	padding: 3px;
	max-width: 200px;
	z-index: 100;
	margin: 0 10px 0 6px;
	border: 1px solid var(--vscode-widget-border);
	border-bottom-left-radius: 4px;
	border-bottom-right-radius: 4px;
}

.monaco-enable-motion .monaco-tree-type-filter {
	transition: top 0.3s;
}

.monaco-tree-type-filter.disabled {
	top: -40px !important;
}

.monaco-tree-type-filter-input {
	flex: 1;
}

.monaco-tree-type-filter-input .monaco-inputbox {
	height: 23px;
}

.monaco-tree-type-filter-input .monaco-inputbox > .ibwrapper > .input,
.monaco-tree-type-filter-input .monaco-inputbox > .ibwrapper > .mirror {
	padding: 2px 4px;
}

.monaco-tree-type-filter-input .monaco-findInput > .controls {
	top: 2px;
}

.monaco-tree-type-filter-actionbar {
	margin-left: 4px;
}

.monaco-tree-type-filter-actionbar .monaco-action-bar .action-label {
	padding: 2px;
}

.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 0;
	z-index: 13; /* Settings editor uses z-index: 12 */

	/* Backup color in case the tree does not provide the background color */
	background-color: var(--vscode-sideBar-background);
}

.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container .monaco-tree-sticky-row.monaco-list-row{
	position: absolute;
	width: 100%;
	opacity: 1 !important; /* Settings editor uses opacity < 1 */
	overflow: hidden;

	/* Backup color in case the tree does not provide the background color */
	background-color: var(--vscode-sideBar-background);
}

.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container .monaco-tree-sticky-row:hover{
	background-color: var(--vscode-list-hoverBackground) !important;
	cursor: pointer;
}

.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container.empty,
.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container.empty .monaco-tree-sticky-container-shadow {
	display: none;
}

.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container .monaco-tree-sticky-container-shadow {
	position: absolute;
	bottom: -3px;
	left: 0px;
	height: 0px; /* heigt is 3px and only set when there is a treeStickyScrollShadow color */
	width: 100%;
}

.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container[tabindex="0"]:focus{
	outline: none;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/actions.ts]---
Location: vscode-main/src/vs/base/common/actions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from './event.js';
import { Disposable, IDisposable } from './lifecycle.js';
import * as nls from '../../nls.js';

export interface ITelemetryData {
	readonly from?: string;
	readonly target?: string;
	[key: string]: unknown;
}

export type WorkbenchActionExecutedClassification = {
	id: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The identifier of the action that was run.' };
	from: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The name of the component the action was run from.' };
	detail?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Optional details about how the action was run, e.g which keybinding was used.' };
	owner: 'isidorn';
	comment: 'Provides insight into actions that are executed within the workbench.';
};

export type WorkbenchActionExecutedEvent = {
	id: string;
	from: string;
	detail?: string;
};

export interface IAction {
	readonly id: string;
	label: string;
	tooltip: string;
	class: string | undefined;
	enabled: boolean;
	checked?: boolean;
	run(...args: unknown[]): unknown;
}

export interface IActionRunner extends IDisposable {
	readonly onDidRun: Event<IRunEvent>;
	readonly onWillRun: Event<IRunEvent>;

	run(action: IAction, context?: unknown): unknown;
}

export interface IActionChangeEvent {
	readonly label?: string;
	readonly tooltip?: string;
	readonly class?: string;
	readonly enabled?: boolean;
	readonly checked?: boolean;
}

/**
 * A concrete implementation of {@link IAction}.
 *
 * Note that in most cases you should use the lighter-weight {@linkcode toAction} function instead.
 */
export class Action extends Disposable implements IAction {

	protected _onDidChange = this._register(new Emitter<IActionChangeEvent>());
	get onDidChange() { return this._onDidChange.event; }

	protected readonly _id: string;
	protected _label: string;
	protected _tooltip: string | undefined;
	protected _cssClass: string | undefined;
	protected _enabled: boolean = true;
	protected _checked?: boolean;
	protected readonly _actionCallback?: (event?: unknown) => unknown;

	constructor(id: string, label: string = '', cssClass: string = '', enabled: boolean = true, actionCallback?: (event?: unknown) => unknown) {
		super();
		this._id = id;
		this._label = label;
		this._cssClass = cssClass;
		this._enabled = enabled;
		this._actionCallback = actionCallback;
	}

	get id(): string {
		return this._id;
	}

	get label(): string {
		return this._label;
	}

	set label(value: string) {
		this._setLabel(value);
	}

	private _setLabel(value: string): void {
		if (this._label !== value) {
			this._label = value;
			this._onDidChange.fire({ label: value });
		}
	}

	get tooltip(): string {
		return this._tooltip || '';
	}

	set tooltip(value: string) {
		this._setTooltip(value);
	}

	protected _setTooltip(value: string): void {
		if (this._tooltip !== value) {
			this._tooltip = value;
			this._onDidChange.fire({ tooltip: value });
		}
	}

	get class(): string | undefined {
		return this._cssClass;
	}

	set class(value: string | undefined) {
		this._setClass(value);
	}

	protected _setClass(value: string | undefined): void {
		if (this._cssClass !== value) {
			this._cssClass = value;
			this._onDidChange.fire({ class: value });
		}
	}

	get enabled(): boolean {
		return this._enabled;
	}

	set enabled(value: boolean) {
		this._setEnabled(value);
	}

	protected _setEnabled(value: boolean): void {
		if (this._enabled !== value) {
			this._enabled = value;
			this._onDidChange.fire({ enabled: value });
		}
	}

	get checked(): boolean | undefined {
		return this._checked;
	}

	set checked(value: boolean | undefined) {
		this._setChecked(value);
	}

	protected _setChecked(value: boolean | undefined): void {
		if (this._checked !== value) {
			this._checked = value;
			this._onDidChange.fire({ checked: value });
		}
	}

	async run(event?: unknown, data?: ITelemetryData): Promise<void> {
		if (this._actionCallback) {
			await this._actionCallback(event);
		}
	}
}

export interface IRunEvent {
	readonly action: IAction;
	readonly error?: Error;
}

export class ActionRunner extends Disposable implements IActionRunner {

	private readonly _onWillRun = this._register(new Emitter<IRunEvent>());
	get onWillRun() { return this._onWillRun.event; }

	private readonly _onDidRun = this._register(new Emitter<IRunEvent>());
	get onDidRun() { return this._onDidRun.event; }

	async run(action: IAction, context?: unknown): Promise<void> {
		if (!action.enabled) {
			return;
		}

		this._onWillRun.fire({ action });

		let error: Error | undefined = undefined;
		try {
			await this.runAction(action, context);
		} catch (e) {
			error = e;
		}

		this._onDidRun.fire({ action, error });
	}

	protected async runAction(action: IAction, context?: unknown): Promise<void> {
		await action.run(context);
	}
}

export class Separator implements IAction {

	/**
	 * Joins all non-empty lists of actions with separators.
	 */
	public static join(...actionLists: readonly IAction[][]) {
		let out: IAction[] = [];
		for (const list of actionLists) {
			if (!list.length) {
				// skip
			} else if (out.length) {
				out = [...out, new Separator(), ...list];
			} else {
				out = list;
			}
		}

		return out;
	}

	static readonly ID = 'vs.actions.separator';

	readonly id: string = Separator.ID;

	readonly label: string = '';
	readonly tooltip: string = '';
	readonly class: string = 'separator';
	readonly enabled: boolean = false;
	readonly checked: boolean = false;
	async run() { }
}

export class SubmenuAction implements IAction {

	readonly id: string;
	readonly label: string;
	readonly class: string | undefined;
	readonly tooltip: string = '';
	readonly enabled: boolean = true;
	readonly checked: undefined = undefined;

	private readonly _actions: readonly IAction[];
	get actions(): readonly IAction[] { return this._actions; }

	constructor(id: string, label: string, actions: readonly IAction[], cssClass?: string) {
		this.id = id;
		this.label = label;
		this.class = cssClass;
		this._actions = actions;
	}

	async run(): Promise<void> { }
}

export class EmptySubmenuAction extends Action {

	static readonly ID = 'vs.actions.empty';

	constructor() {
		super(EmptySubmenuAction.ID, nls.localize('submenu.empty', '(empty)'), undefined, false);
	}
}

export function toAction(props: { id: string; label: string; tooltip?: string; enabled?: boolean; checked?: boolean; class?: string; run: Function }): IAction {
	return {
		id: props.id,
		label: props.label,
		tooltip: props.tooltip ?? props.label,
		class: props.class,
		enabled: props.enabled ?? true,
		checked: props.checked,
		run: async (...args: unknown[]) => props.run(...args),
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/arrays.ts]---
Location: vscode-main/src/vs/base/common/arrays.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { findFirstIdxMonotonousOrArrLen } from './arraysFind.js';
import { CancellationToken } from './cancellation.js';
import { CancellationError } from './errors.js';
import { ISplice } from './sequence.js';

/**
 * Returns the last entry and the initial N-1 entries of the array, as a tuple of [rest, last].
 *
 * The array must have at least one element.
 *
 * @param arr The input array
 * @returns A tuple of [rest, last] where rest is all but the last element and last is the last element
 * @throws Error if the array is empty
 */
export function tail<T>(arr: T[]): [T[], T] {
	if (arr.length === 0) {
		throw new Error('Invalid tail call');
	}

	return [arr.slice(0, arr.length - 1), arr[arr.length - 1]];
}

export function equals<T>(one: ReadonlyArray<T> | undefined, other: ReadonlyArray<T> | undefined, itemEquals: (a: T, b: T) => boolean = (a, b) => a === b): boolean {
	if (one === other) {
		return true;
	}

	if (!one || !other) {
		return false;
	}

	if (one.length !== other.length) {
		return false;
	}

	for (let i = 0, len = one.length; i < len; i++) {
		if (!itemEquals(one[i], other[i])) {
			return false;
		}
	}

	return true;
}

/**
 * Remove the element at `index` by replacing it with the last element. This is faster than `splice`
 * but changes the order of the array
 */
export function removeFastWithoutKeepingOrder<T>(array: T[], index: number) {
	const last = array.length - 1;
	if (index < last) {
		array[index] = array[last];
	}
	array.pop();
}

/**
 * Performs a binary search algorithm over a sorted array.
 *
 * @param array The array being searched.
 * @param key The value we search for.
 * @param comparator A function that takes two array elements and returns zero
 *   if they are equal, a negative number if the first element precedes the
 *   second one in the sorting order, or a positive number if the second element
 *   precedes the first one.
 * @return See {@link binarySearch2}
 */
export function binarySearch<T>(array: ReadonlyArray<T>, key: T, comparator: (op1: T, op2: T) => number): number {
	return binarySearch2(array.length, i => comparator(array[i], key));
}

/**
 * Performs a binary search algorithm over a sorted collection. Useful for cases
 * when we need to perform a binary search over something that isn't actually an
 * array, and converting data to an array would defeat the use of binary search
 * in the first place.
 *
 * @param length The collection length.
 * @param compareToKey A function that takes an index of an element in the
 *   collection and returns zero if the value at this index is equal to the
 *   search key, a negative number if the value precedes the search key in the
 *   sorting order, or a positive number if the search key precedes the value.
 * @return A non-negative index of an element, if found. If not found, the
 *   result is -(n+1) (or ~n, using bitwise notation), where n is the index
 *   where the key should be inserted to maintain the sorting order.
 */
export function binarySearch2(length: number, compareToKey: (index: number) => number): number {
	let low = 0,
		high = length - 1;

	while (low <= high) {
		const mid = ((low + high) / 2) | 0;
		const comp = compareToKey(mid);
		if (comp < 0) {
			low = mid + 1;
		} else if (comp > 0) {
			high = mid - 1;
		} else {
			return mid;
		}
	}
	return -(low + 1);
}

type Compare<T> = (a: T, b: T) => number;

/**
 * Finds the nth smallest element in the array using quickselect algorithm.
 * The data does not need to be sorted.
 *
 * @param nth The zero-based index of the element to find (0 = smallest, 1 = second smallest, etc.)
 * @param data The unsorted array
 * @param compare A comparator function that defines the sort order
 * @returns The nth smallest element
 * @throws TypeError if nth is >= data.length
 */
export function quickSelect<T>(nth: number, data: T[], compare: Compare<T>): T {

	nth = nth | 0;

	if (nth >= data.length) {
		throw new TypeError('invalid index');
	}

	const pivotValue = data[Math.floor(data.length * Math.random())];
	const lower: T[] = [];
	const higher: T[] = [];
	const pivots: T[] = [];

	for (const value of data) {
		const val = compare(value, pivotValue);
		if (val < 0) {
			lower.push(value);
		} else if (val > 0) {
			higher.push(value);
		} else {
			pivots.push(value);
		}
	}

	if (nth < lower.length) {
		return quickSelect(nth, lower, compare);
	} else if (nth < lower.length + pivots.length) {
		return pivots[0];
	} else {
		return quickSelect(nth - (lower.length + pivots.length), higher, compare);
	}
}

export function groupBy<T>(data: ReadonlyArray<T>, compare: (a: T, b: T) => number): T[][] {
	const result: T[][] = [];
	let currentGroup: T[] | undefined = undefined;
	for (const element of data.slice(0).sort(compare)) {
		if (!currentGroup || compare(currentGroup[0], element) !== 0) {
			currentGroup = [element];
			result.push(currentGroup);
		} else {
			currentGroup.push(element);
		}
	}
	return result;
}

/**
 * Splits the given items into a list of (non-empty) groups.
 * `shouldBeGrouped` is used to decide if two consecutive items should be in the same group.
 * The order of the items is preserved.
 */
export function* groupAdjacentBy<T>(items: Iterable<T>, shouldBeGrouped: (item1: T, item2: T) => boolean): Iterable<T[]> {
	let currentGroup: T[] | undefined;
	let last: T | undefined;
	for (const item of items) {
		if (last !== undefined && shouldBeGrouped(last, item)) {
			currentGroup!.push(item);
		} else {
			if (currentGroup) {
				yield currentGroup;
			}
			currentGroup = [item];
		}
		last = item;
	}
	if (currentGroup) {
		yield currentGroup;
	}
}

export function forEachAdjacent<T>(arr: T[], f: (item1: T | undefined, item2: T | undefined) => void): void {
	for (let i = 0; i <= arr.length; i++) {
		f(i === 0 ? undefined : arr[i - 1], i === arr.length ? undefined : arr[i]);
	}
}

export function forEachWithNeighbors<T>(arr: T[], f: (before: T | undefined, element: T, after: T | undefined) => void): void {
	for (let i = 0; i < arr.length; i++) {
		f(i === 0 ? undefined : arr[i - 1], arr[i], i + 1 === arr.length ? undefined : arr[i + 1]);
	}
}

export function concatArrays<T extends any[]>(...arrays: T): T[number][number][] {
	return [].concat(...arrays);
}

interface IMutableSplice<T> extends ISplice<T> {
	readonly toInsert: T[];
	deleteCount: number;
}

/**
 * Diffs two *sorted* arrays and computes the splices which apply the diff.
 */
export function sortedDiff<T>(before: ReadonlyArray<T>, after: ReadonlyArray<T>, compare: (a: T, b: T) => number): ISplice<T>[] {
	const result: IMutableSplice<T>[] = [];

	function pushSplice(start: number, deleteCount: number, toInsert: T[]): void {
		if (deleteCount === 0 && toInsert.length === 0) {
			return;
		}

		const latest = result[result.length - 1];

		if (latest && latest.start + latest.deleteCount === start) {
			latest.deleteCount += deleteCount;
			latest.toInsert.push(...toInsert);
		} else {
			result.push({ start, deleteCount, toInsert });
		}
	}

	let beforeIdx = 0;
	let afterIdx = 0;

	while (true) {
		if (beforeIdx === before.length) {
			pushSplice(beforeIdx, 0, after.slice(afterIdx));
			break;
		}
		if (afterIdx === after.length) {
			pushSplice(beforeIdx, before.length - beforeIdx, []);
			break;
		}

		const beforeElement = before[beforeIdx];
		const afterElement = after[afterIdx];
		const n = compare(beforeElement, afterElement);
		if (n === 0) {
			// equal
			beforeIdx += 1;
			afterIdx += 1;
		} else if (n < 0) {
			// beforeElement is smaller -> before element removed
			pushSplice(beforeIdx, 1, []);
			beforeIdx += 1;
		} else if (n > 0) {
			// beforeElement is greater -> after element added
			pushSplice(beforeIdx, 0, [afterElement]);
			afterIdx += 1;
		}
	}

	return result;
}

/**
 * Takes two *sorted* arrays and computes their delta (removed, added elements).
 * Finishes in `Math.min(before.length, after.length)` steps.
 */
export function delta<T>(before: ReadonlyArray<T>, after: ReadonlyArray<T>, compare: (a: T, b: T) => number): { removed: T[]; added: T[] } {
	const splices = sortedDiff(before, after, compare);
	const removed: T[] = [];
	const added: T[] = [];

	for (const splice of splices) {
		removed.push(...before.slice(splice.start, splice.start + splice.deleteCount));
		added.push(...splice.toInsert);
	}

	return { removed, added };
}

/**
 * Returns the top N elements from the array.
 *
 * Faster than sorting the entire array when the array is a lot larger than N.
 *
 * @param array The unsorted array.
 * @param compare A sort function for the elements.
 * @param n The number of elements to return.
 * @return The first n elements from array when sorted with compare.
 */
export function top<T>(array: ReadonlyArray<T>, compare: (a: T, b: T) => number, n: number): T[] {
	if (n === 0) {
		return [];
	}
	const result = array.slice(0, n).sort(compare);
	topStep(array, compare, result, n, array.length);
	return result;
}

/**
 * Asynchronous variant of `top()` allowing for splitting up work in batches between which the event loop can run.
 *
 * Returns the top N elements from the array.
 *
 * Faster than sorting the entire array when the array is a lot larger than N.
 *
 * @param array The unsorted array.
 * @param compare A sort function for the elements.
 * @param n The number of elements to return.
 * @param batch The number of elements to examine before yielding to the event loop.
 * @return The first n elements from array when sorted with compare.
 */
export function topAsync<T>(array: T[], compare: (a: T, b: T) => number, n: number, batch: number, token?: CancellationToken): Promise<T[]> {
	if (n === 0) {
		return Promise.resolve([]);
	}

	return new Promise((resolve, reject) => {
		(async () => {
			const o = array.length;
			const result = array.slice(0, n).sort(compare);
			for (let i = n, m = Math.min(n + batch, o); i < o; i = m, m = Math.min(m + batch, o)) {
				if (i > n) {
					await new Promise(resolve => setTimeout(resolve)); // any other delay function would starve I/O
				}
				if (token && token.isCancellationRequested) {
					throw new CancellationError();
				}
				topStep(array, compare, result, i, m);
			}
			return result;
		})()
			.then(resolve, reject);
	});
}

function topStep<T>(array: ReadonlyArray<T>, compare: (a: T, b: T) => number, result: T[], i: number, m: number): void {
	for (const n = result.length; i < m; i++) {
		const element = array[i];
		if (compare(element, result[n - 1]) < 0) {
			result.pop();
			const j = findFirstIdxMonotonousOrArrLen(result, e => compare(element, e) < 0);
			result.splice(j, 0, element);
		}
	}
}

/**
 * @returns New array with all falsy values removed. The original array IS NOT modified.
 */
export function coalesce<T>(array: ReadonlyArray<T | undefined | null>): T[] {
	return array.filter((e): e is T => !!e);
}

/**
 * Remove all falsy values from `array`. The original array IS modified.
 */
export function coalesceInPlace<T>(array: Array<T | undefined | null>): asserts array is Array<T> {
	let to = 0;
	for (let i = 0; i < array.length; i++) {
		if (!!array[i]) {
			array[to] = array[i];
			to += 1;
		}
	}
	array.length = to;
}

/**
 * @deprecated Use `Array.copyWithin` instead
 */
export function move(array: unknown[], from: number, to: number): void {
	array.splice(to, 0, array.splice(from, 1)[0]);
}

/**
 * @returns false if the provided object is an array and not empty.
 */
export function isFalsyOrEmpty(obj: unknown): boolean {
	return !Array.isArray(obj) || obj.length === 0;
}

/**
 * @returns True if the provided object is an array and has at least one element.
 */
export function isNonEmptyArray<T>(obj: T[] | undefined | null): obj is T[];
export function isNonEmptyArray<T>(obj: readonly T[] | undefined | null): obj is readonly T[];
export function isNonEmptyArray<T>(obj: T[] | readonly T[] | undefined | null): obj is T[] | readonly T[] {
	return Array.isArray(obj) && obj.length > 0;
}

/**
 * Removes duplicates from the given array. The optional keyFn allows to specify
 * how elements are checked for equality by returning an alternate value for each.
 */
export function distinct<T>(array: ReadonlyArray<T>, keyFn: (value: T) => unknown = value => value): T[] {
	const seen = new Set<any>();

	return array.filter(element => {
		const key = keyFn(element);
		if (seen.has(key)) {
			return false;
		}
		seen.add(key);
		return true;
	});
}

export function uniqueFilter<T, R>(keyFn: (t: T) => R): (t: T) => boolean {
	const seen = new Set<R>();

	return element => {
		const key = keyFn(element);

		if (seen.has(key)) {
			return false;
		}

		seen.add(key);
		return true;
	};
}

export function commonPrefixLength<T>(one: ReadonlyArray<T>, other: ReadonlyArray<T>, equals: (a: T, b: T) => boolean = (a, b) => a === b): number {
	let result = 0;

	for (let i = 0, len = Math.min(one.length, other.length); i < len && equals(one[i], other[i]); i++) {
		result++;
	}

	return result;
}

export function range(to: number): number[];
export function range(from: number, to: number): number[];
export function range(arg: number, to?: number): number[] {
	let from = typeof to === 'number' ? arg : 0;

	if (typeof to === 'number') {
		from = arg;
	} else {
		from = 0;
		to = arg;
	}

	const result: number[] = [];

	if (from <= to) {
		for (let i = from; i < to; i++) {
			result.push(i);
		}
	} else {
		for (let i = from; i > to; i--) {
			result.push(i);
		}
	}

	return result;
}

export function index<T>(array: ReadonlyArray<T>, indexer: (t: T) => string): { [key: string]: T };
export function index<T, R>(array: ReadonlyArray<T>, indexer: (t: T) => string, mapper: (t: T) => R): { [key: string]: R };
export function index<T, R>(array: ReadonlyArray<T>, indexer: (t: T) => string, mapper?: (t: T) => R): { [key: string]: R } {
	return array.reduce((r, t) => {
		r[indexer(t)] = mapper ? mapper(t) : t;
		return r;
	}, Object.create(null));
}

/**
 * Inserts an element into an array. Returns a function which, when
 * called, will remove that element from the array.
 *
 * @deprecated In almost all cases, use a `Set<T>` instead.
 */
export function insert<T>(array: T[], element: T): () => void {
	array.push(element);

	return () => remove(array, element);
}

/**
 * Removes an element from an array if it can be found.
 *
 * @deprecated In almost all cases, use a `Set<T>` instead.
 */
export function remove<T>(array: T[], element: T): T | undefined {
	const index = array.indexOf(element);
	if (index > -1) {
		array.splice(index, 1);

		return element;
	}

	return undefined;
}

/**
 * Insert `insertArr` inside `target` at `insertIndex`.
 * Please don't touch unless you understand https://jsperf.com/inserting-an-array-within-an-array
 */
export function arrayInsert<T>(target: T[], insertIndex: number, insertArr: T[]): T[] {
	const before = target.slice(0, insertIndex);
	const after = target.slice(insertIndex);
	return before.concat(insertArr, after);
}

/**
 * Uses Fisher-Yates shuffle to shuffle the given array
 */
export function shuffle<T>(array: T[], _seed?: number): void {
	let rand: () => number;

	if (typeof _seed === 'number') {
		let seed = _seed;
		// Seeded random number generator in JS. Modified from:
		// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
		rand = () => {
			const x = Math.sin(seed++) * 179426549; // throw away most significant digits and reduce any potential bias
			return x - Math.floor(x);
		};
	} else {
		rand = Math.random;
	}

	for (let i = array.length - 1; i > 0; i -= 1) {
		const j = Math.floor(rand() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

/**
 * Pushes an element to the start of the array, if found.
 */
export function pushToStart<T>(arr: T[], value: T): void {
	const index = arr.indexOf(value);

	if (index > -1) {
		arr.splice(index, 1);
		arr.unshift(value);
	}
}

/**
 * Pushes an element to the end of the array, if found.
 */
export function pushToEnd<T>(arr: T[], value: T): void {
	const index = arr.indexOf(value);

	if (index > -1) {
		arr.splice(index, 1);
		arr.push(value);
	}
}

export function pushMany<T>(arr: T[], items: ReadonlyArray<T>): void {
	for (const item of items) {
		arr.push(item);
	}
}

export function mapArrayOrNot<T, U>(items: T | T[], fn: (_: T) => U): U | U[] {
	return Array.isArray(items) ?
		items.map(fn) :
		fn(items);
}

export function mapFilter<T, U>(array: ReadonlyArray<T>, fn: (t: T) => U | undefined): U[] {
	const result: U[] = [];
	for (const item of array) {
		const mapped = fn(item);
		if (mapped !== undefined) {
			result.push(mapped);
		}
	}
	return result;
}

export function withoutDuplicates<T>(array: ReadonlyArray<T>): T[] {
	const s = new Set(array);
	return Array.from(s);
}

export function asArray<T>(x: T | T[]): T[];
export function asArray<T>(x: T | readonly T[]): readonly T[];
export function asArray<T>(x: T | T[]): T[] {
	return Array.isArray(x) ? x : [x];
}

export function getRandomElement<T>(arr: T[]): T | undefined {
	return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Insert the new items in the array.
 * @param array The original array.
 * @param start The zero-based location in the array from which to start inserting elements.
 * @param newItems The items to be inserted
 */
export function insertInto<T>(array: T[], start: number, newItems: T[]): void {
	const startIdx = getActualStartIndex(array, start);
	const originalLength = array.length;
	const newItemsLength = newItems.length;
	array.length = originalLength + newItemsLength;
	// Move the items after the start index, start from the end so that we don't overwrite any value.
	for (let i = originalLength - 1; i >= startIdx; i--) {
		array[i + newItemsLength] = array[i];
	}

	for (let i = 0; i < newItemsLength; i++) {
		array[i + startIdx] = newItems[i];
	}
}

/**
 * Removes elements from an array and inserts new elements in their place, returning the deleted elements. Alternative to the native Array.splice method, it
 * can only support limited number of items due to the maximum call stack size limit.
 * @param array The original array.
 * @param start The zero-based location in the array from which to start removing elements.
 * @param deleteCount The number of elements to remove.
 * @returns An array containing the elements that were deleted.
 */
export function splice<T>(array: T[], start: number, deleteCount: number, newItems: T[]): T[] {
	const index = getActualStartIndex(array, start);
	let result = array.splice(index, deleteCount);
	if (result === undefined) {
		// see https://bugs.webkit.org/show_bug.cgi?id=261140
		result = [];
	}
	insertInto(array, index, newItems);
	return result;
}

/**
 * Determine the actual start index (same logic as the native splice() or slice())
 * If greater than the length of the array, start will be set to the length of the array. In this case, no element will be deleted but the method will behave as an adding function, adding as many element as item[n*] provided.
 * If negative, it will begin that many elements from the end of the array. (In this case, the origin -1, meaning -n is the index of the nth last element, and is therefore equivalent to the index of array.length - n.) If array.length + start is less than 0, it will begin from index 0.
 * @param array The target array.
 * @param start The operation index.
 */
function getActualStartIndex<T>(array: T[], start: number): number {
	return start < 0 ? Math.max(start + array.length, 0) : Math.min(start, array.length);
}



/**
 * When comparing two values,
 * a negative number indicates that the first value is less than the second,
 * a positive number indicates that the first value is greater than the second,
 * and zero indicates that neither is the case.
*/
export type CompareResult = number;

export namespace CompareResult {
	export function isLessThan(result: CompareResult): boolean {
		return result < 0;
	}

	export function isLessThanOrEqual(result: CompareResult): boolean {
		return result <= 0;
	}

	export function isGreaterThan(result: CompareResult): boolean {
		return result > 0;
	}

	export function isNeitherLessOrGreaterThan(result: CompareResult): boolean {
		return result === 0;
	}

	export const greaterThan = 1;
	export const lessThan = -1;
	export const neitherLessOrGreaterThan = 0;
}

/**
 * A comparator `c` defines a total order `<=` on `T` as following:
 * `c(a, b) <= 0` iff `a` <= `b`.
 * We also have `c(a, b) == 0` iff `c(b, a) == 0`.
*/
export type Comparator<T> = (a: T, b: T) => CompareResult;

export function compareBy<TItem, TCompareBy>(selector: (item: TItem) => TCompareBy, comparator: Comparator<TCompareBy>): Comparator<TItem> {
	return (a, b) => comparator(selector(a), selector(b));
}

export function tieBreakComparators<TItem>(...comparators: Comparator<TItem>[]): Comparator<TItem> {
	return (item1, item2) => {
		for (const comparator of comparators) {
			const result = comparator(item1, item2);
			if (!CompareResult.isNeitherLessOrGreaterThan(result)) {
				return result;
			}
		}
		return CompareResult.neitherLessOrGreaterThan;
	};
}

/**
 * The natural order on numbers.
*/
export const numberComparator: Comparator<number> = (a, b) => a - b;

export const booleanComparator: Comparator<boolean> = (a, b) => numberComparator(a ? 1 : 0, b ? 1 : 0);

export function reverseOrder<TItem>(comparator: Comparator<TItem>): Comparator<TItem> {
	return (a, b) => -comparator(a, b);
}

/**
 * Returns a new comparator that treats `undefined` as the smallest value.
 * All other values are compared using the given comparator.
*/
export function compareUndefinedSmallest<T>(comparator: Comparator<T>): Comparator<T | undefined> {
	return (a, b) => {
		if (a === undefined) {
			return b === undefined ? CompareResult.neitherLessOrGreaterThan : CompareResult.lessThan;
		} else if (b === undefined) {
			return CompareResult.greaterThan;
		}

		return comparator(a, b);
	};
}

export class ArrayQueue<T> {
	private readonly items: readonly T[];
	private firstIdx = 0;
	private lastIdx: number;

	/**
	 * Constructs a queue that is backed by the given array. Runtime is O(1).
	*/
	constructor(items: readonly T[]) {
		this.items = items;
		this.lastIdx = this.items.length - 1;
	}

	get length(): number {
		return this.lastIdx - this.firstIdx + 1;
	}

	/**
	 * Consumes elements from the beginning of the queue as long as the predicate returns true.
	 * If no elements were consumed, `null` is returned. Has a runtime of O(result.length).
	*/
	takeWhile(predicate: (value: T) => boolean): T[] | null {
		// P(k) := k <= this.lastIdx && predicate(this.items[k])
		// Find s := min { k | k >= this.firstIdx && !P(k) } and return this.data[this.firstIdx...s)

		let startIdx = this.firstIdx;
		while (startIdx < this.items.length && predicate(this.items[startIdx])) {
			startIdx++;
		}
		const result = startIdx === this.firstIdx ? null : this.items.slice(this.firstIdx, startIdx);
		this.firstIdx = startIdx;
		return result;
	}

	/**
	 * Consumes elements from the end of the queue as long as the predicate returns true.
	 * If no elements were consumed, `null` is returned.
	 * The result has the same order as the underlying array!
	*/
	takeFromEndWhile(predicate: (value: T) => boolean): T[] | null {
		// P(k) := this.firstIdx >= k && predicate(this.items[k])
		// Find s := max { k | k <= this.lastIdx && !P(k) } and return this.data(s...this.lastIdx]

		let endIdx = this.lastIdx;
		while (endIdx >= 0 && predicate(this.items[endIdx])) {
			endIdx--;
		}
		const result = endIdx === this.lastIdx ? null : this.items.slice(endIdx + 1, this.lastIdx + 1);
		this.lastIdx = endIdx;
		return result;
	}

	peek(): T | undefined {
		if (this.length === 0) {
			return undefined;
		}
		return this.items[this.firstIdx];
	}

	peekLast(): T | undefined {
		if (this.length === 0) {
			return undefined;
		}
		return this.items[this.lastIdx];
	}

	dequeue(): T | undefined {
		const result = this.items[this.firstIdx];
		this.firstIdx++;
		return result;
	}

	removeLast(): T | undefined {
		const result = this.items[this.lastIdx];
		this.lastIdx--;
		return result;
	}

	takeCount(count: number): T[] {
		const result = this.items.slice(this.firstIdx, this.firstIdx + count);
		this.firstIdx += count;
		return result;
	}
}

/**
 * This class is faster than an iterator and array for lazy computed data.
*/
export class CallbackIterable<T> {
	public static readonly empty = new CallbackIterable<never>(_callback => { });

	constructor(
		/**
		 * Calls the callback for every item.
		 * Stops when the callback returns false.
		*/
		public readonly iterate: (callback: (item: T) => boolean) => void
	) {
	}

	forEach(handler: (item: T) => void) {
		this.iterate(item => { handler(item); return true; });
	}

	toArray(): T[] {
		const result: T[] = [];
		this.iterate(item => { result.push(item); return true; });
		return result;
	}

	filter(predicate: (item: T) => boolean): CallbackIterable<T> {
		return new CallbackIterable(cb => this.iterate(item => predicate(item) ? cb(item) : true));
	}

	map<TResult>(mapFn: (item: T) => TResult): CallbackIterable<TResult> {
		return new CallbackIterable<TResult>(cb => this.iterate(item => cb(mapFn(item))));
	}

	some(predicate: (item: T) => boolean): boolean {
		let result = false;
		this.iterate(item => { result = predicate(item); return !result; });
		return result;
	}

	findFirst(predicate: (item: T) => boolean): T | undefined {
		let result: T | undefined;
		this.iterate(item => {
			if (predicate(item)) {
				result = item;
				return false;
			}
			return true;
		});
		return result;
	}

	findLast(predicate: (item: T) => boolean): T | undefined {
		let result: T | undefined;
		this.iterate(item => {
			if (predicate(item)) {
				result = item;
			}
			return true;
		});
		return result;
	}

	findLastMaxBy(comparator: Comparator<T>): T | undefined {
		let result: T | undefined;
		let first = true;
		this.iterate(item => {
			if (first || CompareResult.isGreaterThan(comparator(item, result!))) {
				first = false;
				result = item;
			}
			return true;
		});
		return result;
	}
}

/**
 * Represents a re-arrangement of items in an array.
 */
export class Permutation {
	constructor(private readonly _indexMap: readonly number[]) { }

	/**
	 * Returns a permutation that sorts the given array according to the given compare function.
	 */
	public static createSortPermutation<T>(arr: readonly T[], compareFn: (a: T, b: T) => number): Permutation {
		const sortIndices = Array.from(arr.keys()).sort((index1, index2) => compareFn(arr[index1], arr[index2]));
		return new Permutation(sortIndices);
	}

	/**
	 * Returns a new array with the elements of the given array re-arranged according to this permutation.
	 */
	apply<T>(arr: readonly T[]): T[] {
		return arr.map((_, index) => arr[this._indexMap[index]]);
	}

	/**
	 * Returns a new permutation that undoes the re-arrangement of this permutation.
	*/
	inverse(): Permutation {
		const inverseIndexMap = this._indexMap.slice();
		for (let i = 0; i < this._indexMap.length; i++) {
			inverseIndexMap[this._indexMap[i]] = i;
		}
		return new Permutation(inverseIndexMap);
	}
}

/**
 * Asynchronous variant of `Array.find()`, returning the first element in
 * the array for which the predicate returns true.
 *
 * This implementation does not bail early and waits for all promises to
 * resolve before returning.
 */
export async function findAsync<T>(array: readonly T[], predicate: (element: T, index: number) => Promise<boolean>): Promise<T | undefined> {
	const results = await Promise.all(array.map(
		async (element, index) => ({ element, ok: await predicate(element, index) })
	));

	return results.find(r => r.ok)?.element;
}

export function sum(array: readonly number[]): number {
	return array.reduce((acc, value) => acc + value, 0);
}

export function sumBy<T>(array: readonly T[], selector: (value: T) => number): number {
	return array.reduce((acc, value) => acc + selector(value), 0);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/arraysFind.ts]---
Location: vscode-main/src/vs/base/common/arraysFind.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Comparator } from './arrays.js';

export function findLast<T, R extends T>(array: readonly T[], predicate: (item: T, index: number) => item is R, fromIndex?: number): R | undefined;
export function findLast<T>(array: readonly T[], predicate: (item: T, index: number) => unknown, fromIndex?: number): T | undefined;
export function findLast<T>(array: readonly T[], predicate: (item: T, index: number) => unknown, fromIndex = array.length - 1): T | undefined {
	const idx = findLastIdx(array, predicate, fromIndex);
	if (idx === -1) {
		return undefined;
	}
	return array[idx];
}

export function findLastIdx<T>(array: readonly T[], predicate: (item: T, index: number) => unknown, fromIndex = array.length - 1): number {
	for (let i = fromIndex; i >= 0; i--) {
		const element = array[i];

		if (predicate(element, i)) {
			return i;
		}
	}

	return -1;
}

export function findFirst<T, R extends T>(array: readonly T[], predicate: (item: T, index: number) => item is R, fromIndex?: number): R | undefined;
export function findFirst<T>(array: readonly T[], predicate: (item: T, index: number) => unknown, fromIndex?: number): T | undefined;
export function findFirst<T>(array: readonly T[], predicate: (item: T, index: number) => unknown, fromIndex = 0): T | undefined {
	const idx = findFirstIdx(array, predicate, fromIndex);
	if (idx === -1) {
		return undefined;
	}
	return array[idx];
}

export function findFirstIdx<T>(array: readonly T[], predicate: (item: T, index: number) => unknown, fromIndex = 0): number {
	for (let i = fromIndex; i < array.length; i++) {
		const element = array[i];

		if (predicate(element, i)) {
			return i;
		}
	}

	return -1;
}

/**
 * Finds the last item where predicate is true using binary search.
 * `predicate` must be monotonous, i.e. `arr.map(predicate)` must be like `[true, ..., true, false, ..., false]`!
 *
 * @returns `undefined` if no item matches, otherwise the last item that matches the predicate.
 */
export function findLastMonotonous<T>(array: readonly T[], predicate: (item: T) => boolean): T | undefined {
	const idx = findLastIdxMonotonous(array, predicate);
	return idx === -1 ? undefined : array[idx];
}

/**
 * Finds the last item where predicate is true using binary search.
 * `predicate` must be monotonous, i.e. `arr.map(predicate)` must be like `[true, ..., true, false, ..., false]`!
 *
 * @returns `startIdx - 1` if predicate is false for all items, otherwise the index of the last item that matches the predicate.
 */
export function findLastIdxMonotonous<T>(array: readonly T[], predicate: (item: T) => boolean, startIdx = 0, endIdxEx = array.length): number {
	let i = startIdx;
	let j = endIdxEx;
	while (i < j) {
		const k = Math.floor((i + j) / 2);
		if (predicate(array[k])) {
			i = k + 1;
		} else {
			j = k;
		}
	}
	return i - 1;
}

/**
 * Finds the first item where predicate is true using binary search.
 * `predicate` must be monotonous, i.e. `arr.map(predicate)` must be like `[false, ..., false, true, ..., true]`!
 *
 * @returns `undefined` if no item matches, otherwise the first item that matches the predicate.
 */
export function findFirstMonotonous<T>(array: readonly T[], predicate: (item: T) => boolean): T | undefined {
	const idx = findFirstIdxMonotonousOrArrLen(array, predicate);
	return idx === array.length ? undefined : array[idx];
}

/**
 * Finds the first item where predicate is true using binary search.
 * `predicate` must be monotonous, i.e. `arr.map(predicate)` must be like `[false, ..., false, true, ..., true]`!
 *
 * @returns `endIdxEx` if predicate is false for all items, otherwise the index of the first item that matches the predicate.
 */
export function findFirstIdxMonotonousOrArrLen<T>(array: readonly T[], predicate: (item: T) => boolean, startIdx = 0, endIdxEx = array.length): number {
	let i = startIdx;
	let j = endIdxEx;
	while (i < j) {
		const k = Math.floor((i + j) / 2);
		if (predicate(array[k])) {
			j = k;
		} else {
			i = k + 1;
		}
	}
	return i;
}

export function findFirstIdxMonotonous<T>(array: readonly T[], predicate: (item: T) => boolean, startIdx = 0, endIdxEx = array.length): number {
	const idx = findFirstIdxMonotonousOrArrLen(array, predicate, startIdx, endIdxEx);
	return idx === array.length ? -1 : idx;
}

/**
 * Use this when
 * * You have a sorted array
 * * You query this array with a monotonous predicate to find the last item that has a certain property.
 * * You query this array multiple times with monotonous predicates that get weaker and weaker.
 */
export class MonotonousArray<T> {
	public static assertInvariants = false;

	private _findLastMonotonousLastIdx = 0;
	private _prevFindLastPredicate: ((item: T) => boolean) | undefined;

	constructor(private readonly _array: readonly T[]) {
	}

	/**
	 * The predicate must be monotonous, i.e. `arr.map(predicate)` must be like `[true, ..., true, false, ..., false]`!
	 * For subsequent calls, current predicate must be weaker than (or equal to) the previous predicate, i.e. more entries must be `true`.
	 */
	findLastMonotonous(predicate: (item: T) => boolean): T | undefined {
		if (MonotonousArray.assertInvariants) {
			if (this._prevFindLastPredicate) {
				for (const item of this._array) {
					if (this._prevFindLastPredicate(item) && !predicate(item)) {
						throw new Error('MonotonousArray: current predicate must be weaker than (or equal to) the previous predicate.');
					}
				}
			}
			this._prevFindLastPredicate = predicate;
		}

		const idx = findLastIdxMonotonous(this._array, predicate, this._findLastMonotonousLastIdx);
		this._findLastMonotonousLastIdx = idx + 1;
		return idx === -1 ? undefined : this._array[idx];
	}
}

/**
 * Returns the first item that is equal to or greater than every other item.
*/
export function findFirstMax<T>(array: readonly T[], comparator: Comparator<T>): T | undefined {
	if (array.length === 0) {
		return undefined;
	}

	let max = array[0];
	for (let i = 1; i < array.length; i++) {
		const item = array[i];
		if (comparator(item, max) > 0) {
			max = item;
		}
	}
	return max;
}

/**
 * Returns the last item that is equal to or greater than every other item.
*/
export function findLastMax<T>(array: readonly T[], comparator: Comparator<T>): T | undefined {
	if (array.length === 0) {
		return undefined;
	}

	let max = array[0];
	for (let i = 1; i < array.length; i++) {
		const item = array[i];
		if (comparator(item, max) >= 0) {
			max = item;
		}
	}
	return max;
}

/**
 * Returns the first item that is equal to or less than every other item.
*/
export function findFirstMin<T>(array: readonly T[], comparator: Comparator<T>): T | undefined {
	return findFirstMax(array, (a, b) => -comparator(a, b));
}

export function findMaxIdx<T>(array: readonly T[], comparator: Comparator<T>): number {
	if (array.length === 0) {
		return -1;
	}

	let maxIdx = 0;
	for (let i = 1; i < array.length; i++) {
		const item = array[i];
		if (comparator(item, array[maxIdx]) > 0) {
			maxIdx = i;
		}
	}
	return maxIdx;
}

/**
 * Returns the first mapped value of the array which is not undefined.
 */
export function mapFindFirst<T, R>(items: Iterable<T>, mapFn: (value: T) => R | undefined): R | undefined {
	for (const value of items) {
		const mapped = mapFn(value);
		if (mapped !== undefined) {
			return mapped;
		}
	}

	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/assert.ts]---
Location: vscode-main/src/vs/base/common/assert.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BugIndicatingError, onUnexpectedError } from './errors.js';

/**
 * Throws an error with the provided message if the provided value does not evaluate to a true Javascript value.
 *
 * @deprecated Use `assert(...)` instead.
 * This method is usually used like this:
 * ```ts
 * import * as assert from 'vs/base/common/assert';
 * assert.ok(...);
 * ```
 *
 * However, `assert` in that example is a user chosen name.
 * There is no tooling for generating such an import statement.
 * Thus, the `assert(...)` function should be used instead.
 */
export function ok(value?: unknown, message?: string) {
	if (!value) {
		throw new Error(message ? `Assertion failed (${message})` : 'Assertion Failed');
	}
}

export function assertNever(value: never, message = 'Unreachable'): never {
	throw new Error(message);
}

export function softAssertNever(value: never): void {
	// no-op
}

/**
 * Asserts that a condition is `truthy`.
 *
 * @throws provided {@linkcode messageOrError} if the {@linkcode condition} is `falsy`.
 *
 * @param condition The condition to assert.
 * @param messageOrError An error message or error object to throw if condition is `falsy`.
 */
export function assert(
	condition: boolean,
	messageOrError: string | Error = 'unexpected state',
): asserts condition {
	if (!condition) {
		// if error instance is provided, use it, otherwise create a new one
		const errorToThrow = typeof messageOrError === 'string'
			? new BugIndicatingError(`Assertion Failed: ${messageOrError}`)
			: messageOrError;

		throw errorToThrow;
	}
}

/**
 * Like assert, but doesn't throw.
 */
export function softAssert(condition: boolean, message = 'Soft Assertion Failed'): void {
	if (!condition) {
		onUnexpectedError(new BugIndicatingError(message));
	}
}

/**
 * condition must be side-effect free!
 */
export function assertFn(condition: () => boolean): void {
	if (!condition()) {
		// eslint-disable-next-line no-debugger
		debugger;
		// Reevaluate `condition` again to make debugging easier
		condition();
		onUnexpectedError(new BugIndicatingError('Assertion Failed'));
	}
}

export function checkAdjacentItems<T>(items: readonly T[], predicate: (item1: T, item2: T) => boolean): boolean {
	let i = 0;
	while (i < items.length - 1) {
		const a = items[i];
		const b = items[i + 1];
		if (!predicate(a, b)) {
			return false;
		}
		i++;
	}
	return true;
}
```

--------------------------------------------------------------------------------

````
